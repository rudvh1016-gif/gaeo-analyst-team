// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 13:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2854,
   "diana": 0.1818,
   "nova": 0.2819,
   "flow": 0.251
  },
  "acc": {
   "taro": {
    "n": 3759,
    "acc": 61.7
   },
   "diana": {
    "n": 3394,
    "acc": 39.3
   },
   "nova": {
    "n": 2639,
    "acc": 60.9
   },
   "flow": {
    "n": 658,
    "acc": 54.3
   }
  },
  "graded": 10450
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2696,
    "diana": 0.21,
    "nova": 0.226,
    "flow": 0.2944
   },
   "acc": {
    "taro": {
     "n": 446,
     "acc": 54.7
    },
    "diana": {
     "n": 291,
     "acc": 42.6
    },
    "nova": {
     "n": 351,
     "acc": 45.9
    },
    "flow": {
     "n": 149,
     "acc": 59.7
    }
   },
   "graded": 1237
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3089,
    "diana": 0.1576,
    "nova": 0.2713,
    "flow": 0.2623
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 74.2
    },
    "diana": {
     "n": 140,
     "acc": 37.9
    },
    "nova": {
     "n": 178,
     "acc": 65.2
    },
    "flow": {
     "n": 73,
     "acc": 63.0
    }
   },
   "graded": 612
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2836,
    "diana": 0.2043,
    "nova": 0.2661,
    "flow": 0.246
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 57.6
    },
    "diana": {
     "n": 171,
     "acc": 41.5
    },
    "nova": {
     "n": 135,
     "acc": 54.1
    },
    "flow": {
     "n": 29,
     "acc": 79.3
    }
   },
   "graded": 512
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3414,
    "diana": 0.1469,
    "nova": 0.3156,
    "flow": 0.1961
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 71.4
    },
    "diana": {
     "n": 166,
     "acc": 30.7
    },
    "nova": {
     "n": 103,
     "acc": 66.0
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
    "taro": 0.2521,
    "diana": 0.2196,
    "nova": 0.2889,
    "flow": 0.2394
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 52.7
    },
    "diana": {
     "n": 157,
     "acc": 45.9
    },
    "nova": {
     "n": 116,
     "acc": 60.3
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
    "taro": 0.2815,
    "diana": 0.1967,
    "nova": 0.2619,
    "flow": 0.2599
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 55.5
    },
    "diana": {
     "n": 232,
     "acc": 38.8
    },
    "nova": {
     "n": 122,
     "acc": 51.6
    },
    "flow": {
     "n": 80,
     "acc": 51.2
    }
   },
   "graded": 643
  },
  "2차전지": {
   "weights": {
    "taro": 0.3,
    "diana": 0.2,
    "nova": 0.3,
    "flow": 0.2
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 82.1
    },
    "diana": {
     "n": 122,
     "acc": 50.0
    },
    "nova": {
     "n": 155,
     "acc": 80.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 473
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.281,
    "diana": 0.225,
    "nova": 0.304,
    "flow": 0.19
   },
   "acc": {
    "taro": {
     "n": 470,
     "acc": 65.7
    },
    "diana": {
     "n": 418,
     "acc": 52.6
    },
    "nova": {
     "n": 360,
     "acc": 71.1
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1311
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2946,
    "diana": 0.1913,
    "nova": 0.2765,
    "flow": 0.2376
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 62.0
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
   "graded": 633
  },
  "조선": {
   "weights": {
    "taro": 0.3403,
    "diana": 0.1436,
    "nova": 0.2768,
    "flow": 0.2393
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 71.1
    },
    "diana": {
     "n": 129,
     "acc": 22.5
    },
    "nova": {
     "n": 102,
     "acc": 57.8
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
    "taro": 0.3312,
    "diana": 0.1325,
    "nova": 0.3155,
    "flow": 0.2208
   },
   "acc": {
    "taro": {
     "n": 90,
     "acc": 80.0
    },
    "diana": {
     "n": 84,
     "acc": 20.2
    },
    "nova": {
     "n": 63,
     "acc": 71.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 237
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2767,
    "diana": 0.1725,
    "nova": 0.2513,
    "flow": 0.2994
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 69.3
    },
    "diana": {
     "n": 280,
     "acc": 43.2
    },
    "nova": {
     "n": 197,
     "acc": 62.9
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
    "taro": 0.2675,
    "diana": 0.1733,
    "nova": 0.29,
    "flow": 0.2692
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 49.7
    },
    "diana": {
     "n": 174,
     "acc": 32.2
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
   "graded": 430
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2437,
    "diana": 0.2236,
    "nova": 0.2402,
    "flow": 0.2924
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 41.7
    },
    "diana": {
     "n": 68,
     "acc": 38.2
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
    "taro": 0.3422,
    "diana": 0.1533,
    "nova": 0.343,
    "flow": 0.1614
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 66.9
    },
    "diana": {
     "n": 104,
     "acc": 20.2
    },
    "nova": {
     "n": 76,
     "acc": 67.1
    },
    "flow": {
     "n": 38,
     "acc": 31.6
    }
   },
   "graded": 336
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2289,
    "diana": 0.1493,
    "nova": 0.3731,
    "flow": 0.2488
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 46.0
    },
    "diana": {
     "n": 143,
     "acc": 20.3
    },
    "nova": {
     "n": 66,
     "acc": 77.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 309
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
     "n": 120,
     "acc": 27.5
    },
    "nova": {
     "n": 34,
     "acc": 50.0
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
