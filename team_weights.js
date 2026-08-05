// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-05 11:39",
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
   "taro": 0.3092,
   "diana": 0.074,
   "nova": 0.3288,
   "flow": 0.2881
  },
  "acc": {
   "taro": {
    "n": 7877,
    "acc": 57.2,
    "adjustedAcc": 57.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1495,
    "acc": 39.1,
    "adjustedAcc": 39.9,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6659,
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
   "hit": 5869,
   "miss": 1629,
   "n": 7498,
   "acc": 78.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3178,
    "diana": 0.0753,
    "nova": 0.2722,
    "flow": 0.3348
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
     "n": 140,
     "acc": 37.1,
     "adjustedAcc": 43.1,
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
   "graded": 2242,
   "globalBlend": 0.263
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3334,
    "diana": 0.0758,
    "nova": 0.3069,
    "flow": 0.2839
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
    "taro": 0.2927,
    "diana": 0.0894,
    "nova": 0.3303,
    "flow": 0.2876
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
     "n": 73,
     "acc": 42.5,
     "adjustedAcc": 47.2,
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
   "graded": 905,
   "globalBlend": 0.469
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3171,
    "diana": 0.0763,
    "nova": 0.3476,
    "flow": 0.2591
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
     "n": 72,
     "acc": 19.4,
     "adjustedAcc": 38.5,
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
   "graded": 713,
   "globalBlend": 0.529
  },
  "통신": {
   "weights": {
    "taro": 0.3035,
    "diana": 0.0828,
    "nova": 0.3219,
    "flow": 0.2918
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
     "n": 21,
     "acc": 42.9,
     "adjustedAcc": 48.9,
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
   "graded": 336,
   "globalBlend": 0.704
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2896,
    "diana": 0.1015,
    "nova": 0.3222,
    "flow": 0.2867
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
    "taro": 0.318,
    "diana": 0.075,
    "nova": 0.3442,
    "flow": 0.2628
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
     "n": 107,
     "acc": 18.7,
     "adjustedAcc": 35.2,
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
   "graded": 1040,
   "globalBlend": 0.435
  },
  "2차전지": {
   "weights": {
    "taro": 0.3372,
    "diana": 0.0805,
    "nova": 0.338,
    "flow": 0.2444
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
    "taro": 0.306,
    "diana": 0.0882,
    "nova": 0.3193,
    "flow": 0.2866
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
    "taro": 0.3138,
    "diana": 0.0944,
    "nova": 0.3232,
    "flow": 0.2687
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
     "n": 189,
     "acc": 55.6,
     "adjustedAcc": 53.4,
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
   "graded": 2176,
   "globalBlend": 0.269
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3064,
    "diana": 0.0869,
    "nova": 0.3453,
    "flow": 0.2613
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
     "n": 104,
     "acc": 40.4,
     "adjustedAcc": 45.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 389,
     "acc": 64.0,
     "adjustedAcc": 60.7,
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
    "taro": 0.3052,
    "diana": 0.0769,
    "nova": 0.3252,
    "flow": 0.2928
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
     "n": 60,
     "acc": 11.7,
     "adjustedAcc": 37.2,
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
   "graded": 599,
   "globalBlend": 0.572
  },
  "방산": {
   "weights": {
    "taro": 0.3052,
    "diana": 0.0815,
    "nova": 0.3246,
    "flow": 0.2887
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
    "taro": 0.3098,
    "diana": 0.0824,
    "nova": 0.3245,
    "flow": 0.2834
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
     "n": 37,
     "acc": 40.5,
     "adjustedAcc": 47.8,
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
   "graded": 346,
   "globalBlend": 0.698
  },
  "화학·소재": {
   "weights": {
    "taro": 0.305,
    "diana": 0.0762,
    "nova": 0.3227,
    "flow": 0.2961
   },
   "acc": {
    "taro": {
     "n": 569,
     "acc": 60.8,
     "adjustedAcc": 58.9,
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
     "n": 499,
     "acc": 66.1,
     "adjustedAcc": 63.0,
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
   "graded": 1274,
   "globalBlend": 0.386
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.0881,
    "nova": 0.3147,
    "flow": 0.2934
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
     "n": 23,
     "acc": 65.2,
     "adjustedAcc": 52.4,
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
   "graded": 269,
   "globalBlend": 0.748
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3074,
    "diana": 0.08,
    "nova": 0.3153,
    "flow": 0.2974
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
    "taro": 0.3064,
    "diana": 0.0904,
    "nova": 0.306,
    "flow": 0.2973
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
     "n": 34,
     "acc": 47.1,
     "adjustedAcc": 49.4,
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
   "graded": 388,
   "globalBlend": 0.673
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3115,
    "diana": 0.0781,
    "nova": 0.339,
    "flow": 0.2714
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
     "n": 46,
     "acc": 15.2,
     "adjustedAcc": 40.4,
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
   "graded": 550,
   "globalBlend": 0.593
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2929,
    "diana": 0.0785,
    "nova": 0.3303,
    "flow": 0.2984
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
    "taro": 0.3076,
    "diana": 0.0913,
    "nova": 0.3334,
    "flow": 0.2677
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
    "diana": 0.0986,
    "nova": 0.3084,
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
     "n": 35,
     "acc": 74.3,
     "adjustedAcc": 55.5,
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
   "graded": 360,
   "globalBlend": 0.69
  },
  "여행레저": {
   "weights": {
    "taro": 0.3177,
    "diana": 0.0784,
    "nova": 0.3202,
    "flow": 0.2836
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
