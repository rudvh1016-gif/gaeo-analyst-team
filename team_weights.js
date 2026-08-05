// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-05 09:42",
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
   "taro": 0.3091,
   "diana": 0.0734,
   "nova": 0.3293,
   "flow": 0.2882
  },
  "acc": {
   "taro": {
    "n": 7873,
    "acc": 57.2,
    "adjustedAcc": 57.0,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1488,
    "acc": 38.8,
    "adjustedAcc": 39.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6655,
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
  "graded": 17389,
  "team": {
   "hit": 5870,
   "miss": 1629,
   "n": 7499,
   "acc": 78.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3178,
    "diana": 0.0751,
    "nova": 0.2723,
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
     "n": 138,
     "acc": 37.0,
     "adjustedAcc": 43.0,
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
    "taro": 0.3334,
    "diana": 0.0755,
    "nova": 0.3071,
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
    "taro": 0.2923,
    "diana": 0.0887,
    "nova": 0.3313,
    "flow": 0.2877
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
     "n": 74,
     "acc": 41.9,
     "adjustedAcc": 46.9,
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
   "graded": 904,
   "globalBlend": 0.469
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.317,
    "diana": 0.0761,
    "nova": 0.3477,
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
     "n": 71,
     "acc": 19.7,
     "adjustedAcc": 38.7,
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
    "diana": 0.0821,
    "nova": 0.3224,
    "flow": 0.292
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
    "taro": 0.2898,
    "diana": 0.1002,
    "nova": 0.3228,
    "flow": 0.2871
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
     "n": 63,
     "acc": 65.1,
     "adjustedAcc": 55.2,
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
   "graded": 752,
   "globalBlend": 0.515
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3172,
    "diana": 0.0753,
    "nova": 0.3448,
    "flow": 0.2627
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
     "acc": 19.6,
     "adjustedAcc": 35.7,
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
    "diana": 0.0802,
    "nova": 0.3382,
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
    "taro": 0.3052,
    "diana": 0.0879,
    "nova": 0.3199,
    "flow": 0.2869
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
    "taro": 0.3136,
    "diana": 0.0939,
    "nova": 0.3238,
    "flow": 0.2688
   },
   "acc": {
    "taro": {
     "n": 994,
     "acc": 61.8,
     "adjustedAcc": 60.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 188,
     "acc": 55.3,
     "adjustedAcc": 53.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 866,
     "acc": 65.4,
     "adjustedAcc": 63.5,
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
   "graded": 2173,
   "globalBlend": 0.269
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3068,
    "diana": 0.0853,
    "nova": 0.3461,
    "flow": 0.2618
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
     "n": 102,
     "acc": 38.2,
     "adjustedAcc": 44.6,
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
   "graded": 978,
   "globalBlend": 0.45
  },
  "조선": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.0757,
    "nova": 0.3257,
    "flow": 0.2931
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
     "acc": 8.5,
     "adjustedAcc": 36.3,
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
    "taro": 0.3052,
    "diana": 0.0811,
    "nova": 0.325,
    "flow": 0.2888
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
    "taro": 0.3097,
    "diana": 0.0822,
    "nova": 0.3248,
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
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 48.1,
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
   "graded": 345,
   "globalBlend": 0.699
  },
  "화학·소재": {
   "weights": {
    "taro": 0.305,
    "diana": 0.0757,
    "nova": 0.323,
    "flow": 0.2962
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
     "n": 128,
     "acc": 38.3,
     "adjustedAcc": 44.0,
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
   "graded": 1275,
   "globalBlend": 0.386
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.0873,
    "nova": 0.3152,
    "flow": 0.2935
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
    "taro": 0.3067,
    "diana": 0.0802,
    "nova": 0.3159,
    "flow": 0.2972
   },
   "acc": {
    "taro": {
     "n": 338,
     "acc": 53.8,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 70,
     "acc": 28.6,
     "adjustedAcc": 42.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 258,
     "acc": 57.0,
     "adjustedAcc": 54.8,
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
   "graded": 683,
   "globalBlend": 0.539
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3064,
    "diana": 0.0896,
    "nova": 0.3064,
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
    "taro": 0.3114,
    "diana": 0.0778,
    "nova": 0.3393,
    "flow": 0.2715
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
    "taro": 0.2926,
    "diana": 0.0788,
    "nova": 0.3304,
    "flow": 0.2982
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
     "n": 53,
     "acc": 9.4,
     "adjustedAcc": 37.6,
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
   "graded": 478,
   "globalBlend": 0.626
  },
  "로봇": {
   "weights": {
    "taro": 0.3076,
    "diana": 0.0909,
    "nova": 0.3338,
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
    "taro": 0.2934,
    "diana": 0.0984,
    "nova": 0.3087,
    "flow": 0.2995
   },
   "acc": {
    "taro": {
     "n": 180,
     "acc": 37.2,
     "adjustedAcc": 42.3,
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
     "n": 141,
     "acc": 41.1,
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
   "graded": 357,
   "globalBlend": 0.691
  },
  "여행레저": {
   "weights": {
    "taro": 0.3177,
    "diana": 0.0779,
    "nova": 0.3207,
    "flow": 0.2837
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
