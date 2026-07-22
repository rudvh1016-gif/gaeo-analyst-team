// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 10:46",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2857,
   "diana": 0.1805,
   "nova": 0.2832,
   "flow": 0.2505
  },
  "acc": {
   "taro": {
    "n": 3760,
    "acc": 62.1
   },
   "diana": {
    "n": 3399,
    "acc": 39.2
   },
   "nova": {
    "n": 2637,
    "acc": 61.6
   },
   "flow": {
    "n": 659,
    "acc": 54.5
   }
  },
  "graded": 10455
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2703,
    "diana": 0.2098,
    "nova": 0.2275,
    "flow": 0.2925
   },
   "acc": {
    "taro": {
     "n": 445,
     "acc": 54.8
    },
    "diana": {
     "n": 289,
     "acc": 42.6
    },
    "nova": {
     "n": 351,
     "acc": 46.2
    },
    "flow": {
     "n": 150,
     "acc": 59.3
    }
   },
   "graded": 1235
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3094,
    "diana": 0.1505,
    "nova": 0.2766,
    "flow": 0.2635
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 75.9
    },
    "diana": {
     "n": 137,
     "acc": 36.5
    },
    "nova": {
     "n": 173,
     "acc": 67.1
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 598
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2808,
    "diana": 0.2109,
    "nova": 0.266,
    "flow": 0.2423
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 58.0
    },
    "diana": {
     "n": 170,
     "acc": 43.5
    },
    "nova": {
     "n": 133,
     "acc": 54.9
    },
    "flow": {
     "n": 27,
     "acc": 85.2
    }
   },
   "graded": 506
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3407,
    "diana": 0.1482,
    "nova": 0.3146,
    "flow": 0.1964
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 71.2
    },
    "diana": {
     "n": 168,
     "acc": 31.0
    },
    "nova": {
     "n": 105,
     "acc": 65.7
    },
    "flow": {
     "n": 39,
     "acc": 41.0
    }
   },
   "graded": 475
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2525,
    "diana": 0.2185,
    "nova": 0.2893,
    "flow": 0.2397
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 52.7
    },
    "diana": {
     "n": 158,
     "acc": 45.6
    },
    "nova": {
     "n": 116,
     "acc": 60.3
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 459
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1962,
    "nova": 0.2598,
    "flow": 0.2639
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 55.7
    },
    "diana": {
     "n": 236,
     "acc": 39.0
    },
    "nova": {
     "n": 124,
     "acc": 51.6
    },
    "flow": {
     "n": 82,
     "acc": 52.4
    }
   },
   "graded": 654
  },
  "2차전지": {
   "weights": {
    "taro": 0.2985,
    "diana": 0.2039,
    "nova": 0.2985,
    "flow": 0.199
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 82.4
    },
    "diana": {
     "n": 123,
     "acc": 51.2
    },
    "nova": {
     "n": 158,
     "acc": 81.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 480
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.2263,
    "nova": 0.3033,
    "flow": 0.1898
   },
   "acc": {
    "taro": {
     "n": 470,
     "acc": 65.7
    },
    "diana": {
     "n": 417,
     "acc": 53.0
    },
    "nova": {
     "n": 359,
     "acc": 71.0
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1309
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2956,
    "diana": 0.1909,
    "nova": 0.2767,
    "flow": 0.2367
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 62.4
    },
    "diana": {
     "n": 243,
     "acc": 40.3
    },
    "nova": {
     "n": 154,
     "acc": 58.4
    },
    "flow": {
     "n": 19,
     "acc": 47.4
    }
   },
   "graded": 637
  },
  "조선": {
   "weights": {
    "taro": 0.3428,
    "diana": 0.1404,
    "nova": 0.2827,
    "flow": 0.2341
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 73.2
    },
    "diana": {
     "n": 128,
     "acc": 20.3
    },
    "nova": {
     "n": 101,
     "acc": 60.4
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 366
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3283,
    "diana": 0.1313,
    "nova": 0.3215,
    "flow": 0.2189
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 81.3
    },
    "diana": {
     "n": 84,
     "acc": 19.0
    },
    "nova": {
     "n": 64,
     "acc": 73.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 239
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.1708,
    "nova": 0.2529,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 69.6
    },
    "diana": {
     "n": 280,
     "acc": 42.9
    },
    "nova": {
     "n": 197,
     "acc": 63.5
    },
    "flow": {
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 793
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2669,
    "diana": 0.175,
    "nova": 0.2893,
    "flow": 0.2687
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 49.7
    },
    "diana": {
     "n": 175,
     "acc": 32.6
    },
    "nova": {
     "n": 91,
     "acc": 53.8
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 431
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2411,
    "diana": 0.2203,
    "nova": 0.2462,
    "flow": 0.2924
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 41.2
    },
    "diana": {
     "n": 69,
     "acc": 37.7
    },
    "nova": {
     "n": 57,
     "acc": 42.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 223
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3428,
    "diana": 0.1511,
    "nova": 0.3551,
    "flow": 0.1511
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 68.1
    },
    "diana": {
     "n": 104,
     "acc": 18.3
    },
    "nova": {
     "n": 78,
     "acc": 70.5
    },
    "flow": {
     "n": 39,
     "acc": 28.2
    }
   },
   "graded": 340
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2312,
    "diana": 0.1488,
    "nova": 0.372,
    "flow": 0.248
   },
   "acc": {
    "taro": {
     "n": 103,
     "acc": 46.6
    },
    "diana": {
     "n": 146,
     "acc": 20.5
    },
    "nova": {
     "n": 69,
     "acc": 76.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 318
  },
  "로봇": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.2727,
    "nova": 0.2727,
    "flow": 0.1818
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 80.9
    },
    "diana": {
     "n": 76,
     "acc": 78.9
    },
    "nova": {
     "n": 77,
     "acc": 76.6
    },
    "flow": {
     "n": 9,
     "acc": 22.2
    }
   },
   "graded": 256
  },
  "식음료": {
   "weights": {
    "taro": 0.193,
    "diana": 0.193,
    "nova": 0.2924,
    "flow": 0.3216
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 23.4
    },
    "diana": {
     "n": 120,
     "acc": 28.3
    },
    "nova": {
     "n": 33,
     "acc": 45.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 247
  }
 }
};
