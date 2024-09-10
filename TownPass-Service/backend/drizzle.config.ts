import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL must be defined in .env.local");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  url: process.env.POSTGRES_URL,
  dbCredentials: { connectionString: process.env.POSTGRES_URL },
});
