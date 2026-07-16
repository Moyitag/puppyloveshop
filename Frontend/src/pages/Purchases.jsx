import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const PAGE_SIZE = 5;

export default function Compras() {
  const [lista, setLista] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const total = Math.max(1, Math.ceil(lista.length / PAGE_SIZE));
  const paginated = lista.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalRecaudado = lista.reduce((acc, c) => acc + (c.totalWithDiscount ?? c.total ?? 0), 0);

  const loadPurchases = async () => {
    try {
      setError('');
      setLista(await apiRequest('/shoppingCart'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  return (
    <div>
      <div className="section-header">
        <span className="section-title">Compras</span>
      </div>

      {error && <p className="empty-state">{error}</p>}

      <p style={{ fontSize: 13, color: '#888', marginBottom: 12, textAlign: 'right' }}>
        {lista.length} compra{lista.length === 1 ? '' : 's'} · Total recaudado: ${totalRecaudado.toLocaleString()}
      </p>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Descuento</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr><td colSpan={5} className="empty-state">Sin compras registradas.</td></tr>
            )}
            {paginated.map(compra => (
              <tr key={compra._id}>
                <td>{compra.createdAt ? new Date(compra.createdAt).toLocaleDateString() : '-'}</td>
                <td>
                  {compra.userId?.fullName || 'Cliente eliminado'}
                  {compra.userId?.email && (
                    <div style={{ fontSize: 12, color: '#888' }}>{compra.userId.email}</div>
                  )}
                </td>
                <td>
                  {(compra.products || []).map((p, i) => (
                    <div key={p._id || i} style={{ fontSize: 13 }}>
                      {p.productId?.productName || 'Producto eliminado'} × {p.amount}
                    </div>
                  ))}
                </td>
                <td>${compra.discount || 0}</td>
                <td style={{ fontWeight: 700, color: '#d5556a' }}>
                  ${compra.totalWithDiscount ?? compra.total ?? 0}
                </td>
              </tr>
            ))}
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
    </div>
  );
}
