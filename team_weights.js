// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-11 10:44",
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
   "taro": 0.2761,
   "diana": 0.0975,
   "nova": 0.3109,
   "flow": 0.3155
  },
  "acc": {
   "taro": {
    "n": 9373,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2733,
    "acc": 48.2,
    "adjustedAcc": 48.3,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8492,
    "acc": 58.8,
    "adjustedAcc": 58.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1681,
    "acc": 57.4,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 22279,
  "team": {
   "hit": 6298,
   "miss": 2384,
   "n": 8682,
   "acc": 72.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2794,
    "diana": 0.081,
    "nova": 0.2757,
    "flow": 0.3639
   },
   "acc": {
    "taro": {
     "n": 1138,
     "acc": 54.5,
     "adjustedAcc": 54.1,
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
     "n": 1040,
     "acc": 54.8,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 349,
     "acc": 69.1,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2784,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.093,
    "nova": 0.3007,
    "flow": 0.3108
   },
   "acc": {
    "taro": {
     "n": 560,
     "acc": 60.9,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 47.5,
     "adjustedAcc": 48.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 501,
     "acc": 62.3,
     "adjustedAcc": 59.9,
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
   "graded": 1344,
   "globalBlend": 0.373
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2601,
    "diana": 0.1093,
    "nova": 0.3297,
    "flow": 0.3008
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
     "n": 141,
     "acc": 51.1,
     "adjustedAcc": 50.6,
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
   "graded": 1160,
   "globalBlend": 0.408
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2938,
    "diana": 0.0935,
    "nova": 0.3348,
    "flow": 0.2779
   },
   "acc": {
    "taro": {
     "n": 366,
     "acc": 51.9,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 32.0,
     "adjustedAcc": 40.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 332,
     "acc": 61.4,
     "adjustedAcc": 58.4,
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
   "graded": 907,
   "globalBlend": 0.469
  },
  "통신": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.0987,
    "nova": 0.3097,
    "flow": 0.3177
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
     "n": 150,
     "acc": 62.0,
     "adjustedAcc": 56.7,
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
   "graded": 423,
   "globalBlend": 0.654
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1326,
    "nova": 0.2936,
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
    "taro": 0.2885,
    "diana": 0.0883,
    "nova": 0.3367,
    "flow": 0.2866
   },
   "acc": {
    "taro": {
     "n": 537,
     "acc": 49.2,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 175,
     "acc": 28.6,
     "adjustedAcc": 37.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 446,
     "acc": 59.4,
     "adjustedAcc": 57.4,
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
   "graded": 1307,
   "globalBlend": 0.38
  },
  "2차전지": {
   "weights": {
    "taro": 0.3056,
    "diana": 0.0959,
    "nova": 0.3353,
    "flow": 0.2633
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
     "n": 105,
     "acc": 51.4,
     "adjustedAcc": 50.7,
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
   "graded": 1070,
   "globalBlend": 0.428
  },
  "보험": {
   "weights": {
    "taro": 0.276,
    "diana": 0.1124,
    "nova": 0.3044,
    "flow": 0.3072
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
    "taro": 0.2843,
    "diana": 0.1065,
    "nova": 0.3088,
    "flow": 0.3004
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
     "n": 335,
     "acc": 56.4,
     "adjustedAcc": 54.7,
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
   "graded": 2794,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.114,
    "nova": 0.3356,
    "flow": 0.2763
   },
   "acc": {
    "taro": {
     "n": 529,
     "acc": 49.0,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 194,
     "acc": 55.7,
     "adjustedAcc": 53.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 493,
     "acc": 62.3,
     "adjustedAcc": 59.9,
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
    "diana": 0.1016,
    "nova": 0.3143,
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
     "n": 97,
     "acc": 41.2,
     "adjustedAcc": 46.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 300,
     "acc": 56.3,
     "adjustedAcc": 54.5,
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
   "graded": 764,
   "globalBlend": 0.512
  },
  "방산": {
   "weights": {
    "taro": 0.275,
    "diana": 0.1007,
    "nova": 0.3103,
    "flow": 0.314
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 44.2,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 33.3,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 116,
     "acc": 56.9,
     "adjustedAcc": 53.4,
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
   "graded": 281,
   "globalBlend": 0.74
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2899,
    "diana": 0.1112,
    "nova": 0.2989,
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
    "taro": 0.2769,
    "diana": 0.0969,
    "nova": 0.3122,
    "flow": 0.314
   },
   "acc": {
    "taro": {
     "n": 678,
     "acc": 54.3,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 239,
     "acc": 48.5,
     "adjustedAcc": 49.0,
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
   "graded": 1639,
   "globalBlend": 0.328
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1129,
    "nova": 0.2902,
    "flow": 0.3196
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 48.1,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 79.5,
     "adjustedAcc": 57.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 102,
     "acc": 43.1,
     "adjustedAcc": 46.8,
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
   "graded": 367,
   "globalBlend": 0.686
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2898,
    "diana": 0.0986,
    "nova": 0.3033,
    "flow": 0.3082
   },
   "acc": {
    "taro": {
     "n": 409,
     "acc": 53.3,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 138,
     "acc": 42.8,
     "adjustedAcc": 46.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 339,
     "acc": 55.8,
     "adjustedAcc": 54.2,
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
   "graded": 905,
   "globalBlend": 0.469
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.1083,
    "nova": 0.286,
    "flow": 0.3251
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
     "n": 61,
     "acc": 55.7,
     "adjustedAcc": 51.9,
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
   "graded": 518,
   "globalBlend": 0.607
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2835,
    "diana": 0.0966,
    "nova": 0.3261,
    "flow": 0.2937
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 52.0,
     "adjustedAcc": 51.4,
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
     "n": 242,
     "acc": 63.6,
     "adjustedAcc": 59.1,
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
   "graded": 698,
   "globalBlend": 0.534
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2692,
    "diana": 0.0932,
    "nova": 0.3192,
    "flow": 0.3184
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 38.7,
     "adjustedAcc": 42.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 97,
     "acc": 19.6,
     "adjustedAcc": 36.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 53.4,
     "adjustedAcc": 52.3,
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
   "graded": 628,
   "globalBlend": 0.56
  },
  "기계": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.1039,
    "nova": 0.3094,
    "flow": 0.3185
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
    "taro": 0.2882,
    "diana": 0.0988,
    "nova": 0.3268,
    "flow": 0.2862
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
    "taro": 0.2793,
    "diana": 0.1291,
    "nova": 0.2815,
    "flow": 0.3101
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 47.0,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 82.5,
     "adjustedAcc": 63.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 200,
     "acc": 40.5,
     "adjustedAcc": 44.1,
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
   "graded": 514,
   "globalBlend": 0.609
  },
  "여행레저": {
   "weights": {
    "taro": 0.2927,
    "diana": 0.0945,
    "nova": 0.3078,
    "flow": 0.305
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 58.3,
     "adjustedAcc": 54.2,
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
     "n": 103,
     "acc": 55.3,
     "adjustedAcc": 52.5,
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
   "graded": 296,
   "globalBlend": 0.73
  }
 }
};
