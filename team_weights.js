// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-19 10:41",
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
   "taro": 0.2752,
   "diana": 0.1239,
   "nova": 0.2956,
   "flow": 0.3054
  },
  "acc": {
   "taro": {
    "n": 11150,
    "acc": 51.9,
    "adjustedAcc": 51.9,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4620,
    "acc": 56.0,
    "adjustedAcc": 55.8,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9013,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2036,
    "acc": 55.6,
    "adjustedAcc": 55.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26819,
  "team": {
   "hit": 7418,
   "miss": 7047,
   "n": 14465,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1,
    "nova": 0.2685,
    "flow": 0.3529
   },
   "acc": {
    "taro": {
     "n": 1327,
     "acc": 51.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 409,
     "acc": 43.0,
     "adjustedAcc": 44.6,
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
     "n": 412,
     "acc": 63.3,
     "adjustedAcc": 60.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3267,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3004,
    "diana": 0.1147,
    "nova": 0.2873,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 638,
     "acc": 59.2,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 187,
     "acc": 55.6,
     "adjustedAcc": 53.4,
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
     "acc": 59.1,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1556,
   "globalBlend": 0.34
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2583,
    "diana": 0.1344,
    "nova": 0.3132,
    "flow": 0.2942
   },
   "acc": {
    "taro": {
     "n": 557,
     "acc": 44.3,
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
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1413,
   "globalBlend": 0.362
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2967,
    "diana": 0.118,
    "nova": 0.3147,
    "flow": 0.2706
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
     "n": 207,
     "acc": 48.8,
     "adjustedAcc": 49.2,
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
   "graded": 1076,
   "globalBlend": 0.426
  },
  "통신": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1189,
    "nova": 0.2973,
    "flow": 0.3101
   },
   "acc": {
    "taro": {
     "n": 195,
     "acc": 50.3,
     "adjustedAcc": 50.2,
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
     "n": 82,
     "acc": 63.4,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 490,
   "globalBlend": 0.62
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2796,
    "diana": 0.157,
    "nova": 0.2724,
    "flow": 0.2911
   },
   "acc": {
    "taro": {
     "n": 519,
     "acc": 52.6,
     "adjustedAcc": 52.1,
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
   "graded": 1241,
   "globalBlend": 0.392
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2841,
    "diana": 0.104,
    "nova": 0.3214,
    "flow": 0.2905
   },
   "acc": {
    "taro": {
     "n": 610,
     "acc": 48.5,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 301,
     "acc": 38.5,
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
     "n": 167,
     "acc": 46.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1549,
   "globalBlend": 0.341
  },
  "2차전지": {
   "weights": {
    "taro": 0.3071,
    "diana": 0.1087,
    "nova": 0.3226,
    "flow": 0.2617
   },
   "acc": {
    "taro": {
     "n": 587,
     "acc": 62.2,
     "adjustedAcc": 60.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 179,
     "acc": 51.4,
     "adjustedAcc": 50.8,
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
    "taro": 0.2775,
    "diana": 0.1403,
    "nova": 0.2877,
    "flow": 0.2945
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 51.2,
     "adjustedAcc": 50.7,
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
   "graded": 511,
   "globalBlend": 0.61
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2854,
    "diana": 0.119,
    "nova": 0.2968,
    "flow": 0.2988
   },
   "acc": {
    "taro": {
     "n": 1459,
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
     "n": 189,
     "acc": 59.8,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3415,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.1281,
    "nova": 0.3201,
    "flow": 0.2777
   },
   "acc": {
    "taro": {
     "n": 638,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 327,
     "acc": 57.8,
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
     "n": 59,
     "acc": 45.8,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1541,
   "globalBlend": 0.342
  },
  "조선": {
   "weights": {
    "taro": 0.266,
    "diana": 0.1337,
    "nova": 0.2996,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 45.2,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 165,
     "acc": 62.4,
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
     "n": 62,
     "acc": 53.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 899,
   "globalBlend": 0.471
  },
  "방산": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1195,
    "nova": 0.2956,
    "flow": 0.3088
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 47.9,
     "adjustedAcc": 48.8,
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
     "acc": 90.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 334,
   "globalBlend": 0.705
  },
  "철강·금속": {
   "weights": {
    "taro": 0.285,
    "diana": 0.1463,
    "nova": 0.2824,
    "flow": 0.2862
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
    "taro": 0.2773,
    "diana": 0.1191,
    "nova": 0.2985,
    "flow": 0.3052
   },
   "acc": {
    "taro": {
     "n": 805,
     "acc": 53.5,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 409,
     "acc": 56.2,
     "adjustedAcc": 54.8,
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
   "graded": 1988,
   "globalBlend": 0.287
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2687,
    "diana": 0.1429,
    "nova": 0.2775,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 44.8,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 74,
     "acc": 89.2,
     "adjustedAcc": 64.9,
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
     "n": 110,
     "acc": 59.1,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 457,
   "globalBlend": 0.636
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.291,
    "diana": 0.112,
    "nova": 0.2937,
    "flow": 0.3033
   },
   "acc": {
    "taro": {
     "n": 498,
     "acc": 53.6,
     "adjustedAcc": 52.9,
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
    "taro": 0.2812,
    "diana": 0.1351,
    "nova": 0.2697,
    "flow": 0.3141
   },
   "acc": {
    "taro": {
     "n": 302,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 108,
     "acc": 68.5,
     "adjustedAcc": 58.8,
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
    "taro": 0.2815,
    "diana": 0.1273,
    "nova": 0.3102,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 51.8,
     "adjustedAcc": 51.3,
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
     "n": 121,
     "acc": 45.5,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 841,
   "globalBlend": 0.488
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2641,
    "diana": 0.1146,
    "nova": 0.3083,
    "flow": 0.3131
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
     "n": 165,
     "acc": 37.0,
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
   "graded": 775,
   "globalBlend": 0.508
  },
  "기계": {
   "weights": {
    "taro": 0.267,
    "diana": 0.1285,
    "nova": 0.294,
    "flow": 0.3106
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
    "taro": 0.2956,
    "diana": 0.1028,
    "nova": 0.3185,
    "flow": 0.283
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 58.0,
     "adjustedAcc": 55.5,
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
     "acc": 43.3,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 639,
   "globalBlend": 0.556
  },
  "식음료": {
   "weights": {
    "taro": 0.2659,
    "diana": 0.1653,
    "nova": 0.27,
    "flow": 0.2989
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
     "n": 139,
     "acc": 89.2,
     "adjustedAcc": 71.0,
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
   "graded": 652,
   "globalBlend": 0.551
  },
  "여행레저": {
   "weights": {
    "taro": 0.2895,
    "diana": 0.115,
    "nova": 0.2978,
    "flow": 0.2977
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 54.9,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 21.7,
     "adjustedAcc": 42.2,
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
   "graded": 342,
   "globalBlend": 0.701
  }
 }
};
