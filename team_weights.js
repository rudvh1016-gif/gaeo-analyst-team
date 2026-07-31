// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 11:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2828,
   "diana": 0.1917,
   "nova": 0.2711,
   "flow": 0.2544
  },
  "acc": {
   "taro": {
    "n": 6723,
    "acc": 61.8
   },
   "diana": {
    "n": 6113,
    "acc": 41.9
   },
   "nova": {
    "n": 5386,
    "acc": 59.2
   },
   "flow": {
    "n": 1168,
    "acc": 55.6
   }
  },
  "graded": 19390,
  "team": {
   "hit": 5288,
   "miss": 1301,
   "n": 6589,
   "acc": 80.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.177,
    "nova": 0.2255,
    "flow": 0.3023
   },
   "acc": {
    "taro": {
     "n": 814,
     "acc": 68.2
    },
    "diana": {
     "n": 531,
     "acc": 40.9
    },
    "nova": {
     "n": 701,
     "acc": 52.1
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2311
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3063,
    "diana": 0.1521,
    "nova": 0.2624,
    "flow": 0.2792
   },
   "acc": {
    "taro": {
     "n": 398,
     "acc": 77.4
    },
    "diana": {
     "n": 247,
     "acc": 37.2
    },
    "nova": {
     "n": 330,
     "acc": 64.2
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
    "taro": 0.3021,
    "diana": 0.1944,
    "nova": 0.3021,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 82.4
    },
    "diana": {
     "n": 232,
     "acc": 48.3
    },
    "nova": {
     "n": 303,
     "acc": 75.6
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 900
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
    "diana": 0.2241,
    "nova": 0.2603,
    "flow": 0.239
   },
   "acc": {
    "taro": {
     "n": 855,
     "acc": 66.5
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
   "graded": 2412
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3036,
    "diana": 0.2167,
    "nova": 0.3228,
    "flow": 0.1569
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 58.0
    },
    "diana": {
     "n": 437,
     "acc": 41.4
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
    "taro": 0.2786,
    "diana": 0.1882,
    "nova": 0.2775,
    "flow": 0.2557
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 54.5
    },
    "diana": {
     "n": 307,
     "acc": 36.8
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
    "taro": 0.2475,
    "diana": 0.1881,
    "nova": 0.2902,
    "flow": 0.2742
   },
   "acc": {
    "taro": {
     "n": 195,
     "acc": 45.1
    },
    "diana": {
     "n": 245,
     "acc": 34.3
    },
    "nova": {
     "n": 155,
     "acc": 52.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 595
  },
  "로봇": {
   "weights": {
    "taro": 0.2648,
    "diana": 0.2742,
    "nova": 0.2729,
    "flow": 0.188
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 70.4
    },
    "diana": {
     "n": 133,
     "acc": 72.9
    },
    "nova": {
     "n": 135,
     "acc": 72.6
    },
    "flow": {
     "n": 28,
     "acc": 53.6
    }
   },
   "graded": 455
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
