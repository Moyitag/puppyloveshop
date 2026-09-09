import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { createSale } from "../api/api";
import { colors, spacing, radius } from "../theme";

const PAYMENT_METHODS = ["Efectivo", "Tarjeta", "Transferencia"];

// El backend crea la venta a partir de un carrito existente:
// { shoppingCartId, deliveryAddress: { address, city, department, reference }, paymentMethod }
export default function CheckoutScreen({ route, navigation }) {
  const { cart } = route.params;
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [placing, setPlacing] = useState(false);

  const total = cart?.totalWithDiscount ?? cart?.total ?? 0;

  const handlePlaceOrder = async () => {
    if (!address.trim() || !city.trim() || !department.trim()) {
      Alert.alert("Datos incompletos", "Dirección, ciudad y departamento son obligatorios.");
      return;
    }
    setPlacing(true);
    try {
      await createSale({
        shoppingCartId: cart._id,
        deliveryAddress: { address, city, department, reference },
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
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={styles.title}>Confirmar pedido</Text>

      <Text style={styles.label}>Dirección</Text>
      <TextInput style={styles.input} placeholder="Calle, número, colonia..." placeholderTextColor={colors.muted} value={address} onChangeText={setAddress} />

      <Text style={styles.label}>Ciudad</Text>
      <TextInput style={styles.input} placeholder="Ciudad" placeholderTextColor={colors.muted} value={city} onChangeText={setCity} />

      <Text style={styles.label}>Departamento</Text>
      <TextInput style={styles.input} placeholder="Departamento" placeholderTextColor={colors.muted} value={department} onChangeText={setDepartment} />

      <Text style={styles.label}>Referencia (opcional)</Text>
      <TextInput style={styles.input} placeholder="Punto de referencia" placeholderTextColor={colors.muted} value={reference} onChangeText={setReference} />

      <Text style={styles.label}>Método de pago</Text>
      <View style={styles.paymentRow}>
        {PAYMENT_METHODS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.paymentChip, paymentMethod === m && styles.paymentChipActive]}
            onPress={() => setPaymentMethod(m)}
          >
            <Text style={[styles.paymentChipText, paymentMethod === m && styles.paymentChipTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumen ({cart?.products?.length || 0} productos)</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${Number(total).toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePlaceOrder} disabled={placing}>
        <Text style={styles.buttonText}>{placing ? "Procesando..." : "Confirmar y pagar"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  paymentRow: { flexDirection: "row", marginTop: spacing.xs, flexWrap: "wrap" },
  paymentChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
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
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
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
