# LOCKED PAPER PACK (확정 · 재구축 금지)

작성일 2026-08-15 · PHASE B

**이 목록은 MASTER FINAL PROMPT에서 확정된 것이다. 처음부터 다시 구성하지 않는다.**
추가 확인은 Correction / Retraction / Expression of Concern /
Direct Replication / Direct Counter Evidence 로만 제한한다.

선정 원칙: 최신 논문을 우선하지 않는다. 오래 검증된 연구 > 권위 저널 >
후속 연구 풍부 > GAEO 구현 가능 > 반증·재현 연구 존재.

---

## TARO (가격·추세)

| 연구 | 역할 |
|---|---|
| Brock, Lakonishok & LeBaron (1992), JF | 단순 기술규칙의 검정 |
| Sullivan, Timmermann & White (1999), JF | 위 결과의 데이터 스누핑 보정(반증 축) |
| Jegadeesh & Titman (1993), JF | 중기 모멘텀 |
| Lo, Mamaysky & Wang (2000), JF | 기술적 패턴의 통계적 기반 |
| Lee & Swaminathan (2000), JF | 모멘텀과 거래량 |
| George & Hwang (2004), JF | 52주 고점 근접 |
| Medhat & Schmeling (2022), RFS | 단기 모멘텀 |
| Jegadeesh, Luo, Subrahmanyam & Titman (2025), RFS | 단기 반전과 중기 모멘텀의 시간축 분리 |

주의: Brock(1992)과 Sullivan(1999)은 **반드시 같이** 해석한다.
전자의 결과를 후자의 스누핑 보정 없이 인용하지 않는다.

## DIANA (재무·기업 질)

| 연구 | 역할 |
|---|---|
| Novy-Marx (2013), JFE | 총이익성(Gross Profitability) |
| Fama & French (2015), JFE | 5요인 |
| Hou, Xue & Zhang (2015), RFS | 투자 기반 접근 |
| Ball, Gerakos, Linnainmaa & Nikolaev (2015), JFE | 이익성 지표 정제 |
| Sloan (1996), TAR | 발생액(Accruals) |

## FLOW (수급)

| 연구 | 역할 |
|---|---|
| Sias (2004), RFS | 기관 군집매매 |
| Coval & Stafford (2007), JFE | 자금유출입 강제매매(Fire Sales) |
| Lou (2012), RFS | 플로우 기반 수익 예측 |
| Amihud (2002), JFM | 비유동성 |

## ROTATION (업종)

| 연구 | 역할 |
|---|---|
| Moskowitz & Grinblatt (1999), JF | 업종이 모멘텀을 설명하는가 |
| Hou (2007), RFS | 업종 내 정보 확산과 선행·후행 |

## EVENT (공식 공시)

| 연구 | 역할 |
|---|---|
| Bernard & Thomas (1989, 1990) | PEAD |
| DellaVigna & Pollet (2009), JF | 투자자 주의 분산(금요일 실적) |
| Hirshleifer, Lim & Teoh (2009), JF | 주의 분산 |
| Hung, Li & Wang (2015), RFS | 글로벌 PEAD |

## QUANT (통계 심판)

| 연구 | 역할 |
|---|---|
| Harvey, Liu & Zhu (2016), RFS | 다중검정 문턱 |
| Hou, Xue & Zhang (2020), RFS | 이상현상 재현성 |
| McLean & Pontiff (2016), JF | 논문 발표 후 예측력 소멸 |
| Novy-Marx & Velikov (2016), RFS | 거래비용 반영 |
| White (2000), Econometrica | Reality Check |

## RISK (안전검사)

| 연구 | 역할 |
|---|---|
| Daniel & Moskowitz (2016), JFE | 모멘텀 붕괴 |
| Campbell, Hilscher & Szilagyi (2008), JF | 부실 위험 |
| Moreira & Muir (2017), JF | 변동성 관리 포트폴리오 |
| Cederburg et al. (2020), JFE | 위 결과에 대한 반증 |
| Amihud (2002), JFM | 비유동성 |

주의: Moreira/Muir와 Cederburg는 **반드시 같이** 해석한다.
"변동성 높으면 무조건 일정 점수 감점"을 논문이 증명했다고 주장하지 않는다.

## CHIEF / 확률 결합

| 연구 | 역할 |
|---|---|
| Gneiting, Balabdaoui & Raftery (2007), JRSS-B | 확률예측의 Calibration과 Sharpness |
| Ranjan & Gneiting (2010), JRSS-B | 확률예측 결합(단순 평균의 함정) |

---

## ⚠️ 논문은 정답 점수표가 아니다

논문은 **Candidate Feature와 경제적 가설**을 준다.
실제 Threshold / Weight는 TRAIN / VALIDATION에서 정하고 FINAL TEST로 검증한다.

다음과 같은 표기는 **금지**한다.

- "52주 고점 95% 이상 = +20점 (논문 근거)"
- "MA5 > MA20 = +15점 (논문 근거)"
- "Gross Profitability 상위 20% = +15점 (논문 근거)"

논문에서 직접 나온 숫자가 아니기 때문이다.
