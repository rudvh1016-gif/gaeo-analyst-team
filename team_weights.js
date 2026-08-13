// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-13 09:43",
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
   "taro": 0.2825,
   "diana": 0.1079,
   "nova": 0.2938,
   "flow": 0.3158
  },
  "acc": {
   "taro": {
    "n": 10037,
    "acc": 53.3,
    "adjustedAcc": 53.3,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3364,
    "acc": 51.8,
    "adjustedAcc": 51.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8943,
    "acc": 56.9,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1818,
    "acc": 57.4,
    "adjustedAcc": 57.0,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 24162,
  "team": {
   "hit": 6721,
   "miss": 2711,
   "n": 9432,
   "acc": 71.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2827,
    "diana": 0.0864,
    "nova": 0.2639,
    "flow": 0.367
   },
   "acc": {
    "taro": {
     "n": 1209,
     "acc": 53.3,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 308,
     "acc": 37.7,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1101,
     "acc": 51.9,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 377,
     "acc": 67.4,
     "adjustedAcc": 63.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2995,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3026,
    "diana": 0.1008,
    "nova": 0.2853,
    "flow": 0.3113
   },
   "acc": {
    "taro": {
     "n": 589,
     "acc": 60.6,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 145,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 530,
     "acc": 59.1,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 170,
     "acc": 64.1,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1434,
   "globalBlend": 0.358
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2624,
    "diana": 0.1203,
    "nova": 0.3163,
    "flow": 0.301
   },
   "acc": {
    "taro": {
     "n": 505,
     "acc": 44.2,
     "adjustedAcc": 45.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 175,
     "acc": 56.0,
     "adjustedAcc": 53.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 479,
     "acc": 58.7,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 106,
     "acc": 50.9,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1265,
   "globalBlend": 0.387
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1026,
    "nova": 0.3174,
    "flow": 0.2777
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 53.4,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 151,
     "acc": 39.1,
     "adjustedAcc": 43.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 347,
     "acc": 59.1,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 89,
     "acc": 36.0,
     "adjustedAcc": 44.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 971,
   "globalBlend": 0.452
  },
  "통신": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.1069,
    "nova": 0.2951,
    "flow": 0.3175
   },
   "acc": {
    "taro": {
     "n": 181,
     "acc": 51.9,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 47.8,
     "adjustedAcc": 49.4,
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
     "n": 71,
     "acc": 66.2,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 452,
   "globalBlend": 0.639
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2848,
    "diana": 0.1437,
    "nova": 0.2739,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 462,
     "acc": 53.0,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 164,
     "acc": 76.8,
     "adjustedAcc": 65.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 413,
     "acc": 51.8,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 56.1,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1105,
   "globalBlend": 0.42
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2935,
    "diana": 0.0944,
    "nova": 0.3212,
    "flow": 0.291
   },
   "acc": {
    "taro": {
     "n": 567,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 220,
     "acc": 33.2,
     "adjustedAcc": 39.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 470,
     "acc": 57.7,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 157,
     "acc": 45.2,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1414,
   "globalBlend": 0.361
  },
  "2차전지": {
   "weights": {
    "taro": 0.3175,
    "diana": 0.1021,
    "nova": 0.3175,
    "flow": 0.2629
   },
   "acc": {
    "taro": {
     "n": 528,
     "acc": 65.2,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 126,
     "acc": 52.4,
     "adjustedAcc": 51.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 475,
     "acc": 67.4,
     "adjustedAcc": 63.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 35.7,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1143,
   "globalBlend": 0.412
  },
  "보험": {
   "weights": {
    "taro": 0.2802,
    "diana": 0.1229,
    "nova": 0.2905,
    "flow": 0.3063
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 48.4,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 66,
     "acc": 75.8,
     "adjustedAcc": 59.1,
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
     "n": 40,
     "acc": 52.5,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 453,
   "globalBlend": 0.638
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2962,
    "diana": 0.1108,
    "nova": 0.2891,
    "flow": 0.3038
   },
   "acc": {
    "taro": {
     "n": 1301,
     "acc": 58.6,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 419,
     "acc": 57.0,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1183,
     "acc": 59.6,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 162,
     "acc": 63.6,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3065,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.28,
    "diana": 0.12,
    "nova": 0.3212,
    "flow": 0.2787
   },
   "acc": {
    "taro": {
     "n": 569,
     "acc": 50.1,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 238,
     "acc": 56.7,
     "adjustedAcc": 54.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 515,
     "acc": 60.8,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 41.5,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1375,
   "globalBlend": 0.368
  },
  "조선": {
   "weights": {
    "taro": 0.2747,
    "diana": 0.1138,
    "nova": 0.3032,
    "flow": 0.3082
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 45.7,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 121,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 314,
     "acc": 56.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 52.5,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 824,
   "globalBlend": 0.493
  },
  "방산": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1086,
    "nova": 0.2959,
    "flow": 0.3154
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 45.9,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 40.0,
     "adjustedAcc": 48.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 124,
     "acc": 56.5,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 6,
     "acc": 100.0,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 308,
   "globalBlend": 0.722
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.1228,
    "nova": 0.2819,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 198,
     "acc": 59.1,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 91,
     "acc": 74.7,
     "adjustedAcc": 60.7,
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
     "n": 2,
     "acc": 100.0,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 490,
   "globalBlend": 0.62
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2839,
    "diana": 0.1052,
    "nova": 0.2982,
    "flow": 0.3126
   },
   "acc": {
    "taro": {
     "n": 721,
     "acc": 54.8,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 293,
     "acc": 51.5,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 669,
     "acc": 59.6,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 92,
     "acc": 66.3,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1775,
   "globalBlend": 0.311
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2768,
    "diana": 0.125,
    "nova": 0.2791,
    "flow": 0.3192
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 45.1,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 85.2,
     "adjustedAcc": 60.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 107,
     "acc": 44.9,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 94,
     "acc": 59.6,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 397,
   "globalBlend": 0.668
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2976,
    "diana": 0.104,
    "nova": 0.2912,
    "flow": 0.3072
   },
   "acc": {
    "taro": {
     "n": 442,
     "acc": 55.0,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 165,
     "acc": 44.8,
     "adjustedAcc": 47.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 355,
     "acc": 55.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 20,
     "acc": 70.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 982,
   "globalBlend": 0.449
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2864,
    "diana": 0.1183,
    "nova": 0.2706,
    "flow": 0.3247
   },
   "acc": {
    "taro": {
     "n": 266,
     "acc": 50.8,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 62.3,
     "adjustedAcc": 54.8,
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
     "n": 21,
     "acc": 85.7,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 568,
   "globalBlend": 0.585
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2912,
    "diana": 0.1085,
    "nova": 0.3088,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 297,
     "acc": 53.9,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 49.0,
     "adjustedAcc": 49.5,
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
     "n": 108,
     "acc": 47.2,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 756,
   "globalBlend": 0.514
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.1024,
    "nova": 0.3043,
    "flow": 0.317
   },
   "acc": {
    "taro": {
     "n": 293,
     "acc": 41.0,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 124,
     "acc": 29.8,
     "adjustedAcc": 39.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 268,
     "acc": 51.9,
     "adjustedAcc": 51.3,
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
   "graded": 689,
   "globalBlend": 0.537
  },
  "기계": {
   "weights": {
    "taro": 0.2729,
    "diana": 0.1133,
    "nova": 0.2953,
    "flow": 0.3185
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 34.0,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 63.9,
     "adjustedAcc": 53.2,
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
     "n": 8,
     "acc": 100.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 238,
   "globalBlend": 0.771
  },
  "로봇": {
   "weights": {
    "taro": 0.2994,
    "diana": 0.1004,
    "nova": 0.3137,
    "flow": 0.2864
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 59.4,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 35.4,
     "adjustedAcc": 44.2,
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
     "n": 54,
     "acc": 40.7,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 580,
   "globalBlend": 0.58
  },
  "식음료": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1422,
    "nova": 0.2728,
    "flow": 0.3069
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 46.1,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 85.7,
     "adjustedAcc": 66.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 211,
     "acc": 43.6,
     "adjustedAcc": 45.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 2,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 567,
   "globalBlend": 0.585
  },
  "여행레저": {
   "weights": {
    "taro": 0.2952,
    "diana": 0.1026,
    "nova": 0.2961,
    "flow": 0.3061
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 55.5,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 40,
     "acc": 10.0,
     "adjustedAcc": 40.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 107,
     "acc": 55.1,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 41.5,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 316,
   "globalBlend": 0.717
  }
 }
};
