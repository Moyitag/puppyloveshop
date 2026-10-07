import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import BottomSheet from "./BottomSheet";
import AppButton from "./AppButton";
import { PETS } from "../utils/petFilter";
import { colors, spacing, radius } from "../theme";

const ADDRESS_KEY = "puppy_address";

// Encabezado del diseño: barra rosa (logo, buscador, carrito), chips de dirección/cuenta
// y barra amarilla con Mascotas ▾ / Reseñas / Servicios / Promociones.
// active: "Servicios" | "Promociones" | "Mascotas" | undefined
export default function AppHeader({ active }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { client, logout } = useAuth();
  const { count, refreshCount } = useCart();

  const [query, setQuery] = useState("");
  const [address, setAddress] = useState("");
  const [addressDraft, setAddressDraft] = useState("");
  const [sheet, setSheet] = useState(null); // "pets" | "address" | "account"

  useEffect(() => {
    AsyncStorage.getItem(ADDRESS_KEY).then((v) => v && setAddress(v));
  }, []);

  // Cada vez que la pantalla gana foco, refrescamos el contador del carrito
  useFocusEffect(
    useCallback(() => {
      refreshCount();
    }, [refreshCount])
  );

  const closeSheet = () => setSheet(null);

  const submitSearch = () => {
    if (!query.trim()) return;
    navigation.navigate("Category", { query: query.trim(), pet: null });
  };

  const saveAddress = async () => {
    const value = addressDraft.trim();
    if (value.length < 5) {
      Alert.alert("Dirección incompleta", "Escribe tu dirección completa para continuar.");
      return;
    }
    await AsyncStorage.setItem(ADDRESS_KEY, value);
    setAddress(value);
    closeSheet();
  };

  const goPet = (pet) => {
    closeSheet();
    navigation.navigate("Category", { pet, query: "" });
  };

  const goTo = (screen) => {
    if (active === screen) return;
    navigation.navigate(screen);
  };

  const firstName = client?.fullName?.split(" ")[0] || "cliente";

  return (
    <View>
      {/* Barra rosa */}
      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.logo} onPress={() => navigation.navigate("Home")}>
            <Text style={{ fontSize: 24 }}>🐱</Text>
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="¿Qué necesita tu mascota?"
              placeholderTextColor="#9A9A9A"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={submitSearch}
            />
          </View>

          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate("Carrito")}>
            <Text style={{ fontSize: 20 }}>🛒</Text>
            {count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count > 99 ? "99+" : count}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.row, { marginTop: spacing.sm }]}>
          <TouchableOpacity
            style={[styles.chip, { flex: 1 }]}
            onPress={() => {
              setAddressDraft(address);
              setSheet("address");
            }}
          >
            <Text style={styles.chipText} numberOfLines={1}>
              📍 {address || "Agregar dirección"}
            </Text>
            <Text style={styles.chipArrow}>▾</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.chip, { marginLeft: spacing.sm }]} onPress={() => setSheet("account")}>
            <Text style={styles.chipText}>{client ? `Hola, ${firstName}` : "Mi cuenta"}</Text>
            <Text style={styles.chipArrow}>▾</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra amarilla */}
      <View style={styles.nav}>
        <NavLink label="Mascotas ▾" active={active === "Mascotas"} onPress={() => setSheet("pets")} />
        <NavLink label="Reseñas" onPress={() => Alert.alert("Reseñas", "Esta sección estará disponible muy pronto 🐾")} />
        <NavLink label="Servicios" active={active === "Servicios"} onPress={() => goTo("Services")} />
        <NavLink label="Promociones" active={active === "Promociones"} onPress={() => goTo("Promotions")} />
      </View>

      {/* Menú Mascotas */}
      <BottomSheet visible={sheet === "pets"} onClose={closeSheet} title="Mascotas">
        {PETS.map((pet) => (
          <TouchableOpacity key={pet} style={styles.sheetItem} onPress={() => goPet(pet)}>
            <Text style={styles.sheetItemText}>{pet}</Text>
            <Text style={styles.sheetArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </BottomSheet>

      {/* Dirección */}
      <BottomSheet visible={sheet === "address"} onClose={closeSheet} title="¿Dónde entregamos?">
        <TextInput
          style={styles.input}
          placeholder="Calle, número, ciudad"
          placeholderTextColor={colors.muted}
          value={addressDraft}
          onChangeText={setAddressDraft}
        />
        <View style={{ height: spacing.md }} />
        <AppButton label="Guardar dirección" onPress={saveAddress} />
      </BottomSheet>

      {/* Cuenta */}
      <BottomSheet visible={sheet === "account"} onClose={closeSheet} title={client ? client.fullName : "Mi cuenta"}>
        <TouchableOpacity
          style={styles.sheetItem}
          onPress={() => {
            closeSheet();
            navigation.navigate("Perfil");
          }}
        >
          <Text style={styles.sheetItemText}>Mi perfil</Text>
          <Text style={styles.sheetArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sheetItem}
          onPress={() => {
            closeSheet();
            navigation.navigate("Carrito");
          }}
        >
          <Text style={styles.sheetItemText}>Mi carrito</Text>
          <Text style={styles.sheetArrow}>›</Text>
        </TouchableOpacity>
        <View style={{ height: spacing.md }} />
        <AppButton
          label="Cerrar sesión"
          variant="outline"
          onPress={() => {
            closeSheet();
            logout();
          }}
        />
      </BottomSheet>
    </View>
  );
}

function NavLink({ label, onPress, active }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.navItem, active && styles.navItemActive]}>
      <Text style={[styles.navText, active && { fontWeight: "700" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  top: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingBottom: spacing.sm + 2 },
  row: { flexDirection: "row", alignItems: "center" },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  searchBox: {
    flex: 1,
    height: 42,
    backgroundColor: "#fff",
    borderRadius: radius.sm + 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm + 2,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 13, color: colors.text, paddingVertical: 0 },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2B2B2B",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primaryDark,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm,
  },
  chipText: { color: "#fff", fontSize: 12, flexShrink: 1 },
  chipArrow: { color: "#fff", fontSize: 11, marginLeft: 6 },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.navBar,
    paddingHorizontal: spacing.xs,
  },
  navItem: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.xs + 2, borderBottomWidth: 2, borderBottomColor: "transparent" },
  navItemActive: { borderBottomColor: colors.primary },
  navText: { color: colors.primary, fontSize: 13 },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetItemText: { fontSize: 16, color: colors.text },
  sheetArrow: { fontSize: 22, color: colors.primary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 15,
    color: colors.text,
  },
});