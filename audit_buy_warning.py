#!/usr/bin/env python3
"""Reproducible, retrospective sensitivity audit. Offline; no production writes.

python3 audit_buy_warning.py --output /tmp/buy-audit.json
All intervals are exploratory, unadjusted for candidate selection. Consecutive
date blocks preserve overlapping outcomes; they do not establish causality/OOS.
"""
import argparse
import bisect
import collections
import hashlib
import json
import math
import random
from pathlib import Path

import compute_team_weights as W

ROOT = Path(__file__).resolve().parent


def rows_from_history(hist, closes, mode="legacy"):
    out = []
    for code, entries in hist.items():
        if not isinstance(entries, list) or code not in closes:
            continue
        prices = closes[code]
        dates = [r["date"] for r in prices]
        for e in entries:
            day, base = str(e.get("date", ""))[:10], e.get("base")
            if not base or e.get("judgmentWithheld") or e.get("call") not in ("BUY", "SELL", "HOLD"):
                continue
            end = bisect.bisect_right(dates, day)
            if end + 5 > len(prices):
                continue
            prior = bisect.bisect_left(dates, day)
            cl = [r["close"] for r in prices[:end]]
            # Safe reconstruction: never use the completed decision-day candle.
            # The recorded decision price is known at decision time.
            known = [r["close"] for r in prices[:prior]]
            has_day = prior < len(dates) and dates[prior] == day
            if has_day:
                known.append(base)
            # A holiday/stale snapshot is not another zero-return trading day.
            feature = cl if mode == "legacy" else known
            rets = [(feature[k] / feature[k-1] - 1) * 100
                    for k in range(1, len(feature)) if feature[k-1] > 0][-20:]
            vol = math.sqrt(sum((x - sum(rets)/len(rets))**2 for x in rets)/len(rets)) if len(rets) >= 6 else None
            logrets=[math.log(feature[k]/feature[k-1])*100 for k in range(1,len(feature))
                     if feature[k]>0 and feature[k-1]>0][-20:]
            logvol=math.sqrt(sum((x-sum(logrets)/len(logrets))**2 for x in logrets)/len(logrets)) if len(logrets)>=6 else None
            lag = lambda n: (base-feature[-n-1])/feature[-n-1]*100 if len(feature)>n and feature[-n-1]>0 else None
            r5, r20 = lag(5), lag(20)
            r = dict(code=code, day=day, call=e["call"], recon=bool(e.get("recon")),
                     auto=e.get("tier")=="auto", version=W.record_base_version(e),
                     r5=r5, r20=r20, vol=vol,logVol=logvol,volN=len(rets),
                     hot=(r5 is not None and r5>=10) or (r20 is not None and r20>=25),
                     swing=vol is not None and vol>=4,
                     baseCloseMismatch=end>0 and prices[end-1]["close"]!=base,
                     decisionSession=has_day,
                     entry=e)
            for n in (5, 10, 20):
                window=prices[end:end+n]
                if len(window)==n:
                    r[f"ret{n}"]=(window[-1]["close"]-base)/base*100
                    r[f"min{n}"]=min((p["close"]-base)/base*100 for p in window)
                    r[f"low{n}"]=min((p.get("low",p["close"])-base)/base*100 for p in window)
                    r[f"end{n}"]=window[-1]["date"]
            out.append(r)
    return out


def summary(rows, horizon=5):
    rows=[r for r in rows if f"ret{horizon}" in r]
    if not rows:
        return None
    rets=[r[f"ret{horizon}"] for r in rows]
    hit=sum(v>1 for v in rets); miss=sum(v< -1 for v in rets)
    return dict(n=len(rows), days=len({r['day'] for r in rows}),
                first=min(r['day'] for r in rows), last=max(r['day'] for r in rows),
                hit=hit, graded=hit+miss, acc=round(100*hit/(hit+miss),3) if hit+miss else None,
                positivePct=round(100*sum(v>0 for v in rets)/len(rets),3),
                mean=round(sum(rets)/len(rets),4),
                crash=round(100*sum(v<=-5 for v in rets)/len(rets),3),
                pathCrash=round(100*sum(r[f'min{horizon}']<=-5 for r in rows)/len(rows),3),
                intradayLowCrash=round(100*sum(r[f'low{horizon}']<=-5 for r in rows)/len(rows),3))


def moving_ci(day_values, stat, length=5, rounds=2000):
    days=sorted(day_values); n=len(days)
    if n<max(3,2*length):
        return None
    rng=random.Random(20260905); values=[]
    # Non-circular overlapping blocks. Do not join the last date to the first.
    blocks=[days[i:i+length] for i in range(n-length+1)]
    for _ in range(rounds):
        chosen=[]
        while len(chosen)<n:
            chosen.extend(rng.choice(blocks))
        agg=[0.0]*len(next(iter(day_values.values())))
        for day in chosen[:n]:
            for j,v in enumerate(day_values[day]): agg[j]+=v
        v=stat(agg)
        if v is not None: values.append(v)
    if len(values)<rounds*.9:return None
    values.sort()
    return [round(values[int(len(values)*q)],3) for q in (.025,.975)]


def comparison(rows, flag, event, horizon=5):
    dc={}
    for r in rows:
        v=event(r)
        if v is None:continue
        a=dc.setdefault(r['day'],[0,0,0,0]); j=0 if flag(r) else 2
        a[j]+=v; a[j+1]+=1
    agg=[sum(v[j] for v in dc.values()) for j in range(4)]
    stat=lambda a:100*(a[0]/a[1]-a[2]/a[3]) if a[1] and a[3] else None
    return dict(gap=round(stat(agg),3) if stat(agg) is not None else None,
                flagN=agg[1], otherN=agg[3],
                flagPct=round(100*agg[0]/agg[1],3) if agg[1] else None,
                otherPct=round(100*agg[2]/agg[3],3) if agg[3] else None,
                ciDay=moving_ci(dc,stat,1),ci5Days=moving_ci(dc,stat,5) if horizon==5 else None,
                intervalBlockLength=horizon,ciHorizonDays=moving_ci(dc,stat,horizon))


def control(rows, axes, sectors):
    """Standardize controls to BUY's date/stratum counts, including BUY in pool.
    Empty/missing cells are reported, never silently reclassified as low risk.
    """
    def key(r):
        k=[]
        for a in axes:
            if a=='day': k.append(r['day'])
            elif a=='sector': k.append(sectors.get(r['code'],'UNKNOWN'))
            else:
                v=r[a]
                if v is None:return None
                cuts=[-5,0,3,7,15] if a=='r5' else [2,3,4,5]
                k.append(bisect.bisect_right(cuts,v))
        return tuple(k)
    cells=collections.defaultdict(list)
    for r in rows:
        k=key(r)
        if k is not None: cells[k].append(r)
    byday={}; matched=0; sparse=0; differences=[]
    for k,pool in cells.items():
        buy=[r for r in pool if r['call']=='BUY']
        if not buy:continue
        n=len(pool); pm=sum(r['ret5'] for r in pool)/n
        pc=sum(r['ret5']<=-5 for r in pool)/n
        for r in buy:
            a=byday.setdefault(r['day'],[0,0,0]); a[0]+=r['ret5']-pm
            a[1]+=(r['ret5']<=-5)-pc; a[2]+=1
        matched+=len(buy)
        if n-len(buy)<5:sparse+=len(buy)
        differences.append(dict(stratum=list(k),buyN=len(buy),poolN=n,
                                buyMean=summary(buy)['mean'],poolMean=summary(pool)['mean'],
                                buyCrash=summary(buy)['crash'],poolCrash=summary(pool)['crash']))
    tot=[sum(a[i] for a in byday.values()) for i in range(3)]
    return dict(matched=matched, sparseNonBuyN=sparse,
                meanGap=round(tot[0]/tot[2],4) if tot[2] else None,
                crashGap=round(100*tot[1]/tot[2],4) if tot[2] else None,
                meanCi5Days=moving_ci(byday,lambda a:a[0]/a[2] if a[2] else None),
                crashCi5Days=moving_ci(byday,lambda a:100*a[1]/a[2] if a[2] else None),
                cells=differences if len(differences)<=30 else None,
                intervalCaveat='For pooled strata, benchmark fixed at observed pool; use date-matched controls for paired date bootstrap.')


def analyst_audit(hist, closes):
    dates={c:[r['date'] for r in rs] for c,rs in closes.items()}
    cache={}
    def market(day,n):
        if (day,n) in cache:return cache[(day,n)]
        values=[]
        for c,rs in closes.items():
            j=bisect.bisect_right(dates[c],day)
            if j and j+n<=len(rs) and rs[j-1]['close']:
                values.append((rs[j+n-1]['close']/rs[j-1]['close']-1)*100)
        values.sort();k=len(values)
        answer=(values[k//2] if k%2 else (values[k//2-1]+values[k//2])/2) if k>=30 else None
        cache[(day,n)]=answer;return answer
    result={}
    for scope in ('new','old','oldObservedAuto'):
        stats={a:{} for a in W.ANALYSTS};recon=collections.Counter()
        for c,entries in hist.items():
            if not isinstance(entries,list) or c not in closes:continue
            rs=closes[c]
            for e in entries:
                isnew=W.record_base_version(e)==W.BASE_MODEL_VERSION
                if isnew!=(scope=='new'):continue
                if scope=='oldObservedAuto' and (e.get('recon') or e.get('tier')!='auto'):continue
                if not e.get('base') or e.get('judgmentWithheld') or e.get('call')=='JUDGMENT_WITHHELD':continue
                day=str(e.get('date',''))[:10];j=bisect.bisect_right(dates[c],day)
                for a,rule in W.RULES.items():
                    stance=(e.get(a) or {}).get('stance');n=rule['days']
                    if stance not in ('bull','bear') or j+n>len(rs):continue
                    ret=(rs[j+n-1]['close']/e['base']-1)*100
                    m=market(day,n);exc=ret-m if m is not None else ret
                    blk=stats[a].setdefault(day,dict(own=[0,0],bull=[0,0],bear=[0,0]))
                    for key,direction in [('own',stance),('bull','bull'),('bear','bear')]:
                        score=W.score_stance(direction,exc,rule['deadband'])
                        if score in ('hit','miss'):blk[key][score=='miss']+=1
                    if e.get('recon') and W.score_stance(stance,exc,rule['deadband']) in ('hit','miss'):recon[a]+=1
        result[scope]={}
        for a,dc in stats.items():
            agg={k:[sum(v[k][i] for v in dc.values()) for i in (0,1)] for k in ('own','bull','bear')}
            result[scope][a]=dict(n=sum(agg['own']),days=len(dc),reconstructedGradedN=recon[a],
                                 acc=W._stat_own(agg),lift=W._stat_lift(agg),
                                 legacyCi=W._block_bootstrap(dc,W._stat_lift,block_length=1),
                                 movingCi=W._block_bootstrap(dc,W._stat_lift,block_length=W.RULES[a]['days']))
    return result


def run():
    hist=W.load_js_object(str(ROOT/'history.js'),'LIVE_HISTORY')
    data=json.loads((ROOT/'analysis_data.json').read_text())
    closes={c:sorted(s['daily'],key=lambda r:r['date']) for c,s in data['stocks'].items() if s.get('daily')}
    legacy=rows_from_history(hist,closes); safe=rows_from_history(hist,closes,'base_known')
    sectors=W.load_sectors(); report={
        'startingCommit':'3cf45061d7c56e61d843c683882cd1e043ae4c49',
        'sourceSHA256':{f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in ('history.js','analysis_data.json','tickers.js')},
        'sourceFetchedAt':data.get('fetchedAt'), 'inference':'RETROSPECTIVE_EXPLORATORY_NOT_OOS'}
    for label,pool in [('legacyMixed',legacy),('knownBaseMixed',safe),('observedAuto', [r for r in safe if r['auto'] and not r['recon']])]:
        buy=[r for r in pool if r['call']=='BUY']
        b={'buy':summary(buy),'pool':summary(pool),'baseCloseMismatch':sum(r['baseCloseMismatch'] for r in buy),
           'noDecisionCandle':sum(not r['decisionSession'] for r in buy),
           'sessionOnly':summary([r for r in buy if r['decisionSession']])}
        b['cohorts']={k:summary([r for r in buy if fn(r)]) for k,fn in {
            'reconstructed':lambda r:r['recon'],'manual':lambda r:not r['auto'],
            'current':lambda r:r['version']==W.BASE_MODEL_VERSION,
            'old':lambda r:r['version']!=W.BASE_MODEL_VERSION}.items()}
        b['warnings']={}
        for name,flag in [('surge',lambda r:r['hot']),('volatility',lambda r:r['swing']),('union',lambda r:r['hot'] or r['swing'])]:
            res={'kept':summary([r for r in buy if not flag(r)]),
                 'fixed':comparison(buy,flag,lambda r:r['ret5']<=-5),
                 'normalized':comparison(buy,flag,lambda r:r['ret5']<=-r['vol']*math.sqrt(5) if r['vol'] and r['vol']>0 else None)}
            res['normalizedSampleSD']=comparison(buy,flag,lambda r:r['ret5']<=-r['vol']*math.sqrt(5*r['volN']/(r['volN']-1)) if r['vol'] and r['vol']>0 and r['volN']>1 else None)
            res['normalizedLog']=comparison(buy,flag,lambda r:100*math.log1p(r['ret5']/100)<=-r['logVol']*math.sqrt(5) if r['logVol'] and r['logVol']>0 and r['ret5']>-100 else None)
            res['sensitivity']={}
            for n in (5,10,20):
                eligible=[r for r in buy if f'ret{n}' in r]
                res['sensitivity'][str(n)]={str(t):comparison(eligible,flag,lambda r:r[f'ret{n}']<=t,horizon=n) for t in (-3,-5,-10)}
            b['warnings'][name]=res
        b['controls']={'+'.join(axes) or 'unmatched':control(pool,axes,sectors) for axes in
                       ([],['day'],['r5'],['vol'],['day','r5'],['day','vol'],['day','r5','vol'],['day','r5','vol','sector'])}
        old=[r for r in buy if r['version']!=W.BASE_MODEL_VERSION]; new=[r for r in buy if r['version']==W.BASE_MODEL_VERSION]
        overlap=sorted({r['day'] for r in old}&{r['day'] for r in new})
        start=min(r['day'] for r in new)
        purged=[r for r in old if r['end5']<start]
        b['split']={'overlapDecisionDates':overlap,'oldLabelsNotAvailableAtTestStart':sum(r['end5']>=start for r in old),
                    'testStart':start,'purgedTrain':summary(purged),'test':summary(new),
                    'keptTest':{name:summary([r for r in new if not fn(r)]) for name,fn in [('surge',lambda r:r['hot']),('union',lambda r:r['hot'] or r['swing'])]}}
        report[label]=b
    report['analysts']=analyst_audit(hist,closes)
    return report


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output',required=True)
    args=parser.parse_args();result=run()
    Path(args.output).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    for k in ('legacyMixed','knownBaseMixed','observedAuto'):
        r=result[k];print(k,json.dumps({'buy':r['buy'],'warnings':{n:{m:v[m] for m in ('fixed','normalized')} for n,v in r['warnings'].items()},'controls':{n:{m:v[m] for m in ('meanGap','crashGap','meanCi5Days','crashCi5Days')} for n,v in r['controls'].items()},'split':r['split']},ensure_ascii=False))
