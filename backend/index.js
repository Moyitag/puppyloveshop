import app from "./app.js";
import { connectDatabase } from "./database.js";
import { config } from "./src/config.js";

async function main() {
  try {
    await connectDatabase();
    app.listen(config.server.port, "0.0.0.0", () => {
      console.log("server on port " + config.server.port);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exitCode = 1;
  }
}

main();
