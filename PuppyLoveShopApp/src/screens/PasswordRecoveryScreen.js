import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { requestPasswordReset, resetPassword } from "../api/api";
import { colors, spacing, radius } from "../theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PasswordRecoveryScreen({ navigation, route }) {
  const [email, setEmail] = useState(route.params?.email || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const sendCode = async () => {
    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Ingresa un correo válido.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email.trim().toLowerCase());
      setStep("code");
      setNotice("Si ese correo tiene una cuenta, recibirás un código. Revisa también la carpeta de spam.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No pudimos enviar el código. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!/^\d{6}$/.test(code.trim())) return setError("Escribe el código de 6 dígitos.");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (password !== confirmation) return setError("Las contraseñas no coinciden.");

    setError("");
    setLoading(true);
    try {
      await resetPassword({ email: email.trim().toLowerCase(), code: code.trim(), password });
      setPassword("");
      setConfirmation("");
      setStep("done");
    } catch (resetError) {
      setError(resetError.response?.data?.message || "No pudimos cambiar la contraseña. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => navigation.navigate("Login")} style={styles.back}>
            <Text style={styles.backText}>‹  Volver a iniciar sesión</Text>
          </Pressable>

          <View style={styles.card}>
            <View style={styles.badge}><Text style={styles.badgeText}>{step === "done" ? "✓" : "✉"}</Text></View>
            <Text style={styles.eyebrow}>PUPPY LOVE SHOP</Text>
            <Text style={styles.title}>{step === "email" ? "Recupera tu cuenta" : step === "code" ? "Revisa tu correo" : "Contraseña actualizada"}</Text>
            <Text style={styles.description}>
              {step === "email" ? "Te enviaremos un código para que puedas crear una nueva contraseña." :
                step === "code" ? `Escribe el código enviado a ${email.trim()} y elige una nueva contraseña.` :
                  "Ya puedes entrar con tu nueva contraseña."}
            </Text>

            {step === "email" ? (
              <>
                <AppTextInput label="Correo electrónico" placeholder="tu@correo.com" autoCapitalize="none" autoComplete="email" keyboardType="email-address" textContentType="emailAddress" value={email} onChangeText={(value) => { setEmail(value); setError(""); }} />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <AppButton label="Enviar código" onPress={sendCode} loading={loading} />
              </>
            ) : step === "code" ? (
              <>
                {notice ? <Text style={styles.notice}>{notice}</Text> : null}
                <AppTextInput label="Código de 6 dígitos" placeholder="000000" keyboardType="number-pad" maxLength={6} value={code} onChangeText={(value) => { setCode(value.replace(/\D/g, "")); setError(""); }} />
                <AppTextInput label="Nueva contraseña" placeholder="Mínimo 8 caracteres" secureTextEntry autoComplete="new-password" value={password} onChangeText={(value) => { setPassword(value); setError(""); }} />
                <AppTextInput label="Confirmar contraseña" placeholder="Repite tu contraseña" secureTextEntry autoComplete="new-password" value={confirmation} onChangeText={(value) => { setConfirmation(value); setError(""); }} />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <AppButton label="Guardar contraseña" onPress={changePassword} loading={loading} />
                <Pressable onPress={sendCode} disabled={loading} style={styles.secondaryAction}>
                  <Text style={styles.secondaryText}>Enviar un código nuevo</Text>
                </Pressable>
                <Pressable onPress={() => { setStep("email"); setNotice(""); setError(""); }} style={styles.secondaryAction}>
                  <Text style={styles.secondaryText}>Usar otro correo</Text>
                </Pressable>
              </>
            ) : (
              <AppButton label="Ir a iniciar sesión" onPress={() => navigation.navigate("Login")} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.pinkSoft },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  back: { alignSelf: "flex-start", paddingVertical: spacing.md, marginBottom: spacing.md },
  backText: { color: colors.primaryDark, fontSize: 14, fontWeight: "700" },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, shadowColor: colors.primaryDark, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 3 },
  badge: { width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  badgeText: { color: colors.primaryDark, fontSize: 29, fontWeight: "700" },
  eyebrow: { color: colors.secondary, fontWeight: "800", fontSize: 11, letterSpacing: 1.6, marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: 27, fontWeight: "800", letterSpacing: -0.5 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: spacing.xs, marginBottom: spacing.lg },
  notice: { color: colors.secondary, backgroundColor: colors.blueSoft, borderRadius: radius.sm, padding: spacing.md, fontSize: 13, lineHeight: 19, marginBottom: spacing.md },
  error: { color: colors.danger, fontSize: 13, lineHeight: 19, marginBottom: spacing.md },
  secondaryAction: { padding: spacing.sm, alignItems: "center", marginTop: spacing.sm },
  secondaryText: { color: colors.secondary, fontSize: 13, fontWeight: "700" },
});
