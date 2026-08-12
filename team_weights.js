// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-12 10:42",
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
   "taro": 0.2807,
   "diana": 0.104,
   "nova": 0.2944,
   "flow": 0.321
  },
  "acc": {
   "taro": {
    "n": 9707,
    "acc": 53.1,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3073,
    "acc": 50.5,
    "adjustedAcc": 50.5,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8913,
    "acc": 57.1,
    "adjustedAcc": 57.0,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1748,
    "acc": 58.1,
    "adjustedAcc": 57.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 23441,
  "team": {
   "hit": 6483,
   "miss": 2577,
   "n": 9060,
   "acc": 71.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2816,
    "diana": 0.0843,
    "nova": 0.2637,
    "flow": 0.3704
   },
   "acc": {
    "taro": {
     "n": 1169,
     "acc": 54.1,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 282,
     "acc": 37.6,
     "adjustedAcc": 41.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1087,
     "acc": 52.7,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 361,
     "acc": 69.0,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2899,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2993,
    "diana": 0.0977,
    "nova": 0.287,
    "flow": 0.316
   },
   "acc": {
    "taro": {
     "n": 573,
     "acc": 60.9,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 133,
     "acc": 49.6,
     "adjustedAcc": 49.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 522,
     "acc": 60.2,
     "adjustedAcc": 58.3,
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
   "graded": 1391,
   "globalBlend": 0.365
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2617,
    "diana": 0.1165,
    "nova": 0.3174,
    "flow": 0.3044
   },
   "acc": {
    "taro": {
     "n": 490,
     "acc": 44.1,
     "adjustedAcc": 45.2,
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
     "n": 477,
     "acc": 58.9,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 101,
     "acc": 51.5,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1229,
   "globalBlend": 0.394
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2991,
    "diana": 0.0996,
    "nova": 0.3201,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 375,
     "acc": 52.5,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 36.7,
     "adjustedAcc": 42.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 345,
     "acc": 59.4,
     "adjustedAcc": 57.0,
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
   "graded": 946,
   "globalBlend": 0.458
  },
  "통신": {
   "weights": {
    "taro": 0.2776,
    "diana": 0.1039,
    "nova": 0.2967,
    "flow": 0.3219
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
     "n": 42,
     "acc": 45.2,
     "adjustedAcc": 48.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 153,
     "acc": 60.8,
     "adjustedAcc": 56.0,
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
    "taro": 0.2823,
    "diana": 0.139,
    "nova": 0.2761,
    "flow": 0.3026
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
    "taro": 0.2935,
    "diana": 0.0922,
    "nova": 0.322,
    "flow": 0.2923
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
     "n": 199,
     "acc": 31.7,
     "adjustedAcc": 38.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 471,
     "acc": 57.7,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 154,
     "acc": 44.8,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1378,
   "globalBlend": 0.367
  },
  "2차전지": {
   "weights": {
    "taro": 0.3143,
    "diana": 0.1004,
    "nova": 0.3181,
    "flow": 0.2673
   },
   "acc": {
    "taro": {
     "n": 515,
     "acc": 64.7,
     "adjustedAcc": 61.9,
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
     "n": 475,
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
   "graded": 1118,
   "globalBlend": 0.417
  },
  "보험": {
   "weights": {
    "taro": 0.279,
    "diana": 0.1191,
    "nova": 0.2909,
    "flow": 0.3109
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
     "n": 155,
     "acc": 53.5,
     "adjustedAcc": 52.0,
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
   "graded": 440,
   "globalBlend": 0.645
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2932,
    "diana": 0.1081,
    "nova": 0.2899,
    "flow": 0.3088
   },
   "acc": {
    "taro": {
     "n": 1248,
     "acc": 58.2,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 381,
     "acc": 56.2,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1179,
     "acc": 59.6,
     "adjustedAcc": 58.7,
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
   "graded": 2966,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1183,
    "nova": 0.3224,
    "flow": 0.2799
   },
   "acc": {
    "taro": {
     "n": 550,
     "acc": 49.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 219,
     "acc": 56.2,
     "adjustedAcc": 54.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 519,
     "acc": 60.5,
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
   "graded": 1339,
   "globalBlend": 0.374
  },
  "조선": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.1093,
    "nova": 0.3048,
    "flow": 0.3135
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
     "n": 113,
     "acc": 47.8,
     "adjustedAcc": 48.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 312,
     "acc": 56.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 58,
     "acc": 53.4,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 802,
   "globalBlend": 0.499
  },
  "방산": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1057,
    "nova": 0.2982,
    "flow": 0.3171
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
    "taro": 0.2957,
    "diana": 0.1183,
    "nova": 0.2825,
    "flow": 0.3036
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 59.2,
     "adjustedAcc": 55.6,
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
     "n": 202,
     "acc": 52.0,
     "adjustedAcc": 51.2,
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
   "graded": 477,
   "globalBlend": 0.626
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2825,
    "diana": 0.1024,
    "nova": 0.2978,
    "flow": 0.3173
   },
   "acc": {
    "taro": {
     "n": 698,
     "acc": 54.7,
     "adjustedAcc": 54.0,
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
     "n": 664,
     "acc": 59.6,
     "adjustedAcc": 58.2,
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
   "graded": 1717,
   "globalBlend": 0.318
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1194,
    "nova": 0.2777,
    "flow": 0.3244
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 47.4,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 82.0,
     "adjustedAcc": 59.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 106,
     "acc": 43.4,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 91,
     "acc": 61.5,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 384,
   "globalBlend": 0.676
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2946,
    "diana": 0.1031,
    "nova": 0.2931,
    "flow": 0.3092
   },
   "acc": {
    "taro": {
     "n": 428,
     "acc": 54.2,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 155,
     "acc": 45.2,
     "adjustedAcc": 47.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 354,
     "acc": 55.4,
     "adjustedAcc": 54.0,
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
   "graded": 956,
   "globalBlend": 0.456
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2849,
    "diana": 0.1146,
    "nova": 0.2709,
    "flow": 0.3297
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
    "taro": 0.2911,
    "diana": 0.1036,
    "nova": 0.3089,
    "flow": 0.2965
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 53.8,
     "adjustedAcc": 52.7,
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
     "n": 255,
     "acc": 60.8,
     "adjustedAcc": 57.3,
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
   "graded": 739,
   "globalBlend": 0.52
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1,
    "nova": 0.3044,
    "flow": 0.3209
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
    "taro": 0.272,
    "diana": 0.1097,
    "nova": 0.296,
    "flow": 0.3223
   },
   "acc": {
    "taro": {
     "n": 89,
     "acc": 32.6,
     "adjustedAcc": 42.6,
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
     "n": 94,
     "acc": 55.3,
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
   "graded": 224,
   "globalBlend": 0.781
  },
  "로봇": {
   "weights": {
    "taro": 0.2942,
    "diana": 0.1007,
    "nova": 0.3161,
    "flow": 0.289
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 57.6,
     "adjustedAcc": 54.9,
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
     "n": 213,
     "acc": 66.7,
     "adjustedAcc": 60.7,
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
   "graded": 560,
   "globalBlend": 0.588
  },
  "식음료": {
   "weights": {
    "taro": 0.281,
    "diana": 0.1364,
    "nova": 0.2721,
    "flow": 0.3106
   },
   "acc": {
    "taro": {
     "n": 248,
     "acc": 47.6,
     "adjustedAcc": 48.4,
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
     "n": 215,
     "acc": 42.8,
     "adjustedAcc": 45.4,
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
   "graded": 554,
   "globalBlend": 0.591
  },
  "여행레저": {
   "weights": {
    "taro": 0.2951,
    "diana": 0.0991,
    "nova": 0.2961,
    "flow": 0.3097
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 56.8,
     "adjustedAcc": 53.5,
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
     "n": 107,
     "acc": 55.1,
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
   "graded": 309,
   "globalBlend": 0.721
  }
 }
};
