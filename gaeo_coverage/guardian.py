# -*- coding: utf-8 -*-
"""Coverage Guardian — "600종목이 정말 600종목인가"를 매주 실측하는 관측자.

왜 필요한가
    tickers.js에는 600개가 있는데 data.js에는 598개만 들어오는 날이 있다.
    이때 흔한 실수가 두 가지다.
      ① "Coverage가 598로 줄었다"고 잘못 말한다 (실제로 줄어든 건 시세 수신이지
         Universe가 아니다).
      ② 안 들어온 2종목을 상장폐지로 단정하고 다른 종목으로 갈아끼운다.
    둘 다 사실을 왜곡한다. 그래서 이 모듈은 **서로 다른 4개의 숫자**를 각각 다른
    이름으로 재고, 누락 원인을 보수적으로 분류만 한다.

4개의 숫자 (절대 하나로 합치지 않는다)
    targetCoverage       : 목표 Universe 크기 (설정값 — coverage_version.CURRENT.size)
    configuredCoverage   : tickers.js에 실제로 적혀 있는 종목 수 (= Universe 크기)
    freshPriceCoverage   : data.js에서 stale이 아닌 시세를 받은 종목 수
    autoAnalysisCoverage : auto_analysis.js가 판단을 만들어낸 종목 수

    ⚠️ configuredCoverage가 600이면 Universe는 600이다. 시세가 598개만 들어왔다고
       해서 "Coverage가 598로 줄었다"고 쓰지 않는다.

무엇을 안 하는가
    · 파일 수정 0 (tickers.js·data.js·auto_analysis.js·coverage_version.py 전부 읽기만)
    · 종목 자동 교체 0
    · 네트워크 호출 0 (이미 수집된 스냅샷 파일만 읽는다)
"""
import argparse
import datetime
import hashlib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
STATE_DIR = os.path.join(HERE, "state")

DEFAULT_TICKERS = os.path.join(ROOT, "tickers.js")
DEFAULT_DATA_JS = os.path.join(ROOT, "data.js")
DEFAULT_AUTO_JS = os.path.join(ROOT, "auto_analysis.js")
DEFAULT_SNAPSHOT = os.path.join(ROOT, "market_universe", "full_market_latest.json.gz")
DEFAULT_UNIVERSE_STATE = os.path.join(ROOT, "market_universe", "state.json")
DEFAULT_REPORT_OUT = os.path.join(STATE_DIR, "coverage_state.json")
DEFAULT_OBSERVATIONS = os.path.join(STATE_DIR, "coverage_observations.json")

KST = datetime.timezone(datetime.timedelta(hours=9))

# ── 누락 원인 분류 ───────────────────────────────────────────────────────────
TEMP_DATA_FAILURE = "TEMP_DATA_FAILURE"          # 일시적 수집 실패 (교체 대상 아님)
LISTED_BUT_SUSPENDED = "LISTED_BUT_SUSPENDED"    # 상장돼 있으나 거래정지 (교체 대상 아님)
CORPORATE_EVENT = "CORPORATE_EVENT"              # 사명변경·합병 등 (교체 대상 아님)
DELISTED_CONFIRMED = "DELISTED_CONFIRMED"        # 상장폐지 확인 (유일한 교체 검토 대상)
PIPELINE_BUG = "PIPELINE_BUG"                    # 시장엔 멀쩡히 있는데 우리가 못 받음
UNKNOWN = "UNKNOWN"                              # 근거 부족 (교체 대상 아님)

# 교체를 "검토"라도 할 수 있는 유일한 분류. 이 목록을 늘리지 말 것.
REPLACEABLE_CAUSES = (DELISTED_CONFIRMED,)

# 한 번 빠졌다고 판정하지 않는다. 연속 N회 관측되어야 '지속 누락'이다.
PERSISTENT_MISSING_MIN_OBSERVATIONS = 3

# 상장폐지 판정에 쓸 수 있는 snapshot의 최대 나이(일).
# market_universe snapshot은 수집 실패 시 last-good이 그대로 남으므로(오래될 수 있다),
# 오래된 snapshot에서 '없다'는 사실만으로 상장폐지를 단정하면 안 된다.
SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING = 3

STATUS_PASS = "PASS"
STATUS_WARN = "WARN"
STATUS_RED = "RED"

# freshPriceCoverage가 목표 대비 이 비율보다 더 빠지면 단순 결측이 아니라 사고로 본다.
RED_MISSING_RATIO = 0.05


# ── 입력 로더 (전부 읽기 전용) ───────────────────────────────────────────────
def _read_text(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def _parse_js_object(text, const_name):
    """`const NAME = { ... };` 형태의 순수 JSON 리터럴을 읽는다."""
    m = re.search(r"const\s+%s\s*=\s*(\{.*\})\s*;" % const_name, text, re.S)
    if not m:
        raise ValueError("%s 를 찾지 못했다" % const_name)
    return json.loads(m.group(1))


def load_configured(tickers_path=DEFAULT_TICKERS):
    """tickers.js = Universe 단일 소스. 여기 적힌 수가 configuredCoverage다."""
    text = _read_text(tickers_path)
    text = re.sub(r"^\s*//.*$", "", text, flags=re.M)
    arr = json.loads(re.search(r"const\s+TICKERS\s*=\s*(\[.*?\])\s*;", text, re.S).group(1))
    codes, names, sectors = [], {}, {}
    for row in arr:
        code = str(row.get("code") or "")
        if not code:
            continue
        codes.append(code)
        names[code] = row.get("name")
        sectors[code] = row.get("sector")
    return {"codes": codes, "names": names, "sectors": sectors}


def load_fresh_prices(data_js_path=DEFAULT_DATA_JS):
    """data.js에서 '지금 유효한 시세'가 있는 종목. stale:true는 신선하지 않다."""
    doc = _parse_js_object(_read_text(data_js_path), "LIVE_DATA")
    stocks = doc.get("stocks") or {}
    fresh, stale = [], []
    for code, row in stocks.items():
        (stale if (row or {}).get("stale") else fresh).append(str(code))
    return {"fresh": sorted(fresh), "stale": sorted(stale),
            "present": sorted(str(c) for c in stocks.keys()),
            "asOf": doc.get("date")}


def load_auto_analysis(auto_js_path=DEFAULT_AUTO_JS):
    """auto_analysis.js에서 실제로 판단이 만들어진 종목."""
    doc = _parse_js_object(_read_text(auto_js_path), "LIVE_AUTO")
    stocks = doc.get("stocks") or {}
    return {"codes": sorted(str(c) for c in stocks.keys()),
            "generatedAt": doc.get("generatedAt"),
            "coverageUniverseVersion": doc.get("coverageUniverseVersion"),
            "coverageUniverseSize": doc.get("coverageUniverseSize")}


def load_universe_snapshot(path=DEFAULT_SNAPSHOT):
    """Full Market Universe last-good snapshot. 없으면 None(추측하지 않는다)."""
    try:
        import gzip
        with gzip.open(path, "rt", encoding="utf-8") as f:
            doc = json.load(f)
    except Exception:
        return None
    items = doc.get("items")
    if not isinstance(items, list):
        return None
    by_code = {}
    for it in items:
        code = str((it or {}).get("code") or "")
        if code:
            by_code[code] = it
    return {"asOf": doc.get("asOf"), "kstDay": doc.get("kstDay"),
            "source": doc.get("source"), "rawCount": doc.get("rawCount"),
            "byCode": by_code}


def load_universe_state(path=DEFAULT_UNIVERSE_STATE):
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
        return doc if isinstance(doc, dict) else None
    except Exception:
        return None


# ── 시간 · fingerprint ───────────────────────────────────────────────────────
def now_kst_iso(now=None):
    now = now or datetime.datetime.now(KST)
    return now.astimezone(KST).isoformat(timespec="seconds")


def _parse_iso(value):
    if not value:
        return None
    try:
        return datetime.datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except Exception:
        return None


def snapshot_age_days(as_of, now=None):
    """snapshot이 며칠 묵었나. 알 수 없으면 None(=판정 근거로 쓰지 않는다)."""
    ts = _parse_iso(as_of)
    if ts is None:
        return None
    now = now or datetime.datetime.now(KST)
    if ts.tzinfo is None:
        ts = ts.replace(tzinfo=KST)
    if now.tzinfo is None:
        now = now.replace(tzinfo=KST)
    return round((now - ts).total_seconds() / 86400.0, 2)


def fingerprint(code, cause):
    """같은 장애는 항상 같은 fingerprint(§20 dedupe).

    시각·실행회차를 섞지 않는다. 그래야 같은 문제로 매주 새 알림이 쌓이지 않는다.
    """
    raw = "gaeo-coverage-missing:%s:%s" % (code, cause)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


# ── 관측 이력 (지속 누락 판정의 근거) ────────────────────────────────────────
def load_observations(path=DEFAULT_OBSERVATIONS):
    try:
        with open(path, encoding="utf-8") as f:
            doc = json.load(f)
        if isinstance(doc, dict) and isinstance(doc.get("codes"), dict):
            return doc
    except Exception:
        pass
    return {"schemaVersion": 1, "codes": {}, "recoveries": []}


def update_observations(previous, missing_codes, configured_codes, now_iso):
    """누락 관측을 누적한다.

    · 이번에도 빠졌으면 consecutiveMissing += 1
    · 이번에 돌아왔으면 '회복 기록'만 남기고 카운터를 지운다(§20: 회복은 회복으로만 기록)
    · Universe에서 아예 빠진 코드는 관측 대상이 아니므로 정리한다
    """
    previous = previous if isinstance(previous, dict) else {}
    old = dict(previous.get("codes") or {})
    recoveries = list(previous.get("recoveries") or [])
    missing = set(missing_codes)
    configured = set(configured_codes)

    new_codes = {}
    for code in sorted(missing):
        entry = dict(old.get(code) or {})
        entry["consecutiveMissing"] = int(entry.get("consecutiveMissing") or 0) + 1
        entry["firstMissingAt"] = entry.get("firstMissingAt") or now_iso
        entry["lastMissingAt"] = now_iso
        new_codes[code] = entry

    for code, entry in old.items():
        if code in missing:
            continue
        if code not in configured:
            continue          # Universe에서 빠진 코드 — 관측 종료
        streak = int((entry or {}).get("consecutiveMissing") or 0)
        if streak > 0:
            recoveries.append({"code": code, "recoveredAt": now_iso,
                               "missingStreak": streak,
                               "firstMissingAt": (entry or {}).get("firstMissingAt")})

    # 회복 기록은 최근 것부터 200건까지만 보관(파일 무한 증식 방지)
    recoveries = recoveries[-200:]
    return {"schemaVersion": 1, "updatedAt": now_iso,
            "codes": new_codes, "recoveries": recoveries}


def is_persistent(observation):
    return int((observation or {}).get("consecutiveMissing") or 0) >= \
        PERSISTENT_MISSING_MIN_OBSERVATIONS


# ── 누락 원인 분류 ───────────────────────────────────────────────────────────
def classify_missing(code, *, configured_name=None, snapshot=None,
                     snapshot_age=None, observation=None):
    """누락 원인 1건을 보수적으로 분류한다. (cause, evidence[])를 돌려준다.

    보수성 규칙(어기지 말 것):
      · DELISTED_CONFIRMED는 (a) 충분히 최신인 snapshot에서 부재 + (b) 지속 누락
        둘 다 성립할 때만. 하나라도 없으면 UNKNOWN.
      · snapshot이 없거나 오래됐으면 그 사실을 evidence에 적고 UNKNOWN으로 남긴다.
      · TEMP_DATA_FAILURE / LISTED_BUT_SUSPENDED / CORPORATE_EVENT / PIPELINE_BUG /
        UNKNOWN 은 전부 교체 대상이 아니다.
    """
    evidence = []
    streak = int((observation or {}).get("consecutiveMissing") or 0)
    persistent = is_persistent(observation)
    evidence.append("연속 누락 관측 %d회 (지속 누락 기준 %d회)"
                    % (streak, PERSISTENT_MISSING_MIN_OBSERVATIONS))

    if snapshot is None:
        evidence.append("전체시장 snapshot을 읽지 못함: 상장 여부를 확인할 근거 없음")
        return UNKNOWN, evidence

    if snapshot_age is None:
        evidence.append("snapshot asOf를 해석하지 못함: 신선도 불명")
    else:
        evidence.append("snapshot asOf %s (%.2f일 경과)"
                        % (snapshot.get("asOf"), snapshot_age))

    item = (snapshot.get("byCode") or {}).get(code)

    if item is not None:
        evidence.append("전체시장 snapshot에 존재: kind=%s basis=%s tradable=%s"
                        % (item.get("kind"), item.get("basis"), item.get("tradable")))
        if item.get("tradable") is False:
            evidence.append("거래불가 상태: 상장은 유지되고 시세만 안 들어오는 것이 자연스럽다")
            return LISTED_BUT_SUSPENDED, evidence
        snap_name = (item.get("name") or "").strip()
        if configured_name and snap_name and snap_name != str(configured_name).strip():
            evidence.append("종목명 불일치: tickers.js '%s' vs snapshot '%s'"
                            % (configured_name, snap_name))
            return CORPORATE_EVENT, evidence
        if persistent:
            evidence.append("시장에는 정상 거래 종목으로 있는데 우리 수집만 계속 실패")
            return PIPELINE_BUG, evidence
        evidence.append("시장에는 정상 거래 종목으로 있고 누락도 아직 지속적이지 않음")
        return TEMP_DATA_FAILURE, evidence

    evidence.append("전체시장 snapshot에 없음")
    if snapshot_age is None or snapshot_age > SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING:
        evidence.append("그러나 snapshot이 상장폐지 판정 기준(%d일)보다 오래됐거나 신선도 "
                        "불명이다. 부재를 상장폐지 근거로 쓸 수 없다"
                        % SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING)
        return UNKNOWN, evidence
    if not persistent:
        evidence.append("snapshot은 충분히 최신이지만 지속 누락 기준을 아직 못 채웠다")
        return UNKNOWN, evidence
    evidence.append("최신 snapshot 부재 + 지속 누락 둘 다 성립")
    return DELISTED_CONFIRMED, evidence


# ── 보고서 ───────────────────────────────────────────────────────────────────
def _coverage_version_module():
    if ROOT not in sys.path:
        sys.path.insert(0, ROOT)
    import coverage_version
    return coverage_version


def _target_coverage():
    """목표 Universe 크기. 코드에 600을 박지 않고 Coverage Version 설정에서 읽는다."""
    cv = _coverage_version_module()
    return int(cv.CURRENT["size"]), cv.CURRENT["version"]


def build_report(*, configured, fresh, auto, snapshot, universe_state,
                 observations, now=None):
    """4개 숫자 + 누락 분류 + 전체 상태."""
    now = now or datetime.datetime.now(KST)
    now_iso = now_kst_iso(now)
    target, target_version = _target_coverage()

    configured_codes = list(configured["codes"])
    configured_set = set(configured_codes)
    fresh_set = set(fresh["fresh"])
    auto_set = set(auto["codes"])

    missing_price = sorted(configured_set - fresh_set)
    missing_auto = sorted(configured_set - auto_set)
    extra_price = sorted(fresh_set - configured_set)
    extra_auto = sorted(auto_set - configured_set)

    age = snapshot_age_days(snapshot.get("asOf") if snapshot else None, now)
    new_obs = update_observations(observations, missing_price, configured_codes, now_iso)

    findings = []
    for code in missing_price:
        cause, evidence = classify_missing(
            code,
            configured_name=configured["names"].get(code),
            snapshot=snapshot, snapshot_age=age,
            observation=(new_obs["codes"] or {}).get(code))
        findings.append({
            "code": code,
            "name": configured["names"].get(code),
            "sector": configured["sectors"].get(code),
            "cause": cause,
            "replaceable": cause in REPLACEABLE_CAUSES,
            "consecutiveMissing": int((new_obs["codes"].get(code) or {}).get(
                "consecutiveMissing") or 0),
            "firstMissingAt": (new_obs["codes"].get(code) or {}).get("firstMissingAt"),
            "inAutoAnalysis": code in auto_set,
            "evidence": evidence,
            "fingerprint": fingerprint(code, cause),
        })

    cause_counts = {}
    for f in findings:
        cause_counts[f["cause"]] = cause_counts.get(f["cause"], 0) + 1

    reasons = []
    status = STATUS_PASS
    if len(configured_codes) != target:
        status = STATUS_RED
        reasons.append("configuredCoverage(%d)가 목표(%d)와 다르다. Universe 자체가 바뀌었다"
                       % (len(configured_codes), target))
    if cause_counts.get(PIPELINE_BUG):
        status = STATUS_RED
        reasons.append("PIPELINE_BUG %d건: 시장에 있는 종목을 우리 파이프라인만 계속 못 받는다"
                       % cause_counts[PIPELINE_BUG])
    if target and len(missing_price) / float(target) > RED_MISSING_RATIO:
        status = STATUS_RED
        reasons.append("시세 누락 %d종목: 목표의 %.0f%%를 넘는다"
                       % (len(missing_price), RED_MISSING_RATIO * 100))
    if status != STATUS_RED and (missing_price or missing_auto or extra_price or extra_auto):
        status = STATUS_WARN
        if missing_price:
            reasons.append("시세 누락 %d종목 (원인: %s)"
                           % (len(missing_price),
                              ", ".join("%s %d" % (k, v)
                                        for k, v in sorted(cause_counts.items()))))
        if missing_auto:
            reasons.append("자동분석 누락 %d종목" % len(missing_auto))
        if extra_price or extra_auto:
            reasons.append("Universe 밖 종목이 산출물에 있음 (시세 %d · 자동분석 %d)"
                           % (len(extra_price), len(extra_auto)))

    return {
        "schemaVersion": 1,
        "generatedAt": now_iso,
        "status": status,
        "statusReasons": reasons,
        "coverageVersion": target_version,
        "targetCoverage": target,
        "configuredCoverage": len(configured_codes),
        "freshPriceCoverage": len(fresh_set),
        "autoAnalysisCoverage": len(auto_set),
        "stalePriceCount": len(fresh["stale"]),
        "universeNote": ("configuredCoverage가 Universe 크기다. 시세·자동분석 숫자가 "
                         "작다고 해서 Universe가 줄어든 것이 아니다."),
        "missingPriceCodes": missing_price,
        "missingAutoAnalysisCodes": missing_auto,
        "extraPriceCodes": extra_price,
        "extraAutoAnalysisCodes": extra_auto,
        "causeCounts": cause_counts,
        "replaceableCount": sum(1 for f in findings if f["replaceable"]),
        "findings": findings,
        "recoveries": new_obs["recoveries"][-20:],
        "snapshot": {
            "path": os.path.relpath(DEFAULT_SNAPSHOT, ROOT),
            "available": snapshot is not None,
            "asOf": (snapshot or {}).get("asOf"),
            "ageDays": age,
            "freshEnoughForDelisting": (age is not None and
                                        age <= SNAPSHOT_MAX_AGE_DAYS_FOR_DELISTING),
            "itemCount": len((snapshot or {}).get("byCode") or {}),
            "collectorStatus": (universe_state or {}).get("status"),
            "collectorAsOf": (universe_state or {}).get("asOf"),
        },
        "priceAsOf": fresh.get("asOf"),
        "autoAnalysisGeneratedAt": auto.get("generatedAt"),
        "autoAnalysisStamp": {
            "coverageUniverseVersion": auto.get("coverageUniverseVersion"),
            "coverageUniverseSize": auto.get("coverageUniverseSize"),
        },
        "_observations": new_obs,
    }


def run(*, tickers_path=DEFAULT_TICKERS, data_js_path=DEFAULT_DATA_JS,
        auto_js_path=DEFAULT_AUTO_JS, snapshot_path=DEFAULT_SNAPSHOT,
        universe_state_path=DEFAULT_UNIVERSE_STATE,
        observations_path=DEFAULT_OBSERVATIONS, report_out=DEFAULT_REPORT_OUT,
        write=True, now=None):
    report = build_report(
        configured=load_configured(tickers_path),
        fresh=load_fresh_prices(data_js_path),
        auto=load_auto_analysis(auto_js_path),
        snapshot=load_universe_snapshot(snapshot_path),
        universe_state=load_universe_state(universe_state_path),
        observations=load_observations(observations_path),
        now=now)
    obs = report.pop("_observations")
    if write:
        write_json(observations_path, obs)
        write_json(report_out, report)
    return report


def write_json(path, doc):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)


def main(argv=None):
    p = argparse.ArgumentParser(description="GAEO Coverage Guardian (읽기 전용 관측)")
    p.add_argument("--tickers", default=DEFAULT_TICKERS)
    p.add_argument("--data-js", default=DEFAULT_DATA_JS)
    p.add_argument("--auto-js", default=DEFAULT_AUTO_JS)
    p.add_argument("--snapshot", default=DEFAULT_SNAPSHOT)
    p.add_argument("--universe-state", default=DEFAULT_UNIVERSE_STATE)
    p.add_argument("--observations", default=DEFAULT_OBSERVATIONS)
    p.add_argument("--out", default=DEFAULT_REPORT_OUT)
    p.add_argument("--dry-run", action="store_true", help="파일을 쓰지 않고 결과만 출력")
    args = p.parse_args(argv if argv is not None else sys.argv[1:])

    report = run(tickers_path=args.tickers, data_js_path=args.data_js,
                 auto_js_path=args.auto_js, snapshot_path=args.snapshot,
                 universe_state_path=args.universe_state,
                 observations_path=args.observations, report_out=args.out,
                 write=not args.dry_run)
    print("[coverage-guardian] status=%s target=%d configured=%d freshPrice=%d auto=%d "
          "missing=%d replaceable=%d"
          % (report["status"], report["targetCoverage"], report["configuredCoverage"],
             report["freshPriceCoverage"], report["autoAnalysisCoverage"],
             len(report["missingPriceCodes"]), report["replaceableCount"]))
    for f in report["findings"]:
        print("  - %s %s → %s (연속 %d회) %s"
              % (f["code"], f["name"], f["cause"], f["consecutiveMissing"],
                 f["fingerprint"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
