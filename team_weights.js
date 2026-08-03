// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 10:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2852,
   "diana": 0.19,
   "nova": 0.2683,
   "flow": 0.2565
  },
  "acc": {
   "taro": {
    "n": 7067,
    "acc": 61.8
   },
   "diana": {
    "n": 6432,
    "acc": 41.2
   },
   "nova": {
    "n": 5738,
    "acc": 58.2
   },
   "flow": {
    "n": 1230,
    "acc": 55.6
   }
  },
  "graded": 20467,
  "team": {
   "hit": 5588,
   "miss": 1356,
   "n": 6944,
   "acc": 80.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3003,
    "diana": 0.1735,
    "nova": 0.2174,
    "flow": 0.3087
   },
   "acc": {
    "taro": {
     "n": 861,
     "acc": 68.9
    },
    "diana": {
     "n": 563,
     "acc": 39.8
    },
    "nova": {
     "n": 746,
     "acc": 49.9
    },
    "flow": {
     "n": 274,
     "acc": 70.8
    }
   },
   "graded": 2444
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
    "taro": 0.3309,
    "diana": 0.1588,
    "nova": 0.3419,
    "flow": 0.1684
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 62.5
    },
    "diana": {
     "n": 313,
     "acc": 29.4
    },
    "nova": {
     "n": 223,
     "acc": 64.6
    },
    "flow": {
     "n": 66,
     "acc": 31.8
    }
   },
   "graded": 882
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
    "taro": 0.2317,
    "diana": 0.2309,
    "nova": 0.2697,
    "flow": 0.2677
   },
   "acc": {
    "taro": {
     "n": 313,
     "acc": 49.8
    },
    "diana": {
     "n": 294,
     "acc": 49.7
    },
    "nova": {
     "n": 262,
     "acc": 58.0
    },
    "flow": {
     "n": 33,
     "acc": 57.6
    }
   },
   "graded": 902
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3267,
    "diana": 0.1654,
    "nova": 0.3104,
    "flow": 0.1975
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 59.3
    },
    "diana": {
     "n": 455,
     "acc": 25.1
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
   "graded": 1273
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
     "n": 3,
     "acc": 66.7
    }
   },
   "graded": 947
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
    "taro": 0.2774,
    "diana": 0.2223,
    "nova": 0.2573,
    "flow": 0.243
   },
   "acc": {
    "taro": {
     "n": 889,
     "acc": 66.4
    },
    "diana": {
     "n": 771,
     "acc": 53.2
    },
    "nova": {
     "n": 741,
     "acc": 61.5
    },
    "flow": {
     "n": 117,
     "acc": 58.1
    }
   },
   "graded": 2518
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3047,
    "diana": 0.2136,
    "nova": 0.3238,
    "flow": 0.1579
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
     "n": 335,
     "acc": 61.5
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1238
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
    "taro": 0.2962,
    "diana": 0.176,
    "nova": 0.2886,
    "flow": 0.2392
   },
   "acc": {
    "taro": {
     "n": 147,
     "acc": 61.9
    },
    "diana": {
     "n": 155,
     "acc": 36.8
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
   "graded": 428
  },
  "화학·소재": {
   "weights": {
    "taro": 0.27,
    "diana": 0.1654,
    "nova": 0.2587,
    "flow": 0.3059
   },
   "acc": {
    "taro": {
     "n": 515,
     "acc": 66.2
    },
    "diana": {
     "n": 540,
     "acc": 40.6
    },
    "nova": {
     "n": 435,
     "acc": 63.4
    },
    "flow": {
     "n": 72,
     "acc": 77.8
    }
   },
   "graded": 1562
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2578,
    "diana": 0.2556,
    "nova": 0.245,
    "flow": 0.2416
   },
   "acc": {
    "taro": {
     "n": 98,
     "acc": 49.0
    },
    "diana": {
     "n": 105,
     "acc": 48.6
    },
    "nova": {
     "n": 58,
     "acc": 46.6
    },
    "flow": {
     "n": 61,
     "acc": 45.9
    }
   },
   "graded": 322
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2778,
    "diana": 0.1844,
    "nova": 0.2827,
    "flow": 0.2551
   },
   "acc": {
    "taro": {
     "n": 303,
     "acc": 54.5
    },
    "diana": {
     "n": 321,
     "acc": 36.1
    },
    "nova": {
     "n": 213,
     "acc": 55.4
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 853
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2676,
    "diana": 0.2204,
    "nova": 0.2307,
    "flow": 0.2814
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 47.5
    },
    "diana": {
     "n": 143,
     "acc": 39.2
    },
    "nova": {
     "n": 122,
     "acc": 41.0
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 449
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
    "taro": 0.2435,
    "diana": 0.1909,
    "nova": 0.291,
    "flow": 0.2746
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 44.3
    },
    "diana": {
     "n": 259,
     "acc": 34.7
    },
    "nova": {
     "n": 168,
     "acc": 53.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 630
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
    "taro": 0.2621,
    "diana": 0.272,
    "nova": 0.2857,
    "flow": 0.1803
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 66.1
    },
    "diana": {
     "n": 140,
     "acc": 68.6
    },
    "nova": {
     "n": 143,
     "acc": 72.0
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 484
  },
  "식음료": {
   "weights": {
    "taro": 0.1964,
    "diana": 0.3024,
    "nova": 0.2155,
    "flow": 0.2857
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 34.4
    },
    "diana": {
     "n": 223,
     "acc": 52.9
    },
    "nova": {
     "n": 114,
     "acc": 37.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 497
  },
  "여행레저": {
   "weights": {
    "taro": 0.3609,
    "diana": 0.1633,
    "nova": 0.3057,
    "flow": 0.1701
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 66.3
    },
    "diana": {
     "n": 75,
     "acc": 22.7
    },
    "nova": {
     "n": 73,
     "acc": 56.2
    },
    "flow": {
     "n": 32,
     "acc": 31.2
    }
   },
   "graded": 272
  }
 }
};
