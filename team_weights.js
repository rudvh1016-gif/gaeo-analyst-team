// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 10:12",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2717,
   "diana": 0.2083,
   "nova": 0.262,
   "flow": 0.258
  },
  "acc": {
   "taro": {
    "n": 5591,
    "acc": 59.3
   },
   "diana": {
    "n": 5061,
    "acc": 45.5
   },
   "nova": {
    "n": 4215,
    "acc": 57.2
   },
   "flow": {
    "n": 975,
    "acc": 56.3
   }
  },
  "graded": 15842
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
    "taro": 0.2395,
    "diana": 0.2341,
    "nova": 0.2116,
    "flow": 0.3148
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 53.1
    },
    "diana": {
     "n": 264,
     "acc": 51.9
    },
    "nova": {
     "n": 226,
     "acc": 46.9
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
    "taro": 0.3286,
    "diana": 0.1822,
    "nova": 0.311,
    "flow": 0.1782
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 62.6
    },
    "diana": {
     "n": 242,
     "acc": 34.7
    },
    "nova": {
     "n": 162,
     "acc": 59.3
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
    "taro": 0.2493,
    "diana": 0.2658,
    "nova": 0.2462,
    "flow": 0.2386
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 52.2
    },
    "diana": {
     "n": 237,
     "acc": 55.7
    },
    "nova": {
     "n": 188,
     "acc": 51.6
    },
    "flow": {
     "n": 25,
     "acc": 60.0
    }
   },
   "graded": 695
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
    "taro": 0.3013,
    "diana": 0.1967,
    "nova": 0.3013,
    "flow": 0.2008
   },
   "acc": {
    "taro": {
     "n": 300,
     "acc": 78.7
    },
    "diana": {
     "n": 192,
     "acc": 49.0
    },
    "nova": {
     "n": 243,
     "acc": 79.0
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 737
  },
  "보험": {
   "weights": {
    "taro": 0.2652,
    "diana": 0.2922,
    "nova": 0.2078,
    "flow": 0.2348
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 56.5
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
     "n": 26,
     "acc": 53.8
    }
   },
   "graded": 293
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2648,
    "diana": 0.2302,
    "nova": 0.2746,
    "flow": 0.2305
   },
   "acc": {
    "taro": {
     "n": 709,
     "acc": 62.8
    },
    "diana": {
     "n": 612,
     "acc": 54.6
    },
    "nova": {
     "n": 550,
     "acc": 65.1
    },
    "flow": {
     "n": 97,
     "acc": 54.6
    }
   },
   "graded": 1968
  },
  "지주·상사": {
   "weights": {
    "taro": 0.276,
    "diana": 0.2294,
    "nova": 0.2552,
    "flow": 0.2393
   },
   "acc": {
    "taro": {
     "n": 326,
     "acc": 57.7
    },
    "diana": {
     "n": 363,
     "acc": 47.9
    },
    "nova": {
     "n": 242,
     "acc": 53.3
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 960
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
    "taro": 0.3008,
    "diana": 0.199,
    "nova": 0.261,
    "flow": 0.2392
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 62.9
    },
    "diana": {
     "n": 125,
     "acc": 41.6
    },
    "nova": {
     "n": 99,
     "acc": 54.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 356
  },
  "화학·소재": {
   "weights": {
    "taro": 0.268,
    "diana": 0.19,
    "nova": 0.2434,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 67.3
    },
    "diana": {
     "n": 417,
     "acc": 47.7
    },
    "nova": {
     "n": 314,
     "acc": 61.1
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1193
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
    "taro": 0.2733,
    "diana": 0.2061,
    "nova": 0.2645,
    "flow": 0.2561
   },
   "acc": {
    "taro": {
     "n": 238,
     "acc": 53.4
    },
    "diana": {
     "n": 261,
     "acc": 40.2
    },
    "nova": {
     "n": 153,
     "acc": 51.6
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 667
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
    "taro": 0.2915,
    "diana": 0.2012,
    "nova": 0.2729,
    "flow": 0.2344
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 57.4
    },
    "diana": {
     "n": 154,
     "acc": 39.6
    },
    "nova": {
     "n": 121,
     "acc": 53.7
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 496
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
