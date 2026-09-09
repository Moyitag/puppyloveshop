import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius } from "../theme";

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  // Campos reales del backend: fullName, email, password, phoneNumber (todos requeridos)
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = async () => {
    const { fullName, email, password, phoneNumber } = form;
    if (!fullName || !email || !password || !phoneNumber) {
      Alert.alert("Campos requeridos", "Nombre, correo, contraseña y teléfono son obligatorios.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      Alert.alert("¡Listo!", "Cuenta creada. Ahora inicia sesión.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      Alert.alert(
        "Error al registrar",
        err.response?.data?.message || "No se pudo crear la cuenta."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "fullName", placeholder: "Nombre completo" },
    { key: "email", placeholder: "Correo electrónico", keyboardType: "email-address" },
    { key: "password", placeholder: "Contraseña", secureTextEntry: true },
    { key: "phoneNumber", placeholder: "Teléfono", keyboardType: "phone-pad" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      {fields.map((f) => (
        <TextInput
          key={f.key}
          style={styles.input}
          placeholder={f.placeholder}
          placeholderTextColor={colors.muted}
          autoCapitalize={f.key === "email" ? "none" : "sentences"}
          secureTextEntry={f.secureTextEntry}
          keyboardType={f.keyboardType || "default"}
          value={form[f.key]}
          onChangeText={(v) => setField(f.key, v)}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creando..." : "Registrarme"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    marginBottom: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  link: { color: colors.secondary, textAlign: "center", marginTop: spacing.lg, fontWeight: "600" },
});
