// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-08-04 01:16",
 "evalDays": 5,
 "horizons": {
  "taro": {
   "days": 5,
   "deadband": 1.0
  },
  "diana": {
   "days": 20,
   "deadband": 3.0
  },
  "nova": {
   "days": 5,
   "deadband": 1.0
  },
  "flow": {
   "days": 5,
   "deadband": 1.0
  }
 },
 "method": "role-prior-bayesian-shrinkage-v2",
 "global": {
  "weights": {
   "taro": 0.3484,
   "diana": 0.0711,
   "nova": 0.2923,
   "flow": 0.2882
  },
  "acc": {
   "taro": {
    "n": 7071,
    "acc": 61.9,
    "adjustedAcc": 61.7,
    "days": 5,
    "deadband": 1.0
   },
   "diana": {
    "n": 944,
    "acc": 37.9,
    "adjustedAcc": 39.3,
    "days": 20,
    "deadband": 3.0
   },
   "nova": {
    "n": 5749,
    "acc": 58.4,
    "adjustedAcc": 58.2,
    "days": 5,
    "deadband": 1.0
   },
   "flow": {
    "n": 1228,
    "acc": 55.9,
    "adjustedAcc": 55.4,
    "days": 5,
    "deadband": 1.0
   }
  },
  "graded": 14992,
  "team": {
   "hit": 5597,
   "miss": 1344,
   "n": 6941,
   "acc": 80.6
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.3628,
    "diana": 0.076,
    "nova": 0.2322,
    "flow": 0.3289
   },
   "acc": {
    "taro": {
     "n": 860,
     "acc": 69.0,
     "adjustedAcc": 66.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 87,
     "acc": 39.1,
     "adjustedAcc": 45.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 745,
     "acc": 49.8,
     "adjustedAcc": 49.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 274,
     "acc": 70.8,
     "adjustedAcc": 64.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1966,
   "globalBlend": 0.289
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3755,
    "diana": 0.0726,
    "nova": 0.2695,
    "flow": 0.2824
   },
   "acc": {
    "taro": {
     "n": 422,
     "acc": 77.7,
     "adjustedAcc": 71.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 41,
     "acc": 34.1,
     "adjustedAcc": 46.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 353,
     "acc": 61.2,
     "adjustedAcc": 58.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 122,
     "acc": 68.9,
     "adjustedAcc": 59.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 938,
   "globalBlend": 0.46
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3298,
    "diana": 0.0883,
    "nova": 0.292,
    "flow": 0.2898
   },
   "acc": {
    "taro": {
     "n": 353,
     "acc": 54.7,
     "adjustedAcc": 53.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 46,
     "acc": 43.5,
     "adjustedAcc": 48.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 314,
     "acc": 55.1,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 63,
     "acc": 54.0,
     "adjustedAcc": 51.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 776,
   "globalBlend": 0.508
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3509,
    "diana": 0.0759,
    "nova": 0.3126,
    "flow": 0.2605
   },
   "acc": {
    "taro": {
     "n": 280,
     "acc": 62.5,
     "adjustedAcc": 58.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 15.6,
     "adjustedAcc": 40.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 224,
     "acc": 64.7,
     "adjustedAcc": 59.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 66,
     "acc": 31.8,
     "adjustedAcc": 43.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 615,
   "globalBlend": 0.565
  },
  "통신": {
   "weights": {
    "taro": 0.3377,
    "diana": 0.0799,
    "nova": 0.2903,
    "flow": 0.2921
   },
   "acc": {
    "taro": {
     "n": 130,
     "acc": 60.0,
     "adjustedAcc": 55.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 13,
     "acc": 46.2,
     "adjustedAcc": 49.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 104,
     "acc": 60.6,
     "adjustedAcc": 54.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 41,
     "acc": 68.3,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 288,
   "globalBlend": 0.735
  },
  "인터넷·IT": {
   "weights": {
    "taro": 0.3174,
    "diana": 0.0932,
    "nova": 0.2975,
    "flow": 0.2919
   },
   "acc": {
    "taro": {
     "n": 312,
     "acc": 50.3,
     "adjustedAcc": 50.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 37,
     "acc": 62.2,
     "adjustedAcc": 52.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 259,
     "acc": 57.9,
     "adjustedAcc": 55.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 60.6,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 641,
   "globalBlend": 0.555
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3566,
    "diana": 0.0794,
    "nova": 0.3034,
    "flow": 0.2606
   },
   "acc": {
    "taro": {
     "n": 406,
     "acc": 59.6,
     "adjustedAcc": 57.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 64,
     "acc": 21.9,
     "adjustedAcc": 40.2,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 293,
     "acc": 56.7,
     "adjustedAcc": 54.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 120,
     "acc": 35.8,
     "adjustedAcc": 42.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 883,
   "globalBlend": 0.475
  },
  "2차전지": {
   "weights": {
    "taro": 0.3825,
    "diana": 0.0756,
    "nova": 0.2972,
    "flow": 0.2446
   },
   "acc": {
    "taro": {
     "n": 382,
     "acc": 83.0,
     "adjustedAcc": 75.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 40,
     "acc": 52.5,
     "adjustedAcc": 50.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 316,
     "acc": 72.8,
     "adjustedAcc": 66.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 2,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 740,
   "globalBlend": 0.519
  },
  "보험": {
   "weights": {
    "taro": 0.3371,
    "diana": 0.0847,
    "nova": 0.2917,
    "flow": 0.2865
   },
   "acc": {
    "taro": {
     "n": 139,
     "acc": 53.2,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 19,
     "acc": 63.2,
     "adjustedAcc": 51.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 96,
     "acc": 55.2,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 45.5,
     "adjustedAcc": 49.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 287,
   "globalBlend": 0.736
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3518,
    "diana": 0.0904,
    "nova": 0.2906,
    "flow": 0.2672
   },
   "acc": {
    "taro": {
     "n": 895,
     "acc": 66.6,
     "adjustedAcc": 64.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 125,
     "acc": 55.2,
     "adjustedAcc": 52.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 750,
     "acc": 62.0,
     "adjustedAcc": 60.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 118,
     "acc": 58.5,
     "adjustedAcc": 54.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1888,
   "globalBlend": 0.298
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3397,
    "diana": 0.0842,
    "nova": 0.3139,
    "flow": 0.2622
   },
   "acc": {
    "taro": {
     "n": 407,
     "acc": 57.7,
     "adjustedAcc": 56.0,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 65,
     "acc": 36.9,
     "adjustedAcc": 45.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 336,
     "acc": 61.6,
     "adjustedAcc": 58.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 27.8,
     "adjustedAcc": 44.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 844,
   "globalBlend": 0.487
  },
  "조선": {
   "weights": {
    "taro": 0.3389,
    "diana": 0.0758,
    "nova": 0.2944,
    "flow": 0.2908
   },
   "acc": {
    "taro": {
     "n": 234,
     "acc": 54.7,
     "adjustedAcc": 53.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 39,
     "acc": 2.6,
     "adjustedAcc": 38.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 205,
     "acc": 54.1,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 32,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 510,
   "globalBlend": 0.611
  },
  "철강·금속": {
   "weights": {
    "taro": 0.3443,
    "diana": 0.0782,
    "nova": 0.2944,
    "flow": 0.2831
   },
   "acc": {
    "taro": {
     "n": 148,
     "acc": 62.8,
     "adjustedAcc": 57.1,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 29.2,
     "adjustedAcc": 46.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 127,
     "acc": 61.4,
     "adjustedAcc": 55.9,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 299,
   "globalBlend": 0.728
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3394,
    "diana": 0.0732,
    "nova": 0.2888,
    "flow": 0.2986
   },
   "acc": {
    "taro": {
     "n": 516,
     "acc": 66.3,
     "adjustedAcc": 63.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 80,
     "acc": 35.0,
     "adjustedAcc": 44.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 434,
     "acc": 63.4,
     "adjustedAcc": 60.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 72,
     "acc": 77.8,
     "adjustedAcc": 60.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 1102,
   "globalBlend": 0.421
  },
  "물류·운송": {
   "weights": {
    "taro": 0.3384,
    "diana": 0.0828,
    "nova": 0.2878,
    "flow": 0.291
   },
   "acc": {
    "taro": {
     "n": 95,
     "acc": 48.4,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 13,
     "acc": 53.8,
     "adjustedAcc": 50.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 55,
     "acc": 43.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 59,
     "acc": 47.5,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 222,
   "globalBlend": 0.783
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3299,
    "diana": 0.0811,
    "nova": 0.2919,
    "flow": 0.2971
   },
   "acc": {
    "taro": {
     "n": 305,
     "acc": 54.4,
     "adjustedAcc": 53.2,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 45,
     "acc": 31.1,
     "adjustedAcc": 44.8,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 217,
     "acc": 56.2,
     "adjustedAcc": 54.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 16,
     "acc": 81.2,
     "adjustedAcc": 53.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 583,
   "globalBlend": 0.578
  },
  "화장품·미용": {
   "weights": {
    "taro": 0.3356,
    "diana": 0.0859,
    "nova": 0.2827,
    "flow": 0.2958
   },
   "acc": {
    "taro": {
     "n": 183,
     "acc": 47.5,
     "adjustedAcc": 48.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 22,
     "acc": 40.9,
     "adjustedAcc": 48.6,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 122,
     "acc": 41.0,
     "adjustedAcc": 45.5,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 1,
     "acc": 0.0,
     "adjustedAcc": 49.6,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 328,
   "globalBlend": 0.709
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3474,
    "diana": 0.0779,
    "nova": 0.305,
    "flow": 0.2697
   },
   "acc": {
    "taro": {
     "n": 212,
     "acc": 59.9,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 9.7,
     "adjustedAcc": 41.7,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 164,
     "acc": 61.6,
     "adjustedAcc": 56.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 71,
     "acc": 33.8,
     "adjustedAcc": 44.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 478,
   "globalBlend": 0.626
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3252,
    "diana": 0.0783,
    "nova": 0.3,
    "flow": 0.2965
   },
   "acc": {
    "taro": {
     "n": 202,
     "acc": 44.6,
     "adjustedAcc": 46.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 31,
     "acc": 3.2,
     "adjustedAcc": 40.4,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 167,
     "acc": 55.1,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 1,
     "acc": 100.0,
     "adjustedAcc": 50.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 401,
   "globalBlend": 0.666
  },
  "로봇": {
   "weights": {
    "taro": 0.3419,
    "diana": 0.0874,
    "nova": 0.2973,
    "flow": 0.2733
   },
   "acc": {
    "taro": {
     "n": 169,
     "acc": 68.0,
     "adjustedAcc": 60.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 24,
     "acc": 100.0,
     "adjustedAcc": 58.3,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 145,
     "acc": 69.7,
     "adjustedAcc": 60.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 51.5,
     "adjustedAcc": 50.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 371,
   "globalBlend": 0.683
  },
  "식음료": {
   "weights": {
    "taro": 0.3219,
    "diana": 0.0922,
    "nova": 0.2858,
    "flow": 0.3001
   },
   "acc": {
    "taro": {
     "n": 159,
     "acc": 33.3,
     "adjustedAcc": 40.5,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 21,
     "acc": 76.2,
     "adjustedAcc": 53.9,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 115,
     "acc": 40.0,
     "adjustedAcc": 45.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 295,
   "globalBlend": 0.731
  },
  "여행레저": {
   "weights": {
    "taro": 0.3495,
    "diana": 0.0771,
    "nova": 0.2924,
    "flow": 0.281
   },
   "acc": {
    "taro": {
     "n": 91,
     "acc": 65.9,
     "adjustedAcc": 56.9,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 12,
     "acc": 0.0,
     "adjustedAcc": 45.5,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 73,
     "acc": 57.5,
     "adjustedAcc": 52.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 31,
     "acc": 29.0,
     "adjustedAcc": 45.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 207,
   "globalBlend": 0.794
  }
 }
};
