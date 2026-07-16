/*
Campos:
    productName
    images []
    description
    productType
    categories []
    variants [] { size, color, stock }
    price
    expirationDate
    supplierId
*/

import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    productName: { type: String, required: true, trim: true },
    images: [{ type: String }],
    description: { type: String },
    productType: { type: String, required: true },
    categories: [{ type: String }],
    variants: [
      {
        size: { type: String },
        color: { type: String },
        stock: { type: Number, default: 0 },
      },
    ],
    price: { type: Number, required: true },
    expirationDate: { type: Date },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suppliers",
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Products", productSchema);
