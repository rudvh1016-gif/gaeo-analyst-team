// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 09:12",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.27,
   "diana": 0.2123,
   "nova": 0.2575,
   "flow": 0.2602
  },
  "acc": {
   "taro": {
    "n": 5587,
    "acc": 58.4
   },
   "diana": {
    "n": 5051,
    "acc": 45.9
   },
   "nova": {
    "n": 4202,
    "acc": 55.7
   },
   "flow": {
    "n": 977,
    "acc": 56.3
   }
  },
  "graded": 15817
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2687,
    "diana": 0.1907,
    "nova": 0.2437,
    "flow": 0.2969
   },
   "acc": {
    "taro": {
     "n": 662,
     "acc": 61.9
    },
    "diana": {
     "n": 430,
     "acc": 44.0
    },
    "nova": {
     "n": 566,
     "acc": 56.2
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1883
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2953,
    "diana": 0.1673,
    "nova": 0.2696,
    "flow": 0.2677
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 72.5
    },
    "diana": {
     "n": 207,
     "acc": 41.1
    },
    "nova": {
     "n": 269,
     "acc": 66.2
    },
    "flow": {
     "n": 102,
     "acc": 65.7
    }
   },
   "graded": 905
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2362,
    "diana": 0.2417,
    "nova": 0.2062,
    "flow": 0.3158
   },
   "acc": {
    "taro": {
     "n": 273,
     "acc": 51.6
    },
    "diana": {
     "n": 263,
     "acc": 52.9
    },
    "nova": {
     "n": 224,
     "acc": 45.1
    },
    "flow": {
     "n": 42,
     "acc": 69.0
    }
   },
   "graded": 802
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3201,
    "diana": 0.1876,
    "nova": 0.3038,
    "flow": 0.1885
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 60.9
    },
    "diana": {
     "n": 241,
     "acc": 35.7
    },
    "nova": {
     "n": 161,
     "acc": 57.8
    },
    "flow": {
     "n": 53,
     "acc": 35.8
    }
   },
   "graded": 685
  },
  "통신": {
   "weights": {
    "taro": 0.2792,
    "diana": 0.2189,
    "nova": 0.2619,
    "flow": 0.24
   },
   "acc": {
    "taro": {
     "n": 98,
     "acc": 58.2
    },
    "diana": {
     "n": 68,
     "acc": 45.6
    },
    "nova": {
     "n": 77,
     "acc": 54.5
    },
    "flow": {
     "n": 26,
     "acc": 69.2
    }
   },
   "graded": 269
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2496,
    "diana": 0.271,
    "nova": 0.2397,
    "flow": 0.2397
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 52.1
    },
    "diana": {
     "n": 237,
     "acc": 56.5
    },
    "nova": {
     "n": 186,
     "acc": 50.0
    },
    "flow": {
     "n": 25,
     "acc": 60.0
    }
   },
   "graded": 690
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3038,
    "diana": 0.1747,
    "nova": 0.3177,
    "flow": 0.2038
   },
   "acc": {
    "taro": {
     "n": 313,
     "acc": 55.3
    },
    "diana": {
     "n": 343,
     "acc": 31.8
    },
    "nova": {
     "n": 199,
     "acc": 57.8
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 971
  },
  "2차전지": {
   "weights": {
    "taro": 0.3029,
    "diana": 0.1924,
    "nova": 0.3029,
    "flow": 0.2019
   },
   "acc": {
    "taro": {
     "n": 299,
     "acc": 76.6
    },
    "diana": {
     "n": 191,
     "acc": 47.6
    },
    "nova": {
     "n": 242,
     "acc": 76.4
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 734
  },
  "보험": {
   "weights": {
    "taro": 0.2607,
    "diana": 0.2929,
    "nova": 0.2096,
    "flow": 0.2368
   },
   "acc": {
    "taro": {
     "n": 109,
     "acc": 55.0
    },
    "diana": {
     "n": 97,
     "acc": 61.9
    },
    "nova": {
     "n": 61,
     "acc": 44.3
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 294
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.261,
    "diana": 0.2309,
    "nova": 0.2688,
    "flow": 0.2393
   },
   "acc": {
    "taro": {
     "n": 717,
     "acc": 61.4
    },
    "diana": {
     "n": 617,
     "acc": 54.3
    },
    "nova": {
     "n": 557,
     "acc": 63.2
    },
    "flow": {
     "n": 96,
     "acc": 56.2
    }
   },
   "graded": 1987
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.2344,
    "nova": 0.2485,
    "flow": 0.2425
   },
   "acc": {
    "taro": {
     "n": 325,
     "acc": 56.6
    },
    "diana": {
     "n": 362,
     "acc": 48.3
    },
    "nova": {
     "n": 240,
     "acc": 51.2
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 956
  },
  "조선": {
   "weights": {
    "taro": 0.2656,
    "diana": 0.2477,
    "nova": 0.2198,
    "flow": 0.2669
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 49.7
    },
    "diana": {
     "n": 194,
     "acc": 46.4
    },
    "nova": {
     "n": 153,
     "acc": 41.2
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 558
  },
  "철강·금속": {
   "weights": {
    "taro": 0.2969,
    "diana": 0.2085,
    "nova": 0.2521,
    "flow": 0.2426
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 61.2
    },
    "diana": {
     "n": 128,
     "acc": 43.0
    },
    "nova": {
     "n": 102,
     "acc": 52.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 364
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2666,
    "diana": 0.1939,
    "nova": 0.2392,
    "flow": 0.3003
   },
   "acc": {
    "taro": {
     "n": 401,
     "acc": 66.6
    },
    "diana": {
     "n": 411,
     "acc": 48.4
    },
    "nova": {
     "n": 308,
     "acc": 59.7
    },
    "flow": {
     "n": 58,
     "acc": 79.3
    }
   },
   "graded": 1178
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2746,
    "diana": 0.3021,
    "nova": 0.1567,
    "flow": 0.2665
   },
   "acc": {
    "taro": {
     "n": 78,
     "acc": 52.6
    },
    "diana": {
     "n": 83,
     "acc": 57.8
    },
    "nova": {
     "n": 37,
     "acc": 18.9
    },
    "flow": {
     "n": 49,
     "acc": 51.0
    }
   },
   "graded": 247
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2711,
    "diana": 0.208,
    "nova": 0.2638,
    "flow": 0.2571
   },
   "acc": {
    "taro": {
     "n": 239,
     "acc": 52.7
    },
    "diana": {
     "n": 262,
     "acc": 40.5
    },
    "nova": {
     "n": 154,
     "acc": 51.3
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 670
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2363,
    "diana": 0.2505,
    "nova": 0.2219,
    "flow": 0.2913
   },
   "acc": {
    "taro": {
     "n": 143,
     "acc": 40.6
    },
    "diana": {
     "n": 107,
     "acc": 43.0
    },
    "nova": {
     "n": 84,
     "acc": 38.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 334
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2904,
    "diana": 0.2036,
    "nova": 0.2712,
    "flow": 0.2349
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 57.1
    },
    "diana": {
     "n": 155,
     "acc": 40.0
    },
    "nova": {
     "n": 122,
     "acc": 53.3
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 499
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2347,
    "diana": 0.1832,
    "nova": 0.2991,
    "flow": 0.283
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 41.5
    },
    "diana": {
     "n": 207,
     "acc": 32.4
    },
    "nova": {
     "n": 123,
     "acc": 52.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 494
  },
  "로봇": {
   "weights": {
    "taro": 0.2693,
    "diana": 0.264,
    "nova": 0.2593,
    "flow": 0.2074
   },
   "acc": {
    "taro": {
     "n": 134,
     "acc": 64.9
    },
    "diana": {
     "n": 110,
     "acc": 63.6
    },
    "nova": {
     "n": 112,
     "acc": 62.5
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 371
  },
  "식음료": {
   "weights": {
    "taro": 0.1924,
    "diana": 0.3041,
    "nova": 0.1888,
    "flow": 0.3147
   },
   "acc": {
    "taro": {
     "n": 121,
     "acc": 30.6
    },
    "diana": {
     "n": 178,
     "acc": 48.3
    },
    "nova": {
     "n": 72,
     "acc": 29.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 371
  },
  "여행레저": {
   "weights": {
    "taro": 0.3005,
    "diana": 0.1572,
    "nova": 0.2802,
    "flow": 0.2621
   },
   "acc": {
    "taro": {
     "n": 75,
     "acc": 57.3
    },
    "diana": {
     "n": 63,
     "acc": 25.4
    },
    "nova": {
     "n": 58,
     "acc": 53.4
    },
    "flow": {
     "n": 27,
     "acc": 25.9
    }
   },
   "graded": 223
  }
 }
};
