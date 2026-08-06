// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-06 11:09",
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
   "taro": 0.2898,
   "diana": 0.0762,
   "nova": 0.3475,
   "flow": 0.2865
  },
  "acc": {
   "taro": {
    "n": 8295,
    "acc": 54.8,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1800,
    "acc": 40.1,
    "adjustedAcc": 40.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7132,
    "acc": 63.3,
    "adjustedAcc": 63.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1453,
    "acc": 54.7,
    "adjustedAcc": 54.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 18680,
  "team": {
   "hit": 5983,
   "miss": 1789,
   "n": 7772,
   "acc": 77.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.296,
    "diana": 0.0748,
    "nova": 0.2912,
    "flow": 0.338
   },
   "acc": {
    "taro": {
     "n": 1008,
     "acc": 58.8,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 172,
     "acc": 36.6,
     "adjustedAcc": 42.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 896,
     "acc": 58.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 313,
     "acc": 69.0,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2389,
   "globalBlend": 0.251
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3132,
    "diana": 0.0783,
    "nova": 0.3241,
    "flow": 0.2844
   },
   "acc": {
    "taro": {
     "n": 496,
     "acc": 66.7,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 41.8,
     "adjustedAcc": 46.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 428,
     "acc": 67.3,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 142,
     "acc": 65.5,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1145,
   "globalBlend": 0.411
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2754,
    "diana": 0.0903,
    "nova": 0.3505,
    "flow": 0.2839
   },
   "acc": {
    "taro": {
     "n": 416,
     "acc": 47.1,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 88,
     "acc": 42.0,
     "adjustedAcc": 46.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 385,
     "acc": 62.9,
     "adjustedAcc": 59.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 78,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 967,
   "globalBlend": 0.453
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3019,
    "diana": 0.0775,
    "nova": 0.3622,
    "flow": 0.2584
   },
   "acc": {
    "taro": {
     "n": 323,
     "acc": 55.1,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 82,
     "acc": 20.7,
     "adjustedAcc": 38.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 276,
     "acc": 67.4,
     "adjustedAcc": 62.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 75,
     "acc": 32.0,
     "adjustedAcc": 43.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 756,
   "globalBlend": 0.514
  },
  "통신": {
   "weights": {
    "taro": 0.2868,
    "diana": 0.084,
    "nova": 0.3377,
    "flow": 0.2915
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 52.6,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 23,
     "acc": 39.1,
     "adjustedAcc": 48.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 126,
     "acc": 65.1,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 52,
     "acc": 63.5,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 353,
   "globalBlend": 0.694
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2756,
    "diana": 0.1073,
    "nova": 0.3343,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 369,
     "acc": 48.0,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 76,
     "acc": 69.7,
     "adjustedAcc": 57.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 326,
     "acc": 60.4,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 44,
     "acc": 52.3,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 815,
   "globalBlend": 0.495
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2999,
    "diana": 0.0754,
    "nova": 0.3649,
    "flow": 0.2598
   },
   "acc": {
    "taro": {
     "n": 485,
     "acc": 51.5,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 20.0,
     "adjustedAcc": 34.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 375,
     "acc": 63.7,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 135,
     "acc": 37.0,
     "adjustedAcc": 43.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1120,
   "globalBlend": 0.417
  },
  "2차전지": {
   "weights": {
    "taro": 0.3175,
    "diana": 0.0821,
    "nova": 0.3586,
    "flow": 0.2418
   },
   "acc": {
    "taro": {
     "n": 449,
     "acc": 70.6,
     "adjustedAcc": 66.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 73,
     "acc": 53.4,
     "adjustedAcc": 51.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 384,
     "acc": 77.6,
     "adjustedAcc": 71.0,
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
   "graded": 911,
   "globalBlend": 0.468
  },
  "보험": {
   "weights": {
    "taro": 0.2885,
    "diana": 0.0907,
    "nova": 0.3355,
    "flow": 0.2853
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 63.3,
     "adjustedAcc": 52.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 126,
     "acc": 59.5,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 35,
     "acc": 48.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 353,
   "globalBlend": 0.694
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2945,
    "diana": 0.0955,
    "nova": 0.3393,
    "flow": 0.2706
   },
   "acc": {
    "taro": {
     "n": 1050,
     "acc": 59.2,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 225,
     "acc": 55.1,
     "adjustedAcc": 53.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 927,
     "acc": 66.8,
     "adjustedAcc": 64.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 129,
     "acc": 58.9,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2331,
   "globalBlend": 0.256
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2878,
    "diana": 0.0905,
    "nova": 0.3623,
    "flow": 0.2595
   },
   "acc": {
    "taro": {
     "n": 470,
     "acc": 51.3,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 44.0,
     "adjustedAcc": 46.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 417,
     "acc": 65.7,
     "adjustedAcc": 62.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 30.0,
     "adjustedAcc": 45.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1052,
   "globalBlend": 0.432
  },
  "조선": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.0796,
    "nova": 0.3402,
    "flow": 0.2926
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 48.4,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 69,
     "acc": 18.8,
     "adjustedAcc": 38.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 252,
     "acc": 59.1,
     "adjustedAcc": 56.2,
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
   "graded": 642,
   "globalBlend": 0.555
  },
  "방산": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.0833,
    "nova": 0.3413,
    "flow": 0.2879
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 48.0,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 17,
     "acc": 29.4,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 97,
     "acc": 62.9,
     "adjustedAcc": 55.8,
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
   "graded": 238,
   "globalBlend": 0.771
  },
  "철강·금속": {
   "weights": {
    "taro": 0.294,
    "diana": 0.0858,
    "nova": 0.3385,
    "flow": 0.2817
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 56.3,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 47.8,
     "adjustedAcc": 49.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 159,
     "acc": 63.5,
     "adjustedAcc": 57.7,
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
   "graded": 372,
   "globalBlend": 0.683
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2882,
    "diana": 0.0772,
    "nova": 0.3378,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 600,
     "acc": 58.0,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 157,
     "acc": 38.9,
     "adjustedAcc": 43.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 535,
     "acc": 66.9,
     "adjustedAcc": 63.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 82,
     "acc": 70.7,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1374,
   "globalBlend": 0.368
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2868,
    "diana": 0.0914,
    "nova": 0.3286,
    "flow": 0.2932
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 45.6,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 69.0,
     "adjustedAcc": 53.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 78,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 74,
     "acc": 54.1,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 295,
   "globalBlend": 0.731
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2941,
    "diana": 0.0805,
    "nova": 0.3299,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 357,
     "acc": 52.9,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 90,
     "acc": 28.9,
     "adjustedAcc": 41.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 281,
     "acc": 58.4,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 18,
     "acc": 72.2,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 746,
   "globalBlend": 0.517
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2917,
    "diana": 0.092,
    "nova": 0.3177,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 47.5,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 42,
     "acc": 47.6,
     "adjustedAcc": 49.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 157,
     "acc": 43.9,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 7,
     "acc": 71.4,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 423,
   "globalBlend": 0.654
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2947,
    "diana": 0.0801,
    "nova": 0.3544,
    "flow": 0.2709
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 53.9,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 55,
     "acc": 21.8,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 202,
     "acc": 67.8,
     "adjustedAcc": 61.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 83,
     "acc": 41.0,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 585,
   "globalBlend": 0.578
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.0778,
    "nova": 0.3483,
    "flow": 0.2976
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 38.4,
     "adjustedAcc": 42.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 67,
     "acc": 6.0,
     "adjustedAcc": 34.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 209,
     "acc": 57.9,
     "adjustedAcc": 55.0,
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
   "graded": 522,
   "globalBlend": 0.605
  },
  "로봇": {
   "weights": {
    "taro": 0.2917,
    "diana": 0.0899,
    "nova": 0.3531,
    "flow": 0.2653
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 58.4,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 65.1,
     "adjustedAcc": 54.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 175,
     "acc": 74.3,
     "adjustedAcc": 64.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 45,
     "acc": 37.8,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 460,
   "globalBlend": 0.635
  },
  "식음료": {
   "weights": {
    "taro": 0.278,
    "diana": 0.1024,
    "nova": 0.3217,
    "flow": 0.2978
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 36.6,
     "adjustedAcc": 41.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 72.7,
     "adjustedAcc": 56.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 156,
     "acc": 42.9,
     "adjustedAcc": 46.0,
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
   "graded": 392,
   "globalBlend": 0.671
  },
  "여행레저": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.0799,
    "nova": 0.3373,
    "flow": 0.2801
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
     "n": 25,
     "acc": 0.0,
     "adjustedAcc": 41.4,
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
     "n": 39,
     "acc": 33.3,
     "adjustedAcc": 45.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 262,
   "globalBlend": 0.753
  }
 }
};
