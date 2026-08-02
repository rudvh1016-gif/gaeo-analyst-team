// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 16:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2826,
   "diana": 0.1935,
   "nova": 0.2696,
   "flow": 0.2543
  },
  "acc": {
   "taro": {
    "n": 6712,
    "acc": 61.7
   },
   "diana": {
    "n": 6103,
    "acc": 42.2
   },
   "nova": {
    "n": 5374,
    "acc": 58.8
   },
   "flow": {
    "n": 1168,
    "acc": 55.5
   }
  },
  "graded": 19357,
  "team": {
   "hit": 5291,
   "miss": 1312,
   "n": 6603,
   "acc": 80.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2931,
    "diana": 0.177,
    "nova": 0.2269,
    "flow": 0.303
   },
   "acc": {
    "taro": {
     "n": 813,
     "acc": 67.5
    },
    "diana": {
     "n": 532,
     "acc": 40.8
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
   "graded": 2310
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
    "taro": 0.2529,
    "diana": 0.2301,
    "nova": 0.2618,
    "flow": 0.2552
   },
   "acc": {
    "taro": {
     "n": 333,
     "acc": 53.8
    },
    "diana": {
     "n": 317,
     "acc": 48.9
    },
    "nova": {
     "n": 293,
     "acc": 55.6
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
    "taro": 0.3336,
    "diana": 0.1596,
    "nova": 0.3463,
    "flow": 0.1605
   },
   "acc": {
    "taro": {
     "n": 268,
     "acc": 62.7
    },
    "diana": {
     "n": 297,
     "acc": 29.3
    },
    "nova": {
     "n": 209,
     "acc": 65.1
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 837
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
    "taro": 0.2359,
    "diana": 0.2337,
    "nova": 0.2628,
    "flow": 0.2676
   },
   "acc": {
    "taro": {
     "n": 293,
     "acc": 51.2
    },
    "diana": {
     "n": 278,
     "acc": 50.7
    },
    "nova": {
     "n": 242,
     "acc": 57.0
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 844
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3222,
    "diana": 0.1642,
    "nova": 0.3157,
    "flow": 0.1978
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 58.9
    },
    "diana": {
     "n": 430,
     "acc": 26.3
    },
    "nova": {
     "n": 274,
     "acc": 57.7
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1207
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
     "n": 362,
     "acc": 82.3
    },
    "diana": {
     "n": 232,
     "acc": 48.3
    },
    "nova": {
     "n": 302,
     "acc": 75.5
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 898
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
    "taro": 0.2771,
    "diana": 0.2251,
    "nova": 0.2596,
    "flow": 0.2382
   },
   "acc": {
    "taro": {
     "n": 853,
     "acc": 66.5
    },
    "diana": {
     "n": 737,
     "acc": 54.0
    },
    "nova": {
     "n": 700,
     "acc": 62.3
    },
    "flow": {
     "n": 112,
     "acc": 57.1
    }
   },
   "graded": 2402
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.2196,
    "nova": 0.3212,
    "flow": 0.1565
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 58.0
    },
    "diana": {
     "n": 437,
     "acc": 42.1
    },
    "nova": {
     "n": 315,
     "acc": 61.6
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1173
  },
  "조선": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.1887,
    "nova": 0.2788,
    "flow": 0.2576
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 53.4
    },
    "diana": {
     "n": 232,
     "acc": 36.6
    },
    "nova": {
     "n": 194,
     "acc": 54.1
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 676
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
    "taro": 0.3019,
    "diana": 0.1711,
    "nova": 0.2882,
    "flow": 0.2389
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 63.2
    },
    "diana": {
     "n": 148,
     "acc": 35.8
    },
    "nova": {
     "n": 121,
     "acc": 60.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 413
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2688,
    "diana": 0.1721,
    "nova": 0.2558,
    "flow": 0.3033
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 66.5
    },
    "diana": {
     "n": 510,
     "acc": 42.5
    },
    "nova": {
     "n": 408,
     "acc": 63.2
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
    "taro": 0.2609,
    "diana": 0.2667,
    "nova": 0.2197,
    "flow": 0.2527
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 48.9
    },
    "diana": {
     "n": 98,
     "acc": 50.0
    },
    "nova": {
     "n": 51,
     "acc": 41.2
    },
    "flow": {
     "n": 57,
     "acc": 47.4
    }
   },
   "graded": 298
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.1902,
    "nova": 0.2763,
    "flow": 0.2544
   },
   "acc": {
    "taro": {
     "n": 288,
     "acc": 54.9
    },
    "diana": {
     "n": 305,
     "acc": 37.4
    },
    "nova": {
     "n": 197,
     "acc": 54.3
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 806
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
    "taro": 0.2482,
    "diana": 0.1878,
    "nova": 0.2891,
    "flow": 0.275
   },
   "acc": {
    "taro": {
     "n": 195,
     "acc": 45.1
    },
    "diana": {
     "n": 246,
     "acc": 34.1
    },
    "nova": {
     "n": 156,
     "acc": 52.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 597
  },
  "로봇": {
   "weights": {
    "taro": 0.2638,
    "diana": 0.2741,
    "nova": 0.2709,
    "flow": 0.1913
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 68.9
    },
    "diana": {
     "n": 134,
     "acc": 71.6
    },
    "nova": {
     "n": 137,
     "acc": 70.8
    },
    "flow": {
     "n": 29,
     "acc": 51.7
    }
   },
   "graded": 461
  },
  "식음료": {
   "weights": {
    "taro": 0.2001,
    "diana": 0.3027,
    "nova": 0.2067,
    "flow": 0.2905
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 34.4
    },
    "diana": {
     "n": 215,
     "acc": 52.1
    },
    "nova": {
     "n": 104,
     "acc": 35.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 470
  },
  "여행레저": {
   "weights": {
    "taro": 0.3585,
    "diana": 0.1661,
    "nova": 0.3093,
    "flow": 0.1661
   },
   "acc": {
    "taro": {
     "n": 88,
     "acc": 64.8
    },
    "diana": {
     "n": 72,
     "acc": 23.6
    },
    "nova": {
     "n": 68,
     "acc": 55.9
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 259
  }
 }
};
