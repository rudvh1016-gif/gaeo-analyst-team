// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 09:09",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2864,
   "diana": 0.19,
   "nova": 0.266,
   "flow": 0.2576
  },
  "acc": {
   "taro": {
    "n": 7083,
    "acc": 62.4
   },
   "diana": {
    "n": 6441,
    "acc": 41.4
   },
   "nova": {
    "n": 5752,
    "acc": 57.9
   },
   "flow": {
    "n": 1233,
    "acc": 56.1
   }
  },
  "graded": 20509,
  "team": {
   "hit": 5608,
   "miss": 1331,
   "n": 6939,
   "acc": 80.8
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3021,
    "diana": 0.1747,
    "nova": 0.2157,
    "flow": 0.3076
   },
   "acc": {
    "taro": {
     "n": 863,
     "acc": 69.3
    },
    "diana": {
     "n": 564,
     "acc": 40.1
    },
    "nova": {
     "n": 748,
     "acc": 49.5
    },
    "flow": {
     "n": 275,
     "acc": 70.5
    }
   },
   "graded": 2450
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3103,
    "diana": 0.1528,
    "nova": 0.252,
    "flow": 0.2849
   },
   "acc": {
    "taro": {
     "n": 423,
     "acc": 78.0
    },
    "diana": {
     "n": 260,
     "acc": 36.9
    },
    "nova": {
     "n": 353,
     "acc": 60.9
    },
    "flow": {
     "n": 122,
     "acc": 68.9
    }
   },
   "graded": 1158
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2591,
    "diana": 0.2278,
    "nova": 0.2581,
    "flow": 0.255
   },
   "acc": {
    "taro": {
     "n": 352,
     "acc": 54.8
    },
    "diana": {
     "n": 334,
     "acc": 48.2
    },
    "nova": {
     "n": 313,
     "acc": 54.6
    },
    "flow": {
     "n": 63,
     "acc": 54.0
    }
   },
   "graded": 1062
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3319,
    "diana": 0.159,
    "nova": 0.3406,
    "flow": 0.1686
   },
   "acc": {
    "taro": {
     "n": 281,
     "acc": 62.6
    },
    "diana": {
     "n": 314,
     "acc": 29.3
    },
    "nova": {
     "n": 224,
     "acc": 64.3
    },
    "flow": {
     "n": 66,
     "acc": 31.8
    }
   },
   "graded": 885
  },
  "통신": {
   "weights": {
    "taro": 0.2628,
    "diana": 0.1839,
    "nova": 0.2578,
    "flow": 0.2954
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 60.8
    },
    "diana": {
     "n": 87,
     "acc": 42.5
    },
    "nova": {
     "n": 104,
     "acc": 59.6
    },
    "flow": {
     "n": 41,
     "acc": 68.3
    }
   },
   "graded": 362
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2337,
    "diana": 0.2285,
    "nova": 0.2672,
    "flow": 0.2706
   },
   "acc": {
    "taro": {
     "n": 313,
     "acc": 50.8
    },
    "diana": {
     "n": 292,
     "acc": 49.7
    },
    "nova": {
     "n": 260,
     "acc": 58.1
    },
    "flow": {
     "n": 34,
     "acc": 58.8
    }
   },
   "graded": 899
  },
  "금융·증권": {
   "weights": {
    "taro": 0.327,
    "diana": 0.1648,
    "nova": 0.3113,
    "flow": 0.1969
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 59.5
    },
    "diana": {
     "n": 455,
     "acc": 24.8
    },
    "nova": {
     "n": 293,
     "acc": 56.7
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1273
  },
  "2차전지": {
   "weights": {
    "taro": 0.3052,
    "diana": 0.196,
    "nova": 0.2953,
    "flow": 0.2035
   },
   "acc": {
    "taro": {
     "n": 384,
     "acc": 83.1
    },
    "diana": {
     "n": 245,
     "acc": 48.2
    },
    "nova": {
     "n": 317,
     "acc": 72.6
    },
    "flow": {
     "n": 3,
     "acc": 66.7
    }
   },
   "graded": 949
  },
  "보험": {
   "weights": {
    "taro": 0.2669,
    "diana": 0.243,
    "nova": 0.2656,
    "flow": 0.2246
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 54.0
    },
    "diana": {
     "n": 122,
     "acc": 49.2
    },
    "nova": {
     "n": 93,
     "acc": 53.8
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 385
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.278,
    "diana": 0.2215,
    "nova": 0.2589,
    "flow": 0.2417
   },
   "acc": {
    "taro": {
     "n": 898,
     "acc": 67.3
    },
    "diana": {
     "n": 780,
     "acc": 53.6
    },
    "nova": {
     "n": 752,
     "acc": 62.6
    },
    "flow": {
     "n": 118,
     "acc": 58.5
    }
   },
   "graded": 2548
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3074,
    "diana": 0.2151,
    "nova": 0.3199,
    "flow": 0.1576
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 58.5
    },
    "diana": {
     "n": 459,
     "acc": 41.0
    },
    "nova": {
     "n": 335,
     "acc": 60.9
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1235
  },
  "조선": {
   "weights": {
    "taro": 0.2836,
    "diana": 0.1785,
    "nova": 0.2797,
    "flow": 0.2583
   },
   "acc": {
    "taro": {
     "n": 235,
     "acc": 54.9
    },
    "diana": {
     "n": 246,
     "acc": 34.6
    },
    "nova": {
     "n": 205,
     "acc": 54.1
    },
    "flow": {
     "n": 32,
     "acc": 50.0
    }
   },
   "graded": 718
  },
  "방산": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1576,
    "nova": 0.2825,
    "flow": 0.259
   },
   "acc": {
    "taro": {
     "n": 105,
     "acc": 58.1
    },
    "diana": {
     "n": 46,
     "acc": 30.4
    },
    "nova": {
     "n": 77,
     "acc": 54.5
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 229
  },
  "철강·금속": {
   "weights": {
    "taro": 0.301,
    "diana": 0.1713,
    "nova": 0.2892,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 149,
     "acc": 63.1
    },
    "diana": {
     "n": 156,
     "acc": 35.9
    },
    "nova": {
     "n": 127,
     "acc": 60.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 432
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2715,
    "diana": 0.1668,
    "nova": 0.2565,
    "flow": 0.3051
   },
   "acc": {
    "taro": {
     "n": 514,
     "acc": 66.7
    },
    "diana": {
     "n": 539,
     "acc": 41.0
    },
    "nova": {
     "n": 433,
     "acc": 63.0
    },
    "flow": {
     "n": 72,
     "acc": 77.8
    }
   },
   "graded": 1558
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2576,
    "diana": 0.2634,
    "nova": 0.2266,
    "flow": 0.2525
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 48.4
    },
    "diana": {
     "n": 101,
     "acc": 49.5
    },
    "nova": {
     "n": 54,
     "acc": 42.6
    },
    "flow": {
     "n": 59,
     "acc": 47.5
    }
   },
   "graded": 309
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2805,
    "diana": 0.1855,
    "nova": 0.2793,
    "flow": 0.2547
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 55.1
    },
    "diana": {
     "n": 324,
     "acc": 36.4
    },
    "nova": {
     "n": 217,
     "acc": 54.8
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 862
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2676,
    "diana": 0.2204,
    "nova": 0.2307,
    "flow": 0.2814
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 47.5
    },
    "diana": {
     "n": 143,
     "acc": 39.2
    },
    "nova": {
     "n": 122,
     "acc": 41.0
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 449
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3265,
    "diana": 0.1622,
    "nova": 0.3285,
    "flow": 0.1828
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 60.4
    },
    "diana": {
     "n": 192,
     "acc": 29.2
    },
    "nova": {
     "n": 163,
     "acc": 60.7
    },
    "flow": {
     "n": 71,
     "acc": 33.8
    }
   },
   "graded": 638
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2433,
    "diana": 0.1813,
    "nova": 0.3023,
    "flow": 0.2731
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 44.6
    },
    "diana": {
     "n": 259,
     "acc": 33.2
    },
    "nova": {
     "n": 168,
     "acc": 55.4
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 630
  },
  "기계": {
   "weights": {
    "taro": 0.2163,
    "diana": 0.2072,
    "nova": 0.2979,
    "flow": 0.2787
   },
   "acc": {
    "taro": {
     "n": 67,
     "acc": 38.8
    },
    "diana": {
     "n": 78,
     "acc": 37.2
    },
    "nova": {
     "n": 58,
     "acc": 53.4
    },
    "flow": {
     "n": 3,
     "acc": 100.0
    }
   },
   "graded": 206
  },
  "로봇": {
   "weights": {
    "taro": 0.2621,
    "diana": 0.2712,
    "nova": 0.2484,
    "flow": 0.2184
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 70.6
    },
    "diana": {
     "n": 141,
     "acc": 73.0
    },
    "nova": {
     "n": 145,
     "acc": 66.9
    },
    "flow": {
     "n": 34,
     "acc": 58.8
    }
   },
   "graded": 490
  },
  "식음료": {
   "weights": {
    "taro": 0.2008,
    "diana": 0.306,
    "nova": 0.2061,
    "flow": 0.2871
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 35.0
    },
    "diana": {
     "n": 227,
     "acc": 53.3
    },
    "nova": {
     "n": 117,
     "acc": 35.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 507
  },
  "여행레저": {
   "weights": {
    "taro": 0.3597,
    "diana": 0.1628,
    "nova": 0.3079,
    "flow": 0.1696
   },
   "acc": {
    "taro": {
     "n": 92,
     "acc": 66.3
    },
    "diana": {
     "n": 77,
     "acc": 23.4
    },
    "nova": {
     "n": 74,
     "acc": 56.8
    },
    "flow": {
     "n": 32,
     "acc": 31.2
    }
   },
   "graded": 275
  }
 }
};
