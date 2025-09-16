import { type NextRequest, NextResponse } from "next/server"
import { webhookService } from "@/lib/webhook-service"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // This would typically require admin authentication
    // For now, we'll use a simple API key check
    const adminKey = request.headers.get("x-admin-key")
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 })
    }

    const body = await request.json()
    const { name, permissions, expires_in_days } = body

    if (!name) {
      return NextResponse.json({ error: "Key name is required" }, { status: 400 })
    }

    const expiresAt = expires_in_days ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000) : undefined

    const { key, id } = await webhookService.generateApiKey(name, permissions || [], expiresAt)

    return NextResponse.json({
      success: true,
      api_key: key,
      key_id: id,
      name,
      expires_at: expiresAt?.toISOString() || null,
      message: "API key generated successfully. Store it securely - it won't be shown again.",
    })
  } catch (error) {
    console.error("API key generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Admin authentication check
    const adminKey = request.headers.get("x-admin-key")
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("api_keys")
      .select("id, key_name, permissions, is_active, created_at, last_used_at, expires_at")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      api_keys: data,
    })
  } catch (error) {
    console.error("API keys fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
