// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 14:28",
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
   "taro": 0.2803,
   "diana": 0.1204,
   "nova": 0.2929,
   "flow": 0.3064
  },
  "acc": {
   "taro": {
    "n": 10768,
    "acc": 52.8,
    "adjustedAcc": 52.8,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4308,
    "acc": 55.3,
    "adjustedAcc": 55.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9009,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1965,
    "acc": 56.1,
    "adjustedAcc": 55.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26050,
  "team": {
   "hit": 7177,
   "miss": 6806,
   "n": 13983,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.0978,
    "nova": 0.2666,
    "flow": 0.3543
   },
   "acc": {
    "taro": {
     "n": 1294,
     "acc": 51.8,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 386,
     "acc": 42.5,
     "adjustedAcc": 44.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1117,
     "acc": 51.1,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 405,
     "acc": 64.0,
     "adjustedAcc": 60.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3202,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3024,
    "diana": 0.1115,
    "nova": 0.285,
    "flow": 0.3011
   },
   "acc": {
    "taro": {
     "n": 620,
     "acc": 59.7,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 176,
     "acc": 54.5,
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
     "n": 185,
     "acc": 60.5,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1519,
   "globalBlend": 0.345
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2616,
    "diana": 0.1314,
    "nova": 0.3121,
    "flow": 0.2949
   },
   "acc": {
    "taro": {
     "n": 534,
     "acc": 44.6,
     "adjustedAcc": 45.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 229,
     "acc": 59.4,
     "adjustedAcc": 56.2,
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
     "n": 117,
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1365,
   "globalBlend": 0.37
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3012,
    "diana": 0.1138,
    "nova": 0.3124,
    "flow": 0.2726
   },
   "acc": {
    "taro": {
     "n": 408,
     "acc": 53.9,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 191,
     "acc": 46.6,
     "adjustedAcc": 47.9,
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
     "n": 95,
     "acc": 37.9,
     "adjustedAcc": 44.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1044,
   "globalBlend": 0.434
  },
  "통신": {
   "weights": {
    "taro": 0.2792,
    "diana": 0.1164,
    "nova": 0.2954,
    "flow": 0.3091
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 51.6,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 51.8,
     "adjustedAcc": 50.6,
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
     "n": 78,
     "acc": 62.8,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 478,
   "globalBlend": 0.626
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2853,
    "diana": 0.1532,
    "nova": 0.2694,
    "flow": 0.2921
   },
   "acc": {
    "taro": {
     "n": 499,
     "acc": 54.1,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 215,
     "acc": 76.7,
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
     "n": 74,
     "acc": 56.8,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1202,
   "globalBlend": 0.4
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2898,
    "diana": 0.1022,
    "nova": 0.3191,
    "flow": 0.2889
   },
   "acc": {
    "taro": {
     "n": 593,
     "acc": 49.6,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 284,
     "acc": 38.0,
     "adjustedAcc": 41.6,
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
     "n": 164,
     "acc": 46.3,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1512,
   "globalBlend": 0.346
  },
  "2차전지": {
   "weights": {
    "taro": 0.3155,
    "diana": 0.1068,
    "nova": 0.3185,
    "flow": 0.2592
   },
   "acc": {
    "taro": {
     "n": 566,
     "acc": 64.1,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 167,
     "acc": 51.5,
     "adjustedAcc": 50.9,
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
     "n": 20,
     "acc": 40.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1230,
   "globalBlend": 0.394
  },
  "보험": {
   "weights": {
    "taro": 0.28,
    "diana": 0.137,
    "nova": 0.287,
    "flow": 0.2961
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 50.5,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 91,
     "acc": 80.2,
     "adjustedAcc": 63.0,
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
   "graded": 495,
   "globalBlend": 0.618
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2926,
    "diana": 0.1163,
    "nova": 0.2918,
    "flow": 0.2993
   },
   "acc": {
    "taro": {
     "n": 1406,
     "acc": 57.3,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 538,
     "acc": 56.9,
     "adjustedAcc": 55.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1190,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 178,
     "acc": 61.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3312,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1273,
    "nova": 0.3186,
    "flow": 0.2766
   },
   "acc": {
    "taro": {
     "n": 617,
     "acc": 50.2,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 302,
     "acc": 58.3,
     "adjustedAcc": 55.9,
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
     "n": 56,
     "acc": 44.6,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1492,
   "globalBlend": 0.349
  },
  "조선": {
   "weights": {
    "taro": 0.2706,
    "diana": 0.1295,
    "nova": 0.2984,
    "flow": 0.3014
   },
   "acc": {
    "taro": {
     "n": 347,
     "acc": 45.8,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 153,
     "acc": 60.8,
     "adjustedAcc": 56.0,
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
     "n": 62,
     "acc": 53.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 878,
   "globalBlend": 0.477
  },
  "방산": {
   "weights": {
    "taro": 0.2784,
    "diana": 0.1173,
    "nova": 0.2942,
    "flow": 0.3101
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 46.5,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 34,
     "acc": 41.2,
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
     "n": 8,
     "acc": 100.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 326,
   "globalBlend": 0.71
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2916,
    "diana": 0.1402,
    "nova": 0.2798,
    "flow": 0.2884
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 57.9,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 81.1,
     "adjustedAcc": 65.7,
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
     "n": 3,
     "acc": 33.3,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 538,
   "globalBlend": 0.598
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2831,
    "diana": 0.1153,
    "nova": 0.2967,
    "flow": 0.3049
   },
   "acc": {
    "taro": {
     "n": 779,
     "acc": 54.6,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 380,
     "acc": 55.0,
     "adjustedAcc": 53.8,
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
     "n": 97,
     "acc": 63.9,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1931,
   "globalBlend": 0.293
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.1391,
    "nova": 0.277,
    "flow": 0.3112
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 44.7,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 69,
     "acc": 88.4,
     "adjustedAcc": 64.0,
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
     "n": 106,
     "acc": 58.5,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 442,
   "globalBlend": 0.644
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2947,
    "diana": 0.1103,
    "nova": 0.2908,
    "flow": 0.3042
   },
   "acc": {
    "taro": {
     "n": 478,
     "acc": 54.4,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 207,
     "acc": 46.4,
     "adjustedAcc": 47.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 358,
     "acc": 55.3,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 21,
     "acc": 71.4,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1064,
   "globalBlend": 0.429
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2842,
    "diana": 0.1307,
    "nova": 0.2688,
    "flow": 0.3163
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 99,
     "acc": 66.7,
     "adjustedAcc": 57.5,
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
     "n": 23,
     "acc": 78.3,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 616,
   "globalBlend": 0.565
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.1225,
    "nova": 0.3075,
    "flow": 0.2825
   },
   "acc": {
    "taro": {
     "n": 315,
     "acc": 53.3,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 129,
     "acc": 58.1,
     "adjustedAcc": 54.2,
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
     "n": 117,
     "acc": 46.2,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 814,
   "globalBlend": 0.496
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2701,
    "diana": 0.1124,
    "nova": 0.3054,
    "flow": 0.3121
   },
   "acc": {
    "taro": {
     "n": 319,
     "acc": 39.5,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 156,
     "acc": 36.5,
     "adjustedAcc": 42.4,
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
   "graded": 749,
   "globalBlend": 0.516
  },
  "기계": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.1252,
    "nova": 0.2926,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 37.7,
     "adjustedAcc": 44.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 47,
     "acc": 72.3,
     "adjustedAcc": 56.3,
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
     "n": 10,
     "acc": 100.0,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 260,
   "globalBlend": 0.755
  },
  "로봇": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1021,
    "nova": 0.3148,
    "flow": 0.2816
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 59.9,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 103,
     "acc": 27.2,
     "adjustedAcc": 39.5,
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
     "n": 57,
     "acc": 42.1,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 620,
   "globalBlend": 0.563
  },
  "식음료": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.1602,
    "nova": 0.269,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 45.2,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 129,
     "acc": 89.1,
     "adjustedAcc": 70.3,
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
   "graded": 625,
   "globalBlend": 0.561
  },
  "여행레저": {
   "weights": {
    "taro": 0.2943,
    "diana": 0.1123,
    "nova": 0.2954,
    "flow": 0.298
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 56.1,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 20.0,
     "adjustedAcc": 41.8,
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
     "n": 41,
     "acc": 41.5,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 336,
   "globalBlend": 0.704
  }
 }
};
