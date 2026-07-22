// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 12:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2857,
   "diana": 0.1804,
   "nova": 0.2828,
   "flow": 0.251
  },
  "acc": {
   "taro": {
    "n": 3774,
    "acc": 62.3
   },
   "diana": {
    "n": 3411,
    "acc": 39.3
   },
   "nova": {
    "n": 2659,
    "acc": 61.6
   },
   "flow": {
    "n": 658,
    "acc": 54.7
   }
  },
  "graded": 10502
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2708,
    "diana": 0.211,
    "nova": 0.2268,
    "flow": 0.2914
   },
   "acc": {
    "taro": {
     "n": 448,
     "acc": 55.1
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
     "n": 150,
     "acc": 59.3
    }
   },
   "graded": 1242
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3084,
    "diana": 0.152,
    "nova": 0.2749,
    "flow": 0.2647
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 75.7
    },
    "diana": {
     "n": 138,
     "acc": 37.0
    },
    "nova": {
     "n": 175,
     "acc": 66.9
    },
    "flow": {
     "n": 73,
     "acc": 64.4
    }
   },
   "graded": 604
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2833,
    "diana": 0.2083,
    "nova": 0.2649,
    "flow": 0.2435
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 58.2
    },
    "diana": {
     "n": 173,
     "acc": 42.8
    },
    "nova": {
     "n": 136,
     "acc": 54.4
    },
    "flow": {
     "n": 27,
     "acc": 85.2
    }
   },
   "graded": 513
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
    "taro": 0.2532,
    "diana": 0.218,
    "nova": 0.291,
    "flow": 0.2377
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 53.3
    },
    "diana": {
     "n": 157,
     "acc": 45.9
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
   "graded": 458
  },
  "금융·증권": {
   "weights": {
    "taro": 0.282,
    "diana": 0.1958,
    "nova": 0.26,
    "flow": 0.2622
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 56.4
    },
    "diana": {
     "n": 235,
     "acc": 39.1
    },
    "nova": {
     "n": 125,
     "acc": 52.0
    },
    "flow": {
     "n": 82,
     "acc": 52.4
    }
   },
   "graded": 653
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
     "n": 200,
     "acc": 83.0
    },
    "diana": {
     "n": 125,
     "acc": 50.4
    },
    "nova": {
     "n": 159,
     "acc": 81.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 484
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.2241,
    "nova": 0.3051,
    "flow": 0.1889
   },
   "acc": {
    "taro": {
     "n": 475,
     "acc": 66.3
    },
    "diana": {
     "n": 423,
     "acc": 52.7
    },
    "nova": {
     "n": 365,
     "acc": 71.8
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1326
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2967,
    "diana": 0.1904,
    "nova": 0.2764,
    "flow": 0.2365
   },
   "acc": {
    "taro": {
     "n": 220,
     "acc": 62.7
    },
    "diana": {
     "n": 241,
     "acc": 40.2
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
    "taro": 0.3293,
    "diana": 0.1317,
    "nova": 0.3194,
    "flow": 0.2196
   },
   "acc": {
    "taro": {
     "n": 93,
     "acc": 80.6
    },
    "diana": {
     "n": 86,
     "acc": 19.8
    },
    "nova": {
     "n": 66,
     "acc": 72.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 245
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
    "taro": 0.2675,
    "diana": 0.1743,
    "nova": 0.2908,
    "flow": 0.2675
   },
   "acc": {
    "taro": {
     "n": 156,
     "acc": 50.0
    },
    "diana": {
     "n": 175,
     "acc": 32.6
    },
    "nova": {
     "n": 92,
     "acc": 54.3
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
