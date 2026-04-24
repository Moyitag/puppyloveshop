import React, { useState } from 'react';
import './App.css';

import Login      from './pages/Login';
import Navbar     from './components/Navbar';
import Footer     from './components/Footer';
import Empleados  from './pages/Employees';
import Inventario from './pages/Inventory';
import Gastos     from './pages/Expenses';
import Planes     from './pages/Plans';

// "Ganancias" reutiliza Gastos con sub-tab
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab,  setActiveTab]  = useState('Empleados');

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'Empleados':  return <Empleados />;
      case 'Inventario': return <Inventario />;
      case 'Ganancias':  return <Gastos />;
      case 'Planes':     return <Planes />;
      case 'Gastos':     return <Gastos />;
      default:           return <Empleados />;
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={() => setIsLoggedIn(false)}
      />
      <main className="main-content">
        {renderTab()}
      </main>
      <Footer />
    </div>
  );
}