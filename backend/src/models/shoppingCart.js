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
        amount: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalWithDiscount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("ShoppingCart", shoppingCartSchema);
