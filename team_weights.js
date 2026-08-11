// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-11 14:41",
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
   "taro": 0.2762,
   "diana": 0.0973,
   "nova": 0.3113,
   "flow": 0.3153
  },
  "acc": {
   "taro": {
    "n": 9370,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2736,
    "acc": 48.2,
    "adjustedAcc": 48.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8489,
    "acc": 58.9,
    "adjustedAcc": 58.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1681,
    "acc": 57.4,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 22276,
  "team": {
   "hit": 6311,
   "miss": 2379,
   "n": 8690,
   "acc": 72.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.0812,
    "nova": 0.2755,
    "flow": 0.364
   },
   "acc": {
    "taro": {
     "n": 1137,
     "acc": 54.4,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 258,
     "acc": 36.8,
     "adjustedAcc": 41.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1039,
     "acc": 54.8,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 349,
     "acc": 69.1,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2783,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.093,
    "nova": 0.3009,
    "flow": 0.3107
   },
   "acc": {
    "taro": {
     "n": 560,
     "acc": 60.9,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 47.5,
     "adjustedAcc": 48.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 501,
     "acc": 62.3,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 161,
     "acc": 65.8,
     "adjustedAcc": 59.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1344,
   "globalBlend": 0.373
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.26,
    "diana": 0.1096,
    "nova": 0.3298,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 470,
     "acc": 43.8,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 142,
     "acc": 51.4,
     "adjustedAcc": 50.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 454,
     "acc": 60.1,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 95,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1161,
   "globalBlend": 0.408
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2951,
    "diana": 0.0929,
    "nova": 0.3348,
    "flow": 0.2772
   },
   "acc": {
    "taro": {
     "n": 364,
     "acc": 52.5,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 126,
     "acc": 31.7,
     "adjustedAcc": 40.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 331,
     "acc": 61.6,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 34.5,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 905,
   "globalBlend": 0.469
  },
  "통신": {
   "weights": {
    "taro": 0.274,
    "diana": 0.0985,
    "nova": 0.31,
    "flow": 0.3176
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 40.5,
     "adjustedAcc": 47.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 150,
     "acc": 62.0,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 66.7,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 423,
   "globalBlend": 0.654
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1325,
    "nova": 0.2938,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 130,
     "acc": 74.6,
     "adjustedAcc": 62.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 391,
     "acc": 54.0,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 55,
     "acc": 54.5,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 998,
   "globalBlend": 0.445
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2887,
    "diana": 0.0876,
    "nova": 0.3375,
    "flow": 0.2862
   },
   "acc": {
    "taro": {
     "n": 538,
     "acc": 49.3,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 175,
     "acc": 28.0,
     "adjustedAcc": 36.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 448,
     "acc": 59.6,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 149,
     "acc": 43.0,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1310,
   "globalBlend": 0.379
  },
  "2차전지": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.0962,
    "nova": 0.3353,
    "flow": 0.2631
   },
   "acc": {
    "taro": {
     "n": 503,
     "acc": 64.2,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 104,
     "acc": 51.9,
     "adjustedAcc": 50.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 453,
     "acc": 70.6,
     "adjustedAcc": 66.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 9,
     "acc": 33.3,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1069,
   "globalBlend": 0.428
  },
  "보험": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1122,
    "nova": 0.3047,
    "flow": 0.307
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 48.0,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 73.1,
     "adjustedAcc": 57.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 146,
     "acc": 55.5,
     "adjustedAcc": 53.0,
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
   "graded": 417,
   "globalBlend": 0.657
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2842,
    "diana": 0.1067,
    "nova": 0.3088,
    "flow": 0.3003
   },
   "acc": {
    "taro": {
     "n": 1193,
     "acc": 56.9,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 334,
     "acc": 56.6,
     "adjustedAcc": 54.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1117,
     "acc": 62.1,
     "adjustedAcc": 61.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 149,
     "acc": 63.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2793,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.113,
    "nova": 0.3365,
    "flow": 0.2766
   },
   "acc": {
    "taro": {
     "n": 529,
     "acc": 48.8,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 195,
     "acc": 54.9,
     "adjustedAcc": 53.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 493,
     "acc": 62.3,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 37.5,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1265,
   "globalBlend": 0.387
  },
  "조선": {
   "weights": {
    "taro": 0.2711,
    "diana": 0.1011,
    "nova": 0.3151,
    "flow": 0.3128
   },
   "acc": {
    "taro": {
     "n": 310,
     "acc": 44.8,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 40.8,
     "adjustedAcc": 45.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 299,
     "acc": 56.5,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 54.4,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 764,
   "globalBlend": 0.512
  },
  "방산": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.1007,
    "nova": 0.3114,
    "flow": 0.3131
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 44.6,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 25,
     "acc": 36.0,
     "adjustedAcc": 47.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 117,
     "acc": 58.1,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 3,
     "acc": 100.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 284,
   "globalBlend": 0.738
  },
  "철강·금속": {
   "weights": {
    "taro": 0.29,
    "diana": 0.111,
    "nova": 0.2991,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 57.8,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 74,
     "acc": 68.9,
     "adjustedAcc": 57.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 192,
     "acc": 54.7,
     "adjustedAcc": 52.9,
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
   "graded": 451,
   "globalBlend": 0.639
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.096,
    "nova": 0.3128,
    "flow": 0.3139
   },
   "acc": {
    "taro": {
     "n": 677,
     "acc": 54.4,
     "adjustedAcc": 53.7,
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
     "n": 633,
     "acc": 61.9,
     "adjustedAcc": 60.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 88,
     "acc": 68.2,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1634,
   "globalBlend": 0.329
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.1131,
    "nova": 0.2903,
    "flow": 0.3194
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 48.1,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 80.0,
     "adjustedAcc": 58.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 102,
     "acc": 43.1,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 88,
     "acc": 60.2,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 368,
   "globalBlend": 0.685
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2902,
    "diana": 0.0977,
    "nova": 0.3046,
    "flow": 0.3076
   },
   "acc": {
    "taro": {
     "n": 409,
     "acc": 53.5,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 136,
     "acc": 41.9,
     "adjustedAcc": 45.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 338,
     "acc": 56.2,
     "adjustedAcc": 54.6,
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
   "graded": 902,
   "globalBlend": 0.47
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.1082,
    "nova": 0.2862,
    "flow": 0.325
   },
   "acc": {
    "taro": {
     "n": 248,
     "acc": 48.8,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 55.6,
     "adjustedAcc": 51.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 192,
     "acc": 44.3,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 88.2,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 520,
   "globalBlend": 0.606
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2834,
    "diana": 0.0968,
    "nova": 0.3262,
    "flow": 0.2935
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 52.0,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 37.5,
     "adjustedAcc": 45.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 242,
     "acc": 63.6,
     "adjustedAcc": 59.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 100,
     "acc": 47.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 699,
   "globalBlend": 0.534
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.27,
    "diana": 0.0939,
    "nova": 0.318,
    "flow": 0.3181
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 39.1,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 21.4,
     "adjustedAcc": 37.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 53.0,
     "adjustedAcc": 52.0,
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
   "graded": 629,
   "globalBlend": 0.56
  },
  "기계": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.1038,
    "nova": 0.3097,
    "flow": 0.3184
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 31.0,
     "adjustedAcc": 42.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 58.1,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 92,
     "acc": 55.4,
     "adjustedAcc": 52.4,
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
   "graded": 217,
   "globalBlend": 0.787
  },
  "로봇": {
   "weights": {
    "taro": 0.2883,
    "diana": 0.0987,
    "nova": 0.327,
    "flow": 0.2861
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 57.2,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 44.4,
     "adjustedAcc": 48.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 204,
     "acc": 68.1,
     "adjustedAcc": 61.4,
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
   "graded": 533,
   "globalBlend": 0.6
  },
  "식음료": {
   "weights": {
    "taro": 0.2785,
    "diana": 0.1286,
    "nova": 0.2827,
    "flow": 0.3101
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 46.6,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 82.3,
     "adjustedAcc": 62.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 200,
     "acc": 41.0,
     "adjustedAcc": 44.4,
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
   "graded": 513,
   "globalBlend": 0.609
  },
  "여행레저": {
   "weights": {
    "taro": 0.2922,
    "diana": 0.0943,
    "nova": 0.3087,
    "flow": 0.3048
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 58.0,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 0.0,
     "adjustedAcc": 39.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 102,
     "acc": 55.9,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 40.0,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 294,
   "globalBlend": 0.731
  }
 }
};
