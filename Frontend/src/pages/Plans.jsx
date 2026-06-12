import React, { useEffect, useState } from 'react';
import PlanForm from './../components/PlansForm.jsx';
import { apiRequest, toApiBody } from '../services/api';

export default function Planes() {
  const [lista, setLista] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toggle, setToggle] = useState('Perro');
  const [pagos, setPagos] = useState({});
  const [error, setError] = useState('');

  const loadPlans = async () => {
    try {
      setError('');
      setLista(await apiRequest('/plans'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const openAdd = () => { setEditItem(null); setShowForm(true); };
  const openEdit = plan => { setEditItem(plan); setShowForm(true); };

  const remove = async id => {
    await apiRequest(`/plans/${id}`, { method: 'DELETE' });
    setLista(l => l.filter(x => (x._id || x.id) !== id));
  };

  const save = async item => {
    const id = item._id || item.id;
    const payload = {
      ...item,
      tipoMascota: item.tipoMascota || toggle,
      features: item.descripcion
        ? item.descripcion.split('\n').map(s => s.trim()).filter(Boolean)
        : item.features,
    };
    delete payload._id;
    delete payload.id;

    await apiRequest(id ? `/plans/${id}` : '/plans', {
      method: id ? 'PUT' : 'POST',
      body: toApiBody(payload),
    });
    await loadPlans();
    setShowForm(false);
  };

  const getPago = id => pagos[id] ?? 'anual';
  const setPago = (id, val) => setPagos(p => ({ ...p, [id]: val }));
  const formatPrice = val => '$' + (parseFloat(val) || 0).toLocaleString('es-CO');
  const planesFiltrados = lista.filter(plan => (plan.tipoMascota || 'Perro') === toggle);

  return (
    <div style={{ minHeight: '100vh', background: '#fde8ee', padding: '0 0 48px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '28px 32px 8px 32px' }}>
        <span style={{ background: '#e87a9a', color: '#1a1a1a', fontWeight: 800, fontSize: 22, borderRadius: 10, padding: '6px 22px' }}>Planes</span>
        <button style={{ marginLeft: 'auto', background: '#e87a9a', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 22px', fontWeight: 700 }} onClick={openAdd}>+ Agregar</button>
        <button style={{ background: '#fce8ef', color: '#d5556a', border: 'none', borderRadius: 10, padding: '9px 18px', fontWeight: 700 }}>☰ Filtrar</button>
      </div>

      {error && <p className="empty-state">{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '24px 0 28px 0' }}>
        {['Perro', 'Gato'].map(key => (
          <button
            key={key}
            style={{ padding: '10px 32px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, background: toggle === key ? '#d5556a' : '#fce8ef', color: toggle === key ? '#fff' : '#d5556a' }}
            onClick={() => setToggle(key)}
          >
            {key === 'Perro' ? '🐶' : '🐱'} {key}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 28, padding: '0 32px' }}>
        {planesFiltrados.length === 0 && <p style={{ color: '#888', textAlign: 'center', width: '100%' }}>Sin planes registrados.</p>}
        {planesFiltrados.map(plan => {
          const id = plan._id || plan.id;
          const modoActual = getPago(id);
          const precioMostrado = modoActual === 'anual' ? plan.precioAnual : plan.precioMensual;

          return (
            <div key={id} style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '32px 28px 24px 28px', width: 340, display: 'flex', flexDirection: 'column' }}>
              <p style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, margin: 0 }}>{plan.nombre}</p>
              <p style={{ textAlign: 'center', fontSize: 34, fontWeight: 800, color: '#e87a9a', margin: '6px 0 2px 0' }}>{formatPrice(precioMostrado)}</p>
              <p style={{ textAlign: 'center', fontSize: 12, color: '#888', margin: '0 0 20px 0' }}>{modoActual === 'anual' ? 'Pago anual' : 'Pago mes a mes'}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(plan.features ?? []).map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#f5b8cc', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <p style={{ fontWeight: 700, fontSize: 13 }}>Selecciona modalidad de pago</p>
              {[
                { val: 'anual', label: 'Pago anual', precio: plan.precioAnual },
                { val: 'mensual', label: 'Pago mes a mes', precio: plan.precioMensual },
              ].map(({ val, label, precio }) => (
                <div key={val} style={{ display: 'flex', justifyContent: 'space-between', background: '#fce8ef', borderRadius: 10, padding: '9px 14px', marginBottom: 8 }}>
                  <label><input type="radio" name={`pago-${id}`} checked={modoActual === val} onChange={() => setPago(id, val)} /> {label}</label>
                  <span style={{ color: '#d5556a', fontWeight: 700 }}>{formatPrice(precio)}</span>
                </div>
              ))}

              <button style={{ background: '#e87a9a', color: '#fff', border: 'none', borderRadius: 50, padding: '13px 0', width: '100%', fontWeight: 700, margin: '12px 0 16px' }}>Comprar ahora</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ flex: 1, background: '#fce8ef', color: '#d5556a', border: 'none', borderRadius: 10, padding: '9px 0', fontWeight: 700 }} onClick={() => openEdit(plan)}>✏️ Editar</button>
                <button style={{ flex: 1, background: '#fde8ee', color: '#cc3344', border: '1.5px solid #f5b8cc', borderRadius: 10, padding: '9px 0', fontWeight: 700 }} onClick={() => remove(id)}>🗑️ Eliminar</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && <PlanForm plan={editItem} onSave={save} onClose={() => setShowForm(false)} />}
    </div>
  );
}
