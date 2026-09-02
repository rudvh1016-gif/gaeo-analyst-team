"""Assemble index.html with its cacheable first-party CSS and app source for tests."""
from pathlib import Path
import re


def read_app_document(root=None):
    base = Path(root or Path(__file__).resolve().parent)
    html = (base / "index.html").read_text(encoding="utf-8")
    css = (base / "app-shell.css").read_text(encoding="utf-8")
    app = (base / "app.js").read_text(encoding="utf-8")
    html = re.sub(
        r'<link rel="stylesheet" href="app-shell\.css\?v=[^"]+">',
        lambda _: f"<style>\n{css}</style>",
        html,
        count=1,
    )
    html = re.sub(
        r'<script src="app\.js\?v=[^"]+"[^>]*></script>',
        lambda _: f"<script>\n{app}</script>",
        html,
        count=1,
    )
    return html
