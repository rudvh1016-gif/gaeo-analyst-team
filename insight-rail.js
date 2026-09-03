var GaeoInsightRailCore=(function(){
  function nextPanelState(state,tab){return state.open&&state.tab===tab?{open:false,tab}:{open:true,tab};}
  function rankSnapshots(signals){
    const codes=Object.keys(signals||{});
    const make=key=>codes.slice().sort((a,b)=>(+signals[b][key]||0)-(+signals[a][key]||0)).reduce((out,code,i)=>(out[code]=i+1,out),{});
    return{current:make('t'),previous:make('pt')};
  }
  function addRecent(items,stock,limit,now){
    if(!stock||!stock.code||!stock.name)return Array.isArray(items)?items.slice():[];
    return[{code:String(stock.code),name:stock.name,visitedAt:now||Date.now()}].concat((Array.isArray(items)?items:[]).filter(x=>String(x.code)!==String(stock.code))).slice(0,limit||25);
  }
  function marketFlowLabel(now){
    const p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Seoul',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(now||new Date()).reduce((o,x)=>(o[x.type]=x.value,o),{});
    const m=+p.hour*60+(+p.minute);return !['Sat','Sun'].includes(p.weekday)&&m>=540&&m<=930?'실시간':'마감 흐름';
  }
  function formatWon(value){
    if(value==null||value===''||!Number.isFinite(+value))return'';
    return Math.round(+value).toLocaleString('ko-KR')+'원';
  }
  function formatNumber(value){
    if(value==null||value===''||!Number.isFinite(+value))return'';
    const n=+value;return Number.isInteger(n)?String(n):String(Math.round(n*10)/10);
  }
  function formatScore(value){
    const n=Number(value);if(!Number.isFinite(n))return'';
    return`${n>0?'+':''}${formatNumber(n)}점`;
  }
  function formatPanelTime(value,mode){
    const match=String(value||'').replace('T',' ').match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2}))?/);
    if(!match)return'';
    const text=`${match[2]}.${match[3]}${match[4]?` · ${match[4]}:${match[5]}`:''}`;
    return mode==='header'?`${text} 기준`:text;
  }
  function signalMetric(event){
    const type=String(event&&event.type||''),unit=String(event&&event.unit||'');
    const labels={
      rsi_oversold_entry:'RSI',rsi_oversold_exit:'RSI',rsi_overbought_entry:'RSI',rsi_overbought_exit:'RSI',
      volume_surge:'거래량',band_lower_break:'밴드 하단',band_lower_reentry:'밴드 하단',
      band_upper_break:'밴드 상단',band_upper_reentry:'밴드 상단',macd_golden_cross:'MACD',macd_dead_cross:'MACD',
      ma_golden_cross:'이동평균',ma_dead_cross:'이동평균'
    };
    const label=labels[type]||event&&event.metricLabel||'지표';
    let value='';
    if(unit==='원'||/band_/.test(type))value=formatWon(event&&event.currentValue);
    else if(unit==='배'||type==='volume_surge')value=`${formatNumber(event&&event.currentValue)}배`;
    else value=formatNumber(event&&event.currentValue);
    return{label,value};
  }
  function resolveTotalScore(code,snapshot){
    const signal=snapshot&&snapshot.signals&&snapshot.signals[code];
    if(signal&&Number.isFinite(+signal.t))return +signal.t;
    const ranked=snapshot&&snapshot.marketInsight&&snapshot.marketInsight.ranked;
    const row=Array.isArray(ranked)?ranked.find(item=>String(item.code)===String(code)):null;
    return row&&Number.isFinite(+row.total)?+row.total:null;
  }
  return{nextPanelState,rankSnapshots,addRecent,marketFlowLabel,formatWon,formatNumber,formatScore,formatPanelTime,signalMetric,resolveTotalScore};
})();

(function(core){
  'use strict';
  if(typeof document==='undefined'||typeof window==='undefined')return;
  const K={open:'gaeo-insight-panel-open',tab:'gaeo-insight-panel-tab',recent:'gaeo-recent-stocks'};
  const desktop=window.matchMedia('(min-width: 1280px)');
  const tabs=['top30','changes','rotation','news','live','recent'];
  const titles={top30:'상위 30',changes:'오늘의 변화',rotation:'순환',news:'뉴스',live:'실시간',recent:'최근 본'};
  const icons={
    top30:'<path d="M5 19V9m7 10V5m7 14v-7M3 19h18"/>',
    changes:'<path d="M4 17 9 12l4 3 7-8M15 7h5v5"/>',
    rotation:'<path d="M5 8a8 8 0 0 1 13-2l3 3M19 16a8 8 0 0 1-13 2l-3-3M21 4v5h-5M3 20v-5h5"/>',
    news:'<path d="M5 3h12v18H7a2 2 0 0 1-2-2zM17 7h3v12a2 2 0 0 1-2 2h-1M8 8h6M8 12h6M8 16h4"/>',
    live:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    recent:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
  };
  let state={open:localStorage.getItem(K.open)==='true',tab:tabs.includes(localStorage.getItem(K.tab))?localStorage.getItem(K.tab):'top30'};
  let root,content,title,asof,token=0;
  const esc=v=>String(v==null?'':v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const score=v=>core.formatNumber(v)||'-';
  const brief=()=>typeof HOME_BRIEF!=='undefined'&&HOME_BRIEF?HOME_BRIEF:null;
  const stocks=()=>typeof STOCKS!=='undefined'?STOCKS:{};
  const call=c=>({BUY:'강화',HOLD:'관찰',SELL:'주의'}[c]||c||'관찰');
  const recent=()=>{try{return JSON.parse(localStorage.getItem(K.recent)||'[]')}catch(_){return[]}};
  function saveRecent(items){localStorage.setItem(K.recent,JSON.stringify(items));window.dispatchEvent(new CustomEvent('gaeo:recent-changed'));}
  function recordRecent(stock){saveRecent(core.addRecent(recent(),stock,25));}
  function persist(){localStorage.setItem(K.open,String(state.open));localStorage.setItem(K.tab,state.tab);}
  function empty(a,b){return`<div class="gir-empty"><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`}
  const skeleton=()=>'<div class="gir-skeleton" aria-label="불러오는 중"><i></i><i></i><i></i><i></i></div>';
  function stockRow(x,html,cls=''){return`<button class="gir-row ${cls}" type="button" data-gir-stock="${esc(x.code)}" data-gir-name="${esc(x.name)}">${html}</button>`}
  function nameOf(code,fallback){return fallback||(stocks()[code]||{}).name||code}
  function priceOf(code){const value=(stocks()[code]||{}).price;return Number.isFinite(+value)&&+value>0?core.formatWon(value):''}
  function nameLine(code,name,showPrice=true){const price=priceOf(code);return`<span class="gir-name-line"><b>${esc(name)}</b>${showPrice&&price?`<small class="gir-price">${esc(price)}</small>`:''}</span>`}
  function eventValue(event){return core.signalMetric(event).value}

  function top30(){
    const b=brief(),mi=b&&b.marketInsight,rows=mi&&Array.isArray(mi.ranked)?mi.ranked.slice(0,30):[];
    if(!rows.length)return empty('상위 종목을 준비 중입니다','현재 GAEO 종합점수 스냅샷을 확인해 주세요.');
    const ranks=core.rankSnapshots(b.signals||{});
    return`<p class="gir-caption">GAEO 종합점수 기준 · 확률이나 매수 순위가 아닙니다.</p><div class="gir-list">${rows.map((x,i)=>{
      const prev=ranks.previous[x.code],d=prev?prev-i-1:null,m=d==null?'NEW':d>0?`↑${d}위`:d<0?`↓${-d}위`:'—';
      return stockRow(x,`<span class="gir-rank">${String(i+1).padStart(2,'0')}</span><span class="gir-row-main">${nameLine(x.code,x.name)}<small>${esc((stocks()[x.code]||{}).sector||'')} · ${call(x.call)}</small></span><span class="gir-number"><span class="gir-metric-label">종합</span> <span class="gir-metric-value">${score(x.total)}</span><small class="${d>0?'up':d<0?'down':''}">${m}</small></span>`,'gir-ranking-row');
    }).join('')}</div>`;
  }
  function reason(s){const d=(+s.t||0)-(+s.pt||0);return s.pc&&s.c&&s.pc!==s.c?`판단이 ${call(s.pc)}에서 ${call(s.c)}로 바뀌었습니다.`:`종합점수가 전일보다 ${Math.abs(d).toFixed(1)}점 ${d>=0?'높아졌습니다':'낮아졌습니다'}.`;}
  function changes(){
    const b=brief(),signals=b&&b.signals||{},names=new Map(((b&&b.marketInsight&&b.marketInsight.ranked)||[]).map(x=>[x.code,x.name]));
    const rows=Object.entries(signals).map(([code,s])=>({code,s,d:(+s.t||0)-(+s.pt||0),changed:s.c!==s.pc})).sort((a,b)=>+b.changed-+a.changed||Math.abs(b.d)-Math.abs(a.d)).slice(0,20);
    if(!rows.length)return empty('두드러진 변화가 없습니다','전일과 비교할 판단 스냅샷이 없습니다.');
    return`<p class="gir-caption">전일 대비 GAEO 종합점수와 판단이 크게 달라진 종목이에요.</p><div class="gir-list">${rows.map(x=>{const name=nameOf(x.code,names.get(x.code));return stockRow({code:x.code,name},`<span class="gir-row-main">${nameLine(x.code,name)}<small>${call(x.s.pc)} → ${call(x.s.c)}</small><span>종합점수 ${score(x.s.pt)} → ${score(x.s.t)}</span></span><span class="gir-number ${x.d>0?'up':x.d<0?'down':''}"><span class="gir-metric-label">종합</span> <span class="gir-metric-value">${core.formatScore(x.d)}</span></span>`,'gir-change-row')}).join('')}</div>`;
  }
  async function rotation(){
    await GaeoFeatures.load('rotation');
    const x=window.ROTATION_SNAPSHOT,s=x&&x.summary;
    if(!s)return empty('순환 신호가 없습니다','현재 표시할 순환매 스냅샷이 없습니다.');
    const h=(x.recommendedHorizon||{}).horizon||s.horizon||20,leader=(s.leaders||[])[0],candidate=s.candidate,p=s.candidateObservationPeriod,short=x.summary&&x.summary.shortTerm;
    const sectorBy=name=>(x.sectors||[]).find(v=>v.name===name);
    const stocksFor=name=>{const sector=sectorBy(name);return sector&&Array.isArray(sector.candidateStocks)?sector.candidateStocks.slice(0,2):[]};
    const reps=(name,label)=>{const rows=stocksFor(name);return rows.length?`<div class="gir-rotation-stocks"><h4>대표 확인종목</h4>${rows.map(v=>stockRow(v,`<span class="gir-row-main"><b>${esc(v.name)}</b>${(v.reasons||[]).length?`<small>${esc(v.reasons.slice(0,2).join(' · '))}</small>`:''}</span><span class="gir-number"><span class="gir-metric-label">TARO</span> <span class="gir-metric-value">${score(v.taroScore)}</span></span>`,'gir-rotation-stock')).join('')}</div>`:empty(`${label} 대표 종목이 없습니다`,'현재 제공된 Rotation/TARO 데이터만 표시합니다.')};
    return`<p class="gir-caption">업종 점수는 선택 기간의 상대적 순환 강도를 0~100으로 정리한 값이며 확률이 아니에요.</p>
      <section class="gir-rotation-section"><span class="gir-section-kicker">추천 관찰기간</span><div class="gir-rotation-period"><strong>${h}거래일</strong><small>${p?`${p.periodStart} → ${p.periodEnd} · 휴장일 제외`:'Walk-forward 검증 결과 기준'}</small></div><h3>추천기간 기준</h3><div class="gir-sector-line"><span>${h}일 주도</span><b>${esc(leader&&leader.name||'—')}</b><em><span class="gir-metric-label">순환</span> ${score(leader&&leader.score)}점</em></div>${leader?reps(leader.name,'현재 주도'):''}</section>
      <section class="gir-rotation-section"><h3>다음 순환 후보</h3><div class="gir-sector-line"><b>${esc(candidate&&candidate.name||'—')}</b><em><span class="gir-metric-label">순환</span> ${score(candidate&&candidate.score)}점</em></div>${candidate?reps(candidate.name,'다음 후보'):''}</section>
      <section class="gir-rotation-section"><h3>오늘 주도 업종</h3><div class="gir-sector-line"><span>${short&&short.horizon?`${short.horizon}거래일 흐름`:'단기 흐름'}</span><b>${esc(short&&short.name||'—')}</b><em>${short?`${score(short.score)}점`:''}</em></div>${short?reps(short.name,'오늘 주도'):empty('오늘 주도 업종이 없습니다','현재 제공된 단기 순환 신호가 없습니다.')}</section>`;
  }
  async function news(){
    await GaeoFeatures.load('news');
    const all=typeof NEWS_ANALYSIS!=='undefined'&&Array.isArray(NEWS_ANALYSIS)?NEWS_ANALYSIS.slice():[];
    if(!all.length)return empty('표시할 뉴스가 없습니다','기존 뉴스 데이터가 갱신되면 표시됩니다.');
    const top=new Set((((brief()||{}).marketInsight||{}).ranked||[]).map(x=>x.code));
    const rows=all.map((x,i)=>({x,n:(x.stocks||[]).filter(c=>top.has(c)).length*10+Math.max(0,20-i)})).sort((a,b)=>b.n-a.n).slice(0,8);
    // ⚠️ 2026-09-03 버그 수정: data-gir-news-id로 "이 기사"를 특정한다. 예전에는 모든 행이
    // data-gir-page="news"만 갖고 있어 어떤 기사를 눌러도 뉴스 목록 화면(전체 보기와 동일)으로만
    // 이동하고, 누른 그 기사는 절대 펼쳐지지 않았다(대표 신고: "해당 뉴스를 누르면 뉴스화면으로
    // 이동 안 함").
    return`<p class="gir-caption">시장 흐름과 주요 종목을 다룬 최신 분석이에요.</p><div class="gir-list">${rows.map(({x})=>`<button class="gir-row gir-news-row gir-article-row" type="button" data-gir-news-id="${esc(x.id)}" aria-label="${esc(x.title)} 기사 보기"><span class="gir-row-main"><small>${esc(x.tag||x.cat||'시장')} · ${esc(core.formatPanelTime(x.date,'recent')||x.date||'')}</small><b>${esc(x.title)}</b><span>${esc(x.summary||'').slice(0,105)}</span></span></button>`).join('')}</div>`;
  }
  function live(){
    const r=typeof GAEO_RADAR!=='undefined'?GAEO_RADAR:null,l=typeof LIVE_DATA!=='undefined'?LIVE_DATA:null,events=r&&r.events?r.events.slice(0,18):[],indices=l&&l.indices?Object.entries(l.indices).slice(0,2):[];
    if(!events.length&&!indices.length)return empty('시장 흐름을 준비 중입니다','기존 시세·레이더 스냅샷을 확인해 주세요.');
    return`<p class="gir-caption">장 마감 기준 가격·기술·거래량 이상신호예요. 지표 라벨과 단위를 함께 확인하세요.</p><div class="gir-indexes">${indices.map(([n,d])=>`<div><span>${esc(n)}</span><b>${(+d.value).toLocaleString('ko-KR')}</b><em class="${d.rate>=0?'up':'down'}">${d.rate>=0?'+':''}${d.rate}%</em></div>`).join('')}</div><div class="gir-list">${events.map(e=>{const metric=core.signalMetric(e);return stockRow(e,`<span class="gir-row-main">${nameLine(e.code,e.name)}<small>${esc((r.labels||{})[e.type]||e.type.replaceAll('_',' '))}</small><span class="gir-signal-metric"><span class="gir-metric-label">${esc(metric.label)}</span><span class="gir-metric-value">${esc(metric.value)}</span></span></span>${e.date?`<time>${esc(core.formatPanelTime(e.date,'recent')||e.date)}</time>`:''}`,'gir-signal-row')}).join('')}</div>`;
  }
  function recentPanel(){
    const rows=recent();if(!rows.length)return empty('최근 본 종목이 없습니다','이 기기에서 종목 상세를 열면 순서대로 저장됩니다.');
    return`<div class="gir-recent-head"><span>이 기기에서 최근 확인한 종목이에요. 최대 25개까지 저장됩니다.</span><button type="button" data-gir-clear>전체 삭제</button></div><div class="gir-list">${rows.map(x=>{const total=core.resolveTotalScore(x.code,brief());const visited=core.formatPanelTime(new Date(x.visitedAt).toISOString().slice(0,16).replace('T',' '),'recent');return`<div class="gir-recent-row">${stockRow(x,`<span class="gir-row-main">${nameLine(x.code,x.name,false)}<small><span class="gir-price">${esc(priceOf(x.code))}</span>${priceOf(x.code)&&visited?' · ':''}${esc(visited)}</small></span>${total==null?'':`<span class="gir-number gir-total-score"><span class="gir-metric-label">종합</span> <span class="gir-metric-value">${score(total)}</span></span>`}`,'gir-history-row')}<button type="button" class="gir-delete" data-gir-delete="${esc(x.code)}" aria-label="${esc(x.name)} 최근 목록에서 삭제">×</button></div>`}).join('')}</div>`;
  }
  const renders={top30,changes,rotation,news,live,recent:recentPanel};
  function sourceTime(tab){if(tab==='rotation'&&window.ROTATION_SNAPSHOT)return window.ROTATION_SNAPSHOT.generatedAt||window.ROTATION_SNAPSHOT.dataCutoff;if(tab==='news'&&typeof NEWS_ANALYSIS!=='undefined'&&NEWS_ANALYSIS[0])return NEWS_ANALYSIS[0].date;if(tab==='live'&&typeof GAEO_RADAR!=='undefined')return GAEO_RADAR.generatedAt||GAEO_RADAR.priceLabel;const b=brief();return b&&(b.generatedAt||(b.marketInsight||{}).sourceAsOf)}
  function timeText(v){return core.formatPanelTime(v,'header')||'최신 스냅샷 기준'}
  async function render(){
    const id=++token,flow=core.marketFlowLabel();title.textContent=state.tab==='live'?flow:titles[state.tab];root.querySelector('[data-gir-live-label]').textContent=flow;asof.textContent=timeText(sourceTime(state.tab));content.innerHTML=['rotation','news'].includes(state.tab)?skeleton():'';
    try{const html=await renders[state.tab]();if(id!==token)return;content.innerHTML=html;content.classList.remove('gir-content-enter');void content.offsetWidth;content.classList.add('gir-content-enter');asof.textContent=timeText(sourceTime(state.tab));}catch(e){if(id!==token)return;content.innerHTML=empty('데이터를 불러오지 못했습니다','잠시 뒤 다시 열어 주세요.');console.error('[GAEO insight rail]',e)}
  }
  function sync(doRender=true){
    root.classList.toggle('is-open',state.open);
    // 본문이 레일·패널 폭만큼 실제로 자리를 비우도록 body에 상태를 알린다(index.html --gaeo-shell-w).
    // 데스크톱(레일이 보이는 폭)에서만 밀고, 레일이 숨는 좁은 화면에서는 항상 0으로 되돌린다.
    document.body.classList.toggle('gir-open',state.open&&desktop.matches);
    root.querySelectorAll('[data-gir-tab]').forEach(b=>{const on=b.dataset.girTab===state.tab;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on));b.setAttribute('aria-expanded',String(on&&state.open));b.tabIndex=on?0:-1});
    const panel=root.querySelector('.gir-panel');panel.setAttribute('aria-hidden',String(!state.open));panel.setAttribute('aria-labelledby','gir-tab-'+state.tab);persist();if(state.open&&doRender&&desktop.matches)render();
  }
  function page(mode){const b=document.getElementById('mode-'+mode);if(b)b.click()}
  function bind(){
    root.addEventListener('click',e=>{const t=e.target.closest('[data-gir-tab]');if(t){state=core.nextPanelState(state,t.dataset.girTab);sync();return}if(e.target.closest('[data-gir-close]')){state.open=false;sync(false);return}const s=e.target.closest('[data-gir-stock]');if(s){jumpToStock(s.dataset.girName||s.dataset.girStock);return}
      // ⚠️ 2026-09-03 버그 수정(대표 신고: "해당 뉴스를 누르면 뉴스화면으로 이동 안 함"): 뉴스 행은
      // data-gir-news-id를 먼저 확인해 그 기사를 펼치고, data-gir-page 처리보다 패널부터 닫는다
      // (닫지 않으면 화면은 바뀌어도 패널에 가려 안 바뀐 것처럼 보였다).
      const n=e.target.closest('[data-gir-news-id]');if(n){state.open=false;sync(false);page('news');window.openNewsId&&window.openNewsId(n.dataset.girNewsId);return}
      const p=e.target.closest('[data-gir-page]');if(p){state.open=false;sync(false);page(p.dataset.girPage);return}const d=e.target.closest('[data-gir-delete]');if(d){saveRecent(recent().filter(x=>String(x.code)!==d.dataset.girDelete));render();return}if(e.target.closest('[data-gir-clear]')){saveRecent([]);render()}});
    root.addEventListener('keydown',e=>{const current=e.target.closest('[data-gir-tab]');if(!current||!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const index=tabs.indexOf(current.dataset.girTab);const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:e.key==='ArrowDown'?(index+1)%tabs.length:(index-1+tabs.length)%tabs.length;state={open:true,tab:tabs[next]};sync();root.querySelector(`[data-gir-tab="${state.tab}"]`).focus()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.open){state.open=false;sync(false);root.querySelector(`[data-gir-tab="${state.tab}"]`).focus()}});
    window.addEventListener('gaeo:recent-changed',()=>{if(state.open&&state.tab==='recent')render()});
    desktop.addEventListener('change',event=>{
      // 1280px 경계를 넘나들 때 본문 여백 상태가 실제 레일 표시 여부와 어긋나지 않게 다시 맞춘다.
      document.body.classList.toggle('gir-open',state.open&&event.matches);
      if(event.matches&&state.open)render();
    });
  }
  function mount(){
    root=document.createElement('aside');root.className='gaeo-insight-shell';root.setAttribute('aria-label','빠른 시장 인사이트');
    root.innerHTML=`<nav class="gir-rail" role="tablist" aria-orientation="vertical">${tabs.map(t=>`<button id="gir-tab-${t}" type="button" role="tab" data-gir-tab="${t}" aria-controls="gaeoInsightPanel" aria-selected="false" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[t]}</svg><span${t==='live'?' data-gir-live-label':''}>${t==='live'?core.marketFlowLabel():titles[t]}</span></button>`).join('')}</nav><section class="gir-panel" id="gaeoInsightPanel" role="tabpanel" aria-hidden="true"><header><div><h2></h2><time></time></div><button type="button" data-gir-close aria-label="인사이트 패널 닫기">×</button></header><div class="gir-content" aria-live="polite"></div><footer><button type="button" data-gir-page="single">전체 종목 보기 →</button><button type="button" data-gir-page="rotation">순환매 전체 보기 →</button><button type="button" data-gir-page="news">뉴스 전체 보기 →</button></footer></section>`;
    document.body.appendChild(root);content=root.querySelector('.gir-content');title=root.querySelector('h2');asof=root.querySelector('time');bind();sync(state.open);
  }
  window.GaeoInsightRail={recordRecent,readRecent:recent};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})(GaeoInsightRailCore);
