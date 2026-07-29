// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 12:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2797,
   "diana": 0.2009,
   "nova": 0.2605,
   "flow": 0.259
  },
  "acc": {
   "taro": {
    "n": 5992,
    "acc": 60.9
   },
   "diana": {
    "n": 5414,
    "acc": 43.7
   },
   "nova": {
    "n": 4557,
    "acc": 56.7
   },
   "flow": {
    "n": 1038,
    "acc": 56.4
   }
  },
  "graded": 17001,
  "team": {
   "hit": 4650,
   "miss": 1240,
   "n": 5890,
   "acc": 78.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1839,
    "nova": 0.2354,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 714,
     "acc": 64.4
    },
    "diana": {
     "n": 468,
     "acc": 42.3
    },
    "nova": {
     "n": 615,
     "acc": 54.1
    },
    "flow": {
     "n": 240,
     "acc": 69.2
    }
   },
   "graded": 2037
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.1608,
    "nova": 0.2591,
    "flow": 0.2761
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 74.7
    },
    "diana": {
     "n": 220,
     "acc": 39.5
    },
    "nova": {
     "n": 292,
     "acc": 63.7
    },
    "flow": {
     "n": 109,
     "acc": 67.9
    }
   },
   "graded": 977
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2466,
    "diana": 0.2259,
    "nova": 0.2231,
    "flow": 0.3045
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 54.6
    },
    "diana": {
     "n": 282,
     "acc": 50.0
    },
    "nova": {
     "n": 243,
     "acc": 49.4
    },
    "flow": {
     "n": 46,
     "acc": 67.4
    }
   },
   "graded": 866
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3352,
    "diana": 0.1649,
    "nova": 0.3315,
    "flow": 0.1684
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 62.9
    },
    "diana": {
     "n": 262,
     "acc": 30.9
    },
    "nova": {
     "n": 177,
     "acc": 62.1
    },
    "flow": {
     "n": 57,
     "acc": 31.6
    }
   },
   "graded": 741
  },
  "통신": {
   "weights": {
    "taro": 0.2823,
    "diana": 0.2124,
    "nova": 0.2672,
    "flow": 0.2382
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 59.3
    },
    "diana": {
     "n": 74,
     "acc": 44.6
    },
    "nova": {
     "n": 82,
     "acc": 56.1
    },
    "flow": {
     "n": 29,
     "acc": 65.5
    }
   },
   "graded": 293
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2495,
    "diana": 0.2518,
    "nova": 0.2594,
    "flow": 0.2394
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 52.1
    },
    "diana": {
     "n": 251,
     "acc": 52.6
    },
    "nova": {
     "n": 203,
     "acc": 54.2
    },
    "flow": {
     "n": 25,
     "acc": 60.0
    }
   },
   "graded": 740
  },
  "금융·증권": {
   "weights": {
    "taro": 0.323,
    "diana": 0.1667,
    "nova": 0.3079,
    "flow": 0.2025
   },
   "acc": {
    "taro": {
     "n": 344,
     "acc": 58.1
    },
    "diana": {
     "n": 378,
     "acc": 28.6
    },
    "nova": {
     "n": 231,
     "acc": 55.4
    },
    "flow": {
     "n": 118,
     "acc": 36.4
    }
   },
   "graded": 1071
  },
  "2차전지": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1966,
    "nova": 0.2998,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 323,
     "acc": 80.8
    },
    "diana": {
     "n": 207,
     "acc": 48.8
    },
    "nova": {
     "n": 262,
     "acc": 74.4
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 794
  },
  "보험": {
   "weights": {
    "taro": 0.2621,
    "diana": 0.2692,
    "nova": 0.2291,
    "flow": 0.2396
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 54.7
    },
    "diana": {
     "n": 105,
     "acc": 56.2
    },
    "nova": {
     "n": 69,
     "acc": 47.8
    },
    "flow": {
     "n": 29,
     "acc": 48.3
    }
   },
   "graded": 320
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.231,
    "nova": 0.2623,
    "flow": 0.234
   },
   "acc": {
    "taro": {
     "n": 766,
     "acc": 64.5
    },
    "diana": {
     "n": 657,
     "acc": 54.6
    },
    "nova": {
     "n": 603,
     "acc": 62.0
    },
    "flow": {
     "n": 103,
     "acc": 55.3
    }
   },
   "graded": 2129
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3075,
    "diana": 0.2339,
    "nova": 0.2904,
    "flow": 0.1682
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 59.0
    },
    "diana": {
     "n": 388,
     "acc": 44.8
    },
    "nova": {
     "n": 264,
     "acc": 55.7
    },
    "flow": {
     "n": 31,
     "acc": 32.3
    }
   },
   "graded": 1029
  },
  "조선": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.2104,
    "nova": 0.2453,
    "flow": 0.263
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 53.5
    },
    "diana": {
     "n": 205,
     "acc": 40.0
    },
    "nova": {
     "n": 163,
     "acc": 46.6
    },
    "flow": {
     "n": 21,
     "acc": 52.4
    }
   },
   "graded": 591
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3117,
    "diana": 0.1804,
    "nova": 0.2681,
    "flow": 0.2399
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 65.0
    },
    "diana": {
     "n": 133,
     "acc": 37.6
    },
    "nova": {
     "n": 102,
     "acc": 55.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 372
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2747,
    "diana": 0.1836,
    "nova": 0.2393,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 433,
     "acc": 68.1
    },
    "diana": {
     "n": 448,
     "acc": 45.5
    },
    "nova": {
     "n": 342,
     "acc": 59.4
    },
    "flow": {
     "n": 60,
     "acc": 80.0
    }
   },
   "graded": 1283
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2846,
    "diana": 0.2865,
    "nova": 0.1588,
    "flow": 0.2701
   },
   "acc": {
    "taro": {
     "n": 80,
     "acc": 53.8
    },
    "diana": {
     "n": 85,
     "acc": 54.1
    },
    "nova": {
     "n": 38,
     "acc": 26.3
    },
    "flow": {
     "n": 49,
     "acc": 51.0
    }
   },
   "graded": 252
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.1978,
    "nova": 0.2659,
    "flow": 0.2566
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 54.5
    },
    "diana": {
     "n": 275,
     "acc": 38.5
    },
    "nova": {
     "n": 164,
     "acc": 51.8
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 710
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2491,
    "diana": 0.2325,
    "nova": 0.2339,
    "flow": 0.2845
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 43.8
    },
    "diana": {
     "n": 115,
     "acc": 40.9
    },
    "nova": {
     "n": 90,
     "acc": 41.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 358
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.308,
    "diana": 0.1778,
    "nova": 0.2898,
    "flow": 0.2244
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 59.9
    },
    "diana": {
     "n": 162,
     "acc": 34.6
    },
    "nova": {
     "n": 126,
     "acc": 56.3
    },
    "flow": {
     "n": 55,
     "acc": 43.6
    }
   },
   "graded": 520
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2453,
    "diana": 0.1771,
    "nova": 0.2994,
    "flow": 0.2783
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 44.1
    },
    "diana": {
     "n": 220,
     "acc": 31.8
    },
    "nova": {
     "n": 132,
     "acc": 53.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 529
  },
  "로봇": {
   "weights": {
    "taro": 0.2631,
    "diana": 0.2714,
    "nova": 0.2702,
    "flow": 0.1953
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 67.4
    },
    "diana": {
     "n": 118,
     "acc": 69.5
    },
    "nova": {
     "n": 120,
     "acc": 69.2
    },
    "flow": {
     "n": 19,
     "acc": 36.8
    }
   },
   "graded": 401
  },
  "식음료": {
   "weights": {
    "taro": 0.1963,
    "diana": 0.3023,
    "nova": 0.1975,
    "flow": 0.3039
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 32.3
    },
    "diana": {
     "n": 193,
     "acc": 49.7
    },
    "nova": {
     "n": 80,
     "acc": 32.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 403
  },
  "여행레저": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.1545,
    "nova": 0.2842,
    "flow": 0.2575
   },
   "acc": {
    "taro": {
     "n": 78,
     "acc": 59.0
    },
    "diana": {
     "n": 64,
     "acc": 25.0
    },
    "nova": {
     "n": 58,
     "acc": 55.2
    },
    "flow": {
     "n": 28,
     "acc": 28.6
    }
   },
   "graded": 228
  }
 }
};
