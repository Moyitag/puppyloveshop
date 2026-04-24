import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!correo || !contrasena) {
      setError('Por favor completa todos los campos.');
      return;
    }
    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-logo-circle">🐾</div>

      <div className="login-card">
        <h2>¡Bienvenido de nuevo!</h2>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <label>Correo</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
          />

          <span className="forgot-link">¿Olvidó su contraseña?</span>

          {error && (
            <p style={{ color: '#d5556a', fontSize: 13, marginBottom: 10, textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary">
            Iniciar sesión
          </button>
        </form>

        <p className="login-footer-text">PUPPY LOVE SHOP</p>
      </div>

      <footer style={{
        position: 'fixed', bottom: 0, width: '100%',
        background: '#d5556a', color: 'white',
        textAlign: 'center', padding: '10px',
        fontWeight: 'bold', letterSpacing: 2, fontSize: 13
      }}>
        PUPPY LOVE SHOP
      </footer>
    </div>
  );
}