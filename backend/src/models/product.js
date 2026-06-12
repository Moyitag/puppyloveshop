import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    nombre: { type: String, trim: true },
    precio: { type: Number, default: 0 },
    descripcion: { type: String, trim: true },
    stock: { type: Number, default: 0 },
    imagen: { type: String },
    public_id: { type: String },
    activo: { type: String, enum: ["Si", "No"], default: "Si" },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("product", productSchema);
