# Arthdrone Tools v4.0.0

Ferramenta interna em Python e React para automação de **S&R** (Sort & Remove) em inspeções de aerogeradores com drones DJI. Otimiza o fluxo entre ArthDrone e plataformas de laudo: organiza fotos, corrige Z zerado, recupera fotos perdidas, separa pás misturadas, converte CSVs e organiza pastas.

**A nova versão Automação S&R de Externas não apenas acelera o processo, mas corrige ativamente falhas humanas e pulos de frame de voo com extrema precisão.**

Desenvolvida para uso interno, com foco em precisão e velocidade. Modular, bilíngue (PT-BR/EN), com interface gráfica nativa via PyWebView + React.

---

## Status

- **Versão:** 4.0.0
- **Interface:** GUI nativa (PyWebView + React)
- **Uso principal:** Windows 10/11 64-bit
- **Binário Windows:** Disponível na Release v4.0.0 (pasta compactada)

---

## Como usar (usuário final)

1. Baixe o zip da Release v4.0.0
2. Descompacte a pasta `ArthdroneTools/`
3. Clique duas vezes em `ArthdroneTools.exe`
4. A interface abre diretamente
5. Selecione o módulo desejado na barra lateral agrupada em abas
6. Clique nos campos para selecionar arquivos
7. Configure opções pertinentes e clique para executar

---

## Módulos Principais

### Fluxo S&R e Ferramentas
- **1 — Organizar Imagens S&R:** Lê o CSV da plataforma e joga as fotos nas subpastas certas de A/B/C.
- **2 — Processar JSON:** Lê o `photo_data.json` do ArtDrone antes do upload.
- **3 — Organizar Fotos:** Copia pro HD externo ou base organizando as originais.
- **4 — Converter CSV:** Quebra galho para salvar em formato com vírgulas/xlsx.
- **5 — GPS + Z Relativo:** Tira o metadado puro do GPS da DJI e converte em altitude para o laudo.

### Correções (Onde a Mágica Acontece)
- **6 — Corrigir JSON (Blade Split):** Lê o gap temporal longo (>60s) e quebra um relatório que acoplou duas pás fisicamente no mesmo arquivo contínuo, salvando 2 CSVs cirúrgicos prontos pra DB.
- **7 — Corrigir Z=0:** Repara colunas "Location" da plataforma que vieram corrompidas (zeradas). Usurpando a altimetria relativa do drone, recalcula a distância real sem afetar as fotos boas do CSV.
- **8 — Recuperar Perdas:** Escaneia o SD Card atrás de pulos numéricos da câmera, resgata as imagens e re-injetam Location baseados nas âncoras adjacentes usando GPS Real.

### Suporte
- **9 — Documentação:** Manual integrado step-by-step atualizado.

---

## Limitações e Red Flags

- **GPS:** depende do EXIF das fotos DJI — neblina ou falha do drone pode zerar a altitude
- **Match de nomes:** case-insensitive, mas extensões diferentes (ex: `.jpg` vs `.JPG`) podem causar falhas em alguns sistemas — verifique antes
- **mm/px:** não calculado automaticamente — valor vem do JSON ou do CSV exportado da plataforma
- **Erros comuns:** pasta vazia, coluna de imagem vazia no CSV, nomes com caminho completo no campo `Original Image`
- **WebView2:** necessário para a interface gráfica — presente por padrão no Windows 11 e Windows 10 atualizado

---

## Estrutura do Projeto

```
Arthdrone-Tools/
├── main_gui.py              # Launcher PyWebView
├── api.py                   # Bridge Python ↔ JavaScript
├── api_functions.py         # Lógica centralizada de todos os módulos
├── utils.py                 # Funções utilitárias compartilhadas
├── version.py               # Fonte única de versão (v3.0.0)
├── translations.py          # Sistema i18n PT-BR / EN (CLI)
├── colors.py                # Paleta de cores CLI
├── organize_images.py       # Módulo 1 — wrapper CLI sobre api_functions
├── convert_csv.py           # Módulo 2 — wrapper CLI sobre api_functions
├── extract_gps_z.py         # Módulo 3 — wrapper CLI sobre api_functions
├── process_json.py          # Módulo 4 — wrapper CLI sobre api_functions
├── organize_json_photos.py  # Módulo 5 — wrapper CLI sobre api_functions
├── documentation.py         # Módulo 6 (CLI)
├── main.py                  # Launcher CLI
├── icone.ico                # Ícone da aplicação
├── arthdrone.spec           # Configuração PyInstaller
├── tests/
│   ├── test_utils.py        # Testes unitários — utils.py
│   └── test_api_functions.py # Testes unitários — api_functions.py
└── frontend/
    ├── src/
    │   ├── App.jsx           # Componente raiz React (~160 linhas)
    │   ├── App.css           # Design system com CSS custom properties
    │   ├── icon.js           # Ícone em base64
    │   ├── main.jsx          # Entry point React
    │   ├── components/       # TopBar, Sidebar, ModuleForm, LogPanel, etc.
    │   ├── constants/        # translations.js, icons.jsx
    │   └── hooks/            # usePyWebView.js
    ├── vite.config.js        # Configuração Vite (base: './')
    └── dist/                 # Build de produção (gerado pelo npm run build)
```

---

## Build e Empacotamento

### Pré-requisitos

```powershell
py -3.11 -m pip install pyinstaller pywebview pandas pillow openpyxl pythonnet
```

### Build do frontend

```powershell
cd frontend
npm install
npm run build
cd ..
```

### Empacotar

```powershell
py -3.11 -m PyInstaller arthdrone.spec --clean
```

O executável final fica em `dist/ArthdroneTools/`. Zipar essa pasta para distribuir.

---

## Changelog

Ver [CHANGELOG.md](./CHANGELOG.md)

---

Desenvolvido por Pedro Oliveira ([@aarchnemesis](https://github.com/aarchnemesis))  
Última atualização: Março 2026


### ⚠️ Windows — Erro ao abrir em ambientes corporativos

Se ao executar aparecer erro de runtime (.dll), o Windows pode ter bloqueado
os arquivos por segurança. Abra o PowerShell na pasta do programa e rode:

Get-ChildItem -Recurse | Unblock-File