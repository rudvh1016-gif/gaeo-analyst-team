// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 16:16",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2891,
   "diana": 0.1729,
   "nova": 0.2902,
   "flow": 0.2478
  },
  "acc": {
   "taro": {
    "n": 3780,
    "acc": 63.6
   },
   "diana": {
    "n": 3403,
    "acc": 38.0
   },
   "nova": {
    "n": 2656,
    "acc": 63.8
   },
   "flow": {
    "n": 668,
    "acc": 54.5
   }
  },
  "graded": 10507
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.2044,
    "nova": 0.2247,
    "flow": 0.2988
   },
   "acc": {
    "taro": {
     "n": 448,
     "acc": 56.5
    },
    "diana": {
     "n": 290,
     "acc": 42.4
    },
    "nova": {
     "n": 356,
     "acc": 46.6
    },
    "flow": {
     "n": 150,
     "acc": 62.0
    }
   },
   "graded": 1244
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3084,
    "diana": 0.149,
    "nova": 0.2834,
    "flow": 0.2591
   },
   "acc": {
    "taro": {
     "n": 220,
     "acc": 77.3
    },
    "diana": {
     "n": 138,
     "acc": 36.2
    },
    "nova": {
     "n": 177,
     "acc": 68.9
    },
    "flow": {
     "n": 73,
     "acc": 63.0
    }
   },
   "graded": 608
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2885,
    "diana": 0.2006,
    "nova": 0.2742,
    "flow": 0.2368
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 60.9
    },
    "diana": {
     "n": 170,
     "acc": 42.4
    },
    "nova": {
     "n": 133,
     "acc": 57.9
    },
    "flow": {
     "n": 29,
     "acc": 86.2
    }
   },
   "graded": 506
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.344,
    "diana": 0.1414,
    "nova": 0.3262,
    "flow": 0.1885
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 73.0
    },
    "diana": {
     "n": 167,
     "acc": 28.7
    },
    "nova": {
     "n": 104,
     "acc": 69.2
    },
    "flow": {
     "n": 40,
     "acc": 40.0
    }
   },
   "graded": 474
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2557,
    "diana": 0.2159,
    "nova": 0.2934,
    "flow": 0.2351
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 54.4
    },
    "diana": {
     "n": 159,
     "acc": 45.9
    },
    "nova": {
     "n": 117,
     "acc": 62.4
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 463
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2945,
    "diana": 0.1741,
    "nova": 0.292,
    "flow": 0.2394
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 58.6
    },
    "diana": {
     "n": 234,
     "acc": 34.6
    },
    "nova": {
     "n": 124,
     "acc": 58.1
    },
    "flow": {
     "n": 84,
     "acc": 47.6
    }
   },
   "graded": 652
  },
  "2차전지": {
   "weights": {
    "taro": 0.2991,
    "diana": 0.2025,
    "nova": 0.2991,
    "flow": 0.1994
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 84.2
    },
    "diana": {
     "n": 128,
     "acc": 50.8
    },
    "nova": {
     "n": 161,
     "acc": 83.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 491
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2841,
    "diana": 0.2215,
    "nova": 0.3089,
    "flow": 0.1855
   },
   "acc": {
    "taro": {
     "n": 476,
     "acc": 67.0
    },
    "diana": {
     "n": 423,
     "acc": 52.2
    },
    "nova": {
     "n": 365,
     "acc": 72.9
    },
    "flow": {
     "n": 64,
     "acc": 43.8
    }
   },
   "graded": 1328
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2989,
    "diana": 0.1819,
    "nova": 0.2851,
    "flow": 0.2341
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 63.8
    },
    "diana": {
     "n": 242,
     "acc": 38.8
    },
    "nova": {
     "n": 156,
     "acc": 60.9
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
    "taro": 0.3428,
    "diana": 0.1404,
    "nova": 0.2827,
    "flow": 0.2341
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 73.2
    },
    "diana": {
     "n": 128,
     "acc": 20.3
    },
    "nova": {
     "n": 101,
     "acc": 60.4
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
     "n": 89,
     "acc": 85.4
    },
    "diana": {
     "n": 82,
     "acc": 14.6
    },
    "nova": {
     "n": 62,
     "acc": 79.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 233
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2801,
    "diana": 0.1621,
    "nova": 0.2621,
    "flow": 0.2956
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 71.1
    },
    "diana": {
     "n": 282,
     "acc": 41.1
    },
    "nova": {
     "n": 200,
     "acc": 66.5
    },
    "flow": {
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 802
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2708,
    "diana": 0.1711,
    "nova": 0.2906,
    "flow": 0.2674
   },
   "acc": {
    "taro": {
     "n": 156,
     "acc": 50.6
    },
    "diana": {
     "n": 175,
     "acc": 32.0
    },
    "nova": {
     "n": 92,
     "acc": 54.3
    },
    "flow": {
     "n": 10,
     "acc": 80.0
    }
   },
   "graded": 433
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2386,
    "diana": 0.215,
    "nova": 0.2498,
    "flow": 0.2967
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 40.2
    },
    "diana": {
     "n": 69,
     "acc": 36.2
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
    "taro": 0.3443,
    "diana": 0.1492,
    "nova": 0.3534,
    "flow": 0.153
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 69.2
    },
    "diana": {
     "n": 103,
     "acc": 17.5
    },
    "nova": {
     "n": 76,
     "acc": 71.1
    },
    "flow": {
     "n": 39,
     "acc": 30.8
    }
   },
   "graded": 335
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
     "n": 144,
     "acc": 19.4
    },
    "nova": {
     "n": 67,
     "acc": 79.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 313
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
    "taro": 0.1785,
    "diana": 0.1785,
    "nova": 0.3455,
    "flow": 0.2975
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 22.3
    },
    "diana": {
     "n": 117,
     "acc": 24.8
    },
    "nova": {
     "n": 31,
     "acc": 58.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 242
  }
 }
};
