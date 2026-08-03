// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 11:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2849,
   "diana": 0.191,
   "nova": 0.2679,
   "flow": 0.2562
  },
  "acc": {
   "taro": {
    "n": 7065,
    "acc": 61.7
   },
   "diana": {
    "n": 6430,
    "acc": 41.4
   },
   "nova": {
    "n": 5741,
    "acc": 58.0
   },
   "flow": {
    "n": 1231,
    "acc": 55.5
   }
  },
  "graded": 20467,
  "team": {
   "hit": 5591,
   "miss": 1368,
   "n": 6959,
   "acc": 80.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2996,
    "diana": 0.1739,
    "nova": 0.2174,
    "flow": 0.3091
   },
   "acc": {
    "taro": {
     "n": 863,
     "acc": 68.7
    },
    "diana": {
     "n": 564,
     "acc": 39.9
    },
    "nova": {
     "n": 748,
     "acc": 49.9
    },
    "flow": {
     "n": 275,
     "acc": 70.9
    }
   },
   "graded": 2450
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3098,
    "diana": 0.1531,
    "nova": 0.2527,
    "flow": 0.2844
   },
   "acc": {
    "taro": {
     "n": 421,
     "acc": 77.7
    },
    "diana": {
     "n": 259,
     "acc": 37.1
    },
    "nova": {
     "n": 353,
     "acc": 61.2
    },
    "flow": {
     "n": 122,
     "acc": 68.9
    }
   },
   "graded": 1155
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2583,
    "diana": 0.2263,
    "nova": 0.2603,
    "flow": 0.255
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 54.7
    },
    "diana": {
     "n": 334,
     "acc": 47.9
    },
    "nova": {
     "n": 314,
     "acc": 55.1
    },
    "flow": {
     "n": 63,
     "acc": 54.0
    }
   },
   "graded": 1064
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3291,
    "diana": 0.1592,
    "nova": 0.3428,
    "flow": 0.1689
   },
   "acc": {
    "taro": {
     "n": 279,
     "acc": 62.0
    },
    "diana": {
     "n": 311,
     "acc": 29.9
    },
    "nova": {
     "n": 223,
     "acc": 64.6
    },
    "flow": {
     "n": 66,
     "acc": 31.8
    }
   },
   "graded": 879
  },
  "통신": {
   "weights": {
    "taro": 0.258,
    "diana": 0.1878,
    "nova": 0.2605,
    "flow": 0.2937
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 60.0
    },
    "diana": {
     "n": 87,
     "acc": 43.7
    },
    "nova": {
     "n": 104,
     "acc": 60.6
    },
    "flow": {
     "n": 41,
     "acc": 68.3
    }
   },
   "graded": 362
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2325,
    "diana": 0.2317,
    "nova": 0.2682,
    "flow": 0.2677
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 50.0
    },
    "diana": {
     "n": 293,
     "acc": 49.8
    },
    "nova": {
     "n": 260,
     "acc": 57.7
    },
    "flow": {
     "n": 33,
     "acc": 57.6
    }
   },
   "graded": 898
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3252,
    "diana": 0.1652,
    "nova": 0.3122,
    "flow": 0.1973
   },
   "acc": {
    "taro": {
     "n": 403,
     "acc": 59.1
    },
    "diana": {
     "n": 453,
     "acc": 25.2
    },
    "nova": {
     "n": 291,
     "acc": 56.7
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1267
  },
  "2차전지": {
   "weights": {
    "taro": 0.3034,
    "diana": 0.1965,
    "nova": 0.2979,
    "flow": 0.2022
   },
   "acc": {
    "taro": {
     "n": 382,
     "acc": 82.5
    },
    "diana": {
     "n": 245,
     "acc": 48.6
    },
    "nova": {
     "n": 315,
     "acc": 73.7
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 944
  },
  "보험": {
   "weights": {
    "taro": 0.2652,
    "diana": 0.2393,
    "nova": 0.2707,
    "flow": 0.2248
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 53.6
    },
    "diana": {
     "n": 124,
     "acc": 48.4
    },
    "nova": {
     "n": 95,
     "acc": 54.7
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 390
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.2231,
    "nova": 0.2551,
    "flow": 0.2445
   },
   "acc": {
    "taro": {
     "n": 894,
     "acc": 65.9
    },
    "diana": {
     "n": 775,
     "acc": 53.0
    },
    "nova": {
     "n": 747,
     "acc": 60.6
    },
    "flow": {
     "n": 117,
     "acc": 58.1
    }
   },
   "graded": 2533
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3049,
    "diana": 0.2164,
    "nova": 0.3207,
    "flow": 0.158
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 57.9
    },
    "diana": {
     "n": 460,
     "acc": 41.1
    },
    "nova": {
     "n": 335,
     "acc": 60.9
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1237
  },
  "조선": {
   "weights": {
    "taro": 0.2808,
    "diana": 0.1816,
    "nova": 0.279,
    "flow": 0.2587
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 54.3
    },
    "diana": {
     "n": 245,
     "acc": 35.1
    },
    "nova": {
     "n": 204,
     "acc": 53.9
    },
    "flow": {
     "n": 32,
     "acc": 50.0
    }
   },
   "graded": 715
  },
  "방산": {
   "weights": {
    "taro": 0.2939,
    "diana": 0.1577,
    "nova": 0.2893,
    "flow": 0.2591
   },
   "acc": {
    "taro": {
     "n": 104,
     "acc": 56.7
    },
    "diana": {
     "n": 46,
     "acc": 30.4
    },
    "nova": {
     "n": 77,
     "acc": 55.8
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 228
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2983,
    "diana": 0.176,
    "nova": 0.2864,
    "flow": 0.2393
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 62.3
    },
    "diana": {
     "n": 155,
     "acc": 36.8
    },
    "nova": {
     "n": 127,
     "acc": 59.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 428
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.1653,
    "nova": 0.2593,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 514,
     "acc": 66.1
    },
    "diana": {
     "n": 540,
     "acc": 40.6
    },
    "nova": {
     "n": 434,
     "acc": 63.6
    },
    "flow": {
     "n": 71,
     "acc": 77.5
    }
   },
   "graded": 1559
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2584,
    "diana": 0.2588,
    "nova": 0.238,
    "flow": 0.2448
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 48.5
    },
    "diana": {
     "n": 103,
     "acc": 48.5
    },
    "nova": {
     "n": 56,
     "acc": 44.6
    },
    "flow": {
     "n": 61,
     "acc": 45.9
    }
   },
   "graded": 317
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1854,
    "nova": 0.2817,
    "flow": 0.2543
   },
   "acc": {
    "taro": {
     "n": 303,
     "acc": 54.8
    },
    "diana": {
     "n": 321,
     "acc": 36.4
    },
    "nova": {
     "n": 213,
     "acc": 55.4
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 853
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2676,
    "diana": 0.2204,
    "nova": 0.2307,
    "flow": 0.2814
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 47.5
    },
    "diana": {
     "n": 143,
     "acc": 39.2
    },
    "nova": {
     "n": 122,
     "acc": 41.0
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 449
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3245,
    "diana": 0.1622,
    "nova": 0.3305,
    "flow": 0.1828
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 60.0
    },
    "diana": {
     "n": 191,
     "acc": 29.3
    },
    "nova": {
     "n": 162,
     "acc": 61.1
    },
    "flow": {
     "n": 71,
     "acc": 33.8
    }
   },
   "graded": 634
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2436,
    "diana": 0.1923,
    "nova": 0.2894,
    "flow": 0.2747
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 44.3
    },
    "diana": {
     "n": 260,
     "acc": 35.0
    },
    "nova": {
     "n": 169,
     "acc": 52.7
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 633
  },
  "기계": {
   "weights": {
    "taro": 0.2134,
    "diana": 0.2049,
    "nova": 0.3027,
    "flow": 0.279
   },
   "acc": {
    "taro": {
     "n": 68,
     "acc": 38.2
    },
    "diana": {
     "n": 79,
     "acc": 36.7
    },
    "nova": {
     "n": 59,
     "acc": 54.2
    },
    "flow": {
     "n": 3,
     "acc": 100.0
    }
   },
   "graded": 209
  },
  "로봇": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.2722,
    "nova": 0.2888,
    "flow": 0.1764
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 65.7
    },
    "diana": {
     "n": 141,
     "acc": 68.1
    },
    "nova": {
     "n": 144,
     "acc": 72.2
    },
    "flow": {
     "n": 34,
     "acc": 44.1
    }
   },
   "graded": 488
  },
  "식음료": {
   "weights": {
    "taro": 0.2008,
    "diana": 0.3042,
    "nova": 0.2097,
    "flow": 0.2853
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 35.2
    },
    "diana": {
     "n": 227,
     "acc": 53.3
    },
    "nova": {
     "n": 117,
     "acc": 36.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 506
  },
  "여행레저": {
   "weights": {
    "taro": 0.3608,
    "diana": 0.1642,
    "nova": 0.304,
    "flow": 0.171
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 65.9
    },
    "diana": {
     "n": 74,
     "acc": 23.0
    },
    "nova": {
     "n": 72,
     "acc": 55.6
    },
    "flow": {
     "n": 32,
     "acc": 31.2
    }
   },
   "graded": 269
  }
 }
};
