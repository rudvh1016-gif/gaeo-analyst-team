(function(global){
  'use strict';

  const COMPONENT_LABELS={
    momentum:'상승 탄력',relativeStrength:'시장 대비 강도',flow:'거래량 흐름',breadth:'상승 종목 비율',
    taro:'기술 신호',leadLag:'선행 흐름',similarity:'과거 유사성',regimeMatch:'시장 국면 적합도'
  };
  const escapeHtml=value=>String(value==null?'':value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
  const number=value=>Number.isFinite(Number(value))?Number(value):0;
  const formatDate=value=>String(value||'').replace(/-/g,'.');
  function formatPeriod(period){
    if(!period||!period.periodStart||!period.periodEnd) return '';
    return `${formatDate(period.periodStart)}~${formatDate(period.periodEnd)}`;
  }
  function durationLabel(horizon){
    if(number(horizon)===20) return '약 4주';
    if(number(horizon)===5) return '약 1주';
    return `${number(horizon)}거래일`;
  }

  function formatPercent(value){
    const result=number(value);
    return `${result>0?'+':''}${result.toFixed(1)}%`;
  }
  function confidenceLabel(confidence,unlocked){
    if((confidence==='high'||confidence==='높음')&&!unlocked) return '검증 중';
    if(confidence==='high'||confidence==='높음') return '높음';
    if(confidence==='moderate'||confidence==='보통') return '중간';
    return '낮음';
  }
  function signalLabel(signal){
    return ({'주도':'주도 업종','관찰 후보':'관찰 후보','관찰':'관찰 중'})[signal]||'관찰 중';
  }
  function nodeClass(period){
    if(period.signal==='주도'||number(period.score)>=62) return 'lead';
    if(number(period.score)<44) return 'weak';
    return 'watch';
  }
  function truncate(value,max=8){
    const text=String(value||'');
    return text.length>max?text.slice(0,max-1)+'…':text;
  }
  function sectorPeriod(sector,horizon){
    return (sector.periods||{})[String(horizon)]||{};
  }
  function mapLayout(){
    const mobile=Boolean(global.matchMedia&&global.matchMedia('(max-width:600px)').matches);
    return mobile
      ?{mobile,cx:310,cy:310,slots:6,radii:[105,155,205,255],viewBox:'0 0 620 620',axis:[45,575],nodeRadius:34,centerRadius:62}
      :{mobile,cx:360,cy:260,slots:8,radii:[126,177,224],viewBox:'0 0 720 520',axis:[36,484],nodeRadius:30,centerRadius:61};
  }
  function orbitNodes(sectors,horizon,layout){
    const ranked=sectors.slice().sort((a,b)=>number(sectorPeriod(b,horizon).score)-number(sectorPeriod(a,horizon).score)||a.name.localeCompare(b.name,'ko'));
    return ranked.map((sector,index)=>{
      const ring=Math.floor(index/layout.slots);
      const slot=index%layout.slots;
      const radius=layout.radii[ring]||layout.radii[layout.radii.length-1];
      const offset=ring%2?Math.PI/layout.slots:0;
      const angle=-Math.PI/2+slot*(Math.PI*2/layout.slots)+offset;
      return {
        sector,index,x:layout.cx+Math.cos(angle)*radius,y:layout.cy+Math.sin(angle)*radius,
        period:sectorPeriod(sector,horizon)
      };
    });
  }
  function renderMap(data,horizon,selected){
    const layout=mapLayout();
    const nodes=orbitNodes(data.sectors||[],horizon,layout);
    const nodeMarkup=nodes.map(item=>{
      const active=item.sector.name===selected?' on':'';
      const css=nodeClass(item.period);
      return `<g class="rot-node ${css}${active}" role="button" tabindex="0" data-sector="${escapeHtml(item.sector.name)}" transform="translate(${item.x.toFixed(1)} ${item.y.toFixed(1)})" aria-label="${escapeHtml(item.sector.name)} ${number(item.period.score).toFixed(1)}점">
        <circle r="${layout.nodeRadius}"></circle>
        <text y="-2">${escapeHtml(truncate(item.sector.name))}</text>
        <text class="rot-node-score" y="12">${number(item.period.score).toFixed(1)}점</text>
      </g>`;
    }).join('');
    const title=horizon===1?'단기 움직임':horizon===20?'한 달 흐름':`${horizon}일 흐름`;
    return `<div class="rot-map${layout.mobile?' rot-map-mobile':''}" aria-label="업종 순환 지도">
      <svg viewBox="${layout.viewBox}" role="img" aria-labelledby="rotMapTitle rotMapDesc">
        <title id="rotMapTitle">${title} 업종 순환 지도</title>
        <desc id="rotMapDesc">중앙에 가까울수록 현재 점수가 높은 업종입니다. 상세 순위는 지도 아래 표에서도 확인할 수 있습니다.</desc>
        <line class="rot-axis" x1="${layout.axis[0]}" y1="${layout.cy}" x2="${layout.axis[1]}" y2="${layout.cy}"></line><line class="rot-axis" x1="${layout.cx}" y1="${layout.axis[0]}" x2="${layout.cx}" y2="${layout.axis[1]}"></line>
        ${layout.radii.map(radius=>`<circle class="rot-orbit" cx="${layout.cx}" cy="${layout.cy}" r="${radius}"></circle>`).join('')}
        <circle class="rot-center" cx="${layout.cx}" cy="${layout.cy}" r="${layout.centerRadius}"></circle>
        <text class="rot-center-title" x="${layout.cx}" y="${layout.cy-6}">${horizon}거래일</text><text class="rot-center-copy" x="${layout.cx}" y="${layout.cy+13}">가까울수록 강한 흐름</text>
        ${nodeMarkup}
      </svg>
    </div>`;
  }
  function renderRank(data,horizon){
    return (data.sectors||[]).slice().sort((a,b)=>number(sectorPeriod(b,horizon).score)-number(sectorPeriod(a,horizon).score)).slice(0,8).map((sector,index)=>{
      const period=sectorPeriod(sector,horizon);
      return `<button class="rot-rank" type="button" data-sector="${escapeHtml(sector.name)}"><span class="rot-rank-no">${String(index+1).padStart(2,'0')}</span><span class="rot-rank-name">${escapeHtml(sector.name)}<small>${signalLabel(period.signal)} · ${confidenceLabel(period.confidence,data.model&&data.model.highConfidenceUnlocked)}</small></span><span class="rot-rank-score">${number(period.score).toFixed(1)}</span></button>`;
    }).join('');
  }
  function renderDetail(data,sector,horizon){
    const period=sectorPeriod(sector,horizon);
    const components=period.components||{};
    const explanation=period.scoreExplanation||{};
    const contributions=explanation.contributions||{};
    const guide=Object.fromEntries((data.componentGuide||[]).map(item=>[item.key,item]));
    const meters=Object.keys(COMPONENT_LABELS).map(key=>{
      const value=Math.max(0,Math.min(100,number(components[key])));
      const help=(guide[key]&&guide[key].description)||'';
      const label=COMPONENT_LABELS[key];
      return `<div class="rot-meter"><div class="rot-meter-head"><span>${label} <button type="button" class="rot-help" data-tip="${escapeHtml(help)}" aria-label="${label} 설명: ${escapeHtml(help)}">?</button></span><b>${value.toFixed(1)} · +${number(contributions[key]).toFixed(1)}점</b></div><div class="rot-meter-track"><div class="rot-meter-fill" style="width:${value}%"></div></div><small>${escapeHtml(help)}</small></div>`;
    }).join('');
    const concentration=period.concentration||{};
    const change=period.scoreChange||{};
    const changeText=change.status==='ready'?`${number(change.value)>0?'+':''}${number(change.value).toFixed(1)}점 · ${escapeHtml(change.direction)}`:'비교 자료 축적 중';
    return `<h3>${escapeHtml(sector.name)}</h3>
      <div class="rot-detail-sub"><span class="rot-pill">${signalLabel(period.signal)}</span><span class="rot-pill">신뢰도 ${confidenceLabel(period.confidence,data.model&&data.model.highConfidenceUnlocked)}</span><span class="rot-pill">표본 ${number(period.validCount)}종목</span><span class="rot-pill">${changeText}</span></div>
      <div class="rot-detail-score"><div><span>${horizon}거래일 종합 점수</span><strong>${number(period.score).toFixed(1)}점</strong></div><div><span>업종 평균 등락</span><strong>${formatPercent(period.return&&period.return.adjusted)}</strong></div><div><span>상승 종목 비율</span><strong>${number(period.breadth&&period.breadth.adjustedUpRate).toFixed(1)}%</strong></div><div><span>시장 대비 강도</span><strong>${formatPercent(period.relativeStrength)}</strong></div></div>
      <div class="rot-score-note"><strong>점수는 확률이 아닙니다.</strong>${escapeHtml(explanation.meaning||'24개 업종 안에서 현재 상대 위치를 0~100으로 환산한 종합점수입니다.')}</div>
      <div class="rot-meter-list">${meters}</div>
      <div class="rot-warning">거래량 흐름은 실제 외국인·기관 순매수액이 아니라 거래량 변화로 추정한 참고 지표입니다. 상위 3종목 기여도는 ${number(concentration.top3).toFixed(1)}%입니다.</div>`;
  }
  function renderCandidates(sector){
    const stocks=(sector.candidateStocks||[]).slice(0,8);
    const excluded=number(sector.candidateExcludedCount);
    const cards=stocks.length?stocks.map(stock=>{
      const ma=stock.movingAverages||{};
      const taroLabel=stock.taroSource==='auto-analysis'?'실제 TARO':'기술조건';
      const baseline=stock.volumeBaseline||{};
      const baselineRange=formatPeriod(baseline);
      const volumeText=stock.volumeRatio!=null?`오늘 거래량 ${number(stock.volumeRatio).toFixed(2)}배`:'오늘 거래량 확인 중';
      const volumeBasis=baselineRange?`${escapeHtml(baseline.label||'직전 20거래일 일평균 대비')} · ${baselineRange}`:escapeHtml(baseline.label||'직전 20거래일 일평균 대비');
      return `<button type="button" class="rot-stock" data-stock-name="${escapeHtml(stock.name)}"><span><strong>${escapeHtml(stock.name)}</strong><small>${escapeHtml((stock.reasons||[]).join(' · '))}</small></span><b>${taroLabel} ${number(stock.taroScore).toFixed(0)}</b><em>${volumeText}</em><small class="rot-stock-volume">${volumeBasis}</small><small>60일선 ${number(ma['60']).toLocaleString('ko-KR')} · 120일선 ${number(ma['120']).toLocaleString('ko-KR')} · 200일선 ${number(ma['200']).toLocaleString('ko-KR')}</small></button>`;
    }).join(''):'<div class="rot-empty">후보 종목 자료를 축적하고 있습니다.</div>';
    return `<section class="rot-panel rot-analysis rot-candidates"><div class="rot-section-head"><div><span>SELECTED SECTOR</span><h3>${escapeHtml(sector.name)} 후보 종목</h3></div><p>종목 상세와 같은 실제 TARO 점수를 사용한 기술 관찰 목록이며 매수 추천이 아닙니다.${excluded?` 지표 누락 ${excluded}종목 제외.`:''}</p></div><div class="rot-stock-list">${cards}</div></section>`;
  }
  function renderScoreHistory(sector,horizon){
    const period=sectorPeriod(sector,horizon);
    const change=period.scoreChange||{};
    const ready=change.status==='ready';
    return `<section class="rot-panel rot-analysis"><div class="rot-section-head"><div><span>SCORE DIRECTION</span><h3>점수 변화와 방향</h3></div><p>${ready?escapeHtml(change.baseDate)+' 종가와 비교':'첫 확정 저장본 이후부터 변화가 표시됩니다.'}</p></div><div class="rot-history-value"><strong>${ready?(number(change.value)>0?'+':'')+number(change.value).toFixed(1)+'점':'축적 중'}</strong><span>${escapeHtml(change.direction||'축적 중')}</span></div><p class="rot-analysis-copy">현재 점수 ${number(period.score).toFixed(1)}점 · ${escapeHtml((period.modelAgreement||{}).label||'지표 혼재')} (${number((period.modelAgreement||{}).positive)}/${number((period.modelAgreement||{}).total)}개 긍정)</p></section>`;
  }
  function renderPerformance(data){
    const performance=data.horizonPerformance||{};
    const recommended=data.recommendedHorizon||{};
    const cards=[1,3,5,20].map(horizon=>{
      const row=performance[String(horizon)]||{};
      if(row.status!=='ready') return `<article class="rot-performance-card"><span>${horizon}일</span><strong>축적 중</strong><small>독립 기간 검증 자료를 모으고 있습니다.</small></article>`;
      const validationRange=formatPeriod(row);
      return `<article class="rot-performance-card${recommended.horizon===horizon?' recommended':''}"><span>${horizon}일${recommended.horizon===horizon?' · 추천 관찰 기간':''}</span><strong>적중 ${number(row.hitRate).toFixed(1)}%</strong><small>${validationRange?`검증기간 ${validationRange}<br>`:''}중첩 평가 ${number(row.sampleCount)}회 · 평균 초과 ${formatPercent(row.averageExcessReturn)}<br>안정성 ${number(row.stability).toFixed(1)} · 최근 재현 ${number(row.recentReproduction).toFixed(1)}%</small></article>`;
    }).join('');
    return `<section class="rot-panel rot-analysis rot-performance"><div class="rot-section-head"><div><span>WALK-FORWARD</span><h3>기간별 과거 성과</h3></div><p>${escapeHtml(recommended.reason||'표본과 안정성을 확인 중입니다.')}</p></div><div class="rot-performance-grid">${cards}</div><div class="rot-warning">과거 성과는 미래 확률이 아닙니다. 기준은 ${escapeHtml((performance['5']||{}).benchmark||'500종목 업종 중앙값')}이며 겹치는 기간 표본이 포함됩니다.</div></section>`;
  }
  function renderEvidence(data,selected){
    const edges=(data.leadLagEdges||[]).filter(edge=>edge.leader===selected||edge.lagger===selected).slice(0,3);
    const edgeMarkup=edges.length?edges.map(edge=>`<div class="rot-evidence-item"><strong>${escapeHtml(edge.leader)} → ${escapeHtml(edge.lagger)}</strong><span>${edge.lagDays}거래일 선행 · 상관 ${number(edge.correlation).toFixed(2)} · 인과관계가 아닌 탐색 정보</span></div>`).join(''):'<div class="rot-evidence-item"><strong>선행 흐름 축적 중</strong><span>안정적으로 반복된 관계만 표시하기 위해 자료를 더 모으고 있습니다.</span></div>';
    const cases=((data.similarMarkets||{}).cases||[]).slice(0,3);
    const caseMarkup=cases.length?cases.map(item=>`<div class="rot-evidence-item"><strong>${escapeHtml(item.date)} 유사 국면</strong><span>거리 ${number(item.distance).toFixed(2)} · 이후 ${escapeHtml(item.outcome&&item.outcome.leader)} 강세</span></div>`).join(''):'<div class="rot-evidence-item"><strong>유사 국면 축적 중</strong><span>최근 30일을 제외하고 결과가 확인된 과거 사례만 비교합니다.</span></div>';
    return `<div><h3>선행 흐름</h3><div class="rot-evidence-grid">${edgeMarkup}</div></div><div><h3>과거 유사 국면</h3><div class="rot-evidence-grid">${caseMarkup}</div></div>`;
  }
  function renderAccumulationNote(){
    return `<aside class="rot-accumulation-note" aria-label="축적 중 안내"><strong>‘축적 중’은 오류가 아닙니다.</strong><p>판단을 만들 때 없던 미래 결과를 섞지 않기 위해, 시간이 실제로 지난 뒤 확인된 자료만 차례로 저장합니다.</p><ul><li><b>점수 변화</b> — 장 마감 후 저장되는 업종별 점수를 직전 확정본과 비교합니다. 첫 저장 다음 날 자료가 생기면 보통 다음 거래일 마감 뒤부터 표시됩니다.</li><li><b>기간별 성과와 신뢰도</b> — 당시 1위 업종이 1·3·5·20거래일 뒤 시장보다 강했는지 모읍니다. 1거래일 성과는 다음 장 마감 뒤, 20거래일 성과는 약 4주 뒤 확정됩니다.</li><li><b>선행 흐름과 유사 국면</b> — 여러 날짜에서 반복된 관계와 결과가 확인된 과거 사례만 보여줍니다. 신호 발생 횟수와 휴장일에 따라 예상 기간은 길어질 수 있습니다.</li></ul></aside>`;
  }
  function renderTable(data,horizon){
    const rows=(data.sectors||[]).slice().sort((a,b)=>number(sectorPeriod(b,horizon).score)-number(sectorPeriod(a,horizon).score));
    return `<table class="rot-sr-table"><caption>${horizon}거래일 업종 순위</caption><thead><tr><th>순위</th><th>업종</th><th>점수</th><th>신호</th></tr></thead><tbody>${rows.map((sector,index)=>{const period=sectorPeriod(sector,horizon);return `<tr><td>${index+1}</td><td>${escapeHtml(sector.name)}</td><td>${number(period.score).toFixed(1)}</td><td>${signalLabel(period.signal)}</td></tr>`;}).join('')}</tbody></table>`;
  }
  function renderView(data,state){
    const sectors=data.sectors||[];
    if(!sectors.length) return '<div class="rot-panel rot-detail">순환매 자료를 준비하고 있습니다.</div>';
    const selected=sectors.find(sector=>sector.name===state.selected)||sectors[0];
    const leader=(data.summary&&data.summary.leaders&&data.summary.leaders[0])||{};
    const candidate=(data.summary&&data.summary.candidate)||{};
    const regime=data.marketRegime||{};
    const horizon=state.horizon;
    const recommended=data.recommendedHorizon||{};
    const summary=data.summary||{};
    const rawInterpretation=String(summary.interpretation||'500개 추적 종목의 현재 상대 흐름을 비교합니다.');
    const scoreIndex=rawInterpretation.indexOf('종합점수');
    const interpretation=scoreIndex>0?rawInterpretation.slice(0,scoreIndex).trim():rawInterpretation;
    const scoreMeaning=summary.scoreMeaning||(scoreIndex>0?rawInterpretation.slice(scoreIndex).trim():`종합점수 ${number(leader.score).toFixed(1)}점은 업종 간 상대 위치이며 확률이 아닙니다.`);
    const summaryHorizon=number(summary.horizon)||5;
    const summaryRange=formatPeriod(summary.period);
    const shortTerm=summary.shortTerm||{};
    const shortTermText=shortTerm.name?`단기 참고 · ${number(shortTerm.horizon)||5}거래일 1위 ${escapeHtml(shortTerm.name)}${formatPeriod(shortTerm.period)?` (${formatPeriod(shortTerm.period)})`:''}`:'';
    const recommendedPerformance=(data.horizonPerformance||{})[String(recommended.horizon)]||{};
    const validationRange=formatPeriod(recommendedPerformance);
    const recommendedCopy=recommended.horizon
      ?`신호 다음 거래일부터 ${durationLabel(recommended.horizon)} 관찰${validationRange?`.<br>검증기간 ${validationRange} · 중첩 평가 ${number(recommendedPerformance.sampleCount)}회`:''}`
      :escapeHtml(recommended.reason||'표본과 안정성을 확인 중입니다.');
    const regimeDays=number((regime.directionPeriod||{}).tradingDays)||20;
    const breadthDays=number((regime.breadthPeriod||{}).tradingDays)||5;
    const recommendedPrefix=recommended.horizon===summaryHorizon?'추천 ':'';
    return `<div class="rot-shell">
      <header class="rot-hero"><div><span class="rot-kicker">GAEO ROTATION</span><h2>업종의 돈 흐름을 한눈에</h2><p class="rot-hero-summary">${escapeHtml(interpretation)}</p><p class="rot-hero-score-note">${escapeHtml(scoreMeaning)}</p><p class="rot-hero-note">${escapeHtml(summary.disclaimer||'예측이 아니라 현재 어디로 힘이 모이는지 확인하는 참고 화면입니다.')}</p></div><div class="rot-asof"><strong>${escapeHtml(data.generatedAt)} 현재</strong>자료 기준 ${escapeHtml(data.dataCutoff)}<br>${number(data.universe&&data.universe.valid)}/${number(data.universe&&data.universe.configured)}종목 반영</div></header>
      <section class="rot-summary" aria-label="순환매 요약"><article class="rot-card rot-card-lead"><span>현재 관찰 · ${recommendedPrefix}${summaryHorizon}거래일 기준</span><strong>${escapeHtml(summary.headline||'뚜렷한 순환 신호 없음')}</strong><small>${summaryRange?`계산기간 ${summaryRange}`:'계산기간 확인 중'}${shortTermText?`<br>${shortTermText}`:''}</small></article><article class="rot-card"><span>현재 1위 업종 · ${recommendedPrefix}${summaryHorizon}거래일 기준</span><strong>${escapeHtml(leader.name||'확인 중')}</strong><small>${number(leader.score).toFixed(1)}점 · ${signalLabel(leader.signal)}${summaryRange?`<br>계산기간 ${summaryRange}`:''}</small></article><article class="rot-card"><span>다음 관찰 후보 · ${recommendedPrefix}${summaryHorizon}거래일 기준</span><strong>${escapeHtml(candidate.name||'뚜렷한 후보 없음')}</strong><small>${candidate.score!=null?number(candidate.score).toFixed(1)+'점':'조건 충족 업종 없음'}${summaryRange?`<br>계산기간 ${summaryRange}`:''}</small></article><article class="rot-card"><span>시장 국면 · 방향·변동성·주도시장 · 최근 ${regimeDays}거래일</span><strong>${escapeHtml(regime.direction||'확인 중')} · ${escapeHtml(regime.volatility||'확인 중')}</strong><small>${escapeHtml(regime.leadership||'시장')} 중심 · 최근 ${breadthDays}거래일 상승 종목 비율 ${number(regime.breadthRate).toFixed(1)}%${formatPeriod(regime.breadthPeriod)?`<br>${formatPeriod(regime.breadthPeriod)}`:''}</small></article><article class="rot-card"><span>추천 관찰 기간</span><strong>${recommended.horizon?recommended.horizon+'거래일':'축적 중'}</strong><small>${recommendedCopy}</small></article></section>
      <div class="rot-workspace"><div class="rot-primary"><section class="rot-panel rot-map-panel"><div class="rot-panel-head"><div><h3>업종 순환 지도</h3><p>가까울수록 종합 점수가 높습니다. 업종을 누르면 근거가 열립니다.</p></div><div><div class="rot-period-label">성과 관찰 기간</div><div class="rot-horizons" role="tablist" aria-label="성과 관찰 기간">${[1,3,5,20].map(value=>`<button class="rot-horizon${value===horizon?' on':''}" type="button" role="tab" aria-selected="${value===horizon}" data-horizon="${value}">${value}일</button>`).join('')}</div><div class="rot-period-label trend">장기 추세 참고</div><div class="rot-horizons rot-trend-horizons">${[60,120,200].map(value=>`<button class="rot-horizon${value===horizon?' on':''}" type="button" data-horizon="${value}">${value}일</button>`).join('')}</div></div></div>${renderMap(data,horizon,selected.name)}<div class="rot-map-legend"><span><i class="lead"></i>강한 흐름</span><span><i class="watch"></i>관찰</span><span><i class="weak"></i>약한 흐름</span></div>${renderTable(data,horizon)}</section>${renderCandidates(selected)}</div>
      <aside class="rot-side"><section class="rot-panel rot-rank-panel"><div class="rot-panel-head"><div><h3>${horizon}거래일 업종 순위</h3><p>점수는 8개 신호를 한꺼번에 반영합니다.</p></div></div><div class="rot-rank-list">${renderRank(data,horizon)}</div></section><section class="rot-panel rot-detail" aria-live="polite">${renderDetail(data,selected,horizon)}</section></aside></div>
      <div class="rot-analysis-grid">${renderScoreHistory(selected,horizon)}${renderPerformance(data)}<section class="rot-panel rot-evidence rot-analysis">${renderEvidence(data,selected.name)}</section></div>
      ${renderAccumulationNote()}<details class="rot-method"><summary>계산 방법과 주의사항 보기</summary><div class="rot-method-body"><div><strong>표본 보정</strong>작은 업종이 우연히 과장되지 않도록 전체 시장 쪽으로 보수적으로 보정합니다.</div><div><strong>미래 정보 차단</strong>각 날짜에서 당시 알 수 있던 자료만 사용하고 최근 30일은 유사 국면 비교에서 제외합니다.</div><div><strong>신뢰도 잠금</strong>과거 검증에서 높은 신뢰도가 중간 신뢰도를 실제로 앞설 때만 높은 단계가 열립니다.</div></div></details>
    </div>`;
  }
  function mount(element,data){
    if(!element||!data) return false;
    const recommended=number(data.recommendedHorizon&&data.recommendedHorizon.horizon);
    const defaultHorizon=[1,3,5,20].includes(recommended)?recommended:5;
    const state={horizon:defaultHorizon,selected:(data.sectors&&data.sectors[0]&&data.sectors[0].name)||''};
    const draw=()=>{ element.innerHTML=renderView(data,state); };
    element.onclick=event=>{
      const horizon=event.target.closest&&event.target.closest('[data-horizon]');
      if(horizon){state.horizon=number(horizon.dataset.horizon);draw();return;}
      const sector=event.target.closest&&event.target.closest('[data-sector]');
      if(sector){state.selected=sector.dataset.sector;draw();}
      const stock=event.target.closest&&event.target.closest('[data-stock-name]');
      if(stock&&typeof global.jumpToStock==='function'){global.jumpToStock(stock.dataset.stockName);}
    };
    element.onkeydown=event=>{
      const sector=event.target.closest&&event.target.closest('[data-sector]');
      if(sector&&(event.key==='Enter'||event.key===' ')){event.preventDefault();state.selected=sector.dataset.sector;draw();}
      if(event.key==='Escape'){state.selected=(data.sectors&&data.sectors[0]&&data.sectors[0].name)||'';draw();}
    };
    draw();
    return true;
  }

  global.GaeoRotation={mount,formatPercent,confidenceLabel,renderView};
})(window);
