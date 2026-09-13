/* Market map: read-only presentation of the existing GAEO universe and quotes.
   No scoring, market-cap estimates, new collectors, or strategy writes. */
(function(root){
  'use strict';
  const finite=x=>typeof x==='number'&&Number.isFinite(x);
  const pct=x=>finite(x)?(x>0?'+':'')+x.toFixed(2)+'%':'확인 필요';
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function rows(tickers,live,markets={}){
    return tickers.map(t=>{
      const q=live?.stocks?.[t.code]||{};
      const valid=!q.stale&&finite(q.rate)&&finite(q.price)&&q.price>0;
      return {code:t.code,name:t.name,sector:t.sector||'업종 확인 중',market:markets[t.code]||null,
        price:finite(q.price)?q.price:null,rate:valid?q.rate:null,stale:!!q.stale};
    });
  }
  function filter(items,market,query){
    const q=String(query||'').trim().toLocaleLowerCase('ko');
    return items.filter(r=>(market==='ALL'||r.market===market)&&
      (!q||[r.name,r.code,r.sector].some(v=>v.toLocaleLowerCase('ko').includes(q))));
  }
  function summary(items){
    const counts={up:0,down:0,flat:0,unavailable:0}, groups=new Map();
    for(const row of items){
      counts[row.rate===null?'unavailable':row.rate>0?'up':row.rate<0?'down':'flat']++;
      if(!groups.has(row.sector)) groups.set(row.sector,[]);
      groups.get(row.sector).push(row);
    }
    const sectors=Array.from(groups,([name,stocks])=>{
      const valid=stocks.filter(r=>r.rate!==null);
      return {name,stocks,weight:stocks.length,valid:valid.length,
        average:valid.length?valid.reduce((a,r)=>a+r.rate,0)/valid.length:null};
    }).sort((a,b)=>b.weight-a.weight||a.name.localeCompare(b.name,'ko'));
    const ranked=sectors.filter(s=>s.average!==null).sort((a,b)=>b.average-a.average||a.name.localeCompare(b.name,'ko'));
    return {counts,sectors,strong:ranked[0],weak:ranked[ranked.length-1]};
  }
  // Fixed scale across markets/searches. Near zero is neutral; saturation alone
  // changes with movement, never with rank in the currently selected subset.
  function tone(rate){
    if(!finite(rate)) return {direction:'missing',level:0};
    const n=Math.abs(rate);
    return {direction:n<0.05?'neutral':rate>0?'up':'down',level:n<0.05?0:n<1?1:n<2?2:n<3?3:n<5?4:5};
  }
  // Deterministic balanced treemap. Weights mean stock counts, not market caps.
  function layout(items,x,y,w,h,ratio=1){
    if(!items.length) return [];
    if(items.length===1) return [{item:items[0],x,y,w,h}];
    const total=items.reduce((n,item)=>n+item.weight,0);
    let sum=0,split=1,best=Infinity;
    for(let i=1;i<items.length;i++){
      sum+=items[i-1].weight;
      if(Math.abs(total/2-sum)<best){best=Math.abs(total/2-sum);split=i;}
    }
    const fraction=items.slice(0,split).reduce((n,item)=>n+item.weight,0)/total;
    return w>=h*ratio
      ?layout(items.slice(0,split),x,y,w*fraction,h,ratio).concat(layout(items.slice(split),x+w*fraction,y,w*(1-fraction),h,ratio))
      :layout(items.slice(0,split),x,y,w,h*fraction,ratio).concat(layout(items.slice(split),x,y+h*fraction,w,h*(1-fraction),ratio));
  }
  function marketIndex(snapshot){
    if(snapshot?.source!=='naver_marketValue_bulk'||!Array.isArray(snapshot.items)||!snapshot.asOf) throw Error('시장 구분 자료 확인 필요');
    const index={};
    for(const item of snapshot.items){
      if(/^\d{6}$/.test(item.code)&&['KOSPI','KOSDAQ'].includes(item.market)){
        if(index[item.code]&&index[item.code]!==item.market) throw Error('시장 구분 충돌');
        index[item.code]=item.market;
      }
    }
    return index;
  }
  // Keep equal areas while favoring rectangles that can hold two readable lines.
  function stockCells(stocks,w,h){
    const rowCount=Math.max(1,Math.min(stocks.length,Math.round(Math.sqrt(stocks.length*h*1.7/w))));
    let offset=0,y=0;const cells=[];
    for(let line=0;line<rowCount;line++){
      const count=Math.ceil((stocks.length-offset)/(rowCount-line)),height=h*count/stocks.length;
      for(let col=0;col<count;col++) cells.push({row:stocks[offset++],x:3+col*w/count,y:28+y,w:w/count,h:height});
      y+=height;
    }
    return cells;
  }
  const api={rows,filter,summary,tone,layout,stockCells,marketIndex,pct};
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  if(typeof document==='undefined') return;
  root.GaeoMarketMap=api;
  let sourceJob,observer,activeHost=null,activeOptions=null,selected=null,renderFrame=0;
  let market='ALL',query='',marketData={},marketStamp='',marketError='',allRows=[];
  const countsHTML=c=>`<span class="mm-up">상승 <b>${c.up}</b></span><span class="mm-down">하락 <b>${c.down}</b></span>`+
    `<span>보합 <b>${c.flat}</b></span>${c.unavailable?`<span>자료 확인 <b>${c.unavailable}</b></span>`:''}`;
  const sectorHTML=(label,s)=>`<span>${label} <b>${esc(s?.name||'확인 중')}</b> <em class="mm-${s?.average>0?'up':s?.average<0?'down':'neutral'}">${s?pct(s.average):''}</em></span>`;
  api.preview=function(host,tickers,live){
    if(!host) return;
    const s=summary(rows(tickers,live));
    host.innerHTML=`<div class="mm-preview-main"><h2>시장 한눈에 보기</h2><div class="mm-counts">${countsHTML(s.counts)}</div></div>`+
      `<div class="mm-preview-sectors">${sectorHTML('강한 업종',s.strong)}${sectorHTML('약한 업종',s.weak)}</div>`+
      `<a class="mm-open" href="?m=marketmap">${tickers.length}종목 전체보기 <span aria-hidden="true">→</span></a>`;
  };
  function loadMarkets(){
    if(!sourceJob) sourceJob=(async()=>{
      try{
        const response=await fetch('market_universe/full_market_latest.json.gz?v='+Math.floor(Date.now()/600000));
        if(!response.ok) throw Error('시장 구분 자료를 받지 못했습니다.');
        const blob=await response.blob();
        const decoded=await new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).json();
        marketData=marketIndex(decoded);marketStamp=decoded.asOf;
      }catch(e){marketError='시장 구분 자료를 확인하지 못했습니다. 전체 종목은 볼 수 있습니다.';}
    })();
    return sourceJob;
  }
  api.unmount=function(){
    observer?.disconnect();observer=null;
    cancelAnimationFrame(renderFrame);selected=null;
    if(activeHost){activeHost.replaceChildren();activeHost=null;}
  };
  api.mount=function(host,options){
    api.unmount();activeHost=host;activeOptions=options;
    allRows=rows(options.tickers,options.live,marketData);
    host.innerHTML=`<div class="mm-top"><div class="mm-counts" id="mmCounts" aria-live="polite"></div>`+
      `<a class="mm-score-link" href="?m=scorecard">GAEO 판단 성적 보기 →</a></div>`+
      `<div class="mm-sector-summary" id="mmSectorSummary"></div>`+
      `<p class="mm-asof">자료 기준 ${esc(options.live.date||'확인 필요')}</p>`+
      `<div class="mm-controls"><div class="mm-markets" role="group" aria-label="시장 선택">`+
      [['ALL','전체'],['KOSPI','코스피'],['KOSDAQ','코스닥']].map(([value,label])=>`<button type="button" data-mm-market="${value}" aria-pressed="${market===value}" ${value!=='ALL'&&!marketStamp?'disabled':''}>${label}</button>`).join('')+
      `</div><label class="mm-search"><span class="mm-sr">종목명, 코드 또는 업종 검색</span><input type="search" placeholder="종목명 · 코드 · 업종" value="${esc(query)}" autocomplete="off"></label><span id="mmShown" role="status"></span></div>`+
      `<div class="mm-key"><p>색이 진할수록 오늘 움직임이 큽니다.</p><div class="mm-scale" aria-label="등락률 색 기준">`+
      [-5,-3,-1,0,1,3,5].map(v=>{const t=tone(v);return `<span class="mm-swatch mm-${t.direction}" data-level="${t.level}">${v>0?'+':''}${v}%${v===-5?' 이하':v===5?' 이상':''}</span>`;}).join('')+`</div></div>`+
      `<div class="mm-canvas" id="mmCanvas" aria-label="업종별 종목 시장지도"></div>`+
      `<div class="mm-note"><span>종목별 동일 비중 · 업종 크기는 종목 수 기준</span><span>업종 등락은 확인 가능한 종목의 단순 평균입니다.</span></div>`+
      `<p class="mm-source" id="mmSource">가격: 기존 네이버 시세 · 업종: GAEO 분류 · 시장 구분 확인 중</p>`+
      `<div class="mm-detail" id="mmDetail" role="region" aria-label="선택 종목 정보" hidden></div>`;
    host.querySelector('.mm-search input').addEventListener('input',e=>{query=e.target.value;render();});
    host.querySelector('.mm-markets').addEventListener('click',e=>{
      const button=e.target.closest('[data-mm-market]');if(!button) return;
      market=button.dataset.mmMarket;
      host.querySelectorAll('[data-mm-market]').forEach(b=>b.setAttribute('aria-pressed',b===button));render();
    });
    const canvas=host.querySelector('#mmCanvas');
    canvas.addEventListener('pointerover',e=>{
      const tile=e.target.closest('[data-mm-code]');
      if(tile&&e.pointerType!=='touch') show(tile,false);
    });
    canvas.addEventListener('focusin',e=>{const tile=e.target.closest('[data-mm-code]');if(tile) show(tile,false);});
    canvas.addEventListener('pointerleave',()=>{if(!selected?.pinned) hide();});
    host.onkeydown=e=>{if(e.key==='Escape') hide();};
    // One delegated handler: 600 tiles do not create 600 event subscriptions.
    host.onclick=e=>{
      const tile=e.target.closest('[data-mm-code]');
      if(tile){
        if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey) return;
        e.preventDefault();
        if(matchMedia('(pointer: coarse)').matches||matchMedia('(max-width: 700px)').matches) show(tile,true);
        else options.onStock(tile.dataset.mmCode);
      }
      if(e.target.closest('[data-mm-close]')) hide();
      const detail=e.target.closest('[data-mm-detail]');
      if(detail&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();options.onStock(detail.dataset.mmDetail);}
    };
    observer=new ResizeObserver(()=>{cancelAnimationFrame(renderFrame);renderFrame=requestAnimationFrame(render);});
    observer.observe(canvas);render();
    loadMarkets().then(()=>{
      if(activeHost!==host||!host.classList.contains('on')) return;
      allRows=rows(options.tickers,options.live,marketData);
      host.querySelectorAll('[data-mm-market]').forEach(b=>{b.disabled=b.dataset.mmMarket!=='ALL'&&!marketStamp;});
      const unknown=allRows.filter(r=>!r.market).length;
      host.querySelector('#mmSource').textContent=marketError||`가격: 기존 네이버 시세 · 업종: GAEO 분류 · 시장 구분: ${new Date(marketStamp).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',hour12:false})} 확인${unknown?' · 시장 미확인 '+unknown+'종목은 전체에만 표시':''}`;
      render();
    });
    // Existing loader, once. Its failure affects only the judgment in the popup.
    Promise.resolve(options.loadJudgments()).catch(()=>{}).then(()=>{if(activeHost===host&&selected) show(selected.tile,selected.pinned);});
  };
  function hide(){activeHost?.querySelector('#mmDetail')?.setAttribute('hidden','');selected=null;}
  function show(tile,pinned){
    if(!activeHost) return;
    const row=allRows.find(r=>r.code===tile.dataset.mmCode);if(!row) return;
    const box=activeHost.querySelector('#mmDetail'),judgment=activeOptions.getJudgment(row.code);
    selected={tile,pinned};
    box.innerHTML=`<div class="mm-detail-head"><strong>${esc(row.name)}</strong><button type="button" data-mm-close aria-label="종목 정보 닫기">닫기</button></div>`+
      `<p>${esc(row.code)} · ${esc(row.market==='KOSPI'?'코스피':row.market==='KOSDAQ'?'코스닥':'시장 확인 중')} · ${esc(row.sector)}</p>`+
      `<div class="mm-detail-price"><b>${row.price===null?'가격 확인 필요':row.price.toLocaleString('ko-KR')+'원'}</b> <span class="mm-${tone(row.rate).direction}">${row.stale?'시세 지연':pct(row.rate)}</span></div>`+
      `<p>GAEO 현재 판단 <b>${esc(judgment?.call||'확인 중')}</b></p>`+
      `<p class="mm-detail-date">${judgment?.at?'판단 '+esc(judgment.at):'종목 상세에서 판단 근거를 확인하세요.'}</p>`+
      `<a href="?m=single&code=${row.code}" data-mm-detail="${row.code}">종목 상세 분석 →</a>`;
    box.hidden=false;
    const rect=tile.getBoundingClientRect();
    box.style.left=Math.max(12,Math.min(rect.left,document.documentElement.clientWidth-box.offsetWidth-12))+'px';
    box.style.top=Math.max(12,Math.min(rect.bottom+6,document.documentElement.clientHeight-box.offsetHeight-12))+'px';
  }
  function render(){
    if(!activeHost||!activeHost.classList.contains('on')) return;
    hide();
    const host=activeHost,visible=filter(allRows,market,query),s=summary(visible);
    host.querySelector('#mmCounts').innerHTML=countsHTML(s.counts);
    host.querySelector('#mmSectorSummary').innerHTML=sectorHTML('강한 업종',s.strong)+sectorHTML('약한 업종',s.weak);
    host.querySelector('#mmShown').textContent=visible.length+' / '+allRows.length+'종목';
    const canvas=host.querySelector('#mmCanvas'),width=canvas.clientWidth;
    if(!width) return;
    if(!visible.length){canvas.style.height='180px';canvas.innerHTML='<p class="mm-empty">일치하는 종목이 없습니다.</p>';return;}
    const mobile=width<600;
    const height=mobile?0:Math.max(660,visible.length*3600/width+s.sectors.length*5);
    let blocks;
    if(mobile){
      let y=0;
      blocks=s.sectors.map(item=>{
        const h=28+Math.ceil(item.stocks.length/Math.max(2,Math.floor(width/78)))*44+6;
        const block={item,x:0,y,w:width,h};y+=h+6;return block;
      });
      canvas.style.height=(y-6)+'px';
    }else{blocks=layout(s.sectors,0,0,width,height);canvas.style.height=height+'px';}
    const fragment=document.createDocumentFragment();
    for(const b of blocks){
      const group=document.createElement('section');group.className='mm-sector';
      group.style.cssText=`left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px`;
      group.setAttribute('aria-label',b.item.name);
      const innerW=b.w-10,innerH=b.h-36;
      group.innerHTML=`<h2><span>${esc(b.item.name)}</span><em class="mm-${b.item.average>0?'up':b.item.average<0?'down':'neutral'}">${pct(b.item.average)}</em></h2>`;
      const cells=stockCells(b.item.stocks,innerW,innerH);
      for(const cell of cells){
          const row=cell.row,t=tone(row.rate),tile=document.createElement('a');
          tile.className='mm-tile mm-'+t.direction;tile.dataset.level=t.level;tile.dataset.mmCode=row.code;
          tile.dataset.rate=row.rate===null?'':row.rate;
          tile.href='?m=single&code='+row.code;
          tile.setAttribute('aria-label',row.name+' '+(row.stale?'시세 지연':pct(row.rate)));
          tile.style.cssText=`left:${cell.x}px;top:${cell.y}px;width:${cell.w-1}px;height:${cell.h-1}px`;
          const small=cell.w<60||cell.h<39;
          tile.classList.toggle('mm-small',small);
          tile.innerHTML=`<span class="mm-name">${esc(row.name)}</span><span class="mm-rate">${row.stale?'지연':pct(row.rate)}</span>`;
          group.appendChild(tile);
      }
      fragment.appendChild(group);
    }
    canvas.replaceChildren(fragment);
  }
})(typeof window!=='undefined'?window:{});
