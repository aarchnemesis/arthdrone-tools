# Arthdrone Tools v2.1

Ferramenta interna em Python para automação de **S&R** (Sort & Remove) em inspeções de pás eólicas com drones DJI. Otimiza o fluxo entre ArthDrone e Arthnex: organiza fotos, corrige Z zerado, processa JSON, converte CSVs, organiza pastas.

**Reduz o tempo de processamento de 18 para 9 minutos por aerogerador, dobrando a produtividade diária.**

Desenvolvida para uso interno, com foco em precisão e velocidade. Modular, bilíngue (PT-BR/EN), com interface gráfica nativa via PyWebView + React.

---

## Status

- **Versão:** 2.1
- **Interface:** GUI nativa (PyWebView + React) — sem janela de terminal
- **Uso principal:** Windows 10/11 64-bit
- **Acesso:** Repositório privado (somente colaboradores convidados)
- **Binário Windows:** Disponível na Release v2.1 (pasta compactada, sem instalação)

---

## Como usar (usuário final)

1. Baixe o zip da Release v2.1
2. Descompacte a pasta `ArthdroneTools/` em qualquer lugar (Desktop, pendrive, etc.)
3. Clique duas vezes em `ArthdroneTools.exe`
4. A interface abre diretamente — sem janela de terminal
5. Selecione o módulo desejado na barra lateral
6. Clique nos campos para selecionar arquivos e pastas via dialogo nativo do Windows
7. Configure as opções e clique no botão de execução

> **Requisitos:** Windows 10/11 64-bit com WebView2 Runtime (já instalado por padrão no Windows 11 e na maioria dos Windows 10 atualizados). Se necessário, o próprio Windows oferece instalar automaticamente.

---

## Módulos

### 1 — Organizar Imagens S&R
Lê o CSV exportado da plataforma Arthnex. Para cada linha, localiza a foto correspondente na pasta selecionada (busca em subpastas, case-insensitive).

- **Modo Platform (P):** renomeia a foto para o formato da plataforma com metadados embutidos — `Blade_Z_Order_mm_px.jpg`
- **Modo Recovery (R):** mantém o nome DJI original
- **Dry-run:** simula o processo sem copiar nenhum arquivo — útil para verificar quantas fotos serão encontradas antes de executar
- Caracteres inválidos no nome da pá (ex: `*`) são removidos automaticamente para compatibilidade com o Windows

### 2 — Converter CSV
Converte o separador do CSV de ponto-e-vírgula para vírgula, tornando o arquivo compatível com Excel e outras ferramentas. Gera opcionalmente um arquivo `.xlsx` na mesma pasta do CSV original.

### 3 — GPS + Z Relativo
Extrai a altitude GPS do EXIF de cada foto na pasta. Após carregar a lista, o usuário seleciona manualmente a foto da raiz da pá (Z=0) — necessário porque o voo pode ser feito em qualquer sentido (root-to-tip ou tip-to-root). Gera `gps_z_relativo.csv` com a progressão em mm a pir da raiz escolhida.

### 4 — Processar JSON
Lê o `photo_data.json` gerado pelo ArthDrone e gera os CSVs para o Image Uploader. Ordena as fotos por timestamp DJI e aplica inversão TipToRoot para as regiões SS e PS. Gera um CSV por pá e o arquivo `photo_data_matched.csv` com a ligação completa entre metadados e caminhos reais das fotos.

### 5 — Organizar Fotos
Usa o JSON como mapa para criar as pastas A/B/C e copiar as fotos brutas do SD card para os caminhos corretos antes de rodar o Módulo 4.

### 6 — Documentação
Manual completo integrado à interface, disponível em PT-BR e EN.

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
├── main_gui.py           # Launcher PyWebView
├── api.py                # Bridge Python ↔ JavaScript
├── api_functions.py      # Lógica de cada módulo (versão GUI)
├── utils.py              # Funções utilitárias compartilhadas
├── translations.py       # Sistema i18n PT-BR / EN (CLI legado)
├── colors.py             # Paleta de cores CLI (legado)
├── organize_images.py    # Módulo 1 (CLI legado)
├── convert_csv.py        # Módulo 2 (CLI legado)
├── extract_gps_z.py      # Módulo 3 (CLI legado)
├── process_json.py       # Módulo 4 (CLI legado)
├── organize_json_photos.py # Módulo 5 (CLI legado)
├── documentation.py      # Módulo 6 (CLI legado)
├── main.py               # Launcher CLI (legado)
├── icone.ico             # Ícone da aplicação
├── arthdrone.spec        # Configuração PyInstaller
└── frontend/
    ├── src/
    │   ├── App.jsx       # Interface React
    │   ├── icon.js       # Ícone em base64
    │   └── main.jsx      # Entry point React
    ├── vite.config.js    # Configuração Vite (base: './')
    └── dist/             # Build de produção (gerado pelo npm run build)
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
