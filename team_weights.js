// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-19 11:11",
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
   "taro": 0.2747,
   "diana": 0.1232,
   "nova": 0.296,
   "flow": 0.3061
  },
  "acc": {
   "taro": {
    "n": 11160,
    "acc": 51.8,
    "adjustedAcc": 51.8,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4617,
    "acc": 55.7,
    "adjustedAcc": 55.6,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9013,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2036,
    "acc": 55.7,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26826,
  "team": {
   "hit": 7414,
   "miss": 7055,
   "n": 14469,
   "acc": 51.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.0994,
    "nova": 0.2687,
    "flow": 0.3532
   },
   "acc": {
    "taro": {
     "n": 1327,
     "acc": 51.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 409,
     "acc": 42.8,
     "adjustedAcc": 44.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1119,
     "acc": 51.0,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 412,
     "acc": 63.3,
     "adjustedAcc": 60.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3267,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2995,
    "diana": 0.1141,
    "nova": 0.2875,
    "flow": 0.2988
   },
   "acc": {
    "taro": {
     "n": 638,
     "acc": 59.1,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 188,
     "acc": 55.3,
     "adjustedAcc": 53.2,
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
     "n": 192,
     "acc": 59.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1556,
   "globalBlend": 0.34
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2572,
    "diana": 0.1343,
    "nova": 0.3131,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 555,
     "acc": 44.1,
     "adjustedAcc": 45.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 249,
     "acc": 60.2,
     "adjustedAcc": 56.9,
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
     "n": 122,
     "acc": 50.8,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1411,
   "globalBlend": 0.362
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2965,
    "diana": 0.1175,
    "nova": 0.3149,
    "flow": 0.271
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 53.1,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 206,
     "acc": 48.5,
     "adjustedAcc": 49.1,
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
     "n": 97,
     "acc": 37.1,
     "adjustedAcc": 44.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1075,
   "globalBlend": 0.427
  },
  "통신": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.1184,
    "nova": 0.2975,
    "flow": 0.3113
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 59,
     "acc": 52.5,
     "adjustedAcc": 50.8,
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
     "n": 83,
     "acc": 63.9,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 492,
   "globalBlend": 0.619
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2788,
    "diana": 0.1569,
    "nova": 0.2727,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 519,
     "acc": 52.4,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 232,
     "acc": 76.3,
     "adjustedAcc": 67.3,
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
     "n": 76,
     "acc": 55.3,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1241,
   "globalBlend": 0.392
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2835,
    "diana": 0.1033,
    "nova": 0.322,
    "flow": 0.2911
   },
   "acc": {
    "taro": {
     "n": 614,
     "acc": 48.4,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 299,
     "acc": 38.1,
     "adjustedAcc": 41.5,
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
     "n": 167,
     "acc": 46.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1551,
   "globalBlend": 0.34
  },
  "2차전지": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.1088,
    "nova": 0.3229,
    "flow": 0.2621
   },
   "acc": {
    "taro": {
     "n": 587,
     "acc": 62.0,
     "adjustedAcc": 60.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 178,
     "acc": 51.7,
     "adjustedAcc": 51.0,
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
     "n": 23,
     "acc": 43.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1265,
   "globalBlend": 0.387
  },
  "보험": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1399,
    "nova": 0.288,
    "flow": 0.2949
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 51.2,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 80.6,
     "adjustedAcc": 63.8,
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
     "n": 41,
     "acc": 51.2,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 511,
   "globalBlend": 0.61
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2854,
    "diana": 0.1185,
    "nova": 0.297,
    "flow": 0.2991
   },
   "acc": {
    "taro": {
     "n": 1459,
     "acc": 55.5,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 574,
     "acc": 56.6,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1191,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 189,
     "acc": 59.8,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3413,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1274,
    "nova": 0.3206,
    "flow": 0.2782
   },
   "acc": {
    "taro": {
     "n": 639,
     "acc": 49.8,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 327,
     "acc": 57.5,
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
     "n": 59,
     "acc": 45.8,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1542,
   "globalBlend": 0.342
  },
  "조선": {
   "weights": {
    "taro": 0.2656,
    "diana": 0.1333,
    "nova": 0.3006,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 44.9,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 166,
     "acc": 62.0,
     "adjustedAcc": 57.0,
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
     "n": 63,
     "acc": 52.4,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 901,
   "globalBlend": 0.47
  },
  "방산": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.1189,
    "nova": 0.2956,
    "flow": 0.3101
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 47.9,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 48.1,
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
     "n": 9,
     "acc": 100.0,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 333,
   "globalBlend": 0.706
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2848,
    "diana": 0.1458,
    "nova": 0.2827,
    "flow": 0.2867
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 55.6,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 131,
     "acc": 82.4,
     "adjustedAcc": 66.9,
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
   "graded": 558,
   "globalBlend": 0.589
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2766,
    "diana": 0.1184,
    "nova": 0.2991,
    "flow": 0.3059
   },
   "acc": {
    "taro": {
     "n": 808,
     "acc": 53.3,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 408,
     "acc": 55.9,
     "adjustedAcc": 54.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 675,
     "acc": 59.3,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 99,
     "acc": 63.6,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1990,
   "globalBlend": 0.287
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2677,
    "diana": 0.1427,
    "nova": 0.2787,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 43.9,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 73,
     "acc": 89.0,
     "adjustedAcc": 64.8,
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
     "n": 110,
     "acc": 58.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 455,
   "globalBlend": 0.637
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2913,
    "diana": 0.1112,
    "nova": 0.2939,
    "flow": 0.3035
   },
   "acc": {
    "taro": {
     "n": 499,
     "acc": 53.7,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 224,
     "acc": 46.0,
     "adjustedAcc": 47.4,
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
   "graded": 1104,
   "globalBlend": 0.42
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2809,
    "diana": 0.1341,
    "nova": 0.2702,
    "flow": 0.3148
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 108,
     "acc": 67.6,
     "adjustedAcc": 58.3,
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
   "graded": 637,
   "globalBlend": 0.557
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.282,
    "diana": 0.1267,
    "nova": 0.3096,
    "flow": 0.2816
   },
   "acc": {
    "taro": {
     "n": 329,
     "acc": 52.3,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 60.4,
     "adjustedAcc": 55.6,
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
     "n": 122,
     "acc": 45.9,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 843,
   "globalBlend": 0.487
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.264,
    "diana": 0.114,
    "nova": 0.3086,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 38.1,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 166,
     "acc": 36.7,
     "adjustedAcc": 42.3,
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
   "graded": 776,
   "globalBlend": 0.508
  },
  "기계": {
   "weights": {
    "taro": 0.2666,
    "diana": 0.1279,
    "nova": 0.2943,
    "flow": 0.3111
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 38.2,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 74.0,
     "adjustedAcc": 57.1,
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
   "graded": 268,
   "globalBlend": 0.749
  },
  "로봇": {
   "weights": {
    "taro": 0.2946,
    "diana": 0.1024,
    "nova": 0.3193,
    "flow": 0.2837
   },
   "acc": {
    "taro": {
     "n": 257,
     "acc": 57.6,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 25.2,
     "adjustedAcc": 38.1,
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
     "n": 60,
     "acc": 43.3,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 641,
   "globalBlend": 0.555
  },
  "식음료": {
   "weights": {
    "taro": 0.265,
    "diana": 0.1643,
    "nova": 0.2707,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 43.8,
     "adjustedAcc": 45.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 88.5,
     "adjustedAcc": 70.7,
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
   "graded": 653,
   "globalBlend": 0.551
  },
  "여행레저": {
   "weights": {
    "taro": 0.2893,
    "diana": 0.1143,
    "nova": 0.2981,
    "flow": 0.2982
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 54.9,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 47,
     "acc": 21.3,
     "adjustedAcc": 41.9,
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
     "n": 43,
     "acc": 41.9,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 343,
   "globalBlend": 0.7
  }
 }
};
