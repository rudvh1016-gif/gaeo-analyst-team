// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 12:15",
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
   "taro": 0.281,
   "diana": 0.1208,
   "nova": 0.2928,
   "flow": 0.3054
  },
  "acc": {
   "taro": {
    "n": 10759,
    "acc": 52.9,
    "adjustedAcc": 52.9,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4314,
    "acc": 55.4,
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
    "n": 1962,
    "acc": 56.0,
    "adjustedAcc": 55.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26043,
  "team": {
   "hit": 7185,
   "miss": 6798,
   "n": 13983,
   "acc": 51.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.0979,
    "nova": 0.2663,
    "flow": 0.3546
   },
   "acc": {
    "taro": {
     "n": 1293,
     "acc": 51.8,
     "adjustedAcc": 51.7,
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
     "n": 404,
     "acc": 64.1,
     "adjustedAcc": 60.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3200,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3018,
    "diana": 0.1117,
    "nova": 0.2852,
    "flow": 0.3012
   },
   "acc": {
    "taro": {
     "n": 617,
     "acc": 59.5,
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
     "n": 183,
     "acc": 60.7,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1514,
   "globalBlend": 0.346
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2635,
    "diana": 0.1316,
    "nova": 0.3124,
    "flow": 0.2925
   },
   "acc": {
    "taro": {
     "n": 534,
     "acc": 44.9,
     "adjustedAcc": 45.9,
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
     "acc": 49.6,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1365,
   "globalBlend": 0.37
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3021,
    "diana": 0.114,
    "nova": 0.3114,
    "flow": 0.2725
   },
   "acc": {
    "taro": {
     "n": 409,
     "acc": 54.3,
     "adjustedAcc": 53.3,
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
     "n": 96,
     "acc": 38.5,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1047,
   "globalBlend": 0.433
  },
  "통신": {
   "weights": {
    "taro": 0.2796,
    "diana": 0.1166,
    "nova": 0.2953,
    "flow": 0.3084
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
    "taro": 0.2859,
    "diana": 0.1535,
    "nova": 0.2692,
    "flow": 0.2914
   },
   "acc": {
    "taro": {
     "n": 498,
     "acc": 54.2,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 213,
     "acc": 77.0,
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
     "n": 74,
     "acc": 56.8,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1199,
   "globalBlend": 0.4
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2898,
    "diana": 0.1024,
    "nova": 0.3192,
    "flow": 0.2887
   },
   "acc": {
    "taro": {
     "n": 594,
     "acc": 49.5,
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
   "graded": 1513,
   "globalBlend": 0.346
  },
  "2차전지": {
   "weights": {
    "taro": 0.3161,
    "diana": 0.1073,
    "nova": 0.319,
    "flow": 0.2576
   },
   "acc": {
    "taro": {
     "n": 568,
     "acc": 64.1,
     "adjustedAcc": 61.6,
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
   "graded": 1234,
   "globalBlend": 0.393
  },
  "보험": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.137,
    "nova": 0.2871,
    "flow": 0.2957
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
    "taro": 0.2946,
    "diana": 0.1165,
    "nova": 0.292,
    "flow": 0.297
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
     "acc": 60.7,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3309,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2779,
    "diana": 0.1282,
    "nova": 0.3189,
    "flow": 0.275
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
     "n": 55,
     "acc": 43.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1493,
   "globalBlend": 0.349
  },
  "조선": {
   "weights": {
    "taro": 0.2707,
    "diana": 0.1303,
    "nova": 0.2982,
    "flow": 0.3008
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
     "n": 62,
     "acc": 53.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 880,
   "globalBlend": 0.476
  },
  "방산": {
   "weights": {
    "taro": 0.2789,
    "diana": 0.1176,
    "nova": 0.2941,
    "flow": 0.3094
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
    "taro": 0.2924,
    "diana": 0.1404,
    "nova": 0.2796,
    "flow": 0.2876
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 58.1,
     "adjustedAcc": 55.2,
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
    "taro": 0.2833,
    "diana": 0.1158,
    "nova": 0.2965,
    "flow": 0.3043
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
    "taro": 0.2732,
    "diana": 0.1393,
    "nova": 0.2769,
    "flow": 0.3106
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
    "taro": 0.295,
    "diana": 0.1105,
    "nova": 0.2907,
    "flow": 0.3038
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
    "taro": 0.284,
    "diana": 0.1316,
    "nova": 0.2687,
    "flow": 0.3156
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
    "taro": 0.2885,
    "diana": 0.1228,
    "nova": 0.307,
    "flow": 0.2816
   },
   "acc": {
    "taro": {
     "n": 317,
     "acc": 53.6,
     "adjustedAcc": 52.6,
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
     "acc": 46.2,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 817,
   "globalBlend": 0.495
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2705,
    "diana": 0.1126,
    "nova": 0.3053,
    "flow": 0.3116
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
    "taro": 0.2724,
    "diana": 0.1253,
    "nova": 0.2923,
    "flow": 0.3099
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
    "taro": 0.3035,
    "diana": 0.1023,
    "nova": 0.3142,
    "flow": 0.2799
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 60.7,
     "adjustedAcc": 57.1,
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
     "n": 56,
     "acc": 41.1,
     "adjustedAcc": 47.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 616,
   "globalBlend": 0.565
  },
  "식음료": {
   "weights": {
    "taro": 0.2717,
    "diana": 0.1604,
    "nova": 0.2689,
    "flow": 0.299
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
    "taro": 0.2949,
    "diana": 0.1126,
    "nova": 0.2949,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 56.2,
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
   "graded": 333,
   "globalBlend": 0.706
  }
 }
};
