// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 12:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.279,
   "diana": 0.1913,
   "nova": 0.2785,
   "flow": 0.2512
  },
  "acc": {
   "taro": {
    "n": 4849,
    "acc": 61.8
   },
   "diana": {
    "n": 4379,
    "acc": 42.4
   },
   "nova": {
    "n": 3387,
    "acc": 61.7
   },
   "flow": {
    "n": 868,
    "acc": 55.6
   }
  },
  "graded": 13483
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.1932,
    "nova": 0.234,
    "flow": 0.3
   },
   "acc": {
    "taro": {
     "n": 578,
     "acc": 61.2
    },
    "diana": {
     "n": 378,
     "acc": 43.4
    },
    "nova": {
     "n": 474,
     "acc": 52.5
    },
    "flow": {
     "n": 193,
     "acc": 67.4
    }
   },
   "graded": 1623
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3014,
    "diana": 0.1571,
    "nova": 0.2751,
    "flow": 0.2664
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 75.4
    },
    "diana": {
     "n": 179,
     "acc": 39.1
    },
    "nova": {
     "n": 222,
     "acc": 68.5
    },
    "flow": {
     "n": 92,
     "acc": 66.3
    }
   },
   "graded": 777
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2379,
    "diana": 0.2181,
    "nova": 0.2169,
    "flow": 0.3271
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 54.5
    },
    "diana": {
     "n": 224,
     "acc": 50.0
    },
    "nova": {
     "n": 179,
     "acc": 49.7
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
    "taro": 0.3379,
    "diana": 0.1637,
    "nova": 0.3191,
    "flow": 0.1793
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 66.5
    },
    "diana": {
     "n": 208,
     "acc": 32.2
    },
    "nova": {
     "n": 129,
     "acc": 62.8
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 588
  },
  "통신": {
   "weights": {
    "taro": 0.2917,
    "diana": 0.1858,
    "nova": 0.2903,
    "flow": 0.2322
   },
   "acc": {
    "taro": {
     "n": 86,
     "acc": 62.8
    },
    "diana": {
     "n": 60,
     "acc": 40.0
    },
    "nova": {
     "n": 64,
     "acc": 62.5
    },
    "flow": {
     "n": 24,
     "acc": 70.8
    }
   },
   "graded": 234
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2533,
    "diana": 0.2482,
    "nova": 0.266,
    "flow": 0.2324
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 54.5
    },
    "diana": {
     "n": 206,
     "acc": 53.4
    },
    "nova": {
     "n": 152,
     "acc": 57.2
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 589
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3013,
    "diana": 0.1619,
    "nova": 0.3277,
    "flow": 0.209
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 55.8
    },
    "diana": {
     "n": 305,
     "acc": 28.5
    },
    "nova": {
     "n": 163,
     "acc": 60.7
    },
    "flow": {
     "n": 111,
     "acc": 38.7
    }
   },
   "graded": 853
  },
  "2차전지": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1942,
    "nova": 0.3022,
    "flow": 0.2015
   },
   "acc": {
    "taro": {
     "n": 259,
     "acc": 81.9
    },
    "diana": {
     "n": 166,
     "acc": 48.2
    },
    "nova": {
     "n": 200,
     "acc": 82.5
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 626
  },
  "보험": {
   "weights": {
    "taro": 0.2594,
    "diana": 0.2493,
    "nova": 0.2559,
    "flow": 0.2354
   },
   "acc": {
    "taro": {
     "n": 98,
     "acc": 55.1
    },
    "diana": {
     "n": 85,
     "acc": 52.9
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
   "graded": 253
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2741,
    "diana": 0.2214,
    "nova": 0.2945,
    "flow": 0.21
   },
   "acc": {
    "taro": {
     "n": 608,
     "acc": 67.6
    },
    "diana": {
     "n": 533,
     "acc": 54.6
    },
    "nova": {
     "n": 446,
     "acc": 72.6
    },
    "flow": {
     "n": 83,
     "acc": 51.8
    }
   },
   "graded": 1670
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2853,
    "diana": 0.2114,
    "nova": 0.2713,
    "flow": 0.232
   },
   "acc": {
    "taro": {
     "n": 283,
     "acc": 61.5
    },
    "diana": {
     "n": 316,
     "acc": 45.6
    },
    "nova": {
     "n": 195,
     "acc": 58.5
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 820
  },
  "조선": {
   "weights": {
    "taro": 0.2872,
    "diana": 0.1986,
    "nova": 0.2592,
    "flow": 0.2551
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 56.3
    },
    "diana": {
     "n": 167,
     "acc": 38.9
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
   "graded": 471
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3191,
    "diana": 0.1545,
    "nova": 0.2968,
    "flow": 0.2296
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 69.5
    },
    "diana": {
     "n": 110,
     "acc": 33.6
    },
    "nova": {
     "n": 82,
     "acc": 64.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 310
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1788,
    "nova": 0.2568,
    "flow": 0.2907
   },
   "acc": {
    "taro": {
     "n": 354,
     "acc": 70.6
    },
    "diana": {
     "n": 362,
     "acc": 46.1
    },
    "nova": {
     "n": 255,
     "acc": 66.3
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1023
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
    "taro": 0.2705,
    "diana": 0.1811,
    "nova": 0.2893,
    "flow": 0.2591
   },
   "acc": {
    "taro": {
     "n": 205,
     "acc": 52.2
    },
    "diana": {
     "n": 226,
     "acc": 35.0
    },
    "nova": {
     "n": 120,
     "acc": 55.8
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 564
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2356,
    "diana": 0.198,
    "nova": 0.266,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 39.2
    },
    "diana": {
     "n": 88,
     "acc": 33.0
    },
    "nova": {
     "n": 61,
     "acc": 44.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 274
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3011,
    "diana": 0.1662,
    "nova": 0.2997,
    "flow": 0.2329
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 59.5
    },
    "diana": {
     "n": 131,
     "acc": 32.8
    },
    "nova": {
     "n": 98,
     "acc": 59.2
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 427
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2491,
    "diana": 0.1461,
    "nova": 0.3612,
    "flow": 0.2435
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 51.1
    },
    "diana": {
     "n": 175,
     "acc": 20.0
    },
    "nova": {
     "n": 89,
     "acc": 74.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 395
  },
  "로봇": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.2655,
    "nova": 0.2742,
    "flow": 0.1882
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 72.3
    },
    "diana": {
     "n": 95,
     "acc": 70.5
    },
    "nova": {
     "n": 92,
     "acc": 72.8
    },
    "flow": {
     "n": 12,
     "acc": 25.0
    }
   },
   "graded": 318
  },
  "식음료": {
   "weights": {
    "taro": 0.1932,
    "diana": 0.2391,
    "nova": 0.265,
    "flow": 0.3028
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 31.9
    },
    "diana": {
     "n": 152,
     "acc": 39.5
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
