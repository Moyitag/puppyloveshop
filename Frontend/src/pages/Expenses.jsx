import React, { useEffect, useState } from 'react';
import GastoForm from '../components/ExpensesForm.jsx';
import { apiRequest, toApiBody } from '../services/api';

const PAGE_SIZE = 5;

export default function Gastos() {
  const [subTab, setSubTab] = useState('Gasto');
  const [lista, setLista] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const filtrados = lista.filter(x => (x.type || 'Gasto') === subTab);
  const total = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginated = filtrados.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalMonto = filtrados.reduce((acc, g) => acc + parseFloat(g.gasto || 0), 0);

  const loadMovements = async () => {
    try {
      setError('');
      setLista(await apiRequest('/financial-movements'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const openAdd = () => { setEditItem(null); setShowForm(true); };
  const openEdit = item => { setEditItem(item); setShowForm(true); };

  const remove = async id => {
    await apiRequest(`/financial-movements/${id}`, { method: 'DELETE' });
    setLista(l => l.filter(x => (x._id || x.id) !== id));
    setPage(1);
  };

  const save = async item => {
    const id = item._id || item.id;
    const payload = { ...item, type: item.type || subTab };
    delete payload._id;
    delete payload.id;

    await apiRequest(id ? `/financial-movements/${id}` : '/financial-movements', {
      method: id ? 'PUT' : 'POST',
      body: toApiBody(payload),
    });
    await loadMovements();
    setShowForm(false);
  };

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Gasto</span>
        <div className="header-actions">
          <button className="btn-add" onClick={openAdd}>+ Agregar</button>
          <button className="btn-pdf">📄 Reporte PDF</button>
          <button className="btn-filter">☰ Filtrar</button>
        </div>
      </div>

      {error && <p className="empty-state">{error}</p>}

      <p style={{ fontSize: 13, color: '#888', marginBottom: 12, textAlign: 'right' }}>
        {subTab}: {totalMonto.toLocaleString()}
      </p>

      <div className="sub-tabs">
        {['Ganancias', 'Gasto'].map(t => (
          <button
            key={t}
            className={`sub-tab ${subTab === t ? 'active' : ''}`}
            onClick={() => { setSubTab(t); setPage(1); }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Monto</th>
              <th>Descripcion</th>
              <th>Status</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={6} className="empty-state">Sin registros.</td></tr>
            )}
            {paginated.map(g => {
              const id = g._id || g.id;
              return (
                <tr key={id}>
                  <td>
                    {g.foto
                      ? <img src={g.foto} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 26 }}>🐾</span>}
                  </td>
                  <td>{g.nombre}</td>
                  <td style={{ fontWeight: 700, color: '#d5556a' }}>${g.gasto}</td>
                  <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.descripcion}</td>
                  <td>
                    <span className={g.activo === 'Si' ? 'status-ok' : 'status-no'}>
                      {g.activo === 'Si' ? '✔' : '✘'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openEdit(g)} title="Editar">✏️</button>
                      <button className="btn-icon" onClick={() => remove(id)} title="Eliminar">🗑️</button>
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
            <button key={i + 1} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(total, p + 1))}>›</button>
        </div>
      </div>

      {showForm && (
        <GastoForm gasto={editItem} onSave={save} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
