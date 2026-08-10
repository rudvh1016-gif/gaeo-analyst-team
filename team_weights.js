// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-10 12:11",
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
   "taro": 0.2735,
   "diana": 0.0896,
   "nova": 0.3338,
   "flow": 0.3031
  },
  "acc": {
   "taro": {
    "n": 9036,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2412,
    "acc": 45.6,
    "adjustedAcc": 45.8,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8042,
    "acc": 61.6,
    "adjustedAcc": 61.4,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1607,
    "acc": 56.3,
    "adjustedAcc": 55.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 21097,
  "team": {
   "hit": 6203,
   "miss": 2125,
   "n": 8328,
   "acc": 74.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.078,
    "nova": 0.2877,
    "flow": 0.3537
   },
   "acc": {
    "taro": {
     "n": 1097,
     "acc": 55.8,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 233,
     "acc": 36.5,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 990,
     "acc": 57.0,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 338,
     "acc": 69.2,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2658,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2951,
    "diana": 0.0866,
    "nova": 0.3184,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 543,
     "acc": 62.1,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 108,
     "acc": 44.4,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 478,
     "acc": 65.3,
     "adjustedAcc": 62.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 156,
     "acc": 65.4,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1285,
   "globalBlend": 0.384
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2607,
    "diana": 0.1004,
    "nova": 0.3478,
    "flow": 0.291
   },
   "acc": {
    "taro": {
     "n": 456,
     "acc": 44.5,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 123,
     "acc": 46.3,
     "adjustedAcc": 48.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 434,
     "acc": 62.4,
     "adjustedAcc": 59.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 48.9,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1103,
   "globalBlend": 0.42
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2903,
    "diana": 0.0862,
    "nova": 0.3541,
    "flow": 0.2693
   },
   "acc": {
    "taro": {
     "n": 352,
     "acc": 52.3,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 26.8,
     "adjustedAcc": 38.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 314,
     "acc": 64.6,
     "adjustedAcc": 60.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 81,
     "acc": 33.3,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 859,
   "globalBlend": 0.482
  },
  "통신": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.0931,
    "nova": 0.3286,
    "flow": 0.3069
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 49.1,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 32,
     "acc": 37.5,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 142,
     "acc": 64.1,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 62,
     "acc": 64.5,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 401,
   "globalBlend": 0.666
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2684,
    "diana": 0.124,
    "nova": 0.3147,
    "flow": 0.2928
   },
   "acc": {
    "taro": {
     "n": 403,
     "acc": 48.4,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 73.2,
     "adjustedAcc": 61.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 368,
     "acc": 56.8,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 54.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 933,
   "globalBlend": 0.462
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.0839,
    "nova": 0.3568,
    "flow": 0.2729
   },
   "acc": {
    "taro": {
     "n": 522,
     "acc": 49.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 157,
     "acc": 26.8,
     "adjustedAcc": 36.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 421,
     "acc": 62.5,
     "adjustedAcc": 59.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 142,
     "acc": 40.1,
     "adjustedAcc": 44.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1242,
   "globalBlend": 0.392
  },
  "2차전지": {
   "weights": {
    "taro": 0.3,
    "diana": 0.0906,
    "nova": 0.3558,
    "flow": 0.2536
   },
   "acc": {
    "taro": {
     "n": 492,
     "acc": 64.6,
     "adjustedAcc": 61.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 94,
     "acc": 51.1,
     "adjustedAcc": 50.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 430,
     "acc": 74.4,
     "adjustedAcc": 69.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 8,
     "acc": 25.0,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1024,
   "globalBlend": 0.439
  },
  "보험": {
   "weights": {
    "taro": 0.2756,
    "diana": 0.104,
    "nova": 0.3231,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 49.4,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 70.5,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 139,
     "acc": 58.3,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 39,
     "acc": 51.3,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 394,
   "globalBlend": 0.67
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1028,
    "nova": 0.3304,
    "flow": 0.2891
   },
   "acc": {
    "taro": {
     "n": 1146,
     "acc": 56.3,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 294,
     "acc": 56.1,
     "adjustedAcc": 54.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1055,
     "acc": 65.0,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 141,
     "acc": 61.7,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2636,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.1055,
    "nova": 0.3532,
    "flow": 0.2685
   },
   "acc": {
    "taro": {
     "n": 508,
     "acc": 49.0,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 170,
     "acc": 52.4,
     "adjustedAcc": 51.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 468,
     "acc": 64.3,
     "adjustedAcc": 61.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 44,
     "acc": 34.1,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1190,
   "globalBlend": 0.402
  },
  "조선": {
   "weights": {
    "taro": 0.2687,
    "diana": 0.093,
    "nova": 0.3346,
    "flow": 0.3037
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 44.9,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 34.5,
     "adjustedAcc": 43.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 284,
     "acc": 59.5,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 54,
     "acc": 53.7,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 726,
   "globalBlend": 0.524
  },
  "방산": {
   "weights": {
    "taro": 0.273,
    "diana": 0.0944,
    "nova": 0.3302,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 44.4,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 22,
     "acc": 31.8,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 110,
     "acc": 60.0,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 1,
     "acc": 100.0,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 266,
   "globalBlend": 0.75
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2851,
    "diana": 0.1026,
    "nova": 0.3199,
    "flow": 0.2924
   },
   "acc": {
    "taro": {
     "n": 180,
     "acc": 56.7,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 65,
     "acc": 64.6,
     "adjustedAcc": 55.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 181,
     "acc": 58.0,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 426,
   "globalBlend": 0.653
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2736,
    "diana": 0.0895,
    "nova": 0.3305,
    "flow": 0.3065
   },
   "acc": {
    "taro": {
     "n": 654,
     "acc": 54.7,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 208,
     "acc": 45.7,
     "adjustedAcc": 47.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 604,
     "acc": 64.9,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 87,
     "acc": 69.0,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1553,
   "globalBlend": 0.34
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.1057,
    "nova": 0.3126,
    "flow": 0.309
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 45.2,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 38,
     "acc": 78.9,
     "adjustedAcc": 57.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 93,
     "acc": 47.3,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 58.3,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 339,
   "globalBlend": 0.702
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.0922,
    "nova": 0.3196,
    "flow": 0.3017
   },
   "acc": {
    "taro": {
     "n": 392,
     "acc": 53.1,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 120,
     "acc": 39.2,
     "adjustedAcc": 44.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 320,
     "acc": 57.5,
     "adjustedAcc": 55.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 19,
     "acc": 68.4,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 851,
   "globalBlend": 0.485
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.102,
    "nova": 0.3064,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 47.5,
     "adjustedAcc": 48.3,
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
     "n": 180,
     "acc": 46.7,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 85.7,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 491,
   "globalBlend": 0.62
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2794,
    "diana": 0.0894,
    "nova": 0.3473,
    "flow": 0.284
   },
   "acc": {
    "taro": {
     "n": 270,
     "acc": 51.1,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 71,
     "acc": 29.6,
     "adjustedAcc": 42.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 229,
     "acc": 66.8,
     "adjustedAcc": 61.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 94,
     "acc": 44.7,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 664,
   "globalBlend": 0.546
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2664,
    "diana": 0.0877,
    "nova": 0.3353,
    "flow": 0.3106
   },
   "acc": {
    "taro": {
     "n": 262,
     "acc": 37.4,
     "adjustedAcc": 41.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 85,
     "acc": 14.1,
     "adjustedAcc": 35.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 240,
     "acc": 54.2,
     "adjustedAcc": 52.8,
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
   "graded": 592,
   "globalBlend": 0.575
  },
  "기계": {
   "weights": {
    "taro": 0.2665,
    "diana": 0.0957,
    "nova": 0.33,
    "flow": 0.3078
   },
   "acc": {
    "taro": {
     "n": 83,
     "acc": 31.3,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 26,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 86,
     "acc": 59.3,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 7,
     "acc": 100.0,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 202,
   "globalBlend": 0.798
  },
  "로봇": {
   "weights": {
    "taro": 0.2814,
    "diana": 0.0962,
    "nova": 0.3453,
    "flow": 0.277
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 56.0,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 51.9,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 195,
     "acc": 71.3,
     "adjustedAcc": 63.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 50,
     "acc": 38.0,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 508,
   "globalBlend": 0.612
  },
  "식음료": {
   "weights": {
    "taro": 0.2742,
    "diana": 0.1198,
    "nova": 0.3018,
    "flow": 0.3043
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 44.5,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 70,
     "acc": 80.0,
     "adjustedAcc": 61.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 185,
     "acc": 42.2,
     "adjustedAcc": 45.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 2,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 475,
   "globalBlend": 0.627
  },
  "여행레저": {
   "weights": {
    "taro": 0.2893,
    "diana": 0.089,
    "nova": 0.3258,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 58.8,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 30,
     "acc": 0.0,
     "adjustedAcc": 40.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 96,
     "acc": 57.3,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 39,
     "acc": 41.0,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 279,
   "globalBlend": 0.741
  }
 }
};
