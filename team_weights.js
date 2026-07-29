// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-29 16:25",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2799,
   "diana": 0.201,
   "nova": 0.261,
   "flow": 0.2581
  },
  "acc": {
   "taro": {
    "n": 5986,
    "acc": 60.8
   },
   "diana": {
    "n": 5412,
    "acc": 43.7
   },
   "nova": {
    "n": 4550,
    "acc": 56.7
   },
   "flow": {
    "n": 1036,
    "acc": 56.1
   }
  },
  "graded": 16984,
  "team": {
   "hit": 4648,
   "miss": 1240,
   "n": 5888,
   "acc": 78.9
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1834,
    "nova": 0.2358,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 714,
     "acc": 64.4
    },
    "diana": {
     "n": 467,
     "acc": 42.2
    },
    "nova": {
     "n": 614,
     "acc": 54.2
    },
    "flow": {
     "n": 240,
     "acc": 69.2
    }
   },
   "graded": 2035
  },
  "전자·부품": {
   "weights": {
    "taro": 0.305,
    "diana": 0.161,
    "nova": 0.2588,
    "flow": 0.2752
   },
   "acc": {
    "taro": {
     "n": 355,
     "acc": 74.9
    },
    "diana": {
     "n": 220,
     "acc": 39.5
    },
    "nova": {
     "n": 291,
     "acc": 63.6
    },
    "flow": {
     "n": 108,
     "acc": 67.6
    }
   },
   "graded": 974
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2466,
    "diana": 0.2259,
    "nova": 0.2231,
    "flow": 0.3045
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 54.6
    },
    "diana": {
     "n": 282,
     "acc": 50.0
    },
    "nova": {
     "n": 243,
     "acc": 49.4
    },
    "flow": {
     "n": 46,
     "acc": 67.4
    }
   },
   "graded": 866
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3352,
    "diana": 0.1649,
    "nova": 0.3315,
    "flow": 0.1684
   },
   "acc": {
    "taro": {
     "n": 245,
     "acc": 62.9
    },
    "diana": {
     "n": 262,
     "acc": 30.9
    },
    "nova": {
     "n": 177,
     "acc": 62.1
    },
    "flow": {
     "n": 57,
     "acc": 31.6
    }
   },
   "graded": 741
  },
  "통신": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.2102,
    "nova": 0.2705,
    "flow": 0.2388
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 58.7
    },
    "diana": {
     "n": 75,
     "acc": 44.0
    },
    "nova": {
     "n": 83,
     "acc": 56.6
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
    "taro": 0.2502,
    "diana": 0.2525,
    "nova": 0.2581,
    "flow": 0.2392
   },
   "acc": {
    "taro": {
     "n": 260,
     "acc": 52.3
    },
    "diana": {
     "n": 250,
     "acc": 52.8
    },
    "nova": {
     "n": 202,
     "acc": 54.0
    },
    "flow": {
     "n": 25,
     "acc": 60.0
    }
   },
   "graded": 737
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3224,
    "diana": 0.1668,
    "nova": 0.3081,
    "flow": 0.2026
   },
   "acc": {
    "taro": {
     "n": 345,
     "acc": 58.0
    },
    "diana": {
     "n": 379,
     "acc": 28.5
    },
    "nova": {
     "n": 231,
     "acc": 55.4
    },
    "flow": {
     "n": 118,
     "acc": 36.4
    }
   },
   "graded": 1073
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
    "diana": 0.2677,
    "nova": 0.2296,
    "flow": 0.24
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 54.7
    },
    "diana": {
     "n": 104,
     "acc": 55.8
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
   "graded": 319
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.2308,
    "nova": 0.2643,
    "flow": 0.2328
   },
   "acc": {
    "taro": {
     "n": 762,
     "acc": 64.2
    },
    "diana": {
     "n": 656,
     "acc": 54.4
    },
    "nova": {
     "n": 600,
     "acc": 62.3
    },
    "flow": {
     "n": 102,
     "acc": 54.9
    }
   },
   "graded": 2120
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3077,
    "diana": 0.2334,
    "nova": 0.2906,
    "flow": 0.1683
   },
   "acc": {
    "taro": {
     "n": 346,
     "acc": 59.0
    },
    "diana": {
     "n": 389,
     "acc": 44.7
    },
    "nova": {
     "n": 264,
     "acc": 55.7
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
    "taro": 0.2805,
    "diana": 0.2105,
    "nova": 0.2465,
    "flow": 0.2625
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 53.4
    },
    "diana": {
     "n": 207,
     "acc": 40.1
    },
    "nova": {
     "n": 164,
     "acc": 47.0
    },
    "flow": {
     "n": 21,
     "acc": 52.4
    }
   },
   "graded": 596
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3139,
    "diana": 0.1781,
    "nova": 0.2681,
    "flow": 0.2399
   },
   "acc": {
    "taro": {
     "n": 136,
     "acc": 65.4
    },
    "diana": {
     "n": 132,
     "acc": 37.1
    },
    "nova": {
     "n": 102,
     "acc": 55.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 370
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2752,
    "diana": 0.1844,
    "nova": 0.2374,
    "flow": 0.303
   },
   "acc": {
    "taro": {
     "n": 433,
     "acc": 68.1
    },
    "diana": {
     "n": 449,
     "acc": 45.7
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
   "graded": 1284
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2829,
    "diana": 0.2916,
    "nova": 0.1616,
    "flow": 0.2639
   },
   "acc": {
    "taro": {
     "n": 80,
     "acc": 52.5
    },
    "diana": {
     "n": 85,
     "acc": 54.1
    },
    "nova": {
     "n": 38,
     "acc": 28.9
    },
    "flow": {
     "n": 49,
     "acc": 49.0
    }
   },
   "graded": 252
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2795,
    "diana": 0.1971,
    "nova": 0.2672,
    "flow": 0.2562
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 54.5
    },
    "diana": {
     "n": 273,
     "acc": 38.5
    },
    "nova": {
     "n": 163,
     "acc": 52.1
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 705
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2491,
    "diana": 0.2325,
    "nova": 0.2339,
    "flow": 0.2845
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 43.8
    },
    "diana": {
     "n": 115,
     "acc": 40.9
    },
    "nova": {
     "n": 90,
     "acc": 41.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 358
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3061,
    "diana": 0.1785,
    "nova": 0.2915,
    "flow": 0.2239
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 59.7
    },
    "diana": {
     "n": 161,
     "acc": 34.8
    },
    "nova": {
     "n": 125,
     "acc": 56.8
    },
    "flow": {
     "n": 55,
     "acc": 43.6
    }
   },
   "graded": 517
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2427,
    "diana": 0.1801,
    "nova": 0.2982,
    "flow": 0.279
   },
   "acc": {
    "taro": {
     "n": 177,
     "acc": 43.5
    },
    "diana": {
     "n": 220,
     "acc": 32.3
    },
    "nova": {
     "n": 131,
     "acc": 53.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 528
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
    "taro": 0.1963,
    "diana": 0.3023,
    "nova": 0.1975,
    "flow": 0.3039
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 32.3
    },
    "diana": {
     "n": 193,
     "acc": 49.7
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
    "taro": 0.3111,
    "diana": 0.1549,
    "nova": 0.2759,
    "flow": 0.2581
   },
   "acc": {
    "taro": {
     "n": 78,
     "acc": 60.3
    },
    "diana": {
     "n": 64,
     "acc": 23.4
    },
    "nova": {
     "n": 58,
     "acc": 53.4
    },
    "flow": {
     "n": 28,
     "acc": 25.0
    }
   },
   "graded": 228
  }
 }
};
