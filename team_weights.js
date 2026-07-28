// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 11:42",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2719,
   "diana": 0.2058,
   "nova": 0.2653,
   "flow": 0.2569
  },
  "acc": {
   "taro": {
    "n": 5595,
    "acc": 59.5
   },
   "diana": {
    "n": 5053,
    "acc": 45.1
   },
   "nova": {
    "n": 4207,
    "acc": 58.1
   },
   "flow": {
    "n": 976,
    "acc": 56.2
   }
  },
  "graded": 15831
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2695,
    "diana": 0.1884,
    "nova": 0.2451,
    "flow": 0.297
   },
   "acc": {
    "taro": {
     "n": 665,
     "acc": 62.1
    },
    "diana": {
     "n": 433,
     "acc": 43.4
    },
    "nova": {
     "n": 570,
     "acc": 56.5
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1893
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
    "taro": 0.2402,
    "diana": 0.2315,
    "nova": 0.2148,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 53.5
    },
    "diana": {
     "n": 264,
     "acc": 51.5
    },
    "nova": {
     "n": 226,
     "acc": 47.8
    },
    "flow": {
     "n": 43,
     "acc": 69.8
    }
   },
   "graded": 808
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3279,
    "diana": 0.1775,
    "nova": 0.3168,
    "flow": 0.1779
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 62.6
    },
    "diana": {
     "n": 242,
     "acc": 33.9
    },
    "nova": {
     "n": 162,
     "acc": 60.5
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 687
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
    "taro": 0.2498,
    "diana": 0.2613,
    "nova": 0.2508,
    "flow": 0.238
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 52.5
    },
    "diana": {
     "n": 235,
     "acc": 54.9
    },
    "nova": {
     "n": 186,
     "acc": 52.7
    },
    "flow": {
     "n": 25,
     "acc": 60.0
    }
   },
   "graded": 690
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
    "taro": 0.2658,
    "diana": 0.2288,
    "nova": 0.2768,
    "flow": 0.2286
   },
   "acc": {
    "taro": {
     "n": 713,
     "acc": 63.5
    },
    "diana": {
     "n": 616,
     "acc": 54.7
    },
    "nova": {
     "n": 553,
     "acc": 66.2
    },
    "flow": {
     "n": 97,
     "acc": 54.6
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
    "taro": 0.3029,
    "diana": 0.1919,
    "nova": 0.2671,
    "flow": 0.238
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 63.6
    },
    "diana": {
     "n": 124,
     "acc": 40.3
    },
    "nova": {
     "n": 98,
     "acc": 56.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 354
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2666,
    "diana": 0.189,
    "nova": 0.2459,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 67.0
    },
    "diana": {
     "n": 417,
     "acc": 47.5
    },
    "nova": {
     "n": 314,
     "acc": 61.8
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1195
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
    "taro": 0.2703,
    "diana": 0.1987,
    "nova": 0.2757,
    "flow": 0.2553
   },
   "acc": {
    "taro": {
     "n": 238,
     "acc": 52.9
    },
    "diana": {
     "n": 257,
     "acc": 38.9
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
   "graded": 660
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
    "taro": 0.2968,
    "diana": 0.1877,
    "nova": 0.2836,
    "flow": 0.232
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 59.0
    },
    "diana": {
     "n": 150,
     "acc": 37.3
    },
    "nova": {
     "n": 117,
     "acc": 56.4
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 485
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2367,
    "diana": 0.1775,
    "nova": 0.3044,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 42.1
    },
    "diana": {
     "n": 206,
     "acc": 31.6
    },
    "nova": {
     "n": 122,
     "acc": 54.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 492
  },
  "로봇": {
   "weights": {
    "taro": 0.2654,
    "diana": 0.2678,
    "nova": 0.2677,
    "flow": 0.199
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 66.7
    },
    "diana": {
     "n": 110,
     "acc": 67.3
    },
    "nova": {
     "n": 113,
     "acc": 67.3
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 373
  },
  "식음료": {
   "weights": {
    "taro": 0.1942,
    "diana": 0.302,
    "nova": 0.1895,
    "flow": 0.3143
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 30.9
    },
    "diana": {
     "n": 179,
     "acc": 48.0
    },
    "nova": {
     "n": 73,
     "acc": 30.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 375
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
