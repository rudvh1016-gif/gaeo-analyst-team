// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 09:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2859,
   "diana": 0.1888,
   "nova": 0.268,
   "flow": 0.2572
  },
  "acc": {
   "taro": {
    "n": 7082,
    "acc": 62.2
   },
   "diana": {
    "n": 6444,
    "acc": 41.1
   },
   "nova": {
    "n": 5753,
    "acc": 58.3
   },
   "flow": {
    "n": 1235,
    "acc": 56.0
   }
  },
  "graded": 20514,
  "team": {
   "hit": 5582,
   "miss": 1336,
   "n": 6918,
   "acc": 80.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3013,
    "diana": 0.1738,
    "nova": 0.2168,
    "flow": 0.3081
   },
   "acc": {
    "taro": {
     "n": 861,
     "acc": 69.1
    },
    "diana": {
     "n": 562,
     "acc": 39.9
    },
    "nova": {
     "n": 746,
     "acc": 49.7
    },
    "flow": {
     "n": 276,
     "acc": 70.7
    }
   },
   "graded": 2445
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3103,
    "diana": 0.1528,
    "nova": 0.252,
    "flow": 0.2849
   },
   "acc": {
    "taro": {
     "n": 423,
     "acc": 78.0
    },
    "diana": {
     "n": 260,
     "acc": 36.9
    },
    "nova": {
     "n": 353,
     "acc": 60.9
    },
    "flow": {
     "n": 122,
     "acc": 68.9
    }
   },
   "graded": 1158
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2587,
    "diana": 0.2267,
    "nova": 0.2592,
    "flow": 0.2554
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 54.7
    },
    "diana": {
     "n": 334,
     "acc": 47.9
    },
    "nova": {
     "n": 314,
     "acc": 54.8
    },
    "flow": {
     "n": 63,
     "acc": 54.0
    }
   },
   "graded": 1064
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3319,
    "diana": 0.159,
    "nova": 0.3406,
    "flow": 0.1686
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 62.6
    },
    "diana": {
     "n": 314,
     "acc": 29.3
    },
    "nova": {
     "n": 224,
     "acc": 64.3
    },
    "flow": {
     "n": 66,
     "acc": 31.8
    }
   },
   "graded": 885
  },
  "통신": {
   "weights": {
    "taro": 0.2628,
    "diana": 0.1839,
    "nova": 0.2578,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 60.8
    },
    "diana": {
     "n": 87,
     "acc": 42.5
    },
    "nova": {
     "n": 104,
     "acc": 59.6
    },
    "flow": {
     "n": 41,
     "acc": 68.3
    }
   },
   "graded": 362
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2321,
    "diana": 0.2259,
    "nova": 0.2698,
    "flow": 0.2722
   },
   "acc": {
    "taro": {
     "n": 311,
     "acc": 50.2
    },
    "diana": {
     "n": 293,
     "acc": 48.8
    },
    "nova": {
     "n": 259,
     "acc": 58.3
    },
    "flow": {
     "n": 34,
     "acc": 58.8
    }
   },
   "graded": 897
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3276,
    "diana": 0.1649,
    "nova": 0.3106,
    "flow": 0.1969
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 59.6
    },
    "diana": {
     "n": 456,
     "acc": 24.8
    },
    "nova": {
     "n": 292,
     "acc": 56.5
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1274
  },
  "2차전지": {
   "weights": {
    "taro": 0.3052,
    "diana": 0.196,
    "nova": 0.2953,
    "flow": 0.2035
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 83.1
    },
    "diana": {
     "n": 245,
     "acc": 48.2
    },
    "nova": {
     "n": 317,
     "acc": 72.6
    },
    "flow": {
     "n": 3,
     "acc": 66.7
    }
   },
   "graded": 949
  },
  "보험": {
   "weights": {
    "taro": 0.2652,
    "diana": 0.2393,
    "nova": 0.2707,
    "flow": 0.2248
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 53.6
    },
    "diana": {
     "n": 124,
     "acc": 48.4
    },
    "nova": {
     "n": 95,
     "acc": 54.7
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 390
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.2216,
    "nova": 0.2604,
    "flow": 0.2406
   },
   "acc": {
    "taro": {
     "n": 898,
     "acc": 67.0
    },
    "diana": {
     "n": 779,
     "acc": 53.5
    },
    "nova": {
     "n": 752,
     "acc": 62.9
    },
    "flow": {
     "n": 117,
     "acc": 58.1
    }
   },
   "graded": 2546
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3051,
    "diana": 0.213,
    "nova": 0.3239,
    "flow": 0.158
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 57.9
    },
    "diana": {
     "n": 460,
     "acc": 40.4
    },
    "nova": {
     "n": 335,
     "acc": 61.5
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1235
  },
  "조선": {
   "weights": {
    "taro": 0.2836,
    "diana": 0.1785,
    "nova": 0.2797,
    "flow": 0.2583
   },
   "acc": {
    "taro": {
     "n": 235,
     "acc": 54.9
    },
    "diana": {
     "n": 246,
     "acc": 34.6
    },
    "nova": {
     "n": 205,
     "acc": 54.1
    },
    "flow": {
     "n": 32,
     "acc": 50.0
    }
   },
   "graded": 718
  },
  "방산": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1576,
    "nova": 0.2825,
    "flow": 0.259
   },
   "acc": {
    "taro": {
     "n": 105,
     "acc": 58.1
    },
    "diana": {
     "n": 46,
     "acc": 30.4
    },
    "nova": {
     "n": 77,
     "acc": 54.5
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 229
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3008,
    "diana": 0.1681,
    "nova": 0.2928,
    "flow": 0.2384
   },
   "acc": {
    "taro": {
     "n": 149,
     "acc": 63.1
    },
    "diana": {
     "n": 156,
     "acc": 35.3
    },
    "nova": {
     "n": 127,
     "acc": 61.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 432
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2707,
    "diana": 0.1661,
    "nova": 0.2578,
    "flow": 0.3054
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 66.5
    },
    "diana": {
     "n": 542,
     "acc": 40.8
    },
    "nova": {
     "n": 436,
     "acc": 63.3
    },
    "flow": {
     "n": 72,
     "acc": 77.8
    }
   },
   "graded": 1566
  },
  "물류·운송": {
   "weights": {
    "taro": 0.259,
    "diana": 0.2518,
    "nova": 0.2438,
    "flow": 0.2454
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 48.5
    },
    "diana": {
     "n": 104,
     "acc": 47.1
    },
    "nova": {
     "n": 57,
     "acc": 45.6
    },
    "flow": {
     "n": 61,
     "acc": 45.9
    }
   },
   "graded": 319
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2785,
    "diana": 0.1832,
    "nova": 0.2833,
    "flow": 0.255
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 54.6
    },
    "diana": {
     "n": 323,
     "acc": 35.9
    },
    "nova": {
     "n": 216,
     "acc": 55.6
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 859
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2676,
    "diana": 0.2204,
    "nova": 0.2307,
    "flow": 0.2814
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 47.5
    },
    "diana": {
     "n": 143,
     "acc": 39.2
    },
    "nova": {
     "n": 122,
     "acc": 41.0
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 449
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3247,
    "diana": 0.1619,
    "nova": 0.331,
    "flow": 0.1824
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 60.2
    },
    "diana": {
     "n": 193,
     "acc": 29.0
    },
    "nova": {
     "n": 163,
     "acc": 61.3
    },
    "flow": {
     "n": 71,
     "acc": 33.8
    }
   },
   "graded": 638
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2462,
    "diana": 0.1814,
    "nova": 0.2992,
    "flow": 0.2732
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 45.0
    },
    "diana": {
     "n": 259,
     "acc": 33.2
    },
    "nova": {
     "n": 168,
     "acc": 54.8
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 630
  },
  "기계": {
   "weights": {
    "taro": 0.2134,
    "diana": 0.2049,
    "nova": 0.3027,
    "flow": 0.279
   },
   "acc": {
    "taro": {
     "n": 68,
     "acc": 38.2
    },
    "diana": {
     "n": 79,
     "acc": 36.7
    },
    "nova": {
     "n": 59,
     "acc": 54.2
    },
    "flow": {
     "n": 3,
     "acc": 100.0
    }
   },
   "graded": 209
  },
  "로봇": {
   "weights": {
    "taro": 0.2594,
    "diana": 0.27,
    "nova": 0.26,
    "flow": 0.2106
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 68.8
    },
    "diana": {
     "n": 141,
     "acc": 71.6
    },
    "nova": {
     "n": 145,
     "acc": 69.0
    },
    "flow": {
     "n": 34,
     "acc": 55.9
    }
   },
   "graded": 490
  },
  "식음료": {
   "weights": {
    "taro": 0.1953,
    "diana": 0.2962,
    "nova": 0.2226,
    "flow": 0.2859
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 34.2
    },
    "diana": {
     "n": 222,
     "acc": 51.8
    },
    "nova": {
     "n": 113,
     "acc": 38.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 496
  },
  "여행레저": {
   "weights": {
    "taro": 0.3597,
    "diana": 0.1628,
    "nova": 0.3079,
    "flow": 0.1696
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 66.3
    },
    "diana": {
     "n": 76,
     "acc": 22.4
    },
    "nova": {
     "n": 74,
     "acc": 56.8
    },
    "flow": {
     "n": 32,
     "acc": 31.2
    }
   },
   "graded": 274
  }
 }
};
