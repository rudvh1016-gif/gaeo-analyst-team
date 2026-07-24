// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 13:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.278,
   "diana": 0.1943,
   "nova": 0.276,
   "flow": 0.2517
  },
  "acc": {
   "taro": {
    "n": 4853,
    "acc": 61.4
   },
   "diana": {
    "n": 4387,
    "acc": 42.9
   },
   "nova": {
    "n": 3388,
    "acc": 61.0
   },
   "flow": {
    "n": 871,
    "acc": 55.6
   }
  },
  "graded": 13499
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2728,
    "diana": 0.1927,
    "nova": 0.2327,
    "flow": 0.3018
   },
   "acc": {
    "taro": {
     "n": 575,
     "acc": 60.9
    },
    "diana": {
     "n": 372,
     "acc": 43.0
    },
    "nova": {
     "n": 468,
     "acc": 51.9
    },
    "flow": {
     "n": 193,
     "acc": 67.4
    }
   },
   "graded": 1608
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.1557,
    "nova": 0.2774,
    "flow": 0.263
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 75.4
    },
    "diana": {
     "n": 177,
     "acc": 38.4
    },
    "nova": {
     "n": 222,
     "acc": 68.5
    },
    "flow": {
     "n": 94,
     "acc": 64.9
    }
   },
   "graded": 777
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2365,
    "diana": 0.2206,
    "nova": 0.215,
    "flow": 0.328
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 54.1
    },
    "diana": {
     "n": 226,
     "acc": 50.4
    },
    "nova": {
     "n": 181,
     "acc": 49.2
    },
    "flow": {
     "n": 37,
     "acc": 75.7
    }
   },
   "graded": 677
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3355,
    "diana": 0.1699,
    "nova": 0.3137,
    "flow": 0.1808
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 65.5
    },
    "diana": {
     "n": 208,
     "acc": 33.2
    },
    "nova": {
     "n": 129,
     "acc": 61.2
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 588
  },
  "통신": {
   "weights": {
    "taro": 0.2938,
    "diana": 0.1828,
    "nova": 0.2949,
    "flow": 0.2285
   },
   "acc": {
    "taro": {
     "n": 84,
     "acc": 64.3
    },
    "diana": {
     "n": 60,
     "acc": 40.0
    },
    "nova": {
     "n": 62,
     "acc": 64.5
    },
    "flow": {
     "n": 24,
     "acc": 70.8
    }
   },
   "graded": 230
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2533,
    "diana": 0.2482,
    "nova": 0.266,
    "flow": 0.2324
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 54.5
    },
    "diana": {
     "n": 206,
     "acc": 53.4
    },
    "nova": {
     "n": 152,
     "acc": 57.2
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 589
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.1636,
    "nova": 0.3246,
    "flow": 0.2113
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 55.1
    },
    "diana": {
     "n": 305,
     "acc": 29.2
    },
    "nova": {
     "n": 163,
     "acc": 59.5
    },
    "flow": {
     "n": 111,
     "acc": 38.7
    }
   },
   "graded": 853
  },
  "2차전지": {
   "weights": {
    "taro": 0.3007,
    "diana": 0.1981,
    "nova": 0.3007,
    "flow": 0.2005
   },
   "acc": {
    "taro": {
     "n": 255,
     "acc": 81.6
    },
    "diana": {
     "n": 166,
     "acc": 49.4
    },
    "nova": {
     "n": 197,
     "acc": 82.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 618
  },
  "보험": {
   "weights": {
    "taro": 0.2599,
    "diana": 0.2531,
    "nova": 0.2537,
    "flow": 0.2334
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 55.7
    },
    "diana": {
     "n": 83,
     "acc": 54.2
    },
    "nova": {
     "n": 46,
     "acc": 54.3
    },
    "flow": {
     "n": 24,
     "acc": 58.3
    }
   },
   "graded": 250
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.2205,
    "nova": 0.2928,
    "flow": 0.2145
   },
   "acc": {
    "taro": {
     "n": 606,
     "acc": 67.2
    },
    "diana": {
     "n": 531,
     "acc": 54.4
    },
    "nova": {
     "n": 440,
     "acc": 72.3
    },
    "flow": {
     "n": 85,
     "acc": 52.9
    }
   },
   "graded": 1662
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2865,
    "diana": 0.2136,
    "nova": 0.2685,
    "flow": 0.2314
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 61.9
    },
    "diana": {
     "n": 312,
     "acc": 46.2
    },
    "nova": {
     "n": 193,
     "acc": 58.0
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 812
  },
  "조선": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.2022,
    "nova": 0.2591,
    "flow": 0.255
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 55.6
    },
    "diana": {
     "n": 169,
     "acc": 39.6
    },
    "nova": {
     "n": 124,
     "acc": 50.8
    },
    "flow": {
     "n": 13,
     "acc": 53.8
    }
   },
   "graded": 475
  },
  "철강·금속": {
   "weights": {
    "taro": 0.316,
    "diana": 0.161,
    "nova": 0.2918,
    "flow": 0.2312
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 68.3
    },
    "diana": {
     "n": 112,
     "acc": 34.8
    },
    "nova": {
     "n": 84,
     "acc": 63.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 316
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2722,
    "diana": 0.1817,
    "nova": 0.2524,
    "flow": 0.2938
   },
   "acc": {
    "taro": {
     "n": 354,
     "acc": 69.5
    },
    "diana": {
     "n": 360,
     "acc": 46.4
    },
    "nova": {
     "n": 253,
     "acc": 64.4
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1019
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2663,
    "diana": 0.2718,
    "nova": 0.2452,
    "flow": 0.2167
   },
   "acc": {
    "taro": {
     "n": 70,
     "acc": 54.3
    },
    "diana": {
     "n": 74,
     "acc": 55.4
    },
    "nova": {
     "n": 28,
     "acc": 21.4
    },
    "flow": {
     "n": 43,
     "acc": 44.2
    }
   },
   "graded": 215
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2738,
    "diana": 0.1794,
    "nova": 0.2902,
    "flow": 0.2566
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 53.4
    },
    "diana": {
     "n": 226,
     "acc": 35.0
    },
    "nova": {
     "n": 122,
     "acc": 56.6
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 569
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2343,
    "diana": 0.2106,
    "nova": 0.2562,
    "flow": 0.2989
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 39.2
    },
    "diana": {
     "n": 88,
     "acc": 35.2
    },
    "nova": {
     "n": 63,
     "acc": 42.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 276
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3005,
    "diana": 0.171,
    "nova": 0.2961,
    "flow": 0.2325
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 59.5
    },
    "diana": {
     "n": 133,
     "acc": 33.8
    },
    "nova": {
     "n": 99,
     "acc": 58.6
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 430
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2427,
    "diana": 0.1512,
    "nova": 0.354,
    "flow": 0.2521
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 48.1
    },
    "diana": {
     "n": 179,
     "acc": 22.9
    },
    "nova": {
     "n": 94,
     "acc": 70.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 408
  },
  "로봇": {
   "weights": {
    "taro": 0.2719,
    "diana": 0.2642,
    "nova": 0.2726,
    "flow": 0.1913
   },
   "acc": {
    "taro": {
     "n": 121,
     "acc": 71.1
    },
    "diana": {
     "n": 97,
     "acc": 69.1
    },
    "nova": {
     "n": 94,
     "acc": 71.3
    },
    "flow": {
     "n": 12,
     "acc": 25.0
    }
   },
   "graded": 324
  },
  "식음료": {
   "weights": {
    "taro": 0.1936,
    "diana": 0.2579,
    "nova": 0.2451,
    "flow": 0.3034
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 31.9
    },
    "diana": {
     "n": 160,
     "acc": 42.5
    },
    "nova": {
     "n": 52,
     "acc": 40.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 328
  }
 }
};
