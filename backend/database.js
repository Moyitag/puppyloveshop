import mongoose from "mongoose";
import { config } from "./src/config.js";

export async function connectDatabase() {
  mongoose.connection.on("disconnected", () => {
    console.log("DB is disconnected");
  });
  mongoose.connection.on("error", (error) => {
    console.error("Database error:", error.message);
  });

  await mongoose.connect(config.db.URI);
  console.log("DB is connected");
}
