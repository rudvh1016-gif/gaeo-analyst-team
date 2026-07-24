// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 11:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2791,
   "diana": 0.1919,
   "nova": 0.2784,
   "flow": 0.2506
  },
  "acc": {
   "taro": {
    "n": 4844,
    "acc": 61.7
   },
   "diana": {
    "n": 4365,
    "acc": 42.4
   },
   "nova": {
    "n": 3377,
    "acc": 61.6
   },
   "flow": {
    "n": 868,
    "acc": 55.4
   }
  },
  "graded": 13454
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.1947,
    "nova": 0.2335,
    "flow": 0.2991
   },
   "acc": {
    "taro": {
     "n": 576,
     "acc": 61.1
    },
    "diana": {
     "n": 376,
     "acc": 43.6
    },
    "nova": {
     "n": 472,
     "acc": 52.3
    },
    "flow": {
     "n": 191,
     "acc": 67.0
    }
   },
   "graded": 1615
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.1557,
    "nova": 0.2774,
    "flow": 0.263
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 75.4
    },
    "diana": {
     "n": 177,
     "acc": 38.4
    },
    "nova": {
     "n": 222,
     "acc": 68.5
    },
    "flow": {
     "n": 94,
     "acc": 64.9
    }
   },
   "graded": 777
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.237,
    "diana": 0.2201,
    "nova": 0.2157,
    "flow": 0.3272
   },
   "acc": {
    "taro": {
     "n": 232,
     "acc": 54.3
    },
    "diana": {
     "n": 226,
     "acc": 50.4
    },
    "nova": {
     "n": 180,
     "acc": 49.4
    },
    "flow": {
     "n": 37,
     "acc": 75.7
    }
   },
   "graded": 675
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3386,
    "diana": 0.1616,
    "nova": 0.321,
    "flow": 0.1788
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 66.8
    },
    "diana": {
     "n": 210,
     "acc": 31.9
    },
    "nova": {
     "n": 131,
     "acc": 63.4
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 594
  },
  "통신": {
   "weights": {
    "taro": 0.2917,
    "diana": 0.1858,
    "nova": 0.2903,
    "flow": 0.2322
   },
   "acc": {
    "taro": {
     "n": 86,
     "acc": 62.8
    },
    "diana": {
     "n": 60,
     "acc": 40.0
    },
    "nova": {
     "n": 64,
     "acc": 62.5
    },
    "flow": {
     "n": 24,
     "acc": 70.8
    }
   },
   "graded": 234
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2548,
    "diana": 0.2451,
    "nova": 0.2686,
    "flow": 0.2315
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 55.0
    },
    "diana": {
     "n": 204,
     "acc": 52.9
    },
    "nova": {
     "n": 150,
     "acc": 58.0
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 583
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.1636,
    "nova": 0.3246,
    "flow": 0.2113
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 55.1
    },
    "diana": {
     "n": 305,
     "acc": 29.2
    },
    "nova": {
     "n": 163,
     "acc": 59.5
    },
    "flow": {
     "n": 111,
     "acc": 38.7
    }
   },
   "graded": 853
  },
  "2차전지": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1942,
    "nova": 0.3022,
    "flow": 0.2015
   },
   "acc": {
    "taro": {
     "n": 259,
     "acc": 81.9
    },
    "diana": {
     "n": 166,
     "acc": 48.2
    },
    "nova": {
     "n": 200,
     "acc": 82.5
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 626
  },
  "보험": {
   "weights": {
    "taro": 0.2599,
    "diana": 0.2531,
    "nova": 0.2537,
    "flow": 0.2334
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 55.7
    },
    "diana": {
     "n": 83,
     "acc": 54.2
    },
    "nova": {
     "n": 46,
     "acc": 54.3
    },
    "flow": {
     "n": 24,
     "acc": 58.3
    }
   },
   "graded": 250
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.2229,
    "nova": 0.293,
    "flow": 0.2113
   },
   "acc": {
    "taro": {
     "n": 607,
     "acc": 66.9
    },
    "diana": {
     "n": 529,
     "acc": 54.6
    },
    "nova": {
     "n": 440,
     "acc": 71.8
    },
    "flow": {
     "n": 83,
     "acc": 51.8
    }
   },
   "graded": 1659
  },
  "지주·상사": {
   "weights": {
    "taro": 0.285,
    "diana": 0.2131,
    "nova": 0.2696,
    "flow": 0.2323
   },
   "acc": {
    "taro": {
     "n": 282,
     "acc": 61.3
    },
    "diana": {
     "n": 314,
     "acc": 45.9
    },
    "nova": {
     "n": 193,
     "acc": 58.0
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 815
  },
  "조선": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.2022,
    "nova": 0.2591,
    "flow": 0.255
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 55.6
    },
    "diana": {
     "n": 169,
     "acc": 39.6
    },
    "nova": {
     "n": 124,
     "acc": 50.8
    },
    "flow": {
     "n": 13,
     "acc": 53.8
    }
   },
   "graded": 475
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3191,
    "diana": 0.1545,
    "nova": 0.2968,
    "flow": 0.2296
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 69.5
    },
    "diana": {
     "n": 110,
     "acc": 33.6
    },
    "nova": {
     "n": 82,
     "acc": 64.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 310
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2744,
    "diana": 0.1785,
    "nova": 0.2567,
    "flow": 0.2904
   },
   "acc": {
    "taro": {
     "n": 350,
     "acc": 70.9
    },
    "diana": {
     "n": 358,
     "acc": 46.1
    },
    "nova": {
     "n": 255,
     "acc": 66.3
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1015
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2663,
    "diana": 0.2718,
    "nova": 0.2452,
    "flow": 0.2167
   },
   "acc": {
    "taro": {
     "n": 70,
     "acc": 54.3
    },
    "diana": {
     "n": 74,
     "acc": 55.4
    },
    "nova": {
     "n": 28,
     "acc": 21.4
    },
    "flow": {
     "n": 43,
     "acc": 44.2
    }
   },
   "graded": 215
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2717,
    "diana": 0.1804,
    "nova": 0.29,
    "flow": 0.258
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 52.7
    },
    "diana": {
     "n": 226,
     "acc": 35.0
    },
    "nova": {
     "n": 121,
     "acc": 56.2
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 567
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2356,
    "diana": 0.198,
    "nova": 0.266,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 39.2
    },
    "diana": {
     "n": 88,
     "acc": 33.0
    },
    "nova": {
     "n": 61,
     "acc": 44.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 274
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3037,
    "diana": 0.1601,
    "nova": 0.3044,
    "flow": 0.2318
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 60.3
    },
    "diana": {
     "n": 129,
     "acc": 31.8
    },
    "nova": {
     "n": 96,
     "acc": 60.4
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 421
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2491,
    "diana": 0.1461,
    "nova": 0.3612,
    "flow": 0.2435
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 51.1
    },
    "diana": {
     "n": 175,
     "acc": 20.0
    },
    "nova": {
     "n": 89,
     "acc": 74.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 395
  },
  "로봇": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.2655,
    "nova": 0.2742,
    "flow": 0.1882
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 72.3
    },
    "diana": {
     "n": 95,
     "acc": 70.5
    },
    "nova": {
     "n": 92,
     "acc": 72.8
    },
    "flow": {
     "n": 12,
     "acc": 25.0
    }
   },
   "graded": 318
  },
  "식음료": {
   "weights": {
    "taro": 0.1974,
    "diana": 0.2378,
    "nova": 0.2636,
    "flow": 0.3012
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 32.8
    },
    "diana": {
     "n": 152,
     "acc": 39.5
    },
    "nova": {
     "n": 48,
     "acc": 43.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 316
  }
 }
};
