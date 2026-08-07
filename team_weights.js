// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 11:55",
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
   "diana": 0.084,
   "nova": 0.3503,
   "flow": 0.2873
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
    "n": 2092,
    "acc": 43.9,
    "adjustedAcc": 44.3,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7592,
    "acc": 63.8,
    "adjustedAcc": 63.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1531,
    "acc": 55.1,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19884,
  "team": {
   "hit": 6125,
   "miss": 1907,
   "n": 8032,
   "acc": 76.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2893,
    "diana": 0.0767,
    "nova": 0.2958,
    "flow": 0.3383
   },
   "acc": {
    "taro": {
     "n": 1054,
     "acc": 58.0,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 197,
     "acc": 37.1,
     "adjustedAcc": 42.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 943,
     "acc": 58.6,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 325,
     "acc": 68.6,
     "adjustedAcc": 63.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2519,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3008,
    "diana": 0.0829,
    "nova": 0.3305,
    "flow": 0.2858
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
     "n": 91,
     "acc": 44.0,
     "adjustedAcc": 47.4,
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
   "graded": 1215,
   "globalBlend": 0.397
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2645,
    "diana": 0.0955,
    "nova": 0.3587,
    "flow": 0.2813
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
    "taro": 0.2932,
    "diana": 0.0828,
    "nova": 0.3659,
    "flow": 0.2582
   },
   "acc": {
    "taro": {
     "n": 337,
     "acc": 53.7,
     "adjustedAcc": 52.7,
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
     "acc": 67.1,
     "adjustedAcc": 62.2,
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
   "graded": 810,
   "globalBlend": 0.497
  },
  "통신": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.0895,
    "nova": 0.3422,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 50.3,
     "adjustedAcc": 50.2,
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
     "n": 136,
     "acc": 66.9,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 64.4,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 383,
   "globalBlend": 0.676
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2675,
    "diana": 0.1169,
    "nova": 0.3334,
    "flow": 0.2822
   },
   "acc": {
    "taro": {
     "n": 383,
     "acc": 47.5,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 95,
     "acc": 72.6,
     "adjustedAcc": 60.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 345,
     "acc": 60.0,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 46,
     "acc": 52.2,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 869,
   "globalBlend": 0.479
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2894,
    "diana": 0.0817,
    "nova": 0.3696,
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
    "diana": 0.0864,
    "nova": 0.3675,
    "flow": 0.2407
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
    "diana": 0.0989,
    "nova": 0.3354,
    "flow": 0.2862
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
    "taro": 0.2798,
    "diana": 0.0994,
    "nova": 0.3481,
    "flow": 0.2727
   },
   "acc": {
    "taro": {
     "n": 1104,
     "acc": 57.2,
     "adjustedAcc": 56.5,
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
     "n": 992,
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
   "graded": 2486,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.0986,
    "nova": 0.366,
    "flow": 0.2575
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 50.5,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 149,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 444,
     "acc": 66.4,
     "adjustedAcc": 62.9,
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
   "graded": 1124,
   "globalBlend": 0.416
  },
  "조선": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.0869,
    "nova": 0.3457,
    "flow": 0.2924
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
    "diana": 0.0897,
    "nova": 0.3429,
    "flow": 0.2896
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
    "diana": 0.0952,
    "nova": 0.336,
    "flow": 0.2817
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
    "taro": 0.2777,
    "diana": 0.0826,
    "nova": 0.3433,
    "flow": 0.2964
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
     "n": 179,
     "acc": 41.9,
     "adjustedAcc": 45.2,
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
   "graded": 1463,
   "globalBlend": 0.354
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.0993,
    "nova": 0.3278,
    "flow": 0.2952
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
    "diana": 0.0874,
    "nova": 0.3303,
    "flow": 0.2934
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
    "diana": 0.0975,
    "nova": 0.3191,
    "flow": 0.301
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
    "diana": 0.085,
    "nova": 0.3598,
    "flow": 0.2728
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
    "taro": 0.268,
    "diana": 0.0829,
    "nova": 0.3484,
    "flow": 0.3007
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
     "n": 77,
     "acc": 10.4,
     "adjustedAcc": 34.5,
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
   "graded": 560,
   "globalBlend": 0.588
  },
  "로봇": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.0941,
    "nova": 0.3601,
    "flow": 0.2639
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
    "diana": 0.1111,
    "nova": 0.3184,
    "flow": 0.2962
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
    "taro": 0.2934,
    "diana": 0.0853,
    "nova": 0.339,
    "flow": 0.2822
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 60.0,
     "adjustedAcc": 54.8,
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
     "n": 91,
     "acc": 58.2,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 36.8,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 266,
   "globalBlend": 0.75
  }
 }
};
