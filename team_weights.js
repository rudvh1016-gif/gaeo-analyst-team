// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-27 10:38",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2727,
   "diana": 0.206,
   "nova": 0.2647,
   "flow": 0.2566
  },
  "acc": {
   "taro": {
    "n": 5251,
    "acc": 59.2
   },
   "diana": {
    "n": 4735,
    "acc": 44.7
   },
   "nova": {
    "n": 3788,
    "acc": 57.5
   },
   "flow": {
    "n": 928,
    "acc": 55.7
   }
  },
  "graded": 14702
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.1932,
    "nova": 0.2355,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 623,
     "acc": 61.2
    },
    "diana": {
     "n": 404,
     "acc": 43.6
    },
    "nova": {
     "n": 516,
     "acc": 53.1
    },
    "flow": {
     "n": 210,
     "acc": 67.6
    }
   },
   "graded": 1753
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2962,
    "diana": 0.164,
    "nova": 0.2685,
    "flow": 0.2713
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 72.8
    },
    "diana": {
     "n": 191,
     "acc": 40.3
    },
    "nova": {
     "n": 244,
     "acc": 66.0
    },
    "flow": {
     "n": 96,
     "acc": 66.7
    }
   },
   "graded": 836
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2322,
    "diana": 0.2352,
    "nova": 0.2049,
    "flow": 0.3277
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 51.4
    },
    "diana": {
     "n": 246,
     "acc": 52.0
    },
    "nova": {
     "n": 203,
     "acc": 45.3
    },
    "flow": {
     "n": 40,
     "acc": 72.5
    }
   },
   "graded": 744
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3307,
    "diana": 0.1843,
    "nova": 0.3055,
    "flow": 0.1795
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 63.8
    },
    "diana": {
     "n": 228,
     "acc": 35.5
    },
    "nova": {
     "n": 146,
     "acc": 58.9
    },
    "flow": {
     "n": 52,
     "acc": 34.6
    }
   },
   "graded": 644
  },
  "통신": {
   "weights": {
    "taro": 0.2799,
    "diana": 0.2076,
    "nova": 0.2715,
    "flow": 0.241
   },
   "acc": {
    "taro": {
     "n": 93,
     "acc": 58.1
    },
    "diana": {
     "n": 65,
     "acc": 43.1
    },
    "nova": {
     "n": 71,
     "acc": 56.3
    },
    "flow": {
     "n": 25,
     "acc": 68.0
    }
   },
   "graded": 254
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2494,
    "diana": 0.2583,
    "nova": 0.2575,
    "flow": 0.2348
   },
   "acc": {
    "taro": {
     "n": 226,
     "acc": 53.1
    },
    "diana": {
     "n": 220,
     "acc": 55.0
    },
    "nova": {
     "n": 166,
     "acc": 54.8
    },
    "flow": {
     "n": 23,
     "acc": 56.5
    }
   },
   "graded": 635
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3026,
    "diana": 0.175,
    "nova": 0.3161,
    "flow": 0.2063
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 54.8
    },
    "diana": {
     "n": 331,
     "acc": 31.7
    },
    "nova": {
     "n": 185,
     "acc": 57.3
    },
    "flow": {
     "n": 115,
     "acc": 37.4
    }
   },
   "graded": 930
  },
  "2차전지": {
   "weights": {
    "taro": 0.301,
    "diana": 0.1973,
    "nova": 0.301,
    "flow": 0.2007
   },
   "acc": {
    "taro": {
     "n": 279,
     "acc": 78.5
    },
    "diana": {
     "n": 179,
     "acc": 49.2
    },
    "nova": {
     "n": 221,
     "acc": 78.3
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 681
  },
  "보험": {
   "weights": {
    "taro": 0.2575,
    "diana": 0.2818,
    "nova": 0.2258,
    "flow": 0.2349
   },
   "acc": {
    "taro": {
     "n": 104,
     "acc": 54.8
    },
    "diana": {
     "n": 90,
     "acc": 60.0
    },
    "nova": {
     "n": 52,
     "acc": 48.1
    },
    "flow": {
     "n": 26,
     "acc": 53.8
    }
   },
   "graded": 272
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2663,
    "diana": 0.2273,
    "nova": 0.2791,
    "flow": 0.2273
   },
   "acc": {
    "taro": {
     "n": 666,
     "acc": 63.7
    },
    "diana": {
     "n": 576,
     "acc": 54.3
    },
    "nova": {
     "n": 502,
     "acc": 66.7
    },
    "flow": {
     "n": 92,
     "acc": 54.3
    }
   },
   "graded": 1836
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2756,
    "diana": 0.2326,
    "nova": 0.2515,
    "flow": 0.2404
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 57.3
    },
    "diana": {
     "n": 339,
     "acc": 48.4
    },
    "nova": {
     "n": 216,
     "acc": 52.3
    },
    "flow": {
     "n": 28,
     "acc": 35.7
    }
   },
   "graded": 890
  },
  "조선": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.2256,
    "nova": 0.2369,
    "flow": 0.2637
   },
   "acc": {
    "taro": {
     "n": 181,
     "acc": 51.9
    },
    "diana": {
     "n": 180,
     "acc": 42.8
    },
    "nova": {
     "n": 138,
     "acc": 44.9
    },
    "flow": {
     "n": 15,
     "acc": 46.7
    }
   },
   "graded": 514
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3061,
    "diana": 0.1808,
    "nova": 0.2761,
    "flow": 0.237
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 64.6
    },
    "diana": {
     "n": 118,
     "acc": 38.1
    },
    "nova": {
     "n": 91,
     "acc": 58.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 336
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2675,
    "diana": 0.1907,
    "nova": 0.2436,
    "flow": 0.2982
   },
   "acc": {
    "taro": {
     "n": 382,
     "acc": 67.3
    },
    "diana": {
     "n": 392,
     "acc": 48.0
    },
    "nova": {
     "n": 284,
     "acc": 61.3
    },
    "flow": {
     "n": 55,
     "acc": 80.0
    }
   },
   "graded": 1113
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2847,
    "diana": 0.3006,
    "nova": 0.1599,
    "flow": 0.2549
   },
   "acc": {
    "taro": {
     "n": 73,
     "acc": 53.4
    },
    "diana": {
     "n": 78,
     "acc": 56.4
    },
    "nova": {
     "n": 31,
     "acc": 19.4
    },
    "flow": {
     "n": 46,
     "acc": 47.8
    }
   },
   "graded": 228
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2724,
    "diana": 0.1961,
    "nova": 0.2753,
    "flow": 0.2562
   },
   "acc": {
    "taro": {
     "n": 222,
     "acc": 53.2
    },
    "diana": {
     "n": 243,
     "acc": 38.3
    },
    "nova": {
     "n": 134,
     "acc": 53.7
    },
    "flow": {
     "n": 14,
     "acc": 78.6
    }
   },
   "graded": 613
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2274,
    "diana": 0.2266,
    "nova": 0.2507,
    "flow": 0.2952
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 38.5
    },
    "diana": {
     "n": 99,
     "acc": 38.4
    },
    "nova": {
     "n": 73,
     "acc": 42.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 307
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.1863,
    "nova": 0.286,
    "flow": 0.2329
   },
   "acc": {
    "taro": {
     "n": 158,
     "acc": 58.2
    },
    "diana": {
     "n": 144,
     "acc": 36.8
    },
    "nova": {
     "n": 108,
     "acc": 56.5
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 460
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2401,
    "diana": 0.1637,
    "nova": 0.3234,
    "flow": 0.2728
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 44.0
    },
    "diana": {
     "n": 193,
     "acc": 28.5
    },
    "nova": {
     "n": 108,
     "acc": 59.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 451
  },
  "로봇": {
   "weights": {
    "taro": 0.2709,
    "diana": 0.2643,
    "nova": 0.2617,
    "flow": 0.2031
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 66.7
    },
    "diana": {
     "n": 103,
     "acc": 65.0
    },
    "nova": {
     "n": 104,
     "acc": 64.4
    },
    "flow": {
     "n": 14,
     "acc": 28.6
    }
   },
   "graded": 350
  },
  "식음료": {
   "weights": {
    "taro": 0.1869,
    "diana": 0.2798,
    "nova": 0.2218,
    "flow": 0.3115
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 28.8
    },
    "diana": {
     "n": 167,
     "acc": 44.9
    },
    "nova": {
     "n": 59,
     "acc": 35.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 344
  },
  "여행레저": {
   "weights": {
    "taro": 0.3049,
    "diana": 0.1481,
    "nova": 0.3001,
    "flow": 0.2469
   },
   "acc": {
    "taro": {
     "n": 68,
     "acc": 61.8
    },
    "diana": {
     "n": 58,
     "acc": 19.0
    },
    "nova": {
     "n": 51,
     "acc": 60.8
    },
    "flow": {
     "n": 25,
     "acc": 20.0
    }
   },
   "graded": 202
  }
 }
};
