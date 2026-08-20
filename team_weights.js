// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-20 13:41",
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
   "taro": 0.2704,
   "diana": 0.1253,
   "nova": 0.2975,
   "flow": 0.3068
  },
  "acc": {
   "taro": {
    "n": 11531,
    "acc": 51.1,
    "adjustedAcc": 51.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4934,
    "acc": 56.1,
    "adjustedAcc": 56.0,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9022,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2095,
    "acc": 55.6,
    "adjustedAcc": 55.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 27582,
  "team": {
   "hit": 7702,
   "miss": 7247,
   "n": 14949,
   "acc": 51.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1003,
    "nova": 0.2712,
    "flow": 0.3513
   },
   "acc": {
    "taro": {
     "n": 1366,
     "acc": 50.9,
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
   "graded": 3340,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2959,
    "diana": 0.114,
    "nova": 0.2893,
    "flow": 0.3008
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
    "taro": 0.2526,
    "diana": 0.1362,
    "nova": 0.3125,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 574,
     "acc": 43.7,
     "adjustedAcc": 44.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 266,
     "acc": 60.9,
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
    "taro": 0.2935,
    "diana": 0.1188,
    "nova": 0.3162,
    "flow": 0.2714
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
     "n": 219,
     "acc": 48.9,
     "adjustedAcc": 49.3,
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
   "graded": 1105,
   "globalBlend": 0.42
  },
  "통신": {
   "weights": {
    "taro": 0.2676,
    "diana": 0.1201,
    "nova": 0.2988,
    "flow": 0.3136
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 48.5,
     "adjustedAcc": 49.1,
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
   "graded": 505,
   "globalBlend": 0.613
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2736,
    "diana": 0.1604,
    "nova": 0.2743,
    "flow": 0.2917
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
     "n": 249,
     "acc": 76.3,
     "adjustedAcc": 67.8,
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
   "graded": 1279,
   "globalBlend": 0.385
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2799,
    "diana": 0.1048,
    "nova": 0.3234,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 628,
     "acc": 47.8,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 317,
     "acc": 38.8,
     "adjustedAcc": 41.9,
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
   "graded": 1585,
   "globalBlend": 0.335
  },
  "2차전지": {
   "weights": {
    "taro": 0.3008,
    "diana": 0.1107,
    "nova": 0.3272,
    "flow": 0.2614
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
    "taro": 0.2747,
    "diana": 0.1421,
    "nova": 0.2874,
    "flow": 0.2958
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
    "diana": 0.1192,
    "nova": 0.2991,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 1511,
     "acc": 54.7,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 615,
     "acc": 56.3,
     "adjustedAcc": 55.2,
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
   "graded": 3518,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2709,
    "diana": 0.1288,
    "nova": 0.3234,
    "flow": 0.2769
   },
   "acc": {
    "taro": {
     "n": 664,
     "acc": 49.1,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 351,
     "acc": 57.3,
     "adjustedAcc": 55.4,
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
   "graded": 1593,
   "globalBlend": 0.334
  },
  "조선": {
   "weights": {
    "taro": 0.2615,
    "diana": 0.1347,
    "nova": 0.3016,
    "flow": 0.3023
   },
   "acc": {
    "taro": {
     "n": 366,
     "acc": 44.3,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 176,
     "acc": 61.9,
     "adjustedAcc": 57.1,
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
   "graded": 922,
   "globalBlend": 0.465
  },
  "방산": {
   "weights": {
    "taro": 0.2718,
    "diana": 0.1206,
    "nova": 0.2963,
    "flow": 0.3113
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
    "taro": 0.2799,
    "diana": 0.1503,
    "nova": 0.2832,
    "flow": 0.2866
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 54.5,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 141,
     "acc": 83.7,
     "adjustedAcc": 68.2,
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
   "graded": 576,
   "globalBlend": 0.581
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2724,
    "diana": 0.1209,
    "nova": 0.3006,
    "flow": 0.3061
   },
   "acc": {
    "taro": {
     "n": 839,
     "acc": 52.7,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 434,
     "acc": 56.7,
     "adjustedAcc": 55.2,
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
   "graded": 2051,
   "globalBlend": 0.281
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2644,
    "diana": 0.1455,
    "nova": 0.2798,
    "flow": 0.3102
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 43.4,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 76,
     "acc": 89.5,
     "adjustedAcc": 65.3,
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
     "n": 112,
     "acc": 57.1,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 462,
   "globalBlend": 0.634
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2886,
    "diana": 0.1127,
    "nova": 0.2947,
    "flow": 0.304
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
    "taro": 0.2769,
    "diana": 0.1379,
    "nova": 0.2703,
    "flow": 0.3149
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
     "n": 204,
     "acc": 43.6,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 24,
     "acc": 75.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 658,
   "globalBlend": 0.549
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1304,
    "nova": 0.3105,
    "flow": 0.2816
   },
   "acc": {
    "taro": {
     "n": 340,
     "acc": 51.5,
     "adjustedAcc": 51.1,
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
   "graded": 864,
   "globalBlend": 0.481
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2598,
    "diana": 0.1161,
    "nova": 0.3092,
    "flow": 0.3149
   },
   "acc": {
    "taro": {
     "n": 351,
     "acc": 37.9,
     "adjustedAcc": 41.0,
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
   "graded": 807,
   "globalBlend": 0.498
  },
  "기계": {
   "weights": {
    "taro": 0.2625,
    "diana": 0.1299,
    "nova": 0.2957,
    "flow": 0.312
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
    "taro": 0.2903,
    "diana": 0.1026,
    "nova": 0.3214,
    "flow": 0.2857
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
     "n": 117,
     "acc": 23.9,
     "adjustedAcc": 37.1,
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
   "graded": 653,
   "globalBlend": 0.551
  },
  "식음료": {
   "weights": {
    "taro": 0.2621,
    "diana": 0.1684,
    "nova": 0.2703,
    "flow": 0.2993
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
     "acc": 88.7,
     "adjustedAcc": 71.6,
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
    "taro": 0.2833,
    "diana": 0.1167,
    "nova": 0.3005,
    "flow": 0.2995
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
