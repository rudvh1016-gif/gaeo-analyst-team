// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-19 09:11",
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
   "diana": 0.1234,
   "nova": 0.2966,
   "flow": 0.3067
  },
  "acc": {
   "taro": {
    "n": 11167,
    "acc": 51.5,
    "adjustedAcc": 51.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4610,
    "acc": 55.7,
    "adjustedAcc": 55.6,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9013,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2036,
    "acc": 55.7,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26826,
  "team": {
   "hit": 7389,
   "miss": 7078,
   "n": 14467,
   "acc": 51.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1002,
    "nova": 0.2693,
    "flow": 0.3533
   },
   "acc": {
    "taro": {
     "n": 1328,
     "acc": 51.1,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 405,
     "acc": 43.2,
     "adjustedAcc": 44.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1119,
     "acc": 51.1,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 412,
     "acc": 63.3,
     "adjustedAcc": 60.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3264,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2969,
    "diana": 0.1135,
    "nova": 0.2877,
    "flow": 0.3018
   },
   "acc": {
    "taro": {
     "n": 639,
     "acc": 58.7,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 188,
     "acc": 54.8,
     "adjustedAcc": 52.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 538,
     "acc": 58.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 193,
     "acc": 60.1,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1558,
   "globalBlend": 0.339
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2546,
    "diana": 0.1338,
    "nova": 0.3141,
    "flow": 0.2974
   },
   "acc": {
    "taro": {
     "n": 559,
     "acc": 43.5,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 246,
     "acc": 59.8,
     "adjustedAcc": 56.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 485,
     "acc": 57.9,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 123,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1413,
   "globalBlend": 0.362
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2962,
    "diana": 0.117,
    "nova": 0.3154,
    "flow": 0.2715
   },
   "acc": {
    "taro": {
     "n": 420,
     "acc": 53.1,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 206,
     "acc": 48.1,
     "adjustedAcc": 48.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 350,
     "acc": 58.6,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 97,
     "acc": 37.1,
     "adjustedAcc": 44.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1073,
   "globalBlend": 0.427
  },
  "통신": {
   "weights": {
    "taro": 0.2719,
    "diana": 0.1185,
    "nova": 0.2979,
    "flow": 0.3117
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 59,
     "acc": 52.5,
     "adjustedAcc": 50.8,
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
     "n": 83,
     "acc": 63.9,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 492,
   "globalBlend": 0.619
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1568,
    "nova": 0.2731,
    "flow": 0.292
   },
   "acc": {
    "taro": {
     "n": 518,
     "acc": 52.3,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 231,
     "acc": 76.2,
     "adjustedAcc": 67.2,
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
     "n": 76,
     "acc": 55.3,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1239,
   "globalBlend": 0.392
  },
  "금융·증권": {
   "weights": {
    "taro": 0.283,
    "diana": 0.1034,
    "nova": 0.3222,
    "flow": 0.2913
   },
   "acc": {
    "taro": {
     "n": 614,
     "acc": 48.4,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 299,
     "acc": 38.1,
     "adjustedAcc": 41.5,
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
     "n": 167,
     "acc": 46.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1551,
   "globalBlend": 0.34
  },
  "2차전지": {
   "weights": {
    "taro": 0.3048,
    "diana": 0.1088,
    "nova": 0.3237,
    "flow": 0.2627
   },
   "acc": {
    "taro": {
     "n": 588,
     "acc": 61.7,
     "adjustedAcc": 59.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 177,
     "acc": 51.4,
     "adjustedAcc": 50.8,
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
     "n": 23,
     "acc": 43.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1265,
   "globalBlend": 0.387
  },
  "보험": {
   "weights": {
    "taro": 0.2767,
    "diana": 0.1397,
    "nova": 0.2883,
    "flow": 0.2952
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 51.4,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 97,
     "acc": 80.4,
     "adjustedAcc": 63.6,
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
     "n": 41,
     "acc": 51.2,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 511,
   "globalBlend": 0.61
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.284,
    "diana": 0.119,
    "nova": 0.298,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 1462,
     "acc": 55.2,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 577,
     "acc": 56.7,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1191,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 190,
     "acc": 59.5,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3420,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.271,
    "diana": 0.1277,
    "nova": 0.3219,
    "flow": 0.2793
   },
   "acc": {
    "taro": {
     "n": 640,
     "acc": 49.1,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 326,
     "acc": 57.4,
     "adjustedAcc": 55.4,
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
     "n": 59,
     "acc": 45.8,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1542,
   "globalBlend": 0.342
  },
  "조선": {
   "weights": {
    "taro": 0.2643,
    "diana": 0.1332,
    "nova": 0.3013,
    "flow": 0.3011
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 44.7,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 165,
     "acc": 61.8,
     "adjustedAcc": 56.8,
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
     "n": 63,
     "acc": 52.4,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 900,
   "globalBlend": 0.471
  },
  "방산": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.1191,
    "nova": 0.2961,
    "flow": 0.3106
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 47.6,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 48.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 125,
     "acc": 56.0,
     "adjustedAcc": 53.1,
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
   "graded": 334,
   "globalBlend": 0.705
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2841,
    "diana": 0.1455,
    "nova": 0.2832,
    "flow": 0.2872
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 55.6,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 129,
     "acc": 82.2,
     "adjustedAcc": 66.7,
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
     "n": 5,
     "acc": 20.0,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 556,
   "globalBlend": 0.59
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2759,
    "diana": 0.1187,
    "nova": 0.2993,
    "flow": 0.3061
   },
   "acc": {
    "taro": {
     "n": 807,
     "acc": 53.3,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 409,
     "acc": 56.0,
     "adjustedAcc": 54.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 675,
     "acc": 59.3,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 99,
     "acc": 63.6,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1990,
   "globalBlend": 0.287
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2663,
    "diana": 0.1431,
    "nova": 0.2791,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 43.6,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 74,
     "acc": 89.2,
     "adjustedAcc": 64.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 108,
     "acc": 45.4,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 108,
     "acc": 58.3,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 453,
   "globalBlend": 0.638
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.29,
    "diana": 0.1116,
    "nova": 0.2943,
    "flow": 0.304
   },
   "acc": {
    "taro": {
     "n": 497,
     "acc": 53.5,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 225,
     "acc": 46.2,
     "adjustedAcc": 47.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 359,
     "acc": 55.4,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 22,
     "acc": 68.2,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1103,
   "globalBlend": 0.42
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1346,
    "nova": 0.2705,
    "flow": 0.315
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 107,
     "acc": 68.2,
     "adjustedAcc": 58.6,
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
     "n": 24,
     "acc": 75.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 636,
   "globalBlend": 0.557
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.279,
    "diana": 0.1276,
    "nova": 0.3118,
    "flow": 0.2817
   },
   "acc": {
    "taro": {
     "n": 331,
     "acc": 51.1,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 60.4,
     "adjustedAcc": 55.6,
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
     "n": 122,
     "acc": 45.1,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 845,
   "globalBlend": 0.486
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2631,
    "diana": 0.1144,
    "nova": 0.3088,
    "flow": 0.3137
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 38.1,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 169,
     "acc": 37.3,
     "adjustedAcc": 42.6,
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
   "graded": 779,
   "globalBlend": 0.507
  },
  "기계": {
   "weights": {
    "taro": 0.2651,
    "diana": 0.1284,
    "nova": 0.2948,
    "flow": 0.3116
   },
   "acc": {
    "taro": {
     "n": 111,
     "acc": 37.8,
     "adjustedAcc": 44.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 51,
     "acc": 74.5,
     "adjustedAcc": 57.3,
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
     "n": 11,
     "acc": 100.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 270,
   "globalBlend": 0.748
  },
  "로봇": {
   "weights": {
    "taro": 0.2944,
    "diana": 0.1026,
    "nova": 0.3197,
    "flow": 0.2832
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 57.8,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 25.2,
     "adjustedAcc": 38.1,
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
     "n": 59,
     "acc": 42.4,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 639,
   "globalBlend": 0.556
  },
  "식음료": {
   "weights": {
    "taro": 0.2646,
    "diana": 0.1648,
    "nova": 0.2708,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 297,
     "acc": 44.1,
     "adjustedAcc": 45.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 138,
     "acc": 89.1,
     "adjustedAcc": 70.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 212,
     "acc": 43.9,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 3,
     "acc": 66.7,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 650,
   "globalBlend": 0.552
  },
  "여행레저": {
   "weights": {
    "taro": 0.2878,
    "diana": 0.1147,
    "nova": 0.2987,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 143,
     "acc": 54.5,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 21.7,
     "adjustedAcc": 42.2,
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
     "n": 43,
     "acc": 41.9,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 343,
   "globalBlend": 0.7
  }
 }
};
