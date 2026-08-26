# -*- coding: utf-8 -*-
"""GAEO Coverage Guardian — Universe(600종목) 실태 관측 · Standby 후보 · 교체 제안(초안).

경계(중요):
  · 이 패키지는 **읽기 전용 관측자**다. tickers.js·data.js·auto_analysis.js·
    coverage_version.py 중 어떤 파일도 쓰지 않는다. 산출물은 gaeo_coverage/state/
    아래 JSON뿐이다.
  · Coverage Version(COVERAGE_HISTORY) append는 사람(대표) 승인 후 별도 작업이다.
    proposal.py는 "초안 문자열"만 만들고 coverage_version.py를 고치지 않는다.
  · 종목 자동 교체는 어떤 경우에도 하지 않는다. DELISTED_CONFIRMED가 나와도
    산출물은 '제안(Proposal)'일 뿐이고 main 반영은 사람이 한다.
"""
__all__ = ["guardian", "standby", "proposal"]

