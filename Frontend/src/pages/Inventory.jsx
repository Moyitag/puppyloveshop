import React, { useEffect, useState } from 'react';
import InventarioForm from '../components/InventoryForm.jsx';
import { apiRequest, toApiBody } from '../services/api';

export default function Inventario() {
  const [lista, setLista] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filtro, setFiltro] = useState('Todos');
  const [error, setError] = useState('');

  const filtrados = filtro === 'Todos' ? lista : lista.filter(p => p.activo === 'Si');

  const loadProducts = async () => {
    try {
      setError('');
      setLista(await apiRequest('/products'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAdd = () => { setEditItem(null); setShowForm(true); };
  const openEdit = producto => { setEditItem(producto); setShowForm(true); };

  const remove = async id => {
    await apiRequest(`/products/${id}`, { method: 'DELETE' });
    setLista(l => l.filter(x => (x._id || x.id) !== id));
  };

  const save = async item => {
    const id = item._id || item.id;
    const payload = { ...item };
    delete payload._id;
    delete payload.id;

    await apiRequest(id ? `/products/${id}` : '/products', {
      method: id ? 'PUT' : 'POST',
      body: toApiBody(payload),
    });
    await loadProducts();
    setShowForm(false);
  };

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Inventario</span>
        <button className="btn-add" onClick={openAdd}>+ Agregar</button>
      </div>

      {error && <p className="empty-state">{error}</p>}

      <div className="filter-bar">
        {['Todos', 'Activos'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filtro === f ? 'active' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtrados.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            Sin productos registrados.
          </div>
        )}

        {filtrados.map(p => {
          const id = p._id || p.id;
          return (
            <div key={id} className="product-card">
              <div className="product-image">
                {p.imagen ? <img src={p.imagen} alt={p.nombre} /> : <span style={{ fontSize: 34 }}>📦</span>}
              </div>
              <span className="product-name">{p.nombre}</span>
              <span className="product-price">${p.precio}</span>
              <span className="product-stock">Stock: {p.stock}</span>
              <span style={{ fontSize: 12, color: p.activo === 'Si' ? '#2ea832' : '#cc3344', fontWeight: 600 }}>
                {p.activo === 'Si' ? '✔ Activo' : '✘ Inactivo'}
              </span>
              <div className="product-actions">
                <button className="btn-icon" onClick={() => openEdit(p)} title="Editar">✏️</button>
                <button className="btn-icon" onClick={() => remove(id)} title="Eliminar">🗑️</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <InventarioForm producto={editItem} onSave={save} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
