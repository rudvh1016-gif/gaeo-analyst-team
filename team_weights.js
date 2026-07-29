// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 10:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2767,
   "diana": 0.2051,
   "nova": 0.2604,
   "flow": 0.2578
  },
  "acc": {
   "taro": {
    "n": 5985,
    "acc": 60.5
   },
   "diana": {
    "n": 5407,
    "acc": 44.8
   },
   "nova": {
    "n": 4552,
    "acc": 56.9
   },
   "flow": {
    "n": 1042,
    "acc": 56.3
   }
  },
  "graded": 16986,
  "team": {
   "hit": 4671,
   "miss": 1250,
   "n": 5921,
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
    "taro": 0.3039,
    "diana": 0.1608,
    "nova": 0.2591,
    "flow": 0.2761
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 74.7
    },
    "diana": {
     "n": 220,
     "acc": 39.5
    },
    "nova": {
     "n": 292,
     "acc": 63.7
    },
    "flow": {
     "n": 109,
     "acc": 67.9
    }
   },
   "graded": 977
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2501,
    "diana": 0.234,
    "nova": 0.2191,
    "flow": 0.2968
   },
   "acc": {
    "taro": {
     "n": 293,
     "acc": 54.9
    },
    "diana": {
     "n": 280,
     "acc": 51.4
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
   "graded": 862
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3355,
    "diana": 0.1676,
    "nova": 0.3297,
    "flow": 0.1672
   },
   "acc": {
    "taro": {
     "n": 243,
     "acc": 63.4
    },
    "diana": {
     "n": 259,
     "acc": 31.7
    },
    "nova": {
     "n": 175,
     "acc": 62.3
    },
    "flow": {
     "n": 57,
     "acc": 31.6
    }
   },
   "graded": 734
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
    "taro": 0.2504,
    "diana": 0.2574,
    "nova": 0.2538,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 52.5
    },
    "diana": {
     "n": 252,
     "acc": 54.0
    },
    "nova": {
     "n": 203,
     "acc": 53.2
    },
    "flow": {
     "n": 26,
     "acc": 61.5
    }
   },
   "graded": 742
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
    "taro": 0.2626,
    "diana": 0.2794,
    "nova": 0.222,
    "flow": 0.2359
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 55.7
    },
    "diana": {
     "n": 103,
     "acc": 59.2
    },
    "nova": {
     "n": 68,
     "acc": 47.1
    },
    "flow": {
     "n": 29,
     "acc": 48.3
    }
   },
   "graded": 315
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2678,
    "diana": 0.2322,
    "nova": 0.2668,
    "flow": 0.2332
   },
   "acc": {
    "taro": {
     "n": 765,
     "acc": 63.5
    },
    "diana": {
     "n": 659,
     "acc": 55.1
    },
    "nova": {
     "n": 605,
     "acc": 63.3
    },
    "flow": {
     "n": 103,
     "acc": 55.3
    }
   },
   "graded": 2132
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3053,
    "diana": 0.2411,
    "nova": 0.286,
    "flow": 0.1675
   },
   "acc": {
    "taro": {
     "n": 347,
     "acc": 58.8
    },
    "diana": {
     "n": 392,
     "acc": 46.4
    },
    "nova": {
     "n": 267,
     "acc": 55.1
    },
    "flow": {
     "n": 31,
     "acc": 32.3
    }
   },
   "graded": 1037
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
    "taro": 0.3045,
    "diana": 0.1951,
    "nova": 0.2621,
    "flow": 0.2383
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 63.9
    },
    "diana": {
     "n": 127,
     "acc": 40.9
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
   "graded": 360
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2717,
    "diana": 0.1884,
    "nova": 0.2384,
    "flow": 0.3015
   },
   "acc": {
    "taro": {
     "n": 432,
     "acc": 67.6
    },
    "diana": {
     "n": 446,
     "acc": 46.9
    },
    "nova": {
     "n": 339,
     "acc": 59.3
    },
    "flow": {
     "n": 60,
     "acc": 80.0
    }
   },
   "graded": 1277
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2793,
    "diana": 0.2992,
    "nova": 0.1562,
    "flow": 0.2654
   },
   "acc": {
    "taro": {
     "n": 82,
     "acc": 53.7
    },
    "diana": {
     "n": 87,
     "acc": 57.5
    },
    "nova": {
     "n": 39,
     "acc": 28.2
    },
    "flow": {
     "n": 51,
     "acc": 51.0
    }
   },
   "graded": 259
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2695,
    "diana": 0.2065,
    "nova": 0.2706,
    "flow": 0.2535
   },
   "acc": {
    "taro": {
     "n": 254,
     "acc": 53.1
    },
    "diana": {
     "n": 275,
     "acc": 40.7
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
   "graded": 708
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
    "taro": 0.2307,
    "diana": 0.1848,
    "nova": 0.3074,
    "flow": 0.2771
   },
   "acc": {
    "taro": {
     "n": 173,
     "acc": 41.6
    },
    "diana": {
     "n": 216,
     "acc": 33.3
    },
    "nova": {
     "n": 128,
     "acc": 55.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 517
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
    "taro": 0.2953,
    "diana": 0.1555,
    "nova": 0.29,
    "flow": 0.2592
   },
   "acc": {
    "taro": {
     "n": 79,
     "acc": 57.0
    },
    "diana": {
     "n": 65,
     "acc": 27.7
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
   "graded": 232
  }
 }
};
