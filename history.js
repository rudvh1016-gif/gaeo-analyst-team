// 자동 생성: archive_analysis.py · 판단 히스토리(종목별 시간순 누적)
// 재분석 직후 실행되어 그날 CHIEF 판단을 여기에 쌓는다. index.html이 추이·채점에 사용.
const LIVE_HISTORY = {
 "080220": [
  {
   "date": "2026-07-08 09:45",
   "call": "SELL",
   "total": 44,
   "confidence": 58,
   "base": 80700,
   "baseAt": "2026-07-08 09:41",
   "target": "지지 70,000원(6월 저점대) / 저항 102,585원(MA20). 지지 붕괴 시 52주 저점권 재테스트 가능, MA20 회복 전까지는 비중 축소 관점.",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "neu",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 48
   }
  },
  {
   "date": "2026-07-08 15:02",
   "call": "SELL",
   "total": 45,
   "confidence": 60,
   "base": 75900,
   "baseAt": "2026-07-08 15:01",
   "target": "지지 70,000원(6월 저점대) / 저항 102,315원(MA20). 지지 붕괴 시 52주 저점권 재테스트 가능, MA20 회복 전까지 비중 축소 관점 유지.",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "neu",
    "score": 51
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 51
   }
  },
  {
   "date": "2026-07-09 11:32",
   "call": "HOLD",
   "total": 49,
   "confidence": 45,
   "base": 79700,
   "baseAt": "2026-07-09 11:26",
   "target": "저항 83,135원(MA60)·101,450원(MA20). 지지는 3개월 저점 35,100원 부근이나 최근 저가는 75,400원(7/8). 컨센서스 부재로 목표주가는 기술적 저항선을 참고.",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "neu",
    "score": 45
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "bull",
    "score": 58
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 48,
   "confidence": 45,
   "base": 77700,
   "baseAt": "2026-07-09 종가",
   "target": "저항 83,102원(MA60)·101,350원(MA20), 지지 75,400원(7/8 저점). 컨센서스 부재로 목표주가는 기술적 저항선을 참고.",
   "taro": {
    "stance": "bear",
    "score": 37
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "bull",
    "score": 55
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "HOLD",
   "total": 53,
   "confidence": 42,
   "base": 88300,
   "baseAt": "2026-07-10 10:26",
   "target": "저항 100,700원대(MA20) / 지지 83,900원대(MA60)·77,700원(7/9 종가). 컨센서스 부재로 목표주가는 기술적 저항선을 참고.",
   "taro": {
    "stance": "neu",
    "score": 50
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bull",
    "score": 62
   },
   "flow": {
    "stance": "bull",
    "score": 54
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 53,
   "confidence": 44,
   "base": 89100,
   "baseAt": "2026-07-10 종가",
   "target": "저항 100,700원대(MA20) / 지지 83,900원대(MA60)·77,700원(7/9 종가). 컨센서스 부재로 목표주가는 기술적 저항선을 참고.",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bull",
    "score": 60
   },
   "flow": {
    "stance": "bull",
    "score": 54
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 52,
   "confidence": 42,
   "base": 89100,
   "baseAt": "2026-07-11 종가",
   "target": "컨센서스 부재 — 기술적 저항 100,680원대(MA20) / 지지 83,900원대(MA60)·75,400원(7/8 저점)을 참고.",
   "taro": {
    "stance": "neu",
    "score": 52
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bull",
    "score": 63
   },
   "flow": {
    "stance": "neu",
    "score": 50
   }
  },
  {
   "date": "2026-07-13 15:46",
   "call": "HOLD",
   "total": 47,
   "confidence": 46,
   "base": 77300,
   "baseAt": "2026-07-13 종가",
   "target": "소형주로 컨센서스 부재. 지지 6.5만(3개월 중단)·저항 8.9만(전일 종가). 외인·기관 매수+저거래 조정으로 낙폭과대, 시장 안정 시 반등 기대.",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "bull",
    "score": 55
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 62,
   "base": 81900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 26
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "bear",
    "score": 36
   },
   "tier": "auto"
  }
 ],
 "005930": [
  {
   "date": "2026-07-08 09:45",
   "call": "HOLD",
   "total": 47,
   "confidence": 55,
   "base": 294500,
   "baseAt": "2026-07-08 09:41",
   "target": "지지 286,633원(MA60) / 저항 327,075원(MA20). 컨센서스 평균 목표주가는 508,958원으로 장기 상단 여력은 충분.",
   "taro": {
    "stance": "neu",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "bear",
    "score": 30
   }
  },
  {
   "date": "2026-07-08 15:02",
   "call": "HOLD",
   "total": 48,
   "confidence": 52,
   "base": 280500,
   "baseAt": "2026-07-08 15:01",
   "target": "컨센서스 목표주가 508,958원까지 약 83% 상승여력. 지지 273,500원(7/7 저가) / 저항 326,275원(MA20). MA20 회복 전까지는 저점 분할매수 관점.",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 68
   },
   "nova": {
    "stance": "bull",
    "score": 64
   },
   "flow": {
    "stance": "bear",
    "score": 36
   }
  },
  {
   "date": "2026-07-09 11:32",
   "call": "SELL",
   "total": 44,
   "confidence": 55,
   "base": 282000,
   "baseAt": "2026-07-09 11:26",
   "target": "컨센서스 목표주가 513,958원까지 +82% 상승여력이 열려있으나, 단기 지지는 275,000원대 / 저항은 287,608원(MA60)·325,350원(MA20). 외국인 매도세 진정 확인 전까지 비중 확대는 보류.",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "bear",
    "score": 28
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 51,
   "confidence": 50,
   "base": 278000,
   "baseAt": "2026-07-09 종가",
   "target": "컨센서스 목표주가 513,958원까지 +85% 상승여력. 지지 277,500원(7/8 저점) / 저항 287,558원(MA60)·325,200원(MA20). 외국인 순매수 지속 확인이 비중 확대의 전제.",
   "taro": {
    "stance": "neu",
    "score": 44
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "bear",
    "score": 38
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "HOLD",
   "total": 58,
   "confidence": 52,
   "base": 291000,
   "baseAt": "2026-07-10 10:26",
   "target": "컨센서스 목표주가 513,958원까지 +76.6% 상승여력. 지지 277,500원(7/8 저점) / 저항 290,000원대(MA60)·325,000원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 50
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bull",
    "score": 60
   },
   "flow": {
    "stance": "bear",
    "score": 42
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 56,
   "confidence": 50,
   "base": 285000,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 513,958원까지 +80.3% 상승여력. 지지 277,500원(7/8 저점) / 저항 289,000원대(MA60)·323,000원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "bear",
    "score": 42
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 61,
   "confidence": 57,
   "base": 285000,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 513,958원까지 +80.3% 상승여력. 지지 277,500원(7/8 저점)·288,958원대(MA60) / 저항 323,325원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bull",
    "score": 80
   },
   "flow": {
    "stance": "neu",
    "score": 52
   }
  },
  {
   "date": "2026-07-13 15:46",
   "call": "HOLD",
   "total": 49,
   "confidence": 58,
   "base": 254500,
   "baseAt": "2026-07-13 종가",
   "target": "컨센서스 목표주가 51.4만원. 지지 20만(3개월 저점)·저항 29만(60일선). 낙폭과대+기관 저가매수로 분할매수 관점.",
   "taro": {
    "stance": "bear",
    "score": 33
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 48
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 40,
   "base": 255000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 513,958원 (현재가 대비 +101.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 15
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "bear",
    "score": 35
   },
   "tier": "auto"
  }
 ],
 "000660": [
  {
   "date": "2026-07-08 09:45",
   "call": "HOLD",
   "total": 56,
   "confidence": 58,
   "base": 2263000,
   "baseAt": "2026-07-08 09:41",
   "target": "지지 1,947,850원(MA60) / 저항 2,489,500원(MA20). 컨센서스 평균 목표주가 3,547,917원으로 장기 상단은 열려 있음.",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 74
   },
   "nova": {
    "stance": "bull",
    "score": 60
   },
   "flow": {
    "stance": "bear",
    "score": 34
   }
  },
  {
   "date": "2026-07-08 15:02",
   "call": "HOLD",
   "total": 48,
   "confidence": 52,
   "base": 2118000,
   "baseAt": "2026-07-08 15:01",
   "target": "컨센서스 목표주가 3,547,917원까지 약 67% 상승여력. 지지 1,945,533원(MA60) / 저항 2,482,550원(MA20). 7/10 나스닥 상장 이후 수급 정상화 여부 확인 필요.",
   "taro": {
    "stance": "neu",
    "score": 47
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "bear",
    "score": 34
   }
  },
  {
   "date": "2026-07-09 11:32",
   "call": "HOLD",
   "total": 47,
   "confidence": 50,
   "base": 2194000,
   "baseAt": "2026-07-09 11:26",
   "target": "컨센서스 목표주가 3,547,917원까지 +62% 상승여력. 지지 1,964,100원(MA60) / 저항 2,484,550원(MA20). 영업이익 증가율 정점 통과 시그널과 수급 전환 여부를 함께 확인.",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 74
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "bear",
    "score": 30
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 58,
   "confidence": 55,
   "base": 2186000,
   "baseAt": "2026-07-09 종가",
   "target": "컨센서스 목표주가 3,547,917원까지 +62% 상승여력. 지지 2,076,000원(7/8 저점)·1,964,083원(MA60) / 저항 2,484,500원(MA20).",
   "taro": {
    "stance": "neu",
    "score": 55
   },
   "diana": {
    "stance": "bull",
    "score": 74
   },
   "nova": {
    "stance": "bull",
    "score": 62
   },
   "flow": {
    "stance": "bear",
    "score": 42
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "HOLD",
   "total": 62,
   "confidence": 58,
   "base": 2219000,
   "baseAt": "2026-07-10 10:26",
   "target": "컨센서스 목표주가 3,547,917원까지 +59.9% 상승여력. 지지 2,076,000원(7/8 저점)·1,984,000원대(MA60) / 저항 2,489,000원대(MA20).",
   "taro": {
    "stance": "bull",
    "score": 58
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bull",
    "score": 72
   },
   "flow": {
    "stance": "bear",
    "score": 44
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 60,
   "confidence": 55,
   "base": 2180000,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 3,547,917원까지 +62.7% 상승여력. 지지 2,076,000원(7/8 저점)·1,984,000원대(MA60) / 저항 2,486,000원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 52
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bull",
    "score": 68
   },
   "flow": {
    "stance": "bear",
    "score": 44
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 59,
   "confidence": 60,
   "base": 2180000,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 3,547,917원까지 +62.7% 상승여력. 지지 2,076,000원(7/8 저점)·1,983,000원대(MA60) / 저항 2,486,000원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 52
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bull",
    "score": 92
   },
   "flow": {
    "stance": "bear",
    "score": 40
   }
  },
  {
   "date": "2026-07-13 15:46",
   "call": "HOLD",
   "total": 48,
   "confidence": 55,
   "base": 1845000,
   "baseAt": "2026-07-13 종가",
   "target": "컨센서스 목표주가 354만원(현 184.5만 대비 +92%). 단기 지지 165만(3개월 저점권)·저항 200만(60일선), 손절 170만 이탈 시.",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "bear",
    "score": 32
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 40,
   "base": 1842000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 3,547,917원 (현재가 대비 +92.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "bear",
    "score": 35
   },
   "tier": "auto"
  }
 ],
 "402340": [
  {
   "date": "2026-07-08 09:45",
   "call": "HOLD",
   "total": 53,
   "confidence": 55,
   "base": 1358000,
   "baseAt": "2026-07-08 09:41",
   "target": "지지 1,202,700원(MA60) / 저항 1,610,050원(MA20). 컨센서스 평균 목표주가 1,810,000원.",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   }
  },
  {
   "date": "2026-07-08 15:02",
   "call": "HOLD",
   "total": 52,
   "confidence": 54,
   "base": 1278000,
   "baseAt": "2026-07-08 15:01",
   "target": "컨센서스 목표주가 1,810,000원까지 약 42% 상승여력. 지지 1,201,467원(MA60) / 저항 1,606,350원(MA20).",
   "taro": {
    "stance": "neu",
    "score": 45
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "neu",
    "score": 49
   }
  },
  {
   "date": "2026-07-09 11:32",
   "call": "HOLD",
   "total": 54,
   "confidence": 52,
   "base": 1309000,
   "baseAt": "2026-07-09 11:26",
   "target": "컨센서스 목표주가 1,810,000원까지 +38% 상승여력. 지지 1,213,733원(MA60) / 저항 1,610,150원(MA20).",
   "taro": {
    "stance": "neu",
    "score": 53
   },
   "diana": {
    "stance": "bull",
    "score": 68
   },
   "nova": {
    "stance": "neu",
    "score": 55
   },
   "flow": {
    "stance": "neu",
    "score": 47
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 58,
   "confidence": 52,
   "base": 1327000,
   "baseAt": "2026-07-09 종가",
   "target": "컨센서스 목표주가 1,810,000원까지 +36% 상승여력. 지지 1,270,000원(7/8 저점)·1,214,083원(MA60) / 저항 1,611,200원(MA20).",
   "taro": {
    "stance": "neu",
    "score": 52
   },
   "diana": {
    "stance": "bull",
    "score": 68
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "bull",
    "score": 55
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "HOLD",
   "total": 61,
   "confidence": 55,
   "base": 1395000,
   "baseAt": "2026-07-10 10:26",
   "target": "컨센서스 목표주가 1,810,000원까지 +29.7% 상승여력. 지지 1,270,000원(7/8 저점)·1,228,000원대(MA60) / 저항 1,613,000원대(MA20).",
   "taro": {
    "stance": "bull",
    "score": 58
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "bull",
    "score": 64
   },
   "flow": {
    "stance": "bull",
    "score": 54
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 61,
   "confidence": 56,
   "base": 1409000,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 1,810,000원까지 +28.5% 상승여력. 지지 1,270,000원(7/8 저점)·1,229,000원대(MA60) / 저항 1,614,000원대(MA20).",
   "taro": {
    "stance": "bull",
    "score": 60
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bull",
    "score": 66
   },
   "flow": {
    "stance": "bull",
    "score": 54
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 61,
   "confidence": 52,
   "base": 1409000,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 1,810,000원까지 +28.5% 상승여력. 지지 1,270,000원(7/8 저점)·1,227,900원대(MA60) / 저항 1,613,750원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 55
   },
   "diana": {
    "stance": "bull",
    "score": 68
   },
   "nova": {
    "stance": "bull",
    "score": 76
   },
   "flow": {
    "stance": "neu",
    "score": 54
   }
  },
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 40,
   "base": 1212000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 1,900,000원 (현재가 대비 +56.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 21
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "009150": [
  {
   "date": "2026-07-08 09:45",
   "call": "SELL",
   "total": 39,
   "confidence": 60,
   "base": 1587000,
   "baseAt": "2026-07-08 09:41",
   "target": "지지 1,408,783원(MA60) / 저항 1,982,350원(MA20). 밸류에이션 정상화 전까지 추가 조정 가능성에 유의.",
   "taro": {
    "stance": "neu",
    "score": 42
   },
   "diana": {
    "stance": "bear",
    "score": 34
   },
   "nova": {
    "stance": "neu",
    "score": 40
   },
   "flow": {
    "stance": "bear",
    "score": 40
   }
  },
  {
   "date": "2026-07-08 15:02",
   "call": "SELL",
   "total": 44,
   "confidence": 58,
   "base": 1488000,
   "baseAt": "2026-07-08 15:01",
   "target": "지지 1,407,133원(MA60) / 저항 1,977,400원(MA20). MA60 이탈 시 추가 조정 위험, 밸류에이션 부담 해소 전까지 비중 축소 관점.",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "bear",
    "score": 44
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 45
   }
  },
  {
   "date": "2026-07-09 11:32",
   "call": "HOLD",
   "total": 50,
   "confidence": 48,
   "base": 1500000,
   "baseAt": "2026-07-09 11:26",
   "target": "컨센서스 목표주가 2,453,500원까지 +64% 상승여력. 지지 1,422,417원(MA60) / 저항 1,961,250원(MA20).",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "neu",
    "score": 55
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "neu",
    "score": 48
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 51,
   "confidence": 45,
   "base": 1493000,
   "baseAt": "2026-07-09 종가",
   "target": "컨센서스 목표주가 2,453,500원까지 +64% 상승여력. 지지 1,479,000원(7/8 저점)·1,422,417원(MA60) / 저항 1,961,250원(MA20).",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "neu",
    "score": 55
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "bull",
    "score": 55
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "HOLD",
   "total": 52,
   "confidence": 42,
   "base": 1621000,
   "baseAt": "2026-07-10 10:26",
   "target": "컨센서스 목표주가 2,470,000원까지 +52.4% 상승여력. 지지 1,479,000원(7/8 저점)·1,439,000원대(MA60) / 저항 1,957,000원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 50
   },
   "diana": {
    "stance": "neu",
    "score": 48
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "neu",
    "score": 52
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 50,
   "confidence": 42,
   "base": 1584000,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 2,470,000원까지 +55.9% 상승여력. 지지 1,479,000원(7/8 저점)·1,440,000원대(MA60) / 저항 1,955,000원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bull",
    "score": 56
   },
   "flow": {
    "stance": "neu",
    "score": 52
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 54,
   "confidence": 44,
   "base": 1584000,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 2,470,000원까지 +55.9% 상승여력. 지지 1,479,000원(7/8 저점)·1,439,350원대(MA60) / 저항 1,954,750원대(MA20).",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bear",
    "score": 38
   },
   "nova": {
    "stance": "bull",
    "score": 78
   },
   "flow": {
    "stance": "neu",
    "score": 52
   }
  },
  {
   "date": "2026-07-13 15:46",
   "call": "HOLD",
   "total": 47,
   "confidence": 42,
   "base": 1289000,
   "baseAt": "2026-07-13 종가",
   "target": "컨센서스 목표주가 247만원. 지지 115만·저항 145만(60일선), 밸류 부담으로 반등 시 분할 축소 관점. 손절 118만 이탈 시.",
   "taro": {
    "stance": "bear",
    "score": 32
   },
   "diana": {
    "stance": "neu",
    "score": 55
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "bull",
    "score": 52
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 34,
   "confidence": 56,
   "base": 1277000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 2,503,333원 (현재가 대비 +96.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "009155": [
  {
   "date": "2026-07-08 09:45",
   "call": "HOLD",
   "total": 47,
   "confidence": 52,
   "base": 564000,
   "baseAt": "2026-07-08 09:41",
   "target": "지지 513,750원(MA60) / 저항 710,900원(MA20). 보통주 대비 괴리율 축소 시 상대적 초과수익 기대.",
   "taro": {
    "stance": "neu",
    "score": 41
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "neu",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 58
   }
  },
  {
   "date": "2026-07-08 15:02",
   "call": "HOLD",
   "total": 52,
   "confidence": 50,
   "base": 540000,
   "baseAt": "2026-07-08 15:01",
   "target": "지지 513,383원(MA60) / 저항 709,800원(MA20). 외국인 순매수 지속 여부가 반등의 핵심 변수.",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "bull",
    "score": 60
   }
  },
  {
   "date": "2026-07-09 11:32",
   "call": "HOLD",
   "total": 58,
   "confidence": 50,
   "base": 537000,
   "baseAt": "2026-07-09 11:26",
   "target": "지지 518,800원(MA60) / 저항 708,150원(MA20). 외국인 순매수 지속 여부가 반등의 핵심 변수.",
   "taro": {
    "stance": "neu",
    "score": 47
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "bull",
    "score": 65
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 47,
   "confidence": 40,
   "base": 536000,
   "baseAt": "2026-07-09 종가",
   "target": "지지 518,783원(MA60)·536,000원(금일 종가 부근) / 저항 708,100원(MA20). 보통주 회복 시 후행 반등 패턴을 참고.",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "bull",
    "score": 54
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "HOLD",
   "total": 49,
   "confidence": 40,
   "base": 571000,
   "baseAt": "2026-07-10 10:26",
   "target": "지지 522,000원대(MA60) / 저항 708,000원대(MA20). 목표주가는 보통주 컨센서스 참고치로 직접 비교에 유의.",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "bull",
    "score": 55
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 48,
   "confidence": 40,
   "base": 565000,
   "baseAt": "2026-07-10 종가",
   "target": "지지 524,000원대(MA60) / 저항 708,000원대(MA20). 목표주가는 보통주 컨센서스 참고치로 직접 비교에 유의.",
   "taro": {
    "stance": "neu",
    "score": 42
   },
   "diana": {
    "stance": "neu",
    "score": 48
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "bull",
    "score": 55
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 54,
   "confidence": 40,
   "base": 565000,
   "baseAt": "2026-07-11 종가",
   "target": "보통주 기준 컨센서스(2,470,000원)는 우선주에 직접 적용 불가 — 기술적 저항 708,450원대(MA20) / 지지 539,000원(7/8 저점)·524,558원대(MA60)를 참고.",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "neu",
    "score": 48
   },
   "nova": {
    "stance": "bull",
    "score": 74
   },
   "flow": {
    "stance": "neu",
    "score": 52
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 48,
   "base": 467500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 2,503,333원 (현재가 대비 +435.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 15
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 55
   },
   "tier": "auto"
  }
 ],
 "011070": [
  {
   "date": "2026-07-08 09:45",
   "call": "SELL",
   "total": 44,
   "confidence": 58,
   "base": 824000,
   "baseAt": "2026-07-08 09:41",
   "target": "지지 793,011원(전망 저점대) / 저항 840,442원(MA60)·1,011,550원(MA20). MA60 회복 여부가 추세 반전의 1차 신호.",
   "taro": {
    "stance": "bear",
    "score": 33
   },
   "diana": {
    "stance": "neu",
    "score": 42
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 54
   }
  },
  {
   "date": "2026-07-08 15:02",
   "call": "HOLD",
   "total": 53,
   "confidence": 50,
   "base": 763000,
   "baseAt": "2026-07-08 15:01",
   "target": "컨센서스 forward EPS(35,989원)·PER(21.15배) 기준 약 76만원 안팎. 지지 750,000원(7/7 저가) / 저항 839,425원(MA60).",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "neu",
    "score": 56
   },
   "nova": {
    "stance": "bull",
    "score": 60
   },
   "flow": {
    "stance": "bull",
    "score": 58
   }
  },
  {
   "date": "2026-07-09 11:32",
   "call": "HOLD",
   "total": 53,
   "confidence": 50,
   "base": 739000,
   "baseAt": "2026-07-09 11:26",
   "target": "컨센서스 목표주가 1,225,150원까지 +66% 상승여력. 지지 739,000원대(현재가권) / 저항 845,408원(MA60).",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "bull",
    "score": 60
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 48,
   "confidence": 42,
   "base": 741000,
   "baseAt": "2026-07-09 종가",
   "target": "컨센서스 목표주가 1,225,150원까지 +65% 상승여력. 지지 741,000원(금일 저가권) / 저항 845,475원(MA60)·992,050원(MA20).",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "bull",
    "score": 56
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "SELL",
   "total": 46,
   "confidence": 40,
   "base": 741000,
   "baseAt": "2026-07-10 10:26",
   "target": "컨센서스 목표주가 1,219,190원까지 +64.5% 상승여력. 지지 741,000원(오늘 종가권) / 저항 852,000원대(MA60)·985,000원대(MA20).",
   "taro": {
    "stance": "bear",
    "score": 28
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "bull",
    "score": 55
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "SELL",
   "total": 44,
   "confidence": 42,
   "base": 742000,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 1,219,190원까지 +64.3% 상승여력. 지지 741,000~742,000원(최근 이틀 종가권) / 저항 852,000원대(MA60)·985,000원대(MA20).",
   "taro": {
    "stance": "bear",
    "score": 26
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "bull",
    "score": 55
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 52,
   "confidence": 48,
   "base": 742000,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 1,219,190원까지 +64.3% 상승여력. 지지 341,000원(52주 저점 근접)·741,000원(7/9 저점) / 저항 851,817원대(MA60)·977,350원대(MA20).",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "neu",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 58
   },
   "flow": {
    "stance": "neu",
    "score": 56
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 43,
   "base": 668000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 1,219,190원 (현재가 대비 +82.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 59
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 56
   },
   "tier": "auto"
  }
 ],
 "267260": [
  {
   "date": "2026-07-08 09:45",
   "call": "HOLD",
   "total": 48,
   "confidence": 53,
   "base": 837000,
   "baseAt": "2026-07-08 09:41",
   "target": "지지 800,000원(52주 하단 부근) / 저항 1,000,300원(MA20)·1,094,417원(MA60). 컨센서스 평균 목표주가 1,460,000원.",
   "taro": {
    "stance": "bear",
    "score": 28
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "bull",
    "score": 64
   },
   "flow": {
    "stance": "neu",
    "score": 46
   }
  },
  {
   "date": "2026-07-08 15:02",
   "call": "HOLD",
   "total": 48,
   "confidence": 52,
   "base": 818000,
   "baseAt": "2026-07-08 15:01",
   "target": "지지 787,000원(7/7 저가) / 저항 998,950원(MA20). 계약 모멘텀이 주가에 반영되는 시점을 확인 후 접근.",
   "taro": {
    "stance": "bear",
    "score": 28
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bull",
    "score": 64
   },
   "flow": {
    "stance": "neu",
    "score": 49
   }
  },
  {
   "date": "2026-07-09 11:32",
   "call": "HOLD",
   "total": 52,
   "confidence": 55,
   "base": 808000,
   "baseAt": "2026-07-09 11:26",
   "target": "컨센서스 목표주가 1,487,692원까지 +84% 상승여력. 지지 807,000원(3개월 최저가권) / 저항 987,950원(MA20).",
   "taro": {
    "stance": "bear",
    "score": 32
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bull",
    "score": 78
   },
   "flow": {
    "stance": "neu",
    "score": 45
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 48,
   "confidence": 42,
   "base": 815000,
   "baseAt": "2026-07-09 종가",
   "target": "컨센서스 목표주가 1,487,692원까지 +83% 상승여력. 지지 814,000원(3개월 저점) / 저항 988,350원(MA20)·1,091,000원(MA60).",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 45
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "HOLD",
   "total": 48,
   "confidence": 40,
   "base": 850000,
   "baseAt": "2026-07-10 10:26",
   "target": "컨센서스 목표주가 1,487,692원까지 +75.0% 상승여력. 지지 814,000원(3개월 저점) / 저항 985,000원대(MA20)·1,089,000원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 48
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 49,
   "confidence": 40,
   "base": 851000,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 1,487,692원까지 +74.8% 상승여력. 지지 814,000원(3개월 저점) / 저항 985,000원대(MA20)·1,089,000원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 47
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 55,
   "confidence": 50,
   "base": 851000,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 1,487,692원까지 +74.8% 상승여력. 지지 814,000원(52주 저점 근접) / 저항 974,400원대(MA20)·1,088,400원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "bull",
    "score": 83
   },
   "flow": {
    "stance": "neu",
    "score": 50
   }
  },
  {
   "date": "2026-07-16 14:52",
   "call": "HOLD",
   "total": 48,
   "confidence": 52,
   "base": 783000,
   "baseAt": "2026-07-16 14:48",
   "target": "목표주가 122만~145만원(대신·유안타, 4~5월 리포트 기준 — 최근 급락 이후 미조정). 지지 783,000원(오늘 3개월 신저가) 하회 시 70만원대 초반 시야 / 저항 908,700원대(MA20)·1,070,367원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 32
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 48
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 49,
   "base": 797000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 1,445,714원 (현재가 대비 +81.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 53
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "005380": [
  {
   "date": "2026-07-09 11:32",
   "call": "HOLD",
   "total": 57,
   "confidence": 58,
   "base": 450500,
   "baseAt": "2026-07-09 11:26",
   "target": "컨센서스 목표주가 812,800원까지 +80% 상승여력. 지지 445,500원(3개월 저점) / 저항 532,900원(MA20).",
   "taro": {
    "stance": "bear",
    "score": 26
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 55
   },
   "flow": {
    "stance": "bull",
    "score": 65
   }
  },
  {
   "date": "2026-07-09 23:15",
   "call": "HOLD",
   "total": 47,
   "confidence": 42,
   "base": 445500,
   "baseAt": "2026-07-09 종가",
   "target": "컨센서스 목표주가 812,800원까지 +82% 상승여력. 지지 445,500원(3개월 신저가) / 저항 532,675원(MA20)·583,708원(MA60).",
   "taro": {
    "stance": "bear",
    "score": 25
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "bull",
    "score": 58
   }
  },
  {
   "date": "2026-07-10 10:44",
   "call": "HOLD",
   "total": 47,
   "confidence": 42,
   "base": 463500,
   "baseAt": "2026-07-10 10:26",
   "target": "컨센서스 목표주가 812,800원까지 +75.4% 상승여력. 지지 445,500원(7/9 신저가) / 저항 533,000원대(MA20)·584,000원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 32
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "bull",
    "score": 56
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 47,
   "confidence": 42,
   "base": 457500,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 812,800원까지 +77.7% 상승여력. 지지 445,500원(7/9 신저가) / 저항 533,000원대(MA20)·584,000원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "bull",
    "score": 56
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 48,
   "confidence": 50,
   "base": 457500,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 812,800원까지 +77.7% 상승여력. 지지 445,500원(52주 저점 근접) / 저항 525,200원대(MA20)·583,358원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 54
   }
  },
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 40,
   "base": 425000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 789,200원 (현재가 대비 +85.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "bull",
    "score": 58
   },
   "tier": "auto"
  }
 ],
 "042700": [
  {
   "date": "2026-07-10 11:14",
   "call": "HOLD",
   "total": 50,
   "confidence": 40,
   "base": 222500,
   "baseAt": "2026-07-10 11:12",
   "target": "컨센서스 목표주가 380,000원까지 +70.8% 상승여력. 지지 199,200원(7/8 저점) / 저항 262,600원대(MA20)·303,800원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "neu",
    "score": 45
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "bull",
    "score": 60
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 50,
   "confidence": 40,
   "base": 222000,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 380,000원까지 +71.2% 상승여력. 지지 199,200원(7/8 저점) / 저항 262,900원대(MA20)·303,600원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "neu",
    "score": 45
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "bull",
    "score": 60
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 49,
   "confidence": 44,
   "base": 222000,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 380,000원까지 +71.2% 상승여력. 지지 199,200원(7/8 저점, 3개월 저점) / 저항 262,610원대(MA20)·303,795원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 28
   },
   "diana": {
    "stance": "neu",
    "score": 42
   },
   "nova": {
    "stance": "bull",
    "score": 81
   },
   "flow": {
    "stance": "neu",
    "score": 48
   }
  },
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 66,
   "base": 242500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 380,000원 (현재가 대비 +56.7% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 51
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "bull",
    "score": 64
   },
   "tier": "auto"
  }
 ],
 "010120": [
  {
   "date": "2026-07-10 11:14",
   "call": "HOLD",
   "total": 55,
   "confidence": 48,
   "base": 202000,
   "baseAt": "2026-07-10 11:12",
   "target": "컨센서스 목표주가 268,846원까지 +33.1% 상승여력. 지지 183,500원(7/8 저점) / 저항 229,300원대(MA20)·241,300원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bull",
    "score": 70
   },
   "flow": {
    "stance": "neu",
    "score": 48
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 55,
   "confidence": 48,
   "base": 202500,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 268,846원까지 +32.8% 상승여력. 지지 183,500원(7/8 저점) / 저항 229,300원대(MA20)·241,300원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bull",
    "score": 70
   },
   "flow": {
    "stance": "neu",
    "score": 48
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 55,
   "confidence": 46,
   "base": 202500,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 268,846원까지 +32.8% 상승여력(일부 증권사는 33만원 제시). 지지 183,500원(7/8 저점) / 저항 229,320원대(MA20)·241,325원대(MA60).",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bull",
    "score": 79
   },
   "flow": {
    "stance": "neu",
    "score": 56
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 55,
   "base": 190000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 266,000원 (현재가 대비 +40.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "007660": [
  {
   "date": "2026-07-10 11:14",
   "call": "HOLD",
   "total": 58,
   "confidence": 50,
   "base": 104200,
   "baseAt": "2026-07-10 11:12",
   "target": "컨센서스 목표주가 179,615원까지 +72.4% 상승여력. 지지 87,800원(7/8 저점) / 저항 111,200원대(MA20)·126,100원대(MA60).",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bull",
    "score": 68
   },
   "flow": {
    "stance": "bear",
    "score": 40
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "HOLD",
   "total": 60,
   "confidence": 52,
   "base": 103800,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 179,615원까지 +73.0% 상승여력. 지지 87,800원(7/8 저점) / 저항 111,300원대(MA20)·126,100원대(MA60).",
   "taro": {
    "stance": "neu",
    "score": 52
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bull",
    "score": 70
   },
   "flow": {
    "stance": "bear",
    "score": 42
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 55,
   "confidence": 48,
   "base": 103800,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 179,615원까지 +73.0% 상승여력(증권가 적정가치 12.6만~16.2만원 병행 제시). 지지 87,800원(3개월 저점) / 저항 111,185원대(MA20)·126,108원대(MA60).",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bull",
    "score": 77
   },
   "flow": {
    "stance": "neu",
    "score": 44
   }
  },
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 34,
   "confidence": 49,
   "base": 92000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 177,917원 (현재가 대비 +93.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 53
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "bear",
    "score": 40
   },
   "tier": "auto"
  }
 ],
 "017670": [
  {
   "date": "2026-07-10 11:14",
   "call": "HOLD",
   "total": 62,
   "confidence": 58,
   "base": 88900,
   "baseAt": "2026-07-10 11:12",
   "target": "컨센서스 목표주가 116,667원까지 +31.2% 상승여력. 지지 84,000원(7/8 저점) / 저항 91,200원대(MA20)·97,700원대(MA60).",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bull",
    "score": 72
   },
   "nova": {
    "stance": "bull",
    "score": 66
   },
   "flow": {
    "stance": "bull",
    "score": 62
   }
  },
  {
   "date": "2026-07-10 15:47",
   "call": "BUY",
   "total": 63,
   "confidence": 60,
   "base": 88700,
   "baseAt": "2026-07-10 종가",
   "target": "컨센서스 목표주가 116,667원까지 +31.5% 상승여력. 지지 84,000원(7/8 저점) / 저항 91,300원대(MA20)·97,800원대(MA60).",
   "taro": {
    "stance": "neu",
    "score": 52
   },
   "diana": {
    "stance": "bull",
    "score": 72
   },
   "nova": {
    "stance": "bull",
    "score": 64
   },
   "flow": {
    "stance": "bull",
    "score": 62
   }
  },
  {
   "date": "2026-07-11 10:39",
   "call": "HOLD",
   "total": 54,
   "confidence": 46,
   "base": 88700,
   "baseAt": "2026-07-11 종가",
   "target": "목표주가 116,667원까지 +31.5% 상승여력. 지지 84,000원(3개월 저점) / 저항 91,210원대(MA20)·97,712원대(MA60).",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "bull",
    "score": 60
   }
  },
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 79,
   "base": 89700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 117,444원 (현재가 대비 +30.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "bull",
    "score": 60
   },
   "tier": "auto"
  }
 ],
 "035420": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 44,
   "base": 190000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 330,143원 (현재가 대비 +73.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 26
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "bull",
    "score": 61
   },
   "tier": "auto"
  }
 ],
 "035720": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 61,
   "base": 35900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 63,063원 (현재가 대비 +75.7% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "neu",
    "score": 49
   },
   "flow": {
    "stance": "bull",
    "score": 76
   },
   "tier": "auto"
  }
 ],
 "000270": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 66,
   "confidence": 49,
   "base": 149700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 232,174원 (현재가 대비 +55.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 91
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "bull",
    "score": 58
   },
   "tier": "auto"
  }
 ],
 "105560": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 68,
   "confidence": 57,
   "base": 181100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 220,842원 (현재가 대비 +21.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 86
   },
   "diana": {
    "stance": "bull",
    "score": 74
   },
   "nova": {
    "stance": "neu",
    "score": 55
   },
   "flow": {
    "stance": "neu",
    "score": 56
   },
   "tier": "auto"
  }
 ],
 "247540": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 66,
   "base": 112400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 248,722원 (현재가 대비 +121.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 41
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "373220": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 77,
   "base": 334000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 549,591원 (현재가 대비 +64.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "032830": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 44,
   "base": 331000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 408,607원 (현재가 대비 +23.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "207940": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 75,
   "base": 1396000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 2,057,368원 (현재가 대비 +47.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 62
   },
   "diana": {
    "stance": "neu",
    "score": 49
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "028260": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 40,
   "base": 346000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 585,385원 (현재가 대비 +69.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "329180": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 40,
   "base": 484000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 911,524원 (현재가 대비 +88.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "055550": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 70,
   "confidence": 65,
   "base": 107900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 134,263원 (현재가 대비 +24.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 80
   },
   "diana": {
    "stance": "bull",
    "score": 79
   },
   "nova": {
    "stance": "neu",
    "score": 57
   },
   "flow": {
    "stance": "bull",
    "score": 63
   },
   "tier": "auto"
  }
 ],
 "034020": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 32,
   "confidence": 59,
   "base": 69700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 150,200원 (현재가 대비 +115.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 41
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "bear",
    "score": 43
   },
   "tier": "auto"
  }
 ],
 "012450": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 42,
   "base": 943000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 1,736,111원 (현재가 대비 +84.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 18
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "034730": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 40,
   "base": 580000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 853,692원 (현재가 대비 +47.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 22
   },
   "diana": {
    "stance": "bull",
    "score": 72
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "012330": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 48,
   "base": 482000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 774,800원 (현재가 대비 +60.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "068270": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 76,
   "base": 175800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 265,398원 (현재가 대비 +51.0% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "neu",
    "score": 51
   },
   "nova": {
    "stance": "neu",
    "score": 49
   },
   "flow": {
    "stance": "bull",
    "score": 60
   },
   "tier": "auto"
  }
 ],
 "086790": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 74,
   "confidence": 59,
   "base": 136800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 161,950원 (현재가 대비 +18.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 89
   },
   "diana": {
    "stance": "bull",
    "score": 84
   },
   "nova": {
    "stance": "bull",
    "score": 61
   },
   "flow": {
    "stance": "bull",
    "score": 60
   },
   "tier": "auto"
  }
 ],
 "006400": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 76,
   "base": 434500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 802,130원 (현재가 대비 +84.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "neu",
    "score": 49
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "066570": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 48,
   "base": 179000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 218,250원 (현재가 대비 +21.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "neu",
    "score": 53
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "bull",
    "score": 60
   },
   "tier": "auto"
  }
 ],
 "000810": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 65,
   "confidence": 51,
   "base": 701000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 721,882원 (현재가 대비 +3.0% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 87
   },
   "diana": {
    "stance": "neu",
    "score": 55
   },
   "nova": {
    "stance": "bull",
    "score": 68
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "298040": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 52,
   "base": 2789000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 4,635,714원 (현재가 대비 +66.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 49
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "042660": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 40,
   "base": 86700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 150,905원 (현재가 대비 +74.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 55
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "005490": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 66,
   "base": 311500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 535,544원 (현재가 대비 +71.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "009540": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 47,
   "base": 354000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 583,667원 (현재가 대비 +64.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 51
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "006800": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 42,
   "base": 40050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 68,125원 (현재가 대비 +70.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "015760": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 40,
   "base": 34050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 56,267원 (현재가 대비 +65.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bull",
    "score": 95
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "316140": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 66,
   "confidence": 49,
   "base": 31500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 43,650원 (현재가 대비 +38.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 66
   },
   "diana": {
    "stance": "bull",
    "score": 89
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "bull",
    "score": 60
   },
   "tier": "auto"
  }
 ],
 "000150": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 33,
   "confidence": 52,
   "base": 1202000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 2,305,385원 (현재가 대비 +91.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 41
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "010130": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 59,
   "base": 1029000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 1,764,500원 (현재가 대비 +71.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 69
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "010140": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 69,
   "base": 22300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 39,750원 (현재가 대비 +78.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 59
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "064350": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 40,
   "base": 159000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 308,368원 (현재가 대비 +93.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "138040": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 72,
   "confidence": 61,
   "base": 118300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 148,000원 (현재가 대비 +25.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 82
   },
   "diana": {
    "stance": "bull",
    "score": 86
   },
   "nova": {
    "stance": "bull",
    "score": 60
   },
   "flow": {
    "stance": "bull",
    "score": 59
   },
   "tier": "auto"
  }
 ],
 "051910": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 68,
   "base": 260500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 449,929원 (현재가 대비 +72.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "011200": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 64,
   "confidence": 63,
   "base": 20050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 22,700원 (현재가 대비 +13.2% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 65
   },
   "diana": {
    "stance": "bull",
    "score": 67
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "bull",
    "score": 75
   },
   "tier": "auto"
  }
 ],
 "033780": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 74,
   "base": 179900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 229,286원 (현재가 대비 +27.5% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 65
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "096770": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 66,
   "confidence": 60,
   "base": 121400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 172,818원 (현재가 대비 +42.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 85
   },
   "diana": {
    "stance": "bull",
    "score": 63
   },
   "nova": {
    "stance": "bull",
    "score": 61
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "024110": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 70,
   "confidence": 59,
   "base": 21600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 27,714원 (현재가 대비 +28.3% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 74
   },
   "diana": {
    "stance": "bull",
    "score": 83
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "bull",
    "score": 67
   },
   "tier": "auto"
  }
 ],
 "079550": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 70,
   "base": 749000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 1,153,889원 (현재가 대비 +54.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "neu",
    "score": 49
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "267250": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 52,
   "base": 204500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 382,000원 (현재가 대비 +86.8% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 45
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "018260": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 72,
   "base": 199300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 256,636원 (현재가 대비 +28.8% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 61
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "003550": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 62,
   "base": 98800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 144,909원 (현재가 대비 +46.7% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 47
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "010950": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 70,
   "confidence": 62,
   "base": 144900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 156,059원 (현재가 대비 +7.7% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 86
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bull",
    "score": 67
   },
   "flow": {
    "stance": "bull",
    "score": 60
   },
   "tier": "auto"
  }
 ],
 "086280": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 57,
   "confidence": 40,
   "base": 188600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 322,588원 (현재가 대비 +71.0% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 44
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "047810": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 73,
   "base": 149200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 215,813원 (현재가 대비 +44.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 58
   },
   "diana": {
    "stance": "bear",
    "score": 43
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "278470": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 71,
   "base": 393000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 530,526원 (현재가 대비 +35.0% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 63
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "neu",
    "score": 53
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "030200": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 40,
   "base": 52400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 75,111원 (현재가 대비 +43.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bull",
    "score": 90
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "272210": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 63,
   "base": 65500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 130,333원 (현재가 대비 +99.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 32
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "307950": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 55,
   "base": 393000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 676,563원 (현재가 대비 +72.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "000720": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 44,
   "base": 99000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 208,632원 (현재가 대비 +110.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "005940": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 63,
   "confidence": 50,
   "base": 31000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 42,750원 (현재가 대비 +37.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 84
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "bull",
    "score": 61
   },
   "tier": "auto"
  }
 ],
 "259960": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 58,
   "base": 240500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 379,444원 (현재가 대비 +57.8% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 62
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "neu",
    "score": 55
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "323410": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 73,
   "base": 23000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 29,792원 (현재가 대비 +29.5% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 68
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 53
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "006260": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 42,
   "base": 288000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 610,182원 (현재가 대비 +111.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "005830": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 70,
   "confidence": 51,
   "base": 163000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 219,938원 (현재가 대비 +34.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 85
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "neu",
    "score": 56
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "016360": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 40,
   "base": 107700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 165,611원 (현재가 대비 +53.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bull",
    "score": 87
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 55
   },
   "tier": "auto"
  }
 ],
 "003490": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 62,
   "base": 26500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 36,545원 (현재가 대비 +37.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "bull",
    "score": 66
   },
   "tier": "auto"
  }
 ],
 "352820": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 77,
   "base": 208500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 365,000원 (현재가 대비 +75.1% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "neu",
    "score": 45
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "180640": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 69,
   "base": 113500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 27
   },
   "diana": {
    "stance": "bear",
    "score": 40
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "161390": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 72,
   "confidence": 55,
   "base": 73600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 85,500원 (현재가 대비 +16.2% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 87
   },
   "diana": {
    "stance": "bull",
    "score": 83
   },
   "nova": {
    "stance": "bull",
    "score": 62
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "443060": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 60,
   "base": 201000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 324,900원 (현재가 대비 +61.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 25
   },
   "diana": {
    "stance": "neu",
    "score": 53
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "039490": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 57,
   "confidence": 40,
   "base": 322000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 537,824원 (현재가 대비 +67.0% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "047050": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 51,
   "base": 50900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 97,429원 (현재가 대비 +91.4% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "028050": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 40,
   "base": 40850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 67,079원 (현재가 대비 +64.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "bull",
    "score": 64
   },
   "tier": "auto"
  }
 ],
 "003230": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 49,
   "base": 1069000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 1,856,429원 (현재가 대비 +73.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 25
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "078930": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 72,
   "confidence": 51,
   "base": 82800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 98,000원 (현재가 대비 +18.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 90
   },
   "diana": {
    "stance": "bull",
    "score": 84
   },
   "nova": {
    "stance": "bull",
    "score": 61
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "090430": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 60,
   "base": 124400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 167,667원 (현재가 대비 +34.8% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 82
   },
   "diana": {
    "stance": "neu",
    "score": 57
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "neu",
    "score": 56
   },
   "tier": "auto"
  }
 ],
 "326030": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 47,
   "base": 79400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 147,273원 (현재가 대비 +85.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 23
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "021240": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 70,
   "confidence": 64,
   "base": 96700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 125,000원 (현재가 대비 +29.3% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 80
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "bull",
    "score": 63
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "032640": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 56,
   "base": 14620,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 19,941원 (현재가 대비 +36.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 59
   },
   "diana": {
    "stance": "bull",
    "score": 79
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "241560": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 57,
   "base": 64300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 91,071원 (현재가 대비 +41.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 80
   },
   "nova": {
    "stance": "neu",
    "score": 49
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "353200": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 60,
   "base": 138000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 203,214원 (현재가 대비 +47.3% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 66
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "bear",
    "score": 38
   },
   "tier": "auto"
  }
 ],
 "004170": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 59,
   "base": 589000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 839,444원 (현재가 대비 +42.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 26
   },
   "diana": {
    "stance": "neu",
    "score": 55
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "196170": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 53,
   "base": 276500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 537,500원 (현재가 대비 +94.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 49
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "086520": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 72,
   "base": 80000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 40
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "036930": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 68,
   "base": 187900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 189,500원 (현재가 대비 +0.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "bear",
    "score": 34
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "277810": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 51,
   "base": 397000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 915,000원 (현재가 대비 +130.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "240810": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 72,
   "base": 140700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 176,200원 (현재가 대비 +25.2% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 49
   },
   "diana": {
    "stance": "bear",
    "score": 38
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "bear",
    "score": 38
   },
   "tier": "auto"
  }
 ],
 "058470": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 69,
   "base": 72300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 136,000원 (현재가 대비 +88.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "neu",
    "score": 53
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "319660": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 40,
   "base": 195400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 179,143원 (현재가 대비 -8.3% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 87
   },
   "diana": {
    "stance": "bear",
    "score": 35
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "bear",
    "score": 38
   },
   "tier": "auto"
  }
 ],
 "028300": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 28,
   "confidence": 56,
   "base": 35300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "bear",
    "score": 20
   },
   "tier": "auto"
  }
 ],
 "000250": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 68,
   "base": 184100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 34
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "039030": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 53,
   "base": 344000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 575,000원 (현재가 대비 +67.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 49
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "222800": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 69,
   "base": 107400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 171,250원 (현재가 대비 +59.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 27
   },
   "diana": {
    "stance": "bear",
    "score": 39
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "298380": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 45,
   "base": 75600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 220,000원 (현재가 대비 +191.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "141080": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 45,
   "base": 103700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 224,000원 (현재가 대비 +116.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "084370": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 72,
   "base": 146800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 156,667원 (현재가 대비 +6.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 34
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "403870": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 55,
   "base": 42500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 68,000원 (현재가 대비 +60.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "neu",
    "score": 49
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "095610": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 40,
   "base": 194300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 188,571원 (현재가 대비 -2.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 88
   },
   "diana": {
    "stance": "bear",
    "score": 31
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "bear",
    "score": 38
   },
   "tier": "auto"
  }
 ],
 "214450": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 73,
   "base": 336500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 494,000원 (현재가 대비 +46.8% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 53
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bull",
    "score": 59
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "095340": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 71,
   "base": 145000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 291,429원 (현재가 대비 +101.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "214150": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 49,
   "base": 44100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 76,867원 (현재가 대비 +74.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 25
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "310210": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 48,
   "base": 145600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 450,000원 (현재가 대비 +209.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "178320": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 33,
   "confidence": 52,
   "base": 39300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 72,250원 (현재가 대비 +83.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "bear",
    "score": 40
   },
   "tier": "auto"
  }
 ],
 "131290": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 61,
   "confidence": 43,
   "base": 282500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 336,667원 (현재가 대비 +19.2% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 92
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "bull",
    "score": 59
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "145020": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 58,
   "base": 239500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 378,462원 (현재가 대비 +58.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "067310": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 40,
   "base": 35750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 58,750원 (현재가 대비 +64.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "bear",
    "score": 37
   },
   "tier": "auto"
  }
 ],
 "064760": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 43,
   "base": 215000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 385,000원 (현재가 대비 +79.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 59
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "237690": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 80,
   "base": 124300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 204,071원 (현재가 대비 +64.2% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "257720": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 49,
   "base": 36050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 55,500원 (현재가 대비 +54.0% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 60
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "357780": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 49,
   "base": 291500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 549,250원 (현재가 대비 +88.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "neu",
    "score": 56
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "005290": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 45,
   "base": 43600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 57
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "263750": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 48,
   "base": 34150,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 70,778원 (현재가 대비 +107.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 77
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "098460": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 54,
   "base": 26400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 48,417원 (현재가 대비 +83.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bear",
    "score": 41
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "131970": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 52,
   "base": 86900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 190,857원 (현재가 대비 +119.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "087010": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 33,
   "confidence": 53,
   "base": 119200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "290650": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 58,
   "base": 71000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "003670": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 41,
   "confidence": 73,
   "base": 147600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 252,222원 (현재가 대비 +70.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "neu",
    "score": 45
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "071050": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 40,
   "base": 229000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 346,500원 (현재가 대비 +51.3% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 59
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "047040": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 43,
   "base": 15150,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 30,556원 (현재가 대비 +101.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "bull",
    "score": 73
   },
   "tier": "auto"
  }
 ],
 "064400": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 40,
   "base": 65000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 100,700원 (현재가 대비 +54.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "000880": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 40,
   "base": 93200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 174,111원 (현재가 대비 +86.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "267270": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 53,
   "base": 130300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 216,167원 (현재가 대비 +65.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "001440": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 71,
   "base": 27700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 53,500원 (현재가 대비 +93.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "bear",
    "score": 40
   },
   "tier": "auto"
  }
 ],
 "062040": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 49,
   "base": 170000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 332,750원 (현재가 대비 +95.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 53
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "029780": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 42,
   "base": 47050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 63,667원 (현재가 대비 +35.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "034220": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 49,
   "base": 10410,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 17,813원 (현재가 대비 +71.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 19
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "bear",
    "score": 34
   },
   "tier": "auto"
  }
 ],
 "009830": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 31,
   "confidence": 44,
   "base": 27600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 53,770원 (현재가 대비 +94.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "bear",
    "score": 24
   },
   "tier": "auto"
  }
 ],
 "000100": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 82,
   "base": 70800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 126,818원 (현재가 대비 +79.1% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "271560": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 40,
   "base": 128400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 178,846원 (현재가 대비 +39.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bull",
    "score": 79
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "036570": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 40,
   "base": 223000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 373,235원 (현재가 대비 +67.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "000990": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 41,
   "confidence": 40,
   "base": 109600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 196,000원 (현재가 대비 +78.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 55
   },
   "tier": "auto"
  }
 ],
 "377300": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 81,
   "base": 40900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 91,250원 (현재가 대비 +123.1% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "128940": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 54,
   "base": 386000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 655,882원 (현재가 대비 +69.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 25
   },
   "diana": {
    "stance": "bull",
    "score": 59
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "175330": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 67,
   "confidence": 50,
   "base": 27400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 37,556원 (현재가 대비 +37.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 79
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "454910": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 52,
   "base": 67000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 145,000원 (현재가 대비 +116.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "011790": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 52,
   "base": 85200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 130,000원 (현재가 대비 +52.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "023530": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 40,
   "base": 140800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 227,500원 (현재가 대비 +61.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "000500": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 70,
   "base": 196700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "bear",
    "score": 37
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "001040": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 40,
   "base": 135700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 251,222원 (현재가 대비 +85.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "066970": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 75,
   "base": 92000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 246,250원 (현재가 대비 +167.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 44
   },
   "tier": "auto"
  }
 ],
 "088350": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 65,
   "confidence": 46,
   "base": 4540,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 6,267원 (현재가 대비 +38.0% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 55
   },
   "diana": {
    "stance": "bull",
    "score": 86
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "bull",
    "score": 76
   },
   "tier": "auto"
  }
 ],
 "052690": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 71,
   "base": 92700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 203,818원 (현재가 대비 +119.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 33
   },
   "diana": {
    "stance": "bear",
    "score": 41
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "002380": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 40,
   "base": 420000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 752,750원 (현재가 대비 +79.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "bull",
    "score": 95
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "082740": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 62,
   "base": 46900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 98,500원 (현재가 대비 +110.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "bear",
    "score": 40
   },
   "tier": "auto"
  }
 ],
 "111770": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 71,
   "confidence": 50,
   "base": 86900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 120,556원 (현재가 대비 +38.7% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 83
   },
   "diana": {
    "stance": "bull",
    "score": 89
   },
   "nova": {
    "stance": "bull",
    "score": 60
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "018880": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 51,
   "base": 3490,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 5,062원 (현재가 대비 +45.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "neu",
    "score": 57
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "bear",
    "score": 39
   },
   "tier": "auto"
  }
 ],
 "010060": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 67,
   "base": 194300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 395,000원 (현재가 대비 +103.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 37
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "051900": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 72,
   "base": 246500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 268,000원 (현재가 대비 +8.7% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 64
   },
   "diana": {
    "stance": "neu",
    "score": 48
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "069960": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 50,
   "base": 157400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 222,529원 (현재가 대비 +41.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 30
   },
   "diana": {
    "stance": "bull",
    "score": 68
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "004020": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 67,
   "base": 26550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 47,881원 (현재가 대비 +80.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "001450": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 70,
   "confidence": 58,
   "base": 38300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 42,063원 (현재가 대비 +9.8% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 80
   },
   "diana": {
    "stance": "bull",
    "score": 86
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "neu",
    "score": 56
   },
   "tier": "auto"
  }
 ],
 "103590": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 40,
   "base": 59500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 112,667원 (현재가 대비 +89.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "035250": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 50,
   "base": 14410,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 21,100원 (현재가 대비 +46.4% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 49
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "336260": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 51,
   "base": 44550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 76,000원 (현재가 대비 +70.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "251270": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 41,
   "base": 36300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 63,643원 (현재가 대비 +75.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "022100": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 71,
   "base": 18630,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 34
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "036460": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 42,
   "base": 32400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 48,750원 (현재가 대비 +50.5% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "031210": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 61,
   "base": 43100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 56,000원 (현재가 대비 +29.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 77
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "009420": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 74,
   "base": 52800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 82,250원 (현재가 대비 +55.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "bear",
    "score": 39
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "383220": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 50,
   "base": 79000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 98,800원 (현재가 대비 +25.1% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bull",
    "score": 86
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "011780": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 63,
   "confidence": 58,
   "base": 123500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 176,750원 (현재가 대비 +43.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 64
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "neu",
    "score": 56
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "302440": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 62,
   "base": 35450,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 49,000원 (현재가 대비 +38.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 26
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "097950": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 52,
   "base": 184800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 295,833원 (현재가 대비 +60.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 28
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "139130": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 68,
   "confidence": 60,
   "base": 18410,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 24,007원 (현재가 대비 +30.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 77
   },
   "diana": {
    "stance": "bull",
    "score": 84
   },
   "nova": {
    "stance": "neu",
    "score": 57
   },
   "flow": {
    "stance": "neu",
    "score": 56
   },
   "tier": "auto"
  }
 ],
 "028670": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 65,
   "confidence": 46,
   "base": 5160,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 7,554원 (현재가 대비 +46.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 63
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "bull",
    "score": 63
   },
   "tier": "auto"
  }
 ],
 "012750": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 68,
   "base": 72100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 94,000원 (현재가 대비 +30.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 58
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "014680": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 45,
   "base": 244500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 402,500원 (현재가 대비 +64.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 22
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "006360": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 51,
   "base": 27300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 44,882원 (현재가 대비 +64.4% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 50
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "bull",
    "score": 67
   },
   "tier": "auto"
  }
 ],
 "017800": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 66,
   "base": 68900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "450080": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 72,
   "base": 36500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 40
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "011170": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 69,
   "base": 61000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 124,692원 (현재가 대비 +104.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "004800": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 40,
   "base": 143100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 335,000원 (현재가 대비 +134.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "005850": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 40,
   "base": 54400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 92,000원 (현재가 대비 +69.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 22
   },
   "diana": {
    "stance": "bull",
    "score": 91
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "026960": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 73,
   "base": 25500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 65
   },
   "diana": {
    "stance": "neu",
    "score": 57
   },
   "nova": {
    "stance": "neu",
    "score": 53
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "001720": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 50,
   "base": 149400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "161890": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 67,
   "base": 107600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 132,526원 (현재가 대비 +23.2% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 67
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 55
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "085620": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 49,
   "base": 16760,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 14,000원 (현재가 대비 -16.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 15
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "483650": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 69,
   "base": 208500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 299,615원 (현재가 대비 +43.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "neu",
    "score": 57
   },
   "nova": {
    "stance": "neu",
    "score": 56
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "009970": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 63,
   "confidence": 62,
   "base": 191200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 76
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "neu",
    "score": 53
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "375500": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 40,
   "base": 60200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 105,176원 (현재가 대비 +74.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 91
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "003690": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 61,
   "base": 13660,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 16,333원 (현재가 대비 +19.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 67
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "000240": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 61,
   "confidence": 60,
   "base": 25250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 33,000원 (현재가 대비 +30.7% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 66
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "081660": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 68,
   "confidence": 54,
   "base": 46950,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 59,111원 (현재가 대비 +25.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 86
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bull",
    "score": 60
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "004990": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 59,
   "base": 22800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 36,500원 (현재가 대비 +60.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 24
   },
   "diana": {
    "stance": "neu",
    "score": 53
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "204320": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 40,
   "base": 44800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 75,111원 (현재가 대비 +67.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 18
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "489790": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 69,
   "base": 45800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 109,333원 (현재가 대비 +138.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 33
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "008930": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 57,
   "confidence": 63,
   "base": 32700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 75
   },
   "diana": {
    "stance": "neu",
    "score": 53
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "139480": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 59,
   "base": 79700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 121,667원 (현재가 대비 +52.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "073240": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 40,
   "base": 5850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 8,330원 (현재가 대비 +42.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 74
   },
   "diana": {
    "stance": "bull",
    "score": 95
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "bear",
    "score": 42
   },
   "tier": "auto"
  }
 ],
 "279570": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 69,
   "confidence": 61,
   "base": 6390,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 7,500원 (현재가 대비 +17.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 85
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bull",
    "score": 65
   },
   "flow": {
    "stance": "bull",
    "score": 69
   },
   "tier": "auto"
  }
 ],
 "005440": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 40,
   "base": 13950,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 19,750원 (현재가 대비 +41.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 89
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "007070": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 63,
   "confidence": 58,
   "base": 26400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 31,769원 (현재가 대비 +20.3% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 82
   },
   "diana": {
    "stance": "bull",
    "score": 63
   },
   "nova": {
    "stance": "neu",
    "score": 56
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "004370": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 54,
   "base": 349500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 541,667원 (현재가 대비 +55.0% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 58
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "030000": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 52,
   "base": 18610,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 25,400원 (현재가 대비 +36.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "282330": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 63,
   "confidence": 55,
   "base": 126400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 174,357원 (현재가 대비 +37.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 66
   },
   "diana": {
    "stance": "bull",
    "score": 83
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "007340": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 65,
   "confidence": 58,
   "base": 40800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 55,000원 (현재가 대비 +34.8% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 74
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "071970": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 50,
   "base": 57600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 125,167원 (현재가 대비 +117.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "051600": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 52,
   "base": 43550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 69,818원 (현재가 대비 +60.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "462870": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 44,
   "base": 32450,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 46,000원 (현재가 대비 +41.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 84
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "018670": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 41,
   "base": 222000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 367,000원 (현재가 대비 +65.3% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 91
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "008770": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 58,
   "base": 47800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 75,538원 (현재가 대비 +58.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 24
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "192820": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 63,
   "confidence": 62,
   "base": 181100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 247,389원 (현재가 대비 +36.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 77
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "281820": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 59,
   "base": 100800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 127,000원 (현재가 대비 +26.0% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 68
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "bear",
    "score": 39
   },
   "tier": "auto"
  }
 ],
 "457190": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 69,
   "base": 58500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "020150": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 44,
   "base": 32250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 82,009원 (현재가 대비 +154.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "002790": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 61,
   "confidence": 63,
   "base": 25000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 78
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 56
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "439260": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 40,
   "base": 45750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 122,000원 (현재가 대비 +166.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "103140": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 40,
   "base": 62100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 123,078원 (현재가 대비 +98.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "007810": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 43,
   "base": 70300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 156,667원 (현재가 대비 +122.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 59
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "bear",
    "score": 43
   },
   "tier": "auto"
  }
 ],
 "001740": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 40,
   "base": 7990,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 9,350원 (현재가 대비 +17.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 15
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "bull",
    "score": 64
   },
   "tier": "auto"
  }
 ],
 "000120": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 42,
   "base": 72500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 132,750원 (현재가 대비 +83.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "011210": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 58,
   "base": 57600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 94,273원 (현재가 대비 +63.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "112610": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 68,
   "base": 39850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 77,889원 (현재가 대비 +95.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "120110": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 40,
   "base": 53600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 113,000원 (현재가 대비 +110.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 18
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "001800": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 72,
   "base": 26050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 67
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "023590": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 51,
   "base": 35650,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 45
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "097230": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 40,
   "base": 15560,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 37,000원 (현재가 대비 +137.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "069620": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 61,
   "confidence": 42,
   "base": 121900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 209,000원 (현재가 대비 +71.5% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "006040": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 44,
   "base": 33350,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 49,333원 (현재가 대비 +47.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 59
   },
   "diana": {
    "stance": "bull",
    "score": 91
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "020560": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 75,
   "base": 7080,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bear",
    "score": 38
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "093370": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 34,
   "confidence": 52,
   "base": 11690,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 20,000원 (현재가 대비 +71.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "bear",
    "score": 41
   },
   "tier": "auto"
  }
 ],
 "475150": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 61,
   "confidence": 40,
   "base": 52000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 57,250원 (현재가 대비 +10.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 89
   },
   "diana": {
    "stance": "bear",
    "score": 35
   },
   "nova": {
    "stance": "neu",
    "score": 57
   },
   "flow": {
    "stance": "bull",
    "score": 64
   },
   "tier": "auto"
  }
 ],
 "006280": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 76,
   "base": 122800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 210,833원 (현재가 대비 +71.7% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "001120": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 50,
   "base": 36800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 67,667원 (현재가 대비 +83.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 46
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "229640": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 44,
   "base": 43050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 79,750원 (현재가 대비 +85.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "003540": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 40,
   "base": 25850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 41,667원 (현재가 대비 +61.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "005070": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 72,
   "base": 37500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 61,500원 (현재가 대비 +64.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "192080": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 40,
   "base": 61600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 82,500원 (현재가 대비 +33.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 87
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "322000": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 56,
   "base": 110100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 267,500원 (현재가 대비 +143.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 33
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "017960": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 40,
   "base": 23450,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 57,667원 (현재가 대비 +145.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "007310": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 79,
   "base": 313000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 49
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "181710": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 57,
   "confidence": 55,
   "base": 37400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 54,667원 (현재가 대비 +46.2% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 59
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "298020": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 62,
   "base": 278000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 597,500원 (현재가 대비 +114.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 45
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "361610": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 65,
   "base": 14260,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 25,667원 (현재가 대비 +80.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "012630": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 51,
   "base": 20400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 35,000원 (현재가 대비 +71.6% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "082640": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 64,
   "base": 7670,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 9,900원 (현재가 대비 +29.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 63
   },
   "diana": {
    "stance": "bull",
    "score": 71
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "089860": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 72,
   "confidence": 54,
   "base": 36750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 44,778원 (현재가 대비 +21.8% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 86
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bull",
    "score": 71
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "032350": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 40,
   "base": 11560,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 25,667원 (현재가 대비 +122.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 57
   },
   "tier": "auto"
  }
 ],
 "294870": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 44,
   "base": 18030,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 30,385원 (현재가 대비 +68.5% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 44
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "034230": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 40,
   "base": 10190,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 19,417원 (현재가 대비 +90.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "bull",
    "score": 61
   },
   "tier": "auto"
  }
 ],
 "004000": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 46,
   "base": 45650,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 77,500원 (현재가 대비 +69.8% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 55
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "001820": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 48,
   "base": 87000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 40
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "001430": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 59,
   "base": 32500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 64,544원 (현재가 대비 +98.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "030610": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 58,
   "base": 9740,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 44
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "003570": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 60,
   "base": 34550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 77,000원 (현재가 대비 +122.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "300720": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 57,
   "base": 13990,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 19,500원 (현재가 대비 +39.4% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "bull",
    "score": 74
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "077970": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 45,
   "base": 25000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 72,000원 (현재가 대비 +188.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 33
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "000080": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 66,
   "base": 14910,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 23,667원 (현재가 대비 +58.7% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "057050": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 68,
   "base": 87300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 57
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "003530": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 59,
   "base": 4480,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 37
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "bull",
    "score": 62
   },
   "tier": "auto"
  }
 ],
 "195870": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 44,
   "base": 56800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 101,050원 (현재가 대비 +77.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "003090": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 59,
   "base": 16840,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 44
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "280360": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 50,
   "base": 101000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 165,500원 (현재가 대비 +63.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "185750": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 56,
   "base": 68300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 104,286원 (현재가 대비 +52.7% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "000210": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 74,
   "base": 46450,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 82,000원 (현재가 대비 +76.5% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "003240": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 78,
   "base": 866000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 56
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "005300": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 56,
   "base": 99400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 155,909원 (현재가 대비 +56.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 49
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "009450": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 48,
   "base": 62000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 99,500원 (현재가 대비 +60.5% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 47
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "006120": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 52,
   "base": 54500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 83
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "192400": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 53,
   "base": 25550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 35,000원 (현재가 대비 +37.0% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "003470": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 59,
   "base": 4505,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 51
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "006340": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 53,
   "base": 12230,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 72
   },
   "diana": {
    "stance": "bear",
    "score": 37
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "100090": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 40,
   "base": 13340,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 26,167원 (현재가 대비 +96.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 18
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "499790": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 71,
   "base": 40950,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 69,833원 (현재가 대비 +70.5% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 59
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "009240": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 64,
   "base": 35400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 45,000원 (현재가 대비 +27.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 75
   },
   "diana": {
    "stance": "neu",
    "score": 56
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "030190": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 61,
   "confidence": 51,
   "base": 13940,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 20,000원 (현재가 대비 +43.5% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 60
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "036530": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 56,
   "base": 52000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 83,000원 (현재가 대비 +59.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 64
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "456040": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 67,
   "base": 89800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 159,333원 (현재가 대비 +77.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "071320": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 40,
   "base": 64800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 130,000원 (현재가 대비 +100.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 29
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "137310": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 81,
   "base": 6300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 44
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "214320": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 57,
   "confidence": 40,
   "base": 18300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 25,444원 (현재가 대비 +39.0% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 49
   },
   "diana": {
    "stance": "bull",
    "score": 89
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "004490": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 66,
   "base": 55000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 62
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "079160": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 73,
   "base": 4375,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 6,500원 (현재가 대비 +48.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "neu",
    "score": 49
   },
   "flow": {
    "stance": "bear",
    "score": 43
   },
   "tier": "auto"
  }
 ],
 "003850": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 48,
   "base": 8300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 14,000원 (현재가 대비 +68.7% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "005690": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 54,
   "base": 11090,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 23,500원 (현재가 대비 +111.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "248070": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 71,
   "base": 14810,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 27,600원 (현재가 대비 +86.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "neu",
    "score": 56
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "000370": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 64,
   "confidence": 48,
   "base": 6090,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 8,614원 (현재가 대비 +41.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 60
   },
   "diana": {
    "stance": "bull",
    "score": 89
   },
   "nova": {
    "stance": "neu",
    "score": 49
   },
   "flow": {
    "stance": "neu",
    "score": 56
   },
   "tier": "auto"
  }
 ],
 "285130": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 69,
   "base": 39250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 80,000원 (현재가 대비 +103.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "064960": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 40,
   "base": 25750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 42,600원 (현재가 대비 +65.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "006650": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 40,
   "base": 105400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 215,833원 (현재가 대비 +104.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "002350": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 62,
   "confidence": 43,
   "base": 6750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 9,867원 (현재가 대비 +46.2% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 59
   },
   "diana": {
    "stance": "bull",
    "score": 91
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "075580": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 46,
   "base": 12170,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 22
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "000670": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 76,
   "base": 36400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "093050": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 58,
   "base": 22200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "025540": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 40,
   "base": 64100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 110,000원 (현재가 대비 +71.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 22
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "298050": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 62,
   "base": 150500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 266,000원 (현재가 대비 +76.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "000400": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 68,
   "confidence": 44,
   "base": 2490,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 92
   },
   "diana": {
    "stance": "neu",
    "score": 48
   },
   "nova": {
    "stance": "neu",
    "score": 54
   },
   "flow": {
    "stance": "bull",
    "score": 76
   },
   "tier": "auto"
  }
 ],
 "108320": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 49,
   "base": 39250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 60,000원 (현재가 대비 +52.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "090460": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 40,
   "base": 17740,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 43,200원 (현재가 대비 +143.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bull",
    "score": 91
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "002960": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 70,
   "base": 501000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 64
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "114090": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 40,
   "base": 9330,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 15,091원 (현재가 대비 +61.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "001570": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 68,
   "base": 9900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 62
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "317450": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 58,
   "base": 42550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "069260": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 55,
   "base": 15450,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 26,000원 (현재가 대비 +68.3% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 55
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "005090": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 50,
   "base": 38500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 81,667원 (현재가 대비 +112.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "002990": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 57,
   "base": 10900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 5,650원 (현재가 대비 -48.2% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 58
   },
   "diana": {
    "stance": "bull",
    "score": 68
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "bear",
    "score": 41
   },
   "tier": "auto"
  }
 ],
 "003160": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 52,
   "base": 21250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 44,500원 (현재가 대비 +109.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "005880": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 40,
   "base": 1856,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 2,680원 (현재가 대비 +44.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bull",
    "score": 87
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 55
   },
   "tier": "auto"
  }
 ],
 "010780": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 40,
   "base": 18510,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 44,000원 (현재가 대비 +137.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "006380": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 58,
   "base": 3660,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 62
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "005180": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 68,
   "base": 64700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 49
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "453340": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 68,
   "confidence": 50,
   "base": 18430,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 25,000원 (현재가 대비 +35.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 80
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "neu",
    "score": 55
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "001680": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 76,
   "base": 17260,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 34,500원 (현재가 대비 +99.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 50
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "007700": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 61,
   "base": 14800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "033240": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 40,
   "base": 24850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 62,000원 (현재가 대비 +149.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 86
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "383800": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 59,
   "confidence": 52,
   "base": 7670,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 12,500원 (현재가 대비 +63.0% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 58
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "003620": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 63,
   "base": 2860,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 45
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "001270": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 66,
   "base": 53800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "014820": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 61,
   "base": 19680,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "001060": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 40,
   "base": 24250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 26
   },
   "diana": {
    "stance": "bull",
    "score": 74
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "017940": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 64,
   "confidence": 56,
   "base": 87100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 145,000원 (현재가 대비 +66.5% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 72
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "002840": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 75,
   "base": 123900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 62
   },
   "diana": {
    "stance": "bull",
    "score": 63
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "001510": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 56,
   "base": 2260,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "bull",
    "score": 66
   },
   "tier": "auto"
  }
 ],
 "002020": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 47,
   "base": 33850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 100,000원 (현재가 대비 +195.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "006110": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 79,
   "base": 35800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bear",
    "score": 38
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "bear",
    "score": 41
   },
   "tier": "auto"
  }
 ],
 "178920": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 54,
   "base": 18990,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 33,750원 (현재가 대비 +77.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "000640": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 49,
   "base": 81900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 150,000원 (현재가 대비 +83.2% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "336370": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 40,
   "base": 7200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 18,667원 (현재가 대비 +159.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "100840": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 40,
   "base": 24750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 61,000원 (현재가 대비 +146.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 86
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "003300": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 76,
   "base": 16780,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 62
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "016380": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 42,
   "base": 5110,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 7,500원 (현재가 대비 +46.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "079900": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 46,
   "base": 31950,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 68,500원 (현재가 대비 +114.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "001500": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 56,
   "base": 8040,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "268280": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 65,
   "confidence": 59,
   "base": 112200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 79
   },
   "diana": {
    "stance": "bull",
    "score": 69
   },
   "nova": {
    "stance": "bull",
    "score": 61
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "009410": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 40,
   "base": 1602,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 28
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "039130": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 40,
   "base": 30200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 54,000원 (현재가 대비 +78.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 21
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "058650": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 52,
   "base": 118300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 214,000원 (현재가 대비 +80.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "005810": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 47,
   "base": 33500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 50,500원 (현재가 대비 +50.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "249420": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 40,
   "base": 14230,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 38,000원 (현재가 대비 +167.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 15
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "020000": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 59,
   "confidence": 43,
   "base": 21650,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 36,200원 (현재가 대비 +67.2% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 55
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "001530": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 73,
   "base": 23650,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 40,000원 (현재가 대비 +69.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "377740": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 72,
   "base": 4700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 62
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "284740": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 61,
   "base": 21250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 50
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "002240": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 69,
   "base": 17090,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "145990": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 70,
   "base": 45200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 64
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "005250": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 78,
   "base": 9630,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "161000": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 73,
   "base": 9030,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 37
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "008060": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 41,
   "confidence": 49,
   "base": 14620,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 19
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "000070": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 74,
   "base": 56400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 60
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "031430": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 40,
   "base": 11700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 19,500원 (현재가 대비 +66.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "003030": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 61,
   "base": 99600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 227,500원 (현재가 대비 +128.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 37
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "014830": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 41,
   "base": 62600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 110,333원 (현재가 대비 +76.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "001200": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 55,
   "base": 4280,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 51
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "bull",
    "score": 59
   },
   "tier": "auto"
  }
 ],
 "034310": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 75,
   "base": 11940,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 64
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "019170": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 78,
   "base": 8040,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "460860": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 62,
   "base": 8580,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 16,067원 (현재가 대비 +87.3% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 44
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "072710": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 64,
   "base": 89900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "neu",
    "score": 49
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "004700": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 66,
   "base": 63000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 71
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "neu",
    "score": 49
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "003280": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 64,
   "base": 1783,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "neu",
    "score": 57
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "bear",
    "score": 33
   },
   "tier": "auto"
  }
 ],
 "004690": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 53,
   "base": 114400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 160,000원 (현재가 대비 +39.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "bull",
    "score": 80
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "029530": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 73,
   "base": 41900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "016610": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 57,
   "base": 9240,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "003000": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 76,
   "base": 3905,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "neu",
    "score": 48
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "452260": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 72,
   "base": 1990,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "neu",
    "score": 48
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "bear",
    "score": 32
   },
   "tier": "auto"
  }
 ],
 "016590": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 49,
   "confidence": 72,
   "base": 9430,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 47
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "015360": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 60,
   "base": 14250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "neu",
    "score": 45
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "403550": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 57,
   "base": 9920,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 20,000원 (현재가 대비 +101.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 19
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "009900": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 41,
   "base": 7000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 13,000원 (현재가 대비 +85.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "017900": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 73,
   "base": 5810,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 32
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "bear",
    "score": 35
   },
   "tier": "auto"
  }
 ],
 "005420": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 73,
   "base": 9380,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "381970": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 40,
   "base": 7540,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 16,000원 (현재가 대비 +112.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 22
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "027410": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 59,
   "confidence": 52,
   "base": 3945,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 6,500원 (현재가 대비 +64.8% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 55
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "neu",
    "score": 46
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "006220": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 68,
   "base": 9660,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "037710": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 54,
   "base": 43350,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 52
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "271940": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 76,
   "base": 10000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "950160": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 44,
   "base": 62100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 280,000원 (현재가 대비 +350.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "bull",
    "score": 58
   },
   "tier": "auto"
  }
 ],
 "347850": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 28,
   "confidence": 66,
   "base": 68700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "bear",
    "score": 36
   },
   "tier": "auto"
  }
 ],
 "440110": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 34,
   "confidence": 58,
   "base": 70400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 130,000원 (현재가 대비 +84.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "bear",
    "score": 43
   },
   "tier": "auto"
  }
 ],
 "214370": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 41,
   "confidence": 73,
   "base": 61700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "bear",
    "score": 37
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "108490": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 33,
   "confidence": 52,
   "base": 199900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 398,000원 (현재가 대비 +99.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 39
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "031980": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 58,
   "base": 143400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 191,600원 (현재가 대비 +33.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 77
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "319400": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 32,
   "confidence": 51,
   "base": 19220,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 34
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "089970": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 40,
   "base": 108300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 123,333원 (현재가 대비 +13.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 86
   },
   "diana": {
    "stance": "bear",
    "score": 40
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "bear",
    "score": 38
   },
   "tier": "auto"
  }
 ],
 "226950": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 63,
   "base": 136600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "neu",
    "score": 57
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "420770": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 68,
   "base": 162800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 185,000원 (현재가 대비 +13.6% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 55
   },
   "diana": {
    "stance": "bear",
    "score": 35
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "010170": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 30,
   "confidence": 83,
   "base": 10300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "bear",
    "score": 27
   },
   "tier": "auto"
  }
 ],
 "032820": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 34,
   "confidence": 74,
   "base": 9850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "bear",
    "score": 37
   },
   "tier": "auto"
  }
 ],
 "140860": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 70,
   "base": 258000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 364,143원 (현재가 대비 +41.1% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "068760": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 78,
   "base": 39800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bear",
    "score": 43
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "035900": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 40,
   "base": 46650,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 86,412원 (현재가 대비 +85.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 18
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "041510": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 40,
   "base": 69100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 124,176원 (현재가 대비 +79.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 21
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "140410": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 54,
   "base": 52900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 19
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "183300": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 44,
   "base": 71900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 170,932원 (현재가 대비 +137.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "058610": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 67,
   "base": 66000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 160,000원 (현재가 대비 +142.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "089030": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 51,
   "confidence": 55,
   "base": 49200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bear",
    "score": 34
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "bull",
    "score": 67
   },
   "tier": "auto"
  }
 ],
 "007390": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 56,
   "base": 25000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 64
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "neu",
    "score": 44
   },
   "flow": {
    "stance": "bear",
    "score": 42
   },
   "tier": "auto"
  }
 ],
 "043260": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 40,
   "base": 17830,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 85,000원 (현재가 대비 +376.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "060370": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 73,
   "base": 26800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 44,000원 (현재가 대비 +64.2% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 51
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "096530": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 67,
   "base": 28550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 44,500원 (현재가 대비 +55.9% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 45
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "083650": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 40,
   "base": 42650,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 110,000원 (현재가 대비 +157.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "030530": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 67,
   "base": 16790,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "082920": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 40,
   "base": 28900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 61,500원 (현재가 대비 +112.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "218410": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 48,
   "base": 46250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 132,600원 (현재가 대비 +186.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "458870": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 45,
   "base": 30050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 68,400원 (현재가 대비 +127.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 15
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "127120": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 68,
   "base": 34750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 50
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "078600": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 67,
   "base": 76300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 191,500원 (현재가 대비 +151.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 44
   },
   "tier": "auto"
  }
 ],
 "323280": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 74,
   "base": 36950,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "039200": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 51,
   "base": 30150,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "031330": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 40,
   "base": 10570,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 15
   },
   "diana": {
    "stance": "bull",
    "score": 74
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "003380": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 45,
   "base": 9760,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 16,500원 (현재가 대비 +69.1% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 44
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "195940": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 45,
   "base": 38800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 64,182원 (현재가 대비 +65.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 43
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "347700": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 53,
   "base": 18890,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 50,000원 (현재가 대비 +164.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 32
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 55
   },
   "tier": "auto"
  }
 ],
 "166090": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 60,
   "base": 54600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 106,000원 (현재가 대비 +94.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "437730": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 32,
   "confidence": 51,
   "base": 29000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 34
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "475830": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 32,
   "confidence": 52,
   "base": 45400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "491000": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 68,
   "base": 37850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 120,000원 (현재가 대비 +217.0% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "204270": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 52,
   "base": 15500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 26,000원 (현재가 대비 +67.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "101490": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 41,
   "confidence": 60,
   "base": 43800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "099320": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 69,
   "base": 77900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 160,000원 (현재가 대비 +105.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "085660": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 55,
   "base": 9120,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "083450": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 49,
   "base": 44850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 19
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "293490": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 72,
   "base": 7850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 13,000원 (현재가 대비 +65.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "038500": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 65,
   "base": 7590,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 56
   },
   "tier": "auto"
  }
 ],
 "241710": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 66,
   "confidence": 50,
   "base": 84800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 117,500원 (현재가 대비 +38.6% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 87
   },
   "diana": {
    "stance": "bull",
    "score": 68
   },
   "nova": {
    "stance": "bull",
    "score": 59
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "100790": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 59,
   "base": 14110,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 57
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "232140": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 62,
   "base": 9980,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 22,750원 (현재가 대비 +128.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 56
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "036540": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 72,
   "base": 5620,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 11,000원 (현재가 대비 +95.7% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 49
   },
   "diana": {
    "stance": "neu",
    "score": 54
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "bear",
    "score": 39
   },
   "tier": "auto"
  }
 ],
 "090710": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 34,
   "confidence": 72,
   "base": 6390,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 44
   },
   "tier": "auto"
  }
 ],
 "086450": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 61,
   "base": 19290,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 40,000원 (현재가 대비 +107.4% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 59
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "neu",
    "score": 48
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "417200": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 64,
   "base": 11510,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 40
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "281740": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 70,
   "base": 11900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 37
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "019210": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 57,
   "confidence": 70,
   "base": 23100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 69
   },
   "diana": {
    "stance": "neu",
    "score": 57
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "388210": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 76,
   "base": 86300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 200,667원 (현재가 대비 +132.5% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 48
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "074600": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 44,
   "base": 29000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 55,000원 (현재가 대비 +89.7% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 16
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "056190": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 43,
   "base": 20700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 38,500원 (현재가 대비 +86.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "388720": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 32,
   "confidence": 53,
   "base": 61200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 15
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "381620": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 45,
   "confidence": 78,
   "base": 5680,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "065350": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 68,
   "base": 27350,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "328130": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 71,
   "base": 10040,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "122870": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 45,
   "base": 40200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 72,059원 (현재가 대비 +79.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 23
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "189300": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 51,
   "base": 62900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 187,000원 (현재가 대비 +197.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bull",
    "score": 65
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "137400": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 40,
   "base": 29900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bull",
    "score": 69
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "213420": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 54,
   "base": 31750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 64,143원 (현재가 대비 +102.0% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 52
   },
   "diana": {
    "stance": "bull",
    "score": 81
   },
   "nova": {
    "stance": "neu",
    "score": 47
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "032500": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 66,
   "base": 15080,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 70,000원 (현재가 대비 +364.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 45
   },
   "tier": "auto"
  }
 ],
 "356860": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 68,
   "base": 38300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 64,352원 (현재가 대비 +68.0% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 51
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "bear",
    "score": 40
   },
   "tier": "auto"
  }
 ],
 "490470": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 66,
   "base": 18360,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 52,000원 (현재가 대비 +183.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 33
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "445680": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 69,
   "base": 41150,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "036830": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 42,
   "base": 32100,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 32
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "161580": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 31,
   "confidence": 52,
   "base": 27700,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 29
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "032190": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 52,
   "base": 18290,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "033100": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 41,
   "base": 42800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "041830": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 57,
   "confidence": 72,
   "base": 54200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 74,500원 (현재가 대비 +37.5% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 64
   },
   "diana": {
    "stance": "bull",
    "score": 62
   },
   "nova": {
    "stance": "neu",
    "score": 53
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "035760": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 42,
   "base": 29300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 63,887원 (현재가 대비 +118.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 36
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "252990": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 46,
   "base": 14570,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 89
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "neu",
    "score": 51
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "014620": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 60,
   "base": 25900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 49,333원 (현재가 대비 +90.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 39
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "048410": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 38,
   "confidence": 63,
   "base": 6520,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 56
   },
   "tier": "auto"
  }
 ],
 "090360": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 31,
   "confidence": 51,
   "base": 61200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "115180": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 34,
   "confidence": 50,
   "base": 17850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "006730": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 42,
   "base": 9900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 17,800원 (현재가 대비 +79.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "466100": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 64,
   "base": 23400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "122640": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 65,
   "base": 28750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 49,000원 (현재가 대비 +70.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 29
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 35
   },
   "flow": {
    "stance": "bear",
    "score": 41
   },
   "tier": "auto"
  }
 ],
 "399720": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 57,
   "base": 49750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 63
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "253450": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 67,
   "base": 20400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 45,800원 (현재가 대비 +124.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "094170": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 40,
   "confidence": 75,
   "base": 30750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bear",
    "score": 37
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "052400": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 52,
   "confidence": 40,
   "base": 41150,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 96,500원 (현재가 대비 +134.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 40
   },
   "diana": {
    "stance": "bull",
    "score": 82
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "050890": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 43,
   "base": 9440,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 27,333원 (현재가 대비 +189.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "093320": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 60,
   "confidence": 45,
   "base": 133400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 90
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "neu",
    "score": 53
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "112040": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 42,
   "base": 16640,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 30,000원 (현재가 대비 +80.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bull",
    "score": 66
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "397030": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 48,
   "base": 25200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 101,000원 (현재가 대비 +300.8% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 44
   },
   "nova": {
    "stance": "bear",
    "score": 33
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "222080": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 41,
   "confidence": 65,
   "base": 7260,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "neu",
    "score": 48
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "053800": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 61,
   "base": 52400,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 45
   },
   "diana": {
    "stance": "bull",
    "score": 63
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "023160": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 53,
   "confidence": 40,
   "base": 22550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 60,000원 (현재가 대비 +166.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bull",
    "score": 85
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "102710": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 49,
   "base": 40250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 66,000원 (현재가 대비 +64.0% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bull",
    "score": 75
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "053610": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 45,
   "base": 66600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 20
   },
   "diana": {
    "stance": "bull",
    "score": 63
   },
   "nova": {
    "stance": "bear",
    "score": 42
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "225570": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 78,
   "base": 8380,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "bear",
    "score": 38
   },
   "nova": {
    "stance": "bear",
    "score": 40
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "037460": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 49,
   "base": 35050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 54
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "bear",
    "score": 39
   },
   "flow": {
    "stance": "neu",
    "score": 47
   },
   "tier": "auto"
  }
 ],
 "044490": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 60,
   "base": 26550,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 55,000원 (현재가 대비 +107.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "383310": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 41,
   "confidence": 47,
   "base": 25800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 45,000원 (현재가 대비 +74.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 19
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "046890": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 51,
   "base": 9090,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "376900": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 46,
   "confidence": 55,
   "base": 48350,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 65
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ],
 "064290": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 75,
   "base": 38900,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 76,000원 (현재가 대비 +95.4% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "neu",
    "score": 46
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "059090": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 33,
   "confidence": 51,
   "base": 14960,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 40
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "295310": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 61,
   "base": 41600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 102,000원 (현재가 대비 +145.2% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "121600": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 43,
   "confidence": 70,
   "base": 43850,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 110,000원 (현재가 대비 +150.9% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 35
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "067160": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 59,
   "confidence": 40,
   "base": 47300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 73,333원 (현재가 대비 +55.0% 상승여력)",
   "taro": {
    "stance": "neu",
    "score": 49
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "041960": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 63,
   "base": 7280,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 24
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "171090": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 55,
   "confidence": 41,
   "base": 55500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 140,000원 (현재가 대비 +152.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 42
   },
   "diana": {
    "stance": "bull",
    "score": 88
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "160190": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 37,
   "confidence": 66,
   "base": 15310,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 38
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "089890": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 33,
   "confidence": 55,
   "base": 23750,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 47
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 44
   },
   "tier": "auto"
  }
 ],
 "102940": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 41,
   "confidence": 41,
   "base": 32250,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 17
   },
   "diana": {
    "stance": "bull",
    "score": 64
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 54
   },
   "tier": "auto"
  }
 ],
 "045100": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 53,
   "base": 30800,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "neu",
    "score": 57
   },
   "diana": {
    "stance": "bull",
    "score": 73
   },
   "nova": {
    "stance": "bear",
    "score": 38
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "251970": [
  {
   "date": "2026-07-17",
   "call": "BUY",
   "total": 65,
   "confidence": 58,
   "base": 41950,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 57,333원 (현재가 대비 +36.7% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 80
   },
   "diana": {
    "stance": "bull",
    "score": 78
   },
   "nova": {
    "stance": "neu",
    "score": 50
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "456160": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 39,
   "confidence": 67,
   "base": 31300,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 38
   },
   "nova": {
    "stance": "bear",
    "score": 36
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "052020": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 71,
   "base": 7330,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 34
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "376300": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 48,
   "base": 20050,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 45,538원 (현재가 대비 +127.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bull",
    "score": 71
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 50
   },
   "tier": "auto"
  }
 ],
 "170920": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 58,
   "confidence": 40,
   "base": 55000,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 60,000원 (현재가 대비 +9.1% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 91
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "bull",
    "score": 58
   },
   "flow": {
    "stance": "bear",
    "score": 41
   },
   "tier": "auto"
  }
 ],
 "476060": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 54,
   "confidence": 56,
   "base": 14500,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 30,000원 (현재가 대비 +106.9% 상승여력)",
   "taro": {
    "stance": "bull",
    "score": 65
   },
   "diana": {
    "stance": "bull",
    "score": 58
   },
   "nova": {
    "stance": "bull",
    "score": 60
   },
   "flow": {
    "stance": "bear",
    "score": 33
   },
   "tier": "auto"
  }
 ],
 "086900": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 48,
   "confidence": 66,
   "base": 71600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 120,000원 (현재가 대비 +67.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bull",
    "score": 60
   },
   "nova": {
    "stance": "bear",
    "score": 41
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "358570": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 34,
   "confidence": 51,
   "base": 7320,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "bear",
    "score": 38
   },
   "nova": {
    "stance": "bear",
    "score": 32
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "477850": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 47,
   "confidence": 47,
   "base": 26200,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 72
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "neu",
    "score": 53
   },
   "tier": "auto"
  }
 ],
 "211050": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 61,
   "base": 10040,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bull",
    "score": 61
   },
   "diana": {
    "stance": "bull",
    "score": 70
   },
   "nova": {
    "stance": "bear",
    "score": 43
   },
   "flow": {
    "stance": "neu",
    "score": 51
   },
   "tier": "auto"
  }
 ],
 "060250": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 56,
   "confidence": 40,
   "base": 12420,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 21,750원 (현재가 대비 +75.1% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 41
   },
   "diana": {
    "stance": "bull",
    "score": 92
   },
   "nova": {
    "stance": "bear",
    "score": 37
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "126340": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 35,
   "confidence": 52,
   "base": 61600,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 177,000원 (현재가 대비 +187.3% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 50
   },
   "nova": {
    "stance": "bear",
    "score": 28
   },
   "flow": {
    "stance": "neu",
    "score": 49
   },
   "tier": "auto"
  }
 ],
 "336570": [
  {
   "date": "2026-07-17",
   "call": "HOLD",
   "total": 50,
   "confidence": 46,
   "base": 5320,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 12,000원 (현재가 대비 +125.6% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bull",
    "score": 76
   },
   "nova": {
    "stance": "bear",
    "score": 34
   },
   "flow": {
    "stance": "neu",
    "score": 52
   },
   "tier": "auto"
  }
 ],
 "056080": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 42,
   "confidence": 45,
   "base": 11980,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 31
   },
   "diana": {
    "stance": "bear",
    "score": 32
   },
   "nova": {
    "stance": "bear",
    "score": 31
   },
   "flow": {
    "stance": "bull",
    "score": 74
   },
   "tier": "auto"
  }
 ],
 "033640": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 36,
   "confidence": 50,
   "base": 19730,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "증권사 평균 목표주가 36,000원 (현재가 대비 +82.5% 상승여력)",
   "taro": {
    "stance": "bear",
    "score": 14
   },
   "diana": {
    "stance": "neu",
    "score": 52
   },
   "nova": {
    "stance": "bear",
    "score": 30
   },
   "flow": {
    "stance": "neu",
    "score": 48
   },
   "tier": "auto"
  }
 ],
 "348370": [
  {
   "date": "2026-07-17",
   "call": "SELL",
   "total": 44,
   "confidence": 74,
   "base": 23450,
   "baseAt": "2026-07-17 10:06 장중",
   "target": "컨센서스 목표주가 미제공 — 기술적 지지·저항선 참고",
   "taro": {
    "stance": "bear",
    "score": 38
   },
   "diana": {
    "stance": "bear",
    "score": 42
   },
   "nova": {
    "stance": "neu",
    "score": 52
   },
   "flow": {
    "stance": "neu",
    "score": 46
   },
   "tier": "auto"
  }
 ]
};
