// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 11:12",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2717,
   "diana": 0.2062,
   "nova": 0.2649,
   "flow": 0.2571
  },
  "acc": {
   "taro": {
    "n": 5592,
    "acc": 59.5
   },
   "diana": {
    "n": 5050,
    "acc": 45.1
   },
   "nova": {
    "n": 4205,
    "acc": 58.0
   },
   "flow": {
    "n": 977,
    "acc": 56.3
   }
  },
  "graded": 15824
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2692,
    "diana": 0.1888,
    "nova": 0.2452,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 665,
     "acc": 62.1
    },
    "diana": {
     "n": 434,
     "acc": 43.5
    },
    "nova": {
     "n": 571,
     "acc": 56.6
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1895
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2954,
    "diana": 0.1648,
    "nova": 0.2704,
    "flow": 0.2694
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 73.1
    },
    "diana": {
     "n": 206,
     "acc": 40.8
    },
    "nova": {
     "n": 269,
     "acc": 66.9
    },
    "flow": {
     "n": 102,
     "acc": 66.7
    }
   },
   "graded": 904
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2396,
    "diana": 0.2308,
    "nova": 0.2158,
    "flow": 0.3137
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 53.3
    },
    "diana": {
     "n": 263,
     "acc": 51.3
    },
    "nova": {
     "n": 225,
     "acc": 48.0
    },
    "flow": {
     "n": 43,
     "acc": 69.8
    }
   },
   "graded": 805
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3296,
    "diana": 0.1813,
    "nova": 0.3112,
    "flow": 0.178
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 62.9
    },
    "diana": {
     "n": 240,
     "acc": 34.6
    },
    "nova": {
     "n": 160,
     "acc": 59.4
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 682
  },
  "통신": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.2106,
    "nova": 0.2709,
    "flow": 0.2378
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 59.0
    },
    "diana": {
     "n": 70,
     "acc": 44.3
    },
    "nova": {
     "n": 79,
     "acc": 57.0
    },
    "flow": {
     "n": 27,
     "acc": 66.7
    }
   },
   "graded": 276
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2491,
    "diana": 0.2626,
    "nova": 0.2499,
    "flow": 0.2384
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 52.2
    },
    "diana": {
     "n": 236,
     "acc": 55.1
    },
    "nova": {
     "n": 187,
     "acc": 52.4
    },
    "flow": {
     "n": 25,
     "acc": 60.0
    }
   },
   "graded": 693
  },
  "금융·증권": {
   "weights": {
    "taro": 0.304,
    "diana": 0.1658,
    "nova": 0.3287,
    "flow": 0.2015
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 55.9
    },
    "diana": {
     "n": 354,
     "acc": 30.5
    },
    "nova": {
     "n": 210,
     "acc": 60.5
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 1000
  },
  "2차전지": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1975,
    "nova": 0.3009,
    "flow": 0.2006
   },
   "acc": {
    "taro": {
     "n": 300,
     "acc": 79.3
    },
    "diana": {
     "n": 193,
     "acc": 49.2
    },
    "nova": {
     "n": 243,
     "acc": 79.8
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 738
  },
  "보험": {
   "weights": {
    "taro": 0.2595,
    "diana": 0.2852,
    "nova": 0.2217,
    "flow": 0.2336
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 55.6
    },
    "diana": {
     "n": 95,
     "acc": 61.1
    },
    "nova": {
     "n": 59,
     "acc": 47.5
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 289
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2651,
    "diana": 0.2287,
    "nova": 0.2762,
    "flow": 0.23
   },
   "acc": {
    "taro": {
     "n": 713,
     "acc": 63.5
    },
    "diana": {
     "n": 615,
     "acc": 54.8
    },
    "nova": {
     "n": 553,
     "acc": 66.2
    },
    "flow": {
     "n": 98,
     "acc": 55.1
    }
   },
   "graded": 1979
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.2271,
    "nova": 0.2577,
    "flow": 0.239
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 57.8
    },
    "diana": {
     "n": 364,
     "acc": 47.5
    },
    "nova": {
     "n": 243,
     "acc": 53.9
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 963
  },
  "조선": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.2338,
    "nova": 0.2324,
    "flow": 0.2641
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 51.1
    },
    "diana": {
     "n": 192,
     "acc": 44.3
    },
    "nova": {
     "n": 150,
     "acc": 44.0
    },
    "flow": {
     "n": 16,
     "acc": 50.0
    }
   },
   "graded": 548
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1939,
    "nova": 0.2655,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 63.4
    },
    "diana": {
     "n": 123,
     "acc": 40.7
    },
    "nova": {
     "n": 97,
     "acc": 55.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 351
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2667,
    "diana": 0.1878,
    "nova": 0.2472,
    "flow": 0.2982
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 67.1
    },
    "diana": {
     "n": 415,
     "acc": 47.2
    },
    "nova": {
     "n": 312,
     "acc": 62.2
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1189
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2844,
    "diana": 0.2994,
    "nova": 0.1582,
    "flow": 0.258
   },
   "acc": {
    "taro": {
     "n": 76,
     "acc": 53.9
    },
    "diana": {
     "n": 81,
     "acc": 56.8
    },
    "nova": {
     "n": 35,
     "acc": 22.9
    },
    "flow": {
     "n": 47,
     "acc": 48.9
    }
   },
   "graded": 239
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2705,
    "diana": 0.1981,
    "nova": 0.2759,
    "flow": 0.2555
   },
   "acc": {
    "taro": {
     "n": 238,
     "acc": 52.9
    },
    "diana": {
     "n": 258,
     "acc": 38.8
    },
    "nova": {
     "n": 150,
     "acc": 54.0
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 661
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2397,
    "diana": 0.2286,
    "nova": 0.2433,
    "flow": 0.2884
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 41.5
    },
    "diana": {
     "n": 106,
     "acc": 39.6
    },
    "nova": {
     "n": 83,
     "acc": 42.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 331
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2937,
    "diana": 0.1943,
    "nova": 0.2786,
    "flow": 0.2334
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 58.1
    },
    "diana": {
     "n": 151,
     "acc": 38.4
    },
    "nova": {
     "n": 118,
     "acc": 55.1
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 488
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2358,
    "diana": 0.1798,
    "nova": 0.3025,
    "flow": 0.2819
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 41.8
    },
    "diana": {
     "n": 207,
     "acc": 31.9
    },
    "nova": {
     "n": 123,
     "acc": 53.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 495
  },
  "로봇": {
   "weights": {
    "taro": 0.2653,
    "diana": 0.2675,
    "nova": 0.2675,
    "flow": 0.1997
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 66.4
    },
    "diana": {
     "n": 109,
     "acc": 67.0
    },
    "nova": {
     "n": 112,
     "acc": 67.0
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 370
  },
  "식음료": {
   "weights": {
    "taro": 0.194,
    "diana": 0.3035,
    "nova": 0.1884,
    "flow": 0.314
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 30.9
    },
    "diana": {
     "n": 180,
     "acc": 48.3
    },
    "nova": {
     "n": 74,
     "acc": 29.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 377
  },
  "여행레저": {
   "weights": {
    "taro": 0.3019,
    "diana": 0.1558,
    "nova": 0.2825,
    "flow": 0.2597
   },
   "acc": {
    "taro": {
     "n": 74,
     "acc": 58.1
    },
    "diana": {
     "n": 62,
     "acc": 24.2
    },
    "nova": {
     "n": 57,
     "acc": 54.4
    },
    "flow": {
     "n": 27,
     "acc": 25.9
    }
   },
   "graded": 220
  }
 }
};
