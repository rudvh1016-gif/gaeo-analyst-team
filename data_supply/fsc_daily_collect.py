#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""공식 일별 시세(금융위원회_주식시세정보 15094808) 수집·검증 CLI — LLM 0 · 네트워크는 게이트+키+요청 상한 안에서만 (2026-09-17).

    python3 -m data_supply.fsc_daily_collect --plan --days 10                  # 네트워크 0: 대상 기준일·빠진 날·요청/저장 추정
    python3 -m data_supply.fsc_daily_collect --verify --days 10 --codes-limit 20 --max-requests 50
    python3 -m data_supply.fsc_daily_collect --if-due --max-requests 6         # 기존 워크플로(ops-daily)에서 하루 1회
    python3 -m data_supply.fsc_daily_collect --backfill --days 60 --max-requests 120

출력의 첫 줄은 항상 `SECRET_PRESENT=true|false` (키 값은 절대 찍지 않는다). 종료코드: 0 정상 · 1 수집 실패 ·
2 게이트 닫힘 · 3 키 없음(CREDENTIALS_MISSING) · 4 아무것도 확보하지 못함(검증 실패).

기준일 규칙: basDt D 의 자료는 D 의 다음 영업일 13:00 KST 이후에 제공된다. 그래서 "지금 받을 수 있는 최신 기준일" 은
오늘이 아니라 그 전 영업일(오후 1시 전이면 그 전전 영업일)이다. 미발행 날짜는 미확보로 두고 전날 값으로 채우지 않는다.
검증 기본 상한(요청 50회 · 10거래일 · 표본 20종목)은 공식 허용량이 아니라 이번 작업의 보수적 상한이다.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

import source_compliance as compliance                              # noqa: E402
from data_supply import contracts, fsc_stock_price as fsc, fsc_daily_store as store   # noqa: E402
from krx_calendar import is_krx_trading_day                         # noqa: E402

KST = dt.timezone(dt.timedelta(hours=9))
PUBLISH_HOUR_KST = 13
DEFAULT_VERIFY_DAYS = 10
DEFAULT_VERIFY_CODES = 20
DEFAULT_VERIFY_MAX_REQUESTS = 50
DEFAULT_DUE_MAX_REQUESTS = 6
DEFAULT_DUE_LOOKBACK_DAYS = 3
EXIT_OK, EXIT_FAILED, EXIT_GATE_CLOSED, EXIT_CREDENTIALS_MISSING, EXIT_NOTHING_VERIFIED = 0, 1, 2, 3, 4
STORAGE_ESTIMATE_PER_DAY_BYTES = 120_000        # 전 종목 하루 gz 추정(실측 전 · 검증 뒤 실제 파일 크기로 갱신)


def kst_now():
    return dt.datetime.now(KST)


def previous_trading_day(day):
    day = day - dt.timedelta(days=1)
    while not is_krx_trading_day(day):
        day -= dt.timedelta(days=1)
    return day


def next_trading_day(day):
    day = day + dt.timedelta(days=1)
    while not is_krx_trading_day(day):
        day += dt.timedelta(days=1)
    return day


def latest_available_trading_date(now=None):
    """지금 받을 수 있는 최신 기준일(YYYY-MM-DD). 발표 규칙(다음 영업일 13:00)을 적용한다."""
    now = now or kst_now()
    today = now.date()
    day = previous_trading_day(today)
    while True:
        published_on = next_trading_day(day)
        if published_on < today or (published_on == today and now.hour >= PUBLISH_HOUR_KST):
            return day.isoformat()
        day = previous_trading_day(day)


def available_trading_dates(count, now=None):
    """받을 수 있는 최근 count 거래일(오름차순)."""
    latest = dt.date.fromisoformat(latest_available_trading_date(now))
    out = [latest]
    while len(out) < count:
        out.append(previous_trading_day(out[-1]))
    return [d.isoformat() for d in reversed(out)]


def secret_present():
    return bool(str(os.environ.get(fsc.KEY_ENV) or '').strip())


def load_tickers(root=ROOT):
    import update_price_history as uph
    old = uph.HERE
    uph.HERE = root
    try:
        return uph.load_tickers()
    finally:
        uph.HERE = old


def plan(dates, root=None):
    manifest = store.load_manifest(root)
    missing = [d for d in dates if (manifest['days'].get(d) or {}).get('status') != 'COMPLETE']
    return {'targetDates': dates, 'missingDates': missing, 'alreadyComplete': [d for d in dates if d not in missing],
            'requestsEstimate': {'ifOnePagePerDay': len(missing), 'ifTwoPagesPerDay': len(missing) * 2,
                                 'note': '한 페이지에 전 종목이 온다고 가정하지 않는다 — 실제 페이지 수는 응답으로 잰다'},
            'storageEstimateBytes': len(missing) * STORAGE_ESTIMATE_PER_DAY_BYTES,
            'resume': '같은 명령을 다시 돌리면 COMPLETE 인 날은 건너뛴다(manifest 기준) — 중단·재개는 그것으로 충분하다'}


def collect_dates(dates, *, budget, root=None, requested_by='manual', run_id=None, gate=None, opener=None,
                  service_key=None):
    """기준일 목록을 예산 안에서 받아 저장한다. 결과는 값이 아니라 개수·상태만 담는다."""
    per_day = []
    for trading_date in dates:
        bas_dt = trading_date.replace('-', '')
        try:
            result = fsc.fetch_day(bas_dt, budget=budget, gate=gate, opener=opener, service_key=service_key)
        except (compliance.LegalGateError, fsc.CredentialsMissing):
            raise
        except contracts.ContractError as exc:
            per_day.append({'tradingDate': trading_date, 'status': 'FAILED', 'error': fsc.redact(str(exc), service_key)[:160],
                            'saved': {'action': 'REJECTED'}})
            if isinstance(exc, fsc.BudgetExhausted):
                break
            continue
        saved = store.save_day(result, root, requested_by=requested_by, run_id=run_id)
        per_day.append({
            'tradingDate': trading_date, 'status': result['completeness']['status'],
            'reason': result['completeness'].get('reason'), 'error': result['completeness'].get('error'),
            'pages': result['pages'], 'requests': result['requests'],
            'totalCountReported': result['totalCountReported'], 'rawRowCount': result['rawRowCount'],
            'validRowCount': result['validRowCount'], 'rejectedCount': result['rejectedCount'],
            'outOfRange': result['outOfRange'], 'codeMismatch': result['codeMismatch'],
            'duplicatesIdentical': result['duplicatesIdentical'], 'conflicts': len(result['conflicts']),
            'structureVerified': result['structure']['structureVerified'], 'codeFormats': result['structure']['codeFormats'],
            'numOfRowsEchoed': [p['numOfRows'] for p in result['pageMeta']],
            'requestedAt': result['requestedAt'], 'receivedAt': result['receivedAt'],
            'saved': saved,
        })
        if budget.requests >= budget.max_requests:
            break
    return per_day


def sample_checks(dates, codes, root=None):
    """표본 종목이 각 기준일에 있는지·식별 교차확인·거래량 0 개수. 값은 남기지 않는다."""
    by_date = {}
    for trading_date in dates:
        record = store.load_day(trading_date, root)
        by_date[trading_date] = {r['code']: r for r in (record or {}).get('rows', [])}
    out = {'codes': list(codes), 'dates': list(dates), 'presence': {}, 'isinMismatch': 0, 'isinUnknown': 0,
           'volumeZeroRows': 0, 'codePrefixSeen': 0, 'missingPairs': []}
    for code in codes:
        present = 0
        for trading_date, rows in by_date.items():
            row = rows.get(code)
            if not row:
                out['missingPairs'].append({'code': code, 'tradingDate': trading_date})
                continue
            present += 1
            if row.get('isinMatchesCode') is False:
                out['isinMismatch'] += 1
            elif row.get('isinMatchesCode') is None:
                out['isinUnknown'] += 1
            if row.get('volume') == 0:
                out['volumeZeroRows'] += 1
            if row.get('codePrefix'):
                out['codePrefixSeen'] += 1
        out['presence'][code] = {'present': present, 'of': len(by_date)}
    out['allPresent'] = not out['missingPairs']
    return out


def compare_with_local_history(codes, root=None):
    """기존 price_history.js(레거시 표본)와 같은 종목·같은 거래일만 대조한다 — 개수만 남기고 값은 남기지 않는다.
    양쪽 모두 가격 조정 기준이 확인되지 않았으므로 INFORMATIONAL 이다(같다고 정답, 다르다고 오답이 아니다)."""
    import update_price_history as uph
    path = os.path.join(root or ROOT, 'price_history.js')
    legacy = uph.load_js_object(path, 'PRICE_HISTORY') or {}
    official = store.load_series(set(codes), root)
    stats = {k: {'same': 0, 'different': 0} for k in ('open', 'high', 'low', 'close', 'volume')}
    pairs = 0
    for code in codes:
        legacy_days = {d['date']: d for p in legacy.get(code, []) for d in p.get('days', [])}
        for bar in official.get(code, []):
            ref = legacy_days.get(bar['date'])
            if not ref:
                continue
            pairs += 1
            for key in stats:
                if ref.get(key) is None:
                    continue
                if float(ref[key]) == float(bar[key]):
                    stats[key]['same'] += 1
                else:
                    stats[key]['different'] += 1
    return {'basis': 'INFORMATIONAL — 조정 기준 미확인(양쪽) · 같은 종목·같은 거래일·같은 단위(원·주)만 대조',
            'pairsCompared': pairs, 'fieldStats': stats, 'legacyFileExists': bool(legacy)}


def _gate_summary():
    gate = fsc.gate_state()
    return {k: gate[k] for k in ('verdict', 'gates', 'state', 'commercialState')}


def run_verify(args, now=None, gate=None, opener=None, service_key=None):
    root = args.root
    report = {'schemaVersion': 'fsc-verify-report-v1', 'mode': 'verify', 'runAt': fsc._utcnow(),
              'runAtKst': (now or kst_now()).isoformat(timespec='minutes'), 'datasetId': fsc.DATASET_ID,
              'operation': fsc.OPERATION, 'secretPresent': secret_present() or bool(service_key),
              'keyForm': fsc.service_key_form(service_key or os.environ.get(fsc.KEY_ENV)),
              'gate': _gate_summary(), 'limits': {'days': args.days, 'codesLimit': args.codes_limit,
                                                   'maxRequests': args.max_requests,
                                                   'note': '이번 작업의 보수적 상한 — 공식 허용량이 아니다'},
              'quotaHints': fsc.QUOTA_HINTS, 'priceBasis': fsc.PRICE_BASIS, 'adjustmentStatus': fsc.ADJUSTMENT_STATUS}
    dates = available_trading_dates(args.days, now)
    report['targetDates'] = dates
    report['plan'] = plan(dates, root)
    tickers = load_tickers(root)
    sample = sorted(tickers)[:args.codes_limit]
    report['sampleCodes'] = sample
    budget = fsc.RequestBudget(args.max_requests)
    try:
        report['perDay'] = collect_dates(dates, budget=budget, root=root, requested_by='verify',
                                         run_id=os.environ.get('GITHUB_RUN_ID'), gate=gate, opener=opener,
                                         service_key=service_key)
    except compliance.LegalGateError as exc:
        report.update(conclusion='GATE_CLOSED', reason=str(exc)[:200], budget=budget.summary())
        return report, EXIT_GATE_CLOSED
    except fsc.CredentialsMissing:
        report.update(conclusion='CREDENTIALS_MISSING', budget=budget.summary(),
                      reason=f'{fsc.KEY_ENV} 없음 — 활용신청 승인 뒤 Actions Secret 에 같은 이름으로 저장')
        return report, EXIT_CREDENTIALS_MISSING
    report['budget'] = budget.summary()
    stored = [d['tradingDate'] for d in report['perDay'] if d['saved'].get('action') in ('CREATED', 'UNCHANGED', 'CORRECTED')]
    complete = [d['tradingDate'] for d in report['perDay'] if d['status'] == 'COMPLETE' and d['tradingDate'] in stored]
    report['storedDates'] = stored
    report['completeDates'] = complete
    report['sampleChecks'] = sample_checks(stored, sample, root) if stored else None
    report['comparison'] = compare_with_local_history(sample, root) if stored else None
    report['storeIntegrity'] = store.verify_store(root)
    problems = []
    if not stored:
        problems.append('NO_DATE_STORED')
    if len(complete) < len(dates):
        problems.append(f'INCOMPLETE_DATES {len(dates) - len(complete)}/{len(dates)}')
    if any(not d.get('structureVerified') for d in report['perDay'] if d['status'] != 'FAILED'):
        problems.append('STRUCTURE_UNVERIFIED')
    if any(d.get('conflicts') for d in report['perDay']):
        problems.append('CONFLICTING_ROWS')
    if any(d.get('rejectedCount') for d in report['perDay']):
        problems.append(f"REJECTED_ROWS {sum(d.get('rejectedCount') or 0 for d in report['perDay'])}")
    if any(d.get('codeMismatch') or d.get('outOfRange') for d in report['perDay']):
        problems.append('OUT_OF_SCOPE_ROWS')
    if report['sampleChecks'] and not report['sampleChecks']['allPresent']:
        problems.append(f"SAMPLE_MISSING {len(report['sampleChecks']['missingPairs'])}")
    if not report['storeIntegrity']['ok']:
        problems.append('STORE_INTEGRITY')
    report['problems'] = problems
    if not stored:
        report['conclusion'] = 'LIVE_DATA_FAILED'
        return report, EXIT_NOTHING_VERIFIED
    report['conclusion'] = 'LIVE_DATA_VERIFIED' if not problems else 'LIVE_DATA_PARTIAL'
    return report, EXIT_OK


def run_collect(args, now=None, gate=None, opener=None, service_key=None):
    """--if-due(최근 며칠 중 비어 있는 날만) 또는 --backfill(N 거래일). 둘 다 예산 상한 안에서만."""
    root = args.root
    mode = 'if-due' if args.if_due else 'backfill'
    days = DEFAULT_DUE_LOOKBACK_DAYS if args.if_due else args.days
    dates = available_trading_dates(days, now)
    todo = plan(dates, root)['missingDates']
    report = {'schemaVersion': 'fsc-collect-report-v1', 'mode': mode, 'runAt': fsc._utcnow(),
              'secretPresent': secret_present() or bool(service_key), 'gate': _gate_summary(),
              'targetDates': dates, 'missingDates': todo, 'maxRequests': args.max_requests}
    if not todo:
        report.update(conclusion='NOT_DUE', perDay=[], budget=None)
        return report, EXIT_OK
    budget = fsc.RequestBudget(args.max_requests)
    try:
        report['perDay'] = collect_dates(todo, budget=budget, root=root, requested_by=mode,
                                         run_id=os.environ.get('GITHUB_RUN_ID'), gate=gate, opener=opener,
                                         service_key=service_key)
    except compliance.LegalGateError as exc:
        report.update(conclusion='GATE_CLOSED', reason=str(exc)[:200], budget=budget.summary())
        return report, EXIT_GATE_CLOSED
    except fsc.CredentialsMissing:
        report.update(conclusion='CREDENTIALS_MISSING', budget=budget.summary())
        return report, EXIT_CREDENTIALS_MISSING
    report['budget'] = budget.summary()
    report['storeIntegrity'] = store.verify_store(root)
    stored = [d['tradingDate'] for d in report['perDay'] if d['saved'].get('action') in ('CREATED', 'UNCHANGED', 'CORRECTED')]
    report['storedDates'] = stored
    report['conclusion'] = 'COLLECTED' if stored else 'NOTHING_COLLECTED'
    return report, (EXIT_OK if stored else EXIT_FAILED)


def print_summary(report):
    keys = ('mode', 'conclusion', 'reason', 'targetDates', 'storedDates', 'completeDates', 'problems', 'budget')
    print(json.dumps({k: report.get(k) for k in keys if k in report}, ensure_ascii=False, indent=1))
    for day in report.get('perDay') or []:
        print(f"  {day['tradingDate']}: {day['status']} rows={day.get('validRowCount')}/{day.get('rawRowCount')} "
              f"pages={day.get('pages')} total={day.get('totalCountReported')} saved={day['saved'].get('action')}"
              + (f" error={day.get('error')}" if day.get('error') else ''))


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument('--plan', action='store_true', help='네트워크 0 — 대상 기준일·빠진 날·요청/저장 추정만')
    mode.add_argument('--verify', action='store_true', help='작고 제한된 범위의 실응답 검증(저장 + 보고서)')
    mode.add_argument('--if-due', action='store_true', help='최근 며칠 중 비어 있는 기준일만 수집(하루 1회용)')
    mode.add_argument('--backfill', action='store_true', help='N 거래일 백필(예산 상한 필수)')
    ap.add_argument('--days', type=int, default=DEFAULT_VERIFY_DAYS)
    ap.add_argument('--codes-limit', type=int, default=DEFAULT_VERIFY_CODES)
    ap.add_argument('--max-requests', type=int, default=None)
    ap.add_argument('--root', default=ROOT)
    ap.add_argument('--report', default=None, help='보고서를 저장할 파일(기본: 저장소 verification/ 폴더)')
    ap.add_argument('--summary', default=None, help='요약을 덧붙일 파일(GITHUB_STEP_SUMMARY 등)')
    args = ap.parse_args(argv)
    if args.max_requests is None:
        args.max_requests = DEFAULT_DUE_MAX_REQUESTS if args.if_due else DEFAULT_VERIFY_MAX_REQUESTS
    print(f'SECRET_PRESENT={"true" if secret_present() else "false"}')
    if args.plan:
        out = plan(available_trading_dates(args.days), args.root)
        out['latestAvailableTradingDate'] = latest_available_trading_date()
        print(json.dumps(out, ensure_ascii=False, indent=1))
        return EXIT_OK
    gate = fsc.gate_state()
    print(f"GATE={gate['gates']['automatedCollection']} state={gate['state']} commercial={gate['commercialState']}")
    if args.verify:
        report, code = run_verify(args)
    else:
        report, code = run_collect(args)
    if args.report:
        store._write_json(args.report, report)
        rel = args.report
    else:
        rel = store.save_verification_report(report, args.root) if args.verify else None
    print_summary(report)
    print(f'CONCLUSION={report.get("conclusion")}')
    if rel:
        print(f'REPORT={rel}')
    if args.summary:
        with open(args.summary, 'a', encoding='utf-8') as handle:
            handle.write(f"### FSC 15094808 {report.get('mode')} — {report.get('conclusion')}\n\n")
            handle.write('```\n' + json.dumps({k: report.get(k) for k in ('targetDates', 'storedDates', 'completeDates',
                                                                        'problems', 'budget', 'reason')},
                                              ensure_ascii=False, indent=1) + '\n```\n')
    return code


if __name__ == '__main__':
    sys.exit(main())
