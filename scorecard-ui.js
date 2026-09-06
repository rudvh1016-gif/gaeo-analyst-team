/* ============================================================
   🧾 개오 성적표 화면 — 지연 로딩 번들 (2026-09-06 app.js에서 분리)

   왜 분리했나
     app.js가 832KB 예산에 142B만 남긴 채 붙어 있었다. 성적표는 첫 화면에서
     쓰이지 않는데도 모든 방문자가 매번 받아야 했다. 이 파일(약 88KB)을 떼어내
     "성적표/기록 화면을 열 때만" 받게 하면, 첫 화면 전송량이 그만큼 줄고
     성적표를 실제로 고칠 자리도 생긴다.

   ⚠️ 이 파일은 **일반 script**다(모듈 아님). 그래서 app.js의 최상위
      const/let(esc·STOCKS·AGENTS·LIVE_HIST·LIVE_PH·EVAL_DAYS·TEAM_WEIGHTS·
      SC_WEEK_OFFSET…)을 그냥 이름으로 읽고 쓸 수 있다 — app.js도 IIFE로 감싸지
      않은 일반 script라 최상위 선언이 같은 전역 렉시컬 환경에 들어가기 때문이다.
      그러므로 window.*로 새로 내보낼 것이 하나도 없다. 반대로 여기 최상위에
      선언한 function은 app.js에서도 이름으로 부를 수 있다(renderScorecard).

   ⚠️ 로딩 순서: index.html의 GaeoFeatures 'history' 키가 history.js·
      price_history.js와 함께 이 파일을 받는다. app.js는 renderScorecard가
      존재할 때만 호출하므로, 도착 전에 눌러도 깨지지 않는다.

   ⚠️ app.js에 남겨 둔 것 — 성적표 밖에서도 쓰이기 때문이다.
        LB_IDS · scoreStance   : renderCalendar(월간 캘린더)가 쓴다
        let SC_WEEK_OFFSET     : app.js가 딥링크·모드 전환에서 0으로 되돌린다
        goToGuideSection       : 가이드북 이동(여기 리스너가 이름으로 호출한다)
   ============================================================ */



function scorecardAnalystRows(teamWeights,agents){
  const global=teamWeights&&teamWeights.global;
  if(!global||!global.acc) return [];
  const weights=global.weights||{};
  const ids=['taro','diana','nova','flow'];
  return ids.map(id=>{
    const stat=global.acc[id];
    if(!stat) return null;
    const agent=(agents||[]).find(item=>item.id===id)||{name:id,role:'',color:'#999'};
    /* 2026-09-04: team_weights.js가 싣기 시작한 근거(판단일 수, 신뢰구간, '한 방향만
       말했을 때'의 기준선, 그 차이)를 화면까지 들고 온다. 없으면 null. */
    return {id,name:agent.name,role:agent.role,color:agent.color,n:Number(stat.n)||0,
      acc:stat.acc==null?null:Number(stat.acc),weight:weights[id]==null?null:Number(weights[id]),
      days:stat.uniqueDecisionDays==null?null:Number(stat.uniqueDecisionDays),
      minDays:stat.minDaysForConclusion==null?null:Number(stat.minDaysForConclusion),
      accCi:Array.isArray(stat.acc95)?stat.acc95:null,
      liftCi:Array.isArray(stat.lift95)?stat.lift95:null,
      baseline:stat.bestFixedDirectionAcc==null?null:Number(stat.bestFixedDirectionAcc),
      lift:stat.liftVsFixedPp==null?null:Number(stat.liftVsFixedPp),
      status:stat.skillStatus||null,
      voice:stat.voice||null};
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
  /* ⭐ 2026-09-04: MVP는 "적중률이 제일 높은 사람"이 아니라 "한 방향만 말한 것보다
     확실히 낫다고 확인된 사람"일 때만 붙인다. 예전에는 채점 3건만 넘으면 1등에게
     붙었는데, 실측에서 1등(FLOW)의 적중률은 같은 행에서 계속 약세라고만 말했을 때와
     차이가 없었다. 근거 없이 왕관을 씌우지 않는다. */
  const proven=r=>TW.global.acc[r.id]?.evidenceStatus==='INDEPENDENTLY_VALIDATED'&&r.status==='PROVEN_ABOVE'&&r.days!==null&&r.minDays!==null&&r.days>=r.minDays;
  const mvpRow=rows.find(proven)||null;
  const STATUS_TEXT={
    NOT_GRADED_YET:{label:'아직 채점 전',color:'var(--dim)'},
    BELOW_FIXED_BASELINE:{label:'기준선보다 낮음 · 탐색',color:'var(--red)'},
    NOT_PROVEN:{label:'실력 확인 아직 안 됨',color:'var(--dim)'},
    ABOVE_FIXED_BASELINE:{label:'표본에서 기준선보다 높음 · 탐색',color:'var(--dim)'},
    PROVEN_ABOVE:{label:'기준선보다 높음 · 독립 검증 필요',color:'var(--dim)'}
  };
  let cards='';
  rows.forEach((r,i)=>{
    const isMvp=mvpRow!==null&&mvpRow.id===r.id;
    const st=STATUS_TEXT[r.status]||{label:'',color:'var(--dim)'};
    /* 적중률 색은 숫자의 높낮이가 아니라 '기준선을 넘었는지'로 정한다.
       기준선을 못 넘은 높은 숫자를 초록으로 칠하면 화면이 근거보다 세게 말하게 된다. */
    const accHtml=r.acc===null
      ? '<span class="lb-acc" style="color:var(--dim)">자료 없음</span>'
      : `<span class="lb-acc" style="color:${st.color}">${r.acc}%</span>`;
    const wHtml=r.weight!==null
      ? `<span class="lb-weight" title="CHIEF가 최종 판단을 합산할 때 이 분석가의 점수에 곱하는 계수예요. 실제로 종합점수를 움직이는 힘은 이 계수에 '그 분석가 점수가 50에서 얼마나 떨어졌나'를 곱한 값이에요.">발언권 ${(r.weight*100).toFixed(0)}%</span>`
      : '';
    const pushHtml=(r.voice&&r.voice.meanPushPoints!=null)
      ? `<div class="lb-push">평소 종합점수를 움직이는 힘 <b>${r.voice.meanPushPoints}점</b>${r.voice.neutralPct!=null?` · 의견 없이 중립인 비율 ${r.voice.neutralPct}%`:''}</div>`
      : '';
    const baseHtml=(r.baseline!==null&&r.lift!==null)
      ? `<div class="lb-base">한 방향만 말해도 <b>${r.baseline}%</b> · 차이 <b>${r.lift>0?'+':''}${r.lift}%p</b>${r.liftCi?` (범위 ${r.liftCi[0]>0?'+':''}${r.liftCi[0]} ~ ${r.liftCi[1]>0?'+':''}${r.liftCi[1]}%p)`:''}</div>`
      : (r.status==='NOT_GRADED_YET'
        ? '<div class="lb-base">채점 기간(20거래일)이 아직 안 지나 성적이 없어요. 발언권은 역할에 따른 출발값이에요.</div>'
        : '');
    const markPct=(r.baseline===null)?null:Math.max(0,Math.min(100,r.baseline));
    cards+=`<div class="lb-card ${isMvp?'mvp':''}">
      <div class="lb-rank">${i+1}</div>
      <div class="lb-who">
        <div class="lb-nm">${r.name}${isMvp?'<span class="lb-mvp-tag">이달의 MVP</span>':''}${wHtml}</div>
        <div class="lb-role">${r.role}</div>
        <div class="lb-bar" title="막대는 적중률이고, 세로선은 아무 실력 없이 한 방향으로만 말했을 때 나오는 값이에요."><i style="width:${r.acc===null?0:r.acc}%"></i>${markPct===null?'':`<span class="lb-base-mark" style="left:${markPct}%"></span>`}</div>
        ${baseHtml}${pushHtml}
      </div>
      <div class="lb-stat">${accHtml}<div class="lb-rec">${st.label}</div>
        <div class="lb-rec">판단 ${r.days===null?'자료 없음':r.days+'일'} · 채점 ${r.n.toLocaleString()}건${r.accCi?` · 범위 ${r.accCi[0]}~${r.accCi[1]}%`:''}</div></div>
    </div>`;
  });
  /* 2026-09-04 정직성: 적중률만 크게 보여 주면 "이 사람이 잘 맞힌다"로 읽힌다. 문장은
     team_weights.js 상태값으로 만들고 숫자를 박아 넣지 않는다(publicClaimPolicy). */
  const graded=rows.filter(r=>r.status&&r.status!=='NOT_GRADED_YET');
  const provenN=graded.filter(proven).length;
  const belowN=graded.filter(r=>r.status==='BELOW_FIXED_BASELINE').length;
  const minDaysAll=rows.reduce((v,r)=>r.minDays!==null?r.minDays:v,null);
  const daysNow=rows.reduce((v,r)=>r.days!==null&&r.days>v?r.days:v,0);
  const honestyNote=graded.length?`<div class="lb-honesty"><b>이 숫자를 어떻게 읽어야 하나요.</b> 적중률이 높다고 실력이 증명된 건 아니에요. 같은 판단을 두고 계속 「오른다」고만, 또는 계속 「내린다」고만 말해도 어느 정도 점수는 나와요. 그 기준선과 비교하되 독립된 새 기록으로도 확인해야 해요. 독립 검증으로 기준선 초과가 확인된 분석가는 <b>${provenN}명</b>이고, 이 표본에서 기준선보다 낮게 관측된 분석가는 <b>${belowN}명</b>이에요. 판단 기록도 아직 <b>${daysNow}일</b>치라서${minDaysAll?`(결론을 내려면 ${minDaysAll}일이 최소 조건이며 충분성은 별도 확인)`:''} 참고용으로만 봐주세요.</div>`:'';
  return `<section class="leaderboard on"><div class="lb-head"><h3>애널리스트 성적</h3></div>
    <div class="lb-sub">각 분석가의 역할에 맞춰 채점합니다. <b>TARO·QUANT·FLOW는 5거래일</b>, 장기 기업가치를 보는 <b>DIANA는 20거래일</b> 뒤 종가를 사용합니다.
    <b>2026년 8월 31일부터 이 적중률은 「시장보다 잘했나」로 채점합니다.</b> 같은 기간 전 종목 등락률의 한가운데 값(중앙값)을 빼고 남은 차이로 맞고 틀림을 가립니다.
    시장이 통째로 오른 날 방향만 따라 말한 것을 실력으로 세지 않기 위해서예요. 그래서 이 숫자는 예전(그냥 올랐나로 채점하던 때)과 바로 비교할 수 없습니다.
    <b>CHIEF 발언권은 역할 기본비중과 보정 적중률을 함께 반영합니다</b>(채점 ${(TW.global.graded||0).toLocaleString()}건 기반, 업종별 보정 ${Object.keys(TW.sectors||{}).length}개).
    <span style="color:var(--faint)">※ 초기 기록 일부는 과거 가격으로 되살린 <b>재구성(백테스트)</b> 판단이 포함돼 있어요(히스토리 표에 「재구성」 표시). 앞으로는 매일 실시간 판단이 쌓입니다.</span></div>
    ${honestyNote}
    ${cards}
    <div class="lb-note">단기축은 시장 대비 ±1%p, DIANA는 ±3%p 이내 차이를 평가 보류합니다. 「이달의 MVP」는 적중률 1등이 아니라 <b>한 방향만 말한 기준선보다 확실히 낫다고 확인됐을 때만</b> 붙습니다.${mvpRow?'':' 지금은 확인된 분석가가 없어 아무에게도 붙지 않습니다.'}
    ${TW.scoring&&TW.scoring.basis==='market_relative_excess'?`기준선은 개오가 추적하는 전 종목의 중앙값이며, 기준선을 만들 표본이 모자란 경우(${Number(TW.scoring.fallbackToAbsoluteN||0).toLocaleString()}건)에만 예전 방식으로 채점했습니다.`:''}</div></section>`;
}

/* ============================================================
   🧾 개오 성적표: 주간 자동 채점 + 분석가 열전
   history.js·price_history.js(판단 채점) + team_weights.js(분석가별 실측 적중률)만으로
   렌더링한다. 새 글을 쓰지 않고 저장된 stance·적중률을 그대로 요약해 보여준다
   (AI 토큰 0원, 서버가 매 사이클 다시 계산할 때마다 이 화면도 자동으로 갱신됨).
   ============================================================ */
const SC_NAME={taro:'TARO',diana:'DIANA',nova:'QUANT',flow:'FLOW'};
const SC_ROLE={taro:'기술적 분석가',diana:'재무·기본적 분석가',nova:'확률·통계 분석가',flow:'수급 분석가'};
// 판단 당시 4인의 stance를 그대로 요약해 "왜 이 방향이었는지" 한 줄로 보여준다. 새로 해석을 붙이지 않고
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
/* 📏 "이 적중률을 얼마나 믿어도 되나" — 판단일 블록 부트스트랩 95% 구간.
   ⚠️ 채점 건수를 독립 시행으로 세면 안 된다. 같은 날 600종목이 한꺼번에 채점되므로
      건수 기준 구간은 실제보다 훨씬 좁게(=실력이 확실한 것처럼) 나온다. Constitution의
      statisticalPolicy.independenceUnit = decision_date와 정책 §14가 정한 대로 **판단일**을
      통째로 뽑아 다시 세는 방식을 쓴다(compute_team_weights.py의 5일 블록 부트스트랩과 같은 취지).
   반환: {lo, hi, days} · 판단일이 너무 적으면 null(그때는 화면에서 구간을 말하지 않는다). */
function scDayBootstrapCI(rows, key, holdStrict, iters){
  const byDay={};
  rows.forEach(r=>{ const d=String(r.date).slice(0,10); if(d) (byDay[d]=byDay[d]||[]).push(r); });
  const days=Object.keys(byDay);
  if(days.length<10) return null;                     // 판단일 10일 미만이면 구간을 말하지 않는다
  /* ⚠️ Math.random을 쓰면 같은 자료인데도 다시 그릴 때마다 구간이 조금씩 달라져서,
     읽는 사람에게는 숫자가 흔들리는 것처럼 보인다(주 넘기기·모델 탭마다 재렌더된다).
     자료에서 뽑은 씨앗으로 매번 같은 난수열을 쓴다 — 자료가 바뀌면 구간도 바뀐다. */
  let seed=(days.length*2654435761)>>>0;
  days.forEach(d=>{ for(let i=0;i<d.length;i++) seed=(seed*31+d.charCodeAt(i))>>>0; });
  const rnd=()=>{ seed=(seed+0x6D2B79F5)>>>0; let t=seed;
    t=Math.imul(t^(t>>>15), t|1); t^=t+Math.imul(t^(t>>>7), t|61);
    return ((t^(t>>>14))>>>0)/4294967296; };
  const N=iters||400, out=[];
  for(let i=0;i<N;i++){
    let hit=0, dec=0;
    for(let k=0;k<days.length;k++){
      const t=scTally(byDay[days[(rnd()*days.length)|0]], key, holdStrict);
      hit+=t.hit; dec+=t.hit+t.miss;
    }
    if(dec) out.push(hit/dec*100);
  }
  if(out.length<N*0.9) return null;
  out.sort((a,b)=>a-b);
  const at=q=>out[Math.min(out.length-1, Math.max(0, Math.round(q*(out.length-1))))];
  return {lo:Math.round(at(0.025)*10)/10, hi:Math.round(at(0.975)*10)/10, days:days.length};
}
// offset주 전의 "채점일 기준 7일 구간" — 0이면 오늘까지 최근 7일, 1이면 그 이전 7일 …
function scWeekRange(offset){
  const end=new Date(Date.now()-offset*7*24*3600*1000);
  const start=new Date(end.getTime()-6*24*3600*1000);
  const fmt=d=>d.toLocaleDateString('sv-SE',{timeZone:'Asia/Seoul'});
  return {start:fmt(start), end:fmt(end)};
}

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
      /* 2026-09-04: 채점 0건인 DIANA가 "보정 적중 50.0%"로 나왔다. 그 50%는 측정값이
         아니라 출발값이다. 이제 null이 오면 "아직 채점 전"이라고 적는다. */
      const gradedTxt=st.adjustedAcc!=null
        ? `보정 적중 ${st.adjustedAcc}% · 채점 ${st.n!=null?Number(st.n).toLocaleString()+'건':'—'}`
        : '아직 채점 전(성적 없음)';
      const dayTxt=st.uniqueDecisionDays!=null?` · 판단 ${st.uniqueDecisionDays}일`:'';
      const pushTxt=(st.voice&&st.voice.meanPushPoints!=null)
        ? ` · 실제로 미는 힘 ${st.voice.meanPushPoints}점`:'';
      return `<span class="ml-wn">${NAME[k]}</span><span class="ml-wv">${(w*100).toFixed(1)}%</span><span class="ml-meter" aria-hidden="true"><i style="width:${Math.min(100,w/0.4*100).toFixed(0)}%"></i></span>`
        +`<span></span><span></span><span class="ml-wsub">${gradedTxt}${dayTxt} · ${st.days!=null?st.days+'거래일 기준':''}${pushTxt}</span>`;
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
      <h4>작은 표본은 믿지 않습니다 (2026년 9월 5일부터 판단일 수로 셉니다)</h4>
      <p>“10번 중 9번 맞았다”고 바로 천재라고 판단하지 않습니다. 표본이 적으면 우연일 가능성이 있으므로 50% 쪽으로 줄여서 평가합니다. <span class="ml-note">(Bayesian shrinkage)</span></p>
      <p><b>그런데 2026년 9월 4일 점검에서 이 장치가 사실상 꺼져 있다는 걸 확인했습니다.</b> 줄이는 기준을 “채점 건수”로 세는데, 같은 날 600종목이 한꺼번에 채점돼 건수가 수천 건으로 불어납니다. 서로 다른 판단일은 훨씬 적은데도 표본이 많은 것처럼 취급돼, 실제로 깎이는 폭이 1%p도 되지 않습니다.</p>
      <p>그래서 2026년 9월 5일부터는 <b>판단일 수를 표본으로 세어</b> 발언권을 계산합니다(가상 판단일 20일을 50%로 두고 섞는 방식). 같은 날 600종목은 한 번의 시행으로 봅니다. 예전처럼 건수로 셀 때의 값은 team_weights.js의 dayBasedShadow.rowBasedLegacy에 비교용으로만 남깁니다. 판단일이 쌓일수록 사전값의 힘은 저절로 줄어듭니다.</p>
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
    <!-- 좁은 화면에서는 5·20·60일 성적이 아래 .mb-mobile-h로 내려가므로 머리글 셋을 함께 숨긴다.
         (2026-09-06 이전에는 "5일"만 안 숨겨서, 모바일 3열 격자의 16px짜리 화살표 칸에 얹혀 있었다.
          11px일 땐 우연히 들어맞았지만 글자를 12.5px로 올리자 잘렸다.) -->
    <div class="mb-legend"><span>모델</span><span>상태</span><span class="mb-h-wide">5일</span><span class="mb-h-wide">20일</span><span class="mb-h-wide">60일</span></div>
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
  /* 🧾 핵심 3줄 — 표를 못 읽어도 "그래서 결론이 뭔데"를 먼저 알 수 있게 한다.
     새로 만든 숫자는 없다. 아래 표에 이미 있는 값을 문장으로 옮기고, 거기에 "얼마나 믿어도
     되는지"(판단일 블록 부트스트랩 구간)만 덧붙인다. 하드코딩된 성과 숫자는 한 개도 없다. */
  const cumBS=allBS.filter(r=>r.exc!==null);
  const cumExc=scTally(cumBS,'exc',true);
  const cumCI=cumExc.acc===null?null:scDayBootstrapCI(cumBS,'exc',true);
  const ledeWeek=wk.total
    ? `이번 주는 판단 <b>${wk.total.toLocaleString()}건</b>의 채점이 끝났고, 그중 <b>${wk.hitN.toLocaleString()}건</b>이 맞았어요${wk.acc===null?'':` (적중률 <b>${wk.acc}%</b>)`}.`
    : '이번 주는 아직 채점이 끝난 판단이 없어요. 판단한 날로부터 5거래일이 지나야 채점되기 때문에, 주 초반에는 비어 있을 수 있어요.';
  const ledeMarket=bsExc.acc===null
    ? '시장이 오르내린 몫을 걷어낸 이번 주 성적은 표본이 없어서 아직 낼 수 없어요.'
    : `시장이 통째로 오르내린 몫을 빼면 이번 주 사고팔기(BUY·SELL) 판단은 <b>${bsExc.acc}%</b> 맞혔어요. 50%는 동전 던지기와 같다는 뜻이에요.`;
  const ledeTrust=cumExc.acc===null
    ? '채점이 끝난 사고팔기 판단이 아직 없어서, 실력인지 운인지 말하기 이릅니다.'
    : (cumCI
        ? `지금까지 쌓인 사고팔기 판단 <b>${(cumExc.hit+cumExc.miss).toLocaleString()}건</b> (판단일 ${cumCI.days}일)의 시장 대비 성적은 <b>${cumExc.acc}%</b>인데, 운으로 흔들릴 수 있는 폭까지 넣으면 <b>${cumCI.lo}~${cumCI.hi}%</b> 사이예요. `+
          (cumCI.lo>50?'이 폭이 통째로 50%보다 위라서, 운만으로 보기는 어려워요.'
           :(cumCI.hi<50?'이 폭이 통째로 50%보다 아래라서, 아직 시장을 이기지 못하고 있어요.'
             :'이 폭 안에 50%가 들어 있어서, 아직 「실력」이라고 말할 수 없어요.'))
        : `지금까지 쌓인 사고팔기 판단 <b>${(cumExc.hit+cumExc.miss).toLocaleString()}건</b>의 시장 대비 성적은 <b>${cumExc.acc}%</b>예요. 아직 판단한 날 수가 적어서 믿어도 되는 폭을 계산하지 않았어요.`);

  const confRowsAll=confTable(allBS,[0,55,60,65,70]);
  const confRowsBuy=confTable(allBS.filter(r=>r.call==='BUY'),[0,40,45,50,55,60]);
  const confRowsSell=confTable(allBS.filter(r=>r.call==='SELL'),[0,45,50,55,60,65,70]);
  /* ⚠️ 비중은 계산해 넣는다(2026-09-06). "약 88%"가 박혀 있었는데 2026-08-14 값이고 표는 82.6%였다 —
     문장과 표가 다르면 그 자체가 신뢰를 깎는다. 분모는 표와 같은 기준(확신도 기록된 행)으로 맞춘다. */
  const confScored=allBS.filter(r=>typeof r.conf==='number');
  const sellShare=confScored.length?Math.round(confScored.filter(r=>r.call==='SELL').length/confScored.length*100):null;
  const confHead=`<thead><tr><th>구간</th><th class="num">건수</th><th class="num">적중률</th><th class="num">시장 대비</th></tr></thead>`;
  const confBlock=confRowsAll?`<div class="sc-block">
    <h3>확신도가 높을수록 잘 맞을까 (전체 누적)</h3>
    <p class="sc-sub">개오팀이 스스로 매긴 판단 확신도를 기준으로 잘라서 채점했어요. 지금까지 쌓인 전체 기록으로 집계합니다(주간 표본은 수십 건뿐이라 우연에 흔들려요).
      ${sellShare!==null&&sellShare>=60?`<b>합친 표는 착시가 있어요.</b> 표본의 ${sellShare}%를 SELL 판단이 차지해서, `:''}아래 BUY·SELL을 나눈 표를 함께 봐야 정확합니다.</p>
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
    /* 2026-09-04: 막대 안에 「한 방향만 말했을 때의 기준선」을 세로선으로 같이 그린다.
       막대가 길어도 세로선을 못 넘었으면 실력의 증거가 아니다. */
    const SC_STATUS={NOT_GRADED_YET:'아직 채점 전',BELOW_FIXED_BASELINE:'기준선보다 낮음 · 탐색',
      NOT_PROVEN:'실력 확인 아직 안 됨',ABOVE_FIXED_BASELINE:'표본에서 기준선보다 높음 · 탐색',PROVEN_ABOVE:'기준선보다 높음 · 독립 검증 필요'};
    const bars=ranked.map(r=>{
      const mark=r.bestFixedDirectionAcc==null?'':
        `<span class="sc-bar-base" style="left:${Math.max(0,Math.min(100,r.bestFixedDirectionAcc))}%"></span>`;
      return `<div class="sc-bar-row">
        <div class="sc-bar-nm">${SC_NAME[r.id]}<small>${SC_ROLE[r.id]}</small></div>
        <div class="sc-bar-track" title="세로선은 아무 실력 없이 한 방향으로만 말했을 때 나오는 값이에요."><i style="width:${r.acc||0}%"></i>${mark}</div>
        <div class="sc-bar-acc">${r.acc==null?'—':r.acc+'%'}</div>
      </div><div class="sc-bar-note">${r.acc==null?'채점 기간이 아직 안 지나 성적이 없어요.'
        :`한 방향만 말해도 ${r.bestFixedDirectionAcc==null?'—':r.bestFixedDirectionAcc+'%'}`
         +`${r.liftVsFixedPp==null?'':` · 차이 ${r.liftVsFixedPp>0?'+':''}${r.liftVsFixedPp}%p`}`
         +`${Array.isArray(r.lift95)?` (범위 ${r.lift95[0]>0?'+':''}${r.lift95[0]} ~ ${r.lift95[1]>0?'+':''}${r.lift95[1]}%p)`:''}`
         +`${r.uniqueDecisionDays==null?'':` · 판단 ${r.uniqueDecisionDays}일`}`}${r.skillStatus?` · <b>${SC_STATUS[r.skillStatus]||''}</b>`:''}</div>`;
    }).join('');
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
      const ex=r.excludedPct==null?'—':r.excludedPct+'%';
      return `<tr><td>${c}</td><td class="num">${Number(r.n).toLocaleString()}건</td><td class="num">${r.acc}%</td><td class="num">${esc(String(r.band||''))}</td><td class="num">${ex}</td></tr>`;
    }).filter(Boolean).join('');
    const teamNote=(team&&team.acc!=null)
      ? `<div class="sc-team-note">개별 분석가 중 숫자가 가장 높은 건 ${SC_NAME[bestA.id]}(${bestA.acc==null?'—':bestA.acc+'%'})인데, `
        +`이 비교는 같은 표본에서 더 잘 맞은 고정방향을 고른 사후 참고 기준이에요. 독립 검증으로 실력이 확인된 것은 아니에요. `
        +`<b>4인의 점수를 CHIEF가 가중 합산한 팀 판단(BUY/HOLD/SELL)의 적중률은 ${team.acc}%</b>예요(채점 ${team.n.toLocaleString()}건).`
        +(team.holdBaselineAcc!=null
          ? ` 다만 <b>같은 기록을 전부 HOLD로만 채점하면 ${team.holdBaselineAcc}%</b>가 나와요. 즉 지금 팀 판단이 아무것도 안 한 기준선보다 앞선 폭은 <b>${team.liftVsHoldPp>0?'+':''}${team.liftVsHoldPp}%p</b>뿐이에요.`
          : '')
        +` 같은 기록 구간에서 관측된 값이며, 여러 관점을 합치는 방식이 앞으로도 더 정확하다는 증명은 아니에요.</div>`
        +(bcRows?`<div class="tbl-scroll"><table class="sc-table"><thead><tr><th>판단</th><th class="num">채점</th><th class="num">적중률</th><th class="num">채점 잣대</th><th class="num">채점 제외</th></tr></thead><tbody>${bcRows}</tbody></table></div>`
          +`<div class="sc-foot-note">채점 잣대가 판단마다 달라요. BUY·SELL은 방향이 ±1%를 넘어야 맞은 걸로 세고, HOLD는 ±5% 안에 머무르면 맞은 걸로 세요. 잣대가 느슨한 HOLD가 전체 채점의 대부분이라, 위 합계 적중률 하나만 보면 실제보다 잘한 것처럼 보여요.
        「채점 제외」는 ±1% 안쪽이라 방향을 가릴 수 없어 빠진 비율이에요. BUY·SELL만 빠지고 HOLD는 하나도 안 빠져서, 판단 종류마다 실제로 채점된 표본의 크기가 달라요.
        빠진 구간이 한쪽으로 치우쳤는지도 따로 재봤는데, 우리에게 유리한 쪽으로 기울지는 않았어요. 자세한 실측 수치는 저장소 문서에 남겨 뒀어요.</div>`:'')
      : '';
    /* ⭐ 2026-09-05 BUY 실적 정직 공개.
       소유자가 "매일 뜨는 BUY는 그래도 쓸데없는 걸 추천하진 않은 것 같다"고 했는데
       실제로 대조해 보니 반대였다. 적중률은 물론이고 "5거래일 안에 크게 빠진 비율"까지
       같이 낸다. 숫자는 team_weights.js가 매 사이클 다시 계산한 값을 그대로 읽는다. */
    const bo=team&&team.buyOutcome;
    let buyNote='';
    if(bo&&bo.allTime){
      const at=bo.allTime, cur=bo.currentVersion, revised=bo.schemaVersion===2;
      const rb=revised?bo.randomBaseline:null, oh=revised?bo.overheatAllTime:null;
      const currentBaseline=revised?bo.currentRandomBaseline:null;
      const worst=(bo.worst||[]).map(w=>`${esc(w.name)} ${w.ret5}%`).join(' · ');
      buyNote=`<div class="sc-team-note"><b>「매수 우위(BUY)」가 실제로 어떻게 끝났는지도 밝힐게요.</b>
        ${revised?'사후 재구성과 정밀분석을 제외한 실제 자동판단 기록':'이전 집계에는 사후 재구성과 정밀분석이 섞여 있어 실제 자동판단 실적으로 해석할 수 없어요. 재계산 전 참고 기록'}
        ${at.n.toLocaleString()}건, 판단 날짜 ${at.uniqueDecisionDays}일이에요.
        방향 적중률은 <b>${at.acc==null?'자료 없음':at.acc+'%'}</b>예요.
        ${at.graded!=null?`이 숫자의 분모는 전체 건수가 아니라 방향을 채점한 ${at.graded.toLocaleString()}건이에요.`:''}
        ${at.positivePct!=null?`전체 기록 중 종가가 오른 비율은 ${at.positivePct}%예요.`:''}
        <b>${at.crashPct}%</b>는 5번째 거래일 종가가 기준가보다 ${Math.abs(bo.crashThresholdPct)}% 이상 낮았어요.
        기간 중 최대 손실과 거래비용은 반영하지 않았어요. 평균 종가 수익률은 ${at.meanRet}%예요.
        ${cur&&cur.acc!=null?`현재 버전의 방향 적중률은 <b>${cur.acc}%</b>, 같은 종가 손실 기준에 해당한 비율은 <b>${cur.crashPct}%</b>예요(판단 날짜 ${cur.uniqueDecisionDays}일).`:''}
        ${worst?`종가 수익률이 가장 낮았던 사례는 ${worst}였어요.`:''}</div>`
        +(rb?`<div class="sc-team-note"><b>같은 날짜의 자동판단 기록과 비교하면 어땠을까요.</b>
        ${esc(rb.note||'')} 방향 적중률 <b>${rb.acc==null?'자료 없음':rb.acc+'%'}</b>, 같은 종가 손실 기준에 해당한 비율 <b>${rb.crashPct}%</b>, 평균 종가 수익률 <b>${rb.meanRet}%</b>예요.
        비교에 사용한 종목·날짜 기록은 ${rb.n.toLocaleString()}건이에요.
        ${currentBaseline?`현재 버전과 같은 날짜의 참고 기준선은 방향 적중 ${currentBaseline.acc}%, 종가 손실 기준 해당 ${currentBaseline.crashPct}%, 평균 ${currentBaseline.meanRet}%예요.`:''}
        상승률·변동성·날짜 등 비교 조건에 따라 결과가 달라져요. 종목 선택 능력이 좋거나 나쁘다거나, 부진의 원인이 한 가지라고 결론 내릴 수 없어요.</div>`:'')
        +(revised&&bo.legacyMixed?`<details class="sc-foot-note"><summary>이전 혼합 집계와 제외 기록</summary>
        사후 재구성과 정밀분석을 포함한 이전 범위는 ${bo.legacyMixed.n.toLocaleString()}건, 방향 적중률 ${bo.legacyMixed.acc}%, 종가 손실 기준 해당 ${bo.legacyMixed.crashPct}%였어요.
        재구성 ${bo.reconstructed?bo.reconstructed.n:0}건과 정밀분석 등 ${bo.nonAuto?bo.nonAuto.n:0}건을 실제 자동판단 실적에서 분리했어요.
        ${bo.provenance?`실제 자동 BUY 중 판단 날짜의 일봉이 없는 기록은 ${bo.provenance.noDecisionCandleBuyN}건이에요. 휴장일의 시세 재사용 등으로 실행 시점을 완전히 복원하지 못하는 한계가 있어요.`:''}</details>`:'')
        +(oh&&oh.enoughSample?`<div class="sc-foot-note"><b>최근 많이 오른 매수 신호에는 상승률 조건을 표시해요.</b>
        과거 해당 조건의 BUY는 <b>${oh.warn.crashPct}%</b>, 조건에 해당하지 않은 BUY는 <b>${oh.calm.crashPct}%</b>가 같은 종가 손실 기준에 해당했어요.
        전체 실제 자동 BUY의 ${oh.warnSharePct}%가 상승률 조건에 해당했고, 조건 판정 자료가 부족한 기록은 ${oh.unknownN}건이에요.
        ${oh.crashGapCi95?`연속 날짜 묶음으로 다시 계산한 차이의 참고 구간은 ${oh.crashGapCi95[0]}~${oh.crashGapCi95[1]}%p예요.`:''}
        같은 과거 자료에서 후보를 고른 탐색 결과예요. 변동성으로 보정한 뒤에도 하락을 예측하는지, 앞으로 손실을 줄이는지는 아직 확인되지 않았어요.
        변동성 자체는 기존 위험 정보에서 볼 수 있어요. 경고는 알려만 주고 판단 자체는 바꾸지 않아요.</div>`:'');
    }
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
      <p class="sc-explain"><b>적중률만 보면 안 되는 이유.</b> 같은 판단을 두고 계속 「오른다」고만, 또는 계속 「내린다」고만 말해도 어느 정도 점수는 나와요. 그래서 막대 안에 그 기준선을 세로선으로 같이 그렸어요. 세로선을 확실히 넘어야 실력이라고 말할 수 있어요.</p>
      <div class="sc-bars">${bars}</div>
      <p class="sc-explain">재무·기본적 분석은 단기 타이밍보다 기업의 중장기 품질을 보는 도구입니다. 그래서 DIANA는 20거래일 뒤 ±3% 기준으로 따로 채점하고, 종합점수 기본 발언권도 12%로 제한했습니다. 다른 분석가는 5거래일 뒤 ±1% 기준입니다. 표본이 작은 업종 성적은 전역 성적과 섞어 과대평가를 줄입니다.</p>
      ${teamNote}${buyNote}
      ${chips?`<div class="sc-chip-head">업종별로는 승자가 달라요 (표본 100건 이상만 집계 · 업종 성적에는 아직 기준선 비교를 붙이지 않았으니 참고용으로만 봐주세요)</div><div class="sc-chips">${chips}</div>`:''}
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

  /* 📂 세 묶음으로 접는다. 예전에는 11개 블록이 한 줄로 늘어서서, 첫 화면에서 "그래서 결론이
     뭔데"를 알 수 없었다. 숫자는 하나도 지우지 않고 「핵심 3줄 + 펼쳐보기」로만 바꾼다.
     열고 닫은 상태는 SC_GROUP_OPEN에 남아, 주 넘기기·모델 탭 전환으로 다시 그려도 유지된다. */
  const group=(id,title,hint,body)=>body.trim()?`<details class="sc-group" data-sc-group="${id}"${SC_GROUP_OPEN.has(id)?' open':''}>
    <summary><b>${title}</b><span class="sc-group-hint">${hint}</span></summary>
    <div class="sc-group-body">${body}</div>
  </details>`:'';

  el.innerHTML=`<div class="sc-block sc-lede">
    <h3>한눈에 보는 결론</h3>
    <p class="sc-lede-line">${ledeWeek}</p>
    <p class="sc-lede-line">${ledeMarket}</p>
    <p class="sc-lede-line">${ledeTrust}</p>
    <p class="sc-sub">판단한 날로부터 5거래일 뒤 종가로 채점해요. 좋은 결과든 아니든 그대로 보여드리고, 아래에서 원래 숫자를 전부 펼쳐 볼 수 있어요.</p>
  </div>
  ${group('week','이번 주 성적 자세히','주간 집계 · 판단 종류별 · 이번 주 사례',`
    <div class="sc-block">
      ${weekNav}
      ${statRow}
      ${weeklyEmpty}
    </div>
    ${callBlock}
    ${weeklyExamples}`)}
  ${group('cumulative','누적 성적 자세히','확신도 구간 · 분석가 열전 · 모델 버전별',`
    ${confBlock}
    ${leaderboardHTML()}
    ${versionHtml}
    ${deepDive}`)}
  ${group('research','연구 기록','모델 실험실 · 모델 대결 · 그림자 검증',`
    ${confModelShadow}
    ${modelLabHTML()}
    ${modelBoardHTML()}
    ${modelDive}
    ${rotationShadow}`)}`;
}
/* 펼침 상태 기억. renderScorecard는 주 넘기기·모델 탭 전환 때마다 innerHTML을 통째로 다시
   쓰므로, 이걸 안 남기면 사용자가 펼쳐 둔 묶음이 클릭 한 번에 도로 접힌다(ML_OPEN과 같은 이유).
   기본값은 '이번 주'만 열림 — 첫 화면은 핵심 3줄 + 이번 주 숫자까지만 보이고 나머지는 접힌다. */
const SC_GROUP_OPEN=new Set(['week']);
// details의 toggle 이벤트는 버블링하지 않는다 → capture 단계에서 받는다.
document.getElementById('scorecardView').addEventListener('toggle', e=>{
  const d=e.target;
  if(!d||!d.matches||!d.matches('details.sc-group')) return;
  if(d.open) SC_GROUP_OPEN.add(d.dataset.scGroup); else SC_GROUP_OPEN.delete(d.dataset.scGroup);
}, true);
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
