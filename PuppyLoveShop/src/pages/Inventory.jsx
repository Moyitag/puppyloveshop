import React, { useState } from 'react';
import InventarioForm from '../components/InventoryForm.jsx';

const DATA = [
  { id: 1, nombre: 'Alimento Húmedo Cachorro', precio: '6.00',  descripcion: 'Alimento premium para cachorros', stock: 25, activo: 'Si', imagen: '/alimento.avif' },
  { id: 2, nombre: 'Cama suave',        precio: '3.50',  descripcion: 'Huesos naturales para perros',    stock: 40, activo: 'Si', imagen: '/cama.webp' },
  { id: 3, nombre: 'Arena de gato',        precio: '12.00', descripcion: 'Arnés ergonómico talla S',        stock: 15, activo: 'Si', imagen: '/arena.webp' },
  { id: 4, nombre: 'Collar azul',             precio: '35.00', descripcion: 'Jaula plegable para transporte',  stock: 8,  activo: 'Si', imagen: '/collar.webp' },
  { id: 5, nombre: 'Alimento Premium Adulto',   precio: '18.00', descripcion: 'Alimento balanceado adultos',     stock: 30, activo: 'Si', imagen: '/gato.png' },
  { id: 6, nombre: 'Jaula mediana',      precio: '8.50',  descripcion: 'Escoba especial antiestática',    stock: 12, activo: 'No', imagen: '/jaula.png' },
];

export default function Inventario() {
  const [lista, setLista]       = useState(DATA);   
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filtro, setFiltro]     = useState('Todos');

  const filtrados = filtro === 'Todos' ? lista : lista.filter(p => p.activo === 'Si');

  <br/>

  const openAdd  = ()  => { setEditItem(null); setShowForm(true); };
  const openEdit = (p) => { setEditItem(p);    setShowForm(true); };
  const remove   = id  => setLista(l => l.filter(x => x.id !== id));

  const save = item => {
    setLista(l =>
      l.some(x => x.id === item.id)
        ? l.map(x => x.id === item.id ? { ...item, emoji: x.emoji } : x)
        : [...l, { ...item, emoji: '📦' }]
    );
    setShowForm(false);
  };

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Inventario</span>
        <button className="btn-add" onClick={openAdd}>+ Agregar</button>
      </div>

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

        {filtrados.map(p => (
          <div key={p.id} className="product-card">
            <div className="product-image">
              <img src={p.imagen} alt={p.nombre} />
            </div>
            <span className="product-name">{p.nombre}</span>
            <span className="product-price">${p.precio}</span>
            <span className="product-stock">Stock: {p.stock}</span>
            <span
              style={{
                fontSize: 12,
                color: p.activo === 'Si' ? '#2ea832' : '#cc3344',
                fontWeight: 600,
              }}
            >
              {p.activo === 'Si' ? '✔ Activo' : '✘ Inactivo'}
            </span>
            <div className="product-actions">
              <button className="btn-icon" onClick={() => openEdit(p)} title="Editar">✏️</button>
              <button className="btn-icon" onClick={() => remove(p.id)} title="Eliminar">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <InventarioForm
          producto={editItem}
          onSave={save}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}