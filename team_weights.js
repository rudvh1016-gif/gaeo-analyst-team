// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-20 09:11",
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
   "taro": 0.2708,
   "diana": 0.1253,
   "nova": 0.2965,
   "flow": 0.3074
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
    "n": 4945,
    "acc": 56.2,
    "adjustedAcc": 56.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9025,
    "acc": 56.6,
    "adjustedAcc": 56.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2102,
    "acc": 55.8,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 27583,
  "team": {
   "hit": 7707,
   "miss": 7247,
   "n": 14954,
   "acc": 51.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.1003,
    "nova": 0.2702,
    "flow": 0.352
   },
   "acc": {
    "taro": {
     "n": 1362,
     "acc": 51.0,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 437,
     "acc": 42.8,
     "adjustedAcc": 44.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1119,
     "acc": 51.0,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 419,
     "acc": 62.8,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3337,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2971,
    "diana": 0.1141,
    "nova": 0.2893,
    "flow": 0.2995
   },
   "acc": {
    "taro": {
     "n": 655,
     "acc": 58.5,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 199,
     "acc": 54.3,
     "adjustedAcc": 52.7,
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
     "n": 197,
     "acc": 58.9,
     "adjustedAcc": 55.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1589,
   "globalBlend": 0.335
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2528,
    "diana": 0.1362,
    "nova": 0.3121,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 574,
     "acc": 43.7,
     "adjustedAcc": 44.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 266,
     "acc": 60.9,
     "adjustedAcc": 57.5,
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
   "graded": 1457,
   "globalBlend": 0.354
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2932,
    "diana": 0.1193,
    "nova": 0.3163,
    "flow": 0.2712
   },
   "acc": {
    "taro": {
     "n": 437,
     "acc": 52.4,
     "adjustedAcc": 51.9,
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
     "n": 100,
     "acc": 37.0,
     "adjustedAcc": 44.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1105,
   "globalBlend": 0.42
  },
  "통신": {
   "weights": {
    "taro": 0.2678,
    "diana": 0.1201,
    "nova": 0.2982,
    "flow": 0.3139
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 48.5,
     "adjustedAcc": 49.1,
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
   "graded": 505,
   "globalBlend": 0.613
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2726,
    "diana": 0.1607,
    "nova": 0.2743,
    "flow": 0.2924
   },
   "acc": {
    "taro": {
     "n": 539,
     "acc": 50.8,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 249,
     "acc": 76.3,
     "adjustedAcc": 67.8,
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
   "graded": 1279,
   "globalBlend": 0.385
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2794,
    "diana": 0.1045,
    "nova": 0.3225,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 624,
     "acc": 47.8,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 315,
     "acc": 38.7,
     "adjustedAcc": 41.8,
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
     "n": 169,
     "acc": 47.3,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1579,
   "globalBlend": 0.336
  },
  "2차전지": {
   "weights": {
    "taro": 0.3018,
    "diana": 0.1105,
    "nova": 0.3264,
    "flow": 0.2613
   },
   "acc": {
    "taro": {
     "n": 606,
     "acc": 60.7,
     "adjustedAcc": 59.0,
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
   "graded": 1303,
   "globalBlend": 0.38
  },
  "보험": {
   "weights": {
    "taro": 0.2757,
    "diana": 0.1417,
    "nova": 0.2866,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 52.2,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 107,
     "acc": 80.4,
     "adjustedAcc": 64.3,
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
    "taro": 0.2826,
    "diana": 0.1192,
    "nova": 0.2976,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 1507,
     "acc": 55.0,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 617,
     "acc": 56.4,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1195,
     "acc": 59.1,
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
    "taro": 0.272,
    "diana": 0.1288,
    "nova": 0.3225,
    "flow": 0.2767
   },
   "acc": {
    "taro": {
     "n": 660,
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
   "graded": 1590,
   "globalBlend": 0.335
  },
  "조선": {
   "weights": {
    "taro": 0.2615,
    "diana": 0.135,
    "nova": 0.301,
    "flow": 0.3025
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
    "taro": 0.2718,
    "diana": 0.1206,
    "nova": 0.2957,
    "flow": 0.3119
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 47.3,
     "adjustedAcc": 48.4,
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
   "graded": 341,
   "globalBlend": 0.701
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.1502,
    "nova": 0.2825,
    "flow": 0.2868
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
    "taro": 0.2734,
    "diana": 0.1214,
    "nova": 0.2996,
    "flow": 0.3055
   },
   "acc": {
    "taro": {
     "n": 838,
     "acc": 53.0,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 438,
     "acc": 57.1,
     "adjustedAcc": 55.6,
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
   "graded": 2054,
   "globalBlend": 0.28
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2651,
    "diana": 0.1452,
    "nova": 0.2781,
    "flow": 0.3116
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 44.3,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 89.6,
     "adjustedAcc": 65.5,
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
     "acc": 58.4,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 465,
   "globalBlend": 0.632
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2888,
    "diana": 0.1127,
    "nova": 0.2943,
    "flow": 0.3042
   },
   "acc": {
    "taro": {
     "n": 517,
     "acc": 53.4,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 240,
     "acc": 46.7,
     "adjustedAcc": 47.8,
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
    "taro": 0.2752,
    "diana": 0.1381,
    "nova": 0.2685,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 311,
     "acc": 48.9,
     "adjustedAcc": 49.2,
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
     "n": 207,
     "acc": 43.0,
     "adjustedAcc": 45.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 28,
     "acc": 75.0,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 664,
   "globalBlend": 0.546
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1304,
    "nova": 0.3099,
    "flow": 0.2835
   },
   "acc": {
    "taro": {
     "n": 339,
     "acc": 51.0,
     "adjustedAcc": 50.8,
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
    "taro": 0.2619,
    "diana": 0.1157,
    "nova": 0.308,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 351,
     "acc": 38.7,
     "adjustedAcc": 41.6,
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
   "graded": 808,
   "globalBlend": 0.498
  },
  "기계": {
   "weights": {
    "taro": 0.2628,
    "diana": 0.1299,
    "nova": 0.2949,
    "flow": 0.3124
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
    "taro": 0.2916,
    "diana": 0.1024,
    "nova": 0.3209,
    "flow": 0.285
   },
   "acc": {
    "taro": {
     "n": 262,
     "acc": 56.9,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 118,
     "acc": 23.7,
     "adjustedAcc": 37.0,
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
     "n": 62,
     "acc": 43.5,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 655,
   "globalBlend": 0.55
  },
  "식음료": {
   "weights": {
    "taro": 0.2624,
    "diana": 0.1689,
    "nova": 0.2694,
    "flow": 0.2992
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 44.2,
     "adjustedAcc": 45.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 150,
     "acc": 89.3,
     "adjustedAcc": 71.9,
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
   "graded": 677,
   "globalBlend": 0.542
  },
  "여행레저": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.1166,
    "nova": 0.2994,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 53.4,
     "adjustedAcc": 51.9,
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
   "graded": 354,
   "globalBlend": 0.693
  }
 }
};
