import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Platform, Linking, Pressable } from "react-native";
import { createSale, startWompiPayment } from "../api/api";
import { useAuth } from "../context/AuthContext";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../theme";

const PAYMENT_METHODS = ["Efectivo", "Transferencia", "Tarjeta"];
const DEPARTMENTS = [
  "Ahuachapán", "Cabañas", "Chalatenango", "Cuscatlán", "La Libertad",
  "La Paz", "La Unión", "Morazán", "San Miguel", "San Salvador",
  "San Vicente", "Santa Ana", "Sonsonate", "Usulután",
];

export default function CheckoutScreen({ route, navigation }) {
  const { cart } = route.params;
  const { client } = useAuth();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [cardName, setCardName] = useState(client?.fullName || "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState(client?.email || "");
  const [phone, setPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [placing, setPlacing] = useState(false);

  const total = cart?.totalWithDiscount ?? cart?.total ?? 0;
  const unitCount = (cart?.products || []).reduce((sum, item) => sum + item.amount, 0);

  const updateCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
  };
  const updateExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  };

  const isValidCardNumber = (number) => {
    let sum = 0;
    let shouldDouble = false;
    for (let index = number.length - 1; index >= 0; index -= 1) {
      let digit = Number(number[index]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return number.length >= 13 && number.length <= 19 && sum % 10 === 0;
  };

  const validate = () => {
    const next = {};
    if (!address.trim()) next.address = "La dirección es obligatoria.";
    if (!city.trim()) next.city = "La ciudad es obligatoria.";
    if (!department.trim()) next.department = "El departamento es obligatorio.";
    if (paymentMethod === "Tarjeta") {
      const number = cardNumber.replace(/\D/g, "");
      const [month, year] = expiry.split("/").map(Number);
      const fullYear = year < 100 ? 2000 + year : year;
      const now = new Date();
      if (!cardName.trim()) next.cardName = "Escribe el nombre del titular.";
      if (!number) next.cardNumber = "Escribe un número de tarjeta.";
      if (!month || !year) next.expiry = "Escribe el vencimiento.";
      if (!/^\d{3}$/.test(cvv)) next.cvv = "El CVV debe tener 3 dígitos.";
      if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Correo inválido.";
      if (!/^[267]\d{7}$/.test(phone.replace(/\D/g, ""))) next.phone = "Escribe un teléfono salvadoreño válido de 8 dígitos.";
      if (!postalCode.trim()) next.postalCode = "Código postal obligatorio.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePlaceOrder = async () => {
    setSubmitError("");
    if (!validate() || placing) {
      if (!placing) setSubmitError("Revisa los campos marcados antes de continuar.");
      return;
    }
    setPlacing(true);
    try {
      let wompi = null;
      if (paymentMethod === "Tarjeta") {
        const [expiryMonth, expiryYear] = expiry.split("/").map(Number);
        const redirectUrl = Platform.OS === "web" && typeof window !== "undefined"
          ? `${window.location.origin}?payment=wompi`
          : "puppyloveshop://payment-result";
        const response = await startWompiPayment({
          shoppingCartId: cart._id,
          card: {
            number: cardNumber.replace(/\D/g, ""),
            cvv,
            expiryMonth,
            expiryYear,
          },
          customer: { name: cardName, email, phone, postalCode },
          deliveryAddress: { address, city, department, reference },
          redirectUrl,
        });
        wompi = response.data;
      }

      await createSale({
        shoppingCartId: cart._id,
        deliveryAddress: { address, city, department, reference },
        paymentMethod,
        wompiTransactionId: wompi?.transactionId,
        wompiIsReal: wompi?.isReal,
      });

      if (wompi?.paymentUrl) {
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.location.assign(wompi.paymentUrl);
        } else {
          await Linking.openURL(wompi.paymentUrl);
        }
        return;
      }
      Alert.alert("Pedido registrado", "Tu pedido se guardó con pago pendiente.");
      navigation.getParent()?.navigate("Catálogo");
    } catch (err) {
      const message = err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "La conexión tardó demasiado. Comprueba que el servidor esté encendido."
          : "No fue posible conectar con Wompi. Revisa los datos e inténtalo nuevamente.");
      setSubmitError(message);
      if (Platform.OS !== "web") Alert.alert("No se pudo procesar", message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Confirmar pedido</Text>
      <Text style={styles.sectionTitle}>Entrega</Text>
      <AppTextInput label="Dirección" placeholder="Calle, número, colonia..." value={address} onChangeText={setAddress} error={errors.address} />
      <View style={styles.row}>
        <View style={styles.field}><AppTextInput label="Ciudad" value={city} onChangeText={setCity} error={errors.city} /></View>
        <View style={styles.field}>
          <Text style={styles.inputLabel}>Departamento</Text>
          <Pressable
            style={[styles.select, errors.department && styles.selectError]}
            onPress={() => setDepartmentOpen((open) => !open)}
            accessibilityRole="button"
          >
            <Text style={department ? styles.selectText : styles.selectPlaceholder}>{department || "Selecciona un departamento"}</Text>
            <Text style={styles.chevron}>{departmentOpen ? "▲" : "▼"}</Text>
          </Pressable>
          {!!errors.department && <Text style={styles.fieldError}>{errors.department}</Text>}
          {departmentOpen && (
            <View style={styles.selectMenu}>
              {DEPARTMENTS.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.selectOption, department === item && styles.selectOptionActive]}
                  onPress={() => { setDepartment(item); setDepartmentOpen(false); setErrors((current) => ({ ...current, department: undefined })); }}
                >
                  <Text style={[styles.selectOptionText, department === item && styles.selectOptionTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
      <AppTextInput label="Referencia (opcional)" value={reference} onChangeText={setReference} />

      <Text style={styles.sectionTitle}>Método de pago</Text>
      <View style={styles.paymentRow}>
        {PAYMENT_METHODS.map((method) => (
          <View key={method} style={styles.paymentButton}>
            <AppButton label={method} variant={paymentMethod === method ? "primary" : "outline"} onPress={() => setPaymentMethod(method)} />
          </View>
        ))}
      </View>

      {paymentMethod === "Tarjeta" && (
        <View style={styles.cardPanel}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Pago seguro con Wompi</Text>
            <Text style={styles.cardBrand}>VISA · Mastercard</Text>
          </View>
          <AppTextInput label="Nombre del titular" value={cardName} onChangeText={setCardName} error={errors.cardName} autoCapitalize="words" />
          <AppTextInput label="Número de tarjeta" placeholder="0000 0000 0000 0000" value={cardNumber} onChangeText={updateCardNumber} error={errors.cardNumber} keyboardType="number-pad" autoComplete="cc-number" />
          <View style={styles.row}>
            <View style={styles.field}><AppTextInput label="Vencimiento" placeholder="MM/AAAA" value={expiry} onChangeText={updateExpiry} error={errors.expiry} keyboardType="number-pad" /></View>
            <View style={styles.field}><AppTextInput label="CVV" placeholder="123" value={cvv} onChangeText={(value) => setCvv(value.replace(/\D/g, "").slice(0, 4))} error={errors.cvv} keyboardType="number-pad" secureTextEntry /></View>
          </View>
          <AppTextInput label="Correo del pagador" value={email} onChangeText={setEmail} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
          <View style={styles.row}>
            <View style={styles.field}><AppTextInput label="Teléfono" placeholder="70000000" value={phone} onChangeText={(value) => setPhone(value.replace(/\D/g, "").slice(0, 8))} error={errors.phone} keyboardType="phone-pad" /></View>
            <View style={styles.field}><AppTextInput label="Código postal" value={postalCode} onChangeText={setPostalCode} error={errors.postalCode} keyboardType="number-pad" /></View>
          </View>
          <Text style={styles.securityNote}>Los datos de la tarjeta se envían directamente al backend para iniciar la autenticación 3DS y no se guardan en Puppy Love Shop.</Text>
        </View>
      )}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumen ({unitCount} {unitCount === 1 ? "unidad" : "unidades"})</Text>
        <View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>${Number(total).toFixed(2)}</Text></View>
      </View>
      {!!submitError && <Text style={styles.submitError}>{submitError}</Text>}
      <View style={styles.submit}><AppButton label={paymentMethod === "Tarjeta" ? "Continuar con Wompi" : "Confirmar pedido"} onPress={handlePlaceOrder} loading={placing} /></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, width: "100%", maxWidth: 720, alignSelf: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, marginBottom: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: colors.text, marginTop: spacing.sm, marginBottom: spacing.sm },
  row: { flexDirection: "row", gap: spacing.md },
  field: { flex: 1 },
  inputLabel: { color: colors.muted, fontWeight: "700", marginBottom: 6 },
  select: { minHeight: 48, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.card, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  selectError: { borderColor: "#C62828" },
  selectText: { color: colors.text, flex: 1 },
  selectPlaceholder: { color: colors.muted, flex: 1 },
  chevron: { color: colors.primary, fontSize: 12, marginLeft: spacing.sm },
  fieldError: { color: "#C62828", fontSize: 12, marginTop: 4 },
  selectMenu: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.card, marginTop: 4, overflow: "hidden", zIndex: 10 },
  selectOption: { paddingHorizontal: spacing.md, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  selectOptionActive: { backgroundColor: colors.primary },
  selectOptionText: { color: colors.text },
  selectOptionTextActive: { color: "#FFFFFF", fontWeight: "700" },
  paymentRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  paymentButton: { minWidth: 140, flexGrow: 1 },
  cardPanel: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  cardTitle: { fontWeight: "800", color: colors.text },
  cardBrand: { fontWeight: "700", color: colors.primary, fontSize: 12 },
  securityNote: { color: colors.muted, fontSize: 11, lineHeight: 16 },
  summary: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, borderWidth: 1, borderColor: colors.border },
  summaryTitle: { fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { fontWeight: "800", color: colors.text, fontSize: 15 },
  totalValue: { fontWeight: "800", color: colors.primary, fontSize: 18 },
  submitError: { color: "#C62828", backgroundColor: "#FFEBEE", borderRadius: radius.sm, padding: spacing.sm, marginTop: spacing.md, fontWeight: "600" },
  submit: { marginTop: spacing.xl, marginBottom: spacing.xl },
});
