import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    // Admin authentication check
    const adminKey = request.headers.get("x-admin-key")
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Admin access required" }, { status: 401 })
    }

    const body = await request.json()
    const { name, url, secret, events } = body

    if (!name || !url) {
      return NextResponse.json({ error: "Name and URL are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("webhook_endpoints")
      .insert({
        name,
        url,
        secret: secret || null,
        events: events || [],
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      endpoint: data,
      message: "Webhook endpoint created successfully",
    })
  } catch (error) {
    console.error("Webhook endpoint creation error:", error)
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
      .from("webhook_endpoints")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      endpoints: data,
    })
  } catch (error) {
    console.error("Webhook endpoints fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
