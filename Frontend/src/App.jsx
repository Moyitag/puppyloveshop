import React, { useState } from 'react';
import './App.css';

import Login      from './pages/Login';
import Navbar     from './components/Navbar';
import Footer     from './components/Footer';
import Empleados  from './pages/Employees';
import Inventario from './pages/Inventory';
import Compras    from './pages/Purchases';
import Proveedores from './pages/Suppliers';
import { isAuthenticated, logout } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [activeTab,  setActiveTab]  = useState('Empleados');

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'Empleados':   return <Empleados />;
      case 'Inventario':  return <Inventario />;
      case 'Compras':     return <Compras />;
      case 'Proveedores': return <Proveedores />;
      default:            return <Empleados />;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="main-content">
        {renderTab()}
      </main>
      <Footer />
    </div>
  );
}
