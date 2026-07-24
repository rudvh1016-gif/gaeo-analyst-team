// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 13:14",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2793,
   "diana": 0.1908,
   "nova": 0.279,
   "flow": 0.2509
  },
  "acc": {
   "taro": {
    "n": 4845,
    "acc": 62.0
   },
   "diana": {
    "n": 4385,
    "acc": 42.3
   },
   "nova": {
    "n": 3389,
    "acc": 61.9
   },
   "flow": {
    "n": 864,
    "acc": 55.7
   }
  },
  "graded": 13483
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.273,
    "diana": 0.1922,
    "nova": 0.2344,
    "flow": 0.3004
   },
   "acc": {
    "taro": {
     "n": 575,
     "acc": 61.2
    },
    "diana": {
     "n": 376,
     "acc": 43.1
    },
    "nova": {
     "n": 470,
     "acc": 52.6
    },
    "flow": {
     "n": 193,
     "acc": 67.4
    }
   },
   "graded": 1614
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3002,
    "diana": 0.1538,
    "nova": 0.2777,
    "flow": 0.2683
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 76.1
    },
    "diana": {
     "n": 177,
     "acc": 38.4
    },
    "nova": {
     "n": 222,
     "acc": 69.4
    },
    "flow": {
     "n": 94,
     "acc": 67.0
    }
   },
   "graded": 777
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2401,
    "diana": 0.2157,
    "nova": 0.2206,
    "flow": 0.3236
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 55.7
    },
    "diana": {
     "n": 224,
     "acc": 50.0
    },
    "nova": {
     "n": 178,
     "acc": 51.1
    },
    "flow": {
     "n": 35,
     "acc": 80.0
    }
   },
   "graded": 667
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3383,
    "diana": 0.1648,
    "nova": 0.3183,
    "flow": 0.1787
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 66.8
    },
    "diana": {
     "n": 212,
     "acc": 32.5
    },
    "nova": {
     "n": 132,
     "acc": 62.9
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 597
  },
  "통신": {
   "weights": {
    "taro": 0.2938,
    "diana": 0.1828,
    "nova": 0.2949,
    "flow": 0.2285
   },
   "acc": {
    "taro": {
     "n": 84,
     "acc": 64.3
    },
    "diana": {
     "n": 60,
     "acc": 40.0
    },
    "nova": {
     "n": 62,
     "acc": 64.5
    },
    "flow": {
     "n": 24,
     "acc": 70.8
    }
   },
   "graded": 230
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2538,
    "diana": 0.243,
    "nova": 0.2714,
    "flow": 0.2318
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 54.8
    },
    "diana": {
     "n": 206,
     "acc": 52.4
    },
    "nova": {
     "n": 152,
     "acc": 58.6
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 588
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
    "taro": 0.3014,
    "diana": 0.1962,
    "nova": 0.3014,
    "flow": 0.201
   },
   "acc": {
    "taro": {
     "n": 261,
     "acc": 82.0
    },
    "diana": {
     "n": 168,
     "acc": 48.8
    },
    "nova": {
     "n": 202,
     "acc": 82.7
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 632
  },
  "보험": {
   "weights": {
    "taro": 0.2608,
    "diana": 0.2452,
    "nova": 0.2573,
    "flow": 0.2367
   },
   "acc": {
    "taro": {
     "n": 98,
     "acc": 55.1
    },
    "diana": {
     "n": 83,
     "acc": 51.8
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
   "graded": 249
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.2193,
    "nova": 0.2956,
    "flow": 0.2102
   },
   "acc": {
    "taro": {
     "n": 604,
     "acc": 67.7
    },
    "diana": {
     "n": 531,
     "acc": 54.0
    },
    "nova": {
     "n": 442,
     "acc": 72.9
    },
    "flow": {
     "n": 83,
     "acc": 51.8
    }
   },
   "graded": 1660
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
    "taro": 0.2913,
    "diana": 0.1952,
    "nova": 0.2578,
    "flow": 0.2557
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 57.0
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
    "taro": 0.2727,
    "diana": 0.1805,
    "nova": 0.2549,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 354,
     "acc": 70.1
    },
    "diana": {
     "n": 360,
     "acc": 46.4
    },
    "nova": {
     "n": 255,
     "acc": 65.5
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1021
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2663,
    "diana": 0.2718,
    "nova": 0.2452,
    "flow": 0.2167
   },
   "acc": {
    "taro": {
     "n": 70,
     "acc": 54.3
    },
    "diana": {
     "n": 74,
     "acc": 55.4
    },
    "nova": {
     "n": 28,
     "acc": 21.4
    },
    "flow": {
     "n": 43,
     "acc": 44.2
    }
   },
   "graded": 215
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2717,
    "diana": 0.1804,
    "nova": 0.29,
    "flow": 0.258
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 52.7
    },
    "diana": {
     "n": 226,
     "acc": 35.0
    },
    "nova": {
     "n": 121,
     "acc": 56.2
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 567
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2298,
    "diana": 0.2023,
    "nova": 0.2678,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 38.3
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
   "graded": 285
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3075,
    "diana": 0.1652,
    "nova": 0.3072,
    "flow": 0.2201
   },
   "acc": {
    "taro": {
     "n": 144,
     "acc": 61.1
    },
    "diana": {
     "n": 131,
     "acc": 32.8
    },
    "nova": {
     "n": 95,
     "acc": 61.1
    },
    "flow": {
     "n": 48,
     "acc": 43.8
    }
   },
   "graded": 418
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2483,
    "diana": 0.1479,
    "nova": 0.3574,
    "flow": 0.2464
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 50.4
    },
    "diana": {
     "n": 177,
     "acc": 20.9
    },
    "nova": {
     "n": 91,
     "acc": 72.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 401
  },
  "로봇": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.2655,
    "nova": 0.2742,
    "flow": 0.1882
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
     "n": 92,
     "acc": 72.8
    },
    "flow": {
     "n": 12,
     "acc": 25.0
    }
   },
   "graded": 318
  },
  "식음료": {
   "weights": {
    "taro": 0.1935,
    "diana": 0.2534,
    "nova": 0.2498,
    "flow": 0.3033
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 31.9
    },
    "diana": {
     "n": 158,
     "acc": 41.8
    },
    "nova": {
     "n": 51,
     "acc": 41.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 325
  }
 }
};
