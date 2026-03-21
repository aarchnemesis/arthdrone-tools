// hooks/usePyWebView.js — Hook para comunicação com o backend Python via pywebview

import { useState, useCallback, useRef, useEffect } from "react";

const MAX_LOGS = 500;

const mockLog = [
  { type: "info",    text: "Iniciando processamento..." },
  { type: "success", text: "Cache: 142 fotos indexadas" },
  { type: "success", text: "DJI_20240315_143201_001.JPG copiada" },
  { type: "success", text: "DJI_20240315_143205_002.JPG copiada" },
  { type: "warning", text: "DJI_20240315_143208_003.JPG nao encontrada na pasta" },
  { type: "success", text: "2 imagens organizadas em OUTPUT/" },
];

export default function usePyWebView() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastOutput, setLastOutput] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsFotos, setGpsFotos] = useState([]);
  const [bladeSplitLoading, setBladeSplitLoading] = useState(false);
  const [bladeSplitSuspeitos, setBladeSplitSuspeitos] = useState([]);
  const safetyTimerRef = useRef(null);

  const [isPyWebView, setIsPyWebView] = useState(typeof window.pywebview !== "undefined");

  useEffect(() => {
    if (typeof window.pywebview !== "undefined") {
      setIsPyWebView(true);
    } else {
      window.addEventListener("pywebviewready", () => setIsPyWebView(true));
    }
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setRan(false);
    setProgress(0);
    setLastOutput("");
  }, []);

  const addLog = useCallback((entry) => {
    setLogs(prev => {
      const next = [...prev, entry];
      return next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next;
    });
  }, []);

  const handleRun = useCallback((active, filePaths, options, gpsRaiz) => {
    if (isPyWebView) {
      setRunning(true);
      setLogs([]);
      setRan(false);
      setProgress(-1);

      const onLog = (e) => {
        addLog(e.detail);
        // Detecta caminho de output nas mensagens "Output: C:\..."
        const outMatch = (e.detail.text || "").match(/^Output:\s*(.+)$/i);
        if (outMatch) setLastOutput(outMatch[1].trim());
      };

      const onProgress = (e) => {
        const { current, total } = e.detail;
        if (total > 0) setProgress(Math.round((current / total) * 100));
      };

      const cleanup = () => {
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
        window.removeEventListener("arthlog", onLog);
        window.removeEventListener("arthdone", onDone);
        window.removeEventListener("arthprogress", onProgress);
      };

      safetyTimerRef.current = setTimeout(() => {
        setRunning(false);
        setProgress(0);
        addLog({ type: "error", text: "Timeout: processo nao respondeu em 5 minutos." });
        cleanup();
      }, 300000);

      const onDone = () => {
        cleanup();
        setRunning(false);
        setRan(true);
        setProgress(100);
      };

      window.addEventListener("arthlog", onLog);
      window.addEventListener("arthdone", onDone);
      window.addEventListener("arthprogress", onProgress);

      const api      = window.pywebview.api;
      const csvPath  = filePaths["csv_file"]  || "";
      const fotosDir = filePaths["photos_dir"] || "";
      const jsonPath = filePaths["json_file"]  || "";
      const dataFile = filePaths["data_file"] || "";
      const modo     = (options["mode"] || "P").includes("R") ? "R" : "P";
      const dryRun   = ["Sim", "Yes"].includes(options["dry_run"] || "");
      const xlsx     = ["Sim", "Yes"].includes(options["gen_xlsx"] || "");

      // Mapeamento de ids baseados em translations.js
      // 1: Organizar Imagens (CSV)
      // 2: Process JSON
      // 3: Organizar Fotos
      // 4: Converter CSV
      // 5: GPS + Relative Z
      // 6: Fix Blade Split
      // 7: Fix Z=0
      // 8: Recover Lost Photos
      
      if      (active === 1) api.organizar_imagens(csvPath, fotosDir, modo, dryRun);
      else if (active === 2) api.processar_json(jsonPath);
      else if (active === 3) api.organizar_fotos(jsonPath, fotosDir);
      else if (active === 4) api.converter_csv(csvPath, xlsx);
      else if (active === 5) api.extrair_gps_z(fotosDir, gpsRaiz);
      else if (active === 6) api.corrigir_blade_split(dataFile, options.correcoes || []);
      else if (active === 7) api.corrigir_z_zero(csvPath, fotosDir, gpsRaiz);
      else if (active === 8) api.recuperar_fotos_perdidas(jsonPath, fotosDir);
      return;
    }

    // Modo demo (sem pywebview)
    setRunning(true);
    setLogs([]);
    setRan(false);
    setProgress(0);
    let i = 0;
    const iv = setInterval(() => {
      addLog(mockLog[i]);
      setProgress(Math.round(((i + 1) / mockLog.length) * 100));
      i++;
      if (i >= mockLog.length) {
        clearInterval(iv);
        setRunning(false);
        setRan(true);
      }
    }, 380);
  }, [isPyWebView, addLog]);

  const pickInput = useCallback(async (inp) => {
    if (typeof window.pywebview === "undefined") {
      return ""; // Evita carregar dados de demo acidentalmente se a UI foi mais rapida q o webview backend
    }
    const path = inp.type === "folder"
      ? await window.pywebview.api.pick_folder()
      : await window.pywebview.api.pick_file(inp.fileType || "all");
    return path || "";
  }, []);

  const carregarFotosGps = useCallback((pasta) => {
    if (!pasta) return;
    setGpsLoading(true);
    setGpsFotos([]);

    if (isPyWebView) {
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
  }, [isPyWebView]);

  const carregarBladeSplit = useCallback((jsonPath) => {
    if (!jsonPath) return;
    setBladeSplitLoading(true);
    setBladeSplitSuspeitos([]);
    clearLogs(); // Clear output area
    addLog({ type: "info", text: "Iniciando análise de dados..." }); // initial message

    if (isPyWebView) {
      const onLog = (e) => addLog(e.detail);
      const onLoaded = (e) => {
        setBladeSplitSuspeitos(e.detail.suspeitos || []);
        setBladeSplitLoading(false);
        window.removeEventListener("blade_split_analise", onLoaded);
        window.removeEventListener("arthlog", onLog);
        addLog({ type: "success", text: "Análise concluída." });
      };
      
      window.addEventListener("arthlog", onLog);
      window.addEventListener("blade_split_analise", onLoaded);
      window.pywebview.api.analisar_blade_split(jsonPath, 0);
    } else {
      setTimeout(() => {
        setBladeSplitSuspeitos([
          {
            blade_position: 'A',
            total_fotos: 1400,
            gap_seconds: 400,
            split_index_sorted: 700,
            itens_com_tempo: []
          }
        ]);
        setBladeSplitLoading(false);
        addLog({ type: "success", text: "Análise simulada concluída." });
      }, 800);
    }
  }, [isPyWebView, clearLogs, addLog]);

  const openFolder = useCallback((path) => {
    if (isPyWebView && path) {
      window.pywebview.api.open_folder(path);
    }
  }, [isPyWebView]);

  // Limpar listeners ao desmontar
  useEffect(() => {
    return () => {
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  return {
    logs, running, ran, progress, lastOutput,
    gpsLoading, gpsFotos, setGpsFotos,
    bladeSplitLoading, bladeSplitSuspeitos, setBladeSplitSuspeitos,
    clearLogs, handleRun, pickInput,
    carregarFotosGps, carregarBladeSplit, openFolder,
    isPyWebView,
  };
}
