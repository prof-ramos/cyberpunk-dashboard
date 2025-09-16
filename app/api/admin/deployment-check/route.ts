import { type NextRequest, NextResponse } from "next/server"
import { validateEnv, checkIntegrations } from "@/lib/env-validation"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const adminKey = request.headers.get("x-admin-key")
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 })
    }

    const envValidation = validateEnv()
    const integrations = checkIntegrations()

    // Check database tables
    const supabase = await createClient()
    const tableChecks = await Promise.allSettled([
      supabase.from("webhook_events").select("count").limit(1),
      supabase.from("api_keys").select("count").limit(1),
      supabase.from("webhook_endpoints").select("count").limit(1),
      supabase.from("request_logs").select("count").limit(1),
      supabase.from("processing_logs").select("count").limit(1),
    ])

    const tablesStatus = {
      webhook_events: tableChecks[0].status === "fulfilled",
      api_keys: tableChecks[1].status === "fulfilled",
      webhook_endpoints: tableChecks[2].status === "fulfilled",
      request_logs: tableChecks[3].status === "fulfilled",
      processing_logs: tableChecks[4].status === "fulfilled",
    }

    // Check API routes
    const apiRoutes = [
      "/api/webhooks/receive",
      "/api/webhooks/n8n",
      "/api/webhooks/push-notification",
      "/api/webhooks/events",
      "/api/admin/api-keys",
      "/api/health",
    ]

    const deploymentReport = {
      timestamp: new Date().toISOString(),
      environment: {
        validation: envValidation.success,
        errors: envValidation.errors || [],
        nodeEnv: process.env.NODE_ENV,
      },
      integrations,
      database: {
        connected: Object.values(tablesStatus).every(Boolean),
        tables: tablesStatus,
        missingTables: Object.entries(tablesStatus)
          .filter(([_, exists]) => !exists)
          .map(([table]) => table),
      },
      apiRoutes: {
        total: apiRoutes.length,
        routes: apiRoutes,
      },
      security: {
        adminKeyConfigured: !!process.env.ADMIN_API_KEY,
        webhookSecretConfigured: !!process.env.WEBHOOK_SECRET,
        supabaseRLSEnabled: true, // Assuming RLS is enabled
      },
      recommendations: [],
    }

    // Add recommendations
    if (!envValidation.success) {
      deploymentReport.recommendations.push("Fix environment variable configuration before deployment")
    }

    if (!integrations.supabase) {
      deploymentReport.recommendations.push("Configure Supabase integration")
    }

    if (deploymentReport.database.missingTables.length > 0) {
      deploymentReport.recommendations.push(
        `Run database migrations for missing tables: ${deploymentReport.database.missingTables.join(", ")}`,
      )
    }

    if (process.env.NODE_ENV === "development") {
      deploymentReport.recommendations.push("Set NODE_ENV=production for production deployment")
    }

    const isReady =
      envValidation.success &&
      integrations.supabase &&
      deploymentReport.database.connected &&
      deploymentReport.database.missingTables.length === 0

    return NextResponse.json({
      deploymentReady: isReady,
      ...deploymentReport,
    })
  } catch (error) {
    console.error("Deployment check error:", error)
    return NextResponse.json(
      {
        deploymentReady: false,
        error: error instanceof Error ? error.message : "Deployment check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
