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
  function orbitNodes(sectors,horizon){
    const ranked=sectors.slice().sort((a,b)=>number(sectorPeriod(b,horizon).score)-number(sectorPeriod(a,horizon).score)||a.name.localeCompare(b.name,'ko'));
    return ranked.map((sector,index)=>{
      const ring=Math.floor(index/8);
      const slot=index%8;
      const radius=[126,177,224][ring]||224;
      const offset=ring%2?Math.PI/8:0;
      const angle=-Math.PI/2+slot*(Math.PI*2/8)+offset;
      return {
        sector,index,x:360+Math.cos(angle)*radius,y:260+Math.sin(angle)*radius,
        period:sectorPeriod(sector,horizon)
      };
    });
  }
  function renderMap(data,horizon,selected){
    const nodes=orbitNodes(data.sectors||[],horizon);
    const nodeMarkup=nodes.map(item=>{
      const active=item.sector.name===selected?' on':'';
      const css=nodeClass(item.period);
      return `<g class="rot-node ${css}${active}" role="button" tabindex="0" data-sector="${escapeHtml(item.sector.name)}" transform="translate(${item.x.toFixed(1)} ${item.y.toFixed(1)})" aria-label="${escapeHtml(item.sector.name)} ${number(item.period.score).toFixed(1)}점">
        <circle r="30"></circle>
        <text y="-2">${escapeHtml(truncate(item.sector.name))}</text>
        <text class="rot-node-score" y="12">${number(item.period.score).toFixed(1)}점</text>
      </g>`;
    }).join('');
    const title=horizon===1?'단기 움직임':horizon===20?'한 달 흐름':`${horizon}일 흐름`;
    return `<div class="rot-map" aria-label="업종 순환 지도">
      <svg viewBox="0 0 720 520" role="img" aria-labelledby="rotMapTitle rotMapDesc">
        <title id="rotMapTitle">${title} 업종 순환 지도</title>
        <desc id="rotMapDesc">중앙에 가까울수록 현재 점수가 높은 업종입니다. 상세 순위는 지도 아래 표에서도 확인할 수 있습니다.</desc>
        <line class="rot-axis" x1="80" y1="260" x2="640" y2="260"></line><line class="rot-axis" x1="360" y1="36" x2="360" y2="484"></line>
        <circle class="rot-orbit" cx="360" cy="260" r="126"></circle><circle class="rot-orbit" cx="360" cy="260" r="177"></circle><circle class="rot-orbit" cx="360" cy="260" r="224"></circle>
        <circle class="rot-center" cx="360" cy="260" r="61"></circle>
        <text class="rot-center-title" x="360" y="254">${horizon}거래일</text><text class="rot-center-copy" x="360" y="271">가까울수록 강한 흐름</text>
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
    const meters=Object.keys(COMPONENT_LABELS).map(key=>{
      const value=Math.max(0,Math.min(100,number(components[key])));
      return `<div><div class="rot-meter-head"><span>${COMPONENT_LABELS[key]}</span><b>${value.toFixed(1)}</b></div><div class="rot-meter-track"><div class="rot-meter-fill" style="width:${value}%"></div></div></div>`;
    }).join('');
    const concentration=period.concentration||{};
    return `<h3>${escapeHtml(sector.name)}</h3>
      <div class="rot-detail-sub"><span class="rot-pill">${signalLabel(period.signal)}</span><span class="rot-pill">신뢰도 ${confidenceLabel(period.confidence,data.model&&data.model.highConfidenceUnlocked)}</span><span class="rot-pill">표본 ${number(period.validCount)}종목</span></div>
      <div class="rot-detail-score"><div><span>${horizon}거래일 종합 점수</span><strong>${number(period.score).toFixed(1)}점</strong></div><div><span>업종 평균 등락</span><strong>${formatPercent(period.return&&period.return.adjusted)}</strong></div><div><span>상승 종목 비율</span><strong>${number(period.breadth&&period.breadth.adjustedUpRate).toFixed(1)}%</strong></div><div><span>시장 대비 강도</span><strong>${formatPercent(period.relativeStrength)}</strong></div></div>
      <div class="rot-meter-list">${meters}</div>
      <div class="rot-warning">거래량 흐름은 실제 외국인·기관 순매수액이 아니라 거래량 변화로 추정한 참고 지표입니다. 상위 3종목 기여도는 ${number(concentration.top3).toFixed(1)}%입니다.</div>`;
  }
  function renderEvidence(data,selected){
    const edges=(data.leadLagEdges||[]).filter(edge=>edge.leader===selected||edge.lagger===selected).slice(0,3);
    const edgeMarkup=edges.length?edges.map(edge=>`<div class="rot-evidence-item"><strong>${escapeHtml(edge.leader)} → ${escapeHtml(edge.lagger)}</strong><span>${edge.lagDays}거래일 선행 · 상관 ${number(edge.correlation).toFixed(2)} · 인과관계가 아닌 탐색 정보</span></div>`).join(''):'<div class="rot-evidence-item"><strong>선행 흐름 축적 중</strong><span>안정적으로 반복된 관계만 표시하기 위해 자료를 더 모으고 있습니다.</span></div>';
    const cases=((data.similarMarkets||{}).cases||[]).slice(0,3);
    const caseMarkup=cases.length?cases.map(item=>`<div class="rot-evidence-item"><strong>${escapeHtml(item.date)} 유사 국면</strong><span>거리 ${number(item.distance).toFixed(2)} · 이후 ${escapeHtml(item.outcome&&item.outcome.leader)} 강세</span></div>`).join(''):'<div class="rot-evidence-item"><strong>유사 국면 축적 중</strong><span>최근 30일을 제외하고 결과가 확인된 과거 사례만 비교합니다.</span></div>';
    return `<div><h3>선행 흐름</h3><div class="rot-evidence-grid">${edgeMarkup}</div></div><div><h3>과거 유사 국면</h3><div class="rot-evidence-grid">${caseMarkup}</div></div>`;
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
    return `<div class="rot-shell">
      <header class="rot-hero"><div><span class="rot-kicker">GAEO ROTATION</span><h2>업종의 돈 흐름을 한눈에</h2><p>500개 추적 종목을 24개 업종으로 묶어 상승 탄력, 시장 대비 강도, 거래량, 상승 종목 비율을 함께 봅니다. 예측이 아니라 현재 어디로 힘이 모이는지 확인하는 참고 화면입니다.</p></div><div class="rot-asof"><strong>${escapeHtml(data.generatedAt)} 현재</strong>자료 기준 ${escapeHtml(data.dataCutoff)}<br>${number(data.universe&&data.universe.valid)}/${number(data.universe&&data.universe.configured)}종목 반영</div></header>
      <section class="rot-summary" aria-label="순환매 요약"><article class="rot-card rot-card-lead"><span>현재 관찰</span><strong>${escapeHtml((data.summary&&data.summary.headline)||'뚜렷한 순환 신호 없음')}</strong><small>여러 계산이 함께 강할 때만 주도 업종으로 표시합니다.</small></article><article class="rot-card"><span>현재 1위 업종</span><strong>${escapeHtml(leader.name||'확인 중')}</strong><small>${number(leader.score).toFixed(1)}점 · ${signalLabel(leader.signal)}</small></article><article class="rot-card"><span>다음 관찰 후보</span><strong>${escapeHtml(candidate.name||'뚜렷한 후보 없음')}</strong><small>${candidate.score!=null?number(candidate.score).toFixed(1)+'점':'조건 충족 업종 없음'}</small></article><article class="rot-card"><span>시장 국면</span><strong>${escapeHtml(regime.direction||'확인 중')} · ${escapeHtml(regime.volatility||'확인 중')}</strong><small>${escapeHtml(regime.leadership||'시장')} 중심 · 상승 폭 ${number(regime.breadthRate).toFixed(1)}%</small><span class="rot-confidence">높은 신뢰도 ${data.model&&data.model.highConfidenceUnlocked?'사용':'잠금'}</span></article></section>
      <div class="rot-workspace"><section class="rot-panel rot-map-panel"><div class="rot-panel-head"><div><h3>업종 순환 지도</h3><p>가까울수록 종합 점수가 높습니다. 업종을 누르면 근거가 열립니다.</p></div><div class="rot-horizons" role="tablist" aria-label="분석 기간">${[1,3,5,20].map(value=>`<button class="rot-horizon${value===horizon?' on':''}" type="button" role="tab" aria-selected="${value===horizon}" data-horizon="${value}">${value}일</button>`).join('')}</div></div>${renderMap(data,horizon,selected.name)}<div class="rot-map-legend"><span><i class="lead"></i>강한 흐름</span><span><i class="watch"></i>관찰</span><span><i class="weak"></i>약한 흐름</span></div>${renderTable(data,horizon)}</section>
      <aside class="rot-side"><section class="rot-panel rot-rank-panel"><div class="rot-panel-head"><div><h3>${horizon}거래일 업종 순위</h3><p>점수는 8개 신호를 한꺼번에 반영합니다.</p></div></div><div class="rot-rank-list">${renderRank(data,horizon)}</div></section><section class="rot-panel rot-detail" aria-live="polite">${renderDetail(data,selected,horizon)}</section><section class="rot-panel rot-evidence">${renderEvidence(data,selected.name)}</section></aside></div>
      <details class="rot-method"><summary>계산 방법과 주의사항 보기</summary><div class="rot-method-body"><div><strong>표본 보정</strong>작은 업종이 우연히 과장되지 않도록 전체 시장 쪽으로 보수적으로 보정합니다.</div><div><strong>미래 정보 차단</strong>각 날짜에서 당시 알 수 있던 자료만 사용하고 최근 30일은 유사 국면 비교에서 제외합니다.</div><div><strong>신뢰도 잠금</strong>과거 검증에서 높은 신뢰도가 중간 신뢰도를 실제로 앞설 때만 높은 단계가 열립니다.</div></div></details>
    </div>`;
  }
  function mount(element,data){
    if(!element||!data) return false;
    const state={horizon:5,selected:(data.sectors&&data.sectors[0]&&data.sectors[0].name)||''};
    const draw=()=>{ element.innerHTML=renderView(data,state); };
    element.onclick=event=>{
      const horizon=event.target.closest&&event.target.closest('[data-horizon]');
      if(horizon){state.horizon=number(horizon.dataset.horizon);draw();return;}
      const sector=event.target.closest&&event.target.closest('[data-sector]');
      if(sector){state.selected=sector.dataset.sector;draw();}
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
