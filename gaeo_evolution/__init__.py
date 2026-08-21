# -*- coding: utf-8 -*-
"""GAEO Evolution Harness — 기존 GAEO 위에 얹는 관찰·평가·연구·검증 계층.

이 패키지는 ADDITIVE다. 기존 Production 판단 경로(analyze_auto.py ·
compute_team_weights.py · compute_model_intelligence.py · research_engine*)를
수정하지 않고 그 출력을 읽어서만 동작한다.

이 패키지 전체를 삭제해도 기존 GAEO는 이전과 똑같이 동작해야 한다.
그 계약은 test_gaeo_evolution.py가 지킨다.
"""
