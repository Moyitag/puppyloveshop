import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { createSale } from "../api/api";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../theme";

const PAYMENT_METHODS = ["Efectivo", "Tarjeta", "Transferencia"];

export default function CheckoutScreen({ route, navigation }) {
  const { cart } = route.params;
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const total = cart?.totalWithDiscount ?? cart?.total ?? 0;

  const validate = () => {
    const e = {};
    if (!address.trim()) e.address = "La dirección es obligatoria.";
    if (!city.trim()) e.city = "La ciudad es obligatoria.";
    if (!department.trim()) e.department = "El departamento es obligatorio.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
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

      <AppTextInput label="Dirección" placeholder="Calle, número, colonia..." value={address} onChangeText={setAddress} error={errors.address} />
      <AppTextInput label="Ciudad" placeholder="Ciudad" value={city} onChangeText={setCity} error={errors.city} />
      <AppTextInput label="Departamento" placeholder="Departamento" value={department} onChangeText={setDepartment} error={errors.department} />
      <AppTextInput label="Referencia (opcional)" placeholder="Punto de referencia" value={reference} onChangeText={setReference} />

      <Text style={styles.label}>Método de pago</Text>
      <View style={styles.paymentRow}>
        {PAYMENT_METHODS.map((m) => (
          <AppButton
            key={m}
            label={m}
            variant={paymentMethod === m ? "primary" : "outline"}
            onPress={() => setPaymentMethod(m)}
          />
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumen ({cart?.products?.length || 0} productos)</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${Number(total).toFixed(2)}</Text>
        </View>
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <AppButton label="Confirmar y pagar" onPress={handlePlaceOrder} loading={placing} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: "800", color: colors.text, marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: "700", color: colors.muted, marginBottom: spacing.xs, marginTop: spacing.sm },
  paymentRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
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
});
