// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 13:45",
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
   "taro": 0.2808,
   "diana": 0.1208,
   "nova": 0.2932,
   "flow": 0.3052
  },
  "acc": {
   "taro": {
    "n": 10773,
    "acc": 52.9,
    "adjustedAcc": 52.8,
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
    "n": 9009,
    "acc": 56.7,
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
  "graded": 26062,
  "team": {
   "hit": 7181,
   "miss": 6807,
   "n": 13988,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.0979,
    "nova": 0.2667,
    "flow": 0.354
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
    "taro": 0.3029,
    "diana": 0.1118,
    "nova": 0.2857,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 617,
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
     "n": 183,
     "acc": 60.1,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1514,
   "globalBlend": 0.346
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2629,
    "diana": 0.1317,
    "nova": 0.3127,
    "flow": 0.2926
   },
   "acc": {
    "taro": {
     "n": 534,
     "acc": 44.8,
     "adjustedAcc": 45.7,
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
    "taro": 0.3017,
    "diana": 0.1142,
    "nova": 0.3123,
    "flow": 0.2718
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
     "acc": 37.9,
     "adjustedAcc": 44.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1046,
   "globalBlend": 0.433
  },
  "통신": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1166,
    "nova": 0.2956,
    "flow": 0.3083
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
    "diana": 0.1539,
    "nova": 0.2694,
    "flow": 0.2914
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
   "graded": 1201,
   "globalBlend": 0.4
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2897,
    "diana": 0.1024,
    "nova": 0.3194,
    "flow": 0.2886
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
    "taro": 0.2799,
    "diana": 0.1373,
    "nova": 0.2873,
    "flow": 0.2955
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
    "taro": 0.294,
    "diana": 0.1166,
    "nova": 0.2923,
    "flow": 0.2972
   },
   "acc": {
    "taro": {
     "n": 1406,
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
   "graded": 3312,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.1277,
    "nova": 0.3195,
    "flow": 0.2753
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
    "taro": 0.2707,
    "diana": 0.13,
    "nova": 0.2985,
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
     "n": 154,
     "acc": 61.0,
     "adjustedAcc": 56.2,
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
    "taro": 0.2788,
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
    "taro": 0.2915,
    "diana": 0.1406,
    "nova": 0.2801,
    "flow": 0.2878
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
    "taro": 0.2833,
    "diana": 0.1156,
    "nova": 0.2967,
    "flow": 0.3044
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
     "n": 381,
     "acc": 55.1,
     "adjustedAcc": 53.9,
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
   "graded": 1933,
   "globalBlend": 0.293
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2731,
    "diana": 0.1393,
    "nova": 0.2771,
    "flow": 0.3104
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
    "taro": 0.2949,
    "diana": 0.1105,
    "nova": 0.2909,
    "flow": 0.3037
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
    "taro": 0.2845,
    "diana": 0.1309,
    "nova": 0.269,
    "flow": 0.3156
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
    "taro": 0.288,
    "diana": 0.1229,
    "nova": 0.3074,
    "flow": 0.2817
   },
   "acc": {
    "taro": {
     "n": 318,
     "acc": 53.5,
     "adjustedAcc": 52.5,
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
     "n": 119,
     "acc": 46.2,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 820,
   "globalBlend": 0.494
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2704,
    "diana": 0.1126,
    "nova": 0.3055,
    "flow": 0.3115
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
    "taro": 0.272,
    "diana": 0.1254,
    "nova": 0.2927,
    "flow": 0.3099
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
    "taro": 0.3023,
    "diana": 0.1023,
    "nova": 0.3147,
    "flow": 0.2807
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 60.2,
     "adjustedAcc": 56.8,
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
   "graded": 619,
   "globalBlend": 0.564
  },
  "식음료": {
   "weights": {
    "taro": 0.2715,
    "diana": 0.1604,
    "nova": 0.2692,
    "flow": 0.2989
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
    "taro": 0.295,
    "diana": 0.1125,
    "nova": 0.2954,
    "flow": 0.297
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 56.5,
     "adjustedAcc": 53.5,
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
   "graded": 335,
   "globalBlend": 0.705
  }
 }
};
