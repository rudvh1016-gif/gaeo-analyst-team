// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 14:15",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2778,
   "diana": 0.1943,
   "nova": 0.2748,
   "flow": 0.253
  },
  "acc": {
   "taro": {
    "n": 4837,
    "acc": 61.2
   },
   "diana": {
    "n": 4367,
    "acc": 42.8
   },
   "nova": {
    "n": 3374,
    "acc": 60.5
   },
   "flow": {
    "n": 869,
    "acc": 55.7
   }
  },
  "graded": 13447
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.272,
    "diana": 0.1966,
    "nova": 0.231,
    "flow": 0.3004
   },
   "acc": {
    "taro": {
     "n": 580,
     "acc": 60.3
    },
    "diana": {
     "n": 376,
     "acc": 43.6
    },
    "nova": {
     "n": 474,
     "acc": 51.3
    },
    "flow": {
     "n": 195,
     "acc": 66.7
    }
   },
   "graded": 1625
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3026,
    "diana": 0.1603,
    "nova": 0.2739,
    "flow": 0.2631
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 74.6
    },
    "diana": {
     "n": 177,
     "acc": 39.5
    },
    "nova": {
     "n": 222,
     "acc": 67.6
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
    "taro": 0.3376,
    "diana": 0.1668,
    "nova": 0.3163,
    "flow": 0.1792
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 66.5
    },
    "diana": {
     "n": 210,
     "acc": 32.9
    },
    "nova": {
     "n": 130,
     "acc": 62.3
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 591
  },
  "통신": {
   "weights": {
    "taro": 0.2871,
    "diana": 0.1949,
    "nova": 0.2825,
    "flow": 0.2355
   },
   "acc": {
    "taro": {
     "n": 82,
     "acc": 61.0
    },
    "diana": {
     "n": 58,
     "acc": 41.4
    },
    "nova": {
     "n": 60,
     "acc": 60.0
    },
    "flow": {
     "n": 24,
     "acc": 70.8
    }
   },
   "graded": 224
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2526,
    "diana": 0.2509,
    "nova": 0.2637,
    "flow": 0.2327
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 54.3
    },
    "diana": {
     "n": 204,
     "acc": 53.9
    },
    "nova": {
     "n": 150,
     "acc": 56.7
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 584
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2999,
    "diana": 0.1626,
    "nova": 0.3238,
    "flow": 0.2138
   },
   "acc": {
    "taro": {
     "n": 271,
     "acc": 55.4
    },
    "diana": {
     "n": 301,
     "acc": 28.9
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
   "graded": 840
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
     "n": 251,
     "acc": 81.3
    },
    "diana": {
     "n": 162,
     "acc": 49.4
    },
    "nova": {
     "n": 193,
     "acc": 81.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 606
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
    "taro": 0.2851,
    "diana": 0.2125,
    "nova": 0.2689,
    "flow": 0.2335
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 61.1
    },
    "diana": {
     "n": 312,
     "acc": 45.5
    },
    "nova": {
     "n": 191,
     "acc": 57.6
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 809
  },
  "조선": {
   "weights": {
    "taro": 0.2891,
    "diana": 0.1959,
    "nova": 0.2586,
    "flow": 0.2565
   },
   "acc": {
    "taro": {
     "n": 165,
     "acc": 56.4
    },
    "diana": {
     "n": 165,
     "acc": 38.2
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
   "graded": 466
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
    "taro": 0.2731,
    "diana": 0.1801,
    "nova": 0.2538,
    "flow": 0.2931
   },
   "acc": {
    "taro": {
     "n": 352,
     "acc": 69.9
    },
    "diana": {
     "n": 358,
     "acc": 46.1
    },
    "nova": {
     "n": 251,
     "acc": 64.9
    },
    "flow": {
     "n": 52,
     "acc": 80.8
    }
   },
   "graded": 1013
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
    "taro": 0.273,
    "diana": 0.1812,
    "nova": 0.2866,
    "flow": 0.2592
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 52.7
    },
    "diana": {
     "n": 226,
     "acc": 35.0
    },
    "nova": {
     "n": 123,
     "acc": 55.3
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
    "taro": 0.2998,
    "diana": 0.1722,
    "nova": 0.2938,
    "flow": 0.2341
   },
   "acc": {
    "taro": {
     "n": 146,
     "acc": 58.9
    },
    "diana": {
     "n": 133,
     "acc": 33.8
    },
    "nova": {
     "n": 97,
     "acc": 57.7
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 426
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2444,
    "diana": 0.1546,
    "nova": 0.3434,
    "flow": 0.2576
   },
   "acc": {
    "taro": {
     "n": 137,
     "acc": 47.4
    },
    "diana": {
     "n": 181,
     "acc": 24.9
    },
    "nova": {
     "n": 96,
     "acc": 66.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 414
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
