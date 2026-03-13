// components/ModuleForm.jsx — Formulário do módulo ativo

import { Icons } from '../constants/icons.jsx';
import { docContent } from '../constants/translations.js';
import GpsSelector from './GpsSelector.jsx';

export default function ModuleForm({
  T, D, lang, active, module,
  filePaths, setFilePaths, options, setOptions,
  running, ran, lastOutput,
  gpsLoading, gpsFotos, gpsRaiz, setGpsRaiz,
  onPickInput, onCarregarGps, onRun, onOpenFolder,
  isPyWebView,
}) {
  // Verifica se todos os inputs obrigatórios estão preenchidos
  const allInputsFilled = module.inputs?.every(inp => !!filePaths[inp.inputId]) ?? true;
  const canRun = !running && allInputsFilled && (active !== 3 || (gpsRaiz && gpsFotos.length > 0));

  const handlePickInput = async (inp) => {
    const path = await onPickInput(inp);
    if (path) {
      setFilePaths(p => ({ ...p, [inp.inputId]: path }));
    }
  };

  const handleClearInput = (inp) => {
    setFilePaths(p => ({ ...p, [inp.inputId]: "" }));
    if (active === 3) {
      setGpsRaiz("");
    }
  };

  return (
    <div className="module-form">
      {module.doc ? (
        <div>
          {docContent[lang].map((d, i) => (
            <div
              key={i}
              className="doc-card"
              style={{ background: D.bgCard, border: `1px solid ${D.borderLight}` }}
            >
              <div className="doc-card-title" style={{ color: D.accent }}>{d.title}</div>
              <div className="doc-card-body" style={{ color: D.textSecond }}>{d.body}</div>
            </div>
          ))}
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
                    <span className="input-field-text">
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
                  {active === 3 && inp.type === "folder" && val && (
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
                </div>
              </div>
            );
          })}

          {/* GPS Selector (módulo 3) */}
          {active === 3 && (
            <GpsSelector
              T={T} D={D}
              gpsFotos={gpsFotos}
              gpsRaiz={gpsRaiz}
              setGpsRaiz={setGpsRaiz}
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
