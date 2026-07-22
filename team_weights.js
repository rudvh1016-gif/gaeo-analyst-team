// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 09:14",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.287,
   "diana": 0.1805,
   "nova": 0.2848,
   "flow": 0.2477
  },
  "acc": {
   "taro": {
    "n": 3747,
    "acc": 62.2
   },
   "diana": {
    "n": 3384,
    "acc": 39.1
   },
   "nova": {
    "n": 2635,
    "acc": 61.7
   },
   "flow": {
    "n": 656,
    "acc": 53.7
   }
  },
  "graded": 10422
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.268,
    "diana": 0.2147,
    "nova": 0.2262,
    "flow": 0.291
   },
   "acc": {
    "taro": {
     "n": 441,
     "acc": 53.5
    },
    "diana": {
     "n": 287,
     "acc": 42.9
    },
    "nova": {
     "n": 352,
     "acc": 45.2
    },
    "flow": {
     "n": 148,
     "acc": 58.1
    }
   },
   "graded": 1228
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3143,
    "diana": 0.1562,
    "nova": 0.2766,
    "flow": 0.2529
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 74.9
    },
    "diana": {
     "n": 137,
     "acc": 37.2
    },
    "nova": {
     "n": 176,
     "acc": 65.9
    },
    "flow": {
     "n": 73,
     "acc": 60.3
    }
   },
   "graded": 605
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2832,
    "diana": 0.207,
    "nova": 0.2693,
    "flow": 0.2406
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 58.9
    },
    "diana": {
     "n": 172,
     "acc": 43.0
    },
    "nova": {
     "n": 134,
     "acc": 56.0
    },
    "flow": {
     "n": 28,
     "acc": 85.7
    }
   },
   "graded": 509
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3428,
    "diana": 0.1433,
    "nova": 0.3187,
    "flow": 0.1952
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 72.0
    },
    "diana": {
     "n": 166,
     "acc": 30.1
    },
    "nova": {
     "n": 103,
     "acc": 67.0
    },
    "flow": {
     "n": 39,
     "acc": 41.0
    }
   },
   "graded": 469
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2552,
    "diana": 0.2172,
    "nova": 0.2908,
    "flow": 0.2368
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 53.9
    },
    "diana": {
     "n": 157,
     "acc": 45.9
    },
    "nova": {
     "n": 114,
     "acc": 61.4
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 454
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2818,
    "diana": 0.1942,
    "nova": 0.2594,
    "flow": 0.2646
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 56.5
    },
    "diana": {
     "n": 231,
     "acc": 39.0
    },
    "nova": {
     "n": 123,
     "acc": 52.0
    },
    "flow": {
     "n": 81,
     "acc": 53.1
    }
   },
   "graded": 642
  },
  "2차전지": {
   "weights": {
    "taro": 0.3005,
    "diana": 0.1987,
    "nova": 0.3005,
    "flow": 0.2003
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 81.9
    },
    "diana": {
     "n": 123,
     "acc": 49.6
    },
    "nova": {
     "n": 158,
     "acc": 80.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 480
  },
  "보험": {
   "weights": {
    "taro": 0.2538,
    "diana": 0.2634,
    "nova": 0.2414,
    "flow": 0.2414
   },
   "acc": {
    "taro": {
     "n": 78,
     "acc": 52.6
    },
    "diana": {
     "n": 66,
     "acc": 54.5
    },
    "nova": {
     "n": 38,
     "acc": 50.0
    },
    "flow": {
     "n": 18,
     "acc": 61.1
    }
   },
   "graded": 200
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2814,
    "diana": 0.2298,
    "nova": 0.3042,
    "flow": 0.1846
   },
   "acc": {
    "taro": {
     "n": 473,
     "acc": 65.3
    },
    "diana": {
     "n": 418,
     "acc": 53.3
    },
    "nova": {
     "n": 361,
     "acc": 70.6
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
    "taro": 0.3436,
    "diana": 0.1393,
    "nova": 0.285,
    "flow": 0.2321
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 74.0
    },
    "diana": {
     "n": 129,
     "acc": 20.2
    },
    "nova": {
     "n": 101,
     "acc": 61.4
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 367
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
     "n": 89,
     "acc": 84.3
    },
    "diana": {
     "n": 82,
     "acc": 15.9
    },
    "nova": {
     "n": 62,
     "acc": 77.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 233
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.1714,
    "nova": 0.2524,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 69.1
    },
    "diana": {
     "n": 280,
     "acc": 42.9
    },
    "nova": {
     "n": 198,
     "acc": 63.1
    },
    "flow": {
     "n": 39,
     "acc": 82.1
    }
   },
   "graded": 792
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2714,
    "diana": 0.1785,
    "nova": 0.2839,
    "flow": 0.2662
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 51.0
    },
    "diana": {
     "n": 173,
     "acc": 33.5
    },
    "nova": {
     "n": 90,
     "acc": 53.3
    },
    "flow": {
     "n": 9,
     "acc": 77.8
    }
   },
   "graded": 425
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.243,
    "diana": 0.2198,
    "nova": 0.2456,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 41.7
    },
    "diana": {
     "n": 69,
     "acc": 37.7
    },
    "nova": {
     "n": 57,
     "acc": 42.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 222
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
    "taro": 0.2309,
    "diana": 0.1489,
    "nova": 0.3721,
    "flow": 0.2481
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 46.5
    },
    "diana": {
     "n": 144,
     "acc": 20.1
    },
    "nova": {
     "n": 67,
     "acc": 77.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 312
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
     "n": 94,
     "acc": 22.3
    },
    "diana": {
     "n": 118,
     "acc": 26.3
    },
    "nova": {
     "n": 29,
     "acc": 51.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 241
  }
 }
};
