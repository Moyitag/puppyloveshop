import React, { useState, useEffect } from 'react';
import ImageDropzone from './ImageDropzone.jsx';

const INITIAL = {
  nombre: '',
  telefono: '',
  email: '',
  password: '',
  cargo: '',
  activo: 'Si',
  foto: '',
};

export default function FormEmployees({ empleado, onSave, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (empleado) setForm({ ...empleado, password: '' });
    else setForm(INITIAL);
    setImageFile(null);
    setError('');
  }, [empleado]);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.nombre || !form.email) {
      setError('Nombre y email son obligatorios.');
      return;
    }
    if (!empleado && !form.password) {
      setError('La contrasena es obligatoria para crear un empleado.');
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
        <h3 className="modal-title">Empleados</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={set}
                placeholder="Nombre completo"
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={set}
                placeholder="000-000-0000"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={set}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={set}
              placeholder="Contraseña del empleado"
            />
          </div>

          <div className="form-group">
            <label>Cargo</label>
            <input
              name="cargo"
              value={form.cargo}
              onChange={set}
              placeholder="Ej: Veterinario"
            />
          </div>

          <ImageDropzone value={form.foto} file={imageFile} onFileChange={setImageFile} />

          <div className="form-group">
            <label>¿Están activos?</label>
            <div className="radio-group">
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

          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Enviar
            </button>
          </div>
          {error && <p style={{ color: '#d5556a', fontSize: 13, marginTop: 10, textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
