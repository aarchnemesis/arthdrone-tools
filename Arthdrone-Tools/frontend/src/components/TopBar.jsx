// components/TopBar.jsx — Barra superior com logo, tema, idioma e versão

import ARTHDRONE_ICON from '../icon.js';
import { Icons } from '../constants/icons.jsx';

export default function TopBar({ T, D, lang, darkMode, setDarkMode, toggleLang }) {
  return (
    <div className="topbar" style={{ background: D.bgDeep, borderBottom: `1px solid ${D.border}` }}>
      <div className="topbar-left">
        <img src={ARTHDRONE_ICON} alt="Arthdrone" className="topbar-logo" />
        <div>
          <div className="topbar-title" style={{ color: D.accent }}>{T.title}</div>
          <div className="topbar-subtitle" style={{ color: D.textMuted }}>{T.subtitle}</div>
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-theme-toggle" style={{ color: D.textMuted }}>
          <Icons.sun />
          <button
            className="toggle-track"
            style={{ background: darkMode ? D.accent : D.border }}
            onClick={() => setDarkMode(d => !d)}
          >
            <div className="toggle-knob" style={{ left: darkMode ? "19px" : "3px" }} />
          </button>
          <Icons.moon />
        </div>
        <div className="topbar-divider" style={{ background: D.border }} />
        <div className="topbar-status">
          <div className="topbar-status-dot" />
          <span className="topbar-version" style={{ color: D.textMuted }}>v4.0.0</span>
        </div>
        <button
          className="topbar-lang-btn"
          onClick={toggleLang}
          style={{ background: D.accentSofter, border: `1px solid ${D.border}`, color: D.accent }}
        >
          {lang === "pt" ? "PT → EN" : "EN → PT"}
        </button>
      </div>
    </div>
  );
}
