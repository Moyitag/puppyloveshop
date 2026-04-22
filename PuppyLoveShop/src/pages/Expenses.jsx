import React from "react";
import "../App.css";

const Expenses = () => {
  const expenses = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    nombre: "Churu",
    gasto: "10$",
    descripcion: "Churu - Inaba Dog Snack 4 Piezas Chicken With Salmon",
    status: i !== 8
  }));

  return (
    <div className="card-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--pink-medium)', margin: 0 }}>Gastos</h2>
        <div>
          <button className="btn-pink">Agregar</button>
          <button className="btn-pink" style={{ marginLeft: '10px' }}>Reporte PDF</button>
        </div>
      </div>

      <div style={{ textAlign: 'right', color: '#888', margin: '10px 0' }}>Gastos: 20000</div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Gasto</th>
            <th>Descripcion</th>
            <th>Status</th>
            <th>Ación</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td><img src="/logo.png" width="35" alt="icon" /></td>
              <td>{exp.nombre}</td>
              <td style={{ fontWeight: 'bold' }}>{exp.gasto}</td>
              <td style={{ color: '#ef869f', textDecoration: 'underline', fontSize: '18px' }}>{exp.descripcion}</td>
              <td>{exp.status ? '✅' : '❌'}</td>
              <td>✏️ 🗑️</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.5rem', color: '#ef869f', cursor: 'pointer' }}>
        〈 1 2 3 4 5 〉
      </div>
    </div>
  );
};

export default Expenses;