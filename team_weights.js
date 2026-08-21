// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-21 10:17",
 "evalDays": 5,
 "horizons": {
  "taro": {
   "days": 5,
   "deadband": 1.0
  },
  "diana": {
   "days": 20,
   "deadband": 3.0
  },
  "nova": {
   "days": 5,
   "deadband": 1.0
  },
  "flow": {
   "days": 5,
   "deadband": 1.0
  }
 },
 "method": "role-prior-bayesian-shrinkage-v2",
 "global": {
  "weights": {
   "taro": 0.2644,
   "diana": 0.1228,
   "nova": 0.3006,
   "flow": 0.3122
  },
  "acc": {
   "taro": {
    "n": 11954,
    "acc": 50.1,
    "adjustedAcc": 50.0,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 5234,
    "acc": 55.1,
    "adjustedAcc": 55.0,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9035,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2170,
    "acc": 55.9,
    "adjustedAcc": 55.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 28393,
  "team": {
   "hit": 7896,
   "miss": 7549,
   "n": 15445,
   "acc": 51.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2747,
    "diana": 0.0981,
    "nova": 0.2737,
    "flow": 0.3535
   },
   "acc": {
    "taro": {
     "n": 1418,
     "acc": 50.6,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 462,
     "acc": 41.8,
     "adjustedAcc": 43.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1125,
     "acc": 51.4,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 433,
     "acc": 62.6,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3438,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2882,
    "diana": 0.1119,
    "nova": 0.2917,
    "flow": 0.3082
   },
   "acc": {
    "taro": {
     "n": 678,
     "acc": 56.9,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 211,
     "acc": 53.1,
     "adjustedAcc": 52.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 539,
     "acc": 58.3,
     "adjustedAcc": 56.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 207,
     "acc": 60.4,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1635,
   "globalBlend": 0.329
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2463,
    "diana": 0.1353,
    "nova": 0.3136,
    "flow": 0.3047
   },
   "acc": {
    "taro": {
     "n": 592,
     "acc": 42.7,
     "adjustedAcc": 44.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 282,
     "acc": 60.6,
     "adjustedAcc": 57.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 485,
     "acc": 57.9,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 138,
     "acc": 53.6,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1497,
   "globalBlend": 0.348
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2866,
    "diana": 0.1174,
    "nova": 0.3215,
    "flow": 0.2744
   },
   "acc": {
    "taro": {
     "n": 452,
     "acc": 50.7,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 237,
     "acc": 47.7,
     "adjustedAcc": 48.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 350,
     "acc": 58.6,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 103,
     "acc": 36.9,
     "adjustedAcc": 43.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1142,
   "globalBlend": 0.412
  },
  "통신": {
   "weights": {
    "taro": 0.2622,
    "diana": 0.1181,
    "nova": 0.3014,
    "flow": 0.3183
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 47.4,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 51.6,
     "adjustedAcc": 50.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 154,
     "acc": 60.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 64.4,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 517,
   "globalBlend": 0.607
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2676,
    "diana": 0.1609,
    "nova": 0.2779,
    "flow": 0.2937
   },
   "acc": {
    "taro": {
     "n": 558,
     "acc": 49.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 262,
     "acc": 75.6,
     "adjustedAcc": 67.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 414,
     "acc": 51.7,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 79,
     "acc": 53.2,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1313,
   "globalBlend": 0.379
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.1026,
    "nova": 0.3271,
    "flow": 0.2953
   },
   "acc": {
    "taro": {
     "n": 650,
     "acc": 46.6,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 338,
     "acc": 37.6,
     "adjustedAcc": 40.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 472,
     "acc": 57.4,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 174,
     "acc": 46.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1634,
   "globalBlend": 0.329
  },
  "2차전지": {
   "weights": {
    "taro": 0.2919,
    "diana": 0.1111,
    "nova": 0.3319,
    "flow": 0.2652
   },
   "acc": {
    "taro": {
     "n": 630,
     "acc": 58.4,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 201,
     "acc": 52.2,
     "adjustedAcc": 51.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 477,
     "acc": 67.1,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 27,
     "acc": 40.7,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1335,
   "globalBlend": 0.375
  },
  "보험": {
   "weights": {
    "taro": 0.2712,
    "diana": 0.1414,
    "nova": 0.2878,
    "flow": 0.2995
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 52.4,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 81.2,
     "adjustedAcc": 65.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 54.2,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 45,
     "acc": 55.6,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 545,
   "globalBlend": 0.595
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2732,
    "diana": 0.1194,
    "nova": 0.3036,
    "flow": 0.3038
   },
   "acc": {
    "taro": {
     "n": 1565,
     "acc": 53.0,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 653,
     "acc": 56.0,
     "adjustedAcc": 55.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1197,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 205,
     "acc": 59.0,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3620,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.266,
    "diana": 0.1255,
    "nova": 0.3271,
    "flow": 0.2814
   },
   "acc": {
    "taro": {
     "n": 688,
     "acc": 48.1,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 375,
     "acc": 55.5,
     "adjustedAcc": 54.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 518,
     "acc": 60.8,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 62,
     "acc": 45.2,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1643,
   "globalBlend": 0.327
  },
  "조선": {
   "weights": {
    "taro": 0.2545,
    "diana": 0.1307,
    "nova": 0.3053,
    "flow": 0.3095
   },
   "acc": {
    "taro": {
     "n": 382,
     "acc": 42.4,
     "adjustedAcc": 44.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 189,
     "acc": 58.7,
     "adjustedAcc": 55.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 316,
     "acc": 55.7,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 54.5,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 953,
   "globalBlend": 0.456
  },
  "방산": {
   "weights": {
    "taro": 0.2652,
    "diana": 0.1192,
    "nova": 0.2989,
    "flow": 0.3167
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 45.7,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 42,
     "acc": 45.2,
     "adjustedAcc": 48.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 125,
     "acc": 56.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 11,
     "acc": 100.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 351,
   "globalBlend": 0.695
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2723,
    "diana": 0.1497,
    "nova": 0.2867,
    "flow": 0.2912
   },
   "acc": {
    "taro": {
     "n": 243,
     "acc": 51.9,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 147,
     "acc": 82.3,
     "adjustedAcc": 67.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 199,
     "acc": 52.8,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 5,
     "acc": 20.0,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 594,
   "globalBlend": 0.574
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.1167,
    "nova": 0.3039,
    "flow": 0.3136
   },
   "acc": {
    "taro": {
     "n": 867,
     "acc": 51.3,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 457,
     "acc": 54.5,
     "adjustedAcc": 53.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 678,
     "acc": 59.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 104,
     "acc": 64.4,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2106,
   "globalBlend": 0.275
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2596,
    "diana": 0.1438,
    "nova": 0.2818,
    "flow": 0.3148
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 42.7,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 87.5,
     "adjustedAcc": 65.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 108,
     "acc": 45.4,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 113,
     "acc": 57.5,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 472,
   "globalBlend": 0.629
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2868,
    "diana": 0.1104,
    "nova": 0.2954,
    "flow": 0.3074
   },
   "acc": {
    "taro": {
     "n": 536,
     "acc": 53.5,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 257,
     "acc": 45.9,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 359,
     "acc": 55.4,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 23,
     "acc": 69.6,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1175,
   "globalBlend": 0.405
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2736,
    "diana": 0.1374,
    "nova": 0.2702,
    "flow": 0.3188
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 127,
     "acc": 70.1,
     "adjustedAcc": 60.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 204,
     "acc": 43.6,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 28,
     "acc": 75.0,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 680,
   "globalBlend": 0.541
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2743,
    "diana": 0.1304,
    "nova": 0.3132,
    "flow": 0.2821
   },
   "acc": {
    "taro": {
     "n": 352,
     "acc": 50.9,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 157,
     "acc": 62.4,
     "adjustedAcc": 57.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 254,
     "acc": 61.0,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 124,
     "acc": 44.4,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 887,
   "globalBlend": 0.474
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2557,
    "diana": 0.1129,
    "nova": 0.3103,
    "flow": 0.3211
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 37.8,
     "adjustedAcc": 40.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 192,
     "acc": 37.5,
     "adjustedAcc": 42.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 271,
     "acc": 52.4,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 7,
     "acc": 57.1,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 835,
   "globalBlend": 0.489
  },
  "기계": {
   "weights": {
    "taro": 0.2574,
    "diana": 0.1274,
    "nova": 0.2985,
    "flow": 0.3167
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 36.7,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 69.6,
     "adjustedAcc": 56.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 97,
     "acc": 55.7,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 11,
     "acc": 100.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 284,
   "globalBlend": 0.738
  },
  "로봇": {
   "weights": {
    "taro": 0.2838,
    "diana": 0.1014,
    "nova": 0.3257,
    "flow": 0.2891
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 54.6,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 24.6,
     "adjustedAcc": 37.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 213,
     "acc": 66.2,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 64,
     "acc": 43.8,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 672,
   "globalBlend": 0.543
  },
  "식음료": {
   "weights": {
    "taro": 0.2589,
    "diana": 0.1668,
    "nova": 0.2711,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 44.3,
     "adjustedAcc": 45.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 159,
     "acc": 87.4,
     "adjustedAcc": 71.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 212,
     "acc": 43.9,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 4,
     "acc": 75.0,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 702,
   "globalBlend": 0.533
  },
  "여행레저": {
   "weights": {
    "taro": 0.2788,
    "diana": 0.1147,
    "nova": 0.3026,
    "flow": 0.3039
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 52.3,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 26.9,
     "adjustedAcc": 43.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 113,
     "acc": 56.6,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 44.7,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 363,
   "globalBlend": 0.688
  }
 }
};
