// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-12 11:42",
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
   "taro": 0.2802,
   "diana": 0.1039,
   "nova": 0.2956,
   "flow": 0.3203
  },
  "acc": {
   "taro": {
    "n": 9700,
    "acc": 53.0,
    "adjustedAcc": 53.0,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3062,
    "acc": 50.5,
    "adjustedAcc": 50.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8903,
    "acc": 57.2,
    "adjustedAcc": 57.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1748,
    "acc": 58.0,
    "adjustedAcc": 57.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 23413,
  "team": {
   "hit": 6493,
   "miss": 2571,
   "n": 9064,
   "acc": 71.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2811,
    "diana": 0.0846,
    "nova": 0.2632,
    "flow": 0.3711
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
     "acc": 37.7,
     "adjustedAcc": 41.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1089,
     "acc": 52.5,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 362,
     "acc": 69.1,
     "adjustedAcc": 64.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2903,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2989,
    "diana": 0.0975,
    "nova": 0.2872,
    "flow": 0.3164
   },
   "acc": {
    "taro": {
     "n": 573,
     "acc": 60.7,
     "adjustedAcc": 58.9,
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
     "n": 522,
     "acc": 60.0,
     "adjustedAcc": 58.1,
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
   "graded": 1390,
   "globalBlend": 0.365
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.261,
    "diana": 0.1165,
    "nova": 0.3193,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 488,
     "acc": 43.9,
     "adjustedAcc": 45.1,
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
     "n": 475,
     "acc": 59.2,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 100,
     "acc": 51.0,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1224,
   "globalBlend": 0.395
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2988,
    "diana": 0.0991,
    "nova": 0.3214,
    "flow": 0.2807
   },
   "acc": {
    "taro": {
     "n": 374,
     "acc": 52.7,
     "adjustedAcc": 52.0,
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
     "n": 343,
     "acc": 59.8,
     "adjustedAcc": 57.2,
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
   "graded": 942,
   "globalBlend": 0.459
  },
  "통신": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1035,
    "nova": 0.298,
    "flow": 0.3214
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 50.6,
     "adjustedAcc": 50.3,
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
   "graded": 436,
   "globalBlend": 0.647
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2821,
    "diana": 0.139,
    "nova": 0.2766,
    "flow": 0.3023
   },
   "acc": {
    "taro": {
     "n": 442,
     "acc": 52.0,
     "adjustedAcc": 51.6,
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
     "n": 414,
     "acc": 51.7,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 60,
     "acc": 56.7,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1064,
   "globalBlend": 0.429
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.0921,
    "nova": 0.323,
    "flow": 0.2915
   },
   "acc": {
    "taro": {
     "n": 553,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 200,
     "acc": 31.5,
     "adjustedAcc": 38.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 469,
     "acc": 57.8,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 153,
     "acc": 44.4,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1375,
   "globalBlend": 0.368
  },
  "2차전지": {
   "weights": {
    "taro": 0.3136,
    "diana": 0.1003,
    "nova": 0.319,
    "flow": 0.267
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 64.5,
     "adjustedAcc": 61.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 117,
     "acc": 52.1,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 476,
     "acc": 67.4,
     "adjustedAcc": 63.9,
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
   "graded": 1120,
   "globalBlend": 0.417
  },
  "보험": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1189,
    "nova": 0.2921,
    "flow": 0.3103
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
    "taro": 0.2919,
    "diana": 0.1085,
    "nova": 0.2913,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 1246,
     "acc": 58.0,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 379,
     "acc": 56.5,
     "adjustedAcc": 54.9,
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
   "graded": 2959,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1179,
    "nova": 0.3225,
    "flow": 0.2798
   },
   "acc": {
    "taro": {
     "n": 549,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 218,
     "acc": 56.0,
     "adjustedAcc": 53.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 518,
     "acc": 60.4,
     "adjustedAcc": 58.5,
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
   "graded": 1336,
   "globalBlend": 0.375
  },
  "조선": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.109,
    "nova": 0.3062,
    "flow": 0.3122
   },
   "acc": {
    "taro": {
     "n": 319,
     "acc": 44.8,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 47.3,
     "adjustedAcc": 48.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 313,
     "acc": 56.2,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 52.5,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 803,
   "globalBlend": 0.499
  },
  "방산": {
   "weights": {
    "taro": 0.2787,
    "diana": 0.1056,
    "nova": 0.2991,
    "flow": 0.3166
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
     "n": 27,
     "acc": 37.0,
     "adjustedAcc": 47.6,
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
   "graded": 299,
   "globalBlend": 0.728
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2945,
    "diana": 0.1183,
    "nova": 0.285,
    "flow": 0.3023
   },
   "acc": {
    "taro": {
     "n": 189,
     "acc": 58.7,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 83,
     "acc": 72.3,
     "adjustedAcc": 59.1,
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
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 471,
   "globalBlend": 0.629
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2816,
    "diana": 0.1023,
    "nova": 0.2989,
    "flow": 0.3171
   },
   "acc": {
    "taro": {
     "n": 700,
     "acc": 54.6,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 265,
     "acc": 50.6,
     "adjustedAcc": 50.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 666,
     "acc": 59.8,
     "adjustedAcc": 58.3,
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
   "graded": 1721,
   "globalBlend": 0.317
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.1199,
    "nova": 0.2791,
    "flow": 0.3232
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 47.1,
     "adjustedAcc": 48.4,
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
     "acc": 43.9,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 92,
     "acc": 60.9,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 386,
   "globalBlend": 0.675
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2942,
    "diana": 0.1022,
    "nova": 0.2946,
    "flow": 0.3091
   },
   "acc": {
    "taro": {
     "n": 425,
     "acc": 54.1,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 152,
     "acc": 44.1,
     "adjustedAcc": 46.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 351,
     "acc": 55.6,
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
   "graded": 947,
   "globalBlend": 0.458
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2846,
    "diana": 0.1145,
    "nova": 0.2716,
    "flow": 0.3293
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
    "taro": 0.2903,
    "diana": 0.1035,
    "nova": 0.3101,
    "flow": 0.2961
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
     "n": 254,
     "acc": 61.0,
     "adjustedAcc": 57.5,
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
   "graded": 737,
   "globalBlend": 0.52
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.0999,
    "nova": 0.305,
    "flow": 0.3205
   },
   "acc": {
    "taro": {
     "n": 283,
     "acc": 40.3,
     "adjustedAcc": 43.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 27.7,
     "adjustedAcc": 39.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 266,
     "acc": 51.5,
     "adjustedAcc": 51.0,
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
   "graded": 665,
   "globalBlend": 0.546
  },
  "기계": {
   "weights": {
    "taro": 0.2716,
    "diana": 0.1097,
    "nova": 0.2968,
    "flow": 0.3218
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 33.0,
     "adjustedAcc": 42.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 34,
     "acc": 61.8,
     "adjustedAcc": 52.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 96,
     "acc": 55.2,
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
   "graded": 228,
   "globalBlend": 0.778
  },
  "로봇": {
   "weights": {
    "taro": 0.2945,
    "diana": 0.1007,
    "nova": 0.3162,
    "flow": 0.2886
   },
   "acc": {
    "taro": {
     "n": 225,
     "acc": 57.8,
     "adjustedAcc": 55.1,
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
     "n": 214,
     "acc": 66.4,
     "adjustedAcc": 60.5,
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
   "graded": 562,
   "globalBlend": 0.587
  },
  "식음료": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1362,
    "nova": 0.2738,
    "flow": 0.3102
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 47.2,
     "adjustedAcc": 48.1,
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
     "n": 213,
     "acc": 43.2,
     "adjustedAcc": 45.6,
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
   "graded": 550,
   "globalBlend": 0.593
  },
  "여행레저": {
   "weights": {
    "taro": 0.2941,
    "diana": 0.099,
    "nova": 0.2976,
    "flow": 0.3093
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 56.5,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 2.8,
     "adjustedAcc": 39.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 106,
     "acc": 55.7,
     "adjustedAcc": 52.7,
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
   "graded": 307,
   "globalBlend": 0.723
  }
 }
};
