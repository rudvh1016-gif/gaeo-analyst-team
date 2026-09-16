#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""자동 준법 검사기 계약 시험 (2026-09-16 LEGAL / COPYRIGHT ZERO-RISK GATE)

무엇을 지키나
    · config/source_compliance.json 이 읽히고 어휘가 5개뿐이다. 없는 출처는 닫힘이다(FAIL CLOSED).
    · KRX·KIND·네이버 게이트의 운영 기본값이 닫혀 있다(사람이 판정을 기록하기 전에는 코드가 열지 않는다).
    · 현재 저장소가 검사기의 12개 규칙을 전부 통과한다(등록 상태와 일치). 새 hostname·새 네이버 endpoint·
      새 브라우저 흉내 UA·원자료 공개 경로·단정 법률 문구·라이선스 누락이 생기면 여기서 빨간불이 켜진다.
    · 검사기 자체가 결함을 실제로 잡는다(합성 저장소로 각 규칙의 '잡아야 할 경우'를 확인).
    · 표준 라이브러리만 쓴다(test_ci_parity).
표준 라이브러리만 사용.
"""
import contextlib
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

import legal_source_gate as gate
import source_compliance as compliance

HERE = os.path.dirname(os.path.abspath(__file__))


def _write(root, rel, text):
    path = os.path.join(root, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as handle:
        handle.write(text)
    return path


def _codes(findings):
    return sorted({f['code'] for f in findings})


class ConfigContract(unittest.TestCase):
    def test_설정이_읽히고_어휘는_5개뿐이다(self):
        cfg = compliance.load()
        for pid, prov in cfg['providers'].items():
            self.assertIn(prov['verdict'], compliance.VERDICTS, pid)
            for key in compliance.GATE_KEYS:
                self.assertIn(prov['gates'][key], compliance.VERDICTS, (pid, key))
            self.assertTrue(prov.get('checkedAt'), f'{pid}: 확인일이 없다')
            self.assertIsInstance(prov.get('termsUrls'), list, pid)

    def test_등록되지_않은_출처는_닫힘이다(self):
        with self.assertRaises(compliance.LegalGateError):
            compliance.gate('unregistered_provider')

    def test_깨진_설정은_허용으로_읽히지_않는다(self):
        with tempfile.TemporaryDirectory() as tmp:
            bad = _write(tmp, 'c.json', json.dumps({'schemaVersion': 'source_compliance_v1', 'providers': {
                'x': {'verdict': 'APPROVED', 'gates': {'automatedCollection': 'YES'}}}}))
            with self.assertRaises(compliance.LegalGateError):
                compliance.load(bad)
            with self.assertRaises(compliance.LegalGateError):
                compliance.load(_write(tmp, 'v.json', json.dumps({'schemaVersion': 'other', 'providers': {}})))

    def test_운영_기본값_KRX_KIND_네이버는_닫혀_있다(self):
        for pid in ('krx_openapi', 'kind', 'naver_finance'):
            g = compliance.gate(pid)
            self.assertEqual(g['state'], compliance.STATE_UNVERIFIED, pid)
            self.assertFalse(g['publicRawStorageAllowed'], pid)
            self.assertEqual(g['commercialState'], compliance.COMMERCIAL_NOT_CLEARED, pid)
        self.assertEqual(compliance.gate('krx_openapi')['gates']['publicRawStorage'], 'PROHIBITED')

    def test_광고가_붙은_사이트라는_맥락이_기록돼_있다(self):
        cfg = compliance.load()
        self.assertTrue(cfg['siteContext']['monetized'])
        self.assertIn('AdSense', ' '.join(cfg['siteContext']['adNetworks']))

    def test_단정_법률_문구_목록이_있고_이_시험_자체는_그_문구를_쓰지_않는다(self):
        phrases = compliance.forbidden_phrases()
        self.assertGreaterEqual(len(phrases), 3)
        src = open(__file__, encoding='utf-8').read().replace("forbidden_phrases", "")
        for phrase in phrases:
            self.assertNotIn(phrase, src.split('def test_단정_법률_문구')[0])


class RepositoryPassesGate(unittest.TestCase):
    """현재 트리는 등록된 상태와 일치해야 한다 — 통과가 '합법 확인'은 아니다."""

    def test_현재_저장소는_검사기_12규칙을_통과한다(self):
        findings = gate.run_all(HERE)
        self.assertEqual([str(f) for f in findings], [])

    def test_KRX_원자료_공개_폴더가_비어_있다(self):
        for pid, rel in compliance.forbidden_public_paths():
            full = os.path.join(HERE, rel)
            if os.path.isdir(full):
                self.assertEqual([f for f in os.listdir(full)], [], rel)

    def test_KIND_워크플로_4개는_첫_실행_스텝_전에_게이트를_지난다(self):
        cfg = compliance.load()
        for wf, spec in cfg['workflowGates'].items():
            if wf.startswith('_'):
                continue
            text = open(os.path.join(HERE, '.github', 'workflows', wf), encoding='utf-8').read()
            gate_at = text.find('legal_source_gate.py --require ' + spec)
            self.assertGreater(gate_at, 0, wf)
            before = '\n'.join(l for l in text[:text.rfind('\n', 0, gate_at)].splitlines() if not l.strip().startswith('#'))
            self.assertNotIn('python3 ', before, f'{wf}: 게이트보다 먼저 실행되는 python 스텝이 있다')
            self.assertNotIn('curl ', before, f'{wf}: 게이트보다 먼저 네트워크에 나가는 스텝이 있다')

    def test_price_proof_artifact_에_KRX_증명_폴더가_없다(self):
        text = open(os.path.join(HERE, '.github', 'workflows', 'price-proof.yml'), encoding='utf-8').read()
        art = text[text.find('upload-artifact'):]
        self.assertNotIn('research_archive/decisions/price_proofs\n', art)
        self.assertNotIn('research_archive/decisions/price_sources', art)

    def test_고지_파일과_저작권_안내가_있다(self):
        self.assertTrue(os.path.isfile(os.path.join(HERE, 'THIRD_PARTY_NOTICES.md')))
        self.assertTrue(os.path.isfile(os.path.join(HERE, 'LICENSE')))
        notices = open(os.path.join(HERE, 'THIRD_PARTY_NOTICES.md'), encoding='utf-8').read()
        self.assertIn('ISC License', notices)
        self.assertIn('The MIT License (MIT)', notices)


class DetectsRegressions(unittest.TestCase):
    """합성 저장소로 각 규칙이 결함을 실제로 잡는지 본다."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.repo = self.tmp.name
        shutil.copyfile(os.path.join(HERE, 'config', 'source_compliance.json'), _write(self.repo, 'config/source_compliance.json', ''))
        # 통과하는 최소 저장소
        _write(self.repo, '_config.yml', 'exclude:\n' + ''.join(f'  - {p}\n' for p in compliance.load()['publicExposure']['pagesExcludeRequired']))
        _write(self.repo, '.github/workflows/update-prices.yml', 'steps:\n  run: |\n    sleep 3\n    sleep 600\n')
        _write(self.repo, '.github/workflows/update-analysis.yml', 'period=1800\n')
        _write(self.repo, 'update_prices.py', 'max_workers=8\n')
        _write(self.repo, 'tickers.js', '{"code":"005930"}\n')
        _write(self.repo, 'THIRD_PARTY_NOTICES.md', ' '.join(compliance.load()['thirdParty']['requiredMentions']))
        for wf, spec in compliance.load()['workflowGates'].items():
            if not wf.startswith('_'):
                _write(self.repo, '.github/workflows/' + wf, f'steps:\n  - run: python3 legal_source_gate.py --require {spec}\n')
        self.cfg = compliance.load(os.path.join(self.repo, 'config', 'source_compliance.json'))

    def run_gate(self):
        return gate.run_all(self.repo, self.cfg)

    def test_기준_합성_저장소는_통과한다(self):
        self.assertEqual([str(f) for f in self.run_gate()], [])

    def test_새_hostname_은_잡힌다_예약_시험_도메인은_무시한다(self):
        host = 'data.new' + 'source.co.kr'                    # 이 시험 파일 자체가 검사에 걸리지 않게 조립한다
        _write(self.repo, 'new_collector.py', f"URL = 'https://{host}/api'\nOK = 'https://api.example.test/x'\n")
        codes = _codes(self.run_gate())
        self.assertIn('HOSTNAME_UNREGISTERED', codes)
        findings = [f for f in self.run_gate() if f['code'] == 'HOSTNAME_UNREGISTERED']
        self.assertEqual(len(findings), 1)
        self.assertIn(host, findings[0]['message'])

    def test_콘텐츠_데이터_파일의_인용_링크는_범위_밖이다(self):
        press = 'www.some' + 'press.co.kr'
        _write(self.repo, 'news_analysis.js', f"const NEWS=[{{sources:[{{url:'https://{press}/a/1'}}]}}];\n")
        self.assertNotIn('HOSTNAME_UNREGISTERED', _codes(self.run_gate()))

    def test_KRX_원자료_공개_폴더에_파일이_생기면_잡힌다(self):
        _write(self.repo, 'research_archive/decisions/price_sources/x.json.gz', 'x')
        self.assertIn('RAW_PUBLIC_PATH', _codes(self.run_gate()))

    def test_Pages_제외_누락은_잡힌다(self):
        _write(self.repo, '_config.yml', 'exclude:\n  - docs/\n')
        self.assertIn('PAGES_EXCLUDE_MISSING', _codes(self.run_gate()))

    def test_사이트_페이지의_CDN_폰트_로드는_잡힌다(self):
        _write(self.repo, 'x.html', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto">\n')
        self.assertIn('SERVED_PAGE_LOADS_CDN', _codes(self.run_gate()))

    def test_표본값이_남은_파일은_잡힌다(self):
        _write(self.repo, 'market_universe/source_verify.json', json.dumps({'markets': {'KOSPI': {'stockFields': {'closePrice': {'nonNullRatio': 1, 'sample': '249000'}}}}}))
        self.assertIn('SAMPLE_VALUES_PRESENT', _codes(self.run_gate()))

    def test_단정_법률_문구는_잡힌다(self):
        phrase = compliance.forbidden_phrases(self.cfg)[0]
        _write(self.repo, 'docs/x.md', f'이 방식은 {phrase} 입니다\n')
        self.assertIn('FORBIDDEN_LEGAL_PHRASE', _codes(self.run_gate()))

    def test_고지_누락은_잡힌다(self):
        _write(self.repo, 'THIRD_PARTY_NOTICES.md', 'Wanted Sans only')
        self.assertIn('NOTICES_MISSING', _codes(self.run_gate()))

    def test_벤더_스킬_라이선스_누락은_잡힌다(self):
        _write(self.repo, '.claude/skills/impeccable/SKILL.md', 'x')
        self.assertIn('VENDORED_LICENSE_MISSING', _codes(self.run_gate()))

    def test_KIND_워크플로_게이트_누락은_잡힌다(self):
        _write(self.repo, '.github/workflows/kind-probe.yml', 'steps:\n  - run: python3 kind_probe.py\n')
        self.assertIn('WORKFLOW_GATE_MISSING', _codes(self.run_gate()))

    def test_새_네이버_endpoint_와_새_UA_는_잡힌다(self):
        _write(self.repo, 'sneaky.py', "u = 'https://m.stock.naver.com/api/news/latest'\nh = {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)'}\n")
        codes = _codes(self.run_gate())
        self.assertIn('NAVER_ENDPOINT_NEW', codes)
        self.assertIn('USER_AGENT_NEW', codes)

    def test_등록된_네이버_endpoint_와_UA_는_통과한다(self):
        _write(self.repo, 'ok.py', "u = f'https://api.finance.naver.com/service/itemSummary.naver?itemcode={code}'\nr = 'https://finance.naver.com'\nh = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'\n")
        codes = _codes(self.run_gate())
        self.assertNotIn('NAVER_ENDPOINT_NEW', codes)
        self.assertNotIn('USER_AGENT_NEW', codes)

    def test_호출_빈도_증가는_잡힌다(self):
        _write(self.repo, '.github/workflows/update-prices.yml', 'steps:\n  run: |\n    sleep 3\n    sleep 300\n')
        self.assertIn('NAVER_RATE_INCREASED', _codes(self.run_gate()))
        _write(self.repo, '.github/workflows/update-prices.yml', 'steps:\n  run: |\n    sleep 600\n')
        _write(self.repo, 'tickers.js', ''.join('{"code":"%06d"}\n' % i for i in range(601)))
        self.assertIn('NAVER_RATE_INCREASED', _codes(self.run_gate()))


class RequireCli(unittest.TestCase):
    def run_cli(self, *args):
        proc = subprocess.run([sys.executable, os.path.join(HERE, 'legal_source_gate.py'), *args],
                              capture_output=True, text=True, cwd=HERE, timeout=120)
        return proc.returncode, proc.stdout + proc.stderr

    def test_닫힌_게이트는_종료코드_2_열린_게이트는_0(self):
        code, out = self.run_cli('--require', 'kind:automatedCollection')
        self.assertEqual(code, 2)
        self.assertIn('LEGAL_GATE CLOSED', out)
        self.assertIn('LEGAL_USE_UNVERIFIED', out)
        code, out = self.run_cli('--require', 'github_api:automatedCollection')
        self.assertEqual(code, 0)
        self.assertIn('LEGAL_GATE OPEN', out)

    def test_모르는_출처나_게이트_이름은_닫힘이다(self):
        self.assertEqual(self.run_cli('--require', 'nobody:automatedCollection')[0], 2)
        self.assertEqual(self.run_cli('--require', 'kind:everything')[0], 2)

    def test_전체_검사_CLI_는_현재_저장소에서_0으로_끝난다(self):
        code, out = self.run_cli()
        self.assertEqual(code, 0, out[-2000:])
        self.assertIn('PASS', out)
        self.assertIn('합법 확인이 아님', out)


if __name__ == '__main__':
    unittest.main()
