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
  }
 ]
};
