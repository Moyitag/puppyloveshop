import React from 'react';

const TABS = ['Empleados', 'Inventario', 'Órdenes', 'Planes'];

export default function Navbar({ activeTab, onTabChange, onLogout }) {
  return (
    <nav className="navbar">
      <span className="navbar-logo"><img src="" alt="" /> PuppyLoveShop</span>

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