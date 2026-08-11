// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-11 13:44",
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
   "taro": 0.276,
   "diana": 0.0972,
   "nova": 0.3115,
   "flow": 0.3154
  },
  "acc": {
   "taro": {
    "n": 9371,
    "acc": 52.5,
    "adjustedAcc": 52.4,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2729,
    "acc": 48.1,
    "adjustedAcc": 48.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8489,
    "acc": 58.9,
    "adjustedAcc": 58.8,
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
  "graded": 22269,
  "team": {
   "hit": 6312,
   "miss": 2383,
   "n": 8695,
   "acc": 72.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.0815,
    "nova": 0.2754,
    "flow": 0.3641
   },
   "acc": {
    "taro": {
     "n": 1138,
     "acc": 54.4,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 257,
     "acc": 37.0,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1040,
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
   "graded": 2784,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.0924,
    "nova": 0.301,
    "flow": 0.3111
   },
   "acc": {
    "taro": {
     "n": 559,
     "acc": 60.8,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 46.7,
     "adjustedAcc": 48.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 500,
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
   "graded": 1342,
   "globalBlend": 0.373
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2605,
    "diana": 0.1092,
    "nova": 0.3295,
    "flow": 0.3008
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
     "n": 143,
     "acc": 51.0,
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
   "graded": 1164,
   "globalBlend": 0.407
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2942,
    "diana": 0.093,
    "nova": 0.335,
    "flow": 0.2779
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 52.1,
     "adjustedAcc": 51.5,
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
     "n": 332,
     "acc": 61.4,
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
   "graded": 905,
   "globalBlend": 0.469
  },
  "통신": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.0985,
    "nova": 0.3101,
    "flow": 0.3177
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
    "taro": 0.2747,
    "diana": 0.1324,
    "nova": 0.2939,
    "flow": 0.2989
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
    "taro": 0.2888,
    "diana": 0.0876,
    "nova": 0.3373,
    "flow": 0.2864
   },
   "acc": {
    "taro": {
     "n": 538,
     "acc": 49.3,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 175,
     "acc": 28.0,
     "adjustedAcc": 36.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 447,
     "acc": 59.5,
     "adjustedAcc": 57.5,
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
   "graded": 1309,
   "globalBlend": 0.379
  },
  "2차전지": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.0961,
    "nova": 0.3354,
    "flow": 0.2631
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
     "n": 104,
     "acc": 51.9,
     "adjustedAcc": 50.9,
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
   "graded": 1069,
   "globalBlend": 0.428
  },
  "보험": {
   "weights": {
    "taro": 0.276,
    "diana": 0.1122,
    "nova": 0.3048,
    "flow": 0.3071
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 48.0,
     "adjustedAcc": 48.8,
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
     "n": 146,
     "acc": 55.5,
     "adjustedAcc": 53.0,
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
   "graded": 417,
   "globalBlend": 0.657
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2838,
    "diana": 0.107,
    "nova": 0.3091,
    "flow": 0.3002
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
     "n": 333,
     "acc": 56.8,
     "adjustedAcc": 55.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1116,
     "acc": 62.2,
     "adjustedAcc": 61.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 149,
     "acc": 63.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2790,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1133,
    "nova": 0.3364,
    "flow": 0.2766
   },
   "acc": {
    "taro": {
     "n": 529,
     "acc": 48.8,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 196,
     "acc": 55.1,
     "adjustedAcc": 53.2,
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
   "graded": 1266,
   "globalBlend": 0.387
  },
  "조선": {
   "weights": {
    "taro": 0.2712,
    "diana": 0.1011,
    "nova": 0.3147,
    "flow": 0.313
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
     "n": 98,
     "acc": 40.8,
     "adjustedAcc": 45.9,
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
   "graded": 765,
   "globalBlend": 0.511
  },
  "방산": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1006,
    "nova": 0.3115,
    "flow": 0.3132
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 44.6,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 25,
     "acc": 36.0,
     "adjustedAcc": 47.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 117,
     "acc": 58.1,
     "adjustedAcc": 54.0,
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
   "graded": 284,
   "globalBlend": 0.738
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2898,
    "diana": 0.111,
    "nova": 0.2992,
    "flow": 0.3
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
    "diana": 0.0959,
    "nova": 0.3133,
    "flow": 0.3139
   },
   "acc": {
    "taro": {
     "n": 676,
     "acc": 54.3,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 236,
     "acc": 47.9,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 632,
     "acc": 62.0,
     "adjustedAcc": 60.1,
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
   "graded": 1632,
   "globalBlend": 0.329
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2768,
    "diana": 0.1131,
    "nova": 0.2913,
    "flow": 0.3189
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 47.7,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 81.4,
     "adjustedAcc": 58.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 101,
     "acc": 43.6,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 87,
     "acc": 59.8,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 363,
   "globalBlend": 0.688
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2894,
    "diana": 0.0978,
    "nova": 0.3047,
    "flow": 0.3082
   },
   "acc": {
    "taro": {
     "n": 410,
     "acc": 53.2,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 136,
     "acc": 41.9,
     "adjustedAcc": 45.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 339,
     "acc": 56.0,
     "adjustedAcc": 54.5,
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
   "graded": 904,
   "globalBlend": 0.469
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.1077,
    "nova": 0.2868,
    "flow": 0.325
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
     "n": 62,
     "acc": 54.8,
     "adjustedAcc": 51.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 191,
     "acc": 44.5,
     "adjustedAcc": 46.6,
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
    "taro": 0.2833,
    "diana": 0.0968,
    "nova": 0.3263,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 52.0,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 37.5,
     "adjustedAcc": 45.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 242,
     "acc": 63.6,
     "adjustedAcc": 59.1,
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
   "graded": 699,
   "globalBlend": 0.534
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.0932,
    "nova": 0.3189,
    "flow": 0.3183
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 38.9,
     "adjustedAcc": 42.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 96,
     "acc": 19.8,
     "adjustedAcc": 36.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 254,
     "acc": 53.1,
     "adjustedAcc": 52.1,
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
   "graded": 629,
   "globalBlend": 0.56
  },
  "기계": {
   "weights": {
    "taro": 0.2681,
    "diana": 0.1037,
    "nova": 0.3099,
    "flow": 0.3184
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
    "taro": 0.2882,
    "diana": 0.0986,
    "nova": 0.3271,
    "flow": 0.2861
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 57.2,
     "adjustedAcc": 54.6,
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
     "n": 204,
     "acc": 68.1,
     "adjustedAcc": 61.4,
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
   "graded": 533,
   "globalBlend": 0.6
  },
  "식음료": {
   "weights": {
    "taro": 0.2784,
    "diana": 0.1286,
    "nova": 0.2829,
    "flow": 0.3102
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 46.6,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 82.3,
     "adjustedAcc": 62.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 200,
     "acc": 41.0,
     "adjustedAcc": 44.4,
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
   "graded": 513,
   "globalBlend": 0.609
  },
  "여행레저": {
   "weights": {
    "taro": 0.292,
    "diana": 0.0942,
    "nova": 0.3088,
    "flow": 0.3049
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 58.0,
     "adjustedAcc": 54.0,
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
     "n": 102,
     "acc": 55.9,
     "adjustedAcc": 52.7,
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
   "graded": 294,
   "globalBlend": 0.731
  }
 }
};
