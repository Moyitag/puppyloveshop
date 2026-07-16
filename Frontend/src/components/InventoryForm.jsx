import React, { useState, useEffect } from 'react';
import ImageDropzone from './ImageDropzone.jsx';
import { apiRequest } from '../services/api';

const INITIAL = {
  productName: '',
  price: '',
  description: '',
  stock: '',
  productType: '',
  supplierId: '',
  image: '',
};

export default function InventarioForm({ producto, onSave, onClose }) {
  const [form, setForm] = useState(INITIAL);
  const [imageFile, setImageFile] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersError, setSuppliersError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (producto) {
      setForm({
        productName: producto.productName || '',
        price: producto.price ?? '',
        description: producto.description || '',
        stock: producto.variants?.[0]?.stock ?? '',
        productType: producto.productType || '',
        supplierId: producto.supplierId?._id || producto.supplierId || '',
        image: producto.images?.[0] || '',
      });
    } else {
      setForm(INITIAL);
    }
    setImageFile(null);
    setError('');
  }, [producto]);

  useEffect(() => {
    apiRequest('/suppliers')
      .then(setSuppliers)
      .catch(err => {
        setSuppliers([]);
        setSuppliersError(err.message || 'No se pudieron cargar los proveedores.');
      });
  }, []);

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.productName || !form.price || !form.productType || !form.supplierId) {
      setError('Nombre, precio, tipo de producto y proveedor son obligatorios.');
      return;
    }
    try {
      setError('');
      await onSave({
        productName: form.productName,
        price: form.price,
        description: form.description,
        productType: form.productType,
        supplierId: form.supplierId,
        variants: [{ stock: Number(form.stock) || 0 }],
        imageFile,
      });
    } catch (err) {
      setError(err.message || 'No se pudo guardar.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">Inventario</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input name="productName" value={form.productName} onChange={set} placeholder="Nombre del producto" />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input name="price" type="number" step="0.01" value={form.price} onChange={set} placeholder="0.00" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de producto</label>
              <input name="productType" value={form.productType} onChange={set} placeholder="Ej: Alimento" />
            </div>
            <div className="form-group">
              <label>Proveedor</label>
              <select name="supplierId" value={form.supplierId} onChange={set}>
                <option value="">Selecciona un proveedor</option>
                {suppliers.map(s => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              {suppliersError && (
                <span style={{ fontSize: 12, color: '#cc3344' }}>
                  Error cargando proveedores: {suppliersError}
                  {(suppliersError.toLowerCase().includes('cookie') || suppliersError.toLowerCase().includes('denied')) &&
                    ' — tu sesión de administrador venció, cierra sesión y vuelve a entrar.'}
                </span>
              )}
              {!suppliersError && suppliers.length === 0 && (
                <span style={{ fontSize: 12, color: '#cc3344' }}>No hay proveedores registrados.</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={set} rows={3} placeholder="Descripción..." />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={set} placeholder="0" />
          </div>

          <ImageDropzone label="Imagen" value={form.image} file={imageFile} onFileChange={setImageFile} />

          <div className="form-buttons">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Enviar</button>
          </div>
          {error && <p style={{ color: '#d5556a', fontSize: 13, marginTop: 10, textAlign: 'center' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
