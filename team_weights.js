// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-23 11:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.289,
   "diana": 0.1779,
   "nova": 0.2815,
   "flow": 0.2517
  },
  "acc": {
   "taro": {
    "n": 4139,
    "acc": 63.8
   },
   "diana": {
    "n": 3735,
    "acc": 39.3
   },
   "nova": {
    "n": 2797,
    "acc": 62.1
   },
   "flow": {
    "n": 733,
    "acc": 55.5
   }
  },
  "graded": 11404
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2776,
    "diana": 0.2048,
    "nova": 0.208,
    "flow": 0.3096
   },
   "acc": {
    "taro": {
     "n": 493,
     "acc": 57.6
    },
    "diana": {
     "n": 320,
     "acc": 42.5
    },
    "nova": {
     "n": 387,
     "acc": 43.2
    },
    "flow": {
     "n": 165,
     "acc": 64.2
    }
   },
   "graded": 1365
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3084,
    "diana": 0.1488,
    "nova": 0.2756,
    "flow": 0.2673
   },
   "acc": {
    "taro": {
     "n": 242,
     "acc": 78.1
    },
    "diana": {
     "n": 152,
     "acc": 36.2
    },
    "nova": {
     "n": 182,
     "acc": 67.0
    },
    "flow": {
     "n": 80,
     "acc": 65.0
    }
   },
   "graded": 656
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2551,
    "diana": 0.1903,
    "nova": 0.2405,
    "flow": 0.314
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 60.9
    },
    "diana": {
     "n": 187,
     "acc": 45.5
    },
    "nova": {
     "n": 141,
     "acc": 57.4
    },
    "flow": {
     "n": 32,
     "acc": 87.5
    }
   },
   "graded": 552
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3378,
    "diana": 0.1449,
    "nova": 0.3223,
    "flow": 0.195
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 70.9
    },
    "diana": {
     "n": 181,
     "acc": 30.4
    },
    "nova": {
     "n": 108,
     "acc": 67.6
    },
    "flow": {
     "n": 44,
     "acc": 40.9
    }
   },
   "graded": 508
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2583,
    "diana": 0.225,
    "nova": 0.2849,
    "flow": 0.2317
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 55.7
    },
    "diana": {
     "n": 173,
     "acc": 48.6
    },
    "nova": {
     "n": 122,
     "acc": 61.5
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 496
  },
  "금융·증권": {
   "weights": {
    "taro": 0.302,
    "diana": 0.1685,
    "nova": 0.2942,
    "flow": 0.2353
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 57.2
    },
    "diana": {
     "n": 260,
     "acc": 31.9
    },
    "nova": {
     "n": 131,
     "acc": 55.7
    },
    "flow": {
     "n": 92,
     "acc": 44.6
    }
   },
   "graded": 712
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
     "n": 223,
     "acc": 84.8
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
   "graded": 531
  },
  "보험": {
   "weights": {
    "taro": 0.2621,
    "diana": 0.2486,
    "nova": 0.2476,
    "flow": 0.2417
   },
   "acc": {
    "taro": {
     "n": 83,
     "acc": 54.2
    },
    "diana": {
     "n": 70,
     "acc": 51.4
    },
    "nova": {
     "n": 41,
     "acc": 51.2
    },
    "flow": {
     "n": 19,
     "acc": 57.9
    }
   },
   "graded": 213
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2859,
    "diana": 0.2199,
    "nova": 0.3007,
    "flow": 0.1936
   },
   "acc": {
    "taro": {
     "n": 523,
     "acc": 68.6
    },
    "diana": {
     "n": 466,
     "acc": 52.8
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
   "graded": 1434
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2958,
    "diana": 0.1922,
    "nova": 0.2808,
    "flow": 0.2312
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 64.0
    },
    "diana": {
     "n": 267,
     "acc": 41.6
    },
    "nova": {
     "n": 163,
     "acc": 60.7
    },
    "flow": {
     "n": 22,
     "acc": 45.5
    }
   },
   "graded": 699
  },
  "조선": {
   "weights": {
    "taro": 0.3277,
    "diana": 0.1439,
    "nova": 0.2886,
    "flow": 0.2398
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 68.3
    },
    "diana": {
     "n": 139,
     "acc": 25.2
    },
    "nova": {
     "n": 103,
     "acc": 60.2
    },
    "flow": {
     "n": 11,
     "acc": 63.6
    }
   },
   "graded": 392
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
     "n": 97,
     "acc": 80.4
    },
    "diana": {
     "n": 89,
     "acc": 20.2
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
   "graded": 250
  },
  "화학·소재": {
   "weights": {
    "taro": 0.282,
    "diana": 0.166,
    "nova": 0.2585,
    "flow": 0.2936
   },
   "acc": {
    "taro": {
     "n": 304,
     "acc": 72.0
    },
    "diana": {
     "n": 309,
     "acc": 42.4
    },
    "nova": {
     "n": 209,
     "acc": 66.0
    },
    "flow": {
     "n": 44,
     "acc": 84.1
    }
   },
   "graded": 866
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2737,
    "diana": 0.1755,
    "nova": 0.2832,
    "flow": 0.2675
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 51.2
    },
    "diana": {
     "n": 192,
     "acc": 32.8
    },
    "nova": {
     "n": 102,
     "acc": 52.9
    },
    "flow": {
     "n": 11,
     "acc": 81.8
    }
   },
   "graded": 477
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2357,
    "diana": 0.2054,
    "nova": 0.2588,
    "flow": 0.3002
   },
   "acc": {
    "taro": {
     "n": 107,
     "acc": 39.3
    },
    "diana": {
     "n": 76,
     "acc": 34.2
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
    "taro": 0.34,
    "diana": 0.1489,
    "nova": 0.3456,
    "flow": 0.1655
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 68.5
    },
    "diana": {
     "n": 111,
     "acc": 20.7
    },
    "nova": {
     "n": 79,
     "acc": 69.6
    },
    "flow": {
     "n": 42,
     "acc": 33.3
    }
   },
   "graded": 359
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2423,
    "diana": 0.1467,
    "nova": 0.3666,
    "flow": 0.2444
   },
   "acc": {
    "taro": {
     "n": 115,
     "acc": 49.6
    },
    "diana": {
     "n": 159,
     "acc": 21.4
    },
    "nova": {
     "n": 77,
     "acc": 76.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 351
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
     "n": 103,
     "acc": 77.7
    },
    "diana": {
     "n": 83,
     "acc": 75.9
    },
    "nova": {
     "n": 78,
     "acc": 75.6
    },
    "flow": {
     "n": 9,
     "acc": 22.2
    }
   },
   "graded": 273
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
     "n": 101,
     "acc": 24.8
    },
    "diana": {
     "n": 127,
     "acc": 29.1
    },
    "nova": {
     "n": 38,
     "acc": 50.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 266
  }
 }
};
