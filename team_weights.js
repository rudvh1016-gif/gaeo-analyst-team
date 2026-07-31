// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 09:45",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2826,
   "diana": 0.1911,
   "nova": 0.2725,
   "flow": 0.2539
  },
  "acc": {
   "taro": {
    "n": 6725,
    "acc": 61.7
   },
   "diana": {
    "n": 6116,
    "acc": 41.7
   },
   "nova": {
    "n": 5384,
    "acc": 59.5
   },
   "flow": {
    "n": 1167,
    "acc": 55.4
   }
  },
  "graded": 19392,
  "team": {
   "hit": 5279,
   "miss": 1298,
   "n": 6577,
   "acc": 80.3
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
    "taro": 0.3332,
    "diana": 0.1585,
    "nova": 0.3489,
    "flow": 0.1594
   },
   "acc": {
    "taro": {
     "n": 268,
     "acc": 63.1
    },
    "diana": {
     "n": 297,
     "acc": 27.9
    },
    "nova": {
     "n": 209,
     "acc": 66.0
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 837
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
    "taro": 0.2331,
    "diana": 0.229,
    "nova": 0.2736,
    "flow": 0.2642
   },
   "acc": {
    "taro": {
     "n": 294,
     "acc": 50.0
    },
    "diana": {
     "n": 281,
     "acc": 49.1
    },
    "nova": {
     "n": 242,
     "acc": 58.7
    },
    "flow": {
     "n": 30,
     "acc": 56.7
    }
   },
   "graded": 847
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3248,
    "diana": 0.1644,
    "nova": 0.3145,
    "flow": 0.1963
   },
   "acc": {
    "taro": {
     "n": 388,
     "acc": 59.3
    },
    "diana": {
     "n": 434,
     "acc": 25.8
    },
    "nova": {
     "n": 277,
     "acc": 57.4
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
    "taro": 0.3018,
    "diana": 0.1951,
    "nova": 0.3018,
    "flow": 0.2012
   },
   "acc": {
    "taro": {
     "n": 361,
     "acc": 82.8
    },
    "diana": {
     "n": 231,
     "acc": 48.5
    },
    "nova": {
     "n": 301,
     "acc": 76.1
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 895
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
    "taro": 0.2758,
    "diana": 0.224,
    "nova": 0.2618,
    "flow": 0.2384
   },
   "acc": {
    "taro": {
     "n": 855,
     "acc": 66.5
    },
    "diana": {
     "n": 740,
     "acc": 54.1
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
   "graded": 2411
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.2171,
    "nova": 0.3224,
    "flow": 0.1567
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 58.1
    },
    "diana": {
     "n": 438,
     "acc": 41.6
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
    "taro": 0.2895,
    "diana": 0.1547,
    "nova": 0.2979,
    "flow": 0.2579
   },
   "acc": {
    "taro": {
     "n": 98,
     "acc": 56.1
    },
    "diana": {
     "n": 44,
     "acc": 29.5
    },
    "nova": {
     "n": 71,
     "acc": 57.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 213
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
    "taro": 0.2683,
    "diana": 0.1705,
    "nova": 0.2578,
    "flow": 0.3034
   },
   "acc": {
    "taro": {
     "n": 490,
     "acc": 66.3
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
   "graded": 1475
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2576,
    "diana": 0.2553,
    "nova": 0.2424,
    "flow": 0.2447
   },
   "acc": {
    "taro": {
     "n": 90,
     "acc": 48.9
    },
    "diana": {
     "n": 97,
     "acc": 48.5
    },
    "nova": {
     "n": 50,
     "acc": 46.0
    },
    "flow": {
     "n": 56,
     "acc": 46.4
    }
   },
   "graded": 293
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2762,
    "diana": 0.1862,
    "nova": 0.2816,
    "flow": 0.256
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 54.0
    },
    "diana": {
     "n": 308,
     "acc": 36.4
    },
    "nova": {
     "n": 200,
     "acc": 55.0
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
    "taro": 0.2636,
    "diana": 0.2284,
    "nova": 0.2247,
    "flow": 0.2834
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 46.5
    },
    "diana": {
     "n": 134,
     "acc": 40.3
    },
    "nova": {
     "n": 111,
     "acc": 39.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 417
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
    "taro": 0.2498,
    "diana": 0.1802,
    "nova": 0.2976,
    "flow": 0.2725
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 45.8
    },
    "diana": {
     "n": 242,
     "acc": 33.1
    },
    "nova": {
     "n": 152,
     "acc": 54.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 586
  },
  "로봇": {
   "weights": {
    "taro": 0.2642,
    "diana": 0.2752,
    "nova": 0.2719,
    "flow": 0.1887
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 70.0
    },
    "diana": {
     "n": 133,
     "acc": 72.9
    },
    "nova": {
     "n": 136,
     "acc": 72.1
    },
    "flow": {
     "n": 29,
     "acc": 51.7
    }
   },
   "graded": 458
  },
  "식음료": {
   "weights": {
    "taro": 0.1965,
    "diana": 0.293,
    "nova": 0.2215,
    "flow": 0.289
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 34.0
    },
    "diana": {
     "n": 217,
     "acc": 50.7
    },
    "nova": {
     "n": 107,
     "acc": 38.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 477
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
