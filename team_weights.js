// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 13:54",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2825,
   "diana": 0.1921,
   "nova": 0.2708,
   "flow": 0.2545
  },
  "acc": {
   "taro": {
    "n": 6724,
    "acc": 61.7
   },
   "diana": {
    "n": 6113,
    "acc": 41.9
   },
   "nova": {
    "n": 5386,
    "acc": 59.1
   },
   "flow": {
    "n": 1168,
    "acc": 55.6
   }
  },
  "graded": 19391,
  "team": {
   "hit": 5296,
   "miss": 1305,
   "n": 6601,
   "acc": 80.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2939,
    "diana": 0.177,
    "nova": 0.2262,
    "flow": 0.3029
   },
   "acc": {
    "taro": {
     "n": 815,
     "acc": 67.7
    },
    "diana": {
     "n": 532,
     "acc": 40.8
    },
    "nova": {
     "n": 702,
     "acc": 52.1
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2314
  },
  "전자·부품": {
   "weights": {
    "taro": 0.306,
    "diana": 0.1532,
    "nova": 0.2617,
    "flow": 0.279
   },
   "acc": {
    "taro": {
     "n": 397,
     "acc": 77.3
    },
    "diana": {
     "n": 245,
     "acc": 37.6
    },
    "nova": {
     "n": 329,
     "acc": 64.1
    },
    "flow": {
     "n": 117,
     "acc": 68.4
    }
   },
   "graded": 1088
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
    "taro": 0.3329,
    "diana": 0.159,
    "nova": 0.3483,
    "flow": 0.1598
   },
   "acc": {
    "taro": {
     "n": 269,
     "acc": 62.8
    },
    "diana": {
     "n": 297,
     "acc": 27.9
    },
    "nova": {
     "n": 210,
     "acc": 65.7
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 839
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
    "taro": 0.2334,
    "diana": 0.2319,
    "nova": 0.2672,
    "flow": 0.2674
   },
   "acc": {
    "taro": {
     "n": 294,
     "acc": 50.7
    },
    "diana": {
     "n": 280,
     "acc": 50.4
    },
    "nova": {
     "n": 243,
     "acc": 58.0
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 848
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3235,
    "diana": 0.164,
    "nova": 0.3149,
    "flow": 0.1975
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
     "n": 276,
     "acc": 57.6
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1215
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
     "n": 362,
     "acc": 82.6
    },
    "diana": {
     "n": 231,
     "acc": 48.5
    },
    "nova": {
     "n": 302,
     "acc": 75.8
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 897
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
    "taro": 0.2767,
    "diana": 0.224,
    "nova": 0.2603,
    "flow": 0.239
   },
   "acc": {
    "taro": {
     "n": 856,
     "acc": 66.6
    },
    "diana": {
     "n": 740,
     "acc": 53.9
    },
    "nova": {
     "n": 704,
     "acc": 62.6
    },
    "flow": {
     "n": 113,
     "acc": 57.5
    }
   },
   "graded": 2413
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.2174,
    "nova": 0.3226,
    "flow": 0.1573
   },
   "acc": {
    "taro": {
     "n": 388,
     "acc": 57.7
    },
    "diana": {
     "n": 439,
     "acc": 41.5
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
   "graded": 1179
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
    "taro": 0.3023,
    "diana": 0.1652,
    "nova": 0.2944,
    "flow": 0.2382
   },
   "acc": {
    "taro": {
     "n": 145,
     "acc": 63.4
    },
    "diana": {
     "n": 150,
     "acc": 34.7
    },
    "nova": {
     "n": 123,
     "acc": 61.8
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
    "taro": 0.2688,
    "diana": 0.1713,
    "nova": 0.2567,
    "flow": 0.3033
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 66.5
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
    "taro": 0.2777,
    "diana": 0.1877,
    "nova": 0.2788,
    "flow": 0.2558
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 54.3
    },
    "diana": {
     "n": 308,
     "acc": 36.7
    },
    "nova": {
     "n": 200,
     "acc": 54.5
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
    "taro": 0.2446,
    "diana": 0.1892,
    "nova": 0.2903,
    "flow": 0.2759
   },
   "acc": {
    "taro": {
     "n": 194,
     "acc": 44.3
    },
    "diana": {
     "n": 245,
     "acc": 34.3
    },
    "nova": {
     "n": 154,
     "acc": 52.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 593
  },
  "로봇": {
   "weights": {
    "taro": 0.2647,
    "diana": 0.2737,
    "nova": 0.2725,
    "flow": 0.1891
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 70.0
    },
    "diana": {
     "n": 134,
     "acc": 72.4
    },
    "nova": {
     "n": 136,
     "acc": 72.1
    },
    "flow": {
     "n": 28,
     "acc": 53.6
    }
   },
   "graded": 458
  },
  "식음료": {
   "weights": {
    "taro": 0.1979,
    "diana": 0.3019,
    "nova": 0.2091,
    "flow": 0.2911
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 34.0
    },
    "diana": {
     "n": 214,
     "acc": 51.9
    },
    "nova": {
     "n": 103,
     "acc": 35.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 467
  },
  "여행레저": {
   "weights": {
    "taro": 0.3567,
    "diana": 0.1663,
    "nova": 0.3107,
    "flow": 0.1663
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 64.4
    },
    "diana": {
     "n": 70,
     "acc": 22.9
    },
    "nova": {
     "n": 66,
     "acc": 56.1
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 254
  }
 }
};
