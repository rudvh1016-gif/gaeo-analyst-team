// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-19 15:55",
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
   "taro": 0.2746,
   "diana": 0.1233,
   "nova": 0.2957,
   "flow": 0.3065
  },
  "acc": {
   "taro": {
    "n": 11147,
    "acc": 51.8,
    "adjustedAcc": 51.8,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4622,
    "acc": 55.8,
    "adjustedAcc": 55.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9013,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2031,
    "acc": 55.8,
    "adjustedAcc": 55.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26813,
  "team": {
   "hit": 7418,
   "miss": 7048,
   "n": 14466,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2784,
    "diana": 0.0994,
    "nova": 0.2689,
    "flow": 0.3533
   },
   "acc": {
    "taro": {
     "n": 1326,
     "acc": 51.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 407,
     "acc": 42.8,
     "adjustedAcc": 44.4,
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
   "graded": 3263,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2989,
    "diana": 0.1135,
    "nova": 0.2875,
    "flow": 0.3002
   },
   "acc": {
    "taro": {
     "n": 636,
     "acc": 59.0,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 188,
     "acc": 54.8,
     "adjustedAcc": 52.9,
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
     "n": 191,
     "acc": 59.7,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1553,
   "globalBlend": 0.34
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2572,
    "diana": 0.1339,
    "nova": 0.3126,
    "flow": 0.2964
   },
   "acc": {
    "taro": {
     "n": 554,
     "acc": 44.2,
     "adjustedAcc": 45.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 248,
     "acc": 60.1,
     "adjustedAcc": 56.8,
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
     "n": 123,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1410,
   "globalBlend": 0.362
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2962,
    "diana": 0.1174,
    "nova": 0.3145,
    "flow": 0.2719
   },
   "acc": {
    "taro": {
     "n": 424,
     "acc": 53.1,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 206,
     "acc": 48.5,
     "adjustedAcc": 49.1,
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
     "n": 98,
     "acc": 37.8,
     "adjustedAcc": 44.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1078,
   "globalBlend": 0.426
  },
  "통신": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.1185,
    "nova": 0.2973,
    "flow": 0.3115
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
    "taro": 0.2785,
    "diana": 0.157,
    "nova": 0.2727,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 518,
     "acc": 52.3,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 232,
     "acc": 76.3,
     "adjustedAcc": 67.3,
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
   "graded": 1240,
   "globalBlend": 0.392
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2833,
    "diana": 0.1032,
    "nova": 0.3221,
    "flow": 0.2914
   },
   "acc": {
    "taro": {
     "n": 611,
     "acc": 48.3,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 298,
     "acc": 37.9,
     "adjustedAcc": 41.4,
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
   "graded": 1547,
   "globalBlend": 0.341
  },
  "2차전지": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.1088,
    "nova": 0.3228,
    "flow": 0.2622
   },
   "acc": {
    "taro": {
     "n": 587,
     "acc": 62.0,
     "adjustedAcc": 60.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 180,
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
   "graded": 1267,
   "globalBlend": 0.387
  },
  "보험": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1399,
    "nova": 0.2876,
    "flow": 0.295
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
    "taro": 0.2848,
    "diana": 0.1187,
    "nova": 0.2965,
    "flow": 0.3
   },
   "acc": {
    "taro": {
     "n": 1456,
     "acc": 55.5,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 576,
     "acc": 56.8,
     "adjustedAcc": 55.6,
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
     "n": 188,
     "acc": 60.1,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3411,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.1273,
    "nova": 0.3201,
    "flow": 0.2781
   },
   "acc": {
    "taro": {
     "n": 640,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 327,
     "acc": 57.5,
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
     "n": 59,
     "acc": 45.8,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1543,
   "globalBlend": 0.341
  },
  "조선": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.1333,
    "nova": 0.3003,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 355,
     "acc": 45.1,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 166,
     "acc": 62.0,
     "adjustedAcc": 57.0,
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
   "graded": 900,
   "globalBlend": 0.471
  },
  "방산": {
   "weights": {
    "taro": 0.2751,
    "diana": 0.119,
    "nova": 0.2955,
    "flow": 0.3105
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 47.6,
     "adjustedAcc": 48.6,
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
     "n": 9,
     "acc": 100.0,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 334,
   "globalBlend": 0.705
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2847,
    "diana": 0.1459,
    "nova": 0.2826,
    "flow": 0.2869
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
     "n": 131,
     "acc": 82.4,
     "adjustedAcc": 66.9,
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
   "graded": 558,
   "globalBlend": 0.589
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2768,
    "diana": 0.1187,
    "nova": 0.2989,
    "flow": 0.3056
   },
   "acc": {
    "taro": {
     "n": 808,
     "acc": 53.5,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 410,
     "acc": 56.1,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 676,
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
   "graded": 1993,
   "globalBlend": 0.286
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2678,
    "diana": 0.1425,
    "nova": 0.2782,
    "flow": 0.3116
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
     "n": 73,
     "acc": 89.0,
     "adjustedAcc": 64.8,
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
   "graded": 453,
   "globalBlend": 0.638
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2914,
    "diana": 0.1117,
    "nova": 0.2935,
    "flow": 0.3034
   },
   "acc": {
    "taro": {
     "n": 498,
     "acc": 53.8,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 224,
     "acc": 46.4,
     "adjustedAcc": 47.7,
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
    "taro": 0.2807,
    "diana": 0.1344,
    "nova": 0.27,
    "flow": 0.315
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
     "n": 109,
     "acc": 67.9,
     "adjustedAcc": 58.5,
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
   "graded": 638,
   "globalBlend": 0.556
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.1269,
    "nova": 0.3099,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 52.1,
     "adjustedAcc": 51.6,
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
     "n": 119,
     "acc": 45.4,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 839,
   "globalBlend": 0.488
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2644,
    "diana": 0.1142,
    "nova": 0.3081,
    "flow": 0.3133
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 38.4,
     "adjustedAcc": 41.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 167,
     "acc": 37.1,
     "adjustedAcc": 42.5,
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
    "taro": 0.2666,
    "diana": 0.128,
    "nova": 0.2941,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 38.2,
     "adjustedAcc": 44.3,
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
   "graded": 268,
   "globalBlend": 0.749
  },
  "로봇": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.1026,
    "nova": 0.3191,
    "flow": 0.2831
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 57.9,
     "adjustedAcc": 55.3,
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
     "n": 59,
     "acc": 42.4,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 637,
   "globalBlend": 0.557
  },
  "식음료": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.1644,
    "nova": 0.2702,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 298,
     "acc": 44.3,
     "adjustedAcc": 45.9,
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
    "taro": 0.2887,
    "diana": 0.1149,
    "nova": 0.298,
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
     "acc": 23.4,
     "adjustedAcc": 42.5,
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
