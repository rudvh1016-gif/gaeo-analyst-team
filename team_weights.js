// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-22 11:16",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2853,
   "diana": 0.182,
   "nova": 0.2816,
   "flow": 0.2511
  },
  "acc": {
   "taro": {
    "n": 3763,
    "acc": 61.9
   },
   "diana": {
    "n": 3403,
    "acc": 39.5
   },
   "nova": {
    "n": 2644,
    "acc": 61.1
   },
   "flow": {
    "n": 655,
    "acc": 54.5
   }
  },
  "graded": 10465
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2704,
    "diana": 0.2101,
    "nova": 0.2269,
    "flow": 0.2926
   },
   "acc": {
    "taro": {
     "n": 446,
     "acc": 54.5
    },
    "diana": {
     "n": 291,
     "acc": 42.6
    },
    "nova": {
     "n": 352,
     "acc": 46.0
    },
    "flow": {
     "n": 150,
     "acc": 59.3
    }
   },
   "graded": 1238
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3093,
    "diana": 0.1545,
    "nova": 0.2722,
    "flow": 0.2639
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 74.9
    },
    "diana": {
     "n": 139,
     "acc": 37.4
    },
    "nova": {
     "n": 176,
     "acc": 65.9
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
    "taro": 0.2809,
    "diana": 0.2126,
    "nova": 0.2641,
    "flow": 0.2424
   },
   "acc": {
    "taro": {
     "n": 176,
     "acc": 57.4
    },
    "diana": {
     "n": 171,
     "acc": 43.9
    },
    "nova": {
     "n": 134,
     "acc": 54.5
    },
    "flow": {
     "n": 28,
     "acc": 82.1
    }
   },
   "graded": 508
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
    "taro": 0.2521,
    "diana": 0.2164,
    "nova": 0.2906,
    "flow": 0.2408
   },
   "acc": {
    "taro": {
     "n": 170,
     "acc": 52.4
    },
    "diana": {
     "n": 158,
     "acc": 44.9
    },
    "nova": {
     "n": 117,
     "acc": 59.8
    },
    "flow": {
     "n": 16,
     "acc": 37.5
    }
   },
   "graded": 460
  },
  "금융·증권": {
   "weights": {
    "taro": 0.2808,
    "diana": 0.1965,
    "nova": 0.2591,
    "flow": 0.2636
   },
   "acc": {
    "taro": {
     "n": 211,
     "acc": 55.9
    },
    "diana": {
     "n": 235,
     "acc": 39.1
    },
    "nova": {
     "n": 126,
     "acc": 50.0
    },
    "flow": {
     "n": 80,
     "acc": 52.5
    }
   },
   "graded": 650
  },
  "2차전지": {
   "weights": {
    "taro": 0.2985,
    "diana": 0.2039,
    "nova": 0.2985,
    "flow": 0.199
   },
   "acc": {
    "taro": {
     "n": 198,
     "acc": 82.3
    },
    "diana": {
     "n": 123,
     "acc": 51.2
    },
    "nova": {
     "n": 157,
     "acc": 80.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 478
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2807,
    "diana": 0.2261,
    "nova": 0.3033,
    "flow": 0.19
   },
   "acc": {
    "taro": {
     "n": 469,
     "acc": 65.7
    },
    "diana": {
     "n": 416,
     "acc": 52.9
    },
    "nova": {
     "n": 358,
     "acc": 70.9
    },
    "flow": {
     "n": 63,
     "acc": 44.4
    }
   },
   "graded": 1306
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2963,
    "diana": 0.1914,
    "nova": 0.2755,
    "flow": 0.2368
   },
   "acc": {
    "taro": {
     "n": 219,
     "acc": 62.6
    },
    "diana": {
     "n": 240,
     "acc": 40.4
    },
    "nova": {
     "n": 153,
     "acc": 58.2
    },
    "flow": {
     "n": 18,
     "acc": 44.4
    }
   },
   "graded": 630
  },
  "조선": {
   "weights": {
    "taro": 0.3412,
    "diana": 0.142,
    "nova": 0.2803,
    "flow": 0.2366
   },
   "acc": {
    "taro": {
     "n": 129,
     "acc": 72.1
    },
    "diana": {
     "n": 130,
     "acc": 21.5
    },
    "nova": {
     "n": 103,
     "acc": 59.2
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 372
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3306,
    "diana": 0.1322,
    "nova": 0.3168,
    "flow": 0.2204
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 80.2
    },
    "diana": {
     "n": 84,
     "acc": 20.2
    },
    "nova": {
     "n": 64,
     "acc": 71.9
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 239
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2767,
    "diana": 0.1725,
    "nova": 0.2513,
    "flow": 0.2994
   },
   "acc": {
    "taro": {
     "n": 277,
     "acc": 69.3
    },
    "diana": {
     "n": 280,
     "acc": 43.2
    },
    "nova": {
     "n": 197,
     "acc": 62.9
    },
    "flow": {
     "n": 39,
     "acc": 82.1
    }
   },
   "graded": 794
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.2672,
    "diana": 0.1773,
    "nova": 0.2865,
    "flow": 0.269
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 49.7
    },
    "diana": {
     "n": 176,
     "acc": 33.0
    },
    "nova": {
     "n": 92,
     "acc": 53.3
    },
    "flow": {
     "n": 10,
     "acc": 70.0
    }
   },
   "graded": 433
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2411,
    "diana": 0.2203,
    "nova": 0.2462,
    "flow": 0.2924
   },
   "acc": {
    "taro": {
     "n": 97,
     "acc": 41.2
    },
    "diana": {
     "n": 69,
     "acc": 37.7
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
   "graded": 223
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3438,
    "diana": 0.1528,
    "nova": 0.3506,
    "flow": 0.1528
   },
   "acc": {
    "taro": {
     "n": 120,
     "acc": 67.5
    },
    "diana": {
     "n": 103,
     "acc": 19.4
    },
    "nova": {
     "n": 77,
     "acc": 68.8
    },
    "flow": {
     "n": 38,
     "acc": 28.9
    }
   },
   "graded": 338
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2292,
    "diana": 0.1492,
    "nova": 0.373,
    "flow": 0.2487
   },
   "acc": {
    "taro": {
     "n": 102,
     "acc": 46.1
    },
    "diana": {
     "n": 145,
     "acc": 20.7
    },
    "nova": {
     "n": 68,
     "acc": 76.5
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
    "taro": 0.1947,
    "diana": 0.1947,
    "nova": 0.2863,
    "flow": 0.3244
   },
   "acc": {
    "taro": {
     "n": 93,
     "acc": 22.6
    },
    "diana": {
     "n": 121,
     "acc": 28.9
    },
    "nova": {
     "n": 34,
     "acc": 44.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 248
  }
 }
};
