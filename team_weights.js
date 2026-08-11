// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-11 11:44",
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
   "taro": 0.2763,
   "diana": 0.0973,
   "nova": 0.3111,
   "flow": 0.3153
  },
  "acc": {
   "taro": {
    "n": 9370,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2733,
    "acc": 48.2,
    "adjustedAcc": 48.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8488,
    "acc": 58.9,
    "adjustedAcc": 58.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1682,
    "acc": 57.4,
    "adjustedAcc": 56.9,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 22273,
  "team": {
   "hit": 6300,
   "miss": 2382,
   "n": 8682,
   "acc": 72.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.0812,
    "nova": 0.2758,
    "flow": 0.3637
   },
   "acc": {
    "taro": {
     "n": 1138,
     "acc": 54.5,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 258,
     "acc": 36.8,
     "adjustedAcc": 41.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1039,
     "acc": 54.9,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 349,
     "acc": 69.1,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2784,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.093,
    "nova": 0.3008,
    "flow": 0.3107
   },
   "acc": {
    "taro": {
     "n": 560,
     "acc": 60.9,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 120,
     "acc": 47.5,
     "adjustedAcc": 48.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 501,
     "acc": 62.3,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 161,
     "acc": 65.8,
     "adjustedAcc": 59.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1342,
   "globalBlend": 0.373
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2607,
    "diana": 0.1093,
    "nova": 0.3293,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 471,
     "acc": 43.9,
     "adjustedAcc": 45.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 141,
     "acc": 51.1,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 455,
     "acc": 60.0,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 95,
     "acc": 50.5,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1162,
   "globalBlend": 0.408
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2942,
    "diana": 0.0934,
    "nova": 0.3348,
    "flow": 0.2777
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 52.1,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 32.0,
     "adjustedAcc": 40.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 330,
     "acc": 61.5,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 84,
     "acc": 34.5,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 902,
   "globalBlend": 0.47
  },
  "통신": {
   "weights": {
    "taro": 0.274,
    "diana": 0.0985,
    "nova": 0.3098,
    "flow": 0.3176
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 40.5,
     "adjustedAcc": 47.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 150,
     "acc": 62.0,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 66.7,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 423,
   "globalBlend": 0.654
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.1325,
    "nova": 0.2937,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 130,
     "acc": 74.6,
     "adjustedAcc": 62.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 391,
     "acc": 54.0,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 55,
     "acc": 54.5,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 998,
   "globalBlend": 0.445
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2886,
    "diana": 0.0882,
    "nova": 0.3368,
    "flow": 0.2865
   },
   "acc": {
    "taro": {
     "n": 537,
     "acc": 49.2,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 175,
     "acc": 28.6,
     "adjustedAcc": 37.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 446,
     "acc": 59.4,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 149,
     "acc": 43.0,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1307,
   "globalBlend": 0.38
  },
  "2차전지": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.0962,
    "nova": 0.3352,
    "flow": 0.2631
   },
   "acc": {
    "taro": {
     "n": 503,
     "acc": 64.2,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 104,
     "acc": 51.9,
     "adjustedAcc": 50.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 453,
     "acc": 70.6,
     "adjustedAcc": 66.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 9,
     "acc": 33.3,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1069,
   "globalBlend": 0.428
  },
  "보험": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.1122,
    "nova": 0.3045,
    "flow": 0.307
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 48.0,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 73.1,
     "adjustedAcc": 57.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 146,
     "acc": 55.5,
     "adjustedAcc": 53.0,
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
   "graded": 417,
   "globalBlend": 0.657
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.1065,
    "nova": 0.3088,
    "flow": 0.3004
   },
   "acc": {
    "taro": {
     "n": 1193,
     "acc": 56.9,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 335,
     "acc": 56.4,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1117,
     "acc": 62.1,
     "adjustedAcc": 61.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 149,
     "acc": 63.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2794,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.1137,
    "nova": 0.3363,
    "flow": 0.2753
   },
   "acc": {
    "taro": {
     "n": 529,
     "acc": 49.0,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 195,
     "acc": 55.4,
     "adjustedAcc": 53.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 493,
     "acc": 62.3,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 49,
     "acc": 36.7,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1266,
   "globalBlend": 0.387
  },
  "조선": {
   "weights": {
    "taro": 0.2715,
    "diana": 0.1009,
    "nova": 0.3147,
    "flow": 0.313
   },
   "acc": {
    "taro": {
     "n": 310,
     "acc": 44.8,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 99,
     "acc": 40.4,
     "adjustedAcc": 45.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 300,
     "acc": 56.3,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 57,
     "acc": 54.4,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 766,
   "globalBlend": 0.511
  },
  "방산": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1006,
    "nova": 0.3109,
    "flow": 0.3138
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 43.9,
     "adjustedAcc": 46.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 33.3,
     "adjustedAcc": 47.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 117,
     "acc": 57.3,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 3,
     "acc": 100.0,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 283,
   "globalBlend": 0.739
  },
  "철강·금속": {
   "weights": {
    "taro": 0.29,
    "diana": 0.111,
    "nova": 0.299,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 57.8,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 74,
     "acc": 68.9,
     "adjustedAcc": 57.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 192,
     "acc": 54.7,
     "adjustedAcc": 52.9,
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
   "graded": 451,
   "globalBlend": 0.639
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.0964,
    "nova": 0.3124,
    "flow": 0.3141
   },
   "acc": {
    "taro": {
     "n": 678,
     "acc": 54.3,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 237,
     "acc": 48.1,
     "adjustedAcc": 48.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 634,
     "acc": 61.8,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 88,
     "acc": 68.2,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1637,
   "globalBlend": 0.328
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.1127,
    "nova": 0.2903,
    "flow": 0.3195
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 48.1,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 79.5,
     "adjustedAcc": 57.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 102,
     "acc": 43.1,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 88,
     "acc": 60.2,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 367,
   "globalBlend": 0.686
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2896,
    "diana": 0.0983,
    "nova": 0.304,
    "flow": 0.3082
   },
   "acc": {
    "taro": {
     "n": 410,
     "acc": 53.2,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 137,
     "acc": 42.3,
     "adjustedAcc": 45.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 340,
     "acc": 55.9,
     "adjustedAcc": 54.3,
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
   "graded": 906,
   "globalBlend": 0.469
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.1081,
    "nova": 0.2864,
    "flow": 0.3248
   },
   "acc": {
    "taro": {
     "n": 248,
     "acc": 48.8,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 55.6,
     "adjustedAcc": 51.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 191,
     "acc": 44.5,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 88.2,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 519,
   "globalBlend": 0.607
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2836,
    "diana": 0.0965,
    "nova": 0.3262,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 52.0,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 36.7,
     "adjustedAcc": 44.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 242,
     "acc": 63.6,
     "adjustedAcc": 59.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 100,
     "acc": 47.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 698,
   "globalBlend": 0.534
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2698,
    "diana": 0.0931,
    "nova": 0.3188,
    "flow": 0.3183
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 38.8,
     "adjustedAcc": 42.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 97,
     "acc": 19.6,
     "adjustedAcc": 36.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 252,
     "acc": 53.2,
     "adjustedAcc": 52.2,
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
   "graded": 626,
   "globalBlend": 0.561
  },
  "기계": {
   "weights": {
    "taro": 0.2683,
    "diana": 0.1038,
    "nova": 0.3096,
    "flow": 0.3184
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 31.0,
     "adjustedAcc": 42.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 58.1,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 92,
     "acc": 55.4,
     "adjustedAcc": 52.4,
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
   "graded": 217,
   "globalBlend": 0.787
  },
  "로봇": {
   "weights": {
    "taro": 0.2883,
    "diana": 0.0987,
    "nova": 0.3269,
    "flow": 0.2861
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 57.2,
     "adjustedAcc": 54.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 44.4,
     "adjustedAcc": 48.1,
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
     "n": 51,
     "acc": 39.2,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 533,
   "globalBlend": 0.6
  },
  "식음료": {
   "weights": {
    "taro": 0.2799,
    "diana": 0.1289,
    "nova": 0.2812,
    "flow": 0.31
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 47.2,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 82.5,
     "adjustedAcc": 63.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 199,
     "acc": 40.2,
     "adjustedAcc": 43.9,
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
   "graded": 512,
   "globalBlend": 0.61
  },
  "여행레저": {
   "weights": {
    "taro": 0.2923,
    "diana": 0.0943,
    "nova": 0.3085,
    "flow": 0.3048
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 58.0,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 0.0,
     "adjustedAcc": 39.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 102,
     "acc": 55.9,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 40,
     "acc": 40.0,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 294,
   "globalBlend": 0.731
  }
 }
};
