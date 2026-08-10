from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parent


class RotationWorkflowTest(unittest.TestCase):
    def test_intraday_workflow_builds_and_commits_rotation_outputs(self):
        workflow = (ROOT / ".github/workflows/update-analysis.yml").read_text(encoding="utf-8")
        self.assertIn("compute_rotation.py --mode intraday", workflow)
        self.assertIn("rotation_snapshot.js", workflow)
        self.assertIn("rotation_model.json", workflow)
        self.assertIn("rotation_archive.json", workflow)

    def test_maintenance_workflow_has_manual_and_scheduled_backtest(self):
        path = ROOT / ".github/workflows/rotation-maintenance.yml"
        self.assertTrue(path.exists())
        workflow = path.read_text(encoding="utf-8")
        self.assertIn("workflow_dispatch:", workflow)
        self.assertIn("schedule:", workflow)
        self.assertIn("backtest_rotation.py", workflow)
        self.assertNotIn("pull_request:", workflow)


if __name__ == "__main__":
    unittest.main()
