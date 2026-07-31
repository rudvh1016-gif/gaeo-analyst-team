// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 11:12",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2826,
   "diana": 0.1918,
   "nova": 0.2713,
   "flow": 0.2543
  },
  "acc": {
   "taro": {
    "n": 6727,
    "acc": 61.8
   },
   "diana": {
    "n": 6114,
    "acc": 41.9
   },
   "nova": {
    "n": 5385,
    "acc": 59.3
   },
   "flow": {
    "n": 1168,
    "acc": 55.6
   }
  },
  "graded": 19394,
  "team": {
   "hit": 5288,
   "miss": 1300,
   "n": 6588,
   "acc": 80.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2949,
    "diana": 0.1773,
    "nova": 0.2258,
    "flow": 0.302
   },
   "acc": {
    "taro": {
     "n": 814,
     "acc": 68.2
    },
    "diana": {
     "n": 532,
     "acc": 41.0
    },
    "nova": {
     "n": 701,
     "acc": 52.2
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2312
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3062,
    "diana": 0.152,
    "nova": 0.2627,
    "flow": 0.2791
   },
   "acc": {
    "taro": {
     "n": 399,
     "acc": 77.4
    },
    "diana": {
     "n": 247,
     "acc": 37.2
    },
    "nova": {
     "n": 331,
     "acc": 64.4
    },
    "flow": {
     "n": 117,
     "acc": 68.4
    }
   },
   "graded": 1094
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2518,
    "diana": 0.2289,
    "nova": 0.2637,
    "flow": 0.2555
   },
   "acc": {
    "taro": {
     "n": 333,
     "acc": 53.5
    },
    "diana": {
     "n": 317,
     "acc": 48.6
    },
    "nova": {
     "n": 293,
     "acc": 56.0
    },
    "flow": {
     "n": 59,
     "acc": 54.2
    }
   },
   "graded": 1002
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3316,
    "diana": 0.1587,
    "nova": 0.3501,
    "flow": 0.1595
   },
   "acc": {
    "taro": {
     "n": 268,
     "acc": 62.7
    },
    "diana": {
     "n": 297,
     "acc": 27.9
    },
    "nova": {
     "n": 210,
     "acc": 66.2
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 838
  },
  "통신": {
   "weights": {
    "taro": 0.2614,
    "diana": 0.1885,
    "nova": 0.2643,
    "flow": 0.2859
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 60.2
    },
    "diana": {
     "n": 83,
     "acc": 43.4
    },
    "nova": {
     "n": 97,
     "acc": 60.8
    },
    "flow": {
     "n": 38,
     "acc": 65.8
    }
   },
   "graded": 341
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2323,
    "diana": 0.2291,
    "nova": 0.2705,
    "flow": 0.268
   },
   "acc": {
    "taro": {
     "n": 296,
     "acc": 50.3
    },
    "diana": {
     "n": 282,
     "acc": 49.6
    },
    "nova": {
     "n": 244,
     "acc": 58.6
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 853
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3235,
    "diana": 0.164,
    "nova": 0.3149,
    "flow": 0.1975
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 59.2
    },
    "diana": {
     "n": 433,
     "acc": 26.1
    },
    "nova": {
     "n": 276,
     "acc": 57.6
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1215
  },
  "2차전지": {
   "weights": {
    "taro": 0.3021,
    "diana": 0.1944,
    "nova": 0.3021,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 362,
     "acc": 82.6
    },
    "diana": {
     "n": 232,
     "acc": 48.3
    },
    "nova": {
     "n": 302,
     "acc": 75.8
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 898
  },
  "보험": {
   "weights": {
    "taro": 0.2618,
    "diana": 0.2491,
    "nova": 0.2678,
    "flow": 0.2213
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 53.4
    },
    "diana": {
     "n": 118,
     "acc": 50.8
    },
    "nova": {
     "n": 86,
     "acc": 54.7
    },
    "flow": {
     "n": 31,
     "acc": 45.2
    }
   },
   "graded": 366
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2764,
    "diana": 0.2241,
    "nova": 0.2606,
    "flow": 0.2388
   },
   "acc": {
    "taro": {
     "n": 856,
     "acc": 66.6
    },
    "diana": {
     "n": 741,
     "acc": 54.0
    },
    "nova": {
     "n": 704,
     "acc": 62.8
    },
    "flow": {
     "n": 113,
     "acc": 57.5
    }
   },
   "graded": 2414
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3029,
    "diana": 0.2182,
    "nova": 0.3223,
    "flow": 0.1567
   },
   "acc": {
    "taro": {
     "n": 388,
     "acc": 58.0
    },
    "diana": {
     "n": 438,
     "acc": 41.8
    },
    "nova": {
     "n": 316,
     "acc": 61.7
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1177
  },
  "조선": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.1862,
    "nova": 0.281,
    "flow": 0.2572
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 53.6
    },
    "diana": {
     "n": 232,
     "acc": 36.2
    },
    "nova": {
     "n": 194,
     "acc": 54.6
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 677
  },
  "방산": {
   "weights": {
    "taro": 0.2923,
    "diana": 0.155,
    "nova": 0.2943,
    "flow": 0.2584
   },
   "acc": {
    "taro": {
     "n": 99,
     "acc": 56.6
    },
    "diana": {
     "n": 44,
     "acc": 29.5
    },
    "nova": {
     "n": 72,
     "acc": 56.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 215
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.163,
    "nova": 0.2967,
    "flow": 0.2381
   },
   "acc": {
    "taro": {
     "n": 145,
     "acc": 63.4
    },
    "diana": {
     "n": 149,
     "acc": 34.2
    },
    "nova": {
     "n": 122,
     "acc": 62.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 416
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2687,
    "diana": 0.1708,
    "nova": 0.2573,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 66.5
    },
    "diana": {
     "n": 509,
     "acc": 42.2
    },
    "nova": {
     "n": 407,
     "acc": 63.6
    },
    "flow": {
     "n": 67,
     "acc": 77.6
    }
   },
   "graded": 1472
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2601,
    "diana": 0.2632,
    "nova": 0.2249,
    "flow": 0.2518
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 48.9
    },
    "diana": {
     "n": 99,
     "acc": 49.5
    },
    "nova": {
     "n": 52,
     "acc": 42.3
    },
    "flow": {
     "n": 57,
     "acc": 47.4
    }
   },
   "graded": 300
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2786,
    "diana": 0.1882,
    "nova": 0.2775,
    "flow": 0.2557
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 54.5
    },
    "diana": {
     "n": 307,
     "acc": 36.8
    },
    "nova": {
     "n": 199,
     "acc": 54.3
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 812
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2651,
    "diana": 0.2301,
    "nova": 0.2215,
    "flow": 0.2833
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 46.8
    },
    "diana": {
     "n": 133,
     "acc": 40.6
    },
    "nova": {
     "n": 110,
     "acc": 39.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 414
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3153,
    "diana": 0.163,
    "nova": 0.329,
    "flow": 0.1927
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 59.5
    },
    "diana": {
     "n": 182,
     "acc": 30.8
    },
    "nova": {
     "n": 153,
     "acc": 62.1
    },
    "flow": {
     "n": 66,
     "acc": 36.4
    }
   },
   "graded": 601
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2463,
    "diana": 0.1868,
    "nova": 0.2924,
    "flow": 0.2746
   },
   "acc": {
    "taro": {
     "n": 194,
     "acc": 44.8
    },
    "diana": {
     "n": 244,
     "acc": 34.0
    },
    "nova": {
     "n": 154,
     "acc": 53.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 592
  },
  "로봇": {
   "weights": {
    "taro": 0.2648,
    "diana": 0.2742,
    "nova": 0.2729,
    "flow": 0.188
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 70.4
    },
    "diana": {
     "n": 133,
     "acc": 72.9
    },
    "nova": {
     "n": 135,
     "acc": 72.6
    },
    "flow": {
     "n": 28,
     "acc": 53.6
    }
   },
   "graded": 455
  },
  "식음료": {
   "weights": {
    "taro": 0.2005,
    "diana": 0.3027,
    "nova": 0.2075,
    "flow": 0.2893
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 34.6
    },
    "diana": {
     "n": 216,
     "acc": 52.3
    },
    "nova": {
     "n": 106,
     "acc": 35.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 475
  },
  "여행레저": {
   "weights": {
    "taro": 0.3569,
    "diana": 0.1653,
    "nova": 0.3125,
    "flow": 0.1653
   },
   "acc": {
    "taro": {
     "n": 88,
     "acc": 64.8
    },
    "diana": {
     "n": 71,
     "acc": 22.5
    },
    "nova": {
     "n": 67,
     "acc": 56.7
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 257
  }
 }
};
