import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

function Delivery() {
  const pink = "#E86D87";
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, paymentMethod, setPaymentMethod } = useCart();
  const [metodoPago, setMetodoPago] = useState(paymentMethod || "");

  const handleContinue = () => {
    if (!metodoPago) return;
    setPaymentMethod(metodoPago);
    navigate("/payment");
  };

  return (
    <div className="w-full min-h-screen bg-white px-20 py-12 font-sans">
      <div className="grid grid-cols-[1.35fr_0.8fr] gap-24">
        {/* LADO IZQUIERDO */}
        <div className="pl-8">
          {/* Pasos */}
          <div className="flex items-center gap-6 text-[17px] text-black">
            <Link to="/domicilio">
              <span className="cursor-pointer">Método de entrega</span>
            </Link>

            <span className="text-gray-400">›</span>

            <span>Método de pago</span>
          </div>

          <h1 className="text-4xl font-bold text-black mt-9">
            Elija un método de pago
          </h1>

          {/* Métodos de pago */}
          <div className="flex gap-12 mt-8">
            <button
              type="button"
              onClick={() => setMetodoPago("tarjeta")}
              className="w-[260px] h-[66px] rounded-md border-2 flex items-center justify-between px-7 text-black text-[15px]"
              style={{
                borderColor: pink,
                backgroundColor:
                  metodoPago === "tarjeta" ? "#ffe6ec" : "white",
              }}
            >
              <span>Tarjeta bancaria</span>
              <span className="text-xl">▭</span>
            </button>

            <button
              type="button"
              onClick={() => setMetodoPago("paypal")}
              className="w-[260px] h-[66px] rounded-md border-2 flex items-center justify-between px-7 text-black text-[15px]"
              style={{
                borderColor: pink,
                backgroundColor:
                  metodoPago === "paypal" ? "#ffe6ec" : "white",
              }}
            >
              <span>PayPal</span>
              <span className="text-xl">▣</span>
            </button>
          </div>

          {/* Texto de selección */}
          {metodoPago !== "" && (
            <p className="mt-5 text-[15px]" style={{ color: pink }}>
              Método seleccionado:{" "}
              {metodoPago === "tarjeta" ? "Tarjeta bancaria" : "PayPal"}
            </p>
          )}

          {/* Botones inferiores */}
          <div className="flex items-center justify-between mt-64 w-[640px]">
            <Link to="/domicilio">
              <button
                type="button"
                className="flex items-center gap-3 text-black text-[15px]"
              >
                <span className="text-gray-400 text-2xl">‹</span>
                Volver al método de entrega
              </button>
            </Link>

            <button
              type="button"
              onClick={handleContinue}
              disabled={!metodoPago}
              className="w-[255px] h-[42px] rounded-md text-white text-[17px] font-bold disabled:opacity-50"
              style={{ backgroundColor: pink }}
            >
              Continuar
            </button>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="w-[410px] min-h-[590px] bg-white rounded-lg border border-gray-200 shadow-xl px-9 py-9">
          <h2 className="text-2xl font-medium text-black mb-10">
            Resumen de compra
          </h2>

          {items.map(item => (
            <div key={item.productId} className="flex items-start gap-6 mb-9">
              <img
                src={item.image}
                alt={item.productName}
                className="w-[95px] h-[110px] object-contain"
              />

              <div>
                <h3 className="text-[14px] font-semibold leading-tight text-black w-[170px]">
                  {item.productName}
                </h3>

                <p className="text-[14px] text-black mt-4">
                  ${(item.price * item.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <div
            className="w-full h-[2px] mt-10 mb-8"
            style={{ backgroundColor: pink }}
          ></div>

          <div className="space-y-6 text-[17px]">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-400">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Envío</span>
              <span className="text-gray-400">${shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Total</span>
              <span className="text-gray-400">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="mt-56 border-t border-black" />
    </div>
  );
}

export default Delivery;
