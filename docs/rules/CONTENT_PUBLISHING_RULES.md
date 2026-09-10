# 콘텐츠 발행 철칙(카테고리·발행·제목 길이)

> 이 문서는 2026-09-10에 `AGENTS.md`에서 **그대로 옮긴 원문**이다(삭제가 아니라 이동).
> 옮긴 이유: Codex가 자동으로 읽는 `AGENTS.md` 크기 한도(기본 32KiB) 안에 전역 안전규칙이 다 들어가게 하고,
> 세부 규칙은 관련 작업에서만 읽게 하기 위해서다. 대응표는 `docs/agent/RULES_MAP.md`, 잠금은 `test_rules_map.py`.
> 아래 본문의 규칙은 `AGENTS.md`에 있을 때와 똑같은 효력을 가진다.

## ⭐ 카테고리(`cat` 필드) 철칙

`news_analysis.js`·`stock_study.js`·`stock_lessons.js`·`estate_lessons.js`·`calculators.js` 다섯 파일 모두 각 글에 `cat` 필드가 있고, `app.js`가 모드 진입 시 이 값으로 "대>중>소" 중카테고리 선택 화면(카드 그리드)을 그린다. **새 글을 추가할 때 반드시 기존 중카테고리 중 하나와 정확히 일치하는 키를 `cat`에 넣는다** — 안 넣거나 새 값을 지어내면 그 글이 어떤 카테고리 카드에도 안 잡혀서 "전체 글 보기"로만 찾을 수 있게 된다(사실상 묻힌다).

현재 중카테고리 키(`app.js`의 `NEWS_CATS`/`STUDY_CATS`/`LESSON_CATS`/`ESTATE_CATS`/`CALC_CATS` 참조):
- 뉴스분석: `market`(코스피·코스닥 시황) · `earnings`(기업 실적발표) · `global`(글로벌 이슈·매크로) · `crypto`(코인·신기술) · `domestic`(국내 기업 이슈)
- 종목공부: `kr`(국내기업) · `global`(해외기업)
- 주식공부: `chart`(차트·기술적분석) · `capitalism`(EBS 다큐 자본주의) · `crisis`(경제위기의 역사) · `tax`(세금·절세계좌) · `product`(투자상품) · `macro`(시장을 움직이는 손) · `industry`(산업·기업분석)
- 부동산공부: `buy`(내집마련기초) · `rent`(전월세·임대차보호) · `loan`(대출·금융) · `auction`(경매·공매시리즈) · `strategy`(투자전략)
- 계산기: `stock`(주식 계산기) · `tax`(세금 계산기) · `finance`(재테크 계산기)

어느 카테고리에도 안 맞는 완전히 새로운 주제라면, 새 `cat` 키를 쓰기 전에 `app.js`의 해당 `*_CATS` 배열에도 카드를 함께 추가한다. 계산기를 새로 추가할 때는 `cat` 외에 `calcType`도 `app.js`의 `calcWidgetHTML`/`wireCalcWidget`에 해당 타입의 실제 계산 로직을 함께 추가해야 위젯이 동작한다(데이터만 추가하면 설명 글만 뜨고 계산기는 비어있게 된다).

## ⭐ 콘텐츠 발행 철칙

`news_analysis.js`·`stock_study.js`·`stock_lessons.js`·`estate_lessons.js`·`calculators.js` 중 **어느 파일이든 글을 추가/수정할 때마다** `node generate_snapshots.js` · `node generate_sitemap.js` · `node generate_rss.js` · `node generate_llms.js` **4개를 반드시 함께 실행**한다(안 하면 검색엔진·AI 크롤러가 새 글을 못 찾거나 못 읽는다). `generate_llms.js`는 AI 답변엔진용 `/llms.txt` 안내판을 다시 만든다. 이 4개 실행만으로 네이버·구글·빙·다음(카카오) 4개 검색엔진 + IndexNow(빙·네이버) + 네이버 서치어드바이저 RSS + AI 크롤러(정적 스냅샷)까지 전부 자동으로 커버된다. `sitemap.xml`만 갱신해서 push하면 IndexNow 제출은 러너가 다음 사이클(30분 이내)에 자동으로 해준다.

**그다음 `python3 seo_publish_gate.py`를 실행해 0건 위반을 확인한다** (2026-08-16, AdSense 'Low value content' 대응). 글 단위 최소 계약(고유 제목·H1 1개·설명·canonical 자기참조·placeholder 없음·noindex/sitemap 모순 없음)을 기계 검사한다. 상세 규칙·체크리스트는 `docs/gaeo_seo_publishing_rules.md`. **게이트가 실패하면 filler로 채우지 말고 발행을 보류**하고 내용을 고친다.

### ⭐ 제목·요약 길이 기준 (2026-08-03 사용자 지정, 신규 글 전부 적용)

검색결과에서 제목·설명이 중간에 잘려 뜻이 끊기는 걸 막기 위한 기준이다. **글을 새로 쓸 때 이 기준으로 쓰고, 다 쓴 뒤 아래 검증 스크립트로 확인한다.**

**자동으로 처리되니 신경 쓰지 않아도 되는 것** (`generate_snapshots.js`가 이미 해줌 — 이 동작을 되돌리지 말 것):
- `<title>` 뒤 브랜드 꼬리표는 `TITLE_SUFFIX = 'Gaeo'`(7자)로 짧게 붙는다. 예전엔 사이트명 전체(19자)가 붙어서 멀쩡한 제목까지 30건이 잘렸다.
- `meta description`은 `metaDesc()`가 155자 이내로, **문장 끝(`요.`/`다.`) → 어절** 순으로 자연스러운 지점을 찾아 끊는다. 화면에 보이는 요약(`.summary`)은 원문 그대로 나가므로 **글 내용은 절대 바뀌지 않는다.**

**글 쓸 때 지켜야 하는 것**:
- **제목(`title`/`name`)은 53자 이내**로 쓴다(꼬리표 ` · Gaeo` 7자를 더해 60자 이내가 되게). 넘어가면 늘어지는 연결어구(`~까지`, `무슨 일이 벌어지고 있나`, `~해야 할까` 등)부터 줄인다. **고유명사·숫자·날짜·시리즈 표기는 절대 빼지 않는다** — 줄이려고 정보를 버리느니 조금 긴 제목이 낫다.
- **`summary`의 앞 150자만 읽어도 말이 되게** 쓴다. 그 앞부분이 그대로 검색결과 설명문이 되기 때문이다. 뒤쪽에 결론을 몰아두면 검색결과에선 도입부만 보이고 끝난다. 전체 길이 자체는 제한 없다(화면엔 원문 전체가 나온다).
- em dash(`—`)는 제목·요약·본문 어디에도 쓰지 않는다(이 문서 상단 규칙). 구분이 필요하면 `:` 나 `,` 를 쓴다.

**발행 전 확인** (스냅샷 생성 후 실행):
```bash
node -e "const fs=require('fs'),p=require('path');const un=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'\"');
let t=0,d=0;for(const dir of ['snap/news','snap/study','snap/lesson','snap/estate','snap/calc'])
for(const f of fs.readdirSync(dir)){const h=fs.readFileSync(p.join(dir,f),'utf8');
if(un((h.match(/<title>([^<]*)<\/title>/)||[])[1]||'').length>60)t++;
if(un((h.match(/<meta name=\"description\" content=\"([^\"]*)\"/)||[])[1]||'').length>160)d++;}
console.log('제목 60자 초과:',t,'/ 설명 160자 초과:',d);"
```
설명은 **항상 0건**이어야 한다(0이 아니면 `metaDesc()`가 깨진 것). 제목은 2026-08-03 기준 9건이 남아 있는데, 전부 시리즈명·기업명·날짜가 든 기존 글이라 의도적으로 둔 것이다 — **새 글 때문에 이 숫자가 늘면 그 제목을 줄인다.**
