// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-21 09:17",
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
   "nova": 0.3006,
   "flow": 0.3111
  },
  "acc": {
   "taro": {
    "n": 11949,
    "acc": 50.2,
    "adjustedAcc": 50.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 5234,
    "acc": 55.2,
    "adjustedAcc": 55.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9035,
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
  "graded": 28384,
  "team": {
   "hit": 7916,
   "miss": 7530,
   "n": 15446,
   "acc": 51.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2759,
    "diana": 0.0984,
    "nova": 0.2741,
    "flow": 0.3517
   },
   "acc": {
    "taro": {
     "n": 1417,
     "acc": 50.7,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 459,
     "acc": 41.8,
     "adjustedAcc": 43.5,
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
     "acc": 62.3,
     "adjustedAcc": 59.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3433,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2891,
    "diana": 0.1126,
    "nova": 0.2915,
    "flow": 0.3068
   },
   "acc": {
    "taro": {
     "n": 678,
     "acc": 57.1,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 213,
     "acc": 53.5,
     "adjustedAcc": 52.3,
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
   "graded": 1636,
   "globalBlend": 0.328
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2471,
    "diana": 0.1345,
    "nova": 0.3132,
    "flow": 0.3052
   },
   "acc": {
    "taro": {
     "n": 592,
     "acc": 42.9,
     "adjustedAcc": 44.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 282,
     "acc": 60.3,
     "adjustedAcc": 57.2,
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
   "graded": 1496,
   "globalBlend": 0.348
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2873,
    "diana": 0.1174,
    "nova": 0.3214,
    "flow": 0.2739
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
    "taro": 0.2624,
    "diana": 0.1182,
    "nova": 0.3015,
    "flow": 0.3178
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 47.1,
     "adjustedAcc": 48.2,
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
   "graded": 518,
   "globalBlend": 0.607
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2678,
    "diana": 0.1613,
    "nova": 0.2771,
    "flow": 0.2938
   },
   "acc": {
    "taro": {
     "n": 556,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 262,
     "acc": 76.0,
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
     "n": 78,
     "acc": 53.8,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1310,
   "globalBlend": 0.379
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2766,
    "diana": 0.103,
    "nova": 0.3262,
    "flow": 0.2942
   },
   "acc": {
    "taro": {
     "n": 648,
     "acc": 47.1,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 337,
     "acc": 38.0,
     "adjustedAcc": 41.1,
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
   "graded": 1631,
   "globalBlend": 0.329
  },
  "2차전지": {
   "weights": {
    "taro": 0.2925,
    "diana": 0.1111,
    "nova": 0.3317,
    "flow": 0.2647
   },
   "acc": {
    "taro": {
     "n": 629,
     "acc": 58.5,
     "adjustedAcc": 57.1,
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
   "graded": 1334,
   "globalBlend": 0.375
  },
  "보험": {
   "weights": {
    "taro": 0.2718,
    "diana": 0.1416,
    "nova": 0.2878,
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
     "n": 1567,
     "acc": 53.2,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 655,
     "acc": 55.9,
     "adjustedAcc": 55.0,
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
   "graded": 3624,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2669,
    "diana": 0.1257,
    "nova": 0.3274,
    "flow": 0.2799
   },
   "acc": {
    "taro": {
     "n": 689,
     "acc": 48.2,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 375,
     "acc": 55.5,
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
     "n": 63,
     "acc": 44.4,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1645,
   "globalBlend": 0.327
  },
  "조선": {
   "weights": {
    "taro": 0.2564,
    "diana": 0.131,
    "nova": 0.3058,
    "flow": 0.3068
   },
   "acc": {
    "taro": {
     "n": 381,
     "acc": 42.8,
     "adjustedAcc": 44.5,
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
     "n": 66,
     "acc": 53.0,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 952,
   "globalBlend": 0.457
  },
  "방산": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.1194,
    "nova": 0.2989,
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
    "taro": 0.267,
    "diana": 0.1173,
    "nova": 0.3038,
    "flow": 0.3119
   },
   "acc": {
    "taro": {
     "n": 867,
     "acc": 51.6,
     "adjustedAcc": 51.4,
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
   "graded": 2104,
   "globalBlend": 0.275
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2603,
    "diana": 0.1434,
    "nova": 0.2819,
    "flow": 0.3143
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
     "n": 81,
     "acc": 86.4,
     "adjustedAcc": 64.7,
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
   "graded": 473,
   "globalBlend": 0.628
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2868,
    "diana": 0.1105,
    "nova": 0.2955,
    "flow": 0.3072
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
     "n": 255,
     "acc": 45.9,
     "adjustedAcc": 47.2,
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
    "taro": 0.2741,
    "diana": 0.1375,
    "nova": 0.2702,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 50.2,
     "adjustedAcc": 50.1,
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
   "graded": 680,
   "globalBlend": 0.541
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2743,
    "diana": 0.1306,
    "nova": 0.3134,
    "flow": 0.2817
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
     "n": 254,
     "acc": 61.0,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 124,
     "acc": 44.4,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 888,
   "globalBlend": 0.474
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
    "taro": 0.2579,
    "diana": 0.1273,
    "nova": 0.2987,
    "flow": 0.3162
   },
   "acc": {
    "taro": {
     "n": 121,
     "acc": 36.4,
     "adjustedAcc": 43.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 57,
     "acc": 68.4,
     "adjustedAcc": 55.9,
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
   "graded": 286,
   "globalBlend": 0.737
  },
  "로봇": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.1015,
    "nova": 0.3257,
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
    "taro": 0.2591,
    "diana": 0.1669,
    "nova": 0.2712,
    "flow": 0.3028
   },
   "acc": {
    "taro": {
     "n": 326,
     "acc": 44.2,
     "adjustedAcc": 45.7,
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
   "graded": 701,
   "globalBlend": 0.533
  },
  "여행레저": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1149,
    "nova": 0.3028,
    "flow": 0.3033
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
