// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-14 09:09",
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
   "taro": 0.283,
   "diana": 0.1148,
   "nova": 0.2923,
   "flow": 0.3099
  },
  "acc": {
   "taro": {
    "n": 10391,
    "acc": 53.3,
    "adjustedAcc": 53.3,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3996,
    "acc": 53.9,
    "adjustedAcc": 53.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8990,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1891,
    "acc": 56.7,
    "adjustedAcc": 56.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 25268,
  "team": {
   "hit": 6928,
   "miss": 2871,
   "n": 9799,
   "acc": 70.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2802,
    "diana": 0.0933,
    "nova": 0.2642,
    "flow": 0.3623
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
     "n": 362,
     "acc": 41.2,
     "adjustedAcc": 43.4,
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
   "graded": 3113,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3025,
    "diana": 0.1071,
    "nova": 0.2844,
    "flow": 0.3059
   },
   "acc": {
    "taro": {
     "n": 601,
     "acc": 59.9,
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
   "graded": 1482,
   "globalBlend": 0.351
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2635,
    "diana": 0.126,
    "nova": 0.3135,
    "flow": 0.2969
   },
   "acc": {
    "taro": {
     "n": 518,
     "acc": 44.6,
     "adjustedAcc": 45.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 212,
     "acc": 57.5,
     "adjustedAcc": 54.8,
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
   "graded": 1326,
   "globalBlend": 0.376
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1087,
    "nova": 0.3138,
    "flow": 0.2753
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
     "n": 175,
     "acc": 43.4,
     "adjustedAcc": 46.1,
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
   "graded": 1012,
   "globalBlend": 0.442
  },
  "통신": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.1118,
    "nova": 0.2949,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 52.2,
     "adjustedAcc": 51.3,
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
     "n": 74,
     "acc": 63.5,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 465,
   "globalBlend": 0.632
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2871,
    "diana": 0.1494,
    "nova": 0.2689,
    "flow": 0.2946
   },
   "acc": {
    "taro": {
     "n": 479,
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
     "n": 69,
     "acc": 58.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1160,
   "globalBlend": 0.408
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2913,
    "diana": 0.0977,
    "nova": 0.3204,
    "flow": 0.2906
   },
   "acc": {
    "taro": {
     "n": 585,
     "acc": 49.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 264,
     "acc": 35.2,
     "adjustedAcc": 39.8,
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
   "graded": 1483,
   "globalBlend": 0.35
  },
  "2차전지": {
   "weights": {
    "taro": 0.3222,
    "diana": 0.1041,
    "nova": 0.3158,
    "flow": 0.258
   },
   "acc": {
    "taro": {
     "n": 545,
     "acc": 65.9,
     "adjustedAcc": 63.0,
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
   "graded": 1194,
   "globalBlend": 0.401
  },
  "보험": {
   "weights": {
    "taro": 0.2808,
    "diana": 0.1307,
    "nova": 0.2878,
    "flow": 0.3006
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
     "n": 82,
     "acc": 78.0,
     "adjustedAcc": 61.4,
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
   "graded": 477,
   "globalBlend": 0.626
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.1132,
    "nova": 0.2885,
    "flow": 0.2976
   },
   "acc": {
    "taro": {
     "n": 1356,
     "acc": 59.1,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 505,
     "acc": 56.8,
     "adjustedAcc": 55.5,
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
   "graded": 3219,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.1247,
    "nova": 0.3186,
    "flow": 0.2771
   },
   "acc": {
    "taro": {
     "n": 591,
     "acc": 50.4,
     "adjustedAcc": 50.4,
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
   "graded": 1442,
   "globalBlend": 0.357
  },
  "조선": {
   "weights": {
    "taro": 0.2732,
    "diana": 0.124,
    "nova": 0.2982,
    "flow": 0.3046
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
    "diana": 0.1131,
    "nova": 0.2939,
    "flow": 0.3117
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
    "taro": 0.2964,
    "diana": 0.1325,
    "nova": 0.2793,
    "flow": 0.2918
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 59.8,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 110,
     "acc": 79.1,
     "adjustedAcc": 63.9,
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
   "graded": 515,
   "globalBlend": 0.608
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.1094,
    "nova": 0.2976,
    "flow": 0.3065
   },
   "acc": {
    "taro": {
     "n": 752,
     "acc": 55.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 346,
     "acc": 52.6,
     "adjustedAcc": 51.9,
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
   "graded": 1866,
   "globalBlend": 0.3
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.1344,
    "nova": 0.2785,
    "flow": 0.3125
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
     "n": 99,
     "acc": 56.6,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 419,
   "globalBlend": 0.656
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2959,
    "diana": 0.1067,
    "nova": 0.2905,
    "flow": 0.3068
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
     "n": 190,
     "acc": 44.7,
     "adjustedAcc": 46.8,
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
   "graded": 1028,
   "globalBlend": 0.438
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2855,
    "diana": 0.1262,
    "nova": 0.2687,
    "flow": 0.3195
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
     "n": 94,
     "acc": 66.0,
     "adjustedAcc": 57.0,
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
   "graded": 598,
   "globalBlend": 0.572
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2897,
    "diana": 0.1169,
    "nova": 0.3071,
    "flow": 0.2862
   },
   "acc": {
    "taro": {
     "n": 308,
     "acc": 53.6,
     "adjustedAcc": 52.6,
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
   "graded": 793,
   "globalBlend": 0.502
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.274,
    "diana": 0.1083,
    "nova": 0.3041,
    "flow": 0.3137
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 40.2,
     "adjustedAcc": 43.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 145,
     "acc": 34.5,
     "adjustedAcc": 41.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 269,
     "acc": 52.0,
     "adjustedAcc": 51.4,
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
   "graded": 719,
   "globalBlend": 0.527
  },
  "기계": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.1199,
    "nova": 0.2925,
    "flow": 0.3131
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 38.2,
     "adjustedAcc": 44.6,
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
   "graded": 251,
   "globalBlend": 0.761
  },
  "로봇": {
   "weights": {
    "taro": 0.3023,
    "diana": 0.1006,
    "nova": 0.3135,
    "flow": 0.2835
   },
   "acc": {
    "taro": {
     "n": 238,
     "acc": 60.1,
     "adjustedAcc": 56.7,
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
   "graded": 601,
   "globalBlend": 0.571
  },
  "식음료": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1521,
    "nova": 0.271,
    "flow": 0.303
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
     "acc": 86.4,
     "adjustedAcc": 68.1,
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
    "taro": 0.2957,
    "diana": 0.1076,
    "nova": 0.2956,
    "flow": 0.3011
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 55.6,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 15.6,
     "adjustedAcc": 40.6,
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
     "n": 41,
     "acc": 41.5,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 332,
   "globalBlend": 0.707
  }
 }
};
