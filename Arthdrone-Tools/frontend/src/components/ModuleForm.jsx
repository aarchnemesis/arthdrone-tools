import { useState } from 'react';
import { Icons } from '../constants/icons.jsx';
import { docContent } from '../constants/translations.js';
import GpsSelector from './GpsSelector.jsx';
import BladeSplitSelector from './BladeSplitSelector.jsx';

export default function ModuleForm({
  T, D, lang, active, module,
  filePaths, setFilePaths, options, setOptions,
  running, ran, lastOutput,
  gpsLoading, gpsFotos, gpsRaiz, setGpsRaiz,
  bladeSplitLoading, bladeSplitSuspeitos, setBladeSplitSuspeitos,
  onPickInput, onCarregarGps, onCarregarBladeSplit, onRun, onOpenFolder,
  isPyWebView,
}) {
  const [expandedDoc, setExpandedDoc] = useState(0);

  // Verifica se todos os inputs obrigatórios estão preenchidos
  const allInputsFilled = module.inputs?.every(inp => !!filePaths[inp.inputId]) ?? true;
  const needsGpsRaiz = (active === 5 || active === 7);
  const canRun = !running && allInputsFilled && (!needsGpsRaiz || (gpsRaiz && gpsFotos.length > 0)) && (active !== 6 || bladeSplitSuspeitos?.length > 0);

  const handlePickInput = async (inp) => {
    const path = await onPickInput(inp);
    if (path) {
      setFilePaths(p => ({ ...p, [inp.inputId]: path }));
    }
  };

  const handleClearInput = (inp) => {
    setFilePaths(p => ({ ...p, [inp.inputId]: "" }));
    if (active === 5 || active === 7) {
      setGpsRaiz("");
    }
  };

  return (
    <div className="module-form">
      {module.doc ? (
        <div style={{ paddingBottom: "20px" }}>
          {docContent[lang].map((d, i) => {
            const isExpanded = expandedDoc === i;
            return (
              <div
                key={i}
                className="doc-card"
                onClick={() => setExpandedDoc(isExpanded ? -1 : i)}
                style={{
                  background: D.bgCard,
                  border: `1px solid ${isExpanded ? D.accent : D.borderLight}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "8px",
                  boxShadow: isExpanded ? `0 2px 8px ${D.accentSofter}` : "none"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="doc-card-title" style={{ color: isExpanded ? D.accent : D.textPrimary, margin: 0, fontSize: "12.5px" }}>
                    {d.title}
                  </div>
                  <div style={{ color: D.textMuted, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
                    ▼
                  </div>
                </div>
                {isExpanded && (
                  <div className="doc-card-body" style={{ color: D.textSecond, marginTop: "12px", borderTop: `1px dashed ${D.borderLight}`, paddingTop: "12px", whiteSpace: "pre-line" }}>
                    {d.body}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* Inputs de arquivo/pasta */}
          {module.inputs.map((inp, i) => {
            const val = filePaths[inp.inputId];
            return (
              <div key={i} className="form-group">
                <div className="field-label" style={{ color: D.textMuted }}>{inp.label}</div>
                <div className="form-input-row">
                  <div
                    className={`input-field${val ? " filled" : ""}`}
                    onClick={() => handlePickInput(inp)}
                  >
                    <span style={{ color: val ? D.accent : D.textMuted, flexShrink: 0 }}>
                      {inp.type === "folder"
                        ? Icons.folder(val ? D.accent : D.textMuted)
                        : Icons.file(val ? D.accent : D.textMuted)}
                    </span>
                    <span className="input-field-text" title={val || inp.placeholder}>
                      {val || inp.placeholder}
                    </span>
                    {val && (
                      <span
                        className="input-field-clear"
                        style={{ color: D.textMuted }}
                        onClick={e => { e.stopPropagation(); handleClearInput(inp); }}
                      >
                        {Icons.close(D.textMuted)}
                      </span>
                    )}
                  </div>
                  {(active === 5 || active === 7) && inp.type === "folder" && val && (
                    <button
                      className="gps-load-btn"
                      onClick={() => onCarregarGps(val)}
                      disabled={gpsLoading}
                      style={{
                        border: `1px solid ${D.accent}`,
                        color: D.accent,
                        opacity: gpsLoading ? 0.6 : 1,
                      }}
                    >
                      {gpsLoading ? T.loading : T.load_photos}
                    </button>
                  )}
                  {active === 6 && inp.inputId === "data_file" && val && (
                    <button
                      className="gps-load-btn"
                      onClick={() => onCarregarBladeSplit(val)}
                      disabled={bladeSplitLoading}
                      style={{
                        border: `1px solid ${D.accent}`,
                        color: D.accent,
                        opacity: bladeSplitLoading ? 0.6 : 1,
                        marginLeft: '8px'
                      }}
                    >
                      {bladeSplitLoading ? T.loading : T.analyze_json}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* GPS Selector (módulo 5 e 7) */}
          {(active === 5 || active === 7) && (
            <GpsSelector
              T={T} D={D}
              gpsFotos={gpsFotos}
              gpsRaiz={gpsRaiz}
              setGpsRaiz={setGpsRaiz}
            />
          )}

          {/* Blade Split Selector (módulo 6) */}
          {active === 6 && bladeSplitSuspeitos?.length > 0 && (
            <BladeSplitSelector
              T={T} D={D} lang={lang}
              bladeSplitSuspeitos={bladeSplitSuspeitos}
              setBladeSplitSuspeitos={setBladeSplitSuspeitos}
              setOptions={setOptions}
            />
          )}

          {/* Opções pill */}
          {module.options.length > 0 && (
            <div className="options-row">
              {module.options.map((opt, i) => (
                <div key={i}>
                  <div className="field-label" style={{ color: D.textMuted }}>{opt.label}</div>
                  <div className="pill-group">
                    {opt.choices.map(c => (
                      <button
                        key={c}
                        className={`pill${options[opt.optionId] === c ? " active" : ""}`}
                        onClick={() => setOptions(o => ({ ...o, [opt.optionId]: c }))}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botão executar */}
          {module.action && (
            <div className="action-row">
              <button
                className={`run-btn${running ? " running" : ""}`}
                onClick={onRun}
                disabled={!canRun}
              >
                {running ? T.processing : module.action}
              </button>
              {ran && !running && (
                <div className="action-done">
                  <div className="done-label" style={{ color: D.success }}>
                    {Icons.check(D.success)}{T.done}
                  </div>
                  {lastOutput && isPyWebView && (
                    <button
                      className="open-output-btn"
                      onClick={() => onOpenFolder(lastOutput)}
                      style={{ border: `1px solid ${D.border}`, color: D.textSecond }}
                    >
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
  );
}
