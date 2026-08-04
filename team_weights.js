// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 09:44",
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
   "taro": 0.3334,
   "diana": 0.071,
   "nova": 0.3091,
   "flow": 0.2865
  },
  "acc": {
   "taro": {
    "n": 7443,
    "acc": 59.8,
    "adjustedAcc": 59.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1232,
    "acc": 37.6,
    "adjustedAcc": 38.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6166,
    "acc": 59.6,
    "adjustedAcc": 59.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1291,
    "acc": 55.1,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 16132,
  "team": {
   "hit": 5820,
   "miss": 1460,
   "n": 7280,
   "acc": 79.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3495,
    "diana": 0.0757,
    "nova": 0.2488,
    "flow": 0.326
   },
   "acc": {
    "taro": {
     "n": 904,
     "acc": 66.4,
     "adjustedAcc": 64.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 113,
     "acc": 38.1,
     "adjustedAcc": 44.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 791,
     "acc": 51.8,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 286,
     "acc": 68.5,
     "adjustedAcc": 63.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2094,
   "globalBlend": 0.276
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3598,
    "diana": 0.073,
    "nova": 0.2861,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 445,
     "acc": 74.4,
     "adjustedAcc": 69.2,
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
     "n": 377,
     "acc": 62.9,
     "adjustedAcc": 59.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 126,
     "acc": 66.7,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1002,
   "globalBlend": 0.444
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3173,
    "diana": 0.0876,
    "nova": 0.3068,
    "flow": 0.2882
   },
   "acc": {
    "taro": {
     "n": 374,
     "acc": 53.2,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 62,
     "acc": 41.9,
     "adjustedAcc": 47.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 338,
     "acc": 56.8,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 68,
     "acc": 52.9,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 842,
   "globalBlend": 0.487
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3386,
    "diana": 0.0742,
    "nova": 0.3273,
    "flow": 0.2599
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
     "n": 59,
     "acc": 15.3,
     "adjustedAcc": 38.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 242,
     "acc": 65.3,
     "adjustedAcc": 60.2,
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
   "graded": 665,
   "globalBlend": 0.546
  },
  "통신": {
   "weights": {
    "taro": 0.324,
    "diana": 0.0804,
    "nova": 0.3051,
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
    "taro": 0.3066,
    "diana": 0.0956,
    "nova": 0.3097,
    "flow": 0.2881
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
     "n": 49,
     "acc": 63.3,
     "adjustedAcc": 53.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 279,
     "acc": 58.8,
     "adjustedAcc": 56.1,
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
   "graded": 692,
   "globalBlend": 0.536
  },
  "금융·증권": {
   "weights": {
    "taro": 0.342,
    "diana": 0.0761,
    "nova": 0.3206,
    "flow": 0.2614
   },
   "acc": {
    "taro": {
     "n": 428,
     "acc": 57.2,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 19.5,
     "adjustedAcc": 37.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 315,
     "acc": 58.4,
     "adjustedAcc": 56.1,
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
   "graded": 953,
   "globalBlend": 0.456
  },
  "2차전지": {
   "weights": {
    "taro": 0.3627,
    "diana": 0.0773,
    "nova": 0.3157,
    "flow": 0.2443
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 78.7,
     "adjustedAcc": 72.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 53.8,
     "adjustedAcc": 51.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 338,
     "acc": 74.3,
     "adjustedAcc": 67.9,
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
   "graded": 796,
   "globalBlend": 0.501
  },
  "보험": {
   "weights": {
    "taro": 0.3257,
    "diana": 0.0852,
    "nova": 0.3038,
    "flow": 0.2853
   },
   "acc": {
    "taro": {
     "n": 145,
     "acc": 53.1,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 23,
     "acc": 60.9,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 104,
     "acc": 54.8,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 45.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 305,
   "globalBlend": 0.724
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3338,
    "diana": 0.091,
    "nova": 0.3056,
    "flow": 0.2696
   },
   "acc": {
    "taro": {
     "n": 942,
     "acc": 63.9,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 161,
     "acc": 54.0,
     "adjustedAcc": 52.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 805,
     "acc": 63.2,
     "adjustedAcc": 61.5,
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
   "graded": 2029,
   "globalBlend": 0.283
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3261,
    "diana": 0.0847,
    "nova": 0.3287,
    "flow": 0.2605
   },
   "acc": {
    "taro": {
     "n": 429,
     "acc": 55.7,
     "adjustedAcc": 54.5,
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
     "n": 360,
     "acc": 62.5,
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
   "graded": 912,
   "globalBlend": 0.467
  },
  "조선": {
   "weights": {
    "taro": 0.3259,
    "diana": 0.0735,
    "nova": 0.3064,
    "flow": 0.2943
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 53.4,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 2.0,
     "adjustedAcc": 35.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 220,
     "acc": 55.0,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 55.6,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 553,
   "globalBlend": 0.591
  },
  "방산": {
   "weights": {
    "taro": 0.3275,
    "diana": 0.0789,
    "nova": 0.3062,
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
    "taro": 0.331,
    "diana": 0.0783,
    "nova": 0.3086,
    "flow": 0.2821
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 60.6,
     "adjustedAcc": 56.0,
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
     "n": 137,
     "acc": 62.0,
     "adjustedAcc": 56.4,
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
   "graded": 324,
   "globalBlend": 0.712
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3258,
    "diana": 0.073,
    "nova": 0.3055,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 542,
     "acc": 63.7,
     "adjustedAcc": 61.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 103,
     "acc": 35.0,
     "adjustedAcc": 43.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 466,
     "acc": 64.6,
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
   "graded": 1187,
   "globalBlend": 0.403
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3237,
    "diana": 0.0837,
    "nova": 0.3021,
    "flow": 0.2905
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
    "taro": 0.32,
    "diana": 0.0792,
    "nova": 0.304,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 54.1,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 57,
     "acc": 28.1,
     "adjustedAcc": 42.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 235,
     "acc": 57.0,
     "adjustedAcc": 54.6,
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
   "graded": 628,
   "globalBlend": 0.56
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3238,
    "diana": 0.0869,
    "nova": 0.2943,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 47.1,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 44.4,
     "adjustedAcc": 49.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 130,
     "acc": 41.5,
     "adjustedAcc": 45.6,
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
   "graded": 349,
   "globalBlend": 0.696
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3337,
    "diana": 0.076,
    "nova": 0.321,
    "flow": 0.2693
   },
   "acc": {
    "taro": {
     "n": 222,
     "acc": 58.1,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 41,
     "acc": 9.8,
     "adjustedAcc": 39.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 176,
     "acc": 63.6,
     "adjustedAcc": 58.1,
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
   "graded": 512,
   "globalBlend": 0.61
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3112,
    "diana": 0.0774,
    "nova": 0.3154,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 42.3,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 7.0,
     "adjustedAcc": 38.7,
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
    "taro": 0.3275,
    "diana": 0.0908,
    "nova": 0.3132,
    "flow": 0.2685
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
     "n": 30,
     "acc": 100.0,
     "adjustedAcc": 60.0,
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
   "graded": 400,
   "globalBlend": 0.667
  },
  "식음료": {
   "weights": {
    "taro": 0.31,
    "diana": 0.0948,
    "nova": 0.2963,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 34.5,
     "adjustedAcc": 41.0,
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
     "n": 127,
     "acc": 40.2,
     "adjustedAcc": 44.9,
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
  "여행레저": {
   "weights": {
    "taro": 0.338,
    "diana": 0.0765,
    "nova": 0.305,
    "flow": 0.2805
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 65.6,
     "adjustedAcc": 56.9,
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
     "n": 76,
     "acc": 56.6,
     "adjustedAcc": 52.6,
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
   "graded": 221,
   "globalBlend": 0.784
  }
 }
};
