// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 13:12",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.272,
   "diana": 0.2058,
   "nova": 0.266,
   "flow": 0.2562
  },
  "acc": {
   "taro": {
    "n": 5595,
    "acc": 59.5
   },
   "diana": {
    "n": 5051,
    "acc": 45.0
   },
   "nova": {
    "n": 4205,
    "acc": 58.2
   },
   "flow": {
    "n": 976,
    "acc": 56.0
   }
  },
  "graded": 15827
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2695,
    "diana": 0.1886,
    "nova": 0.2446,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 664,
     "acc": 62.0
    },
    "diana": {
     "n": 433,
     "acc": 43.4
    },
    "nova": {
     "n": 570,
     "acc": 56.3
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1892
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2947,
    "diana": 0.1661,
    "nova": 0.2696,
    "flow": 0.2696
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 72.9
    },
    "diana": {
     "n": 207,
     "acc": 41.1
    },
    "nova": {
     "n": 270,
     "acc": 66.7
    },
    "flow": {
     "n": 102,
     "acc": 66.7
    }
   },
   "graded": 907
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2402,
    "diana": 0.2315,
    "nova": 0.2148,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 53.5
    },
    "diana": {
     "n": 264,
     "acc": 51.5
    },
    "nova": {
     "n": 226,
     "acc": 47.8
    },
    "flow": {
     "n": 43,
     "acc": 69.8
    }
   },
   "graded": 808
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3277,
    "diana": 0.1759,
    "nova": 0.3186,
    "flow": 0.1778
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 62.6
    },
    "diana": {
     "n": 241,
     "acc": 33.6
    },
    "nova": {
     "n": 161,
     "acc": 60.9
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 685
  },
  "통신": {
   "weights": {
    "taro": 0.2828,
    "diana": 0.2063,
    "nova": 0.2737,
    "flow": 0.2372
   },
   "acc": {
    "taro": {
     "n": 99,
     "acc": 59.6
    },
    "diana": {
     "n": 69,
     "acc": 43.5
    },
    "nova": {
     "n": 78,
     "acc": 57.7
    },
    "flow": {
     "n": 27,
     "acc": 66.7
    }
   },
   "graded": 273
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2483,
    "diana": 0.2619,
    "nova": 0.2513,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 52.0
    },
    "diana": {
     "n": 235,
     "acc": 54.9
    },
    "nova": {
     "n": 186,
     "acc": 52.7
    },
    "flow": {
     "n": 24,
     "acc": 58.3
    }
   },
   "graded": 689
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3037,
    "diana": 0.1665,
    "nova": 0.3281,
    "flow": 0.2017
   },
   "acc": {
    "taro": {
     "n": 319,
     "acc": 55.8
    },
    "diana": {
     "n": 353,
     "acc": 30.6
    },
    "nova": {
     "n": 209,
     "acc": 60.3
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 997
  },
  "2차전지": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1975,
    "nova": 0.3009,
    "flow": 0.2006
   },
   "acc": {
    "taro": {
     "n": 300,
     "acc": 79.3
    },
    "diana": {
     "n": 193,
     "acc": 49.2
    },
    "nova": {
     "n": 243,
     "acc": 79.8
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 738
  },
  "보험": {
   "weights": {
    "taro": 0.2585,
    "diana": 0.2802,
    "nova": 0.2286,
    "flow": 0.2327
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 55.6
    },
    "diana": {
     "n": 93,
     "acc": 60.2
    },
    "nova": {
     "n": 57,
     "acc": 49.1
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 285
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2656,
    "diana": 0.2287,
    "nova": 0.2774,
    "flow": 0.2284
   },
   "acc": {
    "taro": {
     "n": 713,
     "acc": 63.5
    },
    "diana": {
     "n": 616,
     "acc": 54.7
    },
    "nova": {
     "n": 553,
     "acc": 66.4
    },
    "flow": {
     "n": 97,
     "acc": 54.6
    }
   },
   "graded": 1979
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.2271,
    "nova": 0.2577,
    "flow": 0.239
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 57.8
    },
    "diana": {
     "n": 364,
     "acc": 47.5
    },
    "nova": {
     "n": 243,
     "acc": 53.9
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 963
  },
  "조선": {
   "weights": {
    "taro": 0.2706,
    "diana": 0.235,
    "nova": 0.2306,
    "flow": 0.2637
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 51.3
    },
    "diana": {
     "n": 193,
     "acc": 44.6
    },
    "nova": {
     "n": 151,
     "acc": 43.7
    },
    "flow": {
     "n": 17,
     "acc": 41.2
    }
   },
   "graded": 552
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.1875,
    "nova": 0.2711,
    "flow": 0.2372
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 64.1
    },
    "diana": {
     "n": 124,
     "acc": 39.5
    },
    "nova": {
     "n": 98,
     "acc": 57.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 353
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2666,
    "diana": 0.189,
    "nova": 0.2459,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 67.0
    },
    "diana": {
     "n": 417,
     "acc": 47.5
    },
    "nova": {
     "n": 314,
     "acc": 61.8
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1195
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2829,
    "diana": 0.2984,
    "nova": 0.1591,
    "flow": 0.2596
   },
   "acc": {
    "taro": {
     "n": 75,
     "acc": 53.3
    },
    "diana": {
     "n": 80,
     "acc": 56.2
    },
    "nova": {
     "n": 34,
     "acc": 23.5
    },
    "flow": {
     "n": 47,
     "acc": 48.9
    }
   },
   "graded": 236
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2698,
    "diana": 0.1969,
    "nova": 0.2784,
    "flow": 0.2549
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 52.9
    },
    "diana": {
     "n": 259,
     "acc": 38.6
    },
    "nova": {
     "n": 152,
     "acc": 54.6
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 666
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2397,
    "diana": 0.2286,
    "nova": 0.2433,
    "flow": 0.2884
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 41.5
    },
    "diana": {
     "n": 106,
     "acc": 39.6
    },
    "nova": {
     "n": 83,
     "acc": 42.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 331
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2956,
    "diana": 0.1902,
    "nova": 0.2818,
    "flow": 0.2325
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 58.7
    },
    "diana": {
     "n": 151,
     "acc": 37.7
    },
    "nova": {
     "n": 118,
     "acc": 55.9
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 488
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2367,
    "diana": 0.1775,
    "nova": 0.3044,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 42.1
    },
    "diana": {
     "n": 206,
     "acc": 31.6
    },
    "nova": {
     "n": 122,
     "acc": 54.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 492
  },
  "로봇": {
   "weights": {
    "taro": 0.2654,
    "diana": 0.2678,
    "nova": 0.2677,
    "flow": 0.199
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 66.7
    },
    "diana": {
     "n": 110,
     "acc": 67.3
    },
    "nova": {
     "n": 113,
     "acc": 67.3
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 373
  },
  "식음료": {
   "weights": {
    "taro": 0.1941,
    "diana": 0.2999,
    "nova": 0.1919,
    "flow": 0.3141
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 30.9
    },
    "diana": {
     "n": 178,
     "acc": 47.8
    },
    "nova": {
     "n": 72,
     "acc": 30.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 373
  },
  "여행레저": {
   "weights": {
    "taro": 0.3019,
    "diana": 0.1558,
    "nova": 0.2825,
    "flow": 0.2597
   },
   "acc": {
    "taro": {
     "n": 74,
     "acc": 58.1
    },
    "diana": {
     "n": 62,
     "acc": 24.2
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
   "graded": 220
  }
 }
};
