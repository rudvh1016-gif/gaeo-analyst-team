// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-11 10:14",
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
   "diana": 0.0974,
   "nova": 0.3105,
   "flow": 0.3158
  },
  "acc": {
   "taro": {
    "n": 9372,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2738,
    "acc": 48.2,
    "adjustedAcc": 48.3,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8493,
    "acc": 58.8,
    "adjustedAcc": 58.7,
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
  "graded": 22283,
  "team": {
   "hit": 6291,
   "miss": 2387,
   "n": 8678,
   "acc": 72.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.0817,
    "nova": 0.2749,
    "flow": 0.3643
   },
   "acc": {
    "taro": {
     "n": 1140,
     "acc": 54.4,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 258,
     "acc": 37.2,
     "adjustedAcc": 41.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1041,
     "acc": 54.7,
     "adjustedAcc": 54.2,
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
   "graded": 2788,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2958,
    "diana": 0.0928,
    "nova": 0.3003,
    "flow": 0.3112
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
     "n": 123,
     "acc": 47.2,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 502,
     "acc": 62.2,
     "adjustedAcc": 59.8,
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
   "graded": 1346,
   "globalBlend": 0.373
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2606,
    "diana": 0.1093,
    "nova": 0.329,
    "flow": 0.301
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
     "n": 141,
     "acc": 51.1,
     "adjustedAcc": 50.6,
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
   "graded": 1162,
   "globalBlend": 0.408
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2938,
    "diana": 0.0931,
    "nova": 0.3348,
    "flow": 0.2782
   },
   "acc": {
    "taro": {
     "n": 364,
     "acc": 51.9,
     "adjustedAcc": 51.4,
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
     "n": 330,
     "acc": 61.5,
     "adjustedAcc": 58.4,
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
   "graded": 902,
   "globalBlend": 0.47
  },
  "통신": {
   "weights": {
    "taro": 0.274,
    "diana": 0.0986,
    "nova": 0.3094,
    "flow": 0.3179
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
    "nova": 0.2935,
    "flow": 0.2991
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
    "taro": 0.2886,
    "diana": 0.088,
    "nova": 0.3366,
    "flow": 0.2867
   },
   "acc": {
    "taro": {
     "n": 537,
     "acc": 49.2,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 176,
     "acc": 28.4,
     "adjustedAcc": 37.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 446,
     "acc": 59.4,
     "adjustedAcc": 57.4,
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
   "graded": 1308,
   "globalBlend": 0.38
  },
  "2차전지": {
   "weights": {
    "taro": 0.3057,
    "diana": 0.0956,
    "nova": 0.3352,
    "flow": 0.2634
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
     "n": 106,
     "acc": 50.9,
     "adjustedAcc": 50.4,
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
   "graded": 1071,
   "globalBlend": 0.428
  },
  "보험": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.1121,
    "nova": 0.3045,
    "flow": 0.3071
   },
   "acc": {
    "taro": {
     "n": 178,
     "acc": 48.3,
     "adjustedAcc": 49.0,
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
     "n": 145,
     "acc": 55.9,
     "adjustedAcc": 53.2,
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
   "graded": 415,
   "globalBlend": 0.658
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2839,
    "diana": 0.1059,
    "nova": 0.3084,
    "flow": 0.3018
   },
   "acc": {
    "taro": {
     "n": 1192,
     "acc": 56.9,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 337,
     "acc": 56.1,
     "adjustedAcc": 54.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1116,
     "acc": 62.1,
     "adjustedAcc": 60.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 148,
     "acc": 63.5,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2793,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1139,
    "nova": 0.3354,
    "flow": 0.2763
   },
   "acc": {
    "taro": {
     "n": 528,
     "acc": 49.1,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 194,
     "acc": 55.7,
     "adjustedAcc": 53.5,
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
   "graded": 1263,
   "globalBlend": 0.388
  },
  "조선": {
   "weights": {
    "taro": 0.2712,
    "diana": 0.1015,
    "nova": 0.3141,
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
     "n": 97,
     "acc": 41.2,
     "adjustedAcc": 46.1,
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
   "graded": 764,
   "globalBlend": 0.512
  },
  "방산": {
   "weights": {
    "taro": 0.2751,
    "diana": 0.1006,
    "nova": 0.31,
    "flow": 0.3142
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 44.2,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 33.3,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 116,
     "acc": 56.9,
     "adjustedAcc": 53.4,
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
   "graded": 281,
   "globalBlend": 0.74
  },
  "철강·금속": {
   "weights": {
    "taro": 0.29,
    "diana": 0.1111,
    "nova": 0.2986,
    "flow": 0.3003
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
    "taro": 0.2769,
    "diana": 0.0967,
    "nova": 0.3119,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 679,
     "acc": 54.2,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 238,
     "acc": 48.3,
     "adjustedAcc": 48.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 635,
     "acc": 61.7,
     "adjustedAcc": 59.9,
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
   "graded": 1640,
   "globalBlend": 0.328
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2764,
    "diana": 0.1127,
    "nova": 0.2911,
    "flow": 0.3198
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 47.3,
     "adjustedAcc": 48.6,
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
     "n": 100,
     "acc": 44.0,
     "adjustedAcc": 47.3,
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
   "graded": 363,
   "globalBlend": 0.688
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2903,
    "diana": 0.0988,
    "nova": 0.3025,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 410,
     "acc": 53.4,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 137,
     "acc": 43.1,
     "adjustedAcc": 46.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 340,
     "acc": 55.6,
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
   "graded": 906,
   "globalBlend": 0.469
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.1082,
    "nova": 0.2857,
    "flow": 0.3253
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
     "n": 61,
     "acc": 55.7,
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
   "graded": 518,
   "globalBlend": 0.607
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2841,
    "diana": 0.0966,
    "nova": 0.3252,
    "flow": 0.294
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 52.2,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 36.7,
     "adjustedAcc": 44.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 243,
     "acc": 63.4,
     "adjustedAcc": 59.0,
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
   "graded": 700,
   "globalBlend": 0.533
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.0935,
    "nova": 0.3183,
    "flow": 0.3185
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 38.8,
     "adjustedAcc": 42.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 20.4,
     "adjustedAcc": 36.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 252,
     "acc": 53.2,
     "adjustedAcc": 52.2,
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
   "graded": 627,
   "globalBlend": 0.561
  },
  "기계": {
   "weights": {
    "taro": 0.2683,
    "diana": 0.1038,
    "nova": 0.3092,
    "flow": 0.3188
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
    "taro": 0.2889,
    "diana": 0.0988,
    "nova": 0.3259,
    "flow": 0.2864
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 57.4,
     "adjustedAcc": 54.8,
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
     "n": 205,
     "acc": 67.8,
     "adjustedAcc": 61.2,
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
   "graded": 535,
   "globalBlend": 0.599
  },
  "식음료": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1294,
    "nova": 0.2814,
    "flow": 0.31
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 47.0,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 81,
     "acc": 82.7,
     "adjustedAcc": 63.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 201,
     "acc": 40.8,
     "adjustedAcc": 44.2,
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
   "graded": 516,
   "globalBlend": 0.608
  },
  "여행레저": {
   "weights": {
    "taro": 0.2928,
    "diana": 0.0944,
    "nova": 0.3075,
    "flow": 0.3052
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 58.3,
     "adjustedAcc": 54.2,
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
     "n": 103,
     "acc": 55.3,
     "adjustedAcc": 52.5,
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
   "graded": 296,
   "globalBlend": 0.73
  }
 }
};
