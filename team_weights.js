// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 14:14",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2851,
   "diana": 0.1891,
   "nova": 0.2685,
   "flow": 0.2573
  },
  "acc": {
   "taro": {
    "n": 7083,
    "acc": 61.9
   },
   "diana": {
    "n": 6446,
    "acc": 41.0
   },
   "nova": {
    "n": 5754,
    "acc": 58.3
   },
   "flow": {
    "n": 1230,
    "acc": 55.9
   }
  },
  "graded": 20513,
  "team": {
   "hit": 5591,
   "miss": 1350,
   "n": 6941,
   "acc": 80.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3002,
    "diana": 0.1736,
    "nova": 0.2169,
    "flow": 0.3093
   },
   "acc": {
    "taro": {
     "n": 862,
     "acc": 68.9
    },
    "diana": {
     "n": 562,
     "acc": 39.9
    },
    "nova": {
     "n": 747,
     "acc": 49.8
    },
    "flow": {
     "n": 276,
     "acc": 71.0
    }
   },
   "graded": 2447
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
     "n": 422,
     "acc": 77.7
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
   "graded": 1157
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
    "taro": 0.231,
    "diana": 0.2271,
    "nova": 0.2676,
    "flow": 0.2743
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 50.0
    },
    "diana": {
     "n": 291,
     "acc": 49.1
    },
    "nova": {
     "n": 259,
     "acc": 57.9
    },
    "flow": {
     "n": 32,
     "acc": 59.4
    }
   },
   "graded": 894
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3276,
    "diana": 0.1649,
    "nova": 0.3106,
    "flow": 0.1969
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 59.6
    },
    "diana": {
     "n": 456,
     "acc": 24.8
    },
    "nova": {
     "n": 292,
     "acc": 56.5
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1274
  },
  "2차전지": {
   "weights": {
    "taro": 0.3047,
    "diana": 0.1956,
    "nova": 0.2966,
    "flow": 0.2031
   },
   "acc": {
    "taro": {
     "n": 382,
     "acc": 83.0
    },
    "diana": {
     "n": 245,
     "acc": 48.2
    },
    "nova": {
     "n": 315,
     "acc": 73.0
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 944
  },
  "보험": {
   "weights": {
    "taro": 0.2622,
    "diana": 0.2362,
    "nova": 0.2761,
    "flow": 0.2255
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 52.9
    },
    "diana": {
     "n": 126,
     "acc": 47.6
    },
    "nova": {
     "n": 97,
     "acc": 55.7
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 396
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.2211,
    "nova": 0.258,
    "flow": 0.2435
   },
   "acc": {
    "taro": {
     "n": 895,
     "acc": 66.6
    },
    "diana": {
     "n": 776,
     "acc": 53.1
    },
    "nova": {
     "n": 749,
     "acc": 61.9
    },
    "flow": {
     "n": 118,
     "acc": 58.5
    }
   },
   "graded": 2538
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3059,
    "diana": 0.2139,
    "nova": 0.3218,
    "flow": 0.1584
   },
   "acc": {
    "taro": {
     "n": 409,
     "acc": 57.9
    },
    "diana": {
     "n": 464,
     "acc": 40.5
    },
    "nova": {
     "n": 338,
     "acc": 60.9
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1247
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
    "taro": 0.2948,
    "diana": 0.1582,
    "nova": 0.2872,
    "flow": 0.2598
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
     "n": 76,
     "acc": 55.3
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 227
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2996,
    "diana": 0.1692,
    "nova": 0.2928,
    "flow": 0.2384
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 62.8
    },
    "diana": {
     "n": 155,
     "acc": 35.5
    },
    "nova": {
     "n": 127,
     "acc": 61.4
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
    "taro": 0.2701,
    "diana": 0.1657,
    "nova": 0.2586,
    "flow": 0.3056
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 66.3
    },
    "diana": {
     "n": 541,
     "acc": 40.7
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
   "graded": 1564
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2607,
    "diana": 0.2532,
    "nova": 0.2403,
    "flow": 0.2458
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 49.5
    },
    "diana": {
     "n": 104,
     "acc": 48.1
    },
    "nova": {
     "n": 57,
     "acc": 45.6
    },
    "flow": {
     "n": 60,
     "acc": 46.7
    }
   },
   "graded": 318
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2769,
    "diana": 0.1832,
    "nova": 0.2848,
    "flow": 0.2551
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 54.3
    },
    "diana": {
     "n": 323,
     "acc": 35.9
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
    "taro": 0.2626,
    "diana": 0.2721,
    "nova": 0.2754,
    "flow": 0.1898
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 67.1
    },
    "diana": {
     "n": 141,
     "acc": 69.5
    },
    "nova": {
     "n": 145,
     "acc": 70.3
    },
    "flow": {
     "n": 33,
     "acc": 48.5
    }
   },
   "graded": 489
  },
  "식음료": {
   "weights": {
    "taro": 0.1935,
    "diana": 0.2975,
    "nova": 0.2241,
    "flow": 0.2849
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 34.0
    },
    "diana": {
     "n": 226,
     "acc": 52.2
    },
    "nova": {
     "n": 117,
     "acc": 39.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 505
  },
  "여행레저": {
   "weights": {
    "taro": 0.3594,
    "diana": 0.1635,
    "nova": 0.3136,
    "flow": 0.1635
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 65.9
    },
    "diana": {
     "n": 76,
     "acc": 22.4
    },
    "nova": {
     "n": 73,
     "acc": 57.5
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 271
  }
 }
};
