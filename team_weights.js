// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 11:00",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2848,
   "diana": 0.1827,
   "nova": 0.2811,
   "flow": 0.2514
  },
  "acc": {
   "taro": {
    "n": 3768,
    "acc": 61.7
   },
   "diana": {
    "n": 3402,
    "acc": 39.6
   },
   "nova": {
    "n": 2646,
    "acc": 60.9
   },
   "flow": {
    "n": 659,
    "acc": 54.5
   }
  },
  "graded": 10475
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2698,
    "diana": 0.21,
    "nova": 0.2265,
    "flow": 0.2938
   },
   "acc": {
    "taro": {
     "n": 446,
     "acc": 54.5
    },
    "diana": {
     "n": 290,
     "acc": 42.4
    },
    "nova": {
     "n": 352,
     "acc": 45.7
    },
    "flow": {
     "n": 150,
     "acc": 59.3
    }
   },
   "graded": 1238
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3093,
    "diana": 0.1545,
    "nova": 0.2722,
    "flow": 0.2639
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 74.9
    },
    "diana": {
     "n": 139,
     "acc": 37.4
    },
    "nova": {
     "n": 176,
     "acc": 65.9
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 606
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.2127,
    "nova": 0.2626,
    "flow": 0.2443
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 57.4
    },
    "diana": {
     "n": 170,
     "acc": 43.5
    },
    "nova": {
     "n": 134,
     "acc": 53.7
    },
    "flow": {
     "n": 28,
     "acc": 82.1
    }
   },
   "graded": 508
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3414,
    "diana": 0.1469,
    "nova": 0.3156,
    "flow": 0.1961
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 71.4
    },
    "diana": {
     "n": 166,
     "acc": 30.7
    },
    "nova": {
     "n": 103,
     "acc": 66.0
    },
    "flow": {
     "n": 39,
     "acc": 41.0
    }
   },
   "graded": 469
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.252,
    "diana": 0.2193,
    "nova": 0.288,
    "flow": 0.2407
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 52.4
    },
    "diana": {
     "n": 158,
     "acc": 45.6
    },
    "nova": {
     "n": 117,
     "acc": 59.8
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 461
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2766,
    "diana": 0.2018,
    "nova": 0.2518,
    "flow": 0.2698
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 54.9
    },
    "diana": {
     "n": 237,
     "acc": 40.1
    },
    "nova": {
     "n": 126,
     "acc": 50.0
    },
    "flow": {
     "n": 84,
     "acc": 53.6
    }
   },
   "graded": 660
  },
  "2차전지": {
   "weights": {
    "taro": 0.2985,
    "diana": 0.2039,
    "nova": 0.2985,
    "flow": 0.199
   },
   "acc": {
    "taro": {
     "n": 198,
     "acc": 82.3
    },
    "diana": {
     "n": 123,
     "acc": 51.2
    },
    "nova": {
     "n": 157,
     "acc": 80.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 478
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.2279,
    "nova": 0.3022,
    "flow": 0.1898
   },
   "acc": {
    "taro": {
     "n": 468,
     "acc": 65.6
    },
    "diana": {
     "n": 414,
     "acc": 53.4
    },
    "nova": {
     "n": 356,
     "acc": 70.8
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1301
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2956,
    "diana": 0.1942,
    "nova": 0.273,
    "flow": 0.2373
   },
   "acc": {
    "taro": {
     "n": 220,
     "acc": 62.3
    },
    "diana": {
     "n": 242,
     "acc": 40.9
    },
    "nova": {
     "n": 153,
     "acc": 57.5
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 633
  },
  "조선": {
   "weights": {
    "taro": 0.3412,
    "diana": 0.142,
    "nova": 0.2803,
    "flow": 0.2366
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 72.1
    },
    "diana": {
     "n": 130,
     "acc": 21.5
    },
    "nova": {
     "n": 103,
     "acc": 59.2
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 372
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3283,
    "diana": 0.1313,
    "nova": 0.3215,
    "flow": 0.2189
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 81.3
    },
    "diana": {
     "n": 84,
     "acc": 19.0
    },
    "nova": {
     "n": 64,
     "acc": 73.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 239
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2764,
    "diana": 0.1726,
    "nova": 0.2514,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 69.2
    },
    "diana": {
     "n": 280,
     "acc": 43.2
    },
    "nova": {
     "n": 197,
     "acc": 62.9
    },
    "flow": {
     "n": 39,
     "acc": 82.1
    }
   },
   "graded": 792
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2672,
    "diana": 0.1773,
    "nova": 0.2865,
    "flow": 0.269
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 49.7
    },
    "diana": {
     "n": 176,
     "acc": 33.0
    },
    "nova": {
     "n": 92,
     "acc": 53.3
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 433
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2411,
    "diana": 0.2203,
    "nova": 0.2462,
    "flow": 0.2924
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 41.2
    },
    "diana": {
     "n": 69,
     "acc": 37.7
    },
    "nova": {
     "n": 57,
     "acc": 42.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 223
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3438,
    "diana": 0.1528,
    "nova": 0.3506,
    "flow": 0.1528
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 67.5
    },
    "diana": {
     "n": 103,
     "acc": 19.4
    },
    "nova": {
     "n": 77,
     "acc": 68.8
    },
    "flow": {
     "n": 38,
     "acc": 28.9
    }
   },
   "graded": 338
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2312,
    "diana": 0.1488,
    "nova": 0.372,
    "flow": 0.248
   },
   "acc": {
    "taro": {
     "n": 103,
     "acc": 46.6
    },
    "diana": {
     "n": 146,
     "acc": 20.5
    },
    "nova": {
     "n": 69,
     "acc": 76.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 318
  },
  "로봇": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.2727,
    "nova": 0.2727,
    "flow": 0.1818
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 80.9
    },
    "diana": {
     "n": 76,
     "acc": 78.9
    },
    "nova": {
     "n": 77,
     "acc": 76.6
    },
    "flow": {
     "n": 9,
     "acc": 22.2
    }
   },
   "graded": 256
  },
  "식음료": {
   "weights": {
    "taro": 0.191,
    "diana": 0.191,
    "nova": 0.2996,
    "flow": 0.3184
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 22.3
    },
    "diana": {
     "n": 120,
     "acc": 28.3
    },
    "nova": {
     "n": 34,
     "acc": 47.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 248
  }
 }
};
