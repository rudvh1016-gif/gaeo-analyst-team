// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 11:25",
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
   "taro": 0.278,
   "diana": 0.084,
   "nova": 0.3503,
   "flow": 0.2877
  },
  "acc": {
   "taro": {
    "n": 8671,
    "acc": 53.7,
    "adjustedAcc": 53.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2100,
    "acc": 44.0,
    "adjustedAcc": 44.3,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7594,
    "acc": 63.8,
    "adjustedAcc": 63.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1531,
    "acc": 55.1,
    "adjustedAcc": 54.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19896,
  "team": {
   "hit": 6123,
   "miss": 1909,
   "n": 8032,
   "acc": 76.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2889,
    "diana": 0.0767,
    "nova": 0.296,
    "flow": 0.3384
   },
   "acc": {
    "taro": {
     "n": 1055,
     "acc": 57.9,
     "adjustedAcc": 57.1,
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
     "n": 944,
     "acc": 58.7,
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
   "graded": 2521,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3007,
    "diana": 0.0826,
    "nova": 0.3306,
    "flow": 0.2861
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
    "taro": 0.264,
    "diana": 0.0951,
    "nova": 0.3593,
    "flow": 0.2815
   },
   "acc": {
    "taro": {
     "n": 433,
     "acc": 45.3,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 107,
     "acc": 43.9,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 407,
     "acc": 64.1,
     "adjustedAcc": 60.9,
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
   "graded": 1030,
   "globalBlend": 0.437
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2922,
    "diana": 0.0828,
    "nova": 0.3669,
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
    "taro": 0.2745,
    "diana": 0.0895,
    "nova": 0.3421,
    "flow": 0.2938
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
    "taro": 0.2679,
    "diana": 0.1168,
    "nova": 0.3318,
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
     "n": 95,
     "acc": 72.6,
     "adjustedAcc": 60.0,
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
   "graded": 874,
   "globalBlend": 0.478
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2885,
    "diana": 0.0819,
    "nova": 0.3698,
    "flow": 0.2598
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
     "acc": 27.3,
     "adjustedAcc": 37.8,
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
    "taro": 0.3053,
    "diana": 0.0864,
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
    "taro": 0.2793,
    "diana": 0.0989,
    "nova": 0.3354,
    "flow": 0.2864
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
    "taro": 0.2797,
    "diana": 0.0994,
    "nova": 0.3481,
    "flow": 0.2728
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
   "graded": 2487,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.0983,
    "nova": 0.3661,
    "flow": 0.2578
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
     "n": 148,
     "acc": 49.3,
     "adjustedAcc": 49.6,
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
   "graded": 1123,
   "globalBlend": 0.416
  },
  "조선": {
   "weights": {
    "taro": 0.2747,
    "diana": 0.0869,
    "nova": 0.3457,
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
    "taro": 0.2771,
    "diana": 0.0897,
    "nova": 0.3433,
    "flow": 0.2899
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
     "n": 20,
     "acc": 30.0,
     "adjustedAcc": 47.1,
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
   "graded": 254,
   "globalBlend": 0.759
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2868,
    "diana": 0.0952,
    "nova": 0.336,
    "flow": 0.282
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
    "taro": 0.2781,
    "diana": 0.0824,
    "nova": 0.3429,
    "flow": 0.2966
   },
   "acc": {
    "taro": {
     "n": 626,
     "acc": 56.4,
     "adjustedAcc": 55.4,
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
     "n": 571,
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
   "graded": 1462,
   "globalBlend": 0.354
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.0993,
    "nova": 0.3278,
    "flow": 0.2954
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
    "taro": 0.2886,
    "diana": 0.0878,
    "nova": 0.3302,
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
     "n": 105,
     "acc": 36.2,
     "adjustedAcc": 43.6,
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
   "graded": 804,
   "globalBlend": 0.499
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.0983,
    "nova": 0.3189,
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
    "taro": 0.2822,
    "diana": 0.085,
    "nova": 0.3598,
    "flow": 0.273
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
    "taro": 0.2677,
    "diana": 0.0827,
    "nova": 0.3489,
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
     "n": 78,
     "acc": 10.3,
     "adjustedAcc": 34.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 224,
     "acc": 57.1,
     "adjustedAcc": 54.7,
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
    "taro": 0.2816,
    "diana": 0.0944,
    "nova": 0.36,
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
     "n": 48,
     "acc": 60.4,
     "adjustedAcc": 53.0,
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
   "graded": 485,
   "globalBlend": 0.623
  },
  "식음료": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.1111,
    "nova": 0.3184,
    "flow": 0.2964
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
    "taro": 0.2932,
    "diana": 0.0853,
    "nova": 0.339,
    "flow": 0.2825
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
