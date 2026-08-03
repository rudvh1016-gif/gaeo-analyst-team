// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 15:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.285,
   "diana": 0.1889,
   "nova": 0.2686,
   "flow": 0.2575
  },
  "acc": {
   "taro": {
    "n": 7071,
    "acc": 61.9
   },
   "diana": {
    "n": 6438,
    "acc": 41.0
   },
   "nova": {
    "n": 5749,
    "acc": 58.4
   },
   "flow": {
    "n": 1228,
    "acc": 55.9
   }
  },
  "graded": 20486,
  "team": {
   "hit": 5597,
   "miss": 1344,
   "n": 6941,
   "acc": 80.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.1737,
    "nova": 0.2171,
    "flow": 0.3086
   },
   "acc": {
    "taro": {
     "n": 860,
     "acc": 69.0
    },
    "diana": {
     "n": 562,
     "acc": 39.9
    },
    "nova": {
     "n": 745,
     "acc": 49.8
    },
    "flow": {
     "n": 274,
     "acc": 70.8
    }
   },
   "graded": 2441
  },
  "전자·부품": {
   "weights": {
    "taro": 0.31,
    "diana": 0.1526,
    "nova": 0.2529,
    "flow": 0.2846
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 77.7
    },
    "diana": {
     "n": 260,
     "acc": 36.9
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
   "graded": 1157
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2585,
    "diana": 0.2258,
    "nova": 0.2605,
    "flow": 0.2552
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 54.7
    },
    "diana": {
     "n": 335,
     "acc": 47.8
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
   "graded": 1065
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3306,
    "diana": 0.1587,
    "nova": 0.3424,
    "flow": 0.1683
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 62.5
    },
    "diana": {
     "n": 314,
     "acc": 29.3
    },
    "nova": {
     "n": 224,
     "acc": 64.7
    },
    "flow": {
     "n": 66,
     "acc": 31.8
    }
   },
   "graded": 884
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
    "taro": 0.2308,
    "diana": 0.2254,
    "nova": 0.2657,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 50.3
    },
    "diana": {
     "n": 291,
     "acc": 49.1
    },
    "nova": {
     "n": 259,
     "acc": 57.9
    },
    "flow": {
     "n": 33,
     "acc": 60.6
    }
   },
   "graded": 895
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3273,
    "diana": 0.1647,
    "nova": 0.3111,
    "flow": 0.1968
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 59.6
    },
    "diana": {
     "n": 456,
     "acc": 24.8
    },
    "nova": {
     "n": 293,
     "acc": 56.7
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1275
  },
  "2차전지": {
   "weights": {
    "taro": 0.3047,
    "diana": 0.1965,
    "nova": 0.2957,
    "flow": 0.2031
   },
   "acc": {
    "taro": {
     "n": 382,
     "acc": 83.0
    },
    "diana": {
     "n": 244,
     "acc": 48.4
    },
    "nova": {
     "n": 316,
     "acc": 72.8
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
    "taro": 0.2637,
    "diana": 0.2377,
    "nova": 0.2734,
    "flow": 0.2251
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 53.2
    },
    "diana": {
     "n": 125,
     "acc": 48.0
    },
    "nova": {
     "n": 96,
     "acc": 55.2
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 393
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.2211,
    "nova": 0.2582,
    "flow": 0.2435
   },
   "acc": {
    "taro": {
     "n": 895,
     "acc": 66.6
    },
    "diana": {
     "n": 776,
     "acc": 53.1
    },
    "nova": {
     "n": 750,
     "acc": 62.0
    },
    "flow": {
     "n": 118,
     "acc": 58.5
    }
   },
   "graded": 2539
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.2132,
    "nova": 0.3246,
    "flow": 0.158
   },
   "acc": {
    "taro": {
     "n": 407,
     "acc": 57.7
    },
    "diana": {
     "n": 462,
     "acc": 40.5
    },
    "nova": {
     "n": 336,
     "acc": 61.6
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1241
  },
  "조선": {
   "weights": {
    "taro": 0.2826,
    "diana": 0.1793,
    "nova": 0.2798,
    "flow": 0.2583
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 54.7
    },
    "diana": {
     "n": 245,
     "acc": 34.7
    },
    "nova": {
     "n": 205,
     "acc": 54.1
    },
    "flow": {
     "n": 32,
     "acc": 50.0
    }
   },
   "graded": 716
  },
  "방산": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.1585,
    "nova": 0.2878,
    "flow": 0.2604
   },
   "acc": {
    "taro": {
     "n": 103,
     "acc": 56.3
    },
    "diana": {
     "n": 46,
     "acc": 30.4
    },
    "nova": {
     "n": 76,
     "acc": 55.3
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 226
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2996,
    "diana": 0.1692,
    "nova": 0.2928,
    "flow": 0.2384
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 62.8
    },
    "diana": {
     "n": 155,
     "acc": 35.5
    },
    "nova": {
     "n": 127,
     "acc": 61.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 430
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2701,
    "diana": 0.166,
    "nova": 0.2582,
    "flow": 0.3056
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 66.3
    },
    "diana": {
     "n": 540,
     "acc": 40.7
    },
    "nova": {
     "n": 434,
     "acc": 63.4
    },
    "flow": {
     "n": 72,
     "acc": 77.8
    }
   },
   "graded": 1562
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2582,
    "diana": 0.2561,
    "nova": 0.2327,
    "flow": 0.253
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 48.4
    },
    "diana": {
     "n": 102,
     "acc": 48.0
    },
    "nova": {
     "n": 55,
     "acc": 43.6
    },
    "flow": {
     "n": 59,
     "acc": 47.5
    }
   },
   "graded": 311
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2768,
    "diana": 0.1831,
    "nova": 0.2859,
    "flow": 0.2543
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 54.4
    },
    "diana": {
     "n": 325,
     "acc": 36.0
    },
    "nova": {
     "n": 217,
     "acc": 56.2
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 863
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
    "taro": 0.3233,
    "diana": 0.1619,
    "nova": 0.3324,
    "flow": 0.1824
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 59.9
    },
    "diana": {
     "n": 193,
     "acc": 29.0
    },
    "nova": {
     "n": 164,
     "acc": 61.6
    },
    "flow": {
     "n": 71,
     "acc": 33.8
    }
   },
   "graded": 640
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2435,
    "diana": 0.1822,
    "nova": 0.3011,
    "flow": 0.2733
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 44.6
    },
    "diana": {
     "n": 258,
     "acc": 33.3
    },
    "nova": {
     "n": 167,
     "acc": 55.1
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 628
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
    "taro": 0.2618,
    "diana": 0.272,
    "nova": 0.268,
    "flow": 0.1982
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 68.0
    },
    "diana": {
     "n": 140,
     "acc": 70.7
    },
    "nova": {
     "n": 145,
     "acc": 69.7
    },
    "flow": {
     "n": 33,
     "acc": 51.5
    }
   },
   "graded": 487
  },
  "식음료": {
   "weights": {
    "taro": 0.1903,
    "diana": 0.2957,
    "nova": 0.2284,
    "flow": 0.2855
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 33.3
    },
    "diana": {
     "n": 224,
     "acc": 51.8
    },
    "nova": {
     "n": 115,
     "acc": 40.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 498
  },
  "여행레저": {
   "weights": {
    "taro": 0.3594,
    "diana": 0.1635,
    "nova": 0.3136,
    "flow": 0.1635
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 65.9
    },
    "diana": {
     "n": 76,
     "acc": 22.4
    },
    "nova": {
     "n": 73,
     "acc": 57.5
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 271
  }
 }
};
