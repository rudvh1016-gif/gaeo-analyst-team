// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 14:55",
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
   "taro": 0.2778,
   "diana": 0.0848,
   "nova": 0.3504,
   "flow": 0.287
  },
  "acc": {
   "taro": {
    "n": 8669,
    "acc": 53.6,
    "adjustedAcc": 53.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2102,
    "acc": 44.3,
    "adjustedAcc": 44.6,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7595,
    "acc": 63.8,
    "adjustedAcc": 63.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1528,
    "acc": 55.0,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19894,
  "team": {
   "hit": 6105,
   "miss": 1909,
   "n": 8014,
   "acc": 76.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.289,
    "diana": 0.0773,
    "nova": 0.2963,
    "flow": 0.3375
   },
   "acc": {
    "taro": {
     "n": 1054,
     "acc": 57.9,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 198,
     "acc": 37.4,
     "adjustedAcc": 42.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 943,
     "acc": 58.6,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 323,
     "acc": 68.4,
     "adjustedAcc": 63.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2518,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.0832,
    "nova": 0.3306,
    "flow": 0.2857
   },
   "acc": {
    "taro": {
     "n": 520,
     "acc": 64.4,
     "adjustedAcc": 61.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 91,
     "acc": 44.0,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 453,
     "acc": 68.0,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 151,
     "acc": 64.9,
     "adjustedAcc": 58.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1215,
   "globalBlend": 0.397
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2641,
    "diana": 0.0961,
    "nova": 0.3594,
    "flow": 0.2805
   },
   "acc": {
    "taro": {
     "n": 435,
     "acc": 45.5,
     "adjustedAcc": 46.5,
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
     "n": 409,
     "acc": 64.3,
     "adjustedAcc": 61.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 83,
     "acc": 48.2,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1036,
   "globalBlend": 0.436
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2922,
    "diana": 0.0837,
    "nova": 0.3662,
    "flow": 0.2579
   },
   "acc": {
    "taro": {
     "n": 338,
     "acc": 53.6,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 26.5,
     "adjustedAcc": 39.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 296,
     "acc": 67.2,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 78,
     "acc": 32.1,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 810,
   "globalBlend": 0.497
  },
  "통신": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.0901,
    "nova": 0.3431,
    "flow": 0.2927
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 40.7,
     "adjustedAcc": 48.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 135,
     "acc": 67.4,
     "adjustedAcc": 59.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 58,
     "acc": 63.8,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 380,
   "globalBlend": 0.678
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2675,
    "diana": 0.1168,
    "nova": 0.3326,
    "flow": 0.2831
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 47.7,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 94,
     "acc": 72.3,
     "adjustedAcc": 59.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 346,
     "acc": 59.8,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 47,
     "acc": 53.2,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 871,
   "globalBlend": 0.479
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2891,
    "diana": 0.0827,
    "nova": 0.3694,
    "flow": 0.2588
   },
   "acc": {
    "taro": {
     "n": 505,
     "acc": 50.9,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 140,
     "acc": 27.9,
     "adjustedAcc": 38.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 399,
     "acc": 64.9,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 139,
     "acc": 38.1,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1183,
   "globalBlend": 0.403
  },
  "2차전지": {
   "weights": {
    "taro": 0.3043,
    "diana": 0.0864,
    "nova": 0.3687,
    "flow": 0.2406
   },
   "acc": {
    "taro": {
     "n": 469,
     "acc": 67.6,
     "adjustedAcc": 64.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 83,
     "acc": 51.8,
     "adjustedAcc": 50.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 407,
     "acc": 78.1,
     "adjustedAcc": 71.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 7,
     "acc": 14.3,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 966,
   "globalBlend": 0.453
  },
  "보험": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.0995,
    "nova": 0.3348,
    "flow": 0.286
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 69.2,
     "adjustedAcc": 54.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 134,
     "acc": 58.2,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 375,
   "globalBlend": 0.681
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.1002,
    "nova": 0.3481,
    "flow": 0.2725
   },
   "acc": {
    "taro": {
     "n": 1103,
     "acc": 57.1,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 257,
     "acc": 56.4,
     "adjustedAcc": 54.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 992,
     "acc": 67.8,
     "adjustedAcc": 65.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 133,
     "acc": 59.4,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2485,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2768,
    "diana": 0.099,
    "nova": 0.3669,
    "flow": 0.2573
   },
   "acc": {
    "taro": {
     "n": 491,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 149,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 446,
     "acc": 66.6,
     "adjustedAcc": 63.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 42,
     "acc": 31.0,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1128,
   "globalBlend": 0.415
  },
  "조선": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.0874,
    "nova": 0.3458,
    "flow": 0.2922
   },
   "acc": {
    "taro": {
     "n": 287,
     "acc": 46.7,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 28.6,
     "adjustedAcc": 41.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 269,
     "acc": 61.0,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 51,
     "acc": 52.9,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 684,
   "globalBlend": 0.539
  },
  "방산": {
   "weights": {
    "taro": 0.2769,
    "diana": 0.0905,
    "nova": 0.3433,
    "flow": 0.2893
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 45.7,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 19,
     "acc": 31.6,
     "adjustedAcc": 47.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 104,
     "acc": 61.5,
     "adjustedAcc": 55.4,
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
   "graded": 253,
   "globalBlend": 0.76
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2866,
    "diana": 0.0958,
    "nova": 0.3361,
    "flow": 0.2815
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 56.6,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 58.9,
     "adjustedAcc": 52.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 170,
     "acc": 61.2,
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
   "graded": 399,
   "globalBlend": 0.667
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.0836,
    "nova": 0.3432,
    "flow": 0.2957
   },
   "acc": {
    "taro": {
     "n": 626,
     "acc": 56.4,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 182,
     "acc": 42.9,
     "adjustedAcc": 45.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 571,
     "acc": 67.4,
     "adjustedAcc": 64.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 85,
     "acc": 69.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1464,
   "globalBlend": 0.353
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.0999,
    "nova": 0.3279,
    "flow": 0.2949
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 46.2,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 75.8,
     "adjustedAcc": 55.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 85,
     "acc": 49.4,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 78,
     "acc": 56.4,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 315,
   "globalBlend": 0.717
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.0883,
    "nova": 0.3305,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 374,
     "acc": 52.9,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 105,
     "acc": 36.2,
     "adjustedAcc": 43.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 300,
     "acc": 58.3,
     "adjustedAcc": 56.0,
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
   "graded": 798,
   "globalBlend": 0.501
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2817,
    "diana": 0.0988,
    "nova": 0.3189,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 47.6,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 52.0,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 169,
     "acc": 46.2,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 10,
     "acc": 80.0,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 458,
   "globalBlend": 0.636
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.282,
    "diana": 0.0857,
    "nova": 0.3597,
    "flow": 0.2726
   },
   "acc": {
    "taro": {
     "n": 259,
     "acc": 52.1,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 63,
     "acc": 27.0,
     "adjustedAcc": 42.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 217,
     "acc": 69.1,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 89,
     "acc": 43.8,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 628,
   "globalBlend": 0.56
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.268,
    "diana": 0.0837,
    "nova": 0.3478,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 252,
     "acc": 38.1,
     "adjustedAcc": 41.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 78,
     "acc": 11.5,
     "adjustedAcc": 34.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 224,
     "acc": 56.7,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 5,
     "acc": 40.0,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 559,
   "globalBlend": 0.589
  },
  "로봇": {
   "weights": {
    "taro": 0.2817,
    "diana": 0.0942,
    "nova": 0.3603,
    "flow": 0.2638
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 56.4,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 58.3,
     "adjustedAcc": 52.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 185,
     "acc": 75.1,
     "adjustedAcc": 65.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 35.4,
     "adjustedAcc": 45.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 485,
   "globalBlend": 0.623
  },
  "식음료": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1117,
    "nova": 0.3179,
    "flow": 0.296
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 41.9,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 56,
     "acc": 76.8,
     "adjustedAcc": 58.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 170,
     "acc": 42.9,
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
   "graded": 431,
   "globalBlend": 0.65
  },
  "여행레저": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.0858,
    "nova": 0.3384,
    "flow": 0.2825
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 60.6,
     "adjustedAcc": 55.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 27,
     "acc": 0.0,
     "adjustedAcc": 40.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 90,
     "acc": 57.8,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 37.8,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 263,
   "globalBlend": 0.753
  }
 }
};
