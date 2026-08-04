// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 10:44",
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
   "taro": 0.3328,
   "diana": 0.071,
   "nova": 0.3095,
   "flow": 0.2867
  },
  "acc": {
   "taro": {
    "n": 7447,
    "acc": 59.8,
    "adjustedAcc": 59.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1233,
    "acc": 37.6,
    "adjustedAcc": 38.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6170,
    "acc": 59.7,
    "adjustedAcc": 59.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1289,
    "acc": 55.1,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 16139,
  "team": {
   "hit": 5791,
   "miss": 1465,
   "n": 7256,
   "acc": 79.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3469,
    "diana": 0.0758,
    "nova": 0.2505,
    "flow": 0.3269
   },
   "acc": {
    "taro": {
     "n": 908,
     "acc": 66.0,
     "adjustedAcc": 64.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 113,
     "acc": 38.1,
     "adjustedAcc": 44.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 795,
     "acc": 52.2,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 287,
     "acc": 68.6,
     "adjustedAcc": 63.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2103,
   "globalBlend": 0.276
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3587,
    "diana": 0.0729,
    "nova": 0.2866,
    "flow": 0.2819
   },
   "acc": {
    "taro": {
     "n": 444,
     "acc": 74.3,
     "adjustedAcc": 69.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 35.2,
     "adjustedAcc": 45.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 376,
     "acc": 63.0,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 125,
     "acc": 67.2,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 999,
   "globalBlend": 0.445
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3164,
    "diana": 0.0877,
    "nova": 0.3084,
    "flow": 0.2874
   },
   "acc": {
    "taro": {
     "n": 372,
     "acc": 53.0,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 41.9,
     "adjustedAcc": 47.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 336,
     "acc": 57.1,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 67,
     "acc": 52.2,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 837,
   "globalBlend": 0.489
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3377,
    "diana": 0.074,
    "nova": 0.3283,
    "flow": 0.26
   },
   "acc": {
    "taro": {
     "n": 293,
     "acc": 60.4,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 60,
     "acc": 15.0,
     "adjustedAcc": 38.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 241,
     "acc": 65.6,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 70,
     "acc": 32.9,
     "adjustedAcc": 43.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 664,
   "globalBlend": 0.546
  },
  "통신": {
   "weights": {
    "taro": 0.3236,
    "diana": 0.0804,
    "nova": 0.3054,
    "flow": 0.2906
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 57.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 18,
     "acc": 44.4,
     "adjustedAcc": 49.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 112,
     "acc": 61.6,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 45,
     "acc": 64.4,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 313,
   "globalBlend": 0.719
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3061,
    "diana": 0.0961,
    "nova": 0.3097,
    "flow": 0.2881
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 64.6,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 279,
     "acc": 58.8,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 56.8,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 691,
   "globalBlend": 0.537
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3414,
    "diana": 0.0762,
    "nova": 0.3214,
    "flow": 0.261
   },
   "acc": {
    "taro": {
     "n": 426,
     "acc": 57.0,
     "adjustedAcc": 55.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 19.5,
     "adjustedAcc": 37.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 313,
     "acc": 58.5,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 122,
     "acc": 36.1,
     "adjustedAcc": 43.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 948,
   "globalBlend": 0.458
  },
  "2차전지": {
   "weights": {
    "taro": 0.3631,
    "diana": 0.077,
    "nova": 0.3154,
    "flow": 0.2445
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 78.8,
     "adjustedAcc": 72.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 52.8,
     "adjustedAcc": 50.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 339,
     "acc": 74.0,
     "adjustedAcc": 67.8,
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
   "graded": 799,
   "globalBlend": 0.5
  },
  "보험": {
   "weights": {
    "taro": 0.3259,
    "diana": 0.085,
    "nova": 0.3036,
    "flow": 0.2855
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 53.4,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 58.3,
     "adjustedAcc": 51.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 105,
     "acc": 54.3,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 45.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 308,
   "globalBlend": 0.722
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.334,
    "diana": 0.0899,
    "nova": 0.3064,
    "flow": 0.2698
   },
   "acc": {
    "taro": {
     "n": 940,
     "acc": 63.9,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 158,
     "acc": 53.2,
     "adjustedAcc": 51.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 802,
     "acc": 63.3,
     "adjustedAcc": 61.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 121,
     "acc": 58.7,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2021,
   "globalBlend": 0.284
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3258,
    "diana": 0.0847,
    "nova": 0.3288,
    "flow": 0.2606
   },
   "acc": {
    "taro": {
     "n": 429,
     "acc": 55.7,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 86,
     "acc": 38.4,
     "adjustedAcc": 45.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 360,
     "acc": 62.5,
     "adjustedAcc": 59.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 27.0,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 912,
   "globalBlend": 0.467
  },
  "조선": {
   "weights": {
    "taro": 0.3258,
    "diana": 0.0735,
    "nova": 0.3062,
    "flow": 0.2946
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 53.4,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 2.0,
     "adjustedAcc": 35.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 221,
     "acc": 54.8,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 55.6,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 554,
   "globalBlend": 0.591
  },
  "방산": {
   "weights": {
    "taro": 0.327,
    "diana": 0.0789,
    "nova": 0.3065,
    "flow": 0.2875
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 54.1,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 12,
     "acc": 33.3,
     "adjustedAcc": 48.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 83,
     "acc": 57.8,
     "adjustedAcc": 53.2,
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
   "graded": 205,
   "globalBlend": 0.796
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3306,
    "diana": 0.0783,
    "nova": 0.3088,
    "flow": 0.2823
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 60.6,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 32,
     "acc": 31.2,
     "adjustedAcc": 46.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 137,
     "acc": 62.0,
     "adjustedAcc": 56.4,
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
   "graded": 324,
   "globalBlend": 0.712
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3248,
    "diana": 0.0737,
    "nova": 0.3059,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 543,
     "acc": 63.5,
     "adjustedAcc": 61.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 105,
     "acc": 36.2,
     "adjustedAcc": 43.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 467,
     "acc": 64.7,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 76,
     "acc": 73.7,
     "adjustedAcc": 59.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1191,
   "globalBlend": 0.402
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3232,
    "diana": 0.0837,
    "nova": 0.3024,
    "flow": 0.2907
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 47.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 17,
     "acc": 58.8,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 62,
     "acc": 48.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 64,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 243,
   "globalBlend": 0.767
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3193,
    "diana": 0.08,
    "nova": 0.3037,
    "flow": 0.2969
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 53.9,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 59,
     "acc": 30.5,
     "adjustedAcc": 43.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 236,
     "acc": 56.8,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 16,
     "acc": 81.2,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 632,
   "globalBlend": 0.559
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.325,
    "diana": 0.0874,
    "nova": 0.2925,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 48.2,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 46.4,
     "adjustedAcc": 49.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 132,
     "acc": 40.2,
     "adjustedAcc": 44.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 1,
     "acc": 0.0,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 354,
   "globalBlend": 0.693
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3335,
    "diana": 0.076,
    "nova": 0.3215,
    "flow": 0.2691
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 58.3,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 41,
     "acc": 9.8,
     "adjustedAcc": 39.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 177,
     "acc": 63.8,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 35.6,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 514,
   "globalBlend": 0.609
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3103,
    "diana": 0.0782,
    "nova": 0.3155,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 42.1,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 42,
     "acc": 9.5,
     "adjustedAcc": 39.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 176,
     "acc": 56.2,
     "adjustedAcc": 53.7,
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
   "graded": 436,
   "globalBlend": 0.647
  },
  "로봇": {
   "weights": {
    "taro": 0.3275,
    "diana": 0.0898,
    "nova": 0.3138,
    "flow": 0.269
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 65.0,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 100.0,
     "adjustedAcc": 59.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 71.0,
     "adjustedAcc": 61.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 44.7,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 397,
   "globalBlend": 0.668
  },
  "식음료": {
   "weights": {
    "taro": 0.3096,
    "diana": 0.0944,
    "nova": 0.2967,
    "flow": 0.2993
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 34.5,
     "adjustedAcc": 41.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 75.0,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 127,
     "acc": 40.2,
     "adjustedAcc": 44.9,
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
   "graded": 323,
   "globalBlend": 0.712
  },
  "여행레저": {
   "weights": {
    "taro": 0.3375,
    "diana": 0.0765,
    "nova": 0.3053,
    "flow": 0.2806
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 65.6,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 16,
     "acc": 0.0,
     "adjustedAcc": 44.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 76,
     "acc": 56.6,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 33.3,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 221,
   "globalBlend": 0.784
  }
 }
};
