// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 11:15",
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
   "taro": 0.2828,
   "diana": 0.1208,
   "nova": 0.2924,
   "flow": 0.304
  },
  "acc": {
   "taro": {
    "n": 10755,
    "acc": 53.2,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4318,
    "acc": 55.5,
    "adjustedAcc": 55.3,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9008,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1964,
    "acc": 55.9,
    "adjustedAcc": 55.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26045,
  "team": {
   "hit": 7173,
   "miss": 6807,
   "n": 13980,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2821,
    "diana": 0.0982,
    "nova": 0.2659,
    "flow": 0.3538
   },
   "acc": {
    "taro": {
     "n": 1292,
     "acc": 51.9,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 386,
     "acc": 42.7,
     "adjustedAcc": 44.5,
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
   "graded": 3199,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3033,
    "diana": 0.112,
    "nova": 0.2856,
    "flow": 0.2992
   },
   "acc": {
    "taro": {
     "n": 620,
     "acc": 59.5,
     "adjustedAcc": 58.0,
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
     "acc": 60.0,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1519,
   "globalBlend": 0.345
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.1313,
    "nova": 0.3122,
    "flow": 0.2907
   },
   "acc": {
    "taro": {
     "n": 538,
     "acc": 45.4,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 228,
     "acc": 59.2,
     "adjustedAcc": 56.0,
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
     "n": 118,
     "acc": 49.2,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1369,
   "globalBlend": 0.369
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.303,
    "diana": 0.1138,
    "nova": 0.3108,
    "flow": 0.2724
   },
   "acc": {
    "taro": {
     "n": 408,
     "acc": 54.4,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 192,
     "acc": 46.9,
     "adjustedAcc": 48.1,
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
   "graded": 1045,
   "globalBlend": 0.434
  },
  "통신": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.117,
    "nova": 0.2951,
    "flow": 0.3067
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
    "taro": 0.2871,
    "diana": 0.1536,
    "nova": 0.2687,
    "flow": 0.2906
   },
   "acc": {
    "taro": {
     "n": 500,
     "acc": 54.4,
     "adjustedAcc": 53.5,
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
    "taro": 0.2912,
    "diana": 0.1023,
    "nova": 0.3187,
    "flow": 0.2878
   },
   "acc": {
    "taro": {
     "n": 593,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
    "taro": 0.3194,
    "diana": 0.107,
    "nova": 0.3174,
    "flow": 0.2562
   },
   "acc": {
    "taro": {
     "n": 564,
     "acc": 64.9,
     "adjustedAcc": 62.3,
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
   "graded": 1230,
   "globalBlend": 0.394
  },
  "보험": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.137,
    "nova": 0.2869,
    "flow": 0.2949
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 50.2,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 90,
     "acc": 80.0,
     "adjustedAcc": 62.9,
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
    "taro": 0.2966,
    "diana": 0.1163,
    "nova": 0.2924,
    "flow": 0.2947
   },
   "acc": {
    "taro": {
     "n": 1406,
     "acc": 57.7,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 538,
     "acc": 56.7,
     "adjustedAcc": 55.5,
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
     "n": 180,
     "acc": 60.0,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3314,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1282,
    "nova": 0.319,
    "flow": 0.2733
   },
   "acc": {
    "taro": {
     "n": 615,
     "acc": 50.4,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 304,
     "acc": 58.6,
     "adjustedAcc": 56.1,
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
     "acc": 42.9,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1492,
   "globalBlend": 0.349
  },
  "조선": {
   "weights": {
    "taro": 0.2722,
    "diana": 0.1302,
    "nova": 0.2971,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 348,
     "acc": 46.3,
     "adjustedAcc": 47.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 156,
     "acc": 61.5,
     "adjustedAcc": 56.5,
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
   "graded": 881,
   "globalBlend": 0.476
  },
  "방산": {
   "weights": {
    "taro": 0.2808,
    "diana": 0.1175,
    "nova": 0.2936,
    "flow": 0.3081
   },
   "acc": {
    "taro": {
     "n": 157,
     "acc": 47.1,
     "adjustedAcc": 48.4,
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
   "graded": 324,
   "globalBlend": 0.712
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2943,
    "diana": 0.1401,
    "nova": 0.279,
    "flow": 0.2865
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 58.7,
     "adjustedAcc": 55.6,
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
   "graded": 537,
   "globalBlend": 0.598
  },
  "화학·소재": {
   "weights": {
    "taro": 0.286,
    "diana": 0.1159,
    "nova": 0.2959,
    "flow": 0.3022
   },
   "acc": {
    "taro": {
     "n": 777,
     "acc": 55.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 381,
     "acc": 55.4,
     "adjustedAcc": 54.1,
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
     "n": 96,
     "acc": 63.5,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1929,
   "globalBlend": 0.293
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1393,
    "nova": 0.2766,
    "flow": 0.3097
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
    "taro": 0.2959,
    "diana": 0.1105,
    "nova": 0.2905,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 474,
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
   "graded": 1060,
   "globalBlend": 0.43
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2851,
    "diana": 0.1316,
    "nova": 0.2685,
    "flow": 0.3148
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 50.2,
     "adjustedAcc": 50.1,
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
   "graded": 617,
   "globalBlend": 0.565
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2905,
    "diana": 0.1222,
    "nova": 0.3052,
    "flow": 0.2821
   },
   "acc": {
    "taro": {
     "n": 316,
     "acc": 54.4,
     "adjustedAcc": 53.2,
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
     "n": 116,
     "acc": 47.4,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 815,
   "globalBlend": 0.495
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.1129,
    "nova": 0.305,
    "flow": 0.3108
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
     "n": 157,
     "acc": 36.9,
     "adjustedAcc": 42.6,
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
   "graded": 750,
   "globalBlend": 0.516
  },
  "기계": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1253,
    "nova": 0.292,
    "flow": 0.3089
   },
   "acc": {
    "taro": {
     "n": 104,
     "acc": 38.5,
     "adjustedAcc": 44.6,
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
   "graded": 258,
   "globalBlend": 0.756
  },
  "로봇": {
   "weights": {
    "taro": 0.3071,
    "diana": 0.1021,
    "nova": 0.3133,
    "flow": 0.2775
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
    "taro": 0.2733,
    "diana": 0.1602,
    "nova": 0.2685,
    "flow": 0.2979
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 45.6,
     "adjustedAcc": 46.9,
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
    "taro": 0.2958,
    "diana": 0.1127,
    "nova": 0.2948,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 136,
     "acc": 55.9,
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
     "n": 110,
     "acc": 55.5,
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
   "graded": 332,
   "globalBlend": 0.707
  }
 }
};
