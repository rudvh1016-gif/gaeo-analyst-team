// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 12:46",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2858,
   "diana": 0.181,
   "nova": 0.2826,
   "flow": 0.2506
  },
  "acc": {
   "taro": {
    "n": 3760,
    "acc": 62.0
   },
   "diana": {
    "n": 3402,
    "acc": 39.3
   },
   "nova": {
    "n": 2643,
    "acc": 61.4
   },
   "flow": {
    "n": 658,
    "acc": 54.4
   }
  },
  "graded": 10463
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2706,
    "diana": 0.2112,
    "nova": 0.2263,
    "flow": 0.2918
   },
   "acc": {
    "taro": {
     "n": 447,
     "acc": 55.0
    },
    "diana": {
     "n": 291,
     "acc": 43.0
    },
    "nova": {
     "n": 352,
     "acc": 46.0
    },
    "flow": {
     "n": 150,
     "acc": 59.3
    }
   },
   "graded": 1240
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3093,
    "diana": 0.1545,
    "nova": 0.2722,
    "flow": 0.2639
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 74.9
    },
    "diana": {
     "n": 139,
     "acc": 37.4
    },
    "nova": {
     "n": 176,
     "acc": 65.9
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 606
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2831,
    "diana": 0.2056,
    "nova": 0.2656,
    "flow": 0.2456
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 57.6
    },
    "diana": {
     "n": 172,
     "acc": 41.9
    },
    "nova": {
     "n": 135,
     "acc": 54.1
    },
    "flow": {
     "n": 28,
     "acc": 82.1
    }
   },
   "graded": 512
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3404,
    "diana": 0.1461,
    "nova": 0.3173,
    "flow": 0.1962
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 71.2
    },
    "diana": {
     "n": 167,
     "acc": 30.5
    },
    "nova": {
     "n": 104,
     "acc": 66.3
    },
    "flow": {
     "n": 39,
     "acc": 41.0
    }
   },
   "graded": 473
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.253,
    "diana": 0.2174,
    "nova": 0.2907,
    "flow": 0.2388
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 53.0
    },
    "diana": {
     "n": 156,
     "acc": 45.5
    },
    "nova": {
     "n": 115,
     "acc": 60.9
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 455
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2815,
    "diana": 0.1966,
    "nova": 0.262,
    "flow": 0.26
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 55.5
    },
    "diana": {
     "n": 235,
     "acc": 38.7
    },
    "nova": {
     "n": 124,
     "acc": 51.6
    },
    "flow": {
     "n": 82,
     "acc": 51.2
    }
   },
   "graded": 652
  },
  "2차전지": {
   "weights": {
    "taro": 0.2985,
    "diana": 0.2039,
    "nova": 0.2985,
    "flow": 0.199
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 82.7
    },
    "diana": {
     "n": 123,
     "acc": 51.2
    },
    "nova": {
     "n": 156,
     "acc": 81.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 476
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2811,
    "diana": 0.2255,
    "nova": 0.3042,
    "flow": 0.1892
   },
   "acc": {
    "taro": {
     "n": 471,
     "acc": 66.0
    },
    "diana": {
     "n": 419,
     "acc": 53.0
    },
    "nova": {
     "n": 361,
     "acc": 71.5
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1314
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2955,
    "diana": 0.193,
    "nova": 0.2742,
    "flow": 0.2373
   },
   "acc": {
    "taro": {
     "n": 220,
     "acc": 62.3
    },
    "diana": {
     "n": 241,
     "acc": 40.7
    },
    "nova": {
     "n": 154,
     "acc": 57.8
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 633
  },
  "조선": {
   "weights": {
    "taro": 0.3428,
    "diana": 0.1404,
    "nova": 0.2827,
    "flow": 0.2341
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 73.2
    },
    "diana": {
     "n": 128,
     "acc": 20.3
    },
    "nova": {
     "n": 101,
     "acc": 60.4
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 366
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3283,
    "diana": 0.1313,
    "nova": 0.3215,
    "flow": 0.2189
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 81.3
    },
    "diana": {
     "n": 84,
     "acc": 19.0
    },
    "nova": {
     "n": 64,
     "acc": 73.4
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
    "taro": 0.2773,
    "diana": 0.1715,
    "nova": 0.2522,
    "flow": 0.299
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 69.6
    },
    "diana": {
     "n": 279,
     "acc": 43.0
    },
    "nova": {
     "n": 196,
     "acc": 63.3
    },
    "flow": {
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 791
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2672,
    "diana": 0.1773,
    "nova": 0.2865,
    "flow": 0.269
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 49.7
    },
    "diana": {
     "n": 176,
     "acc": 33.0
    },
    "nova": {
     "n": 92,
     "acc": 53.3
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 433
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2397,
    "diana": 0.2169,
    "nova": 0.2484,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 40.6
    },
    "diana": {
     "n": 68,
     "acc": 36.8
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
   "graded": 221
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3415,
    "diana": 0.153,
    "nova": 0.3444,
    "flow": 0.1611
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 66.9
    },
    "diana": {
     "n": 105,
     "acc": 20.0
    },
    "nova": {
     "n": 77,
     "acc": 67.5
    },
    "flow": {
     "n": 38,
     "acc": 31.6
    }
   },
   "graded": 338
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2329,
    "diana": 0.1485,
    "nova": 0.3712,
    "flow": 0.2475
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 47.1
    },
    "diana": {
     "n": 145,
     "acc": 20.0
    },
    "nova": {
     "n": 68,
     "acc": 77.9
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
    "taro": 0.1893,
    "diana": 0.1893,
    "nova": 0.3059,
    "flow": 0.3155
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 22.8
    },
    "diana": {
     "n": 120,
     "acc": 27.5
    },
    "nova": {
     "n": 33,
     "acc": 48.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 245
  }
 }
};
