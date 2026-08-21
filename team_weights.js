// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-21 15:45",
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
   "taro": 0.2652,
   "diana": 0.1232,
   "nova": 0.3003,
   "flow": 0.3112
  },
  "acc": {
   "taro": {
    "n": 11940,
    "acc": 50.2,
    "adjustedAcc": 50.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 5233,
    "acc": 55.3,
    "adjustedAcc": 55.2,
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
    "n": 2171,
    "acc": 55.8,
    "adjustedAcc": 55.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 28380,
  "team": {
   "hit": 7915,
   "miss": 7532,
   "n": 15447,
   "acc": 51.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.0989,
    "nova": 0.2736,
    "flow": 0.3526
   },
   "acc": {
    "taro": {
     "n": 1418,
     "acc": 50.6,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 462,
     "acc": 42.2,
     "adjustedAcc": 43.8,
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
     "n": 432,
     "acc": 62.5,
     "adjustedAcc": 59.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3437,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2884,
    "diana": 0.1124,
    "nova": 0.2914,
    "flow": 0.3077
   },
   "acc": {
    "taro": {
     "n": 678,
     "acc": 56.9,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 212,
     "acc": 53.3,
     "adjustedAcc": 52.1,
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
     "n": 207,
     "acc": 60.4,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1636,
   "globalBlend": 0.328
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2471,
    "diana": 0.1351,
    "nova": 0.3128,
    "flow": 0.3049
   },
   "acc": {
    "taro": {
     "n": 593,
     "acc": 43.0,
     "adjustedAcc": 44.2,
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
    "taro": 0.2875,
    "diana": 0.1177,
    "nova": 0.321,
    "flow": 0.2738
   },
   "acc": {
    "taro": {
     "n": 450,
     "acc": 50.9,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 236,
     "acc": 47.9,
     "adjustedAcc": 48.6,
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
   "graded": 1139,
   "globalBlend": 0.413
  },
  "통신": {
   "weights": {
    "taro": 0.2634,
    "diana": 0.1183,
    "nova": 0.3014,
    "flow": 0.3169
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 47.6,
     "adjustedAcc": 48.5,
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
     "n": 91,
     "acc": 63.7,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 519,
   "globalBlend": 0.607
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2694,
    "diana": 0.161,
    "nova": 0.2777,
    "flow": 0.292
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
     "n": 262,
     "acc": 75.6,
     "adjustedAcc": 67.5,
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
     "n": 80,
     "acc": 52.5,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1310,
   "globalBlend": 0.379
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2754,
    "diana": 0.1031,
    "nova": 0.3273,
    "flow": 0.2942
   },
   "acc": {
    "taro": {
     "n": 650,
     "acc": 46.6,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 336,
     "acc": 37.8,
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
     "n": 173,
     "acc": 46.2,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1631,
   "globalBlend": 0.329
  },
  "2차전지": {
   "weights": {
    "taro": 0.2923,
    "diana": 0.1114,
    "nova": 0.3316,
    "flow": 0.2647
   },
   "acc": {
    "taro": {
     "n": 631,
     "acc": 58.5,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 202,
     "acc": 52.5,
     "adjustedAcc": 51.6,
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
   "graded": 1337,
   "globalBlend": 0.374
  },
  "보험": {
   "weights": {
    "taro": 0.2715,
    "diana": 0.1424,
    "nova": 0.2874,
    "flow": 0.2987
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
     "acc": 82.1,
     "adjustedAcc": 65.5,
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
    "taro": 0.2738,
    "diana": 0.1192,
    "nova": 0.3025,
    "flow": 0.3046
   },
   "acc": {
    "taro": {
     "n": 1562,
     "acc": 53.3,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 653,
     "acc": 56.0,
     "adjustedAcc": 55.1,
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
     "acc": 59.5,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3617,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2673,
    "diana": 0.1259,
    "nova": 0.3271,
    "flow": 0.2797
   },
   "acc": {
    "taro": {
     "n": 687,
     "acc": 48.3,
     "adjustedAcc": 48.6,
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
     "n": 63,
     "acc": 44.4,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1644,
   "globalBlend": 0.327
  },
  "조선": {
   "weights": {
    "taro": 0.2554,
    "diana": 0.1311,
    "nova": 0.3055,
    "flow": 0.308
   },
   "acc": {
    "taro": {
     "n": 381,
     "acc": 42.5,
     "adjustedAcc": 44.3,
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
   "graded": 951,
   "globalBlend": 0.457
  },
  "방산": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.1195,
    "nova": 0.2987,
    "flow": 0.316
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
    "taro": 0.2723,
    "diana": 0.1505,
    "nova": 0.2865,
    "flow": 0.2907
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 51.7,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 146,
     "acc": 82.9,
     "adjustedAcc": 68.0,
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
   "graded": 592,
   "globalBlend": 0.575
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2668,
    "diana": 0.1175,
    "nova": 0.3038,
    "flow": 0.312
   },
   "acc": {
    "taro": {
     "n": 864,
     "acc": 51.5,
     "adjustedAcc": 51.3,
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
     "n": 103,
     "acc": 64.1,
     "adjustedAcc": 56.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2101,
   "globalBlend": 0.276
  },
  "물류·운송": {
   "weights": {
    "taro": 0.261,
    "diana": 0.1437,
    "nova": 0.2811,
    "flow": 0.3142
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 43.5,
     "adjustedAcc": 46.2,
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
     "n": 114,
     "acc": 57.9,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 472,
   "globalBlend": 0.629
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.287,
    "diana": 0.1107,
    "nova": 0.2952,
    "flow": 0.307
   },
   "acc": {
    "taro": {
     "n": 534,
     "acc": 53.6,
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
   "graded": 1172,
   "globalBlend": 0.406
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.1374,
    "nova": 0.2697,
    "flow": 0.3179
   },
   "acc": {
    "taro": {
     "n": 322,
     "acc": 50.6,
     "adjustedAcc": 50.5,
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
    "diana": 0.1296,
    "nova": 0.3134,
    "flow": 0.2822
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 51.0,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 159,
     "acc": 61.6,
     "adjustedAcc": 56.6,
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
     "n": 125,
     "acc": 44.8,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 892,
   "globalBlend": 0.473
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2568,
    "diana": 0.1135,
    "nova": 0.3106,
    "flow": 0.3191
   },
   "acc": {
    "taro": {
     "n": 364,
     "acc": 37.9,
     "adjustedAcc": 40.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 191,
     "acc": 37.7,
     "adjustedAcc": 42.4,
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
     "n": 8,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 834,
   "globalBlend": 0.49
  },
  "기계": {
   "weights": {
    "taro": 0.258,
    "diana": 0.1277,
    "nova": 0.2983,
    "flow": 0.316
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
    "diana": 0.1017,
    "nova": 0.3255,
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
    "taro": 0.2598,
    "diana": 0.1671,
    "nova": 0.2706,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 44.6,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 160,
     "acc": 87.5,
     "adjustedAcc": 71.4,
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
   "graded": 703,
   "globalBlend": 0.532
  },
  "여행레저": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.115,
    "nova": 0.3024,
    "flow": 0.3032
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
