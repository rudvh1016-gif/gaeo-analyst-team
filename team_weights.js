// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 09:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2763,
   "diana": 0.2048,
   "nova": 0.2612,
   "flow": 0.2577
  },
  "acc": {
   "taro": {
    "n": 5981,
    "acc": 60.4
   },
   "diana": {
    "n": 5402,
    "acc": 44.7
   },
   "nova": {
    "n": 4544,
    "acc": 57.1
   },
   "flow": {
    "n": 1041,
    "acc": 56.3
   }
  },
  "graded": 16968,
  "team": {
   "hit": 4686,
   "miss": 1251,
   "n": 5937,
   "acc": 78.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.28,
    "diana": 0.1831,
    "nova": 0.2362,
    "flow": 0.3008
   },
   "acc": {
    "taro": {
     "n": 713,
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
   "graded": 2036
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3025,
    "diana": 0.1619,
    "nova": 0.2602,
    "flow": 0.2754
   },
   "acc": {
    "taro": {
     "n": 354,
     "acc": 74.6
    },
    "diana": {
     "n": 218,
     "acc": 39.9
    },
    "nova": {
     "n": 290,
     "acc": 64.1
    },
    "flow": {
     "n": 109,
     "acc": 67.9
    }
   },
   "graded": 971
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2503,
    "diana": 0.2317,
    "nova": 0.221,
    "flow": 0.2969
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 55.0
    },
    "diana": {
     "n": 277,
     "acc": 50.9
    },
    "nova": {
     "n": 241,
     "acc": 48.5
    },
    "flow": {
     "n": 46,
     "acc": 65.2
    }
   },
   "graded": 855
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3346,
    "diana": 0.1678,
    "nova": 0.3302,
    "flow": 0.1674
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 63.1
    },
    "diana": {
     "n": 259,
     "acc": 31.7
    },
    "nova": {
     "n": 175,
     "acc": 62.3
    },
    "flow": {
     "n": 57,
     "acc": 31.6
    }
   },
   "graded": 735
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
    "taro": 0.2501,
    "diana": 0.2581,
    "nova": 0.2535,
    "flow": 0.2383
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 52.5
    },
    "diana": {
     "n": 253,
     "acc": 54.2
    },
    "nova": {
     "n": 203,
     "acc": 53.2
    },
    "flow": {
     "n": 26,
     "acc": 61.5
    }
   },
   "graded": 743
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3202,
    "diana": 0.1664,
    "nova": 0.3114,
    "flow": 0.2021
   },
   "acc": {
    "taro": {
     "n": 343,
     "acc": 57.7
    },
    "diana": {
     "n": 377,
     "acc": 29.2
    },
    "nova": {
     "n": 228,
     "acc": 56.1
    },
    "flow": {
     "n": 118,
     "acc": 36.4
    }
   },
   "graded": 1066
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
    "taro": 0.2615,
    "diana": 0.2753,
    "nova": 0.2246,
    "flow": 0.2386
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 54.8
    },
    "diana": {
     "n": 104,
     "acc": 57.7
    },
    "nova": {
     "n": 68,
     "acc": 47.1
    },
    "flow": {
     "n": 29,
     "acc": 48.3
    }
   },
   "graded": 316
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2662,
    "diana": 0.2323,
    "nova": 0.2698,
    "flow": 0.2317
   },
   "acc": {
    "taro": {
     "n": 761,
     "acc": 63.1
    },
    "diana": {
     "n": 654,
     "acc": 55.0
    },
    "nova": {
     "n": 599,
     "acc": 63.9
    },
    "flow": {
     "n": 102,
     "acc": 54.9
    }
   },
   "graded": 2116
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3045,
    "diana": 0.2402,
    "nova": 0.2879,
    "flow": 0.1674
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 58.7
    },
    "diana": {
     "n": 389,
     "acc": 46.3
    },
    "nova": {
     "n": 265,
     "acc": 55.5
    },
    "flow": {
     "n": 31,
     "acc": 32.3
    }
   },
   "graded": 1031
  },
  "조선": {
   "weights": {
    "taro": 0.2779,
    "diana": 0.213,
    "nova": 0.2465,
    "flow": 0.2625
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 52.9
    },
    "diana": {
     "n": 207,
     "acc": 40.6
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
   "graded": 596
  },
  "철강·금속": {
   "weights": {
    "taro": 0.308,
    "diana": 0.1927,
    "nova": 0.2603,
    "flow": 0.239
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 64.4
    },
    "diana": {
     "n": 129,
     "acc": 40.3
    },
    "nova": {
     "n": 101,
     "acc": 54.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 365
  },
  "화학·소재": {
   "weights": {
    "taro": 0.272,
    "diana": 0.1889,
    "nova": 0.2376,
    "flow": 0.3015
   },
   "acc": {
    "taro": {
     "n": 433,
     "acc": 67.7
    },
    "diana": {
     "n": 447,
     "acc": 47.0
    },
    "nova": {
     "n": 340,
     "acc": 59.1
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
    "taro": 0.2779,
    "diana": 0.2982,
    "nova": 0.157,
    "flow": 0.2669
   },
   "acc": {
    "taro": {
     "n": 81,
     "acc": 53.1
    },
    "diana": {
     "n": 86,
     "acc": 57.0
    },
    "nova": {
     "n": 38,
     "acc": 28.9
    },
    "flow": {
     "n": 51,
     "acc": 51.0
    }
   },
   "graded": 256
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2706,
    "diana": 0.2064,
    "nova": 0.2691,
    "flow": 0.2538
   },
   "acc": {
    "taro": {
     "n": 257,
     "acc": 53.3
    },
    "diana": {
     "n": 278,
     "acc": 40.6
    },
    "nova": {
     "n": 166,
     "acc": 53.0
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 717
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2463,
    "diana": 0.2343,
    "nova": 0.2364,
    "flow": 0.2831
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 43.5
    },
    "diana": {
     "n": 116,
     "acc": 41.4
    },
    "nova": {
     "n": 91,
     "acc": 41.8
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
    "taro": 0.3009,
    "diana": 0.1878,
    "nova": 0.2892,
    "flow": 0.2222
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 59.1
    },
    "diana": {
     "n": 160,
     "acc": 36.9
    },
    "nova": {
     "n": 125,
     "acc": 56.8
    },
    "flow": {
     "n": 55,
     "acc": 43.6
    }
   },
   "graded": 516
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2252,
    "diana": 0.1885,
    "nova": 0.311,
    "flow": 0.2753
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 40.9
    },
    "diana": {
     "n": 219,
     "acc": 34.2
    },
    "nova": {
     "n": 131,
     "acc": 56.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 526
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
    "taro": 0.1973,
    "diana": 0.3068,
    "nova": 0.1954,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 32.8
    },
    "diana": {
     "n": 192,
     "acc": 51.0
    },
    "nova": {
     "n": 80,
     "acc": 32.5
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
    "taro": 0.2927,
    "diana": 0.1561,
    "nova": 0.291,
    "flow": 0.2602
   },
   "acc": {
    "taro": {
     "n": 80,
     "acc": 56.2
    },
    "diana": {
     "n": 66,
     "acc": 28.8
    },
    "nova": {
     "n": 59,
     "acc": 55.9
    },
    "flow": {
     "n": 29,
     "acc": 31.0
    }
   },
   "graded": 234
  }
 }
};
