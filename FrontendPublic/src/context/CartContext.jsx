import React, { createContext, useContext, useEffect, useState } from 'react';

const CART_KEY = 'plsCart';
const SHIPPING_FEE = 3.5;
const FREE_SHIPPING_THRESHOLD = 50;

const CartContext = createContext(null);

const loadInitial = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY));
    return {
      items: stored?.items || [],
      deliveryAddress: stored?.deliveryAddress || null,
      paymentMethod: stored?.paymentMethod || '',
    };
  } catch {
    return { items: [], deliveryAddress: null, paymentMethod: '' };
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadInitial().items);
  const [deliveryAddress, setDeliveryAddressState] = useState(() => loadInitial().deliveryAddress);
  const [paymentMethod, setPaymentMethodState] = useState(() => loadInitial().paymentMethod);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify({ items, deliveryAddress, paymentMethod }));
  }, [items, deliveryAddress, paymentMethod]);

  const addItem = (product, amount = 1) => {
    const productId = product._id || product.id;
    setItems(current => {
      const existing = current.find(i => i.productId === productId);
      if (existing) {
        return current.map(i =>
          i.productId === productId ? { ...i, amount: i.amount + amount } : i
        );
      }
      return [
        ...current,
        {
          productId,
          productName: product.productName,
          price: product.price,
          image: product.images?.[0] || '',
          amount,
        },
      ];
    });
  };

  const removeItem = productId => {
    setItems(current => current.filter(i => i.productId !== productId));
  };

  const updateAmount = (productId, amount) => {
    if (amount <= 0) {
      removeItem(productId);
      return;
    }
    setItems(current => current.map(i => (i.productId === productId ? { ...i, amount } : i)));
  };

  const clearCart = () => setItems([]);

  const setDeliveryAddress = address => setDeliveryAddressState(address);
  const setPaymentMethod = method => setPaymentMethodState(method);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.amount, 0);
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const value = {
    items,
    addItem,
    removeItem,
    updateAmount,
    clearCart,
    deliveryAddress,
    setDeliveryAddress,
    paymentMethod,
    setPaymentMethod,
    subtotal,
    shipping,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
