// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 13:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.287,
   "diana": 0.1796,
   "nova": 0.2814,
   "flow": 0.252
  },
  "acc": {
   "taro": {
    "n": 4136,
    "acc": 63.2
   },
   "diana": {
    "n": 3732,
    "acc": 39.6
   },
   "nova": {
    "n": 2796,
    "acc": 62.0
   },
   "flow": {
    "n": 733,
    "acc": 55.5
   }
  },
  "graded": 11397
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
    "taro": 0.3081,
    "diana": 0.1496,
    "nova": 0.2753,
    "flow": 0.267
   },
   "acc": {
    "taro": {
     "n": 241,
     "acc": 77.6
    },
    "diana": {
     "n": 151,
     "acc": 36.4
    },
    "nova": {
     "n": 182,
     "acc": 67.0
    },
    "flow": {
     "n": 80,
     "acc": 65.0
    }
   },
   "graded": 654
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2519,
    "diana": 0.1913,
    "nova": 0.2408,
    "flow": 0.316
   },
   "acc": {
    "taro": {
     "n": 189,
     "acc": 59.8
    },
    "diana": {
     "n": 185,
     "acc": 45.4
    },
    "nova": {
     "n": 140,
     "acc": 57.1
    },
    "flow": {
     "n": 30,
     "acc": 86.7
    }
   },
   "graded": 544
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3353,
    "diana": 0.1482,
    "nova": 0.3217,
    "flow": 0.1947
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 70.5
    },
    "diana": {
     "n": 183,
     "acc": 31.1
    },
    "nova": {
     "n": 108,
     "acc": 67.6
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
    "taro": 0.2574,
    "diana": 0.2279,
    "nova": 0.2828,
    "flow": 0.2319
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 55.5
    },
    "diana": {
     "n": 173,
     "acc": 49.1
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
   "graded": 496
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3014,
    "diana": 0.1686,
    "nova": 0.2955,
    "flow": 0.2345
   },
   "acc": {
    "taro": {
     "n": 227,
     "acc": 57.3
    },
    "diana": {
     "n": 256,
     "acc": 32.0
    },
    "nova": {
     "n": 130,
     "acc": 56.2
    },
    "flow": {
     "n": 92,
     "acc": 44.6
    }
   },
   "graded": 705
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
     "acc": 84.6
    },
    "diana": {
     "n": 141,
     "acc": 50.4
    },
    "nova": {
     "n": 166,
     "acc": 82.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 528
  },
  "보험": {
   "weights": {
    "taro": 0.2625,
    "diana": 0.2533,
    "nova": 0.248,
    "flow": 0.2362
   },
   "acc": {
    "taro": {
     "n": 81,
     "acc": 55.6
    },
    "diana": {
     "n": 69,
     "acc": 53.6
    },
    "nova": {
     "n": 40,
     "acc": 52.5
    },
    "flow": {
     "n": 20,
     "acc": 60.0
    }
   },
   "graded": 210
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2844,
    "diana": 0.2203,
    "nova": 0.3013,
    "flow": 0.194
   },
   "acc": {
    "taro": {
     "n": 524,
     "acc": 68.1
    },
    "diana": {
     "n": 466,
     "acc": 52.8
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
   "graded": 1435
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2942,
    "diana": 0.193,
    "nova": 0.2813,
    "flow": 0.2316
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 63.5
    },
    "diana": {
     "n": 264,
     "acc": 41.7
    },
    "nova": {
     "n": 163,
     "acc": 60.7
    },
    "flow": {
     "n": 21,
     "acc": 42.9
    }
   },
   "graded": 692
  },
  "조선": {
   "weights": {
    "taro": 0.3223,
    "diana": 0.145,
    "nova": 0.291,
    "flow": 0.2417
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 66.7
    },
    "diana": {
     "n": 141,
     "acc": 27.0
    },
    "nova": {
     "n": 103,
     "acc": 60.2
    },
    "flow": {
     "n": 11,
     "acc": 63.6
    }
   },
   "graded": 396
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
     "n": 99,
     "acc": 78.8
    },
    "diana": {
     "n": 91,
     "acc": 22.0
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
   "graded": 254
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1685,
    "nova": 0.2578,
    "flow": 0.2942
   },
   "acc": {
    "taro": {
     "n": 306,
     "acc": 71.2
    },
    "diana": {
     "n": 312,
     "acc": 42.9
    },
    "nova": {
     "n": 210,
     "acc": 65.7
    },
    "flow": {
     "n": 44,
     "acc": 84.1
    }
   },
   "graded": 872
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.1786,
    "nova": 0.2811,
    "flow": 0.2678
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 50.9
    },
    "diana": {
     "n": 192,
     "acc": 33.3
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
   "graded": 477
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
    "taro": 0.3314,
    "diana": 0.1491,
    "nova": 0.3461,
    "flow": 0.1734
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 66.7
    },
    "diana": {
     "n": 113,
     "acc": 23.0
    },
    "nova": {
     "n": 79,
     "acc": 69.6
    },
    "flow": {
     "n": 43,
     "acc": 34.9
    }
   },
   "graded": 364
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2407,
    "diana": 0.147,
    "nova": 0.3674,
    "flow": 0.245
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 49.1
    },
    "diana": {
     "n": 158,
     "acc": 20.9
    },
    "nova": {
     "n": 77,
     "acc": 75.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 349
  },
  "로봇": {
   "weights": {
    "taro": 0.2733,
    "diana": 0.2711,
    "nova": 0.2733,
    "flow": 0.1822
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 76.5
    },
    "diana": {
     "n": 82,
     "acc": 74.4
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
   "graded": 272
  },
  "식음료": {
   "weights": {
    "taro": 0.1875,
    "diana": 0.1875,
    "nova": 0.3125,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 24.8
    },
    "diana": {
     "n": 128,
     "acc": 29.7
    },
    "nova": {
     "n": 38,
     "acc": 50.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 267
  }
 }
};
