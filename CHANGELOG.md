# Changelog

Todas as mudanças notáveis do projeto são documentadas aqui.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [3.0.0] — 2026-03-12

### 🏗️ Arquitetura
- **Frontend componentizado**: `App.jsx` (707 linhas) desmembrado em 10 arquivos — `TopBar`, `Sidebar`, `ModuleForm`, `GpsSelector`, `LogPanel`, `StatusBar`, constantes de tradução/ícones e hook `usePyWebView`
- **CSS design system**: todo CSS inline e `<style>` dinâmico migrado para `App.css` com CSS custom properties (`var(--accent)`, etc.) e tema via `[data-theme="dark"]`
- **Backend unificado**: módulos CLI (`organize_images.py`, `convert_csv.py`, `extract_gps_z.py`, `process_json.py`, `organize_json_photos.py`) refatorados como wrappers finos sobre `api_functions.py`, eliminando duplicação de lógica
- **Versão centralizada**: criado `version.py` como fonte única — importado pelo `main_gui.py` e exibido na UI

### 🐛 Bug Fixes
- Corrigido bug em `organize_images.py`: função `normalize_filename_api_api` tinha nome errado e causava `NameError`
- Corrigido `except:` genérico (bare except) em `utils.py` — agora captura `(ValueError, TypeError)` especificamente
- Substituída API privada `img._getexif()` do Pillow por API pública `img.getexif()` + `get_ifd(IFD.GPSInfo)`
- Removidos imports duplicados internos em `convert_csv.py`

### ✨ Melhorias de UX
- **Validação de inputs**: botão "Executar" desabilitado até todos os campos obrigatórios serem preenchidos
- **Progresso explícito**: backend emite eventos `arthprogress` com `current/total` em vez do frontend tentar parsear regex nos logs
- **Persistência de tema**: `localStorage` em vez de `sessionStorage` — tema e últimos caminhos sobrevivem ao fechar o app
- **Auto-scroll no log**: painel de log rola automaticamente para o final quando novos eventos chegam
- **Limite de logs**: máximo de 500 entradas para evitar consumo excessivo de memória
- **Status bar localizada**: "Pronto" / "Ready" de acordo com o idioma selecionado
- **Sem flash branco**: `background_color` do pywebview alterado para `#1a1d23` (dark mode default)
- **IDs estáveis**: campos de formulário usam `inputId`/`optionId` fixos em vez de labels traduzidos

### 🧪 Testes
- Criados 24 testes unitários com pytest:
  - `test_utils.py`: `format_mm_px`, `format_location_for_name`, `extract_dji_timestamp`, `_normalize_filename`, `normalize_column_names`
  - `test_api_functions.py`: `converter_csv_api` (básico, arquivo inválido, geração .xlsx), validação de colunas em `organizar_imagens_api`

---

## [2.2.0] — 2026-03-12

### Adicionado
- Filtro de tipo de arquivo nos diálogos de seleção — campos CSV aceitam apenas `.csv`, campos JSON aceitam apenas `.json`
- Botão "Abrir pasta" aparece ao lado de "Concluído!" abrindo o OUTPUT diretamente no Explorer
- Persistência do tema claro/escuro entre sessões
- Persistência dos últimos caminhos usados por módulo entre sessões
- Atalho `Ctrl+Enter` para executar o módulo atual
- Geração de `missing_data_YYYY-MM-DD_HHMMSS.txt` na pasta OUTPUT quando há arquivos não encontrados nos módulos 1 e 5
- Validação das colunas obrigatórias do CSV antes de executar o módulo 1

### Alterado
- Log dos módulos 1 e 5 agora é silencioso durante execução — exibe apenas resumo final: `X/Y imagens organizadas · Z não encontradas` e caminho do OUTPUT
- Documentação do módulo 4 atualizada com requisito de estrutura de pastas (JSON deve estar na mesma pasta que A, B e C)

### Corrigido
- Caracteres inválidos no Windows (`*`, `?`, `:` etc.) no blade SN agora são sanitizados também no nome do CSV gerado pelo módulo 4 — correção do mesmo bug que já havia sido tratado no módulo 1
- `useEffect` do atalho `Ctrl+Enter` movido para após a declaração de `handleRun`, corrigindo `ReferenceError: Cannot access before initialization` que causava tela branca após build

---

## [2.1.0] — 2026-03-08

### Adicionado
- **Interface gráfica nativa** via PyWebView + React — substitui a janela de terminal preta
- **Tema claro e escuro** com toggle na topbar
- **Suporte bilíngue PT-BR / EN** na interface gráfica com troca em tempo real
- **Barra de progresso** no topo da janela durante execução dos módulos
- **Ícones SVG** na barra lateral substituindo os números simples
- **Fonte Plus Jakarta Sans** — visual consistente com o ecossistema Windows
- **Módulo 3 (GPS):** seleção manual da foto raiz via lista interativa com altitude de cada foto — elimina ambiguidade do sentido do voo (root-to-tip vs tip-to-root)
- **Log de execução** com ícones por tipo de mensagem (sucesso, aviso, erro, info)
- **Timeout de segurança** de 5 minutos no frontend — desbloqueia o botão automaticamente em caso de falha silenciosa do Python
- **Sanitização automática** de caracteres inválidos no Windows em nomes de pá (ex: `*`, `?`, `:`)
- **Documentação integrada** à interface (Módulo 6) atualizada e sem menção a drag-and-drop

### Corrigido
- `colorama.py` conflitava com a biblioteca `colorama` — renomeado para `colors.py`
- Chave `json_drag` ausente nas traduções causava `KeyError` na inicialização
- `import pandas` ausente em `utils.py` causava falha em todas as funções
- `SUPPORTED_EXTS` continha duplicatas — convertido para `set` com extensões em maiúsculas
- `img.getexif()` não expunha o bloco GPS (tag 34853) dos arquivos DJI — revertido para `img._getexif()` que acessa o dicionário EXIF bruto completo
- Altitude GPS retornada como `Fraction` pelo Pillow em versões recentes causava `TypeError` no formato `:.3f` — adicionada conversão explícita para `float`
- `FOLDER_DIALOG` deprecated no PyWebView — atualizado para `webview.FileDialog.FOLDER` com fallback para versões anteriores
- `window.expose(api)` no PyWebView não aceita instância de classe — corrigido para `js_api=api` no `create_file_dialog`
- Vite gerava paths absolutos (`/assets/...`) incompatíveis com arquivo local — adicionado `base: './'` no `vite.config.js`
- Base64 do ícone inline no `App.jsx` corrompida pelo parser do esbuild — extraído para `icon.js` separado
- Barra escura lateral no PyWebView — corrigido com `html, body, #root { width: 100%; height: 100%; overflow: hidden }`
- `arthdone` não emitido em caso de exceção no Python — adicionado `try/finally` em todos os métodos do `api.py`
- Valores de Z com ponto decimal (ex: `2899.99`) quebravam o nome do arquivo no Windows — `format_location_for_name` já tratava via `int(float())`, confirmado e mantido
- Campos de pasta não abriam diálogo nativo — corrigido o `dialog_type` do `create_file_dialog`

### Alterado
- Campos de entrada substituem drag-and-drop (não suportado de forma confiável pelo WebView2 no Windows) por clique com diálogo nativo do Windows
- Seleção da foto raiz no Módulo 3 agora é sempre manual — remove a heurística de menor altitude que não era confiável para voos bidirecionais
- Placeholders dos campos atualizados para refletir interação por clique
- Modo padrão do Módulo 1 agora é `Platform (P)` quando nenhuma opção selecionada — evita comportamento indefinido

---

## [1.0.0] — 2026-03-06

### Adicionado
- Interface CLI em terminal com menu numerado
- Suporte bilíngue PT-BR / EN via sistema `translations.py`
- **Módulo 1 — Organizar Imagens S&R:** lê CSV da plataforma, copia fotos para `OUTPUT/Blade/Region`, modos Platform e Recovery, dry-run
- **Módulo 2 — Converter CSV:** converte separador `;` para `,`, geração opcional de `.xlsx`
- **Módulo 3 — GPS + Z Relativo:** extração de altitude GPS via EXIF, seleção de foto raiz por número ou nome, geração de `gps_z_relativo.csv`
- **Módulo 4 — Processar JSON:** leitura do `photo_data.json` do ArtDrone, geração de CSVs por pá para o Image Uploader, ordenação por timestamp DJI, inversão TipToRoot para SS/PS
- **Módulo 5 — Organizar Fotos:** cria pastas A/B/C e copia fotos brutas conforme caminhos do JSON
- **Módulo 6 — Documentação:** manual inline no terminal
- Cache de imagens case-insensitive para match robusto de nomes de arquivo
- Empacotamento via PyInstaller — executável Windows sem necessidade de Python instalado

---

[3.0.0]: https://github.com/aarchnemesis/arthdrone-tools/releases/tag/v3.0
[2.2.0]: https://github.com/aarchnemesis/arthdrone-tools/releases/tag/v2.2
[2.1.0]: https://github.com/aarchnemesis/arthdrone-tools/releases/tag/v2.1
[1.0.0]: https://github.com/aarchnemesis/arthdrone-tools/releases/tag/tools
