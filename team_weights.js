// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 09:42",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2716,
   "diana": 0.209,
   "nova": 0.2619,
   "flow": 0.2575
  },
  "acc": {
   "taro": {
    "n": 5581,
    "acc": 59.2
   },
   "diana": {
    "n": 5053,
    "acc": 45.5
   },
   "nova": {
    "n": 4204,
    "acc": 57.1
   },
   "flow": {
    "n": 975,
    "acc": 56.1
   }
  },
  "graded": 15813
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2686,
    "diana": 0.1902,
    "nova": 0.2443,
    "flow": 0.2969
   },
   "acc": {
    "taro": {
     "n": 662,
     "acc": 61.9
    },
    "diana": {
     "n": 431,
     "acc": 43.9
    },
    "nova": {
     "n": 568,
     "acc": 56.3
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1886
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
    "taro": 0.239,
    "diana": 0.2352,
    "nova": 0.2107,
    "flow": 0.3151
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 52.9
    },
    "diana": {
     "n": 263,
     "acc": 52.1
    },
    "nova": {
     "n": 225,
     "acc": 46.7
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
    "taro": 0.329,
    "diana": 0.1848,
    "nova": 0.3076,
    "flow": 0.1786
   },
   "acc": {
    "taro": {
     "n": 227,
     "acc": 62.6
    },
    "diana": {
     "n": 239,
     "acc": 35.1
    },
    "nova": {
     "n": 159,
     "acc": 58.5
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 678
  },
  "통신": {
   "weights": {
    "taro": 0.2835,
    "diana": 0.2068,
    "nova": 0.2718,
    "flow": 0.2378
   },
   "acc": {
    "taro": {
     "n": 99,
     "acc": 59.6
    },
    "diana": {
     "n": 69,
     "acc": 43.5
    },
    "nova": {
     "n": 77,
     "acc": 57.1
    },
    "flow": {
     "n": 27,
     "acc": 66.7
    }
   },
   "graded": 272
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.25,
    "diana": 0.2657,
    "nova": 0.246,
    "flow": 0.2383
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 52.5
    },
    "diana": {
     "n": 235,
     "acc": 55.7
    },
    "nova": {
     "n": 186,
     "acc": 51.6
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
    "diana": 0.1664,
    "nova": 0.3277,
    "flow": 0.2018
   },
   "acc": {
    "taro": {
     "n": 317,
     "acc": 55.8
    },
    "diana": {
     "n": 350,
     "acc": 30.6
    },
    "nova": {
     "n": 206,
     "acc": 60.2
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 989
  },
  "2차전지": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1958,
    "nova": 0.3016,
    "flow": 0.2011
   },
   "acc": {
    "taro": {
     "n": 298,
     "acc": 78.5
    },
    "diana": {
     "n": 191,
     "acc": 48.7
    },
    "nova": {
     "n": 241,
     "acc": 78.8
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 732
  },
  "보험": {
   "weights": {
    "taro": 0.262,
    "diana": 0.2935,
    "nova": 0.2087,
    "flow": 0.2358
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 55.6
    },
    "diana": {
     "n": 98,
     "acc": 62.2
    },
    "nova": {
     "n": 61,
     "acc": 44.3
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 294
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2644,
    "diana": 0.2308,
    "nova": 0.2741,
    "flow": 0.2307
   },
   "acc": {
    "taro": {
     "n": 709,
     "acc": 62.6
    },
    "diana": {
     "n": 613,
     "acc": 54.6
    },
    "nova": {
     "n": 550,
     "acc": 64.9
    },
    "flow": {
     "n": 97,
     "acc": 54.6
    }
   },
   "graded": 1969
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.2297,
    "nova": 0.2553,
    "flow": 0.2396
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 57.5
    },
    "diana": {
     "n": 365,
     "acc": 47.9
    },
    "nova": {
     "n": 244,
     "acc": 53.3
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 965
  },
  "조선": {
   "weights": {
    "taro": 0.2678,
    "diana": 0.239,
    "nova": 0.2282,
    "flow": 0.265
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 50.5
    },
    "diana": {
     "n": 193,
     "acc": 45.1
    },
    "nova": {
     "n": 151,
     "acc": 43.0
    },
    "flow": {
     "n": 16,
     "acc": 43.8
    }
   },
   "graded": 552
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3005,
    "diana": 0.1997,
    "nova": 0.2597,
    "flow": 0.2401
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 62.6
    },
    "diana": {
     "n": 125,
     "acc": 41.6
    },
    "nova": {
     "n": 98,
     "acc": 54.1
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
    "taro": 0.2671,
    "diana": 0.1912,
    "nova": 0.2428,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 403,
     "acc": 67.0
    },
    "diana": {
     "n": 415,
     "acc": 48.0
    },
    "nova": {
     "n": 312,
     "acc": 60.9
    },
    "flow": {
     "n": 57,
     "acc": 80.7
    }
   },
   "graded": 1187
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
    "taro": 0.2716,
    "diana": 0.2069,
    "nova": 0.2649,
    "flow": 0.2566
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 52.9
    },
    "diana": {
     "n": 263,
     "acc": 40.3
    },
    "nova": {
     "n": 155,
     "acc": 51.6
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 673
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2404,
    "diana": 0.2404,
    "nova": 0.2308,
    "flow": 0.2885
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 41.7
    },
    "diana": {
     "n": 108,
     "acc": 41.7
    },
    "nova": {
     "n": 85,
     "acc": 40.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 337
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2927,
    "diana": 0.1988,
    "nova": 0.2746,
    "flow": 0.234
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 57.7
    },
    "diana": {
     "n": 153,
     "acc": 39.2
    },
    "nova": {
     "n": 120,
     "acc": 54.2
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 493
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2359,
    "diana": 0.1817,
    "nova": 0.3003,
    "flow": 0.2821
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 41.8
    },
    "diana": {
     "n": 208,
     "acc": 32.2
    },
    "nova": {
     "n": 124,
     "acc": 53.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 497
  },
  "로봇": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.2655,
    "nova": 0.2643,
    "flow": 0.2019
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 66.4
    },
    "diana": {
     "n": 108,
     "acc": 65.7
    },
    "nova": {
     "n": 110,
     "acc": 65.5
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 364
  },
  "식음료": {
   "weights": {
    "taro": 0.1928,
    "diana": 0.304,
    "nova": 0.1887,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 30.6
    },
    "diana": {
     "n": 180,
     "acc": 48.3
    },
    "nova": {
     "n": 75,
     "acc": 29.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 379
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
