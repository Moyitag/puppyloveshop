import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const nextErrors = {};
    if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = "Ingresa un correo válido.";
    if (!password) nextErrors.password = "Ingresa tu contraseña.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (error) {
      setErrors({ form: error.response?.status === 401 || error.response?.status === 404
        ? "El correo o la contraseña no coinciden."
        : "No pudimos iniciar sesión. Revisa tu conexión e intenta de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.brand}>
            <Image source={require("../../assets/icon.png")} style={styles.logo} />
            <Text style={styles.brandName}>Puppy Love Shop</Text>
            <Text style={styles.brandTagline}>Todo para tu mejor amigo</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.eyebrow}>BIENVENIDO DE NUEVO</Text>
            <Text style={styles.title}>Qué gusto verte</Text>
            <Text style={styles.description}>Inicia sesión para seguir cuidando a quien más quieres.</Text>

            <AppTextInput
              label="Correo electrónico"
              placeholder="tu@correo.com"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(value) => { setEmail(value); setErrors((current) => ({ ...current, email: undefined, form: undefined })); }}
              error={errors.email}
            />

            <View style={styles.passwordHeading}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              <Pressable onPress={() => navigation.navigate("PasswordRecovery", { email: email.trim() })} hitSlop={8}>
                <Text style={styles.forgotLink}>¿La olvidaste?</Text>
              </Pressable>
            </View>
            <View style={styles.passwordField}>
              <AppTextInput
                placeholder="Tu contraseña"
                secureTextEntry={!showPassword}
                autoComplete="current-password"
                textContentType="password"
                value={password}
                onChangeText={(value) => { setPassword(value); setErrors((current) => ({ ...current, password: undefined, form: undefined })); }}
                error={errors.password}
                style={styles.passwordInput}
              />
              <Pressable style={styles.showButton} onPress={() => setShowPassword((value) => !value)} accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                <Text style={styles.showText}>{showPassword ? "Ocultar" : "Ver"}</Text>
              </Pressable>
            </View>

            {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}
            <AppButton label="Iniciar sesión" onPress={handleLogin} loading={loading} />
          </View>

          <Pressable style={styles.registerRow} onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerText}>¿Aún no tienes cuenta? </Text>
            <Text style={styles.registerLink}>Regístrate</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.pinkSoft },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  brand: { alignItems: "center", marginBottom: spacing.xl },
  logo: { width: 68, height: 68, borderRadius: radius.lg, marginBottom: spacing.sm },
  brandName: { fontSize: 22, fontWeight: "800", color: colors.primaryDark, letterSpacing: -0.4 },
  brandTagline: { color: colors.muted, fontSize: 13, marginTop: spacing.xs },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, shadowColor: colors.primaryDark, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  eyebrow: { color: colors.secondary, fontWeight: "800", fontSize: 11, letterSpacing: 1.6, marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: 27, fontWeight: "800", letterSpacing: -0.5 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: spacing.xs, marginBottom: spacing.lg },
  passwordHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xs },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: colors.muted },
  forgotLink: { color: colors.secondary, fontSize: 13, fontWeight: "700" },
  passwordField: { position: "relative" },
  passwordInput: { paddingRight: 78 },
  showButton: { position: "absolute", right: spacing.md, top: 13, padding: spacing.xs },
  showText: { color: colors.secondary, fontWeight: "700", fontSize: 13 },
  formError: { color: colors.danger, fontSize: 13, lineHeight: 19, marginBottom: spacing.md },
  registerRow: { flexDirection: "row", justifyContent: "center", paddingVertical: spacing.lg },
  registerText: { color: colors.muted, fontSize: 14 },
  registerLink: { color: colors.primaryDark, fontWeight: "800", fontSize: 14 },
});
