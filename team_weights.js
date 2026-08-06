// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-06 15:36",
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
   "taro": 0.2884,
   "diana": 0.0781,
   "nova": 0.347,
   "flow": 0.2865
  },
  "acc": {
   "taro": {
    "n": 8294,
    "acc": 54.8,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1798,
    "acc": 41.2,
    "adjustedAcc": 41.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7134,
    "acc": 63.4,
    "adjustedAcc": 63.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1451,
    "acc": 54.9,
    "adjustedAcc": 54.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 18677,
  "team": {
   "hit": 5954,
   "miss": 1788,
   "n": 7742,
   "acc": 76.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.0757,
    "nova": 0.291,
    "flow": 0.3378
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
     "n": 170,
     "acc": 37.1,
     "adjustedAcc": 42.4,
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
   "graded": 2387,
   "globalBlend": 0.251
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3123,
    "diana": 0.0797,
    "nova": 0.3237,
    "flow": 0.2842
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
     "n": 77,
     "acc": 42.9,
     "adjustedAcc": 47.2,
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
   "graded": 1143,
   "globalBlend": 0.412
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.0922,
    "nova": 0.3494,
    "flow": 0.2836
   },
   "acc": {
    "taro": {
     "n": 415,
     "acc": 47.2,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 89,
     "acc": 43.8,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 384,
     "acc": 62.8,
     "adjustedAcc": 59.7,
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
   "graded": 966,
   "globalBlend": 0.453
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3004,
    "diana": 0.0787,
    "nova": 0.3628,
    "flow": 0.2581
   },
   "acc": {
    "taro": {
     "n": 324,
     "acc": 54.9,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 83,
     "acc": 21.7,
     "adjustedAcc": 38.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 278,
     "acc": 67.6,
     "adjustedAcc": 62.3,
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
   "graded": 760,
   "globalBlend": 0.513
  },
  "통신": {
   "weights": {
    "taro": 0.2855,
    "diana": 0.0858,
    "nova": 0.3379,
    "flow": 0.2908
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 52.3,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 41.7,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 127,
     "acc": 65.4,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 62.3,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 357,
   "globalBlend": 0.691
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2747,
    "diana": 0.1089,
    "nova": 0.3329,
    "flow": 0.2835
   },
   "acc": {
    "taro": {
     "n": 368,
     "acc": 48.1,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 78,
     "acc": 70.5,
     "adjustedAcc": 58.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 325,
     "acc": 60.3,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 43,
     "acc": 53.5,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 814,
   "globalBlend": 0.496
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2979,
    "diana": 0.0779,
    "nova": 0.3646,
    "flow": 0.2596
   },
   "acc": {
    "taro": {
     "n": 483,
     "acc": 51.6,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 123,
     "acc": 22.8,
     "adjustedAcc": 36.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 373,
     "acc": 64.1,
     "adjustedAcc": 60.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 134,
     "acc": 37.3,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1113,
   "globalBlend": 0.418
  },
  "2차전지": {
   "weights": {
    "taro": 0.3169,
    "diana": 0.083,
    "nova": 0.3583,
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
     "n": 71,
     "acc": 53.5,
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
   "graded": 909,
   "globalBlend": 0.468
  },
  "보험": {
   "weights": {
    "taro": 0.2875,
    "diana": 0.0924,
    "nova": 0.3347,
    "flow": 0.2854
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
     "n": 31,
     "acc": 64.5,
     "adjustedAcc": 53.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 125,
     "acc": 59.2,
     "adjustedAcc": 54.7,
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
    "taro": 0.2929,
    "diana": 0.0951,
    "nova": 0.3412,
    "flow": 0.2709
   },
   "acc": {
    "taro": {
     "n": 1053,
     "acc": 59.0,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 222,
     "acc": 54.5,
     "adjustedAcc": 52.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 931,
     "acc": 67.0,
     "adjustedAcc": 65.1,
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
   "graded": 2335,
   "globalBlend": 0.255
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2867,
    "diana": 0.0923,
    "nova": 0.362,
    "flow": 0.2591
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
     "n": 128,
     "acc": 45.3,
     "adjustedAcc": 47.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 418,
     "acc": 65.8,
     "adjustedAcc": 62.3,
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
   "graded": 1056,
   "globalBlend": 0.431
  },
  "조선": {
   "weights": {
    "taro": 0.2868,
    "diana": 0.0813,
    "nova": 0.3393,
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
     "acc": 20.3,
     "adjustedAcc": 39.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 58.9,
     "adjustedAcc": 56.0,
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
   "graded": 643,
   "globalBlend": 0.554
  },
  "방산": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.0847,
    "nova": 0.3409,
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
    "taro": 0.2927,
    "diana": 0.088,
    "nova": 0.3378,
    "flow": 0.2814
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
     "n": 47,
     "acc": 51.1,
     "adjustedAcc": 50.3,
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
   "graded": 373,
   "globalBlend": 0.682
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2871,
    "diana": 0.0784,
    "nova": 0.3379,
    "flow": 0.2966
   },
   "acc": {
    "taro": {
     "n": 601,
     "acc": 57.9,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 155,
     "acc": 39.4,
     "adjustedAcc": 44.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 536,
     "acc": 67.0,
     "adjustedAcc": 63.9,
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
    "taro": 0.2857,
    "diana": 0.0931,
    "nova": 0.3282,
    "flow": 0.293
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
     "n": 28,
     "acc": 71.4,
     "adjustedAcc": 54.1,
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
   "graded": 294,
   "globalBlend": 0.731
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2923,
    "diana": 0.0822,
    "nova": 0.3307,
    "flow": 0.2948
   },
   "acc": {
    "taro": {
     "n": 358,
     "acc": 52.8,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 89,
     "acc": 30.3,
     "adjustedAcc": 41.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 282,
     "acc": 58.9,
     "adjustedAcc": 56.2,
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
   "graded": 747,
   "globalBlend": 0.517
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2908,
    "diana": 0.0932,
    "nova": 0.3174,
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
    "taro": 0.2933,
    "diana": 0.0811,
    "nova": 0.3546,
    "flow": 0.2711
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 53.8,
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
     "n": 204,
     "acc": 68.1,
     "adjustedAcc": 61.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 41.7,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 590,
   "globalBlend": 0.576
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2752,
    "diana": 0.0798,
    "nova": 0.3478,
    "flow": 0.2973
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
     "n": 68,
     "acc": 8.8,
     "adjustedAcc": 35.1,
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
   "graded": 523,
   "globalBlend": 0.605
  },
  "로봇": {
   "weights": {
    "taro": 0.2908,
    "diana": 0.0911,
    "nova": 0.3528,
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
    "taro": 0.2785,
    "diana": 0.104,
    "nova": 0.3204,
    "flow": 0.2971
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 37.8,
     "adjustedAcc": 42.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 73.9,
     "adjustedAcc": 56.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 153,
     "acc": 42.5,
     "adjustedAcc": 45.8,
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
   "graded": 388,
   "globalBlend": 0.673
  },
  "여행레저": {
   "weights": {
    "taro": 0.3005,
    "diana": 0.0812,
    "nova": 0.3373,
    "flow": 0.2809
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 60.4,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 0.0,
     "adjustedAcc": 41.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 86,
     "acc": 59.3,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 35.1,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 253,
   "globalBlend": 0.76
  }
 }
};
