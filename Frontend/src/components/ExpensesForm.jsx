import React, { useState, useEffect } from 'react';
import ImageDropzone from './ImageDropzone.jsx';

const INITIAL = {
  nombre: '',
  gasto: '',
  descripcion: '',
  foto: '',
  activo: 'Si',
};

export default function GastoForm({ gasto, onSave, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (gasto) setForm(gasto);
    else setForm(INITIAL);
    setImageFile(null);
    setError('');
  }, [gasto]);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre || !form.gasto) {
      setError('Nombre y monto son obligatorios.');
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
        <h3 className="modal-title">Gasto</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={set}
                placeholder="Nombre del gasto"
              />
            </div>
            <div className="form-group">
              <label>Gasto ($)</label>
              <input
                name="gasto"
                type="number"
                step="0.01"
                value={form.gasto}
                onChange={set}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={set}
                rows={4}
                placeholder="Descripción del gasto..."
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
            <button type="submit" className="btn-save">Enviar</button>
          </div>
          {error && <p style={{ color: '#d5556a', fontSize: 13, marginTop: 10, textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
