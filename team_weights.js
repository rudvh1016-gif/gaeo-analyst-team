// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-12 11:12",
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
   "taro": 0.28,
   "diana": 0.104,
   "nova": 0.2954,
   "flow": 0.3206
  },
  "acc": {
   "taro": {
    "n": 9703,
    "acc": 53.0,
    "adjustedAcc": 53.0,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3069,
    "acc": 50.5,
    "adjustedAcc": 50.5,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8906,
    "acc": 57.2,
    "adjustedAcc": 57.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1746,
    "acc": 58.0,
    "adjustedAcc": 57.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 23424,
  "team": {
   "hit": 6493,
   "miss": 2568,
   "n": 9061,
   "acc": 71.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.0843,
    "nova": 0.2641,
    "flow": 0.3704
   },
   "acc": {
    "taro": {
     "n": 1168,
     "acc": 54.0,
     "adjustedAcc": 53.6,
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
     "n": 1085,
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
   "graded": 2896,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2984,
    "diana": 0.0975,
    "nova": 0.2875,
    "flow": 0.3166
   },
   "acc": {
    "taro": {
     "n": 574,
     "acc": 60.6,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 132,
     "acc": 49.2,
     "adjustedAcc": 49.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 523,
     "acc": 60.0,
     "adjustedAcc": 58.2,
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
   "graded": 1392,
   "globalBlend": 0.365
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2607,
    "diana": 0.1163,
    "nova": 0.3191,
    "flow": 0.3039
   },
   "acc": {
    "taro": {
     "n": 487,
     "acc": 43.9,
     "adjustedAcc": 45.1,
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
     "n": 474,
     "acc": 59.3,
     "adjustedAcc": 57.4,
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
   "graded": 1221,
   "globalBlend": 0.396
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2988,
    "diana": 0.0994,
    "nova": 0.32,
    "flow": 0.2818
   },
   "acc": {
    "taro": {
     "n": 376,
     "acc": 52.7,
     "adjustedAcc": 52.0,
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
     "n": 88,
     "acc": 36.4,
     "adjustedAcc": 44.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 948,
   "globalBlend": 0.458
  },
  "통신": {
   "weights": {
    "taro": 0.2766,
    "diana": 0.1039,
    "nova": 0.2979,
    "flow": 0.3216
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 50.3,
     "adjustedAcc": 50.2,
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
     "n": 154,
     "acc": 61.0,
     "adjustedAcc": 56.2,
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
   "graded": 438,
   "globalBlend": 0.646
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.282,
    "diana": 0.139,
    "nova": 0.2765,
    "flow": 0.3024
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
    "taro": 0.2933,
    "diana": 0.0922,
    "nova": 0.323,
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
     "n": 469,
     "acc": 57.8,
     "adjustedAcc": 56.2,
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
   "graded": 1375,
   "globalBlend": 0.368
  },
  "2차전지": {
   "weights": {
    "taro": 0.3135,
    "diana": 0.1004,
    "nova": 0.319,
    "flow": 0.2671
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 64.5,
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
     "n": 476,
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
   "graded": 1120,
   "globalBlend": 0.417
  },
  "보험": {
   "weights": {
    "taro": 0.2787,
    "diana": 0.1191,
    "nova": 0.2916,
    "flow": 0.3107
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
    "taro": 0.292,
    "diana": 0.109,
    "nova": 0.2906,
    "flow": 0.3084
   },
   "acc": {
    "taro": {
     "n": 1247,
     "acc": 58.1,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 379,
     "acc": 56.7,
     "adjustedAcc": 55.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1178,
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
   "graded": 2962,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2788,
    "diana": 0.1182,
    "nova": 0.3233,
    "flow": 0.2798
   },
   "acc": {
    "taro": {
     "n": 549,
     "acc": 49.5,
     "adjustedAcc": 49.6,
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
     "n": 518,
     "acc": 60.6,
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
   "graded": 1337,
   "globalBlend": 0.374
  },
  "조선": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.1087,
    "nova": 0.3068,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 318,
     "acc": 44.7,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 46.8,
     "adjustedAcc": 48.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 312,
     "acc": 56.4,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 52.5,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 800,
   "globalBlend": 0.5
  },
  "방산": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1057,
    "nova": 0.2989,
    "flow": 0.3168
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
    "taro": 0.2943,
    "diana": 0.1184,
    "nova": 0.2848,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 189,
     "acc": 58.7,
     "adjustedAcc": 55.3,
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
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 471,
   "globalBlend": 0.629
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.1026,
    "nova": 0.2984,
    "flow": 0.3171
   },
   "acc": {
    "taro": {
     "n": 699,
     "acc": 54.6,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 266,
     "acc": 50.8,
     "adjustedAcc": 50.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 665,
     "acc": 59.7,
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
   "graded": 1720,
   "globalBlend": 0.317
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1194,
    "nova": 0.2784,
    "flow": 0.3241
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
    "taro": 0.2939,
    "diana": 0.1027,
    "nova": 0.2942,
    "flow": 0.3091
   },
   "acc": {
    "taro": {
     "n": 427,
     "acc": 54.1,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 154,
     "acc": 44.8,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 353,
     "acc": 55.5,
     "adjustedAcc": 54.1,
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
   "graded": 953,
   "globalBlend": 0.456
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2844,
    "diana": 0.1146,
    "nova": 0.2715,
    "flow": 0.3295
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
    "taro": 0.2902,
    "diana": 0.1036,
    "nova": 0.31,
    "flow": 0.2962
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 53.6,
     "adjustedAcc": 52.6,
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
     "n": 254,
     "acc": 61.0,
     "adjustedAcc": 57.5,
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
   "graded": 737,
   "globalBlend": 0.52
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.274,
    "diana": 0.1,
    "nova": 0.3054,
    "flow": 0.3206
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
     "n": 112,
     "acc": 27.7,
     "adjustedAcc": 39.2,
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
   "graded": 667,
   "globalBlend": 0.545
  },
  "기계": {
   "weights": {
    "taro": 0.2715,
    "diana": 0.1098,
    "nova": 0.2967,
    "flow": 0.322
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
    "taro": 0.2938,
    "diana": 0.1007,
    "nova": 0.3167,
    "flow": 0.2888
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
    "taro": 0.2806,
    "diana": 0.1364,
    "nova": 0.2727,
    "flow": 0.3103
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
    "taro": 0.2946,
    "diana": 0.0991,
    "nova": 0.2968,
    "flow": 0.3095
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
