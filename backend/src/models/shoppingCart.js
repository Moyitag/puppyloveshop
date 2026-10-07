/*
Campos:
    userId
    products []
        productId
        amount
        subtotal
    total
    discount
    totalWithDiscount
*/

import mongoose, { Schema, model } from "mongoose";

const shoppingCartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clients",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        variantId: { type: mongoose.Schema.Types.ObjectId },
        size: { type: String, default: "" },
        color: { type: String, default: "" },
        amount: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalWithDiscount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["active", "ordered"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

shoppingCartSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);

export default model("ShoppingCart", shoppingCartSchema);
