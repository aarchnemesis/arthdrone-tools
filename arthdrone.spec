# arthdrone.spec
# Uso: pyinstaller arthdrone.spec --clean
#
# Pre-requisitos:
#   pip install pyinstaller pywebview pandas pillow openpyxl
#   cd frontend && npm install && npm run build && cd ..

import sys
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

block_cipher = None

# ─── Dados a empacotar ────────────────────────────────────────────────────────
added_files = [
    ("frontend/dist", "frontend/dist"),
    ("icone.ico", "."),
]

# Inclui os arquivos de dados do pywebview (HTML interno, JS do bridge, etc.)
added_files += collect_data_files("webview")

# ─── Hidden imports ───────────────────────────────────────────────────────────
hidden = [
    # PyWebView — Windows usa WinForms + pythonnet
    "webview",
    "webview.platforms",
    "webview.platforms.winforms",
    "webview.platforms.mshtml",
    "clr",
    "clr_loader",
    # Pandas internals
    "pandas._libs.tslibs.timedeltas",
    "pandas._libs.tslibs.nattype",
    "pandas._libs.tslibs.np_datetime",
    "pandas._libs.tslibs.parsing",
    "pandas._libs.reduction",
    "pandas._libs.ops",
    "pandas._libs.hashtable",
    "pandas._libs.missing",
    "numpy.core._methods",
    "numpy.lib.format",
    # Pillow
    "PIL.Image",
    "PIL.ExifTags",
    "PIL.JpegImagePlugin",
    # Excel
    "openpyxl",
    "openpyxl.styles",
    "openpyxl.utils",
]

# Coleta todos os submodulos do webview automaticamente
hidden += collect_submodules("webview")

a = Analysis(
    ["main_gui.py"],
    pathex=["."],
    binaries=[],
    datas=added_files,
    hiddenimports=hidden,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=["tkinter", "matplotlib", "scipy", "PyQt5", "wx"],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="ArthdroneTools",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    icon="icone.ico",
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=["vcruntime140.dll", "python311.dll"],
    name="ArthdroneTools",
)
