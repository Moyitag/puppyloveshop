/*
Campos:
    name
    email
    telephone
    address
    active
*/

import { Schema, model } from "mongoose";

const supplierSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    telephone: { type: String, required: true },
    address: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Suppliers", supplierSchema);
