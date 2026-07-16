import React, { useState, useEffect } from 'react';

const INITIAL = {
  fullName: '',
  email: '',
  password: '',
  activo: 'Si',
};

export default function FormEmployees({ empleado, onSave, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');

  useEffect(() => {
    if (empleado) setForm({ ...empleado, password: '' });
    else setForm(INITIAL);
    setError('');
  }, [empleado]);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.fullName || !form.email) {
      setError('Nombre y email son obligatorios.');
      return;
    }
    if (!empleado && !form.password) {
      setError('La contrasena es obligatoria para crear un administrador.');
      return;
    }
    try {
      setError('');
      await onSave({ ...form, status: form.activo === 'Si' });
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
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={set}
              placeholder="Nombre completo"
            />
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
              placeholder="Contraseña del administrador"
            />
          </div>

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
