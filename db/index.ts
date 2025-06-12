import { env } from "@/data/env/server";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

export const db = drizzle(env.AUTH_DRIZZLE_URL, { schema });
