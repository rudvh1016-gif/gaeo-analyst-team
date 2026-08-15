#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OpenDART 일일 호출 예산 — 설정을 한 곳에 모은다.

⚠️ 10,000건을 다 쓰는 설계는 실패다.
   목표는 하루 수백 회 수준이다. 아래 상한은 사고를 막는 안전장치일 뿐,
   평상시 도달할 값이 아니다.

⚠️ 이 숫자들은 **이 계정 기준으로 사용자가 확인해 준 값**이다.
   공식 정책이 바뀌면 여기 한 곳만 고친다. 코드 곳곳에 흩뿌리지 않는다.
"""
import datetime
import json
import os

import dart_time

# ── 설정 (한 곳에서만 관리) ─────────────────────────────────────────────────
# 계정 기준 일일 안전 상한. 사용자 확인값(2026-08-15).
DAILY_HARD_LIMIT = 10000

# 이 선을 넘으면 '필수가 아닌' 요청(상세·재무)을 먼저 중단한다.
# 신규공시 목록 탐지는 계속한다 — 그걸 멈추면 그날 공시를 통째로 놓친다.
SOFT_BUDGET = 8000

# 평상시 목표. 이 값을 크게 넘으면 설계가 잘못된 것이다.
NORMAL_TARGET_PER_DAY = 500

# 요청 종류별 우선순위. 예산이 빠듯하면 낮은 것부터 끊는다.
ESSENTIAL = ("list", "mapping")           # 이걸 멈추면 수집 자체가 무의미
OPTIONAL = ("detail", "financial")        # 나중에 다시 받아도 되는 것

BUDGET_OK = "BUDGET_OK"
DART_BUDGET_WARNING = "DART_BUDGET_WARNING"
DART_BUDGET_EXCEEDED = "DART_BUDGET_EXCEEDED"


class DailyBudget:
    """하루 누적 호출 수를 파일로 이어서 센다(Runner가 매번 새로 뜨므로).

    날짜 기준은 Asia/Seoul이다. UTC 자정에 리셋되면 한국 장중에 카운터가
    끊겨서 실제 사용량을 못 본다.
    """

    def __init__(self, path, hard_limit=DAILY_HARD_LIMIT, soft_budget=SOFT_BUDGET):
        self.path = path
        self.hard_limit = hard_limit
        self.soft_budget = soft_budget
        self.day = dart_time.today_kst()
        self.counts = {"list": 0, "mapping": 0, "detail": 0, "financial": 0, "other": 0}
        self.runs = 0
        self._load()

    def _load(self):
        if not os.path.exists(self.path):
            return
        try:
            with open(self.path, encoding="utf-8") as f:
                data = json.load(f)
        except (OSError, json.JSONDecodeError):
            return
        if data.get("day") != self.day:
            return                     # 날이 바뀌면 0부터
        for k, v in (data.get("counts") or {}).items():
            if k in self.counts:
                self.counts[k] = int(v)
        self.runs = int(data.get("runs") or 0)

    @property
    def total(self):
        return sum(self.counts.values())

    @property
    def remaining(self):
        return max(0, self.hard_limit - self.total)

    def allow(self, kind):
        """이 종류의 요청을 지금 해도 되는가."""
        if self.total >= self.hard_limit:
            return False
        if kind in OPTIONAL and self.total >= self.soft_budget:
            return False           # 비필수부터 끊는다(Graceful Degradation)
        return True

    def spend(self, kind, n=1):
        self.counts[kind if kind in self.counts else "other"] += n

    def status(self):
        if self.total >= self.hard_limit:
            return DART_BUDGET_EXCEEDED
        if self.total >= self.soft_budget:
            return DART_BUDGET_WARNING
        return BUDGET_OK

    def report(self):
        return {
            "day": self.day,
            "requests_today": self.total,
            "byKind": dict(self.counts),
            "runs_today": self.runs,
            "hard_limit": self.hard_limit,
            "soft_budget": self.soft_budget,
            "normal_target_per_day": NORMAL_TARGET_PER_DAY,
            "remaining": self.remaining,
            "usage_pct_of_hard_limit": round(self.total / self.hard_limit * 100, 2)
            if self.hard_limit else None,
            "status": self.status(),
            "note": "10,000건은 안전 상한이지 목표가 아니다. 평상시 수백 회 수준을 지향한다.",
        }

    def save(self):
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        self.runs += 1
        tmp = self.path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump({"schemaVersion": "dart_budget_v1", "day": self.day,
                       "counts": self.counts, "runs": self.runs,
                       "updatedAt": dart_time.iso_now()},
                      f, ensure_ascii=False, separators=(",", ":"))
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, self.path)


def project(list_requests_per_run, runs_per_day, mapping_per_day=0,
            financial_per_day=0, detail_per_day=0):
    """하루 예상 호출 수를 계산한다. 추측이 아니라 실측값을 넣어 쓴다."""
    per_day = list_requests_per_run * runs_per_day + mapping_per_day \
        + financial_per_day + detail_per_day
    return {
        "list_requests_per_run": list_requests_per_run,
        "runs_per_day": runs_per_day,
        "mapping_per_day": mapping_per_day,
        "financial_per_day": financial_per_day,
        "detail_per_day": detail_per_day,
        "expected_daily_requests": per_day,
        "pct_of_hard_limit": round(per_day / DAILY_HARD_LIMIT * 100, 2),
    }
