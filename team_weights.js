// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 14:57",
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
   "taro": 0.2794,
   "diana": 0.1205,
   "nova": 0.2932,
   "flow": 0.307
  },
  "acc": {
   "taro": {
    "n": 10773,
    "acc": 52.7,
    "adjustedAcc": 52.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4309,
    "acc": 55.3,
    "adjustedAcc": 55.2,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9009,
    "acc": 56.7,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1968,
    "acc": 56.1,
    "adjustedAcc": 55.8,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26059,
  "team": {
   "hit": 7175,
   "miss": 6810,
   "n": 13985,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.0974,
    "nova": 0.2666,
    "flow": 0.3553
   },
   "acc": {
    "taro": {
     "n": 1291,
     "acc": 51.7,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 386,
     "acc": 42.2,
     "adjustedAcc": 44.1,
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
     "n": 404,
     "acc": 64.1,
     "adjustedAcc": 60.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3198,
   "globalBlend": 0.25
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3019,
    "diana": 0.1116,
    "nova": 0.2852,
    "flow": 0.3014
   },
   "acc": {
    "taro": {
     "n": 619,
     "acc": 59.6,
     "adjustedAcc": 58.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 176,
     "acc": 54.5,
     "adjustedAcc": 52.7,
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
     "acc": 60.5,
     "adjustedAcc": 56.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1518,
   "globalBlend": 0.345
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2599,
    "diana": 0.1317,
    "nova": 0.3128,
    "flow": 0.2956
   },
   "acc": {
    "taro": {
     "n": 535,
     "acc": 44.1,
     "adjustedAcc": 45.2,
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
     "n": 117,
     "acc": 50.4,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1366,
   "globalBlend": 0.369
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3007,
    "diana": 0.1139,
    "nova": 0.3125,
    "flow": 0.2728
   },
   "acc": {
    "taro": {
     "n": 408,
     "acc": 53.9,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 191,
     "acc": 46.6,
     "adjustedAcc": 47.9,
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
     "acc": 37.9,
     "adjustedAcc": 44.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1044,
   "globalBlend": 0.434
  },
  "통신": {
   "weights": {
    "taro": 0.2785,
    "diana": 0.1167,
    "nova": 0.2955,
    "flow": 0.3093
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 51.6,
     "adjustedAcc": 51.0,
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
     "n": 78,
     "acc": 62.8,
     "adjustedAcc": 55.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 479,
   "globalBlend": 0.625
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2844,
    "diana": 0.1534,
    "nova": 0.2697,
    "flow": 0.2925
   },
   "acc": {
    "taro": {
     "n": 499,
     "acc": 53.9,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 215,
     "acc": 76.7,
     "adjustedAcc": 67.2,
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
     "n": 74,
     "acc": 56.8,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1202,
   "globalBlend": 0.4
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2884,
    "diana": 0.1022,
    "nova": 0.3198,
    "flow": 0.2896
   },
   "acc": {
    "taro": {
     "n": 595,
     "acc": 49.2,
     "adjustedAcc": 49.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 285,
     "acc": 37.9,
     "adjustedAcc": 41.5,
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
     "n": 164,
     "acc": 46.3,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1515,
   "globalBlend": 0.346
  },
  "2차전지": {
   "weights": {
    "taro": 0.314,
    "diana": 0.1067,
    "nova": 0.3185,
    "flow": 0.2608
   },
   "acc": {
    "taro": {
     "n": 566,
     "acc": 64.0,
     "adjustedAcc": 61.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 167,
     "acc": 51.5,
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
     "n": 21,
     "acc": 42.9,
     "adjustedAcc": 48.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1231,
   "globalBlend": 0.394
  },
  "보험": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1367,
    "nova": 0.2872,
    "flow": 0.2966
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 50.5,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 90,
     "acc": 80.0,
     "adjustedAcc": 62.9,
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
   "graded": 494,
   "globalBlend": 0.618
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2922,
    "diana": 0.1168,
    "nova": 0.2924,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 1407,
     "acc": 57.1,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 537,
     "acc": 57.0,
     "adjustedAcc": 55.7,
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
     "n": 179,
     "acc": 60.9,
     "adjustedAcc": 56.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3313,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2765,
    "diana": 0.1272,
    "nova": 0.3184,
    "flow": 0.2779
   },
   "acc": {
    "taro": {
     "n": 620,
     "acc": 50.2,
     "adjustedAcc": 50.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 302,
     "acc": 58.3,
     "adjustedAcc": 55.9,
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
     "acc": 45.6,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1496,
   "globalBlend": 0.348
  },
  "조선": {
   "weights": {
    "taro": 0.2698,
    "diana": 0.1296,
    "nova": 0.2987,
    "flow": 0.3019
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 45.7,
     "adjustedAcc": 46.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 153,
     "acc": 60.8,
     "adjustedAcc": 56.0,
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
     "n": 62,
     "acc": 53.2,
     "adjustedAcc": 51.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 877,
   "globalBlend": 0.477
  },
  "방산": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.1173,
    "nova": 0.2944,
    "flow": 0.3105
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 46.5,
     "adjustedAcc": 48.0,
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
   "graded": 326,
   "globalBlend": 0.71
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2903,
    "diana": 0.1404,
    "nova": 0.2803,
    "flow": 0.289
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 57.5,
     "adjustedAcc": 54.8,
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
   "graded": 538,
   "globalBlend": 0.598
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2824,
    "diana": 0.1153,
    "nova": 0.297,
    "flow": 0.3053
   },
   "acc": {
    "taro": {
     "n": 779,
     "acc": 54.4,
     "adjustedAcc": 53.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 382,
     "acc": 55.0,
     "adjustedAcc": 53.8,
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
     "n": 97,
     "acc": 63.9,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1933,
   "globalBlend": 0.293
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2718,
    "diana": 0.1392,
    "nova": 0.2773,
    "flow": 0.3118
   },
   "acc": {
    "taro": {
     "n": 158,
     "acc": 44.3,
     "adjustedAcc": 46.8,
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
   "graded": 441,
   "globalBlend": 0.645
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.294,
    "diana": 0.1104,
    "nova": 0.291,
    "flow": 0.3047
   },
   "acc": {
    "taro": {
     "n": 479,
     "acc": 54.3,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 207,
     "acc": 46.4,
     "adjustedAcc": 47.7,
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
   "graded": 1065,
   "globalBlend": 0.429
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.1307,
    "nova": 0.269,
    "flow": 0.3166
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 99,
     "acc": 66.7,
     "adjustedAcc": 57.5,
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
   "graded": 616,
   "globalBlend": 0.565
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.287,
    "diana": 0.1227,
    "nova": 0.3081,
    "flow": 0.2823
   },
   "acc": {
    "taro": {
     "n": 316,
     "acc": 53.2,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 129,
     "acc": 58.1,
     "adjustedAcc": 54.2,
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
     "n": 118,
     "acc": 45.8,
     "adjustedAcc": 47.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 816,
   "globalBlend": 0.495
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2698,
    "diana": 0.1121,
    "nova": 0.3056,
    "flow": 0.3125
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
     "n": 155,
     "acc": 36.1,
     "adjustedAcc": 42.2,
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
   "graded": 748,
   "globalBlend": 0.517
  },
  "기계": {
   "weights": {
    "taro": 0.2706,
    "diana": 0.1253,
    "nova": 0.2928,
    "flow": 0.3114
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 37.7,
     "adjustedAcc": 44.2,
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
    "taro": 0.2995,
    "diana": 0.1023,
    "nova": 0.3157,
    "flow": 0.2825
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 59.1,
     "adjustedAcc": 56.1,
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
     "acc": 42.1,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 620,
   "globalBlend": 0.563
  },
  "식음료": {
   "weights": {
    "taro": 0.271,
    "diana": 0.1602,
    "nova": 0.269,
    "flow": 0.2997
   },
   "acc": {
    "taro": {
     "n": 282,
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
   "graded": 626,
   "globalBlend": 0.561
  },
  "여행레저": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.1124,
    "nova": 0.2958,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 55.7,
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
   "graded": 337,
   "globalBlend": 0.704
  }
 }
};
