// components/LogPanel.jsx — Painel de log com auto-scroll

import { useRef, useEffect } from "react";
import { Icons } from '../constants/icons.jsx';

export default function LogPanel({ T, D, logs, onClear }) {
  const scrollRef = useRef(null);

  // Auto-scroll para o final quando novos logs chegam
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const logIcon = (t) => ({
    success: Icons.check(D.success),
    warning: Icons.warn(D.warning),
    error: Icons.error(D.error),
    info: Icons.info(D.info),
  }[t] || Icons.info(D.info));

  const logColor = (t) => ({
    success: D.success,
    warning: D.warning,
    error: D.error,
    info: D.info,
  }[t] || D.info);

  return (
    <div className="log-panel" style={{ borderTop: `1px solid ${D.border}`, background: D.logBg }}>
      <div className="log-header" style={{ borderBottom: `1px solid ${D.borderLight}` }}>
        <span className="log-title" style={{ color: D.textMuted }}>{T.log_title}</span>
        {logs.length > 0 && (
          <button className="log-clear-btn" onClick={onClear} style={{ color: D.accent }}>
            {T.clear}
          </button>
        )}
      </div>
      <div className="log-content" ref={scrollRef}>
        {logs.length === 0
          ? <div className="log-placeholder" style={{ color: D.textMuted }}>{T.log_placeholder}</div>
          : logs.map((l, i) => (
              <div key={i} className="log-line">
                <span className="log-line-icon">{logIcon(l.type)}</span>
                <span style={{ color: logColor(l.type), fontSize: 12 }}>{l.text}</span>
              </div>
            ))
        }
      </div>
    </div>
  );
}
