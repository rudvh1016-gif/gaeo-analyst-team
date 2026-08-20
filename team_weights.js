// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-20 10:11",
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
   "taro": 0.2706,
   "diana": 0.1252,
   "nova": 0.2971,
   "flow": 0.3071
  },
  "acc": {
   "taro": {
    "n": 11511,
    "acc": 51.2,
    "adjustedAcc": 51.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4935,
    "acc": 56.2,
    "adjustedAcc": 56.0,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9022,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2097,
    "acc": 55.7,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 27565,
  "team": {
   "hit": 7706,
   "miss": 7242,
   "n": 14948,
   "acc": 51.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2776,
    "diana": 0.1003,
    "nova": 0.2709,
    "flow": 0.3512
   },
   "acc": {
    "taro": {
     "n": 1360,
     "acc": 51.0,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 435,
     "acc": 42.8,
     "adjustedAcc": 44.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1119,
     "acc": 51.1,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 420,
     "acc": 62.6,
     "adjustedAcc": 59.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3334,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2964,
    "diana": 0.1143,
    "nova": 0.2891,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 652,
     "acc": 58.4,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 198,
     "acc": 54.5,
     "adjustedAcc": 52.8,
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
     "n": 196,
     "acc": 59.2,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1584,
   "globalBlend": 0.336
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.253,
    "diana": 0.1359,
    "nova": 0.3123,
    "flow": 0.2988
   },
   "acc": {
    "taro": {
     "n": 573,
     "acc": 43.8,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 265,
     "acc": 60.8,
     "adjustedAcc": 57.4,
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
     "n": 132,
     "acc": 52.3,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1455,
   "globalBlend": 0.355
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2932,
    "diana": 0.1191,
    "nova": 0.3161,
    "flow": 0.2716
   },
   "acc": {
    "taro": {
     "n": 436,
     "acc": 52.5,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 218,
     "acc": 49.1,
     "adjustedAcc": 49.4,
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
     "n": 99,
     "acc": 37.4,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1103,
   "globalBlend": 0.42
  },
  "통신": {
   "weights": {
    "taro": 0.268,
    "diana": 0.12,
    "nova": 0.2984,
    "flow": 0.3136
   },
   "acc": {
    "taro": {
     "n": 201,
     "acc": 48.8,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 53.2,
     "adjustedAcc": 51.1,
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
     "n": 87,
     "acc": 64.4,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 504,
   "globalBlend": 0.613
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1601,
    "nova": 0.2742,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 539,
     "acc": 51.2,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 248,
     "acc": 76.2,
     "adjustedAcc": 67.7,
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
     "n": 77,
     "acc": 54.5,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1278,
   "globalBlend": 0.385
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2803,
    "diana": 0.1043,
    "nova": 0.3228,
    "flow": 0.2926
   },
   "acc": {
    "taro": {
     "n": 628,
     "acc": 47.9,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 316,
     "acc": 38.6,
     "adjustedAcc": 41.7,
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
     "n": 170,
     "acc": 47.1,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1585,
   "globalBlend": 0.335
  },
  "2차전지": {
   "weights": {
    "taro": 0.3014,
    "diana": 0.1105,
    "nova": 0.3268,
    "flow": 0.2613
   },
   "acc": {
    "taro": {
     "n": 607,
     "acc": 60.6,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 193,
     "acc": 51.8,
     "adjustedAcc": 51.1,
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
     "n": 27,
     "acc": 40.7,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1304,
   "globalBlend": 0.38
  },
  "보험": {
   "weights": {
    "taro": 0.2753,
    "diana": 0.1415,
    "nova": 0.2871,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 225,
     "acc": 52.0,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 106,
     "acc": 80.2,
     "adjustedAcc": 64.2,
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
     "n": 43,
     "acc": 53.5,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 529,
   "globalBlend": 0.602
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.1194,
    "nova": 0.2989,
    "flow": 0.301
   },
   "acc": {
    "taro": {
     "n": 1509,
     "acc": 54.6,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 615,
     "acc": 56.4,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1195,
     "acc": 59.2,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 198,
     "acc": 59.6,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3517,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2719,
    "diana": 0.1288,
    "nova": 0.3227,
    "flow": 0.2766
   },
   "acc": {
    "taro": {
     "n": 662,
     "acc": 49.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 352,
     "acc": 57.4,
     "adjustedAcc": 55.5,
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
     "n": 61,
     "acc": 44.3,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1592,
   "globalBlend": 0.334
  },
  "조선": {
   "weights": {
    "taro": 0.2614,
    "diana": 0.1349,
    "nova": 0.3013,
    "flow": 0.3023
   },
   "acc": {
    "taro": {
     "n": 366,
     "acc": 44.3,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 177,
     "acc": 62.1,
     "adjustedAcc": 57.2,
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
     "n": 64,
     "acc": 53.1,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 923,
   "globalBlend": 0.464
  },
  "방산": {
   "weights": {
    "taro": 0.2711,
    "diana": 0.1206,
    "nova": 0.2964,
    "flow": 0.312
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 46.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 43.6,
     "adjustedAcc": 48.4,
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
   "graded": 343,
   "globalBlend": 0.7
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.1501,
    "nova": 0.2828,
    "flow": 0.2866
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 54.8,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 141,
     "acc": 83.7,
     "adjustedAcc": 68.2,
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
   "graded": 575,
   "globalBlend": 0.582
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.1211,
    "nova": 0.2995,
    "flow": 0.3052
   },
   "acc": {
    "taro": {
     "n": 837,
     "acc": 53.2,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 437,
     "acc": 57.0,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 677,
     "acc": 59.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 101,
     "acc": 63.4,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2052,
   "globalBlend": 0.281
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2648,
    "diana": 0.1453,
    "nova": 0.2792,
    "flow": 0.3108
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 43.7,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 76,
     "acc": 89.5,
     "adjustedAcc": 65.3,
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
     "n": 113,
     "acc": 57.5,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 464,
   "globalBlend": 0.633
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2885,
    "diana": 0.1125,
    "nova": 0.2947,
    "flow": 0.3043
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 53.3,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 241,
     "acc": 46.5,
     "adjustedAcc": 47.6,
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
   "graded": 1138,
   "globalBlend": 0.413
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.277,
    "diana": 0.1378,
    "nova": 0.2701,
    "flow": 0.3151
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 118,
     "acc": 69.5,
     "adjustedAcc": 59.7,
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
   "graded": 658,
   "globalBlend": 0.549
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2767,
    "diana": 0.1302,
    "nova": 0.31,
    "flow": 0.2831
   },
   "acc": {
    "taro": {
     "n": 339,
     "acc": 51.3,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 149,
     "acc": 62.4,
     "adjustedAcc": 56.9,
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
     "acc": 46.7,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 863,
   "globalBlend": 0.481
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2601,
    "diana": 0.1159,
    "nova": 0.3089,
    "flow": 0.3151
   },
   "acc": {
    "taro": {
     "n": 348,
     "acc": 37.9,
     "adjustedAcc": 41.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 181,
     "acc": 38.7,
     "adjustedAcc": 43.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 271,
     "acc": 52.4,
     "adjustedAcc": 51.7,
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
   "graded": 805,
   "globalBlend": 0.498
  },
  "기계": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.1298,
    "nova": 0.2954,
    "flow": 0.3122
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 37.4,
     "adjustedAcc": 43.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 73.6,
     "adjustedAcc": 57.2,
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
   "graded": 276,
   "globalBlend": 0.743
  },
  "로봇": {
   "weights": {
    "taro": 0.2904,
    "diana": 0.1026,
    "nova": 0.3212,
    "flow": 0.2858
   },
   "acc": {
    "taro": {
     "n": 262,
     "acc": 56.5,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 117,
     "acc": 23.9,
     "adjustedAcc": 37.1,
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
     "n": 61,
     "acc": 44.3,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 653,
   "globalBlend": 0.551
  },
  "식음료": {
   "weights": {
    "taro": 0.2621,
    "diana": 0.1686,
    "nova": 0.27,
    "flow": 0.2993
   },
   "acc": {
    "taro": {
     "n": 311,
     "acc": 44.1,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 149,
     "acc": 89.3,
     "adjustedAcc": 71.7,
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
   "graded": 675,
   "globalBlend": 0.542
  },
  "여행레저": {
   "weights": {
    "taro": 0.2838,
    "diana": 0.1166,
    "nova": 0.3,
    "flow": 0.2995
   },
   "acc": {
    "taro": {
     "n": 147,
     "acc": 53.1,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 49,
     "acc": 26.5,
     "adjustedAcc": 43.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 113,
     "acc": 56.6,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 46,
     "acc": 43.5,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 355,
   "globalBlend": 0.693
  }
 }
};
