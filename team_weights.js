// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-11 09:14",
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
   "taro": 0.276,
   "diana": 0.0966,
   "nova": 0.3126,
   "flow": 0.3148
  },
  "acc": {
   "taro": {
    "n": 9356,
    "acc": 52.5,
    "adjustedAcc": 52.5,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 2722,
    "acc": 47.9,
    "adjustedAcc": 48.0,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8473,
    "acc": 59.0,
    "adjustedAcc": 58.9,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1676,
    "acc": 57.3,
    "adjustedAcc": 56.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 22227,
  "team": {
   "hit": 6326,
   "miss": 2372,
   "n": 8698,
   "acc": 72.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.0809,
    "nova": 0.2767,
    "flow": 0.3626
   },
   "acc": {
    "taro": {
     "n": 1137,
     "acc": 54.6,
     "adjustedAcc": 54.2,
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
     "n": 1038,
     "acc": 55.0,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 348,
     "acc": 69.0,
     "adjustedAcc": 64.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2781,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2961,
    "diana": 0.0918,
    "nova": 0.3022,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 559,
     "acc": 61.2,
     "adjustedAcc": 59.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 46.7,
     "adjustedAcc": 48.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 500,
     "acc": 62.6,
     "adjustedAcc": 60.2,
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
    "taro": 0.2601,
    "diana": 0.109,
    "nova": 0.3304,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 470,
     "acc": 43.8,
     "adjustedAcc": 45.1,
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
     "n": 454,
     "acc": 60.1,
     "adjustedAcc": 58.0,
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
   "graded": 1160,
   "globalBlend": 0.408
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2932,
    "diana": 0.0927,
    "nova": 0.3363,
    "flow": 0.2777
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 51.8,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 124,
     "acc": 31.5,
     "adjustedAcc": 40.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 331,
     "acc": 61.6,
     "adjustedAcc": 58.5,
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
   "graded": 904,
   "globalBlend": 0.469
  },
  "통신": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.0978,
    "nova": 0.3113,
    "flow": 0.3168
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 38.9,
     "adjustedAcc": 47.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 148,
     "acc": 62.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 66.2,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 417,
   "globalBlend": 0.657
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.274,
    "diana": 0.1318,
    "nova": 0.2955,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 420,
     "acc": 49.8,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 129,
     "acc": 74.4,
     "adjustedAcc": 62.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 389,
     "acc": 54.2,
     "adjustedAcc": 53.2,
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
   "graded": 993,
   "globalBlend": 0.446
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2895,
    "diana": 0.0872,
    "nova": 0.3382,
    "flow": 0.2851
   },
   "acc": {
    "taro": {
     "n": 536,
     "acc": 49.4,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 173,
     "acc": 27.7,
     "adjustedAcc": 36.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 446,
     "acc": 59.6,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 148,
     "acc": 42.6,
     "adjustedAcc": 45.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1303,
   "globalBlend": 0.38
  },
  "2차전지": {
   "weights": {
    "taro": 0.3052,
    "diana": 0.0952,
    "nova": 0.3367,
    "flow": 0.263
   },
   "acc": {
    "taro": {
     "n": 502,
     "acc": 64.1,
     "adjustedAcc": 61.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 106,
     "acc": 50.9,
     "adjustedAcc": 50.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 452,
     "acc": 70.8,
     "adjustedAcc": 66.4,
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
    "taro": 0.2764,
    "diana": 0.1112,
    "nova": 0.3062,
    "flow": 0.3062
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 48.6,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 51,
     "acc": 72.5,
     "adjustedAcc": 56.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 146,
     "acc": 56.2,
     "adjustedAcc": 53.4,
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
   "graded": 416,
   "globalBlend": 0.658
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2828,
    "diana": 0.1067,
    "nova": 0.3094,
    "flow": 0.3011
   },
   "acc": {
    "taro": {
     "n": 1191,
     "acc": 56.8,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 335,
     "acc": 56.7,
     "adjustedAcc": 54.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1115,
     "acc": 62.2,
     "adjustedAcc": 61.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 148,
     "acc": 63.5,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 2789,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.113,
    "nova": 0.3376,
    "flow": 0.2755
   },
   "acc": {
    "taro": {
     "n": 528,
     "acc": 49.1,
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
     "acc": 62.7,
     "adjustedAcc": 60.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 37.5,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1264,
   "globalBlend": 0.388
  },
  "조선": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.1005,
    "nova": 0.3154,
    "flow": 0.3128
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
     "n": 97,
     "acc": 40.2,
     "adjustedAcc": 45.6,
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
   "graded": 764,
   "globalBlend": 0.512
  },
  "방산": {
   "weights": {
    "taro": 0.275,
    "diana": 0.0998,
    "nova": 0.3116,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 44.2,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 25,
     "acc": 32.0,
     "adjustedAcc": 46.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 116,
     "acc": 56.9,
     "adjustedAcc": 53.4,
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
   "graded": 282,
   "globalBlend": 0.739
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2898,
    "diana": 0.1106,
    "nova": 0.2999,
    "flow": 0.2996
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
    "taro": 0.277,
    "diana": 0.0963,
    "nova": 0.3129,
    "flow": 0.3139
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
     "n": 236,
     "acc": 48.3,
     "adjustedAcc": 48.9,
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
   "graded": 1636,
   "globalBlend": 0.328
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1126,
    "nova": 0.2924,
    "flow": 0.3189
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 47.3,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 81.4,
     "adjustedAcc": 58.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 100,
     "acc": 44.0,
     "adjustedAcc": 47.3,
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
   "graded": 362,
   "globalBlend": 0.688
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2889,
    "diana": 0.097,
    "nova": 0.3057,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 408,
     "acc": 52.9,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 134,
     "acc": 41.0,
     "adjustedAcc": 45.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 337,
     "acc": 56.1,
     "adjustedAcc": 54.5,
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
   "graded": 898,
   "globalBlend": 0.471
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.1072,
    "nova": 0.2878,
    "flow": 0.3245
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
     "n": 62,
     "acc": 54.8,
     "adjustedAcc": 51.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 190,
     "acc": 44.7,
     "adjustedAcc": 46.8,
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
   "graded": 517,
   "globalBlend": 0.607
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2832,
    "diana": 0.0959,
    "nova": 0.3281,
    "flow": 0.2928
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 51.8,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 78,
     "acc": 35.9,
     "adjustedAcc": 44.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 241,
     "acc": 63.9,
     "adjustedAcc": 59.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 99,
     "acc": 46.5,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 694,
   "globalBlend": 0.535
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2687,
    "diana": 0.0927,
    "nova": 0.3207,
    "flow": 0.3179
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 38.5,
     "adjustedAcc": 42.0,
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
     "acc": 53.6,
     "adjustedAcc": 52.4,
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
    "taro": 0.2681,
    "diana": 0.1032,
    "nova": 0.3108,
    "flow": 0.318
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
    "taro": 0.2888,
    "diana": 0.0983,
    "nova": 0.3271,
    "flow": 0.2858
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 57.4,
     "adjustedAcc": 54.8,
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
     "n": 205,
     "acc": 67.8,
     "adjustedAcc": 61.2,
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
   "graded": 535,
   "globalBlend": 0.599
  },
  "식음료": {
   "weights": {
    "taro": 0.2794,
    "diana": 0.1282,
    "nova": 0.2826,
    "flow": 0.3098
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 47.0,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 79,
     "acc": 82.3,
     "adjustedAcc": 62.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 200,
     "acc": 40.5,
     "adjustedAcc": 44.1,
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
   "graded": 513,
   "globalBlend": 0.609
  },
  "여행레저": {
   "weights": {
    "taro": 0.292,
    "diana": 0.0938,
    "nova": 0.3096,
    "flow": 0.3045
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
