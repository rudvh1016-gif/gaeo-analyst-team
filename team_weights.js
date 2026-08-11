// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-11 14:11",
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
   "diana": 0.097,
   "nova": 0.3112,
   "flow": 0.3156
  },
  "acc": {
   "taro": {
    "n": 9371,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2734,
    "acc": 48.1,
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
    "n": 1680,
    "acc": 57.4,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 22274,
  "team": {
   "hit": 6312,
   "miss": 2379,
   "n": 8691,
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
    "taro": 0.2956,
    "diana": 0.0926,
    "nova": 0.3009,
    "flow": 0.3109
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
     "n": 121,
     "acc": 47.1,
     "adjustedAcc": 48.5,
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
   "graded": 1343,
   "globalBlend": 0.373
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2605,
    "diana": 0.1095,
    "nova": 0.3292,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 471,
     "acc": 43.9,
     "adjustedAcc": 45.2,
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
     "n": 455,
     "acc": 60.0,
     "adjustedAcc": 57.9,
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
   "graded": 1163,
   "globalBlend": 0.408
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.0929,
    "nova": 0.3343,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 364,
     "acc": 52.2,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 124,
     "acc": 31.5,
     "adjustedAcc": 40.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 331,
     "acc": 61.3,
     "adjustedAcc": 58.3,
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
   "graded": 903,
   "globalBlend": 0.47
  },
  "통신": {
   "weights": {
    "taro": 0.274,
    "diana": 0.0983,
    "nova": 0.3099,
    "flow": 0.3178
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
    "diana": 0.1324,
    "nova": 0.2938,
    "flow": 0.299
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
    "diana": 0.0871,
    "nova": 0.3382,
    "flow": 0.286
   },
   "acc": {
    "taro": {
     "n": 539,
     "acc": 49.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 176,
     "acc": 27.8,
     "adjustedAcc": 36.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 448,
     "acc": 59.8,
     "adjustedAcc": 57.7,
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
   "graded": 1312,
   "globalBlend": 0.379
  },
  "2차전지": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.096,
    "nova": 0.3353,
    "flow": 0.2632
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
    "diana": 0.112,
    "nova": 0.3046,
    "flow": 0.3072
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
    "taro": 0.2843,
    "diana": 0.1064,
    "nova": 0.3089,
    "flow": 0.3004
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
     "n": 335,
     "acc": 56.4,
     "adjustedAcc": 54.7,
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
   "graded": 2794,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1126,
    "nova": 0.3362,
    "flow": 0.2775
   },
   "acc": {
    "taro": {
     "n": 528,
     "acc": 48.9,
     "adjustedAcc": 49.1,
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
     "n": 492,
     "acc": 62.4,
     "adjustedAcc": 60.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 38.3,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1262,
   "globalBlend": 0.388
  },
  "조선": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.101,
    "nova": 0.3146,
    "flow": 0.3131
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
     "n": 300,
     "acc": 56.3,
     "adjustedAcc": 54.5,
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
   "graded": 765,
   "globalBlend": 0.511
  },
  "방산": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.1004,
    "nova": 0.3113,
    "flow": 0.3133
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
    "diana": 0.1108,
    "nova": 0.2991,
    "flow": 0.3001
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
    "diana": 0.0959,
    "nova": 0.3127,
    "flow": 0.314
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
    "taro": 0.2774,
    "diana": 0.1125,
    "nova": 0.2904,
    "flow": 0.3197
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
     "n": 44,
     "acc": 79.5,
     "adjustedAcc": 57.9,
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
   "graded": 367,
   "globalBlend": 0.686
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2906,
    "diana": 0.0976,
    "nova": 0.3038,
    "flow": 0.308
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
     "acc": 55.9,
     "adjustedAcc": 54.4,
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
    "taro": 0.2806,
    "diana": 0.1079,
    "nova": 0.2865,
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
     "n": 191,
     "acc": 44.5,
     "adjustedAcc": 46.6,
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
   "graded": 519,
   "globalBlend": 0.607
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2834,
    "diana": 0.0967,
    "nova": 0.3262,
    "flow": 0.2937
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
    "diana": 0.0937,
    "nova": 0.318,
    "flow": 0.3182
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
    "diana": 0.1035,
    "nova": 0.3097,
    "flow": 0.3186
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
    "diana": 0.0985,
    "nova": 0.327,
    "flow": 0.2863
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
    "diana": 0.1285,
    "nova": 0.2827,
    "flow": 0.3103
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
    "diana": 0.0941,
    "nova": 0.3086,
    "flow": 0.3051
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
