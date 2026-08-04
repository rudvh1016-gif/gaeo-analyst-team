// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 09:14",
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
   "taro": 0.3321,
   "diana": 0.0711,
   "nova": 0.3098,
   "flow": 0.2871
  },
  "acc": {
   "taro": {
    "n": 7444,
    "acc": 59.7,
    "adjustedAcc": 59.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 1240,
    "acc": 37.6,
    "adjustedAcc": 38.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 6169,
    "acc": 59.7,
    "adjustedAcc": 59.5,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1290,
    "acc": 55.1,
    "adjustedAcc": 54.7,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 16143,
  "team": {
   "hit": 5803,
   "miss": 1465,
   "n": 7268,
   "acc": 79.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3439,
    "diana": 0.076,
    "nova": 0.2519,
    "flow": 0.3283
   },
   "acc": {
    "taro": {
     "n": 908,
     "acc": 65.6,
     "adjustedAcc": 63.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 38.4,
     "adjustedAcc": 44.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 795,
     "acc": 52.6,
     "adjustedAcc": 52.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 287,
     "acc": 69.0,
     "adjustedAcc": 63.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2102,
   "globalBlend": 0.276
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3572,
    "diana": 0.0731,
    "nova": 0.2884,
    "flow": 0.2814
   },
   "acc": {
    "taro": {
     "n": 445,
     "acc": 73.9,
     "adjustedAcc": 68.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 54,
     "acc": 35.2,
     "adjustedAcc": 45.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 377,
     "acc": 63.4,
     "adjustedAcc": 60.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 126,
     "acc": 66.7,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1002,
   "globalBlend": 0.444
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3148,
    "diana": 0.0872,
    "nova": 0.3104,
    "flow": 0.2877
   },
   "acc": {
    "taro": {
     "n": 369,
     "acc": 52.6,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 61,
     "acc": 41.0,
     "adjustedAcc": 47.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 333,
     "acc": 57.7,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 67,
     "acc": 52.2,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 830,
   "globalBlend": 0.491
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3386,
    "diana": 0.0744,
    "nova": 0.3267,
    "flow": 0.2604
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 60.7,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 59,
     "acc": 15.3,
     "adjustedAcc": 38.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 242,
     "acc": 64.9,
     "adjustedAcc": 59.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 70,
     "acc": 32.9,
     "adjustedAcc": 43.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 666,
   "globalBlend": 0.546
  },
  "통신": {
   "weights": {
    "taro": 0.3229,
    "diana": 0.0805,
    "nova": 0.3064,
    "flow": 0.2903
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 56.9,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 18,
     "acc": 44.4,
     "adjustedAcc": 49.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 111,
     "acc": 62.2,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 44,
     "acc": 63.6,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 310,
   "globalBlend": 0.721
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3057,
    "diana": 0.0962,
    "nova": 0.3098,
    "flow": 0.2883
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 49.8,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 48,
     "acc": 64.6,
     "adjustedAcc": 54.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 279,
     "acc": 58.8,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 56.8,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 691,
   "globalBlend": 0.537
  },
  "금융·증권": {
   "weights": {
    "taro": 0.338,
    "diana": 0.0761,
    "nova": 0.3243,
    "flow": 0.2616
   },
   "acc": {
    "taro": {
     "n": 432,
     "acc": 56.5,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 19.5,
     "adjustedAcc": 37.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 319,
     "acc": 59.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 123,
     "acc": 36.6,
     "adjustedAcc": 43.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 961,
   "globalBlend": 0.454
  },
  "2차전지": {
   "weights": {
    "taro": 0.3626,
    "diana": 0.0773,
    "nova": 0.3156,
    "flow": 0.2446
   },
   "acc": {
    "taro": {
     "n": 403,
     "acc": 78.9,
     "adjustedAcc": 72.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 52,
     "acc": 53.8,
     "adjustedAcc": 51.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 337,
     "acc": 74.2,
     "adjustedAcc": 67.8,
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
   "graded": 794,
   "globalBlend": 0.502
  },
  "보험": {
   "weights": {
    "taro": 0.3238,
    "diana": 0.0853,
    "nova": 0.3053,
    "flow": 0.2857
   },
   "acc": {
    "taro": {
     "n": 145,
     "acc": 52.4,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 23,
     "acc": 60.9,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 104,
     "acc": 55.8,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 45.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 305,
   "globalBlend": 0.724
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3341,
    "diana": 0.0917,
    "nova": 0.3046,
    "flow": 0.2696
   },
   "acc": {
    "taro": {
     "n": 940,
     "acc": 64.0,
     "adjustedAcc": 62.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 159,
     "acc": 54.7,
     "adjustedAcc": 52.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 804,
     "acc": 63.1,
     "adjustedAcc": 61.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 121,
     "acc": 58.7,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2024,
   "globalBlend": 0.283
  },
  "지주·상사": {
   "weights": {
    "taro": 0.327,
    "diana": 0.084,
    "nova": 0.3269,
    "flow": 0.2622
   },
   "acc": {
    "taro": {
     "n": 430,
     "acc": 55.6,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 90,
     "acc": 36.7,
     "adjustedAcc": 44.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 363,
     "acc": 61.4,
     "adjustedAcc": 58.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 37,
     "acc": 27.0,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 920,
   "globalBlend": 0.465
  },
  "조선": {
   "weights": {
    "taro": 0.3253,
    "diana": 0.0736,
    "nova": 0.3064,
    "flow": 0.2948
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 53.4,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 2.0,
     "adjustedAcc": 35.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 221,
     "acc": 54.8,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 55.6,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 554,
   "globalBlend": 0.591
  },
  "방산": {
   "weights": {
    "taro": 0.3265,
    "diana": 0.079,
    "nova": 0.3068,
    "flow": 0.2878
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 54.1,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 12,
     "acc": 33.3,
     "adjustedAcc": 48.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 83,
     "acc": 57.8,
     "adjustedAcc": 53.2,
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
   "graded": 205,
   "globalBlend": 0.796
  },
  "철강·금속": {
   "weights": {
    "taro": 0.33,
    "diana": 0.0784,
    "nova": 0.309,
    "flow": 0.2825
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 60.6,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 32,
     "acc": 31.2,
     "adjustedAcc": 46.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 137,
     "acc": 62.0,
     "adjustedAcc": 56.4,
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
   "graded": 324,
   "globalBlend": 0.712
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3252,
    "diana": 0.0735,
    "nova": 0.3053,
    "flow": 0.2961
   },
   "acc": {
    "taro": {
     "n": 544,
     "acc": 63.6,
     "adjustedAcc": 61.1,
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
     "n": 467,
     "acc": 64.5,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 76,
     "acc": 73.7,
     "adjustedAcc": 59.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1191,
   "globalBlend": 0.402
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3227,
    "diana": 0.0838,
    "nova": 0.3026,
    "flow": 0.291
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 47.0,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 17,
     "acc": 58.8,
     "adjustedAcc": 51.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 62,
     "acc": 48.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 64,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 243,
   "globalBlend": 0.767
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3196,
    "diana": 0.0799,
    "nova": 0.3031,
    "flow": 0.2974
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 54.1,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 60,
     "acc": 30.0,
     "adjustedAcc": 43.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 234,
     "acc": 56.4,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 16,
     "acc": 81.2,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 630,
   "globalBlend": 0.559
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3229,
    "diana": 0.0868,
    "nova": 0.2948,
    "flow": 0.2955
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 47.2,
     "adjustedAcc": 48.2,
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
     "n": 132,
     "acc": 41.7,
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
   "graded": 354,
   "globalBlend": 0.693
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3343,
    "diana": 0.0762,
    "nova": 0.3198,
    "flow": 0.2698
   },
   "acc": {
    "taro": {
     "n": 222,
     "acc": 58.6,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 41,
     "acc": 9.8,
     "adjustedAcc": 39.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 175,
     "acc": 62.9,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 35.6,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 511,
   "globalBlend": 0.61
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3113,
    "diana": 0.0769,
    "nova": 0.3154,
    "flow": 0.2964
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 42.7,
     "adjustedAcc": 45.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 4.7,
     "adjustedAcc": 38.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 175,
     "acc": 56.0,
     "adjustedAcc": 53.6,
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
   "graded": 433,
   "globalBlend": 0.649
  },
  "로봇": {
   "weights": {
    "taro": 0.3265,
    "diana": 0.0912,
    "nova": 0.3135,
    "flow": 0.2688
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 65.0,
     "adjustedAcc": 58.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 100.0,
     "adjustedAcc": 60.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 71.0,
     "adjustedAcc": 61.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 38,
     "acc": 44.7,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 401,
   "globalBlend": 0.666
  },
  "식음료": {
   "weights": {
    "taro": 0.3088,
    "diana": 0.094,
    "nova": 0.2975,
    "flow": 0.2997
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 34.1,
     "adjustedAcc": 40.8,
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
     "n": 126,
     "acc": 40.5,
     "adjustedAcc": 45.1,
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
   "graded": 322,
   "globalBlend": 0.713
  },
  "여행레저": {
   "weights": {
    "taro": 0.337,
    "diana": 0.0766,
    "nova": 0.3056,
    "flow": 0.2809
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 65.6,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 16,
     "acc": 0.0,
     "adjustedAcc": 44.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 76,
     "acc": 56.6,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 33.3,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 221,
   "globalBlend": 0.784
  }
 }
};
