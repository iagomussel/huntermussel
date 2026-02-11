import tempfile
import unittest
from pathlib import Path

from app import resolve_index_path


class TestFrontendServing(unittest.TestCase):
    def test_prefers_dist_index_when_present(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            dist = base / "dist"
            dist.mkdir(parents=True)
            (dist / "index.html").write_text("dist")
            (base / "index.html").write_text("root")

            self.assertEqual(resolve_index_path(base), dist / "index.html")

    def test_falls_back_to_static_index(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            (base / "index.html").write_text("root")

            self.assertEqual(resolve_index_path(base), base / "index.html")


if __name__ == "__main__":
    unittest.main()
