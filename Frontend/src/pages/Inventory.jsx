import React, { useEffect, useState } from 'react';
import InventarioForm from '../components/InventoryForm.jsx';
import { apiRequest, toApiBody } from '../services/api';

export default function Inventario() {
  const [lista, setLista] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [error, setError] = useState('');

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
    const id = editItem?._id || editItem?.id;

    await apiRequest(id ? `/products/${id}` : '/products', {
      method: id ? 'PUT' : 'POST',
      body: toApiBody(item),
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

      <div className="product-grid">
        {lista.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            Sin productos registrados.
          </div>
        )}

        {lista.map(p => {
          const id = p._id || p.id;
          const stock = p.variants?.[0]?.stock ?? 0;
          return (
            <div key={id} className="product-card">
              <div className="product-image">
                {p.images?.[0] ? <img src={p.images[0]} alt={p.productName} /> : <span style={{ fontSize: 34 }}>📦</span>}
              </div>
              <span className="product-name">{p.productName}</span>
              <span className="product-price">${p.price}</span>
              <span className="product-stock">Stock: {stock}</span>
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
