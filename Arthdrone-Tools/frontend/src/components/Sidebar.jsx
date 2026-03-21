// components/Sidebar.jsx — Navegação lateral com módulos

import { Icons } from '../constants/icons.jsx';

export default function Sidebar({ T, D, active, onSwitch }) {
  // Group modules based on their 'group' property
  const renderGroups = () => {
    const groups = {};
    T.modules.forEach(m => {
      if (!groups[m.group]) groups[m.group] = [];
      groups[m.group].push(m);
    });

    return Object.keys(groups).map((groupName, idx) => (
      <div key={idx} style={{ marginBottom: "16px" }}>
        {groupName && (
          <div style={{
            fontSize: "10.5px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: D.textMuted,
            padding: "8px 18px",
            marginTop: idx === 0 ? "4px" : "12px",
            marginBottom: "4px"
          }}>
            {groupName}
          </div>
        )}
        {groups[groupName].map(m => (
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
    ));
  };

  return (
    <div className="sidebar" style={{ borderRight: `1px solid ${D.border}`, background: D.bgPanel }}>
      {renderGroups()}
    </div>
  );
}
