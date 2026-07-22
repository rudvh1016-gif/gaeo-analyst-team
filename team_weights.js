// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 13:16",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2845,
   "diana": 0.1831,
   "nova": 0.2802,
   "flow": 0.2522
  },
  "acc": {
   "taro": {
    "n": 3766,
    "acc": 61.6
   },
   "diana": {
    "n": 3403,
    "acc": 39.7
   },
   "nova": {
    "n": 2643,
    "acc": 60.7
   },
   "flow": {
    "n": 659,
    "acc": 54.6
   }
  },
  "graded": 10471
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.27,
    "diana": 0.2099,
    "nova": 0.2259,
    "flow": 0.2942
   },
   "acc": {
    "taro": {
     "n": 445,
     "acc": 54.8
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
   "graded": 1236
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
    "taro": 0.2811,
    "diana": 0.211,
    "nova": 0.2612,
    "flow": 0.2467
   },
   "acc": {
    "taro": {
     "n": 179,
     "acc": 57.0
    },
    "diana": {
     "n": 173,
     "acc": 42.8
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
   "graded": 517
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
    "taro": 0.2512,
    "diana": 0.2213,
    "nova": 0.2877,
    "flow": 0.2398
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 52.4
    },
    "diana": {
     "n": 156,
     "acc": 46.2
    },
    "nova": {
     "n": 115,
     "acc": 60.0
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 455
  },
  "금융·증권": {
   "weights": {
    "taro": 0.278,
    "diana": 0.2007,
    "nova": 0.2539,
    "flow": 0.2674
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 55.2
    },
    "diana": {
     "n": 236,
     "acc": 39.8
    },
    "nova": {
     "n": 125,
     "acc": 50.4
    },
    "flow": {
     "n": 81,
     "acc": 53.1
    }
   },
   "graded": 654
  },
  "2차전지": {
   "weights": {
    "taro": 0.299,
    "diana": 0.2026,
    "nova": 0.299,
    "flow": 0.1993
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 82.2
    },
    "diana": {
     "n": 122,
     "acc": 50.8
    },
    "nova": {
     "n": 156,
     "acc": 80.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 475
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2804,
    "diana": 0.2271,
    "nova": 0.3025,
    "flow": 0.19
   },
   "acc": {
    "taro": {
     "n": 468,
     "acc": 65.6
    },
    "diana": {
     "n": 414,
     "acc": 53.1
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
    "taro": 0.3403,
    "diana": 0.1436,
    "nova": 0.2768,
    "flow": 0.2393
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 71.1
    },
    "diana": {
     "n": 129,
     "acc": 22.5
    },
    "nova": {
     "n": 102,
     "acc": 57.8
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 369
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3329,
    "diana": 0.1331,
    "nova": 0.3121,
    "flow": 0.2219
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 79.1
    },
    "diana": {
     "n": 85,
     "acc": 21.2
    },
    "nova": {
     "n": 64,
     "acc": 70.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 240
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.1736,
    "nova": 0.2504,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 69.1
    },
    "diana": {
     "n": 281,
     "acc": 43.4
    },
    "nova": {
     "n": 198,
     "acc": 62.6
    },
    "flow": {
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 797
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2675,
    "diana": 0.1733,
    "nova": 0.29,
    "flow": 0.2692
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 49.7
    },
    "diana": {
     "n": 174,
     "acc": 32.2
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
   "graded": 430
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2437,
    "diana": 0.2236,
    "nova": 0.2402,
    "flow": 0.2924
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 41.7
    },
    "diana": {
     "n": 68,
     "acc": 38.2
    },
    "nova": {
     "n": 56,
     "acc": 41.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 220
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
    "taro": 0.2292,
    "diana": 0.1492,
    "nova": 0.373,
    "flow": 0.2487
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 46.1
    },
    "diana": {
     "n": 145,
     "acc": 20.7
    },
    "nova": {
     "n": 68,
     "acc": 76.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 315
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
