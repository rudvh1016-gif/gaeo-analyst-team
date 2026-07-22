// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 14:46",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2873,
   "diana": 0.1773,
   "nova": 0.2856,
   "flow": 0.2499
  },
  "acc": {
   "taro": {
    "n": 3777,
    "acc": 62.9
   },
   "diana": {
    "n": 3407,
    "acc": 38.8
   },
   "nova": {
    "n": 2655,
    "acc": 62.5
   },
   "flow": {
    "n": 660,
    "acc": 54.7
   }
  },
  "graded": 10499
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.2059,
    "nova": 0.2247,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 449,
     "acc": 56.1
    },
    "diana": {
     "n": 292,
     "acc": 42.5
    },
    "nova": {
     "n": 356,
     "acc": 46.3
    },
    "flow": {
     "n": 150,
     "acc": 61.3
    }
   },
   "graded": 1247
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3067,
    "diana": 0.1523,
    "nova": 0.2797,
    "flow": 0.2613
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 77.0
    },
    "diana": {
     "n": 137,
     "acc": 37.2
    },
    "nova": {
     "n": 174,
     "acc": 68.4
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 600
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.205,
    "nova": 0.2682,
    "flow": 0.2425
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 58.6
    },
    "diana": {
     "n": 168,
     "acc": 42.3
    },
    "nova": {
     "n": 132,
     "acc": 55.3
    },
    "flow": {
     "n": 27,
     "acc": 85.2
    }
   },
   "graded": 501
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3419,
    "diana": 0.142,
    "nova": 0.3218,
    "flow": 0.1942
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 72.2
    },
    "diana": {
     "n": 166,
     "acc": 29.5
    },
    "nova": {
     "n": 103,
     "acc": 68.0
    },
    "flow": {
     "n": 39,
     "acc": 41.0
    }
   },
   "graded": 470
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.254,
    "diana": 0.2188,
    "nova": 0.2902,
    "flow": 0.237
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 53.6
    },
    "diana": {
     "n": 156,
     "acc": 46.2
    },
    "nova": {
     "n": 116,
     "acc": 61.2
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 456
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.1873,
    "nova": 0.2744,
    "flow": 0.2519
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 56.9
    },
    "diana": {
     "n": 234,
     "acc": 37.2
    },
    "nova": {
     "n": 123,
     "acc": 54.5
    },
    "flow": {
     "n": 82,
     "acc": 50.0
    }
   },
   "graded": 650
  },
  "2차전지": {
   "weights": {
    "taro": 0.2995,
    "diana": 0.2013,
    "nova": 0.2995,
    "flow": 0.1997
   },
   "acc": {
    "taro": {
     "n": 201,
     "acc": 83.6
    },
    "diana": {
     "n": 127,
     "acc": 50.4
    },
    "nova": {
     "n": 160,
     "acc": 82.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 488
  },
  "보험": {
   "weights": {
    "taro": 0.2547,
    "diana": 0.2609,
    "nova": 0.2453,
    "flow": 0.2391
   },
   "acc": {
    "taro": {
     "n": 77,
     "acc": 53.2
    },
    "diana": {
     "n": 66,
     "acc": 54.5
    },
    "nova": {
     "n": 39,
     "acc": 51.3
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
    "taro": 0.2829,
    "diana": 0.2229,
    "nova": 0.3058,
    "flow": 0.1884
   },
   "acc": {
    "taro": {
     "n": 478,
     "acc": 66.7
    },
    "diana": {
     "n": 424,
     "acc": 52.6
    },
    "nova": {
     "n": 366,
     "acc": 72.1
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1331
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2969,
    "diana": 0.1862,
    "nova": 0.2817,
    "flow": 0.2352
   },
   "acc": {
    "taro": {
     "n": 225,
     "acc": 63.1
    },
    "diana": {
     "n": 245,
     "acc": 39.6
    },
    "nova": {
     "n": 157,
     "acc": 59.9
    },
    "flow": {
     "n": 20,
     "acc": 45.0
    }
   },
   "graded": 647
  },
  "조선": {
   "weights": {
    "taro": 0.342,
    "diana": 0.1412,
    "nova": 0.2815,
    "flow": 0.2353
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 72.7
    },
    "diana": {
     "n": 129,
     "acc": 20.9
    },
    "nova": {
     "n": 102,
     "acc": 59.8
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 369
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
     "n": 88,
     "acc": 84.1
    },
    "diana": {
     "n": 81,
     "acc": 16.0
    },
    "nova": {
     "n": 61,
     "acc": 77.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 230
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1688,
    "nova": 0.2551,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 279,
     "acc": 70.3
    },
    "diana": {
     "n": 282,
     "acc": 42.6
    },
    "nova": {
     "n": 199,
     "acc": 64.3
    },
    "flow": {
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 800
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2693,
    "diana": 0.1722,
    "nova": 0.2909,
    "flow": 0.2676
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 50.3
    },
    "diana": {
     "n": 174,
     "acc": 32.2
    },
    "nova": {
     "n": 92,
     "acc": 54.3
    },
    "flow": {
     "n": 9,
     "acc": 77.8
    }
   },
   "graded": 430
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
    "taro": 0.3435,
    "diana": 0.152,
    "nova": 0.3487,
    "flow": 0.1559
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 67.8
    },
    "diana": {
     "n": 104,
     "acc": 19.2
    },
    "nova": {
     "n": 77,
     "acc": 68.8
    },
    "flow": {
     "n": 39,
     "acc": 30.8
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
    "taro": 0.1857,
    "diana": 0.1857,
    "nova": 0.3189,
    "flow": 0.3096
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 23.4
    },
    "diana": {
     "n": 120,
     "acc": 27.5
    },
    "nova": {
     "n": 33,
     "acc": 51.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 247
  }
 }
};
