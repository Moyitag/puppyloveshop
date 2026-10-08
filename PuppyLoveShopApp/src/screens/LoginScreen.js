import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation, route }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  // Cuando se viene del registro: se escribe el correo y se muestra el aviso de éxito
  const registeredEmail = route?.params?.registeredEmail;
  useEffect(() => {
    if (registeredEmail) {
      setEmail(registeredEmail);
      setPassword("");
      setErrors({});
      setNotice("¡Cuenta creada con éxito! Ingresa tu contraseña para iniciar sesión.");
    }
  }, [registeredEmail]);

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "El correo es obligatorio.";
    else if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = "Correo inválido.";
    if (!password) nextErrors.password = "La contraseña es obligatoria.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      Alert.alert(
        "Error al iniciar sesión",
        err.response?.data?.message || "Credenciales inválidas."
      );
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    setNotice("");
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image source={require("../../assets/icon.png")} style={styles.logo} />
      <Text style={styles.title}>Puppy Love Shop</Text>
      <Text style={styles.subtitle}>Todo para tu mejor amigo</Text>

      {notice ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{notice}</Text>
        </View>
      ) : null}

      <AppTextInput
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />
      <AppTextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        error={errors.password}
      />

      <AppButton label="Iniciar sesión" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={goToRegister}>
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
  successBanner: {
    backgroundColor: "#E8F7EF",
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  successText: { color: "#1E7A4C", fontSize: 13, fontWeight: "600", textAlign: "center" },
  link: { color: colors.secondary, textAlign: "center", marginTop: spacing.lg, fontWeight: "600" },
});
