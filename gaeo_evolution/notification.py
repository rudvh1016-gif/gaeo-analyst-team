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


def decide_level(*, job_failed, status_doc, promotion_cards_doc):
    """실제 실행 결과만으로 결정론적으로 분류한다. 셋 중 정확히 하나를 돌려준다."""
    if job_failed:
        return LEVEL_RED
    if status_doc is None:
        # 실행은 성공했다는데 결과 파일을 못 읽으면 정직하게 문제로 본다.
        return LEVEL_RED
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


def build_notification(*, owner, run_id, run_url, job_failed, failed_step=None,
                       status_doc=None, promotion_cards_doc=None,
                       candidate_generation=None, today=None):
    """전체 알림(제목·본문·레벨·marker)을 결정론적으로 만든다. 순수 함수."""
    level = decide_level(job_failed=job_failed, status_doc=status_doc,
                         promotion_cards_doc=promotion_cards_doc)
    title = build_title(level, today=today)
    marker = build_marker(run_id)

    if level == LEVEL_RED:
        reasons = []
        note = None
        if status_doc is not None:
            reasons = list(status_doc.get("safeModeReasons") or []) + \
                list(status_doc.get("degradedReasons") or [])
            health = status_doc.get("systemHealth")
            if health in ("SAFE_MODE", "DEGRADED") and not failed_step:
                note = f"시스템 상태: {health}"
        body = build_red_body(owner=owner, failed_step=failed_step,
                              reasons=reasons, run_url=run_url, note=note)
    elif level == LEVEL_ORANGE:
        cards = (promotion_cards_doc or {}).get("cards") or []
        body = build_orange_body(owner=owner, cards=cards)
    else:
        body = build_green_body(owner=owner, status_doc=status_doc,
                                candidate_generation=candidate_generation)

    body = f"{body}\n\n<!-- {marker} -->\n"
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
    b.add_argument("--out", required=True)
    args = parser.parse_args(argv)

    status_doc = _read_json_safe(args.status)
    cards_doc = _read_json_safe(args.cards)
    candidate_generation = (status_doc or {}).get("candidateGeneration")

    result = build_notification(
        owner=args.owner, run_id=args.run_id, run_url=args.run_url,
        job_failed=(args.job_failed == "true"),
        failed_step=args.failed_step or None,
        status_doc=status_doc, promotion_cards_doc=cards_doc,
        candidate_generation=candidate_generation)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
    print(f"[notification] level={result['level']} title={result['title']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
