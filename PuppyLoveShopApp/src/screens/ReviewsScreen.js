import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from "react-native";
import { getAllReviews, getProducts, createReview, updateReview, deleteReview } from "../api/api";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";
import AppButton from "../components/AppButton";
import AppTextInput from "../components/AppTextInput";
import BottomSheet from "../components/BottomSheet";
import { colors, spacing, radius, shadow } from "../theme";

// Mismos tipos de experiencia que la versión web (ResenasPage)
const EXPERIENCES = ["Compra en línea", "Servicio en tienda", "Entrega a domicilio", "Atención al cliente"];
const FILTERS = ["Todas", "Mis reseñas"];
const STAR_COLOR = "#F5B942";
const AVATAR_COLORS = [colors.primary, colors.secondary, "#F5B942", colors.success, colors.primaryDark];

const EMPTY_FORM = { productId: "", rating: 0, experienceType: "", title: "", details: "" };

// CRUD de reseñas: listar todas, filtrar las mías, crear, editar y eliminar.
export default function ReviewsScreen({ navigation }) {
  const { client, logout } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Formulario (crear / editar)
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null); // reseña en edición o null si es nueva
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const loadData = useCallback(async () => {
    try {
      setError("");
      const [reviewsRes, productsRes] = await Promise.all([getAllReviews(), getProducts()]);
      const active = reviewsRes.data.filter((r) => r.active !== false);
      active.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setReviews(active);
      setProducts(productsRes.data);
    } catch (err) {
      setError("No pudimos cargar las reseñas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isMine = (r) => client && (r.userId?._id || r.userId) === client.id;

  const filtered = useMemo(
    () => (filter === "Mis reseñas" ? reviews.filter(isMine) : reviews),
    [reviews, filter, client]
  );

  const average = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0;

  const handleAuthError = async (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || "";
    // 403 también puede ser "no es tu reseña"; solo cerramos sesión si falta la cookie
    if (status === 401 || (status === 403 && message.includes("cookie"))) {
      await logout();
      Alert.alert("Sesión vencida", "Inicia sesión nuevamente.");
      return true;
    }
    return false;
  };

  const openCreate = () => {
    if (!client) {
      Alert.alert("Inicia sesión", "Debes iniciar sesión para escribir una reseña.");
      return;
    }
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSheetOpen(true);
  };

  const openEdit = (review) => {
    setEditing(review);
    setForm({
      productId: review.productId?._id || review.productId || "",
      rating: review.rating,
      experienceType: review.experienceType || "",
      title: review.title || "",
      details: review.details || "",
    });
    setFormErrors({});
    setSheetOpen(true);
  };

  const closeSheet = () => setSheetOpen(false);

  const validate = () => {
    const e = {};
    if (!editing && !form.productId) e.productId = "Selecciona un producto.";
    if (form.rating < 1) e.rating = "Elige una calificación.";
    if (!form.experienceType) e.experienceType = "Elige el tipo de experiencia.";
    if (form.title.trim().length < 3) e.title = "El título debe tener al menos 3 caracteres.";
    if (form.details.trim().length < 10) e.details = "Cuéntanos un poco más (mínimo 10 caracteres).";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const payload = {
      rating: form.rating,
      experienceType: form.experienceType,
      title: form.title.trim(),
      details: form.details.trim(),
    };
    try {
      if (editing) {
        await updateReview(editing._id, payload);
      } else {
        await createReview({
          ...payload,
          userId: client.id,
          productId: form.productId,
          certifiedPurchase: false,
        });
      }
      closeSheet();
      Alert.alert("¡Listo!", editing ? "Tu reseña fue actualizada." : "Gracias por compartir tu experiencia 🐾");
      loadData();
    } catch (err) {
      if (await handleAuthError(err)) return;
      Alert.alert("Error", err.response?.data?.message || "No se pudo guardar la reseña.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (review) => {
    const message = `¿Seguro que quieres eliminar "${review.title}"?`;
    const confirmDelete = async () => {
      try {
        await deleteReview(review._id);
        setReviews((prev) => prev.filter((r) => r._id !== review._id));
      } catch (err) {
        if (await handleAuthError(err)) return;
        Alert.alert("Error", err.response?.data?.message || "No se pudo eliminar la reseña.");
      }
    };
    // En web Alert.alert no muestra botones, usamos el confirm del navegador
    if (Platform.OS === "web") {
      if (window.confirm(message)) confirmDelete();
      return;
    }
    Alert.alert("Eliminar reseña", message, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: confirmDelete },
    ]);
  };

  const selectedProduct = products.find((p) => p._id === form.productId);

  return (
    <View style={styles.container}>
      <AppHeader active="Reseñas" />

      <FlatList
        data={filtered}
        keyExtractor={(r) => r._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.breadcrumb}>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Text style={{ color: colors.primary, fontSize: 12 }}>Inicio</Text>
              </TouchableOpacity>
              <Text style={styles.muted}> › Reseñas</Text>
            </View>

            {/* Resumen */}
            <View style={styles.summary}>
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryTitle}>Lo que dicen nuestros clientes</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryAvg}>{average.toFixed(1)}</Text>
                  <Stars value={Math.round(average)} size={16} />
                  <Text style={styles.summaryCount}>({reviews.length})</Text>
                </View>
              </View>
              <Text style={{ fontSize: 34 }}>🐶</Text>
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <AppButton label="✍️  Escribir reseña" onPress={openCreate} />
            </View>

            <View style={styles.chipsRow}>
              {FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <TouchableOpacity
                    key={f}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setFilter(f)}
                  >
                    <Text style={[styles.chipText, active && { color: "#fff" }]}>{f}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
          ) : error ? (
            <View style={{ alignItems: "center", marginTop: spacing.xl }}>
              <Text style={styles.muted}>{error}</Text>
              <TouchableOpacity onPress={() => { setLoading(true); loadData(); }}>
                <Text style={styles.retry}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.muted, { textAlign: "center", marginTop: spacing.xl }]}>
              {filter === "Mis reseñas" ? "Aún no has escrito reseñas." : "Aún no hay reseñas."}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            mine={isMine(item)}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      {/* Crear / editar */}
      <BottomSheet
        visible={sheetOpen}
        onClose={closeSheet}
        title={editing ? "Editar reseña" : "Escribir reseña"}
      >
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Producto</Text>
          {editing ? (
            <Text style={styles.productFixed}>
              🐾 {editing.productId?.productName || selectedProduct?.productName || "Producto"}
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: formErrors.productId ? 0 : spacing.md }}
            >
              {products.map((p) => {
                const active = form.productId === p._id;
                return (
                  <TouchableOpacity
                    key={p._id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => set("productId", p._id)}
                  >
                    <Text style={[styles.chipText, active && { color: "#fff" }]} numberOfLines={1}>
                      {p.productName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
          {formErrors.productId ? <Text style={styles.error}>{formErrors.productId}</Text> : null}

          <Text style={styles.label}>Calificación</Text>
          <Stars value={form.rating} size={30} onChange={(n) => set("rating", n)} />
          {formErrors.rating ? <Text style={styles.error}>{formErrors.rating}</Text> : null}

          <Text style={[styles.label, { marginTop: spacing.md }]}>Tipo de experiencia</Text>
          <View style={styles.wrapRow}>
            {EXPERIENCES.map((e) => {
              const active = form.experienceType === e;
              return (
                <TouchableOpacity
                  key={e}
                  style={[styles.chip, styles.chipWrap, active && styles.chipActive]}
                  onPress={() => set("experienceType", e)}
                >
                  <Text style={[styles.chipText, active && { color: "#fff" }]}>{e}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {formErrors.experienceType ? <Text style={styles.error}>{formErrors.experienceType}</Text> : null}

          <View style={{ height: spacing.md }} />
          <AppTextInput
            label="Título"
            placeholder="Ej. ¡Mi perro la adora!"
            value={form.title}
            onChangeText={(v) => set("title", v)}
            error={formErrors.title}
            maxLength={80}
          />
          <AppTextInput
            label="Tu experiencia"
            placeholder="Cuéntanos qué te pareció..."
            value={form.details}
            onChangeText={(v) => set("details", v)}
            error={formErrors.details}
            multiline
            maxLength={500}
            style={{ minHeight: 90, textAlignVertical: "top" }}
          />

          <AppButton label={editing ? "Guardar cambios" : "Publicar reseña"} onPress={handleSave} loading={saving} />
          <View style={{ height: spacing.sm }} />
          <AppButton label="Cancelar" variant="outline" onPress={closeSheet} />
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

function Stars({ value, size = 14, onChange }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <Text style={{ fontSize: size, color: n <= value ? STAR_COLOR : colors.border, marginRight: 2 }}>★</Text>
        );
        return onChange ? (
          <TouchableOpacity key={n} onPress={() => onChange(n)}>{star}</TouchableOpacity>
        ) : (
          <View key={n}>{star}</View>
        );
      })}
    </View>
  );
}

function ReviewCard({ review, mine, onEdit, onDelete }) {
  const name = review.userId?.fullName || "Anónimo";
  const product = review.productId?.productName;
  const avatarColor = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString("es") : "";

  return (
    <View style={[styles.card, mine && styles.cardMine]}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: `${avatarColor}22`, borderColor: `${avatarColor}66` }]}>
          <Text style={[styles.avatarText, { color: avatarColor }]}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName}>
            {name}
            {mine ? <Text style={styles.mineTag}>  · Tú</Text> : null}
          </Text>
          <Stars value={review.rating} />
        </View>
        {date ? <Text style={styles.date}>{date}</Text> : null}
      </View>

      <View style={styles.badgeRow}>
        {product ? <Text style={styles.productBadge}>🐾 {product}</Text> : null}
        {review.experienceType ? <Text style={styles.expBadge}>{review.experienceType}</Text> : null}
      </View>

      <Text style={styles.cardTitle}>{review.title}</Text>
      <Text style={styles.cardDetails}>"{review.details}"</Text>

      {mine && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
            <Text style={styles.actionEdit}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.danger }]} onPress={onDelete}>
            <Text style={styles.actionDelete}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  breadcrumb: { flexDirection: "row", marginBottom: spacing.md },
  muted: { color: colors.muted, fontSize: 12 },
  retry: { color: colors.primary, fontWeight: "700", marginTop: spacing.sm },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.pinkSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  summaryRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.xs },
  summaryAvg: { fontSize: 22, fontWeight: "800", color: colors.primary, marginRight: spacing.sm },
  summaryCount: { color: colors.muted, fontSize: 12, marginLeft: spacing.xs },
  chipsRow: { flexDirection: "row", marginBottom: spacing.md },
  wrapRow: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: "#fff",
    maxWidth: 200,
  },
  chipWrap: { marginBottom: spacing.sm },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text, fontWeight: "600" },
  label: { fontSize: 13, fontWeight: "700", color: colors.muted, marginBottom: spacing.xs },
  error: { color: colors.danger, fontSize: 12, marginTop: spacing.xs, marginBottom: spacing.sm },
  productFixed: { fontSize: 14, color: colors.text, fontWeight: "600", marginBottom: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.pinkSoft,
    ...shadow,
  },
  cardMine: { borderColor: colors.primary },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  avatarText: { fontSize: 18, fontWeight: "800" },
  cardName: { fontSize: 14, fontWeight: "700", color: colors.text },
  mineTag: { color: colors.primary, fontSize: 12 },
  date: { color: colors.muted, fontSize: 11 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.xs },
  productBadge: {
    backgroundColor: colors.pinkSoft,
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: "600",
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    overflow: "hidden",
  },
  expBadge: {
    backgroundColor: colors.blueSoft,
    color: colors.secondary,
    fontSize: 11,
    fontWeight: "600",
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: spacing.xs,
    overflow: "hidden",
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: colors.text, marginTop: spacing.xs },
  cardDetails: { fontSize: 13, color: colors.muted, lineHeight: 19, marginTop: 2 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    marginLeft: spacing.sm,
  },
  actionEdit: { color: colors.primary, fontWeight: "700", fontSize: 12 },
  actionDelete: { color: colors.danger, fontWeight: "700", fontSize: 12 },
});
