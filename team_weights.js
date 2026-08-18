// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 13:15",
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
   "taro": 0.2806,
   "diana": 0.1208,
   "nova": 0.2933,
   "flow": 0.3054
  },
  "acc": {
   "taro": {
    "n": 10771,
    "acc": 52.8,
    "adjustedAcc": 52.8,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4312,
    "acc": 55.4,
    "adjustedAcc": 55.2,
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
    "n": 1966,
    "acc": 56.0,
    "adjustedAcc": 55.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26057,
  "team": {
   "hit": 7183,
   "miss": 6804,
   "n": 13987,
   "acc": 51.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.0979,
    "nova": 0.2668,
    "flow": 0.3541
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
    "taro": 0.3025,
    "diana": 0.1118,
    "nova": 0.2855,
    "flow": 0.3002
   },
   "acc": {
    "taro": {
     "n": 619,
     "acc": 59.6,
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
     "n": 184,
     "acc": 60.3,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1517,
   "globalBlend": 0.345
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2623,
    "diana": 0.1316,
    "nova": 0.3125,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 535,
     "acc": 44.7,
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
     "n": 118,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1367,
   "globalBlend": 0.369
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1139,
    "nova": 0.3124,
    "flow": 0.272
   },
   "acc": {
    "taro": {
     "n": 409,
     "acc": 54.0,
     "adjustedAcc": 53.1,
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
   "graded": 1045,
   "globalBlend": 0.434
  },
  "통신": {
   "weights": {
    "taro": 0.2794,
    "diana": 0.1166,
    "nova": 0.2957,
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
    "taro": 0.2854,
    "diana": 0.1536,
    "nova": 0.2695,
    "flow": 0.2915
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
   "graded": 1200,
   "globalBlend": 0.4
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2894,
    "diana": 0.1022,
    "nova": 0.3196,
    "flow": 0.2889
   },
   "acc": {
    "taro": {
     "n": 593,
     "acc": 49.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 285,
     "acc": 37.9,
     "adjustedAcc": 41.5,
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
    "taro": 0.3152,
    "diana": 0.1073,
    "nova": 0.3188,
    "flow": 0.2588
   },
   "acc": {
    "taro": {
     "n": 567,
     "acc": 64.0,
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
     "n": 20,
     "acc": 40.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1232,
   "globalBlend": 0.394
  },
  "보험": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1373,
    "nova": 0.2874,
    "flow": 0.2956
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
   "graded": 496,
   "globalBlend": 0.617
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2937,
    "diana": 0.1166,
    "nova": 0.2924,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 1407,
     "acc": 57.4,
     "adjustedAcc": 56.8,
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
   "graded": 3313,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.1277,
    "nova": 0.3196,
    "flow": 0.2754
   },
   "acc": {
    "taro": {
     "n": 619,
     "acc": 50.1,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 304,
     "acc": 58.2,
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
     "n": 57,
     "acc": 43.9,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1497,
   "globalBlend": 0.348
  },
  "조선": {
   "weights": {
    "taro": 0.2702,
    "diana": 0.1303,
    "nova": 0.2986,
    "flow": 0.3009
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 45.7,
     "adjustedAcc": 46.8,
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
   "graded": 879,
   "globalBlend": 0.476
  },
  "방산": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1176,
    "nova": 0.2944,
    "flow": 0.3093
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
    "taro": 0.2914,
    "diana": 0.1406,
    "nova": 0.2802,
    "flow": 0.2879
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 57.7,
     "adjustedAcc": 54.9,
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
    "taro": 0.2832,
    "diana": 0.1158,
    "nova": 0.2966,
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
    "taro": 0.2729,
    "diana": 0.1393,
    "nova": 0.2772,
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
    "taro": 0.2948,
    "diana": 0.1105,
    "nova": 0.291,
    "flow": 0.3038
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
    "taro": 0.284,
    "diana": 0.1309,
    "nova": 0.2692,
    "flow": 0.3159
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
   "graded": 615,
   "globalBlend": 0.565
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.1228,
    "nova": 0.3081,
    "flow": 0.2815
   },
   "acc": {
    "taro": {
     "n": 316,
     "acc": 53.2,
     "adjustedAcc": 52.3,
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
     "n": 118,
     "acc": 45.8,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 816,
   "globalBlend": 0.495
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2703,
    "diana": 0.1126,
    "nova": 0.3056,
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
    "taro": 0.2718,
    "diana": 0.1254,
    "nova": 0.2928,
    "flow": 0.3101
   },
   "acc": {
    "taro": {
     "n": 105,
     "acc": 38.1,
     "adjustedAcc": 44.4,
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
   "graded": 259,
   "globalBlend": 0.755
  },
  "로봇": {
   "weights": {
    "taro": 0.3029,
    "diana": 0.1024,
    "nova": 0.3148,
    "flow": 0.28
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 60.4,
     "adjustedAcc": 57.0,
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
   "graded": 617,
   "globalBlend": 0.565
  },
  "식음료": {
   "weights": {
    "taro": 0.2714,
    "diana": 0.1604,
    "nova": 0.2692,
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
    "taro": 0.2942,
    "diana": 0.1127,
    "nova": 0.2954,
    "flow": 0.2976
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
   "graded": 334,
   "globalBlend": 0.705
  }
 }
};
