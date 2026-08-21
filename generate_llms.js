// llms.txt 재생성 스크립트 — AI 검색엔진(ChatGPT·Perplexity·Claude·구글 AI 개요)이
// 사이트 구조를 한 번에 파악하도록 돕는 표준 파일(llmstxt.org)이다.
//
// 왜 필요한가: 홈(index.html)은 자바스크립트로 화면을 그리는 SPA라, JS를 실행하지 않는
// AI 크롤러가 홈만 읽으면 메뉴 글자만 보고 돌아간다. llms.txt는 "읽을 만한 본문은
// 여기 있다"고 알려주는 안내판 역할을 한다. 사람용 화면은 그대로 두고 안내만 추가한다.
//
// ⚠️ 여기 적는 문장은 전부 저장소 데이터에서 나온 사실이어야 한다. 홍보 문구를 지어내지 않는다.
const fs = require('fs');

const BASE = 'https://gaeoteam.com/';
const MAX_PER_SECTION = 30;

function entries(file, varname) {
  try {
    const arr = new Function(fs.readFileSync(file, 'utf8') + ';return ' + varname + ';')();
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function readManifest() {
  try {
    const value = JSON.parse(fs.readFileSync('deep_analysis_manifest.json', 'utf8'));
    return value && typeof value === 'object' ? value : {};
  } catch (e) { return {}; }
}

function countTickers() {
  try {
    const t = new Function(fs.readFileSync('tickers.js', 'utf8') + ';return TICKERS;')();
    return Array.isArray(t) ? t.length : 0;
  } catch (e) { return 0; }
}

// 정밀분석 종목 대표 페이지 — 최신 판단을 한 줄로 함께 적어 인용 가능하게 만든다.
function hubLines() {
  const archive = (() => {
    try {
      return new Function(fs.readFileSync('analysis_archive.js', 'utf8') + ';return ANALYSIS_ARCHIVE;')();
    } catch (e) { return {}; }
  })();
  return (readManifest().stockHubs || []).slice(0, MAX_PER_SECTION).map((hub) => {
    const snaps = (archive[hub.ticker] || []).slice().sort((a, b) =>
      String(b.analysisCreatedAt || b.updated || '').localeCompare(String(a.analysisCreatedAt || a.updated || '')));
    const top = snaps[0] || {};
    const name = top.stockName || hub.ticker;
    const call = top.chief && top.chief.call ? top.chief.call : '';
    const total = top.chief && Number.isFinite(Number(top.chief.total)) ? `${top.chief.total}점` : '';
    const verdict = [call, total].filter(Boolean).join(' ');
    const note = verdict ? `${verdict} (${hub.lastmod} 기준)` : `${hub.lastmod} 기준 분석 기록`;
    return `- [${name}(${hub.ticker}) 주가 전망](${hub.loc}): ${note}. 기술·재무·확률통계·수급 근거와 과거 판단 이력 전체.`;
  });
}

// ⚠️ 글 제목 필드는 파일마다 다르다. news_analysis.js만 title이고 나머지는 name이다.
// 둘 다 보지 않으면 제목이 빈 링크가 만들어진다.
function postLines(folder, list, label) {
  return list.slice(0, MAX_PER_SECTION).map((x) => {
    const title = String(x.title || x.name || '').replace(/\s+/g, ' ').trim();
    if (!title) return '';
    const summary = String(x.summary || x.desc || '').replace(/\s+/g, ' ').trim();
    const tail = summary ? `: ${summary.slice(0, 110)}` : `: ${label}`;
    return `- [${title}](${BASE}snap/${folder}/${x.id}.html)${tail}`;
  }).filter(Boolean);
}

function section(heading, lines) {
  return lines.length ? `## ${heading}\n\n${lines.join('\n')}\n` : '';
}

const stockCount = countTickers();
const hubs = hubLines();
const body = [
  '# GAEO (개오 애널리스트팀)',
  '',
  `> 한국 주식 ${stockCount ? `${stockCount}종목` : '전 종목'}을 매일 분석해 BUY/HOLD/SELL 판단과 그 근거를 공개하는 개인 운영 사이트입니다.`
    + ' 기술·재무·확률통계·수급 네 축을 각각 점수화한 뒤 종합 판단을 냅니다.'
    + ' 과거 판단이 실제로 맞았는지 적중률을 함께 공개하고, 모의투자 계좌로 성과를 검증합니다.'
    + ' 투자 권유가 아니며 최종 판단과 책임은 투자자 본인에게 있습니다.',
  '',
  '## 이 사이트를 인용할 때 알아둘 점',
  '',
  '- 홈(https://gaeoteam.com/)은 자바스크립트로 그리는 인터랙티브 화면입니다. 본문을 읽으려면 아래 정적 페이지를 사용하세요.',
  '- 모든 판단에는 기준 시각과 기준 가격이 함께 적혀 있습니다. 인용할 때 그 시점을 함께 밝혀 주세요.',
  '- 정밀분석은 사람이 종목을 지정해 깊게 본 기록이고, 자동분석은 규칙 기반 엔진이 지표만으로 낸 판단입니다. 둘은 구분해서 표기합니다.',
  '- 과거 기록은 최신 판단으로 덮어쓰지 않고 시점별로 보존합니다.',
  '',
  section(`종목 정밀분석 (종목별 대표 페이지 ${hubs.length}건)`, hubs),
  section('주식 공부 (초보자용 기초 개념)', postLines('lesson', entries('stock_lessons.js', 'STOCK_LESSONS'), '주식 기초 개념 설명')),
  section('종목·시장 해설', postLines('study', entries('stock_study.js', 'STOCK_STUDY'), '종목과 시장 구조 해설')),
  section('뉴스 분석', postLines('news', entries('news_analysis.js', 'NEWS_ANALYSIS'), '뉴스가 주가에 주는 영향 해설')),
  section('부동산 공부', postLines('estate', entries('estate_lessons.js', 'ESTATE_LESSONS'), '부동산 기초 개념 설명')),
  section('계산기', postLines('calc', entries('calculators.js', 'CALCULATORS'), '투자 계산 도구')),
  section('사이트 정보', [
    `- [전체 글 목록](${BASE}snap/index.html): 자바스크립트 없이 읽을 수 있는 정적 페이지 전체 색인.`,
    `- [정밀분석 기록 보관소](${BASE}research/deep-analysis/): 종목별 분석을 시점별로 보존한 아카이브.`,
    `- [사이트 소개](${BASE}about.html)`,
    `- [변경 이력](${BASE}changelog.html): 분석 산식과 화면이 언제 어떻게 바뀌었는지의 기록.`,
    `- [문의](${BASE}contact.html)`,
    `- [개인정보 처리방침](${BASE}privacy.html)`,
  ]),
].filter((part) => part !== null && part !== undefined).join('\n');

fs.writeFileSync('llms.txt', `${body.replace(/\n{3,}/g, '\n\n').trimEnd()}\n`);
const linkCount = (body.match(/^- \[/gm) || []).length;
console.log('llms.txt 갱신 완료 —', linkCount, '개 링크');
