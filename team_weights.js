// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 12:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2798,
   "diana": 0.2009,
   "nova": 0.2607,
   "flow": 0.2585
  },
  "acc": {
   "taro": {
    "n": 5997,
    "acc": 60.8
   },
   "diana": {
    "n": 5421,
    "acc": 43.7
   },
   "nova": {
    "n": 4558,
    "acc": 56.7
   },
   "flow": {
    "n": 1039,
    "acc": 56.2
   }
  },
  "graded": 17015,
  "team": {
   "hit": 4654,
   "miss": 1242,
   "n": 5896,
   "acc": 78.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1834,
    "nova": 0.2358,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 714,
     "acc": 64.4
    },
    "diana": {
     "n": 467,
     "acc": 42.2
    },
    "nova": {
     "n": 614,
     "acc": 54.2
    },
    "flow": {
     "n": 240,
     "acc": 69.2
    }
   },
   "graded": 2035
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.1608,
    "nova": 0.2591,
    "flow": 0.2761
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 74.7
    },
    "diana": {
     "n": 220,
     "acc": 39.5
    },
    "nova": {
     "n": 292,
     "acc": 63.7
    },
    "flow": {
     "n": 109,
     "acc": 67.9
    }
   },
   "graded": 977
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2466,
    "diana": 0.2259,
    "nova": 0.2231,
    "flow": 0.3045
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 54.6
    },
    "diana": {
     "n": 282,
     "acc": 50.0
    },
    "nova": {
     "n": 243,
     "acc": 49.4
    },
    "flow": {
     "n": 46,
     "acc": 67.4
    }
   },
   "graded": 866
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3352,
    "diana": 0.1649,
    "nova": 0.3315,
    "flow": 0.1684
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 62.9
    },
    "diana": {
     "n": 262,
     "acc": 30.9
    },
    "nova": {
     "n": 177,
     "acc": 62.1
    },
    "flow": {
     "n": 57,
     "acc": 31.6
    }
   },
   "graded": 741
  },
  "통신": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.2102,
    "nova": 0.2705,
    "flow": 0.2388
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 58.7
    },
    "diana": {
     "n": 75,
     "acc": 44.0
    },
    "nova": {
     "n": 83,
     "acc": 56.6
    },
    "flow": {
     "n": 29,
     "acc": 65.5
    }
   },
   "graded": 296
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2495,
    "diana": 0.2518,
    "nova": 0.2594,
    "flow": 0.2394
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 52.1
    },
    "diana": {
     "n": 251,
     "acc": 52.6
    },
    "nova": {
     "n": 203,
     "acc": 54.2
    },
    "flow": {
     "n": 25,
     "acc": 60.0
    }
   },
   "graded": 740
  },
  "금융·증권": {
   "weights": {
    "taro": 0.323,
    "diana": 0.1667,
    "nova": 0.3079,
    "flow": 0.2025
   },
   "acc": {
    "taro": {
     "n": 344,
     "acc": 58.1
    },
    "diana": {
     "n": 378,
     "acc": 28.6
    },
    "nova": {
     "n": 231,
     "acc": 55.4
    },
    "flow": {
     "n": 118,
     "acc": 36.4
    }
   },
   "graded": 1071
  },
  "2차전지": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1966,
    "nova": 0.2998,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 323,
     "acc": 80.8
    },
    "diana": {
     "n": 207,
     "acc": 48.8
    },
    "nova": {
     "n": 262,
     "acc": 74.4
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 794
  },
  "보험": {
   "weights": {
    "taro": 0.2621,
    "diana": 0.2692,
    "nova": 0.2291,
    "flow": 0.2396
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 54.7
    },
    "diana": {
     "n": 105,
     "acc": 56.2
    },
    "nova": {
     "n": 69,
     "acc": 47.8
    },
    "flow": {
     "n": 29,
     "acc": 48.3
    }
   },
   "graded": 320
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.2309,
    "nova": 0.2624,
    "flow": 0.2342
   },
   "acc": {
    "taro": {
     "n": 767,
     "acc": 64.4
    },
    "diana": {
     "n": 658,
     "acc": 54.6
    },
    "nova": {
     "n": 603,
     "acc": 62.0
    },
    "flow": {
     "n": 103,
     "acc": 55.3
    }
   },
   "graded": 2131
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3076,
    "diana": 0.2328,
    "nova": 0.2914,
    "flow": 0.1683
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 59.0
    },
    "diana": {
     "n": 390,
     "acc": 44.6
    },
    "nova": {
     "n": 265,
     "acc": 55.8
    },
    "flow": {
     "n": 31,
     "acc": 32.3
    }
   },
   "graded": 1032
  },
  "조선": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.2105,
    "nova": 0.2465,
    "flow": 0.2625
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 53.4
    },
    "diana": {
     "n": 207,
     "acc": 40.1
    },
    "nova": {
     "n": 164,
     "acc": 47.0
    },
    "flow": {
     "n": 21,
     "acc": 52.4
    }
   },
   "graded": 596
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3117,
    "diana": 0.1804,
    "nova": 0.2681,
    "flow": 0.2399
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 65.0
    },
    "diana": {
     "n": 133,
     "acc": 37.6
    },
    "nova": {
     "n": 102,
     "acc": 55.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 372
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2747,
    "diana": 0.1836,
    "nova": 0.2393,
    "flow": 0.3024
   },
   "acc": {
    "taro": {
     "n": 433,
     "acc": 68.1
    },
    "diana": {
     "n": 448,
     "acc": 45.5
    },
    "nova": {
     "n": 342,
     "acc": 59.4
    },
    "flow": {
     "n": 60,
     "acc": 80.0
    }
   },
   "graded": 1283
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2845,
    "diana": 0.2868,
    "nova": 0.1627,
    "flow": 0.2659
   },
   "acc": {
    "taro": {
     "n": 82,
     "acc": 52.4
    },
    "diana": {
     "n": 87,
     "acc": 52.9
    },
    "nova": {
     "n": 39,
     "acc": 28.2
    },
    "flow": {
     "n": 51,
     "acc": 49.0
    }
   },
   "graded": 259
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2813,
    "diana": 0.1981,
    "nova": 0.2642,
    "flow": 0.2564
   },
   "acc": {
    "taro": {
     "n": 257,
     "acc": 54.9
    },
    "diana": {
     "n": 277,
     "acc": 38.6
    },
    "nova": {
     "n": 165,
     "acc": 51.5
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 715
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2491,
    "diana": 0.2325,
    "nova": 0.2339,
    "flow": 0.2845
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 43.8
    },
    "diana": {
     "n": 115,
     "acc": 40.9
    },
    "nova": {
     "n": 90,
     "acc": 41.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 358
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3076,
    "diana": 0.1794,
    "nova": 0.2894,
    "flow": 0.2237
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 60.0
    },
    "diana": {
     "n": 160,
     "acc": 35.0
    },
    "nova": {
     "n": 124,
     "acc": 56.5
    },
    "flow": {
     "n": 55,
     "acc": 43.6
    }
   },
   "graded": 514
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2457,
    "diana": 0.1774,
    "nova": 0.298,
    "flow": 0.2788
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 44.1
    },
    "diana": {
     "n": 220,
     "acc": 31.8
    },
    "nova": {
     "n": 131,
     "acc": 53.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 528
  },
  "로봇": {
   "weights": {
    "taro": 0.2631,
    "diana": 0.2714,
    "nova": 0.2702,
    "flow": 0.1953
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 67.4
    },
    "diana": {
     "n": 118,
     "acc": 69.5
    },
    "nova": {
     "n": 120,
     "acc": 69.2
    },
    "flow": {
     "n": 19,
     "acc": 36.8
    }
   },
   "graded": 401
  },
  "식음료": {
   "weights": {
    "taro": 0.1965,
    "diana": 0.3041,
    "nova": 0.1952,
    "flow": 0.3041
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 32.3
    },
    "diana": {
     "n": 194,
     "acc": 50.0
    },
    "nova": {
     "n": 81,
     "acc": 32.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 405
  },
  "여행레저": {
   "weights": {
    "taro": 0.3077,
    "diana": 0.1545,
    "nova": 0.2802,
    "flow": 0.2576
   },
   "acc": {
    "taro": {
     "n": 77,
     "acc": 59.7
    },
    "diana": {
     "n": 63,
     "acc": 23.8
    },
    "nova": {
     "n": 57,
     "acc": 54.4
    },
    "flow": {
     "n": 27,
     "acc": 25.9
    }
   },
   "graded": 224
  }
 }
};
