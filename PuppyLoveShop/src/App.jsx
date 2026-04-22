import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Employees from './pages/Employees';
import Expenses from './pages/Expenses';
import Login from './pages/Login';
import './App.css';

// Este componente decide si mostrar o no las barras de navegación
const NavigationWrapper = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  return (
    <>
      {/* Solo muestra los Navbars si NO estamos en el Login */}
      {!isLoginPage && (
        <>
          <nav className="nav-top">
            <div className="search-container">
              <span>🔍</span>
              <input type="text" placeholder="¿Qué necesitas?" className="nav-search" />
            </div>
            <div className="nav-user-zone">
              <span>Agregar dirección ▼</span>
              <button className="btn-pink-small">Mi cuenta ▼</button>
              <img src="/logo.png" className="user-avatar" alt="Logo" />
            </div>
          </nav>
          <nav className="nav-bottom">
            <div className="nav-links">
              <Link to="/employees">Empleados</Link>
              <Link to="/inventory">Inventario</Link>
              <Link to="/expenses">Gastos</Link>
            </div>
            <Link to="/login" className="btn-exit-white">Salir</Link>
          </nav>
        </>
      )}
      
      <main className={isLoginPage ? "login-bg" : "content-area"}>
        {children}
      </main>

      {!isLoginPage && (
        <footer className="footer-main">
          <hr />
          <h2>PUPPY LOVE SHOP</h2>
        </footer>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <NavigationWrapper>
        <Routes>
          {/* Al entrar a la página, te manda al login automáticamente */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          
          {/* Otras páginas */}
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </NavigationWrapper>
    </Router>
  );
}

export default App;