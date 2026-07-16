import { Link } from "react-router";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { useCart } from "../context/CartContext";

function Promotions() {
  const pink = "#E86D87";
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/products")
      .then(setProducts)
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="w-full min-h-screen bg-white px-16 py-6 font-sans">
      <div className="flex gap-20">
        {/* SIDEBAR */}
        <aside className="w-[190px]">
          <div className="flex items-center gap-2 text-[17px] mb-8">
            <Link to="/">
              <span style={{ color: pink }}>Inicio</span>
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400">Promociones</span>
          </div>

          <h3 className="text-[17px] font-semibold text-black mb-5">
            Mascotas
          </h3>

          <ul className="space-y-4 text-[15px] text-gray-500">
            <li>Perro</li>
            <li>Gato</li>
            <li>Pájaros</li>
            <li>Peces</li>
          </ul>
        </aside>

        {/* PRODUCTOS */}
        <main className="flex-1">
          {error && <p className="text-red-500">{error}</p>}
          {!error && products.length === 0 && (
            <p className="text-gray-400">No hay promociones disponibles.</p>
          )}

          <div className="grid grid-cols-3 gap-x-16 gap-y-24 max-w-[980px]">
            {products.map(product => (
              <div
                key={product._id}
                className="relative w-[270px] h-[410px] bg-white rounded-lg border border-gray-300 shadow-lg px-8 py-8 flex flex-col"
              >
                {/* ETIQUETA OFERTA */}
                <div className="absolute top-0 left-0 w-[105px] h-[32px] bg-[#FFE5BB] rounded-br-lg rounded-tl-lg flex items-center justify-center">
                  <span className="text-[13px] font-bold text-black">
                    OFERTA
                  </span>
                </div>

                <img
                  src={product.images?.[0]}
                  alt={product.productName}
                  className="w-full h-[190px] object-contain mt-6"
                />

                <h3 className="text-[15px] font-semibold text-black leading-tight mt-5 min-h-[45px]">
                  {product.productName}
                </h3>

                <p className="text-[15px] mt-2" style={{ color: pink }}>
                  ${product.price}
                </p>

                <button
                  onClick={() => addItem(product)}
                  className="w-full h-[44px] rounded-md text-white text-[15px] font-bold mt-auto"
                  style={{ backgroundColor: pink }}
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Promotions;