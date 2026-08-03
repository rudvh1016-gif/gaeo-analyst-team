// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 12:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2849,
   "diana": 0.19,
   "nova": 0.2689,
   "flow": 0.2563
  },
  "acc": {
   "taro": {
    "n": 7064,
    "acc": 61.7
   },
   "diana": {
    "n": 6425,
    "acc": 41.2
   },
   "nova": {
    "n": 5734,
    "acc": 58.3
   },
   "flow": {
    "n": 1228,
    "acc": 55.5
   }
  },
  "graded": 20451,
  "team": {
   "hit": 5591,
   "miss": 1355,
   "n": 6946,
   "acc": 80.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2993,
    "diana": 0.1734,
    "nova": 0.2182,
    "flow": 0.3091
   },
   "acc": {
    "taro": {
     "n": 862,
     "acc": 68.7
    },
    "diana": {
     "n": 563,
     "acc": 39.8
    },
    "nova": {
     "n": 747,
     "acc": 50.1
    },
    "flow": {
     "n": 275,
     "acc": 70.9
    }
   },
   "graded": 2447
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3098,
    "diana": 0.1531,
    "nova": 0.2527,
    "flow": 0.2844
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 77.5
    },
    "diana": {
     "n": 259,
     "acc": 37.1
    },
    "nova": {
     "n": 353,
     "acc": 61.2
    },
    "flow": {
     "n": 122,
     "acc": 68.9
    }
   },
   "graded": 1156
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2585,
    "diana": 0.2258,
    "nova": 0.2605,
    "flow": 0.2552
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 54.7
    },
    "diana": {
     "n": 335,
     "acc": 47.8
    },
    "nova": {
     "n": 314,
     "acc": 55.1
    },
    "flow": {
     "n": 63,
     "acc": 54.0
    }
   },
   "graded": 1065
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3293,
    "diana": 0.159,
    "nova": 0.3431,
    "flow": 0.1686
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 62.1
    },
    "diana": {
     "n": 313,
     "acc": 29.7
    },
    "nova": {
     "n": 224,
     "acc": 64.7
    },
    "flow": {
     "n": 66,
     "acc": 31.8
    }
   },
   "graded": 883
  },
  "통신": {
   "weights": {
    "taro": 0.258,
    "diana": 0.1878,
    "nova": 0.2605,
    "flow": 0.2937
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 60.0
    },
    "diana": {
     "n": 87,
     "acc": 43.7
    },
    "nova": {
     "n": 104,
     "acc": 60.6
    },
    "flow": {
     "n": 41,
     "acc": 68.3
    }
   },
   "graded": 362
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.232,
    "diana": 0.2282,
    "nova": 0.2669,
    "flow": 0.2729
   },
   "acc": {
    "taro": {
     "n": 311,
     "acc": 50.5
    },
    "diana": {
     "n": 292,
     "acc": 49.7
    },
    "nova": {
     "n": 260,
     "acc": 58.1
    },
    "flow": {
     "n": 32,
     "acc": 59.4
    }
   },
   "graded": 895
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3261,
    "diana": 0.165,
    "nova": 0.3118,
    "flow": 0.1971
   },
   "acc": {
    "taro": {
     "n": 403,
     "acc": 59.3
    },
    "diana": {
     "n": 454,
     "acc": 24.9
    },
    "nova": {
     "n": 291,
     "acc": 56.7
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1268
  },
  "2차전지": {
   "weights": {
    "taro": 0.3036,
    "diana": 0.1966,
    "nova": 0.2975,
    "flow": 0.2024
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 82.3
    },
    "diana": {
     "n": 245,
     "acc": 48.6
    },
    "nova": {
     "n": 317,
     "acc": 73.5
    },
    "flow": {
     "n": 3,
     "acc": 33.3
    }
   },
   "graded": 949
  },
  "보험": {
   "weights": {
    "taro": 0.2652,
    "diana": 0.2393,
    "nova": 0.2707,
    "flow": 0.2248
   },
   "acc": {
    "taro": {
     "n": 138,
     "acc": 53.6
    },
    "diana": {
     "n": 124,
     "acc": 48.4
    },
    "nova": {
     "n": 95,
     "acc": 54.7
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 390
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2782,
    "diana": 0.2228,
    "nova": 0.2567,
    "flow": 0.2424
   },
   "acc": {
    "taro": {
     "n": 889,
     "acc": 66.1
    },
    "diana": {
     "n": 770,
     "acc": 53.0
    },
    "nova": {
     "n": 739,
     "acc": 61.0
    },
    "flow": {
     "n": 118,
     "acc": 57.6
    }
   },
   "graded": 2516
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3047,
    "diana": 0.2152,
    "nova": 0.3222,
    "flow": 0.1579
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 57.9
    },
    "diana": {
     "n": 460,
     "acc": 40.9
    },
    "nova": {
     "n": 335,
     "acc": 61.2
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1237
  },
  "조선": {
   "weights": {
    "taro": 0.2814,
    "diana": 0.1806,
    "nova": 0.2797,
    "flow": 0.2583
   },
   "acc": {
    "taro": {
     "n": 235,
     "acc": 54.5
    },
    "diana": {
     "n": 246,
     "acc": 35.0
    },
    "nova": {
     "n": 205,
     "acc": 54.1
    },
    "flow": {
     "n": 32,
     "acc": 50.0
    }
   },
   "graded": 718
  },
  "방산": {
   "weights": {
    "taro": 0.2939,
    "diana": 0.1577,
    "nova": 0.2893,
    "flow": 0.2591
   },
   "acc": {
    "taro": {
     "n": 104,
     "acc": 56.7
    },
    "diana": {
     "n": 46,
     "acc": 30.4
    },
    "nova": {
     "n": 77,
     "acc": 55.8
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 228
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2991,
    "diana": 0.1738,
    "nova": 0.2882,
    "flow": 0.2389
   },
   "acc": {
    "taro": {
     "n": 147,
     "acc": 62.6
    },
    "diana": {
     "n": 154,
     "acc": 36.4
    },
    "nova": {
     "n": 126,
     "acc": 60.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 427
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.1653,
    "nova": 0.2593,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 514,
     "acc": 66.1
    },
    "diana": {
     "n": 540,
     "acc": 40.6
    },
    "nova": {
     "n": 434,
     "acc": 63.6
    },
    "flow": {
     "n": 71,
     "acc": 77.5
    }
   },
   "graded": 1559
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2584,
    "diana": 0.2587,
    "nova": 0.2407,
    "flow": 0.2422
   },
   "acc": {
    "taro": {
     "n": 98,
     "acc": 49.0
    },
    "diana": {
     "n": 104,
     "acc": 49.0
    },
    "nova": {
     "n": 57,
     "acc": 45.6
    },
    "flow": {
     "n": 61,
     "acc": 45.9
    }
   },
   "graded": 320
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2777,
    "diana": 0.1842,
    "nova": 0.2838,
    "flow": 0.2543
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 54.6
    },
    "diana": {
     "n": 323,
     "acc": 36.2
    },
    "nova": {
     "n": 215,
     "acc": 55.8
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 858
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2665,
    "diana": 0.2184,
    "nova": 0.2331,
    "flow": 0.282
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 47.3
    },
    "diana": {
     "n": 142,
     "acc": 38.7
    },
    "nova": {
     "n": 121,
     "acc": 41.3
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 446
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3241,
    "diana": 0.162,
    "nova": 0.3313,
    "flow": 0.1826
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 60.0
    },
    "diana": {
     "n": 192,
     "acc": 29.2
    },
    "nova": {
     "n": 163,
     "acc": 61.3
    },
    "flow": {
     "n": 71,
     "acc": 33.8
    }
   },
   "graded": 636
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2433,
    "diana": 0.1879,
    "nova": 0.2943,
    "flow": 0.2744
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 44.3
    },
    "diana": {
     "n": 257,
     "acc": 34.2
    },
    "nova": {
     "n": 166,
     "acc": 53.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 626
  },
  "기계": {
   "weights": {
    "taro": 0.2134,
    "diana": 0.2049,
    "nova": 0.3027,
    "flow": 0.279
   },
   "acc": {
    "taro": {
     "n": 68,
     "acc": 38.2
    },
    "diana": {
     "n": 79,
     "acc": 36.7
    },
    "nova": {
     "n": 59,
     "acc": 54.2
    },
    "flow": {
     "n": 3,
     "acc": 100.0
    }
   },
   "graded": 209
  },
  "로봇": {
   "weights": {
    "taro": 0.2625,
    "diana": 0.272,
    "nova": 0.2809,
    "flow": 0.1846
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 66.7
    },
    "diana": {
     "n": 139,
     "acc": 69.1
    },
    "nova": {
     "n": 143,
     "acc": 71.3
    },
    "flow": {
     "n": 32,
     "acc": 46.9
    }
   },
   "graded": 482
  },
  "식음료": {
   "weights": {
    "taro": 0.1933,
    "diana": 0.2961,
    "nova": 0.2258,
    "flow": 0.2847
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 34.0
    },
    "diana": {
     "n": 225,
     "acc": 52.0
    },
    "nova": {
     "n": 116,
     "acc": 39.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 503
  },
  "여행레저": {
   "weights": {
    "taro": 0.3594,
    "diana": 0.1635,
    "nova": 0.3136,
    "flow": 0.1635
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 65.9
    },
    "diana": {
     "n": 76,
     "acc": 22.4
    },
    "nova": {
     "n": 73,
     "acc": 57.5
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 271
  }
 }
};
