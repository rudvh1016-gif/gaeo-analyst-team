# -*- coding: utf-8 -*-
"""GAEO Reference Lab — 외부 라이브러리로 GAEO 계산을 '검산'만 하는 격리 계층.

경계(절대 조건):
  · Production(analyze_auto.py · compute_indicators.py · gaeo_evolution/*)은 이
    패키지를 **import하지 않는다.** 흐름은 단방향이다 — Reference가 Production을
    읽기만 한다.
  · 여기서 나온 숫자는 GAEO 판단(BUY/HOLD/SELL·점수·가중치)에 절대 들어가지 않는다.
  · 사용자 화면에 이 패키지나 외부 라이브러리 이름을 노출하지 않는다.
  · 네트워크·세션·인증 호출 0. 라이브러리가 없으면 status="N/A"로 조용히 끝난다.
"""
__all__ = ["gs_reference"]
