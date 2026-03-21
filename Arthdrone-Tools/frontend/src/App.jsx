import { useState, useEffect, useCallback } from "react";
import './App.css';
import { translations } from './constants/translations.js';
import TopBar from './components/TopBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ModuleForm from './components/ModuleForm.jsx';
import LogPanel from './components/LogPanel.jsx';
import StatusBar from './components/StatusBar.jsx';
import usePyWebView from './hooks/usePyWebView.js';

// ─── Tema (ainda precisa de D inline pois os componentes SVG usam cores dinâmicas) ──
const themes = {
  dark: {
    bg: "#1a1d23", bgDeep: "#14161b", bgPanel: "#1e2128", bgCard: "#22252e",
    border: "rgba(99,140,200,0.12)", borderLight: "rgba(99,140,200,0.07)",
    accent: "#4e8fd4", accentSoft: "rgba(78,143,212,0.15)", accentSofter: "rgba(78,143,212,0.08)",
    textPrimary: "#e8ecf2", textSecond: "#8c98ac", textMuted: "#4a5568",
    logBg: "#161820", inputBg: "#12141a",
    success: "#34c77b", warning: "#f5a623", error: "#f0554a", info: "#4e8fd4",
  },
  light: {
    bg: "#f7f8fc", bgDeep: "#eef1f7", bgPanel: "#f0f3f9", bgCard: "#ffffff",
    border: "rgba(46,90,160,0.10)", borderLight: "rgba(46,90,160,0.06)",
    accent: "#2e5aa0", accentSoft: "rgba(46,90,160,0.08)", accentSofter: "rgba(46,90,160,0.04)",
    textPrimary: "#1a2333", textSecond: "#4a5c78", textMuted: "#9aaabf",
    logBg: "#f0f3f9", inputBg: "#ffffff",
    success: "#1a9e5c", warning: "#c47d0a", error: "#d63b32", info: "#2e5aa0",
  },
};

export default function ArthdroneTools() {
  const [lang, setLang] = useState("pt");
  const [active, setActive] = useState(1);
  const [options, setOptions] = useState({});
  const [filePaths, setFilePaths] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("adark") || "false"); } catch { /* ignore */ return false; }
  });
  const [gpsRaiz, setGpsRaiz] = useState("");
  const [lastPaths, setLastPaths] = useState(() => {
    try { return JSON.parse(localStorage.getItem("alastpaths") || "{}"); } catch { /* ignore */ return {}; }
  });

  const {
    logs, running, ran, progress, lastOutput,
    gpsLoading, gpsFotos, setGpsFotos,
    bladeSplitLoading, bladeSplitSuspeitos, setBladeSplitSuspeitos,
    clearLogs, handleRun, pickInput,
    carregarFotosGps, carregarBladeSplit, openFolder,
    isPyWebView,
  } = usePyWebView();

  const D = darkMode ? themes.dark : themes.light;
  const T = translations[lang];
  const module = T.fields[active];

  // Aplicar tema via data attribute (para CSS custom properties)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    try { localStorage.setItem("adark", JSON.stringify(darkMode)); } catch { /* ignore */ }
  }, [darkMode]);

  // Persistir últimos caminhos
  useEffect(() => {
    try { localStorage.setItem("alastpaths", JSON.stringify(lastPaths)); } catch { /* ignore */ }
  }, [lastPaths]);

  const toggleLang = useCallback(() => {
    setLang(l => l === "pt" ? "en" : "pt");
    setActive(1); setOptions({}); setFilePaths({});
    clearLogs(); setGpsFotos([]); setGpsRaiz("");
  }, [clearLogs, setGpsFotos]);

  const switchModule = useCallback((id) => {
    setActive(id);
    clearLogs();
    setGpsFotos([]); setGpsRaiz("");
    setFilePaths(lastPaths[id] || {});
  }, [clearLogs, lastPaths, setGpsFotos]);

  // Atualizar lastPaths quando filePaths muda
  const updateFilePaths = useCallback((updater) => {
    setFilePaths(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setLastPaths(lp => ({ ...lp, [active]: next }));
      return next;
    });
  }, [active]);

  const onRun = useCallback(() => {
    handleRun(active, filePaths, options, gpsRaiz);
  }, [handleRun, active, filePaths, options, gpsRaiz]);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "Enter" && !running && module.action) onRun();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [running, module, onRun]);

  return (
    <div className="app-shell">
      <TopBar
        T={T} D={D} lang={lang}
        darkMode={darkMode} setDarkMode={setDarkMode}
        toggleLang={toggleLang}
      />

      {/* Progress Bar */}
      <div className="progress-container">
        {running && (
          <div className="progress-bar-track">
            {progress < 0
              ? <div className="progress-bar-indeterminate" />
              : <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            }
          </div>
        )}
      </div>

      {/* Body */}
      <div className="body-layout">
        <Sidebar T={T} D={D} active={active} onSwitch={switchModule} />

        <div className="main-panel">
          {/* Module Header */}
          <div className="module-header" style={{ background: D.bgDeep }}>
            <div className="module-header-title" style={{ color: D.textPrimary }}>{module.title}</div>
            <div className="module-header-desc" style={{ color: D.textSecond }}>{module.desc}</div>
          </div>

          {/* Form + Log */}
          <div className="form-log-container">
            <ModuleForm
              T={T} D={D} lang={lang} active={active} module={module}
              filePaths={filePaths} setFilePaths={updateFilePaths}
              options={options} setOptions={setOptions}
              running={running} ran={ran} lastOutput={lastOutput}
              gpsLoading={gpsLoading} gpsFotos={gpsFotos}
              gpsRaiz={gpsRaiz} setGpsRaiz={setGpsRaiz}
              bladeSplitLoading={bladeSplitLoading} bladeSplitSuspeitos={bladeSplitSuspeitos}
              setBladeSplitSuspeitos={setBladeSplitSuspeitos}
              onPickInput={pickInput} onCarregarGps={carregarFotosGps}
              onCarregarBladeSplit={carregarBladeSplit}
              onRun={onRun} onOpenFolder={openFolder}
              isPyWebView={isPyWebView}
            />

            {!module.doc && (
              <LogPanel T={T} D={D} logs={logs} onClear={clearLogs} />
            )}
          </div>
        </div>
      </div>

      <StatusBar T={T} D={D} active={active} running={running} progress={progress} />
    </div>
  );
}
