// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 14:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2825,
   "diana": 0.1928,
   "nova": 0.2704,
   "flow": 0.2543
  },
  "acc": {
   "taro": {
    "n": 6717,
    "acc": 61.5
   },
   "diana": {
    "n": 6109,
    "acc": 42.0
   },
   "nova": {
    "n": 5379,
    "acc": 58.9
   },
   "flow": {
    "n": 1168,
    "acc": 55.4
   }
  },
  "graded": 19373,
  "team": {
   "hit": 5284,
   "miss": 1313,
   "n": 6597,
   "acc": 80.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2929,
    "diana": 0.1768,
    "nova": 0.2271,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 814,
     "acc": 67.4
    },
    "diana": {
     "n": 533,
     "acc": 40.7
    },
    "nova": {
     "n": 700,
     "acc": 52.3
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2312
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3059,
    "diana": 0.1552,
    "nova": 0.26,
    "flow": 0.2789
   },
   "acc": {
    "taro": {
     "n": 399,
     "acc": 76.9
    },
    "diana": {
     "n": 247,
     "acc": 38.1
    },
    "nova": {
     "n": 331,
     "acc": 63.7
    },
    "flow": {
     "n": 117,
     "acc": 68.4
    }
   },
   "graded": 1094
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2518,
    "diana": 0.2289,
    "nova": 0.2637,
    "flow": 0.2555
   },
   "acc": {
    "taro": {
     "n": 333,
     "acc": 53.5
    },
    "diana": {
     "n": 317,
     "acc": 48.6
    },
    "nova": {
     "n": 293,
     "acc": 56.0
    },
    "flow": {
     "n": 59,
     "acc": 54.2
    }
   },
   "graded": 1002
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3352,
    "diana": 0.1589,
    "nova": 0.3462,
    "flow": 0.1597
   },
   "acc": {
    "taro": {
     "n": 267,
     "acc": 63.3
    },
    "diana": {
     "n": 295,
     "acc": 28.5
    },
    "nova": {
     "n": 208,
     "acc": 65.4
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 833
  },
  "통신": {
   "weights": {
    "taro": 0.2614,
    "diana": 0.1885,
    "nova": 0.2643,
    "flow": 0.2859
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 60.2
    },
    "diana": {
     "n": 83,
     "acc": 43.4
    },
    "nova": {
     "n": 97,
     "acc": 60.8
    },
    "flow": {
     "n": 38,
     "acc": 65.8
    }
   },
   "graded": 341
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.234,
    "diana": 0.2326,
    "nova": 0.2662,
    "flow": 0.2672
   },
   "acc": {
    "taro": {
     "n": 293,
     "acc": 50.9
    },
    "diana": {
     "n": 279,
     "acc": 50.5
    },
    "nova": {
     "n": 242,
     "acc": 57.9
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 845
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3239,
    "diana": 0.1642,
    "nova": 0.3142,
    "flow": 0.1978
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 59.2
    },
    "diana": {
     "n": 433,
     "acc": 26.1
    },
    "nova": {
     "n": 277,
     "acc": 57.4
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1216
  },
  "2차전지": {
   "weights": {
    "taro": 0.3021,
    "diana": 0.1944,
    "nova": 0.3021,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 82.4
    },
    "diana": {
     "n": 232,
     "acc": 48.3
    },
    "nova": {
     "n": 303,
     "acc": 75.6
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 900
  },
  "보험": {
   "weights": {
    "taro": 0.2618,
    "diana": 0.2491,
    "nova": 0.2678,
    "flow": 0.2213
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 53.4
    },
    "diana": {
     "n": 118,
     "acc": 50.8
    },
    "nova": {
     "n": 86,
     "acc": 54.7
    },
    "flow": {
     "n": 31,
     "acc": 45.2
    }
   },
   "graded": 366
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.2246,
    "nova": 0.2609,
    "flow": 0.2373
   },
   "acc": {
    "taro": {
     "n": 851,
     "acc": 66.2
    },
    "diana": {
     "n": 735,
     "acc": 53.6
    },
    "nova": {
     "n": 697,
     "acc": 62.3
    },
    "flow": {
     "n": 113,
     "acc": 56.6
    }
   },
   "graded": 2396
  },
  "지주·상사": {
   "weights": {
    "taro": 0.302,
    "diana": 0.2185,
    "nova": 0.3224,
    "flow": 0.1572
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 57.6
    },
    "diana": {
     "n": 439,
     "acc": 41.7
    },
    "nova": {
     "n": 317,
     "acc": 61.5
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1178
  },
  "조선": {
   "weights": {
    "taro": 0.2756,
    "diana": 0.1876,
    "nova": 0.2796,
    "flow": 0.2572
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 53.6
    },
    "diana": {
     "n": 233,
     "acc": 36.5
    },
    "nova": {
     "n": 195,
     "acc": 54.4
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 679
  },
  "방산": {
   "weights": {
    "taro": 0.2923,
    "diana": 0.155,
    "nova": 0.2943,
    "flow": 0.2584
   },
   "acc": {
    "taro": {
     "n": 99,
     "acc": 56.6
    },
    "diana": {
     "n": 44,
     "acc": 29.5
    },
    "nova": {
     "n": 72,
     "acc": 56.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 215
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3026,
    "diana": 0.1696,
    "nova": 0.2893,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 145,
     "acc": 63.4
    },
    "diana": {
     "n": 149,
     "acc": 35.6
    },
    "nova": {
     "n": 122,
     "acc": 60.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 416
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.1714,
    "nova": 0.2569,
    "flow": 0.3035
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 66.3
    },
    "diana": {
     "n": 510,
     "acc": 42.4
    },
    "nova": {
     "n": 408,
     "acc": 63.5
    },
    "flow": {
     "n": 67,
     "acc": 77.6
    }
   },
   "graded": 1474
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2601,
    "diana": 0.2632,
    "nova": 0.2249,
    "flow": 0.2518
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 48.9
    },
    "diana": {
     "n": 99,
     "acc": 49.5
    },
    "nova": {
     "n": 52,
     "acc": 42.3
    },
    "flow": {
     "n": 57,
     "acc": 47.4
    }
   },
   "graded": 300
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.1887,
    "nova": 0.2757,
    "flow": 0.2563
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 54.5
    },
    "diana": {
     "n": 307,
     "acc": 36.8
    },
    "nova": {
     "n": 199,
     "acc": 53.8
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 812
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2662,
    "diana": 0.2321,
    "nova": 0.219,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 47.1
    },
    "diana": {
     "n": 134,
     "acc": 41.0
    },
    "nova": {
     "n": 111,
     "acc": 38.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 417
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3153,
    "diana": 0.163,
    "nova": 0.329,
    "flow": 0.1927
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 59.5
    },
    "diana": {
     "n": 182,
     "acc": 30.8
    },
    "nova": {
     "n": 153,
     "acc": 62.1
    },
    "flow": {
     "n": 66,
     "acc": 36.4
    }
   },
   "graded": 601
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2459,
    "diana": 0.1905,
    "nova": 0.288,
    "flow": 0.2756
   },
   "acc": {
    "taro": {
     "n": 195,
     "acc": 44.6
    },
    "diana": {
     "n": 246,
     "acc": 34.6
    },
    "nova": {
     "n": 155,
     "acc": 52.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 596
  },
  "로봇": {
   "weights": {
    "taro": 0.2636,
    "diana": 0.2739,
    "nova": 0.2707,
    "flow": 0.1917
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 68.8
    },
    "diana": {
     "n": 133,
     "acc": 71.4
    },
    "nova": {
     "n": 136,
     "acc": 70.6
    },
    "flow": {
     "n": 28,
     "acc": 50.0
    }
   },
   "graded": 457
  },
  "식음료": {
   "weights": {
    "taro": 0.1949,
    "diana": 0.3011,
    "nova": 0.2137,
    "flow": 0.2904
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 33.6
    },
    "diana": {
     "n": 216,
     "acc": 51.9
    },
    "nova": {
     "n": 106,
     "acc": 36.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 474
  },
  "여행레저": {
   "weights": {
    "taro": 0.3584,
    "diana": 0.167,
    "nova": 0.3075,
    "flow": 0.167
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 64.4
    },
    "diana": {
     "n": 71,
     "acc": 23.9
    },
    "nova": {
     "n": 67,
     "acc": 55.2
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 256
  }
 }
};
