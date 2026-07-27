// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-27 10:08",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2723,
   "diana": 0.2079,
   "nova": 0.2636,
   "flow": 0.2562
  },
  "acc": {
   "taro": {
    "n": 5252,
    "acc": 58.9
   },
   "diana": {
    "n": 4739,
    "acc": 44.9
   },
   "nova": {
    "n": 3786,
    "acc": 57.0
   },
   "flow": {
    "n": 928,
    "acc": 55.4
   }
  },
  "graded": 14705
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2693,
    "diana": 0.1964,
    "nova": 0.2328,
    "flow": 0.3014
   },
   "acc": {
    "taro": {
     "n": 624,
     "acc": 60.4
    },
    "diana": {
     "n": 404,
     "acc": 44.1
    },
    "nova": {
     "n": 517,
     "acc": 52.2
    },
    "flow": {
     "n": 210,
     "acc": 67.6
    }
   },
   "graded": 1755
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2937,
    "diana": 0.1711,
    "nova": 0.2652,
    "flow": 0.27
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 71.4
    },
    "diana": {
     "n": 190,
     "acc": 41.6
    },
    "nova": {
     "n": 242,
     "acc": 64.5
    },
    "flow": {
     "n": 96,
     "acc": 65.6
    }
   },
   "graded": 832
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2322,
    "diana": 0.2352,
    "nova": 0.2049,
    "flow": 0.3277
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 51.4
    },
    "diana": {
     "n": 246,
     "acc": 52.0
    },
    "nova": {
     "n": 203,
     "acc": 45.3
    },
    "flow": {
     "n": 40,
     "acc": 72.5
    }
   },
   "graded": 744
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3299,
    "diana": 0.1861,
    "nova": 0.3041,
    "flow": 0.1799
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 63.5
    },
    "diana": {
     "n": 229,
     "acc": 35.8
    },
    "nova": {
     "n": 147,
     "acc": 58.5
    },
    "flow": {
     "n": 52,
     "acc": 34.6
    }
   },
   "graded": 647
  },
  "통신": {
   "weights": {
    "taro": 0.2799,
    "diana": 0.2076,
    "nova": 0.2715,
    "flow": 0.241
   },
   "acc": {
    "taro": {
     "n": 93,
     "acc": 58.1
    },
    "diana": {
     "n": 65,
     "acc": 43.1
    },
    "nova": {
     "n": 71,
     "acc": 56.3
    },
    "flow": {
     "n": 25,
     "acc": 68.0
    }
   },
   "graded": 254
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2483,
    "diana": 0.2603,
    "nova": 0.2556,
    "flow": 0.2358
   },
   "acc": {
    "taro": {
     "n": 226,
     "acc": 52.7
    },
    "diana": {
     "n": 221,
     "acc": 55.2
    },
    "nova": {
     "n": 166,
     "acc": 54.2
    },
    "flow": {
     "n": 23,
     "acc": 56.5
    }
   },
   "graded": 636
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3008,
    "diana": 0.1794,
    "nova": 0.3117,
    "flow": 0.2082
   },
   "acc": {
    "taro": {
     "n": 298,
     "acc": 54.0
    },
    "diana": {
     "n": 329,
     "acc": 32.2
    },
    "nova": {
     "n": 184,
     "acc": 56.0
    },
    "flow": {
     "n": 115,
     "acc": 37.4
    }
   },
   "graded": 926
  },
  "2차전지": {
   "weights": {
    "taro": 0.3007,
    "diana": 0.1982,
    "nova": 0.3007,
    "flow": 0.2004
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 78.1
    },
    "diana": {
     "n": 180,
     "acc": 49.4
    },
    "nova": {
     "n": 220,
     "acc": 77.7
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 680
  },
  "보험": {
   "weights": {
    "taro": 0.2575,
    "diana": 0.2818,
    "nova": 0.2258,
    "flow": 0.2349
   },
   "acc": {
    "taro": {
     "n": 104,
     "acc": 54.8
    },
    "diana": {
     "n": 90,
     "acc": 60.0
    },
    "nova": {
     "n": 52,
     "acc": 48.1
    },
    "flow": {
     "n": 26,
     "acc": 53.8
    }
   },
   "graded": 272
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2664,
    "diana": 0.2267,
    "nova": 0.2791,
    "flow": 0.2278
   },
   "acc": {
    "taro": {
     "n": 664,
     "acc": 63.6
    },
    "diana": {
     "n": 575,
     "acc": 54.1
    },
    "nova": {
     "n": 500,
     "acc": 66.6
    },
    "flow": {
     "n": 92,
     "acc": 54.3
    }
   },
   "graded": 1831
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2756,
    "diana": 0.2326,
    "nova": 0.2515,
    "flow": 0.2404
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 57.3
    },
    "diana": {
     "n": 339,
     "acc": 48.4
    },
    "nova": {
     "n": 216,
     "acc": 52.3
    },
    "flow": {
     "n": 28,
     "acc": 35.7
    }
   },
   "graded": 890
  },
  "조선": {
   "weights": {
    "taro": 0.2739,
    "diana": 0.2256,
    "nova": 0.2369,
    "flow": 0.2637
   },
   "acc": {
    "taro": {
     "n": 181,
     "acc": 51.9
    },
    "diana": {
     "n": 180,
     "acc": 42.8
    },
    "nova": {
     "n": 138,
     "acc": 44.9
    },
    "flow": {
     "n": 15,
     "acc": 46.7
    }
   },
   "graded": 514
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3061,
    "diana": 0.1808,
    "nova": 0.2761,
    "flow": 0.237
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 64.6
    },
    "diana": {
     "n": 118,
     "acc": 38.1
    },
    "nova": {
     "n": 91,
     "acc": 58.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 336
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2668,
    "diana": 0.1937,
    "nova": 0.2406,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 66.9
    },
    "diana": {
     "n": 395,
     "acc": 48.6
    },
    "nova": {
     "n": 285,
     "acc": 60.4
    },
    "flow": {
     "n": 54,
     "acc": 77.8
    }
   },
   "graded": 1118
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2826,
    "diana": 0.3055,
    "nova": 0.1609,
    "flow": 0.251
   },
   "acc": {
    "taro": {
     "n": 74,
     "acc": 52.7
    },
    "diana": {
     "n": 79,
     "acc": 57.0
    },
    "nova": {
     "n": 32,
     "acc": 18.8
    },
    "flow": {
     "n": 47,
     "acc": 46.8
    }
   },
   "graded": 232
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2711,
    "diana": 0.1974,
    "nova": 0.2753,
    "flow": 0.2562
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 52.9
    },
    "diana": {
     "n": 244,
     "acc": 38.5
    },
    "nova": {
     "n": 134,
     "acc": 53.7
    },
    "flow": {
     "n": 14,
     "acc": 78.6
    }
   },
   "graded": 615
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2274,
    "diana": 0.2266,
    "nova": 0.2507,
    "flow": 0.2952
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 38.5
    },
    "diana": {
     "n": 99,
     "acc": 38.4
    },
    "nova": {
     "n": 73,
     "acc": 42.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 307
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2948,
    "diana": 0.1863,
    "nova": 0.286,
    "flow": 0.2329
   },
   "acc": {
    "taro": {
     "n": 158,
     "acc": 58.2
    },
    "diana": {
     "n": 144,
     "acc": 36.8
    },
    "nova": {
     "n": 108,
     "acc": 56.5
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 460
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2401,
    "diana": 0.1637,
    "nova": 0.3234,
    "flow": 0.2728
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 44.0
    },
    "diana": {
     "n": 193,
     "acc": 28.5
    },
    "nova": {
     "n": 108,
     "acc": 59.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 451
  },
  "로봇": {
   "weights": {
    "taro": 0.2709,
    "diana": 0.2643,
    "nova": 0.2617,
    "flow": 0.2031
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 66.7
    },
    "diana": {
     "n": 103,
     "acc": 65.0
    },
    "nova": {
     "n": 104,
     "acc": 64.4
    },
    "flow": {
     "n": 14,
     "acc": 28.6
    }
   },
   "graded": 350
  },
  "식음료": {
   "weights": {
    "taro": 0.1869,
    "diana": 0.2798,
    "nova": 0.2218,
    "flow": 0.3115
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 28.8
    },
    "diana": {
     "n": 167,
     "acc": 44.9
    },
    "nova": {
     "n": 59,
     "acc": 35.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 344
  },
  "여행레저": {
   "weights": {
    "taro": 0.3049,
    "diana": 0.1481,
    "nova": 0.3001,
    "flow": 0.2469
   },
   "acc": {
    "taro": {
     "n": 68,
     "acc": 61.8
    },
    "diana": {
     "n": 58,
     "acc": 19.0
    },
    "nova": {
     "n": 51,
     "acc": 60.8
    },
    "flow": {
     "n": 25,
     "acc": 20.0
    }
   },
   "graded": 202
  }
 }
};
