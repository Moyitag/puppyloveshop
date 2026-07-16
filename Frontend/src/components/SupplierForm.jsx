import React, { useState, useEffect } from 'react';

const INITIAL = {
  name: '',
  email: '',
  telephone: '',
  address: '',
  activo: 'Si',
};

export default function SupplierForm({ proveedor, onSave, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');

  useEffect(() => {
    if (proveedor) {
      setForm({
        name: proveedor.name || '',
        email: proveedor.email || '',
        telephone: proveedor.telephone || '',
        address: proveedor.address || '',
        activo: proveedor.active === false ? 'No' : 'Si',
      });
    } else {
      setForm(INITIAL);
    }
    setError('');
  }, [proveedor]);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.telephone || !form.address) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    try {
      setError('');
      await onSave({
        name: form.name,
        email: form.email,
        telephone: form.telephone,
        address: form.address,
        active: form.activo === 'Si',
      });
    } catch (err) {
      setError(err.message || 'No se pudo guardar.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">Proveedores</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input name="name" value={form.name} onChange={set} placeholder="Nombre del proveedor" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={set} placeholder="correo@proveedor.com" />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input name="telephone" value={form.telephone} onChange={set} placeholder="00000000" />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input name="address" value={form.address} onChange={set} placeholder="Dirección" />
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
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Enviar</button>
          </div>
          {error && <p style={{ color: '#d5556a', fontSize: 13, marginTop: 10, textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
