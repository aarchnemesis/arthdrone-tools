# main_gui.py

import sys
import os
import webview
from api import ArthdroneAPI


def get_frontend_path():
    if getattr(sys, 'frozen', False):
        base = sys._MEIPASS
    else:
        base = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(base, "frontend", "dist", "index.html")
    return path if os.path.exists(path) else None


def main():
    api = ArthdroneAPI(window_ref=None)

    frontend_path = get_frontend_path()
    url = frontend_path if frontend_path else "about:blank"

    window = webview.create_window(
        title="Arthdrone Tools v2.1",
        url=url,
        js_api=api,
        width=1000,
        height=680,
        min_size=(800, 560),
        resizable=True,
        background_color="#ffffff",
        easy_drag=False,        # evita conflito com drag de arquivos
    )

    api._window = window

    if not frontend_path:
        print("AVISO: frontend/dist/index.html nao encontrado.")
        print("Rode: cd frontend && npm run build")

    webview.start(debug=False)


if __name__ == "__main__":
    main()
