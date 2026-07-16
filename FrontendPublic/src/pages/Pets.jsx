import { useEffect, useState } from "react";
import { Link } from "react-router";
import { apiRequest } from "../services/api";
import { useCart } from "../context/CartContext";

const CATEGORIES = [
  "Alimento",
  "Juguetes",
  "Farmapet",
  "Accesorios",
  "Cuidado E Higiene",
  "Snacks",
  "Marcas Exclusivas",
];

function Category() {
  const pink = "#E86D87";
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    apiRequest("/products")
      .then(setProducts)
      .catch(err => setError(err.message));
  }, []);

  const visibleProducts = activeCategory
    ? products.filter(p => p.categories?.includes(activeCategory))
    : products;

  return (
    <div className="w-full min-h-screen bg-white px-16 py-6 font-sans">
      <div className="flex gap-20">
        {/* SIDEBAR */}
        <aside className="w-[190px]">
          <div className="flex items-center gap-2 text-[17px] mb-6">
            <Link to="/">
              <span style={{ color: pink }}>Inicio</span>
            </Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400">Productos</span>
          </div>

          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="inline-block bg-[#f9dce4] px-4 py-2 text-[14px] text-gray-500 mb-6"
            >
              {activeCategory} ×
            </button>
          )}

          <h3 className="text-[17px] font-semibold text-black mb-4">
            Categoria
          </h3>

          <ul className="space-y-3 text-[14px] text-black">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className="hover:underline"
                  style={{ color: activeCategory === cat ? pink : "inherit" }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* CONTENIDO */}
        <main className="flex-1">
          <h1 className="text-3xl font-semibold text-black mt-10">
            Tienda para mascotas: alimentos, accesorios y más
          </h1>

          <p className="text-gray-400 text-[15px] mt-3 max-w-[780px] leading-5">
            Descubre la más amplia variedad de alimentos, snacks, juguetes,
            medicinas y accesorios pensados para su bienestar y felicidad.
          </p>

          {error && <p className="text-red-500 mt-6">{error}</p>}

          {!error && visibleProducts.length === 0 && (
            <p className="text-gray-400 mt-6">No hay productos para mostrar.</p>
          )}

          {/* PRODUCTOS */}
          <div className="grid grid-cols-3 gap-x-12 gap-y-12 mt-10 max-w-[980px]">
            {visibleProducts.map(product => (
              <div
                key={product._id}
                className="w-[260px] h-[390px] bg-white rounded-lg border border-gray-300 shadow-lg mx-auto px-7 py-7 flex flex-col"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.productName}
                  className="w-full h-[180px] object-contain"
                />

                <h3 className="text-[13px] font-semibold text-black leading-tight mt-5">
                  {product.productName}
                </h3>

                <p className="text-[13px] mt-2" style={{ color: pink }}>
                  ${product.price}
                </p>

                <button
                  onClick={() => addItem(product)}
                  className="w-full h-[42px] rounded-md text-white text-[13px] font-bold mt-auto"
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

export default Category;
