// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 13:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2851,
   "diana": 0.1893,
   "nova": 0.269,
   "flow": 0.2566
  },
  "acc": {
   "taro": {
    "n": 7074,
    "acc": 61.8
   },
   "diana": {
    "n": 6433,
    "acc": 41.0
   },
   "nova": {
    "n": 5742,
    "acc": 58.3
   },
   "flow": {
    "n": 1226,
    "acc": 55.6
   }
  },
  "graded": 20475,
  "team": {
   "hit": 5582,
   "miss": 1353,
   "n": 6935,
   "acc": 80.5
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2997,
    "diana": 0.1733,
    "nova": 0.2175,
    "flow": 0.3094
   },
   "acc": {
    "taro": {
     "n": 862,
     "acc": 68.8
    },
    "diana": {
     "n": 563,
     "acc": 39.8
    },
    "nova": {
     "n": 747,
     "acc": 49.9
    },
    "flow": {
     "n": 276,
     "acc": 71.0
    }
   },
   "graded": 2448
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
     "acc": 77.5
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
    "taro": 0.3298,
    "diana": 0.1589,
    "nova": 0.3428,
    "flow": 0.1685
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 62.3
    },
    "diana": {
     "n": 314,
     "acc": 29.6
    },
    "nova": {
     "n": 224,
     "acc": 64.7
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
    "taro": 0.2306,
    "diana": 0.2266,
    "nova": 0.2689,
    "flow": 0.2738
   },
   "acc": {
    "taro": {
     "n": 310,
     "acc": 50.0
    },
    "diana": {
     "n": 291,
     "acc": 49.1
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
   "graded": 892
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3272,
    "diana": 0.165,
    "nova": 0.3107,
    "flow": 0.1971
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 59.5
    },
    "diana": {
     "n": 455,
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
   "graded": 1272
  },
  "2차전지": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.1967,
    "nova": 0.297,
    "flow": 0.2025
   },
   "acc": {
    "taro": {
     "n": 381,
     "acc": 82.7
    },
    "diana": {
     "n": 243,
     "acc": 48.6
    },
    "nova": {
     "n": 315,
     "acc": 73.3
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
    "taro": 0.2786,
    "diana": 0.2216,
    "nova": 0.2578,
    "flow": 0.2419
   },
   "acc": {
    "taro": {
     "n": 893,
     "acc": 66.5
    },
    "diana": {
     "n": 773,
     "acc": 52.9
    },
    "nova": {
     "n": 744,
     "acc": 61.6
    },
    "flow": {
     "n": 116,
     "acc": 57.8
    }
   },
   "graded": 2526
  },
  "지주·상사": {
   "weights": {
    "taro": 0.306,
    "diana": 0.2137,
    "nova": 0.3221,
    "flow": 0.1582
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 58.0
    },
    "diana": {
     "n": 459,
     "acc": 40.5
    },
    "nova": {
     "n": 334,
     "acc": 61.1
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1234
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
    "taro": 0.2998,
    "diana": 0.1724,
    "nova": 0.2893,
    "flow": 0.2386
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 62.8
    },
    "diana": {
     "n": 155,
     "acc": 36.1
    },
    "nova": {
     "n": 127,
     "acc": 60.6
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
    "taro": 0.2697,
    "diana": 0.1653,
    "nova": 0.2593,
    "flow": 0.3058
   },
   "acc": {
    "taro": {
     "n": 514,
     "acc": 66.1
    },
    "diana": {
     "n": 540,
     "acc": 40.6
    },
    "nova": {
     "n": 434,
     "acc": 63.6
    },
    "flow": {
     "n": 71,
     "acc": 77.5
    }
   },
   "graded": 1559
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2606,
    "diana": 0.2533,
    "nova": 0.2377,
    "flow": 0.2484
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 49.0
    },
    "diana": {
     "n": 103,
     "acc": 47.6
    },
    "nova": {
     "n": 56,
     "acc": 44.6
    },
    "flow": {
     "n": 60,
     "acc": 46.7
    }
   },
   "graded": 315
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
    "taro": 0.2447,
    "diana": 0.1871,
    "nova": 0.2941,
    "flow": 0.2742
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 44.6
    },
    "diana": {
     "n": 258,
     "acc": 34.1
    },
    "nova": {
     "n": 166,
     "acc": 53.6
    },
    "flow": {
     "n": 0,
     "acc": null
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
    "taro": 0.264,
    "diana": 0.2733,
    "nova": 0.2822,
    "flow": 0.1806
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 66.5
    },
    "diana": {
     "n": 141,
     "acc": 68.8
    },
    "nova": {
     "n": 145,
     "acc": 71.0
    },
    "flow": {
     "n": 33,
     "acc": 45.5
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
