// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 15:29",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2849,
   "diana": 0.1822,
   "nova": 0.2814,
   "flow": 0.2515
  },
  "acc": {
   "taro": {
    "n": 4129,
    "acc": 62.6
   },
   "diana": {
    "n": 3733,
    "acc": 40.0
   },
   "nova": {
    "n": 2797,
    "acc": 61.8
   },
   "flow": {
    "n": 735,
    "acc": 55.2
   }
  },
  "graded": 11394
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.205,
    "nova": 0.2077,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 494,
     "acc": 57.5
    },
    "diana": {
     "n": 320,
     "acc": 42.5
    },
    "nova": {
     "n": 388,
     "acc": 43.0
    },
    "flow": {
     "n": 165,
     "acc": 64.2
    }
   },
   "graded": 1367
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3093,
    "diana": 0.1512,
    "nova": 0.2765,
    "flow": 0.2629
   },
   "acc": {
    "taro": {
     "n": 239,
     "acc": 77.0
    },
    "diana": {
     "n": 150,
     "acc": 36.7
    },
    "nova": {
     "n": 182,
     "acc": 67.0
    },
    "flow": {
     "n": 80,
     "acc": 63.7
    }
   },
   "graded": 651
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2487,
    "diana": 0.1928,
    "nova": 0.2403,
    "flow": 0.3182
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 58.6
    },
    "diana": {
     "n": 187,
     "acc": 45.5
    },
    "nova": {
     "n": 143,
     "acc": 56.6
    },
    "flow": {
     "n": 31,
     "acc": 83.9
    }
   },
   "graded": 552
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3322,
    "diana": 0.1536,
    "nova": 0.3192,
    "flow": 0.195
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 69.7
    },
    "diana": {
     "n": 183,
     "acc": 32.2
    },
    "nova": {
     "n": 109,
     "acc": 67.0
    },
    "flow": {
     "n": 44,
     "acc": 40.9
    }
   },
   "graded": 511
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2541,
    "diana": 0.2298,
    "nova": 0.2835,
    "flow": 0.2325
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 54.6
    },
    "diana": {
     "n": 174,
     "acc": 49.4
    },
    "nova": {
     "n": 123,
     "acc": 61.0
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 498
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3001,
    "diana": 0.1706,
    "nova": 0.2955,
    "flow": 0.2338
   },
   "acc": {
    "taro": {
     "n": 228,
     "acc": 56.6
    },
    "diana": {
     "n": 258,
     "acc": 32.2
    },
    "nova": {
     "n": 131,
     "acc": 55.7
    },
    "flow": {
     "n": 93,
     "acc": 44.1
    }
   },
   "graded": 710
  },
  "2차전지": {
   "weights": {
    "taro": 0.2996,
    "diana": 0.2011,
    "nova": 0.2996,
    "flow": 0.1997
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 82.8
    },
    "diana": {
     "n": 141,
     "acc": 50.4
    },
    "nova": {
     "n": 165,
     "acc": 83.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 527
  },
  "보험": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.253,
    "nova": 0.2451,
    "flow": 0.2393
   },
   "acc": {
    "taro": {
     "n": 82,
     "acc": 54.9
    },
    "diana": {
     "n": 70,
     "acc": 52.9
    },
    "nova": {
     "n": 41,
     "acc": 51.2
    },
    "flow": {
     "n": 20,
     "acc": 60.0
    }
   },
   "graded": 213
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.2232,
    "nova": 0.3014,
    "flow": 0.1941
   },
   "acc": {
    "taro": {
     "n": 521,
     "acc": 67.4
    },
    "diana": {
     "n": 462,
     "acc": 53.5
    },
    "nova": {
     "n": 374,
     "acc": 72.2
    },
    "flow": {
     "n": 71,
     "acc": 46.5
    }
   },
   "graded": 1428
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2925,
    "diana": 0.1963,
    "nova": 0.2799,
    "flow": 0.2313
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 63.2
    },
    "diana": {
     "n": 264,
     "acc": 42.4
    },
    "nova": {
     "n": 162,
     "acc": 60.5
    },
    "flow": {
     "n": 21,
     "acc": 42.9
    }
   },
   "graded": 689
  },
  "조선": {
   "weights": {
    "taro": 0.3206,
    "diana": 0.1458,
    "nova": 0.2906,
    "flow": 0.243
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 66.0
    },
    "diana": {
     "n": 141,
     "acc": 27.7
    },
    "nova": {
     "n": 102,
     "acc": 59.8
    },
    "flow": {
     "n": 11,
     "acc": 63.6
    }
   },
   "graded": 395
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3261,
    "diana": 0.1304,
    "nova": 0.3261,
    "flow": 0.2174
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 78.0
    },
    "diana": {
     "n": 92,
     "acc": 22.8
    },
    "nova": {
     "n": 64,
     "acc": 76.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 256
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2771,
    "diana": 0.1689,
    "nova": 0.2584,
    "flow": 0.2956
   },
   "acc": {
    "taro": {
     "n": 303,
     "acc": 70.3
    },
    "diana": {
     "n": 308,
     "acc": 42.9
    },
    "nova": {
     "n": 209,
     "acc": 65.6
    },
    "flow": {
     "n": 44,
     "acc": 81.8
    }
   },
   "graded": 864
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.272,
    "diana": 0.1801,
    "nova": 0.2806,
    "flow": 0.2673
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 50.9
    },
    "diana": {
     "n": 193,
     "acc": 33.7
    },
    "nova": {
     "n": 101,
     "acc": 52.5
    },
    "flow": {
     "n": 11,
     "acc": 81.8
    }
   },
   "graded": 478
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2367,
    "diana": 0.2071,
    "nova": 0.2575,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 39.6
    },
    "diana": {
     "n": 75,
     "acc": 34.7
    },
    "nova": {
     "n": 58,
     "acc": 43.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 239
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3272,
    "diana": 0.1496,
    "nova": 0.3452,
    "flow": 0.1781
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 65.6
    },
    "diana": {
     "n": 113,
     "acc": 23.9
    },
    "nova": {
     "n": 78,
     "acc": 69.2
    },
    "flow": {
     "n": 42,
     "acc": 35.7
    }
   },
   "graded": 361
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2343,
    "diana": 0.1485,
    "nova": 0.3697,
    "flow": 0.2475
   },
   "acc": {
    "taro": {
     "n": 112,
     "acc": 47.3
    },
    "diana": {
     "n": 156,
     "acc": 21.8
    },
    "nova": {
     "n": 75,
     "acc": 74.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 343
  },
  "로봇": {
   "weights": {
    "taro": 0.2742,
    "diana": 0.2687,
    "nova": 0.2742,
    "flow": 0.1828
   },
   "acc": {
    "taro": {
     "n": 103,
     "acc": 75.7
    },
    "diana": {
     "n": 83,
     "acc": 73.5
    },
    "nova": {
     "n": 78,
     "acc": 75.6
    },
    "flow": {
     "n": 10,
     "acc": 30.0
    }
   },
   "graded": 274
  },
  "식음료": {
   "weights": {
    "taro": 0.1881,
    "diana": 0.1929,
    "nova": 0.3055,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 25.0
    },
    "diana": {
     "n": 130,
     "acc": 30.8
    },
    "nova": {
     "n": 39,
     "acc": 48.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 269
  }
 }
};
