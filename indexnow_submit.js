// IndexNow 제출 스크립트 — 새 글(뉴스분석·종목공부·주식공부·부동산공부)을 올린 직후 실행하면
// 빙(Bing)·네이버에 "이 URL들이 새로 생기거나 바뀌었어요"라고 즉시 알려서, 크롤러가 스스로
// 방문할 때까지(길게는 몇 주) 기다리지 않고 몇 분~몇 시간 안에 색인되게 한다.
// 구글은 IndexNow 프로토콜을 쓰지 않으므로(자체 크롤링만) 대상에서 제외.
// 사용법: node indexnow_submit.js  (sitemap.xml의 모든 URL을 제출)
//        node indexnow_submit.js https://gaeoteam.com/snap/news/11.html  (특정 URL만 제출)
const fs = require('fs');
const path = require('path');
const https = require('https');

const HERE = __dirname;
const HOST = 'gaeoteam.com';
const KEY = 'd96e570cc9c1cbbad053bee2b14a7e5d';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

function urlsFromSitemap() {
  const xml = fs.readFileSync(path.join(HERE, 'sitemap.xml'), 'utf8');
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map(m => m[1].replace(/&amp;/g, '&'));
}

function submit(urlList) {
  const payload = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList });
  const req = https.request({
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload) },
    timeout: 15000,
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      console.log(`IndexNow 응답: HTTP ${res.statusCode}`, body ? '— ' + body.slice(0, 200) : '(본문 없음, 정상)');
    });
  });
  req.on('error', e => console.log('IndexNow 제출 실패(네트워크):', e.message));
  req.on('timeout', () => { req.destroy(); console.log('IndexNow 제출 실패(타임아웃)'); });
  req.write(payload);
  req.end();
}

const arg = process.argv[2];
const urlList = arg ? [arg] : urlsFromSitemap();
console.log(`IndexNow 제출 대상 ${urlList.length}건 (host=${HOST})`);
submit(urlList);
