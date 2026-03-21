// constants/translations.js — Traduções e conteúdo de documentação

export const translations = {
  pt: {
    title: "ARTHDRONE TOOLS", subtitle: "Automação S&R de Externas",
    modules: [
      { id: 1, label: "Organizar Imagens", icon: "organize", short: "S&R via CSV", group: "Fluxo S&R" },
      { id: 2, label: "Processar JSON",    icon: "json",     short: "JSON para CSVs", group: "Fluxo S&R" },
      { id: 3, label: "Organizar Fotos",   icon: "photos",   short: "Fotos via JSON", group: "Fluxo S&R" },
      { id: 4, label: "Converter CSV",     icon: "csv",      short: "CSV para Excel", group: "Ferramentas" },
      { id: 5, label: "GPS + Z Relativo",  icon: "gps",      short: "Altitude relativa", group: "Ferramentas" },
      { id: 6, label: "Corrigir JSON",     icon: "split",    short: "Dividir pás", group: "Correções" },
      { id: 7, label: "Corrigir Z=0",      icon: "gps",      short: "Restaurar Location", group: "Correções" },
      { id: 8, label: "Recuperar Perdas",  icon: "photos",   short: "Fotos fantasma (SD)", group: "Correções" },
      { id: 9, label: "Documentação",     icon: "docs",     short: "Manual passo a passo", group: "Suporte" },
    ],
    fields: {
      1: {
        title: "1. Organizar Imagens S&R",
        desc: "Lê o CSV da plataforma e organiza as fotos em OUTPUT/Blade/Region",
        inputs: [
          { inputId: "csv_file",    label: "Arquivo CSV",    placeholder: "Clique para selecionar o CSV da plataforma", type: "file",   fileType: "csv"    },
          { inputId: "photos_dir",  label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta com as fotos", type: "folder" },
        ],
        options: [
          { optionId: "mode",    label: "Modo",    choices: ["Platform (P)", "Recovery (R)"] },
          { optionId: "dry_run", label: "Dry-run", choices: ["Não", "Sim"] },
        ],
        action: "Organizar Imagens",
      },
      2: {
        title: "2. Processar JSON",
        desc: "Lê JSON do drone e gera CSVs padronizados para o Image Uploader",
        inputs: [
          { inputId: "json_file", label: "Arquivo JSON", placeholder: "Clique para selecionar o arquivo JSON do Drone", type: "file", fileType: "json" },
        ],
        options: [],
        action: "Processar JSON",
      },
      3: {
        title: "3. Organizar Fotos pelo JSON",
        desc: "Cria as pastas A/B/C e move as fotos brutas para o lugar exato baseado no mapa do JSON do Drone",
        inputs: [
          { inputId: "json_file",  label: "Arquivo JSON",   placeholder: "Clique para selecionar o arquivo JSON",       type: "file",   fileType: "json"   },
          { inputId: "photos_dir", label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta D:\DCIM com as fotos", type: "folder" },
        ],
        options: [],
        action: "Organizar Fotos",
      },
      4: {
        title: "Converter CSV (; para ,)",
        desc: "Ajusta o separador para manter o arquivo compatível com o Excel",
        inputs: [
          { inputId: "csv_file", label: "Arquivo CSV", placeholder: "Clique para selecionar o CSV", type: "file", fileType: "csv" },
        ],
        options: [
          { optionId: "gen_xlsx", label: "Gerar .xlsx", choices: ["Não", "Sim"] },
        ],
        action: "Converter CSV",
      },
      5: {
        title: "Extrair GPS + Calcular Z",
        desc: "Lê o EXIF das fotos brutas e gera a tabela milimétrica usando a raiz como Marco Zero",
        inputs: [
          { inputId: "photos_dir", label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta com as fotos", type: "folder" },
        ],
        options: [],
        action: "Extrair GPS",
      },
      6: {
        title: "Corrigir Blade Split (Pás Misturadas)",
        desc: "Procura quebras de tempo longas (ex: drone pousou/trocou bateria) e permite realocar a metade para um NOVO Serial Number.",
        inputs: [
          { inputId: "data_file", label: "Arquivo de Origem", placeholder: "Selecione o photo_data.json ou o relatorio.csv", type: "file", fileType: "all" },
        ],
        options: [],
        action: "Aplicar Correções",
      },
      7: {
        title: "Corrigir Z (Location) Zerado",
        desc: "Lê um CSV da plataforma com erros esporádicos de Location=0 e recalcula apenas as fotos afetadas usando o GPS",
        inputs: [
          { inputId: "csv_file", label: "Arquivo CSV (Plataforma)", placeholder: "Selecione seu CSV da turbina", type: "file", fileType: "csv" },
          { inputId: "photos_dir", label: "Pasta das Fotos Originais", placeholder: "Selecione a pasta onde os JPGs de voo estão", type: "folder" }
        ],
        options: [],
        action: "Corrigir Z=0"
      },
      8: {
        title: "Recuperar Fotos Perdidas",
        desc: "Escaneia o SD Card atrás de pulos de numeração sequencial no voo. Reconstrói os dados perdidos usando as fotos limítrofes como âncora via GPS real",
        inputs: [
          { inputId: "json_file", label: "JSON do Voo", placeholder: "Selecione o photo_data.json da turbina", type: "file", fileType: "json" },
          { inputId: "photos_dir", label: "Diretório Geral de Fotos", placeholder: "Onde as fotos no SD Card estão", type: "folder" }
        ],
        options: [],
        action: "Caçar Fotos Perdidas"
      },
      9: {
        title: "Documentação Passo a Passo",
        desc: "Guias interativos de como operar cada módulo da ferramenta sem erros.",
        inputs: [], options: [], action: null, doc: true,
      },
    },
    log_title: "Log de Execução",
    log_placeholder: "A saída da ferramenta aparecerá aqui.",
    clear: "Limpar",
    select_root: "Selecione a foto raiz (Z=0)",
    root_selected: "Raiz selecionada",
    load_photos: "Carregar fotos",
    loading: "Lendo...",
    processing: "Processando...",
    done: "Concluído!",
    open_output: "Abrir pasta gerada",
    ready: "Pronto",
    analyze_json: "Analisar Gaps",
  },
  en: {
    title: "ARTHDRONE TOOLS", subtitle: "Exterior S&R Automation",
    modules: [
      { id: 1, label: "Organize Images",  icon: "organize", short: "S&R from CSV", group: "S&R Flow" },
      { id: 2, label: "Process JSON",     icon: "json",     short: "JSON to CSVs", group: "S&R Flow" },
      { id: 3, label: "Organize Photos",  icon: "photos",   short: "Photos via JSON", group: "S&R Flow" },
      { id: 4, label: "Convert CSV",      icon: "csv",      short: "CSV to Excel", group: "Tools" },
      { id: 5, label: "GPS + Relative Z", icon: "gps",      short: "Relative altitude", group: "Tools" },
      { id: 6, label: "Fix JSON Split",   icon: "split",    short: "Split mixed blades", group: "Fixes" },
      { id: 7, label: "Fix Z=0 CSV",      icon: "gps",      short: "Fix Location", group: "Fixes" },
      { id: 8, label: "Recover Lost Photos", icon: "photos", short: "Find SD missings", group: "Fixes" },
      { id: 9, label: "Documentation",    icon: "docs",     short: "User manual", group: "Support" },
    ],
    fields: {
      1: {
        title: "1. Organize S&R Images",
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
        title: "2. Process JSON",
        desc: "Reads drone JSON and generates CSVs for Image Uploader with correct sequence",
        inputs: [
          { inputId: "json_file", label: "JSON File", placeholder: "Click to select the JSON file", type: "file", fileType: "json" },
        ],
        options: [],
        action: "Process JSON",
      },
      3: {
        title: "3. Organize Photos via JSON",
        desc: "Creates folders and copies raw photos to paths defined in JSON map",
        inputs: [
          { inputId: "json_file",  label: "JSON File",     placeholder: "Click to select the JSON file",          type: "file",   fileType: "json"   },
          { inputId: "photos_dir", label: "Photos Folder", placeholder: "Click to select the folder with photos", type: "folder" },
        ],
        options: [],
        action: "Organize Photos",
      },
      4: {
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
      5: {
        title: "Extract GPS + Relative Z",
        desc: "Extracts GPS altitude from photos and calculates relative progression in mm",
        inputs: [
          { inputId: "photos_dir", label: "Photos Folder", placeholder: "Click to select the folder with photos", type: "folder" },
        ],
        options: [],
        action: "Extract GPS",
      },
      6: {
        title: "Fix Blade Split",
        desc: "Finds time gaps and splits mixed photos onto a new Blade SN (supports JSON or CSV)",
        inputs: [
          { inputId: "data_file", label: "Data File", placeholder: "Select the photo_data.json or report.csv", type: "file", fileType: "all" },
        ],
        options: [],
        action: "Apply Corrections",
      },
      7: {
        title: "Fix Z (Location) = 0",
        desc: "Reads a platform CSV with Location=0 errors and recalculates progression in mm targeting only bad rows",
        inputs: [
          { inputId: "csv_file", label: "CSV File (Platform)", placeholder: "Click to select CSV file", type: "file", fileType: "csv" },
          { inputId: "photos_dir", label: "Photos Folder", placeholder: "Click to select folder with original photos", type: "folder" }
        ],
        options: [],
        action: "Fix Z"
      },
      8: {
        title: "Recover Missing Photos",
        desc: "Scans the SD Card for sequential numeric leaps. Reconstructs missing JSON outputs using precise GPS boundaries.",
        inputs: [
          { inputId: "json_file", label: "JSON File", placeholder: "Select the turbine photo_data.json", type: "file", fileType: "json" },
          { inputId: "photos_dir", label: "SD Card Photos Folder", placeholder: "Root folder of raw images", type: "folder" }
        ],
        options: [],
        action: "Hunt Lost Photos"
      },
      9: {
        title: "Step-by-step Documentation",
        desc: "Complete and interactive tool manual",
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
    open_output: "Open output folder",
    ready: "Ready",
    analyze_json: "Analyze Gaps",
  },
};

export const docContent = {
  pt: [
    { 
      title: "Módulo 1: Organizar Imagens S&R", 
      body: "Este é o módulo principal para padronizar as imagens baixadas do voo com o CSV da plataforma. \n\n**Passo a passo:**\n1. Selecione o CSV principal da turbina (Exportado da plataforma).\n2. Selecione a pasta inteira onde os JPGs do voo do drone estão salvos.\n3. Defina o 'Modo': \n- Plataform vai renomear as fotos e injetar todos metadados (para Subir pro Cliente).\n- Recovery vai manter os nomes originais DJIs mas vai criar a árvore de pastas.\n4. Ao clicar em Executar, as imagens serão copiadas ordenadamente para uma nova pasta `OUTPUT` ao lado do seu arquivo CSV." 
    },
    { 
      title: "Módulo 2: Processar JSON", 
      body: "Usado quando o voo foi feito com o App próprio e gerou o arquivo `photo_data.json` no SD Card.\n\n**Passo a passo:**\n1. Apontar para o arquivo JSON direto do drone.\n2. O processo fará a conversão massiva do mapa do JSON para relatórios no formato padrão para Upload.\n3. Automaticamente, ele descobre as subpastas e ordena o fluxo tip-to-root dependendo do Face Side da pá.\n4. Gera múltiplos CSVs na mesma pasta do JSON." 
    },
    { 
      title: "Módulo 3: Organizar Fotos pelo JSON", 
      body: "Faz o par visual do módulo anterior: Move os amontoados de imagens para suas respectivas pastas 'A, B e C'.\n\n**Passo a passo:**\n1. Selecione o `photo_data.json` da inspeção.\n2. Insira o caminho-mãe das pastas de foto.\n3. Sem alterar a extensão da imagem, a ferramenta cria as subdivisões baseadas no que está documentado no JSON, de forma higienizada." 
    },
    { 
      title: "Módulo 4: Converter CSV", 
      body: "Lida com o dilema da interpretação de CSV pelo Windows Regional (Ponto e Vírgula vs Vírgula).\n\n**Passo a passo:**\n1. Envie o CSV que está dando erro de tabulação no seu Excel / LibreOffice.\n2. Ative a caixa se quiser gerar uma cópia em formato XLS (Planilha Excel).\n3. O clique converte e re-salva rapidamente o formato para não atrapalhar sua leitura de dados nativa." 
    },
    { 
      title: "Módulo 5: GPS + Calcular Z", 
      body: "Uma ajuda milimétrica avulsa para encontrar a Progressão Relativa.\n\n**Passo a passo:**\n1. Leia a pasta da inspeção.\n2. A lista irá popular.\n3. Você precisa clicar NA FOTO QUE REPRESENTA A RAIZ (Base Z=0). \n4. O software baterá todas as outras altitudes extraídas e fornecerá uma planilha onde cada foto possui sua elevação progressiva perfeita em milímetros (independentemente do mar)." 
    },
    { 
      title: "Módulo 6: Corrigir Blade Split", 
      body: "Ocasionalmente, o drone não desliga a gravação e coloca fotos de DUAS PÁS sob o mesmo ID no CSV ou JSON.\n\n**Passo a passo:**\n1. Injete o CSV ou JSON corrompido.\n2. A tecnologia tentará ler os timestamps para avaliar um pulo maior que 60 segundos.\n3. O painel listará a divisão encontrada. \n4. Digite qual a nova letra e nome e Clique para aplicar as correções dividindo na raiz matemática do erro para dois CSVs separados!"
    },
    { 
      title: "Módulo 7: Corrigir Z (Location) Zerado", 
      body: "Ferramenta cirúrgica para CSVs oriundos da Plataforma que perderam o Rastreio de Localização (Ficando tudo = 0).\n\n**Passo a passo:**\n1. Carreque o CSV comprometido e a pasta inteira das Fotos.\n2. Acione 'Carregar Fotos'.\n3. Selecione no Tracker a Foto da Base do Root (Geralmente a primeira Foto do L.E. da respectiva pá).\n4. O back-end mapeia os campos Z=0, recalcula usando exclusivamente as altitudes GPS destas imagens prejudicadas e regrava o Output com as informações restauradas."
    },
    { 
      title: "Módulo 8: Recuperar Fotos Perdidas", 
      body: "Rastreia e recupera fotos perdidas por falha de tempo ou gravação falha do drone antes do processamento final.\n\n**Passo a passo:**\n1. Selecione o `photo_data.json` da sua turbina.\n2. Selecione o diretório principal bruto do SD Card onde constam as originais (.JPG).\n3. O App escaneia o sequencial da pasta atual, nota os números perdidos, acha o fantasma no SD Card e repopula um diretório de `Fotos_Recuperadas` injetando Altitude Geográfica do próprio EXIF!"
    }
  ],
  en: [
    { 
      title: "Module 1: Organize S&R Images", 
      body: "Main module to standardize downloaded images with the platform's CSV.\n\n**Flow:**\n1. Select the main turbine CSV.\n2. Select the entire folder holding flight JPGs.\n3. Choose mode (Platform/Recovery).\n4. Outputs neatly nested folders (OUTPUT/) next to CSV." 
    },
    { 
      title: "Module 2: Process JSON", 
      body: "For App drone generated `photo_data.json`.\n\n**Flow:**\n1. Point to JSON.\n2. Script reverses directions to standard (Tip/Root) based on region.\n3. Spits out formatted CSVs to upload." 
    },
    { 
      title: "Module 3: Organize Photos via JSON", 
      body: "Visual pair for module 2. Restructures raw photo dumps to A, B, C Blade folders." 
    },
    { title: "Module 4: Convert CSV", body: "Re-maps semi-colons and creates native Excel (.xlsx) output flawlessly." },
    { title: "Module 5: Relative progression (GPS Z)", body: "Click \"Load Photos\", visually pick the Root baseline photo, algorithm extracts raw GPS metadata generating the exact relative mm translation." },
    { title: "Module 6: Fix Mixed Blades (Split)", body: "For instances where pilot records 2 continuous blades inside 1 folder. Analyzes time-gaps and physically splits outputs onto specific unique CSVs resolving DB merge clashes." },
    { title: "Module 7: Recover Null Location (Z=0)", body: "Surgical tool. Fixes sporadic instances where the final CSV Location attributes broke tracking to 0. Simply pass CSV, point to Photos, click Root Photo (baseline) and it calculates distances regenerating the file exclusively for bad entries." },
    { title: "Module 8: Recover Lost Photos", body: "Tracks and recovers photos orphaned from sequence skips. By parsing your photo_data.json boundaries, it fetches the ghosts directly from SD Card directory and clones them regenerating actual XYZ properties via EXIF." }
  ],
};
