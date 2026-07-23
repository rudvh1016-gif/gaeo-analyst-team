// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 16:29",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2846,
   "diana": 0.1823,
   "nova": 0.2809,
   "flow": 0.2521
  },
  "acc": {
   "taro": {
    "n": 4126,
    "acc": 62.6
   },
   "diana": {
    "n": 3732,
    "acc": 40.1
   },
   "nova": {
    "n": 2796,
    "acc": 61.8
   },
   "flow": {
    "n": 732,
    "acc": 55.5
   }
  },
  "graded": 11386
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2774,
    "diana": 0.205,
    "nova": 0.2077,
    "flow": 0.3099
   },
   "acc": {
    "taro": {
     "n": 494,
     "acc": 57.5
    },
    "diana": {
     "n": 320,
     "acc": 42.5
    },
    "nova": {
     "n": 388,
     "acc": 43.0
    },
    "flow": {
     "n": 165,
     "acc": 64.2
    }
   },
   "graded": 1367
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3088,
    "diana": 0.1527,
    "nova": 0.276,
    "flow": 0.2625
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 76.7
    },
    "diana": {
     "n": 151,
     "acc": 37.1
    },
    "nova": {
     "n": 182,
     "acc": 67.0
    },
    "flow": {
     "n": 80,
     "acc": 63.7
    }
   },
   "graded": 653
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2481,
    "diana": 0.193,
    "nova": 0.2405,
    "flow": 0.3184
   },
   "acc": {
    "taro": {
     "n": 190,
     "acc": 58.4
    },
    "diana": {
     "n": 187,
     "acc": 45.5
    },
    "nova": {
     "n": 143,
     "acc": 56.6
    },
    "flow": {
     "n": 31,
     "acc": 83.9
    }
   },
   "graded": 551
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3299,
    "diana": 0.1538,
    "nova": 0.3177,
    "flow": 0.1986
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 69.5
    },
    "diana": {
     "n": 182,
     "acc": 32.4
    },
    "nova": {
     "n": 109,
     "acc": 67.0
    },
    "flow": {
     "n": 43,
     "acc": 41.9
    }
   },
   "graded": 508
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2551,
    "diana": 0.2295,
    "nova": 0.2832,
    "flow": 0.2322
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 54.9
    },
    "diana": {
     "n": 174,
     "acc": 49.4
    },
    "nova": {
     "n": 123,
     "acc": 61.0
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 497
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2999,
    "diana": 0.1699,
    "nova": 0.2931,
    "flow": 0.237
   },
   "acc": {
    "taro": {
     "n": 228,
     "acc": 57.0
    },
    "diana": {
     "n": 257,
     "acc": 32.3
    },
    "nova": {
     "n": 131,
     "acc": 55.7
    },
    "flow": {
     "n": 91,
     "acc": 45.1
    }
   },
   "graded": 707
  },
  "2차전지": {
   "weights": {
    "taro": 0.2992,
    "diana": 0.2022,
    "nova": 0.2992,
    "flow": 0.1994
   },
   "acc": {
    "taro": {
     "n": 222,
     "acc": 82.4
    },
    "diana": {
     "n": 142,
     "acc": 50.7
    },
    "nova": {
     "n": 166,
     "acc": 82.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 530
  },
  "보험": {
   "weights": {
    "taro": 0.2625,
    "diana": 0.2533,
    "nova": 0.248,
    "flow": 0.2362
   },
   "acc": {
    "taro": {
     "n": 81,
     "acc": 55.6
    },
    "diana": {
     "n": 69,
     "acc": 53.6
    },
    "nova": {
     "n": 40,
     "acc": 52.5
    },
    "flow": {
     "n": 20,
     "acc": 60.0
    }
   },
   "graded": 210
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2812,
    "diana": 0.2236,
    "nova": 0.3013,
    "flow": 0.194
   },
   "acc": {
    "taro": {
     "n": 521,
     "acc": 67.4
    },
    "diana": {
     "n": 461,
     "acc": 53.6
    },
    "nova": {
     "n": 374,
     "acc": 72.2
    },
    "flow": {
     "n": 71,
     "acc": 46.5
    }
   },
   "graded": 1427
  },
  "지주·상사": {
   "weights": {
    "taro": 0.292,
    "diana": 0.1964,
    "nova": 0.2801,
    "flow": 0.2315
   },
   "acc": {
    "taro": {
     "n": 241,
     "acc": 63.1
    },
    "diana": {
     "n": 264,
     "acc": 42.4
    },
    "nova": {
     "n": 162,
     "acc": 60.5
    },
    "flow": {
     "n": 21,
     "acc": 42.9
    }
   },
   "graded": 688
  },
  "조선": {
   "weights": {
    "taro": 0.3206,
    "diana": 0.1458,
    "nova": 0.2906,
    "flow": 0.243
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 66.0
    },
    "diana": {
     "n": 141,
     "acc": 27.7
    },
    "nova": {
     "n": 102,
     "acc": 59.8
    },
    "flow": {
     "n": 11,
     "acc": 63.6
    }
   },
   "graded": 395
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
     "n": 100,
     "acc": 78.0
    },
    "diana": {
     "n": 92,
     "acc": 22.8
    },
    "nova": {
     "n": 64,
     "acc": 76.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 256
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.169,
    "nova": 0.2582,
    "flow": 0.2955
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 70.4
    },
    "diana": {
     "n": 310,
     "acc": 42.9
    },
    "nova": {
     "n": 209,
     "acc": 65.6
    },
    "flow": {
     "n": 44,
     "acc": 81.8
    }
   },
   "graded": 867
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2713,
    "diana": 0.1816,
    "nova": 0.2789,
    "flow": 0.2682
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 50.6
    },
    "diana": {
     "n": 192,
     "acc": 33.9
    },
    "nova": {
     "n": 100,
     "acc": 52.0
    },
    "flow": {
     "n": 11,
     "acc": 81.8
    }
   },
   "graded": 475
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2381,
    "diana": 0.2104,
    "nova": 0.2553,
    "flow": 0.2962
   },
   "acc": {
    "taro": {
     "n": 107,
     "acc": 40.2
    },
    "diana": {
     "n": 76,
     "acc": 35.5
    },
    "nova": {
     "n": 58,
     "acc": 43.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 241
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3272,
    "diana": 0.1496,
    "nova": 0.3452,
    "flow": 0.1781
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 65.6
    },
    "diana": {
     "n": 113,
     "acc": 23.9
    },
    "nova": {
     "n": 78,
     "acc": 69.2
    },
    "flow": {
     "n": 42,
     "acc": 35.7
    }
   },
   "graded": 361
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2359,
    "diana": 0.1482,
    "nova": 0.3689,
    "flow": 0.247
   },
   "acc": {
    "taro": {
     "n": 111,
     "acc": 47.7
    },
    "diana": {
     "n": 155,
     "acc": 21.3
    },
    "nova": {
     "n": 75,
     "acc": 74.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 341
  },
  "로봇": {
   "weights": {
    "taro": 0.2742,
    "diana": 0.2687,
    "nova": 0.2742,
    "flow": 0.1828
   },
   "acc": {
    "taro": {
     "n": 103,
     "acc": 75.7
    },
    "diana": {
     "n": 83,
     "acc": 73.5
    },
    "nova": {
     "n": 78,
     "acc": 75.6
    },
    "flow": {
     "n": 10,
     "acc": 30.0
    }
   },
   "graded": 274
  },
  "식음료": {
   "weights": {
    "taro": 0.1881,
    "diana": 0.1929,
    "nova": 0.3055,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 25.0
    },
    "diana": {
     "n": 130,
     "acc": 30.8
    },
    "nova": {
     "n": 39,
     "acc": 48.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 269
  }
 }
};
