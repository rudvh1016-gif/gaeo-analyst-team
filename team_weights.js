// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 11:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2848,
   "diana": 0.1903,
   "nova": 0.2686,
   "flow": 0.2563
  },
  "acc": {
   "taro": {
    "n": 7062,
    "acc": 61.7
   },
   "diana": {
    "n": 6424,
    "acc": 41.2
   },
   "nova": {
    "n": 5735,
    "acc": 58.2
   },
   "flow": {
    "n": 1230,
    "acc": 55.5
   }
  },
  "graded": 20451,
  "team": {
   "hit": 5592,
   "miss": 1360,
   "n": 6952,
   "acc": 80.4
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2996,
    "diana": 0.173,
    "nova": 0.2183,
    "flow": 0.3091
   },
   "acc": {
    "taro": {
     "n": 860,
     "acc": 68.7
    },
    "diana": {
     "n": 562,
     "acc": 39.7
    },
    "nova": {
     "n": 745,
     "acc": 50.1
    },
    "flow": {
     "n": 275,
     "acc": 70.9
    }
   },
   "graded": 2442
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
     "n": 422,
     "acc": 77.5
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
   "graded": 1156
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
    "taro": 0.3289,
    "diana": 0.1591,
    "nova": 0.3433,
    "flow": 0.1687
   },
   "acc": {
    "taro": {
     "n": 279,
     "acc": 62.0
    },
    "diana": {
     "n": 312,
     "acc": 29.8
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
   "graded": 881
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
    "taro": 0.2319,
    "diana": 0.2311,
    "nova": 0.2692,
    "flow": 0.2679
   },
   "acc": {
    "taro": {
     "n": 313,
     "acc": 49.8
    },
    "diana": {
     "n": 294,
     "acc": 49.7
    },
    "nova": {
     "n": 261,
     "acc": 57.9
    },
    "flow": {
     "n": 33,
     "acc": 57.6
    }
   },
   "graded": 901
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3256,
    "diana": 0.1654,
    "nova": 0.3115,
    "flow": 0.1975
   },
   "acc": {
    "taro": {
     "n": 403,
     "acc": 59.1
    },
    "diana": {
     "n": 454,
     "acc": 25.1
    },
    "nova": {
     "n": 292,
     "acc": 56.5
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1269
  },
  "2차전지": {
   "weights": {
    "taro": 0.3036,
    "diana": 0.1966,
    "nova": 0.2975,
    "flow": 0.2024
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 82.3
    },
    "diana": {
     "n": 245,
     "acc": 48.6
    },
    "nova": {
     "n": 317,
     "acc": 73.5
    },
    "flow": {
     "n": 3,
     "acc": 33.3
    }
   },
   "graded": 949
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
    "taro": 0.2776,
    "diana": 0.2223,
    "nova": 0.256,
    "flow": 0.2441
   },
   "acc": {
    "taro": {
     "n": 888,
     "acc": 66.1
    },
    "diana": {
     "n": 769,
     "acc": 52.9
    },
    "nova": {
     "n": 740,
     "acc": 60.9
    },
    "flow": {
     "n": 117,
     "acc": 58.1
    }
   },
   "graded": 2514
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3046,
    "diana": 0.2155,
    "nova": 0.322,
    "flow": 0.1579
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 57.9
    },
    "diana": {
     "n": 459,
     "acc": 41.0
    },
    "nova": {
     "n": 335,
     "acc": 61.2
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1236
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
    "taro": 0.2954,
    "diana": 0.1573,
    "nova": 0.2887,
    "flow": 0.2585
   },
   "acc": {
    "taro": {
     "n": 105,
     "acc": 57.1
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
   "graded": 229
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2991,
    "diana": 0.1738,
    "nova": 0.2882,
    "flow": 0.2389
   },
   "acc": {
    "taro": {
     "n": 147,
     "acc": 62.6
    },
    "diana": {
     "n": 154,
     "acc": 36.4
    },
    "nova": {
     "n": 126,
     "acc": 60.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 427
  },
  "화학·소재": {
   "weights": {
    "taro": 0.27,
    "diana": 0.1654,
    "nova": 0.2587,
    "flow": 0.3059
   },
   "acc": {
    "taro": {
     "n": 515,
     "acc": 66.2
    },
    "diana": {
     "n": 540,
     "acc": 40.6
    },
    "nova": {
     "n": 435,
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
    "taro": 0.2584,
    "diana": 0.2587,
    "nova": 0.2407,
    "flow": 0.2422
   },
   "acc": {
    "taro": {
     "n": 98,
     "acc": 49.0
    },
    "diana": {
     "n": 104,
     "acc": 49.0
    },
    "nova": {
     "n": 57,
     "acc": 45.6
    },
    "flow": {
     "n": 61,
     "acc": 45.9
    }
   },
   "graded": 320
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2785,
    "diana": 0.1847,
    "nova": 0.2827,
    "flow": 0.2542
   },
   "acc": {
    "taro": {
     "n": 303,
     "acc": 54.8
    },
    "diana": {
     "n": 322,
     "acc": 36.3
    },
    "nova": {
     "n": 214,
     "acc": 55.6
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 855
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
    "taro": 0.3241,
    "diana": 0.162,
    "nova": 0.3313,
    "flow": 0.1826
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 60.0
    },
    "diana": {
     "n": 192,
     "acc": 29.2
    },
    "nova": {
     "n": 163,
     "acc": 61.3
    },
    "flow": {
     "n": 71,
     "acc": 33.8
    }
   },
   "graded": 636
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2434,
    "diana": 0.1894,
    "nova": 0.2926,
    "flow": 0.2745
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 44.3
    },
    "diana": {
     "n": 258,
     "acc": 34.5
    },
    "nova": {
     "n": 167,
     "acc": 53.3
    },
    "flow": {
     "n": 0,
     "acc": null
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
    "taro": 0.2621,
    "diana": 0.272,
    "nova": 0.2857,
    "flow": 0.1803
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 66.1
    },
    "diana": {
     "n": 140,
     "acc": 68.6
    },
    "nova": {
     "n": 143,
     "acc": 72.0
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 484
  },
  "식음료": {
   "weights": {
    "taro": 0.195,
    "diana": 0.2981,
    "nova": 0.2215,
    "flow": 0.2854
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 34.2
    },
    "diana": {
     "n": 226,
     "acc": 52.2
    },
    "nova": {
     "n": 116,
     "acc": 38.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 503
  },
  "여행레저": {
   "weights": {
    "taro": 0.3605,
    "diana": 0.164,
    "nova": 0.3114,
    "flow": 0.164
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 65.9
    },
    "diana": {
     "n": 75,
     "acc": 22.7
    },
    "nova": {
     "n": 72,
     "acc": 56.9
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 269
  }
 }
};
