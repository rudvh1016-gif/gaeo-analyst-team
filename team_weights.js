// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 15:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2826,
   "diana": 0.1934,
   "nova": 0.2698,
   "flow": 0.2541
  },
  "acc": {
   "taro": {
    "n": 6715,
    "acc": 61.6
   },
   "diana": {
    "n": 6106,
    "acc": 42.2
   },
   "nova": {
    "n": 5378,
    "acc": 58.8
   },
   "flow": {
    "n": 1168,
    "acc": 55.4
   }
  },
  "graded": 19367,
  "team": {
   "hit": 5293,
   "miss": 1312,
   "n": 6605,
   "acc": 80.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.1771,
    "nova": 0.2266,
    "flow": 0.303
   },
   "acc": {
    "taro": {
     "n": 814,
     "acc": 67.6
    },
    "diana": {
     "n": 532,
     "acc": 40.8
    },
    "nova": {
     "n": 701,
     "acc": 52.2
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
    "taro": 0.3342,
    "diana": 0.1593,
    "nova": 0.3464,
    "flow": 0.1602
   },
   "acc": {
    "taro": {
     "n": 267,
     "acc": 62.9
    },
    "diana": {
     "n": 295,
     "acc": 28.8
    },
    "nova": {
     "n": 207,
     "acc": 65.2
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 832
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
    "taro": 0.278,
    "diana": 0.2248,
    "nova": 0.2604,
    "flow": 0.2367
   },
   "acc": {
    "taro": {
     "n": 854,
     "acc": 66.5
    },
    "diana": {
     "n": 740,
     "acc": 53.8
    },
    "nova": {
     "n": 703,
     "acc": 62.3
    },
    "flow": {
     "n": 113,
     "acc": 56.6
    }
   },
   "graded": 2410
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.2193,
    "nova": 0.3212,
    "flow": 0.1568
   },
   "acc": {
    "taro": {
     "n": 385,
     "acc": 57.9
    },
    "diana": {
     "n": 436,
     "acc": 42.0
    },
    "nova": {
     "n": 314,
     "acc": 61.5
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1170
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
    "taro": 0.269,
    "diana": 0.1719,
    "nova": 0.2559,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 487,
     "acc": 66.5
    },
    "diana": {
     "n": 508,
     "acc": 42.5
    },
    "nova": {
     "n": 406,
     "acc": 63.3
    },
    "flow": {
     "n": 67,
     "acc": 77.6
    }
   },
   "graded": 1468
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
    "taro": 0.2777,
    "diana": 0.1909,
    "nova": 0.2766,
    "flow": 0.2548
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 54.5
    },
    "diana": {
     "n": 307,
     "acc": 37.5
    },
    "nova": {
     "n": 199,
     "acc": 54.3
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
    "taro": 0.1986,
    "diana": 0.3044,
    "nova": 0.2084,
    "flow": 0.2886
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 34.4
    },
    "diana": {
     "n": 218,
     "acc": 52.8
    },
    "nova": {
     "n": 108,
     "acc": 36.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 480
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
