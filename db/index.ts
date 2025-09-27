import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "@/db/schema";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: env.AUTH_DRIZZLE_URL });
export const db = drizzle(pool, { schema });
