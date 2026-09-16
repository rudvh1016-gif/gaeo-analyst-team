# -*- coding: utf-8 -*-
"""data_supply — 네이버 의존 해체를 위한 공급자 어댑터·오프라인 그림자 비교 (2026-09-16, PHASE 1).

이 패키지는 Production 판단 경로(update_prices.py · collect_analyst_data.py · compute_indicators.py ·
analyze_auto.py)를 **읽기만** 한다. 어떤 모듈도 data.js·analysis_data.json·indicators.json·
auto_analysis.js 를 쓰지 않는다.

구성
    contracts.py         GAEO 내부 필드 계약(분석가가 보는 모양). 공급자 이름을 몰라도 되게 한다.
    fsc_stock_price.py   공공데이터포털 금융위원회_주식시세정보 어댑터: provider → normalize → 내부 계약.
                         허용 근거(config/source_compliance.json)가 열리기 전에는 네트워크에 나가지 않는다.
    shadow_compare.py    오프라인 그림자 비교: 공급자 값 대조 + 판단 영향(TARO/DIANA/QUANT/FLOW/CHIEF) 비교.
    fixtures/            합성 응답 표본(실제 값 아님). 실제 공급자 값은 커밋하지 않는다.

Production switch 는 없다. NAVER_PRODUCTION_DISABLED = 0 · NEW_PROVIDER_PRODUCTION_ENABLED = 0.
"""
