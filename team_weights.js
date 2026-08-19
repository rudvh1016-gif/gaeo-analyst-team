// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-19 11:41",
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
   "taro": 0.2751,
   "diana": 0.1234,
   "nova": 0.2957,
   "flow": 0.3058
  },
  "acc": {
   "taro": {
    "n": 11162,
    "acc": 51.9,
    "adjustedAcc": 51.8,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4618,
    "acc": 55.8,
    "adjustedAcc": 55.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9013,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 2036,
    "acc": 55.7,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26829,
  "team": {
   "hit": 7417,
   "miss": 7052,
   "n": 14469,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2787,
    "diana": 0.0995,
    "nova": 0.2686,
    "flow": 0.3531
   },
   "acc": {
    "taro": {
     "n": 1327,
     "acc": 51.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 409,
     "acc": 42.8,
     "adjustedAcc": 44.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1119,
     "acc": 51.0,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 412,
     "acc": 63.3,
     "adjustedAcc": 60.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3267,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3003,
    "diana": 0.1139,
    "nova": 0.2877,
    "flow": 0.298
   },
   "acc": {
    "taro": {
     "n": 639,
     "acc": 59.2,
     "adjustedAcc": 57.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 189,
     "acc": 55.0,
     "adjustedAcc": 53.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 538,
     "acc": 58.2,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 193,
     "acc": 59.1,
     "adjustedAcc": 55.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1559,
   "globalBlend": 0.339
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.257,
    "diana": 0.1344,
    "nova": 0.3131,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 554,
     "acc": 44.0,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 249,
     "acc": 60.2,
     "adjustedAcc": 56.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 485,
     "acc": 57.9,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 122,
     "acc": 50.8,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1410,
   "globalBlend": 0.362
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2967,
    "diana": 0.1174,
    "nova": 0.3143,
    "flow": 0.2715
   },
   "acc": {
    "taro": {
     "n": 423,
     "acc": 53.2,
     "adjustedAcc": 52.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 206,
     "acc": 48.5,
     "adjustedAcc": 49.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 350,
     "acc": 58.6,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 98,
     "acc": 37.8,
     "adjustedAcc": 44.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1077,
   "globalBlend": 0.426
  },
  "통신": {
   "weights": {
    "taro": 0.2733,
    "diana": 0.1186,
    "nova": 0.2976,
    "flow": 0.3106
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 59,
     "acc": 52.5,
     "adjustedAcc": 50.8,
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
     "n": 82,
     "acc": 63.4,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 491,
   "globalBlend": 0.62
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1574,
    "nova": 0.2724,
    "flow": 0.2911
   },
   "acc": {
    "taro": {
     "n": 520,
     "acc": 52.5,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 231,
     "acc": 76.6,
     "adjustedAcc": 67.5,
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
     "n": 76,
     "acc": 55.3,
     "adjustedAcc": 52.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1241,
   "globalBlend": 0.392
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2839,
    "diana": 0.1036,
    "nova": 0.3217,
    "flow": 0.2908
   },
   "acc": {
    "taro": {
     "n": 613,
     "acc": 48.5,
     "adjustedAcc": 48.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 300,
     "acc": 38.3,
     "adjustedAcc": 41.7,
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
     "n": 167,
     "acc": 46.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1551,
   "globalBlend": 0.34
  },
  "2차전지": {
   "weights": {
    "taro": 0.3067,
    "diana": 0.1086,
    "nova": 0.3228,
    "flow": 0.262
   },
   "acc": {
    "taro": {
     "n": 588,
     "acc": 62.1,
     "adjustedAcc": 60.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 179,
     "acc": 51.4,
     "adjustedAcc": 50.8,
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
     "n": 23,
     "acc": 43.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1267,
   "globalBlend": 0.387
  },
  "보험": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.14,
    "nova": 0.2876,
    "flow": 0.2946
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 51.4,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 98,
     "acc": 80.6,
     "adjustedAcc": 63.8,
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
     "n": 41,
     "acc": 51.2,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 512,
   "globalBlend": 0.61
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2857,
    "diana": 0.118,
    "nova": 0.2961,
    "flow": 0.3003
   },
   "acc": {
    "taro": {
     "n": 1458,
     "acc": 55.7,
     "adjustedAcc": 55.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 573,
     "acc": 56.5,
     "adjustedAcc": 55.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1191,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 189,
     "acc": 60.3,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3411,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1274,
    "nova": 0.3202,
    "flow": 0.2779
   },
   "acc": {
    "taro": {
     "n": 641,
     "acc": 49.9,
     "adjustedAcc": 49.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 327,
     "acc": 57.5,
     "adjustedAcc": 55.5,
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
     "n": 59,
     "acc": 45.8,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1544,
   "globalBlend": 0.341
  },
  "조선": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.1334,
    "nova": 0.3005,
    "flow": 0.3004
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 44.9,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 166,
     "acc": 62.0,
     "adjustedAcc": 57.0,
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
     "n": 63,
     "acc": 52.4,
     "adjustedAcc": 50.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 901,
   "globalBlend": 0.47
  },
  "방산": {
   "weights": {
    "taro": 0.2757,
    "diana": 0.1191,
    "nova": 0.2953,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 47.9,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 48.1,
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
     "n": 9,
     "acc": 100.0,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 333,
   "globalBlend": 0.706
  },
  "철강·금속": {
   "weights": {
    "taro": 0.285,
    "diana": 0.146,
    "nova": 0.2826,
    "flow": 0.2865
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 55.6,
     "adjustedAcc": 53.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 131,
     "acc": 82.4,
     "adjustedAcc": 66.9,
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
     "n": 5,
     "acc": 20.0,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 558,
   "globalBlend": 0.589
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2765,
    "diana": 0.1191,
    "nova": 0.2988,
    "flow": 0.3056
   },
   "acc": {
    "taro": {
     "n": 808,
     "acc": 53.3,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 409,
     "acc": 56.2,
     "adjustedAcc": 54.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 675,
     "acc": 59.3,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 99,
     "acc": 63.6,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1991,
   "globalBlend": 0.287
  },
  "물류·운송": {
   "weights": {
    "taro": 0.268,
    "diana": 0.1428,
    "nova": 0.2785,
    "flow": 0.3107
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 43.9,
     "adjustedAcc": 46.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 73,
     "acc": 89.0,
     "adjustedAcc": 64.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 108,
     "acc": 45.4,
     "adjustedAcc": 47.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 110,
     "acc": 58.2,
     "adjustedAcc": 53.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 455,
   "globalBlend": 0.637
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2913,
    "diana": 0.1117,
    "nova": 0.2937,
    "flow": 0.3033
   },
   "acc": {
    "taro": {
     "n": 499,
     "acc": 53.7,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 224,
     "acc": 46.4,
     "adjustedAcc": 47.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 359,
     "acc": 55.4,
     "adjustedAcc": 54.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 22,
     "acc": 68.2,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1104,
   "globalBlend": 0.42
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2811,
    "diana": 0.1348,
    "nova": 0.2697,
    "flow": 0.3143
   },
   "acc": {
    "taro": {
     "n": 302,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 108,
     "acc": 68.5,
     "adjustedAcc": 58.8,
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
     "n": 24,
     "acc": 75.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 638,
   "globalBlend": 0.556
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.1269,
    "nova": 0.3097,
    "flow": 0.2816
   },
   "acc": {
    "taro": {
     "n": 330,
     "acc": 52.1,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 60.4,
     "adjustedAcc": 55.6,
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
     "n": 122,
     "acc": 45.9,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 844,
   "globalBlend": 0.487
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.264,
    "diana": 0.1146,
    "nova": 0.3083,
    "flow": 0.3132
   },
   "acc": {
    "taro": {
     "n": 336,
     "acc": 38.1,
     "adjustedAcc": 41.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 166,
     "acc": 37.3,
     "adjustedAcc": 42.7,
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
   "graded": 776,
   "globalBlend": 0.508
  },
  "기계": {
   "weights": {
    "taro": 0.2669,
    "diana": 0.1281,
    "nova": 0.2941,
    "flow": 0.3109
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 38.2,
     "adjustedAcc": 44.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 50,
     "acc": 74.0,
     "adjustedAcc": 57.1,
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
     "n": 11,
     "acc": 100.0,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 268,
   "globalBlend": 0.749
  },
  "로봇": {
   "weights": {
    "taro": 0.2968,
    "diana": 0.1025,
    "nova": 0.3185,
    "flow": 0.2823
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 58.5,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 111,
     "acc": 25.2,
     "adjustedAcc": 38.1,
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
     "n": 59,
     "acc": 42.4,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 636,
   "globalBlend": 0.557
  },
  "식음료": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.1643,
    "nova": 0.2704,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 44.1,
     "adjustedAcc": 45.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 139,
     "acc": 88.5,
     "adjustedAcc": 70.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 212,
     "acc": 43.9,
     "adjustedAcc": 46.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 3,
     "acc": 66.7,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 653,
   "globalBlend": 0.551
  },
  "여행레저": {
   "weights": {
    "taro": 0.2895,
    "diana": 0.1147,
    "nova": 0.2979,
    "flow": 0.298
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 54.9,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 21.7,
     "adjustedAcc": 42.2,
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
     "n": 43,
     "acc": 41.9,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 342,
   "globalBlend": 0.701
  }
 }
};
