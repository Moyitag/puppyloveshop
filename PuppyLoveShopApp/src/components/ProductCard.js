import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../theme";

// Producto real: { productName, images[], price, variants: [{ size, color, stock }] }
export default function ProductCard({ product, onPress }) {
  const totalStock = (product.variants || []).reduce((s, v) => s + (v.stock || 0), 0);
  const hasStock = (product.variants || []).length === 0 || totalStock > 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: product.images?.[0] || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.productName}
        </Text>
        <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
        {!hasStock && <Text style={styles.outOfStock}>Agotado</Text>}
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
