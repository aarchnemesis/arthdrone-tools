translations = {
    "pt": {
        "menu_title": "ARTHDRONE TOOLS",
        "choose_language": "Escolha o idioma / Choose language:",
        "lang_pt": "1 - Português (Brasil)",
        "lang_en": "2 - English",
        "option_1": "1 - Organizar imagens S&R (a partir do CSV)",
        "option_2": "2 - Converter CSV",
        "option_3": "3 - Extrair GPS + Z relativo (referência raiz)",
        "option_4": "4 - Processar JSON → CSVs da pá",
        "option_5": "5 - Organizar fotos usando JSON como mapa",
        "option_6": "6 - Documentação",
        "option_7": "7 - Corrigir JSON (Dividir Pás Misturadas)",
        "option_0": "0 - Sair",
        "exit_message": "Saindo... Bom S&R! 🚁",
        "drag_csv": "Arraste o CSV aqui ou digite o caminho:",
        "drag_photos": "Arraste a pasta das fotos (busca em subpastas):",
        "json_drag": "Arraste o arquivo JSON aqui ou digite o caminho:",
        "mode_prompt": "Modo [P = Platform | R = Recovery] (default P): ",
        "dry_prompt": "Dry-run? [S/N] (default N): ",
        "photos_found": "Encontrados {} fotos.",
        "no_photos": "❌ Nenhuma foto .JPG/.JPEG encontrada!",
        "copied": "✔ {} imagens organizadas em OUTPUT/ (ao lado do CSV)",
        "not_found": "❌ NÃO ENCONTRADO: {}",
        "enter_to_return": "Pressione Enter para voltar...",
        "invalid_option": "Opção inválida. Tente novamente.",
        "documentation_title": "=== Documentação Arthdrone Tools ===",
        "doc_text": """Ferramenta para automação de S&R de pás eólicas.

1 - Organizar imagens S&R
   Lê CSV da plataforma (Blade SN, Location, Pixel MM, Side, Original Image)
   Copia fotos da pasta indicada para OUTPUT/Blade/Region (criada ao lado do CSV)
   Modo P: renomeia para formato plataforma (Blade_Z_Order_mm_px.jpg)
   Modo R: mantém nome original
   Dry-run: testa sem copiar

2 - Converter CSV
   Converte CSV separado por ; para , (compatível com Excel)
   Gera também .xlsx opcional

3 - Extrair GPS + Z relativo
   Extrai altitude GPS das fotos
   Usa foto da raiz escolhida como Z=0
   Gera CSV com progressão em mm

4 - Processar JSON → CSVs da pá
   Lê JSON do drone e gera CSVs para Image Uploader
   Ordena por timestamp DJI + inversão para TipToRoot (SS/PS)
   Preenche image_id com caminho relativo

5 - Organizar fotos usando JSON como mapa
   Cria pastas A/B/C e copia fotos brutas para os caminhos do JSON

6 - Documentação
   Esta tela

7 - Corrigir JSON (Dividir Pás Misturadas)
   Identifica falhas de gravação do JSON do DJI dividindo as posições misturadas.

Dicas gerais:
- Arraste arquivos/pastas para o terminal (funciona no Konsole, Kitty, Windows Terminal)
- OUTPUT sempre criado na mesma pasta do CSV arrastado
- Em caso de erro: verifique se as fotos existem na pasta indicada
- O programa é terminal puro: não tem GUI, mas é rápido e leve
""",
    },
    "en": {
        "menu_title": "ARTHDRONE TOOLS",
        "choose_language": "Choose language / Escolha o idioma:",
        "lang_pt": "1 - Português (Brasil)",
        "lang_en": "2 - English",
        "option_1": "1 - Organize images S&R (from CSV)",
        "option_2": "2 - Convert CSV",
        "option_3": "3 - Extract GPS + Relative Z (root reference)",
        "option_4": "4 - Process JSON → Blade CSVs",
        "option_5": "5 - Organize photos using JSON",
        "option_6": "6 - Documentation",
        "option_7": "7 - Fix JSON (Split Mixed Blades)",
        "option_0": "0 - Exit",
        "exit_message": "Exiting... Good S&R! 🚁",
        "drag_csv": "Drag the CSV here or type the path:",
        "drag_photos": "Drag the photos folder (searches subfolders):",
        "json_drag": "Drag the JSON file here or type the path:",
        "mode_prompt": "Mode [P = Platform | R = Recovery] (default P): ",
        "dry_prompt": "Dry-run? [Y/N] (default N): ",
        "photos_found": "Found {} photos.",
        "no_photos": "❌ No .JPG/.JPEG photos found!",
        "copied": "✔ {} images organized in OUTPUT/ (next to the CSV)",
        "not_found": "❌ NOT FOUND: {}",
        "enter_to_return": "Press Enter to return...",
        "invalid_option": "Invalid option. Please try again.",
        "documentation_title": "=== Arthdrone Tools Documentation ===",
        "doc_text": """Tool for S&R automation of wind turbine blades.

1 - Organize images S&R (from CSV)
   Reads platform CSV and copies photos to OUTPUT/Blade/Region (created next to the CSV)
   Mode P: renames to platform format
   Mode R: keeps original name
   Dry-run: tests without copying

2 - Convert CSV
   Converts CSV with ; to , (Excel compatible)
   Generates .xlsx optional

3 - Extract GPS + Relative Z
   Extracts GPS altitude from photos
   Uses chosen root photo as Z=0
   Generates CSV with progression in mm

4 - Process JSON → Blade CSVs
   Reads drone JSON and generates CSVs for Image Uploader
   Sorts by DJI timestamp + TipToRoot inversion (SS/PS)
   Fills image_id with relative path

5 - Organize photos using JSON as map
   Creates A/B/C folders and copies raw photos to JSON paths

6 - Documentation
   This screen

7 - Fix JSON (Split Mixed Blades)
   Identifies and splits DJI recording failures where blades were mixed.

Tips:
- Drag files/folders to terminal
- OUTPUT always created next to dragged CSV
- On error: check if photos exist in folder
- The tool is terminal-only: no GUI, but fast and lightweight
""",
    }
}

def t_api(key, lang="pt"):
    return translations.get(lang, translations["pt"]).get(key, key)