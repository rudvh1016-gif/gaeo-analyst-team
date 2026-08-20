// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-20 11:41",
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
   "taro": 0.2703,
   "diana": 0.1254,
   "nova": 0.2974,
   "flow": 0.3068
  },
  "acc": {
   "taro": {
    "n": 11523,
    "acc": 51.1,
    "adjustedAcc": 51.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4929,
    "acc": 56.2,
    "adjustedAcc": 56.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9021,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2096,
    "acc": 55.6,
    "adjustedAcc": 55.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 27569,
  "team": {
   "hit": 7702,
   "miss": 7249,
   "n": 14951,
   "acc": 51.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2771,
    "diana": 0.1006,
    "nova": 0.2711,
    "flow": 0.3512
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
     "n": 436,
     "acc": 42.9,
     "adjustedAcc": 44.4,
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
   "graded": 3341,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.1141,
    "nova": 0.2894,
    "flow": 0.3009
   },
   "acc": {
    "taro": {
     "n": 656,
     "acc": 58.2,
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
   "graded": 1590,
   "globalBlend": 0.335
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2527,
    "diana": 0.136,
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
     "n": 265,
     "acc": 60.8,
     "adjustedAcc": 57.4,
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
   "graded": 1456,
   "globalBlend": 0.355
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2931,
    "diana": 0.1192,
    "nova": 0.3162,
    "flow": 0.2715
   },
   "acc": {
    "taro": {
     "n": 436,
     "acc": 52.5,
     "adjustedAcc": 52.0,
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
   "graded": 1103,
   "globalBlend": 0.42
  },
  "통신": {
   "weights": {
    "taro": 0.2679,
    "diana": 0.1201,
    "nova": 0.2986,
    "flow": 0.3134
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
    "taro": 0.2737,
    "diana": 0.1601,
    "nova": 0.2743,
    "flow": 0.2918
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
    "taro": 0.2799,
    "diana": 0.1047,
    "nova": 0.3234,
    "flow": 0.2919
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
    "taro": 0.3007,
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
    "taro": 0.2746,
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
    "taro": 0.2807,
    "diana": 0.1194,
    "nova": 0.2996,
    "flow": 0.3004
   },
   "acc": {
    "taro": {
     "n": 1512,
     "acc": 54.6,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 614,
     "acc": 56.4,
     "adjustedAcc": 55.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1194,
     "acc": 59.2,
     "adjustedAcc": 58.4,
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
   "graded": 3517,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2716,
    "diana": 0.1289,
    "nova": 0.3229,
    "flow": 0.2766
   },
   "acc": {
    "taro": {
     "n": 663,
     "acc": 49.3,
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
   "graded": 1593,
   "globalBlend": 0.334
  },
  "조선": {
   "weights": {
    "taro": 0.261,
    "diana": 0.1352,
    "nova": 0.3015,
    "flow": 0.3022
   },
   "acc": {
    "taro": {
     "n": 367,
     "acc": 44.1,
     "adjustedAcc": 45.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 175,
     "acc": 62.3,
     "adjustedAcc": 57.3,
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
    "flow": 0.3114
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
    "taro": 0.2803,
    "diana": 0.1502,
    "nova": 0.283,
    "flow": 0.2864
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
   "graded": 575,
   "globalBlend": 0.582
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2723,
    "diana": 0.1211,
    "nova": 0.3005,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 837,
     "acc": 52.7,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 435,
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
   "graded": 2050,
   "globalBlend": 0.281
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2646,
    "diana": 0.1454,
    "nova": 0.2794,
    "flow": 0.3106
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
     "n": 113,
     "acc": 57.5,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 464,
   "globalBlend": 0.633
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2887,
    "diana": 0.1125,
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
     "n": 239,
     "acc": 46.4,
     "adjustedAcc": 47.6,
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
   "graded": 1135,
   "globalBlend": 0.413
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2765,
    "diana": 0.138,
    "nova": 0.2704,
    "flow": 0.3151
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
   "graded": 657,
   "globalBlend": 0.549
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1304,
    "nova": 0.3103,
    "flow": 0.2815
   },
   "acc": {
    "taro": {
     "n": 339,
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
   "graded": 863,
   "globalBlend": 0.481
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2603,
    "diana": 0.1161,
    "nova": 0.3088,
    "flow": 0.3147
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
    "taro": 0.2624,
    "diana": 0.13,
    "nova": 0.2956,
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
    "diana": 0.1027,
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
    "taro": 0.2617,
    "diana": 0.1693,
    "nova": 0.2699,
    "flow": 0.299
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
    "taro": 0.2833,
    "diana": 0.1168,
    "nova": 0.3004,
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
