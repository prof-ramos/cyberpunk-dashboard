import { type NextRequest, NextResponse } from "next/server"
import { webhookService } from "@/lib/webhook-service"
import { IncomingWebhookSchema } from "@/lib/webhook-types"

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json()

    // Validate webhook payload
    const webhookData = IncomingWebhookSchema.parse(body)

    // Get headers for logging
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Store webhook event
    const event = await webhookService.storeWebhookEvent(webhookData, headers)

    // Trigger any configured outgoing webhooks
    await webhookService.triggerWebhooks(webhookData.event_type, webhookData.data)

    return NextResponse.json({
      success: true,
      event_id: event.id,
      message: "Webhook received and processed",
    })
  } catch (error) {
    console.error("Webhook processing error:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid webhook payload", details: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
