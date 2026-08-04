// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 14:19",
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
   "taro": 0.3325,
   "diana": 0.072,
   "nova": 0.3089,
   "flow": 0.2866
  },
  "acc": {
   "taro": {
    "n": 7443,
    "acc": 59.8,
    "adjustedAcc": 59.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1232,
    "acc": 38.1,
    "adjustedAcc": 39.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6167,
    "acc": 59.7,
    "adjustedAcc": 59.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1288,
    "acc": 55.1,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 16130,
  "team": {
   "hit": 5800,
   "miss": 1463,
   "n": 7263,
   "acc": 79.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3465,
    "diana": 0.0756,
    "nova": 0.2501,
    "flow": 0.3277
   },
   "acc": {
    "taro": {
     "n": 908,
     "acc": 66.0,
     "adjustedAcc": 64.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 114,
     "acc": 37.7,
     "adjustedAcc": 44.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 795,
     "acc": 52.2,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 286,
     "acc": 68.9,
     "adjustedAcc": 63.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2103,
   "globalBlend": 0.276
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3585,
    "diana": 0.0733,
    "nova": 0.2863,
    "flow": 0.2818
   },
   "acc": {
    "taro": {
     "n": 444,
     "acc": 74.3,
     "adjustedAcc": 69.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 35.2,
     "adjustedAcc": 45.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 376,
     "acc": 63.0,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 125,
     "acc": 67.2,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 999,
   "globalBlend": 0.445
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3161,
    "diana": 0.0873,
    "nova": 0.3079,
    "flow": 0.2887
   },
   "acc": {
    "taro": {
     "n": 371,
     "acc": 52.8,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 40.3,
     "adjustedAcc": 46.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 335,
     "acc": 57.0,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 53.0,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 834,
   "globalBlend": 0.49
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3382,
    "diana": 0.075,
    "nova": 0.3268,
    "flow": 0.26
   },
   "acc": {
    "taro": {
     "n": 294,
     "acc": 60.5,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 58,
     "acc": 15.5,
     "adjustedAcc": 38.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 241,
     "acc": 65.1,
     "adjustedAcc": 60.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 70,
     "acc": 32.9,
     "adjustedAcc": 43.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 663,
   "globalBlend": 0.547
  },
  "통신": {
   "weights": {
    "taro": 0.3234,
    "diana": 0.0811,
    "nova": 0.305,
    "flow": 0.2905
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 57.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 18,
     "acc": 44.4,
     "adjustedAcc": 49.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 112,
     "acc": 61.6,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 45,
     "acc": 64.4,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 313,
   "globalBlend": 0.719
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3063,
    "diana": 0.0968,
    "nova": 0.3086,
    "flow": 0.2884
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 64.6,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 279,
     "acc": 58.4,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 56.8,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 691,
   "globalBlend": 0.537
  },
  "금융·증권": {
   "weights": {
    "taro": 0.34,
    "diana": 0.0763,
    "nova": 0.3223,
    "flow": 0.2614
   },
   "acc": {
    "taro": {
     "n": 429,
     "acc": 56.9,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 88,
     "acc": 19.3,
     "adjustedAcc": 37.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 316,
     "acc": 58.9,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 123,
     "acc": 36.6,
     "adjustedAcc": 43.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 956,
   "globalBlend": 0.456
  },
  "2차전지": {
   "weights": {
    "taro": 0.3638,
    "diana": 0.0781,
    "nova": 0.3139,
    "flow": 0.2442
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 79.0,
     "adjustedAcc": 72.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 54.7,
     "adjustedAcc": 51.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 339,
     "acc": 73.7,
     "adjustedAcc": 67.5,
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
   "graded": 799,
   "globalBlend": 0.5
  },
  "보험": {
   "weights": {
    "taro": 0.3261,
    "diana": 0.0858,
    "nova": 0.3031,
    "flow": 0.2851
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 53.5,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 58.3,
     "adjustedAcc": 51.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 104,
     "acc": 53.8,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 34,
     "acc": 44.1,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 306,
   "globalBlend": 0.723
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3328,
    "diana": 0.0926,
    "nova": 0.3057,
    "flow": 0.2689
   },
   "acc": {
    "taro": {
     "n": 940,
     "acc": 63.9,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 159,
     "acc": 55.3,
     "adjustedAcc": 53.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 804,
     "acc": 63.4,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 121,
     "acc": 58.7,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2024,
   "globalBlend": 0.283
  },
  "지주·상사": {
   "weights": {
    "taro": 0.326,
    "diana": 0.0851,
    "nova": 0.3285,
    "flow": 0.2604
   },
   "acc": {
    "taro": {
     "n": 428,
     "acc": 55.8,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 86,
     "acc": 38.4,
     "adjustedAcc": 45.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 358,
     "acc": 62.6,
     "adjustedAcc": 59.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 27.0,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 909,
   "globalBlend": 0.468
  },
  "조선": {
   "weights": {
    "taro": 0.3252,
    "diana": 0.0744,
    "nova": 0.307,
    "flow": 0.2934
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 53.3,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 51,
     "acc": 3.9,
     "adjustedAcc": 36.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 219,
     "acc": 55.3,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 35,
     "acc": 54.3,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 551,
   "globalBlend": 0.592
  },
  "방산": {
   "weights": {
    "taro": 0.3268,
    "diana": 0.0797,
    "nova": 0.3061,
    "flow": 0.2874
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 54.1,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 12,
     "acc": 33.3,
     "adjustedAcc": 48.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 83,
     "acc": 57.8,
     "adjustedAcc": 53.2,
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
   "graded": 205,
   "globalBlend": 0.796
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3299,
    "diana": 0.079,
    "nova": 0.3089,
    "flow": 0.2822
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 60.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 32,
     "acc": 31.2,
     "adjustedAcc": 46.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 136,
     "acc": 62.5,
     "adjustedAcc": 56.6,
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
   "graded": 322,
   "globalBlend": 0.713
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3249,
    "diana": 0.0749,
    "nova": 0.305,
    "flow": 0.2952
   },
   "acc": {
    "taro": {
     "n": 540,
     "acc": 63.7,
     "adjustedAcc": 61.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 104,
     "acc": 37.5,
     "adjustedAcc": 44.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 464,
     "acc": 64.7,
     "adjustedAcc": 61.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 76,
     "acc": 73.7,
     "adjustedAcc": 59.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1184,
   "globalBlend": 0.403
  },
  "물류·운송": {
   "weights": {
    "taro": 0.323,
    "diana": 0.0845,
    "nova": 0.3019,
    "flow": 0.2906
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 47.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 17,
     "acc": 58.8,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 62,
     "acc": 48.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 64,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 243,
   "globalBlend": 0.767
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3209,
    "diana": 0.0805,
    "nova": 0.3018,
    "flow": 0.2968
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 54.5,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 57,
     "acc": 29.8,
     "adjustedAcc": 43.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 235,
     "acc": 56.2,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 16,
     "acc": 81.2,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 629,
   "globalBlend": 0.56
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3243,
    "diana": 0.0882,
    "nova": 0.2925,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 194,
     "acc": 47.9,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 46.4,
     "adjustedAcc": 49.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 133,
     "acc": 40.6,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 1,
     "acc": 0.0,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 356,
   "globalBlend": 0.692
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3321,
    "diana": 0.077,
    "nova": 0.3218,
    "flow": 0.2691
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 57.8,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 10.3,
     "adjustedAcc": 40.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 176,
     "acc": 64.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 35.6,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 511,
   "globalBlend": 0.61
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3101,
    "diana": 0.0788,
    "nova": 0.3151,
    "flow": 0.2959
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 42.1,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 42,
     "acc": 9.5,
     "adjustedAcc": 39.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 176,
     "acc": 56.2,
     "adjustedAcc": 53.7,
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
   "graded": 436,
   "globalBlend": 0.647
  },
  "로봇": {
   "weights": {
    "taro": 0.327,
    "diana": 0.0911,
    "nova": 0.3132,
    "flow": 0.2687
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 65.0,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 100.0,
     "adjustedAcc": 59.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 71.0,
     "adjustedAcc": 61.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 44.7,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 399,
   "globalBlend": 0.667
  },
  "식음료": {
   "weights": {
    "taro": 0.3095,
    "diana": 0.0955,
    "nova": 0.2961,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 34.9,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 77.8,
     "adjustedAcc": 55.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 129,
     "acc": 40.3,
     "adjustedAcc": 45.0,
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
   "graded": 325,
   "globalBlend": 0.711
  },
  "여행레저": {
   "weights": {
    "taro": 0.3368,
    "diana": 0.0773,
    "nova": 0.3054,
    "flow": 0.2806
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 65.3,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 16,
     "acc": 0.0,
     "adjustedAcc": 44.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 75,
     "acc": 57.3,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 33.3,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 219,
   "globalBlend": 0.785
  }
 }
};
