// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 12:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2877,
   "diana": 0.1795,
   "nova": 0.2807,
   "flow": 0.2521
  },
  "acc": {
   "taro": {
    "n": 4138,
    "acc": 63.5
   },
   "diana": {
    "n": 3740,
    "acc": 39.6
   },
   "nova": {
    "n": 2796,
    "acc": 61.9
   },
   "flow": {
    "n": 737,
    "acc": 55.6
   }
  },
  "graded": 11411
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
    "diana": 0.1923,
    "nova": 0.2387,
    "flow": 0.3156
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 60.2
    },
    "diana": {
     "n": 186,
     "acc": 45.7
    },
    "nova": {
     "n": 141,
     "acc": 56.7
    },
    "flow": {
     "n": 32,
     "acc": 87.5
    }
   },
   "graded": 550
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3378,
    "diana": 0.1449,
    "nova": 0.3223,
    "flow": 0.195
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 70.9
    },
    "diana": {
     "n": 181,
     "acc": 30.4
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
   "graded": 508
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2579,
    "diana": 0.2287,
    "nova": 0.2821,
    "flow": 0.2313
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 55.7
    },
    "diana": {
     "n": 174,
     "acc": 49.4
    },
    "nova": {
     "n": 123,
     "acc": 61.0
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 498
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3012,
    "diana": 0.1694,
    "nova": 0.2956,
    "flow": 0.2339
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 56.8
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
     "n": 222,
     "acc": 84.7
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
   "graded": 530
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
     "n": 20,
     "acc": 60.0
    }
   },
   "graded": 213
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2847,
    "diana": 0.2208,
    "nova": 0.3008,
    "flow": 0.1937
   },
   "acc": {
    "taro": {
     "n": 524,
     "acc": 68.3
    },
    "diana": {
     "n": 468,
     "acc": 53.0
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
   "graded": 1437
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2961,
    "diana": 0.1934,
    "nova": 0.28,
    "flow": 0.2305
   },
   "acc": {
    "taro": {
     "n": 246,
     "acc": 64.2
    },
    "diana": {
     "n": 267,
     "acc": 41.9
    },
    "nova": {
     "n": 163,
     "acc": 60.7
    },
    "flow": {
     "n": 22,
     "acc": 45.5
    }
   },
   "graded": 698
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
     "n": 98,
     "acc": 79.6
    },
    "diana": {
     "n": 90,
     "acc": 21.1
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
    "taro": 0.2807,
    "diana": 0.1672,
    "nova": 0.2585,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 71.7
    },
    "diana": {
     "n": 309,
     "acc": 42.7
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
   "graded": 866
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.1786,
    "nova": 0.2811,
    "flow": 0.2678
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 50.9
    },
    "diana": {
     "n": 192,
     "acc": 33.3
    },
    "nova": {
     "n": 101,
     "acc": 52.5
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
    "taro": 0.3365,
    "diana": 0.1497,
    "nova": 0.3474,
    "flow": 0.1663
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 67.4
    },
    "diana": {
     "n": 113,
     "acc": 22.1
    },
    "nova": {
     "n": 79,
     "acc": 69.6
    },
    "flow": {
     "n": 42,
     "acc": 33.3
    }
   },
   "graded": 363
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.236,
    "diana": 0.1482,
    "nova": 0.3688,
    "flow": 0.247
   },
   "acc": {
    "taro": {
     "n": 113,
     "acc": 47.8
    },
    "diana": {
     "n": 157,
     "acc": 21.7
    },
    "nova": {
     "n": 75,
     "acc": 74.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 345
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
     "n": 104,
     "acc": 76.9
    },
    "diana": {
     "n": 84,
     "acc": 75.0
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
   "graded": 276
  },
  "식음료": {
   "weights": {
    "taro": 0.189,
    "diana": 0.189,
    "nova": 0.3069,
    "flow": 0.315
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 24.8
    },
    "diana": {
     "n": 128,
     "acc": 29.7
    },
    "nova": {
     "n": 39,
     "acc": 48.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 268
  }
 }
};
