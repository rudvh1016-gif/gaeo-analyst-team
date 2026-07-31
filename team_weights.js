// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 09:12",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2831,
   "diana": 0.1907,
   "nova": 0.2718,
   "flow": 0.2544
  },
  "acc": {
   "taro": {
    "n": 6726,
    "acc": 61.9
   },
   "diana": {
    "n": 6116,
    "acc": 41.7
   },
   "nova": {
    "n": 5386,
    "acc": 59.5
   },
   "flow": {
    "n": 1168,
    "acc": 55.7
   }
  },
  "graded": 19396,
  "team": {
   "hit": 5273,
   "miss": 1290,
   "n": 6563,
   "acc": 80.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2957,
    "diana": 0.1762,
    "nova": 0.2249,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 815,
     "acc": 68.5
    },
    "diana": {
     "n": 532,
     "acc": 40.8
    },
    "nova": {
     "n": 701,
     "acc": 52.1
    },
    "flow": {
     "n": 265,
     "acc": 70.2
    }
   },
   "graded": 2313
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
    "taro": 0.2513,
    "diana": 0.2283,
    "nova": 0.2646,
    "flow": 0.2557
   },
   "acc": {
    "taro": {
     "n": 334,
     "acc": 53.3
    },
    "diana": {
     "n": 318,
     "acc": 48.4
    },
    "nova": {
     "n": 294,
     "acc": 56.1
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
    "taro": 0.3331,
    "diana": 0.1587,
    "nova": 0.3486,
    "flow": 0.1596
   },
   "acc": {
    "taro": {
     "n": 270,
     "acc": 63.0
    },
    "diana": {
     "n": 299,
     "acc": 27.8
    },
    "nova": {
     "n": 211,
     "acc": 65.9
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 843
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
    "taro": 0.2321,
    "diana": 0.2289,
    "nova": 0.2704,
    "flow": 0.2686
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 50.2
    },
    "diana": {
     "n": 281,
     "acc": 49.5
    },
    "nova": {
     "n": 243,
     "acc": 58.4
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 850
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
     "acc": 25.9
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
    "taro": 0.3016,
    "diana": 0.1958,
    "nova": 0.3016,
    "flow": 0.201
   },
   "acc": {
    "taro": {
     "n": 362,
     "acc": 82.9
    },
    "diana": {
     "n": 232,
     "acc": 48.7
    },
    "nova": {
     "n": 302,
     "acc": 76.2
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
    "taro": 0.2761,
    "diana": 0.2243,
    "nova": 0.2614,
    "flow": 0.2381
   },
   "acc": {
    "taro": {
     "n": 853,
     "acc": 66.7
    },
    "diana": {
     "n": 740,
     "acc": 54.2
    },
    "nova": {
     "n": 703,
     "acc": 63.2
    },
    "flow": {
     "n": 113,
     "acc": 57.5
    }
   },
   "graded": 2409
  },
  "지주·상사": {
   "weights": {
    "taro": 0.305,
    "diana": 0.2151,
    "nova": 0.3229,
    "flow": 0.157
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 58.3
    },
    "diana": {
     "n": 438,
     "acc": 41.1
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
   "graded": 1175
  },
  "조선": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.185,
    "nova": 0.2828,
    "flow": 0.2574
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 53.4
    },
    "diana": {
     "n": 231,
     "acc": 35.9
    },
    "nova": {
     "n": 193,
     "acc": 54.9
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 674
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
    "taro": 0.3021,
    "diana": 0.1619,
    "nova": 0.298,
    "flow": 0.238
   },
   "acc": {
    "taro": {
     "n": 145,
     "acc": 63.4
    },
    "diana": {
     "n": 150,
     "acc": 34.0
    },
    "nova": {
     "n": 123,
     "acc": 62.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 418
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2687,
    "diana": 0.1704,
    "nova": 0.2576,
    "flow": 0.3032
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 66.5
    },
    "diana": {
     "n": 510,
     "acc": 42.2
    },
    "nova": {
     "n": 408,
     "acc": 63.7
    },
    "flow": {
     "n": 67,
     "acc": 77.6
    }
   },
   "graded": 1474
  },
  "물류·운송": {
   "weights": {
    "taro": 0.259,
    "diana": 0.2512,
    "nova": 0.2465,
    "flow": 0.2432
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 49.5
    },
    "diana": {
     "n": 98,
     "acc": 48.0
    },
    "nova": {
     "n": 51,
     "acc": 47.1
    },
    "flow": {
     "n": 56,
     "acc": 46.4
    }
   },
   "graded": 296
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2788,
    "diana": 0.1861,
    "nova": 0.2784,
    "flow": 0.2567
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 54.3
    },
    "diana": {
     "n": 309,
     "acc": 36.2
    },
    "nova": {
     "n": 201,
     "acc": 54.2
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 817
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
    "taro": 0.2543,
    "diana": 0.1791,
    "nova": 0.2956,
    "flow": 0.2709
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 46.9
    },
    "diana": {
     "n": 245,
     "acc": 33.1
    },
    "nova": {
     "n": 154,
     "acc": 54.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 595
  },
  "로봇": {
   "weights": {
    "taro": 0.2652,
    "diana": 0.2738,
    "nova": 0.2733,
    "flow": 0.1877
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 70.6
    },
    "diana": {
     "n": 133,
     "acc": 72.9
    },
    "nova": {
     "n": 136,
     "acc": 72.8
    },
    "flow": {
     "n": 29,
     "acc": 55.2
    }
   },
   "graded": 458
  },
  "식음료": {
   "weights": {
    "taro": 0.196,
    "diana": 0.2997,
    "nova": 0.2141,
    "flow": 0.2902
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 33.8
    },
    "diana": {
     "n": 213,
     "acc": 51.6
    },
    "nova": {
     "n": 103,
     "acc": 36.9
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
    "taro": 0.357,
    "diana": 0.1644,
    "nova": 0.3142,
    "flow": 0.1644
   },
   "acc": {
    "taro": {
     "n": 89,
     "acc": 65.2
    },
    "diana": {
     "n": 72,
     "acc": 22.2
    },
    "nova": {
     "n": 68,
     "acc": 57.4
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 260
  }
 }
};
