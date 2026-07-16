import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { apiRequest, getCurrentClient } from "../services/api";

function LastPayment() {
  const pink = "#E86D87";
  const navigate = useNavigate();
  const { items, deliveryAddress, paymentMethod, subtotal, shipping, total, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    const client = getCurrentClient();

    if (!client?.id) {
      navigate("/login");
      return;
    }
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    if (!deliveryAddress) {
      navigate("/domicilio");
      return;
    }
    if (!paymentMethod) {
      navigate("/delivery");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const cart = await apiRequest("/shoppingCart", {
        method: "POST",
        body: JSON.stringify({
          userId: client.id,
          products: items.map(item => ({
            productId: item.productId,
            amount: item.amount,
          })),
        }),
      });

      await apiRequest("/sales", {
        method: "POST",
        body: JSON.stringify({
          shoppingCartId: cart._id,
          deliveryAddress: {
            address: deliveryAddress.floor
              ? `${deliveryAddress.street}, ${deliveryAddress.floor}`
              : deliveryAddress.street,
            city: deliveryAddress.city,
            department: deliveryAddress.region,
            reference: deliveryAddress.postalCode,
          },
          paymentMethod,
          paymentStatus: "pendiente",
        }),
      });

      clearCart();
      setShowModal(true);
    } catch (err) {
      setError(err.message || "No se pudo procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white px-20 py-12 font-sans relative">
      <div className="grid grid-cols-[1.35fr_0.8fr] gap-24">
        {/* LADO IZQUIERDO */}
        <div className="pl-8">
          {/* NAVEGACIÓN SUPERIOR */}
          <div className="flex items-center gap-6 text-[17px] text-black">
            <Link to="/domicilio">
              <span className="cursor-pointer">Método de entrega</span>
            </Link>

            <span className="text-gray-400">›</span>

            <Link to="/delivery">
              <span className="cursor-pointer">Método de pago</span>
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-black mt-9">
            Por favor revise su pedido
          </h1>

          {/* DETALLES DEL PEDIDO */}
          <div className="w-[650px] mt-6">
            {/* ENTREGA */}
            <div className="border-t border-gray-100 border-b py-5 flex justify-between">
              <div>
                <p className="text-[14px] font-bold text-black">
                  Entrega a domicilio estándar
                </p>
                <p className="text-[14px] text-black mt-2">
                  Envío: ${shipping.toFixed(2)}
                </p>
              </div>

              <Link to="/domicilio">
                <button className="text-[14px] font-bold text-black">
                  Editar
                </button>
              </Link>
            </div>

            {/* DIRECCIÓN */}
            <div className="border-b border-gray-100 py-5 flex justify-between">
              <div>
                {deliveryAddress ? (
                  <>
                    <p className="text-[14px] font-bold text-black">
                      {deliveryAddress.firstName} {deliveryAddress.lastName}
                    </p>
                    <p className="text-[14px] text-black mt-2">
                      {deliveryAddress.street}
                      {deliveryAddress.floor ? `, ${deliveryAddress.floor}` : ""}
                    </p>
                    <p className="text-[14px] text-black mt-2">
                      {deliveryAddress.city}, {deliveryAddress.region}
                    </p>
                    <p className="text-[14px] text-black mt-2">
                      +503 {deliveryAddress.phone} · {deliveryAddress.country}
                    </p>
                  </>
                ) : (
                  <p className="text-[14px] text-black">Sin dirección registrada.</p>
                )}
              </div>

              <Link to="/domicilio">
                <button className="text-[14px] font-bold text-black">
                  Editar
                </button>
              </Link>
            </div>

            {/* PAGO */}
            <div className="border-b border-gray-100 py-5">
              <div className="flex justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-[45px] h-[30px] border border-black flex items-center justify-center text-blue-600 font-bold">
                    {paymentMethod === "tarjeta" ? "T" : "P"}
                  </div>
                  <p className="text-[14px] font-bold text-black">
                    {paymentMethod === "tarjeta" ? "Tarjeta bancaria" : "PayPal"}
                  </p>
                </div>

                <Link to="/payment">
                  <button className="text-[14px] font-bold text-black">
                    Editar
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-6" style={{ color: "#d5556a" }}>
              {error}
            </p>
          )}

          {/* BOTONES */}
          <div className="flex items-center justify-between mt-12 w-[650px]">
            <Link to="/payment">
              <button
                type="button"
                className="flex items-center gap-3 text-black text-[15px]"
              >
                <span className="text-gray-400 text-2xl">‹</span>
                Volver al método de pago
              </button>
            </Link>

            <button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="w-[255px] h-[60px] rounded-md text-white text-[17px] font-bold leading-5 disabled:opacity-60"
              style={{ backgroundColor: pink }}
            >
              {loading ? "Procesando..." : "Pagar y procesar su pedido"}
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

      <hr className="mt-40 border-t border-black" />

      {/* MODAL PEDIDO REALIZADO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="w-[380px] h-[430px] bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-black mb-14 text-center px-6">
              Pedido realizado
            </h2>

            <div
              className="w-[160px] h-[160px] rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#a95682" }}
            >
              <span className="text-white text-8xl leading-none">✓</span>
            </div>

            <Link to="/">
              <button
                type="button"
                className="mt-12 w-[180px] h-[42px] rounded-md text-white text-[16px] font-bold"
                style={{ backgroundColor: pink }}
              >
                Finalizar
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default LastPayment;
