import React, { useState } from "react";
import { Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { colors, spacing } from "../theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{8,}$/;

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phoneNumber: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "El nombre es obligatorio.";
    if (!form.email.trim()) e.email = "El correo es obligatorio.";
    else if (!EMAIL_REGEX.test(form.email.trim())) e.email = "Correo inválido.";
    if (!form.password) e.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres.";
    if (!form.phoneNumber.trim()) e.phoneNumber = "El teléfono es obligatorio.";
    else if (!PHONE_REGEX.test(form.phoneNumber.trim())) e.phoneNumber = "Solo números, mínimo 8 dígitos.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ ...form, email: form.email.trim().toLowerCase() });
      Alert.alert("¡Listo!", "Cuenta creada. Ahora inicia sesión.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      Alert.alert("Error al registrar", err.response?.data?.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <AppTextInput
        placeholder="Nombre completo"
        value={form.fullName}
        onChangeText={(v) => setField("fullName", v)}
        error={errors.fullName}
      />
      <AppTextInput
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(v) => setField("email", v)}
        error={errors.email}
      />
      <AppTextInput
        placeholder="Contraseña"
        secureTextEntry
        value={form.password}
        onChangeText={(v) => setField("password", v)}
        error={errors.password}
      />
      <AppTextInput
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={form.phoneNumber}
        onChangeText={(v) => setField("phoneNumber", v)}
        error={errors.phoneNumber}
      />

      <AppButton label="Registrarme" onPress={handleRegister} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: spacing.lg },
  link: { color: colors.secondary, textAlign: "center", marginTop: spacing.lg, fontWeight: "600" },
});
