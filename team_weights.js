// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-03 15:12",
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
 "method": "role-prior-bayesian-shrinkage-v3-market-relative",
 "scoring": {
  "basis": "market_relative_excess",
  "benchmark": "cross_sectional_median_of_covered_universe",
  "benchmarkMinCodes": 30,
  "fallbackToAbsoluteN": 0,
  "since": "2026-08-31",
  "note": "분석가 채점만 시장 대비로 바꿨다. 팀 적중률(team.acc)은 사용자에게 계속 같은 뜻으로 보여야 하므로 절대 기준을 유지한다."
 },
 "global": {
  "version": "tw-2026-08-31-market-relative",
  "weights": {
   "taro": 0.313,
   "diana": 0.1173,
   "nova": 0.2344,
   "flow": 0.3352
  },
  "acc": {
   "taro": {
    "n": 3540,
    "acc": 52.2,
    "adjustedAcc": 52.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.9,
    "absoluteN": 3638
   },
   "diana": {
    "n": 0,
    "acc": null,
    "adjustedAcc": 50.0,
    "days": 20,
    "deadband": 3.0,
    "absoluteAcc": null,
    "absoluteN": 0
   },
   "nova": {
    "n": 779,
    "acc": 44.0,
    "adjustedAcc": 44.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.3,
    "absoluteN": 816
   },
   "flow": {
    "n": 633,
    "acc": 55.3,
    "adjustedAcc": 54.4,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.5,
    "absoluteN": 648
   }
  },
  "graded": 4952,
  "team": {
   "basis": "absolute_return",
   "hit": 3230,
   "miss": 1975,
   "n": 5205,
   "uniqueDecisionDays": 9,
   "minDaysForConclusion": 20,
   "acc": 62.1
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2876,
    "diana": 0.1187,
    "nova": 0.2745,
    "flow": 0.3192
   },
   "acc": {
    "taro": {
     "n": 366,
     "acc": 41.5,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 90,
     "acc": 63.3,
     "adjustedAcc": 55.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 77,
     "acc": 48.1,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 533,
   "globalBlend": 0.6
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3078,
    "diana": 0.1185,
    "nova": 0.2394,
    "flow": 0.3342
   },
   "acc": {
    "taro": {
     "n": 172,
     "acc": 47.7,
     "adjustedAcc": 48.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 38,
     "acc": 34.2,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 62,
     "acc": 58.1,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 272,
   "globalBlend": 0.746
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3098,
    "diana": 0.1183,
    "nova": 0.2426,
    "flow": 0.3292
   },
   "acc": {
    "taro": {
     "n": 184,
     "acc": 49.5,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 32,
     "acc": 40.6,
     "adjustedAcc": 48.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 53,
     "acc": 52.8,
     "adjustedAcc": 50.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 269,
   "globalBlend": 0.748
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.3004,
    "diana": 0.1166,
    "nova": 0.2518,
    "flow": 0.3313
   },
   "acc": {
    "taro": {
     "n": 141,
     "acc": 41.8,
     "adjustedAcc": 45.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 31,
     "acc": 80.6,
     "adjustedAcc": 56.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 28,
     "acc": 67.9,
     "adjustedAcc": 53.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 200,
   "globalBlend": 0.8
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3107,
    "diana": 0.1175,
    "nova": 0.2421,
    "flow": 0.3297
   },
   "acc": {
    "taro": {
     "n": 178,
     "acc": 51.1,
     "adjustedAcc": 50.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 4,
     "acc": 25.0,
     "adjustedAcc": 49.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 43,
     "acc": 55.8,
     "adjustedAcc": 51.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 225,
   "globalBlend": 0.78
  },
  "2차전지": {
   "weights": {
    "taro": 0.3196,
    "diana": 0.1158,
    "nova": 0.2443,
    "flow": 0.3202
   },
   "acc": {
    "taro": {
     "n": 168,
     "acc": 63.1,
     "adjustedAcc": 57.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 32,
     "acc": 65.6,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 6,
     "acc": 16.7,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 206,
   "globalBlend": 0.795
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3151,
    "diana": 0.1173,
    "nova": 0.219,
    "flow": 0.3486
   },
   "acc": {
    "taro": {
     "n": 440,
     "acc": 53.4,
     "adjustedAcc": 52.7,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 160,
     "acc": 31.9,
     "adjustedAcc": 39.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 65,
     "acc": 70.8,
     "adjustedAcc": 57.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 665,
   "globalBlend": 0.546
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3225,
    "diana": 0.1185,
    "nova": 0.2343,
    "flow": 0.3246
   },
   "acc": {
    "taro": {
     "n": 235,
     "acc": 56.6,
     "adjustedAcc": 54.4,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 59,
     "acc": 30.5,
     "adjustedAcc": 43.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 20,
     "acc": 45.0,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 314,
   "globalBlend": 0.718
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3158,
    "diana": 0.1182,
    "nova": 0.2477,
    "flow": 0.3183
   },
   "acc": {
    "taro": {
     "n": 272,
     "acc": 53.3,
     "adjustedAcc": 52.3,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 12,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 33,
     "acc": 36.4,
     "adjustedAcc": 47.1,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 317,
   "globalBlend": 0.716
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3143,
    "diana": 0.1183,
    "nova": 0.2446,
    "flow": 0.3228
   },
   "acc": {
    "taro": {
     "n": 167,
     "acc": 52.7,
     "adjustedAcc": 51.6,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 43,
     "acc": 48.8,
     "adjustedAcc": 49.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 12,
     "acc": 16.7,
     "adjustedAcc": 47.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 222,
   "globalBlend": 0.783
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3158,
    "diana": 0.1164,
    "nova": 0.238,
    "flow": 0.3297
   },
   "acc": {
    "taro": {
     "n": 101,
     "acc": 60.4,
     "adjustedAcc": 54.8,
     "days": 5,
     "deadband": 1.0
    },
    "diana": {
     "n": 0,
     "acc": null,
     "adjustedAcc": 50.0,
     "days": 20,
     "deadband": 3.0
    },
    "nova": {
     "n": 95,
     "acc": 46.3,
     "adjustedAcc": 48.4,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 16,
     "acc": 75.0,
     "adjustedAcc": 52.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 212,
   "globalBlend": 0.791
  }
 }
};
