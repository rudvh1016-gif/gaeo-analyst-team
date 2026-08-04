// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 11:13",
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
   "taro": 0.332,
   "diana": 0.0708,
   "nova": 0.3103,
   "flow": 0.2869
  },
  "acc": {
   "taro": {
    "n": 7443,
    "acc": 59.7,
    "adjustedAcc": 59.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1240,
    "acc": 37.5,
    "adjustedAcc": 38.6,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6165,
    "acc": 59.8,
    "adjustedAcc": 59.6,
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
  "graded": 16136,
  "team": {
   "hit": 5793,
   "miss": 1465,
   "n": 7258,
   "acc": 79.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3464,
    "diana": 0.0754,
    "nova": 0.2515,
    "flow": 0.3266
   },
   "acc": {
    "taro": {
     "n": 906,
     "acc": 65.9,
     "adjustedAcc": 64.0,
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
     "n": 793,
     "acc": 52.3,
     "adjustedAcc": 52.0,
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
   "graded": 2099,
   "globalBlend": 0.276
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3573,
    "diana": 0.0729,
    "nova": 0.2879,
    "flow": 0.282
   },
   "acc": {
    "taro": {
     "n": 444,
     "acc": 74.1,
     "adjustedAcc": 69.0,
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
     "acc": 63.3,
     "adjustedAcc": 60.1,
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
    "taro": 0.3152,
    "diana": 0.0874,
    "nova": 0.308,
    "flow": 0.2895
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
     "acc": 41.9,
     "adjustedAcc": 47.3,
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
     "n": 67,
     "acc": 53.7,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 835,
   "globalBlend": 0.489
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.338,
    "diana": 0.0742,
    "nova": 0.3276,
    "flow": 0.2602
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
   "graded": 664,
   "globalBlend": 0.546
  },
  "통신": {
   "weights": {
    "taro": 0.323,
    "diana": 0.0803,
    "nova": 0.306,
    "flow": 0.2908
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
    "taro": 0.3058,
    "diana": 0.0955,
    "nova": 0.3103,
    "flow": 0.2883
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
    "taro": 0.3394,
    "diana": 0.0757,
    "nova": 0.3236,
    "flow": 0.2612
   },
   "acc": {
    "taro": {
     "n": 429,
     "acc": 56.6,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 86,
     "acc": 18.6,
     "adjustedAcc": 36.9,
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
     "n": 122,
     "acc": 36.1,
     "adjustedAcc": 43.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 953,
   "globalBlend": 0.456
  },
  "2차전지": {
   "weights": {
    "taro": 0.3625,
    "diana": 0.0772,
    "nova": 0.3157,
    "flow": 0.2445
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 78.8,
     "adjustedAcc": 72.2,
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
     "n": 339,
     "acc": 74.0,
     "adjustedAcc": 67.8,
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
   "graded": 798,
   "globalBlend": 0.501
  },
  "보험": {
   "weights": {
    "taro": 0.3248,
    "diana": 0.0848,
    "nova": 0.3048,
    "flow": 0.2857
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
     "n": 24,
     "acc": 58.3,
     "adjustedAcc": 51.4,
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
   "graded": 306,
   "globalBlend": 0.723
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3337,
    "diana": 0.0906,
    "nova": 0.3061,
    "flow": 0.2696
   },
   "acc": {
    "taro": {
     "n": 941,
     "acc": 64.0,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 158,
     "acc": 53.8,
     "adjustedAcc": 52.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 804,
     "acc": 63.3,
     "adjustedAcc": 61.6,
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
    "taro": 0.3256,
    "diana": 0.0843,
    "nova": 0.3293,
    "flow": 0.2608
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
     "n": 87,
     "acc": 37.9,
     "adjustedAcc": 44.9,
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
   "graded": 913,
   "globalBlend": 0.467
  },
  "조선": {
   "weights": {
    "taro": 0.325,
    "diana": 0.0737,
    "nova": 0.3069,
    "flow": 0.2944
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
     "n": 51,
     "acc": 3.9,
     "adjustedAcc": 36.3,
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
   "graded": 554,
   "globalBlend": 0.591
  },
  "방산": {
   "weights": {
    "taro": 0.3264,
    "diana": 0.0787,
    "nova": 0.3072,
    "flow": 0.2877
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
    "taro": 0.33,
    "diana": 0.0782,
    "nova": 0.3094,
    "flow": 0.2824
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
    "taro": 0.325,
    "diana": 0.0734,
    "nova": 0.3058,
    "flow": 0.2958
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
     "n": 106,
     "acc": 35.8,
     "adjustedAcc": 43.4,
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
   "graded": 1190,
   "globalBlend": 0.402
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3226,
    "diana": 0.0836,
    "nova": 0.303,
    "flow": 0.2908
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
    "taro": 0.3186,
    "diana": 0.0795,
    "nova": 0.3051,
    "flow": 0.2968
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 53.9,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 58,
     "acc": 29.3,
     "adjustedAcc": 43.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 236,
     "acc": 57.2,
     "adjustedAcc": 54.8,
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
   "graded": 631,
   "globalBlend": 0.559
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3232,
    "diana": 0.0869,
    "nova": 0.2946,
    "flow": 0.2953
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 47.4,
     "adjustedAcc": 48.4,
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
     "n": 131,
     "acc": 41.2,
     "adjustedAcc": 45.4,
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
   "graded": 351,
   "globalBlend": 0.695
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3322,
    "diana": 0.0759,
    "nova": 0.3224,
    "flow": 0.2695
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 57.9,
     "adjustedAcc": 55.1,
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
     "n": 175,
     "acc": 64.0,
     "adjustedAcc": 58.3,
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
   "graded": 510,
   "globalBlend": 0.611
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3098,
    "diana": 0.0777,
    "nova": 0.3162,
    "flow": 0.2963
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
     "n": 44,
     "acc": 9.1,
     "adjustedAcc": 39.0,
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
   "graded": 438,
   "globalBlend": 0.646
  },
  "로봇": {
   "weights": {
    "taro": 0.3267,
    "diana": 0.0903,
    "nova": 0.3141,
    "flow": 0.2689
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
    "taro": 0.3089,
    "diana": 0.0943,
    "nova": 0.2972,
    "flow": 0.2995
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
     "n": 30,
     "acc": 73.3,
     "adjustedAcc": 54.7,
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
   "graded": 325,
   "globalBlend": 0.711
  },
  "여행레저": {
   "weights": {
    "taro": 0.3369,
    "diana": 0.0764,
    "nova": 0.3059,
    "flow": 0.2808
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
