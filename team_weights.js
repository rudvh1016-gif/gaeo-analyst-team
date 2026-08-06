// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-06 15:58",
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
   "taro": 0.2882,
   "diana": 0.0782,
   "nova": 0.3465,
   "flow": 0.2871
  },
  "acc": {
   "taro": {
    "n": 8290,
    "acc": 54.8,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1797,
    "acc": 41.2,
    "adjustedAcc": 41.8,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7131,
    "acc": 63.4,
    "adjustedAcc": 63.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1451,
    "acc": 55.0,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 18669,
  "team": {
   "hit": 5953,
   "miss": 1787,
   "n": 7740,
   "acc": 76.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.0757,
    "nova": 0.2909,
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
    "nova": 0.3235,
    "flow": 0.2845
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
    "taro": 0.275,
    "diana": 0.0915,
    "nova": 0.3494,
    "flow": 0.2841
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
     "acc": 42.7,
     "adjustedAcc": 46.9,
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
    "taro": 0.3002,
    "diana": 0.0789,
    "nova": 0.3625,
    "flow": 0.2584
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
     "n": 85,
     "acc": 22.4,
     "adjustedAcc": 38.5,
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
   "graded": 762,
   "globalBlend": 0.512
  },
  "통신": {
   "weights": {
    "taro": 0.285,
    "diana": 0.0858,
    "nova": 0.3376,
    "flow": 0.2916
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
     "n": 128,
     "acc": 65.6,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 54,
     "acc": 63.0,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 359,
   "globalBlend": 0.69
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.1089,
    "nova": 0.3327,
    "flow": 0.2838
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
    "taro": 0.2968,
    "diana": 0.0782,
    "nova": 0.3644,
    "flow": 0.2606
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
     "acc": 23.6,
     "adjustedAcc": 36.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 373,
     "acc": 64.3,
     "adjustedAcc": 60.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 134,
     "acc": 38.1,
     "adjustedAcc": 43.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1113,
   "globalBlend": 0.418
  },
  "2차전지": {
   "weights": {
    "taro": 0.3168,
    "diana": 0.083,
    "nova": 0.3581,
    "flow": 0.2421
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
    "taro": 0.2872,
    "diana": 0.0926,
    "nova": 0.3342,
    "flow": 0.2861
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
     "n": 124,
     "acc": 58.9,
     "adjustedAcc": 54.5,
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
   "graded": 351,
   "globalBlend": 0.695
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2929,
    "diana": 0.095,
    "nova": 0.3413,
    "flow": 0.2708
   },
   "acc": {
    "taro": {
     "n": 1052,
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
     "n": 930,
     "acc": 67.1,
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
   "graded": 2333,
   "globalBlend": 0.255
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2868,
    "diana": 0.0929,
    "nova": 0.361,
    "flow": 0.2592
   },
   "acc": {
    "taro": {
     "n": 469,
     "acc": 51.4,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 126,
     "acc": 46.0,
     "adjustedAcc": 48.0,
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
    "taro": 0.2867,
    "diana": 0.0815,
    "nova": 0.339,
    "flow": 0.2928
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
     "n": 68,
     "acc": 20.6,
     "adjustedAcc": 39.4,
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
   "graded": 642,
   "globalBlend": 0.555
  },
  "방산": {
   "weights": {
    "taro": 0.2863,
    "diana": 0.0848,
    "nova": 0.3405,
    "flow": 0.2883
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
    "taro": 0.2926,
    "diana": 0.0881,
    "nova": 0.3375,
    "flow": 0.2819
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
    "diana": 0.0782,
    "nova": 0.3378,
    "flow": 0.2969
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
     "n": 156,
     "acc": 39.1,
     "adjustedAcc": 43.8,
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
   "graded": 1375,
   "globalBlend": 0.368
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2855,
    "diana": 0.0932,
    "nova": 0.3278,
    "flow": 0.2935
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
    "taro": 0.2926,
    "diana": 0.0825,
    "nova": 0.3299,
    "flow": 0.2951
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
     "n": 88,
     "acc": 30.7,
     "adjustedAcc": 41.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 281,
     "acc": 58.7,
     "adjustedAcc": 56.1,
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
   "graded": 744,
   "globalBlend": 0.518
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2907,
    "diana": 0.0933,
    "nova": 0.317,
    "flow": 0.299
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
    "taro": 0.2932,
    "diana": 0.0811,
    "nova": 0.3543,
    "flow": 0.2715
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
    "taro": 0.2756,
    "diana": 0.0798,
    "nova": 0.3468,
    "flow": 0.2978
   },
   "acc": {
    "taro": {
     "n": 243,
     "acc": 38.7,
     "adjustedAcc": 42.4,
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
     "n": 210,
     "acc": 57.6,
     "adjustedAcc": 54.8,
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
   "graded": 525,
   "globalBlend": 0.604
  },
  "로봇": {
   "weights": {
    "taro": 0.2907,
    "diana": 0.0912,
    "nova": 0.3525,
    "flow": 0.2656
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
    "taro": 0.2783,
    "diana": 0.1041,
    "nova": 0.32,
    "flow": 0.2975
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
    "taro": 0.3006,
    "diana": 0.0812,
    "nova": 0.3364,
    "flow": 0.2818
   },
   "acc": {
    "taro": {
     "n": 105,
     "acc": 61.0,
     "adjustedAcc": 55.1,
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
     "n": 85,
     "acc": 58.8,
     "adjustedAcc": 53.7,
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
   "graded": 250,
   "globalBlend": 0.762
  }
 }
};
