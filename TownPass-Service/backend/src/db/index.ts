import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  connectionTimeoutMillis: 5000,
});

await client.connect();
export const db = drizzle(client);
