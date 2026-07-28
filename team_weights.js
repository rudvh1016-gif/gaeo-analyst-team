// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 12:12",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2719,
   "diana": 0.2052,
   "nova": 0.2663,
   "flow": 0.2565
  },
  "acc": {
   "taro": {
    "n": 5594,
    "acc": 59.6
   },
   "diana": {
    "n": 5054,
    "acc": 45.0
   },
   "nova": {
    "n": 4206,
    "acc": 58.3
   },
   "flow": {
    "n": 977,
    "acc": 56.2
   }
  },
  "graded": 15831
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2695,
    "diana": 0.1884,
    "nova": 0.2451,
    "flow": 0.297
   },
   "acc": {
    "taro": {
     "n": 665,
     "acc": 62.1
    },
    "diana": {
     "n": 433,
     "acc": 43.4
    },
    "nova": {
     "n": 570,
     "acc": 56.5
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1893
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2954,
    "diana": 0.1648,
    "nova": 0.2704,
    "flow": 0.2694
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 73.1
    },
    "diana": {
     "n": 206,
     "acc": 40.8
    },
    "nova": {
     "n": 269,
     "acc": 66.9
    },
    "flow": {
     "n": 102,
     "acc": 66.7
    }
   },
   "graded": 904
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2409,
    "diana": 0.2304,
    "nova": 0.2155,
    "flow": 0.3132
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 53.6
    },
    "diana": {
     "n": 263,
     "acc": 51.3
    },
    "nova": {
     "n": 225,
     "acc": 48.0
    },
    "flow": {
     "n": 43,
     "acc": 69.8
    }
   },
   "graded": 805
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3279,
    "diana": 0.1775,
    "nova": 0.3168,
    "flow": 0.1779
   },
   "acc": {
    "taro": {
     "n": 230,
     "acc": 62.6
    },
    "diana": {
     "n": 242,
     "acc": 33.9
    },
    "nova": {
     "n": 162,
     "acc": 60.5
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 687
  },
  "통신": {
   "weights": {
    "taro": 0.2806,
    "diana": 0.2106,
    "nova": 0.2709,
    "flow": 0.2378
   },
   "acc": {
    "taro": {
     "n": 100,
     "acc": 59.0
    },
    "diana": {
     "n": 70,
     "acc": 44.3
    },
    "nova": {
     "n": 79,
     "acc": 57.0
    },
    "flow": {
     "n": 27,
     "acc": 66.7
    }
   },
   "graded": 276
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2498,
    "diana": 0.2613,
    "nova": 0.2508,
    "flow": 0.238
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 52.5
    },
    "diana": {
     "n": 235,
     "acc": 54.9
    },
    "nova": {
     "n": 186,
     "acc": 52.7
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
    "taro": 0.304,
    "diana": 0.1658,
    "nova": 0.3287,
    "flow": 0.2015
   },
   "acc": {
    "taro": {
     "n": 320,
     "acc": 55.9
    },
    "diana": {
     "n": 354,
     "acc": 30.5
    },
    "nova": {
     "n": 210,
     "acc": 60.5
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 1000
  },
  "2차전지": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1975,
    "nova": 0.3009,
    "flow": 0.2006
   },
   "acc": {
    "taro": {
     "n": 300,
     "acc": 79.3
    },
    "diana": {
     "n": 193,
     "acc": 49.2
    },
    "nova": {
     "n": 243,
     "acc": 79.8
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 738
  },
  "보험": {
   "weights": {
    "taro": 0.259,
    "diana": 0.2827,
    "nova": 0.2251,
    "flow": 0.2331
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 55.6
    },
    "diana": {
     "n": 94,
     "acc": 60.6
    },
    "nova": {
     "n": 58,
     "acc": 48.3
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 287
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2656,
    "diana": 0.2281,
    "nova": 0.2783,
    "flow": 0.2279
   },
   "acc": {
    "taro": {
     "n": 713,
     "acc": 63.7
    },
    "diana": {
     "n": 618,
     "acc": 54.7
    },
    "nova": {
     "n": 553,
     "acc": 66.7
    },
    "flow": {
     "n": 97,
     "acc": 54.6
    }
   },
   "graded": 1981
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2761,
    "diana": 0.2264,
    "nova": 0.2586,
    "flow": 0.2389
   },
   "acc": {
    "taro": {
     "n": 327,
     "acc": 57.8
    },
    "diana": {
     "n": 363,
     "acc": 47.4
    },
    "nova": {
     "n": 242,
     "acc": 54.1
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 961
  },
  "조선": {
   "weights": {
    "taro": 0.2689,
    "diana": 0.232,
    "nova": 0.2357,
    "flow": 0.2634
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 51.0
    },
    "diana": {
     "n": 193,
     "acc": 44.0
    },
    "nova": {
     "n": 152,
     "acc": 44.7
    },
    "flow": {
     "n": 17,
     "acc": 47.1
    }
   },
   "graded": 554
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.1875,
    "nova": 0.2711,
    "flow": 0.2372
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 64.1
    },
    "diana": {
     "n": 124,
     "acc": 39.5
    },
    "nova": {
     "n": 98,
     "acc": 57.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 353
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2667,
    "diana": 0.1881,
    "nova": 0.2474,
    "flow": 0.2978
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 67.2
    },
    "diana": {
     "n": 416,
     "acc": 47.4
    },
    "nova": {
     "n": 313,
     "acc": 62.3
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1192
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2829,
    "diana": 0.2984,
    "nova": 0.1591,
    "flow": 0.2596
   },
   "acc": {
    "taro": {
     "n": 75,
     "acc": 53.3
    },
    "diana": {
     "n": 80,
     "acc": 56.2
    },
    "nova": {
     "n": 34,
     "acc": 23.5
    },
    "flow": {
     "n": 47,
     "acc": 48.9
    }
   },
   "graded": 236
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2693,
    "diana": 0.198,
    "nova": 0.2774,
    "flow": 0.2554
   },
   "acc": {
    "taro": {
     "n": 239,
     "acc": 52.7
    },
    "diana": {
     "n": 258,
     "acc": 38.8
    },
    "nova": {
     "n": 151,
     "acc": 54.3
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 663
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2397,
    "diana": 0.2286,
    "nova": 0.2433,
    "flow": 0.2884
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 41.5
    },
    "diana": {
     "n": 106,
     "acc": 39.6
    },
    "nova": {
     "n": 83,
     "acc": 42.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 331
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2966,
    "diana": 0.1863,
    "nova": 0.2852,
    "flow": 0.2319
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 59.0
    },
    "diana": {
     "n": 151,
     "acc": 37.1
    },
    "nova": {
     "n": 118,
     "acc": 56.8
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 487
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2367,
    "diana": 0.1775,
    "nova": 0.3044,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 42.1
    },
    "diana": {
     "n": 206,
     "acc": 31.6
    },
    "nova": {
     "n": 122,
     "acc": 54.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 492
  },
  "로봇": {
   "weights": {
    "taro": 0.2654,
    "diana": 0.2678,
    "nova": 0.2677,
    "flow": 0.199
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 66.7
    },
    "diana": {
     "n": 110,
     "acc": 67.3
    },
    "nova": {
     "n": 113,
     "acc": 67.3
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 373
  },
  "식음료": {
   "weights": {
    "taro": 0.1921,
    "diana": 0.2995,
    "nova": 0.1949,
    "flow": 0.3135
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 30.6
    },
    "diana": {
     "n": 180,
     "acc": 47.8
    },
    "nova": {
     "n": 74,
     "acc": 31.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 378
  },
  "여행레저": {
   "weights": {
    "taro": 0.3032,
    "diana": 0.1544,
    "nova": 0.285,
    "flow": 0.2574
   },
   "acc": {
    "taro": {
     "n": 73,
     "acc": 58.9
    },
    "diana": {
     "n": 62,
     "acc": 24.2
    },
    "nova": {
     "n": 56,
     "acc": 55.4
    },
    "flow": {
     "n": 27,
     "acc": 25.9
    }
   },
   "graded": 218
  }
 }
};
