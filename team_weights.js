// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-21 09:49",
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
   "taro": 0.2653,
   "diana": 0.123,
   "nova": 0.3005,
   "flow": 0.3111
  },
  "acc": {
   "taro": {
    "n": 11946,
    "acc": 50.2,
    "adjustedAcc": 50.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 5233,
    "acc": 55.2,
    "adjustedAcc": 55.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9036,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2166,
    "acc": 55.8,
    "adjustedAcc": 55.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 28381,
  "team": {
   "hit": 7921,
   "miss": 7524,
   "n": 15445,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2765,
    "diana": 0.0979,
    "nova": 0.2738,
    "flow": 0.3519
   },
   "acc": {
    "taro": {
     "n": 1419,
     "acc": 50.9,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 461,
     "acc": 41.6,
     "adjustedAcc": 43.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1125,
     "acc": 51.4,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 433,
     "acc": 62.4,
     "adjustedAcc": 59.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3438,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2888,
    "diana": 0.1129,
    "nova": 0.2914,
    "flow": 0.3068
   },
   "acc": {
    "taro": {
     "n": 677,
     "acc": 57.0,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 212,
     "acc": 53.8,
     "adjustedAcc": 52.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 539,
     "acc": 58.3,
     "adjustedAcc": 56.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 206,
     "acc": 60.2,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1634,
   "globalBlend": 0.329
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2467,
    "diana": 0.1351,
    "nova": 0.3131,
    "flow": 0.305
   },
   "acc": {
    "taro": {
     "n": 593,
     "acc": 42.8,
     "adjustedAcc": 44.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 282,
     "acc": 60.6,
     "adjustedAcc": 57.5,
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
     "n": 137,
     "acc": 54.0,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1497,
   "globalBlend": 0.348
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.287,
    "diana": 0.1175,
    "nova": 0.3215,
    "flow": 0.274
   },
   "acc": {
    "taro": {
     "n": 452,
     "acc": 50.7,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 237,
     "acc": 47.7,
     "adjustedAcc": 48.5,
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
     "n": 103,
     "acc": 36.9,
     "adjustedAcc": 43.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1142,
   "globalBlend": 0.412
  },
  "통신": {
   "weights": {
    "taro": 0.2628,
    "diana": 0.1182,
    "nova": 0.3014,
    "flow": 0.3176
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 47.4,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 51.6,
     "adjustedAcc": 50.5,
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
     "n": 90,
     "acc": 64.4,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 517,
   "globalBlend": 0.607
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2687,
    "diana": 0.161,
    "nova": 0.2775,
    "flow": 0.2929
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
     "n": 260,
     "acc": 75.8,
     "adjustedAcc": 67.6,
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
     "n": 79,
     "acc": 53.2,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1308,
   "globalBlend": 0.38
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2756,
    "diana": 0.103,
    "nova": 0.3267,
    "flow": 0.2947
   },
   "acc": {
    "taro": {
     "n": 650,
     "acc": 46.8,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 338,
     "acc": 37.9,
     "adjustedAcc": 41.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 472,
     "acc": 57.4,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 174,
     "acc": 46.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1634,
   "globalBlend": 0.329
  },
  "2차전지": {
   "weights": {
    "taro": 0.2928,
    "diana": 0.1111,
    "nova": 0.3316,
    "flow": 0.2646
   },
   "acc": {
    "taro": {
     "n": 630,
     "acc": 58.6,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 201,
     "acc": 52.2,
     "adjustedAcc": 51.4,
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
   "graded": 1335,
   "globalBlend": 0.375
  },
  "보험": {
   "weights": {
    "taro": 0.2718,
    "diana": 0.1416,
    "nova": 0.2877,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 52.4,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 81.2,
     "adjustedAcc": 65.1,
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
     "n": 45,
     "acc": 55.6,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 545,
   "globalBlend": 0.595
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.119,
    "nova": 0.3035,
    "flow": 0.3034
   },
   "acc": {
    "taro": {
     "n": 1565,
     "acc": 53.2,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 654,
     "acc": 55.8,
     "adjustedAcc": 54.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1197,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 205,
     "acc": 59.0,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3621,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2664,
    "diana": 0.1257,
    "nova": 0.3269,
    "flow": 0.2809
   },
   "acc": {
    "taro": {
     "n": 687,
     "acc": 48.2,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 376,
     "acc": 55.6,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 518,
     "acc": 60.8,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 62,
     "acc": 45.2,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1643,
   "globalBlend": 0.327
  },
  "조선": {
   "weights": {
    "taro": 0.2557,
    "diana": 0.1309,
    "nova": 0.3054,
    "flow": 0.3079
   },
   "acc": {
    "taro": {
     "n": 380,
     "acc": 42.6,
     "adjustedAcc": 44.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 189,
     "acc": 58.7,
     "adjustedAcc": 55.3,
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
     "n": 65,
     "acc": 53.8,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 950,
   "globalBlend": 0.457
  },
  "방산": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.1194,
    "nova": 0.2988,
    "flow": 0.3159
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 45.7,
     "adjustedAcc": 47.4,
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
     "n": 125,
     "acc": 56.0,
     "adjustedAcc": 53.1,
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
   "graded": 351,
   "globalBlend": 0.695
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.1498,
    "nova": 0.2867,
    "flow": 0.2906
   },
   "acc": {
    "taro": {
     "n": 243,
     "acc": 51.9,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 147,
     "acc": 82.3,
     "adjustedAcc": 67.8,
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
   "graded": 594,
   "globalBlend": 0.574
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2667,
    "diana": 0.1176,
    "nova": 0.3044,
    "flow": 0.3112
   },
   "acc": {
    "taro": {
     "n": 864,
     "acc": 51.4,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 456,
     "acc": 54.8,
     "adjustedAcc": 53.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 678,
     "acc": 59.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 102,
     "acc": 63.7,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2100,
   "globalBlend": 0.276
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2602,
    "diana": 0.1439,
    "nova": 0.2818,
    "flow": 0.3141
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 42.7,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 87.5,
     "adjustedAcc": 65.0,
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
     "n": 113,
     "acc": 57.5,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 472,
   "globalBlend": 0.629
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2871,
    "diana": 0.1106,
    "nova": 0.2954,
    "flow": 0.307
   },
   "acc": {
    "taro": {
     "n": 536,
     "acc": 53.5,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 256,
     "acc": 46.1,
     "adjustedAcc": 47.3,
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
     "n": 23,
     "acc": 69.6,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1174,
   "globalBlend": 0.405
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1374,
    "nova": 0.2701,
    "flow": 0.3181
   },
   "acc": {
    "taro": {
     "n": 322,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 127,
     "acc": 70.1,
     "adjustedAcc": 60.3,
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
     "n": 28,
     "acc": 75.0,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 681,
   "globalBlend": 0.54
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1308,
    "nova": 0.3131,
    "flow": 0.2812
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 50.7,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 157,
     "acc": 62.4,
     "adjustedAcc": 57.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 255,
     "acc": 60.8,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 125,
     "acc": 44.0,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 890,
   "globalBlend": 0.473
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2571,
    "diana": 0.1131,
    "nova": 0.3097,
    "flow": 0.32
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 38.3,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 193,
     "acc": 37.8,
     "adjustedAcc": 42.5,
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
     "n": 7,
     "acc": 57.1,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 834,
   "globalBlend": 0.49
  },
  "기계": {
   "weights": {
    "taro": 0.2581,
    "diana": 0.1275,
    "nova": 0.2984,
    "flow": 0.3159
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 36.7,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 69.6,
     "adjustedAcc": 56.2,
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
   "graded": 284,
   "globalBlend": 0.738
  },
  "로봇": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.1015,
    "nova": 0.3256,
    "flow": 0.2885
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 54.6,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 24.6,
     "adjustedAcc": 37.2,
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
     "n": 64,
     "acc": 43.8,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 672,
   "globalBlend": 0.543
  },
  "식음료": {
   "weights": {
    "taro": 0.2594,
    "diana": 0.1669,
    "nova": 0.271,
    "flow": 0.3026
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 44.3,
     "adjustedAcc": 45.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 159,
     "acc": 87.4,
     "adjustedAcc": 71.3,
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
     "n": 4,
     "acc": 75.0,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 702,
   "globalBlend": 0.533
  },
  "여행레저": {
   "weights": {
    "taro": 0.2794,
    "diana": 0.1149,
    "nova": 0.3025,
    "flow": 0.3031
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 52.3,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 26.9,
     "adjustedAcc": 43.0,
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
     "n": 47,
     "acc": 44.7,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 363,
   "globalBlend": 0.688
  }
 }
};
