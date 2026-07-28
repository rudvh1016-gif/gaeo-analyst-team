// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 10:42",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2715,
   "diana": 0.2076,
   "nova": 0.263,
   "flow": 0.2579
  },
  "acc": {
   "taro": {
    "n": 5596,
    "acc": 59.3
   },
   "diana": {
    "n": 5056,
    "acc": 45.4
   },
   "nova": {
    "n": 4210,
    "acc": 57.5
   },
   "flow": {
    "n": 976,
    "acc": 56.4
   }
  },
  "graded": 15838
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2688,
    "diana": 0.1897,
    "nova": 0.2446,
    "flow": 0.2968
   },
   "acc": {
    "taro": {
     "n": 663,
     "acc": 62.0
    },
    "diana": {
     "n": 432,
     "acc": 43.8
    },
    "nova": {
     "n": 569,
     "acc": 56.4
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1889
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2947,
    "diana": 0.1661,
    "nova": 0.2696,
    "flow": 0.2696
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 72.9
    },
    "diana": {
     "n": 207,
     "acc": 41.1
    },
    "nova": {
     "n": 270,
     "acc": 66.7
    },
    "flow": {
     "n": 102,
     "acc": 66.7
    }
   },
   "graded": 907
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2389,
    "diana": 0.2334,
    "nova": 0.2127,
    "flow": 0.315
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 52.9
    },
    "diana": {
     "n": 263,
     "acc": 51.7
    },
    "nova": {
     "n": 225,
     "acc": 47.1
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
    "taro": 0.3284,
    "diana": 0.1807,
    "nova": 0.3128,
    "flow": 0.1782
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 62.6
    },
    "diana": {
     "n": 241,
     "acc": 34.4
    },
    "nova": {
     "n": 161,
     "acc": 59.6
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 685
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
    "taro": 0.2492,
    "diana": 0.2647,
    "nova": 0.2475,
    "flow": 0.2386
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 52.2
    },
    "diana": {
     "n": 238,
     "acc": 55.5
    },
    "nova": {
     "n": 189,
     "acc": 51.9
    },
    "flow": {
     "n": 25,
     "acc": 60.0
    }
   },
   "graded": 699
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.1671,
    "nova": 0.3272,
    "flow": 0.2018
   },
   "acc": {
    "taro": {
     "n": 319,
     "acc": 55.8
    },
    "diana": {
     "n": 352,
     "acc": 30.7
    },
    "nova": {
     "n": 208,
     "acc": 60.1
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 995
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
     "n": 301,
     "acc": 78.7
    },
    "diana": {
     "n": 193,
     "acc": 49.2
    },
    "nova": {
     "n": 244,
     "acc": 79.1
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 740
  },
  "보험": {
   "weights": {
    "taro": 0.2624,
    "diana": 0.2857,
    "nova": 0.2179,
    "flow": 0.234
   },
   "acc": {
    "taro": {
     "n": 107,
     "acc": 56.1
    },
    "diana": {
     "n": 95,
     "acc": 61.1
    },
    "nova": {
     "n": 58,
     "acc": 46.6
    },
    "flow": {
     "n": 26,
     "acc": 53.8
    }
   },
   "graded": 286
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2648,
    "diana": 0.2289,
    "nova": 0.2755,
    "flow": 0.2308
   },
   "acc": {
    "taro": {
     "n": 712,
     "acc": 63.2
    },
    "diana": {
     "n": 615,
     "acc": 54.6
    },
    "nova": {
     "n": 552,
     "acc": 65.8
    },
    "flow": {
     "n": 98,
     "acc": 55.1
    }
   },
   "graded": 1977
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2753,
    "diana": 0.2282,
    "nova": 0.2572,
    "flow": 0.2394
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 57.5
    },
    "diana": {
     "n": 363,
     "acc": 47.7
    },
    "nova": {
     "n": 242,
     "acc": 53.7
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 961
  },
  "조선": {
   "weights": {
    "taro": 0.2702,
    "diana": 0.2371,
    "nova": 0.2279,
    "flow": 0.2647
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 51.0
    },
    "diana": {
     "n": 192,
     "acc": 44.8
    },
    "nova": {
     "n": 151,
     "acc": 43.0
    },
    "flow": {
     "n": 15,
     "acc": 46.7
    }
   },
   "graded": 550
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3023,
    "diana": 0.1962,
    "nova": 0.2629,
    "flow": 0.2386
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 63.4
    },
    "diana": {
     "n": 124,
     "acc": 41.1
    },
    "nova": {
     "n": 98,
     "acc": 55.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 353
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2677,
    "diana": 0.1902,
    "nova": 0.2439,
    "flow": 0.2982
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 67.3
    },
    "diana": {
     "n": 416,
     "acc": 47.8
    },
    "nova": {
     "n": 313,
     "acc": 61.3
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1191
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.2993,
    "nova": 0.1586,
    "flow": 0.2643
   },
   "acc": {
    "taro": {
     "n": 78,
     "acc": 52.6
    },
    "diana": {
     "n": 83,
     "acc": 56.6
    },
    "nova": {
     "n": 37,
     "acc": 21.6
    },
    "flow": {
     "n": 48,
     "acc": 50.0
    }
   },
   "graded": 246
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2723,
    "diana": 0.2037,
    "nova": 0.268,
    "flow": 0.2561
   },
   "acc": {
    "taro": {
     "n": 237,
     "acc": 53.2
    },
    "diana": {
     "n": 259,
     "acc": 39.8
    },
    "nova": {
     "n": 151,
     "acc": 52.3
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 662
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2418,
    "diana": 0.2369,
    "nova": 0.2332,
    "flow": 0.2881
   },
   "acc": {
    "taro": {
     "n": 143,
     "acc": 42.0
    },
    "diana": {
     "n": 107,
     "acc": 41.1
    },
    "nova": {
     "n": 84,
     "acc": 40.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 334
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2926,
    "diana": 0.1967,
    "nova": 0.2768,
    "flow": 0.2339
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 57.7
    },
    "diana": {
     "n": 152,
     "acc": 38.8
    },
    "nova": {
     "n": 119,
     "acc": 54.6
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 491
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
    "taro": 0.2665,
    "diana": 0.266,
    "nova": 0.2661,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 66.2
    },
    "diana": {
     "n": 109,
     "acc": 66.1
    },
    "nova": {
     "n": 112,
     "acc": 66.1
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 369
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
    "taro": 0.3005,
    "diana": 0.1572,
    "nova": 0.2802,
    "flow": 0.2621
   },
   "acc": {
    "taro": {
     "n": 75,
     "acc": 57.3
    },
    "diana": {
     "n": 63,
     "acc": 25.4
    },
    "nova": {
     "n": 58,
     "acc": 53.4
    },
    "flow": {
     "n": 27,
     "acc": 25.9
    }
   },
   "graded": 223
  }
 }
};
