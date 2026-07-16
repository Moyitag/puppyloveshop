import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { isAuthenticated } from "../services/api";

function Cart() {
  const pink = "#E86D87";
  const navigate = useNavigate();
  const { items, updateAmount, removeItem, clearCart, subtotal, shipping, total } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate(isAuthenticated() ? "/domicilio" : "/login");
  };

  return (
    <div className="w-full min-h-screen bg-white px-16 py-6 font-sans">
      {/* Volver */}
      <Link to="/" className="flex items-center gap-2 text-sm w-fit" style={{ color: pink }}>
        <span className="text-2xl">‹</span>
        <span>Continuar comprando</span>
      </Link>

      {/* Encabezado */}
      <div className="flex justify-between items-start mt-7">
        <div>
          <h1 className="text-3xl font-bold text-black">
            Carrito de compras
          </h1>
          <p className="text-gray-400 mt-3">{items.length} artículo(s) en el carrito</p>
        </div>

        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-base"
          style={{ color: "#c75d7b" }}
        >
          <span>🗑</span>
          <span>Vaciar el carrito de compras</span>
        </button>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-[1.4fr_0.9fr] gap-20 mt-10">
        {/* Productos */}
        <div className="space-y-10">
          {items.length === 0 && (
            <p className="text-gray-400">Tu carrito está vacío.</p>
          )}

          {items.map(item => (
            <div
              key={item.productId}
              className="h-[180px] rounded-xl border border-gray-200 shadow-lg flex items-center px-12"
            >
              <img
                src={item.image}
                alt={item.productName}
                className="w-[115px] h-[140px] object-contain"
              />

              <div className="flex-1 ml-8">
                <h3 className="text-black text-[17px] mt-4">
                  {item.productName}
                </h3>

                <div className="flex items-center gap-5 mt-8">
                  <button
                    onClick={() => updateAmount(item.productId, item.amount - 1)}
                    className="w-8 h-8 rounded-full text-white text-xl font-bold flex items-center justify-center"
                    style={{ backgroundColor: "#c75d7b" }}
                  >
                    -
                  </button>

                  <span className="text-2xl font-semibold">{item.amount}</span>

                  <button
                    onClick={() => updateAmount(item.productId, item.amount + 1)}
                    className="w-8 h-8 rounded-full text-white text-xl font-bold flex items-center justify-center"
                    style={{ backgroundColor: "#c75d7b" }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <p className="text-2xl text-black">${(item.price * item.amount).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-2xl"
                  style={{ color: "#9f4b68" }}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="w-[430px] min-h-[690px] bg-white rounded-xl border border-gray-200 shadow-xl px-9 py-9">
          <h2 className="text-2xl font-medium text-black mb-7">
            Resumen del pedido
          </h2>

          <div className="space-y-5 text-[17px]">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-400">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Envío</span>
              <span className="text-gray-400">${shipping.toFixed(2)}</span>
            </div>
          </div>

          <div
            className="w-full h-[2px] mt-12 mb-10"
            style={{ backgroundColor: pink }}
          ></div>

          <div className="space-y-5 text-[17px]">
            <div className="flex justify-between">
              <span className="text-gray-400">Total</span>
              <span className="text-gray-400">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-[245px] h-[44px] rounded-md text-white text-[17px] font-bold disabled:opacity-50"
              style={{ backgroundColor: pink }}
            >
              Proceder con pago
            </button>

            <Link to="/">
              <button
                type="button"
                className="w-[245px] h-[42px] rounded-md bg-white text-[17px] font-bold border-2"
                style={{ borderColor: pink }}
              >
                Continuar comprando
              </button>
            </Link>
          </div>

          <div className="mt-12 space-y-6 text-gray-300 text-[14px]">
            <div className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-[#ffe8bf] flex items-center justify-center text-[#b88947]">
                ✓
              </span>
              <p>Envío gratuito en pedidos superiores a $50</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-[#ffe8bf] flex items-center justify-center text-[#b88947]">
                🔒
              </span>
              <p>Compra 100% segura y protegida</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="mt-40 border-t border-black" />
    </div>
  );
}

export default Cart;
