// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 10:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2885,
   "diana": 0.178,
   "nova": 0.2816,
   "flow": 0.2518
  },
  "acc": {
   "taro": {
    "n": 4141,
    "acc": 63.7
   },
   "diana": {
    "n": 3736,
    "acc": 39.3
   },
   "nova": {
    "n": 2796,
    "acc": 62.2
   },
   "flow": {
    "n": 736,
    "acc": 55.6
   }
  },
  "graded": 11409
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2776,
    "diana": 0.2048,
    "nova": 0.208,
    "flow": 0.3096
   },
   "acc": {
    "taro": {
     "n": 493,
     "acc": 57.6
    },
    "diana": {
     "n": 320,
     "acc": 42.5
    },
    "nova": {
     "n": 387,
     "acc": 43.2
    },
    "flow": {
     "n": 165,
     "acc": 64.2
    }
   },
   "graded": 1365
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3084,
    "diana": 0.1488,
    "nova": 0.2756,
    "flow": 0.2673
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 77.7
    },
    "diana": {
     "n": 152,
     "acc": 36.2
    },
    "nova": {
     "n": 182,
     "acc": 67.0
    },
    "flow": {
     "n": 80,
     "acc": 65.0
    }
   },
   "graded": 656
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2547,
    "diana": 0.1881,
    "nova": 0.2426,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 60.7
    },
    "diana": {
     "n": 185,
     "acc": 44.9
    },
    "nova": {
     "n": 140,
     "acc": 57.9
    },
    "flow": {
     "n": 32,
     "acc": 87.5
    }
   },
   "graded": 548
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3359,
    "diana": 0.1467,
    "nova": 0.3223,
    "flow": 0.1951
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 70.5
    },
    "diana": {
     "n": 182,
     "acc": 30.8
    },
    "nova": {
     "n": 108,
     "acc": 67.6
    },
    "flow": {
     "n": 44,
     "acc": 40.9
    }
   },
   "graded": 510
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2587,
    "diana": 0.224,
    "nova": 0.2853,
    "flow": 0.232
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 55.7
    },
    "diana": {
     "n": 174,
     "acc": 48.3
    },
    "nova": {
     "n": 122,
     "acc": 61.5
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 497
  },
  "금융·증권": {
   "weights": {
    "taro": 0.301,
    "diana": 0.1699,
    "nova": 0.2954,
    "flow": 0.2337
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 56.8
    },
    "diana": {
     "n": 259,
     "acc": 32.0
    },
    "nova": {
     "n": 131,
     "acc": 55.7
    },
    "flow": {
     "n": 93,
     "acc": 44.1
    }
   },
   "graded": 712
  },
  "2차전지": {
   "weights": {
    "taro": 0.2992,
    "diana": 0.2022,
    "nova": 0.2992,
    "flow": 0.1994
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 84.8
    },
    "diana": {
     "n": 142,
     "acc": 50.7
    },
    "nova": {
     "n": 166,
     "acc": 82.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 531
  },
  "보험": {
   "weights": {
    "taro": 0.2618,
    "diana": 0.2553,
    "nova": 0.2443,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 82,
     "acc": 54.9
    },
    "diana": {
     "n": 71,
     "acc": 53.5
    },
    "nova": {
     "n": 41,
     "acc": 51.2
    },
    "flow": {
     "n": 20,
     "acc": 60.0
    }
   },
   "graded": 214
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2854,
    "diana": 0.2203,
    "nova": 0.3007,
    "flow": 0.1936
   },
   "acc": {
    "taro": {
     "n": 524,
     "acc": 68.5
    },
    "diana": {
     "n": 467,
     "acc": 52.9
    },
    "nova": {
     "n": 374,
     "acc": 72.2
    },
    "flow": {
     "n": 71,
     "acc": 46.5
    }
   },
   "graded": 1436
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2969,
    "diana": 0.1912,
    "nova": 0.2808,
    "flow": 0.2311
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 64.2
    },
    "diana": {
     "n": 266,
     "acc": 41.4
    },
    "nova": {
     "n": 163,
     "acc": 60.7
    },
    "flow": {
     "n": 21,
     "acc": 42.9
    }
   },
   "graded": 696
  },
  "조선": {
   "weights": {
    "taro": 0.3269,
    "diana": 0.144,
    "nova": 0.289,
    "flow": 0.2401
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 68.1
    },
    "diana": {
     "n": 141,
     "acc": 25.5
    },
    "nova": {
     "n": 103,
     "acc": 60.2
    },
    "flow": {
     "n": 11,
     "acc": 63.6
    }
   },
   "graded": 396
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
     "n": 96,
     "acc": 81.2
    },
    "diana": {
     "n": 88,
     "acc": 19.3
    },
    "nova": {
     "n": 64,
     "acc": 76.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 248
  },
  "화학·소재": {
   "weights": {
    "taro": 0.281,
    "diana": 0.1656,
    "nova": 0.2591,
    "flow": 0.2943
   },
   "acc": {
    "taro": {
     "n": 303,
     "acc": 71.6
    },
    "diana": {
     "n": 308,
     "acc": 42.2
    },
    "nova": {
     "n": 209,
     "acc": 66.0
    },
    "flow": {
     "n": 44,
     "acc": 84.1
    }
   },
   "graded": 864
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1755,
    "nova": 0.2832,
    "flow": 0.2675
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 51.2
    },
    "diana": {
     "n": 192,
     "acc": 32.8
    },
    "nova": {
     "n": 102,
     "acc": 52.9
    },
    "flow": {
     "n": 11,
     "acc": 81.8
    }
   },
   "graded": 477
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2367,
    "diana": 0.2071,
    "nova": 0.2575,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 106,
     "acc": 39.6
    },
    "diana": {
     "n": 75,
     "acc": 34.7
    },
    "nova": {
     "n": 58,
     "acc": 43.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 239
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3351,
    "diana": 0.149,
    "nova": 0.3503,
    "flow": 0.1656
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 67.4
    },
    "diana": {
     "n": 112,
     "acc": 21.4
    },
    "nova": {
     "n": 78,
     "acc": 70.5
    },
    "flow": {
     "n": 42,
     "acc": 33.3
    }
   },
   "graded": 361
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2439,
    "diana": 0.1463,
    "nova": 0.3659,
    "flow": 0.2439
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 50.0
    },
    "diana": {
     "n": 160,
     "acc": 21.9
    },
    "nova": {
     "n": 78,
     "acc": 76.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 354
  },
  "로봇": {
   "weights": {
    "taro": 0.273,
    "diana": 0.2719,
    "nova": 0.273,
    "flow": 0.182
   },
   "acc": {
    "taro": {
     "n": 103,
     "acc": 76.7
    },
    "diana": {
     "n": 83,
     "acc": 74.7
    },
    "nova": {
     "n": 78,
     "acc": 75.6
    },
    "flow": {
     "n": 10,
     "acc": 30.0
    }
   },
   "graded": 274
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
     "n": 101,
     "acc": 24.8
    },
    "diana": {
     "n": 127,
     "acc": 29.1
    },
    "nova": {
     "n": 38,
     "acc": 50.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 266
  }
 }
};
