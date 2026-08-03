// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 10:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2849,
   "diana": 0.1892,
   "nova": 0.2688,
   "flow": 0.2572
  },
  "acc": {
   "taro": {
    "n": 7081,
    "acc": 61.9
   },
   "diana": {
    "n": 6442,
    "acc": 41.1
   },
   "nova": {
    "n": 5751,
    "acc": 58.4
   },
   "flow": {
    "n": 1231,
    "acc": 55.9
   }
  },
  "graded": 20505,
  "team": {
   "hit": 5605,
   "miss": 1351,
   "n": 6956,
   "acc": 80.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2987,
    "diana": 0.1743,
    "nova": 0.2183,
    "flow": 0.3087
   },
   "acc": {
    "taro": {
     "n": 860,
     "acc": 68.6
    },
    "diana": {
     "n": 562,
     "acc": 40.0
    },
    "nova": {
     "n": 746,
     "acc": 50.1
    },
    "flow": {
     "n": 275,
     "acc": 70.9
    }
   },
   "graded": 2443
  },
  "전자·부품": {
   "weights": {
    "taro": 0.31,
    "diana": 0.1526,
    "nova": 0.2529,
    "flow": 0.2846
   },
   "acc": {
    "taro": {
     "n": 423,
     "acc": 77.8
    },
    "diana": {
     "n": 260,
     "acc": 36.9
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
   "graded": 1158
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
    "taro": 0.3319,
    "diana": 0.159,
    "nova": 0.3406,
    "flow": 0.1686
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 62.6
    },
    "diana": {
     "n": 314,
     "acc": 29.3
    },
    "nova": {
     "n": 224,
     "acc": 64.3
    },
    "flow": {
     "n": 66,
     "acc": 31.8
    }
   },
   "graded": 885
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
    "taro": 0.2301,
    "diana": 0.2255,
    "nova": 0.2664,
    "flow": 0.278
   },
   "acc": {
    "taro": {
     "n": 313,
     "acc": 50.2
    },
    "diana": {
     "n": 293,
     "acc": 49.1
    },
    "nova": {
     "n": 260,
     "acc": 58.1
    },
    "flow": {
     "n": 33,
     "acc": 60.6
    }
   },
   "graded": 899
  },
  "금융·증권": {
   "weights": {
    "taro": 0.327,
    "diana": 0.1653,
    "nova": 0.3103,
    "flow": 0.1974
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 59.4
    },
    "diana": {
     "n": 456,
     "acc": 25.0
    },
    "nova": {
     "n": 293,
     "acc": 56.3
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1275
  },
  "2차전지": {
   "weights": {
    "taro": 0.3049,
    "diana": 0.1958,
    "nova": 0.2959,
    "flow": 0.2033
   },
   "acc": {
    "taro": {
     "n": 383,
     "acc": 83.0
    },
    "diana": {
     "n": 245,
     "acc": 48.2
    },
    "nova": {
     "n": 316,
     "acc": 72.8
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 946
  },
  "보험": {
   "weights": {
    "taro": 0.2637,
    "diana": 0.2377,
    "nova": 0.2734,
    "flow": 0.2251
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 53.2
    },
    "diana": {
     "n": 125,
     "acc": 48.0
    },
    "nova": {
     "n": 96,
     "acc": 55.2
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 393
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2772,
    "diana": 0.2215,
    "nova": 0.2599,
    "flow": 0.2414
   },
   "acc": {
    "taro": {
     "n": 896,
     "acc": 66.7
    },
    "diana": {
     "n": 778,
     "acc": 53.3
    },
    "nova": {
     "n": 748,
     "acc": 62.6
    },
    "flow": {
     "n": 117,
     "acc": 58.1
    }
   },
   "graded": 2539
  },
  "지주·상사": {
   "weights": {
    "taro": 0.305,
    "diana": 0.2138,
    "nova": 0.3231,
    "flow": 0.1581
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 57.9
    },
    "diana": {
     "n": 461,
     "acc": 40.6
    },
    "nova": {
     "n": 336,
     "acc": 61.3
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1239
  },
  "조선": {
   "weights": {
    "taro": 0.2826,
    "diana": 0.1793,
    "nova": 0.2798,
    "flow": 0.2583
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 54.7
    },
    "diana": {
     "n": 245,
     "acc": 34.7
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
   "graded": 716
  },
  "방산": {
   "weights": {
    "taro": 0.2954,
    "diana": 0.1573,
    "nova": 0.2887,
    "flow": 0.2585
   },
   "acc": {
    "taro": {
     "n": 105,
     "acc": 57.1
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
   "graded": 229
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1692,
    "nova": 0.2914,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 149,
     "acc": 63.1
    },
    "diana": {
     "n": 155,
     "acc": 35.5
    },
    "nova": {
     "n": 126,
     "acc": 61.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 430
  },
  "화학·소재": {
   "weights": {
    "taro": 0.27,
    "diana": 0.1651,
    "nova": 0.2591,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 515,
     "acc": 66.2
    },
    "diana": {
     "n": 541,
     "acc": 40.5
    },
    "nova": {
     "n": 436,
     "acc": 63.5
    },
    "flow": {
     "n": 72,
     "acc": 77.8
    }
   },
   "graded": 1564
  },
  "물류·운송": {
   "weights": {
    "taro": 0.259,
    "diana": 0.2518,
    "nova": 0.2438,
    "flow": 0.2454
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 48.5
    },
    "diana": {
     "n": 104,
     "acc": 47.1
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
   "graded": 319
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
    "taro": 0.3226,
    "diana": 0.1621,
    "nova": 0.3327,
    "flow": 0.1826
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 59.7
    },
    "diana": {
     "n": 192,
     "acc": 29.2
    },
    "nova": {
     "n": 164,
     "acc": 61.6
    },
    "flow": {
     "n": 71,
     "acc": 33.8
    }
   },
   "graded": 638
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2443,
    "diana": 0.1853,
    "nova": 0.2966,
    "flow": 0.2738
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 44.6
    },
    "diana": {
     "n": 260,
     "acc": 33.8
    },
    "nova": {
     "n": 168,
     "acc": 54.2
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 633
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
    "taro": 0.2609,
    "diana": 0.2708,
    "nova": 0.2695,
    "flow": 0.1987
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 67.6
    },
    "diana": {
     "n": 141,
     "acc": 70.2
    },
    "nova": {
     "n": 146,
     "acc": 69.9
    },
    "flow": {
     "n": 33,
     "acc": 51.5
    }
   },
   "graded": 490
  },
  "식음료": {
   "weights": {
    "taro": 0.1929,
    "diana": 0.2987,
    "nova": 0.2226,
    "flow": 0.2858
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 33.8
    },
    "diana": {
     "n": 222,
     "acc": 52.3
    },
    "nova": {
     "n": 113,
     "acc": 38.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 495
  },
  "여행레저": {
   "weights": {
    "taro": 0.3597,
    "diana": 0.1628,
    "nova": 0.3079,
    "flow": 0.1696
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 66.3
    },
    "diana": {
     "n": 76,
     "acc": 22.4
    },
    "nova": {
     "n": 74,
     "acc": 56.8
    },
    "flow": {
     "n": 32,
     "acc": 31.2
    }
   },
   "graded": 274
  }
 }
};
