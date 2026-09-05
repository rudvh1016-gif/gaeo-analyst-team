"""Retrospective BUY disclosure, isolated from learning weights and judgments."""
import bisect
import collections
import math
import random

from buy_warning import (OVERHEAT_VERSION, OVERHEAT_RET5_PCT, OVERHEAT_RET20_PCT,
                         finite_number, historical_flag, vol20_at)

BUY_CRASH_PCT = -5.0


def block(rows):
    if not rows:
        return None
    n=len(rows); hit=sum(r['ret5']>1 for r in rows); miss=sum(r['ret5']< -1 for r in rows)
    return dict(n=n, graded=hit+miss, hit=hit, miss=miss, excluded=n-hit-miss,
                acc=round(hit/(hit+miss)*100,1) if hit+miss else None,
                positivePct=round(sum(r['ret5']>0 for r in rows)/n*100,1),
                crashPct=round(sum(r['ret5']<=BUY_CRASH_PCT for r in rows)/n*100,1),
                meanRet=round(sum(r['ret5'] for r in rows)/n,2),
                uniqueDecisionDays=len({r['day'] for r in rows}),
                firstDecisionDate=min(r['day'] for r in rows),lastDecisionDate=max(r['day'] for r in rows))


def gap_ci(rows, block_length=5):
    dc={}
    for r in rows:
        a=dc.setdefault(r['day'],[0,0,0,0]);j=0 if r['warn'] else 2
        a[j]+=r['ret5']<=BUY_CRASH_PCT;a[j+1]+=1
    days=sorted(dc);n=len(days)
    if n<max(3,2*block_length):return None
    rng=random.Random(20260905);values=[]
    for _ in range(2000):
        picked=[]
        while len(picked)<n:
            start=rng.randrange(n-block_length+1)
            picked.extend(days[start:start+block_length])
        agg=[sum(dc[d][i] for d in picked[:n]) for i in range(4)]
        if agg[1] and agg[3]:values.append(100*(agg[0]/agg[1]-agg[2]/agg[3]))
    if len(values)<1800:return None
    values.sort()
    return [round(values[int(len(values)*q)],1) for q in (.025,.975)]


def warning_block(rows):
    known=[r for r in rows if r['available']]
    warn=[r for r in known if r['warn']];calm=[r for r in known if not r['warn']]
    result=dict(enoughSample=len(warn)>=10 and len(calm)>=10,
                evidenceStatus='EXPLORATORY_NOT_VALIDATED',warnN=len(warn),calmN=len(calm),
                unknownN=len(rows)-len(known),warn=block(warn),calm=block(calm))
    if result['enoughSample']:
        result.update(crashGapPp=round(result['warn']['crashPct']-result['calm']['crashPct'],1),
                      crashGapCi95=gap_ci(known),
                      warnSharePct=round(len(warn)/len(rows)*100,1))
    return result


def matched_baseline(pool, buy):
    """Each BUY date receives its BUY count as weight, each code once per date.
    This is the observed auto-record pool, not all listed stocks or a portfolio.
    """
    byday=collections.defaultdict(list)
    for r in pool:byday[r['day']].append(r)
    counts=collections.Counter(r['day'] for r in buy)
    denominator=sum(counts.values());hit=miss=crash=positive=mean=0.0;pooln=0
    for day,n in counts.items():
        peers=byday[day];m=len(peers);pooln+=m
        hit+=n*sum(r['ret5']>1 for r in peers)/m
        miss+=n*sum(r['ret5']< -1 for r in peers)/m
        crash+=n*sum(r['ret5']<=BUY_CRASH_PCT for r in peers)/m
        positive+=n*sum(r['ret5']>0 for r in peers)/m
        mean+=n*sum(r['ret5'] for r in peers)/m
    if not denominator:return None
    return dict(n=pooln,weightedDecisionN=denominator,uniqueDecisionDays=len(counts),
                acc=round(100*hit/(hit+miss),1) if hit+miss else None,
                positivePct=round(100*positive/denominator,1),
                crashPct=round(100*crash/denominator,1),meanRet=round(mean/denominator,2),
                selection='observed_auto_unique_code_date_buy_date_weighted',
                note='실제 자동판단 기록이 있는 종목을 날짜별 동일 비중으로 비교하고 BUY 발생일 비중을 맞춘 참고 기준선입니다. 전체 상장 종목이나 실제 무작위 매매 성과가 아닙니다.')


def compute(hist, closes, names, current_versions, record_version):
    mixed=[];observed={};dropped=collections.Counter()
    for code,entries in hist.items():
        if not isinstance(entries,list) or code not in closes:continue
        prices=closes[code];dates=[r['date'] for r in prices]
        for e in entries:
            if not isinstance(e,dict):continue
            base=finite_number(e.get('base'));day=str(e.get('date',''))[:10]
            if base is None or base<=0 or not day or e.get('judgmentWithheld') or e.get('call') not in ('BUY','HOLD','SELL'):continue
            j=bisect.bisect_right(dates,day)+4
            if j>=len(prices):continue
            final=finite_number(prices[j].get('close'))
            if final is None or final<=0:continue
            r=dict(code=code,day=day,ret5=(final-base)/base*100,call=e['call'],
                   version=record_version(e),recon=bool(e.get('recon')),auto=e.get('tier')=='auto')
            mixed.append(r)
            if r['recon']:dropped['reconstructed']+=1;continue
            if not r['auto']:dropped['nonAuto']+=1;continue
            # Recorded signal wins for future rows, and is version checked. Older
            # payloads are reconstructed, never silently interpreted as this rule.
            saved=e.get('overheat') or {}
            signal=saved if saved.get('version')==OVERHEAT_VERSION else historical_flag(prices,day,base)
            r.update(warn=bool(signal.get('warn')),available=bool(signal.get('available')),
                     featureSource='recorded' if saved.get('version')==OVERHEAT_VERSION else 'reconstructed_known_base',
                     vol=(finite_number(signal.get('vol20')) if saved.get('version')==OVERHEAT_VERSION
                          else vol20_at(prices,day,base)),
                     decisionCandlePresent=day in dates)
            key=(code,day)
            if key in observed:
                # Duplicate auto rows cannot be arbitrarily cherry-picked.
                observed[key]=None;dropped['duplicateCodeDate']+=1
            else:observed[key]=r
    pool=[r for r in observed.values() if r is not None]
    buy=[r for r in pool if r['call']=='BUY'];current=[r for r in buy if r['version'] in current_versions]
    legacy=[r for r in mixed if r['call']=='BUY']
    worst=sorted(buy,key=lambda r:r['ret5'])[:3]
    normalized={}
    for name,flag in [('surge',lambda r:r['warn']),('volatility',lambda r:r['vol']>=4)]:
        eligible=[r for r in buy if r['available'] and r['vol'] is not None and r['vol']>0]
        groups=[[r for r in eligible if bool(flag(r))==side] for side in (True,False)]
        rates=[sum(r['ret5']<=-r['vol']*math.sqrt(5) for r in g)/len(g)*100 if g else None for g in groups]
        normalized[name]=dict(flagPct=round(rates[0],1) if rates[0] is not None else None,
                              otherPct=round(rates[1],1) if rates[1] is not None else None,
                              gapPp=round(rates[0]-rates[1],1) if all(v is not None for v in rates) else None)
    return dict(basis='call_hit_5d_pm1pct',schemaVersion=2,warningVersion=OVERHEAT_VERSION,
                evidenceStatus='EXPLORATORY_NOT_VALIDATED',crashBasis='fifth_session_close_return',
                crashThresholdPct=BUY_CRASH_PCT,
                overheatThresholds=dict(ret5=OVERHEAT_RET5_PCT,ret20=OVERHEAT_RET20_PCT),
                allTime=block(buy),currentVersion=block(current),
                legacyMixed=block(legacy),reconstructed=block([r for r in legacy if r['recon']]),
                nonAuto=block([r for r in legacy if not r['auto']]),
                randomBaseline=matched_baseline(pool,buy),
                currentRandomBaseline=matched_baseline([r for r in pool if r['version'] in current_versions],current),
                cautionMatrix={k:block([r for r in buy if ('caution' if r['warn'] else ('none' if r['available'] else 'unknown'))==k])
                               for k in ('none','caution','unknown')},
                overheatAllTime=warning_block(buy),overheatCurrent=warning_block(current),
                normalizedRiskDiagnostic=normalized,
                provenance=dict(excludedRecords=dict(dropped),
                                featureSources=dict(collections.Counter(r['featureSource'] for r in buy)),
                                noDecisionCandleBuyN=sum(not r['decisionCandlePresent'] for r in buy)),
                intervalMethod='moving_block_5_decision_dates_percentile_2000_unadjusted_exploratory',
                worst=[dict(code=r['code'],name=names.get(r['code'],r['code']),date=r['day'],ret5=round(r['ret5'],1)) for r in worst],
                note='사후 재구성과 정밀분석을 제외한 실제 자동판단 기록입니다. 적중률은 ±1% 안쪽을 제외합니다. 손실 비율은 5번째 거래일 종가 기준이며 기간 중 최대 손실이나 거래비용을 반영하지 않습니다.')
