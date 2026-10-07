import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import AppHeader from "../components/AppHeader";
import BottomSheet from "../components/BottomSheet";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import {
  FOUNDATIONS,
  VISIBLE_FOUNDATIONS,
  CLINIC_WHATSAPP,
  TIME_SLOTS,
  PET_TYPES,
  DOG_IMAGE,
} from "../data/staticData";
import { colors, spacing, radius, shadow } from "../theme";

// Interfaz 2 del Figma: consulta veterinaria a domicilio + adopción.
export default function ServicesScreen({ navigation }) {
  const { client } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const [booking, setBooking] = useState(false);

  // Formulario de cita
  const [form, setForm] = useState({ owner: client?.fullName || "", petName: "", petType: "Perro", date: "", time: "", phone: "", reason: "" });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const foundations = showAll ? FOUNDATIONS : FOUNDATIONS.slice(0, VISIBLE_FOUNDATIONS);
  const hasMore = FOUNDATIONS.length > VISIBLE_FOUNDATIONS;

  const open = async (url, errorMsg = "No se pudo abrir el enlace.") => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Ups", errorMsg);
    }
  };

  const contactFoundation = (f) => {
    const msg = "Hola, vengo de Puppy Love Shop y me gustaría información sobre adopción 🐾";
    if (f.whatsapp) return open(`https://wa.me/${f.whatsapp}?text=${encodeURIComponent(msg)}`, "No se pudo abrir WhatsApp.");
    // Sin WhatsApp registrado: usamos el correo de la fundación
    open(`mailto:${f.email}?subject=${encodeURIComponent("Adopción")}&body=${encodeURIComponent(msg)}`);
  };

  // dd/mm/aaaa con barras automáticas
  const onDateChange = (text) => {
    const d = text.replace(/\D/g, "").slice(0, 8);
    let out = d;
    if (d.length > 4) out = `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    else if (d.length > 2) out = `${d.slice(0, 2)}/${d.slice(2)}`;
    set("date", out);
  };

  const validate = () => {
    if (form.owner.trim().length < 3) return "Escribe tu nombre.";
    if (!form.petName.trim()) return "Escribe el nombre de tu mascota.";
    const m = form.date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return "La fecha debe tener el formato DD/MM/AAAA.";
    const date = new Date(+m[3], +m[2] - 1, +m[1]);
    const valid = date.getFullYear() === +m[3] && date.getMonth() === +m[2] - 1 && date.getDate() === +m[1];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!valid) return "La fecha no es válida.";
    if (date < today) return "Elige una fecha de hoy en adelante.";
    if (!form.time) return "Elige un horario.";
    if (form.phone.replace(/\D/g, "").length < 7) return "Escribe un teléfono de contacto válido.";
    return null;
  };

  const submitBooking = async () => {
    const problem = validate();
    if (problem) return Alert.alert("Revisa el formulario", problem);

    const msg =
      `Hola Puppy Love Shop 🐶 quiero agendar una consulta veterinaria a domicilio.\n\n` +
      `Dueño/a: ${form.owner}\nMascota: ${form.petName} (${form.petType})\n` +
      `Fecha: ${form.date}\nHora: ${form.time}\nTeléfono: ${form.phone}\n` +
      `Motivo: ${form.reason.trim() || "Chequeo general"}`;

    setBooking(false);
    await open(`https://wa.me/${CLINIC_WHATSAPP}?text=${encodeURIComponent(msg)}`, "No se pudo abrir WhatsApp.");
  };

  return (
    <View style={styles.container}>
      <AppHeader active="Servicios" />

      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }} keyboardShouldPersistTaps="handled">
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={{ color: colors.primary, fontSize: 12 }}>Inicio</Text>
          </TouchableOpacity>
          <Text style={styles.muted}> › Servicios</Text>
        </View>
        <Text style={styles.heading}>Descubrí todo lo que PuppyLove ofrece para cuidar a tus mascotas</Text>

        {/* Consulta veterinaria */}
        <View style={styles.vetCard}>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <Text style={styles.vetTitle}>Consulta veterinaria a domicilio</Text>
            <Text style={styles.vetText}>Agendá tu cita con un veterinario certificado</Text>
            <TouchableOpacity style={styles.vetBtn} onPress={() => setBooking(true)}>
              <Text style={styles.vetBtnText}>Agenda aquí</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.vetImageWrap}>
            <Image source={DOG_IMAGE} style={styles.vetImage} resizeMode="contain" />
          </View>
        </View>

        {/* Adopción */}
        <Text style={styles.sectionTitle}>Ayuda a peludos desamparados - Adopción</Text>

        {foundations.map((f) => (
          <View key={f.id} style={styles.foundation}>
            <Text style={styles.foundationName}>{f.name}</Text>
            <View style={styles.foundationRow}>
              <View style={[styles.logo, { backgroundColor: f.color }]}>
                <Text style={styles.logoText}>{f.initials}</Text>
              </View>

              <View style={{ flex: 1 }}>
                {f.phone && (
                  <InfoRow icon="📞" text={f.phone} onPress={() => open(`tel:${f.phone.replace(/\s/g, "")}`)} />
                )}
                <InfoRow icon="🌐" text={f.web} onPress={() => open(`https://${f.web.replace(/^https?:\/\//, "")}`)} />
                <InfoRow icon="✉️" text={f.email} onPress={() => open(`mailto:${f.email}`)} />
              </View>
            </View>

            <TouchableOpacity style={styles.whatsBtn} onPress={() => contactFoundation(f)}>
              <Text style={styles.whatsBtnText}>Comunicate vía whatsapp</Text>
            </TouchableOpacity>
          </View>
        ))}

        {hasMore && (
          <TouchableOpacity style={styles.more} onPress={() => setShowAll((v) => !v)}>
            <Text style={styles.moreArrow}>{showAll ? "︿" : "﹀"}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Formulario de cita */}
      <BottomSheet visible={booking} onClose={() => setBooking(false)} title="Agenda tu consulta">
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Field label="Tu nombre" value={form.owner} onChangeText={(v) => set("owner", v)} placeholder="Nombre completo" />
          <Field label="Nombre de tu mascota" value={form.petName} onChangeText={(v) => set("petName", v)} placeholder="Ej. Max" />

          <Text style={styles.label}>Tipo de mascota</Text>
          <View style={styles.chips}>
            {PET_TYPES.map((t) => (
              <Chip key={t} label={t} active={form.petType === t} onPress={() => set("petType", t)} />
            ))}
          </View>

          <Field label="Fecha" value={form.date} onChangeText={onDateChange} placeholder="DD/MM/AAAA" keyboardType="number-pad" />

          <Text style={styles.label}>Horario</Text>
          <View style={styles.chips}>
            {TIME_SLOTS.map((t) => (
              <Chip key={t} label={t} active={form.time === t} onPress={() => set("time", t)} />
            ))}
          </View>

          <Field label="Teléfono de contacto" value={form.phone} onChangeText={(v) => set("phone", v)} placeholder="Ej. 7000 0000" keyboardType="phone-pad" />
          <Field label="Motivo (opcional)" value={form.reason} onChangeText={(v) => set("reason", v)} placeholder="Vacunas, chequeo, malestar..." multiline />

          <View style={{ height: spacing.md }} />
          <AppButton label="Enviar por WhatsApp" onPress={submitBooking} />
          <Text style={[styles.muted, { textAlign: "center", marginTop: spacing.sm }]}>
            Se abrirá WhatsApp con tu solicitud lista para enviar.
          </Text>
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

function InfoRow({ icon, text, onPress }) {
  return (
    <TouchableOpacity style={styles.infoRow} onPress={onPress}>
      <Text style={{ fontSize: 13, marginRight: 8 }}>{icon}</Text>
      <Text style={styles.infoText} numberOfLines={1}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={{ marginBottom: spacing.sm + 2 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, props.multiline && { height: 70, textAlignVertical: "top" }]}
        placeholderTextColor={colors.muted}
        {...props}
      />
    </View>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && { color: "#fff" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  breadcrumb: { flexDirection: "row", paddingHorizontal: spacing.md, marginTop: spacing.md },
  muted: { color: colors.muted, fontSize: 12 },
  heading: { fontSize: 14, color: "#000", paddingHorizontal: spacing.md, marginTop: spacing.sm },
  vetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.blueSoft,
    borderRadius: radius.sm,
    margin: spacing.md,
    padding: spacing.md,
  },
  vetTitle: { fontSize: 15, fontWeight: "700", color: "#000" },
  vetText: { fontSize: 12, color: "#333", marginTop: spacing.sm },
  vetBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.navBar,
    borderRadius: radius.sm - 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  vetBtnText: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  vetImageWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FCEBEE",
    alignItems: "center",
    justifyContent: "center",
  },
  vetImage: { width: 100, height: 110 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#000", paddingHorizontal: spacing.md, marginTop: spacing.sm, marginBottom: spacing.md },
  foundation: {
    backgroundColor: "#fff",
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadow,
  },
  foundationName: { fontSize: 15, fontWeight: "700", color: "#000", marginBottom: spacing.sm },
  foundationRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 70, height: 70, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  logoText: { fontSize: 20, fontWeight: "800", color: "#555" },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  infoText: { fontSize: 12, color: "#222", flexShrink: 1 },
  whatsBtn: {
    backgroundColor: "#F8DCE3",
    borderRadius: radius.sm - 2,
    paddingVertical: spacing.sm + 4,
    alignItems: "center",
    marginTop: spacing.md,
  },
  whatsBtnText: { fontSize: 14, color: "#000" },
  more: { alignItems: "center", paddingVertical: spacing.sm },
  moreArrow: { fontSize: 22, color: colors.primary, fontWeight: "800" },
  label: { fontSize: 13, fontWeight: "600", color: colors.text, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 14,
    color: colors.text,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.sm + 2 },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text, fontWeight: "600" },
});