import React, { useState } from 'react';
import EmpleadoForm from "../components/FormEmployees.jsx";

const DATA = [
  { id: 1, nombre: 'Ana García',    cargo: 'Veterinaria',   email: 'ana@puppylove.com',    activo: 'Si', foto: '' },
  { id: 2, nombre: 'Luis Pérez',    cargo: 'Groomer',       email: 'luis@puppylove.com',   activo: 'Si', foto: '' },
  { id: 3, nombre: 'María López',   cargo: 'Recepcionista', email: 'maria@puppylove.com',  activo: 'Si', foto: '' },
  { id: 4, nombre: 'Carlos Torres', cargo: 'Asistente',     email: 'carlos@puppylove.com', activo: 'No', foto: '' },
  { id: 5, nombre: 'Sofía Ruiz',    cargo: 'Veterinaria',   email: 'sofia@puppylove.com',  activo: 'Si', foto: '' },
  { id: 6, nombre: 'Diego Mora',    cargo: 'Vendedor',      email: 'diego@puppylove.com',  activo: 'Si', foto: '' },
  { id: 7, nombre: 'Valeria Cruz',  cargo: 'Asistente',     email: 'vale@puppylove.com',   activo: 'Si', foto: '' },
];

const PAGE_SIZE = 5;

export default function Empleados() {
  const [lista, setLista]       = useState(DATA);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [page, setPage]         = useState(1);

  const total     = Math.ceil(lista.length / PAGE_SIZE);
  const paginated = lista.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd  = ()  => { setEditItem(null); setShowForm(true); };
  const openEdit = (e) => { setEditItem(e);    setShowForm(true); };
  const remove   = (id) => setLista(l => l.filter(x => x.id !== id));

  const save = item => {
    setLista(l =>
      l.some(x => x.id === item.id)
        ? l.map(x => x.id === item.id ? item : x)
        : [...l, item]
    );
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

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Cargo</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={6} className="empty-state">Sin registros.</td></tr>
            )}
            {paginated.map(emp => (
              <tr key={emp.id}>
                <td>
                  {emp.foto
                    ? <img src={emp.foto} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 28 }}>🐶</span>}
                </td>
                <td>{emp.nombre}</td>
                <td>{emp.cargo}</td>
                <td>{emp.email}</td>
                <td>
                  <span className={emp.activo === 'Si' ? 'status-ok' : 'status-no'}>
                    {emp.activo === 'Si' ? '✔' : '✘'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon" onClick={() => openEdit(emp)}>✏️</button>
                    <button className="btn-icon" onClick={() => remove(emp.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
          {Array.from({ length: total }, (_, i) => (
            <button key={i + 1}
              className={`page-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}>
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