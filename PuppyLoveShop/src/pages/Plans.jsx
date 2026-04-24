import React, { useState } from 'react';
import PlanForm from './../components/PlansForm.jsx';

const DATA = [
  {
    id: 1,
    nombre: 'Plan Oro',
    precioMensual: '350000',
    precioAnual: '300000',
    descripcion: '',
    foto: '',
    activo: 'Si',
    features: [
      'Consulta Veterina virtual 1 mes.',
      'Sin dispositivos límites.',
      'Collarín hermético.',
      'Soporte en modo nocturno premiun año.',
      'Cargamos de inicio desde Primera vez.',
    ],
  },
  {
    id: 2,
    nombre: 'Plan Plata',
    precioMensual: '250000',
    precioAnual: '200000',
    descripcion: '',
    foto: '',
    activo: 'Si',
    features: [
      'Consulta Veterina virtual 1 mes.',
      'Sin dispositivos límites.',
      'Collarín hermético.',
      'Dos consultas veterinarias premiun año.',
    ],
  },
];

const COLORS = {
  pink:       '#e87a9a',
  pinkLight:  '#fce8ef',
  pinkMid:    '#f5b8cc',
  pinkDark:   '#d5556a',
  yellow:     '#f5c842',
  text:       '#2d2d2d',
  textGray:   '#888',
  white:      '#ffffff',
  bg:         '#fde8ee',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: COLORS.bg,
    padding: '0 0 48px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '28px 32px 8px 32px',
  },
  titleBadge: {
    background: COLORS.pink,
    color: '#1a1a1a',
    fontWeight: 800,
    fontSize: 22,
    borderRadius: 10,
    padding: '6px 22px',
    letterSpacing: 0.5,
  },
  btnAgregar: {
    marginLeft: 'auto',
    background: COLORS.pink,
    color: COLORS.white,
    border: 'none',
    borderRadius: 10,
    padding: '9px 22px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  btnFiltrar: {
    background: COLORS.pinkLight,
    color: COLORS.pinkDark,
    border: 'none',
    borderRadius: 10,
    padding: '9px 18px',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  toggleRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    margin: '24px 0 28px 0',
  },
  toggleBtn: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 32px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 700,
    background: active ? COLORS.pinkDark : COLORS.pinkLight,
    color:      active ? COLORS.white    : COLORS.pinkDark,
    transition: 'all 0.2s',
  }),
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 28,
    padding: '0 32px',
  },
  card: {
    background: COLORS.white,
    borderRadius: 20,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    padding: '32px 28px 24px 28px',
    width: 340,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  cardName: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 700,
    color: COLORS.text,
    margin: 0,
  },
  cardPrice: {
    textAlign: 'center',
    fontSize: 34,
    fontWeight: 800,
    color: COLORS.pink,
    margin: '6px 0 2px 0',
  },
  cardPriceSub: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textGray,
    margin: '0 0 20px 0',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    fontSize: 13.5,
    color: COLORS.text,
    lineHeight: 1.4,
  },
  checkIcon: {
    width: 20,
    height: 20,
    minWidth: 20,
    borderRadius: '50%',
    background: COLORS.pinkMid,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 900,
    marginTop: 1,
  },
  pagoTitle: {
    fontWeight: 700,
    fontSize: 13,
    color: COLORS.text,
    margin: '0 0 10px 0',
  },
  pagoOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 20,
  },
  pagoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: COLORS.pinkLight,
    borderRadius: 10,
    padding: '9px 14px',
  },
  pagoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: 500,
    cursor: 'pointer',
  },
  pagoPrice: {
    fontWeight: 700,
    fontSize: 13,
    color: COLORS.pinkDark,
  },
  btnComprar: {
    background: COLORS.pink,
    color: COLORS.white,
    border: 'none',
    borderRadius: 50,
    padding: '13px 0',
    width: '100%',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  cardActions: {
    display: 'flex',
    gap: 10,
  },
  btnEditar: {
    flex: 1,
    background: COLORS.pinkLight,
    color: COLORS.pinkDark,
    border: 'none',
    borderRadius: 10,
    padding: '9px 0',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
  btnEliminar: {
    flex: 1,
    background: '#fde8ee',
    color: '#cc3344',
    border: '1.5px solid #f5b8cc',
    borderRadius: 10,
    padding: '9px 0',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  },
};

export default function Planes() {
  const [lista, setLista]       = useState(DATA);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toggle, setToggle]     = useState('Perro');
  const [pagos, setPagos]       = useState({});

  const openAdd  = ()  => { setEditItem(null); setShowForm(true); };
  const openEdit = (p) => { setEditItem(p);    setShowForm(true); };
  const remove   = id  => setLista(l => l.filter(x => x.id !== id));

  const save = item => {
    const features = item.descripcion
      ? item.descripcion.split('\n').map(s => s.trim()).filter(Boolean)
      : editItem?.features ?? ['Acceso al plan'];
    const full = { ...item, features };
    setLista(l =>
      l.some(x => x.id === full.id)
        ? l.map(x => x.id === full.id ? full : x)
        : [...l, full]
    );
    setShowForm(false);
  };

  const getPago = (id) => pagos[id] ?? 'anual';
  const setPago = (id, val) => setPagos(p => ({ ...p, [id]: val }));

  const formatPrice = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '$0';
    return '$' + num.toLocaleString('es-CO');
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.titleBadge}>Planes</span>
        <button style={styles.btnAgregar} onClick={openAdd}>+ Agregar</button>
        <button style={styles.btnFiltrar}>≡ Filtrar</button>
      </div>

      {/* Toggle Perro / Gato */}
      <div style={styles.toggleRow}>
        {[
          { key: 'Perro', emoji: '🐶' },
          { key: 'Gato',  emoji: '🐱' },
        ].map(({ key, emoji }) => (
          <button
            key={key}
            style={styles.toggleBtn(toggle === key)}
            onClick={() => setToggle(key)}
          >
            {emoji} {key}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={styles.grid}>
        {lista.length === 0 && (
          <p style={{ color: COLORS.textGray, textAlign: 'center', width: '100%' }}>
            Sin planes registrados.
          </p>
        )}

        {lista.map(plan => {
          const modoActual = getPago(plan.id);
          const precioMostrado = modoActual === 'anual'
            ? plan.precioMensual
            : plan.precioAnual;

          return (
            <div key={plan.id} style={styles.card}>
              {/* Nombre y precio */}
              <p style={styles.cardName}>{plan.nombre}</p>
              <p style={styles.cardPrice}>{formatPrice(precioMostrado)}</p>
              <p style={styles.cardPriceSub}>
                {modoActual === 'anual' ? 'Paga una vez al año' : 'Pago mes a mes'}
              </p>

              {/* Features */}
              <ul style={styles.featuresList}>
                {(plan.features ?? []).map((f, i) => (
                  <li key={i} style={styles.featureItem}>
                    <span style={styles.checkIcon}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Modalidad de pago */}
              <p style={styles.pagoTitle}>Selecciona modalidad de pago</p>
              <div style={styles.pagoOptions}>
                {[
                  { val: 'anual',   label: 'Pago anual',    precio: plan.precioMensual },
                  { val: 'mensual', label: 'Pago mes a mes', precio: plan.precioAnual  },
                ].map(({ val, label, precio }) => (
                  <div key={val} style={styles.pagoRow}>
                    <label style={styles.pagoLabel}>
                      <input
                        type="radio"
                        name={`pago-${plan.id}`}
                        value={val}
                        checked={modoActual === val}
                        onChange={() => setPago(plan.id, val)}
                        style={{ accentColor: COLORS.pinkDark }}
                      />
                      {label}
                    </label>
                    <span style={styles.pagoPrice}>{formatPrice(precio)}</span>
                  </div>
                ))}
              </div>

              {/* Botón Comprar */}
              <button style={styles.btnComprar}>Comprar ahora</button>

              {/* Acciones admin */}
              <div style={styles.cardActions}>
                <button style={styles.btnEditar} onClick={() => openEdit(plan)}>
                  ✏️ Editar
                </button>
                <button style={styles.btnEliminar} onClick={() => remove(plan.id)}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <PlanForm
          plan={editItem}
          onSave={save}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}