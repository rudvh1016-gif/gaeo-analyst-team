(function(global){
  'use strict';

  const COMPONENT_LABELS={
    momentum:'상승 탄력',relativeStrength:'시장 대비 강도',flow:'거래량 흐름',breadth:'상승 종목 비율',
    taro:'기술 신호',leadLag:'선행 흐름',similarity:'과거 유사성',regimeMatch:'시장 국면 적합도'
  };
  const COMPONENT_COPY={
    momentum:{measure:'선택 기간 동안 업종 구성 종목의 가격 흐름이 얼마나 빠르고 넓게 강해졌는지 봅니다.',strong:'업종의 가격 탄력이 강한 편입니다.',weak:'가격 탄력은 아직 뚜렷하지 않습니다.'},
    relativeStrength:{measure:'선택 기간의 업종 수익률이 각 종목의 KOSPI·KOSDAQ 기준시장보다 얼마나 강했는지 봅니다.',strong:'시장 대비 상대강도가 높은 상태입니다.',weak:'기준시장보다 뚜렷하게 강하지는 않습니다.'},
    flow:{measure:'최근 거래량을 직전 20거래일 평균과 비교해 업종의 거래 참여가 늘었는지 봅니다.',strong:'가격 흐름과 함께 거래 참여도 늘고 있습니다.',weak:'거래 참여 확대는 아직 제한적입니다.'},
    breadth:{measure:'업종 구성 종목 중 선택 기간 수익률이 양수인 종목 비율을 표본 수에 맞게 보정합니다.',strong:'일부 종목이 아니라 업종 전반으로 흐름이 퍼지고 있습니다.',weak:'상승이 업종 전반으로 확산되지는 않았습니다.'},
    taro:{measure:'기존 TARO의 이동평균·MACD·거래량 기술 데이터를 업종 단위로 집계합니다.',strong:'TARO 기술 흐름이 개선된 종목이 많은 편입니다.',weak:'TARO 기술 확인은 아직 제한적입니다.'},
    leadLag:{measure:'과거에 다른 업종이 먼저 강해진 뒤 이 업종의 강도가 바뀐 반복 관계를 봅니다.',strong:'반복된 순환 연결이 비교적 뚜렷합니다.',weak:'뚜렷한 순환 연결 근거는 아직 부족합니다.'},
    similarity:{measure:'현재와 비슷했던 과거 시장 상태에서 이 업종이 기준시장보다 강했는지 봅니다.',strong:'비슷한 과거 시장의 재현 근거가 비교적 강합니다.',weak:'과거 유사 사례의 재현성은 아직 강하지 않습니다.'},
    regimeMatch:{measure:'현재 시장 방향·변동성과 업종 흐름이 서로 맞는 정도를 봅니다.',strong:'현재 시장 환경과 업종 흐름이 잘 맞습니다.',weak:'시장 환경이 이 업종에 특별히 유리하지는 않습니다.'}
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
  function strengthLabel(value){
    const score=number(value);
    if(score>=85) return '매우 강함';
    if(score>=65) return '강함';
    if(score>=45) return '보통';
    return '약함';
  }
  function componentInterpretation(key,value){
    const copy=COMPONENT_COPY[key]||{};
    return number(value)>=65?(copy.strong||'상대적으로 강한 편입니다.'):(copy.weak||'추가 확인이 필요합니다.');
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
  function todayView(sector){
    const period=sectorPeriod(sector,1);
    const available=Boolean(period&&Object.keys(period).length);
    const returnValue=number(period.return&&period.return.adjusted);
    const relativeStrength=number(period.relativeStrength);
    const breadth=number(period.breadth&&period.breadth.adjustedUpRate);
    const savedDirection=period.scoreChange&&period.scoreChange.status==='ready'?period.scoreChange.direction:'';
    let state=available?savedDirection:'확인 중';
    if(available&&!['강화','유지','둔화','약화'].includes(state)){
      if(period.signal==='주도'||(number(period.score)>=68&&relativeStrength>0&&breadth>=55)) state='강화';
      else if(returnValue<0&&relativeStrength<0&&breadth<50) state='약화';
      else if(returnValue<0||relativeStrength<0) state='둔화';
      else state='유지';
    }
    return {available,period,returnValue,relativeStrength,breadth,score:number(period.score),state};
  }
  const todayPercent=(view,key)=>view.available?formatPercent(view[key]):'확인 중';
  const todayBreadth=view=>view.available?`${view.breadth.toFixed(1)}%`:'확인 중';
  const todayScoreChange=view=>{
    const change=view.period&&view.period.scoreChange||{};
    if(!view.available||change.status!=='ready') return '확인 중';
    const value=number(change.value);
    return `${value>0?'+':''}${value.toFixed(1)}점`;
  };
  function freshnessView(data){
    const priceDate=String(data.dataCutoff||'').match(/\d{4}-\d{2}-\d{2}/);
    const scoreDate=data.summary&&data.summary.period&&data.summary.period.periodEnd;
    const price=priceDate&&priceDate[0]||'';
    return {priceDate:price,scoreDate:scoreDate||'',mismatch:Boolean(price&&scoreDate&&price!==scoreDate)};
  }
  function mapLayout(){
    const mobile=Boolean(global.matchMedia&&global.matchMedia('(max-width:600px)').matches);
    return mobile
      ?{mobile,cx:310,cy:310,slots:6,radii:[105,155,205,255],viewBox:'0 0 620 620',axis:[45,575],nodeRadius:34,centerRadius:62}
      :{mobile,cx:360,cy:330,slots:8,radii:[{rx:125,ry:145},{rx:190,ry:220},{rx:275,ry:290}],viewBox:'0 0 720 660',axisX:[40,680],axisY:[30,630],nodeRadius:30,centerRadius:61};
  }
  function orbitNodes(sectors,horizon,layout){
    const ranked=sectors.slice().sort((a,b)=>number(sectorPeriod(b,horizon).score)-number(sectorPeriod(a,horizon).score)||a.name.localeCompare(b.name,'ko'));
    return ranked.map((sector,index)=>{
      const ring=Math.floor(index/layout.slots);
      const slot=index%layout.slots;
      const radius=layout.radii[ring]||layout.radii[layout.radii.length-1];
      const radiusX=typeof radius==='number'?radius:radius.rx;
      const radiusY=typeof radius==='number'?radius:radius.ry;
      const offset=ring%2?Math.PI/layout.slots:0;
      const angle=-Math.PI/2+slot*(Math.PI*2/layout.slots)+offset;
      return {
        sector,index,x:layout.cx+Math.cos(angle)*radiusX,y:layout.cy+Math.sin(angle)*radiusY,
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
      return `<g class="rot-node ${css}${active}" role="button" tabindex="0" aria-pressed="${item.sector.name===selected}" data-sector="${escapeHtml(item.sector.name)}" transform="translate(${item.x.toFixed(1)} ${item.y.toFixed(1)})" aria-label="${escapeHtml(item.sector.name)} ${number(item.period.score).toFixed(1)}점">
        <rect class="rot-node-hit" x="-52" y="-52" width="104" height="104" fill="transparent" pointer-events="all"></rect>
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
        <line class="rot-axis" x1="${layout.mobile?layout.axis[0]:layout.axisX[0]}" y1="${layout.cy}" x2="${layout.mobile?layout.axis[1]:layout.axisX[1]}" y2="${layout.cy}"></line><line class="rot-axis" x1="${layout.cx}" y1="${layout.mobile?layout.axis[0]:layout.axisY[0]}" x2="${layout.cx}" y2="${layout.mobile?layout.axis[1]:layout.axisY[1]}"></line>
        ${layout.radii.map(radius=>layout.mobile?`<circle class="rot-orbit" cx="${layout.cx}" cy="${layout.cy}" r="${radius}"></circle>`:`<ellipse class="rot-orbit" cx="${layout.cx}" cy="${layout.cy}" rx="${radius.rx}" ry="${radius.ry}"></ellipse>`).join('')}
        <circle class="rot-center" cx="${layout.cx}" cy="${layout.cy}" r="${layout.centerRadius}"></circle>
        <text class="rot-center-title" x="${layout.cx}" y="${layout.cy-6}">${horizon}거래일</text><text class="rot-center-copy" x="${layout.cx}" y="${layout.cy+13}">가까울수록 강한 흐름</text>
        ${nodeMarkup}
      </svg>
    </div>`;
  }
  function renderRank(data,horizon,selected){
    return (data.sectors||[]).slice().sort((a,b)=>number(sectorPeriod(b,horizon).score)-number(sectorPeriod(a,horizon).score)).slice(0,8).map((sector,index)=>{
      const period=sectorPeriod(sector,horizon);
      const today=todayView(sector);
      return `<button class="rot-rank" type="button" aria-pressed="${sector.name===selected}" data-sector="${escapeHtml(sector.name)}"><span class="rot-rank-no">${String(index+1).padStart(2,'0')}</span><span class="rot-rank-name">${escapeHtml(sector.name)}<small>오늘 ${todayPercent(today,'returnValue')} · ${escapeHtml(today.state)}</small></span><span class="rot-rank-score">${number(period.score).toFixed(1)}<small>${horizon}일</small></span></button>`;
    }).join('');
  }
  function renderDetail(data,sector,horizon){
    const period=sectorPeriod(sector,horizon);
    const today=todayView(sector);
    const recommendedHorizon=number(data.recommendedHorizon&&data.recommendedHorizon.horizon);
    const periodLabel=recommendedHorizon===horizon?`권장 ${horizon}거래일`:`선택 ${horizon}거래일`;
    const rank=(data.sectors||[]).slice().sort((a,b)=>number(sectorPeriod(b,horizon).score)-number(sectorPeriod(a,horizon).score)).findIndex(item=>item.name===sector.name)+1;
    const components=period.components||{};
    const explanation=period.scoreExplanation||{};
    const contributions=explanation.contributions||{};
    const guide=Object.fromEntries((data.componentGuide||[]).map(item=>[item.key,item]));
    const factors=Object.keys(COMPONENT_LABELS).map(key=>{
      const value=Math.max(0,Math.min(100,number(components[key])));
      const help=(COMPONENT_COPY[key]&&COMPONENT_COPY[key].measure)||(guide[key]&&guide[key].description)||'';
      const label=COMPONENT_LABELS[key];
      return `<article class="rot-factor"><div class="rot-factor-head"><span>${label}</span><strong>${strengthLabel(value)}</strong></div><div class="rot-factor-value"><b>${value.toFixed(1)}</b><span>최종점수 기여 +${number(contributions[key]).toFixed(1)}</span></div><p>${escapeHtml(componentInterpretation(key,value))}</p><details><summary>계산 기준</summary><div>${escapeHtml(help)}</div></details><button type="button" class="rot-help" data-tip="${escapeHtml(help)}" aria-label="${label} 설명: ${escapeHtml(help)}">?</button></article>`;
    }).join('');
    const concentration=period.concentration||{};
    const change=period.scoreChange||{};
    const changeText=change.status==='ready'?`${number(change.value)>0?'+':''}${number(change.value).toFixed(1)}점 · ${escapeHtml(change.direction)}`:'비교 자료 축적 중';
    const ranked=Object.keys(contributions).sort((a,b)=>number(contributions[b])-number(contributions[a])).slice(0,4);
    const why=ranked.map(key=>`<li><strong>${COMPONENT_LABELS[key]}</strong><span>${escapeHtml(componentInterpretation(key,components[key]))}</span></li>`).join('');
    return `<div class="rot-detail-title"><div><span>SELECTED SECTOR</span><h3>${escapeHtml(sector.name)}</h3></div><strong>${number(period.score).toFixed(1)} <small>${horizon}거래일 종합 ${rank||'-'}위</small></strong></div><p class="rot-detail-todayline">오늘 ${todayPercent(today,'returnValue')} · ${escapeHtml(today.state)}</p>
      <div class="rot-detail-sub"><span class="rot-pill">${periodLabel}</span><span class="rot-pill">신호 품질 ${confidenceLabel(period.confidence,data.model&&data.model.highConfidenceUnlocked)}</span><span class="rot-pill">표본 ${number(period.validCount||sector.validCount)}종목</span><span class="rot-pill">${changeText}</span></div>
      <div class="rot-detail-score"><div><span>${horizon}거래일 종합 점수</span><strong>${number(period.score).toFixed(1)}점</strong></div><div><span>${horizon}일 업종 등락</span><strong>${formatPercent(period.return&&period.return.adjusted)}</strong></div><div><span>${horizon}일 상승 종목</span><strong>${number(period.breadth&&period.breadth.adjustedUpRate).toFixed(1)}%</strong></div><div><span>${horizon}일 시장 대비</span><strong>${formatPercent(period.relativeStrength)}</strong></div></div>
      <section class="rot-today" aria-label="오늘의 변화"><div><span>TODAY</span><h4>오늘의 변화</h4></div><dl><div><dt>오늘 업종 등락</dt><dd><strong>${todayPercent(today,'returnValue')}</strong></dd></div><div><dt>오늘 시장 대비</dt><dd><strong>${todayPercent(today,'relativeStrength')}</strong></dd></div><div><dt>오늘 상승 종목</dt><dd><strong>${todayBreadth(today)}</strong></dd></div><div><dt>오늘 점수 변화</dt><dd><strong>${todayScoreChange(today)}</strong></dd></div><div><dt>오늘 상태</dt><dd><strong>${escapeHtml(today.state)}</strong></dd></div></dl><p>${horizon}거래일 흐름은 ${number(period.score)>=65?'강하지만':'관찰이 필요하고'}, 오늘은 ${escapeHtml(today.state)} 상태입니다. 권장 기간의 누적 흐름과 하루 변화를 같은 뜻으로 해석하지 마세요.</p></section>
      <div class="rot-score-note"><span>점수는 확률이 아닙니다.</span><strong>${number(period.score).toFixed(1)}점은 ${escapeHtml(sector.name)}가 오를 확률 ${number(period.score).toFixed(1)}%라는 뜻이 아닙니다.</strong>현재 선택한 ${horizon}거래일 기준으로 가격 탄력, 시장 대비 강도, 거래량, 업종 확산, TARO 기술 신호와 검증 자료를 합쳐 24개 업종 안의 상대적 위치를 0~100으로 환산한 점수입니다.</div>
      <section class="rot-why"><h4>왜 이 업종을 보고 있나요?</h4><ol>${why}</ol></section>
      <details class="rot-score-breakdown"><summary>왜 ${number(period.score).toFixed(1)}점인가요?</summary><div class="rot-factor-grid">${factors}</div><div class="rot-score-total">8개 실제 기여 합계 <strong>${number(explanation.score||period.score).toFixed(1)}점</strong></div></details>
      <div class="rot-warning">거래량 흐름은 실제 외국인·기관 순매수액이 아니라 거래량 변화로 추정한 참고 지표입니다. 상위 3종목 기여도는 ${number(concentration.top3).toFixed(1)}%입니다.</div>`;
  }
  function renderCandidates(sector){
    const stocks=(sector.candidateStocks||[]).slice().sort((a,b)=>number(b.rotationRankScore)-number(a.rotationRankScore)||number(b.taroScore)-number(a.taroScore)).slice(0,5);
    const excluded=number(sector.candidateExcludedCount);
    const cards=stocks.length?stocks.map(stock=>{
      const ma=stock.movingAverages||{};
      const taroLabel=stock.taroSource==='auto-analysis'?'실제 TARO':'기술조건';
      const baseline=stock.volumeBaseline||{};
      const baselineRange=formatPeriod(baseline);
      const volumeText=stock.volumeRatio!=null?`오늘 거래량 ${number(stock.volumeRatio).toFixed(2)}배`:'오늘 거래량 확인 중';
      const volumeBasis=baselineRange?`${escapeHtml(baseline.label||'직전 20거래일 일평균 대비')} · ${baselineRange}`:escapeHtml(baseline.label||'직전 20거래일 일평균 대비');
      const maStatus=stock.maStatus||{};
      const rankText=stock.rotationRankScore!=null?`관찰순위 ${number(stock.rotationRankScore).toFixed(1)}`:'관찰순위 축적 중';
      return `<button type="button" class="rot-stock" data-stock-name="${escapeHtml(stock.name)}"><span><strong>${escapeHtml(stock.name)}</strong><small>${escapeHtml((stock.rotationRankReasons||stock.reasons||[]).join(' · '))}</small></span><b>${taroLabel} ${number(stock.taroScore).toFixed(0)}</b><em>${rankText}</em><small class="rot-stock-price">현재가 ${number(stock.price).toLocaleString('ko-KR')}원 · ${volumeText}</small><small class="rot-stock-volume">${volumeBasis}</small><small>${escapeHtml(maStatus['20']||'20일선 확인 중')} · ${escapeHtml(maStatus['60']||'60일선 확인 중')} · ${escapeHtml(maStatus['120']||'120일선 확인 중')} · ${escapeHtml(maStatus['200']||'200일선 확인 중')}</small></button>`;
    }).join(''):'<div class="rot-empty">후보 종목 자료를 축적하고 있습니다.</div>';
    return `<section class="rot-panel rot-analysis rot-candidates"><div class="rot-section-head"><div><span>TARO WATCHLIST</span><h3>이 업종에서 함께 볼 종목</h3></div><p>${number(sector.configuredCount)}종목 중 실제 TARO·거래량·업종 내 상대강도·과열을 함께 본 TOP5이며 매수 추천이 아닙니다.${excluded?` 지표 누락 ${excluded}종목 제외.`:''}</p></div><div class="rot-stock-list">${cards}</div></section>`;
  }
  function renderScoreHistory(data,sector,horizon){
    const period=sectorPeriod(sector,horizon);
    const currentComponents=period.components||{};
    const change=period.scoreChange||{};
    const ready=change.status==='ready';
    const currentDate=String(data.dataCutoff||'').slice(0,10);
    const deltas=change.componentDeltas||{};
    const ordered=Object.keys(deltas).sort((a,b)=>number(deltas[b])-number(deltas[a]));
    const positives=ordered.filter(key=>number(deltas[key])>0).slice(0,3);
    const negatives=ordered.filter(key=>number(deltas[key])<0).slice(-2).reverse();
    const reasonMarkup=change.componentStatus==='ready'&&ordered.length
      ?`<div class="rot-change-reasons"><h4>이번 점수 상승을 만든 주요 변화</h4>${positives.map((key,index)=>`<div><b>${index+1}</b><span><strong>${COMPONENT_LABELS[key]}</strong>${escapeHtml(componentInterpretation(key,sectorPeriod(sector,horizon).components&&sectorPeriod(sector,horizon).components[key]))}</span><em>${number(deltas[key])>0?'+':''}${number(deltas[key]).toFixed(1)}점</em></div>`).join('')||'<p>강해진 항목이 확인되지 않았습니다.</p>'}<h4>아직 약해진 부분</h4>${negatives.map(key=>`<p><strong>${COMPONENT_LABELS[key]} ${number(deltas[key]).toFixed(1)}점</strong> 직전 확정본보다 기여가 낮아졌습니다.</p>`).join('')||'<p>직전 확정본보다 뚜렷하게 약해진 구성요소는 없습니다.</p>'}</div>`
      :'<div class="rot-change-pending"><strong>변화 이유는 축적 중입니다.</strong>이전 확정본에 구성요소별 기여가 저장된 다음 거래일부터 실제 변화 이유를 표시합니다.</div>';
    const delta=number(change.value);
    const leadingNames=positives.map(key=>COMPONENT_LABELS[key]).join('·');
    const weakNames=Object.keys(currentComponents).filter(key=>number(currentComponents[key])<55).sort((a,b)=>number(currentComponents[a])-number(currentComponents[b])).slice(0,2).map(key=>COMPONENT_LABELS[key]).join('·');
    const conclusion=ready
      ?`<p class="rot-direction-conclusion"><strong>${escapeHtml(sector.name)} 종합점수는 전일 ${number(change.previousScore).toFixed(1)}점에서 ${number(change.currentScore).toFixed(1)}점으로 ${Math.abs(delta).toFixed(1)}점 ${delta>=0?'상승':'하락'}했습니다.</strong>${change.componentStatus==='ready'&&leadingNames?` 이번 변화는 ${leadingNames} ${delta>=0?'개선':'변화'}의 영향이 컸습니다.`:' 구성요소별 변화 이유는 다음 확정 비교자료부터 표시됩니다.'}${weakNames?` ${weakNames}은 아직 추가 확인이 필요합니다.`:''}</p>`
      :`<p class="rot-direction-conclusion"><strong>현재 종합점수는 ${number(period.score).toFixed(1)}점입니다.</strong> 직전 확정본이 쌓인 뒤부터 점수 방향과 실제 변화 이유를 함께 보여줍니다.</p>`;
    return `<section class="rot-panel rot-analysis rot-score-direction"><div class="rot-section-head"><div><span>SCORE DIRECTION</span><h3>점수 변화와 방향</h3></div><p>${ready?`${escapeHtml(change.baseDate)} 종가 → ${escapeHtml(currentDate)} 종가`:'첫 확정 저장본 이후부터 변화가 표시됩니다.'}</p></div><div class="rot-history-grid"><div><span>전일 종합점수</span><strong>${ready?number(change.previousScore).toFixed(1):'축적 중'}</strong></div><div><span>현재 종합점수</span><strong>${number(change.currentScore!=null?change.currentScore:period.score).toFixed(1)}</strong></div><div><span>변화</span><strong>${ready?(number(change.value)>0?'+':'')+number(change.value).toFixed(1)+'점':'축적 중'}</strong></div><div><span>상태</span><strong>${escapeHtml(change.direction||'축적 중')}</strong></div></div>${reasonMarkup}${conclusion}<p class="rot-analysis-copy">현재 점수 ${number(period.score).toFixed(1)}점 · ${escapeHtml((period.modelAgreement||{}).label||'지표 혼재')} (${number((period.modelAgreement||{}).positive)}/${number((period.modelAgreement||{}).total)}개 지표 긍정)</p></section>`;
  }
  function renderPerformance(data){
    const performance=data.horizonPerformance||{};
    const recommended=data.recommendedHorizon||{};
    const cards=[1,3,5,20].map(horizon=>{
      const row=performance[String(horizon)]||{};
      if(row.status!=='ready') return `<article class="rot-performance-card"><span>${horizon}일</span><strong>축적 중</strong><small>독립 기간 검증 자료를 모으고 있습니다.</small></article>`;
      const validationRange=formatPeriod(row);
      return `<article class="rot-performance-card${recommended.horizon===horizon?' recommended':''}"><span>${horizon}일${recommended.horizon===horizon?' · 권장 관찰 기간':''}</span><strong>적중 ${number(row.hitRate).toFixed(1)}%</strong><small>${validationRange?`검증기간 ${validationRange}<br>`:''}중첩 평가 ${number(row.sampleCount)}회 · 평균 초과 ${formatPercent(row.averageExcessReturn)}<br>안정성 ${number(row.stability).toFixed(1)} · 최근 재현 ${number(row.recentReproduction).toFixed(1)}%</small></article>`;
    }).join('');
    const overlapHorizon=number(recommended.horizon)||20;
    const overlapSample=number((performance[String(overlapHorizon)]||{}).sampleCount);
    const overlapExplanation=`매 거래일마다 당시까지의 최근 ${overlapHorizon}거래일로 1위 업종을 다시 선정한 뒤, 그다음 ${overlapHorizon}거래일 동안 시장 업종 중앙값보다 높은 수익을 냈는지 확인하는 방식입니다. 평가를 하루씩 이동해 반복하므로 서로 겹치는 관찰기간이 포함됩니다. ${overlapSample}회는 거래일 수나 서로 독립된 투자 횟수가 아니라, 이렇게 평가한 시작일 ${overlapSample}개의 결과입니다.`;
    return `<section class="rot-panel rot-analysis rot-performance"><div class="rot-section-head"><div><span>WALK-FORWARD</span><h3>기간별 과거 성과</h3></div><p>${escapeHtml(recommended.reason||'표본과 안정성을 확인 중입니다.')}</p></div><div class="rot-performance-grid">${cards}</div><div class="rot-overlap-explanation"><strong>중첩 평가란?</strong><span>${escapeHtml(overlapExplanation)}</span></div><div class="rot-metric-explanation" aria-label="과거 성과 지표 설명"><strong>지표 읽는 법</strong><dl><div><dt>적중률</dt><dd>전체 중첩 평가 중 당시 1위 업종이 이후 관찰기간에 500종목 업종 중앙값보다 높은 수익을 낸 비율입니다.</dd></div><div><dt>안정성</dt><dd>검증기간을 앞뒤 절반으로 나눈 두 적중률의 차이를 100에서 뺀 일관성 점수입니다. 안정성 80은 적중률 80%라는 뜻이 아니며, 앞뒤 적중률 차이가 20%p였다는 뜻입니다.</dd></div><div><dt>최근 재현</dt><dd>가장 최근 20개 평가 시작점만 따로 계산한 적중률입니다. 최근에도 같은 흐름이 반복됐는지 보여줍니다.</dd></div><div><dt>평균 초과</dt><dd>각 평가에서 1위 업종 수익률과 500종목 업종 중앙값 수익률의 차이를 구한 뒤 전체 평균한 값입니다. +1.2%는 평균적으로 1.2%p 앞섰다는 뜻입니다.</dd></div></dl></div><div class="rot-warning">과거 성과는 미래 확률이 아닙니다. 기준은 ${escapeHtml((performance['5']||{}).benchmark||'500종목 업종 중앙값')}이며 겹치는 기간 표본이 포함됩니다.</div></section>`;
  }
  function renderEvidence(data,selected,horizon){
    const edges=(data.leadLagEdges||[]).filter(edge=>edge.leader===selected||edge.lagger===selected).slice(0,3);
    const edgeMarkup=edges.length?edges.map(edge=>`<div class="rot-path-row"><strong>${escapeHtml(edge.leader)} → ${escapeHtml(edge.lagger)}</strong><span>평균 시차 ${number(edge.lagDays).toFixed(1)}거래일 · 상관 ${number(edge.correlation).toFixed(2)}</span></div>`).join(''):'<div class="rot-empty"><strong>뚜렷한 순환 연결이 아직 없습니다.</strong>가격·상대강도·거래량에서 안정적으로 반복된 관계만 표시하기 위해 자료를 더 모으고 있습니다.</div>';
    const similar=((data.similarMarkets||{}).bySector||{})[selected]||{};
    const similarReady=similar.status==='ready'&&number(similar.sampleCount)>0;
    const similarMarkup=similarReady?`<div class="rot-similar-summary"><div><span>분석기간</span><strong>${formatDate(similar.periodStart)}~${formatDate(similar.periodEnd)}</strong></div><div><span>총 분석 거래일</span><strong>${number(similar.tradingDays)}일</strong></div><div><span>유사 사례</span><strong>${number(similar.sampleCount)}회</strong></div><div><span>비교 기간</span><strong>${number(similar.horizon||horizon)}거래일</strong></div><div><span>성공</span><strong>성공 ${number(similar.successCount)}회</strong></div><div><span>실패</span><strong>실패 ${number(similar.failureCount)}회</strong></div><div><span>재현률</span><strong>${number(similar.reproductionRate).toFixed(1)}%</strong></div><div><span>평균 초과</span><strong>${formatPercent(similar.averageExcessReturn)}</strong></div><div><span>중앙 초과</span><strong>${formatPercent(similar.medianExcessReturn)}</strong></div><div><span>현재 유사도</span><strong>${number(similar.currentSimilarity).toFixed(1)}%</strong></div><div><span>표본 신뢰도</span><strong>${escapeHtml(similar.sampleReliability)}</strong></div></div><p>최근 비슷한 시장 ${number(similar.sampleCount)}회 중 ${number(similar.successCount)}회에서 향후 ${number(similar.horizon||horizon)}거래일 동안 ${escapeHtml(selected)}가 기준시장을 상회했습니다. 평균 초과수익률은 ${formatPercent(similar.averageExcessReturn)}이며, 표본 신뢰도와 함께 보조 근거로 보는 것이 적절합니다.</p><details><summary>성공 기준과 사례 전체 보기</summary><div><strong>Benchmark</strong> ${escapeHtml(similar.benchmark||'500종목 업종 중앙값')}<br><strong>성공 기준</strong> ${escapeHtml(similar.successDefinition||'향후 업종수익률이 기준시장을 상회')}</div>${(similar.cases||[]).map(item=>`<div class="rot-case"><span>${escapeHtml(item.date)}</span><span>유사도 ${number(item.similarity).toFixed(1)}%</span><span>${formatPercent(item.excessReturn)}</span><b>${item.success?'성공':'실패'}</b></div>`).join('')}</details>`:'<div class="rot-empty"><strong>과거 유사 사례는 표본 부족입니다.</strong>권장 관찰기간과 같은 기준으로 결과가 확인된 사례만 차례로 축적합니다.</div>';
    return `<div class="rot-evidence-section"><span>ROTATION PATH</span><h3>어디에서 흐름이 이어지고 있나요?</h3><p>과거에 어떤 업종이 먼저 강해진 뒤 현재 선택한 업종으로 강도가 이어졌는지 봅니다. 실제 자금 이동을 단정하지 않는 탐색 정보입니다.</p>${edgeMarkup}</div><div class="rot-evidence-section"><span>SIMILAR HISTORY</span><h3>비슷한 시장에서는 어땠나요?</h3>${similarMarkup}</div>`;
  }

  function renderHowToView(data,sector,horizon){
    const period=sectorPeriod(sector,horizon);
    const similarity=number(period.components&&period.components.similarity);
    const focus=similarity<55?'다만 과거 유사성은 아직 강하지 않아 ':'';
    return `<section class="rot-panel rot-analysis rot-how"><div class="rot-section-head"><div><span>HOW TO READ</span><h3>어떻게 볼까요?</h3></div></div><p>현재 ${escapeHtml(sector.name)}는 <strong>${horizon}거래일 기준 ${signalLabel(period.signal)}</strong>입니다. ${focus}업종 전체를 단순 추격하기보다 <strong>거래량과 중기 추세가 함께 확인되는 종목을 계속 관찰하는 방식</strong>이 적절합니다.</p></section>`;
  }

  function renderCurrentView(data,sector,horizon){
    const period=sectorPeriod(sector,horizon),change=period.scoreChange||{},components=period.components||{};
    const today=todayView(sector);
    const recommendedHorizon=number(data.recommendedHorizon&&data.recommendedHorizon.horizon)||horizon;
    const stocks=(sector.candidateStocks||[]).slice(0,5);
    const positives=Object.keys(components).filter(key=>number(components[key])>=65).sort((a,b)=>number(components[b])-number(components[a])).slice(0,4);
    const checks=Object.keys(components).filter(key=>number(components[key])<55).sort((a,b)=>number(components[a])-number(components[b])).slice(0,3);
    const heat=stocks.length&&stocks.filter(stock=>stock.overheat).length/stocks.length>=.5?'높음':'낮음';
    const taroConfirmed=number(sector.taroConfirmationCount);
    const taroAnalyzed=number(sector.taroAnalyzedCount);
    const interestCount=Math.min(5,(sector.candidateStocks||[]).length);
    const regime=data.regime||{};
    const pathCount=(data.leadLagEdges||[]).filter(edge=>edge.leader===sector.name||edge.lagger===sector.name).length;
    const similar=(((data.similarMarkets||{}).bySector)||{})[sector.name]||{};
    const similarText=similar.status==='ready'?`유사사례 ${number(similar.successCount)}/${number(similar.sampleCount)} 성공`:'유사사례 축적 중';
    const pathText=pathCount?`선행 연결 ${pathCount}개 확인`:'뚜렷한 선행 연결 없음';
    const finalLine=`${horizon}거래일 누적 흐름은 ${period.signal==='주도'?'강하게 유지되고 있습니다':'추가 확인이 필요합니다'}. 오늘은 ${today.state}(${todayPercent(today,'returnValue')})이므로 두 시간축을 함께 보세요.`;
    return `<section class="rot-panel rot-analysis rot-current-view"><div class="rot-section-head"><div><span>CURRENT VIEW</span><h3>현재 기준 종합의견</h3></div></div><div class="rot-view-summary"><div><span>현재 상태</span><strong>${signalLabel(period.signal)}</strong></div><div><span>선택 기간</span><strong>${horizon}거래일</strong></div><div><span>권장 기간</span><strong>${recommendedHorizon}거래일</strong></div><div><span>신호 품질</span><strong>${confidenceLabel(period.confidence,data.model&&data.model.highConfidenceUnlocked)}</strong></div><div><span>모델 합의</span><strong>${escapeHtml((period.modelAgreement||{}).label||'확인 중')}</strong></div><div><span>표본 신뢰</span><strong>${escapeHtml(sector.sampleReliability||'확인 중')}</strong></div><div><span>과열 위험</span><strong>${heat}</strong></div><div><span>TARO 확인</span><strong>${taroConfirmed} / ${taroAnalyzed||'확인 중'}</strong></div><div><span>시장 국면</span><strong>${escapeHtml(regime.direction||'확인 중')} · ${escapeHtml(regime.volatility||'확인 중')}</strong></div><div><span>관심 종목</span><strong>${interestCount}개</strong></div></div><p><strong>${escapeHtml(sector.name)}는 현재 ${horizon}거래일 기준으로 상대적인 힘이 많이 모여 있는 업종입니다.</strong> 종합점수는 ${number(period.score).toFixed(1)}점이며${change.status==='ready'?`, 전일보다 ${(number(change.value)>0?'+':'')+number(change.value).toFixed(1)}점 변했습니다`:''}. ${escapeHtml(pathText)}이며 ${escapeHtml(similarText)}입니다. 현재 시장은 ${escapeHtml(regime.direction||'방향 확인 중')}·${escapeHtml(regime.volatility||'변동성 확인 중')} 국면입니다. 상대강도·거래량·업종 확산과 TARO 기술 신호를 함께 확인하되, 과거 재현성과 시장 국면은 보조 근거로 봐야 합니다.</p><div class="rot-view-factors"><div><h4>긍정 요인</h4><ul>${positives.map(key=>`<li>${COMPONENT_LABELS[key]} ${strengthLabel(components[key])}</li>`).join('')||'<li>뚜렷한 긍정 요인 확인 중</li>'}</ul></div><div><h4>확인할 점</h4><ul>${checks.map(key=>`<li>${COMPONENT_LABELS[key]} ${strengthLabel(components[key])}</li>`).join('')||'<li>점수 둔화 여부</li>'}</ul></div></div><strong class="rot-last-line">${finalLine}</strong></section>`;
  }
  function renderAccumulationNote(){
    return `<aside class="rot-accumulation-note" aria-label="축적 중 안내"><strong>‘축적 중’은 오류가 아닙니다.</strong><p>판단을 만들 때 없던 미래 결과를 섞지 않기 위해, 시간이 실제로 지난 뒤 확인된 자료만 차례로 저장합니다.</p><ul><li><b>점수 변화</b> — 장 마감 후 저장되는 업종별 점수를 직전 확정본과 비교합니다. 첫 저장 다음 날 자료가 생기면 보통 다음 거래일 마감 뒤부터 표시됩니다.</li><li><b>기간별 성과와 신뢰도</b> — 당시 1위 업종이 1·3·5·20거래일 뒤 시장보다 강했는지 모읍니다. 1거래일 성과는 다음 장 마감 뒤, 20거래일 성과는 약 4주 뒤 확정됩니다.</li><li><b>선행 흐름과 유사 국면</b> — 여러 날짜에서 반복된 관계와 결과가 확인된 과거 사례만 보여줍니다. 신호 발생 횟수와 휴장일에 따라 예상 기간은 길어질 수 있습니다.</li></ul></aside>`;
  }
  function renderTable(data,horizon){
    const rows=(data.sectors||[]).slice().sort((a,b)=>number(sectorPeriod(b,horizon).score)-number(sectorPeriod(a,horizon).score));
    return `<table class="rot-sr-table"><caption>${horizon}거래일 업종 순위</caption><thead><tr><th scope="col">순위</th><th scope="col">업종</th><th scope="col">점수</th><th scope="col">신호</th></tr></thead><tbody>${rows.map((sector,index)=>{const period=sectorPeriod(sector,horizon);return `<tr><td>${index+1}</td><th scope="row">${escapeHtml(sector.name)}</th><td>${number(period.score).toFixed(1)}</td><td>${signalLabel(period.signal)}</td></tr>`;}).join('')}</tbody></table>`;
  }
  /* 🔽 접이식 심화 섹션 (2026-08-20)
     대표 지적: "박스가 너무 많고 한눈에 정보가 너무 많아 보기 불편하다."
     매일 보는 정보(지도·순위·업종 상세·함께 볼 종목)는 그대로 펼쳐 두고,
     "왜·어떻게·과거" 성격의 설명만 눌러야 열리게 한다.
     ⚠️ 내용을 지우거나 줄이지 않는다. 접을 뿐이다.
     ⚠️ 기간·업종을 바꾸면 화면을 통째로 다시 그리므로, 열어 둔 것이 닫히지 않게
        state.open에 기록해 둔다(모의투자 화면의 PV_OPEN과 같은 방식). */
  /* 🐛 2026-08-21 검수에서 잡힘: 이 Set을 mount() 안에서 만들면, 순환매 버튼을 다시
     누르거나 홈의 "전체시장 흐름 보기"로 들어올 때마다 mount()가 다시 불려서
     사용자가 열어 둔 것이 전부 닫혔다(index.html의 setMode('rotation') → mount).
     모의투자 화면의 PV_OPEN처럼 모듈 스코프에 두어야 다시 마운트해도 살아남는다. */
  const OPEN_FOLDS = new Set();
  function fold(key,label,body,open){
    return `<details class="rot-fold" data-fold="${escapeHtml(key)}"${open?' open':''}>`
      + `<summary class="rot-fold-sum">${escapeHtml(label)}</summary>`
      + `<div class="rot-fold-body">${body}</div></details>`;
  }
  function renderView(data,state){
    const sectors=data.sectors||[];
    // state.open이 없는 옛 호출(테스트 등)에서도 깨지지 않게 한다 — 그때는 전부 접힘.
    // instanceof를 쓰지 않는다: 다른 실행 컨텍스트(vm·iframe)의 Set은 instanceof가 거짓이 된다.
    const open=(state&&state.open&&typeof state.open.has==='function')?state.open:OPEN_FOLDS;
    if(!sectors.length) return '<div class="rot-panel rot-detail">순환매 자료를 준비하고 있습니다.</div>';
    const selected=sectors.find(sector=>sector.name===state.selected)||sectors[0];
    const leader=(data.summary&&data.summary.leaders&&data.summary.leaders[0])||{};
    const leaderSector=sectors.find(sector=>sector.name===leader.name)||sectors[0];
    const leaderToday=todayView(leaderSector);
    const candidate=(data.summary&&data.summary.candidate)||{};
    const regime=data.marketRegime||{};
    const horizon=state.horizon;
    const recommended=data.recommendedHorizon||{};
    const summary=data.summary||{};
    const rawInterpretation=String(summary.interpretation||'500개 추적 종목의 현재 상대 흐름을 비교합니다.');
    const scoreIndex=rawInterpretation.indexOf('종합점수');
    const interpretation=scoreIndex>0?rawInterpretation.slice(0,scoreIndex).trim():rawInterpretation;
    const scoreMeaning=summary.scoreMeaning||(scoreIndex>0?rawInterpretation.slice(scoreIndex).trim():`종합점수 ${number(leader.score).toFixed(1)}점은 업종 간 상대 위치이며 확률이 아닙니다.`);
    const summaryHorizon=number(recommended.horizon)||number(summary.horizon)||5;
    const summaryRange=formatPeriod(summary.period);
    const candidateObservation=summary.candidateObservationPeriod||{};
    const candidateObservationRange=formatPeriod(candidateObservation);
    const shortTerm=summary.shortTerm||{};
    const recommendedPerformance=(data.horizonPerformance||{})[String(recommended.horizon)]||{};
    const validationRange=formatPeriod(recommendedPerformance);
    const regimeDays=number((regime.directionPeriod||{}).tradingDays)||20;
    const breadthDays=number((regime.breadthPeriod||{}).tradingDays)||5;
    const recommendedPrefix=recommended.horizon===summaryHorizon?'권장 ':'';
    const freshness=freshnessView(data);
    const freshnessCopy=freshness.mismatch
      ?`점수 ${formatDate(freshness.scoreDate)} 기준 · 가격 ${formatDate(freshness.priceDate)} 반영`
      :`${formatDate(freshness.priceDate||freshness.scoreDate)} 가격·점수 기준`;
    const metaBlock=(label,value,note='')=>`<div class="rot-meta-block"><dt>${escapeHtml(label)}</dt><dd>${value}${note?`<small>${note}</small>`:''}</dd></div>`;
    const meta=(items,extra='')=>`<dl class="rot-meta${extra?` ${extra}`:''}">${items.filter(Boolean).join('')}</dl>`;
    const calculationMeta=metaBlock('계산기간',summaryRange||'확인 중');
    const shortTermMeta=shortTerm.name
      ?metaBlock('단기 참고',`${number(shortTerm.horizon)||5}거래일 1위 · ${escapeHtml(shortTerm.name)}`,formatPeriod(shortTerm.period))
      :'';
    const observationMeta=candidateObservationRange
      ?metaBlock('예상 관찰기간',candidateObservationRange,`${number(candidateObservation.tradingDays)}거래일 · 휴장일 제외`)
      :metaBlock('예상 관찰기간','확인 중');
    const regimeRange=formatPeriod(regime.breadthPeriod)||formatPeriod(regime.directionPeriod);
    const recommendedObservation=recommended.horizon
      ?`신호 다음 거래일부터 ${durationLabel(recommended.horizon)} 관찰`
      :escapeHtml(recommended.reason||'표본과 안정성을 확인 중입니다.');
    return `<div class="rot-shell">
      <header class="rot-hero"><div><span class="rot-kicker">GAEO ROTATION</span><h2>업종의 순환 흐름을 한눈에</h2><p class="rot-hero-summary">${escapeHtml(interpretation)}</p><p class="rot-hero-score-note">${escapeHtml(scoreMeaning)}</p><p class="rot-hero-note">${escapeHtml(summary.disclaimer||'예측이 아니라 현재 어디로 힘이 모이는지 확인하는 참고 화면입니다.')}</p></div><div class="rot-asof"><strong>${escapeHtml(data.generatedAt)} 생성</strong>${escapeHtml(freshnessCopy)}<br>${number(data.universe&&data.universe.valid)}/${number(data.universe&&data.universe.configured)}종목 반영</div></header>
      <section class="rot-summary" aria-label="순환매 요약">
        <article class="rot-card rot-card-lead"><span class="rot-card-context">현재 관찰 · ${recommendedPrefix}${summaryHorizon}거래일 기준</span><strong class="rot-card-primary">${leader.name?`${escapeHtml(leader.name)} 순환 신호`:escapeHtml(summary.headline||'뚜렷한 순환 신호 없음')}</strong>${meta([calculationMeta,shortTermMeta])}</article>
        <article class="rot-card"><span class="rot-card-context">현재 1위 업종 · ${recommendedPrefix}${summaryHorizon}거래일 기준</span><strong class="rot-card-primary">${escapeHtml(leader.name||'확인 중')}</strong><p class="rot-card-secondary"><b>${number(leader.score).toFixed(1)}점</b> · ${signalLabel(leader.signal)}</p>${meta([calculationMeta])}</article>
        <article class="rot-card rot-card-today"><span class="rot-card-context">오늘의 변화 · 1거래일</span><strong class="rot-card-primary rot-card-subject">${escapeHtml(leader.name||'현재 1위 업종')}</strong><p class="rot-card-secondary rot-card-today-value">${todayPercent(leaderToday,'returnValue')} · ${escapeHtml(leaderToday.state)}</p><span class="rot-card-measure">구성 종목 중앙값 등락 · 표본 보정</span>${meta([metaBlock('시장 대비',todayPercent(leaderToday,'relativeStrength')),metaBlock('상승 종목',todayBreadth(leaderToday))],'rot-meta-inline')}</article>
        <article class="rot-card"><span class="rot-card-context">다음 관찰 후보 · ${recommendedPrefix}${summaryHorizon}거래일 기준</span><strong class="rot-card-primary">${escapeHtml(candidate.name||'뚜렷한 후보 없음')}</strong><p class="rot-card-secondary"><b>${candidate.score!=null?number(candidate.score).toFixed(1)+'점':'조건 충족 업종 없음'}</b>${candidate.score!=null?' · 다음 후보':''}</p>${meta([calculationMeta,observationMeta])}</article>
        <article class="rot-card"><span class="rot-card-context">시장 국면 · 최근 ${regimeDays}거래일</span><strong class="rot-card-primary">${escapeHtml(regime.direction||'확인 중')} · ${escapeHtml(regime.volatility||'확인 중')}</strong><p class="rot-card-secondary">${escapeHtml(regime.leadership||'시장')} 중심</p>${meta([metaBlock(`최근 ${breadthDays}거래일 상승 종목 비율`,`${number(regime.breadthRate).toFixed(1)}%`),metaBlock('계산기간',regimeRange||'확인 중')])}</article>
        <article class="rot-card"><span class="rot-card-context">권장 관찰 기간</span><strong class="rot-card-primary">${recommended.horizon?recommended.horizon+'거래일':'축적 중'}</strong><p class="rot-card-secondary">${recommendedObservation}</p>${meta([metaBlock('검증기간',validationRange||'확인 중'),metaBlock('종합 평가',recommendedPerformance.sampleCount!=null?`${number(recommendedPerformance.sampleCount)}회`:'축적 중')])}</article>
      </section>
      <div class="rot-workspace"><div class="rot-primary"><section class="rot-panel rot-map-panel"><div class="rot-panel-head"><div><h3>업종 순환 지도</h3><p>가까울수록 종합 점수가 높습니다. 업종을 누르면 근거가 열립니다.</p></div><div><div class="rot-period-label">성과 관찰 기간</div><div class="rot-horizons" role="tablist" aria-label="성과 관찰 기간">${[1,3,5,20].map(value=>`<button class="rot-horizon${value===horizon?' on':''}" type="button" role="tab" tabindex="${value===horizon?'0':'-1'}" aria-selected="${value===horizon}" data-horizon="${value}">${value}일${value===number(recommended.horizon)?'<small>권장</small>':''}</button>`).join('')}</div><div class="rot-period-label trend">장기 추세 참고</div><div class="rot-horizons rot-trend-horizons">${[60,120,200].map(value=>`<button class="rot-horizon${value===horizon?' on':''}" type="button" data-horizon="${value}">${value}일</button>`).join('')}</div></div></div>${renderMap(data,horizon,selected.name)}<div class="rot-map-legend"><span><i class="lead"></i>강한 흐름</span><span><i class="watch"></i>관찰</span><span><i class="weak"></i>약한 흐름</span></div>${renderTable(data,horizon)}</section></div>
      <aside class="rot-side"><section class="rot-panel rot-rank-panel"><div class="rot-panel-head"><div><h3>${horizon}거래일 업종 순위</h3><p>점수는 8개 신호를 한꺼번에 반영합니다.</p></div></div><div class="rot-rank-list">${renderRank(data,horizon,selected.name)}</div></section><section class="rot-panel rot-detail" aria-live="polite">${renderDetail(data,selected,horizon)}</section></aside></div>
      <div class="rot-analysis-grid">${renderCandidates(selected)}${fold('score','점수가 왜 바뀌었나요?',renderScoreHistory(data,selected,horizon),open.has('score'))}${fold('evidence','이 흐름은 어디에서 왔나요?',`<section class="rot-panel rot-evidence rot-analysis">${renderEvidence(data,selected.name,horizon)}</section>`,open.has('evidence'))}${fold('how','어떻게 봐야 하나요?',renderHowToView(data,selected,horizon),open.has('how'))}${fold('current','지금 종합하면 어떤가요?',renderCurrentView(data,selected,horizon),open.has('current'))}${fold('performance','과거에는 얼마나 맞았나요?',renderPerformance(data),open.has('performance'))}</div>
      ${fold('note','‘축적 중’은 무슨 뜻인가요?',renderAccumulationNote(),open.has('note'))}<details class="rot-method"><summary>계산 방법과 주의사항 보기</summary><div class="rot-method-body"><div><strong>표본 보정</strong>작은 업종이 우연히 과장되지 않도록 전체 시장 쪽으로 보수적으로 보정합니다.</div><div><strong>미래 정보 차단</strong>각 날짜에서 당시 알 수 있던 자료만 사용하고 최근 30일은 유사 국면 비교에서 제외합니다.</div><div><strong>신뢰도 잠금</strong>과거 검증에서 높은 신뢰도가 중간 신뢰도를 실제로 앞설 때만 높은 단계가 열립니다.</div></div></details>
    </div>`;
  }
  function mount(element,data){
    if(!element||!data) return false;
    const recommended=number(data.recommendedHorizon&&data.recommendedHorizon.horizon);
    const defaultHorizon=[1,3,5,20].includes(recommended)?recommended:5;
    // open은 모듈 스코프 Set을 공유한다 — 다시 마운트해도 펼쳐 둔 것이 유지된다.
    const state={horizon:defaultHorizon,selected:(data.sectors&&data.sectors[0]&&data.sectors[0].name)||'',
      open:OPEN_FOLDS};
    const draw=focusSelector=>{
      element.innerHTML=renderView(data,state);
      if(focusSelector){ const target=element.querySelector(focusSelector); if(target) target.focus({preventScroll:true}); }
    };
    element.onclick=event=>{
      // 🔽 접이식 섹션 — 브라우저가 스스로 여닫으므로 여기서는 상태만 기록한다.
      //    다시 그리면(draw) 방금 연 것이 도로 닫히므로 draw를 부르지 않는다.
      const foldSum=event.target.closest&&event.target.closest('.rot-fold > summary');
      if(foldSum){
        const key=foldSum.parentElement.dataset.fold;
        if(state.open.has(key)) state.open.delete(key); else state.open.add(key);
        return;
      }
      const horizon=event.target.closest&&event.target.closest('[data-horizon]');
      if(horizon){state.horizon=number(horizon.dataset.horizon);draw(`[data-horizon="${state.horizon}"]`);return;}
      const sector=event.target.closest&&event.target.closest('[data-sector]');
      if(sector){
        state.selected=sector.dataset.sector;
        const kind=sector.classList.contains('rot-rank')?'.rot-rank':sector.classList.contains('rot-node')?'.rot-node':'';
        draw(`${kind}[data-sector="${CSS.escape(state.selected)}"]`);
      }
      const stock=event.target.closest&&event.target.closest('[data-stock-name]');
      if(stock&&typeof global.jumpToStock==='function'){global.jumpToStock(stock.dataset.stockName);}
    };
    element.onkeydown=event=>{
      const sector=event.target.closest&&event.target.closest('[data-sector]');
      if(sector&&(event.key==='Enter'||event.key===' ')){
        event.preventDefault();state.selected=sector.dataset.sector;
        const kind=sector.classList.contains('rot-rank')?'.rot-rank':sector.classList.contains('rot-node')?'.rot-node':'';
        draw(`${kind}[data-sector="${CSS.escape(state.selected)}"]`);
      }
      const horizonTab=event.target.closest&&event.target.closest('[role="tab"][data-horizon]');
      if(horizonTab&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
        const tabs=[...element.querySelectorAll('[role="tab"][data-horizon]')];
        const current=Math.max(0,tabs.indexOf(horizonTab));
        const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:
          (current+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        event.preventDefault();
        state.horizon=number(tabs[next].dataset.horizon);
        draw(`[role="tab"][data-horizon="${state.horizon}"]`);
      }
      if(sector&&event.key==='Escape'){state.selected=(data.sectors&&data.sectors[0]&&data.sectors[0].name)||'';draw(`[data-sector="${CSS.escape(state.selected)}"]`);}
    };
    draw();
    return true;
  }

  global.GaeoRotation={mount,formatPercent,confidenceLabel,renderView,todayView,freshnessView,mapLayout};
})(window);
