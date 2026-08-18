// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 09:16",
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
   "taro": 0.2822,
   "diana": 0.1212,
   "nova": 0.2918,
   "flow": 0.3048
  },
  "acc": {
   "taro": {
    "n": 10758,
    "acc": 53.2,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4319,
    "acc": 55.7,
    "adjustedAcc": 55.5,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9009,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1957,
    "acc": 56.1,
    "adjustedAcc": 55.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26043,
  "team": {
   "hit": 7189,
   "miss": 6795,
   "n": 13984,
   "acc": 51.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.282,
    "diana": 0.0981,
    "nova": 0.2658,
    "flow": 0.3541
   },
   "acc": {
    "taro": {
     "n": 1290,
     "acc": 51.9,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 382,
     "acc": 42.7,
     "adjustedAcc": 44.4,
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
     "n": 404,
     "acc": 64.1,
     "adjustedAcc": 60.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3193,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.112,
    "nova": 0.2853,
    "flow": 0.3004
   },
   "acc": {
    "taro": {
     "n": 618,
     "acc": 59.4,
     "adjustedAcc": 57.9,
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
     "n": 184,
     "acc": 60.3,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1516,
   "globalBlend": 0.345
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2645,
    "diana": 0.132,
    "nova": 0.3116,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 536,
     "acc": 45.1,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 228,
     "acc": 59.6,
     "adjustedAcc": 56.3,
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
     "acc": 49.6,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1366,
   "globalBlend": 0.369
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.1145,
    "nova": 0.3102,
    "flow": 0.2725
   },
   "acc": {
    "taro": {
     "n": 409,
     "acc": 54.5,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 190,
     "acc": 47.4,
     "adjustedAcc": 48.4,
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
     "acc": 38.9,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1044,
   "globalBlend": 0.434
  },
  "통신": {
   "weights": {
    "taro": 0.2809,
    "diana": 0.1172,
    "nova": 0.2947,
    "flow": 0.3072
   },
   "acc": {
    "taro": {
     "n": 189,
     "acc": 51.9,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 57,
     "acc": 52.6,
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
     "n": 77,
     "acc": 62.3,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 477,
   "globalBlend": 0.626
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.288,
    "diana": 0.1535,
    "nova": 0.2681,
    "flow": 0.2905
   },
   "acc": {
    "taro": {
     "n": 498,
     "acc": 54.8,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 214,
     "acc": 77.1,
     "adjustedAcc": 67.4,
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
     "n": 72,
     "acc": 56.9,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1198,
   "globalBlend": 0.4
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2918,
    "diana": 0.1028,
    "nova": 0.3184,
    "flow": 0.287
   },
   "acc": {
    "taro": {
     "n": 597,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 284,
     "acc": 38.4,
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
     "n": 163,
     "acc": 46.0,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1515,
   "globalBlend": 0.346
  },
  "2차전지": {
   "weights": {
    "taro": 0.3195,
    "diana": 0.1071,
    "nova": 0.317,
    "flow": 0.2564
   },
   "acc": {
    "taro": {
     "n": 563,
     "acc": 65.0,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 168,
     "acc": 51.8,
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
     "n": 21,
     "acc": 38.1,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1229,
   "globalBlend": 0.394
  },
  "보험": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.1369,
    "nova": 0.2865,
    "flow": 0.2953
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 50.5,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 89,
     "acc": 79.8,
     "adjustedAcc": 62.7,
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
    "taro": 0.2944,
    "diana": 0.1166,
    "nova": 0.2913,
    "flow": 0.2977
   },
   "acc": {
    "taro": {
     "n": 1403,
     "acc": 57.5,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 541,
     "acc": 56.9,
     "adjustedAcc": 55.7,
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
     "n": 177,
     "acc": 61.0,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3311,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1286,
    "nova": 0.3172,
    "flow": 0.2752
   },
   "acc": {
    "taro": {
     "n": 618,
     "acc": 50.6,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 305,
     "acc": 59.0,
     "adjustedAcc": 56.5,
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
   "graded": 1496,
   "globalBlend": 0.348
  },
  "조선": {
   "weights": {
    "taro": 0.271,
    "diana": 0.1303,
    "nova": 0.2973,
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
     "n": 155,
     "acc": 61.3,
     "adjustedAcc": 56.4,
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
     "n": 61,
     "acc": 54.1,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 879,
   "globalBlend": 0.476
  },
  "방산": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1178,
    "nova": 0.2933,
    "flow": 0.3088
   },
   "acc": {
    "taro": {
     "n": 158,
     "acc": 46.8,
     "adjustedAcc": 48.2,
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
   "graded": 325,
   "globalBlend": 0.711
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2939,
    "diana": 0.1404,
    "nova": 0.2787,
    "flow": 0.287
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 58.6,
     "adjustedAcc": 55.5,
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
   "graded": 539,
   "globalBlend": 0.597
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.1159,
    "nova": 0.2962,
    "flow": 0.3042
   },
   "acc": {
    "taro": {
     "n": 780,
     "acc": 54.6,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 380,
     "acc": 55.3,
     "adjustedAcc": 54.0,
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
   "graded": 1932,
   "globalBlend": 0.293
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1398,
    "nova": 0.2766,
    "flow": 0.3098
   },
   "acc": {
    "taro": {
     "n": 158,
     "acc": 44.3,
     "adjustedAcc": 46.8,
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
     "n": 105,
     "acc": 58.1,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 440,
   "globalBlend": 0.645
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.1106,
    "nova": 0.2903,
    "flow": 0.3035
   },
   "acc": {
    "taro": {
     "n": 476,
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
   "graded": 1062,
   "globalBlend": 0.43
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2844,
    "diana": 0.1319,
    "nova": 0.2682,
    "flow": 0.3155
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 101,
     "acc": 67.3,
     "adjustedAcc": 57.9,
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
   "graded": 618,
   "globalBlend": 0.564
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2907,
    "diana": 0.1222,
    "nova": 0.3043,
    "flow": 0.2828
   },
   "acc": {
    "taro": {
     "n": 316,
     "acc": 54.7,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 130,
     "acc": 58.5,
     "adjustedAcc": 54.4,
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
     "acc": 47.9,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 816,
   "globalBlend": 0.495
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2715,
    "diana": 0.1133,
    "nova": 0.3044,
    "flow": 0.3108
   },
   "acc": {
    "taro": {
     "n": 317,
     "acc": 39.7,
     "adjustedAcc": 42.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 158,
     "acc": 37.3,
     "adjustedAcc": 42.8,
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
    "taro": 0.2737,
    "diana": 0.1262,
    "nova": 0.292,
    "flow": 0.3082
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 38.7,
     "adjustedAcc": 44.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 72.9,
     "adjustedAcc": 56.5,
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
     "acc": 90.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 261,
   "globalBlend": 0.754
  },
  "로봇": {
   "weights": {
    "taro": 0.3068,
    "diana": 0.1023,
    "nova": 0.313,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 248,
     "acc": 61.7,
     "adjustedAcc": 57.9,
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
     "acc": 40.4,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 621,
   "globalBlend": 0.563
  },
  "식음료": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.1611,
    "nova": 0.2673,
    "flow": 0.2974
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 46.4,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 133,
     "acc": 89.5,
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
   "graded": 626,
   "globalBlend": 0.561
  },
  "여행레저": {
   "weights": {
    "taro": 0.2956,
    "diana": 0.113,
    "nova": 0.294,
    "flow": 0.2974
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 55.8,
     "adjustedAcc": 53.1,
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
     "acc": 55.0,
     "adjustedAcc": 52.4,
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
   "graded": 335,
   "globalBlend": 0.705
  }
 }
};
