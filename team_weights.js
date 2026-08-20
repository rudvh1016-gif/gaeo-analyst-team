// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-20 12:11",
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
   "taro": 0.2706,
   "diana": 0.1256,
   "nova": 0.2976,
   "flow": 0.3062
  },
  "acc": {
   "taro": {
    "n": 11521,
    "acc": 51.2,
    "adjustedAcc": 51.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4936,
    "acc": 56.2,
    "adjustedAcc": 56.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9025,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2099,
    "acc": 55.6,
    "adjustedAcc": 55.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 27581,
  "team": {
   "hit": 7699,
   "miss": 7251,
   "n": 14950,
   "acc": 51.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2771,
    "diana": 0.1004,
    "nova": 0.2713,
    "flow": 0.3512
   },
   "acc": {
    "taro": {
     "n": 1365,
     "acc": 50.8,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 435,
     "acc": 42.8,
     "adjustedAcc": 44.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1119,
     "acc": 51.1,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 420,
     "acc": 62.6,
     "adjustedAcc": 59.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3339,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2959,
    "diana": 0.1141,
    "nova": 0.2894,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 655,
     "acc": 58.3,
     "adjustedAcc": 57.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 199,
     "acc": 54.3,
     "adjustedAcc": 52.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 538,
     "acc": 58.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 197,
     "acc": 59.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1589,
   "globalBlend": 0.335
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2529,
    "diana": 0.1366,
    "nova": 0.3123,
    "flow": 0.2983
   },
   "acc": {
    "taro": {
     "n": 573,
     "acc": 43.8,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 267,
     "acc": 61.0,
     "adjustedAcc": 57.6,
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
     "n": 132,
     "acc": 52.3,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1457,
   "globalBlend": 0.354
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2936,
    "diana": 0.1192,
    "nova": 0.3162,
    "flow": 0.2711
   },
   "acc": {
    "taro": {
     "n": 437,
     "acc": 52.6,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 218,
     "acc": 49.1,
     "adjustedAcc": 49.4,
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
     "n": 99,
     "acc": 37.4,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1104,
   "globalBlend": 0.42
  },
  "통신": {
   "weights": {
    "taro": 0.268,
    "diana": 0.1202,
    "nova": 0.2987,
    "flow": 0.313
   },
   "acc": {
    "taro": {
     "n": 201,
     "acc": 48.8,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 53.2,
     "adjustedAcc": 51.1,
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
     "n": 87,
     "acc": 64.4,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 504,
   "globalBlend": 0.613
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1602,
    "nova": 0.2744,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 539,
     "acc": 51.2,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 248,
     "acc": 76.2,
     "adjustedAcc": 67.7,
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
     "n": 77,
     "acc": 54.5,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1278,
   "globalBlend": 0.385
  },
  "금융·증권": {
   "weights": {
    "taro": 0.28,
    "diana": 0.1048,
    "nova": 0.3235,
    "flow": 0.2917
   },
   "acc": {
    "taro": {
     "n": 626,
     "acc": 47.8,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 315,
     "acc": 38.7,
     "adjustedAcc": 41.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 471,
     "acc": 57.5,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 169,
     "acc": 46.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1581,
   "globalBlend": 0.336
  },
  "2차전지": {
   "weights": {
    "taro": 0.3008,
    "diana": 0.1108,
    "nova": 0.3273,
    "flow": 0.2611
   },
   "acc": {
    "taro": {
     "n": 607,
     "acc": 60.5,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 193,
     "acc": 51.8,
     "adjustedAcc": 51.1,
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
   "graded": 1304,
   "globalBlend": 0.38
  },
  "보험": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1422,
    "nova": 0.2875,
    "flow": 0.2955
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 51.8,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 105,
     "acc": 81.0,
     "adjustedAcc": 64.4,
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
     "n": 43,
     "acc": 53.5,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 527,
   "globalBlend": 0.603
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2815,
    "diana": 0.1194,
    "nova": 0.2992,
    "flow": 0.3
   },
   "acc": {
    "taro": {
     "n": 1508,
     "acc": 54.7,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 616,
     "acc": 56.3,
     "adjustedAcc": 55.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1195,
     "acc": 59.2,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 197,
     "acc": 59.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3516,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2715,
    "diana": 0.1291,
    "nova": 0.3231,
    "flow": 0.2764
   },
   "acc": {
    "taro": {
     "n": 664,
     "acc": 49.2,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 352,
     "acc": 57.4,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 517,
     "acc": 60.7,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 44.3,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1594,
   "globalBlend": 0.334
  },
  "조선": {
   "weights": {
    "taro": 0.2613,
    "diana": 0.1358,
    "nova": 0.3012,
    "flow": 0.3016
   },
   "acc": {
    "taro": {
     "n": 368,
     "acc": 44.3,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 177,
     "acc": 62.7,
     "adjustedAcc": 57.6,
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
     "n": 64,
     "acc": 53.1,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 925,
   "globalBlend": 0.464
  },
  "방산": {
   "weights": {
    "taro": 0.2719,
    "diana": 0.1208,
    "nova": 0.2964,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 47.6,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 43.6,
     "adjustedAcc": 48.4,
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
     "n": 10,
     "acc": 100.0,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 342,
   "globalBlend": 0.701
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.1501,
    "nova": 0.2832,
    "flow": 0.2862
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 54.8,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 140,
     "acc": 83.6,
     "adjustedAcc": 68.1,
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
   "graded": 574,
   "globalBlend": 0.582
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2729,
    "diana": 0.1211,
    "nova": 0.3004,
    "flow": 0.3057
   },
   "acc": {
    "taro": {
     "n": 837,
     "acc": 52.8,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 437,
     "acc": 56.8,
     "adjustedAcc": 55.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 677,
     "acc": 59.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 101,
     "acc": 63.4,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2052,
   "globalBlend": 0.281
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2646,
    "diana": 0.1459,
    "nova": 0.2794,
    "flow": 0.3101
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 43.7,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 89.6,
     "adjustedAcc": 65.5,
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
   "graded": 465,
   "globalBlend": 0.632
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2887,
    "diana": 0.1129,
    "nova": 0.2947,
    "flow": 0.3037
   },
   "acc": {
    "taro": {
     "n": 515,
     "acc": 53.4,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 240,
     "acc": 46.7,
     "adjustedAcc": 47.8,
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
     "n": 22,
     "acc": 68.2,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1136,
   "globalBlend": 0.413
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2776,
    "diana": 0.1387,
    "nova": 0.2727,
    "flow": 0.311
   },
   "acc": {
    "taro": {
     "n": 311,
     "acc": 49.5,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 118,
     "acc": 69.5,
     "adjustedAcc": 59.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 207,
     "acc": 44.4,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 27,
     "acc": 66.7,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 663,
   "globalBlend": 0.547
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2779,
    "diana": 0.1305,
    "nova": 0.3104,
    "flow": 0.2812
   },
   "acc": {
    "taro": {
     "n": 341,
     "acc": 51.6,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 149,
     "acc": 62.4,
     "adjustedAcc": 56.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 61.3,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 122,
     "acc": 45.9,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 865,
   "globalBlend": 0.48
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2604,
    "diana": 0.1162,
    "nova": 0.3089,
    "flow": 0.3144
   },
   "acc": {
    "taro": {
     "n": 349,
     "acc": 38.1,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 180,
     "acc": 38.9,
     "adjustedAcc": 43.3,
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
     "n": 5,
     "acc": 40.0,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 805,
   "globalBlend": 0.498
  },
  "기계": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.1301,
    "nova": 0.2957,
    "flow": 0.3115
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 37.4,
     "adjustedAcc": 43.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 73.6,
     "adjustedAcc": 57.2,
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
   "graded": 276,
   "globalBlend": 0.743
  },
  "로봇": {
   "weights": {
    "taro": 0.2904,
    "diana": 0.103,
    "nova": 0.3214,
    "flow": 0.2853
   },
   "acc": {
    "taro": {
     "n": 262,
     "acc": 56.5,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 116,
     "acc": 24.1,
     "adjustedAcc": 37.3,
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
     "n": 61,
     "acc": 44.3,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 652,
   "globalBlend": 0.551
  },
  "식음료": {
   "weights": {
    "taro": 0.2619,
    "diana": 0.1694,
    "nova": 0.2701,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 311,
     "acc": 44.1,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 151,
     "acc": 89.4,
     "adjustedAcc": 72.0,
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
     "n": 3,
     "acc": 66.7,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 677,
   "globalBlend": 0.542
  },
  "여행레저": {
   "weights": {
    "taro": 0.2835,
    "diana": 0.1169,
    "nova": 0.3005,
    "flow": 0.2991
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 52.7,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 49,
     "acc": 26.5,
     "adjustedAcc": 43.2,
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
     "n": 46,
     "acc": 43.5,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 356,
   "globalBlend": 0.692
  }
 }
};
