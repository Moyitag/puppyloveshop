import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getProducts } from "../api/api";
import AppHeader from "../components/AppHeader";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/staticData";
import { colors, spacing, radius, shadow } from "../theme";

// Interfaz 1 del Figma: categorías, Favoritos Puppy y banner de veterinario a domicilio.
export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError("No pudimos cargar los productos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const favorites = products.slice(0, 3); // igual que la versión web

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl }}
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
      >
        <Text style={styles.breadcrumb}>Inicio</Text>
        <Text style={styles.heading}>Descubre nuestros productos entrando a estas categorías</Text>

        {/* Categorías 2x2 */}
        <View style={styles.categories}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.pet}
              style={styles.categoryItem}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Category", { pet: c.pet, query: "" })}
            >
              <View style={[styles.categoryTile, { backgroundColor: c.bg, borderColor: c.border }]}>
                <Image source={c.image} style={styles.categoryImage} resizeMode="contain" />
              </View>
              <Text style={styles.categoryLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Favoritos */}
        <Text style={styles.sectionTitle}>Favoritos Puppy</Text>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.muted}>{error}</Text>
            <TouchableOpacity onPress={() => { setLoading(true); loadData(); }}>
              <Text style={styles.retry}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : favorites.length === 0 ? (
          <Text style={[styles.muted, { textAlign: "center", marginVertical: spacing.lg }]}>
            No hay productos disponibles.
          </Text>
        ) : (
          <FlatList
            horizontal
            data={favorites}
            keyExtractor={(p) => p._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}
            ItemSeparatorComponent={() => <View style={{ width: spacing.sm + 2 }} />}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                width={160}
                onPress={() => navigation.navigate("ProductDetail", { product: item })}
              />
            )}
          />
        )}

        {/* Banner veterinario a domicilio */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerBrand}>PUPPY LOVE SHOP</Text>
            <Text style={styles.bannerTitle}>
              Si tu mascota no va al veterinario, el veterinario visita tu mascota
            </Text>
            <Text style={styles.bannerText}>
              Si llega a pasar algo, descubre aquí los planes que tenemos para cuidarlo
            </Text>
            <TouchableOpacity style={styles.bannerBtn} onPress={() => navigation.navigate("Services")}>
              <Text style={styles.bannerBtnText}>Ver planes</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bannerEmoji}>🏠{"\n"}💉</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  breadcrumb: { color: colors.muted, fontSize: 12, paddingHorizontal: spacing.md, marginTop: spacing.md },
  heading: { fontSize: 15, color: "#000", paddingHorizontal: spacing.md, marginTop: spacing.sm },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  categoryItem: { width: "46%", alignItems: "center", marginBottom: spacing.md },
  categoryTile: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryImage: { width: "80%", height: "80%" },
  categoryLabel: { marginTop: spacing.sm, fontSize: 14, fontWeight: "600", color: "#000" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  muted: { color: colors.muted },
  errorBox: { alignItems: "center", marginVertical: spacing.lg },
  retry: { color: colors.primary, fontWeight: "700", marginTop: spacing.sm },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8D9E0",
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    ...shadow,
  },
  bannerBrand: { fontSize: 11, fontWeight: "800", color: "#000" },
  bannerTitle: { fontSize: 15, fontWeight: "800", color: "#000", marginTop: 4 },
  bannerText: { fontSize: 11, color: "#333", marginTop: 6 },
  bannerBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#4A2C8F",
    borderRadius: radius.sm - 2,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginTop: spacing.sm + 2,
  },
  bannerBtnText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  bannerEmoji: { fontSize: 38, textAlign: "center", marginLeft: spacing.sm },
});