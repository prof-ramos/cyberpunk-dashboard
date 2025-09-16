import { type NextRequest, NextResponse } from "next/server"
import { eventProcessor } from "@/lib/event-processor"
import { withAuth } from "@/lib/auth-middleware"

async function handler(request: NextRequest) {
  try {
    const result = await eventProcessor.processUnprocessedEvents()

    return NextResponse.json({
      success: true,
      message: "Event processing completed",
      processed: result.processed,
      failed: result.failed,
      results: result.results,
    })
  } catch (error) {
    console.error("Manual event processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Processing failed",
      },
      { status: 500 },
    )
  }
}

export const POST = withAuth(handler, {
  requireAdminKey: true,
  rateLimit: { windowMs: 60000, maxRequests: 10 },
})
