import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { createSale } from "../api/api";
import { colors, spacing, radius } from "../theme";

const PAYMENT_METHODS = ["Efectivo", "Tarjeta", "Transferencia"];

export default function CheckoutScreen({ route, navigation }) {
  const { items, total } = route.params;
  const { client } = useAuth();
  const [address, setAddress] = useState(client?.address || "");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      Alert.alert("Dirección requerida", "Ingresa una dirección de entrega.");
      return;
    }
    setPlacing(true);
    try {
      await createSale({
        clientId: client._id,
        products: items.map((i) => ({
          productId: i.productId._id,
          quantity: i.quantity,
          price: i.productId.price,
        })),
        total,
        address,
        paymentMethod,
      });
      Alert.alert("¡Compra realizada!", "Tu pedido ha sido registrado.", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "No se pudo completar la compra.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar pedido</Text>

      <Text style={styles.label}>Dirección de entrega</Text>
      <TextInput
        style={styles.input}
        placeholder="Calle, número, colonia..."
        placeholderTextColor={colors.muted}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Método de pago</Text>
      <View style={styles.paymentRow}>
        {PAYMENT_METHODS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.paymentChip, paymentMethod === m && styles.paymentChipActive]}
            onPress={() => setPaymentMethod(m)}
          >
            <Text
              style={[
                styles.paymentChipText,
                paymentMethod === m && styles.paymentChipTextActive,
              ]}
            >
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumen ({items.length} productos)</Text>
        {items.map((i) => (
          <View key={i._id} style={styles.summaryRow}>
            <Text style={styles.summaryName} numberOfLines={1}>
              {i.quantity}x {i.productId?.name}
            </Text>
            <Text style={styles.summaryPrice}>
              ${(i.productId?.price * i.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePlaceOrder} disabled={placing}>
        <Text style={styles.buttonText}>{placing ? "Procesando..." : "Confirmar y pagar"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: "700", color: colors.muted, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    color: colors.text,
  },
  paymentRow: { flexDirection: "row", marginTop: spacing.xs },
  paymentChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  paymentChipActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  paymentChipText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  paymentChipTextActive: { color: "#fff" },
  summary: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: { fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xs },
  summaryName: { color: colors.text, fontSize: 13, flex: 1, marginRight: spacing.sm },
  summaryPrice: { color: colors.text, fontSize: 13, fontWeight: "600" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  totalLabel: { fontWeight: "800", color: colors.text, fontSize: 15 },
  totalValue: { fontWeight: "800", color: colors.primary, fontSize: 15 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
