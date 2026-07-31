// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 11:25",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2828,
   "diana": 0.1914,
   "nova": 0.2712,
   "flow": 0.2546
  },
  "acc": {
   "taro": {
    "n": 6720,
    "acc": 61.8
   },
   "diana": {
    "n": 6110,
    "acc": 41.8
   },
   "nova": {
    "n": 5380,
    "acc": 59.3
   },
   "flow": {
    "n": 1168,
    "acc": 55.6
   }
  },
  "graded": 19378,
  "team": {
   "hit": 5284,
   "miss": 1297,
   "n": 6581,
   "acc": 80.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2956,
    "diana": 0.1763,
    "nova": 0.2251,
    "flow": 0.3029
   },
   "acc": {
    "taro": {
     "n": 813,
     "acc": 68.4
    },
    "diana": {
     "n": 532,
     "acc": 40.8
    },
    "nova": {
     "n": 699,
     "acc": 52.1
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2308
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3063,
    "diana": 0.1521,
    "nova": 0.2624,
    "flow": 0.2792
   },
   "acc": {
    "taro": {
     "n": 398,
     "acc": 77.4
    },
    "diana": {
     "n": 247,
     "acc": 37.2
    },
    "nova": {
     "n": 330,
     "acc": 64.2
    },
    "flow": {
     "n": 117,
     "acc": 68.4
    }
   },
   "graded": 1092
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2524,
    "diana": 0.2295,
    "nova": 0.2627,
    "flow": 0.2554
   },
   "acc": {
    "taro": {
     "n": 334,
     "acc": 53.6
    },
    "diana": {
     "n": 318,
     "acc": 48.7
    },
    "nova": {
     "n": 294,
     "acc": 55.8
    },
    "flow": {
     "n": 59,
     "acc": 54.2
    }
   },
   "graded": 1005
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3317,
    "diana": 0.1591,
    "nova": 0.3493,
    "flow": 0.1599
   },
   "acc": {
    "taro": {
     "n": 267,
     "acc": 62.5
    },
    "diana": {
     "n": 295,
     "acc": 28.5
    },
    "nova": {
     "n": 208,
     "acc": 65.9
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 833
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
    "taro": 0.3243,
    "diana": 0.164,
    "nova": 0.3141,
    "flow": 0.1975
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 59.3
    },
    "diana": {
     "n": 432,
     "acc": 26.2
    },
    "nova": {
     "n": 275,
     "acc": 57.5
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1212
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
     "n": 703,
     "acc": 62.9
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
    "taro": 0.3036,
    "diana": 0.2167,
    "nova": 0.3228,
    "flow": 0.1569
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 58.0
    },
    "diana": {
     "n": 437,
     "acc": 41.4
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
   "graded": 1176
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
    "taro": 0.2626,
    "diana": 0.2628,
    "nova": 0.223,
    "flow": 0.2516
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 49.5
    },
    "diana": {
     "n": 97,
     "acc": 49.5
    },
    "nova": {
     "n": 50,
     "acc": 42.0
    },
    "flow": {
     "n": 57,
     "acc": 47.4
    }
   },
   "graded": 295
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
    "taro": 0.248,
    "diana": 0.1857,
    "nova": 0.2913,
    "flow": 0.2751
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 45.1
    },
    "diana": {
     "n": 243,
     "acc": 33.7
    },
    "nova": {
     "n": 153,
     "acc": 52.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 589
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
    "taro": 0.1979,
    "diana": 0.3019,
    "nova": 0.2091,
    "flow": 0.2911
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 34.0
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
   "graded": 467
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
     "n": 87,
     "acc": 64.4
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
