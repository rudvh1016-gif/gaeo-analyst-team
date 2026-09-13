"""AI-0 triage joining existing ops, protected decisions and Evolution.

Pure decisions, no subprocess/network/model/strategy writer. Only save_state()
writes a fixed observation file; repairs remain owned by the existing watchdog.
Unknown evidence cannot resolve an incident. Waiting is not a broken pipeline.
"""
from copy import deepcopy
import hashlib
import json
from pathlib import Path

SCHEMA = 'gaeo-performance-orchestration-v1'
STATE_PATH = 'docs/operations/repair_requests/performance_orchestrator.json'
LABELS = {'DEVELOPING': '정상 발전 중', 'WAITING_EVIDENCE': '정상적으로 자료를 기다리는 중',
          'ACTION_NEEDED': '지금 해결할 문제가 있음', 'STALLED': '발전 정체',
          'FAULT': '실제 장애', 'UNVERIFIED': '운영 상태 확인 필요'}


def digest(value):
    body = json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':'), allow_nan=False)
    return hashlib.sha256(body.encode()).hexdigest()


def research_focus(failures, constitution):
    """Evidence for the existing lab; cannot create specs or change its gate."""
    from gaeo_evolution.failure_miner import MIN_ROWS, MIN_DAYS
    split = failures.get('dataSplit') or {}
    policy = constitution.get('offlineDataPolicy') or {}
    required = policy.get('minResearchDays', 0) + policy.get('minEvalDays', 0)
    ready = bool(required and split.get('sufficient') is True and split.get('uniqueDays', 0) >= required)
    clusters = [c for c in failures.get('clusters', [])
                if c.get('rawN', 0) >= MIN_ROWS and c.get('uniqueDays', 0) >= MIN_DAYS]
    clusters.sort(key=lambda c: (0 if c['key'] == 'confidence:high_confidence_wrong' else 1,
                                 -c['uniqueDays'], -c['rawN'], c['key']))
    return {'status': 'ACTIONABLE' if ready and clusters else 'WAITING_EVIDENCE',
            'researchRecommended': bool(ready and clusters), 'requiredDecisionDays': required or None,
            'observedDecisionDays': split.get('uniqueDays'),
            'clusterKeys': [c['key'] for c in clusters],
            'reason': 'supported_failures_and_separated_research_data' if ready and clusters else
                      'waiting_for_separated_evidence' if not ready else 'no_supported_failure',
            'handoff': 'existing_deterministic_candidates_then_shadow_and_promotion_gate',
            'productionChangesAllowed': False}


def _issue(key, scope, priority, status, title, evidence, *, fault=False, actionable=False):
    identity = key + '|' + scope
    return {'id': 'PERF-' + digest(identity)[:16], 'key': key, 'scope': scope,
            'priorityClass': priority, 'state': status, 'title': title, 'evidence': evidence,
            'evidenceFingerprint': digest(evidence), 'operationalFault': fault,
            'actionableNow': actionable, 'uniqueDecisionDays': evidence.get('uniqueDays', 0),
            'affectedRecords': evidence.get('rawN', 0)}


def build(operations, decisions, evolution, failures, manifest, constitution, previous=None,
          source_errors=None, dart_research=None):
    previous = previous or {}
    now = operations['checkedAt']
    issues, verified_scopes = [], set()
    verified_scopes.update('source:'+name for name, value in (
        ('actual_decisions', decisions), ('evolution', evolution), ('failure_miner', failures),
        ('manifest', manifest), ('constitution', constitution), ('previous_state', previous))
        if value and name not in (source_errors or {}))
    if failures.get('sourceEvidence') and 'evolution_binding' not in (source_errors or {}):
        verified_scopes.add('source:evolution_binding')
    components = operations.get('components') or {}
    # PAPER is observed by its existing monitor, not made part of this public
    # analysis improvement loop or confused with the owner's holdings.
    relevant = ('prices', 'analysis', 'coverage', 'indicators', 'dart', 'decisions',
                'evolution', 'schedule', 'workflows', 'scheduled', 'evolutionLiveness')
    for name in relevant:
        c = components.get(name)
        if not c:
            continue
        scope = 'ops:' + name
        if c['status'] in ('OK', 'IDLE_OK') or (name == 'decisions' and c.get('code') == 'DECISIONS_VERIFIED'):
            verified_scopes.add(scope)
        if c['status'] not in ('FAULT', 'UNKNOWN', 'DATA_INSUFFICIENT', 'QUOTA_WAIT'):
            continue
        is_fault = c['status'] == 'FAULT'
        priority = 0 if name in ('coverage', 'indicators', 'prices', 'analysis', 'dart') else 1 if name == 'decisions' else 4
        if 'MISMATCH' in c.get('code', '') or 'INVALID' in c.get('code', '') or 'SAFE_MODE' in c.get('code', ''):
            priority = 0
        # Incidents identify the failing component and condition, never its
        # changing age, run id or prose. Fingerprints exclude elapsed time.
        evidence = {k: c[k] for k in ('code', 'basisAt', 'latestDecisionAt', 'lastVerifiedAt',
                    'generatedAt', 'counts', 'workflows') if k in c}
        issues.append(_issue(c.get('code', name), scope, priority,
                             'ACTIONABLE' if is_fault else 'BLOCKED' if c['status'] == 'UNKNOWN' else 'WAITING_EVIDENCE',
                             c.get('detail', name), evidence, fault=is_fault, actionable=is_fault))
    for name, reason in (source_errors or {}).items():
        issues.append(_issue('SOURCE_UNREADABLE', 'source:'+name, 0, 'ACTIONABLE',
                             '필수 입력 자료 오류: '+name, {'reason': reason}, fault=True, actionable=True))
    quality = decisions.get('quality') or {}
    active_key = quality.get('activeCohort')
    cohort = (quality.get('cohorts') or {}).get(active_key) or {}
    outcome = cohort.get('outcomes') or {}
    decision_verified = (components.get('decisions') or {}).get('code') == 'DECISIONS_VERIFIED'
    if quality and decision_verified:
        verified_scopes.add('source:quality')
    integrity_fault = any(i['operationalFault'] and i['priorityClass'] <= 1 for i in issues)
    performance_scope = 'actual:' + str(active_key)
    if outcome.get('pending'):
        issues.append(_issue('FUTURE_RESULTS', performance_scope, 3, 'WAITING_EVIDENCE',
            '실제 판단의 5거래일 결과를 기다리는 중',
            {'rawN': outcome['pending'], 'uniqueDays': outcome.get('evaluatedDecisionDays', 0)}))
    if outcome.get('blocked'):
        issues.append(_issue('OUTCOME_EVIDENCE_GAP', performance_scope, 0, 'BLOCKED',
            '가격 비교·결과 자료를 확인해야 채점할 수 있음', {'rawN': outcome['blocked']}, actionable=True))
    if not quality:
        issues.append(_issue('QUALITY_NOT_GENERATED', 'source:quality', 1, 'BLOCKED',
            '점수 신뢰도·판단범위 산출물 확인 필요', {}))
    if decision_verified and outcome.get('gradedDecisionDays', 0) >= outcome.get('minUniqueDecisionDays', 10**9):
        verified_scopes.add(performance_scope)
    # Existing Failure Miner is reused in both lanes. Historical Evolution
    # aggregates are explicitly lower-trust research observations, never the
    # protected public accuracy denominator introduced in PRs 556/558.
    focus = research_focus(failures, constitution)
    if integrity_fault or source_errors:
        focus = dict(focus, status='BLOCKED', researchRecommended=False,
                     reason='restore_required_input_integrity_before_research')
    lanes = [(performance_scope, cohort.get('failurePatterns') or {}, decision_verified, True),
             ('legacy-evolution:' + str(evolution.get('productionVersion')),
              failures, not source_errors, False)]
    for scope, report, verified, protected in lanes:
        support = report.get('minSupport') or {}
        for cluster in report.get('clusters', []):
            supported = cluster.get('rawN', 0) >= support.get('rows', 10**9) and cluster.get('uniqueDays', 0) >= support.get('days', 10**9)
            high = cluster.get('key') == 'confidence:high_confidence_wrong'
            ready = supported and verified and focus['researchRecommended'] and not integrity_fault
            state = 'ACTIONABLE' if ready else 'BLOCKED' if integrity_fault or not verified else 'WAITING_EVIDENCE'
            evidence = dict(cluster, protectedOutcomes=protected,
                            researchDataReady=focus['researchRecommended'])
            issues.append(_issue(cluster['key'], scope, 2 if high else 3, state,
                                 ('가격 비교를 통과한 실제 기록: ' if protected else '기존 연구 참고 기록: ')+cluster['label'],
                                 evidence, actionable=ready))
        if verified and focus['researchRecommended']:
            verified_scopes.add(scope)
    if not focus['researchRecommended']:
        issues.append(_issue('RESEARCH_EVIDENCE', 'evolution:research', 4, focus['status'],
                             '연구 가능 조건 확인: '+focus['reason'], focus))
    else:
        verified_scopes.add('evolution:research')
    # Optional DART evidence is separate from required price/decision inputs.
    # Failure raises a data repair task; it cannot stop Production analysis.
    dart = dart_research or {}
    dart_focus = dart.get('researchFocus') or {}
    if dart.get('status') == 'DATA_ERROR':
        issues.append(_issue('DART_RESEARCH_DATA_ERROR', 'dart:research', 0, 'ACTIONABLE',
            '공시 연구자료 확인 오류', {'status': 'DATA_ERROR'}, actionable=True))
    elif dart:
        verified_scopes.add('dart:research')
        if dart.get('status') == 'RESEARCH_SIGNAL_FOUND' and dart_focus.get('researchRecommended'):
            verified_scopes.add('dart:evidence')
            issues.append(_issue('DART_RESEARCH_SIGNAL', 'dart:signal', 4,
                'BLOCKED' if integrity_fault else 'ACTIONABLE', '공시와 반복 오답의 관계를 추가 연구할 근거',
                {'cohorts': dart_focus.get('signalCohorts'),
                 'checks': {k: v.get('confirmatoryChecks') for k, v in (dart.get('cohorts') or {}).items()}},
                actionable=not integrity_fault))
        elif dart.get('status') == 'INSUFFICIENT_EVIDENCE':
            issues.append(_issue('DART_EVIDENCE', 'dart:evidence', 4, 'WAITING_EVIDENCE',
                '당시 공시 확인 자료와 성숙한 비교 판단일을 기다리는 중',
                {'cohorts': {k: {f: v.get(f) for f in ('rawRows', 'uniqueDecisionDays', 'comparableDecisionDays')}
                             for k, v in (dart.get('cohorts') or {}).items()}}))
        elif dart.get('status') == 'NO_RESEARCH_SIGNAL':
            verified_scopes.update(('dart:signal', 'dart:evidence'))
    # Resolve only on positive evidence from the same scope. A missing file,
    # absent/new model, immature period or truncated failure list is not a fix.
    prior = {i['id']: i for i in previous.get('issues', [])}
    current = {}
    for item in issues:
        old = prior.get(item['id']) or {}
        changed_evidence = item['evidenceFingerprint'] != old.get('evidenceFingerprint')
        item.update(firstSeenAt=old.get('firstSeenAt', now), lastConfirmedAt=now,
                    evidenceObservations=old.get('evidenceObservations', 0)+int(changed_evidence),
                    resolvedAt=None, reopenCount=old.get('reopenCount', 0))
        if old.get('state') == 'RESOLVED':
            if changed_evidence or item['operationalFault']:
                item['reopenCount'] += 1
            else:
                item = dict(old)  # stale performance aggregates cannot reopen a fixed incident
        current[item['id']] = item
    for ident, old in prior.items():
        if ident in current:
            continue
        item = deepcopy(old)
        if old['state'] != 'RESOLVED':
            if old['scope'] in verified_scopes:
                # A top-20 cluster list cannot prove an omitted pattern resolved.
                is_pattern = old['scope'].startswith(('actual:', 'legacy-evolution:')) and ':' in old['key']
                if is_pattern:
                    item.update(state='BLOCKED', actionableNow=False,
                                waitingReason='pattern_not_in_bounded_report_requires_explicit_resolution')
                else:
                    item.update(state='RESOLVED', resolvedAt=now, actionableNow=False)
            else:
                item.update(state='BLOCKED', actionableNow=False, waitingReason='source_not_verified')
        current[ident] = item
    ranked = sorted(current.values(), key=lambda i: (
        0 if i['operationalFault'] and i['state'] != 'RESOLVED' else 1 if i['actionableNow'] else
        3 if i['state'] == 'WAITING_EVIDENCE' else 4 if i['state'] == 'RESOLVED' else 2,
        i['priorityClass'], -int(i['evidence'].get('protectedOutcomes', False)),
        -i['uniqueDecisionDays'], -i['affectedRecords'], i['id']))
    faults = [i for i in ranked if i['operationalFault'] and i['state'] != 'RESOLVED']
    actions = [i for i in ranked if i['actionableNow'] and i['state'] != 'RESOLVED']
    progress = {'runId': manifest.get('runId'), 'evaluationFingerprint': (manifest.get('evaluationMeta') or {}).get('dataFingerprint'),
                'evaluatedRecords': outcome.get('evaluated'),
                'experiments': (evolution.get('experimentTotals') or {}).get('totalExperiments'),
                'candidateCounts': evolution.get('candidateCounts'), 'shadow': evolution.get('shadowSummaries')}
    old_progress = previous.get('progress') or {}
    new_run = bool(progress['runId'] and progress['runId'] != old_progress.get('runId'))
    advanced = bool(old_progress and any(progress.get(k) != old_progress.get(k) for k in
                    ('evaluationFingerprint', 'evaluatedRecords', 'experiments', 'candidateCounts', 'shadow')))
    eligible = new_run and manifest.get('status') == 'OK' and focus['researchRecommended'] and not faults
    no_progress = previous.get('eligibleRunsWithoutProgress', 0)
    no_progress = 0 if advanced else no_progress + int(eligible)
    # There is no constitutional stagnation threshold. Record eligible normal
    # research rounds; do not invent '3 days' or diagnose zero candidates.
    stalled_policy = constitution.get('progressPolicy') or {}
    limit = stalled_policy.get('maxEligibleRunsWithoutProgress')
    stalled = isinstance(limit, int) and limit > 0 and eligible and no_progress >= limit
    unverified = bool(source_errors) or any(i['state'] == 'BLOCKED' for i in ranked if i['state'] != 'RESOLVED')
    state = 'FAULT' if faults else 'ACTION_NEEDED' if actions else 'STALLED' if stalled else \
            'UNVERIFIED' if unverified else 'DEVELOPING' if advanced else 'WAITING_EVIDENCE'
    return {'schemaVersion': SCHEMA, 'checkedAt': now, 'llmCalls': 0, 'state': state, 'label': LABELS[state],
            'issues': ranked, 'topPriority': actions[0]['id'] if actions else None,
            'researchFocus': focus, 'progress': progress, 'eligibleRunsWithoutProgress': no_progress,
            'dartResearch': {'status': dart.get('status', 'INSUFFICIENT_EVIDENCE'),
                             'researchFocus': dart_focus, 'productionChangesAllowed': False},
            'observations': {'actualSource': quality.get('source'), 'cohort': active_key,
                'latestJudgmentRange': quality.get('latestRound'), 'actualOutcomes': outcome,
                'actualByAction': cohort.get('actions'), 'confidenceBins': (cohort.get('bins') or {}).get('confidence'),
                'disclosure': decisions.get('disclosure'), 'priceComparison': decisions.get('comparison'),
                'evolutionGeneratedAt': evolution.get('generatedAt'),
                'legacyResearchBaseline': evolution.get('baselineSummary'),
                'promotionCardsAvailable': evolution.get('promotionCardsAvailable'),
                'safeMode': evolution.get('mode') == 'SAFE_MODE' or bool(evolution.get('safeModeReasons')),
                'failureEvidenceBinding': 'BOUND_TO_RUN' if failures.get('sourceEvidence') else 'LEGACY_UNBOUND'},
            'stagnationAssessment': 'POLICY_DEFINED' if limit else 'NO_THRESHOLD_DEFINED_OBSERVATION_ONLY',
            'recentPerformanceChange': quality.get('recentChange') or {'status': 'INSUFFICIENT_EVIDENCE', 'mode': 'SHADOW_ONLY'},
            'safeRecovery': {'owner': 'pipeline_watchdog.py --apply',
                'request': 'EXISTING_WATCHDOG' if any(i['operationalFault'] and i['scope'] in ('ops:prices', 'ops:analysis') for i in faults) else None,
                'execution': operations.get('watchdogExecution', 'NOT_OBSERVED'),
                'limit': 'existing_per_run_bounds_and_market_window', 'verifiedRecovered': False},
            'productionChangesAllowed': False}


def observe(root, operations):
    root = Path(root)
    errors = {}
    def read(name, path, optional=False):
        try:
            data = json.loads((root/path).read_text(encoding='utf-8'))
            if not isinstance(data, dict):
                raise ValueError('object required')
            return data
        except (OSError, ValueError):
            if not optional or (root/path).exists():
                errors[name] = 'missing_or_invalid_json'
            return {}
    previous = read('previous_state', STATE_PATH, optional=True)
    decisions = read('actual_decisions', 'research_archive/decisions/status.json')
    evolution = read('evolution', 'gaeo_evolution/status/evolution_status.json')
    failures = read('failure_miner', 'gaeo_evolution/status/failure_report.json')
    manifest = read('manifest', 'gaeo_evolution/status/last_run_manifest.json')
    binding = failures.get('sourceEvidence')
    if binding is not None and (binding.get('runId') != manifest.get('runId') or
            binding.get('evaluationFingerprint') != (manifest.get('evaluationMeta') or {}).get('dataFingerprint') or
            evolution.get('sourceEvidence') != binding):
        errors['evolution_binding'] = 'failure_status_manifest_mismatch'
    try:
        from gaeo_evolution import constitution
        const = constitution.load(str(root/'gaeo_evolution/evolution_constitution.json'),
                                  str(root/'gaeo_evolution/evolution_constitution.sha256'))
    except (OSError, ValueError, constitution.ConstitutionError):
        const = {}
        errors['constitution'] = 'unverified_constitution'
    import dart_research
    dart_reports = []
    for path in (dart_research.DAILY_REPORT, dart_research.REPORT):
        if not (root/path).exists():
            continue
        try:
            value = json.loads((root/path).read_text(encoding='utf-8'))
            if value.get('version') != dart_research.VERSION or value.get('productionChangesAllowed') is not False:
                raise ValueError('unverified DART observation')
            dart_reports.append(value)
        except (OSError, ValueError, AttributeError):
            dart_reports = [{'status': 'DATA_ERROR'}]; break
    dart = max(dart_reports, key=lambda r: r.get('generatedAt', '')) if dart_reports else {}
    result = build(operations, decisions, evolution, failures, manifest, const, previous, errors, dart)
    result['naturalRunAcceptance'] = (((operations.get('components') or {}).get('scheduled') or {})
        .get('workflows') or {}).get('ops-daily.yml', {}).get('performanceNaturalRun',
        {'status': 'PENDING_NATURAL_RUN'})
    result['executionReceipt'] = execution_receipt(result)
    return result


def execution_receipt(state, environ=None):
    """Evidence only; producing a file is not proof that it reached main."""
    if environ is None:
        import os
        environ = os.environ
    return {'event': environ.get('GITHUB_EVENT_NAME', 'local'),
            'runId': environ.get('GITHUB_RUN_ID'), 'runAttempt': environ.get('GITHUB_RUN_ATTEMPT'),
            'workflowRef': environ.get('GITHUB_WORKFLOW_REF'), 'headSha': environ.get('GITHUB_SHA'),
            'stateHash': digest({k: v for k, v in state.items() if k != 'executionReceipt'}),
            'naturalRunAcceptance': 'PENDING_NATURAL_RUN'}


def verify_natural_run(state, run, committed_state):
    """Read-only acceptance using GitHub run facts AND saved main content.

    workflow_dispatch/local execution never qualifies. The caller must fetch
    committed_state from main, and the completed GitHub run separately.
    """
    receipt = state.get('executionReceipt') or {}
    same = (receipt.get('event') == 'schedule' and run.get('event') == 'schedule'
            and run.get('path') == '.github/workflows/ops-daily.yml'
            and run.get('head_branch') == 'main' and run.get('status') == 'completed'
            and run.get('conclusion') == 'success' and str(run.get('id')) == receipt.get('runId')
            and str(run.get('run_attempt')) == receipt.get('runAttempt')
            and run.get('head_sha') == receipt.get('headSha')
            and bool(receipt.get('workflowRef', '').endswith('/ops-daily.yml@refs/heads/main'))
            and receipt.get('stateHash') == digest({k: v for k, v in state.items() if k != 'executionReceipt'})
            and state == committed_state)
    return {'status': 'NATURAL_RUN_SUCCESS' if same else 'PENDING_NATURAL_RUN',
            'runId': receipt.get('runId'), 'sameRunArtifactVerified': bool(same)}


def save_state(root, state):
    from decision_records import _atomic_json
    if state.get('schemaVersion') != SCHEMA or state.get('productionChangesAllowed') is not False:
        raise ValueError('invalid observation state')
    root = Path(root).resolve()
    target = root/STATE_PATH
    if target.resolve() != target or any(p.is_symlink() for p in [target, *target.parents] if p != root.parent):
        raise ValueError('observation output must not be a symlink')
    if target.exists():
        old = json.loads(target.read_text(encoding='utf-8'))
        if not isinstance(old, dict) or old.get('schemaVersion') != SCHEMA:
            raise ValueError('preserve unreadable prior incidents for repair')
    _atomic_json(target, state)
