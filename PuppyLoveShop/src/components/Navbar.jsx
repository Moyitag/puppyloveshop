import React from 'react';

const TABS = ['Empleados', 'Inventario', 'Gastos', 'Planes'];

export default function Navbar({ activeTab, onTabChange, onLogout }) {
  return (
    <nav className="navbar">
     <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", color: 'white'}}>
  <img src="./logo.png" alt="logo" style={{ width: "40px", height: "40px", objectFit: "contain",}} />
  PuppyLoveShop
</span>

      <input
        className="navbar-search"
        type="text"
        placeholder="¿Qué necesitas?"
      />

      <div className="navbar-right">
        <div className="navbar-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="navbar-avatar" onClick={onLogout} title="Cerrar sesión">
          🐶
        </div>
      </div>
    </nav>
  );
}