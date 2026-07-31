// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 12:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2829,
   "diana": 0.192,
   "nova": 0.2708,
   "flow": 0.2544
  },
  "acc": {
   "taro": {
    "n": 6726,
    "acc": 61.7
   },
   "diana": {
    "n": 6115,
    "acc": 41.9
   },
   "nova": {
    "n": 5387,
    "acc": 59.1
   },
   "flow": {
    "n": 1167,
    "acc": 55.5
   }
  },
  "graded": 19395,
  "team": {
   "hit": 5290,
   "miss": 1303,
   "n": 6593,
   "acc": 80.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2954,
    "diana": 0.1767,
    "nova": 0.2254,
    "flow": 0.3026
   },
   "acc": {
    "taro": {
     "n": 813,
     "acc": 68.1
    },
    "diana": {
     "n": 530,
     "acc": 40.8
    },
    "nova": {
     "n": 700,
     "acc": 52.0
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
    "taro": 0.2336,
    "diana": 0.2305,
    "nova": 0.2683,
    "flow": 0.2677
   },
   "acc": {
    "taro": {
     "n": 296,
     "acc": 50.7
    },
    "diana": {
     "n": 282,
     "acc": 50.0
    },
    "nova": {
     "n": 244,
     "acc": 58.2
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
    "taro": 0.3235,
    "diana": 0.164,
    "nova": 0.3149,
    "flow": 0.1975
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 59.2
    },
    "diana": {
     "n": 433,
     "acc": 26.1
    },
    "nova": {
     "n": 276,
     "acc": 57.6
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1215
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
    "taro": 0.2768,
    "diana": 0.2242,
    "nova": 0.2611,
    "flow": 0.2379
   },
   "acc": {
    "taro": {
     "n": 854,
     "acc": 66.5
    },
    "diana": {
     "n": 739,
     "acc": 53.9
    },
    "nova": {
     "n": 703,
     "acc": 62.7
    },
    "flow": {
     "n": 112,
     "acc": 57.1
    }
   },
   "graded": 2408
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3035,
    "diana": 0.2172,
    "nova": 0.3219,
    "flow": 0.1573
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 57.9
    },
    "diana": {
     "n": 437,
     "acc": 41.4
    },
    "nova": {
     "n": 316,
     "acc": 61.4
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
    "taro": 0.2601,
    "diana": 0.2632,
    "nova": 0.2249,
    "flow": 0.2518
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 48.9
    },
    "diana": {
     "n": 99,
     "acc": 49.5
    },
    "nova": {
     "n": 52,
     "acc": 42.3
    },
    "flow": {
     "n": 57,
     "acc": 47.4
    }
   },
   "graded": 300
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2784,
    "diana": 0.1886,
    "nova": 0.2773,
    "flow": 0.2557
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 54.5
    },
    "diana": {
     "n": 309,
     "acc": 36.9
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
   "graded": 818
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2662,
    "diana": 0.2321,
    "nova": 0.219,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 47.1
    },
    "diana": {
     "n": 134,
     "acc": 41.0
    },
    "nova": {
     "n": 111,
     "acc": 38.7
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
    "taro": 0.2446,
    "diana": 0.1892,
    "nova": 0.2903,
    "flow": 0.2759
   },
   "acc": {
    "taro": {
     "n": 194,
     "acc": 44.3
    },
    "diana": {
     "n": 245,
     "acc": 34.3
    },
    "nova": {
     "n": 154,
     "acc": 52.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 593
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
    "taro": 0.2043,
    "diana": 0.3041,
    "nova": 0.2021,
    "flow": 0.2895
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 35.3
    },
    "diana": {
     "n": 217,
     "acc": 52.5
    },
    "nova": {
     "n": 106,
     "acc": 34.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 476
  },
  "여행레저": {
   "weights": {
    "taro": 0.3584,
    "diana": 0.167,
    "nova": 0.3075,
    "flow": 0.167
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 64.4
    },
    "diana": {
     "n": 71,
     "acc": 23.9
    },
    "nova": {
     "n": 67,
     "acc": 55.2
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 256
  }
 }
};
