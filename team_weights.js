// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 11:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2789,
   "diana": 0.2021,
   "nova": 0.2604,
   "flow": 0.2586
  },
  "acc": {
   "taro": {
    "n": 5986,
    "acc": 60.8
   },
   "diana": {
    "n": 5409,
    "acc": 44.0
   },
   "nova": {
    "n": 4554,
    "acc": 56.8
   },
   "flow": {
    "n": 1038,
    "acc": 56.4
   }
  },
  "graded": 16987,
  "team": {
   "hit": 4659,
   "miss": 1242,
   "n": 5901,
   "acc": 79.0
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.183,
    "nova": 0.2361,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 714,
     "acc": 64.4
    },
    "diana": {
     "n": 468,
     "acc": 42.1
    },
    "nova": {
     "n": 615,
     "acc": 54.3
    },
    "flow": {
     "n": 240,
     "acc": 69.2
    }
   },
   "graded": 2037
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
    "taro": 0.2465,
    "diana": 0.2273,
    "nova": 0.222,
    "flow": 0.3042
   },
   "acc": {
    "taro": {
     "n": 293,
     "acc": 54.6
    },
    "diana": {
     "n": 280,
     "acc": 50.4
    },
    "nova": {
     "n": 242,
     "acc": 49.2
    },
    "flow": {
     "n": 46,
     "acc": 67.4
    }
   },
   "graded": 861
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.335,
    "diana": 0.1654,
    "nova": 0.3312,
    "flow": 0.1683
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 62.9
    },
    "diana": {
     "n": 261,
     "acc": 31.0
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
   "graded": 740
  },
  "통신": {
   "weights": {
    "taro": 0.2823,
    "diana": 0.2124,
    "nova": 0.2672,
    "flow": 0.2382
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 59.3
    },
    "diana": {
     "n": 74,
     "acc": 44.6
    },
    "nova": {
     "n": 82,
     "acc": 56.1
    },
    "flow": {
     "n": 29,
     "acc": 65.5
    }
   },
   "graded": 293
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2508,
    "diana": 0.2551,
    "nova": 0.2553,
    "flow": 0.2389
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 52.5
    },
    "diana": {
     "n": 251,
     "acc": 53.4
    },
    "nova": {
     "n": 204,
     "acc": 53.4
    },
    "flow": {
     "n": 26,
     "acc": 61.5
    }
   },
   "graded": 742
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3217,
    "diana": 0.1663,
    "nova": 0.3099,
    "flow": 0.2021
   },
   "acc": {
    "taro": {
     "n": 343,
     "acc": 58.0
    },
    "diana": {
     "n": 377,
     "acc": 28.9
    },
    "nova": {
     "n": 229,
     "acc": 55.9
    },
    "flow": {
     "n": 118,
     "acc": 36.4
    }
   },
   "graded": 1067
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
    "taro": 0.2644,
    "diana": 0.2738,
    "nova": 0.2222,
    "flow": 0.2396
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 55.2
    },
    "diana": {
     "n": 105,
     "acc": 57.1
    },
    "nova": {
     "n": 69,
     "acc": 46.4
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
    "taro": 0.2708,
    "diana": 0.232,
    "nova": 0.2635,
    "flow": 0.2337
   },
   "acc": {
    "taro": {
     "n": 769,
     "acc": 64.1
    },
    "diana": {
     "n": 659,
     "acc": 54.9
    },
    "nova": {
     "n": 606,
     "acc": 62.4
    },
    "flow": {
     "n": 103,
     "acc": 55.3
    }
   },
   "graded": 2137
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3073,
    "diana": 0.2355,
    "nova": 0.2894,
    "flow": 0.1678
   },
   "acc": {
    "taro": {
     "n": 347,
     "acc": 59.1
    },
    "diana": {
     "n": 391,
     "acc": 45.3
    },
    "nova": {
     "n": 266,
     "acc": 55.6
    },
    "flow": {
     "n": 31,
     "acc": 32.3
    }
   },
   "graded": 1035
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
    "taro": 0.3117,
    "diana": 0.1804,
    "nova": 0.2681,
    "flow": 0.2399
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 65.0
    },
    "diana": {
     "n": 133,
     "acc": 37.6
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
   "graded": 372
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2742,
    "diana": 0.1848,
    "nova": 0.2387,
    "flow": 0.3022
   },
   "acc": {
    "taro": {
     "n": 432,
     "acc": 68.1
    },
    "diana": {
     "n": 447,
     "acc": 45.9
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
   "graded": 1280
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.2923,
    "nova": 0.1582,
    "flow": 0.2691
   },
   "acc": {
    "taro": {
     "n": 79,
     "acc": 53.2
    },
    "diana": {
     "n": 83,
     "acc": 55.4
    },
    "nova": {
     "n": 37,
     "acc": 27.0
    },
    "flow": {
     "n": 49,
     "acc": 51.0
    }
   },
   "graded": 248
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2765,
    "diana": 0.2002,
    "nova": 0.268,
    "flow": 0.2553
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 54.2
    },
    "diana": {
     "n": 273,
     "acc": 39.2
    },
    "nova": {
     "n": 162,
     "acc": 52.5
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 704
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2436,
    "diana": 0.2357,
    "nova": 0.2384,
    "flow": 0.2823
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 43.1
    },
    "diana": {
     "n": 115,
     "acc": 41.7
    },
    "nova": {
     "n": 90,
     "acc": 42.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 358
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3076,
    "diana": 0.1794,
    "nova": 0.2894,
    "flow": 0.2237
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 60.0
    },
    "diana": {
     "n": 160,
     "acc": 35.0
    },
    "nova": {
     "n": 124,
     "acc": 56.5
    },
    "flow": {
     "n": 55,
     "acc": 43.6
    }
   },
   "graded": 514
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2417,
    "diana": 0.1793,
    "nova": 0.3011,
    "flow": 0.2778
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 43.5
    },
    "diana": {
     "n": 220,
     "acc": 32.3
    },
    "nova": {
     "n": 131,
     "acc": 54.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 528
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
    "taro": 0.1974,
    "diana": 0.3048,
    "nova": 0.1946,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 32.6
    },
    "diana": {
     "n": 193,
     "acc": 50.3
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
   "graded": 403
  },
  "여행레저": {
   "weights": {
    "taro": 0.305,
    "diana": 0.1552,
    "nova": 0.2813,
    "flow": 0.2586
   },
   "acc": {
    "taro": {
     "n": 78,
     "acc": 59.0
    },
    "diana": {
     "n": 64,
     "acc": 25.0
    },
    "nova": {
     "n": 57,
     "acc": 54.4
    },
    "flow": {
     "n": 27,
     "acc": 25.9
    }
   },
   "graded": 226
  }
 }
};
