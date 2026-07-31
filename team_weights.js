// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 10:55",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2828,
   "diana": 0.192,
   "nova": 0.2708,
   "flow": 0.2544
  },
  "acc": {
   "taro": {
    "n": 6724,
    "acc": 61.9
   },
   "diana": {
    "n": 6116,
    "acc": 42.0
   },
   "nova": {
    "n": 5387,
    "acc": 59.2
   },
   "flow": {
    "n": 1168,
    "acc": 55.7
   }
  },
  "graded": 19395,
  "team": {
   "hit": 5288,
   "miss": 1296,
   "n": 6584,
   "acc": 80.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2951,
    "diana": 0.1767,
    "nova": 0.2253,
    "flow": 0.3028
   },
   "acc": {
    "taro": {
     "n": 814,
     "acc": 68.3
    },
    "diana": {
     "n": 533,
     "acc": 40.9
    },
    "nova": {
     "n": 700,
     "acc": 52.1
    },
    "flow": {
     "n": 264,
     "acc": 70.1
    }
   },
   "graded": 2311
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.152,
    "nova": 0.2627,
    "flow": 0.2791
   },
   "acc": {
    "taro": {
     "n": 399,
     "acc": 77.4
    },
    "diana": {
     "n": 247,
     "acc": 37.2
    },
    "nova": {
     "n": 331,
     "acc": 64.4
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
    "taro": 0.3316,
    "diana": 0.1587,
    "nova": 0.3501,
    "flow": 0.1595
   },
   "acc": {
    "taro": {
     "n": 268,
     "acc": 62.7
    },
    "diana": {
     "n": 297,
     "acc": 27.9
    },
    "nova": {
     "n": 210,
     "acc": 66.2
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 838
  },
  "통신": {
   "weights": {
    "taro": 0.2624,
    "diana": 0.1911,
    "nova": 0.2612,
    "flow": 0.2854
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 60.5
    },
    "diana": {
     "n": 84,
     "acc": 44.0
    },
    "nova": {
     "n": 98,
     "acc": 60.2
    },
    "flow": {
     "n": 38,
     "acc": 65.8
    }
   },
   "graded": 344
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2329,
    "diana": 0.2298,
    "nova": 0.2695,
    "flow": 0.2678
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 50.5
    },
    "diana": {
     "n": 281,
     "acc": 49.8
    },
    "nova": {
     "n": 243,
     "acc": 58.4
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 850
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3243,
    "diana": 0.164,
    "nova": 0.3141,
    "flow": 0.1975
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 59.3
    },
    "diana": {
     "n": 432,
     "acc": 26.2
    },
    "nova": {
     "n": 275,
     "acc": 57.5
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1212
  },
  "2차전지": {
   "weights": {
    "taro": 0.3018,
    "diana": 0.1951,
    "nova": 0.3018,
    "flow": 0.2012
   },
   "acc": {
    "taro": {
     "n": 361,
     "acc": 82.8
    },
    "diana": {
     "n": 231,
     "acc": 48.5
    },
    "nova": {
     "n": 301,
     "acc": 76.1
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 895
  },
  "보험": {
   "weights": {
    "taro": 0.2602,
    "diana": 0.2474,
    "nova": 0.2707,
    "flow": 0.2216
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 53.0
    },
    "diana": {
     "n": 119,
     "acc": 50.4
    },
    "nova": {
     "n": 87,
     "acc": 55.2
    },
    "flow": {
     "n": 31,
     "acc": 45.2
    }
   },
   "graded": 369
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2766,
    "diana": 0.2243,
    "nova": 0.2605,
    "flow": 0.2387
   },
   "acc": {
    "taro": {
     "n": 855,
     "acc": 66.7
    },
    "diana": {
     "n": 740,
     "acc": 54.1
    },
    "nova": {
     "n": 704,
     "acc": 62.8
    },
    "flow": {
     "n": 113,
     "acc": 57.5
    }
   },
   "graded": 2412
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.2182,
    "nova": 0.3216,
    "flow": 0.1564
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 58.3
    },
    "diana": {
     "n": 437,
     "acc": 41.9
    },
    "nova": {
     "n": 316,
     "acc": 61.7
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1174
  },
  "조선": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.1862,
    "nova": 0.281,
    "flow": 0.2572
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 53.6
    },
    "diana": {
     "n": 232,
     "acc": 36.2
    },
    "nova": {
     "n": 194,
     "acc": 54.6
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 677
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
    "taro": 0.3021,
    "diana": 0.1619,
    "nova": 0.298,
    "flow": 0.238
   },
   "acc": {
    "taro": {
     "n": 145,
     "acc": 63.4
    },
    "diana": {
     "n": 150,
     "acc": 34.0
    },
    "nova": {
     "n": 123,
     "acc": 62.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 418
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2691,
    "diana": 0.171,
    "nova": 0.2568,
    "flow": 0.3031
   },
   "acc": {
    "taro": {
     "n": 488,
     "acc": 66.6
    },
    "diana": {
     "n": 508,
     "acc": 42.3
    },
    "nova": {
     "n": 406,
     "acc": 63.5
    },
    "flow": {
     "n": 67,
     "acc": 77.6
    }
   },
   "graded": 1469
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
    "diana": 0.1892,
    "nova": 0.276,
    "flow": 0.2556
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 54.6
    },
    "diana": {
     "n": 308,
     "acc": 37.0
    },
    "nova": {
     "n": 200,
     "acc": 54.0
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 815
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2651,
    "diana": 0.2301,
    "nova": 0.2215,
    "flow": 0.2833
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 46.8
    },
    "diana": {
     "n": 133,
     "acc": 40.6
    },
    "nova": {
     "n": 110,
     "acc": 39.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 414
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
    "taro": 0.2455,
    "diana": 0.1877,
    "nova": 0.2931,
    "flow": 0.2737
   },
   "acc": {
    "taro": {
     "n": 194,
     "acc": 44.8
    },
    "diana": {
     "n": 245,
     "acc": 34.3
    },
    "nova": {
     "n": 155,
     "acc": 53.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 594
  },
  "로봇": {
   "weights": {
    "taro": 0.2652,
    "diana": 0.2738,
    "nova": 0.2733,
    "flow": 0.1877
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 70.6
    },
    "diana": {
     "n": 133,
     "acc": 72.9
    },
    "nova": {
     "n": 136,
     "acc": 72.8
    },
    "flow": {
     "n": 29,
     "acc": 55.2
    }
   },
   "graded": 458
  },
  "식음료": {
   "weights": {
    "taro": 0.2043,
    "diana": 0.3041,
    "nova": 0.2021,
    "flow": 0.2895
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 35.3
    },
    "diana": {
     "n": 217,
     "acc": 52.5
    },
    "nova": {
     "n": 106,
     "acc": 34.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 476
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
