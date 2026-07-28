// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 14:12",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.272,
   "diana": 0.2049,
   "nova": 0.2666,
   "flow": 0.2565
  },
  "acc": {
   "taro": {
    "n": 5599,
    "acc": 59.5
   },
   "diana": {
    "n": 5057,
    "acc": 44.8
   },
   "nova": {
    "n": 4212,
    "acc": 58.3
   },
   "flow": {
    "n": 977,
    "acc": 56.1
   }
  },
  "graded": 15845
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
    "diana": 0.1747,
    "nova": 0.319,
    "flow": 0.1773
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 63.0
    },
    "diana": {
     "n": 242,
     "acc": 33.5
    },
    "nova": {
     "n": 162,
     "acc": 61.1
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 687
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
    "taro": 0.3035,
    "diana": 0.1642,
    "nova": 0.3309,
    "flow": 0.2015
   },
   "acc": {
    "taro": {
     "n": 317,
     "acc": 55.8
    },
    "diana": {
     "n": 351,
     "acc": 30.2
    },
    "nova": {
     "n": 207,
     "acc": 60.9
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 991
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
     "n": 301,
     "acc": 79.4
    },
    "diana": {
     "n": 193,
     "acc": 49.2
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
   "graded": 740
  },
  "보험": {
   "weights": {
    "taro": 0.2565,
    "diana": 0.2776,
    "nova": 0.233,
    "flow": 0.233
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 55.0
    },
    "diana": {
     "n": 94,
     "acc": 59.6
    },
    "nova": {
     "n": 58,
     "acc": 50.0
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 288
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.2278,
    "nova": 0.2779,
    "flow": 0.2286
   },
   "acc": {
    "taro": {
     "n": 715,
     "acc": 63.5
    },
    "diana": {
     "n": 617,
     "acc": 54.5
    },
    "nova": {
     "n": 554,
     "acc": 66.4
    },
    "flow": {
     "n": 97,
     "acc": 54.6
    }
   },
   "graded": 1983
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2754,
    "diana": 0.2259,
    "nova": 0.2597,
    "flow": 0.239
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 57.6
    },
    "diana": {
     "n": 364,
     "acc": 47.3
    },
    "nova": {
     "n": 243,
     "acc": 54.3
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 964
  },
  "조선": {
   "weights": {
    "taro": 0.2714,
    "diana": 0.2334,
    "nova": 0.232,
    "flow": 0.2632
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 51.6
    },
    "diana": {
     "n": 194,
     "acc": 44.3
    },
    "nova": {
     "n": 152,
     "acc": 44.1
    },
    "flow": {
     "n": 17,
     "acc": 41.2
    }
   },
   "graded": 555
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
    "taro": 0.2663,
    "diana": 0.188,
    "nova": 0.2472,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 66.9
    },
    "diana": {
     "n": 417,
     "acc": 47.2
    },
    "nova": {
     "n": 314,
     "acc": 62.1
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1194
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.2987,
    "nova": 0.1564,
    "flow": 0.2606
   },
   "acc": {
    "taro": {
     "n": 77,
     "acc": 54.5
    },
    "diana": {
     "n": 82,
     "acc": 57.3
    },
    "nova": {
     "n": 36,
     "acc": 22.2
    },
    "flow": {
     "n": 48,
     "acc": 50.0
    }
   },
   "graded": 243
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.27,
    "diana": 0.1962,
    "nova": 0.2786,
    "flow": 0.2551
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 52.9
    },
    "diana": {
     "n": 260,
     "acc": 38.5
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
   "graded": 667
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
    "taro": 0.2966,
    "diana": 0.1863,
    "nova": 0.2852,
    "flow": 0.2319
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 59.0
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
    "taro": 0.2364,
    "diana": 0.1765,
    "nova": 0.3061,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 42.1
    },
    "diana": {
     "n": 207,
     "acc": 31.4
    },
    "nova": {
     "n": 123,
     "acc": 54.5
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
    "taro": 0.2666,
    "diana": 0.2664,
    "nova": 0.2664,
    "flow": 0.2007
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 66.4
    },
    "diana": {
     "n": 110,
     "acc": 66.4
    },
    "nova": {
     "n": 113,
     "acc": 66.4
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 372
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
