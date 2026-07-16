import React, { useEffect, useState } from 'react';
import EmpleadoForm from '../components/FormEmployees.jsx';
import { apiRequest, toApiBody } from '../services/api';

const PAGE_SIZE = 5;

export default function Empleados() {
  const [lista, setLista] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const total = Math.max(1, Math.ceil(lista.length / PAGE_SIZE));
  const paginated = lista.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const loadEmployees = async () => {
    try {
      setError('');
      setLista(await apiRequest('/administrator'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const openAdd = () => { setEditItem(null); setShowForm(true); };
  const openEdit = admin => {
    setEditItem({ ...admin, activo: admin.status ? 'Si' : 'No' });
    setShowForm(true);
  };

  const remove = async id => {
    await apiRequest(`/administrator/${id}`, { method: 'DELETE' });
    setLista(l => l.filter(x => (x._id || x.id) !== id));
  };

  const save = async item => {
    const id = item._id || item.id;
    const payload = { ...item };
    delete payload._id;
    delete payload.id;
    delete payload.activo;

    await apiRequest(id ? `/administrator/${id}` : '/administrator', {
      method: id ? 'PUT' : 'POST',
      body: toApiBody(payload),
    });
    await loadEmployees();
    setShowForm(false);
  };

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Empleados</span>
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
              <th>Contrasena</th>
              <th>Estado</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={5} className="empty-state">Sin registros.</td></tr>
            )}
            {paginated.map(emp => {
              const id = emp._id || emp.id;
              return (
                <tr key={id}>
                  <td>{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.password ? '********' : '-'}</td>
                  <td>
                    <span className={emp.status ? 'status-ok' : 'status-no'}>
                      {emp.status ? '✔' : '✘'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(emp)}>✏️</button>
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
        <EmpleadoForm empleado={editItem} onSave={save} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
