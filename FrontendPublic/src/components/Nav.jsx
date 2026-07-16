import { Link, useNavigate } from 'react-router';
import { getCurrentClient, isAuthenticated, logout } from '../services/api';

function Nav() {
  const navigate = useNavigate();
  const client = getCurrentClient();

  const handleAccountClick = async e => {
    if (isAuthenticated()) {
      e.preventDefault();
      await logout();
      navigate('/');
    }
  };

  return (
    <header className="w-full">
      {/* Parte 1: barra superior del navbar */}
      <div
        className="flex items-center justify-between gap-6 px-8 py-4"
        style={{ backgroundColor: "#E86D87" }}
      >
        {/* Parte 2: logo */}
        <div className="flex items-center justify-center">
          <img
            src="/icons.svg"
            alt="Logo mascota"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Parte 3: buscador */}
        <div className="flex items-center bg-white rounded-xl w-[520px] h-[50px] px-4">
          <span className="text-black text-xl mr-3">⌕</span>
          <input
            type="text"
            placeholder="¿Qué necesita tu mascota?"
            className="w-full outline-none border-none text-gray-600 text-base bg-transparent"
          />
        </div>

        {/* Parte 4: dirección */}
        <div className="flex items-center gap-2 text-white text-base px-6 py-3 rounded-lg cursor-pointer hover:bg-[#c94f69] transition">
            <Link to="/domicilio">Agregar dirección</Link>
          <span className="text-xs">▼</span>
        </div>

        {/* Parte 5: botón de cuenta */}
        <div className="flex items-center gap-2 text-white text-base px-6 py-3 rounded-lg cursor-pointer hover:bg-[#c94f69] transition">
          <Link to={isAuthenticated() ? '/' : '/login'} onClick={handleAccountClick}>
            {isAuthenticated() ? `Hola, ${client?.fullName?.split(' ')[0] || 'cliente'} (salir)` : 'Mi cuenta'}
          </Link>
          <span className="text-xs">▼</span>
        </div>

        {/* Parte 6: ícono del carrito */}
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl text-[#E86D87] cursor-pointer">
          <Link to="/cart">
            🛒
          </Link>
        </div>
      </div>

      {/* Parte 7: barra inferior con enlaces */}
      <nav
        className="flex items-center justify-center gap-14 py-4"
        style={{ backgroundColor: "#FFFCE8" }}
      >
        <Link to="/" className="text-[#E86D87] text-base font-medium hover:text-[#c94f69] transition">
          Mascotas
        </Link>

        <Link to="/pets" className="text-[#E86D87] text-base font-medium hover:text-[#c94f69] transition">
          Categorias
        </Link>

        <Link to="/resenas" className="text-[#E86D87] text-base font-medium hover:text-[#c94f69] transition">
          Reseñas
        </Link>

        <Link to="/services" className="text-[#E86D87] text-base font-medium hover:text-[#c94f69] transition">
          Servicios
        </Link>

        <Link to="/promotions" className="text-[#E86D87] text-base font-medium hover:text-[#c94f69] transition">
          Promociones
        </Link>

        <Link to="/aboutUs" className="text-[#E86D87] text-base font-medium hover:text-[#c94f69] transition">
          Nosotros
        </Link>
      </nav>
    </header>
  );
}

export default Nav;
