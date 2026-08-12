import unittest

from compute_indicators import flow_summary
from analyze_auto import flow_eval


class FlowSummaryTest(unittest.TestCase):
    def test_all_investor_totals_use_the_same_five_trading_days(self):
        rows = [
            {
                "bizdate": "20260811",
                "foreignerPureBuyQuant": "+2,462,529",
                "organPureBuyQuant": "+319,290",
                "individualPureBuyQuant": "-2,684,904",
                "foreignerHoldRatio": "46.60%",
            },
            {
                "bizdate": "20260810",
                "foreignerPureBuyQuant": "-4,394,465",
                "organPureBuyQuant": "+625,055",
                "individualPureBuyQuant": "+3,655,311",
                "foreignerHoldRatio": "46.53%",
            },
            {
                "bizdate": "20260807",
                "foreignerPureBuyQuant": "-1,737,367",
                "organPureBuyQuant": "+36,604",
                "individualPureBuyQuant": "+633,738",
                "foreignerHoldRatio": "46.61%",
            },
            {
                "bizdate": "20260806",
                "foreignerPureBuyQuant": "-3,134,136",
                "organPureBuyQuant": "-1,220,335",
                "individualPureBuyQuant": "+4,225,347",
                "foreignerHoldRatio": "46.63%",
            },
            {
                "bizdate": "20260805",
                "foreignerPureBuyQuant": "+2,298,577",
                "organPureBuyQuant": "-2,078,706",
                "individualPureBuyQuant": "-222,721",
                "foreignerHoldRatio": "46.68%",
            },
        ]

        result = flow_summary(rows, days=5)

        self.assertEqual(result["periodStart"], "8/5")
        self.assertEqual(result["periodEnd"], "8/11")
        self.assertEqual(result["frgnSum"], -4_504_862)
        self.assertEqual(result["orgSum"], -2_318_092)
        self.assertEqual(result["indiSum"], 5_606_771)
        self.assertEqual(result["todayIndi"], -2_684_904)
        self.assertIn("개인 순매수 5,606,771주", flow_eval(result)["findings"][0])


if __name__ == "__main__":
    unittest.main()
