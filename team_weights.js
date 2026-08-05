// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-05 14:55",
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
   "diana": 0.0726,
   "nova": 0.3301,
   "flow": 0.288
  },
  "acc": {
   "taro": {
    "n": 7877,
    "acc": 57.1,
    "adjustedAcc": 57.0,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1505,
    "acc": 38.4,
    "adjustedAcc": 39.3,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6659,
    "acc": 61.7,
    "adjustedAcc": 61.5,
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
  "graded": 17414,
  "team": {
   "hit": 5869,
   "miss": 1630,
   "n": 7499,
   "acc": 78.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.318,
    "diana": 0.0744,
    "nova": 0.2727,
    "flow": 0.3349
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
     "acc": 36.4,
     "adjustedAcc": 42.7,
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
    "taro": 0.3333,
    "diana": 0.0755,
    "nova": 0.3074,
    "flow": 0.2838
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
     "n": 66,
     "acc": 39.4,
     "adjustedAcc": 46.2,
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
   "graded": 1073,
   "globalBlend": 0.427
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2927,
    "diana": 0.0872,
    "nova": 0.3321,
    "flow": 0.288
   },
   "acc": {
    "taro": {
     "n": 396,
     "acc": 49.5,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 73,
     "acc": 39.7,
     "adjustedAcc": 46.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 361,
     "acc": 60.7,
     "adjustedAcc": 58.0,
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
   "graded": 903,
   "globalBlend": 0.47
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3173,
    "diana": 0.0752,
    "nova": 0.3484,
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
     "n": 71,
     "acc": 18.3,
     "adjustedAcc": 38.2,
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
   "graded": 712,
   "globalBlend": 0.529
  },
  "통신": {
   "weights": {
    "taro": 0.3036,
    "diana": 0.0815,
    "nova": 0.3229,
    "flow": 0.2919
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
    "diana": 0.1003,
    "nova": 0.3231,
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
     "n": 62,
     "acc": 66.1,
     "adjustedAcc": 55.5,
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
   "graded": 751,
   "globalBlend": 0.516
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3175,
    "diana": 0.0744,
    "nova": 0.3453,
    "flow": 0.2628
   },
   "acc": {
    "taro": {
     "n": 458,
     "acc": 53.9,
     "adjustedAcc": 53.1,
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
     "n": 347,
     "acc": 61.7,
     "adjustedAcc": 58.7,
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
   "graded": 1042,
   "globalBlend": 0.434
  },
  "2차전지": {
   "weights": {
    "taro": 0.3372,
    "diana": 0.0798,
    "nova": 0.3386,
    "flow": 0.2443
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
    "taro": 0.3053,
    "diana": 0.0873,
    "nova": 0.3205,
    "flow": 0.2868
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 51.3,
     "adjustedAcc": 50.7,
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
    "taro": 0.3142,
    "diana": 0.093,
    "nova": 0.3239,
    "flow": 0.2689
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
     "acc": 54.7,
     "adjustedAcc": 52.9,
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
    "taro": 0.3063,
    "diana": 0.0867,
    "nova": 0.3457,
    "flow": 0.2612
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
     "n": 105,
     "acc": 41.0,
     "adjustedAcc": 45.8,
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
   "graded": 981,
   "globalBlend": 0.449
  },
  "조선": {
   "weights": {
    "taro": 0.3053,
    "diana": 0.0758,
    "nova": 0.326,
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
     "n": 59,
     "acc": 10.2,
     "adjustedAcc": 36.9,
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
   "graded": 598,
   "globalBlend": 0.572
  },
  "방산": {
   "weights": {
    "taro": 0.3053,
    "diana": 0.0804,
    "nova": 0.3257,
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
    "taro": 0.3099,
    "diana": 0.0812,
    "nova": 0.3255,
    "flow": 0.2833
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
    "taro": 0.3043,
    "diana": 0.075,
    "nova": 0.3243,
    "flow": 0.2964
   },
   "acc": {
    "taro": {
     "n": 571,
     "acc": 60.6,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 130,
     "acc": 37.7,
     "adjustedAcc": 43.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 501,
     "acc": 66.3,
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
   "graded": 1281,
   "globalBlend": 0.384
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.087,
    "nova": 0.3157,
    "flow": 0.2933
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
    "taro": 0.3069,
    "diana": 0.079,
    "nova": 0.3165,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 340,
     "acc": 53.8,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 73,
     "acc": 27.4,
     "adjustedAcc": 41.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 260,
     "acc": 56.9,
     "adjustedAcc": 54.7,
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
   "graded": 690,
   "globalBlend": 0.537
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3066,
    "diana": 0.0887,
    "nova": 0.3071,
    "flow": 0.2975
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
     "acc": 44.1,
     "adjustedAcc": 48.7,
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
    "diana": 0.0773,
    "nova": 0.3398,
    "flow": 0.2713
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
    "diana": 0.0776,
    "nova": 0.3311,
    "flow": 0.2983
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
    "taro": 0.3081,
    "diana": 0.0892,
    "nova": 0.3348,
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
     "n": 36,
     "acc": 77.8,
     "adjustedAcc": 56.4,
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
   "graded": 430,
   "globalBlend": 0.65
  },
  "식음료": {
   "weights": {
    "taro": 0.2925,
    "diana": 0.0966,
    "nova": 0.311,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 36.3,
     "adjustedAcc": 41.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 70.3,
     "adjustedAcc": 54.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 140,
     "acc": 42.1,
     "adjustedAcc": 45.8,
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
   "graded": 356,
   "globalBlend": 0.692
  },
  "여행레저": {
   "weights": {
    "taro": 0.3179,
    "diana": 0.0773,
    "nova": 0.3224,
    "flow": 0.2825
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
     "acc": 57.3,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 36.1,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 241,
   "globalBlend": 0.768
  }
 }
};
