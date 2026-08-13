// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-13 10:12",
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
   "taro": 0.2822,
   "diana": 0.108,
   "nova": 0.294,
   "flow": 0.3158
  },
  "acc": {
   "taro": {
    "n": 10040,
    "acc": 53.2,
    "adjustedAcc": 53.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3363,
    "acc": 51.8,
    "adjustedAcc": 51.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8942,
    "acc": 56.9,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1821,
    "acc": 57.4,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 24166,
  "team": {
   "hit": 6710,
   "miss": 2716,
   "n": 9426,
   "acc": 71.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2826,
    "diana": 0.0866,
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
     "n": 307,
     "acc": 37.8,
     "adjustedAcc": 41.2,
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
   "graded": 2994,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3021,
    "diana": 0.1012,
    "nova": 0.2854,
    "flow": 0.3112
   },
   "acc": {
    "taro": {
     "n": 588,
     "acc": 60.5,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 144,
     "acc": 50.7,
     "adjustedAcc": 50.4,
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
   "graded": 1432,
   "globalBlend": 0.358
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.1204,
    "nova": 0.3168,
    "flow": 0.3001
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
     "n": 107,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1266,
   "globalBlend": 0.387
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3013,
    "diana": 0.1029,
    "nova": 0.3184,
    "flow": 0.2774
   },
   "acc": {
    "taro": {
     "n": 385,
     "acc": 53.0,
     "adjustedAcc": 52.3,
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
     "n": 90,
     "acc": 35.6,
     "adjustedAcc": 43.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 973,
   "globalBlend": 0.451
  },
  "통신": {
   "weights": {
    "taro": 0.281,
    "diana": 0.1067,
    "nova": 0.2954,
    "flow": 0.3169
   },
   "acc": {
    "taro": {
     "n": 180,
     "acc": 52.2,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 46.7,
     "adjustedAcc": 49.1,
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
     "n": 70,
     "acc": 65.7,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 449,
   "globalBlend": 0.641
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2849,
    "diana": 0.144,
    "nova": 0.2738,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 463,
     "acc": 53.1,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 165,
     "acc": 77.0,
     "adjustedAcc": 65.6,
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
   "graded": 1107,
   "globalBlend": 0.42
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2932,
    "diana": 0.0941,
    "nova": 0.3215,
    "flow": 0.2911
   },
   "acc": {
    "taro": {
     "n": 568,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 219,
     "acc": 32.9,
     "adjustedAcc": 38.9,
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
    "taro": 0.3172,
    "diana": 0.1021,
    "nova": 0.3177,
    "flow": 0.263
   },
   "acc": {
    "taro": {
     "n": 527,
     "acc": 65.1,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 128,
     "acc": 52.3,
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
   "graded": 1144,
   "globalBlend": 0.412
  },
  "보험": {
   "weights": {
    "taro": 0.28,
    "diana": 0.123,
    "nova": 0.2906,
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
    "taro": 0.2954,
    "diana": 0.1106,
    "nova": 0.289,
    "flow": 0.3049
   },
   "acc": {
    "taro": {
     "n": 1299,
     "acc": 58.5,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 420,
     "acc": 56.9,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1182,
     "acc": 59.6,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 163,
     "acc": 63.8,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3064,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2799,
    "diana": 0.1201,
    "nova": 0.3213,
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
    "taro": 0.2741,
    "diana": 0.1142,
    "nova": 0.3021,
    "flow": 0.3096
   },
   "acc": {
    "taro": {
     "n": 329,
     "acc": 45.9,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 123,
     "acc": 52.0,
     "adjustedAcc": 51.0,
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
     "acc": 54.1,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 827,
   "globalBlend": 0.492
  },
  "방산": {
   "weights": {
    "taro": 0.28,
    "diana": 0.1084,
    "nova": 0.2962,
    "flow": 0.3155
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
     "n": 29,
     "acc": 37.9,
     "adjustedAcc": 47.7,
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
   "graded": 307,
   "globalBlend": 0.723
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.1231,
    "nova": 0.2818,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 59.3,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 92,
     "acc": 75.0,
     "adjustedAcc": 60.8,
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
   "graded": 492,
   "globalBlend": 0.619
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2838,
    "diana": 0.1051,
    "nova": 0.2982,
    "flow": 0.3129
   },
   "acc": {
    "taro": {
     "n": 720,
     "acc": 54.7,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 292,
     "acc": 51.4,
     "adjustedAcc": 51.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 668,
     "acc": 59.6,
     "adjustedAcc": 58.1,
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
   "graded": 1772,
   "globalBlend": 0.311
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2764,
    "diana": 0.1253,
    "nova": 0.2795,
    "flow": 0.3188
   },
   "acc": {
    "taro": {
     "n": 143,
     "acc": 44.8,
     "adjustedAcc": 47.1,
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
     "n": 95,
     "acc": 58.9,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 399,
   "globalBlend": 0.667
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2969,
    "diana": 0.1039,
    "nova": 0.2916,
    "flow": 0.3076
   },
   "acc": {
    "taro": {
     "n": 442,
     "acc": 54.8,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 164,
     "acc": 44.5,
     "adjustedAcc": 46.8,
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
   "graded": 981,
   "globalBlend": 0.449
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2859,
    "diana": 0.1184,
    "nova": 0.2708,
    "flow": 0.3249
   },
   "acc": {
    "taro": {
     "n": 267,
     "acc": 50.6,
     "adjustedAcc": 50.4,
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
   "graded": 569,
   "globalBlend": 0.584
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2903,
    "diana": 0.1087,
    "nova": 0.3093,
    "flow": 0.2918
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 53.5,
     "adjustedAcc": 52.5,
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
   "graded": 758,
   "globalBlend": 0.513
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2759,
    "diana": 0.1022,
    "nova": 0.3047,
    "flow": 0.3173
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 40.8,
     "adjustedAcc": 43.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 123,
     "acc": 29.3,
     "adjustedAcc": 39.5,
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
   "graded": 687,
   "globalBlend": 0.538
  },
  "기계": {
   "weights": {
    "taro": 0.2732,
    "diana": 0.1135,
    "nova": 0.2952,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 35.1,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 64.9,
     "adjustedAcc": 53.5,
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
   "graded": 239,
   "globalBlend": 0.77
  },
  "로봇": {
   "weights": {
    "taro": 0.2989,
    "diana": 0.1005,
    "nova": 0.314,
    "flow": 0.2865
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 59.2,
     "adjustedAcc": 56.1,
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
   "graded": 579,
   "globalBlend": 0.58
  },
  "식음료": {
   "weights": {
    "taro": 0.2776,
    "diana": 0.1424,
    "nova": 0.273,
    "flow": 0.307
   },
   "acc": {
    "taro": {
     "n": 257,
     "acc": 45.9,
     "adjustedAcc": 47.2,
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
   "graded": 568,
   "globalBlend": 0.585
  },
  "여행레저": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.1023,
    "nova": 0.2965,
    "flow": 0.3059
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 55.8,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 7.7,
     "adjustedAcc": 39.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 108,
     "acc": 55.6,
     "adjustedAcc": 52.6,
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
   "graded": 317,
   "globalBlend": 0.716
  }
 }
};
