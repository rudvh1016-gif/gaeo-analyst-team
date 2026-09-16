#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""데이터 출처 준법 게이트 — config/source_compliance.json 에 사람이 기록한 판정을 코드가 **읽기만** 한다.

왜 있나 (2026-09-16 LEGAL / COPYRIGHT ZERO-RISK GATE)
    GAEO 는 공개 사이트이고 광고(AdSense·AdFit)가 붙어 있다. 저작권·데이터베이스권·API 약관·
    자동수집 정책·재배포 제한·상업적 이용 제한·출처표시 의무 중 하나라도 어길 수 있는 데이터 경로는
    "허용 근거가 확인되기 전까지" 열리지 않아야 한다. 그 판정은 사람이 공식 약관을 보고 기록하고,
    코드는 그 기록을 따른다. 코드가 법률 해석을 확정하지 않는다.

원칙
    1. FAIL CLOSED — 설정 파일이 없거나 깨졌거나 판정이 비어 있으면 "닫힘"으로 읽는다.
    2. 어휘는 5개뿐: APPROVED / APPROVED_WITH_CONDITIONS / OWNER_CONFIRMATION_REQUIRED /
       PERMISSION_NOT_VERIFIED / PROHIBITED. 앞의 둘만 "열림"이다.
    3. 게이트는 4개다: automatedCollection(자동수집) · publicRawStorage(원자료 공개 저장) ·
       derivedPublication(파생값 공개) · commercialUse(상업적 이용). 각각 따로 판정한다 —
       "파생값이니까 자유롭다"고 가정하지 않는다.
    4. "백 퍼센트 합법" 류의 단정은 이 파일 어디에도 없다. 상태 어휘만 쓴다.
    5. 시험은 cleared_gate() 로 **명시적으로** 열어서 생산자 기계장치만 검사한다. 기본값을 열어 두지 않는다.
"""
from __future__ import annotations

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(HERE, 'config', 'source_compliance.json')
SCHEMA_VERSION = 'source_compliance_v1'

VERDICTS = ('APPROVED', 'APPROVED_WITH_CONDITIONS', 'OWNER_CONFIRMATION_REQUIRED',
            'PERMISSION_NOT_VERIFIED', 'PROHIBITED')
OPEN_VERDICTS = frozenset(('APPROVED', 'APPROVED_WITH_CONDITIONS'))
GATE_KEYS = ('automatedCollection', 'publicRawStorage', 'derivedPublication', 'commercialUse')

STATE_CLEARED = 'CLEARED'
STATE_UNVERIFIED = 'LEGAL_USE_UNVERIFIED'
COMMERCIAL_NOT_CLEARED = 'COMMERCIAL_USE_NOT_CLEARED'


class LegalGateError(RuntimeError):
    """허용 근거가 확인되지 않은 경로로 데이터를 쓰려 할 때 던진다. 우회하지 말고 판정을 기록하라."""


def is_open(verdict):
    return verdict in OPEN_VERDICTS


def load(path=None):
    """설정을 읽고 최소 구조를 검사한다. 깨졌으면 예외 — 조용히 '허용'으로 떨어지지 않는다."""
    path = path or CONFIG_PATH
    with open(path, encoding='utf-8') as handle:
        cfg = json.load(handle)
    if cfg.get('schemaVersion') != SCHEMA_VERSION:
        raise LegalGateError('source_compliance schemaVersion mismatch: %r' % (cfg.get('schemaVersion'),))
    providers = cfg.get('providers')
    if not isinstance(providers, dict) or not providers:
        raise LegalGateError('source_compliance providers missing')
    for pid, prov in providers.items():
        gates = prov.get('gates')
        if not isinstance(gates, dict):
            raise LegalGateError('provider %s has no gates' % pid)
        for key in GATE_KEYS:
            if gates.get(key) not in VERDICTS:
                raise LegalGateError('provider %s gate %s has invalid verdict %r' % (pid, key, gates.get(key)))
        if prov.get('verdict') not in VERDICTS:
            raise LegalGateError('provider %s verdict invalid %r' % (pid, prov.get('verdict')))
    return cfg


def provider(pid, cfg=None):
    cfg = cfg or load()
    try:
        return cfg['providers'][pid]
    except KeyError:
        raise LegalGateError('unknown provider %r — 등록되지 않은 출처는 닫힘이다' % (pid,))


def gate(pid, cfg=None):
    """코드가 따를 게이트 요약. 모든 불리언은 판정이 APPROVED/APPROVED_WITH_CONDITIONS 일 때만 True."""
    prov = provider(pid, cfg)
    gates = prov['gates']
    out = {'provider': pid, 'verdict': prov['verdict'], 'gates': dict(gates),
           'reviewedAt': prov.get('checkedAt'), 'termsUrls': list(prov.get('termsUrls') or [])}
    out['automatedCollectionAllowed'] = is_open(gates['automatedCollection'])
    out['publicRawStorageAllowed'] = is_open(gates['publicRawStorage'])
    out['derivedPublicationAllowed'] = is_open(gates['derivedPublication'])
    out['commercialCleared'] = is_open(gates['commercialUse'])
    out['state'] = STATE_CLEARED if all((out['automatedCollectionAllowed'], out['publicRawStorageAllowed'],
                                          out['derivedPublicationAllowed'])) else STATE_UNVERIFIED
    out['commercialState'] = 'CLEARED' if out['commercialCleared'] else COMMERCIAL_NOT_CLEARED
    return out


def cleared_gate(pid):
    """시험 전용 — 게이트를 전부 연 모양. 운영 코드는 이것을 기본값으로 쓰지 않는다."""
    gates = {key: 'APPROVED' for key in GATE_KEYS}
    return {'provider': pid, 'verdict': 'APPROVED', 'gates': gates, 'reviewedAt': None, 'termsUrls': [],
            'automatedCollectionAllowed': True, 'publicRawStorageAllowed': True,
            'derivedPublicationAllowed': True, 'commercialCleared': True,
            'state': STATE_CLEARED, 'commercialState': 'CLEARED', 'testOnly': True}


def hostname_allowlist(cfg=None):
    """코드에 등장해도 되는 외부 hostname 전체(등록된 출처 + 인프라). 새 hostname 은 판정 등록이 먼저다."""
    cfg = cfg or load()
    hosts = set(cfg.get('infrastructureHostnames') or [])
    for prov in cfg['providers'].values():
        hosts.update(prov.get('hostnames') or [])
    return hosts


def forbidden_public_paths(cfg=None):
    """원자료 공개 저장이 열리지 않은 출처의 저장 경로 — 이 아래에 파일이 있으면 검사가 실패한다."""
    cfg = cfg or load()
    out = []
    for pid, prov in cfg['providers'].items():
        if not is_open(prov['gates']['publicRawStorage']):
            for path in prov.get('rawStoragePaths') or []:
                out.append((pid, path))
    return out


def forbidden_phrases(cfg=None):
    cfg = cfg or load()
    return list(cfg.get('forbiddenLegalPhrases') or [])


def summary(cfg=None):
    cfg = cfg or load()
    rows = []
    for pid, prov in cfg['providers'].items():
        g = gate(pid, cfg)
        rows.append((pid, prov['verdict'], g['state'], g['commercialState']))
    return rows


if __name__ == '__main__':  # pragma: no cover — 사람용 요약
    for row in summary():
        print(' | '.join(row))
