// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 09:26",
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
   "taro": 0.2772,
   "diana": 0.0846,
   "nova": 0.3518,
   "flow": 0.2865
  },
  "acc": {
   "taro": {
    "n": 8669,
    "acc": 53.5,
    "adjustedAcc": 53.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2115,
    "acc": 44.1,
    "adjustedAcc": 44.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7590,
    "acc": 63.9,
    "adjustedAcc": 63.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1528,
    "acc": 54.9,
    "adjustedAcc": 54.6,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19902,
  "team": {
   "hit": 6112,
   "miss": 1918,
   "n": 8030,
   "acc": 76.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.0779,
    "nova": 0.2993,
    "flow": 0.3385
   },
   "acc": {
    "taro": {
     "n": 1058,
     "acc": 57.1,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 202,
     "acc": 38.1,
     "adjustedAcc": 42.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 947,
     "acc": 59.1,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 325,
     "acc": 68.6,
     "adjustedAcc": 63.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2532,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3004,
    "diana": 0.0828,
    "nova": 0.3312,
    "flow": 0.2856
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
     "n": 92,
     "acc": 43.5,
     "adjustedAcc": 47.2,
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
   "graded": 1216,
   "globalBlend": 0.397
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2632,
    "diana": 0.0961,
    "nova": 0.3601,
    "flow": 0.2806
   },
   "acc": {
    "taro": {
     "n": 433,
     "acc": 45.3,
     "adjustedAcc": 46.3,
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
     "acc": 64.3,
     "adjustedAcc": 61.0,
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
   "graded": 1031,
   "globalBlend": 0.437
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2918,
    "diana": 0.0834,
    "nova": 0.367,
    "flow": 0.2579
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
     "n": 98,
     "acc": 26.5,
     "adjustedAcc": 39.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 295,
     "acc": 67.5,
     "adjustedAcc": 62.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 77,
     "acc": 32.5,
     "adjustedAcc": 43.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 807,
   "globalBlend": 0.498
  },
  "통신": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.0902,
    "nova": 0.343,
    "flow": 0.2929
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 28,
     "acc": 42.9,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 136,
     "acc": 66.9,
     "adjustedAcc": 59.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 64.4,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 384,
   "globalBlend": 0.676
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.1167,
    "nova": 0.3322,
    "flow": 0.283
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 47.9,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 96,
     "acc": 71.9,
     "adjustedAcc": 59.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 348,
     "acc": 59.5,
     "adjustedAcc": 57.1,
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
   "graded": 877,
   "globalBlend": 0.477
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2899,
    "diana": 0.0831,
    "nova": 0.3694,
    "flow": 0.2577
   },
   "acc": {
    "taro": {
     "n": 503,
     "acc": 50.9,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 28.1,
     "adjustedAcc": 38.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 398,
     "acc": 64.6,
     "adjustedAcc": 61.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 137,
     "acc": 37.2,
     "adjustedAcc": 43.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1177,
   "globalBlend": 0.405
  },
  "2차전지": {
   "weights": {
    "taro": 0.3043,
    "diana": 0.0856,
    "nova": 0.3696,
    "flow": 0.2404
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
     "acc": 50.6,
     "adjustedAcc": 50.2,
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
    "taro": 0.2791,
    "diana": 0.0993,
    "nova": 0.3357,
    "flow": 0.2859
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
     "n": 131,
     "acc": 58.0,
     "adjustedAcc": 54.2,
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
   "graded": 371,
   "globalBlend": 0.683
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2785,
    "diana": 0.0994,
    "nova": 0.3497,
    "flow": 0.2725
   },
   "acc": {
    "taro": {
     "n": 1102,
     "acc": 57.0,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 261,
     "acc": 55.9,
     "adjustedAcc": 54.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 991,
     "acc": 68.0,
     "adjustedAcc": 66.1,
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
   "graded": 2487,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.0992,
    "nova": 0.3663,
    "flow": 0.2571
   },
   "acc": {
    "taro": {
     "n": 491,
     "acc": 50.5,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 150,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 446,
     "acc": 66.4,
     "adjustedAcc": 62.9,
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
   "graded": 1129,
   "globalBlend": 0.415
  },
  "조선": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.0873,
    "nova": 0.3462,
    "flow": 0.2921
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
     "n": 268,
     "acc": 60.8,
     "adjustedAcc": 57.5,
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
   "graded": 683,
   "globalBlend": 0.539
  },
  "방산": {
   "weights": {
    "taro": 0.2769,
    "diana": 0.0901,
    "nova": 0.3441,
    "flow": 0.289
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 46.1,
     "adjustedAcc": 48.0,
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
     "n": 103,
     "acc": 61.2,
     "adjustedAcc": 55.2,
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
   "graded": 252,
   "globalBlend": 0.76
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2862,
    "diana": 0.0956,
    "nova": 0.337,
    "flow": 0.2812
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
    "taro": 0.2772,
    "diana": 0.0827,
    "nova": 0.3439,
    "flow": 0.2963
   },
   "acc": {
    "taro": {
     "n": 626,
     "acc": 56.2,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 182,
     "acc": 41.8,
     "adjustedAcc": 45.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 569,
     "acc": 67.3,
     "adjustedAcc": 64.3,
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
   "graded": 1462,
   "globalBlend": 0.354
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.0998,
    "nova": 0.3301,
    "flow": 0.2941
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 45.4,
     "adjustedAcc": 47.7,
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
     "acc": 50.6,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 79,
     "acc": 55.7,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 316,
   "globalBlend": 0.717
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2879,
    "diana": 0.0878,
    "nova": 0.3309,
    "flow": 0.2934
   },
   "acc": {
    "taro": {
     "n": 373,
     "acc": 53.1,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 104,
     "acc": 35.6,
     "adjustedAcc": 43.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 299,
     "acc": 58.2,
     "adjustedAcc": 55.8,
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
   "graded": 795,
   "globalBlend": 0.502
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.0987,
    "nova": 0.3197,
    "flow": 0.3002
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
    "taro": 0.2815,
    "diana": 0.0855,
    "nova": 0.3609,
    "flow": 0.2722
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
     "n": 218,
     "acc": 69.3,
     "adjustedAcc": 62.4,
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
   "graded": 629,
   "globalBlend": 0.56
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2673,
    "diana": 0.0839,
    "nova": 0.3508,
    "flow": 0.298
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 37.6,
     "adjustedAcc": 41.6,
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
     "n": 226,
     "acc": 57.1,
     "adjustedAcc": 54.6,
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
   "graded": 564,
   "globalBlend": 0.587
  },
  "로봇": {
   "weights": {
    "taro": 0.2815,
    "diana": 0.0935,
    "nova": 0.3614,
    "flow": 0.2635
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
     "n": 50,
     "acc": 56.0,
     "adjustedAcc": 51.8,
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
   "graded": 487,
   "globalBlend": 0.622
  },
  "식음료": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1111,
    "nova": 0.3207,
    "flow": 0.2945
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
     "n": 55,
     "acc": 76.4,
     "adjustedAcc": 58.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 169,
     "acc": 43.8,
     "adjustedAcc": 46.4,
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
   "graded": 427,
   "globalBlend": 0.652
  },
  "여행레저": {
   "weights": {
    "taro": 0.2921,
    "diana": 0.0858,
    "nova": 0.3409,
    "flow": 0.2811
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 59.6,
     "adjustedAcc": 54.6,
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
     "acc": 58.9,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 35.1,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 263,
   "globalBlend": 0.753
  }
 }
};
