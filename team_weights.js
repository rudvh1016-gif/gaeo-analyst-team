// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 14:16",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2866,
   "diana": 0.1794,
   "nova": 0.2841,
   "flow": 0.2498
  },
  "acc": {
   "taro": {
    "n": 3766,
    "acc": 62.5
   },
   "diana": {
    "n": 3401,
    "acc": 39.1
   },
   "nova": {
    "n": 2650,
    "acc": 62.0
   },
   "flow": {
    "n": 657,
    "acc": 54.5
   }
  },
  "graded": 10474
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2707,
    "diana": 0.209,
    "nova": 0.2251,
    "flow": 0.2952
   },
   "acc": {
    "taro": {
     "n": 446,
     "acc": 55.4
    },
    "diana": {
     "n": 290,
     "acc": 42.8
    },
    "nova": {
     "n": 354,
     "acc": 46.0
    },
    "flow": {
     "n": 149,
     "acc": 60.4
    }
   },
   "graded": 1239
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3084,
    "diana": 0.1512,
    "nova": 0.2797,
    "flow": 0.2606
   },
   "acc": {
    "taro": {
     "n": 215,
     "acc": 76.7
    },
    "diana": {
     "n": 136,
     "acc": 36.8
    },
    "nova": {
     "n": 172,
     "acc": 68.0
    },
    "flow": {
     "n": 71,
     "acc": 63.4
    }
   },
   "graded": 594
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2837,
    "diana": 0.2078,
    "nova": 0.2652,
    "flow": 0.2434
   },
   "acc": {
    "taro": {
     "n": 175,
     "acc": 58.3
    },
    "diana": {
     "n": 171,
     "acc": 42.7
    },
    "nova": {
     "n": 134,
     "acc": 54.5
    },
    "flow": {
     "n": 27,
     "acc": 85.2
    }
   },
   "graded": 507
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3418,
    "diana": 0.1458,
    "nova": 0.3167,
    "flow": 0.1958
   },
   "acc": {
    "taro": {
     "n": 162,
     "acc": 71.6
    },
    "diana": {
     "n": 167,
     "acc": 30.5
    },
    "nova": {
     "n": 104,
     "acc": 66.3
    },
    "flow": {
     "n": 39,
     "acc": 41.0
    }
   },
   "graded": 472
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.254,
    "diana": 0.2188,
    "nova": 0.2902,
    "flow": 0.237
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 53.6
    },
    "diana": {
     "n": 156,
     "acc": 46.2
    },
    "nova": {
     "n": 116,
     "acc": 61.2
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 456
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2859,
    "diana": 0.1883,
    "nova": 0.2716,
    "flow": 0.2542
   },
   "acc": {
    "taro": {
     "n": 209,
     "acc": 56.9
    },
    "diana": {
     "n": 232,
     "acc": 37.5
    },
    "nova": {
     "n": 122,
     "acc": 54.1
    },
    "flow": {
     "n": 81,
     "acc": 50.6
    }
   },
   "graded": 644
  },
  "2차전지": {
   "weights": {
    "taro": 0.2995,
    "diana": 0.2013,
    "nova": 0.2995,
    "flow": 0.1997
   },
   "acc": {
    "taro": {
     "n": 200,
     "acc": 83.0
    },
    "diana": {
     "n": 125,
     "acc": 50.4
    },
    "nova": {
     "n": 159,
     "acc": 81.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 484
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2819,
    "diana": 0.2246,
    "nova": 0.3046,
    "flow": 0.1889
   },
   "acc": {
    "taro": {
     "n": 478,
     "acc": 66.3
    },
    "diana": {
     "n": 424,
     "acc": 52.8
    },
    "nova": {
     "n": 367,
     "acc": 71.7
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1332
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2965,
    "diana": 0.1872,
    "nova": 0.2808,
    "flow": 0.2355
   },
   "acc": {
    "taro": {
     "n": 224,
     "acc": 62.9
    },
    "diana": {
     "n": 244,
     "acc": 39.8
    },
    "nova": {
     "n": 156,
     "acc": 59.6
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
    "taro": 0.3411,
    "diana": 0.1428,
    "nova": 0.2781,
    "flow": 0.238
   },
   "acc": {
    "taro": {
     "n": 127,
     "acc": 71.7
    },
    "diana": {
     "n": 128,
     "acc": 21.9
    },
    "nova": {
     "n": 101,
     "acc": 58.4
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
    "taro": 0.3272,
    "diana": 0.1309,
    "nova": 0.3237,
    "flow": 0.2182
   },
   "acc": {
    "taro": {
     "n": 89,
     "acc": 82.0
    },
    "diana": {
     "n": 82,
     "acc": 18.3
    },
    "nova": {
     "n": 62,
     "acc": 74.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 233
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2781,
    "diana": 0.1702,
    "nova": 0.254,
    "flow": 0.2978
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 70.0
    },
    "diana": {
     "n": 280,
     "acc": 42.9
    },
    "nova": {
     "n": 197,
     "acc": 64.0
    },
    "flow": {
     "n": 40,
     "acc": 82.5
    }
   },
   "graded": 794
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2693,
    "diana": 0.1722,
    "nova": 0.2909,
    "flow": 0.2676
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 50.3
    },
    "diana": {
     "n": 174,
     "acc": 32.2
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
   "graded": 430
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
    "taro": 0.3431,
    "diana": 0.1531,
    "nova": 0.3468,
    "flow": 0.157
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 67.2
    },
    "diana": {
     "n": 105,
     "acc": 20.0
    },
    "nova": {
     "n": 78,
     "acc": 67.9
    },
    "flow": {
     "n": 39,
     "acc": 30.8
    }
   },
   "graded": 341
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
     "n": 145,
     "acc": 20.0
    },
    "nova": {
     "n": 68,
     "acc": 77.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 315
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
    "taro": 0.1857,
    "diana": 0.1857,
    "nova": 0.3189,
    "flow": 0.3096
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 23.4
    },
    "diana": {
     "n": 120,
     "acc": 27.5
    },
    "nova": {
     "n": 33,
     "acc": 51.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 247
  }
 }
};
