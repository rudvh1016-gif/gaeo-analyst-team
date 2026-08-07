// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 12:25",
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
   "taro": 0.2783,
   "diana": 0.0838,
   "nova": 0.3504,
   "flow": 0.2875
  },
  "acc": {
   "taro": {
    "n": 8669,
    "acc": 53.7,
    "adjustedAcc": 53.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2093,
    "acc": 43.8,
    "adjustedAcc": 44.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7590,
    "acc": 63.8,
    "adjustedAcc": 63.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1529,
    "acc": 55.1,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19881,
  "team": {
   "hit": 6123,
   "miss": 1907,
   "n": 8030,
   "acc": 76.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2901,
    "diana": 0.0764,
    "nova": 0.2955,
    "flow": 0.338
   },
   "acc": {
    "taro": {
     "n": 1054,
     "acc": 58.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 196,
     "acc": 36.7,
     "adjustedAcc": 41.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 943,
     "acc": 58.5,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 324,
     "acc": 68.5,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2517,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.0825,
    "nova": 0.3307,
    "flow": 0.286
   },
   "acc": {
    "taro": {
     "n": 520,
     "acc": 64.4,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 92,
     "acc": 43.5,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 453,
     "acc": 68.0,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 151,
     "acc": 64.9,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1216,
   "globalBlend": 0.397
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2645,
    "diana": 0.0954,
    "nova": 0.3588,
    "flow": 0.2814
   },
   "acc": {
    "taro": {
     "n": 434,
     "acc": 45.4,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 106,
     "acc": 44.3,
     "adjustedAcc": 47.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 406,
     "acc": 64.0,
     "adjustedAcc": 60.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 83,
     "acc": 48.2,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1029,
   "globalBlend": 0.437
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2923,
    "diana": 0.0827,
    "nova": 0.367,
    "flow": 0.258
   },
   "acc": {
    "taro": {
     "n": 338,
     "acc": 53.6,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 100,
     "acc": 26.0,
     "adjustedAcc": 39.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 295,
     "acc": 67.5,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 78,
     "acc": 32.1,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 811,
   "globalBlend": 0.497
  },
  "통신": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.0894,
    "nova": 0.3431,
    "flow": 0.2931
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 40.7,
     "adjustedAcc": 48.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 135,
     "acc": 67.4,
     "adjustedAcc": 59.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 58,
     "acc": 63.8,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 380,
   "globalBlend": 0.678
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2683,
    "diana": 0.1164,
    "nova": 0.3317,
    "flow": 0.2836
   },
   "acc": {
    "taro": {
     "n": 385,
     "acc": 47.8,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 94,
     "acc": 72.3,
     "adjustedAcc": 59.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 346,
     "acc": 59.5,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 53.2,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 872,
   "globalBlend": 0.478
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2894,
    "diana": 0.0816,
    "nova": 0.3697,
    "flow": 0.2592
   },
   "acc": {
    "taro": {
     "n": 505,
     "acc": 50.9,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 138,
     "acc": 26.8,
     "adjustedAcc": 37.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 399,
     "acc": 64.9,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 139,
     "acc": 38.1,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1181,
   "globalBlend": 0.404
  },
  "2차전지": {
   "weights": {
    "taro": 0.3054,
    "diana": 0.0863,
    "nova": 0.3675,
    "flow": 0.2408
   },
   "acc": {
    "taro": {
     "n": 469,
     "acc": 67.8,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 82,
     "acc": 52.4,
     "adjustedAcc": 51.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 407,
     "acc": 77.9,
     "adjustedAcc": 71.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 7,
     "acc": 14.3,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 965,
   "globalBlend": 0.453
  },
  "보험": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.0987,
    "nova": 0.3355,
    "flow": 0.2863
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 69.2,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 133,
     "acc": 58.6,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 373,
   "globalBlend": 0.682
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.0994,
    "nova": 0.3483,
    "flow": 0.273
   },
   "acc": {
    "taro": {
     "n": 1103,
     "acc": 57.0,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 257,
     "acc": 56.0,
     "adjustedAcc": 54.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 991,
     "acc": 67.8,
     "adjustedAcc": 65.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 133,
     "acc": 59.4,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2484,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.277,
    "diana": 0.0982,
    "nova": 0.3672,
    "flow": 0.2576
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 148,
     "acc": 49.3,
     "adjustedAcc": 49.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 444,
     "acc": 66.7,
     "adjustedAcc": 63.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 42,
     "acc": 31.0,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1123,
   "globalBlend": 0.416
  },
  "조선": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.0868,
    "nova": 0.3458,
    "flow": 0.2925
   },
   "acc": {
    "taro": {
     "n": 287,
     "acc": 46.7,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 28.6,
     "adjustedAcc": 41.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 269,
     "acc": 61.0,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 51,
     "acc": 52.9,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 684,
   "globalBlend": 0.539
  },
  "방산": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.0895,
    "nova": 0.343,
    "flow": 0.2898
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 46.1,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 20,
     "acc": 30.0,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 103,
     "acc": 61.2,
     "adjustedAcc": 55.2,
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
   "graded": 252,
   "globalBlend": 0.76
  },
  "철강·금속": {
   "weights": {
    "taro": 0.287,
    "diana": 0.0951,
    "nova": 0.3361,
    "flow": 0.2818
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 56.6,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 58.9,
     "adjustedAcc": 52.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 170,
     "acc": 61.2,
     "adjustedAcc": 56.6,
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
   "graded": 399,
   "globalBlend": 0.667
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.0823,
    "nova": 0.3434,
    "flow": 0.2966
   },
   "acc": {
    "taro": {
     "n": 627,
     "acc": 56.3,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 180,
     "acc": 41.7,
     "adjustedAcc": 45.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 572,
     "acc": 67.3,
     "adjustedAcc": 64.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 85,
     "acc": 69.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1464,
   "globalBlend": 0.353
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.0991,
    "nova": 0.3279,
    "flow": 0.2953
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 46.2,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 75.8,
     "adjustedAcc": 55.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 85,
     "acc": 49.4,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 78,
     "acc": 56.4,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 315,
   "globalBlend": 0.717
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2888,
    "diana": 0.0873,
    "nova": 0.3304,
    "flow": 0.2935
   },
   "acc": {
    "taro": {
     "n": 377,
     "acc": 53.3,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 104,
     "acc": 35.6,
     "adjustedAcc": 43.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 303,
     "acc": 58.4,
     "adjustedAcc": 56.0,
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
   "graded": 803,
   "globalBlend": 0.499
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2823,
    "diana": 0.0974,
    "nova": 0.3192,
    "flow": 0.3011
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 47.6,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 169,
     "acc": 46.2,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 10,
     "acc": 80.0,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 456,
   "globalBlend": 0.637
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2824,
    "diana": 0.0849,
    "nova": 0.3598,
    "flow": 0.2729
   },
   "acc": {
    "taro": {
     "n": 259,
     "acc": 52.1,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 26.6,
     "adjustedAcc": 41.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 217,
     "acc": 69.1,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 89,
     "acc": 43.8,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 629,
   "globalBlend": 0.56
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2679,
    "diana": 0.0829,
    "nova": 0.3484,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 37.9,
     "adjustedAcc": 41.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 11.4,
     "adjustedAcc": 34.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 225,
     "acc": 56.9,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 5,
     "acc": 40.0,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 562,
   "globalBlend": 0.587
  },
  "로봇": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.0939,
    "nova": 0.3602,
    "flow": 0.264
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 56.4,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 47,
     "acc": 59.6,
     "adjustedAcc": 52.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 185,
     "acc": 75.1,
     "adjustedAcc": 65.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 35.4,
     "adjustedAcc": 45.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 484,
   "globalBlend": 0.623
  },
  "식음료": {
   "weights": {
    "taro": 0.2743,
    "diana": 0.1109,
    "nova": 0.3185,
    "flow": 0.2963
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 41.6,
     "adjustedAcc": 44.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 76.8,
     "adjustedAcc": 58.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 169,
     "acc": 43.2,
     "adjustedAcc": 46.0,
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
   "graded": 429,
   "globalBlend": 0.651
  },
  "여행레저": {
   "weights": {
    "taro": 0.2937,
    "diana": 0.0851,
    "nova": 0.3384,
    "flow": 0.2828
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 60.6,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 0.0,
     "adjustedAcc": 40.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 90,
     "acc": 57.8,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 37.8,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 263,
   "globalBlend": 0.753
  }
 }
};
