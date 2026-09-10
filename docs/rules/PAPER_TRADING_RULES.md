# 모의투자(Paper Trading) 규칙

> 이 문서는 2026-09-10에 `AGENTS.md`에서 **그대로 옮긴 원문**이다(삭제가 아니라 이동).
> 옮긴 이유: Codex가 자동으로 읽는 `AGENTS.md` 크기 한도(기본 32KiB) 안에 전역 안전규칙이 다 들어가게 하고,
> 세부 규칙은 관련 작업에서만 읽게 하기 위해서다. 대응표는 `docs/agent/RULES_MAP.md`, 잠금은 `test_rules_map.py`.
> 아래 본문의 규칙은 `AGENTS.md`에 있을 때와 똑같은 효력을 가진다.

## 모의투자(Paper Trading) — 실행 주체는 언제나 한 곳뿐 (2026-08-18 · Single Writer 2026-08-26)

- ⭐ **원장을 쓰는 러너는 언제나 한 곳뿐이다(Single Writer, 2026-08-26).**
  러너는 자기 이름을 환경변수 `GAEO_PAPER_RUNNER`(`WINDOWS`/`ORACLE`)로 선언하고,
  지금 활성인 러너는 저장소의 `paper_runner_config.json`(`activeRunner`)이 정한다.
  판정은 `paper_single_writer.py`가 하고 엔진 진입점(`paper_engine`·`paper_smart_v2`·
  `paper_momentum`·`paper_public`)에서 **시세 조회 전에** 걸린다(토스는 client당 유효
  토큰이 1개라 비활성 러너의 토큰 발급만으로 활성 러너 토큰이 무효가 된다).
  비활성이면 매매 계산 0 · 원장 변경 0 · push 0. **선언이 없으면 비활성**(fail closed)이고,
  `paper_runner_config.json`은 러너 커밋 화이트리스트 **밖**이라 러너가 자기를 켤 수 없다.
  전환은 사람이 그 파일을 커밋할 때만 일어난다(자동 Failover 없음). 계약: `test_paper_single_writer.py`.
- **`paper-trading.yml`의 `schedule`은 의도적으로 비활성화돼 있다. 되살리지 말 것.**
  토스증권 Open API는 허용 IP로 접근을 통제하는데 GitHub-hosted 러너(Azure) IP는
  등록할 수 없어 403이 나고, 집 PC와 동시에 돌면 같은 Paper 상태를 두 곳에서 건드린다.
- 단일 실행 주체: 집 Windows PC의 작업 스케줄러 **"GAEO Paper Trading"**
  → `scripts/paper_cycle.ps1` (평일 KST 09:05~15:05, 30분 간격).
  부트스트랩은 `%LOCALAPPDATA%\GAEO\run-paper.ps1`(저장소 밖, Secret은 DPAPI 암호화).
- 러너는 **개발용 저장소를 절대 쓰지 않는다.** 전용 clone(`%LOCALAPPDATA%\GAEO\paper-runner\repo`)에서만
  돌고, 러너 루트의 `.gaeo-paper-runner` 마커가 없으면 실행을 거부한다.
- 러너가 커밋하는 파일은 `paper_trading/`과 `paper_public.js` **뿐**이다(화이트리스트 강제).
  `git add .`·force push·`reset --hard`·자동 충돌 해결은 어느 경로에도 없다.
- Toss는 **시세(Market Data)만** 쓴다. 계좌·보유·주문 API 호출 0, `POST`는 토큰 발급 하나뿐.
  실주문 코드를 새로 만들지 말 것. 상세: `docs/PAPER_TRADING_LOCAL_RUNNER.md`.
- ⭐ **회계 기준은 거래마다 진입할 때 원장에 박제된다(2026-08-26).** 2026-08-27부터
  진입한 거래는 수수료·거래세를 반영하고(`ACCOUNTING_V2_NET`), 그 전 거래는 옛 기준
  (`ACCOUNTING_V1_GROSS`)으로 남는다. **과거 원장(trades.jsonl)을 다시 쓰지 않는다.**
  전환 이전 미반영 비용은 `summary.accounting.unreflectedCostKrw`로 그대로 공개한다.
  시장대비(벤치마크)는 원장 값이 아니라 **보고 시점에 실제 진입일·청산일 종가로
  재계산**한다(원장의 `benchmark_*`는 탐지 시점 기록이라 손대지 않는다).
- 🧪 세 번째 전략 `paper_smart_v2.py`(PAPER_SMART_V2)는 **Shadow**다. 별도 폴더
  (`paper_trading/smart_v2`)·별도 environment를 쓰고 공개 화면에 나가지 않으며,
  **자동 승격이 없다**(V1이 Baseline). 5거래일은 청산일이 아니라 재평가일이고
  안전상한은 60거래일이다. 60D 성적·적중률은 어떤 형태로도 주장하지 않는다
  (`docs/gaeo_validation_policy.md`: 60D는 평가 가능한 판단 0건).
- 🔔 **조용히 죽는 것도 알림 대상이다(2026-08-26).** `paper-health-alert.yml`이 평일 16:30 KST에
  판정하는데, 판정 로직은 `paper_health_check.py`에 있다(워크플로 안 heredoc이 아니다).
  "오늘 실패"는 기존 이슈로, **"거래일인데 오늘 기록이 0건"은 별도 제목 이슈**
  (`🛑 [GAEO Paper] 오늘 모의투자가 실행되지 않았습니다`)로 알린다. 거래일 판정은 러너가 쓰는
  파일이 아니라 `price_history.js`(GitHub Actions가 갱신하는 일봉)로 하고, 오늘 일봉이 없거나
  증거를 못 읽으면 **아무 말도 하지 않는다**(공휴일 허위 알림 0건). 계약: `test_paper_health_check.py`.
- 🐧 **Oracle Cloud Linux 러너 자료는 준비만 돼 있다(2026-08-26).** `scripts/paper_cycle.sh` ·
  `scripts/paper_doctor.sh` · `scripts/systemd/gaeo-paper.{service,timer}` · 설치 안내
  `docs/PAPER_TRADING_ORACLE_RUNNER.md`. 아직 전환하지 않았고 **집 Windows 러너를 삭제하지 않는다.**
  VM Shape·RAM·CPU·Idle 사용량은 확인할 수 없어 전부 UNKNOWN으로 문서에 그대로 적혀 있다.
- ⚠️ Windows에서 Python 출력이 cp949로 나가면 `—` 같은 문자에서 `UnicodeEncodeError`로 죽는다.
  러너는 `PYTHONUTF8=1`을 강제한다. 또 PowerShell 5.1은 BOM 없는 UTF-8 `.ps1`을 cp949로
  오독하므로 **`scripts/*.ps1`은 BOM 있는 UTF-8로 저장**해야 한다.
