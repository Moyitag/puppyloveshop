/*
Campos:
    rating
    title
    experienceType
    details
    userId
    certifiedPurchase
    productId
    createdAt
    active
*/

import mongoose, { Schema, model } from "mongoose";

const productReviewSchema = new Schema(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    experienceType: { type: String, required: true },
    details: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clients",
      required: true,
    },
    certifiedPurchase: { type: Boolean, default: false },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("ProductReview", productReviewSchema);
