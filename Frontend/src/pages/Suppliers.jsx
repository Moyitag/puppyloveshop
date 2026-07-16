import React, { useEffect, useState } from 'react';
import SupplierForm from '../components/SupplierForm.jsx';
import { apiRequest, toApiBody } from '../services/api';

const PAGE_SIZE = 5;

export default function Proveedores() {
  const [lista, setLista] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const total = Math.max(1, Math.ceil(lista.length / PAGE_SIZE));
  const paginated = lista.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const loadSuppliers = async () => {
    try {
      setError('');
      setLista(await apiRequest('/suppliers'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const openAdd = () => { setEditItem(null); setShowForm(true); };
  const openEdit = proveedor => { setEditItem(proveedor); setShowForm(true); };

  const remove = async id => {
    await apiRequest(`/suppliers/${id}`, { method: 'DELETE' });
    setLista(l => l.filter(x => (x._id || x.id) !== id));
  };

  const save = async item => {
    const id = editItem?._id || editItem?.id;

    await apiRequest(id ? `/suppliers/${id}` : '/suppliers', {
      method: id ? 'PUT' : 'POST',
      body: toApiBody(item),
    });
    await loadSuppliers();
    setShowForm(false);
  };

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Proveedores</span>
        <div className="header-actions">
          <button className="btn-add" onClick={openAdd}>+ Agregar</button>
        </div>
      </div>

      {error && <p className="empty-state">{error}</p>}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={6} className="empty-state">Sin proveedores registrados.</td></tr>
            )}
            {paginated.map(prov => {
              const id = prov._id || prov.id;
              return (
                <tr key={id}>
                  <td>{prov.name}</td>
                  <td>{prov.email}</td>
                  <td>{prov.telephone}</td>
                  <td>{prov.address}</td>
                  <td>
                    <span className={prov.active ? 'status-ok' : 'status-no'}>
                      {prov.active ? '✔' : '✘'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(prov)}>✏️</button>
                      <button className="btn-icon" onClick={() => remove(id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(total, p + 1))}>›</button>
        </div>
      </div>

      {showForm && (
        <SupplierForm proveedor={editItem} onSave={save} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
