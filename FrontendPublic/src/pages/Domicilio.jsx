import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

function Domicilio() {
  const pink = "#E86D87";
  const navigate = useNavigate();
  const { items, deliveryAddress, setDeliveryAddress } = useCart();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: deliveryAddress?.firstName || "",
    lastName: deliveryAddress?.lastName || "",
    email: deliveryAddress?.email || "",
    phone: deliveryAddress?.phone || "",
    street: deliveryAddress?.street || "",
    floor: deliveryAddress?.floor || "",
    postalCode: deliveryAddress?.postalCode || "",
    region: deliveryAddress?.region || "",
    city: deliveryAddress?.city || "",
    country: deliveryAddress?.country || "El Salvador",
  });

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleContinue = () => {
    if (!form.firstName || !form.lastName || !form.street || !form.city || !form.region) {
      setError("Completa los datos del destinatario y la dirección.");
      return;
    }
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    setDeliveryAddress(form);
    navigate("/delivery");
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans flex justify-center">
      <div className="flex gap-24 pt-12">
        {/* FORMULARIO */}
        <div className="w-[720px]">
          <h1 className="text-6xl font-semibold text-black text-center">
            Entrega a domicilio estándar
          </h1>

          {/* DATOS */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black text-center mb-5">
              Datos del destinatario
            </h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-8">
              <input
                name="firstName"
                type="text"
                placeholder="Nombre"
                value={form.firstName}
                onChange={set}
                className="h-[45px] border border-gray-300 rounded-md px-5 outline-none text-gray-700"
              />

              <input
                name="lastName"
                type="text"
                placeholder="Apellido"
                value={form.lastName}
                onChange={set}
                className="h-[45px] border border-gray-300 rounded-md px-5 outline-none text-gray-700"
              />

              <input
                name="email"
                type="email"
                placeholder="Correo"
                value={form.email}
                onChange={set}
                className="h-[45px] border border-gray-300 rounded-md px-5 outline-none text-gray-700"
              />

              <div className="h-[45px] border border-gray-300 rounded-md px-5 flex items-center">
                <span className="text-black text-sm">+503</span>
                <span className="mx-4 h-6 border-l border-gray-400"></span>
                <input
                  name="phone"
                  type="text"
                  placeholder="Teléfono"
                  value={form.phone}
                  onChange={set}
                  className="w-full outline-none text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-black text-center mb-5">
              Dirección de entrega
            </h2>

            <div className="space-y-8">
              <input
                name="street"
                type="text"
                placeholder="Calle y número"
                value={form.street}
                onChange={set}
                className="w-full h-[45px] border border-gray-300 rounded-md px-5 outline-none text-gray-700"
              />

              <input
                name="floor"
                type="text"
                placeholder="Escalera, piso...(opcional)"
                value={form.floor}
                onChange={set}
                className="w-full h-[45px] border border-gray-300 rounded-md px-5 outline-none text-gray-700"
              />

              <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                <input
                  name="postalCode"
                  type="text"
                  placeholder="Código postal"
                  value={form.postalCode}
                  onChange={set}
                  className="h-[45px] border border-gray-300 rounded-md px-5 outline-none text-gray-700"
                />

                <input
                  name="region"
                  type="text"
                  placeholder="Región"
                  value={form.region}
                  onChange={set}
                  className="h-[45px] border border-gray-300 rounded-md px-5 outline-none text-gray-700"
                />

                <input
                  name="city"
                  type="text"
                  placeholder="Ciudad"
                  value={form.city}
                  onChange={set}
                  className="h-[45px] border border-gray-300 rounded-md px-5 outline-none text-gray-700"
                />

                <select
                  name="country"
                  value={form.country}
                  onChange={set}
                  className="h-[45px] border border-gray-300 rounded-md px-5 outline-none text-black"
                >
                  <option>El Salvador</option>
                  <option>Guatemala</option>
                  <option>Honduras</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-center mt-6" style={{ color: "#d5556a" }}>
              {error}
            </p>
          )}

          {/* BOTONES */}
          <div className="flex items-center justify-between mt-16">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="flex items-center gap-3 text-black text-lg"
            >
              <span className="text-gray-400 text-2xl">‹</span>
              Volver al carrito
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="w-[310px] h-[52px] rounded-md text-white text-xl font-bold"
              style={{ backgroundColor: pink }}
            >
              Continuar
            </button>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="w-[430px] min-h-[590px] bg-white rounded-lg border border-gray-200 shadow-xl px-9 py-9 mt-6">
          <h2 className="text-2xl font-medium text-black mb-10">
            Resumen de compra
          </h2>

          {items.length === 0 && (
            <p className="text-gray-400">Tu carrito está vacío.</p>
          )}

          {items.map(item => (
            <div key={item.productId} className="flex items-center gap-6 mb-10">
              <img
                src={item.image}
                alt={item.productName}
                className="w-[95px] h-[115px] object-contain"
              />

              <div>
                <h3 className="text-[14px] font-semibold leading-tight text-black w-[190px]">
                  {item.productName}
                </h3>
                <p className="text-[14px] text-black mt-3">
                  ${(item.price * item.amount).toFixed(2)} ({item.amount})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Domicilio;
