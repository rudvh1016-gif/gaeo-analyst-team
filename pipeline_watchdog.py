#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 애널리스트팀 — 파이프라인 좀비(hang) 감시·소생 (2026-09-02 신설)

## 왜 만들었나 — 2026-09-02 사고

09:28 KST에 안전망이 update-prices의 hang run만 취소하고 재기동했다. update-analysis도
똑같이 hang 상태였는데 그건 살아남았고, `cancel-in-progress: false` 때문에 새로 뜬
update-analysis run이 그 좀비 뒤에서 `pending`으로 2시간을 대기했다. 결과: 시세는 10분마다
정상 갱신되는데 자동분석만 전날 16:08에 얼어붙어, 화면에 "분석 기준 어제 · 재분석 권장"이
아침 내내 떴다.

기존 감시 3개가 전부 이 상황을 "정상"으로 봤다:

  1. 매시 Routine 안전망 — `data.js` 신선도만 쟀다. 시세는 멀쩡했으니 매시간 조용히 종료.
  2. update-prices의 짝꿍 상호 감시 — `alive()`가 "queued/in_progress run이 있는가"만
     본다. 좀비도 in_progress고 뒤에 밀린 pending도 queued라서 **항상 살아있다고 답한다.**
  3. `check_pipeline.py` — auto_analysis.js를 70분 임계로 제대로 검사하지만
     **SessionStart 훅**이라 사람이 세션을 열 때만 말한다. 아무도 안 열면 침묵.

## 이 스크립트의 원칙

**"run이 존재하는가"가 아니라 "산출물이 갱신되고 있는가"로 판정한다.**
좀비는 존재하지만 아무것도 만들지 않는다 — 그게 유일하게 신뢰할 수 있는 구분선이다.
두 파이프라인을 **각각 독립적으로** 판정한다(한쪽이 멀쩡해도 다른 쪽을 가리지 않는다).

## 오판 방지 (건강한 run을 죽이지 않기)

산출물이 오래됐다고 무조건 취소하면, 방금 뜬 run이 첫 사이클을 돌기도 전에 죽고
재기동이 무한 반복된다. 그래서 **유예(grace)** 를 둔다: run이 실제로 일을 시작할 수 있었던
시각 = `max(run 시작 시각, 오늘 수집창 열린 시각)` 부터 유예를 잰다. 개장 전에 떠서
08:58까지 자고 있는 run을 "오래 돌았는데 결과가 없다"고 오해하지 않기 위해서다.
"""
import argparse
import datetime
import json
import os
import sys
import urllib.error
import urllib.request

from check_pipeline import KST, read_stamp   # 라벨 파싱은 훅과 같은 코드를 쓴다(해석이 갈리면 안 된다)
from krx_calendar import is_krx_trading_day

# 수집 창 — update-prices.yml / update-analysis.yml의 open/close와 같은 값을 쓴다.
WINDOW_OPEN = "08:58"
WINDOW_CLOSE = "16:05"

# GitHub는 "아직 시작 못 한 run"을 한 가지 이름으로 부르지 않는다. 동시성(concurrency)에
# 막혀 대기 중인 run은 `pending`으로 뜨고(2026-09-02 사고의 run 513이 실제로 그랬다),
# 러너를 기다리는 run은 `queued`다. 하나만 조회하면 "뒤에 대기분이 있는지"를 놓쳐서
# 좀비를 치운 뒤 불필요한 dispatch를 한 번 더 쏘게 된다.
WAITING = ("queued", "pending", "waiting", "requested")

PIPELINES = {
    "prices": {
        "workflow": "update-prices.yml",
        "output": "data.js",
        "pattern": r'"date"\s*:\s*"([^"]{10,60})"',
        # 10분 주기 → 25분이면 두 사이클을 놓친 것
        "stale_min": 25,
        # 한 사이클 실측 ~2분. 25분이면 넉넉히 여러 번 돌고도 남는다.
        "grace_min": 25,
        "label": "시세",
    },
    "analysis": {
        "workflow": "update-analysis.yml",
        "output": "auto_analysis.js",
        "pattern": r'"generatedAt"\s*:\s*"([^"]{10,60})"',
        # 30분 주기 → 70분이면 두 사이클을 놓친 것 (check_pipeline.py와 같은 임계)
        "stale_min": 70,
        # 유예 60분의 근거 — 2026-08-25~09-01 6거래일 실측(수집창 08:58이 열린 뒤
        # 그날 첫 auto_analysis.js 커밋까지): 14 · 15 · 16 · 17 · 18 · 29분.
        # 최악 29분의 2.07배로 잡았다.
        # ⚠️ 처음엔 45분(최악 대비 1.55배)으로 뒀는데 그건 너무 빡빡하다 —
        #    오판 한 번의 대가가 크기 때문이다(취소 → 재큐 → 또 취소 루프가 되면
        #    파이프라인이 아예 못 돈다). 반대 방향 손해는 hang 감지가 15분 늦어지는
        #    것뿐이고, 그건 이 사고(3시간 20분 방치)에 비하면 무시할 만하다.
        #    → 비대칭이 명확하므로 넉넉한 쪽으로 잡는다.
        "grace_min": 60,
        "label": "자동분석",
    },
}


def in_window(now):
    """거래일 수집 창 안인가. 장외·주말·휴장일엔 산출물이 낡은 게 정상이라 감시하지 않는다.

    ⚠️ 2026-09-06: 예전엔 요일만 봤다. 그러면 공휴일(예: 2026-08-17 광복절 대체휴일)에
       산출물이 안 갱신되는 걸 고장으로 읽고 러너를 깨운다. 그런데 러너도 요일만 보고
       돌던 터라, 깨어난 러너가 직전 종가를 '오늘 시세'로 다시 기록해 유령 판단일을
       만들었다(실측 598건 = 8/14 종가 복제). 감시가 사고의 방아쇠였던 셈이라,
       러너 쪽 가드와 **같은 달력**을 봐야 한다.
    """
    return (now.weekday() < 5 and is_krx_trading_day(now.date())
            and WINDOW_OPEN <= now.strftime("%H:%M") < WINDOW_CLOSE)


def window_open_at(now):
    """오늘 수집 창이 열린 시각(KST)."""
    h, m = (int(x) for x in WINDOW_OPEN.split(":"))
    return now.replace(hour=h, minute=m, second=0, microsecond=0)


def decide(cfg, output_age_min, runs, now):
    """한 파이프라인의 조치를 정한다 — 네트워크·부작용 없는 순수 함수(그래서 테스트된다).

    runs: [{"id": int, "status": "in_progress"|"queued", "started_at": datetime(KST)}]
    반환: {"action": "ok"|"kickoff"|"revive", "cancel": [run id...], "reason": str}
      · ok      — 조치 불필요
      · kickoff — 아무 run도 없다 → dispatch만
      · revive  — 좀비를 취소하고, 뒤에 대기 중인 run이 없으면 dispatch
    """
    if output_age_min is None:
        # 라벨을 못 읽는 건 "갱신이 끊겼다"와 다른 문제다. 이 상태로 run을 죽이면
        # 멀쩡한 파이프라인을 파싱 버그 때문에 계속 재기동하게 된다 — 보고만 한다.
        return {"action": "ok", "cancel": [], "reason": "산출물 타임스탬프 해석 실패 — 판정 보류"}

    if output_age_min <= cfg["stale_min"]:
        return {"action": "ok", "cancel": [], "reason": f"{output_age_min}분 전 갱신 — 정상"}

    running = [r for r in runs if r["status"] == "in_progress"]
    queued = [r for r in runs if r["status"] in WAITING]

    if not running and not queued:
        return {"action": "kickoff", "cancel": [],
                "reason": f"{output_age_min}분째 갱신 없음 · 실행 중인 run 없음 — 재기동"}

    # 유예는 "실제로 일을 시작할 수 있었던 시각"부터 잰다. 개장 전에 떠서 08:58까지
    # 자고 있는 run을 오래 돌았다고 오해하지 않기 위해서다.
    effective_open = window_open_at(now)
    zombies = []
    for r in running:
        began = max(r["started_at"], effective_open)
        if (now - began).total_seconds() / 60 >= cfg["grace_min"]:
            zombies.append(r)

    if zombies:
        # 좀비를 치우면 뒤에 밀려 있던 queued run이 자동으로 시작된다(오늘 사고의 복구 경로).
        # 대기 중인 run이 하나도 없을 때만 새로 dispatch한다.
        return {"action": "revive", "cancel": [r["id"] for r in zombies],
                "reason": (f"{output_age_min}분째 갱신 없음인데 run {len(zombies)}건이 "
                           f"{cfg['grace_min']}분 넘게 in_progress — hang으로 판정"),
                "need_dispatch": not queued}

    if running:
        return {"action": "ok", "cancel": [],
                "reason": f"{output_age_min}분째 갱신 없으나 run이 아직 유예({cfg['grace_min']}분) 안 — 대기"}

    return {"action": "ok", "cancel": [],
            "reason": f"{output_age_min}분째 갱신 없으나 대기 중인 run이 시작을 기다린다 — 대기"}


# ---------------------------------------------------------------- GitHub API

class Gh:
    def __init__(self, repo, token, timeout=20):
        self.repo = repo
        self.base = f"https://api.github.com/repos/{repo}/actions/workflows"
        self.token = token
        self.timeout = timeout

    def _req(self, url, method="GET", data=None):
        req = urllib.request.Request(url, method=method,
                                     data=json.dumps(data).encode() if data else None)
        req.add_header("Authorization", f"Bearer {self.token}")
        req.add_header("Accept", "application/vnd.github+json")
        if data:
            req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(req, timeout=self.timeout) as r:
            body = r.read()
            return r.status, (json.loads(body) if body else {})

    @staticmethod
    def _ts(value):
        """GitHub의 UTC 문자열 → KST datetime (못 읽으면 None)."""
        try:
            return datetime.datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ") \
                .replace(tzinfo=datetime.timezone.utc).astimezone(KST)
        except (TypeError, ValueError):
            return None

    def job_started_at(self, run_id):
        """이 run이 **실제로 러너를 잡은** 시각(가장 이른 job의 started_at).

        ⚠️ 2026-09-02, 이 워치독의 첫 실전 실행에서 드러난 문제 —
        run의 `run_started_at`은 "큐에 들어간 시각"이지 "일을 시작한 시각"이 아니다.
        그날 run 513은 09:28에 큐에 들어가 좀비 뒤에서 2시간을 기다린 뒤 11:28에야
        러너를 잡았는데, run_started_at으로 재면 "136분째 일하는데 결과가 없다"가 되어
        **16분째 정상 수집 중이던 건강한 run을 좀비로 오판해 죽였다.**

        하필 이 워치독이 잡으라고 만든 상황(동시성에 오래 막힘)이 정확히 이 오판을
        만든다 — 고치지 않으면 취소 → 재큐 → 또 취소가 반복될 수 있다.
        """
        url = f"https://api.github.com/repos/{self.repo}/actions/runs/{run_id}/jobs?per_page=50"
        try:
            _, data = self._req(url)
        except (urllib.error.URLError, OSError, ValueError) as e:
            print(f"   [경고] run {run_id} job 시각 조회 실패: {e}")
            return None
        times = [t for t in (self._ts(j.get("started_at")) for j in data.get("jobs", [])) if t]
        return min(times) if times else None

    def active_runs(self, workflow):
        """main 브랜치에서 아직 끝나지 않은 run들."""
        out = []
        for status in ("in_progress",) + WAITING:
            url = f"{self.base}/{workflow}/runs?branch=main&status={status}&per_page=20"
            try:
                _, data = self._req(url)
            except (urllib.error.URLError, OSError, ValueError) as e:
                print(f"   [경고] {workflow} {status} 조회 실패: {e}")
                continue
            for run in data.get("workflow_runs", []):
                ts = self._ts(run.get("run_started_at") or run.get("created_at"))
                if status == "in_progress":
                    # 취소 후보는 이 run들뿐이므로, 여기서만 job 시각을 한 번 더 확인한다.
                    # 조회에 실패하면 run_started_at으로 물러서되, 그 경우 유예를 넉넉히
                    # 잡은 쪽(더 늦은 시각)이 안전하므로 기존 값을 그대로 쓴다.
                    ts = self.job_started_at(run["id"]) or ts
                if ts is None:
                    continue
                out.append({"id": run["id"], "status": status, "started_at": ts})
        return out

    def cancel(self, run_id):
        url = f"https://api.github.com/repos/{self.repo}/actions/runs/{run_id}/cancel"
        try:
            status, _ = self._req(url, method="POST")
        except urllib.error.HTTPError as e:
            # 409 = 이미 끝난 run. 좀비를 지우는 게 목적이니 이미 끝났으면 성공으로 본다.
            return e.code == 409
        return status == 202

    def dispatch(self, workflow):
        url = f"{self.base}/{workflow}/dispatches"
        try:
            status, _ = self._req(url, method="POST", data={"ref": "main"})
        except (urllib.error.URLError, OSError) as e:
            print(f"   [경고] {workflow} dispatch 실패: {e}")
            return False
        return status == 204


# ---------------------------------------------------------------- CLI

def main():
    ap = argparse.ArgumentParser(description="개오 파이프라인 좀비 감시·소생")
    ap.add_argument("--apply", action="store_true", help="실제로 취소·재기동한다(기본은 판정만)")
    ap.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY", ""))
    ap.add_argument("--force-window", action="store_true", help="수집 창 밖에서도 판정한다(테스트용)")
    args = ap.parse_args()

    now = datetime.datetime.now(KST)
    if not (in_window(now) or args.force_window):
        # ⭐ 사유를 밝힌다. 예전엔 휴장일에도 "수집 창 밖"이라고만 찍혀서, 이 로그를 읽는
        #    안전망 Routine이 "아직 아무 조치도 안 됐다"로 읽고 잠자는 체인 run을 좀비로
        #    오인해 취소할 수 있었다(2026-09-06 PR #513 검수 F1).
        if now.weekday() < 5 and not is_krx_trading_day(now.date()):
            why = "오늘은 KRX 휴장일 — 감시 생략(수집이 안 도는 게 정상이다)"
        else:
            why = "수집 창 밖 — 점검 생략"
        print(f"[파이프라인 감시] {now:%Y-%m-%d %H:%M} KST · {why}")
        return 0

    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN") or ""
    gh = Gh(args.repo, token) if (args.apply and token and args.repo) else None
    if args.apply and gh is None:
        print("[파이프라인 감시] --apply 인데 GH_TOKEN·GITHUB_REPOSITORY가 없다 — 판정만 수행")

    problems = []
    for name, cfg in PIPELINES.items():
        stamp = read_stamp(cfg["output"], cfg["pattern"])
        age = None if stamp is None else int((now - stamp).total_seconds() // 60)
        runs = gh.active_runs(cfg["workflow"]) if gh else []
        d = decide(cfg, age, runs, now)
        print(f"[{cfg['label']}] {cfg['output']} — {d['reason']}")

        if d["action"] == "ok":
            continue
        problems.append(cfg["label"])
        if gh is None:
            print("   → 조치 대상이지만 --apply가 아니라 실행하지 않는다")
            continue

        for rid in d["cancel"]:
            ok = gh.cancel(rid)
            print(f"   → run {rid} 취소 {'성공' if ok else '실패'}")
        if d["action"] == "kickoff" or d.get("need_dispatch"):
            ok = gh.dispatch(cfg["workflow"])
            print(f"   → {cfg['workflow']} 재기동 dispatch {'성공' if ok else '실패'}")

    if problems:
        print(f"[파이프라인 감시] 조치 대상: {' · '.join(problems)}")
    else:
        print("[파이프라인 감시] 두 파이프라인 모두 정상 — 조치 없음")
    return 0


if __name__ == "__main__":
    sys.exit(main())
