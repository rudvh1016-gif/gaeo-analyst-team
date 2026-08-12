// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-12 12:12",
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
   "nova": 0.2952,
   "flow": 0.321
  },
  "acc": {
   "taro": {
    "n": 9699,
    "acc": 53.0,
    "adjustedAcc": 53.0,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3062,
    "acc": 50.4,
    "adjustedAcc": 50.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8902,
    "acc": 57.1,
    "adjustedAcc": 57.0,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1749,
    "acc": 58.0,
    "adjustedAcc": 57.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 23412,
  "team": {
   "hit": 6496,
   "miss": 2576,
   "n": 9072,
   "acc": 71.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.0845,
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
     "n": 281,
     "acc": 37.7,
     "adjustedAcc": 41.4,
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
   "graded": 2903,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2993,
    "diana": 0.0971,
    "nova": 0.2867,
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
    "taro": 0.2609,
    "diana": 0.1165,
    "nova": 0.3191,
    "flow": 0.3035
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
    "taro": 0.2988,
    "diana": 0.0987,
    "nova": 0.3213,
    "flow": 0.2811
   },
   "acc": {
    "taro": {
     "n": 374,
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
     "n": 343,
     "acc": 59.8,
     "adjustedAcc": 57.2,
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
   "graded": 943,
   "globalBlend": 0.459
  },
  "통신": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1036,
    "nova": 0.2964,
    "flow": 0.3225
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
     "n": 42,
     "acc": 45.2,
     "adjustedAcc": 48.8,
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
   "graded": 439,
   "globalBlend": 0.646
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.282,
    "diana": 0.1389,
    "nova": 0.2764,
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
    "taro": 0.2933,
    "diana": 0.0921,
    "nova": 0.3229,
    "flow": 0.2917
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
    "taro": 0.314,
    "diana": 0.1003,
    "nova": 0.3185,
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
    "taro": 0.2785,
    "diana": 0.1188,
    "nova": 0.2919,
    "flow": 0.3108
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
    "nova": 0.2909,
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
    "taro": 0.2792,
    "diana": 0.1185,
    "nova": 0.3222,
    "flow": 0.28
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
     "n": 218,
     "acc": 56.4,
     "adjustedAcc": 54.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 518,
     "acc": 60.4,
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
   "graded": 1335,
   "globalBlend": 0.375
  },
  "조선": {
   "weights": {
    "taro": 0.2723,
    "diana": 0.109,
    "nova": 0.3042,
    "flow": 0.3144
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
     "n": 313,
     "acc": 55.9,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 54.2,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 805,
   "globalBlend": 0.498
  },
  "방산": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1055,
    "nova": 0.2988,
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
    "taro": 0.2942,
    "diana": 0.1181,
    "nova": 0.2851,
    "flow": 0.3026
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
    "taro": 0.2809,
    "diana": 0.1023,
    "nova": 0.2995,
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
   "graded": 1721,
   "globalBlend": 0.317
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1198,
    "nova": 0.2788,
    "flow": 0.3237
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 47.1,
     "adjustedAcc": 48.4,
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
     "acc": 43.9,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 92,
     "acc": 60.9,
     "adjustedAcc": 54.7,
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
    "nova": 0.293,
    "flow": 0.3102
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
    "taro": 0.2844,
    "diana": 0.1144,
    "nova": 0.2714,
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
    "taro": 0.29,
    "diana": 0.1034,
    "nova": 0.3103,
    "flow": 0.2963
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
     "n": 255,
     "acc": 61.2,
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
   "graded": 738,
   "globalBlend": 0.52
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.0993,
    "nova": 0.305,
    "flow": 0.321
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
     "acc": 26.8,
     "adjustedAcc": 38.8,
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
    "taro": 0.2715,
    "diana": 0.1096,
    "nova": 0.2965,
    "flow": 0.3223
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
    "diana": 0.1006,
    "nova": 0.3166,
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
    "taro": 0.2788,
    "diana": 0.1356,
    "nova": 0.2746,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 46.7,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 88,
     "acc": 84.1,
     "adjustedAcc": 64.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 211,
     "acc": 43.6,
     "adjustedAcc": 45.9,
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
   "graded": 545,
   "globalBlend": 0.595
  },
  "여행레저": {
   "weights": {
    "taro": 0.294,
    "diana": 0.0989,
    "nova": 0.2973,
    "flow": 0.3098
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
