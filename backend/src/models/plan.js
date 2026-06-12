import { Schema, model } from "mongoose";

const planSchema = new Schema(
  {
    nombre: { type: String, trim: true },
    precioMensual: { type: Number, default: 0 },
    precioAnual: { type: Number, default: 0 },
    descripcion: { type: String, trim: true },
    features: [{ type: String, trim: true }],
    tipoMascota: { type: String, enum: ["Perro", "Gato"], default: "Perro" },
    foto: { type: String },
    public_id: { type: String },
    activo: { type: String, enum: ["Si", "No"], default: "Si" },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("plan", planSchema);
