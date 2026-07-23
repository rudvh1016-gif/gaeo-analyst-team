// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 09:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2916,
   "diana": 0.1736,
   "nova": 0.284,
   "flow": 0.2508
  },
  "acc": {
   "taro": {
    "n": 4135,
    "acc": 64.2
   },
   "diana": {
    "n": 3729,
    "acc": 38.2
   },
   "nova": {
    "n": 2788,
    "acc": 62.5
   },
   "flow": {
    "n": 736,
    "acc": 55.2
   }
  },
  "graded": 11388
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.2046,
    "nova": 0.2084,
    "flow": 0.3093
   },
   "acc": {
    "taro": {
     "n": 494,
     "acc": 57.7
    },
    "diana": {
     "n": 320,
     "acc": 42.5
    },
    "nova": {
     "n": 388,
     "acc": 43.3
    },
    "flow": {
     "n": 165,
     "acc": 64.2
    }
   },
   "graded": 1367
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
    "taro": 0.2595,
    "diana": 0.1842,
    "nova": 0.243,
    "flow": 0.3134
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 62.1
    },
    "diana": {
     "n": 186,
     "acc": 44.1
    },
    "nova": {
     "n": 141,
     "acc": 58.2
    },
    "flow": {
     "n": 32,
     "acc": 87.5
    }
   },
   "graded": 549
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3417,
    "diana": 0.1434,
    "nova": 0.326,
    "flow": 0.1889
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 71.5
    },
    "diana": {
     "n": 177,
     "acc": 28.2
    },
    "nova": {
     "n": 107,
     "acc": 68.2
    },
    "flow": {
     "n": 43,
     "acc": 39.5
    }
   },
   "graded": 499
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2565,
    "diana": 0.2195,
    "nova": 0.2883,
    "flow": 0.2357
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 54.4
    },
    "diana": {
     "n": 174,
     "acc": 46.6
    },
    "nova": {
     "n": 121,
     "acc": 61.2
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 495
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3025,
    "diana": 0.1676,
    "nova": 0.2972,
    "flow": 0.2327
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 56.7
    },
    "diana": {
     "n": 261,
     "acc": 31.4
    },
    "nova": {
     "n": 131,
     "acc": 55.7
    },
    "flow": {
     "n": 94,
     "acc": 43.6
    }
   },
   "graded": 717
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
    "taro": 0.2612,
    "diana": 0.2511,
    "nova": 0.2468,
    "flow": 0.2409
   },
   "acc": {
    "taro": {
     "n": 83,
     "acc": 54.2
    },
    "diana": {
     "n": 71,
     "acc": 52.1
    },
    "nova": {
     "n": 41,
     "acc": 51.2
    },
    "flow": {
     "n": 19,
     "acc": 57.9
    }
   },
   "graded": 214
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2869,
    "diana": 0.2189,
    "nova": 0.3007,
    "flow": 0.1936
   },
   "acc": {
    "taro": {
     "n": 527,
     "acc": 68.9
    },
    "diana": {
     "n": 468,
     "acc": 52.6
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
   "graded": 1440
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2958,
    "diana": 0.1892,
    "nova": 0.2832,
    "flow": 0.2317
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 63.8
    },
    "diana": {
     "n": 267,
     "acc": 40.8
    },
    "nova": {
     "n": 162,
     "acc": 61.1
    },
    "flow": {
     "n": 22,
     "acc": 45.5
    }
   },
   "graded": 697
  },
  "조선": {
   "weights": {
    "taro": 0.3402,
    "diana": 0.1402,
    "nova": 0.2859,
    "flow": 0.2337
   },
   "acc": {
    "taro": {
     "n": 136,
     "acc": 72.8
    },
    "diana": {
     "n": 137,
     "acc": 21.2
    },
    "nova": {
     "n": 103,
     "acc": 61.2
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 386
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
     "acc": 84.4
    },
    "diana": {
     "n": 88,
     "acc": 15.9
    },
    "nova": {
     "n": 63,
     "acc": 77.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 247
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2848,
    "diana": 0.161,
    "nova": 0.2595,
    "flow": 0.2947
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 72.5
    },
    "diana": {
     "n": 310,
     "acc": 41.0
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
   "graded": 868
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1728,
    "nova": 0.286,
    "flow": 0.2675
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 51.2
    },
    "diana": {
     "n": 192,
     "acc": 32.3
    },
    "nova": {
     "n": 101,
     "acc": 53.5
    },
    "flow": {
     "n": 11,
     "acc": 81.8
    }
   },
   "graded": 476
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2321,
    "diana": 0.1985,
    "nova": 0.2636,
    "flow": 0.3057
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 38.0
    },
    "diana": {
     "n": 77,
     "acc": 32.5
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
   "graded": 243
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3451,
    "diana": 0.1472,
    "nova": 0.3479,
    "flow": 0.1598
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 70.3
    },
    "diana": {
     "n": 112,
     "acc": 17.9
    },
    "nova": {
     "n": 79,
     "acc": 70.9
    },
    "flow": {
     "n": 43,
     "acc": 32.6
    }
   },
   "graded": 362
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2504,
    "diana": 0.1451,
    "nova": 0.3627,
    "flow": 0.2418
   },
   "acc": {
    "taro": {
     "n": 112,
     "acc": 51.8
    },
    "diana": {
     "n": 154,
     "acc": 18.8
    },
    "nova": {
     "n": 74,
     "acc": 81.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 340
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
     "n": 101,
     "acc": 79.2
    },
    "diana": {
     "n": 81,
     "acc": 77.8
    },
    "nova": {
     "n": 77,
     "acc": 76.6
    },
    "flow": {
     "n": 10,
     "acc": 20.0
    }
   },
   "graded": 269
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
     "acc": 23.8
    },
    "diana": {
     "n": 128,
     "acc": 27.3
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
   "graded": 267
  }
 }
};
