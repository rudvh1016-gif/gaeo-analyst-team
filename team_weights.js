// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-30 10:58",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2816,
   "diana": 0.1972,
   "nova": 0.2668,
   "flow": 0.2544
  },
  "acc": {
   "taro": {
    "n": 6349,
    "acc": 61.4
   },
   "diana": {
    "n": 5769,
    "acc": 43.0
   },
   "nova": {
    "n": 4988,
    "acc": 58.2
   },
   "flow": {
    "n": 1106,
    "acc": 55.5
   }
  },
  "graded": 18212,
  "team": {
   "hit": 4969,
   "miss": 1268,
   "n": 6237,
   "acc": 79.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2874,
    "diana": 0.1793,
    "nova": 0.2324,
    "flow": 0.3009
   },
   "acc": {
    "taro": {
     "n": 765,
     "acc": 66.5
    },
    "diana": {
     "n": 501,
     "acc": 41.5
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
   "graded": 2183
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
    "taro": 0.249,
    "diana": 0.2304,
    "nova": 0.2448,
    "flow": 0.2758
   },
   "acc": {
    "taro": {
     "n": 314,
     "acc": 53.5
    },
    "diana": {
     "n": 301,
     "acc": 49.5
    },
    "nova": {
     "n": 270,
     "acc": 52.6
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
    "taro": 0.2476,
    "diana": 0.2471,
    "nova": 0.2681,
    "flow": 0.2372
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 52.2
    },
    "diana": {
     "n": 265,
     "acc": 52.1
    },
    "nova": {
     "n": 223,
     "acc": 56.5
    },
    "flow": {
     "n": 27,
     "acc": 59.3
    }
   },
   "graded": 791
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3245,
    "diana": 0.1644,
    "nova": 0.3131,
    "flow": 0.198
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 59.2
    },
    "diana": {
     "n": 402,
     "acc": 27.6
    },
    "nova": {
     "n": 252,
     "acc": 57.1
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1136
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
    "taro": 0.2701,
    "diana": 0.2646,
    "nova": 0.2407,
    "flow": 0.2247
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 56.1
    },
    "diana": {
     "n": 111,
     "acc": 55.0
    },
    "nova": {
     "n": 78,
     "acc": 50.0
    },
    "flow": {
     "n": 30,
     "acc": 46.7
    }
   },
   "graded": 342
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.2299,
    "nova": 0.2619,
    "flow": 0.2321
   },
   "acc": {
    "taro": {
     "n": 809,
     "acc": 65.5
    },
    "diana": {
     "n": 697,
     "acc": 54.5
    },
    "nova": {
     "n": 652,
     "acc": 62.1
    },
    "flow": {
     "n": 109,
     "acc": 55.0
    }
   },
   "graded": 2267
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3069,
    "diana": 0.2251,
    "nova": 0.3094,
    "flow": 0.1586
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 58.6
    },
    "diana": {
     "n": 414,
     "acc": 43.0
    },
    "nova": {
     "n": 291,
     "acc": 59.1
    },
    "flow": {
     "n": 33,
     "acc": 30.3
    }
   },
   "graded": 1103
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
    "taro": 0.306,
    "diana": 0.17,
    "nova": 0.2843,
    "flow": 0.2397
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 63.8
    },
    "diana": {
     "n": 141,
     "acc": 35.5
    },
    "nova": {
     "n": 113,
     "acc": 59.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 395
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
    "taro": 0.2764,
    "diana": 0.1949,
    "nova": 0.2755,
    "flow": 0.2532
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 54.6
    },
    "diana": {
     "n": 291,
     "acc": 38.5
    },
    "nova": {
     "n": 182,
     "acc": 54.4
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
    "taro": 0.2594,
    "diana": 0.234,
    "nova": 0.2246,
    "flow": 0.2821
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 46.0
    },
    "diana": {
     "n": 123,
     "acc": 41.5
    },
    "nova": {
     "n": 98,
     "acc": 39.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 382
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
    "taro": 0.245,
    "diana": 0.1855,
    "nova": 0.2925,
    "flow": 0.2771
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 44.2
    },
    "diana": {
     "n": 236,
     "acc": 33.5
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
   "graded": 570
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
    "taro": 0.3516,
    "diana": 0.1683,
    "nova": 0.3117,
    "flow": 0.1683
   },
   "acc": {
    "taro": {
     "n": 83,
     "acc": 62.7
    },
    "diana": {
     "n": 68,
     "acc": 23.5
    },
    "nova": {
     "n": 63,
     "acc": 55.6
    },
    "flow": {
     "n": 30,
     "acc": 26.7
    }
   },
   "graded": 244
  }
 }
};
