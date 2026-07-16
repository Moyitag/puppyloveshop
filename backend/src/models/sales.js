/*
Campos:
    shoppingCartId
    deliveryAddress { address, city, department, reference }
    paymentMethod
    paymentStatus
    createdAt
*/

import mongoose, { Schema, model } from "mongoose";

const salesSchema = new Schema(
  {
    shoppingCartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShoppingCart",
      required: true,
    },
    deliveryAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      department: { type: String, required: true },
      reference: { type: String },
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pendiente", "pagado", "rechazado"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Sales", salesSchema);
