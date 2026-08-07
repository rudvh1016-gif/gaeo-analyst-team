// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 09:55",
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
   "taro": 0.2776,
   "diana": 0.0848,
   "nova": 0.351,
   "flow": 0.2866
  },
  "acc": {
   "taro": {
    "n": 8668,
    "acc": 53.6,
    "adjustedAcc": 53.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2110,
    "acc": 44.3,
    "adjustedAcc": 44.6,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7594,
    "acc": 63.9,
    "adjustedAcc": 63.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1528,
    "acc": 55.0,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19900,
  "team": {
   "hit": 6109,
   "miss": 1910,
   "n": 8019,
   "acc": 76.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2858,
    "diana": 0.0773,
    "nova": 0.2984,
    "flow": 0.3386
   },
   "acc": {
    "taro": {
     "n": 1052,
     "acc": 57.4,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 200,
     "acc": 37.5,
     "adjustedAcc": 42.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 941,
     "acc": 59.1,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 323,
     "acc": 68.7,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2516,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.0829,
    "nova": 0.3309,
    "flow": 0.2856
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
    "taro": 0.2641,
    "diana": 0.0961,
    "nova": 0.3593,
    "flow": 0.2805
   },
   "acc": {
    "taro": {
     "n": 435,
     "acc": 45.5,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 109,
     "acc": 45.0,
     "adjustedAcc": 47.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 408,
     "acc": 64.2,
     "adjustedAcc": 61.0,
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
   "graded": 1035,
   "globalBlend": 0.436
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2919,
    "diana": 0.0836,
    "nova": 0.3669,
    "flow": 0.2576
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
     "n": 98,
     "acc": 26.5,
     "adjustedAcc": 39.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 297,
     "acc": 67.3,
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
    "taro": 0.2743,
    "diana": 0.0901,
    "nova": 0.3426,
    "flow": 0.2931
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
    "taro": 0.2689,
    "diana": 0.1163,
    "nova": 0.3315,
    "flow": 0.2833
   },
   "acc": {
    "taro": {
     "n": 385,
     "acc": 48.1,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 95,
     "acc": 71.6,
     "adjustedAcc": 59.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 347,
     "acc": 59.4,
     "adjustedAcc": 57.0,
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
   "graded": 874,
   "globalBlend": 0.478
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2895,
    "diana": 0.0834,
    "nova": 0.369,
    "flow": 0.2582
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
     "n": 140,
     "acc": 28.6,
     "adjustedAcc": 38.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 399,
     "acc": 64.7,
     "adjustedAcc": 61.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 138,
     "acc": 37.7,
     "adjustedAcc": 43.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1182,
   "globalBlend": 0.404
  },
  "2차전지": {
   "weights": {
    "taro": 0.3041,
    "diana": 0.0867,
    "nova": 0.3689,
    "flow": 0.2403
   },
   "acc": {
    "taro": {
     "n": 469,
     "acc": 67.6,
     "adjustedAcc": 64.0,
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
     "acc": 78.1,
     "adjustedAcc": 71.7,
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
    "taro": 0.2796,
    "diana": 0.0995,
    "nova": 0.3352,
    "flow": 0.2857
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
     "n": 134,
     "acc": 58.2,
     "adjustedAcc": 54.3,
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
   "graded": 375,
   "globalBlend": 0.681
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.0995,
    "nova": 0.3485,
    "flow": 0.2724
   },
   "acc": {
    "taro": {
     "n": 1105,
     "acc": 57.2,
     "adjustedAcc": 56.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 259,
     "acc": 56.0,
     "adjustedAcc": 54.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 993,
     "acc": 67.9,
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
   "graded": 2490,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.0995,
    "nova": 0.3663,
    "flow": 0.2569
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
     "n": 151,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 445,
     "acc": 66.5,
     "adjustedAcc": 63.0,
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
   "graded": 1127,
   "globalBlend": 0.415
  },
  "조선": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.0874,
    "nova": 0.3461,
    "flow": 0.292
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
    "taro": 0.2772,
    "diana": 0.0903,
    "nova": 0.3435,
    "flow": 0.2891
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
    "taro": 0.2865,
    "diana": 0.0958,
    "nova": 0.3365,
    "flow": 0.2812
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
    "taro": 0.2775,
    "diana": 0.0829,
    "nova": 0.3439,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 624,
     "acc": 56.4,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 181,
     "acc": 42.0,
     "adjustedAcc": 45.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 569,
     "acc": 67.5,
     "adjustedAcc": 64.4,
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
   "graded": 1459,
   "globalBlend": 0.354
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2769,
    "diana": 0.1,
    "nova": 0.3289,
    "flow": 0.2942
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 45.8,
     "adjustedAcc": 47.9,
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
     "n": 86,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 79,
     "acc": 55.7,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 318,
   "globalBlend": 0.716
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.288,
    "diana": 0.0886,
    "nova": 0.3301,
    "flow": 0.2934
   },
   "acc": {
    "taro": {
     "n": 375,
     "acc": 53.1,
     "adjustedAcc": 52.3,
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
     "n": 301,
     "acc": 58.1,
     "adjustedAcc": 55.8,
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
   "graded": 801,
   "globalBlend": 0.5
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2816,
    "diana": 0.0988,
    "nova": 0.3193,
    "flow": 0.3003
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
     "n": 50,
     "acc": 52.0,
     "adjustedAcc": 50.6,
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
   "graded": 458,
   "globalBlend": 0.636
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2817,
    "diana": 0.0859,
    "nova": 0.3603,
    "flow": 0.2722
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
     "n": 62,
     "acc": 27.4,
     "adjustedAcc": 42.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 218,
     "acc": 69.3,
     "adjustedAcc": 62.4,
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
   "graded": 628,
   "globalBlend": 0.56
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.267,
    "diana": 0.0841,
    "nova": 0.3509,
    "flow": 0.2979
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 37.4,
     "adjustedAcc": 41.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 11.7,
     "adjustedAcc": 35.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 225,
     "acc": 57.3,
     "adjustedAcc": 54.8,
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
   "graded": 561,
   "globalBlend": 0.588
  },
  "로봇": {
   "weights": {
    "taro": 0.2818,
    "diana": 0.0936,
    "nova": 0.361,
    "flow": 0.2636
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
     "n": 50,
     "acc": 56.0,
     "adjustedAcc": 51.8,
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
   "graded": 487,
   "globalBlend": 0.622
  },
  "식음료": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.1116,
    "nova": 0.3189,
    "flow": 0.2957
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
    "taro": 0.2927,
    "diana": 0.0859,
    "nova": 0.3397,
    "flow": 0.2817
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 60.2,
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
     "n": 89,
     "acc": 58.4,
     "adjustedAcc": 53.6,
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
   "graded": 260,
   "globalBlend": 0.755
  }
 }
};
