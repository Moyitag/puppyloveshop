import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useCart } from "../context/CartContext";
import { colors, spacing, radius, shadow } from "../theme";

// Tarjeta del diseño: imagen, nombre, precio y botón "Agregar al carrito".
// offer=true muestra la etiqueta OFERTA. width permite usarla en grillas o carruseles.
export default function ProductCard({ product, onPress, offer = false, width = "48%" }) {
  const { addToCart, addingId } = useCart();
  const totalStock = (product.variants || []).reduce((s, v) => s + (v.stock || 0), 0);
  const hasStock = (product.variants || []).length === 0 || totalStock > 0;
  const adding = addingId === product._id;

  return (
    <TouchableOpacity style={[styles.card, { width }]} onPress={onPress} activeOpacity={0.9}>
      {offer && (
        <View style={styles.tag}>
          <Text style={styles.tagText}>OFERTA</Text>
        </View>
      )}

      <View style={styles.imageWrap}>
        {product.images?.[0] ? (
          <Image source={{ uri: product.images[0] }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={{ fontSize: 40 }}>🐾</Text>
        )}
      </View>

      <Text style={styles.name} numberOfLines={3}>
        {product.productName}
      </Text>
      <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
      {!hasStock && <Text style={styles.out}>Agotado</Text>}

      <TouchableOpacity
        style={[styles.button, (!hasStock || adding) && { opacity: 0.55 }]}
        disabled={!hasStock || adding}
        onPress={async () => {
          const result = await addToCart(product);
          if (result === "needsVariant") onPress?.();
        }}
        activeOpacity={0.85}
      >
        {adding ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Agregar al carrito</Text>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 2,
    marginBottom: spacing.md,
    ...shadow,
  },
  tag: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    backgroundColor: colors.offerTag,
    borderTopLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  tagText: { fontSize: 11, fontWeight: "800", color: "#000" },
  imageWrap: { height: 120, alignItems: "center", justifyContent: "center", marginTop: spacing.md },
  image: { width: "100%", height: "100%" },
  name: { fontSize: 13, fontWeight: "600", color: "#000", marginTop: spacing.sm, minHeight: 50 },
  price: { fontSize: 14, color: colors.primary, marginTop: 2, fontWeight: "600" },
  out: { fontSize: 11, color: colors.danger, fontWeight: "700", marginTop: 2 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm - 2,
    paddingVertical: spacing.sm + 1,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});