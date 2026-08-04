// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 15:50",
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
   "taro": 0.3307,
   "diana": 0.0719,
   "nova": 0.3121,
   "flow": 0.2853
  },
  "acc": {
   "taro": {
    "n": 7456,
    "acc": 59.6,
    "adjustedAcc": 59.4,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1228,
    "acc": 38.0,
    "adjustedAcc": 39.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6182,
    "acc": 60.0,
    "adjustedAcc": 59.8,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1291,
    "acc": 54.9,
    "adjustedAcc": 54.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 16157,
  "team": {
   "hit": 5777,
   "miss": 1469,
   "n": 7246,
   "acc": 79.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3434,
    "diana": 0.075,
    "nova": 0.2538,
    "flow": 0.3278
   },
   "acc": {
    "taro": {
     "n": 905,
     "acc": 65.5,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 114,
     "acc": 36.8,
     "adjustedAcc": 43.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 792,
     "acc": 52.8,
     "adjustedAcc": 52.4,
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
   "graded": 2097,
   "globalBlend": 0.276
  },
  "전자·부품": {
   "weights": {
    "taro": 0.356,
    "diana": 0.0735,
    "nova": 0.2898,
    "flow": 0.2807
   },
   "acc": {
    "taro": {
     "n": 446,
     "acc": 73.8,
     "adjustedAcc": 68.7,
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
     "n": 378,
     "acc": 63.5,
     "adjustedAcc": 60.2,
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
   "graded": 1004,
   "globalBlend": 0.443
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3135,
    "diana": 0.0878,
    "nova": 0.3127,
    "flow": 0.286
   },
   "acc": {
    "taro": {
     "n": 373,
     "acc": 52.3,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 61,
     "acc": 41.0,
     "adjustedAcc": 47.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 337,
     "acc": 57.9,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 68,
     "acc": 51.5,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 839,
   "globalBlend": 0.488
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3362,
    "diana": 0.0752,
    "nova": 0.33,
    "flow": 0.2586
   },
   "acc": {
    "taro": {
     "n": 294,
     "acc": 60.2,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 57,
     "acc": 15.8,
     "adjustedAcc": 39.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 241,
     "acc": 65.6,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 69,
     "acc": 31.9,
     "adjustedAcc": 43.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 661,
   "globalBlend": 0.548
  },
  "통신": {
   "weights": {
    "taro": 0.3221,
    "diana": 0.0811,
    "nova": 0.3073,
    "flow": 0.2896
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
    "taro": 0.3054,
    "diana": 0.0966,
    "nova": 0.3105,
    "flow": 0.2874
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
     "n": 280,
     "acc": 58.6,
     "adjustedAcc": 56.0,
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
   "graded": 693,
   "globalBlend": 0.536
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3377,
    "diana": 0.0765,
    "nova": 0.3256,
    "flow": 0.2602
   },
   "acc": {
    "taro": {
     "n": 432,
     "acc": 56.5,
     "adjustedAcc": 55.1,
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
     "n": 319,
     "acc": 59.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 124,
     "acc": 36.3,
     "adjustedAcc": 43.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 962,
   "globalBlend": 0.454
  },
  "2차전지": {
   "weights": {
    "taro": 0.3603,
    "diana": 0.0777,
    "nova": 0.3183,
    "flow": 0.2437
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 78.5,
     "adjustedAcc": 71.9,
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
     "acc": 74.6,
     "adjustedAcc": 68.1,
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
    "taro": 0.3234,
    "diana": 0.086,
    "nova": 0.306,
    "flow": 0.2845
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 52.7,
     "adjustedAcc": 51.5,
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
     "n": 106,
     "acc": 54.7,
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
   "graded": 308,
   "globalBlend": 0.722
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3326,
    "diana": 0.0922,
    "nova": 0.3067,
    "flow": 0.2685
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
     "acc": 55.1,
     "adjustedAcc": 52.9,
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
    "taro": 0.3244,
    "diana": 0.0853,
    "nova": 0.3307,
    "flow": 0.2596
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
     "n": 85,
     "acc": 38.8,
     "adjustedAcc": 45.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 360,
     "acc": 62.8,
     "adjustedAcc": 59.6,
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
   "graded": 911,
   "globalBlend": 0.468
  },
  "조선": {
   "weights": {
    "taro": 0.3241,
    "diana": 0.0746,
    "nova": 0.3094,
    "flow": 0.292
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 53.0,
     "adjustedAcc": 52.0,
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
     "n": 221,
     "acc": 55.2,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 52.8,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 555,
   "globalBlend": 0.59
  },
  "방산": {
   "weights": {
    "taro": 0.3254,
    "diana": 0.0796,
    "nova": 0.3086,
    "flow": 0.2864
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
    "taro": 0.3279,
    "diana": 0.0792,
    "nova": 0.3116,
    "flow": 0.2812
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 60.0,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 32.3,
     "adjustedAcc": 46.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 137,
     "acc": 62.8,
     "adjustedAcc": 56.8,
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
   "graded": 323,
   "globalBlend": 0.712
  },
  "화학·소재": {
   "weights": {
    "taro": 0.324,
    "diana": 0.0743,
    "nova": 0.307,
    "flow": 0.2947
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
     "acc": 36.8,
     "adjustedAcc": 43.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 466,
     "acc": 64.8,
     "adjustedAcc": 61.8,
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
    "taro": 0.3216,
    "diana": 0.0844,
    "nova": 0.3044,
    "flow": 0.2896
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
    "taro": 0.3196,
    "diana": 0.0808,
    "nova": 0.3037,
    "flow": 0.2959
   },
   "acc": {
    "taro": {
     "n": 323,
     "acc": 54.5,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 58,
     "acc": 31.0,
     "adjustedAcc": 43.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 238,
     "acc": 56.3,
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
   "graded": 635,
   "globalBlend": 0.557
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3231,
    "diana": 0.0881,
    "nova": 0.2947,
    "flow": 0.2941
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
    "taro": 0.331,
    "diana": 0.077,
    "nova": 0.3238,
    "flow": 0.2683
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
    "taro": 0.3089,
    "diana": 0.0788,
    "nova": 0.3172,
    "flow": 0.2951
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
    "taro": 0.3262,
    "diana": 0.09,
    "nova": 0.3157,
    "flow": 0.2681
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
     "n": 28,
     "acc": 96.4,
     "adjustedAcc": 58.8,
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
   "graded": 398,
   "globalBlend": 0.668
  },
  "식음료": {
   "weights": {
    "taro": 0.3083,
    "diana": 0.0953,
    "nova": 0.2986,
    "flow": 0.2978
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 35.1,
     "adjustedAcc": 41.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 75.9,
     "adjustedAcc": 55.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 128,
     "acc": 40.6,
     "adjustedAcc": 45.2,
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
    "taro": 0.3349,
    "diana": 0.0772,
    "nova": 0.3084,
    "flow": 0.2795
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 64.6,
     "adjustedAcc": 56.5,
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
     "acc": 57.9,
     "adjustedAcc": 53.1,
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
