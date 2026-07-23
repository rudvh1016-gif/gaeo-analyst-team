// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 10:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2889,
   "diana": 0.1768,
   "nova": 0.2824,
   "flow": 0.252
  },
  "acc": {
   "taro": {
    "n": 4137,
    "acc": 63.7
   },
   "diana": {
    "n": 3730,
    "acc": 39.0
   },
   "nova": {
    "n": 2791,
    "acc": 62.3
   },
   "flow": {
    "n": 736,
    "acc": 55.6
   }
  },
  "graded": 11394
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
    "taro": 0.2546,
    "diana": 0.1903,
    "nova": 0.2408,
    "flow": 0.3144
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 60.7
    },
    "diana": {
     "n": 185,
     "acc": 45.4
    },
    "nova": {
     "n": 141,
     "acc": 57.4
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
    "taro": 0.2561,
    "diana": 0.2248,
    "nova": 0.2835,
    "flow": 0.2356
   },
   "acc": {
    "taro": {
     "n": 184,
     "acc": 54.3
    },
    "diana": {
     "n": 174,
     "acc": 47.7
    },
    "nova": {
     "n": 123,
     "acc": 60.2
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 499
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1676,
    "nova": 0.2973,
    "flow": 0.2334
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 57.0
    },
    "diana": {
     "n": 259,
     "acc": 31.7
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
    "taro": 0.2621,
    "diana": 0.2486,
    "nova": 0.2476,
    "flow": 0.2417
   },
   "acc": {
    "taro": {
     "n": 83,
     "acc": 54.2
    },
    "diana": {
     "n": 70,
     "acc": 51.4
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
   "graded": 213
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
     "n": 523,
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
   "graded": 1435
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2957,
    "diana": 0.192,
    "nova": 0.281,
    "flow": 0.2313
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 63.9
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
   "graded": 693
  },
  "조선": {
   "weights": {
    "taro": 0.3291,
    "diana": 0.143,
    "nova": 0.2897,
    "flow": 0.2383
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 69.1
    },
    "diana": {
     "n": 140,
     "acc": 25.0
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
   "graded": 392
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
     "n": 98,
     "acc": 81.6
    },
    "diana": {
     "n": 90,
     "acc": 18.9
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
   "graded": 252
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2822,
    "diana": 0.1641,
    "nova": 0.2602,
    "flow": 0.2935
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 72.1
    },
    "diana": {
     "n": 310,
     "acc": 41.9
    },
    "nova": {
     "n": 209,
     "acc": 66.5
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
    "taro": 0.2332,
    "diana": 0.2002,
    "nova": 0.2623,
    "flow": 0.3043
   },
   "acc": {
    "taro": {
     "n": 107,
     "acc": 38.3
    },
    "diana": {
     "n": 76,
     "acc": 32.9
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
   "graded": 241
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3325,
    "diana": 0.1479,
    "nova": 0.3476,
    "flow": 0.172
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
     "n": 43,
     "acc": 34.9
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
     "n": 156,
     "acc": 19.9
    },
    "nova": {
     "n": 75,
     "acc": 80.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 343
  },
  "로봇": {
   "weights": {
    "taro": 0.2733,
    "diana": 0.2711,
    "nova": 0.2733,
    "flow": 0.1822
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 76.5
    },
    "diana": {
     "n": 82,
     "acc": 74.4
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
   "graded": 272
  },
  "식음료": {
   "weights": {
    "taro": 0.1859,
    "diana": 0.1859,
    "nova": 0.3183,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 25.0
    },
    "diana": {
     "n": 126,
     "acc": 28.6
    },
    "nova": {
     "n": 37,
     "acc": 51.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 263
  }
 }
};
