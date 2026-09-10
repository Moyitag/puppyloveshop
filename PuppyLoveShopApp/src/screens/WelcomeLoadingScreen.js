import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { colors, spacing } from "../theme";

// Pantalla de carga adicional (distinta al Splash Screen nativo de Expo).
// Se muestra un par de segundos al abrir la app mientras se revisa la sesión guardada.
export default function WelcomeLoadingScreen() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fade, alignItems: "center" }}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={styles.title}>Puppy Love Shop</Text>
        <Text style={styles.subtitle}>Todo para tu mejor amigo 🐾</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 110, height: 110, borderRadius: 24, marginBottom: spacing.md },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: spacing.xs },
});
