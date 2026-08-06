// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-06 12:39",
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
   "taro": 0.289,
   "diana": 0.0774,
   "nova": 0.3472,
   "flow": 0.2864
  },
  "acc": {
   "taro": {
    "n": 8292,
    "acc": 54.8,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1795,
    "acc": 40.8,
    "adjustedAcc": 41.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7129,
    "acc": 63.4,
    "adjustedAcc": 63.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1453,
    "acc": 54.8,
    "adjustedAcc": 54.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 18669,
  "team": {
   "hit": 5968,
   "miss": 1788,
   "n": 7756,
   "acc": 76.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2956,
    "diana": 0.0758,
    "nova": 0.291,
    "flow": 0.3377
   },
   "acc": {
    "taro": {
     "n": 1008,
     "acc": 58.8,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 169,
     "acc": 37.3,
     "adjustedAcc": 42.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 896,
     "acc": 58.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 313,
     "acc": 69.0,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2386,
   "globalBlend": 0.251
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3127,
    "diana": 0.0791,
    "nova": 0.3239,
    "flow": 0.2843
   },
   "acc": {
    "taro": {
     "n": 496,
     "acc": 66.7,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 78,
     "acc": 42.3,
     "adjustedAcc": 47.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 428,
     "acc": 67.3,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 142,
     "acc": 65.5,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1144,
   "globalBlend": 0.412
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2752,
    "diana": 0.0915,
    "nova": 0.3496,
    "flow": 0.2837
   },
   "acc": {
    "taro": {
     "n": 415,
     "acc": 47.2,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 88,
     "acc": 43.2,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 384,
     "acc": 62.8,
     "adjustedAcc": 59.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 78,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 965,
   "globalBlend": 0.453
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.301,
    "diana": 0.0781,
    "nova": 0.3627,
    "flow": 0.2583
   },
   "acc": {
    "taro": {
     "n": 324,
     "acc": 54.9,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 82,
     "acc": 20.7,
     "adjustedAcc": 38.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 277,
     "acc": 67.5,
     "adjustedAcc": 62.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 75,
     "acc": 32.0,
     "adjustedAcc": 43.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 758,
   "globalBlend": 0.513
  },
  "통신": {
   "weights": {
    "taro": 0.2859,
    "diana": 0.0853,
    "nova": 0.338,
    "flow": 0.2908
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 52.3,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 41.7,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 127,
     "acc": 65.4,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 62.3,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 357,
   "globalBlend": 0.691
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.275,
    "diana": 0.1087,
    "nova": 0.3339,
    "flow": 0.2824
   },
   "acc": {
    "taro": {
     "n": 369,
     "acc": 48.0,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 78,
     "acc": 70.5,
     "adjustedAcc": 58.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 326,
     "acc": 60.4,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 44,
     "acc": 52.3,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 817,
   "globalBlend": 0.495
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2989,
    "diana": 0.0772,
    "nova": 0.3642,
    "flow": 0.2597
   },
   "acc": {
    "taro": {
     "n": 484,
     "acc": 51.7,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 22.4,
     "adjustedAcc": 35.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 374,
     "acc": 63.9,
     "adjustedAcc": 60.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 134,
     "acc": 37.3,
     "adjustedAcc": 43.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1117,
   "globalBlend": 0.417
  },
  "2차전지": {
   "weights": {
    "taro": 0.317,
    "diana": 0.083,
    "nova": 0.3583,
    "flow": 0.2417
   },
   "acc": {
    "taro": {
     "n": 449,
     "acc": 70.6,
     "adjustedAcc": 66.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 72,
     "acc": 54.2,
     "adjustedAcc": 51.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 384,
     "acc": 77.6,
     "adjustedAcc": 71.0,
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
   "graded": 910,
   "globalBlend": 0.468
  },
  "보험": {
   "weights": {
    "taro": 0.2878,
    "diana": 0.0919,
    "nova": 0.3352,
    "flow": 0.2851
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 64.5,
     "adjustedAcc": 53.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 126,
     "acc": 59.5,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 35,
     "acc": 48.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 354,
   "globalBlend": 0.693
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2937,
    "diana": 0.095,
    "nova": 0.3405,
    "flow": 0.2709
   },
   "acc": {
    "taro": {
     "n": 1051,
     "acc": 59.1,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 222,
     "acc": 54.5,
     "adjustedAcc": 52.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 928,
     "acc": 66.9,
     "adjustedAcc": 65.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 129,
     "acc": 58.9,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2330,
   "globalBlend": 0.256
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.0916,
    "nova": 0.3614,
    "flow": 0.2593
   },
   "acc": {
    "taro": {
     "n": 469,
     "acc": 51.4,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 44.8,
     "adjustedAcc": 47.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 416,
     "acc": 65.6,
     "adjustedAcc": 62.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 30.0,
     "adjustedAcc": 45.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1050,
   "globalBlend": 0.432
  },
  "조선": {
   "weights": {
    "taro": 0.2872,
    "diana": 0.0809,
    "nova": 0.3394,
    "flow": 0.2925
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 48.4,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 69,
     "acc": 20.3,
     "adjustedAcc": 39.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 58.9,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 46,
     "acc": 52.2,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 643,
   "globalBlend": 0.554
  },
  "방산": {
   "weights": {
    "taro": 0.287,
    "diana": 0.0842,
    "nova": 0.3411,
    "flow": 0.2878
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 48.0,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 17,
     "acc": 29.4,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 97,
     "acc": 62.9,
     "adjustedAcc": 55.8,
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
   "graded": 238,
   "globalBlend": 0.771
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2934,
    "diana": 0.0867,
    "nova": 0.3383,
    "flow": 0.2816
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 56.3,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 47.8,
     "adjustedAcc": 49.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 159,
     "acc": 63.5,
     "adjustedAcc": 57.7,
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
   "graded": 372,
   "globalBlend": 0.683
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2877,
    "diana": 0.0781,
    "nova": 0.3376,
    "flow": 0.2966
   },
   "acc": {
    "taro": {
     "n": 600,
     "acc": 58.0,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 155,
     "acc": 39.4,
     "adjustedAcc": 44.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 535,
     "acc": 66.9,
     "adjustedAcc": 63.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 82,
     "acc": 70.7,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1372,
   "globalBlend": 0.368
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2862,
    "diana": 0.0923,
    "nova": 0.3284,
    "flow": 0.2931
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 45.6,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 69.0,
     "adjustedAcc": 53.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 78,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 74,
     "acc": 54.1,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 295,
   "globalBlend": 0.731
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2925,
    "diana": 0.0822,
    "nova": 0.3302,
    "flow": 0.2951
   },
   "acc": {
    "taro": {
     "n": 357,
     "acc": 52.7,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 88,
     "acc": 30.7,
     "adjustedAcc": 41.8,
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
     "n": 18,
     "acc": 72.2,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 743,
   "globalBlend": 0.518
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2912,
    "diana": 0.0928,
    "nova": 0.3175,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 47.5,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 42,
     "acc": 47.6,
     "adjustedAcc": 49.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 157,
     "acc": 43.9,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 7,
     "acc": 71.4,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 423,
   "globalBlend": 0.654
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2936,
    "diana": 0.0807,
    "nova": 0.3547,
    "flow": 0.2711
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 53.8,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 55,
     "acc": 21.8,
     "adjustedAcc": 41.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 204,
     "acc": 68.1,
     "adjustedAcc": 61.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 41.7,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 590,
   "globalBlend": 0.576
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2758,
    "diana": 0.0785,
    "nova": 0.3481,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 38.4,
     "adjustedAcc": 42.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 67,
     "acc": 6.0,
     "adjustedAcc": 34.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 209,
     "acc": 57.9,
     "adjustedAcc": 55.0,
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
   "graded": 522,
   "globalBlend": 0.605
  },
  "로봇": {
   "weights": {
    "taro": 0.2912,
    "diana": 0.0907,
    "nova": 0.3529,
    "flow": 0.2652
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 58.4,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 65.1,
     "adjustedAcc": 54.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 175,
     "acc": 74.3,
     "adjustedAcc": 64.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 45,
     "acc": 37.8,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 460,
   "globalBlend": 0.635
  },
  "식음료": {
   "weights": {
    "taro": 0.2785,
    "diana": 0.1029,
    "nova": 0.321,
    "flow": 0.2976
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 37.2,
     "adjustedAcc": 42.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 71.7,
     "adjustedAcc": 56.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 153,
     "acc": 42.5,
     "adjustedAcc": 45.8,
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
   "graded": 388,
   "globalBlend": 0.673
  },
  "여행레저": {
   "weights": {
    "taro": 0.3007,
    "diana": 0.0806,
    "nova": 0.3382,
    "flow": 0.2805
   },
   "acc": {
    "taro": {
     "n": 107,
     "acc": 59.8,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 25,
     "acc": 0.0,
     "adjustedAcc": 41.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 87,
     "acc": 59.8,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 34.2,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 257,
   "globalBlend": 0.757
  }
 }
};
