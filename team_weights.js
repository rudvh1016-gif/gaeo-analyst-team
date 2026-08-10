// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-10 09:13",
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
   "taro": 0.2732,
   "diana": 0.0896,
   "nova": 0.3344,
   "flow": 0.3027
  },
  "acc": {
   "taro": {
    "n": 9029,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2391,
    "acc": 45.6,
    "adjustedAcc": 45.8,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8034,
    "acc": 61.7,
    "adjustedAcc": 61.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1609,
    "acc": 56.3,
    "adjustedAcc": 55.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 21063,
  "team": {
   "hit": 6209,
   "miss": 2119,
   "n": 8328,
   "acc": 74.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.282,
    "diana": 0.078,
    "nova": 0.2895,
    "flow": 0.3506
   },
   "acc": {
    "taro": {
     "n": 1096,
     "acc": 56.0,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 233,
     "acc": 36.5,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 990,
     "acc": 57.3,
     "adjustedAcc": 56.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 339,
     "acc": 68.7,
     "adjustedAcc": 63.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2658,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2951,
    "diana": 0.0863,
    "nova": 0.3188,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 543,
     "acc": 62.1,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 107,
     "acc": 43.9,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 478,
     "acc": 65.3,
     "adjustedAcc": 62.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 156,
     "acc": 65.4,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1284,
   "globalBlend": 0.384
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2601,
    "diana": 0.1006,
    "nova": 0.3481,
    "flow": 0.2912
   },
   "acc": {
    "taro": {
     "n": 456,
     "acc": 44.3,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 46.4,
     "adjustedAcc": 48.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 433,
     "acc": 62.4,
     "adjustedAcc": 59.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 48.9,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1104,
   "globalBlend": 0.42
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2901,
    "diana": 0.0861,
    "nova": 0.3552,
    "flow": 0.2687
   },
   "acc": {
    "taro": {
     "n": 351,
     "acc": 52.4,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 109,
     "acc": 26.6,
     "adjustedAcc": 38.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 312,
     "acc": 65.1,
     "adjustedAcc": 60.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 81,
     "acc": 33.3,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 853,
   "globalBlend": 0.484
  },
  "통신": {
   "weights": {
    "taro": 0.2705,
    "diana": 0.0937,
    "nova": 0.3293,
    "flow": 0.3064
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 48.8,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 39.3,
     "adjustedAcc": 48.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 143,
     "acc": 64.3,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 62,
     "acc": 64.5,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 399,
   "globalBlend": 0.667
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.268,
    "diana": 0.1235,
    "nova": 0.3158,
    "flow": 0.2927
   },
   "acc": {
    "taro": {
     "n": 400,
     "acc": 48.2,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 106,
     "acc": 73.6,
     "adjustedAcc": 61.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 365,
     "acc": 57.0,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 54.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 921,
   "globalBlend": 0.465
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2873,
    "diana": 0.0838,
    "nova": 0.3554,
    "flow": 0.2735
   },
   "acc": {
    "taro": {
     "n": 521,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 157,
     "acc": 26.8,
     "adjustedAcc": 36.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 421,
     "acc": 62.2,
     "adjustedAcc": 59.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 143,
     "acc": 40.6,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1242,
   "globalBlend": 0.392
  },
  "2차전지": {
   "weights": {
    "taro": 0.299,
    "diana": 0.0916,
    "nova": 0.3562,
    "flow": 0.2532
   },
   "acc": {
    "taro": {
     "n": 491,
     "acc": 64.6,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 91,
     "acc": 52.7,
     "adjustedAcc": 51.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 429,
     "acc": 74.6,
     "adjustedAcc": 69.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 8,
     "acc": 25.0,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1019,
   "globalBlend": 0.44
  },
  "보험": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.1037,
    "nova": 0.3237,
    "flow": 0.2971
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 49.4,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 68.9,
     "adjustedAcc": 55.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 139,
     "acc": 58.3,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 39,
     "acc": 51.3,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 395,
   "globalBlend": 0.669
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2771,
    "diana": 0.1037,
    "nova": 0.3305,
    "flow": 0.2887
   },
   "acc": {
    "taro": {
     "n": 1145,
     "acc": 56.2,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 291,
     "acc": 56.7,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1054,
     "acc": 65.1,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 141,
     "acc": 61.7,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2631,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2716,
    "diana": 0.1056,
    "nova": 0.3541,
    "flow": 0.2686
   },
   "acc": {
    "taro": {
     "n": 509,
     "acc": 48.7,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 168,
     "acc": 52.4,
     "adjustedAcc": 51.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 469,
     "acc": 64.4,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 44,
     "acc": 34.1,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1190,
   "globalBlend": 0.402
  },
  "조선": {
   "weights": {
    "taro": 0.2687,
    "diana": 0.0924,
    "nova": 0.3351,
    "flow": 0.3037
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 44.9,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 33.3,
     "adjustedAcc": 43.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 284,
     "acc": 59.5,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 54,
     "acc": 53.7,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 726,
   "globalBlend": 0.524
  },
  "방산": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.0944,
    "nova": 0.3307,
    "flow": 0.3021
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 44.4,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 22,
     "acc": 31.8,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 110,
     "acc": 60.0,
     "adjustedAcc": 54.8,
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
   "graded": 266,
   "globalBlend": 0.75
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2849,
    "diana": 0.1026,
    "nova": 0.3203,
    "flow": 0.2921
   },
   "acc": {
    "taro": {
     "n": 180,
     "acc": 56.7,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 65,
     "acc": 64.6,
     "adjustedAcc": 55.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 181,
     "acc": 58.0,
     "adjustedAcc": 54.8,
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
   "graded": 426,
   "globalBlend": 0.653
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2736,
    "diana": 0.0891,
    "nova": 0.3308,
    "flow": 0.3064
   },
   "acc": {
    "taro": {
     "n": 654,
     "acc": 54.7,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 203,
     "acc": 45.3,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 604,
     "acc": 64.9,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 87,
     "acc": 69.0,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1548,
   "globalBlend": 0.341
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.1057,
    "nova": 0.313,
    "flow": 0.3087
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 45.2,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 38,
     "acc": 78.9,
     "adjustedAcc": 57.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 93,
     "acc": 47.3,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 58.3,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 339,
   "globalBlend": 0.702
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2867,
    "diana": 0.0918,
    "nova": 0.3201,
    "flow": 0.3013
   },
   "acc": {
    "taro": {
     "n": 393,
     "acc": 53.2,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 119,
     "acc": 38.7,
     "adjustedAcc": 44.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 321,
     "acc": 57.6,
     "adjustedAcc": 55.6,
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
   "graded": 852,
   "globalBlend": 0.484
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2769,
    "diana": 0.1023,
    "nova": 0.3067,
    "flow": 0.3141
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 47.5,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 53.6,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 180,
     "acc": 46.7,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 85.7,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 490,
   "globalBlend": 0.62
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2792,
    "diana": 0.0894,
    "nova": 0.3476,
    "flow": 0.2837
   },
   "acc": {
    "taro": {
     "n": 270,
     "acc": 51.1,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 71,
     "acc": 29.6,
     "adjustedAcc": 42.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 229,
     "acc": 66.8,
     "adjustedAcc": 61.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 94,
     "acc": 44.7,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 664,
   "globalBlend": 0.546
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2649,
    "diana": 0.0871,
    "nova": 0.3353,
    "flow": 0.3127
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 37.2,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 13.8,
     "adjustedAcc": 34.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 239,
     "acc": 54.4,
     "adjustedAcc": 52.9,
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
   "graded": 592,
   "globalBlend": 0.575
  },
  "기계": {
   "weights": {
    "taro": 0.2663,
    "diana": 0.0957,
    "nova": 0.3305,
    "flow": 0.3074
   },
   "acc": {
    "taro": {
     "n": 83,
     "acc": 31.3,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 26,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 86,
     "acc": 59.3,
     "adjustedAcc": 53.9,
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
   "graded": 202,
   "globalBlend": 0.798
  },
  "로봇": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.0971,
    "nova": 0.346,
    "flow": 0.2764
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 55.8,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 57,
     "acc": 54.4,
     "adjustedAcc": 51.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 194,
     "acc": 71.6,
     "adjustedAcc": 63.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 38.0,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 509,
   "globalBlend": 0.611
  },
  "식음료": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.1197,
    "nova": 0.3025,
    "flow": 0.3039
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 44.5,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 70,
     "acc": 80.0,
     "adjustedAcc": 61.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 184,
     "acc": 42.4,
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
   "graded": 474,
   "globalBlend": 0.628
  },
  "여행레저": {
   "weights": {
    "taro": 0.2891,
    "diana": 0.089,
    "nova": 0.3262,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 58.8,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 0.0,
     "adjustedAcc": 40.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 96,
     "acc": 57.3,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 39,
     "acc": 41.0,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 279,
   "globalBlend": 0.741
  }
 }
};
