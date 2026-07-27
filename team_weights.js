// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-27 09:38",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2722,
   "diana": 0.208,
   "nova": 0.2632,
   "flow": 0.2567
  },
  "acc": {
   "taro": {
    "n": 5253,
    "acc": 58.9
   },
   "diana": {
    "n": 4740,
    "acc": 45.0
   },
   "nova": {
    "n": 3784,
    "acc": 57.0
   },
   "flow": {
    "n": 925,
    "acc": 55.6
   }
  },
  "graded": 14702
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2701,
    "diana": 0.1939,
    "nova": 0.2345,
    "flow": 0.3016
   },
   "acc": {
    "taro": {
     "n": 623,
     "acc": 60.8
    },
    "diana": {
     "n": 403,
     "acc": 43.7
    },
    "nova": {
     "n": 515,
     "acc": 52.8
    },
    "flow": {
     "n": 209,
     "acc": 67.9
    }
   },
   "graded": 1750
  },
  "전자·부품": {
   "weights": {
    "taro": 0.294,
    "diana": 0.1698,
    "nova": 0.2655,
    "flow": 0.2708
   },
   "acc": {
    "taro": {
     "n": 306,
     "acc": 71.2
    },
    "diana": {
     "n": 192,
     "acc": 41.1
    },
    "nova": {
     "n": 244,
     "acc": 64.3
    },
    "flow": {
     "n": 96,
     "acc": 65.6
    }
   },
   "graded": 838
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2316,
    "diana": 0.2364,
    "nova": 0.2039,
    "flow": 0.3281
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 51.2
    },
    "diana": {
     "n": 245,
     "acc": 52.2
    },
    "nova": {
     "n": 202,
     "acc": 45.0
    },
    "flow": {
     "n": 40,
     "acc": 72.5
    }
   },
   "graded": 741
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3301,
    "diana": 0.1871,
    "nova": 0.3028,
    "flow": 0.18
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 63.5
    },
    "diana": {
     "n": 228,
     "acc": 36.0
    },
    "nova": {
     "n": 146,
     "acc": 58.2
    },
    "flow": {
     "n": 52,
     "acc": 34.6
    }
   },
   "graded": 645
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
    "taro": 0.2483,
    "diana": 0.2603,
    "nova": 0.2556,
    "flow": 0.2358
   },
   "acc": {
    "taro": {
     "n": 226,
     "acc": 52.7
    },
    "diana": {
     "n": 221,
     "acc": 55.2
    },
    "nova": {
     "n": 166,
     "acc": 54.2
    },
    "flow": {
     "n": 23,
     "acc": 56.5
    }
   },
   "graded": 636
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2994,
    "diana": 0.1813,
    "nova": 0.3074,
    "flow": 0.2119
   },
   "acc": {
    "taro": {
     "n": 296,
     "acc": 54.1
    },
    "diana": {
     "n": 327,
     "acc": 32.7
    },
    "nova": {
     "n": 182,
     "acc": 55.5
    },
    "flow": {
     "n": 115,
     "acc": 38.3
    }
   },
   "graded": 920
  },
  "2차전지": {
   "weights": {
    "taro": 0.3,
    "diana": 0.2,
    "nova": 0.3,
    "flow": 0.2
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 78.1
    },
    "diana": {
     "n": 180,
     "acc": 50.0
    },
    "nova": {
     "n": 220,
     "acc": 77.3
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 680
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
    "taro": 0.2659,
    "diana": 0.2276,
    "nova": 0.2784,
    "flow": 0.2281
   },
   "acc": {
    "taro": {
     "n": 666,
     "acc": 63.4
    },
    "diana": {
     "n": 577,
     "acc": 54.2
    },
    "nova": {
     "n": 502,
     "acc": 66.3
    },
    "flow": {
     "n": 92,
     "acc": 54.3
    }
   },
   "graded": 1837
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
    "taro": 0.2672,
    "diana": 0.193,
    "nova": 0.2412,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 383,
     "acc": 67.1
    },
    "diana": {
     "n": 394,
     "acc": 48.5
    },
    "nova": {
     "n": 284,
     "acc": 60.6
    },
    "flow": {
     "n": 53,
     "acc": 79.2
    }
   },
   "graded": 1114
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2872,
    "diana": 0.3062,
    "nova": 0.1613,
    "flow": 0.2454
   },
   "acc": {
    "taro": {
     "n": 73,
     "acc": 53.4
    },
    "diana": {
     "n": 79,
     "acc": 57.0
    },
    "nova": {
     "n": 32,
     "acc": 18.8
    },
    "flow": {
     "n": 46,
     "acc": 45.7
    }
   },
   "graded": 230
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.2007,
    "nova": 0.2725,
    "flow": 0.2555
   },
   "acc": {
    "taro": {
     "n": 226,
     "acc": 53.1
    },
    "diana": {
     "n": 247,
     "acc": 39.3
    },
    "nova": {
     "n": 135,
     "acc": 53.3
    },
    "flow": {
     "n": 14,
     "acc": 78.6
    }
   },
   "graded": 622
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
