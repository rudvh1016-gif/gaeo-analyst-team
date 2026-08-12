// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-12 09:42",
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
   "taro": 0.2794,
   "diana": 0.104,
   "nova": 0.297,
   "flow": 0.3196
  },
  "acc": {
   "taro": {
    "n": 9711,
    "acc": 53.0,
    "adjustedAcc": 52.9,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3067,
    "acc": 50.6,
    "adjustedAcc": 50.5,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8916,
    "acc": 57.4,
    "adjustedAcc": 57.3,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1747,
    "acc": 57.9,
    "adjustedAcc": 57.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 23441,
  "team": {
   "hit": 6519,
   "miss": 2558,
   "n": 9077,
   "acc": 71.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2814,
    "diana": 0.0842,
    "nova": 0.2647,
    "flow": 0.3696
   },
   "acc": {
    "taro": {
     "n": 1171,
     "acc": 54.1,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 282,
     "acc": 37.6,
     "adjustedAcc": 41.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1088,
     "acc": 52.8,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 361,
     "acc": 69.0,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2902,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2985,
    "diana": 0.0983,
    "nova": 0.2877,
    "flow": 0.3154
   },
   "acc": {
    "taro": {
     "n": 575,
     "acc": 60.9,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 133,
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 524,
     "acc": 60.1,
     "adjustedAcc": 58.2,
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
   "graded": 1395,
   "globalBlend": 0.364
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2603,
    "diana": 0.116,
    "nova": 0.3209,
    "flow": 0.3028
   },
   "acc": {
    "taro": {
     "n": 486,
     "acc": 44.0,
     "adjustedAcc": 45.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 161,
     "acc": 54.7,
     "adjustedAcc": 52.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 474,
     "acc": 59.7,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 99,
     "acc": 51.5,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1220,
   "globalBlend": 0.396
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2973,
    "diana": 0.099,
    "nova": 0.323,
    "flow": 0.2806
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
     "n": 139,
     "acc": 36.0,
     "adjustedAcc": 42.5,
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
   "graded": 945,
   "globalBlend": 0.458
  },
  "통신": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.1039,
    "nova": 0.2989,
    "flow": 0.321
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
     "n": 42,
     "acc": 45.2,
     "adjustedAcc": 48.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 154,
     "acc": 61.0,
     "adjustedAcc": 56.2,
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
    "taro": 0.2816,
    "diana": 0.1397,
    "nova": 0.2796,
    "flow": 0.2992
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
     "acc": 52.1,
     "adjustedAcc": 51.6,
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
    "taro": 0.293,
    "diana": 0.0922,
    "nova": 0.3229,
    "flow": 0.2918
   },
   "acc": {
    "taro": {
     "n": 554,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
   "graded": 1378,
   "globalBlend": 0.367
  },
  "2차전지": {
   "weights": {
    "taro": 0.3117,
    "diana": 0.1007,
    "nova": 0.321,
    "flow": 0.2666
   },
   "acc": {
    "taro": {
     "n": 515,
     "acc": 64.3,
     "adjustedAcc": 61.6,
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
     "n": 475,
     "acc": 67.8,
     "adjustedAcc": 64.2,
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
   "graded": 1117,
   "globalBlend": 0.417
  },
  "보험": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.119,
    "nova": 0.293,
    "flow": 0.3099
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
     "n": 59,
     "acc": 74.6,
     "adjustedAcc": 58.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 154,
     "acc": 53.9,
     "adjustedAcc": 52.2,
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
   "graded": 439,
   "globalBlend": 0.646
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2917,
    "diana": 0.1089,
    "nova": 0.2914,
    "flow": 0.3079
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
     "n": 379,
     "acc": 56.7,
     "adjustedAcc": 55.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1176,
     "acc": 59.9,
     "adjustedAcc": 59.0,
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
   "graded": 2958,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.1186,
    "nova": 0.3263,
    "flow": 0.2779
   },
   "acc": {
    "taro": {
     "n": 548,
     "acc": 49.3,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 218,
     "acc": 56.4,
     "adjustedAcc": 54.1,
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
    "taro": 0.2702,
    "diana": 0.1084,
    "nova": 0.3106,
    "flow": 0.3108
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 44.1,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 110,
     "acc": 46.4,
     "adjustedAcc": 48.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 313,
     "acc": 57.2,
     "adjustedAcc": 55.2,
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
   "graded": 803,
   "globalBlend": 0.499
  },
  "방산": {
   "weights": {
    "taro": 0.278,
    "diana": 0.106,
    "nova": 0.3,
    "flow": 0.316
   },
   "acc": {
    "taro": {
     "n": 143,
     "acc": 45.5,
     "adjustedAcc": 47.5,
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
     "n": 124,
     "acc": 57.3,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 5,
     "acc": 80.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 300,
   "globalBlend": 0.727
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2937,
    "diana": 0.1187,
    "nova": 0.285,
    "flow": 0.3027
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 58.6,
     "adjustedAcc": 55.3,
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
     "n": 202,
     "acc": 52.5,
     "adjustedAcc": 51.6,
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
   "graded": 478,
   "globalBlend": 0.626
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2823,
    "diana": 0.1026,
    "nova": 0.2984,
    "flow": 0.3167
   },
   "acc": {
    "taro": {
     "n": 701,
     "acc": 54.8,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 266,
     "acc": 50.8,
     "adjustedAcc": 50.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 666,
     "acc": 59.6,
     "adjustedAcc": 58.1,
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
   "graded": 1723,
   "globalBlend": 0.317
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2779,
    "diana": 0.1198,
    "nova": 0.2786,
    "flow": 0.3238
   },
   "acc": {
    "taro": {
     "n": 138,
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
     "n": 107,
     "acc": 43.0,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 92,
     "acc": 62.0,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 386,
   "globalBlend": 0.675
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2943,
    "diana": 0.1027,
    "nova": 0.2947,
    "flow": 0.3084
   },
   "acc": {
    "taro": {
     "n": 429,
     "acc": 54.3,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 154,
     "acc": 44.8,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 355,
     "acc": 55.5,
     "adjustedAcc": 54.1,
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
   "graded": 957,
   "globalBlend": 0.455
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2842,
    "diana": 0.1142,
    "nova": 0.2725,
    "flow": 0.3291
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
     "n": 68,
     "acc": 60.3,
     "adjustedAcc": 53.7,
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
   "graded": 548,
   "globalBlend": 0.593
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2897,
    "diana": 0.1035,
    "nova": 0.3112,
    "flow": 0.2956
   },
   "acc": {
    "taro": {
     "n": 289,
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
     "n": 255,
     "acc": 61.2,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 105,
     "acc": 47.6,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 738,
   "globalBlend": 0.52
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2733,
    "diana": 0.0996,
    "nova": 0.3075,
    "flow": 0.3196
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 40.1,
     "adjustedAcc": 43.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 113,
     "acc": 27.4,
     "adjustedAcc": 39.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 268,
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
   "graded": 669,
   "globalBlend": 0.545
  },
  "기계": {
   "weights": {
    "taro": 0.2699,
    "diana": 0.1096,
    "nova": 0.2993,
    "flow": 0.3212
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 31.5,
     "adjustedAcc": 42.0,
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
     "n": 97,
     "acc": 56.7,
     "adjustedAcc": 53.0,
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
   "graded": 229,
   "globalBlend": 0.777
  },
  "로봇": {
   "weights": {
    "taro": 0.2911,
    "diana": 0.1007,
    "nova": 0.3201,
    "flow": 0.2881
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 56.7,
     "adjustedAcc": 54.4,
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
     "n": 213,
     "acc": 67.6,
     "adjustedAcc": 61.3,
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
   "graded": 560,
   "globalBlend": 0.588
  },
  "식음료": {
   "weights": {
    "taro": 0.2802,
    "diana": 0.1364,
    "nova": 0.2737,
    "flow": 0.3097
   },
   "acc": {
    "taro": {
     "n": 248,
     "acc": 47.6,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 89,
     "acc": 84.3,
     "adjustedAcc": 64.6,
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
    "taro": 0.2943,
    "diana": 0.0989,
    "nova": 0.2981,
    "flow": 0.3088
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
