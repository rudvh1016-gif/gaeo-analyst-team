// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 14:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2872,
   "diana": 0.1778,
   "nova": 0.2854,
   "flow": 0.2497
  },
  "acc": {
   "taro": {
    "n": 3765,
    "acc": 62.8
   },
   "diana": {
    "n": 3400,
    "acc": 38.9
   },
   "nova": {
    "n": 2645,
    "acc": 62.4
   },
   "flow": {
    "n": 659,
    "acc": 54.6
   }
  },
  "graded": 10469
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.271,
    "diana": 0.2073,
    "nova": 0.2247,
    "flow": 0.2971
   },
   "acc": {
    "taro": {
     "n": 447,
     "acc": 55.7
    },
    "diana": {
     "n": 291,
     "acc": 42.6
    },
    "nova": {
     "n": 355,
     "acc": 46.2
    },
    "flow": {
     "n": 149,
     "acc": 61.1
    }
   },
   "graded": 1242
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3076,
    "diana": 0.1508,
    "nova": 0.2797,
    "flow": 0.262
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 76.9
    },
    "diana": {
     "n": 136,
     "acc": 36.8
    },
    "nova": {
     "n": 173,
     "acc": 68.2
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 597
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.2078,
    "nova": 0.2652,
    "flow": 0.2434
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 58.3
    },
    "diana": {
     "n": 171,
     "acc": 42.7
    },
    "nova": {
     "n": 134,
     "acc": 54.5
    },
    "flow": {
     "n": 27,
     "acc": 85.2
    }
   },
   "graded": 507
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3419,
    "diana": 0.1424,
    "nova": 0.321,
    "flow": 0.1947
   },
   "acc": {
    "taro": {
     "n": 161,
     "acc": 72.0
    },
    "diana": {
     "n": 165,
     "acc": 29.7
    },
    "nova": {
     "n": 102,
     "acc": 67.6
    },
    "flow": {
     "n": 39,
     "acc": 41.0
    }
   },
   "graded": 467
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2545,
    "diana": 0.2179,
    "nova": 0.2915,
    "flow": 0.2361
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 53.9
    },
    "diana": {
     "n": 156,
     "acc": 46.2
    },
    "nova": {
     "n": 115,
     "acc": 61.7
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 454
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2872,
    "diana": 0.1877,
    "nova": 0.2738,
    "flow": 0.2513
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 57.1
    },
    "diana": {
     "n": 233,
     "acc": 37.3
    },
    "nova": {
     "n": 123,
     "acc": 54.5
    },
    "flow": {
     "n": 82,
     "acc": 50.0
    }
   },
   "graded": 648
  },
  "2차전지": {
   "weights": {
    "taro": 0.2995,
    "diana": 0.2013,
    "nova": 0.2995,
    "flow": 0.1997
   },
   "acc": {
    "taro": {
     "n": 198,
     "acc": 83.8
    },
    "diana": {
     "n": 125,
     "acc": 50.4
    },
    "nova": {
     "n": 157,
     "acc": 82.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 480
  },
  "보험": {
   "weights": {
    "taro": 0.2554,
    "diana": 0.2649,
    "nova": 0.2398,
    "flow": 0.2398
   },
   "acc": {
    "taro": {
     "n": 77,
     "acc": 53.2
    },
    "diana": {
     "n": 67,
     "acc": 55.2
    },
    "nova": {
     "n": 38,
     "acc": 50.0
    },
    "flow": {
     "n": 18,
     "acc": 61.1
    }
   },
   "graded": 200
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2831,
    "diana": 0.2227,
    "nova": 0.3061,
    "flow": 0.1881
   },
   "acc": {
    "taro": {
     "n": 477,
     "acc": 66.9
    },
    "diana": {
     "n": 422,
     "acc": 52.6
    },
    "nova": {
     "n": 365,
     "acc": 72.3
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1327
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2969,
    "diana": 0.1862,
    "nova": 0.2817,
    "flow": 0.2352
   },
   "acc": {
    "taro": {
     "n": 225,
     "acc": 63.1
    },
    "diana": {
     "n": 245,
     "acc": 39.6
    },
    "nova": {
     "n": 157,
     "acc": 59.9
    },
    "flow": {
     "n": 20,
     "acc": 45.0
    }
   },
   "graded": 647
  },
  "조선": {
   "weights": {
    "taro": 0.3419,
    "diana": 0.1416,
    "nova": 0.2804,
    "flow": 0.236
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 72.4
    },
    "diana": {
     "n": 128,
     "acc": 21.1
    },
    "nova": {
     "n": 101,
     "acc": 59.4
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
    "taro": 0.3261,
    "diana": 0.1304,
    "nova": 0.3261,
    "flow": 0.2174
   },
   "acc": {
    "taro": {
     "n": 88,
     "acc": 84.1
    },
    "diana": {
     "n": 81,
     "acc": 16.0
    },
    "nova": {
     "n": 61,
     "acc": 77.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 230
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1702,
    "nova": 0.254,
    "flow": 0.2978
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 70.0
    },
    "diana": {
     "n": 280,
     "acc": 42.9
    },
    "nova": {
     "n": 197,
     "acc": 64.0
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
    "taro": 0.2693,
    "diana": 0.1722,
    "nova": 0.2909,
    "flow": 0.2676
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 50.3
    },
    "diana": {
     "n": 174,
     "acc": 32.2
    },
    "nova": {
     "n": 92,
     "acc": 54.3
    },
    "flow": {
     "n": 9,
     "acc": 77.8
    }
   },
   "graded": 430
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2397,
    "diana": 0.2169,
    "nova": 0.2484,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 40.6
    },
    "diana": {
     "n": 68,
     "acc": 36.8
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
   "graded": 221
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3435,
    "diana": 0.152,
    "nova": 0.3487,
    "flow": 0.1559
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 67.8
    },
    "diana": {
     "n": 104,
     "acc": 19.2
    },
    "nova": {
     "n": 77,
     "acc": 68.8
    },
    "flow": {
     "n": 39,
     "acc": 30.8
    }
   },
   "graded": 338
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2329,
    "diana": 0.1485,
    "nova": 0.3712,
    "flow": 0.2475
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 47.1
    },
    "diana": {
     "n": 145,
     "acc": 20.0
    },
    "nova": {
     "n": 68,
     "acc": 77.9
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
    "taro": 0.1857,
    "diana": 0.1857,
    "nova": 0.3189,
    "flow": 0.3096
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 23.4
    },
    "diana": {
     "n": 120,
     "acc": 27.5
    },
    "nova": {
     "n": 33,
     "acc": 51.5
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
