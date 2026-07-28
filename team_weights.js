// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 12:42",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2721,
   "diana": 0.2057,
   "nova": 0.2656,
   "flow": 0.2565
  },
  "acc": {
   "taro": {
    "n": 5600,
    "acc": 59.6
   },
   "diana": {
    "n": 5058,
    "acc": 45.0
   },
   "nova": {
    "n": 4214,
    "acc": 58.1
   },
   "flow": {
    "n": 976,
    "acc": 56.1
   }
  },
  "graded": 15848
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.1881,
    "nova": 0.2449,
    "flow": 0.2972
   },
   "acc": {
    "taro": {
     "n": 665,
     "acc": 62.1
    },
    "diana": {
     "n": 434,
     "acc": 43.3
    },
    "nova": {
     "n": 571,
     "acc": 56.4
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1895
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2947,
    "diana": 0.1661,
    "nova": 0.2696,
    "flow": 0.2696
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 72.9
    },
    "diana": {
     "n": 207,
     "acc": 41.1
    },
    "nova": {
     "n": 270,
     "acc": 66.7
    },
    "flow": {
     "n": 102,
     "acc": 66.7
    }
   },
   "graded": 907
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2408,
    "diana": 0.2322,
    "nova": 0.2137,
    "flow": 0.3133
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 53.6
    },
    "diana": {
     "n": 265,
     "acc": 51.7
    },
    "nova": {
     "n": 227,
     "acc": 47.6
    },
    "flow": {
     "n": 43,
     "acc": 69.8
    }
   },
   "graded": 811
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.329,
    "diana": 0.178,
    "nova": 0.3152,
    "flow": 0.1777
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 62.9
    },
    "diana": {
     "n": 241,
     "acc": 34.0
    },
    "nova": {
     "n": 161,
     "acc": 60.2
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 684
  },
  "통신": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.2106,
    "nova": 0.2709,
    "flow": 0.2378
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 59.0
    },
    "diana": {
     "n": 70,
     "acc": 44.3
    },
    "nova": {
     "n": 79,
     "acc": 57.0
    },
    "flow": {
     "n": 27,
     "acc": 66.7
    }
   },
   "graded": 276
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2483,
    "diana": 0.2619,
    "nova": 0.2513,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 52.0
    },
    "diana": {
     "n": 235,
     "acc": 54.9
    },
    "nova": {
     "n": 186,
     "acc": 52.7
    },
    "flow": {
     "n": 24,
     "acc": 58.3
    }
   },
   "graded": 689
  },
  "금융·증권": {
   "weights": {
    "taro": 0.304,
    "diana": 0.1658,
    "nova": 0.3287,
    "flow": 0.2015
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 55.9
    },
    "diana": {
     "n": 354,
     "acc": 30.5
    },
    "nova": {
     "n": 210,
     "acc": 60.5
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 1000
  },
  "2차전지": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1975,
    "nova": 0.3009,
    "flow": 0.2006
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 79.4
    },
    "diana": {
     "n": 193,
     "acc": 49.2
    },
    "nova": {
     "n": 244,
     "acc": 79.9
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 740
  },
  "보험": {
   "weights": {
    "taro": 0.2595,
    "diana": 0.2852,
    "nova": 0.2217,
    "flow": 0.2336
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 55.6
    },
    "diana": {
     "n": 95,
     "acc": 61.1
    },
    "nova": {
     "n": 59,
     "acc": 47.5
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 289
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2658,
    "diana": 0.2282,
    "nova": 0.2777,
    "flow": 0.2283
   },
   "acc": {
    "taro": {
     "n": 715,
     "acc": 63.6
    },
    "diana": {
     "n": 617,
     "acc": 54.6
    },
    "nova": {
     "n": 555,
     "acc": 66.5
    },
    "flow": {
     "n": 97,
     "acc": 54.6
    }
   },
   "graded": 1984
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.2264,
    "nova": 0.2586,
    "flow": 0.2389
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 57.8
    },
    "diana": {
     "n": 363,
     "acc": 47.4
    },
    "nova": {
     "n": 242,
     "acc": 54.1
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 961
  },
  "조선": {
   "weights": {
    "taro": 0.2704,
    "diana": 0.2321,
    "nova": 0.2339,
    "flow": 0.2635
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 51.3
    },
    "diana": {
     "n": 193,
     "acc": 44.0
    },
    "nova": {
     "n": 151,
     "acc": 44.4
    },
    "flow": {
     "n": 17,
     "acc": 47.1
    }
   },
   "graded": 552
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.1875,
    "nova": 0.2711,
    "flow": 0.2372
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 64.1
    },
    "diana": {
     "n": 124,
     "acc": 39.5
    },
    "nova": {
     "n": 98,
     "acc": 57.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 353
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2666,
    "diana": 0.189,
    "nova": 0.2459,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 67.0
    },
    "diana": {
     "n": 417,
     "acc": 47.5
    },
    "nova": {
     "n": 314,
     "acc": 61.8
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1195
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2829,
    "diana": 0.2984,
    "nova": 0.1591,
    "flow": 0.2596
   },
   "acc": {
    "taro": {
     "n": 75,
     "acc": 53.3
    },
    "diana": {
     "n": 80,
     "acc": 56.2
    },
    "nova": {
     "n": 34,
     "acc": 23.5
    },
    "flow": {
     "n": 47,
     "acc": 48.9
    }
   },
   "graded": 236
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2716,
    "diana": 0.1988,
    "nova": 0.2743,
    "flow": 0.2554
   },
   "acc": {
    "taro": {
     "n": 237,
     "acc": 53.2
    },
    "diana": {
     "n": 257,
     "acc": 38.9
    },
    "nova": {
     "n": 149,
     "acc": 53.7
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 658
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2397,
    "diana": 0.2286,
    "nova": 0.2433,
    "flow": 0.2884
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 41.5
    },
    "diana": {
     "n": 106,
     "acc": 39.6
    },
    "nova": {
     "n": 83,
     "acc": 42.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 331
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2968,
    "diana": 0.1877,
    "nova": 0.2836,
    "flow": 0.232
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 59.0
    },
    "diana": {
     "n": 150,
     "acc": 37.3
    },
    "nova": {
     "n": 117,
     "acc": 56.4
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 485
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2358,
    "diana": 0.1798,
    "nova": 0.3025,
    "flow": 0.2819
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 41.8
    },
    "diana": {
     "n": 207,
     "acc": 31.9
    },
    "nova": {
     "n": 123,
     "acc": 53.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 495
  },
  "로봇": {
   "weights": {
    "taro": 0.2667,
    "diana": 0.2667,
    "nova": 0.2667,
    "flow": 0.2
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 66.7
    },
    "diana": {
     "n": 111,
     "acc": 66.7
    },
    "nova": {
     "n": 114,
     "acc": 66.7
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 375
  },
  "식음료": {
   "weights": {
    "taro": 0.1921,
    "diana": 0.2995,
    "nova": 0.1949,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 30.6
    },
    "diana": {
     "n": 180,
     "acc": 47.8
    },
    "nova": {
     "n": 74,
     "acc": 31.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 378
  },
  "여행레저": {
   "weights": {
    "taro": 0.3019,
    "diana": 0.1558,
    "nova": 0.2825,
    "flow": 0.2597
   },
   "acc": {
    "taro": {
     "n": 74,
     "acc": 58.1
    },
    "diana": {
     "n": 62,
     "acc": 24.2
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
   "graded": 220
  }
 }
};
