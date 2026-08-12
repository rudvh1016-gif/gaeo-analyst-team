// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-12 14:58",
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
   "taro": 0.2803,
   "diana": 0.1036,
   "nova": 0.295,
   "flow": 0.3212
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
    "n": 3059,
    "acc": 50.4,
    "adjustedAcc": 50.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8903,
    "acc": 57.1,
    "adjustedAcc": 57.0,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1750,
    "acc": 58.1,
    "adjustedAcc": 57.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 23412,
  "team": {
   "hit": 6487,
   "miss": 2580,
   "n": 9067,
   "acc": 71.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.0846,
    "nova": 0.2627,
    "flow": 0.3715
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
     "n": 280,
     "acc": 37.9,
     "adjustedAcc": 41.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1089,
     "acc": 52.4,
     "adjustedAcc": 52.2,
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
   "graded": 2902,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2994,
    "diana": 0.0971,
    "nova": 0.2866,
    "flow": 0.3169
   },
   "acc": {
    "taro": {
     "n": 574,
     "acc": 60.8,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 131,
     "acc": 48.9,
     "adjustedAcc": 49.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 523,
     "acc": 59.8,
     "adjustedAcc": 58.0,
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
    "diana": 0.1164,
    "nova": 0.3173,
    "flow": 0.3046
   },
   "acc": {
    "taro": {
     "n": 488,
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
     "n": 476,
     "acc": 58.8,
     "adjustedAcc": 57.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 99,
     "acc": 51.5,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1224,
   "globalBlend": 0.395
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2997,
    "diana": 0.0988,
    "nova": 0.3203,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 373,
     "acc": 52.8,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 36.0,
     "adjustedAcc": 42.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 343,
     "acc": 59.5,
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
   "graded": 942,
   "globalBlend": 0.459
  },
  "통신": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1032,
    "nova": 0.2962,
    "flow": 0.3226
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 51.1,
     "adjustedAcc": 50.7,
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
     "acc": 60.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 68,
     "acc": 67.6,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 437,
   "globalBlend": 0.647
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2821,
    "diana": 0.1389,
    "nova": 0.2763,
    "flow": 0.3027
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
    "taro": 0.2931,
    "diana": 0.092,
    "nova": 0.3232,
    "flow": 0.2916
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
     "n": 468,
     "acc": 57.9,
     "adjustedAcc": 56.3,
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
   "graded": 1374,
   "globalBlend": 0.368
  },
  "2차전지": {
   "weights": {
    "taro": 0.3137,
    "diana": 0.1002,
    "nova": 0.3189,
    "flow": 0.2673
   },
   "acc": {
    "taro": {
     "n": 514,
     "acc": 64.6,
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
     "n": 474,
     "acc": 67.5,
     "adjustedAcc": 64.0,
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
   "graded": 1116,
   "globalBlend": 0.418
  },
  "보험": {
   "weights": {
    "taro": 0.2787,
    "diana": 0.1187,
    "nova": 0.2917,
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
    "taro": 0.2918,
    "diana": 0.1082,
    "nova": 0.2912,
    "flow": 0.3087
   },
   "acc": {
    "taro": {
     "n": 1245,
     "acc": 58.0,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 380,
     "acc": 56.3,
     "adjustedAcc": 54.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1175,
     "acc": 59.8,
     "adjustedAcc": 58.9,
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
   "graded": 2958,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1175,
    "nova": 0.3229,
    "flow": 0.2802
   },
   "acc": {
    "taro": {
     "n": 548,
     "acc": 49.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 217,
     "acc": 55.8,
     "adjustedAcc": 53.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 517,
     "acc": 60.5,
     "adjustedAcc": 58.6,
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
   "graded": 1333,
   "globalBlend": 0.375
  },
  "조선": {
   "weights": {
    "taro": 0.2733,
    "diana": 0.1088,
    "nova": 0.3044,
    "flow": 0.3136
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 45.2,
     "adjustedAcc": 46.5,
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
     "n": 315,
     "acc": 55.9,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 60,
     "acc": 53.3,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 808,
   "globalBlend": 0.498
  },
  "방산": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1053,
    "nova": 0.2975,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 45.8,
     "adjustedAcc": 47.7,
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
     "n": 122,
     "acc": 56.6,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 4,
     "acc": 100.0,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 295,
   "globalBlend": 0.731
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2945,
    "diana": 0.1179,
    "nova": 0.2841,
    "flow": 0.3035
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 58.9,
     "adjustedAcc": 55.5,
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
     "n": 1,
     "acc": 100.0,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 473,
   "globalBlend": 0.628
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2809,
    "diana": 0.1025,
    "nova": 0.2994,
    "flow": 0.3173
   },
   "acc": {
    "taro": {
     "n": 700,
     "acc": 54.4,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 264,
     "acc": 50.8,
     "adjustedAcc": 50.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 666,
     "acc": 59.9,
     "adjustedAcc": 58.4,
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
   "graded": 1720,
   "globalBlend": 0.317
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.12,
    "nova": 0.2792,
    "flow": 0.3232
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 46.8,
     "adjustedAcc": 48.3,
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
     "n": 108,
     "acc": 44.4,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 93,
     "acc": 60.2,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 389,
   "globalBlend": 0.673
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.102,
    "nova": 0.2927,
    "flow": 0.3105
   },
   "acc": {
    "taro": {
     "n": 428,
     "acc": 54.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 151,
     "acc": 43.7,
     "adjustedAcc": 46.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 354,
     "acc": 54.8,
     "adjustedAcc": 53.6,
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
   "graded": 952,
   "globalBlend": 0.457
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2838,
    "diana": 0.114,
    "nova": 0.2722,
    "flow": 0.33
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 70,
     "acc": 60.0,
     "adjustedAcc": 53.7,
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
     "n": 20,
     "acc": 90.0,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 550,
   "globalBlend": 0.593
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2898,
    "diana": 0.1034,
    "nova": 0.3104,
    "flow": 0.2965
   },
   "acc": {
    "taro": {
     "n": 288,
     "acc": 53.5,
     "adjustedAcc": 52.5,
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
     "n": 253,
     "acc": 61.3,
     "adjustedAcc": 57.6,
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
   "graded": 735,
   "globalBlend": 0.521
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2743,
    "diana": 0.0994,
    "nova": 0.3053,
    "flow": 0.3211
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 40.1,
     "adjustedAcc": 43.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 27.0,
     "adjustedAcc": 39.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 267,
     "acc": 51.7,
     "adjustedAcc": 51.2,
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
   "graded": 666,
   "globalBlend": 0.546
  },
  "기계": {
   "weights": {
    "taro": 0.2717,
    "diana": 0.1095,
    "nova": 0.2964,
    "flow": 0.3225
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
    "taro": 0.2951,
    "diana": 0.1005,
    "nova": 0.3153,
    "flow": 0.2892
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 58.0,
     "adjustedAcc": 55.2,
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
     "acc": 66.2,
     "adjustedAcc": 60.4,
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
    "taro": 0.2801,
    "diana": 0.1359,
    "nova": 0.2733,
    "flow": 0.3107
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 47.3,
     "adjustedAcc": 48.2,
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
   "graded": 549,
   "globalBlend": 0.593
  },
  "여행레저": {
   "weights": {
    "taro": 0.2942,
    "diana": 0.0988,
    "nova": 0.2971,
    "flow": 0.3099
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
