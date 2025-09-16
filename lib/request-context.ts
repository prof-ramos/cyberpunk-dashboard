import type { NextRequest } from "next/server"
import crypto from "crypto"

export interface RequestContext {
  id: string
  method: string
  url: string
  userAgent?: string
  ip?: string
  apiKey?: string
  timestamp: string
}

export class RequestContextManager {
  static create(request: NextRequest): RequestContext {
    const requestId = crypto.randomUUID()

    return {
      id: requestId,
      method: request.method,
      url: request.url,
      userAgent: request.headers.get("user-agent") || undefined,
      ip: this.getClientIP(request),
      apiKey: this.maskApiKey(request.headers.get("x-api-key")),
      timestamp: new Date().toISOString(),
    }
  }

  private static getClientIP(request: NextRequest): string | undefined {
    const forwarded = request.headers.get("x-forwarded-for")
    if (forwarded) {
      return forwarded.split(",")[0].trim()
    }

    const realIP = request.headers.get("x-real-ip")
    if (realIP) {
      return realIP
    }

    return request.ip || "unknown"
  }

  private static maskApiKey(apiKey: string | null): string | undefined {
    if (!apiKey) return undefined

    // Show first 8 and last 4 characters, mask the rest
    if (apiKey.length > 12) {
      return `${apiKey.substring(0, 8)}${"*".repeat(apiKey.length - 12)}${apiKey.substring(apiKey.length - 4)}`
    }

    return "*".repeat(apiKey.length)
  }

  static log(context: RequestContext, message: string, level: "info" | "warn" | "error" = "info") {
    const logEntry = {
      level,
      message,
      request_id: context.id,
      method: context.method,
      url: context.url,
      ip: context.ip,
      timestamp: new Date().toISOString(),
    }

    switch (level) {
      case "error":
        console.error(JSON.stringify(logEntry))
        break
      case "warn":
        console.warn(JSON.stringify(logEntry))
        break
      default:
        console.log(JSON.stringify(logEntry))
    }
  }
}
