// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 11:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2885,
   "diana": 0.1787,
   "nova": 0.2815,
   "flow": 0.2514
  },
  "acc": {
   "taro": {
    "n": 4134,
    "acc": 63.6
   },
   "diana": {
    "n": 3732,
    "acc": 39.4
   },
   "nova": {
    "n": 2797,
    "acc": 62.1
   },
   "flow": {
    "n": 732,
    "acc": 55.5
   }
  },
  "graded": 11395
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
    "taro": 0.3081,
    "diana": 0.1496,
    "nova": 0.2753,
    "flow": 0.267
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 77.9
    },
    "diana": {
     "n": 151,
     "acc": 36.4
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
   "graded": 653
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2534,
    "diana": 0.1929,
    "nova": 0.2392,
    "flow": 0.3145
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 60.4
    },
    "diana": {
     "n": 187,
     "acc": 46.0
    },
    "nova": {
     "n": 142,
     "acc": 57.0
    },
    "flow": {
     "n": 32,
     "acc": 87.5
    }
   },
   "graded": 553
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
    "taro": 0.2576,
    "diana": 0.2271,
    "nova": 0.2842,
    "flow": 0.2311
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 55.7
    },
    "diana": {
     "n": 173,
     "acc": 49.1
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
   "graded": 496
  },
  "금융·증권": {
   "weights": {
    "taro": 0.302,
    "diana": 0.1685,
    "nova": 0.2942,
    "flow": 0.2353
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 57.2
    },
    "diana": {
     "n": 260,
     "acc": 31.9
    },
    "nova": {
     "n": 131,
     "acc": 55.7
    },
    "flow": {
     "n": 92,
     "acc": 44.6
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
    "taro": 0.2626,
    "diana": 0.253,
    "nova": 0.2451,
    "flow": 0.2393
   },
   "acc": {
    "taro": {
     "n": 82,
     "acc": 54.9
    },
    "diana": {
     "n": 70,
     "acc": 52.9
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
   "graded": 212
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2848,
    "diana": 0.2205,
    "nova": 0.3009,
    "flow": 0.1938
   },
   "acc": {
    "taro": {
     "n": 524,
     "acc": 68.3
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
    "taro": 0.2962,
    "diana": 0.1919,
    "nova": 0.2808,
    "flow": 0.2311
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 64.1
    },
    "diana": {
     "n": 265,
     "acc": 41.5
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
   "graded": 694
  },
  "조선": {
   "weights": {
    "taro": 0.3262,
    "diana": 0.1442,
    "nova": 0.2893,
    "flow": 0.2403
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 67.9
    },
    "diana": {
     "n": 140,
     "acc": 25.7
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
   "graded": 394
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
     "n": 97,
     "acc": 80.4
    },
    "diana": {
     "n": 89,
     "acc": 20.2
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
   "graded": 250
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.1667,
    "nova": 0.2588,
    "flow": 0.2939
   },
   "acc": {
    "taro": {
     "n": 303,
     "acc": 71.6
    },
    "diana": {
     "n": 308,
     "acc": 42.5
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
    "taro": 0.3385,
    "diana": 0.1483,
    "nova": 0.3485,
    "flow": 0.1647
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 68.5
    },
    "diana": {
     "n": 110,
     "acc": 20.0
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
   "graded": 357
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2423,
    "diana": 0.1467,
    "nova": 0.3666,
    "flow": 0.2444
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 49.6
    },
    "diana": {
     "n": 159,
     "acc": 21.4
    },
    "nova": {
     "n": 77,
     "acc": 76.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 351
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
     "n": 103,
     "acc": 77.7
    },
    "diana": {
     "n": 83,
     "acc": 75.9
    },
    "nova": {
     "n": 78,
     "acc": 75.6
    },
    "flow": {
     "n": 9,
     "acc": 22.2
    }
   },
   "graded": 273
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
