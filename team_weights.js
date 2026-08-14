// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-14 09:39",
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
   "taro": 0.2829,
   "diana": 0.1153,
   "nova": 0.2922,
   "flow": 0.3096
  },
  "acc": {
   "taro": {
    "n": 10390,
    "acc": 53.3,
    "adjustedAcc": 53.3,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3988,
    "acc": 54.0,
    "adjustedAcc": 53.9,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8989,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1892,
    "acc": 56.7,
    "adjustedAcc": 56.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 25259,
  "team": {
   "hit": 6923,
   "miss": 2871,
   "n": 9794,
   "acc": 70.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.0937,
    "nova": 0.2641,
    "flow": 0.362
   },
   "acc": {
    "taro": {
     "n": 1252,
     "acc": 52.2,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 360,
     "acc": 41.4,
     "adjustedAcc": 43.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1110,
     "acc": 51.4,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 389,
     "acc": 66.1,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3111,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.1072,
    "nova": 0.2844,
    "flow": 0.3057
   },
   "acc": {
    "taro": {
     "n": 602,
     "acc": 60.0,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 168,
     "acc": 53.0,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 536,
     "acc": 58.4,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 177,
     "acc": 62.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1483,
   "globalBlend": 0.35
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2631,
    "diana": 0.127,
    "nova": 0.3133,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 519,
     "acc": 44.5,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 210,
     "acc": 58.1,
     "adjustedAcc": 55.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 483,
     "acc": 58.2,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 113,
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1325,
   "globalBlend": 0.376
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.302,
    "diana": 0.1094,
    "nova": 0.3136,
    "flow": 0.2751
   },
   "acc": {
    "taro": {
     "n": 395,
     "acc": 53.7,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 177,
     "acc": 44.1,
     "adjustedAcc": 46.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 349,
     "acc": 58.7,
     "adjustedAcc": 56.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 93,
     "acc": 37.6,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1014,
   "globalBlend": 0.441
  },
  "통신": {
   "weights": {
    "taro": 0.2828,
    "diana": 0.1121,
    "nova": 0.2947,
    "flow": 0.3104
   },
   "acc": {
    "taro": {
     "n": 184,
     "acc": 52.7,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 51,
     "acc": 49.0,
     "adjustedAcc": 49.7,
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
     "n": 73,
     "acc": 63.0,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 462,
   "globalBlend": 0.634
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2874,
    "diana": 0.15,
    "nova": 0.2692,
    "flow": 0.2935
   },
   "acc": {
    "taro": {
     "n": 483,
     "acc": 54.5,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 198,
     "acc": 77.3,
     "adjustedAcc": 67.0,
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
     "n": 70,
     "acc": 57.1,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1165,
   "globalBlend": 0.407
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2916,
    "diana": 0.0977,
    "nova": 0.3202,
    "flow": 0.2905
   },
   "acc": {
    "taro": {
     "n": 584,
     "acc": 49.5,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 260,
     "acc": 35.0,
     "adjustedAcc": 39.7,
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
     "n": 163,
     "acc": 46.0,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1478,
   "globalBlend": 0.351
  },
  "2차전지": {
   "weights": {
    "taro": 0.3223,
    "diana": 0.1043,
    "nova": 0.3156,
    "flow": 0.2578
   },
   "acc": {
    "taro": {
     "n": 546,
     "acc": 65.9,
     "adjustedAcc": 63.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 155,
     "acc": 51.6,
     "adjustedAcc": 50.9,
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
     "n": 17,
     "acc": 35.3,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1195,
   "globalBlend": 0.401
  },
  "보험": {
   "weights": {
    "taro": 0.281,
    "diana": 0.1304,
    "nova": 0.288,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 49.5,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 77.5,
     "adjustedAcc": 61.0,
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
   "graded": 475,
   "globalBlend": 0.627
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3001,
    "diana": 0.1131,
    "nova": 0.2889,
    "flow": 0.2979
   },
   "acc": {
    "taro": {
     "n": 1352,
     "acc": 58.9,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 503,
     "acc": 56.7,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1188,
     "acc": 59.3,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 170,
     "acc": 61.8,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3213,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2788,
    "diana": 0.125,
    "nova": 0.319,
    "flow": 0.2772
   },
   "acc": {
    "taro": {
     "n": 592,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 279,
     "acc": 58.1,
     "adjustedAcc": 55.6,
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
     "n": 55,
     "acc": 43.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1443,
   "globalBlend": 0.357
  },
  "조선": {
   "weights": {
    "taro": 0.2731,
    "diana": 0.1242,
    "nova": 0.2981,
    "flow": 0.3045
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 46.1,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 143,
     "acc": 58.7,
     "adjustedAcc": 54.8,
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
     "n": 61,
     "acc": 54.1,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 856,
   "globalBlend": 0.483
  },
  "방산": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.1134,
    "nova": 0.2938,
    "flow": 0.3115
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 47.1,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 39.4,
     "adjustedAcc": 47.7,
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
     "n": 7,
     "acc": 100.0,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 318,
   "globalBlend": 0.716
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2965,
    "diana": 0.1333,
    "nova": 0.2789,
    "flow": 0.2912
   },
   "acc": {
    "taro": {
     "n": 205,
     "acc": 60.0,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 79.5,
     "adjustedAcc": 64.2,
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
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 518,
   "globalBlend": 0.607
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.1104,
    "nova": 0.2972,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 749,
     "acc": 55.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 346,
     "acc": 53.2,
     "adjustedAcc": 52.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 673,
     "acc": 59.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 95,
     "acc": 64.2,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1863,
   "globalBlend": 0.3
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2743,
    "diana": 0.1346,
    "nova": 0.2782,
    "flow": 0.3128
   },
   "acc": {
    "taro": {
     "n": 149,
     "acc": 43.0,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 87.5,
     "adjustedAcc": 63.0,
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
     "n": 100,
     "acc": 57.0,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 420,
   "globalBlend": 0.656
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2957,
    "diana": 0.1075,
    "nova": 0.2903,
    "flow": 0.3065
   },
   "acc": {
    "taro": {
     "n": 459,
     "acc": 54.2,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 192,
     "acc": 45.3,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 358,
     "acc": 55.0,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 21,
     "acc": 71.4,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1030,
   "globalBlend": 0.437
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2857,
    "diana": 0.1258,
    "nova": 0.2689,
    "flow": 0.3196
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 50.4,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 92,
     "acc": 65.2,
     "adjustedAcc": 56.6,
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
     "n": 22,
     "acc": 81.8,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 596,
   "globalBlend": 0.573
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.29,
    "diana": 0.1171,
    "nova": 0.3069,
    "flow": 0.286
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 53.7,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 119,
     "acc": 55.5,
     "adjustedAcc": 52.7,
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
     "n": 113,
     "acc": 46.9,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 792,
   "globalBlend": 0.503
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1081,
    "nova": 0.3047,
    "flow": 0.3136
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 40.1,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 147,
     "acc": 34.0,
     "adjustedAcc": 41.2,
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
   "graded": 725,
   "globalBlend": 0.525
  },
  "기계": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.1203,
    "nova": 0.2926,
    "flow": 0.313
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 37.6,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 69.8,
     "adjustedAcc": 55.2,
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
     "n": 9,
     "acc": 100.0,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 250,
   "globalBlend": 0.762
  },
  "로봇": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.1009,
    "nova": 0.3133,
    "flow": 0.2832
   },
   "acc": {
    "taro": {
     "n": 239,
     "acc": 60.3,
     "adjustedAcc": 56.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 95,
     "acc": 29.5,
     "adjustedAcc": 40.9,
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
     "n": 55,
     "acc": 41.8,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 602,
   "globalBlend": 0.571
  },
  "식음료": {
   "weights": {
    "taro": 0.2732,
    "diana": 0.1542,
    "nova": 0.2704,
    "flow": 0.3022
   },
   "acc": {
    "taro": {
     "n": 268,
     "acc": 44.4,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 118,
     "acc": 88.1,
     "adjustedAcc": 68.9,
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
   "graded": 599,
   "globalBlend": 0.572
  },
  "여행레저": {
   "weights": {
    "taro": 0.2958,
    "diana": 0.1085,
    "nova": 0.2946,
    "flow": 0.3012
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 55.6,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 16.3,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 109,
     "acc": 55.0,
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
   "graded": 326,
   "globalBlend": 0.71
  }
 }
};
