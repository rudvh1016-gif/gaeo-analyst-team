// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 10:25",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2825,
   "diana": 0.1921,
   "nova": 0.2716,
   "flow": 0.2539
  },
  "acc": {
   "taro": {
    "n": 6724,
    "acc": 61.7
   },
   "diana": {
    "n": 6112,
    "acc": 41.9
   },
   "nova": {
    "n": 5380,
    "acc": 59.3
   },
   "flow": {
    "n": 1169,
    "acc": 55.4
   }
  },
  "graded": 19385,
  "team": {
   "hit": 5297,
   "miss": 1304,
   "n": 6601,
   "acc": 80.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2938,
    "diana": 0.1778,
    "nova": 0.2262,
    "flow": 0.3021
   },
   "acc": {
    "taro": {
     "n": 816,
     "acc": 67.9
    },
    "diana": {
     "n": 533,
     "acc": 41.1
    },
    "nova": {
     "n": 702,
     "acc": 52.3
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2316
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3065,
    "diana": 0.1522,
    "nova": 0.2618,
    "flow": 0.2795
   },
   "acc": {
    "taro": {
     "n": 399,
     "acc": 77.2
    },
    "diana": {
     "n": 247,
     "acc": 37.2
    },
    "nova": {
     "n": 331,
     "acc": 64.0
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
    "taro": 0.3295,
    "diana": 0.1592,
    "nova": 0.3513,
    "flow": 0.1601
   },
   "acc": {
    "taro": {
     "n": 269,
     "acc": 62.1
    },
    "diana": {
     "n": 297,
     "acc": 28.6
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
   "graded": 839
  },
  "통신": {
   "weights": {
    "taro": 0.2624,
    "diana": 0.1911,
    "nova": 0.2612,
    "flow": 0.2854
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 60.5
    },
    "diana": {
     "n": 84,
     "acc": 44.0
    },
    "nova": {
     "n": 98,
     "acc": 60.2
    },
    "flow": {
     "n": 38,
     "acc": 65.8
    }
   },
   "graded": 344
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2342,
    "diana": 0.2319,
    "nova": 0.2657,
    "flow": 0.2683
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 50.7
    },
    "diana": {
     "n": 279,
     "acc": 50.2
    },
    "nova": {
     "n": 240,
     "acc": 57.5
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 842
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3232,
    "diana": 0.1643,
    "nova": 0.3163,
    "flow": 0.1962
   },
   "acc": {
    "taro": {
     "n": 388,
     "acc": 59.0
    },
    "diana": {
     "n": 434,
     "acc": 26.0
    },
    "nova": {
     "n": 277,
     "acc": 57.8
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1219
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
    "taro": 0.2602,
    "diana": 0.2474,
    "nova": 0.2707,
    "flow": 0.2216
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 53.0
    },
    "diana": {
     "n": 119,
     "acc": 50.4
    },
    "nova": {
     "n": 87,
     "acc": 55.2
    },
    "flow": {
     "n": 31,
     "acc": 45.2
    }
   },
   "graded": 369
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.224,
    "nova": 0.2609,
    "flow": 0.2387
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
     "n": 703,
     "acc": 62.9
    },
    "flow": {
     "n": 113,
     "acc": 57.5
    }
   },
   "graded": 2413
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.2172,
    "nova": 0.3234,
    "flow": 0.1566
   },
   "acc": {
    "taro": {
     "n": 388,
     "acc": 58.0
    },
    "diana": {
     "n": 440,
     "acc": 41.6
    },
    "nova": {
     "n": 318,
     "acc": 61.9
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1181
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
    "taro": 0.2585,
    "diana": 0.2564,
    "nova": 0.2411,
    "flow": 0.2439
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 48.4
    },
    "diana": {
     "n": 98,
     "acc": 48.0
    },
    "nova": {
     "n": 51,
     "acc": 45.1
    },
    "flow": {
     "n": 57,
     "acc": 45.6
    }
   },
   "graded": 297
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.1886,
    "nova": 0.2786,
    "flow": 0.2554
   },
   "acc": {
    "taro": {
     "n": 289,
     "acc": 54.3
    },
    "diana": {
     "n": 306,
     "acc": 36.9
    },
    "nova": {
     "n": 198,
     "acc": 54.5
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 809
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
    "taro": 0.3126,
    "diana": 0.1631,
    "nova": 0.3295,
    "flow": 0.1947
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 59.3
    },
    "diana": {
     "n": 181,
     "acc": 30.9
    },
    "nova": {
     "n": 152,
     "acc": 62.5
    },
    "flow": {
     "n": 65,
     "acc": 36.9
    }
   },
   "graded": 597
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2467,
    "diana": 0.1862,
    "nova": 0.2934,
    "flow": 0.2737
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 45.1
    },
    "diana": {
     "n": 244,
     "acc": 34.0
    },
    "nova": {
     "n": 153,
     "acc": 53.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 590
  },
  "로봇": {
   "weights": {
    "taro": 0.264,
    "diana": 0.2747,
    "nova": 0.2715,
    "flow": 0.1898
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 69.6
    },
    "diana": {
     "n": 134,
     "acc": 72.4
    },
    "nova": {
     "n": 137,
     "acc": 71.5
    },
    "flow": {
     "n": 29,
     "acc": 51.7
    }
   },
   "graded": 461
  },
  "식음료": {
   "weights": {
    "taro": 0.1999,
    "diana": 0.3012,
    "nova": 0.2086,
    "flow": 0.2903
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 34.4
    },
    "diana": {
     "n": 214,
     "acc": 51.9
    },
    "nova": {
     "n": 103,
     "acc": 35.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 468
  },
  "여행레저": {
   "weights": {
    "taro": 0.3567,
    "diana": 0.1663,
    "nova": 0.3107,
    "flow": 0.1663
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 64.4
    },
    "diana": {
     "n": 70,
     "acc": 22.9
    },
    "nova": {
     "n": 66,
     "acc": 56.1
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 254
  }
 }
};
