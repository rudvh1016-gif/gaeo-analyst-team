// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 10:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2761,
   "diana": 0.2058,
   "nova": 0.2606,
   "flow": 0.2575
  },
  "acc": {
   "taro": {
    "n": 5994,
    "acc": 60.4
   },
   "diana": {
    "n": 5412,
    "acc": 45.0
   },
   "nova": {
    "n": 4554,
    "acc": 57.0
   },
   "flow": {
    "n": 1041,
    "acc": 56.3
   }
  },
  "graded": 17001,
  "team": {
   "hit": 4682,
   "miss": 1252,
   "n": 5934,
   "acc": 78.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.183,
    "nova": 0.2361,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 714,
     "acc": 64.4
    },
    "diana": {
     "n": 468,
     "acc": 42.1
    },
    "nova": {
     "n": 615,
     "acc": 54.3
    },
    "flow": {
     "n": 240,
     "acc": 69.2
    }
   },
   "graded": 2037
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3032,
    "diana": 0.1614,
    "nova": 0.2596,
    "flow": 0.2758
   },
   "acc": {
    "taro": {
     "n": 355,
     "acc": 74.6
    },
    "diana": {
     "n": 219,
     "acc": 39.7
    },
    "nova": {
     "n": 291,
     "acc": 63.9
    },
    "flow": {
     "n": 109,
     "acc": 67.9
    }
   },
   "graded": 974
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2504,
    "diana": 0.2345,
    "nova": 0.2188,
    "flow": 0.2963
   },
   "acc": {
    "taro": {
     "n": 294,
     "acc": 55.1
    },
    "diana": {
     "n": 281,
     "acc": 51.6
    },
    "nova": {
     "n": 243,
     "acc": 48.1
    },
    "flow": {
     "n": 46,
     "acc": 65.2
    }
   },
   "graded": 864
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3357,
    "diana": 0.1683,
    "nova": 0.3287,
    "flow": 0.1673
   },
   "acc": {
    "taro": {
     "n": 243,
     "acc": 63.4
    },
    "diana": {
     "n": 258,
     "acc": 31.8
    },
    "nova": {
     "n": 174,
     "acc": 62.1
    },
    "flow": {
     "n": 57,
     "acc": 31.6
    }
   },
   "graded": 732
  },
  "통신": {
   "weights": {
    "taro": 0.2834,
    "diana": 0.2155,
    "nova": 0.2634,
    "flow": 0.2377
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 59.6
    },
    "diana": {
     "n": 75,
     "acc": 45.3
    },
    "nova": {
     "n": 83,
     "acc": 55.4
    },
    "flow": {
     "n": 29,
     "acc": 65.5
    }
   },
   "graded": 296
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2511,
    "diana": 0.2581,
    "nova": 0.2524,
    "flow": 0.2384
   },
   "acc": {
    "taro": {
     "n": 262,
     "acc": 52.7
    },
    "diana": {
     "n": 253,
     "acc": 54.2
    },
    "nova": {
     "n": 204,
     "acc": 52.9
    },
    "flow": {
     "n": 26,
     "acc": 61.5
    }
   },
   "graded": 745
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3182,
    "diana": 0.1663,
    "nova": 0.3134,
    "flow": 0.2021
   },
   "acc": {
    "taro": {
     "n": 345,
     "acc": 57.4
    },
    "diana": {
     "n": 379,
     "acc": 29.6
    },
    "nova": {
     "n": 230,
     "acc": 56.5
    },
    "flow": {
     "n": 118,
     "acc": 36.4
    }
   },
   "graded": 1072
  },
  "2차전지": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.1966,
    "nova": 0.2998,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 323,
     "acc": 80.8
    },
    "diana": {
     "n": 207,
     "acc": 48.8
    },
    "nova": {
     "n": 262,
     "acc": 74.4
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 794
  },
  "보험": {
   "weights": {
    "taro": 0.2585,
    "diana": 0.2791,
    "nova": 0.226,
    "flow": 0.2363
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 54.7
    },
    "diana": {
     "n": 105,
     "acc": 59.0
    },
    "nova": {
     "n": 69,
     "acc": 47.8
    },
    "flow": {
     "n": 29,
     "acc": 48.3
    }
   },
   "graded": 320
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2672,
    "diana": 0.2331,
    "nova": 0.2679,
    "flow": 0.2317
   },
   "acc": {
    "taro": {
     "n": 766,
     "acc": 63.3
    },
    "diana": {
     "n": 659,
     "acc": 55.2
    },
    "nova": {
     "n": 605,
     "acc": 63.5
    },
    "flow": {
     "n": 102,
     "acc": 54.9
    }
   },
   "graded": 2132
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3044,
    "diana": 0.2414,
    "nova": 0.2869,
    "flow": 0.1673
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 58.7
    },
    "diana": {
     "n": 389,
     "acc": 46.5
    },
    "nova": {
     "n": 264,
     "acc": 55.3
    },
    "flow": {
     "n": 31,
     "acc": 32.3
    }
   },
   "graded": 1030
  },
  "조선": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.2142,
    "nova": 0.245,
    "flow": 0.2627
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 52.9
    },
    "diana": {
     "n": 206,
     "acc": 40.8
    },
    "nova": {
     "n": 163,
     "acc": 46.6
    },
    "flow": {
     "n": 21,
     "acc": 52.4
    }
   },
   "graded": 594
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3016,
    "diana": 0.1991,
    "nova": 0.2615,
    "flow": 0.2378
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 63.4
    },
    "diana": {
     "n": 129,
     "acc": 41.9
    },
    "nova": {
     "n": 100,
     "acc": 55.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 363
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.1898,
    "nova": 0.2364,
    "flow": 0.3016
   },
   "acc": {
    "taro": {
     "n": 433,
     "acc": 67.7
    },
    "diana": {
     "n": 447,
     "acc": 47.2
    },
    "nova": {
     "n": 342,
     "acc": 58.8
    },
    "flow": {
     "n": 60,
     "acc": 80.0
    }
   },
   "graded": 1282
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2779,
    "diana": 0.2982,
    "nova": 0.157,
    "flow": 0.2669
   },
   "acc": {
    "taro": {
     "n": 81,
     "acc": 53.1
    },
    "diana": {
     "n": 86,
     "acc": 57.0
    },
    "nova": {
     "n": 38,
     "acc": 28.9
    },
    "flow": {
     "n": 51,
     "acc": 51.0
    }
   },
   "graded": 256
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2682,
    "diana": 0.2082,
    "nova": 0.2704,
    "flow": 0.2533
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 52.9
    },
    "diana": {
     "n": 275,
     "acc": 41.1
    },
    "nova": {
     "n": 163,
     "acc": 53.4
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 709
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2408,
    "diana": 0.2374,
    "nova": 0.2408,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 42.9
    },
    "diana": {
     "n": 116,
     "acc": 42.2
    },
    "nova": {
     "n": 91,
     "acc": 42.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 361
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3027,
    "diana": 0.187,
    "nova": 0.2876,
    "flow": 0.2227
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 59.3
    },
    "diana": {
     "n": 161,
     "acc": 36.6
    },
    "nova": {
     "n": 126,
     "acc": 56.3
    },
    "flow": {
     "n": 55,
     "acc": 43.6
    }
   },
   "graded": 519
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2252,
    "diana": 0.1885,
    "nova": 0.311,
    "flow": 0.2753
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 40.9
    },
    "diana": {
     "n": 219,
     "acc": 34.2
    },
    "nova": {
     "n": 131,
     "acc": 56.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 526
  },
  "로봇": {
   "weights": {
    "taro": 0.2631,
    "diana": 0.2714,
    "nova": 0.2702,
    "flow": 0.1953
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 67.4
    },
    "diana": {
     "n": 118,
     "acc": 69.5
    },
    "nova": {
     "n": 120,
     "acc": 69.2
    },
    "flow": {
     "n": 19,
     "acc": 36.8
    }
   },
   "graded": 401
  },
  "식음료": {
   "weights": {
    "taro": 0.1973,
    "diana": 0.3068,
    "nova": 0.1954,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 32.8
    },
    "diana": {
     "n": 192,
     "acc": 51.0
    },
    "nova": {
     "n": 80,
     "acc": 32.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 403
  },
  "여행레저": {
   "weights": {
    "taro": 0.2927,
    "diana": 0.1561,
    "nova": 0.291,
    "flow": 0.2602
   },
   "acc": {
    "taro": {
     "n": 80,
     "acc": 56.2
    },
    "diana": {
     "n": 66,
     "acc": 28.8
    },
    "nova": {
     "n": 59,
     "acc": 55.9
    },
    "flow": {
     "n": 29,
     "acc": 31.0
    }
   },
   "graded": 234
  }
 }
};
