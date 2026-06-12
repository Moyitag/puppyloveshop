import { Schema, model } from "mongoose";

const financialMovementSchema = new Schema(
  {
    nombre: { type: String, trim: true },
    type: { type: String, enum: ["Gasto", "Ganancias"], default: "Gasto" },
    gasto: { type: Number, default: 0 },
    descripcion: { type: String, trim: true },
    foto: { type: String },
    public_id: { type: String },
    activo: { type: String, enum: ["Si", "No"], default: "Si" },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("financialMovement", financialMovementSchema);
