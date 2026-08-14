// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-14 10:09",
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
   "taro": 0.2825,
   "diana": 0.1146,
   "nova": 0.293,
   "flow": 0.3099
  },
  "acc": {
   "taro": {
    "n": 10373,
    "acc": 53.2,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3972,
    "acc": 53.7,
    "adjustedAcc": 53.6,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8988,
    "acc": 56.8,
    "adjustedAcc": 56.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1893,
    "acc": 56.6,
    "adjustedAcc": 56.2,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 25226,
  "team": {
   "hit": 6955,
   "miss": 2869,
   "n": 9824,
   "acc": 70.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.0919,
    "nova": 0.2648,
    "flow": 0.3628
   },
   "acc": {
    "taro": {
     "n": 1252,
     "acc": 52.2,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 356,
     "acc": 40.2,
     "adjustedAcc": 42.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1110,
     "acc": 51.4,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 389,
     "acc": 66.1,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3107,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3021,
    "diana": 0.1071,
    "nova": 0.2848,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 600,
     "acc": 59.8,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 172,
     "acc": 52.9,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 536,
     "acc": 58.4,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 177,
     "acc": 62.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1485,
   "globalBlend": 0.35
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2625,
    "diana": 0.1259,
    "nova": 0.3137,
    "flow": 0.298
   },
   "acc": {
    "taro": {
     "n": 518,
     "acc": 44.4,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 212,
     "acc": 57.5,
     "adjustedAcc": 54.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 483,
     "acc": 58.2,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 114,
     "acc": 50.9,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1327,
   "globalBlend": 0.376
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3018,
    "diana": 0.1086,
    "nova": 0.3146,
    "flow": 0.2751
   },
   "acc": {
    "taro": {
     "n": 393,
     "acc": 53.7,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 179,
     "acc": 43.6,
     "adjustedAcc": 46.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 348,
     "acc": 58.9,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 93,
     "acc": 37.6,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1013,
   "globalBlend": 0.441
  },
  "통신": {
   "weights": {
    "taro": 0.2827,
    "diana": 0.1122,
    "nova": 0.2949,
    "flow": 0.3102
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 53.0,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 50.9,
     "adjustedAcc": 50.3,
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
     "n": 73,
     "acc": 63.0,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 465,
   "globalBlend": 0.632
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2869,
    "diana": 0.1492,
    "nova": 0.2699,
    "flow": 0.2941
   },
   "acc": {
    "taro": {
     "n": 477,
     "acc": 54.3,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 196,
     "acc": 77.0,
     "adjustedAcc": 66.8,
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
     "n": 70,
     "acc": 57.1,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1157,
   "globalBlend": 0.409
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2916,
    "diana": 0.097,
    "nova": 0.3207,
    "flow": 0.2907
   },
   "acc": {
    "taro": {
     "n": 584,
     "acc": 49.5,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 258,
     "acc": 34.5,
     "adjustedAcc": 39.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 471,
     "acc": 57.5,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 163,
     "acc": 46.0,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1476,
   "globalBlend": 0.351
  },
  "2차전지": {
   "weights": {
    "taro": 0.3217,
    "diana": 0.1041,
    "nova": 0.3161,
    "flow": 0.2582
   },
   "acc": {
    "taro": {
     "n": 544,
     "acc": 65.8,
     "adjustedAcc": 63.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 151,
     "acc": 51.7,
     "adjustedAcc": 50.9,
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
     "n": 17,
     "acc": 35.3,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1189,
   "globalBlend": 0.402
  },
  "보험": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.13,
    "nova": 0.2885,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 49.5,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 77.5,
     "adjustedAcc": 61.0,
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
     "n": 40,
     "acc": 52.5,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 475,
   "globalBlend": 0.627
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2983,
    "diana": 0.1138,
    "nova": 0.2901,
    "flow": 0.2977
   },
   "acc": {
    "taro": {
     "n": 1352,
     "acc": 58.5,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 497,
     "acc": 56.9,
     "adjustedAcc": 55.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1188,
     "acc": 59.3,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 171,
     "acc": 61.4,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3208,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.1251,
    "nova": 0.3195,
    "flow": 0.2776
   },
   "acc": {
    "taro": {
     "n": 591,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 275,
     "acc": 58.2,
     "adjustedAcc": 55.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 517,
     "acc": 60.7,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 55,
     "acc": 43.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1438,
   "globalBlend": 0.357
  },
  "조선": {
   "weights": {
    "taro": 0.2735,
    "diana": 0.1219,
    "nova": 0.2992,
    "flow": 0.3053
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 46.1,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 141,
     "acc": 56.7,
     "adjustedAcc": 53.6,
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
     "n": 61,
     "acc": 54.1,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 854,
   "globalBlend": 0.484
  },
  "방산": {
   "weights": {
    "taro": 0.2811,
    "diana": 0.1128,
    "nova": 0.2946,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 47.4,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 39.4,
     "adjustedAcc": 47.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 124,
     "acc": 56.5,
     "adjustedAcc": 53.3,
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
   "graded": 316,
   "globalBlend": 0.717
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.1326,
    "nova": 0.28,
    "flow": 0.2921
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 59.3,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 110,
     "acc": 79.1,
     "adjustedAcc": 63.9,
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
     "n": 2,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 515,
   "globalBlend": 0.608
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2861,
    "diana": 0.1098,
    "nova": 0.2977,
    "flow": 0.3064
   },
   "acc": {
    "taro": {
     "n": 747,
     "acc": 55.0,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 344,
     "acc": 52.9,
     "adjustedAcc": 52.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 673,
     "acc": 59.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 95,
     "acc": 64.2,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1859,
   "globalBlend": 0.301
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2742,
    "diana": 0.1343,
    "nova": 0.2789,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 149,
     "acc": 43.0,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 87.5,
     "adjustedAcc": 63.0,
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
     "n": 99,
     "acc": 56.6,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 419,
   "globalBlend": 0.656
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2956,
    "diana": 0.1075,
    "nova": 0.2907,
    "flow": 0.3061
   },
   "acc": {
    "taro": {
     "n": 456,
     "acc": 54.4,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 190,
     "acc": 45.8,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 357,
     "acc": 55.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 21,
     "acc": 71.4,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1024,
   "globalBlend": 0.439
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2854,
    "diana": 0.1254,
    "nova": 0.2693,
    "flow": 0.3198
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 50.4,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 92,
     "acc": 65.2,
     "adjustedAcc": 56.6,
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
     "n": 22,
     "acc": 81.8,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 596,
   "globalBlend": 0.573
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2894,
    "diana": 0.1168,
    "nova": 0.3075,
    "flow": 0.2862
   },
   "acc": {
    "taro": {
     "n": 308,
     "acc": 53.6,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 119,
     "acc": 55.5,
     "adjustedAcc": 52.7,
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
     "n": 113,
     "acc": 46.9,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 793,
   "globalBlend": 0.502
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2732,
    "diana": 0.1077,
    "nova": 0.3052,
    "flow": 0.3139
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 40.0,
     "adjustedAcc": 42.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 147,
     "acc": 34.0,
     "adjustedAcc": 41.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 270,
     "acc": 52.2,
     "adjustedAcc": 51.5,
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
   "graded": 726,
   "globalBlend": 0.524
  },
  "기계": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1198,
    "nova": 0.2932,
    "flow": 0.3132
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 37.6,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 69.8,
     "adjustedAcc": 55.2,
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
     "n": 9,
     "acc": 100.0,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 250,
   "globalBlend": 0.762
  },
  "로봇": {
   "weights": {
    "taro": 0.3024,
    "diana": 0.1005,
    "nova": 0.3137,
    "flow": 0.2834
   },
   "acc": {
    "taro": {
     "n": 239,
     "acc": 60.3,
     "adjustedAcc": 56.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 95,
     "acc": 29.5,
     "adjustedAcc": 40.9,
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
     "n": 55,
     "acc": 41.8,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 602,
   "globalBlend": 0.571
  },
  "식음료": {
   "weights": {
    "taro": 0.2734,
    "diana": 0.1527,
    "nova": 0.2712,
    "flow": 0.3028
   },
   "acc": {
    "taro": {
     "n": 268,
     "acc": 44.4,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 120,
     "acc": 86.7,
     "adjustedAcc": 68.3,
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
   "graded": 601,
   "globalBlend": 0.571
  },
  "여행레저": {
   "weights": {
    "taro": 0.2958,
    "diana": 0.1074,
    "nova": 0.2959,
    "flow": 0.301
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 56.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 15.6,
     "adjustedAcc": 40.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 111,
     "acc": 55.9,
     "adjustedAcc": 52.8,
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
   "graded": 331,
   "globalBlend": 0.707
  }
 }
};
