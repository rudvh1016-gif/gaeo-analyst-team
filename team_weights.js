// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-10 09:41",
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
   "taro": 0.2736,
   "diana": 0.0886,
   "nova": 0.334,
   "flow": 0.3038
  },
  "acc": {
   "taro": {
    "n": 9035,
    "acc": 52.5,
    "adjustedAcc": 52.4,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2404,
    "acc": 45.2,
    "adjustedAcc": 45.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8038,
    "acc": 61.6,
    "adjustedAcc": 61.4,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1607,
    "acc": 56.4,
    "adjustedAcc": 55.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 21084,
  "team": {
   "hit": 6211,
   "miss": 2126,
   "n": 8337,
   "acc": 74.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.0777,
    "nova": 0.2877,
    "flow": 0.3539
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
    "taro": 0.2952,
    "diana": 0.086,
    "nova": 0.3186,
    "flow": 0.3002
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
     "n": 107,
     "acc": 43.9,
     "adjustedAcc": 47.1,
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
   "graded": 1284,
   "globalBlend": 0.384
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2601,
    "diana": 0.1005,
    "nova": 0.3477,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 456,
     "acc": 44.3,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 126,
     "acc": 46.8,
     "adjustedAcc": 48.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 433,
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
   "graded": 1105,
   "globalBlend": 0.42
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2905,
    "diana": 0.0854,
    "nova": 0.3543,
    "flow": 0.2697
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
     "n": 111,
     "acc": 26.1,
     "adjustedAcc": 38.5,
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
   "graded": 858,
   "globalBlend": 0.483
  },
  "통신": {
   "weights": {
    "taro": 0.2709,
    "diana": 0.0925,
    "nova": 0.3292,
    "flow": 0.3074
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 48.8,
     "adjustedAcc": 49.3,
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
     "n": 143,
     "acc": 64.3,
     "adjustedAcc": 57.8,
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
   "graded": 403,
   "globalBlend": 0.665
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2684,
    "diana": 0.1237,
    "nova": 0.3148,
    "flow": 0.2931
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
     "n": 110,
     "acc": 73.6,
     "adjustedAcc": 61.3,
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
   "graded": 931,
   "globalBlend": 0.462
  },
  "금융·증권": {
   "weights": {
    "taro": 0.287,
    "diana": 0.0831,
    "nova": 0.3563,
    "flow": 0.2736
   },
   "acc": {
    "taro": {
     "n": 521,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 158,
     "acc": 26.6,
     "adjustedAcc": 36.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 419,
     "acc": 62.5,
     "adjustedAcc": 59.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 143,
     "acc": 40.6,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1241,
   "globalBlend": 0.392
  },
  "2차전지": {
   "weights": {
    "taro": 0.3,
    "diana": 0.0902,
    "nova": 0.3558,
    "flow": 0.254
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
     "n": 92,
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
   "graded": 1022,
   "globalBlend": 0.439
  },
  "보험": {
   "weights": {
    "taro": 0.2759,
    "diana": 0.1027,
    "nova": 0.3235,
    "flow": 0.298
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
     "acc": 68.2,
     "adjustedAcc": 54.9,
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
    "taro": 0.2774,
    "diana": 0.102,
    "nova": 0.3313,
    "flow": 0.2893
   },
   "acc": {
    "taro": {
     "n": 1144,
     "acc": 56.2,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 294,
     "acc": 55.8,
     "adjustedAcc": 54.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1053,
     "acc": 65.1,
     "adjustedAcc": 63.6,
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
   "graded": 2632,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2729,
    "diana": 0.1039,
    "nova": 0.354,
    "flow": 0.2692
   },
   "acc": {
    "taro": {
     "n": 509,
     "acc": 48.9,
     "adjustedAcc": 49.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 168,
     "acc": 51.2,
     "adjustedAcc": 50.7,
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
   "graded": 1189,
   "globalBlend": 0.402
  },
  "조선": {
   "weights": {
    "taro": 0.2691,
    "diana": 0.0913,
    "nova": 0.3351,
    "flow": 0.3045
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
     "acc": 32.2,
     "adjustedAcc": 42.5,
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
    "diana": 0.0937,
    "nova": 0.3304,
    "flow": 0.3029
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
    "taro": 0.2852,
    "diana": 0.102,
    "nova": 0.32,
    "flow": 0.2929
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
    "taro": 0.2738,
    "diana": 0.0886,
    "nova": 0.3308,
    "flow": 0.3069
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
     "n": 204,
     "acc": 45.1,
     "adjustedAcc": 46.9,
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
   "graded": 1549,
   "globalBlend": 0.341
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2734,
    "diana": 0.1047,
    "nova": 0.3123,
    "flow": 0.3096
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 45.6,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 78.4,
     "adjustedAcc": 56.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 94,
     "acc": 46.8,
     "adjustedAcc": 48.6,
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
   "graded": 340,
   "globalBlend": 0.702
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2869,
    "diana": 0.0912,
    "nova": 0.3195,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 390,
     "acc": 53.1,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 120,
     "acc": 38.3,
     "adjustedAcc": 44.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 319,
     "acc": 57.4,
     "adjustedAcc": 55.4,
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
   "graded": 848,
   "globalBlend": 0.485
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.1014,
    "nova": 0.3065,
    "flow": 0.3149
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
    "diana": 0.0888,
    "nova": 0.3474,
    "flow": 0.2843
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
    "taro": 0.266,
    "diana": 0.0868,
    "nova": 0.335,
    "flow": 0.3122
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
     "n": 86,
     "acc": 14.0,
     "adjustedAcc": 35.0,
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
     "n": 4,
     "acc": 25.0,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 592,
   "globalBlend": 0.575
  },
  "기계": {
   "weights": {
    "taro": 0.2666,
    "diana": 0.095,
    "nova": 0.3301,
    "flow": 0.3083
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
    "taro": 0.2815,
    "diana": 0.0956,
    "nova": 0.3454,
    "flow": 0.2774
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
    "taro": 0.2741,
    "diana": 0.1191,
    "nova": 0.3023,
    "flow": 0.3046
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
     "n": 184,
     "acc": 42.4,
     "adjustedAcc": 45.4,
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
   "graded": 474,
   "globalBlend": 0.628
  },
  "여행레저": {
   "weights": {
    "taro": 0.2892,
    "diana": 0.0883,
    "nova": 0.3257,
    "flow": 0.2968
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 58.3,
     "adjustedAcc": 54.0,
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
     "n": 97,
     "acc": 56.7,
     "adjustedAcc": 53.0,
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
   "graded": 281,
   "globalBlend": 0.74
  }
 }
};
