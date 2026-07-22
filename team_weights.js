// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 09:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2864,
   "diana": 0.1802,
   "nova": 0.2841,
   "flow": 0.2493
  },
  "acc": {
   "taro": {
    "n": 3755,
    "acc": 62.2
   },
   "diana": {
    "n": 3397,
    "acc": 39.2
   },
   "nova": {
    "n": 2641,
    "acc": 61.7
   },
   "flow": {
    "n": 659,
    "acc": 54.2
   }
  },
  "graded": 10452
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2706,
    "diana": 0.2116,
    "nova": 0.2265,
    "flow": 0.2913
   },
   "acc": {
    "taro": {
     "n": 444,
     "acc": 54.5
    },
    "diana": {
     "n": 291,
     "acc": 42.6
    },
    "nova": {
     "n": 353,
     "acc": 45.6
    },
    "flow": {
     "n": 150,
     "acc": 58.7
    }
   },
   "graded": 1238
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3122,
    "diana": 0.1508,
    "nova": 0.2767,
    "flow": 0.2602
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 75.3
    },
    "diana": {
     "n": 138,
     "acc": 36.2
    },
    "nova": {
     "n": 176,
     "acc": 66.5
    },
    "flow": {
     "n": 72,
     "acc": 62.5
    }
   },
   "graded": 605
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.2096,
    "nova": 0.2675,
    "flow": 0.2422
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 58.0
    },
    "diana": {
     "n": 171,
     "acc": 43.3
    },
    "nova": {
     "n": 134,
     "acc": 55.2
    },
    "flow": {
     "n": 28,
     "acc": 85.7
    }
   },
   "graded": 509
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3433,
    "diana": 0.1424,
    "nova": 0.3196,
    "flow": 0.1947
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 72.3
    },
    "diana": {
     "n": 164,
     "acc": 29.9
    },
    "nova": {
     "n": 101,
     "acc": 67.3
    },
    "flow": {
     "n": 39,
     "acc": 41.0
    }
   },
   "graded": 463
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2547,
    "diana": 0.2162,
    "nova": 0.2917,
    "flow": 0.2375
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 53.6
    },
    "diana": {
     "n": 156,
     "acc": 45.5
    },
    "nova": {
     "n": 114,
     "acc": 61.4
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
    "taro": 0.2826,
    "diana": 0.1957,
    "nova": 0.2628,
    "flow": 0.2589
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 55.9
    },
    "diana": {
     "n": 235,
     "acc": 38.7
    },
    "nova": {
     "n": 125,
     "acc": 52.0
    },
    "flow": {
     "n": 82,
     "acc": 51.2
    }
   },
   "graded": 653
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
     "acc": 82.7
    },
    "diana": {
     "n": 122,
     "acc": 50.8
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
   "graded": 475
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2796,
    "diana": 0.2267,
    "nova": 0.3017,
    "flow": 0.192
   },
   "acc": {
    "taro": {
     "n": 473,
     "acc": 66.0
    },
    "diana": {
     "n": 417,
     "acc": 53.5
    },
    "nova": {
     "n": 361,
     "acc": 71.2
    },
    "flow": {
     "n": 64,
     "acc": 45.3
    }
   },
   "graded": 1315
  },
  "지주·상사": {
   "weights": {
    "taro": 0.296,
    "diana": 0.1913,
    "nova": 0.2768,
    "flow": 0.2358
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 62.8
    },
    "diana": {
     "n": 244,
     "acc": 40.6
    },
    "nova": {
     "n": 155,
     "acc": 58.7
    },
    "flow": {
     "n": 20,
     "acc": 45.0
    }
   },
   "graded": 642
  },
  "조선": {
   "weights": {
    "taro": 0.342,
    "diana": 0.1408,
    "nova": 0.2825,
    "flow": 0.2347
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 72.9
    },
    "diana": {
     "n": 130,
     "acc": 20.8
    },
    "nova": {
     "n": 103,
     "acc": 60.2
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
    "taro": 0.3277,
    "diana": 0.1311,
    "nova": 0.3227,
    "flow": 0.2185
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 81.5
    },
    "diana": {
     "n": 85,
     "acc": 18.8
    },
    "nova": {
     "n": 65,
     "acc": 73.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 242
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2768,
    "diana": 0.17,
    "nova": 0.2536,
    "flow": 0.2996
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 69.3
    },
    "diana": {
     "n": 282,
     "acc": 42.6
    },
    "nova": {
     "n": 200,
     "acc": 63.5
    },
    "flow": {
     "n": 39,
     "acc": 82.1
    }
   },
   "graded": 798
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2712,
    "diana": 0.1732,
    "nova": 0.2896,
    "flow": 0.266
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 51.0
    },
    "diana": {
     "n": 172,
     "acc": 32.6
    },
    "nova": {
     "n": 90,
     "acc": 54.4
    },
    "flow": {
     "n": 9,
     "acc": 77.8
    }
   },
   "graded": 422
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.243,
    "diana": 0.2198,
    "nova": 0.2456,
    "flow": 0.2916
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 41.7
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
   "graded": 222
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3432,
    "diana": 0.1493,
    "nova": 0.3583,
    "flow": 0.1493
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 69.0
    },
    "diana": {
     "n": 102,
     "acc": 16.7
    },
    "nova": {
     "n": 75,
     "acc": 72.0
    },
    "flow": {
     "n": 38,
     "acc": 28.9
    }
   },
   "graded": 331
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
    "taro": 0.1912,
    "diana": 0.1912,
    "nova": 0.2988,
    "flow": 0.3187
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 22.1
    },
    "diana": {
     "n": 121,
     "acc": 28.1
    },
    "nova": {
     "n": 32,
     "acc": 46.9
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
