// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-06 10:39",
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
   "taro": 0.2897,
   "diana": 0.0766,
   "nova": 0.3477,
   "flow": 0.286
  },
  "acc": {
   "taro": {
    "n": 8293,
    "acc": 54.8,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1801,
    "acc": 40.3,
    "adjustedAcc": 40.9,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7130,
    "acc": 63.3,
    "adjustedAcc": 63.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1451,
    "acc": 54.7,
    "adjustedAcc": 54.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 18675,
  "team": {
   "hit": 5987,
   "miss": 1788,
   "n": 7775,
   "acc": 77.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2959,
    "diana": 0.0751,
    "nova": 0.2912,
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
     "n": 171,
     "acc": 36.8,
     "adjustedAcc": 42.3,
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
   "graded": 2388,
   "globalBlend": 0.251
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3131,
    "diana": 0.0785,
    "nova": 0.3242,
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
    "diana": 0.0904,
    "nova": 0.3505,
    "flow": 0.2837
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
    "nova": 0.3624,
    "flow": 0.2581
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
     "n": 83,
     "acc": 20.5,
     "adjustedAcc": 37.9,
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
   "graded": 757,
   "globalBlend": 0.514
  },
  "통신": {
   "weights": {
    "taro": 0.2868,
    "diana": 0.0843,
    "nova": 0.3378,
    "flow": 0.2911
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
    "diana": 0.1075,
    "nova": 0.3344,
    "flow": 0.2825
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
    "taro": 0.2998,
    "diana": 0.0757,
    "nova": 0.3649,
    "flow": 0.2596
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
     "n": 124,
     "acc": 20.2,
     "adjustedAcc": 34.8,
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
   "graded": 1119,
   "globalBlend": 0.417
  },
  "2차전지": {
   "weights": {
    "taro": 0.3174,
    "diana": 0.0826,
    "nova": 0.3585,
    "flow": 0.2415
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
     "n": 74,
     "acc": 54.1,
     "adjustedAcc": 51.5,
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
   "graded": 912,
   "globalBlend": 0.467
  },
  "보험": {
   "weights": {
    "taro": 0.2884,
    "diana": 0.091,
    "nova": 0.3356,
    "flow": 0.285
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
    "taro": 0.2946,
    "diana": 0.0962,
    "nova": 0.3389,
    "flow": 0.2704
   },
   "acc": {
    "taro": {
     "n": 1049,
     "acc": 59.3,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 225,
     "acc": 55.6,
     "adjustedAcc": 53.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 926,
     "acc": 66.7,
     "adjustedAcc": 64.8,
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
   "graded": 2329,
   "globalBlend": 0.256
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2875,
    "diana": 0.0913,
    "nova": 0.3621,
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
     "n": 125,
     "acc": 44.8,
     "adjustedAcc": 47.3,
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
    "diana": 0.0798,
    "nova": 0.3404,
    "flow": 0.2923
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
    "taro": 0.2874,
    "diana": 0.0838,
    "nova": 0.3414,
    "flow": 0.2874
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
     "n": 16,
     "acc": 31.2,
     "adjustedAcc": 47.8,
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
   "graded": 237,
   "globalBlend": 0.771
  },
  "철강·금속": {
   "weights": {
    "taro": 0.294,
    "diana": 0.0858,
    "nova": 0.3388,
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
     "n": 45,
     "acc": 46.7,
     "adjustedAcc": 49.1,
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
   "graded": 371,
   "globalBlend": 0.683
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2881,
    "diana": 0.0774,
    "nova": 0.3379,
    "flow": 0.2966
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
    "taro": 0.2864,
    "diana": 0.0917,
    "nova": 0.3296,
    "flow": 0.2923
   },
   "acc": {
    "taro": {
     "n": 113,
     "acc": 45.1,
     "adjustedAcc": 47.6,
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
     "n": 77,
     "acc": 50.6,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 53.4,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 292,
   "globalBlend": 0.733
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2935,
    "diana": 0.081,
    "nova": 0.3305,
    "flow": 0.2951
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
     "acc": 29.2,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 282,
     "acc": 58.5,
     "adjustedAcc": 56.0,
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
    "taro": 0.2916,
    "diana": 0.0923,
    "nova": 0.3187,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 47.2,
     "adjustedAcc": 48.2,
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
     "n": 156,
     "acc": 44.2,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 6,
     "acc": 66.7,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 420,
   "globalBlend": 0.656
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2946,
    "diana": 0.0804,
    "nova": 0.3545,
    "flow": 0.2706
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
    "taro": 0.2762,
    "diana": 0.0781,
    "nova": 0.3485,
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
    "taro": 0.2915,
    "diana": 0.0905,
    "nova": 0.3531,
    "flow": 0.2648
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
     "n": 44,
     "acc": 65.9,
     "adjustedAcc": 54.3,
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
   "graded": 461,
   "globalBlend": 0.634
  },
  "식음료": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1023,
    "nova": 0.3219,
    "flow": 0.2977
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
     "n": 47,
     "acc": 70.2,
     "adjustedAcc": 55.7,
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
   "graded": 395,
   "globalBlend": 0.669
  },
  "여행레저": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.0802,
    "nova": 0.3374,
    "flow": 0.2797
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
