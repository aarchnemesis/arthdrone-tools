// components/Sidebar.jsx — Navegação lateral com módulos

import { Icons } from '../constants/icons.jsx';

export default function Sidebar({ T, D, active, onSwitch }) {
  return (
    <div className="sidebar" style={{ borderRight: `1px solid ${D.border}`, background: D.bgPanel }}>
      {T.modules.map(m => (
        <div
          key={m.id}
          className={`nav-item ${active === m.id ? "active" : ""}`}
          onClick={() => onSwitch(m.id)}
        >
          <div className="nav-icon" style={{ background: active === m.id ? D.accentSoft : D.accentSofter }}>
            {Icons[m.icon] ? Icons[m.icon](active === m.id ? D.accent : D.textMuted) : null}
          </div>
          <div>
            <div
              className="nav-item-label"
              style={{ color: active === m.id ? D.accent : D.textSecond }}
            >
              {m.label}
            </div>
            <div className="nav-item-short" style={{ color: D.textMuted }}>{m.short}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
