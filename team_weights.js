// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-13 09:12",
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
   "taro": 0.2822,
   "diana": 0.1082,
   "nova": 0.2937,
   "flow": 0.3159
  },
  "acc": {
   "taro": {
    "n": 10032,
    "acc": 53.3,
    "adjustedAcc": 53.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3367,
    "acc": 51.9,
    "adjustedAcc": 51.8,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8941,
    "acc": 56.9,
    "adjustedAcc": 56.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1821,
    "acc": 57.4,
    "adjustedAcc": 57.0,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 24161,
  "team": {
   "hit": 6712,
   "miss": 2711,
   "n": 9423,
   "acc": 71.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2825,
    "diana": 0.0868,
    "nova": 0.2637,
    "flow": 0.3669
   },
   "acc": {
    "taro": {
     "n": 1209,
     "acc": 53.3,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 309,
     "acc": 37.9,
     "adjustedAcc": 41.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1101,
     "acc": 51.9,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 377,
     "acc": 67.4,
     "adjustedAcc": 63.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2996,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1015,
    "nova": 0.2848,
    "flow": 0.3121
   },
   "acc": {
    "taro": {
     "n": 588,
     "acc": 60.5,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 145,
     "acc": 51.0,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 530,
     "acc": 59.1,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 169,
     "acc": 64.5,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1432,
   "globalBlend": 0.358
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2628,
    "diana": 0.1205,
    "nova": 0.3166,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 504,
     "acc": 44.2,
     "adjustedAcc": 45.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 175,
     "acc": 56.0,
     "adjustedAcc": 53.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 479,
     "acc": 58.7,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 107,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1265,
   "globalBlend": 0.387
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.302,
    "diana": 0.1031,
    "nova": 0.3178,
    "flow": 0.2772
   },
   "acc": {
    "taro": {
     "n": 385,
     "acc": 53.2,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 152,
     "acc": 39.5,
     "adjustedAcc": 44.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 347,
     "acc": 59.1,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 35.6,
     "adjustedAcc": 43.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 974,
   "globalBlend": 0.451
  },
  "통신": {
   "weights": {
    "taro": 0.2814,
    "diana": 0.1068,
    "nova": 0.2951,
    "flow": 0.3168
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 52.5,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 46.7,
     "adjustedAcc": 49.1,
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
     "n": 70,
     "acc": 65.7,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 448,
   "globalBlend": 0.641
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2853,
    "diana": 0.1438,
    "nova": 0.2736,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 462,
     "acc": 53.2,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 164,
     "acc": 76.8,
     "adjustedAcc": 65.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 413,
     "acc": 51.8,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 56.1,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1105,
   "globalBlend": 0.42
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2924,
    "diana": 0.0951,
    "nova": 0.3214,
    "flow": 0.2912
   },
   "acc": {
    "taro": {
     "n": 566,
     "acc": 49.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 222,
     "acc": 33.8,
     "adjustedAcc": 39.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 470,
     "acc": 57.7,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 157,
     "acc": 45.2,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1415,
   "globalBlend": 0.361
  },
  "2차전지": {
   "weights": {
    "taro": 0.3173,
    "diana": 0.1019,
    "nova": 0.3177,
    "flow": 0.2631
   },
   "acc": {
    "taro": {
     "n": 527,
     "acc": 65.1,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 127,
     "acc": 52.0,
     "adjustedAcc": 51.0,
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
     "n": 14,
     "acc": 35.7,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1143,
   "globalBlend": 0.412
  },
  "보험": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.1231,
    "nova": 0.2903,
    "flow": 0.3062
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 48.7,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 66,
     "acc": 75.8,
     "adjustedAcc": 59.1,
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
   "graded": 454,
   "globalBlend": 0.638
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.295,
    "diana": 0.111,
    "nova": 0.2897,
    "flow": 0.3044
   },
   "acc": {
    "taro": {
     "n": 1299,
     "acc": 58.4,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 418,
     "acc": 56.9,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1183,
     "acc": 59.6,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 162,
     "acc": 63.6,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3062,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.1208,
    "nova": 0.3209,
    "flow": 0.2785
   },
   "acc": {
    "taro": {
     "n": 569,
     "acc": 50.1,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 238,
     "acc": 57.1,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 515,
     "acc": 60.8,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 41.5,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1375,
   "globalBlend": 0.368
  },
  "조선": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.1136,
    "nova": 0.3021,
    "flow": 0.3098
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 46.0,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 121,
     "acc": 51.2,
     "adjustedAcc": 50.6,
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
     "n": 61,
     "acc": 54.1,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 824,
   "globalBlend": 0.493
  },
  "방산": {
   "weights": {
    "taro": 0.28,
    "diana": 0.1085,
    "nova": 0.2959,
    "flow": 0.3156
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 45.9,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 37.9,
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
     "n": 6,
     "acc": 100.0,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 307,
   "globalBlend": 0.723
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.1232,
    "nova": 0.2816,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 59.3,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 92,
     "acc": 75.0,
     "adjustedAcc": 60.8,
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
     "acc": 100.0,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 492,
   "globalBlend": 0.619
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.1054,
    "nova": 0.298,
    "flow": 0.3129
   },
   "acc": {
    "taro": {
     "n": 720,
     "acc": 54.7,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 293,
     "acc": 51.5,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 668,
     "acc": 59.6,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 92,
     "acc": 66.3,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1773,
   "globalBlend": 0.311
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2766,
    "diana": 0.1253,
    "nova": 0.2789,
    "flow": 0.3192
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 45.1,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 85.2,
     "adjustedAcc": 60.9,
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
     "n": 96,
     "acc": 59.4,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 401,
   "globalBlend": 0.666
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2968,
    "diana": 0.1045,
    "nova": 0.2913,
    "flow": 0.3075
   },
   "acc": {
    "taro": {
     "n": 442,
     "acc": 54.8,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 166,
     "acc": 45.2,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 355,
     "acc": 55.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 20,
     "acc": 70.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 983,
   "globalBlend": 0.449
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2859,
    "diana": 0.1185,
    "nova": 0.2706,
    "flow": 0.3249
   },
   "acc": {
    "taro": {
     "n": 267,
     "acc": 50.6,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 62.3,
     "adjustedAcc": 54.8,
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
     "n": 21,
     "acc": 85.7,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 569,
   "globalBlend": 0.584
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2912,
    "diana": 0.1085,
    "nova": 0.3083,
    "flow": 0.2921
   },
   "acc": {
    "taro": {
     "n": 298,
     "acc": 54.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 49.0,
     "adjustedAcc": 49.5,
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
     "n": 109,
     "acc": 47.7,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 758,
   "globalBlend": 0.513
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2757,
    "diana": 0.1021,
    "nova": 0.3043,
    "flow": 0.3178
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 40.5,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 28.7,
     "adjustedAcc": 39.3,
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
   "graded": 684,
   "globalBlend": 0.539
  },
  "기계": {
   "weights": {
    "taro": 0.2732,
    "diana": 0.1137,
    "nova": 0.2949,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 35.1,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 64.9,
     "adjustedAcc": 53.5,
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
     "n": 8,
     "acc": 100.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 239,
   "globalBlend": 0.77
  },
  "로봇": {
   "weights": {
    "taro": 0.2993,
    "diana": 0.1006,
    "nova": 0.3137,
    "flow": 0.2864
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 59.4,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 35.4,
     "adjustedAcc": 44.2,
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
     "n": 54,
     "acc": 40.7,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 580,
   "globalBlend": 0.58
  },
  "식음료": {
   "weights": {
    "taro": 0.2779,
    "diana": 0.1424,
    "nova": 0.2727,
    "flow": 0.307
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 46.1,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 85.7,
     "adjustedAcc": 66.1,
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
   "graded": 567,
   "globalBlend": 0.585
  },
  "여행레저": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.1027,
    "nova": 0.2958,
    "flow": 0.3061
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 55.9,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 40,
     "acc": 10.0,
     "adjustedAcc": 40.0,
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
   "graded": 315,
   "globalBlend": 0.717
  }
 }
};
