import { defineConfig } from "drizzle-kit";
import { env } from "./data/env/server";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: env.AUTH_DRIZZLE_URL,
  },
});
