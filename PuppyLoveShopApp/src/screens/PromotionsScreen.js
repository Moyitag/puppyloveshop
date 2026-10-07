import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { getProducts } from "../api/api";
import AppHeader from "../components/AppHeader";
import ProductCard from "../components/ProductCard";
import { PETS, matchesPet } from "../utils/petFilter";
import { colors, spacing, radius } from "../theme";

// Interfaz 3 del Figma: productos en oferta. (En la versión web todas las promociones
// salen de /products; el modelo aún no tiene un campo de descuento.)
export default function PromotionsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError("No pudimos cargar las promociones.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => products.filter((p) => matchesPet(p, pet)), [products, pet]);

  return (
    <View style={styles.container}>
      <AppHeader active="Promociones" />

      <FlatList
        data={filtered}
        keyExtractor={(p) => p._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.grid}
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
              <Text style={styles.muted}> › Promociones</Text>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[null, ...PETS]}
              keyExtractor={(i) => i || "todos"}
              style={{ marginBottom: spacing.md, flexGrow: 0 }}
              renderItem={({ item }) => {
                const active = pet === item;
                return (
                  <TouchableOpacity
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setPet(item)}
                  >
                    <Text style={[styles.chipText, active && { color: "#fff" }]}>{item || "Todos"}</Text>
                  </TouchableOpacity>
                );
              }}
            />
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
              No hay promociones disponibles.
            </Text>
          )
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            offer
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  grid: { padding: spacing.md, paddingBottom: spacing.xl },
  breadcrumb: { flexDirection: "row", marginBottom: spacing.md },
  muted: { color: colors.muted, fontSize: 12 },
  retry: { color: colors.primary, fontWeight: "700", marginTop: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text, fontWeight: "600" },
});