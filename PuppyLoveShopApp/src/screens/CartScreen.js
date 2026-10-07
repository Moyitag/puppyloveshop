import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getMyCart, setCartItemQuantity, removeCartItem } from "../api/cartHelpers";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../theme";

const itemKey = (item) =>
  `${item.productId?._id || item.productId}:${item.variantId || "default"}`;

export default function CartScreen({ navigation }) {
  const { client } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyItem, setBusyItem] = useState("");

  const loadCart = useCallback(async () => {
    if (!client) {
      setLoading(false);
      return;
    }
    try {
      setError("");
      setCart(await getMyCart());
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo cargar el carrito.");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadCart();
    }, [loadCart])
  );

  const changeQuantity = async (item, delta) => {
    const productId = item.productId?._id || item.productId;
    const newQuantity = item.amount + delta;
    if (newQuantity < 1) return;
    setBusyItem(itemKey(item));
    try {
      await setCartItemQuantity(cart, productId, item.variantId, newQuantity);
      await loadCart();
    } catch (err) {
      Alert.alert("No se pudo actualizar", err.response?.data?.message || "Inténtalo nuevamente.");
    } finally {
      setBusyItem("");
    }
  };

  const removeItem = async (item) => {
    const productId = item.productId?._id || item.productId;
    setBusyItem(itemKey(item));
    try {
      await removeCartItem(cart, productId, item.variantId);
      await loadCart();
    } catch (err) {
      Alert.alert("No se pudo eliminar", err.response?.data?.message || "Inténtalo nuevamente.");
    } finally {
      setBusyItem("");
    }
  };

  const items = cart?.products || [];
  const total = cart?.totalWithDiscount ?? cart?.total ?? 0;
  const unitCount = items.reduce((sum, item) => sum + item.amount, 0);

  if (!client) {
    return <View style={styles.center}><Text style={styles.emptyText}>Inicia sesión para ver tu carrito.</Text></View>;
  }
  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={itemKey}
        contentContainerStyle={{ padding: spacing.md }}
        ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
        ListEmptyComponent={
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
            {error ? <AppButton label="Reintentar" onPress={loadCart} /> : null}
          </View>
        }
        renderItem={({ item }) => {
          const itemBusy = busyItem === itemKey(item);
          const selectedVariant = item.productId?.variants?.find(
            (variant) => String(variant._id) === String(item.variantId)
          );
          const atStockLimit = selectedVariant && item.amount >= selectedVariant.stock;
          const variantText = [item.size, item.color].filter(Boolean).join(" · ");
          const imageSource = item.productId?.images?.[0]
            ? { uri: item.productId.images[0] }
            : require("../../assets/icon.png");

          return (
            <View style={styles.row}>
              <Image source={imageSource} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name} numberOfLines={1}>{item.productId?.productName || "Producto no disponible"}</Text>
                {variantText ? <Text style={styles.variant}>{variantText}</Text> : null}
                <Text style={styles.price}>${Number(item.productId?.price || 0).toFixed(2)}</Text>
                <Text style={styles.subtotal}>Subtotal: ${Number(item.subtotal || 0).toFixed(2)}</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    style={styles.qtyButton}
                    disabled={itemBusy}
                    onPress={() => changeQuantity(item, -1)}
                  ><Text style={styles.qtyButtonText}>−</Text></TouchableOpacity>
                  {itemBusy ? <ActivityIndicator size="small" color={colors.primary} /> : <Text style={styles.qtyText}>{item.amount}</Text>}
                  <TouchableOpacity
                    style={[styles.qtyButton, atStockLimit && styles.disabledButton]}
                    disabled={itemBusy || atStockLimit}
                    onPress={() => changeQuantity(item, 1)}
                  ><Text style={styles.qtyButtonText}>+</Text></TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity disabled={itemBusy} onPress={() => removeItem(item)}>
                <Text style={styles.remove}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.unitCount}>{unitCount} {unitCount === 1 ? "unidad" : "unidades"}</Text>
          <Text style={styles.total}>Total: ${Number(total).toFixed(2)}</Text>
          <AppButton label="Continuar al pedido" onPress={() => navigation.navigate("Checkout", { cart })} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  centerContent: { gap: spacing.md },
  emptyText: { color: colors.muted, fontSize: 14, textAlign: "center", marginTop: spacing.xl },
  error: { color: colors.danger, marginBottom: spacing.sm, textAlign: "center" },
  row: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: 68, height: 68, borderRadius: radius.sm, marginRight: spacing.sm },
  details: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600", color: colors.text },
  variant: { color: colors.muted, fontSize: 12, marginTop: 2 },
  price: { fontSize: 13, color: colors.primary, fontWeight: "700", marginTop: 2 },
  subtotal: { color: colors.text, fontSize: 12, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: { opacity: 0.4 },
  qtyButtonText: { fontSize: 16, color: colors.text, fontWeight: "700" },
  qtyText: { minWidth: 20, textAlign: "center", fontSize: 14, fontWeight: "600", color: colors.text },
  remove: { color: colors.danger, fontSize: 12, fontWeight: "600" },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  unitCount: { color: colors.muted, fontSize: 12 },
  total: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
});
