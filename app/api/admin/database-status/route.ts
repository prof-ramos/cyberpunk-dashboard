import { type NextRequest, NextResponse } from "next/server"
import { DatabaseValidator } from "@/lib/database-validator"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const adminKey = request.headers.get("x-admin-key")
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 })
    }

    // Validate database schema
    const schemaValidation = await DatabaseValidator.validateSchema()

    // Test database operations
    const operationsTest = await DatabaseValidator.testDatabaseOperations()

    // Get database health from custom function
    let healthData = null
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.rpc("get_database_health")

      if (!error) {
        healthData = data
      }
    } catch (error) {
      console.warn("Could not fetch database health data:", error)
    }

    const status = {
      timestamp: new Date().toISOString(),
      schema: {
        valid: schemaValidation.isValid,
        errors: schemaValidation.errors,
        warnings: schemaValidation.warnings,
        tables: schemaValidation.tables,
      },
      operations: {
        success: operationsTest.success,
        errors: operationsTest.errors,
      },
      health: healthData,
      overall_status: schemaValidation.isValid && operationsTest.success ? "healthy" : "unhealthy",
    }

    const statusCode = status.overall_status === "healthy" ? 200 : 503

    return NextResponse.json(status, { status: statusCode })
  } catch (error) {
    console.error("Database status check error:", error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overall_status: "error",
        error: error instanceof Error ? error.message : "Database status check failed",
      },
      { status: 500 },
    )
  }
}
