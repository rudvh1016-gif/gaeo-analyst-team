// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-14 14:48",
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
   "taro": 0.2827,
   "diana": 0.1155,
   "nova": 0.2924,
   "flow": 0.3094
  },
  "acc": {
   "taro": {
    "n": 10382,
    "acc": 53.3,
    "adjustedAcc": 53.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3974,
    "acc": 54.1,
    "adjustedAcc": 53.9,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8990,
    "acc": 56.7,
    "adjustedAcc": 56.7,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1891,
    "acc": 56.6,
    "adjustedAcc": 56.2,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 25237,
  "team": {
   "hit": 6929,
   "miss": 2869,
   "n": 9798,
   "acc": 70.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2802,
    "diana": 0.0934,
    "nova": 0.2643,
    "flow": 0.3621
   },
   "acc": {
    "taro": {
     "n": 1252,
     "acc": 52.2,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 358,
     "acc": 41.1,
     "adjustedAcc": 43.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1110,
     "acc": 51.4,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 389,
     "acc": 66.1,
     "adjustedAcc": 62.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3109,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3019,
    "diana": 0.1074,
    "nova": 0.2847,
    "flow": 0.306
   },
   "acc": {
    "taro": {
     "n": 601,
     "acc": 59.7,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 168,
     "acc": 53.0,
     "adjustedAcc": 51.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 536,
     "acc": 58.4,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 177,
     "acc": 62.1,
     "adjustedAcc": 57.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1482,
   "globalBlend": 0.351
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.263,
    "diana": 0.127,
    "nova": 0.3134,
    "flow": 0.2966
   },
   "acc": {
    "taro": {
     "n": 519,
     "acc": 44.5,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 210,
     "acc": 58.1,
     "adjustedAcc": 55.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 483,
     "acc": 58.2,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 113,
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1325,
   "globalBlend": 0.376
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3015,
    "diana": 0.1096,
    "nova": 0.3139,
    "flow": 0.2751
   },
   "acc": {
    "taro": {
     "n": 394,
     "acc": 53.6,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 177,
     "acc": 44.1,
     "adjustedAcc": 46.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 349,
     "acc": 58.7,
     "adjustedAcc": 56.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 93,
     "acc": 37.6,
     "adjustedAcc": 44.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1013,
   "globalBlend": 0.441
  },
  "통신": {
   "weights": {
    "taro": 0.2826,
    "diana": 0.1122,
    "nova": 0.2949,
    "flow": 0.3102
   },
   "acc": {
    "taro": {
     "n": 184,
     "acc": 52.7,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 51,
     "acc": 49.0,
     "adjustedAcc": 49.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 154,
     "acc": 60.4,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 63.0,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 462,
   "globalBlend": 0.634
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2864,
    "diana": 0.1497,
    "nova": 0.2699,
    "flow": 0.2941
   },
   "acc": {
    "taro": {
     "n": 477,
     "acc": 54.1,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 196,
     "acc": 77.0,
     "adjustedAcc": 66.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 414,
     "acc": 51.7,
     "adjustedAcc": 51.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 70,
     "acc": 57.1,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1157,
   "globalBlend": 0.409
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2913,
    "diana": 0.0983,
    "nova": 0.3201,
    "flow": 0.2903
   },
   "acc": {
    "taro": {
     "n": 584,
     "acc": 49.5,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 262,
     "acc": 35.5,
     "adjustedAcc": 40.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 471,
     "acc": 57.5,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 163,
     "acc": 46.0,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1480,
   "globalBlend": 0.351
  },
  "2차전지": {
   "weights": {
    "taro": 0.3214,
    "diana": 0.105,
    "nova": 0.3157,
    "flow": 0.2578
   },
   "acc": {
    "taro": {
     "n": 546,
     "acc": 65.8,
     "adjustedAcc": 62.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 153,
     "acc": 52.3,
     "adjustedAcc": 51.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 477,
     "acc": 67.1,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 35.3,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1193,
   "globalBlend": 0.401
  },
  "보험": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.1312,
    "nova": 0.2879,
    "flow": 0.3003
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 49.5,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 82,
     "acc": 78.0,
     "adjustedAcc": 61.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 155,
     "acc": 54.2,
     "adjustedAcc": 52.4,
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
   "graded": 477,
   "globalBlend": 0.626
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2986,
    "diana": 0.1138,
    "nova": 0.2893,
    "flow": 0.2982
   },
   "acc": {
    "taro": {
     "n": 1352,
     "acc": 58.7,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 497,
     "acc": 56.9,
     "adjustedAcc": 55.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1188,
     "acc": 59.3,
     "adjustedAcc": 58.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 170,
     "acc": 61.8,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3207,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2796,
    "diana": 0.1246,
    "nova": 0.3196,
    "flow": 0.2761
   },
   "acc": {
    "taro": {
     "n": 593,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 281,
     "acc": 57.7,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 517,
     "acc": 60.7,
     "adjustedAcc": 58.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 54,
     "acc": 42.6,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1445,
   "globalBlend": 0.356
  },
  "조선": {
   "weights": {
    "taro": 0.2732,
    "diana": 0.1237,
    "nova": 0.2985,
    "flow": 0.3046
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 46.1,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 141,
     "acc": 58.2,
     "adjustedAcc": 54.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 316,
     "acc": 55.7,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 61,
     "acc": 54.1,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 854,
   "globalBlend": 0.484
  },
  "방산": {
   "weights": {
    "taro": 0.2811,
    "diana": 0.1136,
    "nova": 0.294,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 47.1,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 33,
     "acc": 39.4,
     "adjustedAcc": 47.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 125,
     "acc": 56.0,
     "adjustedAcc": 53.1,
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
   "graded": 318,
   "globalBlend": 0.716
  },
  "철강·금속": {
   "weights": {
    "taro": 0.296,
    "diana": 0.1336,
    "nova": 0.2792,
    "flow": 0.2913
   },
   "acc": {
    "taro": {
     "n": 206,
     "acc": 59.7,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 112,
     "acc": 79.5,
     "adjustedAcc": 64.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 199,
     "acc": 52.8,
     "adjustedAcc": 51.7,
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
   "graded": 519,
   "globalBlend": 0.607
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2863,
    "diana": 0.1109,
    "nova": 0.297,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 749,
     "acc": 55.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 344,
     "acc": 53.5,
     "adjustedAcc": 52.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 673,
     "acc": 59.4,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 95,
     "acc": 64.2,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1861,
   "globalBlend": 0.301
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2745,
    "diana": 0.1347,
    "nova": 0.2782,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 43.3,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 87.5,
     "adjustedAcc": 63.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 107,
     "acc": 44.9,
     "adjustedAcc": 47.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 100,
     "acc": 57.0,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 421,
   "globalBlend": 0.655
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.295,
    "diana": 0.107,
    "nova": 0.2912,
    "flow": 0.3068
   },
   "acc": {
    "taro": {
     "n": 459,
     "acc": 54.0,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 186,
     "acc": 44.6,
     "adjustedAcc": 46.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 357,
     "acc": 55.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 21,
     "acc": 71.4,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1023,
   "globalBlend": 0.439
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2856,
    "diana": 0.126,
    "nova": 0.269,
    "flow": 0.3195
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 50.4,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 92,
     "acc": 65.2,
     "adjustedAcc": 56.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 204,
     "acc": 43.6,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 22,
     "acc": 81.8,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 596,
   "globalBlend": 0.573
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2903,
    "diana": 0.1171,
    "nova": 0.3068,
    "flow": 0.2857
   },
   "acc": {
    "taro": {
     "n": 306,
     "acc": 53.9,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 119,
     "acc": 55.5,
     "adjustedAcc": 52.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 253,
     "acc": 61.3,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 113,
     "acc": 46.9,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 791,
   "globalBlend": 0.503
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2734,
    "diana": 0.1086,
    "nova": 0.3046,
    "flow": 0.3133
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 40.1,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 145,
     "acc": 34.5,
     "adjustedAcc": 41.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 270,
     "acc": 52.2,
     "adjustedAcc": 51.5,
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
   "graded": 723,
   "globalBlend": 0.525
  },
  "기계": {
   "weights": {
    "taro": 0.274,
    "diana": 0.1205,
    "nova": 0.2927,
    "flow": 0.3128
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 37.6,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 43,
     "acc": 69.8,
     "adjustedAcc": 55.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 97,
     "acc": 55.7,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 9,
     "acc": 100.0,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 250,
   "globalBlend": 0.762
  },
  "로봇": {
   "weights": {
    "taro": 0.3025,
    "diana": 0.101,
    "nova": 0.3134,
    "flow": 0.2831
   },
   "acc": {
    "taro": {
     "n": 239,
     "acc": 60.3,
     "adjustedAcc": 56.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 95,
     "acc": 29.5,
     "adjustedAcc": 40.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 213,
     "acc": 66.2,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 55,
     "acc": 41.8,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 602,
   "globalBlend": 0.571
  },
  "식음료": {
   "weights": {
    "taro": 0.2758,
    "diana": 0.154,
    "nova": 0.2695,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 265,
     "acc": 46.0,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 120,
     "acc": 88.3,
     "adjustedAcc": 69.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 211,
     "acc": 43.6,
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
   "graded": 598,
   "globalBlend": 0.572
  },
  "여행레저": {
   "weights": {
    "taro": 0.2959,
    "diana": 0.108,
    "nova": 0.2955,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 56.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 15.6,
     "adjustedAcc": 40.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 111,
     "acc": 55.9,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 41.5,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 331,
   "globalBlend": 0.707
  }
 }
};
