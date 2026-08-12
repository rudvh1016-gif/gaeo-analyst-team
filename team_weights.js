// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-12 09:12",
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
   "taro": 0.2798,
   "diana": 0.1043,
   "nova": 0.2971,
   "flow": 0.3188
  },
  "acc": {
   "taro": {
    "n": 9700,
    "acc": 53.0,
    "adjustedAcc": 52.9,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3067,
    "acc": 50.6,
    "adjustedAcc": 50.6,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8903,
    "acc": 57.3,
    "adjustedAcc": 57.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1745,
    "acc": 57.8,
    "adjustedAcc": 57.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 23415,
  "team": {
   "hit": 6502,
   "miss": 2557,
   "n": 9059,
   "acc": 71.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2818,
    "diana": 0.0844,
    "nova": 0.2662,
    "flow": 0.3676
   },
   "acc": {
    "taro": {
     "n": 1171,
     "acc": 54.0,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 281,
     "acc": 37.4,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1087,
     "acc": 52.9,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 361,
     "acc": 68.4,
     "adjustedAcc": 63.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2900,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2989,
    "diana": 0.0974,
    "nova": 0.2885,
    "flow": 0.3152
   },
   "acc": {
    "taro": {
     "n": 573,
     "acc": 60.9,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 132,
     "acc": 49.2,
     "adjustedAcc": 49.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 521,
     "acc": 60.3,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 163,
     "acc": 66.3,
     "adjustedAcc": 59.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1389,
   "globalBlend": 0.365
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2603,
    "diana": 0.1169,
    "nova": 0.3208,
    "flow": 0.3021
   },
   "acc": {
    "taro": {
     "n": 486,
     "acc": 43.8,
     "adjustedAcc": 45.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 160,
     "acc": 55.0,
     "adjustedAcc": 52.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 474,
     "acc": 59.5,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 98,
     "acc": 51.0,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1218,
   "globalBlend": 0.396
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2974,
    "diana": 0.0993,
    "nova": 0.323,
    "flow": 0.2802
   },
   "acc": {
    "taro": {
     "n": 375,
     "acc": 52.3,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 138,
     "acc": 36.2,
     "adjustedAcc": 42.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 344,
     "acc": 59.9,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 87,
     "acc": 35.6,
     "adjustedAcc": 44.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 944,
   "globalBlend": 0.459
  },
  "통신": {
   "weights": {
    "taro": 0.2764,
    "diana": 0.1037,
    "nova": 0.2994,
    "flow": 0.3204
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 41,
     "acc": 43.9,
     "adjustedAcc": 48.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 61.3,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 67,
     "acc": 67.2,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 438,
   "globalBlend": 0.646
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2815,
    "diana": 0.1396,
    "nova": 0.2802,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 441,
     "acc": 51.7,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 148,
     "acc": 75.7,
     "adjustedAcc": 64.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 413,
     "acc": 52.3,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 54.2,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1061,
   "globalBlend": 0.43
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2928,
    "diana": 0.0924,
    "nova": 0.3231,
    "flow": 0.2917
   },
   "acc": {
    "taro": {
     "n": 555,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 199,
     "acc": 31.7,
     "adjustedAcc": 38.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 471,
     "acc": 57.7,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 154,
     "acc": 44.8,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1379,
   "globalBlend": 0.367
  },
  "2차전지": {
   "weights": {
    "taro": 0.3123,
    "diana": 0.1008,
    "nova": 0.3206,
    "flow": 0.2663
   },
   "acc": {
    "taro": {
     "n": 514,
     "acc": 64.4,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 116,
     "acc": 52.6,
     "adjustedAcc": 51.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 474,
     "acc": 67.7,
     "adjustedAcc": 64.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 11,
     "acc": 36.4,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1115,
   "globalBlend": 0.418
  },
  "보험": {
   "weights": {
    "taro": 0.2784,
    "diana": 0.1196,
    "nova": 0.2926,
    "flow": 0.3094
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 47.8,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 60,
     "acc": 75.0,
     "adjustedAcc": 58.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 53.5,
     "adjustedAcc": 52.0,
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
   "graded": 441,
   "globalBlend": 0.645
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2924,
    "diana": 0.1084,
    "nova": 0.291,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 1245,
     "acc": 58.1,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 380,
     "acc": 56.3,
     "adjustedAcc": 54.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1176,
     "acc": 59.7,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 158,
     "acc": 64.6,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2959,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.1184,
    "nova": 0.3263,
    "flow": 0.2776
   },
   "acc": {
    "taro": {
     "n": 549,
     "acc": 49.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 217,
     "acc": 56.2,
     "adjustedAcc": 54.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 517,
     "acc": 61.1,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 38.0,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1333,
   "globalBlend": 0.375
  },
  "조선": {
   "weights": {
    "taro": 0.2701,
    "diana": 0.1088,
    "nova": 0.311,
    "flow": 0.3102
   },
   "acc": {
    "taro": {
     "n": 318,
     "acc": 44.0,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 46.8,
     "adjustedAcc": 48.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 310,
     "acc": 57.4,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 60,
     "acc": 51.7,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 799,
   "globalBlend": 0.5
  },
  "방산": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1063,
    "nova": 0.3009,
    "flow": 0.3147
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
     "n": 28,
     "acc": 39.3,
     "adjustedAcc": 48.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 123,
     "acc": 57.7,
     "adjustedAcc": 53.9,
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
   "graded": 297,
   "globalBlend": 0.729
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2945,
    "diana": 0.1189,
    "nova": 0.2845,
    "flow": 0.3021
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 58.9,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 84,
     "acc": 72.6,
     "adjustedAcc": 59.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 203,
     "acc": 52.2,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 1,
     "acc": 100.0,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 480,
   "globalBlend": 0.625
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2829,
    "diana": 0.1029,
    "nova": 0.2977,
    "flow": 0.3165
   },
   "acc": {
    "taro": {
     "n": 698,
     "acc": 54.9,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 267,
     "acc": 50.9,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 664,
     "acc": 59.5,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 67.8,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1719,
   "globalBlend": 0.318
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2783,
    "diana": 0.12,
    "nova": 0.2789,
    "flow": 0.3227
   },
   "acc": {
    "taro": {
     "n": 136,
     "acc": 47.8,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 49,
     "acc": 83.7,
     "adjustedAcc": 59.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 105,
     "acc": 42.9,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 91,
     "acc": 61.5,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 381,
   "globalBlend": 0.677
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2943,
    "diana": 0.1035,
    "nova": 0.2939,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 430,
     "acc": 54.2,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 156,
     "acc": 45.5,
     "adjustedAcc": 47.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 357,
     "acc": 55.2,
     "adjustedAcc": 53.9,
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
   "graded": 962,
   "globalBlend": 0.454
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.1148,
    "nova": 0.2725,
    "flow": 0.3284
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 50.4,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 69,
     "acc": 60.9,
     "adjustedAcc": 54.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 204,
     "acc": 43.1,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 20,
     "acc": 90.0,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 549,
   "globalBlend": 0.593
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2899,
    "diana": 0.1037,
    "nova": 0.3106,
    "flow": 0.2959
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 53.6,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 89,
     "acc": 43.8,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 256,
     "acc": 60.9,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 106,
     "acc": 48.1,
     "adjustedAcc": 49.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 742,
   "globalBlend": 0.519
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2733,
    "diana": 0.1003,
    "nova": 0.3068,
    "flow": 0.3195
   },
   "acc": {
    "taro": {
     "n": 283,
     "acc": 39.9,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 27.9,
     "adjustedAcc": 39.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 266,
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
   "graded": 664,
   "globalBlend": 0.546
  },
  "기계": {
   "weights": {
    "taro": 0.2714,
    "diana": 0.1097,
    "nova": 0.2981,
    "flow": 0.3207
   },
   "acc": {
    "taro": {
     "n": 89,
     "acc": 32.6,
     "adjustedAcc": 42.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 60.6,
     "adjustedAcc": 52.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 94,
     "acc": 55.3,
     "adjustedAcc": 52.3,
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
   "graded": 223,
   "globalBlend": 0.782
  },
  "로봇": {
   "weights": {
    "taro": 0.2907,
    "diana": 0.1008,
    "nova": 0.3209,
    "flow": 0.2877
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 56.5,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 71,
     "acc": 39.4,
     "adjustedAcc": 46.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 212,
     "acc": 67.9,
     "adjustedAcc": 61.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 52,
     "acc": 38.5,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 558,
   "globalBlend": 0.589
  },
  "식음료": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.1368,
    "nova": 0.2735,
    "flow": 0.309
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 47.8,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 90,
     "acc": 84.4,
     "adjustedAcc": 64.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 215,
     "acc": 42.8,
     "adjustedAcc": 45.4,
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
   "graded": 554,
   "globalBlend": 0.591
  },
  "여행레저": {
   "weights": {
    "taro": 0.2945,
    "diana": 0.0991,
    "nova": 0.2981,
    "flow": 0.3082
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 56.8,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 2.7,
     "adjustedAcc": 38.9,
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
   "graded": 310,
   "globalBlend": 0.721
  }
 }
};
