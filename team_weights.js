// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 13:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2827,
   "diana": 0.1918,
   "nova": 0.2712,
   "flow": 0.2543
  },
  "acc": {
   "taro": {
    "n": 6726,
    "acc": 61.7
   },
   "diana": {
    "n": 6115,
    "acc": 41.9
   },
   "nova": {
    "n": 5387,
    "acc": 59.2
   },
   "flow": {
    "n": 1169,
    "acc": 55.5
   }
  },
  "graded": 19397,
  "team": {
   "hit": 5288,
   "miss": 1304,
   "n": 6592,
   "acc": 80.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2944,
    "diana": 0.1775,
    "nova": 0.2258,
    "flow": 0.3023
   },
   "acc": {
    "taro": {
     "n": 815,
     "acc": 68.0
    },
    "diana": {
     "n": 532,
     "acc": 41.0
    },
    "nova": {
     "n": 702,
     "acc": 52.1
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2314
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3063,
    "diana": 0.1521,
    "nova": 0.2624,
    "flow": 0.2792
   },
   "acc": {
    "taro": {
     "n": 398,
     "acc": 77.4
    },
    "diana": {
     "n": 247,
     "acc": 37.2
    },
    "nova": {
     "n": 330,
     "acc": 64.2
    },
    "flow": {
     "n": 117,
     "acc": 68.4
    }
   },
   "graded": 1092
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2518,
    "diana": 0.2289,
    "nova": 0.2637,
    "flow": 0.2555
   },
   "acc": {
    "taro": {
     "n": 333,
     "acc": 53.5
    },
    "diana": {
     "n": 317,
     "acc": 48.6
    },
    "nova": {
     "n": 293,
     "acc": 56.0
    },
    "flow": {
     "n": 59,
     "acc": 54.2
    }
   },
   "graded": 1002
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3327,
    "diana": 0.1588,
    "nova": 0.3488,
    "flow": 0.1597
   },
   "acc": {
    "taro": {
     "n": 269,
     "acc": 62.8
    },
    "diana": {
     "n": 298,
     "acc": 27.9
    },
    "nova": {
     "n": 211,
     "acc": 65.9
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 841
  },
  "통신": {
   "weights": {
    "taro": 0.2614,
    "diana": 0.1885,
    "nova": 0.2643,
    "flow": 0.2859
   },
   "acc": {
    "taro": {
     "n": 123,
     "acc": 60.2
    },
    "diana": {
     "n": 83,
     "acc": 43.4
    },
    "nova": {
     "n": 97,
     "acc": 60.8
    },
    "flow": {
     "n": 38,
     "acc": 65.8
    }
   },
   "graded": 341
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2342,
    "diana": 0.2311,
    "nova": 0.2673,
    "flow": 0.2674
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 50.8
    },
    "diana": {
     "n": 281,
     "acc": 50.2
    },
    "nova": {
     "n": 243,
     "acc": 58.0
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 850
  },
  "금융·증권": {
   "weights": {
    "taro": 0.324,
    "diana": 0.1644,
    "nova": 0.3153,
    "flow": 0.1963
   },
   "acc": {
    "taro": {
     "n": 389,
     "acc": 59.1
    },
    "diana": {
     "n": 435,
     "acc": 26.0
    },
    "nova": {
     "n": 278,
     "acc": 57.6
    },
    "flow": {
     "n": 120,
     "acc": 35.8
    }
   },
   "graded": 1222
  },
  "2차전지": {
   "weights": {
    "taro": 0.3018,
    "diana": 0.1951,
    "nova": 0.3018,
    "flow": 0.2012
   },
   "acc": {
    "taro": {
     "n": 362,
     "acc": 82.6
    },
    "diana": {
     "n": 231,
     "acc": 48.5
    },
    "nova": {
     "n": 302,
     "acc": 75.8
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 897
  },
  "보험": {
   "weights": {
    "taro": 0.2618,
    "diana": 0.2491,
    "nova": 0.2678,
    "flow": 0.2213
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 53.4
    },
    "diana": {
     "n": 118,
     "acc": 50.8
    },
    "nova": {
     "n": 86,
     "acc": 54.7
    },
    "flow": {
     "n": 31,
     "acc": 45.2
    }
   },
   "graded": 366
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2765,
    "diana": 0.2242,
    "nova": 0.2604,
    "flow": 0.2389
   },
   "acc": {
    "taro": {
     "n": 856,
     "acc": 66.6
    },
    "diana": {
     "n": 741,
     "acc": 54.0
    },
    "nova": {
     "n": 705,
     "acc": 62.7
    },
    "flow": {
     "n": 113,
     "acc": 57.5
    }
   },
   "graded": 2415
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3039,
    "diana": 0.2163,
    "nova": 0.3223,
    "flow": 0.1575
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 57.9
    },
    "diana": {
     "n": 437,
     "acc": 41.2
    },
    "nova": {
     "n": 316,
     "acc": 61.4
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1175
  },
  "조선": {
   "weights": {
    "taro": 0.2748,
    "diana": 0.185,
    "nova": 0.2828,
    "flow": 0.2574
   },
   "acc": {
    "taro": {
     "n": 223,
     "acc": 53.4
    },
    "diana": {
     "n": 231,
     "acc": 35.9
    },
    "nova": {
     "n": 193,
     "acc": 54.9
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 674
  },
  "방산": {
   "weights": {
    "taro": 0.2923,
    "diana": 0.155,
    "nova": 0.2943,
    "flow": 0.2584
   },
   "acc": {
    "taro": {
     "n": 99,
     "acc": 56.6
    },
    "diana": {
     "n": 44,
     "acc": 29.5
    },
    "nova": {
     "n": 72,
     "acc": 56.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 215
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.163,
    "nova": 0.2967,
    "flow": 0.2381
   },
   "acc": {
    "taro": {
     "n": 145,
     "acc": 63.4
    },
    "diana": {
     "n": 149,
     "acc": 34.2
    },
    "nova": {
     "n": 122,
     "acc": 62.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 416
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2688,
    "diana": 0.1713,
    "nova": 0.2567,
    "flow": 0.3033
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 66.5
    },
    "diana": {
     "n": 510,
     "acc": 42.4
    },
    "nova": {
     "n": 408,
     "acc": 63.5
    },
    "flow": {
     "n": 67,
     "acc": 77.6
    }
   },
   "graded": 1474
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2617,
    "diana": 0.2592,
    "nova": 0.2283,
    "flow": 0.2507
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 49.5
    },
    "diana": {
     "n": 98,
     "acc": 49.0
    },
    "nova": {
     "n": 51,
     "acc": 43.1
    },
    "flow": {
     "n": 57,
     "acc": 47.4
    }
   },
   "graded": 297
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2766,
    "diana": 0.1881,
    "nova": 0.2799,
    "flow": 0.2555
   },
   "acc": {
    "taro": {
     "n": 290,
     "acc": 54.1
    },
    "diana": {
     "n": 307,
     "acc": 36.8
    },
    "nova": {
     "n": 199,
     "acc": 54.8
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 812
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2662,
    "diana": 0.2321,
    "nova": 0.219,
    "flow": 0.2827
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 47.1
    },
    "diana": {
     "n": 134,
     "acc": 41.0
    },
    "nova": {
     "n": 111,
     "acc": 38.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 417
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3153,
    "diana": 0.163,
    "nova": 0.329,
    "flow": 0.1927
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 59.5
    },
    "diana": {
     "n": 182,
     "acc": 30.8
    },
    "nova": {
     "n": 153,
     "acc": 62.1
    },
    "flow": {
     "n": 66,
     "acc": 36.4
    }
   },
   "graded": 601
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2444,
    "diana": 0.1873,
    "nova": 0.293,
    "flow": 0.2753
   },
   "acc": {
    "taro": {
     "n": 196,
     "acc": 44.4
    },
    "diana": {
     "n": 247,
     "acc": 34.0
    },
    "nova": {
     "n": 156,
     "acc": 53.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 599
  },
  "로봇": {
   "weights": {
    "taro": 0.2647,
    "diana": 0.2737,
    "nova": 0.2725,
    "flow": 0.1891
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 70.0
    },
    "diana": {
     "n": 134,
     "acc": 72.4
    },
    "nova": {
     "n": 136,
     "acc": 72.1
    },
    "flow": {
     "n": 28,
     "acc": 53.6
    }
   },
   "graded": 458
  },
  "식음료": {
   "weights": {
    "taro": 0.1979,
    "diana": 0.3019,
    "nova": 0.2091,
    "flow": 0.2911
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 34.0
    },
    "diana": {
     "n": 214,
     "acc": 51.9
    },
    "nova": {
     "n": 103,
     "acc": 35.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 467
  },
  "여행레저": {
   "weights": {
    "taro": 0.3567,
    "diana": 0.1663,
    "nova": 0.3107,
    "flow": 0.1663
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 64.4
    },
    "diana": {
     "n": 70,
     "acc": 22.9
    },
    "nova": {
     "n": 66,
     "acc": 56.1
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 254
  }
 }
};
