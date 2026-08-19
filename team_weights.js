// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-19 10:11",
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
   "taro": 0.2751,
   "diana": 0.1236,
   "nova": 0.2956,
   "flow": 0.3057
  },
  "acc": {
   "taro": {
    "n": 11147,
    "acc": 51.9,
    "adjustedAcc": 51.9,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4624,
    "acc": 55.9,
    "adjustedAcc": 55.7,
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
    "n": 2033,
    "acc": 55.7,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26817,
  "team": {
   "hit": 7420,
   "miss": 7045,
   "n": 14465,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2787,
    "diana": 0.0996,
    "nova": 0.2682,
    "flow": 0.3535
   },
   "acc": {
    "taro": {
     "n": 1325,
     "acc": 51.3,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 410,
     "acc": 42.9,
     "adjustedAcc": 44.5,
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
     "n": 411,
     "acc": 63.5,
     "adjustedAcc": 60.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3265,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2997,
    "diana": 0.1142,
    "nova": 0.2873,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 638,
     "acc": 59.1,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 188,
     "acc": 55.3,
     "adjustedAcc": 53.2,
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
     "n": 192,
     "acc": 59.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1556,
   "globalBlend": 0.34
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2578,
    "diana": 0.1343,
    "nova": 0.3134,
    "flow": 0.2945
   },
   "acc": {
    "taro": {
     "n": 555,
     "acc": 44.1,
     "adjustedAcc": 45.2,
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
     "n": 121,
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1409,
   "globalBlend": 0.362
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2966,
    "diana": 0.1177,
    "nova": 0.3142,
    "flow": 0.2714
   },
   "acc": {
    "taro": {
     "n": 423,
     "acc": 53.2,
     "adjustedAcc": 52.5,
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
    "taro": 0.2736,
    "diana": 0.1187,
    "nova": 0.2973,
    "flow": 0.3103
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
    "diana": 0.1569,
    "nova": 0.2724,
    "flow": 0.2912
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
    "diana": 0.1039,
    "nova": 0.3215,
    "flow": 0.2906
   },
   "acc": {
    "taro": {
     "n": 612,
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
   "graded": 1551,
   "globalBlend": 0.34
  },
  "2차전지": {
   "weights": {
    "taro": 0.3074,
    "diana": 0.1085,
    "nova": 0.3224,
    "flow": 0.2617
   },
   "acc": {
    "taro": {
     "n": 586,
     "acc": 62.3,
     "adjustedAcc": 60.2,
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
   "graded": 1265,
   "globalBlend": 0.387
  },
  "보험": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.1401,
    "nova": 0.2876,
    "flow": 0.2945
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
    "taro": 0.2856,
    "diana": 0.1189,
    "nova": 0.2967,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 1458,
     "acc": 55.6,
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
   "graded": 3414,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.274,
    "diana": 0.1276,
    "nova": 0.3204,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 639,
     "acc": 49.8,
     "adjustedAcc": 49.8,
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
   "graded": 1542,
   "globalBlend": 0.342
  },
  "조선": {
   "weights": {
    "taro": 0.2662,
    "diana": 0.1331,
    "nova": 0.3004,
    "flow": 0.3003
   },
   "acc": {
    "taro": {
     "n": 357,
     "acc": 45.1,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 165,
     "acc": 61.8,
     "adjustedAcc": 56.8,
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
   "graded": 901,
   "globalBlend": 0.47
  },
  "방산": {
   "weights": {
    "taro": 0.2757,
    "diana": 0.1192,
    "nova": 0.2953,
    "flow": 0.3098
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
     "n": 9,
     "acc": 100.0,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 333,
   "globalBlend": 0.706
  },
  "철강·금속": {
   "weights": {
    "taro": 0.285,
    "diana": 0.1461,
    "nova": 0.2825,
    "flow": 0.2864
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
    "taro": 0.2775,
    "diana": 0.119,
    "nova": 0.2984,
    "flow": 0.3051
   },
   "acc": {
    "taro": {
     "n": 804,
     "acc": 53.6,
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
   "graded": 1987,
   "globalBlend": 0.287
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.1428,
    "nova": 0.2777,
    "flow": 0.3113
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 44.5,
     "adjustedAcc": 46.8,
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
   "graded": 456,
   "globalBlend": 0.637
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2908,
    "diana": 0.1117,
    "nova": 0.2939,
    "flow": 0.3036
   },
   "acc": {
    "taro": {
     "n": 497,
     "acc": 53.5,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 225,
     "acc": 46.2,
     "adjustedAcc": 47.5,
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
    "taro": 0.2808,
    "diana": 0.135,
    "nova": 0.2698,
    "flow": 0.3143
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
   "graded": 637,
   "globalBlend": 0.557
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2799,
    "diana": 0.1277,
    "nova": 0.3113,
    "flow": 0.2812
   },
   "acc": {
    "taro": {
     "n": 331,
     "acc": 51.1,
     "adjustedAcc": 50.8,
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
     "n": 122,
     "acc": 45.1,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 845,
   "globalBlend": 0.486
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2641,
    "diana": 0.1144,
    "nova": 0.3083,
    "flow": 0.3132
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
    "taro": 0.2669,
    "diana": 0.1282,
    "nova": 0.294,
    "flow": 0.3108
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
    "taro": 0.2971,
    "diana": 0.1026,
    "nova": 0.3183,
    "flow": 0.2821
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 58.7,
     "adjustedAcc": 55.9,
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
    "taro": 0.2661,
    "diana": 0.1651,
    "nova": 0.2699,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 297,
     "acc": 44.4,
     "adjustedAcc": 46.0,
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
   "graded": 651,
   "globalBlend": 0.551
  },
  "여행레저": {
   "weights": {
    "taro": 0.2894,
    "diana": 0.1151,
    "nova": 0.2977,
    "flow": 0.2978
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
   "graded": 343,
   "globalBlend": 0.7
  }
 }
};
