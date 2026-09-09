import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getCart, updateCartItem, removeFromCart } from "../api/api";
import { colors, spacing, radius } from "../theme";

export default function CartScreen({ navigation }) {
  const { client } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    if (!client) {
      setLoading(false);
      return;
    }
    try {
      const res = await getCart(client._id);
      setItems(res.data);
    } catch (err) {
      console.log("Error cargando carrito:", err.message);
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
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    await updateCartItem(item._id, { quantity: newQty });
    setItems((prev) =>
      prev.map((i) => (i._id === item._id ? { ...i, quantity: newQty } : i))
    );
  };

  const removeItem = async (id) => {
    await removeFromCart(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const total = items.reduce(
    (sum, i) => sum + (i.productId?.price || 0) * i.quantity,
    0
  );

  if (!client) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Inicia sesión para ver tu carrito.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: spacing.md }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image
              source={{ uri: item.productId?.image || "https://via.placeholder.com/80" }}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.productId?.name}
              </Text>
              <Text style={styles.price}>
                ${Number(item.productId?.price || 0).toFixed(2)}
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => changeQuantity(item, -1)}
                >
                  <Text style={styles.qtyButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => changeQuantity(item, 1)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item._id)}>
              <Text style={styles.remove}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {items.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate("Checkout", { items, total })}
          >
            <Text style={styles.checkoutText}>Ir a pagar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  emptyText: { color: colors.muted, fontSize: 14, textAlign: "center", marginTop: spacing.xl },
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
  image: { width: 60, height: 60, borderRadius: radius.sm, marginRight: spacing.sm },
  name: { fontSize: 14, fontWeight: "600", color: colors.text },
  price: { fontSize: 13, color: colors.primary, fontWeight: "700", marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.xs },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyButtonText: { fontSize: 16, color: colors.text, fontWeight: "700" },
  qtyText: { marginHorizontal: spacing.sm, fontSize: 14, fontWeight: "600", color: colors.text },
  remove: { color: colors.danger, fontSize: 12, fontWeight: "600" },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  total: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
