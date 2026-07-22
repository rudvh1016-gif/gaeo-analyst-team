// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 09:10",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2868,
   "diana": 0.1813,
   "nova": 0.2841,
   "flow": 0.2479
  },
  "acc": {
   "taro": {
    "n": 3761,
    "acc": 62.1
   },
   "diana": {
    "n": 3401,
    "acc": 39.3
   },
   "nova": {
    "n": 2648,
    "acc": 61.6
   },
   "flow": {
    "n": 661,
    "acc": 53.7
   }
  },
  "graded": 10471
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2662,
    "diana": 0.2168,
    "nova": 0.224,
    "flow": 0.293
   },
   "acc": {
    "taro": {
     "n": 441,
     "acc": 53.3
    },
    "diana": {
     "n": 288,
     "acc": 43.4
    },
    "nova": {
     "n": 350,
     "acc": 44.9
    },
    "flow": {
     "n": 150,
     "acc": 58.7
    }
   },
   "graded": 1229
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3131,
    "diana": 0.1543,
    "nova": 0.2775,
    "flow": 0.2551
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 75.3
    },
    "diana": {
     "n": 138,
     "acc": 37.0
    },
    "nova": {
     "n": 176,
     "acc": 66.5
    },
    "flow": {
     "n": 72,
     "acc": 61.1
    }
   },
   "graded": 605
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2803,
    "diana": 0.2128,
    "nova": 0.266,
    "flow": 0.2408
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 58.2
    },
    "diana": {
     "n": 172,
     "acc": 44.2
    },
    "nova": {
     "n": 134,
     "acc": 55.2
    },
    "flow": {
     "n": 28,
     "acc": 85.7
    }
   },
   "graded": 511
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3447,
    "diana": 0.1432,
    "nova": 0.3212,
    "flow": 0.1909
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 72.2
    },
    "diana": {
     "n": 167,
     "acc": 29.9
    },
    "nova": {
     "n": 104,
     "acc": 67.3
    },
    "flow": {
     "n": 40,
     "acc": 40.0
    }
   },
   "graded": 473
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2559,
    "diana": 0.2172,
    "nova": 0.2918,
    "flow": 0.2351
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 54.4
    },
    "diana": {
     "n": 158,
     "acc": 46.2
    },
    "nova": {
     "n": 116,
     "acc": 62.1
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 459
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1979,
    "nova": 0.255,
    "flow": 0.2672
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 56.2
    },
    "diana": {
     "n": 234,
     "acc": 39.7
    },
    "nova": {
     "n": 125,
     "acc": 51.2
    },
    "flow": {
     "n": 82,
     "acc": 53.7
    }
   },
   "graded": 651
  },
  "2차전지": {
   "weights": {
    "taro": 0.3015,
    "diana": 0.1961,
    "nova": 0.3015,
    "flow": 0.201
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 81.4
    },
    "diana": {
     "n": 123,
     "acc": 48.8
    },
    "nova": {
     "n": 158,
     "acc": 79.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 480
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2823,
    "diana": 0.2283,
    "nova": 0.3052,
    "flow": 0.1842
   },
   "acc": {
    "taro": {
     "n": 472,
     "acc": 65.7
    },
    "diana": {
     "n": 418,
     "acc": 53.1
    },
    "nova": {
     "n": 362,
     "acc": 71.0
    },
    "flow": {
     "n": 63,
     "acc": 42.9
    }
   },
   "graded": 1315
  },
  "지주·상사": {
   "weights": {
    "taro": 0.297,
    "diana": 0.1893,
    "nova": 0.2793,
    "flow": 0.2343
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 63.4
    },
    "diana": {
     "n": 245,
     "acc": 40.4
    },
    "nova": {
     "n": 156,
     "acc": 59.6
    },
    "flow": {
     "n": 20,
     "acc": 45.0
    }
   },
   "graded": 645
  },
  "조선": {
   "weights": {
    "taro": 0.3429,
    "diana": 0.1393,
    "nova": 0.2857,
    "flow": 0.2321
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 73.8
    },
    "diana": {
     "n": 131,
     "acc": 20.6
    },
    "nova": {
     "n": 104,
     "acc": 61.5
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 375
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3261,
    "diana": 0.1304,
    "nova": 0.3261,
    "flow": 0.2174
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 82.4
    },
    "diana": {
     "n": 84,
     "acc": 17.9
    },
    "nova": {
     "n": 64,
     "acc": 75.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 239
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2758,
    "diana": 0.1705,
    "nova": 0.2536,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 68.9
    },
    "diana": {
     "n": 284,
     "acc": 42.6
    },
    "nova": {
     "n": 202,
     "acc": 63.4
    },
    "flow": {
     "n": 40,
     "acc": 80.0
    }
   },
   "graded": 806
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.272,
    "diana": 0.1829,
    "nova": 0.2783,
    "flow": 0.2668
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 51.0
    },
    "diana": {
     "n": 175,
     "acc": 34.3
    },
    "nova": {
     "n": 92,
     "acc": 52.2
    },
    "flow": {
     "n": 9,
     "acc": 77.8
    }
   },
   "graded": 429
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2418,
    "diana": 0.2219,
    "nova": 0.2419,
    "flow": 0.2945
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 41.1
    },
    "diana": {
     "n": 69,
     "acc": 37.7
    },
    "nova": {
     "n": 56,
     "acc": 41.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 220
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.344,
    "diana": 0.1491,
    "nova": 0.3578,
    "flow": 0.1491
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 69.2
    },
    "diana": {
     "n": 101,
     "acc": 16.8
    },
    "nova": {
     "n": 75,
     "acc": 72.0
    },
    "flow": {
     "n": 39,
     "acc": 28.2
    }
   },
   "graded": 332
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2292,
    "diana": 0.1492,
    "nova": 0.373,
    "flow": 0.2487
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 46.1
    },
    "diana": {
     "n": 145,
     "acc": 20.7
    },
    "nova": {
     "n": 68,
     "acc": 76.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 315
  },
  "로봇": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.2727,
    "nova": 0.2727,
    "flow": 0.1818
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 80.9
    },
    "diana": {
     "n": 76,
     "acc": 78.9
    },
    "nova": {
     "n": 77,
     "acc": 76.6
    },
    "flow": {
     "n": 9,
     "acc": 22.2
    }
   },
   "graded": 256
  },
  "식음료": {
   "weights": {
    "taro": 0.1875,
    "diana": 0.1875,
    "nova": 0.3125,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 93,
     "acc": 22.6
    },
    "diana": {
     "n": 119,
     "acc": 26.9
    },
    "nova": {
     "n": 30,
     "acc": 50.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 242
  }
 }
};
