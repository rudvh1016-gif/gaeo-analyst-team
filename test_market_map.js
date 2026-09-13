'use strict';
// Offline contracts using the actual 600-stock source. Browser checks are separate.
const assert=require('assert/strict'),fs=require('fs'),vm=require('vm'),zlib=require('zlib');
const map=require('./market-map.js');
const ctx={};vm.createContext(ctx);
for(const [file,name] of [['tickers.js','TICKERS'],['data.js','LIVE_DATA']]){
  vm.runInContext(fs.readFileSync(file,'utf8')+`;this.${name}=${name};`,ctx);
}
const tickers=JSON.parse(JSON.stringify(ctx.TICKERS)),live=JSON.parse(JSON.stringify(ctx.LIVE_DATA));
const saved=JSON.stringify({tickers,live});
const snapshot=JSON.parse(zlib.gunzipSync(fs.readFileSync('market_universe/full_market_latest.json.gz')));
const index=map.marketIndex(snapshot),rows=map.rows(tickers,live,index),s=map.summary(rows);
assert.equal(rows.length,600);
assert.equal(new Set(rows.map(r=>r.code)).size,600);
assert.equal(s.sectors.length,new Set(tickers.map(t=>t.sector)).size);
assert.equal(Object.values(s.counts).reduce((a,b)=>a+b),600);
for(const r of rows){
  const quote=live.stocks[r.code];
  assert.equal(r.rate,quote?.stale?null:quote.rate);
  if(r.rate!==null&&Math.abs(r.rate)>=.05) assert.equal(map.tone(r.rate).direction,r.rate>0?'up':'down');
}
for(const sector of s.sectors){
  assert.ok(sector.stocks.every(r=>r.sector===sector.name));
  const rates=sector.stocks.map(r=>r.rate).filter(x=>x!==null);
  assert.equal(sector.average,rates.length?rates.reduce((a,b)=>a+b)/rates.length:null);
}
assert.deepEqual(map.filter(rows,'ALL','005930').map(r=>r.name),['삼성전자']);
assert.ok(map.filter(rows,'ALL','삼성').every(r=>r.name.includes('삼성')));
assert.ok(map.filter(rows,'ALL','반도체').every(r=>r.sector.includes('반도체')||r.name.includes('반도체')));
assert.equal(map.filter(rows,'ALL','존재하지않는종목').length,0);
const kospi=map.filter(rows,'KOSPI',''),kosdaq=map.filter(rows,'KOSDAQ','');
assert.ok(kospi.length>0&&kosdaq.length>0);
assert.ok(kospi.every(r=>index[r.code]==='KOSPI'));
assert.ok(kosdaq.every(r=>index[r.code]==='KOSDAQ'));
assert.equal(kospi.length+kosdaq.length+rows.filter(r=>!r.market).length,600);
const invalid=map.rows([{code:'1',name:'없음',sector:'시험'}],{stocks:{'1':{price:1,rate:null}}});
assert.equal(invalid[0].rate,null);
assert.equal(map.summary(invalid).counts.flat,0);
assert.equal(map.summary(invalid).counts.unavailable,1);
assert.equal(map.tone(null).direction,'missing');
assert.equal(map.tone(.01).direction,'neutral');
assert.equal(map.tone(0).level,0);
assert.ok(map.tone(6).level>map.tone(2).level);
assert.deepEqual(map.tone(-6),{direction:'down',level:5});
assert.throws(()=>map.marketIndex({items:[]}));
assert.throws(()=>map.marketIndex({source:'naver_marketValue_bulk',asOf:'2026-09-11',items:[
  {code:'005930',market:'KOSPI'},{code:'005930',market:'KOSDAQ'}]}));
for(const width of [390,1348,1680,1920]){
  const height=900,blocks=map.layout(s.sectors,0,0,width,height);
  assert.equal(blocks.length,s.sectors.length);
  for(const b of blocks){
    assert.ok(b.w>0&&b.h>0&&b.x>=0&&b.y>=0);
    assert.ok(b.x+b.w<=width+1e-8&&b.y+b.h<=height+1e-8);
    assert.ok(Math.abs(b.w*b.h/(width*height)-b.item.weight/600)<1e-9);
  }
  for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++){
    const a=blocks[i],b=blocks[j];
    assert.ok(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)<1e-8||
      Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)<1e-8,'sector overlap');
  }
}
const cells=map.layout(rows.map(row=>({row,weight:1})),0,0,1600,1100,1.8);
assert.equal(cells.length,600);
assert.ok(cells.every(c=>Math.abs(c.w*c.h-1600*1100/600)<1e-8),'same stock weights have equal areas');
for(const width of [1168,1550,1790]){
  const height=600*3600/width+s.sectors.length*5;
  const tiles=map.layout(s.sectors,0,0,width,height).flatMap(b=>map.stockCells(b.item.stocks,b.w-10,b.h-36));
  assert.equal(tiles.length,600);
  assert.ok(tiles.filter(c=>c.w>=60&&c.h>=39).length>500,'desktop names must remain readable');
  for(const sector of s.sectors){
    const equal=map.stockCells(sector.stocks,350,500);
    assert.ok(equal.every(c=>Math.abs(c.w*c.h-350*500/sector.stocks.length)<1e-8));
  }
}
assert.equal(JSON.stringify({tickers,live}),saved,'presentation must not modify its inputs');
const html=fs.readFileSync('index.html','utf8'),app=fs.readFileSync('app.js','utf8');
assert.ok(html.includes('data-nav-mode="marketmap"'));
assert.ok(html.includes('id="mode-marketmap"'));
assert.ok(html.includes('id="marketMapView"'));
assert.ok(app.includes("m==='marketmap'"));
assert.ok(app.includes("onStock:code=>jumpToStock(STOCKS[code].name,'marketmap')"));
assert.ok(app.includes("if(mode!=='marketmap') window.GaeoMarketMap?.unmount()"));
// The existing stock dictionary has no code field; the popup adapter must pass
// the selected code to the existing analysis function without mutating quotes.
const adapterSource=app.match(/getJudgment:(code=>\{[\s\S]*?\n      \})\n    \}\);/)[1];
const quote={name:'삼성전자',price:259500};
const getJudgment=vm.runInNewContext('('+adapterSource+')',{
  STOCKS:{'005930':quote},analysisEntry:()=>({chief:{call:'HOLD'},updated:'2026-09-11 16:14'}),
  runAnalysis:stock=>{assert.equal(stock.code,'005930');return {_live:true};},decide:()=>({call:'HOLD'})
});
assert.equal(getJudgment('005930').call,'HOLD');
assert.equal(quote.code,undefined);
const sw=fs.readFileSync('sw.js','utf8');
const changesOften=sw.match(/const changesOften = ([^;]+);/)[1];
assert.ok(vm.runInNewContext(changesOften,{url:{pathname:'/market_universe/full_market_latest.json.gz'}}),
  'compressed market metadata must refresh online, not stay in the image cache');
console.log('PASS market map: 600 rows, source colors, sector averages, filters, missing data, layout, immutable inputs, existing routes');
console.log(JSON.stringify({counts:s.counts,sectors:s.sectors.length,KOSPI:kospi.length,KOSDAQ:kosdaq.length,unknown:rows.filter(r=>!r.market).length,strong:s.strong.name,weak:s.weak.name}));
