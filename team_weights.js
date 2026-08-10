// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-10 14:45",
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
   "taro": 0.2732,
   "diana": 0.0901,
   "nova": 0.3335,
   "flow": 0.3033
  },
  "acc": {
   "taro": {
    "n": 9035,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2418,
    "acc": 45.8,
    "adjustedAcc": 46.0,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8041,
    "acc": 61.6,
    "adjustedAcc": 61.4,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1605,
    "acc": 56.4,
    "adjustedAcc": 55.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 21099,
  "team": {
   "hit": 6195,
   "miss": 2124,
   "n": 8319,
   "acc": 74.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.0781,
    "nova": 0.2878,
    "flow": 0.3536
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
     "n": 989,
     "acc": 57.0,
     "adjustedAcc": 56.3,
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
   "graded": 2657,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2949,
    "diana": 0.0871,
    "nova": 0.3181,
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
     "n": 109,
     "acc": 45.0,
     "adjustedAcc": 47.6,
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
   "graded": 1286,
   "globalBlend": 0.384
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2602,
    "diana": 0.1015,
    "nova": 0.3473,
    "flow": 0.2911
   },
   "acc": {
    "taro": {
     "n": 455,
     "acc": 44.4,
     "adjustedAcc": 45.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 47.2,
     "adjustedAcc": 48.6,
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
   "graded": 1103,
   "globalBlend": 0.42
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.29,
    "diana": 0.0872,
    "nova": 0.3537,
    "flow": 0.2692
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
     "acc": 27.9,
     "adjustedAcc": 39.4,
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
    "taro": 0.2716,
    "diana": 0.0935,
    "nova": 0.3278,
    "flow": 0.3072
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 49.4,
     "adjustedAcc": 49.7,
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
     "acc": 63.6,
     "adjustedAcc": 57.4,
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
    "taro": 0.2683,
    "diana": 0.1242,
    "nova": 0.3146,
    "flow": 0.2929
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
    "taro": 0.287,
    "diana": 0.084,
    "nova": 0.3557,
    "flow": 0.2732
   },
   "acc": {
    "taro": {
     "n": 521,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
     "n": 421,
     "acc": 62.2,
     "adjustedAcc": 59.5,
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
    "taro": 0.2998,
    "diana": 0.0908,
    "nova": 0.3556,
    "flow": 0.2538
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
    "taro": 0.2754,
    "diana": 0.1044,
    "nova": 0.3229,
    "flow": 0.2974
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
    "taro": 0.277,
    "diana": 0.1034,
    "nova": 0.3308,
    "flow": 0.2889
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
     "n": 296,
     "acc": 56.4,
     "adjustedAcc": 54.6,
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
   "graded": 2634,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2724,
    "diana": 0.1057,
    "nova": 0.3537,
    "flow": 0.2683
   },
   "acc": {
    "taro": {
     "n": 510,
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
     "n": 470,
     "acc": 64.5,
     "adjustedAcc": 61.5,
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
   "graded": 1194,
   "globalBlend": 0.401
  },
  "조선": {
   "weights": {
    "taro": 0.2685,
    "diana": 0.0932,
    "nova": 0.3345,
    "flow": 0.3038
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
    "taro": 0.2727,
    "diana": 0.0948,
    "nova": 0.33,
    "flow": 0.3025
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
    "taro": 0.2849,
    "diana": 0.103,
    "nova": 0.3197,
    "flow": 0.2925
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
    "taro": 0.2734,
    "diana": 0.0899,
    "nova": 0.3303,
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
     "n": 209,
     "acc": 45.9,
     "adjustedAcc": 47.4,
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
   "graded": 1554,
   "globalBlend": 0.34
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2724,
    "diana": 0.1061,
    "nova": 0.3123,
    "flow": 0.3091
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
    "taro": 0.2864,
    "diana": 0.0925,
    "nova": 0.3194,
    "flow": 0.3018
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
    "taro": 0.2769,
    "diana": 0.1026,
    "nova": 0.3061,
    "flow": 0.3144
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
     "n": 56,
     "acc": 53.6,
     "adjustedAcc": 51.1,
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
   "graded": 490,
   "globalBlend": 0.62
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.279,
    "diana": 0.0895,
    "nova": 0.3472,
    "flow": 0.2843
   },
   "acc": {
    "taro": {
     "n": 269,
     "acc": 51.3,
     "adjustedAcc": 50.9,
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
     "n": 228,
     "acc": 67.1,
     "adjustedAcc": 61.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 93,
     "acc": 45.2,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 661,
   "globalBlend": 0.548
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.0881,
    "nova": 0.3345,
    "flow": 0.3117
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
     "acc": 15.1,
     "adjustedAcc": 35.4,
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
    "taro": 0.2661,
    "diana": 0.0964,
    "nova": 0.3296,
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
     "n": 27,
     "acc": 51.9,
     "adjustedAcc": 50.3,
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
   "graded": 203,
   "globalBlend": 0.798
  },
  "로봇": {
   "weights": {
    "taro": 0.2814,
    "diana": 0.0962,
    "nova": 0.3453,
    "flow": 0.2772
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
     "n": 55,
     "acc": 50.9,
     "adjustedAcc": 50.3,
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
   "graded": 509,
   "globalBlend": 0.611
  },
  "식음료": {
   "weights": {
    "taro": 0.274,
    "diana": 0.1201,
    "nova": 0.3016,
    "flow": 0.3044
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
    "taro": 0.2889,
    "diana": 0.0895,
    "nova": 0.3252,
    "flow": 0.2963
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
