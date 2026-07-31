// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 14:25",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2826,
   "diana": 0.1924,
   "nova": 0.2709,
   "flow": 0.2542
  },
  "acc": {
   "taro": {
    "n": 6719,
    "acc": 61.6
   },
   "diana": {
    "n": 6107,
    "acc": 41.9
   },
   "nova": {
    "n": 5378,
    "acc": 59.0
   },
   "flow": {
    "n": 1168,
    "acc": 55.4
   }
  },
  "graded": 19372,
  "team": {
   "hit": 5291,
   "miss": 1309,
   "n": 6600,
   "acc": 80.2
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
    "taro": 0.3062,
    "diana": 0.1544,
    "nova": 0.2603,
    "flow": 0.2792
   },
   "acc": {
    "taro": {
     "n": 398,
     "acc": 77.1
    },
    "diana": {
     "n": 246,
     "acc": 37.8
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
   "graded": 1092
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
    "taro": 0.3341,
    "diana": 0.1589,
    "nova": 0.3473,
    "flow": 0.1598
   },
   "acc": {
    "taro": {
     "n": 268,
     "acc": 63.1
    },
    "diana": {
     "n": 296,
     "acc": 28.0
    },
    "nova": {
     "n": 209,
     "acc": 65.6
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 836
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
    "taro": 0.3243,
    "diana": 0.1641,
    "nova": 0.314,
    "flow": 0.1977
   },
   "acc": {
    "taro": {
     "n": 388,
     "acc": 59.3
    },
    "diana": {
     "n": 434,
     "acc": 26.0
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
   "graded": 1218
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
    "taro": 0.2775,
    "diana": 0.2244,
    "nova": 0.2616,
    "flow": 0.2366
   },
   "acc": {
    "taro": {
     "n": 855,
     "acc": 66.4
    },
    "diana": {
     "n": 739,
     "acc": 53.7
    },
    "nova": {
     "n": 701,
     "acc": 62.6
    },
    "flow": {
     "n": 113,
     "acc": 56.6
    }
   },
   "graded": 2408
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3024,
    "diana": 0.218,
    "nova": 0.3222,
    "flow": 0.1574
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 57.6
    },
    "diana": {
     "n": 438,
     "acc": 41.6
    },
    "nova": {
     "n": 316,
     "acc": 61.4
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1176
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
    "taro": 0.2782,
    "diana": 0.1891,
    "nova": 0.2767,
    "flow": 0.256
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 54.3
    },
    "diana": {
     "n": 306,
     "acc": 36.9
    },
    "nova": {
     "n": 198,
     "acc": 54.0
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 809
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
    "taro": 0.2638,
    "diana": 0.2744,
    "nova": 0.2711,
    "flow": 0.1906
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 69.2
    },
    "diana": {
     "n": 132,
     "acc": 72.0
    },
    "nova": {
     "n": 135,
     "acc": 71.1
    },
    "flow": {
     "n": 28,
     "acc": 50.0
    }
   },
   "graded": 454
  },
  "식음료": {
   "weights": {
    "taro": 0.1947,
    "diana": 0.2996,
    "nova": 0.2155,
    "flow": 0.2902
   },
   "acc": {
    "taro": {
     "n": 152,
     "acc": 33.6
    },
    "diana": {
     "n": 215,
     "acc": 51.6
    },
    "nova": {
     "n": 105,
     "acc": 37.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 472
  },
  "여행레저": {
   "weights": {
    "taro": 0.3569,
    "diana": 0.1653,
    "nova": 0.3125,
    "flow": 0.1653
   },
   "acc": {
    "taro": {
     "n": 88,
     "acc": 64.8
    },
    "diana": {
     "n": 71,
     "acc": 22.5
    },
    "nova": {
     "n": 67,
     "acc": 56.7
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 257
  }
 }
};
