// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-06 11:39",
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
   "taro": 0.2891,
   "diana": 0.0768,
   "nova": 0.3473,
   "flow": 0.2868
  },
  "acc": {
   "taro": {
    "n": 8293,
    "acc": 54.8,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1798,
    "acc": 40.5,
    "adjustedAcc": 41.1,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7130,
    "acc": 63.4,
    "adjustedAcc": 63.1,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1452,
    "acc": 54.8,
    "adjustedAcc": 54.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 18673,
  "team": {
   "hit": 5967,
   "miss": 1789,
   "n": 7756,
   "acc": 76.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2957,
    "diana": 0.0754,
    "nova": 0.2911,
    "flow": 0.3379
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
     "n": 170,
     "acc": 37.1,
     "adjustedAcc": 42.4,
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
   "graded": 2387,
   "globalBlend": 0.251
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3128,
    "diana": 0.0789,
    "nova": 0.3239,
    "flow": 0.2844
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
    "taro": 0.2753,
    "diana": 0.0912,
    "nova": 0.3497,
    "flow": 0.2838
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
    "diana": 0.0778,
    "nova": 0.3627,
    "flow": 0.2585
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
    "taro": 0.2862,
    "diana": 0.0847,
    "nova": 0.3374,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 52.6,
     "adjustedAcc": 51.5,
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
     "n": 126,
     "acc": 65.1,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 52,
     "acc": 63.5,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 354,
   "globalBlend": 0.693
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2751,
    "diana": 0.108,
    "nova": 0.3341,
    "flow": 0.2828
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
     "n": 77,
     "acc": 70.1,
     "adjustedAcc": 57.9,
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
   "graded": 816,
   "globalBlend": 0.495
  },
  "금융·증권": {
   "weights": {
    "taro": 0.299,
    "diana": 0.0768,
    "nova": 0.3643,
    "flow": 0.2599
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
     "n": 126,
     "acc": 22.2,
     "adjustedAcc": 35.8,
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
   "graded": 1118,
   "globalBlend": 0.417
  },
  "2차전지": {
   "weights": {
    "taro": 0.3171,
    "diana": 0.0827,
    "nova": 0.3583,
    "flow": 0.2419
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
    "taro": 0.288,
    "diana": 0.0912,
    "nova": 0.3354,
    "flow": 0.2855
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
     "n": 30,
     "acc": 63.3,
     "adjustedAcc": 52.7,
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
   "graded": 353,
   "globalBlend": 0.694
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2938,
    "diana": 0.0945,
    "nova": 0.3407,
    "flow": 0.2711
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
     "n": 221,
     "acc": 54.3,
     "adjustedAcc": 52.8,
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
   "graded": 2329,
   "globalBlend": 0.256
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2872,
    "diana": 0.0913,
    "nova": 0.362,
    "flow": 0.2594
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
     "n": 125,
     "acc": 44.8,
     "adjustedAcc": 47.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 417,
     "acc": 65.7,
     "adjustedAcc": 62.2,
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
   "graded": 1052,
   "globalBlend": 0.432
  },
  "조선": {
   "weights": {
    "taro": 0.2873,
    "diana": 0.0803,
    "nova": 0.3395,
    "flow": 0.2928
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
     "n": 70,
     "acc": 20.0,
     "adjustedAcc": 38.9,
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
   "graded": 644,
   "globalBlend": 0.554
  },
  "방산": {
   "weights": {
    "taro": 0.287,
    "diana": 0.0837,
    "nova": 0.3412,
    "flow": 0.2881
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
    "taro": 0.2935,
    "diana": 0.0863,
    "nova": 0.3384,
    "flow": 0.2819
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
    "taro": 0.2879,
    "diana": 0.0774,
    "nova": 0.3378,
    "flow": 0.2968
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
     "n": 157,
     "acc": 38.9,
     "adjustedAcc": 43.7,
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
   "graded": 1374,
   "globalBlend": 0.368
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2863,
    "diana": 0.0919,
    "nova": 0.3284,
    "flow": 0.2934
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
    "taro": 0.2928,
    "diana": 0.0811,
    "nova": 0.3305,
    "flow": 0.2956
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
     "n": 89,
     "acc": 29.2,
     "adjustedAcc": 41.1,
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
   "graded": 744,
   "globalBlend": 0.518
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2913,
    "diana": 0.0924,
    "nova": 0.3176,
    "flow": 0.2988
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
    "taro": 0.2937,
    "diana": 0.0803,
    "nova": 0.3547,
    "flow": 0.2713
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
    "diana": 0.0782,
    "nova": 0.3482,
    "flow": 0.2978
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
    "taro": 0.2913,
    "diana": 0.0903,
    "nova": 0.353,
    "flow": 0.2654
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
    "taro": 0.2784,
    "diana": 0.1027,
    "nova": 0.3208,
    "flow": 0.2981
   },
   "acc": {
    "taro": {
     "n": 189,
     "acc": 37.0,
     "adjustedAcc": 42.1,
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
     "n": 154,
     "acc": 42.2,
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
   "graded": 390,
   "globalBlend": 0.672
  },
  "여행레저": {
   "weights": {
    "taro": 0.3008,
    "diana": 0.0802,
    "nova": 0.3382,
    "flow": 0.2808
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
