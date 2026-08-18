// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 15:27",
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
   "taro": 0.2792,
   "diana": 0.1206,
   "nova": 0.2931,
   "flow": 0.3071
  },
  "acc": {
   "taro": {
    "n": 10771,
    "acc": 52.7,
    "adjustedAcc": 52.6,
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
    "n": 1967,
    "acc": 56.2,
    "adjustedAcc": 55.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26055,
  "team": {
   "hit": 7176,
   "miss": 6809,
   "n": 13985,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.0974,
    "nova": 0.2666,
    "flow": 0.3553
   },
   "acc": {
    "taro": {
     "n": 1291,
     "acc": 51.7,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 386,
     "acc": 42.2,
     "adjustedAcc": 44.1,
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
   "graded": 3198,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3015,
    "diana": 0.1116,
    "nova": 0.2853,
    "flow": 0.3016
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
    "taro": 0.2598,
    "diana": 0.1317,
    "nova": 0.3128,
    "flow": 0.2956
   },
   "acc": {
    "taro": {
     "n": 535,
     "acc": 44.1,
     "adjustedAcc": 45.2,
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
   "graded": 1366,
   "globalBlend": 0.369
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3007,
    "diana": 0.1139,
    "nova": 0.3125,
    "flow": 0.2729
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
    "taro": 0.2784,
    "diana": 0.1168,
    "nova": 0.2954,
    "flow": 0.3094
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
     "n": 78,
     "acc": 62.8,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 479,
   "globalBlend": 0.625
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2844,
    "diana": 0.1534,
    "nova": 0.2697,
    "flow": 0.2925
   },
   "acc": {
    "taro": {
     "n": 499,
     "acc": 53.9,
     "adjustedAcc": 53.2,
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
    "taro": 0.2883,
    "diana": 0.1024,
    "nova": 0.3197,
    "flow": 0.2896
   },
   "acc": {
    "taro": {
     "n": 595,
     "acc": 49.2,
     "adjustedAcc": 49.4,
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
   "graded": 1514,
   "globalBlend": 0.346
  },
  "2차전지": {
   "weights": {
    "taro": 0.3132,
    "diana": 0.1069,
    "nova": 0.3188,
    "flow": 0.2611
   },
   "acc": {
    "taro": {
     "n": 568,
     "acc": 63.7,
     "adjustedAcc": 61.3,
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
     "n": 21,
     "acc": 42.9,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1233,
   "globalBlend": 0.394
  },
  "보험": {
   "weights": {
    "taro": 0.2794,
    "diana": 0.1368,
    "nova": 0.2872,
    "flow": 0.2966
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
   "graded": 494,
   "globalBlend": 0.618
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2925,
    "diana": 0.1167,
    "nova": 0.2923,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 1405,
     "acc": 57.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 537,
     "acc": 57.0,
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
     "n": 179,
     "acc": 60.9,
     "adjustedAcc": 56.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3311,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2764,
    "diana": 0.1272,
    "nova": 0.3184,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 620,
     "acc": 50.2,
     "adjustedAcc": 50.1,
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
     "n": 57,
     "acc": 45.6,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1496,
   "globalBlend": 0.348
  },
  "조선": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.1296,
    "nova": 0.2987,
    "flow": 0.3019
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
   "graded": 877,
   "globalBlend": 0.477
  },
  "방산": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1174,
    "nova": 0.2943,
    "flow": 0.3106
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
    "taro": 0.2906,
    "diana": 0.1404,
    "nova": 0.28,
    "flow": 0.2889
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 57.7,
     "adjustedAcc": 55.0,
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
    "taro": 0.2822,
    "diana": 0.1157,
    "nova": 0.2969,
    "flow": 0.3052
   },
   "acc": {
    "taro": {
     "n": 777,
     "acc": 54.4,
     "adjustedAcc": 53.8,
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
   "graded": 1930,
   "globalBlend": 0.293
  },
  "물류·운송": {
   "weights": {
    "taro": 0.272,
    "diana": 0.1392,
    "nova": 0.2771,
    "flow": 0.3117
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
    "taro": 0.2936,
    "diana": 0.1104,
    "nova": 0.2911,
    "flow": 0.3048
   },
   "acc": {
    "taro": {
     "n": 480,
     "acc": 54.2,
     "adjustedAcc": 53.3,
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
   "graded": 1066,
   "globalBlend": 0.429
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2835,
    "diana": 0.1311,
    "nova": 0.2688,
    "flow": 0.3165
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
     "n": 100,
     "acc": 67.0,
     "adjustedAcc": 57.7,
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
    "taro": 0.2856,
    "diana": 0.1228,
    "nova": 0.3082,
    "flow": 0.2833
   },
   "acc": {
    "taro": {
     "n": 315,
     "acc": 52.7,
     "adjustedAcc": 52.0,
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
    "taro": 0.2697,
    "diana": 0.1122,
    "nova": 0.3056,
    "flow": 0.3126
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
     "n": 155,
     "acc": 36.1,
     "adjustedAcc": 42.2,
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
   "graded": 748,
   "globalBlend": 0.517
  },
  "기계": {
   "weights": {
    "taro": 0.2705,
    "diana": 0.1253,
    "nova": 0.2927,
    "flow": 0.3115
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
    "taro": 0.2994,
    "diana": 0.1024,
    "nova": 0.3157,
    "flow": 0.2826
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 59.1,
     "adjustedAcc": 56.1,
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
    "taro": 0.2709,
    "diana": 0.1602,
    "nova": 0.269,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 282,
     "acc": 45.4,
     "adjustedAcc": 46.8,
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
   "graded": 626,
   "globalBlend": 0.561
  },
  "여행레저": {
   "weights": {
    "taro": 0.2935,
    "diana": 0.1124,
    "nova": 0.2956,
    "flow": 0.2985
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
