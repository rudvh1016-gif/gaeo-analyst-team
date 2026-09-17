# 데이터 출처 준법 판정표 (SOURCE COMPLIANCE MATRIX) — 2026-09-16

> **원칙**: 명확한 허용 근거(공식 약관·공식 개발자문서·공식 라이선스)가 없으면 `PERMISSION_NOT_VERIFIED` 로 두고
> 확대하지 않는다. "무료로 열린다 · 로그인이 없다 · API 처럼 생겼다 · 남들도 쓴다 · robots 에 안 막혔다" 는 근거가 아니다.
> 이 문서는 법률 자문이 아니며 "합법 확인" 을 선언하지 않는다. 상태 어휘만 쓴다:
> `APPROVED` / `APPROVED_WITH_CONDITIONS` / `OWNER_CONFIRMATION_REQUIRED` / `PERMISSION_NOT_VERIFIED` / `PROHIBITED`.
> 기계용 원본: `config/source_compliance.json` (코드가 읽는 판정). 자동 검사: `python3 legal_source_gate.py` (premerge 포함).

**확인 환경의 한계(정직하게)**: 이 감사를 수행한 Claude Code 원격 세션은 `openapi.krx.co.kr` · `finance.naver.com` ·
`m.stock.naver.com` · `kind.krx.co.kr` · `opendart.fss.or.kr` 로의 네트워크가 정책상 차단되어 **약관 원문을 직접 열지 못했다.**
KRX Open API 조항은 검색 결과에 인용된 공식 페이지 스니펫으로, 네이버 정책은 2차 자료들의 일치하는 요약으로 확인했다.
따라서 아래 판정의 "근거" 열은 **소유자가 URL 을 직접 열어 재확인** 해야 한다. 재확인 전까지는 모두 보수적으로 읽는다.

## 0. 한눈에 결론

| 구분 | 출처 |
|---|---|
| 지금 확실히 사용 가능(자기 자산·공식 프로토콜) | gaeoteam.com 자기 파일, GitHub API(자기 저장소 자동화), IndexNow(자기 URL 알림) |
| 조건부 사용 가능(소유자 계정 약관에 동의한 서비스 · 고지 유지 조건) | Google AdSense, Google Analytics(동의 게이트), Kakao AdFit, KVdb 카운터, Wanted Sans(OFL), Lucide/Feather 아이콘(고지 추가), 벤더 스킬(MIT/Apache/CC BY) |
| 허용 여부가 불명확(원문 미확인 · 소유자 확인 필요) | OpenDART(공식 API 이나 재배포·출처표시·상업 조항 원문 미확인), 토스증권 Open API(비가동), KRX Open API(비상업 전용 + 광고 사이트 = 상업성 미해소) |
| 허용 근거를 찾지 못함(PERMISSION_NOT_VERIFIED) | **네이버 금융 비공식 endpoint·HTML 스크래핑(사이트의 유일한 시세 출처)**, **KIND 웹 스크래핑** |
| 당장 막은 것 | KRX 원자료의 공개 저장·artifact(생산자 fail closed) · KIND dispatch 워크플로 4개(게이트) · 공개 로그의 종목별 시세 600줄 · `source_verify.json` 표본값 · `changelog.html` 의 외부 CDN 폰트 · 네이버 endpoint/UA/호출빈도/종목수 확대 |
| 사이트에 현재 공개되고 있는 위험 자료 | 네이버 응답 필드 원문(`analysis_data.json` 22MB, Pages 제외로 축소 · raw GitHub 는 여전히 접근 가능), 네이버 기반 전체시장 스냅샷(`market_universe/full_market_latest.json.gz`, 시장지도 기능이 읽음), 일봉 OHLCV(`price_history.js`, 화면이 읽음) |
| 대표가 확인해야 할 외부 승인 | ① 네이버 자동수집·재배포 사전 승낙 또는 공식 대체 출처 전환 결정 ② KRX Open API — 광고 사이트에서의 이용·파생값 공개·원자료 비공개 보관에 대한 서면 확인 ③ OpenDART 약관(terms.do) 원문 확인 ④ KIND 이용약관·저작권 정책 확인 ⑤ OG 이미지 서체 라이선스 |

## 1. 판정표

판정 열: 자동수집 / 저장 / 공개(재배포·파생) / 상업 이용 — 각각 `config/source_compliance.json` 의 `gates` 와 같다.

| 출처 | 현재 사용 | 자동수집 | 저장 | 공개 | 상업사용 | 출처표시 | 판정 | 근거 URL(확인일 2026-09-16) |
|---|---|---|---|---|---|---|---|---|
| 네이버 금융 `api.finance.naver.com` `m.stock.naver.com` `finance.naver.com` | 600종목 시세 10분 주기 · 일봉·수급·컨센서스 30분 주기 · 전체시장 bulk · 환율 HTML | PERMISSION_NOT_VERIFIED(동결) | PERMISSION_NOT_VERIFIED | PERMISSION_NOT_VERIFIED | PERMISSION_NOT_VERIFIED | 의무 불명 · 사이트는 이미 '네이버 금융' 표기 | **PERMISSION_NOT_VERIFIED** · 레거시 보호 · 확대 금지 | policy.naver.com/rules/service.html · finance.naver.com/robots.txt(소유자 진술: 일반 UA Disallow: /) — 원문 미열람 |
| KRX Open API `data-dbg.krx.co.kr` | 미가동(키 없음 · 원자료 0건) | OWNER_CONFIRMATION_REQUIRED | **PROHIBITED**(공개 저장) | OWNER_CONFIRMATION_REQUIRED(파생) | **PROHIBITED**(광고 사이트 · 비상업 전용 약관) | 'KRX 통계정보' 표시 의무 | **OWNER_CONFIRMATION_REQUIRED** · 생산자 fail closed | openapi.krx.co.kr/contents/OPP/INFO/OPPINFO002.jsp · OPPINFO003.jsp (검색 스니펫으로 조항 확인) |
| KIND `kind.krx.co.kr` (웹 HTML/POST) | 상장법인목록 주 2회(업종 맵) · 시장조치 수집·probe 는 dispatch 전용 | PERMISSION_NOT_VERIFIED | PERMISSION_NOT_VERIFIED | PERMISSION_NOT_VERIFIED | PERMISSION_NOT_VERIFIED | 불명 | **PERMISSION_NOT_VERIFIED** · dispatch 4개 게이트로 닫음 · 업종 맵은 레거시 보호 | kind.krx.co.kr · data.krx.co.kr/contents/MDC/INFO/informationController/MDCINFO003.cmd — 약관 원문 미발견 |
| OpenDART `opendart.fss.or.kr/api` | 오늘의 공시 30분 주기 · 재무 1일 1회 · 기업행사 증거 dispatch | APPROVED_WITH_CONDITIONS(공식 API·키·일 한도) | OWNER_CONFIRMATION_REQUIRED | OWNER_CONFIRMATION_REQUIRED | OWNER_CONFIRMATION_REQUIRED | 사이트는 'DART' 출처·원문 링크 표기 | **OWNER_CONFIRMATION_REQUIRED** · 레거시 보호 | opendart.fss.or.kr/intro/terms.do · guide/main.do?apiGrpCd=DS001 — 원문 미열람 |
| 토스증권 Open API `openapi.tossinvest.com` | 모의투자(비가동 · schedule 꺼짐) | APPROVED_WITH_CONDITIONS(공식 OAuth API) | OWNER_CONFIRMATION_REQUIRED | OWNER_CONFIRMATION_REQUIRED | OWNER_CONFIRMATION_REQUIRED | 불명 | **OWNER_CONFIRMATION_REQUIRED** · 변경 없음 | developers.tossinvest.com/docs/auth · corp.tossinvest.com/ko/open-api |
| GitHub API / raw | 체인 dispatch·alive·워치독 | APPROVED | APPROVED | APPROVED | APPROVED | 없음 | **APPROVED** | docs.github.com 서비스 약관·Actions 문서 |
| KVdb `kvdb.io` | 방문 카운터(동의 게이트) · 30분 백업 | APPROVED_WITH_CONDITIONS | APPROVED_WITH_CONDITIONS | APPROVED | APPROVED_WITH_CONDITIONS | privacy.html 고지 | **APPROVED_WITH_CONDITIONS** | kvdb.io/legal/privacy |
| IndexNow `api.indexnow.org` | sitemap 변경 시 알림 | APPROVED | APPROVED | APPROVED | APPROVED | 없음 | **APPROVED** | indexnow.org/documentation |
| Google AdSense | 828 페이지 Auto Ads | APPROVED | APPROVED | APPROVED | APPROVED_WITH_CONDITIONS | disclaimer §7 · privacy | **APPROVED_WITH_CONDITIONS** | support.google.com/adsense/answer/48182 · 1348695 |
| Google Analytics 4 | index.html · 동의 뒤 로드 | APPROVED | APPROVED | APPROVED | APPROVED | privacy | **APPROVED_WITH_CONDITIONS** | marketingplatform.google.com/about/analytics/terms/kr/ |
| Kakao AdFit | index.html 3단위 | APPROVED | APPROVED | APPROVED | APPROVED_WITH_CONDITIONS | privacy · disclaimer §7(추가) | **APPROVED_WITH_CONDITIONS** | adfit.kakao.com |
| 뉴스 기사(인용 링크만, 244 도메인) | 글 하단 출처 링크 718건 · 본문 복제 0 | 해당 없음(수집 안 함) | 링크·매체명·(제목) | 링크 | 해당 없음 | 글마다 출처 표기 | **APPROVED_WITH_CONDITIONS**(§9 규칙 준수 조건) | 각 매체 약관 · 저작권법 인용 조항(원문 확인은 소유자) |
| 서체 Wanted Sans | 전 페이지 self-host | — | 동봉 | 동봉 | 허용(OFL) | OFL.txt 동봉 | **APPROVED** | assets/fonts/wanted-sans/OFL.txt |
| 아이콘 Lucide/Feather 계열 path | 인라인 SVG 일부 | — | 코드 내 | 코드 내 | 허용(ISC/MIT) | THIRD_PARTY_NOTICES 추가 | **APPROVED_WITH_CONDITIONS**(고지 유지) | github.com/lucide-icons/lucide/blob/main/LICENSE · feathericons/feather |
| OG 이미지 표시용 서체 | 공유 카드 픽셀 | — | 저장소 | 공개 | 불명 | 불명 | **OWNER_CONFIRMATION_REQUIRED** | 디자인 원본 확인 필요 |
| 벤더 Claude 스킬(MIT/Apache-2.0/CC BY 4.0) | 개발 도구 · Pages 미배포 | — | 저장소 | public 소스 | 허용 | LICENSE 사본 채움 | **APPROVED_WITH_CONDITIONS** | 각 폴더 LICENSE · THIRD_PARTY_NOTICES.md |
| pip: cryptography · gs-quant | 암호화 · 연구 검산 | — | 설치 | — | 허용(Apache-2.0/BSD-3 · Apache-2.0) | 고지 | **APPROVED** | PyPI 메타데이터(2026-09-16) |

## 2. 네이버 금융 — 가장 먼저, 가장 크게

- **무엇을 쓰나**: `itemSummary.naver`(현재가 등 600종목/10분), `siseJson.naver`(일봉 OHLCV·외국인비율), `m.stock.naver.com/api/stock/{code}/integration`(BPS·EPS·52주·컨센서스·수급), `api/index/*`(지수), `api/stocks/marketValue`(전체 상장종목 bulk), `finance.naver.com/marketindex/*` **HTML 스크래핑**(환율). 전부 비공식 endpoint 다.
- **어떻게 쓰나**: 브라우저를 흉내내는 User-Agent(`Mozilla/5.0 (Macintosh; …)`) + Referer 헤더, 8 스레드, 재시도 3회. robots.txt 를 읽지 않는다. 장중 10분마다 ~1,200 요청(시세+상세), 30분마다 ~600+ 요청(일봉) 규모.
- **어디에 공개되나**: `data.js`(파생 필드), `price_history.js`(OHLCV 189,419행), `analysis_data.json`(**네이버 필드명 그대로** totalInfos·dealTrends·consensusInfo, 22MB), `market_universe/full_market_latest.json.gz`(3,908행), `krx_list.json`(이름과 달리 네이버 목록), `flow_history/`(수급 파생), `price_provenance.json`(값은 해시). 저장소는 public + Pages + 광고.
- **근거 조사 결과**: 네이버가 이 endpoint 들을 제3자 자동수집용으로 허가한 공식 문서를 **찾지 못했다.** 2차 자료들은 일관되게 "네이버 약관·robots 는 사전 승낙 없는 자동수집을 제한한다" 고 요약한다(원문 미열람). 소유자 진술로 `finance.naver.com/robots.txt` 는 일반 UA `Disallow: /`.
- **판정**: `PERMISSION_NOT_VERIFIED`. "오래 썼으니 괜찮다" 로 판단하지 않는다.
- **오늘 한 것(§13 기존 기능 보호 원칙 안에서)**: ① 새 endpoint·호출 빈도·UA·종목 수 확대를 `legal_source_gate.py` 가 막는다(NAVER_ENDPOINT_NEW · USER_AGENT_NEW · NAVER_RATE_INCREASED) ② 공개 Actions 로그의 종목별 시세 600줄 출력 제거(건수 요약만) ③ `market_universe/source_verify.json` 의 응답 표본값 70개 제거(필드 이름·type 만) ④ `analysis_data.json` · `flow_history/` · `dart_financials/` 를 Pages 제외(사이트가 읽지 않는 파일들) — **raw.githubusercontent.com 으로는 여전히 받을 수 있어 완전 차단이 아니다** ⑤ 사이트를 즉시 멈추지 않았다 — 시세는 사이트의 유일한 출처라 즉시 중단은 사이트 전체 정지다.
- **소유자 결정(셋 중 하나)**: (a) 네이버에 자동수집·재배포 사전 승낙 문의 (b) 공식 대체 출처로 전환(§7) (c) 시세 기능 중단. 결정 전까지 확대 금지 상태를 유지한다.
- **UA 위장 정직화 시험**: 현재 UA 를 `gaeo-*` 식별자로 바꾸면 차단될 수 있고 그러면 사이트 시세가 멈춘다. 러너에서 통제된 1회 시험으로만 하고, 결과에 따라 소유자가 결정한다(이번 PR 에서는 바꾸지 않았다 — 확대만 막았다).

## 3. KRX Open API — 원자료 공개 금지 · 상업성 미해소

- 공식 약관(OPPINFO002, 스니펫 확인) 요지: 비상업 목적만 · API 결과로 제3자에 대가 청구 금지 · 원자료 제3자 재배포 금지 · 화면 제작 시 'KRX 통계정보' 표시 · 결과 변조 금지 · 인증키 + 서비스별 승인 · 이용 종료 후 이용 제한.
- 현재 상태: 인증키 없음(`auth.present:false`), `price_sources/`·`price_proofs/` 폴더 부재, 커밋 이력·아티팩트·로그에 KRX 행 0건(전수 확인). 표본 endpoint smoke 는 필드 이름만 남긴다.
- 조치: `collect_price_proof.produce()` 는 게이트가 닫혀 있으면 **요청 0 · 원자료 0 · `OWNER_ACTION: KRX_LEGAL_USE_UNVERIFIED` · 종료코드 2**. `krx_openapi_client.save_source()` 는 허용 없이 디스크에 쓰지 않는다. `price-proof.yml` artifact 에서 `price_proofs` 제거. 시험은 `cleared_gate()` 로 명시적으로 열 때만 생산자 기계장치를 검사한다.
- `COMMERCIAL_USE_NOT_CLEARED`: 사이트에 AdSense·AdFit 이 붙어 있으므로 KRX 데이터에 의존한 기능을 "수익화 가능" 상태로 표시하지 않는다. 서면 허락·별도 라이선스 확인 시 사람이 `config/source_compliance.json` 을 바꾼다 — 코드는 스스로 열지 않는다.
- RAW vs DERIVED: 원자료(응답 JSON·종목별 일별 행·원문 복원 가능 파일)는 PROHIBITED. 파생(적중 여부·수익률 집계)은 "파생이면 자유" 라 가정하지 않고 OWNER_CONFIRMATION_REQUIRED.

## 4. KIND — 웹 스크래핑, 허용 근거 없음

- 상장법인목록 다운로드(업종 컬럼 → `sector_map.json`) 는 주 2회 schedule 로 이미 운영 중 → 레거시 보호(사이트의 업종 분류가 의존).
- 시장조치 검색(POST, 세션 쿠키 재사용, `X-Requested-With`, Chrome UA) 과 probe 3개(그중 `kind_corp_probe.py` 는 사이트 JS 를 내려받아 endpoint 를 역공학)는 dispatch 전용 → **4개 워크플로 첫 스텝에 `legal_source_gate.py --require kind:automatedCollection` 게이트**. 허용 근거가 기록되기 전에는 네트워크에 나가지 않는다.
- 소유자 조치: KIND 하단 이용약관·저작권 정책 확인 → 자동수집·재배포 허용 여부 기록. 시장조치 증거가 필요하면 OpenDART(공식 API) 우선.

## 5. OpenDART · 토스증권 — 공식 API, 조항 원문 확인 필요

- OpenDART: 공식 오픈API·인증키·개발가이드가 자동 호출을 전제하므로 자동수집은 조건부 허용으로 두었다(키 비노출·일 한도 ledger·정직한 UA). 그러나 재배포·출처표시·상업 이용 조항 원문(terms.do)을 못 읽었다 → 공개·상업은 OWNER_CONFIRMATION_REQUIRED. 현재 공개 저장은 공시 제목·접수번호·구조화 재무수치이고 원문은 AES-256-GCM 암호화. `dart_financials/` 는 Pages 제외.
- 토스증권: 공식 OAuth API, 소유자 계정, Retry-After 준수 구현. 비가동(schedule 꺼짐·집 PC 러너 차단). `paper_trading/*.jsonl` 에 Toss 시세 기반 체결가가 공개 커밋되어 있다 → 시세 재배포 조항 확인 필요.

## 6. 광고·수익화 (commercialAllowed)

- 사이트 맥락: public + GitHub Pages + AdSense(ads.txt) + AdFit → 이미 상업적 맥락으로 본다.
- `commercialUse` 게이트가 열린 출처만 수익화 화면에 들어갈 수 있다. 네이버·KIND(미확인), KRX(PROHIBITED), OpenDART·Toss(확인 필요) 는 **수익화 전 별도 재검토** 대상이다. 지금 광고가 붙은 화면이 네이버 데이터로 만들어져 있다는 사실이 이 감사의 가장 큰 미해소 위험이다.

## 7. 안전한 대체 출처 후보 (승인이 아님 — 각자 약관 확인 필요)

2026-09-16 PHASE 1 에서 상품별로 쪼개 조사했다. 전체 표·법적 근거·데이터 품질·판단 영향(shadow)은 **`docs/legal/SOURCE_REPLACEMENT_MATRIX.md`**, 의존성 지도는 `docs/legal/NAVER_DEPENDENCY_MAP.md`, 기계용 원본은 `config/data_supply_migration.json`. 요약:

| 후보 | 상태 | 메모 |
|---|---|---|
| 공공데이터포털 금융위원회_주식시세정보 (data.go.kr/data/15094808) | **APPROVED_WITH_CONDITIONS (15094808 한정 · 2026-09-17)** | 공식·무료·T+1(다음 영업일 13:00 이후) 일별 OHLCV·시총·상장주식수·전 종목. 소유자 2026-09-17 직접 확인: 상세페이지·메타데이터 license '이용허락범위 제한 없음' · 무료 · 자동승인(세션 직접 열람은 EGRESS_BLOCKED — 소유자 확인 기록). 조건: 출처표시 · 키 보호 · T+1 표시 · 조정 여부 UNCONFIRMED · 요청 상한 명시. 다른 데이터셋·KRX 직접 API 로 확대하지 않는다. 어댑터 운영 수리 + 저장소(`official_prices/fsc_15094808/`) + 차트 소비자 준비 |
| 금융위원회_지수시세정보 (15094807) · KRX상장종목정보 (15094775) | OWNER_CONFIRMATION_REQUIRED / PERMISSION_NOT_VERIFIED | 지수·목록 대체 후보. 후자는 2차 자료상 제4유형 |
| OpenDART 재무제표(EPS·BPS → PER·PBR·ROE 재구성) | OWNER_CONFIRMATION_REQUIRED | 이미 수집 중. 정의 변경(네이버 추정 EPS ≠ DART 공시 EPS)은 OWNER 승인 |
| KRX Open API | COMMERCIAL_USE_NOT_CLEARED | 비상업 전용 · 원자료 재배포 금지 · 투자자별 거래실적·PER/PBR API 미제공 |
| 증권사 공식 Open API(토스증권 · 한국투자증권) | PERMISSION_NOT_VERIFIED | 2차 자료 요지: 시세 정보는 개인 업무 한정·제3자 제공 금지 → 공개 광고 사이트 공급원으로 부적합 신호 |
| 한국은행 ECOS · 한국수출입은행 환율 API | OWNER_CONFIRMATION_REQUIRED | 환율(표시 전용) 대체 후보 — 가장 쉬운 교체 1순위 |
| 수급(외국인·기관·개인) · 컨센서스 | NO_SAFE_REPLACEMENT_FOUND | 무료·공식·상업 이용 가능한 공급원을 찾지 못함 |
| 네이버 사전 승낙 | OWNER_ACTION | 현재 경로를 계속 쓰려면 유일한 근거 |

## 8. 이미지·로고·폰트·아이콘·오픈소스 (전수 확인 결과)

- 이미지: 제3자 로고·뉴스 사진·타 앱 캡처 **0건**(전부 자체 브랜드 아트). `docs/reviews/` 스크린샷 91장은 자기 화면이고 Pages 제외.
- 폰트: Wanted Sans self-host + OFL.txt 동봉(APPROVED). `changelog.html` 이 jsDelivr 에서 Pretendard 를 불러오던 것 제거 → self-host 로 통일. Google Fonts 미사용.
- 아이콘: 일부 path 가 Lucide(ISC)·Feather(MIT) 와 동일 → THIRD_PARTY_NOTICES.md 에 라이선스 원문 수록 + 코드 주석.
- 오픈소스: 첫 번째 파티 코드는 표준 라이브러리만. 벤더 스킬 435파일(MIT/Apache-2.0/CC BY 4.0) 은 LICENSE 사본 누락 9폴더를 채웠다. 루트 `LICENSE`(운영자 저작권 안내) · `THIRD_PARTY_NOTICES.md` 신설.
- 미확인: OG 이미지에 박제된 표시용 서체(OWNER_CONFIRMATION_REQUIRED).

## 9. 뉴스 콘텐츠 (실측 → 규칙 고정)

- 실측: 본문 저장 0 · 외부 이미지 0 · 우회 도구 0 · `<blockquote>` 0 · 최장 제3자 인용 93자 · 출처 링크 718건(제목 포함 612) · `{t,p,d}` 94건은 URL 없음.
- 규칙(신설, `docs/rules/CONTENT_PUBLISHING_RULES.md` 「저작권·인용」 · 두 SKILL.md): 본문 복제 금지 · 인용 2문장/100자 + 화자 · 이미지 금지 · 우회 금지 · sources 는 매체명·URL·발행일 · 자동 수집 금지 · 사실/해석 분리. 과거 글은 고치지 않는다.

## 10. 공개 저장소에 남은 제한 데이터 (§14 — 이력 재작성 없음)

- KRX: 없음(이력 포함 0건).
- 네이버 응답 필드 원문: `analysis_data.json`(현재·이력), `market_universe/source_verify.json`(표본값 — 이번에 제거, 이력에는 남음), `full_market_latest.json.gz`, `price_history.js`. 어느 커밋에나 있다(파이프라인이 매 사이클 커밋). 접근 가능 여부: Pages(일부 제외) · raw GitHub(전부 가능).
- 처리: 이력 재작성(force push) 은 하지 않았다. 삭제 필요성은 §2 소유자 결정에 따른다 — 네이버 승낙을 받거나 대체 출처로 전환하면 이력 정리를 별도로 판단한다(OWNER_ACTION_REQUIRED).

## 11. 자동 준법 검사 (`legal_source_gate.py`, LLM 없음)

12개 규칙: HOSTNAME_UNREGISTERED · RAW_PUBLIC_PATH · PAGES_EXCLUDE_MISSING · SERVED_PAGE_LOADS_CDN · SAMPLE_VALUES_PRESENT · FORBIDDEN_LEGAL_PHRASE · NOTICES_MISSING · VENDORED_LICENSE_MISSING · WORKFLOW_GATE_MISSING · NAVER_ENDPOINT_NEW · USER_AGENT_NEW · NAVER_RATE_INCREASED.
`--require provider:gate` 는 워크플로 첫 스텝용(닫힘이면 종료코드 2). 통과는 "등록 상태와 일치" 이지 "합법 확인" 이 아니다 — 법률 해석은 코드가 확정하지 않는다.
시험: `test_legal_source_gate.py`(28) + `test_price_proof_producer.py::LegalGateFailClosed`(6). premerge 묶음에 포함.

## 12. 소유자 조치 목록 (OWNER ACTIONS)

1. 네이버: 사전 승낙 문의 / 대체 출처 전환 / 중단 중 결정. 결정 전 확대 금지 유지.
2. KRX: OPPINFO002 원문 확인 + KRX 서면 확인(광고 사이트 이용·파생값 공개·원자료 비공개 보관). 확인 전 `KRX_OPENAPI_AUTH_KEY` 를 넣어도 생산자는 닫혀 있다(의도된 동작).
3. OpenDART: terms.do 원문에서 출처표시·재배포·상업 조항 확인 → 판정 기록.
4. KIND: 이용약관·저작권 정책 확인 → 판정 기록(확인 전 kind-* dispatch 는 게이트에 막힌다).
5. 토스증권: 시세 재배포·공개 조항 확인(비가동 상태라 급하지 않음).
6. OG 이미지 서체 라이선스 확인.
7. 위 판정을 바꿀 때는 `config/source_compliance.json` 을 사람이 고치고, 이 문서에 날짜·URL·근거 문장을 남긴다.
