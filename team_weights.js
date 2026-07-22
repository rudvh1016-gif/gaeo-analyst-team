// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 12:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2857,
   "diana": 0.1812,
   "nova": 0.2826,
   "flow": 0.2506
  },
  "acc": {
   "taro": {
    "n": 3763,
    "acc": 62.0
   },
   "diana": {
    "n": 3404,
    "acc": 39.3
   },
   "nova": {
    "n": 2645,
    "acc": 61.4
   },
   "flow": {
    "n": 658,
    "acc": 54.4
   }
  },
  "graded": 10470
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
    "taro": 0.3097,
    "diana": 0.1526,
    "nova": 0.2738,
    "flow": 0.2639
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 75.2
    },
    "diana": {
     "n": 138,
     "acc": 37.0
    },
    "nova": {
     "n": 175,
     "acc": 66.3
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 603
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2832,
    "diana": 0.2074,
    "nova": 0.2638,
    "flow": 0.2457
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 57.6
    },
    "diana": {
     "n": 173,
     "acc": 42.2
    },
    "nova": {
     "n": 136,
     "acc": 53.7
    },
    "flow": {
     "n": 28,
     "acc": 82.1
    }
   },
   "graded": 514
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3414,
    "diana": 0.1436,
    "nova": 0.3194,
    "flow": 0.1956
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 71.6
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
   "graded": 470
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
    "taro": 0.2807,
    "diana": 0.1983,
    "nova": 0.2604,
    "flow": 0.2605
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 55.2
    },
    "diana": {
     "n": 236,
     "acc": 39.0
    },
    "nova": {
     "n": 125,
     "acc": 51.2
    },
    "flow": {
     "n": 82,
     "acc": 51.2
    }
   },
   "graded": 655
  },
  "2차전지": {
   "weights": {
    "taro": 0.299,
    "diana": 0.2026,
    "nova": 0.299,
    "flow": 0.1994
   },
   "acc": {
    "taro": {
     "n": 198,
     "acc": 82.8
    },
    "diana": {
     "n": 124,
     "acc": 50.8
    },
    "nova": {
     "n": 157,
     "acc": 81.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 479
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.2256,
    "nova": 0.3044,
    "flow": 0.1889
   },
   "acc": {
    "taro": {
     "n": 473,
     "acc": 66.2
    },
    "diana": {
     "n": 420,
     "acc": 53.1
    },
    "nova": {
     "n": 363,
     "acc": 71.6
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1319
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.1934,
    "nova": 0.2735,
    "flow": 0.2378
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 62.1
    },
    "diana": {
     "n": 241,
     "acc": 40.7
    },
    "nova": {
     "n": 153,
     "acc": 57.5
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 631
  },
  "조선": {
   "weights": {
    "taro": 0.3428,
    "diana": 0.1408,
    "nova": 0.2817,
    "flow": 0.2347
   },
   "acc": {
    "taro": {
     "n": 126,
     "acc": 73.0
    },
    "diana": {
     "n": 127,
     "acc": 20.5
    },
    "nova": {
     "n": 100,
     "acc": 60.0
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 363
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3289,
    "diana": 0.1316,
    "nova": 0.3202,
    "flow": 0.2193
   },
   "acc": {
    "taro": {
     "n": 90,
     "acc": 81.1
    },
    "diana": {
     "n": 83,
     "acc": 19.3
    },
    "nova": {
     "n": 63,
     "acc": 73.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 236
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
    "taro": 0.2669,
    "diana": 0.175,
    "nova": 0.2893,
    "flow": 0.2687
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 49.7
    },
    "diana": {
     "n": 175,
     "acc": 32.6
    },
    "nova": {
     "n": 91,
     "acc": 53.8
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 431
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2411,
    "diana": 0.2203,
    "nova": 0.2462,
    "flow": 0.2924
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 41.2
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
   "graded": 223
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
    "taro": 0.1892,
    "diana": 0.1892,
    "nova": 0.3063,
    "flow": 0.3153
   },
   "acc": {
    "taro": {
     "n": 93,
     "acc": 22.6
    },
    "diana": {
     "n": 121,
     "acc": 28.1
    },
    "nova": {
     "n": 35,
     "acc": 48.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 249
  }
 }
};
