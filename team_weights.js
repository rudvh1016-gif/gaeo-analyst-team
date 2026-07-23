// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 09:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2896,
   "diana": 0.1758,
   "nova": 0.2832,
   "flow": 0.2514
  },
  "acc": {
   "taro": {
    "n": 4133,
    "acc": 63.7
   },
   "diana": {
    "n": 3728,
    "acc": 38.7
   },
   "nova": {
    "n": 2788,
    "acc": 62.3
   },
   "flow": {
    "n": 736,
    "acc": 55.3
   }
  },
  "graded": 11385
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.205,
    "nova": 0.2077,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 494,
     "acc": 57.5
    },
    "diana": {
     "n": 320,
     "acc": 42.5
    },
    "nova": {
     "n": 388,
     "acc": 43.0
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
    "taro": 0.2551,
    "diana": 0.1893,
    "nova": 0.2417,
    "flow": 0.3139
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 60.9
    },
    "diana": {
     "n": 188,
     "acc": 45.2
    },
    "nova": {
     "n": 142,
     "acc": 57.7
    },
    "flow": {
     "n": 32,
     "acc": 87.5
    }
   },
   "graded": 554
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3357,
    "diana": 0.146,
    "nova": 0.3229,
    "flow": 0.1954
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 70.3
    },
    "diana": {
     "n": 180,
     "acc": 30.6
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
   "graded": 507
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2567,
    "diana": 0.221,
    "nova": 0.2863,
    "flow": 0.236
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 54.4
    },
    "diana": {
     "n": 173,
     "acc": 46.8
    },
    "nova": {
     "n": 122,
     "acc": 60.7
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
    "taro": 0.3018,
    "diana": 0.1671,
    "nova": 0.2975,
    "flow": 0.2336
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 57.0
    },
    "diana": {
     "n": 260,
     "acc": 31.5
    },
    "nova": {
     "n": 130,
     "acc": 56.2
    },
    "flow": {
     "n": 93,
     "acc": 44.1
    }
   },
   "graded": 713
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
    "taro": 0.286,
    "diana": 0.2195,
    "nova": 0.3008,
    "flow": 0.1937
   },
   "acc": {
    "taro": {
     "n": 526,
     "acc": 68.6
    },
    "diana": {
     "n": 467,
     "acc": 52.7
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
   "graded": 1438
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2935,
    "diana": 0.1878,
    "nova": 0.2853,
    "flow": 0.2334
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 62.9
    },
    "diana": {
     "n": 266,
     "acc": 40.2
    },
    "nova": {
     "n": 162,
     "acc": 61.1
    },
    "flow": {
     "n": 22,
     "acc": 40.9
    }
   },
   "graded": 695
  },
  "조선": {
   "weights": {
    "taro": 0.3307,
    "diana": 0.1426,
    "nova": 0.289,
    "flow": 0.2377
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 69.6
    },
    "diana": {
     "n": 138,
     "acc": 23.9
    },
    "nova": {
     "n": 102,
     "acc": 60.8
    },
    "flow": {
     "n": 11,
     "acc": 63.6
    }
   },
   "graded": 389
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
     "acc": 82.5
    },
    "diana": {
     "n": 89,
     "acc": 18.0
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
    "taro": 0.2834,
    "diana": 0.163,
    "nova": 0.2598,
    "flow": 0.2937
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 72.4
    },
    "diana": {
     "n": 310,
     "acc": 41.6
    },
    "nova": {
     "n": 208,
     "acc": 66.3
    },
    "flow": {
     "n": 44,
     "acc": 84.1
    }
   },
   "graded": 866
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
    "taro": 0.3406,
    "diana": 0.1486,
    "nova": 0.3494,
    "flow": 0.1613
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 68.8
    },
    "diana": {
     "n": 111,
     "acc": 19.8
    },
    "nova": {
     "n": 78,
     "acc": 70.5
    },
    "flow": {
     "n": 43,
     "acc": 32.6
    }
   },
   "graded": 360
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2489,
    "diana": 0.1454,
    "nova": 0.3635,
    "flow": 0.2423
   },
   "acc": {
    "taro": {
     "n": 111,
     "acc": 51.4
    },
    "diana": {
     "n": 154,
     "acc": 19.5
    },
    "nova": {
     "n": 73,
     "acc": 80.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 338
  },
  "로봇": {
   "weights": {
    "taro": 0.2736,
    "diana": 0.2703,
    "nova": 0.2736,
    "flow": 0.1824
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 76.2
    },
    "diana": {
     "n": 81,
     "acc": 74.1
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
   "graded": 270
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
     "n": 128,
     "acc": 28.9
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
