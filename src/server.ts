import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { pool } from "./config/db.js";
import createTables from "./config/migrations.js";

const PORT = process.env["PORT"] ?? 5000;

const startServer = async (): Promise<void> => {
  try {
    // Test DB connection
    await pool.query("SELECT 1");
    console.log("Database connected successfully");

    // Run migrations
    await createTables();

    app.listen(PORT, () => {
      console.log(`DevPulse server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
