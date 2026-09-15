#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""due-record planner — 공식 가격증명이 **지금 필요한 판단만** 골라낸다. 네트워크 0 · 판정 공식 0.

왜 있나
  600종목의 과거 자료를 매번 다시 받지 않기 위해서다. 봉인 판단 중 "출처가 붙어 있고, 결과일이
  지났고, 아직 채점되지 않았고, 증명도 없는" 것만 생산자에게 넘긴다.

무엇을 재사용하나(새 규칙을 만들지 않는다)
  - 결과일·미래 대기·판단보류 판정: decision_records.evaluate() 의 앞부분 그대로
  - 출처 연결 여부: 봉인 기록의 priceProvenance.linked / priceObservedAt (PHASE 3)
  - 증명 유무·충돌: comparison_evidence.load_price_proofs()
  - 기업행사·가격 검사 상태: comparison_evidence.assess() (증명이 있으면 증명까지 넣어서)

상태(하나의 판단은 정확히 하나의 1차 상태를 갖는다 — 순서대로 먼저 맞는 것)
  ALREADY_EVALUATED             이미 채점돼 저장됨(불변)
  NOT_GRADEABLE                 판단보류·BUY/HOLD/SELL 아님·비거래일 판단 — evaluate() 의 사유 그대로
  MISSING_PROVENANCE            판단 당시 가격 출처가 없다(과거 7,200건 등). 소급해서 채우지 않는다
  WAITING_MATURITY              결과일(5번째 거래일) 종가가 아직 확정되기 전
  PROOF_SAVED_AWAITING_GRADING  증명이 있고 비교검사가 comparable — 다음 refresh() 가 채점한다
  BLOCKED_CORPORATE_EVIDENCE    증명은 있는데 기업행사·시장조치 근거가 부족/충돌/조정 필요
  BLOCKED_PRICE_EVIDENCE        증명이 있는데 가격 근거 자체가 검사에서 막힘(충돌·무효·거래정지)
  READY_FOR_PRICE_PROOF         출처 있음 + 결과일 도달 + 미채점 + 증명 없음 → 생산자 대상

READY 인 판단에도 corporateState 를 같이 적는다(증명 없이 assess 한 결과). 생산자는 그것과 무관하게
공식 가격을 받는다 — 요청은 날짜 단위(전 종목)라 종목별 추가 비용이 없고, 가격증명은 기업행사
증거와 독립된 사실이기 때문이다. 다만 보고서에는 "기업행사 근거가 아직 막고 있는 수"를 따로 센다.
"""
import decision_records as dr
import comparison_evidence as ce

PLANNER_VERSION = 'price-proof-planner-v1'

ALREADY_EVALUATED = 'ALREADY_EVALUATED'
NOT_GRADEABLE = 'NOT_GRADEABLE'
MISSING_PROVENANCE = 'MISSING_PROVENANCE'
WAITING_MATURITY = 'WAITING_MATURITY'
PROOF_SAVED_AWAITING_GRADING = 'PROOF_SAVED_AWAITING_GRADING'
BLOCKED_CORPORATE_EVIDENCE = 'BLOCKED_CORPORATE_EVIDENCE'
BLOCKED_PRICE_EVIDENCE = 'BLOCKED_PRICE_EVIDENCE'
READY_FOR_PRICE_PROOF = 'READY_FOR_PRICE_PROOF'
#: 생산자가 붙이는 2차 상태(계획 단계에는 없다).
BLOCKED_PRICE_SOURCE = 'BLOCKED_PRICE_SOURCE'
PROOF_PRODUCED = 'PROOF_PRODUCED'
NOT_PROCESSED = 'NOT_PROCESSED'

STATES = (ALREADY_EVALUATED, NOT_GRADEABLE, MISSING_PROVENANCE, WAITING_MATURITY,
          PROOF_SAVED_AWAITING_GRADING, BLOCKED_CORPORATE_EVIDENCE, BLOCKED_PRICE_EVIDENCE,
          READY_FOR_PRICE_PROOF)

#: assess() 의 사유를 두 갈래로 가른다. 여기 없는 사유는 '가격'으로도 '기업행사'로도 세지 않고 그대로 남긴다.
CORPORATE_REASONS = frozenset(('corporate_action_unverified', 'corporate_action_conflict',
                               'corporate_action_adjustment_required', 'effective_date_unverified',
                               'trading_halt'))
PRICE_REASONS = frozenset(('price_basis_unverified', 'price_evidence_invalid', 'price_evidence_conflict'))


def provenance_gap(row):
    """판단 당시 가격 출처가 붙어 있는가. 없으면 사유(없으면 None)."""
    provenance = row.get('priceProvenance')
    if not isinstance(provenance, dict) or provenance.get('linked') is not True:
        return (provenance or {}).get('reason') or 'price_provenance_not_linked'
    if not dr._moment(row.get('priceObservedAt')):
        return 'price_observed_at_missing'
    return None


def classify(row, outcome, proof, dart, kind, now):
    """판단 하나의 1차 상태 + 참고 상태. 새 날짜 규칙을 만들지 않고 evaluate()/assess() 를 그대로 쓴다."""
    as_of = dr._moment(now).astimezone(dr.KST).date().isoformat()
    item = {'recordId': row['recordId'], 'code': row['code'], 'date': row.get('date'),
            'decisionAt': row.get('decisionAt'), 'call': row.get('call'), 'dueOn': None,
            'state': None, 'reason': None, 'corporateState': None, 'corporateReason': None,
            'proofId': None}
    if isinstance(outcome, dict) and outcome.get('status') == 'evaluated':
        item.update(state=ALREADY_EVALUATED, reason=None, dueOn=outcome.get('dueOn'))
        return item
    probe = dr.evaluate(row, {}, as_of)      # 가격 없이 부르면 자격 판정 부분만 돈다
    item['dueOn'] = probe.get('dueOn')
    if probe['status'] == 'withheld' or probe.get('reason') in ('invalid_record', 'non_trading_day'):
        item.update(state=NOT_GRADEABLE, reason=probe.get('reason'))
        return item
    gap = provenance_gap(row)
    if gap:
        item.update(state=MISSING_PROVENANCE, reason=gap)
        return item
    if probe['status'] == 'pending':
        item.update(state=WAITING_MATURITY, reason=probe.get('reason'))
        return item
    if isinstance(proof, dict) and proof.get('conflictingProofIds'):
        item.update(state=BLOCKED_PRICE_EVIDENCE, reason='price_evidence_conflict',
                    proofId=None, conflictingProofIds=proof['conflictingProofIds'])
        return item
    verdict = ce.assess(row, dart, kind, now=now, price_proof=proof if isinstance(proof, dict) else None)
    item.update(corporateState=verdict['state'], corporateReason=verdict.get('reason'))
    if isinstance(proof, dict):
        item['proofId'] = dr._hash(proof)
        if verdict['state'] == 'comparable':
            item.update(state=PROOF_SAVED_AWAITING_GRADING, reason=None)
        elif verdict.get('reason') in PRICE_REASONS:
            item.update(state=BLOCKED_PRICE_EVIDENCE, reason=verdict.get('reason'))
        else:
            item.update(state=BLOCKED_CORPORATE_EVIDENCE, reason=verdict.get('reason'))
        return item
    item.update(state=READY_FOR_PRICE_PROOF, reason=None)
    return item


def plan(daily, outcomes, proofs, dart_bundle, kind_bundle, now):
    """일별 판단 목록 전체의 계획. 반환: {'asOf','rows','counts','corporateEvidence'}."""
    rows = [classify(row, (outcomes or {}).get(row['recordId']), (proofs or {}).get(row['recordId']),
                     (dart_bundle or {}).get(row['code']), (kind_bundle or {}).get(row['code']), now)
            for row in sorted(daily, key=lambda r: (r.get('date') or '', r['code']))]
    counts = {state: 0 for state in STATES}
    for item in rows:
        counts[item['state']] += 1
    matured = [r for r in rows if r['state'] in (READY_FOR_PRICE_PROOF, PROOF_SAVED_AWAITING_GRADING,
                                                 BLOCKED_CORPORATE_EVIDENCE, BLOCKED_PRICE_EVIDENCE)]
    corporate_blocked = sum(1 for r in matured if r['corporateReason'] in CORPORATE_REASONS)
    return {'plannerVersion': PLANNER_VERSION, 'now': now,
            'asOf': dr._moment(now).astimezone(dr.KST).date().isoformat(),
            'rows': rows, 'counts': counts,
            'corporateEvidence': {'maturedWithProvenance': len(matured),
                                  'blockedByCorporateEvidence': corporate_blocked,
                                  'note': '결과일이 지나고 출처가 있는 판단 중, 기업행사·시장조치 근거가 지금 채점을 막는 수. '
                                          '가격증명과는 별개의 조건이다.'}}


def ready_rows(planned):
    return [r for r in planned['rows'] if r['state'] == READY_FOR_PRICE_PROOF]
