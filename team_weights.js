// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-30 15:29",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2811,
   "diana": 0.196,
   "nova": 0.2684,
   "flow": 0.2545
  },
  "acc": {
   "taro": {
    "n": 6354,
    "acc": 61.3
   },
   "diana": {
    "n": 5770,
    "acc": 42.7
   },
   "nova": {
    "n": 4991,
    "acc": 58.5
   },
   "flow": {
    "n": 1108,
    "acc": 55.5
   }
  },
  "graded": 18223,
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
    "taro": 0.2623,
    "diana": 0.1954,
    "nova": 0.2569,
    "flow": 0.2854
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 59.5
    },
    "diana": {
     "n": 79,
     "acc": 44.3
    },
    "nova": {
     "n": 91,
     "acc": 58.2
    },
    "flow": {
     "n": 34,
     "acc": 64.7
    }
   },
   "graded": 320
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2455,
    "diana": 0.2449,
    "nova": 0.272,
    "flow": 0.2377
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 51.6
    },
    "diana": {
     "n": 264,
     "acc": 51.5
    },
    "nova": {
     "n": 222,
     "acc": 57.2
    },
    "flow": {
     "n": 28,
     "acc": 57.1
    }
   },
   "graded": 789
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3214,
    "diana": 0.1643,
    "nova": 0.3165,
    "flow": 0.1978
   },
   "acc": {
    "taro": {
     "n": 368,
     "acc": 58.7
    },
    "diana": {
     "n": 407,
     "acc": 27.3
    },
    "nova": {
     "n": 256,
     "acc": 57.8
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1150
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
    "taro": 0.2616,
    "diana": 0.2551,
    "nova": 0.2574,
    "flow": 0.2259
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 54.0
    },
    "diana": {
     "n": 112,
     "acc": 52.7
    },
    "nova": {
     "n": 79,
     "acc": 53.2
    },
    "flow": {
     "n": 30,
     "acc": 46.7
    }
   },
   "graded": 345
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2757,
    "diana": 0.2275,
    "nova": 0.2635,
    "flow": 0.2334
   },
   "acc": {
    "taro": {
     "n": 809,
     "acc": 65.6
    },
    "diana": {
     "n": 698,
     "acc": 54.2
    },
    "nova": {
     "n": 652,
     "acc": 62.7
    },
    "flow": {
     "n": 108,
     "acc": 55.6
    }
   },
   "graded": 2267
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3068,
    "diana": 0.2243,
    "nova": 0.3104,
    "flow": 0.1586
   },
   "acc": {
    "taro": {
     "n": 365,
     "acc": 58.6
    },
    "diana": {
     "n": 413,
     "acc": 42.9
    },
    "nova": {
     "n": 290,
     "acc": 59.3
    },
    "flow": {
     "n": 33,
     "acc": 30.3
    }
   },
   "graded": 1101
  },
  "조선": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1963,
    "nova": 0.2674,
    "flow": 0.2602
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 53.1
    },
    "diana": {
     "n": 220,
     "acc": 37.7
    },
    "nova": {
     "n": 179,
     "acc": 51.4
    },
    "flow": {
     "n": 23,
     "acc": 52.2
    }
   },
   "graded": 635
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
    "taro": 0.2715,
    "diana": 0.1774,
    "nova": 0.2477,
    "flow": 0.3034
   },
   "acc": {
    "taro": {
     "n": 459,
     "acc": 67.1
    },
    "diana": {
     "n": 479,
     "acc": 43.8
    },
    "nova": {
     "n": 374,
     "acc": 61.2
    },
    "flow": {
     "n": 62,
     "acc": 79.0
    }
   },
   "graded": 1374
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2698,
    "diana": 0.2725,
    "nova": 0.2061,
    "flow": 0.2516
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 50.6
    },
    "diana": {
     "n": 92,
     "acc": 51.1
    },
    "nova": {
     "n": 44,
     "acc": 38.6
    },
    "flow": {
     "n": 53,
     "acc": 47.2
    }
   },
   "graded": 276
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2771,
    "diana": 0.1914,
    "nova": 0.277,
    "flow": 0.2546
   },
   "acc": {
    "taro": {
     "n": 272,
     "acc": 54.4
    },
    "diana": {
     "n": 290,
     "acc": 37.6
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
   "graded": 760
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2569,
    "diana": 0.2313,
    "nova": 0.2306,
    "flow": 0.2812
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 45.7
    },
    "diana": {
     "n": 124,
     "acc": 41.1
    },
    "nova": {
     "n": 100,
     "acc": 41.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 386
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
    "taro": 0.2484,
    "diana": 0.1811,
    "nova": 0.2941,
    "flow": 0.2764
   },
   "acc": {
    "taro": {
     "n": 187,
     "acc": 44.9
    },
    "diana": {
     "n": 232,
     "acc": 32.8
    },
    "nova": {
     "n": 141,
     "acc": 53.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 560
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
    "taro": 0.1998,
    "diana": 0.3055,
    "nova": 0.1991,
    "flow": 0.2955
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 33.8
    },
    "diana": {
     "n": 207,
     "acc": 51.7
    },
    "nova": {
     "n": 95,
     "acc": 33.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 444
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
