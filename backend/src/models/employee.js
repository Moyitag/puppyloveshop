import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    nombre: { type: String, trim: true },
    telefono: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String },
    cargo: { type: String, trim: true },
    foto: { type: String },
    public_id: { type: String },
    activo: { type: String, enum: ["Si", "No"], default: "Si" },
    loginAttempts: { type: Number, default: 0 },
    timeOut: { type: Date, default: null },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("employee", employeeSchema);
