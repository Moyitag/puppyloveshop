import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing, radius } from "../theme";

// Botón reutilizable de toda la app. variant: "primary" | "outline" | "danger"
export default function AppButton({ label, onPress, loading, disabled, variant = "primary" }) {
  const isOutline = variant === "outline";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isOutline && styles.outline,
        isDanger && styles.danger,
        !isOutline && !isDanger && styles.primary,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : "#fff"} />
      ) : (
        <Text
          style={[
            styles.label,
            isOutline && styles.labelOutline,
            isDanger && styles.labelDanger,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.primary },
  danger: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.danger },
  disabled: { opacity: 0.6 },
  label: { color: "#fff", fontWeight: "700", fontSize: 16 },
  labelOutline: { color: colors.primary },
  labelDanger: { color: colors.danger },
});
