// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-18 10:15",
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
   "taro": 0.2838,
   "diana": 0.1209,
   "nova": 0.292,
   "flow": 0.3032
  },
  "acc": {
   "taro": {
    "n": 10761,
    "acc": 53.3,
    "adjustedAcc": 53.3,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 4322,
    "acc": 55.6,
    "adjustedAcc": 55.4,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 9009,
    "acc": 56.6,
    "adjustedAcc": 56.6,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1968,
    "acc": 55.8,
    "adjustedAcc": 55.5,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 26060,
  "team": {
   "hit": 7176,
   "miss": 6811,
   "n": 13987,
   "acc": 51.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2827,
    "diana": 0.098,
    "nova": 0.2655,
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
    "taro": 0.3035,
    "diana": 0.1123,
    "nova": 0.2854,
    "flow": 0.2988
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
    "taro": 0.2666,
    "diana": 0.1312,
    "nova": 0.3118,
    "flow": 0.2903
   },
   "acc": {
    "taro": {
     "n": 538,
     "acc": 45.5,
     "adjustedAcc": 46.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 228,
     "acc": 59.2,
     "adjustedAcc": 56.0,
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
   "graded": 1369,
   "globalBlend": 0.369
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3036,
    "diana": 0.1141,
    "nova": 0.3104,
    "flow": 0.2719
   },
   "acc": {
    "taro": {
     "n": 409,
     "acc": 54.5,
     "adjustedAcc": 53.5,
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
   "graded": 1045,
   "globalBlend": 0.434
  },
  "통신": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.1172,
    "nova": 0.2952,
    "flow": 0.3039
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 52.6,
     "adjustedAcc": 51.6,
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
     "acc": 60.3,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 479,
   "globalBlend": 0.625
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2886,
    "diana": 0.1534,
    "nova": 0.2688,
    "flow": 0.2892
   },
   "acc": {
    "taro": {
     "n": 496,
     "acc": 54.6,
     "adjustedAcc": 53.7,
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
   "graded": 1196,
   "globalBlend": 0.401
  },
  "금융·증권": {
   "weights": {
    "taro": 0.292,
    "diana": 0.1027,
    "nova": 0.3191,
    "flow": 0.2861
   },
   "acc": {
    "taro": {
     "n": 595,
     "acc": 49.7,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 285,
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
     "n": 164,
     "acc": 45.7,
     "adjustedAcc": 47.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1515,
   "globalBlend": 0.346
  },
  "2차전지": {
   "weights": {
    "taro": 0.3222,
    "diana": 0.1067,
    "nova": 0.3161,
    "flow": 0.2551
   },
   "acc": {
    "taro": {
     "n": 564,
     "acc": 65.6,
     "adjustedAcc": 62.9,
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
   "graded": 1230,
   "globalBlend": 0.394
  },
  "보험": {
   "weights": {
    "taro": 0.2818,
    "diana": 0.1374,
    "nova": 0.2866,
    "flow": 0.2942
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
    "taro": 0.2965,
    "diana": 0.1162,
    "nova": 0.292,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 1406,
     "acc": 57.7,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 538,
     "acc": 56.7,
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
     "n": 179,
     "acc": 60.3,
     "adjustedAcc": 56.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 3313,
   "globalBlend": 0.25
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2802,
    "diana": 0.1281,
    "nova": 0.3179,
    "flow": 0.2738
   },
   "acc": {
    "taro": {
     "n": 614,
     "acc": 50.7,
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
   "graded": 1493,
   "globalBlend": 0.349
  },
  "조선": {
   "weights": {
    "taro": 0.273,
    "diana": 0.1302,
    "nova": 0.2968,
    "flow": 0.3
   },
   "acc": {
    "taro": {
     "n": 347,
     "acc": 46.4,
     "adjustedAcc": 47.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 156,
     "acc": 61.5,
     "adjustedAcc": 56.5,
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
   "graded": 880,
   "globalBlend": 0.476
  },
  "방산": {
   "weights": {
    "taro": 0.2822,
    "diana": 0.1175,
    "nova": 0.293,
    "flow": 0.3073
   },
   "acc": {
    "taro": {
     "n": 157,
     "acc": 47.8,
     "adjustedAcc": 48.7,
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
   "graded": 324,
   "globalBlend": 0.712
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.1401,
    "nova": 0.2787,
    "flow": 0.2859
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 58.9,
     "adjustedAcc": 55.7,
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
    "taro": 0.2872,
    "diana": 0.116,
    "nova": 0.2961,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 777,
     "acc": 55.2,
     "adjustedAcc": 54.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 381,
     "acc": 55.4,
     "adjustedAcc": 54.1,
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
     "acc": 62.9,
     "adjustedAcc": 55.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1930,
   "globalBlend": 0.293
  },
  "물류·운송": {
   "weights": {
    "taro": 0.275,
    "diana": 0.1394,
    "nova": 0.2764,
    "flow": 0.3091
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
    "taro": 0.2956,
    "diana": 0.1106,
    "nova": 0.2906,
    "flow": 0.3031
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
   "graded": 1062,
   "globalBlend": 0.43
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2863,
    "diana": 0.1315,
    "nova": 0.2681,
    "flow": 0.3141
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 50.5,
     "adjustedAcc": 50.4,
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
    "taro": 0.2912,
    "diana": 0.1219,
    "nova": 0.3042,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 318,
     "acc": 54.7,
     "adjustedAcc": 53.4,
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
     "n": 118,
     "acc": 48.3,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 819,
   "globalBlend": 0.494
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2724,
    "diana": 0.1131,
    "nova": 0.3044,
    "flow": 0.31
   },
   "acc": {
    "taro": {
     "n": 319,
     "acc": 39.8,
     "adjustedAcc": 42.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 158,
     "acc": 37.3,
     "adjustedAcc": 42.8,
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
   "graded": 751,
   "globalBlend": 0.516
  },
  "기계": {
   "weights": {
    "taro": 0.2752,
    "diana": 0.1253,
    "nova": 0.2914,
    "flow": 0.308
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
    "taro": 0.308,
    "diana": 0.102,
    "nova": 0.313,
    "flow": 0.2769
   },
   "acc": {
    "taro": {
     "n": 249,
     "acc": 61.8,
     "adjustedAcc": 58.0,
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
   "graded": 622,
   "globalBlend": 0.563
  },
  "식음료": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1606,
    "nova": 0.2682,
    "flow": 0.2974
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 45.6,
     "adjustedAcc": 46.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 130,
     "acc": 89.2,
     "adjustedAcc": 70.4,
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
    "taro": 0.2963,
    "diana": 0.1129,
    "nova": 0.2943,
    "flow": 0.2964
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 55.5,
     "adjustedAcc": 52.9,
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
     "acc": 55.0,
     "adjustedAcc": 52.4,
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
   "graded": 334,
   "globalBlend": 0.705
  }
 }
};
