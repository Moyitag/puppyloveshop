import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="main-navbar">
      <div className="nav-top">
        <div className="search-container">
          <span>🔍</span>
          <input type="text" placeholder="¿Qué necesitas?" className="nav-search" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'white' }}>
          <span>Agregar dirección ▼</span>
          <button className="btn-primary" style={{backgroundColor: 'var(--pink-medium)'}}>Mi cuenta ▼</button>
          <div style={{ width: '45px', height: '45px', background: 'white', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '80%' }} />
          </div>
        </div>
      </div>
      <div className="nav-bottom">
        <div className="nav-links-container">
          <Link to="/empleados">Empleados</Link>
          <Link to="/inventario">Inventario</Link>
          <Link to="/ganancias">Ganancias</Link>
          <Link to="/planes">Planes</Link>
          <Link to="/gastos">Gastos</Link>
        </div>
        <button className="btn-exit" onClick={() => navigate('/')}>Salir</button>
      </div>
    </nav>
  );
};
export default Navbar;