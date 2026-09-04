(function(global){
  'use strict';
  // 🌐 전체시장 흐름 — window.GAEO_MARKET_CONTEXT(market_context.js)만 읽는 READ-ONLY 화면.
  // GAEO 600종목 기반 Production ROTATION(rotation-ui.js·compute_rotation.py)과는
  // 완전히 다른 모집단·다른 계산이며, 이 파일은 그 어느 쪽도 호출하거나 참조하지 않는다.
  // 개별 2,410개 종목 목록은 애초에 market_context.js에 실리지 않으므로 여기서도 만들지 않는다.

  const SOURCE_STATUS_READY='READY';
  const SOURCE_STATUS_ERROR='SOURCE_ERROR';   // collect_market_universe.py의 SOURCE_ERROR 상수와 동일 문자열
  const SECTOR_STATUS_READY='READY';          // collect_market_universe.py sector_breadth()의 status와 동일 문자열

  const escapeHtml=value=>String(value==null?'':value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
  const isNum=v=>typeof v==='number'&&Number.isFinite(v);
  const count0=v=>isNum(v)?Math.round(v).toLocaleString('ko-KR'):'—';
  // ratio: 0~1 사이 값(advanceRatio·turnoverTopNShare·capTopNShare 등) → "59.9%"
  const pct1=v=>isNum(v)?`${(v*100).toFixed(1)}%`:'—';
  // already-percent 값(medianReturn·equalWeightReturn·capWeightedReturn 등) → "+2.31%"
  const ret2=v=>isNum(v)?`${v>0?'+':''}${v.toFixed(2)}%`:'—';
  // percentage-point 차이(breadthDivergence 등) → "+1.83%p"
  const pp2=v=>isNum(v)?`${v>0?'+':''}${v.toFixed(2)}%p`:'—';

  function formatAsOf(iso){
    if(!iso) return '기준시각 확인 중';
    const d=new Date(iso);
    if(isNaN(d.getTime())) return '기준시각 확인 중';
    try{
      return d.toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
    }catch(e){ return '기준시각 확인 중'; }
  }

  function statusView(sourceStatus,dataAsOf){
    if(sourceStatus===SOURCE_STATUS_READY) return {cls:'ok',label:'정상'};
    if(sourceStatus===SOURCE_STATUS_ERROR) return {cls:'stale',label:`마지막 정상 데이터 기준 · ${escapeHtml(formatAsOf(dataAsOf))}`};
    // FULL_MARKET_PARTIAL 등 READY·SOURCE_ERROR가 아닌 그 외 모든 상태
    return {cls:'partial',label:'일부 데이터 확인 중'};
  }

  function sectorReady(data){
    const sb=data&&data.sectorBreadth;
    return Boolean(sb&&sb.status===SECTOR_STATUS_READY&&sb.sectors&&Object.keys(sb.sectors).length);
  }

  function sectorList(data){
    const sb=data&&data.sectorBreadth;
    if(!sectorReady(data)) return [];
    return Object.keys(sb.sectors).map(name=>Object.assign({name},sb.sectors[name]));
  }

  const SORT_OPTIONS=[
    {key:'advanceRatio',label:'상승 참여율'},
    {key:'medianReturn',label:'중앙값 수익률'},
    {key:'capWeightedReturn',label:'시총가중 수익률'},
    {key:'count',label:'종목수'}
  ];

  // 수집 시각이 장 시간(평일 09:00~16:00 KST) 밖이면, 화면의 시세·등락이
  // "그 시각의 시장"이 아니라 마지막 거래일 기준임을 명시한다.
  // (2026-08-16 사용자 보고: 일요일 10:42가 '기준'으로 표시돼 혼란 — 수집 시각과
  //  시세 기준일은 다른 개념이라 분리 표기한다. 공휴일 달력은 없으므로 주말·시간대만 판별)
  function marketBasisNote(iso){
    if(!iso) return '';
    const d=new Date(iso);
    if(isNaN(d.getTime())) return '';
    try{
      const parts=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',weekday:'short',hour:'2-digit',hour12:false}).formatToParts(d);
      const wd=(parts.find(x=>x.type==='weekday')||{}).value;
      const hh=Number((parts.find(x=>x.type==='hour')||{}).value);
      const off=(wd==='토'||wd==='일')||!(hh>=9&&hh<16);
      return off?'휴장 시간 수집 — 시세·등락은 마지막 거래일 기준':'';
    }catch(e){ return ''; }
  }

  function renderHeader(data){
    // 사이트 상단 Section Header가 이미 "전체시장 흐름" 제목·설명을 보여주므로
    // 여기서는 제목을 반복하지 않고 Metadata(대상 규모·수집시각·상태)만 한 줄로 보여준다.
    const status=statusView(data.sourceStatus,data.dataAsOf);
    const eligible=data.market&&data.market.eligibleCount;
    const basis=marketBasisNote(data.dataAsOf);
    return `<header class="fm-hero">
      <div class="fm-asof"><strong>전체시장 · ${count0(eligible)}종목</strong><span>${escapeHtml(formatAsOf(data.dataAsOf))} 수집</span>
      <span class="fm-status fm-status-${status.cls}"><i></i>${status.label}</span>${basis?`<span class="fm-basis">${basis}</span>`:''}</div>
    </header>`;
  }

  function renderParticipation(market){
    const eligible=market.eligibleCount, up=market.advancers, down=market.decliners, flat=market.unchanged;
    const ratio=market.advanceRatio;
    const upPct=isNum(eligible)&&eligible>0&&isNum(up)?up/eligible*100:0;
    const downPct=isNum(eligible)&&eligible>0&&isNum(down)?down/eligible*100:0;
    return `<section class="fm-panel fm-participation">
      <div class="fm-participation-counts">
        <div><span>전체</span><strong>${count0(eligible)}</strong></div>
        <div><span>상승</span><strong class="fm-up">${count0(up)}</strong></div>
        <div><span>하락</span><strong class="fm-down">${count0(down)}</strong></div>
        <div><span>보합</span><strong>${count0(flat)}</strong></div>
      </div>
      <div class="fm-bar" role="img" aria-label="상승 참여율 ${pct1(ratio)}">
        <div class="fm-bar-up" style="width:${upPct.toFixed(1)}%"></div>
        <div class="fm-bar-down" style="width:${downPct.toFixed(1)}%"></div>
      </div>
      <div class="fm-rate-line">상승 참여율 <strong>${pct1(ratio)}</strong></div>
    </section>`;
  }

  function renderCompare(data){
    const rows=[
      ['대상',count0(data.kospi&&data.kospi.eligibleCount),count0(data.kosdaq&&data.kosdaq.eligibleCount)],
      ['상승비율',pct1(data.kospi&&data.kospi.advanceRatio),pct1(data.kosdaq&&data.kosdaq.advanceRatio)],
      ['중앙값',ret2(data.kospi&&data.kospi.medianReturn),ret2(data.kosdaq&&data.kosdaq.medianReturn)],
      ['동일가중',ret2(data.kospi&&data.kospi.equalWeightReturn),ret2(data.kosdaq&&data.kosdaq.equalWeightReturn)]
    ];
    return `<section class="fm-panel fm-compare"><h3>코스피 · 코스닥 비교</h3>
      <div class="fm-table-wrap"><table class="fm-compare-table">
        <caption>코스피와 코스닥의 시장 참여도 비교</caption>
        <thead><tr><th scope="col">지표</th><th scope="col">KOSPI</th><th scope="col">KOSDAQ</th></tr></thead>
        <tbody>${rows.map(([label,a,b])=>`<tr><th scope="row">${label}</th><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody>
      </table></div>
    </section>`;
  }

  function renderFeel(market){
    const median=market.medianReturn, equal=market.equalWeightReturn, cap=market.capWeightedReturn;
    let diffLine='';
    if(isNum(cap)&&isNum(median)){
      const diff=cap-median;
      diffLine=`<p class="fm-feel-note">시총가중 수익률이 종목 중앙값보다 ${pp2(Math.abs(diff))} ${diff>=0?'높습니다':'낮습니다'}.</p>`;
    }
    return `<section class="fm-panel fm-feel"><h3>지수 체감 vs 종목 체감</h3>
      <div class="fm-feel-grid">
        <div><span>중앙값</span><strong>${ret2(median)}</strong>
          <details><summary>이 숫자는 뭔가요?</summary><div>전체 종목을 줄 세웠을 때 가운데 종목의 움직임</div></details></div>
        <div><span>동일가중</span><strong>${ret2(equal)}</strong>
          <details><summary>이 숫자는 뭔가요?</summary><div>모든 회사를 같은 비중으로 본 평균</div></details></div>
        <div><span>시총가중</span><strong>${ret2(cap)}</strong>
          <details><summary>이 숫자는 뭔가요?</summary><div>큰 회사일수록 더 크게 반영한 평균</div></details></div>
      </div>
      ${diffLine}
    </section>`;
  }

  function renderConcentration(market){
    return `<section class="fm-panel fm-concentration"><h3>거래대금 집중도</h3>
      <div class="fm-conc-grid">
        <div><span>상위 5종목</span><strong>${pct1(market.turnoverTop5Share)}</strong></div>
        <div><span>상위 30종목</span><strong>${pct1(market.turnoverTop30Share)}</strong></div>
      </div>
      <p class="fm-conc-note">오늘 거래대금이 일부 종목에 얼마나 몰렸는지 보여줍니다.</p>
    </section>`;
  }

  function sortedSectors(sectors,sortKey){
    const list=sectors.slice();
    list.sort((a,b)=>{
      const av=isNum(a[sortKey])?a[sortKey]:-Infinity, bv=isNum(b[sortKey])?b[sortKey]:-Infinity;
      return bv-av;
    });
    return list;
  }

  function renderSectorDetail(sector){
    const unchanged=isNum(sector.count)&&isNum(sector.advancers)&&isNum(sector.decliners)
      ?Math.max(0,sector.count-sector.advancers-sector.decliners):null;
    const rows=[
      ['전체 종목수',count0(sector.count)],
      ['상승',count0(sector.advancers)],
      ['하락',count0(sector.decliners)],
      ['보합',count0(unchanged)],
      ['상승 참여율',pct1(sector.advanceRatio)],
      ['중앙값 수익률',ret2(sector.medianReturn)],
      ['동일가중 수익률',ret2(sector.equalWeightReturn)],
      ['시총가중 수익률',ret2(sector.capWeightedReturn)],
      ['시총 Top1 집중도',pct1(sector.capTop1Share)],
      ['시총 Top3 집중도',pct1(sector.capTop3Share)]
    ];
    const reliabilityNote=sector.reliability==='LOW_SAMPLE'&&sector.note
      ?`<p class="fm-sector-lowsample">${escapeHtml(sector.note)}</p>`:'';
    // GAEO 추적 종목 참고 TOP3 — 사용자 요청(2026-08-16). window.GaeoFmSectorPicks
    // (index.html이 제공, GAEO 600 분석 데이터에서 확신도→종합점수 순 상위)를 있으면 쓴다.
    // 전체시장 2,410 구성종목 목록이 아님을 문구로 명시한다(개별 전체시장 종목은 여전히 미노출).
    const picks=(typeof window!=='undefined'&&typeof window.GaeoFmSectorPicks==='function')
      ?(window.GaeoFmSectorPicks(sector.name)||[]):[];
    const picksHtml=picks.length?`<div class="fm-sector-picks">
        <h4>이 업종의 GAEO 추적 종목 참고</h4>
        ${picks.map(p=>`<button type="button" class="fm-pick" data-fm-stock="${escapeHtml(p.name)}">
          <b>${escapeHtml(p.name)}</b><span class="fm-pick-call">${escapeHtml(p.call||'')}</span>
          <em>판단 확신도 ${Number.isFinite(p.confidence)?p.confidence+'%':'—'} · 종합 ${Number.isFinite(p.total)?p.total+'점':'—'}</em>
        </button>`).join('')}
        <p class="fm-picks-note">GAEO가 추적하는 종목 중 판단 확신도가 높은 순(같으면 종합점수 순) 상위예요.
        이 업종의 전체시장 구성종목 목록이 아니며, 투자 권유가 아니에요.</p>
      </div>`:'';
    return `<div class="fm-sector-detail">
      <dl class="fm-sector-detail-grid">${rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
        <div><dt>대형주 영향 차이</dt><dd>${pp2(sector.breadthDivergence)}</dd></div>
      </dl>
      <p class="fm-sector-detail-note">시총이 큰 종목의 움직임과 업종 전체 종목의 움직임이 얼마나 다른지 봅니다.</p>
      ${picksHtml}
      ${reliabilityNote}
    </div>`;
  }

  function renderSectorRow(sector,expanded){
    const upPct=isNum(sector.advanceRatio)?sector.advanceRatio*100:0;
    const detailId=`fm-sector-${encodeURIComponent(sector.name).replace(/%/g,'')}`;
    return `<div class="fm-sector-item">
      <button class="fm-sector-row" type="button" aria-expanded="${expanded?'true':'false'}" aria-controls="${detailId}" data-sector="${escapeHtml(sector.name)}">
        <div class="fm-sector-head"><span class="fm-sector-name">${escapeHtml(sector.name)}</span><span class="fm-sector-rate">${pct1(sector.advanceRatio)}</span></div>
        <div class="fm-sector-bar"><div class="fm-sector-bar-fill" style="width:${upPct.toFixed(1)}%"></div></div>
        <div class="fm-sector-sub">${count0(sector.advancers)}상승 · ${count0(sector.decliners)}하락<span class="fm-dot">·</span>중앙값 ${ret2(sector.medianReturn)}<span class="fm-dot">·</span>${count0(sector.count)}종목</div>
      </button>
      ${expanded?`<div id="${detailId}" role="region" aria-label="${escapeHtml(sector.name)} 상세">${renderSectorDetail(sector)}</div>`:''}
    </div>`;
  }

  function renderSectorSection(data,state){
    if(!sectorReady(data)){
      return `<section class="fm-panel fm-sectors"><h3>업종별 상승 참여도</h3>
        <p class="fm-sub">업종 안에서 실제로 몇 개 종목이 함께 움직이는지 봅니다.</p>
        <div class="fm-empty-inline">업종 데이터 확인 중</div>
      </section>`;
    }
    const sectors=sortedSectors(sectorList(data),state.sortKey);
    return `<section class="fm-panel fm-sectors"><h3>업종별 상승 참여도</h3>
      <p class="fm-sub">업종 안에서 실제로 몇 개 종목이 함께 움직이는지 봅니다.</p>
      <div class="fm-sort"><label for="fmSortSelect">정렬</label>
        <select id="fmSortSelect">${SORT_OPTIONS.map(o=>`<option value="${o.key}"${o.key===state.sortKey?' selected':''}>${o.label}</option>`).join('')}</select>
      </div>
      <div class="fm-sector-list">${sectors.map(sector=>renderSectorRow(sector,sector.name===state.expanded)).join('')}</div>
    </section>`;
  }

  function renderHistoryNote(data){
    /* ⭐ 2026-09-04: 예전에는 history가 객체가 되면 이 섹션을 통째로 숨겼고(return ''),
       객체가 아니면 "데이터 기록 중"만 계속 보여줬다. 그런데 일별 기록은 2026-08-18부터
       매일 쌓이고 있었다 — 합산해서 보여주는 코드가 없었을 뿐이다. 이제 실제 값을 낸다.

       ⚠️ 라벨에 "무엇의 평균인지"를 반드시 담는다. 대상이 빠진 "5일 평균"이나
          이동평균선으로 오해되는 "5일선"은 쓰지 않는다.
       ⚠️ 날짜가 모자란 기간은 평균을 지어내지 않고, 며칠 남았는지 그대로 보여준다. */
    const h=data.history;
    if(!h||typeof h!=='object'){
      return `<section class="fm-panel fm-history"><h3>시장 흐름 추세</h3>
        <p class="fm-sub">전체시장 기록이 쌓이면 단기와 중기 흐름을 기간별로 비교할 수 있습니다.</p>
        <p class="fm-history-copy">아직 기록이 시작되지 않았습니다.</p>
      </section>`;
    }
    const windows=h.windows||{};
    const today=h.today||{};
    const fmt=(v,unit)=>v==null?'—':`${v>0&&unit==='%'&&v!==0?'':''}${v}${unit||''}`;
    const cells=['5','20'].map(key=>{
      const w=windows[key];
      if(!w) return '';
      if(!w.available){
        return `<div class="fm-history-cell"><span>최근 ${w.days}거래일</span>
          <strong>${w.daysRemaining}거래일 더 필요</strong>
          <small>지금까지 ${w.daysCollected}일 모았어요</small></div>`;
      }
      const m=w.metrics||{};
      const adv=m.advanceRatioPct||{}, med=m.medianReturnPct||{};
      const now=today.advanceRatioPct;
      const gap=(now!=null&&adv.average!=null)?Math.round((now-adv.average)*10)/10:null;
      return `<div class="fm-history-cell"><span>최근 ${w.days}거래일 상승 종목 비율 평균</span>
        <strong>${fmt(adv.average,'%')}</strong>
        <small>구성 종목 중앙값 등락 평균 ${fmt(med.average,'%')}<br>
        ${escapeHtml(String(w.periodStart||''))} ~ ${escapeHtml(String(w.periodEnd||''))}
        ${gap!=null?`<br>오늘은 이 평균보다 ${gap>0?'+':''}${gap}%p`:''}</small></div>`;
    }).filter(Boolean).join('');
    const ready=['5','20'].some(k=>windows[k]&&windows[k].available);
    /* ⭐ 2026-09-04 소유자 지시: 숫자만 있으면 "그래서 뭐가 어떻다는 건지" 알 수 없다.
       숫자 아래에 처음 보는 사람도 알 수 있는 한두 문장을 붙인다.
       ⚠️ 오늘 값이 평균보다 높다/낮다는 사실만 말한다. 앞으로 오른다/내린다로
          해석해 주지 않는다(예측이 아니라 관찰 화면이다). */
    const w5=windows['5']||{};
    const nowAdv=today.advanceRatioPct;
    const avgAdv=((w5.metrics||{}).advanceRatioPct||{}).average;
    let plain='';
    if(w5.available&&nowAdv!=null&&avgAdv!=null){
      const gap=Math.round((nowAdv-avgAdv)*10)/10;
      const wide=Math.abs(gap)>=10;
      plain=`<p class="fm-history-plain"><b>쉽게 말하면</b> — 이 숫자는 "전체 시장에서 오른 종목이 몇 %였나"를 그 기간 동안 평균 낸 값이에요. 50%면 오른 종목과 내린 종목이 반반이라는 뜻이고, 높을수록 여러 종목이 함께 올랐다는 뜻이에요.<br>
        오늘은 ${nowAdv}%라서 최근 5거래일 평균(${avgAdv}%)보다 ${gap>0?'높아요':'낮아요'}. ${gap>0
          ? `평소보다 ${wide?'훨씬 ':''}많은 종목이 함께 오른 날이에요.`
          : `평소보다 ${wide?'훨씬 ':''}적은 종목만 오른 날이에요.`} 앞으로 오른다·내린다는 뜻은 아니고, 오늘 시장 분위기가 평소와 얼마나 달랐는지를 보는 값이에요.</p>`;
    } else {
      plain=`<p class="fm-history-plain"><b>쉽게 말하면</b> — 이 칸은 "전체 시장에서 오른 종목이 몇 %였나"를 여러 날 평균 내서, 오늘이 평소보다 뜨거운 날인지 조용한 날인지 비교해 보는 곳이에요. 아직 날짜가 모자란 기간은 평균을 지어내지 않고 며칠 더 필요한지만 보여줘요.</p>`;
    }
    return `<section class="fm-panel fm-history"><h3>시장 흐름 추세</h3>
      <p class="fm-sub">전체시장의 하루 집계를 기간별로 평균해 지금이 평소보다 강한지 봅니다. 이동평균선이 아닙니다.</p>
      <div class="fm-history-grid">${cells}</div>
      ${plain}
      <p class="fm-history-copy">${ready
        ? `${escapeHtml(String(h.firstDay||''))}부터 ${h.totalDaysCollected}거래일치를 모았습니다. 기간이 모자란 칸은 평균을 만들지 않고 남은 일수만 표시합니다.`
        : '아직 충분한 기록이 없어 평균값이나 추세를 표시하지 않습니다.'}</p>
    </section>`;
  }

  function renderEmpty(){
    return `<div class="fm-empty">전체시장 데이터를 불러오지 못했습니다.</div>`;
  }

  function renderView(data,state){
    if(!data) return renderEmpty();
    const market=data.market||{};
    return `<div class="fm-shell">
      ${renderHeader(data)}
      ${renderParticipation(market)}
      ${renderCompare(data)}
      ${renderFeel(market)}
      ${renderConcentration(market)}
      ${renderSectorSection(data,state)}
      ${renderHistoryNote(data)}
    </div>`;
  }

  function mount(element,data){
    if(!element) return false;
    if(!data){ element.innerHTML=renderEmpty(); return false; }
    const state={sortKey:'advanceRatio',expanded:null};
    const draw=focusSelector=>{
      element.innerHTML=renderView(data,state);
      if(focusSelector){ const target=element.querySelector(focusSelector); if(target) target.focus({preventScroll:true}); }
    };
    element.onclick=event=>{
      const pick=event.target.closest&&event.target.closest('[data-fm-stock]');
      if(pick){
        if(typeof window!=='undefined'&&typeof window.jumpToStock==='function') window.jumpToStock(pick.dataset.fmStock);
        return;
      }
      const row=event.target.closest&&event.target.closest('[data-sector]');
      if(row){
        const name=row.dataset.sector;
        state.expanded=state.expanded===name?null:name;
        draw(`[data-sector="${CSS.escape(name)}"]`);
      }
    };
    element.onchange=event=>{
      if(event.target&&event.target.id==='fmSortSelect'){
        state.sortKey=event.target.value;
        draw('#fmSortSelect');
      }
    };
    draw();
    return true;
  }

  global.GaeoFullMarket={mount,formatAsOf,statusView,pct1,ret2,pp2,count0};
})(window);
