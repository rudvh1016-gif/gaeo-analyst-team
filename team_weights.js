// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 13:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2852,
   "diana": 0.1893,
   "nova": 0.2687,
   "flow": 0.2568
  },
  "acc": {
   "taro": {
    "n": 7080,
    "acc": 61.9
   },
   "diana": {
    "n": 6443,
    "acc": 41.1
   },
   "nova": {
    "n": 5750,
    "acc": 58.3
   },
   "flow": {
    "n": 1227,
    "acc": 55.7
   }
  },
  "graded": 20500,
  "team": {
   "hit": 5599,
   "miss": 1347,
   "n": 6946,
   "acc": 80.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.1737,
    "nova": 0.2167,
    "flow": 0.309
   },
   "acc": {
    "taro": {
     "n": 861,
     "acc": 69.0
    },
    "diana": {
     "n": 562,
     "acc": 39.9
    },
    "nova": {
     "n": 746,
     "acc": 49.7
    },
    "flow": {
     "n": 275,
     "acc": 70.9
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
    "taro": 0.2316,
    "diana": 0.2269,
    "nova": 0.2683,
    "flow": 0.2732
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 50.3
    },
    "diana": {
     "n": 292,
     "acc": 49.3
    },
    "nova": {
     "n": 259,
     "acc": 58.3
    },
    "flow": {
     "n": 32,
     "acc": 59.4
    }
   },
   "graded": 895
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3273,
    "diana": 0.1647,
    "nova": 0.3111,
    "flow": 0.1968
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
     "n": 293,
     "acc": 56.7
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
    "taro": 0.3041,
    "diana": 0.1961,
    "nova": 0.297,
    "flow": 0.2028
   },
   "acc": {
    "taro": {
     "n": 381,
     "acc": 82.9
    },
    "diana": {
     "n": 244,
     "acc": 48.4
    },
    "nova": {
     "n": 314,
     "acc": 73.2
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 941
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
    "taro": 0.2784,
    "diana": 0.2221,
    "nova": 0.2584,
    "flow": 0.2411
   },
   "acc": {
    "taro": {
     "n": 895,
     "acc": 66.7
    },
    "diana": {
     "n": 776,
     "acc": 53.2
    },
    "nova": {
     "n": 748,
     "acc": 61.9
    },
    "flow": {
     "n": 116,
     "acc": 57.8
    }
   },
   "graded": 2535
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3056,
    "diana": 0.2138,
    "nova": 0.3225,
    "flow": 0.1581
   },
   "acc": {
    "taro": {
     "n": 407,
     "acc": 58.0
    },
    "diana": {
     "n": 461,
     "acc": 40.6
    },
    "nova": {
     "n": 335,
     "acc": 61.2
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
    "taro": 0.2997,
    "diana": 0.1712,
    "nova": 0.2906,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 62.8
    },
    "diana": {
     "n": 156,
     "acc": 35.9
    },
    "nova": {
     "n": 128,
     "acc": 60.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 432
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
    "taro": 0.2768,
    "diana": 0.1831,
    "nova": 0.2859,
    "flow": 0.2543
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 54.4
    },
    "diana": {
     "n": 325,
     "acc": 36.0
    },
    "nova": {
     "n": 217,
     "acc": 56.2
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 863
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
    "taro": 0.2427,
    "diana": 0.1867,
    "nova": 0.2968,
    "flow": 0.2737
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 44.3
    },
    "diana": {
     "n": 258,
     "acc": 34.1
    },
    "nova": {
     "n": 166,
     "acc": 54.2
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 628
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
    "taro": 0.1933,
    "diana": 0.2961,
    "nova": 0.2258,
    "flow": 0.2847
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 34.0
    },
    "diana": {
     "n": 225,
     "acc": 52.0
    },
    "nova": {
     "n": 116,
     "acc": 39.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 503
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
