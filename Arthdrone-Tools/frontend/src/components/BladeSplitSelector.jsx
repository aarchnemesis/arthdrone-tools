import React from 'react';
import { Icons } from '../constants/icons.jsx';

export default function BladeSplitSelector({
  T, D, lang,
  bladeSplitSuspeitos,
  setBladeSplitSuspeitos,
  setOptions
}) {
  if (!bladeSplitSuspeitos || bladeSplitSuspeitos.length === 0) return null;

  const handleUpdate = (idx, field, value) => {
    const newSuspeitos = [...bladeSplitSuspeitos];
    newSuspeitos[idx] = { ...newSuspeitos[idx], [field]: value };
    setBladeSplitSuspeitos(newSuspeitos);
    // Send corrections to options
    setOptions(o => ({ ...o, correcoes: newSuspeitos.filter(s => s.novo_blade_position && s.novo_blade_sn) }));
  };

  return (
    <div className="gps-selector-container" style={{ background: D.logBg, border: `1px solid ${D.borderLight}` }}>
      <div className="gps-selector-header" style={{ color: D.accent, borderBottom: `1px solid ${D.borderLight}` }}>
        {Icons.warn(D.accent)} Gaps de tempo detectados
      </div>
      <div className="gps-list">
        {bladeSplitSuspeitos.map((s, idx) => (
          <div key={idx} className="split-item" style={{ 
            padding: '12px', 
            borderBottom: `1px solid ${D.borderLight}`,
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}>
            <div style={{ color: D.textPrimary }}>
              <strong>Posicao Original:</strong> {s.blade_position} (Gap: {s.gap_seconds}s)
            </div>
            <div style={{ color: D.textSecond, fontSize: '0.9em' }}>
              Dividindo apos {s.split_index_sorted} fotos. Restantes: {s.total_fotos - s.split_index_sorted}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <input 
                type="text" 
                placeholder="Nova Posicao (A, B, C)"
                style={{ 
                  background: D.inputBg, border: `1px solid ${D.border}`, 
                  color: D.textPrimary, padding: '6px', borderRadius: '4px', width: '100px'
                }}
                value={s.novo_blade_position || ""}
                onChange={e => handleUpdate(idx, 'novo_blade_position', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Novo SN"
                style={{ 
                  background: D.inputBg, border: `1px solid ${D.border}`, 
                  color: D.textPrimary, padding: '6px', borderRadius: '4px', flex: 1
                }}
                value={s.novo_blade_sn || ""}
                onChange={e => handleUpdate(idx, 'novo_blade_sn', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
