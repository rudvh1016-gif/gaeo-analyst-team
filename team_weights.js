// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 10:30",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2856,
   "diana": 0.1813,
   "nova": 0.2827,
   "flow": 0.2504
  },
  "acc": {
   "taro": {
    "n": 3764,
    "acc": 62.0
   },
   "diana": {
    "n": 3408,
    "acc": 39.4
   },
   "nova": {
    "n": 2650,
    "acc": 61.4
   },
   "flow": {
    "n": 660,
    "acc": 54.4
   }
  },
  "graded": 10482
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.269,
    "diana": 0.2091,
    "nova": 0.227,
    "flow": 0.2949
   },
   "acc": {
    "taro": {
     "n": 445,
     "acc": 54.4
    },
    "diana": {
     "n": 291,
     "acc": 42.3
    },
    "nova": {
     "n": 353,
     "acc": 45.9
    },
    "flow": {
     "n": 151,
     "acc": 59.6
    }
   },
   "graded": 1240
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3093,
    "diana": 0.1524,
    "nova": 0.2749,
    "flow": 0.2634
   },
   "acc": {
    "taro": {
     "n": 217,
     "acc": 75.6
    },
    "diana": {
     "n": 138,
     "acc": 37.0
    },
    "nova": {
     "n": 174,
     "acc": 66.7
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 601
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.281,
    "diana": 0.2101,
    "nova": 0.2661,
    "flow": 0.2428
   },
   "acc": {
    "taro": {
     "n": 178,
     "acc": 57.9
    },
    "diana": {
     "n": 171,
     "acc": 43.3
    },
    "nova": {
     "n": 135,
     "acc": 54.8
    },
    "flow": {
     "n": 28,
     "acc": 82.1
    }
   },
   "graded": 512
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
    "taro": 0.2523,
    "diana": 0.2183,
    "nova": 0.2884,
    "flow": 0.241
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 52.4
    },
    "diana": {
     "n": 159,
     "acc": 45.3
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
   "graded": 462
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2797,
    "diana": 0.1996,
    "nova": 0.2562,
    "flow": 0.2645
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 55.5
    },
    "diana": {
     "n": 235,
     "acc": 39.6
    },
    "nova": {
     "n": 124,
     "acc": 50.8
    },
    "flow": {
     "n": 82,
     "acc": 52.4
    }
   },
   "graded": 652
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
     "acc": 82.8
    },
    "diana": {
     "n": 123,
     "acc": 51.2
    },
    "nova": {
     "n": 157,
     "acc": 81.5
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
    "taro": 0.2812,
    "diana": 0.2253,
    "nova": 0.3041,
    "flow": 0.1894
   },
   "acc": {
    "taro": {
     "n": 473,
     "acc": 66.0
    },
    "diana": {
     "n": 420,
     "acc": 52.9
    },
    "nova": {
     "n": 363,
     "acc": 71.3
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1319
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2965,
    "diana": 0.1922,
    "nova": 0.275,
    "flow": 0.2363
   },
   "acc": {
    "taro": {
     "n": 220,
     "acc": 62.7
    },
    "diana": {
     "n": 241,
     "acc": 40.7
    },
    "nova": {
     "n": 153,
     "acc": 58.2
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 632
  },
  "조선": {
   "weights": {
    "taro": 0.342,
    "diana": 0.1412,
    "nova": 0.2815,
    "flow": 0.2353
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 72.7
    },
    "diana": {
     "n": 129,
     "acc": 20.9
    },
    "nova": {
     "n": 102,
     "acc": 59.8
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
    "taro": 0.2763,
    "diana": 0.1714,
    "nova": 0.2524,
    "flow": 0.2999
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 69.1
    },
    "diana": {
     "n": 280,
     "acc": 42.9
    },
    "nova": {
     "n": 198,
     "acc": 63.1
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
    "taro": 0.2692,
    "diana": 0.1752,
    "nova": 0.2881,
    "flow": 0.2675
   },
   "acc": {
    "taro": {
     "n": 153,
     "acc": 50.3
    },
    "diana": {
     "n": 174,
     "acc": 32.8
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
   "graded": 428
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
    "taro": 0.3428,
    "diana": 0.1511,
    "nova": 0.3551,
    "flow": 0.1511
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 68.1
    },
    "diana": {
     "n": 104,
     "acc": 18.3
    },
    "nova": {
     "n": 78,
     "acc": 70.5
    },
    "flow": {
     "n": 39,
     "acc": 28.2
    }
   },
   "graded": 340
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
    "taro": 0.193,
    "diana": 0.193,
    "nova": 0.2924,
    "flow": 0.3216
   },
   "acc": {
    "taro": {
     "n": 93,
     "acc": 22.6
    },
    "diana": {
     "n": 120,
     "acc": 28.3
    },
    "nova": {
     "n": 33,
     "acc": 45.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 246
  }
 }
};
