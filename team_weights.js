// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-19 12:11",
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
   "taro": 0.2749,
   "diana": 0.1234,
   "nova": 0.2953,
   "flow": 0.3064
  },
  "acc": {
   "taro": {
    "n": 11160,
    "acc": 51.9,
    "adjustedAcc": 51.9,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4622,
    "acc": 55.8,
    "adjustedAcc": 55.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9013,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2034,
    "acc": 55.8,
    "adjustedAcc": 55.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26829,
  "team": {
   "hit": 7422,
   "miss": 7050,
   "n": 14472,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2788,
    "diana": 0.0995,
    "nova": 0.2684,
    "flow": 0.3532
   },
   "acc": {
    "taro": {
     "n": 1328,
     "acc": 51.3,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 409,
     "acc": 42.8,
     "adjustedAcc": 44.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1119,
     "acc": 51.0,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 412,
     "acc": 63.3,
     "adjustedAcc": 60.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3268,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2997,
    "diana": 0.1138,
    "nova": 0.2874,
    "flow": 0.2991
   },
   "acc": {
    "taro": {
     "n": 638,
     "acc": 59.1,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 189,
     "acc": 55.0,
     "adjustedAcc": 53.1,
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
     "n": 192,
     "acc": 59.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1557,
   "globalBlend": 0.339
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2576,
    "diana": 0.1343,
    "nova": 0.3127,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 556,
     "acc": 44.2,
     "adjustedAcc": 45.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 249,
     "acc": 60.2,
     "adjustedAcc": 56.9,
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
     "n": 122,
     "acc": 50.8,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1412,
   "globalBlend": 0.362
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2965,
    "diana": 0.1177,
    "nova": 0.3141,
    "flow": 0.2717
   },
   "acc": {
    "taro": {
     "n": 423,
     "acc": 53.2,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 207,
     "acc": 48.8,
     "adjustedAcc": 49.2,
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
     "n": 98,
     "acc": 37.8,
     "adjustedAcc": 44.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1078,
   "globalBlend": 0.426
  },
  "통신": {
   "weights": {
    "taro": 0.2729,
    "diana": 0.1185,
    "nova": 0.2971,
    "flow": 0.3115
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 59,
     "acc": 52.5,
     "adjustedAcc": 50.8,
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
     "n": 83,
     "acc": 63.9,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 492,
   "globalBlend": 0.619
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2792,
    "diana": 0.1569,
    "nova": 0.2723,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 520,
     "acc": 52.5,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 232,
     "acc": 76.3,
     "adjustedAcc": 67.3,
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
     "n": 76,
     "acc": 55.3,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1242,
   "globalBlend": 0.392
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.1039,
    "nova": 0.3215,
    "flow": 0.291
   },
   "acc": {
    "taro": {
     "n": 613,
     "acc": 48.5,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 301,
     "acc": 38.5,
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
     "n": 167,
     "acc": 46.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1552,
   "globalBlend": 0.34
  },
  "2차전지": {
   "weights": {
    "taro": 0.3067,
    "diana": 0.1086,
    "nova": 0.3226,
    "flow": 0.2622
   },
   "acc": {
    "taro": {
     "n": 588,
     "acc": 62.1,
     "adjustedAcc": 60.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 179,
     "acc": 51.4,
     "adjustedAcc": 50.8,
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
     "n": 23,
     "acc": 43.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1267,
   "globalBlend": 0.387
  },
  "보험": {
   "weights": {
    "taro": 0.2776,
    "diana": 0.14,
    "nova": 0.2874,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 51.4,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 80.6,
     "adjustedAcc": 63.8,
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
     "n": 41,
     "acc": 51.2,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 512,
   "globalBlend": 0.61
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2853,
    "diana": 0.1182,
    "nova": 0.296,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 1458,
     "acc": 55.6,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 574,
     "acc": 56.6,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1191,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 189,
     "acc": 60.3,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3412,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.1274,
    "nova": 0.32,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 640,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 327,
     "acc": 57.5,
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
     "n": 59,
     "acc": 45.8,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1543,
   "globalBlend": 0.341
  },
  "조선": {
   "weights": {
    "taro": 0.2656,
    "diana": 0.1331,
    "nova": 0.2997,
    "flow": 0.3015
   },
   "acc": {
    "taro": {
     "n": 355,
     "acc": 45.1,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 166,
     "acc": 62.0,
     "adjustedAcc": 57.0,
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
     "n": 62,
     "acc": 53.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 899,
   "globalBlend": 0.471
  },
  "방산": {
   "weights": {
    "taro": 0.2756,
    "diana": 0.1191,
    "nova": 0.2951,
    "flow": 0.3103
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 47.9,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 48.1,
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
     "n": 9,
     "acc": 100.0,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 333,
   "globalBlend": 0.706
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2849,
    "diana": 0.146,
    "nova": 0.2823,
    "flow": 0.2868
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 55.6,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 131,
     "acc": 82.4,
     "adjustedAcc": 66.9,
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
   "graded": 558,
   "globalBlend": 0.589
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2765,
    "diana": 0.1191,
    "nova": 0.2987,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 808,
     "acc": 53.3,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 409,
     "acc": 56.2,
     "adjustedAcc": 54.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 675,
     "acc": 59.3,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 99,
     "acc": 63.6,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1991,
   "globalBlend": 0.287
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2679,
    "diana": 0.1428,
    "nova": 0.2782,
    "flow": 0.3111
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 43.9,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 73,
     "acc": 89.0,
     "adjustedAcc": 64.8,
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
     "n": 110,
     "acc": 58.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 455,
   "globalBlend": 0.637
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2912,
    "diana": 0.1117,
    "nova": 0.2935,
    "flow": 0.3036
   },
   "acc": {
    "taro": {
     "n": 499,
     "acc": 53.7,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 224,
     "acc": 46.4,
     "adjustedAcc": 47.7,
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
   "graded": 1104,
   "globalBlend": 0.42
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.281,
    "diana": 0.1348,
    "nova": 0.2695,
    "flow": 0.3146
   },
   "acc": {
    "taro": {
     "n": 302,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 108,
     "acc": 68.5,
     "adjustedAcc": 58.8,
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
   "graded": 638,
   "globalBlend": 0.556
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2822,
    "diana": 0.1266,
    "nova": 0.3089,
    "flow": 0.2822
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 52.4,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 60.4,
     "adjustedAcc": 55.6,
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
     "n": 121,
     "acc": 46.3,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 841,
   "globalBlend": 0.488
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2639,
    "diana": 0.1146,
    "nova": 0.3081,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 38.1,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 166,
     "acc": 37.3,
     "adjustedAcc": 42.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 270,
     "acc": 52.2,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 4,
     "acc": 25.0,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 776,
   "globalBlend": 0.508
  },
  "기계": {
   "weights": {
    "taro": 0.2668,
    "diana": 0.1281,
    "nova": 0.2938,
    "flow": 0.3113
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 38.2,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 74.0,
     "adjustedAcc": 57.1,
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
   "graded": 268,
   "globalBlend": 0.749
  },
  "로봇": {
   "weights": {
    "taro": 0.2966,
    "diana": 0.1025,
    "nova": 0.3182,
    "flow": 0.2826
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 58.5,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 25.2,
     "adjustedAcc": 38.1,
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
     "n": 59,
     "acc": 42.4,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 636,
   "globalBlend": 0.557
  },
  "식음료": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.1643,
    "nova": 0.2701,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 44.1,
     "adjustedAcc": 45.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 88.5,
     "adjustedAcc": 70.7,
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
   "graded": 653,
   "globalBlend": 0.551
  },
  "여행레저": {
   "weights": {
    "taro": 0.2893,
    "diana": 0.1147,
    "nova": 0.2976,
    "flow": 0.2984
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 54.9,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 21.7,
     "adjustedAcc": 42.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 111,
     "acc": 55.9,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 43,
     "acc": 41.9,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 342,
   "globalBlend": 0.701
  }
 }
};
