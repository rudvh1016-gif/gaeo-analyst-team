// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-31 10:41",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2827,
   "diana": 0.1924,
   "nova": 0.2707,
   "flow": 0.2542
  },
  "acc": {
   "taro": {
    "n": 6722,
    "acc": 61.8
   },
   "diana": {
    "n": 6110,
    "acc": 42.1
   },
   "nova": {
    "n": 5378,
    "acc": 59.2
   },
   "flow": {
    "n": 1168,
    "acc": 55.6
   }
  },
  "graded": 19378,
  "team": {
   "hit": 5291,
   "miss": 1299,
   "n": 6590,
   "acc": 80.3
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2944,
    "diana": 0.1778,
    "nova": 0.2257,
    "flow": 0.3021
   },
   "acc": {
    "taro": {
     "n": 816,
     "acc": 68.0
    },
    "diana": {
     "n": 533,
     "acc": 41.1
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
   "graded": 2316
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
    "taro": 0.2524,
    "diana": 0.2295,
    "nova": 0.2627,
    "flow": 0.2554
   },
   "acc": {
    "taro": {
     "n": 334,
     "acc": 53.6
    },
    "diana": {
     "n": 318,
     "acc": 48.7
    },
    "nova": {
     "n": 294,
     "acc": 55.8
    },
    "flow": {
     "n": 59,
     "acc": 54.2
    }
   },
   "graded": 1005
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3317,
    "diana": 0.1591,
    "nova": 0.3493,
    "flow": 0.1599
   },
   "acc": {
    "taro": {
     "n": 267,
     "acc": 62.5
    },
    "diana": {
     "n": 295,
     "acc": 28.5
    },
    "nova": {
     "n": 208,
     "acc": 65.9
    },
    "flow": {
     "n": 63,
     "acc": 30.2
    }
   },
   "graded": 833
  },
  "통신": {
   "weights": {
    "taro": 0.2624,
    "diana": 0.1911,
    "nova": 0.2612,
    "flow": 0.2854
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 60.5
    },
    "diana": {
     "n": 84,
     "acc": 44.0
    },
    "nova": {
     "n": 98,
     "acc": 60.2
    },
    "flow": {
     "n": 38,
     "acc": 65.8
    }
   },
   "graded": 344
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2341,
    "diana": 0.2301,
    "nova": 0.2675,
    "flow": 0.2682
   },
   "acc": {
    "taro": {
     "n": 292,
     "acc": 50.7
    },
    "diana": {
     "n": 279,
     "acc": 49.8
    },
    "nova": {
     "n": 240,
     "acc": 57.9
    },
    "flow": {
     "n": 31,
     "acc": 58.1
    }
   },
   "graded": 842
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3243,
    "diana": 0.164,
    "nova": 0.3141,
    "flow": 0.1975
   },
   "acc": {
    "taro": {
     "n": 386,
     "acc": 59.3
    },
    "diana": {
     "n": 432,
     "acc": 26.2
    },
    "nova": {
     "n": 275,
     "acc": 57.5
    },
    "flow": {
     "n": 119,
     "acc": 36.1
    }
   },
   "graded": 1212
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
     "n": 362,
     "acc": 82.6
    },
    "diana": {
     "n": 232,
     "acc": 48.3
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
   "graded": 898
  },
  "보험": {
   "weights": {
    "taro": 0.2602,
    "diana": 0.2474,
    "nova": 0.2707,
    "flow": 0.2216
   },
   "acc": {
    "taro": {
     "n": 132,
     "acc": 53.0
    },
    "diana": {
     "n": 119,
     "acc": 50.4
    },
    "nova": {
     "n": 87,
     "acc": 55.2
    },
    "flow": {
     "n": 31,
     "acc": 45.2
    }
   },
   "graded": 369
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.2243,
    "nova": 0.2608,
    "flow": 0.2386
   },
   "acc": {
    "taro": {
     "n": 856,
     "acc": 66.6
    },
    "diana": {
     "n": 740,
     "acc": 54.1
    },
    "nova": {
     "n": 703,
     "acc": 62.9
    },
    "flow": {
     "n": 113,
     "acc": 57.5
    }
   },
   "graded": 2412
  },
  "지주·상사": {
   "weights": {
    "taro": 0.303,
    "diana": 0.219,
    "nova": 0.3216,
    "flow": 0.1564
   },
   "acc": {
    "taro": {
     "n": 387,
     "acc": 58.1
    },
    "diana": {
     "n": 438,
     "acc": 42.0
    },
    "nova": {
     "n": 316,
     "acc": 61.7
    },
    "flow": {
     "n": 35,
     "acc": 28.6
    }
   },
   "graded": 1176
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
    "taro": 0.2691,
    "diana": 0.171,
    "nova": 0.2568,
    "flow": 0.3031
   },
   "acc": {
    "taro": {
     "n": 488,
     "acc": 66.6
    },
    "diana": {
     "n": 508,
     "acc": 42.3
    },
    "nova": {
     "n": 406,
     "acc": 63.5
    },
    "flow": {
     "n": 67,
     "acc": 77.6
    }
   },
   "graded": 1469
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2626,
    "diana": 0.2628,
    "nova": 0.223,
    "flow": 0.2516
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 49.5
    },
    "diana": {
     "n": 97,
     "acc": 49.5
    },
    "nova": {
     "n": 50,
     "acc": 42.0
    },
    "flow": {
     "n": 57,
     "acc": 47.4
    }
   },
   "graded": 295
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2788,
    "diana": 0.1905,
    "nova": 0.2755,
    "flow": 0.2551
   },
   "acc": {
    "taro": {
     "n": 291,
     "acc": 54.6
    },
    "diana": {
     "n": 308,
     "acc": 37.3
    },
    "nova": {
     "n": 200,
     "acc": 54.0
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
    "taro": 0.2651,
    "diana": 0.2301,
    "nova": 0.2215,
    "flow": 0.2833
   },
   "acc": {
    "taro": {
     "n": 171,
     "acc": 46.8
    },
    "diana": {
     "n": 133,
     "acc": 40.6
    },
    "nova": {
     "n": 110,
     "acc": 39.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 414
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
    "taro": 0.2463,
    "diana": 0.1859,
    "nova": 0.2945,
    "flow": 0.2732
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 45.1
    },
    "diana": {
     "n": 244,
     "acc": 34.0
    },
    "nova": {
     "n": 154,
     "acc": 53.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 591
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
    "taro": 0.2022,
    "diana": 0.3029,
    "nova": 0.2067,
    "flow": 0.2883
   },
   "acc": {
    "taro": {
     "n": 154,
     "acc": 35.1
    },
    "diana": {
     "n": 217,
     "acc": 52.5
    },
    "nova": {
     "n": 106,
     "acc": 35.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 477
  },
  "여행레저": {
   "weights": {
    "taro": 0.3584,
    "diana": 0.167,
    "nova": 0.3075,
    "flow": 0.167
   },
   "acc": {
    "taro": {
     "n": 87,
     "acc": 64.4
    },
    "diana": {
     "n": 71,
     "acc": 23.9
    },
    "nova": {
     "n": 67,
     "acc": 55.2
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 256
  }
 }
};
