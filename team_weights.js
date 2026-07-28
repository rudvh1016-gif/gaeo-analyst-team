// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-28 13:42",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2721,
   "diana": 0.2052,
   "nova": 0.2662,
   "flow": 0.2565
  },
  "acc": {
   "taro": {
    "n": 5596,
    "acc": 59.5
   },
   "diana": {
    "n": 5052,
    "acc": 44.9
   },
   "nova": {
    "n": 4207,
    "acc": 58.3
   },
   "flow": {
    "n": 976,
    "acc": 56.1
   }
  },
  "graded": 15831
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2695,
    "diana": 0.1886,
    "nova": 0.2446,
    "flow": 0.2973
   },
   "acc": {
    "taro": {
     "n": 664,
     "acc": 62.0
    },
    "diana": {
     "n": 433,
     "acc": 43.4
    },
    "nova": {
     "n": 570,
     "acc": 56.3
    },
    "flow": {
     "n": 225,
     "acc": 68.4
    }
   },
   "graded": 1892
  },
  "전자·부품": {
   "weights": {
    "taro": 0.2947,
    "diana": 0.1661,
    "nova": 0.2696,
    "flow": 0.2696
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 72.9
    },
    "diana": {
     "n": 207,
     "acc": 41.1
    },
    "nova": {
     "n": 270,
     "acc": 66.7
    },
    "flow": {
     "n": 102,
     "acc": 66.7
    }
   },
   "graded": 907
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2396,
    "diana": 0.2308,
    "nova": 0.2158,
    "flow": 0.3137
   },
   "acc": {
    "taro": {
     "n": 274,
     "acc": 53.3
    },
    "diana": {
     "n": 263,
     "acc": 51.3
    },
    "nova": {
     "n": 225,
     "acc": 48.0
    },
    "flow": {
     "n": 43,
     "acc": 69.8
    }
   },
   "graded": 805
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.33,
    "diana": 0.1737,
    "nova": 0.3192,
    "flow": 0.177
   },
   "acc": {
    "taro": {
     "n": 229,
     "acc": 63.3
    },
    "diana": {
     "n": 240,
     "acc": 33.3
    },
    "nova": {
     "n": 160,
     "acc": 61.3
    },
    "flow": {
     "n": 53,
     "acc": 34.0
    }
   },
   "graded": 682
  },
  "통신": {
   "weights": {
    "taro": 0.2828,
    "diana": 0.2063,
    "nova": 0.2737,
    "flow": 0.2372
   },
   "acc": {
    "taro": {
     "n": 99,
     "acc": 59.6
    },
    "diana": {
     "n": 69,
     "acc": 43.5
    },
    "nova": {
     "n": 78,
     "acc": 57.7
    },
    "flow": {
     "n": 27,
     "acc": 66.7
    }
   },
   "graded": 273
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2483,
    "diana": 0.2619,
    "nova": 0.2513,
    "flow": 0.2385
   },
   "acc": {
    "taro": {
     "n": 244,
     "acc": 52.0
    },
    "diana": {
     "n": 235,
     "acc": 54.9
    },
    "nova": {
     "n": 186,
     "acc": 52.7
    },
    "flow": {
     "n": 24,
     "acc": 58.3
    }
   },
   "graded": 689
  },
  "금융·증권": {
   "weights": {
    "taro": 0.303,
    "diana": 0.1655,
    "nova": 0.3298,
    "flow": 0.2018
   },
   "acc": {
    "taro": {
     "n": 318,
     "acc": 55.7
    },
    "diana": {
     "n": 352,
     "acc": 30.4
    },
    "nova": {
     "n": 208,
     "acc": 60.6
    },
    "flow": {
     "n": 116,
     "acc": 37.1
    }
   },
   "graded": 994
  },
  "2차전지": {
   "weights": {
    "taro": 0.3009,
    "diana": 0.1975,
    "nova": 0.3009,
    "flow": 0.2006
   },
   "acc": {
    "taro": {
     "n": 301,
     "acc": 79.4
    },
    "diana": {
     "n": 193,
     "acc": 49.2
    },
    "nova": {
     "n": 244,
     "acc": 79.9
    },
    "flow": {
     "n": 2,
     "acc": 50.0
    }
   },
   "graded": 740
  },
  "보험": {
   "weights": {
    "taro": 0.2585,
    "diana": 0.2802,
    "nova": 0.2286,
    "flow": 0.2327
   },
   "acc": {
    "taro": {
     "n": 108,
     "acc": 55.6
    },
    "diana": {
     "n": 93,
     "acc": 60.2
    },
    "nova": {
     "n": 57,
     "acc": 49.1
    },
    "flow": {
     "n": 27,
     "acc": 51.9
    }
   },
   "graded": 285
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2657,
    "diana": 0.2283,
    "nova": 0.2776,
    "flow": 0.2284
   },
   "acc": {
    "taro": {
     "n": 714,
     "acc": 63.6
    },
    "diana": {
     "n": 617,
     "acc": 54.6
    },
    "nova": {
     "n": 554,
     "acc": 66.4
    },
    "flow": {
     "n": 97,
     "acc": 54.6
    }
   },
   "graded": 1982
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2755,
    "diana": 0.2267,
    "nova": 0.2587,
    "flow": 0.2391
   },
   "acc": {
    "taro": {
     "n": 328,
     "acc": 57.6
    },
    "diana": {
     "n": 365,
     "acc": 47.4
    },
    "nova": {
     "n": 244,
     "acc": 54.1
    },
    "flow": {
     "n": 29,
     "acc": 34.5
    }
   },
   "graded": 966
  },
  "조선": {
   "weights": {
    "taro": 0.2714,
    "diana": 0.2318,
    "nova": 0.2336,
    "flow": 0.2632
   },
   "acc": {
    "taro": {
     "n": 192,
     "acc": 51.6
    },
    "diana": {
     "n": 193,
     "acc": 44.0
    },
    "nova": {
     "n": 151,
     "acc": 44.4
    },
    "flow": {
     "n": 16,
     "acc": 43.8
    }
   },
   "graded": 552
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3042,
    "diana": 0.1875,
    "nova": 0.2711,
    "flow": 0.2372
   },
   "acc": {
    "taro": {
     "n": 131,
     "acc": 64.1
    },
    "diana": {
     "n": 124,
     "acc": 39.5
    },
    "nova": {
     "n": 98,
     "acc": 57.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 353
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2663,
    "diana": 0.1885,
    "nova": 0.2467,
    "flow": 0.2985
   },
   "acc": {
    "taro": {
     "n": 405,
     "acc": 66.9
    },
    "diana": {
     "n": 416,
     "acc": 47.4
    },
    "nova": {
     "n": 313,
     "acc": 62.0
    },
    "flow": {
     "n": 58,
     "acc": 81.0
    }
   },
   "graded": 1192
  },
  "물류·운송": {
   "weights": {
    "taro": 0.2843,
    "diana": 0.2987,
    "nova": 0.1564,
    "flow": 0.2606
   },
   "acc": {
    "taro": {
     "n": 77,
     "acc": 54.5
    },
    "diana": {
     "n": 82,
     "acc": 57.3
    },
    "nova": {
     "n": 36,
     "acc": 22.2
    },
    "flow": {
     "n": 48,
     "acc": 50.0
    }
   },
   "graded": 243
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.27,
    "diana": 0.1982,
    "nova": 0.2768,
    "flow": 0.2551
   },
   "acc": {
    "taro": {
     "n": 240,
     "acc": 52.9
    },
    "diana": {
     "n": 260,
     "acc": 38.8
    },
    "nova": {
     "n": 153,
     "acc": 54.2
    },
    "flow": {
     "n": 15,
     "acc": 80.0
    }
   },
   "graded": 668
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2397,
    "diana": 0.2286,
    "nova": 0.2433,
    "flow": 0.2884
   },
   "acc": {
    "taro": {
     "n": 142,
     "acc": 41.5
    },
    "diana": {
     "n": 106,
     "acc": 39.6
    },
    "nova": {
     "n": 83,
     "acc": 42.2
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 331
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2968,
    "diana": 0.1877,
    "nova": 0.2836,
    "flow": 0.232
   },
   "acc": {
    "taro": {
     "n": 166,
     "acc": 59.0
    },
    "diana": {
     "n": 150,
     "acc": 37.3
    },
    "nova": {
     "n": 117,
     "acc": 56.4
    },
    "flow": {
     "n": 52,
     "acc": 46.2
    }
   },
   "graded": 485
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2367,
    "diana": 0.1775,
    "nova": 0.3044,
    "flow": 0.2813
   },
   "acc": {
    "taro": {
     "n": 164,
     "acc": 42.1
    },
    "diana": {
     "n": 206,
     "acc": 31.6
    },
    "nova": {
     "n": 122,
     "acc": 54.1
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 492
  },
  "로봇": {
   "weights": {
    "taro": 0.2667,
    "diana": 0.2667,
    "nova": 0.2667,
    "flow": 0.2
   },
   "acc": {
    "taro": {
     "n": 135,
     "acc": 66.7
    },
    "diana": {
     "n": 111,
     "acc": 66.7
    },
    "nova": {
     "n": 114,
     "acc": 66.7
    },
    "flow": {
     "n": 15,
     "acc": 26.7
    }
   },
   "graded": 375
  },
  "식음료": {
   "weights": {
    "taro": 0.192,
    "diana": 0.2975,
    "nova": 0.1974,
    "flow": 0.3132
   },
   "acc": {
    "taro": {
     "n": 124,
     "acc": 30.6
    },
    "diana": {
     "n": 179,
     "acc": 47.5
    },
    "nova": {
     "n": 73,
     "acc": 31.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 376
  },
  "여행레저": {
   "weights": {
    "taro": 0.3032,
    "diana": 0.1544,
    "nova": 0.285,
    "flow": 0.2574
   },
   "acc": {
    "taro": {
     "n": 73,
     "acc": 58.9
    },
    "diana": {
     "n": 61,
     "acc": 23.0
    },
    "nova": {
     "n": 56,
     "acc": 55.4
    },
    "flow": {
     "n": 27,
     "acc": 25.9
    }
   },
   "graded": 217
  }
 }
};
