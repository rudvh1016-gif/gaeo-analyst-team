// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 13:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2848,
   "diana": 0.1823,
   "nova": 0.2811,
   "flow": 0.2518
  },
  "acc": {
   "taro": {
    "n": 3759,
    "acc": 61.7
   },
   "diana": {
    "n": 3399,
    "acc": 39.5
   },
   "nova": {
    "n": 2636,
    "acc": 60.9
   },
   "flow": {
    "n": 658,
    "acc": 54.6
   }
  },
  "graded": 10452
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2696,
    "diana": 0.21,
    "nova": 0.226,
    "flow": 0.2944
   },
   "acc": {
    "taro": {
     "n": 446,
     "acc": 54.7
    },
    "diana": {
     "n": 291,
     "acc": 42.6
    },
    "nova": {
     "n": 351,
     "acc": 45.9
    },
    "flow": {
     "n": 149,
     "acc": 59.7
    }
   },
   "graded": 1237
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3083,
    "diana": 0.1565,
    "nova": 0.271,
    "flow": 0.2642
   },
   "acc": {
    "taro": {
     "n": 220,
     "acc": 74.5
    },
    "diana": {
     "n": 140,
     "acc": 37.9
    },
    "nova": {
     "n": 177,
     "acc": 65.5
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 609
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2827,
    "diana": 0.2094,
    "nova": 0.2612,
    "flow": 0.2467
   },
   "acc": {
    "taro": {
     "n": 178,
     "acc": 57.3
    },
    "diana": {
     "n": 172,
     "acc": 42.4
    },
    "nova": {
     "n": 136,
     "acc": 52.9
    },
    "flow": {
     "n": 29,
     "acc": 79.3
    }
   },
   "graded": 515
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3373,
    "diana": 0.1496,
    "nova": 0.3104,
    "flow": 0.2027
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 70.7
    },
    "diana": {
     "n": 169,
     "acc": 31.4
    },
    "nova": {
     "n": 106,
     "acc": 65.1
    },
    "flow": {
     "n": 40,
     "acc": 42.5
    }
   },
   "graded": 479
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2521,
    "diana": 0.2191,
    "nova": 0.2896,
    "flow": 0.2392
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 52.7
    },
    "diana": {
     "n": 155,
     "acc": 45.8
    },
    "nova": {
     "n": 114,
     "acc": 60.5
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 452
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1972,
    "nova": 0.2597,
    "flow": 0.2629
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 55.2
    },
    "diana": {
     "n": 234,
     "acc": 38.9
    },
    "nova": {
     "n": 123,
     "acc": 51.2
    },
    "flow": {
     "n": 81,
     "acc": 51.9
    }
   },
   "graded": 648
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
     "n": 197,
     "acc": 82.7
    },
    "diana": {
     "n": 123,
     "acc": 51.2
    },
    "nova": {
     "n": 156,
     "acc": 81.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 476
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.2266,
    "nova": 0.303,
    "flow": 0.19
   },
   "acc": {
    "taro": {
     "n": 468,
     "acc": 65.6
    },
    "diana": {
     "n": 415,
     "acc": 53.0
    },
    "nova": {
     "n": 357,
     "acc": 70.9
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1303
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.1938,
    "nova": 0.2736,
    "flow": 0.2378
   },
   "acc": {
    "taro": {
     "n": 221,
     "acc": 62.0
    },
    "diana": {
     "n": 243,
     "acc": 40.7
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
   "graded": 635
  },
  "조선": {
   "weights": {
    "taro": 0.3411,
    "diana": 0.1428,
    "nova": 0.2781,
    "flow": 0.238
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 71.7
    },
    "diana": {
     "n": 128,
     "acc": 21.9
    },
    "nova": {
     "n": 101,
     "acc": 58.4
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 366
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3312,
    "diana": 0.1325,
    "nova": 0.3155,
    "flow": 0.2208
   },
   "acc": {
    "taro": {
     "n": 90,
     "acc": 80.0
    },
    "diana": {
     "n": 84,
     "acc": 20.2
    },
    "nova": {
     "n": 63,
     "acc": 71.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 237
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2767,
    "diana": 0.1725,
    "nova": 0.2513,
    "flow": 0.2994
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 69.3
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
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 794
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2669,
    "diana": 0.175,
    "nova": 0.2893,
    "flow": 0.2687
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 49.7
    },
    "diana": {
     "n": 175,
     "acc": 32.6
    },
    "nova": {
     "n": 91,
     "acc": 53.8
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 431
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
    "taro": 0.3422,
    "diana": 0.1533,
    "nova": 0.343,
    "flow": 0.1614
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 66.9
    },
    "diana": {
     "n": 104,
     "acc": 20.2
    },
    "nova": {
     "n": 76,
     "acc": 67.1
    },
    "flow": {
     "n": 38,
     "acc": 31.6
    }
   },
   "graded": 336
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2309,
    "diana": 0.1489,
    "nova": 0.3721,
    "flow": 0.2481
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 46.5
    },
    "diana": {
     "n": 144,
     "acc": 20.1
    },
    "nova": {
     "n": 67,
     "acc": 77.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 312
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
    "taro": 0.1875,
    "diana": 0.1875,
    "nova": 0.3125,
    "flow": 0.3125
   },
   "acc": {
    "taro": {
     "n": 93,
     "acc": 22.6
    },
    "diana": {
     "n": 120,
     "acc": 27.5
    },
    "nova": {
     "n": 34,
     "acc": 50.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 247
  }
 }
};
