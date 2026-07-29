// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 14:55",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2803,
   "diana": 0.2005,
   "nova": 0.2608,
   "flow": 0.2585
  },
  "acc": {
   "taro": {
    "n": 5992,
    "acc": 60.9
   },
   "diana": {
    "n": 5414,
    "acc": 43.6
   },
   "nova": {
    "n": 4562,
    "acc": 56.7
   },
   "flow": {
    "n": 1040,
    "acc": 56.2
   }
  },
  "graded": 17008,
  "team": {
   "hit": 4652,
   "miss": 1238,
   "n": 5890,
   "acc": 79.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1834,
    "nova": 0.2358,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 714,
     "acc": 64.4
    },
    "diana": {
     "n": 467,
     "acc": 42.2
    },
    "nova": {
     "n": 614,
     "acc": 54.2
    },
    "flow": {
     "n": 240,
     "acc": 69.2
    }
   },
   "graded": 2035
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.1608,
    "nova": 0.2591,
    "flow": 0.2761
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 74.7
    },
    "diana": {
     "n": 220,
     "acc": 39.5
    },
    "nova": {
     "n": 292,
     "acc": 63.7
    },
    "flow": {
     "n": 109,
     "acc": 67.9
    }
   },
   "graded": 977
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2466,
    "diana": 0.2259,
    "nova": 0.2231,
    "flow": 0.3045
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 54.6
    },
    "diana": {
     "n": 282,
     "acc": 50.0
    },
    "nova": {
     "n": 243,
     "acc": 49.4
    },
    "flow": {
     "n": 46,
     "acc": 67.4
    }
   },
   "graded": 866
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3352,
    "diana": 0.1649,
    "nova": 0.3315,
    "flow": 0.1684
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 62.9
    },
    "diana": {
     "n": 262,
     "acc": 30.9
    },
    "nova": {
     "n": 177,
     "acc": 62.1
    },
    "flow": {
     "n": 57,
     "acc": 31.6
    }
   },
   "graded": 741
  },
  "통신": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.2102,
    "nova": 0.2705,
    "flow": 0.2388
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 58.7
    },
    "diana": {
     "n": 75,
     "acc": 44.0
    },
    "nova": {
     "n": 83,
     "acc": 56.6
    },
    "flow": {
     "n": 29,
     "acc": 65.5
    }
   },
   "graded": 296
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2502,
    "diana": 0.2515,
    "nova": 0.2592,
    "flow": 0.2391
   },
   "acc": {
    "taro": {
     "n": 260,
     "acc": 52.3
    },
    "diana": {
     "n": 251,
     "acc": 52.6
    },
    "nova": {
     "n": 203,
     "acc": 54.2
    },
    "flow": {
     "n": 26,
     "acc": 57.7
    }
   },
   "graded": 740
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3224,
    "diana": 0.1668,
    "nova": 0.3081,
    "flow": 0.2026
   },
   "acc": {
    "taro": {
     "n": 345,
     "acc": 58.0
    },
    "diana": {
     "n": 379,
     "acc": 28.5
    },
    "nova": {
     "n": 231,
     "acc": 55.4
    },
    "flow": {
     "n": 118,
     "acc": 36.4
    }
   },
   "graded": 1073
  },
  "2차전지": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1966,
    "nova": 0.2998,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 323,
     "acc": 80.8
    },
    "diana": {
     "n": 207,
     "acc": 48.8
    },
    "nova": {
     "n": 262,
     "acc": 74.4
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 794
  },
  "보험": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.2677,
    "nova": 0.2296,
    "flow": 0.24
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 54.7
    },
    "diana": {
     "n": 104,
     "acc": 55.8
    },
    "nova": {
     "n": 69,
     "acc": 47.8
    },
    "flow": {
     "n": 29,
     "acc": 48.3
    }
   },
   "graded": 319
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2726,
    "diana": 0.2308,
    "nova": 0.2626,
    "flow": 0.2341
   },
   "acc": {
    "taro": {
     "n": 765,
     "acc": 64.4
    },
    "diana": {
     "n": 656,
     "acc": 54.6
    },
    "nova": {
     "n": 604,
     "acc": 62.1
    },
    "flow": {
     "n": 103,
     "acc": 55.3
    }
   },
   "graded": 2128
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3076,
    "diana": 0.2328,
    "nova": 0.2914,
    "flow": 0.1683
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 59.0
    },
    "diana": {
     "n": 390,
     "acc": 44.6
    },
    "nova": {
     "n": 265,
     "acc": 55.8
    },
    "flow": {
     "n": 31,
     "acc": 32.3
    }
   },
   "graded": 1032
  },
  "조선": {
   "weights": {
    "taro": 0.2794,
    "diana": 0.2116,
    "nova": 0.2465,
    "flow": 0.2625
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 53.2
    },
    "diana": {
     "n": 206,
     "acc": 40.3
    },
    "nova": {
     "n": 164,
     "acc": 47.0
    },
    "flow": {
     "n": 21,
     "acc": 52.4
    }
   },
   "graded": 594
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3135,
    "diana": 0.1792,
    "nova": 0.2677,
    "flow": 0.2395
   },
   "acc": {
    "taro": {
     "n": 136,
     "acc": 65.4
    },
    "diana": {
     "n": 131,
     "acc": 37.4
    },
    "nova": {
     "n": 102,
     "acc": 55.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 369
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2749,
    "diana": 0.183,
    "nova": 0.2392,
    "flow": 0.3029
   },
   "acc": {
    "taro": {
     "n": 432,
     "acc": 68.1
    },
    "diana": {
     "n": 448,
     "acc": 45.3
    },
    "nova": {
     "n": 341,
     "acc": 59.2
    },
    "flow": {
     "n": 60,
     "acc": 80.0
    }
   },
   "graded": 1281
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2845,
    "diana": 0.2867,
    "nova": 0.1608,
    "flow": 0.268
   },
   "acc": {
    "taro": {
     "n": 81,
     "acc": 53.1
    },
    "diana": {
     "n": 86,
     "acc": 53.5
    },
    "nova": {
     "n": 39,
     "acc": 28.2
    },
    "flow": {
     "n": 50,
     "acc": 50.0
    }
   },
   "graded": 256
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2809,
    "diana": 0.1961,
    "nova": 0.2662,
    "flow": 0.2568
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 54.7
    },
    "diana": {
     "n": 275,
     "acc": 38.2
    },
    "nova": {
     "n": 164,
     "acc": 51.8
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 711
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2518,
    "diana": 0.2311,
    "nova": 0.2319,
    "flow": 0.2852
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 44.2
    },
    "diana": {
     "n": 116,
     "acc": 40.5
    },
    "nova": {
     "n": 91,
     "acc": 40.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 361
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.308,
    "diana": 0.1778,
    "nova": 0.2898,
    "flow": 0.2244
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 59.9
    },
    "diana": {
     "n": 162,
     "acc": 34.6
    },
    "nova": {
     "n": 126,
     "acc": 56.3
    },
    "flow": {
     "n": 55,
     "acc": 43.6
    }
   },
   "graded": 520
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2523,
    "diana": 0.1718,
    "nova": 0.2964,
    "flow": 0.2795
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 45.1
    },
    "diana": {
     "n": 218,
     "acc": 30.7
    },
    "nova": {
     "n": 132,
     "acc": 53.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 525
  },
  "로봇": {
   "weights": {
    "taro": 0.2631,
    "diana": 0.2714,
    "nova": 0.2702,
    "flow": 0.1953
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 67.4
    },
    "diana": {
     "n": 118,
     "acc": 69.5
    },
    "nova": {
     "n": 120,
     "acc": 69.2
    },
    "flow": {
     "n": 19,
     "acc": 36.8
    }
   },
   "graded": 401
  },
  "식음료": {
   "weights": {
    "taro": 0.1953,
    "diana": 0.3046,
    "nova": 0.1955,
    "flow": 0.3046
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 32.1
    },
    "diana": {
     "n": 194,
     "acc": 50.0
    },
    "nova": {
     "n": 81,
     "acc": 32.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 406
  },
  "여행레저": {
   "weights": {
    "taro": 0.3138,
    "diana": 0.1543,
    "nova": 0.2748,
    "flow": 0.2571
   },
   "acc": {
    "taro": {
     "n": 77,
     "acc": 61.0
    },
    "diana": {
     "n": 63,
     "acc": 22.2
    },
    "nova": {
     "n": 58,
     "acc": 53.4
    },
    "flow": {
     "n": 28,
     "acc": 25.0
    }
   },
   "graded": 226
  }
 }
};
