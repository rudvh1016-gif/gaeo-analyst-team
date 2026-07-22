// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 12:16",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2859,
   "diana": 0.1806,
   "nova": 0.283,
   "flow": 0.2506
  },
  "acc": {
   "taro": {
    "n": 3773,
    "acc": 62.2
   },
   "diana": {
    "n": 3411,
    "acc": 39.3
   },
   "nova": {
    "n": 2656,
    "acc": 61.6
   },
   "flow": {
    "n": 660,
    "acc": 54.5
   }
  },
  "graded": 10500
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
    "taro": 0.3073,
    "diana": 0.1525,
    "nova": 0.2763,
    "flow": 0.2638
   },
   "acc": {
    "taro": {
     "n": 218,
     "acc": 76.1
    },
    "diana": {
     "n": 137,
     "acc": 37.2
    },
    "nova": {
     "n": 175,
     "acc": 67.4
    },
    "flow": {
     "n": 73,
     "acc": 64.4
    }
   },
   "graded": 603
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2826,
    "diana": 0.2081,
    "nova": 0.2628,
    "flow": 0.2466
   },
   "acc": {
    "taro": {
     "n": 178,
     "acc": 57.3
    },
    "diana": {
     "n": 173,
     "acc": 42.2
    },
    "nova": {
     "n": 137,
     "acc": 53.3
    },
    "flow": {
     "n": 29,
     "acc": 79.3
    }
   },
   "graded": 517
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
    "taro": 0.2816,
    "diana": 0.1949,
    "nova": 0.2607,
    "flow": 0.2628
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 56.2
    },
    "diana": {
     "n": 234,
     "acc": 38.9
    },
    "nova": {
     "n": 123,
     "acc": 52.0
    },
    "flow": {
     "n": 82,
     "acc": 52.4
    }
   },
   "graded": 649
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
    "diana": 0.2239,
    "nova": 0.3054,
    "flow": 0.1888
   },
   "acc": {
    "taro": {
     "n": 473,
     "acc": 66.4
    },
    "diana": {
     "n": 421,
     "acc": 52.7
    },
    "nova": {
     "n": 363,
     "acc": 71.9
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
    "taro": 0.2965,
    "diana": 0.1908,
    "nova": 0.2757,
    "flow": 0.237
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 62.6
    },
    "diana": {
     "n": 241,
     "acc": 40.2
    },
    "nova": {
     "n": 153,
     "acc": 58.2
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
    "taro": 0.3299,
    "diana": 0.132,
    "nova": 0.3181,
    "flow": 0.22
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 80.4
    },
    "diana": {
     "n": 85,
     "acc": 20.0
    },
    "nova": {
     "n": 65,
     "acc": 72.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 242
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.1719,
    "nova": 0.2525,
    "flow": 0.2984
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 69.7
    },
    "diana": {
     "n": 280,
     "acc": 43.2
    },
    "nova": {
     "n": 197,
     "acc": 63.5
    },
    "flow": {
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 794
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
    "taro": 0.1908,
    "diana": 0.1908,
    "nova": 0.3004,
    "flow": 0.318
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 22.3
    },
    "diana": {
     "n": 122,
     "acc": 28.7
    },
    "nova": {
     "n": 36,
     "acc": 47.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 252
  }
 }
};
