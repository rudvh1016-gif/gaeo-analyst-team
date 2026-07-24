// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 10:14",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2751,
   "diana": 0.2015,
   "nova": 0.268,
   "flow": 0.2554
  },
  "acc": {
   "taro": {
    "n": 4852,
    "acc": 59.6
   },
   "diana": {
    "n": 4405,
    "acc": 43.7
   },
   "nova": {
    "n": 3396,
    "acc": 58.1
   },
   "flow": {
    "n": 860,
    "acc": 55.3
   }
  },
  "graded": 13513
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.1982,
    "nova": 0.2287,
    "flow": 0.3018
   },
   "acc": {
    "taro": {
     "n": 570,
     "acc": 59.3
    },
    "diana": {
     "n": 374,
     "acc": 43.3
    },
    "nova": {
     "n": 466,
     "acc": 50.0
    },
    "flow": {
     "n": 191,
     "acc": 66.0
    }
   },
   "graded": 1601
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.1562,
    "nova": 0.2758,
    "flow": 0.2638
   },
   "acc": {
    "taro": {
     "n": 286,
     "acc": 74.8
    },
    "diana": {
     "n": 177,
     "acc": 38.4
    },
    "nova": {
     "n": 224,
     "acc": 67.9
    },
    "flow": {
     "n": 94,
     "acc": 64.9
    }
   },
   "graded": 781
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2326,
    "diana": 0.2239,
    "nova": 0.2076,
    "flow": 0.3358
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 51.9
    },
    "diana": {
     "n": 224,
     "acc": 50.0
    },
    "nova": {
     "n": 179,
     "acc": 46.4
    },
    "flow": {
     "n": 37,
     "acc": 75.7
    }
   },
   "graded": 671
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3274,
    "diana": 0.1915,
    "nova": 0.2968,
    "flow": 0.1843
   },
   "acc": {
    "taro": {
     "n": 201,
     "acc": 62.7
    },
    "diana": {
     "n": 210,
     "acc": 36.7
    },
    "nova": {
     "n": 132,
     "acc": 56.8
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 594
  },
  "통신": {
   "weights": {
    "taro": 0.2827,
    "diana": 0.2003,
    "nova": 0.2712,
    "flow": 0.2458
   },
   "acc": {
    "taro": {
     "n": 80,
     "acc": 57.5
    },
    "diana": {
     "n": 54,
     "acc": 40.7
    },
    "nova": {
     "n": 58,
     "acc": 55.2
    },
    "flow": {
     "n": 22,
     "acc": 68.2
    }
   },
   "graded": 214
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2495,
    "diana": 0.263,
    "nova": 0.2514,
    "flow": 0.2362
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 52.8
    },
    "diana": {
     "n": 212,
     "acc": 55.7
    },
    "nova": {
     "n": 156,
     "acc": 53.2
    },
    "flow": {
     "n": 22,
     "acc": 54.5
    }
   },
   "graded": 604
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2977,
    "diana": 0.1727,
    "nova": 0.3112,
    "flow": 0.2184
   },
   "acc": {
    "taro": {
     "n": 279,
     "acc": 53.8
    },
    "diana": {
     "n": 311,
     "acc": 31.2
    },
    "nova": {
     "n": 169,
     "acc": 56.2
    },
    "flow": {
     "n": 109,
     "acc": 39.4
    }
   },
   "graded": 868
  },
  "2차전지": {
   "weights": {
    "taro": 0.3015,
    "diana": 0.1961,
    "nova": 0.3015,
    "flow": 0.201
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 77.6
    },
    "diana": {
     "n": 164,
     "acc": 48.8
    },
    "nova": {
     "n": 197,
     "acc": 77.2
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 617
  },
  "보험": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.2604,
    "nova": 0.2484,
    "flow": 0.2286
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 57.4
    },
    "diana": {
     "n": 79,
     "acc": 57.0
    },
    "nova": {
     "n": 46,
     "acc": 54.3
    },
    "flow": {
     "n": 24,
     "acc": 58.3
    }
   },
   "graded": 243
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2691,
    "diana": 0.2265,
    "nova": 0.2861,
    "flow": 0.2183
   },
   "acc": {
    "taro": {
     "n": 610,
     "acc": 65.2
    },
    "diana": {
     "n": 537,
     "acc": 54.9
    },
    "nova": {
     "n": 444,
     "acc": 69.4
    },
    "flow": {
     "n": 85,
     "acc": 52.9
    }
   },
   "graded": 1676
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.2275,
    "nova": 0.254,
    "flow": 0.2381
   },
   "acc": {
    "taro": {
     "n": 282,
     "acc": 58.9
    },
    "diana": {
     "n": 314,
     "acc": 47.8
    },
    "nova": {
     "n": 195,
     "acc": 53.3
    },
    "flow": {
     "n": 24,
     "acc": 37.5
    }
   },
   "graded": 815
  },
  "조선": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.2022,
    "nova": 0.2591,
    "flow": 0.255
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 55.6
    },
    "diana": {
     "n": 169,
     "acc": 39.6
    },
    "nova": {
     "n": 124,
     "acc": 50.8
    },
    "flow": {
     "n": 13,
     "acc": 53.8
    }
   },
   "graded": 475
  },
  "철강·금속": {
   "weights": {
    "taro": 0.316,
    "diana": 0.161,
    "nova": 0.2918,
    "flow": 0.2312
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 68.3
    },
    "diana": {
     "n": 112,
     "acc": 34.8
    },
    "nova": {
     "n": 84,
     "acc": 63.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 316
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2688,
    "diana": 0.1894,
    "nova": 0.2415,
    "flow": 0.3003
   },
   "acc": {
    "taro": {
     "n": 359,
     "acc": 67.1
    },
    "diana": {
     "n": 370,
     "acc": 47.3
    },
    "nova": {
     "n": 257,
     "acc": 60.3
    },
    "flow": {
     "n": 52,
     "acc": 76.9
    }
   },
   "graded": 1038
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2663,
    "diana": 0.2718,
    "nova": 0.2452,
    "flow": 0.2167
   },
   "acc": {
    "taro": {
     "n": 70,
     "acc": 54.3
    },
    "diana": {
     "n": 74,
     "acc": 55.4
    },
    "nova": {
     "n": 28,
     "acc": 21.4
    },
    "flow": {
     "n": 43,
     "acc": 44.2
    }
   },
   "graded": 215
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2681,
    "diana": 0.1917,
    "nova": 0.2809,
    "flow": 0.2593
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 51.7
    },
    "diana": {
     "n": 230,
     "acc": 37.0
    },
    "nova": {
     "n": 120,
     "acc": 54.2
    },
    "flow": {
     "n": 11,
     "acc": 81.8
    }
   },
   "graded": 568
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2343,
    "diana": 0.2106,
    "nova": 0.2562,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 39.2
    },
    "diana": {
     "n": 88,
     "acc": 35.2
    },
    "nova": {
     "n": 63,
     "acc": 42.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 276
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2972,
    "diana": 0.1781,
    "nova": 0.2894,
    "flow": 0.2353
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 58.1
    },
    "diana": {
     "n": 135,
     "acc": 34.8
    },
    "nova": {
     "n": 99,
     "acc": 56.6
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 432
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2445,
    "diana": 0.156,
    "nova": 0.3394,
    "flow": 0.26
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 47.0
    },
    "diana": {
     "n": 179,
     "acc": 25.1
    },
    "nova": {
     "n": 95,
     "acc": 65.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 408
  },
  "로봇": {
   "weights": {
    "taro": 0.2705,
    "diana": 0.2606,
    "nova": 0.266,
    "flow": 0.2029
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 66.7
    },
    "diana": {
     "n": 95,
     "acc": 64.2
    },
    "nova": {
     "n": 90,
     "acc": 65.6
    },
    "flow": {
     "n": 10,
     "acc": 30.0
    }
   },
   "graded": 312
  },
  "식음료": {
   "weights": {
    "taro": 0.195,
    "diana": 0.2418,
    "nova": 0.2628,
    "flow": 0.3004
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 32.5
    },
    "diana": {
     "n": 154,
     "acc": 40.3
    },
    "nova": {
     "n": 48,
     "acc": 43.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 316
  }
 }
};
