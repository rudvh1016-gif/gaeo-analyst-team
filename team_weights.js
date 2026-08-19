// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-19 09:41",
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
   "taro": 0.274,
   "diana": 0.1232,
   "nova": 0.2964,
   "flow": 0.3063
  },
  "acc": {
   "taro": {
    "n": 11162,
    "acc": 51.6,
    "adjustedAcc": 51.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4613,
    "acc": 55.7,
    "adjustedAcc": 55.5,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9012,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2037,
    "acc": 55.7,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26824,
  "team": {
   "hit": 7399,
   "miss": 7067,
   "n": 14466,
   "acc": 51.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2787,
    "diana": 0.0998,
    "nova": 0.2687,
    "flow": 0.3527
   },
   "acc": {
    "taro": {
     "n": 1324,
     "acc": 51.4,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 411,
     "acc": 43.1,
     "adjustedAcc": 44.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1118,
     "acc": 51.1,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 412,
     "acc": 63.3,
     "adjustedAcc": 60.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3265,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2984,
    "diana": 0.1141,
    "nova": 0.2877,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 640,
     "acc": 58.9,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 188,
     "acc": 55.3,
     "adjustedAcc": 53.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 538,
     "acc": 58.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 193,
     "acc": 59.6,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1559,
   "globalBlend": 0.339
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2554,
    "diana": 0.1345,
    "nova": 0.3134,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 556,
     "acc": 43.7,
     "adjustedAcc": 44.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 247,
     "acc": 60.3,
     "adjustedAcc": 56.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 485,
     "acc": 57.9,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 121,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1409,
   "globalBlend": 0.362
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2965,
    "diana": 0.1167,
    "nova": 0.3154,
    "flow": 0.2714
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 53.1,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 203,
     "acc": 47.8,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 350,
     "acc": 58.6,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 97,
     "acc": 37.1,
     "adjustedAcc": 44.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1072,
   "globalBlend": 0.427
  },
  "통신": {
   "weights": {
    "taro": 0.2724,
    "diana": 0.1184,
    "nova": 0.2977,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 59,
     "acc": 52.5,
     "adjustedAcc": 50.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 154,
     "acc": 60.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 83,
     "acc": 63.9,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 492,
   "globalBlend": 0.619
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1567,
    "nova": 0.2732,
    "flow": 0.292
   },
   "acc": {
    "taro": {
     "n": 517,
     "acc": 52.2,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 231,
     "acc": 76.2,
     "adjustedAcc": 67.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 414,
     "acc": 51.7,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 76,
     "acc": 55.3,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1238,
   "globalBlend": 0.393
  },
  "금융·증권": {
   "weights": {
    "taro": 0.283,
    "diana": 0.1034,
    "nova": 0.3223,
    "flow": 0.2913
   },
   "acc": {
    "taro": {
     "n": 615,
     "acc": 48.3,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 299,
     "acc": 38.1,
     "adjustedAcc": 41.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 471,
     "acc": 57.5,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 167,
     "acc": 46.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1552,
   "globalBlend": 0.34
  },
  "2차전지": {
   "weights": {
    "taro": 0.3056,
    "diana": 0.1089,
    "nova": 0.3232,
    "flow": 0.2623
   },
   "acc": {
    "taro": {
     "n": 588,
     "acc": 61.9,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 178,
     "acc": 51.7,
     "adjustedAcc": 51.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 477,
     "acc": 67.1,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 23,
     "acc": 43.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1266,
   "globalBlend": 0.387
  },
  "보험": {
   "weights": {
    "taro": 0.2771,
    "diana": 0.1399,
    "nova": 0.288,
    "flow": 0.2949
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 51.4,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 80.6,
     "adjustedAcc": 63.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 54.2,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 51.2,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 512,
   "globalBlend": 0.61
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.285,
    "diana": 0.1192,
    "nova": 0.2975,
    "flow": 0.2984
   },
   "acc": {
    "taro": {
     "n": 1462,
     "acc": 55.4,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 577,
     "acc": 56.8,
     "adjustedAcc": 55.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1191,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 190,
     "acc": 59.5,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3420,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.1276,
    "nova": 0.3219,
    "flow": 0.2792
   },
   "acc": {
    "taro": {
     "n": 640,
     "acc": 49.1,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 326,
     "acc": 57.4,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 517,
     "acc": 60.7,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 45.8,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1542,
   "globalBlend": 0.342
  },
  "조선": {
   "weights": {
    "taro": 0.265,
    "diana": 0.1331,
    "nova": 0.301,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 355,
     "acc": 44.8,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 165,
     "acc": 61.8,
     "adjustedAcc": 56.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 316,
     "acc": 55.7,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 63,
     "acc": 52.4,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 899,
   "globalBlend": 0.471
  },
  "방산": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.1189,
    "nova": 0.2958,
    "flow": 0.3112
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 47.2,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 48.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 125,
     "acc": 56.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 10,
     "acc": 100.0,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 334,
   "globalBlend": 0.705
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2846,
    "diana": 0.1453,
    "nova": 0.2832,
    "flow": 0.287
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 55.6,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 129,
     "acc": 82.2,
     "adjustedAcc": 66.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 199,
     "acc": 52.8,
     "adjustedAcc": 51.7,
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
   "graded": 556,
   "globalBlend": 0.59
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1185,
    "nova": 0.2993,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 807,
     "acc": 53.3,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 406,
     "acc": 55.9,
     "adjustedAcc": 54.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 675,
     "acc": 59.3,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 99,
     "acc": 63.6,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1987,
   "globalBlend": 0.287
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2676,
    "diana": 0.1419,
    "nova": 0.2788,
    "flow": 0.3117
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 44.2,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 74,
     "acc": 87.8,
     "adjustedAcc": 64.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 108,
     "acc": 45.4,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 109,
     "acc": 58.7,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 454,
   "globalBlend": 0.638
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2905,
    "diana": 0.1111,
    "nova": 0.2944,
    "flow": 0.304
   },
   "acc": {
    "taro": {
     "n": 497,
     "acc": 53.5,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 225,
     "acc": 45.8,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 359,
     "acc": 55.4,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 22,
     "acc": 68.2,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1103,
   "globalBlend": 0.42
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2803,
    "diana": 0.1345,
    "nova": 0.2704,
    "flow": 0.3148
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 107,
     "acc": 68.2,
     "adjustedAcc": 58.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 204,
     "acc": 43.6,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 24,
     "acc": 75.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 636,
   "globalBlend": 0.557
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.1275,
    "nova": 0.3117,
    "flow": 0.2815
   },
   "acc": {
    "taro": {
     "n": 331,
     "acc": 51.1,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 60.4,
     "adjustedAcc": 55.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 61.3,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 122,
     "acc": 45.1,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 845,
   "globalBlend": 0.486
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2637,
    "diana": 0.1138,
    "nova": 0.3089,
    "flow": 0.3137
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 38.1,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 167,
     "acc": 36.5,
     "adjustedAcc": 42.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 270,
     "acc": 52.2,
     "adjustedAcc": 51.5,
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
   "graded": 777,
   "globalBlend": 0.507
  },
  "기계": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.128,
    "nova": 0.2947,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 111,
     "acc": 37.8,
     "adjustedAcc": 44.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 74.0,
     "adjustedAcc": 57.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 97,
     "acc": 55.7,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 11,
     "acc": 100.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 269,
   "globalBlend": 0.748
  },
  "로봇": {
   "weights": {
    "taro": 0.296,
    "diana": 0.1025,
    "nova": 0.3195,
    "flow": 0.282
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 58.2,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 25.2,
     "adjustedAcc": 38.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 213,
     "acc": 66.2,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 60,
     "acc": 41.7,
     "adjustedAcc": 47.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 640,
   "globalBlend": 0.556
  },
  "식음료": {
   "weights": {
    "taro": 0.2648,
    "diana": 0.1645,
    "nova": 0.2708,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 298,
     "acc": 44.0,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 140,
     "acc": 88.6,
     "adjustedAcc": 70.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 212,
     "acc": 43.9,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 3,
     "acc": 66.7,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 653,
   "globalBlend": 0.551
  },
  "여행레저": {
   "weights": {
    "taro": 0.2885,
    "diana": 0.1144,
    "nova": 0.2986,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 143,
     "acc": 54.5,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 47,
     "acc": 21.3,
     "adjustedAcc": 41.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 111,
     "acc": 55.9,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 43,
     "acc": 41.9,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 344,
   "globalBlend": 0.699
  }
 }
};
