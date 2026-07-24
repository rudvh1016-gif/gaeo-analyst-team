// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 15:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2792,
   "diana": 0.1905,
   "nova": 0.2796,
   "flow": 0.2507
  },
  "acc": {
   "taro": {
    "n": 4866,
    "acc": 62.0
   },
   "diana": {
    "n": 4389,
    "acc": 42.3
   },
   "nova": {
    "n": 3413,
    "acc": 62.1
   },
   "flow": {
    "n": 868,
    "acc": 55.6
   }
  },
  "graded": 13536
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
    "taro": 0.3001,
    "diana": 0.1565,
    "nova": 0.2751,
    "flow": 0.2682
   },
   "acc": {
    "taro": {
     "n": 286,
     "acc": 75.5
    },
    "diana": {
     "n": 179,
     "acc": 39.1
    },
    "nova": {
     "n": 224,
     "acc": 68.8
    },
    "flow": {
     "n": 94,
     "acc": 67.0
    }
   },
   "graded": 783
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
    "taro": 0.3408,
    "diana": 0.1611,
    "nova": 0.3199,
    "flow": 0.1782
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 67.5
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
   "graded": 592
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
    "taro": 0.3007,
    "diana": 0.1981,
    "nova": 0.3007,
    "flow": 0.2005
   },
   "acc": {
    "taro": {
     "n": 263,
     "acc": 82.9
    },
    "diana": {
     "n": 170,
     "acc": 49.4
    },
    "nova": {
     "n": 204,
     "acc": 83.8
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 638
  },
  "보험": {
   "weights": {
    "taro": 0.2612,
    "diana": 0.2491,
    "nova": 0.255,
    "flow": 0.2346
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 55.7
    },
    "diana": {
     "n": 81,
     "acc": 53.1
    },
    "nova": {
     "n": 46,
     "acc": 54.3
    },
    "flow": {
     "n": 22,
     "acc": 54.5
    }
   },
   "graded": 246
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.275,
    "diana": 0.2187,
    "nova": 0.2973,
    "flow": 0.2091
   },
   "acc": {
    "taro": {
     "n": 612,
     "acc": 68.1
    },
    "diana": {
     "n": 537,
     "acc": 54.2
    },
    "nova": {
     "n": 448,
     "acc": 73.7
    },
    "flow": {
     "n": 83,
     "acc": 51.8
    }
   },
   "graded": 1680
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2856,
    "diana": 0.2108,
    "nova": 0.2723,
    "flow": 0.2313
   },
   "acc": {
    "taro": {
     "n": 285,
     "acc": 61.8
    },
    "diana": {
     "n": 316,
     "acc": 45.6
    },
    "nova": {
     "n": 197,
     "acc": 58.9
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 824
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
    "taro": 0.2731,
    "diana": 0.1784,
    "nova": 0.2568,
    "flow": 0.2917
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 70.2
    },
    "diana": {
     "n": 364,
     "acc": 45.9
    },
    "nova": {
     "n": 259,
     "acc": 66.0
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1031
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
    "taro": 0.2726,
    "diana": 0.1795,
    "nova": 0.2868,
    "flow": 0.2611
   },
   "acc": {
    "taro": {
     "n": 205,
     "acc": 52.2
    },
    "diana": {
     "n": 224,
     "acc": 34.4
    },
    "nova": {
     "n": 122,
     "acc": 54.9
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
    "taro": 0.2252,
    "diana": 0.2035,
    "nova": 0.2694,
    "flow": 0.3019
   },
   "acc": {
    "taro": {
     "n": 126,
     "acc": 37.3
    },
    "diana": {
     "n": 92,
     "acc": 33.7
    },
    "nova": {
     "n": 65,
     "acc": 44.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 283
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
    "taro": 0.2483,
    "diana": 0.1501,
    "nova": 0.3513,
    "flow": 0.2502
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 49.6
    },
    "diana": {
     "n": 179,
     "acc": 22.9
    },
    "nova": {
     "n": 94,
     "acc": 70.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 408
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
    "taro": 0.1847,
    "diana": 0.2381,
    "nova": 0.2694,
    "flow": 0.3079
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 29.8
    },
    "diana": {
     "n": 150,
     "acc": 38.7
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
   "graded": 312
  }
 }
};
