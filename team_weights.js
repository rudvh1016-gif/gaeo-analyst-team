// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 15:19",
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
   "taro": 0.3305,
   "diana": 0.0721,
   "nova": 0.3114,
   "flow": 0.286
  },
  "acc": {
   "taro": {
    "n": 7445,
    "acc": 59.6,
    "adjustedAcc": 59.4,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1228,
    "acc": 38.2,
    "adjustedAcc": 39.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6170,
    "acc": 60.0,
    "adjustedAcc": 59.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1286,
    "acc": 55.1,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 16129,
  "team": {
   "hit": 5785,
   "miss": 1467,
   "n": 7252,
   "acc": 79.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3433,
    "diana": 0.0749,
    "nova": 0.2531,
    "flow": 0.3287
   },
   "acc": {
    "taro": {
     "n": 904,
     "acc": 65.6,
     "adjustedAcc": 63.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 114,
     "acc": 36.8,
     "adjustedAcc": 43.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 791,
     "acc": 52.7,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 285,
     "acc": 69.1,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2094,
   "globalBlend": 0.276
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3559,
    "diana": 0.0735,
    "nova": 0.2895,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 446,
     "acc": 73.8,
     "adjustedAcc": 68.7,
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
     "n": 378,
     "acc": 63.5,
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
   "graded": 1004,
   "globalBlend": 0.443
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.313,
    "diana": 0.0875,
    "nova": 0.312,
    "flow": 0.2875
   },
   "acc": {
    "taro": {
     "n": 372,
     "acc": 52.2,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 40.3,
     "adjustedAcc": 46.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 336,
     "acc": 57.7,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 67,
     "acc": 52.2,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 837,
   "globalBlend": 0.489
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3361,
    "diana": 0.0754,
    "nova": 0.3296,
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
    "taro": 0.3219,
    "diana": 0.0815,
    "nova": 0.3067,
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
     "n": 17,
     "acc": 47.1,
     "adjustedAcc": 49.6,
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
   "graded": 312,
   "globalBlend": 0.719
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3052,
    "diana": 0.0968,
    "nova": 0.31,
    "flow": 0.288
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 49.8,
     "adjustedAcc": 49.9,
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
     "n": 279,
     "acc": 58.4,
     "adjustedAcc": 55.9,
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
   "graded": 691,
   "globalBlend": 0.537
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3387,
    "diana": 0.0767,
    "nova": 0.324,
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
    "taro": 0.3607,
    "diana": 0.0778,
    "nova": 0.3174,
    "flow": 0.244
   },
   "acc": {
    "taro": {
     "n": 403,
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
     "n": 337,
     "acc": 74.5,
     "adjustedAcc": 68.1,
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
   "graded": 794,
   "globalBlend": 0.502
  },
  "보험": {
   "weights": {
    "taro": 0.3231,
    "diana": 0.086,
    "nova": 0.3059,
    "flow": 0.2849
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 52.7,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 23,
     "acc": 60.9,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 105,
     "acc": 55.2,
     "adjustedAcc": 52.4,
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
   "graded": 307,
   "globalBlend": 0.723
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3325,
    "diana": 0.0922,
    "nova": 0.3065,
    "flow": 0.2687
   },
   "acc": {
    "taro": {
     "n": 941,
     "acc": 64.0,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 158,
     "acc": 55.1,
     "adjustedAcc": 52.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 804,
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
   "graded": 2024,
   "globalBlend": 0.283
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3243,
    "diana": 0.0854,
    "nova": 0.3304,
    "flow": 0.26
   },
   "acc": {
    "taro": {
     "n": 429,
     "acc": 55.7,
     "adjustedAcc": 54.5,
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
   "graded": 911,
   "globalBlend": 0.468
  },
  "조선": {
   "weights": {
    "taro": 0.3241,
    "diana": 0.0745,
    "nova": 0.3081,
    "flow": 0.2932
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
     "n": 220,
     "acc": 55.0,
     "adjustedAcc": 53.2,
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
   "graded": 552,
   "globalBlend": 0.592
  },
  "방산": {
   "weights": {
    "taro": 0.3252,
    "diana": 0.0798,
    "nova": 0.3081,
    "flow": 0.287
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
    "taro": 0.3278,
    "diana": 0.0793,
    "nova": 0.3111,
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
     "n": 31,
     "acc": 32.3,
     "adjustedAcc": 46.4,
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
   "graded": 323,
   "globalBlend": 0.712
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3234,
    "diana": 0.0744,
    "nova": 0.3072,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 543,
     "acc": 63.5,
     "adjustedAcc": 61.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 106,
     "acc": 36.8,
     "adjustedAcc": 43.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 467,
     "acc": 64.9,
     "adjustedAcc": 61.8,
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
   "graded": 1192,
   "globalBlend": 0.402
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3214,
    "diana": 0.0846,
    "nova": 0.3038,
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
    "taro": 0.3191,
    "diana": 0.0809,
    "nova": 0.304,
    "flow": 0.2961
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
     "acc": 31.0,
     "adjustedAcc": 43.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 235,
     "acc": 56.6,
     "adjustedAcc": 54.4,
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
   "graded": 629,
   "globalBlend": 0.56
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3229,
    "diana": 0.0883,
    "nova": 0.2942,
    "flow": 0.2946
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
    "taro": 0.3309,
    "diana": 0.0771,
    "nova": 0.3233,
    "flow": 0.2687
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
    "taro": 0.3088,
    "diana": 0.0789,
    "nova": 0.3168,
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
    "taro": 0.3258,
    "diana": 0.0909,
    "nova": 0.3149,
    "flow": 0.2684
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
     "n": 28,
     "acc": 100.0,
     "adjustedAcc": 59.5,
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
   "graded": 398,
   "globalBlend": 0.668
  },
  "식음료": {
   "weights": {
    "taro": 0.3081,
    "diana": 0.0958,
    "nova": 0.298,
    "flow": 0.2981
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 35.1,
     "adjustedAcc": 41.3,
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
     "n": 128,
     "acc": 40.6,
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
   "graded": 324,
   "globalBlend": 0.712
  },
  "여행레저": {
   "weights": {
    "taro": 0.3352,
    "diana": 0.0773,
    "nova": 0.3073,
    "flow": 0.2801
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
