// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-06 09:39",
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
   "diana": 0.0775,
   "nova": 0.3473,
   "flow": 0.2862
  },
  "acc": {
   "taro": {
    "n": 8296,
    "acc": 54.8,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1794,
    "acc": 40.8,
    "adjustedAcc": 41.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7135,
    "acc": 63.4,
    "adjustedAcc": 63.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1452,
    "acc": 54.8,
    "adjustedAcc": 54.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 18677,
  "team": {
   "hit": 5971,
   "miss": 1789,
   "n": 7760,
   "acc": 76.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2957,
    "diana": 0.0753,
    "nova": 0.2911,
    "flow": 0.3378
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
     "n": 171,
     "acc": 36.8,
     "adjustedAcc": 42.3,
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
   "graded": 2388,
   "globalBlend": 0.251
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3127,
    "diana": 0.0791,
    "nova": 0.3239,
    "flow": 0.2842
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
    "taro": 0.2755,
    "diana": 0.0911,
    "nova": 0.3499,
    "flow": 0.2834
   },
   "acc": {
    "taro": {
     "n": 416,
     "acc": 47.4,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 89,
     "acc": 42.7,
     "adjustedAcc": 46.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 385,
     "acc": 62.9,
     "adjustedAcc": 59.8,
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
   "graded": 968,
   "globalBlend": 0.452
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.0778,
    "nova": 0.3632,
    "flow": 0.2582
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
     "n": 81,
     "acc": 19.8,
     "adjustedAcc": 37.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 278,
     "acc": 67.6,
     "adjustedAcc": 62.3,
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
    "taro": 0.286,
    "diana": 0.085,
    "nova": 0.3382,
    "flow": 0.2907
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
     "n": 23,
     "acc": 39.1,
     "adjustedAcc": 48.3,
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
   "graded": 356,
   "globalBlend": 0.692
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2752,
    "diana": 0.1083,
    "nova": 0.3343,
    "flow": 0.2822
   },
   "acc": {
    "taro": {
     "n": 370,
     "acc": 48.1,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 77,
     "acc": 70.1,
     "adjustedAcc": 57.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 327,
     "acc": 60.6,
     "adjustedAcc": 57.7,
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
   "graded": 818,
   "globalBlend": 0.494
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2984,
    "diana": 0.0769,
    "nova": 0.365,
    "flow": 0.2596
   },
   "acc": {
    "taro": {
     "n": 483,
     "acc": 51.6,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 121,
     "acc": 21.5,
     "adjustedAcc": 35.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 373,
     "acc": 64.1,
     "adjustedAcc": 60.6,
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
   "graded": 1111,
   "globalBlend": 0.419
  },
  "2차전지": {
   "weights": {
    "taro": 0.3172,
    "diana": 0.0827,
    "nova": 0.3585,
    "flow": 0.2416
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
     "n": 73,
     "acc": 53.4,
     "adjustedAcc": 51.3,
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
   "graded": 911,
   "globalBlend": 0.468
  },
  "보험": {
   "weights": {
    "taro": 0.2877,
    "diana": 0.0923,
    "nova": 0.3351,
    "flow": 0.2849
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
     "n": 32,
     "acc": 65.6,
     "adjustedAcc": 53.3,
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
   "graded": 355,
   "globalBlend": 0.693
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2932,
    "diana": 0.0953,
    "nova": 0.3407,
    "flow": 0.2708
   },
   "acc": {
    "taro": {
     "n": 1052,
     "acc": 59.0,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 221,
     "acc": 54.8,
     "adjustedAcc": 53.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 929,
     "acc": 67.0,
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
   "graded": 2331,
   "globalBlend": 0.256
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2873,
    "diana": 0.0921,
    "nova": 0.3613,
    "flow": 0.2593
   },
   "acc": {
    "taro": {
     "n": 470,
     "acc": 51.3,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 126,
     "acc": 45.2,
     "adjustedAcc": 47.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 418,
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
   "graded": 1054,
   "globalBlend": 0.431
  },
  "조선": {
   "weights": {
    "taro": 0.287,
    "diana": 0.0814,
    "nova": 0.3393,
    "flow": 0.2923
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
     "n": 67,
     "acc": 20.9,
     "adjustedAcc": 39.6,
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
   "graded": 641,
   "globalBlend": 0.555
  },
  "방산": {
   "weights": {
    "taro": 0.287,
    "diana": 0.0843,
    "nova": 0.3412,
    "flow": 0.2876
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
    "taro": 0.2932,
    "diana": 0.0873,
    "nova": 0.3382,
    "flow": 0.2813
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
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
    "taro": 0.2878,
    "diana": 0.0779,
    "nova": 0.3377,
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
     "n": 156,
     "acc": 39.1,
     "adjustedAcc": 43.8,
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
   "graded": 1373,
   "globalBlend": 0.368
  },
  "물류·운송": {
   "weights": {
    "taro": 0.286,
    "diana": 0.093,
    "nova": 0.3283,
    "flow": 0.2927
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
     "acc": 72.4,
     "adjustedAcc": 54.4,
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
    "taro": 0.2934,
    "diana": 0.0815,
    "nova": 0.3302,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 357,
     "acc": 52.9,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 91,
     "acc": 29.7,
     "adjustedAcc": 41.2,
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
   "graded": 746,
   "globalBlend": 0.517
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2912,
    "diana": 0.0928,
    "nova": 0.3176,
    "flow": 0.2984
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
    "taro": 0.2942,
    "diana": 0.0809,
    "nova": 0.3543,
    "flow": 0.2707
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 53.9,
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
     "n": 202,
     "acc": 67.8,
     "adjustedAcc": 61.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 83,
     "acc": 41.0,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 585,
   "globalBlend": 0.578
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.0786,
    "nova": 0.3476,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 243,
     "acc": 38.7,
     "adjustedAcc": 42.4,
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
     "n": 210,
     "acc": 57.6,
     "adjustedAcc": 54.8,
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
   "graded": 524,
   "globalBlend": 0.604
  },
  "로봇": {
   "weights": {
    "taro": 0.2912,
    "diana": 0.0908,
    "nova": 0.353,
    "flow": 0.2651
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
    "taro": 0.2777,
    "diana": 0.104,
    "nova": 0.3209,
    "flow": 0.2974
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 36.8,
     "adjustedAcc": 41.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 73.9,
     "adjustedAcc": 56.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 42.6,
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
   "graded": 392,
   "globalBlend": 0.671
  },
  "여행레저": {
   "weights": {
    "taro": 0.3007,
    "diana": 0.0809,
    "nova": 0.3382,
    "flow": 0.2803
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
     "n": 24,
     "acc": 0.0,
     "adjustedAcc": 41.7,
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
   "graded": 256,
   "globalBlend": 0.758
  }
 }
};
