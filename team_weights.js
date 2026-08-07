// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 13:56",
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
   "diana": 0.0844,
   "nova": 0.3504,
   "flow": 0.2874
  },
  "acc": {
   "taro": {
    "n": 8665,
    "acc": 53.7,
    "adjustedAcc": 53.6,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2098,
    "acc": 44.1,
    "adjustedAcc": 44.5,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7587,
    "acc": 63.9,
    "adjustedAcc": 63.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1528,
    "acc": 55.1,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19878,
  "team": {
   "hit": 6112,
   "miss": 1908,
   "n": 8020,
   "acc": 76.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2886,
    "diana": 0.0768,
    "nova": 0.2958,
    "flow": 0.3388
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
     "n": 197,
     "acc": 37.1,
     "adjustedAcc": 42.0,
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
     "acc": 68.7,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2517,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.083,
    "nova": 0.3306,
    "flow": 0.2858
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
    "nova": 0.3586,
    "flow": 0.2811
   },
   "acc": {
    "taro": {
     "n": 434,
     "acc": 45.4,
     "adjustedAcc": 46.4,
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
     "n": 406,
     "acc": 64.0,
     "adjustedAcc": 60.8,
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
   "graded": 1032,
   "globalBlend": 0.437
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2925,
    "diana": 0.0832,
    "nova": 0.3663,
    "flow": 0.258
   },
   "acc": {
    "taro": {
     "n": 337,
     "acc": 53.7,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 99,
     "acc": 26.3,
     "adjustedAcc": 39.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 294,
     "acc": 67.3,
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
   "graded": 808,
   "globalBlend": 0.498
  },
  "통신": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.0898,
    "nova": 0.3431,
    "flow": 0.293
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
    "taro": 0.2674,
    "diana": 0.117,
    "nova": 0.3325,
    "flow": 0.2832
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
     "n": 95,
     "acc": 72.6,
     "adjustedAcc": 60.0,
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
   "graded": 872,
   "globalBlend": 0.478
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2892,
    "diana": 0.0822,
    "nova": 0.3695,
    "flow": 0.2591
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
     "n": 139,
     "acc": 27.3,
     "adjustedAcc": 37.8,
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
   "graded": 1182,
   "globalBlend": 0.404
  },
  "2차전지": {
   "weights": {
    "taro": 0.3048,
    "diana": 0.0861,
    "nova": 0.3683,
    "flow": 0.2407
   },
   "acc": {
    "taro": {
     "n": 468,
     "acc": 67.7,
     "adjustedAcc": 64.1,
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
     "n": 406,
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
   "graded": 964,
   "globalBlend": 0.454
  },
  "보험": {
   "weights": {
    "taro": 0.2792,
    "diana": 0.0991,
    "nova": 0.3355,
    "flow": 0.2862
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
     "n": 133,
     "acc": 58.6,
     "adjustedAcc": 54.5,
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
   "graded": 373,
   "globalBlend": 0.682
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.0997,
    "nova": 0.3485,
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
     "n": 258,
     "acc": 56.2,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 991,
     "acc": 67.9,
     "adjustedAcc": 66.0,
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
    "taro": 0.2772,
    "diana": 0.0984,
    "nova": 0.3667,
    "flow": 0.2576
   },
   "acc": {
    "taro": {
     "n": 488,
     "acc": 50.4,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 148,
     "acc": 49.3,
     "adjustedAcc": 49.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 443,
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
   "graded": 1121,
   "globalBlend": 0.416
  },
  "조선": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.0872,
    "nova": 0.3458,
    "flow": 0.2924
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
    "taro": 0.277,
    "diana": 0.09,
    "nova": 0.3434,
    "flow": 0.2897
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
     "n": 20,
     "acc": 30.0,
     "adjustedAcc": 47.1,
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
   "graded": 254,
   "globalBlend": 0.759
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2866,
    "diana": 0.0955,
    "nova": 0.3361,
    "flow": 0.2818
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
    "taro": 0.2775,
    "diana": 0.0832,
    "nova": 0.3434,
    "flow": 0.2959
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
     "n": 179,
     "acc": 42.5,
     "adjustedAcc": 45.5,
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
   "graded": 1461,
   "globalBlend": 0.354
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.0996,
    "nova": 0.3279,
    "flow": 0.2952
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
    "taro": 0.2885,
    "diana": 0.088,
    "nova": 0.3302,
    "flow": 0.2933
   },
   "acc": {
    "taro": {
     "n": 377,
     "acc": 53.3,
     "adjustedAcc": 52.5,
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
     "n": 303,
     "acc": 58.4,
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
   "graded": 804,
   "globalBlend": 0.499
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2818,
    "diana": 0.0981,
    "nova": 0.3191,
    "flow": 0.3009
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
     "n": 49,
     "acc": 51.0,
     "adjustedAcc": 50.3,
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
   "graded": 457,
   "globalBlend": 0.636
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.282,
    "diana": 0.0855,
    "nova": 0.3597,
    "flow": 0.2728
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
    "taro": 0.2676,
    "diana": 0.0835,
    "nova": 0.3483,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 37.9,
     "adjustedAcc": 41.8,
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
     "n": 225,
     "acc": 56.9,
     "adjustedAcc": 54.5,
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
   "graded": 561,
   "globalBlend": 0.588
  },
  "로봇": {
   "weights": {
    "taro": 0.2816,
    "diana": 0.0943,
    "nova": 0.3602,
    "flow": 0.264
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
     "n": 47,
     "acc": 59.6,
     "adjustedAcc": 52.7,
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
   "graded": 484,
   "globalBlend": 0.623
  },
  "식음료": {
   "weights": {
    "taro": 0.274,
    "diana": 0.1113,
    "nova": 0.3185,
    "flow": 0.2962
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 41.6,
     "adjustedAcc": 44.7,
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
     "n": 169,
     "acc": 43.2,
     "adjustedAcc": 46.0,
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
   "graded": 429,
   "globalBlend": 0.651
  },
  "여행레저": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.0855,
    "nova": 0.3384,
    "flow": 0.2828
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
