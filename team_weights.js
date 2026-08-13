// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-13 14:53",
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
   "taro": 0.2819,
   "diana": 0.1073,
   "nova": 0.2949,
   "flow": 0.3159
  },
  "acc": {
   "taro": {
    "n": 10040,
    "acc": 53.1,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3353,
    "acc": 51.4,
    "adjustedAcc": 51.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8943,
    "acc": 57.0,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1820,
    "acc": 57.3,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 24156,
  "team": {
   "hit": 6736,
   "miss": 2715,
   "n": 9451,
   "acc": 71.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2824,
    "diana": 0.0867,
    "nova": 0.264,
    "flow": 0.3669
   },
   "acc": {
    "taro": {
     "n": 1209,
     "acc": 53.3,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 308,
     "acc": 38.0,
     "adjustedAcc": 41.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1101,
     "acc": 51.9,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 377,
     "acc": 67.4,
     "adjustedAcc": 63.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2995,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3004,
    "diana": 0.1009,
    "nova": 0.2855,
    "flow": 0.3131
   },
   "acc": {
    "taro": {
     "n": 589,
     "acc": 60.3,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 144,
     "acc": 50.7,
     "adjustedAcc": 50.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 530,
     "acc": 59.1,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 170,
     "acc": 64.7,
     "adjustedAcc": 58.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1433,
   "globalBlend": 0.358
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2625,
    "diana": 0.1198,
    "nova": 0.3173,
    "flow": 0.3003
   },
   "acc": {
    "taro": {
     "n": 503,
     "acc": 44.1,
     "adjustedAcc": 45.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 176,
     "acc": 55.7,
     "adjustedAcc": 53.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 479,
     "acc": 58.7,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 107,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1265,
   "globalBlend": 0.387
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1015,
    "nova": 0.3181,
    "flow": 0.2789
   },
   "acc": {
    "taro": {
     "n": 385,
     "acc": 53.2,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 152,
     "acc": 38.2,
     "adjustedAcc": 43.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 347,
     "acc": 59.1,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 90,
     "acc": 36.7,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 974,
   "globalBlend": 0.451
  },
  "통신": {
   "weights": {
    "taro": 0.2808,
    "diana": 0.1062,
    "nova": 0.296,
    "flow": 0.3169
   },
   "acc": {
    "taro": {
     "n": 180,
     "acc": 52.2,
     "adjustedAcc": 51.3,
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
     "n": 154,
     "acc": 60.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 70,
     "acc": 65.7,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 449,
   "globalBlend": 0.641
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2851,
    "diana": 0.1423,
    "nova": 0.2741,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 462,
     "acc": 53.2,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 164,
     "acc": 76.2,
     "adjustedAcc": 65.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 413,
     "acc": 51.8,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 56.9,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1104,
   "globalBlend": 0.42
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2942,
    "diana": 0.0924,
    "nova": 0.3225,
    "flow": 0.2909
   },
   "acc": {
    "taro": {
     "n": 569,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 215,
     "acc": 31.2,
     "adjustedAcc": 37.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 470,
     "acc": 57.7,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 158,
     "acc": 44.9,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1412,
   "globalBlend": 0.362
  },
  "2차전지": {
   "weights": {
    "taro": 0.3167,
    "diana": 0.1019,
    "nova": 0.3183,
    "flow": 0.2631
   },
   "acc": {
    "taro": {
     "n": 528,
     "acc": 65.0,
     "adjustedAcc": 62.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 126,
     "acc": 52.4,
     "adjustedAcc": 51.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 475,
     "acc": 67.4,
     "adjustedAcc": 63.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 14,
     "acc": 35.7,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1143,
   "globalBlend": 0.412
  },
  "보험": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1228,
    "nova": 0.291,
    "flow": 0.3061
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 48.7,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 67,
     "acc": 76.1,
     "adjustedAcc": 59.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 54.2,
     "adjustedAcc": 52.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 52.5,
     "adjustedAcc": 50.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 453,
   "globalBlend": 0.638
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.1108,
    "nova": 0.29,
    "flow": 0.3044
   },
   "acc": {
    "taro": {
     "n": 1301,
     "acc": 58.3,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 418,
     "acc": 56.9,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1183,
     "acc": 59.6,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 162,
     "acc": 63.6,
     "adjustedAcc": 57.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3064,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1194,
    "nova": 0.3222,
    "flow": 0.2792
   },
   "acc": {
    "taro": {
     "n": 570,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 236,
     "acc": 56.4,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 515,
     "acc": 60.8,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 41.5,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1374,
   "globalBlend": 0.368
  },
  "조선": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1135,
    "nova": 0.3037,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 45.7,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 121,
     "acc": 51.2,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 314,
     "acc": 56.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 52.5,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 824,
   "globalBlend": 0.493
  },
  "방산": {
   "weights": {
    "taro": 0.2802,
    "diana": 0.1079,
    "nova": 0.2974,
    "flow": 0.3146
   },
   "acc": {
    "taro": {
     "n": 147,
     "acc": 46.3,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 29,
     "acc": 37.9,
     "adjustedAcc": 47.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 123,
     "acc": 56.9,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 5,
     "acc": 100.0,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 304,
   "globalBlend": 0.725
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2947,
    "diana": 0.1227,
    "nova": 0.2832,
    "flow": 0.2993
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 58.7,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 91,
     "acc": 74.7,
     "adjustedAcc": 60.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 199,
     "acc": 52.8,
     "adjustedAcc": 51.7,
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
   "graded": 487,
   "globalBlend": 0.622
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2832,
    "diana": 0.1045,
    "nova": 0.2991,
    "flow": 0.3132
   },
   "acc": {
    "taro": {
     "n": 724,
     "acc": 54.6,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 290,
     "acc": 51.0,
     "adjustedAcc": 50.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 669,
     "acc": 59.6,
     "adjustedAcc": 58.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 92,
     "acc": 66.3,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1775,
   "globalBlend": 0.311
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.1248,
    "nova": 0.2805,
    "flow": 0.3186
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 44.4,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 53,
     "acc": 84.9,
     "adjustedAcc": 60.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 107,
     "acc": 44.9,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 96,
     "acc": 58.3,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 400,
   "globalBlend": 0.667
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2962,
    "diana": 0.1036,
    "nova": 0.2923,
    "flow": 0.3079
   },
   "acc": {
    "taro": {
     "n": 442,
     "acc": 54.5,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 164,
     "acc": 44.5,
     "adjustedAcc": 46.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 355,
     "acc": 55.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 20,
     "acc": 70.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 981,
   "globalBlend": 0.449
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2852,
    "diana": 0.1177,
    "nova": 0.2716,
    "flow": 0.3254
   },
   "acc": {
    "taro": {
     "n": 267,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 78,
     "acc": 61.5,
     "adjustedAcc": 54.5,
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
     "n": 21,
     "acc": 85.7,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 570,
   "globalBlend": 0.584
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2898,
    "diana": 0.1082,
    "nova": 0.3104,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 53.2,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 99,
     "acc": 48.5,
     "adjustedAcc": 49.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 61.3,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 109,
     "acc": 46.8,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 760,
   "globalBlend": 0.513
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1021,
    "nova": 0.306,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 39.7,
     "adjustedAcc": 42.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 123,
     "acc": 29.3,
     "adjustedAcc": 39.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 268,
     "acc": 51.9,
     "adjustedAcc": 51.3,
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
   "graded": 687,
   "globalBlend": 0.538
  },
  "기계": {
   "weights": {
    "taro": 0.2724,
    "diana": 0.1131,
    "nova": 0.2961,
    "flow": 0.3185
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 34.0,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 64.9,
     "adjustedAcc": 53.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 97,
     "acc": 55.7,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 8,
     "acc": 100.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 239,
   "globalBlend": 0.77
  },
  "로봇": {
   "weights": {
    "taro": 0.2987,
    "diana": 0.1001,
    "nova": 0.3145,
    "flow": 0.2866
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 59.2,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 35.4,
     "adjustedAcc": 44.2,
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
     "n": 54,
     "acc": 40.7,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 579,
   "globalBlend": 0.58
  },
  "식음료": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1415,
    "nova": 0.2738,
    "flow": 0.3075
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 45.7,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 99,
     "acc": 84.8,
     "adjustedAcc": 65.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 211,
     "acc": 43.6,
     "adjustedAcc": 45.9,
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
   "graded": 568,
   "globalBlend": 0.585
  },
  "여행레저": {
   "weights": {
    "taro": 0.2954,
    "diana": 0.1018,
    "nova": 0.297,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 56.2,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 7.7,
     "adjustedAcc": 39.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 108,
     "acc": 55.6,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 41.5,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 316,
   "globalBlend": 0.717
  }
 }
};
