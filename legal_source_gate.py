#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""자동 준법 검사기 — LLM 없이 저장소를 훑어 "허용 근거 없는 새 경로"가 생기면 막는다.

무엇을 막나 (2026-09-16 LEGAL / COPYRIGHT ZERO-RISK GATE §18)
    1. HOSTNAME_UNREGISTERED   등록되지 않은 외부 hostname 이 fetch 가능 코드에 새로 들어옴
    2. RAW_PUBLIC_PATH          공개 저장이 열리지 않은 출처의 원자료 폴더에 파일이 있음(KRX price_sources/price_proofs)
    3. PAGES_EXCLUDE_MISSING    _config.yml exclude 에 있어야 할 경로가 빠짐
    4. SERVED_PAGE_LOADS_CDN    사이트 HTML 이 금지 CDN(폰트 CDN 등)에서 리소스를 로드함
    5. SAMPLE_VALUES_PRESENT    응답 표본값을 담아야 할 이유가 없는 파일에 표본값이 남아 있음
    6. FORBIDDEN_LEGAL_PHRASE   '백 퍼센트 합법' 류의 단정 문구
    7. NOTICES_MISSING          THIRD_PARTY_NOTICES.md 부재 또는 필수 고지 누락
    8. VENDORED_LICENSE_MISSING 벤더 스킬 폴더에 LICENSE 없음
    9. WORKFLOW_GATE_MISSING    게이트가 있어야 할 워크플로에 --require 스텝 없음
   10. NAVER_ENDPOINT_NEW       등록된 prefix 밖의 네이버 URL(새 endpoint 발굴 금지)
   11. USER_AGENT_NEW           등록되지 않은 브라우저 흉내 UA(위장 확대 금지)
   12. NAVER_RATE_INCREASED     수집 주기 단축·동시성 증가·종목 수 증가(호출 빈도 증가 금지)

무엇을 하지 않나
    · 법률 해석을 확정하지 않는다. 판정은 사람이 config/source_compliance.json 에 기록하고, 여기서는 그 기록과
      코드가 어긋나는지만 본다. 통과 = "등록된 상태와 일치" 이지 "합법 확인" 이 아니다.

쓰는 법
    python3 legal_source_gate.py                     # 전체 검사. 걸리면 종료코드 1
    python3 legal_source_gate.py --require kind:automatedCollection   # 게이트가 열려 있지 않으면 종료코드 2 (워크플로 첫 스텝)
    python3 legal_source_gate.py --json
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

import source_compliance as compliance

HERE = os.path.dirname(os.path.abspath(__file__))
HOST_RE = re.compile(r'(?:https?:)?//([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+)')
NAVER_URL_RE = re.compile(r'https://[A-Za-z0-9.-]*naver\.com[^\s\'"`)>\]]*')
UA_RE = re.compile(r'[\'"](Mozilla/5\.0[^\'"]*)[\'"]')
TEST_FILE_RE = re.compile(r'(^|/)test_[^/]*\.(py|js)$')


class Finding(dict):
    def __init__(self, code, path, line, message):
        super().__init__(code=code, path=path, line=line, message=message)

    def __str__(self):
        loc = f"{self['path']}:{self['line']}" if self['line'] else self['path']
        return f"{self['code']} | {loc} | {self['message']}"


# ── 파일 선택 ────────────────────────────────────────────────────────────────
def _rel(repo, path):
    return os.path.relpath(path, repo).replace(os.sep, '/')


def _excluded(rel, scan):
    for prefix in scan.get('excludePrefixes') or []:
        if rel.startswith(prefix):
            return True
    return os.path.basename(rel) in set(scan.get('excludeFiles') or []) or rel in set(scan.get('excludeFiles') or [])


def scan_files(repo, cfg):
    """fetch 가능 코드 파일 목록(콘텐츠 데이터·생성물·문서·벤더 스킬 제외)."""
    scan = cfg['hostnameScan']
    out = []
    for pattern in scan['includeGlobs']:
        for path in glob.glob(os.path.join(repo, pattern), recursive=True):
            if not os.path.isfile(path):
                continue
            rel = _rel(repo, path)
            if _excluded(rel, scan):
                continue
            out.append(rel)
    return sorted(set(out))


def _read(repo, rel):
    with open(os.path.join(repo, rel), encoding='utf-8', errors='replace') as handle:
        return handle.read()


# ── 개별 검사 ────────────────────────────────────────────────────────────────
def check_hostnames(repo, cfg):
    allowed = compliance.hostname_allowlist(cfg) | set((cfg.get('mentionOnlyHostnames') or {}).get('hosts') or [])
    findings = []
    for rel in scan_files(repo, cfg):
        for no, line in enumerate(_read(repo, rel).splitlines(), 1):
            for host in HOST_RE.findall(line):
                h = host.lower()
                if h in allowed or any(h.endswith('.' + a) for a in allowed):
                    continue
                if re.fullmatch(r'[\d.]+', h) or h.endswith(('.local', '.test', '.invalid', '.example', '.localhost')) \
                        or h in ('example.com', 'example.net', 'example.org') or h.endswith(('.example.com', '.example.net', '.example.org')):
                    continue                 # RFC 2606/6761 예약 이름 — 시험 픽스처 전용, 실제 호스트가 아니다
                findings.append(Finding('HOSTNAME_UNREGISTERED', rel, no,
                                        f'등록되지 않은 외부 hostname {h} — config/source_compliance.json 에 출처·판정을 먼저 기록하라'))
    return findings


def check_raw_paths(repo, cfg):
    findings = []
    for pid, path in compliance.forbidden_public_paths(cfg):
        full = os.path.join(repo, path)
        if os.path.isdir(full):
            files = [f for f in glob.glob(os.path.join(full, '**', '*'), recursive=True) if os.path.isfile(f)]
            if files:
                findings.append(Finding('RAW_PUBLIC_PATH', path, None,
                                        f'{pid} 공개 저장 게이트가 닫혀 있는데 파일 {len(files)}개가 있다 — 커밋 금지'))
    return findings


def _pages_excludes(repo):
    try:
        text = _read(repo, '_config.yml')
    except FileNotFoundError:
        return set()
    out, in_block = set(), False
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith('exclude:'):
            in_block = True
            continue
        if in_block:
            if stripped.startswith('- '):
                out.add(stripped[2:].strip().strip('"').strip("'"))
            elif stripped and not stripped.startswith('#'):
                in_block = False
    return out


def check_pages_exclude(repo, cfg):
    have = _pages_excludes(repo)
    return [Finding('PAGES_EXCLUDE_MISSING', '_config.yml', None, f'exclude 에 {need} 가 없다')
            for need in cfg['publicExposure']['pagesExcludeRequired'] if need not in have]


def check_served_pages(repo, cfg):
    hosts = cfg['publicExposure']['servedPagesMustNotLoadFrom']
    findings = []
    for pattern in cfg['publicExposure']['servedHtmlGlobs']:
        for path in glob.glob(os.path.join(repo, pattern)):
            rel = _rel(repo, path)
            for no, line in enumerate(_read(repo, rel).splitlines(), 1):
                if re.search(r'<(link|script)\b', line, re.I) and re.search(r'(href|src)\s*=', line, re.I):
                    for host in hosts:
                        if host in line:
                            findings.append(Finding('SERVED_PAGE_LOADS_CDN', rel, no, f'사이트 페이지가 {host} 에서 리소스를 로드한다 — self-host 만 허용'))
    return findings


def check_sample_values(repo, cfg):
    findings = []
    for rel in cfg['publicExposure'].get('sampleValueFilesMustBeStripped') or []:
        full = os.path.join(repo, rel)
        if not os.path.isfile(full):
            continue
        try:
            data = json.loads(_read(repo, rel))
        except ValueError:
            findings.append(Finding('SAMPLE_VALUES_PRESENT', rel, None, 'JSON 파싱 실패'))
            continue
        hits = []

        def walk(node, path=''):
            if isinstance(node, dict):
                for k, v in node.items():
                    if k == 'sample' and v not in (None, ''):
                        hits.append(path + '/' + k)
                    walk(v, path + '/' + str(k))
            elif isinstance(node, list):
                for i, v in enumerate(node):
                    walk(v, f'{path}[{i}]')
        walk(data)
        if hits:
            findings.append(Finding('SAMPLE_VALUES_PRESENT', rel, None, f'응답 표본값 {len(hits)}개가 남아 있다(예: {hits[0]}) — 필드 이름·비율만 남긴다'))
    return findings


PHRASE_SCAN_EXCLUDE = {'config/source_compliance.json', 'legal_source_gate.py', 'test_legal_source_gate.py'}


def check_forbidden_phrases(repo, cfg):
    phrases = compliance.forbidden_phrases(cfg)
    findings = []
    candidates = set(scan_files(repo, cfg))
    for pattern in ('*.md', 'docs/**/*.md', '*.html', 'snap/index.html', 'AGENTS.md', 'CLAUDE.md'):
        for path in glob.glob(os.path.join(repo, pattern), recursive=True):
            if os.path.isfile(path):
                candidates.add(_rel(repo, path))
    for rel in sorted(candidates):
        if rel in PHRASE_SCAN_EXCLUDE:
            continue
        for no, line in enumerate(_read(repo, rel).splitlines(), 1):
            for phrase in phrases:
                if phrase in line:
                    findings.append(Finding('FORBIDDEN_LEGAL_PHRASE', rel, no, f'단정 법률 표현 {phrase!r} — 상태 어휘(VERIFIED_AGAINST_CURRENT_OFFICIAL_TERMS / PERMISSION_NOT_VERIFIED / OWNER_CONFIRMATION_REQUIRED)만 쓴다'))
    return findings


def check_notices(repo, cfg):
    tp = cfg['thirdParty']
    rel = tp['noticesFile']
    if not os.path.isfile(os.path.join(repo, rel)):
        return [Finding('NOTICES_MISSING', rel, None, '제3자 고지 파일이 없다')]
    text = _read(repo, rel)
    return [Finding('NOTICES_MISSING', rel, None, f'필수 고지 {need!r} 가 없다') for need in tp['requiredMentions'] if need not in text]


def check_vendored_licenses(repo, cfg):
    findings = []
    for rel in cfg['thirdParty']['vendoredSkillDirsRequireLicense']:
        full = os.path.join(repo, rel)
        if not os.path.isdir(full):
            continue
        if not any(os.path.isfile(os.path.join(full, name)) for name in ('LICENSE', 'LICENSE.txt', 'LICENSE.md')):
            findings.append(Finding('VENDORED_LICENSE_MISSING', rel, None, '벤더 코드에 라이선스 전문이 동봉되지 않았다(MIT/Apache 는 고지 유지 의무)'))
    return findings


def check_workflow_gates(repo, cfg):
    findings = []
    for wf, spec in (cfg.get('workflowGates') or {}).items():
        if wf.startswith('_'):
            continue
        rel = '.github/workflows/' + wf
        if not os.path.isfile(os.path.join(repo, rel)):
            continue
        text = _read(repo, rel)
        needle = f'legal_source_gate.py --require {spec}'
        if needle not in text:
            findings.append(Finding('WORKFLOW_GATE_MISSING', rel, None, f'첫 스텝에 `python3 {needle}` 가 없다 — 허용 근거 없는 수집이 실행될 수 있다'))
    return findings


def check_naver_freeze(repo, cfg):
    prov = cfg['providers']['naver_finance']
    freeze = prov['freeze']
    findings = []
    for rel in scan_files(repo, cfg):
        if TEST_FILE_RE.search(rel):
            continue
        for no, line in enumerate(_read(repo, rel).splitlines(), 1):
            for url in NAVER_URL_RE.findall(line):
                url = url.rstrip('/').rstrip("'\"")
                def _ok(pat):
                    if re.fullmatch(r'https://[^/]+/?', pat):      # 호스트만 있는 항목(Referer 용)은 정확히 일치할 때만
                        return url == pat.rstrip('/')
                    return url.rstrip('/').startswith(pat.rstrip('/'))
                if not any(_ok(pat) for pat in freeze['endpointPatterns']):
                    findings.append(Finding('NAVER_ENDPOINT_NEW', rel, no, f'등록되지 않은 네이버 URL {url} — 새 endpoint 발굴 금지(PERMISSION_NOT_VERIFIED)'))
    ua_allowed = set((cfg.get('userAgentFreeze') or {}).get('browserLike') or [])
    for rel in scan_files(repo, cfg):
        if TEST_FILE_RE.search(rel):
            continue
        for no, line in enumerate(_read(repo, rel).splitlines(), 1):
            for ua in UA_RE.findall(line):
                if ua not in ua_allowed:
                    findings.append(Finding('USER_AGENT_NEW', rel, no, f'등록되지 않은 브라우저 흉내 User-Agent {ua!r} — 위장 확대 금지'))
    # 호출 빈도·동시성·종목 수
    prices_yml = _read(repo, '.github/workflows/update-prices.yml')
    sleeps = [int(x) for x in re.findall(r'^\s*sleep (\d+)\s*(?:#.*)?$', prices_yml, re.M)]
    cycle = max(sleeps) if sleeps else None      # 루프 pacing 은 파일 안에서 가장 긴 고정 sleep 이다(재시도 sleep 3 등은 짧다)
    if cycle is None or cycle < freeze['minPricesCycleSeconds']:
        findings.append(Finding('NAVER_RATE_INCREASED', '.github/workflows/update-prices.yml', None,
                                f"시세 사이클 sleep 이 {freeze['minPricesCycleSeconds']}s 미만이거나 없다(현재 {cycle if cycle is not None else '없음'})"))
    analysis_yml = _read(repo, '.github/workflows/update-analysis.yml')
    m = re.search(r'^\s*period=(\d+)', analysis_yml, re.M)
    if not m or int(m.group(1)) < freeze['minAnalysisPeriodSeconds']:
        findings.append(Finding('NAVER_RATE_INCREASED', '.github/workflows/update-analysis.yml', None,
                                f"분석 주기 period 가 {freeze['minAnalysisPeriodSeconds']}s 미만이거나 없다(현재 {m.group(1) if m else '없음'})"))
    up = _read(repo, 'update_prices.py')
    m = re.search(r'max_workers\s*=\s*(\d+)', up)
    if m and int(m.group(1)) > freeze['maxWorkers']:
        findings.append(Finding('NAVER_RATE_INCREASED', 'update_prices.py', None, f"max_workers {m.group(1)} > {freeze['maxWorkers']}"))
    tickers = len(re.findall(r'"code"\s*:', _read(repo, 'tickers.js')))
    if tickers > freeze['maxTickers']:
        findings.append(Finding('NAVER_RATE_INCREASED', 'tickers.js', None, f"종목 수 {tickers} > {freeze['maxTickers']} — 수집 대상 확대 금지"))
    return findings


CHECKS = (check_hostnames, check_raw_paths, check_pages_exclude, check_served_pages, check_sample_values,
          check_forbidden_phrases, check_notices, check_vendored_licenses, check_workflow_gates, check_naver_freeze)


def run_all(repo=HERE, cfg=None):
    cfg = cfg or compliance.load(os.path.join(repo, 'config', 'source_compliance.json'))
    findings = []
    for check in CHECKS:
        findings.extend(check(repo, cfg))
    return findings


def require(spec, cfg=None):
    """'provider:gate' 가 열려 있으면 0, 아니면 2. 워크플로 첫 스텝에서 쓴다 — 닫힘이면 네트워크에 나가지 않는다."""
    provider_id, _, gate_key = spec.partition(':')
    if gate_key not in compliance.GATE_KEYS:
        print(f'LEGAL_GATE invalid gate key {gate_key!r} (one of {compliance.GATE_KEYS})')
        return 2
    try:
        gate = compliance.gate(provider_id, cfg)
    except compliance.LegalGateError as exc:
        print(f'LEGAL_GATE CLOSED {spec}: {exc}')
        return 2
    verdict = gate['gates'][gate_key]
    if compliance.is_open(verdict):
        print(f'LEGAL_GATE OPEN {spec} = {verdict} (reviewedAt {gate.get("reviewedAt")})')
        return 0
    print(f'LEGAL_GATE CLOSED {spec} = {verdict} — 허용 근거가 config/source_compliance.json 에 기록되기 전까지 이 워크플로는 네트워크에 나가지 않는다 (LEGAL_USE_UNVERIFIED)')
    for url in gate.get('termsUrls') or []:
        print('   확인할 공식 문서:', url)
    return 2


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--repo', default=HERE)
    ap.add_argument('--require', default=None, help='provider:gate — 열려 있지 않으면 종료코드 2')
    ap.add_argument('--json', action='store_true')
    args = ap.parse_args(argv)
    if args.require:
        return require(args.require)
    findings = run_all(args.repo)
    if args.json:
        print(json.dumps([dict(f) for f in findings], ensure_ascii=False, indent=1))
    else:
        for f in findings:
            print(str(f))
        print(f'legal_source_gate: {len(findings)} finding(s) — {"FAIL" if findings else "PASS (등록 상태와 일치 · 합법 확인이 아님)"}')
    return 1 if findings else 0


if __name__ == '__main__':
    sys.exit(main())
