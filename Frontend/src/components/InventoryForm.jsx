import React, { useState, useEffect } from 'react';
import ImageDropzone from './ImageDropzone.jsx';

const INITIAL = { nombre: '', precio: '', descripcion: '', stock: '', activo: 'Si', imagen: '' };

export default function InventarioForm({ producto, onSave, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (producto) setForm(producto);
    else setForm(INITIAL);
    setImageFile(null);
    setError('');
  }, [producto]);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre || !form.precio) {
      setError('Nombre y precio son obligatorios.');
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
        <h3 className="modal-title">Inventario</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={set} placeholder="Nombre del producto" />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input name="precio" type="number" step="0.01" value={form.precio} onChange={set} placeholder="0.00" />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={set} rows={3} placeholder="Descripción..." />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={set} placeholder="0" />
          </div>

          <ImageDropzone label="Imagen" value={form.imagen} file={imageFile} onFileChange={setImageFile} />

          <div className="form-group">
            <label>¿Están activos?</label>
            <div className="radio-group">
              {['Si', 'No'].map(v => (
                <label className="radio-label" key={v}>
                  <input type="radio" name="activo" value={v}
                    checked={form.activo === v} onChange={set} />
                  {v === 'Si' ? 'Sí' : 'No'}
                </label>
              ))}
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
