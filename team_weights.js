// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-27 15:26",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2724,
   "diana": 0.2065,
   "nova": 0.2644,
   "flow": 0.2568
  },
  "acc": {
   "taro": {
    "n": 5248,
    "acc": 59.1
   },
   "diana": {
    "n": 4730,
    "acc": 44.8
   },
   "nova": {
    "n": 3783,
    "acc": 57.3
   },
   "flow": {
    "n": 927,
    "acc": 55.7
   }
  },
  "graded": 14688
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2696,
    "diana": 0.1959,
    "nova": 0.2332,
    "flow": 0.3014
   },
   "acc": {
    "taro": {
     "n": 625,
     "acc": 60.5
    },
    "diana": {
     "n": 405,
     "acc": 44.0
    },
    "nova": {
     "n": 518,
     "acc": 52.3
    },
    "flow": {
     "n": 210,
     "acc": 67.6
    }
   },
   "graded": 1758
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2943,
    "diana": 0.1681,
    "nova": 0.2666,
    "flow": 0.271
   },
   "acc": {
    "taro": {
     "n": 307,
     "acc": 71.7
    },
    "diana": {
     "n": 193,
     "acc": 40.9
    },
    "nova": {
     "n": 245,
     "acc": 64.9
    },
    "flow": {
     "n": 97,
     "acc": 66.0
    }
   },
   "graded": 842
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
    "taro": 0.3296,
    "diana": 0.1824,
    "nova": 0.3046,
    "flow": 0.1834
   },
   "acc": {
    "taro": {
     "n": 216,
     "acc": 63.4
    },
    "diana": {
     "n": 225,
     "acc": 35.1
    },
    "nova": {
     "n": 145,
     "acc": 58.6
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 637
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
    "taro": 0.3022,
    "diana": 0.1757,
    "nova": 0.3149,
    "flow": 0.2072
   },
   "acc": {
    "taro": {
     "n": 297,
     "acc": 54.5
    },
    "diana": {
     "n": 328,
     "acc": 31.7
    },
    "nova": {
     "n": 183,
     "acc": 56.8
    },
    "flow": {
     "n": 115,
     "acc": 37.4
    }
   },
   "graded": 923
  },
  "2차전지": {
   "weights": {
    "taro": 0.3013,
    "diana": 0.1964,
    "nova": 0.3013,
    "flow": 0.2009
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 78.6
    },
    "diana": {
     "n": 180,
     "acc": 48.9
    },
    "nova": {
     "n": 222,
     "acc": 78.4
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 684
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
    "taro": 0.2672,
    "diana": 0.2276,
    "nova": 0.2801,
    "flow": 0.2251
   },
   "acc": {
    "taro": {
     "n": 665,
     "acc": 63.9
    },
    "diana": {
     "n": 575,
     "acc": 54.4
    },
    "nova": {
     "n": 500,
     "acc": 67.0
    },
    "flow": {
     "n": 91,
     "acc": 53.8
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
    "taro": 0.2678,
    "diana": 0.1896,
    "nova": 0.2444,
    "flow": 0.2982
   },
   "acc": {
    "taro": {
     "n": 380,
     "acc": 67.4
    },
    "diana": {
     "n": 390,
     "acc": 47.7
    },
    "nova": {
     "n": 283,
     "acc": 61.5
    },
    "flow": {
     "n": 55,
     "acc": 80.0
    }
   },
   "graded": 1108
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2847,
    "diana": 0.3006,
    "nova": 0.1599,
    "flow": 0.2549
   },
   "acc": {
    "taro": {
     "n": 73,
     "acc": 53.4
    },
    "diana": {
     "n": 78,
     "acc": 56.4
    },
    "nova": {
     "n": 31,
     "acc": 19.4
    },
    "flow": {
     "n": 46,
     "acc": 47.8
    }
   },
   "graded": 228
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2688,
    "diana": 0.1991,
    "nova": 0.2738,
    "flow": 0.2584
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 52.0
    },
    "diana": {
     "n": 244,
     "acc": 38.5
    },
    "nova": {
     "n": 134,
     "acc": 53.0
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
    "taro": 0.2406,
    "diana": 0.1629,
    "nova": 0.3249,
    "flow": 0.2716
   },
   "acc": {
    "taro": {
     "n": 149,
     "acc": 44.3
    },
    "diana": {
     "n": 192,
     "acc": 28.1
    },
    "nova": {
     "n": 107,
     "acc": 59.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 448
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
    "taro": 0.1866,
    "diana": 0.2773,
    "nova": 0.2252,
    "flow": 0.311
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 29.7
    },
    "diana": {
     "n": 166,
     "acc": 44.6
    },
    "nova": {
     "n": 58,
     "acc": 36.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 342
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
