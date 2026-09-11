#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""사건 분류 — '발견' 과 '현재 미해결' 을 가른다.

제목은 전부 2026-09-11 실제 수집에서 관측된 것이다(지어낸 제목이 아니다).
"""
import unittest

import corporate_action_classify as cc


class SubjectTests(unittest.TestCase):
    def test_a_subsidiary_matter_is_not_this_stocks_event(self):
        # 실측: 이 제목들 때문에 2종목이 잘못 차단돼 있었다.
        for title in ('유상증자결정(종속회사의주요경영사항)',
                      '유무상증자결정(종속회사의주요경영사항)',
                      '주식배당결정(자회사의 주요경영사항)',
                      '회사합병결정(종속회사의주요경영사항)'):
            self.assertEqual(cc.classify(title)['subject'], cc.SUBSIDIARY, title)

    def test_the_companys_own_filing_is_its_own_event(self):
        for title in ('주요사항보고서(유상증자결정)', '주요사항보고서(감자결정)',
                      '주요사항보고서(회사합병결정)', '주식배당결정'):
            self.assertEqual(cc.classify(title)['subject'], cc.SELF, title)


class StageTests(unittest.TestCase):
    def test_a_correction_is_not_a_new_event(self):
        for title in ('[기재정정]주요사항보고서(감자결정)', '[첨부정정]주요사항보고서(유상증자결정)'):
            self.assertEqual(cc.classify(title)['stage'], cc.CORRECTION, title)

    def test_completion_and_result_reports_are_marked_apart_from_decisions(self):
        self.assertEqual(cc.classify('합병등종료보고서(합병)')['stage'], cc.COMPLETION)
        self.assertEqual(cc.classify('증권발행실적보고서(합병등)')['stage'], cc.CORRECTION
                         if False else cc.RESULT)
        self.assertEqual(cc.classify('주요사항보고서(무상증자결정)')['stage'], cc.DECISION)

    def test_a_title_holding_both_halt_and_release_needs_the_document(self):
        # 실측 제목: '매매거래정지및정지해제(중요내용공시)' — 지금 상태를 제목만으로 알 수 없다.
        info = cc.classify('매매거래정지및정지해제(중요내용공시)              ')
        self.assertTrue(info['needsDocument'])


class SummaryTests(unittest.TestCase):
    def finding(self, rcept, title):
        return {'id': rcept, 'title': title}

    def test_one_event_with_its_corrections_counts_once(self):
        out = cc.summarize([self.finding('R1', '주요사항보고서(감자결정)'),
                            self.finding('R2', '[기재정정]주요사항보고서(감자결정)'),
                            self.finding('R3', '[첨부정정]주요사항보고서(감자결정)')])
        self.assertEqual(len(out['events']), 1)
        self.assertEqual(out['events'][0]['documentCount'], 3)
        self.assertEqual(out['openSelf'], 1)

    def test_a_subsidiary_only_company_is_not_blocked(self):
        out = cc.summarize([self.finding('R1', '유상증자결정(종속회사의주요경영사항)')])
        self.assertEqual(out['openSelf'], 0)
        self.assertEqual(out['subsidiary'], 1)

    def test_a_completion_report_never_clears_the_exchange_side(self):
        # 회사의 합병 완료와 거래소의 변경상장·거래재개 완료는 다른 사실이다.
        out = cc.summarize([self.finding('R1', '주요사항보고서(회사합병결정)'),
                            self.finding('R2', '합병등종료보고서(합병)')])
        event = out['events'][0]
        self.assertTrue(event['companyCompleted'])
        self.assertFalse(event['exchangeConfirmed'])
        self.assertTrue(event['open'])            # 거래소 반영이 미확인이므로 계속 막는다

    def test_different_families_are_different_events(self):
        out = cc.summarize([self.finding('R1', '주요사항보고서(감자결정)'),
                            self.finding('R2', '주요사항보고서(회사합병결정)')])
        self.assertEqual(out['openSelf'], 2)

    def test_nothing_found_is_no_event(self):
        self.assertEqual(cc.summarize([])['openSelf'], 0)
        self.assertEqual(cc.summarize(None)['events'], [])


if __name__ == '__main__':
    unittest.main()
