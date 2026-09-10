#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""개오 검사 입구 — 기존 `test_*.py`/`test_*.js`와 점검 스크립트를 목적별로 묶어 한 명령으로 돌린다 (2026-09-10).

새 프레임워크가 아니다. 모델(LLM)을 부르는 검사는 없다. 출력은 파일로 남기고 화면에는 PASS/FAIL 한 줄만 낸다.

    python3 gaeo_check.py <preflight|quick|pipeline|paper|investment-contract|schedule|compatibility|premerge|postdeploy|browser>
    python3 gaeo_check.py list            # 묶음 구성 출력
    python3 gaeo_check.py postdeploy --expect-sha <40자>

종료코드: 0 = 전부 PASS, 1 = FAIL 있음, 2 = 확인 불가(예: fetch 실패·토큰 없음)

계약(test_gaeo_check.py): 모든 test_*.py 는 어느 묶음에든 들어 있어야 하고, 묶음에 적힌 파일은 실제로 있어야 하며,
한 검사가 실패하거나 빠지면 조용히 PASS 가 되지 않는다.
"""
import glob
import os
import subprocess
import sys
import tempfile
import time

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.environ.get("GAEO_CHECK_OUT") or os.path.join(tempfile.gettempdir(), "gaeo-check")

# 브라우저(Playwright) 테스트는 CI 밖에서만 돈다(ci.yml 과 같은 판정: 파일에 'playwright' 가 있으면 브라우저 테스트).
JS_NOT_A_TEST = {"test_static_server.js"}

GROUPS = {
    "quick": [
        "test_ci_parity.py", "test_workflow_size.py", "test_workflow_branch_exec.py", "test_pipeline_watchdog.py",
        "test_holiday_guard.py", "test_paper_single_writer.py", "test_ops_status.py", "test_validation_schedule.py",
        "test_rules_map.py", "test_gaeo_check.py", "test_secret_hygiene.py",
    ],
    "pipeline": [
        "test_pipeline_watchdog.py", "test_workflow_health.py", "test_workflow_size.py", "test_workflow_branch_exec.py",
        "test_holiday_guard.py", "test_krx_calendar_sync.py", "test_ci_parity.py", "test_coverage_600.py",
        "test_gaeo_coverage.py", "test_market_history_close.py", "test_market_history_summary.py", "test_market_universe.py",
        "test_indicators_split.py", "test_indicator_provenance.py", "test_flow_history.py", "test_flow_period_consistency.py", "test_flow_summary.py",
        "test_dart_pipeline.py", "test_dart_context_loader.py", "test_dart_financials_collect.py", "test_dart_live_hardening.py",
        "test_sector_source_promotion.py", "test_ops_status.py", "test_content_freshness.py", "test_seo_publishing.py",
        "test_deep_analysis_pipeline.py", "test_archive_security.py", "test_research_store.py", "test_shared_toss_token.py",
        "test_shared_token_hardening.py", "test_toss_guard.py", "test_toss_market_data_smoke.py",
    ],
    "paper": [
        "test_paper_accounting.py", "test_paper_accounting_v2.py", "test_paper_backfill.py", "test_paper_engine.py",
        "test_paper_evidence_guard.py", "test_paper_gaps.py", "test_paper_gate_bypass.py", "test_paper_hardening.py",
        "test_paper_health_check.py", "test_paper_history.py", "test_paper_momentum.py", "test_paper_pairing.py",
        "test_paper_portfolio.py", "test_paper_public.py", "test_paper_safety_boundary.py", "test_paper_scalp_v3.py",
        "test_paper_session.py", "test_paper_single_writer.py", "test_paper_smart_v2.py", "test_paper_runner_sync.py",
        "test_paper_ledger_inclusion.py", "test_paper_recover.py",
        "test_toss_guard.py", "test_shared_toss_token.py", "test_shared_token_hardening.py", "test_toss_market_data_smoke.py",
    ],
    "investment-contract": [
        "test_prereg_buy_filters.py", "test_analyst_honesty.py", "test_team_weights_market_relative.py", "test_buy_overheat.py",
        "test_buy_warning_evidence.py", "test_gaeo_evolution.py", "test_model_intelligence.py", "test_model_scoreboard.py",
        "test_base_candidates.py", "test_base_model_fixes.py", "test_research_c_scoreboard.py", "test_research_engine.py",
        "test_research_v11.py", "test_rotation.py", "test_rotation_picks.py", "test_rotation_workflow.py", "test_radar.py",
        "test_rebound_watch.py", "test_piotroski.py", "test_scorecard_report_publish.py", "test_product_semantics.py",
        "test_paper_evidence_guard.py", "test_gaeo_coverage.py", "test_validation_negative_control.py",
    ],
    "schedule": ["test_validation_schedule.py", "test_validation_runner.py", "test_validation_checks.py"],
    "compatibility": ["test_rules_map.py", "test_ci_parity.py", "test_secret_hygiene.py", "test_design_contract.py",
                      "test_gaeo_check.py", "test_css_layering.py", "test_agent_compat.py", "test_history_preservation.py"],
}
# 묶음에 넣을 곳이 없는 검사도 "어디에도 없음"은 허용하지 않는다 — 이 목록에 명시적으로 적는다.
UNGROUPED_BUT_KNOWN = []


def all_py_tests():
    return sorted(os.path.basename(p) for p in glob.glob(os.path.join(HERE, "test_*.py")))


def all_js_tests():
    return sorted(os.path.basename(p) for p in glob.glob(os.path.join(HERE, "test_*.js")))


def is_browser_test(name):
    with open(os.path.join(HERE, name), encoding="utf-8", errors="replace") as fh:
        return "playwright" in fh.read()


def js_ci_tests():
    return [n for n in all_js_tests() if n not in JS_NOT_A_TEST and not is_browser_test(n)]


def run_one(name, cmd, timeout=600):
    os.makedirs(OUT_DIR, exist_ok=True)
    log = os.path.join(OUT_DIR, name.replace("/", "_") + ".txt")
    t0 = time.time()
    try:
        r = subprocess.run(cmd, cwd=HERE, capture_output=True, text=True, timeout=timeout,
                           env=dict(os.environ, PYTHONUTF8="1", TZ="Asia/Seoul"))
        out, code = r.stdout + r.stderr, r.returncode
    except subprocess.TimeoutExpired:
        out, code = f"timeout {timeout}s", 124
    except OSError as e:
        out, code = str(e), 127
    with open(log, "w", encoding="utf-8") as fh:
        fh.write(out)
    ok = code == 0
    print(f"{'PASS' if ok else 'FAIL'} {name}  ({time.time() - t0:.1f}s){'' if ok else '  → ' + log}")
    return ok


def run_group(files):
    """묶음의 파일을 하나씩 실행. 없는 파일은 FAIL(조용히 건너뛰지 않는다)."""
    ok_all = True
    for f in files:
        path = os.path.join(HERE, f)
        if not os.path.exists(path):
            print(f"FAIL {f}  (파일이 없다 — 묶음 목록이 낡았다)")
            ok_all = False
            continue
        if f.endswith(".py"):
            ok_all &= run_one(f, [sys.executable, path])
        else:
            ok_all &= run_one(f, ["node", path])
    return ok_all


def preflight():
    def sh(*args):
        r = subprocess.run(args, cwd=HERE, capture_output=True, text=True, timeout=60)
        return r.returncode, (r.stdout + r.stderr).strip()
    code, status = sh("git", "status", "--short")
    print("작업 트리:", "깨끗함" if not status else f"변경 {len(status.splitlines())}건\n" + "\n".join(status.splitlines()[:15]))
    fcode, fout = sh("git", "fetch", "origin", "main")
    if fcode != 0:
        print(f"UNKNOWN fetch 실패 — origin/main 기준을 확인하지 못했다(정상이라는 뜻이 아니다): {fout[-200:]}")
        return 2
    _, om = sh("git", "rev-parse", "--short", "origin/main")
    _, hd = sh("git", "rev-parse", "--short", "HEAD")
    _, ab = sh("git", "rev-list", "--left-right", "--count", "origin/main...HEAD")
    _, br = sh("git", "branch", "--show-current")
    print(f"origin/main {om} · HEAD {hd} ({br}) · behind/ahead {ab.replace(chr(9), '/')}")
    print("인계장: docs/operations/STATUS.md · 검사 지도: docs/HARNESS.md · 일정: docs/VALIDATION_SCHEDULE.md")
    return 0


def postdeploy(expect_sha=None):
    args = [sys.executable, os.path.join(HERE, "ops_status.py"), "--github", "--probe-pages"]
    r = subprocess.run(args, cwd=HERE, capture_output=True, text=True, timeout=300)
    print(r.stdout.strip())
    if expect_sha:
        rr = subprocess.run(["git", "ls-remote", "origin", "refs/heads/main"], cwd=HERE, capture_output=True, text=True, timeout=60)
        remote = rr.stdout.split()[0] if rr.returncode == 0 and rr.stdout.split() else None
        if remote is None:
            print("UNKNOWN origin/main SHA 를 읽지 못했다")
            return 2
        print(f"origin/main = {remote[:12]} · 기대 {expect_sha[:12]} → {'일치' if remote.startswith(expect_sha) else '불일치'}")
        if not remote.startswith(expect_sha):
            return 1
    return r.returncode


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 2
    cmd = argv[0]
    if cmd == "list":
        for g, files in GROUPS.items():
            print(f"{g}: {len(files)}개 — {', '.join(files)}")
        print(f"premerge: test_*.py {len(all_py_tests())}개 + node {len(js_ci_tests())}개")
        return 0
    if cmd == "preflight":
        return preflight()
    if cmd == "postdeploy":
        sha = argv[argv.index("--expect-sha") + 1] if "--expect-sha" in argv else None
        return postdeploy(sha)
    if cmd == "browser":
        for n in all_js_tests():
            if n not in JS_NOT_A_TEST and is_browser_test(n):
                print("browser:", n)
        print("실행: NODE_PATH=/opt/node22/lib/node_modules node <파일> (test_static_server.js 8877 포트 필요)")
        return 0
    if cmd == "premerge":
        ok = run_group(all_py_tests()) and run_group(js_ci_tests())
        return 0 if ok else 1
    if cmd in GROUPS:
        return 0 if run_group(GROUPS[cmd]) else 1
    print(f"알 수 없는 묶음: {cmd}")
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
