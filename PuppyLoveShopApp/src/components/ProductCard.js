import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../theme";

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: product.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
        {product.stock <= 0 && <Text style={styles.outOfStock}>Agotado</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: "hidden",
    width: "48%",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: { width: "100%", height: 130, backgroundColor: colors.border },
  info: { padding: spacing.sm },
  name: { fontSize: 14, fontWeight: "600", color: colors.text },
  price: { fontSize: 15, fontWeight: "700", color: colors.primary, marginTop: 2 },
  outOfStock: { fontSize: 11, color: colors.danger, marginTop: 2, fontWeight: "600" },
});
