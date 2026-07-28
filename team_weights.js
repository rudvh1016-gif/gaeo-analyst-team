// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 21:00",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.272,
   "diana": 0.2042,
   "nova": 0.2671,
   "flow": 0.2567
  },
  "acc": {
   "taro": {
    "n": 5594,
    "acc": 59.5
   },
   "diana": {
    "n": 5057,
    "acc": 44.7
   },
   "nova": {
    "n": 4209,
    "acc": 58.5
   },
   "flow": {
    "n": 977,
    "acc": 56.2
   }
  },
  "graded": 15837
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.1881,
    "nova": 0.2449,
    "flow": 0.2972
   },
   "acc": {
    "taro": {
     "n": 665,
     "acc": 62.1
    },
    "diana": {
     "n": 434,
     "acc": 43.3
    },
    "nova": {
     "n": 571,
     "acc": 56.4
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1895
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
    "taro": 0.2396,
    "diana": 0.2308,
    "nova": 0.2158,
    "flow": 0.3137
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 53.3
    },
    "diana": {
     "n": 263,
     "acc": 51.3
    },
    "nova": {
     "n": 225,
     "acc": 48.0
    },
    "flow": {
     "n": 43,
     "acc": 69.8
    }
   },
   "graded": 805
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3291,
    "diana": 0.1714,
    "nova": 0.3226,
    "flow": 0.1768
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 63.2
    },
    "diana": {
     "n": 243,
     "acc": 32.9
    },
    "nova": {
     "n": 163,
     "acc": 62.0
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 690
  },
  "통신": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.2106,
    "nova": 0.2709,
    "flow": 0.2378
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 59.0
    },
    "diana": {
     "n": 70,
     "acc": 44.3
    },
    "nova": {
     "n": 79,
     "acc": 57.0
    },
    "flow": {
     "n": 27,
     "acc": 66.7
    }
   },
   "graded": 276
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2496,
    "diana": 0.2592,
    "nova": 0.2533,
    "flow": 0.2379
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 52.5
    },
    "diana": {
     "n": 235,
     "acc": 54.5
    },
    "nova": {
     "n": 186,
     "acc": 53.2
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
    "taro": 0.3039,
    "diana": 0.1635,
    "nova": 0.3314,
    "flow": 0.2012
   },
   "acc": {
    "taro": {
     "n": 318,
     "acc": 56.0
    },
    "diana": {
     "n": 352,
     "acc": 30.1
    },
    "nova": {
     "n": 208,
     "acc": 61.1
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 994
  },
  "2차전지": {
   "weights": {
    "taro": 0.3012,
    "diana": 0.1967,
    "nova": 0.3012,
    "flow": 0.2008
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 79.4
    },
    "diana": {
     "n": 194,
     "acc": 49.0
    },
    "nova": {
     "n": 244,
     "acc": 79.9
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 741
  },
  "보험": {
   "weights": {
    "taro": 0.2547,
    "diana": 0.2744,
    "nova": 0.2373,
    "flow": 0.2335
   },
   "acc": {
    "taro": {
     "n": 110,
     "acc": 54.5
    },
    "diana": {
     "n": 97,
     "acc": 58.8
    },
    "nova": {
     "n": 61,
     "acc": 50.8
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 295
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2656,
    "diana": 0.2287,
    "nova": 0.2767,
    "flow": 0.2291
   },
   "acc": {
    "taro": {
     "n": 712,
     "acc": 63.3
    },
    "diana": {
     "n": 616,
     "acc": 54.5
    },
    "nova": {
     "n": 553,
     "acc": 66.0
    },
    "flow": {
     "n": 97,
     "acc": 54.6
    }
   },
   "graded": 1978
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2759,
    "diana": 0.2242,
    "nova": 0.2612,
    "flow": 0.2387
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 57.8
    },
    "diana": {
     "n": 364,
     "acc": 47.0
    },
    "nova": {
     "n": 243,
     "acc": 54.7
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
    "taro": 0.2738,
    "diana": 0.2222,
    "nova": 0.2425,
    "flow": 0.2615
   },
   "acc": {
    "taro": {
     "n": 191,
     "acc": 52.4
    },
    "diana": {
     "n": 193,
     "acc": 42.5
    },
    "nova": {
     "n": 151,
     "acc": 46.4
    },
    "flow": {
     "n": 18,
     "acc": 50.0
    }
   },
   "graded": 553
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3035,
    "diana": 0.1894,
    "nova": 0.2695,
    "flow": 0.2377
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 63.8
    },
    "diana": {
     "n": 123,
     "acc": 39.8
    },
    "nova": {
     "n": 97,
     "acc": 56.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 350
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2666,
    "diana": 0.1885,
    "nova": 0.2464,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 67.0
    },
    "diana": {
     "n": 418,
     "acc": 47.4
    },
    "nova": {
     "n": 315,
     "acc": 61.9
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1197
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
    "taro": 0.2713,
    "diana": 0.1979,
    "nova": 0.2757,
    "flow": 0.2552
   },
   "acc": {
    "taro": {
     "n": 239,
     "acc": 53.1
    },
    "diana": {
     "n": 258,
     "acc": 38.8
    },
    "nova": {
     "n": 150,
     "acc": 54.0
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 662
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
    "taro": 0.2944,
    "diana": 0.1869,
    "nova": 0.2861,
    "flow": 0.2326
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 58.4
    },
    "diana": {
     "n": 151,
     "acc": 37.1
    },
    "nova": {
     "n": 118,
     "acc": 56.8
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 487
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.238,
    "diana": 0.1751,
    "nova": 0.3082,
    "flow": 0.2788
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 42.7
    },
    "diana": {
     "n": 207,
     "acc": 31.4
    },
    "nova": {
     "n": 123,
     "acc": 55.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 494
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
    "taro": 0.192,
    "diana": 0.2975,
    "nova": 0.1974,
    "flow": 0.3132
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 30.6
    },
    "diana": {
     "n": 179,
     "acc": 47.5
    },
    "nova": {
     "n": 73,
     "acc": 31.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 376
  },
  "여행레저": {
   "weights": {
    "taro": 0.3032,
    "diana": 0.1544,
    "nova": 0.285,
    "flow": 0.2574
   },
   "acc": {
    "taro": {
     "n": 73,
     "acc": 58.9
    },
    "diana": {
     "n": 61,
     "acc": 23.0
    },
    "nova": {
     "n": 56,
     "acc": 55.4
    },
    "flow": {
     "n": 27,
     "acc": 25.9
    }
   },
   "graded": 217
  }
 }
};
