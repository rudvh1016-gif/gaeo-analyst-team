# -*- coding: utf-8 -*-
"""GAEO Evolution — 대표에게 보내는 주간 실행 보고 (GitHub Issue 알림 Builder).

역할 경계(중요):
  · 이 모듈은 "Harness 상태 → 알림 내용" 방향으로만 흐른다.
    candidates.json/production_config.json/registry 등 어떤 Harness 상태도
    읽는 이 모듈이 직접 쓰거나 바꾸지 않는다(registry·production_config·gate의
    approve_production/execute_rollback을 import하지도, 호출하지도 않는다).
  · GitHub API 호출(이슈 생성·assignee·검색)은 이 모듈이 하지 않는다.
    워크플로우(.github/workflows/evolution-lab.yml)의 `gh` CLI 단계가 담당한다.
    이 모듈은 순수 함수로 제목·본문·레벨·중복방지 marker만 결정론적으로 만든다
    (LLM 호출 없음, 네트워크 호출 없음 — 입력 파일만 읽는다).
  · 숫자를 추측하지 않는다. 값이 없으면 "측정값 없음"이라고 적는다.

분류 우선순위(항상 RED > ORANGE > GREEN — 문제를 절대 숨기지 않는다):
  RED    실행 오류(계약 테스트·연구 실행·커밋 단계 실패) 또는 SAFE_MODE/DEGRADED
  ORANGE 정상 완료 + QUALIFIED_AWAITING_APPROVAL 후보 존재
  GREEN  정상 완료 + 승인할 후보 없음
"""
import datetime
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

KST = datetime.timezone(datetime.timedelta(hours=9))

LEVEL_GREEN = "GREEN"
LEVEL_ORANGE = "ORANGE"
LEVEL_RED = "RED"

_EMOJI = {LEVEL_GREEN: "🟢", LEVEL_ORANGE: "🟠", LEVEL_RED: "🔴"}
_TITLE_LABEL = {LEVEL_GREEN: "주간 연구 정상 완료", LEVEL_ORANGE: "대표 승인 필요",
               LEVEL_RED: "점검 필요"}

MAX_REASON_LEN = 200        # 사유 문자열 하나당 상한(긴 내부 예외 텍스트 방어)
MAX_REASONS_SHOWN = 5

# 독립 Security 검토 MEDIUM 대응(2026-08-23): 현재 상류 코드(constitution.py/
# gate.py/production_config.py)는 관례상 안전한 문자열만 만들지만, "관례"는
# 보장이 아니다. 자유 텍스트(사유·가설)가 이 모듈을 거칠 때 알려진 Secret
# 형식이 섞여 있으면 한 번 더 구조적으로 가려낸다. Candidate fingerprint 같은
# 정식 필드는 이 함수를 거치지 않으므로 그대로 표시된다(오탐 방지).
_SECRET_PATTERNS = [
    re.compile(r"sk-[A-Za-z0-9_-]{16,}"),                 # OpenAI/Anthropic류 API 키
    re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}"),            # GitHub 개인토큰(ghp_/gho_/ghu_/ghs_/ghr_)
    re.compile(r"github_pat_[A-Za-z0-9_]{20,}"),          # GitHub fine-grained PAT
    re.compile(r"AKIA[0-9A-Z]{12,}"),                      # AWS Access Key ID
    re.compile(r"xox[baprs]-[A-Za-z0-9-]{10,}"),           # Slack 토큰
    re.compile(r"(?i)bearer\s+[A-Za-z0-9._-]{10,}"),       # Authorization: Bearer <token>
]


def _redact_secrets(text):
    """알려진 Secret 형식을 [REDACTED]로 가린다. Fingerprint·git sha 같은 정상
    16진수 값은 위 패턴에 걸리지 않으므로 그대로 남는다."""
    text = str(text)
    for pattern in _SECRET_PATTERNS:
        text = pattern.sub("[REDACTED]", text)
    return text


def today_kst():
    return datetime.datetime.now(KST).date().isoformat()


def _read_json_safe(path):
    """읽기 실패는 예외를 던지지 않고 None — 알림 자체가 죽으면 안 된다."""
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def _fmt(value, suffix=""):
    """None → '측정값 없음'(단위 접미사 없이). 값이 있을 때만 suffix를 붙인다."""
    if value is None:
        return "측정값 없음"
    return f"{value}{suffix}"


def _fmt_count(value, unit="개"):
    """개수 표기 전용 — 없으면 '측정값 없음', 있으면 '<n>개'."""
    return "측정값 없음" if value is None else f"{value}{unit}"


def _truncate(text, limit=MAX_REASON_LEN):
    text = _redact_secrets(text)
    return text if len(text) <= limit else text[:limit] + "…(생략)"


def decide_level(*, job_failed, status_doc, promotion_cards_doc,
                 coverage_unmeasured=False):
    """실제 실행 결과만으로 결정론적으로 분류한다. 셋 중 정확히 하나를 돌려준다.

    coverage_unmeasured: 이번 Run이 Coverage 산출물을 실제로 만들지 못한 경우.
        Coverage는 Evolution 연구를 막지 않지만(대표 지시 §4 — 서로 다른 시스템),
        '측정 못 했는데 지난 숫자로 🟢'가 되는 것도 막아야 한다. 그래서 커밋 경로는
        건드리지 않고 **보고 등급만** RED로 올린다.
    """
    if job_failed:
        return LEVEL_RED
    if coverage_unmeasured:
        return LEVEL_RED
    # 스키마가 어긋난 입력(dict가 아닌 값)은 '읽지 못함'과 동일하게 취급한다
    # (독립 QA 검토 LOW 대응, 2026-08-23) — 손상된 status.json이 들어와도
    # AttributeError로 죽지 않고 정직하게 RED(문제 있음)로 판정한다.
    if not isinstance(status_doc, dict):
        return LEVEL_RED
    if not isinstance(promotion_cards_doc, dict):
        promotion_cards_doc = None
    health = status_doc.get("systemHealth")
    if health in ("SAFE_MODE", "DEGRADED"):
        return LEVEL_RED
    qualified_n = (status_doc.get("candidateCounts") or {}).get(
        "QUALIFIED_AWAITING_APPROVAL", 0)
    cards = (promotion_cards_doc or {}).get("cards") or []
    if qualified_n or cards:
        return LEVEL_ORANGE
    return LEVEL_GREEN


def build_title(level, today=None):
    today = today or today_kst()
    return f"{_EMOJI[level]} [GAEO Evolution] {_TITLE_LABEL[level]} — {today}"


def _summarize_event(event, kind):
    """lastPromotion/lastRollback dict를 사람이 읽을 한 줄로 — 실측 필드만 쓴다.

    candidateId/approvedBy는 기계가 아니라 사람이 spec을 직접 쓰거나
    승인 명령을 손으로 실행할 때 채워지는 경로도 있어(독립 Security 검토
    LOW, 2026-08-23) hypothesis와 같은 위험군으로 보고 _truncate(Secret
    패턴 마스킹 포함)를 거치게 한다."""
    if not event:
        return "없음"
    if kind == "promotion":
        return (f"{_truncate(event.get('candidateId', '측정값 없음'))} "
                f"(승인: {_truncate(event.get('approvedBy', '측정값 없음'))}, "
                f"{event.get('promotedAt', '측정값 없음')})")
    # rollback
    reasons = event.get("reasons") or []
    reason_text = "; ".join(_truncate(r) for r in reasons[:3]) or "측정값 없음"
    return f"{_truncate(event.get('candidateId', '측정값 없음'))} — 사유: {reason_text}"


def build_green_body(*, owner, status_doc, candidate_generation):
    s = status_doc
    baseline = s.get("baselineSummary") or {}
    eval_text = (f"{baseline.get('n')}건 · {baseline.get('uniqueDays')}일"
                if baseline.get("n") else "측정값 없음")
    gen = candidate_generation or {}
    shadow_n = len(s["shadowSummaries"]) if s.get("shadowSummaries") is not None else None
    lines = [
        f"@{owner}",
        "",
        "GAEO Evolution 주간 연구가 정상적으로 끝났습니다.",
        "",
        "이번 주 승인할 후보는 없습니다.",
        "현재 GAEO 설정은 그대로 유지됩니다.",
        "",
        "실행 결과:",
        "- 상태: 정상",
        f"- 평가 데이터: {eval_text}",
        f"- 발견한 실패 패턴: {_fmt_count(s.get('failureClusterCount'))}",
        f"- 생성한 후보: {_fmt_count(gen.get('generatedCount'))}",
        f"- Shadow 진행 후보: {_fmt_count(shadow_n)}",
        "- 승인 대기 후보: 0",
        f"- Production 변경: {_summarize_event(s.get('lastPromotion'), 'promotion')}",
        f"- Rollback 발생: {_summarize_event(s.get('lastRollback'), 'rollback')}",
        f"- 시스템 상태: {s.get('systemHealth', '측정값 없음')}",
    ]
    return "\n".join(lines)


def _card_block(card):
    """승격 카드 dict(gate.build_promotion_card + run_evolution_lab의 _meta 보강)를
    한 후보 블록으로 렌더링한다. 값은 전부 실측값이며, 없으면 원본이 '측정값 없음'."""
    meta = card.get("_meta") or {}

    def g(key, default="측정값 없음"):
        return card.get(key, default)

    lines = [
        f"### Candidate: {_truncate(g('후보'))}",
        f"- Experiment Serial: {g('실험번호')}",
        f"- 변경 내용(가설): {_truncate(g('가설'))}",
        f"- Candidate fingerprint: `{meta.get('fingerprint') or '측정값 없음'}`",
        f"- Shadow 기간: {g('Shadow기간')}",
        f"- 실전 표본: {g('실전표본')}",
        f"- 행동 표본: {_fmt(meta.get('actionN'))}",
        f"- 현재 Production 성능: {g('기존성능')}",
        f"- Candidate 성능: {g('후보성능')}",
        f"- 실제 개선폭: {g('개선')} (일평균 {g('일평균개선')})",
        f"- BUY 변화: {g('BUY')}",
        f"- SELL 변화: {g('SELL')}",
        f"- 큰 오답 변화: {g('큰오답')}",
        f"- 시장국면 보호: {g('시장국면')}",
        f"- 방향편중: {_fmt(meta.get('directionSharePct'), '%')}",
        f"- Coverage: {_fmt(meta.get('coveragePct'), '%')}",
        f"- 통계 Gate 판정: {g('기계판정')}",
        f"- Rollback 준비 여부: {g('Rollback준비')}",
        f"- 현재 상태: {meta.get('status') or '측정값 없음'}",
    ]
    return "\n".join(lines)


def build_orange_body(*, owner, cards):
    lines = [
        f"@{owner}",
        "",
        "GAEO Evolution 후보가 자동 안전시험을 통과해 대표 승인을 기다리고 있습니다.",
        "",
        "아직 실제 GAEO에는 적용되지 않았습니다.",
        "대표 승인 전에는 Production 판단이 변경되지 않습니다.",
        "",
    ]
    for card in cards:
        lines.append(_card_block(card))
        lines.append("")
    lines.append("숫자는 전부 실측값이며, 승률·수익을 보장하지 않습니다.")
    return "\n".join(lines)


def build_red_body(*, owner, failed_step, reasons, run_url, note=None):
    lines = [
        f"@{owner}",
        "",
        "이번 Evolution 실행에서 문제가 발생했습니다.",
        "안전장치가 정상 연구 완료 처리를 막았습니다.",
        "",
        f"- 실패 단계: {failed_step or '측정값 없음'}",
    ]
    if reasons:
        shown = [_truncate(r) for r in reasons[:MAX_REASONS_SHOWN]]
        lines.append(f"- 오류 종류: {'; '.join(shown)}")
    else:
        lines.append("- 오류 종류: 측정값 없음 (자세한 내용은 GitHub Actions 로그 확인)")
    if note:
        lines.append(f"- 참고: {note}")
    lines += ["- Production 자동승격: 없음", "- 대표 확인 필요: 예", ""]
    if run_url:
        lines.append(f"실행 로그: {run_url}")
        lines.append("")
    lines.append("(Secret·토큰·전체 스택트레이스는 이 알림에 포함하지 않습니다.)")
    return "\n".join(lines)


def build_marker(run_id):
    return f"gaeo-evolution-run:{run_id}"


# ── Coverage 산출물이 '이번 Run 것'인가 (2026-08-25 보안 재감사 LOW-1·LOW-3) ──
# 왜 여기서 보나
#   Coverage 측정 실패가 Evolution 연구 커밋을 막으면 안 된다(대표 지시 §4 — 둘은
#   서로 다른 시스템이다). 그래서 워크플로우의 Coverage 단계는 무슨 일이 있어도
#   job을 죽이지 않게 두고, "이번 Run이 실제로 측정했는가"는 **알림을 만드는 이 자리**
#   에서 판정한다. 커밋 경로는 그대로 두고 보고 등급만 RED로 올리는 방식이다.
# 왜 날짜가 아니라 Run 식별자인가
#   상태 파일은 저장소에 커밋되므로 '오늘 날짜' 산출물이 이미 있을 수 있다(같은 날
#   앞선 run이 성공한 경우). 날짜만 보면 이번 run이 통째로 실패해도 통과한다.
#   Run 식별자(GITHUB_RUN_ID-ATTEMPT)를 각인해 비교하면 그 구멍이 닫힌다.
#   로컬 실행처럼 식별자가 없을 때만 날짜로 대신 본다.
COVERAGE_ARTIFACT_LABELS = {
    "coverage": "Coverage 관측(coverage_state.json)",
    "standby": "대기 명단(standby_pool.json)",
    "proposal": "교체 제안(replacement_proposal.json)",
}


def coverage_freshness(docs, *, expected_run_id=None, today=None):
    """(측정됨 여부, 사유목록)을 돌려준다. 파일을 읽거나 쓰지 않는 순수 함수다."""
    reasons = []
    for key in ("coverage", "standby", "proposal"):
        label = COVERAGE_ARTIFACT_LABELS[key]
        doc = docs.get(key) if isinstance(docs, dict) else None
        if not isinstance(doc, dict):
            reasons.append(f"{label}: 이번 Run 산출물이 없습니다")
            continue
        if expected_run_id:
            got = doc.get("runId")
            if str(got or "") != str(expected_run_id):
                reasons.append(f"{label}: 이번 Run({expected_run_id})이 아니라 "
                               f"{_truncate(str(got or '식별자 없음'))} 산출물입니다")
            continue
        if today:
            got_day = str(doc.get("generatedAt") or "")[:10]
            if got_day != str(today)[:10]:
                reasons.append(f"{label}: 이번 Run 날짜({today})가 아니라 "
                               f"{got_day or '알 수 없음'} 산출물입니다")
    return (not reasons), reasons


def build_coverage_red_body(*, owner, reasons, run_url):
    """연구는 정상인데 Coverage만 측정 못 한 경우의 본문.

    기존 RED 본문("안전장치가 정상 연구 완료 처리를 막았습니다")을 그대로 쓰면
    사실과 다르다. 연구는 끝났고 기록도 커밋됐다. 그래서 문구를 따로 둔다.
    """
    lines = [
        f"@{owner}",
        "",
        "Evolution 주간 연구 자체는 끝났지만, 이번 Run에서 **Coverage 실측을 하지 "
        "못했습니다.**",
        "",
        "아래 Coverage 숫자는 이번 주 측정값이 아니거나 아예 없습니다. "
        "그 숫자를 근거로 판단하지 마세요.",
        "",
    ]
    if reasons:
        for reason in reasons[:MAX_REASONS_SHOWN]:
            lines.append(f"- {_truncate(reason)}")
    else:
        lines.append("- 사유: 측정값 없음")
    lines += [
        "",
        "- Evolution 연구 기록: 정상 커밋됨 (Coverage 실패가 연구 커밋을 막지 않습니다)",
        "- Production 자동승격: 없음",
        "- 종목집합(tickers.js) 자동 변경: 없음",
        "- 대표 확인 필요: 예",
        "",
    ]
    if run_url:
        lines.append(f"실행 로그: {run_url}")
        lines.append("")
    lines.append("(Secret·토큰·전체 스택트레이스는 이 알림에 포함하지 않습니다.)")
    return "\n".join(lines)


# ── GAEO SYSTEM HEALTH 섹션 (2026-08-25 추가) ────────────────────────────────
# ⚠️ 이 모듈의 격리 규칙은 그대로다 — gaeo_coverage/gaeo_reference를 import하지
#    않는다. 두 계층이 **이미 만들어 둔 JSON**을 워크플로우가 읽어서 dict로
#    넘겨주면, 여기서는 문자열로 옮겨 적기만 한다(계산·판정·쓰기 없음).
def _coverage_block(doc, today=None, expected_run_id=None):
    if not isinstance(doc, dict):
        return ["- 상태: 측정값 없음 (Coverage 관측 결과를 읽지 못함)",
                "- ⚠️ 이번 Run에서 Coverage를 측정하지 못했습니다. 아래 숫자는 없습니다."]
    generated = doc.get("generatedAt")
    lines = []
    # ⚠️ 상태 파일은 저장소에 커밋되므로 '지난주 값'이 항상 존재한다. 이번 Run에서
    #    측정이 실패해도 그 숫자가 이번 주 결과처럼 보이면 안 된다
    #    (2026-08-25 보안 감사 MEDIUM — 2026-08-23의 stale→거짓 GREEN과 같은 계열).
    if expected_run_id:
        stale = str(doc.get("runId") or "") != str(expected_run_id)
        stale_note = (f"- ⚠️ 이번 Run({expected_run_id}) 산출물이 아닙니다"
                      f"(각인된 값: {_truncate(str(doc.get('runId') or '없음'))}). "
                      "**이번 주 미측정**이며 아래 숫자는 지난 측정값입니다.")
    else:
        stale = bool(today) and str(generated or "")[:10] != str(today)[:10]
        stale_note = (f"- ⚠️ 이번 Run 날짜({today})와 다릅니다. **이번 주 미측정**이며 "
                      "아래 숫자는 지난 측정값입니다.")
    lines.append(f"- 측정 시각: {_fmt(generated)} · Run 식별자: "
                 f"{_truncate(str(doc.get('runId') or '없음'))}")
    if stale:
        lines.append(stale_note)
    cause_counts = doc.get("causeCounts") or {}
    cause_text = ", ".join(f"{_truncate(str(k))} {v}건"
                           for k, v in sorted(cause_counts.items())) or "없음"
    snapshot = doc.get("snapshot") or {}
    independent = doc.get("independentSource") or {}
    rules = doc.get("delistingRules") or {}
    # RED로 올리지는 않지만 절대 숨기지도 않는다 — 무엇이 몇 건인지 그대로 적는다.
    attention_counts = doc.get("attentionCauseCounts") or {}
    attention_text = ""
    if attention_counts:
        attention_text = " (" + ", ".join(f"{_truncate(str(k))} {v}건"
                                          for k, v in sorted(attention_counts.items())) + ")"
    lines += [
        f"- 상태: {doc.get('status', '측정값 없음')}",
        f"- 목표 Universe(targetCoverage): {_fmt_count(doc.get('targetCoverage'), '종목')}"
        f" · Coverage Version {doc.get('coverageVersion', '측정값 없음')}",
        f"- tickers.js 설정(configuredCoverage): "
        f"{_fmt_count(doc.get('configuredCoverage'), '종목')}",
        f"- 시세 수신(freshPriceCoverage): "
        f"{_fmt_count(doc.get('freshPriceCoverage'), '종목')}",
        f"- 자동분석(autoAnalysisCoverage): "
        f"{_fmt_count(doc.get('autoAnalysisCoverage'), '종목')}",
        f"- 시세 누락: {_fmt_count(len(doc.get('missingPriceCodes') or []), '종목')}"
        f" (원인별: {cause_text})",
        f"- 교체 검토 대상(확정 상장폐지): {_fmt_count(doc.get('replaceableCount'), '종목')}",
        f"- 참조 snapshot: {snapshot.get('asOf', '측정값 없음')} "
        f"(경과 {_fmt(snapshot.get('ageDays'), '일')} · "
        f"상장폐지 판정 가능 {snapshot.get('freshEnoughForDelisting')})",
        f"- 독립 확인 소스(KRX 상장법인목록): 사용가능 {independent.get('available')} · "
        f"수집 {independent.get('asOf', '측정값 없음')} "
        f"(경과 {_fmt(independent.get('ageDays'), '일')} · "
        f"기준 충족 {independent.get('freshEnough')})",
        # ⚠️ 아래 목록은 gaeo_coverage/guardian.py의 classify_missing()이 실제로
        #    보는 조건과 하나도 빠짐없이 같아야 한다. 알림이 실제보다 헐겁게 적히면
        #    대표가 "이 정도 조건이면 확정이구나"를 잘못 이해한다
        #    (2026-08-25 퀀트 재감사 MEDIUM).
        "- 상장폐지 확정 조건 (아래를 **전부** 만족할 때만 확정, 하나라도 미충족이면 확정하지 않음):",
        f"  ① 전체시장 snapshot에 없음 + 그 snapshot이 "
        f"{_fmt_count(rules.get('snapshotMaxAgeDays'), '일')} 이내로 최신",
        f"  ② **시장 자료에서 그 종목이 안 보인 날**이 서로 다른 날짜로 "
        f"{_fmt_count(rules.get('persistentMissingMinDays'), '일')} 이상",
        f"  ③ **시장 자료에서 처음 사라진 날**부터 "
        f"{_fmt_count(rules.get('minElapsedTradingDays'), '거래일')} 이상 경과 "
        f"(우리 시세가 안 들어온 기간이 아무리 길어도 이 조건을 대신하지 못함)",
        f"  ④ 같은 사이클에 "
        f"{_fmt_count(rules.get('massMissingBlock'), '종목')} 이상이 동시에 빠지지 않음",
        f"  ⑤ 살아 있을 때 확인해 둔 시가총액 순위가 있고, 그 순위가 상위 "
        f"{_fmt_count(rules.get('megaCapRankGuard'), '위')} 밖 "
        f"(순위를 모르면 확정하지 않고 사람 확인으로 넘김)",
        "  ⑥ 보통주 코드(끝자리 0) — 우선주·종류주는 법인 단위 원장으로 판단할 수 없음",
        f"  ⑦ 독립 원장(KRX 상장법인목록)에도 없음. 그 원장은 "
        f"{_fmt_count(rules.get('krxCorplistMinCount'), '법인')} 이상 + "
        f"{_fmt_count(rules.get('krxCorplistMaxAgeDays'), '일')} 이내 + "
        f"우리가 시세를 못 받기 시작한 시점 이후에 수집된 것이어야 함",
        f"- 동시 대량 누락 차단(벤더 장애 방어) 발동: {doc.get('massMissingBlockActive')}",
        f"- 사람 확인이 필요하지만 즉시 위험은 아닌 건: "
        f"{_fmt_count(doc.get('attentionCount'), '건')}{attention_text}",
        "- Universe 해석: configuredCoverage가 Universe 크기다. "
        "시세·자동분석 숫자가 작다고 Universe가 줄어든 것이 아니다.",
    ]
    for finding in (doc.get("findings") or [])[:10]:
        lines.append(
            f"  · {finding.get('code')} {_truncate(str(finding.get('name')))} "
            f"({finding.get('market') or '시장미상'}) → {finding.get('cause')} "
            f"(시세누락 {_fmt_count(finding.get('missingDayCount'), '일')}/경과 "
            f"{_fmt_count(finding.get('elapsedTradingDays'), '거래일')} · "
            f"시장부재 {_fmt_count(finding.get('absentDayCount'), '일')}/경과 "
            f"{_fmt_count(finding.get('elapsedAbsentTradingDays'), '거래일')} · "
            f"fingerprint `{finding.get('fingerprint') or '측정값 없음'}`)")
    return lines


def _standby_proposal_block(standby_doc, proposal_doc):
    lines = []
    if isinstance(standby_doc, dict):
        lines.append(
            f"- 대기 명단(Standby): {_fmt_count(standby_doc.get('candidateCount'))} "
            f"(자격 통과 {_fmt_count(standby_doc.get('eligibleCount'))} · "
            f"상태 {standby_doc.get('status', '측정값 없음')})")
    else:
        lines.append("- 대기 명단(Standby): 측정값 없음")
    if isinstance(proposal_doc, dict):
        lines.append(f"- 교체 제안: {proposal_doc.get('status', '측정값 없음')} "
                     f"({_truncate(str(proposal_doc.get('reason', '측정값 없음')))})")
        lines.append(f"- tickers.js 자동 반영: "
                     f"{'있음' if proposal_doc.get('appliedToTickers') else '없음'}"
                     " (승인 전에는 종목이 바뀌지 않습니다)")
    else:
        lines.append("- 교체 제안: 측정값 없음")
        lines.append("- tickers.js 자동 반영: 없음")
    return lines


GS_SEPARATE_JOB_NOTE = ("이 검산은 evolution-lab workflow의 **별도 job(gs-reference)**"
                        "에서 돕니다. 그 job은 쓰기 권한이 없고(contents: read) git "
                        "자격증명도 갖지 않습니다. 결과는 해당 job의 요약(Job Summary)"
                        "에서 볼 수 있습니다.")


def _gs_block(doc):
    if not isinstance(doc, dict):
        return ["- 상태: N/A (이 알림에는 검산 결과를 싣지 않습니다)",
                f"- 확인 위치: {GS_SEPARATE_JOB_NOTE}",
                "- Production 영향: 없음 (검산 전용 계층이며 판단 경로와 분리돼 있습니다)"]
    design = doc.get("designAssertions") or {}
    return [
        f"- 상태: {doc.get('status', 'N/A')}",
        f"- 사유: {_truncate(str(doc.get('reason', '측정값 없음')))}",
        f"- 검산 케이스: {_fmt_count(doc.get('caseCount'))} · "
        f"일치 {_fmt_count(doc.get('checkPass'), '건')} · "
        f"불일치 {_fmt_count(doc.get('checkWarn'), '건')} · "
        f"미측정 {_fmt_count(doc.get('checkNA'), '건')}",
        f"- 외부 라이브러리 사용 가능: {(doc.get('gsQuant') or {}).get('available')} · "
        f"외부 계산이 실제로 돈 케이스 {_fmt_count(doc.get('gsLegRanCases'))} · "
        f"계산 실패 {_fmt_count(doc.get('checkGsError'), '건')}",
        f"- 실제로 사용한 계산 다리(legsUsed): "
        f"{', '.join(doc.get('legsUsed') or []) or '측정값 없음'}",
        f"- 네트워크 호출: {_truncate(str(design.get('networkCalls', '측정값 없음')))}",
        f"- 인증 사용: {_truncate(str(design.get('credentialsUsed', '측정값 없음')))}",
        f"- Production 의존성: "
        f"{_truncate(str(design.get('isProductionDependency', '측정값 없음')))}",
        f"- 이 검산으로 생성된 Candidate: {_fmt_count(doc.get('candidatesCreated'))}",
        "- 정의 차이(연율화·표본/모집단·퍼센트 단위)는 맞춘 뒤 비교하며, "
        "정의 차이 자체를 불일치로 세지 않습니다.",
    ]


def _evolution_block(status_doc, promotion_cards_doc):
    if not isinstance(status_doc, dict):
        return ["- 상태: 측정값 없음"]
    counts = status_doc.get("candidateCounts") or {}
    cards = (promotion_cards_doc or {}).get("cards") or []
    return [
        f"- 시스템 상태: {status_doc.get('systemHealth', '측정값 없음')}",
        f"- 승인 대기 후보: {_fmt_count(counts.get('QUALIFIED_AWAITING_APPROVAL', 0))}"
        f" (승격 카드 {len(cards)}장)",
        f"- Production 변경: {_summarize_event(status_doc.get('lastPromotion'), 'promotion')}",
        f"- Rollback 발생: {_summarize_event(status_doc.get('lastRollback'), 'rollback')}",
    ]


def build_system_health_section(*, coverage_doc=None, standby_doc=None,
                                proposal_doc=None, gs_doc=None, status_doc=None,
                                promotion_cards_doc=None, today=None,
                                expected_run_id=None):
    """GREEN/ORANGE/RED 본문 끝에 공통으로 붙는 3블록 점검 요약.

    이미 만들어진 상태 파일의 값을 그대로 옮겨 적는다. 여기서 숫자를 새로
    계산하거나 상태 파일을 수정하지 않는다(읽기 전용).
    """
    lines = ["## GAEO SYSTEM HEALTH", "", "### Coverage"]
    lines += _coverage_block(coverage_doc, today=today,
                             expected_run_id=expected_run_id)
    lines += _standby_proposal_block(standby_doc, proposal_doc)
    lines += ["", "### Goldman Reference Check"]
    lines += _gs_block(gs_doc)
    lines += ["", "### Evolution"]
    lines += _evolution_block(status_doc, promotion_cards_doc)
    return "\n".join(lines)


def _as_dict_or_none(value):
    """스키마가 어긋난 입력(dict가 아닌 값)을 '측정값 없음'과 동일하게 취급한다.
    독립 QA 검토 LOW 대응(2026-08-23) — 손상된 status.json/promotion_cards.json이
    들어와도 AttributeError로 죽지 않고 정직하게 RED(문제 있음)로 처리한다."""
    return value if isinstance(value, dict) else None


def build_notification(*, owner, run_id, run_url, job_failed, failed_step=None,
                       status_doc=None, promotion_cards_doc=None,
                       candidate_generation=None, today=None,
                       coverage_doc=None, standby_doc=None, proposal_doc=None,
                       gs_doc=None, expected_run_id=None):
    """전체 알림(제목·본문·레벨·marker)을 결정론적으로 만든다. 순수 함수."""
    status_doc = _as_dict_or_none(status_doc)
    promotion_cards_doc = _as_dict_or_none(promotion_cards_doc)
    coverage_doc = _as_dict_or_none(coverage_doc)
    standby_doc = _as_dict_or_none(standby_doc)
    proposal_doc = _as_dict_or_none(proposal_doc)
    gs_doc = _as_dict_or_none(gs_doc)
    today = today or today_kst()
    # ⚠️ 등급을 RED로 올리는 게이트는 호출자가 이번 Run 식별자를 넘겼을 때만 켠다.
    #    Coverage를 아예 쓰지 않는 호출자(기존 계약 테스트 등)까지 RED로 만들면
    #    "Coverage와 Evolution은 서로 다른 시스템"이라는 분리 원칙에 어긋난다.
    #    워크플로우의 알림 단계는 항상 --expect-run-id를 넘긴다.
    gate_armed = bool(expected_run_id)
    coverage_ok, coverage_reasons = coverage_freshness(
        {"coverage": coverage_doc, "standby": standby_doc, "proposal": proposal_doc},
        expected_run_id=expected_run_id, today=today)
    coverage_unmeasured = gate_armed and not coverage_ok
    level = decide_level(job_failed=job_failed, status_doc=status_doc,
                         promotion_cards_doc=promotion_cards_doc,
                         coverage_unmeasured=coverage_unmeasured)
    title = build_title(level, today=today)
    marker = build_marker(run_id)

    if level == LEVEL_RED and not job_failed and coverage_unmeasured and \
            (status_doc or {}).get("systemHealth") not in ("SAFE_MODE", "DEGRADED"):
        # 연구는 정상, Coverage만 미측정 — 사실대로 다른 본문을 쓴다.
        body = build_coverage_red_body(owner=owner, reasons=coverage_reasons,
                                       run_url=run_url)
    elif level == LEVEL_RED:
        reasons = []
        note = None
        if status_doc is not None:
            reasons = list(status_doc.get("safeModeReasons") or []) + \
                list(status_doc.get("degradedReasons") or [])
            health = status_doc.get("systemHealth")
            if health in ("SAFE_MODE", "DEGRADED") and not failed_step:
                note = f"시스템 상태: {health}"
        if coverage_unmeasured:
            reasons = list(reasons) + list(coverage_reasons)
        body = build_red_body(owner=owner, failed_step=failed_step,
                              reasons=reasons, run_url=run_url, note=note)
    elif level == LEVEL_ORANGE:
        cards = (promotion_cards_doc or {}).get("cards") or []
        body = build_orange_body(owner=owner, cards=cards)
    else:
        body = build_green_body(owner=owner, status_doc=status_doc,
                                candidate_generation=candidate_generation)

    health = build_system_health_section(
        coverage_doc=coverage_doc, standby_doc=standby_doc,
        proposal_doc=proposal_doc, gs_doc=gs_doc, status_doc=status_doc,
        promotion_cards_doc=promotion_cards_doc, today=today,
        expected_run_id=expected_run_id)
    body = f"{body}\n\n{health}\n\n<!-- {marker} -->\n"
    return {"level": level, "title": title, "body": body, "marker": marker}


def main(argv=None):
    """CLI — 워크플로우에서 호출. 파일/환경만 읽고 GitHub API는 절대 호출하지 않는다.

    사용법:
      python3 -m gaeo_evolution.notification build \
        --status PATH --cards PATH --owner OWNER --run-id ID --run-url URL \
        --job-failed true|false [--failed-step NAME] --out OUT.json
    """
    import argparse
    argv = argv if argv is not None else sys.argv[1:]
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="cmd", required=True)
    b = sub.add_parser("build")
    b.add_argument("--status", default=os.path.join(HERE, "status", "evolution_status.json"))
    b.add_argument("--cards", default=os.path.join(HERE, "status", "promotion_cards.json"))
    b.add_argument("--owner", required=True)
    b.add_argument("--run-id", required=True)
    b.add_argument("--run-url", default="")
    b.add_argument("--job-failed", choices=("true", "false"), default="false")
    b.add_argument("--failed-step", default="")
    # GAEO SYSTEM HEALTH 섹션 입력 — 전부 '이미 만들어진 상태 파일'이다.
    # 없으면 '측정값 없음'으로 표시할 뿐, 알림 자체는 정상 생성된다.
    b.add_argument("--coverage", default=os.path.join(
        ROOT, "gaeo_coverage", "state", "coverage_state.json"))
    b.add_argument("--standby", default=os.path.join(
        ROOT, "gaeo_coverage", "state", "standby_pool.json"))
    b.add_argument("--proposal", default=os.path.join(
        ROOT, "gaeo_coverage", "state", "replacement_proposal.json"))
    b.add_argument("--gs", default="")
    b.add_argument("--expect-run-id", default="",
                   help="이번 Run 식별자. Coverage 산출물의 runId와 다르면 RED로 보고한다.")
    b.add_argument("--out", required=True)
    args = parser.parse_args(argv)

    status_doc = _read_json_safe(args.status)
    cards_doc = _read_json_safe(args.cards)
    coverage_doc = _read_json_safe(args.coverage)
    standby_doc = _read_json_safe(args.standby)
    proposal_doc = _read_json_safe(args.proposal)
    gs_doc = _read_json_safe(args.gs) if args.gs else None
    # build_notification() 안의 dict 가드보다 먼저 status_doc을 만지므로 여기서도
    # 같은 가드를 미리 적용한다 — 그러지 않으면 status_doc이 dict가 아닌 참(truthy)
    # 값(예: 빈 리스트가 아닌 리스트)일 때 여기서 먼저 AttributeError로 죽는다
    # (독립 QA 재검토 LOW, 2026-08-23 — 워크플로우 폴백이 항상 흡수해 최종 사용자
    # 결과는 안전했지만, 커버리지 공백을 남겨 정식으로 막는다).
    safe_status_doc = _as_dict_or_none(status_doc)
    candidate_generation = (safe_status_doc or {}).get("candidateGeneration")

    result = build_notification(
        owner=args.owner, run_id=args.run_id, run_url=args.run_url,
        job_failed=(args.job_failed == "true"),
        failed_step=args.failed_step or None,
        status_doc=status_doc, promotion_cards_doc=cards_doc,
        candidate_generation=candidate_generation,
        coverage_doc=coverage_doc, standby_doc=standby_doc,
        proposal_doc=proposal_doc, gs_doc=gs_doc,
        expected_run_id=args.expect_run_id or None)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
    print(f"[notification] level={result['level']} title={result['title']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
