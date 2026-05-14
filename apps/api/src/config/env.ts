import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(3001),
  API_HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  CORS_ORIGIN: z.string().default("http://localhost:3030"),
  SESSION_SECRET: z.string().min(32),
  ACCESS_PASSWORD: z.string().min(8),
  ANTHROPIC_API_KEY: z.string().min(10).optional(),
  VOYAGE_API_KEY: z.string().min(10).optional(),
  ELEVENLABS_API_KEY: z.string().optional(),
  MONTHLY_AI_BUDGET_CENTS: z.coerce.number().int().nonnegative().default(5000),
  GITHUB_APP_ID: z.string().optional(),
  GITHUB_APP_PRIVATE_KEY: z.string().optional(),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),
  GITHUB_INSTALLATION_ID: z.string().optional(),
  VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  VAPID_SUBJECT: z.string().email().or(z.string().url()).optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
