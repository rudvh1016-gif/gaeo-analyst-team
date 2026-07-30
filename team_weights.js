// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-30 10:23",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2819,
   "diana": 0.1967,
   "nova": 0.2673,
   "flow": 0.2541
  },
  "acc": {
   "taro": {
    "n": 6350,
    "acc": 61.5
   },
   "diana": {
    "n": 5766,
    "acc": 42.9
   },
   "nova": {
    "n": 4986,
    "acc": 58.3
   },
   "flow": {
    "n": 1108,
    "acc": 55.4
   }
  },
  "graded": 18210,
  "team": {
   "hit": 4960,
   "miss": 1267,
   "n": 6227,
   "acc": 79.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.18,
    "nova": 0.232,
    "flow": 0.3004
   },
   "acc": {
    "taro": {
     "n": 765,
     "acc": 66.7
    },
    "diana": {
     "n": 501,
     "acc": 41.7
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
    "taro": 0.3058,
    "diana": 0.1568,
    "nova": 0.2632,
    "flow": 0.2742
   },
   "acc": {
    "taro": {
     "n": 377,
     "acc": 76.4
    },
    "diana": {
     "n": 234,
     "acc": 38.5
    },
    "nova": {
     "n": 316,
     "acc": 64.6
    },
    "flow": {
     "n": 113,
     "acc": 67.3
    }
   },
   "graded": 1040
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
    "taro": 0.324,
    "diana": 0.1643,
    "nova": 0.3138,
    "flow": 0.1979
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 59.2
    },
    "diana": {
     "n": 404,
     "acc": 27.5
    },
    "nova": {
     "n": 253,
     "acc": 57.3
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1141
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
    "taro": 0.2761,
    "diana": 0.229,
    "nova": 0.2629,
    "flow": 0.2319
   },
   "acc": {
    "taro": {
     "n": 810,
     "acc": 65.6
    },
    "diana": {
     "n": 697,
     "acc": 54.4
    },
    "nova": {
     "n": 652,
     "acc": 62.4
    },
    "flow": {
     "n": 109,
     "acc": 55.0
    }
   },
   "graded": 2268
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
    "taro": 0.2778,
    "diana": 0.1941,
    "nova": 0.2746,
    "flow": 0.2536
   },
   "acc": {
    "taro": {
     "n": 272,
     "acc": 54.8
    },
    "diana": {
     "n": 290,
     "acc": 38.3
    },
    "nova": {
     "n": 181,
     "acc": 54.1
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 759
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
    "taro": 0.2481,
    "diana": 0.1811,
    "nova": 0.2932,
    "flow": 0.2776
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 44.7
    },
    "diana": {
     "n": 233,
     "acc": 32.6
    },
    "nova": {
     "n": 142,
     "acc": 52.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 563
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
