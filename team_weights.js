// 자동 생성: compute_team_weights.py · 자가 학습 CHIEF 가중치
// 분석가 역할에 맞는 기간(TARO·QUANT·FLOW 5일, DIANA 20일)으로 채점하고,
// 작은 표본은 50%로 축소해 우연한 적중률 급등락을 억제한다.
// 2026-08-31부터 채점 기준은 '시장 중앙값 대비 초과수익'이다 — 시장이 통째로
// 오른 날 방향만 맞춘 것을 실력으로 세지 않기 위해서다(global.scoring 참고).
// analyze_auto.py(CHIEF)와 index.html(리더보드 가중치 표시)이 읽는다.
const TEAM_WEIGHTS = {
 "generatedAt": "2026-09-04 09:11",
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
   "taro": 0.3111,
   "diana": 0.1165,
   "nova": 0.2359,
   "flow": 0.3365
  },
  "acc": {
   "taro": {
    "n": 3920,
    "acc": 52.3,
    "adjustedAcc": 52.2,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 47.4,
    "absoluteN": 4029
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
    "n": 865,
    "acc": 44.6,
    "adjustedAcc": 45.3,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 46.6,
    "absoluteN": 903
   },
   "flow": {
    "n": 690,
    "acc": 55.7,
    "adjustedAcc": 54.8,
    "days": 5,
    "deadband": 1.0,
    "absoluteAcc": 48.4,
    "absoluteN": 702
   }
  },
  "graded": 5475,
  "team": {
   "basis": "absolute_return",
   "hit": 3625,
   "miss": 2157,
   "n": 5782,
   "uniqueDecisionDays": 10,
   "minDaysForConclusion": 20,
   "acc": 62.7
  }
 },
 "sectors": {
  "반도체": {
   "weights": {
    "taro": 0.2861,
    "diana": 0.118,
    "nova": 0.2774,
    "flow": 0.3186
   },
   "acc": {
    "taro": {
     "n": 393,
     "acc": 42.2,
     "adjustedAcc": 44.1,
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
     "n": 94,
     "acc": 63.8,
     "adjustedAcc": 56.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 81,
     "acc": 48.1,
     "adjustedAcc": 49.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 568,
   "globalBlend": 0.585
  },
  "전자·부품": {
   "weights": {
    "taro": 0.3055,
    "diana": 0.1185,
    "nova": 0.242,
    "flow": 0.334
   },
   "acc": {
    "taro": {
     "n": 193,
     "acc": 46.6,
     "adjustedAcc": 47.9,
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
     "n": 40,
     "acc": 35.0,
     "adjustedAcc": 46.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 69,
     "acc": 55.1,
     "adjustedAcc": 51.9,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 302,
   "globalBlend": 0.726
  },
  "전력·에너지": {
   "weights": {
    "taro": 0.3044,
    "diana": 0.1181,
    "nova": 0.2451,
    "flow": 0.3324
   },
   "acc": {
    "taro": {
     "n": 208,
     "acc": 46.6,
     "adjustedAcc": 47.9,
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
     "n": 36,
     "acc": 41.7,
     "adjustedAcc": 48.1,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 58,
     "acc": 55.2,
     "adjustedAcc": 51.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 302,
   "globalBlend": 0.726
  },
  "자동차·부품": {
   "weights": {
    "taro": 0.2974,
    "diana": 0.1161,
    "nova": 0.2551,
    "flow": 0.3315
   },
   "acc": {
    "taro": {
     "n": 155,
     "acc": 41.3,
     "adjustedAcc": 45.1,
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
     "acc": 81.2,
     "adjustedAcc": 56.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 31,
     "acc": 64.5,
     "adjustedAcc": 53.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 218,
   "globalBlend": 0.786
  },
  "금융·증권": {
   "weights": {
    "taro": 0.3129,
    "diana": 0.1163,
    "nova": 0.2419,
    "flow": 0.3288
   },
   "acc": {
    "taro": {
     "n": 207,
     "acc": 55.1,
     "adjustedAcc": 53.2,
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
     "n": 5,
     "acc": 20.0,
     "adjustedAcc": 48.8,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 48,
     "acc": 56.2,
     "adjustedAcc": 51.8,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 260,
   "globalBlend": 0.755
  },
  "2차전지": {
   "weights": {
    "taro": 0.3177,
    "diana": 0.1156,
    "nova": 0.2467,
    "flow": 0.32
   },
   "acc": {
    "taro": {
     "n": 187,
     "acc": 60.4,
     "adjustedAcc": 56.4,
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
     "n": 34,
     "acc": 61.8,
     "adjustedAcc": 52.6,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 10,
     "acc": 20.0,
     "adjustedAcc": 47.7,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 231,
   "globalBlend": 0.776
  },
  "바이오·제약": {
   "weights": {
    "taro": 0.3125,
    "diana": 0.1165,
    "nova": 0.2211,
    "flow": 0.35
   },
   "acc": {
    "taro": {
     "n": 489,
     "acc": 53.2,
     "adjustedAcc": 52.5,
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
     "n": 185,
     "acc": 34.6,
     "adjustedAcc": 40.7,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 73,
     "acc": 69.9,
     "adjustedAcc": 57.5,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 747,
   "globalBlend": 0.517
  },
  "지주·상사": {
   "weights": {
    "taro": 0.3222,
    "diana": 0.1177,
    "nova": 0.2341,
    "flow": 0.326
   },
   "acc": {
    "taro": {
     "n": 256,
     "acc": 57.0,
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
     "n": 65,
     "acc": 30.8,
     "adjustedAcc": 43.2,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 22,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 343,
   "globalBlend": 0.7
  },
  "화학·소재": {
   "weights": {
    "taro": 0.3156,
    "diana": 0.1174,
    "nova": 0.2491,
    "flow": 0.3179
   },
   "acc": {
    "taro": {
     "n": 309,
     "acc": 54.0,
     "adjustedAcc": 52.9,
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
     "n": 14,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 36,
     "acc": 38.9,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 359,
   "globalBlend": 0.69
  },
  "유통·소비재": {
   "weights": {
    "taro": 0.3113,
    "diana": 0.118,
    "nova": 0.2472,
    "flow": 0.3235
   },
   "acc": {
    "taro": {
     "n": 185,
     "acc": 50.8,
     "adjustedAcc": 50.5,
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
     "n": 47,
     "acc": 48.9,
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
   "graded": 244,
   "globalBlend": 0.766
  },
  "건설·건자재": {
   "weights": {
    "taro": 0.3232,
    "diana": 0.1166,
    "nova": 0.2376,
    "flow": 0.3227
   },
   "acc": {
    "taro": {
     "n": 136,
     "acc": 64.7,
     "adjustedAcc": 57.8,
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
     "n": 42,
     "acc": 35.7,
     "adjustedAcc": 46.3,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 32,
     "acc": 37.5,
     "adjustedAcc": 47.4,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 210,
   "globalBlend": 0.792
  },
  "게임·엔터": {
   "weights": {
    "taro": 0.3132,
    "diana": 0.1154,
    "nova": 0.2413,
    "flow": 0.3301
   },
   "acc": {
    "taro": {
     "n": 107,
     "acc": 59.8,
     "adjustedAcc": 54.6,
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
     "n": 104,
     "acc": 50.0,
     "adjustedAcc": 50.0,
     "days": 5,
     "deadband": 1.0
    },
    "flow": {
     "n": 17,
     "acc": 76.5,
     "adjustedAcc": 53.3,
     "days": 5,
     "deadband": 1.0
    }
   },
   "graded": 228,
   "globalBlend": 0.778
  }
 }
};
