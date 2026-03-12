import { useState, useEffect, useCallback } from "react";
import ARTHDRONE_ICON from './icon.js';

// ─── Ícones SVG ───────────────────────────────────────────────────────────────
const Icons = {
  organize: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M17.5 14.5l3 3-3 3M14 17.5h6"/></svg>,
  csv:      (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  gps:      (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>,
  json:     (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  photos:   (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  docs:     (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><polyline points="14 2 14 8 20 8"/></svg>,
  file:     (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  folder:   (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  close:    (c) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:    (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warn:     (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  error:    (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  info:     (c) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  sun:      ()  => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon:     ()  => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  opendir:  (c) => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

// ─── Traduções ────────────────────────────────────────────────────────────────
const translations = {
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
          { label: "Arquivo CSV",    placeholder: "Clique para selecionar o CSV da plataforma", type: "file",   fileType: "csv"    },
          { label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta com as fotos", type: "folder" },
        ],
        options: [
          { label: "Modo",    choices: ["Platform (P)", "Recovery (R)"] },
          { label: "Dry-run", choices: ["Nao", "Sim"] },
        ],
        action: "Organizar Imagens",
      },
      2: {
        title: "Converter CSV",
        desc: "Converte CSV separado por ; para , compativel com Excel",
        inputs: [
          { label: "Arquivo CSV", placeholder: "Clique para selecionar o CSV", type: "file", fileType: "csv" },
        ],
        options: [
          { label: "Gerar .xlsx", choices: ["Nao", "Sim"] },
        ],
        action: "Converter CSV",
      },
      3: {
        title: "Extrair GPS + Z Relativo",
        desc: "Extrai altitude GPS das fotos e calcula progressao relativa em mm",
        inputs: [
          { label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta com as fotos", type: "folder" },
        ],
        options: [],
        action: "Extrair GPS",
      },
      4: {
        title: "Processar JSON",
        desc: "Le JSON do drone e gera CSVs para o Image Uploader com sequencia correta",
        inputs: [
          { label: "Arquivo JSON", placeholder: "Clique para selecionar o arquivo JSON", type: "file", fileType: "json" },
        ],
        options: [],
        action: "Processar JSON",
      },
      5: {
        title: "Organizar Fotos pelo JSON",
        desc: "Cria pastas A/B/C e copia as fotos brutas para os caminhos definidos no JSON",
        inputs: [
          { label: "Arquivo JSON",   placeholder: "Clique para selecionar o arquivo JSON",       type: "file",   fileType: "json"   },
          { label: "Pasta de Fotos", placeholder: "Clique para selecionar a pasta com as fotos", type: "folder" },
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
          { label: "CSV File",      placeholder: "Click to select the platform CSV file", type: "file",   fileType: "csv"    },
          { label: "Photos Folder", placeholder: "Click to select the folder with photos", type: "folder" },
        ],
        options: [
          { label: "Mode",     choices: ["Platform (P)", "Recovery (R)"] },
          { label: "Dry-run",  choices: ["No", "Yes"] },
        ],
        action: "Organize Images",
      },
      2: {
        title: "Convert CSV",
        desc: "Converts semicolon-separated CSV to comma-separated, compatible with Excel",
        inputs: [
          { label: "CSV File", placeholder: "Click to select the CSV file", type: "file", fileType: "csv" },
        ],
        options: [
          { label: "Generate .xlsx", choices: ["No", "Yes"] },
        ],
        action: "Convert CSV",
      },
      3: {
        title: "Extract GPS + Relative Z",
        desc: "Extracts GPS altitude from photos and calculates relative progression in mm",
        inputs: [
          { label: "Photos Folder", placeholder: "Click to select the folder with photos", type: "folder" },
        ],
        options: [],
        action: "Extract GPS",
      },
      4: {
        title: "Process JSON",
        desc: "Reads drone JSON and generates CSVs for Image Uploader with correct sequence",
        inputs: [
          { label: "JSON File", placeholder: "Click to select the JSON file", type: "file", fileType: "json" },
        ],
        options: [],
        action: "Process JSON",
      },
      5: {
        title: "Organize Photos via JSON",
        desc: "Creates A/B/C folders and copies raw photos to paths defined in JSON",
        inputs: [
          { label: "JSON File",     placeholder: "Click to select the JSON file",          type: "file",   fileType: "json"   },
          { label: "Photos Folder", placeholder: "Click to select the folder with photos", type: "folder" },
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
  },
};

const docContent = {
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

const mockLog = [
  { type: "info",    text: "Iniciando processamento..." },
  { type: "success", text: "Cache: 142 fotos indexadas" },
  { type: "success", text: "DJI_20240315_143201_001.JPG copiada" },
  { type: "success", text: "DJI_20240315_143205_002.JPG copiada" },
  { type: "warning", text: "DJI_20240315_143208_003.JPG nao encontrada na pasta" },
  { type: "success", text: "2 imagens organizadas em OUTPUT/" },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ArthdroneTools() {
  const [lang, setLang]           = useState("pt");
  const [active, setActive]       = useState(1);
  const [options, setOptions]     = useState({});
  const [filePaths, setFilePaths] = useState({});
  const [logs, setLogs]           = useState([]);
  const [running, setRunning]     = useState(false);
  const [ran, setRan]             = useState(false);
  const [darkMode, setDarkMode]   = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("adark") || "false"); } catch { return false; }
  });
  const [progress, setProgress]   = useState(0);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsFotos, setGpsFotos]     = useState([]);
  const [gpsRaiz, setGpsRaiz]       = useState("");
  const [lastOutput, setLastOutput] = useState(""); // caminho do ultimo OUTPUT gerado
  const [lastPaths, setLastPaths]   = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("alastpaths") || "{}"); } catch { return {}; }
  });

  const D = darkMode ? {
    bg: "#1a1d23", bgDeep: "#14161b", bgPanel: "#1e2128", bgCard: "#22252e",
    border: "rgba(99,140,200,0.12)", borderLight: "rgba(99,140,200,0.07)",
    accent: "#4e8fd4", accentSoft: "rgba(78,143,212,0.15)", accentSofter: "rgba(78,143,212,0.08)",
    textPrimary: "#e8ecf2", textSecond: "#8c98ac", textMuted: "#4a5568",
    logBg: "#161820", inputBg: "#12141a",
    success: "#34c77b", warning: "#f5a623", error: "#f0554a", info: "#4e8fd4",
  } : {
    bg: "#f7f8fc", bgDeep: "#eef1f7", bgPanel: "#f0f3f9", bgCard: "#ffffff",
    border: "rgba(46,90,160,0.10)", borderLight: "rgba(46,90,160,0.06)",
    accent: "#2e5aa0", accentSoft: "rgba(46,90,160,0.08)", accentSofter: "rgba(46,90,160,0.04)",
    textPrimary: "#1a2333", textSecond: "#4a5c78", textMuted: "#9aaabf",
    logBg: "#f0f3f9", inputBg: "#ffffff",
    success: "#1a9e5c", warning: "#c47d0a", error: "#d63b32", info: "#2e5aa0",
  };

  const T = translations[lang];
  const module = T.fields[active];

  // persiste tema entre sessões
  useEffect(() => {
    try { sessionStorage.setItem("adark", JSON.stringify(darkMode)); } catch {}
  }, [darkMode]);

  // persiste últimos caminhos entre sessões
  useEffect(() => {
    try { sessionStorage.setItem("alastpaths", JSON.stringify(lastPaths)); } catch {}
  }, [lastPaths]);


  const toggleLang = () => {
    setLang(l => l === "pt" ? "en" : "pt");
    setActive(1); setOptions({}); setFilePaths({});
    setLogs([]); setRan(false); setGpsFotos([]); setGpsRaiz(""); setProgress(0); setLastOutput("");
  };

  const switchModule = (id) => {
    setActive(id); setLogs([]); setRan(false);
    setGpsFotos([]); setGpsRaiz(""); setProgress(0); setLastOutput("");
    setFilePaths(lastPaths[id] || {});
  };

  // Extrai progresso de mensagens de log (ex: "45/120 fotos")
  const parseProgress = (text) => {
    const m = text.match(/(\d+)\/(\d+)/);
    if (m) return Math.round((parseInt(m[1]) / parseInt(m[2])) * 100);
    return -1;
  };

  const handleRun = () => {
    if (typeof window.pywebview !== "undefined") {
      setRunning(true); setLogs([]); setRan(false); setProgress(-1);

      const onLog = (e) => {
        setLogs(prev => [...prev, e.detail]);
        const p = parseProgress(e.detail.text || "");
        if (p >= 0) setProgress(p);
        // detecta caminho de output nas mensagens "Output: C:\..."
        const outMatch = (e.detail.text || "").match(/^Output:\s*(.+)$/i);
        if (outMatch) setLastOutput(outMatch[1].trim());
      };

      const safetyTimer = setTimeout(() => {
        setRunning(false); setProgress(0);
        setLogs(prev => [...prev, { type: "error", text: "Timeout: processo nao respondeu em 5 minutos." }]);
        window.removeEventListener("arthlog", onLog);
        window.removeEventListener("arthdone", onDone);
      }, 300000);

      const onDone = () => {
        clearTimeout(safetyTimer);
        setRunning(false); setRan(true); setProgress(100);
        window.removeEventListener("arthlog", onLog);
        window.removeEventListener("arthdone", onDone);
      };

      window.addEventListener("arthlog", onLog);
      window.addEventListener("arthdone", onDone);

      const api      = window.pywebview.api;
      const csvPath  = filePaths["Arquivo CSV"]    || filePaths["CSV File"]      || "";
      const fotosDir = filePaths["Pasta de Fotos"] || filePaths["Photos Folder"] || "";
      const jsonPath = filePaths["Arquivo JSON"]   || filePaths["JSON File"]     || "";
      const modo     = (options["Modo"] || options["Mode"] || "P").includes("R") ? "R" : "P";
      const dryRun   = (options["Dry-run"] || "") === "Sim" || (options["Dry-run"] || "") === "Yes";
      const xlsx     = (options["Gerar .xlsx"] || options["Generate .xlsx"] || "") === "Sim" || (options["Gerar .xlsx"] || options["Generate .xlsx"] || "") === "Yes";

      if      (active === 1) api.organizar_imagens(csvPath, fotosDir, modo, dryRun);
      else if (active === 2) api.converter_csv(csvPath, xlsx);
      else if (active === 3) api.extrair_gps_z(fotosDir, gpsRaiz);
      else if (active === 4) api.processar_json(jsonPath);
      else if (active === 5) api.organizar_fotos(jsonPath, fotosDir);
      return;
    }
    // modo demo
    setRunning(true); setLogs([]); setRan(false); setProgress(0);
    let i = 0;
    const iv = setInterval(() => {
      setLogs(prev => [...prev, mockLog[i]]);
      setProgress(Math.round(((i + 1) / mockLog.length) * 100));
      i++;
      if (i >= mockLog.length) { clearInterval(iv); setRunning(false); setRan(true); }
    }, 380);
  };

  const handlePickInput = async (inp) => {
    if (typeof window.pywebview === "undefined") {
      const demo = `C:\\Demo\\arquivo.${inp.fileType || "csv"}`;
      setFilePaths(p => { const n = { ...p, [inp.label]: demo }; setLastPaths(lp => ({ ...lp, [active]: n })); return n; });
      return;
    }
    const path = inp.type === "folder"
      ? await window.pywebview.api.pick_folder()
      : await window.pywebview.api.pick_file(inp.fileType || "all");
    if (path) setFilePaths(p => { const n = { ...p, [inp.label]: path }; setLastPaths(lp => ({ ...lp, [active]: n })); return n; });
  };

  const handleCarregarGps = () => {
    const pasta = filePaths["Pasta de Fotos"] || filePaths["Photos Folder"] || "";
    if (!pasta) return;
    setGpsLoading(true); setGpsFotos([]); setGpsRaiz("");
    if (typeof window.pywebview !== "undefined") {
      const onLoaded = (e) => {
        setGpsFotos(e.detail.fotos || []);
        setGpsLoading(false);
        window.removeEventListener("gps_fotos_loaded", onLoaded);
      };
      window.addEventListener("gps_fotos_loaded", onLoaded);
      window.pywebview.api.carregar_fotos_gps(pasta);
    } else {
      setTimeout(() => {
        setGpsFotos([
          { nome: "DJI_20240315_143000_001.JPG", altitude: 12.450 },
          { nome: "DJI_20240315_143010_002.JPG", altitude: 18.230 },
          { nome: "DJI_20240315_143020_003.JPG", altitude: 24.810 },
          { nome: "DJI_20240315_143030_004.JPG", altitude: 31.200 },
          { nome: "DJI_20240315_143040_005.JPG", altitude: 38.650 },
        ]);
        setGpsLoading(false);
      }, 800);
    }
  };

  const logIcon  = (t) => ({ success: Icons.check(D.success), warning: Icons.warn(D.warning), error: Icons.error(D.error), info: Icons.info(D.info) }[t] || Icons.info(D.info));
  const logColor = (t) => ({ success: D.success, warning: D.warning, error: D.error, info: D.info }[t] || D.info);

  const canRun = !running && (active !== 3 || (gpsRaiz && gpsFotos.length > 0));

  // Ctrl+Enter — colocado após handleRun para evitar referência antes de inicialização
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "Enter" && !running && module.action) handleRun();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [running, active, filePaths, options, gpsRaiz, gpsFotos]);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", background: D.bg, width: "100vw", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", color: D.textPrimary, transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        html,body,#root{width:100%;height:100%;margin:0;padding:0;overflow:hidden}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${D.accent}55;border-radius:4px}
        ::-webkit-scrollbar-track{background:transparent}

        .nav-item{
          display:flex;align-items:center;gap:11px;padding:10px 16px;
          cursor:pointer;border-left:2px solid transparent;
          transition:all 0.18s;user-select:none;border-radius:0 6px 6px 0;margin:1px 8px 1px 0;
        }
        .nav-item:hover{background:${D.accentSoft};border-left-color:${D.accent}55}
        .nav-item.active{background:${D.accentSoft};border-left-color:${D.accent}}

        .nav-icon{
          width:30px;height:30px;display:flex;align-items:center;justify-content:center;
          border-radius:7px;flex-shrink:0;transition:all 0.18s;
          background:${D.accentSofter};
        }
        .nav-item.active .nav-icon{background:${D.accentSoft}}

        .pill{
          padding:5px 13px;border-radius:20px;font-size:11.5px;font-family:inherit;
          cursor:pointer;transition:all 0.15s;border:1px solid ${D.border};
          background:transparent;color:${D.textMuted};font-weight:500;
        }
        .pill:hover{border-color:${D.accent}55;color:${D.textSecond}}
        .pill.active{background:${D.accentSoft};border-color:${D.accent};color:${D.accent}}

        .run-btn{
          background:${D.accent};border:none;color:#fff;
          padding:11px 28px;border-radius:8px;font-family:inherit;
          font-size:13px;font-weight:600;cursor:pointer;
          letter-spacing:0.02em;transition:all 0.2s;
          box-shadow:0 2px 12px ${D.accent}44;
        }
        .run-btn:hover:not(:disabled){filter:brightness(1.12);transform:translateY(-1px);box-shadow:0 4px 20px ${D.accent}55}
        .run-btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;box-shadow:none}
        .run-btn.running{animation:pulse-btn 1.2s ease-in-out infinite}
        @keyframes pulse-btn{0%,100%{box-shadow:0 2px 12px ${D.accent}44}50%{box-shadow:0 4px 24px ${D.accent}66}}

        .input-field{
          display:flex;align-items:center;gap:10px;
          background:${D.inputBg};border:1px dashed ${D.border};
          border-radius:8px;padding:11px 14px;width:100%;
          font-size:12.5px;cursor:pointer;transition:all 0.18s;
          color:${D.textMuted};
        }
        .input-field:hover{border-color:${D.accent}66;background:${D.accentSofter}}
        .input-field.filled{border-style:solid;border-color:${D.accent}55;color:${D.textSecond}}

        .log-line{
          display:flex;align-items:flex-start;gap:8px;
          font-size:12px;line-height:1.6;padding:3px 0;
          animation:fadein 0.2s ease;
        }
        @keyframes fadein{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:none}}

        .progress-bar-track{
          width:100%;height:3px;background:${D.border};border-radius:2px;overflow:hidden;
        }
        .progress-bar-fill{
          height:100%;background:${D.accent};border-radius:2px;
          transition:width 0.3s ease;
        }
        .progress-bar-indeterminate{
          height:100%;width:40%;background:${D.accent};border-radius:2px;
          animation:indeterminate 1.4s ease-in-out infinite;
        }
        @keyframes indeterminate{
          0%{transform:translateX(-100%)}
          100%{transform:translateX(350%)}
        }

        .gps-row{
          display:flex;align-items:center;justify-content:space-between;
          padding:8px 14px;cursor:pointer;
          border-left:3px solid transparent;transition:all 0.15s;
        }
        .gps-row:hover{background:${D.accentSofter}}
        .gps-row.selected{background:${D.accentSoft};border-left-color:${D.accent}}

        .toggle-track{
          width:38px;height:22px;border-radius:11px;border:none;
          cursor:pointer;position:relative;transition:background 0.25s;flex-shrink:0;
        }
        .toggle-knob{
          position:absolute;top:3px;width:16px;height:16px;
          border-radius:50%;background:white;
          transition:left 0.25s;box-shadow:0 1px 4px rgba(0,0,0,0.25);
        }
      `}</style>

      {/* TOPBAR */}
      <div style={{ height:52, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", borderBottom:`1px solid ${D.border}`, background:D.bgDeep, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <img src={ARTHDRONE_ICON} alt="Arthdrone" style={{ width:32, height:32, objectFit:"contain" }} />
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:D.accent, letterSpacing:"0.12em" }}>{T.title}</div>
            <div style={{ fontSize:10, color:D.textMuted, letterSpacing:"0.04em", marginTop:1 }}>{T.subtitle}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, color:D.textMuted }}>
            <Icons.sun/>
            <button className="toggle-track" style={{ background: darkMode ? D.accent : D.border }} onClick={() => setDarkMode(d => !d)}>
              <div className="toggle-knob" style={{ left: darkMode ? "19px" : "3px" }} />
            </button>
            <Icons.moon/>
          </div>
          <div style={{ width:1, height:16, background:D.border }} />
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e66" }} />
            <span style={{ fontSize:10, color:D.textMuted, fontWeight:500 }}>v2.2</span>
          </div>
          <button onClick={toggleLang} style={{ background:D.accentSofter, border:`1px solid ${D.border}`, borderRadius:6, padding:"4px 11px", color:D.accent, fontFamily:"inherit", fontSize:11, fontWeight:600, cursor:"pointer", letterSpacing:"0.08em", transition:"all 0.15s" }}>
            {lang === "pt" ? "PT → EN" : "EN → PT"}
          </button>
        </div>
      </div>

      {/* PROGRESS BAR — aparece só quando rodando */}
      <div style={{ height:3, background:D.bgDeep, flexShrink:0 }}>
        {running && (
          <div className="progress-bar-track" style={{ height:"100%", borderRadius:0 }}>
            {progress < 0
              ? <div className="progress-bar-indeterminate" />
              : <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
            }
          </div>
        )}
      </div>

      {/* BODY */}
      <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>

        {/* SIDEBAR */}
        <div style={{ width:210, flexShrink:0, borderRight:`1px solid ${D.border}`, background:D.bgPanel, overflowY:"auto", padding:"10px 0", transition:"background 0.3s" }}>
          {T.modules.map(m => (
            <div key={m.id} className={`nav-item ${active === m.id ? "active" : ""}`} onClick={() => switchModule(m.id)}>
              <div className="nav-icon">
                {Icons[m.icon] ? Icons[m.icon](active === m.id ? D.accent : D.textMuted) : null}
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color: active === m.id ? D.accent : D.textSecond, lineHeight:1.3 }}>{m.label}</div>
                <div style={{ fontSize:10.5, color:D.textMuted, marginTop:1 }}>{m.short}</div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN PANEL */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:D.bg, transition:"background 0.3s" }}>

          {/* MODULE HEADER */}
          <div style={{ padding:"18px 26px 14px", borderBottom:`1px solid ${D.borderLight}`, background:D.bgDeep, flexShrink:0 }}>
            <div style={{ fontSize:18, fontWeight:700, color:D.textPrimary, letterSpacing:"0.01em" }}>{module.title}</div>
            <div style={{ fontSize:12, color:D.textSecond, marginTop:4, lineHeight:1.5 }}>{module.desc}</div>
          </div>

          {/* FORM + LOG */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

            {/* FORM */}
            <div style={{ padding:"20px 26px", overflowY:"auto", flex:1 }}>
              {module.doc ? (
                <div>
                  {docContent[lang].map((d, i) => (
                    <div key={i} style={{ background:D.bgCard, border:`1px solid ${D.borderLight}`, borderRadius:10, padding:"15px 18px", marginBottom:10, transition:"background 0.3s" }}>
                      <div style={{ fontSize:12, fontWeight:700, color:D.accent, marginBottom:6 }}>{d.title}</div>
                      <div style={{ fontSize:12, color:D.textSecond, lineHeight:1.75 }}>{d.body}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {module.inputs.map((inp, i) => {
                    const val = filePaths[inp.label];
                    return (
                      <div key={i} style={{ marginBottom:14 }}>
                        <div style={{ fontSize:10.5, color:D.textMuted, marginBottom:6, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>{inp.label}</div>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <div className={`input-field${val ? " filled" : ""}`} onClick={() => handlePickInput(inp)}>
                            <span style={{ color: val ? D.accent : D.textMuted, flexShrink:0 }}>
                              {inp.type === "folder" ? Icons.folder(val ? D.accent : D.textMuted) : Icons.file(val ? D.accent : D.textMuted)}
                            </span>
                            <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:12 }}>
                              {val || inp.placeholder}
                            </span>
                            {val && (
                              <span style={{ color:D.textMuted, cursor:"pointer", flexShrink:0, padding:"2px" }}
                                onClick={e => { e.stopPropagation(); setFilePaths(p => ({ ...p, [inp.label]: "" })); if (active === 3) { setGpsFotos([]); setGpsRaiz(""); }}}>
                                {Icons.close(D.textMuted)}
                              </span>
                            )}
                          </div>
                          {active === 3 && inp.type === "folder" && val && (
                            <button onClick={handleCarregarGps} disabled={gpsLoading} style={{ padding:"9px 14px", borderRadius:7, border:`1px solid ${D.accent}`, background:"transparent", color:D.accent, fontFamily:"inherit", fontSize:11.5, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", opacity: gpsLoading ? 0.6 : 1, transition:"all 0.15s" }}>
                              {gpsLoading ? T.loading : T.load_photos}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Lista GPS raiz */}
                  {active === 3 && gpsFotos.length > 0 && (
                    <div style={{ marginBottom:16 }}>
                      <div style={{ fontSize:10.5, color:D.textMuted, marginBottom:8, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>{T.select_root}</div>
                      <div style={{ border:`1px solid ${D.border}`, borderRadius:8, background:D.logBg, maxHeight:200, overflowY:"auto" }}>
                        {gpsFotos.map((f, i) => (
                          <div key={i} className={`gps-row${gpsRaiz === f.nome ? " selected" : ""}`} onClick={() => setGpsRaiz(f.nome)}>
                            <span style={{ fontSize:12, color: gpsRaiz === f.nome ? D.accent : D.textSecond, fontWeight: gpsRaiz === f.nome ? 600 : 400 }}>{f.nome}</span>
                            <span style={{ fontSize:11.5, color:D.textMuted, flexShrink:0, marginLeft:12 }}>{f.altitude.toFixed(3)} m</span>
                          </div>
                        ))}
                      </div>
                      {gpsRaiz && <div style={{ fontSize:11, color:D.success, marginTop:6, fontWeight:500 }}>{T.root_selected}: {gpsRaiz}</div>}
                    </div>
                  )}

                  {/* Opções */}
                  {module.options.length > 0 && (
                    <div style={{ display:"flex", gap:24, marginBottom:20, flexWrap:"wrap" }}>
                      {module.options.map((opt, i) => (
                        <div key={i}>
                          <div style={{ fontSize:10.5, color:D.textMuted, marginBottom:7, letterSpacing:"0.07em", textTransform:"uppercase", fontWeight:600 }}>{opt.label}</div>
                          <div style={{ display:"flex", gap:6 }}>
                            {opt.choices.map(c => (
                              <button key={c} className={`pill${options[opt.label] === c ? " active" : ""}`} onClick={() => setOptions(o => ({ ...o, [opt.label]: c }))}>{c}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Botão executar */}
                  {module.action && (
                    <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:4 }}>
                      <button className={`run-btn${running ? " running" : ""}`} onClick={handleRun} disabled={!canRun}>
                        {running ? T.processing : module.action}
                      </button>
                      {ran && !running && (
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6, color:D.success, fontSize:12.5, fontWeight:600 }}>
                            {Icons.check(D.success)}{T.done}
                          </div>
                          {lastOutput && typeof window.pywebview !== "undefined" && (
                            <button onClick={() => window.pywebview.api.open_folder(lastOutput)}
                              style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:6, border:`1px solid ${D.border}`, background:"transparent", color:D.textSecond, fontFamily:"inherit", fontSize:11.5, fontWeight:500, cursor:"pointer", transition:"all 0.15s" }}>
                              {Icons.opendir(D.textSecond)}{T.open_output}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* LOG */}
            {!module.doc && (
              <div style={{ borderTop:`1px solid ${D.border}`, background:D.logBg, display:"flex", flexDirection:"column", maxHeight:195, flexShrink:0, transition:"background 0.3s" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 20px 6px", borderBottom:`1px solid ${D.borderLight}` }}>
                  <span style={{ fontSize:10, color:D.textMuted, letterSpacing:"0.09em", textTransform:"uppercase", fontWeight:600 }}>{T.log_title}</span>
                  {logs.length > 0 && (
                    <button onClick={() => { setLogs([]); setRan(false); setProgress(0); }} style={{ fontSize:10.5, color:D.accent, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:500 }}>
                      {T.clear}
                    </button>
                  )}
                </div>
                <div style={{ overflowY:"auto", padding:"8px 20px", flex:1 }}>
                  {logs.length === 0
                    ? <div style={{ fontSize:12, color:D.textMuted, fontStyle:"italic" }}>{T.log_placeholder}</div>
                    : logs.map((l, i) => (
                        <div key={i} className="log-line">
                          <span style={{ flexShrink:0, marginTop:1 }}>{logIcon(l.type)}</span>
                          <span style={{ color: logColor(l.type), fontSize:12 }}>{l.text}</span>
                        </div>
                      ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STATUSBAR */}
      <div style={{ height:24, display:"flex", alignItems:"center", padding:"0 18px", gap:14, borderTop:`1px solid ${D.border}`, background:D.bgDeep, flexShrink:0 }}>
        <span style={{ fontSize:10, color:D.textMuted, fontWeight:500 }}>ARTHDRONE TOOLS</span>
        <span style={{ color:D.border }}>·</span>
        <span style={{ fontSize:10, color:D.textMuted }}>{T.modules.find(m => m.id === active)?.label}</span>
        {running && progress >= 0 && (
          <>
            <span style={{ color:D.border }}>·</span>
            <span style={{ fontSize:10, color:D.accent, fontWeight:600 }}>{progress}%</span>
          </>
        )}
        <span style={{ marginLeft:"auto", fontSize:10, color: running ? D.accent : D.textMuted, fontWeight: running ? 600 : 400 }}>
          {running ? T.processing : "Pronto"}
        </span>
      </div>
    </div>
  );
}
