import { createEnv } from "@t3-oss/env-nextjs";

import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  server: {
    AUTH_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    AUTH_DRIZZLE_URL: z.string(),
    RESEND_API_KEY: z.string(),
    UPLOADTHING_TOKEN: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
