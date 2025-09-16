import { type NextRequest, NextResponse } from "next/server"
import { webhookService } from "@/lib/webhook-service"
import { PushNotificationSchema } from "@/lib/webhook-types"

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

    // Parse push notification payload
    const body = await request.json()
    const notificationData = PushNotificationSchema.parse(body)

    // Convert to webhook format
    const webhookData = {
      event_type: "push_notification.send",
      source: "push_service",
      data: notificationData,
    }

    // Get headers for logging
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Store webhook event
    const event = await webhookService.storeWebhookEvent(webhookData, headers)

    // Here you would integrate with your push notification service
    // For now, we'll just trigger outgoing webhooks
    await webhookService.triggerWebhooks(webhookData.event_type, webhookData.data)

    return NextResponse.json({
      success: true,
      event_id: event.id,
      message: "Push notification queued successfully",
      notification: {
        title: notificationData.title,
        body: notificationData.body,
        target: notificationData.target,
      },
    })
  } catch (error) {
    console.error("Push notification error:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid push notification payload", details: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
