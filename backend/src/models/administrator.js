/*
Campos:
    fullName
    email
    password
    status
*/

import { Schema, model } from "mongoose";

const administratorSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Administrator", administratorSchema);
