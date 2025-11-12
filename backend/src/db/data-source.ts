import "dotenv/config";
import { DataSource } from "typeorm";

// DataSource for TypeORM CLI (migrations). Uses env vars.
const isProd = process.env.NODE_ENV === "production";

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "QwertyWeb123321",
  database: process.env.DB_NAME || "safety",
  schema: process.env.DB_SCHEMA || "public",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  logging: !isProd,
  // For CLI via ts-node, point at TS files in src
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/db/migrations/*.{ts,js}"],
});
