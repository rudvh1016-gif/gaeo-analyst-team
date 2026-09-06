"""Assemble index.html with its cacheable first-party CSS and app source for tests."""
from pathlib import Path
import re

# 화면을 열 때만 받는 지연 로딩 UI 파일. 브라우저에서는 GaeoFeatures가 <script>로 주입한다.
# 소스 계약 테스트에는 "app.js 안에 있는가"가 아니라 "화면 코드에 있는가"가 중요하므로
# 문서 순서 뒤에 이어 붙인다. ⚠️ 이 목록이 비면 분리된 화면의 계약이 조용히 사라진다.
LAZY_UI = ("scorecard-ui.js", "rotation-ui.js", "full-market-ui.js")


def read_app_document(root=None):
    base = Path(root or Path(__file__).resolve().parent)
    html = (base / "index.html").read_text(encoding="utf-8")
    css = (base / "app-shell.css").read_text(encoding="utf-8")
    app = (base / "app.js").read_text(encoding="utf-8")
    lazy = "\n".join(
        f"<script>\n{(base / name).read_text(encoding='utf-8')}</script>"
        for name in LAZY_UI if (base / name).exists()
    )
    html = re.sub(
        r'<link rel="stylesheet" href="app-shell\.css\?v=[^"]+">',
        lambda _: f"<style>\n{css}</style>",
        html,
        count=1,
    )
    html = re.sub(
        r'<script src="app\.js\?v=[^"]+"[^>]*></script>',
        lambda _: f"<script>\n{app}</script>\n{lazy}",
        html,
        count=1,
    )
    return html


def read_app_scripts(root=None):
    """화면 코드 전체(app.js + 지연 로딩 *-ui.js)를 한 덩어리 문자열로 돌려준다.

    app.js만 읽던 테스트가 2026-09-06 성적표 분리 이후 화면 코드의 일부를 못 보게 됐다.
    "app.js 안에 있는가"가 아니라 "화면 코드에 있는가"를 봐야 하므로 이 함수를 쓴다.
    """
    base = Path(root or Path(__file__).resolve().parent)
    parts = [(base / "app.js").read_text(encoding="utf-8")]
    parts += [(base / name).read_text(encoding="utf-8")
              for name in LAZY_UI if (base / name).exists()]
    return "\n".join(parts)
