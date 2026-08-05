// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-05 10:38",
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
   "taro": 0.3094,
   "diana": 0.0735,
   "nova": 0.3289,
   "flow": 0.2883
  },
  "acc": {
   "taro": {
    "n": 7878,
    "acc": 57.2,
    "adjustedAcc": 57.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1492,
    "acc": 38.9,
    "adjustedAcc": 39.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6661,
    "acc": 61.6,
    "adjustedAcc": 61.4,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1373,
    "acc": 55.1,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 17404,
  "team": {
   "hit": 5872,
   "miss": 1629,
   "n": 7501,
   "acc": 78.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3177,
    "diana": 0.0757,
    "nova": 0.2721,
    "flow": 0.3346
   },
   "acc": {
    "taro": {
     "n": 957,
     "acc": 62.0,
     "adjustedAcc": 60.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 138,
     "acc": 37.7,
     "adjustedAcc": 43.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 844,
     "acc": 55.6,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 301,
     "acc": 69.1,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2240,
   "globalBlend": 0.263
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3335,
    "diana": 0.0756,
    "nova": 0.307,
    "flow": 0.284
   },
   "acc": {
    "taro": {
     "n": 471,
     "acc": 70.1,
     "adjustedAcc": 66.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 65,
     "acc": 38.5,
     "adjustedAcc": 45.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 403,
     "acc": 65.5,
     "adjustedAcc": 62.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 133,
     "acc": 66.2,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1072,
   "globalBlend": 0.427
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2929,
    "diana": 0.0888,
    "nova": 0.3305,
    "flow": 0.2878
   },
   "acc": {
    "taro": {
     "n": 397,
     "acc": 49.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 72,
     "acc": 41.7,
     "adjustedAcc": 46.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 362,
     "acc": 60.5,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 52.1,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 904,
   "globalBlend": 0.469
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3171,
    "diana": 0.0764,
    "nova": 0.3474,
    "flow": 0.2592
   },
   "acc": {
    "taro": {
     "n": 310,
     "acc": 57.4,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 70,
     "acc": 20.0,
     "adjustedAcc": 38.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 259,
     "acc": 67.2,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 72,
     "acc": 31.9,
     "adjustedAcc": 43.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 711,
   "globalBlend": 0.529
  },
  "통신": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.0821,
    "nova": 0.3221,
    "flow": 0.2921
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 54.8,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 20,
     "acc": 40.0,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 120,
     "acc": 63.3,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 49,
     "acc": 63.3,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 335,
   "globalBlend": 0.705
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2897,
    "diana": 0.1012,
    "nova": 0.3223,
    "flow": 0.2868
   },
   "acc": {
    "taro": {
     "n": 347,
     "acc": 49.0,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 61,
     "acc": 67.2,
     "adjustedAcc": 55.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 302,
     "acc": 59.6,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 55.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 750,
   "globalBlend": 0.516
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3181,
    "diana": 0.0746,
    "nova": 0.3443,
    "flow": 0.263
   },
   "acc": {
    "taro": {
     "n": 457,
     "acc": 54.0,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 108,
     "acc": 18.5,
     "adjustedAcc": 35.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 346,
     "acc": 61.6,
     "adjustedAcc": 58.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 130,
     "acc": 37.7,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1041,
   "globalBlend": 0.435
  },
  "2차전지": {
   "weights": {
    "taro": 0.3373,
    "diana": 0.0802,
    "nova": 0.338,
    "flow": 0.2445
   },
   "acc": {
    "taro": {
     "n": 427,
     "acc": 74.2,
     "adjustedAcc": 68.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 54.7,
     "adjustedAcc": 51.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 361,
     "acc": 76.2,
     "adjustedAcc": 69.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 3,
     "acc": 33.3,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 855,
   "globalBlend": 0.483
  },
  "보험": {
   "weights": {
    "taro": 0.3061,
    "diana": 0.0878,
    "nova": 0.3194,
    "flow": 0.2867
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 51.9,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 26,
     "acc": 61.5,
     "adjustedAcc": 52.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 115,
     "acc": 56.5,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 34,
     "acc": 47.1,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 329,
   "globalBlend": 0.709
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.314,
    "diana": 0.0939,
    "nova": 0.3233,
    "flow": 0.2688
   },
   "acc": {
    "taro": {
     "n": 995,
     "acc": 61.8,
     "adjustedAcc": 60.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 190,
     "acc": 55.3,
     "adjustedAcc": 53.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 867,
     "acc": 65.3,
     "adjustedAcc": 63.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 125,
     "acc": 58.4,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2177,
   "globalBlend": 0.269
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3069,
    "diana": 0.0864,
    "nova": 0.345,
    "flow": 0.2617
   },
   "acc": {
    "taro": {
     "n": 449,
     "acc": 53.7,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 103,
     "acc": 39.8,
     "adjustedAcc": 45.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 390,
     "acc": 63.8,
     "adjustedAcc": 60.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 28.9,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 980,
   "globalBlend": 0.449
  },
  "조선": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.0764,
    "nova": 0.3253,
    "flow": 0.293
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 50.6,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 61,
     "acc": 11.5,
     "adjustedAcc": 37.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 237,
     "acc": 57.4,
     "adjustedAcc": 54.9,
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
   "graded": 600,
   "globalBlend": 0.571
  },
  "방산": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.0811,
    "nova": 0.3247,
    "flow": 0.2889
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 50.9,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 15,
     "acc": 33.3,
     "adjustedAcc": 48.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 90,
     "acc": 61.1,
     "adjustedAcc": 54.8,
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
   "graded": 222,
   "globalBlend": 0.783
  },
  "철강·금속": {
   "weights": {
    "taro": 0.31,
    "diana": 0.0818,
    "nova": 0.3246,
    "flow": 0.2836
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 57.8,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 38,
     "acc": 39.5,
     "adjustedAcc": 47.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 148,
     "acc": 62.8,
     "adjustedAcc": 57.1,
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
   "graded": 347,
   "globalBlend": 0.697
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3046,
    "diana": 0.076,
    "nova": 0.3232,
    "flow": 0.2962
   },
   "acc": {
    "taro": {
     "n": 570,
     "acc": 60.7,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 127,
     "acc": 38.6,
     "adjustedAcc": 44.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 500,
     "acc": 66.2,
     "adjustedAcc": 63.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 79,
     "acc": 72.2,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1276,
   "globalBlend": 0.385
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.0874,
    "nova": 0.3149,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 107,
     "acc": 46.7,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 22,
     "acc": 63.6,
     "adjustedAcc": 52.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 70,
     "acc": 47.1,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 69,
     "acc": 52.2,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 268,
   "globalBlend": 0.749
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3075,
    "diana": 0.0797,
    "nova": 0.3153,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 339,
     "acc": 54.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 72,
     "acc": 27.8,
     "adjustedAcc": 41.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 259,
     "acc": 56.8,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 76.5,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 687,
   "globalBlend": 0.538
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3066,
    "diana": 0.0897,
    "nova": 0.3062,
    "flow": 0.2976
   },
   "acc": {
    "taro": {
     "n": 205,
     "acc": 47.3,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 35,
     "acc": 45.7,
     "adjustedAcc": 49.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 145,
     "acc": 42.1,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 4,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 389,
   "globalBlend": 0.673
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3117,
    "diana": 0.0775,
    "nova": 0.3392,
    "flow": 0.2716
   },
   "acc": {
    "taro": {
     "n": 235,
     "acc": 55.7,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 13.3,
     "adjustedAcc": 40.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 190,
     "acc": 66.3,
     "adjustedAcc": 60.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 79,
     "acc": 39.2,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 549,
   "globalBlend": 0.593
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.293,
    "diana": 0.0782,
    "nova": 0.3304,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 40.6,
     "adjustedAcc": 43.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 7.4,
     "adjustedAcc": 36.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 193,
     "acc": 56.0,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 3,
     "acc": 33.3,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 479,
   "globalBlend": 0.625
  },
  "로봇": {
   "weights": {
    "taro": 0.3078,
    "diana": 0.091,
    "nova": 0.3335,
    "flow": 0.2678
   },
   "acc": {
    "taro": {
     "n": 187,
     "acc": 61.5,
     "adjustedAcc": 57.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 84.8,
     "adjustedAcc": 57.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 165,
     "acc": 72.7,
     "adjustedAcc": 63.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 42,
     "acc": 40.5,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 427,
   "globalBlend": 0.652
  },
  "식음료": {
   "weights": {
    "taro": 0.2935,
    "diana": 0.0987,
    "nova": 0.3083,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 37.4,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 75.0,
     "adjustedAcc": 55.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 143,
     "acc": 41.3,
     "adjustedAcc": 45.2,
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
   "graded": 361,
   "globalBlend": 0.689
  },
  "여행레저": {
   "weights": {
    "taro": 0.3179,
    "diana": 0.078,
    "nova": 0.3204,
    "flow": 0.2838
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 62.7,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 21,
     "acc": 0.0,
     "adjustedAcc": 42.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 82,
     "acc": 56.1,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 38.9,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 241,
   "globalBlend": 0.768
  }
 }
};
