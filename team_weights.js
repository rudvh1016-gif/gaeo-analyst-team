// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 12:14",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2803,
   "diana": 0.189,
   "nova": 0.2811,
   "flow": 0.2496
  },
  "acc": {
   "taro": {
    "n": 4837,
    "acc": 62.2
   },
   "diana": {
    "n": 4373,
    "acc": 42.0
   },
   "nova": {
    "n": 3385,
    "acc": 62.4
   },
   "flow": {
    "n": 864,
    "acc": 55.4
   }
  },
  "graded": 13459
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.1932,
    "nova": 0.234,
    "flow": 0.3
   },
   "acc": {
    "taro": {
     "n": 578,
     "acc": 61.2
    },
    "diana": {
     "n": 378,
     "acc": 43.4
    },
    "nova": {
     "n": 474,
     "acc": 52.5
    },
    "flow": {
     "n": 193,
     "acc": 67.4
    }
   },
   "graded": 1623
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3014,
    "diana": 0.1544,
    "nova": 0.2777,
    "flow": 0.2665
   },
   "acc": {
    "taro": {
     "n": 282,
     "acc": 75.9
    },
    "diana": {
     "n": 177,
     "acc": 38.4
    },
    "nova": {
     "n": 220,
     "acc": 69.1
    },
    "flow": {
     "n": 92,
     "acc": 66.3
    }
   },
   "graded": 771
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2384,
    "diana": 0.2176,
    "nova": 0.2176,
    "flow": 0.3264
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 54.8
    },
    "diana": {
     "n": 224,
     "acc": 50.0
    },
    "nova": {
     "n": 178,
     "acc": 50.0
    },
    "flow": {
     "n": 37,
     "acc": 75.7
    }
   },
   "graded": 669
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3399,
    "diana": 0.1577,
    "nova": 0.3246,
    "flow": 0.1778
   },
   "acc": {
    "taro": {
     "n": 206,
     "acc": 67.5
    },
    "diana": {
     "n": 214,
     "acc": 31.3
    },
    "nova": {
     "n": 135,
     "acc": 64.4
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 606
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
    "taro": 0.2548,
    "diana": 0.2451,
    "nova": 0.2686,
    "flow": 0.2315
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 55.0
    },
    "diana": {
     "n": 204,
     "acc": 52.9
    },
    "nova": {
     "n": 150,
     "acc": 58.0
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 583
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3012,
    "diana": 0.1613,
    "nova": 0.3292,
    "flow": 0.2083
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 56.0
    },
    "diana": {
     "n": 307,
     "acc": 28.3
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
   "graded": 858
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
     "n": 261,
     "acc": 82.8
    },
    "diana": {
     "n": 170,
     "acc": 49.4
    },
    "nova": {
     "n": 202,
     "acc": 83.7
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 634
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
    "diana": 0.22,
    "nova": 0.2957,
    "flow": 0.2096
   },
   "acc": {
    "taro": {
     "n": 608,
     "acc": 67.9
    },
    "diana": {
     "n": 535,
     "acc": 54.4
    },
    "nova": {
     "n": 446,
     "acc": 73.1
    },
    "flow": {
     "n": 83,
     "acc": 51.8
    }
   },
   "graded": 1672
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2855,
    "diana": 0.2114,
    "nova": 0.273,
    "flow": 0.2302
   },
   "acc": {
    "taro": {
     "n": 287,
     "acc": 62.0
    },
    "diana": {
     "n": 318,
     "acc": 45.9
    },
    "nova": {
     "n": 199,
     "acc": 59.3
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 830
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
    "taro": 0.274,
    "diana": 0.1768,
    "nova": 0.2582,
    "flow": 0.291
   },
   "acc": {
    "taro": {
     "n": 354,
     "acc": 70.6
    },
    "diana": {
     "n": 362,
     "acc": 45.6
    },
    "nova": {
     "n": 257,
     "acc": 66.5
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1025
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
    "taro": 0.2731,
    "diana": 0.1759,
    "nova": 0.2907,
    "flow": 0.2603
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 52.5
    },
    "diana": {
     "n": 222,
     "acc": 33.8
    },
    "nova": {
     "n": 120,
     "acc": 55.8
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 559
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
    "taro": 0.3095,
    "diana": 0.1571,
    "nova": 0.3138,
    "flow": 0.2196
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 61.6
    },
    "diana": {
     "n": 131,
     "acc": 31.3
    },
    "nova": {
     "n": 96,
     "acc": 62.5
    },
    "flow": {
     "n": 48,
     "acc": 43.8
    }
   },
   "graded": 421
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2491,
    "diana": 0.1461,
    "nova": 0.3612,
    "flow": 0.2435
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 51.1
    },
    "diana": {
     "n": 175,
     "acc": 20.0
    },
    "nova": {
     "n": 89,
     "acc": 74.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 395
  },
  "로봇": {
   "weights": {
    "taro": 0.2722,
    "diana": 0.2668,
    "nova": 0.2757,
    "flow": 0.1852
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 73.5
    },
    "diana": {
     "n": 93,
     "acc": 72.0
    },
    "nova": {
     "n": 90,
     "acc": 74.4
    },
    "flow": {
     "n": 12,
     "acc": 25.0
    }
   },
   "graded": 312
  },
  "식음료": {
   "weights": {
    "taro": 0.1862,
    "diana": 0.2269,
    "nova": 0.2801,
    "flow": 0.3068
   },
   "acc": {
    "taro": {
     "n": 112,
     "acc": 30.4
    },
    "diana": {
     "n": 146,
     "acc": 37.0
    },
    "nova": {
     "n": 46,
     "acc": 45.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 304
  }
 }
};
