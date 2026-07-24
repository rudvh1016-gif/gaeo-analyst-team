// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 10:44",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2755,
   "diana": 0.2012,
   "nova": 0.2687,
   "flow": 0.2545
  },
  "acc": {
   "taro": {
    "n": 4852,
    "acc": 59.7
   },
   "diana": {
    "n": 4395,
    "acc": 43.6
   },
   "nova": {
    "n": 3396,
    "acc": 58.3
   },
   "flow": {
    "n": 866,
    "acc": 55.2
   }
  },
  "graded": 13509
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.272,
    "diana": 0.2004,
    "nova": 0.2288,
    "flow": 0.2988
   },
   "acc": {
    "taro": {
     "n": 572,
     "acc": 59.4
    },
    "diana": {
     "n": 370,
     "acc": 43.8
    },
    "nova": {
     "n": 466,
     "acc": 50.0
    },
    "flow": {
     "n": 193,
     "acc": 65.3
    }
   },
   "graded": 1601
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3028,
    "diana": 0.1598,
    "nova": 0.2735,
    "flow": 0.2639
   },
   "acc": {
    "taro": {
     "n": 282,
     "acc": 74.5
    },
    "diana": {
     "n": 173,
     "acc": 39.3
    },
    "nova": {
     "n": 220,
     "acc": 67.3
    },
    "flow": {
     "n": 94,
     "acc": 64.9
    }
   },
   "graded": 769
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2339,
    "diana": 0.2214,
    "nova": 0.2098,
    "flow": 0.335
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 52.4
    },
    "diana": {
     "n": 226,
     "acc": 49.6
    },
    "nova": {
     "n": 181,
     "acc": 47.0
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
    "taro": 0.3292,
    "diana": 0.1874,
    "nova": 0.2999,
    "flow": 0.1835
   },
   "acc": {
    "taro": {
     "n": 199,
     "acc": 63.3
    },
    "diana": {
     "n": 208,
     "acc": 36.1
    },
    "nova": {
     "n": 130,
     "acc": 57.7
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
    "taro": 0.2816,
    "diana": 0.208,
    "nova": 0.2678,
    "flow": 0.2427
   },
   "acc": {
    "taro": {
     "n": 81,
     "acc": 58.0
    },
    "diana": {
     "n": 56,
     "acc": 42.9
    },
    "nova": {
     "n": 58,
     "acc": 55.2
    },
    "flow": {
     "n": 22,
     "acc": 68.2
    }
   },
   "graded": 217
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2495,
    "diana": 0.263,
    "nova": 0.2514,
    "flow": 0.2362
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 52.8
    },
    "diana": {
     "n": 212,
     "acc": 55.7
    },
    "nova": {
     "n": 156,
     "acc": 53.2
    },
    "flow": {
     "n": 22,
     "acc": 54.5
    }
   },
   "graded": 604
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2984,
    "diana": 0.1685,
    "nova": 0.3152,
    "flow": 0.2179
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 54.0
    },
    "diana": {
     "n": 305,
     "acc": 30.5
    },
    "nova": {
     "n": 163,
     "acc": 57.1
    },
    "flow": {
     "n": 109,
     "acc": 39.4
    }
   },
   "graded": 851
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
     "n": 257,
     "acc": 77.8
    },
    "diana": {
     "n": 164,
     "acc": 48.8
    },
    "nova": {
     "n": 199,
     "acc": 77.4
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 621
  },
  "보험": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.2604,
    "nova": 0.2484,
    "flow": 0.2286
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 57.4
    },
    "diana": {
     "n": 79,
     "acc": 57.0
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
   "graded": 243
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2688,
    "diana": 0.2268,
    "nova": 0.2849,
    "flow": 0.2194
   },
   "acc": {
    "taro": {
     "n": 612,
     "acc": 64.9
    },
    "diana": {
     "n": 539,
     "acc": 54.7
    },
    "nova": {
     "n": 448,
     "acc": 68.8
    },
    "flow": {
     "n": 85,
     "acc": 52.9
    }
   },
   "graded": 1684
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2839,
    "diana": 0.2192,
    "nova": 0.2611,
    "flow": 0.2357
   },
   "acc": {
    "taro": {
     "n": 284,
     "acc": 60.2
    },
    "diana": {
     "n": 314,
     "acc": 46.5
    },
    "nova": {
     "n": 195,
     "acc": 55.4
    },
    "flow": {
     "n": 26,
     "acc": 34.6
    }
   },
   "graded": 819
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
    "taro": 0.3143,
    "diana": 0.1657,
    "nova": 0.2863,
    "flow": 0.2337
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 67.2
    },
    "diana": {
     "n": 110,
     "acc": 35.5
    },
    "nova": {
     "n": 80,
     "acc": 61.3
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 306
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2688,
    "diana": 0.1874,
    "nova": 0.2431,
    "flow": 0.3007
   },
   "acc": {
    "taro": {
     "n": 358,
     "acc": 67.0
    },
    "diana": {
     "n": 366,
     "acc": 46.7
    },
    "nova": {
     "n": 259,
     "acc": 60.6
    },
    "flow": {
     "n": 52,
     "acc": 76.9
    }
   },
   "graded": 1035
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
    "taro": 0.2688,
    "diana": 0.195,
    "nova": 0.2785,
    "flow": 0.2577
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 52.2
    },
    "diana": {
     "n": 230,
     "acc": 37.8
    },
    "nova": {
     "n": 124,
     "acc": 54.0
    },
    "flow": {
     "n": 13,
     "acc": 84.6
    }
   },
   "graded": 576
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
    "taro": 0.2444,
    "diana": 0.1523,
    "nova": 0.3494,
    "flow": 0.2539
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
     "n": 93,
     "acc": 68.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 407
  },
  "로봇": {
   "weights": {
    "taro": 0.2708,
    "diana": 0.2627,
    "nova": 0.2685,
    "flow": 0.198
   },
   "acc": {
    "taro": {
     "n": 117,
     "acc": 68.4
    },
    "diana": {
     "n": 95,
     "acc": 66.3
    },
    "nova": {
     "n": 90,
     "acc": 67.8
    },
    "flow": {
     "n": 10,
     "acc": 30.0
    }
   },
   "graded": 312
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
