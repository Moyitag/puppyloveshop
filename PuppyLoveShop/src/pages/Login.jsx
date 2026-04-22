import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí puedes poner validación después, por ahora entra directo
    navigate('/inventory'); 
  };

  return (
    <div className="login-screen">
      <div className="login-card-box">
        <img src="/logo.png" className="login-logo-img" alt="Puppy Love" />
        <h2 className="login-welcome">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="login-form-flex">
          <div className="login-input-field">
            <label>Usuario</label>
            <input type="text" placeholder="Tu usuario aquí..." required />
          </div>
          <div className="login-input-field">
            <label>Contraseña</label>
            <input type="password" placeholder="********" required />
          </div>
          <button type="submit" className="btn-pink-full">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;