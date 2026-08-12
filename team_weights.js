// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-12 14:29",
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
   "diana": 0.1037,
   "nova": 0.2962,
   "flow": 0.3202
  },
  "acc": {
   "taro": {
    "n": 9697,
    "acc": 53.0,
    "adjustedAcc": 52.9,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3060,
    "acc": 50.4,
    "adjustedAcc": 50.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8895,
    "acc": 57.2,
    "adjustedAcc": 57.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1749,
    "acc": 57.9,
    "adjustedAcc": 57.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 23401,
  "team": {
   "hit": 6498,
   "miss": 2571,
   "n": 9069,
   "acc": 71.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.281,
    "diana": 0.0845,
    "nova": 0.264,
    "flow": 0.3706
   },
   "acc": {
    "taro": {
     "n": 1170,
     "acc": 53.9,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 281,
     "acc": 37.7,
     "adjustedAcc": 41.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1087,
     "acc": 52.6,
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
    "diana": 0.0971,
    "nova": 0.2871,
    "flow": 0.3166
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
    "taro": 0.2609,
    "diana": 0.1165,
    "nova": 0.3195,
    "flow": 0.3031
   },
   "acc": {
    "taro": {
     "n": 488,
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
     "n": 475,
     "acc": 59.2,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 100,
     "acc": 51.0,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1224,
   "globalBlend": 0.395
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2987,
    "diana": 0.0987,
    "nova": 0.3218,
    "flow": 0.2807
   },
   "acc": {
    "taro": {
     "n": 372,
     "acc": 52.7,
     "adjustedAcc": 52.0,
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
     "n": 341,
     "acc": 59.8,
     "adjustedAcc": 57.3,
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
   "graded": 939,
   "globalBlend": 0.46
  },
  "통신": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.1033,
    "nova": 0.2972,
    "flow": 0.3221
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 50.9,
     "adjustedAcc": 50.5,
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
   "graded": 438,
   "globalBlend": 0.646
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.282,
    "diana": 0.1389,
    "nova": 0.2768,
    "flow": 0.3023
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
    "nova": 0.3239,
    "flow": 0.291
   },
   "acc": {
    "taro": {
     "n": 552,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
     "n": 467,
     "acc": 58.0,
     "adjustedAcc": 56.4,
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
   "graded": 1372,
   "globalBlend": 0.368
  },
  "2차전지": {
   "weights": {
    "taro": 0.3125,
    "diana": 0.1003,
    "nova": 0.3203,
    "flow": 0.2669
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 64.3,
     "adjustedAcc": 61.6,
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
     "acc": 67.6,
     "adjustedAcc": 64.1,
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
    "taro": 0.2785,
    "diana": 0.1188,
    "nova": 0.2925,
    "flow": 0.3103
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
    "diana": 0.1086,
    "nova": 0.2912,
    "flow": 0.3085
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
     "n": 379,
     "acc": 56.5,
     "adjustedAcc": 54.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1176,
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
    "taro": 0.2791,
    "diana": 0.1178,
    "nova": 0.3236,
    "flow": 0.2796
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
     "n": 216,
     "acc": 56.0,
     "adjustedAcc": 53.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 516,
     "acc": 60.7,
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
   "graded": 1331,
   "globalBlend": 0.375
  },
  "조선": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.1091,
    "nova": 0.3055,
    "flow": 0.3129
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 45.0,
     "adjustedAcc": 46.4,
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
     "n": 314,
     "acc": 56.1,
     "adjustedAcc": 54.4,
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
   "graded": 807,
   "globalBlend": 0.498
  },
  "방산": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1055,
    "nova": 0.2995,
    "flow": 0.3165
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
    "taro": 0.2942,
    "diana": 0.1181,
    "nova": 0.2857,
    "flow": 0.3021
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
     "n": 198,
     "acc": 53.0,
     "adjustedAcc": 51.9,
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
   "graded": 470,
   "globalBlend": 0.63
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2811,
    "diana": 0.1023,
    "nova": 0.2998,
    "flow": 0.3169
   },
   "acc": {
    "taro": {
     "n": 701,
     "acc": 54.5,
     "adjustedAcc": 53.8,
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
   "graded": 1722,
   "globalBlend": 0.317
  },
  "물류·운송": {
   "weights": {
    "taro": 0.277,
    "diana": 0.12,
    "nova": 0.2809,
    "flow": 0.3221
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 46.4,
     "adjustedAcc": 48.1,
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
     "n": 107,
     "acc": 44.9,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 92,
     "acc": 59.8,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 386,
   "globalBlend": 0.675
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.102,
    "nova": 0.2934,
    "flow": 0.3098
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
     "n": 151,
     "acc": 43.7,
     "adjustedAcc": 46.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 353,
     "acc": 55.0,
     "adjustedAcc": 53.7,
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
   "graded": 950,
   "globalBlend": 0.457
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2836,
    "diana": 0.114,
    "nova": 0.2729,
    "flow": 0.3294
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
    "taro": 0.289,
    "diana": 0.1034,
    "nova": 0.3117,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 287,
     "acc": 53.3,
     "adjustedAcc": 52.3,
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
     "n": 252,
     "acc": 61.5,
     "adjustedAcc": 57.8,
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
   "graded": 733,
   "globalBlend": 0.522
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.0995,
    "nova": 0.306,
    "flow": 0.3205
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
    "taro": 0.2711,
    "diana": 0.1096,
    "nova": 0.2977,
    "flow": 0.3217
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 32.6,
     "adjustedAcc": 42.5,
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
     "n": 97,
     "acc": 55.7,
     "adjustedAcc": 52.5,
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
   "graded": 230,
   "globalBlend": 0.777
  },
  "로봇": {
   "weights": {
    "taro": 0.2943,
    "diana": 0.1005,
    "nova": 0.3166,
    "flow": 0.2886
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 57.8,
     "adjustedAcc": 55.1,
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
     "n": 212,
     "acc": 66.5,
     "adjustedAcc": 60.5,
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
   "graded": 558,
   "globalBlend": 0.589
  },
  "식음료": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.136,
    "nova": 0.2737,
    "flow": 0.3102
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
     "n": 212,
     "acc": 42.9,
     "adjustedAcc": 45.5,
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
   "graded": 548,
   "globalBlend": 0.593
  },
  "여행레저": {
   "weights": {
    "taro": 0.294,
    "diana": 0.0989,
    "nova": 0.298,
    "flow": 0.3092
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
