// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 12:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2827,
   "diana": 0.1919,
   "nova": 0.2711,
   "flow": 0.2543
  },
  "acc": {
   "taro": {
    "n": 6726,
    "acc": 61.7
   },
   "diana": {
    "n": 6113,
    "acc": 41.9
   },
   "nova": {
    "n": 5386,
    "acc": 59.2
   },
   "flow": {
    "n": 1169,
    "acc": 55.5
   }
  },
  "graded": 19394,
  "team": {
   "hit": 5289,
   "miss": 1304,
   "n": 6593,
   "acc": 80.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.177,
    "nova": 0.2255,
    "flow": 0.3023
   },
   "acc": {
    "taro": {
     "n": 814,
     "acc": 68.2
    },
    "diana": {
     "n": 531,
     "acc": 40.9
    },
    "nova": {
     "n": 701,
     "acc": 52.1
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2311
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
    "taro": 0.3327,
    "diana": 0.1588,
    "nova": 0.3488,
    "flow": 0.1597
   },
   "acc": {
    "taro": {
     "n": 269,
     "acc": 62.8
    },
    "diana": {
     "n": 298,
     "acc": 27.9
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
   "graded": 841
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
    "taro": 0.2326,
    "diana": 0.231,
    "nova": 0.2681,
    "flow": 0.2683
   },
   "acc": {
    "taro": {
     "n": 294,
     "acc": 50.3
    },
    "diana": {
     "n": 280,
     "acc": 50.0
    },
    "nova": {
     "n": 243,
     "acc": 58.0
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 848
  },
  "금융·증권": {
   "weights": {
    "taro": 0.324,
    "diana": 0.1644,
    "nova": 0.3153,
    "flow": 0.1963
   },
   "acc": {
    "taro": {
     "n": 389,
     "acc": 59.1
    },
    "diana": {
     "n": 435,
     "acc": 26.0
    },
    "nova": {
     "n": 278,
     "acc": 57.6
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1222
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
     "n": 363,
     "acc": 82.4
    },
    "diana": {
     "n": 232,
     "acc": 48.3
    },
    "nova": {
     "n": 303,
     "acc": 75.6
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 900
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
    "taro": 0.2766,
    "diana": 0.2242,
    "nova": 0.2602,
    "flow": 0.2389
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
     "acc": 62.6
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
    "taro": 0.3035,
    "diana": 0.2167,
    "nova": 0.3225,
    "flow": 0.1573
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 57.9
    },
    "diana": {
     "n": 438,
     "acc": 41.3
    },
    "nova": {
     "n": 317,
     "acc": 61.5
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
    "taro": 0.2609,
    "diana": 0.2667,
    "nova": 0.2197,
    "flow": 0.2527
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 48.9
    },
    "diana": {
     "n": 98,
     "acc": 50.0
    },
    "nova": {
     "n": 51,
     "acc": 41.2
    },
    "flow": {
     "n": 57,
     "acc": 47.4
    }
   },
   "graded": 298
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.189,
    "nova": 0.2783,
    "flow": 0.2554
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 54.3
    },
    "diana": {
     "n": 308,
     "acc": 37.0
    },
    "nova": {
     "n": 200,
     "acc": 54.5
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 815
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
    "taro": 0.2449,
    "diana": 0.1882,
    "nova": 0.2923,
    "flow": 0.2745
   },
   "acc": {
    "taro": {
     "n": 195,
     "acc": 44.6
    },
    "diana": {
     "n": 245,
     "acc": 34.3
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
   "graded": 594
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
