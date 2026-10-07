import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useAuth } from "./AuthContext";
import { getMyCart, addProductToCart } from "../api/cartHelpers";
import { colors, radius, spacing } from "../theme";

const CartContext = createContext();

// Maneja el contador del carrito (badge del header), "agregar al carrito" desde
// cualquier pantalla y un mensaje flotante (toast) de confirmación.
export function CartProvider({ children }) {
  const { client, logout } = useAuth();
  const [count, setCount] = useState(0);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState("");
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  const showToast = useCallback(
    (msg) => {
      setToast(msg);
      clearTimeout(timer.current);
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start();
      }, 2200);
    },
    [opacity]
  );

  const refreshCount = useCallback(async () => {
    if (!client) return setCount(0);
    try {
      const cart = await getMyCart();
      setCount((cart?.products || []).reduce((sum, p) => sum + (p.amount || 0), 0));
    } catch {
      /* si falla, dejamos el contador como estaba */
    }
  }, [client]);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  // Agrega 1 unidad. Si el producto tiene varias variantes con stock (talla/color) devuelve
  // "needsVariant" para que la pantalla mande al usuario al detalle a elegir una.
  const addToCart = useCallback(
    async (product, amount = 1) => {
      if (!client) {
        showToast("Inicia sesión para agregar productos");
        return "error";
      }
      const available = (product.variants || []).filter((v) => v.stock > 0);
      if ((product.variants || []).length > 0 && available.length === 0) {
        showToast("Este producto está agotado");
        return "error";
      }
      if (available.length > 1) {
        showToast("Elige una opción para este producto");
        return "needsVariant";
      }
      const variantId = available[0]?._id || null;

      setAddingId(product._id);
      try {
        await addProductToCart(product._id, variantId, amount);
        await refreshCount();
        showToast(`${product.productName} se agregó al carrito 🛒`);
        return "ok";
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          showToast("Tu sesión venció. Inicia sesión nuevamente.");
          await logout();
        } else {
          showToast(err.response?.data?.message || "No se pudo agregar al carrito");
        }
        return "error";
      } finally {
        setAddingId(null);
      }
    },
    [client, logout, refreshCount, showToast]
  );

  return (
    <CartContext.Provider value={{ count, addingId, addToCart, refreshCount, showToast }}>
      <View style={{ flex: 1 }}>
        {children}
        <Animated.View pointerEvents="none" style={[styles.toast, { opacity }]}>
          <Text style={styles.toastText} numberOfLines={2}>
            {toast}
          </Text>
        </Animated.View>
      </View>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: 100,
    backgroundColor: "#2B2B2B",
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
  },
  toastText: { color: "#fff", textAlign: "center", fontSize: 13, fontWeight: "600" },
});