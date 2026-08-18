// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 09:45",
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
   "diana": 0.121,
   "nova": 0.2926,
   "flow": 0.3036
  },
  "acc": {
   "taro": {
    "n": 10763,
    "acc": 53.2,
    "adjustedAcc": 53.1,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4318,
    "acc": 55.5,
    "adjustedAcc": 55.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9008,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1965,
    "acc": 55.8,
    "adjustedAcc": 55.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26054,
  "team": {
   "hit": 7174,
   "miss": 6812,
   "n": 13986,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2824,
    "diana": 0.098,
    "nova": 0.2657,
    "flow": 0.3538
   },
   "acc": {
    "taro": {
     "n": 1291,
     "acc": 52.1,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 386,
     "acc": 42.7,
     "adjustedAcc": 44.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1117,
     "acc": 51.1,
     "adjustedAcc": 51.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 405,
     "acc": 64.2,
     "adjustedAcc": 61.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3199,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3032,
    "diana": 0.1123,
    "nova": 0.2856,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 620,
     "acc": 59.5,
     "adjustedAcc": 58.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 177,
     "acc": 54.8,
     "adjustedAcc": 52.9,
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
     "n": 185,
     "acc": 60.0,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1520,
   "globalBlend": 0.345
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2651,
    "diana": 0.1317,
    "nova": 0.3124,
    "flow": 0.2907
   },
   "acc": {
    "taro": {
     "n": 538,
     "acc": 45.2,
     "adjustedAcc": 46.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 229,
     "acc": 59.4,
     "adjustedAcc": 56.2,
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
     "n": 118,
     "acc": 49.2,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1370,
   "globalBlend": 0.369
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.1142,
    "nova": 0.3108,
    "flow": 0.2722
   },
   "acc": {
    "taro": {
     "n": 408,
     "acc": 54.4,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 191,
     "acc": 47.1,
     "adjustedAcc": 48.2,
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
     "n": 95,
     "acc": 38.9,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1044,
   "globalBlend": 0.434
  },
  "통신": {
   "weights": {
    "taro": 0.2825,
    "diana": 0.1172,
    "nova": 0.2953,
    "flow": 0.305
   },
   "acc": {
    "taro": {
     "n": 187,
     "acc": 52.4,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 57,
     "acc": 52.6,
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
     "n": 75,
     "acc": 61.3,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 473,
   "globalBlend": 0.628
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2872,
    "diana": 0.1537,
    "nova": 0.2693,
    "flow": 0.2897
   },
   "acc": {
    "taro": {
     "n": 499,
     "acc": 54.3,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 213,
     "acc": 77.0,
     "adjustedAcc": 67.3,
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
     "n": 73,
     "acc": 56.2,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1199,
   "globalBlend": 0.4
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2914,
    "diana": 0.1028,
    "nova": 0.3199,
    "flow": 0.2858
   },
   "acc": {
    "taro": {
     "n": 597,
     "acc": 49.6,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 283,
     "acc": 38.2,
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
     "n": 165,
     "acc": 45.5,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1516,
   "globalBlend": 0.345
  },
  "2차전지": {
   "weights": {
    "taro": 0.3195,
    "diana": 0.107,
    "nova": 0.3174,
    "flow": 0.256
   },
   "acc": {
    "taro": {
     "n": 562,
     "acc": 64.9,
     "adjustedAcc": 62.3,
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
     "n": 477,
     "acc": 67.1,
     "adjustedAcc": 63.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 21,
     "acc": 38.1,
     "adjustedAcc": 48.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1228,
   "globalBlend": 0.394
  },
  "보험": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.1374,
    "nova": 0.2869,
    "flow": 0.2945
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 50.2,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 91,
     "acc": 80.2,
     "adjustedAcc": 63.0,
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
   "graded": 496,
   "globalBlend": 0.617
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.1167,
    "nova": 0.2928,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 1408,
     "acc": 57.5,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 539,
     "acc": 56.8,
     "adjustedAcc": 55.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 1190,
     "acc": 59.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 180,
     "acc": 60.0,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3317,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1282,
    "nova": 0.3181,
    "flow": 0.2739
   },
   "acc": {
    "taro": {
     "n": 616,
     "acc": 50.6,
     "adjustedAcc": 50.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 305,
     "acc": 58.7,
     "adjustedAcc": 56.2,
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
     "n": 57,
     "acc": 43.9,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1495,
   "globalBlend": 0.349
  },
  "조선": {
   "weights": {
    "taro": 0.2722,
    "diana": 0.13,
    "nova": 0.2973,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 46.2,
     "adjustedAcc": 47.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 155,
     "acc": 61.3,
     "adjustedAcc": 56.4,
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
   "graded": 878,
   "globalBlend": 0.477
  },
  "방산": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.1176,
    "nova": 0.2936,
    "flow": 0.3077
   },
   "acc": {
    "taro": {
     "n": 158,
     "acc": 47.5,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 34,
     "acc": 41.2,
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
     "n": 8,
     "acc": 100.0,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 325,
   "globalBlend": 0.711
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2935,
    "diana": 0.1405,
    "nova": 0.2794,
    "flow": 0.2866
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 58.1,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 122,
     "acc": 81.1,
     "adjustedAcc": 65.7,
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
     "n": 3,
     "acc": 33.3,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 539,
   "globalBlend": 0.597
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2858,
    "diana": 0.1156,
    "nova": 0.2962,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 778,
     "acc": 55.0,
     "adjustedAcc": 54.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 379,
     "acc": 55.1,
     "adjustedAcc": 53.9,
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
     "n": 96,
     "acc": 63.5,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1928,
   "globalBlend": 0.293
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1395,
    "nova": 0.2768,
    "flow": 0.3094
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 44.7,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 69,
     "acc": 88.4,
     "adjustedAcc": 64.0,
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
     "n": 106,
     "acc": 58.5,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 442,
   "globalBlend": 0.644
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.1104,
    "nova": 0.2909,
    "flow": 0.3034
   },
   "acc": {
    "taro": {
     "n": 476,
     "acc": 54.2,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 208,
     "acc": 46.2,
     "adjustedAcc": 47.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 358,
     "acc": 55.3,
     "adjustedAcc": 54.0,
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
   "graded": 1063,
   "globalBlend": 0.429
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2851,
    "diana": 0.1317,
    "nova": 0.2686,
    "flow": 0.3146
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 101,
     "acc": 67.3,
     "adjustedAcc": 57.9,
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
     "n": 23,
     "acc": 78.3,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 617,
   "globalBlend": 0.565
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2902,
    "diana": 0.1222,
    "nova": 0.3051,
    "flow": 0.2825
   },
   "acc": {
    "taro": {
     "n": 318,
     "acc": 54.4,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 130,
     "acc": 58.5,
     "adjustedAcc": 54.4,
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
     "n": 117,
     "acc": 47.9,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 818,
   "globalBlend": 0.494
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.113,
    "nova": 0.3051,
    "flow": 0.3106
   },
   "acc": {
    "taro": {
     "n": 319,
     "acc": 39.5,
     "adjustedAcc": 42.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 157,
     "acc": 36.9,
     "adjustedAcc": 42.6,
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
   "graded": 750,
   "globalBlend": 0.516
  },
  "기계": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1254,
    "nova": 0.2919,
    "flow": 0.3083
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 39.6,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 47,
     "acc": 72.3,
     "adjustedAcc": 56.3,
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
     "n": 10,
     "acc": 100.0,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 260,
   "globalBlend": 0.755
  },
  "로봇": {
   "weights": {
    "taro": 0.3071,
    "diana": 0.1022,
    "nova": 0.3134,
    "flow": 0.2773
   },
   "acc": {
    "taro": {
     "n": 248,
     "acc": 61.7,
     "adjustedAcc": 57.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 103,
     "acc": 27.2,
     "adjustedAcc": 39.5,
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
     "n": 57,
     "acc": 40.4,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 621,
   "globalBlend": 0.563
  },
  "식음료": {
   "weights": {
    "taro": 0.2729,
    "diana": 0.1604,
    "nova": 0.2688,
    "flow": 0.2979
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 45.4,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 129,
     "acc": 89.1,
     "adjustedAcc": 70.3,
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
   "graded": 624,
   "globalBlend": 0.562
  },
  "여행레저": {
   "weights": {
    "taro": 0.2958,
    "diana": 0.1128,
    "nova": 0.2949,
    "flow": 0.2964
   },
   "acc": {
    "taro": {
     "n": 136,
     "acc": 55.9,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 20.0,
     "adjustedAcc": 41.8,
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
   "graded": 332,
   "globalBlend": 0.707
  }
 }
};
