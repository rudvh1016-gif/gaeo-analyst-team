#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 판단 히스토리 아카이브
현재 analysis.js(LIVE_ANALYSIS)의 CHIEF 판단을 종목별로 history.js(LIVE_HISTORY)에
누적 기록한다. 같은 "updated" 시각(분 단위까지)의 기록이 이미 있으면 그것만 덮어쓰고,
시각이 다르면(하루에 여러 번 재분석해도) 각각 별도 기록으로 쌓는다.
→ 화면(index.html)이 이 기록으로 '콜/신뢰도 추이 그래프'와 '적중 채점'을 그린다.
실행: python3 archive_analysis.py   (재분석 직후 1회. daily_update.command가 자동 호출)

★ 2026-07-08 버그 수정: 예전엔 "같은 날짜(day)"로만 구분해 하루에 두 번 재분석하면
  오전 기록이 통째로 사라졌다(장중 변동이 큰 날 특히 치명적). 이제 "updated"의
  분 단위 시각까지 비교해 같은 시각 재실행만 덮어쓰고, 다른 시각은 모두 보존한다.
"""
import re, json, os, datetime, sys

import append_only_guard
import research_crypto
import research_store

HERE = os.path.dirname(os.path.abspath(__file__))
HIST_CAP = 80   # 가벼운 채점 히스토리만 최근 80건 유지. 정밀분석 원문은 영구 보존한다.

def load_js_object(path, varname):
    """`const VAR = {...};` 형태의 JS 파일에서 객체만 파싱해 dict로 반환."""
    if not os.path.exists(path):
        return None
    txt = open(path, encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)          # 줄 주석 제거
    m = re.search(r"const\s+" + varname + r"\s*=\s*(\{.*\})\s*;", txt, re.S)
    if not m:
        return None
    return json.loads(m.group(1))

def load_ticker_metadata():
    """tickers.js에서 역사 스냅샷에 고정할 종목명·업종 메타데이터를 읽는다."""
    path = os.path.join(HERE, "tickers.js")
    if not os.path.exists(path):
        return {}
    txt = open(path, encoding="utf-8").read()
    txt = re.sub(r"^\s*//.*$", "", txt, flags=re.M)
    m = re.search(r"const\s+TICKERS\s*=\s*(\[.*\])\s*;", txt, re.S)
    if not m:
        return {}
    try:
        rows = json.loads(m.group(1))
    except (TypeError, json.JSONDecodeError):
        return {}
    return {
        str(row.get("code")): {"name": row.get("name", ""), "sector": row.get("sector", "")}
        for row in rows if isinstance(row, dict) and row.get("code")
    }

def snapshot_identity(code, when):
    safe_time = re.sub(r"[^0-9]", "", str(when))[:12]
    return f"{code}-{safe_time}"

def _entry_from(a, when):
    """analysis.js/auto_analysis.js 공통 — 한 종목 dict(a)와 판단 시각(when)으로 히스토리 항목 생성."""
    chief = a.get("chief", {})
    entry = {
        "date": when,                       # 판단 시각 (YYYY-MM-DD [HH:MM])
        "call": chief.get("call"),
        "total": chief.get("total"),
        "confidence": chief.get("confidence"),
        "base": a.get("base"),              # 판단 당시 주가
        "baseAt": a.get("baseAt"),          # 그 주가의 시점
        "target": chief.get("target", ""),
        "modelVersion": chief.get("modelVersion"),
        # 🏷️ 기본모델 버전 — 점수 의미가 바뀐 뒤 기록을 섞어 학습하지 않기 위해 남긴다.
        #    이 필드가 없는 과거 기록은 읽을 때 PRE_HOTFIX_BASE로 본다.
        "baseModelVersion": chief.get("baseModelVersion"),
        "judgmentWithheld": chief.get("judgmentWithheld") or None,
        "reboundCheck": chief.get("reboundCheck"),
    }
    # 🔬 2026-08-21: 총점을 나중에 그대로 재현할 수 있게 하는 근거.
    #    축 점수(taro·diana·nova·flow)만으로는 total이 복원되지 않는다 — 실측 결과
    #    18,978건 중 48.2%만 ±1점 안에 들어왔다. 원인은 위험 감점(riskPenalty)이
    #    기록에 없었기 때문이고, 실제로 total = rawTotal - riskPenalty가 598종목
    #    100% 일치한다. 이 두 값이 있어야 "가중치를 바꿨다면 어땠을까"를 근사가
    #    아니라 정확하게 재채점할 수 있다.
    #    ⛔ 값이 없으면 키를 만들지 않는다(APPEND-ONLY: 과거 기록 모양 보존).
    for _k in ("rawTotal", "riskPenalty"):
        if chief.get(_k) is not None:
            entry[_k] = chief[_k]
    # 🏷️ 2026-08-22: Evolution Production override가 활성일 때만 남는 각인(additive).
    #    "어느 구성(config)이 만든 판단인가"를 나중에 정확히 구분해 채점하기 위한 것.
    #    ⛔ 값이 없으면 키를 만들지 않는다(기존 기록 모양 보존).
    for _k in ("productionConfigVersion", "evolutionCandidateId", "evolutionParamHash"):
        if chief.get(_k) is not None:
            entry[_k] = chief[_k]
    # 결측 축 때문에 가중치가 재정규화된 날에만 남긴다(축 가중합 ≠ rawTotal의 사유).
    if chief.get("weightRenormalized"):
        entry["weightRenormalized"] = True
    for k in ("taro", "diana", "nova", "flow"):
        ana = a.get(k)
        if isinstance(ana, dict) and ana.get("stance"):
            entry[k] = {"stance": ana.get("stance"), "score": ana.get("score")}
            # ⭐ 2026-08-14: QUANT(nova)만 그 점수가 어떤 기저 승률(업종 반영 블렌드)과
            # 비교돼 나왔는지도 함께 남긴다. 나중에 "그날 왜 이 점수였는지" 감사할 수 있게.
            if k == "nova":
                # ⛔ 값이 없는 항목은 아예 넣지 않는다. 정밀분석(analysis.js)은 이 필드를
                #    만들지 않으므로, 넣으면 과거 기록에 null 키만 새로 박히게 된다.
                #    (APPEND-ONLY: 과거 기록은 새 코드 때문에 모양이 바뀌면 안 된다.)
                entry[k].update({key: ana[key] for key in (
                    "sector", "sectorWinRate", "sectorBlendPct", "baseWinRate")
                    if ana.get(key) is not None})
    shadow = a.get("shadowChief")
    if isinstance(shadow, dict) and shadow.get("call"):
        entry["shadow"] = {key: shadow.get(key) for key in (
            "call", "total", "confidence", "probabilityUp", "modelVersion", "regime")}
    return entry


def archive_auto(hist):
    """🤖 자동분석(auto_analysis.js LIVE_AUTO) 전 종목 판단을 '하루 1건'으로 히스토리에 누적.
    - 500종목 각각 매일 판단이 나오지만 어디에도 기록되지 않아 적중률·트랙레코드에서 빠져 있었다.
      이 함수가 그날의 자동 판단을 종목별로 하루 한 칸씩 쌓아, 모든 종목이 채점 대상이 되게 한다.
    - ⛔ 정밀분석 우선: 같은 날짜에 이미 정밀분석(분 단위 시각) 기록이 있으면 자동 기록으로 덮지 않는다.
      같은 날 이전 자동 기록만 최신(장 마감에 가까운) 스냅샷으로 갱신 → 종목·날짜당 정확히 1건.
    - 자동 기록에는 tier:"auto" 표식을 달아 정밀 기록과 구분한다(정밀 기록엔 이 필드가 없다)."""
    auto = load_js_object(os.path.join(HERE, "auto_analysis.js"), "LIVE_AUTO")
    if not auto or not isinstance(auto.get("stocks"), dict):
        print("auto_analysis.js를 읽지 못했습니다 — 자동 아카이브 생략."); return 0, 0
    stocks = auto["stocks"]
    gen = str(auto.get("generatedAt", ""))[:10]
    a_add, a_upd = 0, 0
    for code, a in stocks.items():
        if not isinstance(a, dict) or not a.get("chief") or not a.get("base"):
            continue
        day = (str(a.get("baseAt") or a.get("updated") or gen)[:10]) or gen
        if not day:
            continue
        entry = _entry_from(a, day)
        entry["tier"] = "auto"
        lst = hist.setdefault(code, [])
        # 같은 날(day)의 기존 기록 찾기 — 정밀(=tier 없음)이면 건너뛰고, 자동이면 최신으로 갱신
        same_day_idx = next((i for i, e in enumerate(lst)
                             if str(e.get("date", ""))[:10] == day), None)
        if same_day_idx is not None:
            if lst[same_day_idx].get("tier") == "auto":
                lst[same_day_idx] = entry; a_upd += 1     # 자동 기록만 최신 스냅샷으로 갱신
            elif entry.get("shadow"):
                # 정밀 판단 본문은 그대로 보존하되, 같은 날 자동 파이프라인의
                # 그림자 판정만 병합해 500종목 전진검증 표본에서 빠지지 않게 한다.
                lst[same_day_idx]["shadow"] = entry["shadow"]; a_upd += 1
            continue
        lst.append(entry); a_add += 1
    print(f"자동분석 아카이브 — 신규 {a_add}건 · 갱신 {a_upd}건 (대상 {len(stocks)}종목)")
    return a_add, a_upd


def _research_entry(code, day, rec):
    """research_shadow.json의 한 종목 기록을 영구 보존용 항목으로 바꾼다.

    Live 당시 실제 Prediction을 그대로 남긴다. 나중에 결과를 알고 나서
    과거 입력으로 다시 계산해 Candidate 성적을 만드는 일을 막기 위해서다.
    """
    # 기록 하나 전체에 공통으로 걸리는 값은 여기 한 번만 둔다.
    # (Candidate마다 반복하면 파일이 몇 배로 커진다. 아래 기록의 모든 Candidate·
    #  모든 Horizon에 이 값이 그대로 적용된다는 뜻이다.)
    out = {"code": str(code), "date": day, "base": rec.get("base"),
           "baseAt": rec.get("baseAt"), "source": "live_shadow_oos",
           "probabilityCalibrated": False}
    v10 = rec.get("v10")
    if isinstance(v10, dict) and v10.get("researchModelVersion"):
        out["research"] = {
            "modelVersion": v10.get("researchModelVersion"),
            "featureVersion": v10.get("featureVersion"),
            "labelVersion": v10.get("labelVersion"),
            "configHash": v10.get("configHash"),
            "createdAt": v10.get("createdAt"),
            "inputTimestamp": v10.get("inputTimestamp"),
            "quantStatsAsof": v10.get("quantStatsAsof"),
            "riskState": (v10.get("risk") or {}).get("state"),
            "riskHardGate": (v10.get("risk") or {}).get("hardGate"),
            "horizons": {h: {
                "action": hv.get("primaryAction"),
                "probability": hv.get("probability"),
                "maturity": hv.get("maturity"),
            } for h, hv in (v10.get("horizons") or {}).items() if isinstance(hv, dict)},
        }
    v11 = rec.get("v11")
    if isinstance(v11, dict) and v11.get("researchModelVersion"):
        out["researchV11"] = {
            "modelVersion": v11.get("researchModelVersion"),
            "featureVersion": v11.get("featureVersion"),
            "labelVersion": v11.get("labelVersion"),
            "configHash": v11.get("configHash"),
            "createdAt": v11.get("createdAt"),
            "inputTimestamp": v11.get("inputTimestamp"),
            "quantStatsAsof": v11.get("quantStatsAsof"),
            "primarySelection": v11.get("primarySelection"),
            # ⚠️ 등급 값을 남기지 않는다. 아직 종목을 구분하지 못하는 상태다.
            "reliabilityStatus": (v11.get("reliability") or {}).get("status"),
            "riskState": (v11.get("risk") or {}).get("state"),
            "riskHardGate": (v11.get("risk") or {}).get("hardGate"),
            # Candidate마다 요구된 식별·버전·시각 정보를 그대로 남긴다.
            # (chiefScheme·shortSignalMode는 candidateModelId에 그대로 들어 있고,
            #  status·isRepresentativeModel은 위 primarySelection이 대신한다.)
            "candidates": {cid: {
                "candidateModelId": cv.get("candidateModelId"),
                "predictionTimestamp": cv.get("predictionTimestamp"),
                "modelVersion": cv.get("modelVersion"),
                "featureVersion": cv.get("featureVersion"),
                "labelVersion": cv.get("labelVersion"),
                "inputTimestamp": cv.get("inputTimestamp"),
                "horizons": {h: {
                    "action": hv.get("action"),
                    "probability": hv.get("probability"),
                    "maturity": hv.get("maturity"),
                } for h, hv in (cv.get("horizons") or {}).items() if isinstance(hv, dict)},
            } for cid, cv in (v11.get("candidates") or {}).items() if isinstance(cv, dict)},
        }
    v20 = rec.get("v20")
    if isinstance(v20, dict) and v20.get("researchModelVersion"):
        out["researchV20"] = {
            "modelVersion": v20.get("researchModelVersion"),
            "featureVersion": v20.get("featureVersion"),
            "labelVersion": v20.get("labelVersion"),
            "configHash": v20.get("configHash"),
            "inheritedFrom": v20.get("inheritedFrom"),
            "inheritedConfigHash": v20.get("inheritedConfigHash"),
            "createdAt": v20.get("createdAt"),
            "inputTimestamp": v20.get("inputTimestamp"),
            "primarySelection": v20.get("primarySelection"),
            # DART 맥락은 '무엇을 알 수 있었는가'만. 점수가 아니다.
            "dart": {k: (v20.get("dart") or {}).get(k) for k in
                     ("visibleEventCount", "hiddenNotYetDetected", "hasOfficialEvent",
                      "correctionCount", "coverageState")},
            "candidates": {cid: {
                "candidateModelId": cv.get("candidateModelId"),
                "pairedWith": cv.get("pairedWith"),
                "predictionTimestamp": cv.get("predictionTimestamp"),
                "modelVersion": cv.get("modelVersion"),
                "featureVersion": cv.get("featureVersion"),
                "labelVersion": cv.get("labelVersion"),
                "inputTimestamp": cv.get("inputTimestamp"),
                "dartContextApplied": cv.get("dartContextApplied"),
                "horizons": {h: {"action": hv.get("action"),
                                 "probability": hv.get("probability"),
                                 "maturity": hv.get("maturity")}
                             for h, hv in (cv.get("horizons") or {}).items()
                             if isinstance(hv, dict)},
            } for cid, cv in (v20.get("candidates") or {}).items() if isinstance(cv, dict)},
            "source": "live_shadow_oos",
        }
    return out


def archive_research():
    """🧪 Research Shadow 판단을 날짜별 Segment에 APPEND-ONLY로 누적한다.

    ⚠️ history.js와 완전히 분리한다. history.js는 브라우저가 내려받는 자료라
       화면에 쓰지도 않는 Shadow 기록을 얹으면 사용자 트래픽만 늘어난다.
    ⚠️ HIST_CAP(80건) 절단을 적용하지 않는다. Research 기록은 성숙할 때까지
       지우면 안 되는 전진검증 자료다.

    저장 구조는 research_store.ResearchArchiveStore가 책임진다.
    (하나의 거대한 파일을 매번 통째로 다시 커밋하는 방식을 피하기 위해
     날짜별 Segment로 나눈다. 닫힌 날은 gzip으로 굳힌다.)
    """
    spath = os.path.join(HERE, "research_shadow.json")
    if not os.path.exists(spath):
        return
    try:
        shadow = json.load(open(spath, encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as ex:
        print(f"[경고] research_shadow.json을 읽지 못했습니다 — Research 아카이브 생략: {ex}")
        return
    stocks = shadow.get("stocks") or {}
    if not stocks:
        return

    # 🔐 Key가 없으면 Research 기록을 아예 남기지 않는다(FAIL CLOSED).
    #    평문으로 public repo에 커밋하느니 이번 회차 기록을 포기한다.
    if research_crypto.key_status() != research_crypto.OK:
        print(f"[Research] {research_crypto.KEY_ENV} 상태 {research_crypto.key_status()} — "
              f"평문 저장을 하지 않고 이번 회차 Research 아카이브를 건너뜁니다(FAIL CLOSED).")
        return
    store = research_store.ResearchArchiveStore()
    today = datetime.date.today().isoformat()
    gen = str(shadow.get("generatedAt", ""))[:10]

    # 판단이 본 시세일(baseAt) 기준으로 날짜를 정한다. 대부분 한 날짜로 모인다.
    by_day = {}
    for code, rec in stocks.items():
        day = (str(rec.get("baseAt") or gen)[:10]) or gen
        if day:
            by_day.setdefault(day, []).append(_research_entry(code, day, rec))

    total_added = total_replaced = 0
    for day, records in sorted(by_day.items()):
        state = store.segment_state(day, today)
        if state in ("CLOSED", "COMPRESSED"):
            # 이미 닫힌 날짜에는 쓰지 않는다. APPEND-ONLY의 핵심이다.
            print(f"[Research] {day} Segment는 {state} — 쓰지 않고 건너뜁니다.")
            continue
        # 🔒 쓰기 전 지문. 이 Segment 안의 과거 Prediction이 바뀌면 되돌린다.
        existing = {day: store.read_day(day)}
        before = append_only_guard.snapshot(
            {code: [r] for code, r in
             ((str(x.get("code")), x) for x in existing[day])}, today=today)
        added, replaced = store.append_predictions(day, records, today=today)
        after_rows = store.read_day(day)
        after = append_only_guard.snapshot(
            {str(x.get("code")): [x] for x in after_rows}, today=today)
        violations = append_only_guard.verify(before, after)
        if violations:
            print(f"[APPEND-ONLY 위반] {day} — {len(violations)}건. "
                  f"과거 Prediction이 바뀌었습니다.")
        elif before:
            print(f"APPEND-ONLY 검사 통과 — {day} 과거 Research 기록 {len(before)}건 그대로")
        total_added += added
        total_replaced += replaced

    # 닫힌 날 닫기 → gzip → manifest. 오늘 파일은 건드리지 않는다.
    actions = store.maintain(today=today)
    compressed = [a for a in actions if a.get("status") == research_store.OK]
    broken = [a for a in actions if a.get("status") == research_store.ARCHIVE_INTEGRITY_ERROR]

    report = store.storage_report(today=today)
    _write_storage_report(report, compressed, broken)
    print(f"Research Segment 갱신 — 신규 {total_added}건 · 같은날 갱신 {total_replaced}건 "
          f"· 누적 {report['observedDays']}일 {report['totalArchiveBytes']/1048576:.1f}MB "
          f"(사이트 미로딩)")
    if compressed:
        print(f"Segment 압축 완료 {len(compressed)}일 — "
              f"압축비 {compressed[0].get('compressionRatio')}")
    if broken:
        print(f"[{research_store.ARCHIVE_INTEGRITY_ERROR}] {len(broken)}일 — 원본은 그대로 두었습니다.")


def _write_storage_report(report, compressed, broken):
    """저장량 추이를 매 실행 기록한다(요구 31번). 임의 한계를 두지 않는다."""
    path = os.path.join(HERE, "research_archive", "storage_report.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    payload = dict(report)
    payload["compressedToday"] = compressed
    payload["integrityErrors"] = broken
    # 위험 판단은 실측 증가량으로만 한다. 하드코딩한 상수 한계를 쓰지 않는다.
    gb = payload["estimated365dBytes"] / (1024 ** 3)
    if gb >= 1.0:
        payload["status"] = research_store.STORAGE_MIGRATION_RECOMMENDED
        payload["statusReason"] = (
            f"현재 속도면 1년에 약 {gb:.1f}GB. Git 저장소 안에 두기엔 큰 규모라 "
            f"별도 저장소 분리를 검토할 시점이다.")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=1, sort_keys=True)


def main():
    with_auto = ("--auto" in sys.argv) or (os.environ.get("ARCHIVE_AUTO") == "1")
    an = load_js_object(os.path.join(HERE, "analysis.js"), "LIVE_ANALYSIS")
    if not an:
        print("analysis.js를 읽지 못했습니다 — 아카이브 중단."); return
    hist = load_js_object(os.path.join(HERE, "history.js"), "LIVE_HISTORY") or {}
    # 📚 2026-08-10: history.js는 stance/score만 남기는 가벼운 채점용 기록이라, "그때 정밀분석이
    # 정확히 뭐라고 썼는지" 원문(findings/reason/report 전체)은 재분석할 때마다 사라졌다.
    # ("정밀분석을 요청해도 며칠 뒤엔 자동분석에 가려서 그 내용을 다시 못 본다"는 사용자 피드백)
    # analysis_archive.js에 정밀분석 전체 스냅샷을 시각별로 별도 누적해 "정밀분석 기록" 탭에서
    # 언제든 그 시점 원문을 다시 읽을 수 있게 한다. 500종목 자동분석은 대상이 아니다(용량 폭발 방지) —
    # analysis.js에 실제로 있는(=정밀분석한) 종목만 대상.
    full_archive = load_js_object(os.path.join(HERE, "analysis_archive.js"), "ANALYSIS_ARCHIVE") or {}
    ticker_metadata = load_ticker_metadata()

    global_date = an.get("date", datetime.date.today().isoformat())
    added, updated = 0, 0
    for code, a in an.items():
        if code == "date" or not isinstance(a, dict):
            continue
        chief = a.get("chief", {})
        if not chief:
            continue
        when = a.get("updated") or global_date
        entry = _entry_from(a, when)          # 🧠 정밀분석 기록엔 tier 필드를 달지 않는다(자동과 구분)
        lst = hist.setdefault(code, [])
        when_key = str(when)   # 분 단위 시각까지 포함된 "updated" 원문으로 구분
        # 정확히 같은 시각의 기록만 덮어쓰기(같은 실행 재실행 등). 시각이 다르면 별도 기록으로 추가.
        idx = next((i for i, e in enumerate(lst) if str(e.get("date", "")) == when_key), None)
        if idx is not None:
            lst[idx] = entry; updated += 1
        else:
            lst.append(entry); added += 1

        # 전체 본문 스냅샷도 같은 시각 기준으로 누적(덮어쓰기/추가 규칙은 history.js와 동일)
        flst = full_archive.setdefault(code, [])
        fidx = next((i for i, e in enumerate(flst) if str(e.get("updated", "")) == when_key), None)
        meta = ticker_metadata.get(str(code), {})
        # "summary"는 정밀분석 완성 시점에 함께 쓰는 한 줄 Research Headline(홈 "최근 정밀분석" 표시용).
        # 종목분석 스킬이 analysis.js에 적어두면 여기서 그대로 실어 나른다 — 없으면 조용히 생략(런타임 생성 금지).
        snapshot = {k: a[k] for k in ("updated", "base", "baseAt", "events", "taro", "diana", "nova", "flow", "chief", "summary") if k in a}
        snapshot.update({
            "snapshotId": snapshot_identity(code, when),
            "ticker": str(code),
            "stockName": a.get("stockName") or meta.get("name") or str(code),
            "sector": a.get("sector") or meta.get("sector") or "",
            "analysisCreatedAt": when,
        })
        if fidx is not None:
            flst[fidx] = snapshot
        else:
            flst.append(snapshot)

    # 🤖 자동분석 전 종목도 '하루 1건'으로 누적(--auto 또는 ARCHIVE_AUTO=1일 때만 — 러너에서 켠다)
    if with_auto:
        archive_auto(hist)

    # 🧪 Research Shadow는 별도 파일에 누적한다(사이트 자료와 완전 분리).
    if with_auto:
        archive_research()

    # 종목별 시간순 정렬 + 상한(HIST_CAP) 적용 — 정적 사이트라 파일이 무한정 커지지 않게 최근 것만 보존
    for code in hist:
        hist[code].sort(key=lambda e: str(e.get("date", "")))
        if len(hist[code]) > HIST_CAP:
            hist[code] = hist[code][-HIST_CAP:]

    out = ("// 자동 생성: archive_analysis.py · 판단 히스토리(종목별 시간순 누적)\n"
           "// 재분석 직후 실행되어 그날 CHIEF 판단을 여기에 쌓는다. index.html이 추이·채점에 사용.\n"
           "const LIVE_HISTORY = "
           + json.dumps(hist, ensure_ascii=False, indent=1) + ";\n")
    with open(os.path.join(HERE, "history.js"), "w", encoding="utf-8") as f:
        f.write(out)

    # 정밀분석 원문은 영구 기록이다. 기존 기록도 정체성 필드를 보강하되 삭제·절단하지 않는다.
    for code in full_archive:
        meta = ticker_metadata.get(str(code), {})
        for snapshot in full_archive[code]:
            created = snapshot.get("analysisCreatedAt") or snapshot.get("updated")
            snapshot.setdefault("snapshotId", snapshot_identity(code, created))
            snapshot.setdefault("ticker", str(code))
            snapshot.setdefault("stockName", meta.get("name") or str(code))
            snapshot.setdefault("sector", meta.get("sector") or "")
            snapshot.setdefault("analysisCreatedAt", created)
        full_archive[code].sort(key=lambda e: str(e.get("updated", "")))
    aout = ("// 자동 생성: archive_analysis.py · 정밀분석 전체 본문 기록(종목별 시간순 누적)\n"
            "// history.js와 달리 stance/score만이 아니라 findings·reason·report 원문을 그대로 보존한다.\n"
            "// 500종목 자동분석은 대상이 아니고, analysis.js에 실제로 정밀분석한 종목만 쌓인다.\n"
            "// index.html의 \"정밀분석 기록\" 탭이 이 파일을 읽어 과거 특정 시점의 정밀분석 원문을 보여준다.\n"
            "const ANALYSIS_ARCHIVE = "
            + json.dumps(full_archive, ensure_ascii=False, indent=1) + ";\n")
    with open(os.path.join(HERE, "analysis_archive.js"), "w", encoding="utf-8") as f:
        f.write(aout)
    print(f"analysis_archive.js 갱신 완료 (정밀분석 {len(full_archive)}종목 · 원문 스냅샷 보존)")
    print(f"history.js 갱신 완료 — 신규 {added}건 · 갱신 {updated}건 (종목 {len(hist)})")

    # ── 시장(코스피/코스닥) 분석도 날짜별로 누적 → market_history.js ──
    # 같은 날짜에 여러 번 분석하면 최신 것으로 갱신된다(하루 1칸, 날짜별 목차용).
    mk = an.get("market")
    if isinstance(mk, dict) and (mk.get("text") or mk.get("points")):
        mh = load_js_object(os.path.join(HERE, "market_history.js"), "MARKET_HISTORY") or {}
        day = str(mk.get("updated", ""))[:10] or global_date
        mh[day] = {
            "updated": mk.get("updated", ""),
            "kospi": mk.get("kospi"), "kosdaq": mk.get("kosdaq"),
            "text": mk.get("text", ""), "points": mk.get("points", []),
        }
        mout = ("// 개오 애널리스트팀 — 날짜별 시장(코스피/코스닥) 분석 기록\n"
                "// archive_analysis.py가 재분석 때마다 그날의 market 블록을 여기에 누적한다(같은 날짜는 최신으로 갱신).\n"
                "// 화면의 \"📚 지난 시장 분석\" 목차가 이 파일을 읽는다.\n"
                "const MARKET_HISTORY = "
                + json.dumps(mh, ensure_ascii=False, indent=1) + ";\n")
        with open(os.path.join(HERE, "market_history.js"), "w", encoding="utf-8") as f:
            f.write(mout)
        print(f"market_history.js 갱신 완료 — {day} 기록 ({len(mh)}일 누적)")

if __name__ == "__main__":
    main()
