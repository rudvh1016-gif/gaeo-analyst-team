// Execute the actual renderer with stale, revised, and adversarial payloads.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('app.js','utf8');
const warning=source.slice(source.indexOf('  function overheatNoticeHTML('),source.indexOf('\n  const EVID_LABEL'));
const evidence={schemaVersion:2,warningVersion:'surge-only-2026-09-05c',crashThresholdPct:-5,
  overheatAllTime:{enoughSample:true,warn:{crashPct:12.3},calm:{crashPct:45.6}}};
function render(oh,bo=evidence,call='BUY'){
  const ctx={window:{GaeoUseAuto:()=>({stocks:{'000001':{chief:{overheat:oh}}}})},
    TEAM_WEIGHTS:{global:{team:{buyOutcome:bo}}}};
  vm.createContext(ctx);vm.runInContext(warning,ctx);
  return ctx.overheatNoticeHTML('000001',call);
}
const oldVol={version:'old',available:true,warn:true,level:'caution',triggers:['vol20'],vol20:7};
assert.equal(render(oldVol),'');
const oldBoth={...oldVol,level:'strong',ret5:15,triggers:['ret5','vol20']};
const legacy=render(oldBoth);
assert.match(legacy,/최근 많이 오른/);assert.doesNotMatch(legacy,/12\.3|45\.6|하루 평균|strong/);
const revised={...oldBoth,version:evidence.warningVersion,level:'caution',triggers:['ret5']};
const current=render(revised);
assert.match(current,/12\.3/);assert.match(current,/45\.6/);
assert.match(current,/5번째 거래일 종가/);assert.match(current,/검증된 것은 아니/);
assert.doesNotMatch(current,/5거래일 안|—/);
assert.equal(render(revised,evidence,'HOLD'),'');
assert.equal(render(revised,evidence,'SELL'),'');
assert.equal(render({...revised,ret5:NaN}),'');
assert.doesNotMatch(render(revised,{...evidence,warningVersion:'other'}),/12\.3|45\.6/);

const start=source.indexOf("    let buyNote='';"),end=source.indexOf('    // 업종별 최고 성적',start);
const scorecard=new Function('bo','esc',source.slice(start,end)+'\nreturn buyNote;');
const block={n:20,graded:10,acc:90,crashPct:1,meanRet:10,uniqueDecisionDays:12};
const bo={...evidence,allTime:block,currentVersion:block,randomBaseline:{...block,n:100,acc:10,meanRet:-10},
  overheatAllTime:{...evidence.overheatAllTime,warnSharePct:30,unknownN:0}};
const html=scorecard(bo,x=>x);
assert.match(html,/분모는 전체 건수가 아니라/);
assert.doesNotMatch(html,/나은 결과를 내지 못했어요|고르는 자리가 나빴다|5거래일 안|—/);
const stale=scorecard({...bo,schemaVersion:1},x=>x);
assert.match(stale,/사후 재구성과 정밀분석이 섞여/);
assert.doesNotMatch(stale,/같은 날짜의 자동판단 기록과 비교하면/);
console.log('BUY warning UI: stale payload, schema parity, denominators, reversed outcomes PASS');
