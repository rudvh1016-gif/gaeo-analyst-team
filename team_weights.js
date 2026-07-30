// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-30 09:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2816,
   "diana": 0.1965,
   "nova": 0.2674,
   "flow": 0.2545
  },
  "acc": {
   "taro": {
    "n": 6353,
    "acc": 61.5
   },
   "diana": {
    "n": 5769,
    "acc": 42.9
   },
   "nova": {
    "n": 4990,
    "acc": 58.4
   },
   "flow": {
    "n": 1107,
    "acc": 55.6
   }
  },
  "graded": 18219,
  "team": {
   "hit": 4963,
   "miss": 1264,
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
    "taro": 0.3043,
    "diana": 0.156,
    "nova": 0.2632,
    "flow": 0.2765
   },
   "acc": {
    "taro": {
     "n": 377,
     "acc": 76.1
    },
    "diana": {
     "n": 234,
     "acc": 38.5
    },
    "nova": {
     "n": 316,
     "acc": 64.9
    },
    "flow": {
     "n": 113,
     "acc": 68.1
    }
   },
   "graded": 1040
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2467,
    "diana": 0.228,
    "nova": 0.2488,
    "flow": 0.2766
   },
   "acc": {
    "taro": {
     "n": 316,
     "acc": 52.8
    },
    "diana": {
     "n": 303,
     "acc": 48.8
    },
    "nova": {
     "n": 272,
     "acc": 53.3
    },
    "flow": {
     "n": 54,
     "acc": 59.3
    }
   },
   "graded": 945
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3328,
    "diana": 0.1597,
    "nova": 0.3477,
    "flow": 0.1597
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 62.5
    },
    "diana": {
     "n": 280,
     "acc": 29.3
    },
    "nova": {
     "n": 196,
     "acc": 65.3
    },
    "flow": {
     "n": 60,
     "acc": 30.0
    }
   },
   "graded": 792
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
    "taro": 0.2471,
    "diana": 0.2456,
    "nova": 0.2697,
    "flow": 0.2376
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 52.0
    },
    "diana": {
     "n": 265,
     "acc": 51.7
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
   "graded": 792
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
    "taro": 0.2763,
    "diana": 0.2294,
    "nova": 0.2626,
    "flow": 0.2317
   },
   "acc": {
    "taro": {
     "n": 812,
     "acc": 65.6
    },
    "diana": {
     "n": 699,
     "acc": 54.5
    },
    "nova": {
     "n": 654,
     "acc": 62.4
    },
    "flow": {
     "n": 109,
     "acc": 55.0
    }
   },
   "graded": 2274
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
    "taro": 0.3058,
    "diana": 0.1665,
    "nova": 0.2883,
    "flow": 0.2395
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 63.8
    },
    "diana": {
     "n": 141,
     "acc": 34.8
    },
    "nova": {
     "n": 113,
     "acc": 60.2
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
    "taro": 0.2498,
    "diana": 0.1772,
    "nova": 0.2964,
    "flow": 0.2766
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 45.2
    },
    "diana": {
     "n": 231,
     "acc": 32.0
    },
    "nova": {
     "n": 140,
     "acc": 53.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 557
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
    "taro": 0.2052,
    "diana": 0.3068,
    "nova": 0.1927,
    "flow": 0.2953
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 34.5
    },
    "diana": {
     "n": 206,
     "acc": 51.9
    },
    "nova": {
     "n": 95,
     "acc": 32.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 442
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
     "n": 68,
     "acc": 22.1
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
   "graded": 246
  }
 }
};
