import React, { useState, useEffect } from 'react';

const INITIAL = {
  nombre: '',
  precioMensual: '',
  precioAnual: '',
  descripcion: '',
  foto: '',
  activo: 'Si',
};

export default function PlanForm({ plan, onSave, onClose }) {
  const [form, setForm] = useState(INITIAL);

  useEffect(() => {
    if (plan) setForm(plan);
    else setForm(INITIAL);
  }, [plan]);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.nombre || !form.precioMensual) return;
    onSave({ ...form, id: plan?.id ?? Date.now() });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">Planes</h3>

        <form onSubmit={handleSubmit}>
          {/* Nombre + Precio Mensual + Precio Anual */}
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={set}
                placeholder="Ej: Plan Oro"
              />
            </div>
            <div className="form-group">
              <label>Precio Mensual</label>
              <input
                name="precioMensual"
                type="number"
                step="0.01"
                value={form.precioMensual}
                onChange={set}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Precio Anual</label>
              <input
                name="precioAnual"
                type="number"
                step="0.01"
                value={form.precioAnual}
                onChange={set}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Descripción + Foto */}
          <div className="form-row">
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={set}
                rows={4}
                placeholder="Características del plan (una por línea)..."
              />
            </div>
            <div className="form-group">
              <label>Foto (URL)</label>
              <input
                name="foto"
                value={form.foto}
                onChange={set}
                placeholder="https://..."
              />
              <div style={{ marginTop: 16 }}>
                <label>¿Están activos?</label>
                <div className="radio-group" style={{ marginTop: 8 }}>
                  {['Si', 'No'].map(v => (
                    <label className="radio-label" key={v}>
                      <input
                        type="radio"
                        name="activo"
                        value={v}
                        checked={form.activo === v}
                        onChange={set}
                      />
                      {v === 'Si' ? 'Sí' : 'No'}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
}