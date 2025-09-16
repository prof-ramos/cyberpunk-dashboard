import { NextResponse } from "next/server"
import { validateEnv, checkIntegrations } from "@/lib/env-validation"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const envValidation = validateEnv()
    const integrations = checkIntegrations()

    // Test database connection
    let dbStatus = "disconnected"
    try {
      const supabase = await createClient()
      const { error } = await supabase.from("webhook_events").select("count").limit(1)
      dbStatus = error ? "error" : "connected"
    } catch (error) {
      dbStatus = "error"
    }

    const health = {
      status: envValidation.success && integrations.supabase ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      checks: {
        environment: {
          status: envValidation.success ? "pass" : "fail",
          errors: envValidation.errors || [],
        },
        database: {
          status: dbStatus === "connected" ? "pass" : "fail",
          connection: dbStatus,
        },
        integrations: {
          supabase: integrations.supabase,
          webhooks: integrations.webhooks,
          backgroundJobs: integrations.backgroundJobs,
        },
        missingVariables: integrations.missingVars,
      },
    }

    const statusCode = health.status === "healthy" ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Health check failed",
      },
      { status: 500 },
    )
  }
}
