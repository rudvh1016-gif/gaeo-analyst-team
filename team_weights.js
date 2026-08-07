// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-07 13:25",
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
   "taro": 0.2783,
   "diana": 0.0842,
   "nova": 0.3503,
   "flow": 0.2873
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
    "n": 2097,
    "acc": 44.0,
    "adjustedAcc": 44.3,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 7586,
    "acc": 63.8,
    "adjustedAcc": 63.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1526,
    "acc": 55.0,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 19874,
  "team": {
   "hit": 6118,
   "miss": 1908,
   "n": 8026,
   "acc": 76.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2897,
    "diana": 0.0769,
    "nova": 0.2956,
    "flow": 0.3379
   },
   "acc": {
    "taro": {
     "n": 1052,
     "acc": 58.0,
     "adjustedAcc": 57.2,
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
     "n": 941,
     "acc": 58.6,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 321,
     "acc": 68.5,
     "adjustedAcc": 63.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2511,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3008,
    "diana": 0.0829,
    "nova": 0.3305,
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
    "taro": 0.2643,
    "diana": 0.096,
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
    "taro": 0.2928,
    "diana": 0.0831,
    "nova": 0.3663,
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
    "taro": 0.2744,
    "diana": 0.0897,
    "nova": 0.343,
    "flow": 0.2929
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
    "taro": 0.2682,
    "diana": 0.117,
    "nova": 0.3315,
    "flow": 0.2833
   },
   "acc": {
    "taro": {
     "n": 385,
     "acc": 47.8,
     "adjustedAcc": 48.3,
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
   "graded": 873,
   "globalBlend": 0.478
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2899,
    "diana": 0.0818,
    "nova": 0.3691,
    "flow": 0.2592
   },
   "acc": {
    "taro": {
     "n": 504,
     "acc": 51.0,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 138,
     "acc": 26.8,
     "adjustedAcc": 37.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 398,
     "acc": 64.8,
     "adjustedAcc": 61.4,
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
   "graded": 1179,
   "globalBlend": 0.404
  },
  "2차전지": {
   "weights": {
    "taro": 0.3057,
    "diana": 0.0858,
    "nova": 0.3677,
    "flow": 0.2408
   },
   "acc": {
    "taro": {
     "n": 469,
     "acc": 67.8,
     "adjustedAcc": 64.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 82,
     "acc": 51.2,
     "adjustedAcc": 50.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 407,
     "acc": 77.9,
     "adjustedAcc": 71.5,
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
   "graded": 965,
   "globalBlend": 0.453
  },
  "보험": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.099,
    "nova": 0.3354,
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
    "taro": 0.2795,
    "diana": 0.0991,
    "nova": 0.3486,
    "flow": 0.2728
   },
   "acc": {
    "taro": {
     "n": 1102,
     "acc": 57.1,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 258,
     "acc": 55.8,
     "adjustedAcc": 54.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 990,
     "acc": 67.9,
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
   "graded": 2483,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.0987,
    "nova": 0.3666,
    "flow": 0.2575
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
     "n": 149,
     "acc": 49.7,
     "adjustedAcc": 49.8,
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
   "graded": 1122,
   "globalBlend": 0.416
  },
  "조선": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.0871,
    "nova": 0.3457,
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
    "taro": 0.2773,
    "diana": 0.0898,
    "nova": 0.3433,
    "flow": 0.2896
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
    "taro": 0.287,
    "diana": 0.0954,
    "nova": 0.336,
    "flow": 0.2817
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
    "taro": 0.2777,
    "diana": 0.0827,
    "nova": 0.3433,
    "flow": 0.2964
   },
   "acc": {
    "taro": {
     "n": 627,
     "acc": 56.3,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 179,
     "acc": 41.9,
     "adjustedAcc": 45.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 572,
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
   "graded": 1463,
   "globalBlend": 0.354
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.0994,
    "nova": 0.3278,
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
    "taro": 0.2887,
    "diana": 0.0879,
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
    "taro": 0.2823,
    "diana": 0.0977,
    "nova": 0.3191,
    "flow": 0.301
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
     "n": 48,
     "acc": 50.0,
     "adjustedAcc": 50.0,
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
   "graded": 456,
   "globalBlend": 0.637
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2823,
    "diana": 0.0853,
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
    "taro": 0.2678,
    "diana": 0.0832,
    "nova": 0.348,
    "flow": 0.301
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 37.8,
     "adjustedAcc": 41.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 11.4,
     "adjustedAcc": 34.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 226,
     "acc": 56.6,
     "adjustedAcc": 54.3,
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
   "graded": 564,
   "globalBlend": 0.587
  },
  "로봇": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.0942,
    "nova": 0.3601,
    "flow": 0.2639
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
    "taro": 0.2743,
    "diana": 0.1112,
    "nova": 0.3184,
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
    "taro": 0.2937,
    "diana": 0.0854,
    "nova": 0.3383,
    "flow": 0.2827
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
