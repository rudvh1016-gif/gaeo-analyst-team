// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-10 10:11",
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
   "taro": 0.2737,
   "diana": 0.0894,
   "nova": 0.334,
   "flow": 0.3029
  },
  "acc": {
   "taro": {
    "n": 9034,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2416,
    "acc": 45.5,
    "adjustedAcc": 45.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8040,
    "acc": 61.6,
    "adjustedAcc": 61.4,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1608,
    "acc": 56.3,
    "adjustedAcc": 55.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 21098,
  "team": {
   "hit": 6206,
   "miss": 2123,
   "n": 8329,
   "acc": 74.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2817,
    "diana": 0.0776,
    "nova": 0.2888,
    "flow": 0.3519
   },
   "acc": {
    "taro": {
     "n": 1094,
     "acc": 55.9,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 232,
     "acc": 36.2,
     "adjustedAcc": 40.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 988,
     "acc": 57.2,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 338,
     "acc": 68.9,
     "adjustedAcc": 64.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2652,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2952,
    "diana": 0.0866,
    "nova": 0.3185,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 543,
     "acc": 62.1,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 108,
     "acc": 44.4,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 478,
     "acc": 65.3,
     "adjustedAcc": 62.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 156,
     "acc": 65.4,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1285,
   "globalBlend": 0.384
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2602,
    "diana": 0.1013,
    "nova": 0.3472,
    "flow": 0.2912
   },
   "acc": {
    "taro": {
     "n": 456,
     "acc": 44.3,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 47.2,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 434,
     "acc": 62.2,
     "adjustedAcc": 59.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 48.9,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1105,
   "globalBlend": 0.42
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2904,
    "diana": 0.0863,
    "nova": 0.3541,
    "flow": 0.2692
   },
   "acc": {
    "taro": {
     "n": 352,
     "acc": 52.3,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 27.0,
     "adjustedAcc": 39.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 314,
     "acc": 64.6,
     "adjustedAcc": 60.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 81,
     "acc": 33.3,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 858,
   "globalBlend": 0.483
  },
  "통신": {
   "weights": {
    "taro": 0.271,
    "diana": 0.093,
    "nova": 0.3292,
    "flow": 0.3068
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 48.8,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 32,
     "acc": 37.5,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 143,
     "acc": 64.3,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 62,
     "acc": 64.5,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 403,
   "globalBlend": 0.665
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.269,
    "diana": 0.1239,
    "nova": 0.3143,
    "flow": 0.2928
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 48.5,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 73.2,
     "adjustedAcc": 61.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 369,
     "acc": 56.6,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 54.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 935,
   "globalBlend": 0.461
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2874,
    "diana": 0.0833,
    "nova": 0.3558,
    "flow": 0.2735
   },
   "acc": {
    "taro": {
     "n": 521,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 159,
     "acc": 26.4,
     "adjustedAcc": 36.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 420,
     "acc": 62.4,
     "adjustedAcc": 59.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 143,
     "acc": 40.6,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1243,
   "globalBlend": 0.392
  },
  "2차전지": {
   "weights": {
    "taro": 0.3001,
    "diana": 0.0905,
    "nova": 0.3558,
    "flow": 0.2536
   },
   "acc": {
    "taro": {
     "n": 492,
     "acc": 64.6,
     "adjustedAcc": 61.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 94,
     "acc": 51.1,
     "adjustedAcc": 50.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 430,
     "acc": 74.4,
     "adjustedAcc": 69.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 8,
     "acc": 25.0,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1024,
   "globalBlend": 0.439
  },
  "보험": {
   "weights": {
    "taro": 0.2758,
    "diana": 0.1035,
    "nova": 0.3234,
    "flow": 0.2972
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 49.4,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 68.9,
     "adjustedAcc": 55.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 139,
     "acc": 58.3,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 39,
     "acc": 51.3,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 395,
   "globalBlend": 0.669
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2776,
    "diana": 0.1024,
    "nova": 0.3308,
    "flow": 0.2891
   },
   "acc": {
    "taro": {
     "n": 1145,
     "acc": 56.2,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 295,
     "acc": 55.9,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1054,
     "acc": 65.1,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 141,
     "acc": 61.7,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2635,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.1047,
    "nova": 0.3541,
    "flow": 0.2686
   },
   "acc": {
    "taro": {
     "n": 507,
     "acc": 48.9,
     "adjustedAcc": 49.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 168,
     "acc": 51.8,
     "adjustedAcc": 51.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 467,
     "acc": 64.5,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 44,
     "acc": 34.1,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1186,
   "globalBlend": 0.403
  },
  "조선": {
   "weights": {
    "taro": 0.269,
    "diana": 0.092,
    "nova": 0.335,
    "flow": 0.3039
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 44.9,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 88,
     "acc": 33.0,
     "adjustedAcc": 42.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 284,
     "acc": 59.5,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 54,
     "acc": 53.7,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 727,
   "globalBlend": 0.524
  },
  "방산": {
   "weights": {
    "taro": 0.2731,
    "diana": 0.0943,
    "nova": 0.3304,
    "flow": 0.3022
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 44.4,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 22,
     "acc": 31.8,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 110,
     "acc": 60.0,
     "adjustedAcc": 54.8,
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
   "graded": 266,
   "globalBlend": 0.75
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2853,
    "diana": 0.1025,
    "nova": 0.32,
    "flow": 0.2923
   },
   "acc": {
    "taro": {
     "n": 180,
     "acc": 56.7,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 65,
     "acc": 64.6,
     "adjustedAcc": 55.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 181,
     "acc": 58.0,
     "adjustedAcc": 54.8,
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
   "graded": 426,
   "globalBlend": 0.653
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2736,
    "diana": 0.0897,
    "nova": 0.3305,
    "flow": 0.3063
   },
   "acc": {
    "taro": {
     "n": 654,
     "acc": 54.7,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 209,
     "acc": 45.9,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 604,
     "acc": 64.9,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 87,
     "acc": 69.0,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1554,
   "globalBlend": 0.34
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2733,
    "diana": 0.1056,
    "nova": 0.3121,
    "flow": 0.3089
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 45.6,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 38,
     "acc": 78.9,
     "adjustedAcc": 57.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 94,
     "acc": 46.8,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 58.3,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 341,
   "globalBlend": 0.701
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2866,
    "diana": 0.0921,
    "nova": 0.3197,
    "flow": 0.3016
   },
   "acc": {
    "taro": {
     "n": 392,
     "acc": 53.1,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 120,
     "acc": 39.2,
     "adjustedAcc": 44.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 320,
     "acc": 57.5,
     "adjustedAcc": 55.5,
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
   "graded": 851,
   "globalBlend": 0.485
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1022,
    "nova": 0.3064,
    "flow": 0.3142
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 47.5,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 53.6,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 180,
     "acc": 46.7,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 85.7,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 490,
   "globalBlend": 0.62
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.089,
    "nova": 0.3475,
    "flow": 0.2839
   },
   "acc": {
    "taro": {
     "n": 270,
     "acc": 51.1,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 72,
     "acc": 29.2,
     "adjustedAcc": 42.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 229,
     "acc": 66.8,
     "adjustedAcc": 61.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 94,
     "acc": 44.7,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 665,
   "globalBlend": 0.546
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2665,
    "diana": 0.0876,
    "nova": 0.3354,
    "flow": 0.3105
   },
   "acc": {
    "taro": {
     "n": 262,
     "acc": 37.4,
     "adjustedAcc": 41.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 85,
     "acc": 14.1,
     "adjustedAcc": 35.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 240,
     "acc": 54.2,
     "adjustedAcc": 52.8,
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
   "graded": 592,
   "globalBlend": 0.575
  },
  "기계": {
   "weights": {
    "taro": 0.2667,
    "diana": 0.0956,
    "nova": 0.3301,
    "flow": 0.3076
   },
   "acc": {
    "taro": {
     "n": 83,
     "acc": 31.3,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 26,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 86,
     "acc": 59.3,
     "adjustedAcc": 53.9,
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
   "graded": 202,
   "globalBlend": 0.798
  },
  "로봇": {
   "weights": {
    "taro": 0.2815,
    "diana": 0.0961,
    "nova": 0.3454,
    "flow": 0.2769
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 56.0,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 51.9,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 195,
     "acc": 71.3,
     "adjustedAcc": 63.2,
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
   "graded": 508,
   "globalBlend": 0.612
  },
  "식음료": {
   "weights": {
    "taro": 0.2742,
    "diana": 0.1196,
    "nova": 0.3023,
    "flow": 0.304
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 44.5,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 70,
     "acc": 80.0,
     "adjustedAcc": 61.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 184,
     "acc": 42.4,
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
   "graded": 474,
   "globalBlend": 0.628
  },
  "여행레저": {
   "weights": {
    "taro": 0.2893,
    "diana": 0.0889,
    "nova": 0.3257,
    "flow": 0.2961
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 58.3,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 0.0,
     "adjustedAcc": 40.0,
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
     "n": 39,
     "acc": 41.0,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 281,
   "globalBlend": 0.74
  }
 }
};
