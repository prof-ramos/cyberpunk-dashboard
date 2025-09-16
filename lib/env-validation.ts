import { z } from "zod"

// Environment variables schema
const envSchema = z.object({
  // Database (Supabase)
  SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "Supabase service role key is required"),

  // Next.js public variables
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid public Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Public Supabase anon key is required"),

  // Webhook system
  ADMIN_API_KEY: z.string().min(32, "Admin API key must be at least 32 characters"),
  WEBHOOK_SECRET: z.string().min(16, "Webhook secret must be at least 16 characters"),
  WEBHOOK_API_KEY: z.string().min(32, "Webhook API key must be at least 32 characters"),

  // Optional environment variables
  ENABLE_BACKGROUND_JOBS: z.string().optional().default("false"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

export type EnvConfig = z.infer<typeof envSchema>

// Validate environment variables
export function validateEnv(): { success: boolean; errors?: string[]; config?: EnvConfig } {
  try {
    const config = envSchema.parse(process.env)
    return { success: true, config }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ["Unknown validation error"] }
  }
}

// Get validated environment config
export function getEnvConfig(): EnvConfig {
  const validation = validateEnv()

  if (!validation.success) {
    console.error("Environment validation failed:")
    validation.errors?.forEach((error) => console.error(`  - ${error}`))
    throw new Error("Invalid environment configuration")
  }

  return validation.config!
}

// Check if all required integrations are configured
export function checkIntegrations(): {
  supabase: boolean
  webhooks: boolean
  backgroundJobs: boolean
  missingVars: string[]
} {
  const validation = validateEnv()
  const missingVars: string[] = []

  if (!validation.success) {
    missingVars.push(...(validation.errors || []))
  }

  return {
    supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    webhooks: !!(process.env.ADMIN_API_KEY && process.env.WEBHOOK_SECRET),
    backgroundJobs: process.env.ENABLE_BACKGROUND_JOBS === "true",
    missingVars,
  }
}
