// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-24 09:11",
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
   "taro": 0.2583,
   "diana": 0.1223,
   "nova": 0.3043,
   "flow": 0.3151
  },
  "acc": {
   "taro": {
    "n": 12362,
    "acc": 49.1,
    "adjustedAcc": 49.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 5523,
    "acc": 54.8,
    "adjustedAcc": 54.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9092,
    "acc": 57.0,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2245,
    "acc": 56.0,
    "adjustedAcc": 55.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 29222,
  "team": {
   "hit": 8096,
   "miss": 7844,
   "n": 15940,
   "acc": 50.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2693,
    "diana": 0.0996,
    "nova": 0.2775,
    "flow": 0.3536
   },
   "acc": {
    "taro": {
     "n": 1461,
     "acc": 49.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 492,
     "acc": 42.5,
     "adjustedAcc": 44.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1129,
     "acc": 51.6,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 445,
     "acc": 62.0,
     "adjustedAcc": 59.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3527,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1125,
    "nova": 0.2954,
    "flow": 0.3124
   },
   "acc": {
    "taro": {
     "n": 702,
     "acc": 55.3,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 220,
     "acc": 53.2,
     "adjustedAcc": 52.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 544,
     "acc": 58.5,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 216,
     "acc": 60.6,
     "adjustedAcc": 56.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1682,
   "globalBlend": 0.322
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2402,
    "diana": 0.1346,
    "nova": 0.3141,
    "flow": 0.3111
   },
   "acc": {
    "taro": {
     "n": 614,
     "acc": 42.0,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 296,
     "acc": 60.5,
     "adjustedAcc": 57.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 486,
     "acc": 58.0,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 142,
     "acc": 55.6,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1538,
   "globalBlend": 0.342
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1187,
    "nova": 0.326,
    "flow": 0.2758
   },
   "acc": {
    "taro": {
     "n": 468,
     "acc": 48.9,
     "adjustedAcc": 49.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 249,
     "acc": 48.2,
     "adjustedAcc": 48.8,
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
     "n": 107,
     "acc": 36.4,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1174,
   "globalBlend": 0.405
  },
  "통신": {
   "weights": {
    "taro": 0.2567,
    "diana": 0.1174,
    "nova": 0.3051,
    "flow": 0.3208
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 46.3,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 67,
     "acc": 50.7,
     "adjustedAcc": 50.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 156,
     "acc": 60.9,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 95,
     "acc": 64.2,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 536,
   "globalBlend": 0.599
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2633,
    "diana": 0.1623,
    "nova": 0.2819,
    "flow": 0.2926
   },
   "acc": {
    "taro": {
     "n": 571,
     "acc": 48.7,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 274,
     "acc": 75.2,
     "adjustedAcc": 67.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 416,
     "acc": 51.9,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 82,
     "acc": 51.2,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1343,
   "globalBlend": 0.373
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2698,
    "diana": 0.102,
    "nova": 0.3306,
    "flow": 0.2976
   },
   "acc": {
    "taro": {
     "n": 674,
     "acc": 45.7,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 354,
     "acc": 37.3,
     "adjustedAcc": 40.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 473,
     "acc": 57.5,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 178,
     "acc": 46.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1679,
   "globalBlend": 0.323
  },
  "2차전지": {
   "weights": {
    "taro": 0.2835,
    "diana": 0.1125,
    "nova": 0.3363,
    "flow": 0.2677
   },
   "acc": {
    "taro": {
     "n": 654,
     "acc": 56.6,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 208,
     "acc": 52.9,
     "adjustedAcc": 51.8,
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
     "n": 27,
     "acc": 40.7,
     "adjustedAcc": 48.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1366,
   "globalBlend": 0.369
  },
  "보험": {
   "weights": {
    "taro": 0.2669,
    "diana": 0.1435,
    "nova": 0.289,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 52.5,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 118,
     "acc": 83.1,
     "adjustedAcc": 66.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 156,
     "acc": 54.5,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 56.2,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 564,
   "globalBlend": 0.587
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2668,
    "diana": 0.1191,
    "nova": 0.3074,
    "flow": 0.3067
   },
   "acc": {
    "taro": {
     "n": 1617,
     "acc": 52.2,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 694,
     "acc": 55.9,
     "adjustedAcc": 55.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1213,
     "acc": 59.7,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 212,
     "acc": 59.4,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3736,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2616,
    "diana": 0.1231,
    "nova": 0.3307,
    "flow": 0.2846
   },
   "acc": {
    "taro": {
     "n": 709,
     "acc": 47.4,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 400,
     "acc": 54.0,
     "adjustedAcc": 53.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 520,
     "acc": 61.0,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 46.2,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1694,
   "globalBlend": 0.321
  },
  "조선": {
   "weights": {
    "taro": 0.2482,
    "diana": 0.1284,
    "nova": 0.31,
    "flow": 0.3134
   },
   "acc": {
    "taro": {
     "n": 395,
     "acc": 41.0,
     "adjustedAcc": 43.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 200,
     "acc": 56.5,
     "adjustedAcc": 54.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 319,
     "acc": 56.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 67,
     "acc": 55.2,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 981,
   "globalBlend": 0.449
  },
  "방산": {
   "weights": {
    "taro": 0.2586,
    "diana": 0.1191,
    "nova": 0.3024,
    "flow": 0.3198
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 44.1,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 46.7,
     "adjustedAcc": 49.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 127,
     "acc": 56.7,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 12,
     "acc": 100.0,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 363,
   "globalBlend": 0.688
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2656,
    "diana": 0.1516,
    "nova": 0.2897,
    "flow": 0.2932
   },
   "acc": {
    "taro": {
     "n": 251,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 152,
     "acc": 82.9,
     "adjustedAcc": 68.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 200,
     "acc": 53.0,
     "adjustedAcc": 51.9,
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
   "graded": 608,
   "globalBlend": 0.568
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2595,
    "diana": 0.1152,
    "nova": 0.3096,
    "flow": 0.3157
   },
   "acc": {
    "taro": {
     "n": 895,
     "acc": 49.9,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 479,
     "acc": 53.2,
     "adjustedAcc": 52.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 683,
     "acc": 59.7,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 105,
     "acc": 63.8,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2162,
   "globalBlend": 0.27
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2568,
    "diana": 0.1428,
    "nova": 0.2832,
    "flow": 0.3172
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 43.8,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 84,
     "acc": 85.7,
     "adjustedAcc": 64.7,
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
     "n": 115,
     "acc": 58.3,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 483,
   "globalBlend": 0.624
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.1093,
    "nova": 0.2967,
    "flow": 0.3097
   },
   "acc": {
    "taro": {
     "n": 556,
     "acc": 53.6,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 272,
     "acc": 45.6,
     "adjustedAcc": 46.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 360,
     "acc": 55.6,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 24,
     "acc": 70.8,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1212,
   "globalBlend": 0.398
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2722,
    "diana": 0.1378,
    "nova": 0.2698,
    "flow": 0.3203
   },
   "acc": {
    "taro": {
     "n": 330,
     "acc": 51.5,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 137,
     "acc": 70.8,
     "adjustedAcc": 61.1,
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
     "n": 32,
     "acc": 75.0,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 703,
   "globalBlend": 0.532
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2698,
    "diana": 0.1307,
    "nova": 0.3165,
    "flow": 0.2829
   },
   "acc": {
    "taro": {
     "n": 367,
     "acc": 50.1,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 169,
     "acc": 62.1,
     "adjustedAcc": 57.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 255,
     "acc": 61.2,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 127,
     "acc": 44.1,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 918,
   "globalBlend": 0.466
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2505,
    "diana": 0.1125,
    "nova": 0.3149,
    "flow": 0.3222
   },
   "acc": {
    "taro": {
     "n": 378,
     "acc": 37.3,
     "adjustedAcc": 40.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 201,
     "acc": 37.8,
     "adjustedAcc": 42.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 276,
     "acc": 53.3,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 11,
     "acc": 54.5,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 866,
   "globalBlend": 0.48
  },
  "기계": {
   "weights": {
    "taro": 0.2522,
    "diana": 0.1265,
    "nova": 0.302,
    "flow": 0.3193
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 36.0,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 60,
     "acc": 66.7,
     "adjustedAcc": 55.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 98,
     "acc": 56.1,
     "adjustedAcc": 52.8,
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
   "graded": 294,
   "globalBlend": 0.731
  },
  "로봇": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1004,
    "nova": 0.3303,
    "flow": 0.292
   },
   "acc": {
    "taro": {
     "n": 283,
     "acc": 52.7,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 128,
     "acc": 23.4,
     "adjustedAcc": 36.3,
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
     "n": 66,
     "acc": 43.9,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 690,
   "globalBlend": 0.537
  },
  "식음료": {
   "weights": {
    "taro": 0.2527,
    "diana": 0.1671,
    "nova": 0.2737,
    "flow": 0.3065
   },
   "acc": {
    "taro": {
     "n": 340,
     "acc": 43.2,
     "adjustedAcc": 45.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 168,
     "acc": 86.3,
     "adjustedAcc": 71.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 214,
     "acc": 44.4,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 5,
     "acc": 80.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 727,
   "globalBlend": 0.524
  },
  "여행레저": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.1143,
    "nova": 0.3064,
    "flow": 0.3065
   },
   "acc": {
    "taro": {
     "n": 157,
     "acc": 51.0,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 28.6,
     "adjustedAcc": 43.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 115,
     "acc": 57.4,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 45.8,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 376,
   "globalBlend": 0.68
  }
 }
};
