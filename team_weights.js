// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// history.js 채점 기록(판단 후 5거래일 뒤 종가)으로 분석가별 적중률을 집계해,
// 잘 맞는 분석가에게 더 큰 합산 가중치를 준다. analyze_auto.py(CHIEF)와
// index.html(리더보드 가중치 표시)이 읽는다. 없으면 균등(25%씩) 가중치로 동작.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-07-24 09:14",
 "evalDays": 5,
 "global": {
  "weights": {
   "taro": 0.2768,
   "diana": 0.198,
   "nova": 0.2722,
   "flow": 0.253
  },
  "acc": {
   "taro": {
    "n": 4827,
    "acc": 59.9
   },
   "diana": {
    "n": 4361,
    "acc": 42.8
   },
   "nova": {
    "n": 3372,
    "acc": 58.9
   },
   "flow": {
    "n": 859,
    "acc": 54.7
   }
  },
  "graded": 13419
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.1992,
    "nova": 0.2288,
    "flow": 0.2992
   },
   "acc": {
    "taro": {
     "n": 572,
     "acc": 58.6
    },
    "diana": {
     "n": 374,
     "acc": 42.8
    },
    "nova": {
     "n": 466,
     "acc": 49.1
    },
    "flow": {
     "n": 193,
     "acc": 64.2
    }
   },
   "graded": 1605
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3017,
    "diana": 0.16,
    "nova": 0.2714,
    "flow": 0.2669
   },
   "acc": {
    "taro": {
     "n": 278,
     "acc": 74.1
    },
    "diana": {
     "n": 173,
     "acc": 39.3
    },
    "nova": {
     "n": 216,
     "acc": 66.7
    },
    "flow": {
     "n": 90,
     "acc": 65.6
    }
   },
   "graded": 757
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.2298,
    "diana": 0.2269,
    "nova": 0.2031,
    "flow": 0.3403
   },
   "acc": {
    "taro": {
     "n": 233,
     "acc": 50.6
    },
    "diana": {
     "n": 224,
     "acc": 50.0
    },
    "nova": {
     "n": 181,
     "acc": 44.8
    },
    "flow": {
     "n": 37,
     "acc": 75.7
    }
   },
   "graded": 675
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3341,
    "diana": 0.1822,
    "nova": 0.3022,
    "flow": 0.1815
   },
   "acc": {
    "taro": {
     "n": 197,
     "acc": 65.0
    },
    "diana": {
     "n": 206,
     "acc": 35.4
    },
    "nova": {
     "n": 131,
     "acc": 58.8
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
    "taro": 0.281,
    "diana": 0.2035,
    "nova": 0.2697,
    "flow": 0.2459
   },
   "acc": {
    "taro": {
     "n": 84,
     "acc": 57.1
    },
    "diana": {
     "n": 58,
     "acc": 41.4
    },
    "nova": {
     "n": 62,
     "acc": 54.8
    },
    "flow": {
     "n": 22,
     "acc": 68.2
    }
   },
   "graded": 226
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.2491,
    "diana": 0.2606,
    "nova": 0.2543,
    "flow": 0.2359
   },
   "acc": {
    "taro": {
     "n": 214,
     "acc": 52.8
    },
    "diana": {
     "n": 210,
     "acc": 55.2
    },
    "nova": {
     "n": 154,
     "acc": 53.9
    },
    "flow": {
     "n": 22,
     "acc": 54.5
    }
   },
   "graded": 600
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3017,
    "diana": 0.1654,
    "nova": 0.3255,
    "flow": 0.2074
   },
   "acc": {
    "taro": {
     "n": 276,
     "acc": 54.7
    },
    "diana": {
     "n": 307,
     "acc": 29.0
    },
    "nova": {
     "n": 166,
     "acc": 59.0
    },
    "flow": {
     "n": 109,
     "acc": 37.6
    }
   },
   "graded": 858
  },
  "2차전지": {
   "weights": {
    "taro": 0.3022,
    "diana": 0.194,
    "nova": 0.3022,
    "flow": 0.2015
   },
   "acc": {
    "taro": {
     "n": 247,
     "acc": 80.2
    },
    "diana": {
     "n": 162,
     "acc": 48.1
    },
    "nova": {
     "n": 189,
     "acc": 80.4
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 598
  },
  "보험": {
   "weights": {
    "taro": 0.26,
    "diana": 0.2495,
    "nova": 0.2554,
    "flow": 0.235
   },
   "acc": {
    "taro": {
     "n": 94,
     "acc": 55.3
    },
    "diana": {
     "n": 81,
     "acc": 53.1
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
   "graded": 245
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.2727,
    "diana": 0.2258,
    "nova": 0.2931,
    "flow": 0.2084
   },
   "acc": {
    "taro": {
     "n": 612,
     "acc": 66.2
    },
    "diana": {
     "n": 531,
     "acc": 54.8
    },
    "nova": {
     "n": 447,
     "acc": 71.1
    },
    "flow": {
     "n": 85,
     "acc": 50.6
    }
   },
   "graded": 1675
  },
  "지주·상사": {
   "weights": {
    "taro": 0.2826,
    "diana": 0.2201,
    "nova": 0.2603,
    "flow": 0.2369
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 59.6
    },
    "diana": {
     "n": 310,
     "acc": 46.5
    },
    "nova": {
     "n": 193,
     "acc": 54.9
    },
    "flow": {
     "n": 24,
     "acc": 37.5
    }
   },
   "graded": 807
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
    "taro": 0.3179,
    "diana": 0.1579,
    "nova": 0.2938,
    "flow": 0.2304
   },
   "acc": {
    "taro": {
     "n": 116,
     "acc": 69.0
    },
    "diana": {
     "n": 108,
     "acc": 34.3
    },
    "nova": {
     "n": 80,
     "acc": 63.7
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 304
  },
  "화학·소재": {
   "weights": {
    "taro": 0.2697,
    "diana": 0.1852,
    "nova": 0.2474,
    "flow": 0.2976
   },
   "acc": {
    "taro": {
     "n": 356,
     "acc": 68.0
    },
    "diana": {
     "n": 362,
     "acc": 46.7
    },
    "nova": {
     "n": 255,
     "acc": 62.4
    },
    "flow": {
     "n": 52,
     "acc": 76.9
    }
   },
   "graded": 1025
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
    "taro": 0.2691,
    "diana": 0.1899,
    "nova": 0.2783,
    "flow": 0.2626
   },
   "acc": {
    "taro": {
     "n": 203,
     "acc": 51.2
    },
    "diana": {
     "n": 224,
     "acc": 36.2
    },
    "nova": {
     "n": 117,
     "acc": 53.0
    },
    "flow": {
     "n": 11,
     "acc": 81.8
    }
   },
   "graded": 555
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.2284,
    "diana": 0.1928,
    "nova": 0.2718,
    "flow": 0.307
   },
   "acc": {
    "taro": {
     "n": 121,
     "acc": 37.2
    },
    "diana": {
     "n": 86,
     "acc": 31.4
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
   "graded": 268
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.2962,
    "diana": 0.1798,
    "nova": 0.2864,
    "flow": 0.2376
   },
   "acc": {
    "taro": {
     "n": 150,
     "acc": 57.3
    },
    "diana": {
     "n": 135,
     "acc": 34.8
    },
    "nova": {
     "n": 101,
     "acc": 55.4
    },
    "flow": {
     "n": 50,
     "acc": 46.0
    }
   },
   "graded": 436
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.2483,
    "diana": 0.1479,
    "nova": 0.3574,
    "flow": 0.2464
   },
   "acc": {
    "taro": {
     "n": 133,
     "acc": 50.4
    },
    "diana": {
     "n": 177,
     "acc": 22.0
    },
    "nova": {
     "n": 91,
     "acc": 72.5
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 401
  },
  "로봇": {
   "weights": {
    "taro": 0.2702,
    "diana": 0.2593,
    "nova": 0.2644,
    "flow": 0.2061
   },
   "acc": {
    "taro": {
     "n": 119,
     "acc": 65.5
    },
    "diana": {
     "n": 97,
     "acc": 62.9
    },
    "nova": {
     "n": 92,
     "acc": 64.1
    },
    "flow": {
     "n": 12,
     "acc": 41.7
    }
   },
   "graded": 320
  },
  "식음료": {
   "weights": {
    "taro": 0.1882,
    "diana": 0.237,
    "nova": 0.2682,
    "flow": 0.3065
   },
   "acc": {
    "taro": {
     "n": 114,
     "acc": 30.7
    },
    "diana": {
     "n": 150,
     "acc": 38.7
    },
    "nova": {
     "n": 48,
     "acc": 43.8
    },
    "flow": {
     "n": 0,
     "acc": null
    }
   },
   "graded": 312
  }
 }
};
