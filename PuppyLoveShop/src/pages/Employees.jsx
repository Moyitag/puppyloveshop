import React, { useState } from "react"; // 1. Agregamos useState
import "../App.css"; 
import EmployeeForm from "../components/FormEmployees"

const Employees = () => {
  // 2. Definimos el estado para mostrar/ocultar el formulario
  const [showForm, setShowForm] = useState(false);

  const employees = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    nombre: i === 0 ? 'Paul Cañas' : i === 1 ? 'Carlos Martínez' : `Empleado ${i + 1}`,
    tel: '7000-0000',
    email: 'contacto@puppylove.com',
    status: i < 8 
  }));

  return (
    <div className="card-container">
      {/* 3. Renderizado condicional: Si showForm es true, mostramos el componente */}
      {showForm ? (
        <div>
           {/* Botón opcional para regresar a la tabla */}
          <button 
            className="btn-pink" 
            onClick={() => setShowForm(false)}
            style={{ marginBottom: '20px' }}
          >
            ← Volver a la lista
          </button>
          <EmployeeForm />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: 'var(--pink-medium)', margin: 0 }}>Empleados</h2>
            {/* 4. El botón ahora cambia el estado a true al hacer click */}
            <button className="btn-pink" onClick={() => setShowForm(true)}>
              Agregar Empleado
            </button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Status</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id}>
                  <td>
                    <img src="/logo.png" width="30" style={{borderRadius: '50%'}} alt="Avatar" />
                  </td>
                  <td style={{ textAlign: 'left', color: '#666' }}>{e.nombre}</td>
                  <td style={{ color: '#888' }}>{e.tel}</td>
                  <td style={{ textDecoration: 'underline', color: '#ef869f' }}>{e.email}</td>
                  <td style={{ fontSize: '1.2rem' }}>
                    {e.status ? '🌚' : '❌'}
                  </td>
                  <td style={{ fontSize: '1.2rem', cursor: 'pointer', color: '#555' }}>
                    ✏️ 🗑️
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Employees;