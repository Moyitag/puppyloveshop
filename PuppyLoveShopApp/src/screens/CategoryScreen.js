import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { getProducts } from "../api/api";
import AppHeader from "../components/AppHeader";
import ProductCard from "../components/ProductCard";
import { PETS, matchesPet, matchesQuery } from "../utils/petFilter";
import { colors, spacing, radius } from "../theme";

// Destino de las categorías del Home, del menú "Mascotas ▾" y del buscador.
// route.params: { pet?: "Gatos" | "Perros" | "Aves" | "Peces", query?: string }
export default function CategoryScreen({ navigation, route }) {
  const { pet = null, query = "" } = route.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setError("");
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      setError("No pudimos cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(
    () => products.filter((p) => matchesPet(p, pet) && matchesQuery(p, query)),
    [products, pet, query]
  );

  const title = query ? `Resultados para "${query}"` : pet || "Todos los productos";

  return (
    <View style={styles.container}>
      <AppHeader active={pet ? "Mascotas" : undefined} />

      <FlatList
        data={filtered}
        keyExtractor={(p) => p._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: "row", marginBottom: spacing.sm }}>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Text style={{ color: colors.primary, fontSize: 12 }}>Inicio</Text>
              </TouchableOpacity>
              <Text style={styles.muted}> › {query ? "Búsqueda" : pet || "Productos"}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[null, ...PETS]}
              keyExtractor={(i) => i || "todos"}
              style={{ marginVertical: spacing.md, flexGrow: 0 }}
              renderItem={({ item }) => {
                const active = (pet || null) === item;
                return (
                  <TouchableOpacity
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => navigation.setParams({ pet: item, query: "" })}
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
              No encontramos productos para esta búsqueda 🐾
            </Text>
          )
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "700", color: "#000" },
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