// constants/translations.js — Traduções e conteúdo de documentação

export const translations = {
  pt: {
    title: "ARTHDRONE TOOLS", subtitle: "Automacao S&R de Pas Eolicas",
    modules: [
      { id: 1, label: "Organizar Imagens", icon: "organize", short: "S&R via CSV" },
      { id: 2, label: "Converter CSV",     icon: "csv",      short: "CSV para Excel" },
      { id: 3, label: "GPS + Z Relativo",  icon: "gps",      short: "Altitude relativa" },
      { id: 4, label: "Processar JSON",    icon: "json",     short: "JSON para CSVs" },
      { id: 5, label: "Organizar Fotos",   icon: "photos",   short: "Fotos via JSON" },
      { id: 6, label: "Documentacao",      icon: "docs",     short: "Manual de uso" },
    ],
    fields: {
      1: {
        title: "Organizar Imagens S&R",
        desc: "Le o CSV da plataforma e organiza as fotos em OUTPUT/Blade/Region",
        inputs: [
          { inputId: "csv_file",    label: "Arquivo CSV",    placeholder: "Clique para selecionar o CSV da plataforma", type: "file",   fileType: "csv"    },
          { inputId: "photos_dir",  label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta com as fotos", type: "folder" },
        ],
        options: [
          { optionId: "mode",    label: "Modo",    choices: ["Platform (P)", "Recovery (R)"] },
          { optionId: "dry_run", label: "Dry-run", choices: ["Nao", "Sim"] },
        ],
        action: "Organizar Imagens",
      },
      2: {
        title: "Converter CSV",
        desc: "Converte CSV separado por ; para , compativel com Excel",
        inputs: [
          { inputId: "csv_file", label: "Arquivo CSV", placeholder: "Clique para selecionar o CSV", type: "file", fileType: "csv" },
        ],
        options: [
          { optionId: "gen_xlsx", label: "Gerar .xlsx", choices: ["Nao", "Sim"] },
        ],
        action: "Converter CSV",
      },
      3: {
        title: "Extrair GPS + Z Relativo",
        desc: "Extrai altitude GPS das fotos e calcula progressao relativa em mm",
        inputs: [
          { inputId: "photos_dir", label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta com as fotos", type: "folder" },
        ],
        options: [],
        action: "Extrair GPS",
      },
      4: {
        title: "Processar JSON",
        desc: "Le JSON do drone e gera CSVs para o Image Uploader com sequencia correta",
        inputs: [
          { inputId: "json_file", label: "Arquivo JSON", placeholder: "Clique para selecionar o arquivo JSON", type: "file", fileType: "json" },
        ],
        options: [],
        action: "Processar JSON",
      },
      5: {
        title: "Organizar Fotos pelo JSON",
        desc: "Cria pastas A/B/C e copia as fotos brutas para os caminhos definidos no JSON",
        inputs: [
          { inputId: "json_file",  label: "Arquivo JSON",   placeholder: "Clique para selecionar o arquivo JSON",       type: "file",   fileType: "json"   },
          { inputId: "photos_dir", label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta com as fotos", type: "folder" },
        ],
        options: [],
        action: "Organizar Fotos",
      },
      6: {
        title: "Documentacao",
        desc: "Manual completo da ferramenta",
        inputs: [], options: [], action: null, doc: true,
      },
    },
    log_title: "Log de Execucao",
    log_placeholder: "A saida do processo aparecera aqui apos executar.",
    clear: "Limpar",
    select_root: "Selecione a foto raiz (Z=0)",
    root_selected: "Raiz selecionada",
    load_photos: "Carregar fotos",
    loading: "Lendo...",
    processing: "Processando...",
    done: "Concluido!",
    open_output: "Abrir pasta",
    ready: "Pronto",
  },
  en: {
    title: "ARTHDRONE TOOLS", subtitle: "Wind Blade S&R Automation",
    modules: [
      { id: 1, label: "Organize Images",  icon: "organize", short: "S&R from CSV" },
      { id: 2, label: "Convert CSV",      icon: "csv",      short: "CSV to Excel" },
      { id: 3, label: "GPS + Relative Z", icon: "gps",      short: "Relative altitude" },
      { id: 4, label: "Process JSON",     icon: "json",     short: "JSON to CSVs" },
      { id: 5, label: "Organize Photos",  icon: "photos",   short: "Photos via JSON" },
      { id: 6, label: "Documentation",    icon: "docs",     short: "User manual" },
    ],
    fields: {
      1: {
        title: "Organize S&R Images",
        desc: "Reads the platform CSV and organizes photos into OUTPUT/Blade/Region",
        inputs: [
          { inputId: "csv_file",   label: "CSV File",      placeholder: "Click to select the platform CSV file", type: "file",   fileType: "csv"    },
          { inputId: "photos_dir", label: "Photos Folder", placeholder: "Click to select the folder with photos", type: "folder" },
        ],
        options: [
          { optionId: "mode",    label: "Mode",     choices: ["Platform (P)", "Recovery (R)"] },
          { optionId: "dry_run", label: "Dry-run",  choices: ["No", "Yes"] },
        ],
        action: "Organize Images",
      },
      2: {
        title: "Convert CSV",
        desc: "Converts semicolon-separated CSV to comma-separated, compatible with Excel",
        inputs: [
          { inputId: "csv_file", label: "CSV File", placeholder: "Click to select the CSV file", type: "file", fileType: "csv" },
        ],
        options: [
          { optionId: "gen_xlsx", label: "Generate .xlsx", choices: ["No", "Yes"] },
        ],
        action: "Convert CSV",
      },
      3: {
        title: "Extract GPS + Relative Z",
        desc: "Extracts GPS altitude from photos and calculates relative progression in mm",
        inputs: [
          { inputId: "photos_dir", label: "Photos Folder", placeholder: "Click to select the folder with photos", type: "folder" },
        ],
        options: [],
        action: "Extract GPS",
      },
      4: {
        title: "Process JSON",
        desc: "Reads drone JSON and generates CSVs for Image Uploader with correct sequence",
        inputs: [
          { inputId: "json_file", label: "JSON File", placeholder: "Click to select the JSON file", type: "file", fileType: "json" },
        ],
        options: [],
        action: "Process JSON",
      },
      5: {
        title: "Organize Photos via JSON",
        desc: "Creates A/B/C folders and copies raw photos to paths defined in JSON",
        inputs: [
          { inputId: "json_file",  label: "JSON File",     placeholder: "Click to select the JSON file",          type: "file",   fileType: "json"   },
          { inputId: "photos_dir", label: "Photos Folder", placeholder: "Click to select the folder with photos", type: "folder" },
        ],
        options: [],
        action: "Organize Photos",
      },
      6: {
        title: "Documentation",
        desc: "Complete tool manual",
        inputs: [], options: [], action: null, doc: true,
      },
    },
    log_title: "Execution Log",
    log_placeholder: "Process output will appear here after running.",
    clear: "Clear",
    select_root: "Select root photo (Z=0)",
    root_selected: "Root selected",
    load_photos: "Load photos",
    loading: "Reading...",
    processing: "Processing...",
    done: "Done!",
    open_output: "Open folder",
    ready: "Ready",
  },
};

export const docContent = {
  pt: [
    { title: "1 — Organizar Imagens S&R", body: "Le o CSV exportado da plataforma Artnex. Para cada linha, localiza a foto correspondente na pasta selecionada (busca em subpastas). Modo Platform renomeia a foto para o formato da plataforma com os metadados embutidos. Modo Recovery mantem o nome DJI original. Dry-run simula o processo sem copiar nenhum arquivo — util para verificar quantas fotos serao encontradas antes de executar." },
    { title: "2 — Converter CSV",          body: "Converte o separador do CSV de ponto-e-virgula para virgula, tornando o arquivo compativel com Excel e outras ferramentas. Opcionalmente gera tambem um arquivo .xlsx na mesma pasta do CSV original." },
    { title: "3 — GPS + Z Relativo",       body: "Extrai a altitude GPS do EXIF de cada foto na pasta. Apos carregar a lista, selecione manualmente a foto da raiz da pa (Z=0) — necessario porque o voo pode ser feito em qualquer sentido (root-to-tip ou tip-to-root). Gera o arquivo gps_z_relativo.csv com a progressao em mm a partir da raiz escolhida." },
    { title: "4 — Processar JSON",         body: "Le o arquivo photo_data.json gerado pelo ArtDrone e gera os CSVs para o Image Uploader. Ordena as fotos por timestamp DJI e aplica inversao TipToRoot para as regioes SS e PS. Gera um CSV por pa e o arquivo photo_data_matched.csv com a ligacao completa entre metadados e caminhos reais das fotos. IMPORTANTE: o arquivo JSON deve estar na mesma pasta que as subpastas A, B e C — o modulo usa a pasta do JSON como raiz para localizar as fotos e salvar os CSVs gerados." },
    { title: "5 — Organizar Fotos",        body: "Usa o JSON como mapa para criar as pastas A/B/C e copiar as fotos brutas do SD card para os caminhos corretos antes de rodar o Modulo 4." },
    { title: "Observacoes Gerais",         body: "Os campos de selecao de arquivo e pasta funcionam via clique — o dialogo nativo do Windows sera aberto. O OUTPUT e sempre criado na mesma pasta do CSV. Caracteres especiais nos nomes de blade (como *) sao removidos automaticamente para compatibilidade com o sistema de arquivos do Windows." },
  ],
  en: [
    { title: "1 — Organize S&R Images",   body: "Reads the CSV exported from the Artnex platform. For each row, it finds the corresponding photo in the selected folder (searches subfolders). Platform mode renames the photo to the platform format with embedded metadata. Recovery mode keeps the original DJI name. Dry-run simulates the process without copying any files — useful to verify how many photos will be found before running." },
    { title: "2 — Convert CSV",           body: "Converts the CSV separator from semicolon to comma, making the file compatible with Excel and other tools. Optionally generates an .xlsx file in the same folder as the original CSV." },
    { title: "3 — GPS + Relative Z",      body: "Extracts GPS altitude from each photo's EXIF data in the folder. After loading the list, manually select the root photo (Z=0) — required because the flight can be done in any direction (root-to-tip or tip-to-root). Generates gps_z_relativo.csv with progression in mm from the selected root." },
    { title: "4 — Process JSON",          body: "Reads the photo_data.json file generated by ArtDrone and generates CSVs for the Image Uploader. Sorts photos by DJI timestamp and applies TipToRoot inversion for SS and PS regions. Generates one CSV per blade and the photo_data_matched.csv file with the complete link between metadata and actual file paths. IMPORTANT: the JSON file must be in the same folder as the A, B and C subfolders — the module uses the JSON's parent folder as root to locate photos and save the generated CSVs." },
    { title: "5 — Organize Photos",       body: "Uses the JSON as a map to create A/B/C folders and copy raw SD card photos to the correct paths before running Module 4." },
    { title: "General Notes",             body: "File and folder selection fields work via click — the native Windows dialog will open. OUTPUT is always created in the same folder as the CSV. Special characters in blade names (such as *) are automatically removed for Windows filesystem compatibility." },
  ],
};
