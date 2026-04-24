import React, { useState, useEffect } from 'react';

const INITIAL = {
  nombre: '',
  telefono: '',
  email: '',
  cargo: '',
  activo: 'Si',
  foto: '',
};

export default function FormEmployees({ empleado, onSave, onClose }) {
  const [form, setForm] = useState(INITIAL);

  useEffect(() => {
    if (empleado) setForm(empleado);
    else setForm(INITIAL);
  }, [empleado]);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.nombre || !form.email) return;
    onSave({ ...form, id: empleado?.id ?? Date.now() });
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
            <label>Cargo</label>
            <input
              name="cargo"
              value={form.cargo}
              onChange={set}
              placeholder="Ej: Veterinario"
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
        </form>
      </div>
    </div>
  );
}