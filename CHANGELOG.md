# Changelog

Todas as mudanças notáveis do projeto são documentadas aqui.  
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [2.1] — 2026-03-08

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

## [1.0] — 2026-03-06

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

[2.1]: https://github.com/aarchnemesis/arthdrone-tools/releases/tag/v2.1
[1.0]: https://github.com/aarchnemesis/arthdrone-tools/releases/tag/tools
