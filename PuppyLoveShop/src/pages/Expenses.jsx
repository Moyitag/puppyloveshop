import React, { useState } from 'react';
import GastoForm from '../components/ExpensesForm.jsx';

const DATA_GASTOS = [
  { id: 1, nombre: 'Churu', gasto: '105', descripcion: 'Churu - India Dog Snack 4 Pieces Chicken With Salmon', activo: 'Si', foto: '' },
  { id: 2, nombre: 'Churu', gasto: '105', descripcion: 'Churu - India Dog Snack 4 Pieces Chicken With Salmon', activo: 'Si', foto: '' },
  { id: 3, nombre: 'Churu', gasto: '105', descripcion: 'Churu - India Dog Snack 4 Pieces Chicken With Salmon', activo: 'Si', foto: '' },
  { id: 4, nombre: 'Churu', gasto: '105', descripcion: 'Churu - India Dog Snack 4 Pieces Chicken With Salmon', activo: 'Si', foto: '' },
  { id: 5, nombre: 'Churu', gasto: '105', descripcion: 'Churu - India Dog Snack 4 Pieces Chicken With Salmon', activo: 'Si', foto: '' },
  { id: 6, nombre: 'Churu', gasto: '105', descripcion: 'Churu - India Dog Snack 4 Pieces Chicken With Salmon', activo: 'Si', foto: '' },
  { id: 7, nombre: 'Churu', gasto: '105', descripcion: 'Churu - India Dog Snack 4 Pieces Chicken With Salmon', activo: 'Si', foto: '' },
  { id: 8, nombre: 'Churu', gasto: '105', descripcion: 'Churu - India Dog Snack 4 Pieces Chicken With Salmon', activo: 'No', foto: '' },
];

const DATA_GANANCIAS = [
  { id: 1, nombre: 'Venta Alimento',    gasto: '250', descripcion: 'Venta mensual alimento premium', activo: 'Si', foto: '' },
  { id: 2, nombre: 'Servicio Grooming', gasto: '180', descripcion: 'Servicio de baño y corte',       activo: 'Si', foto: '' },
  { id: 3, nombre: 'Venta Accesorios',  gasto: '320', descripcion: 'Venta de arneses y correas',     activo: 'Si', foto: '' },
  { id: 4, nombre: 'Consultas Vet',     gasto: '400', descripcion: 'Consultas veterinarias mes',     activo: 'Si', foto: '' },
];

const PAGE_SIZE = 5;

export default function Gastos() {
  const [subTab, setSubTab]       = useState('Gasto');
  const [gastos, setGastos]       = useState(DATA_GASTOS);
  const [ganancias, setGanancias] = useState(DATA_GANANCIAS);
  const [showForm, setShowForm]   = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [page, setPage]           = useState(1);

  const lista    = subTab === 'Gasto' ? gastos    : ganancias;
  const setLista = subTab === 'Gasto' ? setGastos : setGanancias;

  const total     = Math.ceil(lista.length / PAGE_SIZE);
  const paginated = lista.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd  = ()  => { setEditItem(null); setShowForm(true); };
  const openEdit = (g) => { setEditItem(g);    setShowForm(true); };
  const remove   = id  => {
    setLista(l => l.filter(x => x.id !== id));
    setPage(1);
  };

  const save = item => {
    setLista(l =>
      l.some(x => x.id === item.id)
        ? l.map(x => x.id === item.id ? item : x)
        : [...l, item]
    );
    setShowForm(false);
  };

  const totalMonto = lista.reduce((acc, g) => acc + parseFloat(g.gasto || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <span className="section-title">Gasto</span>
        <div className="header-actions">
          <button className="btn-add" onClick={openAdd}>+ Agregar</button>
          <button className="btn-pdf">📄 Reporte PDF</button>
          <button className="btn-filter">☰ Filtrar</button>
        </div>
      </div>

      {/* Total */}
      <p style={{ fontSize: 13, color: '#888', marginBottom: 12, textAlign: 'right' }}>
        {subTab === 'Gasto' ? 'Gastos' : 'Ganancias'}: {totalMonto.toLocaleString()}
      </p>

      {/* Sub-tabs */}
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

      {/* Tabla */}
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Gasto</th>
              <th>Descripción</th>
              <th>Status</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-state">Sin registros.</td>
              </tr>
            )}
            {paginated.map(g => (
              <tr key={g.id}>
                <td>
                  {g.foto
                    ? <img src={g.foto} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 26 }}>🐾</span>}
                </td>
                <td>{g.nombre}</td>
                <td style={{ fontWeight: 700, color: '#d5556a' }}>${g.gasto}</td>
                <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {g.descripcion}
                </td>
                <td>
                  <span className={g.activo === 'Si' ? 'status-ok' : 'status-no'}>
                    {g.activo === 'Si' ? '✔' : '✘'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon" onClick={() => openEdit(g)} title="Editar">✏️</button>
                    <button className="btn-icon" onClick={() => remove(g.id)} title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
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
        <GastoForm
          gasto={editItem}
          onSave={save}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}