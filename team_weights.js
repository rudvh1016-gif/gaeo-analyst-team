// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 14:39",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2781,
   "diana": 0.1941,
   "nova": 0.2754,
   "flow": 0.2524
  },
  "acc": {
   "taro": {
    "n": 4849,
    "acc": 61.4
   },
   "diana": {
    "n": 4379,
    "acc": 42.8
   },
   "nova": {
    "n": 3390,
    "acc": 60.8
   },
   "flow": {
    "n": 869,
    "acc": 55.7
   }
  },
  "graded": 13487
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2725,
    "diana": 0.1933,
    "nova": 0.2315,
    "flow": 0.3027
   },
   "acc": {
    "taro": {
     "n": 574,
     "acc": 60.6
    },
    "diana": {
     "n": 372,
     "acc": 43.0
    },
    "nova": {
     "n": 468,
     "acc": 51.5
    },
    "flow": {
     "n": 193,
     "acc": 67.4
    }
   },
   "graded": 1607
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3033,
    "diana": 0.1585,
    "nova": 0.2751,
    "flow": 0.2631
   },
   "acc": {
    "taro": {
     "n": 286,
     "acc": 74.8
    },
    "diana": {
     "n": 179,
     "acc": 39.1
    },
    "nova": {
     "n": 224,
     "acc": 67.9
    },
    "flow": {
     "n": 94,
     "acc": 64.9
    }
   },
   "graded": 783
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2355,
    "diana": 0.2215,
    "nova": 0.2136,
    "flow": 0.3294
   },
   "acc": {
    "taro": {
     "n": 235,
     "acc": 53.6
    },
    "diana": {
     "n": 226,
     "acc": 50.4
    },
    "nova": {
     "n": 183,
     "acc": 48.6
    },
    "flow": {
     "n": 37,
     "acc": 75.7
    }
   },
   "graded": 681
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3397,
    "diana": 0.1625,
    "nova": 0.3197,
    "flow": 0.1781
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 67.3
    },
    "diana": {
     "n": 208,
     "acc": 32.2
    },
    "nova": {
     "n": 131,
     "acc": 63.4
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 589
  },
  "통신": {
   "weights": {
    "taro": 0.2904,
    "diana": 0.1876,
    "nova": 0.2875,
    "flow": 0.2345
   },
   "acc": {
    "taro": {
     "n": 84,
     "acc": 61.9
    },
    "diana": {
     "n": 60,
     "acc": 40.0
    },
    "nova": {
     "n": 62,
     "acc": 61.3
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
    "taro": 0.3015,
    "diana": 0.1622,
    "nova": 0.323,
    "flow": 0.2133
   },
   "acc": {
    "taro": {
     "n": 269,
     "acc": 55.8
    },
    "diana": {
     "n": 299,
     "acc": 29.1
    },
    "nova": {
     "n": 159,
     "acc": 59.7
    },
    "flow": {
     "n": 109,
     "acc": 39.4
    }
   },
   "graded": 836
  },
  "2차전지": {
   "weights": {
    "taro": 0.3015,
    "diana": 0.1961,
    "nova": 0.3015,
    "flow": 0.201
   },
   "acc": {
    "taro": {
     "n": 253,
     "acc": 81.4
    },
    "diana": {
     "n": 164,
     "acc": 48.8
    },
    "nova": {
     "n": 195,
     "acc": 82.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 612
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
    "taro": 0.2721,
    "diana": 0.2211,
    "nova": 0.2917,
    "flow": 0.2151
   },
   "acc": {
    "taro": {
     "n": 609,
     "acc": 67.0
    },
    "diana": {
     "n": 531,
     "acc": 54.4
    },
    "nova": {
     "n": 440,
     "acc": 71.8
    },
    "flow": {
     "n": 85,
     "acc": 52.9
    }
   },
   "graded": 1665
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2844,
    "diana": 0.2143,
    "nova": 0.2673,
    "flow": 0.2339
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 60.8
    },
    "diana": {
     "n": 310,
     "acc": 45.8
    },
    "nova": {
     "n": 189,
     "acc": 57.1
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 803
  },
  "조선": {
   "weights": {
    "taro": 0.2856,
    "diana": 0.1996,
    "nova": 0.2585,
    "flow": 0.2564
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 55.7
    },
    "diana": {
     "n": 167,
     "acc": 38.9
    },
    "nova": {
     "n": 123,
     "acc": 50.4
    },
    "flow": {
     "n": 13,
     "acc": 53.8
    }
   },
   "graded": 470
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3191,
    "diana": 0.1545,
    "nova": 0.2968,
    "flow": 0.2296
   },
   "acc": {
    "taro": {
     "n": 118,
     "acc": 69.5
    },
    "diana": {
     "n": 110,
     "acc": 33.6
    },
    "nova": {
     "n": 82,
     "acc": 64.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 310
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2715,
    "diana": 0.1831,
    "nova": 0.2532,
    "flow": 0.2923
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 69.7
    },
    "diana": {
     "n": 364,
     "acc": 47.0
    },
    "nova": {
     "n": 257,
     "acc": 65.0
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1029
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
    "taro": 0.2734,
    "diana": 0.1829,
    "nova": 0.2864,
    "flow": 0.2574
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 53.1
    },
    "diana": {
     "n": 228,
     "acc": 35.5
    },
    "nova": {
     "n": 124,
     "acc": 55.6
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 574
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
    "taro": 0.2493,
    "diana": 0.1528,
    "nova": 0.3431,
    "flow": 0.2547
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 48.9
    },
    "diana": {
     "n": 185,
     "acc": 25.4
    },
    "nova": {
     "n": 98,
     "acc": 67.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 424
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
    "taro": 0.1885,
    "diana": 0.2518,
    "nova": 0.2528,
    "flow": 0.3069
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 30.7
    },
    "diana": {
     "n": 156,
     "acc": 41.0
    },
    "nova": {
     "n": 51,
     "acc": 41.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 321
  }
 }
};
