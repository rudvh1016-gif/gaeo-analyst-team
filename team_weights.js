// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-13 14:19",
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
   "nova": 0.2945,
   "flow": 0.3161
  },
  "acc": {
   "taro": {
    "n": 10039,
    "acc": 53.1,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3354,
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
    "n": 1818,
    "acc": 57.4,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 24155,
  "team": {
   "hit": 6723,
   "miss": 2716,
   "n": 9439,
   "acc": 71.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2823,
    "diana": 0.0869,
    "nova": 0.2639,
    "flow": 0.3669
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
     "acc": 38.1,
     "adjustedAcc": 41.5,
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
    "taro": 0.3009,
    "diana": 0.1014,
    "nova": 0.2853,
    "flow": 0.3123
   },
   "acc": {
    "taro": {
     "n": 588,
     "acc": 60.4,
     "adjustedAcc": 58.6,
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
   "graded": 1432,
   "globalBlend": 0.358
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2625,
    "diana": 0.1203,
    "nova": 0.317,
    "flow": 0.3002
   },
   "acc": {
    "taro": {
     "n": 505,
     "acc": 44.2,
     "adjustedAcc": 45.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 175,
     "acc": 56.0,
     "adjustedAcc": 53.6,
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
    "taro": 0.3017,
    "diana": 0.1023,
    "nova": 0.318,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 385,
     "acc": 53.2,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 152,
     "acc": 38.8,
     "adjustedAcc": 43.8,
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
     "n": 89,
     "acc": 36.0,
     "adjustedAcc": 44.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 973,
   "globalBlend": 0.451
  },
  "통신": {
   "weights": {
    "taro": 0.2815,
    "diana": 0.1065,
    "nova": 0.2959,
    "flow": 0.3162
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
    "taro": 0.2847,
    "diana": 0.1427,
    "nova": 0.2739,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 461,
     "acc": 53.1,
     "adjustedAcc": 52.5,
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
   "graded": 1104,
   "globalBlend": 0.42
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.0932,
    "nova": 0.3219,
    "flow": 0.2915
   },
   "acc": {
    "taro": {
     "n": 566,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 216,
     "acc": 31.9,
     "adjustedAcc": 38.4,
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
   "graded": 1409,
   "globalBlend": 0.362
  },
  "2차전지": {
   "weights": {
    "taro": 0.3172,
    "diana": 0.1017,
    "nova": 0.318,
    "flow": 0.2632
   },
   "acc": {
    "taro": {
     "n": 527,
     "acc": 65.1,
     "adjustedAcc": 62.3,
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
   "graded": 1143,
   "globalBlend": 0.412
  },
  "보험": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1227,
    "nova": 0.291,
    "flow": 0.3065
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
    "taro": 0.295,
    "diana": 0.1106,
    "nova": 0.2894,
    "flow": 0.305
   },
   "acc": {
    "taro": {
     "n": 1302,
     "acc": 58.4,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 418,
     "acc": 56.9,
     "adjustedAcc": 55.4,
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
   "graded": 3066,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2789,
    "diana": 0.1196,
    "nova": 0.3222,
    "flow": 0.2794
   },
   "acc": {
    "taro": {
     "n": 569,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
   "graded": 1373,
   "globalBlend": 0.368
  },
  "조선": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.1135,
    "nova": 0.3031,
    "flow": 0.3093
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
     "n": 60,
     "acc": 53.3,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 823,
   "globalBlend": 0.493
  },
  "방산": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.1081,
    "nova": 0.2965,
    "flow": 0.3157
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
    "taro": 0.2942,
    "diana": 0.1233,
    "nova": 0.283,
    "flow": 0.2995
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
     "n": 92,
     "acc": 75.0,
     "adjustedAcc": 60.8,
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
   "graded": 489,
   "globalBlend": 0.621
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2831,
    "diana": 0.1048,
    "nova": 0.2989,
    "flow": 0.3132
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
     "n": 291,
     "acc": 51.2,
     "adjustedAcc": 50.9,
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
   "graded": 1776,
   "globalBlend": 0.311
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.125,
    "nova": 0.2802,
    "flow": 0.3187
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
     "n": 53,
     "acc": 84.9,
     "adjustedAcc": 60.7,
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
   "graded": 400,
   "globalBlend": 0.667
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2966,
    "diana": 0.1034,
    "nova": 0.2921,
    "flow": 0.3079
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
     "n": 163,
     "acc": 44.2,
     "adjustedAcc": 46.6,
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
   "graded": 981,
   "globalBlend": 0.449
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2851,
    "diana": 0.1183,
    "nova": 0.2713,
    "flow": 0.3254
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
    "taro": 0.2902,
    "diana": 0.1081,
    "nova": 0.3096,
    "flow": 0.292
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 53.5,
     "adjustedAcc": 52.5,
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
   "graded": 759,
   "globalBlend": 0.513
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.274,
    "diana": 0.1022,
    "nova": 0.3057,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 39.9,
     "adjustedAcc": 42.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 123,
     "acc": 29.3,
     "adjustedAcc": 39.5,
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
    "taro": 0.2726,
    "diana": 0.1132,
    "nova": 0.2957,
    "flow": 0.3185
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 34.4,
     "adjustedAcc": 43.1,
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
   "graded": 238,
   "globalBlend": 0.771
  },
  "로봇": {
   "weights": {
    "taro": 0.2991,
    "diana": 0.1002,
    "nova": 0.3141,
    "flow": 0.2866
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 59.4,
     "adjustedAcc": 56.2,
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
   "graded": 580,
   "globalBlend": 0.58
  },
  "식음료": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.1416,
    "nova": 0.2734,
    "flow": 0.3074
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
     "n": 99,
     "acc": 84.8,
     "adjustedAcc": 65.8,
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
   "graded": 567,
   "globalBlend": 0.585
  },
  "여행레저": {
   "weights": {
    "taro": 0.2954,
    "diana": 0.102,
    "nova": 0.2967,
    "flow": 0.306
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
