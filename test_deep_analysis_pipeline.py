from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parent


class DeepAnalysisPipelineContract(unittest.TestCase):
    def read(self, relative):
        return (ROOT / relative).read_text(encoding="utf-8")

    def test_archive_never_truncates_historical_snapshots(self):
        source = self.read("archive_analysis.py")
        self.assertNotIn("ARCHIVE_CAP", source)
        self.assertNotRegex(source, r"full_archive\[code\]\s*=\s*full_archive\[code\]\[-")

    def test_future_snapshots_persist_historical_identity(self):
        source = self.read("archive_analysis.py")
        for field in ("snapshotId", "ticker", "stockName", "sector", "analysisCreatedAt"):
            self.assertIn(f'"{field}"', source)
        self.assertIn('load_ticker_metadata', source)

    def test_workflow_generates_and_commits_all_derived_outputs(self):
        source = self.read(".github/workflows/update-analysis.yml")
        archive_at = source.index("archive_analysis.py --auto")
        generate_at = source.index("node generate_deep_analysis.js")
        sitemap_at = source.index("node generate_sitemap.js")
        self.assertLess(archive_at, generate_at)
        self.assertLess(generate_at, sitemap_at)
        self.assertRegex(source, r"git add[^\n]*analysis_archive\.js")
        self.assertIn("deep_analysis_latest.js", source)
        self.assertIn("deep_analysis_manifest.json", source)
        self.assertRegex(source, r"git add[^\n]*research/deep-analysis")

    def test_sitemap_automatically_reads_generated_manifest(self):
        source = self.read("generate_sitemap.js")
        self.assertIn("deep_analysis_manifest.json", source)
        self.assertIn("deepManifest.records", source)
        self.assertIn("deepManifest.archivePages", source)

    def test_permanent_rule_and_agent_pointers_exist(self):
        rule = self.read("docs/DEEP_ANALYSIS_PUBLISHING.md")
        self.assertIn("정밀분석 ≠ 종목공부", rule)
        self.assertIn("SAVE → PUBLISH → LINK → ARCHIVE → SURFACE ON HOME → ADD TO SITEMAP", rule)
        self.assertIn("generate_deep_analysis.js", rule)
        for relative in ("AGENTS.md", "CLAUDE.md", ".claude/skills/종목분석 스킬/SKILL.md"):
            self.assertIn("docs/DEEP_ANALYSIS_PUBLISHING.md", self.read(relative), relative)


if __name__ == "__main__":
    unittest.main()
