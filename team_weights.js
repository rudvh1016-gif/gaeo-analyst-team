// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 16:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2792,
   "diana": 0.1908,
   "nova": 0.279,
   "flow": 0.251
  },
  "acc": {
   "taro": {
    "n": 4841,
    "acc": 62.0
   },
   "diana": {
    "n": 4371,
    "acc": 42.4
   },
   "nova": {
    "n": 3389,
    "acc": 62.0
   },
   "flow": {
    "n": 870,
    "acc": 55.7
   }
  },
  "graded": 13471
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.1918,
    "nova": 0.2339,
    "flow": 0.3014
   },
   "acc": {
    "taro": {
     "n": 581,
     "acc": 61.3
    },
    "diana": {
     "n": 376,
     "acc": 43.1
    },
    "nova": {
     "n": 474,
     "acc": 52.5
    },
    "flow": {
     "n": 195,
     "acc": 67.7
    }
   },
   "graded": 1626
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
    "taro": 0.2365,
    "diana": 0.2206,
    "nova": 0.215,
    "flow": 0.328
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 54.1
    },
    "diana": {
     "n": 226,
     "acc": 50.4
    },
    "nova": {
     "n": 181,
     "acc": 49.2
    },
    "flow": {
     "n": 37,
     "acc": 75.7
    }
   },
   "graded": 677
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3386,
    "diana": 0.1616,
    "nova": 0.321,
    "flow": 0.1788
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 66.8
    },
    "diana": {
     "n": 210,
     "acc": 31.9
    },
    "nova": {
     "n": 131,
     "acc": 63.4
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 594
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
    "taro": 0.2537,
    "diana": 0.2408,
    "nova": 0.276,
    "flow": 0.2295
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 55.3
    },
    "diana": {
     "n": 202,
     "acc": 52.5
    },
    "nova": {
     "n": 148,
     "acc": 60.1
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 578
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3033,
    "diana": 0.1608,
    "nova": 0.3282,
    "flow": 0.2077
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 56.6
    },
    "diana": {
     "n": 305,
     "acc": 28.5
    },
    "nova": {
     "n": 165,
     "acc": 61.2
    },
    "flow": {
     "n": 111,
     "acc": 38.7
    }
   },
   "graded": 855
  },
  "2차전지": {
   "weights": {
    "taro": 0.3,
    "diana": 0.2,
    "nova": 0.3,
    "flow": 0.2
   },
   "acc": {
    "taro": {
     "n": 259,
     "acc": 83.4
    },
    "diana": {
     "n": 168,
     "acc": 50.0
    },
    "nova": {
     "n": 200,
     "acc": 84.5
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 628
  },
  "보험": {
   "weights": {
    "taro": 0.2623,
    "diana": 0.2563,
    "nova": 0.2507,
    "flow": 0.2307
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 56.8
    },
    "diana": {
     "n": 81,
     "acc": 55.6
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
   "graded": 246
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2732,
    "diana": 0.2188,
    "nova": 0.2944,
    "flow": 0.2136
   },
   "acc": {
    "taro": {
     "n": 610,
     "acc": 67.7
    },
    "diana": {
     "n": 533,
     "acc": 54.2
    },
    "nova": {
     "n": 444,
     "acc": 73.0
    },
    "flow": {
     "n": 85,
     "acc": 52.9
    }
   },
   "graded": 1672
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2859,
    "diana": 0.2097,
    "nova": 0.2723,
    "flow": 0.2322
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 61.6
    },
    "diana": {
     "n": 310,
     "acc": 45.2
    },
    "nova": {
     "n": 191,
     "acc": 58.6
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 808
  },
  "조선": {
   "weights": {
    "taro": 0.2891,
    "diana": 0.1959,
    "nova": 0.2586,
    "flow": 0.2565
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 56.4
    },
    "diana": {
     "n": 165,
     "acc": 38.2
    },
    "nova": {
     "n": 123,
     "acc": 50.4
    },
    "flow": {
     "n": 13,
     "acc": 53.8
    }
   },
   "graded": 466
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3223,
    "diana": 0.1477,
    "nova": 0.302,
    "flow": 0.2279
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 70.7
    },
    "diana": {
     "n": 108,
     "acc": 32.4
    },
    "nova": {
     "n": 80,
     "acc": 66.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 304
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2726,
    "diana": 0.1804,
    "nova": 0.2555,
    "flow": 0.2915
   },
   "acc": {
    "taro": {
     "n": 355,
     "acc": 70.1
    },
    "diana": {
     "n": 364,
     "acc": 46.4
    },
    "nova": {
     "n": 257,
     "acc": 65.8
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1028
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2736,
    "diana": 0.2652,
    "nova": 0.2448,
    "flow": 0.2163
   },
   "acc": {
    "taro": {
     "n": 68,
     "acc": 55.9
    },
    "diana": {
     "n": 72,
     "acc": 54.2
    },
    "nova": {
     "n": 26,
     "acc": 23.1
    },
    "flow": {
     "n": 43,
     "acc": 44.2
    }
   },
   "graded": 209
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2722,
    "diana": 0.1836,
    "nova": 0.2858,
    "flow": 0.2584
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 52.7
    },
    "diana": {
     "n": 228,
     "acc": 35.5
    },
    "nova": {
     "n": 123,
     "acc": 55.3
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 571
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2281,
    "diana": 0.1939,
    "nova": 0.277,
    "flow": 0.3009
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 37.9
    },
    "diana": {
     "n": 90,
     "acc": 32.2
    },
    "nova": {
     "n": 63,
     "acc": 46.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 277
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3089,
    "diana": 0.162,
    "nova": 0.3099,
    "flow": 0.2192
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 61.6
    },
    "diana": {
     "n": 133,
     "acc": 32.3
    },
    "nova": {
     "n": 97,
     "acc": 61.9
    },
    "flow": {
     "n": 48,
     "acc": 43.8
    }
   },
   "graded": 424
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2463,
    "diana": 0.1512,
    "nova": 0.3506,
    "flow": 0.252
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 48.9
    },
    "diana": {
     "n": 177,
     "acc": 23.2
    },
    "nova": {
     "n": 92,
     "acc": 69.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 402
  },
  "로봇": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.2671,
    "nova": 0.2699,
    "flow": 0.1893
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
     "n": 94,
     "acc": 71.3
    },
    "flow": {
     "n": 12,
     "acc": 25.0
    }
   },
   "graded": 320
  },
  "식음료": {
   "weights": {
    "taro": 0.1858,
    "diana": 0.2445,
    "nova": 0.2601,
    "flow": 0.3096
   },
   "acc": {
    "taro": {
     "n": 112,
     "acc": 29.5
    },
    "diana": {
     "n": 152,
     "acc": 39.5
    },
    "nova": {
     "n": 50,
     "acc": 42.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 314
  }
 }
};
