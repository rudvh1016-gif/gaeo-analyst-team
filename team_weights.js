// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-11 15:50",
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
   "taro": 0.2762,
   "diana": 0.097,
   "nova": 0.3111,
   "flow": 0.3156
  },
  "acc": {
   "taro": {
    "n": 9370,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2739,
    "acc": 48.1,
    "adjustedAcc": 48.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8486,
    "acc": 58.9,
    "adjustedAcc": 58.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1680,
    "acc": 57.4,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 22275,
  "team": {
   "hit": 6304,
   "miss": 2379,
   "n": 8683,
   "acc": 72.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2792,
    "diana": 0.0809,
    "nova": 0.2747,
    "flow": 0.3652
   },
   "acc": {
    "taro": {
     "n": 1137,
     "acc": 54.4,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 257,
     "acc": 36.6,
     "adjustedAcc": 40.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1038,
     "acc": 54.6,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 348,
     "acc": 69.3,
     "adjustedAcc": 64.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2780,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2956,
    "diana": 0.0927,
    "nova": 0.3004,
    "flow": 0.3113
   },
   "acc": {
    "taro": {
     "n": 559,
     "acc": 60.8,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 121,
     "acc": 47.1,
     "adjustedAcc": 48.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 501,
     "acc": 62.1,
     "adjustedAcc": 59.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 161,
     "acc": 65.8,
     "adjustedAcc": 59.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1342,
   "globalBlend": 0.373
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.26,
    "diana": 0.1095,
    "nova": 0.3297,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 470,
     "acc": 43.8,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 142,
     "acc": 51.4,
     "adjustedAcc": 50.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 454,
     "acc": 60.1,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 95,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1161,
   "globalBlend": 0.408
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2951,
    "diana": 0.0928,
    "nova": 0.3347,
    "flow": 0.2774
   },
   "acc": {
    "taro": {
     "n": 364,
     "acc": 52.5,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 126,
     "acc": 31.7,
     "adjustedAcc": 40.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 331,
     "acc": 61.6,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 34.5,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 905,
   "globalBlend": 0.469
  },
  "통신": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.0983,
    "nova": 0.3094,
    "flow": 0.3179
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 40.5,
     "adjustedAcc": 47.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 149,
     "acc": 61.7,
     "adjustedAcc": 56.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 66.7,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 421,
   "globalBlend": 0.655
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1324,
    "nova": 0.2937,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 130,
     "acc": 74.6,
     "adjustedAcc": 62.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 391,
     "acc": 54.0,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 55,
     "acc": 54.5,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 998,
   "globalBlend": 0.445
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2886,
    "diana": 0.0872,
    "nova": 0.3379,
    "flow": 0.2862
   },
   "acc": {
    "taro": {
     "n": 538,
     "acc": 49.3,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 176,
     "acc": 27.8,
     "adjustedAcc": 36.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 447,
     "acc": 59.7,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 149,
     "acc": 43.0,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1310,
   "globalBlend": 0.379
  },
  "2차전지": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.096,
    "nova": 0.3352,
    "flow": 0.2632
   },
   "acc": {
    "taro": {
     "n": 503,
     "acc": 64.2,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 104,
     "acc": 51.9,
     "adjustedAcc": 50.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 453,
     "acc": 70.6,
     "adjustedAcc": 66.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 9,
     "acc": 33.3,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1069,
   "globalBlend": 0.428
  },
  "보험": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.112,
    "nova": 0.3046,
    "flow": 0.3073
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 48.0,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 73.1,
     "adjustedAcc": 57.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 146,
     "acc": 55.5,
     "adjustedAcc": 53.0,
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
   "graded": 417,
   "globalBlend": 0.657
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2844,
    "diana": 0.1058,
    "nova": 0.3091,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 1193,
     "acc": 56.9,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 337,
     "acc": 56.1,
     "adjustedAcc": 54.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1117,
     "acc": 62.1,
     "adjustedAcc": 61.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 149,
     "acc": 63.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2796,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.1122,
    "nova": 0.337,
    "flow": 0.2768
   },
   "acc": {
    "taro": {
     "n": 529,
     "acc": 48.8,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 195,
     "acc": 54.4,
     "adjustedAcc": 52.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 492,
     "acc": 62.4,
     "adjustedAcc": 60.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 37.5,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1264,
   "globalBlend": 0.388
  },
  "조선": {
   "weights": {
    "taro": 0.2712,
    "diana": 0.1007,
    "nova": 0.3151,
    "flow": 0.313
   },
   "acc": {
    "taro": {
     "n": 310,
     "acc": 44.8,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 99,
     "acc": 40.4,
     "adjustedAcc": 45.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 299,
     "acc": 56.5,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 54.4,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 765,
   "globalBlend": 0.511
  },
  "방산": {
   "weights": {
    "taro": 0.275,
    "diana": 0.1004,
    "nova": 0.3113,
    "flow": 0.3134
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 44.6,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 25,
     "acc": 36.0,
     "adjustedAcc": 47.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 117,
     "acc": 58.1,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 3,
     "acc": 100.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 284,
   "globalBlend": 0.738
  },
  "철강·금속": {
   "weights": {
    "taro": 0.29,
    "diana": 0.1108,
    "nova": 0.299,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 57.8,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 74,
     "acc": 68.9,
     "adjustedAcc": 57.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 192,
     "acc": 54.7,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 451,
   "globalBlend": 0.639
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.0964,
    "nova": 0.3121,
    "flow": 0.3139
   },
   "acc": {
    "taro": {
     "n": 678,
     "acc": 54.4,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 238,
     "acc": 48.3,
     "adjustedAcc": 48.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 634,
     "acc": 61.8,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 88,
     "acc": 68.2,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1638,
   "globalBlend": 0.328
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2767,
    "diana": 0.1132,
    "nova": 0.2907,
    "flow": 0.3194
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 47.7,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 81.8,
     "adjustedAcc": 58.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 101,
     "acc": 43.6,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 88,
     "acc": 60.2,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 365,
   "globalBlend": 0.687
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2901,
    "diana": 0.0978,
    "nova": 0.3044,
    "flow": 0.3076
   },
   "acc": {
    "taro": {
     "n": 409,
     "acc": 53.5,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 137,
     "acc": 42.3,
     "adjustedAcc": 45.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 338,
     "acc": 56.2,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 19,
     "acc": 68.4,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 903,
   "globalBlend": 0.47
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.1083,
    "nova": 0.286,
    "flow": 0.325
   },
   "acc": {
    "taro": {
     "n": 248,
     "acc": 48.8,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 56.5,
     "adjustedAcc": 52.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 192,
     "acc": 44.3,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 88.2,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 519,
   "globalBlend": 0.607
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2841,
    "diana": 0.0964,
    "nova": 0.3256,
    "flow": 0.2939
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 52.2,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 36.7,
     "adjustedAcc": 44.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 243,
     "acc": 63.4,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 100,
     "acc": 47.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 700,
   "globalBlend": 0.533
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2701,
    "diana": 0.0937,
    "nova": 0.318,
    "flow": 0.3183
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 39.1,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 21.4,
     "adjustedAcc": 37.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 53.0,
     "adjustedAcc": 52.0,
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
   "graded": 629,
   "globalBlend": 0.56
  },
  "기계": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.1035,
    "nova": 0.3096,
    "flow": 0.3186
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 31.0,
     "adjustedAcc": 42.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 58.1,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 92,
     "acc": 55.4,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 7,
     "acc": 100.0,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 217,
   "globalBlend": 0.787
  },
  "로봇": {
   "weights": {
    "taro": 0.2883,
    "diana": 0.0985,
    "nova": 0.3269,
    "flow": 0.2863
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 57.2,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 44.4,
     "adjustedAcc": 48.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 204,
     "acc": 68.1,
     "adjustedAcc": 61.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 51,
     "acc": 39.2,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 533,
   "globalBlend": 0.6
  },
  "식음료": {
   "weights": {
    "taro": 0.2785,
    "diana": 0.1285,
    "nova": 0.2826,
    "flow": 0.3103
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 46.6,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 82.3,
     "adjustedAcc": 62.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 200,
     "acc": 41.0,
     "adjustedAcc": 44.4,
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
   "graded": 513,
   "globalBlend": 0.609
  },
  "여행레저": {
   "weights": {
    "taro": 0.2919,
    "diana": 0.0941,
    "nova": 0.3088,
    "flow": 0.3053
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 57.5,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 0.0,
     "adjustedAcc": 39.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 102,
     "acc": 55.9,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 40.0,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 295,
   "globalBlend": 0.731
  }
 }
};
