import { type NextRequest, NextResponse } from "next/server"
import { webhookService } from "@/lib/webhook-service"
import { N8NWebhookSchema } from "@/lib/webhook-types"

export async function POST(request: NextRequest) {
  try {
    // Get API key from header or query parameter (N8N flexibility)
    const apiKey = request.headers.get("x-api-key") || request.nextUrl.searchParams.get("api_key")

    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 })
    }

    // Validate API key
    const isValidKey = await webhookService.validateApiKey(apiKey)
    if (!isValidKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    // Parse N8N webhook payload
    const body = await request.json()
    const n8nData = N8NWebhookSchema.parse(body)

    // Convert N8N format to our internal format
    const webhookData = {
      event_type: `n8n.${n8nData.event}`,
      source: "n8n",
      data: {
        workflow_id: n8nData.workflow_id,
        execution_id: n8nData.execution_id,
        ...n8nData.data,
      },
    }

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
      message: "N8N webhook processed successfully",
    })
  } catch (error) {
    console.error("N8N webhook error:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid N8N webhook payload", details: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
