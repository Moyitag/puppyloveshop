import React from "react";
import "../App.css";

const Inventory = () => {
  // 1. Agregamos el campo "image" a cada producto
  const products = [
    { id: 1, name: "Alimento Perro", price: "$15.00", image: "/alimento.avif" },
    { id: 2, name: "Jaula Mediana", price: "$45.00", image: "/jaula.png" },
    { id: 3, name: "Cama Soft Gato", price: "$22.00", image: "/cama.webp" },
    { id: 4, name: "Shampoo Mascotas", price: "$9.50", image: "/shampoo.webp" },
    { id: 5, name: "Collar Azul", price: "$5.00", image: "/collar.webp" },
    { id: 6, name: "Arena Gato 5kg", price: "$12.00", image: "/arena.webp" },
    { id: 7, name: "Plato Acero", price: "$7.50", image: "/plato.png" },
    { id: 8, name: "Juguete Pollo", price: "$3.00", image: "/juguete.webp" }
  ];

  return (
    <div className="card-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--pink-medium)', margin: 0 }}>Inventario</h2>
        <button className="btn-pink">Agregar Producto</button>
      </div>

      <div className="inventory-grid">
        {products.map((prod) => (
          <div className="item-card" key={prod.id}>
            <div className="image-placeholder">
              {/* 2. Aquí cambiamos "/logo.png" por prod.image */}
              <img 
                src={prod.image} 
                width="100" 
                alt={prod.name} 
                onError={(e) => e.target.src = "/logo.png"} // Si no encuentra la foto, pone el logo por defecto
              />
            </div>
            <h3 style={{ fontSize: '16px', margin: '10px 0', fontWeight: '600' }}>{prod.name}</h3>
            <p style={{ color: '#ef869f', fontWeight: 'bold', fontSize: '1.1rem', margin: '5px 0' }}>{prod.price}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button className="btn-pink" style={{ padding: '5px 10px', fontSize: '12px' }}>Editar</button>
              <button className="btn-pink" style={{ padding: '5px 10px', fontSize: '12px', background: '#f7dae0' }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;