// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 15:38",
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
   "taro": 0.277,
   "diana": 0.0851,
   "nova": 0.3505,
   "flow": 0.2874
  },
  "acc": {
   "taro": {
    "n": 8673,
    "acc": 53.6,
    "adjustedAcc": 53.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2106,
    "acc": 44.4,
    "adjustedAcc": 44.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7599,
    "acc": 63.9,
    "adjustedAcc": 63.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1529,
    "acc": 55.1,
    "adjustedAcc": 54.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19907,
  "team": {
   "hit": 6093,
   "miss": 1912,
   "n": 8005,
   "acc": 76.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2862,
    "diana": 0.0774,
    "nova": 0.2977,
    "flow": 0.3388
   },
   "acc": {
    "taro": {
     "n": 1052,
     "acc": 57.5,
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
     "acc": 59.0,
     "adjustedAcc": 58.0,
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
    "taro": 0.3003,
    "diana": 0.0833,
    "nova": 0.3306,
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
    "taro": 0.2636,
    "diana": 0.0965,
    "nova": 0.3592,
    "flow": 0.2806
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
     "n": 108,
     "acc": 45.4,
     "adjustedAcc": 47.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 409,
     "acc": 64.3,
     "adjustedAcc": 61.1,
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
    "taro": 0.2918,
    "diana": 0.0838,
    "nova": 0.3663,
    "flow": 0.2581
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
     "n": 296,
     "acc": 67.2,
     "adjustedAcc": 62.3,
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
    "taro": 0.2739,
    "diana": 0.0903,
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
    "taro": 0.2676,
    "diana": 0.117,
    "nova": 0.3321,
    "flow": 0.2834
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
     "n": 347,
     "acc": 59.7,
     "adjustedAcc": 57.2,
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
   "graded": 873,
   "globalBlend": 0.478
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2879,
    "diana": 0.0829,
    "nova": 0.3697,
    "flow": 0.2595
   },
   "acc": {
    "taro": {
     "n": 504,
     "acc": 50.8,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 28.1,
     "adjustedAcc": 38.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 398,
     "acc": 65.1,
     "adjustedAcc": 61.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 138,
     "acc": 38.4,
     "adjustedAcc": 43.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1179,
   "globalBlend": 0.404
  },
  "2차전지": {
   "weights": {
    "taro": 0.304,
    "diana": 0.0865,
    "nova": 0.3688,
    "flow": 0.2407
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
     "n": 83,
     "acc": 51.8,
     "adjustedAcc": 50.7,
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
   "graded": 966,
   "globalBlend": 0.453
  },
  "보험": {
   "weights": {
    "taro": 0.2792,
    "diana": 0.0997,
    "nova": 0.3349,
    "flow": 0.2863
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
    "taro": 0.279,
    "diana": 0.0999,
    "nova": 0.3485,
    "flow": 0.2727
   },
   "acc": {
    "taro": {
     "n": 1104,
     "acc": 57.1,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 258,
     "acc": 56.2,
     "adjustedAcc": 54.2,
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
   "graded": 2488,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.099,
    "nova": 0.3674,
    "flow": 0.2574
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
     "n": 149,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 445,
     "acc": 66.7,
     "adjustedAcc": 63.2,
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
   "graded": 1125,
   "globalBlend": 0.416
  },
  "조선": {
   "weights": {
    "taro": 0.2743,
    "diana": 0.0876,
    "nova": 0.3455,
    "flow": 0.2926
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
     "n": 268,
     "acc": 60.8,
     "adjustedAcc": 57.5,
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
   "graded": 683,
   "globalBlend": 0.539
  },
  "방산": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.0907,
    "nova": 0.3434,
    "flow": 0.2896
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 45.7,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 19,
     "acc": 31.6,
     "adjustedAcc": 47.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 104,
     "acc": 61.5,
     "adjustedAcc": 55.4,
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
   "graded": 253,
   "globalBlend": 0.76
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2861,
    "diana": 0.096,
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
    "taro": 0.2774,
    "diana": 0.0842,
    "nova": 0.3427,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 625,
     "acc": 56.5,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 182,
     "acc": 43.4,
     "adjustedAcc": 46.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 570,
     "acc": 67.4,
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
   "graded": 1462,
   "globalBlend": 0.354
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2764,
    "diana": 0.1003,
    "nova": 0.3285,
    "flow": 0.2948
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
    "taro": 0.2871,
    "diana": 0.0883,
    "nova": 0.3314,
    "flow": 0.2932
   },
   "acc": {
    "taro": {
     "n": 377,
     "acc": 53.1,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 105,
     "acc": 36.2,
     "adjustedAcc": 43.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 303,
     "acc": 58.7,
     "adjustedAcc": 56.3,
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
   "graded": 804,
   "globalBlend": 0.499
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.099,
    "nova": 0.319,
    "flow": 0.3008
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
    "taro": 0.2816,
    "diana": 0.0858,
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
     "n": 63,
     "acc": 27.0,
     "adjustedAcc": 42.1,
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
   "graded": 628,
   "globalBlend": 0.56
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2678,
    "diana": 0.0843,
    "nova": 0.3481,
    "flow": 0.2999
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
     "acc": 11.7,
     "adjustedAcc": 35.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 225,
     "acc": 56.4,
     "adjustedAcc": 54.2,
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
   "graded": 559,
   "globalBlend": 0.589
  },
  "로봇": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.0941,
    "nova": 0.3606,
    "flow": 0.2641
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
     "n": 49,
     "acc": 57.1,
     "adjustedAcc": 52.1,
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
   "graded": 486,
   "globalBlend": 0.622
  },
  "식음료": {
   "weights": {
    "taro": 0.2734,
    "diana": 0.1132,
    "nova": 0.3172,
    "flow": 0.2962
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 41.7,
     "adjustedAcc": 44.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 59,
     "acc": 78.0,
     "adjustedAcc": 59.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 171,
     "acc": 42.7,
     "adjustedAcc": 45.7,
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
  "여행레저": {
   "weights": {
    "taro": 0.292,
    "diana": 0.086,
    "nova": 0.3387,
    "flow": 0.2833
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
     "acc": 39.5,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 266,
   "globalBlend": 0.75
  }
 }
};
