// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-30 10:29",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2817,
   "diana": 0.1967,
   "nova": 0.2673,
   "flow": 0.2543
  },
  "acc": {
   "taro": {
    "n": 6351,
    "acc": 61.5
   },
   "diana": {
    "n": 5769,
    "acc": 42.9
   },
   "nova": {
    "n": 4989,
    "acc": 58.3
   },
   "flow": {
    "n": 1107,
    "acc": 55.5
   }
  },
  "graded": 18216,
  "team": {
   "hit": 4959,
   "miss": 1266,
   "n": 6225,
   "acc": 79.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.1796,
    "nova": 0.2322,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 764,
     "acc": 66.6
    },
    "diana": {
     "n": 500,
     "acc": 41.6
    },
    "nova": {
     "n": 660,
     "acc": 53.8
    },
    "flow": {
     "n": 257,
     "acc": 69.6
    }
   },
   "graded": 2181
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3048,
    "diana": 0.1563,
    "nova": 0.2632,
    "flow": 0.2758
   },
   "acc": {
    "taro": {
     "n": 376,
     "acc": 76.3
    },
    "diana": {
     "n": 234,
     "acc": 38.5
    },
    "nova": {
     "n": 315,
     "acc": 64.8
    },
    "flow": {
     "n": 112,
     "acc": 67.9
    }
   },
   "graded": 1037
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2479,
    "diana": 0.2291,
    "nova": 0.2468,
    "flow": 0.2762
   },
   "acc": {
    "taro": {
     "n": 314,
     "acc": 53.2
    },
    "diana": {
     "n": 301,
     "acc": 49.2
    },
    "nova": {
     "n": 270,
     "acc": 53.0
    },
    "flow": {
     "n": 54,
     "acc": 59.3
    }
   },
   "graded": 939
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3325,
    "diana": 0.1596,
    "nova": 0.3483,
    "flow": 0.1596
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 62.5
    },
    "diana": {
     "n": 281,
     "acc": 29.2
    },
    "nova": {
     "n": 197,
     "acc": 65.5
    },
    "flow": {
     "n": 61,
     "acc": 29.5
    }
   },
   "graded": 795
  },
  "통신": {
   "weights": {
    "taro": 0.2634,
    "diana": 0.1981,
    "nova": 0.2536,
    "flow": 0.2849
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 59.8
    },
    "diana": {
     "n": 80,
     "acc": 45.0
    },
    "nova": {
     "n": 92,
     "acc": 57.6
    },
    "flow": {
     "n": 34,
     "acc": 64.7
    }
   },
   "graded": 323
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2478,
    "diana": 0.2464,
    "nova": 0.2683,
    "flow": 0.2375
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 52.2
    },
    "diana": {
     "n": 266,
     "acc": 51.9
    },
    "nova": {
     "n": 223,
     "acc": 56.5
    },
    "flow": {
     "n": 28,
     "acc": 57.1
    }
   },
   "graded": 793
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3231,
    "diana": 0.1643,
    "nova": 0.3147,
    "flow": 0.1979
   },
   "acc": {
    "taro": {
     "n": 366,
     "acc": 59.0
    },
    "diana": {
     "n": 405,
     "acc": 27.4
    },
    "nova": {
     "n": 254,
     "acc": 57.5
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1144
  },
  "2차전지": {
   "weights": {
    "taro": 0.3014,
    "diana": 0.1963,
    "nova": 0.3014,
    "flow": 0.2009
   },
   "acc": {
    "taro": {
     "n": 341,
     "acc": 81.8
    },
    "diana": {
     "n": 219,
     "acc": 48.9
    },
    "nova": {
     "n": 284,
     "acc": 75.4
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 846
  },
  "보험": {
   "weights": {
    "taro": 0.2669,
    "diana": 0.2609,
    "nova": 0.2473,
    "flow": 0.2249
   },
   "acc": {
    "taro": {
     "n": 121,
     "acc": 55.4
    },
    "diana": {
     "n": 109,
     "acc": 54.1
    },
    "nova": {
     "n": 76,
     "acc": 51.3
    },
    "flow": {
     "n": 30,
     "acc": 46.7
    }
   },
   "graded": 336
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2764,
    "diana": 0.2293,
    "nova": 0.2626,
    "flow": 0.2318
   },
   "acc": {
    "taro": {
     "n": 809,
     "acc": 65.6
    },
    "diana": {
     "n": 696,
     "acc": 54.5
    },
    "nova": {
     "n": 651,
     "acc": 62.4
    },
    "flow": {
     "n": 109,
     "acc": 55.0
    }
   },
   "graded": 2265
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3063,
    "diana": 0.2247,
    "nova": 0.3103,
    "flow": 0.1587
   },
   "acc": {
    "taro": {
     "n": 366,
     "acc": 58.5
    },
    "diana": {
     "n": 415,
     "acc": 42.9
    },
    "nova": {
     "n": 292,
     "acc": 59.2
    },
    "flow": {
     "n": 33,
     "acc": 30.3
    }
   },
   "graded": 1106
  },
  "조선": {
   "weights": {
    "taro": 0.2759,
    "diana": 0.1953,
    "nova": 0.2687,
    "flow": 0.26
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 53.1
    },
    "diana": {
     "n": 221,
     "acc": 37.6
    },
    "nova": {
     "n": 180,
     "acc": 51.7
    },
    "flow": {
     "n": 23,
     "acc": 52.2
    }
   },
   "graded": 637
  },
  "방산": {
   "weights": {
    "taro": 0.2901,
    "diana": 0.1573,
    "nova": 0.2904,
    "flow": 0.2622
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 55.3
    },
    "diana": {
     "n": 41,
     "acc": 29.3
    },
    "nova": {
     "n": 65,
     "acc": 55.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 200
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3059,
    "diana": 0.1677,
    "nova": 0.2867,
    "flow": 0.2396
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 63.8
    },
    "diana": {
     "n": 140,
     "acc": 35.0
    },
    "nova": {
     "n": 112,
     "acc": 59.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 393
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.178,
    "nova": 0.2468,
    "flow": 0.3031
   },
   "acc": {
    "taro": {
     "n": 459,
     "acc": 67.3
    },
    "diana": {
     "n": 479,
     "acc": 44.1
    },
    "nova": {
     "n": 375,
     "acc": 61.1
    },
    "flow": {
     "n": 62,
     "acc": 79.0
    }
   },
   "graded": 1375
  },
  "물류·운송": {
   "weights": {
    "taro": 0.272,
    "diana": 0.2746,
    "nova": 0.1978,
    "flow": 0.2556
   },
   "acc": {
    "taro": {
     "n": 86,
     "acc": 51.2
    },
    "diana": {
     "n": 91,
     "acc": 51.6
    },
    "nova": {
     "n": 43,
     "acc": 37.2
    },
    "flow": {
     "n": 52,
     "acc": 48.1
    }
   },
   "graded": 272
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2785,
    "diana": 0.1951,
    "nova": 0.2729,
    "flow": 0.2534
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 54.9
    },
    "diana": {
     "n": 291,
     "acc": 38.5
    },
    "nova": {
     "n": 182,
     "acc": 53.8
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 762
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2613,
    "diana": 0.2341,
    "nova": 0.2224,
    "flow": 0.2822
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 46.3
    },
    "diana": {
     "n": 123,
     "acc": 41.5
    },
    "nova": {
     "n": 99,
     "acc": 39.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 384
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3091,
    "diana": 0.1708,
    "nova": 0.3115,
    "flow": 0.2086
   },
   "acc": {
    "taro": {
     "n": 189,
     "acc": 59.3
    },
    "diana": {
     "n": 171,
     "acc": 32.7
    },
    "nova": {
     "n": 139,
     "acc": 59.7
    },
    "flow": {
     "n": 60,
     "acc": 40.0
    }
   },
   "graded": 559
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2463,
    "diana": 0.184,
    "nova": 0.2925,
    "flow": 0.2771
   },
   "acc": {
    "taro": {
     "n": 189,
     "acc": 44.4
    },
    "diana": {
     "n": 235,
     "acc": 33.2
    },
    "nova": {
     "n": 144,
     "acc": 52.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 568
  },
  "로봇": {
   "weights": {
    "taro": 0.2636,
    "diana": 0.2726,
    "nova": 0.273,
    "flow": 0.1908
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 69.1
    },
    "diana": {
     "n": 126,
     "acc": 71.4
    },
    "nova": {
     "n": 130,
     "acc": 71.5
    },
    "flow": {
     "n": 23,
     "acc": 43.5
    }
   },
   "graded": 431
  },
  "식음료": {
   "weights": {
    "taro": 0.2061,
    "diana": 0.3081,
    "nova": 0.1893,
    "flow": 0.2965
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 34.8
    },
    "diana": {
     "n": 206,
     "acc": 51.9
    },
    "nova": {
     "n": 94,
     "acc": 31.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 441
  },
  "여행레저": {
   "weights": {
    "taro": 0.3518,
    "diana": 0.1673,
    "nova": 0.3136,
    "flow": 0.1673
   },
   "acc": {
    "taro": {
     "n": 84,
     "acc": 63.1
    },
    "diana": {
     "n": 69,
     "acc": 23.2
    },
    "nova": {
     "n": 64,
     "acc": 56.2
    },
    "flow": {
     "n": 30,
     "acc": 26.7
    }
   },
   "graded": 247
  }
 }
};
