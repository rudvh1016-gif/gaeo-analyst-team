// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-03 15:14",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2852,
   "diana": 0.1886,
   "nova": 0.2689,
   "flow": 0.2573
  },
  "acc": {
   "taro": {
    "n": 7076,
    "acc": 61.9
   },
   "diana": {
    "n": 6443,
    "acc": 41.0
   },
   "nova": {
    "n": 5752,
    "acc": 58.4
   },
   "flow": {
    "n": 1229,
    "acc": 55.9
   }
  },
  "graded": 20500,
  "team": {
   "hit": 5578,
   "miss": 1344,
   "n": 6922,
   "acc": 80.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3006,
    "diana": 0.1737,
    "nova": 0.2167,
    "flow": 0.309
   },
   "acc": {
    "taro": {
     "n": 861,
     "acc": 69.0
    },
    "diana": {
     "n": 562,
     "acc": 39.9
    },
    "nova": {
     "n": 746,
     "acc": 49.7
    },
    "flow": {
     "n": 275,
     "acc": 70.9
    }
   },
   "graded": 2444
  },
  "전자·부품": {
   "weights": {
    "taro": 0.31,
    "diana": 0.1526,
    "nova": 0.2529,
    "flow": 0.2846
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 77.7
    },
    "diana": {
     "n": 260,
     "acc": 36.9
    },
    "nova": {
     "n": 353,
     "acc": 61.2
    },
    "flow": {
     "n": 122,
     "acc": 68.9
    }
   },
   "graded": 1157
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2587,
    "diana": 0.226,
    "nova": 0.26,
    "flow": 0.2553
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 54.7
    },
    "diana": {
     "n": 335,
     "acc": 47.8
    },
    "nova": {
     "n": 313,
     "acc": 55.0
    },
    "flow": {
     "n": 63,
     "acc": 54.0
    }
   },
   "graded": 1064
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3306,
    "diana": 0.1587,
    "nova": 0.3424,
    "flow": 0.1683
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 62.5
    },
    "diana": {
     "n": 314,
     "acc": 29.3
    },
    "nova": {
     "n": 224,
     "acc": 64.7
    },
    "flow": {
     "n": 66,
     "acc": 31.8
    }
   },
   "graded": 884
  },
  "통신": {
   "weights": {
    "taro": 0.258,
    "diana": 0.1878,
    "nova": 0.2605,
    "flow": 0.2937
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 60.0
    },
    "diana": {
     "n": 87,
     "acc": 43.7
    },
    "nova": {
     "n": 104,
     "acc": 60.6
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
    "taro": 0.2303,
    "diana": 0.2248,
    "nova": 0.2666,
    "flow": 0.2782
   },
   "acc": {
    "taro": {
     "n": 313,
     "acc": 50.2
    },
    "diana": {
     "n": 292,
     "acc": 49.0
    },
    "nova": {
     "n": 260,
     "acc": 58.1
    },
    "flow": {
     "n": 33,
     "acc": 60.6
    }
   },
   "graded": 898
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3277,
    "diana": 0.1647,
    "nova": 0.311,
    "flow": 0.1967
   },
   "acc": {
    "taro": {
     "n": 407,
     "acc": 59.7
    },
    "diana": {
     "n": 457,
     "acc": 24.7
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
   "graded": 1277
  },
  "2차전지": {
   "weights": {
    "taro": 0.305,
    "diana": 0.1967,
    "nova": 0.295,
    "flow": 0.2033
   },
   "acc": {
    "taro": {
     "n": 383,
     "acc": 83.0
    },
    "diana": {
     "n": 244,
     "acc": 48.4
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
   "graded": 947
  },
  "보험": {
   "weights": {
    "taro": 0.2622,
    "diana": 0.2362,
    "nova": 0.2761,
    "flow": 0.2255
   },
   "acc": {
    "taro": {
     "n": 140,
     "acc": 52.9
    },
    "diana": {
     "n": 126,
     "acc": 47.6
    },
    "nova": {
     "n": 97,
     "acc": 55.7
    },
    "flow": {
     "n": 33,
     "acc": 45.5
    }
   },
   "graded": 396
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2775,
    "diana": 0.2211,
    "nova": 0.2596,
    "flow": 0.2418
   },
   "acc": {
    "taro": {
     "n": 895,
     "acc": 66.7
    },
    "diana": {
     "n": 777,
     "acc": 53.2
    },
    "nova": {
     "n": 750,
     "acc": 62.4
    },
    "flow": {
     "n": 117,
     "acc": 58.1
    }
   },
   "graded": 2539
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3063,
    "diana": 0.2122,
    "nova": 0.3229,
    "flow": 0.1585
   },
   "acc": {
    "taro": {
     "n": 407,
     "acc": 58.0
    },
    "diana": {
     "n": 463,
     "acc": 40.2
    },
    "nova": {
     "n": 337,
     "acc": 61.1
    },
    "flow": {
     "n": 36,
     "acc": 27.8
    }
   },
   "graded": 1243
  },
  "조선": {
   "weights": {
    "taro": 0.2826,
    "diana": 0.1793,
    "nova": 0.2798,
    "flow": 0.2583
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 54.7
    },
    "diana": {
     "n": 245,
     "acc": 34.7
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
   "graded": 716
  },
  "방산": {
   "weights": {
    "taro": 0.2933,
    "diana": 0.1585,
    "nova": 0.2878,
    "flow": 0.2604
   },
   "acc": {
    "taro": {
     "n": 103,
     "acc": 56.3
    },
    "diana": {
     "n": 46,
     "acc": 30.4
    },
    "nova": {
     "n": 76,
     "acc": 55.3
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 226
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3008,
    "diana": 0.1681,
    "nova": 0.2928,
    "flow": 0.2384
   },
   "acc": {
    "taro": {
     "n": 149,
     "acc": 63.1
    },
    "diana": {
     "n": 156,
     "acc": 35.3
    },
    "nova": {
     "n": 127,
     "acc": 61.4
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
    "taro": 0.2701,
    "diana": 0.1654,
    "nova": 0.2589,
    "flow": 0.3056
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 66.3
    },
    "diana": {
     "n": 542,
     "acc": 40.6
    },
    "nova": {
     "n": 436,
     "acc": 63.5
    },
    "flow": {
     "n": 72,
     "acc": 77.8
    }
   },
   "graded": 1566
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2607,
    "diana": 0.2532,
    "nova": 0.2403,
    "flow": 0.2458
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 49.5
    },
    "diana": {
     "n": 104,
     "acc": 48.1
    },
    "nova": {
     "n": 57,
     "acc": 45.6
    },
    "flow": {
     "n": 60,
     "acc": 46.7
    }
   },
   "graded": 318
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2763,
    "diana": 0.1823,
    "nova": 0.2862,
    "flow": 0.2552
   },
   "acc": {
    "taro": {
     "n": 303,
     "acc": 54.1
    },
    "diana": {
     "n": 322,
     "acc": 35.7
    },
    "nova": {
     "n": 214,
     "acc": 56.1
    },
    "flow": {
     "n": 16,
     "acc": 81.2
    }
   },
   "graded": 855
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2665,
    "diana": 0.2184,
    "nova": 0.2331,
    "flow": 0.282
   },
   "acc": {
    "taro": {
     "n": 182,
     "acc": 47.3
    },
    "diana": {
     "n": 142,
     "acc": 38.7
    },
    "nova": {
     "n": 121,
     "acc": 41.3
    },
    "flow": {
     "n": 1,
     "acc": 0.0
    }
   },
   "graded": 446
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3233,
    "diana": 0.1619,
    "nova": 0.3324,
    "flow": 0.1824
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 59.9
    },
    "diana": {
     "n": 193,
     "acc": 29.0
    },
    "nova": {
     "n": 164,
     "acc": 61.6
    },
    "flow": {
     "n": 71,
     "acc": 33.8
    }
   },
   "graded": 640
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2435,
    "diana": 0.1822,
    "nova": 0.3011,
    "flow": 0.2733
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 44.6
    },
    "diana": {
     "n": 258,
     "acc": 33.3
    },
    "nova": {
     "n": 167,
     "acc": 55.1
    },
    "flow": {
     "n": 1,
     "acc": 100.0
    }
   },
   "graded": 628
  },
  "기계": {
   "weights": {
    "taro": 0.2134,
    "diana": 0.2049,
    "nova": 0.3027,
    "flow": 0.279
   },
   "acc": {
    "taro": {
     "n": 68,
     "acc": 38.2
    },
    "diana": {
     "n": 79,
     "acc": 36.7
    },
    "nova": {
     "n": 59,
     "acc": 54.2
    },
    "flow": {
     "n": 3,
     "acc": 100.0
    }
   },
   "graded": 209
  },
  "로봇": {
   "weights": {
    "taro": 0.2625,
    "diana": 0.2727,
    "nova": 0.2713,
    "flow": 0.1934
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 67.9
    },
    "diana": {
     "n": 139,
     "acc": 70.5
    },
    "nova": {
     "n": 144,
     "acc": 70.1
    },
    "flow": {
     "n": 32,
     "acc": 50.0
    }
   },
   "graded": 483
  },
  "식음료": {
   "weights": {
    "taro": 0.1894,
    "diana": 0.2961,
    "nova": 0.2287,
    "flow": 0.2859
   },
   "acc": {
    "taro": {
     "n": 160,
     "acc": 33.1
    },
    "diana": {
     "n": 224,
     "acc": 51.8
    },
    "nova": {
     "n": 115,
     "acc": 40.0
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 499
  },
  "여행레저": {
   "weights": {
    "taro": 0.3594,
    "diana": 0.1635,
    "nova": 0.3136,
    "flow": 0.1635
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 65.9
    },
    "diana": {
     "n": 76,
     "acc": 22.4
    },
    "nova": {
     "n": 73,
     "acc": 57.5
    },
    "flow": {
     "n": 31,
     "acc": 29.0
    }
   },
   "graded": 271
  }
 }
};
