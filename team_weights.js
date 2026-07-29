// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 09:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2757,
   "diana": 0.2049,
   "nova": 0.2622,
   "flow": 0.2573
  },
  "acc": {
   "taro": {
    "n": 5971,
    "acc": 60.2
   },
   "diana": {
    "n": 5391,
    "acc": 44.7
   },
   "nova": {
    "n": 4536,
    "acc": 57.2
   },
   "flow": {
    "n": 1040,
    "acc": 56.2
   }
  },
  "graded": 16938,
  "team": {
   "hit": 4707,
   "miss": 1258,
   "n": 5965,
   "acc": 78.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.183,
    "nova": 0.2367,
    "flow": 0.301
   },
   "acc": {
    "taro": {
     "n": 712,
     "acc": 64.2
    },
    "diana": {
     "n": 466,
     "acc": 42.1
    },
    "nova": {
     "n": 614,
     "acc": 54.4
    },
    "flow": {
     "n": 240,
     "acc": 69.2
    }
   },
   "graded": 2032
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3001,
    "diana": 0.1646,
    "nova": 0.2603,
    "flow": 0.275
   },
   "acc": {
    "taro": {
     "n": 355,
     "acc": 74.1
    },
    "diana": {
     "n": 219,
     "acc": 40.6
    },
    "nova": {
     "n": 291,
     "acc": 64.3
    },
    "flow": {
     "n": 109,
     "acc": 67.9
    }
   },
   "graded": 974
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2513,
    "diana": 0.2303,
    "nova": 0.2212,
    "flow": 0.2972
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 55.1
    },
    "diana": {
     "n": 277,
     "acc": 50.5
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
   "graded": 856
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.335,
    "diana": 0.1667,
    "nova": 0.3306,
    "flow": 0.1676
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 63.1
    },
    "diana": {
     "n": 258,
     "acc": 31.4
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
   "graded": 734
  },
  "통신": {
   "weights": {
    "taro": 0.2791,
    "diana": 0.2133,
    "nova": 0.2684,
    "flow": 0.2392
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 58.3
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
    "taro": 0.2521,
    "diana": 0.2564,
    "nova": 0.2523,
    "flow": 0.2393
   },
   "acc": {
    "taro": {
     "n": 262,
     "acc": 52.7
    },
    "diana": {
     "n": 252,
     "acc": 53.6
    },
    "nova": {
     "n": 203,
     "acc": 52.7
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
    "taro": 0.3226,
    "diana": 0.1665,
    "nova": 0.3088,
    "flow": 0.2022
   },
   "acc": {
    "taro": {
     "n": 344,
     "acc": 58.1
    },
    "diana": {
     "n": 378,
     "acc": 28.8
    },
    "nova": {
     "n": 230,
     "acc": 55.7
    },
    "flow": {
     "n": 118,
     "acc": 36.4
    }
   },
   "graded": 1070
  },
  "2차전지": {
   "weights": {
    "taro": 0.3012,
    "diana": 0.1969,
    "nova": 0.3012,
    "flow": 0.2008
   },
   "acc": {
    "taro": {
     "n": 321,
     "acc": 80.7
    },
    "diana": {
     "n": 206,
     "acc": 49.0
    },
    "nova": {
     "n": 260,
     "acc": 75.0
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 789
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
    "taro": 0.2639,
    "diana": 0.2309,
    "nova": 0.2752,
    "flow": 0.23
   },
   "acc": {
    "taro": {
     "n": 760,
     "acc": 62.4
    },
    "diana": {
     "n": 654,
     "acc": 54.6
    },
    "nova": {
     "n": 598,
     "acc": 65.1
    },
    "flow": {
     "n": 103,
     "acc": 54.4
    }
   },
   "graded": 2115
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3056,
    "diana": 0.2397,
    "nova": 0.2871,
    "flow": 0.1676
   },
   "acc": {
    "taro": {
     "n": 345,
     "acc": 58.8
    },
    "diana": {
     "n": 390,
     "acc": 46.2
    },
    "nova": {
     "n": 266,
     "acc": 55.3
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
    "taro": 0.2758,
    "diana": 0.2164,
    "nova": 0.2449,
    "flow": 0.2628
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 52.5
    },
    "diana": {
     "n": 204,
     "acc": 41.2
    },
    "nova": {
     "n": 161,
     "acc": 46.6
    },
    "flow": {
     "n": 21,
     "acc": 52.4
    }
   },
   "graded": 588
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3046,
    "diana": 0.1971,
    "nova": 0.261,
    "flow": 0.2373
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 64.2
    },
    "diana": {
     "n": 130,
     "acc": 41.5
    },
    "nova": {
     "n": 100,
     "acc": 55.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 364
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2714,
    "diana": 0.1907,
    "nova": 0.2365,
    "flow": 0.3015
   },
   "acc": {
    "taro": {
     "n": 434,
     "acc": 67.5
    },
    "diana": {
     "n": 447,
     "acc": 47.4
    },
    "nova": {
     "n": 340,
     "acc": 58.8
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
    "taro": 0.2739,
    "diana": 0.2955,
    "nova": 0.1688,
    "flow": 0.2618
   },
   "acc": {
    "taro": {
     "n": 80,
     "acc": 51.2
    },
    "diana": {
     "n": 85,
     "acc": 55.3
    },
    "nova": {
     "n": 38,
     "acc": 31.6
    },
    "flow": {
     "n": 49,
     "acc": 49.0
    }
   },
   "graded": 252
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.274,
    "diana": 0.2039,
    "nova": 0.268,
    "flow": 0.254
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 53.9
    },
    "diana": {
     "n": 274,
     "acc": 40.1
    },
    "nova": {
     "n": 163,
     "acc": 52.8
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 707
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2387,
    "diana": 0.2394,
    "nova": 0.2408,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 42.5
    },
    "diana": {
     "n": 115,
     "acc": 42.6
    },
    "nova": {
     "n": 91,
     "acc": 42.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 359
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
    "taro": 0.2225,
    "diana": 0.1917,
    "nova": 0.3108,
    "flow": 0.2751
   },
   "acc": {
    "taro": {
     "n": 178,
     "acc": 40.4
    },
    "diana": {
     "n": 221,
     "acc": 34.8
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
   "graded": 530
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
    "taro": 0.1925,
    "diana": 0.3077,
    "nova": 0.1969,
    "flow": 0.3029
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 31.8
    },
    "diana": {
     "n": 191,
     "acc": 50.8
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
   "graded": 400
  },
  "여행레저": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.156,
    "nova": 0.2908,
    "flow": 0.26
   },
   "acc": {
    "taro": {
     "n": 78,
     "acc": 56.4
    },
    "diana": {
     "n": 65,
     "acc": 27.7
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
   "graded": 231
  }
 }
};
