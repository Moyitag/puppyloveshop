import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radius } from "../theme";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Ingresa tu correo y contraseña.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert(
        "Error al iniciar sesión",
        err.response?.data?.message || "Credenciales inválidas."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={{ uri: "https://via.placeholder.com/120x120.png?text=🐾" }}
        style={styles.logo}
      />
      <Text style={styles.title}>Puppy Love Shop</Text>
      <Text style={styles.subtitle}>Todo para tu mejor amigo</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Ingresando..." : "Iniciar sesión"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  logo: { width: 90, height: 90, alignSelf: "center", marginBottom: spacing.md, borderRadius: radius.full },
  title: { fontSize: 26, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: { fontSize: 14, color: colors.muted, textAlign: "center", marginBottom: spacing.xl },
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
