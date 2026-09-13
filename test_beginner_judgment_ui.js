// Real rendering boundary: missing counts must stay unknown; labels cannot become orders.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const app=fs.readFileSync(__dirname+'/app.js','utf8');
const ui=fs.readFileSync(__dirname+'/scorecard-ui.js','utf8');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={esc,window:{},liveInd:()=>({tech:{rsi14:41,ma20:1200},risk:{vol20:2.3},flow:{frgnSum:100,orgSum:-20,periodEnd:'2026-09-10'}}),analysisAsOf:()=>null};
vm.createContext(ctx);
const shared=app.slice(app.indexOf('function gaeoJudgmentDisplay('),app.indexOf('/* 홈 「오늘의 판단」 각주'));
assert.ok(shared.length,'Shared display helper is missing');
vm.runInContext(shared,ctx);
const traceCode=ui.slice(ui.indexOf('function decisionQualityHTML('),ui.indexOf('function renderScorecard('));
vm.runInContext(traceCode,ctx);
for(const [call,label] of [['BUY','매수 검토'],['HOLD','지켜보기'],['SELL','매도 검토'],['JUDGMENT_WITHHELD','판단 보류'],['???','판단 보류'],['constructor','판단 보류'],['__proto__','판단 보류']]){
  assert.equal(ctx.gaeoJudgmentDisplay(call).label,label);
  assert.ok(ctx.gaeoJudgmentDisplay(call).explanation.length>12);
}
const horizon={evaluated:7,pending:2,blocked:3,withheld:1,hit:4,miss:2,neutral:1,accuracy:null,accuracyDenominator:6,evaluatedDecisionDays:3,evidenceStatus:'RECORDS_ACCUMULATING',reasons:{future_session:2,missing_price:2,unknown_future_reason:1}};
const trace={schemaVersion:1,status:'PARTIAL',rawRecordCount:16,dailyRecordCount:13,uniqueDecisionDays:3,latestDecisionAt:'2026-09-11T15:40:00+09:00',lastVerifiedAt:'2026-09-13T12:00:00+09:00',currentModelVersion:'v-now',source:'actual_auto',horizons:{'5':horizon},byModelVersion:{'v-now':{rawRecordCount:10,dailyRecordCount:8,uniqueDecisionDays:2,horizons:{'5':horizon}},'v-past':{rawRecordCount:6,dailyRecordCount:5,uniqueDecisionDays:1,horizons:{'5':horizon}}},disclosure:{statuses:{event_found:2,checked_no_event:3,unavailable:4,needs_review:1}},examples:[{recordId:'<unsafe>',code:'080220',decisionAt:'2026-09-11',call:'HOLD',base:1200,status:'blocked',reason:'corporate_action_unverified',sourcePath:'javascript:alert(1)'}],limitations:['테스트 범위 한계']};
let rendered=ctx.decisionTraceHTML(trace);
for(const text of ['16','13','3','현재 모델','과거 모델','자료 확인 필요','가격 자료 미확인','거래일 경과 대기','4 ÷ (4 + 2)','중립','판단 보류','테스트 범위 한계','&lt;unsafe&gt;','지켜보기']) assert.ok(rendered.includes(text),text);
assert.doesNotMatch(rendered,/66\.7%|javascript:|<unsafe>/);
assert.match(rendered,/결과 기다리는 중/);
assert.match(rendered,/자료 부족으로 평가 보류/);
assert.match(rendered,/기록을 더 모으는 중/);
const linked=ctx.decisionTraceHTML({...trace,examples:[{...trace.examples[0],sourcePath:'research_archive/decisions/originals/2026/09/11/1234567890abcdef12345678.jsonl.gz',outcomePath:'research_archive/decisions/outcomes/2026-09.json'}]});
assert.match(linked,/href="https:\/\/github.com\/rudvh1016-gif\/gaeo-analyst-team\/blob\/main\/research_archive\/decisions\/originals\/2026\/09\/11\/1234567890abcdef12345678.jsonl.gz"/);
assert.match(linked,/href="https:\/\/github.com\/rudvh1016-gif\/gaeo-analyst-team\/blob\/main\/research_archive\/decisions\/outcomes\/2026-09.json"/);
const traversal=ctx.decisionTraceHTML({...trace,examples:[{...trace.examples[0],sourcePath:'research_archive/decisions/originals/../private.json'}]});
assert.doesNotMatch(traversal,/href=/);
assert.match(rendered,/같은 날.*독립/);
const unknown=ctx.decisionTraceHTML({schemaVersion:1,horizons:{'5':{}}});
assert.match(unknown,/자료 확인 중/);
assert.doesNotMatch(unknown,/>0<|적중률 0%|사건 발견 0건|원본 0건/);
assert.match(ctx.decisionTraceHTML(null),/자료 확인 중/);
rendered=ctx.decisionTraceHTML({...trace,horizons:{'5':{...horizon,accuracy:66.7}}});
assert.match(rendered,/66\.7%/);
// Corporate actions can change prices mechanically: the hold must be visible before
// opening details, while the existing hit/miss denominator remains untouched.
const comparisonTrace={...trace,comparison:{policyVersion:'price-comparison-v1',states:{comparable:5,adjustment_required:2,unknown:4,review_required:1}}};
const comparisonHTML=ctx.decisionTraceHTML(comparisonTrace);
const comparisonText=comparisonHTML.replace(/<[^>]*>/g,' ');
for(const text of ['같은 기준으로 비교 가능 · 5건','기업행사 영향으로 계산 보류 · 2건','자료 부족으로 비교 확인 중 · 4건','자료가 달라 추가 확인 필요 · 1건']) assert.ok(comparisonText.includes(text),text);
const holdNotice='기업행사 영향으로 아직 성적을 계산하지 않았어요.';
assert.ok(comparisonHTML.indexOf(holdNotice)>=0&&comparisonHTML.indexOf(holdNotice)<comparisonHTML.indexOf('<details'),'Corporate-action hold must be visible without opening details');
assert.match(comparisonText,/권리락[（(].*신주.*권리.*[）)]/);
assert.match(comparisonText,/기계적인 가격 변화.*적중.*빗나감.*세지 않/);
assert.match(comparisonText,/기업행사가 없다는 뜻은 아니/);
assert.match(comparisonText,/4 ÷ \(4 \+ 2\)/);
assert.doesNotMatch(comparisonText,/price-comparison-v1|adjustment_required|review_required/);

// Pending is future waiting, independently of whether price comparison is known.
const waitingHTML=ctx.decisionTraceHTML({...comparisonTrace,comparison:{policyVersion:'price-comparison-v1',states:{comparable:0,adjustment_required:0,unknown:1,review_required:0}},examples:[{...trace.examples[0],status:'pending',reason:'future_session',comparisonState:'unknown',comparisonReason:'comparison_window_incomplete'}]});
const waitingExample=waitingHTML.match(/<ul class="decision-examples">([\s\S]*?)<\/ul>/)[1];
assert.match(waitingExample,/결과 기다리는 중.*거래일 경과 대기/);
assert.match(waitingExample,/가격 비교.*자료 부족으로 비교 확인 중.*평가 기간 전체를 아직 확인하지 못함/);
assert.match(waitingHTML,/5거래일이 아직 지나지 않/);
assert.match(waitingHTML,/가격 비교 상태는 별도/);
assert.doesNotMatch(waitingHTML,new RegExp(holdNotice));
const missingComparison=ctx.decisionTraceHTML({...trace,comparison:{policyVersion:'price-comparison-v1',states:{}}});
assert.match(missingComparison,/같은 기준으로 비교 가능 · 자료 확인 중/);
assert.doesNotMatch(missingComparison,/같은 기준으로 비교 가능 · 0건|기업행사 영향으로 계산 보류 · 0건/);

// Only a content-addressed comparison file can become a public evidence link.
const comparisonPath='research_archive/decisions/comparisons/abcdef1234567890abcdef12.json.gz';
const linkedComparison=ctx.decisionTraceHTML({...comparisonTrace,examples:[{...trace.examples[0],comparisonState:'adjustment_required',comparisonReason:'corporate_action_adjustment_required',comparisonPath}]});
assert.match(linkedComparison,/href="https:\/\/github.com\/rudvh1016-gif\/gaeo-analyst-team\/blob\/main\/research_archive\/decisions\/comparisons\/abcdef1234567890abcdef12.json.gz"[^>]*>가격 비교 근거<\/a>/);
for(const invalidPath of ['javascript:alert(1)','https://example.com/evidence','research_archive/decisions/comparisons/../private.json','research_archive/decisions/comparisons/abcdef1234567890abcdef12.json.gz?download=1','research_archive/decisions/comparisons/abcdef1234567890abcdef12.json','research_archive/decisions/comparisons/not-a-hash.json.gz',comparisonPath+'\n']){
  const unsafe=ctx.decisionTraceHTML({...comparisonTrace,examples:[{...trace.examples[0],comparisonPath:invalidPath}]});
  assert.doesNotMatch(unsafe,/href=/,invalidPath);
}
const comparisonReasons=[['corporate_action_adjustment_required','기업행사 뒤 가격 조정 근거 확인 필요'],['corporate_action_conflict','기업행사 자료가 서로 달라 확인 필요'],['corporate_action_unverified','기업행사 확인 자료 부족'],['price_basis_unverified','두 가격을 같은 기준으로 비교할 근거 부족'],['trading_halt','거래정지 구간 확인 필요'],['price_evidence_invalid','가격 근거 검증 필요'],['effective_date_unverified','기업행사 적용일 확인 필요'],['comparison_window_incomplete','평가 기간 전체를 아직 확인하지 못함'],['<script>bad()</script>','자료 확인 필요'],['constructor','자료 확인 필요'],['__proto__','자료 확인 필요']];
for(const [reason,label] of comparisonReasons){
  const reasonHTML=ctx.decisionTraceHTML({...comparisonTrace,examples:[{...trace.examples[0],comparisonState:'review_required',comparisonReason:reason}]});
  const example=reasonHTML.match(/<ul class="decision-examples">([\s\S]*?)<\/ul>/)[1];
  assert.ok(example.includes('자료가 달라 추가 확인 필요')&&example.includes(label),reason);
  assert.doesNotMatch(example,/<script>|native code|\[object Object\]/);
}
const evidence=ctx.gaeoBeginnerEvidenceHTML({code:'080220',per:0,pbr:1.2});
for(const text of ['RSI','PER','PBR','변동성','수급','이동평균','2026-09-10','장중 실시간','자료 확인 중']) assert.ok(evidence.includes(text),text);
assert.doesNotMatch(evidence,/undefined|NaN/);
ctx.MODEL_SCOREBOARD={decisionTrace:{disclosure:{byCode:{'080220':'checked_no_event'},observedAt:'2026-09-13T04:00:00Z',scope:'최근 공시·페이지 확인 범위'}}};
const disclosure=ctx.gaeoDisclosureEvidenceHTML('080220');
assert.match(disclosure,/확인 범위 내 사건 없음/);
assert.match(disclosure,/2026-09-13T04:00:00Z/);
assert.match(disclosure,/분석 당시/);
assert.match(ctx.gaeoDisclosureEvidenceHTML('MISSING'),/확인 불가/);
vm.runInContext(app.slice(app.indexOf('function baseReliabilityState('),app.indexOf('// 2. 판단 이유 3가지')),ctx);
ctx.MODEL_SCOREBOARD={models:[{id:'base_production',currentModelVersion:'old',byModelVersion:{old:{accuracy:88}}}]};
assert.equal(ctx.baseReliabilityState().kind,'UNKNOWN','Legacy accuracy cannot certify current decision trace');
ctx.MODEL_SCOREBOARD={decisionTrace:{currentModelVersion:'v-now',byModelVersion:{'v-now':{horizons:{'5':{accuracy:null}}}}}};
assert.equal(ctx.baseReliabilityState().kind,'ACCUMULATING');
ctx.MODEL_SCOREBOARD.decisionTrace.byModelVersion['v-now'].horizons['5'].accuracy=61.2;
assert.equal(ctx.baseReliabilityState().acc,61.2);
// Real generated observations render inside the original trace; sparse bins
// never manufacture a percentage, and internal state names stay internal.
const board=fs.readFileSync(__dirname+'/model_scoreboard.js','utf8');
const qualityContext={};vm.createContext(qualityContext);
vm.runInContext(board+';this.trace=MODEL_SCOREBOARD.decisionTrace;',qualityContext);
const qualityHTML=ctx.decisionQualityHTML(qualityContext.trace.quality);
for(const text of ['전체 종목 중 실제로 판단할 수 있었던 비율','자료가 부족한 종목을 억지로','점수가 높은 판단','판단보류','지켜보기(HOLD)','상승 확률 80%라고 읽으면 안']) assert.ok(qualityHTML.includes(text),text);
assert.doesNotMatch(qualityHTML,/Calibration|Coverage|Drift|Orchestrator|Shadow|NaN|undefined/);
console.log('beginner judgment render tests passed');
