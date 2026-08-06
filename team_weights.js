// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-06 09:09",
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
   "diana": 0.0768,
   "nova": 0.3481,
   "flow": 0.2861
  },
  "acc": {
   "taro": {
    "n": 8298,
    "acc": 54.7,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1794,
    "acc": 40.4,
    "adjustedAcc": 41.0,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7138,
    "acc": 63.4,
    "adjustedAcc": 63.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1454,
    "acc": 54.7,
    "adjustedAcc": 54.3,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 18684,
  "team": {
   "hit": 5977,
   "miss": 1790,
   "n": 7767,
   "acc": 77.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2957,
    "diana": 0.0751,
    "nova": 0.2913,
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
     "n": 169,
     "acc": 36.7,
     "adjustedAcc": 42.2,
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
    "taro": 0.3126,
    "diana": 0.0792,
    "nova": 0.3242,
    "flow": 0.284
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
     "n": 77,
     "acc": 42.9,
     "adjustedAcc": 47.2,
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
   "graded": 1143,
   "globalBlend": 0.412
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2753,
    "diana": 0.0901,
    "nova": 0.351,
    "flow": 0.2836
   },
   "acc": {
    "taro": {
     "n": 417,
     "acc": 47.2,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 89,
     "acc": 41.6,
     "adjustedAcc": 46.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 386,
     "acc": 63.0,
     "adjustedAcc": 59.9,
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
   "graded": 970,
   "globalBlend": 0.452
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3004,
    "diana": 0.079,
    "nova": 0.3629,
    "flow": 0.2576
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
     "n": 86,
     "acc": 24.4,
     "adjustedAcc": 39.3,
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
   "graded": 763,
   "globalBlend": 0.512
  },
  "통신": {
   "weights": {
    "taro": 0.2859,
    "diana": 0.0849,
    "nova": 0.3387,
    "flow": 0.2905
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
    "taro": 0.2749,
    "diana": 0.1081,
    "nova": 0.3343,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 368,
     "acc": 47.8,
     "adjustedAcc": 48.4,
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
     "n": 325,
     "acc": 60.3,
     "adjustedAcc": 57.5,
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
   "graded": 814,
   "globalBlend": 0.496
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2993,
    "diana": 0.0763,
    "nova": 0.3648,
    "flow": 0.2595
   },
   "acc": {
    "taro": {
     "n": 485,
     "acc": 51.5,
     "adjustedAcc": 51.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 124,
     "acc": 21.0,
     "adjustedAcc": 35.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 375,
     "acc": 63.7,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 135,
     "acc": 37.0,
     "adjustedAcc": 43.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1119,
   "globalBlend": 0.417
  },
  "2차전지": {
   "weights": {
    "taro": 0.317,
    "diana": 0.0827,
    "nova": 0.3587,
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
    "diana": 0.0908,
    "nova": 0.3361,
    "flow": 0.2852
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
     "n": 29,
     "acc": 62.1,
     "adjustedAcc": 52.3,
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
   "graded": 352,
   "globalBlend": 0.694
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2932,
    "diana": 0.0936,
    "nova": 0.3421,
    "flow": 0.2711
   },
   "acc": {
    "taro": {
     "n": 1052,
     "acc": 58.9,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 220,
     "acc": 53.6,
     "adjustedAcc": 52.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 929,
     "acc": 67.1,
     "adjustedAcc": 65.1,
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
    "taro": 0.2873,
    "diana": 0.0918,
    "nova": 0.3617,
    "flow": 0.2592
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
    "diana": 0.0813,
    "nova": 0.3396,
    "flow": 0.2921
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
     "n": 68,
     "acc": 22.1,
     "adjustedAcc": 39.9,
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
   "graded": 642,
   "globalBlend": 0.555
  },
  "방산": {
   "weights": {
    "taro": 0.287,
    "diana": 0.0837,
    "nova": 0.3418,
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
    "taro": 0.2933,
    "diana": 0.0866,
    "nova": 0.3388,
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
     "n": 47,
     "acc": 48.9,
     "adjustedAcc": 49.7,
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
   "graded": 373,
   "globalBlend": 0.682
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2878,
    "diana": 0.0777,
    "nova": 0.338,
    "flow": 0.2965
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
    "taro": 0.2861,
    "diana": 0.0922,
    "nova": 0.3289,
    "flow": 0.2928
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
     "n": 30,
     "acc": 70.0,
     "adjustedAcc": 54.0,
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
   "graded": 296,
   "globalBlend": 0.73
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.0804,
    "nova": 0.331,
    "flow": 0.2952
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 52.8,
     "adjustedAcc": 52.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 27.6,
     "adjustedAcc": 40.6,
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
   "graded": 741,
   "globalBlend": 0.519
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2911,
    "diana": 0.0927,
    "nova": 0.3197,
    "flow": 0.2965
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 47.0,
     "adjustedAcc": 48.1,
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
     "acc": 44.6,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 7,
     "acc": 57.1,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 423,
   "globalBlend": 0.654
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2934,
    "diana": 0.0804,
    "nova": 0.355,
    "flow": 0.2712
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 53.7,
     "adjustedAcc": 52.5,
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
     "n": 203,
     "acc": 68.0,
     "adjustedAcc": 61.3,
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
   "graded": 588,
   "globalBlend": 0.576
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2758,
    "diana": 0.0782,
    "nova": 0.3487,
    "flow": 0.2974
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
    "diana": 0.09,
    "nova": 0.3537,
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
     "n": 44,
     "acc": 63.6,
     "adjustedAcc": 53.7,
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
   "graded": 461,
   "globalBlend": 0.634
  },
  "식음료": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.1021,
    "nova": 0.3224,
    "flow": 0.2978
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 36.6,
     "adjustedAcc": 41.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 44,
     "acc": 70.5,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 156,
     "acc": 42.9,
     "adjustedAcc": 46.0,
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
    "taro": 0.3014,
    "diana": 0.0802,
    "nova": 0.3382,
    "flow": 0.2802
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 60.2,
     "adjustedAcc": 54.8,
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
     "n": 88,
     "acc": 59.1,
     "adjustedAcc": 53.8,
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
   "graded": 259,
   "globalBlend": 0.755
  }
 }
};
