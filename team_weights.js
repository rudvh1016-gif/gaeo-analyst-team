// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-30 14:53",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2814,
   "diana": 0.1963,
   "nova": 0.2678,
   "flow": 0.2546
  },
  "acc": {
   "taro": {
    "n": 6356,
    "acc": 61.4
   },
   "diana": {
    "n": 5772,
    "acc": 42.8
   },
   "nova": {
    "n": 4992,
    "acc": 58.4
   },
   "flow": {
    "n": 1107,
    "acc": 55.6
   }
  },
  "graded": 18227,
  "team": {
   "hit": 4964,
   "miss": 1264,
   "n": 6228,
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
    "taro": 0.2484,
    "diana": 0.2298,
    "nova": 0.2458,
    "flow": 0.276
   },
   "acc": {
    "taro": {
     "n": 315,
     "acc": 53.3
    },
    "diana": {
     "n": 302,
     "acc": 49.3
    },
    "nova": {
     "n": 271,
     "acc": 52.8
    },
    "flow": {
     "n": 54,
     "acc": 59.3
    }
   },
   "graded": 942
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
    "taro": 0.2462,
    "diana": 0.2456,
    "nova": 0.2706,
    "flow": 0.2376
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 51.8
    },
    "diana": {
     "n": 265,
     "acc": 51.7
    },
    "nova": {
     "n": 223,
     "acc": 57.0
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
    "taro": 0.2633,
    "diana": 0.257,
    "nova": 0.2541,
    "flow": 0.2256
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 54.5
    },
    "diana": {
     "n": 111,
     "acc": 53.2
    },
    "nova": {
     "n": 78,
     "acc": 52.6
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
    "taro": 0.2759,
    "diana": 0.2281,
    "nova": 0.2625,
    "flow": 0.2334
   },
   "acc": {
    "taro": {
     "n": 810,
     "acc": 65.7
    },
    "diana": {
     "n": 698,
     "acc": 54.3
    },
    "nova": {
     "n": 653,
     "acc": 62.5
    },
    "flow": {
     "n": 108,
     "acc": 55.6
    }
   },
   "graded": 2269
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
    "taro": 0.2717,
    "diana": 0.1778,
    "nova": 0.247,
    "flow": 0.3034
   },
   "acc": {
    "taro": {
     "n": 460,
     "acc": 67.2
    },
    "diana": {
     "n": 480,
     "acc": 44.0
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
   "graded": 1377
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
    "taro": 0.2774,
    "diana": 0.1921,
    "nova": 0.2764,
    "flow": 0.2541
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 54.6
    },
    "diana": {
     "n": 291,
     "acc": 37.8
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
    "taro": 0.2609,
    "diana": 0.2318,
    "nova": 0.2254,
    "flow": 0.2818
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 46.3
    },
    "diana": {
     "n": 124,
     "acc": 41.1
    },
    "nova": {
     "n": 100,
     "acc": 40.0
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
    "taro": 0.2492,
    "diana": 0.1792,
    "nova": 0.2956,
    "flow": 0.2759
   },
   "acc": {
    "taro": {
     "n": 186,
     "acc": 45.2
    },
    "diana": {
     "n": 231,
     "acc": 32.5
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
    "taro": 0.2015,
    "diana": 0.3074,
    "nova": 0.1952,
    "flow": 0.2959
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 34.0
    },
    "diana": {
     "n": 206,
     "acc": 51.9
    },
    "nova": {
     "n": 94,
     "acc": 33.0
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
