// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 12:55",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2827,
   "diana": 0.192,
   "nova": 0.2708,
   "flow": 0.2545
  },
  "acc": {
   "taro": {
    "n": 6728,
    "acc": 61.7
   },
   "diana": {
    "n": 6116,
    "acc": 41.9
   },
   "nova": {
    "n": 5388,
    "acc": 59.1
   },
   "flow": {
    "n": 1168,
    "acc": 55.6
   }
  },
  "graded": 19400,
  "team": {
   "hit": 5287,
   "miss": 1304,
   "n": 6591,
   "acc": 80.2
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2949,
    "diana": 0.1771,
    "nova": 0.2256,
    "flow": 0.3025
   },
   "acc": {
    "taro": {
     "n": 814,
     "acc": 68.1
    },
    "diana": {
     "n": 531,
     "acc": 40.9
    },
    "nova": {
     "n": 701,
     "acc": 52.1
    },
    "flow": {
     "n": 265,
     "acc": 69.8
    }
   },
   "graded": 2311
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3065,
    "diana": 0.1522,
    "nova": 0.2618,
    "flow": 0.2795
   },
   "acc": {
    "taro": {
     "n": 399,
     "acc": 77.2
    },
    "diana": {
     "n": 247,
     "acc": 37.2
    },
    "nova": {
     "n": 331,
     "acc": 64.0
    },
    "flow": {
     "n": 117,
     "acc": 68.4
    }
   },
   "graded": 1094
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
    "taro": 0.2328,
    "diana": 0.2313,
    "nova": 0.2683,
    "flow": 0.2676
   },
   "acc": {
    "taro": {
     "n": 295,
     "acc": 50.5
    },
    "diana": {
     "n": 281,
     "acc": 50.2
    },
    "nova": {
     "n": 244,
     "acc": 58.2
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 851
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
    "taro": 0.3021,
    "diana": 0.1944,
    "nova": 0.3021,
    "flow": 0.2014
   },
   "acc": {
    "taro": {
     "n": 363,
     "acc": 82.4
    },
    "diana": {
     "n": 232,
     "acc": 48.3
    },
    "nova": {
     "n": 303,
     "acc": 75.6
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 900
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
    "taro": 0.2766,
    "diana": 0.2242,
    "nova": 0.2602,
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
     "n": 704,
     "acc": 62.6
    },
    "flow": {
     "n": 113,
     "acc": 57.5
    }
   },
   "graded": 2414
  },
  "지주·상사": {
   "weights": {
    "taro": 0.304,
    "diana": 0.2162,
    "nova": 0.3225,
    "flow": 0.1573
   },
   "acc": {
    "taro": {
     "n": 388,
     "acc": 58.0
    },
    "diana": {
     "n": 439,
     "acc": 41.2
    },
    "nova": {
     "n": 317,
     "acc": 61.5
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1179
  },
  "조선": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.1862,
    "nova": 0.281,
    "flow": 0.2572
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 53.6
    },
    "diana": {
     "n": 232,
     "acc": 36.2
    },
    "nova": {
     "n": 194,
     "acc": 54.6
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 677
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
    "taro": 0.26,
    "diana": 0.2656,
    "nova": 0.2208,
    "flow": 0.2535
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 49.5
    },
    "diana": {
     "n": 97,
     "acc": 50.5
    },
    "nova": {
     "n": 50,
     "acc": 42.0
    },
    "flow": {
     "n": 56,
     "acc": 48.2
    }
   },
   "graded": 294
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2773,
    "diana": 0.189,
    "nova": 0.2783,
    "flow": 0.2554
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 54.3
    },
    "diana": {
     "n": 308,
     "acc": 37.0
    },
    "nova": {
     "n": 200,
     "acc": 54.5
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 815
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
    "taro": 0.2446,
    "diana": 0.1892,
    "nova": 0.2903,
    "flow": 0.2759
   },
   "acc": {
    "taro": {
     "n": 194,
     "acc": 44.3
    },
    "diana": {
     "n": 245,
     "acc": 34.3
    },
    "nova": {
     "n": 154,
     "acc": 52.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 593
  },
  "로봇": {
   "weights": {
    "taro": 0.2648,
    "diana": 0.2742,
    "nova": 0.2729,
    "flow": 0.188
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 70.4
    },
    "diana": {
     "n": 133,
     "acc": 72.9
    },
    "nova": {
     "n": 135,
     "acc": 72.6
    },
    "flow": {
     "n": 28,
     "acc": 53.6
    }
   },
   "graded": 455
  },
  "식음료": {
   "weights": {
    "taro": 0.2001,
    "diana": 0.3027,
    "nova": 0.2067,
    "flow": 0.2905
   },
   "acc": {
    "taro": {
     "n": 151,
     "acc": 34.4
    },
    "diana": {
     "n": 215,
     "acc": 52.1
    },
    "nova": {
     "n": 104,
     "acc": 35.6
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 470
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
