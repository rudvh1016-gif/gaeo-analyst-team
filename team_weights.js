// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-21 15:15",
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
   "taro": 0.2648,
   "diana": 0.1232,
   "nova": 0.3003,
   "flow": 0.3116
  },
  "acc": {
   "taro": {
    "n": 11952,
    "acc": 50.1,
    "adjustedAcc": 50.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 5237,
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
    "acc": 55.9,
    "adjustedAcc": 55.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 28396,
  "team": {
   "hit": 7911,
   "miss": 7541,
   "n": 15452,
   "acc": 51.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.0988,
    "nova": 0.2735,
    "flow": 0.3531
   },
   "acc": {
    "taro": {
     "n": 1419,
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
     "n": 433,
     "acc": 62.6,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3439,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2883,
    "diana": 0.1124,
    "nova": 0.2914,
    "flow": 0.3078
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
    "taro": 0.2465,
    "diana": 0.1352,
    "nova": 0.313,
    "flow": 0.3052
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
    "taro": 0.2871,
    "diana": 0.1175,
    "nova": 0.3212,
    "flow": 0.2741
   },
   "acc": {
    "taro": {
     "n": 451,
     "acc": 50.8,
     "adjustedAcc": 50.6,
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
   "graded": 1141,
   "globalBlend": 0.412
  },
  "통신": {
   "weights": {
    "taro": 0.2631,
    "diana": 0.1183,
    "nova": 0.3014,
    "flow": 0.3171
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
    "taro": 0.2686,
    "diana": 0.1606,
    "nova": 0.2775,
    "flow": 0.2932
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
     "n": 261,
     "acc": 75.5,
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
     "n": 79,
     "acc": 53.2,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1309,
   "globalBlend": 0.379
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2751,
    "diana": 0.1036,
    "nova": 0.3271,
    "flow": 0.2941
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
     "n": 338,
     "acc": 38.2,
     "adjustedAcc": 41.3,
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
   "graded": 1633,
   "globalBlend": 0.329
  },
  "2차전지": {
   "weights": {
    "taro": 0.2921,
    "diana": 0.1114,
    "nova": 0.3316,
    "flow": 0.2648
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
    "taro": 0.2709,
    "diana": 0.1425,
    "nova": 0.2875,
    "flow": 0.2991
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 52.1,
     "adjustedAcc": 51.4,
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
   "graded": 546,
   "globalBlend": 0.594
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1192,
    "nova": 0.3025,
    "flow": 0.3047
   },
   "acc": {
    "taro": {
     "n": 1564,
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
   "graded": 3619,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2666,
    "diana": 0.1255,
    "nova": 0.3268,
    "flow": 0.2811
   },
   "acc": {
    "taro": {
     "n": 686,
     "acc": 48.3,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 377,
     "acc": 55.4,
     "adjustedAcc": 54.1,
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
    "taro": 0.2552,
    "diana": 0.1311,
    "nova": 0.3055,
    "flow": 0.3082
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
    "taro": 0.2655,
    "diana": 0.1195,
    "nova": 0.2987,
    "flow": 0.3163
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
    "taro": 0.2724,
    "diana": 0.1504,
    "nova": 0.2864,
    "flow": 0.2907
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
   "graded": 593,
   "globalBlend": 0.574
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2665,
    "diana": 0.1173,
    "nova": 0.3039,
    "flow": 0.3123
   },
   "acc": {
    "taro": {
     "n": 865,
     "acc": 51.4,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 457,
     "acc": 54.7,
     "adjustedAcc": 53.7,
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
   "graded": 2103,
   "globalBlend": 0.276
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2603,
    "diana": 0.1441,
    "nova": 0.2811,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 43.3,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 81,
     "acc": 87.7,
     "adjustedAcc": 65.2,
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
   "graded": 474,
   "globalBlend": 0.628
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2866,
    "diana": 0.1108,
    "nova": 0.2954,
    "flow": 0.3073
   },
   "acc": {
    "taro": {
     "n": 535,
     "acc": 53.5,
     "adjustedAcc": 52.8,
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
   "graded": 1173,
   "globalBlend": 0.405
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2747,
    "diana": 0.1374,
    "nova": 0.2697,
    "flow": 0.3181
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
    "taro": 0.2743,
    "diana": 0.1297,
    "nova": 0.3135,
    "flow": 0.2824
   },
   "acc": {
    "taro": {
     "n": 354,
     "acc": 50.8,
     "adjustedAcc": 50.6,
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
   "graded": 893,
   "globalBlend": 0.473
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2565,
    "diana": 0.1138,
    "nova": 0.3105,
    "flow": 0.3192
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
     "n": 192,
     "acc": 38.0,
     "adjustedAcc": 42.6,
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
   "graded": 835,
   "globalBlend": 0.489
  },
  "기계": {
   "weights": {
    "taro": 0.2577,
    "diana": 0.1277,
    "nova": 0.2983,
    "flow": 0.3163
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
    "taro": 0.2841,
    "diana": 0.1017,
    "nova": 0.3255,
    "flow": 0.2887
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
    "taro": 0.2597,
    "diana": 0.1679,
    "nova": 0.271,
    "flow": 0.3014
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 44.5,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 158,
     "acc": 88.0,
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
     "n": 5,
     "acc": 60.0,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 703,
   "globalBlend": 0.532
  },
  "여행레저": {
   "weights": {
    "taro": 0.2787,
    "diana": 0.115,
    "nova": 0.3026,
    "flow": 0.3036
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 52.0,
     "adjustedAcc": 51.1,
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
   "graded": 364,
   "globalBlend": 0.687
  }
 }
};
