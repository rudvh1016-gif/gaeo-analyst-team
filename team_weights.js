// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-20 16:02",
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
   "taro": 0.2705,
   "diana": 0.1252,
   "nova": 0.2977,
   "flow": 0.3067
  },
  "acc": {
   "taro": {
    "n": 11521,
    "acc": 51.1,
    "adjustedAcc": 51.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4939,
    "acc": 56.1,
    "adjustedAcc": 56.0,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9022,
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
  "graded": 27578,
  "team": {
   "hit": 7684,
   "miss": 7264,
   "n": 14948,
   "acc": 51.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1007,
    "nova": 0.2711,
    "flow": 0.351
   },
   "acc": {
    "taro": {
     "n": 1365,
     "acc": 50.9,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 437,
     "acc": 43.0,
     "adjustedAcc": 44.5,
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
    "taro": 0.296,
    "diana": 0.1136,
    "nova": 0.2895,
    "flow": 0.3009
   },
   "acc": {
    "taro": {
     "n": 655,
     "acc": 58.3,
     "adjustedAcc": 57.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 200,
     "acc": 54.0,
     "adjustedAcc": 52.5,
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
    "taro": 0.2525,
    "diana": 0.136,
    "nova": 0.3127,
    "flow": 0.2988
   },
   "acc": {
    "taro": {
     "n": 573,
     "acc": 43.6,
     "adjustedAcc": 44.7,
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
   "graded": 1455,
   "globalBlend": 0.355
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.1188,
    "nova": 0.3164,
    "flow": 0.2715
   },
   "acc": {
    "taro": {
     "n": 434,
     "acc": 52.5,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 219,
     "acc": 48.9,
     "adjustedAcc": 49.3,
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
   "graded": 1102,
   "globalBlend": 0.421
  },
  "통신": {
   "weights": {
    "taro": 0.2673,
    "diana": 0.1201,
    "nova": 0.2991,
    "flow": 0.3136
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 48.3,
     "adjustedAcc": 48.9,
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
   "graded": 506,
   "globalBlend": 0.613
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.1603,
    "nova": 0.2743,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 538,
     "acc": 51.3,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 249,
     "acc": 76.3,
     "adjustedAcc": 67.8,
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
    "taro": 0.2803,
    "diana": 0.1041,
    "nova": 0.3236,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 627,
     "acc": 47.8,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 318,
     "acc": 38.4,
     "adjustedAcc": 41.6,
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
   "graded": 1585,
   "globalBlend": 0.335
  },
  "2차전지": {
   "weights": {
    "taro": 0.301,
    "diana": 0.1106,
    "nova": 0.3272,
    "flow": 0.2613
   },
   "acc": {
    "taro": {
     "n": 608,
     "acc": 60.5,
     "adjustedAcc": 58.8,
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
   "graded": 1305,
   "globalBlend": 0.38
  },
  "보험": {
   "weights": {
    "taro": 0.2751,
    "diana": 0.1419,
    "nova": 0.2874,
    "flow": 0.2956
   },
   "acc": {
    "taro": {
     "n": 225,
     "acc": 52.0,
     "adjustedAcc": 51.3,
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
   "graded": 528,
   "globalBlend": 0.602
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.1193,
    "nova": 0.2991,
    "flow": 0.3011
   },
   "acc": {
    "taro": {
     "n": 1508,
     "acc": 54.6,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 616,
     "acc": 56.3,
     "adjustedAcc": 55.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1195,
     "acc": 59.2,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 198,
     "acc": 59.6,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3517,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2706,
    "diana": 0.1291,
    "nova": 0.3235,
    "flow": 0.2769
   },
   "acc": {
    "taro": {
     "n": 663,
     "acc": 49.0,
     "adjustedAcc": 49.2,
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
    "taro": 0.2612,
    "diana": 0.1347,
    "nova": 0.3018,
    "flow": 0.3024
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
     "n": 176,
     "acc": 61.9,
     "adjustedAcc": 57.1,
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
   "graded": 923,
   "globalBlend": 0.464
  },
  "방산": {
   "weights": {
    "taro": 0.2716,
    "diana": 0.1205,
    "nova": 0.2966,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 47.3,
     "adjustedAcc": 48.4,
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
   "graded": 341,
   "globalBlend": 0.701
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2789,
    "diana": 0.1503,
    "nova": 0.2838,
    "flow": 0.287
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 53.9,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 140,
     "acc": 83.6,
     "adjustedAcc": 68.1,
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
   "graded": 576,
   "globalBlend": 0.581
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.1208,
    "nova": 0.3006,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 834,
     "acc": 52.8,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 434,
     "acc": 56.7,
     "adjustedAcc": 55.2,
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
   "graded": 2046,
   "globalBlend": 0.281
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2645,
    "diana": 0.1454,
    "nova": 0.2799,
    "flow": 0.3102
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 43.4,
     "adjustedAcc": 46.2,
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
     "n": 112,
     "acc": 57.1,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 462,
   "globalBlend": 0.634
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.289,
    "diana": 0.1126,
    "nova": 0.2946,
    "flow": 0.3038
   },
   "acc": {
    "taro": {
     "n": 514,
     "acc": 53.5,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 240,
     "acc": 46.7,
     "adjustedAcc": 47.8,
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
    "taro": 0.2769,
    "diana": 0.1378,
    "nova": 0.2704,
    "flow": 0.3149
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
   "graded": 658,
   "globalBlend": 0.549
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1305,
    "nova": 0.3109,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 340,
     "acc": 51.5,
     "adjustedAcc": 51.1,
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
     "n": 121,
     "acc": 45.5,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 863,
   "globalBlend": 0.481
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2605,
    "diana": 0.1158,
    "nova": 0.3091,
    "flow": 0.3147
   },
   "acc": {
    "taro": {
     "n": 351,
     "acc": 38.2,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 181,
     "acc": 38.7,
     "adjustedAcc": 43.2,
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
   "graded": 808,
   "globalBlend": 0.498
  },
  "기계": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.1295,
    "nova": 0.2959,
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
     "n": 54,
     "acc": 72.2,
     "adjustedAcc": 56.9,
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
   "graded": 277,
   "globalBlend": 0.743
  },
  "로봇": {
   "weights": {
    "taro": 0.2909,
    "diana": 0.1028,
    "nova": 0.3215,
    "flow": 0.2847
   },
   "acc": {
    "taro": {
     "n": 263,
     "acc": 56.7,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 116,
     "acc": 24.1,
     "adjustedAcc": 37.3,
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
     "n": 62,
     "acc": 43.5,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 654,
   "globalBlend": 0.55
  },
  "식음료": {
   "weights": {
    "taro": 0.2627,
    "diana": 0.1682,
    "nova": 0.2701,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 313,
     "acc": 44.4,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 151,
     "acc": 88.7,
     "adjustedAcc": 71.6,
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
   "graded": 679,
   "globalBlend": 0.541
  },
  "여행레저": {
   "weights": {
    "taro": 0.2834,
    "diana": 0.1166,
    "nova": 0.3006,
    "flow": 0.2994
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
