// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-30 09:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2814,
   "diana": 0.1955,
   "nova": 0.2691,
   "flow": 0.2539
  },
  "acc": {
   "taro": {
    "n": 6361,
    "acc": 61.3
   },
   "diana": {
    "n": 5776,
    "acc": 42.6
   },
   "nova": {
    "n": 4999,
    "acc": 58.6
   },
   "flow": {
    "n": 1108,
    "acc": 55.3
   }
  },
  "graded": 18244,
  "team": {
   "hit": 4947,
   "miss": 1266,
   "n": 6213,
   "acc": 79.6
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
    "taro": 0.2636,
    "diana": 0.1963,
    "nova": 0.2581,
    "flow": 0.282
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
     "n": 33,
     "acc": 63.6
    }
   },
   "graded": 319
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2463,
    "diana": 0.2439,
    "nova": 0.2705,
    "flow": 0.2394
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 51.4
    },
    "diana": {
     "n": 265,
     "acc": 50.9
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
    "taro": 0.2599,
    "diana": 0.2532,
    "nova": 0.2606,
    "flow": 0.2263
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 53.6
    },
    "diana": {
     "n": 113,
     "acc": 52.2
    },
    "nova": {
     "n": 80,
     "acc": 53.8
    },
    "flow": {
     "n": 30,
     "acc": 46.7
    }
   },
   "graded": 348
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2754,
    "diana": 0.2284,
    "nova": 0.2646,
    "flow": 0.2316
   },
   "acc": {
    "taro": {
     "n": 811,
     "acc": 65.5
    },
    "diana": {
     "n": 700,
     "acc": 54.3
    },
    "nova": {
     "n": 655,
     "acc": 62.9
    },
    "flow": {
     "n": 109,
     "acc": 55.0
    }
   },
   "graded": 2275
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.2235,
    "nova": 0.3122,
    "flow": 0.1588
   },
   "acc": {
    "taro": {
     "n": 367,
     "acc": 58.3
    },
    "diana": {
     "n": 415,
     "acc": 42.7
    },
    "nova": {
     "n": 292,
     "acc": 59.6
    },
    "flow": {
     "n": 33,
     "acc": 30.3
    }
   },
   "graded": 1107
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
    "taro": 0.2718,
    "diana": 0.1776,
    "nova": 0.2475,
    "flow": 0.3031
   },
   "acc": {
    "taro": {
     "n": 458,
     "acc": 67.2
    },
    "diana": {
     "n": 478,
     "acc": 43.9
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
   "graded": 1372
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
    "taro": 0.2757,
    "diana": 0.1922,
    "nova": 0.2779,
    "flow": 0.2542
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 54.2
    },
    "diana": {
     "n": 291,
     "acc": 37.8
    },
    "nova": {
     "n": 183,
     "acc": 54.6
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 763
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
    "taro": 0.3076,
    "diana": 0.1706,
    "nova": 0.3134,
    "flow": 0.2084
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 59.0
    },
    "diana": {
     "n": 171,
     "acc": 32.7
    },
    "nova": {
     "n": 138,
     "acc": 60.1
    },
    "flow": {
     "n": 60,
     "acc": 40.0
    }
   },
   "graded": 557
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2546,
    "diana": 0.17,
    "nova": 0.3004,
    "flow": 0.275
   },
   "acc": {
    "taro": {
     "n": 188,
     "acc": 46.3
    },
    "diana": {
     "n": 233,
     "acc": 30.9
    },
    "nova": {
     "n": 141,
     "acc": 54.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 562
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
    "taro": 0.2033,
    "diana": 0.3017,
    "nova": 0.2005,
    "flow": 0.2945
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 34.5
    },
    "diana": {
     "n": 205,
     "acc": 51.2
    },
    "nova": {
     "n": 94,
     "acc": 34.0
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
