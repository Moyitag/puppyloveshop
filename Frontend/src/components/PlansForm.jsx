import React, { useState, useEffect } from 'react';
import ImageDropzone from './ImageDropzone.jsx';

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
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (plan) setForm(plan);
    else setForm(INITIAL);
    setImageFile(null);
    setError('');
  }, [plan]);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre || !form.precioMensual) {
      setError('Nombre y precio mensual son obligatorios.');
      return;
    }
    try {
      setError('');
      await onSave({ ...form, imageFile });
    } catch (err) {
      setError(err.message || 'No se pudo guardar.');
    }
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
              <ImageDropzone value={form.foto} file={imageFile} onFileChange={setImageFile} />
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
          {error && <p style={{ color: '#d5556a', fontSize: 13, marginTop: 10, textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
