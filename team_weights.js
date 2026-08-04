// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 10:14",
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
   "taro": 0.3349,
   "diana": 0.0705,
   "nova": 0.3071,
   "flow": 0.2875
  },
  "acc": {
   "taro": {
    "n": 7446,
    "acc": 60.0,
    "adjustedAcc": 59.8,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1235,
    "acc": 37.3,
    "adjustedAcc": 38.5,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6167,
    "acc": 59.4,
    "adjustedAcc": 59.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1292,
    "acc": 55.2,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 16140,
  "team": {
   "hit": 5825,
   "miss": 1452,
   "n": 7277,
   "acc": 80.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3508,
    "diana": 0.0755,
    "nova": 0.2472,
    "flow": 0.3266
   },
   "acc": {
    "taro": {
     "n": 903,
     "acc": 66.6,
     "adjustedAcc": 64.6,
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
     "n": 790,
     "acc": 51.6,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 287,
     "acc": 68.6,
     "adjustedAcc": 63.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2093,
   "globalBlend": 0.277
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3617,
    "diana": 0.0727,
    "nova": 0.2843,
    "flow": 0.2812
   },
   "acc": {
    "taro": {
     "n": 443,
     "acc": 74.7,
     "adjustedAcc": 69.4,
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
     "n": 375,
     "acc": 62.7,
     "adjustedAcc": 59.6,
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
   "graded": 998,
   "globalBlend": 0.445
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3181,
    "diana": 0.0869,
    "nova": 0.305,
    "flow": 0.29
   },
   "acc": {
    "taro": {
     "n": 372,
     "acc": 53.2,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 41.3,
     "adjustedAcc": 47.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 336,
     "acc": 56.5,
     "adjustedAcc": 54.8,
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
   "graded": 838,
   "globalBlend": 0.488
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3401,
    "diana": 0.074,
    "nova": 0.3252,
    "flow": 0.2606
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 60.7,
     "adjustedAcc": 57.6,
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
     "acc": 64.9,
     "adjustedAcc": 59.9,
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
   "graded": 666,
   "globalBlend": 0.546
  },
  "통신": {
   "weights": {
    "taro": 0.3251,
    "diana": 0.0801,
    "nova": 0.3037,
    "flow": 0.2912
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
    "taro": 0.3074,
    "diana": 0.0954,
    "nova": 0.3086,
    "flow": 0.2887
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
    "taro": 0.344,
    "diana": 0.0758,
    "nova": 0.3176,
    "flow": 0.2626
   },
   "acc": {
    "taro": {
     "n": 431,
     "acc": 57.5,
     "adjustedAcc": 55.9,
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
     "n": 318,
     "acc": 57.9,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 124,
     "acc": 37.1,
     "adjustedAcc": 43.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 960,
   "globalBlend": 0.455
  },
  "2차전지": {
   "weights": {
    "taro": 0.3647,
    "diana": 0.0767,
    "nova": 0.3138,
    "flow": 0.2448
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 79.0,
     "adjustedAcc": 72.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 52.8,
     "adjustedAcc": 50.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 338,
     "acc": 74.0,
     "adjustedAcc": 67.7,
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
   "graded": 797,
   "globalBlend": 0.501
  },
  "보험": {
   "weights": {
    "taro": 0.3275,
    "diana": 0.0845,
    "nova": 0.302,
    "flow": 0.2861
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
     "n": 103,
     "acc": 54.4,
     "adjustedAcc": 52.0,
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
   "graded": 304,
   "globalBlend": 0.725
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3353,
    "diana": 0.0909,
    "nova": 0.3039,
    "flow": 0.2699
   },
   "acc": {
    "taro": {
     "n": 941,
     "acc": 64.1,
     "adjustedAcc": 62.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 159,
     "acc": 54.1,
     "adjustedAcc": 52.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 804,
     "acc": 63.1,
     "adjustedAcc": 61.4,
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
   "graded": 2025,
   "globalBlend": 0.283
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3272,
    "diana": 0.0835,
    "nova": 0.3281,
    "flow": 0.2612
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
     "acc": 36.8,
     "adjustedAcc": 44.4,
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
    "taro": 0.3268,
    "diana": 0.0732,
    "nova": 0.3052,
    "flow": 0.2949
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
    "taro": 0.3287,
    "diana": 0.0785,
    "nova": 0.3046,
    "flow": 0.2882
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
    "taro": 0.332,
    "diana": 0.078,
    "nova": 0.3071,
    "flow": 0.2829
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
    "taro": 0.3271,
    "diana": 0.0729,
    "nova": 0.3037,
    "flow": 0.2963
   },
   "acc": {
    "taro": {
     "n": 544,
     "acc": 63.8,
     "adjustedAcc": 61.3,
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
     "n": 468,
     "acc": 64.3,
     "adjustedAcc": 61.4,
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
   "graded": 1191,
   "globalBlend": 0.402
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3248,
    "diana": 0.0833,
    "nova": 0.3005,
    "flow": 0.2913
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
    "taro": 0.3217,
    "diana": 0.0791,
    "nova": 0.3016,
    "flow": 0.2977
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 54.2,
     "adjustedAcc": 53.1,
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
     "n": 236,
     "acc": 56.4,
     "adjustedAcc": 54.2,
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
   "graded": 630,
   "globalBlend": 0.559
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3262,
    "diana": 0.0867,
    "nova": 0.2915,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 47.9,
     "adjustedAcc": 48.7,
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
     "acc": 40.5,
     "adjustedAcc": 45.0,
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
    "taro": 0.3349,
    "diana": 0.0757,
    "nova": 0.3196,
    "flow": 0.2697
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 58.3,
     "adjustedAcc": 55.4,
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
   "graded": 513,
   "globalBlend": 0.609
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3117,
    "diana": 0.0777,
    "nova": 0.3141,
    "flow": 0.2966
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
     "n": 43,
     "acc": 9.3,
     "adjustedAcc": 39.3,
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
   "graded": 437,
   "globalBlend": 0.647
  },
  "로봇": {
   "weights": {
    "taro": 0.3286,
    "diana": 0.0901,
    "nova": 0.312,
    "flow": 0.2693
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
    "taro": 0.3114,
    "diana": 0.0941,
    "nova": 0.2945,
    "flow": 0.2999
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
     "n": 28,
     "acc": 75.0,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 128,
     "acc": 39.8,
     "adjustedAcc": 44.8,
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
    "taro": 0.3392,
    "diana": 0.0761,
    "nova": 0.3034,
    "flow": 0.2812
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
