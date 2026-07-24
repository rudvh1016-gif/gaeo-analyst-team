// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 11:14",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2768,
   "diana": 0.197,
   "nova": 0.2731,
   "flow": 0.2531
  },
  "acc": {
   "taro": {
    "n": 4844,
    "acc": 60.7
   },
   "diana": {
    "n": 4387,
    "acc": 43.2
   },
   "nova": {
    "n": 3387,
    "acc": 59.9
   },
   "flow": {
    "n": 861,
    "acc": 55.5
   }
  },
  "graded": 13479
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2721,
    "diana": 0.1948,
    "nova": 0.2316,
    "flow": 0.3014
   },
   "acc": {
    "taro": {
     "n": 572,
     "acc": 60.5
    },
    "diana": {
     "n": 374,
     "acc": 43.3
    },
    "nova": {
     "n": 468,
     "acc": 51.5
    },
    "flow": {
     "n": 191,
     "acc": 67.0
    }
   },
   "graded": 1605
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3026,
    "diana": 0.1593,
    "nova": 0.2739,
    "flow": 0.2643
   },
   "acc": {
    "taro": {
     "n": 288,
     "acc": 74.3
    },
    "diana": {
     "n": 179,
     "acc": 39.1
    },
    "nova": {
     "n": 226,
     "acc": 67.3
    },
    "flow": {
     "n": 94,
     "acc": 64.9
    }
   },
   "graded": 787
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
    "taro": 0.3361,
    "diana": 0.1698,
    "nova": 0.3135,
    "flow": 0.1807
   },
   "acc": {
    "taro": {
     "n": 198,
     "acc": 65.7
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
   "graded": 586
  },
  "통신": {
   "weights": {
    "taro": 0.2851,
    "diana": 0.197,
    "nova": 0.2762,
    "flow": 0.2417
   },
   "acc": {
    "taro": {
     "n": 78,
     "acc": 59.0
    },
    "diana": {
     "n": 54,
     "acc": 40.7
    },
    "nova": {
     "n": 56,
     "acc": 57.1
    },
    "flow": {
     "n": 22,
     "acc": 68.2
    }
   },
   "graded": 210
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2523,
    "diana": 0.2561,
    "nova": 0.2579,
    "flow": 0.2337
   },
   "acc": {
    "taro": {
     "n": 213,
     "acc": 54.0
    },
    "diana": {
     "n": 208,
     "acc": 54.8
    },
    "nova": {
     "n": 154,
     "acc": 55.2
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 595
  },
  "금융·증권": {
   "weights": {
    "taro": 0.301,
    "diana": 0.1644,
    "nova": 0.3222,
    "flow": 0.2123
   },
   "acc": {
    "taro": {
     "n": 275,
     "acc": 54.9
    },
    "diana": {
     "n": 307,
     "acc": 29.6
    },
    "nova": {
     "n": 165,
     "acc": 58.8
    },
    "flow": {
     "n": 111,
     "acc": 38.7
    }
   },
   "graded": 858
  },
  "2차전지": {
   "weights": {
    "taro": 0.3007,
    "diana": 0.198,
    "nova": 0.3007,
    "flow": 0.2005
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 80.6
    },
    "diana": {
     "n": 162,
     "acc": 49.4
    },
    "nova": {
     "n": 195,
     "acc": 81.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 610
  },
  "보험": {
   "weights": {
    "taro": 0.2623,
    "diana": 0.2563,
    "nova": 0.2507,
    "flow": 0.2307
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 56.8
    },
    "diana": {
     "n": 81,
     "acc": 55.6
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
   "graded": 246
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2695,
    "diana": 0.2258,
    "nova": 0.2887,
    "flow": 0.216
   },
   "acc": {
    "taro": {
     "n": 607,
     "acc": 66.1
    },
    "diana": {
     "n": 533,
     "acc": 55.3
    },
    "nova": {
     "n": 441,
     "acc": 70.7
    },
    "flow": {
     "n": 85,
     "acc": 52.9
    }
   },
   "graded": 1666
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2848,
    "diana": 0.2162,
    "nova": 0.2649,
    "flow": 0.2342
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 60.8
    },
    "diana": {
     "n": 312,
     "acc": 46.2
    },
    "nova": {
     "n": 191,
     "acc": 56.5
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 807
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
    "taro": 0.2732,
    "diana": 0.1816,
    "nova": 0.2513,
    "flow": 0.2939
   },
   "acc": {
    "taro": {
     "n": 350,
     "acc": 69.7
    },
    "diana": {
     "n": 356,
     "acc": 46.3
    },
    "nova": {
     "n": 251,
     "acc": 64.1
    },
    "flow": {
     "n": 50,
     "acc": 80.0
    }
   },
   "graded": 1007
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
    "taro": 0.2705,
    "diana": 0.1879,
    "nova": 0.2835,
    "flow": 0.2581
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 52.4
    },
    "diana": {
     "n": 228,
     "acc": 36.4
    },
    "nova": {
     "n": 122,
     "acc": 54.9
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 571
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2298,
    "diana": 0.2023,
    "nova": 0.2678,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 128,
     "acc": 38.3
    },
    "diana": {
     "n": 92,
     "acc": 33.7
    },
    "nova": {
     "n": 65,
     "acc": 44.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 285
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2972,
    "diana": 0.1781,
    "nova": 0.2894,
    "flow": 0.2353
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 58.1
    },
    "diana": {
     "n": 135,
     "acc": 34.8
    },
    "nova": {
     "n": 99,
     "acc": 56.6
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 432
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2426,
    "diana": 0.1534,
    "nova": 0.3482,
    "flow": 0.2557
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 47.4
    },
    "diana": {
     "n": 181,
     "acc": 23.8
    },
    "nova": {
     "n": 94,
     "acc": 68.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 412
  },
  "로봇": {
   "weights": {
    "taro": 0.2716,
    "diana": 0.2622,
    "nova": 0.2706,
    "flow": 0.1956
   },
   "acc": {
    "taro": {
     "n": 121,
     "acc": 69.4
    },
    "diana": {
     "n": 97,
     "acc": 67.0
    },
    "nova": {
     "n": 94,
     "acc": 69.1
    },
    "flow": {
     "n": 10,
     "acc": 30.0
    }
   },
   "graded": 322
  },
  "식음료": {
   "weights": {
    "taro": 0.1944,
    "diana": 0.2546,
    "nova": 0.2462,
    "flow": 0.3048
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 31.9
    },
    "diana": {
     "n": 158,
     "acc": 41.8
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
   "graded": 326
  }
 }
};
