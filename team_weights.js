// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-13 13:23",
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
   "taro": 0.2819,
   "diana": 0.1076,
   "nova": 0.2948,
   "flow": 0.3158
  },
  "acc": {
   "taro": {
    "n": 10035,
    "acc": 53.1,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3355,
    "acc": 51.6,
    "adjustedAcc": 51.5,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8944,
    "acc": 57.0,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1820,
    "acc": 57.3,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 24154,
  "team": {
   "hit": 6725,
   "miss": 2717,
   "n": 9442,
   "acc": 71.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2825,
    "diana": 0.0865,
    "nova": 0.2641,
    "flow": 0.367
   },
   "acc": {
    "taro": {
     "n": 1209,
     "acc": 53.3,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 307,
     "acc": 37.8,
     "adjustedAcc": 41.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1101,
     "acc": 51.9,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 377,
     "acc": 67.4,
     "adjustedAcc": 63.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2994,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3013,
    "diana": 0.1013,
    "nova": 0.2853,
    "flow": 0.3121
   },
   "acc": {
    "taro": {
     "n": 587,
     "acc": 60.5,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 145,
     "acc": 51.0,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 530,
     "acc": 59.1,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 169,
     "acc": 64.5,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1431,
   "globalBlend": 0.359
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2621,
    "diana": 0.1207,
    "nova": 0.3172,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 504,
     "acc": 44.0,
     "adjustedAcc": 45.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 176,
     "acc": 56.2,
     "adjustedAcc": 53.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 479,
     "acc": 58.7,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 107,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1266,
   "globalBlend": 0.387
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.301,
    "diana": 0.1022,
    "nova": 0.319,
    "flow": 0.2777
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 52.9,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 151,
     "acc": 38.4,
     "adjustedAcc": 43.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 347,
     "acc": 59.1,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 35.6,
     "adjustedAcc": 43.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 972,
   "globalBlend": 0.451
  },
  "통신": {
   "weights": {
    "taro": 0.2814,
    "diana": 0.1065,
    "nova": 0.296,
    "flow": 0.316
   },
   "acc": {
    "taro": {
     "n": 181,
     "acc": 52.5,
     "adjustedAcc": 51.5,
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
     "n": 154,
     "acc": 60.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 71,
     "acc": 64.8,
     "adjustedAcc": 55.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 451,
   "globalBlend": 0.639
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.285,
    "diana": 0.1427,
    "nova": 0.2739,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 462,
     "acc": 53.2,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 165,
     "acc": 76.4,
     "adjustedAcc": 65.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 413,
     "acc": 51.8,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 56.9,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1105,
   "globalBlend": 0.42
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2931,
    "diana": 0.093,
    "nova": 0.3223,
    "flow": 0.2917
   },
   "acc": {
    "taro": {
     "n": 565,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 215,
     "acc": 31.6,
     "adjustedAcc": 38.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 470,
     "acc": 57.7,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 157,
     "acc": 45.2,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1407,
   "globalBlend": 0.362
  },
  "2차전지": {
   "weights": {
    "taro": 0.3168,
    "diana": 0.1017,
    "nova": 0.3184,
    "flow": 0.2631
   },
   "acc": {
    "taro": {
     "n": 528,
     "acc": 65.0,
     "adjustedAcc": 62.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 127,
     "acc": 52.0,
     "adjustedAcc": 51.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 475,
     "acc": 67.4,
     "adjustedAcc": 63.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 35.7,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1144,
   "globalBlend": 0.412
  },
  "보험": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1227,
    "nova": 0.2911,
    "flow": 0.3063
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 48.4,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 66,
     "acc": 75.8,
     "adjustedAcc": 59.1,
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
     "n": 40,
     "acc": 52.5,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 453,
   "globalBlend": 0.638
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2952,
    "diana": 0.1107,
    "nova": 0.2893,
    "flow": 0.3048
   },
   "acc": {
    "taro": {
     "n": 1299,
     "acc": 58.5,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 419,
     "acc": 57.0,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1183,
     "acc": 59.6,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 163,
     "acc": 63.8,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3064,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1195,
    "nova": 0.3222,
    "flow": 0.2791
   },
   "acc": {
    "taro": {
     "n": 570,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 236,
     "acc": 56.4,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 515,
     "acc": 60.8,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 41.5,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1374,
   "globalBlend": 0.368
  },
  "조선": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1137,
    "nova": 0.3037,
    "flow": 0.3082
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 45.7,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 121,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 314,
     "acc": 56.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 52.5,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 824,
   "globalBlend": 0.493
  },
  "방산": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.1081,
    "nova": 0.2967,
    "flow": 0.3155
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 45.9,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 37.9,
     "adjustedAcc": 47.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 124,
     "acc": 56.5,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 6,
     "acc": 100.0,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 307,
   "globalBlend": 0.723
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2943,
    "diana": 0.123,
    "nova": 0.2834,
    "flow": 0.2994
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
     "n": 91,
     "acc": 74.7,
     "adjustedAcc": 60.7,
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
     "n": 1,
     "acc": 100.0,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 488,
   "globalBlend": 0.621
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2831,
    "diana": 0.105,
    "nova": 0.2989,
    "flow": 0.313
   },
   "acc": {
    "taro": {
     "n": 724,
     "acc": 54.6,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 292,
     "acc": 51.4,
     "adjustedAcc": 51.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 669,
     "acc": 59.6,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 92,
     "acc": 66.3,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1777,
   "globalBlend": 0.31
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1253,
    "nova": 0.2803,
    "flow": 0.3184
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 44.4,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 85.2,
     "adjustedAcc": 60.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 107,
     "acc": 44.9,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 96,
     "acc": 58.3,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 401,
   "globalBlend": 0.666
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2966,
    "diana": 0.1035,
    "nova": 0.2922,
    "flow": 0.3078
   },
   "acc": {
    "taro": {
     "n": 443,
     "acc": 54.6,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 165,
     "acc": 44.2,
     "adjustedAcc": 46.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 355,
     "acc": 55.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 20,
     "acc": 70.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 983,
   "globalBlend": 0.449
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2851,
    "diana": 0.1183,
    "nova": 0.2715,
    "flow": 0.3252
   },
   "acc": {
    "taro": {
     "n": 267,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 62.3,
     "adjustedAcc": 54.8,
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
     "n": 21,
     "acc": 85.7,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 569,
   "globalBlend": 0.584
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2899,
    "diana": 0.1082,
    "nova": 0.3099,
    "flow": 0.292
   },
   "acc": {
    "taro": {
     "n": 298,
     "acc": 53.4,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 99,
     "acc": 48.5,
     "adjustedAcc": 49.3,
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
     "n": 108,
     "acc": 47.2,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 758,
   "globalBlend": 0.513
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1019,
    "nova": 0.306,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 39.7,
     "adjustedAcc": 42.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 28.7,
     "adjustedAcc": 39.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 268,
     "acc": 51.9,
     "adjustedAcc": 51.3,
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
   "graded": 686,
   "globalBlend": 0.538
  },
  "기계": {
   "weights": {
    "taro": 0.2724,
    "diana": 0.1133,
    "nova": 0.296,
    "flow": 0.3184
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 34.0,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 64.9,
     "adjustedAcc": 53.5,
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
     "n": 8,
     "acc": 100.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 239,
   "globalBlend": 0.77
  },
  "로봇": {
   "weights": {
    "taro": 0.2987,
    "diana": 0.1003,
    "nova": 0.3144,
    "flow": 0.2865
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 59.2,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 35.4,
     "adjustedAcc": 44.2,
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
     "n": 54,
     "acc": 40.7,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 579,
   "globalBlend": 0.58
  },
  "식음료": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1421,
    "nova": 0.2735,
    "flow": 0.3071
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 45.9,
     "adjustedAcc": 47.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 85.7,
     "adjustedAcc": 66.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 211,
     "acc": 43.6,
     "adjustedAcc": 45.9,
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
   "graded": 566,
   "globalBlend": 0.586
  },
  "여행레저": {
   "weights": {
    "taro": 0.2954,
    "diana": 0.102,
    "nova": 0.2969,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 56.2,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 7.7,
     "adjustedAcc": 39.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 108,
     "acc": 55.6,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 41.5,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 316,
   "globalBlend": 0.717
  }
 }
};
