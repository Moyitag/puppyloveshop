import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getProducts, getSubCategories } from "../api/api";
import ProductCard from "../components/ProductCard";
import { colors, spacing, radius } from "../theme";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [prodRes, subRes] = await Promise.all([getProducts(), getSubCategories()]);
      setProducts(prodRes.data);
      setSubCategories(subRes.data);
    } catch (err) {
      console.log("Error cargando catálogo:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filtered = products.filter((p) => {
    const matchesSub = activeSubCategory ? p.subCategoryId === activeSubCategory : true;
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSub && matchesSearch;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar productos..."
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        data={[{ _id: null, name: "Todos" }, ...subCategories]}
        keyExtractor={(item) => item._id || "all"}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              activeSubCategory === item._id && styles.chipActive,
            ]}
            onPress={() => setActiveSubCategory(item._id)}
          >
            <Text
              style={[
                styles.chipText,
                activeSubCategory === item._id && styles.chipTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.grid}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate("ProductDetail", { product: item })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No se encontraron productos.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  search: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  chipsRow: { marginBottom: spacing.sm, flexGrow: 0 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  grid: { paddingBottom: spacing.xl },
  empty: { textAlign: "center", color: colors.muted, marginTop: spacing.xl },
});
