import { type NextRequest, NextResponse } from "next/server"
import { backgroundJobRunner } from "@/lib/background-jobs"
import { withAuth } from "@/lib/auth-middleware"

async function handler(request: NextRequest) {
  try {
    const { method } = request

    if (method === "POST") {
      const body = await request.json()
      const { action, interval } = body

      switch (action) {
        case "start":
          backgroundJobRunner.start(interval || 30000)
          return NextResponse.json({
            success: true,
            message: "Background job runner started",
          })

        case "stop":
          backgroundJobRunner.stop()
          return NextResponse.json({
            success: true,
            message: "Background job runner stopped",
          })

        default:
          return NextResponse.json({ error: "Invalid action" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
  } catch (error) {
    console.error("Background job control error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Control failed",
      },
      { status: 500 },
    )
  }
}

export const POST = withAuth(handler, {
  requireAdminKey: true,
  rateLimit: { windowMs: 60000, maxRequests: 20 },
})
