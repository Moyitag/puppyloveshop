import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { colors, spacing, radius } from "../theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{8,15}$/;

const INITIAL_FORM = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
};

// Quita espacios y guiones: "7890-1234" -> "78901234"
const cleanPhone = (value) => value.replace(/[\s-]/g, "");

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs para saltar al siguiente campo con la tecla "Siguiente" del teclado
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const phoneRef = useRef(null);

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Al escribir se limpia el error de ese campo
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const e = {};
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = cleanPhone(form.phoneNumber);

    if (!fullName) e.fullName = "El nombre completo es obligatorio.";
    else if (fullName.length < 3) e.fullName = "Debe tener al menos 3 caracteres.";

    if (!email) e.email = "El correo electrónico es obligatorio.";
    else if (!EMAIL_REGEX.test(email)) e.email = "Ingresa un correo válido.";

    if (!form.password) e.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres.";

    if (!form.confirmPassword) e.confirmPassword = "Confirma tu contraseña.";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Las contraseñas no coinciden.";

    if (!phone) e.phoneNumber = "El teléfono es obligatorio.";
    else if (!PHONE_REGEX.test(phone)) e.phoneNumber = "Solo números, mínimo 8 dígitos.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    setServerError("");
    if (!validate()) return;

    const email = form.email.trim().toLowerCase();
    setLoading(true);
    try {
      // Backend: POST /api/registerClient { fullName, email, password, phoneNumber }
      await register({
        fullName: form.fullName.trim(),
        email,
        password: form.password,
        phoneNumber: cleanPhone(form.phoneNumber),
      });
      setForm(INITIAL_FORM);
      // Regresa al Login (sin apilar otra pantalla) con el correo ya escrito
      navigation.popTo("Login", { registeredEmail: email });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (msg === "Email already registered") {
        setErrors((e) => ({ ...e, email: "Este correo ya está registrado." }));
      } else if (status === 429) {
        setServerError("Demasiados intentos. Espera unos minutos e inténtalo de nuevo.");
      } else if (!err.response) {
        setServerError(
          "No se pudo conectar con el servidor. Revisa que el backend esté encendido y la IP en src/api/api.js."
        );
      } else {
        setServerError(msg || "No se pudo crear la cuenta. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={styles.title}>Puppy Love Shop</Text>
        <Text style={styles.subtitle}>Crea tu cuenta y cuida a tu mejor amigo</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Crear cuenta</Text>

          {serverError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{serverError}</Text>
            </View>
          ) : null}

          <AppTextInput
            label="Nombre completo"
            placeholder="Ej: María García"
            value={form.fullName}
            onChangeText={(v) => setField("fullName", v)}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            error={errors.fullName}
          />
          <AppTextInput
            ref={emailRef}
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChangeText={(v) => setField("email", v)}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={errors.email}
          />
          <AppTextInput
            ref={passwordRef}
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChangeText={(v) => setField("password", v)}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => confirmRef.current?.focus()}
            error={errors.password}
          />
          <AppTextInput
            ref={confirmRef}
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            value={form.confirmPassword}
            onChangeText={(v) => setField("confirmPassword", v)}
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            error={errors.confirmPassword}
          />
          <AppTextInput
            ref={phoneRef}
            label="Teléfono"
            placeholder="Ej: 78901234"
            value={form.phoneNumber}
            onChangeText={(v) => setField("phoneNumber", v)}
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={15}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            error={errors.phoneNumber}
          />

          <AppButton label="Crear cuenta" onPress={handleRegister} loading={loading} />
        </View>

        <TouchableOpacity
          onPress={() => navigation.popTo("Login")}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>¿Ya tienes cuenta? </Text>
          <Text style={[styles.linkText, styles.linkBold]}>Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: spacing.sm,
    borderRadius: radius.full,
  },
  title: { fontSize: 24, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: spacing.md },
  errorBanner: {
    backgroundColor: "#FDECEA",
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  errorBannerText: { color: colors.danger, fontSize: 13, fontWeight: "600" },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  linkText: { color: colors.muted, fontSize: 14, fontWeight: "500" },
  linkBold: { color: colors.secondary, fontWeight: "700" },
});
