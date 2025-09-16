import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export interface RequestLog {
  method: string
  url: string
  headers: Record<string, string>
  ip: string
  user_agent: string
  api_key_hash?: string
  response_status?: number
  response_time?: number
  error_message?: string
  timestamp: string
}

export class RequestLogger {
  static async logRequest(
    request: NextRequest,
    responseStatus?: number,
    responseTime?: number,
    errorMessage?: string,
  ): Promise<void> {
    try {
      const supabase = await createClient()

      // Get client IP
      const forwarded = request.headers.get("x-forwarded-for")
      const ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown"

      // Hash API key for privacy
      const apiKey = request.headers.get("x-api-key")
      const apiKeyHash = apiKey
        ? require("crypto").createHash("sha256").update(apiKey).digest("hex").substring(0, 16)
        : undefined

      // Collect headers (excluding sensitive ones)
      const headers: Record<string, string> = {}
      const sensitiveHeaders = ["x-api-key", "x-admin-key", "authorization", "cookie"]

      request.headers.forEach((value, key) => {
        if (!sensitiveHeaders.includes(key.toLowerCase())) {
          headers[key] = value
        }
      })

      const logEntry: RequestLog = {
        method: request.method,
        url: request.url,
        headers,
        ip,
        user_agent: request.headers.get("user-agent") || "unknown",
        api_key_hash: apiKeyHash,
        response_status: responseStatus,
        response_time: responseTime,
        error_message: errorMessage,
        timestamp: new Date().toISOString(),
      }

      // Store in database (optional - you might want to use a separate logging service)
      await supabase.from("request_logs").insert(logEntry)
    } catch (error) {
      // Don't throw errors from logging - just log to console
      console.error("Request logging failed:", error)
    }
  }

  static startTimer(): () => number {
    const start = Date.now()
    return () => Date.now() - start
  }
}

// Middleware wrapper that includes logging
export function withLogging<T extends (...args: any[]) => Promise<Response>>(handler: T): T {
  return (async (request: NextRequest, ...args: any[]) => {
    const timer = RequestLogger.startTimer()
    let response: Response
    let error: string | undefined

    try {
      response = await handler(request, ...args)
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error"
      response = new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const responseTime = timer()

    // Log the request asynchronously
    RequestLogger.logRequest(request, response.status, responseTime, error).catch(console.error)

    return response
  }) as T
}
