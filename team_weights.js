// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 14:49",
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
   "taro": 0.3316,
   "diana": 0.0721,
   "nova": 0.3104,
   "flow": 0.2859
  },
  "acc": {
   "taro": {
    "n": 7444,
    "acc": 59.7,
    "adjustedAcc": 59.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1235,
    "acc": 38.1,
    "adjustedAcc": 39.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6169,
    "acc": 59.8,
    "adjustedAcc": 59.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1285,
    "acc": 55.0,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 16133,
  "team": {
   "hit": 5786,
   "miss": 1463,
   "n": 7249,
   "acc": 79.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3457,
    "diana": 0.0751,
    "nova": 0.2517,
    "flow": 0.3274
   },
   "acc": {
    "taro": {
     "n": 907,
     "acc": 65.8,
     "adjustedAcc": 64.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 116,
     "acc": 37.1,
     "adjustedAcc": 43.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 794,
     "acc": 52.4,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 285,
     "acc": 68.8,
     "adjustedAcc": 63.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2102,
   "globalBlend": 0.276
  },
  "전자·부품": {
   "weights": {
    "taro": 0.357,
    "diana": 0.0735,
    "nova": 0.2887,
    "flow": 0.2808
   },
   "acc": {
    "taro": {
     "n": 445,
     "acc": 73.9,
     "adjustedAcc": 68.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 35.2,
     "adjustedAcc": 45.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 377,
     "acc": 63.4,
     "adjustedAcc": 60.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 126,
     "acc": 66.7,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1002,
   "globalBlend": 0.444
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.315,
    "diana": 0.0878,
    "nova": 0.309,
    "flow": 0.2882
   },
   "acc": {
    "taro": {
     "n": 370,
     "acc": 52.7,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 41.3,
     "adjustedAcc": 47.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 334,
     "acc": 57.2,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 53.0,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 833,
   "globalBlend": 0.49
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3367,
    "diana": 0.0754,
    "nova": 0.329,
    "flow": 0.2589
   },
   "acc": {
    "taro": {
     "n": 294,
     "acc": 60.2,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 57,
     "acc": 15.8,
     "adjustedAcc": 39.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 241,
     "acc": 65.6,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 69,
     "acc": 31.9,
     "adjustedAcc": 43.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 661,
   "globalBlend": 0.548
  },
  "통신": {
   "weights": {
    "taro": 0.3227,
    "diana": 0.0812,
    "nova": 0.306,
    "flow": 0.29
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 57.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 18,
     "acc": 44.4,
     "adjustedAcc": 49.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 112,
     "acc": 61.6,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 45,
     "acc": 64.4,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 313,
   "globalBlend": 0.719
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.0968,
    "nova": 0.31,
    "flow": 0.2879
   },
   "acc": {
    "taro": {
     "n": 326,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 64.6,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 278,
     "acc": 58.6,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 56.8,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 689,
   "globalBlend": 0.537
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3392,
    "diana": 0.0767,
    "nova": 0.3235,
    "flow": 0.2607
   },
   "acc": {
    "taro": {
     "n": 429,
     "acc": 56.6,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 19.5,
     "adjustedAcc": 37.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 316,
     "acc": 58.9,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 122,
     "acc": 36.1,
     "adjustedAcc": 43.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 954,
   "globalBlend": 0.456
  },
  "2차전지": {
   "weights": {
    "taro": 0.3618,
    "diana": 0.0778,
    "nova": 0.3164,
    "flow": 0.244
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 78.7,
     "adjustedAcc": 72.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 53.8,
     "adjustedAcc": 51.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 338,
     "acc": 74.3,
     "adjustedAcc": 67.9,
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
   "graded": 796,
   "globalBlend": 0.501
  },
  "보험": {
   "weights": {
    "taro": 0.3252,
    "diana": 0.0857,
    "nova": 0.3039,
    "flow": 0.2851
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 53.5,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 58.3,
     "adjustedAcc": 51.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 104,
     "acc": 53.8,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 45.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 305,
   "globalBlend": 0.724
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3325,
    "diana": 0.0927,
    "nova": 0.3061,
    "flow": 0.2688
   },
   "acc": {
    "taro": {
     "n": 942,
     "acc": 63.9,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 159,
     "acc": 55.3,
     "adjustedAcc": 53.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 806,
     "acc": 63.4,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 121,
     "acc": 58.7,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2028,
   "globalBlend": 0.283
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3252,
    "diana": 0.0854,
    "nova": 0.3297,
    "flow": 0.2598
   },
   "acc": {
    "taro": {
     "n": 428,
     "acc": 55.8,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 85,
     "acc": 38.8,
     "adjustedAcc": 45.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 360,
     "acc": 62.8,
     "adjustedAcc": 59.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 27.0,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 910,
   "globalBlend": 0.468
  },
  "조선": {
   "weights": {
    "taro": 0.3246,
    "diana": 0.0745,
    "nova": 0.3079,
    "flow": 0.293
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 53.3,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 51,
     "acc": 3.9,
     "adjustedAcc": 36.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 219,
     "acc": 55.3,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 35,
     "acc": 54.3,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 551,
   "globalBlend": 0.592
  },
  "방산": {
   "weights": {
    "taro": 0.3261,
    "diana": 0.0798,
    "nova": 0.3073,
    "flow": 0.2869
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 54.1,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 12,
     "acc": 33.3,
     "adjustedAcc": 48.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 83,
     "acc": 57.8,
     "adjustedAcc": 53.2,
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
   "graded": 205,
   "globalBlend": 0.796
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3287,
    "diana": 0.0791,
    "nova": 0.3105,
    "flow": 0.2817
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 60.0,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 32,
     "acc": 31.2,
     "adjustedAcc": 46.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 137,
     "acc": 62.8,
     "adjustedAcc": 56.8,
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
   "graded": 324,
   "globalBlend": 0.712
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3244,
    "diana": 0.0747,
    "nova": 0.306,
    "flow": 0.2949
   },
   "acc": {
    "taro": {
     "n": 542,
     "acc": 63.7,
     "adjustedAcc": 61.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 105,
     "acc": 37.1,
     "adjustedAcc": 44.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 465,
     "acc": 64.7,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 76,
     "acc": 73.7,
     "adjustedAcc": 59.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1188,
   "globalBlend": 0.402
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3223,
    "diana": 0.0846,
    "nova": 0.3031,
    "flow": 0.2901
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 47.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 17,
     "acc": 58.8,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 62,
     "acc": 48.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 64,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 243,
   "globalBlend": 0.767
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.32,
    "diana": 0.0803,
    "nova": 0.3032,
    "flow": 0.2965
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 54.4,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 58,
     "acc": 29.3,
     "adjustedAcc": 43.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 234,
     "acc": 56.4,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 16,
     "acc": 81.2,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 628,
   "globalBlend": 0.56
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3237,
    "diana": 0.0883,
    "nova": 0.2936,
    "flow": 0.2945
   },
   "acc": {
    "taro": {
     "n": 194,
     "acc": 47.9,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 46.4,
     "adjustedAcc": 49.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 133,
     "acc": 40.6,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 1,
     "acc": 0.0,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 356,
   "globalBlend": 0.692
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3316,
    "diana": 0.0771,
    "nova": 0.3227,
    "flow": 0.2686
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
     "n": 39,
     "acc": 10.3,
     "adjustedAcc": 40.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 176,
     "acc": 64.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 35.6,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 511,
   "globalBlend": 0.61
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3095,
    "diana": 0.0789,
    "nova": 0.3161,
    "flow": 0.2955
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 42.1,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 42,
     "acc": 9.5,
     "adjustedAcc": 39.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 176,
     "acc": 56.2,
     "adjustedAcc": 53.7,
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
   "graded": 436,
   "globalBlend": 0.647
  },
  "로봇": {
   "weights": {
    "taro": 0.3266,
    "diana": 0.0908,
    "nova": 0.3143,
    "flow": 0.2683
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 65.0,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 96.7,
     "adjustedAcc": 59.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 71.0,
     "adjustedAcc": 61.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 44.7,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 400,
   "globalBlend": 0.667
  },
  "식음료": {
   "weights": {
    "taro": 0.3087,
    "diana": 0.096,
    "nova": 0.297,
    "flow": 0.2983
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 34.9,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 78.6,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 129,
     "acc": 40.3,
     "adjustedAcc": 45.0,
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
   "graded": 326,
   "globalBlend": 0.71
  },
  "여행레저": {
   "weights": {
    "taro": 0.3361,
    "diana": 0.0773,
    "nova": 0.3066,
    "flow": 0.28
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 65.3,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 16,
     "acc": 0.0,
     "adjustedAcc": 44.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 75,
     "acc": 57.3,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 33.3,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 219,
   "globalBlend": 0.785
  }
 }
};
