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
  }
 ]
};
