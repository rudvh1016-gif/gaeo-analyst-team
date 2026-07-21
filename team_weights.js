// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-21 13:48",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2918,
   "diana": 0.1705,
   "nova": 0.2921,
   "flow": 0.2456
  },
  "acc": {
   "taro": {
    "n": 3413,
    "acc": 63.8
   },
   "diana": {
    "n": 3091,
    "acc": 37.3
   },
   "nova": {
    "n": 2341,
    "acc": 63.9
   },
   "flow": {
    "n": 601,
    "acc": 53.7
   }
  },
  "graded": 9446
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.271,
    "diana": 0.2053,
    "nova": 0.225,
    "flow": 0.2987
   },
   "acc": {
    "taro": {
     "n": 404,
     "acc": 54.7
    },
    "diana": {
     "n": 263,
     "acc": 41.4
    },
    "nova": {
     "n": 328,
     "acc": 45.4
    },
    "flow": {
     "n": 136,
     "acc": 60.3
    }
   },
   "graded": 1131
  },
  "전자·부품": {
   "weights": {
    "taro": 0.311,
    "diana": 0.1382,
    "nova": 0.2932,
    "flow": 0.2576
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 79.7
    },
    "diana": {
     "n": 126,
     "acc": 33.3
    },
    "nova": {
     "n": 157,
     "acc": 70.7
    },
    "flow": {
     "n": 66,
     "acc": 62.1
    }
   },
   "graded": 546
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2919,
    "diana": 0.1925,
    "nova": 0.2758,
    "flow": 0.2398
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 60.9
    },
    "diana": {
     "n": 157,
     "acc": 40.1
    },
    "nova": {
     "n": 120,
     "acc": 57.5
    },
    "flow": {
     "n": 26,
     "acc": 84.6
    }
   },
   "graded": 464
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3435,
    "diana": 0.1374,
    "nova": 0.341,
    "flow": 0.1781
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 76.4
    },
    "diana": {
     "n": 152,
     "acc": 26.3
    },
    "nova": {
     "n": 90,
     "acc": 74.4
    },
    "flow": {
     "n": 36,
     "acc": 38.9
    }
   },
   "graded": 426
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2655,
    "diana": 0.2003,
    "nova": 0.3026,
    "flow": 0.2315
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 57.3
    },
    "diana": {
     "n": 141,
     "acc": 43.3
    },
    "nova": {
     "n": 101,
     "acc": 65.3
    },
    "flow": {
     "n": 14,
     "acc": 28.6
    }
   },
   "graded": 406
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2928,
    "diana": 0.1835,
    "nova": 0.2706,
    "flow": 0.2531
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 59.4
    },
    "diana": {
     "n": 215,
     "acc": 37.2
    },
    "nova": {
     "n": 113,
     "acc": 54.9
    },
    "flow": {
     "n": 76,
     "acc": 51.3
    }
   },
   "graded": 596
  },
  "2차전지": {
   "weights": {
    "taro": 0.299,
    "diana": 0.2028,
    "nova": 0.299,
    "flow": 0.1993
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 83.5
    },
    "diana": {
     "n": 114,
     "acc": 50.9
    },
    "nova": {
     "n": 143,
     "acc": 81.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 439
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2815,
    "diana": 0.2218,
    "nova": 0.3091,
    "flow": 0.1876
   },
   "acc": {
    "taro": {
     "n": 427,
     "acc": 65.8
    },
    "diana": {
     "n": 382,
     "acc": 51.8
    },
    "nova": {
     "n": 317,
     "acc": 72.2
    },
    "flow": {
     "n": 57,
     "acc": 43.9
    }
   },
   "graded": 1183
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2998,
    "diana": 0.1686,
    "nova": 0.2969,
    "flow": 0.2347
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 63.9
    },
    "diana": {
     "n": 220,
     "acc": 35.9
    },
    "nova": {
     "n": 136,
     "acc": 63.2
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 576
  },
  "조선": {
   "weights": {
    "taro": 0.3406,
    "diana": 0.1363,
    "nova": 0.296,
    "flow": 0.2271
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 78.3
    },
    "diana": {
     "n": 117,
     "acc": 15.4
    },
    "nova": {
     "n": 89,
     "acc": 65.2
    },
    "flow": {
     "n": 9,
     "acc": 77.8
    }
   },
   "graded": 330
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
     "n": 82,
     "acc": 87.8
    },
    "diana": {
     "n": 76,
     "acc": 11.8
    },
    "nova": {
     "n": 55,
     "acc": 81.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 213
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.163,
    "nova": 0.2582,
    "flow": 0.2981
   },
   "acc": {
    "taro": {
     "n": 252,
     "acc": 70.6
    },
    "diana": {
     "n": 256,
     "acc": 41.0
    },
    "nova": {
     "n": 177,
     "acc": 65.0
    },
    "flow": {
     "n": 36,
     "acc": 80.6
    }
   },
   "graded": 721
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2703,
    "diana": 0.1721,
    "nova": 0.2874,
    "flow": 0.2703
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 50.0
    },
    "diana": {
     "n": 157,
     "acc": 31.8
    },
    "nova": {
     "n": 79,
     "acc": 53.2
    },
    "flow": {
     "n": 9,
     "acc": 77.8
    }
   },
   "graded": 383
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3462,
    "diana": 0.1457,
    "nova": 0.3624,
    "flow": 0.1457
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 71.3
    },
    "diana": {
     "n": 94,
     "acc": 13.8
    },
    "nova": {
     "n": 67,
     "acc": 74.6
    },
    "flow": {
     "n": 35,
     "acc": 25.7
    }
   },
   "graded": 304
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2039,
    "diana": 0.1555,
    "nova": 0.3814,
    "flow": 0.2592
   },
   "acc": {
    "taro": {
     "n": 89,
     "acc": 39.3
    },
    "diana": {
     "n": 130,
     "acc": 20.8
    },
    "nova": {
     "n": 53,
     "acc": 73.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 272
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
     "n": 84,
     "acc": 90.5
    },
    "diana": {
     "n": 68,
     "acc": 88.2
    },
    "nova": {
     "n": 67,
     "acc": 88.1
    },
    "flow": {
     "n": 8,
     "acc": 12.5
    }
   },
   "graded": 227
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
     "n": 89,
     "acc": 21.3
    },
    "diana": {
     "n": 110,
     "acc": 26.4
    },
    "nova": {
     "n": 26,
     "acc": 50.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 225
  }
 }
};
