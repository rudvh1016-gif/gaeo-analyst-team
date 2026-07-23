// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 13:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2869,
   "diana": 0.1798,
   "nova": 0.2807,
   "flow": 0.2527
  },
  "acc": {
   "taro": {
    "n": 4146,
    "acc": 63.3
   },
   "diana": {
    "n": 3745,
    "acc": 39.7
   },
   "nova": {
    "n": 2799,
    "acc": 62.0
   },
   "flow": {
    "n": 737,
    "acc": 55.8
   }
  },
  "graded": 11427
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.205,
    "nova": 0.2077,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 494,
     "acc": 57.5
    },
    "diana": {
     "n": 320,
     "acc": 42.5
    },
    "nova": {
     "n": 388,
     "acc": 43.0
    },
    "flow": {
     "n": 165,
     "acc": 64.2
    }
   },
   "graded": 1367
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3081,
    "diana": 0.1496,
    "nova": 0.2753,
    "flow": 0.267
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 77.9
    },
    "diana": {
     "n": 151,
     "acc": 36.4
    },
    "nova": {
     "n": 182,
     "acc": 67.0
    },
    "flow": {
     "n": 80,
     "acc": 65.0
    }
   },
   "graded": 653
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2534,
    "diana": 0.1923,
    "nova": 0.2387,
    "flow": 0.3156
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 60.2
    },
    "diana": {
     "n": 186,
     "acc": 45.7
    },
    "nova": {
     "n": 141,
     "acc": 56.7
    },
    "flow": {
     "n": 32,
     "acc": 87.5
    }
   },
   "graded": 550
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3359,
    "diana": 0.1467,
    "nova": 0.3223,
    "flow": 0.1951
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 70.5
    },
    "diana": {
     "n": 182,
     "acc": 30.8
    },
    "nova": {
     "n": 108,
     "acc": 67.6
    },
    "flow": {
     "n": 44,
     "acc": 40.9
    }
   },
   "graded": 510
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2582,
    "diana": 0.2276,
    "nova": 0.2825,
    "flow": 0.2316
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 55.7
    },
    "diana": {
     "n": 173,
     "acc": 49.1
    },
    "nova": {
     "n": 123,
     "acc": 61.0
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 497
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1698,
    "nova": 0.2941,
    "flow": 0.2352
   },
   "acc": {
    "taro": {
     "n": 228,
     "acc": 57.0
    },
    "diana": {
     "n": 258,
     "acc": 32.2
    },
    "nova": {
     "n": 131,
     "acc": 55.7
    },
    "flow": {
     "n": 92,
     "acc": 44.6
    }
   },
   "graded": 709
  },
  "2차전지": {
   "weights": {
    "taro": 0.2992,
    "diana": 0.2022,
    "nova": 0.2992,
    "flow": 0.1994
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 84.3
    },
    "diana": {
     "n": 142,
     "acc": 50.7
    },
    "nova": {
     "n": 166,
     "acc": 82.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 531
  },
  "보험": {
   "weights": {
    "taro": 0.2618,
    "diana": 0.2553,
    "nova": 0.2443,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 82,
     "acc": 54.9
    },
    "diana": {
     "n": 71,
     "acc": 53.5
    },
    "nova": {
     "n": 41,
     "acc": 51.2
    },
    "flow": {
     "n": 20,
     "acc": 60.0
    }
   },
   "graded": 214
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2846,
    "diana": 0.2212,
    "nova": 0.3007,
    "flow": 0.1936
   },
   "acc": {
    "taro": {
     "n": 524,
     "acc": 68.3
    },
    "diana": {
     "n": 467,
     "acc": 53.1
    },
    "nova": {
     "n": 374,
     "acc": 72.2
    },
    "flow": {
     "n": 71,
     "acc": 46.5
    }
   },
   "graded": 1436
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.1937,
    "nova": 0.2805,
    "flow": 0.2309
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 63.8
    },
    "diana": {
     "n": 267,
     "acc": 41.9
    },
    "nova": {
     "n": 163,
     "acc": 60.7
    },
    "flow": {
     "n": 22,
     "acc": 45.5
    }
   },
   "graded": 698
  },
  "조선": {
   "weights": {
    "taro": 0.3246,
    "diana": 0.1445,
    "nova": 0.29,
    "flow": 0.2409
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 67.4
    },
    "diana": {
     "n": 141,
     "acc": 26.2
    },
    "nova": {
     "n": 103,
     "acc": 60.2
    },
    "flow": {
     "n": 11,
     "acc": 63.6
    }
   },
   "graded": 396
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3261,
    "diana": 0.1304,
    "nova": 0.3261,
    "flow": 0.2174
   },
   "acc": {
    "taro": {
     "n": 99,
     "acc": 78.8
    },
    "diana": {
     "n": 91,
     "acc": 22.0
    },
    "nova": {
     "n": 64,
     "acc": 76.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 254
  },
  "화학·소재": {
   "weights": {
    "taro": 0.28,
    "diana": 0.1675,
    "nova": 0.2587,
    "flow": 0.2938
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 71.5
    },
    "diana": {
     "n": 311,
     "acc": 42.8
    },
    "nova": {
     "n": 209,
     "acc": 66.0
    },
    "flow": {
     "n": 44,
     "acc": 84.1
    }
   },
   "graded": 869
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.1774,
    "nova": 0.2832,
    "flow": 0.2674
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 50.9
    },
    "diana": {
     "n": 193,
     "acc": 33.2
    },
    "nova": {
     "n": 102,
     "acc": 52.9
    },
    "flow": {
     "n": 11,
     "acc": 81.8
    }
   },
   "graded": 479
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2367,
    "diana": 0.2071,
    "nova": 0.2575,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 39.6
    },
    "diana": {
     "n": 75,
     "acc": 34.7
    },
    "nova": {
     "n": 58,
     "acc": 43.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 239
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3322,
    "diana": 0.1489,
    "nova": 0.3456,
    "flow": 0.1732
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 66.9
    },
    "diana": {
     "n": 114,
     "acc": 22.8
    },
    "nova": {
     "n": 79,
     "acc": 69.6
    },
    "flow": {
     "n": 43,
     "acc": 34.9
    }
   },
   "graded": 366
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2374,
    "diana": 0.1476,
    "nova": 0.369,
    "flow": 0.246
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 48.2
    },
    "diana": {
     "n": 158,
     "acc": 21.5
    },
    "nova": {
     "n": 76,
     "acc": 75.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 348
  },
  "로봇": {
   "weights": {
    "taro": 0.2733,
    "diana": 0.2711,
    "nova": 0.2733,
    "flow": 0.1822
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 76.5
    },
    "diana": {
     "n": 82,
     "acc": 74.4
    },
    "nova": {
     "n": 78,
     "acc": 75.6
    },
    "flow": {
     "n": 10,
     "acc": 30.0
    }
   },
   "graded": 272
  },
  "식음료": {
   "weights": {
    "taro": 0.1887,
    "diana": 0.1902,
    "nova": 0.3065,
    "flow": 0.3146
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 24.8
    },
    "diana": {
     "n": 129,
     "acc": 30.2
    },
    "nova": {
     "n": 39,
     "acc": 48.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 269
  }
 }
};
