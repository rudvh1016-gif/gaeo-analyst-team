// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 09:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2774,
   "diana": 0.1956,
   "nova": 0.2737,
   "flow": 0.2533
  },
  "acc": {
   "taro": {
    "n": 4824,
    "acc": 60.6
   },
   "diana": {
    "n": 4363,
    "acc": 42.7
   },
   "nova": {
    "n": 3370,
    "acc": 59.8
   },
   "flow": {
    "n": 857,
    "acc": 55.3
   }
  },
  "graded": 13414
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2731,
    "diana": 0.1946,
    "nova": 0.2323,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 573,
     "acc": 60.0
    },
    "diana": {
     "n": 374,
     "acc": 42.8
    },
    "nova": {
     "n": 468,
     "acc": 51.1
    },
    "flow": {
     "n": 191,
     "acc": 66.0
    }
   },
   "graded": 1606
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3002,
    "diana": 0.1538,
    "nova": 0.2777,
    "flow": 0.2683
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 76.1
    },
    "diana": {
     "n": 177,
     "acc": 38.4
    },
    "nova": {
     "n": 222,
     "acc": 69.4
    },
    "flow": {
     "n": 94,
     "acc": 67.0
    }
   },
   "graded": 777
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2344,
    "diana": 0.2219,
    "nova": 0.2108,
    "flow": 0.3329
   },
   "acc": {
    "taro": {
     "n": 231,
     "acc": 52.8
    },
    "diana": {
     "n": 224,
     "acc": 50.0
    },
    "nova": {
     "n": 179,
     "acc": 47.5
    },
    "flow": {
     "n": 37,
     "acc": 75.7
    }
   },
   "graded": 671
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3346,
    "diana": 0.1753,
    "nova": 0.3089,
    "flow": 0.1812
   },
   "acc": {
    "taro": {
     "n": 198,
     "acc": 65.2
    },
    "diana": {
     "n": 208,
     "acc": 34.1
    },
    "nova": {
     "n": 128,
     "acc": 60.2
    },
    "flow": {
     "n": 51,
     "acc": 35.3
    }
   },
   "graded": 585
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
    "taro": 0.2515,
    "diana": 0.2585,
    "nova": 0.2542,
    "flow": 0.2358
   },
   "acc": {
    "taro": {
     "n": 210,
     "acc": 53.3
    },
    "diana": {
     "n": 208,
     "acc": 54.8
    },
    "nova": {
     "n": 154,
     "acc": 53.9
    },
    "flow": {
     "n": 20,
     "acc": 50.0
    }
   },
   "graded": 592
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3012,
    "diana": 0.1662,
    "nova": 0.3242,
    "flow": 0.2084
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 54.4
    },
    "diana": {
     "n": 305,
     "acc": 29.2
    },
    "nova": {
     "n": 164,
     "acc": 58.5
    },
    "flow": {
     "n": 109,
     "acc": 37.6
    }
   },
   "graded": 852
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
     "acc": 80.5
    },
    "diana": {
     "n": 162,
     "acc": 49.4
    },
    "nova": {
     "n": 193,
     "acc": 80.8
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
    "taro": 0.2608,
    "diana": 0.2452,
    "nova": 0.2573,
    "flow": 0.2367
   },
   "acc": {
    "taro": {
     "n": 98,
     "acc": 55.1
    },
    "diana": {
     "n": 83,
     "acc": 51.8
    },
    "nova": {
     "n": 46,
     "acc": 54.3
    },
    "flow": {
     "n": 22,
     "acc": 54.5
    }
   },
   "graded": 249
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2708,
    "diana": 0.2266,
    "nova": 0.289,
    "flow": 0.2136
   },
   "acc": {
    "taro": {
     "n": 609,
     "acc": 65.7
    },
    "diana": {
     "n": 533,
     "acc": 55.0
    },
    "nova": {
     "n": 445,
     "acc": 70.1
    },
    "flow": {
     "n": 83,
     "acc": 51.8
    }
   },
   "graded": 1670
  },
  "지주·상사": {
   "weights": {
    "taro": 0.284,
    "diana": 0.218,
    "nova": 0.2633,
    "flow": 0.2347
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 60.5
    },
    "diana": {
     "n": 310,
     "acc": 46.5
    },
    "nova": {
     "n": 189,
     "acc": 56.1
    },
    "flow": {
     "n": 24,
     "acc": 37.5
    }
   },
   "graded": 799
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
    "taro": 0.3211,
    "diana": 0.1511,
    "nova": 0.2991,
    "flow": 0.2288
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 70.2
    },
    "diana": {
     "n": 106,
     "acc": 33.0
    },
    "nova": {
     "n": 78,
     "acc": 65.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 298
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.1806,
    "nova": 0.251,
    "flow": 0.2958
   },
   "acc": {
    "taro": {
     "n": 350,
     "acc": 69.1
    },
    "diana": {
     "n": 356,
     "acc": 45.8
    },
    "nova": {
     "n": 253,
     "acc": 63.6
    },
    "flow": {
     "n": 52,
     "acc": 76.9
    }
   },
   "graded": 1011
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
    "taro": 0.2735,
    "diana": 0.1793,
    "nova": 0.2864,
    "flow": 0.2608
   },
   "acc": {
    "taro": {
     "n": 204,
     "acc": 52.5
    },
    "diana": {
     "n": 224,
     "acc": 34.4
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
   "graded": 563
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2356,
    "diana": 0.198,
    "nova": 0.266,
    "flow": 0.3005
   },
   "acc": {
    "taro": {
     "n": 125,
     "acc": 39.2
    },
    "diana": {
     "n": 88,
     "acc": 33.0
    },
    "nova": {
     "n": 61,
     "acc": 44.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 274
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
    "taro": 0.2449,
    "diana": 0.1537,
    "nova": 0.3452,
    "flow": 0.2562
   },
   "acc": {
    "taro": {
     "n": 136,
     "acc": 47.8
    },
    "diana": {
     "n": 181,
     "acc": 23.8
    },
    "nova": {
     "n": 95,
     "acc": 67.4
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
    "taro": 0.2714,
    "diana": 0.2601,
    "nova": 0.2684,
    "flow": 0.2002
   },
   "acc": {
    "taro": {
     "n": 121,
     "acc": 67.8
    },
    "diana": {
     "n": 97,
     "acc": 64.9
    },
    "nova": {
     "n": 94,
     "acc": 67.0
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
    "taro": 0.1946,
    "diana": 0.2318,
    "nova": 0.2737,
    "flow": 0.2998
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 32.5
    },
    "diana": {
     "n": 150,
     "acc": 38.7
    },
    "nova": {
     "n": 46,
     "acc": 45.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 310
  }
 }
};
