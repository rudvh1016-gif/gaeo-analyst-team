// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 15:11",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2886,
   "diana": 0.1743,
   "nova": 0.2887,
   "flow": 0.2483
  },
  "acc": {
   "taro": {
    "n": 3777,
    "acc": 63.4
   },
   "diana": {
    "n": 3409,
    "acc": 38.3
   },
   "nova": {
    "n": 2655,
    "acc": 63.5
   },
   "flow": {
    "n": 665,
    "acc": 54.6
   }
  },
  "graded": 10506
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2719,
    "diana": 0.205,
    "nova": 0.2247,
    "flow": 0.2984
   },
   "acc": {
    "taro": {
     "n": 448,
     "acc": 56.2
    },
    "diana": {
     "n": 290,
     "acc": 42.4
    },
    "nova": {
     "n": 355,
     "acc": 46.5
    },
    "flow": {
     "n": 149,
     "acc": 61.7
    }
   },
   "graded": 1242
  },
  "전자·부품": {
   "weights": {
    "taro": 0.307,
    "diana": 0.1502,
    "nova": 0.2814,
    "flow": 0.2615
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 77.2
    },
    "diana": {
     "n": 139,
     "acc": 36.7
    },
    "nova": {
     "n": 176,
     "acc": 68.8
    },
    "flow": {
     "n": 72,
     "acc": 63.9
    }
   },
   "graded": 606
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.2018,
    "nova": 0.2723,
    "flow": 0.2383
   },
   "acc": {
    "taro": {
     "n": 174,
     "acc": 60.3
    },
    "diana": {
     "n": 170,
     "acc": 42.4
    },
    "nova": {
     "n": 133,
     "acc": 57.1
    },
    "flow": {
     "n": 29,
     "acc": 86.2
    }
   },
   "graded": 506
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3436,
    "diana": 0.1424,
    "nova": 0.3241,
    "flow": 0.1899
   },
   "acc": {
    "taro": {
     "n": 163,
     "acc": 72.4
    },
    "diana": {
     "n": 167,
     "acc": 29.3
    },
    "nova": {
     "n": 104,
     "acc": 68.3
    },
    "flow": {
     "n": 40,
     "acc": 40.0
    }
   },
   "graded": 474
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2559,
    "diana": 0.2172,
    "nova": 0.2918,
    "flow": 0.2351
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 54.4
    },
    "diana": {
     "n": 158,
     "acc": 46.2
    },
    "nova": {
     "n": 116,
     "acc": 62.1
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 459
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2938,
    "diana": 0.1771,
    "nova": 0.2874,
    "flow": 0.2416
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 58.7
    },
    "diana": {
     "n": 232,
     "acc": 35.3
    },
    "nova": {
     "n": 122,
     "acc": 57.4
    },
    "flow": {
     "n": 85,
     "acc": 48.2
    }
   },
   "graded": 647
  },
  "2차전지": {
   "weights": {
    "taro": 0.2991,
    "diana": 0.2025,
    "nova": 0.2991,
    "flow": 0.1994
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 84.2
    },
    "diana": {
     "n": 128,
     "acc": 50.8
    },
    "nova": {
     "n": 161,
     "acc": 83.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 491
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.221,
    "nova": 0.3074,
    "flow": 0.188
   },
   "acc": {
    "taro": {
     "n": 477,
     "acc": 67.1
    },
    "diana": {
     "n": 423,
     "acc": 52.2
    },
    "nova": {
     "n": 366,
     "acc": 72.7
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1329
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2982,
    "diana": 0.1838,
    "nova": 0.2845,
    "flow": 0.2336
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 63.8
    },
    "diana": {
     "n": 244,
     "acc": 39.3
    },
    "nova": {
     "n": 156,
     "acc": 60.9
    },
    "flow": {
     "n": 20,
     "acc": 45.0
    }
   },
   "graded": 644
  },
  "조선": {
   "weights": {
    "taro": 0.3428,
    "diana": 0.1404,
    "nova": 0.2827,
    "flow": 0.2341
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 73.2
    },
    "diana": {
     "n": 128,
     "acc": 20.3
    },
    "nova": {
     "n": 101,
     "acc": 60.4
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 366
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3261,
    "diana": 0.1304,
    "nova": 0.3261,
    "flow": 0.2174
   },
   "acc": {
    "taro": {
     "n": 90,
     "acc": 84.4
    },
    "diana": {
     "n": 83,
     "acc": 15.7
    },
    "nova": {
     "n": 63,
     "acc": 77.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 236
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2798,
    "diana": 0.1642,
    "nova": 0.2592,
    "flow": 0.2968
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 70.7
    },
    "diana": {
     "n": 282,
     "acc": 41.5
    },
    "nova": {
     "n": 200,
     "acc": 65.5
    },
    "flow": {
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 802
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2696,
    "diana": 0.1714,
    "nova": 0.2911,
    "flow": 0.2679
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 50.3
    },
    "diana": {
     "n": 175,
     "acc": 32.0
    },
    "nova": {
     "n": 92,
     "acc": 54.3
    },
    "flow": {
     "n": 9,
     "acc": 77.8
    }
   },
   "graded": 431
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2397,
    "diana": 0.2169,
    "nova": 0.2484,
    "flow": 0.295
   },
   "acc": {
    "taro": {
     "n": 96,
     "acc": 40.6
    },
    "diana": {
     "n": 68,
     "acc": 36.8
    },
    "nova": {
     "n": 57,
     "acc": 42.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 221
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3442,
    "diana": 0.1499,
    "nova": 0.3522,
    "flow": 0.1537
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 68.9
    },
    "diana": {
     "n": 104,
     "acc": 18.3
    },
    "nova": {
     "n": 78,
     "acc": 70.5
    },
    "flow": {
     "n": 39,
     "acc": 30.8
    }
   },
   "graded": 340
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2329,
    "diana": 0.1485,
    "nova": 0.3712,
    "flow": 0.2475
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 47.1
    },
    "diana": {
     "n": 144,
     "acc": 19.4
    },
    "nova": {
     "n": 67,
     "acc": 79.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 313
  },
  "로봇": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.2727,
    "nova": 0.2727,
    "flow": 0.1818
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 80.9
    },
    "diana": {
     "n": 76,
     "acc": 78.9
    },
    "nova": {
     "n": 77,
     "acc": 76.6
    },
    "flow": {
     "n": 9,
     "acc": 22.2
    }
   },
   "graded": 256
  },
  "식음료": {
   "weights": {
    "taro": 0.1839,
    "diana": 0.1839,
    "nova": 0.3257,
    "flow": 0.3065
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 22.3
    },
    "diana": {
     "n": 120,
     "acc": 26.7
    },
    "nova": {
     "n": 32,
     "acc": 53.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 246
  }
 }
};
