import { type NextRequest, NextResponse } from "next/server"
import { webhookService } from "@/lib/webhook-service"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get("x-api-key")
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    // Validate API key
    const isValidKey = await webhookService.validateApiKey(apiKey)
    if (!isValidKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = request.nextUrl

    // Query parameters
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const processed = searchParams.get("processed")
    const eventType = searchParams.get("event_type")
    const source = searchParams.get("source")

    // Build query
    let query = supabase
      .from("webhook_events")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (processed !== null) {
      query = query.eq("processed", processed === "true")
    }
    if (eventType) {
      query = query.eq("event_type", eventType)
    }
    if (source) {
      query = query.eq("source", source)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      events: data,
      pagination: {
        limit,
        offset,
        count: data?.length || 0,
      },
    })
  } catch (error) {
    console.error("Events fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
