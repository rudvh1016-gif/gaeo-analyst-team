/* ============================================================
   개오 애널리스트팀 — 메인 앱 스크립트
   실시간 시세(data.js) + 실제 AI 분석(analysis.js)
   ============================================================ */

// ---------- 시세: 종목 목록은 tickers.js(단일 소스), 값은 data.js에서 채운다 ----------
let SNAP_DATE='시세 없음';
const STOCKS={};
// ⭐ 분석 종목 수는 tickers.js 하나에서만 가져온다 (2026-08-15).
//    예전에는 화면 곳곳에 "500종목"이 글자로 박혀 있어서, 종목을 늘릴 때마다
//    사이트 여기저기가 낡은 숫자로 남았다. 이제 아래 두 상수만 쓴다.
const COVERAGE_N=(typeof TICKERS!=='undefined'&&Array.isArray(TICKERS)&&TICKERS.length)||0;
const COVERAGE_TXT=COVERAGE_N?COVERAGE_N+'종목':'분석 대상 종목';
// 코스피 초대형 우량주(시총 상위권) 화이트리스트 — 우측 레일 "최근 팀 판단"에서 쓴다.
// 분석 종목 전부를 노출하면 낯선 중소형주가 섞여 신뢰가 떨어져 대표 종목만 추린다.
const MEGA_CAP=new Set([
  '005930','000660','373220','207940','005380','000270','068270','105560','055550',
  '005490','035420','012330','006400','051910','035720','028260','086790','032830',
  '138040','329180','012450','066570','009150','033780','316140','011200','003670',
  '086280','000810','034020','402340','017670','042660','009540','015760','010130',
  '010140','024110','018260','003550','030200','259960','323410','307950','247540']);
// 1) 종목 골격: tickers.js → 없으면 data.js의 종목에서 유추(이중 안전망)
(function(){
  let src=[];
  if(typeof TICKERS!=='undefined' && Array.isArray(TICKERS)) src=TICKERS;
  else if(typeof LIVE_DATA!=='undefined' && LIVE_DATA.stocks)
    src=Object.entries(LIVE_DATA.stocks).map(([code,d])=>({code,name:d.name}));
  src.forEach(t=>{ STOCKS[t.code]={name:t.name, sector:t.sector||'기타', price:null}; });
})();
// 2) 실시간 값 병합
if(typeof LIVE_DATA!=='undefined' && LIVE_DATA.stocks){
  SNAP_DATE=LIVE_DATA.date;
  for(const c in LIVE_DATA.stocks) STOCKS[c]=Object.assign(STOCKS[c]||{name:LIVE_DATA.stocks[c].name}, LIVE_DATA.stocks[c]);
}
// 💰 시가총액 순위 — data.js의 "cap" 문자열("1,520조"·"1.4조")을 숫자로 파싱해 전 종목 내림차순 순위를 매긴다.
// 전부 로컬 계산(토큰 0) — AI 재분석 없이 시세 갱신 때마다 자동으로 다시 계산된다.
function parseCap(capStr){
  if(!capStr) return null;
  const m=String(capStr).replace(/,/g,'').match(/^([\d.]+)조$/);
  return m?parseFloat(m[1]):null;
}
const CAP_RANK={}; // code -> 시총 순위(1부터)
const CAP_TOP10=(function(){
  const arr=Object.entries(STOCKS)
    .map(([code,s])=>({code,name:s.name,capNum:parseCap(s.cap),capStr:s.cap}))
    .filter(x=>x.capNum!=null)
    .sort((a,b)=>b.capNum-a.capNum);
  arr.forEach((x,i)=>{ CAP_RANK[x.code]=i+1; });
  return arr.slice(0,10);
})();
function renderCapTop10(){
  const el=document.getElementById('capTop10');
  if(!el) return;
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
  const chips=CAP_TOP10.map((stock,index)=>
    `<button type="button" class="mk-buychip${rankCls(index)}" data-cap-stock="${escapeHtml(stock.name)}"><span class="bc-rank">${index+1}</span>${escapeHtml(stock.name)}<span class="bc-score">${escapeHtml(stock.capStr)}</span></button>`
  ).join('');
  el.innerHTML=CAP_TOP10.length
    ? `<div class="cap-top10-head">시가총액 상위 10위 <span>종목을 누르면 상세 분석으로 이동합니다.</span></div><div class="mk-buychips cap-top10-chips">${chips}</div>`
    : '';
  el.querySelectorAll('.cap-top10-chips button').forEach(button=>{
    button.onclick=()=>jumpToStock(button.dataset.capStock);
  });
}
const LIVE_AN=(typeof LIVE_ANALYSIS!=='undefined')?LIVE_ANALYSIS:null;
// 전체 종목 자동분석은 첫 화면에서 받지 않고, 실제 분석 기능을 누를 때만 내려받는다.
let AUTO_AN=null;
window.GaeoUseAuto=()=>{
  AUTO_AN=(typeof LIVE_AUTO!=='undefined'&&LIVE_AUTO)?LIVE_AUTO:
    ((typeof window!=='undefined'&&window.LIVE_AUTO)||null);
  return AUTO_AN;
};
window.ensureAutoAnalysis=()=>AUTO_AN
  ?Promise.resolve(AUTO_AN)
  :GaeoFeatures.load('auto').then(()=>window.GaeoUseAuto());
// 📚 정밀분석 "전체 본문" 기록(analysis_archive.js) — "정밀분석 기록" 탭을 열 때만 지연 로딩.
let ARCHIVE=null;
window.GaeoUseArchive=()=>{
  ARCHIVE=(typeof ANALYSIS_ARCHIVE!=='undefined'&&ANALYSIS_ARCHIVE)?ANALYSIS_ARCHIVE:
    ((typeof window!=='undefined'&&window.ANALYSIS_ARCHIVE)||null);
  return ARCHIVE;
};
// 정밀분석 '신선도' 판정: 아래 두 조건을 "모두" 만족할 때만 정밀분석을 우선 표시(true).
//   ① 시간: 정밀분석이 자동분석(매일 전 종목 갱신)보다 오래되지 않았을 것.
//      · 자동분석은 매일 새로 생성되므로, 하루라도 지난 정밀분석의 텍스트(뉴스·공시)는 낡았다.
//        그래서 정밀 updated 날짜가 자동분석 생성 날짜보다 이르면 → 최신 자동분석을 우선한다.
//        (효과: 정밀분석은 '그날 직접 재분석한 당일'만 우선, 이후엔 전 종목 자동분석 표시)
//   ② 가격: 기준가(base) 대비 현재가가 ±STALE_PCT 미만일 것(시세가 벌어지면 자동 우선).
//  · base/현재가를 못 구하면 판단 불가이므로 시간 조건만으로 처리.
function precisionFresh(code){
  const P = LIVE_AN && LIVE_AN[code];
  if(!P) return false;
  // ① 시간 신선도 — 정밀이 자동보다 하루 이상 오래되면 자동 우선
  const pDay = String(P.updated||(LIVE_AN&&LIVE_AN.date)||'').slice(0,10);
  const aDay = (AUTO_AN && String(AUTO_AN.priceLabel||AUTO_AN.generatedAt||'').slice(0,10)) || '';
  if(pDay && aDay && pDay < aDay) return false;
  // ② 가격 신선도
  const base = (typeof P.base==='number') ? P.base : null;
  const cur = (typeof STOCKS!=='undefined' && STOCKS[code] && typeof STOCKS[code].price==='number') ? STOCKS[code].price : null;
  if(base==null || cur==null) return true;
  return Math.abs((cur-base)/base*100) < STALE_PCT;
}
// 종목별 분석 티어: 'deep'=Claude 정밀분석(analysis.js) / 'auto'=심부름꾼 자동분석(auto_analysis.js) / null=없음(mock)
function analysisTier(code){
  if(LIVE_AN && LIVE_AN[code] && precisionFresh(code)) return 'deep';
  if(AUTO_AN && AUTO_AN.stocks && AUTO_AN.stocks[code]) return 'auto';
  if(LIVE_AN && LIVE_AN[code]) return 'deep';   // 자동분석이 아직 없으면 오래된 정밀이라도 표시
  return null;
}
// 신선한 정밀분석 우선, 오래됐거나 없으면 자동분석 블록을 반환(둘 다 같은 스키마: taro/diana/nova/flow/chief/base/updated)
function analysisEntry(code){
  if(LIVE_AN && LIVE_AN[code] && precisionFresh(code)) return LIVE_AN[code];
  if(AUTO_AN && AUTO_AN.stocks && AUTO_AN.stocks[code]) return AUTO_AN.stocks[code];
  if(LIVE_AN && LIVE_AN[code]) return LIVE_AN[code];
  return null;
}
// 종목별 "분석 기준 시각": 저장 분석이 있으면 그 종목 updated(없으면 전역 date), 없으면 null(=mock)
function analysisAsOf(code){
  const L=analysisEntry(code);
  if(!L) return null;
  return L.updated || (LIVE_AN&&LIVE_AN.date) || (AUTO_AN&&AUTO_AN.priceLabel) || null;
}
// 분석 기준가(base) 조회 — 저장 분석에 base가 있을 때만
function analysisBase(code){
  const L=analysisEntry(code);
  return (L && typeof L.base==='number') ? L.base : null;
}
// 기준가의 시점 라벨(baseAt) — 예: "2026-07-06 종가". 정밀분석을 실제로 표시할 때만 쓴다
// (오래돼 자동분석으로 넘어갔으면 그 정밀 baseAt를 붙이면 안 되므로 null).
function analysisBaseAt(code){
  const L=LIVE_AN && LIVE_AN[code];
  return (L && L.baseAt && precisionFresh(code)) ? L.baseAt : null;
}
// 분석 신선도: 기준가 대비 현재가 변동. base가 없으면 null(=구버전 분석)
const STALE_PCT=3; // ±3% 이상 벌어지면 재분석 권장
function freshnessHTML(code, curPrice){
  const base=analysisBase(code);
  if(!base || !curPrice) return '';
  const pct=(curPrice-base)/base*100;
  const stale=Math.abs(pct)>=STALE_PCT;
  const col=pct>0?'var(--krup)':(pct<0?'var(--krdn)':'var(--ink)');
  const sign=pct>0?'+':'';
  const bat=analysisBaseAt(code);
  return '<span class="qd-seg">기준가 <b>'+won(base)+'</b>'
       + (bat?' <span class="baseat">('+bat+')</span>':'')
       + ' → 현재 <b style="color:'+col+'">'+sign+pct.toFixed(1)+'%</b>'
       + (stale?' <span class="stale">재분석 권장</span>':'')+'</span>';
}

// CHIEF v.target 문자열("증권사 평균 목표주가 27,333원 (현재가 대비 +34.6% 상승여력)")에서
// 숫자만 뽑아낸다 — 정밀/자동 두 티어 모두 v.target이 이미 이 형식의 문장이라 티어 구분 없이 동작한다.
function parseTargetInfo(targetText){
  const t=String(targetText||'');
  const priceM=t.match(/([0-9][0-9,]{2,})\s*원/);
  const gapM=t.match(/([+\-]?[\d.]+)%\s*상승여력/);
  return {price:priceM?+priceM[1].replace(/,/g,''):null, gap:gapM?+gapM[1]:null};
}
/* ── 🧭 가격 나침반: indicators.js(INDICATORS)의 이동평균·3개월 밴드 + CHIEF 컨센서스
   목표가로 "주요 가격 구간" 표를 자동 계산한다. 시세가 갱신되면 표도 함께 움직인다 — AI 비용 0.
   ⭐ 2026-08-07 리디자인: 문장 나열 대신 표(구분/가격/의미)로 정리. 계산 로직은 그대로다. ── */
function levelsHTML(code, price, targetText){
  const IND=liveIndAll();
  const T=IND&&IND[code]&&IND[code].tech;
  if(!T||!price) return '';
  const pctOf=v=>{const p=(v-price)/price*100;return (p>0?'+':'')+p.toFixed(1)+'%';};
  const fm=v=>won(Math.round(v));
  const mas=[[T.ma20,'20일 평균선(MA20)'],[T.ma60,'60일 평균선(MA60)']].filter(x=>typeof x[0]==='number');
  const ups=mas.filter(x=>x[0]>price*1.005).sort((a,b)=>a[0]-b[0]);
  const downs=mas.filter(x=>x[0]<price*0.995).sort((a,b)=>b[0]-a[0]);
  const above=[], below=[];
  if(ups.length) above.push({price:ups[0][0], tag:'1차 저항', mean:wrapGloss(ups[0][1])+' 회복이 첫 관문'});
  if(typeof T.high3m==='number'&&T.high3m>price*1.01)
    above.push({price:T.high3m, tag:'3개월 고점', mean:'최근 석 달 사이 가장 높았던 가격'});
  const tgt=parseTargetInfo(targetText);
  if(tgt.price){
    const row={price:tgt.price, tag:'컨센서스 목표가', mean:'증권사 평균 목표주가'};
    (tgt.price>price?above:below).push(row);
  }
  let sup=downs.length?downs[0]:(typeof T.low3m==='number'&&T.low3m<price*0.995?[T.low3m,'3개월 최저가']:null);
  if(sup){
    below.push({price:sup[0], tag:term('지지선'), mean:wrapGloss(sup[1])});
    below.push({price:sup[0]*0.97, tag:term('손절')+' 참고', mean:'지지선을 3% 넘게 밑돌면 한 발 물러나 다시 생각해요'});
  }
  const noResUp=!above.length&&typeof T.high3m==='number'&&price>=T.high3m*0.99;
  if(!above.length&&!below.length&&!noResUp) return '';
  above.sort((a,b)=>a.price-b.price);
  below.sort((a,b)=>b.price-a.price);
  const rowHTML=(r,cls)=>`<tr><td class="vlv-tag">${r.tag}</td><td class="vlv-price">${fm(r.price)}</td>`+
    `<td class="vlv-gap ${cls}" style="color:var(--${cls==='up'?'krup':'krdn'})">${pctOf(r.price)}</td><td class="vlv-mean">${r.mean}</td></tr>`;
  const aboveRows=above.slice().reverse().map(r=>rowHTML(r,'up')).join('');
  const nowRow=`<tr class="vlv-now"><td class="vlv-tag">현재가</td><td class="vlv-price">${fm(price)}</td><td class="vlv-gap"></td><td class="vlv-mean">기준</td></tr>`;
  const belowRows=below.map(r=>rowHTML(r,'dn')).join('');
  const upNote=noResUp?`<div class="vlv-upnote">▲ 위쪽 참고선 없음 — 3개월 최고가 부근(신고가 구간)이라 막고 있는 윗선이 없어요</div>`:'';
  return `<div class="vl-t">주요 가격 구간 <span style="font-weight:500;color:var(--dim)">(이동평균선·3개월 가격범위·컨센서스로 자동 계산)</span></div>`
    + upNote
    + `<table class="vlv-table">${aboveRows}${nowRow}${belowRows}</table>`
    + `<div class="vl-note">※ 컴퓨터가 차트 지표로 계산한 참고선이에요 — 시세가 갱신되면 표도 매일 조금씩 움직여요. 매수·매도 권유가 아닙니다.</div>`;
}

// ⭐ 2026-08-08: 업종 내 PER/PBR 순위는 이제 DIANA 카드 재설계의 일부로
// sectorRankInfo()(analystCardBodyHTML 근처)가 구조화된 값으로 계산한다 —
// 이 자리에 있던 sectorCompHTML()의 문장형 출력은 fx-metric 카드로 대체됐다.

/* ============================================================
   판단 히스토리 & 트랙레코드 (history.js · LIVE_HISTORY)
   ============================================================ */
let LIVE_HIST=(typeof LIVE_HISTORY!=='undefined')?LIVE_HISTORY:null;
// 콜 vs 이후 수익률로 적중 판정. BUY=오르면 적중 / SELL=내리면 적중 / HOLD=±5% 이내면 적중
/* ⭐ 2026-08-15 채점 규칙 통일 — 예전에는 같은 저장소 안에 HOLD 채점이 3가지로 갈라져 있었다.
   ① index.html scoreCall: HOLD는 ±5%를 벗어나도 '중립'(빗나감이 될 수 없음)
   ② compute_team_weights.py score_call: ①과 동일
   ③ compute_model_intelligence.py call_hit: ±5% 이탈이면 빗나감(엄격)
   그래서 같은 데이터로 통산 적중률이 70.7%(관대) vs 51.2%(엄격)로 19.5%p 갈렸고,
   성적표 안에서도 헤드라인(관대)과 판단 종류별 표(엄격)가 서로 다른 숫자를 보여줬다.
   HOLD는 "크게 안 움직인다"는 예측이므로 크게 움직였으면 빗나간 것이 맞다.
   ③(엄격)으로 통일한다. ⚠️ BUY/HOLD/SELL 판단 기준(63점·47점)과 가중치는 건드리지 않는다 —
   이것은 성능 튜닝이 아니라 '채점자'의 잣대를 하나로 맞추는 측정 정합성 수정이다. */
function scoreCall(call, retPct){
  /* ⚪ 판단 보류는 적중/빗나감 어느 쪽에도 넣지 않는다. 분모에서 아예 뺀다.
     데이터가 모자라 판단을 안 한 것을 HOLD로 채점하면 성적이 왜곡된다. */
  if(call==='JUDGMENT_WITHHELD') return 'withheld';
  if(call==='BUY')  return retPct>1?'hit':(retPct<-1?'miss':'mid');
  if(call==='SELL') return retPct<-1?'hit':(retPct>1?'miss':'mid');
  return Math.abs(retPct)<=5?'hit':'miss';
}
/* ── 채점 기준: 판단 후 5거래일 뒤 종가 ──
   모든 판단을 같은 잣대(일주일 성적표)로 공평하게 비교하기 위해,
   기록된 일별 종가(PRICE_HISTORY)에서 판단일 다음 5번째 거래일의 종가를 찾는다.
   아직 5거래일이 지나지 않은 판단은 '평가중'. */
const EVAL_DAYS=5;
function evalClose(code, entryDateStr, days=EVAL_DAYS){
  const pages=(typeof PRICE_HISTORY!=='undefined'&&PRICE_HISTORY[code])||[];
  if(!pages.length) return null;
  const d0=String(entryDateStr).slice(0,10);
  // ⚠️ PRICE_HISTORY의 페이지 배열은 시간순이 아닐 수 있다(flatCloses()·AGENTS.md 주의 2번과 같은 이유).
  // 정렬하지 않으면 "판단일 다음 5번째 거래일"이 엉뚱한 날로 잡혀 채점이 통째로 틀어진다.
  // 2026-08-15 재현 확인: 페이지 순서만 뒤바꾸면 같은 판단의 수익률이 +5.0% → +9.0%로 달라졌다.
  const after=pages.flatMap(p=>p.days).filter(d=>d&&d.date>d0)
    .sort((a,b)=>a.date<b.date?-1:(a.date>b.date?1:0));   // 판단일 다음 거래일부터(날짜 오름차순)
  return after.length>=days ? {close:after[days-1].close, date:after[days-1].date} : null;
}
// 판단 기록의 확정 수익률(5거래일 뒤 종가 기준). 미확정이면 null.
function evalRet(code, entry, days=EVAL_DAYS){
  if(!entry||!entry.base) return null;
  const ev=evalClose(code, entry.date, days);
  return ev ? {pct:(ev.close-entry.base)/entry.base*100, date:ev.date} : null;
}
const VERDICT_LABEL={hit:'적중', miss:'빗나감', mid:'중립'};
// 채점 뜻 설명(커서 올리면 뜸). 판단 후 5거래일 뒤 종가 대비 수익률로 판정.
const VERDICT_TIP={
  hit:'적중 — 팀 판단대로 주가가 움직였어요. (SELL 뒤 하락 / BUY 뒤 상승 / HOLD가 ±5% 이내). 판단 후 5거래일 뒤 종가로 판정.',
  miss:'빗나감 — 판단과 반대로 움직였어요. (SELL 뒤 상승 / BUY 뒤 하락 / HOLD인데 ±5%를 벗어남). 판단 후 5거래일 뒤 종가로 판정.',
  mid:'중립 — 방향을 판정하기 애매한 변동이에요(BUY·SELL이 ±1% 이내). 적중·빗나감 집계에서 제외돼요.',
  now:'평가중 — 판단 후 5거래일이 아직 지나지 않았어요. 5거래일 뒤 종가가 기록되면 그 값으로 채점됩니다.',
  rec:'채점 불가 — 기준가 정보가 없어 판정할 수 없는 기록이에요.'
};
// 확신도 추이 스파크라인 (점 색 = 그날의 콜)
function sparklineSVG(rows){
  const W=520,H=96,padX=8,padY=14, n=rows.length;
  if(n<2) return '';
  const xs=i=>padX+(W-2*padX)*(i/(n-1)), ys=v=>H-padY-(H-2*padY)*(v/100);
  const pts=rows.map((r,i)=>[xs(i),ys(r.confidence||0)]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  let grid=''; [25,50,75].forEach(v=>{const y=ys(v).toFixed(1);grid+=`<line x1="${padX}" y1="${y}" x2="${W-padX}" y2="${y}" stroke="#e2d8c3" stroke-width="1"/>`;});
  let dots=''; pts.forEach((p,i)=>{const c=rows[i].call, col=c==='BUY'?'#2F8B73':c==='SELL'?'#D5535D':'#B97A2F';
    dots+=`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="4" fill="${col}" stroke="#fff" stroke-width="1.2"/>`;});
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">`+
    `${grid}<path d="${line}" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linejoin="round"/>${dots}</svg>`;
}
/* ---- 최근 종가 페이지 (price_history.js · PRICE_HISTORY, 5거래일=1페이지) ---- */
let LIVE_PH=(typeof PRICE_HISTORY!=='undefined')?PRICE_HISTORY:null;
const PH_PAGE={};        // code -> 현재 보고 있는 페이지 번호(1-indexed)
const HIST_PAGE={};      // code -> 판단 히스토리 페이지(10건=1페이지, 최신 페이지가 기본)
const HIST_PAGE_SIZE=10; // 정밀분석 과거기록: 10개씩 묶어 페이지로 (과거 계속 누적)
let CUR_HIST_CODE=null;  // vhistory에 지금 표시 중인 종목(페이지 이동 버튼이 참조)
function priceBlockHTML(code){
  const rawPages=(LIVE_PH&&LIVE_PH[code])||[];
  if(!rawPages.length) return '<div class="vph-empty">아직 종가 기록이 없어요. update_price_history.py 실행 시 여기 쌓입니다.</div>';
  // ⚠️ 저장된 페이지가 시간순이 아닐 수 있다(flatCloses와 동일 이유 — 신규 종목 백필 시 과거가 뒤에 붙음).
  //    날짜순으로 평탄화한 뒤 5일 단위로 다시 잘라 쓴다 — 전일비도 이 정렬본 기준이라 항상 정확하다.
  const flat=rawPages.flatMap(p=>p.days).slice().sort((a,b)=>a.date<b.date?-1:(a.date>b.date?1:0));
  const pages=[]; for(let i=0;i<flat.length;i+=5){ const c=flat.slice(i,i+5); pages.push({days:c,start:c[0].date,end:c[c.length-1].date}); }
  const total=pages.length;
  if(!PH_PAGE[code]||PH_PAGE[code]>total||PH_PAGE[code]<1) PH_PAGE[code]=total; // 기본: 최신 페이지
  const idx=PH_PAGE[code], page=pages[idx-1];
  const startFlatIdx=flat.findIndex(d=>d.date===page.days[0].date);
  const rows=page.days.map((d,i)=>{
    const prev=flat[startFlatIdx+i-1];
    let chg='<span class="pf-mut">—</span>';
    if(prev){
      const pct=(d.close-prev.close)/prev.close*100, col=pct>0?'var(--krup)':(pct<0?'var(--krdn)':'var(--ink)');
      chg=`<span style="color:${col}">${pct>0?'+':''}${pct.toFixed(1)}%</span>`;
    }
    return `<tr><td class="num">${d.date}</td><td class="num">${won(d.close)}</td><td class="num">${chg}</td></tr>`;
  }).join('');
  return `<div class="vph">
    <div class="vph-head">
      <h4>최근 종가 · ${page.start} ~ ${page.end} (${idx}/${total}페이지)</h4>
      <div class="vph-nav">
        <button class="vph-btn" data-dir="-1" ${idx<=1?'disabled':''} title="이전 페이지">‹</button>
        <button class="vph-btn" data-dir="1" ${idx>=total?'disabled':''} title="다음 페이지">›</button>
      </div>
    </div>
    <div class="tbl-scroll"><table><thead><tr><th>날짜</th><th>종가</th><th>전일비</th></tr></thead><tbody>${rows}</tbody></table></div>
  </div>`;
}
document.getElementById('vhistory').addEventListener('click', e=>{
  if(!CUR_HIST_CODE) return;
  const loadBtn=e.target.closest('.history-load-btn');
  if(loadBtn){
    loadBtn.disabled=true;
    loadBtn.textContent='과거 기록 불러오는 중…';
    GaeoFeatures.load('history').then(()=>{
      LIVE_HIST=(typeof LIVE_HISTORY!=='undefined')?LIVE_HISTORY:null;
      LIVE_PH=(typeof PRICE_HISTORY!=='undefined')?PRICE_HISTORY:null;
      renderHistory(CUR_HIST_CODE,(STOCKS[CUR_HIST_CODE]||{}).price);
    }).catch(()=>{
      loadBtn.disabled=false;
      loadBtn.textContent='다시 불러오기';
    });
    return;
  }
  // ⚠️ hh-btn(팀 판단 히스토리 페이저)은 vph-btn 클래스도 함께 갖고 있어(재사용 스타일),
  //    반드시 더 구체적인 .hh-btn을 먼저 검사해야 한다 — 순서를 바꾸면 이 버튼이 항상
  //    아래 '최근 종가' 페이저로 오분류되어 팀 판단 히스토리 페이지가 절대 안 넘어간다.
  const hhBtn=e.target.closest('.hh-btn');
  if(hhBtn){
    const total=((LIVE_HIST&&LIVE_HIST[CUR_HIST_CODE])||[]).length;
    const pageCount=Math.max(1, Math.ceil(total/HIST_PAGE_SIZE));
    const dir=+hhBtn.dataset.hdir, cur=HIST_PAGE[CUR_HIST_CODE]||pageCount;
    HIST_PAGE[CUR_HIST_CODE]=Math.min(pageCount, Math.max(1, cur+dir));
    renderHistory(CUR_HIST_CODE, (STOCKS[CUR_HIST_CODE]||{}).price);
    return;
  }
  const phBtn=e.target.closest('.vph-btn');
  if(phBtn){
    const rawPages=(LIVE_PH&&LIVE_PH[CUR_HIST_CODE])||[]; if(!rawPages.length) return;
    // priceBlockHTML과 동일하게 "날짜 수 ÷ 5" 기준으로 페이지 수를 계산(정렬 재구성과 일치)
    const nDays=rawPages.reduce((n,p)=>n+p.days.length,0);
    const totalPages=Math.max(1, Math.ceil(nDays/5));
    const dir=+phBtn.dataset.dir, cur=PH_PAGE[CUR_HIST_CODE]||totalPages;
    PH_PAGE[CUR_HIST_CODE]=Math.min(totalPages, Math.max(1, cur+dir));
    renderHistory(CUR_HIST_CODE, (STOCKS[CUR_HIST_CODE]||{}).price);
  }
});
function renderHistory(code, curPrice){
  const el=document.getElementById('vhistory');
  CUR_HIST_CODE=code;
  if(!GaeoFeatures.ready('history')){
    el.innerHTML='<div class="vph-empty">과거 가격·판단 기록은 필요할 때만 불러와 데이터 사용량을 아껴요.<br><button class="start-action secondary history-load-btn" type="button" style="margin-top:10px">과거 기록 보기</button></div>';
    return;
  }
  const rows=(LIVE_HIST&&LIVE_HIST[code])?LIVE_HIST[code].slice():[];
  const priceHtml=priceBlockHTML(code);
  if(!rows.length){ el.innerHTML=priceHtml; return; }
  const single=rows.length<2;
  // 과거기록 10개=1페이지 (계속 누적) — 기본은 최신 페이지. 그래프는 전체 추이를 보여준다.
  const total=rows.length, pageCount=Math.max(1, Math.ceil(total/HIST_PAGE_SIZE));
  if(!HIST_PAGE[code]||HIST_PAGE[code]>pageCount||HIST_PAGE[code]<1) HIST_PAGE[code]=pageCount;
  const hp=HIST_PAGE[code], startIdx=(hp-1)*HIST_PAGE_SIZE, endIdx=Math.min(total,startIdx+HIST_PAGE_SIZE);
  const pageRows=rows.slice(startIdx,endIdx);
  const pager=pageCount>1
    ? `<div class="vph-nav" style="display:inline-flex;margin-left:8px;vertical-align:middle">
         <button class="vph-btn hh-btn" data-hdir="-1" ${hp<=1?'disabled':''} title="이전(과거)">‹</button>
         <span style="font-size:11px;color:var(--dim);align-self:center;padding:0 4px">${hp}/${pageCount}p</span>
         <button class="vph-btn hh-btn" data-hdir="1" ${hp>=pageCount?'disabled':''} title="다음(최신)">›</button>
       </div>` : '';
  // 팀 판단 히스토리는 "계산 기준"과 같은 vev-item 아코디언으로 접어둔다 — 기본은 닫힌
  // 상태로 시작해 화면을 덜 차지하고, 요약 줄에서 총 횟수와 최근 콜만 미리 보여준 뒤
  // 펼치면 날짜별 BUY/HOLD/SELL 표 전체가 나온다(눌렀다 폈다).
  const latestCall=rows[rows.length-1].call;
  let html=priceHtml+`<details class="vev-item vh-acc"><summary class="vev-summary">`+
    `<span class="vev-summary-name">팀 판단 히스토리</span>`+
    `<span class="vev-summary-line">총 ${total}회 누적 · 최근 콜 ${latestCall}</span>`+
    `<span class="vev-badge hcall ${latestCall}">${latestCall}</span>`+
    `<span class="vev-arrow">▾</span></summary>`+
    `<div class="vev-body">`+
    `<div class="hsub" style="display:flex;align-items:center;flex-wrap:wrap;gap:6px">${single
      ?'재분석이 쌓이면 확신도·콜 변화가 그래프로, 지난 판단이 적중 채점으로 표시됩니다. (지금은 첫 기록)'
      :`점 색 = 그날의 콜(초록 BUY · 노랑 HOLD · 빨강 SELL) · 세로축 = 판단 확신도${pageCount>1?` · 표는 10건씩(${startIdx+1}~${endIdx}번째)`:''}`}${pager}</div>`
    + sparklineSVG(rows)
    + '<div class="tbl-scroll"><table><thead><tr><th>일시</th><th>콜</th><th>확신도</th><th>기준가</th><th>이후 수익률</th><th>채점</th></tr></thead><tbody>';
  pageRows.forEach((r,pi)=>{
    const i=startIdx+pi;
    const isLatest=(i===rows.length-1);
    let ret='—', vHtml=`<span class="hverdict hv-now tip-r" data-tip="${VERDICT_TIP.rec}">기록</span>`;
    if(r.base){
      const ev=evalRet(code, r);                       // 판단 후 5거래일 뒤 종가 기준(확정)
      if(ev){
        const col=ev.pct>0?'var(--krup)':(ev.pct<0?'var(--krdn)':'var(--ink)');
        ret=`<span style="color:${col}" class="tip-r" data-tip="5거래일 뒤(${ev.date}) 종가 기준 확정 수익률">${ev.pct>0?'+':''}${ev.pct.toFixed(1)}%</span>`;
        const s=scoreCall(r.call,ev.pct);
        vHtml=`<span class="hverdict hv-${s} tip-r" data-tip="${VERDICT_TIP[s]}">${VERDICT_LABEL[s]}</span>`;
      } else if(curPrice){                             // 미확정: 현재까지 흐름만 참고 표시
        const p=(curPrice-r.base)/r.base*100, col=p>0?'var(--krup)':(p<0?'var(--krdn)':'var(--ink)');
        ret=`<span style="color:${col}" class="tip-r" data-tip="아직 확정 전 — 현재가 기준 진행 중 수익률">${p>0?'+':''}${p.toFixed(1)}%<span style="color:var(--faint);font-size:10px"> 진행중</span></span>`;
        vHtml=`<span class="hverdict hv-now tip-r" data-tip="${VERDICT_TIP.now}">평가중</span>`;
      }
    }
    html+=`<tr class="${isLatest?'latest':''}">`+
      `<td class="num hdate">${String(r.date).replace(' ','<br>')}`+
        (r.recon?`<span class="hrecon tip-r" data-tip="재구성 — 과거 가격 데이터로 그날 판단을 되살린 백테스트예요. 기술·가격심리는 그날 값으로 정확히 계산했지만, 재무·수급은 저장된 과거값이 없어 현재값으로 근사했어요. 실시간 판단이 아니라 참고용 소급 기록이에요.">재구성</span>`:'')+
        `</td>`+
      `<td><span class="hcall ${r.call}">${r.call}</span></td>`+
      `<td class="num">${r.confidence}%</td>`+
      `<td class="num">${r.base?won(r.base):'—'}</td>`+
      `<td class="num">${ret}</td>`+
      `<td>${vHtml}</td></tr>`;
  });
  el.innerHTML=html+'</tbody></table></div></div></details>';
}

/* ============================================================
   내 포트폴리오 (개인 데이터 · localStorage)
   ★ 미래 다중사용자 대비: 저장을 프로필 이름으로 네임스페이스한다.
     지금은 프로필이 '나' 하나뿐 → 1인용. 나중에 프로필 선택만 붙이면 여러 명.
   ============================================================ */
const PF_PROFILE='나';
const pfKey=()=>'gaeo_portfolio__'+PF_PROFILE;
function loadPortfolio(){ try{return JSON.parse(localStorage.getItem(pfKey()))||{};}catch(e){return {};} }
function savePortfolio(p){ try{localStorage.setItem(pfKey(),JSON.stringify(p));}catch(e){} }

// 팀 콜 + 내 손익 → 해석 코멘트
function interpretCall(code, plPct, hasAvg){
  const L=LIVE_AN&&LIVE_AN[code];
  const call=L&&L.chief?L.chief.call:null;
  const tag=call?`<span class="hcall ${call}">${call}</span>`:'<span class="pf-mut">분석 없음</span>';
  if(!call||!hasAvg) return tag;
  const up=plPct>0;
  const msg = call==='SELL' ? (up?'익절 고려':'비중축소·손절 검토')
            : call==='BUY'  ? (up?'추가매수 여지':'물타기 신중')
            :                 '보유 유지';
  return `${tag} <span class="pf-msg">${msg}</span>`;
}
// CHIEF target/report에서 목표주가 숫자 best-effort 파싱
function parseTarget(code){
  const L=LIVE_AN&&LIVE_AN[code]; if(!L||!L.chief) return null;
  const txt=(L.chief.target||'')+' '+(L.chief.report||'');
  const m=txt.match(/목표(?:주)?가[^0-9]{0,8}([0-9][0-9,]{2,})\s*원/);
  return m?+m[1].replace(/,/g,''):null;
}
// 목표가까지 거리(현재가 기준) 셀 HTML
function targetHTML(code, price){
  const t=parseTarget(code); if(!t||!price) return '';
  const d=(t-price)/price*100, col=d>0?'var(--krup)':(d<0?'var(--krdn)':'var(--ink)');
  return `<div class="pf-tgt">목표 ${won(t)} <span style="color:${col}">(${d>0?'+':''}${d.toFixed(1)}%)</span></div>`;
}

// ── 포트폴리오 가격 레벨(지지·저항·손절·익절) — INDICATORS(MA·3개월밴드)로 자동 계산 ──
function pfLevels(code, price){
  const t=(liveInd(code)||{}).tech; if(!t||!price) return null;
  const mas=[t.ma20,t.ma60].filter(x=>typeof x==='number');
  const below=mas.filter(x=>x<price*0.997).sort((a,b)=>b-a);   // 현재가 바로 아래 이동평균
  const above=mas.filter(x=>x>price*1.003).sort((a,b)=>a-b);   // 현재가 바로 위 이동평균
  const supRaw=below.length?below[0]:(typeof t.low3m==='number'?t.low3m:null);
  const resRaw=above.length?above[0]:(typeof t.high3m==='number'?t.high3m:null);
  const support=supRaw?Math.round(supRaw):null, resistance=resRaw?Math.round(resRaw):null;
  return {support, resistance,
    stop: support?Math.round(support*0.97):null,   // 지지선 3% 아래 = 손절 참고
    take: resistance};                             // 저항선 도달 = 1차 익절 참고
}
function pfAdviceHTML(code, price){
  const L=pfLevels(code, price);
  if(!L||(!L.support&&!L.resistance))
    return '<div class="pf-adv-note">이 종목은 아직 차트 지표가 부족해 지지·저항선을 계산하지 못했어요. 시세가 더 쌓이면 표시됩니다.</div>';
  const pct=v=>{const p=(v-price)/price*100; return (p>0?'+':'')+p.toFixed(1)+'%';};
  const item=(cls,k,v,d)=> v?`<div class="pf-lv-item ${cls}"><span class="k">${k}</span><span class="v">${won(v)}</span> <span class="d">(${pct(v)}) · ${d}</span></div>`:'';
  return `<div class="pf-adv-t">이 종목 제안 <span style="font-weight:600;color:var(--dim)">(지금 ${won(price)} 기준)</span></div>`+
    `<div class="pf-lv">`+
      item('pf-lv-res','🧱 저항선(위쪽 벽)',L.resistance,'자주 막히는 곳')+
      item('pf-lv-sup','🛟 지지선(아래 쿠션)',L.support,'잘 버티는 곳')+
      item('pf-lv-take','익절가(이익 실현)',L.take,'닿으면 일부 팔기')+
      item('pf-lv-stop','🛑 손절가(손해 방지)',L.stop,'깨지면 정리')+
    `</div>`+
    `<div class="pf-adv-note" id="pf-note-${code}"></div>`;
}
function pfGuideText(code, price, avg, qty){
  const hasData=qty>0&&avg>0, plPct=(hasData&&price)?(price-avg)/avg*100:0;
  const e=analysisEntry(code), call=e&&e.chief?e.chief.call:null;
  const tier=analysisTier(code)==='auto'?'자동분석':'정밀분석';
  const team = call==='BUY'?'개오팀은 이 종목을 <b>좋게(BUY)</b> 봐요. '
             : call==='SELL'?'개오팀은 이 종목을 <b>조심(SELL)</b>하라고 봐요. '
             : call==='HOLD'?'개오팀은 <b>지켜보라(HOLD)</b>고 봐요. '
             : call==='JUDGMENT_WITHHELD'?'자료가 모자라 이번엔 <b>판단을 보류</b>했어요. ' : '';
  let me='';
  if(hasData){
    if(plPct>0) me = call==='SELL'
      ? '지금 <b>이익 중</b>이에요 — 욕심내지 말고 익절가 근처에서 일부 파는 것도 좋은 선택이에요.'
      : '지금 <b>이익 중</b>! 익절가를 미리 정해두면 마음이 편해요.';
    else me = call==='BUY'
      ? '지금은 <b>마이너스</b>지만 팀은 아직 긍정적이에요. 손절가를 지키면서 기다려보세요.'
      : '지금 <b>마이너스</b>예요. 손절가 밑으로 내려가면 더 큰 손해 전에 정리하는 걸 생각해요.';
  } else {
    me='<b>수량과 평단(내가 산 평균가격)</b>을 넣으면, 내 손익에 딱 맞춘 손절·익절 라인을 알려드려요.';
  }
  // 평단 기준 실전 손절/익절 라인 — 차트 지지선이 멀 때도 바로 쓸 수 있는 내 기준선
  let mine='';
  if(hasData){
    const stopA=Math.round(avg*0.92), takeA=Math.round(avg*1.15);
    mine=`<br>📐 <b>내 평단 ${won(avg)} 기준</b> — 손절 참고 <b>${won(stopA)}</b>(-8%), 1차 익절 참고 <b>${won(takeA)}</b>(+15%). 이 선을 미리 정해두면 마음이 흔들리지 않아요.`;
  }
  return `${team}${me}${mine} <span style="color:var(--faint)">(${tier} 기준 · 참고용, 투자 권유 아님)</span>`;
}

let PF_SHELL=false;
function renderPortfolio(){
  const el=document.getElementById('portfolio'); if(!el) return;
  if(!PF_SHELL){
    el.innerHTML=`
      <div class="pf-head"><h3>내 포트폴리오</h3><span class="pf-profile">프로필 <b>${PF_PROFILE}</b></span></div>
      <div class="pf-guide">
        <span class="pg-t">시작 전 가이드라인 — 이것만 지켜도 절반은 성공!</span>
        <ol>
          <li>한 종목에 <b>몰빵 금지</b> — 여러 종목·업종으로 나눠 담아요(분산).</li>
          <li>사기 전에 <b>손절가</b>(얼마 내리면 팔지)를 미리 정해요.</li>
          <li>오를 때도 <b>익절가</b>(얼마에서 일부 팔지)를 정해두면 마음이 편해요.</li>
          <li>뉴스·감정으로 <b>급하게 사고팔지</b> 않아요.</li>
          <li><b>잃어도 괜찮은 돈</b>으로, 공부하면서 천천히 해요.</li>
        </ol>
      </div>
      <div class="pf-add">
        <div class="ac-wrap"><input id="pfAdd" autocomplete="off" placeholder="담고 싶은 종목을 한글로 검색해 추가 (예: 삼성전자, 반도체)"><div class="acbox" id="acboxPf"></div></div>
        <div class="pf-add-hint">이름·업종으로 검색해서 <b>내가 가진 종목만</b> 추가하세요. 추가 후 수량·평단을 넣으면 손익과 맞춤 제안이 나와요.</div>
      </div>
      <div class="pf-sum" id="pfSum"></div>
      <div class="pf-risk" id="pfRisk"></div>
      <div id="pfList"></div>
      <div class="pf-note">입력값은 이 브라우저에 프로필 「${PF_PROFILE}」로 자동 저장돼요(내 폰에만). · 지지·저항선은 차트 지표(이동평균·3개월 밴드)로 자동 계산 · 분석 의견이며 투자 권유가 아닙니다.</div>`;
    makeAutocomplete(document.getElementById('pfAdd'), document.getElementById('acboxPf'), {
      onPick:x=>{
        const pf=loadPortfolio(); pf[x.code]=pf[x.code]||{}; pf[x.code].added=true; savePortfolio(pf);
        document.getElementById('pfAdd').value=''; renderPfHoldings();
        setTimeout(()=>{const c=document.getElementById('pf-card-'+x.code); if(c) c.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'center'});},60);
      }
    });
    PF_SHELL=true;
  }
  renderPfHoldings();
}

function renderPfHoldings(){
  const list=document.getElementById('pfList'), sum=document.getElementById('pfSum'); if(!list) return;
  const pf=loadPortfolio();
  const codes=Object.keys(pf).filter(c=>STOCKS[c]);
  if(!codes.length){
    list.innerHTML=`<div class="pf-empty">아직 담은 종목이 없어요.<br>위 검색창에서 <b>내가 가진 종목</b>을 추가해보세요.</div>`;
    if(sum) sum.style.display='none';
    return;
  }
  if(sum) sum.style.display='';
  list.innerHTML=codes.map(code=>{
    const d=STOCKS[code], h=pf[code]||{};
    const cur=d.price?won(d.price):'—';
    const rate=(typeof d.rate==='number')?`<span class="r ${d.rate>0?'up':'down'}">${d.rate>0?'+':''}${d.rate.toFixed(2)}%</span>`:'';
    return `<div class="pf-card" id="pf-card-${code}">
      <div class="pf-card-top">
        <span class="pf-card-nm">${d.name}</span><span class="pf-card-code">${code}</span>
        <span class="pf-card-cur">${cur} ${rate}</span>
        <button class="pf-del" data-del="${code}" title="포트폴리오에서 빼기">✕</button>
      </div>
      <div class="pf-inrow">
        <div class="pf-field"><label>보유 수량(주)</label><input class="pf-in" data-code="${code}" data-f="qty" type="number" inputmode="numeric" min="0" step="1" placeholder="0" value="${h.qty??''}"></div>
        <div class="pf-field"><label>평단 = 내가 산 평균가격(원)</label><input class="pf-in" data-code="${code}" data-f="avg" type="number" inputmode="numeric" min="0" step="1" placeholder="예: 70000" value="${h.avg??''}"></div>
      </div>
      <div class="pf-pl" id="pf-pl-${code}"></div>
      <div class="pf-advice">${pfAdviceHTML(code, d.price)}</div>
      <input class="pf-memo" data-code="${code}" placeholder="메모(선택) — 예: 배당 목적, 분할매수 중" maxlength="120" value="${(h.memo||'').replace(/"/g,'&quot;')}">
    </div>`;
  }).join('');
  recalcPf();
}

/* ─────────────────────────────────────────────────────────────────────────────
   위험 겹침 — "4종목 가졌으니 분산됐다"는 착각을 막는다.

   사람들은 종목 수만 보고 분산됐다고 생각한다. 그런데 삼성전자와 SK하이닉스를
   나눠 담아도 둘이 같은 날 같은 방향으로 움직이면 실제로는 한 종목을 두 번 산
   것에 가깝다. 그래서 두 가지를 따로 보여준다.
     A. 업종 집중도 — 어디에 몰려 있나
     B. 실제 가격 움직임 겹침 — 정말 따로 움직이나

   ⭐ 계산 방법은 결과를 보기 전에 고정했다(숫자가 예쁘게 나오는 쪽을 고르지 않는다).
     · 가격 수준끼리 상관계수를 내지 않는다. 그건 둘 다 우상향이면 무조건 높게 나온다.
       반드시 일간 단순수익률(오늘종가/어제종가 - 1)로 바꿔서 잰다.
     · 두 종목에 같은 날짜가 다 있는 관측치만 짝지어 쓴다(날짜 정렬 후 교집합).
     · Pearson 상관계수를 쓴다. 결과가 마음에 안 든다고 Spearman으로 바꾸지 않는다.
     · 최근 60거래일. 짝 관측치가 MIN_PAIR_OBS 미만이면 숫자를 만들지 않고
       "데이터 부족"이라고 말한다. 기간을 늘려 숫자를 만들어내지 않는다.

   ⚠️ 이 값은 정보 제공용이다. CHIEF 점수·BUY/HOLD/SELL 판단·Evolution·모의투자
      전략에 아무 영향을 주지 않는다. 사용자 보유 종목은 어디로도 전송되지 않는다.
   ⚠️ 600×600 전체 상관행렬을 만들지 않는다. 사용자가 담은 종목끼리만 계산한다.
   ───────────────────────────────────────────────────────────────────────────── */
const PF_CORR_WINDOW=60;    // 최근 60거래일
const PF_MIN_PAIR_OBS=40;   // 통계가 흔들리지 않을 최소 짝 관측치 수.
                            // 투자성과를 보고 고른 숫자가 아니며, 수익률을 높이려고
                            // 나중에 자동 튜닝하지 않는다(고정 데이터 품질 기준).

// 같은 종목의 종가를 쌍마다 다시 파싱하지 않는다. N종목이면 pfCloses가
// N(N-1)번 불리는데(쌍마다 2회), 실제로 필요한 건 N번뿐이다.
// 실측(2026-08-26 QA): 200종목에서 재계산 761ms → 입력이 눈에 띄게 밀렸다.
const PF_CLOSES_CACHE={};

/** price_history에서 code의 최근 N거래일 {날짜: 종가}. 없으면 null. */
function pfCloses(code,limit=PF_CORR_WINDOW+1){
  if(typeof PRICE_HISTORY==='undefined') return null;
  const ck=code+'@'+limit;
  if(ck in PF_CLOSES_CACHE) return PF_CLOSES_CACHE[ck];
  const v=pfClosesUncached(code,limit);
  PF_CLOSES_CACHE[ck]=v;
  return v;
}

function pfClosesUncached(code,limit){
  const pages=PRICE_HISTORY[code];
  if(!Array.isArray(pages)) return null;
  const days=[];
  for(const pg of pages) for(const d of (pg&&pg.days)||[]){
    if(d&&d.date&&typeof d.close==='number') days.push(d);
  }
  if(!days.length) return null;
  days.sort((a,b)=>String(a.date).localeCompare(String(b.date)));   // 오름차순 고정
  const out={};
  for(const d of days.slice(-limit)) out[d.date]=d.close;
  return out;
}

/** 두 종목의 같은 날짜만 짝지어 일간 단순수익률 Pearson 상관계수. */
function pfCorrelation(a,b){
  const ca=pfCloses(a), cb=pfCloses(b);
  if(!ca||!cb) return {status:'NO_DATA'};
  // 두 종목에 모두 존재하는 날짜만, 날짜순으로.
  const dates=Object.keys(ca).filter(d=>d in cb).sort();
  if(dates.length<2) return {status:'NO_DATA'};
  // ⭐ 수익률은 '연속한 두 거래일' 사이에서만 의미가 있다.
  //
  // 각 종목이 자기 이력에서 그 두 날짜를 바로 붙어 있는 날로 갖고 있어야 한다.
  // 한쪽이 거래정지로 며칠 빠졌다면, 그 구멍을 건너뛴 값은 '하루 수익률'이 아니라
  // 며칠치가 뭉친 값이다. 2026-08-26 감사에서 이걸 실측으로 확인했다: 서로 무관한
  // 두 종목(r≈0)에 정지 후 재개 구간 하나(A -25% · B -20%)를 그대로 이어 붙였더니
  // 상관계수가 0.96으로 뒤집혔다. 관측치 하나의 변동폭이 평소의 10배면 분산 기여는
  // 100배라, 그 하나가 상관계수를 혼자 결정해 버린다.
  //
  // 구멍을 어떻게 알아내나: 두 종목 날짜의 합집합을 '거래일 달력'으로 삼는다.
  // 한 종목이 정지로 빠진 날도 다른 종목에는 남아 있으므로 합집합에는 들어간다.
  // 그래서 두 날짜가 합집합에서 바로 이웃일 때만 하루치 수익률로 인정한다.
  //   · 둘 다 없는 날(공휴일)은 합집합에도 없으니 정상 구간으로 남는다. ✅
  //   · 한쪽만 빠진 날이 있으면 이웃이 아니게 되어 그 구간을 버린다. ✅
  // 각자의 인덱스만 보면 안 된다 — 빠진 날은 그 종목 목록에서 아예 사라져
  // 번호가 다시 매겨지므로, 구멍이 있어도 '바로 다음'으로 보인다(실측 확인).
  const union={}; Object.keys(Object.assign({},ca,cb)).sort().forEach((d,i)=>union[d]=i);
  const ra=[], rb=[];
  for(let i=1;i<dates.length;i++){
    const p=dates[i-1], q=dates[i];
    if(!(ca[p]>0&&cb[p]>0&&ca[q]>0&&cb[q]>0)) continue;
    if(union[q]!==union[p]+1) continue;   // 어느 한쪽이라도 빠진 날이 사이에 있으면 버린다
    ra.push(ca[q]/ca[p]-1); rb.push(cb[q]/cb[p]-1);
  }
  const n=ra.length;
  if(n<PF_MIN_PAIR_OBS) return {status:'INSUFFICIENT',obs:n};
  const mean=v=>v.reduce((s,x)=>s+x,0)/v.length;
  const ma=mean(ra), mb=mean(rb);
  let cov=0, va=0, vb=0;
  for(let i=0;i<n;i++){
    const da=ra[i]-ma, db=rb[i]-mb;
    cov+=da*db; va+=da*da; vb+=db*db;
  }
  if(va<=0||vb<=0) return {status:'INSUFFICIENT',obs:n};   // 한쪽이 전혀 안 움직인 경우
  return {status:'OK', r:cov/Math.sqrt(va*vb), obs:n,
          from:dates[0], to:dates[dates.length-1]};
}

/** 사용자에게 보여줄 겹침 등급. UX 설명용 고정 기준이며 모델 점수와 무관하다. */
function pfOverlapLabel(r){
  if(r>=0.70) return {key:'high',  text:'움직임 겹침 높음'};
  if(r>=0.40) return {key:'mid',   text:'움직임 겹침 보통'};
  if(r>=0)    return {key:'low',   text:'움직임 겹침 낮음'};
  return              {key:'inv',  text:'최근에는 반대로 움직이는 편'};
}

/** 업종 집중도. 수량·현재가가 다 있으면 평가금액 기준, 아니면 종목 수 기준. */
function pfSectorConcentration(codes,pf){
  const byValue=codes.every(c=>(+((pf[c]||{}).qty)||0)>0&&(STOCKS[c].price||0)>0);
  const w={}; let total=0;
  codes.forEach(c=>{
    const sec=STOCKS[c].sector||'기타';
    const v=byValue?(+pf[c].qty)*STOCKS[c].price:1;
    w[sec]=(w[sec]||0)+v; total+=v;
  });
  const rows=Object.entries(w).map(([sector,v])=>({sector,pct:total>0?v/total*100:0}))
    .sort((x,y)=>y.pct-x.pct);
  return {basis:byValue?'value':'count', rows, total};
}

// 종목 이름. 화면 다른 곳의 nameOf()는 각자 IIFE 안에 갇혀 있어 여기서 못 쓴다.
const pfNameOf=code=>(STOCKS[code]&&STOCKS[code].name)||code;

/** 위험 겹침 블록을 그린다. price_history가 없으면 '보기' 버튼만 둔다. */
function renderPfRisk(){
  const box=document.getElementById('pfRisk'); if(!box) return;
  const pf=loadPortfolio();
  const codes=Object.keys(pf).filter(c=>STOCKS[c]);
  if(codes.length<2){ box.innerHTML=''; return; }

  const conc=pfSectorConcentration(codes,pf);
  const top=conc.rows[0];
  const basisNote=conc.basis==='value'?'평가금액 기준':'종목 수 기준(수량·평단을 넣으면 평가금액 기준으로 바뀌어요)';
  let html=`<div class="pf-risk-head">분산 상태</div>`+
    `<div class="pf-risk-line"><b>${esc(top.sector)}</b> 비중 ${top.pct.toFixed(0)}%`+
    `<span class="pf-risk-sub">${esc(basisNote)}</span></div>`;

  // 28MB짜리 가격 이력은 사용자가 실제로 볼 때만 내려받는다(첫 화면 무게 유지).
  if(typeof PRICE_HISTORY==='undefined'){
    html+=`<div class="pf-risk-head">위험 겹침</div>`+
      `<div class="pf-risk-line pf-mut">담은 종목들이 실제로 따로 움직이는지 확인할 수 있어요.`+
      `<button type="button" id="pfRiskLoad" class="pf-risk-btn">겹침 확인하기</button>`+
      `<span class="pf-risk-sub">지난 시세 자료를 받아와요(약 29MB). Wi-Fi에서 보시는 걸 권해요.</span></div>`;
    box.innerHTML=html;
    const btn=document.getElementById('pfRiskLoad');
    if(btn) btn.onclick=async()=>{
      btn.disabled=true; btn.textContent='불러오는 중…';
      // history 키가 아니라 priceHistory 키를 쓴다 — 판단 이력 13.6MB는 필요 없다.
      try{ await GaeoFeatures.load('priceHistory'); renderPfRisk(); }
      catch(e){ btn.disabled=false; btn.textContent='다시 시도'; }
    };
    return;
  }

  // 사용자가 담은 종목끼리만. 8종목이면 28쌍이라 전부 계산해도 가볍다.
  // 다만 종목 수가 늘면 쌍은 제곱으로 는다(200종목=19,900쌍, 실측 761ms).
  // 평가금액 상위 종목으로 잘라서 화면이 멈추지 않게 한다 — 겹침을 보는 목적은
  // '내 돈이 어디에 몰렸나'이므로 비중이 큰 쪽을 남기는 게 맞다.
  const PF_MAX_PAIR_CODES=30;
  let calcCodes=codes;
  let trimmed=0;
  if(codes.length>PF_MAX_PAIR_CODES){
    const val=c=>((+((pf[c]||{}).qty)||0)*(STOCKS[c].price||0))||0;
    calcCodes=codes.slice().sort((x,y)=>val(y)-val(x)).slice(0,PF_MAX_PAIR_CODES);
    trimmed=codes.length-calcCodes.length;
  }
  const pairs=[];
  for(let i=0;i<calcCodes.length;i++) for(let j=i+1;j<calcCodes.length;j++){
    const res=pfCorrelation(calcCodes[i],calcCodes[j]);
    pairs.push({a:calcCodes[i],b:calcCodes[j],res});
  }
  const usable=pairs.filter(p=>p.res.status==='OK').sort((x,y)=>y.res.r-x.res.r).slice(0,3);
  const short=pairs.length-pairs.filter(p=>p.res.status==='OK').length;

  html+=`<div class="pf-risk-head">위험 겹침</div>`;
  if(!usable.length){
    html+=`<div class="pf-risk-line pf-mut">가격 기록이 모자라 아직 계산할 수 없어요`+
      `<span class="pf-risk-sub">최근 ${PF_CORR_WINDOW}거래일 중 두 종목이 함께 있는 날이 ${PF_MIN_PAIR_OBS}일보다 적어요</span></div>`;
  }else{
    usable.forEach(p=>{
      const lab=pfOverlapLabel(p.res.r);
      html+=`<div class="pf-risk-line"><span class="pf-risk-pair">${esc(pfNameOf(p.a))} ↔ ${esc(pfNameOf(p.b))}</span>`+
        `<b>${lab.text}</b>`+
        `<span class="pf-risk-sub">상관계수 ${p.res.r.toFixed(2)} · 관측 ${p.res.obs}일 · ${esc(p.res.from)}~${esc(p.res.to)}</span></div>`;
    });
    const worst=usable[0];
    if(worst.res.r>=0.70){
      html+=`<div class="pf-risk-say">최근 이 두 종목이 비슷한 방향으로 움직인 날이 많아요.`+
        ` 나눠 담았어도 분산 효과는 생각보다 작을 수 있어요.</div>`;
    }else if(worst.res.r>=0.40){
      html+=`<div class="pf-risk-say">어느 정도 같이 움직이는 편이에요. 완전히 따로 움직이지는 않아요.</div>`;
    }else{
      html+=`<div class="pf-risk-say">담은 종목들이 서로 꽤 따로 움직이고 있어요.</div>`;
    }
    if(short) html+=`<div class="pf-risk-sub">가격 기록이 모자라 못 잰 조합 ${short}개는 뺐어요.</div>`;
  }
  if(trimmed) html+=`<div class="pf-risk-sub">담은 종목이 많아 평가금액 상위 ${PF_MAX_PAIR_CODES}개만 비교했어요(${trimmed}개 제외).</div>`;
  html+=`<div class="pf-risk-sub">※ 참고 정보예요. 종목 점수나 매수·매도 판단에는 쓰이지 않아요.</div>`;
  box.innerHTML=html;
}

function recalcPf(){
  const pf=loadPortfolio();
  let totCost=0, totVal=0, held=0, todayGain=0, annDiv=0;
  Object.keys(pf).filter(c=>STOCKS[c]).forEach(code=>{
    const d=STOCKS[code], h=pf[code]||{}, qty=+h.qty||0, avg=+h.avg||0, price=d.price||0;
    const plEl=document.getElementById('pf-pl-'+code), noteEl=document.getElementById('pf-note-'+code);
    const plPct=(avg>0&&price)?(price-avg)/avg*100:0;
    if(plEl){
      if(qty>0&&price){
        const val=qty*price, pl=val-qty*avg, col=pl>0?'var(--krup)':(pl<0?'var(--krdn)':'var(--ink)');
        plEl.innerHTML=`<span>평가금액 <b>${won(val)}</b></span>`+
          (avg>0?`<span>평가손익 <b style="color:${col}">${pl>0?'+':''}${won(pl)} (${pl>0?'+':''}${plPct.toFixed(1)}%)</b></span>`
                :`<span class="pf-mut">평단을 넣으면 손익이 계산돼요</span>`);
      } else plEl.innerHTML=`<span class="pf-mut">수량을 넣으면 평가금액·손익이 나와요</span>`;
    }
    if(noteEl) noteEl.innerHTML=pfGuideText(code, price, avg, qty);
    if(qty>0&&price){
      totVal+=qty*price; totCost+=qty*avg; held++;
      if(typeof d.rate==='number'){const prev=price/(1+d.rate/100); todayGain+=qty*(price-prev);}
      if(typeof d.div==='number') annDiv+=qty*price*d.div/100;
    }
  });
  const sum=document.getElementById('pfSum'); if(!sum) return;
  // 수량·평단이 없어도 위험 겹침은 잴 수 있다(업종은 종목 수 기준, 상관계수는
  // 가격 이력만 쓴다). 여기서 그냥 return하면 담기만 한 사용자가 못 보게 된다.
  if(held===0){
    sum.innerHTML='수량·평단을 입력하면 총 평가액·손익·오늘 손익·예상 배당이 여기 표시돼요.';
    schedulePfRisk(); return;
  }
  const pl=totVal-totCost, plPct=totCost>0?pl/totCost*100:0;
  const col=v=>v>0?'var(--krup)':(v<0?'var(--krdn)':'var(--ink)');
  const mood = plPct>5?'매우 양호':plPct>0?'양호':plPct<-5?'주의':'관찰';
  sum.innerHTML=`<div class="pf-sumrow">
    <span>${mood} 보유 <b>${held}</b>종목</span>
    <span>매입 <b>${won(totCost)}</b></span>
    <span>평가 <b>${won(totVal)}</b></span>
    <span>평가손익 <b style="color:${col(pl)}">${pl>0?'+':''}${won(pl)} (${pl>0?'+':''}${plPct.toFixed(1)}%)</b></span>
    <span>오늘 <b style="color:${col(todayGain)}">${todayGain>0?'+':''}${won(Math.round(todayGain))}</b></span>
    <span>연 예상 배당 <b>${won(Math.round(annDiv))}</b></span>
  </div>`;
  schedulePfRisk();
}

// 위험 겹침은 수량·평단을 한 글자 칠 때마다 다시 계산할 필요가 없다.
// 상관계수는 입력값과 무관하고(가격 이력만 씀), 업종 비중만 수량을 본다.
// 타이핑이 멈춘 뒤 한 번만 계산해서 입력이 밀리지 않게 한다.
let PF_RISK_TIMER=null;
function schedulePfRisk(){
  clearTimeout(PF_RISK_TIMER);
  PF_RISK_TIMER=setTimeout(renderPfRisk,180);
}

// 입력 저장(이벤트 위임 · #portfolio는 상시 존재) — 숫자(.pf-in) + 메모(.pf-memo)
document.getElementById('portfolio').addEventListener('input',e=>{
  const num=e.target.closest('.pf-in'), memo=e.target.closest('.pf-memo');
  if(!num && !memo) return;
  const el=num||memo, code=el.dataset.code, pf=loadPortfolio();
  pf[code]=pf[code]||{};
  if(num){
    const f=num.dataset.f;
    if(num.value==='') delete pf[code][f]; else pf[code][f]=Math.max(0,+num.value||0);
  } else {
    if(memo.value==='') delete pf[code].memo; else pf[code].memo=memo.value.slice(0,120);
  }
  // 검색으로 담은 종목(added)은 값이 비어도 카드 유지 — ✕로만 뺀다
  if(!pf[code].added && pf[code].qty===undefined && pf[code].avg===undefined && pf[code].memo===undefined) delete pf[code];
  savePortfolio(pf);
  if(num) recalcPf();   // 메모는 숫자에 영향 없어 재계산 생략(입력 포커스 보존)
});
// 종목 빼기(✕)
document.getElementById('portfolio').addEventListener('click',e=>{
  const del=e.target.closest('.pf-del'); if(!del) return;
  const code=del.dataset.del, pf=loadPortfolio(); delete pf[code]; savePortfolio(pf);
  renderPfHoldings();
});

/* ============================================================
   애널리스트 정확도 리더보드
   각 분석가의 stance(강세/약세)가 이후 주가와 맞았는지로 적중률 집계.
   history.js의 종목별 기록(taro/diana/nova/flow의 stance) + 현재가로 계산.
   ============================================================ */
const LB_IDS=['taro','diana','nova','flow'];
const LB_MIN=3; // MVP 인정 최소 표본
const LB_RULES={
  taro:{days:5,deadband:1}, diana:{days:20,deadband:3},
  nova:{days:5,deadband:1}, flow:{days:5,deadband:1}
};
// stance vs 이후 수익률 → 'hit'/'miss'/'mid'(±1% 이내 평가보류)/null(neu 등 집계제외)
function scoreStance(stance, ret, deadband=1){
  if(stance==='bull') return ret>deadband?'hit':(ret<-deadband?'miss':'mid');
  if(stance==='bear') return ret<-deadband?'hit':(ret>deadband?'miss':'mid');
  return null;
}
function scorecardAnalystRows(teamWeights,agents){
  const global=teamWeights&&teamWeights.global;
  if(!global||!global.acc) return [];
  const weights=global.weights||{};
  const ids=['taro','diana','nova','flow'];
  return ids.map(id=>{
    const stat=global.acc[id];
    if(!stat) return null;
    const agent=(agents||[]).find(item=>item.id===id)||{name:id,role:'',color:'#999'};
    return {id,name:agent.name,role:agent.role,color:agent.color,n:Number(stat.n)||0,
      acc:stat.acc==null?null:Number(stat.acc),weight:weights[id]==null?null:Number(weights[id])};
  }).filter(Boolean).sort((a,b)=>{
    if(a.acc===null&&b.acc===null) return b.n-a.n;
    if(a.acc===null) return 1;
    if(b.acc===null) return -1;
    return b.acc-a.acc||b.n-a.n;
  });
}
function leaderboardHTML(){
  const TW=(typeof TEAM_WEIGHTS!=='undefined'&&TEAM_WEIGHTS&&TEAM_WEIGHTS.global)?TEAM_WEIGHTS:null;
  if(!TW) return `<section class="leaderboard on"><div class="lb-head"><h3>애널리스트 성적</h3></div>
    <div class="lb-empty">성적 자료를 불러오지 못했어요. 잠시 뒤 새로고침해 주세요.</div></section>`;
  const rows=scorecardAnalystRows(TW,typeof AGENTS!=='undefined'?AGENTS:[]);
  const mvpEligible=rows[0]&&rows[0].acc!==null&&rows[0].n>=LB_MIN;
  let cards='';
  rows.forEach((r,i)=>{
    const isMvp=mvpEligible&&i===0;
    const accHtml=r.acc===null
      ? '<span class="lb-acc" style="color:var(--dim)">—</span>'
      : `<span class="lb-acc" style="color:${r.acc>=60?'var(--green)':(r.acc<45?'var(--red)':'var(--amber)')}">${r.acc}%</span>`;
    const wHtml=r.weight!==null
      ? `<span class="lb-weight" title="CHIEF가 최종 판단을 합산할 때 이 분석가의 점수에 주는 발언권 — 최근 적중률에 비례해 자동 조정돼요">발언권 ${(r.weight*100).toFixed(0)}%</span>`
      : '';
    cards+=`<div class="lb-card ${isMvp?'mvp':''}">
      <div class="lb-rank">${i+1}</div>
      <div class="lb-who">
        <div class="lb-nm"><span class="lb-dot" style="color:${r.color}">●</span>${r.name}${isMvp?'<span class="lb-mvp-tag">이달의 MVP</span>':''}${wHtml}</div>
        <div class="lb-role">${r.role}</div>
        <div class="lb-bar"><i style="width:${r.acc===null?0:r.acc}%"></i></div>
      </div>
      <div class="lb-stat">${accHtml}<div class="lb-rec">채점 ${r.n.toLocaleString()}건</div></div>
    </div>`;
  });
  return `<section class="leaderboard on"><div class="lb-head"><h3>애널리스트 성적</h3></div>
    <div class="lb-sub">각 분석가의 역할에 맞춰 채점합니다. <b>TARO·QUANT·FLOW는 5거래일</b>, 장기 기업가치를 보는 <b>DIANA는 20거래일</b> 뒤 종가를 사용합니다.
    <b>2026년 8월 31일부터 이 적중률은 「시장보다 잘했나」로 채점합니다</b> — 같은 기간 전 종목 등락률의 한가운데 값(중앙값)을 빼고 남은 차이로 맞고 틀림을 가립니다.
    시장이 통째로 오른 날 방향만 따라 말한 것을 실력으로 세지 않기 위해서예요. 그래서 이 숫자는 예전(그냥 올랐나로 채점하던 때)과 바로 비교할 수 없습니다.
    <b>CHIEF 발언권은 역할 기본비중과 보정 적중률을 함께 반영합니다</b>. 표본이 작을 때 생기는 우연한 급등락은 50% 쪽으로 완화합니다(채점 ${(TW.global.graded||0).toLocaleString()}건 기반, 업종별 보정 ${Object.keys(TW.sectors||{}).length}개).
    <span style="color:var(--faint)">※ 초기 기록 일부는 과거 가격으로 되살린 <b>재구성(백테스트)</b> 판단이 포함돼 있어요(히스토리 표에 「재구성」 표시). 앞으로는 매일 실시간 판단이 쌓입니다.</span></div>
    ${cards}
    <div class="lb-note">단기축은 시장 대비 ±1%p, DIANA는 ±3%p 이내 차이를 평가 보류합니다. MVP는 채점 ${LB_MIN}건 이상부터 표시하며, 발언권은 역할 사전비중과 보정 적중률을 함께 반영합니다.
    ${TW.scoring&&TW.scoring.basis==='market_relative_excess'?`기준선은 개오가 추적하는 전 종목의 중앙값이며, 기준선을 만들 표본이 모자란 경우(${Number(TW.scoring.fallbackToAbsoluteN||0).toLocaleString()}건)에만 예전 방식으로 채점했습니다.`:''}</div></section>`;
}

/* ============================================================
   🧾 개오 성적표 — 주간 자동 채점 + 분석가 열전
   history.js·price_history.js(판단 채점) + team_weights.js(분석가별 실측 적중률)만으로
   렌더링한다. 새 글을 쓰지 않고 저장된 stance·적중률을 그대로 요약해 보여준다
   (AI 토큰 0원, 서버가 매 사이클 다시 계산할 때마다 이 화면도 자동으로 갱신됨).
   ============================================================ */
const SC_NAME={taro:'TARO',diana:'DIANA',nova:'QUANT',flow:'FLOW'};
const SC_ROLE={taro:'기술적 분석가',diana:'재무·기본적 분석가',nova:'확률·통계 분석가',flow:'수급 분석가'};
// 판단 당시 4인의 stance를 그대로 요약해 "왜 이 방향이었는지" 한 줄로 보여준다 — 새로 해석을 붙이지 않고
// 이미 기록된 사실(누가 강세/약세였는지, 결과가 어느 쪽이었는지)만 문장으로 옮긴다.
function scWhy(r){
  const ids=['taro','diana','nova','flow'];
  const bulls=ids.filter(id=>r[id]&&r[id].stance==='bull').map(id=>SC_NAME[id]);
  const bears=ids.filter(id=>r[id]&&r[id].stance==='bear').map(id=>SC_NAME[id]);
  const dir=r.ret>0?'상승':(r.ret<0?'하락':'보합');
  if(bulls.length&&bears.length) return `${bulls.join('·')}는 강세, ${bears.join('·')}는 약세로 의견이 갈렸는데 실제로는 ${dir}했어요.`;
  if(bulls.length===ids.length) return `4인 전원 강세 의견이었고 실제로 ${dir}했어요.`;
  if(bears.length===ids.length) return `4인 전원 약세 의견이었고 실제로 ${dir}했어요.`;
  if(bulls.length) return `${bulls.join('·')}만 강세 의견이었고 실제로 ${dir}했어요.`;
  if(bears.length) return `${bears.join('·')}만 약세 의견이었고 실제로 ${dir}했어요.`;
  return `의견 대부분 중립이었는데 실제로 ${dir}했어요.`;
}
function scCallCard(r,kind){
  const col=r.ret>0?'var(--krup)':(r.ret<0?'var(--krdn)':'var(--dim)');
  const badgeCls=r.call==='BUY'?'buy':(r.call==='SELL'?'sell':'hold');
  return `<div class="sc-call-card ${kind}">
    <div class="sc-call-nm"><span class="sc-call-badge ${badgeCls}">${esc(r.call)}</span>${esc(r.name)}</div>
    <div class="sc-call-meta">${esc(r.date)} 판단 · ${esc(r.gradeDate)} 채점</div>
    <div class="sc-call-ret" style="color:${col}">${r.ret>0?'+':''}${r.ret.toFixed(1)}%</div>
    <div class="sc-call-reason">${esc(scWhy(r))}</div>
  </div>`;
}
// 이번 주 = 5거래일 채점 창이 막 닫힌(채점일이 최근 7일 이내인) 판단들.
// 채점 기록 자체가 history.js·price_history.js에 계속 쌓이는 로그라, 주 단위로 끊어
// 넘겨보면 그 자체로 "매주 자동 기록되는 성적표 아카이브"가 된다(별도 저장소 불필요).
let SC_WEEK_OFFSET=0;   // 0=이번 주, 1=한 주 전, 2=두 주 전 …
/* 📊 2026-08-14: "시장 대비" 채점을 위한 날짜별 시장 중앙값.
   절대수익률만으로 채점하면 시장이 오른 주에는 BUY가, 내린 주에는 SELL이 자동으로 맞아
   "종목을 잘 골랐는지"가 아니라 "시장이 어느 쪽으로 갔는지"를 재게 된다(실측: 이후 시장이
   오른 구간 적중률 15.6% vs 내린 구간 78.6%). 같은 날 분석 종목 전체의 5거래일 수익률 중앙값을
   빼주면 시장 흐름이 상쇄돼 "시장보다 잘했나"만 남는다. PRICE_HISTORY로 한 번만 계산해 캐시한다. */
let SC_MKT_MED=null;
function scMarketMedian(){
  if(SC_MKT_MED) return SC_MKT_MED;
  const byDate={};
  const src=LIVE_PH||{};
  for(const code in src){
    const rows=src[code].flatMap(p=>p.days).filter(d=>d&&d.date&&typeof d.close==='number')
      .sort((a,b)=>a.date<b.date?-1:(a.date>b.date?1:0));
    for(let i=0;i+EVAL_DAYS<rows.length;i++){
      if(!rows[i].close) continue;
      (byDate[rows[i].date]=byDate[rows[i].date]||[]).push((rows[i+EVAL_DAYS].close/rows[i].close-1)*100);
    }
  }
  SC_MKT_MED={};
  for(const d in byDate){ const a=byDate[d].sort((x,y)=>x-y); SC_MKT_MED[d]=a[Math.floor(a.length/2)]; }
  return SC_MKT_MED;
}
function scAllGradedRows(){
  const rows=[]; const med=scMarketMedian();
  if(LIVE_HIST) for(const code in LIVE_HIST){
    LIVE_HIST[code].forEach(e=>{
      if(!e.base||!e.call) return;
      const ev=evalRet(code,e); if(!ev) return;
      const day=String(e.date).slice(0,10);
      rows.push({code, name:(STOCKS[code]&&STOCKS[code].name)||code, date:day,
        call:e.call, ret:ev.pct, gradeDate:ev.date, modelVersion:e.modelVersion,
        conf:e.confidence, exc:med[day]===undefined?null:ev.pct-med[day],
        taro:e.taro, diana:e.diana, nova:e.nova, flow:e.flow});
    });
  }
  return rows;
}
/* 콜별·조건별 적중률 집계기. holdStrict=true면 HOLD가 ±5%를 벗어난 경우를 '빗나감'으로
   센다(기존 규칙은 '중립'으로 빼서 HOLD 적중률이 항상 100%로 나왔다). */
function scTally(list, key, holdStrict){
  let hit=0, miss=0, mid=0;
  list.forEach(r=>{
    const v=r[key]; if(v===null||v===undefined){ return; }
    let s;
    if(r.call==='JUDGMENT_WITHHELD') s = 'withheld';   /* 채점 분모에서 제외 */
    else if(r.call==='BUY') s = v>1?'hit':(v<-1?'miss':'mid');
    else if(r.call==='SELL') s = v<-1?'hit':(v>1?'miss':'mid');
    else s = Math.abs(v)<=5?'hit':(holdStrict?'miss':'mid');
    if(s==='hit')hit++; else if(s==='miss')miss++; else mid++;
  });
  const dec=hit+miss;
  return {n:list.length, hit, miss, mid, acc:dec?Math.round(hit/dec*1000)/10:null};
}
// offset주 전의 "채점일 기준 7일 구간" — 0이면 오늘까지 최근 7일, 1이면 그 이전 7일 …
function scWeekRange(offset){
  const end=new Date(Date.now()-offset*7*24*3600*1000);
  const start=new Date(end.getTime()-6*24*3600*1000);
  const fmt=d=>d.toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
  return {start:fmt(start), end:fmt(end)};
}
/* ── 💼 모의투자 — GAEO 판단의 Forward 검증 트랙레코드 (독립 화면) ──────────
   러너가 만든 파생 요약(paper_public.js)만 읽는다 — 브라우저는 Toss API·Secret·
   실제 계좌에 절대 접근하지 않고, 실제 주문 UI도 만들지 않는다.
   ⚠️ 정직성 계약 (2026-08-18 독립화 이후에도 그대로)
     · 거래 0건을 승률 0%·수익률 0%로 보여주지 않는다 — 없는 값은 0이 아니라 '—'
     · 비용(수수료·세금) 미검증이라 '순수익'·'실제 수익' 표기 금지
     · paper_public.js가 없거나 오래된 스키마여도 화면이 깨지지 않는다(모든 필드 옵셔널)
   2026-08-18: 성적표 하위 블록(paperBlockHTML)에서 독립 최상위 화면으로 분리. */
/* 💹 표시용 현재가 신선화 (2026-08-18)
   러너의 30분 mark보다 사이트 시세 파이프라인(data.js, 장중 약 10분 주기)이 더 신선하면
   그 가격으로 "화면 표시만" 다시 평가한다. 매매 판단·체결·mark 기록(러너 원장)은 절대
   건드리지 않는다 — 브라우저는 여전히 Toss API·Secret에 접근하지 않고, 이미 배포된
   data.js를 읽을 뿐이라 추가 API 호출·커밋·토큰 발급이 0이다.
   ⚠️ all-or-nothing: 보유 종목 중 하나라도 data.js에 없거나 stale이면 전체를 러너 mark로
      되돌린다. 행은 신선한 가격, 합계는 낡은 가격 같은 "섞인 화면"을 만들지 않는다. */
function paperLiveQuote(){
  // 테스트·폴러가 갈아끼울 수 있게 window 오버라이드 우선(null=명시적 차단)
  const src=(typeof window!=='undefined'&&window.GAEO_PAPER_LIVE!==undefined)
    ? window.GAEO_PAPER_LIVE
    : (typeof LIVE_DATA!=='undefined'?LIVE_DATA:null);
  if(!src||!src.stocks||typeof src.date!=='string') return null;
  const m=src.date.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);  // "2026-08-18 11:46 장중"
  if(!m) return null;
  const t=Date.parse(`${m[1]}T${m[2]}:00+09:00`);
  if(!isFinite(t)) return null;
  return {stocks:src.stocks, t, iso:`${m[1]}T${m[2]}:00+09:00`};
}
function paperDisplayVal(P){
  /* 반환: {source:'mark'} → 지금까지처럼 러너 스냅샷 값 그대로.
           {source:'live', at, prices} → 표시 전용으로 더 신선한 가격 세트. */
  const base={source:'mark', at:(P&&P.valuationObservedAt)||null, prices:null};
  const opens=((P&&P.recentTrades)||[]).filter(r=>r&&r.status==='OPEN');
  const live=paperLiveQuote();
  if(!live||!opens.length) return base;
  const markT=base.at?Date.parse(base.at):0;
  if(!(live.t>markT)) return base;                      // 더 신선할 때만 교체
  const prices={};
  for(const r of opens){
    const q=r&&r.symbol?live.stocks[r.symbol]:null;
    // 하나라도 없거나 stale·비정상 가격이면 전체 폴백 — 부분 혼합 금지
    if(!q||q.stale===true||typeof q.price!=='number'||!isFinite(q.price)||q.price<=0) return base;
    if(typeof r.quantity!=='number'||typeof r.entry_price!=='number') return base;
    prices[r.symbol]=q.price;
  }
  return {source:'live', at:live.iso, prices};
}
/* 시세 연결이 끊겨 기록이 멈춘 이유. 보유 현황·기록 탭 두 곳에서 같은 문장을 쓰므로
   한 곳에만 둔다(문구가 갈라지면 화면마다 다른 말을 하게 된다). */
const PAUSE_WHY='시세를 읽지 못하는 동안에는 가격을 추측해서 기록하지 않아요. 연결되면 다음 장중 기록부터 이어집니다.';
/* ── 📚 모의투자 기록(History) — 날짜별 기록 · 종합평가 · 전략 인사이트 ──────
   러너가 원장에서 만든 paper_trading/history.json만 읽는 READ-ONLY 화면이다.
   ⚠️ 과거 날짜는 그날 저장된 값으로만 그린다 — 현재 시세(data.js)나 현재 mark을
      절대 섞지 않는다(8/18 기록은 며칠 뒤에 열어도 1원도 달라지지 않는다).
   ⚠️ 기록이 깨져도 보유 현황 화면은 멀쩡해야 한다(여기서만 fail closed). */
function paperHistoryHTML(){
  const DASH='—';
  const n=v=>(typeof v==='number'&&isFinite(v))?v:null;
  const won=v=>n(v)==null?DASH:Math.round(v).toLocaleString('ko-KR')+'원';
  const sWon=v=>n(v)==null?DASH:(v>0?'+':v<0?'−':'')+Math.abs(Math.round(v)).toLocaleString('ko-KR')+'원';
  const sPct=(v,d)=>n(v)==null?DASH:(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(d==null?2:d)+'%';
  const dir=v=>n(v)==null||v===0?'':(v>0?' pv-up':' pv-dn');
  const H=PV_HIST[PV_VER];
  if(H===undefined){ paperLoadHistory(); return `<p class="pv-hs-load">기록을 불러오는 중이에요…</p>`; }
  if(H===null||!H.days) return `<div class="pv-empty"><b>기록을 불러오지 못했습니다.</b>
    <p>날짜별 기록 자료를 읽지 못했어요. 없는 숫자를 임의로 채우지 않기 때문에 이 영역을 비워 둡니다.
    보유 현황은 정상적으로 확인할 수 있습니다.</p></div>`;
  if(!H.days.length) return `<div class="pv-empty"><b>아직 쌓인 기록이 없어요.</b>
    <p>가상 매매가 기록되기 시작하면 날짜별로 그날의 매수·매도·자산·종합평가가 여기에 쌓입니다.</p></div>`;

  /* ① 날짜 하나를 펼쳐 둔 상태면 그 날짜의 상세를 본다 */
  const cur=PV_DAY?H.days.find(d=>d.date===PV_DAY):null;
  if(cur) return dayDetail(cur);

  /* 🐛 2026-08-19 수정: 러너가 시세를 못 받아 그날 기록이 통째로 빠졌는데도
     목록이 그냥 이전 날짜에서 끝나 "왜 없는지" 알 수 없던 문제.
     ⚠️ 없는 날짜 행을 만들어 채우지 않는다 — 빠졌다는 사실만 한 줄로 적는다.
     오늘 날짜는 브라우저 시계 대신 서버가 KST로 준 lastCycleAt에서 읽는다. */
  /* 🐛 2026-08-28 수정: 여기가 버전과 무관하게 늘 window.GAEO_PAPER(V1)를 읽어서,
     V1이 시세를 못 받은 상태면 손도 안 댄 V2·V3 기록 화면에까지 "OO월 OO일 기록은
     아직 없어요"가 떴다(세 버전이 같은 사이클을 타서 평소엔 잘 안 드러난다).
     지금 보고 있는 버전의 스냅샷을 읽는다. */
  const PP=pvSnap(PV_VER);
  const lastTry=(PP&&PP.lastCycleAt)?String(PP.lastCycleAt).slice(0,10):null;
  const newestDay=H.days.map(d=>d.date).sort().slice(-1)[0];
  const gapNote=(PP&&PP.stage==='AWAITING_MARKET_DATA'&&lastTry&&newestDay&&lastTry>newestDay)
    ? `<p class="pv-pause">${esc(lastTry.slice(5).replace('-','.'))} 기록은 아직 없어요. ${PAUSE_WHY}</p>`
    : '';

  /* 🔒 계좌 성과를 아직 공개하지 않는 버전 — 날짜별 평가금·수익률이 비어 있다.
     빈칸(—)만 두면 "고장"으로 읽히므로 이유를 한 줄로 밝힌다(2026-08-28). */
  const hiddenNote=(Array.isArray(H.metricsHiddenUntilEvidence)&&H.metricsHiddenUntilEvidence.length)
    ? `<p class="pv-pause">이 버전은 판단 근거가 될 만큼 기록이 쌓이기 전까지 날짜별 평가금·수익률을 공개하지 않아요. 무엇을 사고팔았는지는 그대로 볼 수 있어요.</p>`
    : '';

  /* ② 목록 — 월별로 묶고 최근 날짜가 위 */
  const months={};
  H.days.forEach(d=>{ const m=d.date.slice(0,7); (months[m]=months[m]||[]).push(d); });
  const monthHTML=Object.keys(months).sort().reverse().map(m=>{
    const [y,mo]=m.split('-');
    const rows=months[m].map(d=>{
      const md=`${+d.date.slice(5,7)}월 ${+d.date.slice(8,10)}일`;
      /* 🕳️ 관측 공백 — 거래일인데 기록이 통째로 빠진 날. 목록이 조용히 건너뛰면
         "왜 없는지" 알 수 없으므로 한 줄로 드러낸다.
         ⚠️ 숫자를 만들어 채우지 않으므로 펼칠 상세도 없다 → 버튼이 아니라 그냥 행이다. */
      if(d.noRecord) return `<div class="pv-hd-row pv-hd-gap">
        <span class="pv-hd-l"><span class="pv-hd-t">${md}</span>
          <span class="pv-hd-s">이날은 자동 기록이 남지 않았어요 · 없는 값을 채우지 않습니다</span></span>
        <span class="pv-hd-r"><span class="pv-hd-eq pv-na">기록 없음</span></span>
      </div>`;
      const cum=n(d.cumulativeReturnPct);
      return `<button type="button" class="pv-hd-row" data-day="${d.date}">
        <span class="pv-hd-l">
          <span class="pv-hd-t">${md} 모의투자 기록${d.inProgress?'<i class="pv-hd-live">진행 중</i>':''}</span>
          <span class="pv-hd-s">매수 ${d.buyCount} · 매도 ${d.sellCount} · 보유 ${d.openCount==null?DASH:d.openCount}
            ${d.lastRecordAt?` · 마지막 기록 ${d.lastRecordAt}`:''}</span>
        </span>
        <span class="pv-hd-r">
          <span class="pv-hd-eq">${won(d.equity)}</span>
          <span class="pv-hd-pc${dir(cum)}">${cum==null?DASH:sPct(cum)}</span>
        </span>
      </button>`;
    }).join('');
    return `<section class="pv-hs-mo"><h4 class="pv-hs-moh">${y}년 ${+mo}월</h4>
      <div class="pv-hd-list">${rows}</div></section>`;
  }).join('');

  /* ③ 전략 인사이트 — 표본이 충분해질 때까지 "누가 최고"라고 말하지 않는다 */
  const S=H.strategy||{};
  /* ⚠️ 그 전략이 구조적으로 만들 수 없는 구간(보유 상한보다 긴 칸)을 "기록 축적 중"으로
     쓰면 언젠가 채워질 것처럼 읽힌다 — V3(상한 2거래일)의 「스윙 3~5거래일」이 그랬다.
     채워질 수 있는 칸과 없는 칸을 말로 구분한다(2026-08-28). */
  const bk=(S.buckets||[]).map(b=>`<div class="pv-row"><dt>${b.label}<small>${b.desc}</small></dt>
    <dd>${b.tradeCount?`${b.tradeCount}건${b.avgReturnPct==null?'':` · 평균 ${sPct(b.avgReturnPct)}`}${b.winRatePct==null?'':` · 승률 ${b.winRatePct.toFixed(0)}%`}`
      :b.beyondRule?'<span class="pv-na">이 버전 규칙에는 없는 구간</span>':'<span class="pv-na">기록 축적 중</span>'}</dd></div>`).join('');
  const stratNote=S.enough
    ? `<p class="pv-sec-d">종료된 거래 ${S.totalClosed}건을 실제 보유기간별로 나눈 결과예요.</p>`
    : `<p class="pv-sec-d">종료된 거래가 <b>${S.totalClosed||0}건</b>이에요. 구간별 성과를 비교하려면
       최소 ${S.minSample||20}건이 필요해서, 아직 어느 구간이 낫다고 말하지 않습니다.</p>`;
  const strat=`<section class="pv-sec" aria-labelledby="pvStratH">
    <h3 class="pv-sec-h" id="pvStratH">전략 인사이트</h3>
    ${stratNote}
    <dl class="pv-rows">${bk}</dl>
    <p class="pv-foot" style="margin-top:14px">${esc(S.note||'')}
      ${(S.unsupported||[]).length?`아직 검증 대상이 아닌 구간: ${(S.unsupported||[]).map(u=>esc(u.label)).join(' · ')}.`:''}
      이 비교는 관찰용이며, 결과에 따라 매매 규칙이 자동으로 바뀌지 않습니다.</p>
  </section>`;
  return `<div class="pv-hs">${gapNote}${hiddenNote}${monthHTML}${strat}</div>`;

  /* ── 날짜 상세 ── */
  function dayDetail(d){
    const md=`${+d.date.slice(5,7)}월 ${+d.date.slice(8,10)}일`;
    const facts=[
      ['가상자산', won(d.equity)],
      ['가상현금', won(d.cash)],
      ['투자원금', won(d.investedCostBasis)],
      ['평가금액', won(d.markedPositionsValue)],
      ['보유 손익', d.unrealizedPnl==null?DASH:sWon(d.unrealizedPnl)],
      ['확정 손익', d.realizedPnl==null?DASH:sWon(d.realizedPnl)],
      ['누적 성과', d.cumulativeReturnPct==null?DASH:sPct(d.cumulativeReturnPct)],
      ['일간 변화', d.dailyChangePct==null?'—(이전 기록일 없음)':sPct(d.dailyChangePct)],
      ['거래', `매수 ${d.buyCount} · 매도 ${d.sellCount} · 보유 ${d.openCount==null?DASH:d.openCount}`],
      ['마지막 기록', d.lastRecordAt||DASH]
    ].map(([k,v])=>`<div class="pv-row"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    const skip=(d.skipped||[]).length
      ? `<p class="pv-sec-d">진입하지 않은 신호: ${(d.skipped||[]).map(x=>`${esc(x.reason)} ${x.count}건`).join(' · ')}</p>`
      : '';
    const buys=(d.buys||[]).length
      ? `<div class="pv-td-all">`+(d.buys||[]).map(b=>`<div class="pv-td-row">
          <span class="pv-td-nm">${esc(b.name||b.symbol||'종목')}</span>
          <span class="pv-td-meta">${b.quantity==null?'':b.quantity.toLocaleString('ko-KR')+'주 · '}${won(b.entryPrice)}${b.entryAt?` · ${b.entryAt}`:''}</span>
        </div>`).join('')+`</div>`
      : `<p class="pv-td-none">이날 새로 가상 매수한 종목이 없어요.</p>`;
    const sells=(d.sells||[]).length
      ? `<div class="pv-td-all">`+(d.sells||[]).map(x=>`<div class="pv-td-row">
          <span class="pv-td-nm">${esc(x.name||x.symbol||'종목')}${x.returnPct==null?'':`<em class="pv-pos-r${dir(x.returnPct)}">${sPct(x.returnPct)}</em>`}</span>
          <span class="pv-td-meta">${won(x.entryPrice)} → ${won(x.exitPrice)}${x.quantity==null?'':` · ${x.quantity.toLocaleString('ko-KR')}주`}${x.realizedPnl==null?'':` · ${sWon(x.realizedPnl)}`}${x.holdingTradingDays==null?'':` · 보유 ${x.holdingTradingDays}거래일`} · ${esc(x.exitReason||'종료')}</span>
        </div>`).join('')+`</div>`
      : `<p class="pv-td-none">이날 종료된 거래가 없어요.</p>`;
    const R=d.review||{};
    const rv=(R.sections||[]).map(sec=>`<div class="pv-rv-sec"><h5>${esc(sec.title)}</h5>
      <ul>${(sec.lines||[]).map(l=>`<li>${esc(l.text)}</li>`).join('')}</ul></div>`).join('');
    return `<div class="pv-hs">
      <button type="button" class="pv-back" data-back="1">← 기록 목록</button>
      <div class="pv-sec-hd"><h3 class="pv-sec-h">${md} 모의투자 기록</h3>
        <span class="pv-asof">${d.inProgress?`진행 중 · 최근 ${d.lastRecordAt||''}`:`마지막 기록 ${d.lastRecordAt||''}`}</span></div>
      <dl class="pv-rows">${facts}</dl>${skip}
      <section class="pv-sec"><h4 class="pv-sec-h2">이날 매수한 종목</h4>${buys}</section>
      <section class="pv-sec"><h4 class="pv-sec-h2">이날 매도한 종목</h4>${sells}</section>
      <section class="pv-sec pv-rv">
        <h4 class="pv-sec-h2">${R.inProgress?'현재까지의 평가':'이날의 종합 평가'}
          ${R.headline?`<span class="pv-rv-hl">${esc(R.headline)}</span>`:''}</h4>
        ${R.inProgress?`<p class="pv-sec-d">장이 진행 중이라 아직 확정된 결과가 아니에요${d.lastRecordAt?` (${d.lastRecordAt} 기준)`:''}.</p>`:''}
        ${rv}
        <p class="pv-foot" style="margin-top:12px">이 평가는 그날 기록된 숫자에서만 만들어집니다.
          기록으로 증명할 수 없는 시장 원인(뉴스·수급 등)은 쓰지 않습니다.</p>
      </section>
    </div>`;
  }
}
/* 테스트에서 기록 데이터를 주입하기 위한 훅 — 네트워크 없이 화면 계약을 검증한다.
   (실제 사용자 경로는 아래 paperLoadHistory의 fetch 하나뿐이다) */
function PV_HISTORY_SET(h){ PV_HIST[PV_VER]=h; PV_HIST_LOADING=false; }
if(typeof window!=='undefined') window.PV_HISTORY_SET=PV_HISTORY_SET;
/* 버전별 기록 파일 — 러너가 각 전략 원장에서 파생해 paper_trading/ 최상위에 만든다.
   (전략 원기록 폴더는 사이트 배포에서 제외돼 있어 그 안에 두면 못 읽는다) */
const PV_HIST_URL={v1:'paper_trading/history.json',
                   v2:'paper_trading/history_v2.json',
                   v3:'paper_trading/history_v3.json'};
/* 기록 파일은 그 버전의 기록 탭을 처음 열 때만 받아온다(보유 화면 로딩을 늦추지 않는다).
   버전마다 따로 캐시해서 전환할 때 다른 버전 기록이 잠깐 비쳐 보이지 않게 한다. */
function paperLoadHistory(){
  const v=PV_VER;
  if(PV_HIST_LOADING||PV_HIST[v]!==undefined) return;
  PV_HIST_LOADING=true;
  fetch(PV_HIST_URL[v]||PV_HIST_URL.v1,{cache:'no-cache'})
    .then(r=>r.ok?r.json():Promise.reject(new Error('http')))
    .then(j=>{ PV_HIST[v]=(j&&Array.isArray(j.days))?j:null; })
    .catch(()=>{ PV_HIST[v]=null; })
    .then(()=>{ PV_HIST_LOADING=false; if(PV_VIEW==='history') renderPaper(); });
}

/* 🔎 반등 후보 관찰 기록(rebound_watch.js) — 모의투자 화면을 열 때만 받는다.
   2026-08-21 검증에서 "GAEO BUY는 폭등을 구조적으로 놓친다"가 확인됐다
   (+30% 폭등 342건 중 BUY는 2건, 전체 BUY 비율 6.8%보다 낮았다).
   그 대안 규칙이 진짜 통하는지 성적을 쌓는 관찰 목록이라, 돈을 걸지 않고 기록만 한다. */
let RW_DATA;                       // undefined=아직 안 받음 · null=실패 · 객체=받음
let RW_LOADING=false;
function paperLoadRebound(){
  if(RW_LOADING||RW_DATA!==undefined) return;
  RW_LOADING=true;
  GaeoFeatures.load('rebound')
    .then(()=>{ RW_DATA=(typeof window!=='undefined'&&window.REBOUND_WATCH)||null; })
    .catch(()=>{ RW_DATA=null; })
    .then(()=>{ RW_LOADING=false; renderPaper(); });
}
if(typeof window!=='undefined') window.RW_SET=v=>{ RW_DATA=v; RW_LOADING=false; };

/* 모의투자 화면 상태 — 펼쳐 둔 종목·현재 하위 화면·열어 둔 날짜.
   자동 재조회(2분)로 다시 그려도 사용자가 펼쳐 둔 것이 닫히지 않게 유지한다. */
const PV_OPEN=new Set();          // 펼쳐 둔 보유 종목 symbol
let PV_VIEW='holdings';           // 'holdings' | 'history'
let PV_VER='v1';                  // 'v1' | 'v2' | 'v3' — 모의투자 전략 버전(각각 별도 가상계좌)
/* 버전별 공개 스냅샷 전역 이름. renderPaper 안에만 두면 기록 화면(paperHistoryHTML)이
   못 읽어서, 기록 탭이 어느 버전을 보고 있든 V1 상태만 참조하게 된다(2026-08-28 수정). */
const PV_SNAPS={v1:'GAEO_PAPER',v2:'GAEO_PAPER_V2',v3:'GAEO_PAPER_V3'};
function pvSnap(ver){
  const key=PV_SNAPS[ver||PV_VER];
  return (typeof window!=='undefined'&&key&&window[key])?window[key]:null;
}
let PV_DAY=null;                  // 기록에서 열어 둔 날짜(YYYY-MM-DD)
const PV_HIST={};                 // 버전별 기록 캐시. 값: undefined=미로드 · null=실패 · object=성공
let PV_HIST_LOADING=false;

/* 🔎 반등 후보 관찰 — 모의투자 화면 안의 실험 구역.
   ⚠️ 매수 추천이 아니다. "GAEO가 놓치는 폭등"을 잡는 규칙이 진짜인지 성적을 쌓는 중이다.
   ⚠️ 표본이 찰 때까지 성적 숫자를 만들지 않는다. 파일이 null로 내려보내면 그대로 비운다. */
function reboundHTML(){
  if(RW_DATA===undefined){ paperLoadRebound();
    return `<section class="pv-sec"><h3 class="pv-sec-h">반등 후보 관찰</h3>
      <p class="pv-sec-d">불러오는 중이에요.</p></section>`; }
  if(!RW_DATA) return '';                       // 파일이 없거나 실패하면 조용히 감춘다
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const S=RW_DATA.summary||{}, rule=RW_DATA.rule||{};
  const today=(RW_DATA.entries||[]).filter(e=>e.date===RW_DATA.today);
  const num=v=>typeof v==='number'&&isFinite(v);
  const na=t=>`<dd class="pv-na">${t}</dd>`;
  const rows=[
    ['관찰한 후보', `${S.scoredCount||0}건 채점 완료 · ${S.pendingCount||0}건 결과 대기`],
    ['관찰한 날', `${S.observedDays||0}일 / 필요 ${S.minDaysForEvidence||20}일`],
    ['이 중 GAEO가 BUY라고 한 비율',
      num(S.gaeoBuyRatePct)?`${S.gaeoBuyRatePct}%`:'채점된 후보가 아직 없어요'],
    ['승률', num(S.winRatePct)?`${S.winRatePct}%`:null],
    ['평균 수익률 <small>수수료·세금 반영</small>', num(S.avgReturnPct)?`${S.avgReturnPct}%`:null],
    ['+15% 이상 나온 비율', num(S.surgeRatePct)?`${S.surgeRatePct}%`:null],
  ].map(([k,v])=>`<div class="pv-row"><dt>${k}</dt>${
    v==null?na(`표본 부족 · 채점 ${S.scoredCount||0}/${S.minScoredForEvidence||20}건`)
           :`<dd>${esc(v)}</dd>`}</div>`).join('');
  const list=today.length
    ? `<div class="pv-rw-list">${today.map(e=>`<div class="pv-rw-item">
        <span class="pv-rw-name">${esc(e.name)}</span>
        <span class="pv-rw-meta">20일 ${esc(e.dropPct)}% · 거래량 ${esc(e.volRatio)}배${
          e.gaeoCall?` · GAEO ${esc(e.gaeoCall)}`:''}</span></div>`).join('')}</div>`
    : `<p class="pv-sec-d">오늘은 조건에 맞는 종목이 없어요. 없는 날도 그대로 기록합니다.</p>`;
  return `<section class="pv-sec" aria-labelledby="pvRwH">
    <h3 class="pv-sec-h" id="pvRwH">반등 후보 관찰 <span class="pv-rw-tag">실험 중</span></h3>
    <p class="pv-sec-d">GAEO가 「매수 고려」로 잡아내지 못하는 폭등을 다른 규칙으로 찾을 수 있는지
      시험하는 중이에요. <b>매수 추천이 아니고, 실제로 사지도 않습니다.</b> 조건에 맞는 종목을 매일
      적어두고 5거래일 뒤 결과만 채점해서, 여러 시장 상황을 겪은 성적이 쌓이면 그때 쓸지 정합니다.</p>
    <p class="pv-sec-d"><b>오늘의 후보 ${today.length}종목</b>
      <span class="pv-asof">조건: 20거래일 ${esc(rule.dropPct)}% 이하 하락 + 거래량 평소의 ${esc(rule.volRatio)}배 이상</span></p>
    ${list}
    <dl class="pv-rows">${rows}</dl>
    <p class="pv-foot">왜 이걸 보나요? 2026년 8월 21일 검증에서, 5거래일에 30% 넘게 오른 342건 가운데
      GAEO가 「매수 고려」라고 한 건 2건(0.6%)뿐이었어요. 전체 「매수 고려」 비율 6.8%보다 낮습니다.
      폭등하는 종목은 대부분 <b>이미 많이 떨어져 있던</b> 종목이었는데(직전 20일 평균 −20.4%),
      GAEO는 반대로 <b>이미 오른</b> 종목을 고르고 있었어요.
      다만 같은 검증에서 "떨어진 걸 사면 된다"는 시장 상황에 따라 정반대 결과가 나왔습니다.
      그래서 지금은 돈을 걸지 않고 기록만 모읍니다.</p></section>`;
}

function renderPaper(){
  const el=document.getElementById('paperView');
  if(!el) return;
  /* 전략 버전 탭 — 각 버전은 완전히 분리된 별도 가상계좌(각 1,000만원)라
     스냅샷 전역도 따로 온다(paper_public.js가 세 개를 함께 배포). */
  const P=pvSnap(PV_VER);
  /* Hero는 짧게. 긴 원칙 설명은 아래 「어떻게 기록하나요?」로 내린다.
     사용자 화면에는 내부 코드(PAPER_BASELINE_V1·BASELINE_ONLY 등)를 노출하지 않는다. */
  /* 🎯 2026-08-21: 실제 투자 화면의 정보 위계를 따른다 — 돈이 먼저, 설명은 나중.
     예전에는 제목 아래 설명이 두 문단(142px)이나 깔려 자산 금액을 아래로 밀어냈다.
     자세한 기록 규칙은 아래 「어떻게 기록하나요?」에 이미 단계별로 있으므로,
     여기서는 무엇을 보는 화면인지와 실제 주문이 없다는 고지만 한 줄로 남긴다. */
  const lede=`<h2 class="pv-title">모의투자</h2>
    <p class="pv-claim">GAEO의 판단을 실제 시장 흐름으로 확인합니다. <b>실제 주문은 발생하지 않습니다.</b></p>`;
  /* 버전 안내 — 어떤 계좌를 보고 있는지 한 줄로. 규칙 상세는 아래 「어떻게 기록하나요?」.
     ⚠️ 규칙 숫자를 여기 손으로 적지 말 것. 2026-08-28 이전에는 V3 설명에 「하루 최대
        4개」가 박혀 있어서, 엔진을 3종목·업종당 1종목으로 바꾼 뒤에도 화면만 옛 규칙을
        말했다. 숫자는 전부 스냅샷(=엔진 config)에서 읽어 쓴다. */
  const pvN=v=>(typeof v==='number'&&isFinite(v))?v:null;
  const v3PerDay=pvN(P&&P.maxNewEntriesPerDay), v3Cap=pvN(P&&P.sectorCap);
  const v3Buy=v3PerDay==null
    ? '하루 정해진 종목 수만큼'
    : `하루 최대 ${v3PerDay}종목${v3Cap?`(업종당 ${v3Cap}종목)`:''}`;
  const v3Tp=pvN(P&&P.takeProfitPct), v3Sl=pvN(P&&P.stopLossPct);
  const v3Hold=pvN(P&&P.maxHoldingTradingDays);
  const PV_META={
    v1:{tab:'V1 기본',desc:'GAEO 판단이 「매수 고려」로 바뀐 종목을 그대로 사고, 5거래일 또는 「매도 고려」 전환에 파는 기준 계좌예요.'},
    v2:{tab:'V2 스마트',desc:'V1과 똑같이 사되, 5거래일이 돼도 판단이 좋으면 계속 들고 가는 비교 계좌예요(안전상한 60거래일).'},
    v3:{tab:'V3 단타',desc:`시장이 좋은 날에만 단기 상승 흐름 종목을 ${v3Buy} 사고, 익절 ${v3Tp==null?'+3':'+'+v3Tp}% · 손절 ${v3Sl==null?'-2':v3Sl}% · 최대 ${v3Hold||2}거래일로 짧게 끊는 단타 실험 계좌예요.`}
  };
  const verRow=`<div class="pv-vers" role="tablist" aria-label="모의투자 전략 버전 선택">${
    ['v1','v2','v3'].map(k=>`<button type="button" class="pv-ver${PV_VER===k?' on':''}" data-pver="${k}"
      role="tab" aria-selected="${PV_VER===k?'true':'false'}">${PV_META[k].tab}</button>`).join('')}</div>
    <p class="pv-ver-desc">${PV_META[PV_VER].desc} 세 버전은 같은 크기의 가상자금으로 각각 따로 운영합니다.</p>`;
  // ⛔ Fail closed — 스냅샷을 못 읽으면 0으로 채우지 않고 "비어 있음"을 그대로 말한다.
  if(!P){
    el.innerHTML=lede+verRow+`<div class="pv-empty"><b>기록을 아직 불러오지 못했어요.</b>
      <p>모의투자 요약 자료를 읽지 못했습니다. 없는 숫자를 임의로 채우지 않기 때문에 이 화면을 비워 둡니다. 다음 갱신 때 다시 표시됩니다.</p></div>`;
    return;
  }
  /* 🆕 아직 한 번도 돌지 않은 버전(V3 첫 배포 직후) — 미리 만든 숫자를 보여주지 않는다. */
  if(P.stage==='PREPARING'){
    el.innerHTML=lede+verRow+`<div class="pv-empty"><b>이 버전은 다음 거래일부터 기록을 시작해요.</b>
      <p>규칙과 가상계좌(1,000만원)는 준비돼 있고, 자동 기록기가 장중에 처음 돌면 여기에 기록이 쌓입니다. 미리 만들어 둔 숫자는 없습니다.</p></div>`;
    return;
  }
  const DASH='—';
  const n=v=>(typeof v==='number'&&isFinite(v))?v:null;
  const won=v=>n(v)==null?DASH:Math.round(v).toLocaleString('ko-KR')+'원';
  const sWon=v=>n(v)==null?DASH:(v>0?'+':v<0?'−':'')+Math.abs(Math.round(v)).toLocaleString('ko-KR')+'원';
  const sPct=(v,d)=>n(v)==null?DASH:(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(d==null?2:d)+'%';
  const dir=v=>n(v)==null||v===0?'':(v>0?' pv-up':' pv-dn');
  const day=s=>s?esc(String(s).slice(0,10).replace(/-/g,'.')):DASH;
  const md=s=>s?esc(String(s).slice(5,10).replace('-','.')):DASH;
  const hm=s=>s?esc(String(s).slice(11,16)):DASH;
  const stamp=s=>s?esc(String(s).slice(5,16).replace('T',' ').replace('-','.')):DASH;
  const insufficient=String(P.evidenceStatus||'').startsWith('INSUFFICIENT');
  const open=n(P.openTrades)||0, closed=n(P.closedTrades)||0;
  const maxHold=n(P.maxHoldingTradingDays);
  /* 🔒 표본 게이트는 '건수'와 '판단일' 두 조건이다. 어느 쪽이 모자란지 화면에 적어야
     건수가 다 찼는데 승률이 안 나올 때 고장으로 오해하지 않는다.
     ⚠️ 기준값은 러너가 내려준 값을 쓰고, 없으면 화면에서 지어내지 않고 20을 쓴다
        (엔진 상수와 같은 값 — 옛 스냅샷에도 화면이 깨지지 않게 하는 폴백일 뿐이다). */
  const eDays=n(P.closedEntryDays);
  const minClosed=n(P.minClosedForEvidence)||20;
  const minDays=n(P.minEntryDaysForEvidence)||20;
  const needClosed=closed<minClosed;
  /* 💸 비용 모델 — 아래 「검증 상태」와 맨 아래 안내문이 둘 다 쓴다. 쓰는 곳보다
     먼저 선언해야 한다(뒤에 두면 선언 전 참조로 화면 전체가 안 그려진다). */
  const cm=P.costModelDetail;

  /* ① Hero + 자동 기록 상태 한 줄.
     ⚠️ 시각이 최근이라는 이유만으로 "정상"이라 쓰지 않는다 — 러너가 사이클 성공을
        확인해 준 경우(lastCycleOk === true)에만 진행 중이라고 말한다. */
  const live=P.lastCycleOk===true&&!!P.lastCycleAt;
  /* 🐛 2026-08-19 수정: 시세를 못 받아 기록이 멈춘 걸 사용자가 알 수 없던 버그.
     사유 안내가 "보유 종목 0건"일 때만 나오는 빈 상태 문구(아래 stageNote) 안에만 있어서,
     보유 종목이 하나라도 있으면 화면 어디에도 표시되지 않았다. 게다가 상태 줄이
     아무것도 기록하지 못한 시각을 "최근 기록"이라고 적어 반대로 오해시켰다.
     → 사유는 보유 유무와 무관하게 항상 보이고, 기록과 시도를 말로 구분한다. */
  const paused=P.stage==='AWAITING_MARKET_DATA';
  const statusTxt=!P.lastCycleAt ? '기록 준비 중'
    : live ? `자동 기록 진행 중 · 최근 <time>${stamp(P.lastCycleAt)}</time>`
    : paused ? `시세 연결이 끊겨 기록이 멈춰 있어요 · 마지막 시도 <time>${stamp(P.lastCycleAt)}</time>`
    : `최근 시도 <time>${stamp(P.lastCycleAt)}</time>`;
  const hero=lede+verRow+`<p class="pv-status${live?' is-live':''}"><span class="pv-dot" aria-hidden="true"></span>${statusTxt}</p>`
    +(paused?`<p class="pv-pause">${PAUSE_WHY}</p>`:'');

  /* ② 포트폴리오 전체 시야 — "1,000만원 중 얼마가 들어가 있고, 얼마가 남았고,
        전체로 얼마를 벌거나 잃고 있나"를 계산기 없이 읽히게 한다.
     ⚠️ 숫자가 늘어난다고 카드를 늘리지 않는다: 큰 값 하나 + 그에 종속된 구성 + 얇은 띠.
     ⚠️ 모든 총계는 paper_public.js가 엔진 회계 함수 하나로 만든 값을 "표시만" 한다
        (브라우저에서 다시 계산하지 않는다 — 산식이 두 곳에 생기면 언젠가 어긋난다).
     ⚠️ Fail closed: 보유 중인데 시세를 못 받은 종목이 하나라도 있으면 평가금액·손익을
        부분합으로 채우지 않고 비운다(엔진이 이미 null로 내려보낸다). */
  const initialC=n(P.initialVirtualCash);
  const invested=n(P.investedCostBasis), vcash=n(P.availableVirtualCash);
  /* 💹 표시용 신선화 — 러너 mark(약 30분)보다 data.js(약 10분)가 더 신선하고
     보유 전 종목을 덮으면 그 가격으로 화면 값만 다시 계산한다(회계식은 동일).
     실패·부분 커버리지·구식이면 dv.source==='mark' → 지금까지와 완전히 같은 값. */
  const dv=paperDisplayVal(P);
  let equity=n(P.currentVirtualEquity), marked=n(P.markedPositionsValue);
  let retPct=n(P.portfolioReturnPct), unrealTot=n(P.unrealizedPnl);
  let aInv=n(P.allocationInvestedPct), aCash=n(P.allocationCashPct);
  if(dv.source==='live'&&invested!=null&&vcash!=null&&initialC){
    const or_=(P.recentTrades||[]).filter(r=>r&&r.status==='OPEN');
    marked=or_.reduce((s,r)=>s+Math.round(dv.prices[r.symbol]*r.quantity),0);
    equity=vcash+marked;
    unrealTot=marked-invested;
    retPct=Math.round((equity/initialC-1)*100*1000)/1000;
    aInv=Math.round(marked/equity*1000)/10;
    aCash=Math.round(vcash/equity*1000)/10;
  }
  /* 전체 손익은 retPct가 있을 때만 말한다 — 엔진이 "가상체결 0건"과 "평가 불가"를
     이미 null로 구분해 두었다. 거래가 없는 상태를 0%처럼 보이게 하지 않는다. */
  const totalPnl=(retPct!=null&&equity!=null&&initialC!=null)?equity-initialC:null;
  /* 평가 기준 시각은 종목마다 반복하지 않고 섹션 단위로만 표시한다.
     오늘이 아니면 날짜까지 적어, 오래된 관측이 최신처럼 보이지 않게 한다.
     ⚠️ 실제로 가격을 관측한 시각만 쓴다 — timestamp를 현재 시각으로 위조하지 않는다. */
  const vAt=dv.at;
  const todayKST=new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
  const sameDay=vAt&&String(vAt).slice(0,10)===todayKST;
  const asOf=vAt?(sameDay?`${hm(vAt)} 기준`:`${md(vAt)} ${hm(vAt)} 기준`):'';

  /* 숫자가 비는 이유는 세 가지고, 화면은 그 셋을 구분해서 말해야 한다.
     ① 표본 부족으로 계좌 성과를 아직 공개하지 않는 전략(metricsHiddenUntilEvidence)
     ② 보유 중인데 일부 종목 시세를 못 받음  ③ 아직 가상 매수가 0건
     ①을 ②로 말하면 "고장 났다"는 오해를 준다(2026-08-28). */
  const hidden=Array.isArray(P.metricsHiddenUntilEvidence)&&P.metricsHiddenUntilEvidence.length>0;
  const pnlBlock=hidden
    ? `<span class="pv-port-pv pv-port-na">표본 쌓는 중</span>
       <span class="pv-port-s">판단 근거가 될 만큼 기록이 쌓이기 전에는 계좌 성과를 공개하지 않아요</span>`
    : totalPnl==null
    ? `<span class="pv-port-pv pv-port-na">${open?'평가 대기':'기록 전'}</span>
       <span class="pv-port-s">${open?'일부 종목 시세를 확인하는 중이에요':'아직 가상 매수 기록이 없어요'}</span>`
    : `<span class="pv-port-pv${dir(totalPnl)}">${sWon(totalPnl)}<i>${sPct(retPct)}</i></span>
       <span class="pv-port-s">가상 시작자금 대비</span>`;
  /* 자산구성 띠 — 장식이 아니라 정보다(투자/현금 비율 그 자체).
     3px 단색 · 그라데이션·광택 없음 · 등락색(빨강/파랑)은 쓰지 않는다.
     비중을 만들 수 없으면(평가 불가) 띠를 그리지 않는다 — 추측한 비율을 그리지 않는다. */
  const bar=(aInv!=null&&aCash!=null)
    ? `<div class="pv-alloc-bar" aria-hidden="true"><span style="width:${Math.max(0,Math.min(100,aInv))}%"></span><b></b></div>`
    : '';
  const legend=`<div class="pv-alloc-legend">
      <span><i>투자 중</i>${won(invested)}${aInv==null?'':`<em>${aInv.toFixed(1)}%</em>`}</span>
      <span><i>가상현금</i>${won(vcash)}${aCash==null?'':`<em>${aCash.toFixed(1)}%</em>`}</span>
    </div>`;
  const portfolio=`<section class="pv-port" aria-labelledby="pvPortH">
    <div class="pv-port-lead">
      <div class="pv-port-main">
        <h3 class="pv-port-k" id="pvPortH">현재 가상자산</h3>
        <span class="pv-port-v">${equity==null?DASH:won(equity)}</span>
      </div>
      <div class="pv-port-pnl">
        <span class="pv-port-k">현재 손익</span>
        ${pnlBlock}
      </div>
    </div>
    <p class="pv-port-basis">가상현금 + 보유종목 현재 평가액${asOf?` · ${asOf}`:''}</p>
    ${bar}${legend}
    <p class="pv-port-note">가상 시작자금 ${won(initialC)} · 실제로 예치한 돈이 아니에요</p>
  </section>`;

  /* ③ 나머지 총계 — 카드를 늘리지 않으려고 기존 4칸 띠를 3칸으로 줄였다.
     보유 평가액의 부제로 "보유 손익"을 붙여, 투자원금과 평가금액의 차이가
     곧 평가 손익이라는 걸 따로 설명하지 않아도 읽히게 한다. */
  /* ⚠️ 금액 자체에는 등락색을 쓰지 않는다 — 평가액은 방향이 아니다.
        빨강/파랑은 오르내림(손익)에만 붙인다(디자인 규칙). */
  const cells=[
    ['보유 평가액', (!open?won(0):(marked==null?'일부 시세 확인 중':won(marked))),
      (!open?'보유 중인 종목 없음'
        :(marked==null?'전체 평가금액을 아직 계산할 수 없어요'
          :(unrealTot==null?'평가 대기'
            :`보유 손익 <b class="${dir(unrealTot).trim()}">${sWon(unrealTot)}</b>`)))]
  ];
  /* 종료 거래가 없으면 '확정 손익 0원' 칸을 굳이 띄우지 않는다 —
     비어 있는 값으로 첫 화면을 밀어내지 않고, 값이 생기면 그때 칸이 나타난다. */
  if(closed) cells.push(['확정 손익', n(P.realizedPnl)==null?DASH
      :`<b class="${dir(P.realizedPnl).trim()}">${sWon(P.realizedPnl)}</b>`,
    insufficient?'표본이 적어 성과 결론 보류':'종료된 거래 누적']);
  /* 🔒 표본은 '건수'와 '판단일'을 같이 보여준다. 이 계좌는 자리가 10칸이라 열 종목이
     한 덩어리로 들어갔다 한 덩어리로 나온다 — 종료 20건이 곧 20번의 독립된 시행은
     아니다(같은 날 담은 종목은 같은 시장에 함께 노출된다). 성적표 화면이 쓰는 잣대와
     같은 기준이며, 건수만 보고 "곧 승률이 나오겠네"라고 오해하지 않게 둘 다 적는다. */
  cells.push(['거래', `보유 ${open} · 종료 ${closed}`,
    closed&&eDays!=null
      ? `판단일 ${eDays}일${maxHold?` · 한 종목 최대 ${maxHold}거래일`:''}`
      : (maxHold?`한 종목 최대 ${maxHold}거래일 보유`:'가상 기록 전용')]);
  const sum=cells.map(([k,v,sub])=>`<div><span class="pv-sum-k">${k}</span><span class="pv-sum-v">${v}</span><span class="pv-sum-s">${sub}</span></div>`).join('');
  const summary=portfolio+`<div class="pv-summary pv-summary-${cells.length}">${sum}</div>`;

  /* ③ 현재 보유 중 — 이 화면에서 가장 중요한 정보. 종목 하나 = 정돈된 surface 하나.
     수량·매수가·현재가·평가금액·손익·보유기간을 한 번에 읽히게 둔다. */
  const rows=(P.recentTrades||[]).filter(r=>r&&(r.status==='OPEN'||r.status==='CLOSED'));
  const opens=rows.filter(r=>r.status==='OPEN');
  const closes=rows.filter(r=>r.status==='CLOSED');
  const posHTML=opens.map((r,idx)=>{
    const qty=n(r.quantity), ep=n(r.entry_price);
    let cp=n(r.current_price), ret=n(r.unrealized_return_pct), pnl=n(r.unrealized_pnl);
    let mv=n(r.market_value);
    /* 💹 표시용 신선화 — 위 총계와 같은 dv 가격 세트로 행도 함께 바꾼다.
       (행은 신선, 합계는 낡은 "섞인 화면" 금지 — 소스는 렌더당 정확히 하나) */
    if(dv.source==='live'&&dv.prices[r.symbol]!=null&&qty!=null&&ep!=null){
      cp=dv.prices[r.symbol];
      mv=Math.round(cp*qty);
      pnl=Math.round((cp-ep)*qty);
      ret=Math.round((cp/ep-1)*10000)/100;
    }
    const held=n(r.holding_trading_days), left=n(r.remaining_trading_days);
    const cb=n(r.cost_basis);
    /* 펼침 상태 키에 버전을 붙인다 — 같은 종목을 두 버전이 보유하면 V1에서 펼친 카드가
       V2/V3 전환 시 미리 펼쳐진 채 나오는 누수가 있었다(2026-08-27 QA 지적). */
    const key=PV_VER+':'+String(r.symbol||idx);
    const open_=PV_OPEN.has(key);
    const pid='pvpos-'+key;
    /* 기본은 한 줄로 훑고, 누르면 상세가 열린다(Progressive Disclosure).
       수익률은 종목명 바로 옆 — 한 덩어리 정보로 읽히게. */
    const retTag=ret==null
      ? `<em class="pv-pos-r pv-r-wait">평가 대기</em>`
      : `<em class="pv-pos-r${dir(ret)}">${sPct(ret)}</em>`;
    /* 접힌 상태에서도 "얼마에 사서 지금 얼마인지"가 한 줄로 읽혀야 한다.
       매수가가 없으면 수익률만 보이고 근거가 안 보인다(2026-08-19 보강). */
    const line2=[qty==null?null:qty.toLocaleString('ko-KR')+'주',
                 ep==null?null:'매수 '+won(ep),
                 cp==null?null:'현재가 '+won(cp)].filter(Boolean).join(' · ');
    const chev='<svg class="pv-chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const head=`<button type="button" class="pv-pos-hd" data-pos="${esc(key)}"
        aria-expanded="${open_?'true':'false'}" aria-controls="${pid}">
      <span class="pv-pos-l">
        <span class="pv-pos-nm">${esc(r.name||r.symbol||'종목 미기록')}${retTag}</span>
        <span class="pv-pos-sub">${line2||'&nbsp;'}</span>
      </span>
      <span class="pv-pos-rt">
        <span class="pv-pos-mv">${mv==null?'평가 대기':won(mv)}</span>
        <span class="pv-pos-pl${dir(pnl)}">${pnl==null?'':sWon(pnl)}</span>
      </span>${chev}
    </button>`;
    /* 상세 — 기존에 보여주던 정보를 하나도 줄이지 않는다. */
    const rows2=[
      ['종목코드', esc(r.symbol||DASH)],
      ['매수가', won(ep)],
      ['현재가', cp==null?'평가 대기':won(cp)],
      ['수량', qty==null?DASH:qty.toLocaleString('ko-KR')+'주'],
      ['투자원금', won(cb)],
      ['평가금액', mv==null?'평가 대기':won(mv)],
      ['가상 손익', pnl==null?'평가 대기':sWon(pnl)],
      ['수익률', ret==null?'평가 대기':sPct(ret)],
      ['진입일', r.entry_business_date?day(r.entry_business_date):DASH],
      ['진입시각', r.detected_at?hm(r.detected_at):DASH],
      ['보유기간', held==null?DASH:(held===0?'오늘 진입':`${held}거래일 경과`)],
      ['남은 최대 보유', left==null?(maxHold?`최대 ${maxHold}거래일`:DASH):`${left}거래일`],
      ['종료 조건', PV_VER==='v3'
        ?`익절 ${n(P.takeProfitPct)==null?'+3':'+'+P.takeProfitPct}% · 손절 ${n(P.stopLossPct)==null?'-2':P.stopLossPct}% · ${maxHold||2}거래일 도달 · 판단이 「매도 고려」로 변경`
        :PV_VER==='v2'
        ?`판단이 「매도 고려」로 변경(안전상한 ${maxHold||60}거래일)`
        :(maxHold?`${maxHold}거래일 도달 또는 판단이 「매도 고려」로 변경`:'판단이 「매도 고려」로 변경')],
      ['현재가 기준', asOf||'평가 대기']
    ].concat(
      /* 🕳️ 이 종목을 보유한 기간 중 기록이 없던 거래일. 그날 고가·저가는 관측되지
         않았으므로, 나중에 종료될 때의 MFE·MAE에도 반영되지 않는다는 사실을 미리 밝힌다. */
      (Array.isArray(r.observation_gap_business_days)&&r.observation_gap_business_days.length)
        ? [['관측 공백', `${r.observation_gap_business_days.length}거래일 · `
            +r.observation_gap_business_days.map(g=>day(g)).join(', ')
            +' — 이날 움직임은 기록되지 않았어요']]
        : []
    ).map(([k,v])=>`<div class="pv-row"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    return `<article class="pv-pos">${head}
      <div class="pv-pos-body" id="${pid}"${open_?'':' hidden'}>
        <dl class="pv-rows">${rows2}</dl>
        ${cp==null?`<p class="pv-pos-wait">현재가를 아직 받지 못해 평가금액을 계산하지 않았어요. 다음 기록에서 채워집니다.</p>`:''}
      </div>
    </article>`;
  }).join('');
  const stageNote={
    BEFORE_FORWARD_START:['검증 시작을 기다리고 있습니다.','예정된 시작일부터 실제 시장 가격을 기준으로 기록을 시작해요. 그 전에 나온 판단을 거슬러 올라가 거래로 만들지 않습니다.'],
    AWAITING_MARKET_DATA:['시세 연결을 준비하고 있습니다.',PAUSE_WHY]
  }[P.stage]||['첫 검증 신호를 기다리고 있습니다.','새로운 「매수 고려」 판단이 나오면 여기에 종목, 매수가격, 수량, 현재가격, 보유기간과 가상 성과가 자동으로 기록돼요.'];
  /* 종료 사유 코드 → 사람 말 (오늘 거래·종료 거래 두 곳에서 함께 쓴다) */
  const exitName={CHIEF_SELL:'GAEO 판단이 매도 고려로 변경',MAX_HOLDING_5D:'최대 보유기간 도달',
    MAX_HOLDING_SAFETY_CAP:'안전상한(60거래일) 도달',
    TAKE_PROFIT:'익절 기준 도달',STOP_LOSS:'손절 기준 도달',TIME_EXIT_2D:'최대 보유 2거래일 도달'};
  /* ③-0 오늘 거래 — "오늘 무엇을 사고팔았나"를 보유 목록과 분리해 먼저 답한다.
     ⚠️ 오늘 매수 = 오늘 실제로 진입(ENTRY)한 거래만. 어제 사서 오늘도 들고 있는 종목은
        '보유 중'일 뿐 오늘 매수가 아니다 — entry_business_date로 가른다.
     ⚠️ 오늘 매도 = 오늘 실제로 종료(EXIT)된 거래만(exit_business_date). */
  const tKST=new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
  const todayBuys=opens.filter(r=>r&&r.entry_business_date===tKST);
  const todaySells=closes.filter(r=>r&&r.exit_business_date===tKST);
  const nameList=(arr,cap)=>{
    const names=arr.map(r=>esc(r.name||r.symbol||'종목'));
    if(names.length<=cap) return names.join(' · ');
    return names.slice(0,cap).join(' · ')+` 외 ${names.length-cap}종목`;
  };
  const sellLines=todaySells.map(r=>{
    /* 💸 수익률은 금액(확정손익)과 같은 장부를 쓰는 return_pct를 먼저 본다.
       옛 스냅샷에는 그 필드가 없으므로 그때만 gross_return_pct로 물러선다. */
    const q=n(r.quantity), rr=n(r.return_pct)!=null?n(r.return_pct):n(r.gross_return_pct),
      rp=n(r.realized_pnl);
    const hd=n(r.holding_trading_days);
    return `<div class="pv-td-row"><span class="pv-td-nm">${esc(r.name||r.symbol||'종목')}`
      +`${rr==null?'':`<em class="pv-pos-r${dir(rr)}">${sPct(rr)}</em>`}</span>`
      +`<span class="pv-td-meta">${won(r.entry_price)} → ${won(r.exit_price)}`
      +`${q==null?'':` · ${q.toLocaleString('ko-KR')}주`}`
      +`${rp==null?'':` · ${sWon(rp)}`}`
      +`${hd==null?'':` · 보유 ${hd}거래일`}`
      +` · ${exitName[r.exit_reason]||'종료'}</span></div>`;
  }).join('');
  const buyMore=todayBuys.length>4
    ? `<details class="pv-td-more"><summary>전체 보기</summary><div class="pv-td-all">`
      +todayBuys.map(r=>{
        const q=n(r.quantity);
        return `<div class="pv-td-row"><span class="pv-td-nm">${esc(r.name||r.symbol||'종목')}</span>`
          +`<span class="pv-td-meta">${q==null?'':q.toLocaleString('ko-KR')+'주 · '}`
          +`${won(r.entry_price)}${r.detected_at?` · ${hm(r.detected_at)}`:''}</span></div>`;
      }).join('')+`</div></details>`
    : (todayBuys.length?`<div class="pv-td-all">`+todayBuys.map(r=>{
        const q=n(r.quantity);
        return `<div class="pv-td-row"><span class="pv-td-nm">${esc(r.name||r.symbol||'종목')}</span>`
          +`<span class="pv-td-meta">${q==null?'':q.toLocaleString('ko-KR')+'주 · '}`
          +`${won(r.entry_price)}${r.detected_at?` · ${hm(r.detected_at)}`:''}</span></div>`;
      }).join('')+`</div>`:'');
  const todaySec=`<section class="pv-sec" aria-labelledby="pvTodayH">
    <div class="pv-sec-hd"><h3 class="pv-sec-h" id="pvTodayH">오늘 거래</h3>
      <span class="pv-asof">매수 ${todayBuys.length} · 매도 ${todaySells.length}</span></div>
    <div class="pv-today">
      <div class="pv-td-grp"><span class="pv-td-k">매수</span>
        ${todayBuys.length
          ? `<p class="pv-td-sum">${nameList(todayBuys,4)}</p>${buyMore}`
          : `<p class="pv-td-none">오늘 새로 가상 매수한 종목이 없어요.</p>`}</div>
      <div class="pv-td-grp"><span class="pv-td-k">매도</span>
        ${todaySells.length
          ? `<div class="pv-td-all">${sellLines}</div>`
          : `<p class="pv-td-none">오늘 종료된 거래가 없어요.</p>`}</div>
    </div>
  </section>`;

  /* 현재가 기준 시각 — 종목마다 반복하지 않고 섹션 머리에 한 번만.
     '실시간'이라고 쓰지 않는다(스트리밍이 아니다) — 실제 관측 시각을 그대로 적는다. */
  const holdStamp=(open&&asOf)?`<span class="pv-asof">현재가 기준 ${asOf.replace(' 기준','')}</span>`:'';
  const held=`<section class="pv-sec" aria-labelledby="pvHoldH">
    <div class="pv-sec-hd"><h3 class="pv-sec-h" id="pvHoldH">현재 보유 중</h3>${holdStamp}</div>
    <p class="pv-sec-d">${open?'GAEO 판단으로 가상 매수한 종목이에요. 실제 주문은 발생하지 않습니다.':'가상으로 보유 중인 종목이 아직 없어요.'}</p>
    ${posHTML||`<div class="pv-empty"><b>${stageNote[0]}</b><p>${stageNote[1]}</p>${P.lastCycleAt?`<p class="pv-pos-wait">${live?'자동 기록 진행 중':'최근 기록'} · ${stamp(P.lastCycleAt)}</p>`:''}</div>`}
  </section>`;

  /* ④ 최근 종료 거래 — 진행 중과 절대 섞지 않는다. 내부 사유 코드는 한국어로 바꿔 쓴다. */
  const closedHTML=closes.map(r=>{
    /* 💸 여기도 금액과 같은 기준(return_pct)을 먼저 쓴다. 총수익이 왕복비용보다 작은
       구간에서 "+0.22%"와 "-105원"이 한 줄에 같이 뜨던 모순을 없앤다. */
    const ret=n(r.return_pct)!=null?n(r.return_pct):n(r.gross_return_pct),
      hd=n(r.holding_trading_days), pnl=n(r.realized_pnl);
    const qty=n(r.quantity);
    const price=`${won(r.entry_price)} → ${won(r.exit_price)}`;
    const why=exitName[r.exit_reason]||'종료';
    const num=ret==null?`<span class="pv-tret pv-na">기록 대기</span>`
      :`<span class="pv-tret${dir(ret)}">${sPct(ret)}</span>`;
    /* 🕳️ 보유 기간 중 기록이 없던 거래일 수 — 이 거래의 MFE·MAE가 그만큼
       덜 본 값이라는 뜻이라, 성과 숫자 옆에 사실대로 함께 적는다. */
    const gp=Array.isArray(r.observation_gap_business_days)?r.observation_gap_business_days.length:0;
    return `<div class="pv-trade"><span class="pv-tname">${esc(r.name||r.symbol||'종목 미기록')}</span>`
      +`<span class="pv-tmeta"><i>${price}${qty==null?'':` · ${qty}주`}</i>`
      +`<i>${why}${hd==null?'':` · ${hd}거래일`}${pnl==null?'':` · ${sWon(pnl)}`}`
      +`${gp?` · 관측 공백 ${gp}거래일`:''}</i></span>${num}</div>`;
  }).join('');
  const closedSec=closes.length?`<section class="pv-sec" aria-labelledby="pvClosedH">
    <h3 class="pv-sec-h" id="pvClosedH">최근 종료 거래</h3>
    <p class="pv-sec-d">가상 매수부터 청산까지 끝난 기록이에요.</p>
    <div class="pv-ledger"><div class="pv-lhead" aria-hidden="true"><span>종목</span><span>가격 · 수량</span><span>종료 사유</span><span>성과</span></div>${closedHTML}</div>
  </section>`:'';

  /* ⑤ 검증 상태 — 전문 지표는 한국어를 먼저 쓰고 영문 약어는 보조 크기로만.
     ⚠️ 데이터가 쓰는 실제 지표 이름은 MFE/MAE다(MFI는 전혀 다른 지표라 쓰지 않는다). */
  const hasPerf=closed>0||open>0||n(P.realizedPnl)!=null||n(P.unrealizedPnl)!=null||n(P.maxDrawdownPct)!=null;
  const na=t=>`<dd class="pv-na">${t}</dd>`;
  const val=(v,c)=>`<dd class="${c||''}">${v}</dd>`;
  let perf='';
  if(hasPerf){
    const pr=[
      ['확정 손익 <small>종료된 거래</small>', n(P.realizedPnl)==null?na('기록 대기'):val(sWon(P.realizedPnl))],
      ['평가 손익 <small>보유 중인 거래</small>', n(P.unrealizedPnl)==null?na('평가 대기'):val(sWon(P.unrealizedPnl))],
      ['최대 낙폭 <small>MDD</small>', n(P.maxDrawdownPct)==null?na('기록 대기'):val(Math.abs(P.maxDrawdownPct).toFixed(1)+'%')],
      ['보유 중 최고 상승폭 <small>MFE</small>', n(P.avgMfePct)==null?na('기록 대기'):val(sPct(P.avgMfePct))],
      ['보유 중 최대 하락폭 <small>MAE</small>', n(P.avgMaePct)==null?na('기록 대기'):val(sPct(P.avgMaePct))],
      /* 표본 부족이면 "무엇이" 부족한지 적는다 — 건수가 다 찼는데도 승률이 안 나오면
         고장으로 오해하기 때문이다(같은 날 담은 거래는 서로 독립이 아니라서 판단일도 센다). */
      ['승률', !closed?na('아직 종료 거래 없음')
        :(insufficient?na(needClosed?`표본 부족 · 거래 ${closed}/${minClosed}건`
                                    :`표본 부족 · 판단일 ${eDays==null?'—':eDays}/${minDays}일`)
        :(n(P.winRatePct)==null?na('기록 대기'):val(P.winRatePct.toFixed(1)+'%')))],
      ['종료거래 평균 수익률 <small>비용 전</small>', !closed?na('아직 종료 거래 없음')
        :(n(P.avgReturnPct)==null?na('기록 대기'):val(sPct(P.avgReturnPct)))],
      /* 💸 수수료·세금을 뺀 값. 비용 모델이 없는 옛 스냅샷에서는 칸을 만들지 않는다. */
      ...(cm?[['종료거래 평균 순수익 <small>수수료·세금 반영</small>', !closed?na('아직 종료 거래 없음')
        :(n(P.estimatedNetReturnPct)==null?na('기록 대기'):val(sPct(P.estimatedNetReturnPct)))]]:[]),
      ['종료거래 평균 시장대비', !closed?na('아직 종료 거래 없음')
        :(n(P.avgRelativeReturnPct)==null?na('기록 대기')
        :val((P.avgRelativeReturnPct>0?'+':P.avgRelativeReturnPct<0?'−':'')+Math.abs(P.avgRelativeReturnPct).toFixed(2)+'%p'))],
      ['평균 보유기간', n(P.avgHoldingTradingDays)==null?na('기록 대기'):val(P.avgHoldingTradingDays.toFixed(1)+'거래일')]
    ].map(([k,v])=>`<div class="pv-row"><dt>${k}</dt>${v}</div>`).join('');
    /* 🕳️ 관측 공백 고지 — MFE·MAE는 "사이클마다 실제로 본 값"이라, 기록이 없던
       거래일의 장중 고가·저가는 애초에 들어 있지 않다. 값을 보정하지 않고(보정하면
       관측한 적 없는 가격을 지어내는 것이다) 한계를 숫자 옆에 그대로 적는다. */
    const gapDaysAll=(P.dataGaps||[]).map(g=>g&&g.businessDate).filter(Boolean);
    const gapNote=gapDaysAll.length
      ? `<p class="pv-foot" style="margin-top:12px"><b>관측 공백 ${gapDaysAll.length}거래일</b>
         (${gapDaysAll.map(g=>day(g)).join(' · ')}) — 이날은 자동 기록이 돌지 않아 장중 움직임을
         한 번도 보지 못했어요. 위 <b>보유 중 최고 상승폭(MFE)·최대 하락폭(MAE)</b>은 실제로 관측한
         사이클에서만 계산한 값이라 이 날들의 고가·저가는 빠져 있습니다. 지나간 날의 가격을
         나중에 채워 넣지 않기 때문이에요.</p>`
      : '';
    /* 🕐 이 칸의 숫자는 엔진이 마지막으로 계산해 저장한 값이다. 반면 맨 위 「현재 손익」은
       더 신선한 data.js 시세로 화면에서 다시 계산한다(위 dv.source==='live' 분기).
       그래서 같은 「보유 중 손익」이 두 값으로 보일 수 있다. 값을 맞추려고 이 칸을 다시
       계산하면 옆 칸(MDD·MFE·MAE)만 엔진 기록으로 남아 기준이 섞이므로, 계산하지 않고
       기준 시각을 적어 어느 시점의 숫자인지 드러낸다. */
    const engAt=P.valuationObservedAt||P.generatedAt||'';
    const engSame=engAt&&String(engAt).slice(0,10)===todayKST;
    const engAsOf=engAt?(engSame?`${hm(engAt)} 기준`:`${md(engAt)} ${hm(engAt)} 기준`):'';
    const engNote=engAsOf
      ? `<p class="pv-sec-d">이 칸의 숫자는 자동 기록이 마지막으로 계산한 <b>${engAsOf}</b> 값이에요.${
          (dv.source==='live'&&asOf&&asOf!==engAsOf)
            ? ` 맨 위 「현재 손익」은 더 최신 시세(${asOf})로 다시 계산한 값이라 조금 다를 수 있어요.`
            : ''}</p>`
      : '';
    perf=`<section class="pv-sec" aria-labelledby="pvPerfH">
      <h3 class="pv-sec-h" id="pvPerfH">검증 상태</h3>
      <p class="pv-sec-d">종료된 거래가 쌓이기 전에는 대부분의 값이 비어 있는 게 정상이에요. 없는 값을 0으로 채우지 않습니다.</p>
      ${engNote}<dl class="pv-rows">${pr}</dl>${gapNote}${glossHTML()}</section>`;
  }

  /* ⑥ 어떻게 기록하나요 — 각 전략 엔진(paper_engine·paper_smart_v2·paper_scalp_v3)의
     실제 규칙만. 없는 규칙을 만들지 않는다. */
  const stepsByVer={
    v1:[
      'GAEO의 판단이 직전과 달리 <em>새롭게 「매수 고려」로 바뀐</em> 종목을 골라냅니다.',
      '장이 열려 있는 동안, 그 시점의 <em>실제 시장 가격</em>으로 가상 매수를 기록합니다. 시세를 읽지 못하면 가격을 추측하지 않고 건너뜁니다.',
      '보유하는 동안 시장 움직임과 GAEO 판단 변화를 자동으로 따라갑니다.',
      `판단이 <em>「매도 고려」로 바뀌거나 ${maxHold||5}거래일이 지나면</em> 가상 청산하고, 결과를 같은 기간 코스피·코스닥 움직임과 함께 남깁니다.`
    ],
    v2:[
      'GAEO의 판단이 직전과 달리 <em>새롭게 「매수 고려」로 바뀐</em> 종목을 골라냅니다(V1과 동일).',
      '장이 열려 있는 동안, 그 시점의 <em>실제 시장 가격</em>으로 가상 매수를 기록합니다. 시세를 읽지 못하면 가격을 추측하지 않고 건너뜁니다.',
      '5거래일이 돼도 팔지 않습니다 — <em>재평가만 하고</em>, 판단이 계속 좋으면 들고 갑니다.',
      `판단이 <em>「매도 고려」로 바뀌면</em> 가상 청산하고, ${maxHold||60}거래일 안전상한은 넘기지 않습니다.`
    ],
    v3:[
      '시장 전체가 하락 표류 중이면(전 종목 5거래일 수익률의 중앙값이 마이너스) 그날은 <em>사지 않고 관망</em>합니다.',
      `시장이 괜찮은 날, 20일선·60일선 위에서 <em>단기 상승 흐름</em>이 확인된 종목을 ${v3Buy} 실제 시장 가격으로 가상 매수합니다.${v3Cap?' 한 업종에 쏠리지 않게 <em>업종당 '+v3Cap+'종목</em>까지만 담습니다.':''}`,
      `보유 중 약 30분마다 가격을 관측해 <em>익절 ${n(P.takeProfitPct)==null?'+3':'+'+P.takeProfitPct}% · 손절 ${n(P.stopLossPct)==null?'-2':P.stopLossPct}%</em>에 닿으면 가상 청산합니다.`,
      `닿지 않으면 <em>${maxHold||2}거래일</em>에 시간 청산하고, GAEO 판단이 「매도 고려」로 바뀌면 안전판으로 청산합니다.`
    ]
  };
  const steps=(stepsByVer[PV_VER]||stepsByVer.v1).map((t,i)=>`<li><b>${i+1}</b><p>${t}</p></li>`).join('');
  const how=`<section class="pv-sec" aria-labelledby="pvHowH">
    <h3 class="pv-sec-h" id="pvHowH">어떻게 기록하나요?</h3>
    <ol class="pv-steps">${steps}</ol>
    ${hasPerf?'':glossHTML()}
    ${detailHTML()}</section>`;

  function glossHTML(){
    const chev='<svg class="pv-chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const g=[
      ['최대 낙폭 (MDD)','가상자산이 이전 최고점에서 가장 크게 줄어든 폭이에요. 같은 수익률이라도 도중에 얼마나 크게 흔들렸는지를 보여줍니다.'],
      ['보유 중 최고 상승폭 (MFE)','보유하는 동안 가장 많이 올랐던 순간의 폭이에요. 끝까지 들고 있었을 때의 결과와는 다릅니다.'],
      ['보유 중 최대 하락폭 (MAE)','보유하는 동안 가장 많이 내렸던 순간의 폭이에요. 버티기 얼마나 힘들었는지를 보여줍니다.'],
      ['시장대비','종료된 거래가 같은 기간 지수보다 얼마나 더(또는 덜) 움직였는지예요. %p는 두 수익률의 차이를 뜻합니다.'],
      ['표본 부족',`성과를 결론짓기에 기록이 아직 모자란 상태예요. 두 가지를 같이 봅니다 — <b>종료된 거래 ${minClosed}건</b>과 <b>서로 다른 판단일 ${minDays}일</b>. 이 계좌는 한 번에 열 종목까지만 담아서 같은 날 한꺼번에 사고 한꺼번에 파는데, 같은 날 산 열 종목은 같은 시장에 함께 올라탄 것이라 열 번의 서로 다른 시도가 아니에요. 그래서 건수만 채워진 승률은 보여주지 않습니다.`]
    ].map(([k,v])=>`<div class="pv-row"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    return `<details class="pv-gloss"><summary>처음 보는 용어 설명${chev}</summary><dl class="pv-rows">${g}</dl></details>`;
  }
  function detailHTML(){
    const chev='<svg class="pv-chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const d=[
      ['검증 방식', PV_VER==='v3'?'단타 실험(V3)':PV_VER==='v2'?'스마트 보유 비교(V2)':'GAEO 기본 검증(V1)'],
      ...(P.entryRule?[['진입 규칙', esc(P.entryRule)]]:[]),
      ...(P.exitRule?[['청산 규칙', esc(P.exitRule)]]:[]),
      ['검증 시작', day(P.forwardStart)],
      ['한 종목 최대 보유', maxHold?`${maxHold}거래일`:DASH],
      ['한 종목 가상 투자 기준금액', n(P.positionSizeKrw)==null?DASH:won(P.positionSizeKrw)],
      ['남은 가상현금', won(P.availableVirtualCash)],
      ['평가 기준 시각', P.valuationObservedAt?stamp(P.valuationObservedAt):'평가 대기']
    ].map(([k,v])=>`<div class="pv-row"><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    /* 「매수 고려」인데 진입하지 않은 신호 설명.
       ⚠️ 정상적인 미진입(자금 부족·1주 가격이 기준금액 초과)과 시스템 문제(시세 못 받음)를
          절대 같은 문장으로 묶지 않는다. 내부 상태 코드는 화면에 쓰지 않는다. */
    const nCash=n(P.skippedInsufficientCash)||0;
    const nBig=n(P.skippedPriceAbovePositionSize)||0;
    const nQuote=n(P.skippedMarketDataUnavailable)||0;
    const notes=[];
    if(nCash) notes.push(`가상 투자 여력이 부족해 진입하지 않은 신호가 <b>${nCash}건</b> 있어요. 남은 가상현금보다 한 종목 기준금액이 커서 자연스럽게 건너뛴 경우로, 기록이 잘못된 게 아닙니다.`);
    if(nBig) notes.push(`1주 가격이 한 종목 기준금액보다 높아 한 주도 살 수 없어 건너뛴 신호가 <b>${nBig}건</b> 있어요. 이것도 정상적인 결과입니다.`);
    if(nQuote) notes.push(`시세를 받지 못해 기록하지 못한 신호가 <b>${nQuote}건</b> 있어요. 가격을 추측하지 않기 때문이며, 이건 시세 연결 상태를 확인해야 하는 경우입니다.`);
    const skipSec=notes.length
      ? `<div class="pv-skip"><p class="pv-skip-h">「매수 고려」였지만 가상 매수하지 않은 신호</p>`
        +notes.map(t=>`<p class="pv-skip-p">${t}</p>`).join('')+`</div>`
      : '';
    return `<details class="pv-gloss"><summary>상세 정보${chev}</summary><dl class="pv-rows">${d}</dl>${skipSec}</details>`;
  }

  /* 💸 비용 안내 — 러너가 실제로 반영한 요율을 그대로 읽어 쓴다(화면에 숫자를 박지 않는다).
     비용 모델이 아직 없는 옛 스냅샷에서는 예전 문구를 그대로 쓴다. */
  const costLine=(cm&&n(cm.roundTripPct)!=null)
    ? `<b>손익 금액은 수수료·세금을 반영한 값</b>이고, 거래별 수익률도 같은 기준으로 표시합니다. 다만 아래 「검증 상태」의 <b>평균 수익률은 비용을 빼기 전 값</b>이라 옆의 순수익과 함께 봐야 합니다. 반영한 비용은 위탁수수료 ${cm.commissionPct}%(살 때·팔 때 각각)와 매도 시 세금 ${cm.sellTaxPct&&cm.sellTaxPct.KOSPI!=null?cm.sellTaxPct.KOSPI:''}%로, 한 번 사고팔면 약 ${cm.roundTripPct}%입니다(${esc(cm.verifiedAt||'')} 확인). 체결가는 실제 호가를 쓰기 때문에 호가 차이는 이미 값에 들어 있고, 큰 주문이 시세를 밀어내는 효과는 계산에 넣지 않았어요.`
    : `수익률·손익은 수수료·세금을 반영하기 전이에요(비용 모델 확인 중).`;
  /* 💸 회계 기준이 섞여 있으면 그 사실을 숨기지 않는다.
     전환 이전에 산 거래는 수수료·세금이 빠지지 않은 옛 방식으로 남아 있고(지난 기록을
     나중에 고쳐 쓰지 않기 때문), 그만큼 지갑이 실제보다 많게 보인다. 그 차액과
     "전부 반영하면 얼마인지"를 같이 적는다 — 성과를 낮추는 방향이라 고지에 해당한다. */
  const mix=P.costBasisMix;
  let mixLine='';
  if(mix&&n(mix.unreflectedCostKrw)>0&&n(mix.grossBasisTrades)&&n(mix.cashIfAllNetKrw)!=null){
    const parts=[`가상현금 ${won(mix.cashIfAllNetKrw)}`];
    if(n(mix.equityIfAllNetKrw)!=null) parts.push(`현재 가상자산 ${won(mix.equityIfAllNetKrw)}`);
    if(n(mix.portfolioReturnPctIfAllNet)!=null) parts.push(`수익률 ${sPct(mix.portfolioReturnPctIfAllNet)}`);
    mixLine=` 다만 ${day(mix.switchAt)} 이전에 산 거래 ${mix.grossBasisTrades}건은 이 비용을 아직 빼지 않은 옛 방식으로 남아 있어요. 이미 남긴 기록을 나중에 고쳐 쓰지 않기 때문입니다. 그만큼(${won(mix.unreflectedCostKrw)}) 위 금액이 실제보다 많아 보이고, 전부 빼면 ${parts.join(' · ')}입니다.`;
  }
  const foot=`<p class="pv-foot"><b>실제 투자 주문은 발생하지 않습니다.</b> 실제 계좌·실제 돈과 연결되지 않은 가상 기록입니다. ${costLine}${mixLine} ${esc(P.benchmarkNote||'')}</p>`;

  /* 자동 재렌더 시 사용자가 펼쳐 둔 설명(details)이 닫히지 않게 상태를 보존한다 */
  const openGloss=[...el.querySelectorAll('.pv-gloss')].map(d=>d.open);
  /* 모의투자 안의 두 화면 — 보유 현황 / 기록. 최상위 메뉴는 그대로 '모의투자' 하나다. */
  const tab=(k,label)=>`<button type="button" class="pv-tab${PV_VIEW===k?' on':''}"
    data-pview="${k}" role="tab" aria-selected="${PV_VIEW===k?'true':'false'}">${label}</button>`;
  /* 기록(날짜별 History)은 세 버전 모두 제공한다 — 러너가 각 전략 원장에서
     버전별 파생 파일을 만든다(paper_trading/history*.json). 아직 거래가 없는 버전은
     "아직 쌓인 기록이 없어요"로 정직하게 비어 있게 둔다(가짜 날짜를 만들지 않는다). */
  const tabs=`<div class="pv-tabs" role="tablist" aria-label="모의투자 화면 선택">
    ${tab('holdings','보유 현황')}${tab('history','기록')}</div>`;
  const body=(PV_VIEW==='history')
    ? paperHistoryHTML()
    /* 🎯 실제 투자 화면 순서: 자산 → 내 보유 종목 → 오늘 거래 → 종료 거래 → 설명.
       예전에는 '오늘 거래'가 보유 종목보다 위에 있어, 거래가 없는 날(대부분)에는
       "없어요" 두 줄을 지나야 내 종목이 나왔다.
       반등 후보 관찰(실험 섹션)은 V1 화면에만 둔다 — 버전 계좌와 무관한 공용 실험이라
       세 탭에 반복해 붙이면 각 계좌의 기록처럼 오해된다. */
    : summary+held+todaySec+closedSec+perf+(PV_VER==='v1'?reboundHTML():'')+how+foot;
  el.innerHTML=hero+tabs+body;
  el.querySelectorAll('.pv-gloss').forEach((d,i)=>{ if(openGloss[i]) d.open=true; });
}
/* 모의투자 화면 클릭 위임 — 종목 펼침 · 화면 전환 · 날짜 열기/뒤로.
   재렌더로 노드가 갈려도 계속 동작하도록 컨테이너에 한 번만 건다. */
(function(){
  if(typeof document==='undefined') return;
  document.addEventListener('click',ev=>{
    const el=document.getElementById('paperView');
    if(!el||!el.contains(ev.target)) return;
    const pos=ev.target.closest('.pv-pos-hd');
    if(pos){
      const k=pos.dataset.pos;
      if(PV_OPEN.has(k)) PV_OPEN.delete(k); else PV_OPEN.add(k);
      // 전체 재렌더 없이 그 자리에서 여닫는다(빠른 연타에도 상태가 어긋나지 않는다)
      const open_=PV_OPEN.has(k);
      pos.setAttribute('aria-expanded',open_?'true':'false');
      const body=document.getElementById(pos.getAttribute('aria-controls'));
      if(body) body.hidden=!open_;
      return;
    }
    const ver=ev.target.closest('.pv-ver');
    if(ver){
      if(ver.dataset.pver&&ver.dataset.pver!==PV_VER){
        PV_VER=ver.dataset.pver;
        /* 버전이 바뀌면 열어 둔 날짜는 의미가 없다(계좌가 다르다) — 목록부터 다시 본다.
           기록 탭에 있었다면 그 버전 기록을 새로 받아온다(버전별로 따로 캐시된다). */
        PV_DAY=null;
        if(PV_VIEW==='history') paperLoadHistory();
        renderPaper();
      }
      return;
    }
    const tab=ev.target.closest('.pv-tab');
    if(tab){
      PV_VIEW=tab.dataset.pview; PV_DAY=null;
      if(PV_VIEW==='history') paperLoadHistory();
      try{
        const u=new URL(location.href);
        if(PV_VIEW==='history') u.searchParams.set('view','history');
        else u.searchParams.delete('view');
        history.replaceState(null,'',u);
      }catch(e){}
      renderPaper();
      return;
    }
    /* 관측 공백 행에는 data-day가 없다(펼칠 상세가 없는 날) — 눌러도 아무 일이 없어야 한다 */
    const dayBtn=ev.target.closest('.pv-hd-row');
    if(dayBtn&&dayBtn.dataset.day){ PV_DAY=dayBtn.dataset.day; renderPaper(); return; }
    if(ev.target.closest('.pv-back')){ PV_DAY=null; renderPaper(); return; }
  });
})();

/* 💹 모의투자 표시 데이터 자동 재조회 (2026-08-18)
   화면이 열려 있는 동안 2분마다 data.js·paper_public.js가 새로 배포됐는지 확인하고,
   실제로 더 새 것일 때만 표시를 다시 그린다(홈 브리핑의 refreshBrief와 같은 패턴).
   · 원본 데이터가 약 10분 주기라 이보다 촘촘한 폴링은 낭비 — 2분이면 충분하다.
   · 모의투자 화면이 꺼져 있거나 탭이 백그라운드면 아무 요청도 하지 않는다.
   · 실패하면 조용히 기존 값 유지 — 표시를 0원으로 만들거나 시각을 위조하지 않는다.
   · 커밋·Toss 호출·토큰 발급 0 — 이미 배포된 정적 파일을 다시 읽을 뿐이다. */
(function(){
  if(typeof window==='undefined'||typeof fetch!=='function') return;
  let busy=false;
  async function tick(){
    const pv=document.getElementById('paperView');
    if(busy||!pv||!pv.classList.contains('on')||document.hidden) return;
    busy=true;
    try{
      let changed=false;
      const [d,p]=await Promise.allSettled([
        fetch('data.js',{cache:'no-cache'}),
        fetch('paper_public.js',{cache:'no-cache'})
      ]);
      if(d.status==='fulfilled'&&d.value.ok){
        const t=await d.value.text();
        const start=t.indexOf('const LIVE_DATA ='), from=t.indexOf('{',start), to=t.lastIndexOf('};');
        if(start>=0&&from>0&&to>from){
          try{
            const live=JSON.parse(t.slice(from,to+1));
            const cur=(window.GAEO_PAPER_LIVE!==undefined)?window.GAEO_PAPER_LIVE
              :(typeof LIVE_DATA!=='undefined'?LIVE_DATA:null);
            // 같은 "YYYY-MM-DD HH:MM …" 형식이라 문자열 비교 = 시간 비교
            if(live&&typeof live.date==='string'&&(!cur||!cur.date||live.date>cur.date)){
              window.GAEO_PAPER_LIVE=live; changed=true;
            }
          }catch(e){/* 파싱 실패 — 기존 값 유지 */}
        }
      }
      if(p.status==='fulfilled'&&p.value.ok){
        const t=await p.value.text();
        /* ⚠️ 파일에 버전별 전역이 여러 줄(GAEO_PAPER · _V2 · _V3) 있다. 예전처럼
           탐욕([\s\S]*) 매칭을 쓰면 첫 키에서 마지막 };까지 통째로 잡혀 파싱이
           조용히 깨진다 — payload가 한 줄 JSON이라는 사실을 이용해 줄 단위로 잡는다. */
        for(const k of ['GAEO_PAPER','GAEO_PAPER_V2','GAEO_PAPER_V3']){
          const m=t.match(new RegExp('window\\.'+k+'=([^\\n]*);'));
          if(!m) continue;
          try{
            const snap=JSON.parse(m[1]);
            const cur=window[k];
            if(snap&&snap.generatedAt&&(!cur||!cur.generatedAt||snap.generatedAt>cur.generatedAt)){
              window[k]=snap; changed=true;
            }
          }catch(e){/* 파싱 실패 — 기존 값 유지 */}
        }
      }
      if(changed&&pv.classList.contains('on')) renderPaper();
    }catch(e){/* 네트워크 실패 — 기존 값 유지, 다음 주기에 재시도 */}
    busy=false;
  }
  setInterval(tick,2*60*1000);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) tick(); });
})();
/* ── 🧪 모델 대결 / 모델 검증 패널 ────────────────────────────────────────────
   5개 모델을 한 판에 놓고 비교한다. 카드를 늘어놓지 않고 한 패널 안의 row로 둔다.
   ⚠️ 없는 성적을 0%로 표시하지 않는다. 평가 대기·해당 없음·근거 부족을 구분해 적는다. */
/* 🧪 모델 실험실 — 4개 모델을 "짧은 첫 화면 → 눌렀을 때만 상세" 구조로 설명한다.
   ⚠️ 여기 있는 모든 설명은 analyze_auto.py·compute_team_weights.py·research_engine(v1.0/1.1/2.0)·
   model_registry.py의 실제 동작만 적는다(2026-08-17 재확인). 모델 로직은 절대 건드리지 않는다.
   숫자 중 발언권·표본·기록량은 team_weights.js/model_scoreboard.js에서 동적으로 읽는다. */
let ML_SELECTED='base_production';
const ML_OPEN=new Set();   // 열려 있는 상세 섹션 id — 탭 전환·재렌더 후에도 유지
function modelLabHTML(){
  const SB=(typeof MODEL_SCOREBOARD!=='undefined'&&MODEL_SCOREBOARD)?MODEL_SCOREBOARD:null;
  const TW=(typeof TEAM_WEIGHTS!=='undefined'&&TEAM_WEIGHTS&&TEAM_WEIGHTS.global)?TEAM_WEIGHTS:null;
  const sbModel=id=>SB&&Array.isArray(SB.models)?SB.models.find(m=>m.id===id):null;
  const chev='<svg class="ml-chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const acc=(id,label,body)=>{
    const open=ML_OPEN.has(id);
    return `<div class="ml-acc"><button type="button" class="ml-acc-btn" aria-expanded="${open}" aria-controls="${id}" data-mldisc="${id}"><span>${label}</span>${chev}</button><div class="ml-acc-body" id="${id}" ${open?'':'hidden'}>${body}</div></div>`;
  };
  const recLine=m=>m&&m.uniquePredictionDates
    ?`판단일 ${m.uniquePredictionDates}일 · 기록 ${Number(m.recordCount||0).toLocaleString()}건`
    :'자료 축적 중';
  const flowChart=steps=>`<div class="ml-flow">${steps.map((s,i)=>(i?'<span class="ml-arrow" aria-hidden="true">↓</span>':'')+`<span>${s}</span>`).join('')}</div>`;

  /* 현재 발언권 — team_weights.js를 동적으로 읽는다(하드코딩 금지) */
  const NAME={taro:'TARO',diana:'DIANA',nova:'QUANT',flow:'FLOW'};
  let weightRows='<p>발언권 자료 축적 중 — team_weights가 아직 준비되지 않았습니다.</p>';
  let weightSub='';
  if(TW&&TW.global.weights){
    weightRows='<div class="ml-w">'+['taro','diana','nova','flow'].map(k=>{
      const w=TW.global.weights[k];
      const st=(TW.global.acc||{})[k]||{};
      if(w==null) return '';
      return `<span class="ml-wn">${NAME[k]}</span><span class="ml-wv">${(w*100).toFixed(1)}%</span><span class="ml-meter" aria-hidden="true"><i style="width:${Math.min(100,w/0.4*100).toFixed(0)}%"></i></span>`
        +`<span></span><span></span><span class="ml-wsub">보정 적중 ${st.adjustedAcc!=null?st.adjustedAcc+'%':'—'} · 채점 ${st.n!=null?Number(st.n).toLocaleString()+'건':'—'} · ${st.days!=null?st.days+'거래일 기준':''}</span>`;
    }).join('')+'</div>';
    weightSub=`<p class="ml-note">${esc(TW.generatedAt||'')} 계산 · 총 채점 ${Number(TW.global.graded||0).toLocaleString()}건 · 업종별 오버라이드 ${Object.keys(TW.sectors||{}).length}개 업종</p>`;
  }
  const hdays=k=>{const h=TW&&TW.horizons&&TW.horizons[k];return h&&h.days?h.days:( {taro:5,diana:20,nova:5,flow:5}[k] );};

  /* ── 모델별 콘텐츠 ── */
  const mBase=sbModel('base_production'), mA=sbModel('research_a'), mB=sbModel('research_b'), mC=sbModel('research_c');
  const PANEL={};

  PANEL.base_production=()=>`
    <h4 class="ml-title">GAEO 기본모델 개선판</h4>
    <p class="ml-oneline">현재 GAEO에서 실제 BUY · HOLD · SELL을 만드는 모델입니다. 기술·재무·과거통계·수급을 각각 분석한 뒤, 각 분석가의 실제 성적에 따라 발언권을 조정하고 위험도를 마지막으로 반영해 최종 판단을 만듭니다.</p>
    <dl class="ml-facts">
      <dt>현재 상태</dt><dd>${esc((mBase&&mBase.statusLabel)||'실제 서비스')}</dd>
      <dt>서비스 반영</dt><dd>사용 중 — 지금 화면의 판단이 이 모델입니다</dd>
      <dt>핵심 질문</dt><dd>지금 이 종목을 BUY · HOLD · SELL 중 어떻게 볼 것인가</dd>
      <dt>기록</dt><dd>${recLine(mBase)}</dd>
    </dl>
    ${acc('mlb-how','어떻게 판단하나요?',`
      ${flowChart(['시장 데이터','TARO · DIANA · QUANT · FLOW 각자 분석','발언권을 반영한 CHIEF 종합','RISK 안전장치','BUY · HOLD · SELL'])}
      <h4>TARO · 기술</h4>
      <p>“지금 차트와 추세가 건강한가?” — MA20 · MA60 · RSI · MACD · 5·20 교차 · 20·60 교차 · 거래량을 봅니다.</p>
      <ul>
        <li>이동평균선 위라고 무조건 좋게 보지 않습니다. 건강한 상승은 긍정적으로 보되, 이동평균선에서 지나치게 멀어진 급등은 과열로 다시 감점합니다.</li>
        <li>막 발생한 골든/데드크로스를 오래된 교차보다 크게 반영합니다(시간이 지날수록 약해짐).</li>
        <li>RSI 70 이상을 무조건 매도로 처리하지 않습니다(강세이되 과열 주의로 봄).</li>
        <li>MACD처럼 워밍업이 필요한 지표는 데이터가 부족하면 아예 쓰지 않고, 신규 상장주의 미완성 MA60을 정상 MA60처럼 쓰지 않습니다.</li>
      </ul>
      <p class="ml-note">최근 개선 핵심: 극단적 과열 보정 · 미성숙 기술지표 제외 (2026-08-15 개선판)</p>
      <h4>DIANA · 재무와 가치</h4>
      <p>“회사의 가치와 현재 가격이 괜찮은가?” — PER · PBR · ROE · Forward PER · 증권사 목표주가 괴리를 봅니다. DIANA는 단기 차트 예측가가 아니라 기업 가치와 품질을 보는 역할입니다. 목표주가보다 현재 가격이 지나치게 높아졌을 때 일정 수준에서 감점을 멈추지 않고, 극단적인 괴리는 추가로 경계하도록 개선됐습니다.</p>
      <h4>QUANT · 과거통계</h4>
      <p>“과거에 지금과 비슷했던 상황은 실제로 어떻게 끝났는가?” — 예를 들어 RSI 강세 + MA20 위 + 최근 5거래일 상승이라는 같은 상태가 과거 여러 종목에서 나왔을 때, 5거래일 뒤 실제로 오른 빈도를 셉니다.</p>
      <ul>
        <li>AI의 느낌이나 문장 추측이 아니라 실제 과거 관측 사례를 셉니다.</li>
        <li>표본이 부족하면(30건 미만) 더 넓은 조건으로 넓혀서 다시 셉니다.</li>
        <li>업종마다 기본 상승 확률이 다른 것도 보정합니다.</li>
      </ul>
      <p class="ml-note">코드 내부 이름은 호환성 때문에 nova지만, 화면에서는 QUANT로 통일합니다. 기본모델의 QUANT는 실제 방향점수를 냅니다(연구모델과 다른 점).</p>
      <h4>FLOW · 수급</h4>
      <p>“실제로 누가 사고 팔고 있는가?” — 외국인 순매수 · 기관 순매수 · 외국인 보유율 변화 · 매수 지속성 · 매집/분배 흐름을 봅니다.</p>
      <p><b>데이터 없음 ≠ 중립 50점.</b> 수급 데이터가 없으면 가짜 중립 점수를 넣지 않고, FLOW의 의견을 최종 계산에서 아예 제외합니다.</p>
      <h4>RISK · 안전장치</h4>
      <p>“좋아 보이더라도 지금 너무 위험하지 않은가?” — 변동성 · 3개월 최대낙폭 · 저점 대비 반등 · 시장 변동성을 봅니다.</p>
      <p>RISK는 다섯 번째 분석가가 아닙니다. 플러스 보너스를 주는 사람이 아니라, 위험할 때 마지막 결과를 낮추는 <b>브레이크</b>입니다. 강한 반등 국면에서는 과도한 위험 감점을 일부 완화할 수 있지만, 플러스 보너스로 바뀌지는 않습니다.</p>
    `)}
    ${acc('mlb-weight','발언권은 어떻게 정하나요?',`
      <h4>분석가의 발언권은 실제 성적으로 바뀝니다</h4>
      <p>TARO · DIANA · QUANT · FLOW가 항상 25%씩 투표하는 구조가 아닙니다. 각자 자기 전문 영역에서 실제로 얼마나 잘 맞았는지를 확인한 뒤 CHIEF가 발언권을 조정합니다.</p>
      <h4>역할에 따른 시작 발언권</h4>
      <p>TARO 30% · DIANA 12% · QUANT 28% · FLOW 30% — 단, 이것은 최종 발언권이 아니라 역할에 따른 출발점입니다. DIANA가 상대적으로 작은 이유는 재무·밸류가 단기 주가 방향을 맞히는 역할이 아니라 기업 품질을 보는 중기 성격이 강하기 때문입니다.</p>
      <h4>각자 다른 시험을 봅니다</h4>
      <p>TARO ${hdays('taro')}거래일 · QUANT ${hdays('nova')}거래일 · FLOW ${hdays('flow')}거래일 · DIANA ${hdays('diana')}거래일 기준으로 채점합니다. 재무분석가에게 “내일 주가가 올랐는지”를 묻는 것은 불공정하기 때문에, 각 분석가가 맡은 역할에 맞는 기간으로 성적을 평가합니다.</p>
      <h4>작은 표본은 믿지 않습니다</h4>
      <p>“10번 중 9번 맞았다”고 바로 천재라고 판단하지 않습니다. 표본이 적으면 우연일 가능성이 있으므로 50% 쪽으로 보수적으로 줄여 평가합니다. <span class="ml-note">(Bayesian shrinkage)</span></p>
      <h4>현재 실제 발언권</h4>
      ${weightRows}${weightSub}
      <h4>업종마다 발언권도 달라질 수 있습니다</h4>
      <p>반도체에서 잘 맞는 분석가와 금융에서 잘 맞는 분석가가 다를 수 있기 때문입니다. 단, 업종 표본이 적을 때는 그대로 믿지 않습니다 — 업종 채점 표본이 200건 이상일 때만 업종값을 만들고, 그때도 전역값과 부드럽게 섞어(표본이 적을수록 전역 쪽으로) 과적합을 줄입니다.</p>
      <h4>계산법이 바뀌면 과거 성적도 구분합니다</h4>
      <p>계산법이 바뀌었는데 이전 성적을 그대로 가져와 새 모델이 이미 검증된 것처럼 보이게 하지 않습니다. 새 버전의 채점 표본이 기준을 채우기 전까지는 이전 안정 가중치를 그대로 쓰고, 성적표에서도 현재 버전과 이전 버전을 나눠 보여줍니다.</p>
    `)}
    ${acc('mlb-final','최종 판단은 어떻게 하나요?',`
      <p>CHIEF는 <b>각 분석가 점수 × 현재 발언권</b>을 합산합니다. 특정 분석가의 데이터가 없으면 가짜 50점으로 채우지 않고, 그 분석가를 제외한 뒤 남은 분석가의 발언권을 다시 100%로 정규화합니다.</p>
      <p>그 다음 RISK 감점을 적용하고, 종합점수가 <b>63점 이상이면 BUY</b>, <b>47점 미만이면 SELL</b>, 그 사이는 HOLD입니다. 고변동성인데 시장 전체가 동반 반등하는 국면에서는 SELL 확정 기준을 40점으로 낮춰(= SELL이 더 어려워지게) 약세 신호만으로 SELL을 확정하지 않습니다.</p>
      <p>판단에 쓸 수 있는 분석축이 2개 미만이면 가짜 HOLD를 만들지 않고 <b>판단 보류(JUDGMENT_WITHHELD)</b>로 처리합니다. 보류는 적중률 계산에서도 제외됩니다.</p>
    `)}
    ${acc('mlb-dart','공시(DART)는 어떻게 쓰나요?',`
      <p><b>DART 연결됨 · 현재 직접적인 BUY/SELL 방향점수로 사용하지 않습니다.</b></p>
      <p>현재 역할은 공식 공시 맥락 확인, 재무자료 신선도 확인, 안전 확인(게이트)입니다. “좋은 공시 +10점” 같은 방향점수는 검증 전이라 넣지 않습니다 — 그 검증이 바로 연구모델 C의 역할입니다.</p>
    `)}
    ${acc('mlb-diff','다른 모델과 차이 · 현재 한계',`
      <ul>
        <li><b>시간축</b> — 기본모델은 Production 기준 하나의 종합판단을 냅니다. 연구모델은 5·20·60거래일을 분리합니다.</li>
        <li><b>QUANT 역할</b> — 기본모델의 QUANT는 방향점수를 내는 투표자, 연구모델의 QUANT는 점수를 내지 않는 통계 심판입니다.</li>
        <li><b>가중치</b> — 기본모델은 실제 성적으로 발언권을 조정하고, 연구모델은 사전 선언한 Candidate를 동결한 채 기록합니다.</li>
      </ul>
      <p><b>현재 한계와 다음 단계</b> — 2026-08-15 개선판의 성적은 이전 버전과 분리해 새로 쌓는 중이라 표본이 아직 적습니다. DART는 맥락으로만 쓰고 방향점수 근거는 연구모델 C에서 먼저 검증합니다. 발언권 학습도 새 버전 표본이 기준을 채운 뒤에만 새로 학습합니다.</p>
    `)}`;

  PANEL.research_a=()=>`
    <h4 class="ml-title">GAEO 연구모델 A</h4>
    <p class="ml-oneline">“투자기간을 서로 다른 문제로 보면 더 정확할까?” — 하나의 종합판단 대신 5거래일 · 20거래일 · 60거래일을 서로 다른 문제로 나눠 판단하는 첫 연구모델입니다.</p>
    <dl class="ml-facts">
      <dt>현재 상태</dt><dd>${esc((mA&&mA.statusLabel)||'그림자 시험')} — 화면 판단을 바꾸지 않습니다</dd>
      <dt>서비스 반영</dt><dd>미반영 (기록만) · 자동승격 없음</dd>
      <dt>핵심 질문</dt><dd>5·20·60거래일 분리가 하나의 종합판단보다 더 좋은가</dd>
      <dt>기록</dt><dd>${recLine(mA)}${mA&&mA.internalVersion?` · <code>${esc(mA.internalVersion)}</code> 동결`:''}</dd>
    </dl>
    ${acc('mla-how','어떻게 판단하나요?',`
      <p>기간마다 <b>다른 기술지표 세트</b>를 씁니다. 같은 TARO 점수 하나를 5/20/60일에 돌려쓰지 않습니다.</p>
      <ul>
        <li><b>5D TARO</b> — MA5 · 최근 5일 수익률 · RSI · MACD · 거래량</li>
        <li><b>20D TARO</b> — MA20 · MA60 · 20·60 교차 · 52주 위치 · MACD</li>
        <li><b>60D TARO</b> — MA120 · MA200 · 52주 위치</li>
      </ul>
      <p><b>DIANA</b>는 현재 확보 가능한 PER · PBR · ROE 등 가치 기반 지표를 쓰고, 없는 연구 지표를 0이나 50으로 채우지 않습니다. <b>FLOW</b>는 수급 강도 · 지속성 · 매집/분배를 씁니다.</p>
      <p><b>QUANT는 기본모델과 완전히 다릅니다.</b> 방향점수를 내지 않는 <b>통계 심판</b>으로, 과거 시점 기준(Point-in-Time) 표본과 표본 품질을 확인하고, 사용 가능한 분석축과 빠진 지표를 기록합니다.</p>
      <p>최종 Candidate는 2개 — ① 균등 가중 ② 사전 선언 TARO 45 / FLOW 35 / DIANA 20. 상승확률이 0.58 이상이면 <b>매수 검토</b>, 0.42 이하면 <b>매도 검토</b>, 그 사이는 <b>관망</b>이고, 경계선 ±0.04 안쪽은 확신 부족으로 관망 처리합니다. 예: 5D 매수 검토 · 20D 관망 · 60D 매도 검토처럼 기간별로 다른 답이 나올 수 있습니다.</p>
      <p class="ml-note">⚠️ A의 확률(probability)은 실제 적중률로 보정(calibration)된 확률이 아닙니다. 60D는 산출·기록만 하고 성능은 아직 말하지 않습니다.</p>
    `)}
    ${acc('mla-diff','기본모델과 차이',`
      <ul>
        <li>기본모델: 하나의 종합판단 · QUANT가 방향점수 투표 · 발언권을 성적으로 조정</li>
        <li>연구 A: 5/20/60 분리 판단 · QUANT는 통계 심판 · 사전 선언 Candidate를 동결</li>
      </ul>
    `)}
    ${acc('mla-limit','현재 한계',`
      <p>A v1.0은 5D에서 <b>단기 반전 가설</b>(최근 5일 급등을 다음 5일에 불리하게 보는 쪽)을 하나로 확정해서 선택했습니다. “단기 반전이 존재할 수 있다”와 “모든 종목에서 5일 수익률 부호를 뒤집으면 예측력이 높다”는 다른 주장인데, v1.0은 후자를 가정한 셈입니다 — 이 문제의식이 연구모델 B를 만들었습니다.</p>
    `)}
    ${acc('mla-next','앞으로 무엇을 검증하나요?',`
      <p>A 자체를 결과를 보고 수정하지 않습니다. 좋든 나쁘든 <b>동결된 Candidate</b>로 미래 성적을 계속 기록해서, “기간 분리가 종합판단보다 나은가”를 실제 기록으로 확인합니다.</p>
    `)}`;

  PANEL.research_b=()=>`
    <h4 class="ml-title">GAEO 연구모델 B</h4>
    <p class="ml-oneline">정답을 미리 고르지 않고 여러 가설을 동시에 시험합니다. A가 선택했던 단기 반전 가설이 정말 맞는지 확인하기 위해, 반전과 모멘텀을 같은 조건에서 나란히 시험합니다.</p>
    <dl class="ml-facts">
      <dt>현재 상태</dt><dd>${esc((mB&&mB.statusLabel)||'그림자 시험')} — 화면 판단을 바꾸지 않습니다</dd>
      <dt>서비스 반영</dt><dd>미반영 (기록만) · 자동승격 없음</dd>
      <dt>대표 후보</dt><dd><b>없음</b> — 후보 4개를 같은 조건으로 병렬 기록</dd>
      <dt>기록</dt><dd>${recLine(mB)}${mB&&mB.internalVersion?` · <code>${esc(mB.internalVersion)}</code> 동결`:''}</dd>
    </dl>
    ${acc('mlrb-what','무엇을 동시에 시험하나요?',`
      <p>단기 가설 2개 × CHIEF 가중 방식 2개 = <b>후보 4개</b>를 같은 판단 시각에 함께 저장합니다.</p>
      <ul>
        <li><b>단기 반전</b> — 최근 5일 강했던 종목이 다음 5일에는 되돌릴 수 있다는 가설</li>
        <li><b>단기 모멘텀</b> — 최근 5일 강했던 종목이 다음 5일에도 강할 수 있다는 가설</li>
        <li><b>균등 가중</b> — 점수가 있는 분석가만 균등 평균</li>
        <li><b>사전 선언 45/35/20</b> — TARO 45 / FLOW 35 / DIANA 20 (최적이라는 근거는 없음 · 결과 보고 조정 금지)</li>
      </ul>
      <p>따라서 후보는 ① 반전×균등 ② 반전×45/35/20 ③ 모멘텀×균등 ④ 모멘텀×45/35/20 — 넷 다 같은 Prediction 시각에 저장돼, 나중에 과거 입력으로 성적을 다시 만드는 일을 막습니다.</p>
    `)}
    ${acc('mlrb-why','왜 대표모델이 없나요?',`
      <p><b>“현재 연구모델 B에는 대표 후보가 없습니다.”</b> <span class="ml-note">(내부 상태: NO_PRIMARY_CANDIDATE_SELECTED)</span></p>
      <p>충분한 미래 기록이 쌓이기 전에 지금 잠깐 좋아 보이는 후보를 우승자로 골라버리면 연구 결과가 왜곡될 수 있기 때문에, 현재는 네 후보를 같은 조건으로 비교하고 있습니다. 자동 우승자 선택도 없습니다.</p>
    `)}
    ${acc('mlrb-diff','A와 무엇이 다른가요?',`
      <p>A는 5D 단기신호를 반전 하나로 확정했지만, B는 반전과 모멘텀을 <b>분리해서 동시에</b> 기록합니다. 45/35/20도 “검증된 가중치”가 아니라 “사전 선언 후보”로만 부릅니다. QUANT 통계도 기간(5/20/60)별로 따로 만듭니다.</p>
    `)}
    ${acc('mlrb-next','앞으로 무엇을 검증하나요?',`
      <p>반전 vs 모멘텀, 균등 vs 45/35/20, 그리고 5/20/60D 각각에서 충분한 미래(Forward) 성적이 쌓인 뒤에 비교합니다. 그 전에는 순위도, 우승자도 없습니다.</p>
    `)}`;

  PANEL.research_c=()=>`
    <h4 class="ml-title">GAEO 연구모델 C</h4>
    <p class="ml-oneline">“공식 공시를 추가하면 실제로 더 나은 판단이 될까?” — 연구모델 B와 같은 판단 조건에 DART 공식 공시 맥락만 추가해, 공시가 실제로 도움이 되는지를 검증하는 모델입니다.</p>
    <dl class="ml-facts">
      <dt>현재 상태</dt><dd>${esc((mC&&mC.statusLabel)||'준비중')} — 화면 판단을 바꾸지 않습니다</dd>
      <dt>서비스 반영</dt><dd>미반영 (기록만) · 자동승격 없음</dd>
      <dt>대표 후보</dt><dd>없음 — B와 같은 후보 4개의 짝을 기록</dd>
      <dt>기록</dt><dd>${recLine(mC)}${mC&&mC.internalVersion?` · <code>${esc(mC.internalVersion)}</code>`:''}</dd>
    </dl>
    ${acc('mlrc-dart','DART를 어떻게 사용하나요?',`
      <p>B의 판단에 다음 정보를 <b>맥락으로만</b> 더합니다: 공시 존재 여부 · 공시 탐지 시각 · 정정 여부 · DART 커버리지 · 공식 재무자료 존재/신선도.</p>
      <p><b>Point-in-Time 원칙</b> — “오전 10시에 낸 판단은 오전 10시까지 실제로 확인된 공시만 봅니다.” 오후 2시에 나온 공시를 오전 10시 판단이 알고 있었던 것처럼 과거 기록에 붙이지 않습니다(시각은 문자열이 아니라 UTC 순간으로 비교).</p>
      <p class="ml-note">“공시 없음”은 “악재 없음”이 아닙니다 — DART는 일반 뉴스 커버리지가 아니기 때문입니다. 없는 재무값은 0이나 50으로 채우지 않고 부분 데이터 상태로 남깁니다.</p>
    `)}
    ${acc('mlrc-pair','왜 B와 짝으로 비교하나요?',`
      <p>먼저 B와 똑같은 대조군을 만들어야, 나중에 <b>DART의 순수한 추가 효과만</b> 분리해서 확인할 수 있기 때문입니다. 연구 B = 비교 기준(대조군), 연구 C = B + DART 맥락.</p>
    `)}
    ${acc('mlrc-now','현재 DART가 점수를 바꾸나요?',`
      <p><b>아니요. 현재 C의 DART는 BUY/SELL 방향점수를 바꾸지 않습니다.</b></p>
      <p>그래서 지금은 B 후보의 방향과 C 짝의 방향이 같게 나오는 것이 <b>정상</b>입니다(기록의 directionIdenticalToPair 표시가 그 뜻입니다 — “이 판단의 방향은 짝인 B와 동일하다”). “DART를 넣었으니 점수가 달라져야 한다”고 억지로 만들지 않습니다. 좋은 공시 +10점, 나쁜 공시 −10점 같은 방향점수는 아직 없습니다.</p>
    `)}
    ${acc('mlrc-next','앞으로 무엇을 검증하나요?',`
      <p>충분한 Forward DART 기록이 쌓인 뒤에 ① 어떤 공시가 실제 예측력이 있는가 ② 공식 재무자료가 도움이 되는가 ③ 방향점수에 넣을 근거가 있는가를 검증합니다. 검증 전에는 DART 방향점수를 추가하지 않습니다.</p>
    `)}`;

  /* ── 글로벌 섹션: 4모델 비교 + 성적 산정 ── */
  const CMP=[
    ['기본모델 개선판','실제 서비스','Production 기준','방향점수 투표','실제 성적으로 조정','Context (방향점수 아님)','있음'],
    ['연구 A','첫 연구설계','5 / 20 / 60','통계 심판','Frozen Candidate 2개','없음','없음 (기록만)'],
    ['연구 B','가설 비교','5 / 20 / 60','통계 심판','Candidate 4개 · 대표 없음','없음','없음 (기록만)'],
    ['연구 C','DART 추가가치 검증','5 / 20 / 60','통계 심판','B와 같은 후보의 짝 · 대표 없음','Point-in-Time Context','없음 (기록만)'],
  ];
  const CMP_HEAD=['모델','역할','시간축(거래일)','QUANT 역할','가중치·후보','DART','실서비스 판단'];
  const cmpTable=`<table class="ml-cmp"><thead><tr>${CMP_HEAD.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${
    CMP.map(r=>`<tr>${r.map((c,i)=>i===0?`<td><b>${c}</b></td>`:`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const cmpCards=`<div class="ml-cmp-cards">${CMP.map(r=>`<div class="ml-cc"><b>${r[0]}</b><ul>${
    r.slice(1).map((c,i)=>`<li>${CMP_HEAD[i+1]} — ${c}</li>`).join('')}</ul></div>`).join('')}</div>`;

  const grading=`
    <p><b>성적은 미래가 지난 뒤에만 확정됩니다.</b> 그날 실제로 저장했던 판단을 그대로 보존한 뒤, 정해진 거래일이 지난 후 실제 가격으로 채점합니다.</p>
    <ul>
      <li>5D · 20D · 60D는 달력일이 아니라 <b>거래일</b>입니다.</li>
      <li>미래 결과를 알고 나서 과거 판단을 새로 만들지 않습니다.</li>
      <li>결과가 아직 안 나온 판단은 <b>PENDING(대기)</b>이며, 실패 0점으로 넣지 않습니다.</li>
      <li>판단 보류도 억지로 실패 처리하지 않습니다(분모에서 제외).</li>
      <li>BUY/SELL 방향판단 성적과 HOLD 성적을 구분해서 봅니다.</li>
      <li>하루 600종목 판단은 600개의 독립 실험이 아닙니다 — 같은 날 판단은 서로 영향을 받으므로, 기록 건수와 함께 <b>판단일 수</b>를 같이 봅니다.</li>
    </ul>
    ${SB&&SB.gradingNote?`<p class="ml-note">${esc(SB.gradingNote)}</p>`:''}`;

  const paneFn=PANEL[ML_SELECTED]||PANEL.base_production;
  const TABS=[['base_production','기본모델 개선판'],['research_a','연구모델 A'],['research_b','연구모델 B'],['research_c','연구모델 C']];
  return `<div class="sc-block model-lab">
    <h3>모델 실험실</h3>
    <p class="sc-sub">같은 시장을 서로 다른 방식으로 판단하고, 실제 미래 결과로 성능을 비교합니다. 연구모델은 화면 판단을 바꾸지 않고, 어떤 모델도 자동으로 승격되지 않습니다.</p>
    <div class="ml-tabs" role="tablist" aria-label="모델 선택">${
      TABS.map(([id,label])=>`<button type="button" class="ml-tab" role="tab" id="mlTab-${id}" aria-selected="${id===ML_SELECTED}" aria-controls="mlPanel" data-mlmodel="${id}">${label}</button>`).join('')}</div>
    <p class="ml-now">현재 선택</p>
    <div id="mlPanel" role="tabpanel" aria-labelledby="mlTab-${ML_SELECTED}">${paneFn()}</div>
    <div class="ml-global">
      ${acc('mlg-compare','4개 모델 한눈에 비교',cmpTable+cmpCards)}
      ${acc('mlg-grading','성적은 어떻게 계산하나요?',grading)}
    </div>
  </div>`;
}
function modelBoardHTML(){
  const SB=(typeof MODEL_SCOREBOARD!=='undefined'&&MODEL_SCOREBOARD)?MODEL_SCOREBOARD:null;
  if(!SB||!Array.isArray(SB.models)) return '';
  const HSTAT={
    'NOT_APPLICABLE':'해당 없음',
    'PENDING_NOT_MATURED':'아직 결과를 기다리는 중',
    'INSUFFICIENT_EVIDENCE':'기록 부족',
    'CANDIDATES_UNDER_TEST':'후보 시험 중',
    'ARCHIVED_NO_NEW_PREDICTIONS':'신규 없음'
  };
  /* 한 Horizon 블록의 BUY/SELL/HOLD 분해 한 줄 — HOLD가 많아 전체 %가 부풀어
     보이는 것을 막기 위해 항상 방향판단(BUY+SELL)을 따로 보여준다. */
  const splitLine=h=>{
    if(!h||h.status!=='OK') return '';
    const seg=(label,b)=>b&&b.count?`${label} ${b.precision!=null?b.precision+'%':'—'}(${b.count}건${b.marketRelativeMeanReturn!=null?` · 시장대비 ${b.marketRelativeMeanReturn>0?'+':''}${b.marketRelativeMeanReturn}%p`:''})`:'';
    const parts=[seg('BUY',h.buy),seg('SELL',h.sell),seg('HOLD',h.hold)].filter(Boolean);
    const dir=h.directionalAccuracy!=null?`방향판단(BUY+SELL) ${h.directionalAccuracy}% · ${h.directionalCount}건`:'';
    return `<li>${[dir,...parts].filter(Boolean).join(' · ')}</li>`;
  };
  const cell=h=>{
    if(!h) return '<span class="mb-na">—</span>';
    if(h.status==='OK'&&h.accuracy!=null){
      const ci=Array.isArray(h.accuracyCI95)?` <span class="mb-ci">${h.accuracyCI95[0]}~${h.accuracyCI95[1]}</span>`:'';
      return `<b>${h.accuracy}%</b>${ci}<span class="mb-sub">${h.matured}건 · ${h.uniqueDates}일</span>`;
    }
    const label=HSTAT[h.status]||h.status||'—';
    const sub=(h.pending?`대기 ${h.pending}건`:'');
    return `<span class="mb-na">${esc(label)}</span>${sub?`<span class="mb-sub">${esc(sub)}</span>`:''}`;
  };
  const rows=SB.models.map((m,i)=>{
    const cands=(m.candidates||[]).length;
    const detail=[
      m.internalVersion?`내부 버전 ${esc(m.internalVersion)}`:'',
      `공시 활용 ${m.usesDart?'예':'아니오'}`,
      `자동 승격 ${m.autoPromotion==='REMOVED'?'제거됨':'없음 (사람이 승인해야 적용)'}`,
      m.uniquePredictionDates?`판단일 ${m.uniquePredictionDates}일 · 기록 ${Number(m.recordCount).toLocaleString()}건`:'기록 없음',
      m.primarySelection==='NO_PRIMARY_CANDIDATE_SELECTED'?`후보 ${cands||4}개 동시 시험 · 대표 후보 없음`:'',
      m.note?esc(m.note):''
    ].filter(Boolean).map(t=>`<li>${t}</li>`).join('');
    const fails=(m.failureReasons||[]).map(r=>`<li>${esc(r)}</li>`).join('');
    /* 기본모델: 현재 버전과 이전 버전(2026-08-15 개선 전) 성적을 섞지 않고 나란히 */
    let versionRows='';
    if(m.id==='base_production'&&m.byModelVersion){
      const label=v=>v==='PRE_HOTFIX_BASE'?'이전 버전 (8/15 개선 전)':(v===m.currentModelVersion?'현재 버전':esc(v));
      versionRows=Object.entries(m.byModelVersion).map(([v,h])=>{
        if(h.status==='OK'){
          return `<li><b>${label(v)}</b> · 전체 ${h.overallAccuracy}% (${h.matured.toLocaleString()}건 · ${h.uniqueDates}일)${h.accuracyCI95?` · 95% 범위 ${h.accuracyCI95[0]}~${h.accuracyCI95[1]}%`:''}</li>`+splitLine(h);
        }
        return `<li><b>${label(v)}</b> · ${esc(HSTAT[h.status]||h.status)}${h.pending?` · 대기 ${h.pending.toLocaleString()}건`:''}</li>`;
      }).join('');
      if(m.withheldCount) versionRows+=`<li>판단 보류 ${m.withheldCount}건 (적중률 계산에서 제외)</li>`;
      if(m.coverageNote) versionRows+=`<li>${esc(m.coverageNote)}</li>`;
    }
    /* B/C: 후보별 성적 — candidateModelId 사전순 고정(성적순 정렬·1위 표시 없음) */
    const candRows=(m.candidates||[]).filter(c=>c.horizons).map(c=>{
      const h5=c.horizons['5']||{};
      const line=h5.status==='OK'
        ?`5일 ${h5.accuracy}% (${h5.matured}건 · ${h5.uniqueDates}일)`
        :`5일 ${esc(HSTAT[h5.status]||h5.status||'—')}${h5.pending?` · 대기 ${h5.pending}건`:''}`;
      return `<li><code>${esc(c.candidateModelId)}</code> · ${line}</li>`;
    }).join('');
    return `<div class="mb-row${m.status==='ARCHIVED_FAILED_EXPERIMENT'?' mb-archived':''}">
      <button class="mb-head" type="button" aria-expanded="false" data-mb="${i}">
        <span class="mb-name">${esc(m.displayName)}</span>
        <span class="mb-status">${esc(m.statusLabel||'')}</span>
        <span class="mb-h">${cell(m.horizons&&m.horizons['5'])}</span>
        <span class="mb-h mb-h-wide">${cell(m.horizons&&m.horizons['20'])}</span>
        <span class="mb-h mb-h-wide">${cell(m.horizons&&m.horizons['60'])}</span>
        <svg class="mb-chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="mb-body" hidden>
        <ul class="mb-detail">${detail}</ul>
        ${versionRows?`<div class="mb-cands"><b>버전·구간별 실제 성적</b><ul>${versionRows}</ul></div>`:''}
        ${fails?`<div class="mb-fail"><b>물러난 이유</b><ul>${fails}</ul></div>`:''}
        ${candRows?`<div class="mb-cands"><b>후보별 성적 (대표 후보 없음 · 순위 없음)</b><ul>${candRows}</ul></div>`:''}
        <div class="mb-mobile-h">
          <span>5일 ${cell(m.horizons&&m.horizons['5'])}</span>
          <span>20일 ${cell(m.horizons&&m.horizons['20'])}</span>
          <span>60일 ${cell(m.horizons&&m.horizons['60'])}</span>
        </div>
      </div>
    </div>`;
  }).join('');
  /* 공정 비교 — 같은 날짜·같은 종목에서 둘 다 판단한 표본만 직접 비교한다.
     표본이 부족하면 승자 없이 "이릅니다"만 보여준다. */
  const MODEL_LABEL={base_production:'기본모델',research_a:'연구 A',research_b:'연구 B',research_c:'연구 C'};
  const pairName=n=>{const[base,cand]=String(n).split(':');return (MODEL_LABEL[base]||esc(base))+(cand?` <code>${esc(cand)}</code>`:'');};
  const pairs=(SB.pairedComparisons||[]).map(p=>{
    if(p.evidenceStatus==='OK'){
      const d=p.differencePp;
      return `<li>${pairName(p.leftModel)} ${p.leftAccuracy}% vs ${pairName(p.rightModel)} ${p.rightAccuracy}% · 차이 ${d>0?'+':''}${d}%p <span class="mb-sub">공통 ${p.matchedRows.toLocaleString()}건 · ${p.matchedUniqueDates}일</span></li>`;
    }
    return `<li>${pairName(p.leftModel)} vs ${pairName(p.rightModel)} · 아직 차이를 판단하기 이릅니다 <span class="mb-sub">공통 ${p.matchedRows}건 · ${p.matchedUniqueDates}일</span></li>`;
  }).join('');
  return `<div class="sc-block model-board">
    <h3>모델 검증</h3>
    <p class="sc-sub">지금 화면에 쓰는 모델 하나와, 뒤에서 조용히 시험 중인 모델들을 나란히 둡니다. 시험 모델은 화면 판단을 바꾸지 않고, 기록이 충분해지기 전에는 순위를 매기지 않아요.</p>
    <div class="mb-legend"><span>모델</span><span>상태</span><span>5일</span><span class="mb-h-wide">20일</span><span class="mb-h-wide">60일</span></div>
    ${rows}
    ${pairs?`<div class="mb-pairs"><b>공정 비교 — 같은 날짜·같은 종목에서만</b><ul>${pairs}</ul></div>`:''}
    <div class="mb-foot">
      <p>${esc(SB.policyNote||'')}</p>
      <p>${esc(SB.independenceNote||'')}</p>
      <p>순위: ${esc((SB.ranking&&SB.ranking.reason)||'산정 보류')}</p>
    </div>
  </div>`;
}
function scorecardMetrics(scored){
  const hits=scored.filter(r=>r.verdict==='hit');
  const misses=scored.filter(r=>r.verdict==='miss');
  const mids=scored.filter(r=>r.verdict==='mid');
  /* ⚪ 판단 보류는 적중률 분모에서 완전히 뺀다(hit도 miss도 아니다). */
  const withheld=scored.filter(r=>r.verdict==='withheld');
  const graded=scored.filter(r=>r.verdict!=='withheld');
  const uniqueCodes=new Set(graded.map(r=>r.code));
  const uniqueMissCodes=new Set(misses.map(r=>r.code));
  const decided=hits.length+misses.length;
  return {total:graded.length, hitN:hits.length, missN:misses.length, midN:mids.length,
    withheldN:withheld.length,
    uniqueN:uniqueCodes.size, uniqueMissN:uniqueMissCodes.size,
    acc:decided?Math.round(hits.length/decided*100):null};
}
function scorecardVersionSummary(rows){
  const groups={};
  rows.forEach(row=>{
    const version=row.modelVersion || (row.date<'2026-08-04'?'baseline-v1':'baseline-risk-v2');
    (groups[version]||(groups[version]=[])).push(row);
  });
  return Object.entries(groups).map(([version,items])=>{
    const scored=items.map(row=>Object.assign({verdict:scoreCall(row.call,row.ret)},row));
    const dates=items.map(row=>row.date).sort();
    return {version, ...scorecardMetrics(scored), start:dates[0], end:dates[dates.length-1]};
  }).sort((a,b)=>a.start.localeCompare(b.start));
}
function computeWeeklyScorecard(offset){
  const allRows=scAllGradedRows();
  const {start,end}=scWeekRange(offset);
  const weekRows=allRows.filter(r=>r.gradeDate>=start&&r.gradeDate<=end);
  const scored=weekRows.map(r=>Object.assign({verdict:scoreCall(r.call,r.ret)}, r));
  const hits=scored.filter(r=>r.verdict==='hit'), misses=scored.filter(r=>r.verdict==='miss');
  // 같은 종목이 매일 판단·채점되다 보니 하루이틀 차이 판단이 겹쳐 상위권에 몰릴 수 있다 —
  // 종목당 가장 큰 폭 1건만 남겨 서로 다른 종목 3개를 보여준다(그래야 "성적표" 다양성이 산다).
  const dedupTop=(list)=>{
    const byCode=new Map();
    list.forEach(r=>{ const prev=byCode.get(r.code); if(!prev||Math.abs(r.ret)>Math.abs(prev.ret)) byCode.set(r.code,r); });
    return [...byCode.values()].sort((a,b)=>Math.abs(b.ret)-Math.abs(a.ret)).slice(0,3);
  };
  const best=dedupTop(hits);
  const worst=dedupTop(misses);
  // 더 과거로 넘길 수 있는지 — 이번 주간 시작일보다 이전 채점 기록이 남아있는지로 판정
  const hasOlder=allRows.some(r=>r.gradeDate<start);
  const judgementDates=weekRows.map(row=>row.date).sort();
  return {...scorecardMetrics(scored), best, worst, rangeStart:start, rangeEnd:end,
    judgmentStart:judgementDates[0]||null, judgmentEnd:judgementDates[judgementDates.length-1]||null,
    hasOlder, rows:scored};
}
function renderScorecard(){
  const el=document.getElementById('scorecardView'); if(!el) return;
  const wk=computeWeeklyScorecard(SC_WEEK_OFFSET);
  const weekTitle=SC_WEEK_OFFSET===0?'이번 주 (최근 7개 달력일)':`${SC_WEEK_OFFSET}주 전 (최근 7개 달력일)`;

  const weekNav=`<div class="sc-week-nav">
    <button class="sc-week-btn" data-sc-dir="1" ${wk.hasOlder?'':'disabled'} type="button" title="더 이전 주 보기">‹ 이전 주</button>
    <span class="sc-week-label"><b>${weekTitle}</b> · 채점일 ${esc(wk.rangeStart)} ~ ${esc(wk.rangeEnd)} · 판단일 ${esc(wk.judgmentStart||'—')} ~ ${esc(wk.judgmentEnd||'—')}</span>
    <button class="sc-week-btn" data-sc-dir="-1" ${SC_WEEK_OFFSET>0?'':'disabled'} type="button" title="더 최근 주 보기">다음 주 ›</button>
  </div>`;
  const statRow=`<div class="sc-stat-row sc-score-summary">
    <div class="sc-stat"><b>${wk.total}</b><span>채점 완료</span></div>
    <div class="sc-stat"><b style="color:var(--green)">${wk.hitN}</b><span>적중</span></div>
    <div class="sc-stat"><b style="color:var(--red)">${wk.missN}</b><span>빗나감</span></div>
    <div class="sc-stat"><b>${wk.midN}</b><span>중립·판정 유보</span></div>
    <div class="sc-stat"><b>${wk.uniqueN}</b><span>고유 종목</span></div>
    <div class="sc-stat"><b>${wk.uniqueMissN}</b><span>빗나간 고유 종목</span></div>
    <div class="sc-stat"><b>${wk.acc===null?'—':wk.acc+'%'}</b><span>주간 적중률</span></div>
  </div><p class="sc-foot-note">적중률 = 적중 ÷ (적중 + 빗나감) · 중립·판정 유보는 적중률 분모에서 제외됩니다. 같은 종목의 여러 판단과 겹치는 5거래일 채점 구간은 채점 완료 횟수에 각각 포함됩니다.</p>`;

  /* ⭐ 2026-08-14: 콜별 분리 + 시장 대비 + 고확신도 (실측 감사 결과 반영)
     ① 통합 적중률 하나만 보여주니 BUY가 43%로 무너져 있는 걸 몇 달째 못 봤다 → 콜별로 쪼갠다.
     ② HOLD는 ±5% 밖으로 벗어나도 '중립'으로 빠져 적중률이 늘 100%였다 → 엄격 기준을 함께 보여준다.
     ③ 절대수익률은 시장이 오르면 BUY가, 내리면 SELL이 자동으로 맞는다 → 시장 대비 지표를 같이 낸다.
     ④ 확신도 70+ 구간은 실제로 절대 67.5%·시장 대비 56.5%로 유의미하게 높다 → 따로 노출한다. */
  const R=wk.rows||[];
  const callRows=['BUY','HOLD','SELL'].map(c=>{
    const sub=R.filter(r=>r.call===c);
    if(!sub.length) return '';
    const abs=scTally(sub,'ret',true), exc=scTally(sub.filter(r=>r.exc!==null),'exc',true);
    const cls=c==='BUY'?'buy':(c==='SELL'?'sell':'hold');
    return `<tr><td><span class="sc-call-badge ${cls}">${c}</span></td>`+
      `<td class="num">${sub.length.toLocaleString()}</td>`+
      `<td class="num">${abs.acc===null?'—':abs.acc+'%'}</td>`+
      `<td class="num">${exc.acc===null?'—':exc.acc+'%'}</td></tr>`;
  }).join('');
  const bsRows=R.filter(r=>r.call!=='HOLD');
  const bsAbs=scTally(bsRows,'ret',true), bsExc=scTally(bsRows.filter(r=>r.exc!==null),'exc',true);
  const callBlock=R.length?`<div class="sc-block">
    <h3>이번 주 판단 종류별 성적</h3>
    <p class="sc-sub">하나로 합친 적중률은 어느 판단이 잘 맞고 어느 판단이 틀리는지 가려버립니다. 위 주간 구간과 같은 기간을 BUY·HOLD·SELL로 나눠서 그대로 보여드려요.
      <b>시장 대비</b>는 같은 날 분석 종목 전체의 수익률 중앙값을 뺀 값이라, 시장이 통째로 오르내린 효과를 걷어낸 「진짜 종목 선별력」이에요.</p>
    <div class="tbl-scroll"><table class="sc-table"><thead><tr><th>판단</th><th class="num">건수</th><th class="num">적중률</th><th class="num">시장 대비</th></tr></thead>
    <tbody>${callRows}<tr class="sc-total-row"><td><b>BUY+SELL</b></td><td class="num">${bsRows.length.toLocaleString()}</td>
      <td class="num"><b>${bsAbs.acc===null?'—':bsAbs.acc+'%'}</b></td><td class="num"><b>${bsExc.acc===null?'—':bsExc.acc+'%'}</b></td></tr></tbody></table></div>
    <div class="sc-foot-note">HOLD는 「크게 안 움직인다」는 예측이라 ±5%를 벗어나면 빗나감으로 셉니다(예전에는 중립으로 빼서 항상 100%로 나왔어요).
      BUY·SELL은 ±1% 기준입니다. 시장 대비 50%는 「시장 흐름을 걷어내면 동전 던지기와 같다」는 뜻이에요.</div>
  </div>`:'';

  /* 확신도 표는 주간 표본(수십 건)으로는 노이즈가 커서 판단이 안 된다 — "우리가 매긴 확신도가
     쓸모 있나"는 모델 품질 질문이므로 분석가 열전처럼 전체 누적 기록으로 집계한다.
     ⭐ 2026-08-14: 합쳐서 보면 좋아 보이지만(52.5%→67.9%), 이게 표본 88%를 차지하는 SELL이
     견인한 결과이고 BUY만 떼면 확신도가 올라가도 성적이 뚜렷이 좋아지지 않는다는 게 드러나서
     BUY·SELL을 분리해서 보여주는 것으로 바꾼다(위 "판단 종류별 성적"과 같은 취지). */
  const allBS=scAllGradedRows().filter(r=>r.call!=='HOLD');
  const confTable=(rows,cuts)=>cuts.map(cut=>{
    const sub=rows.filter(r=>typeof r.conf==='number'&&r.conf>=cut);
    if(sub.length<20) return '';
    const a=scTally(sub,'ret',true), e=scTally(sub.filter(r=>r.exc!==null),'exc',true);
    const share=rows.length?Math.round(sub.length/rows.length*100):0;
    return `<tr${cut>=Math.max(...cuts)?' class="sc-total-row"':''}><td>${cut===0?'전체':'확신도 '+cut+'% 이상'}</td>`+
      `<td class="num">${sub.length.toLocaleString()}<small style="color:var(--faint)"> (${share}%)</small></td>`+
      `<td class="num">${a.acc===null?'—':a.acc+'%'}</td><td class="num">${e.acc===null?'—':e.acc+'%'}</td></tr>`;
  }).filter(Boolean).join('');
  const confRowsAll=confTable(allBS,[0,55,60,65,70]);
  const confRowsBuy=confTable(allBS.filter(r=>r.call==='BUY'),[0,40,45,50,55,60]);
  const confRowsSell=confTable(allBS.filter(r=>r.call==='SELL'),[0,45,50,55,60,65,70]);
  const confHead=`<thead><tr><th>구간</th><th class="num">건수</th><th class="num">적중률</th><th class="num">시장 대비</th></tr></thead>`;
  const confBlock=confRowsAll?`<div class="sc-block">
    <h3>확신도가 높을수록 잘 맞을까 (전체 누적)</h3>
    <p class="sc-sub">개오팀이 스스로 매긴 판단 확신도를 기준으로 잘라서 채점했어요. 지금까지 쌓인 전체 기록으로 집계합니다(주간 표본은 수십 건뿐이라 우연에 흔들려요).
      <b>합친 표는 착시가 있어요.</b> 표본의 대부분(약 88%)을 SELL 판단이 차지해서, 아래 BUY·SELL을 나눈 표를 함께 봐야 정확합니다.</p>
    <div class="tbl-scroll"><table class="sc-table">${confHead}<tbody>${confRowsAll}</tbody></table></div>
    ${confRowsBuy?`<p class="sc-sub" style="margin-top:16px"><b>BUY만 떼어 보면</b>, 확신도가 올라가도 성적이 합친 표만큼 뚜렷이 좋아지지 않아요.</p>
    <div class="tbl-scroll"><table class="sc-table">${confHead}<tbody>${confRowsBuy}</tbody></table></div>`:''}
    ${confRowsSell?`<p class="sc-sub" style="margin-top:16px"><b>SELL만 떼어 보면</b>, 위 개선 대부분이 여기서 나옵니다.</p>
    <div class="tbl-scroll"><table class="sc-table">${confHead}<tbody>${confRowsSell}</tbody></table></div>`:''}
    <div class="sc-foot-note">BUY·SELL 판단만 집계합니다(HOLD 제외). 확신도가 낮은 판단까지 전부 따라가기보다, 확신이 높다고 표시된 판단을 중심으로 보시는 편이 좋습니다. 투자 권유가 아닙니다.</div>
  </div>`:'';

  /* 🧪 2026-08-14: 확신도 자체를 「분석가 의견 일치도」가 아니라 「판단 종류·점수 구간별
     실측 적중률」로 다시 정의하는 후보(compute_model_intelligence.py의 confidenceModel)를
     그림자로 검증한다. 학습에 안 쓴 구간(test)에서 기존 확신도보다 실제로 더 잘 가르는지
     확인되기 전에는 화면 확신도를 바꾸지 않는다(reboundGuard·v3·순환매와 동일 원칙). */
  let confModelShadow='';
  const CM=(typeof MODEL_INTELLIGENCE!=='undefined'&&MODEL_INTELLIGENCE&&MODEL_INTELLIGENCE.confidenceModel)||null;
  if(CM&&CM.evaluation){
    const ev=CM.evaluation, cand=ev.candidate||{}, base=ev.baseline||{};
    const q=(CM.promotion||{}).qualified;
    const reasons=(CM.promotion||{}).reasons||[];
    /* ⭐ 2026-09-04 정직성 수정 — 예전 화면의 두 가지 문제를 고친다.
       ① "18.5pp vs 4.4pp"처럼 점 추정 두 개만 크게 띄우면 후보가 확실히 낫다고 읽힌다.
          실제로는 날짜 블록 부트스트랩 95% 범위가 -15.2~35.4pp로 0을 포함한다.
          즉 우연으로도 이만큼 나올 수 있다. 범위를 반드시 같이 낸다.
       ② "검증 거래일 10일 (최소 40일 필요)"은 매일 하루씩 차오르는 시계처럼 읽히지만,
          이 값은 매 실행마다 전체 기록을 70:30으로 다시 잘라 뒤쪽 30%에서 세는 값이다.
          지금 비율이면 40일을 채우는 데 전체 판단일이 196일쯤 필요하다. 그 사실을 쓴다. */
    const dsn=CM.evaluationDesign||{};
    const pr=CM.prospective||null;
    const ci=x=>x&&x.ci95?`${x.ci95.lowPp>0?'+':''}${x.ci95.lowPp} ~ ${x.ci95.highPp>0?'+':''}${x.ci95.highPp}pp`:'범위 계산 불가';
    const zeroIn=(cand.ci95&&cand.ci95.includesZero);
    const dc=ev.directionConfound||{};
    const wb=(dc.candidateWithinBuy||{}).tierSpreadPp, ws=(dc.candidateWithinSell||{}).tierSpreadPp;
    const bb=(dc.baselineWithinBuy||{}).tierSpreadPp, bs=(dc.baselineWithinSell||{}).tierSpreadPp;
    confModelShadow=`<div class="sc-block">
      <h3>확신도 공식 재검증</h3>
      <p class="sc-sub">지금 확신도는 분석가 4인의 의견이 얼마나 가까운지만 재요. 대신 <b>「이 점수대 판단이 실제로 몇 % 맞았는가」</b>를 확신도로 쓰는
      후보를 만들어, 계산에 전혀 쓰지 않은 구간에서 어느 쪽이 적중 여부를 더 잘 가르는지 비교합니다.</p>
      <div class="sc-stat-row">
        <div class="sc-stat"><b>${base.tierSpreadPp==null?'—':base.tierSpreadPp+'pp'}</b><span>기존 확신도 판별력<br>95% 범위 ${esc(ci(base))}</span></div>
        <div class="sc-stat"><b>${cand.tierSpreadPp==null?'—':cand.tierSpreadPp+'pp'}</b><span>후보 확신도 판별력<br>95% 범위 ${esc(ci(cand))}</span></div>
        <div class="sc-stat"><b>${ev.testDays||0}일</b><span>지금 검증에 쓰인 날<br>전체 판단 ${dsn.totalDecisionDays||'—'}일 중</span></div>
        <div class="sc-stat"><b class="sc-stat-txt">${q?'승격':'미승격'}</b><span>${q?'화면 확신도에 반영 중':'화면엔 아직 미반영'}</span></div>
      </div>
      ${zeroIn?`<p class="sc-sub" style="margin-top:12px"><b>아직 후보가 더 낫다고 말할 수 없어요.</b>
        후보의 판별력 ${cand.tierSpreadPp}pp는 겉보기엔 크지만, 같은 자료를 날짜 단위로 다시 뽑아 재보면 ${esc(ci(cand))} 사이 어디든 나올 수 있어요.
        이 범위가 0을 지나가면 "그냥 운이었을 가능성"을 지울 수 없다는 뜻이라, 화면 확신도는 바꾸지 않습니다.</p>`:''}
      ${(wb!=null&&ws!=null)?`<div class="tbl-scroll"><table class="sc-table"><thead><tr><th>다시 잰 방식</th><th class="num">기존 확신도</th><th class="num">후보 확신도</th></tr></thead><tbody>
        <tr><td>BUY 안에서만</td><td class="num">${bb==null?'—':bb+'pp'}</td><td class="num">${wb}pp</td></tr>
        <tr><td>SELL 안에서만</td><td class="num">${bs==null?'—':bs+'pp'}</td><td class="num">${ws}pp</td></tr>
      </tbody></table></div>
      <div class="sc-foot-note">후보 확신도는 BUY일 때 ${dc.candidateRangeBuy?dc.candidateRangeBuy.join('~'):'—'}, SELL일 때 ${dc.candidateRangeSell?dc.candidateRangeSell.join('~'):'—'} 범위에 몰려 있어 <b>두 범위가 서로 겹치지 않아요</b>.
        그래서 합쳐 놓은 표에서 "확신도 높은 쪽"을 고르는 일이 사실은 "SELL을 고르는 일"이 돼요. SELL이 BUY보다 잘 맞는 구간에서는 확신도에 아무 정보가 없어도 차이가 커 보입니다.
        위 표는 그 착시를 빼고 같은 방향 안에서만 다시 잰 값이에요.</div>`:''}
      <div class="sc-foot-note">${q?'검증을 통과해 실제 확신도 계산에 쓰이고 있습니다.':
        '아직 승격 기준 미달: '+esc(reasons.join(' · ')||'표본 부족')+'. 데이터가 더 쌓일 때까지 화면 확신도는 기존 방식 그대로입니다.'}
        판별력(pp)은 확신도 상위 1/3과 하위 1/3의 적중률 차이예요. 클수록 그 확신도가 맞을 판단과 틀릴 판단을 실제로 잘 갈라낸다는 뜻이고, 음수면 오히려 거꾸로 작동한다는 뜻이에요.</div>
      ${dsn.type==='RETROSPECTIVE_RESPLIT'?`<div class="sc-foot-note"><b>이 검증일 수는 매일 하나씩 쌓이는 숫자가 아니에요.</b>
        분석을 돌릴 때마다 전체 기록(${dsn.totalDecisionDays||'—'}일)을 날짜순으로 70:30으로 다시 잘라서, 뒤쪽 ${dsn.holdoutSharePct==null?'—':dsn.holdoutSharePct+'%'}만 검증에 씁니다.
        어제 검증에 쓰인 날짜가 오늘은 학습에 쓰일 수도 있어요. 그래서 승격 기준인 40일을 채우려면 전체 판단일이 ${dsn.estimatedTotalDaysForGate?'대략 '+dsn.estimatedTotalDaysForGate+'일은':'훨씬 더'} 쌓여야 합니다.
        "40일 중 ${ev.testDays||0}일 왔다"로 읽으면 안 돼요.</div>`:''}
      ${pr?`<div class="sc-explain"><b>그래서 진짜 시계를 따로 켰어요 (${pr.testDays||0} / 40일)</b>
        <p>위 숫자가 못 미더운 이유는 "시험 문제를 매번 다시 뽑아서" 채점하기 때문이에요. 그래서 <b>판단하는 날 그 자리에서 후보 확신도를 미리 적어 두고,
        5거래일 뒤에 그 적어 둔 값만으로 채점하는</b> 방식을 따로 켰습니다. 미리 적어 둔 답안지를 나중에 고칠 수 없으니, 이 날짜는 진짜로 하루씩 쌓여요.</p>
        <p>${pr.clockStarted
          ? `${esc(String(pr.firstDay||''))}부터 ${esc(String(pr.lastDay||''))}까지 ${pr.testDays}일치(${Number(pr.n||0).toLocaleString()}건)를 모았어요. 40일까지 ${pr.daysRemainingToGate}일 남았습니다.`
          : `아직 <b>0일</b>이에요. 오늘 기록을 시작했으니, 다음 분석부터 하루씩 쌓입니다. 그전까지 "40일 검증을 통과했다"는 말은 쓰지 않습니다.`}</p>
        ${pr.tierSpreadPp!=null?`<p>지금까지 모인 것으로 잰 판별력은 ${pr.tierSpreadPp}pp예요(BUY 안에서 ${pr.tierSpreadWithinBuyPp==null?'—':pr.tierSpreadWithinBuyPp+'pp'} · SELL 안에서 ${pr.tierSpreadWithinSellPp==null?'—':pr.tierSpreadWithinSellPp+'pp'}). 40일이 차기 전에는 참고용입니다.</p>`:''}
      </div>`:''}
    </div>`;
  }

  /* 🔄 2026-08-14: 순환매(업종 로테이션)를 종합판단 v3와 같은 「그림자」 방식으로 성적표에만 올린다.
     업종 신호는 개별 종목 판단(BUY/HOLD/SELL)에 아직 전혀 반영하지 않고, 여기서 성적만 공개로
     쌓는다. rotation_archive.json이 30거래일 이상 누적되고 highConfidenceUnlocked가 열릴 때만
     실전 판단에 개입시킨다(reboundGuard·v3와 동일한 자동 승격 게이트). */
  let rotationShadow='';
  const RS=(typeof ROTATION_SNAPSHOT!=='undefined'&&ROTATION_SNAPSHOT)?ROTATION_SNAPSHOT:null;
  if(RS){
    const hp=RS.horizonPerformance||{};
    const hRows=['1','3','5','20'].map(h=>{
      const p=hp[h]; if(!p||p.hitRate==null) return '';
      return `<tr><td>${h}거래일</td><td class="num">${p.sampleCount==null?'—':p.sampleCount.toLocaleString()}</td>`+
        `<td class="num">${p.hitRate}%</td><td class="num">${p.medianExcessReturn==null?'—':(p.medianExcessReturn>0?'+':'')+p.medianExcessReturn+'%'}</td></tr>`;
    }).filter(Boolean).join('');
    const unlocked=!!(RS.model&&RS.model.highConfidenceUnlocked);
    const rsSample=Math.max(...['1','3','5','20'].map(h=>(hp[h]&&hp[h].sampleCount)||0));
    rotationShadow=`<div class="sc-block">
      <h3>순환매 검증 기록</h3>
      <p class="sc-sub">오늘 가장 강하다고 본 업종이 며칠 뒤에도 실제로 시장보다 잘 갔는지 기록하는 검증입니다.
        아직 실제 종목의 매수·보유·매도 판단에는 반영하지 않고 <b>성적만 쌓고 있습니다.</b>
        기록이 30거래일 이상 쌓이고 기준을 넘길 때만 실제 판단에 반영을 검토합니다.</p>
      <div class="sc-stat-row sc-stat-row-3">
        <div class="sc-stat"><b class="sc-stat-txt">${unlocked?'실전 반영':'검증 중'}</b><span>현재 상태</span></div>
        <div class="sc-stat"><b>${rsSample?rsSample.toLocaleString():'—'}</b><span>평가 표본</span></div>
        <div class="sc-stat"><b class="sc-stat-txt">${esc(String(RS.dataCutoff||'—'))}</b><span>데이터 기준</span></div></div>
      ${hRows?`<div class="tbl-scroll"><table class="sc-table"><thead><tr><th>기간</th><th class="num">표본</th><th class="num">1위 업종 적중률</th><th class="num">시장 대비 중앙값</th></tr></thead><tbody>${hRows}</tbody></table></div>`:''}
      <div class="sc-foot-note">「1위 업종 적중률」= 당시 가장 강하다고 본 업종이 이후 같은 기간 동안 시장 전체(분석 종목 수익률 중앙값)보다 잘 간 비율.
        「시장 대비 중앙값」= 그 업종 종목들이 시장보다 얼마나 더 움직였는지의 중앙값.
        날짜가 겹치는 중첩 표본이라 독립 시행 확률처럼 해석하지 않습니다. 내부 버전 ${esc(String((RS.model&&RS.model.version)||'—'))}.</div>
    </div>`;
  } else if(typeof GaeoFeatures!=='undefined'&&!GaeoFeatures.ready('rotation')){
    // 순환매 자료는 지연 로드 파일이라, 성적표를 처음 열 때는 없다 — 받아온 뒤 한 번만 다시 그린다.
    GaeoFeatures.load('rotation').then(()=>{ if(window.GaeoAnalysisTab==='scorecard'||document.getElementById('scorecardView').classList.contains('on')) renderScorecard(); }).catch(()=>{});
  }
  const bestHtml=wk.best.length
    ? `<div class="sc-calls-head">가장 잘 맞힌 판단</div><div class="sc-call-grid">${wk.best.map(r=>scCallCard(r,'best')).join('')}</div>` : '';
  const worstHtml=wk.worst.length
    ? `<div class="sc-calls-head">가장 크게 빗나간 판단</div><div class="sc-call-grid">${wk.worst.map(r=>scCallCard(r,'worst')).join('')}</div>` : '';
  const weeklyEmpty=wk.total===0
    ? `<div class="sc-empty">이 주간(${esc(wk.rangeStart)} ~ ${esc(wk.rangeEnd)}) 안에 채점이 끝난 판단이 없어요. 판단은 5거래일이 지나야 채점되니, 최근 주라면 조금만 기다려 주세요.</div>`
    : '';
  const weeklyExamples=wk.total>0
    ? `<div class="sc-block"><h3>이번 주 판단 사례</h3>${bestHtml}${worstHtml}</div>`
    : '';
  const versionRows=scorecardVersionSummary(scAllGradedRows());
  const versionLabels={
    'baseline-v1':'기준 모델 v1 · 8/4 이전',
    'baseline-risk-v2':'리스크 반영 v2 · 8/4 이후',
    'baseline-risk-v2.1-rebound-guard':'반등 가드 v2.1',
  };
  const versionHtml=versionRows.length
    ? `<div class="sc-block"><h3>모델 버전별 성적</h3>
      <p class="sc-sub">가중치·리스크 규칙 변경 전후를 섞지 않고 분리해 보여드립니다. 과거 기록에 모델명이 없는 경우에는 2026-08-04 적용일을 기준으로 구분했습니다.</p>
      <div class="sc-stat-row">${versionRows.map(row=>`<div class="sc-stat"><b>${row.acc===null?'—':row.acc+'%'}</b><span>${esc(versionLabels[row.version]||row.version)}<br>${esc(row.start)} ~ ${esc(row.end)} · ${row.total.toLocaleString()}회</span></div>`).join('')}</div>
    </div>` : '';

  // ── 분석가 열전: team_weights.js의 실측 적중률만 사용, 매 사이클 자동 갱신 ──
  let deepDive='';
  const TW=(typeof TEAM_WEIGHTS!=='undefined'&&TEAM_WEIGHTS&&TEAM_WEIGHTS.global)?TEAM_WEIGHTS:null;
  if(TW){
    const acc=TW.global.acc, ids=['taro','diana','nova','flow'];
    const ranked=ids.map(id=>Object.assign({id},acc[id])).sort((a,b)=>(b.acc||0)-(a.acc||0));
    const bars=ranked.map(r=>`<div class="sc-bar-row">
        <div class="sc-bar-nm">${SC_NAME[r.id]}<small>${SC_ROLE[r.id]}</small></div>
        <div class="sc-bar-track"><i style="width:${r.acc||0}%"></i></div>
        <div class="sc-bar-acc">${r.acc==null?'—':r.acc+'%'}</div>
      </div>`).join('');
    const bestA=ranked[0], worstA=ranked[ranked.length-1];
    const team=TW.global.team;
    /* ⭐ 2026-09-04 정직성 수정: 팀 적중률만 크게 적어 두면 "62%나 맞혔다"로 읽힌다.
       실제로는 판단의 대부분이 HOLD이고 HOLD는 ±5%, BUY·SELL은 ±1%로 채점하기 때문에
       "전부 HOLD"라고만 해도 비슷한 점수가 나온다. 그래서 같은 기록·같은 규칙으로
       계산한 기준선(holdBaselineAcc)과 판단 종류별 성적(byCall)을 반드시 함께 낸다.
       숫자가 우리에게 불리해도 그대로 보여준다. */
    const bc=(team&&team.byCall)||{};
    const bcRows=['BUY','HOLD','SELL'].map(c=>{
      const r=bc[c]; if(!r||r.acc==null) return '';
      return `<tr><td>${c}</td><td class="num">${Number(r.n).toLocaleString()}건</td><td class="num">${r.acc}%</td><td class="num">${esc(String(r.band||''))}</td></tr>`;
    }).filter(Boolean).join('');
    const teamNote=(team&&team.acc!=null)
      ? `<div class="sc-team-note">개별 분석가 중 가장 높은 ${SC_NAME[bestA.id]}는 ${bestA.acc}%이고, <b>4인의 점수를 CHIEF가 가중 합산한 팀 판단(BUY/HOLD/SELL)의 적중률은 ${team.acc}%</b>예요(채점 ${team.n.toLocaleString()}건).`
        +(team.holdBaselineAcc!=null
          ? ` 다만 <b>같은 기록을 전부 HOLD로만 채점하면 ${team.holdBaselineAcc}%</b>가 나와요. 즉 지금 팀 판단이 아무것도 안 한 기준선보다 앞선 폭은 <b>${team.liftVsHoldPp>0?'+':''}${team.liftVsHoldPp}%p</b>뿐이에요.`
          : '')
        +` 같은 기록 구간에서 관측된 값이며, 여러 관점을 합치는 방식이 앞으로도 더 정확하다는 증명은 아니에요.</div>`
        +(bcRows?`<div class="tbl-scroll"><table class="sc-table"><thead><tr><th>판단</th><th class="num">채점</th><th class="num">적중률</th><th class="num">채점 잣대</th></tr></thead><tbody>${bcRows}</tbody></table></div>`
          +`<div class="sc-foot-note">채점 잣대가 판단마다 달라요. BUY·SELL은 방향이 ±1%를 넘어야 맞은 걸로 세고, HOLD는 ±5% 안에 머무르면 맞은 걸로 세요. 잣대가 느슨한 HOLD가 전체 채점의 대부분이라, 위 합계 적중률 하나만 보면 실제보다 잘한 것처럼 보여요.</div>`:'')
      : '';
    // 업종별 최고 성적(표본 100건 이상) — 분석가마다 잘 맞는 업종이 다르다는 걸 실측으로 보여준다
    const sectorBest={};
    if(TW.sectors){
      ids.forEach(id=>{
        let top=null;
        for(const sname in TW.sectors){
          const a=TW.sectors[sname].acc&&TW.sectors[sname].acc[id];
          if(!a||a.n<100) continue;
          if(!top||a.acc>top.acc) top={sector:sname, acc:a.acc};
        }
        if(top) sectorBest[id]=top;
      });
    }
    const chips=ids.filter(id=>sectorBest[id]).map(id=>
      `<span class="sc-chip"><b>${SC_NAME[id]}</b>는 ${esc(sectorBest[id].sector)} 업종에서 ${sectorBest[id].acc}%로 가장 잘 맞혀요</span>`
    ).join('');

    deepDive=`<div class="sc-block">
      <h3>분석가 열전: 왜 어떤 분석가는 더 잘 맞을까</h3>
      <p class="sc-sub">역할별 기간으로 채점한 실측 적중률이에요. TARO·QUANT·FLOW는 5거래일, DIANA는 20거래일을 봅니다(표본 ${(TW.global.graded||0).toLocaleString()}건, ${esc(TW.generatedAt||'')} 기준 자동 계산).</p>
      <div class="sc-bars">${bars}</div>
      <p class="sc-explain">재무·기본적 분석은 단기 타이밍보다 기업의 중장기 품질을 보는 도구입니다. 그래서 DIANA는 20거래일 뒤 ±3% 기준으로 따로 채점하고, 종합점수 기본 발언권도 12%로 제한했습니다. 다른 분석가는 5거래일 뒤 ±1% 기준입니다. 표본이 작은 업종 성적은 전역 성적과 섞어 과대평가를 줄입니다.</p>
      ${teamNote}
      ${chips?`<div class="sc-chip-head">업종별로는 승자가 달라요 (표본 100건 이상만 집계)</div><div class="sc-chips">${chips}</div>`:''}
      <div class="sc-foot-note">※ 위 수치는 team_weights.js가 매 사이클 자동으로 재계산하는 실측값이에요. 투자 권유가 아니라 각 분석가의 관점이 어떤 상황에 강한지 참고하는 용도로만 봐주세요.</div>
    </div>`;
  }
  /* 종합판단 v3(내부 calibrated-ensemble-v3) — 2026-08-15 검증 종료·보관된 실패 실험.
     ⚠️ model_registry.py 기준 ARCHIVED_FAILED_EXPERIMENT이고 신규 예측이 중단됐다.
     '평가 중'처럼 보이게 하지 않는다. 기록은 숨기지 않되 접힌 보조 섹션으로 내린다. */
  let modelDive='';
  const MI=(typeof MODEL_INTELLIGENCE!=='undefined'&&MODEL_INTELLIGENCE)?MODEL_INTELLIGENCE:null;
  if(MI){
    const forward=MI.prospective||{}, audit=MI.audit||{}, promotion=MI.promotion||{};
    const patterns=(audit.patterns||[]).filter(row=>row.count>0).slice(0,4).map(row=>
      `<span class="sc-chip"><b>${esc(row.label)}</b> ${Number(row.count).toLocaleString()}건</span>`).join('');
    const reasons=(promotion.reasons||[]).map(reason=>`<li>${esc(reason)}</li>`).join('');
    modelDive=`<div class="sc-block sc-archived">
      <h3>과거 실험 기록</h3>
      <details class="sc-arch-details">
        <summary><span class="sc-arch-name">종합판단 v3</span><span class="sc-arch-status">검증 종료 · 서비스 반영 없음</span></summary>
        <p class="sc-sub">점수 확률교정·오답 중복 보정·시장국면 가중치 등을 시험했지만 <b>기준을 통과하지 못해 서비스 반영 없이 종료된 과거 실험</b>입니다. 현재 GAEO의 실제 판단에는 사용되지 않으며, 새 판단도 만들지 않습니다. 기록은 그대로 보존합니다.</p>
        <div class="sc-stat-row">
          <div class="sc-stat"><b>${forward.n||0}</b><span>검증 판단 표본 (최종)</span></div>
          <div class="sc-stat"><b>${forward.candidateActionPrecision==null?'—':forward.candidateActionPrecision+'%'}</b><span>BUY·SELL 정밀도</span></div>
          <div class="sc-stat"><b>${forward.candidateCoverage==null?'—':forward.candidateCoverage+'%'}</b><span>판단 비율</span></div>
          <div class="sc-stat"><b>${forward.brier==null?'—':forward.brier}</b><span>확률오차</span></div>
        </div>
        ${reasons?`<div class="sc-explain"><b>통과하지 못한 기준</b><ul>${reasons}</ul></div>`:''}
        ${patterns?`<div class="sc-chip-head">오판 원인 분석에서 많이 찾은 조건</div><div class="sc-chips">${patterns}</div>`:''}
        <div class="sc-foot-note">확률오차는 낮을수록 좋습니다(상세 지표명 Brier). 이 실험의 자동 승격 장치는 제거됐고, 유사한 개선을 다시 시도하더라도 새 검증을 처음부터 거칩니다.</div>
      </details>
    </div>`;
  }

  el.innerHTML=`<div class="sc-block">
    <h3>개오 성적표</h3>
    <p class="sc-sub">판단 후 5거래일 뒤 종가로 채점이 끝난 주간 결과예요. 채점 기록이 쌓인 만큼 계속 과거 주로 넘겨볼 수 있어요. 좋은 결과든 아니든 그대로 보여드려요.</p>
    ${weekNav}
    ${statRow}
    ${weeklyEmpty}
  </div>
  ${callBlock}
  ${confBlock}
  ${confModelShadow}
  ${leaderboardHTML()}
  ${weeklyExamples}
  ${versionHtml}
  ${deepDive}
  ${modelLabHTML()}
  ${modelBoardHTML()}
  ${modelDive}
  ${rotationShadow}`;
}
// 주간 페이저(이전 주/다음 주) — el은 매번 새로 그려지지만 컨테이너 자체는 그대로라
// 이벤트 위임으로 한 번만 걸어둔다(vhistory·priceBlockHTML 페이저와 같은 방식).
document.getElementById('scorecardView').addEventListener('click', e=>{
  /* 모델 실험실 — 탭 전환(재렌더)과 상세 펼침(제자리 토글). 열림 상태는 ML_OPEN에 보존. */
  const mlTab=e.target.closest('.ml-tab');
  if(mlTab){
    if(mlTab.dataset.mlmodel && mlTab.dataset.mlmodel!==ML_SELECTED){
      ML_SELECTED=mlTab.dataset.mlmodel;
      renderScorecard();
      const again=document.getElementById('mlTab-'+ML_SELECTED);
      if(again) again.focus();
    }
    return;
  }
  const mlAcc=e.target.closest('.ml-acc-btn');
  if(mlAcc){
    const id=mlAcc.getAttribute('aria-controls');
    const body=id?document.getElementById(id):null;
    if(body){
      const willOpen=body.hidden;
      body.hidden=!willOpen;
      mlAcc.setAttribute('aria-expanded', String(willOpen));
      if(willOpen) ML_OPEN.add(id); else ML_OPEN.delete(id);
    }
    return;
  }
  const mbHead=e.target.closest('.mb-head');
  if(mbHead){
    const body=mbHead.parentElement.querySelector('.mb-body');
    if(body){
      const open=!body.hidden;
      body.hidden=open;
      mbHead.setAttribute('aria-expanded', String(!open));
    }
    return;
  }
  const guideBtn=e.target.closest('.sc-guide-btn');
  if(guideBtn){ goToGuideSection('gb-sec-modelv3'); return; }
  const btn=e.target.closest('.sc-week-btn'); if(!btn||btn.disabled) return;
  SC_WEEK_OFFSET=Math.max(0, SC_WEEK_OFFSET+(+btn.dataset.scDir));
  renderScorecard();
});
// 🧪 종합판단 v3 카드의 "설명 보기" 버튼 → 가이드북의 해당 설명 섹션으로 이동해 펼쳐 보여준다.
function goToGuideSection(anchorId){
  setMode('guide');
  requestAnimationFrame(()=>{
    const sec=document.getElementById(anchorId);
    if(!sec) return;
    sec.open=true;
    sec.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
  });
}

/* ============================================================
   월간 캘린더 + 성적표 (history + 종목 events)
   ============================================================ */
const CAL={y:0,m:0};
(function initCal(){
  const mm=String((LIVE_AN&&LIVE_AN.date)||'').match(/(\d{4})-(\d{2})/);
  const d=mm?new Date(+mm[1],+mm[2]-1,1):new Date();
  CAL.y=d.getFullYear(); CAL.m=d.getMonth();
})();
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// 📈 본문 숫자 한국식 색칠 — 이미 이스케이프된 HTML에서 "부호 붙은 등락 수치"만 골라
//   상승(+)은 빨강(.sgn-u)·하락(−)은 파랑(.sgn-d)으로 감싼다. (한국 증시 관행)
//   · %·%p·포인트·원 단위에 부호가 붙은 경우만 매치 → 날짜(2026-07-16)·가격(25만 5,000원)엔 안 걸린다.
//   · 태그·속성 안에는 「부호+숫자+단위」 패턴이 없어 HTML을 깨지 않는다.
function SIGNUM(html){
  if(html==null) return html;
  return String(html).replace(
    /([+\-−])(\d[\d,]*(?:\.\d+)?)(\s?)(%p|%|포인트|원)/g,
    (m,sg,num,sp,unit)=>'<span class="'+(sg==='+'?'sgn-u':'sgn-d')+'">'+sg+num+sp+unit+'</span>');
}
function collectEvents(){
  // 종목별 일정(analysis.js LIVE_ANALYSIS[code].events)뿐 아니라, 특정 종목에 속하지
  // 않는 매크로 일정(CPI 발표 등)도 market.events에 넣어두면 같이 모은다.
  // market 이벤트는 개별 e.name(예: "🇺🇸 미국 CPI")을 그대로 쓰고, 종목 이벤트는 티커명을 쓴다.
  const out=[];
  if(LIVE_AN) for(const code in LIVE_AN){
    if(code==='date') continue;
    const evs=LIVE_AN[code]&&LIVE_AN[code].events; if(!Array.isArray(evs)) continue;
    const isMarket=code==='market';
    const fallbackName=isMarket?'전체':((STOCKS[code]&&STOCKS[code].name)||code);
    evs.forEach(e=>out.push({date:e.date||null, title:e.title||'', name:e.name||fallbackName}));
  }
  return out;
}
function dayStance(dateStr){
  if(!LIVE_HIST) return null;
  let bull=0,bear=0,any=false;
  for(const code in LIVE_HIST) LIVE_HIST[code].forEach(e=>{
    if(String(e.date).slice(0,10)!==dateStr) return;
    any=true;
    if(e.call==='BUY') bull++; else if(e.call==='SELL') bear++;
  });
  return any ? (bull>bear?'bull':bear>bull?'bear':'neu') : null;
}
function monthChiefEntries(y,m){
  const pre=`${y}-${String(m+1).padStart(2,'0')}`, out=[];
  if(LIVE_HIST) for(const code in LIVE_HIST) LIVE_HIST[code].forEach(e=>{
    if(String(e.date).startsWith(pre)) out.push(Object.assign({code, name:(STOCKS[code]&&STOCKS[code].name)||code}, e));
  });
  return out;
}
/* 📅 다가오는 일정 — 종목별/시장 전체 이벤트(analysis.js LIVE_ANALYSIS[code].events)에서
   오늘 이후 날짜만 모아 가장 가까운 순으로 보여준다. 원래는 홈 화면 우측 레일에 상시
   노출됐으나, 메인 화면을 간결하게 유지하기 위해 캘린더 모드 안으로만 옮겼다(데스크톱·모바일
   공통 — home-dashboard에서는 완전히 빠진다). */
function upcomingEvents(limit){
  const today=new Date(); today.setHours(0,0,0,0);
  const nameOf=code=>(STOCKS[code]&&STOCKS[code].name)||code;
  let evs=[];
  if(LIVE_AN) for(const code in LIVE_AN){
    const blk=LIVE_AN[code];
    if(code==='date'||!blk||!Array.isArray(blk.events)) continue;
    const isMarket=code==='market';
    blk.events.forEach(e=>{
      if(!e||!e.date) return;
      const m=String(e.date).match(/(\d{4})-(\d{2})-(\d{2})/); if(!m) return;
      const d=new Date(+m[1],+m[2]-1,+m[3]);
      if(d>=today) evs.push({d,code:isMarket?null:code,name:isMarket?(e.name||'전체'):nameOf(code),title:e.title||''});
    });
  }
  evs.sort((a,b)=>a.d-b.d);
  return limit?evs.slice(0,limit):evs;
}
function upcomingScheduleHTML(){
  const DOW=['일','월','화','수','목','금','토'];
  const today=new Date(); today.setHours(0,0,0,0);
  const evs=upcomingEvents(8);
  const body=evs.length?evs.map(e=>{
    const isToday=e.d.getTime()===today.getTime();
    const goAttr=e.code?` data-go="${esc(e.name)}"`:'';
    return `<div class="rr-item"${goAttr}>`+
      `<span class="rr-date${isToday?' today':''}">${e.d.getMonth()+1}/${e.d.getDate()}`+
      `<span class="dd">${DOW[e.d.getDay()]}</span></span>`+
      `<span class="rr-body"><span class="rr-name">${esc(e.name)}</span>`+
      `<span class="rr-sub">${esc(e.title)}</span></span></div>`;
  }).join(''):'<div class="rr-empty">예정된 일정이 없습니다.</div>';
  return `<div class="rr-panel cal-upcoming"><div class="rr-title">다가오는 일정<span class="rr-cnt">${evs.length}</span></div>${body}</div>`;
}
function renderCalendar(){
  const el=document.getElementById('calendarView'); if(!el) return;
  const y=CAL.y, m=CAL.m, mLabel=`${y}년 ${m+1}월`;
  const P=code=>STOCKS[code]&&STOCKS[code].price;
  // 성적표
  const ents=monthChiefEntries(y,m);
  const days=new Set(ents.map(e=>String(e.date).slice(0,10)));
  // 채점은 전부 '판단 후 5거래일 뒤 종가' 기준 (evalRet) — 미확정 판단은 집계 제외
  let hit=0,miss=0,pending=0;
  ents.forEach(e=>{ if(!e.base) return; const ev=evalRet(e.code,e); if(!ev){pending++;return;} const s=scoreCall(e.call,ev.pct); if(s==='hit')hit++; else if(s==='miss')miss++; });
  const acc=(hit+miss)>0?Math.round(hit/(hit+miss)*100):null;
  let best=null,worst=null;
  ents.forEach(e=>{ if(!e.base||e.call==='HOLD') return; const ev=evalRet(e.code,e); if(!ev) return; const r=ev.pct, vind=e.call==='BUY'?r:-r;
    if(!best||vind>best.vind) best={name:e.name,call:e.call,r,vind};
    if(!worst||vind<worst.vind) worst={name:e.name,call:e.call,r,vind}; });
  const lb={}; LB_IDS.forEach(id=>lb[id]={h:0,mi:0});
  ents.forEach(e=>{ if(!e.base) return; const ev=evalRet(e.code,e); if(!ev) return; const r=ev.pct;
    LB_IDS.forEach(id=>{ const a=e[id]; if(!a||!a.stance||a.stance==='neu') return; const s=scoreStance(a.stance,r); if(s==='hit')lb[id].h++; else if(s==='miss')lb[id].mi++; }); });
  let mvp=null;
  LB_IDS.forEach(id=>{ const n=lb[id].h+lb[id].mi; if(n<3) return; const a=Math.round(lb[id].h/n*100); const A=(typeof AGENTS!=='undefined')&&AGENTS.find(x=>x.id===id); if(!mvp||a>mvp.acc) mvp={name:A?A.name:id,acc:a}; });
  const pf=loadPortfolio(); let pCost=0,pVal=0;
  Object.entries(STOCKS).forEach(([c,d])=>{const h=pf[c]||{},q=+h.qty||0,av=+h.avg||0; if(q>0&&d.price&&av>0){pVal+=q*d.price;pCost+=q*av;}});
  const pPl=pVal-pCost, pPct=pCost>0?pPl/pCost*100:0;
  const fmtCall=x=>x?`${x.name} ${x.call} → ${x.r>0?'+':''}${x.r.toFixed(1)}% · ${x.vind>0?'검증':'미검증'}`:'—';
  const report=`<div class="cal-report"><h3>${mLabel} 성적표</h3><div class="cal-rgrid">
    <span>분석한 날 <b>${days.size}</b>일 · 기록 <b>${ents.length}</b>건${pending?` (⏳평가중 ${pending})`:''}</span>
    <span>팀 적중률 <b>${acc===null?'—':acc+'%'}</b> <span style="font-size:10px;color:var(--faint)">5거래일 뒤 종가 기준</span></span>
    <span>MVP <b>${mvp?`${mvp.name} ${mvp.acc}%`:'표본 부족'}</b></span>
    <span>최고 콜 <b>${fmtCall(best)}</b></span>
    <span>아쉬운 콜 <b>${(worst&&worst!==best)?fmtCall(worst):'—'}</b></span>
    ${pCost>0?`<span>내 포트폴리오 <b style="color:${pPl>0?'var(--krup)':pPl<0?'var(--krdn)':'var(--ink)'}">${pPl>0?'+':''}${won(pPl)} (${pPct>0?'+':''}${pPct.toFixed(1)}%)</b></span>`:''}
  </div></div>`;
  // 달력
  const startDow=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate();
  const pre=`${y}-${String(m+1).padStart(2,'0')}`, evByDay={};
  collectEvents().forEach(e=>{ if(e.date&&e.date.startsWith(pre)) (evByDay[e.date]=evByDay[e.date]||[]).push(e); });
  const t=new Date(), todayStr=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
  let grid=['일','월','화','수','목','금','토'].map(d=>`<div class="cal-dow">${d}</div>`).join('');
  for(let i=0;i<startDow;i++) grid+='<div class="cal-cell empty"></div>';
  for(let d=1;d<=dim;d++){
    const ds=`${pre}-${String(d).padStart(2,'0')}`, st=dayStance(ds)||'', evs=evByDay[ds]||[];
    const evHtml=evs.map(e=>`<div class="cal-ev" title="${esc(e.name+': '+e.title)}">${esc(e.name)} ${esc(e.title)}</div>`).join('');
    const hasEv=evs.length>0;
    grid+=`<div class="cal-cell ${st} ${ds===todayStr?'today':''} ${hasEv?'has-ev':''}" ${hasEv?`data-ds="${ds}"`:''}><span class="cal-dnum">${d}</span>${evHtml}${hasEv?'<span class="cal-more">터치해서 보기</span>':''}</div>`;
  }
  const undated=collectEvents().filter(e=>!e.date);
  const issues=undated.length?`<div class="cal-issues"><h4>주요 이슈 (날짜 미정)</h4>`+
    undated.map(e=>`<div class="cal-issue"><span class="ci-stock">${esc(e.name)}</span> ${esc(e.title)}</div>`).join('')+`</div>`:'';
  // 💰 배당 캘린더 — 개별 종목의 정확한 배당락일 데이터는 없어서(과장·오류 방지),
  // ①국내 상장사 배당 시기에 대한 일반 사실 안내 + ②data.js의 실측 배당수익률(div) 상위 종목만 정직하게 보여준다.
  const divRanked=Object.entries(STOCKS)
    .map(([code,s])=>({code,name:s.name,div:s.div}))
    .filter(x=>x.div!=null&&x.div>0)
    .sort((a,b)=>b.div-a.div)
    .slice(0,10);
  const divSection=`<div class="cal-div"><h4><svg class="sec-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h16v11H4zM4 11h16M8 4.5v3M16 4.5v3"/></svg>배당 캘린더</h4>
    <div class="cal-div-note">국내 상장사 대다수는 <b>12월 결산배당</b>이라 배당락일이 보통 12월 마지막 개장일 근처예요(회사마다 공시로 확정). 정확한 배당락일·배당금은 각 회사 공시를 꼭 확인하세요 — 아래는 종목별 정확한 날짜 대신, 현재 시세 기준 <b>실측 배당수익률 상위 종목</b>이에요.</div>
    ${divRanked.length?divRanked.map((x,i)=>`<div class="cal-div-row"><span class="cal-div-rank">${i+1}</span><span class="cal-div-nm" data-nm="${esc(x.name)}">${esc(x.name)}</span><span class="cal-div-yld">${x.div}%</span></div>`).join('')
      :'<div class="cal-div-row"><span class="cal-div-nm" style="color:var(--faint)">배당수익률 데이터가 아직 없어요.</span></div>'}
  </div>`;
  el.innerHTML=upcomingScheduleHTML()+report+
    `<div class="cal-nav"><button id="calPrev">‹</button><span class="cal-title">${mLabel}</span><button id="calNext">›</button></div>`+
    `<div class="cal-grid">${grid}</div>`+
    `<div class="cal-legend"><span><i style="background:rgba(31,122,77,.5)"></i>BUY 우세</span><span><i style="background:rgba(176,125,26,.5)"></i>혼조</span><span><i style="background:rgba(192,57,43,.5)"></i>SELL 우세</span><span><i style="background:var(--gold)"></i>종목 일정</span></div>`+
    issues+divSection;
  document.getElementById('calPrev').onclick=()=>{ if(--CAL.m<0){CAL.m=11;CAL.y--;} renderCalendar(); };
  document.getElementById('calNext').onclick=()=>{ if(++CAL.m>11){CAL.m=0;CAL.y++;} renderCalendar(); };
  el.querySelectorAll('.cal-cell.has-ev').forEach(c=>{ c.onclick=()=>showDayPopup(c.dataset.ds, evByDay[c.dataset.ds]||[]); });
  el.querySelectorAll('.cal-div-nm[data-nm]').forEach(c=>{ c.onclick=()=>jumpToStock(c.dataset.nm); });
  el.querySelectorAll('.cal-upcoming [data-go]').forEach(c=>{ c.onclick=()=>jumpToStock(c.dataset.go); });
}
/* 날짜 터치 → 그날 일정 전체를 팝업으로 (모바일에서 잘린 일정 확인용) */
function showDayPopup(ds, evs){
  let bg=document.getElementById('daypopBg');
  if(!bg){
    bg=document.createElement('div'); bg.id='daypopBg'; bg.className='daypop-bg';
    bg.onclick=e=>{ if(e.target===bg) bg.classList.remove('on'); };
    document.body.appendChild(bg);
  }
  const st=dayStance(ds);
  const stLabel=st==='bull'?'<span style="color:var(--green)">팀 판단 BUY 우세</span>'
              :st==='bear'?'<span style="color:var(--red)">팀 판단 SELL 우세</span>'
              :st==='neu'?'<span style="color:var(--amber)">팀 판단 혼조</span>':'';
  const items=evs.length
    ? evs.map(e=>`<div class="dp-ev"><b>${esc(e.name)}</b> — ${esc(e.title)}</div>`).join('')
    : '<div class="dp-empty">이날 등록된 종목 일정이 없어요.</div>';
  const [y,m,d]=ds.split('-');
  bg.innerHTML=`<div class="daypop"><h4>${+m}월 ${+d}일</h4>
    <div class="dp-stance">${stLabel}</div>${items}
    <button class="dp-close" onclick="document.getElementById('daypopBg').classList.remove('on')">닫기</button></div>`;
  bg.classList.add('on');
}
const priceAsOf=()=>String(SNAP_DATE).replace(' 수집','');
document.getElementById('hbadge').textContent='홈오피스 · 시세 '+SNAP_DATE;
const trustDataAsOf=document.getElementById('trustDataAsOf');
if(trustDataAsOf) trustDataAsOf.textContent=priceAsOf()+' 기준 · 장중 10~30분 간격 갱신';

/* ── 관심종목: 로그인 없이 이 브라우저에만 가볍게 저장 ── */
const WATCHLIST_KEY='gaeo_watchlist_v1';
const WATCH_SNAPSHOT_KEY='gaeo_watch_snapshot_v1';
function loadWatchlist(){
  try{
    const saved=JSON.parse(localStorage.getItem(WATCHLIST_KEY));
    return Array.isArray(saved)?saved.filter(code=>STOCKS[code]).slice(0,8):[];
  }catch(e){ return []; }
}
function saveWatchlist(codes){
  try{ localStorage.setItem(WATCHLIST_KEY,JSON.stringify(codes.slice(0,8))); }catch(e){}
}
function updateWatchToggle(code){
  const btn=document.getElementById('watchToggle'); if(!btn) return;
  if(!code||!STOCKS[code]){ btn.style.display='none'; btn.dataset.code=''; return; }
  const on=loadWatchlist().includes(code);
  btn.dataset.code=code;
  btn.classList.toggle('on',on);
  btn.textContent=on?'★ 관심종목 저장됨':'☆ 관심종목';
  btn.setAttribute('aria-pressed',on?'true':'false');
  btn.style.display='inline-flex';
}
function currentWatchSnapshot(codes){
  const stocks={};
  codes.forEach(code=>{
    const s=STOCKS[code], entry=analysisEntry(code), chief=entry&&entry.chief;
    stocks[code]={
      name:s.name,
      price:typeof s.price==='number'?s.price:null,
      rate:typeof s.rate==='number'?s.rate:null,
      call:chief&&chief.call||null
    };
  });
  return {date:String(SNAP_DATE||'').slice(0,10),stocks};
}
function renderWatchChange(codes){
  const box=document.getElementById('homeWatchChange');
  if(!box||!codes.length){ if(box) box.style.display='none'; return; }
  const current=currentWatchSnapshot(codes);
  let saved=null;
  try{ saved=JSON.parse(localStorage.getItem(WATCH_SNAPSHOT_KEY)); }catch(e){}
  let baseline={};
  if(saved&&saved.date===current.date&&saved.baseline) baseline=saved.baseline;
  else if(saved&&saved.current) baseline=saved.current;
  codes.forEach(code=>{ if(!baseline[code]) baseline[code]=current.stocks[code]; });
  const up=codes.filter(code=>(current.stocks[code].rate||0)>0).length;
  const down=codes.filter(code=>(current.stocks[code].rate||0)<0).length;
  const changed=codes.filter(code=>baseline[code]&&baseline[code].call&&current.stocks[code].call&&
    baseline[code].call!==current.stocks[code].call);
  const movement=`${codes.length}개 중 ${up}개 상승${down?' · '+down+'개 하락':''}`;
  const nowParts=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const nowPart=type=>(nowParts.find(x=>x.type===type)||{}).value||'';
  const today=`${nowPart('year')}-${nowPart('month')}-${nowPart('day')}`;
  const period=current.date===today?'오늘 변화':'최근 거래일 변화';
  const detail=changed.length
    ?changed.slice(0,2).map(code=>`<button type="button" data-watch-change="${code}">${esc(current.stocks[code].name)} 자동판단 ${esc(baseline[code].call)} → ${esc(current.stocks[code].call)}</button>`).join('<br>')
    :'자동판단은 이전 저장 때와 같아요.';
  box.innerHTML=`<strong>${period} · ${movement}</strong>${detail}`;
  box.style.display='block';
  box.querySelectorAll('[data-watch-change]').forEach(btn=>btn.onclick=()=>{
    const s=STOCKS[btn.dataset.watchChange]; if(s) jumpToStock(s.name);
  });
  try{
    localStorage.setItem(WATCH_SNAPSHOT_KEY,JSON.stringify({date:current.date,baseline,current:current.stocks}));
  }catch(e){}
}
function renderHomeWatchlist(){
  const box=document.getElementById('homeWatchlist'), label=document.getElementById('homeWatchLabel');
  if(!box) return;
  const codes=loadWatchlist();
  if(label) label.textContent=`★ 관심종목${codes.length?' '+codes.length+'개':''}`;
  if(!codes.length){
    box.innerHTML='<span class="home-watch-empty">종목을 검색한 뒤 ☆ 버튼으로 저장해 보세요.</span>';
    renderWatchChange(codes);
    return;
  }
  box.innerHTML=codes.map(code=>{
    const s=STOCKS[code], rate=typeof s.rate==='number'?s.rate:0;
    return `<button class="home-watch-chip" type="button" data-watch-code="${code}">`+
      `<span>${esc(s.name)}</span><span class="${rate>0?'up':(rate<0?'down':'')}">${rate>0?'+':''}${rate.toFixed(2)}%</span></button>`;
  }).join('');
  renderWatchChange(codes);
}
document.getElementById('homeWatchlist').addEventListener('click',e=>{
  const chip=e.target.closest('[data-watch-code]'); if(!chip) return;
  const s=STOCKS[chip.dataset.watchCode]; if(s) jumpToStock(s.name);
});
document.getElementById('watchToggle').onclick=()=>{
  const btn=document.getElementById('watchToggle'), code=btn.dataset.code; if(!STOCKS[code]) return;
  let codes=loadWatchlist();
  const wasOn=codes.includes(code);
  if(wasOn) codes=codes.filter(x=>x!==code);
  else codes=[code,...codes].slice(0,8);
  saveWatchlist(codes);
  if(!wasOn) gaeoTrack('watchlist_add',{stock_code:code,page_type:'stock_analysis'});
  updateWatchToggle(code);
  renderHomeWatchlist();
  if(window.renderGaeoHomeSignals) window.renderGaeoHomeSignals();
  // 📡 레이더의 "관심종목 변화" 블록도 즉시 다시 그린다
  if(window.renderGaeoRadar) try{ window.renderGaeoRadar(); }catch(e){}
};
renderHomeWatchlist();

/* ── 최근 글 화면(latest 모드): 본문 대신 작은 목록만 먼저 받아 모바일 데이터 사용량을 줄인다.
      첫 화면에는 얹지 않고 별도 화면으로 분리해, 홈은 가볍게 유지한다. ── */
(function(){
  const box=document.getElementById('latestHomeList');
  // 이 목록이 비어 있어도 "지금 많이 보는 글" 등 다른 목록이 글을 열 수 있어야 하므로
  // openGaeoPost는 목록 렌더링 성공 여부와 무관하게 항상 먼저 정의한다.
  window.openGaeoPost=async function(mode,id,button){
    gaeoTrack('select_content',{content_type:mode,item_id:id});
    if(button) button.disabled=true;
    try{
      await GaeoFeatures.load(mode);
      setMode(mode);   // 모드가 바뀌면 최근 글 화면은 setMode가 알아서 닫는다
      const opener={news:'openNewsId',study:'openStudyId',lesson:'openLessonId',
        estate:'openEstateId',calc:'openCalcId'}[mode];
      if(opener&&typeof window[opener]==='function') window[opener](id);
    }finally{ if(button) button.disabled=false; }
  };
  // 히어로 버튼·좌측 탭이 함께 쓰는 진입점 — 별도 화면으로 전환한 뒤 맨 위에서 보여준다.
  window.openGaeoLatestPanel=function(){
    setMode('latest');
    const move=()=>window.scrollTo({top:0,behavior:window.GaeoMotionBehavior()});
    requestAnimationFrame(move);
    setTimeout(move,300);   // 홈 대시보드가 사라지며 높이가 바뀐 뒤 한 번 더 맞춘다
  };
  const posts=(typeof LATEST_POSTS!=='undefined'&&Array.isArray(LATEST_POSTS))
    ?LATEST_POSTS.slice().sort((a,b)=>(b.featured?1:0)-(a.featured?1:0)):[];
  if(!box) return;
  if(!posts.length){ box.innerHTML='<span class="home-watch-empty">최신 글 목록을 준비하고 있어요.</span>'; return; }
  box.innerHTML=posts.slice(0,10).map(post=>`<button class="latest-post${post.featured?' is-featured':''}" type="button" data-post-mode="${esc(post.mode)}" data-post-id="${esc(post.id)}">
    <span class="latest-post-meta"><b>${esc(post.label)}</b><span>${esc(post.date)}</span></span>
    <span class="latest-post-title">${post.featured?'<span class="latest-post-pin" aria-label="고정 글">★</span>':''}${esc(post.title)}</span>
  </button>`).join('');
  box.querySelectorAll('.latest-post').forEach(btn=>btn.onclick=async()=>{
    await window.openGaeoPost(btn.dataset.postMode,btn.dataset.postId,btn);
  });
  const homeBtn=document.getElementById('latestPanelClose');
  if(homeBtn) homeBtn.onclick=()=>{
    setMode('single');
    window.scrollTo({top:0,behavior:window.GaeoMotionBehavior()});
  };
})();

/* ── 최근 정밀분석: 전체 원문 Archive 대신 생성된 최신 5건만 첫 화면에서 읽는다. ── */
function renderHomeDeepAnalysis(){
  const box=document.getElementById('homeDeepAnalysisList'); if(!box) return;
  const source=typeof DEEP_ANALYSIS_LATEST!=='undefined'?DEEP_ANALYSIS_LATEST:
    ((typeof window!=='undefined'&&window.DEEP_ANALYSIS_LATEST)||[]);
  const rows=Array.isArray(source)?source.slice(0,5):[];
  if(!rows.length){ box.innerHTML='<div class="hda-empty">최근 정밀분석이 아직 없습니다.</div>'; return; }
  box.innerHTML=rows.map(item=>{
    const date=String(item.date||item.analysisCreatedAt||'').slice(5,10).replace('-','.');
    const summary=typeof item.summary==='string'?item.summary.trim():'';
    return `<a class="hda-row" href="${esc(item.permalink)}">`+
      `<span class="hda-top"><span class="hda-name">${esc(item.stockName||item.ticker)}</span>`+
      `<time class="hda-date" datetime="${esc(String(item.analysisCreatedAt||item.date||''))}">${esc(date)}</time></span>`+
      (summary?`<span class="hda-summary">${esc(summary)}</span>`:'')+
      `</a>`;
  }).join('');
}
renderHomeDeepAnalysis();
// ⭐ 2026-08-14 사용자 지정 — "최근 정밀분석"은 PC에서는 늘 펼쳐진 채로 두고,
// 모바일(≤900px)에서만 헤더를 눌러야 펼쳐지는 버튼으로 바꾼다. 시작 상태는 접힘.
(function(){
  const hda=document.getElementById('homeDeepAnalysis');
  const toggle=document.getElementById('hdaToggle');
  if(!hda||!toggle) return;
  const isMobile=()=>window.matchMedia('(max-width:900px)').matches;
  // 2026-09-03: 이 블록은 홈 브리핑 밖 '최근 정밀분석' 화면(#deepView)으로 옮겨져 항상 펼쳐 둔다.
  //             (홈 브리핑 안에 있을 때만 모바일 접힘을 적용한다.)
  const inBrief=!!hda.closest('.home-daily-brief');
  if(inBrief&&isMobile()){ hda.classList.add('is-collapsed'); toggle.setAttribute('aria-expanded','false'); }
  toggle.onclick=()=>{
    if(!inBrief||!isMobile()) return;   // PC·별도 화면에서는 클릭해도 항상 펼쳐진 상태 유지(토글 없음)
    const collapsed=hda.classList.toggle('is-collapsed');
    toggle.setAttribute('aria-expanded', collapsed?'false':'true');
  };
})();

/* ── 첫 화면 자동 브리핑: 숫자 10분 · 보강 설명 30분 · 열린 화면 5분 확인 ── */
(function(){
  const brief=document.getElementById('homeBrief'), extra=document.getElementById('briefExtra');
  if(!brief) return;
  const initialLive=(typeof LIVE_DATA!=='undefined'&&LIVE_DATA)||null;
  const initialAuto=(typeof HOME_BRIEF!=='undefined'&&HOME_BRIEF)||null;
  const state={brief:null,insight:null,strongSector:null,market:null};

  function summaryFromLive(live){
    if(!live) return null;
    const stocks=live.stocks||{}, rows=Object.values(stocks).filter(x=>typeof x.rate==='number');
    const up=rows.filter(x=>x.rate>0).length, down=rows.filter(x=>x.rate<0).length;
    const flat=rows.length-up-down, idx=live.indices||{};
    const rate=x=>x&&typeof x.rate==='number'?(x.rate>0?'+':'')+x.rate.toFixed(2)+'%':'—';
    const groups={};
    Object.entries(STOCKS).forEach(([code,s])=>{
      const r=stocks[code]&&stocks[code].rate;
      if(typeof r!=='number') return;
      const key=s.sector||'기타'; (groups[key]||(groups[key]=[])).push(r);
    });
    const sectors=Object.entries(groups).filter(x=>x[1].length>=3)
      .map(x=>({name:x[0],rate:x[1].reduce((a,b)=>a+b,0)/x[1].length})).sort((a,b)=>b.rate-a.rate);
    const strong=sectors[0], weak=sectors[sectors.length-1];
    // ⭐ 2026-08-14 사용자 지정 — "업종" 줄이 애매하게 2줄로 넘어가던 걸, 아예 문장을 늘려
    // 두세줄로 자연스럽게 채운다(업종 상승·하락 개수까지 더해 정보량도 늘림).
    const sectorUp=sectors.filter(s=>s.rate>=0).length, sectorDown=sectors.length-sectorUp;
    return {
      sourceAsOf:live.date||'',
      strongSector:strong&&strong.name||null,
      lines:[
        `코스피 ${rate(idx.KOSPI)}, 코스닥 ${rate(idx.KOSDAQ)}로 움직이고 있어요.`,
        `${rows.length}종목 중 상승 ${up}개 · 하락 ${down}개 · 보합 ${flat}개예요.`,
        strong&&weak
          ? `집계된 ${sectors.length}개 업종 중 ${sectorUp}개는 오르고 ${sectorDown}개는 내렸어요. `+
            `가장 강한 업종은 ${strong.name}(${strong.rate>=0?'+':''}${strong.rate.toFixed(2)}%)이고, `+
            `가장 약한 업종은 ${weak.name}(${weak.rate>=0?'+':''}${weak.rate.toFixed(2)}%)이에요.`
          : '업종 흐름을 집계하고 있어요.'
      ]
    };
  }
  function marketFromLive(live){
    if(!live) return null;
    return {
      indices:live.indices||{},
      fx:live.fx||null,
      sourceAsOf:(live.marketBrief&&live.marketBrief.sourceAsOf)||live.date||''
    };
  }
  function insightFromAuto(auto){
    if(!auto||!auto.stocks) return null;
    const counts={BUY:0,HOLD:0,SELL:0}, ranked=[];
    Object.entries(auto.stocks).forEach(([code,item])=>{
      const chief=item&&item.chief; if(!chief) return;
      if(counts[chief.call]!=null) counts[chief.call]++;
      if(typeof chief.total==='number') ranked.push({name:(STOCKS[code]||{}).name||code,total:chief.total});
    });
    ranked.sort((a,b)=>b.total-a.total);
    return {
      generatedAt:auto.generatedAt||'',
      calls:counts,
      lines:[
        `자동 판단 ${counts.BUY+counts.HOLD+counts.SELL}종목은 BUY ${counts.BUY} · HOLD ${counts.HOLD} · SELL ${counts.SELL}이에요.`,
        ranked.length?`종합점수 상위는 ${ranked.slice(0,3).map(x=>x.name).join('·')}예요. 개별 뉴스·공시는 뉴스분석에서 확인해 주세요.`:'자동 판단을 정리하고 있어요.'
      ]
    };
  }
  function stamp(value){
    const m=String(value||'').match(/(\d{4})-(\d{2})-(\d{2}).*?(\d{2}):(\d{2})/);
    return m?{date:`${m[1]}-${m[2]}-${m[3]}`,short:`${m[2]}/${m[3]} ${m[4]}:${m[5]}`,time:`${m[4]}:${m[5]}`}:
      {date:'',short:String(value||'기준시각 확인 중'),time:''};
  }
  function kstParts(now){
    const parts=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',
      day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now||new Date());
    const part=type=>(parts.find(x=>x.type===type)||{}).value||'';
    return {date:`${part('year')}-${part('month')}-${part('day')}`,weekday:part('weekday'),
      time:`${part('hour')}:${part('minute')}`,minutes:(+part('hour')||0)*60+(+part('minute')||0)};
  }
  function renderClock(now){
    const clock=kstParts(now), source=stamp(state.brief&&state.brief.sourceAsOf);
    const weekend=clock.weekday==='토'||clock.weekday==='일';
    const insightAt=stamp(state.insight&&state.insight.generatedAt);
    const insightTime=insightAt.date&&insightAt.time
      ?new Date(`${insightAt.date}T${insightAt.time}:00+09:00`).getTime():0;
    const delayed=!weekend&&insightAt.date===clock.date&&insightTime&&
      ((now||new Date()).getTime()-insightTime)>45*60*1000;
    document.getElementById('briefKicker').textContent='DAILY BRIEF';
    document.getElementById('briefTitle').textContent='현재 기준 브리핑';
    const dateEl=document.getElementById('briefDate');
    const dateParts=(source.date||clock.date).split('-');
    // ⭐ 2026-08-14 사용자 지정 — 장중(평일 09:00~16:00)에도 무조건 "시장 마감"이라고 떠서
    // 헷갈린다는 신고. 장중에는 실제 브리핑 기준 시각(예: "10:52 기준")을 보여주고,
    // 장이 실제로 끝난 뒤(또는 주말)에만 "시장 마감"/"최근 시장"을 쓴다.
    const marketHours=!weekend&&clock.minutes>=540&&clock.minutes<960;
    const statusLabel=weekend?'최근 시장':(marketHours?`${source.time||clock.time} 기준`:'시장 마감');
    if(dateEl) dateEl.textContent=dateParts.length===3
      ?`${Number(dateParts[1])}월 ${Number(dateParts[2])}일 · ${statusLabel}`
      :'시장 마감 기준';
    const waiting=!weekend&&clock.minutes>=540&&clock.minutes<930&&source.date!==clock.date;
    document.getElementById('briefMeta').innerHTML=
      '<span class="brief-live-dot"></span><span>시세 '+esc(source.short)+' 기준</span>'+
      (waiting?'<span>· 새 시세 확인 중</span>':'')+
      (delayed?'<span>· 자동 보강 지연 중</span>':'<span>· 숫자 10분 · 보강 최대 30분</span>');
  }
  function renderMarketTape(){
    const box=document.getElementById('briefMarket'), market=state.market;
    if(!box) return;
    if(!market){
      box.textContent='환율을 불러오는 중이에요.';
      return;
    }
    const value=(n,suffix)=>typeof n==='number'
      ?n.toLocaleString('ko-KR',{minimumFractionDigits:2,maximumFractionDigits:2})+(suffix||''):'—';
    const item=(label,data,suffix)=>{
      if(!data) return `<span class="brief-market-item"><span>${label}</span><strong>—</strong></span>`;
      const rate=typeof data.rate==='number'?data.rate:null;
      const movement=rate==null?'':`<em class="${rate>0?'up':rate<0?'down':''}">`+
        `${rate>0?'▲ +':rate<0?'▼ ':'• '}${Math.abs(rate).toFixed(2)}%</em>`;
      return `<span class="brief-market-item"><span>${label}</span>`+
        `<strong>${value(data.value,suffix)}</strong>${movement}</span>`;
    };
    const asof=stamp(market.sourceAsOf);
    const asofLabel=asof.date&&asof.time?`${asof.date.slice(5)} ${asof.time} 반영`:
      `${asof.short||'기준 시각 확인 중'} 반영`;
    // 2026-09-03 소유자 지시(2차): 코스피·코스닥은 바로 위 #idxPanels에 이미 나오므로
    // 여기서는 그 패널에 없는 원/달러(환율)만 보여준다(위아래 중복 제거).
    box.innerHTML=item('원/달러',market.fx,'원')+
      `<span class="brief-market-asof">${esc(asofLabel)}</span>`;
  }
  function renderHomeBriefDecision(){
    const box=document.getElementById('hdbDecisionBody');
    if(!box) return;
    if(typeof window.GaeoHdbSheetCleanup==='function') window.GaeoHdbSheetCleanup();
    document.body.classList.remove('hdb-sheet-open');
    const persistentBackdrop=document.getElementById('hdbSheetBackdrop');
    if(persistentBackdrop) persistentBackdrop.hidden=true;
    const model=homeBriefDecisionModel(analysisTally());
    const sum=Math.max(1,model.counts.BUY+model.counts.HOLD+model.counts.SELL);
    const width=call=>Math.max(0,model.counts[call]/sum*100);
    const stockRow=(row,index)=>`<button class="hdb-stock-row" type="button" data-hdb-stock="${esc(row.name)}">`+
      `<span class="hdb-rank">${String(index+1).padStart(2,'0')}</span>`+
      `<span class="hdb-stock-main"><span class="hdb-stock-name">${esc(row.name)}</span>`+
      `<span class="hdb-stock-call">BUY · 종합점수</span></span>`+
      `<span class="hdb-stock-score">${Number(row.total)||0}점</span></button>`;
    const preview=model.preview.map(stockRow).join('');
    // ⭐ 2026-08-14 사용자 지정 — PC(넓은 화면)는 미리보기 위 1~3등이 계속 보이는 상태로
    // 패널이 펼쳐지므로 패널 안에서는 4등부터 이어서 보여준다. 모바일은 패널이 화면을
    // 덮는 시트라 미리보기가 가려지므로 1등부터 전체를 그대로 보여준다.
    const fullMobile=model.buy.map(stockRow).join('');
    const fullDesktop=model.buy.slice(3).map((row,i)=>stockRow(row,i+3)).join('')||
      '<div class="hdb-empty">4위 아래 BUY 종목이 없어요.</div>';
    box.innerHTML=`<div class="hdb-decision-head"><strong>오늘의 판단</strong><span>${model.total.toLocaleString('ko-KR')}종목</span></div>`+
      `<div class="hdb-stats" aria-label="오늘의 판단 분포">`+
      ['BUY','HOLD','SELL'].map(call=>`<button class="hdb-stat" type="button" data-hdb-call="${call}" aria-label="${call} ${model.counts[call]}종목"><strong>${model.counts[call]}</strong><span>${call}</span></button>`).join('')+
      `</div><div class="hdb-distribution" aria-hidden="true"><i class="buy" style="width:${width('BUY')}%"></i><i class="hold" style="width:${width('HOLD')}%"></i><i class="sell" style="width:${width('SELL')}%"></i></div>`+
      gaeoCallNoteHTML()+
      (model.buy.length
        ?`<div class="hdb-preview-head"><strong>BUY 상위 종목</strong><span>판단 확신도순</span></div><div class="hdb-preview">${preview}</div>`+
          `<span class="hdb-rank-note">· 판단 확신도가 높은 순으로 정렬했고, 같으면 종합점수 순이에요. 확신도는 지금 판단이 얼마나 또렷한지, 신뢰도는 과거 검증에서 쌓아온 기록이에요.</span>`+
          `<button class="hdb-buy-toggle" id="hdbBuyToggle" type="button" aria-expanded="false" aria-controls="hdbBuyPanel">BUY 전체 ${model.buy.length}종목 보기 →</button>`+
          `<section class="hdb-buy-panel" id="hdbBuyPanel" aria-labelledby="hdbBuyPanelTitle" hidden><div class="hdb-panel-head"><strong id="hdbBuyPanelTitle">BUY 전체 ${model.buy.length}종목</strong>`+
          `<button class="hdb-panel-close" id="hdbPanelClose" type="button" aria-label="목록 닫기">×</button></div><div class="hdb-buy-list" id="hdbBuyList"></div></section>`
        :'<div class="hdb-empty">현재 BUY 판단 종목이 없어요. 불확실한 종목은 HOLD로 남겨 두었어요.</div>');

    box.querySelectorAll('[data-hdb-stock]').forEach(row=>row.onclick=()=>jumpToStock(row.dataset.hdbStock));
    box.querySelectorAll('[data-hdb-call]').forEach(button=>button.onclick=async()=>{
      try{ await window.ensureAutoAnalysis(); }catch(e){}
      SCR.sector='__all__'; SCR.call=button.dataset.hdbCall; SCR.sort='score_desc';
      if(window.setMode) window.setMode('screener');
      document.getElementById('screenerView')?.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
    });
    const toggle=document.getElementById('hdbBuyToggle');
    const panel=document.getElementById('hdbBuyPanel');
    const list=document.getElementById('hdbBuyList');
    const backdrop=document.getElementById('hdbSheetBackdrop');
    const close=document.getElementById('hdbPanelClose');
    const toggleLabel=`BUY 전체 ${model.buy.length}종목 보기 →`;
    const sheetFocusable='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const sheetInerted=new Set();
    let sheetOpen=false;
    const markSheetInert=element=>{
      if(element instanceof HTMLElement&&!element.inert){
        element.inert=true;
        element.dataset.hdbSheetInert='true';
        sheetInerted.add(element);
      }
    };
    const sheetObserver=new MutationObserver(records=>{
      if(!sheetOpen) return;
      records.forEach(record=>record.addedNodes.forEach(node=>{
        if(node instanceof HTMLElement&&!node.contains(panel)&&!panel.contains(node)) markSheetInert(node);
      }));
    });
    sheetObserver.observe(document.body,{childList:true,subtree:true});
    const setSheetBackgroundInert=active=>{
      if(active){
        sheetOpen=true;
        let branch=panel;
        while(branch&&branch!==document.body){
          const parent=branch.parentElement;
          if(!parent) break;
          [...parent.children].forEach(sibling=>{ if(sibling!==branch) markSheetInert(sibling); });
          branch=parent;
        }
        document.querySelectorAll(sheetFocusable).forEach(element=>{
          if(!panel.contains(element)) markSheetInert(element);
        });
      }else{
        sheetOpen=false;
        sheetInerted.forEach(element=>{
          element.inert=false;
          delete element.dataset.hdbSheetInert;
        });
        sheetInerted.clear();
      }
    };
    const closePanel=()=>{
      if(!panel) return;
      panel.hidden=true;
      toggle?.setAttribute('aria-expanded','false');
      if(toggle) toggle.textContent=toggleLabel;
      if(backdrop) backdrop.hidden=true;
      document.body.classList.remove('hdb-sheet-open');
      setSheetBackgroundInert(false);
      toggle?.focus();
    };
    // ⭐ 2026-08-14 사용자 지정 — 닫기(×) 버튼뿐 아니라 여는 데 썼던 "BUY 전체 보기"
    // 버튼을 다시 눌러도 그대로 접히는 진짜 토글로 동작한다.
    if(toggle&&panel) toggle.onclick=()=>{
      if(!panel.hidden){ closePanel(); return; }
      const mobile=window.matchMedia('(max-width:900px)').matches;
      if(list){
        list.innerHTML=mobile?fullMobile:fullDesktop;
        // ⭐ 2026-08-27 버그수정 — 전체 목록은 패널을 열 때가 돼서야 innerHTML로
        // 채워지므로, box 전체에 한 번만 걸어둔 최초 클릭 바인딩(위 preview용)이
        // 이 안의 종목 버튼에는 닿지 않았다(눌러도 반응 없음). 채운 직후 다시 건다.
        list.querySelectorAll('[data-hdb-stock]').forEach(row=>row.onclick=()=>jumpToStock(row.dataset.hdbStock));
      }
      panel.hidden=false;
      toggle.setAttribute('aria-expanded','true');
      toggle.textContent='BUY 목록 접기 ↑';
      panel.setAttribute('role',mobile?'dialog':'region');
      panel.setAttribute('aria-modal',mobile?'true':'false');
      if(backdrop) backdrop.hidden=!mobile;
      document.body.classList.toggle('hdb-sheet-open',mobile);
      setSheetBackgroundInert(mobile);
      close?.focus();
    };
    panel?.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!panel.hidden){ event.preventDefault(); closePanel(); return; }
      if(event.key!=='Tab'||panel.hidden||panel.getAttribute('aria-modal')!=='true') return;
      const focusable=[...panel.querySelectorAll(sheetFocusable)]
        .filter(element=>element.getClientRects().length&&!element.hidden&&!element.inert);
      if(!focusable.length){ event.preventDefault(); panel.focus(); return; }
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){ event.preventDefault(); last.focus(); }
      else if(!event.shiftKey&&document.activeElement===last){ event.preventDefault(); first.focus(); }
    });
    const enforceSheetFocus=event=>{
      if(sheetOpen&&panel.getAttribute('aria-modal')==='true'&&!panel.contains(event.target)) close?.focus();
    };
    document.addEventListener('focusin',enforceSheetFocus);
    window.GaeoHdbSheetCleanup=()=>{
      setSheetBackgroundInert(false);
      sheetObserver.disconnect();
      document.removeEventListener('focusin',enforceSheetFocus);
      window.GaeoHdbSheetCleanup=null;
    };
    if(close) close.onclick=closePanel;
    if(backdrop) backdrop.onclick=closePanel;
  }
  function render(){
    const lines=(state.brief&&state.brief.lines)||[];
    const labels=['시장','확산','업종'];
    brief.innerHTML=lines.length
      ?lines.map((x,i)=>`<div class="brief-line" data-brief-label="${labels[i]||'메모'}"><span>${esc(x).replace(/([+\-]\d+(?:\.\d+)?%)/g,'<span class="bl-num">$1</span>')}</span></div>`).join('')
      :'<p>오늘 시세를 정리하고 있어요.</p>';
    renderMarketTape();
    renderHomeBriefDecision();
    const insightLines=(state.insight&&state.insight.lines)||[];
    if(insightLines.length){
      const at=stamp(state.insight.generatedAt);
      const atLabel=at.date&&at.time?`${at.date} ${at.time}`:(at.short||'확인 중');
      const clock=kstParts(new Date());
      const insightTime=at.date&&at.time?new Date(`${at.date}T${at.time}:00+09:00`).getTime():0;
      const delayed=at.date===clock.date&&insightTime&&(Date.now()-insightTime)>45*60*1000;
      const calls=state.insight.calls;
      const bodyLines=insightLines.slice(calls?1:0,3);
      extra.innerHTML=`<div class="brief-extra-head${delayed?' is-delayed':''}">${delayed?'자동 보강 지연':'자동 보강'} · ${esc(atLabel)} ${delayed?'마지막 생성':'기준'}</div>`+
        bodyLines.map(x=>`<p>${esc(x)}</p>`).join('');
      extra.style.display='block';
    }else extra.style.display='none';
    const sectorBtn=document.getElementById('briefSectorBtn');
    const strong=state.strongSector||(state.brief&&state.brief.strongSector);
    if(strong){
      sectorBtn.dataset.sector=strong;
      sectorBtn.textContent=`${strong} 종목 보기`;
      sectorBtn.style.display='';
    }else sectorBtn.style.display='none';
    renderClock();
  }
  function parseGenerated(text,name){
    const marker='const '+name+' =', start=text.indexOf(marker);
    if(start<0) throw new Error(name+' 시작점을 찾지 못했습니다.');
    const from=text.indexOf('{',start+marker.length), to=text.lastIndexOf('};');
    if(from<0||to<from) throw new Error(name+' 형식을 읽지 못했습니다.');
    return JSON.parse(text.slice(from,to+1));
  }
  async function refreshBrief(){
    try{
      const res=await fetch('data.js',{cache:'no-cache'});
      if(res.ok){
        const live=parseGenerated(await res.text(),'LIVE_DATA');
        state.brief=live.marketBrief||summaryFromLive(live);
        state.market=marketFromLive(live);
        state.strongSector=(summaryFromLive(live)||{}).strongSector||null;
      }
      render();
    }catch(e){ renderClock(); }
  }
  async function refreshInsight(){
    try{
      const res=await fetch('snap/home_brief.js',{cache:'no-cache'});
      if(res.ok){
        const home=parseGenerated(await res.text(),'HOME_BRIEF');
        state.insight=home.marketInsight||null;
        window.GaeoHomeInsight=state.insight;
      }
      render();
      if(window.GaeoRenderMarket) window.GaeoRenderMarket();
    }catch(e){}
  }
  async function refresh(){ await Promise.all([refreshBrief(),refreshInsight()]); }
  state.brief=(initialLive&&initialLive.marketBrief)||summaryFromLive(initialLive);
  state.market=marketFromLive(initialLive);
  state.strongSector=(summaryFromLive(initialLive)||{}).strongSector||null;
  state.insight=(initialAuto&&initialAuto.marketInsight)||null;
  window.GaeoHomeInsight=state.insight;
  render();
  setInterval(refreshBrief,5*60*1000);
  setInterval(refreshInsight,30*60*1000);
  setInterval(()=>renderClock(),60*1000);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) refresh(); });
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape') return;
    const panel=document.getElementById('hdbBuyPanel');
    if(panel&&!panel.hidden) document.getElementById('hdbPanelClose')?.click();
  });
  window.GaeoBrief={refresh,renderClock,renderDecision:renderHomeBriefDecision};
  document.getElementById('briefSectorBtn').onclick=async()=>{
    const sector=document.getElementById('briefSectorBtn').dataset.sector;
    if(!sector) return;
    gaeoTrack('select_content',{content_type:'sector',item_id:sector});
    try{ await window.ensureAutoAnalysis(); }catch(e){}
    SCR.sector=sector; SCR.call='__all__'; SCR.sort='rate_desc';
    setMode('screener');
    document.getElementById('screenerView').scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
  };
  document.getElementById('briefNewsBtn').onclick=async()=>{
    gaeoTrack('select_content',{content_type:'news_category',item_id:'market'});
    await GaeoFeatures.load('news');
    setMode('news');
    if(window.openNewsCategory) window.openNewsCategory('market');
  };
  document.getElementById('briefFullMarketBtn').onclick=()=>{
    gaeoTrack('select_content',{content_type:'full_market',item_id:'home_brief'});
    if(window.openFullMarket) window.openFullMarket();
  };
  // 푸터 "개발 기록" 링크 — 예전엔 별도 정적 페이지(changelog.html)로만 이동했는데,
  // 사이트 메뉴 안(mode-changelog)에서 바로 볼 수 있도록 전환. href는 JS 꺼진 환경·
  // 검색엔진용 대체 경로로 그대로 둔다.
  const footChangelogLink=document.getElementById('footChangelogLink');
  if(footChangelogLink) footChangelogLink.onclick=e=>{
    e.preventDefault();
    gaeoTrack('select_content',{content_type:'home_section',item_id:'changelog'});
    setMode('changelog');
  };

  // 히어로 첫 버튼: 최근 뉴스·공부 자료 10개를 세로로 펼친 패널로 이동한다.
  // (종목 검색은 바로 아래 "내 종목 찾기" 카드가 이미 맡고 있어 중복을 덜었다)
  const heroLatestBtn=document.getElementById('heroLatestBtn');
  if(heroLatestBtn) heroLatestBtn.onclick=()=>{
    gaeoTrack('select_content',{content_type:'home_section',item_id:'latest_posts'});
    if(window.openGaeoLatestPanel) window.openGaeoLatestPanel();
  };
  // "3분 가이드" 카드를 없애면서, 그 카드의 가이드북 진입 버튼(구 #startGuide) 역할을
  // 히어로의 두 번째 버튼(구 "오늘의 변화 보기")이 그대로 이어받는다.
  const heroChangesBtn=document.getElementById('heroChangesBtn');
  if(heroChangesBtn) heroChangesBtn.onclick=()=>{
    gaeoTrack('select_content',{content_type:'home_section',item_id:'guide'});
    beginGuideTutorial('home_dashboard');
    document.getElementById('mode-guide').click();
    const guide=document.getElementById('guideView');
    const move=()=>guide.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
    requestAnimationFrame(move);
    // 가이드 렌더링으로 높이가 바뀐 뒤 한 번 더 위치를 맞춘다.
    setTimeout(move,300);
  };
})();

/* ── 코스피/코스닥 지수 + 시장 분석 (data.js indices · analysis.js market) ── */
// 긴 시장 분석 문장을 문단으로 쪼갠다 — 문장 끝(.?!)+공백마다 <p>로 분리해 가독성↑
// (lookbehind는 iOS<16.4에서 스크립트 전체가 죽으므로 사용하지 않음)
function mkParas(text){
  if(!text) return '';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sents=String(text).replace(/([.!?])\s+/g,'$1\n').split('\n').map(s=>s.trim()).filter(Boolean);
  if(!sents.length) return `<p class="mk-text">${SIGNUM(esc(text))}</p>`;
  return sents.map(s=>`<p class="mk-text">${SIGNUM(esc(s))}</p>`).join('');
}
// 오늘 분석 종합 집계: 첫 화면에서는 경량 스냅샷의 최신 전 종목 집계를 쓰고,
// 자동분석 전체 파일을 내려받은 뒤에는 신선한 정밀분석만 우선해 다시 계산한다.
// 🌐 전체시장 흐름 탭의 업종 펼침에서 쓰는 "GAEO 추적 종목 참고 TOP3" 제공자.
// 전체시장 2,410 구성종목이 아니라 GAEO 600 분석 대상 중에서, 같은 업종의
// 판단 확신도(같으면 종합점수) 상위를 돌려준다. full-market-ui.js가 있으면 쓴다.
window.GaeoFmSectorPicks=function(sectorName){
  try{
    const tally=analysisTally();
    const rows=(tally.ranked||[]).filter(r=>{
      const sec=(STOCKS[r.code]||{}).sector;
      return sec===sectorName&&Number.isFinite(r.confidence);
    });
    rows.sort((a,b)=>(b.confidence-a.confidence)||((b.total||0)-(a.total||0)));
    return rows.slice(0,3);
  }catch(e){ return []; }
};
function analysisTally(){
  const counts={BUY:0,HOLD:0,SELL:0}, ranked=[], seen=new Set();
  const add=(code,e)=>{
    if(seen.has(code)||!e||!e.chief||!e.chief.call) return;
    const c=e.chief.call; if(counts[c]==null) return;
    seen.add(code); counts[c]++;
    ranked.push({code, name:(STOCKS[code]||{}).name||code, total:e.chief.total||0, call:c,
      confidence:typeof e.chief.confidence==='number'?e.chief.confidence:null});
  };
  if(AUTO_AN&&AUTO_AN.stocks){
    for(const code in AUTO_AN.stocks) add(code,analysisEntry(code)||AUTO_AN.stocks[code]);
    if(LIVE_AN) for(const code in LIVE_AN){
      if(/^\d{6}$/.test(code)&&precisionFresh(code)) add(code,LIVE_AN[code]);
    }
  }else{
    const snap=(window.GaeoHomeInsight)||
      ((typeof HOME_BRIEF!=='undefined'&&HOME_BRIEF&&HOME_BRIEF.marketInsight)||null);
    if(snap&&snap.calls){
      for(const call of Object.keys(counts)) counts[call]=Number(snap.calls[call])||0;
      const snapRanked=Array.isArray(snap.ranked)?snap.ranked.filter(x=>
        x&&x.code&&x.call&&typeof x.total==='number').map(x=>({
          code:x.code,name:x.name||(STOCKS[x.code]||{}).name||x.code,total:x.total,call:x.call,
          confidence:typeof x.confidence==='number'?x.confidence:null
        })):[];
      return {counts,buy:snapRanked.filter(x=>x.call==='BUY'),ranked:snapRanked,
        total:counts.BUY+counts.HOLD+counts.SELL,asOf:snap.sourceAsOf||snap.generatedAt||''};
    }
    if(LIVE_AN) for(const code in LIVE_AN){ if(/^\d{6}$/.test(code)) add(code,LIVE_AN[code]); }
  }
  ranked.sort((a,b)=>b.total-a.total);   // 종합점수 높은 순(BUY·HOLD·SELL 전부)
  const buy=ranked.filter(x=>x.call==='BUY');
  return {counts,buy,ranked,total:counts.BUY+counts.HOLD+counts.SELL,
    asOf:(AUTO_AN&&(AUTO_AN.priceLabel||AUTO_AN.generatedAt))||(LIVE_AN&&LIVE_AN.date)||''};
}
function homeBriefDecisionModel(tally){
  const counts={
    BUY:Number(tally&&tally.counts&&tally.counts.BUY)||0,
    HOLD:Number(tally&&tally.counts&&tally.counts.HOLD)||0,
    SELL:Number(tally&&tally.counts&&tally.counts.SELL)||0
  };
  // ⭐ 2026-08-14 사용자 지정 — BUY 상위 종목은 판단 확신도(confidence)가 높은 순서를 최우선으로,
  // 확신도가 같거나 없으면 종합점수(total) 순으로 정렬한다.
  const buy=Array.isArray(tally&&tally.buy)?tally.buy.slice().sort((a,b)=>{
    const ac=Number.isFinite(a.confidence)?a.confidence:-1, bc=Number.isFinite(b.confidence)?b.confidence:-1;
    if(bc!==ac) return bc-ac;
    return (Number(b.total)||0)-(Number(a.total)||0);
  }):[];
  return {counts,total:Number(tally&&tally.total)||counts.BUY+counts.HOLD+counts.SELL,
    buy,preview:buy.slice(0,3),asOf:String(tally&&tally.asOf||'')};
}
// 종목 이동 공통: 어디서든(사이드바 칩·BUY 칩·우측 레일) 종목을 누르면
// 단일분석 모드로 전환 + 시세 카드 즉시 표시·이동, 분석은 아래서 채워짐
function jumpToStock(name){
  const inp=document.getElementById('ticker'); if(!inp) return;
  const selected=resolveStock(name);
  const mb=document.getElementById('mode-single'); if(mb) mb.click();
  /* ⚠️ 위 click()은 "메뉴에서 종목분석을 골랐다"와 같은 경로라 화면을 종목분석 맨 위로
     되돌리려 한다. 여기는 갈 곳(시세 카드)이 따로 있으므로 그 예약을 취소한다.
     이 줄을 지우면 검색으로 들어올 때마다 "종목을 찾아 분석해 보세요"로 튕긴다. */
  if(typeof window.GaeoCancelScrollToMode==='function') window.GaeoCancelScrollToMode();
  inp.value=name;
  showQuote(selected);         // 시세 카드(이름·현재가·지표·차트)를 바로 채운다
  window.__gaeoNoAutoScroll=true;        // 이후 종합판단 viz 자동스크롤 억제(시세 카드 유지)
  // 누르는 즉시 시세 카드로 이동 — html{scroll-behavior:smooth} 때문에 잠깐 즉시이동으로
  const scrollNow=()=>{ const el=document.getElementById('quote'); if(!el) return;
    const de=document.documentElement, prev=de.style.scrollBehavior; de.style.scrollBehavior='auto';
    window.scrollTo(0, Math.max(0, window.scrollY + el.getBoundingClientRect().top - 8));
    de.style.scrollBehavior=prev; };
  scrollNow(); requestAnimationFrame(scrollNow);   // 레이아웃 정착 후 한 번 더(모드전환 반영)
  requestAnimationFrame(()=>document.getElementById('qname')?.focus({preventScroll:true}));
  return analyze();
}
/* ---------- 🌐 MACRO 시장국면 판독 (토큰 0 · 규칙 기반 · CHIEF 확신도 보정) ----------
   최근 코스피 일별 등락률의 표준편차로 "변동성 확대/보통/안정" 국면을 판정한다.
   시장 전체가 급등락하는 주간(예: 이번 주 월-8.95%→화+0.73%→수+6.24%→목-6.37%)엔
   개별 종목 판단의 확실성도 함께 흔들리기 쉬운데, 그 사실을 감추지 않고 확신도(conf)에
   정직하게 반영해 과신을 줄인다. ⚠️ BUY/HOLD/SELL 판단 자체는 절대 바꾸지 않는다 —
   오직 화면에 보여주는 "확신도 숫자"만 보정한다(history.js 채점 기록에는 영향 없음,
   archive_analysis.py는 analysis.js 원본 confidence를 그대로 기록한다).
   renderMarket()·decide() 둘 다 이 값을 즉시 참조하므로 두 함수보다 앞서 선언한다. */
const MACRO_REGIME=(function(){
  const MH=(typeof MARKET_HISTORY!=='undefined'&&MARKET_HISTORY)||{};
  const days=Object.keys(MH).sort();
  const rates=days.map(d=>MH[d]&&MH[d].kospi&&MH[d].kospi.rate).filter(x=>typeof x==='number');
  const idx=(typeof LIVE_DATA!=='undefined'&&LIVE_DATA.indices&&LIVE_DATA.indices.KOSPI)||null;
  const todayKey=(typeof LIVE_DATA!=='undefined'&&LIVE_DATA.date)?String(LIVE_DATA.date).slice(0,10):'';
  if(idx&&typeof idx.rate==='number'&&todayKey&&days[days.length-1]!==todayKey) rates.push(idx.rate); // 아직 히스토리에 안 쌓인 오늘자도 반영
  const recent=rates.slice(-10);
  if(recent.length<3) return {ready:false, damp:1};
  const mean=recent.reduce((s,x)=>s+x,0)/recent.length;
  const vol=Math.sqrt(recent.reduce((s,x)=>s+(x-mean)*(x-mean),0)/recent.length);
  let label,damp;
  if(vol>=4){ label='변동성 확대'; damp=0.82; }
  else if(vol<=1.2){ label='안정'; damp=1; }
  else { label='보통'; damp=0.94; }
  return {ready:true, vol:Math.round(vol*10)/10, n:recent.length, label, damp};
})();
/* RankingChip 헬퍼 — 순위별로 색을 나누지 않고 1·2·3위만 위계 클래스를 붙인다. */
function rankCls(i){ return i===0?' rank1':i===1?' rank2':i===2?' rank3':''; }
/* 접힌 칩을 펼치는 버튼. 초기 노출 개수(shown) 이상일 때만 렌더한다. */
function expandBtn(total,shown,targetId){
  if(total<=shown) return '';
  return `<button type="button" class="bc-expand" data-bc-target="${targetId}"
    aria-expanded="false" aria-controls="${targetId}">전체 ${total}위 보기</button>`;
}
const MARKET_HISTORY_PAGE_SIZE=4;
let marketHistoryPage=1;
let marketHistoryOpen=false;
function renderMarket(){
  const box=document.getElementById('marketBox'); if(!box) return;
  const idx=(typeof LIVE_DATA!=='undefined'&&LIVE_DATA.indices)||null;
  const mk=LIVE_AN&&LIVE_AN.market;
  if(!idx&&!mk) return;
  // 코스피·코스닥·원/달러 수치는 "현재 기준 브리핑" 카드에서만 보여준다.
  // (이 박스는 페이지 최초 로드 시점 LIVE_DATA 기준이라 브리핑 카드의 실시간 폴링 값과
  //  갱신 주기가 달라 숫자가 어긋나 보일 수 있어 중복 표시를 없앴다)
  const hasIdx=!!(idx&&(idx.KOSPI||idx.KOSDAQ));
  if(!hasIdx&&!mk) return;
  let html='';
  // 🌐 시장국면 배지 — 개별 종목을 분석하지 않아도 지금 시장이 얼마나 출렁이는 국면인지 바로 보여준다
  if(MACRO_REGIME.ready){
    // v2.0: 국면별로 색을 나누지 않는다(무지개 금지). 상태는 글자와 점으로만 구분한다.
    html+=`<div class="mk-macro">`+
      `<span class="mk-macro-dot" aria-hidden="true"></span>`+
      `시장국면 「${MACRO_REGIME.label}」 <span class="mk-macro-sub">최근 ${MACRO_REGIME.n}거래일 코스피 표준편차 ${MACRO_REGIME.vol}%p · `+
      (MACRO_REGIME.damp<1?'개별 종목 분석의 확신도를 자동으로 낮춰 보여드려요':'평소와 비슷한 변동성이에요')+`</span></div>`;
  }
  // 📚 날짜별 지난 시장 분석 목차 (market_history.js)
  const MH=(typeof MARKET_HISTORY!=='undefined'&&MARKET_HISTORY)||{};
  const archiveApi=window.GaeoMarketArchive;
  const entries=archiveApi?archiveApi.mergeMarketEntries(MH,mk):[];
  const archivePage=archiveApi
    ? archiveApi.paginateMarketEntries(entries,marketHistoryPage,MARKET_HISTORY_PAGE_SIZE)
    : {items:[],page:1,total:0,totalPages:0};
  marketHistoryPage=archivePage.page;
  if(archivePage.total){
    const rateTag=d=>{
      const r=d&&typeof d.rate==='number'?d.rate:null;
      if(r==null) return '';
      const col=r>0?'var(--krup)':(r<0?'var(--krdn)':'var(--dim)');
      return `<span style="color:${col};font-weight:600">${r>0?'+':''}${r.toFixed(2)}%</span>`;
    };
    const pageButtons=archivePage.totalPages>1
      ? `<nav class="mk-pagination" aria-label="지난 시장 분석 페이지">
          <button type="button" class="mk-page-btn" data-mk-page="${archivePage.page-1}"${archivePage.page===1?' disabled':''} aria-label="이전 페이지">이전</button>`+
          Array.from({length:archivePage.totalPages},(_,i)=>i+1).map(page=>
            `<button type="button" class="mk-page-btn" data-mk-page="${page}"${page===archivePage.page?' aria-current="page"':''} aria-label="${page}페이지">${page}</button>`
          ).join('')+
          `<button type="button" class="mk-page-btn" data-mk-page="${archivePage.page+1}"${archivePage.page===archivePage.totalPages?' disabled':''} aria-label="다음 페이지">다음</button>
        </nav>`
      : '';
    html+=`<div class="mk-hist${marketHistoryOpen?' open':''}">
      <button class="mk-hist-toggle" id="mkHistBtn" aria-expanded="${marketHistoryOpen?'true':'false'}" aria-controls="mkHistBody"><svg class="sec-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 6.5A2 2 0 0 1 5.5 4.5H18a2 2 0 0 1 2 2v13H5.5a2 2 0 0 1-2-2z"/><path d="M8 9h8M8 13h5"/></svg>지난 시장 분석 <span class="mk-cnt">${archivePage.total}일</span><span class="mk-arrow">▾</span></button>
      <div class="mk-hist-body" id="mkHistBody">`+
      archivePage.items.map(m=>{
        const day=m.day;
        return `<div class="mk-day" id="mkday-${day}">
          <button class="mk-day-head" data-mkd="${day}">
            <b>${esc(day)}</b>
            <span class="mk-day-sum">코스피 ${rateTag(m.kospi)} · 코스닥 ${rateTag(m.kosdaq)}</span>
            <span class="mk-click">클릭 <span class="mk-arrow">▸</span></span></button>
          <div class="mk-day-body">`+
            mkParas(m.text)+
            (Array.isArray(m.points)&&m.points.length?'<ul class="mk-points">'+m.points.map(p=>`<li>${SIGNUM(esc(p))}</li>`).join('')+'</ul>':'')+
          `</div></div>`;
      }).join('')+pageButtons+`</div></div>`;
  }

  box.innerHTML=html; box.style.display='block';

  const hb=document.getElementById('mkHistBtn');
  if(hb) hb.onclick=()=>{
    marketHistoryOpen=!marketHistoryOpen;
    hb.setAttribute('aria-expanded',marketHistoryOpen?'true':'false');
    document.querySelector('.mk-hist').classList.toggle('open',marketHistoryOpen);
  };
  box.querySelectorAll('.mk-day-head').forEach(b=>b.onclick=()=>
    document.getElementById('mkday-'+b.dataset.mkd).classList.toggle('open'));
  box.querySelectorAll('.mk-page-btn[data-mk-page]').forEach(btn=>btn.onclick=()=>{
    if(btn.disabled) return;
    marketHistoryPage=Number(btn.dataset.mkPage)||1;
    marketHistoryOpen=true;
    renderMarket();
  });
  box.querySelectorAll('.mk-buychip').forEach(c=>c.onclick=()=>jumpToStock(c.dataset.nm));
  box.querySelectorAll('.bc-expand').forEach(btn=>btn.onclick=()=>{
    const wrap=document.getElementById(btn.dataset.bcTarget); if(!wrap) return;
    const open=wrap.classList.toggle('bc-open');
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.firstChild.textContent=open?'접기':`전체 ${wrap.querySelectorAll('.mk-buychip').length}위 보기`;
  });
}
window.GaeoRenderMarket=renderMarket;
renderMarket();

/* ============================================================
   시장 무드 — 오늘 추적 종목 시세 종합 → 캐릭터/조명/대사에 반영
   ============================================================ */
function computeMood(){
  const st=(typeof LIVE_DATA!=='undefined'&&LIVE_DATA.stocks)?LIVE_DATA.stocks:null;
  const src=st?Object.values(st):Object.values(STOCKS);
  const rates=src.map(s=>s.rate).filter(r=>typeof r==='number');
  if(!rates.length) return {key:'flat',label:'보합',emoji:'➖',avg:0,ups:0,downs:0};
  const avg=rates.reduce((a,b)=>a+b,0)/rates.length;
  const ups=rates.filter(r=>r>0).length, downs=rates.filter(r=>r<0).length;
  let key,label;
  if(avg<=-3){key='crash';label='폭락';}
  else if(avg<-0.4){key='down';label='하락';}
  else if(avg<=0.4){key='flat';label='보합';}
  else if(avg<3){key='up';label='상승';}
  else{key='surge';label='급등';}
  return {key,label,avg,ups,downs};
}
const MOOD=computeMood();
// 무드별 캐릭터 대사 풀
const MOOD_LINES={
  crash:['오늘 왜 이래…','지지선 뚫렸어','물렸다…','존버 각','손절해야 하나','제발 반등…'],
  down:['오늘 좀 빠지네','조정인가?','저가매수 각?','관망하자','눌림목 보자'],
  flat:['잔잔하네','커피나 마시자','눈치 장세','오늘 무난','방향 없네'],
  up:['살살 오르네','기분 좋다','흐름 좋아','가보자','순항 중'],
  surge:['가즈아!','떡상이다!','오늘 잭팟','불장이야!','이 맛에 투자','신난다!']
};
function moodLine(){
  const pool=MOOD_LINES[MOOD.key]||[];
  return (pool.length&&Math.random()<0.62)?pool[(Math.random()*pool.length)|0]
                                          :GREETS[(Math.random()*GREETS.length)|0];
}
// 무드 배지 표시
(function(){
  const el=document.getElementById('moodbadge');
  if(!el) return;
  const sign=MOOD.avg>0?'+':'';
  el.textContent=`오늘 시장 ${MOOD.label} · 평균 ${sign}${MOOD.avg.toFixed(1)}% · 상승 ${MOOD.ups}/하락 ${MOOD.downs}`;
  el.className='mood mood-'+MOOD.key;
})();
// 요약 KPI 카드 (실데이터 기반, 토큰 0)
(function(){
  const el=document.getElementById('kpis'); if(!el) return;
  const n=Object.keys(STOCKS).length;
  const sectors=new Set(Object.values(STOCKS).map(d=>d.sector||'기타')).size;
  const sign=MOOD.avg>0?'+':'';
  // 등락은 방향 클래스(.up/.dn), 적중률은 품질 클래스(.ok/.bad)를 쓴다 — 위 CSS 주석 참고.
  const avgCls=MOOD.avg<-0.4?'dn':MOOD.avg>0.4?'up':'navy';
  // 팀 적중률(전체 기간): CHIEF 판단을 "판단 후 5거래일 뒤 종가"로 채점(리더보드·캘린더와 동일 잣대).
  // 아직 5거래일이 안 지난 판단(평가중)은 집계 제외.
  // ⚠️ 표본 크기는 '건수'가 아니라 '판단일수'로 센다.
  //    같은 날 600종목을 채점하면 건수는 600배로 부풀지만 서로 독립이 아니다
  //    (Constitution statisticalPolicy.independenceUnit = "decision_date").
  //    실제로 2026-08-31 기준 3,463건은 판단일 6일치였다. 건수만 보여주면
  //    "3천 건이나 검증했다"로 읽히므로 판단일수를 반드시 함께 낸다.
  let hit=0, miss=0;
  const gradedDays=new Set();
  if(LIVE_HIST) for(const code in LIVE_HIST) LIVE_HIST[code].forEach(e=>{
    if(!e.base) return;
    const ev=evalRet(code, e);
    if(!ev) return;
    const s=scoreCall(e.call, ev.pct);
    if(s==='hit'||s==='miss') gradedDays.add(String(e.date).slice(0,10));
    if(s==='hit') hit++; else if(s==='miss') miss++;
  });
  // 첫 화면에서는 용량이 큰 history.js/price_history.js를 지연 로드한다.
  // 그때도 적중률이 빈칸이 되지 않도록, 이미 로드된 team_weights.js의 사전 집계값을 사용한다.
  const teamSummary=(typeof TEAM_WEIGHTS!=='undefined'&&TEAM_WEIGHTS&&TEAM_WEIGHTS.global)
    ?TEAM_WEIGHTS.global.team:null;
  let days=gradedDays.size;
  if(hit+miss===0&&teamSummary&&teamSummary.n>0){
    hit=Number(teamSummary.hit)||0;
    miss=Number(teamSummary.miss)||0;
    days=Number(teamSummary.uniqueDecisionDays)||0;
  }
  const graded=hit+miss;
  const acc=graded>0?Math.round(hit/graded*100):null;
  /* ⭐ 2026-09-04 정직성 수정: 예전에는 적중률이 60% 이상이면 무조건 초록(잘함)으로
     칠했다. 그런데 이 채점은 BUY·SELL을 ±1%, HOLD를 ±5%로 재고 실제 판단의 81%가
     HOLD라서, "전부 HOLD"라고만 해도 61.2%가 나온다. 즉 62%라는 숫자 자체는 실력의
     증거가 아니다. 그래서 색은 절대값이 아니라 '아무것도 안 한 기준선보다 얼마나
     나은가(liftVsHoldPp)'로 정한다. 기준선을 3%p 넘게 앞설 때만 초록이다. */
  const holdBase=teamSummary&&teamSummary.holdBaselineAcc!=null?Number(teamSummary.holdBaselineAcc):null;
  /* 차이(lift)는 반올림한 표시값(62%)이 아니라 사전 집계된 정확한 값(62.4%)으로 잰다.
     그러지 않으면 성적표의 +1.2%p와 홈의 +0.8%p가 어긋나 같은 숫자가 두 개로 보인다. */
  const accExact=(teamSummary&&teamSummary.acc!=null&&hit+miss===Number(teamSummary.n))
    ?Number(teamSummary.acc):(graded>0?hit/graded*100:null);
  const lift=(accExact!=null&&holdBase!=null)?Math.round((accExact-holdBase)*10)/10:null;
  const accCls=acc===null?'navy'
    :(lift==null?(acc>=60?'ok':(acc<45?'bad':'navy'))
      :(lift>=3?'ok':(lift<=0?'bad':'navy')));
  // 결론을 말해도 되는 최소 판단일수 — Evolution 성적표가 쓰는 기준과 같은 값을 쓴다.
  const minDays=(teamSummary&&Number(teamSummary.minDaysForConclusion))||20;
  const thin=days>0&&days<minDays;
  const accSub=graded>0
    ? `5거래일 뒤 종가 · 판단 ${days}일 · ${graded.toLocaleString()}건`
      +(holdBase!=null?`<br>전부 HOLD만 해도 ${holdBase}% · 차이 ${lift>0?'+':''}${lift}%p`:'')
      +(thin?`<br><span style="color:var(--amber)">아직 ${minDays}일치가 안 돼 참고용이에요</span>`:'')
    : '평가 데이터 쌓는 중';
  el.innerHTML=
    `<div class="kpi"><div class="k">추적 종목</div><div class="v navy">${n}</div><div class="s">${sectors}개 업종 폴더</div></div>`+
    `<div class="kpi"><div class="k">오늘 평균 등락</div><div class="v ${avgCls}">${sign}${MOOD.avg.toFixed(1)}%</div><div class="s">시장 ${MOOD.label}</div></div>`+
    `<div class="kpi"><div class="k">상승 / 하락</div><div class="v navy">${MOOD.ups} / ${MOOD.downs}</div><div class="s">${n}종목 기준</div></div>`+
    `<div class="kpi"><div class="k">팀 적중률</div><div class="v ${accCls}">${acc===null?'—':acc+'%'}</div><div class="s">${accSub}</div></div>`;
})();

/* ---------- 요일별 평균 등락률 (2026) ----------
   1순위: dow_stats.js(DOW_STATS) — compute_dow_stats.py가 analysis_data.json 일봉(수개월치)에서
          사전계산. 러너가 매 사이클 재생성하므로 표본이 길고 매일 갱신된다.
   폴백: DOW_STATS가 없으면 브라우저가 PRICE_HISTORY(최근 종가)로 직접 계산.
   두 경로 모두 방법론 동일: per-date=종목 등가중 평균 → per-dow=날짜 평균. */
(function(){
  const el=document.getElementById('dowbar'); if(!el) return;
  const names=['일','월','화','수','목','금','토'];
  let rows=[], from, to, days, uni, maxAbs=0.1;

  const DS=(typeof DOW_STATS!=='undefined')?DOW_STATS:null;
  if(DS && DS.dow){
    // 사전계산본 사용
    for(let dow=1;dow<=5;dow++){
      const o=DS.dow[String(dow)]||{};
      const avg=(o.avg===null||o.avg===undefined)?null:o.avg;
      if(avg!==null) maxAbs=Math.max(maxAbs, Math.abs(avg));
      rows.push({dow, avg, n:o.n||0});
    }
    from=(DS.from||'').slice(5).replace('-','/');
    to=(DS.to||'').slice(5).replace('-','/');
    days=DS.days||0;
    uni=(DS.universe>400)?'500':String(DS.universe||'');
    if(!days){ return; }
  } else {
    // 폴백: PRICE_HISTORY 클라이언트 계산
    if(typeof PRICE_HISTORY==='undefined'){ return; }
    const perDate={};
    for(const code in PRICE_HISTORY){
      let dd=[];
      for(const pg of PRICE_HISTORY[code]) for(const d of pg.days)
        if(d && d.date && typeof d.close==='number') dd.push({date:d.date, close:d.close});
      dd.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0); // ⚠️ 페이지가 시간순 아닐 수 있어 정렬 필수
      for(let i=1;i<dd.length;i++){
        const p=dd[i-1].close, c=dd[i].close;
        if(p>0) (perDate[dd[i].date]=perDate[dd[i].date]||[]).push((c/p-1)*100);
      }
    }
    const allDates=Object.keys(perDate);
    if(!allDates.length){ return; }
    const maxN=allDates.reduce((m,d)=>Math.max(m,perDate[d].length),0);
    const minN=Math.max(30, Math.round(maxN*0.3));
    const dts=allDates.filter(d=>perDate[d].length>=minN).sort();
    if(dts.length<3){ return; }
    const byDow={};
    for(const d of dts){
      const avg=perDate[d].reduce((s,x)=>s+x,0)/perDate[d].length;
      const dow=new Date(d+'T00:00:00Z').getUTCDay();
      (byDow[dow]=byDow[dow]||[]).push(avg);
    }
    for(let dow=1;dow<=5;dow++){
      const arr=byDow[dow]||[];
      const avg=arr.length?arr.reduce((s,x)=>s+x,0)/arr.length:null;
      if(avg!==null) maxAbs=Math.max(maxAbs, Math.abs(avg));
      rows.push({dow, avg, n:arr.length});
    }
    from=dts[0].slice(5).replace('-','/'); to=dts[dts.length-1].slice(5).replace('-','/');
    days=dts.length; uni=(maxN>400)?'500':String(maxN);
  }

  const H=26; // 막대 최대 높이(0선 기준 위/아래 각각)
  const cells=rows.map(r=>{
    if(r.avg===null)
      return `<div class="dow-cell"><div class="dow-day">${names[r.dow]}</div>`+
        `<div class="dow-barwrap"><div class="dow-zero"></div></div>`+
        `<div class="dow-val" style="color:var(--faint)">—</div><div class="dow-meta">-</div></div>`;
    const up=r.avg>=0;
    const h=Math.max(3, Math.round(Math.abs(r.avg)/maxAbs*H));
    const col=up?'var(--krup)':'var(--krdn)';
    const bar=up
      ? `<div class="dow-bar" style="height:${h}px;bottom:50%;background:${col}"></div>`
      : `<div class="dow-bar" style="height:${h}px;top:50%;background:${col}"></div>`;
    return `<div class="dow-cell"><div class="dow-day">${names[r.dow]}</div>`+
      `<div class="dow-barwrap"><div class="dow-zero"></div>${bar}</div>`+
      `<div class="dow-val" style="color:${col}">${up?'+':''}${r.avg.toFixed(2)}%</div>`+
      `<div class="dow-meta">표본 ${r.n}일</div></div>`;
  }).join('');
  el.innerHTML=
    `<div class="dow-h"><span class="dow-h-txt"><b>요일별 평균 등락률</b>`+
    `<span class="dow-sub">2026년 · 개오 추적 ${uni}종목 평균 · ${from}~${to} (${days}거래일)</span></span></div>`+
    `<div class="dow-grid">${cells}</div>`+
    `<div class="dow-foot">추적 종목들의 하루 등락률을 요일별로 평균 낸 값이에요. <b style="color:var(--krup)">빨강=오른 요일</b>·<b style="color:var(--krdn)">파랑=내린 요일</b>. 표본이 쌓일수록 정확해지는 <b>참고용 통계</b>예요(특정 요일 매매를 권하는 게 아니에요).</div>`;
  el.style.display='';
})();

/* ---------- 데이터 신선도 가드 (6순위 A-4) ---------- */
// SNAP_DATE의 날짜가 '기대 최신 거래일'보다 오래됐으면 경고. 주말·장전 시각을 고려.
function snapshotStaleDays(){
  const m=String(SNAP_DATE).match(/(\d{4})-(\d{2})-(\d{2})/);
  if(!m) return 0;
  const dataDay=new Date(+m[1],+m[2]-1,+m[3]); dataDay.setHours(0,0,0,0);
  const now=new Date(), dow=now.getDay(); // 0=일 … 6=토
  const exp=new Date(now); exp.setHours(0,0,0,0);
  if(dow===0) exp.setDate(exp.getDate()-2);              // 일 → 금
  else if(dow===6) exp.setDate(exp.getDate()-1);         // 토 → 금
  else if(now.getHours()<9) exp.setDate(exp.getDate()-(dow===1?3:1)); // 평일 장전 → 직전 거래일
  const diff=Math.round((exp-dataDay)/86400000);
  return diff>0?diff:0;
}
(function(){
  const el=document.getElementById('datawarn'); if(!el) return;
  const msgs=[];
  const staleDays=snapshotStaleDays();
  if(staleDays>0){
    const d=String(SNAP_DATE).match(/\d{4}-\d{2}-\d{2}/);
    msgs.push(`⚠️ 마지막 갱신은 <b>${d?d[0]:SNAP_DATE}</b>입니다 (약 ${staleDays}일 전). 공휴일·장 마감 뒤에는 마지막 거래일 값이 표시될 수 있으니 기준 시각을 확인해 주세요.`);
  }
  const staleStocks=Object.values(STOCKS).filter(s=>s.stale).map(s=>s.name);
  if(staleStocks.length){
    msgs.push(`⚠️ 일부 종목 시세 지연(이전 값 표시): <b>${staleStocks.join(', ')}</b>`);
  }
  if(msgs.length){
    el.innerHTML=msgs.join('<br>'); el.style.display='block';
    gaeoTrack('stale_data_warning_seen',{
      page_type:'home',data_age_bucket:staleDays>7?'8d_plus':(staleDays>1?'2_7d':'1d')
    },{dedupeKey:'stale-data-warning'});
  }
})();

const won=n=>n.toLocaleString('ko-KR')+'원';
function resolveStock(input){
  const s=(input||'').trim();
  if(STOCKS[s]) return {code:s, ...STOCKS[s]};
  for(const [code,d] of Object.entries(STOCKS)) if(d.name===s) return {code, ...d};
  return {code:s, name:s, price:null};
}
function bioOf(code, sector){
  const b=(typeof STOCK_BIO!=='undefined'&&STOCK_BIO&&STOCK_BIO[code])||(window.STOCK_BIO&&window.STOCK_BIO[code]);
  return b || (sector?`${sector} 업종 종목`:'');
}
/* 지금 시세 카드에 떠 있는 종목 — 전체 지표가 늦게 도착했을 때 이 카드만 다시 그린다. */
let GAEO_QUOTE_STOCK=null;
/* 전체 지표(indicators.js) 도착 콜백. GaeoFeatures.load('indicators')가 부른다.
   ⚠️ 이미 그려진 화면을 조용히 갈아끼우는 게 목적이라, 스크롤 위치는 건드리지 않는다. */
window.GaeoUseIndicators=()=>{
  const mode=document.body.dataset.mode;
  if(mode==='single'&&GAEO_QUOTE_STOCK){
    try{ showQuote(GAEO_QUOTE_STOCK); }catch(e){}
  }
  if(mode==='portfolio'&&typeof renderPortfolio==='function'){
    try{ renderPortfolio(); }catch(e){}
  }
};

function showQuote(st){
  if(window.GaeoInsightRail&&typeof window.GaeoInsightRail.recordRecent==='function'){
    window.GaeoInsightRail.recordRecent(st);
  }
  /* 📊 종목 카드는 전체 지표(indicators.js)가 있어야 이동평균·수급·위험 표를 그린다.
     홈은 경량본(79KB)만 받으므로 여기서 나머지를 요청한다. 도착 전에는 그 칸이
     비어 있고(숫자를 지어내지 않는다), 도착하면 GaeoUseIndicators가 다시 그린다.
     ⚠️ recordRecent보다 뒤에 둔다 — test_insight_rail.js가 showQuote 시작 250자
        안에 recordRecent가 있는지로 "최근 본 종목 기록이 맨 앞"을 잠그고 있다. */
  GAEO_QUOTE_STOCK=st;
  if(typeof ensureIndicators==='function') ensureIndicators();
  const stockHeading=document.getElementById('qname');
  stockHeading.textContent=st.name;
  stockHeading.removeAttribute('aria-hidden');
  document.querySelector('.hero-title')?.setAttribute('aria-hidden','true');
  document.getElementById('qcode').textContent=st.price?st.code:'';
  updateWatchToggle(st.price?st.code:null);
  const qcr=document.getElementById('qcaprank');
  if(qcr){
    const rank=CAP_RANK[st.code];
    if(rank){ qcr.textContent='시총 '+rank+'위'; qcr.style.display='inline-block'; }
    else{ qcr.textContent=''; qcr.style.display='none'; }
  }
  const qp=document.getElementById('qprice'), qr=document.getElementById('qrate');
  const qd=document.getElementById('qdate'), qm=document.getElementById('qmetrics');
  // 무슨 일을 하는 회사인지 한 줄 소개 (시세 카드 최상단)
  // ⭐ 2026-08-10: 이모지 아이콘을 빼고 텍스트만 남겨 더 절제된 톤으로 다듬었다.
  const qb=document.getElementById('qbio');
  const bio=bioOf(st.code, st.sector);
  if(bio){ qb.innerHTML=`<span><b>${st.name}</b> — ${bio}</span>`; qb.style.display='flex'; }
  else qb.style.display='none';
  if(!st.price){
    qp.textContent=''; qr.textContent=''; qm.innerHTML='';
    qd.textContent='시세 데이터 없음 — 목록의 종목만 실제 시세를 제공합니다.';
    document.getElementById('qchartWrap').style.display='none';
    const qjEmpty=document.getElementById('qjudgeWrap');
    if(qjEmpty){ qjEmpty.style.display='none'; qjEmpty.innerHTML=''; }
    return;
  }
  qp.textContent=won(st.price);
  const rateTone=st.rate>0?'up':st.rate<0?'down':'flat';
  qr.textContent=(st.rate>0?'▲ +':st.rate<0?'▼ ':'• ')+st.rate.toFixed(2)+'%';
  qr.className='qrate '+rateTone;
  const aof=analysisAsOf(st.code);
  // ⭐ 2026-08-10: 시세/분석 기준 앞의 이모지 아이콘을 빼고 텍스트만 남겼다 —
  // 구간 사이 " · " 구분점(.qd-seg CSS)이 이미 있어 아이콘 없이도 잘 구분된다.
  qd.innerHTML='<span class="qd-seg">시세 기준 <b>'+priceAsOf()+'</b></span>'+
    '<span class="qd-seg">네이버 금융'+(st.stale?' <span class="stale">시세 지연</span>':'')+'</span>'+
    (aof?'<span class="qd-seg">분석 기준 <b>'+aof+'</b></span>':'')+
    freshnessHTML(st.code, st.price);
  const M=[['PER',st.per+'배'],['PBR',st.pbr+'배'],['ROE',st.roe?st.roe+'%':'—'],
           ['EPS',st.eps?won(st.eps):'—'],['배당수익률',st.div?st.div+'%':'—'],
           ['시가총액',st.cap],['52주',st.w52]];
  qm.innerHTML=M.map(([k,v])=>`<div class="qm${k==='52주'?' qm-wide':''}"><div class="qm-label">${term(k)}</div><div class="qm-val">${v}</div></div>`).join('');

  // 첫 종목 열기에서는 홈에 이미 있는 5거래일 경량본으로 차트를 즉시 그린다.
  // 전체 가격·판단 기록은 압축 전 약 48MB이므로 사용자가 "전체 기간" 버튼을 누를 때만 받는다.
  // 기존 전체 차트 기능은 유지하되 초기 종목 분석 경로와 네트워크를 공유하지 않는다.
  const cw=document.getElementById('qchartWrap');
  cw.style.display='block';
  const renderPriceChart=(full=false)=>{
    const ohlcDays=(typeof flatOHLC==='function')?flatOHLC(st.code):[];
    if(ohlcDays.length>=2){
      cw.innerHTML=stockOhlcSectionHTML(st.code,ohlcDays);
      wireOhlcChart('q-'+st.code,ohlcDays,stockWon);
      if(!full&&!GaeoFeatures.ready('history')){
        cw.insertAdjacentHTML('beforeend','<button type="button" class="qchart-history-load">전체 기간 차트 보기</button>');
        const load=cw.querySelector('.qchart-history-load');
        load.onclick=()=>{
          load.disabled=true; load.textContent='과거 기록 불러오는 중…';
          GaeoFeatures.load('history').then(()=>{
            if(document.getElementById('qcode').textContent!==st.code) return;
            LIVE_PH=(typeof PRICE_HISTORY!=='undefined')?PRICE_HISTORY:null;
            LIVE_HIST=(typeof LIVE_HISTORY!=='undefined')?LIVE_HISTORY:null;
            renderPriceChart(true);
          }).catch(()=>{ load.disabled=false; load.textContent='다시 불러오기'; });
        };
      }
    } else cw.style.display='none';
  };
  renderPriceChart(GaeoFeatures.ready('history'));
  if(typeof window.renderStockJudge==='function') window.renderStockJudge(st.code);
}
// 개별 종목 캔들차트용 원화 표기(지수는 idxWon으로 소수점 포인트, 종목은 정수+'원')
function stockWon(v){ return Number.isFinite(v)?Math.round(v).toLocaleString('ko-KR')+'원':'-'; }
// price_history.js 페이지를 날짜순 OHLCV 배열로 펼친다(캔들차트 입력용 — flatCloses의 종가만 뽑는
// 버전과 달리 open/high/low/volume을 그대로 살려둔다). 기록이 아직 없으면 last5(종가만)로 대체.
function flatOHLC(code){
  const pages=(LIVE_PH&&LIVE_PH[code])||[];
  const days=pages.flatMap(p=>p.days).filter(d=>d&&d.date&&typeof d.close==='number')
    .sort((a,b)=>a.date<b.date?-1:(a.date>b.date?1:0));
  if(days.length>=2) return days;
  const t=(liveInd(code)||{}).tech;
  const l5=homeLast5(code);
  return l5?l5.map(x=>({date:x.d,close:x.c})):[];
}
/* ── 시세 카드 가격 흐름(2026-08-07 개편): 코스피·코스닥 상세와 같은 캔들+이동평균+거래량
   차트(ohlcChartHTML/wireOhlcChart)를 그대로 재사용해 "전문 차트" 수준으로 올렸다.
   위아래 요약 바(시작종가→현재종가, 기간 최고·최저)는 기존 문구를 그대로 유지한다. */
function stockOhlcSectionHTML(code,days){
  const closes=days.map(d=>d.close);
  const n=closes.length, first=closes[0], last=closes[n-1], chg=(last-first)/first*100;
  const flat=Math.abs(chg)<0.05, up=last>=first;
  const trend=flat?'flat':(up?'up':'down');
  const fmtD=s=>String(s).split('-').slice(-2).join('/');
  const period=`${fmtD(days[0].date)} ~ ${fmtD(days[n-1].date)}`;
  const delta=Math.abs(last-first), direction=flat?'보합':(up?'상승':'하락');
  const action=flat?'같아요':(up?'올랐어요':'내렸어요');
  const arrow=flat?'→':(up?'↗':'↘');
  const hi=Math.max(...closes), lo=Math.min(...closes);
  return `<div class="qchart-head">`+
      `<div class="qchart-heading"><span class="qchart-eyebrow">PRICE TREND</span><span class="qchart-t">최근 가격 흐름</span></div>`+
      `<span class="qchart-sub">${n}거래일 · <b>${period}</b></span>`+
    `</div>`+
    `<div class="qchart-summary" data-trend="${trend}">`+
      `<div class="qchart-price"><small>시작 종가</small><b>${stockWon(first)}</b></div>`+
      `<div class="qchart-route"><strong>${arrow} ${Math.abs(chg).toFixed(1)}% ${direction}</strong><span> · ${n}거래일 동안 ${stockWon(delta)} ${action}</span></div>`+
      `<div class="qchart-price is-current"><small>현재 종가</small><b>${stockWon(last)}</b></div>`+
    `</div>`+
    ohlcChartHTML('q-'+code,days,stockWon)+
    `<div class="qchart-foot">`+
      `<div class="qchart-extremes"><span>기간 최고 <b>${stockWon(hi)}</b></span><span>기간 최저 <b>${stockWon(lo)}</b></span></div>`+
      `<div class="qchart-cap">캔들 <b>몸통</b>은 시가·종가 차이예요(길수록 그날 변동이 컸다는 뜻). 위아래 <b>꼬리</b>는 그날의 고가·저가고요(길수록 장중에 크게 오르내렸다는 뜻). 이동평균 버튼을 눌러 선을 켜고 끌 수 있고, 아래 막대는 거래량이에요.</div>`+
    `</div>`;
}
/* 용어 설명 — 커서를 올리면 짧은 뜻, 클릭하면 초등학생도 이해하는 쉬운 설명 팝업 */
const GLOSSARY={
  '변동폭':'주가가 하루 동안 오르내리는 폭. 클수록 수익도 손실도 빨리 커져서, 초보자에겐 작은 쪽이 다루기 쉬워요.',
  '최대낙폭':'일정 기간 안에서 고점 대비 가장 깊게 빠졌던 하락 폭(MDD). "이 종목을 들고 있으면 이만큼 빠지는 일도 겪을 수 있다"는 마음의 준비 지표예요.',
  'PER':'주가수익비율. 주가 ÷ 주당순이익(EPS). 낮을수록 이익 대비 주가가 싼 편(업종마다 기준 다름).',
  'PBR':'주가순자산비율. 주가 ÷ 주당순자산(BPS). 1배면 장부가치와 같음. 낮을수록 자산 대비 저평가.',
  'ROE':'자기자본이익률. 순이익 ÷ 자기자본. 회사가 가진 돈으로 얼마나 잘 버는지. 높을수록 수익성 좋음.',
  'EPS':'주당순이익. 순이익 ÷ 주식 수. 한 주가 1년에 벌어들인 이익.',
  'BPS':'주당순자산. 자기자본 ÷ 주식 수. 한 주에 담긴 회사의 순자산 가치.',
  '배당수익률':'현재 주가 대비 1년 배당금의 비율. 예금 이자처럼 주가의 몇 %를 배당으로 받는지.',
  '시가총액':'회사 전체의 시장 가치. 주가 × 총 주식 수. 회사 규모를 나타냄.',
  '52주':'최근 1년(52주)의 최저가 ~ 최고가. 현재 주가가 그 범위 어디쯤인지 가늠하는 지표.',
  'RSI':'최근에 "사려는 힘"과 "팔려는 힘" 중 어느 쪽이 더 센지를 0~100 숫자 하나로 나타낸 거예요. 70을 넘으면 "너무 많이 올라서 곧 쉬어갈 수도 있다"(과매수), 30 밑으로 내려가면 "너무 많이 떨어져서 곧 반등할 수도 있다"(과매도)는 신호로 봐요.',
  'MACD':'"최근 흐름"(짧은 기간 평균)과 "그보다 조금 더 오래된 흐름"(긴 기간 평균)의 차이를 계산한 값이에요. 이 값이 자기 자신을 한 번 더 평균 낸 기준선(시그널선)을 뚫고 올라가면 오름세로 바뀔 수 있다는 신호(골든크로스), 뚫고 내려가면 내림세로 바뀔 수 있다는 신호(데드크로스)로 봐요.',
  '시그널선':'MACD 값을 다시 한번 부드럽게 평균 낸 기준선이에요. MACD가 이 선 위에 있으면 "요즘 힘이 세지는 중", 아래에 있으면 "요즘 힘이 약해지는 중"이라고 봐요.',
  'MA20':'최근 20일 동안의 주가를 평균 내서 이어 그린 선이에요("이동평균선"이라고 불러요). 지금 주가가 이 선보다 위에 있으면 "요즘 며칠간 기세가 좋다", 아래에 있으면 "요즘 며칠간 힘이 없다"고 봐요.',
  'MA60':'최근 60일(약 3달) 동안의 주가를 평균 내서 이어 그린 선이에요. MA20보다 더 긴 기간을 보기 때문에, 짧은 흔들림 말고 "큰 흐름이 오름세인지 내림세인지"를 볼 때 써요.',
  '골든크로스':'짧은 기간 추세선(예: MA20)이 긴 기간 추세선(예: MA60)을 아래에서 위로 뚫고 올라가는 순간이에요. "이제부터 오를 수도 있다"는 긍정적인 신호로 해석해요. MACD가 시그널선을 뚫고 올라갈 때도 같은 이름으로 불러요.',
  '데드크로스':'골든크로스랑 정반대예요. 짧은 기간 추세선이 긴 기간 추세선을 위에서 아래로 뚫고 내려가는 순간이에요. "이제부터 내릴 수도 있다"는 조심 신호로 해석해요.',
  'HBM':'고대역폭메모리. AI 반도체에 쓰이는 고성능 D램으로, 최근 반도체주 핵심 테마.',
  'NAV':'순자산가치. 지주회사가 보유한 자산의 총 가치. 주가가 NAV보다 낮으면 "할인"됐다고 함.',
  '지지선':'주가가 내려가다가 잘 멈추고 튕겨 올라오곤 하는 가격대예요. 사려는 사람이 많아지는 "바닥 쿠션" 같은 선이에요.',
  '저항선':'주가가 올라가다가 자꾸 막히는 가격대예요. 팔려는 사람이 많아지는 "천장" 같은 선이에요.',
  '손절':'더 큰 손해를 막기 위해, 미리 정해둔 가격 아래로 내려가면 일단 팔고 나오는 것을 말해요. "여기까지 내려가면 무리하지 않고 물러난다"는 약속이에요.'
};
function term(label){
  const g=GLOSSARY[label];
  return g ? `<span class="term gterm" tabindex="0" data-term="${label}">${label}</span>` : label;
}
// findings 문장 속에 섞여 나오는 용어(예: "RSI(14) 47.0", "MACD가 시그널선을")를 자동으로 찾아
// 클릭 가능한 용어 칩으로 바꾼다. 영숫자 용어는 앞뒤가 다른 영숫자와 안 붙어있을 때만 매치.
// ⚠️ lookbehind (?<!...)는 iOS 16.4 미만 Safari에서 미지원 — 그 줄 하나가 던지는 에러로
//    스크립트 블록 전체가 죽는다. 앞 경계는 캡처그룹 (^|[^A-Za-z0-9])로 대체(전 브라우저 안전).
const GLOSS_KEYS=Object.keys(GLOSSARY).sort((a,b)=>b.length-a.length);
const reEsc=k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const GLOSS_ALNUM=GLOSS_KEYS.filter(k=>/^[A-Za-z0-9]/.test(k));   // PER·RSI·MA20·52주 등
const GLOSS_KR=GLOSS_KEYS.filter(k=>!/^[A-Za-z0-9]/.test(k));     // 골든크로스·시그널선 등
const GLOSS_RE_KR=GLOSS_KR.length?new RegExp(GLOSS_KR.map(reEsc).join('|'),'g'):null;
const GLOSS_RE_AL=GLOSS_ALNUM.length
  ?new RegExp('(^|[^A-Za-z0-9])('+GLOSS_ALNUM.map(reEsc).join('|')+')(?![A-Za-z0-9])','g'):null;
function wrapGloss(text){
  if(!text) return text;
  let s=String(text);
  if(GLOSS_RE_KR) s=s.replace(GLOSS_RE_KR, m=>term(m));            // 한글 용어 먼저
  if(GLOSS_RE_AL) s=s.replace(GLOSS_RE_AL,(m,pre,w)=>pre+term(w)); // 영숫자 용어(경계 보존)
  return s;
}
// ⭐ 2026-08-05: 근거 문장이 다 똑같은 글머리라 어떤 게 중요한 신호인지 한눈에 안 들어온다는
// 피드백 → 문장 속 키워드로 대충 분류해 앞에 표시만 붙인다(완벽한 판정이 아니라 "훑어볼 때
// 눈에 먼저 들어오는" 용도). ! 경고성 신호가 최우선, 그다음 ★ 뚜렷한 강한 신호, 나머지는 · 일반 정보.
const FMK_WARN=/위험|주의|손실|하락\s?전환|데드크로스|과매수|과열|약세\s?전환|우려|불안|악화|경계|부담|이례적/;
const FMK_KEY=/골든크로스|신고가|사상\s?최고|급등|급락|강세\s?전환|상향\s?돌파|가장\s?크게|핵심/;
function findingMark(text){
  const s=String(text||'');
  if(FMK_WARN.test(s)) return {sym:'!',cls:'fmk-warn'};
  if(FMK_KEY.test(s)) return {sym:'★',cls:'fmk-key'};
  return {sym:'·',cls:'fmk-dot'};
}
function findingLi(f){
  const copy=String(f??'').replace(/[\p{Extended_Pictographic}\uFE0F]/gu,'').trim();
  const mk=findingMark(copy);
  return `<li><span class="fmk ${mk.cls}" aria-hidden="true">${mk.sym}</span><span>${SIGNUM(wrapGloss(copy))}</span></li>`;
}
// 📚 "정밀분석 기록" 탭 — 신선도와 무관하게 그 종목을 실제로 정밀분석했던 시점의 원문을
// 시간순으로 다시 읽는다(analysis_archive.js, archive_analysis.py가 매 재분석 때 누적).
function paCallClass(call){ return call==='BUY'?'bull':call==='SELL'?'bear':'neu'; }
function deepAnalysisPermalink(code,updated){
  const m=String(updated||'').match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}):(\d{2})/);
  return /^\d{6}$/.test(String(code||''))&&m
    ?`/research/deep-analysis/${code}/${m[1]}-${m[2]}${m[3]}/`:'';
}
function paSnapshotHTML(snap,code){
  const chief=snap.chief||{};
  const axes=[['기술','taro'],['재무','diana'],['확률통계','nova'],['수급','flow']].map(([label,key])=>{
    const a=snap[key]; if(!a||!Array.isArray(a.findings)) return '';
    return `<div class="pa-axis"><div class="pa-axis-head"><b>${esc(label)}</b><span>${a.score!=null?a.score+'점':'—'}</span></div>`+
      `<ul>${a.findings.map(findingLi).join('')}</ul></div>`;
  }).join('');
  return `<div class="pa-summary">`+
    `<div class="pa-chief"><span class="pa-call ${paCallClass(chief.call)}">${esc(chief.call||'—')}</span>`+
    `<span class="pa-total">${chief.total!=null?chief.total+'점':'—'}</span>`+
    `<span class="pa-conf">판단 확신도 ${chief.confidence!=null?chief.confidence+'%':'—'}</span></div>`+
    `<p class="pa-reason">${esc(chief.reason||chief.report||'')}</p>`+
    (chief.target?`<div class="pa-target">${esc(chief.target)}</div>`:'')+
    `<div class="pa-base">당시 기준가 ${snap.base!=null?won(snap.base):'—'}${snap.baseAt?' ('+esc(snap.baseAt)+')':''}</div>`+
    (deepAnalysisPermalink(code,snap.updated)?`<a class="pa-permalink" href="${esc(deepAnalysisPermalink(code,snap.updated))}">이 분석만 보기 →</a>`:'')+
    `</div><div class="pa-axes">${axes}</div>`;
}
// ⭐ 2026-08-10: 목록 따로 + 본문 하나만 바꿔치기하던 구조를, 항목을 누르면 그 자리에서
// 바로 접혔다 펼쳐지는 아코디언으로 바꿨다(사용자 요청). 여러 항목을 동시에 펼쳐도 되고,
// 내용은 처음 펼칠 때 한 번만 렌더링해 캐싱한다(자주 여닫아도 다시 계산하지 않음).
function renderArchivePanel(code){
  const wrap=document.getElementById('archiveWrap');
  const checking=document.getElementById('archiveChecking');
  if(checking) checking.style.display='none';
  if(!wrap) return;
  if(window.GaeoArchiveRenderedFor===code) return;   // 같은 종목이면 다시 그리지 않는다
  const list=(ARCHIVE&&ARCHIVE[code])?[...ARCHIVE[code]].sort((a,b)=>String(b.updated||'').localeCompare(String(a.updated||''))):[];
  if(!list.length){
    wrap.innerHTML='<div class="analysis-tab-empty">이 종목의 정밀분석 전체 기록을 아직 찾지 못했어요. 잠시 후 다시 열어보세요.</div>';
    window.GaeoArchiveRenderedFor=code;
    return;
  }
  const rows=list.map((snap,i)=>{
    const c=snap.chief||{};
    return `<div class="pa-entry">`+
      `<button type="button" class="pa-item${i===0?' on':''}" data-idx="${i}" aria-expanded="${i===0?'true':'false'}">`+
      `<span class="pa-item-date">${esc(snap.updated||'')}</span>`+
      `<span class="pa-item-call ${paCallClass(c.call)}">${esc(c.call||'—')} · ${c.total!=null?c.total+'점':'—'}</span>`+
      `<span class="pa-item-chevron" aria-hidden="true">▾</span></button>`+
      `<div class="pa-panel" data-idx="${i}"${i===0?'':' hidden'}></div>`+
      `</div>`;
  }).join('');
  wrap.innerHTML=`<div class="pa-list">${rows}</div>`;
  wrap.querySelectorAll('.pa-item').forEach(btn=>{
    const panel=btn.parentElement.querySelector('.pa-panel');
    const idx=+btn.dataset.idx;
    const fill=()=>{ if(!panel.innerHTML) panel.innerHTML=paSnapshotHTML(list[idx],code); };
    if(idx===0) fill();   // 첫 항목은 기본으로 펼쳐져 있으니 바로 채운다
    btn.addEventListener('click',()=>{
      const open=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',open?'false':'true');
      btn.classList.toggle('on',!open);
      panel.hidden=open;
      if(!open) fill();
      SFX.click();
    });
  });
  window.GaeoArchiveRenderedFor=code;
}
// 이동평균 카드의 위/아래/근처 배지 — GLOSSARY와는 별개 사전(문장 속 자동 링크 대상이 아니라
// "위"·"아래" 같은 흔한 글자가 본문 곳곳에서 오매칭되는 걸 막기 위해 status 키로만 찾는다).
const MA_BADGE_DEF={
  above:'현재가가 이 이동평균선보다 높다는 뜻이에요. 그 기간 동안의 평균 매수단가보다 위에 있어서, 그 기간에 사고판 투자자들은 대체로 이익 구간에 있다고 볼 수 있어요.',
  below:'현재가가 이 이동평균선보다 낮다는 뜻이에요. 그 기간 동안의 평균 매수단가보다 아래에 있어서, 그 기간에 사고판 투자자들은 대체로 손실 구간에 있다고 볼 수 있어요.',
  near:'현재가와 이 이동평균선이 거의 같은 자리(±1% 이내)라는 뜻이에요. 위인지 아래인지 아직 방향이 정해지지 않은 갈림길 구간이에요.',
};
// 클릭(또는 Enter/Space)하면 용어 뜻을 큰 팝업으로 보여준다 — 모바일에서도 hover 없이 동작
(function(){
  let pop=null, openFor=null;
  function ensurePop(){
    if(pop) return pop;
    pop=document.createElement('div'); pop.className='gloss-pop';
    pop.innerHTML=`<button class="gp-x" aria-label="닫기">✕</button><div class="gp-term"></div><div class="gp-def"></div>`;
    document.body.appendChild(pop);
    pop.querySelector('.gp-x').onclick=close;
    return pop;
  }
  function close(){ if(pop){ pop.classList.remove('on'); } openFor=null; }
  function lookup(el){
    if(el.classList.contains('ma-badge-info')) return {label:el.textContent.trim(), def:MA_BADGE_DEF[el.dataset.badge]};
    return {label:el.dataset.term, def:GLOSSARY[el.dataset.term]};
  }
  function open(el){
    const {label,def}=lookup(el); if(!def) return;
    const p=ensurePop();
    if(openFor===el && p.classList.contains('on')){ close(); return; }
    openFor=el;
    p.querySelector('.gp-term').textContent=label;
    p.querySelector('.gp-def').textContent=def;
    p.classList.add('on');
    const r=el.getBoundingClientRect(), pw=272, margin=10;
    let left=Math.min(Math.max(margin,r.left), window.innerWidth-pw-margin);
    let top=r.bottom+8;
    if(top+140>window.innerHeight) top=Math.max(margin, r.top-8-140);
    p.style.left=left+'px'; p.style.top=top+'px';
  }
  document.addEventListener('click', e=>{
    const t=e.target.closest('.gterm, .ma-badge-info');
    if(t){ open(t); return; }
    if(!e.target.closest('.gloss-pop')) close();
  });
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){ close(); return; }
    if((e.key==='Enter'||e.key===' ') && e.target.classList && (e.target.classList.contains('gterm')||e.target.classList.contains('ma-badge-info'))){
      e.preventDefault(); open(e.target);
    }
  });
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
})();

// ---------- 스파크라인(미니 라인차트) 공통 헬퍼 ----------
/* 📊 전체 기술지표 접근자 (2026-08-28).
   예전에는 `const LIVE_IND = INDICATORS.stocks`로 페이지 파싱 시점에 한 번 붙잡았다.
   지금은 indicators.js를 종목 화면에서 지연 로딩하므로, 그 시점에 아직 없으면
   빈 객체가 영구히 박힌다. 그래서 매번 현재 값을 읽는 함수로 바꾼다.
   ⚠️ 없으면 null을 돌려준다 — 호출부는 전부 이미 `(...)||{}` 형태로 방어하고 있다.
      숫자를 지어내지 않고 그 칸을 비우는 게 이 저장소의 원칙이다. */
function liveIndAll(){
  return (typeof INDICATORS!=='undefined'&&INDICATORS&&INDICATORS.stocks)?INDICATORS.stocks:{};
}
function liveInd(code){ return liveIndAll()[code]||null; }
/* 전체 지표가 필요한 화면이 부르는 진입점. 이미 받았으면 아무 일도 하지 않는다. */
function ensureIndicators(){
  if(typeof GaeoFeatures==='undefined') return Promise.resolve();
  return GaeoFeatures.load('indicators').catch(()=>{});
}
window.ensureIndicators=ensureIndicators;
function flatCloses(code){
  const pages=(LIVE_PH&&LIVE_PH[code])||[];
  // ⚠️ PRICE_HISTORY의 페이지 배열은 시간순이 아닐 수 있다(중간에 과거 페이지가 끼어있음).
  //    그대로 이으면 차트 선이 왜곡되므로 반드시 날짜로 정렬한다.
  const days=pages.flatMap(p=>p.days).map(d=>({date:d.date,c:d.close}))
    .sort((a,b)=>a.date<b.date?-1:(a.date>b.date?1:0));
  if(days.length>=2) return days;
  const l5=homeLast5(code);
  return l5?l5.map(x=>({date:x.d,c:x.c})):[];
}
// 종목 칩·시세 카드용 작은 가격 스파크라인 (등락에 따라 색만 다름)
function priceSparkSVG(closes,w,h){
  const n=closes.length; if(n<2) return '';
  const lo=Math.min(...closes), hi=Math.max(...closes), span=(hi-lo)||1;
  const px=i=>2+(w-4)*(i/(n-1)), py=v=>h-2-(h-4)*((v-lo)/span);
  const line=closes.map((c,i)=>(i?'L':'M')+px(i).toFixed(1)+' '+py(c).toFixed(1)).join(' ');
  const up=closes[n-1]>=closes[0], col=up?'#2F8B73':'#D5535D';
  const lx=px(n-1).toFixed(1), ly=py(closes[n-1]).toFixed(1);
  return `<svg class="chip-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">`+
    `<path d="${line}" fill="none" stroke="${col}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>`+
    `<circle cx="${lx}" cy="${ly}" r="2" fill="${col}"/></svg>`;
}

// ---------- TARO 이동평균 해석 엔진(2026-08-06) — MA5/20/60/120/200을 위치·이격·기울기·
// 지지저항·조합으로 풀어 설명한다. 순수 함수로만 구성해 전 종목에 규칙 기반으로
// 동일하게 적용된다(종목별 하드코딩 없음). 데이터가 부족한 선(현재 120·200일)은 절대
// 추정치를 만들지 않고 "데이터 부족"을 그대로 보여준다 — indicators.js의 tech.ma* 필드가
// null이면 그 선은 계산 자체를 하지 않은 것(compute_indicators.py 참고). ----------
const MA_META={
  5:{label:'5일선',mean:'최근 1주 평균 · 단기 탄력'},
  20:{label:'20일선',mean:'최근 1개월 평균 · 단기 추세'},
  60:{label:'60일선',mean:'최근 3개월 평균 · 중기 추세'},
  120:{label:'120일선',mean:'최근 6개월 평균 · 장기 추세'},
  200:{label:'200일선',mean:'최장 기준선 · 구조적 장기 방향'},
};
const MA_INSUFF_TEXT={
  5:'데이터가 더 쌓이면 계산할 수 있어요.',
  20:'데이터가 더 쌓이면 계산할 수 있어요.',
  60:'데이터 부족으로 아직 중기 추세를 계산할 수 없어요.',
  120:'수집 기간이 짧아 장기 추세를 제공하지 않아요.',
  200:'장기 기준선 판단용 데이터가 부족해요.',
};
const MA_POSITION_TEXT={
  5:{above:'단기 매수세가 살아 있을 가능성이 있어요.',below:'단기 탄력이 약해졌을 가능성이 있어요.',near:'단기 방향을 아직 탐색하는 구간이에요.'},
  20:{above:'최근 한 달 기준 흐름이 비교적 안정적이에요.',below:'최근 한 달 기준으로는 조정 압력이 남아 있을 수 있어요.',near:'한 달 평균과 팽팽하게 맞선 구간이에요.'},
  60:{above:'중기 추세가 유지되는 편이에요.',below:'중기 흐름이 약해졌을 가능성이 있어요.',near:'중기 추세 방향이 갈리는 분기점 부근이에요.'},
  120:{above:'장기 흐름이 상대적으로 양호해요.',below:'장기 추세 회복 전 단계일 수 있어요.',near:'장기 흐름의 방향이 아직 뚜렷하지 않아요.'},
  200:{above:'구조적 장기 추세가 비교적 양호한 편이에요.',below:'장기 추세가 아직 약하거나 회복이 확인되지 않았을 수 있어요.',near:'장기 기준선과 팽팽하게 맞선 구간이에요.'},
};
const MA_SR_TEXT={
  20:{above:'조정이 오면 20일선이 지지선 역할을 기대할 수 있어요.',below:'반등 시 20일선 부근이 저항으로 작용할 가능성이 있어요.',near:'20일선을 사이에 두고 지지·저항 공방이 있을 수 있어요.'},
  60:{above:'중기 추세 방어선(60일선) 위를 지키고 있어요.',below:'반등해도 60일선 부근에서 매물 부담(저항)을 만날 수 있어요.',near:'60일선 공방이 이어지는 구간이에요.'},
  120:{above:'장기 추세는 아직 구조적으로 훼손되지 않았어요.',below:'120일선 회복 전까지는 장기 매물대가 저항으로 남아있을 수 있어요.'},
  200:{above:'가장 긴 기준선 위에서 구조적인 흐름을 지키고 있어요.',below:'200일선 아래에서는 장기 추세 회복이 아직 확인되지 않은 상태예요.'},
};
function maStatus(price,ma){
  if(!Number.isFinite(price)||!Number.isFinite(ma)||!ma) return null;
  const gap=(price/ma-1)*100;
  if(Math.abs(gap)<=1.0) return 'near';
  return gap>0?'above':'below';
}
function maSlopeLabel(slope){
  if(!Number.isFinite(slope)) return null;
  if(slope>0.5) return '상승';
  if(slope<-0.5) return '하락';
  return '횡보';
}
// ⭐ 이격도(평균회귀) 해석은 프롬프트 지시대로 60일선에서만 상세히 다룬다(중기 균형가 기준).
function disparityInterpret(period,gap){
  if(period!==60||!Number.isFinite(gap)) return null;
  if(gap>=30) return {tone:'bad',text:`60일선 대비 +${gap.toFixed(1)}% 높은 수준이에요. 중기 평균가격에서 크게 벌어져 있어 평균회귀와 차익실현 위험이 커진 구간으로 볼 수 있어요. 신규 추격매수는 신중하게 판단하는 편이 좋아요.`};
  if(gap>=20) return {tone:'warn',text:`60일선 대비 +${gap.toFixed(1)}%로 다소 과열된 구간이에요. 추격매수보다는 눌림목을 기다리는 편이 안전할 수 있어요.`};
  if(gap>=10) return {tone:'warn',text:`60일선 대비 +${gap.toFixed(1)}%로 평소보다 확장된 편이에요. 평균회귀 가능성을 염두에 둘 필요가 있어요.`};
  if(gap>=0) return {tone:null,text:`60일선 대비 +${gap.toFixed(1)}%로 정상 범위예요.`};
  if(gap>=-15) return {tone:null,text:`60일선 대비 ${gap.toFixed(1)}%로 중기 평균 아래에 있어요.`};
  return {tone:'warn',text:`60일선 대비 ${gap.toFixed(1)}%로 중기 평균에서 크게 밀려나 있어요. 추세 약화 또는 저점 매수 검토 구간으로 볼 수 있어요.`};
}
/* 이동평균 창(window) 정보를 안전하게 읽는다.
   ⚠️ 2026-08-06 실제 버그: 러너가 아직 새 compute_indicators.py로 돌지 않아 배포된
   indicators.js에 ma{P}Days·ma{P}Full 필드가 없던 동안, !full로 판정돼 화면에
   "undefined일선"이 그대로 찍혔다. 창 정보를 모르면(구형 데이터) 정식으로 간주해
   원래 이름(예: 20일선)을 쓰고, 새 데이터가 오면 그때부터 실제 일수를 반영한다. */
function maWindow(period,t){
  const rawDays=t['ma'+period+'Days'];
  const known=Number.isFinite(rawDays)&&rawDays>0;
  return {known, effDays:known?rawDays:period, full:known?!!t['ma'+period+'Full']:true};
}
// 정식/약식에 맞는 이름표(예: "60일선" 또는 데이터가 54일치뿐이면 "54일선")
function maDisplayName(period,t){
  const w=maWindow(period,t);
  return w.full?MA_META[period].label:`${w.effDays}일선`;
}
function maCardHTML(period,t,unit){
  unit=unit===undefined?'원':unit;
  const meta=MA_META[period];
  const ma=t['ma'+period], gap=t['ma'+period+'Gap'], slope=t['ma'+period+'Slope'];
  const {effDays,full}=maWindow(period,t);
  const price=t.close;
  if(!Number.isFinite(ma)){
    // 2일치도 안 되는 극단적 예외(신규상장 첫날 등) + 구형 데이터에 그 선이 아예 없는 경우.
    const have=Number.isFinite(t.daysAvail)?t.daysAvail:null;
    const detail=have!==null?` (현재 ${have}거래일 확보 · ${period}거래일 필요)`
                            :` (${period}거래일이 모이면 표시돼요)`;
    return `<div class="ma-card is-insufficient"><div class="ma-card-head">`+
      `<div><span class="ma-card-name">${meta.label}</span><span class="ma-card-mean">${meta.mean}</span></div>`+
      `<span class="ma-badge insufficient">데이터 부족</span></div>`+
      `<div class="ma-card-need">${MA_INSUFF_TEXT[period]}${detail}</div></div>`;
  }
  // ⭐ period일치가 다 안 쌓였으면(!full) "60일선" 대신 실제 일수를 그대로 이름표에 쓴다
  // (예: "54일선"). 예전 버그처럼 부족한 평균에 정식 기간 이름을 붙이지 않는다.
  const displayName=full?meta.label:`${effDays}일선`;
  const status=maStatus(price,ma);
  const statusLabel={above:'위',below:'아래',near:'근처'}[status]||'-';
  const posText=(MA_POSITION_TEXT[period]||{})[status]||'';
  const srText=(MA_SR_TEXT[period]||{})[status]||'';
  const slopeLabel=maSlopeLabel(slope);
  const disp=disparityInterpret(period,gap);
  // ⭐ 가독성 개선(2026-08-06): 줄마다 무슨 얘기인지 짧은 태그를 붙여 훑어 읽기 쉽게 한다.
  const lines=[];
  if(!full) lines.push(['안내',`아직 ${period}거래일이 안 차서 ${effDays}거래일로 계산했어요. ${period-effDays}거래일 더 쌓이면 정식 ${meta.label}이 돼요.`]);
  if(posText) lines.push(['위치',posText]);
  if(srText) lines.push(['지지/저항',srText]);
  if(slopeLabel) lines.push(['기울기',`<b>${slopeLabel}</b> — 선 자체가 ${slopeLabel==='상승'?'올라가는':(slopeLabel==='하락'?'내려가는':'거의 평행한')} 중이에요.`]);
  if(disp) lines.push(['이격도',disp.text]);
  return `<div class="ma-card${full?'':' is-provisional'}"><div class="ma-card-head">`+
    `<div><span class="ma-card-name">${displayName}${full?'':' <span class=\"ma-provisional-tag\">약식</span>'}</span>`+
    `<span class="ma-card-mean">${full?meta.mean:meta.mean+' · 정식 '+period+'일 채우는 중'}</span></div>`+
    `<span class="ma-badge ${status} ma-badge-info" tabindex="0" role="button" data-badge="${status}" aria-label="${statusLabel} 배지 설명 보기">${statusLabel}</span></div>`+
    `<div class="ma-card-val">${Math.round(ma).toLocaleString('ko-KR')}${unit}<small>${Number.isFinite(gap)?(gap>=0?'+':'')+gap.toFixed(1)+'%':''}</small></div>`+
    lines.map(([tag,text])=>`<div class="ma-card-line"><b class="ma-card-tag">${tag}</b>${text}</div>`).join('')+
    `</div>`;
}
/* 🧭 TARO 조합 해석 — 선을 하나씩 읽는 카드와 달리, 5개 선을 "함께" 읽어
   ① 정렬 상태(몇 개 위/아래) ② 단기·중기 조합 ③ 이격/과열 ④ 기울기 종합
   ⑤ 바로 위/아래 실제 가격대(저항·지지 후보) ⑥ 한 줄 결론까지 구체적으로 만든다.
   숫자와 가격을 반드시 함께 넣어 "그래서 얼마인데?"에 답한다. */
function maComboHTML(t,unit){
  unit=unit===undefined?'원':unit;
  const won=v=>Math.round(v).toLocaleString('ko-KR')+unit;
  const price=t.close;
  const periods=[5,20,60,120,200];
  const avail=periods.filter(p=>Number.isFinite(t['ma'+p]));
  if(!avail.length) return '';
  const nameOf=p=>{const w=maWindow(p,t);return w.full?MA_META[p].label:`${w.effDays}일선`;};
  // 120·200일선이 둘 다 약식이면 이름이 "90일선"으로 같아져 "90일선·90일선"처럼 중복돼 보인다.
  // 목록에 쓸 때만 같은 이름을 하나로 합친다(카드 쪽은 부제로 이미 구분된다).
  const joinNames=ps=>[...new Set(ps.map(nameOf))].join('·');
  const st=p=>maStatus(price,t['ma'+p]);
  const above=avail.filter(p=>st(p)==='above'), below=avail.filter(p=>st(p)==='below');
  const lines=[];

  // ① 전체 정렬 — 몇 개 선 위/아래/근처인지 한눈에
  // ⚠️ 'near'(±1% 이내)는 위도 아래도 아니다. 예전엔 near를 아래로 뭉뚱그려
  // "모두 위" 바로 다음 줄에 "모두 밑돌아"가 나오는 모순이 있었다.
  const nAbove=above.length, nBelow=below.length, nNear=avail.length-nAbove-nBelow;
  if(nAbove===avail.length) lines.push(`현재가 <b>${won(price)}</b> 기준으로 계산된 ${avail.length}개 이동평균선을 <b>모두 위</b>로 올라서 있어요. 여러 기간의 평균 매수단가보다 높은 자리라 전반적인 흐름은 우위에 있는 편이에요.`);
  else if(nBelow===avail.length) lines.push(`현재가 <b>${won(price)}</b> 기준으로 계산된 ${avail.length}개 이동평균선 <b>전부 아래</b>에 있어요. 단기부터 장기까지 평균 매수단가를 밑돌고 있어 매물 부담이 여러 겹으로 쌓인 상태예요.`);
  else{
    const parts=[];
    if(nAbove) parts.push(`${joinNames(above)} <b>위</b>`);
    if(nBelow) parts.push(`${joinNames(below)} <b>아래</b>`);
    if(nNear) parts.push(`${joinNames(avail.filter(p=>st(p)==='near'))}과는 <b>거의 같은 자리</b>`);
    lines.push(`현재가 <b>${won(price)}</b> 기준으로 ${parts.join(', ')}에 있어요. 기간마다 평가가 갈리는 전환 구간이에요.`);
  }

  // ①-보조 골든크로스·데드크로스 — compute_indicators.py가 계산해둔 cross5_20/cross20_60을
  // 그대로 문장으로 옮긴다(2026-08-07). 최근에 실제로 선이 뚫고 지나갔으면 그 사실을,
  // 아직 안 뚫렸어도 두 선이 눈에 띄게 좁혀지는 중이면 "임박" 가능성을 미리 알려준다.
  // ⭐ 2026-08-07: "데드크로스 나면 진짜 얼마나 떨어져요?"에 감이 아니라 숫자로 답하도록,
  // analyze_auto.py가 전 종목 누적 일봉에서 집계한 사후 통계(crossStats)를 같이 붙인다.
  // 실제로 계산해보니 데드크로스 뒤 20거래일 평균은 소폭 플러스(상승확률 50% 안팎)로,
  // "데드크로스=하락 확정"이 아니라는 걸 숫자로 보여준다 — 있는 통계를 그대로 전달할 뿐,
  // 새로 판단을 짓지 않는다.
  const crossStatText=(pairKey,direction)=>{
    const cs=(typeof AUTO_AN!=='undefined'&&AUTO_AN&&AUTO_AN.crossStats)||null; if(!cs) return '';
    const b=cs.buckets&&cs.buckets[pairKey+'_'+direction]; if(!b||!b.n) return '';
    const avg=b.sum/b.n, wr=Math.round(b.w/b.n*100), h=cs.horizonDays||20;
    const avgTxt=(avg>=0?'+':'')+avg.toFixed(1)+'%';
    return ` ${COVERAGE_TXT} 과거 통계로는 ${direction==='golden'?'골든':'데드'}크로스 이후 ${h}거래일 뒤 평균 ${avgTxt}(상승확률 ${wr}%, 표본 ${b.n.toLocaleString('ko-KR')}건)였어요.`;
  };
  const crossLine=(c,shortName,longName,pairKey)=>{
    if(!c) return null;
    if(c.event){
      const verb=c.event==='golden'?'골든크로스':'데드크로스';
      const dir=c.event==='golden'?'아래에서 위로 뚫고 올라가는':'위에서 아래로 뚫고 내려가는';
      const tail=c.event==='golden'?'오름세로 바뀔 수 있다는 신호예요.':'내림세로 바뀔 수 있다는 신호예요.';
      const when=c.daysAgo===0?'오늘':`${c.daysAgo}거래일 전`;
      return `${when} ${shortName}이 ${longName}을 ${dir} <b>${verb}</b>가 나왔어요. ${tail}${crossStatText(pairKey,c.event)}`;
    }
    if(c.near){
      const verb=c.near==='golden'?'골든크로스':'데드크로스';
      return `${shortName}과 ${longName}의 간격이 좁아지는 중이에요. 이대로 가면 <b>${verb} 가능성</b>이 있어요 — 실제로 뚫고 지나가는지 며칠 더 지켜보면 좋아요.`;
    }
    return null;
  };
  const cl1=crossLine(t.cross5_20,'5일선','20일선','5_20'); if(cl1) lines.push(cl1);
  const cl2=crossLine(t.cross20_60,'20일선','60일선','20_60'); if(cl2) lines.push(cl2);

  // ② 단기(5·20) vs 중기(60) 조합 — 가장 실전적으로 자주 쓰는 조합
  const s5=st(5), s20=st(20), s60=st(60);
  const pairText=(a,b,map)=>(a&&b)?map[a+'_'+b]:null;
  const t5_20=pairText(s5,s20,{
    above_above:'최근 1주(5일선)와 1개월(20일선) 평균을 함께 웃돌아 <b>단기 흐름이 안정적</b>이에요. 조정이 와도 20일선 부근이 1차 지지 역할을 해줄 수 있어요.',
    above_below:'5일선은 넘었지만 20일선은 아직 못 넘었어요. <b>단기 반등은 시작됐지만 월간 추세 회복은 미확인</b> 단계라, 20일선을 되찾고 유지하는지가 다음 확인 포인트예요.',
    above_near:'5일선 위로 올라섰고 20일선과는 거의 붙어 있어요. <b>월간 평균을 되찾기 직전</b>의 자리라 여기서 방향이 갈릴 수 있어요.',
    below_above:'20일선 위는 지키고 있지만 5일선 아래로 밀렸어요. <b>월간 추세 안에서의 단기 눌림</b>으로 볼 수 있는 자리예요.',
    below_below:'5일선·20일선을 모두 밑돌아 <b>단기 탄력이 약해진</b> 상태예요. 반등하더라도 두 선이 차례로 저항이 될 수 있어요.',
    below_near:'5일선 아래로 밀렸고 20일선과는 거의 붙어 있어요. <b>월간 평균을 지키느냐가 관건</b>인 자리예요.',
    near_above:'5일선과는 거의 같은 자리이고 20일선 위는 지키고 있어요. <b>단기 숨 고르기</b> 구간으로 볼 수 있어요.',
    near_below:'5일선과는 붙어 있지만 20일선은 아직 아래예요. <b>단기 바닥 다지기</b> 단계일 수 있어요.',
    near_near:'5일선·20일선 모두와 거의 같은 자리예요. <b>방향을 정하기 전 응축</b> 구간이에요.',
  });
  if(t5_20) lines.push(t5_20);
  const t20_60=pairText(s20,s60,{
    above_above:'단기(20일)와 중기(60일) 추세가 <b>함께 살아있어</b> 방향이 한쪽으로 정렬된 편이에요.',
    above_below:'20일선은 넘었지만 60일선은 아래예요. <b>단기 반등 대비 중기 추세 회복은 아직 부족</b>할 수 있어요.',
    above_near:'20일선 위에서 60일선에 바짝 다가섰어요. <b>중기 추세 복귀를 시험하는</b> 자리예요.',
    below_above:'중기(60일) 추세는 유지 중인데 최근 한 달만 밀렸어요. <b>중기 상승 흐름 속 조정</b>일 가능성이 있어요.',
    below_below:'20일선·60일선을 모두 밑돌아 <b>단기와 중기가 함께 약한</b> 구간이에요.',
    below_near:'20일선은 밑돌지만 60일선과는 거의 같은 자리예요. <b>중기 평균선이 마지막 버팀목</b>이 되는 자리예요.',
    near_above:'20일선과 붙어 있고 60일선 위는 지키고 있어요. <b>중기 흐름은 유효한 눌림</b>으로 볼 수 있어요.',
    near_below:'20일선과는 붙어 있지만 60일선은 아직 아래예요. <b>중기 회복까지는 갈 길이 남은</b> 상태예요.',
    near_near:'20일선·60일선 모두와 거의 같은 자리라 <b>중기 방향이 팽팽하게 맞선</b> 구간이에요.',
  });
  if(t20_60) lines.push(t20_60);

  // ③ 60일 이격 — 평균회귀 관점(숫자 포함)
  if(Number.isFinite(t.ma60Gap)){
    const g=t.ma60Gap;
    if(g>=30) lines.push(`60일선 대비 <b>+${g.toFixed(1)}%</b>로 중기 평균에서 크게 벌어져 있어요. 평균회귀·차익실현 압력이 커지는 구간이라 <b>신규 추격매수는 특히 신중</b>할 필요가 있어요.`);
    else if(g>=20) lines.push(`60일선 대비 <b>+${g.toFixed(1)}%</b>로 다소 과열된 편이에요. 추격보다는 눌림을 기다리는 편이 부담이 적을 수 있어요.`);
    else if(g<=-20) lines.push(`60일선 대비 <b>${g.toFixed(1)}%</b>로 중기 평균에서 크게 밀려나 있어요. 추세 약화 신호일 수도, 과매도 되돌림 후보일 수도 있어 <b>거래량과 함께</b> 봐야 해요.`);
  }

  // ④ 기울기 종합 — 선 자체가 어디로 가고 있나
  const slopes=periods.map(p=>[p,maSlopeLabel(t['ma'+p+'Slope'])]).filter(x=>x[1]);
  if(slopes.length){
    const ups=[...new Set(slopes.filter(x=>x[1]==='상승').map(x=>nameOf(x[0])))];
    const downs=[...new Set(slopes.filter(x=>x[1]==='하락').map(x=>nameOf(x[0])))];
    const many=arr=>arr.length>1?'모두 ':'';   // 선이 하나뿐인데 "모두"라고 쓰면 어색하다
    if(ups.length&&!downs.length) lines.push(`기울기를 보면 ${ups.join('·')}이 <b>${many(ups)}상승 방향</b>이라, 가격이 잠시 흔들려도 추세 자체는 위를 향하고 있어요.`);
    else if(downs.length&&!ups.length) lines.push(`기울기를 보면 ${downs.join('·')}이 <b>${many(downs)}하락 방향</b>이에요. 반등이 나와도 추세가 돌아섰다고 보려면 선들이 다시 고개를 드는지 확인이 필요해요.`);
    else if(ups.length&&downs.length) lines.push(`${ups.join('·')}은 오르고 ${downs.join('·')}은 내려가는 <b>엇갈린 기울기</b>예요. 짧은 흐름과 긴 흐름의 방향이 달라 변동성이 커질 수 있어요.`);
  }

  // ⑤ 바로 위/아래 선 = 저항·지지 후보를 실제 가격으로
  const upper=avail.filter(p=>t['ma'+p]>price).sort((a,b)=>t['ma'+a]-t['ma'+b])[0];
  const lower=avail.filter(p=>t['ma'+p]<price).sort((a,b)=>t['ma'+b]-t['ma'+a])[0];
  const sr=[];
  if(lower) sr.push(`아래로는 <b>${nameOf(lower)} ${won(t['ma'+lower])}</b>(현재가 대비 ${((t['ma'+lower]/price-1)*100).toFixed(1)}%)이 가장 가까운 지지 후보`);
  if(upper) sr.push(`위로는 <b>${nameOf(upper)} ${won(t['ma'+upper])}</b>(+${((t['ma'+upper]/price-1)*100).toFixed(1)}%)이 가장 가까운 저항 후보`);
  if(sr.length) lines.push(sr.join('이고, ')+'예요. 절대적인 선은 아니지만 많은 투자자가 함께 보는 자리라 반응이 나오기 쉬워요.');

  // ⑥ 한 줄 결론 — ★ 표시로 다른 줄과 구분해 결론부터 눈에 띄게 한다
  const score=above.length-below.length;
  const concl=score>=2?'종합하면 <b>여러 기간의 흐름이 위쪽으로 정렬</b>된 편이에요. 다만 이격이 벌어질수록 추격 부담은 커진다는 점을 같이 보세요.'
    :score<=-2?'종합하면 <b>여러 기간의 흐름이 아래쪽으로 눌린</b> 상태예요. 반등을 보더라도 가까운 이동평균선을 회복하고 지키는지부터 확인하는 편이 안전해요.'
    :'종합하면 <b>방향이 아직 한쪽으로 정리되지 않은</b> 구간이에요. 어느 선을 확실히 넘거나 잃는지가 다음 방향의 힌트가 될 수 있어요.';
  const conclIdx=lines.length;
  lines.push(concl);

  const missing=periods.filter(p=>!Number.isFinite(t['ma'+p]));
  if(missing.length) lines.push(`<span class="ma-combo-mut">${missing.map(p=>MA_META[p].label).join('·')}은 아직 거래일이 모자라 이번 해석에서 빠졌어요.</span>`);

  // ⭐ 가독성 개선(2026-08-06): 각 줄 앞에 · 각주를, 결론 줄엔 ★ 각주를 달아 훑어 읽기 쉽게 한다.
  return `<div class="ma-combo"><div class="ma-combo-head">TARO 조합 해석</div><ul>${lines.map((l,i)=>`<li class="${i===conclIdx?'ma-combo-star':'ma-combo-dot'}">${l}</li>`).join('')}</ul></div>`;
}
function maRiskChipsHTML(t){
  const chips=[];
  if(Number.isFinite(t.ma60Gap)&&t.ma60Gap>=30) chips.push(['bad','60일선 대비 과열']);
  else if(Number.isFinite(t.ma60Gap)&&t.ma60Gap>=20) chips.push(['warn','60일선 이격 확대']);
  if(maStatus(t.close,t.ma20)==='below') chips.push(['warn','20일선 이탈']);
  if(maSlopeLabel(t.ma120Slope)==='하락') chips.push(['warn','120일선 하락 전환']);
  // ⚠️ 200일선이 아직 약식(정식 200거래일 미달)이면 "200일선 하회"라는 무게감 있는 표현을
  // 붙이지 않는다 — 확보된 며칠짜리 평균 아래에 있는 건 흔한 일이라 과장된 경고가 된다.
  if(t.ma200Full&&maStatus(t.close,t.ma200)==='below') chips.push(['warn','200일선 하회']);
  if(!chips.length) return '';
  return `<div class="ma-risk-row">${chips.map(([tone,label])=>`<span class="ma-risk-chip ${tone}">${label}</span>`).join('')}</div>`;
}
function taroMAExplainHTML(t,unit){
  if(!t) return '';
  const cards=[5,20,60,120,200].map(p=>maCardHTML(p,t,unit)).join('');
  const combo=maComboHTML(t,unit);
  const risk=maRiskChipsHTML(t);
  const provisional=[120,200].filter(p=>Number.isFinite(t['ma'+p])&&!t['ma'+p+'Full']);
  const note=provisional.length?`<div class="ma-insufficient-note">📏 ${provisional.map(p=>MA_META[p].label).join('·')}은 아직 정식 기간이 다 안 쌓여 확보된 ${t.daysAvail||0}거래일만으로 대신 계산한 「약식」 값이에요. 실제보다 부풀리거나 줄이지 않고, 확보된 만큼만 정직하게 평균 낸 숫자예요 — 기간이 다 채워지면 자동으로 정식 값으로 바뀌어요.</div>`:'';
  return `<div class="ma-explain"><div class="ma-explain-head">이동평균선으로 보는 추세</div>`+
    `<div class="ma-explain-sub">5·20·60·120·200일 이동평균으로 지금 가격이 단기·중기·장기 흐름의 어디쯤 있는지 살펴봐요.</div>`+
    `<div class="ma-cards">${cards}</div>${combo}${risk}${note}</div>`;
}

/* ═══════════════════════════════════════════════════════════════════
   📈 코스피·코스닥 캔들차트 + 펼치기 패널 (TARO 이동평균 시스템 3·4단계, 2026-08-06)
   · 데이터: indicators.js의 INDICATORS.indicesTech(요약 지표, 즉시 로드) +
             index_history.js의 INDEX_HISTORY(일별 OHLCV, 펼칠 때만 지연 로드)
   · MA5/20/60/120/200 카드·조합해석·위험칩은 taroMAExplainHTML을 그대로 재사용한다
     (종목이든 지수든 tech 오브젝트 모양이 같아서 가능 — 로직 중복 없음).
   ═══════════════════════════════════════════════════════════════════ */
const IDX_META={KOSPI:{label:'KR 코스피'},KOSDAQ:{label:'KR 코스닥'}};
// 한글 조사(은/는) 자동 선택 — 코스피(모음 받침 없음)=는, 코스닥(ㄱ받침)=은 처럼 종성 유무로 갈린다.
function josaEunNeun(word){
  const c=String(word).charCodeAt(String(word).length-1);
  if(c<0xAC00||c>0xD7A3) return '는';
  return (c-0xAC00)%28!==0?'은':'는';
}
// 한글 조사(이/가) 자동 선택 — 종합 판단 Hero 한줄평(verdictHeadline)에서 쓴다.
function josaIGa(word){
  const c=String(word).charCodeAt(String(word).length-1);
  if(c<0xAC00||c>0xD7A3) return '가';
  return (c-0xAC00)%28!==0?'이':'가';
}
const MA_LINE_COLOR={5:'#3AACA0',20:'#E58A32',60:'#8367DB',120:'#B97A93',200:'#5A616B'};
function idxWon(v){ return Number.isFinite(v)?v.toLocaleString('ko-KR',{minimumFractionDigits:2,maximumFractionDigits:2}):'-'; }
/* 지수 상태 배지 — 위치·기울기·이격을 종합해 한 단어로 압축 */
function indexStateBadge(t){
  if(!t) return {label:'기록 쌓는 중',tone:'neutral'};
  const s60=maStatus(t.close,t.ma60), slope60=maSlopeLabel(t.ma60Slope);
  if(Number.isFinite(t.ma60Gap)&&t.ma60Gap>=15) return {label:'과열 주의',tone:'warn'};
  if(s60==='above'&&slope60==='상승') return {label:'중기 추세 양호',tone:'good'};
  if(s60==='below'&&slope60==='하락') return {label:'중기 조정',tone:'bad'};
  const s5=maStatus(t.close,t.ma5);
  if(s5==='above') return {label:'단기 강세',tone:'good'};
  if(s5==='below') return {label:'단기 약세',tone:'bad'};
  return {label:'방향 탐색',tone:'neutral'};
}
// ⭐ 2026-08-06: "5일선 돌파, 20일선까지 얼마 남았다" 식의 진행률 한 줄 평가.
// 종목별 하드코딩 없이 t(tech)의 ma{P}/ma{P}Gap만으로 계산하는 순수 함수.
const MA_MILESTONE_TEXT={
  5:'단기 탄력을 확인하는 첫 관문이에요',
  20:'20일선을 넘으면 단기 안정권에 들어섰다고 볼 수 있어요',
  60:'60일선을 넘으면 중기 추세가 살아났다고 볼 수 있어요',
  120:'120일선을 넘으면 장기 흐름이 개선됐다고 볼 수 있어요',
  200:'200일선을 넘으면 구조적인 장기 안정권에 진입했다고 볼 수 있어요',
};
function indexProgressLine(name,t){
  if(!t||!Number.isFinite(t.close)) return '';
  const label=IDX_META[name].label;
  const rows=[5,20,60,120,200].filter(p=>Number.isFinite(t['ma'+p]))
    .map(p=>({p,ma:t['ma'+p],st:maStatus(t.close,t['ma'+p])})).filter(r=>r.st);
  if(!rows.length) return '';
  const above=rows.filter(r=>r.st==='above');
  const next=rows.find(r=>r.st!=='above');
  // ⚠️ 이 문자열은 idx-panel-teaser에서 esc()로 이스케이프된 뒤 그대로 텍스트로 찍힌다
  // (요약행은 사용자가 펼치기 전에도 보이는 자리라 안전하게 순수 텍스트로만 구성한다).
  if(!next){
    const top=rows[rows.length-1];
    return `현재 ${label}${josaEunNeun(label)} 계산 가능한 이동평균선을 모두 돌파한 상태예요. ${maDisplayName(top.p,t)} 위에서 흐름을 지키는지가 다음 관전 포인트예요.`;
  }
  const gapPct=(next.ma/t.close-1)*100;
  const gapTxt=next.st==='near'?'거의 다 왔어요':`약 ${Math.abs(gapPct).toFixed(1)}% 남았어요`;
  const brokenNames=[...new Set(above.map(r=>maDisplayName(r.p,t)))].join('·');
  const brokenPart=brokenNames?`${brokenNames} 돌파하며 `:'';
  const milestone=MA_MILESTONE_TEXT[next.p]||`${maDisplayName(next.p,t)}을 넘으면 흐름이 한 단계 개선됐다고 볼 수 있어요`;
  // gapTxt는 '남았어요'·'거의 다 왔어요'로 끝나는 완결 문장이라, 쉼표로 이으면 비문이 된다.
  return `현재 ${brokenPart}${maDisplayName(next.p,t)} 돌파까지 ${gapTxt}. ${milestone}.`;
}
function indexSummaryBullets(name,t){
  if(!t) return [];
  const label=IDX_META[name].label, lines=[];
  const s5=maStatus(t.close,t.ma5), s20=maStatus(t.close,t.ma20), s60=maStatus(t.close,t.ma60);
  if(s5) lines.push(`현재 ${label}${josaEunNeun(label)} 5일선 ${({above:'위에 있어 단기 탄력이 살아 있어요',below:'아래로 내려와 단기 탄력이 약해졌어요',near:'근처에서 방향을 탐색 중이에요'})[s5]}.`);
  if(s20) lines.push(`20일선 ${s20==='above'?'위에 있어 최근 한 달 흐름은 안정적인 편이에요':(s20==='below'?'아래에 있어 최근 한 달 평균 매수 심리는 위축될 수 있어요':'근처예요')}.`);
  const slope60=maSlopeLabel(t.ma60Slope);
  if(slope60) lines.push(`60일선이 ${slope60==='상승'?'상승 중이라 중기 추세가 유지되는 편이에요':(slope60==='하락'?'하락으로 꺾이며 중기 추세 둔화가 나타나고 있어요':'거의 평행하게 움직이고 있어요')}.`);
  else if(s60) lines.push(`${t.ma60Full?'60일선':t.ma60Days+'일선(약식)'} ${s60==='above'?'위에 있어요':(s60==='below'?'아래에 있어요':'근처예요')}.`);
  const s200=maStatus(t.close,t.ma200);
  if(s200&&t.ma200Full) lines.push(`200일선 ${s200==='above'?'위에 있어 구조적 장기 추세는 아직 완전히 훼손되지 않았어요':'아래에 있어 장기 추세 회복이 아직 확인되지 않았어요'}.`);
  return lines.slice(0,4);
}
/* 접힌 요약행 — indicesTech만으로 즉시 렌더(네트워크 추가 요청 없음) */
function indexPanelRowHTML(name){
  const t=indicesTech(name);
  const live=(typeof LIVE_DATA!=='undefined'&&LIVE_DATA.indices)?LIVE_DATA.indices[name]:null;
  const meta=IDX_META[name];
  const value=live?live.value:(t&&t.close);
  const rate=live?live.rate:null;
  const change=live?live.change:null;
  const badge=indexStateBadge(t);
  const teaser=t?(indexProgressLine(name,t)||indexSummaryBullets(name,t)[0]||'이동평균 해석을 준비하고 있어요.')
    :`${meta.label} 일별 기록을 모으는 중이에요. 매일 자동으로 하루치씩 쌓이면 이동평균과 차트가 여기에 나타나요.`;
  return `<details class="idx-panel" data-idx="${name}">`+
    `<summary class="idx-panel-summary">`+
      `<span class="idx-panel-name">${meta.label}</span>`+
      `<span class="idx-panel-val">${idxWon(value)}${Number.isFinite(change)?`<em class="${change>0?'up':change<0?'down':''}">${change>0?'▲':change<0?'▼':'•'} ${Math.abs(change).toFixed(2)} (${rate>0?'+':''}${Number.isFinite(rate)?rate.toFixed(2):'-'}%)</em>`:''}</span>`+
      `<span class="idx-badge tone-${badge.tone}">${badge.label}</span>`+
      `<span class="idx-panel-arrow">▾</span>`+
    `</summary>`+
    `<div class="idx-panel-teaser">${esc(teaser)}</div>`+
    `<div class="idx-panel-body" data-idx-body="${name}"><p class="idx-loading">펼치면 상세 차트를 불러와요…</p></div>`+
  `</details>`;
}
function renderIndexPanels(){
  const box=document.getElementById('idxPanels'); if(!box) return;
  box.innerHTML=`<div class="idx-panels-head">코스피·코스닥 상세 <span class="idx-panels-sub">눌러서 이동평균·차트를 펼쳐보세요</span></div>`+
    indexPanelRowHTML('KOSPI')+indexPanelRowHTML('KOSDAQ');
}
/* 펼쳤을 때: index_history.js를 지연 로드한 뒤 MA해석+차트를 채운다(1회만) */
document.getElementById('idxPanels').addEventListener('toggle',e=>{
  const det=e.target.closest('.idx-panel'); if(!det||!det.open) return;
  const name=det.dataset.idx, body=det.querySelector('[data-idx-body]');
  if(!body||body.dataset.loaded) return;
  body.dataset.loaded='1';
  const t=indicesTech(name);
  const explain=t?taroMAExplainHTML(t,'p'):'';   // 지수는 '원'이 아니라 포인트(p)
  body.innerHTML=`<div class="idx-chart-slot" id="idxChart-${name}"><p class="idx-loading">차트를 불러오는 중…</p></div>${explain}`;
  // 지수 일별 기록(index_history.js)은 2026-08-06 신설이라, 수집 러너가 한 바퀴 돌기
  // 전까지는 파일 자체가 없다. 그때 "불러오지 못했어요"라는 오류 문구를 띄우면 고장난
  // 것처럼 보이므로, 실제 상태(첫 수집 대기 중)를 그대로 설명한다.
  const pending=(msg)=>{
    const slot=document.getElementById('idxChart-'+name); if(!slot) return;
    slot.innerHTML=`<div class="idx-pending"><b>${IDX_META[name].label} 일별 기록을 모으는 중이에요</b>`+
      `<span>${msg}</span>`+
      `<span>지수 차트는 매일 장중 자동 수집으로 하루치씩 쌓여요. 기록이 2거래일 이상 모이면 이 자리에 캔들차트와 이동평균선이 자동으로 나타나요.</span></div>`;
  };
  GaeoFeatures.load('indexHist').then(()=>{
    const hist=(typeof INDEX_HISTORY!=='undefined')?INDEX_HISTORY[name]:null;
    const days=flattenIndexHistory(hist);
    if(days.length<2){ pending('아직 그릴 수 있을 만큼 거래일이 쌓이지 않았어요.'); return; }
    const slot=document.getElementById('idxChart-'+name); if(!slot) return;
    slot.innerHTML=ohlcChartHTML('idx-'+name,days);
    wireOhlcChart('idx-'+name,days);
  }).catch(()=>pending('첫 수집이 아직 끝나지 않았어요.'));
},true);
function flattenIndexHistory(pages){
  if(!pages) return [];
  const rows={};
  pages.forEach(p=>(p.days||[]).forEach(d=>{ if(d&&d.date) rows[d.date]=d; }));
  return Object.keys(rows).sort().map(k=>rows[k]);
}
function smaSeries(vals,period){
  return vals.map((_,i)=>{
    if(i<period-1) return null;
    let sum=0; for(let k=i-period+1;k<=i;k++) sum+=vals[k];
    return sum/period;
  });
}
/* ---- 캔들+거래량+MA오버레이+범례토글+툴팁 차트 (외부 라이브러리 없이 인라인 SVG) ---- */
function ohlcChartHTML(uid,days,fmt){
  fmt=fmt||idxWon;   // ⭐ 2026-08-07: 지수는 소수점 포인트(idxWon), 개별 종목은 정수+'원'을 쓰도록 분리
  const n=days.length;
  const closes=days.map(d=>Number.isFinite(d.close)?d.close:null);
  const hasOHLC=days.map(d=>Number.isFinite(d.open)&&Number.isFinite(d.high)&&Number.isFinite(d.low));
  const closesForMA=closes.map(c=>Number.isFinite(c)?c:closes.find(Boolean)||0);
  const maLines={}; [5,20,60,120,200].forEach(p=>{ maLines[p]=smaSeries(closesForMA,p); });
  const vols=days.map(d=>Number.isFinite(d.volume)?d.volume:0);
  const W=760,H=300,padL=8,padR=54,padT=12,padB=16;
  const volH=54, chartH=H-volH-padT-padB-10;
  const highs=days.map((d,i)=>Number.isFinite(d.high)?d.high:closes[i]);
  const lows=days.map((d,i)=>Number.isFinite(d.low)?d.low:closes[i]);
  const allVals=[...highs,...lows,...Object.values(maLines).flat()].filter(Number.isFinite);
  let lo=Math.min(...allVals),hi=Math.max(...allVals); const pad=(hi-lo||1)*.06; lo-=pad; hi+=pad;
  const plotW=W-padL-padR;
  const x=i=>padL+plotW*(n>1?i/(n-1):0.5);
  const y=v=>padT+chartH*(1-(v-lo)/(hi-lo||1));
  const cw=Math.max(1.4,Math.min(9,plotW/n*0.62));
  const up='var(--krup)',down='var(--krdn)';
  // ⭐ 2026-08-07: OHLC가 없는(종가만 있는) 옛 기록은 캔들 대신 점 하나만 찍히는데,
  // 점이 작아서(r=1.6) 그런 날이 대부분이면 차트가 거의 빈 것처럼 보이는 문제가 있었다.
  // 종가를 잇는 얇은 배경선을 항상 먼저 깔아서 — 캔들이 몇 개뿐이어도 — 가격 흐름 자체는
  // 항상 눈에 보이게 한다(캔들·점은 그 위에 그대로 겹쳐 그린다).
  let closeLine='',clOpen=false;
  closes.forEach((c,i)=>{
    if(!Number.isFinite(c)){clOpen=false;return;}
    closeLine+=(clOpen?'L':'M')+x(i).toFixed(1)+' '+y(c).toFixed(1)+' ';
    clOpen=true;
  });
  closeLine=closeLine.trim()?`<path class="ohlc-close-line" d="${closeLine.trim()}" fill="none" stroke="var(--dim)" stroke-width="1.3" stroke-linejoin="round" opacity=".5"/>`:'';
  let candles='';
  days.forEach((d,i)=>{
    const cx=x(i), c=closes[i]; if(!Number.isFinite(c)) return;
    const isUp=i>0&&Number.isFinite(closes[i-1])?c>=closes[i-1]:true;
    const col=isUp?up:down;
    if(hasOHLC[i]){
      const yo=y(d.open),yh=y(d.high),yl=y(d.low),yc=y(c);
      candles+=`<line x1="${cx.toFixed(1)}" y1="${yh.toFixed(1)}" x2="${cx.toFixed(1)}" y2="${yl.toFixed(1)}" stroke="${col}" stroke-width="1" data-idx="${i}"/>`+
        `<rect x="${(cx-cw/2).toFixed(1)}" y="${Math.min(yo,yc).toFixed(1)}" width="${cw.toFixed(1)}" height="${Math.max(1,Math.abs(yc-yo)).toFixed(1)}" fill="${col}" data-idx="${i}"/>`;
    }else{
      // OHLC가 없는 옛 기록(종가만 있음)은 캔들 대신 얇은 점으로 표시(없는 값을 지어내지 않음)
      candles+=`<circle cx="${cx.toFixed(1)}" cy="${y(c).toFixed(1)}" r="1.6" fill="${col}" opacity=".7" data-idx="${i}"/>`;
    }
  });
  const maPaths=[5,20,60,120,200].map(p=>{
    const arr=maLines[p]; let path='',open=false;
    arr.forEach((v,i)=>{ if(!Number.isFinite(v)){open=false;return;} path+=(open?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)+' '; open=true; });
    return `<path class="ohlc-ma" data-ma="${p}" d="${path.trim()}" fill="none" stroke="${MA_LINE_COLOR[p]}" stroke-width="1.5" stroke-linejoin="round"/>`;
  }).join('');
  const volMax=Math.max(...vols,1);
  const volY0=padT+chartH+10;
  const volBars=days.map((d,i)=>{
    const vh=vols[i]/volMax*volH, cx=x(i);
    const c=closes[i], isUp=i>0&&Number.isFinite(closes[i-1])?c>=closes[i-1]:true;
    return `<rect x="${(cx-cw/2).toFixed(1)}" y="${(volY0+volH-vh).toFixed(1)}" width="${cw.toFixed(1)}" height="${vh.toFixed(1)}" fill="${isUp?up:down}" opacity=".38"/>`;
  }).join('');
  const grid=[0,.25,.5,.75,1].map(r=>{const yy=padT+chartH*r,val=hi-(hi-lo)*r;
    return `<line x1="${padL}" y1="${yy.toFixed(1)}" x2="${W-padR}" y2="${yy.toFixed(1)}" stroke="var(--line)" stroke-width="1"/>`+
      `<text x="${W-padR+6}" y="${(yy+3).toFixed(1)}" fill="var(--faint)" font-size="9">${fmt(val)}</text>`;
  }).join('');
  const tickIdx=n>=3?[0,Math.floor((n-1)/2),n-1]:[0,n-1];
  const ticks=[...new Set(tickIdx)].map((i,k)=>`<text x="${x(i).toFixed(1)}" y="${(volY0+volH+11).toFixed(1)}" text-anchor="${k===0?'start':(i===n-1?'end':'middle')}" fill="var(--faint)" font-size="9">${(days[i].date||'').slice(5)}</text>`).join('');
  // ⭐ 2026-08-06: 지수 일별 기록이 아직 짧으면(예: 12거래일) 20·60·120·200일선은
  // smaSeries가 계산 자체를 못 해 선이 안 그려진다 — 이건 정상 동작이지만, 범례 칩이
  // 눌러지는 것처럼 그대로 보이면 "고장났나?" 오해를 산다. 그려진 선이 없는 기간은
  // 칩을 비활성화하고, 부족한 기간을 안내 문구로 알려준다.
  const availMA=[5,20,60,120,200].filter(p=>maLines[p].some(Number.isFinite));
  const unavailMA=[5,20,60,120,200].filter(p=>!availMA.includes(p));
  const legend=[5,20,60,120,200].map(p=>{
    const has=availMA.includes(p);
    return has
      ? `<button type="button" class="ohlc-legend-item on" data-ma="${p}" style="--lc:${MA_LINE_COLOR[p]}"><i></i>${p}일</button>`
      : `<button type="button" class="ohlc-legend-item disabled" data-ma="${p}" disabled title="아직 ${p}거래일이 안 쌓여서 못 그려요(현재 ${n}거래일)"><i></i>${p}일</button>`;
  }).join('');
  const shortNote=unavailMA.length
    ? `<div class="ohlc-short-note">📏 현재 ${n}거래일치만 쌓여서 ${unavailMA.map(p=>p+'일선').join('·')}은 아직 못 그려요. 매일 하루치씩 쌓이면 순서대로(짧은 선부터) 나타나요.</div>` : '';
  return `<div class="ohlc-wrap" id="ohlc-${uid}">`+
    `<div class="ohlc-legend"><button type="button" class="ohlc-legend-item on" data-ma="price" style="--lc:var(--ink)"><i></i>종가/캔들</button>${legend}</div>`+
    shortNote+
    `<div class="ohlc-svg-holder">`+
      `<svg class="ohlc-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="최근 ${n}거래일 캔들차트와 이동평균선">`+
        `${grid}${closeLine}<g class="ohlc-candles">${candles}</g>${maPaths}${volBars}${ticks}`+
        `<line class="ohlc-crosshair" x1="0" y1="${padT}" x2="0" y2="${volY0+volH}" stroke="var(--dim)" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>`+
      `</svg>`+
      `<div class="ohlc-tooltip" hidden></div>`+
      `<div class="ohlc-hit" data-uid="${uid}"></div>`+
    `</div>`+
  `</div>`;
}
function wireOhlcChart(uid,days,fmt){
  fmt=fmt||idxWon;
  const wrap=document.getElementById('ohlc-'+uid); if(!wrap) return;
  const svg=wrap.querySelector('.ohlc-svg'), hit=wrap.querySelector('.ohlc-hit'), tip=wrap.querySelector('.ohlc-tooltip');
  const cross=wrap.querySelector('.ohlc-crosshair');
  const n=days.length, W=760, padL=8, padR=54;
  const closes=days.map(d=>d.close);
  const move=clientX=>{
    const rect=hit.getBoundingClientRect();
    const ratio=Math.max(0,Math.min(1,(clientX-rect.left)/rect.width));
    const svgX=padL+(W-padL-padR)*ratio;
    const i=Math.max(0,Math.min(n-1,Math.round((svgX-padL)/(W-padL-padR)*(n-1))));
    const d=days[i]; if(!d) return;
    const xPct=((padL+(W-padL-padR)*(n>1?i/(n-1):0.5))/W*100).toFixed(2);
    cross.setAttribute('x1',(padL+(W-padL-padR)*(n>1?i/(n-1):0.5)).toFixed(1));
    cross.setAttribute('x2',(padL+(W-padL-padR)*(n>1?i/(n-1):0.5)).toFixed(1));
    cross.setAttribute('opacity','.7');
    const prev=days[i-1];
    const chg=prev&&Number.isFinite(prev.close)?((d.close-prev.close)/prev.close*100):null;
    tip.hidden=false;
    tip.style.left=xPct+'%';
    tip.style.left=Math.min(78,Math.max(2,parseFloat(xPct)))+'%';
    tip.innerHTML=`<b>${esc(d.date||'')}</b>`+
      (Number.isFinite(d.open)?`<span>시가 ${fmt(d.open)}</span>`:'')+
      (Number.isFinite(d.high)?`<span>고가 ${fmt(d.high)}</span>`:'')+
      (Number.isFinite(d.low)?`<span>저가 ${fmt(d.low)}</span>`:'')+
      `<span>종가 ${fmt(d.close)}${chg!==null?` <em class="${chg>0?'up':chg<0?'down':''}">${chg>0?'+':''}${chg.toFixed(2)}%</em>`:''}</span>`+
      (Number.isFinite(d.volume)?`<span>거래량 ${Math.round(d.volume).toLocaleString('ko-KR')}</span>`:'');
  };
  hit.addEventListener('pointermove',e=>move(e.clientX));
  hit.addEventListener('pointerleave',()=>{ tip.hidden=true; cross.setAttribute('opacity','0'); });
  hit.addEventListener('touchmove',e=>{ if(e.touches[0]) move(e.touches[0].clientX); },{passive:true});
  wrap.querySelectorAll('.ohlc-legend-item').forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.classList.toggle('on');
      const ma=btn.dataset.ma;
      const on=btn.classList.contains('on');
      if(ma==='price'){ svg.querySelector('.ohlc-candles').style.display=on?'':'none'; }
      else{ const p=svg.querySelector(`.ohlc-ma[data-ma="${ma}"]`); if(p) p.style.display=on?'':'none'; }
    });
  });
}
renderIndexPanels();

// ---------- TARO 기술적 분석 터미널: 실제 종가로 가격·MA·밴드·RSI·MACD를 계산 ----------
function taroChartHTML(code){
  const ind=liveInd(code); const t=ind&&ind.tech; if(!t) return '';
  const days=flatCloses(code); if(days.length<2) return '';
  const closes=days.map(d=>d.c), start=Math.max(0,closes.length-60);
  const sma=(arr,n)=>arr.map((_,i)=>i<n-1?null:arr.slice(i-n+1,i+1).reduce((a,b)=>a+b,0)/n);
  const ema=(arr,n)=>{const k=2/(n+1),out=[];let value=arr[0];arr.forEach((v,i)=>{value=i?v*k+value*(1-k):v;out.push(value)});return out};
  const ma20=sma(closes,20), ma60=sma(closes,60);
  const bb=closes.map((_,i)=>{if(i<19)return null;const s=closes.slice(i-19,i+1),m=s.reduce((a,b)=>a+b,0)/20;
    const sd=Math.sqrt(s.reduce((a,b)=>a+(b-m)*(b-m),0)/20);return {u:m+2*sd,l:m-2*sd}});
  const ema12=ema(closes,12),ema26=ema(closes,26),macd=closes.map((_,i)=>ema12[i]-ema26[i]),signal=ema(macd,9);
  const viewDays=days.slice(start),price=closes.slice(start);
  let v20=ma20.slice(start),v60=ma60.slice(start),vbb=bb.slice(start);
  if(!v20.some(Number.isFinite)&&Number.isFinite(t.ma20))v20=price.map(()=>t.ma20);
  if(!v60.some(Number.isFinite)&&Number.isFinite(t.ma60))v60=price.map(()=>t.ma60);
  if(!vbb.some(Boolean)&&t.bb&&Number.isFinite(t.bb.upper)&&Number.isFinite(t.bb.lower))vbb=price.map(()=>({u:t.bb.upper,l:t.bb.lower}));
  const W=680,H=174,L=8,R=78,T=9,B=24,plotW=W-L-R,plotH=H-T-B;
  const allVals=[...price,...v20,...v60,...vbb.flatMap(v=>v?[v.u,v.l]:[])].filter(Number.isFinite);
  let lo=Math.min(...allVals),hi=Math.max(...allVals);const pad=(hi-lo||1)*.08;lo-=pad;hi+=pad;
  const x=i=>L+plotW*(i/Math.max(1,price.length-1)),y=v=>T+plotH*(1-(v-lo)/(hi-lo||1));
  const path=(vals)=>{let open=false;return vals.map((v,i)=>{if(!Number.isFinite(v)){open=false;return ''}const cmd=open?'L':'M';open=true;return `${cmd}${x(i).toFixed(1)} ${y(v).toFixed(1)}`}).join(' ')};
  const closePath=path(price),area=`${closePath} L${x(price.length-1).toFixed(1)} ${(H-B).toFixed(1)} L${x(0).toFixed(1)} ${(H-B).toFixed(1)} Z`;
  const validBB=vbb.map((v,i)=>v?{...v,i}:null).filter(Boolean);
  const bandPath=validBB.length?`M${validBB.map(v=>`${x(v.i).toFixed(1)} ${y(v.u).toFixed(1)}`).join(' L')} L${validBB.slice().reverse().map(v=>`${x(v.i).toFixed(1)} ${y(v.l).toFixed(1)}`).join(' L')} Z`:'';
  const grid=[0,.25,.5,.75,1].map(p=>{const yy=T+plotH*p,val=hi-(hi-lo)*p;return `<line x1="${L}" y1="${yy.toFixed(1)}" x2="${W-R}" y2="${yy.toFixed(1)}" stroke="var(--line)" stroke-width="1"/><text x="${W-R+8}" y="${(yy+3).toFixed(1)}" fill="var(--faint)" font-size="9">${Math.round(val).toLocaleString('ko-KR')}</text>`}).join('');
  const tickIdx=[0,Math.floor((price.length-1)/2),price.length-1];
  const ticks=tickIdx.map((i,n)=>`<text x="${x(i).toFixed(1)}" y="${H-5}" text-anchor="${n===0?'start':n===2?'end':'middle'}" fill="var(--faint)" font-size="9">${viewDays[i].date}</text>`).join('');
  const current=price[price.length-1],cy=Math.max(T+9,Math.min(H-B-9,y(current))),cx=x(price.length-1);
  const currentTag=`<line x1="${L}" y1="${cy.toFixed(1)}" x2="${W-R}" y2="${cy.toFixed(1)}" stroke="#13A8B8" stroke-width="1" stroke-dasharray="3 4" opacity=".45"/><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4" fill="#13A8B8" stroke="var(--paper)" stroke-width="2"/><rect x="${W-R+3}" y="${(cy-9).toFixed(1)}" width="70" height="18" rx="5" fill="#0E8293"/><text x="${W-R+38}" y="${(cy+3).toFixed(1)}" text-anchor="middle" fill="#fff" font-size="9" font-weight="800">${Math.round(current).toLocaleString('ko-KR')}</text>`;
  const priceSvg=`<svg class="tv-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 ${viewDays.length}거래일 종가와 최신 이동평균선, 볼린저밴드 차트">`+
    `<defs><linearGradient id="tv-area-${code}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#13A8B8" stop-opacity=".18"/><stop offset="1" stop-color="#13A8B8" stop-opacity=".01"/></linearGradient></defs>`+
    grid+(bandPath?`<path d="${bandPath}" fill="#8BC0CE" opacity=".12"/>`:'')+`<path d="${area}" fill="url(#tv-area-${code})"/>`+
    `<path d="${path(v60)}" fill="none" stroke="#8367DB" stroke-width="1.4" stroke-dasharray="5 4"/>`+
    `<path d="${path(v20)}" fill="none" stroke="#E58A32" stroke-width="1.6"/>`+
    `<path d="${closePath}" fill="none" stroke="#13A8B8" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>${currentTag}${ticks}</svg>`;

  const prior=price.length>1?price[price.length-2]:current,change=prior?(current/prior-1)*100:0;
  const regime=!Number.isFinite(t.ma60)?['전환 구간','neutral']   // ma60 데이터 부족 시 null을 0 취급해 오판정하지 않도록 별도 분기
    :current>t.ma20&&t.ma20>t.ma60?['상승 정렬','up']:current<t.ma20&&t.ma20<t.ma60?['하락 정렬','down']:['전환 구간','neutral'];
  const pos=(typeof t.low3m==='number'&&typeof t.high3m==='number'&&t.high3m>t.low3m)?Math.max(0,Math.min(100,(t.close-t.low3m)/(t.high3m-t.low3m)*100)):null;
  const bandPct=t.bb&&Number.isFinite(t.bb.pctB)?t.bb.pctB*100:null;
  const legend=`<div class="tv-legend"><span class="tv-lg"><i style="background:#13A8B8"></i>종가</span><span class="tv-lg"><i style="background:#E58A32"></i>${term('MA20')}</span><span class="tv-lg tv-dashed" style="color:#8367DB"><i></i>${term('MA60')}</span><span class="tv-lg" style="color:#83AEBB"><i style="background:#83AEBB;opacity:.55"></i>볼린저밴드</span></div>`;
  const stats=`<div class="tv-stats"><div class="tv-stat"><span>3개월 가격 위치</span><strong>${pos===null?'-':pos.toFixed(0)+'%'}</strong></div>`+
    `<div class="tv-stat"><span>20일 거래강도</span><strong>${Number.isFinite(t.volRatio)?t.volRatio.toFixed(2)+'배':'-'}</strong></div>`+
    `<div class="tv-stat"><span>밴드 내 위치</span><strong>${bandPct===null?'-':bandPct.toFixed(0)+'%'}</strong></div></div>`;

  const r=Number.isFinite(t.rsi14)?t.rsi14:50,rc=r>=70?'#D5535D':r<=30?'#5B8EAA':'#2F8B73',rW=280,rH=66,rX=v=>8+(rW-16)*v/100;
  const rsiSvg=`<svg class="tv-rsi-chart" viewBox="0 0 ${rW} ${rH}" role="img" aria-label="RSI 14일 ${r.toFixed(1)}">`+
    `<rect x="8" y="15" width="${rX(30)-8}" height="25" rx="5" fill="#5B8EAA" opacity=".09"/><rect x="${rX(30)}" y="15" width="${rX(70)-rX(30)}" height="25" fill="#2F8B73" opacity=".08"/><rect x="${rX(70)}" y="15" width="${rX(100)-rX(70)}" height="25" rx="5" fill="#D5535D" opacity=".09"/>`+
    `<line x1="${rX(30)}" y1="11" x2="${rX(30)}" y2="45" stroke="#5B8EAA" stroke-dasharray="3 3"/><line x1="${rX(70)}" y1="11" x2="${rX(70)}" y2="45" stroke="#D5535D" stroke-dasharray="3 3"/>`+
    `<line x1="${rX(r)}" y1="8" x2="${rX(r)}" y2="46" stroke="${rc}" stroke-width="2"/><circle cx="${rX(r)}" cy="15" r="4" fill="${rc}" stroke="var(--paper)" stroke-width="2"/>`+
    `<text x="8" y="60" fill="var(--faint)" font-size="9">과매도 30</text><text x="${rW/2}" y="60" text-anchor="middle" fill="var(--faint)" font-size="9">중립</text><text x="${rW-8}" y="60" text-anchor="end" fill="var(--faint)" font-size="9">70 과매수</text></svg>`;

  const mStart=Math.max(0,macd.length-32);
  let m=macd.slice(mStart),s=signal.slice(mStart);
  // ⚠️ 여기서 다시 계산한 MACD/시그널은 클라이언트가 가진 최근 구간 종가만으로 구한 근사값이라,
  // 서버가 전체 시세 이력으로 미리 구해둔 공식값(t.macd·t.macdSignal)과 최신 지점에서 어긋날 수 있다.
  // 어긋난 채로 그리면 "그래프는 시그널선이 위인데 문구는 골든크로스"처럼 그래프와 문구가 모순돼
  // 보이므로, 최신 지점을 공식값에 맞춰 상수만큼 평행이동시켜 그래프·배지·문구가 항상 같은 결론을
  // 가리키게 한다(과거 구간의 흐름 모양 자체는 그대로 유지된다).
  const officialMacd=Number.isFinite(t.macd)?t.macd:m[m.length-1];
  const officialSignal=Number.isFinite(t.macdSignal)?t.macdSignal:s[s.length-1];
  m=m.map(v=>v+(officialMacd-m[m.length-1])); s=s.map(v=>v+(officialSignal-s[s.length-1]));
  const hist=m.map((v,i)=>v-s[i]);
  // ⭐ 2026-08-05: mH=66에 캡션을 y=63(바닥에서 3px 위)에 박아두니, 선·막대가 아래쪽으로
  // 크게 휠 때(마이너스 구간 등) 마지막 지점의 점(mDots)이 캡션 글자와 그대로 겹쳐 숫자가
  // 안 보인다는 신고가 들어왔다. mH를 16px 늘리고 캡션 전용 여백을 따로 떼어, 선·막대가
  // 아무리 크게 흔들려도(진폭이 고정 스케일이라 항상 y<=54 안에서만 움직임) 캡션(y=76)과
  // 절대 겹치지 않게 구조적으로 분리했다.
  const mW=360,mH=82,mPad=7,mZero=32,mx=i=>mPad+(mW-2*mPad)*i/Math.max(1,m.length-1);
  // 선(MACD·시그널)과 막대(히스토그램=둘의 차이)를 같은 축에 그리면, 종목 주가가 커서 MACD 절대값이
  // 클 때 정작 중요한 "차이"인 히스토그램이 눈에 안 보일 만큼 납작해진다. 그래서 기준선(0)은 공유하되
  // 막대는 히스토그램 자체의 값 범위로 따로 스케일을 잡아 — 절대값이 아무리 커도 — 항상 눈에 보이게 한다.
  const lineMax=Math.max(...m.map(Math.abs),...s.map(Math.abs),1), my=v=>mZero-v/lineMax*20;
  const histMax=Math.max(...hist.map(Math.abs),1), barY=v=>mZero-v/histMax*17;
  const mPath=arr=>arr.map((v,i)=>(i?'L':'M')+mx(i).toFixed(1)+' '+my(v).toFixed(1)).join(' ');
  const bars=hist.map((v,i)=>{const yy=barY(v),bw=Math.max(2,(mW-2*mPad)/m.length-2);return `<rect x="${(mx(i)-bw/2).toFixed(1)}" y="${Math.min(mZero,yy).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1,Math.abs(yy-mZero)).toFixed(1)}" rx="1" fill="${v>=0?'#2F8B73':'#D5535D'}" opacity=".55"/>`}).join('');
  const diff=officialMacd-officialSignal,cross=diff>=0?'상승 모멘텀':'하락 모멘텀',fmtM=v=>Math.round(v).toLocaleString('ko-KR');
  const mLastX=mx(m.length-1).toFixed(1);
  const mDots=`<circle cx="${mLastX}" cy="${my(m[m.length-1]).toFixed(1)}" r="2.8" fill="#13A8B8" stroke="var(--paper)" stroke-width="1.2"/><circle cx="${mLastX}" cy="${my(s[s.length-1]).toFixed(1)}" r="2.8" fill="#E58A32" stroke="var(--paper)" stroke-width="1.2"/>`;
  const macdSvg=`<svg class="tv-macd-chart" viewBox="0 0 ${mW} ${mH}" role="img" aria-label="MACD ${fmtM(officialMacd)}, 시그널 ${fmtM(officialSignal)} 추세, 현재 ${diff>=0?'골든크로스':'데드크로스'} 상태"><line x1="${mPad}" y1="${mZero}" x2="${mW-mPad}" y2="${mZero}" stroke="var(--line2)"/>${bars}<path d="${mPath(m)}" fill="none" stroke="#13A8B8" stroke-width="1.7"/><path d="${mPath(s)}" fill="none" stroke="#E58A32" stroke-width="1.4"/>${mDots}<text x="${mPad}" y="76" fill="var(--faint)" font-size="9">히스토그램(MACD−시그널)</text><text x="${mW-mPad}" y="76" text-anchor="end" fill="var(--faint)" font-size="9">MACD ${fmtM(officialMacd)} · 시그널 ${fmtM(officialSignal)}</text></svg>`;
  const indicators=`<div class="tv-indicators"><div class="tv-indicator"><div class="tv-ind-head"><strong>${term('RSI')} · 14일</strong><span style="color:${rc}">${r.toFixed(1)}</span></div>${rsiSvg}<div class="tv-note">30 이하는 과매도, 70 이상은 과매수 구간입니다.</div></div>`+
    `<div class="tv-indicator"><div class="tv-ind-head"><strong>${term('MACD')} 모멘텀</strong><span class="${diff>=0?'tv-up':'tv-down'}">${cross}</span></div>${macdSvg}<div class="tv-note">청록 MACD선이 주황 ${term('시그널선')}보다 ${diff>=0?`위에 있어 ${term('골든크로스')} 상태, 상승 힘이 우세합니다.`:`아래에 있어 ${term('데드크로스')} 상태, 하락 힘이 우세합니다.`}</div><div class="tv-note tv-note-sub"><p>MACD와 시그널을 <b>왜 봐야 하냐면</b> — 이 둘의 위치가 뒤바뀌는 순간이 상승 힘과 하락 힘의 우세가 바뀌는 지점이라, 많은 투자자가 추세 전환을 미리 눈치채는 힌트로 참고하기 때문이에요(다만 신호가 자주 뒤집히기도 해서 이것만으로 매매 시점을 단정하진 않아요).</p><p>MACD ${fmtM(officialMacd)}·시그널 ${fmtM(officialSignal)}, 이 숫자들도 원(₩) 단위가 맞아요.</p><p><b>MACD</b>는 "최근 <b>12일 평균</b> 주가"에서 "최근 <b>26일 평균</b> 주가"를 뺀 값이고, <b>시그널</b>은 그 MACD 값을 다시 <b>9일</b> 동안 부드럽게 한 번 더 평균 낸 값이라 MACD보다 느리게 움직여요. 그래서 이 둘을 비교하면 추세가 바뀌는 순간을 잡아낼 수 있어요.</p><p>지금은 ${officialMacd>=0?`12일 평균이 26일 평균보다 <b>${fmtM(Math.abs(officialMacd))}원 더 높다</b>`:`12일 평균이 26일 평균보다 <b>${fmtM(Math.abs(officialMacd))}원 더 낮다</b>`}는 뜻이에요. (부호가 ${officialMacd>=0?'+':'−'}인 이유예요.)</p><p>종목마다 주가 크기가 달라서 숫자 크기 자체보다 <b>두 선 중 어느 게 위에 있는지</b>가 더 중요해요.</p></div></div></div>`;
  return `<div class="taro-viz"><div class="tv-head"><div class="tv-title"><span class="tv-kicker">TECHNICAL SNAPSHOT · ${viewDays.length}D</span><strong>가격 구조와 모멘텀</strong></div><div class="tv-quote"><strong>${Math.round(current).toLocaleString('ko-KR')}원</strong><span class="tv-delta ${change>0?'tv-up':change<0?'tv-down':'tv-flat'}">${change>0?'▲':change<0?'▼':'-'} ${Math.abs(change).toFixed(2)}% · <b class="tv-regime tv-regime-${regime[1]}">${regime[0]}</b></span></div></div><div class="tv-market">${priceSvg}${legend}</div>${stats}${indicators}${taroMAExplainHTML(t)}</div>`;
}

/* ═══════════════════════════════════════════════════════════════════
   📡 GAEO 레이더 — 분석 종목 전체에서 "직전 거래일 대비 새로 생긴 변화"만 보여준다.
   · 데이터: radar.js(compute_radar.py 생성) — 홈 요약용 이벤트 목록
             radar_series.js — 신호 종목의 최근 60거래일(상세를 열 때만 지연 로딩)
   · 이 기능은 BUY/HOLD/SELL 판단을 새로 만들지 않는다. TARO·DIANA·QUANT·FLOW·
     CHIEF 5인 분석 체계는 그대로이고, 레이더는 "볼 만한 종목을 먼저 찾아주는"
     규칙 기반 탐지기일 뿐이다.
   ═══════════════════════════════════════════════════════════════════ */
const RADAR=(typeof GAEO_RADAR!=='undefined'&&GAEO_RADAR&&GAEO_RADAR.events)?GAEO_RADAR:null;
const RADAR_FALLBACK_DEF={label:'기술적 변화',icon:'·',severity:'mid',metric:'',group:'extra',
  description:'지표에 변화가 포착됐어요.',caution:'참고용 정보예요.'};
function radarDef(type){ return (RADAR&&RADAR.defs&&RADAR.defs[type])||RADAR_FALLBACK_DEF; }
function radarEventsOf(code){
  if(!RADAR) return [];
  return RADAR.events.filter(e=>e.code===code);
}
// 숫자 표기: 금액·큰 수는 천단위 구분 정수, RSI·거래량배수는 소수 한 자리로 통일한다
// (「RSI 32 → 29.7」처럼 자릿수가 들쭉날쭉하면 값을 비교하기 어렵다).
function radarNum(v,unit,metric){
  if(typeof v!=='number'||!isFinite(v)) return '—';
  if(metric==='RSI'||unit==='배') return v.toFixed(1)+(unit||'');
  if(Math.abs(v)>=1000||unit==='원') return Math.round(v).toLocaleString('ko-KR')+(unit||'');
  return String(Math.round(v*100)/100)+(unit||'');
}
function radarValueText(ev){
  const d=radarDef(ev.type);
  // ⭐ 2026-08-07: "MACD-시그널 -63 → 7"처럼 지표명 뒤에 콜론 없이 바로 숫자가 붙으면
  // "MACD에서 시그널 -63을 뺀 게 7이 됐다"는 식으로 헷갈릴 수 있다는 피드백 →
  // 지표명과 값 사이에 콜론을 넣어 "이전값 → 현재값"이라는 걸 분명히 한다.
  return `${d.metric?d.metric+': ':''}${radarNum(ev.previousValue,ev.unit,d.metric)} → ${radarNum(ev.currentValue,ev.unit,d.metric)}`;
}
function radarDateText(dateStr){
  const m=String(dateStr||'').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m?`${Number(m[2])}월 ${Number(m[3])}일`:String(dateStr||'');
}
function radarStatusText(){
  if(!RADAR) return '';
  return RADAR.status==='provisional'?'장중 잠정 신호':'종가 확정 신호';
}
// 레이더 데이터가 며칠이나 지났는지 (오래되면 화면에서 정직하게 알린다)
function radarAgeDays(){
  if(!RADAR||!RADAR.generatedAt) return null;
  const t=Date.parse(String(RADAR.generatedAt).replace(' ','T')+':00');
  if(isNaN(t)) return null;
  return Math.floor((Date.now()-t)/86400000);
}

/* ── 홈 화면 레이더 카드 ── */
let RADAR_FILTER=null, RADAR_SHOWN=8, RADAR_CHIPS_EXPANDED=false;
function radarChipHTML(type,count,pressed){
  const d=radarDef(type);
  return `<button class="gr-chip" type="button" data-radar-type="${esc(type)}" aria-pressed="${pressed?'true':'false'}"`+
    ` aria-label="${esc(d.label)} ${count}건 종목 목록 보기">`+
    `<span class="gr-ico" aria-hidden="true">${esc(d.icon)}</span>${esc(d.label)} <b>${count}</b></button>`;
}
function radarRowsHTML(events){
  // 같은 종목이 여러 번 나오지 않게 종목당 1행(대표 신호 + "외 N건")으로 묶는다.
  const seen={}, rows=[];
  events.forEach(e=>{
    if(seen[e.code]){ seen[e.code].extra++; return; }
    seen[e.code]={ev:e,extra:0};
    rows.push(seen[e.code]);
  });
  // 같은 종목에서 이번 필터 밖의 신호도 몇 건인지 함께 세어 준다
  rows.forEach(r=>{ r.total=radarEventsOf(r.ev.code).length; });
  return rows;
}
// ⭐ 2026-08-08: "종목 옆에 지금 점수도 보이면 좋겠다"는 요청 → 자동/정밀분석 중
// 더 신선한 쪽(analysisEntry, 다른 화면과 같은 기준)의 CHIEF 종합점수를 배지로 붙인다.
// 아직 분석이 없는 종목(신규상장 등)은 조용히 생략한다.
function radarScoreBadge(code){
  const entry=analysisEntry(code);
  const total=entry&&entry.chief&&typeof entry.chief.total==='number'?entry.chief.total:null;
  if(total==null) return '';
  const call=entry.chief.call;
  const col=call==='BUY'?'#2F8B73':call==='SELL'?'#D5535D':'#B97A2F';
  return `<span class="gr-row-score" style="color:${col}">${Math.round(total)}점</span>`;
}
function radarRowHTML(row){
  const e=row.ev, d=radarDef(e.type), more=row.total-1;
  return `<button class="gr-row" type="button" data-radar-code="${esc(e.code)}" data-radar-name="${esc(e.name)}"`+
    ` aria-label="${esc(e.name)} ${esc(d.label)} 분석 보기">`+
    `<span><span class="gr-row-name">${esc(e.name)}${radarScoreBadge(e.code)}`+
      (more>0?`<span class="gr-more" title="이 종목에서 오늘 포착된 다른 신호가 ${more}건 더 있어요">외 ${more}건</span>`:'')+`</span>`+
      `<span class="gr-row-sig"><span class="gr-ico" aria-hidden="true">${esc(d.icon)}</span>${esc(d.label)}</span>`+
      `<span class="gr-row-val">${esc(radarValueText(e))} · ${esc(radarDateText(e.date))} 기준</span></span>`+
    `<span class="gr-row-go" aria-hidden="true">분석 보기 ›</span></button>`;
}
function renderGaeoRadar(){
  const box=document.getElementById('gaeoRadar'), body=document.getElementById('gaeoRadarBody'),
        asof=document.getElementById('gaeoRadarAsof');
  if(!box||!body) return;
  box.hidden=false;
  // ① 데이터 파일 자체를 못 읽은 경우 — 오류 상태
  if(!RADAR){
    if(asof) asof.innerHTML='';
    body.innerHTML='<div class="gr-empty">레이더 자료를 불러오지 못했어요. 잠시 뒤 새로고침하면 다시 표시돼요.'+
      '<br>그 사이에도 종목 검색과 5인 분석은 평소처럼 이용할 수 있어요.</div>';
    return;
  }
  const st=RADAR.status==='provisional'?'is-provisional':'is-confirmed';
  if(asof){
    asof.innerHTML=`<span>시세 기준 <b>${esc(String(RADAR.priceLabel||'').replace(' 수집',''))}</b></span>`+
      `<span>레이더 생성 <b>${esc(RADAR.generatedAt||'-')}</b></span>`+
      `<span class="gr-status ${st}">${RADAR.status==='provisional'?'⏳':'✓'} ${esc(radarStatusText())}</span>`;
  }
  const age=radarAgeDays();
  let html='';
  if(age!==null&&age>=3){
    html+=`<div class="gr-empty">레이더 자료가 <b>${age}일</b> 전 기준이에요. 휴장일이거나 자동 갱신이 늦어지는 중일 수 있어요.</div>`;
  }
  html+=`<p class="gr-lead">오늘 <b>${RADAR.universe}</b>종목을 훑어 새롭게 포착한 기술적 변화`+
    `<span class="gr-count">${RADAR.total}<small>건 · ${RADAR.stockCount}종목</small></span></p>`;

  // ② 관심종목에서 발견된 변화는 전체보다 먼저
  const watch=(typeof loadWatchlist==='function')?loadWatchlist():[];
  const watchEvents=RADAR.events.filter(e=>watch.indexOf(e.code)>=0);
  if(watchEvents.length){
    const wrows=radarRowsHTML(watchEvents);
    html+=`<div class="gr-watch"><span class="gr-watch-t">★ 관심종목 변화 ${watchEvents.length}건</span>`+
      wrows.slice(0,4).map(radarRowHTML).join('')+`</div>`;
  }

  // ③ 분류 카드 — main 신호를 전부 개별 칩으로 노출한다.
  // ⭐ 2026-08-07: "MACD 골든크로스·데드크로스도 하나로 묶지 말고 각각 카테고리로 나눠달라"는
  // 요청으로 MACD 두 종류도 radar_signals.py에서 main으로 승격됨 — 이제 '기타 변화(묶음)' 칩 자체가 없다.
  // extraOrder는 하위호환용으로 계속 내려오지만 항상 빈 배열이라 아래 로직은 자연히 no-op이다.
  if(RADAR.total===0){
    html+='<div class="gr-empty">현재 기준 새롭게 경계를 통과한 종목이 없어요.<br>'+
      '기존 과매도·과매수 상태 종목은 종목 분석 화면에서 확인할 수 있어요.</div>';
  }else{
    // 신호 종류가 많을 때 한 화면에 전부 펼치면 "버튼 바다"처럼 보인다 — 기존 count 순서(mainOrder)
    // 그대로 상위 GR_TOP_N개만 먼저 보여주고, 나머지는 "전체 시그널 보기"로 펼친다(새 랭킹 로직 없음).
    const mainTypes=(RADAR.mainOrder||[]).filter(t=>RADAR.counts[t]>0);
    const chips=mainTypes.map(t=>radarChipHTML(t,RADAR.counts[t],RADAR_FILTER===t));
    if(RADAR.extraTotal>0){
      chips.push(`<button class="gr-chip" type="button" data-radar-type="__extra" aria-pressed="${RADAR_FILTER==='__extra'?'true':'false'}"`+
        ` aria-label="기타 변화 ${RADAR.extraTotal}건 종목 목록 보기">`+
        `<span class="gr-ico" aria-hidden="true">◇</span>기타 변화 <b>${RADAR.extraTotal}</b></button>`);
    }
    const GR_TOP_N=6;
    const activeOutsideTop=RADAR_FILTER&&mainTypes.slice(0,GR_TOP_N).indexOf(RADAR_FILTER)<0;
    const chipsExpanded=RADAR_CHIPS_EXPANDED||activeOutsideTop||chips.length<=GR_TOP_N;
    const shownChips=chipsExpanded?chips:chips.slice(0,GR_TOP_N);
    html+=`<div class="gr-chips" role="group" aria-label="신호 분류 선택">${shownChips.join('')}</div>`;
    if(!chipsExpanded){
      html+=`<button class="gr-more-btn" type="button" id="grChipsMore">전체 시그널 보기 (나머지 ${chips.length-GR_TOP_N}개)</button>`;
    }else if(chips.length>GR_TOP_N){
      html+=`<button class="gr-more-btn" type="button" id="grChipsLess">간단히 보기</button>`;
    }
    if(!RADAR_FILTER){
      html+='<p class="gr-note">분류를 누르면 해당 변화가 나온 종목 목록을 볼 수 있어요.</p>';
    }else{
      const extras=RADAR.extraOrder||[];
      const list=RADAR.events.filter(e=>RADAR_FILTER==='__extra'?extras.indexOf(e.type)>=0:e.type===RADAR_FILTER);
      const rows=radarRowsHTML(list);
      const shown=rows.slice(0,RADAR_SHOWN);
      html+=`<div class="gr-list">${shown.map(radarRowHTML).join('')}</div>`;
      if(rows.length>shown.length){
        html+=`<button class="gr-more-btn" type="button" id="grMore">${rows.length-shown.length}종목 더 보기</button>`;
      }
    }
  }
  html+=`<p class="gr-note">${esc(RADAR.disclaimer||'')} `+
    `RSI·볼린저밴드·거래량·MACD·이동평균의 <b>기준선 통과</b>만 기계적으로 찾아낸 결과이며, `+
    `TARO·DIANA·QUANT·FLOW·CHIEF 5인의 분석 판단과는 별개예요.</p>`;
  body.innerHTML=html;

  body.querySelectorAll('[data-radar-type]').forEach(btn=>{
    btn.onclick=()=>{
      const t=btn.getAttribute('data-radar-type');
      RADAR_FILTER=(RADAR_FILTER===t)?null:t;
      RADAR_SHOWN=8;
      renderGaeoRadar();
      if(RADAR_FILTER){ const l=document.querySelector('#gaeoRadarBody .gr-list'); if(l) l.scrollIntoView({block:'nearest'}); }
    };
  });
  const more=document.getElementById('grMore');
  if(more) more.onclick=()=>{ RADAR_SHOWN+=20; renderGaeoRadar(); };
  const chipsMore=document.getElementById('grChipsMore');
  if(chipsMore) chipsMore.onclick=()=>{ RADAR_CHIPS_EXPANDED=true; renderGaeoRadar(); };
  const chipsLess=document.getElementById('grChipsLess');
  if(chipsLess) chipsLess.onclick=()=>{ RADAR_CHIPS_EXPANDED=false; renderGaeoRadar(); };
  body.querySelectorAll('[data-radar-code]').forEach(btn=>{
    btn.onclick=()=>{ jumpToStock(btn.getAttribute('data-radar-name')||btn.getAttribute('data-radar-code')); };
  });
}

/* ── 상세 화면: 레이더 포착 변화(차트 + 어제/오늘 비교표) ── */
const RD_COL={close:'#347F9D',band:'#9AB6C2',mid:'#C08A4A',rsi:'#5B8EAA',vol:'#8FB8CA',
              avg:'#C08A4A',mark:'#D5535D',macd:'#347F9D',sig:'#C08A4A',ma60:'#8b6fe0'};
function rdPath(vals,px,py){
  let d='',pen=false;
  vals.forEach((v,i)=>{
    if(typeof v!=='number'||!isFinite(v)){ pen=false; return; }
    d+=(pen?'L':'M')+px(i).toFixed(1)+' '+py(v).toFixed(1)+' '; pen=true;
  });
  return d.trim();
}
function rdScale(vals){
  const nums=vals.filter(v=>typeof v==='number'&&isFinite(v));
  if(!nums.length) return null;
  let lo=Math.min(...nums), hi=Math.max(...nums);
  if(hi===lo){ hi=lo+1; lo=lo-1; }
  const pad=(hi-lo)*0.08;
  return {lo:lo-pad,hi:hi+pad};
}
// 신호가 난 날짜의 x위치 (series.d는 'MM-DD')
function rdMarkIdx(series,events){
  const set={};
  events.forEach(e=>{ const k=String(e.date||'').slice(5); const i=series.d.indexOf(k); if(i>=0) set[i]=1; });
  return Object.keys(set).map(Number);
}
function rdXTicks(series,px,H){
  const n=series.d.length, step=Math.max(1,Math.floor(n/4));
  let out='';
  for(let i=0;i<n;i+=step){
    out+=`<text x="${px(i).toFixed(1)}" y="${H-3}" font-size="9" fill="#8FA0A9" text-anchor="middle">${esc(series.d[i])}</text>`;
  }
  return out;
}
function rdPriceChart(series,events){
  const W=640,H=210,L=6,Rt=52,T=8,B=18, n=series.d.length;
  const sc=rdScale([].concat(series.c,series.bu,series.bl));
  if(!sc||n<2) return '';
  const px=i=>L+(W-L-Rt)*(n>1?i/(n-1):0), py=v=>T+(H-T-B)*(1-(v-sc.lo)/(sc.hi-sc.lo));
  // 밴드 사이 영역(상단→하단 되짚기)
  let area='',fwd=[],bak=[];
  for(let i=0;i<n;i++){ if(typeof series.bu[i]==='number'&&typeof series.bl[i]==='number'){
    fwd.push(px(i).toFixed(1)+' '+py(series.bu[i]).toFixed(1));
    bak.unshift(px(i).toFixed(1)+' '+py(series.bl[i]).toFixed(1)); } }
  if(fwd.length>1) area=`<path d="M${fwd.join(' L')} L${bak.join(' L')} Z" fill="rgba(136,205,231,.16)" stroke="none"/>`;
  // 신호일 표시 — 마지막 근처면 라벨을 왼쪽으로 붙여 현재가 숫자와 겹치지 않게 한다
  const marks=rdMarkIdx(series,events).map(i=>{
    const anchor=(i>=n-3)?'end':'middle', dx=(i>=n-3)?-3:0;
    return `<line x1="${px(i).toFixed(1)}" y1="${T}" x2="${px(i).toFixed(1)}" y2="${H-B}" stroke="${RD_COL.mark}" stroke-width="1.2" stroke-dasharray="3 3"/>`+
      `<text x="${(px(i)+dx).toFixed(1)}" y="${T+9}" font-size="9" fill="${RD_COL.mark}" text-anchor="${anchor}">신호</text>`;
  }).join('');
  const last=series.c[n-1];
  const lastTxt=(typeof last==='number')?
    `<circle cx="${px(n-1).toFixed(1)}" cy="${py(last).toFixed(1)}" r="3.2" fill="${RD_COL.close}" stroke="#fff" stroke-width="1.2"/>`+
    `<text x="${(px(n-1)+6).toFixed(1)}" y="${(py(last)+3).toFixed(1)}" font-size="10" font-weight="700" fill="${RD_COL.close}">${Math.round(last).toLocaleString('ko-KR')}</text>`:'';
  return `<svg class="rd-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 ${n}거래일 종가와 볼린저밴드 차트">`+
    area+
    `<path d="${rdPath(series.bu,px,py)}" fill="none" stroke="${RD_COL.band}" stroke-width="1.1" stroke-dasharray="4 3"/>`+
    `<path d="${rdPath(series.bm,px,py)}" fill="none" stroke="${RD_COL.mid}" stroke-width="1.1" stroke-dasharray="2 3"/>`+
    `<path d="${rdPath(series.bl,px,py)}" fill="none" stroke="${RD_COL.band}" stroke-width="1.1" stroke-dasharray="4 3"/>`+
    marks+
    `<path d="${rdPath(series.c,px,py)}" fill="none" stroke="${RD_COL.close}" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>`+
    lastTxt+rdXTicks(series,px,H)+`</svg>`;
}
function rdRsiChart(series,events){
  const W=640,H=132,L=6,Rt=64,T=8,B=18, n=series.d.length;   // Rt: 오른쪽 기준선 라벨 자리
  if(n<2) return '';
  const px=i=>L+(W-L-Rt)*(n>1?i/(n-1):0), py=v=>T+(H-T-B)*(1-Math.max(0,Math.min(100,v))/100);
  const zone=(a,b,fill)=>`<rect x="${L}" y="${py(b).toFixed(1)}" width="${(W-L-Rt).toFixed(1)}" height="${(py(a)-py(b)).toFixed(1)}" fill="${fill}"/>`;
  const line=(v,col,txt)=>`<line x1="${L}" y1="${py(v).toFixed(1)}" x2="${(W-Rt).toFixed(1)}" y2="${py(v).toFixed(1)}" stroke="${col}" stroke-width="1" stroke-dasharray="4 3"/>`+
    `<text x="${(W-Rt+3).toFixed(1)}" y="${(py(v)+3).toFixed(1)}" font-size="9" fill="${col}">${txt}</text>`;
  const marks=rdMarkIdx(series,events).map(i=>
    `<line x1="${px(i).toFixed(1)}" y1="${T}" x2="${px(i).toFixed(1)}" y2="${H-B}" stroke="${RD_COL.mark}" stroke-width="1.2" stroke-dasharray="3 3"/>`).join('');
  return `<svg class="rd-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 ${n}거래일 RSI 차트, 30 과매도선과 70 과매수선 표시">`+
    zone(70,100,'rgba(213,83,93,.10)')+zone(0,30,'rgba(91,142,170,.12)')+
    line(70,'#B4666C','70 과매수')+line(30,'#5B8EAA','30 과매도')+marks+
    `<path d="${rdPath(series.r,px,py)}" fill="none" stroke="${RD_COL.rsi}" stroke-width="1.8" stroke-linejoin="round"/>`+
    rdXTicks(series,px,H)+`</svg>`;
}
function rdVolChart(series,events){
  const W=640,H=132,L=6,Rt=26,T=10,B=18, n=series.d.length;
  if(n<2) return '';
  const sc=rdScale([].concat(series.v,series.va)); if(!sc) return '';
  const top=Math.max(sc.hi,1);
  const px=i=>L+(W-L-Rt)*(n>1?i/(n-1):0), py=v=>T+(H-T-B)*(1-v/top);
  const bw=Math.max(1.6,(W-L-Rt)/n*0.62);
  const spikeIdx={}; rdMarkIdx(series,events).forEach(i=>{spikeIdx[i]=1;});
  let bars='';
  for(let i=0;i<n;i++){
    const v=series.v[i]; if(typeof v!=='number'||!isFinite(v)) continue;
    const y=py(v), h=Math.max(0.8,(H-B)-y);
    const isSpike=(typeof series.va[i]==='number'&&series.va[i]>0&&v/series.va[i]>=2);
    bars+=`<rect x="${(px(i)-bw/2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}"`+
      ` fill="${isSpike?RD_COL.mark:RD_COL.vol}" ${isSpike?'stroke="#A63A43" stroke-width="0.6"':''}/>`;
    if(isSpike&&spikeIdx[i]) bars+=`<text x="${px(i).toFixed(1)}" y="${Math.max(9,y-3).toFixed(1)}" font-size="9" fill="${RD_COL.mark}" text-anchor="middle">급증</text>`;
  }
  return `<svg class="rd-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 ${n}거래일 거래량 막대와 20일 평균 거래량 차트">`+
    bars+`<path d="${rdPath(series.va,px,py)}" fill="none" stroke="${RD_COL.avg}" stroke-width="1.4" stroke-dasharray="4 3"/>`+
    rdXTicks(series,px,H)+`</svg>`;
}
// MA60은 60거래일 평균이라 60일 창에서는 끝부분 며칠만 계산된다.
// 선이 몇 픽셀만 나오면 오히려 오해를 부르므로, 충분히 그려질 때만 표시한다.
function rdHasMa(series){
  return (series.m60||[]).filter(v=>typeof v==='number'&&isFinite(v)).length>=15;
}
function rdExtraChart(series){
  const W=640,H=132,L=6,Rt=26,T=10,B=18, n=series.d.length;
  if(n<2) return '';
  const sc=rdScale([].concat(series.macd,series.sig)); if(!sc) return '';
  const px=i=>L+(W-L-Rt)*(n>1?i/(n-1):0), py=v=>T+(H-T-B)*(1-(v-sc.lo)/(sc.hi-sc.lo));
  const zero=(sc.lo<0&&sc.hi>0)?`<line x1="${L}" y1="${py(0).toFixed(1)}" x2="${(W-Rt).toFixed(1)}" y2="${py(0).toFixed(1)}" stroke="#C9D6DC" stroke-width="1"/>`:'';
  const sc2=rdHasMa(series)?rdScale([].concat(series.bm,series.m60)):null;
  let ma='';
  if(sc2){
    const py2=v=>T+(H-T-B)*(1-(v-sc2.lo)/(sc2.hi-sc2.lo));
    ma=`<path d="${rdPath(series.bm,px,py2)}" fill="none" stroke="${RD_COL.mid}" stroke-width="1.3"/>`+
       `<path d="${rdPath(series.m60,px,py2)}" fill="none" stroke="${RD_COL.ma60}" stroke-width="1.3"/>`;
  }
  return `<svg class="rd-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="MACD와 시그널선, MA20과 MA60 보조 차트">`+
    zero+ma+
    `<path d="${rdPath(series.macd,px,py)}" fill="none" stroke="${RD_COL.macd}" stroke-width="1.7"/>`+
    `<path d="${rdPath(series.sig,px,py)}" fill="none" stroke="${RD_COL.sig}" stroke-width="1.4" stroke-dasharray="4 3"/>`+
    rdXTicks(series,px,H)+`</svg>`;
}
// ⭐ 2026-08-07: 범례 라벨(MACD·시그널선·MA20·MA60·RSI 등)을 탭/클릭하면 뜻을 보여주는
// 용어사전 팝업이 뜨도록 term()으로 감싼다(GLOSSARY에 이미 정의된 단어만 자동으로 걸린다 —
// esc() 대신 써도 안전한 건 라벨이 우리가 직접 넣는 고정 문자열이라 사용자 입력이 아니라서다).
function rdLegend(items){
  return `<div class="rd-legend">${items.map(x=>
    `<span><i class="${x.cls||''}" style="${x.cls==='box'?'background:':'border-top-color:'}${x.color}"></i>${term(x.label)}</span>`).join('')}</div>`;
}
/* ═══════════════════════════════════════════════════════════════════
   🤖 AI 해석 계층 — 위 계산 결과(rsi_series·bollinger·macd_series 등, 전부
   radar_signals.py·compute_radar.py가 만든 값 그대로)는 절대 건드리지 않고,
   그 숫자가 "무슨 뜻인지 · 무엇을 더 확인해야 하는지"를 초보자 눈높이로 풀어주는
   문장만 여기서 따로 만든다. 원칙: 숫자 → 의미 → 주의점 순서, "무조건/확실히/
   반드시" 같은 단정 표현·매수매도 지시 금지. (2026-08-07 레이더 UX 개선)
   ═══════════════════════════════════════════════════════════════════ */
function isMaCrossType(t){ return t.indexOf('ma_')===0 || t.indexOf('ma5_20')===0 || t.indexOf('ma20_60')===0; }

// ① 이동평균선 교차·임박 — 골든크로스=무조건 상승, 데드크로스=무조건 하락으로 단정하지 않는다.
function getMovingAverageInterpretation(ev){
  const short=ev.type.indexOf('ma5_20')===0?'5일':'20일';
  const long=ev.type.indexOf('ma5_20')===0?'20일':'60일';
  const term=ev.type.indexOf('ma5_20')===0?'단기':'중기';
  if(ev.type.slice(-12)==='golden_cross'){
    return `${short} 이동평균선이 ${long} 이동평균선을 위로 돌파했습니다. ${term} 상승 추세가 시작될 가능성을 보여주는 기술적 신호입니다.<br><br>`+
      `다만 이동평균선은 이미 지난 가격의 평균으로 계산되는 <b>후행지표</b>라 신호가 다소 늦게 나타날 수 있습니다. `+
      `최근 가격 흐름과 거래량이 함께 좋아지고 있는지 확인하면 신호를 더 믿을 수 있어요.`;
  }
  if(ev.type.slice(-10)==='dead_cross'){
    return `${short} 이동평균선이 ${long} 이동평균선 아래로 내려왔습니다. ${term} 흐름이 약해지고 있다는 신호로 해석할 수 있습니다.<br><br>`+
      `다만 이동평균선 교차는 이미 지나간 가격의 평균으로 계산되므로 신호가 늦게 나타날 수 있어요. `+
      `거래량과 최근 가격 흐름이 실제로 약해지고 있는지도 함께 확인하세요.`;
  }
  if(ev.type.indexOf('near_golden')>=0){
    return `${short} 이동평균선이 아직 ${long} 이동평균선 아래에 있지만 간격이 좁혀지는 중입니다. ${term} 흐름이 바뀔 준비를 하는 단계로 볼 수 있어요.<br><br>`+
      `아직 실제로 뚫고 올라간 것은 아니라서 다시 벌어질 수도 있습니다. 확정된 신호가 아니니 다음 며칠의 움직임을 지켜보세요.`;
  }
  if(ev.type.indexOf('near_dead')>=0){
    return `${short} 이동평균선이 아직 ${long} 이동평균선 위에 있지만 간격이 좁혀지는 중입니다. ${term} 흐름이 꺾일 준비를 하는 단계로 볼 수 있어요.<br><br>`+
      `아직 실제로 뚫고 내려간 것은 아니라서 다시 벌어질 수도 있습니다. 확정된 신호가 아니니 다음 며칠의 움직임을 지켜보세요.`;
  }
  return esc(radarDef(ev.type).description);
}

// ② 볼린저밴드 — 상단 돌파를 "곧 조정"으로 단정하지 않고 밴드 워킹 가능성도 함께 알려준다.
function getBollingerInterpretation(ev){
  if(ev.type==='bb_upper_break'){
    return `주가가 볼린저밴드 상단을 돌파했습니다. 최근 상승 힘이 평소보다 강해졌다는 의미일 수도 있지만, 단기적으로 과열되어 조정 가능성이 커졌다는 신호일 수도 있습니다.<br><br>`+
      `다만 상단을 돌파했다고 무조건 하락하는 것은 아니에요. 강한 상승장에서는 주가가 밴드 상단을 따라 계속 오르는 <b>밴드 워킹(Band Walking)</b>이 나타나기도 합니다. RSI·거래량·이동평균선의 방향을 함께 확인해보세요.`;
  }
  if(ev.type==='bb_upper_recover'){
    return `주가가 볼린저밴드 상단 아래로 다시 내려오며 평소 범위 안으로 돌아왔습니다. 상승 탄력이 한 박자 쉬어가는 모습일 수 있습니다.<br><br>`+
      `밴드 안으로 돌아온 것이 곧 하락 전환을 뜻하지는 않아요. 거래량이 유지되는지, 이동평균선이 여전히 위쪽을 향하는지 살펴보세요.`;
  }
  if(ev.type==='bb_lower_break'){
    return `주가가 볼린저밴드 하단을 이탈했습니다. 매도세가 강하거나 단기 과매도 상태일 가능성을 보여줍니다.<br><br>`+
      `하지만 하단을 벗어났다고 바로 반등하는 것은 아니에요. 강한 하락장에서는 하단을 따라 계속 내려가는 흐름이 이어질 수도 있습니다. RSI·거래량·이동평균선의 방향을 함께 확인해보세요.`;
  }
  if(ev.type==='bb_lower_recover'){
    return `주가가 볼린저밴드 하단 위로 다시 올라오며 평소 범위 안으로 돌아왔습니다. 급격한 낙폭은 일단 진정된 모습입니다.<br><br>`+
      `밴드 안으로 돌아온 것이 곧 하락이 끝났다는 뜻은 아니에요. 거래량과 이동평균선의 방향이 실제로 바뀌는지 함께 지켜보세요.`;
  }
  return esc(radarDef(ev.type).description);
}

// ③ RSI — 실제로 경계를 넘은 "사건"에 대한 설명(전환 시점 서술)
function getRsiEventInterpretation(ev){
  const c=(typeof ev.currentValue==='number')?ev.currentValue.toFixed(1):'—';
  if(ev.type==='rsi_oversold_entry'){
    return `RSI가 <b>${c}</b>로 30 아래로 내려오며 매도 압력이 강해진 구간에 들어왔습니다. 단기 과매도 가능성이 높아졌다는 의미입니다.<br><br>`+
      `과매도에 들어왔다고 바로 반등하는 것은 아니에요. 추가 하락 가능성도 함께 열어두고 거래량과 가격 흐름을 지켜보세요.`;
  }
  if(ev.type==='rsi_oversold_exit'){
    return `RSI가 <b>${c}</b>로 30 위로 올라오며 과매도 구간에서 벗어났습니다. 매도 압력이 다소 진정된 모습입니다.<br><br>`+
      `과매도를 벗어난 것이 상승 전환을 확인해주는 신호는 아니에요. 이 흐름이 며칠 더 이어지는지 확인해보세요.`;
  }
  if(ev.type==='rsi_overbought_entry'){
    return `RSI가 <b>${c}</b>로 70을 넘어서며 단기 과열 구간에 진입했습니다. 최근 매수세가 상당히 강했다는 의미입니다.<br><br>`+
      `다만 거래량이 함께 증가하고 있다면 강한 상승세가 이어지는 과정일 수도 있어요. 단기 조정 가능성도 함께 살펴보세요.`;
  }
  if(ev.type==='rsi_overbought_exit'){
    return `RSI가 <b>${c}</b>로 70 아래로 내려오며 과매수 구간에서 벗어났습니다. 매수세가 다소 잦아든 모습입니다.<br><br>`+
      `이것만으로 하락 전환이 확정된 것은 아니에요. 가격과 거래량의 방향을 함께 확인해보세요.`;
  }
  return esc(radarDef(ev.type).description);
}
// RSI 현재 수치에 대한 짧은 해석 — 차트 설명·비교 카드·종합 요약에서 공통으로 재사용한다.
function rsiLevelText(v){
  if(typeof v!=='number'||!isFinite(v)) return '';
  if(v>=70) return `단기 과열 가능성이 높아진 구간이에요.`;
  if(v>=55) return `상승 힘이 비교적 강한 구간이지만 아직 과열 기준(70)에는 도달하지 않았어요.`;
  if(v<=30) return `단기 과매도 가능성이 높아진 구간이에요.`;
  if(v<=45) return `하락 힘이 비교적 강한 구간이지만 아직 과매도 기준(30)에는 도달하지 않았어요.`;
  return `상승과 하락의 힘이 비슷한 중립 구간이에요.`;
}

// ④ 거래량 급증 — 같은 날 가격이 오르내린 방향과 엮어서 해석한다(거래량 하나만 보고 끝내지 않기).
function getVolumeInterpretation(ev,S){
  const ratio=(typeof ev.currentValue==='number')?ev.currentValue.toFixed(1):'—';
  let priceDir=null;
  if(S&&S.c&&S.c.length>=2){
    const c1=S.c[S.c.length-1],c0=S.c[S.c.length-2];
    if(typeof c1==='number'&&typeof c0==='number'&&c0) priceDir=c1>c0?'up':(c1<c0?'down':'flat');
  }
  let combo;
  if(priceDir==='up') combo=`거래량이 크게 늘면서 주가도 함께 올랐습니다. 상승에 참여하는 투자자가 많아지고 있다는 신호로 해석할 수 있어요.`;
  else if(priceDir==='down') combo=`거래량이 크게 늘면서 주가는 내렸습니다. 매도세가 강해지고 있다는 신호일 수 있어요.`;
  else combo=`거래량이 평소보다 크게 늘었습니다. 시장의 관심이 커졌다는 뜻으로 볼 수 있어요.`;
  return `거래량이 최근 20일 평균의 <b>${ratio}배</b>로 늘며 평소보다 크게 늘었습니다.<br><br>`+
    combo+` 거래량 급증은 매수·매도 어느 쪽으로도 나올 수 있으니 가격 방향과 함께 해석하는 것이 중요해요.`;
}

// ⑤ MACD 교차
function getMacdInterpretation(ev){
  if(ev.type==='macd_golden_cross'){
    return `MACD가 시그널선을 위로 통과했습니다. 최근 상승과 하락 힘의 우세가 상승 쪽으로 바뀌는 지점으로 해석할 수 있습니다.<br><br>`+
      `이 교차는 자주 뒤바뀌기도 해서 이것 하나만으로 추세를 단정하긴 어려워요. 가격 흐름과 거래량이 함께 좋아지는지 확인해보세요.`;
  }
  if(ev.type==='macd_dead_cross'){
    return `MACD가 시그널선을 아래로 통과했습니다. 최근 상승과 하락 힘의 우세가 하락 쪽으로 바뀌는 지점으로 해석할 수 있습니다.<br><br>`+
      `이 교차는 자주 뒤바뀌기도 해서 이것 하나만으로 추세를 단정하긴 어려워요. 가격 흐름과 거래량이 실제로 약해지는지 확인해보세요.`;
  }
  return esc(radarDef(ev.type).description);
}

// 이벤트 타입 → 해석 함수 배차(계산 로직은 그대로 두고 "표현"만 분리)
function radarInterpret(ev,S){
  if(isMaCrossType(ev.type)) return getMovingAverageInterpretation(ev);
  if(ev.type.indexOf('bb_')===0) return getBollingerInterpretation(ev);
  if(ev.type.indexOf('rsi_')===0) return getRsiEventInterpretation(ev);
  if(ev.type==='volume_spike') return getVolumeInterpretation(ev,S);
  if(ev.type.indexOf('macd_')===0) return getMacdInterpretation(ev);
  return esc(radarDef(ev.type).description)+'<br><br>'+esc(radarDef(ev.type).caution);
}

// 어제→오늘 비교 카드용 짧은 한 줄 해석(위 radarInterpret의 문구와 겹치지 않게 다르게 쓴다)
function rdShortInterp(kind,val,extra){
  if(kind==='rsi') return rsiLevelText(val);
  if(kind==='price'){
    if(val>0) return '최근 가격 흐름이 상승 방향으로 움직이고 있어요.';
    if(val<0) return '최근 가격 흐름이 하락 방향으로 움직이고 있어요.';
    return '가격이 거의 움직이지 않았어요.';
  }
  if(kind==='band') return extra==='below'?'종가가 밴드 하단 아래에 있어 단기 약세 신호예요.':'종가가 밴드 안에서 움직이고 있어요.';
  if(kind==='vol'){
    if(val>=2) return '시장 참여가 크게 늘어난 상태예요.';
    if(val>=1.5) return '거래가 평소보다 활발한 상태예요.';
    if(val>=1) return '평소보다 관심이 조금 늘었어요.';
    return '평소보다 조용한 거래예요.';
  }
  if(kind==='ma') return val?'20일선이 60일선 위에 있어 중기 흐름이 개선되고 있어요.':'20일선이 60일선 아래에 있어 중기 흐름이 아직 무거운 편이에요.';
  return '';
}

// ⑥ 종합 해석 — RSI·거래량·볼린저·이동평균을 한데 모아 "지금 흐름"을 한두 문장으로 묶어준다.
// 근거를 나열하는 방식이라 지표 몇 개가 비어 있어도(데이터 부족) 문장이 자연스럽게 줄어든다.
function getRadarSummaryParts(S){
  if(!S||!S.c||S.c.length<2) return null;
  const n=S.c.length,i=n-1,j=n-2;
  const num=v=>(typeof v==='number'&&isFinite(v))?v:null;
  const rsi=num(S.r&&S.r[i]), c1=num(S.c[i]), c0=num(S.c[j]);
  const pct=(c1!==null&&c0)?((c1/c0-1)*100):null;
  const bu=num(S.bu&&S.bu[i]), bl=num(S.bl&&S.bl[i]);
  const hasMa=rdHasMa(S), ma20=num(S.bm&&S.bm[i]), ma60=hasMa?num(S.m60&&S.m60[i]):null;
  const vol=num(S.v&&S.v[i]), volAvg=num(S.va&&S.va[i]);
  const volRatio=(vol!==null&&volAvg)?vol/volAvg:null;

  const up=[],caution=[];
  if(ma20!==null&&ma60!==null){
    if(ma20>ma60) up.push('20일선이 60일선 위에 있어 중기 흐름은 우호적');
    else caution.push('20일선이 60일선 아래에 있어 중기 흐름은 아직 무거운 편');
  }
  if(pct!==null){
    if(pct>0) up.push(`전일보다 ${pct.toFixed(1)}% 올랐어요`);
    else if(pct<0) caution.push(`전일보다 ${Math.abs(pct).toFixed(1)}% 내렸어요`);
  }
  if(rsi!==null){
    if(rsi>=70) caution.push(`RSI ${rsi.toFixed(1)}로 단기 과열 구간`);
    else if(rsi>=55) up.push(`RSI ${rsi.toFixed(1)}로 상승 힘이 비교적 강한 구간`);
    else if(rsi<=30) caution.push(`RSI ${rsi.toFixed(1)}로 단기 과매도 구간`);
    else if(rsi<=45) caution.push(`RSI ${rsi.toFixed(1)}로 하락 힘이 비교적 강한 구간`);
  }
  if(volRatio!==null){
    if(volRatio>=1.5) up.push(`거래량이 평균의 ${volRatio.toFixed(1)}배로 활발`);
    else if(volRatio<1) caution.push('거래량이 평소보다 적어 참여가 조용한 편');
  }
  if(c1!==null&&bu!==null&&c1>bu) caution.push('종가가 볼린저밴드 상단 위로 올라와 단기 과열 신호');
  if(c1!==null&&bl!==null&&c1<bl) caution.push('종가가 볼린저밴드 하단 아래로 내려가 단기 약세 신호');

  let head;
  if(up.length>=2&&!caution.length) head='최근 상승 흐름이 뚜렷하게 나타나고 있어요.';
  else if(up.length&&caution.length) head='상승 힘과 주의해야 할 신호가 함께 나타나는 구간이에요.';
  else if(caution.length>=2&&!up.length) head='하락 압력이 우세한 흐름으로 보여요.';
  else if(up.length) head='완만한 상승 흐름이 나타나고 있어요.';
  else if(caution.length) head='조심스러운 흐름이 이어지고 있어요.';
  else head='뚜렷한 방향 없이 눈치보기 장세예요.';

  let body=up.length?up.slice(0,2).join(', ')+'.':'';
  if(caution.length){ const c=caution.slice(0,2).join(', ')+'.'; body+=body?' 다만 '+c:c; }
  return {head,body};
}
function getRadarSummary(S){
  const parts=getRadarSummaryParts(S);
  if(!parts) return '';
  return `<div class="rd-summary"><div class="rd-summary-t">현재 흐름</div><p>${esc(parts.head)} ${esc(parts.body)}</p></div>`;
}
// ⑥-2 최종 종합의견 — 위 개별 신호·비교 카드를 다 본 뒤, 화면 맨 아래에서 한 번 더 정리해준다.
// (내용은 위 "현재 흐름" 카드와 같은 근거를 쓰되, 다 읽고 난 뒤의 "그래서 결론은?" 자리라 문구를 다르게 짠다.)
function radarFinalOpinionHTML(S){
  const parts=getRadarSummaryParts(S);
  if(!parts) return '';
  return `<div class="rd-summary rd-final"><div class="rd-summary-t">최종 종합의견</div>`+
    `<p>${esc(parts.head)} ${esc(parts.body)}</p>`+
    `<p class="rd-final-note">여러 지표를 기계적으로 모은 참고용 해석일 뿐, 매수·매도를 권유하지 않아요.</p></div>`;
}

// ⑦ 개별 신호 카드 — "현재 상태 → 의미 → 주의점" 구조로 사건 하나하나를 풀어 보여준다.
function radarEventCardHTML(ev,S){
  const d=radarDef(ev.type);
  return `<div class="rd-event-card">`+
    `<div class="rd-event-head"><span aria-hidden="true">${esc(d.icon)}</span>${esc(d.label)}`+
    `<span class="rd-event-val">${esc(radarValueText(ev))}</span></div>`+
    `<div class="rd-event-body">${radarInterpret(ev,S)}</div></div>`;
}

// ⑧ 어제 → 오늘 비교 카드(항목·이전·현재·변화·해석). 표 대신 카드로 둬서 좁은 화면에서도 안 잘린다.
function rdCompareCards(series,events){
  const n=series.d.length; if(n<2) return '';
  const i=n-1,j=n-2;
  const num=v=>(typeof v==='number'&&isFinite(v))?v:null;
  const money=v=>v===null?'—':Math.round(v).toLocaleString('ko-KR')+'원';
  const has=t=>events.some(e=>e.type===t);
  const cards=[];

  const r0=num(series.r[j]), r1=num(series.r[i]);
  if(r0!==null&&r1!==null){
    let ch='변화 없음';
    if(has('rsi_oversold_entry')) ch='과매도 진입';
    else if(has('rsi_oversold_exit')) ch='과매도 탈출';
    else if(has('rsi_overbought_entry')) ch='과매수 진입';
    else if(has('rsi_overbought_exit')) ch='과매수 탈출';
    else ch=(r1>r0?'상승':(r1<r0?'하락':'변화 없음'));
    cards.push({label:'RSI',prev:r0.toFixed(1),cur:r1.toFixed(1),change:ch,interp:rdShortInterp('rsi',r1)});
  }
  const c0=num(series.c[j]), c1=num(series.c[i]);
  if(c0!==null&&c1!==null&&c0!==0){
    const pct=(c1/c0-1)*100;
    cards.push({label:'종가',prev:money(c0),cur:money(c1),change:(pct>=0?'+':'')+pct.toFixed(1)+'%',interp:rdShortInterp('price',pct)});
  }
  const l0=num(series.bl[j]), l1=num(series.bl[i]);
  if(l0!==null&&l1!==null&&c1!==null){
    const below=c1<l1;
    cards.push({label:'볼린저밴드 하단',prev:money(l0),cur:money(l1),change:below?'종가가 하단 아래':'종가가 밴드 안',
      interp:rdShortInterp('band',null,below?'below':'in')});
  }
  const v0=num(series.v[j]), v1=num(series.v[i]), a0=num(series.va[j]), a1=num(series.va[i]);
  if(v1!==null&&a1!==null&&a1>0){
    const rat0=(v0!==null&&a0)?(v0/a0):null, rat1=v1/a1;
    cards.push({label:'거래량 배수',prev:(rat0!==null?rat0.toFixed(1)+'배':'—'),cur:rat1.toFixed(1)+'배',
      change:(rat1>=2?'거래량 급증':'평소 수준'),interp:rdShortInterp('vol',rat1)});
  }
  if(rdHasMa(series)){
    // ⭐ 2026-08-08: "MA20 > MA60"처럼 부등호 그대로 보여주면 무슨 뜻인지 모르겠다는 피드백 →
    // 두 선의 위아래 관계를 기호 없이 말로 풀어서 보여준다.
    const m20=num(series.bm[i]), m60=num(series.m60[i]);
    const m20p=num(series.bm[j]), m60p=num(series.m60[j]);
    const relText=above=>above?'20일선이 60일선 위':'20일선이 60일선 아래';
    if(m20!==null&&m60!==null){
      cards.push({label:'MA20 · MA60(20일선·60일선)',
        prev:(m20p!==null&&m60p!==null)?relText(m20p>m60p):'—',
        cur:relText(m20>m60),
        change:(m20>m60?'중기 우위':'중기 열세'),interp:rdShortInterp('ma',m20>m60)});
    }
  }
  if(!cards.length) return '';
  return `<div class="rd-cmp-wrap">`+cards.map(c=>
    `<div class="rd-cmp-card"><div class="rd-cmp-top"><span class="rd-cmp-label">${esc(c.label)}</span>`+
    `<span class="rd-cmp-change">${esc(c.change)}</span></div>`+
    `<div class="rd-cmp-vals">${esc(c.prev)} → <b>${esc(c.cur)}</b></div>`+
    `<div class="rd-cmp-interp">${esc(c.interp)}</div></div>`).join('')+`</div>`;
}

function renderRadarDetail(code){
  const el=document.getElementById('radarDetail'); if(!el) return;
  const events=radarEventsOf(code);
  if(!RADAR||!events.length){ el.classList.remove('on'); el.innerHTML=''; return; }
  const st=RADAR.status==='provisional'?'is-provisional':'is-confirmed';
  const sigs=events.map(e=>{const d=radarDef(e.type);
    return `<span class="rd-sig"><span aria-hidden="true">${esc(d.icon)}</span>${esc(d.label)} `+
      `<span style="font-weight:600;color:var(--gaeo-muted)">${esc(radarValueText(e))}</span></span>`;}).join('');
  // ⭐ 2026-08-07: "MACD−시그널: -63 → 7" 숫자만 보고는 무슨 뜻인지 알기 어렵다는 피드백 →
  // MACD 관련 신호가 하나라도 있으면 그 값이 뭘 뺀 건지 아주 작은 글씨로 설명을 붙인다.
  const macdNote=events.some(e=>radarDef(e.type).metric==='MACD−시그널')
    ? `<p style="margin:4px 0 0;font-size:9.5px;line-height:1.5;color:var(--gaeo-muted)">MACD−시그널은 MACD값에서 시그널값을 뺀 차이(히스토그램)예요. 음수(−)에서 양수(+)로 바뀌면 MACD선이 시그널선을 아래에서 위로 넘었다는 뜻(골든크로스), 반대로 바뀌면 데드크로스예요.</p>`
    : '';
  // ⭐ 2026-08-07: "레이더 변화가 뭔데?"부터 막히지 않도록, 기능 자체의 목적을 먼저 짧게 설명한다.
  const intro=`<p class="rd-intro">레이더는 이동평균선 교차, 거래량 급증, 볼린저밴드 돌파, RSI 변화처럼 `+
    `최근 새로 발생한 기술적 변화를 자동으로 찾아 보여줘요. 신호 하나만으로 매수·매도를 정하기보다, `+
    `여러 지표가 같은 방향을 가리키는지 함께 확인하는 것이 좋아요.</p>`;
  const head=`<div class="rd-head"><h3>레이더 포착 변화 ${events.length}건</h3>`+
    `<span class="rd-asof">시세 기준 ${esc(String(RADAR.priceLabel||'').replace(' 수집',''))}<br>`+
    `레이더 생성 ${esc(RADAR.generatedAt||'-')} · <span class="gr-status ${st}">${esc(radarStatusText())}</span></span></div>`+
    intro+`<div class="rd-sigs">${sigs}</div>${macdNote}`;
  const eventsHTML=`<div class="rd-events">${events.map(e=>radarEventCardHTML(e,null)).join('')}</div>`;
  const note='<p class="rd-note">'+esc(RADAR.disclaimer||'')+'</p>';
  el.innerHTML=head+eventsHTML+'<p class="rd-hint" style="margin-top:16px;font-size:11px;color:var(--gaeo-muted)">차트를 불러오는 중이에요…</p>'+note;
  el.classList.add('on');
  GaeoFeatures.load('radar').then(()=>{
    const S=(typeof GAEO_RADAR_SERIES!=='undefined'&&GAEO_RADAR_SERIES)?GAEO_RADAR_SERIES[code]:null;
    if(!S||!S.d||S.d.length<2){
      el.innerHTML=head+eventsHTML+'<p class="rd-note">이 종목은 차트를 그릴 만큼 데이터가 쌓이지 않았어요.</p>'+note;
      return;
    }
    const rsiNow=S.r&&S.r[S.r.length-1];
    const summary=getRadarSummary(S);
    const eventsHTML2=`<div class="rd-events">${events.map(e=>radarEventCardHTML(e,S)).join('')}</div>`;
    const charts=
      `<div class="rd-chart"><h4>최근 ${S.d.length}거래일 가격과 볼린저밴드</h4>`+
      `<p class="rd-hint">볼린저밴드는 20일 평균선 위아래로 표준편차 2배만큼 그린 '평소 움직이는 범위'예요. `+
      `상단을 돌파했다고 무조건 꺾이는 건 아니고, 강한 상승장에서는 밴드 상단을 따라 계속 오르기도 해요.</p>`+
      `<div class="rd-svg-wrap">${rdPriceChart(S,events)}</div>`+
      rdLegend([{label:'종가',color:RD_COL.close},{label:'밴드 상·하단',color:RD_COL.band,cls:'dash'},
                {label:'중심선(20일 평균)',color:RD_COL.mid,cls:'dash'},{label:'신호 발생일',color:RD_COL.mark,cls:'dash'}])+`</div>`+
      `<div class="rd-chart"><h4>RSI (14일)</h4>`+
      `<p class="rd-hint">RSI는 최근 상승과 하락 중 어느 쪽 힘이 더 센지를 보여줘요. 30 아래는 과매도, 70 위는 과매수 구간이에요.`+
      (typeof rsiNow==='number'?` 지금은 <b>${rsiNow.toFixed(1)}</b>로 ${rsiLevelText(rsiNow)}`:'')+`</p>`+
      `<div class="rd-svg-wrap">${rdRsiChart(S,events)}</div>`+
      rdLegend([{label:'RSI',color:RD_COL.rsi},{label:'30 과매도선',color:'#5B8EAA',cls:'dash'},
                {label:'70 과매수선',color:'#B4666C',cls:'dash'}])+`</div>`+
      `<div class="rd-chart"><h4>거래량</h4>`+
      `<p class="rd-hint">점선은 최근 20거래일 평균 거래량이에요. 평균의 2배를 넘은 날은 '급증'으로 표시했어요. `+
      `거래량은 가격이 오르내린 방향과 함께 볼 때 의미가 더 분명해져요.</p>`+
      `<div class="rd-svg-wrap">${rdVolChart(S,events)}</div>`+
      rdLegend([{label:'일별 거래량',color:RD_COL.vol,cls:'box'},{label:'20일 평균',color:RD_COL.avg,cls:'dash'},
                {label:'평균의 2배 이상',color:RD_COL.mark,cls:'box'}])+`</div>`;
    const extra=`<button class="rd-toggle" type="button" id="rdExtraBtn" aria-expanded="false" aria-controls="rdExtra">MACD·이동평균 차트 보기</button>`+
      `<div class="rd-extra" id="rdExtra"><div class="rd-chart"><h4>${term('MACD')}${rdHasMa(S)?' · 이동평균':''}</h4>`+
      `<p class="rd-hint">MACD가 시그널선을 위로 지나면 골든크로스, 아래로 지나면 데드크로스예요.`+
      (rdHasMa(S)?'':' (MA60은 60거래일 평균이라 이 기간에는 표시할 만큼 계산되지 않았어요.)')+`</p>`+
      `<div class="rd-svg-wrap">${rdExtraChart(S)}</div>`+
      rdLegend([{label:'MACD',color:RD_COL.macd},{label:'시그널선',color:RD_COL.sig,cls:'dash'}]
        .concat(rdHasMa(S)?[{label:'MA20',color:RD_COL.mid},{label:'MA60',color:RD_COL.ma60}]:[]))+`</div></div>`;
    el.innerHTML=head+summary+eventsHTML2+charts+rdCompareCards(S,events)+radarFinalOpinionHTML(S)+extra+note;
    const btn=document.getElementById('rdExtraBtn'), box=document.getElementById('rdExtra');
    if(btn&&box) btn.onclick=()=>{
      const on=box.classList.toggle('on');
      btn.setAttribute('aria-expanded',on?'true':'false');
      btn.textContent=on?'MACD·이동평균 차트 접기':'MACD·이동평균 차트 보기';
    };
  }).catch(()=>{
    el.innerHTML=head+eventsHTML+'<p class="rd-note">차트 자료를 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요.</p>'+note;
  });
}
window.renderGaeoRadar=renderGaeoRadar;
try{ renderGaeoRadar(); }catch(e){ console.warn('radar render', e); }

/* ─── 📄 공시 → 분석가 매칭 규칙 (최상위 스코프) ────────────────────────────
   홈 위젯(renderDartBoard)과 종목 화면(dartMatchHTML)이 **같은 규칙**을 써야
   두 화면의 분류가 어긋나지 않는다. 그래서 규칙은 최상위에 한 벌만 둔다. */
const DART_AXIS_RULES=[
  {axis:'risk', label:'정정·해명',
   re:/정정|해명|불성실공시|소송|감사의견|관리종목|거래정지|상장폐지|조회공시/},
  {axis:'flow', label:'지분·주식 수',
   re:/대량보유|특정증권등소유|자기주식|자사주|주주명부|주주총회|의결권|최대주주|스톡옵션|주식매수선택권/},
  {axis:'diana', label:'실적·자금·계약',
   re:/보고서|실적|결산|배당|증자|사채|합병|분할|양수도|취득|처분|투자판단|공급계약|수주|설명회|IR|기업가치|임상|승인/}
];
const DART_AXIS_NAME={diana:'재무',flow:'수급',risk:'리스크'};
/* 2026-09-03 소유자 지시 — "공시내용을 훨씬 구체적으로": DART 제목은 법률 용어라
   "임원ㆍ주요주주특정증권등소유상황보고서" 같은 제목만 봐선 무슨 뜻인지 알기 어렵다.
   본문 전체를 새로 가져오는 건 오늘 범위 밖(DART 원문 문서를 종목마다 내려받아 파싱해야
   해서 별도 파이프라인·예산 검토가 필요)이라, 대신 ① 제목 패턴을 쉬운 한 줄 설명으로
   바꾸고 ② 항목마다 DART 공식 원문 링크(rceptNo 있을 때만)를 붙여 "더 구체적으로" 요청을
   충족한다. dartAxisOf와 같은 스타일로, 위에서부터 먼저 맞는 규칙을 쓴다. */
const DART_EXPLAIN_RULES=[
  {re:/자기주식.*(신탁|처분)|자사주.*(신탁|처분)/, text:'회사가 갖고 있던 자기 주식을 다시 팔거나, 증권사에 사달라고 신탁 계약을 맺었다는 공시예요.'},
  {re:/자기주식|자사주/, text:'회사가 자기 회사 주식을 사들이기로 했다는 공시예요. 흔히 주가를 방어하려는 신호로 읽혀요.'},
  {re:/임원.*소유상황|특정증권등소유상황/, text:'회사 임원이나 주요 주주가 가진 주식 수가 바뀌었다는 신고예요. 사고팔 때마다 신고할 의무가 있어요.'},
  {re:/대량보유상황/, text:"이 회사 주식을 5% 넘게 가진 주주의 지분이 바뀌었다는 신고예요(이른바 '5%룰')."},
  {re:/최대주주.*변경|경영권.*변경/, text:'이 회사의 최대주주(가장 많은 지분을 가진 주주)가 바뀌었다는 공시예요.'},
  {re:/단일판매|공급계약|수주/, text:'다른 회사와 물건이나 서비스를 팔거나 공급하는 큰 계약을 맺었다는 공시예요. 회사 매출에 영향을 줄 수 있어요.'},
  {re:/유상증자/, text:'회사가 새 주식을 발행해서 투자자에게 돈을 받고 팔기로 했다는 공시예요(유상증자). 전체 주식 수가 늘어나요.'},
  {re:/무상증자/, text:'주주들에게 공짜로 새 주식을 나눠주기로 했다는 공시예요(무상증자). 회사에 새 돈이 들어오지는 않아요.'},
  {re:/전환사채|신주인수권부사채|교환사채/, text:'나중에 주식으로 바꿀 수 있는 채권(빌린 돈 증서)을 발행해서 자금을 조달했다는 공시예요.'},
  {re:/타법인.*취득|출자증권.*취득/, text:'다른 회사의 주식이나 지분을 사들이기로 했다는 공시예요(투자 또는 인수).'},
  {re:/영업양수도|자산양수도/, text:'회사의 사업이나 자산 일부를 사고팔기로 했다는 공시예요.'},
  {re:/합병/, text:'다른 회사와 합치기로(합병) 했다는 공시예요.'},
  {re:/분할/, text:'회사를 둘 이상으로 나누기로(분할) 했다는 공시예요.'},
  {re:/감사보고서/, text:'회계법인이 이 회사 재무제표를 검사한 결과를 담은 보고서예요.'},
  {re:/사업보고서/, text:'회사가 1년 치 사업 내용과 재무 상태를 정리해 낸 정기 보고서예요.'},
  {re:/분기보고서|반기보고서/, text:'회사가 분기나 반기마다 내는 실적·재무 정기 보고서예요.'},
  {re:/영업\(잠정\)실적|매출액.*손익구조/, text:'회사의 매출이나 이익이 크게 바뀌었다는 실적 공시예요.'},
  {re:/현금.*배당|현물.*배당|배당결정/, text:'주주에게 회사 이익을 나눠주는 배당을 하기로 했다는 공시예요.'},
  {re:/주주총회/, text:'주주들이 모여 회사의 중요한 일을 결정하는 주주총회 관련 공시예요.'},
  {re:/풍문|보도.*해명/, text:'떠도는 소문이나 언론 보도 내용이 사실인지 회사가 직접 밝힌 공시예요.'},
  {re:/조회공시/, text:'거래소가 소문·보도가 사실인지 회사에 물어본 데 대한 답변 공시예요.'},
  {re:/소송/, text:'이 회사가 소송을 당했거나 소송을 냈다는 공시예요.'},
  {re:/정정|기재정정/, text:'전에 낸 공시 내용 중 일부를 고쳐서 다시 낸 정정 공시예요.'},
  {re:/기업설명회|IR/i, text:'투자자에게 회사 사업을 설명하는 자리(기업설명회)를 연다는 공시예요.'},
];
function dartExplain(title){
  const t=String(title||'');
  for(const r of DART_EXPLAIN_RULES) if(r.re.test(t)) return r.text;
  return '금융감독원에 제출한 공식 공시예요. 자세한 내용은 DART 원문에서 확인할 수 있어요.';
}
/* 한국어 조사 — 받침이 있으면 '과', 없으면 '와'. ('수급와' 같은 어색한 표기를 막는다) */
function josaGwa(word){
  const ch=String(word||'').trim().slice(-1);
  const code=ch.charCodeAt(0);
  if(!(code>=0xAC00&&code<=0xD7A3)) return '와';      // 한글 음절이 아니면 기본값
  return ((code-0xAC00)%28)?'과':'와';                 // 종성이 있으면 '과'
}
function dartAxisOf(name){
  const t=String(name||'');
  for(const r of DART_AXIS_RULES) if(r.re.test(t)) return r;
  return {axis:'diana', label:'기업 정보'};
}
/* 오늘(=수집 기준일) 공시를 종목 구분 없이 한 줄씩 펼쳐 최신순으로 모은다. */
function dartTodayItems(){
  // ① 소형 스냅샷(dart_today.js)이 있으면 그걸 쓴다 — 홈에서 3MB를 받지 않기 위한 경로다.
  const snap=(typeof DART_TODAY!=='undefined'&&DART_TODAY)?DART_TODAY:
    ((typeof window!=='undefined'&&window.DART_TODAY)||null);
  if(snap&&Array.isArray(snap.items)){
    return snap.items.map(it=>{
      const ax=dartAxisOf(it.title);
      return {code:it.code, name:it.name||it.code, title:it.title,
        receiptDate:it.receiptDate||'', isCorrection:!!it.isCorrection,
        detectedAt:it.detectedAt||'', axis:ax.axis, axisLabel:ax.label,
        // 2026-09-03: rceptNo는 analyze_auto.py가 다음 자동 수집부터 채운다. 옛 스냅샷에는
        // 없을 수 있어 빈 문자열로 안전하게 받는다(렌더 쪽에서 없으면 원문 링크를 그냥 생략).
        rceptNo:it.rceptNo||''};
    });
  }
  // ② 스냅샷이 아직 없으면(구버전 배포 등) 이미 받아 둔 자동분석에서 직접 만든다.
  const auto=(typeof window.GaeoUseAuto==='function')?window.GaeoUseAuto():null;
  if(!auto||!auto.stocks) return [];
  const out=[];
  for(const code in auto.stocks){
    const d=auto.stocks[code]&&auto.stocks[code].dart;
    if(!d||!Array.isArray(d.items)) continue;
    d.items.forEach(it=>{
      if(!it||!it.name) return;
      const ax=dartAxisOf(it.name);
      out.push({code, name:(STOCKS[code]&&STOCKS[code].name)||code,
        title:String(it.name).replace(/\s+/g,' ').trim(),
        receiptDate:it.receiptDate||'', isCorrection:!!it.isCorrection,
        detectedAt:it.detectedAt||'', axis:ax.axis, axisLabel:ax.label});
    });
  }
  out.sort((a,b)=>String(b.detectedAt).localeCompare(String(a.detectedAt))
    ||String(a.name).localeCompare(String(b.name)));
  return out;
}

/* 분석가 카드용 — 그 분석가 축에 해당하는 공시만 골라 보여준다. 없으면 아무것도 안 그린다
   ("공시 없음"은 "이슈 없음"이 아니므로 없다고 단정하는 문구를 만들지 않는다). */
function dartMatchHTML(code, axis){
  const auto=(typeof window.GaeoUseAuto==='function')?window.GaeoUseAuto():null;
  const d=auto&&auto.stocks?(auto.stocks[code]||{}).dart:null;
  if(!d||!Array.isArray(d.items)||!d.items.length) return '';
  const hits=d.items.filter(it=>it&&it.name&&dartAxisOf(it.name).axis===axis);
  if(!hits.length) return '';
  const rows=hits.slice(-3).reverse().map(it=>{
    const r=String(it.receiptDate||'');
    const day=r.length===8?`${r.slice(4,6)}.${r.slice(6,8)}`:'';
    return `<div class="dm-item"><span>${esc(String(it.name).replace(/\s+/g,' ').trim())}</span>`
      +`<small>${day}${it.isCorrection?' · 정정':''}</small></div>`;
  }).join('');
  return `<div class="dart-match">
    <div class="dm-head"><b>${esc(DART_AXIS_NAME[axis]||'')}${josaGwa(DART_AXIS_NAME[axis]||'')} 관련된 공식 공시</b>`
    +`<span>${hits.length}건${d.count>hits.length?` / 전체 ${d.count}건`:''}</span></div>
    ${rows}
    <p class="dm-note">금융감독원 전자공시(DART) 원문 제목이에요. 참고 정보이며 이 분석가의 점수에는 반영되지 않습니다.</p>
  </div>`;
}

/* ── 📄 오늘의 공시(홈) — 제목만 훑는 목록, 한 장에 5건 ────────────────────────
   자세한 내용은 그 종목의 분석 화면(분석가별 근거 · 종합 판단)에서 축별로 매칭해
   보여주므로, 여기서는 "무슨 공시가 있었나"만 빠르게 넘겨 볼 수 있게 한다.
   항목을 누르면 해당 종목 분석으로 바로 이동한다. */
const DART_PAGE_SIZE=5;
let DART_PAGE=0;
function renderDartBoard(){
  const box=document.getElementById('dartBoard');
  const list=document.getElementById('dartBoardList');
  const pager=document.getElementById('dartBoardPager');
  const cnt=document.getElementById('dartBoardCount');
  const label=document.getElementById('dartPageLabel');
  if(!box||!list) return;
  let items=[];
  try{ items=dartTodayItems(); }catch(e){ items=[]; }
  // 공시가 한 건도 없는 날은 "공시 없음"을 단정하지 않고 섹션 자체를 숨긴다.
  if(!items.length){ box.hidden=true; return; }
  box.hidden=false;
  const pages=Math.max(1,Math.ceil(items.length/DART_PAGE_SIZE));
  if(DART_PAGE>=pages) DART_PAGE=pages-1;
  if(DART_PAGE<0) DART_PAGE=0;
  const from=DART_PAGE*DART_PAGE_SIZE;
  const page=items.slice(from,from+DART_PAGE_SIZE);
  if(cnt) cnt.textContent=`${items.length}건`;
  list.innerHTML=page.map(it=>{
    const r=String(it.receiptDate||'');
    const day=r.length===8?`${r.slice(4,6)}.${r.slice(6,8)}`:'';
    // 2026-09-03 소유자 지시: 법률 용어 제목만으로는 뭔지 알기 어려워 쉬운 말 설명을 한 줄 더 붙이고,
    // rceptNo가 있으면(다음 자동 수집부터 채워짐) DART 공식 원문으로 가는 링크를 함께 보여준다.
    const dartUrl=it.rceptNo?`https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${encodeURIComponent(it.rceptNo)}`:'';
    return `<li class="db-item" data-go="${esc(it.name)}" data-code="${esc(it.code)}" tabindex="0" role="link"`
      +` aria-label="${esc(it.name)} 공시: ${esc(it.title)} — 종목분석으로 이동">`
      +`<span class="db-main"><span class="db-nm">${esc(it.name)}</span>`
      +`<span class="db-tt">${esc(it.title)}${it.isCorrection?' <span class="db-fix">· 정정</span>':''}</span>`
      +`<span class="db-explain">${esc(dartExplain(it.title))}</span>`
      +(dartUrl?`<a class="db-orig" href="${esc(dartUrl)}" target="_blank" rel="noopener noreferrer" data-dart-orig>DART 원문 보기 ↗</a>`:'')
      +`</span>`
      +`<span class="db-meta">${esc(day)}<span class="db-axis">${esc(it.axisLabel)}</span></span></li>`;
  }).join('');
  if(pager){
    pager.hidden=pages<=1;
    if(label) label.textContent=`${DART_PAGE+1} / ${pages}`;
    const prev=document.getElementById('dartPrev'), next=document.getElementById('dartNext');
    if(prev) prev.disabled=DART_PAGE<=0;
    if(next) next.disabled=DART_PAGE>=pages-1;
  }
}
(function(){
  const prev=document.getElementById('dartPrev'), next=document.getElementById('dartNext');
  if(prev) prev.onclick=()=>{ DART_PAGE--; renderDartBoard(); };
  if(next) next.onclick=()=>{ DART_PAGE++; renderDartBoard(); };
  const list=document.getElementById('dartBoardList');
  // 이동은 사이트의 기존 방식(jumpToStock)을 그대로 쓴다 — 종목명으로 검색창을 채우고
  // 단일 분석 모드로 넘어가는 동작이라 다른 위젯(캘린더·변화 보드)과 완전히 같다.
  const go=el=>{
    // 2026-09-03: "DART 원문 보기" 링크 클릭은 종목분석 이동과 별개다 — 링크의 기본 동작(새 탭 열기)만
    // 하게 두고, 여기서 jumpToStock까지 같이 실행되지 않도록 막는다.
    if(el&&el.closest&&el.closest('[data-dart-orig]')) return;
    const row=el&&el.closest?el.closest('.db-item'):null;
    const name=row&&row.dataset.go;
    if(!name) return;
    try{ jumpToStock(name); if(typeof SFX!=='undefined') SFX.click(); }catch(e){ console.warn('dart go', e); } };
  if(list){
    list.addEventListener('click', e=>go(e.target));
    list.addEventListener('keydown', e=>{
      if(e.target.closest&&e.target.closest('[data-dart-orig]')) return; // 링크는 기본 Enter 동작 그대로
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(e.target); }
    });
  }
})();
window.renderDartBoard=renderDartBoard;
/* 소형 스냅샷을 받아온 뒤 한 번 그린다. 첫 페인트를 막지 않도록 화면이 한가해진 뒤에
   내려받고(12KB 남짓), 실패해도 홈의 다른 부분에는 영향을 주지 않는다. */
(function(){
  const draw=()=>{ try{ renderDartBoard(); }catch(e){ console.warn('dart board render', e); } };
  draw();                                    // 이미 로드돼 있으면 즉시
  const load=()=>{ if(!window.GaeoFeatures) return;
    GaeoFeatures.load('dartToday').then(draw).catch(()=>{}); };
  if('requestIdleCallback' in window) requestIdleCallback(load,{timeout:2500});
  else setTimeout(load,1200);
})();

/* 홈 「오늘의 판단」 각주 — BUY/HOLD/SELL이 실제로 얼마나 맞았는지.
   ⚠️ 숫자를 하드코딩하지 않는다. build_model_scoreboard.py가 매일 다시 만드는
      model_scoreboard.js를 런타임에 읽는다. 하드코딩하면 화면만 옛 숫자를 말하게 된다.
   ⚠️ 어느 집계 구간의 숫자인지 반드시 함께 밝힌다. 지금 성숙한 표본은 500종목을
      추적하던 구간뿐이라, 그 사실을 숨기면 "지금 598종목 성적"으로 오해된다. */
const COVERAGE_LABEL={GAEO_COVERAGE_V1_500:'500종목을 추적하던 구간',
                      GAEO_COVERAGE_V2_600:'600종목 추적 구간'};
function gaeoCallNoteHTML(){
  try{
    /* ⚠️ model_scoreboard.js는 const로 선언한다. 최상위 const는 window의 속성이
       되지 않으므로 window.MODEL_SCOREBOARD로는 절대 안 잡힌다(실측으로 확인).
       저장소의 다른 사용처(6436·6670·11025행)와 같이 맨 식별자로 읽는다. */
    const B=(typeof MODEL_SCOREBOARD!=='undefined'&&MODEL_SCOREBOARD)?MODEL_SCOREBOARD:null;
    if(!B||!Array.isArray(B.models)) return '';
    const m=B.models.find(x=>x.id==='base_production')||B.models[0]; if(!m||!m.byCoverage) return '';
    // 성숙한 표본이 가장 많은 구간을 쓴다(현재 coverage는 아직 안 익었을 수 있다).
    const rows=Object.entries(m.byCoverage).filter(([,d])=>d&&d.buy&&d.sell&&d.matured);
    if(!rows.length) return '';
    rows.sort((a,b)=>(b[1].matured||0)-(a[1].matured||0));
    const [covKey,d]=rows[0];
    const pc=x=>(x==null?'?':x);
    const nf=n=>Number(n||0).toLocaleString('ko-KR');
    const best=[['BUY',d.buy],['HOLD',d.hold],['SELL',d.sell]]
      .filter(r=>r[1]&&r[1].precision!=null).sort((a,b)=>b[1].precision-a[1].precision)[0];
    if(!best) return '';
    const tail=best[0]==='SELL'
      ? 'SELL이 가장 잘 맞아서, 살 종목을 고를 때보다 피할 종목을 거를 때 더 도움이 돼요.'
      : best[0]+' 판단이 지금까지 가장 잘 맞았어요.';
    const cov=COVERAGE_LABEL[covKey]||covKey;
    /* ⚠️ 여기 나오는 숫자는 "표본이 가장 많이 익은 구간"의 성적이다. 지금 추적 중인
       구간(600종목)이 아직 결론을 낼 만큼 안 익었으면, 이 숫자를 현재 성적으로
       읽지 않도록 그 사실을 같은 문장 안에서 밝힌다. 라벨만 붙이고 넘어가면
       "GAEO 판단 실측 성적 SELL 53.8%"가 오늘의 성적처럼 읽힌다. */
    let pendingNote='';
    const curKey=(B.coverage&&(B.coverage.current||B.coverage.id))||'GAEO_COVERAGE_V2_600';
    const cur=m.byCoverage[curKey];
    if(curKey!==covKey&&cur&&String(cur.status||'').startsWith('INSUFFICIENT')){
      pendingNote=' 지금 추적 중인 '+(COVERAGE_LABEL[curKey]||curKey)+'은 아직 판단 '
        +nf(cur.uniqueDates)+'일치뿐이라 따로 성적을 말하지 않아요.';
    }
    return '<span class="hdb-call-note"><b>GAEO 판단 실측 성적</b> '+
      'BUY '+pc(d.buy.precision)+'% · HOLD '+pc(d.hold&&d.hold.precision)+'% · SELL '+pc(d.sell.precision)+'%. '+
      tail+' ('+cov+'에서 '+nf(d.uniqueDates)+'일간 '+nf(d.matured)+'건을 채점한 기록이에요)'+pendingNote+'</span>';
  }catch(e){ return ''; }
}
window.gaeoCallNoteHTML=gaeoCallNoteHTML;

/* 🔄 업종 흐름에서 고른 종목 — 순환매+시장국면+당일 종가 시황으로 뽑은 관찰 후보.
   ⚠️ 성적 숫자(적중률·표본·기간)는 화면에서 하드코딩하지 않고 rotation_picks.js가 실어 온
      값을 그대로 쓴다. 모델이 갱신됐을 때 화면만 옛 숫자를 말하는 사고를 막는다.
   ⚠️ 이 목록은 GAEO Score(BUY/HOLD/SELL)를 바꾸지 않는다. 서로 독립이다. */
function renderRotationPicks(){
  const box=document.getElementById('homeRotationPicks');
  if(!box) return;
  const D=window.ROTATION_PICKS;
  if(!D||!Array.isArray(D.picks)){ box.hidden=true; return; }
  const esc=x=>String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list=document.getElementById('hrpList');
  const inputs=document.getElementById('hrpInputs');
  const asof=document.getElementById('hrpAsof');

  const cut=D.dataCutoff||'';
  if(asof) asof.textContent=(cut?cut+' 기준 · ':'')+(D.horizonDays||20)+'거래일 관찰';
  /* dataCutoff는 장중이면 "2026-08-20 10:30 장중", 마감 뒤면 "2026-08-20 종가"다.
     리드에 "종가까지"를 고정해두면 거래시간 내내 화면이 거짓말을 한다. */
  const lead=document.getElementById('hrpLead');
  if(lead){
    const when = /장중/.test(cut) ? '지금까지의 장중 시황' : '오늘 종가까지의 시황';
    lead.textContent='종목마다 점수를 매겨 고르는 방식이 아니에요. '+when+'으로 자금이 모이는 업종을 먼저 찾고, 그 업종 안에서 흐름이 강한 종목을 순서대로 뽑았어요.';
  }

  const r=D.regime||{};
  if(inputs){
    const cell=(k,v)=>v?'<span class="hrp-input"><span>'+esc(k)+'</span><b>'+esc(v)+'</b></span>':'';
    inputs.innerHTML=cell('시장 국면',r.direction)+cell('주도 시장',r.leadership)+cell('힘이 모인 업종',r.topSector);
  }

  if(!D.picks.length){
    /* 게이트가 목록을 비운 날. 왜 비었는지와 대신 볼 것을 반드시 같이 보여준다. */
    if(list) list.innerHTML='';
    let em=box.querySelector('.hrp-empty');
    if(!em){ em=document.createElement('p'); em.className='hrp-empty';
      box.querySelector('.hrp-head').appendChild(em); }
    /* ⚠️ 이유를 문장으로 단정하지 않는다. 게이트가 비는 경우는 두 가지이고
       (지수가 20일선 아래 / 조건을 통과한 종목이 아예 없음) 실려온 값으로 갈라 말한다.
       ⚠️ 「오늘의 판단」은 이 섹션보다 화면 위에 있다. "아래"라고 쓰면 안 된다. */
    const g=D.gate||{};
    const why = (g.indexAboveMa20===0)
      ? '코스피와 코스닥이 둘 다 20일 이동평균 아래에 있어서'
      : (g.allowed===0 ? '시장 상태가 목록을 내놓을 조건에 못 미쳐서'
                       : '조건을 통과한 종목이 없어서');
    const br = (g.breadthPct!=null) ? ' 오늘 20일선 위에 있는 종목은 '+g.breadthPct+'%예요.' : '';
    em.textContent='오늘은 '+why+' 목록을 비웠어요. 흐름이 한쪽으로 모이지 않는 구간이라 골라내도 신뢰하기 어렵기 때문이에요.'+br+' 위쪽 「오늘의 판단」과 순환매 화면은 그대로 볼 수 있어요.';
    box.hidden=false; return;
  }
  const em=box.querySelector('.hrp-empty'); if(em) em.remove();

  if(list){
    list.innerHTML=D.picks.map((p,i)=>
      '<li><button class="hrp-row" type="button" data-hrp-stock="'+esc(p.name)+'">'+
      '<span class="hrp-rank">'+String(i+1).padStart(2,'0')+'</span>'+
      '<span class="hrp-main"><span class="hrp-name">'+esc(p.name)+
      (p.overheat?'<span class="hrp-hot">과열</span>':'')+
      /* GAEO Score가 SELL인데 업종 흐름으로는 뽑힌 종목. 빼지 않고 갈렸다는 사실을 그대로 보여준다. */
      (p.callConflict?'<span class="hrp-flag">GAEO는 SELL</span>':'')+'</span>'+
      '<span class="hrp-why">'+esc(p.why)+'</span></span>'+
      '<span class="hrp-sector"><b>'+esc(p.sector)+'</b><span>업종 흐름 '+esc(p.sectorRank)+'위</span></span>'+
      '</button></li>').join('');
  }

  const rec=D.record||{};
  const recEl=document.getElementById('hrpRecord');
  const noteEl=document.getElementById('hrpRecordNote');
  if(recEl&&rec.hitRate!=null){
    recEl.innerHTML='<b>업종 모델 실측 성적</b> '+(D.horizonDays||20)+'거래일 적중률 '+esc(rec.hitRate)+'% · 초과수익 평균 '+
      (rec.excessMean>=0?'+':'')+esc(rec.excessMean)+'% · 표본 '+esc(rec.sampleCount)+'회';
  }
  /* GAEO 판단이 SELL인데 업종 흐름으로 뽑힌 종목. 목록에서 빼지 않고 갈렸다고 알린다.
     ⚠️ 실측상 SELL이 세 판단 중 가장 정확했으므로(홈 「오늘의 판단」 각주) 이 충돌을
        가볍게 적으면 안 된다. */
  const conflictEl=document.getElementById('hrpConflictNote');
  if(conflictEl){
    const names=D.picks.filter(p=>p.callConflict).map(p=>p.name);
    if(names.length){
      /* ⚠️ 종목 이름 뒤에 은/는을 붙이지 말 것. 「NHN는」처럼 틀린 조사가 나온다.
         받침 판별을 넣는 대신 조사가 필요 없는 문장으로 쓴다. */
      conflictEl.innerHTML='<b>판단이 갈린 종목이 있어요.</b> '+esc(names.join(' · '))+
        ' — 업종 흐름으로는 뽑혔지만 종목별 GAEO 판단은 SELL이에요. '+
        '두 방식이 서로 다른 것을 보기 때문인데, 지금까지 실측으로는 SELL 판단이 셋 중 가장 정확했어요. '+
        '목록에서 빼지 않고 그대로 두되 갈렸다는 사실을 같이 알려드려요.';
      conflictEl.hidden=false;
    }else{ conflictEl.textContent=''; conflictEl.hidden=true; }
  }

  if(noteEl&&rec.periodStart){
    const ym=d=>{const m=String(d).match(/^(\d{4})-(\d{2})/); return m?(m[1]+'년 '+Number(m[2])+'월'):d;};
    noteEl.textContent=ym(rec.periodStart)+'부터 '+ym(rec.periodEnd)+'까지 업종 중앙값과 비교해 채점한 기록이에요. '+
      '적중률 '+rec.hitRate+'%는 동전 던지기(50%)보다 조금 나은 정도이고, 업종을 맞혔는지 잰 성적이지 위 종목 하나하나의 성적은 아니에요.';
  }
  box.hidden=false;
}
window.renderRotationPicks=renderRotationPicks;
/* 종목을 누르면 그 종목 분석으로 보낸다(기존 jumpToStock 재사용). */
document.addEventListener('click',ev=>{
  const b=ev.target.closest&&ev.target.closest('[data-hrp-stock]');
  if(!b) return;
  if(typeof jumpToStock==='function') jumpToStock(b.dataset.hrpStock);
});
(function(){
  const draw=()=>{ try{ renderRotationPicks(); }catch(e){ console.warn('rotation picks render', e); } };
  draw();
  const load=()=>{ if(!window.GaeoFeatures) return;
    GaeoFeatures.load('rotationPicks').then(draw).catch(()=>{}); };
  if('requestIdleCallback' in window) requestIdleCallback(load,{timeout:2500});
  else setTimeout(load,1200);
})();

// ---------- 효과음 (WebAudio 합성 — 파일 불필요) ----------
let AC=null, soundOn=false;
function tone(f0,f1,dur,type,vol,delay=0){
  if(!soundOn) return;
  try{
    if(!AC) AC=new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state==='suspended') AC.resume();
    const t=AC.currentTime+delay, o=AC.createOscillator(), g=AC.createGain();
    o.type=type; o.frequency.setValueAtTime(f0,t);
    o.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+dur);
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+dur+.02);
  }catch(e){}
}
const SFX={
  click:()=>tone(600,950,.09,'square',.035),
  pop:  ()=>tone(320,720,.08,'sine',.05),
  ding: ()=>{tone(1175,1175,.12,'sine',.05); tone(1568,1568,.2,'sine',.04,.1);},
  buy:  ()=>{tone(523,523,.13,'triangle',.06); tone(659,659,.13,'triangle',.06,.13); tone(784,1046,.3,'triangle',.06,.26);},
  sell: ()=>{tone(392,392,.16,'triangle',.06); tone(311,220,.34,'triangle',.06,.16);},
  hold: ()=>{tone(523,523,.15,'triangle',.05); tone(523,523,.15,'triangle',.05,.2);},
  greet:()=>tone(880,1350,.09,'sine',.04),
  act:  ()=>tone(480,660,.1,'sine',.03),
  meow: ()=>{tone(760,980,.13,'sawtooth',.02); tone(980,540,.24,'sawtooth',.02,.13);},
  toggle:()=>tone(300,820,.28,'sine',.04),
};

// ---------- 애널리스트 (개오 팀 — 개성 액세서리 포함) ----------
// acc: 스프라이트 위에 덧그리는 픽셀 [col,row,color]
const AGENTS = [
  { id:'taro',  name:'TARO',  role:'기술적 분석가', room:'거실',
    hair:'#1f2a3d', shirt:'#22d3ee', pants:'#33415e', long:false, color:'#22d3ee',
    acc:[[2,3,'#0e1418'],[2,4,'#0b2830'],[2,5,'#22d3ee'],[9,3,'#0e1418'],[9,4,'#0b2830'],[9,5,'#22d3ee'],[3,1,'#0e1418'],[8,1,'#0e1418']], // 헤드셋
    bubbles:['차트 불러오는 중...','이동평균선 계산 중...','RSI 확인 중...','MACD 교차 분석 중...'] },
  { id:'nova',  name:'QUANT', role:'확률·통계 분석가', room:'부엌',
    // 내부 id는 'nova' 유지 — history.js 기록·리더보드 채점과의 호환성 때문(2026-07-21 QUANT로 역할 교체).
    hair:'#151515', shirt:'#fb923c', pants:'#4a3220', long:false, color:'#fb923c',
    acc:[[10,2,'#151515'],[10,3,'#151515'],[10,4,'#151515'],[10,5,'#151515'],[11,3,'#151515'],[11,4,'#151515']], // 포니테일
    bubbles:['과거 패턴 검색 중...','승률 계산 중...','표본 세는 중...','확률 검증 중...'] },
  { id:'diana', name:'DIANA', role:'재무·기본적 분석가', room:'서재',
    hair:'#7c4a21', shirt:'#a78bfa', pants:'#40305e', long:true, color:'#a78bfa', glasses:true,
    acc:[[3,4,'#241a38'],[4,4,'#241a38'],[5,4,'#241a38'],[6,4,'#241a38'],[7,4,'#241a38'],[8,4,'#241a38']], // 안경
    bubbles:['재무제표 뒤지는 중...','밸류에이션 계산 중...','부채비율 확인 중...','현금흐름 분석 중...'] },
  { id:'flow',  name:'FLOW',  role:'수급 분석가', room:'거실',
    hair:'#065f46', shirt:'#34d399', pants:'#1f3d34', long:false, color:'#34d399',
    acc:[[3,0,'#0b3d2e'],[4,0,'#0b3d2e'],[5,0,'#0b3d2e'],[6,0,'#0b3d2e'],[7,0,'#0b3d2e'],[8,0,'#0b3d2e'],
         [2,1,'#0b3d2e'],[3,1,'#0b3d2e'],[4,1,'#0b3d2e'],[5,1,'#0b3d2e'],[6,1,'#0b3d2e'],[7,1,'#0b3d2e'],[8,1,'#0b3d2e'],[9,1,'#0b3d2e'],
         [10,1,'#164e3a'],[10,2,'#164e3a']], // 야구모자
    bubbles:['수급 데이터 수집...','외국인 순매수 확인...','기관 매매 추적...','프로그램매매 분석...'] },
  { id:'chief', name:'CHIEF', role:'총괄 PM · 의사결정', room:'침실',
    hair:'#9ca3af', shirt:'#fbbf24', pants:'#3d4351', long:false, color:'#fbbf24',
    acc:[[3,5,'#c3c9d1'],[8,5,'#c3c9d1'],[3,6,'#c3c9d1'],[4,6,'#c3c9d1'],[7,6,'#c3c9d1'],[8,6,'#c3c9d1'], // 수염
         [5,7,'#7c2d12'],[6,7,'#7c2d12'],[5,8,'#7c2d12'],[6,8,'#7c2d12'],[5,9,'#7c2d12'],[6,9,'#7c2d12']], // 넥타이
    bubbles:['팀 의견 취합 중...','리스크 검토 중...','최종 판단 내리는 중...'] },
];

/* ============================================================
   분석 엔진
   - analysis.js(LIVE_ANALYSIS)에 해당 종목이 있으면 → 실제 AI 분석 사용
   - 없으면 → mock (시세·지표 수치는 실제 데이터 삽입)
   ============================================================ */
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let x=seed||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return((x>>>0)/4294967296);};}
function runAnalysis(stock){
  const L=analysisEntry(stock.code);
  if(L && L.taro && L.chief){
    return {taro:L.taro, diana:L.diana, nova:L.nova, flow:L.flow, chief:L.chief, _live:true,
      _tier:analysisTier(stock.code),
      _raw:{tech:L.taro.score, fund:L.diana.score, news:L.nova.score}};
  }
  const r=rng(hash(stock.code));
  const tech=Math.round(35+r()*60), fund=Math.round(30+r()*62), news=Math.round(30+r()*65);
  const stance=v=> v>=62?'bull': v<=45?'bear':'neu';
  const pct=(a,b)=>(a+r()*b).toFixed(1);
  const d=stock.price?stock:null;
  return {
    taro:{score:tech,stance:stance(tech),findings: d?[
      `현재가 ${won(d.price)} · 전일 대비 ${d.rate>0?'+':''}${d.rate}% (${SNAP_DATE})`,
      `RSI ${Math.round(30+r()*45)} · ${tech>60?'상승 모멘텀':'과매도 구간'} (mock)`,
      `MACD ${tech>55?'골든크로스 임박':'데드크로스 발생'} (mock)`]:[
      `20일선 대비 ${tech>55?'상단 돌파':'하단 이탈'} (${pct(1,4)}%) (mock)`,
      `RSI ${Math.round(30+r()*45)} (mock)`,`MACD ${tech>55?'골든크로스':'데드크로스'} (mock)`]},
    diana:{score:fund,stance:stance(fund),findings: d?[
      `PER ${d.per}배 · PBR ${d.pbr}배 (${SNAP_DATE})`,
      `ROE ${d.roe||'—'}% · EPS ${d.eps?won(d.eps):'—'}`,
      `시가총액 ${d.cap} · 배당수익률 ${d.div?d.div+'%':'—'}`]:[
      `PER ${pct(8,25)}배 · ${fund>55?'저평가':'고평가'} (mock)`,
      `영업이익률 ${pct(5,20)}% (mock)`,`매출 ${fund>50?'성장':'둔화'} 추세 (mock)`]},
    nova:{score:news,stance:stance(news),findings:[
      `비슷한 상태의 과거 승률 ${Math.round(30+r()*40)}% (mock)`,
      `표본 ${Math.round(50+r()*400)}건 · 평균 ${news>55?'+':'-'}${pct(0.5,3)}% (mock)`,
      `과거 통계 ${news>55?'우호적':'경계'} 구간 (mock)`]},
    flow:(function(){const fl=Math.round(30+r()*60);return {score:fl,stance:stance(fl),findings:[
      `외국인 최근 10일 ${fl>55?'순매수':'순매도'} 우위 (mock)`,
      `기관 수급 ${fl>50?'매수':'매도'} 우세 (mock)`,
      `개인 vs 외국인·기관 ${fl>55?'동반 매수':'엇갈림'} (mock)`]};})(),
    _raw:{tech,fund,news}
  };
}
function macroAdjustConf(conf){
  if(!MACRO_REGIME.ready || MACRO_REGIME.damp>=1 || typeof conf!=='number') return {conf, damped:false};
  const adj=Math.max(20, Math.round(conf*MACRO_REGIME.damp));
  if(adj>=conf) return {conf, damped:false};
  return {conf:adj, raw:conf, damped:true,
    note:`<b>시장국면 「${MACRO_REGIME.label}」</b> — 최근 ${MACRO_REGIME.n}거래일 코스피 등락률의 흔들림(표준편차 ${MACRO_REGIME.vol}%p)이 커서, 원래 확신도 ${conf}%를 <b>${adj}%</b>로 낮춰 표시했어요. `+
      `BUY/HOLD/SELL 판단 자체는 그대로예요 — 다만 요즘같이 시장 전체가 출렁이는 장에서는 확신도를 에누리해서 보는 게 안전해요.`};
}
function riskDecisionOverlay(code){
  const r=(liveInd(code)||{}).risk;
  if(!r) return {score:null,grade:'unknown',penalty:0,confPenalty:0};
  const score=Math.round(Math.max(5,Math.min(95,100-r.vol20*10-Math.max(0,-r.mdd3m)*0.6)));
  const grade=['low','mid','high'].includes(r.grade)?r.grade:(score<35?'high':score<55?'mid':'low');
  const penalty=grade==='high'?Math.max(1,Math.min(7,Math.round(Math.max(0,45-score)*0.15)+1)):0;
  return {score,grade,penalty,confPenalty:grade==='high'?10:(grade==='mid'?3:0)};
}
function callFromTotal(total){ return total>=63?'BUY':(total>=47?'HOLD':'SELL'); }
function decide(a,code){
  if(a._live && a.chief){
    const c=a.chief;
    const ro=c.riskApplied
      ? {score:c.riskScore,grade:c.riskGrade,penalty:c.riskPenalty||0,confPenalty:0}
      : riskDecisionOverlay(code);
    const rawTotal=c.riskApplied?(c.rawTotal??c.total):c.total;
    const total=c.riskApplied?c.total:Math.max(0,Math.round(c.total-ro.penalty));
    const call=c.riskApplied?c.call:callFromTotal(total);
    const baseConf=c.riskApplied?c.confidence:Math.max(30,c.confidence-ro.confPenalty);
    const adj=macroAdjustConf(baseConf);
    const riskText=c.riskApplied?'':(ro.score==null?'':` RISK 안정도 ${ro.score}점으로 원점수 ${rawTotal}점에서 ${ro.penalty}점을 감점했습니다.`);
    return {call,total,rawTotal,riskPenalty:ro.penalty,riskScore:ro.score,riskGrade:ro.grade,
      conf:adj.conf,macroNote:adj.note,live:true,tier:a._tier||'deep',
      color:call==='BUY'?'#2F8B73':call==='SELL'?'#D5535D':'#B97A2F',
      text:(c.reason||'')+riskText,target:c.target||'',report:c.report||''};
  }
  const {tech,fund,news}=a._raw;
  const total=Math.round(tech*0.30+fund*0.38+news*0.22+Math.round((tech+fund+news)/3)*0.10);
  let call,color;
  if(total>=63){call='BUY';color='#2F8B73';}
  else if(total>=47){call='HOLD';color='#B97A2F';}
  else{call='SELL';color='#D5535D';}
  const spread=Math.max(tech,fund,news)-Math.min(tech,fund,news);
  const conf=Math.max(45,Math.round(92-spread));
  const lead=tech>=fund&&tech>=news?'기술적 지표':fund>=news?'재무 펀더멘털':'뉴스·심리';
  const ro=riskDecisionOverlay(code), finalTotal=Math.max(0,total-ro.penalty), finalCall=callFromTotal(finalTotal);
  color=finalCall==='BUY'?'#2F8B73':finalCall==='SELL'?'#D5535D':'#B97A2F';
  return{call:finalCall,color,total:finalTotal,rawTotal:total,riskPenalty:ro.penalty,riskScore:ro.score,riskGrade:ro.grade,
    conf:Math.max(30,conf-ro.confPenalty),live:false,target:'',report:'',
    text:`Gaeo 팀 4인의 의견을 종합했습니다. ${lead}가 판단을 주도했으며 팀 간 편차는 ${spread}점입니다. `+
      (spread>35?'시각차가 커 신중한 접근을 권합니다.':'팀의 시각이 대체로 일치합니다.')+' (mock 분석 · 투자 권유가 아닙니다.)'};
}

/* ============================================================
   워크플로
   ============================================================ */
const cardsEl=document.getElementById('cards'), vEl=document.getElementById('verdict');
let running=false;
window.GaeoAnalysisReady=false;
function setAnalysisTab(tab,options){
  const tabs=[...document.querySelectorAll('[data-analysis-tab]')];
  const panels=[...document.querySelectorAll('[data-analysis-panel]')];
  if(!tabs.some(button=>button.dataset.analysisTab===tab)) tab='overview';
  tabs.forEach(button=>{
    const active=button.dataset.analysisTab===tab;
    button.classList.toggle('on',active);
    button.setAttribute('aria-selected',active?'true':'false');
    button.tabIndex=active?0:-1;
  });
  panels.forEach(panel=>{
    const active=panel.dataset.analysisPanel===tab;
    panel.hidden=!active;
    panel.classList.toggle('on',active);
  });
  window.GaeoAnalysisTab=tab;
  const activePanel=document.querySelector(`[data-analysis-panel="${tab}"]`);
  if(options&&options.scroll&&activePanel){
    activePanel.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
  }
}
(function wireAnalysisTabs(){
  const tablist=document.getElementById('analysisTabs'); if(!tablist) return;
  tablist.addEventListener('click',event=>{
    const button=event.target.closest('[data-analysis-tab]'); if(!button) return;
    setAnalysisTab(button.dataset.analysisTab,{scroll:false});
    if(button.dataset.analysisTab==='archive'&&window.GaeoCurrentCode){
      const code=window.GaeoCurrentCode;
      GaeoFeatures.load('archive').then(()=>renderArchivePanel(code));
    }
    SFX.click();
  });
  tablist.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    const tabs=[...tablist.querySelectorAll('[data-analysis-tab]')];
    const current=Math.max(0,tabs.indexOf(document.activeElement));
    let next=event.key==='Home'?0:event.key==='End'?tabs.length-1:
      (current+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    event.preventDefault();
    tabs[next].focus();
    setAnalysisTab(tabs[next].dataset.analysisTab,{scroll:false});
  });
  setAnalysisTab('overview');
})();
function setAnalystTab(key){
  const allowed=['team','taro','diana','nova','flow','risk'];
  if(!allowed.includes(key)) key='taro';
  document.querySelectorAll('[data-analyst-tab]').forEach(button=>{
    const active=button.dataset.analystTab===key;
    button.classList.toggle('on',active);
    button.setAttribute('aria-selected',active?'true':'false');
    button.tabIndex=active?0:-1;
  });
  cardsEl.classList.add('analyst-filtered');
  cardsEl.hidden=key==='team';
  cardsEl.querySelectorAll('.card').forEach(card=>{
    card.classList.toggle('analyst-selected',card.id===`card-${key}`);
  });
  const viz=document.getElementById('viz');
  if(viz) viz.hidden=key!=='team';
  window.GaeoAnalystTab=key;
}
(function wireAnalystTabs(){
  const tablist=document.getElementById('analystTabs'); if(!tablist) return;
  tablist.addEventListener('click',event=>{
    const button=event.target.closest('[data-analyst-tab]'); if(!button) return;
    setAnalystTab(button.dataset.analystTab);
    SFX.click();
  });
  tablist.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    const tabs=[...tablist.querySelectorAll('[data-analyst-tab]')];
    const current=Math.max(0,tabs.indexOf(document.activeElement));
    const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:
      (current+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    event.preventDefault();
    tabs[next].focus();
    setAnalystTab(tabs[next].dataset.analystTab);
  });
  setAnalystTab('taro');
})();
const EVAL_RULE_DETAILS=Object.freeze({
  taro:{
    title:'TARO 평가 기준',
    body:'<p><b>5거래일</b>: 판단한 날의 다음 거래일부터 세어 약 일주일 뒤 종가로 결과를 확인합니다.</p><p><b>±1% 초과 채점</b>: 강세 의견 뒤 +1%를 넘게 오르면 적중, -1%보다 더 내리면 오답입니다. 약세 의견은 반대로 채점합니다. -1% 이상 +1% 이하는 애매한 움직임이라 평가에서 제외하며 오답으로 세지 않습니다.</p><p><b>기본 30%</b>: CHIEF가 네 분석가 의견을 합칠 때 TARO에 먼저 배정하는 시작 비중입니다. 상승확률이나 확신도 30%라는 뜻은 아닙니다.</p><p><b>실제 발언권은 변동</b>: 기본값은 30%지만 실제 합산 비중은 적중률, 표본 수, 업종별 성적과 다른 분석가와의 오답 중복을 반영해 성적 재계산 때마다 높아지거나 낮아질 수 있습니다.</p>',
  },
  diana:{
    title:'DIANA 평가 기준',
    body:'<p><b>20거래일</b>: 판단한 날의 다음 거래일부터 세어 약 한 달 뒤 종가로 결과를 확인합니다. 재무와 기업가치는 단기 차트보다 가격에 반영되는 시간이 길어서 별도 기간을 씁니다.</p><p><b>±3% 초과 채점</b>: 강세 의견 뒤 +3%를 넘게 오르면 적중, -3%보다 더 내리면 오답입니다. 약세 의견은 반대로 채점합니다. -3% 이상 +3% 이하는 방향이 분명하지 않은 구간이라 평가에서 제외하며 오답으로 세지 않습니다.</p><p><b>기본 12%</b>: CHIEF가 네 분석가 의견을 합칠 때 DIANA에 먼저 배정하는 시작 비중입니다. DIANA가 맞을 확률이나 확신도가 12%라는 뜻은 아닙니다.</p><p><b>실제 발언권은 계속 변동</b>: 설계상 출발점인 12% 자체는 정책을 바꿀 때만 달라지지만, 화면의 실제 합산 비중은 20거래일 장기 적중률, 표본 수 보정, 업종별 성적과 오답 중복을 반영해 성적 재계산 때마다 12%보다 높아지거나 낮아질 수 있습니다.</p>',
  },
  nova:{
    title:'QUANT 평가 기준',
    body:'<p><b>5거래일</b>: 현재와 비슷했던 과거 사례가 약 일주일 뒤 어떻게 움직였는지 확인해 평가합니다.</p><p><b>±1% 초과 채점</b>: 의견 방향으로 1%를 넘게 움직이면 적중, 반대로 1%를 넘게 움직이면 오답입니다. -1% 이상 +1% 이하는 평가에서 제외합니다.</p><p><b>기본 28%</b>: CHIEF 합산의 시작 비중이며 확률 28%라는 뜻은 아닙니다. 실제 발언권은 적중률, 표본 수, 업종별 성적과 오답 중복에 따라 성적 재계산 때마다 달라질 수 있습니다.</p>',
  },
  flow:{
    title:'FLOW 평가 기준',
    body:'<p><b>5거래일</b>: 외국인과 기관 수급이 단기에 이어졌는지 약 일주일 뒤 종가로 확인합니다.</p><p><b>±1% 초과 채점</b>: 의견 방향으로 1%를 넘게 움직이면 적중, 반대로 1%를 넘게 움직이면 오답입니다. -1% 이상 +1% 이하는 평가에서 제외합니다.</p><p><b>기본 30%</b>: CHIEF 합산의 시작 비중이며 확률 30%라는 뜻은 아닙니다. 실제 발언권은 적중률, 표본 수, 업종별 성적과 오답 중복에 따라 성적 재계산 때마다 달라질 수 있습니다.</p>',
  },
  risk:{
    title:'RISK 적용 기준',
    body:'<p><b>가점 없음</b>: 저위험 종목이라고 종합점수를 올리지는 않습니다.</p><p><b>중위험</b>: 방향 점수는 유지하고 확신도만 낮춥니다.</p><p><b>고위험 최대 -7점</b>: 변동성과 최대 낙폭이 큰 종목은 종합점수를 최대 7점, 확신도를 10%p 낮춥니다. RISK는 매수나 매도 의견을 내는 분석가가 아니라 과한 확신을 막는 안전장치입니다.</p>',
  },
  chief:{
    title:'CHIEF 최종 합산 기준',
    body:'<p><b>4인 보정 가중합</b>: TARO, DIANA, QUANT, FLOW의 점수를 단순 평균하지 않고 역할별 기본비중에서 시작해 실제 적중률, 표본 수, 업종별 성적과 오답 중복을 반영한 현재 발언권으로 합칩니다.</p><p><b>RISK 감점 후 최종</b>: 합산한 방향 원점수에 RISK의 단방향 감점과 확신도 조정을 적용해 최종 BUY, HOLD, SELL을 결정합니다.</p>',
  },
});
function evalRuleBadge(key,text){
  return `<button type="button" class="eval-rule" data-eval-rule="${key}" aria-haspopup="dialog" aria-expanded="false">${text}</button>`;
}
(function wireEvalRuleHelp(){
  let pop=null,openFor=null,pinned=false,closeTimer=0;
  function ensurePop(){
    if(pop) return pop;
    pop=document.createElement('div');
    pop.className='eval-pop';
    pop.setAttribute('role','dialog');
    pop.setAttribute('aria-modal','false');
    pop.setAttribute('aria-label','채점 기준 상세 설명');
    pop.innerHTML='<button type="button" class="eval-pop-close" aria-label="설명 닫기">✕</button><div class="eval-pop-title"></div><div class="eval-pop-body"></div>';
    document.body.appendChild(pop);
    pop.querySelector('.eval-pop-close').addEventListener('click',close);
    pop.addEventListener('mouseenter',()=>clearTimeout(closeTimer));
    pop.addEventListener('mouseleave',()=>{ if(!pinned) scheduleClose(); });
    return pop;
  }
  function position(el){
    const p=ensurePop(),r=el.getBoundingClientRect(),box=p.getBoundingClientRect(),margin=10;
    const left=Math.min(Math.max(margin,r.left),Math.max(margin,window.innerWidth-box.width-margin));
    let top=r.bottom+8;
    if(top+box.height>window.innerHeight-margin) top=Math.max(margin,r.top-box.height-8);
    p.style.left=left+'px';
    p.style.top=top+'px';
  }
  function close(){
    clearTimeout(closeTimer);
    if(openFor) openFor.setAttribute('aria-expanded','false');
    if(pop) pop.classList.remove('on');
    openFor=null;
    pinned=false;
  }
  function scheduleClose(){
    clearTimeout(closeTimer);
    closeTimer=setTimeout(()=>{ if(!pinned) close(); },100);
  }
  function open(el,pin){
    const detail=EVAL_RULE_DETAILS[el.dataset.evalRule];
    if(!detail) return;
    clearTimeout(closeTimer);
    if(openFor&&openFor!==el) openFor.setAttribute('aria-expanded','false');
    openFor=el;
    pinned=Boolean(pin);
    const p=ensurePop();
    p.querySelector('.eval-pop-title').textContent=detail.title;
    p.querySelector('.eval-pop-body').innerHTML=detail.body;
    el.setAttribute('aria-expanded','true');
    p.classList.add('on');
    position(el);
  }
  document.addEventListener('mouseover',event=>{
    const el=event.target.closest&&event.target.closest('.eval-rule');
    if(el&&!pinned) open(el,false);
  });
  document.addEventListener('mouseout',event=>{
    const el=event.target.closest&&event.target.closest('.eval-rule');
    if(el&&!pinned){
      const next=event.relatedTarget;
      if(!(next&&next.closest&&next.closest('.eval-pop'))) scheduleClose();
    }
  });
  document.addEventListener('focusin',event=>{
    const el=event.target.closest&&event.target.closest('.eval-rule');
    if(el&&!pinned) open(el,false);
  });
  document.addEventListener('focusout',event=>{
    if(event.target.closest&&event.target.closest('.eval-rule')&&!pinned){
      const next=event.relatedTarget;
      if(!(next&&next.closest&&next.closest('.eval-pop'))) scheduleClose();
    }
  });
  document.addEventListener('click',event=>{
    const el=event.target.closest&&event.target.closest('.eval-rule');
    if(el){
      event.preventDefault();
      if(openFor===el&&pop&&pop.classList.contains('on')&&pinned) close();
      else open(el,true);
      return;
    }
    if(!(event.target.closest&&event.target.closest('.eval-pop'))) close();
  });
  document.addEventListener('keydown',event=>{ if(event.key==='Escape') close(); });
  window.addEventListener('scroll',close,true);
  window.addEventListener('resize',close);
})();
/* ═══════════════════════════════════════════════════════════════════
   🎓 분석가 카드 해석 계층 (DIANA·QUANT·FLOW·RISK) — 2026-08-08
   목표: "숫자 나열"이 아니라 "결론 먼저 → 핵심 숫자 → 쉬운 해석 → 주의점"
   구조로 초보자도 5~10초 안에 이해하게 만든다. 점수·분석 로직
   (analyze_auto.py·compute_indicators.py)은 전혀 건드리지 않고, 이미
   계산된 값(INDICATORS.stocks[code]의 per/pbr/roe/eps/flow/risk 등,
   analysis 엔진의 nova.sampleN 등)을 화면에 "번역"하는 표현 계층만 담당한다.
   원칙: 숫자 → 의미 → 주의점 순서, "무조건/확실히/반드시" 단정 표현과
   매수·매도 지시 금지. 각 getXInterpretation()은 필요한 데이터가 없으면
   null을 돌려주고, 그러면 렌더러가 예전 방식(findings 목록)으로 안전하게
   돌아간다(오래된 정밀분석처럼 새 스키마가 없는 데이터도 안 깨지게).
   ═══════════════════════════════════════════════════════════════════ */
const SCORE_MEANING_NOTE='0~100 상태 점수 · 주가 상승 확률이 아니에요';
function fmtPct(v,nd){ return (typeof v!=='number'||!isFinite(v))?'—':(v>0?'+':'')+v.toFixed(nd==null?1:nd)+'%'; }
function fmtPp(v){ return (typeof v!=='number'||!isFinite(v))?'—':(v>0?'+':'')+v.toFixed(1)+'%p'; }

// ① DIANA — 재무·가치: "이 회사가 지금 비싼가, 싼가?"
function dianaStateLabel(score){
  if(score>=75) return '밸류 매력 높음';
  if(score>=60) return '밸류 매력 양호';
  if(score>=40) return '밸류 보통';
  if(score>=25) return '밸류 매력 낮음';
  return '밸류 부담';
}
// 업종 내 PER·PBR 순위 — sectorCompHTML과 같은 계산(낮을수록 저렴)을 구조화된 값으로 재사용
function sectorRankInfo(code,key){
  const me=STOCKS[code]; if(!me||typeof me[key]!=='number') return null;
  let peers=Object.entries(STOCKS).filter(([c,s])=>s.sector===me.sector&&typeof s[key]==='number');
  let scope=`${me.sector} ${peers.length}종목`;
  if(peers.length<3){ peers=Object.entries(STOCKS).filter(([c,s])=>typeof s[key]==='number'); scope=`전체 ${peers.length}종목`; }
  if(peers.length<2||!peers.some(([c])=>c===code)) return null;
  const sorted=peers.slice().sort((a,b)=>a[1][key]-b[1][key]);
  const rank=sorted.findIndex(([c])=>c===code)+1;
  return {rank, total:sorted.length, scope,
    text: rank===1?'가장 낮음(제일 저렴한 편)':rank===sorted.length?`${rank}번째(가장 비싼 편)`:`${rank}번째로 낮음`};
}
function getDianaInterpretation(code,res){
  // PER·PBR·ROE·EPS는 STOCKS(data.js, 시세 갱신마다 항상 최신)를 1차 소스로 쓴다.
  // INDICATORS(indicators.js)는 목표주가·선행PER처럼 STOCKS에 없는 보너스 필드만 있으면 얹는다
  // (⭐ 2026-08-08 파이프라인 갱신 전에는 그 필드들이 아직 없을 수 있어 없으면 조용히 건너뛴다).
  const S=STOCKS[code];
  if(!S||typeof S.per!=='number') return null;
  const I=liveInd(code);
  const state=dianaStateLabel(res.score);
  const metrics=[];
  const perR=sectorRankInfo(code,'per'), pbrR=sectorRankInfo(code,'pbr');
  metrics.push({label:'PER', value:S.per+'배', sub:perR?`${perR.scope} 중 ${perR.text}`:'이익 대비 가격'});
  if(typeof S.pbr==='number') metrics.push({label:'PBR', value:S.pbr+'배', sub:pbrR?`${pbrR.scope} 중 ${pbrR.text}`:'자산 대비 가격'});
  if(typeof S.roe==='number'||typeof S.eps==='number'){
    metrics.push({label:'수익성', value:typeof S.roe==='number'?S.roe+'%':'—',
      sub:'ROE · EPS '+(typeof S.eps==='number'?won(S.eps):'—')});
  }
  // 목표주가: indicators.js에 targetGap이 있으면 그걸 쓰고, 없으면 CHIEF의 목표가 문장에서
  // 같은 컨센서스 숫자를 뽑아 쓴다(levelsHTML의 parseTargetInfo와 동일 계산).
  let targetGap=I&&typeof I.targetGap==='number'?I.targetGap:null;
  let targetMean=I&&typeof I.targetMean==='number'?I.targetMean:null;
  if(targetGap==null){
    const L=analysisEntry(code), tgt=(L&&L.chief)?parseTargetInfo(L.chief.target):null;
    if(tgt&&tgt.price&&S.price){ targetMean=tgt.price; targetGap=Math.round((tgt.price/S.price-1)*1000)/10; }
  }
  if(targetGap!=null) metrics.push({label:'목표주가', value:fmtPct(targetGap), sub:'컨센서스 '+(targetMean!=null?won(Math.round(targetMean)):'—')});
  if(I&&typeof I.fwdPer==='number'){
    metrics.push({label:'선행 PER', value:I.fwdPer+'배',
      sub:'컨센서스 EPS'+(typeof I.cnsEps==='number'?' '+won(I.cnsEps)+' 기준':' 기준')});
  }
  let lead,explain,check;
  if(res.score>=60){
    lead='업종 대비 자산가치 기준으로 저평가 매력이 있는 편이에요. 다만 수익성 개선 여부가 함께 확인돼야 해요.';
    explain='쉽게 말하면 회사가 벌어들이는 이익과 보유 자산에 비해 주가가 비교적 낮게 평가받고 있는 편이에요. PER·PBR이 낮은 이유가 실적 부진이나 성장성 부족 때문일 수도 있으니, 수익성과 성장 흐름을 함께 확인하는 게 중요해요.';
    check='낮은 PER·PBR만으로 저평가가 해소되는 것은 아니에요. 향후 이익과 ROE가 함께 좋아지는지 확인하세요.';
  }else if(res.score>=40){
    lead='밸류에이션은 업종 평균과 비슷한 수준이에요. 뚜렷한 저평가·고평가 신호는 아직 확인되지 않았어요.';
    explain='가격이 특별히 싸거나 비싸다고 말하기엔 애매한 위치예요. 이익·자산 규모에 비해 무난한 가격대로 볼 수 있어요.';
    check='업종 평균과 비교하며 실적 발표나 목표주가 변화가 있는지 주기적으로 확인해보세요.';
  }else{
    lead='업종 대비 가격 부담이 있는 편이에요. 그 부담을 설명해줄 성장성·수익성이 있는지 확인이 필요해요.';
    explain='이익·자산에 비해 주가가 높게 평가된 편이에요. 시장이 미래 성장에 대한 기대를 가격에 미리 반영했을 가능성이 있으니, 그 기대가 실제로 실현되는지 지켜볼 필요가 있어요.';
    check='PER·PBR이 높다고 무조건 고평가는 아니에요. 성장성·수익성이 그만큼 뒷받침되는지 함께 확인하세요.';
  }
  return {state,lead,metrics,explain,check};
}

// ② QUANT(내부 id 'nova') — 확률·통계: "과거 비슷한 상황에서 이후 주가가 어떻게 움직였나?"
function quantStateLabel(score){
  if(score>=65) return '통계상 우위';
  if(score>=55) return '통계상 약우위';
  if(score>=45) return '통계상 중립';
  if(score>=35) return '통계상 약열위';
  return '통계상 열위';
}
function quantSampleQuality(n){
  if(typeof n!=='number') return null;
  if(n>=1000) return {label:'표본 충분', note:null};
  if(n>=200) return {label:'표본 보통', note:'분석 기간이 짧아 다양한 시장 환경이 충분히 포함되지 않았을 수 있어요.'};
  return {label:'표본 부족', note:'유사 사례가 적어 통계 해석에 주의가 필요해요.'};
}
// 실제 학습 데이터의 최초·마지막 날짜(analyze_auto.py가 매 실행마다 다시 계산)를 그대로 표시한다 —
// "최근 N년"을 하드코딩하지 않고 실제 기간과 항상 일치하게 한다.
function quantPeriodLabel(start,end){
  if(!start||!end) return null;
  const fmt=s=>{ const m=String(s).match(/^(\d{4})-(\d{2})/); return m?`${m[1]}.${m[2]}`:s; };
  return `${fmt(start)} ~ ${fmt(end)}`;
}
// indicators.js와 마찬가지로, analyze_auto.py가 아직 구조화된 필드(sampleN 등)를 안 내려주는
// 옛 데이터를 위한 안전망 — QUANT findings 문장(고정 템플릿)에서 같은 숫자를 다시 뽑아 쓴다.
// 표본 기간(periodStart/End)·업종 블렌드 비중만은 문장에서 정확히 못 뽑아서(괄호 안 서술이
// "시장 평균"과 "OOO 업종을 NN% 반영한 기저 승률" 두 가지 형태로 나올 수 있음), 그 앞쪽
// 설명 문구를 그대로 baseLabel로만 살려 쓴다(2026-08-14 업종 기저율 반영 이후).
function parseQuantFromFindings(findings){
  if(!Array.isArray(findings)||!findings.length) return null;
  const joined=findings.join(' ');
  const m1=joined.match(/이런\s*상태\(([^)]+)\)였던\s*적이\s*([\d,]+)건\s*있었는데,\s*그중\s*([\d,]+)건이\s*5거래일\s*뒤\s*올랐어요\s*→\s*경험적\s*승률\s*(\d+)%\s*\(([^)]*?)(\d+)%보다\s*([+\-]?\d+)%p/);
  if(!m1) return null;
  const m2=joined.match(/등락률\s*평균은\s*([+\-]?[\d.]+)%예요/);
  return {scopeUsed:m1[1], sampleN:parseInt(m1[2].replace(/,/g,''),10), sampleWin:parseInt(m1[3].replace(/,/g,''),10),
    winRate:parseFloat(m1[4]), baseLabel:m1[5].trim()||'시장 평균', marketAvgWinRate:parseFloat(m1[6]), relPp:parseFloat(m1[7]),
    avgReturn:m2?parseFloat(m2[1]):null, periodStart:null, periodEnd:null};
}
function getQuantInterpretation(code,res){
  const q=(typeof res.sampleN==='number')?res:parseQuantFromFindings(res.findings);
  if(!q||typeof q.sampleN!=='number') return null;
  const n=q.sampleN, wr=q.winRate, rel=q.relPp, avg=q.avgReturn;
  // ⭐ 2026-08-14: 비교 기준선(기저 승률)이 "시장 전체 평균" 하나였다가, 업종 표본이
  // 충분하면(200건↑) 그 종목이 속한 업종 평균 승률을 함께 섞어 쓰도록 바뀌었다(업종
  // 표본이 많을수록 업종 비중을 최대 75%까지 높임 — 아래 methodNote에서 자세히 설명).
  // base = 실제로 rel(= wr - base) 계산에 쓰인 기저 승률, blendPct = 그중 업종이 차지한 비중.
  const base=(typeof res.baseWinRate==='number')?res.baseWinRate:q.marketAvgWinRate;
  const blendPct=typeof res.sectorBlendPct==='number'?res.sectorBlendPct:0;
  const sectorName=res.sector||'';
  const baseLabel=q.baseLabel||(blendPct>0?`${sectorName} 업종 ${blendPct}% 반영 기저 승률`:'시장 평균');
  const state=quantStateLabel(res.score);
  const period=quantPeriodLabel(q.periodStart,q.periodEnd);
  const quality=quantSampleQuality(n);
  const metrics=[
    {label:'과거 상승 확률', value:wr+'%', sub:`유사 사례 100번 중 약 ${Math.round(wr)}번 상승`},
    {label:'기저 대비', value:fmtPp(rel), sub:`${baseLabel} ${base}%보다 ${rel>=0?'높은':'낮은'} 수준`},
    {label:'평균 5일 수익률', value:fmtPct(avg), sub:'상승·하락 사례를 모두 포함한 평균'},
    {label:'유사 사례', value:n.toLocaleString('ko-KR')+'건', sub:period?`표본 기간 ${period}`:`전체 ${COVERAGE_TXT} 누적 일봉 기준`},
  ];
  let lead;
  if(Math.abs(rel)<2) lead='과거 비슷한 상황에서는 5거래일 뒤 상승과 하락이 거의 반반이었어요. 현재 통계만으로는 뚜렷한 방향성이 확인되지 않아요.';
  else if(rel>=2) lead='과거 비슷한 상황에서는 기저 승률보다 조금 더 자주 올랐어요. 다만 강한 우위라고 보기엔 부족한 수준이에요.';
  else lead='과거 비슷한 상황에서는 기저 승률보다 오히려 덜 오르는 경향이 있었어요. 통계상 우위가 있다고 보기는 어려워요.';
  const explain='상승 확률과 평균 수익률은 다른 지표예요. 상승한 경우의 상승폭이 하락한 경우의 하락폭보다 컸다면, 승률이 50% 근처여도 평균 수익률은 플러스가 될 수 있어요.';
  let check='과거 통계는 참고 자료이며 같은 상황이 반복된다는 보장은 없어요. 표본 수와 분석 기간을 함께 확인하세요.';
  if(quality&&quality.note) check=quality.note+' '+check;
  // 🔎 카드 맨 아래 "이 계산은 어떻게 나온 건가요?" 접이식 각주(2026-08-14, 아주 작은 글씨).
  const methodNote='RSI 구간·20일선 위/아래·최근 5일 추세, 이 3가지로 "지금 상태"를 정하고, '+COVERAGE_TXT+' '
    +'전체 일별 기록에서 이 상태와 똑같았던 과거 사례를 찾아요. 표본이 30건 넘는 가장 좁은 조건을 '
    +'쓰고, 모자라면 조건을 하나씩 느슨하게 풀어요(동일 상태 → RSI·이평 동일 → RSI 구간 동일 → 시장 '
    +'전체). 이 승률과 비교하는 기준선(기저 승률)은 시장 전체 평균과 이 종목이 속한 업종의 평균 승률을 '
    +'섞어서 만들어요. 업종 표본이 200건 미만이면 업종값은 안 쓰고 시장 평균만 쓰고, 업종 표본이 '
    +'많아질수록 업종 비중을 최대 75%까지 높여요. 업종마다 원래 잘 오르내리는 정도가 서로 달라서('
    +'예: 조사 기준 게임·엔터 업종 42.7% vs 건설·건자재 업종 52.7%), 시장 평균 하나로만 비교하면 '
    +'원래 약한 업종 종목은 늘 부진하게, 원래 강한 업종 종목은 늘 양호하게 보이는 착시가 있었어요. '
    +'승률·확률이 아니라 과거 통계를 정리한 상태 점수라는 점은 변하지 않아요.'
    +(blendPct>0?` 이 종목은 지금 ${sectorName} 업종 값을 ${blendPct}% 반영했어요.`:' 이 종목은 업종 표본이 아직 부족해 시장 평균만 반영했어요.');
  return {state,lead,metrics,explain,check,badge:quality?quality.label:null,scope:q.scopeUsed,methodNote};
}

// ③ FLOW — 수급: "지금 외국인·기관 같은 큰 자금이 들어오는가?"
function flowStateLabel(score){
  if(score>=65) return '수급 강세';
  if(score>=55) return '수급 양호';
  if(score>=45) return '수급 중립';
  if(score>=35) return '수급 약세';
  return '수급 부진';
}
const FLOW_DIVERGENCE_TXT={
  accumulation:'가격은 약하지만 큰손 매수는 이어지는 매집 구간일 수 있어요.',
  distribution:'가격은 오르지만 큰손은 팔고 있는 분배 구간일 수 있어요.',
  confirmation_up:'가격 상승과 큰손 매수가 함께 가는 상승 확인 구간이에요.',
  confirmation_down:'가격 하락과 큰손 매도가 함께 가는 하락 확인 구간이에요.',
};
function flowQualityLabel(q){
  if(typeof q!=='number') return null;
  if(q>=25) return '동반매수 강도 높음';
  if(q>=8) return '동반매수 강도 양호';
  if(q>-8) return '동반매수 강도 보통';
  if(q>-25) return '동반매도 강도 약함';
  return '동반매도 강도 높음';
}
// indicators.js에 flow 구조화 필드가 아직 없을 때(파이프라인 갱신 전)를 대비한 안전망 —
// FLOW 자신의 findings 문장(analyze_auto.py의 고정 템플릿)에서 같은 숫자를 다시 뽑아 쓴다.
// 예: "최근 5거래일 외국인 순매수 109,506주 · 기관 순매도 21,380주" 등 4개 고정 문장.
function parseFlowFromFindings(findings){
  if(!Array.isArray(findings)||!findings.length) return null;
  const joined=findings.join(' ');
  const m1=joined.match(/최근\s*(\d+)거래일\s*외국인\s*(순매수|순매도)\s*([\d,]+)주\s*·\s*기관\s*(순매수|순매도)\s*([\d,]+)주(?:\s*·\s*개인\s*(순매수|순매도)\s*([\d,]+)주)?/);
  if(!m1) return null;
  const days=+m1[1];
  const frgnSum=(m1[2]==='순매수'?1:-1)*parseInt(m1[3].replace(/,/g,''),10);
  const orgSum=(m1[4]==='순매수'?1:-1)*parseInt(m1[5].replace(/,/g,''),10);
  const indiSum=m1[6]?(m1[6]==='순매수'?1:-1)*parseInt(m1[7].replace(/,/g,''),10):null;
  const m2=joined.match(/외국인\s*보유율\s*([\d.]+)%\s*→\s*([\d.]+)%/);
  const holdBefore=m2?parseFloat(m2[1]):null, holdNow=m2?parseFloat(m2[2]):null;
  const m3=joined.match(/직전\s*거래일\s*외국인\s*([+\-][\d,]+)주\s*·\s*기관\s*([+\-][\d,]+)주\s*·\s*개인\s*([+\-][\d,]+)주/);
  if(!m3) return null;
  const todayFrgn=parseInt(m3[1].replace(/,/g,''),10), todayOrg=parseInt(m3[2].replace(/,/g,''),10), todayIndi=parseInt(m3[3].replace(/,/g,''),10);
  const m4=joined.match(/수급\s*품질\s*([+\-]?\d+)점/);
  const qualityScore=m4?parseFloat(m4[1]):null;
  let divergence=null;
  if(joined.indexOf('매집형 괴리')>=0) divergence='accumulation';
  else if(joined.indexOf('분배형 괴리')>=0) divergence='distribution';
  else if(joined.indexOf('상승 확인')>=0) divergence='confirmation_up';
  else if(joined.indexOf('하락 확인')>=0) divergence='confirmation_down';
  return {days,frgnSum,orgSum,indiSum,holdBefore,holdNow,todayFrgn,todayOrg,todayIndi,qualityScore,divergence};
}
function getFlowInterpretation(code,res){
  const I=liveInd(code);
  const fl=(I&&I.flow&&typeof I.flow.frgnSum==='number')?I.flow:parseFlowFromFindings(res.findings);
  if(!fl||typeof fl.frgnSum!=='number'||typeof fl.todayIndi!=='number') return null;
  const state=flowStateLabel(res.score);
  // ⭐ 2026-08-10: "최근 5거래일"만 있으면 실시간 화면과 비교할 때 "지금 이 순간" 숫자로
  // 착각하기 쉽다(제주반도체 사례) — 실제 집계 기간(장마감 확정치 기준)을 괄호로 덧붙이고,
  // 별표(*)로 눈에 바로 띄게 한 뒤 아래 각주에서 "당일 수급은 아직 안 잡혀있다"를 못 박는다.
  const periodTxt=(fl.periodStart&&fl.periodEnd)?`최근 ${fl.days||5}거래일(${fl.periodStart}~${fl.periodEnd})*`:`최근 ${fl.days||5}거래일`;
  const rows=[
    {label:'외국인', val:fl.frgnSum, dir:fl.frgnSum>=0?'순매수':'순매도', period:periodTxt},
    {label:'기관', val:fl.orgSum, dir:fl.orgSum>=0?'순매수':'순매도', period:periodTxt},
    {label:'개인', val:typeof fl.indiSum==='number'?fl.indiSum:fl.todayIndi,
      dir:(typeof fl.indiSum==='number'?fl.indiSum:fl.todayIndi)>=0?'순매수':'순매도',
      period:typeof fl.indiSum==='number'?periodTxt:'직전 거래일'},
  ];
  const holdDelta=(typeof fl.holdNow==='number'&&typeof fl.holdBefore==='number')?fl.holdNow-fl.holdBefore:null;
  const both=fl.frgnSum>=0&&fl.orgSum>=0, none=fl.frgnSum<0&&fl.orgSum<0;
  let lead;
  if(both) lead='외국인과 기관이 함께 순매수하고 있어요. 최근 가격 상승에 큰손 매수가 동반되는 흐름이에요.';
  else if(none) lead='외국인과 기관이 함께 순매도하고 있어요. 큰손 자금이 빠져나가는 흐름이 확인돼요.';
  else lead='외국인과 기관의 매매 방향이 엇갈리고 있어요. 아직 뚜렷한 한쪽 방향은 아니에요.';
  const explain=both
    ?'외국인과 기관이 동시에 매수하면 시장 참여자 중 비교적 큰 자금이 같은 방향으로 움직이고 있다는 의미예요. 다만 이 흐름이 계속 이어지는지가 중요해요 — 순매수가 갑자기 약해지거나 매도로 전환되는지도 함께 확인하세요.'
    :'외국인·기관 중 한쪽만 사거나 둘 다 팔고 있다는 건, 아직 큰손 자금의 방향이 확실히 정해지지 않았다는 뜻일 수 있어요.';
  const periodNote=(fl.periodStart&&fl.periodEnd)
    ?` 이 수치는 ${fl.periodEnd} 장마감까지 확정된 값이에요 — 오늘 장중 실시간 매매 동향과는 며칠 차이가 날 수 있어요.`
    :'';
  return {state,lead,rows,holdDelta,fl,explain,
    check:'좋은 수급도 지속 여부가 중요해요. 외국인·기관의 매수가 며칠 뒤에도 이어지는지 확인해보세요.'+periodNote,
    quality:flowQualityLabel(fl.qualityScore), divergence:FLOW_DIVERGENCE_TXT[fl.divergence]||null};
}

// ④ RISK — 위험: "이 종목은 얼마나 크게 흔들릴 수 있는가?"
function riskStateLabel(grade){ return grade==='low'?'위험도 낮음':grade==='high'?'위험도 높음':'위험도 보통'; }
function getRiskInterpretation(code){
  const r=(liveInd(code)||{}).risk; if(!r) return null;
  const overlay=riskDecisionOverlay(code);
  const state=riskStateLabel(r.grade);
  const swing=(r.vol20*2).toFixed(1);
  const lead=r.grade==='high'
    ?`가격 변동이 큰 편이에요. 최근 3개월 동안 고점 대비 최대 ${r.mdd3m}%의 큰 하락이 발생한 적이 있어요.`
    :r.grade==='low'
    ?`가격 변동은 차분한 편이에요. 다만 최근 3개월 고점 대비 최대 ${r.mdd3m}%까지 빠진 적은 있어요.`
    :`가격 변동은 보통 수준이지만, 최근 3개월 동안 고점 대비 최대 ${r.mdd3m}%의 하락이 발생한 적이 있어요.`;
  const metrics=[
    {label:'하루 평균 변동폭', value:'±'+r.vol20+'%', sub:'이 종목은 하루에도 이 정도 오르내릴 수 있어요'},
    {label:'최근 최대낙폭', value:r.mdd3m+'%', sub:'최근 3개월 고점 대비 최대 하락폭(참고값)'},
    {label:'52주 가격 위치', value:r.pos52w!=null?r.pos52w+'%':'—',
      sub:r.pos52w!=null?(r.pos52w>=70?'최근 1년 범위에서 비교적 높은 위치':r.pos52w<=30?'최근 1년 범위에서 비교적 낮은 위치':'최근 1년 범위의 중간 지점'):'데이터가 부족해 계산하지 못했어요'},
  ];
  const guide=swing<=12
    ?`통계적 흔들림 참고 — 현재 변동성을 기준으로 보면 단기적으로 약 -${swing}% 수준의 가격 움직임도 나타날 수 있어요. 손절가나 목표가격을 의미하지 않으며, 개인의 투자기간과 위험 감내 수준에 따라 판단 기준은 달라질 수 있어요.`
    :`통계적 흔들림 참고 — 지금은 이틀치 출렁임만 ±${swing}%에 달하는 이례적으로 험한 구간이에요. 일반적인 손절선(-5~-10%)이 하루 만에 닿을 수 있으니, 변동성이 가라앉은 뒤 접근하는 것도 한 방법이에요.`;
  const explain=`현재 위험 수준은 ${state==='위험도 높음'?'높은':state==='위험도 낮음'?'낮은':'보통'} 편이에요. 주가 방향에 대한 긍정 신호가 있더라도, 변동성이 큰 종목은 점수를 보수적으로 반영해요.`;
  return {state,lead,metrics,explain,guide,
    check:'최근 최대낙폭과 하루 변동폭을 참고해 본인이 감당할 수 있는 가격 변동인지 확인해보세요.',
    penalty:overlay.penalty, confPenalty:overlay.confPenalty};
}

// ⑤ 공통 렌더러 — 위 getXInterpretation() 결과를 "상태라벨→점수→한줄결론→핵심지표→
// 초보자해석→체크할점→자세히보기" 구조의 카드 본문 HTML로 조립한다. 데이터가 부족해
// null이 오면 예전처럼 findings 목록만 보여준다(깨지지 않는 안전망).
function analystCardBodyHTML(id,code,res,color){
  const I=id==='diana'?getDianaInterpretation(code,res)
    :id==='nova'?getQuantInterpretation(code,res)
    :id==='flow'?getFlowInterpretation(code,res)
    :id==='risk'?getRiskInterpretation(code):null;
  const stateEl=document.getElementById('state-'+id);
  const noteEl=document.getElementById('note-'+id);
  if(!I){
    if(stateEl) stateEl.textContent='';
    if(noteEl) noteEl.textContent='';
    return `<ul>${res.findings.map(findingLi).join('')}</ul>`;
  }
  if(stateEl){ stateEl.textContent=I.state; stateEl.style.color=color; stateEl.style.background=color+'18'; }
  if(noteEl) noteEl.textContent=SCORE_MEANING_NOTE;
  const lead=`<p class="fx-lead">${esc(I.lead)}</p>`;
  let metricsHTML='';
  if(id==='flow'){
    metricsHTML=`<div class="fx-flow-row">`+I.rows.map(m=>{
      const up=m.val>=0;
      return `<div class="fx-flow-card ${up?'up':'dn'}"><div class="fx-flow-label">${esc(m.label)}</div>`+
        `<div class="fx-flow-val">${up?'+':'−'}${Math.abs(m.val).toLocaleString('ko-KR')}주</div>`+
        `<div class="fx-flow-dir">${up?'▲':'▼'} ${m.dir}</div><div class="fx-flow-period">${esc(m.period)}</div></div>`;
    }).join('')+`</div>`;
    const subs=[];
    subs.push('자료: 네이버 증권 투자자별 순매매 · 장마감 확정치 기준');
    if(typeof I.fl.todayFrgn==='number'&&typeof I.fl.todayOrg==='number'&&typeof I.fl.todayIndi==='number')
      subs.push(`직전 거래일: 외국인 ${I.fl.todayFrgn>=0?'+':''}${I.fl.todayFrgn.toLocaleString('ko-KR')}주 · 기관 ${I.fl.todayOrg>=0?'+':''}${I.fl.todayOrg.toLocaleString('ko-KR')}주 · 개인 ${I.fl.todayIndi>=0?'+':''}${I.fl.todayIndi.toLocaleString('ko-KR')}주`);
    if(typeof I.holdDelta==='number') subs.push(`외국인 보유율 ${I.fl.holdBefore}% → ${I.fl.holdNow}% (${fmtPp(I.holdDelta)})`);
    if(I.quality) subs.push(I.quality+(I.divergence?' · '+I.divergence:''));
    if(subs.length) metricsHTML+=`<div class="fx-sub">${subs.map(esc).join('<br>')}</div>`;
    if(I.fl.periodStart&&I.fl.periodEnd)
      metricsHTML+=`<div class="fx-sub" style="font-weight:600;color:var(--ink)">* 당일(오늘) 수급 확정치는 오늘 장마감 직후가 아니라 다음 거래일에 반영돼요</div>`
        +`<div class="fx-sub"><b>⚠️ 지금(장중) 진행 중인 수급은 이 점수에 반영되지 않아요.</b> 오늘 매매 상황이 궁금하면 이용 중인 증권사 앱(HTS·MTS)의 실시간 수급 화면에서 직접 확인해주세요.</div>`;
  }else{
    metricsHTML=`<div class="fx-metrics">`+I.metrics.map(m=>
      `<div class="fx-metric"><div class="fx-metric-label">${esc(m.label)}</div>`+
      `<div class="fx-metric-row main">${esc(m.value)}</div>`+
      (m.sub?`<div class="fx-metric-row sub">${esc(m.sub)}</div>`:'')+
      `</div>`).join('')+`</div>`;
  }
  const badge=I.badge?`<span class="fx-badge">${esc(I.badge)}</span>`:'';
  const scope=I.scope?`<div class="fx-scope">비교 범위: ${esc(I.scope)}</div>`:'';
  const explain=I.explain?`<div class="fx-explain"><b>초보자용 해석</b><p>${esc(I.explain)}</p></div>`:'';
  const guide=I.guide?`<div class="fx-explain"><p>${esc(I.guide)}</p></div>`:'';
  const check=I.check?`<div class="fx-check"><b>체크할 점</b><p>${esc(I.check)}</p></div>`:'';
  const details=`<details class="fx-details"><summary>자세히 보기</summary><ul>${res.findings.map(findingLi).join('')}</ul></details>`;
  // 🔎 QUANT 카드 맨 아래에만 붙는, 눌러야 펼쳐지는 아주 작은 글씨의 계산 방식 각주.
  const method=I.methodNote?`<details class="fx-method"><summary>이 계산은 어떻게 나온 건가요?</summary><p>${esc(I.methodNote)}</p></details>`:'';
  return lead+badge+metricsHTML+scope+explain+guide+check+details+method;
}

function makeCards(isLive){
  cardsEl.innerHTML='';
  const evalRules={
    taro:{
      text:'5거래일 · ±1% 초과 채점 · 기본 30%',
    },
    diana:{
      text:'20거래일 · ±3% 초과 채점 · 기본 12%',
    },
    nova:{
      text:'5거래일 · ±1% 초과 채점 · 기본 28%',
    },
    flow:{
      text:'5거래일 · ±1% 초과 채점 · 기본 30%',
    },
  };
  ['taro','diana','nova','flow'].map(id=>AGENTS.find(a=>a.id===id)).forEach(a=>{
    const rule=evalRules[a.id];
    const evalRule=evalRuleBadge(a.id,rule.text);
    cardsEl.insertAdjacentHTML('beforeend',
      `<div class="card" id="card-${a.id}">
         <h3><span style="color:${a.color}">●</span> ${a.name}${isLive?'<span class="live">LIVE</span>':''}${evalRule}<span class="accb" id="acc-${a.id}" style="display:none"></span>
           <span class="stance neu" id="st-${a.id}">대기</span></h3>
         <div class="role">${a.role} · ${a.room}</div>
         <div class="card-state" id="state-${a.id}"></div>
         <div class="scorewrap"><span class="score" id="sc-${a.id}" style="color:${a.color}">—</span><span class="score-max">/100</span></div>
         <div class="card-score-note" id="note-${a.id}"></div>
         <div class="scorebar"><div class="scorebar-fill" id="bar-${a.id}"></div></div>
         <div id="fx-${a.id}" class="fx-body"><p class="fx-empty">분석을 시작하면 결과가 표시됩니다.</p><div class="fx-ph" aria-hidden="true"></div><div class="fx-ph" aria-hidden="true"></div></div>
       </div>`);
  });
  setAnalystTab(window.GaeoAnalystTab||'taro');
  // 🎯 개인 통산 적중률 배지 — 역할별 기간으로 채점한 리더보드 성적을 카드 헤더에도 표시
  try{
    computeLeaderboard().forEach(r=>{
      const el=document.getElementById('acc-'+r.id);
      if(!el||r.acc===null) return;
      const rule=LB_RULES[r.id]||{days:5,deadband:1};
      el.textContent=`통산 적중 ${r.acc}%`;
      el.title=`${r.name}의 통산 적중률 ${r.acc}% — 지금까지 모든 종목에서 낸 강세/약세 판단 ${r.n}개를 "판단 후 ${rule.days}거래일 뒤 종가"와 ±${rule.deadband}% 기준으로 채점한 성적이에요.`
        +(r.pending?` (⏳평가중 ${r.pending}건은 별도)`:'');
      el.style.display='';
    });
  }catch(e){}
}
// 숫자 카운트업(0 → 목표값, ease-out) — 모션 최소화 설정이면 즉시 표시
function countUp(el,target,dur){
  if(!el) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ el.textContent=target; return; }
  const t0=performance.now(), ease=x=>1-Math.pow(1-x,3);
  (function step(now){
    const p=Math.min(1,(now-t0)/(dur||700));
    el.textContent=Math.round(target*ease(p));
    if(p<1) requestAnimationFrame(step);
  })(t0);
}
function fillCard(a,res,code){
  document.getElementById('card-'+a.id).classList.add('on');
  countUp(document.getElementById('sc-'+a.id),res.score,750);
  const st=document.getElementById('st-'+a.id);
  st.className='stance '+(res.stance==='bull'?'bull':res.stance==='bear'?'bear':'neu');
  st.textContent=res.stance==='bull'?'강세':res.stance==='bear'?'약세':'중립';
  const fx=document.getElementById('fx-'+a.id);
  if(a.id==='taro'){
    fx.innerHTML=`<ul>${res.findings.map(findingLi).join('')}</ul>`;
    const viz=taroChartHTML(code);
    if(viz){ const holder=document.createElement('div'); holder.className='taro-viz-holder';
      holder.innerHTML=viz; fx.before(holder); }
  }else{
    // DIANA·QUANT·FLOW — "결론 먼저 → 핵심 숫자 → 쉬운 해석 → 주의점" 구조로 재조립
    fx.innerHTML=analystCardBodyHTML(a.id,code,res,a.color);
  }
  // 📄 이 분석가 축에 해당하는 공식 공시를 카드 아래에 붙인다(재무·수급만 해당).
  //    기술(TARO)·확률통계(QUANT)는 공시로 설명되는 축이 아니라 붙이지 않는다.
  if(a.id==='diana'||a.id==='flow'){
    const dm=dartMatchHTML(code,a.id);
    if(dm){ const holder=document.createElement('div'); holder.innerHTML=dm; fx.after(holder.firstElementChild); }
  }
  if(a.id==='nova'&&Array.isArray(res.sources)&&res.sources.length){
    const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const holder=document.createElement('div'); holder.className='nova-src';
    holder.innerHTML='<span class="ns-t">근거 기사</span>'+res.sources.map(s=>
      ` · ${esc(s.t)} <span class="ns-meta">(${esc(s.p||'')}${s.d?' · '+esc(s.d):''})</span>`).join('');
    fx.after(holder);
  }
  const bar=document.getElementById('bar-'+a.id);
  if(bar){ bar.style.background=a.color; requestAnimationFrame(()=>{bar.style.width=Math.max(2,res.score)+'%';}); }
  SFX.ding();
}

/* ---------- 🛡️ RISK 리스크 관리자 카드 (종합점수 단방향 안전장치) ----------
   compute_indicators.py가 일봉으로 미리 계산한 risk(vol20·mdd3m·pos52w·grade)를
   그대로 읽어 규칙 기반 문장으로 보여준다(토큰 0). 좋은 점수를 올리지는 않고,
   위험할 때 종합점수와 확신도만 낮추는 단방향 안전장치다. */
const RISK_COLOR='#a16207';
function renderRiskCard(code,data){
  const old=document.getElementById('card-risk'); if(old) old.remove();
  const r=(liveInd(code)||{}).risk; if(!r) return;
  const gradeKr=r.grade==='low'?'안정':(r.grade==='high'?'위험':'보통');
  const gradeCls=r.grade==='low'?'bull':(r.grade==='high'?'bear':'neu');
  // 안정 점수(높을수록 차분한 종목): 변동성·최대낙폭이 클수록 깎인다
  const overlay=riskDecisionOverlay(code), score=overlay.score;
  const volDesc=r.vol20>=4?'하루에도 급등락이 오가는 큰 폭이에요':(r.vol20<=1.8?'큰 종목치고 차분한 편이에요':'적당히 출렁이는 보통 수준이에요');
  // "자세히 보기"용 원문 — 내부 계산 방식(방향 원점수 감점 등)은 기본 화면 대신 여기로만 노출한다
  const findings=[
    `하루 변동폭: 최근 한 달간 하루 평균 ±${r.vol20}% 출렁였어요 — ${volDesc}`,
    `최대낙폭: 최근 3개월 안에서 고점 대비 최대 ${r.mdd3m}%까지 빠진 적이 있어요 — 이만큼의 하락은 이 종목에선 '있을 수 있는 일'이라는 뜻이에요`,
    (r.pos52w!=null?`52주 가격 위치: 1년 범위에서 지금은 ${r.pos52w}% 지점이에요 (0%=1년 최저가, 100%=1년 최고가)`:'52주 가격 위치: 데이터가 부족해 계산하지 못했어요'),
    `점수 산정 방식: 위험은 매수 근거로 쓰지 않고, 현재 안정도에서는 방향 원점수에서 ${overlay.penalty}점과 확신도에서 ${overlay.confPenalty}%p를 낮춰 과감한 판단을 억제해요`,
  ];
  cardsEl.insertAdjacentHTML('beforeend',
    `<div class="card on" id="card-risk">
       <h3><span style="color:${RISK_COLOR}">●</span> RISK${evalRuleBadge('risk','가점 없음 · 고위험 최대 -7점')}<span class="stance ${gradeCls}" id="st-risk">${gradeKr}</span></h3>
       <div class="role">리스크 관리 · 종합점수 단방향 안전장치</div>
       <div class="card-state" id="state-risk"></div>
       <div class="scorewrap"><span class="score" id="sc-risk" style="color:${RISK_COLOR}">—</span><span class="score-max">/100 안정도</span></div>
       <div class="card-score-note" id="note-risk"></div>
       <div class="scorebar"><div class="scorebar-fill" id="bar-risk"></div></div>
       <div id="fx-risk" class="fx-body"></div>
     </div>`);
  // state-risk/note-risk가 DOM에 먼저 들어간 뒤에 채워야 analystCardBodyHTML의
  // getElementById('state-risk'/'note-risk')가 요소를 찾을 수 있다.
  document.getElementById('fx-risk').innerHTML=analystCardBodyHTML('risk',code,{findings},RISK_COLOR);
  // 📄 정정·해명 공시는 "앞서 낸 정보가 흔들린" 신호라 리스크 카드에 매칭해 붙인다.
  { const dm=dartMatchHTML(code,'risk');
    if(dm){ const fxr=document.getElementById('fx-risk');
      const holder=document.createElement('div'); holder.innerHTML=dm;
      fxr.after(holder.firstElementChild); } }
  countUp(document.getElementById('sc-risk'),score,750);
  const bar=document.getElementById('bar-risk');
  if(bar){ bar.style.background=RISK_COLOR; requestAnimationFrame(()=>{bar.style.width=Math.max(2,score)+'%';}); }
  setAnalystTab(window.GaeoAnalystTab||'taro');
}

// ---------- 종합 시각화: 레이더 + 게이지 ----------
const VIZ_AXES=[
  {id:'taro', label:'기술',      color:'#1fb6c9'},
  {id:'diana',label:'재무',      color:'#8b6fe0'},
  {id:'nova', label:'확률·통계', color:'#e0842f'},
  {id:'flow', label:'수급',      color:'#1f9d64'},
];
/* ⚡ 의견 갈림 감지: 4인 점수의 최대-최소 차가 CLASH_MIN 이상이면
   "평균 뒤에 숨은 시각차"를 배지·경고문으로 정직하게 드러낸다. */
const CLASH_MIN=30;
function clashInfo(d){
  try{
    const s=VIZ_AXES.map(a=>({label:a.label, v:d[a.id].score}));
    const hi=s.reduce((p,x)=>x.v>p.v?x:p), lo=s.reduce((p,x)=>x.v<p.v?x:p);
    const spread=hi.v-lo.v;
    return spread>=CLASH_MIN?{spread,hi,lo}:null;
  }catch(e){ return null; }
}
function radarSVG(scores){
  const cx=120,cy=120,R=86, ang=[-90,0,90,180].map(d=>d*Math.PI/180);
  const pt=(f,i)=>[(cx+R*f*Math.cos(ang[i])).toFixed(1),(cy+R*f*Math.sin(ang[i])).toFixed(1)];
  const ring=f=>ang.map((_,i)=>pt(f,i).join(',')).join(' ');
  let rings=''; [.25,.5,.75,1].forEach(f=>{rings+=`<polygon points="${ring(f)}" fill="none" stroke="#DCE3EA" stroke-width="1"/>`;});
  let axes=''; ang.forEach((_,i)=>{const[x,y]=pt(1,i);axes+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#DCE3EA" stroke-width="1"/>`;});
  const dpts=VIZ_AXES.map((a,i)=>pt(Math.max(.04,scores[i]/100),i).join(',')).join(' ');
  let dots=''; VIZ_AXES.forEach((a,i)=>{const[x,y]=pt(Math.max(.04,scores[i]/100),i);dots+=`<circle cx="${x}" cy="${y}" r="4.2" fill="#3E94B5" stroke="#fff" stroke-width="1.3"/>`;});
  const lbl=[[cx,cy-R-9,'middle'],[cx+R+5,cy+4,'start'],[cx,cy+R+18,'middle'],[cx-R-5,cy+4,'end']];
  let labels=''; VIZ_AXES.forEach((a,i)=>{labels+=`<text x="${lbl[i][0]}" y="${lbl[i][1]}" text-anchor="${lbl[i][2]}" font-size="11.5" font-weight="600" fill="#6B7684">${a.label}</text>`;});
  return `<svg class="radar" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">${rings}${axes}`+
    `<polygon points="${dpts}" fill="rgba(136,205,231,.30)" stroke="#3E94B5" stroke-width="2" stroke-linejoin="round"/>${dots}${labels}</svg>`;
}
function renderViz(data,code,verdict){
  const scores=VIZ_AXES.map(a=>data[a.id].score);
  const legend=VIZ_AXES.map((a,i)=>{
    const st=data[a.id].stance, kr=st==='bull'?'강세':st==='bear'?'약세':'중립';
    return `<div class="leg"><span class="dotc" style="background:${a.color}"></span>`+
      `<span class="lname">${a.label}</span>`+
      `<span class="ltrack"><span class="lfill" data-w="${scores[i]}" style="background:${a.color}"></span></span>`+
      `<span class="lnum">${scores[i]} · ${kr}</span></div>`;
  }).join('');
  const el=document.getElementById('viz');
  const ro=riskDecisionOverlay(code), raw=verdict.rawTotal??verdict.total;
  el.innerHTML=`<div class="vtitle">팀 종합 프로파일</div>`+
    `<div class="vsub">4개 방향축과 1개 RISK 안전축을 분리해 계산 근거를 보여드립니다</div>`+
    radarSVG(scores)+`<div class="radar-legend">${legend}</div>`+
    `<div class="risk-brake"><b>방향 원점수 ${raw}</b><span class="rb-line"></span>`+
      `<span class="rb-cut">RISK ${verdict.riskPenalty?'-'+verdict.riskPenalty:'감점 없음'}</span><span class="rb-line"></span>`+
      `<b class="rb-final">최종 ${verdict.total}</b>`+
      `<small>안정도 ${verdict.riskScore??ro.score??'자료 없음'}점. 낮은 위험은 점수를 올리지 않고, 높은 위험만 최대 7점 감점합니다.</small></div>`;
  el.classList.add('on');
  setAnalystTab(window.GaeoAnalystTab||'taro');
  requestAnimationFrame(()=>el.querySelectorAll('.lfill').forEach(f=>f.style.width=f.dataset.w+'%'));
}
/* ═══════════════════════════════════════════════════════════════
   🧭 종합 판단 리디자인(2026-08-07) — 핵심 지표 그리드·판단 이유·
   긍정/주의 요인·상세 근거 아코디언. data(기술/재무/확률/수급 4축
   점수)는 이미 구조화된 값이라, 여기서는 그 값을 새로 계산하지 않고
   카드로 재배치만 한다(easySingleHTML의 best/worst 선정 로직 계승).
   ═══════════════════════════════════════════════════════════════ */
const VIZ_AX_EASY={
  taro: {hi:'최근 주가가 오르려는 힘이 좋아요', mid:'주가 흐름은 보통이에요', lo:'주가가 아직 아래로 처져 있어요'},
  diana:{hi:'회사가 돈을 잘 벌고, 지금 값도 싼 편이에요', mid:'돈 버는 실력은 무난한 편이에요', lo:'버는 돈에 비해 주가가 비싸거나 확인이 더 필요해요'},
  nova: {hi:'비슷한 상황에서 과거에 오른 적이 많았어요', mid:'과거 통계로는 반반이에요', lo:'비슷한 상황에서 과거에 내린 적이 많았어요'},
  flow: {hi:'외국인·기관 같은 큰손들이 사 모으고 있어요', mid:'큰손들은 지켜보는 중이에요', lo:'큰손들이 팔고 있어요'},
};
function axisEasyPhrase(id,score){ const x=VIZ_AX_EASY[id]; return score>=55?x.hi:(score<=45?x.lo:x.mid); }
function axisBestWorst(data){
  const best=VIZ_AXES.reduce((p,a)=>data[a.id].score>data[p.id].score?a:p);
  const worst=VIZ_AXES.reduce((p,a)=>data[a.id].score<data[p.id].score?a:p);
  return {best,worst};
}
// 1. 핵심 지표 요약 — 종합점수·확신도·현재가·기준가 대비를 같은 크기 카드 4개로
function verdictMetricGridHTML(v,stock){
  const base=analysisBase(stock.code);
  const gapHTML=(base&&stock.price)
    ? (()=>{const p=(stock.price-base)/base*100,col=p>0?'var(--krup)':(p<0?'var(--krdn)':'var(--ink)');
        return `<span style="color:${col}">${p>0?'+':''}${p.toFixed(1)}%</span>`;})()
    : '<span style="color:var(--faint)">—</span>';
  const cell=(label,valueHTML)=>`<div class="vmetric"><div class="vmetric-label">${label}</div><div class="vmetric-value">${valueHTML}</div></div>`;
  return `<div class="vmetric-grid">`
    // 2026-08-26: 종합점수만 판단색(주황·초록·빨강)으로 칠하면 같은 표 안에서 네 숫자의
    // 색이 제각각이 된다. BUY/HOLD/SELL 색은 바로 위 Hero의 판단 글자가 이미 갖고 있으니
    // 여기서는 중립으로 두고 크기·굵기로만 강조한다(색은 시장 방향에만).
    + cell('종합점수', `${v.total}<small>점</small>`)
    + cell('판단 확신도', `${v.conf}<small>%</small>`)
    + cell('현재가', stock.price?won(stock.price):'—')
    + cell('기준가 대비', gapHTML)
    + `</div>`
    + confReliabilityNoteHTML(v);
}
/* 확신도 ≠ 신뢰도 — 확신도는 chief_eval 실제 산식(네 분석축 점수 일치도에서 리스크를
   감점, 30~90 범위) 그대로의 '현재 판단 또렷함'이고, 신뢰도는 성적표(model_scoreboard)의
   현행 모델 버전 Forward 검증 기록 상태다. 새 공식·새 %를 만들지 않는다 —
   검증 적중률이 실측되기 전에는 숫자 없이 '기록 축적 중'으로만 쓴다. */
function baseReliabilityState(){
  const SB=(typeof MODEL_SCOREBOARD!=='undefined'&&MODEL_SCOREBOARD)?MODEL_SCOREBOARD:null;
  const base=SB&&Array.isArray(SB.models)?SB.models.find(m=>m.id==='base_production'):null;
  if(!base) return {kind:'UNKNOWN'};
  const cur=base.currentModelVersion;
  const v=cur?((base.byModelVersion||{})[cur]||null):null;
  if(v&&typeof v.accuracy==='number')
    return {kind:'MEASURED',acc:v.accuracy,ci:Array.isArray(v.accuracyCI95)?v.accuracyCI95:null};
  return {kind:'ACCUMULATING'};
}
function confReliabilityNoteHTML(v){
  if(v.conf==null) return '';
  const r=baseReliabilityState();
  // 신뢰도 상태줄 — 숫자를 발명하지 않는다: 실측 적중률이 있으면 그 이름 그대로,
  // 없으면 '기록 축적 중'. confidence 복사·재명명 금지.
  const relState=r.kind==='MEASURED'?'검증 기록 확보'
    :(r.kind==='ACCUMULATING'?'기록 축적 중':'상태 확인 불가');
  const rel=r.kind==='MEASURED'
    ?`현행 판단 방식의 5거래일 검증 적중률은 ${r.acc}%${r.ci?` (범위 ${r.ci[0]}~${r.ci[1]}%)`:''}예요.`
    :(r.kind==='ACCUMULATING'
      ?'현행 판단 방식은 새 검증 기록을 쌓는 중이라 아직 신뢰도 수치가 없어요(0%가 아니라 표본 대기예요).'
      :'검증 기록 상태를 불러오지 못했어요.');
  return `<div class="vrel-line">신뢰도 · ${relState}</div><div class="vmetric-note"><b>확신도</b>는 지금 이 판단의 신호(기술·재무·확률·수급 점수가 서로 얼마나 일치하는지, 리스크 감점 포함)가 얼마나 또렷한지를 보여줘요 — <b>상승 확률이 아니에요</b>. <b>신뢰도</b>는 같은 판단 방식이 실제 5거래일 검증에서 쌓아온 기록이에요. ${rel} 자세한 기록은 성적표에서 볼 수 있어요.</div>`;
}
// 2. 판단 이유 3가지 — best/worst 축 + 확신도. 새 문장을 짓지 않고 구조화된 점수만 재배치한다.
function verdictReasonsHTML(data,v){
  const {best,worst}=axisBestWorst(data);
  const confDesc=v.conf>=60?'분석가들의 시각이 대체로 일치해요.':(v.conf>=45?'의견이 어느 정도 갈려 조심스러운 판단이에요.':'의견이 크게 갈려 아직 자신이 크지 않은 판단이에요.');
  const cl=clashInfo(data);
  const items=[
    {t:`${best.label} 흐름은 좋은 편이에요`, d:`「${best.label}」 ${data[best.id].score}점 — ${axisEasyPhrase(best.id,data[best.id].score)}`},
    {t:`${worst.label}${josaIGa(worst.label)} 상대적으로 아쉬워요`, d:`「${worst.label}」 ${data[worst.id].score}점 — ${axisEasyPhrase(worst.id,data[worst.id].score)}`},
    {t:`판단 확신도는 ${v.conf}%예요`, d:confDesc+(cl?` 분석가 간 최대 ${cl.spread}점 차이가 나요.`:'')},
  ];
  // ⚠️ 바깥 #vreasons가 이미 .vreasons class와 구분선을 갖고 있다 — 여기서 wrapper를
  //    한 번 더 만들면 구분선이 두 줄로 겹친다(2026-08-26 통일 작업에서 정리).
  return `<div class="vsec-title">판단 이유</div>`
    + items.map((it,i)=>`<div class="vreason-item"><span class="vreason-num">${i+1}</span>`+
        `<div class="vreason-body"><div class="vreason-title">${esc(it.t)}</div><div class="vreason-desc">${it.d}</div></div></div>`).join('');
}
// 3. 긍정 요인 / 주의 요인 — 4축의 강세(bull)/약세(bear) 방향과 RISK·확신도·의견갈림을 분리해서 보여준다.
function verdictFactorsHTML(data,v){
  const pos=[],neg=[];
  VIZ_AXES.forEach(a=>{
    const d=data[a.id]; if(!d) return;
    const line=`${a.label} — ${axisEasyPhrase(a.id,d.score)}`;
    if(d.stance==='bull') pos.push(line); else if(d.stance==='bear') neg.push(line);
  });
  if(v.riskGrade==='low') pos.push('RISK 안전축 — 변동성 부담이 크지 않아요');
  if(v.riskGrade==='high') neg.push('RISK 안전축 — 변동성이 커서 감점이 반영됐어요');
  if(v.conf<45) neg.push('판단 확신도가 높지 않아요 — 추가 확인이 필요해요');
  const cl=clashInfo(data);
  if(cl) neg.push(`분석가들 의견이 크게 갈렸어요(최대 ${cl.spread}점 차이)`);
  const list=(arr,empty)=>arr.length?`<ul>${arr.map(x=>`<li>${x}</li>`).join('')}</ul>`:`<ul><li>${empty}</li></ul>`;
  // 이 구역만 제목(.vsec-title)이 없어서 다른 구역과 리듬이 어긋났다 → 같은 제목 형식을 붙인다.
  // 바깥 #vfactors가 이미 class와 구분선을 갖고 있으므로 wrapper는 만들지 않는다.
  return `<div class="vsec-title">긍정·주의 요인</div>`
    + `<div class="vfactor-col pos"><div class="vfactor-head">긍정 요인</div>${list(pos,'뚜렷한 긍정 신호가 아직 없어요')}</div>`
    + `<div class="vfactor-col neg"><div class="vfactor-head">주의 요인</div>${list(neg,'특별히 걸리는 위험 신호는 없어요')}</div>`;
}
// ⭐ 2026-08-07: 픽셀 하우스 애니메이션 제거 — 분석가가 "일하러 걸어가는" 연출은 없앴지만
// 카드가 순차적으로 채워지는 느낌(스태거드 리빌)은 그대로 유지하려고 단순 지연 타이머로 남겨둔다.
function sendToWork(dur,onDone){ setTimeout(onDone,dur); }
async function analyze(){
  if(running)return; running=true;
  SFX.click();
  // 📊 전체 지표(indicators.js)를 먼저 확보한다 — 홈은 경량본만 받기 때문이다.
  //    이미 받았으면 즉시 통과한다(GaeoFeatures가 같은 약속을 재사용).
  if(typeof ensureIndicators==='function'){ try{ await ensureIndicators(); }catch(e){} }
  /* ⭐ 2026-08-27 버그수정 — 분석을 눌러두고 기다리는 동안 화면을 직접 움직여
     다른 곳(차트·시황·아래쪽 등)을 보고 있었는데, 분석이 끝나면 아래 종합판단으로
     화면이 강제로 끌려가 보던 자리를 잃어버렸다(대표 실사용 중 신고).
     여기서 "기다리는 동안 사용자가 화면을 직접 움직였는지"를 기록해 두고,
     움직였다면 결과가 나와도 스크롤을 빼앗지 않는다(탭만 종합판단으로 맞춰 둔다).
     analyze() 안에서 프로그램이 스크롤하는 곳은 맨 끝 두 갈래뿐이라(그 시점엔 이미
     판정이 끝난 뒤다) 이 감시가 우리 스크롤 때문에 잘못 켜지지 않는다. */
  let userMovedView=false;
  const markUserMoved=()=>{ userMovedView=true; };
  const VIEW_KEYS=new Set(['PageUp','PageDown','Home','End','ArrowUp','ArrowDown',' ']);
  const onViewKey=event=>{ if(VIEW_KEYS.has(event.key)) userMovedView=true; };
  window.addEventListener('wheel',markUserMoved,{passive:true});
  window.addEventListener('touchmove',markUserMoved,{passive:true});
  window.addEventListener('scroll',markUserMoved,{passive:true});
  window.addEventListener('keydown',onViewKey);
  const releaseViewGuard=()=>{
    window.removeEventListener('wheel',markUserMoved);
    window.removeEventListener('touchmove',markUserMoved);
    window.removeEventListener('scroll',markUserMoved);
    window.removeEventListener('keydown',onViewKey);
  };
  const stock=resolveStock(document.getElementById('ticker').value);
  window.GaeoCurrentCode=stock.code;
  // 📚 정밀분석 기록 탭 — 이 종목이 정밀분석 대상(LIVE_AN)에 있을 때만 탭을 보여주고,
  // 종목이 바뀌었으니 이전 종목의 렌더링 캐시는 지운다.
  { const at=document.getElementById('analysisTabArchive');
    if(at) at.style.display=(LIVE_AN&&LIVE_AN[stock.code])?'':'none'; }
  { const aw=document.getElementById('archiveWrap'); if(aw) aw.innerHTML=''; }
  { const ac=document.getElementById('archiveChecking'); if(ac) ac.style.display=''; }
  window.GaeoArchiveRenderedFor=null;
  { const el=document.getElementById('overviewChecking'); if(el) el.style.display=''; }
  showQuote(stock);
  { const el=document.getElementById('overviewChecking'); if(el) el.style.display='none'; }
  window.GaeoAnalysisReady=true;
  document.getElementById('analysisDetails').hidden=false;
  setAnalysisTab('overview');
  gaeoTrack('stock_search_submit',{stock_code:stock.code||'',page_type:'stock_analysis'});
  gaeoTrack('stock_analysis_open',{stock_code:stock.code||'',page_type:'stock_analysis'});
  try{ await window.ensureAutoAnalysis(); }catch(e){}
  document.getElementById('run').disabled=true; vEl.classList.remove('on');
  document.getElementById('viz').classList.remove('on');
  { const rd=document.getElementById('radarDetail'); if(rd){ rd.classList.remove('on'); rd.innerHTML=''; } }
  // 🔍 새 분석을 시작할 때마다 "분석 확인 중" 표시를 다시 켠다(이전 종목 결과가
  // 남아있는 상태로 텅 비어 보이지 않게).
  ['agentsChecking','verdictChecking','radarChecking'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.style.display='';
  });
  { const rp=document.getElementById('analysisPanelRadar'); if(rp) rp.classList.add('checking'); }
  const data=runAnalysis(stock);
  makeCards(!!data._live);
  cardsEl.classList.add('busy');            // 스켈레톤(시머) 표시 시작

  let done=0;
  ['taro','diana','nova','flow'].forEach(id=>{
    const a=AGENTS.find(x=>x.id===id);
    sendToWork(3200+Math.random()*2200,()=>{
      fillCard(a,data[a.id],stock.code);
      if(++done===4){ cardsEl.classList.remove('busy');
        { const el=document.getElementById('agentsChecking'); if(el) el.style.display='none'; }
        renderRiskCard(stock.code,data); runChief(); }
    });
  });
  const cleanAnalysisCopy=value=>String(value??'')
    .replace(/(?:🕒|🔎|🎯|🧒|👍|🤔|⚡|🤖|🧠|📝|🧭|🚧|🔍|📊|📈|📉|✅|⚠️|※)\s*/g,'· ')
    .replace(/\s*[—–]\s*/g,': ');
  // 0. Hero 한 줄 요약 — best/worst 축과 확신도를 조합한 자연어 문장(새 서술 생성 없이 구조화된 값만 조합).
  // 짧은 문장 여러 개로 끊어 쓴다(결론 먼저, 전문용어 뒤 쉬운 설명 원칙).
  function verdictHeadline(v,data){
    const {best,worst}=axisBestWorst(data);
    const confTail=v.conf>=60?'판단 확신도도 비교적 높은 편이에요.':(v.conf>=45?'판단 확신도는 보통이에요.':'다만 판단 확신도가 아직 높지 않아요.');
    if(v.call==='BUY') return `<b>${best.label}</b> 흐름이 좋아요. ${confTail} 긍정 신호가 우세해요.`;
    if(v.call==='SELL') return `<b>${worst.label}</b>${josaIGa(worst.label)} 부담으로 작용하고 있어요. ${confTail} 위험 요인을 먼저 확인하는 편이 좋아요.`;
    return `<b>${best.label}</b>${josaEunNeun(best.label)} 양호하지만 <b>${worst.label}</b>${josaIGa(worst.label)} 걸려 있어요. 지금은 관망하며 추가 확인이 필요해요.`;
  }
  const EVID_LABEL={taro:'기술적 근거',diana:'재무 근거',nova:'확률·통계 근거',flow:'수급 근거'};
  /* 📄 최근 공식 공시 (DART) — 러너가 판단 시각 기준(Point-in-Time)으로 요약한
     dart 필드를 그대로 보여준다. 점수에 가산되지 않는 '정보 전용' 맥락이고,
     구 스냅샷(필드 없음)에서는 아무것도 표시하지 않는다(없다고 단정 금지). */
  function dartContextHTML(code){
    const auto=(typeof window.GaeoUseAuto==='function')?window.GaeoUseAuto():null;
    const row=auto&&auto.stocks?auto.stocks[code]:null;
    const d=row?row.dart:null;
    if(!d) return '';
    let stateText=d.stateText||'';
    if(d.state==='EVENT_DATA_ERROR') stateText='공시 데이터를 불러오지 못했어요';
    const items=(d.items||[]).slice(-2).reverse().map(it=>{
      const day=String(it.receiptDate||'').length===8
        ?`${String(it.receiptDate).slice(4,6)}.${String(it.receiptDate).slice(6,8)}`:'';
      return `<div class="dart-item"><span>${esc(it.name||'')}</span><small>${day}${it.isCorrection?' · 정정':''}</small></div>`;
    }).join('');
    return `<div class="dart-context">
      <div class="dart-head"><span>최근 공식 공시</span><small>${esc(stateText)}${d.count>2?` · 최근 ${d.count}건 중 2건`:''}</small></div>
      ${items}
      <p class="dart-note">공시는 최신 공식 정보를 확인하기 위한 참고 근거이며, 현재 DIANA 점수에 직접 가산되지 않습니다.</p>
    </div>`;
  }
  // 6. 상세 분석 근거 — 4축 findings를 아코디언으로(닫힌 상태엔 요약 1줄+점수만), v.text/v.report
  //    원문은 삭제하지 않고 "종합 서술" 아코디언 안으로 그대로 옮긴다. 리스크 감점 계산 근거도 별도 항목.
  function verdictEvidenceHTML(data,v,stock,cleanFn){
    const STANCE_KR={bull:'강세',bear:'약세',neu:'중립'};
    const axisItem=a=>{
      const d=data[a.id]; if(!d) return '';
      const summary=(d.findings&&d.findings[0])?cleanFn(d.findings[0]):'상세 근거를 확인해 보세요.';
      const rest=(d.findings||[]).slice(1);
      const restHTML=rest.length?`<ul class="vev-findings">${rest.map(f=>`<li>${SIGNUM(wrapGloss(cleanFn(f)))}</li>`).join('')}</ul>`:'';
      return `<details class="vev-item"><summary class="vev-summary">`+
        `<span class="vev-summary-name">${EVID_LABEL[a.id]}</span>`+
        `<span class="vev-summary-line">${esc(summary)}</span>`+
        `<span class="vev-badge">${d.score}점 · ${STANCE_KR[d.stance]||'중립'}</span>`+
        `<span class="vev-arrow">▾</span></summary>`+
        `<div class="vev-body"><p>${SIGNUM(wrapGloss(cleanFn(summary)))}</p>${restHTML}</div></details>`;
    };
    const axesHTML=VIZ_AXES.map(axisItem).join('');
    // ⭐ 2026-08-07: v.text/v.report는 서버가 마침표로 문장을 구분해 만든 문자열인데,
    // 통짜 한 문단으로 넣으면 읽기 힘들다. 문장 단위(.!?)로 쪼개 한 문장 = 한 문단으로
    // 보여준다 — 원문 내용은 그대로, 줄바꿈만 추가한다(글자 하나 지우거나 새로 짓지 않음).
    // .!? 뒤에 공백이 있을 때만 문장 경계로 본다 — "+9.3%"처럼 숫자 사이 소수점은
    // 뒤에 공백이 없으니 쪼개지지 않는다(문장은 항상 "마침표+공백"으로 이어져 있다).
    const splitSentences=text=>String(text||'').trim().split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);
    // ⭐ 2026-08-07: 문장을 문단으로 나눠도 다 똑같은 굵기라 핵심 축 이름(기술/재무/퀀트/수급/RISK)과
    // 결론(BUY/SELL/HOLD)이 눈에 안 띈다는 피드백 → 해당 단어만 굵게(<b>) 감싸서 훑어읽기 쉽게 한다.
    // 새 문장을 짓지 않고 원문 그대로에 굵기 태그만 추가한다.
    const NARRATIVE_BOLD_RE=/(RISK|퀀트|기술|재무|수급|HOLD|BUY|SELL)/g;
    const boldKeyTerms=text=>String(text||'').replace(NARRATIVE_BOLD_RE,'<b>$1</b>');
    const narrativeParts=[];
    splitSentences(v.text).forEach(s=>narrativeParts.push(`<p>${SIGNUM(boldKeyTerms(cleanFn(s)))}</p>`));
    splitSentences(v.report).forEach(s=>narrativeParts.push(`<p>${SIGNUM(boldKeyTerms(cleanFn(s)))}</p>`));
    const narrative=narrativeParts.length
      ? `<details class="vev-item"><summary class="vev-summary">`+
          `<span class="vev-summary-name">종합 서술 전문</span>`+
          `<span class="vev-summary-line">CHIEF가 계산한 전체 서술을 그대로 볼 수 있어요</span>`+
          `<span class="vev-arrow">▾</span></summary>`+
          `<div class="vev-body">${narrativeParts.join('')}</div></details>`
      : '';
    const ro={score:v.riskScore,grade:v.riskGrade,penalty:v.riskPenalty};
    const riskBody=(ro.score==null)
      ? '<p>RISK 데이터가 없어 감점 없이 계산했어요.</p>'
      : `<p>RISK 안정도 <b>${ro.score}점</b>(등급: ${ro.grade==='high'?'높음':ro.grade==='mid'?'보통':'낮음'})을 기준으로, `+
        `원점수 <b>${v.rawTotal??v.total}점</b>에서 <b>${ro.penalty||0}점</b>을 감점해 최종 <b>${v.total}점</b>이 됐어요. `+
        `${ro.grade==='high'?'변동성이 커서 감점이 반영됐어요.':'변동성 부담이 크지 않아 감점이 거의 없어요.'}</p>`;
    const calcItem=`<details class="vev-item"><summary class="vev-summary">`+
        `<span class="vev-summary-name">계산 기준</span>`+
        `<span class="vev-summary-line">RISK 감점·데이터 시점</span>`+
        `<span class="vev-arrow">▾</span></summary>`+
        `<div class="vev-body">${riskBody}</div></details>`;
    // 바깥 #vevidence가 이미 class와 구분선을 갖고 있어 wrapper를 겹치지 않는다(2026-08-26).
    return `<div class="vsec-title">상세 분석 근거</div>${axesHTML}${dartContextHTML(stock.code)}${narrative}${calcItem}`;
  }
  function runChief(){
    sendToWork(2800,()=>{
      const v=decide(data,stock.code);
      // 1. Hero
      document.getElementById('vdot').style.background=v.color;
      const call=document.getElementById('vcall'); call.textContent=v.call; call.style.color=v.color;
      document.getElementById('vheroline').innerHTML=verdictHeadline(v,data);
      const tierBadge=v.tier==='auto'
        ? '<span class="tier-badge tier-auto" title="자동분석: 수집된 가격·재무·수급 지표를 정해진 규칙으로 해석한 결과예요. 개별 뉴스는 반영하지 않아요.">자동분석</span>'
        : (v.tier==='deep'?'<span class="tier-badge tier-deep" title="정밀분석: 가격·재무·수급과 함께 뉴스·공시까지 살펴본 결과예요.">정밀분석</span>':'');
      document.getElementById('vconf').innerHTML=
        `${stock.name}${stock.price?'('+stock.code+')':''}`+
        (stock.price?` · 현재가 ${won(stock.price)} (${SNAP_DATE})`:'')+
        (v.live?'<span class="live">LIVE</span>':' · mock')+tierBadge;
      const aof=analysisAsOf(stock.code);
      const fresh=freshnessHTML(stock.code, stock.price).replace(/^　·　/,'');
      document.getElementById('vasof').innerHTML=
        (stock.price?'<span>· 시세 기준 <b>'+priceAsOf()+'</b></span>':'')+
        '<span>· 분석 기준 <b>'+(aof||'현재 제공 데이터')+'</b></span>'+
        (fresh?'<span>'+cleanAnalysisCopy(fresh)+'</span>':'');
      // 2. 핵심 지표 요약
      document.getElementById('vmetrics').innerHTML=verdictMetricGridHTML(v,stock);
      // 3. 판단 이유 3가지
      document.getElementById('vreasons').innerHTML=verdictReasonsHTML(data,v);
      // 4. 긍정 요인 / 주의 요인
      document.getElementById('vfactors').innerHTML=verdictFactorsHTML(data,v);
      // 자동분석 안내 배너 (자동 티어일 때만)
      const va=document.getElementById('vauto');
      if(v.tier==='auto'){
        va.innerHTML='· <b>GAEO 자동 분석</b>: 기술·재무·확률·수급 지표를 규칙으로 해석한 결과예요. '
          +'QUANT는 지금과 비슷한 상태였던 과거 사례의 <b>실측 승률</b>을 계산하고, CHIEF는 분석가별 <b>실제 적중률에 비례한 가중치</b>로 합산해요. '
          +'개별 뉴스·공시는 반영되지 않아요. 뉴스·공시까지 살펴본 종목은 <b>정밀분석</b>으로 구분해 표시해요.';
        va.style.display='block';
      } else va.style.display='none';
      // 운영자 한마디 (관리자 모드에서 종목별로 작성)
      window.GAEO_CUR_CODE=stock.code;
      const vn=document.getElementById('vnote');
      const note=(window.gaeoNote&&gaeoNote(stock.code))||'';
      if(note){ vn.innerHTML='<div class="an-t">추가 메모</div>'+cleanAnalysisCopy(escNote(note)); vn.style.display='block'; }
      else vn.style.display='none';
      // 의견 갈림: 4인 점수 편차가 크면 평균만 믿지 말라고 경고
      const vc=document.getElementById('vclash');
      const cl=clashInfo(data);
      if(cl){
        vc.innerHTML=`· <b>의견 갈림</b>: 「${cl.hi.label}」 ${cl.hi.v}점 vs 「${cl.lo.label}」 ${cl.lo.v}점, `+
          `분석가들 점수가 <b>${cl.spread}점</b>이나 벌어졌어요. 보는 눈에 따라 해석이 크게 다른 종목이라 `+
          `주가가 어느 쪽으로든 크게 움직일 수 있어요: 평균 점수만 믿지 말고 한 번 더 신중하게 확인해 주세요.`;
        vc.style.display='block';
      } else vc.style.display='none';
      // 시장국면 배지: 변동성 확대 구간에서만 노출
      const vm=document.getElementById('vmacro');
      if(v.macroNote){ vm.innerHTML=cleanAnalysisCopy(v.macroNote); vm.style.display='block'; } else vm.style.display='none';
      // 5. 주요 가격 구간 (기술적 지지·저항 + 컨센서스 목표가)
      const vl=document.getElementById('vlevels');
      const lv=stock.price?levelsHTML(stock.code, stock.price, v.target):'';
      if(lv){ vl.innerHTML=cleanAnalysisCopy(lv); vl.style.display='block'; } else vl.style.display='none';
      // 6. 상세 분석 근거 (4축 findings + 종합 서술 원문 + 계산 기준, 아코디언)
      document.getElementById('vevidence').innerHTML=verdictEvidenceHTML(data,v,stock,cleanAnalysisCopy);
      // 7. 최근 판단 변화
      renderViz(data,stock.code,v); renderHistory(stock.code, stock.price);
      { const el=document.getElementById('verdictChecking'); if(el) el.style.display='none'; }
      // 📡 레이더가 이 종목에서 잡아낸 변화가 있으면 기존 분석 화면 아래에 카드로 덧붙인다
      try{ renderRadarDetail(stock.code); }catch(e){ console.warn('radar detail', e); }
      { const el=document.getElementById('radarChecking'); if(el) el.style.display='none'; }
      { const rp=document.getElementById('analysisPanelRadar'); if(rp) rp.classList.remove('checking'); }
      vEl.classList.add('on');
      if(window.__gaeoNoAutoScroll){
        // BUY 칩에서 넘어온 경우: viz 대신 시세 카드(종목명·현재가·지표·차트)로 이동.
        // html{scroll-behavior:smooth}가 걸려있어 즉시이동을 위해 잠깐 끈다.
        window.__gaeoNoAutoScroll=false;
        const q=document.getElementById('quote');
        if(q){ const de=document.documentElement, prev=de.style.scrollBehavior;
          de.style.scrollBehavior='auto';
          window.scrollTo(0, Math.max(0, window.scrollY + q.getBoundingClientRect().top - 8));
          de.style.scrollBehavior=prev; }
      } else {
        // 결과 탭은 어느 경우든 종합판단으로 맞춰 둔다(돌아왔을 때 바로 보이게).
        setAnalysisTab('verdict');
        // 기다리는 동안 사용자가 화면을 직접 움직였다면 보던 자리를 그대로 둔다.
        if(!userMovedView) document.getElementById('analysisDetails').scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
      }
      releaseViewGuard();
      SFX[v.call.toLowerCase()]();
      document.getElementById('run').disabled=false; running=false;
    });
  }
}
document.getElementById('run').onclick=analyze;

/* ── 한글 검색 자동완성 (이름·업종·사업내용으로 매칭) ──
   종목이 119개로 많아 직접 찾기 번거로우므로, 입력할 때마다 후보를 띄운다.
   단일분석 검색창과 종목비교의 A/B 검색창이 모두 이 함수를 공유한다. */
/* ── 한글 초성검색 (2026-08-16) ──
   'ㅅㅅㅈㅈ' → 삼성전자 처럼 초성만으로 종목을 찾는다. 외부 라이브러리 없이
   유니코드 분해만 사용. 영문자는 소리 나는 첫 자음으로 근사(SK → ㅅㅋ). */
const CHOSUNG_LIST=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const LATIN_CHOSUNG={B:'ㅂ',C:'ㅅ',D:'ㄷ',F:'ㅍ',G:'ㅈ',H:'ㅎ',J:'ㅈ',K:'ㅋ',L:'ㄹ',M:'ㅁ',
  N:'ㄴ',P:'ㅍ',Q:'ㅋ',R:'ㄹ',S:'ㅅ',T:'ㅌ',V:'ㅂ',X:'ㅅ',Z:'ㅈ',A:'ㅇ',E:'ㅇ',I:'ㅇ',O:'ㅇ',U:'ㅇ',W:'ㅇ',Y:'ㅇ'};
function chosungKey(text){
  let out='';
  for(const ch of String(text)){
    const cp=ch.codePointAt(0);
    if(cp>=0xAC00&&cp<=0xD7A3) out+=CHOSUNG_LIST[Math.floor((cp-0xAC00)/588)];
    else if(/[A-Za-z]/.test(ch)) out+=LATIN_CHOSUNG[ch.toUpperCase()]||'';
    else if(/[0-9]/.test(ch)) out+=ch;
  }
  return out;
}
const isChosungQuery=q=>/^[ㄱ-ㅎ]{2,}$/.test(q);
function makeAutocomplete(inp, box, opts){
  if(!inp||!box) return;
  opts=opts||{};
  if(!box.id) box.id=`${inp.id||'gaeo-search'}-listbox`;
  box.setAttribute('role','listbox');
  inp.setAttribute('role','combobox');
  inp.setAttribute('aria-autocomplete','list');
  inp.setAttribute('aria-controls',box.id);
  inp.setAttribute('aria-expanded','false');
  if(!inp.getAttribute('aria-label')&&!inp.getAttribute('aria-labelledby')){
    inp.setAttribute('aria-label',inp.placeholder||'종목 검색');
  }
  const closeList=()=>{
    box.classList.remove('on');
    inp.setAttribute('aria-expanded','false');
    inp.removeAttribute('aria-activedescendant');
  };
  // 검색 대상: tickers 순서대로(칩과 동일), 이름·코드·업종·사업소개를 키워드로
  const ALL=(typeof TICKERS!=='undefined'&&Array.isArray(TICKERS)?TICKERS:Object.keys(STOCKS).map(c=>({code:c})))
    .map(t=>{const s=STOCKS[t.code]||{}; return {
      code:t.code, name:s.name||t.name||t.code, sector:s.sector||t.sector||'',
      price:s.price, rate:s.rate, bio:bioOf(t.code, s.sector||t.sector||''),
      cho:chosungKey(s.name||t.name||'')};})
    .filter(x=>x.name);
  let sel=-1, cur=[];
  const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const hl=(text,q)=>{ if(!q) return esc(text); const i=text.toLowerCase().indexOf(q.toLowerCase());
    return i<0?esc(text):esc(text.slice(0,i))+'<span class="ac-mark">'+esc(text.slice(i,i+q.length))+'</span>'+esc(text.slice(i+q.length)); };
  function render(list,q){
    if(!list.length){ box.innerHTML='<div class="ac-empty" role="status">일치하는 종목이 없어요. 이름 일부만 입력해보세요.</div>'; box.classList.add('on'); inp.setAttribute('aria-expanded','true'); inp.removeAttribute('aria-activedescendant'); return; }
    box.innerHTML=list.map((x,i)=>{
      const pr=(typeof x.price==='number')?`<span class="ac-pr">${x.price.toLocaleString()} <span class="${x.rate>0?'up':'down'}">${x.rate>0?'+':''}${(x.rate||0).toFixed(1)}%</span></span>`:`<span class="ac-pr">시세 대기</span>`;
      return `<div class="ac-item${i===sel?' sel':''}" id="${box.id}-option-${i}" role="option" aria-selected="${i===sel?'true':'false'}" data-code="${x.code}" data-name="${esc(x.name)}">`+
        `<span class="ac-nm">${hl(x.name,q)}</span>`+
        (x.sector?`<span class="ac-sec">${esc(x.sector)}</span>`:'')+
        `<span class="ac-bio">${esc(x.bio||'')}</span>${pr}</div>`;
    }).join('');
    box.classList.add('on');
    inp.setAttribute('aria-expanded','true');
    if(sel>=0) inp.setAttribute('aria-activedescendant',`${box.id}-option-${sel}`);
    else inp.removeAttribute('aria-activedescendant');
  }
  function search(q){
    q=(q||'').trim();
    if(!q){ closeList(); cur=[]; return; }
    const ql=q.toLowerCase();
    // 우선순위: 이름 시작 > 이름 포함 > 업종/사업 포함. 초성만 입력하면 초성검색.
    const starts=[],incl=[],other=[];
    const cho=isChosungQuery(q)?q:null;
    ALL.forEach(x=>{
      const nm=x.name.toLowerCase();
      if(cho){
        if(x.cho.startsWith(cho)) starts.push(x);
        else if(x.cho.includes(cho)) incl.push(x);
        return;
      }
      if(nm.startsWith(ql)) starts.push(x);
      else if(nm.includes(ql)||x.code.includes(q)) incl.push(x);
      else if((x.sector&&x.sector.toLowerCase().includes(ql))||(x.bio&&x.bio.toLowerCase().includes(ql))) other.push(x);
    });
    cur=[...starts,...incl,...other].slice(0,14);
    sel=-1; render(cur,q);
  }
  function choose(x){
    if(!x) return;
    inp.value=x.name; closeList(); sel=-1;
    if(opts.onPick) opts.onPick(x);
  }
  inp.addEventListener('input',()=>search(inp.value));
  inp.addEventListener('focus',()=>{ if(inp.value.trim()&&cur.length){ box.classList.add('on'); inp.setAttribute('aria-expanded','true'); } });
  inp.addEventListener('keydown',e=>{
    if(!box.classList.contains('on')||!cur.length){ if(e.key==='Enter'&&opts.onEnter) opts.onEnter(); return; }
    if(e.key==='ArrowDown'){ e.preventDefault(); sel=(sel+1)%cur.length; render(cur,inp.value.trim()); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); sel=(sel-1+cur.length)%cur.length; render(cur,inp.value.trim()); }
    else if(e.key==='Enter'){ e.preventDefault(); if(sel>=0) choose(cur[sel]); else { closeList(); if(opts.onEnter) opts.onEnter(); } }
    else if(e.key==='Escape'){ closeList(); }
  });
  box.addEventListener('mousedown',e=>{   // mousedown: blur보다 먼저 처리
    const it=e.target.closest('.ac-item'); if(!it) return;
    e.preventDefault();
    choose(ALL.find(x=>x.code===it.dataset.code)||{name:it.dataset.name});
  });
  document.addEventListener('click',e=>{ if(!inp.parentElement.contains(e.target)) closeList(); });
}
makeAutocomplete(document.getElementById('ticker'), document.getElementById('acbox'), {
  onPick:x=>{ showQuote(resolveStock(x.name)); analyze(); },
  onEnter:()=>analyze()
});
const homeTicker=document.getElementById('homeTicker');
const homeSearchHelp=document.getElementById('homeSearchHelp');
function runHomeSearch(){
  const stock=resolveStock(homeTicker.value);
  if(!stock.price){
    homeSearchHelp.textContent='검색 결과에서 회사 이름을 선택해 주세요.';
    homeSearchHelp.setAttribute('role','alert');
    homeTicker.setAttribute('aria-invalid','true');
    homeTicker.setAttribute('aria-describedby','homeSearchHelp');
    homeTicker.focus();
    return;
  }
  homeSearchHelp.setAttribute('role','status');
  homeTicker.removeAttribute('aria-invalid');
  homeSearchHelp.textContent=`${stock.name} 분석으로 이동합니다.`;
  requestAnimationFrame(()=>jumpToStock(stock.name));
}
makeAutocomplete(homeTicker, document.getElementById('homeAcbox'), {
  onPick:x=>{
    homeSearchHelp.textContent=`${x.name} 분석으로 이동합니다.`;
    requestAnimationFrame(()=>jumpToStock(x.name));
  },
  onEnter:runHomeSearch
});
document.getElementById('homeRun').onclick=runHomeSearch;

/* ── 📖 가이드북: 주식 초보·어린이도 이 사이트를 바로 쓸 수 있게 하는 안내서 ──
   내용은 전부 여기 하드코딩(정적) — 열 때 1회만 그린다. */
let GUIDE_DONE=false;
function renderGuide(){
  if(GUIDE_DONE) return;
  GUIDE_DONE=true;
  const el=document.getElementById('guideView'); if(!el) return;
  const nStocks=(typeof TICKERS!=='undefined'&&TICKERS.length)||0;
  // 왕초보 기초 단어(화면 용어사전 GLOSSARY와 별도의 더 쉬운 말들)
  const BASIC={
    '주식':'회사를 아주 잘게 나눈 조각이에요. 한 조각(1주)을 사면 그 회사의 아주 작은 주인이 되는 거예요.',
    '종목':'주식시장에서 사고팔 수 있는 회사 하나하나를 부르는 말이에요. "삼성전자"도 하나의 종목이에요.',
    '코스피 / 코스닥':'우리나라 주식시장 두 곳의 이름이에요. 코스피엔 크고 오래된 회사가, 코스닥엔 성장 중인 회사가 많아요.',
    '주가':'주식 한 조각의 가격이에요. 사려는 사람이 많으면 오르고, 팔려는 사람이 많으면 내려요.',
    '종가':'그날 장이 끝났을 때(오후 3시 30분)의 마지막 가격이에요. "오늘 얼마로 마쳤나"예요.',
    '등락률(%)':'어제보다 얼마나 오르내렸는지를 %로 나타낸 거예요. 빨간색·▲는 오름, 파란색·▼는 내림이에요.',
    '매수 / 매도':'매수 = 사는 것, 매도 = 파는 것이에요.',
    '배당':'회사가 번 돈의 일부를 주인(주주)들에게 나눠주는 용돈 같은 거예요.',
    '외국인 / 기관':'주식시장의 큰손들이에요. 외국의 큰 투자회사(외국인), 우리나라의 은행·연금 같은 곳(기관)이 사고파는 방향은 중요한 힌트가 돼요.',
    '수급':'"누가 사고 누가 파는가"를 뜻하는 말이에요. 큰손들이 사 모으면 수급이 좋다고 해요.',
    '실적':'회사가 장사를 얼마나 잘했는지 성적표예요. 매출(판 돈)과 영업이익(남긴 돈)으로 봐요.',
    '목표주가':'증권사 전문가들이 "이 주식은 이 정도까지 갈 수 있다"고 적어낸 예상 가격이에요. 맞는다는 보장은 없어요!'
  };
  const dict=o=>Object.entries(o).map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('');
  const sign=(bg,fg,label,desc)=>`<div class="gb-sign"><span class="sg" style="background:${bg};color:${fg}">${label}</span><span>${desc}</span></div>`;
  el.innerHTML=`
  <div class="gb-hero">
    <h2>처음 와도 바로 쓰는 Gaeo 가이드북</h2>
    <p>GAEO는 코스피·코스닥에서 고른 <b>${nStocks}개 주요 종목</b>을 매일 같은 기준으로 분석하는
    한국 주식 리서치 서비스예요. 아래 순서대로 읽으시면 화면을 다 이해하실 수 있어요.
    점수는 정답이나 수익 보장이 아니라, 여러 자료를 같은 기준으로 비교하기 위한 참고값이에요.</p>
    <span class="gb-updated">2026년 8월 10일 업데이트 · 순환매 분석 시행</span>
    <div class="gb-agents">
      <div class="gb-agent"><b>TARO · 기술</b>차트와 가격 흐름을 봐요 (이동평균선·RSI·MACD·거래량)</div>
      <div class="gb-agent"><b>DIANA · 재무</b>회사의 재무와 기업가치를 봐요 (PER·PBR·ROE·목표주가)</div>
      <div class="gb-agent"><b>QUANT · 확률</b>과거에 비슷했던 상황의 실제 승률을 계산해요</div>
      <div class="gb-agent"><b>FLOW · 수급</b>외국인·기관이 사고 있는지 팔고 있는지 추적해요</div>
      <div class="gb-agent"><b>RISK · 위험</b>얼마나 험하게 출렁이는지 재요. 위험할 때만 점수와 확신도를 낮추는 안전장치예요</div>
      <div class="gb-agent"><b>ROTATION · 업종</b>시장 전체와 업종 흐름이 어디로 움직이는지 봐요</div>
      <div class="gb-agent"><b>CHIEF · 종합</b>위 정보를 모아 최종 판단을 정리해요</div>
    </div>
  </div>

  <details class="gb-sec">
    <summary><span class="gb-num">01</span><span class="gb-t">GAEO가 무엇인가요?<span class="gb-sub">3분이면 이해할 수 있어요</span></span></summary>
    <div class="gb-body">
      <p>GAEO는 <b>한국 주식 리서치 서비스</b>예요. 코스피와 코스닥에서 고른
      <b>${COVERAGE_TXT}</b>을 매일 <b>같은 기준</b>으로 살펴보고, 오늘 무엇이 달라졌는지
      쉬운 말로 알려드려요.</p>
      <p>제일 중요한 건 <b>같은 기준</b>이라는 부분이에요. 사람이 그날그날 기분으로 보면
      어제는 좋게, 오늘은 나쁘게 볼 수 있잖아요. GAEO는 정해진 계산식으로만 보기 때문에
      어제와 오늘을 그대로 비교할 수 있어요.</p>
      <p class="gb-warn">GAEO는 <b>참고용 리서치</b>예요. 수익을 보장하지 않고, 사라거나
      팔라고 권하지도 않아요. 마지막 결정은 언제나 본인이 하는 거예요.</p>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">02</span><span class="gb-t">데이터는 언제 업데이트되나요?<span class="gb-sub">화면의 기준 시각이 뜻하는 것</span></span></summary>
    <div class="gb-body">
      <table class="gb-table"><tbody>
        <tr><th>시세(현재가)</th><td>평일 장중 <b>10분마다</b></td></tr>
        <tr><th>자동분석</th><td>평일 장중 <b>30분마다</b></td></tr>
        <tr><th>공시(DART)</th><td>분석과 같은 주기로 새 공시만 확인</td></tr>
        <tr><th>성적 채점</th><td>5일·20일·60일이 실제로 지나야 채점돼요</td></tr>
      </tbody></table>
      <p>장이 열리는 시간은 평일 오전 9시부터 오후 3시 30분까지예요. 그래서
      <b>주말·공휴일·장 마감 뒤에는 숫자가 안 바뀌는 게 정상</b>이에요. 고장이 아니에요.</p>
      <p>화면에 적힌 <b>기준 시각</b>은 "언제 받은 자료로 계산한 결과인가"를 뜻해요.
      지금 이 순간 가격이 아니라, 그 시각의 가격으로 계산했다는 뜻이에요.</p>
      <p class="gb-note">수급(외국인·기관이 얼마나 샀는지)은 자료 특성상 <b>하루 늦게</b> 확정돼요.
      오늘 장중에는 어제까지의 수급이 보이는 게 정상이에요.</p>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">03</span><span class="gb-t">분석가들은 무엇을 하나요?<span class="gb-sub">일곱 가지 역할</span></span></summary>
    <div class="gb-body">
      <p><b>TARO · 기술적 분석가</b><br>
      종가가 <b>20일·60일 이동평균선</b> 위인지, <b>RSI(14)</b>가 과열·중립·과매도 중 어디인지,
      <b>MACD와 시그널선</b>의 방향, 최근 20일 평균 대비 <b>거래량 강도</b>를 봅니다.
      회사의 장기 가치보다 지금 주가의 추세와 타이밍을 판단하며, 강세·약세 의견은
      <b>5거래일 뒤 수익률이 ±1%를 넘었는지</b>로 평가합니다. 역할 기본비중은 <b>30%</b>입니다.</p>

      <p><b>DIANA · 재무·기본적 분석가</b><br>
      이익 대비 가격인 <b>PER</b>, 자산 대비 가격인 <b>PBR</b>, 자기자본 수익성인 <b>ROE</b>,
      주당이익인 <b>EPS</b>, 컨센서스 EPS로 계산한 <b>선행 PER</b>, 증권사 평균 목표주가와
      현재가의 차이, 같은 업종 안에서의 밸류에이션 순위를 봅니다. 단기 차트 타이밍보다
      기업의 중장기 가치와 가격 부담을 보는 역할이라 <b>20거래일 뒤 수익률</b>로 따로 평가합니다.
      수익률이 <b>±3% 이내면 애매한 움직임으로 평가를 보류</b>하고, 그 범위를 넘어 의견 방향과
      일치했는지를 적중·오답으로 기록합니다. CHIEF 역할 기본비중은 <b>12%</b>로 제한하고,
      여기에 작은 표본을 50% 쪽으로 완화한 <b>실제 장기 보정 적중률</b>을 곱해 최종 발언권을 계산합니다.</p>

      <p><b>QUANT · 확률·통계 분석가</b><br>
      RSI, 이동평균선 위치, 최근 가격 흐름처럼 현재와 비슷한 상태를 과거 ${COVERAGE_TXT} 기록에서 찾아
      <b>5거래일 뒤 실제로 오른 비율, 평균 수익률, 표본 수</b>를 계산합니다. 감이나 뉴스 해석이 아니라
      유사 사례의 실제 빈도를 점수로 사용하며, 의견 평가는 <b>5거래일·±1%</b> 기준입니다.
      역할 기본비중은 <b>28%</b>입니다.</p>

      <p><b>FLOW · 수급 분석가</b><br>
      최근 거래일의 <b>외국인·기관 순매수와 순매도</b>, 외국인 보유율 변화, 매수 지속일,
      외국인·기관 동반 매수·매도, 최근 수급의 가속도를 봅니다. 가격은 내리는데 큰손이 사는
      <b>매집형 괴리</b>, 가격은 오르는데 큰손이 파는 <b>분배형 괴리</b>도 함께 표시합니다.
      의견 평가는 <b>5거래일·±1%</b> 기준이며 역할 기본비중은 <b>30%</b>입니다.</p>

      <p><b>RISK · 위험 관리자</b><br>
      최근 20일 변동성, 3개월 최대 낙폭과 가격 범위를 이용해 저위험·중위험·고위험으로 구분합니다.
      RISK는 다섯 번째 매수·매도 의견이 아닙니다. <b>저위험이라고 점수를 올리지 않고</b>, 중위험이면
      확신도만 낮추며, 고위험이면 방향 원점수에서 <b>최대 7점</b>과 확신도 <b>10%p</b>를 낮추는
      단방향 안전장치입니다.</p>

      <p><b>CHIEF · 종합 의사결정</b><br>
      TARO·DIANA·QUANT·FLOW의 점수를 단순 평균하지 않습니다. 역할 기본비중
      <b>30%·12%·28%·30%</b>에 각 분석가의 표본 보정 적중률을 반영하고, 업종 표본이 충분하면
      업종별 성적도 전역 성적과 섞어 발언권을 조절합니다. 그 합산점수에 RISK 감점을 적용해
      최종 BUY·HOLD·SELL과 확신도를 냅니다. 작은 표본의 우연한 고득점이 바로 큰 발언권이 되지
      않도록 베이지안 보정을 사용하며, 역할별 현재 발언권은 성적표에서 확인할 수 있습니다.</p>

      <div class="gb-tip"><b>기간이 다른 이유</b>: TARO·QUANT·FLOW는 단기 흐름을 보는 역할이라 약 1주인
      5거래일 뒤를 확인합니다. DIANA의 재무·가치 판단은 가격에 반영되는 데 시간이 더 필요하므로
      약 한 달인 20거래일 뒤를 확인합니다. 서로 다른 역할을 같은 5일 잣대로 평가하면 DIANA가 구조적으로
      불리해지기 때문에 평가 기간과 보류 범위를 분리했습니다.</div>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">04</span><span class="gb-t">최종 판단은 어떻게 읽나요?<span class="gb-sub">화면 기호 읽는 법</span></span></summary>
    <div class="gb-body">
      ${sign('var(--color-positive-soft)','#126B4D','BUY','분석 기준에서 긍정 신호가 우세하다는 뜻이에요. 매수 추천은 아니에요.')}
      ${sign('var(--color-warning-soft)','#755B2E','HOLD','긍정과 부정 신호가 비슷해 방향을 단정하기 어렵다는 뜻이에요.')}
      ${sign('var(--color-negative-soft)','#B63D3D','SELL','분석 기준에서 부정 신호가 우세하다는 뜻이에요. 매도 추천은 아니에요.')}
      ${sign('var(--navy-soft)','var(--navy)','종합 점수','100점 만점. 63점 이상이면 BUY, 47~62점은 HOLD, 그 밑은 SELL이에요.')}
      ${sign('var(--sky-soft)','var(--navy)','판단 확신도 %','지금 판단이 얼마나 또렷한지예요. 낮으면 "잘 모르겠다"는 뜻이니 더 조심!')}
      ${sign('var(--ink)','var(--bg)','정밀분석','가격·재무·수급과 함께 뉴스와 공시까지 살펴본 분석이에요.')}
      ${sign('var(--navy-soft)','var(--t2)','자동분석','컴퓨터가 차트·재무·수급 숫자만 보고 규칙대로 계산한 분석이에요. 뉴스는 반영 안 돼 있어요.')}
      ${sign('#FBF7ED','#8A6D2F','의견 갈림','분석가들끼리 점수가 크게 엇갈렸다는 경고예요. 이런 종목은 평균 점수만 믿지 말고 한 번 더 생각!')}
      ${sign('#FBF7ED','#8A6D2F','RISK 등급','이 종목이 얼마나 험하게 움직이는지예요. 안정은 점수를 올리지 않고, 위험할 때만 방향 원점수에서 최대 7점과 확신도를 낮춰 성급한 판단을 막아요.')}
      ${sign('var(--navy-soft)','var(--navy)','시장국면','요즘 코스피가 얼마나 출렁이는지를 보고 "변동성 확대" 국면이면 팀의 확신도(%) 숫자를 자동으로 낮춰 보여줘요. BUY/HOLD/SELL 판단은 그대로고, 딱 "확신도"만 에누리하는 거예요 — 시장이 심하게 흔들릴 때 팀도 100% 확신하지 않는다는 걸 정직하게 보여주는 장치예요.')}
      ${sign('var(--navy-soft)','var(--navy)','가격 나침반','"어디까지 오를 수 있고(목표), 어디서 버티고(지지선), 어디를 깨지면 물러날지(손절)"를 숫자로 보여줘요.')}
      ${sign('var(--navy-soft)','var(--navy)','평가중','TARO·QUANT·FLOW와 팀 판단은 <b>5거래일 뒤</b>, 장기 재무를 보는 DIANA는 <b>20거래일 뒤</b> 종가로 채점해요. 각 역할의 기간이 아직 지나지 않은 판단이에요.')}
      ${sign('#059669','#fff','초록 꺾은선','왼쪽 종목 목록과 시세 카드에 있는 작은 그래프예요. <b>표시된 기간(최근 며칠)의 첫날보다 지금 주가가 높으면</b> 초록색이에요 = "그동안 올랐다".')}
      ${sign('#D5535D','#fff','빨강 꺾은선','같은 그래프가 빨간색이면 <b>그 기간 첫날보다 지금이 낮다</b> = "그동안 내렸다"는 뜻이에요.')}
      <div class="gb-tip"><b>헷갈리기 쉬운 점!</b> 이 꺾은선의 <b>색</b>은 <b>최근 며칠간의 흐름</b>을 보여주고,
      이름 옆에 붙은 빨강·파랑 <b>%</b> 숫자는 <b>어제 대비 오늘 하루</b> 변화예요. 둘은 기간이 달라요.
      그래서 "오늘 등락률은 파란색(하락)인데 꺾은선은 초록색"인 경우가 생겨요 — <b>오늘은 조금 빠졌어도, 최근 며칠 전체로 보면 아직 올라 있다</b>는 뜻이에요.
      (참고: 한국 증시는 오르면 빨강·내리면 파랑이지만, 이 <b>작은 꺾은선만은</b> 세계 공통 방식대로 오르면 초록·내리면 빨강으로 그려요.)</div>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">05</span><span class="gb-t">DART 공시는 어떻게 쓰나요?<span class="gb-sub">공식 공시일 뿐, 뉴스 전체가 아니에요</span></span></summary>
    <div class="gb-body">
      <p><b>DART</b>는 회사가 금융감독원에 <b>공식적으로 제출한 서류</b>를 모아둔 곳이에요.
      실적발표, 배당 결정, 유상증자 같은 것들이요. 회사가 직접 신고한 자료라서
      소문이나 추측과 달리 <b>사실로 확인된 정보</b>예요.</p>
      <p>GAEO는 이 공시를 <b>참고 정보로만</b> 씁니다. 화면에 "이런 공시가 있었어요"라고
      알려드리는 역할이에요.</p>
      <p class="gb-warn"><b>지금 DART는 점수를 바꾸지 않아요.</b> "공시가 나왔으니 매수 점수 +10점"
      같은 식으로 계산에 넣지 않습니다. 공시 하나가 주가에 어떻게 작용하는지는 아직
      충분히 검증하지 못했기 때문이에요. 검증되기 전에 점수에 넣으면 근거 없는 숫자가 돼요.</p>
      <p>꼭 기억해 주세요:</p>
      <ul class="gb-list">
        <li><b>공시가 없다 ≠ 뉴스가 없다.</b> 신문 기사, 증권사 리포트, 업계 소문은 DART에 안 올라와요.</li>
        <li><b>공시가 없다 ≠ 나쁜 일이 없다.</b> 아직 신고 의무가 생기지 않았을 수도 있어요.</li>
        <li>수집이 덜 됐을 땐 "공시 없음"이라고 하지 않고 <b>"공시 확인 중"</b>이라고 표시해요.</li>
      </ul>
    </div>
  </details>

  <details class="gb-sec gb-rotation-guide" id="gb-sec-rotation" open>
    <summary><span class="gb-num">06</span><span class="gb-t">순환매와 업종 흐름은 무엇인가요?<span class="gb-sub">2026년 8월 10일 시행</span></span></summary>
    <div class="gb-body">
      <p><b>순환매란 무엇인가요?</b><br>
      시장의 돈이 한 업종에만 머물지 않고 반도체에서 바이오, 바이오에서 방산처럼 다른 업종으로 옮겨 가는 흐름을 말해요.
      Gaeo 순환매는 추적 종목 600개를 24개 업종으로 묶고, 상승 탄력·시장 대비 강도·거래량·상승 종목 비율·기술 신호를 같은 기준으로 계산해 <b>지금 어느 업종에 힘이 상대적으로 모이는지</b> 보여줍니다.</p>

      <div class="gb-tip"><b>먼저 기억할 점:</b> 순환매는 <b>예측 화면이 아닙니다.</b> 점수는 오를 확률이나 예상 수익률이 아니라 현재 관찰값을 비교하기 위한 상대 점수예요. 후보 종목도 <b>매수·매도 추천이 아닙니다.</b></div>

      <p><b>기간 버튼은 이렇게 나눠 보세요.</b></p>
      <div class="gb-rotation-grid">
        <div class="gb-rotation-card"><b>1일·3일·5일·20일</b>최근 힘이 어디로 이동했는지 보는 핵심 관찰 기간이에요. 짧을수록 당일 움직임에 민감하고, 20일은 한 달 안팎의 흐름을 더 차분하게 보여줘요.</div>
        <div class="gb-rotation-card"><b>60일·120일·200일</b>장기 추세 참고 기간이에요. 단기 지도와 순위에 모두 섞지 않고, 선택한 업종의 상세 화면에서 큰 흐름이 단기 신호와 같은 방향인지 확인할 때 사용해요.</div>
      </div>

      <p><b>화면은 아래 순서로 읽으면 쉬워요.</b></p>
      <ol class="gb-read-order">
        <li><b>상단 요약:</b> 현재 1위 업종, 다음 관찰 후보, 시장 국면을 먼저 확인해요.</li>
        <li><b>업종 순환 지도:</b> 원의 위치와 색으로 업종의 상대 강도를 봐요. 모던한 블루는 강한 흐름, 회색은 관찰, 레드는 약한 흐름이에요. 원이 크다고 무조건 더 오르는 것은 아니며 업종별 표본과 점수를 함께 봐야 해요.</li>
        <li><b>5거래일 업종 순위:</b> 한 번의 급등이 아니라 최근 며칠간 힘이 이어졌는지 비교해요. 지도와 순위가 같은 업종을 가리키는지 확인하면 단기 노이즈를 줄일 수 있어요.</li>
        <li><b>업종 상세:</b> 업종을 누르면 시장 대비 강도, 거래량 흐름, 상승 종목 비율, 기술 신호, 선행 흐름을 볼 수 있어요. 물음표에 마우스를 올리거나 키보드로 초점을 맞추면 각 항목 설명이 나타나요.</li>
        <li><b>선행 흐름과 과거 유사 국면:</b> 데이터가 충분할 때만 표시되는 보조 자료예요. 과거에 비슷했던 장면을 참고하되, 당시 결과가 이번에도 반복된다고 단정하지 마세요.</li>
      </ol>

      <p><b>‘축적 중’은 오류가 아니에요.</b><br>
      순환매 시행 뒤 거래일별 업종 점수와 다음 기간의 실제 움직임을 쌓는 단계예요. 1·3·5·20거래일 결과는 각 기간이 지나야 채점할 수 있고, 60·120·200일은 장기 관찰 기간만큼 더 오래 걸려요. 화면 하단의 예상 기간과 현재 표본 수를 함께 확인하세요.</p>

      <div class="gb-tip"><b>실전 활용 예시:</b> ① 새로고침 → ② 시장 국면 확인 → ③ 지도와 5거래일 순위에서 공통으로 강한 업종 찾기 → ④ 업종 상세의 구성 항목과 표본 확인 → ⑤ 후보 종목을 종목 분석에서 다시 검색해 가격·재무·수급 근거 확인. 어느 한 화면만 보고 결정하지 않는 것이 핵심이에요.</div>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">07</span><span class="gb-t">성적표는 어떻게 보나요?<span class="gb-sub">맞았는지 틀렸는지 숨기지 않아요</span></span></summary>
    <div class="gb-body">
      <p>GAEO는 과거에 내린 판단이 실제로 맞았는지 계속 채점해서 공개해요.</p>
      <table class="gb-table"><tbody>
        <tr><th>적중</th><td>매수라고 했는데 올랐거나, 매도라고 했는데 내린 경우</td></tr>
        <tr><th>빗나감</th><td>반대로 간 경우</td></tr>
        <tr><th>보유(HOLD)</th><td>크게 움직이지 않았으면 맞은 것으로 봐요</td></tr>
        <tr><th>시장 대비</th><td>그날 전체 종목의 중간값을 뺀 값. 시장이 통째로 오른 덕은 빼고
          <b>종목을 잘 골랐는지</b>만 남긴 숫자예요</td></tr>
        <tr><th>5일 / 20일 / 60일</th><td>판단한 날부터 며칠 뒤 결과로 채점했는지</td></tr>
        <tr><th>평가 대기</th><td>아직 그만큼 시간이 안 지난 판단이에요</td></tr>
      </tbody></table>
      <p class="gb-note">아직 결과가 안 나온 판단은 <b>0%가 아니라 "평가 대기"</b>예요.
      맞히지 못했다는 뜻이 전혀 아니에요. 시간이 더 필요할 뿐이에요.</p>
      <p>종목 수가 500개에서 600개로 늘어난 것처럼 <b>분석 대상이 바뀐 시기</b>가 있어요.
      성적을 볼 때 그 시기가 섞이지 않도록 구간을 나눠서 보여드려요. 모델이 좋아진 건지
      종목이 바뀐 건지 헷갈리지 않게 하려는 거예요.</p>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">07-1</span><span class="gb-t">QUANT는 확률을 어떻게 계산하나요?<span class="gb-sub">자가 학습 가중치</span></span></summary>
    <div class="gb-body">
      <b>QUANT(확률·통계 분석가)는 뭘 하나요?</b><br>
      "지금 이 종목이 RSI 42에 20일선 아래, 최근 5일 횡보" 같은 <b>현재 상태</b>를 보고,
      개오가 매일 모아온 ${COVERAGE_TXT} 일봉 기록에서 <b>과거에 이것과 비슷한 상태였던 사례</b>를 전부 찾아요.
      그리고 그 사례들이 <b>5거래일 뒤 실제로 올랐는지 내렸는지를 세서 승률</b>로 알려줘요.
      예: "비슷한 상태 1,469건 중 450건이 올랐다 → 이 비율(31%)이 경험적 승률". 누군가의 감이 아니라
      <b>실제로 일어났던 일의 빈도</b>라서 정직하고, 카드에 표본 수까지 같이 적어줘요.<br>
      카드엔 <b>평균 수익률</b>도 함께 나오는데, 이건 승률과는 다른 숫자예요 — 오른 경우·내린 경우를
      <b>전부 합쳐서</b> 평균 낸 값이라, 승률이 높아도 어쩌다 크게 내린 사례가 있으면 평균은 마이너스로 나올 수 있어요.<br><br>
      <b>예전 NOVA(뉴스·심리)는 어디 갔나요?</b><br>
      자동분석의 NOVA는 사실 뉴스를 못 읽고 가격 흐름으로 분위기를 "추정"만 했어요.
      그래서 2026년 7월 21일부터 그 자리를 <b>실측 통계를 내는 QUANT</b>로 바꿨어요.
      진짜 뉴스를 읽는 분석은 정밀분석과 뉴스분석 탭에서 계속 볼 수 있어요.<br><br>
      <b>자가 학습 가중치는 뭔가요?</b><br>
      CHIEF는 네 분석가(기술·재무·확률·수급)의 점수를 합쳐 최종 판단을 내리는데,
      네 명을 같은 기간과 같은 비중으로 보지 않아요. TARO·QUANT·FLOW는 5거래일, DIANA는
      20거래일 뒤 결과로 채점합니다. <b>역할 기본비중과 표본수를 보정한 적중률</b>을 함께 사용해
      우연히 몇 번 맞힌 분석가가 과도한 발언권을 갖지 않게 했어요. 업종별 성적도 전역 성적과
      부드럽게 섞어 표본이 작은 업종의 과적합을 줄였어요. 가중치는 매 분석 사이클마다 자동으로 다시 계산되고,
      성적표에서 지금 누가 몇 %의 가중치를 받는지 볼 수 있어요.<br><br>
      <div class="gb-tip">즉, 개오팀은 이제 <b>자기 성적표를 보고 스스로 배우는 팀</b>이에요.
      잘 맞히면 발언권이 커지고, 자꾸 틀리면 발언권이 줄어요. 다만 모든 통계가 그렇듯
      과거가 미래를 보장하진 않아요 — 참고용으로 봐주세요!</div><br>
      <b>성적표를 읽는 세 가지 눈 (2026년 8월 14일 개편)</b><br>
      예전 성적표는 적중률을 <b>하나의 숫자</b>로만 보여줬어요. 그런데 그 숫자에는 두 가지 문제가 있었어요.
      ① HOLD는 주가가 ±5%를 벗어나 크게 움직여도 「빗나감」으로 안 세고 그냥 빼버려서 HOLD 적중률이 항상 100%로 나왔고,
      ② 오르든 내리든 <b>주가의 절대 방향</b>만 봤기 때문에, 시장이 통째로 오른 주에는 BUY가, 내린 주에는 SELL이 자동으로 맞는 것처럼 보였어요.
      그래서 「종목을 잘 골랐는지」가 아니라 「시장이 어디로 갔는지」를 재고 있었던 거예요.<br><br>
      이제 성적표에 표 두 개를 추가해 이걸 있는 그대로 보여줍니다.<br>
      ${sign('var(--sky-soft)','var(--navy)','판단 종류별 성적','BUY·HOLD·SELL을 <b>합치지 않고 따로</b> 보여줘요. 합친 숫자는 어느 판단이 잘 맞고 어느 판단이 망가졌는지를 가려버리기 때문이에요. HOLD도 ±5%를 벗어나면 정직하게 빗나감으로 셉니다.')}
      ${sign('var(--sky-soft)','var(--navy)','시장 대비','그날 분석 종목 전체의 수익률 <b>중앙값을 뺀</b> 값이에요. 시장이 통째로 움직인 효과를 걷어내서 「시장보다 잘 골랐나」만 남긴 진짜 종목 선별력이에요. 50%면 「시장 흐름을 빼면 동전 던지기와 같다」는 뜻이라, 이 숫자가 절대 적중률보다 낮게 나오는 게 정상이에요.')}
      ${sign('var(--sky-soft)','var(--navy)','판단 확신도 구간별(BUY·SELL 분리)','판단 확신도가 높다고 표시한 판단만 골라서 다시 채점한 표예요. BUY와 SELL을 나눠서 보여드려요.')}
      <div class="gb-tip"><b>여기서 제일 중요한 것! (2026년 8월 14일 다시 확인)</b> 개오팀은 분석 종목 전부를 잘 맞히지는 못해요.
      전체 BUY·SELL 판단의 시장 대비 적중률은 동전 던지기와 크게 다르지 않아요.
      <b>판단 확신도가 높을수록 성적이 좋아지는 건 SELL 판단에서만 뚜렷해요.</b> 예전엔 BUY·SELL을 합쳐서 보여드려서
      이 개선이 전체에 고르게 적용되는 것처럼 보였는데, 다시 확인해 보니 BUY 판단은 확신도가 높아져도 성적이
      뚜렷이 좋아지지 않았어요. 그래서 지금 확신도 계산 방식(분석가 4인의 의견이 얼마나 가까운지만 재는 식)을
      「이 점수대 판단이 실제로 몇 % 맞았는가」로 바꾸는 후보를 만들어 검증 중이에요(바로 아래 「확신도 공식 재검증」 표).
      아직 검증 기준(최소 40거래일 데이터)을 못 채워서 화면 확신도는 그대로예요. 기준을 채우면 「검토 가능」 상태가 되고, 실제 적용은 사람이 확인하고 승인해야 바뀝니다.
      불편한 숫자도 가리지 않고 그대로 보여드리는 게 이 성적표의 목적이에요.</div><br>
      <b>확신도 공식 재검증은 뭔가요?</b><br>
      지금 화면의 판단 확신도는 「분석가 4인의 점수가 서로 얼마나 가까운가」만 재는 식이에요. 이걸 「이 점수대 판단이
      과거에 실제로 몇 % 맞았는가」로 바꾸는 대안을 만들어서, 계산에 전혀 쓰지 않은 구간(검증 구간)에서 어느 쪽이
      적중 여부를 더 잘 가르는지 매 분석 주기 확인해요. 검증 거래일 40일 이상, BUY·SELL 각각 50건 이상, 그리고
      새 방식이 기존보다 실제로 더 잘 가른다는 근거가 쌓이고 사람이 승인해야만 화면에 반영돼요.
      아직은 데이터가 부족해서(수십 거래일치) 어느 쪽이 더 나은지 확신 있게 말하기 이릅니다. 그래서 성급하게 바꾸지 않고 계속 지켜보고 있어요.<br><br>
      <b>순환매 검증 기록은 뭔가요?</b><br>
      업종끼리 자금이 옮겨 다니는 흐름(순환매)을 읽는 기능인데, 아직 <b>개별 종목의 BUY·HOLD·SELL 판단에는 전혀 반영하지 않아요</b>.
      성적만 공개로 쌓아두고, 기록이 30거래일 이상 모이고 성적이 기준을 넘길 때만 실제 판단 반영을 검토합니다.
      검증되지 않은 기능을 조용히 실전에 넣지 않겠다는 원칙이에요. 실제로 「종합판단 v3」 실험은 이 기준을 통과하지 못해 서비스 반영 없이 종료됐어요.</div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">08</span><span class="gb-t">모델 실험실은 무엇인가요?<span class="gb-sub">화면 뒤에서 조용히 시험만 하는 모델들</span></span></summary>
    <div class="gb-body">
      <p>GAEO는 지금 쓰는 계산 방식 말고도, <b>더 나은 방식이 있는지 뒤에서 시험</b>하고 있어요.
      시험 중인 모델은 화면에 나오는 판단을 바꾸지 않아요.</p>
      <table class="gb-table"><tbody>
        <tr><th>기본모델 개선판</th><td><b>실제 서비스</b>. 지금 화면에서 보고 계신 판단이에요</td></tr>
        <tr><th>연구모델 A</th><td>뒤에서 시험만 해요. 계산식을 더 이상 바꾸지 않고 고정해 뒀어요</td></tr>
        <tr><th>연구모델 B</th><td>A와 다른 방식으로 시험 중이에요. 역시 고정</td></tr>
        <tr><th>연구모델 C</th><td>공시(DART)를 함께 보는 차세대 시험판이에요</td></tr>
        <tr><th>구형 그림자모델</th><td>시험해 봤는데 성적이 안 좋아서 <b>중단</b>했어요.
          왜 실패했는지 공부하려고 기록만 남겨 뒀어요</td></tr>
      </tbody></table>
      <p class="gb-warn"><b>시험 성적이 좋게 나와도 실제 서비스가 자동으로 바뀌지 않아요.</b>
      프로그램이 스스로 "이게 더 좋으니 바꿔야지" 하고 갈아타는 길은 아예 막아 뒀어요.
      사람이 결과를 직접 확인하고 승인해야만 바뀝니다.</p>
      <p class="gb-note">왜 이렇게까지 하냐면요, 시험 성적이 좋아 보이는 건 <b>우연일 때가 많기 때문</b>이에요.
      여러 방식을 동시에 시험하면 그중 하나는 운으로 잘 나오거든요. 그걸 실력으로 착각해서
      실제 서비스를 바꾸면, 정작 앞으로는 더 못 맞히게 돼요.</p>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">09</span><span class="gb-t">판단 확신도와 정확도는 어떻게 다른가요?<span class="gb-sub">비슷해 보이지만 완전히 다른 말이에요</span></span></summary>
    <div class="gb-body">
      <table class="gb-table"><tbody>
        <tr><th>정확도</th><td><b>과거 성적</b>이에요. 지금까지 내린 판단이 실제로 얼마나 맞았는지</td></tr>
        <tr><th>판단 확신도</th><td><b>이번 판단의 근거가 얼마나 갖춰졌는지</b>예요.
          자료가 다 모였고 분석 축들이 서로 비슷한 얘기를 하면 높아져요</td></tr>
      </tbody></table>
      <p>쉽게 비유하면, 정확도는 <b>지금까지 받아온 성적표</b>이고
      판단 확신도는 <b>이번 시험을 얼마나 준비하고 봤는가</b>예요.
      종목 화면에서는 이 과거 기록 쪽을 <b>「신뢰도」</b>라고 표시해요 —
      같은 판단 방식이 실제 5거래일 검증에서 쌓아온 성적이라는 뜻이에요.</p>
      <p class="gb-warn">판단 확신도가 높다고 해서 이번에 맞는다는 뜻이 <b>아니에요.</b>
      근거가 충분했다는 뜻일 뿐이에요. 준비를 잘해도 시험을 망칠 수 있는 것처럼요.</p>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">10</span><span class="gb-t">데이터가 부족하면 어떻게 되나요?<span class="gb-sub">모르면 모른다고 말해요</span></span></summary>
    <div class="gb-body">
      <p>자료가 부족할 때 억지로 "보유"라고 답하지 않아요. 그건 아는 척이니까요.
      대신 이런 표시가 나와요.</p>
      <table class="gb-table"><tbody>
        <tr><th>판단 보류</th><td>판단에 필요한 분석 축이 부족해요. 자료가 모이면 다시 판단해요</td></tr>
        <tr><th>시세 지연</th><td>가격 자료가 최신이 아니에요</td></tr>
        <tr><th>데이터 미제공</th><td>그 항목은 원래 제공되지 않는 종목이에요</td></tr>
        <tr><th>분석 준비 중</th><td>새로 추가된 종목이라 아직 자료를 모으는 중이에요</td></tr>
        <tr><th>공시 확인 중</th><td>공시 수집이 끝나지 않았어요</td></tr>
      </tbody></table>
      <p class="gb-note">이런 표시가 뜬다고 나쁜 신호는 아니에요. <b>모르는 걸 아는 척하지 않는 것</b>이
      더 정직하다고 보기 때문에 일부러 이렇게 만들었어요.</p>
    </div>
  </details>

  <details class="gb-sec" open>
    <summary><span class="gb-num">11</span><span class="gb-t">실제로 이 순서대로 써보세요</span></summary>
    <div class="gb-body">
      <div class="gb-step"><span class="gb-no">1</span><span><b>상단의 새로고침을 먼저 눌러요.</b> 주가는 장중 약 10분마다, 자동 분석은 약 30분마다 갱신돼요. 정적 사이트이므로 새 자료가 생겨도 열어 둔 화면은 자동으로 바뀌지 않을 수 있어요.</span></div>
      <div class="gb-step"><span class="gb-no">2</span><span><b>홈에서 ‘현재 기준 브리핑’을 확인해요.</b> 코스피·코스닥과 시장 전체 분위기를 먼저 보면 개별 종목의 움직임을 더 정확한 맥락에서 읽을 수 있어요.</span></div>
      <div class="gb-step"><span class="gb-no">3</span><span><b>궁금한 회사나 업종을 검색해요.</b> 회사 이름 일부나 ‘반도체’, ‘게임’ 같은 업종을 입력한 뒤 <b>분석 보기</b>를 누르세요.</span></div>
      <div class="gb-step"><span class="gb-no">4</span><span><b>가격보다 근거를 먼저 읽어요.</b> 분석가별 근거 → 종합 판단 → 리더 변화 → 정밀분석 기록 순서로 보면 서로 다른 신호가 왜 같은 결론 또는 다른 결론을 내는지 확인할 수 있어요.</span></div>
      <div class="gb-step"><span class="gb-no">5</span><span><b>시장 메뉴를 목적에 맞게 활용해요.</b> 자금이 몰리는 업종은 <b>순환매</b>, 과거 판단 결과는 <b>성적표</b>, 요일별 통계는 <b>등락률 확인</b>에서 확인하세요. 점선 밑줄이 있는 용어는 누르면 쉬운 설명이 열려요.</span></div>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">11-1</span><span class="gb-t">메뉴별로 언제 사용하면 되나요?</span></summary>
    <div class="gb-body">
      <b>홈</b> · 오늘 시장의 핵심 변화와 코스피·코스닥 흐름부터 빠르게 확인할 때 사용해요.<br>
      <b>오늘 시장</b> · 지수, 상승·하락 종목 수, 시장 분석 등 전체 분위기를 자세히 볼 때 사용해요.<br>
      <b>순환매</b> · 24개 업종 가운데 현재 상대적으로 힘이 모이는 곳과 다음 관찰 후보를 비교할 때 사용해요.<br>
      <b>종목 분석</b> · 한 종목의 가격·기술·재무·확률·수급·위험 근거를 자세히 확인할 때 사용해요.<br>
      <b>뉴스분석</b> · 시장을 움직인 주요 소식의 배경과 투자자가 확인할 점을 쉬운 말로 읽을 때 사용해요.<br>
      <b>주식공부</b> · 주식 기초를 주제별로 배우고 싶을 때 사용해요. 종목공부·부동산공부는 전체 메뉴에 있어요.<br>
      <b>계산기</b> · 손익분기, 공모주 증거금, 전세와 월세 비교처럼 내 숫자를 직접 넣어 계산할 때 사용해요.<br>
      <b>성적표</b> · 과거 판단을 실제 결과로 채점한 기록과 분석가별 적중률을 확인할 때 사용해요.<br>
      <b>캘린더</b> · 실적 발표 같은 주요 일정과 날짜별 분석 기록을 확인할 때 사용해요.<br>
      <b>등락률 확인</b> · 요일별 평균 등락률과 시가총액 상위 종목을 펼친 상태로 살펴볼 때 사용해요.<br>
      <b>전체 메뉴</b> · 화면에 바로 보이지 않는 세부 기능을 한곳에서 찾을 때 사용해요.
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">11-2</span><span class="gb-t">GAEO 레이더는 무엇을 찾아주나요?</span></summary>
    <div class="gb-body">
      <b>GAEO 레이더는 뭘 하나요?</b><br>
      ${COVERAGE_TXT}의 차트를 매일 자동으로 훑어서, <b>"어제와 비교해 오늘 새로 생긴 기술적 변화"</b>만 골라 보여주는
      규칙 기반 탐지기예요. BUY·HOLD·SELL 같은 투자 판단을 내리지는 않아요, 그건 여전히 TARO·DIANA·QUANT·FLOW·CHIEF
      네 방향 분석가와 RISK 안전장치의 몫이에요. 레이더는 그냥 <b>"오늘 볼 만한 종목을 먼저 추려주는 안내판"</b>이라고 생각하면 돼요.<br><br>
      <b>어디서 볼 수 있어요?</b><br>
      홈 화면에 있는 GAEO 레이더 카드에서 오늘 포착된 변화를 종목별로 모아 볼 수 있고, 개별 종목 분석 화면에서도
      "이 종목, 레이더에 뭐가 잡혔지?"를 CHIEF의 종합 판단 바로 아래에서 확인할 수 있어요.<br><br>
      <b>어떤 변화를 잡아내나요?</b><br>
      주로 보는 신호는 이렇게 9가지예요.
      <ul style="margin:8px 0 8px 18px;padding:0;line-height:1.7">
        <li><b>RSI 과매도 진입·탈출</b>: RSI가 30 아래로 내려가거나(매도 압력 강해짐), 다시 30 위로 올라오는(과매도 벗어남) 순간</li>
        <li><b>RSI 과매수 진입·탈출</b>: RSI가 70을 넘어가거나(매수세 몰림), 다시 70 아래로 내려오는 순간</li>
        <li><b>볼린저밴드 하단 이탈·재진입</b>: 종가가 평소 범위(밴드) 아래로 벗어나거나, 다시 범위 안으로 돌아오는 순간</li>
        <li><b>볼린저밴드 상단 돌파·재진입</b>: 종가가 평소 범위 위로 튀어 오르거나, 다시 범위 안으로 내려오는 순간</li>
        <li><b>거래량 급증</b>: 거래량이 최근 20일 평균의 2배를 넘어설 때</li>
      </ul>
      여기에 더해 참고용으로 <b>MACD 골든크로스·데드크로스</b>, <b>MA20·60 골든크로스·데드크로스</b> 같은 이동평균 교차 신호도
      "그 외 신호"로 함께 모아둬요.<br><br>
      <b>신호 카드는 어떻게 읽어요?</b><br>
      "RSI 32 → 29.7" 처럼 이전 값에서 지금 값으로 어떻게 바뀌었는지, 그리고 몇 월 며칠 기준인지가 함께 표시돼요.
      화면 위쪽에는 이 데이터가 "장중 잠정 신호"인지 "종가 확정 신호"인지도 알려주는데, 잠정 신호는 장이 끝나면
      숫자가 다시 바뀔 수 있으니 참고만 해주세요.<br><br>
      <div class="gb-tip"><b>꼭 기억하세요!</b> 레이더에 잡혔다고 무조건 사거나 팔아야 한다는 뜻이 아니에요.
      예를 들어 "과매도 진입"은 매도 압력이 강해졌다는 뜻일 뿐, 곧바로 반등한다는 보장은 없어요.
      "밴드 돌파"나 "골든크로스" 같은 교차 신호도 나중에 다시 뒤집히는 경우가 흔해요.
      레이더는 어디까지나 <b>"오늘 뭐가 달라졌는지 빨리 발견하는 도구"</b>이고, 실제 판단은 항상 5인 분석가의
      점수와 근거를 함께 확인한 뒤에 내려주세요.</div>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">12</span><span class="gb-t">꼭 알아두실 점<span class="gb-sub"></span></span></summary>
    <div class="gb-body">
      <p class="gb-warn"><b>GAEO는 참고용 리서치 서비스예요.</b></p>
      <ul class="gb-list">
        <li>수익을 <b>보장하지 않아요.</b></li>
        <li>특정 종목을 사라거나 팔라고 <b>권유하지 않아요.</b></li>
        <li>화면의 점수와 판단은 정답이 아니라, 여러 자료를 같은 기준으로 비교하려고 만든
          <b>참고값</b>이에요.</li>
        <li>과거에 잘 맞았다고 앞으로도 맞는다는 뜻은 <b>아니에요.</b></li>
        <li><b>최종 판단과 책임은 투자하시는 본인에게 있어요.</b></li>
      </ul>
      <p>그래서 GAEO는 성적을 좋아 보이게 꾸미지 않고, 틀린 것도 그대로 보여드려요.
      맞은 것만 보여주는 서비스는 판단에 도움이 되지 않으니까요.</p>
    </div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">부록</span><span class="gb-t">왕초보 단어장</span></summary>
    <div class="gb-body"><dl class="gb-dict">${dict(BASIC)}</dl></div>
  </details>

  <details class="gb-sec">
    <summary><span class="gb-num">부록</span><span class="gb-t">분석 단어장<span class="gb-sub">화면에서 점선 단어를 눌러도 나와요</span></span></summary>
    <div class="gb-body"><dl class="gb-dict">${dict(GLOSSARY)}</dl></div>
  </details>

  <div class="gb-warn"><b>마지막 확인:</b> 이 사이트의 점수·판단·순위·후보는 모두 <b>공부와 참고용</b>이에요.
  실제 결과는 성적표에서 확인할 수 있고, 과거 적중률도 미래 수익을 보장하지 않아요.
  가격·재무·수급·시장 상황을 함께 확인한 뒤 자신의 기준으로 결정하세요. 어떤 내용도 특정 종목의 매수·매도를 권유하지 않습니다.</div>
  <div id="guideCompleteMarker" aria-hidden="true" style="height:1px"></div>`;
  el.querySelectorAll('.gb-table').forEach((table,index)=>{
    const caption=document.createElement('caption');
    caption.className='sr-only';
    caption.textContent=(table.closest('details')?.querySelector('.gb-t')?.textContent||`이용 안내 ${index+1}`)+' 표';
    table.prepend(caption);
    table.querySelectorAll('th').forEach(th=>th.setAttribute('scope','row'));
  });
  watchGuideCompletion();
}

/* 가이드 이용 흐름 측정: 진입(tutorial_begin)과 맨 아래 도달(tutorial_complete)을 분리한다.
   같은 가이드 화면 안에서는 중복 전송하지 않고, 나갔다가 다시 들어오면 새 이용 흐름으로 본다. */
const GUIDE_TUTORIAL={active:false,startedAt:0,source:'navigation',observer:null};
function beginGuideTutorial(source){
  if(GUIDE_TUTORIAL.active) return;
  GUIDE_TUTORIAL.active=true;
  GUIDE_TUTORIAL.startedAt=Date.now();
  GUIDE_TUTORIAL.source=source||'navigation';
  gaeoTrack('tutorial_begin',{
    tutorial_name:'3분 가이드',
    tutorial_source:GUIDE_TUTORIAL.source
  });
}
function watchGuideCompletion(){
  const marker=document.getElementById('guideCompleteMarker');
  if(!marker||GUIDE_TUTORIAL.observer||typeof IntersectionObserver==='undefined') return;
  GUIDE_TUTORIAL.observer=new IntersectionObserver(entries=>{
    if(!GUIDE_TUTORIAL.active||!entries.some(entry=>entry.isIntersecting)) return;
    const seconds=Math.max(1,Math.round((Date.now()-GUIDE_TUTORIAL.startedAt)/1000));
    gaeoTrack('tutorial_complete',{
      tutorial_name:'3분 가이드',
      tutorial_source:GUIDE_TUTORIAL.source,
      engagement_time_sec:seconds
    });
    GUIDE_TUTORIAL.active=false;
  },{threshold:.8});
  GUIDE_TUTORIAL.observer.observe(marker);
}
function endGuideTutorial(){
  GUIDE_TUTORIAL.active=false;
}

// 종목 칩: 업종 폴더(누르면 열림) 안에 이름 + 현재 주가 + 등락률
(function(){
  const wrap=document.getElementById('chips');
  const groups=[], byName={};
  // tickers.js 배열 순서 그대로 폴더·종목을 배치한다 (STOCKS 객체는 코드 숫자순으로 섞임)
  const ordered=(typeof TICKERS!=='undefined'&&Array.isArray(TICKERS))
    ? TICKERS.map(t=>STOCKS[t.code]&&{code:t.code,...STOCKS[t.code]}).filter(Boolean)
    : Object.entries(STOCKS).map(([code,d])=>({code,...d}));
  ordered.forEach(d=>{
    const s=d.sector||'기타';
    if(!byName[s]){ byName[s]={name:s,items:[]}; groups.push(byName[s]); }
    byName[s].items.push(d);
  });
  // 폴더는 처음엔 전부 접힘(첫 화면을 비운다). 아코디언: 하나를 열면 나머지는 자동으로 닫힌다.
  groups.forEach(g=>{
    const open=false;
    const sec=document.createElement('div'); sec.className='sector'+(open?' open':'');
    const head=document.createElement('button'); head.className='sector-head';
    // 폴더 아이콘은 SVG(색·열림 상태는 .sector.open CSS가 처리 — textContent 갱신 불필요)
    head.innerHTML=`<span class="fold"><svg viewBox="0 0 24 24"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5h8A1.5 1.5 0 0 1 20 9v9a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3 18z"/></svg></span> ${g.name} `+
      `<span class="cnt">${g.items.length}</span><span class="arrow">▸</span>`;
    head.onclick=()=>{
      const willOpen=!sec.classList.contains('open');
      wrap.querySelectorAll('.sector.open').forEach(s=>{ if(s!==sec) s.classList.remove('open'); });
      sec.classList.toggle('open', willOpen);
      if(willOpen) sec.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'nearest'});
    };
    const body=document.createElement('div'); body.className='sector-body';
    g.items.forEach(d=>{
      const el=document.createElement('span'); el.className='chip';
      const closes=flatCloses(d.code).map(x=>x.c);
      const spark=closes.length>=2?priceSparkSVG(closes,52,20):'';
      const autoMark=(analysisTier(d.code)==='auto')?'<span class="auto-dot" title="자동분석 종목">자동</span>':'';
      // 새로 추가돼 아직 시세가 수집 전인 종목은 가격 대신 '시세 대기'로 (null 안전)
      const hasP=(typeof d.price==='number');
      const valHtml=hasP
        ? `<b>${d.price.toLocaleString()}</b> <span class="${d.rate>0?'up':'down'}">${d.rate>0?'+':''}${(d.rate||0).toFixed(2)}%</span>`
        : `<span class="pf-mut" style="font-size:11px">시세 대기</span>`;
      el.innerHTML=`<span class="cname">${d.name}${autoMark}</span>${spark}<span class="cval">${valHtml}</span>`;
      el.title=d.name;
      el.onclick=()=>jumpToStock(d.name);  // 누르면 시세 카드로 바로 이동 + 분석 시작
      body.appendChild(el);
    });
    sec.appendChild(head); sec.appendChild(body); wrap.appendChild(sec);
  });
})();
makeCards(false);
// 첫 화면은 빈 상태 — 아무 종목도 자동으로 뜨지 않게, 검색을 유도한다.
(function(){
  const qn=document.getElementById('qname'); if(qn) qn.textContent='';
  const qd=document.getElementById('qdate');
  if(qd) qd.innerHTML='<span class="qd-seg" style="color:var(--dim)">위 검색창에서 종목을 골라 «분석 시작 ▶»을 눌러보세요</span>';
})();

/* ---------- 헤더 축소 · 히어로 진입 · 뷰 전환 모션 (§21·§22·§27) ---------- */
(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  // 1) 헤더 — 24px 이상 내리면 축소·블러 강화. rAF로 스크롤 작업을 묶는다.
  let ticking=false;
  function onScroll(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(()=>{
      document.body.classList.toggle('nav-shrink',window.scrollY>24);
      ticking=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // 2) 히어로 진입 — 로드 직후 순차 등장(§27 타임라인). 버튼은 처음부터 눌린다.
  if(!reduce){
    const seq=[['.home-hero-top','d1'],['.hero-title','d2'],
               ['.home-dashboard .tagline','d3'],['.hero-actions','d4'],
               ['.hero-search-card','d5']];
    seq.forEach(([sel,d])=>{
      const el=document.querySelector(sel);
      if(el){ el.classList.add('hero-anim',d); }
    });
  }

  // 3) 뷰 전환 — setMode가 화면을 바꿀 때 새 화면에 짧은 페이드업을 입힌다.
  if(!reduce){
    const wrapMode=()=>{
      const orig=window.setMode;
      if(typeof orig!=='function'||orig.__animWrapped) return false;
      const wrapped=function(mode){
        const r=orig.apply(this,arguments);
        // 방금 켜진 화면(.on 또는 표시 중인 view)에 애니메이션 클래스를 다시 건다
        document.querySelectorAll('[id$="View"],#analysisBrowser,#leaderboard').forEach(v=>{
          if(v.offsetParent===null) return;
          v.classList.remove('view-anim'); void v.offsetWidth; v.classList.add('view-anim');
        });
        return r;
      };
      wrapped.__animWrapped=true;
      window.setMode=wrapped;
      return true;
    };
    if(!wrapMode()){ let n=0; const t=setInterval(()=>{ if(wrapMode()||++n>40) clearInterval(t); },100); }
  }
})();

/* ---------- 스크롤 리빌 + 숫자 카운트업 (§23·§32) ----------
   · 리빌은 요소당 1회만. 관찰이 끝나면 unobserve 해서 리스너를 남기지 않는다.
   · 카운트업은 '고수준 지표'에만 쓰고 실시간 시세에는 쓰지 않는다.
   · prefers-reduced-motion이면 즉시 최종 상태로 두고 관찰 자체를 하지 않는다. */
(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!('IntersectionObserver' in window)) return;

  // 1) 섹션 리빌 — 홈 주요 블록에만 건다(밀집 표·칩은 흔들리면 안 되므로 제외)
  const SEL='.home-dashboard .start-step-summary, .gaeo-radar, .dowbar, .kpis, .change-board, '+
            '.activity-board, .market, .mk-tally, .mk-hist';
  const targets=document.querySelectorAll(SEL);
  if(!reduce&&targets.length){
    // display:none 상태로 시작하는 블록(예: #dowbar)은 관찰이 절대 발화하지 않아
    // opacity:0 그대로 굳어버린다. 그래서 '지금 보이는 요소'에만 리빌을 건다.
    const live=[...targets].filter(el=>el.offsetParent!==null||el.getClientRects().length);
    live.forEach((el,i)=>{ el.classList.add('reveal'); el.style.transitionDelay=Math.min(i*70,280)+'ms'; });
    const io=new IntersectionObserver(es=>{
      es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    },{threshold:.14,rootMargin:'0px 0px -8% 0px'});
    live.forEach(el=>io.observe(el));
    // 안전장치 — 어떤 이유로든 관찰이 발화하지 않은 요소는 4초 뒤 무조건 보이게 한다
    setTimeout(()=>{ document.querySelectorAll('.reveal:not(.in)').forEach(el=>el.classList.add('in')); },4000);
  }

  // 2) 카운트업 — data-countup 을 가진 요소의 정수만 1회 애니메이션
  const nums=document.querySelectorAll('[data-countup]');
  if(!nums.length) return;
  const easeOutQuart=t=>1-Math.pow(1-t,4);
  const io2=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target; io2.unobserve(el);
      const raw=el.textContent.trim();
      const m=raw.match(/^([^\d-]*)(-?[\d,]+)(.*)$/); if(!m) return;
      const pre=m[1], target=Number(m[2].replace(/,/g,'')), post=m[3];
      if(!isFinite(target)){ return; }
      if(reduce){ return; }               // 모션 최소화면 원래 값 그대로 둔다
      const t0=performance.now(), dur=1100;
      (function step(now){
        const p=Math.min((now-t0)/dur,1);
        el.textContent=pre+Math.round(easeOutQuart(p)*target).toLocaleString('ko-KR')+post;
        if(p<1) requestAnimationFrame(step);
      })(t0);
    });
  },{threshold:.2});
  nums.forEach(el=>io2.observe(el));
})();

// ---------- 사이트 테마 토글(다크 터미널 ↔ 라이트) ----------
(function(){
  const btn=document.getElementById('siteTheme'); if(!btn) return;
  const SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function paint(){
    const dark=document.documentElement.classList.contains('gdark');
    btn.innerHTML=(dark?SUN+'<span>라이트</span>':MOON+'<span>다크</span>');
  }
  btn.onclick=()=>{
    const el=document.documentElement;
    el.classList.toggle('gdark');
    try{localStorage.setItem('gaeo_theme',el.classList.contains('gdark')?'dark':'light');}catch(e){}
    paint(); if(typeof SFX!=='undefined'&&SFX.click) SFX.click();
  };
  paint();
})();

// ---------- 홈 핵심 신호: 오늘 달라진 것 · 종목별 5인 판단 변화 ----------
// "최근 5인 판단 변화"는 더 이상 홈 화면 단독 섹션으로 두지 않고, 각 종목 검색 후
// 뜨는 시세 카드에서 "최근 종가 흐름" 바로 아래(#qjudgeWrap, showQuote() 참고)에 노출한다.
// (다가오는 일정은 캘린더 모드로 이동했다 — upcomingEvents()/upcomingScheduleHTML() 참고)
(function(){
  const changeBox=document.getElementById('homeChangeList');
  if(!changeBox) return;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const nameOf=code=>(STOCKS[code]&&STOCKS[code].name)||code;
  const goStock=name=>jumpToStock(name);
  const analystLabels={taro:'기술',diana:'재무',nova:'확률',flow:'수급'};
  const analystKeys=Object.keys(analystLabels);

  // 기존 history.js를 읽기만 한다. 자동 생성 파일은 수정하지 않는다.
  function historyRows(code){
    const rows=(typeof LIVE_HISTORY!=='undefined'&&Array.isArray(LIVE_HISTORY[code]))
      ?LIVE_HISTORY[code].slice():[];
    if(rows.length) return rows.sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
    // HOME_BRIEF는 로드 실패 시 onerror 폴백이 null을 넣는다. typeof는 'object'를
    // 통과하므로 .signals에서 터진다 — 보드가 통째로 죽는 경로였다(2026-08-26 QA).
    const lite=(typeof HOME_BRIEF!=='undefined'&&HOME_BRIEF&&HOME_BRIEF.signals&&HOME_BRIEF.signals[code])||null;
    if(!lite) return [];
    const makeRow=(date,call,total,scores,stances)=>{
      const row={date:date||'',call:call||'HOLD',total};
      analystKeys.forEach((key,index)=>{
        row[key]={score:scores&&scores[index],stance:stances&&stances[index]};
      });
      return row;
    };
    const compact=[];
    if(lite.pc) compact.push(makeRow(lite.pd,lite.pc,lite.pt,lite.pa,lite.ps));
    compact.push(makeRow(lite.d,lite.c,lite.t,lite.a,lite.s));
    return compact;
  }
  function autoRow(code){
    const a=AUTO_AN&&AUTO_AN.stocks&&AUTO_AN.stocks[code], chief=a&&a.chief;
    if(!a||!chief) return null;
    return {date:a.updated||AUTO_AN.generatedAt||'',call:chief.call||'HOLD',total:chief.total,
      confidence:chief.confidence,taro:a.taro,diana:a.diana,nova:a.nova,flow:a.flow,tier:'auto',
      // 비교 조건. 이전 판단과 이 두 가지가 다르면 순수한 종목 판단 변화가 아니라
      // 모델·Universe가 바뀐 효과가 섞인 것이라, conditionChanged()가 걸러낸다.
      modelVersion:chief.modelVersion||null,
      coverageVersion:(AUTO_AN&&AUTO_AN.coverageUniverseVersion)||null};
  }
  // 날짜의 '날' 부분만 본다. history는 "2026-08-26", 당일 분석은 "2026-08-26 16:26"
  // 형식이라, 문자열을 통째로 비교하면 같은 날인데도 당일 값이 항상 더 크게 나온다.
  const dayOf=v=>String(v||'').slice(0,10);
  // ⭐ '오늘 변화'는 오늘과 '직전 거래일'을 비교해야 한다.
  //
  // 2026-08-26 감사에서 찾은 결함: 예전 코드는 live.date > latest.date를 문자열로
  // 비교했다. history.js가 로드된 상태에서는 두 값이 같은 날("2026-08-26"과
  // "2026-08-26 16:26")인데도 live가 항상 이겨서, previous가 '어제'가 아니라
  // '오늘 자기 자신의 기록'이 됐다. 둘 다 같은 분석 배치에서 나온 값이라 판단이
  // 늘 같고, 그래서 실제로 64종목의 판단이 바뀐 날에도 변화 0건으로 보였다.
  //
  // 지금까지 이게 안 보인 이유는 history.js가 지연 로딩이라 첫 화면에선
  // HOME_BRIEF의 어제/오늘 쌍으로 폴백했기 때문이다. 하지만 차트나 포트폴리오
  // 겹침 보기로 history.js가 한 번 로드되면 그때부터 보드가 눈이 멀었다.
  function signalFor(code){
    const rows=historyRows(code);
    let latest=rows[rows.length-1]||null;
    let previous=rows.length>1?rows[rows.length-2]:null;
    const live=autoRow(code);
    if(live){
      if(!latest){ latest=live; }
      else if(dayOf(live.date)>dayOf(latest.date)){
        // 진짜 새 거래일 — 직전 기록이 비교 대상이 된다.
        previous=latest; latest=live;
      }else if(dayOf(live.date)===dayOf(latest.date)){
        // 같은 날의 더 최신 값. 값만 갈아끼우고 비교 대상(previous)은 그대로 둔다.
        latest=live;
      }
      // live가 더 오래됐으면(캐시 등) 저장된 기록을 그대로 믿는다.
    }
    return latest?{code,latest,previous}:null;
  }
  const scoreOf=(row,key)=>Number(row&&row[key]&&row[key].score);
  function strongestDelta(signal){
    if(!signal.previous) return null;
    const rows=analystKeys.map(key=>{
      const now=scoreOf(signal.latest,key), before=scoreOf(signal.previous,key);
      return {key,delta:Number.isFinite(now)&&Number.isFinite(before)?now-before:0};
    }).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
    return rows[0]&&rows[0].delta?rows[0]:null;
  }
  function reasonOf(signal){
    const d=strongestDelta(signal);
    if(!signal.previous) return '비교할 이전 기록이 아직 없어요.';
    if(d) return `${analystLabels[d.key]} 점수 ${Math.abs(d.delta)}점 ${d.delta>0?'상승':'하락'}`;
    const total=Number(signal.latest.total)-Number(signal.previous.total);
    if(total) return `종합 점수 ${Math.abs(total)}점 ${total>0?'상승':'하락'}`;
    return '주요 판단은 이전 기록과 같아요.';
  }
  function votesOf(row){
    let bull=0,bear=0;
    analystKeys.forEach(key=>{
      const item=row&&row[key], stance=item&&item.stance;
      if(stance==='bull'||Number(item&&item.score)>=60) bull++;
      else if(stance==='bear'||Number(item&&item.score)<40) bear++;
    });
    return {bull,bear,neutral:4-bull-bear};
  }
  function dateLabel(value){
    const m=String(value||'').match(/\d{4}-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}))?/);
    return m?`${+m[1]}/${+m[2]}${m[3]?' '+m[3]:''}`:'최근 기록';
  }
  function callChanged(signal){
    return !!(signal.previous&&signal.previous.call&&signal.latest.call&&
      signal.previous.call!==signal.latest.call);
  }
  function totalDelta(signal){
    if(!signal.previous) return 0;
    const d=Number(signal.latest.total)-Number(signal.previous.total);
    return Number.isFinite(d)?d:0;
  }
  // 두 판단이 '같은 조건'에서 나왔는가. 모델이나 분석 대상 종목 집합이 그 사이에
  // 바뀌었으면, 점수가 움직인 게 종목 때문인지 모델 때문인지 구분할 수 없다.
  // 그런 종목은 '오늘 변화'로 올리지 않는다(무시하는 게 아니라 셈에서 뺀다).
  function conditionChanged(signal){
    const a=signal.previous, b=signal.latest;
    if(!a||!b) return false;
    // 한쪽이 비어 있으면 '달라졌다'고 단정하지 않는다. 옛 history 항목에는
    // modelVersion이 아예 없어서, 없는 것을 변화로 읽으면 정상 변화까지 다 사라진다.
    const differs=(x,y)=>!!(x&&y&&x!==y);
    return differs(a.modelVersion,b.modelVersion)||differs(a.coverageVersion,b.coverageVersion);
  }
  // ⭐ '의미 있는 변화'의 기준은 CHIEF 판단(BUY/HOLD/SELL)이 실제로 바뀐 것 하나뿐이다.
  //
  // 예전 기준: callChanged || |종합점수 변화| >= 4 || |개별 분석가 점수 변화| >= 8
  // 그 4와 8은 설계 문서·테스트·근거가 저장소 어디에도 없었다(2026-08-26 감사).
  // 점수는 매일 조금씩 흔들리므로, 근거 없는 선을 그으면 "오늘 크게 바뀐 종목"이
  // 매일 몇 개씩 만들어진다. 실제로는 아무 판단도 바뀌지 않았는데도 그렇다.
  // 화면이 바빠 보이려고 숫자를 지어내는 셈이라 v1 기준에서 뺐다.
  //
  // 점수 변화는 버리지 않는다 — 이미 판단이 바뀐 종목의 '설명'으로 카드 안에 쓴다
  // (reasonOf·strongestDelta). 선정 기준이 아니라 부가정보라는 뜻이다.
  //
  // RISK 등급 변화는 아직 못 쓴다: history.js에 riskGrade가 저장된 적이 없어서
  // (실측 0건) 이전 등급을 알 방법이 없다. 지금 알고리즘으로 과거 Risk를 다시
  // 계산해 "그때 등급"이라고 부르는 건 없는 기록을 지어내는 것이다. 앞으로
  // 저장되기 시작하면 그때부터 Priority 2로 더한다(과거 소급 없음).
  function meaningful(signal){
    return callChanged(signal)&&!conditionChanged(signal);
  }
  function toneOf(signal){
    const d=totalDelta(signal);
    return d>0?'up':d<0?'down':'flat';
  }
  function bindStockClicks(root){
    root.querySelectorAll('[data-go]').forEach(el=>el.onclick=()=>{
      goStock(el.dataset.go); if(typeof SFX!=='undefined') SFX.click();
    });
  }

  // representativeSignals()는 2026-08-26에 제거했다. 변화가 없을 때 시가총액 상위
  // 종목을 끌어와 같은 '변화 카드'로 그리던 함수인데, 그 종목들은 아무것도 바뀌지
  // 않았는데 "→" 화살표가 붙어 나와서 보는 사람이 오늘 뭔가 달라졌다고 읽었다.
  // 없는 변화를 지어내는 자리라 되살리지 않는다(renderChanges 주석 참고).
  // 종목 시세 카드(#quote)의 "최근 종가 흐름" 바로 아래 넣는 "그 종목의 5인 판단 변화" 카드.
  // 새 점수만 보여주지 않고, 이전 판단과 무엇이 달라졌는지 함께 보여준다.
  function judgeCardHTML(signal){
    const latest=signal.latest, previous=signal.previous;
    const before=previous&&previous.call, after=latest.call||'HOLD';
    const delta=totalDelta(signal);
    const moveHTML=before?`<b>${esc(before)}</b><span class="qjudge-arrow">→</span><b>${esc(after)}</b>`:`<b>${esc(after)}</b>`;
    const reason=before?reasonOf(signal):'개오팀 5인이 처음 분석한 판단이에요.';
    return `<div class="qchart-head">`+
        `<div class="qchart-heading"><span class="qchart-eyebrow">TEAM CALL</span><span class="qchart-t">최근 5인 판단 변화</span></div>`+
        `<span class="qchart-sub">${esc(dateLabel(latest.date))} 기준</span>`+
      `</div>`+
      `<div class="qjudge-body" data-tone="${toneOf(signal)}">`+
        `<span class="qjudge-move">${moveHTML}</span>`+
        `<span class="qjudge-reason">${esc(reason)}${delta?` · 종합 ${delta>0?'+':''}${delta}`:''}</span>`+
      `</div>`;
  }
  function renderStockJudge(code){
    const wrap=document.getElementById('qjudgeWrap');
    if(!wrap) return;
    const signal=code&&signalFor(code);
    if(!signal){ wrap.style.display='none'; wrap.innerHTML=''; return; }
    wrap.innerHTML=judgeCardHTML(signal);
    wrap.style.display='block';
  }
  window.renderStockJudge=renderStockJudge;

  function marketChanges(exclude){
    const signals=[];
    const source=(typeof LIVE_HISTORY!=='undefined'&&LIVE_HISTORY)||
      ((typeof HOME_BRIEF!=='undefined'&&HOME_BRIEF&&HOME_BRIEF.signals)||{});
    for(const code in source){
      if(exclude&&exclude.has(code)) continue;
      const signal=signalFor(code);
      if(signal&&meaningful(signal)) signals.push(signal);
    }
    return signals.sort((a,b)=>(callChanged(b)?1:0)-(callChanged(a)?1:0)||
      Math.abs(totalDelta(b))-Math.abs(totalDelta(a))||
      String(b.latest.date||'').localeCompare(String(a.latest.date||'')));
  }
  function changeCard(signal){
    const latest=signal.latest, previous=signal.previous, votes=votesOf(latest);
    const before=previous&&previous.call||'첫 기록';
    const after=latest.call||'HOLD';
    return `<button class="change-item" type="button" data-tone="${toneOf(signal)}" data-go="${esc(nameOf(signal.code))}">`+
      `<span class="change-name">${esc(nameOf(signal.code))}<span class="change-time">${esc(dateLabel(latest.date))}</span></span>`+
      `<span class="change-call"><b>${esc(before)}</b><span class="change-arrow">→</span><b>${esc(after)}</b></span>`+
      `<span class="change-reason">${esc(reasonOf(signal))}</span>`+
      `<span class="change-votes">긍정 ${votes.bull} · 보수 ${votes.bear} · 중립 ${votes.neutral}</span></button>`;
  }
  function renderChanges(){
    const watchCodes=typeof loadWatchlist==='function'?loadWatchlist():[];
    const watchSet=new Set(watchCodes);
    const watchSignals=watchCodes.map(signalFor).filter(Boolean);
    const changed=watchSignals.filter(meaningful);
    let shown=changed;
    const desc=document.getElementById('homeChangesDesc');
    const count=document.getElementById('homeChangeCount');
    const unit=document.getElementById('homeChangeUnit');
    // ⭐ 변화가 없으면 없다고 말한다.
    //
    // 예전에는 관심종목에도 시장에도 변화가 없을 때 representativeSignals()로
    // 시가총액 상위 종목을 끌어와 같은 '변화 카드'에 그렸다. 그 종목들은 아무것도
    // 바뀌지 않았는데 "→" 화살표가 붙은 카드로 나오니, 보는 사람은 오늘 뭔가
    // 달라졌다고 읽는다. 없는 변화를 있는 것처럼 보이게 하는 자리라 뺐다.
    //
    // 시장 변화(marketChanges)를 대신 보여주는 것은 그대로 둔다 — 그건 실제로
    // 판단이 바뀐 종목이라 거짓이 아니다. 다만 '내 종목 변화'가 아니라는 것을
    // 문구로 분명히 한다. 둘 다 0이면 빈 상태(아래 change-empty)로 간다.
    if(watchCodes.length){
      if(changed.length){
        count.textContent=changed.length;
        unit.textContent='개 관심종목 변화';
        desc.textContent=`저장한 관심종목 ${watchCodes.length}개 중 판단이 바뀐 종목이에요.`;
      }else{
        // ⚠️ 헤더 숫자와 화면 내용이 어긋나면 안 된다. 관심종목 변화가 0건인데
        //    "0개 관심종목 변화"라고 써 놓고 시장 카드 3장을 그리면, 보는 사람은
        //    그 3장이 자기 관심종목이라고 읽는다. 지금 화면에 실제로 보이는 것을
        //    세서 그것의 이름을 붙인다.
        //    (판정 기준이 'CHIEF 판단 변화'로 좁아지면서 이 분기가 상시 경로가
        //     됐다 — 실측 598종목 중 판단이 바뀌는 건 하루 60여 건이다.)
        shown=marketChanges(watchSet).slice(0,3);
        count.textContent=shown.length;
        unit.textContent=shown.length?'개 시장 변화':'개 변화';
        desc.textContent=shown.length
          ?`관심종목 ${watchCodes.length}개는 판단 그대로예요. 대신 시장에서 판단이 바뀐 종목을 보여드려요.`
          :'오늘은 관심종목도 시장도 판단이 바뀐 곳이 없어요.';
      }
    }else{
      shown=marketChanges().slice(0,3);
      count.textContent=shown.length;
      unit.textContent='개 시장 변화';
      desc.textContent='관심종목을 저장하면 다음 방문부터 내 종목 변화가 먼저 보여요.';
    }
    shown=shown.slice(0,3);
    if(shown.length){
      changeBox.innerHTML=shown.map(changeCard).join('');
      bindStockClicks(changeBox);
    }else{
      changeBox.innerHTML=`<div class="change-empty"><div><strong>오늘은 큰 판단 변화가 없어요.</strong>`+
        `종목을 저장해두면 다음 변화부터 이곳에서 바로 알려드려요.</div>`+
        `<button type="button" id="emptyChangeSearch">종목 찾기</button></div>`;
      const btn=document.getElementById('emptyChangeSearch');
      if(btn) btn.onclick=()=>{
        const input=document.getElementById('homeTicker');
        input.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'center'});
        setTimeout(()=>input.focus(),320);
      };
    }
  }
  function renderAll(){
    renderChanges();
    const qcode=document.getElementById('qcode');
    if(qcode&&qcode.textContent) renderStockJudge(qcode.textContent);
  }
  window.renderGaeoHomeSignals=renderAll;
  renderAll();
  /* ⭐ 2026-08-14에는 여기서 전체 자동분석(auto_analysis.js · 3MB)을 백그라운드로 받아
     "오늘의 판단" BUY 상위를 다시 그렸다. 홈 스냅샷이 종합점수순으로 잘려서 확신도 1~3위가
     30위 밖으로 밀릴 수 있었기 때문이다.
     그 원인은 같은 날 generate_snapshots.js에서 이미 없앴다 — 자를 때부터 화면과 똑같은
     기준(BUY 먼저 · 확신도 · 종합점수 · 이름)으로 정렬한 뒤 상위 30개를 남긴다. 같은
     기준으로 정렬해 자른 30개 안에는 그 기준의 1~3위가 반드시 들어 있으므로, 다시 그릴
     이유가 사라졌다(계약은 test_home_brief_top.js가 지킨다).
     그런데 재로드 코드만 남아 있어서, 홈에 들어올 때마다 이름 세 개를 확인하려고 3MB를
     받고 파싱했다. 2026-08-21에 제거한다. 전체 자동분석이 진짜 필요한 화면(비교·포트폴리오·
     스크리너·전체시장)은 각자 ensureAutoAnalysis()를 호출하므로 영향이 없다. */
})();

// ---------- 🗂 뉴스분석·종목공부·주식공부·부동산공부 공통 — 중카테고리(대>중>소) ----------
// 대카테고리 = 모드 탭(뉴스분석/종목공부/주식공부/부동산공부) 자체, 중카테고리 = 아래 CATS,
// 소카테고리 = 실제 등록된 글 하나하나. 각 글의 data.js "cat" 필드로 어느 중카테고리인지 판정한다.
const NEWS_CATS=[
 {key:'market',ico:'<path d="M4 19V9M9.5 19V5M15 19v-8M20 19v-5M3 21h18"/>',emoji:'📉',label:'코스피·코스닥 시황 정리',desc:'그날그날의 지수 등락과 배경을 정리해요.'},
 {key:'earnings',ico:'<path d="M6 3h9l4 4v14H6z"/><path d="M14.5 3v4.5H19"/><path d="M9 12h6M9 16h4"/>',emoji:'📑',label:'기업 실적발표 정리',desc:'국내외 주요 기업의 분기 실적을 쉽게 풀어요.'},
 {key:'global',ico:'<circle cx="12" cy="12" r="8.5"/><path d="M3.6 9.5h16.8M3.6 14.5h16.8"/><path d="M12 3.5c2.4 2.6 2.4 14.4 0 17M12 3.5c-2.4 2.6-2.4 14.4 0 17"/>',emoji:'🌐',label:'글로벌 이슈·매크로',desc:'금리·물가·유가 같은 큰 흐름을 다뤄요.'},
 {key:'crypto',ico:'<circle cx="12" cy="12" r="8.5"/><path d="M9.5 9h4a2.2 2.2 0 0 1 0 4.4h-4M9.5 13.4h4.4a2.2 2.2 0 0 1 0 4.4H9.5M9.5 9v8.8M11.5 7v2M11.5 17.8v2"/>',emoji:'🪙',label:'코인·신기술',desc:'비트코인부터 AI·양자컴퓨터까지.'},
 {key:'domestic',ico:'<path d="M4 20V6.5L11 4v16M11 20h9V10l-9-3"/><path d="M14.5 12h2M14.5 15.5h2M7 9.5h1M7 13h1"/>',emoji:'🏢',label:'국내 기업 이슈',desc:'상장·신사업 같은 개별 기업 소식.'},
];
const STUDY_CATS=[
 {key:'kr',ico:'<path d="M4 20V6.5L11 4v16M11 20h9V10l-9-3"/><path d="M14.5 12h2M14.5 15.5h2"/>',emoji:'🇰🇷',label:'국내기업',desc:'국내 상장기업 프로필.'},
 {key:'global',emoji:'🌍',label:'해외기업',desc:'해외 유명 기업 프로필.'},
];
const LESSON_CATS=[
 {key:'beginner',emoji:'🌱',label:'주식 초보를 위한 글',desc:'계좌 개설부터 주문·공시·분산투자까지 처음부터 차근차근.'},
 {key:'chart',emoji:'📊',label:'차트·기술적 분석 기초',desc:'캔들·이동평균선·지수처럼 그래프 읽는 법.'},
 {key:'capitalism',emoji:'📺',label:'EBS 다큐 자본주의 완전정리',desc:'자본주의 연재를 한자리에.'},
 {key:'crisis',emoji:'📜',label:'경제위기의 역사',desc:'IMF·리먼·코로나 쇼크까지.'},
 {key:'tax',emoji:'💰',label:'세금·절세 계좌',desc:'IRP·종합소득세 등 세금 아끼는 법.'},
 {key:'isa',emoji:'🏦',label:'ISA 계좌 완전정복',desc:'ISA 하나로 절세하는 법, 종류·비교부터 개편 소식까지.'},
 {key:'product',emoji:'📈',label:'투자상품 알아보기',desc:'배당주·리츠·채권 등 투자수단 이해.'},
 {key:'macro',emoji:'🏛',label:'시장을 움직이는 손',desc:'국민연금·밸류업·환율 같은 큰 변수.'},
 {key:'industry',emoji:'🧬',label:'산업·기업 분석',desc:'임상시험·반도체 사이클 등 업종 지식.'},
 {key:'etf',emoji:'📦',label:'ETF·연금·절세',desc:'ETF 선택과 연금·절세 계좌를 쉽게 정리해요.'},
 {key:'youth',emoji:'🧾',label:'청년 돈생활·정책',desc:'사회초년생의 돈 관리와 청년 지원을 알아봐요.'},
];
const ESTATE_CATS=[
 {key:'buy',emoji:'🏠',label:'내 집 마련 기초',desc:'매매·청약 등 처음 집 살 때 알아야 할 것.'},
 {key:'rent',emoji:'📜',label:'전월세·임대차 보호',desc:'전세사기 예방, 임대차 3법.'},
 {key:'loan',emoji:'🏦',label:'대출·금융',desc:'근저당·LTV·DTI·DSR·상환방식.'},
 {key:'auction',emoji:'🔨',label:'경매·공매 시리즈',desc:'부동산 경매 기초부터 실전까지.'},
 {key:'strategy',emoji:'',label:'투자 전략',desc:'재건축·갭투자 등 투자 접근법.'},
 {key:'tax',emoji:'🧾',label:'부동산 세금',desc:'양도소득세 등 사고팔 때 마주치는 세금.'},
];
const CALC_CATS=[
 {key:'stock',emoji:'📈',label:'주식 계산기',desc:'평단가 등 매매에 바로 쓰는 계산기.'},
 {key:'tax',emoji:'💸',label:'세금 계산기',desc:'양도소득세 등 투자 관련 세금 계산.'},
 {key:'finance',emoji:'🏦',label:'재테크 계산기',desc:'복리 등 자산 불리기 계산기.'},
 {key:'etf',emoji:'📦',label:'ETF·연금·절세',desc:'ETF 적립·분배금·절세를 한 번에 계산해요.'},
 {key:'youth',emoji:'🧾',label:'청년 돈생활',desc:'청년 자산·주거·퇴직 준비 계산기.'},
];
// 중카테고리 선택 화면(그리드) HTML — cats: 위 CATS 배열, list: 해당 모드의 전체 글 배열
function catPickerHTML(cats, list, opts){
  const showCount=!(opts&&opts.noCount);
  const allLabel=(opts&&opts.allLabel)||'전체 글 한 번에 보기';
  const counts={};
  list.forEach(x=>{ const c=x.cat||'etc'; counts[c]=(counts[c]||0)+1; });
  const cards=cats.map(c=>
    `<button type="button" class="cat-card" data-cat="${c.key}">
       <span class="cat-emoji" aria-hidden="true">${c.ico?`<svg class="cat-ico" viewBox="0 0 24 24" aria-hidden="true">${c.ico}</svg>`:''}</span>
       <span class="cat-label">${c.label}</span>
       <span class="cat-desc">${c.desc}</span>
       ${showCount?`<span class="cat-count">${counts[c.key]||0}개 글</span>`:''}
     </button>`).join('');
  return `<div class="cat-grid">${cards}</div>
    <button type="button" class="cat-allbtn" data-cat="__all__">${allLabel} (${list.length}건) →</button>`;
}
// 글 목록 화면 상단의 "← 카테고리 목록" 되돌아가기 버튼 + 현재 위치 표시
function catBackHTML(cats, sel){
  const c=cats.find(x=>x.key===sel);
  const label=sel==='__all__'?'전체 글':(c?c.label:sel);
  return `<button type="button" class="cat-back">← 카테고리 목록으로</button>
    <div class="cat-current">${label} 보는 중</div>`;
}
// 뉴스분석·종목공부·주식공부·부동산공부 공통 검색창 HTML + 이벤트 연결(입력 중 포커스 유지)
function searchBoxHTML(id, q, esc){
  return `<div class="nw-search"><input type="search" id="${id}" aria-label="현재 자료에서 제목 검색" placeholder="제목으로 검색..." value="${esc(q)}"></div>`;
}
function wireSearchInput(box, id, onChange){
  const inp=box.querySelector('#'+id); if(!inp) return;
  inp.oninput=()=>{
    onChange(inp.value);
    const ni=box.querySelector('#'+id);
    if(ni){ ni.focus(); const v=ni.value; ni.setSelectionRange(v.length, v.length); }
  };
}
function focusContentHeading(box){
  requestAnimationFrame(()=>{
    const heading=box.querySelector('.nw-hero h2');
    if(heading){ heading.tabIndex=-1; heading.focus({preventScroll:true}); }
  });
}

// 본문 광고는 SPA가 글 HTML을 동적으로 만든 뒤 생긴다. AdFit의 일반 초기 스캔에는 잡히지
// 않으므로 data-ad-preload로 동적 슬롯임을 알리고, 같은 광고 단위를 글 10개에 복제하지
// 않도록 페이지 전체에서 하나만 만들어 현재 펼친 글로 옮겨 쓴다.
window.GaeoContentAd=(function(){
  let slot=null;
  const UNITS={
    desktop:{id:'DAN-wS5JabZyWT5KgaAD',width:728,height:90},
    mobile:{id:'DAN-Jw8j3h5xP3U7FHXH',width:320,height:50}
  };
  function depot(){
    let el=document.getElementById('gaeoContentAdDepot');
    if(!el){
      el=document.createElement('div');
      el.id='gaeoContentAdDepot';
      el.hidden=true;
      document.body.appendChild(el);
    }
    return el;
  }
  function create(){
    if(slot) return slot;
    const kind=window.innerWidth<768?'mobile':'desktop';
    const unit=UNITS[kind];
    slot=document.createElement('div');
    slot.id='gaeoContentAd';
    slot.className='ad-slot ad-slot-content';
    slot.dataset.adVariant=kind;
    slot.innerHTML='<span class="ad-label">광고</span>'+
      '<span class="ad-status">광고를 불러오는 중이에요.</span>'+
      '<ins class="kakao_ad_area" style="display:none;" '+
      `data-ad-unit="${unit.id}" data-ad-width="${unit.width}" data-ad-height="${unit.height}" `+
      'data-ad-preload="Y" data-ad-onload="gaeoAdLoaded" data-ad-onfail="gaeoAdFailed"></ins>';
    return slot;
  }
  function park(){
    if(slot) depot().appendChild(slot);
  }
  function mount(item){
    if(!item){ park(); return; }
    const body=item.classList&&item.classList.contains('nw-body')?item:item.querySelector('.nw-body');
    if(!body) return;
    const el=create();
    if(el.classList.contains('ad-failed')){ park(); return; }
    body.appendChild(el);
    window.gaeoWatchAd(el.querySelector('.kakao_ad_area'));
  }
  function isInside(item){
    return !!(slot&&item&&item.contains(slot));
  }
  return {mount,park,isInside};
})();

// ---------- 📰 뉴스분석 모드 ----------
// news_analysis.js(NEWS_ANALYSIS 배열)에 보고서를 계속 쌓는다. 10건 = 1페이지.
(function(){
  const PAGE_SIZE=10;
  let page=1;
  let newsCatSel=null; // null=카테고리 선택 화면, '__all__'=전체, 그 외=해당 cat만
  let newsSearchQ='';
  const focusNewsHeading=box=>requestAnimationFrame(()=>{
    const heading=box.querySelector('.nw-hero h2');
    if(heading){ heading.tabIndex=-1; heading.focus({preventScroll:true}); }
  });
  const escN=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline=s=>SIGNUM(escN(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>'));
  // 본문 미니 마크다운: "## 제목" = 소제목, "- " = 목록, 빈 줄 = 문단 구분, **굵게**
  function nwBodyHTML(md){
    const lines=String(md||'').split('\n');
    let html='', para=[], list=null;
    const flushP=()=>{ if(para.length){ html+='<p>'+para.map(inline).join('<br>')+'</p>'; para=[]; } };
    const flushL=()=>{ if(list){ html+='<ul>'+list.map(x=>'<li>'+inline(x)+'</li>').join('')+'</ul>'; list=null; } };
    lines.forEach(ln=>{
      const t=ln.trim();
      if(!t){ flushP(); flushL(); return; }
      if(t.indexOf('## ')===0){ flushP(); flushL(); html+='<h4>'+inline(t.slice(3))+'</h4>'; return; }
      if(t.indexOf('- ')===0){ flushP(); if(!list) list=[]; list.push(t.slice(2)); return; }
      flushL(); para.push(t);
    });
    flushP(); flushL();
    return html;
  }
  // 개발 기록: 세션마다 사람이 changelog.js의 CHANGELOG_LOG 맨 위(또는 오늘 날짜 항목의
  // items 끝)에 이어 붙이는 방식으로 쌓는다. 자동 생성 아님 — history.js류와 다르다.
  window.renderChangelog=function(){
    const box=document.getElementById('changelogView'); if(!box) return;
    const log=(typeof CHANGELOG_LOG!=='undefined'&&Array.isArray(CHANGELOG_LOG))?CHANGELOG_LOG:[];
    if(!log.length){ box.innerHTML='<div class="nw-empty">기록을 불러오지 못했어요.</div>'; return; }
    const entryHTML=e=>{
      const items=(e.items||[]).map(it=>`<li>${it.text}</li>`).join('');
      return `<div class="sc-block cl-entry"><div class="cl-date">${esc(e.date)}</div>
        <h3>${esc(e.title)}</h3>
        ${e.sub?`<p class="sc-sub">${esc(e.sub)}</p>`:''}
        <ul class="cl-list">${items}</ul></div>`;
    };
    box.innerHTML=`<div class="cl-hero"><h2>개발 기록</h2>
      <p>GAEO가 무엇을 만들고, 무엇이 고장 났고, 그걸 어떻게 고쳐왔는지 시간순으로 남긴 기록이에요.
      잘된 것만이 아니라 <b>실수와 되돌린 결정, 아직 못 고친 문제</b>도 함께 적어요. 작업이 있는 날마다 맨 위에 새로 쌓여요.</p></div>
      ${log.map(entryHTML).join('')}
      <div class="sc-foot-note" style="text-align:center;margin-top:8px">GAEO의 분석·점수는 참고용 정보이며 특정 종목의 매수·매도를 권유하지 않습니다.</div>`;
  };
  window.renderNews=function(){
    const box=document.getElementById('newsView'); if(!box) return;
    window.GaeoContentAd.park();
    const all=(typeof NEWS_ANALYSIS!=='undefined'&&Array.isArray(NEWS_ANALYSIS))?NEWS_ANALYSIS.slice():[];
    // 최신 날짜(같으면 id 큰 것)가 앞으로
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const hero=`<div class="nw-hero"><h2>뉴스분석</h2>
      <p>시장을 움직인 기사·이슈를 개오팀이 초보자 눈높이로 풀어드려요.
      카테고리를 먼저 골라보세요. 제목을 누르면 전체 보고서가 펼쳐집니다.</p>
      ${searchBoxHTML('newsSearchInput', newsSearchQ, escN)}</div>`;
    const q=newsSearchQ.trim().toLowerCase();
    if(!q && !newsCatSel){
      box.innerHTML=hero+catPickerHTML(NEWS_CATS, all);
      wireSearchInput(box, 'newsSearchInput', v=>{ newsSearchQ=v; page=1; window.renderNews(); });
      box.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{
        newsCatSel=el.dataset.cat; page=1; window.renderNews();
        focusNewsHeading(box);
        box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
      });
      return;
    }
    const searching=q.length>0;
    const filtered=searching
      ? all.filter(a=>(a.title||'').toLowerCase().includes(q)||(a.tag||'').toLowerCase().includes(q))
      : (newsCatSel==='__all__'?all:all.filter(x=>x.cat===newsCatSel));
    const backHtml=searching
      ? `<button type="button" class="cat-back" id="newsSearchClear">← 검색 지우기</button><div class="cat-current">"${escN(newsSearchQ)}" 검색결과 ${filtered.length}건</div>`
      : catBackHTML(NEWS_CATS, newsCatSel);
    const pages=Math.max(1, Math.ceil(filtered.length/PAGE_SIZE));
    if(page>pages) page=pages; if(page<1) page=1;
    const slice=filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
    let h=hero+backHtml;
    h+=slice.length
      ? slice.map(a=>`<div class="nw-item" id="nw-${a.id}">
          <button type="button" class="nw-head" data-nw="${a.id}" aria-expanded="false" aria-controls="nw-body-${a.id}">
            <span class="nw-meta"><span class="nw-date">${escN(a.date||'')}</span>${a.tag?`<span class="nw-tag">${escN(a.tag)}</span>`:''}</span>
            <span class="nw-title">${escN(a.title||'')} <span class="nw-arrow" aria-hidden="true">▸</span></span>
          </button>
          <div class="nw-body" id="nw-body-${a.id}">${nwBodyHTML(a.body)}
            ${Array.isArray(a.sources)&&a.sources.length?`<div class="nw-src">참고 기사<br>`+
              a.sources.map(s=>`· <a href="${escN(s.url)}" target="_blank" rel="noopener">${escN(s.name||s.url)}</a>`).join('<br>')+`</div>`:''}
            <div class="nw-disc">※ 개오팀의 분석 의견이며 투자 권유가 아닙니다. 투자 판단과 책임은 본인에게 있어요.</div>
          </div>
        </div>`).join('')
      : `<div class="nw-item"><div class="nw-empty">${searching?'검색 결과가 없어요.':'아직 등록된 뉴스분석이 없어요.'}</div></div>`;
    if(pages>1){
      h+=`<div class="nw-pager">
        <button class="nw-pg" data-pg="${page-1}" ${page<=1?'disabled':''}>‹ 이전</button>`+
        Array.from({length:pages},(_,i)=>`<button class="nw-pg${i+1===page?' on':''}" data-pg="${i+1}">${i+1}</button>`).join('')+
        `<button class="nw-pg" data-pg="${page+1}" ${page>=pages?'disabled':''}>다음 ›</button></div>`;
    }
    box.innerHTML=h;
    wireSearchInput(box, 'newsSearchInput', v=>{ newsSearchQ=v; page=1; window.renderNews(); });
    if(searching){
      const clearBtn=box.querySelector('#newsSearchClear');
      if(clearBtn) clearBtn.onclick=()=>{ newsSearchQ=''; page=1; window.renderNews(); focusNewsHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    } else {
      const backBtn=box.querySelector('.cat-back');
      if(backBtn) backBtn.onclick=()=>{ newsCatSel=null; page=1; window.renderNews(); focusNewsHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    }
    // 제목 클릭 → 본문 펼침/접힘
    box.querySelectorAll('.nw-head').forEach(el=>el.onclick=()=>{
      const item=document.getElementById('nw-'+el.dataset.nw);
      if(item){ const open=item.classList.toggle('open'); el.setAttribute('aria-expanded',String(open));
        if(open){ window.GaeoContentAd.mount(item); window.GaeoMetrics.contentView('news',el.dataset.nw,item); }
        else if(window.GaeoContentAd.isInside(item)) window.GaeoContentAd.park();
        history.replaceState(null,'', open?('?m=news&id='+el.dataset.nw):location.pathname); }
    });
    // 페이지 이동
    box.querySelectorAll('.nw-pg').forEach(b=>b.onclick=()=>{
      const p=parseInt(b.dataset.pg,10);
      if(!p||p===page||b.disabled) return;
      page=p; renderNews();
      focusContentHeading(box);
      box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
    });
    // 최신 1건은 처음부터 펼쳐서 보여준다(검색 중엔 자동으로 펼치지 않음)
    if(!searching&&page===1&&slice.length){
      const first=document.getElementById('nw-'+slice[0].id);
      if(first){ first.classList.add('open'); first.querySelector('.nw-head')?.setAttribute('aria-expanded','true'); window.GaeoContentAd.mount(first); }
    }
  };
  // 딥링크(?m=news&id=N) — 카테고리 화면을 건너뛰고 해당 글의 카테고리·페이지로 바로 이동해 펼치고 스크롤
  window.openNewsId=function(id){
    const all=(typeof NEWS_ANALYSIS!=='undefined'&&Array.isArray(NEWS_ANALYSIS))?NEWS_ANALYSIS.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const target=all.find(a=>String(a.id)===String(id));
    if(!target) return;
    newsCatSel=target.cat||'__all__';
    const filtered=all.filter(x=>x.cat===newsCatSel);
    const idx=filtered.findIndex(a=>String(a.id)===String(id));
    page=idx<0?1:Math.floor(idx/PAGE_SIZE)+1;
    window.renderNews();
    const el=document.getElementById('nw-'+id);
    if(el){
      el.classList.add('open');
      el.querySelector('.nw-head')?.setAttribute('aria-expanded','true');
      window.GaeoContentAd.mount(el);
      window.GaeoMetrics.contentView('news',id,el);
      setTimeout(()=>el.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}),80);
    }
  };
  window.openNewsCategory=function(cat){
    newsSearchQ='';
    newsCatSel=cat||'market';
    page=1;
    window.renderNews();
    const box=document.getElementById('newsView');
    if(box) setTimeout(()=>box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}),60);
  };
})();

// ---------- 📚 종목공부 모드 ----------
// stock_study.js(STOCK_STUDY 배열)에 종목 공부자료를 쌓는다. 뉴스분석과 같은 형식·페이지네이션(10건=1페이지).
(function(){
  const PAGE_SIZE=10;
  let page=1;
  let stCatSel=null, lsCatSel=null, esCatSel=null; // null=카테고리 선택 화면
  let stSearchQ='', lsSearchQ='', esSearchQ='';
  const escN=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline=s=>SIGNUM(escN(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>'));
  /* ---- 🎓 주식공부 본문 도해(SVG) ----
     body 안에 "[[img:키|캡션]]" 한 줄을 쓰면 아래 레지스트리의 SVG가 그 자리에 그려진다.
     외부 이미지 없이 인라인 SVG라 오프라인·캐시·경로 문제에서 자유롭다. */
  const LESSON_ART=(function(){
    const RED='#e05252', BLUE='#4a7fd6', GRAY='#b9c2c9', INK='#55606a';
    // 캔들 하나: x중심, 고가h·저가l·시가o·종가c는 전부 y좌표(위=고가), 색, 몸통폭
    const cd=(x,h,o,c,l,col,w)=>{ w=w||26; const top=Math.min(o,c), bh=Math.max(3,Math.abs(c-o));
      return '<line x1="'+x+'" y1="'+h+'" x2="'+x+'" y2="'+l+'" stroke="'+col+'" stroke-width="2"/>'
           + '<rect x="'+(x-w/2)+'" y="'+top+'" width="'+w+'" height="'+bh+'" fill="'+col+'" rx="2"/>'; };
    const tx=(x,y,s,anchor,size,col,bold)=>'<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||'middle')
      +'" font-size="'+(size||13)+'" fill="'+(col||INK)+'"'+(bold?' font-weight="700"':'')+'>'+s+'</text>';
    const ln=(x1,y1,x2,y2)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+GRAY+'" stroke-width="1" stroke-dasharray="3 3"/>';
    const svg=(w,h,inner)=>'<svg viewBox="0 0 '+w+' '+h+'" xmlns="http://www.w3.org/2000/svg" role="img">'+inner+'</svg>';
    const A={};
    // ① 캔들 구조 — 양봉/음봉 각 부위 이름
    A['candle-anatomy']=svg(480,258,
      cd(150,42,158,72,208,RED,40)
      +ln(30,42,128,42)+tx(26,46,'고가','end')+ln(30,72,128,72)+tx(26,76,'종가','end',13,RED,1)
      +ln(30,158,128,158)+tx(26,162,'시가','end')+ln(30,208,128,208)+tx(26,212,'저가','end')
      +cd(330,42,72,158,208,BLUE,40)
      +ln(352,42,452,42)+tx(456,46,'고가','start')+ln(352,72,452,72)+tx(456,76,'시가','start')
      +ln(352,158,452,158)+tx(456,162,'종가','start',13,BLUE,1)+ln(352,208,452,208)+tx(456,212,'저가','start')
      +tx(240,55,'← 윗꼬리 →',undefined,12,'#8a95a0')+tx(240,120,'← 몸통 →',undefined,12,'#8a95a0')+tx(240,195,'← 아랫꼬리 →',undefined,12,'#8a95a0')
      +tx(150,240,'양봉(빨강) · 올라서 마감',undefined,13,RED,1)+tx(330,240,'음봉(파랑) · 내려서 마감',undefined,13,BLUE,1));
    // ② 꼬리의 의미 — 윗꼬리/아랫꼬리/도지
    A['candle-wicks']=svg(480,250,
      cd(90,45,150,168,182,RED,30)+tx(90,215,'윗꼬리가 길다',undefined,13,INK,1)+tx(90,233,'위에서 파는 힘(저항)',undefined,12,'#8a95a0')
      +cd(240,88,100,82,190,RED,30)+tx(240,215,'아랫꼬리가 길다',undefined,13,INK,1)+tx(240,233,'아래에서 사는 힘(지지)',undefined,12,'#8a95a0')
      +cd(390,60,116,119,178,INK,30)+tx(390,215,'도지(십자)',undefined,13,INK,1)+tx(390,233,'산 쪽·판 쪽 힘의 균형',undefined,12,'#8a95a0'));
    // ③ 반등 신호 3형제 — 망치형·상승 장악형·적삼병
    A['candle-bull']=svg(500,262,
      cd(48,52,60,86,96,GRAY,18)+cd(76,80,90,116,126,GRAY,18)+cd(108,118,132,120,200,RED,24)
      +tx(80,224,'망치형',undefined,13,INK,1)+tx(80,242,'바닥에서 긴 아랫꼬리',undefined,11.5,'#8a95a0')
      +cd(232,96,104,138,150,BLUE,20)+cd(266,84,148,94,162,RED,30)
      +tx(250,224,'상승 장악형',undefined,13,INK,1)+tx(250,242,'음봉을 통째로 삼킨 양봉',undefined,11.5,'#8a95a0')
      +cd(398,116,158,124,168,RED,20)+cd(426,92,132,98,140,RED,20)+cd(454,66,106,72,114,RED,20)
      +tx(426,224,'적삼병',undefined,13,INK,1)+tx(426,242,'3일 연속 힘있는 양봉',undefined,11.5,'#8a95a0'));
    // ④ 하락 경고 3형제 — 유성형·하락 장악형·흑삼병
    A['candle-bear']=svg(500,262,
      cd(48,150,200,174,208,GRAY,18)+cd(76,116,166,140,174,GRAY,18)+cd(108,52,120,134,146,BLUE,24)
      +tx(80,224,'유성형',undefined,13,INK,1)+tx(80,242,'천장에서 긴 윗꼬리',undefined,11.5,'#8a95a0')
      +cd(232,96,138,104,150,RED,20)+cd(266,84,94,148,162,BLUE,30)
      +tx(250,224,'하락 장악형',undefined,13,INK,1)+tx(250,242,'양봉을 통째로 삼킨 음봉',undefined,11.5,'#8a95a0')
      +cd(398,60,72,106,116,BLUE,20)+cd(426,88,98,132,142,BLUE,20)+cd(454,114,124,158,168,BLUE,20)
      +tx(426,224,'흑삼병',undefined,13,INK,1)+tx(426,242,'3일 연속 무거운 음봉',undefined,11.5,'#8a95a0'));
    // ⑥ 미수 매매 — 현금 매매 vs 증거금률 40% 미수 매매(내 돈+외상) 막대 비교
    A['margin-buy']=svg(480,262,
      ln(50,210,380,210)
      +'<rect x="70" y="130" width="70" height="80" fill="'+BLUE+'" rx="3"/>'
      +tx(105,118,'내 돈 100만원',undefined,12,BLUE,1)
      +tx(105,228,'현금 매매',undefined,13,INK,1)
      +tx(105,246,'= 100만원어치 매수',undefined,11.5,'#8a95a0')
      +'<rect x="250" y="130" width="70" height="80" fill="'+BLUE+'" rx="3"/>'
      +'<rect x="250" y="10" width="70" height="120" fill="'+RED+'" rx="3"/>'
      +tx(325,72,'외상(미수) 150만원','start',12,RED,1)
      +tx(325,174,'내 돈 100만원','start',12,BLUE,1)
      +tx(285,228,'미수 매매',undefined,13,INK,1)
      +tx(285,246,'= 250만원어치 매수',undefined,11.5,'#8a95a0'));
    // ⑦ 사이드카 — 선물이 급변하면 프로그램 매매만 5분간 잠그는 모습
    A['sidecar-lock']=svg(460,190,
      ln(40,150,420,150)
      +tx(120,40,'프로그램 매매','start',13,INK,1)
      +'<rect x="40" y="60" width="160" height="30" fill="'+GRAY+'" rx="6"/>'
      +tx(120,80,'평소: 자유롭게 주문',undefined,12,INK)
      +'<rect x="260" y="60" width="160" height="30" fill="'+RED+'22" stroke="'+RED+'" stroke-width="1.5" rx="6"/>'
      +tx(340,80,'선물 급변 5분간: 잠금 🔒',undefined,12,RED,1)
      +tx(230,120,'→','start',22,'#8a95a0')
      +tx(230,168,'사이드카 발동',undefined,13,INK,1));
    // ⑧ 시가총액 가중 — 큰 회사가 지수에 더 큰 영향을 주는 이유
    A['cap-weight']=svg(480,280,
      tx(105,26,'회사 A · 시가총액 60조',undefined,12,INK,1)
      +tx(325,26,'회사 C · 시가총액 10조',undefined,12,INK,1)
      +ln(40,230,440,230)
      +'<rect x="70" y="70" width="70" height="160" fill="'+BLUE+'" rx="3"/>'
      +'<rect x="70" y="54" width="70" height="16" fill="'+RED+'" rx="3"/>'
      +tx(105,248,'+10% 올랐다',undefined,12.5,RED,1)
      +tx(105,266,'→ 6조 늘어남',undefined,11.5,'#8a95a0')
      +'<rect x="290" y="203" width="70" height="27" fill="'+BLUE+'" rx="3"/>'
      +'<rect x="290" y="200" width="70" height="3" fill="'+RED+'" rx="1"/>'
      +tx(325,248,'+10% 올랐다',undefined,12.5,RED,1)
      +tx(325,266,'→ 1조 늘어남',undefined,11.5,'#8a95a0'));
    // ⑨ 신용창조 — 예금 100원이 은행을 돌면서 대출로 계속 다시 태어나는 모습(자본주의 EP1)
    A['credit-creation']=svg(520,260,
      tx(260,26,'예금 100원이 은행 세 곳을 돌면 …',undefined,13,INK,1)
      +'<rect x="20" y="50" width="130" height="46" fill="'+BLUE+'" rx="4"/>'+tx(85,78,'예금 100원',undefined,13,'#fff',1)
      +tx(85,112,'은행A',undefined,12,INK,1)
      +'<rect x="30" y="122" width="45" height="22" fill="'+GRAY+'" rx="3"/>'+tx(52,137,'10원 보관',undefined,10,INK)
      +'<rect x="95" y="122" width="45" height="22" fill="'+RED+'" rx="3"/>'+tx(117,137,'90원 대출',undefined,10,'#fff',1)
      +tx(178,142,'→',undefined,20,'#8a95a0')
      +'<rect x="200" y="50" width="120" height="42" fill="'+BLUE+'" rx="4"/>'+tx(260,76,'예금 90원',undefined,12.5,'#fff',1)
      +tx(260,112,'은행B',undefined,12,INK,1)
      +'<rect x="207" y="122" width="42" height="22" fill="'+GRAY+'" rx="3"/>'+tx(228,137,'9원 보관',undefined,10,INK)
      +'<rect x="268" y="122" width="42" height="22" fill="'+RED+'" rx="3"/>'+tx(289,137,'81원 대출',undefined,9.5,'#fff',1)
      +tx(345,142,'→',undefined,20,'#8a95a0')
      +'<rect x="365" y="50" width="120" height="38" fill="'+BLUE+'" rx="4"/>'+tx(425,74,'예금 81원',undefined,12,'#fff',1)
      +tx(425,112,'은행C…',undefined,12,INK,1)
      +tx(260,190,'원래 100원이 은행을 돌 때마다 「대출」이라는 새 돈이 자꾸 태어나요',undefined,12.5,INK,1)
      +tx(260,210,'(끝까지 반복하면 이론상 최대 1,000원 가까이 불어날 수 있어요)',undefined,11.5,'#8a95a0')
      +tx(260,236,'→ 이렇게 대출로 만들어지는 돈을 "신용통화"라고 불러요',undefined,12,'#8a95a0'));
    // ⑩ 이자의 함정 — 세상에 없는 돈, 500원은 어디에도 없다(자본주의 EP1 섬 실험)
    A['debt-interest-gap']=svg(480,240,
      tx(240,26,'중앙은행이 10,000원을 발행해서 빌려줬다면?',undefined,13,INK,1)
      +'<rect x="120" y="50" width="240" height="40" fill="'+BLUE+'" rx="4"/>'+tx(240,75,'세상에 존재하는 돈 10,000원',undefined,13,'#fff',1)
      +'<rect x="120" y="110" width="240" height="40" fill="'+BLUE+'" rx="4"/>'
      +'<rect x="360" y="110" width="14" height="40" fill="'+RED+'" rx="2"/>'
      +tx(230,135,'갚아야 할 원금 10,000원',undefined,12.5,'#fff',1)
      +tx(390,135,'+이자 500원','start',12.5,RED,1)
      +tx(240,178,'갚아야 할 돈은 10,500원인데, 세상에 있는 돈은 딱 10,000원',undefined,12.5,INK,1)
      +tx(240,200,'이자 500원에 해당하는 돈은 애초에 어디에도 없어요',undefined,12.5,RED,1)
      +tx(240,222,'→ 그래서 새 대출이 계속 생겨야만 예전 이자를 갚을 수 있어요',undefined,11.5,'#8a95a0'));
    // ⑪ 근저당·채권최고액 — 실제 대출 1억 vs 등기부에 적히는 120%(채권최고액)
    A['geunjeodang']=svg(480,250,
      ln(60,200,420,200)
      +'<rect x="90" y="90" width="90" height="110" fill="'+BLUE+'" rx="4"/>'
      +tx(135,78,'실제 대출 1억원',undefined,12.5,BLUE,1)
      +tx(135,220,'내가 진짜 빌린 돈',undefined,12,INK,1)
      +tx(135,238,'= 1억원',undefined,11.5,'#8a95a0')
      +'<rect x="300" y="90" width="90" height="110" fill="'+BLUE+'" rx="4"/>'
      +'<rect x="300" y="68" width="90" height="22" fill="'+RED+'" rx="3"/>'
      +tx(345,58,'+20% 여유분',undefined,11.5,RED,1)
      +tx(345,220,'등기부에 적히는 채권최고액',undefined,11.5,INK,1)
      +tx(345,238,'= 1억 2,000만원 (120%)',undefined,11.5,RED,1)
      +tx(240,150,'→',undefined,22,'#8a95a0'));
    // ⑪-2 셀러 파이낸싱 — 매도인이 잔금 못 받은 돈을 그 집에 근저당으로 담보(이재명 대통령 사례)
    A['seller-mortgage']=svg(500,240,
      tx(90,26,'매도인(파는 사람)',undefined,12,INK,1)
      +'<rect x="30" y="42" width="120" height="60" fill="'+BLUE+'" rx="4"/>'
      +tx(90,78,'"잔금 아직 못 받았어요"',undefined,11,'#fff',1)
      +tx(90,124,'집 소유권 먼저 이전',undefined,11.5,INK,1)
      +tx(250,60,'━━━━━━━▶',undefined,16,'#8a95a0')
      +tx(410,26,'매수인(사는 사람)',undefined,12,INK,1)
      +'<rect x="350" y="42" width="120" height="60" fill="'+BLUE+'" rx="4"/>'
      +tx(410,68,'10월에 잔금',undefined,11,'#fff',1)
      +tx(410,86,'들어올 예정',undefined,11,'#fff',1)
      +'<rect x="150" y="150" width="220" height="60" fill="'+RED+'" rx="6"/>'
      +tx(260,174,'그 집에 근저당권 설정',undefined,12.5,'#fff',1)
      +tx(260,196,'채권최고액 17.7억 — "못 받은 돈 담보"',undefined,11.5,'#fff',1)
      +tx(260,228,'잔금 들어오면 갚고 → 근저당 말소',undefined,11.5,'#8a95a0'));
    // ⑫ 대출한도 축소 — 규제 전 vs 6억 한도+스트레스 DSR
    A['loan-shrink']=svg(480,270,
      ln(50,220,430,220)
      +'<rect x="60" y="55" width="85" height="165" fill="'+GRAY+'" rx="4"/>'
      +tx(102,42,'규제 전',undefined,12,INK,1)
      +tx(102,240,'예: 8~9억도',undefined,11,'#8a95a0')
      +tx(102,257,'가능했음',undefined,11,'#8a95a0')
      +'<rect x="195" y="135" width="85" height="85" fill="'+BLUE+'" rx="4"/>'
      +'<line x1="185" y1="135" x2="285" y2="135" stroke="'+RED+'" stroke-width="2" stroke-dasharray="5 3"/>'
      +tx(280,129,'6억 천장','end',11,RED,1)
      +tx(237,42,'6·27 대책',undefined,12,INK,1)
      +tx(237,240,'수도권 주담대',undefined,11,'#8a95a0')
      +tx(237,257,'6억 한도',undefined,11,'#8a95a0')
      +'<rect x="330" y="175" width="85" height="45" fill="'+RED+'" rx="4"/>'
      +'<line x1="320" y1="175" x2="420" y2="175" stroke="'+RED+'" stroke-width="2" stroke-dasharray="5 3"/>'
      +tx(415,169,'3억','end',11,RED,1)
      +tx(372,42,'KB 등 은행 자체',undefined,11.5,INK,1)
      +tx(372,240,'+스트레스 DSR',undefined,11,'#8a95a0')
      +tx(372,257,'로 더 축소',undefined,11,'#8a95a0'));
    // ⑬ 부동산 초보 5단계 로드맵
    A['estate-roadmap']=svg(520,150,
      (function(){
        const steps=['① 용어·기초','② 시장흐름','③ 임장(현장)','④ 등기부확인','⑤ 자금계획'];
        let s='';
        steps.forEach((t,i)=>{
          const x=30+i*98;
          s+='<rect x="'+x+'" y="50" width="84" height="50" fill="'+(i===0?BLUE:'#eef2f7')+'" stroke="'+BLUE+'" stroke-width="1.5" rx="8"/>';
          s+=tx(x+42,80,t,undefined,10.5,(i===0?'#fff':INK),1);
          if(i<steps.length-1) s+=tx(x+90,80,'›',undefined,18,'#8a95a0');
        });
        return s+tx(260,128,'차근차근 순서대로 밟으면 초보도 길을 잃지 않아요',undefined,12,'#8a95a0');
      })());
    // ⑭ 서브프라임·CDO 포장 — 성한 대출+썩은 대출을 섞어 'AAA 안전상품'으로 포장해 판매(리먼)
    A['cdo-repackage']=svg(520,230,
      tx(80,30,'여러 주택담보대출',undefined,12,INK,1)
      +'<rect x="30" y="45" width="100" height="26" fill="'+BLUE+'" rx="3"/>'+tx(80,63,'우량 대출',undefined,11,'#fff',1)
      +'<rect x="30" y="76" width="100" height="26" fill="'+BLUE+'" rx="3"/>'+tx(80,94,'우량 대출',undefined,11,'#fff',1)
      +'<rect x="30" y="107" width="100" height="26" fill="'+RED+'" rx="3"/>'+tx(80,125,'서브프라임',undefined,11,'#fff',1)
      +'<rect x="30" y="138" width="100" height="26" fill="'+RED+'" rx="3"/>'+tx(80,156,'서브프라임',undefined,11,'#fff',1)
      +tx(160,110,'→',undefined,22,'#8a95a0')
      +'<rect x="195" y="55" width="130" height="105" fill="#eef2f7" stroke="'+INK+'" stroke-width="1.5" rx="6"/>'
      +tx(260,50,'한 상자에 섞어 포장',undefined,11.5,INK,1)
      +'<rect x="212" y="72" width="46" height="34" fill="'+BLUE+'" rx="3"/>'
      +'<rect x="264" y="72" width="46" height="34" fill="'+BLUE+'" rx="3"/>'
      +'<rect x="212" y="112" width="46" height="34" fill="'+RED+'" rx="3"/>'
      +'<rect x="264" y="112" width="46" height="34" fill="'+BLUE+'" rx="3"/>'
      +tx(260,178,'"안전한 AAA 상품"',undefined,12,RED,1)
      +tx(355,110,'→',undefined,22,'#8a95a0')
      +'<rect x="390" y="80" width="110" height="55" fill="'+BLUE+'" rx="6"/>'
      +tx(445,103,'전 세계 투자자',undefined,11.5,'#fff',1)
      +tx(445,120,'에게 판매',undefined,11.5,'#fff',1)
      +tx(445,160,'집값 꺾이자',undefined,11.5,INK,1)
      +tx(445,178,'상자째 부실 💥',undefined,11.5,RED,1)
      +tx(260,212,'어느 상자에 썩은 대출이 얼마나 든 지 몰라 → 모두 겁에 질려 금융 도미노',undefined,11.5,'#8a95a0'));
    // ⑤ 갭(창) — 전일 고가와 오늘 저가 사이의 빈 공간
    A['candle-gap']=svg(440,240,
      cd(140,86,150,96,166,RED,34)
      +cd(280,26,58,32,64,RED,34)
      +ln(110,86,340,86)+ln(110,64,340,64)
      +'<rect x="110" y="64" width="230" height="22" fill="#e0525212"/>'
      +tx(365,80,'갭(창)','start',13,RED,1)
      +tx(140,196,'어제 — 여기까지 오르고 마감',undefined,12,'#8a95a0')+tx(280,120,'오늘 — 훌쩍 띄워서 시작',undefined,12,'#8a95a0')
      +tx(220,222,'밤사이 큰 뉴스가 만든 빈 공간 — 메우느냐 마느냐가 힘의 시험대',undefined,12,INK));
    // ⑮ 집 매매 4단계 흐름 — 계약금→중도금→잔금→등기
    A['trade-flow']=svg(520,150,
      (function(){
        const steps=[['계약금','10%'],['중도금','40%내외'],['잔금','나머지'],['등기','60일 이내']];
        let s='';
        steps.forEach((t,i)=>{
          const x=30+i*118;
          s+='<rect x="'+x+'" y="45" width="100" height="60" fill="'+(i===2?BLUE:'#eef2f7')+'" stroke="'+BLUE+'" stroke-width="1.5" rx="8"/>';
          s+=tx(x+50,72,t[0],undefined,13,(i===2?'#fff':INK),1);
          s+=tx(x+50,92,t[1],undefined,10.5,(i===2?'#fff':'#8a95a0'));
          if(i<steps.length-1) s+=tx(x+109,80,'›',undefined,18,'#8a95a0');
        });
        return s+tx(260,128,'계약 체결 → 잔금·등기까지 보통 1~2개월',undefined,12,'#8a95a0');
      })());
    // ⑯ 경매 말소기준권리 컷오프라인 — 등기부 권리들을 위에서 아래로, 기준선 아래는 소멸
    A['auction-cutoff']=svg(480,260,
      tx(240,26,'등기부에 쌓인 권리들(위=오래된 순)',undefined,12,INK,1)
      +'<rect x="120" y="40" width="240" height="30" fill="#eef2f7" stroke="'+INK+'" stroke-width="1" rx="4"/>'+tx(240,60,'1순위 근저당권 (2020년)',undefined,11.5,INK)
      +'<rect x="120" y="74" width="240" height="30" fill="#eef2f7" stroke="'+INK+'" stroke-width="1" rx="4"/>'+tx(240,94,'2순위 가압류 (2022년)',undefined,11.5,INK)
      +'<line x1="90" y1="112" x2="390" y2="112" stroke="'+RED+'" stroke-width="2.5" stroke-dasharray="6 4"/>'
      +tx(400,116,'← 말소기준권리 선','start',11.5,RED,1)
      +'<rect x="120" y="122" width="240" height="30" fill="'+BLUE+'" opacity=".15" stroke="'+BLUE+'" stroke-width="1" rx="4"/>'+tx(240,142,'3순위 전입신고 세입자 (2023년)',undefined,11.5,INK)
      +'<rect x="120" y="156" width="240" height="30" fill="'+BLUE+'" opacity=".15" stroke="'+BLUE+'" stroke-width="1" rx="4"/>'+tx(240,176,'4순위 경매개시결정 (2026년)',undefined,11.5,INK)
      +tx(240,206,'기준선 위(오래된 권리) → 낙찰과 함께 전부 소멸',undefined,11.5,'#8a95a0')
      +tx(240,224,'기준선 아래(대항력 있는 세입자 등) → 낙찰자가 떠안을 수 있음',undefined,11.5,'#8a95a0')
      +tx(240,246,'그래서 입찰 전 "말소기준권리가 몇 번째인지" 확인이 핵심이에요',undefined,11.5,RED,1));
    // ⑯ ISA 제도 정비(2026 세제개편, 조특법 §91의18) — 현행 vs 개정안 표
    A['isa-reform-table']=(function(){
      const L=10,C1=124,C2=316,W1=C2-C1-6,W2=520-C2-10,RH=[36,58,74,52,50];
      let y=10,s='';
      // 헤더
      s+='<rect x="'+L+'" y="'+y+'" width="500" height="'+RH[0]+'" fill="'+BLUE+'" rx="6"/>';
      s+=tx(C1+W1/2,y+23,'현행',undefined,13,'#fff',1)+tx(C2+W2/2,y+23,'개정안',undefined,13,'#fff',1);
      y+=RH[0]+4;
      const rows=[
        ['계약기간','최소 3년,\n이후 제한 없이 연장','최초 3년,\n총 5년까지 연장',true],
        ['연 납입한도','2천만원×(1+가입경과연수)\n− 누적납입액 (최대 4년)','매년 2천만원\n(계산식 단순화)',true],
        ['총 납입한도','1억원','1억원 (동일)',false],
        ['적용기한','규정 없음',"'29.12.31까지\n가입분",true],
      ];
      rows.forEach((r,i)=>{
        const h=RH[i+1], mid=y+h/2, changed=r[3];
        s+='<rect x="'+L+'" y="'+y+'" width="500" height="'+h+'" fill="'+(i%2?'#f4f6f8':'#fff')+'" stroke="'+GRAY+'" stroke-width="1"/>';
        if(changed) s+='<rect x="'+C2+'" y="'+y+'" width="'+W2+'" height="'+h+'" fill="'+BLUE+'12"/>';
        s+=tx(L+8,mid+4,r[0],'start',12,INK,1);
        const put=(cx,txt)=>{
          const parts=String(txt).split('\n');
          if(parts.length===1) s+=tx(cx,mid+4,parts[0],undefined,11.5,INK);
          else s+=tx(cx,mid-4,parts[0],undefined,11.5,INK)+tx(cx,mid+13,parts[1],undefined,11.5,INK);
        };
        put(C1+W1/2,r[1]); put(C2+W2/2,r[2]);
        y+=h;
      });
      return svg(520,y+8,s);
    })();
    return A;
  })();
  function bodyHTML(md){
    const lines=String(md||'').split('\n');
    let html='', para=[], list=null;
    const flushP=()=>{ if(para.length){ html+='<p>'+para.map(inline).join('<br>')+'</p>'; para=[]; } };
    const flushL=()=>{ if(list){ html+='<ul>'+list.map(x=>'<li>'+inline(x)+'</li>').join('')+'</ul>'; list=null; } };
    lines.forEach(ln=>{
      const t=ln.trim();
      if(!t){ flushP(); flushL(); return; }
      const im=t.match(/^\[\[img:([a-z0-9-]+)(?:\|([^\]]*))?\]\]$/);   // 도해 토큰
      if(im){ flushP(); flushL();
        if(LESSON_ART[im[1]]){
          const label=escN(im[2]||'주식 학습');
          const art=LESSON_ART[im[1]].replace('<svg ','<svg aria-label="'+label+' 도해" ');
          html+='<figure class="ls-fig">'+art+(im[2]?'<figcaption>'+inline(im[2])+'</figcaption>':'')+'</figure>';
        }
        return; }
      if(t.indexOf('## ')===0){ flushP(); flushL(); html+='<h4>'+inline(t.slice(3))+'</h4>'; return; }
      if(t.indexOf('- ')===0){ flushP(); if(!list) list=[]; list.push(t.slice(2)); return; }
      flushL(); para.push(t);
    });
    flushP(); flushL();
    return html;
  }
  /* 종목공부 글 하단 "이 종목 분석 보기" 링크.
     STOCKS(=tickers.js 600종목)에 실제로 있는 코드일 때만 렌더한다.
     해외 종목(JPM·BRK.B 등)은 분석 대상이 아니라 링크가 죽으므로 아예 만들지 않는다. */
  function studyStockCode(a){
    const code=String(a&&a.code||'').trim();
    if(!code) return '';
    if(typeof STOCKS==='undefined'||!STOCKS[code]||!STOCKS[code].name) return '';
    return code;
  }
  function studyStockLinkHTML(a){
    const code=studyStockCode(a); if(!code) return '';
    return `<div class="nw-golink"><a href="?m=single&code=${escN(code)}" data-study-code="${escN(code)}"`+
      ` aria-label="${escN(STOCKS[code].name)} 분석 보기">이 종목 분석 보기 ›</a></div>`;
  }
  window.renderStudy=function(){
    const box=document.getElementById('studyView'); if(!box) return;
    window.GaeoContentAd.park();
    const all=(typeof STOCK_STUDY!=='undefined'&&Array.isArray(STOCK_STUDY))?STOCK_STUDY.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const hero=`<div class="nw-hero"><h2>종목공부</h2>
      <p>"이 회사가 뭐 하는 곳인지"를 초보자 눈높이로 풀어드려요. 카테고리를 먼저 골라보세요.
      제목을 누르면 전체 내용이 펼쳐져요.</p>
      ${searchBoxHTML('stSearchInput', stSearchQ, escN)}</div>`;
    const q=stSearchQ.trim().toLowerCase();
    if(!q && !stCatSel){
      box.innerHTML=hero+catPickerHTML(STUDY_CATS, all);
      wireSearchInput(box, 'stSearchInput', v=>{ stSearchQ=v; page=1; window.renderStudy(); });
      box.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{
        stCatSel=el.dataset.cat; page=1; window.renderStudy();
        focusContentHeading(box);
        box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
      });
      return;
    }
    const searching=q.length>0;
    const filtered=searching
      ? all.filter(a=>(a.name||'').toLowerCase().includes(q)||(a.tag||'').toLowerCase().includes(q)||(a.code||'').toLowerCase().includes(q))
      : (stCatSel==='__all__'?all:all.filter(x=>x.cat===stCatSel));
    const backHtml=searching
      ? `<button type="button" class="cat-back" id="stSearchClear">← 검색 지우기</button><div class="cat-current">"${escN(stSearchQ)}" 검색결과 ${filtered.length}건</div>`
      : catBackHTML(STUDY_CATS, stCatSel);
    const pages=Math.max(1, Math.ceil(filtered.length/PAGE_SIZE));
    if(page>pages) page=pages; if(page<1) page=1;
    const slice=filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
    let h=hero+backHtml;
    h+=slice.length
      ? slice.map(a=>`<div class="nw-item" id="st-${a.id}">
          <button type="button" class="nw-head" data-st="${a.id}" aria-expanded="false" aria-controls="st-body-${a.id}">
            <span class="nw-meta"><span class="nw-date">${escN(a.date||'')}</span>${a.tag?`<span class="nw-tag">${escN(a.tag)}</span>`:''}</span>
            <span class="nw-title">${escN(a.name||'')}${a.code?` <span style="color:var(--faint);font-weight:600">(${escN(a.code)})</span>`:''} <span class="nw-arrow" aria-hidden="true">▸</span></span>
          </button>
          <div class="nw-body" id="st-body-${a.id}">${bodyHTML(a.body)}
            ${studyStockLinkHTML(a)}
            ${Array.isArray(a.sources)&&a.sources.length?`<div class="nw-src">참고 자료<br>`+
              a.sources.map(s=>`· <a href="${escN(s.url)}" target="_blank" rel="noopener">${escN(s.name||s.url)}</a>`).join('<br>')+`</div>`:''}
            <div class="nw-disc">※ 회사 이해를 돕기 위한 공부 자료예요. 투자 권유가 아니며, 투자 판단과 책임은 본인에게 있어요.</div>
          </div>
        </div>`).join('')
      : `<div class="nw-item"><div class="nw-empty">${searching?'검색 결과가 없어요.':'아직 등록된 종목공부가 없어요.'}</div></div>`;
    if(pages>1){
      h+=`<div class="nw-pager">
        <button class="nw-pg" data-pg="${page-1}" ${page<=1?'disabled':''}>‹ 이전</button>`+
        Array.from({length:pages},(_,i)=>`<button class="nw-pg${i+1===page?' on':''}" data-pg="${i+1}">${i+1}</button>`).join('')+
        `<button class="nw-pg" data-pg="${page+1}" ${page>=pages?'disabled':''}>다음 ›</button></div>`;
    }
    box.innerHTML=h;
    wireSearchInput(box, 'stSearchInput', v=>{ stSearchQ=v; page=1; window.renderStudy(); });
    if(searching){
      const clearBtn=box.querySelector('#stSearchClear');
      if(clearBtn) clearBtn.onclick=()=>{ stSearchQ=''; page=1; window.renderStudy(); focusContentHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    } else {
      const stBack=box.querySelector('.cat-back');
      if(stBack) stBack.onclick=()=>{ stCatSel=null; page=1; window.renderStudy(); focusContentHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    }
    box.querySelectorAll('.nw-head').forEach(el=>el.onclick=()=>{
      const item=document.getElementById('st-'+el.dataset.st);
      if(item){ const open=item.classList.toggle('open'); el.setAttribute('aria-expanded',String(open));
        if(open){ window.GaeoContentAd.mount(item); window.GaeoMetrics.contentView('study',el.dataset.st,item); }
        else if(window.GaeoContentAd.isInside(item)) window.GaeoContentAd.park();
        history.replaceState(null,'', open?('?m=study&id='+el.dataset.st):location.pathname); }
    });
    box.querySelectorAll('.nw-pg').forEach(b=>b.onclick=()=>{
      const p=parseInt(b.dataset.pg,10);
      if(!p||p===page||b.disabled) return;
      page=p; renderStudy();
      focusContentHeading(box);
      box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
    });
    // 페이지 전체를 다시 부르지 않고 그 자리에서 단일 분석 화면으로 전환한다
    // (href는 새 탭·링크 복사용 fallback으로 그대로 둔다).
    box.querySelectorAll('[data-study-code]').forEach(el=>el.onclick=ev=>{
      const s=STOCKS[el.dataset.studyCode];
      if(!s||!s.name) return;
      ev.preventDefault();
      jumpToStock(s.name);
    });
    if(!searching&&page===1&&slice.length){
      const first=document.getElementById('st-'+slice[0].id);
      if(first){ first.classList.add('open'); first.querySelector('.nw-head')?.setAttribute('aria-expanded','true'); window.GaeoContentAd.mount(first); }
    }
  };
  window.openStudyId=function(id){
    const all=(typeof STOCK_STUDY!=='undefined'&&Array.isArray(STOCK_STUDY))?STOCK_STUDY.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const target=all.find(a=>String(a.id)===String(id)); if(!target) return;
    stCatSel=target.cat||'__all__';
    const filtered=all.filter(x=>x.cat===stCatSel);
    const idx=filtered.findIndex(a=>String(a.id)===String(id));
    page=idx<0?1:Math.floor(idx/PAGE_SIZE)+1; window.renderStudy();
    const el=document.getElementById('st-'+id);
    if(el){
      el.classList.add('open');
      el.querySelector('.nw-head')?.setAttribute('aria-expanded','true');
      window.GaeoContentAd.mount(el);
      window.GaeoMetrics.contentView('study',id,el);
      setTimeout(()=>el.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}),80);
    }
  };

  // ---------- 🎓 주식공부 모드 ----------
  // stock_lessons.js(STOCK_LESSONS 배열)에 "투자 기초 지식" 글을 쌓는다(차트 보는 법 등).
  // 종목공부(회사 소개)와 형식은 같고 주제만 다르다 — bodyHTML 등 헬퍼를 그대로 공유.
  let lsPage=1;
  window.renderLesson=function(){
    const box=document.getElementById('lessonView'); if(!box) return;
    window.GaeoContentAd.park();
    const all=(typeof STOCK_LESSONS!=='undefined'&&Array.isArray(STOCK_LESSONS))?STOCK_LESSONS.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const hero=`<div class="nw-hero"><h2>주식공부</h2>
      <p>차트 보는 법, 캔들 읽는 법 같은 <b>투자 기초 지식</b>을 초보자 눈높이로 하나씩 배워요.
      카테고리를 먼저 골라보세요. 제목을 누르면 전체 내용이 펼쳐져요.</p>
      ${searchBoxHTML('lsSearchInput', lsSearchQ, escN)}</div>`;
    const q=lsSearchQ.trim().toLowerCase();
    if(!q && !lsCatSel){
      box.innerHTML=hero+catPickerHTML(LESSON_CATS, all);
      wireSearchInput(box, 'lsSearchInput', v=>{ lsSearchQ=v; lsPage=1; window.renderLesson(); });
      box.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{
        lsCatSel=el.dataset.cat; lsPage=1; window.renderLesson();
        focusContentHeading(box);
        box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
      });
      return;
    }
    const searching=q.length>0;
    const filtered=searching
      ? all.filter(a=>(a.name||'').toLowerCase().includes(q)||(a.tag||'').toLowerCase().includes(q))
      : (lsCatSel==='__all__'?all:all.filter(x=>x.cat===lsCatSel));
    const backHtml=searching
      ? `<button type="button" class="cat-back" id="lsSearchClear">← 검색 지우기</button><div class="cat-current">"${escN(lsSearchQ)}" 검색결과 ${filtered.length}건</div>`
      : catBackHTML(LESSON_CATS, lsCatSel);
    const pages=Math.max(1, Math.ceil(filtered.length/PAGE_SIZE));
    if(lsPage>pages) lsPage=pages; if(lsPage<1) lsPage=1;
    const slice=filtered.slice((lsPage-1)*PAGE_SIZE, lsPage*PAGE_SIZE);
    let h=hero+backHtml;
    h+=slice.length
      ? slice.map(a=>`<div class="nw-item" id="ls-${a.id}">
          <button type="button" class="nw-head" data-ls="${a.id}" aria-expanded="false" aria-controls="ls-body-${a.id}">
            <span class="nw-meta"><span class="nw-date">${escN(a.date||'')}</span>${a.tag?`<span class="nw-tag">${escN(a.tag)}</span>`:''}</span>
            <span class="nw-title">${escN(a.name||'')} <span class="nw-arrow" aria-hidden="true">▸</span></span>
          </button>
          <div class="nw-body" id="ls-body-${a.id}">${bodyHTML(a.body)}
            ${Array.isArray(a.sources)&&a.sources.length?`<div class="nw-src">참고 자료<br>`+
              a.sources.map(s=>`· <a href="${escN(s.url)}" target="_blank" rel="noopener">${escN(s.name||s.url)}</a>`).join('<br>')+`</div>`:''}
            <div class="nw-disc">※ 투자 기초를 익히는 공부 자료예요. 투자 권유가 아니며, 투자 판단과 책임은 본인에게 있어요.</div>
          </div>
        </div>`).join('')
      : `<div class="nw-item"><div class="nw-empty">${searching?'검색 결과가 없어요.':'아직 등록된 주식공부가 없어요.'}</div></div>`;
    if(pages>1){
      h+=`<div class="nw-pager">
        <button class="nw-pg" data-pg="${lsPage-1}" ${lsPage<=1?'disabled':''}>‹ 이전</button>`+
        Array.from({length:pages},(_,i)=>`<button class="nw-pg${i+1===lsPage?' on':''}" data-pg="${i+1}">${i+1}</button>`).join('')+
        `<button class="nw-pg" data-pg="${lsPage+1}" ${lsPage>=pages?'disabled':''}>다음 ›</button></div>`;
    }
    box.innerHTML=h;
    wireSearchInput(box, 'lsSearchInput', v=>{ lsSearchQ=v; lsPage=1; window.renderLesson(); });
    if(searching){
      const clearBtn=box.querySelector('#lsSearchClear');
      if(clearBtn) clearBtn.onclick=()=>{ lsSearchQ=''; lsPage=1; window.renderLesson(); focusContentHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    } else {
      const lsBack=box.querySelector('.cat-back');
      if(lsBack) lsBack.onclick=()=>{ lsCatSel=null; lsPage=1; window.renderLesson(); focusContentHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    }
    box.querySelectorAll('.nw-head').forEach(el=>el.onclick=()=>{
      const item=document.getElementById('ls-'+el.dataset.ls);
      if(item){ const open=item.classList.toggle('open'); el.setAttribute('aria-expanded',String(open));
        if(open){ window.GaeoContentAd.mount(item); window.GaeoMetrics.contentView('lesson',el.dataset.ls,item); }
        else if(window.GaeoContentAd.isInside(item)) window.GaeoContentAd.park();
        history.replaceState(null,'', open?('?m=lesson&id='+el.dataset.ls):location.pathname); }
    });
    box.querySelectorAll('.nw-pg').forEach(b=>b.onclick=()=>{
      const p=parseInt(b.dataset.pg,10);
      if(!p||p===lsPage||b.disabled) return;
      lsPage=p; window.renderLesson();
      focusContentHeading(box);
      box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
    });
    if(!searching&&lsPage===1&&slice.length){
      const first=document.getElementById('ls-'+slice[0].id);
      if(first){ first.classList.add('open'); first.querySelector('.nw-head')?.setAttribute('aria-expanded','true'); window.GaeoContentAd.mount(first); }
    }
  };
  window.openLessonId=function(id){
    const all=(typeof STOCK_LESSONS!=='undefined'&&Array.isArray(STOCK_LESSONS))?STOCK_LESSONS.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const target=all.find(a=>String(a.id)===String(id)); if(!target) return;
    lsCatSel=target.cat||'__all__';
    const filtered=all.filter(x=>x.cat===lsCatSel);
    const idx=filtered.findIndex(a=>String(a.id)===String(id));
    lsPage=idx<0?1:Math.floor(idx/PAGE_SIZE)+1; window.renderLesson();
    const el=document.getElementById('ls-'+id);
    if(el){
      el.classList.add('open');
      el.querySelector('.nw-head')?.setAttribute('aria-expanded','true');
      window.GaeoContentAd.mount(el);
      window.GaeoMetrics.contentView('lesson',id,el);
      setTimeout(()=>el.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}),80);
    }
  };

  // ---------- 🏠 부동산공부 모드 ----------
  // estate_lessons.js(ESTATE_LESSONS)에 "부동산 기초 지식" 글을 쌓는다. 주식공부와 형식·헬퍼 동일.
  // ⚠️ 일부 옛 글(id 6~12)이 name/tag 대신 title/tags 필드로 등록돼 제목이 안 보이던 문제를
  //   여기서 한 번 정규화해 고친다(데이터 파일은 그대로 두고 화면에서만 보정).
  (function normalizeEstate(){
    const arr=(typeof ESTATE_LESSONS!=='undefined'&&Array.isArray(ESTATE_LESSONS))?ESTATE_LESSONS:[];
    arr.forEach(a=>{
      if(!a.name && a.title) a.name=a.title;
      if(!a.tag && Array.isArray(a.tags)) a.tag=a.tags.join(' · ');
    });
  })();
  let esPage=1;
  window.renderEstate=function(){
    const box=document.getElementById('estateView'); if(!box) return;
    const all=(typeof ESTATE_LESSONS!=='undefined'&&Array.isArray(ESTATE_LESSONS))?ESTATE_LESSONS.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const hero=`<div class="nw-hero"><h2>부동산공부</h2>
      <p>내 집 마련·전월세·대출·청약처럼 <b>살면서 꼭 마주치는 부동산 기초</b>를 초보 눈높이로 하나씩 배워요.
      카테고리를 먼저 골라보세요. 제목을 누르면 전체 내용이 펼쳐져요.</p>
      ${searchBoxHTML('esSearchInput', esSearchQ, escN)}</div>`;
    const q=esSearchQ.trim().toLowerCase();
    if(!q && !esCatSel){
      box.innerHTML=hero+catPickerHTML(ESTATE_CATS, all);
      wireSearchInput(box, 'esSearchInput', v=>{ esSearchQ=v; esPage=1; window.renderEstate(); });
      box.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{
        esCatSel=el.dataset.cat; esPage=1; window.renderEstate();
        focusContentHeading(box);
        box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
      });
      return;
    }
    const searching=q.length>0;
    const filtered=searching
      ? all.filter(a=>(a.name||'').toLowerCase().includes(q)||(a.tag||'').toLowerCase().includes(q))
      : (esCatSel==='__all__'?all:all.filter(x=>x.cat===esCatSel));
    const backHtml=searching
      ? `<button type="button" class="cat-back" id="esSearchClear">← 검색 지우기</button><div class="cat-current">"${escN(esSearchQ)}" 검색결과 ${filtered.length}건</div>`
      : catBackHTML(ESTATE_CATS, esCatSel);
    const pages=Math.max(1, Math.ceil(filtered.length/PAGE_SIZE));
    if(esPage>pages) esPage=pages; if(esPage<1) esPage=1;
    const slice=filtered.slice((esPage-1)*PAGE_SIZE, esPage*PAGE_SIZE);
    let h=hero+backHtml;
    h+=slice.length
      ? slice.map(a=>`<div class="nw-item" id="es-${a.id}">
          <button type="button" class="nw-head" data-es="${a.id}" aria-expanded="false" aria-controls="es-body-${a.id}">
            <span class="nw-meta"><span class="nw-date">${escN(a.date||'')}</span>${a.tag?`<span class="nw-tag">${escN(a.tag)}</span>`:''}</span>
            <span class="nw-title">${escN(a.name||'')} <span class="nw-arrow" aria-hidden="true">▸</span></span>
          </button>
          <div class="nw-body" id="es-body-${a.id}">${bodyHTML(a.body)}
            ${Array.isArray(a.sources)&&a.sources.length?`<div class="nw-src">참고 자료<br>`+
              a.sources.map(s=>`· <a href="${escN(s.url)}" target="_blank" rel="noopener">${escN(s.name||s.url)}</a>`).join('<br>')+`</div>`:''}
            <div class="nw-disc">※ 부동산 기초를 익히는 공부 자료예요. 투자·매매 권유가 아니며, 판단과 책임은 본인에게 있어요.</div>
          </div>
        </div>`).join('')
      : `<div class="nw-item"><div class="nw-empty">${searching?'검색 결과가 없어요.':'아직 등록된 부동산공부가 없어요.'}</div></div>`;
    if(pages>1){
      h+=`<div class="nw-pager">
        <button class="nw-pg" data-pg="${esPage-1}" ${esPage<=1?'disabled':''}>‹ 이전</button>`+
        Array.from({length:pages},(_,i)=>`<button class="nw-pg${i+1===esPage?' on':''}" data-pg="${i+1}">${i+1}</button>`).join('')+
        `<button class="nw-pg" data-pg="${esPage+1}" ${esPage>=pages?'disabled':''}>다음 ›</button></div>`;
    }
    box.innerHTML=h;
    wireSearchInput(box, 'esSearchInput', v=>{ esSearchQ=v; esPage=1; window.renderEstate(); });
    if(searching){
      const clearBtn=box.querySelector('#esSearchClear');
      if(clearBtn) clearBtn.onclick=()=>{ esSearchQ=''; esPage=1; window.renderEstate(); focusContentHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    } else {
      const esBack=box.querySelector('.cat-back');
      if(esBack) esBack.onclick=()=>{ esCatSel=null; esPage=1; window.renderEstate(); focusContentHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    }
    box.querySelectorAll('.nw-head').forEach(el=>el.onclick=()=>{
      const item=document.getElementById('es-'+el.dataset.es);
      if(item){ const open=item.classList.toggle('open'); el.setAttribute('aria-expanded',String(open));
        if(open) window.GaeoMetrics.contentView('estate',el.dataset.es,item);
        history.replaceState(null,'', open?('?m=estate&id='+el.dataset.es):location.pathname); }
    });
    box.querySelectorAll('.nw-pg').forEach(b=>b.onclick=()=>{
      const p=parseInt(b.dataset.pg,10);
      if(!p||p===esPage||b.disabled) return;
      esPage=p; window.renderEstate();
      focusContentHeading(box);
      box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
    });
    if(!searching&&esPage===1&&slice.length){ const first=document.getElementById('es-'+slice[0].id); if(first){ first.classList.add('open'); first.querySelector('.nw-head')?.setAttribute('aria-expanded','true'); } }
  };
  window.openEstateId=function(id){
    const all=(typeof ESTATE_LESSONS!=='undefined'&&Array.isArray(ESTATE_LESSONS))?ESTATE_LESSONS.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const target=all.find(a=>String(a.id)===String(id)); if(!target) return;
    esCatSel=target.cat||'__all__';
    const filtered=all.filter(x=>x.cat===esCatSel);
    const idx=filtered.findIndex(a=>String(a.id)===String(id));
    esPage=idx<0?1:Math.floor(idx/PAGE_SIZE)+1; window.renderEstate();
    const el=document.getElementById('es-'+id);
    if(el){
      el.classList.add('open');
      el.querySelector('.nw-head')?.setAttribute('aria-expanded','true');
      window.GaeoMetrics.contentView('estate',id,el);
      setTimeout(()=>el.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}),80);
    }
  };
})();

// ---------- 🧮 계산기 모드 ----------
// calculators.js(CALCULATORS 배열)에 계산기를 쌓는다. 뉴스분석 등과 같은 카테고리·검색 UI를 공유하되,
// 본문 대신 실제 동작하는 계산기 위젯(calcWidgetHTML/wireCalcWidget)을 그린다.
(function(){
  const PAGE_SIZE=10;
  let calcPage=1;
  let calcCatSel=null;
  let calcSearchQ='';
  const escN=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inline=s=>SIGNUM(escN(s)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>'));
  function bodyHTML(md){
    const lines=String(md||'').split('\n');
    let html='', para=[], list=null;
    const flushP=()=>{ if(para.length){ html+='<p>'+para.map(inline).join('<br>')+'</p>'; para=[]; } };
    const flushL=()=>{ if(list){ html+='<ul>'+list.map(x=>'<li>'+inline(x)+'</li>').join('')+'</ul>'; list=null; } };
    lines.forEach(ln=>{
      const t=ln.trim();
      if(!t){ flushP(); flushL(); return; }
      if(t.indexOf('## ')===0){ flushP(); flushL(); html+='<h4>'+inline(t.slice(3))+'</h4>'; return; }
      if(t.indexOf('- ')===0){ flushP(); if(!list) list=[]; list.push(t.slice(2)); return; }
      flushL(); para.push(t);
    });
    flushP(); flushL();
    return html;
  }
  const n0=v=>{ const x=parseFloat(v); return isFinite(x)?x:0; };
  const fmtWon=v=>Math.round(v).toLocaleString('ko-KR')+'원';

  // 계산기별 입력 폼 HTML — id는 CALCULATORS 항목의 id를 접두로 써서 여러 계산기가 동시에 있어도 겹치지 않게 함
  function calcWidgetHTML(item){
    const p=k=>`c${item.id}-${k}`;
    if(item.calcType==='stockbreakeven'){
      return `<div class="calc-wrap">
        <div class="calc-title">주식 손익분기·순손익 계산</div>
        <div class="calc-row"><label>시장</label><select id="${p('market')}"><option value="kospi">KOSPI 주식</option><option value="kosdaq">KOSDAQ 주식</option><option value="etf">ETF·ETN</option><option value="custom">직접 설정</option></select></div>
        <div class="calc-row"><label>평균 매수가</label><input type="number" id="${p('buyPrice')}" value="50000" min="0" step="1"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>보유수량</label><input type="number" id="${p('qty')}" value="100" min="1" step="1"><span class="calc-unit">주</span></div>
        <div class="calc-row"><label>예상 매도가</label><input type="number" id="${p('sellPrice')}" value="52000" min="0" step="1"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>매수 수수료율</label><input type="number" id="${p('buyFee')}" value="0.015" min="0" max="100" step="0.001"><span class="calc-unit">%</span></div>
        <div class="calc-row"><label>매도 수수료율</label><input type="number" id="${p('sellFee')}" value="0.015" min="0" max="100" step="0.001"><span class="calc-unit">%</span></div>
        <div class="calc-row"><label>매도 세율</label><input type="number" id="${p('sellTax')}" value="0.20" min="0" max="100" step="0.01"><span class="calc-unit">%</span></div>
        <div class="calc-row"><label>기타 왕복 비용</label><input type="number" id="${p('fixedCost')}" value="0" min="0" step="1"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>목표 순수익률</label><input type="number" id="${p('targetReturn')}" value="10" min="-99" max="10000" step="0.1"><span class="calc-unit">%</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">비용 포함 가격 계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
        <div class="calc-note">2026년 7월 기준 기본값이에요. 실제 증권사 수수료와 종목별 세율을 확인해 수정하세요. KRX 호가단위로 올림한 주문 가능 가격도 함께 표시합니다.</div>
      </div>`;
    }
    if(item.calcType==='ipoallocation'){
      return `<div class="calc-wrap">
        <div class="calc-title">공모주 균등·비례 배정 계산</div>
        <div class="calc-row"><label>공모가</label><input type="number" id="${p('offerPrice')}" value="20000" min="1" step="1"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>내 청약주수</label><input type="number" id="${p('appliedShares')}" value="1000" min="1" step="1"><span class="calc-unit">주</span></div>
        <div class="calc-row"><label>청약 증거금률</label><input type="number" id="${p('marginRate')}" value="50" min="0.01" max="100" step="0.1"><span class="calc-unit">%</span></div>
        <div class="calc-row"><label>최소 청약주수</label><input type="number" id="${p('minimumShares')}" value="10" min="1" step="1"><span class="calc-unit">주</span></div>
        <div class="calc-row"><label>균등배정 물량</label><input type="number" id="${p('equalPool')}" value="100000" min="0" step="1"><span class="calc-unit">주</span></div>
        <div class="calc-row"><label>균등 대상 계좌 수</label><input type="number" id="${p('accountCount')}" value="150000" min="1" step="1"><span class="calc-unit">계좌</span></div>
        <div class="calc-row"><label>비례배정 물량</label><input type="number" id="${p('proportionalPool')}" value="100000" min="0" step="1"><span class="calc-unit">주</span></div>
        <div class="calc-row"><label>총 유효 청약주수</label><input type="number" id="${p('totalAppliedShares')}" value="200000000" min="1" step="1"><span class="calc-unit">주</span></div>
        <div class="calc-row"><label>청약수수료</label><input type="number" id="${p('subscriptionFee')}" value="2000" min="0" step="1"><span class="calc-unit">원</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">증거금·예상 배정 계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
        <div class="calc-note">해당 증권사의 최종 청약자료를 넣어야 의미가 있어요. 소수점 결과는 기대값이며 실제 배정은 인수회사의 단수주·추첨 기준에 따라 달라집니다.</div>
      </div>`;
    }
    if(item.calcType==='avgprice'){
      return `<div class="calc-wrap">
        <div class="calc-title">평단가 계산기</div>
        <div class="calc-row"><label>기존 보유수량</label><input type="number" id="${p('q1')}" placeholder="10" min="0"><span class="calc-unit">주</span></div>
        <div class="calc-row"><label>기존 평단가</label><input type="number" id="${p('p1')}" placeholder="50000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>추가매수 수량</label><input type="number" id="${p('q2')}" placeholder="10" min="0"><span class="calc-unit">주</span></div>
        <div class="calc-row"><label>추가매수 단가</label><input type="number" id="${p('p2')}" placeholder="40000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>목표 수익률</label><input type="number" id="${p('target')}" placeholder="10" min="-100" max="1000" step="0.1"><span class="calc-unit">%</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
        <div class="calc-note">목표 수익률에 0을 넣으면 손익분기점(본전) 가격을 알 수 있어요</div>
      </div>`;
    }
    if(item.calcType==='capitalgainstax'){
      return `<div class="calc-wrap">
        <div class="calc-title">해외주식 양도소득세 계산기</div>
        <div class="calc-row"><label>총 매도금액</label><input type="number" id="${p('sell')}" placeholder="15000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>총 매수금액</label><input type="number" id="${p('buy')}" placeholder="10000000" min="0"><span class="calc-unit">원</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
        <div class="calc-note">연 기본공제 250만원, 세율 22%(지방소득세 포함) 적용 · 국내 상장주식(대주주 제외)은 대부분 비과세예요</div>
      </div>`;
    }
    if(item.calcType==='compound'){
      return `<div class="calc-wrap">
        <div class="calc-title">복리 계산기</div>
        <div class="calc-row"><label>원금</label><input type="number" id="${p('principal')}" placeholder="5000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>매월 추가납입</label><input type="number" id="${p('monthly')}" placeholder="300000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>연 수익률</label><input type="number" id="${p('rate')}" placeholder="7" min="-50" max="100" step="0.1"><span class="calc-unit">%</span></div>
        <div class="calc-row"><label>투자 기간</label><input type="number" id="${p('years')}" placeholder="10" min="1" max="80"><span class="calc-unit">년</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
      </div>`;
    }
    if(item.calcType==='loanpayment'){
      return `<div class="calc-wrap">
        <div class="calc-title">대출 원리금상환 계산기</div>
        <div class="calc-row"><label>대출원금</label><input type="number" id="${p('principal')}" placeholder="300000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>연이자율</label><input type="number" id="${p('rate')}" placeholder="4.5" min="0" max="30" step="0.01"><span class="calc-unit">%</span></div>
        <div class="calc-row"><label>대출기간</label><input type="number" id="${p('years')}" placeholder="30" min="1" max="50"><span class="calc-unit">년</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
        <div class="calc-note">원리금균등상환 방식 기준 · 중도상환수수료·인지세 등 부대비용은 포함하지 않아요 · 부동산 매매 잔금용 대출이면 잔금 계산까지 되는 부동산 잔금·대출 계산기가 더 편해요</div>
      </div>`;
    }
    if(item.calcType==='balancepayment'){
      return `<div class="calc-wrap">
        <div class="calc-title">부동산 잔금·대출 계산기</div>
        <div class="calc-row"><label>매매가</label><input type="number" id="${p('price')}" placeholder="500000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>계약금</label><input type="number" id="${p('down')}" placeholder="50000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>중도금</label><input type="number" id="${p('interim')}" placeholder="0" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>대출희망금액</label><input type="number" id="${p('loan')}" placeholder="300000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>연이자율</label><input type="number" id="${p('rate')}" placeholder="4.5" min="0" max="30" step="0.01"><span class="calc-unit">%</span></div>
        <div class="calc-row"><label>대출기간</label><input type="number" id="${p('years')}" placeholder="30" min="1" max="50"><span class="calc-unit">년</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
        <div class="calc-note">잔금(매매가−계약금−중도금) 중 대출희망금액만큼을 원리금균등상환으로 계산해요 · 대출 한도 자체가 궁금하면 DSR·LTV 계산기를 함께 확인해보세요</div>
      </div>`;
    }
    if(item.calcType==='dividendtax'){
      return `<div class="calc-wrap">
        <div class="calc-title">배당소득세 계산기</div>
        <div class="calc-row"><label>세전 배당금</label><input type="number" id="${p('div')}" placeholder="1000000" min="0"><span class="calc-unit">원</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
        <div class="calc-note">국내주식 기본 원천징수세율 15.4%(소득세14%+지방소득세1.4%) 적용 · 금융소득 연 2,000만원 초과 시 종합과세 대상일 수 있어요</div>
      </div>`;
    }
    if(item.calcType==='dsrltv'){
      return `<div class="calc-wrap">
        <div class="calc-title">DSR·LTV 계산기</div>
        <div class="calc-row"><label>주택가격</label><input type="number" id="${p('house')}" placeholder="1000000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>대출희망금액</label><input type="number" id="${p('loan')}" placeholder="600000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>연이자율</label><input type="number" id="${p('rate')}" placeholder="4.5" min="0" max="30" step="0.01"><span class="calc-unit">%</span></div>
        <div class="calc-row"><label>대출기간</label><input type="number" id="${p('years')}" placeholder="30" min="1" max="50"><span class="calc-unit">년</span></div>
        <div class="calc-row"><label>연소득</label><input type="number" id="${p('income')}" placeholder="60000000" min="0"><span class="calc-unit">원</span></div>
        <div class="calc-row"><label>기타 대출 연상환액</label><input type="number" id="${p('other')}" placeholder="0" min="0"><span class="calc-unit">원</span></div>
        <button type="button" class="calc-btn" id="${p('btn')}">계산하기</button>
        <div class="calc-result" id="${p('result')}" style="display:none"></div>
        <div class="calc-note">대략적인 참고용 계산이에요 · 실제 한도는 규제지역·스트레스 DSR·은행별 기준에 따라 달라져요</div>
      </div>`;
    }
    if(item.calcType==='etfplan') return `<div class="calc-wrap"><div class="calc-title">📦 ETF 적립식·분배금</div><div class="calc-row"><label>초기 투자금</label><input type="number" id="${p('principal')}" placeholder="5000000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>월 적립금</label><input type="number" id="${p('monthly')}" placeholder="300000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>연 기대수익률</label><input type="number" id="${p('rate')}" placeholder="7" step="0.1"><span class="calc-unit">%</span></div><div class="calc-row"><label>연 분배율</label><input type="number" id="${p('yield')}" placeholder="4" step="0.1"><span class="calc-unit">%</span></div><div class="calc-row"><label>세율 가정</label><input type="number" id="${p('tax')}" value="15.4" step="0.1"><span class="calc-unit">%</span></div><div class="calc-row"><label>기간</label><input type="number" id="${p('years')}" placeholder="10" min="1"><span class="calc-unit">년</span></div><button type="button" class="calc-btn" id="${p('btn')}">계산하기</button><div class="calc-result" id="${p('result')}" style="display:none"></div><div class="calc-note">수익률은 분배금을 포함한 총수익률 가정입니다. 분배금은 현재 평가액 기준의 참고 추정치예요.</div></div>`;
    if(item.calcType==='taxsavings') return `<div class="calc-wrap"><div class="calc-title">💸 ISA·연금저축 절세 예상</div><div class="calc-row"><label>연금저축·IRP 납입액</label><input type="number" id="${p('pension')}" placeholder="6000000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>세액공제 대상 한도</label><input type="number" id="${p('pensionLimit')}" placeholder="공식 한도 입력" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>내 적용 공제율</label><input type="number" id="${p('credit')}" placeholder="공식 공제율" min="0" max="100" step="0.1"><span class="calc-unit">%</span></div><div class="calc-row"><label>ISA 예상 순이익</label><input type="number" id="${p('isaGain')}" placeholder="3000000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>ISA 비과세 한도</label><input type="number" id="${p('isaFree')}" placeholder="공식 한도 입력" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>ISA 초과분 세율</label><input type="number" id="${p('isaReduced')}" placeholder="공식 세율" min="0" max="100" step="0.1"><span class="calc-unit">%</span></div><div class="calc-row"><label>일반계좌 비교 세율</label><input type="number" id="${p('isaTax')}" value="15.4" min="0" max="100" step="0.1"><span class="calc-unit">%</span></div><button type="button" class="calc-btn" id="${p('btn')}">계산하기</button><div class="calc-result" id="${p('result')}" style="display:none"></div><div class="calc-note">한도·세율은 자동 확정하지 않습니다. 올해 공식 자료에서 확인한 본인 적용값을 입력하세요.</div></div>`;
    if(item.calcType==='youthasset') return `<div class="calc-wrap"><div class="calc-title">🧾 청년 자산형성 만기 예상</div><div class="calc-row"><label>월 납입액</label><input type="number" id="${p('monthly')}" placeholder="500000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>월 지원금/기여금</label><input type="number" id="${p('support')}" placeholder="0" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>연 금리 가정</label><input type="number" id="${p('rate')}" placeholder="4" step="0.1"><span class="calc-unit">%</span></div><div class="calc-row"><label>가입 기간</label><input type="number" id="${p('months')}" placeholder="60" min="1"><span class="calc-unit">개월</span></div><button type="button" class="calc-btn" id="${p('btn')}">계산하기</button><div class="calc-result" id="${p('result')}" style="display:none"></div><div class="calc-note">지원금·금리는 공식 공고의 본인 적용값을 넣으세요.</div></div>`;
    if(item.calcType==='rentvsjeonse') return `<div class="calc-wrap"><div class="calc-title">전세 vs 월세</div><div class="calc-row"><label>전세 보증금</label><input type="number" id="${p('jeonse')}" placeholder="200000000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>전세 대출금</label><input type="number" id="${p('loan')}" placeholder="100000000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>전세대출 금리</label><input type="number" id="${p('loanRate')}" placeholder="4" min="0" max="100" step="0.1"><span class="calc-unit">%</span></div><div class="calc-row"><label>월세 보증금</label><input type="number" id="${p('deposit')}" placeholder="10000000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>월세</label><input type="number" id="${p('rent')}" placeholder="800000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>내 돈 기회비용률</label><input type="number" id="${p('opp')}" value="3" min="0" max="100" step="0.1"><span class="calc-unit">%</span></div><div class="calc-row"><label>전세 월 관리비</label><input type="number" id="${p('jMgmt')}" value="0" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>월세 월 관리비</label><input type="number" id="${p('rMgmt')}" value="0" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>전세 일회성 비용</label><input type="number" id="${p('jCost')}" value="0" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>월세 일회성 비용</label><input type="number" id="${p('rCost')}" value="0" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>계약기간</label><input type="number" id="${p('months')}" value="24" min="1"><span class="calc-unit">개월</span></div><button type="button" class="calc-btn" id="${p('btn')}">비교하기</button><div class="calc-result" id="${p('result')}" style="display:none"></div><div class="calc-note">대출 원금상환은 비용이 아니라 자산 이동으로 보고 제외했어요. 보증금 반환 위험·세액공제는 별도 판단이 필요해요.</div></div>`;
    if(item.calcType==='severance') return `<div class="calc-wrap"><div class="calc-title">💼 퇴직금·퇴사 후 현금흐름</div><div class="calc-row"><label>최근 3개월 임금 합계</label><input type="number" id="${p('wage')}" placeholder="9000000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>산정기간 총일수</label><input type="number" id="${p('days')}" value="92" min="1"><span class="calc-unit">일</span></div><div class="calc-row"><label>계속 근로일수</label><input type="number" id="${p('workdays')}" placeholder="730" min="1"><span class="calc-unit">일</span></div><div class="calc-row"><label>주 평균 근로시간</label><input type="number" id="${p('weeklyHours')}" value="40" min="0" max="168" step="0.5"><span class="calc-unit">시간</span></div><div class="calc-row"><label>연차수당 등 추가 정산</label><input type="number" id="${p('extra')}" value="0" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>보유 현금</label><input type="number" id="${p('cash')}" placeholder="10000000" min="0"><span class="calc-unit">원</span></div><div class="calc-row"><label>월 필수지출</label><input type="number" id="${p('expense')}" placeholder="2000000" min="1"><span class="calc-unit">원</span></div><button type="button" class="calc-btn" id="${p('btn')}">계산하기</button><div class="calc-result" id="${p('result')}" style="display:none"></div><div class="calc-note">세전 추정치입니다. 퇴직연금·세금·평균임금 포함항목은 반영하지 않았어요.</div></div>`;
    return '';
  }
  // 계산기별 이벤트 연결 + 실제 계산 로직
  function wireCalcWidget(item){
    const p=k=>document.getElementById(`c${item.id}-${k}`);
    const btn=p('btn'); if(!btn) return;
    const widget=btn.closest('.calc-wrap');
    const result=p('result');
    if(widget){
      widget.querySelectorAll('.calc-row').forEach((row,index)=>{
        const control=row.querySelector('input,select,textarea');
        const label=row.querySelector('label');
        const unit=row.querySelector('.calc-unit');
        if(control&&label){ label.htmlFor=control.id; }
        if(control&&unit){
          if(!unit.id) unit.id=`${control.id}-unit`;
          const described=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
          if(!described.includes(unit.id)) described.push(unit.id);
          control.setAttribute('aria-describedby',described.join(' '));
        }
        if(control&&!control.id) control.id=`calc-${item.id}-field-${index}`;
      });
    }
    if(result){ result.setAttribute('role','status'); result.setAttribute('aria-live','polite'); result.tabIndex=-1; }
    if(item.calcType==='stockbreakeven'){
      const market=p('market');
      market.onchange=()=>{
        if(market.value==='kospi'||market.value==='kosdaq') p('sellTax').value='0.20';
        if(market.value==='etf') p('sellTax').value='0';
      };
      btn.onclick=()=>{
        const marketType=market.value;
        const buyPrice=n0(p('buyPrice').value), qty=Math.floor(n0(p('qty').value));
        const sellPrice=n0(p('sellPrice').value), buyFeeRate=n0(p('buyFee').value)/100;
        const sellFeeRate=n0(p('sellFee').value)/100, sellTaxRate=n0(p('sellTax').value)/100;
        const fixedCost=n0(p('fixedCost').value), targetReturn=n0(p('targetReturn').value)/100;
        const res=p('result'); res.style.display='block';
        if(buyPrice<=0||qty<=0){
          res.innerHTML='<div class="cr-sub">0보다 큰 평균 매수가와 보유수량을 입력해주세요.</div>'; return;
        }
        if([buyFeeRate,sellFeeRate,sellTaxRate].some(v=>v<0||v>1)||sellFeeRate+sellTaxRate>=1||fixedCost<0||targetReturn<=-1){
          res.innerHTML='<div class="cr-sub">수수료·세율은 0~100% 범위에서 입력하고, 매도 수수료와 세금의 합은 100%보다 작아야 해요.</div>'; return;
        }
        const tickAt=price=>{
          if(marketType==='etf') return 5;
          if(marketType==='custom') return 1;
          if(price<1000) return 1;
          if(price<5000) return 5;
          if(price<10000) return 10;
          if(price<50000) return 50;
          if(price<100000) return 100;
          if(price<500000) return marketType==='kospi'?500:100;
          return marketType==='kospi'?1000:100;
        };
        const roundToOrderPrice=price=>{
          let rounded=price;
          for(let i=0;i<3;i+=1){
            const tick=tickAt(rounded);
            rounded=Math.ceil(price/tick)*tick;
          }
          return rounded;
        };
        const buyAmount=buyPrice*qty;
        const buyCommission=buyAmount*buyFeeRate;
        const acquisitionCost=buyAmount+buyCommission+fixedCost;
        const netSellFactor=1-sellFeeRate-sellTaxRate;
        const breakEvenRaw=acquisitionCost/(qty*netSellFactor);
        const breakEvenOrder=roundToOrderPrice(breakEvenRaw);
        const targetRaw=acquisitionCost*(1+targetReturn)/(qty*netSellFactor);
        const targetOrder=roundToOrderPrice(targetRaw);
        let sellHtml='<span style="color:var(--t3)">예상 매도가를 입력하면 그 가격의 세후 손익도 계산해요.</span>';
        if(sellPrice>0){
          const sellAmount=sellPrice*qty;
          const sellCommission=sellAmount*sellFeeRate;
          const sellTax=sellAmount*sellTaxRate;
          const netProceeds=sellAmount-sellCommission-sellTax;
          const netProfit=netProceeds-acquisitionCost;
          const netReturn=acquisitionCost>0?netProfit/acquisitionCost*100:0;
          sellHtml=`예상 매도대금 ${fmtWon(sellAmount)}<br>매도 수수료 ${fmtWon(sellCommission)} · 매도세금 ${fmtWon(sellTax)}<br><strong>세후 순손익 ${netProfit>=0?'+':''}${fmtWon(netProfit)} (${netReturn>=0?'+':''}${netReturn.toFixed(2)}%)</strong>`;
        }
        res.innerHTML=`<div class="cr-main">손익분기 주문가 ${fmtWon(breakEvenOrder)}</div>
          <div class="cr-sub">이론 손익분기 ${fmtWon(breakEvenRaw)} · 적용 호가단위 ${fmtWon(tickAt(breakEvenOrder))}<br>
          매수원금 ${fmtWon(buyAmount)} · 매수수수료 ${fmtWon(buyCommission)} · 기타비용 ${fmtWon(fixedCost)}<br>
          목표 순수익률 ${(targetReturn*100).toFixed(1)}% 주문가 ${fmtWon(targetOrder)} (이론 ${fmtWon(targetRaw)})<br><br>${sellHtml}<br>
          <span style="color:var(--t3)">원 미만 처리와 체결별 수수료 합산 방식에 따라 증권사 정산액과 소액 차이가 날 수 있어요.</span></div>`;
      };
    }
    if(item.calcType==='ipoallocation'){
      btn.onclick=()=>{
        const offerPrice=n0(p('offerPrice').value);
        const appliedShares=Math.floor(n0(p('appliedShares').value));
        const marginRate=n0(p('marginRate').value)/100;
        const minimumShares=Math.floor(n0(p('minimumShares').value));
        const equalPool=Math.floor(n0(p('equalPool').value));
        const accountCount=Math.floor(n0(p('accountCount').value));
        const proportionalPool=Math.floor(n0(p('proportionalPool').value));
        const totalAppliedShares=Math.floor(n0(p('totalAppliedShares').value));
        const subscriptionFee=n0(p('subscriptionFee').value);
        const res=p('result'); res.style.display='block';
        if(offerPrice<=0||appliedShares<=0||minimumShares<=0||marginRate<=0||marginRate>1||accountCount<=0||totalAppliedShares<=0||equalPool<0||proportionalPool<0||subscriptionFee<0){
          res.innerHTML='<div class="cr-sub">공모가·청약주수·대상 계좌·총 유효 청약주수를 확인하고, 증거금률은 0% 초과 100% 이하로 입력해주세요.</div>'; return;
        }
        if(appliedShares<minimumShares){
          res.innerHTML=`<div class="cr-sub">내 청약주수 ${appliedShares.toLocaleString('ko-KR')}주는 최소 청약주수 ${minimumShares.toLocaleString('ko-KR')}주보다 적어 균등배정 대상이 될 수 없어요.</div>`; return;
        }
        if(totalAppliedShares<appliedShares){
          res.innerHTML='<div class="cr-sub">총 유효 청약주수는 내 청약주수보다 작을 수 없어요.</div>'; return;
        }
        const requiredDeposit=offerPrice*appliedShares*marginRate;
        const equalExact=Math.min(appliedShares,equalPool/accountCount);
        const equalBase=Math.floor(equalExact);
        const equalChance=(equalExact-equalBase)*100;
        const proportionalRaw=proportionalPool>0?appliedShares/totalAppliedShares*proportionalPool:0;
        const proportionalExpected=Math.min(appliedShares,proportionalRaw);
        const combinedExpected=Math.min(appliedShares,equalExact+proportionalExpected);
        const expectedPayment=combinedExpected*offerPrice;
        const balance=requiredDeposit-expectedPayment-subscriptionFee;
        const proportionalCompetition=proportionalPool>0?totalAppliedShares/proportionalPool:0;
        const equalText=equalChance>0.005
          ? `${equalBase.toLocaleString('ko-KR')}주 기본 + 1주 추첨 약 ${equalChance.toFixed(2)}%`
          : `${equalBase.toLocaleString('ko-KR')}주 기본 몫`;
        const settlementText=balance>=0
          ? `예상 환불액 ${fmtWon(balance)}`
          : `예상 추가 납입 필요액 ${fmtWon(Math.abs(balance))}`;
        res.innerHTML=`<div class="cr-main">필요 증거금 ${fmtWon(requiredDeposit)}</div>
          <div class="cr-sub">청약금액 ${fmtWon(offerPrice*appliedShares)} × 증거금률 ${(marginRate*100).toFixed(1)}%<br><br>
          <strong>균등배정</strong> · 1계좌 기대 ${equalExact.toFixed(4)}주<br>${equalText}<br>
          <strong>비례배정</strong> · 기대 ${proportionalExpected.toFixed(4)}주${proportionalCompetition?` (입력값 기준 약 ${proportionalCompetition.toFixed(2)} 대 1)`:''}<br>
          <strong>합계 기대배정 ${combinedExpected.toFixed(4)}주</strong><br><br>
          기대배정 납입대금 ${fmtWon(expectedPayment)} · 청약수수료 ${fmtWon(subscriptionFee)}<br>${settlementText}<br>
          <span style="color:var(--t3)">기대값은 확정 배정주수가 아니에요. 단수주·우대등급·추첨·추가납입 기준은 해당 인수회사의 최종 공고가 우선합니다.</span></div>`;
      };
    }
    if(item.calcType==='avgprice'){
      btn.onclick=()=>{
        const q1=n0(p('q1').value), pr1=n0(p('p1').value), q2=n0(p('q2').value), pr2=n0(p('p2').value), target=n0(p('target').value);
        const totalQty=q1+q2, totalCost=q1*pr1+q2*pr2;
        const res=p('result'); res.style.display='block';
        if(totalQty<=0){ res.innerHTML='<div class="cr-sub">보유수량과 추가매수 수량을 입력해주세요.</div>'; return; }
        const newAvg=totalCost/totalQty;
        const targetPrice=newAvg*(1+target/100);
        res.innerHTML=`<div class="cr-main">새 평단가 ${fmtWon(newAvg)}</div>
          <div class="cr-sub">총 보유수량 ${totalQty.toLocaleString('ko-KR')}주 · 총 매입금액 ${fmtWon(totalCost)}<br>
          목표 수익률 ${target}% 달성 매도가 ${fmtWon(targetPrice)}</div>`;
      };
    }
    if(item.calcType==='capitalgainstax'){
      btn.onclick=()=>{
        const sell=n0(p('sell').value), buy=n0(p('buy').value);
        const gain=Math.max(0, sell-buy);
        const taxBase=Math.max(0, gain-2500000);
        const tax=taxBase*0.22;
        const res=p('result'); res.style.display='block';
        res.innerHTML=`<div class="cr-main">예상 세액 ${fmtWon(tax)}</div>
          <div class="cr-sub">양도차익 ${fmtWon(gain)} − 기본공제 250만원 = 과세표준 ${fmtWon(taxBase)} × 22%</div>`;
      };
    }
    if(item.calcType==='compound'){
      btn.onclick=()=>{
        const principal=n0(p('principal').value), monthly=n0(p('monthly').value),
              rate=n0(p('rate').value), years=n0(p('years').value);
        const res=p('result'); res.style.display='block';
        if(years<=0){ res.innerHTML='<div class="cr-sub">투자 기간을 입력해주세요.</div>'; return; }
        const monthlyRate=rate/100/12, months=years*12;
        const fvPrincipal=principal*Math.pow(1+monthlyRate, months);
        const fvContrib=Math.abs(monthlyRate)>1e-9 ? monthly*((Math.pow(1+monthlyRate,months)-1)/monthlyRate) : monthly*months;
        const total=fvPrincipal+fvContrib;
        const totalPaid=principal+monthly*months;
        const profit=total-totalPaid;
        res.innerHTML=`<div class="cr-main">${years}년 뒤 ${fmtWon(total)}</div>
          <div class="cr-sub">총 납입원금 ${fmtWon(totalPaid)} · 예상 수익 ${profit>=0?'+':''}${fmtWon(profit)}</div>`;
      };
    }
    if(item.calcType==='loanpayment'){
      btn.onclick=()=>{
        const principal=n0(p('principal').value), rate=n0(p('rate').value), years=n0(p('years').value);
        const res=p('result'); res.style.display='block';
        if(principal<=0||years<=0){ res.innerHTML='<div class="cr-sub">대출원금과 대출기간을 입력해주세요.</div>'; return; }
        const monthlyRate=rate/100/12, months=years*12;
        const monthlyPayment=Math.abs(monthlyRate)>1e-9
          ? principal*monthlyRate*Math.pow(1+monthlyRate,months)/(Math.pow(1+monthlyRate,months)-1)
          : principal/months;
        const totalPayment=monthlyPayment*months;
        const totalInterest=totalPayment-principal;
        res.innerHTML=`<div class="cr-main">매달 ${fmtWon(monthlyPayment)}</div>
          <div class="cr-sub">총 상환액 ${fmtWon(totalPayment)} · 총 이자 ${fmtWon(totalInterest)}</div>`;
      };
    }
    if(item.calcType==='balancepayment'){
      btn.onclick=()=>{
        const price=n0(p('price').value), down=n0(p('down').value), interim=n0(p('interim').value),
              loan=n0(p('loan').value), rate=n0(p('rate').value), years=n0(p('years').value);
        const res=p('result'); res.style.display='block';
        if(price<=0){ res.innerHTML='<div class="cr-sub">매매가를 입력해주세요.</div>'; return; }
        const balance=Math.max(0, price-down-interim);
        const pct=price>0?(balance/price*100):0;
        const equity=Math.max(0, balance-loan);
        let loanHtml='';
        if(loan>0){
          if(years<=0){
            loanHtml=`<br><span style="color:var(--red)">대출기간을 입력하면 월 상환액도 계산해드려요.</span>`;
          } else {
            const monthlyRate=rate/100/12, months=years*12;
            const monthlyPayment=Math.abs(monthlyRate)>1e-9
              ? loan*monthlyRate*Math.pow(1+monthlyRate,months)/(Math.pow(1+monthlyRate,months)-1)
              : loan/months;
            const totalInterest=monthlyPayment*months-loan;
            loanHtml=`<br>대출 ${fmtWon(loan)} → 매달 ${fmtWon(monthlyPayment)}(총 이자 ${fmtWon(totalInterest)})<br>자기자본으로 준비할 금액 ${fmtWon(equity)}`;
          }
        }
        res.innerHTML=`<div class="cr-main">잔금 ${fmtWon(balance)}</div>
          <div class="cr-sub">매매가 대비 ${pct.toFixed(1)}% · 계약금+중도금 ${fmtWon(down+interim)}${loanHtml}</div>`;
      };
    }
    if(item.calcType==='dividendtax'){
      btn.onclick=()=>{
        const div=n0(p('div').value);
        const tax=div*0.154;
        const res=p('result'); res.style.display='block';
        res.innerHTML=`<div class="cr-main">세후 실수령 ${fmtWon(div-tax)}</div>
          <div class="cr-sub">세전 배당금 ${fmtWon(div)} − 원천징수세액 ${fmtWon(tax)}(15.4%)</div>`;
      };
    }
    if(item.calcType==='dsrltv'){
      btn.onclick=()=>{
        const house=n0(p('house').value), loan=n0(p('loan').value), rate=n0(p('rate').value),
              years=n0(p('years').value), income=n0(p('income').value), other=n0(p('other').value);
        const res=p('result'); res.style.display='block';
        if(house<=0||income<=0||years<=0){ res.innerHTML='<div class="cr-sub">주택가격·연소득·대출기간을 입력해주세요.</div>'; return; }
        const ltv=loan/house*100;
        const monthlyRate=rate/100/12, months=years*12;
        const monthlyPayment=Math.abs(monthlyRate)>1e-9
          ? loan*monthlyRate*Math.pow(1+monthlyRate,months)/(Math.pow(1+monthlyRate,months)-1)
          : loan/months;
        const annualPayment=monthlyPayment*12;
        const dsr=(annualPayment+other)/income*100;
        res.innerHTML=`<div class="cr-main">LTV ${ltv.toFixed(1)}% · DSR ${dsr.toFixed(1)}%</div>
          <div class="cr-sub">이 대출 월 예상 상환액 ${fmtWon(monthlyPayment)} · 연 원리금(기타 대출 포함) ${fmtWon(annualPayment+other)}</div>`;
      };
    }
    if(item.calcType==='etfplan') btn.onclick=()=>{const a=n0(p('principal').value),m=n0(p('monthly').value),annual=n0(p('rate').value),r=Math.pow(1+annual/100,1/12)-1,y=n0(p('years').value),dy=n0(p('yield').value)/100,t=n0(p('tax').value)/100,mo=y*12,res=p('result');res.style.display='block';if(y<=0||annual<=-100||dy<0||t<0||t>1){res.innerHTML='<div class="cr-sub">기간과 수익률을 확인하고, 분배율·세율은 0 이상(세율 100% 이하)으로 입력해주세요.</div>';return;}const total=a*Math.pow(1+r,mo)+(Math.abs(r)>1e-9?m*(Math.pow(1+r,mo)-1)/r:m*mo),paid=a+m*mo,netAnnual=total*dy*(1-t),netMonth=netAnnual/12;res.innerHTML=`<div class="cr-main">${y}년 뒤 ${fmtWon(total)}</div><div class="cr-sub">총 납입 ${fmtWon(paid)} · 예상 손익 ${fmtWon(total-paid)}<br>기간 말 평가액 기준 연 세후 분배금 ${fmtWon(netAnnual)} · 월평균 ${fmtWon(netMonth)}<br><span style="color:var(--t3)">분배금은 미래가치에 더하지 않은 기간 말 현금흐름 참고치예요. 연 수익률은 CAGR을 월 수익률로 환산했어요.</span></div>`;};
    if(item.calcType==='taxsavings') btn.onclick=()=>{const pp=n0(p('pension').value),pl=n0(p('pensionLimit').value),c=n0(p('credit').value)/100,g=n0(p('isaGain').value),free=n0(p('isaFree').value),reduced=n0(p('isaReduced').value)/100,normal=n0(p('isaTax').value)/100,res=p('result');res.style.display='block';if(!pl||c<0||c>1||reduced<0||reduced>1||normal<0||normal>1){res.innerHTML='<div class="cr-sub">공제 한도와 0~100% 사이의 세율을 입력해주세요.</div>';return;}const eligible=Math.min(pp,pl),pensionSave=eligible*c,isaTax=Math.max(0,g-free)*reduced,normalTax=g*normal,isaSave=Math.max(0,normalTax-isaTax);res.innerHTML=`<div class="cr-main">연금 세액공제 ${fmtWon(pensionSave)} · ISA 절세 ${fmtWon(isaSave)}</div><div class="cr-sub">연금 공제 대상 ${fmtWon(eligible)}<br>ISA 과세 대상 ${fmtWon(Math.max(0,g-free))} · ISA 세금 추정 ${fmtWon(isaTax)}<br>일반계좌 비교 세금 ${fmtWon(normalTax)}<br><span style="color:var(--t3)">연금은 1년 납입 기준, ISA는 입력한 전체 이익 기준이라 두 금액을 하나의 합계로 더하지 않았어요. 실제 공제는 결정세액 한도의 영향을 받아요.</span></div>`;};
    if(item.calcType==='youthasset') btn.onclick=()=>{const own=n0(p('monthly').value),support=n0(p('support').value),annual=n0(p('rate').value),m=own+support,r=Math.pow(1+annual/100,1/12)-1,n=n0(p('months').value),res=p('result');res.style.display='block';if(n<=0||annual<0){res.innerHTML='<div class="cr-sub">가입 기간과 0 이상의 금리를 입력해주세요.</div>';return;}const total=Math.abs(r)>1e-9?m*(Math.pow(1+r,n)-1)/r:m*n,principal=m*n,benefit=support*n+(total-principal);res.innerHTML=`<div class="cr-main">예상 만기 ${fmtWon(total)}</div><div class="cr-sub">본인 납입 ${fmtWon(own*n)} · 지원금 가정 ${fmtWon(support*n)}<br>예상 이자 ${fmtWon(total-principal)} · 지원금+이자 혜택 ${fmtWon(benefit)}<br><span style="color:var(--t3)">매월 말 본인 납입과 지원금이 함께 적립된다는 단순 가정이에요.</span></div>`;};
    if(item.calcType==='rentvsjeonse') btn.onclick=()=>{const j=n0(p('jeonse').value),l=n0(p('loan').value),lr=n0(p('loanRate').value)/1200,d=n0(p('deposit').value),rent=n0(p('rent').value),o=n0(p('opp').value)/1200,jMgmt=n0(p('jMgmt').value),rMgmt=n0(p('rMgmt').value),jCost=n0(p('jCost').value),rCost=n0(p('rCost').value),n=n0(p('months').value),res=p('result');res.style.display='block';if(n<=0||l>j){res.innerHTML='<div class="cr-sub">계약 기간을 확인하고, 전세 대출금은 전세 보증금 이하로 입력해주세요.</div>';return;}const jc=(l*lr+Math.max(0,j-l)*o+jMgmt)*n+jCost,rc=(rent+d*o+rMgmt)*n+rCost,diff=jc-rc,breakRent=(jc-rCost-(d*o+rMgmt)*n)/n,breakText=breakRent>=0?`두 비용이 같아지는 월세 약 ${fmtWon(breakRent)}`:'현재 가정에서는 0원 이상의 손익분기 월세가 없어요';res.innerHTML=`<div class="cr-main">${diff<=0?'전세':'월세'}가 ${fmtWon(Math.abs(diff))} 낮음</div><div class="cr-sub">${n}개월 전세 비용 ${fmtWon(jc)} · 월세 비용 ${fmtWon(rc)}<br>월 환산 전세 ${fmtWon(jc/n)} · 월세 ${fmtWon(rc/n)}<br>${breakText}</div>`;};
    if(item.calcType==='severance') btn.onclick=()=>{const w=n0(p('wage').value),d=n0(p('days').value),wd=n0(p('workdays').value),hours=n0(p('weeklyHours').value),extra=n0(p('extra').value),cash=n0(p('cash').value),e=n0(p('expense').value),res=p('result');res.style.display='block';if(!w||!d||!wd||!e){res.innerHTML='<div class="cr-sub">모든 필수 항목을 입력해주세요.</div>';return;}const avg=w/d,eligible=wd>=365&&hours>=15,sev=eligible?avg*30*wd/365:0,available=cash+sev+extra,months=available/e,warning=!eligible?'<br><span style="color:var(--red)">근속 1년 또는 주 평균 15시간 기준을 충족하지 않아 법정 퇴직금 추정을 0원으로 표시했어요. 실제 적용은 공식 상담으로 확인하세요.</span>':'';res.innerHTML=`<div class="cr-main">세전 퇴직금 추정 ${fmtWon(sev)}</div><div class="cr-sub">1일 평균임금 ${fmtWon(avg)} · 추가 정산 ${fmtWon(extra)}<br>보유 현금 포함 사용 가능액 ${fmtWon(available)} · 약 ${months.toFixed(1)}개월${warning}</div>`;};
    if(btn.onclick){
      const calculate=btn.onclick;
      btn.onclick=e=>{
        const controls=widget?[...widget.querySelectorAll('input,select,textarea')]:[];
        controls.forEach(control=>{
          control.removeAttribute('aria-invalid');
          const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&id!==result?.id);
          if(ids.length) control.setAttribute('aria-describedby',ids.join(' '));
          else control.removeAttribute('aria-describedby');
        });
        calculate.call(btn,e);
        if(result){
          const invalid=Boolean(result.querySelector('.cr-sub'))&&!result.querySelector('.cr-main');
          result.setAttribute('role',invalid?'alert':'status');
          const nativeInvalid=controls.filter(control=>typeof control.checkValidity==='function'&&!control.checkValidity());
          const emptyInvalid=controls.filter(control=>control.tagName!=='SELECT'&&String(control.value).trim()==='');
          const invalidControls=nativeInvalid.length?nativeInvalid:emptyInvalid;
          if(invalid) invalidControls.forEach(control=>{
            control.setAttribute('aria-invalid','true');
            const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
            if(!ids.includes(result.id)) ids.push(result.id);
            control.setAttribute('aria-describedby',ids.join(' '));
          });
          result.focus({preventScroll:true});
        }
        window.GaeoMetrics.event('calculator-run').catch(()=>{});
        gaeoTrack('calculator_complete',{calculator_id:String(item.id),content_type:'calculator',content_id:String(item.id)});
      };
    }
  }

  window.renderCalc=function(){
    const box=document.getElementById('calcView'); if(!box) return;
    const all=(typeof CALCULATORS!=='undefined'&&Array.isArray(CALCULATORS))?CALCULATORS.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const hero=`<div class="nw-hero"><h2>계산기</h2>
      <p>주식 투자할 때 자주 필요한 계산을 바로 해볼 수 있어요. 카테고리를 먼저 골라보세요.
      제목을 누르면 계산기가 펼쳐져요.</p>
      ${searchBoxHTML('calcSearchInput', calcSearchQ, escN)}</div>`;
    const q=calcSearchQ.trim().toLowerCase();
    if(!q && !calcCatSel){
      box.innerHTML=hero+catPickerHTML(CALC_CATS, all, {noCount:true, allLabel:'전체 계산기 한 번에 보기'});
      wireSearchInput(box, 'calcSearchInput', v=>{ calcSearchQ=v; calcPage=1; window.renderCalc(); });
      box.querySelectorAll('[data-cat]').forEach(el=>el.onclick=()=>{
        calcCatSel=el.dataset.cat; calcPage=1; window.renderCalc();
        focusContentHeading(box);
        box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
      });
      return;
    }
    const searching=q.length>0;
    const filtered=searching
      ? all.filter(a=>(a.name||'').toLowerCase().includes(q)||(a.tag||'').toLowerCase().includes(q))
      : (calcCatSel==='__all__'?all:all.filter(x=>x.cat===calcCatSel));
    const backHtml=searching
      ? `<button type="button" class="cat-back" id="calcSearchClear">← 검색 지우기</button><div class="cat-current">"${escN(calcSearchQ)}" 검색결과 ${filtered.length}건</div>`
      : catBackHTML(CALC_CATS, calcCatSel);
    const pages=Math.max(1, Math.ceil(filtered.length/PAGE_SIZE));
    if(calcPage>pages) calcPage=pages; if(calcPage<1) calcPage=1;
    const slice=filtered.slice((calcPage-1)*PAGE_SIZE, calcPage*PAGE_SIZE);
    let h=hero+backHtml;
    h+=slice.length
      ? slice.map(a=>`<div class="nw-item" id="calc-${a.id}">
          <button type="button" class="nw-head" data-calc="${a.id}" aria-expanded="false" aria-controls="calc-body-${a.id}">
            <span class="nw-meta"><span class="nw-date">${escN(a.date||'')}</span>${a.tag?`<span class="nw-tag">${escN(a.tag)}</span>`:''}</span>
            <span class="nw-title">${escN(a.name||'')} <span class="nw-arrow" aria-hidden="true">▸</span></span>
          </button>
          <div class="nw-body" id="calc-body-${a.id}">${bodyHTML(a.body)}
            ${Array.isArray(a.sources)&&a.sources.length?`<div class="nw-src">참고 자료<br>`+
              a.sources.map(s=>`· <a href="${escN(s.url)}" target="_blank" rel="noopener">${escN(s.name||s.url)}</a>`).join('<br>')+`</div>`:''}
            ${calcWidgetHTML(a).replace(/[📦💸🧾💼]/gu,'')}
            <div class="nw-disc">※ 참고용 계산 도구예요. 투자·세무 판단과 책임은 본인에게 있으며, 정확한 세액은 전문가와 함께 확인하세요.</div>
          </div>
        </div>`).join('')
      : `<div class="nw-item"><div class="nw-empty">${searching?'검색 결과가 없어요.':'아직 등록된 계산기가 없어요.'}</div></div>`;
    if(pages>1){
      h+=`<div class="nw-pager">
        <button class="nw-pg" data-pg="${calcPage-1}" ${calcPage<=1?'disabled':''}>‹ 이전</button>`+
        Array.from({length:pages},(_,i)=>`<button class="nw-pg${i+1===calcPage?' on':''}" data-pg="${i+1}">${i+1}</button>`).join('')+
        `<button class="nw-pg" data-pg="${calcPage+1}" ${calcPage>=pages?'disabled':''}>다음 ›</button></div>`;
    }
    box.innerHTML=h;
    wireSearchInput(box, 'calcSearchInput', v=>{ calcSearchQ=v; calcPage=1; window.renderCalc(); });
    if(searching){
      const clearBtn=box.querySelector('#calcSearchClear');
      if(clearBtn) clearBtn.onclick=()=>{ calcSearchQ=''; calcPage=1; window.renderCalc(); focusContentHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    } else {
      const backBtn=box.querySelector('.cat-back');
      if(backBtn) backBtn.onclick=()=>{ calcCatSel=null; calcPage=1; window.renderCalc(); focusContentHeading(box); box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); };
    }
    box.querySelectorAll('.nw-head').forEach(el=>el.onclick=()=>{
      const item=document.getElementById('calc-'+el.dataset.calc);
      if(item){ const open=item.classList.toggle('open'); el.setAttribute('aria-expanded',String(open));
        if(open){
          window.GaeoMetrics.contentView('calc',el.dataset.calc,item);
          gaeoTrack('calculator_start',{calculator_id:String(el.dataset.calc),content_type:'calculator',content_id:String(el.dataset.calc)});
        }
        history.replaceState(null,'', open?('?m=calc&id='+el.dataset.calc):location.pathname); }
    });
    box.querySelectorAll('.nw-pg').forEach(b=>b.onclick=()=>{
      const pg=parseInt(b.dataset.pg,10);
      if(!pg||pg===calcPage||b.disabled) return;
      calcPage=pg; window.renderCalc();
      focusContentHeading(box);
      box.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
    });
    // 위젯 이벤트는 실제로 화면에 그려진 항목에 대해서만 연결
    slice.forEach(a=>wireCalcWidget(a));
    const requestedCalcId=new URLSearchParams(location.search).get('id');
    if(!searching&&!requestedCalcId&&calcPage===1&&slice.length){ const first=document.getElementById('calc-'+slice[0].id); if(first){ first.classList.add('open'); first.querySelector('.nw-head')?.setAttribute('aria-expanded','true'); } }
  };
  window.openCalcId=function(id){
    const all=(typeof CALCULATORS!=='undefined'&&Array.isArray(CALCULATORS))?CALCULATORS.slice():[];
    all.sort((a,b)=>(b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    const target=all.find(a=>String(a.id)===String(id)); if(!target) return;
    calcCatSel=target.cat||'__all__';
    const filtered=all.filter(x=>x.cat===calcCatSel);
    const idx=filtered.findIndex(a=>String(a.id)===String(id));
    calcPage=idx<0?1:Math.floor(idx/PAGE_SIZE)+1; window.renderCalc();
    const el=document.getElementById('calc-'+id);
    if(el){
      el.classList.add('open');
      el.querySelector('.nw-head')?.setAttribute('aria-expanded','true');
      window.GaeoMetrics.contentView('calc',id,el);
      setTimeout(()=>el.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}),80);
    }
  };
})();

// ---------- 🔍 종목 스크리너 ----------
// 분석 종목 중 조건(업종·개오팀 판단)에 맞는 종목을 골라 정렬해서 보여준다.
// analysisTally()가 이미 만들어둔 정밀+자동분석 통합 판단(ranked)과 STOCKS(시세·PER·PBR·배당 등)를 그대로 재사용 — 별도 데이터 수집 없이 토큰 0.
let SCR={sector:'__all__', call:'__all__', sort:'score_desc'};
window.renderScreener=function(){
  const el=document.getElementById('screenerView'); if(!el) return;
  const tally=analysisTally();
  const rankMap={}; tally.ranked.forEach(r=>{ rankMap[r.code]=r; });
  let rows=Object.keys(STOCKS).map(code=>{
    const s=STOCKS[code]; const r=rankMap[code];
    if(!r) return null; // 개오팀 판단이 아직 없는 종목은 스크리너에서 제외
    return {code, name:s.name, sector:s.sector||'기타', price:s.price, rate:s.rate,
      per:s.per, pbr:s.pbr, roe:s.roe, div:s.div, cap:s.cap, call:r.call, total:r.total};
  }).filter(Boolean);

  const sectorList=[]; const seenSec=new Set();
  (typeof TICKERS!=='undefined'&&Array.isArray(TICKERS)?TICKERS:[]).forEach(t=>{
    const s=t.sector||'기타'; if(!seenSec.has(s)){ seenSec.add(s); sectorList.push(s); }
  });

  if(SCR.sector!=='__all__') rows=rows.filter(x=>x.sector===SCR.sector);
  if(SCR.call!=='__all__') rows=rows.filter(x=>x.call===SCR.call);

  const sorters={
    score_desc:(a,b)=>b.total-a.total,
    per_asc:(a,b)=>(a.per==null?1e9:a.per)-(b.per==null?1e9:b.per),
    pbr_asc:(a,b)=>(a.pbr==null?1e9:a.pbr)-(b.pbr==null?1e9:b.pbr),
    div_desc:(a,b)=>(b.div==null?-1:b.div)-(a.div==null?-1:a.div),
    cap_desc:(a,b)=>(parseCap(b.cap)==null?-1:parseCap(b.cap))-(parseCap(a.cap)==null?-1:parseCap(a.cap)),
    rate_desc:(a,b)=>(b.rate==null?-1e9:b.rate)-(a.rate==null?-1e9:a.rate),
    rate_asc:(a,b)=>(a.rate==null?1e9:a.rate)-(b.rate==null?1e9:b.rate),
  };
  rows.sort(sorters[SCR.sort]||sorters.score_desc);

  const LIMIT=50;
  const shown=rows.slice(0, LIMIT);
  const callKr={BUY:'매수',HOLD:'보유',SELL:'매도'};

  const sectorOpts=`<option value="__all__">전체 업종</option>`+
    sectorList.map(s=>`<option value="${esc(s)}"${SCR.sector===s?' selected':''}>${esc(s)}</option>`).join('');
  const callOpts=['__all__','BUY','HOLD','SELL'].map(c=>
    `<option value="${c}"${SCR.call===c?' selected':''}>${c==='__all__'?'전체 판단':callKr[c]}</option>`).join('');
  const sortOpts=[
    ['score_desc','개오팀 종합점수 높은순'],['per_asc','PER 낮은순'],['pbr_asc','PBR 낮은순'],
    ['div_desc','배당수익률 높은순'],['cap_desc','시가총액 큰순'],['rate_desc','오늘 등락률 높은순'],['rate_asc','오늘 등락률 낮은순'],
  ].map(([k,label])=>`<option value="${k}"${SCR.sort===k?' selected':''}>${label}</option>`).join('');

  const rowsHtml=shown.length
    ? shown.map((x,i)=>{
        const rate=x.rate==null?'—':`${x.rate>0?'+':''}${x.rate}%`;
        const rateColor=x.rate>0?'var(--krup)':(x.rate<0?'var(--krdn)':'var(--dim)');
        return `<div class="scr-row" data-nm="${esc(x.name)}">
          <div class="scr-rank">${i+1}</div>
          <div class="scr-main">
            <div class="scr-nm">${esc(x.name)}</div>
            <div class="scr-sub">${esc(x.sector)} · PER ${x.per??'—'} · PBR ${x.pbr??'—'} · 배당 ${x.div!=null?x.div+'%':'—'}</div>
          </div>
          <div class="scr-nums">${x.price?x.price.toLocaleString('ko-KR')+'원':'—'}<br><span style="color:${rateColor}">${rate}</span></div>
          <div class="scr-call ${x.call==='BUY'?'buy':x.call==='SELL'?'sell':'hold'}">${callKr[x.call]||x.call}<br>${x.total}점</div>
        </div>`;
      }).join('')
    : `<div class="scr-empty">조건에 맞는 종목이 없어요. 필터를 바꿔보세요.</div>`;

  const scrAsOf = (AUTO_AN && (AUTO_AN.priceLabel || AUTO_AN.generatedAt)) || SNAP_DATE || '';
  el.innerHTML=`<div class="nw-hero"><h2>종목 스크리너</h2>
    <p>업종·개오팀 판단으로 걸러내고, 원하는 기준으로 정렬해서 조건에 맞는 종목을 찾아보세요.
    종목을 누르면 바로 상세 분석으로 이동해요.</p>
    ${scrAsOf?`<p style="color:var(--red);font-weight:600;margin-top:6px">⏱ 기준일시: ${esc(scrAsOf)}</p>`:''}</div>
    <div class="scr-controls">
      <select id="scrSector">${sectorOpts}</select>
      <select id="scrCall">${callOpts}</select>
      <select id="scrSort">${sortOpts}</select>
    </div>
    <div class="scr-count">조건에 맞는 종목 ${rows.length.toLocaleString('ko-KR')}개 중 상위 ${shown.length}개 표시</div>
    <div class="scr-list">${rowsHtml}</div>
    <div class="nw-disc" style="margin-top:12px">※ 개오팀 판단은 대부분 자동분석(규칙 기반) 기준이며, 투자 권유가 아니에요. PER·PBR·배당수익률은 최근 갱신된 시세 기준값이에요.</div>`;

  document.getElementById('scrSector').onchange=e=>{ SCR.sector=e.target.value; window.renderScreener(); };
  document.getElementById('scrCall').onchange=e=>{ SCR.call=e.target.value; window.renderScreener(); };
  document.getElementById('scrSort').onchange=e=>{ SCR.sort=e.target.value; window.renderScreener(); };
  el.querySelectorAll('.scr-row').forEach(r=>r.onclick=()=>jumpToStock(r.dataset.nm));
};

// ---------- 종목 비교 모드 ----------
(function(){
  // 종목비교 A/B — 한글 검색 자동완성 입력(단일분석 검색과 같은 엔진 공유)
  const selA=document.getElementById('cmpA'), selB=document.getElementById('cmpB');
  selA.value='제주반도체'; selB.value='삼성전자';
  const cmpPicked=()=>{   // 양쪽 다 실제 종목이면 바로 비교 실행
    const a=resolveStock(selA.value), b=resolveStock(selB.value);
    if(a.price&&b.price) runCompare();
  };
  makeAutocomplete(selA, document.getElementById('acboxA'), {onPick:cmpPicked, onEnter:()=>runCompare()});
  makeAutocomplete(selB, document.getElementById('acboxB'), {onPick:cmpPicked, onEnter:()=>runCompare()});
  const COL_A='#2a78d6', COL_B='#e0842f';

  function normalizeGaeoMode(mode){ return mode==='leaderboard'?'scorecard':mode; }
  function setMode(mode){ // 'single' | 'watch' | 'guide' | 'compare' | 'portfolio' | 'news' | 'study' | 'lesson' | 'scorecard' | 'calendar' | 'community'
    mode=normalizeGaeoMode(mode);
    const feature={news:'news',study:'study',lesson:'lesson',estate:'estate',calc:'calc',
      calendar:'history',screener:'auto',scorecard:'history',rotation:'rotation',changelog:'changelog'}[mode];
    if(feature&&!GaeoFeatures.ready(feature)){
      const viewId={news:'newsView',study:'studyView',lesson:'lessonView',estate:'estateView',
        calc:'calcView',calendar:'calendarView',scorecard:'scorecardView',rotation:'rotationView',
        changelog:'changelogView'}[mode];
      const view=document.getElementById(viewId);
      if(view){
        // ⚠️ 지연 로딩 대기 중엔 아직 아래 본문 전환부까지 가지 못하고 return 한다.
        //    그래서 직전 화면의 .on을 여기서 직접 걷어내지 않으면, 자료를 받는 몇 초 동안
        //    이전 화면과 "불러오는 중" 안내가 같이 보이는 잔상이 생긴다(2026-08-18 수정).
        document.querySelectorAll('.newsView.on,.paperView.on,.calendarView.on,.communityView.on,'
          +'.rotation-view.on,.fullmarket-view.on,.latest-panel.on,.compare.on,.portfolio.on,.watchView.on')
          .forEach(other=>{ if(other!==view) other.classList.remove('on'); });
        view.classList.add('on');
        view.innerHTML='<div class="nw-empty">자료를 불러오는 중이에요…</div>';
      }
      GaeoFeatures.load(feature).then(()=>{
        if(feature==='history'){
          LIVE_HIST=(typeof LIVE_HISTORY!=='undefined')?LIVE_HISTORY:null;
          LIVE_PH=(typeof PRICE_HISTORY!=='undefined')?PRICE_HISTORY:null;
        }
        setMode(mode);
      }).catch(()=>{
        if(view) view.innerHTML='<div class="nw-empty">자료를 불러오지 못했어요. 잠시 뒤 다시 눌러 주세요.</div>';
      });
      return;
    }
    const single=mode==='single', watch=mode==='watch', compare=mode==='compare', portfolio=mode==='portfolio',
          calendar=mode==='calendar', community=mode==='community',
          guide=mode==='guide', news=mode==='news', study=mode==='study', lesson=mode==='lesson',
          estate=mode==='estate', calc=mode==='calc', screener=mode==='screener', rates=mode==='rates', rotation=mode==='rotation',
          latest=mode==='latest', scorecard=mode==='scorecard', changelog=mode==='changelog',
          paper=mode==='paper', market=mode==='market', deep=mode==='deep', disclosure=mode==='disclosure';
    const sectionCopy={
      market:['코스피·코스닥을 한눈에','오늘 시장','시장국면과 날짜별 시장 분석 기록을 확인해 보세요. 지수 수치는 홈 브리핑과 같은 기준이에요.'],
      deep:['직접 지정해 더 깊게 본 종목','최근 정밀분석','팀이 직접 지정해 더 깊게 확인한 종목의 최신 정밀분석 5건과 전체 기록으로 가는 길이에요.'],
      disclosure:['금융감독원에 오늘 올라온 공시','오늘의 공시','추적 종목이 오늘 낸 공식 공시를 쉬운 말 설명과 함께 확인해 보세요.'],
      single:['왜 이런 판단일까요?','분석가별 근거','기술·재무·확률통계·수급·리스크를 같은 순서로 차분하게 확인해 보세요.'],
      watch:['내 종목에서 달라진 것만','내 종목 관리','저장한 관심종목의 오늘 판단 변화와 점수를 한곳에서 확인하세요.'],
      guide:['처음 오셨나요?','사이트 이용 안내','종목 검색부터 결과 읽는 법까지, 처음 이용하는 분도 순서대로 따라갈 수 있어요.'],
      compare:['나란히 보면 더 잘 보여요','종목 비교','두 종목의 가격·지표·분석 결과를 같은 기준으로 비교해 보세요.'],
      portfolio:['내 종목을 한곳에서','포트폴리오','보유 종목을 모아 전체 흐름과 종목별 분석을 한 화면에서 확인해 보세요.'],
      latest:['새로 올라온 것만 모아서','최근 뉴스·공부 자료','뉴스분석·종목공부·주식공부·부동산공부에 가장 최근 올라온 글 10개를 한곳에 모았어요.'],
      news:['오늘 시장을 쉽게','뉴스 분석','주요 시장 소식의 배경과 투자자가 확인할 점을 초보자 눈높이로 정리했어요.'],
      study:['회사 하나씩 제대로 알아보기','종목 공부','국내외 대표 기업이 어떤 사업으로 돈을 버는지, 최근 이슈와 함께 초보자 눈높이로 정리했어요.'],
      lesson:['기초부터 차근차근','주식 공부','처음 투자할 때 자주 막히는 개념을 사례와 함께 쉽게 익혀보세요.'],
      estate:['집과 정책을 함께 보기','부동산 공부','청약·대출·주거 정책을 실제 자격과 신청 순서 중심으로 확인해 보세요.'],
      calc:['숫자로 직접 확인하기','금융 계산기','수익률·세금·대출·연금처럼 헷갈리는 금액을 한곳에서 바로 계산해 보세요.'],
      screener:['조건에 맞는 종목 찾기','종목 스크리너','원하는 기준을 골라 '+COVERAGE_N+'개 추적 종목 가운데 조건에 맞는 종목을 찾아보세요.'],
      rotation:['업종의 힘이 어디로 움직일까요?','순환매','현재 '+COVERAGE_N+'개의 GAEO 추적 종목을 기준으로 업종의 흐름과 관찰 후보를 확인해 보세요.'],
      rates:['요일별 흐름을 한눈에','등락률 확인','추적 종목의 하루 등락률을 요일별로 모아 시장의 반복 흐름을 참고해 보세요.'],
      scorecard:['우리 판단을 우리가 채점해요','개오 성적표','판단 후 5거래일 뒤 종가로 채점한 실측 데이터로 이번 주 성적과, 분석가마다 왜 적중률이 다른지를 그대로 보여드려요.'],
      paper:['실제 주문 없이, 실제 시세로','모의투자','GAEO가 「매수 고려」로 전환한 시점부터 실제 시장 시세로 결과를 기록하는 공개 검증이에요. 실제 계좌·실제 돈과는 무관합니다.'],
      calendar:['날짜별 기록을 한눈에','월간 분석 캘린더','분석이 나온 날과 결과를 달력에서 골라 날짜별 흐름을 확인해 보세요.'],
      community:['함께 묻고 나누는 공간','커뮤니티','앱 설치 안내와 운영 공지를 확인하고, 자유게시판에 의견과 질문을 남겨주세요.'],
      changelog:['무엇을 만들고, 무엇이 고장 났고','개발 기록','GAEO가 시간순으로 무엇을 만들고 무엇이 고장 났고 어떻게 고쳤는지, 잘된 것과 실수를 함께 남깁니다.']
    };
    // 🌐 순환매 모드는 sub-tab(순환매 판단/전체시장 흐름)에 따라 상단 Section Header도 달라진다.
    // 홈 "전체시장 흐름 보기"로 바로 들어와도 GaeoFmSubTab이 setMode 이전에 설정되므로
    // 첫 페인트부터 전체시장 Header가 나온다(순환매 600 Header가 깜빡이지 않음).
    const fmSubTab=window.GaeoFmSubTab||'rotation';
    const copy=(mode==='rotation'&&typeof window.GaeoFmHeaderCopy==='function')
      ?window.GaeoFmHeaderCopy(fmSubTab)
      :(sectionCopy[mode]||sectionCopy.single);
    const contextTitles={single:'종목 분석',watch:'내 종목 관리',guide:'사이트 이용 안내',compare:'종목 비교',
      portfolio:'포트폴리오',latest:'최근 뉴스·공부 자료',news:'뉴스 분석',study:'종목 공부',lesson:'주식 공부',
      estate:'부동산 공부',calc:'금융 계산기',screener:'종목 스크리너',rotation:'순환매',rates:'등락률 확인',
      scorecard:'개오 성적표',paper:'모의투자',calendar:'월간 분석 캘린더',community:'커뮤니티',changelog:'개발 기록',
      market:'오늘 시장',deep:'최근 정밀분석',disclosure:'오늘의 공시'};
    const contextTitle=document.getElementById('contextTitle');
    if(contextTitle){ contextTitle.textContent=contextTitles[mode]||copy[1]; contextTitle.hidden=single; }
    const stockHeading=document.getElementById('qname');
    const hasStockHeading=Boolean(single&&stockHeading&&stockHeading.textContent.trim());
    if(stockHeading){
      if(hasStockHeading) stockHeading.removeAttribute('aria-hidden');
      else stockHeading.setAttribute('aria-hidden','true');
    }
    const heroTitle=document.querySelector('.hero-title');
    if(heroTitle){
      if(single&&!hasStockHeading) heroTitle.removeAttribute('aria-hidden');
      else heroTitle.setAttribute('aria-hidden','true');
    }
    document.getElementById('modeSectionEyebrow').textContent=copy[0];
    document.getElementById('modeSectionTitle').textContent=copy[1];
    document.getElementById('modeSectionDesc').textContent=copy[2];
    document.getElementById('mode-single').classList.toggle('on',single);
    document.getElementById('mode-watch').classList.toggle('on',watch);
    document.getElementById('mode-guide').classList.toggle('on',guide);
    document.getElementById('mode-compare').classList.toggle('on',compare);
    document.getElementById('mode-portfolio').classList.toggle('on',portfolio);
    document.getElementById('mode-latest').classList.toggle('on',latest);
    document.getElementById('mode-news').classList.toggle('on',news);
    document.getElementById('mode-study').classList.toggle('on',study);
    document.getElementById('mode-lesson').classList.toggle('on',lesson);
    document.getElementById('mode-estate').classList.toggle('on',estate);
    document.getElementById('mode-calc').classList.toggle('on',calc);
    document.getElementById('mode-screener').classList.toggle('on',screener);
    document.getElementById('mode-rotation').classList.toggle('on',rotation);
    document.getElementById('mode-rates').classList.toggle('on',rates);
    document.getElementById('mode-scorecard').classList.toggle('on',scorecard);
    document.getElementById('mode-paper').classList.toggle('on',paper);
    document.getElementById('mode-calendar').classList.toggle('on',calendar);
    document.getElementById('mode-community').classList.toggle('on',community);
    document.getElementById('mode-changelog').classList.toggle('on',changelog);
    document.getElementById('mode-market')?.classList.toggle('on',market);
    document.getElementById('mode-deep')?.classList.toggle('on',deep);
    document.getElementById('mode-disclosure')?.classList.toggle('on',disclosure);
    document.getElementById('guideView').classList.toggle('on',guide);
    window.GaeoCurrentMode=mode;
    if(guide){
      renderGuide();
      beginGuideTutorial('navigation');
      watchGuideCompletion();
    }else endGuideTutorial();
    document.querySelector('.controls').style.display=single?'':'none';
    document.getElementById('chips').style.display=single?'':'none';
    document.getElementById('quote').style.display=single?'':'none';
    document.getElementById('cards').style.display=single?'':'none';
    document.getElementById('analysisDetails').hidden=!(single&&window.GaeoAnalysisReady);
    document.getElementById('cmpControls').style.display=compare?'flex':'none';
    if(!compare) document.getElementById('compare').classList.remove('on');
    document.getElementById('portfolio').classList.toggle('on',portfolio);
    document.getElementById('watchView').classList.toggle('on',watch);
    document.getElementById('scorecardView').classList.toggle('on',scorecard);
    document.getElementById('paperView').classList.toggle('on',paper);
    document.getElementById('calendarView').classList.toggle('on',calendar);
    document.getElementById('communityView').classList.toggle('on',community);
    document.getElementById('latestPanel').classList.toggle('on',latest);
    document.getElementById('newsView').classList.toggle('on',news);
    document.getElementById('studyView').classList.toggle('on',study);
    document.getElementById('lessonView').classList.toggle('on',lesson);
    document.getElementById('estateView').classList.toggle('on',estate);
    document.getElementById('calcView').classList.toggle('on',calc);
    document.getElementById('screenerView').classList.toggle('on',screener);
    document.getElementById('rateView').classList.toggle('on',rates);
    // 🌐 전체시장 흐름 탭이 선택된 상태면 순환매 판단(rotationView) 대신 fullMarketView를 보여준다.
    // window.GaeoFmSubTab은 순환매 모드 밖에서도 유지되어, 다시 순환매로 돌아오면 마지막으로 보던 탭이 이어진다.
    // (fmSubTab은 위 Section Header 선택부에서 이미 선언됨)
    document.getElementById('rotationView').classList.toggle('on',rotation&&fmSubTab!=='fullmarket');
    document.getElementById('fullMarketView').classList.toggle('on',rotation&&fmSubTab==='fullmarket');
    document.getElementById('fmTabHost').classList.toggle('on',rotation);
    if(typeof window.GaeoSyncFmTabButtons==='function') window.GaeoSyncFmTabButtons(fmSubTab);
    document.getElementById('changelogView').classList.toggle('on',changelog);
    document.getElementById('marketView')?.classList.toggle('on',market);
    document.getElementById('deepView')?.classList.toggle('on',deep);
    document.getElementById('disclosureView')?.classList.toggle('on',disclosure);
    if(market&&typeof renderMarket==='function') renderMarket();
    if(disclosure&&typeof renderDartBoard==='function') renderDartBoard();
    if(portfolio){
      // 포트폴리오의 지지·저항·위험 표는 전체 지표를 쓴다(홈 경량본에 없다).
      if(typeof ensureIndicators==='function') ensureIndicators();
      renderPortfolio();
    }
    if(news && window.renderNews) window.renderNews();
    if(study && window.renderStudy) window.renderStudy();
    if(lesson && window.renderLesson) window.renderLesson();
    if(estate && window.renderEstate) window.renderEstate();
    if(calc && window.renderCalc) window.renderCalc();
    if(screener && window.renderScreener) window.renderScreener();
    if(rates){
      document.getElementById('dowbar').style.display='';
      renderCapTop10();
    }
    if(rotation && window.GaeoRotation) window.GaeoRotation.mount(document.getElementById('rotationView'),window.ROTATION_SNAPSHOT);
    if(rotation && fmSubTab==='fullmarket' && window.GaeoMountFullMarket) window.GaeoMountFullMarket();
    if(scorecard) renderScorecard();
    if(paper) renderPaper();
    if(calendar) renderCalendar();
    if(community && window.renderCommunity) window.renderCommunity();
    if(changelog && window.renderChangelog) window.renderChangelog();
  }
  window.setMode=setMode;   // 딥링크 라우터(?m=...)가 페이지 로드 시 호출

  /* 🐛 2026-08-28 — 화면을 스크롤해 내려간 채로 메뉴에서 다른 화면을 고르면, 그 화면이
     목록 중간부터 보이는 문제. 2026-08-27에 「순환매」 하나만 고쳤는데(대표 신고),
     실측해 보니 나머지 18개 메뉴 항목 전부에 같은 증상이 남아 있었다.
     예: y=2500에서 「모의투자」를 누르면 제목도 V1/V2/V3 버튼도 안 보이고
     종료된 거래 목록 한복판이 화면 맨 위에 뜬다.
     → 항목마다 따로 붙이지 말고 한 곳에서 처리한다. 상단 메뉴(data-nav-mode)와
       전체 메뉴(.modebtn)가 같은 함수를 쓴다.
     ⚠️ 60ms 지연은 지우지 말 것 — 전체 메뉴 오버레이가 클릭 40ms 뒤에 닫히므로,
        그보다 늦게 스크롤해야 오버레이가 닫힌 뒤의 실제 레이아웃 기준으로 맞는다. */
  const MODE_VIEW_ID={
    single:'analysisBrowser', compare:'cmpControls', portfolio:'portfolio',
    watch:'watchView', guide:'guideView', latest:'latestPanel', news:'newsView',
    study:'studyView', lesson:'lessonView', estate:'estateView', calc:'calcView',
    screener:'screenerView', rates:'rateView', scorecard:'scorecardView',
    paper:'paperView', calendar:'calendarView', community:'communityView',
    changelog:'changelogView',
    // 2026-09-03 소유자 지시: 시장 분석·최근 정밀분석·오늘의 공시는 홈에서 빠져 별도 화면이 됐다.
    market:'marketView', deep:'deepView', disclosure:'disclosureView',
    // 순환매는 서브탭(순환매 판단 | 전체시장 흐름)에 따라 보이는 쪽이 달라진다.
    rotation:['rotationView','fullMarketView']
  };
  /* 🐛 2026-08-28 회귀수정 — 대표 신고: "종목검색을 누르면 자꾸 검색 화면으로 온다".
     원인: jumpToStock()은 `mode-single` 버튼을 **코드로** 누른 뒤(8587행) 곧바로
     시세 카드(#quote)로 화면을 옮긴다. 그런데 위에서 그 버튼에 붙인 되돌리기가
     60ms 뒤에 실행되면서, 이미 시세 카드로 가 있던 화면을 검색 패널로 끌어왔다
     (실측: 100ms에 시세카드 top=118 → 300ms에 top=1063으로 화면 밖).
     → 갈 곳을 이미 정한 쪽이 예약된 되돌리기를 취소할 수 있게 한다.
        토큰이 바뀌면 예약된 스크롤은 조용히 포기한다(60ms·500ms 둘 다). */
  let GAEO_SCROLL_SEQ=0;
  window.GaeoCancelScrollToMode=function(){ GAEO_SCROLL_SEQ++; };
  window.GaeoScrollToMode=function(mode){
    const my=++GAEO_SCROLL_SEQ;
    if(mode!=='single') setTimeout(()=>{
      const heading=document.getElementById('contextTitle');
      if(heading&&!heading.hidden) heading.focus({preventScroll:true});
    },100);
    const pick=()=>{
      for(const id of [].concat(MODE_VIEW_ID[mode]||[])){
        const el=document.getElementById(id);
        // 숨어 있는 쪽(offsetParent===null)으로 스크롤하면 아무 데도 안 간다.
        if(el&&el.offsetParent!==null) return el;
      }
      return null;
    };
    setTimeout(()=>{
      if(my!==GAEO_SCROLL_SEQ) return;       // 그 사이에 갈 곳을 정한 쪽이 있다 — 양보한다
      const el=pick();
      if(!el){ window.scrollTo({top:0,behavior:window.GaeoMotionBehavior()}); return; }  // 못 찾아도 최소한 맨 위로
      el.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
      /* 늦게 그려지는 화면(방명록·기록처럼 자료를 더 받아오는 곳)은 첫 스크롤 뒤에
         내용이 채워지며 위치가 밀린다. 실측: 커뮤니티가 455px 지나친 자리에서 멈췄다.
         그래서 조금 뒤 한 번만 다시 확인해, 화면 안쪽으로 들어가 버렸으면 바로잡는다.
         제자리면 아무 것도 하지 않는다(멀쩡한 화면을 두 번 튀게 만들지 않는다). */
      setTimeout(()=>{
        if(my!==GAEO_SCROLL_SEQ) return;     // 재정렬도 같은 규칙으로 양보한다
        const again=pick();
        if(again&&again.getBoundingClientRect().top<-8){
          again.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'});
        }
      },500);
    },60);
  };
  document.getElementById('mode-single').onclick=()=>{setMode('single'); SFX.click(); GaeoScrollToMode('single');};
  document.getElementById('mode-watch').onclick=()=>{setMode('watch'); SFX.click(); GaeoScrollToMode('watch');};
  document.getElementById('mode-guide').onclick=()=>{setMode('guide'); SFX.click(); GaeoScrollToMode('guide');};
  document.getElementById('mode-compare').onclick=()=>{window.ensureAutoAnalysis().finally(()=>{setMode('compare'); SFX.click(); runCompare(); GaeoScrollToMode('compare');});};
  document.getElementById('mode-portfolio').onclick=()=>{window.ensureAutoAnalysis().finally(()=>{setMode('portfolio'); SFX.click(); GaeoScrollToMode('portfolio');});};
  document.getElementById('mode-latest').onclick=()=>{setMode('latest'); SFX.click(); GaeoScrollToMode('latest');};
  document.getElementById('mode-news').onclick=()=>{setMode('news'); SFX.click(); GaeoScrollToMode('news');};
  document.getElementById('mode-study').onclick=()=>{setMode('study'); SFX.click(); GaeoScrollToMode('study');};
  document.getElementById('mode-lesson').onclick=()=>{setMode('lesson'); SFX.click(); GaeoScrollToMode('lesson');};
  document.getElementById('mode-estate').onclick=()=>{setMode('estate'); SFX.click(); GaeoScrollToMode('estate');};
  document.getElementById('mode-calc').onclick=()=>{setMode('calc'); SFX.click(); GaeoScrollToMode('calc');};
  document.getElementById('mode-screener').onclick=()=>{setMode('screener'); SFX.click(); GaeoScrollToMode('screener');};
  document.getElementById('mode-rotation').onclick=()=>{setMode('rotation'); SFX.click(); GaeoScrollToMode('rotation');};
  document.getElementById('mode-rates').onclick=()=>{setMode('rates'); SFX.click(); GaeoScrollToMode('rates');};
  document.getElementById('mode-scorecard').onclick=()=>{SC_WEEK_OFFSET=0; setMode('scorecard'); SFX.click(); GaeoScrollToMode('scorecard');};
  document.getElementById('mode-paper').onclick=()=>{setMode('paper'); SFX.click(); GaeoScrollToMode('paper');};
  document.getElementById('mode-calendar').onclick=()=>{setMode('calendar'); SFX.click(); GaeoScrollToMode('calendar');};
  document.getElementById('mode-community').onclick=()=>{setMode('community'); SFX.click(); GaeoScrollToMode('community');};
  document.getElementById('mode-changelog').onclick=()=>{setMode('changelog'); SFX.click(); GaeoScrollToMode('changelog');};
  // 2026-09-03 소유자 지시: '오늘 시장'(시장 분석)·'최근 정밀분석'은 홈이 아니라 전체 메뉴의 별도 화면에서 본다.
  document.getElementById('mode-market').onclick=()=>{setMode('market'); SFX.click(); GaeoScrollToMode('market');};
  document.getElementById('mode-deep').onclick=()=>{setMode('deep'); SFX.click(); GaeoScrollToMode('deep');};
  document.getElementById('mode-disclosure').onclick=()=>{setMode('disclosure'); SFX.click(); GaeoScrollToMode('disclosure');};
  document.querySelector('.modes')?.addEventListener('click',event=>{
    if(!event.target.closest('.modebtn')) return;
    setTimeout(()=>{
      const heading=document.getElementById('contextTitle');
      if(heading&&!heading.hidden) heading.focus({preventScroll:true});
    },100);
  });

  // ---------- 🌐 순환매 화면 2-tab: 순환매 판단 | 전체시장 흐름 ----------
  // rotation-ui.js·compute_rotation.py는 전혀 건드리지 않는다. 이 블록은 순전히
  // rotationView / fullMarketView 두 섹션 사이의 표시 전환과, 전체시장 번들의 지연 로드만 담당한다.
  (function(){
    // 순환매 모드의 상단 Section Header 문구 — sub-tab별로 다르다.
    // setMode(첫 진입·딥링크)와 setFmSubTab(탭 클릭) 양쪽이 이 하나의 소스를 쓴다.
    function fmHeaderCopy(subTab){
      return subTab==='fullmarket'
        ?['시장 전체는 얼마나 함께 움직일까요?','전체시장 흐름','KOSPI·KOSDAQ 전체 적격기업의 상승·하락 참여도와 업종별 확산을 확인해 보세요.']
        :['업종의 힘이 어디로 움직일까요?','순환매','현재 '+COVERAGE_N+'개의 GAEO 추적 종목을 기준으로 업종의 흐름과 관찰 후보를 확인해 보세요.'];
    }
    window.GaeoFmHeaderCopy=fmHeaderCopy;
    function applyFmHeader(subTab){
      const copy=fmHeaderCopy(subTab);
      // 사용자가 실제로 보는 헤더(fmModeHead)는 항상 동기화.
      // modeSection*는 다른 모드(single 등)의 헤더도 공유하므로,
      // 순환매 모드일 때만 갱신해 다른 모드 문구를 덮어쓰지 않는다.
      const alsoSection=window.GaeoCurrentMode==='rotation';
      [['fmModeEyebrow','modeSectionEyebrow'],['fmModeTitle','modeSectionTitle'],['fmModeDesc','modeSectionDesc']].forEach(function(pair,i){
        const fmEl=document.getElementById(pair[0]);
        if(fmEl) fmEl.textContent=copy[i];
        if(alsoSection){ const secEl=document.getElementById(pair[1]); if(secEl) secEl.textContent=copy[i]; }
      });
      const contextTitle=document.getElementById('contextTitle');
      if(alsoSection&&contextTitle) contextTitle.textContent=copy[1];
    }
    function syncFmTabButtons(subTab){
      applyFmHeader(subTab);
      const rBtn=document.getElementById('fmTab-rotation'), fBtn=document.getElementById('fmTab-fullmarket');
      if(rBtn){ const active=subTab!=='fullmarket'; rBtn.classList.toggle('on',active); rBtn.setAttribute('aria-selected',String(active)); rBtn.tabIndex=active?0:-1; }
      if(fBtn){ const active=subTab==='fullmarket'; fBtn.classList.toggle('on',active); fBtn.setAttribute('aria-selected',String(active)); fBtn.tabIndex=active?0:-1; }
      const desc=document.getElementById('fmSegDesc');
      if(desc) desc.innerHTML=subTab==='fullmarket'
        ?'<b>현재 선택 · 전체시장 흐름</b> — KOSPI·KOSDAQ 전체 적격기업의 실제 상승·하락 참여도를 집계한 시장 관찰 화면입니다.'
        :'<b>현재 선택 · 순환매 판단</b> — GAEO 추적 종목을 기준으로 계산한 기존 순환매 판단입니다.';
    }
    window.GaeoSyncFmTabButtons=syncFmTabButtons;
    function setFmSubTab(subTab){
      window.GaeoFmSubTab=subTab;
      syncFmTabButtons(subTab);
      const inRotationMode=window.GaeoCurrentMode==='rotation';
      const rotView=document.getElementById('rotationView'), fmView=document.getElementById('fullMarketView');
      if(rotView) rotView.classList.toggle('on',inRotationMode&&subTab!=='fullmarket');
      if(fmView) fmView.classList.toggle('on',inRotationMode&&subTab==='fullmarket');
      // 상단 Header 동기화는 syncFmTabButtons 안의 applyFmHeader가 이미 수행했다.
      if(inRotationMode&&subTab==='fullmarket'&&window.GaeoMountFullMarket) window.GaeoMountFullMarket();
    }
    const rBtn=document.getElementById('fmTab-rotation'), fBtn=document.getElementById('fmTab-fullmarket');
    if(rBtn) rBtn.onclick=()=>{ setFmSubTab('rotation'); SFX.click(); };
    if(fBtn) fBtn.onclick=()=>{ setFmSubTab('fullmarket'); SFX.click(); };
    const fmTabBar=document.getElementById('fmTabBar');
    if(fmTabBar) fmTabBar.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      const tabs=[rBtn,fBtn].filter(Boolean);
      const current=Math.max(0,tabs.indexOf(document.activeElement));
      const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:
        (current+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      event.preventDefault();
      tabs[next].click();
      tabs[next].focus();
    });
    // 홈 "전체시장 흐름 보기 →"에서 호출 — 순환매 모드 진입 + 전체시장 탭 선택을 한 번에 한다.
    window.openFullMarket=function(){
      window.GaeoFmSubTab='fullmarket';
      window.setMode('rotation');
    };
    // window.GAEO_MARKET_CONTEXT(market_context.js) + full-market-ui.js를 이 탭을 처음 열 때만 받는다.
    // 실패해도 순환매 판단 탭(별도 GaeoFeatures 번들)에는 영향이 없다.
    window.GaeoMountFullMarket=function(){
      const el=document.getElementById('fullMarketView');
      if(!el) return;
      // 업종 펼침의 GAEO 추적 TOP3가 전체 자동분석 기준으로 나오도록 백그라운드 로드.
      // 실패해도 홈 스냅샷 fallback(analysisTally)으로 동작하므로 조용히 무시한다.
      try{ if(window.ensureAutoAnalysis) window.ensureAutoAnalysis().catch(()=>{}); }catch(e){}
      GaeoFeatures.load('fullmarket').then(()=>{
        if(window.GaeoFullMarket&&typeof window.GaeoFullMarket.mount==='function'){
          window.GaeoFullMarket.mount(el,window.GAEO_MARKET_CONTEXT||null);
        }else{
          el.innerHTML='<div class="fm-empty">전체시장 데이터를 불러오지 못했습니다.</div>';
        }
      }).catch(()=>{
        el.innerHTML='<div class="fm-empty">전체시장 데이터를 불러오지 못했습니다.</div>';
      });
    };
  })();

  // 헤더의 "앱처럼 설치하기" 버튼 — 커뮤니티 탭의 PWA 설치 안내 고정 게시글(id 2)로 바로 이동
  window.openCommunityPost=function(postId){
    setMode('community');
    if(window.renderCommunity) window.renderCommunity();
    setTimeout(()=>{
      const el=document.getElementById('cm-post-'+postId);
      if(el){ el.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}); el.classList.add('flash');
        setTimeout(()=>el.classList.remove('flash'),1700); }
    },80);
  };
  const pwaBtn=document.getElementById('pwaAddBtn');
  let installPrompt=null;
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    installPrompt=event;
    if(pwaBtn) pwaBtn.textContent='앱으로 설치하기';
  });
  if('serviceWorker' in navigator){
    window.addEventListener('load',async()=>{
      try{
        const registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
        await registration.update();
      }catch(e){}
    });
  }
  window.addEventListener('appinstalled',()=>{
    installPrompt=null;
    gaeoTrack('app_install',{method:'pwa'});
    if(pwaBtn) pwaBtn.textContent='설치 완료';
  });
  if(pwaBtn) pwaBtn.onclick=async()=>{
    SFX.click();
    if(installPrompt){
      installPrompt.prompt();
      const choice=await installPrompt.userChoice;
      gaeoTrack('install_prompt_result',{outcome:choice.outcome});
      installPrompt=null;
      return;
    }
    gaeoTrack('select_content',{content_type:'install_guide',item_id:'pwa'});
    window.openCommunityPost(2);
  };

  function radarTwo(sA,sB){
    const cx=120,cy=120,R=86, ang=[-90,0,90,180].map(d=>d*Math.PI/180);
    const pt=(f,i)=>[(cx+R*f*Math.cos(ang[i])).toFixed(1),(cy+R*f*Math.sin(ang[i])).toFixed(1)];
    const ring=f=>ang.map((_,i)=>pt(f,i).join(',')).join(' ');
    let g=''; [.25,.5,.75,1].forEach(f=>g+=`<polygon points="${ring(f)}" fill="none" stroke="#e2d8c3" stroke-width="1"/>`);
    ang.forEach((_,i)=>{const[x,y]=pt(1,i);g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e2d8c3" stroke-width="1"/>`;});
    const poly=(s,c)=>{const p=VIZ_AXES.map((a,i)=>pt(Math.max(.04,s[i]/100),i).join(',')).join(' ');
      let d=`<polygon points="${p}" fill="${c}22" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`;
      VIZ_AXES.forEach((a,i)=>{const[x,y]=pt(Math.max(.04,s[i]/100),i);d+=`<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke="#fff" stroke-width="1.2"/>`;});
      return d;};
    g+=poly(sB,COL_B)+poly(sA,COL_A);
    const lbl=[[cx,cy-R-9,'middle'],[cx+R+5,cy+4,'start'],[cx,cy+R+18,'middle'],[cx-R-5,cy+4,'end']];
    VIZ_AXES.forEach((a,i)=>{g+=`<text x="${lbl[i][0]}" y="${lbl[i][1]}" text-anchor="${lbl[i][2]}" font-size="11.5" font-weight="600" fill="#6b6252">${a.label}</text>`;});
    return `<svg viewBox="0 0 240 240" width="238" height="238" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
  }
  function row(label,a,b){
    const awin=a>b, bwin=b>a;
    return `<div class="cmp-row">`+
      `<div class="cmp-a"><span class="cmp-av" style="${awin?'color:'+COL_A:''}">${a}</span>`+
        `<span class="cmp-abar"><i style="width:${Math.max(2,a)}%;background:${COL_A}"></i></span></div>`+
      `<div class="cmp-lbl">${label}</div>`+
      `<div class="cmp-b"><span class="cmp-bbar"><i style="width:${Math.max(2,b)}%;background:${COL_B}"></i></span>`+
        `<span class="cmp-bv" style="${bwin?'color:'+COL_B:''}">${b}</span></div></div>`;
  }
  const badge=v=>`<span class="cmp-badge" style="background:${v.color}">${v.call}</span>`;
  const rateHTML=st=>`<span class="qrate ${st.rate>0?'up':'down'}" style="font-size:13px">${st.rate>0?'▲ +':'▼ '}${st.rate.toFixed(2)}%</span>`;

  window.runCompare=function(){
    const el=document.getElementById('compare');
    const A=resolveStock(selA.value), B=resolveStock(selB.value);
    if(!A.price||!B.price){ el.innerHTML=`<div class="cmp-sum">검색창에서 종목을 골라주세요 — 한글 이름 일부만 쳐도 후보가 떠요.</div>`; el.classList.add('on'); return; }
    const ca=A.code, cb=B.code;
    if(ca===cb){ el.innerHTML=`<div class="cmp-sum">서로 다른 두 종목을 골라주세요.</div>`; el.classList.add('on'); return; }
    const dA=runAnalysis(A), dB=runAnalysis(B), vA=decide(dA,A.code), vB=decide(dB,B.code);
    const sA=VIZ_AXES.map(x=>dA[x.id].score), sB=VIZ_AXES.map(x=>dB[x.id].score);
    const winner=vA.total>vB.total?A.name:vB.total>vA.total?B.name:null;
    // ⚡ 분석가 의견이 크게 갈린 종목엔 배지로 경고 (평균 점수 뒤에 숨은 시각차)
    const clashB=d=>{const c=clashInfo(d);return c?`<span class="clash-badge" title="「${c.hi.label}」 ${c.hi.v}점 vs 「${c.lo.label}」 ${c.lo.v}점 — 분석가 점수가 ${c.spread}점 차이. 해석이 크게 갈리는 종목이라 더 신중히!">의견 갈림</span>`:'';};
    // 🤖/🧠 분석 티어 표식
    const tierB=code=>{const t=analysisTier(code);return t==='auto'?'<span class="tier-badge tier-auto">자동</span>':(t==='deep'?'<span class="tier-badge tier-deep">정밀</span>':'');};
    el.innerHTML=
      `<div class="cmp-top">`+
        `<div class="cmp-side a"><span class="cmp-nm" style="color:${COL_A}">${A.name}${tierB(ca)}</span>`+
          `<span class="cmp-pr">${won(A.price)} ${rateHTML(A)}</span>`+
          `<span>${badge(vA)}${clashB(dA)} <span style="font-size:12px;color:var(--dim)">종합 ${vA.total} · 판단 확신도 ${vA.conf}%</span></span></div>`+
        `<div class="cmp-vs">VS</div>`+
        `<div class="cmp-side b"><span class="cmp-nm" style="color:${COL_B}">${B.name}${tierB(cb)}</span>`+
          `<span class="cmp-pr">${won(B.price)} ${rateHTML(B)}</span>`+
          `<span><span style="font-size:12px;color:var(--dim)">종합 ${vB.total} · 판단 확신도 ${vB.conf}%</span> ${badge(vB)}${clashB(dB)}</span></div>`+
      `</div>`+
      `<div class="cmp-legend"><span><i style="background:${COL_A}"></i>${A.name}</span><span><i style="background:${COL_B}"></i>${B.name}</span></div>`+
      // ⭐ 2026-08-07: 시세 기준·분석 기준을 한 줄에 몰아넣고 종목마다 날짜를 따로 적었더니
      // (예: "분석 기준 제주반도체 2026-08-07 16:08 / 삼성전자 2026-08-07 16:08") 줄바꿈이
      // 세 줄로 깨져서 읽기 힘들었다. 분석 기준은 아래 줄로 내리고, 두 종목의 분석 시각이
      // 같으면(대부분 같은 사이클에 함께 분석되므로) 날짜를 한 번만 적고 종목명만 나열해서
      // 한 줄에 들어오게 한다. 혹시라도 두 종목의 분석 시각이 실제로 다르면(예: 한쪽만
      // 정밀분석 이력이 있는 경우) 다른 값을 숨기지 않고 그대로 각각 표시한다.
      (()=>{
        const aofA=analysisAsOf(ca)||'mock', aofB=analysisAsOf(cb)||'mock';
        const aofLine=(aofA===aofB)
          ? `분석 기준 <b>${aofA}</b> · ${A.name}·${B.name}`
          : `분석 기준 ${A.name} <b>${aofA}</b> · ${B.name} <b>${aofB}</b>`;
        return `<div class="cmp-asof">시세 기준 <b>${priceAsOf()}</b></div>`+
          `<div class="cmp-asof">${aofLine}</div>`;
      })()+
      `<div class="cmp-radarwrap">${radarTwo(sA,sB)}</div>`+
      `<div class="cmp-rows">`+
        row('기술',sA[0],sB[0])+row('재무',sA[1],sB[1])+row('뉴스·심리',sA[2],sB[2])+
        row('수급',sA[3],sB[3])+row('종합',vA.total,vB.total)+row('판단 확신도',vA.conf,vB.conf)+
      `</div>`+
      `<div class="cmp-sum">${winner?`종합 점수 우위: <b>${winner}</b> (${Math.max(vA.total,vB.total)} vs ${Math.min(vA.total,vB.total)}) · 참고용이며 투자 권유가 아닙니다.`:'두 종목 종합 점수가 동일합니다 · 참고용이며 투자 권유가 아닙니다.'}</div>`+
      easyExplain(A,B,vA,vB,sA,sB,ca,cb)+
      noteBlock(A,ca)+noteBlock(B,cb);
    el.classList.add('on');
    el.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'nearest'});
    SFX.ding();
  };

  /* 👑 운영자 한마디 — 관리자 모드 종목메모가 있으면 비교 결과에도 표시 */
  const noteBlock=(S,code)=>{
    const n=(window.gaeoNote&&gaeoNote(code))||'';
    return n?`<div class="anote" style="margin:14px 0 0"><div class="an-t">추가 메모 — ${S.name}</div>${escNote(n)}</div>`:'';
  };

  /* ── 쉬운 말 비교 설명 — analysis.js의 점수·목표주가를 초등학생 눈높이 문장으로 변환 ──
     (사이트가 자동 생성하므로 비교할 때마다 AI 비용이 들지 않는다) */
  function easyExplain(A,B,vA,vB,sA,sB,ca,cb){
    const AXES=[
      {i:0,name:'주가 흐름(차트)',   hi:'최근 주가가 오르려는 힘이 좋아요',            lo:'주가가 아직 아래로 처져 있어요'},
      {i:1,name:'돈 버는 실력(실적)', hi:'회사가 돈을 잘 벌고, 지금 값이 싼 편이에요',   lo:'버는 돈에 비해 주가가 비싸거나 실적 확인이 더 필요해요'},
      {i:2,name:'뉴스와 분위기',      hi:'좋은 소식이 많고 시장의 관심이 높아요',        lo:'걱정되는 소식이 있거나 관심을 덜 받고 있어요'},
      {i:3,name:'큰손들의 매매',      hi:'외국인·기관 같은 큰손들이 사 모으고 있어요',    lo:'큰손들이 팔고 있거나 아직 지켜보는 중이에요'}
    ];
    const callKid=c=>c==='BUY'?'사볼 만해요':(c==='SELL'?'지금은 조심해요':'가지고 있다면 기다려 볼 만해요');
    const tgGap=code=>{
      try{
        const m=String((LIVE_AN[code]||{}).chief.target).match(/\+([\d.]+)%\s*상승여력/);
        return m?parseFloat(m[1]):null;
      }catch(e){ return null; }
    };
    const best=s=>AXES.reduce((p,x)=>s[x.i]>s[p.i]?x:p);
    const worst=s=>AXES.reduce((p,x)=>s[x.i]<s[p.i]?x:p);
    // 이긴 쪽 W / 진 쪽 L 정리 (동점이면 중립 문구)
    let W,L,sW,sL,vW,vL,cW,cL;
    if(vA.total===vB.total){
      return `<div class="cmp-easy"><div class="ce-t">쉬운 말로 정리하면</div>
        <p>${A.name}와(과) ${B.name}는 지금 <b>점수가 똑같아요</b> (둘 다 ${vA.total}점).
        어느 한쪽이 더 낫다고 말하기 어려운 상황이라, 서두르지 말고 다음 소식을 지켜보는 게 좋아요.</p>
        <p class="ce-warn">※ 공부용 설명이에요. 진짜 투자는 어른과 함께 신중하게!</p></div>`;
    }
    if(vA.total>vB.total){ W=A;L=B;sW=sA;sL=sB;vW=vA;vL=vB;cW=ca;cL=cb; }
    else { W=B;L=A;sW=sB;sL=sA;vW=vB;vL=vA;cW=cb;cL=ca; }
    const bW=best(sW), wL=worst(sL), bL=best(sL);
    const gapW=tgGap(cW);
    const diff=vW.total-vL.total;
    const closeness=diff<=4?`아주 근소한 차이(${diff}점)라 사실상 막상막하예요. `:'';
    let h=`<div class="cmp-easy"><div class="ce-t">쉬운 말로 정리하면</div>`;
    h+=`<p><b>${W.name} 점수가 조금 더 높은 이유</b><br>
      100점 만점에 ${W.name} <b>${vW.total}점</b>, ${L.name} <b>${vL.total}점</b>이에요. ${closeness}
      ${W.name}의 최고 강점은 「<b>${bW.name}</b>」(${sW[bW.i]}점) — ${bW.hi}.
      ${gapW!=null?` 전문가들이 적어낸 목표 가격까지 아직 <b>+${gapW}%</b> 올라갈 여유도 있어요.`:''}
      한 줄 결론: <b>${callKid(vW.call)}</b> (${vW.call}).</p>`;
    h+=`<p><b>${L.name} 점수가 낮게 나온 이유</b><br>
      ${L.name}의 아쉬운 점은 「<b>${wL.name}</b>」(${sL[wL.i]}점) — ${wL.lo}.
      그래도 「${bL.name}」(${sL[bL.i]}점)만큼은 괜찮아서, 완전히 나쁜 건 아니에요.
      한 줄 결론: <b>${callKid(vL.call)}</b> (${vL.call}).</p>`;
    h+=`<p class="ce-gloss">용어 풀이 — <b>주가 흐름</b>: 최근 가격이 오르는 중인지 내리는 중인지 ·
      <b>실적</b>: 회사가 장사로 돈을 얼마나 잘 버는지 · <b>큰손</b>: 외국인·기관처럼 돈이 많은 투자자 ·
      <b>목표 가격</b>: 증권사 전문가들이 "이 정도까지 오를 수 있다"고 적어낸 값</p>`;
    h+=`<p class="ce-warn">※ 공부용 설명이에요. 진짜 투자는 어른과 함께 신중하게!</p></div>`;
    return h;
  }
  document.getElementById('cmpRun').onclick=()=>{ SFX.click(); runCompare(); };
})();

/* ============================================================
   오늘의 Gaeo 활동판
   · 방문은 사람 수가 아니라 같은 브라우저 세션에서 하루 1회 집계한 '방문 횟수'
   · 최근 글 5개의 누적 열람을 비교해 공개 인기 순위를 만든다.
   · 외부 집계가 잠시 멈춰도 콘텐츠 수·갱신 시각은 그대로 보여준다.
   ============================================================ */
(function(){
  const board=document.getElementById('activityBoard');
  const profile=document.getElementById('viewsBadge');
  if(!board||!window.GaeoMetrics) return;
  const nfmt=n=>Number(n||0).toLocaleString('ko-KR');
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const contentStats=(typeof CONTENT_STATS!=='undefined'&&CONTENT_STATS)||{};
  const guideCount=['news','study','lesson','estate'].reduce((sum,k)=>sum+Number(contentStats[k]||0),0);
  const stockCount=(typeof STOCKS!=='undefined'&&STOCKS)?Object.keys(STOCKS).length:500;
  document.getElementById('activityGuides').textContent=nfmt(guideCount);
  document.getElementById('activityCalcs').textContent=nfmt(contentStats.calc||0);
  document.getElementById('activityCoverage').innerHTML=`${nfmt(stockCount)}<small>종목</small>`;
  const updated=(typeof LIVE_DATA!=='undefined'&&LIVE_DATA&&(LIVE_DATA.date||
    (LIVE_DATA.marketBrief&&LIVE_DATA.marketBrief.sourceAsOf)))||'갱신 시각 확인 중';
  document.getElementById('activityUpdated').textContent=String(updated);

  function renderVisit(visit){
    const todayExact=visit.exactToday===true, totalExact=visit.exactTotal===true;
    const todayText=nfmt(visit.today)+(todayExact?'':'+');
    const totalText=nfmt(visit.total)+(totalExact?'':'+');
    const todayEl=document.getElementById('activityToday');
    const totalEl=document.getElementById('activityTotal');
    todayEl.innerHTML=`${todayText}<small>회</small>`;
    totalEl.innerHTML=`${totalText}<small>회</small>`;
    todayEl.title=todayExact?'공개 익명 카운터의 오늘 값':'오늘 확인된 최소 카운터 값';
    totalEl.title=totalExact?'공개 익명 카운터의 누적 값':'마지막으로 확인된 최소 누적 카운터 값';
    document.getElementById('activityCountNote').hidden=false;
    if(profile){
      document.getElementById('profileTotal').textContent=totalText;
      profile.title='탭하면 오늘의 Gaeo 방문 현황과 인기 글을 볼 수 있어요 ('+
        (totalExact?'공개 카운터 '+totalText+'회':'최소 공개 카운터 '+totalText+'회')+')';
      profile.style.removeProperty('display');
      profile.classList.add('on');
    }
  }
  function renderPopular(rows){
    const box=document.getElementById('activityPopular');
    const ranked=rows.slice().sort((a,b)=>b.count-a.count||
      String(b.post.date||'').localeCompare(String(a.post.date||''))).slice(0,3);
    if(!ranked.length){
      box.innerHTML='<div class="activity-empty">인기 글 순위를 모으고 있어요.</div>'; return;
    }
    box.innerHTML=ranked.map((row,i)=>`<button class="activity-popular-item" type="button"
      data-mode="${safe(row.post.mode)}" data-id="${safe(row.post.id)}">
      <span class="activity-rank">${i+1}</span>
      <span class="activity-popular-title">${safe(row.post.title)}</span>
      <span class="activity-popular-count">${row.count?nfmt(row.count)+'회':'새 글'}</span>
    </button>`).join('');
    box.querySelectorAll('.activity-popular-item').forEach(btn=>btn.onclick=()=>{
      if(window.openGaeoPost) window.openGaeoPost(btn.dataset.mode,btn.dataset.id,btn);
    });
  }

  const posts=(typeof LATEST_POSTS!=='undefined'&&Array.isArray(LATEST_POSTS))
    ?LATEST_POSTS.slice(0,5):[];
  renderPopular(posts.map(post=>({post,count:0})));
  let currentVisit=window.GaeoMetrics.visitSnapshot();
  renderVisit(currentVisit);
  function refreshMeasurement(){
    window.GaeoMetrics.contentCounts(posts).then(renderPopular).catch(()=>renderPopular(
      posts.map(post=>({post,count:0}))
    ));
    window.GaeoMetrics.startVisit(patch=>{
      currentVisit={...currentVisit,...patch};
      renderVisit(currentVisit);
    }).then(visit=>{
      currentVisit=visit;
      renderVisit(currentVisit);
    }).catch(()=>{});
  }
  refreshMeasurement();
  window.addEventListener('gaeo:measurement-consent-granted',refreshMeasurement);

  const briefBtn=document.getElementById('activityBrief');
  if(briefBtn) briefBtn.onclick=()=>{
    gaeoTrack('select_content',{content_type:'home_shortcut',item_id:'market-brief'});
    document.querySelector('.start-step-summary')?.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'center'});
  };
  const stockBtn=document.getElementById('activityStock');
  if(stockBtn) stockBtn.onclick=()=>{
    const ticker=document.getElementById('homeTicker');
    gaeoTrack('search_open',{search_location:'activity-board'});
    ticker?.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'center'});
    setTimeout(()=>ticker?.focus(),320);
  };
  const calcBtn=document.getElementById('activityCalc');
  if(calcBtn) calcBtn.onclick=()=>{
    gaeoTrack('select_content',{content_type:'home_shortcut',item_id:'calculator'});
    if(window.setMode) window.setMode('calc');
    setTimeout(()=>document.getElementById('calcView')?.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}),180);
  };
})();

/* ============================================================
   비밀번호 입력 모달 — prompt() 대신 ●●● 마스킹 입력.
   관리자 진입과 방문자 글 수정·삭제에 공용으로 쓴다.
   · 👁 버튼: 마스킹을 잠시 풀어 입력값을 눈으로 확인 (모바일 오타 자가진단)
   ============================================================ */
window.askPass=function(title){
  return new Promise(res=>{
    const ov=document.createElement('div'); ov.className='pwm';
    ov.innerHTML=`<div class="pwm-box"><p class="pwm-t">${title}</p>
      <div class="pwm-inrow"><input type="password" autocomplete="off" placeholder="비밀번호">
      <button class="pwm-eye" type="button" title="입력값 보기/가리기">👁</button></div>
      <div class="pwm-btns"><button class="pwm-no">취소</button><button class="pwm-ok">확인</button></div></div>`;
    document.body.appendChild(ov);
    const inp=ov.querySelector('input');
    // 맥/iOS 사파리는 type=password에서 한글 입력기(IME)를 차단한다 —
    // 지원 브라우저에선 text + CSS 마스킹(●●●)으로 바꿔 한글 타이핑을 허용.
    let masked=true;
    const canCssMask=(()=>{ try{ return window.CSS&&CSS.supports&&CSS.supports('-webkit-text-security','disc'); }catch(e){ return false; } })();
    function applyMask(){
      if(canCssMask){ inp.type='text'; inp.style.webkitTextSecurity=masked?'disc':'none'; }
      else inp.type=masked?'password':'text';
    }
    applyMask();
    ov.querySelector('.pwm-eye').onclick=()=>{ masked=!masked; applyMask(); inp.focus(); };
    const done=v=>{ ov.remove(); res(v); };
    ov.querySelector('.pwm-ok').onclick=()=>done(inp.value);
    ov.querySelector('.pwm-no').onclick=()=>done(null);
    ov.onclick=e=>{ if(e.target===ov) done(null); };
    inp.onkeydown=e=>{
      if(e.isComposing||e.keyCode===229) return;          // 한글 조합 중 엔터는 무시(미완성 입력 방지)
      if(e.key==='Enter') done(inp.value);
      if(e.key==='Escape') done(null);
    };
    setTimeout(()=>inp.focus(),50);
  });
};

/* 공용 텍스트 이스케이프 (운영자 메모 등 표시용) */
window.escNote=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])).replace(/\n/g,'<br>');

/* 한글 입력 보정 — 일부 모바일 브라우저는 마스킹 입력칸에서 한글이 조합되지 못하고
   자모(ㄱㅏㅁㅈㅏ…)로 쪼개져 들어간다. 음절을 자모로 전부 분해한 뒤 다시 조합해
   자모가 쪼개진 입력이나 NFD 분해형을 원래 음절(예: "감자")로 정규화한다. */
window.hangulFix=function(str){
  const L=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const V=['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const T=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  let s=String(str||''); try{ s=s.normalize('NFC'); }catch(e){}
  const out=[];
  for(const ch of s){                       // 1) 완성 음절을 자모 스트림으로 분해
    const c=ch.charCodeAt(0);
    if(c>=0xAC00&&c<=0xD7A3){
      const i=c-0xAC00;
      out.push(L[Math.floor(i/588)], V[Math.floor((i%588)/28)]);
      const t=i%28; if(t) out.push(T[t]);
    } else out.push(ch);
  }
  const res=[];
  for(let i=0;i<out.length;i++){            // 2) 그리디 재조합 (L+V+T, 단 T 다음이 모음이면 다음 음절의 초성)
    const li=L.indexOf(out[i]);
    if(li>=0&&i+1<out.length){
      const vi=V.indexOf(out[i+1]);
      if(vi>=0){
        let ti=0;
        if(i+2<out.length){
          const t2=T.indexOf(out[i+2]);
          const nextIsV=i+3<out.length&&V.indexOf(out[i+3])>=0;
          if(t2>0&&!nextIsV){ ti=t2; i++; }
        }
        res.push(String.fromCharCode(0xAC00+li*588+vi*28+ti));
        i++; continue;
      }
    }
    res.push(out[i]);
  }
  return res.join('');
};

/* ============================================================
   커뮤니티 — Git으로 검토·발행한 community.js만 표시한다.
   인증 없는 외부 저장소의 방문자 쓰기·수정·삭제는 공개 배포에서 닫혀 있다.
   ============================================================ */
(function(){
  function effective(){
    try{
      const o=JSON.parse(localStorage.getItem('gaeo_admin_overrides'))||{};
      if(o.community) return o.community;                    // 이 브라우저의 로컬 초안
    }catch(e){}
    return (typeof COMMUNITY!=='undefined'?COMMUNITY:{notice:'',posts:[]});
  }
  const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  window.renderCommunity=function(){
    const box=document.getElementById('communityView'); if(!box) return;
    const cm=effective();
    const posts=(cm.posts||[]).slice().sort((a,b)=>(b.pin?1:0)-(a.pin?1:0) || (b.date||'').localeCompare(a.date||'') || (b.id||0)-(a.id||0));
    let h='';
    if(cm.notice) h+=`<div class="cm-notice">${esc(cm.notice)}</div>`;
    h+=`<div class="cm-sec">게시판</div>`;
    h+=posts.length
      ? posts.map(p=>`<div class="cm-post${p.pin?' pin':''}" id="cm-post-${esc(p.id)}">
          <div class="cm-head"><span class="cm-name">${esc(p.name)||'개오'}</span><span class="cm-date">${esc(p.date)||''}</span>${p.pin?'<span class="cm-pin">고정</span>':''}</div>
          <div class="cm-text">${esc(p.text)}</div></div>`).join('')
      : `<div class="cm-post"><div class="cm-empty">아직 게시글이 없어요.</div></div>`;
    h+=`<div class="cm-sec">방문자 의견</div>
      <div class="cm-guest"><p class="cm-hint">공개 방문자 게시판은 안전한 서버 인증을 갖출 때까지 읽기 전용입니다. 질문이나 수정 요청은 <a href="contact.html">문의하기</a>로 보내주세요.</p></div>`;
    box.innerHTML=h;
  };
})();

/* ============================================================
   로컬 초안 모드 — 제목을 5번 연속 터치(3초 안에) 또는 #admin
   · [문구]   파란 점선 박스 직접 수정 + 행간/글자 크기
   · [디자인] 테마 프리셋 + 포인트/배경 색상
   · [커뮤니티] 공지·게시글 작성/고정/삭제
   · [발행 요청] 변경 파일을 검토 가능한 PR 작업 요청으로 복사
   저장과 미리보기는 이 브라우저에만 적용되며 운영 권한 인증이 아니다.
   ============================================================ */
(function(){
  const KEY='gaeo_admin_overrides';
  const EDITS=()=>Array.from(document.querySelectorAll('[data-edit]'));

  /* ---- 테마 프리셋 ---- */
  const PRESETS={
    navy:  {label:'딥네이비·하늘 (기본)', vars:{}},
    forest:{label:'포레스트 그린', vars:{'--navy':'#14532D','--navy-deep':'#0B3B1F','--navy-soft':'#ECFDF3','--sky':'#10B981','--sky-soft':'#D1FAE5','--sky-line':'#A7F3D0'}},
    violet:{label:'바이올렛', vars:{'--navy':'#4C1D95','--navy-deep':'#3B0764','--navy-soft':'#F5F3FF','--sky':'#8B5CF6','--sky-soft':'#EDE9FE','--sky-line':'#DDD6FE'}},
    rose:  {label:'로즈', vars:{'--navy':'#9F1239','--navy-deep':'#881337','--navy-soft':'#FFF1F2','--sky':'#F43F5E','--sky-soft':'#FFE4E6','--sky-line':'#FECDD3'}}
  };
  const DVARS=['--navy','--navy-deep','--navy-soft','--sky','--sky-soft','--sky-line','--bg'];
  function applyDesign(d){
    d=d||{};
    const root=document.documentElement;
    DVARS.forEach(v=>root.style.removeProperty(v));
    const p=PRESETS[d.preset||'navy'];
    if(p) Object.entries(p.vars).forEach(([k,v])=>root.style.setProperty(k,v));
    if(d.accent)  root.style.setProperty('--sky',d.accent);
    if(d.accent2) root.style.setProperty('--navy',d.accent2);
    if(d.bg)      root.style.setProperty('--bg',d.bg);
    document.body.style.lineHeight=d.lh||'';
    document.documentElement.style.fontSize=d.fs?d.fs+'%':'';
  }

  function load(){
    let o={}; try{ o=JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){}
    if(o.lh||o.fs){ o.design=Object.assign({lh:o.lh,fs:o.fs},o.design||{}); delete o.lh; delete o.fs; } // 구버전 이관
    o.design=o.design||{}; o.notes=o.notes||{}; return o;
  }
  function save(o){ localStorage.setItem(KEY, JSON.stringify(o)); }

  /* 👑 종목메모 — 발행본(SITE_CONFIG.notes) 위에 로컬 초안을 덮어 최종값 반환 */
  window.gaeoNote=function(code){
    const merged=Object.assign({},SC.notes||{},load().notes||{});
    const v=merged[code];
    return (v&&String(v).trim())?String(v).trim():'';
  };

  /* ---- 페이지 로드 시 적용: ① 발행본(SITE_CONFIG, 모두) ② 로컬 미리보기(관리자) ---- */
  const SC=(typeof SITE_CONFIG!=='undefined')?SITE_CONFIG:{texts:{},design:{}};
  function applyAll(){
    const local=load();
    const texts=Object.assign({},SC.texts||{},local.texts||{});
    EDITS().forEach(el=>{ const k=el.dataset.edit; if(texts[k]!=null) el.innerHTML=texts[k]; });
    applyDesign(Object.assign({},SC.design||{},local.design||{}));
  }
  applyAll();

  /* ---- 커뮤니티 상태 ---- */
  function cmState(){
    const o=load();
    if(!o.community){
      const base=(typeof COMMUNITY!=='undefined')?COMMUNITY:{notice:'',posts:[]};
      o.community=JSON.parse(JSON.stringify(base));
    }
    return o;
  }

  /* ---- 발행 요청용 파일 초안 ---- */
  function fileConfig(o){
    const d=Object.assign({},SC.design||{},o.design||{});
    const texts={}; EDITS().forEach(el=>texts[el.dataset.edit]=el.innerHTML);
    const notes={}; const mergedNotes=Object.assign({},SC.notes||{},o.notes||{});
    Object.keys(mergedNotes).forEach(k=>{ const t=String(mergedNotes[k]||'').trim(); if(t) notes[k]=t; });
    const cfg={updated:new Date().toISOString().slice(0,16).replace('T',' '),
      texts, notes,
      design:{preset:d.preset||'navy',accent:d.accent||null,accent2:d.accent2||null,bg:d.bg||null,lh:d.lh||null,fs:d.fs||null}};
    return '// 개오 애널리스트팀 — 사이트 전역 설정 (PR 검토 뒤 적용)\n'
      +'// 로컬 초안 모드가 만든 발행 요청 파일입니다.\n'
      +'const SITE_CONFIG = '+JSON.stringify(cfg,null,1)+';\n';
  }
  function fileTickers(list){
    return '// 개오 애널리스트팀 — 대상 종목 단일 소스(Single Source of Truth)\n'
      +'// 로컬 초안 모드 [📊 종목관리]의 요청을 PR로 병합하면 갱신된다.\n'
      +'// 새 종목의 시세는 다음 자동 수집(평일 장중 10분 간격)부터, 팀 분석은 재분석 요청 시 생성된다.\n'
      +'// (배열 부분은 유효한 JSON — 파이썬 스크립트도 그대로 파싱하므로 키는 큰따옴표 유지)\n'
      +'const TICKERS = [\n'
      + list.map(t=>` {"code":"${t.code}","name":"${t.name}","sector":"${(t.sector||'기타').replace(/"/g,'')}"}`).join(',\n')
      +'\n];\n';
  }
  function tickersChanged(o){
    const draft=o.tickersDraft;
    if(!draft||typeof TICKERS==='undefined') return null;
    const cur=JSON.stringify(TICKERS.map(t=>({code:t.code,name:t.name,sector:t.sector})));
    const drf=JSON.stringify(draft.map(t=>({code:t.code,name:t.name,sector:t.sector})));
    return cur!==drf?draft:null;
  }
  function fileCommunity(o){
    const cm=(o.community)||((typeof COMMUNITY!=='undefined')?COMMUNITY:{notice:'',posts:[]});
    return '// 개오 애널리스트팀 — 커뮤니티 게시글 (PR 검토 뒤 공개)\n'
      +'// 로컬 초안 모드가 만든 발행 요청 파일입니다.\n'
      +'const COMMUNITY = '+JSON.stringify({notice:cm.notice||'',posts:cm.posts||[]},null,1)+';\n';
  }

  /* ---- 패널 ---- */
  let bar=null;
  function h(s){ return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  const pct=(part,total)=>total?`${Math.round(part/total*100)}%`:'—';
  async function hydrateOps(){
    const host=bar&&bar.querySelector('#abOpsBody'); if(!host) return;
    host.innerHTML='<div class="ab-hint" style="margin:14px 0">오늘 운영 신호를 불러오고 있어요.</div>';
    try{
      const snap=await window.GaeoMetrics.adminSnapshot();
      if(!bar||!bar.querySelector('#abOpsBody')) return;
      const t=snap.today;
      const returning=Math.max(0,t.visits-t['new-device']);
      const max=Math.max(1,...snap.series.map(x=>x.value));
      const chart=snap.series.map(x=>`<span class="ab-ops-day" title="${h(x.day)} · ${x.value}회">
        <i class="ab-ops-bar" style="height:${Math.max(4,Math.round(x.value/max*34))}px"></i>
        <em>${Number(x.day.slice(6,8))}일</em></span>`).join('');
      host.innerHTML=`
        <div class="ab-ops-grid">
          <div class="ab-ops-card"><span>오늘 방문</span><strong>${t.visits.toLocaleString()}</strong><small>세션 기준</small></div>
          <div class="ab-ops-card"><span>누적 방문</span><strong>${snap.total.toLocaleString()}</strong><small>전체 기간</small></div>
          <div class="ab-ops-card"><span>재방문 추정</span><strong>${pct(returning,t.visits)}</strong><small>${returning}회 추정</small></div>
          <div class="ab-ops-card"><span>30초 읽기율</span><strong>${pct(t['content-engaged'],t['content-open'])}</strong><small>${t['content-engaged']}/${t['content-open']}건</small></div>
        </div>
        <div class="ab-ops-chart" aria-label="최근 7일 방문 흐름">${chart}</div>
        <div class="ab-funnel">
          <div class="ab-funnel-item"><span>종목 검색</span><b>${t.search.toLocaleString()}회</b></div>
          <div class="ab-funnel-item"><span>글·계산기 열람</span><b>${t['content-open'].toLocaleString()}회</b></div>
          <div class="ab-funnel-item"><span>계산기 실행</span><b>${t['calculator-run'].toLocaleString()}회</b></div>
          <div class="ab-funnel-item"><span>광고 로드</span><b>${t['ad-loaded'].toLocaleString()}회</b></div>
          <div class="ab-funnel-item"><span>광고 50% 노출</span><b>${t['ad-visible'].toLocaleString()}회</b></div>
          <div class="ab-funnel-item"><span>광고 실패</span><b>${t['ad-failed'].toLocaleString()}회</b></div>
        </div>
        <div class="ab-ops-grid">
          <div class="ab-ops-card"><span>광고 표시 성공</span><strong>${pct(t['ad-loaded'],t['ad-loaded']+t['ad-failed'])}</strong><small>로드/(로드+실패)</small></div>
          <div class="ab-ops-card"><span>광고 화면 도달</span><strong>${pct(t['ad-visible'],t['ad-loaded'])}</strong><small>50% 이상 보임</small></div>
        </div>
        <div class="ab-ops-links">
          <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener">Google Analytics 상세</a>
          <a href="https://adfit.kakao.com/" target="_blank" rel="noopener">Kakao AdFit 수익</a>
        </div>
        <div class="ab-hint">방문·재방문은 사람을 식별하지 않는 브라우저 기준 참고값이에요.
        검색어·유입경로·정확한 사용자 수는 Google Analytics에서, 실제 광고 수익은 AdFit에서 확인하세요.
        새 집계는 배포 후부터 쌓이므로 첫 주에는 재방문 추정치가 낮을 수 있어요.</div>`;
    }catch(e){
      host.innerHTML='<div class="ab-hint" style="margin:14px 0">운영 통계를 잠시 불러오지 못했어요. 사이트 이용에는 영향이 없어요.</div>';
    }
  }
  function buildBar(){
    if(bar) return bar;
    bar=document.createElement('div'); bar.className='adminbar adminbar2';
    document.body.appendChild(bar); renderBar('text');
    return bar;
  }
  function renderBar(tab){
    const o=cmState(); const d=Object.assign({},SC.design||{},o.design||{});
    const tabs=[['text','📝 문구'],['design','🎨 디자인'],['ops','📈 운영·광고'],['notes','👑 종목메모'],['stocks','📊 종목관리'],['community','💬 커뮤니티'],['publish','📋 발행 요청']];
    let body='';
    if(tab==='text'){
      body=`<div class="ab-hint" style="margin-top:0">파란 점선 박스(제목·소개글·하단 안내)를 터치하면 바로 고칠 수 있어요.</div>
      <div class="ab-row"><label>행간</label><input type="range" id="abLh" min="1.3" max="2.1" step="0.05" value="${d.lh||1.5}"><span class="ab-val" id="abLhV">${d.lh||1.5}</span></div>
      <div class="ab-row"><label>글자</label><input type="range" id="abFs" min="88" max="118" step="2" value="${d.fs||100}"><span class="ab-val" id="abFsV">${(d.fs||100)}%</span></div>`;
    }else if(tab==='design'){
      body=`<div class="ab-row"><label>테마</label><select id="abPreset" class="ab-in">${
        Object.entries(PRESETS).map(([k,p])=>`<option value="${k}"${(d.preset||'navy')===k?' selected':''}>${p.label}</option>`).join('')}</select></div>
      <div class="ab-row"><label>포인트색</label><input type="color" id="abAccent" value="${d.accent||'#0EA5E9'}"><button class="ab-mini" id="abAccentX">↺</button></div>
      <div class="ab-row"><label>제목색</label><input type="color" id="abAccent2" value="${d.accent2||'#0B4171'}"><button class="ab-mini" id="abAccent2X">↺</button></div>
      <div class="ab-row"><label>배경색</label><input type="color" id="abBg" value="${d.bg||'#F8FAFC'}"><button class="ab-mini" id="abBgX">↺</button></div>
      <div class="ab-hint">고르는 즉시 화면에 미리보기 돼요. 저장은 이 브라우저에만 남고, 공개 반영은 PR 검토가 필요합니다.</div>`;
    }else if(tab==='ops'){
      body=`<div class="ab-ops-head"><div><strong>오늘의 운영·광고 신호</strong>
        <span>방문 → 이용 → 광고 도달 흐름</span></div>
        <button class="ab-ops-refresh" id="abOpsRefresh" type="button">새로고침</button></div>
        <div id="abOpsBody"></div>`;
    }else if(tab==='notes'){
      const T=(typeof TICKERS!=='undefined')?TICKERS:[];
      const notes=Object.assign({},SC.notes||{},o.notes||{});
      const withNote=T.filter(t=>notes[t.code]&&String(notes[t.code]).trim());
      body=`<div class="ab-row"><label>종목</label><select id="abNCode" class="ab-in">${
        T.map(t=>`<option value="${t.code}">${t.name}${(notes[t.code]&&String(notes[t.code]).trim())?' ✍️':''}</option>`).join('')}</select></div>
      <textarea id="abNText" class="ab-ta" placeholder="이 종목에 대한 추가 메모 — 단일 분석 결과와 종목 비교에 노란 카드로 표시돼요"></textarea>
      <div class="ab-btns">
        <button class="ab-save" id="abNSave">✍️ 메모 저장</button>
        <button class="ab-reset" id="abNDel">🗑 메모 삭제</button>
      </div>
      <div class="ab-list">${withNote.length?withNote.map(t=>
        `<div class="ab-item"><span class="ab-item-t">👑 ${t.name} · ${h(String(notes[t.code]).slice(0,20))}${String(notes[t.code]).length>20?'…':''}</span></div>`).join('')
        :'<div class="ab-hint">작성된 메모가 없어요.</div>'}</div>
      <div class="ab-hint">메모는 <b>단일 분석</b>의 판정 카드 위와 <b>종목 비교</b> 결과 아래에 "📝 추가 메모"로 표시돼요.
      저장은 이 브라우저 미리보기이며, <b>PR을 병합해야 모두에게</b> 보여요.</div>`;
    }else if(tab==='stocks'){
      const draft=o.tickersDraft||((typeof TICKERS!=='undefined')?TICKERS.map(t=>({...t})):[]);
      body=`<div class="ab-row"><label>검색</label><input id="abTFind" class="ab-in" list="krxDL" placeholder="회사 이름으로 검색 (예: 카카오)"><datalist id="krxDL"></datalist></div>
      <div class="ab-row"><label>업종폴더</label><input id="abTSec" class="ab-in" placeholder="예: 반도체 / IT (새 이름이면 폴더 자동 생성)" value="기타"></div>
      <div class="ab-btns"><button class="ab-save" id="abTAdd">➕ 목록에 추가</button></div>
      <div class="ab-list">${draft.map(t=>
        `<div class="ab-item"><span class="ab-item-t">${h(t.name)} <span style="opacity:.6">${h(t.code)} · ${h(t.sector||'기타')}</span></span>
         <button class="ab-mini" data-tdel="${h(t.code)}" title="목록에서 제거">🗑</button></div>`).join('')}</div>
      <div class="ab-hint" id="abTHint">이름을 몇 글자만 쳐도 자동완성이 떠요(코드는 몰라도 됨).
      <b>PR을 병합해야</b> 실제 종목 목록(tickers.js)이 바뀌고, 시세는 다음 자동 수집(평일 장중 10분 내)부터 채워져요.
      새 종목의 팀 분석은 병합 후 별도 재분석 작업을 요청하면 생겨요.</div>`;
    }else if(tab==='community'){
      const posts=(o.community.posts||[]);
      body=`<div class="ab-row"><label>공지</label><input type="text" id="abNotice" class="ab-in" placeholder="상단 공지 (비우면 숨김)" value="${h(o.community.notice||'')}"></div>
      <div class="ab-row"><label>새 글</label><input type="text" id="abPName" class="ab-in" style="max-width:110px" placeholder="작성자" value="개오"></div>
      <textarea id="abPText" class="ab-ta" placeholder="게시글 내용을 쓰고 [글 추가]를 누르세요"></textarea>
      <div class="ab-btns"><button class="ab-save" id="abPAdd">➕ 글 추가</button></div>
      <div class="ab-list">${posts.length?posts.map(p=>
        `<div class="ab-item"><span class="ab-item-t">${p.pin?'📌 ':''}${h(p.name)} · ${h((p.text||'').slice(0,22))}${(p.text||'').length>22?'…':''}</span>
         <button class="ab-mini" data-pin="${p.id}" title="고정 토글">📌</button>
         <button class="ab-mini" data-del="${p.id}" title="삭제">🗑</button></div>`).join(''):'<div class="ab-hint">게시글이 없어요.</div>'}</div>
      <div class="ab-hint">여기 글은 로컬 초안입니다. 발행 요청을 별도 작업 환경에서 검토하고 PR로 병합해야 모두에게 보여요. 공개 방문자 쓰기는 현재 닫혀 있습니다.</div>`;
    }else{
      body=`<div class="ab-btns"><button class="ab-save" id="abCopy">📋 PR 발행 요청 복사</button></div>
      <div class="ab-status" id="abStatus"></div>
      <div class="ab-hint"><b>이 화면은 운영 권한 인증이 아니라 이 브라우저의 로컬 초안 도구입니다.</b><br>
      공개 페이지는 토큰을 받거나 저장하지 않고 저장소를 직접 수정하지 않습니다. 복사한 요청은 별도 작업 환경에서 브랜치, 계약 테스트, PR, CI 검토를 거쳐야 반영됩니다.</div>`;
    }
    bar.innerHTML=`
      <div class="ab-title">🔧 로컬 초안 모드 <button class="ab-x" title="닫기">✕</button></div>
      <div class="ab-tabs">${tabs.map(([k,l])=>`<button class="ab-tab${k===tab?' on':''}" data-tab="${k}">${l}</button>`).join('')}</div>
      ${body}
      ${tab==='ops'?'':`<div class="ab-btns">
        <button class="ab-save" id="abSave">💾 저장(이 브라우저)</button>
        <button class="ab-reset" id="abReset">↺ 원래대로</button>
      </div>`}`;
    bar.querySelectorAll('.ab-tab').forEach(b=>b.onclick=()=>renderBar(b.dataset.tab));
    bar.querySelector('.ab-x').onclick=off;

    /* 공통: 저장/리셋 */
    const saveBtn=bar.querySelector('#abSave');
    if(saveBtn) saveBtn.onclick=()=>{
      const o2=cmState();
      const texts={}; EDITS().forEach(el=>texts[el.dataset.edit]=el.innerHTML);
      o2.texts=texts;
      if(tab==='community'){
        const n=bar.querySelector('#abNotice'); if(n) o2.community.notice=n.value;
      }
      save(o2);
      const btn=bar.querySelector('#abSave'); btn.textContent='✅ 저장됨';
      setTimeout(()=>{ if(bar&&bar.querySelector('#abSave')) bar.querySelector('#abSave').textContent='💾 저장(이 브라우저)'; },1500);
      if(window.renderCommunity && document.getElementById('communityView').classList.contains('on')) renderCommunity();
    };
    const resetBtn=bar.querySelector('#abReset');
    if(resetBtn) resetBtn.onclick=()=>{
      if(!confirm('이 브라우저에 저장한 수정사항(문구·디자인·커뮤니티 초안)을 모두 지울까요?\n(발행된 내용은 지워지지 않아요)')) return;
      localStorage.removeItem(KEY); location.reload();
    };

    /* 탭별 동작 */
    if(tab==='text'){
      const lh=bar.querySelector('#abLh'), fs=bar.querySelector('#abFs');
      lh.oninput=()=>{ const o2=cmState(); o2.design.lh=+lh.value; save(o2); document.body.style.lineHeight=lh.value; bar.querySelector('#abLhV').textContent=lh.value; };
      fs.oninput=()=>{ const o2=cmState(); o2.design.fs=+fs.value; save(o2); document.documentElement.style.fontSize=fs.value+'%'; bar.querySelector('#abFsV').textContent=fs.value+'%'; };
    }else if(tab==='design'){
      const upd=(k,v)=>{ const o2=cmState(); if(v==null) delete o2.design[k]; else o2.design[k]=v; save(o2); applyDesign(Object.assign({},SC.design||{},o2.design)); };
      bar.querySelector('#abPreset').onchange=e=>upd('preset',e.target.value);
      bar.querySelector('#abAccent').oninput=e=>upd('accent',e.target.value);
      bar.querySelector('#abAccent2').oninput=e=>upd('accent2',e.target.value);
      bar.querySelector('#abBg').oninput=e=>upd('bg',e.target.value);
      bar.querySelector('#abAccentX').onclick=()=>{upd('accent',null);renderBar('design');};
      bar.querySelector('#abAccent2X').onclick=()=>{upd('accent2',null);renderBar('design');};
      bar.querySelector('#abBgX').onclick=()=>{upd('bg',null);renderBar('design');};
    }else if(tab==='ops'){
      bar.querySelector('#abOpsRefresh').onclick=hydrateOps;
      hydrateOps();
    }else if(tab==='notes'){
      const sel=bar.querySelector('#abNCode'), ta=bar.querySelector('#abNText');
      const fill=()=>{ const merged=Object.assign({},SC.notes||{},cmState().notes||{}); ta.value=merged[sel.value]||''; };
      fill(); sel.onchange=fill;
      const refreshLive=code=>{           // 지금 화면에 그 종목이 떠 있으면 즉시 반영
        const vn=document.getElementById('vnote');
        if(vn&&window.GAEO_CUR_CODE===code){
          const n=gaeoNote(code);
          if(n){ vn.innerHTML='<div class="an-t">📝 추가 메모</div>'+escNote(n); vn.style.display='block'; }
          else vn.style.display='none';
        }
      };
      bar.querySelector('#abNSave').onclick=()=>{
        const o2=cmState(); o2.notes=o2.notes||{}; o2.notes[sel.value]=ta.value.trim();
        save(o2); refreshLive(sel.value); renderBar('notes');
      };
      bar.querySelector('#abNDel').onclick=()=>{
        const o2=cmState(); o2.notes=o2.notes||{}; o2.notes[sel.value]='';
        save(o2); refreshLive(sel.value); renderBar('notes');
      };
    }else if(tab==='stocks'){
      // 상장사 목록(krx_list.json) 지연 로드 → 이름 자동완성
      if(!window.KRX_LIST){
        fetch('krx_list.json?t='+Date.now()).then(r=>r.ok?r.json():null).then(d=>{
          window.KRX_LIST=(d&&d.items)||[];
          if(!window.KRX_LIST.length){ const hEl=bar.querySelector('#abTHint'); if(hEl) hEl.innerHTML='⏳ 상장사 목록 준비 중 — 심부름꾼이 곧 만들어요(최대 10분). 그동안은 6자리 종목코드로 추가할 수 있어요.'; }
        }).catch(()=>{ window.KRX_LIST=[]; });
      }
      const find=bar.querySelector('#abTFind'), dl=bar.querySelector('#krxDL');
      find.oninput=()=>{
        const q=find.value.trim(); if(!dl||!window.KRX_LIST||q.length<1) return;
        const hits=window.KRX_LIST.filter(x=>x.n.indexOf(q)>=0).slice(0,12);
        dl.innerHTML=hits.map(x=>`<option value="${h(x.n)} (${x.c})">${x.m}</option>`).join('');
      };
      bar.querySelector('#abTAdd').onclick=()=>{
        const q=find.value.trim(); if(!q) return alert('회사 이름을 입력하세요.');
        let code=null, name=null;
        const m=q.match(/\((\d{6})\)\s*$/);
        if(m){ code=m[1]; name=q.replace(/\s*\(\d{6}\)\s*$/,'').trim(); }
        else if(/^\d{6}$/.test(q)){ code=q; const k=(window.KRX_LIST||[]).find(x=>x.c===q); name=k?k.n:q; }
        else{ const k=(window.KRX_LIST||[]).find(x=>x.n===q)||(window.KRX_LIST||[]).find(x=>x.n.indexOf(q)>=0);
              if(k){ code=k.c; name=k.n; } }
        if(!code) return alert('종목을 찾지 못했어요 — 자동완성에서 골라주세요.');
        const o2=cmState();
        o2.tickersDraft=o2.tickersDraft||((typeof TICKERS!=='undefined')?TICKERS.map(t=>({...t})):[]);
        if(o2.tickersDraft.some(t=>t.code===code)) return alert('이미 목록에 있어요.');
        o2.tickersDraft.push({code, name, sector:(bar.querySelector('#abTSec').value.trim()||'기타')});
        save(o2); renderBar('stocks');
      };
      bar.querySelectorAll('[data-tdel]').forEach(b=>b.onclick=()=>{
        const o2=cmState();
        o2.tickersDraft=o2.tickersDraft||((typeof TICKERS!=='undefined')?TICKERS.map(t=>({...t})):[]);
        const t=o2.tickersDraft.find(x=>x.code===b.dataset.tdel);
        if(!confirm(`${t?t.name:b.dataset.tdel} 종목을 목록에서 뺄까요?\n(발행해야 실제 반영, 과거 기록은 지워지지 않아요)`)) return;
        o2.tickersDraft=o2.tickersDraft.filter(x=>x.code!==b.dataset.tdel);
        save(o2); renderBar('stocks');
      });
    }else if(tab==='community'){
      bar.querySelector('#abPAdd').onclick=()=>{
        const name=bar.querySelector('#abPName').value.trim()||'개오';
        const text=bar.querySelector('#abPText').value.trim();
        if(!text){ alert('내용을 입력하세요.'); return; }
        const o2=cmState();
        o2.community.notice=bar.querySelector('#abNotice').value;
        const id=Math.max(0,...(o2.community.posts||[]).map(p=>p.id||0))+1;
        o2.community.posts.unshift({id,pin:false,name,date:new Date().toISOString().slice(0,10),text});
        save(o2); renderBar('community');
        if(window.renderCommunity) renderCommunity();
      };
      bar.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
        if(!confirm('이 글을 삭제할까요?')) return;
        const o2=cmState(); o2.community.posts=o2.community.posts.filter(p=>String(p.id)!==b.dataset.del);
        save(o2); renderBar('community'); if(window.renderCommunity) renderCommunity();
      });
      bar.querySelectorAll('[data-pin]').forEach(b=>b.onclick=()=>{
        const o2=cmState(); const p=o2.community.posts.find(p=>String(p.id)===b.dataset.pin);
        if(p){ p.pin=!p.pin; save(o2); renderBar('community'); if(window.renderCommunity) renderCommunity(); }
      });
    }else{ /* publish request */
      const st=bar.querySelector('#abStatus');
      bar.querySelector('#abCopy').onclick=()=>{
        const o2=cmState();
        const tk=tickersChanged(o2);
        const files={'site_config.js':fileConfig(o2),'community.js':fileCommunity(o2)};
        if(tk) files['tickers.js']=fileTickers(tk);
        const payload=window.GaeoReleaseSafety.buildPublishRequest(files);
        (navigator.clipboard?navigator.clipboard.writeText(payload):Promise.reject()).then(
          ()=>{ st.textContent='📋 복사됨! 별도 작업 환경에 붙여넣어 PR 발행을 요청하세요.'; },
          ()=>{ prompt('아래 내용을 복사하세요', payload); });
      };
    }
    return bar;
  }

  function on(){
    buildBar().classList.add('on');
    EDITS().forEach(el=>{ el.contentEditable='true'; el.classList.add('admin-on'); });
  }
  function off(){
    if(bar) bar.classList.remove('on');
    EDITS().forEach(el=>{ el.contentEditable='false'; el.classList.remove('admin-on'); });
  }

  // 진입 동작은 숨겨진 로컬 초안 도구를 열 뿐이며 운영 권한 인증이 아니다.
  let taps=0, tapTimer=null;
  const title=document.getElementById('siteTitle');
  if(title) title.addEventListener('click',()=>{
    taps++;
    if(tapTimer) clearTimeout(tapTimer);
    tapTimer=setTimeout(()=>{ taps=0; },3000);
    if(taps>=5){ taps=0; on(); }
  });
  if(location.hash==='#admin') on();
})();

// ---------- PC 버전 강제보기 토글 (물리적으로 작은 화면: 휴대폰·태블릿) ----------
// 우리 데스크톱 레이아웃은 CSS min-width 기준이라, 모바일 브라우저의 "데스크톱 사이트
// 요청" 기능만으로는 폭이 부족해 안 켜질 수 있다. 그래서 뷰포트 meta를 직접 늘려
// 강제로 데스크톱 그리드를 띄우는 자체 토글을 둔다. screen.width/height는 뷰포트를
// 넓혀도 안 변하는 실제 물리 화면 크기라, 이 버튼을 노출할지 여부를 판단하는 데 쓴다.
// 2026-09-03 소유자 지시: '공유'·'PC 버전으로 보기'는 화면을 따라다니지 않고 페이지 맨 아래(푸터) 도구 줄에 둔다.
function gaeoFootTools(){
  let row=document.querySelector('.foot-tools');
  if(row) return row;
  row=document.createElement('div'); row.className='foot-tools';
  const foot=document.querySelector('footer.foot');
  if(foot){ const links=foot.querySelector('.foot-links'); foot.insertBefore(row, links||null); }
  else document.body.appendChild(row);
  return row;
}
(function(){
  const KEY='gaeo_pcview';
  const isSmallDevice=Math.min(window.screen.width||9999, window.screen.height||9999)<820;
  if(!isSmallDevice) return;
  const metaVp=document.getElementById('viewportMeta');
  const btn=document.createElement('button');
  btn.className='pc-toggle'; btn.type='button';
  function apply(on){
    if(on){
      metaVp.setAttribute('content','width=1400');
      document.documentElement.classList.add('force-desktop');
      btn.innerHTML='📱 모바일 버전으로';
    } else {
      metaVp.setAttribute('content','width=device-width, initial-scale=1.0');
      document.documentElement.classList.remove('force-desktop');
      btn.textContent='PC 버전으로 보기';
    }
    try{ localStorage.setItem(KEY, on?'1':'0'); }catch(e){}
  }
  gaeoFootTools().appendChild(btn);
  apply(document.documentElement.classList.contains('force-desktop'));
  btn.onclick=()=>{ apply(!document.documentElement.classList.contains('force-desktop')); SFX.click(); };
})();

// ---------- 🔗 딥링크 라우터 (?m=news&id=7 등으로 특정 글·종목에 바로 접속) ----------
// 공유(카톡 등)로 받은 링크를 열었을 때, 앱을 그 화면까지 자동으로 이동시켜준다.
// 주소 자체는 항상 index.html 하나(SPA)라 검색엔진 카드는 사이트 공통 1개를 쓰지만,
// 클릭해서 들어온 사람은 정확히 그 글·종목으로 바로 이동한다.
(function(){
  const qp=new URLSearchParams(location.search);
  const m=qp.get('m');
  if(!m) return;
  const id=qp.get('id'), code=qp.get('code');
  function syncContentMetadata(mode,contentId){
    let list=[];
    if(mode==='news'&&typeof NEWS_ANALYSIS!=='undefined') list=NEWS_ANALYSIS;
    else if(mode==='study'&&typeof STOCK_STUDY!=='undefined') list=STOCK_STUDY;
    else if(mode==='lesson'&&typeof STOCK_LESSONS!=='undefined') list=STOCK_LESSONS;
    else if(mode==='estate'&&typeof ESTATE_LESSONS!=='undefined') list=ESTATE_LESSONS;
    else if(mode==='calc'&&typeof CALCULATORS!=='undefined') list=CALCULATORS;
    const item=Array.isArray(list)?list.find(x=>String(x.id)===String(contentId)):null;
    if(!item) return;
    const title=String(item.title||item.name||'').trim();
    const desc=String(item.summary||item.intro||'').replace(/\s+/g,' ').trim().slice(0,155);
    if(title){
      document.title=title+' · Gaeo';
      const ogTitle=document.querySelector('meta[property="og:title"]'); if(ogTitle) ogTitle.content=title;
      const twTitle=document.querySelector('meta[name="twitter:title"]'); if(twTitle) twTitle.content=title;
    }
    if(desc){
      const description=document.querySelector('meta[name="description"]'); if(description) description.content=desc;
      const ogDesc=document.querySelector('meta[property="og:description"]'); if(ogDesc) ogDesc.content=desc;
      const twDesc=document.querySelector('meta[name="twitter:description"]'); if(twDesc) twDesc.content=desc;
    }
    window.GaeoSyncGrowthHead&&window.GaeoSyncGrowthHead();
  }
  (async()=>{
    if(typeof window.setMode!=='function') return;
    // 목적 화면을 먼저 선택하고 그 화면의 지연 번들을 기다린다. 이전 300ms timer는
    // 홈을 먼저 그린 뒤 전체 화면을 바꿔 mobile CLS 0.68~0.69를 만들었다.
    const routeFeature={news:'news',study:'study',lesson:'lesson',estate:'estate',calc:'calc',
      calendar:'history',scorecard:'history',leaderboard:'history',screener:'auto',rotation:'rotation',
      changelog:'changelog'}[m];
    if(routeFeature){
      if(m==='scorecard'||m==='leaderboard') SC_WEEK_OFFSET=0;
      window.setMode(m);
    }
    try{
      if(routeFeature) await GaeoFeatures.load(routeFeature);
    }catch(e){}
    if(m==='news'&&id){ window.setMode('news'); window.openNewsId&&window.openNewsId(id); }
    else if(m==='study'&&id){ window.setMode('study'); window.openStudyId&&window.openStudyId(id); }
    else if(m==='lesson'&&id){ window.setMode('lesson'); window.openLessonId&&window.openLessonId(id); }
    else if(m==='estate'&&id){ window.setMode('estate'); window.openEstateId&&window.openEstateId(id); }
    else if(m==='calc'&&id){ window.setMode('calc'); window.openCalcId&&window.openCalcId(id); }
    else if(m==='single'&&code){
      const s=STOCKS[code];
      if(s&&s.name){
        await jumpToStock(s.name);
        const stockTitle=`${s.name}(${code}) 종목 분석 · Gaeo`;
        document.title=stockTitle;
        const ogTitle=document.querySelector('meta[property="og:title"]'); if(ogTitle) ogTitle.content=stockTitle.replace(' · Gaeo','');
        const twTitle=document.querySelector('meta[name="twitter:title"]'); if(twTitle) twTitle.content=stockTitle.replace(' · Gaeo','');
        window.GaeoSyncGrowthHead&&window.GaeoSyncGrowthHead();
      }
    }
    else if(m==='watch'){ window.setMode('watch'); }
    else if(m==='guide'){ window.setMode('guide'); }
    else if(m==='latest'){ window.setMode('latest'); }
    else if(m==='scorecard'||m==='leaderboard'){ SC_WEEK_OFFSET=0; window.setMode(m); }
    else if(m==='paper'){
      // ?m=paper&view=history — 기록 화면 딥링크(기본은 보유 현황)
      if(qp.get('view')==='history'){
        try{ PV_VIEW='history'; paperLoadHistory(); }catch(e){}
      }
      window.setMode('paper');
    }
    else if(m==='rates'){ window.setMode('rates'); }
    else if(m==='rotation'){ window.setMode('rotation'); }
    else if(m==='changelog'){ window.setMode('changelog'); }
    /* 🔗 2026-08-21: setMode는 처리하는데 라우터에만 분기가 빠져 있던 화면들.
       ?m=compare 같은 링크를 열면 조용히 기본 화면(종목 분석)이 떠서, 공유받은
       사람이 엉뚱한 곳에 도착했다. 아래 5개가 그 상태였다. */
    else if(['compare','portfolio','screener','calendar','community'].includes(m)){
      window.setMode(m);
    }
    // 2026-09-03: 홈에서 빠진 '오늘 시장'(?m=market)·'최근 정밀분석'(?m=deep)·'오늘의 공시'(?m=disclosure) 화면 딥링크.
    else if(m==='market'||m==='deep'||m==='disclosure'){ window.setMode(m); }
    if(['news','study','lesson','estate','calc'].includes(m)&&id) syncContentMetadata(m,id);
    // 동적 글자 조각까지 준비된 뒤 보이면 폰트 swap으로 줄바꿈이 바뀌지 않는다.
    try{await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1200))]);}catch(e){}
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      document.documentElement.classList.remove('route-pending','app-load-failed');
      // route-pending 동안 body는 visibility:hidden이라 focus()가 거부된다. 화면을 공개한
      // 다음 프레임에 현재 종목 제목으로 이동해 딥링크도 일반 검색과 같은 키보드 문맥을 준다.
      if(m==='single'&&code) document.getElementById('qname')?.focus({preventScroll:true});
    }));
  })().catch(()=>{
    document.documentElement.classList.remove('route-pending');
    document.documentElement.classList.add('app-load-failed');
  });
})();

// ---------- 📤 공유 버튼 (카카오톡 포함 스마트폰 공유창 · 로그인/앱키 불필요) ----------
(function(){
  function shareContext(){
    const route=window.GaeoUrls.classifyUrl(location.href);
    const context={page_type:route.pageType};
    if(route.mode) context.content_type=route.mode;
    if(route.id) context.content_id=route.id;
    if(route.stockCode) context.stock_code=route.stockCode;
    return context;
  }
  function trackShare(method){
    const context=shareContext();
    gaeoTrack('share_generate',{method,...context});
  }
  const btn=document.createElement('button');
  btn.className='share-fab'; btn.type='button'; btn.title='이 화면 공유하기'; btn.setAttribute('aria-label','현재 화면 공유하기');
  btn.innerHTML='<span aria-hidden="true">공유</span>';
  gaeoFootTools().appendChild(btn);
  btn.onclick=async()=>{
    const publicUrl=window.GaeoUrls.shareUrl(location.href);
    window.GaeoShareUrl=publicUrl;
    const data={title:document.title, text:'추천보다 이유를, 예측보다 기록을. 판단과 달라진 이유를 확인해보세요.', url:publicUrl};
    if(navigator.share){ try{ await navigator.share(data); trackShare('native'); }catch(e){} }
    else{
      try{ await navigator.clipboard.writeText(publicUrl);
        trackShare('clipboard');
        btn.textContent='✅'; setTimeout(()=>btn.innerHTML='📤',1400);
      }catch(e){ alert('공유하기가 지원되지 않는 브라우저예요. 주소창의 링크를 직접 복사해주세요.'); }
    }
  };
})();

// ---------- 제품 행동 계측: 기존 GA loader를 재사용하고 허용된 이벤트만 보낸다. ----------
(function(){
  function routeParams(){
    const route=window.GaeoProductAnalytics.classifyRoute(location.href);
    const params={page_type:route.pageType,...window.GaeoProductAnalytics.parseUtm(location.href)};
    if(route.mode) params.content_type=route.mode;
    if(route.id) params.content_id=route.id;
    if(route.stockCode) params.stock_code=route.stockCode;
    const ref=String(document.referrer||'');
    if(!ref) params.referrer_group='direct';
    else if(ref.startsWith(location.origin)) params.referrer_group='internal';
    else if(/google\.|naver\.|daum\.|bing\./i.test(ref)) params.referrer_group='search';
    else if(/threads\.|instagram\.|facebook\.|t\.co|twitter\./i.test(ref)) params.referrer_group='social';
    else params.referrer_group='referral';
    return {route,params};
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const {route,params}=routeParams();
    gaeoTrack('landing_view',params,{dedupeKey:'landing:'+location.pathname+location.search});
    try{
      const key='gaeo_product_analytics_seen_v1';
      if(localStorage.getItem(key)) gaeoTrack('return_visit',params,{dedupeKey:'return-visit'});
      else localStorage.setItem(key,new Date().toISOString());
    }catch(e){}
    if(route.pageType==='content_query'&&new URLSearchParams(location.search).get('entry')==='snapshot'){
      gaeoTrack('content_to_product_click',{...params,entry_cluster:'snapshot'},
        {dedupeKey:`content-to-product:${route.mode}:${route.id}`});
    }
  });

  const expanded=new WeakSet();
  document.addEventListener('toggle',event=>{
    const details=event.target;
    if(!(details instanceof HTMLDetailsElement)||!details.open||!details.classList.contains('vev-item')||expanded.has(details)) return;
    expanded.add(details);
    const {params}=routeParams();
    gaeoTrack('evidence_expand',params);
  },true);
  document.addEventListener('click',event=>{
    const source=event.target.closest&&event.target.closest('.nw-src a,[data-gaeo-source]');
    if(!source) return;
    const {params}=routeParams();
    gaeoTrack('source_click',params);
  });
})();

// ---------- Gaeo 상단 글로벌 네비게이션 ----------
// 기존 사이드바 DOM을 그대로 상단 패널로 옮겨 id·이벤트·데이터 연결을 모두 보존한다.
(function(){
  const nav=document.getElementById('globalNav');
  const workspace=document.getElementById('navWorkspace');
  const workspaceBody=document.getElementById('navWorkspaceBody');
  const searchPanel=document.getElementById('navSearchPanel');
  const profilePanel=document.getElementById('navProfilePanel');
  const menuToggle=document.getElementById('navMenuToggle');
  const searchToggle=document.getElementById('navSearchToggle');
  const refreshButton=document.getElementById('navRefresh');
  const profileToggle=document.getElementById('navProfileToggle');
  const rail=document.querySelector('.layout>.rail');
  const home=document.getElementById('homeDashboard');
  const analysisTools=document.getElementById('analysisBrowserTools');
  const analysisControls=rail&&rail.querySelector('.controls');
  const compareControls=document.getElementById('cmpControls');
  const sectorChips=document.getElementById('chips');
  if(analysisTools){
    [analysisControls,compareControls,sectorChips].forEach(element=>{
      if(element) analysisTools.appendChild(element);
    });
  }
  if(rail&&workspaceBody) workspaceBody.appendChild(rail);

  if(refreshButton) refreshButton.addEventListener('click',()=>{
    refreshButton.disabled=true;
    refreshButton.classList.add('is-refreshing');
    refreshButton.setAttribute('aria-label','새로고침 중');
    requestAnimationFrame(()=>window.location.reload());
  });

  const panels=[
    {panel:workspace,button:menuToggle},
    {panel:searchPanel,button:searchToggle},
    {panel:profilePanel,button:profileToggle}
  ];
  function closePanels(except){
    panels.forEach(x=>{
      if(x.panel===except) return;
      x.panel.hidden=true;
      x.button.setAttribute('aria-expanded','false');
    });
    if(!except) document.body.classList.remove('nav-open');
  }
  function togglePanel(panel,button){
    const willOpen=panel.hidden;
    closePanels(panel);
    panel.hidden=!willOpen;
    button.setAttribute('aria-expanded',willOpen?'true':'false');
    document.body.classList.toggle('nav-open',willOpen);
    if(willOpen&&panel===searchPanel){
      const input=document.getElementById('navTicker');
      setTimeout(()=>input&&input.focus(),30);
    }
  }
  /* 전체 메뉴가 실제로 넘칠 때만 하단 경계선을 켠다. 작은 화면에서 마지막 항목이
     잘려 보이면 "메뉴가 깨졌다"고 오해하기 쉬워서, 더 있다는 신호를 준다. */
  const workspaceScroller=workspace.querySelector('.nav-workspace-inner')||workspace;
  function syncNavMore(){
    if(workspace.hidden) return;
    const box=workspace;
    const more=box.scrollHeight>box.clientHeight+1;
    workspaceScroller.classList.toggle('has-more',more);
  }
  workspace.addEventListener('scroll',syncNavMore,{passive:true});
  window.addEventListener('resize',syncNavMore,{passive:true});
  menuToggle.onclick=()=>{togglePanel(workspace,menuToggle);requestAnimationFrame(syncNavMore);};
  searchToggle.onclick=()=>togglePanel(searchPanel,searchToggle);
  profileToggle.onclick=()=>togglePanel(profilePanel,profileToggle);
  /* ── 기본 단축키 (2026-08-16): '/' 검색 열기 · ESC 패널 닫기 ──
     사용자가 입력창에 타이핑 중이거나 modifier를 누른 경우에는 가로채지 않는다. */
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      if(searchPanel&&!searchPanel.hidden){ togglePanel(searchPanel,searchToggle); return; }
      if(workspace&&!workspace.hidden){ togglePanel(workspace,menuToggle); return; }
      if(profilePanel&&!profilePanel.hidden){ togglePanel(profilePanel,profileToggle); }
      return;
    }
    if(event.key!=='/'||event.ctrlKey||event.metaKey||event.altKey||event.isComposing) return;
    const t=event.target;
    if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable)) return;
    event.preventDefault();
    if(searchPanel&&searchPanel.hidden) togglePanel(searchPanel,searchToggle);
    else{ const input=document.getElementById('navTicker'); if(input) input.focus(); }
  });
  document.getElementById('navWorkspaceClose').onclick=()=>closePanels();
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closePanels();});
  document.addEventListener('click',e=>{if(!nav.contains(e.target)) closePanels();});
  workspaceBody.addEventListener('click',e=>{
    if(e.target.closest('.modebtn,.nav-menu-link')) setTimeout(closePanels,40);
  });

  // 📐 기준 · 👁 조회 — 「판단보다 먼저, 기준을 공개해요」·「오늘의 Gaeo」는 메인화면엔 항상 숨겨두고,
  // 각 버튼을 눌렀을 때만 모달로 띄운다. 배경(backdrop) 하나를 두 모달이 함께 쓴다.
  const gaeoBackdrop=document.getElementById('gaeoBackdrop');
  const infoModals=[
    {toggle:document.getElementById('trustInfoToggle'),panel:document.getElementById('trustStrip'),
      close:document.getElementById('trustClose')},
    {toggle:document.getElementById('viewsBadge'),panel:document.getElementById('activityBoard'),
      close:document.getElementById('activityClose')}
  ];
  let activeInfoModal=null;
  const infoReturnTarget=document.getElementById('navProfileToggle');
  const infoFocusableSelector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function setInfoBackgroundInert(active,panel=null){
    [...document.body.children].forEach(element=>{
      const containsPanel=panel&&(element===panel||element.contains(panel));
      if(element===gaeoBackdrop||containsPanel) return;
      element.inert=active;
    });
  }
  function closeInfoModals(restoreFocus=true){
    const hadOpen=infoModals.some(m=>m.panel&&!m.panel.hidden);
    infoModals.forEach(m=>{
      if(m.panel) m.panel.hidden=true;
      if(m.toggle) m.toggle.setAttribute('aria-expanded','false');
    });
    if(gaeoBackdrop) gaeoBackdrop.hidden=true;
    setInfoBackgroundInert(false);
    activeInfoModal=null;
    if(restoreFocus&&hadOpen) requestAnimationFrame(()=>infoReturnTarget?.focus());
  }
  infoModals.forEach(m=>{
    if(!m.toggle||!m.panel) return;
    m.toggle.onclick=()=>{
      closePanels();
      closeInfoModals(false);
      m.panel.hidden=false;
      m.toggle.setAttribute('aria-expanded','true');
      if(gaeoBackdrop) gaeoBackdrop.hidden=false;
      activeInfoModal=m;
      setInfoBackgroundInert(true,m.panel);
      requestAnimationFrame(()=>{ if(m.close) m.close.focus(); else m.panel.focus(); });
    };
    if(m.close) m.close.onclick=closeInfoModals;
  });
  if(gaeoBackdrop) gaeoBackdrop.onclick=closeInfoModals;
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&activeInfoModal){ e.preventDefault(); closeInfoModals(); return; }
    if(e.key!=='Tab'||!activeInfoModal) return;
    const panel=activeInfoModal.panel;
    const focusable=[...panel.querySelectorAll(infoFocusableSelector)]
      .filter(element=>element.getClientRects().length&&!element.hidden);
    if(!focusable.length){ e.preventDefault(); panel.focus(); return; }
    const first=focusable[0],last=focusable[focusable.length-1];
    if(e.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){
      e.preventDefault(); last.focus();
    }else if(!e.shiftKey&&document.activeElement===last){
      e.preventDefault(); first.focus();
    }
  });
  // 「오늘 시장부터/내 종목 확인/금액 직접 계산」이나 인기 글을 누르면, 이동을 보여주기 위해 모달부터 닫는다.
  const activityBoardEl=document.getElementById('activityBoard');
  if(activityBoardEl){
    activityBoardEl.addEventListener('click',e=>{
      if(e.target.closest('.activity-path-item')||e.target.closest('.activity-popular-item')){
        setTimeout(()=>closeInfoModals(false),60);
      }
    });
  }

  function goHome(target){
    if(typeof window.setMode==='function') window.setMode('single');
    const contextTitle=document.getElementById('contextTitle');
    if(contextTitle) contextTitle.hidden=true;
    document.getElementById('qname')?.setAttribute('aria-hidden','true');
    document.querySelector('.hero-title')?.removeAttribute('aria-hidden');
    closePanels();
    const element=target||document.getElementById('homeDashboard');
    setTimeout(()=>element&&element.scrollIntoView({behavior:window.GaeoMotionBehavior(),block:'start'}),40);
  }
  document.getElementById('globalHome').onclick=()=>goHome();
  document.querySelectorAll('[data-nav-home]').forEach(b=>b.onclick=()=>goHome());
  function goMarket(){
    // 2026-09-03 소유자 지시: 시장 분석은 홈이 아니라 '오늘 시장' 화면(모드)에서 본다.
    if(typeof window.setMode==='function') window.setMode('market');
    closePanels();
    setTimeout(()=>{
      const title=document.getElementById('contextTitle');
      if(title&&!title.hidden) title.focus({preventScroll:true});
      window.scrollTo({top:0,behavior:window.GaeoMotionBehavior()});
    },40);
  }
  ['navMarket','navMarketPanel'].forEach(id=>{const b=document.getElementById(id); if(b) b.onclick=goMarket;});
  workspaceBody?.addEventListener('click',event=>{
    const modeButton=event.target.closest('.modebtn');
    if(!modeButton) return;
    closePanels();
    setTimeout(()=>{
      const target=document.getElementById('contextTitle');
      if(target&&!target.hidden) target.focus({preventScroll:true});
    },100);
  });
  document.querySelectorAll('[data-nav-mode]').forEach(button=>{
    button.onclick=()=>{
      const mode=button.dataset.navMode;
      if(typeof window.setMode==='function') window.setMode(mode);
      closePanels();
      // 화면 위치 되돌리기는 전체 메뉴와 같은 함수를 쓴다 — 지도를 두 벌 두면
      // 새 화면을 추가할 때 한쪽만 고쳐져 다시 어긋난다(2026-08-28 통합).
      if(typeof window.GaeoScrollToMode==='function') window.GaeoScrollToMode(mode);
      setTimeout(()=>{
        const target=document.getElementById('contextTitle');
        if(target&&!target.hidden) target.focus({preventScroll:true});
      },100);
    };
  });

  const navTicker=document.getElementById('navTicker');
  const navSearchError=document.getElementById('navSearchError');
  function runNavSearch(){
    const stock=resolveStock(navTicker.value);
    if(!stock.price){
      navTicker.setAttribute('aria-invalid','true');
      if(navSearchError) navSearchError.hidden=false;
      navTicker.focus();
      return;
    }
    navTicker.removeAttribute('aria-invalid');
    if(navSearchError) navSearchError.hidden=true;
    closePanels();
    jumpToStock(stock.name);
  }
  navTicker.addEventListener('input',()=>{
    navTicker.removeAttribute('aria-invalid');
    if(navSearchError) navSearchError.hidden=true;
  });
  makeAutocomplete(navTicker,document.getElementById('navAcbox'),{
    onPick:x=>{closePanels();requestAnimationFrame(()=>jumpToStock(x.name));},
    onEnter:runNavSearch
  });
  document.getElementById('navSearchRun').onclick=runNavSearch;
  document.getElementById('navInstall').onclick=()=>{
    closePanels();
    const install=document.getElementById('pwaAddBtn');
    if(install) install.click();
  };

  function syncMode(){
    const active=document.querySelector('.modebtn.on');
    const mode=active?active.id.replace('mode-',''):'single';
    document.body.dataset.mode=mode;
    document.querySelectorAll('.global-link').forEach(link=>link.classList.remove('on'));
    // 상단 메뉴는 11개인데 전체 메뉴 목적지는 19개라, 상단에 없는 mode는 대표 메뉴의
    // data-nav-alias로 이어 붙인다(안 그러면 엉뚱하게 '홈'에 현재 위치 표시가 켜진다).
    const navMode=document.querySelector(`.global-link[data-nav-mode="${mode}"]`)
               || document.querySelector(`.global-link[data-nav-alias~="${mode}"]`);
    const homeLink=document.querySelector('.global-link[data-nav-home]');
    (navMode||homeLink).classList.add('on');
    // 색을 쓰지 않는 화면이라 현재 위치를 알리는 유일한 수단이 aria-current다.
    document.querySelectorAll('.modes .modebtn').forEach(btn=>{
      if(btn===active) btn.setAttribute('aria-current','page');
      else btn.removeAttribute('aria-current');
    });
  }
  const modes=document.querySelector('.modes');
  if(modes){
    new MutationObserver(syncMode).observe(modes,{subtree:true,attributes:true,attributeFilter:['class']});
  }
  syncMode();
})();

// index.html의 부트 watchdog이 느린 경로 번들을 app.js 실패로 오인하지 않게 한다.
window.__GAEO_APP_EXECUTED__=true;
