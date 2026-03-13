#!/bin/bash
# build-appimage.sh — Script completo para gerar o AppImage do Arthdrone Tools
# Uso: chmod +x build-appimage.sh && ./build-appimage.sh
#
# Pré-requisitos:
#   - Python 3.10+ com pip
#   - Node.js + npm
#   - libwebkit2gtk-4.0-dev (ou equivalente na sua distro)
#   - appimagetool (baixado automaticamente se não encontrado)
#
# Dependências Python:
#   pip install pyinstaller pywebview[gtk] pandas pillow openpyxl

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="${PROJECT_DIR}/build-appimage"
APPDIR="${BUILD_DIR}/ArthdroneTools.AppDir"
VERSION="3.0.0"

echo "═══════════════════════════════════════════════════"
echo "  Arthdrone Tools v${VERSION} — Build AppImage"
echo "═══════════════════════════════════════════════════"
echo ""

# ─── 1. Verificar dependências ───────────────────────────────────────────────
echo "▸ Verificando dependências..."

command -v python3 >/dev/null 2>&1 || { echo "❌ python3 não encontrado"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm não encontrado"; exit 1; }
python3 -c "import PyInstaller" 2>/dev/null || { echo "❌ PyInstaller não encontrado. Rode: pip install pyinstaller"; exit 1; }
python3 -c "import webview" 2>/dev/null || { echo "❌ pywebview não encontrado. Rode: pip install pywebview[gtk]"; exit 1; }

echo "  ✔ Dependências OK"

# ─── 2. Build do frontend ────────────────────────────────────────────────────
echo ""
echo "▸ Buildando frontend..."
cd "${PROJECT_DIR}/frontend"
npm install --silent
npm run build
echo "  ✔ Frontend buildado"

# ─── 3. PyInstaller ──────────────────────────────────────────────────────────
echo ""
echo "▸ Empacotando com PyInstaller..."
cd "${PROJECT_DIR}"
python3 -m PyInstaller arthdrone-linux.spec --clean --noconfirm
echo "  ✔ PyInstaller concluído"

# ─── 4. Montar o AppDir ──────────────────────────────────────────────────────
echo ""
echo "▸ Montando AppDir..."
rm -rf "${APPDIR}"
mkdir -p "${APPDIR}/usr/bin"
mkdir -p "${APPDIR}/usr/share/icons/hicolor/256x256/apps"

# Copiar o conteúdo do PyInstaller
cp -r "${PROJECT_DIR}/dist/ArthdroneTools/"* "${APPDIR}/usr/bin/"

# AppRun
cp "${SCRIPT_DIR}/AppRun" "${APPDIR}/AppRun"
chmod +x "${APPDIR}/AppRun"

# .desktop
cp "${SCRIPT_DIR}/ArthdroneTools.desktop" "${APPDIR}/ArthdroneTools.desktop"

# Ícone — converte .ico para .png se ImageMagick estiver disponível
if command -v convert >/dev/null 2>&1; then
    convert "${PROJECT_DIR}/icone.ico[0]" -resize 256x256 "${APPDIR}/arthdrone-tools.png"
    cp "${APPDIR}/arthdrone-tools.png" "${APPDIR}/usr/share/icons/hicolor/256x256/apps/arthdrone-tools.png"
    echo "  ✔ Ícone convertido de .ico para .png"
elif [ -f "${SCRIPT_DIR}/arthdrone-tools.png" ]; then
    cp "${SCRIPT_DIR}/arthdrone-tools.png" "${APPDIR}/arthdrone-tools.png"
    cp "${SCRIPT_DIR}/arthdrone-tools.png" "${APPDIR}/usr/share/icons/hicolor/256x256/apps/arthdrone-tools.png"
    echo "  ✔ Ícone copiado de linux/arthdrone-tools.png"
else
    echo "  ⚠ Ícone não encontrado — coloque arthdrone-tools.png em linux/ ou instale ImageMagick"
    # Cria um PNG placeholder 1x1 transparente para não quebrar o build
    printf '\x89PNG\r\n\x1a\n' > "${APPDIR}/arthdrone-tools.png"
fi

echo "  ✔ AppDir montado"

# ─── 5. Baixar appimagetool se necessário ─────────────────────────────────────
APPIMAGETOOL="${BUILD_DIR}/appimagetool"
if [ ! -f "${APPIMAGETOOL}" ]; then
    echo ""
    echo "▸ Baixando appimagetool..."
    ARCH=$(uname -m)
    wget -q -O "${APPIMAGETOOL}" \
        "https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-${ARCH}.AppImage"
    chmod +x "${APPIMAGETOOL}"
    echo "  ✔ appimagetool baixado"
fi

# ─── 6. Gerar o AppImage ──────────────────────────────────────────────────────
echo ""
echo "▸ Gerando AppImage..."
cd "${BUILD_DIR}"
ARCH=$(uname -m) "${APPIMAGETOOL}" "${APPDIR}" "ArthdroneTools-${VERSION}-${ARCH}.AppImage"

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✔ ArthdroneTools-${VERSION}-$(uname -m).AppImage"
echo "  📁 ${BUILD_DIR}/"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Para testar:"
echo "  chmod +x ArthdroneTools-${VERSION}-$(uname -m).AppImage"
echo "  ./ArthdroneTools-${VERSION}-$(uname -m).AppImage"
echo ""
echo "Para integrar com Gear Lever:"
echo "  Abra o Gear Lever e arraste o .AppImage para a janela"
