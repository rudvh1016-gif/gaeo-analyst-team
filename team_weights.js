// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-20 10:41",
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
   "diana": 0.1254,
   "nova": 0.2968,
   "flow": 0.3069
  },
  "acc": {
   "taro": {
    "n": 11514,
    "acc": 51.3,
    "adjustedAcc": 51.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4939,
    "acc": 56.3,
    "adjustedAcc": 56.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9023,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2098,
    "acc": 55.7,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 27574,
  "team": {
   "hit": 7712,
   "miss": 7238,
   "n": 14950,
   "acc": 51.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1001,
    "nova": 0.271,
    "flow": 0.3513
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
     "n": 434,
     "acc": 42.6,
     "adjustedAcc": 44.2,
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
     "n": 420,
     "acc": 62.6,
     "adjustedAcc": 59.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3335,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2962,
    "diana": 0.1143,
    "nova": 0.2888,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 654,
     "acc": 58.4,
     "adjustedAcc": 57.1,
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
     "acc": 59.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1587,
   "globalBlend": 0.335
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2531,
    "diana": 0.1362,
    "nova": 0.3121,
    "flow": 0.2986
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
   "graded": 1456,
   "globalBlend": 0.355
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.1192,
    "nova": 0.3159,
    "flow": 0.2715
   },
   "acc": {
    "taro": {
     "n": 437,
     "acc": 52.6,
     "adjustedAcc": 52.1,
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
   "graded": 1104,
   "globalBlend": 0.42
  },
  "통신": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.1201,
    "nova": 0.2982,
    "flow": 0.3135
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
    "taro": 0.2737,
    "diana": 0.1601,
    "nova": 0.2736,
    "flow": 0.2926
   },
   "acc": {
    "taro": {
     "n": 538,
     "acc": 51.3,
     "adjustedAcc": 51.1,
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
     "n": 76,
     "acc": 55.3,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1277,
   "globalBlend": 0.385
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.1047,
    "nova": 0.3229,
    "flow": 0.2927
   },
   "acc": {
    "taro": {
     "n": 626,
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
     "n": 170,
     "acc": 47.1,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1582,
   "globalBlend": 0.336
  },
  "2차전지": {
   "weights": {
    "taro": 0.3017,
    "diana": 0.1106,
    "nova": 0.3266,
    "flow": 0.2611
   },
   "acc": {
    "taro": {
     "n": 608,
     "acc": 60.7,
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
   "graded": 1305,
   "globalBlend": 0.38
  },
  "보험": {
   "weights": {
    "taro": 0.2753,
    "diana": 0.1421,
    "nova": 0.2869,
    "flow": 0.2957
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
     "n": 105,
     "acc": 81.0,
     "adjustedAcc": 64.4,
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
   "graded": 528,
   "globalBlend": 0.602
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.1189,
    "nova": 0.2983,
    "flow": 0.3016
   },
   "acc": {
    "taro": {
     "n": 1505,
     "acc": 54.8,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 615,
     "acc": 56.3,
     "adjustedAcc": 55.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1195,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 197,
     "acc": 59.9,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3512,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.272,
    "diana": 0.1291,
    "nova": 0.3217,
    "flow": 0.2772
   },
   "acc": {
    "taro": {
     "n": 662,
     "acc": 49.5,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 354,
     "acc": 57.6,
     "adjustedAcc": 55.7,
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
     "n": 60,
     "acc": 45.0,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1593,
   "globalBlend": 0.334
  },
  "조선": {
   "weights": {
    "taro": 0.2613,
    "diana": 0.1357,
    "nova": 0.3009,
    "flow": 0.302
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
     "acc": 62.7,
     "adjustedAcc": 57.6,
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
    "taro": 0.2721,
    "diana": 0.1206,
    "nova": 0.2958,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 47.6,
     "adjustedAcc": 48.6,
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
   "graded": 342,
   "globalBlend": 0.701
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2809,
    "diana": 0.1502,
    "nova": 0.2825,
    "flow": 0.2863
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 55.0,
     "adjustedAcc": 53.3,
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
   "graded": 576,
   "globalBlend": 0.581
  },
  "화학·소재": {
   "weights": {
    "taro": 0.274,
    "diana": 0.121,
    "nova": 0.2996,
    "flow": 0.3053
   },
   "acc": {
    "taro": {
     "n": 836,
     "acc": 53.1,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 436,
     "acc": 56.9,
     "adjustedAcc": 55.4,
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
   "graded": 2050,
   "globalBlend": 0.281
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2648,
    "diana": 0.1457,
    "nova": 0.2789,
    "flow": 0.3105
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 44.0,
     "adjustedAcc": 46.5,
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
     "n": 112,
     "acc": 58.0,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 465,
   "globalBlend": 0.632
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2887,
    "diana": 0.113,
    "nova": 0.2943,
    "flow": 0.304
   },
   "acc": {
    "taro": {
     "n": 515,
     "acc": 53.4,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 241,
     "acc": 46.9,
     "adjustedAcc": 47.9,
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
   "graded": 1137,
   "globalBlend": 0.413
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1381,
    "nova": 0.2707,
    "flow": 0.3137
   },
   "acc": {
    "taro": {
     "n": 311,
     "acc": 49.5,
     "adjustedAcc": 49.7,
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
     "n": 205,
     "acc": 43.9,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 25,
     "acc": 72.0,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 660,
   "globalBlend": 0.548
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2768,
    "diana": 0.1303,
    "nova": 0.3098,
    "flow": 0.283
   },
   "acc": {
    "taro": {
     "n": 341,
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
   "graded": 865,
   "globalBlend": 0.48
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2609,
    "diana": 0.1163,
    "nova": 0.3083,
    "flow": 0.3144
   },
   "acc": {
    "taro": {
     "n": 352,
     "acc": 38.4,
     "adjustedAcc": 41.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 181,
     "acc": 39.2,
     "adjustedAcc": 43.5,
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
   "graded": 809,
   "globalBlend": 0.497
  },
  "기계": {
   "weights": {
    "taro": 0.2628,
    "diana": 0.13,
    "nova": 0.2951,
    "flow": 0.312
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
    "taro": 0.2919,
    "diana": 0.1025,
    "nova": 0.3214,
    "flow": 0.2841
   },
   "acc": {
    "taro": {
     "n": 264,
     "acc": 56.8,
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
     "n": 63,
     "acc": 42.9,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 658,
   "globalBlend": 0.549
  },
  "식음료": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.1691,
    "nova": 0.2695,
    "flow": 0.2988
   },
   "acc": {
    "taro": {
     "n": 309,
     "acc": 44.3,
     "adjustedAcc": 45.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 151,
     "acc": 89.4,
     "adjustedAcc": 72.0,
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
    "taro": 0.2836,
    "diana": 0.1168,
    "nova": 0.3,
    "flow": 0.2995
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
     "n": 45,
     "acc": 42.2,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 353,
   "globalBlend": 0.694
  }
 }
};
