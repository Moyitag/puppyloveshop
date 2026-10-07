import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getReviewsByProduct, createReview } from "../api/api";
import { addProductToCart } from "../api/cartHelpers";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import { colors, spacing, radius } from "../theme";

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { client, logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [rating, setRating] = useState(5);
  const [adding, setAdding] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variants?.find((variant) => variant.stock > 0)?._id || null
  );

  const totalStock = (product.variants || []).reduce((s, v) => s + (v.stock || 0), 0);
  const hasStock = (product.variants || []).length === 0 || totalStock > 0;
  const selectedVariant = product.variants?.find(
    (variant) => variant._id === selectedVariantId
  );

  useEffect(() => {
    getReviewsByProduct(product._id)
      .then((res) => setReviews(res.data))
      .catch(() => {});
  }, [product._id]);

  const handleAddToCart = async () => {
    if (!client) {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para agregar al carrito.");
      return;
    }
    setCartFeedback(null);
    setAdding(true);
    try {
      if (product.variants?.length > 0 && !selectedVariantId) {
        Alert.alert("Elige una opción", "Selecciona una variante disponible.");
        return;
      }
      await addProductToCart(product._id, selectedVariantId, 1);
      setCartFeedback({ type: "success", text: "Producto agregado al carrito." });
      navigation.getParent()?.navigate("Carrito");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "No se pudo agregar al carrito.";
      setCartFeedback({ type: "error", text: message });
      if (status === 401 || status === 403) {
        await logout();
        Alert.alert("Sesión vencida", "Inicia sesión nuevamente para agregar productos.");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!client) {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para dejar una reseña.");
      return;
    }
    if (!title.trim() || !details.trim()) {
      Alert.alert("Completa la reseña", "Escribe un título y el detalle de tu experiencia.");
      return;
    }
    try {
      await createReview({
        userId: client.id,
        productId: product._id,
        rating,
        title,
        experienceType: "Compra",
        details,
        certifiedPurchase: false,
      });
      setReviews((prev) => [
        { _id: Date.now().toString(), rating, title, details, userId: { fullName: client.fullName } },
        ...prev,
      ]);
      setTitle("");
      setDetails("");
      setRating(5);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "No se pudo enviar la reseña.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.images?.[0] || "https://via.placeholder.com/400" }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.name}>{product.productName}</Text>
        <Text style={styles.price}>${Number(product.price).toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.stock}>{hasStock ? "Disponible" : "Agotado"}</Text>

        {product.variants?.length > 0 && (
          <View style={styles.variantsSection}>
            <Text style={styles.variantLabel}>Elige una opción</Text>
            <View style={styles.variantRow}>
              {product.variants.map((variant) => {
                const selected = variant._id === selectedVariantId;
                const disabled = variant.stock < 1;
                const label = [variant.size, variant.color].filter(Boolean).join(" · ") || "Estándar";
                return (
                  <TouchableOpacity
                    key={variant._id}
                    disabled={disabled}
                    onPress={() => setSelectedVariantId(variant._id)}
                    style={[
                      styles.variantChip,
                      selected && styles.variantChipSelected,
                      disabled && styles.variantChipDisabled,
                    ]}
                  >
                    <Text style={[styles.variantText, selected && styles.variantTextSelected]}>
                      {label} ({variant.stock})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {selectedVariant && (
              <Text style={styles.selectedStock}>{selectedVariant.stock} unidades disponibles</Text>
            )}
          </View>
        )}

        <View style={{ marginTop: spacing.md }}>
          <AppButton
            label={hasStock ? "Agregar al carrito" : "Agotado"}
            onPress={handleAddToCart}
            loading={adding}
            disabled={!hasStock}
          />
          {cartFeedback && (
            <Text style={cartFeedback.type === "success" ? styles.cartSuccess : styles.cartError}>
              {cartFeedback.text}
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Reseñas</Text>

        <View style={styles.reviewForm}>
          <AppTextInput
            placeholder="Título de tu reseña"
            value={title}
            onChangeText={setTitle}
          />
          <AppTextInput
            placeholder="Cuéntanos tu experiencia..."
            value={details}
            onChangeText={setDetails}
            multiline
            style={{ minHeight: 50 }}
          />
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)}>
                <Text style={[styles.star, n <= rating && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
            <View style={{ marginLeft: "auto" }}>
              <AppButton label="Enviar" onPress={handleSubmitReview} />
            </View>
          </View>
        </View>

        {reviews.length === 0 && (
          <Text style={styles.empty}>Aún no hay reseñas para este producto.</Text>
        )}
        {reviews.map((r) => (
          <View key={r._id} style={styles.reviewCard}>
            <Text style={styles.reviewRating}>{"★".repeat(r.rating)}</Text>
            <Text style={styles.reviewTitle}>{r.title}</Text>
            <Text style={styles.reviewComment}>{r.details}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  image: { width: "100%", height: 260, backgroundColor: colors.border },
  body: { padding: spacing.md },
  name: { fontSize: 22, fontWeight: "800", color: colors.text },
  price: { fontSize: 20, fontWeight: "700", color: colors.primary, marginTop: 4 },
  description: { fontSize: 14, color: colors.muted, marginTop: spacing.sm, lineHeight: 20 },
  stock: { fontSize: 13, color: colors.secondary, marginTop: spacing.sm, fontWeight: "600" },
  variantsSection: { marginTop: spacing.md },
  variantLabel: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: spacing.xs },
  variantRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  variantChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
  },
  variantChipSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  variantChipDisabled: { opacity: 0.4 },
  variantText: { color: colors.text, fontSize: 12, fontWeight: "600" },
  variantTextSelected: { color: "#fff" },
  selectedStock: { marginTop: spacing.xs, color: colors.muted, fontSize: 12 },
  cartSuccess: { color: colors.success, textAlign: "center", marginTop: spacing.sm, fontWeight: "600" },
  cartError: { color: colors.danger, textAlign: "center", marginTop: spacing.sm, fontWeight: "600" },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  buttonDisabled: { backgroundColor: colors.muted },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  reviewForm: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  reviewInput: { minHeight: 40, color: colors.text, fontSize: 14 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.sm },
  star: { fontSize: 22, color: colors.border, marginRight: 2 },
  starActive: { color: "#F5B942" },
  sendButton: {
    marginLeft: "auto",
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  sendButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewRating: { color: "#F5B942", fontSize: 14 },
  reviewTitle: { color: colors.text, fontWeight: "700", fontSize: 13, marginTop: 2 },
  reviewComment: { color: colors.text, fontSize: 13, marginTop: 2 },
  empty: { color: colors.muted, fontSize: 13, fontStyle: "italic" },
});
