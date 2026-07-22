// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 11:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2855,
   "diana": 0.1812,
   "nova": 0.2828,
   "flow": 0.2505
  },
  "acc": {
   "taro": {
    "n": 3771,
    "acc": 62.0
   },
   "diana": {
    "n": 3410,
    "acc": 39.4
   },
   "nova": {
    "n": 2652,
    "acc": 61.4
   },
   "flow": {
    "n": 658,
    "acc": 54.4
   }
  },
  "graded": 10491
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2705,
    "diana": 0.2116,
    "nova": 0.2275,
    "flow": 0.2904
   },
   "acc": {
    "taro": {
     "n": 448,
     "acc": 54.9
    },
    "diana": {
     "n": 291,
     "acc": 43.0
    },
    "nova": {
     "n": 353,
     "acc": 46.2
    },
    "flow": {
     "n": 151,
     "acc": 58.9
    }
   },
   "graded": 1243
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
    "taro": 0.2814,
    "diana": 0.2081,
    "nova": 0.2687,
    "flow": 0.2418
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 58.2
    },
    "diana": {
     "n": 172,
     "acc": 43.0
    },
    "nova": {
     "n": 135,
     "acc": 55.6
    },
    "flow": {
     "n": 27,
     "acc": 85.2
    }
   },
   "graded": 511
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3418,
    "diana": 0.1458,
    "nova": 0.3167,
    "flow": 0.1958
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 71.6
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
   "graded": 472
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2534,
    "diana": 0.2163,
    "nova": 0.2911,
    "flow": 0.2392
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 53.0
    },
    "diana": {
     "n": 157,
     "acc": 45.2
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
   "graded": 456
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2823,
    "diana": 0.1961,
    "nova": 0.2628,
    "flow": 0.2588
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 55.9
    },
    "diana": {
     "n": 237,
     "acc": 38.8
    },
    "nova": {
     "n": 125,
     "acc": 52.0
    },
    "flow": {
     "n": 82,
     "acc": 51.2
    }
   },
   "graded": 657
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
     "n": 199,
     "acc": 82.4
    },
    "diana": {
     "n": 123,
     "acc": 51.2
    },
    "nova": {
     "n": 158,
     "acc": 81.0
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
    "taro": 0.281,
    "diana": 0.2257,
    "nova": 0.304,
    "flow": 0.1893
   },
   "acc": {
    "taro": {
     "n": 473,
     "acc": 66.0
    },
    "diana": {
     "n": 421,
     "acc": 53.0
    },
    "nova": {
     "n": 363,
     "acc": 71.3
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1320
  },
  "지주·상사": {
   "weights": {
    "taro": 0.296,
    "diana": 0.19,
    "nova": 0.277,
    "flow": 0.237
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 62.4
    },
    "diana": {
     "n": 242,
     "acc": 40.1
    },
    "nova": {
     "n": 154,
     "acc": 58.4
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 635
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
    "taro": 0.3306,
    "diana": 0.1322,
    "nova": 0.3168,
    "flow": 0.2204
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 80.2
    },
    "diana": {
     "n": 84,
     "acc": 20.2
    },
    "nova": {
     "n": 64,
     "acc": 71.9
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
    "taro": 0.2312,
    "diana": 0.1488,
    "nova": 0.372,
    "flow": 0.248
   },
   "acc": {
    "taro": {
     "n": 103,
     "acc": 46.6
    },
    "diana": {
     "n": 146,
     "acc": 20.5
    },
    "nova": {
     "n": 69,
     "acc": 76.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 318
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
     "n": 94,
     "acc": 22.3
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
   "graded": 250
  }
 }
};
