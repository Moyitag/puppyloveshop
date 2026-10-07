import gato from "../../assets/gato.png";
import perro from "../../assets/perro.png";
import ave from "../../assets/ave.png";
import pez from "../../assets/pez.png";

// Categorías del Home (el "pet" debe coincidir con las llaves de utils/petFilter.js)
export const CATEGORIES = [
  { pet: "Gatos", label: "Gato", image: gato, bg: "#F7DCE4", border: "#E3B8C4" },
  { pet: "Perros", label: "Perros", image: perro, bg: "#D9EEF9", border: "#B7D4E2" },
  { pet: "Aves", label: "Aves", image: ave, bg: "#FFFBEA", border: "#E9DFB7" },
  { pet: "Peces", label: "Peces", image: pez, bg: "#FFEDC8", border: "#E6C98F" },
];

export const DOG_IMAGE = perro;

// ⚠️ Cambia este número por el WhatsApp real de la veterinaria (código de país + número, sin + ni espacios)
export const CLINIC_WHATSAPP = "573000000000";

// Fundaciones de adopción. Para agregar más, solo añade objetos a este arreglo.
// whatsapp: número con código de país (sin +). Si es null se usa el correo como alternativa.
export const FOUNDATIONS = [
  {
    id: "adopciones-bogota",
    name: "Adopciónes Bogotá",
    phone: null,
    web: "www.adopcionesbogota.com",
    email: "contacto@adopcionesbogota.com",
    whatsapp: null,
    initials: "AB",
    color: "#DDEBDD",
  },
  {
    id: "fundacion-mestisos",
    name: "Fundación Mestisos",
    phone: "317 6608596",
    web: "www.mestisos.org",
    email: "laika@laika.com.co",
    whatsapp: "573176608596",
    initials: "FM",
    color: "#FFF6C9",
  },
];

export const VISIBLE_FOUNDATIONS = 2;

export const TIME_SLOTS = ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];
export const PET_TYPES = ["Perro", "Gato", "Ave", "Pez", "Otro"];