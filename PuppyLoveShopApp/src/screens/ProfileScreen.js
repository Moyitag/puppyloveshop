import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getSalesByClient } from "../api/api";
import { colors, spacing, radius } from "../theme";

export default function ProfileScreen() {
  const { client, logout } = useAuth();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (client) {
      getSalesByClient(client._id)
        .then((res) => setSales(res.data))
        .catch(() => {});
    }
  }, [client]);

  if (!client) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Inicia sesión para ver tu perfil.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>
          {client.name} {client.lastName}
        </Text>
        <Text style={styles.email}>{client.email}</Text>
        {client.phone && <Text style={styles.detail}>📞 {client.phone}</Text>}
        {client.address && <Text style={styles.detail}>📍 {client.address}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Mis pedidos</Text>
      <FlatList
        data={sales}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aún no tienes pedidos.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.orderTotal}>${Number(item.total).toFixed(2)}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  emptyText: { color: colors.muted, fontSize: 14, textAlign: "center", marginTop: spacing.lg },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  name: { fontSize: 20, fontWeight: "800", color: colors.text },
  email: { fontSize: 13, color: colors.muted, marginTop: 2 },
  detail: { fontSize: 13, color: colors.text, marginTop: spacing.xs },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  orderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderDate: { color: colors.text, fontSize: 13 },
  orderTotal: { color: colors.primary, fontWeight: "700", fontSize: 13 },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  logoutText: { color: colors.danger, fontWeight: "700", fontSize: 15 },
});
