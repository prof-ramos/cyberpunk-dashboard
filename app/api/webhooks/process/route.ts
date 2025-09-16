import { type NextRequest, NextResponse } from "next/server"
import { webhookService } from "@/lib/webhook-service"

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

    // Get unprocessed events
    const events = await webhookService.getUnprocessedEvents()

    const results = []

    for (const event of events) {
      try {
        // Process the event based on its type
        await processWebhookEvent(event)

        // Mark as processed
        await webhookService.markEventProcessed(event.id)

        results.push({
          event_id: event.id,
          status: "processed",
          event_type: event.event_type,
        })
      } catch (error) {
        // Mark as processed with error
        await webhookService.markEventProcessed(event.id, error instanceof Error ? error.message : "Unknown error")

        results.push({
          event_id: event.id,
          status: "error",
          event_type: event.event_type,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed_count: results.length,
      results,
    })
  } catch (error) {
    console.error("Event processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to process different event types
async function processWebhookEvent(event: any) {
  switch (event.event_type) {
    case "n8n.workflow_completed":
      // Handle N8N workflow completion
      console.log(`N8N workflow ${event.payload.workflow_id} completed`)
      break

    case "push_notification.send":
      // Handle push notification sending
      console.log(`Sending push notification: ${event.payload.title}`)
      break

    case "user.created":
      // Handle user creation events
      console.log(`New user created: ${event.payload.user_id}`)
      break

    default:
      console.log(`Processing generic event: ${event.event_type}`)
  }
}
