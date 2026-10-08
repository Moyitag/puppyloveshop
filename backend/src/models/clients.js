/*
Campos:
    fullName
    email
    password
    phoneNumber
    status
    isVerified
*/

import { Schema, model } from "mongoose";

const clientSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    passwordResetCodeHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
    passwordResetAttempts: { type: Number, default: 0, select: false },
    passwordResetRequestedAt: { type: Date, select: false },
    phoneNumber: { type: String, required: true },
    status: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Clients", clientSchema);
