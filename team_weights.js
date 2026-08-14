// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-14 11:26",
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
   "taro": 0.2828,
   "diana": 0.1149,
   "nova": 0.2929,
   "flow": 0.3094
  },
  "acc": {
   "taro": {
    "n": 10377,
    "acc": 53.2,
    "adjustedAcc": 53.2,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 3966,
    "acc": 53.8,
    "adjustedAcc": 53.7,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 8989,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1893,
    "acc": 56.6,
    "adjustedAcc": 56.2,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 25225,
  "team": {
   "hit": 6950,
   "miss": 2870,
   "n": 9820,
   "acc": 70.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2803,
    "diana": 0.0928,
    "nova": 0.2646,
    "flow": 0.3624
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
     "n": 356,
     "acc": 40.7,
     "adjustedAcc": 43.1,
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
   "graded": 3107,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3023,
    "diana": 0.106,
    "nova": 0.2853,
    "flow": 0.3063
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
     "acc": 51.8,
     "adjustedAcc": 51.0,
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
    "nova": 0.3141,
    "flow": 0.2959
   },
   "acc": {
    "taro": {
     "n": 518,
     "acc": 44.4,
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
     "n": 114,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1325,
   "globalBlend": 0.376
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3018,
    "diana": 0.1088,
    "nova": 0.3143,
    "flow": 0.2752
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
     "n": 179,
     "acc": 43.6,
     "adjustedAcc": 46.2,
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
   "graded": 1015,
   "globalBlend": 0.441
  },
  "통신": {
   "weights": {
    "taro": 0.2827,
    "diana": 0.1119,
    "nova": 0.2952,
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
    "taro": 0.2866,
    "diana": 0.1489,
    "nova": 0.2702,
    "flow": 0.2942
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
     "n": 200,
     "acc": 76.5,
     "adjustedAcc": 66.6,
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
   "graded": 1161,
   "globalBlend": 0.408
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2917,
    "diana": 0.0971,
    "nova": 0.3207,
    "flow": 0.2905
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
     "n": 258,
     "acc": 34.5,
     "adjustedAcc": 39.4,
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
   "graded": 1476,
   "globalBlend": 0.351
  },
  "2차전지": {
   "weights": {
    "taro": 0.322,
    "diana": 0.1042,
    "nova": 0.316,
    "flow": 0.2579
   },
   "acc": {
    "taro": {
     "n": 545,
     "acc": 65.9,
     "adjustedAcc": 63.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 151,
     "acc": 51.7,
     "adjustedAcc": 50.9,
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
   "graded": 1190,
   "globalBlend": 0.402
  },
  "보험": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.1303,
    "nova": 0.2885,
    "flow": 0.3006
   },
   "acc": {
    "taro": {
     "n": 201,
     "acc": 49.3,
     "adjustedAcc": 49.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 77.5,
     "adjustedAcc": 61.0,
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
   "graded": 476,
   "globalBlend": 0.627
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2989,
    "diana": 0.1136,
    "nova": 0.2901,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 1352,
     "acc": 58.6,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 495,
     "acc": 56.8,
     "adjustedAcc": 55.4,
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
     "n": 171,
     "acc": 61.4,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3206,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2784,
    "diana": 0.1251,
    "nova": 0.3192,
    "flow": 0.2773
   },
   "acc": {
    "taro": {
     "n": 591,
     "acc": 50.1,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 275,
     "acc": 58.2,
     "adjustedAcc": 55.7,
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
     "n": 55,
     "acc": 43.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1438,
   "globalBlend": 0.357
  },
  "조선": {
   "weights": {
    "taro": 0.2735,
    "diana": 0.1228,
    "nova": 0.2989,
    "flow": 0.3048
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
     "n": 139,
     "acc": 57.6,
     "adjustedAcc": 54.1,
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
   "graded": 852,
   "globalBlend": 0.484
  },
  "방산": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.1131,
    "nova": 0.2946,
    "flow": 0.311
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 47.4,
     "adjustedAcc": 48.5,
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
     "n": 124,
     "acc": 56.5,
     "adjustedAcc": 53.3,
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
   "graded": 316,
   "globalBlend": 0.717
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.1328,
    "nova": 0.28,
    "flow": 0.2918
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 59.3,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 110,
     "acc": 79.1,
     "adjustedAcc": 63.9,
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
   "graded": 515,
   "globalBlend": 0.608
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2861,
    "diana": 0.1107,
    "nova": 0.2973,
    "flow": 0.3059
   },
   "acc": {
    "taro": {
     "n": 748,
     "acc": 55.1,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 348,
     "acc": 53.4,
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
   "graded": 1864,
   "globalBlend": 0.3
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.1344,
    "nova": 0.2788,
    "flow": 0.3121
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
     "n": 99,
     "acc": 56.6,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 420,
   "globalBlend": 0.656
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2954,
    "diana": 0.1073,
    "nova": 0.2908,
    "flow": 0.3066
   },
   "acc": {
    "taro": {
     "n": 460,
     "acc": 54.1,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 188,
     "acc": 45.2,
     "adjustedAcc": 47.1,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 358,
     "acc": 55.0,
     "adjustedAcc": 53.8,
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
   "graded": 1027,
   "globalBlend": 0.438
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2856,
    "diana": 0.1256,
    "nova": 0.2693,
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
    "taro": 0.29,
    "diana": 0.1169,
    "nova": 0.3073,
    "flow": 0.2859
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 53.7,
     "adjustedAcc": 52.7,
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
   "graded": 792,
   "globalBlend": 0.503
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2736,
    "diana": 0.1079,
    "nova": 0.305,
    "flow": 0.3135
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
     "n": 147,
     "acc": 34.0,
     "adjustedAcc": 41.2,
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
   "graded": 725,
   "globalBlend": 0.525
  },
  "기계": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.12,
    "nova": 0.2931,
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
    "taro": 0.3022,
    "diana": 0.1007,
    "nova": 0.3138,
    "flow": 0.2832
   },
   "acc": {
    "taro": {
     "n": 238,
     "acc": 60.1,
     "adjustedAcc": 56.7,
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
   "graded": 601,
   "globalBlend": 0.571
  },
  "식음료": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.1538,
    "nova": 0.2698,
    "flow": 0.3009
   },
   "acc": {
    "taro": {
     "n": 266,
     "acc": 45.9,
     "adjustedAcc": 47.2,
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
   "graded": 599,
   "globalBlend": 0.572
  },
  "여행레저": {
   "weights": {
    "taro": 0.2961,
    "diana": 0.1077,
    "nova": 0.2954,
    "flow": 0.3008
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
     "n": 110,
     "acc": 55.5,
     "adjustedAcc": 52.6,
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
   "graded": 330,
   "globalBlend": 0.708
  }
 }
};
