import { type NextRequest, NextResponse } from "next/server"
import { webhookService } from "./webhook-service"
import crypto from "crypto"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface AuthMiddlewareOptions {
  requireApiKey?: boolean
  requireAdminKey?: boolean
  requireSignature?: boolean
  rateLimit?: {
    windowMs: number
    maxRequests: number
  }
  allowedOrigins?: string[]
}

export class AuthMiddleware {
  // Validate API key authentication
  static async validateApiKey(request: NextRequest): Promise<{ valid: boolean; error?: string }> {
    const apiKey = request.headers.get("x-api-key")

    if (!apiKey) {
      return { valid: false, error: "API key required" }
    }

    try {
      const isValid = await webhookService.validateApiKey(apiKey)
      return { valid: isValid, error: isValid ? undefined : "Invalid API key" }
    } catch (error) {
      return { valid: false, error: "API key validation failed" }
    }
  }

  // Validate admin key authentication
  static validateAdminKey(request: NextRequest): { valid: boolean; error?: string } {
    const adminKey = request.headers.get("x-admin-key")
    const expectedAdminKey = process.env.ADMIN_API_KEY

    if (!expectedAdminKey) {
      return { valid: false, error: "Admin authentication not configured" }
    }

    if (!adminKey) {
      return { valid: false, error: "Admin key required" }
    }

    const isValid = crypto.timingSafeEqual(Buffer.from(adminKey), Buffer.from(expectedAdminKey))

    return { valid: isValid, error: isValid ? undefined : "Invalid admin key" }
  }

  // Validate webhook signature (for GitHub, Stripe-style webhooks)
  static validateWebhookSignature(
    request: NextRequest,
    payload: string,
    secret: string,
  ): { valid: boolean; error?: string } {
    const signature = request.headers.get("x-webhook-signature") || request.headers.get("x-hub-signature-256")

    if (!signature) {
      return { valid: false, error: "Webhook signature required" }
    }

    try {
      const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")

      const providedSignature = signature.replace("sha256=", "")

      const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(providedSignature))

      return { valid: isValid, error: isValid ? undefined : "Invalid webhook signature" }
    } catch (error) {
      return { valid: false, error: "Signature validation failed" }
    }
  }

  // Rate limiting
  static checkRateLimit(
    request: NextRequest,
    options: { windowMs: number; maxRequests: number },
  ): { allowed: boolean; error?: string; resetTime?: number } {
    const clientId = this.getClientIdentifier(request)
    const now = Date.now()
    const windowStart = now - options.windowMs

    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }

    const clientData = rateLimitStore.get(clientId)

    if (!clientData || clientData.resetTime < now) {
      // New window
      rateLimitStore.set(clientId, {
        count: 1,
        resetTime: now + options.windowMs,
      })
      return { allowed: true }
    }

    if (clientData.count >= options.maxRequests) {
      return {
        allowed: false,
        error: "Rate limit exceeded",
        resetTime: clientData.resetTime,
      }
    }

    // Increment count
    clientData.count++
    rateLimitStore.set(clientId, clientData)

    return { allowed: true }
  }

  // Get client identifier for rate limiting
  private static getClientIdentifier(request: NextRequest): string {
    // Try to get API key first (most specific)
    const apiKey = request.headers.get("x-api-key")
    if (apiKey) {
      return `api_key:${crypto.createHash("sha256").update(apiKey).digest("hex").substring(0, 16)}`
    }

    // Fall back to IP address
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.ip || "unknown"
    return `ip:${ip}`
  }

  // CORS handling
  static handleCors(request: NextRequest, allowedOrigins?: string[]): NextResponse | null {
    const origin = request.headers.get("origin")

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 })

      if (origin && (allowedOrigins?.includes(origin) || allowedOrigins?.includes("*"))) {
        response.headers.set("Access-Control-Allow-Origin", origin)
      }

      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-api-key, x-admin-key, x-webhook-signature",
      )
      response.headers.set("Access-Control-Max-Age", "86400")

      return response
    }

    return null
  }

  // Main middleware function
  static async authenticate(
    request: NextRequest,
    options: AuthMiddlewareOptions = {},
  ): Promise<{ success: boolean; response?: NextResponse; error?: string }> {
    try {
      // Handle CORS
      if (options.allowedOrigins) {
        const corsResponse = this.handleCors(request, options.allowedOrigins)
        if (corsResponse) {
          return { success: true, response: corsResponse }
        }
      }

      // Rate limiting
      if (options.rateLimit) {
        const rateLimitResult = this.checkRateLimit(request, options.rateLimit)
        if (!rateLimitResult.allowed) {
          const response = NextResponse.json(
            {
              error: rateLimitResult.error,
              reset_time: rateLimitResult.resetTime,
            },
            { status: 429 },
          )
          response.headers.set("X-RateLimit-Limit", options.rateLimit.maxRequests.toString())
          response.headers.set("X-RateLimit-Reset", (rateLimitResult.resetTime || 0).toString())
          return { success: false, response }
        }
      }

      // Admin key validation
      if (options.requireAdminKey) {
        const adminResult = this.validateAdminKey(request)
        if (!adminResult.valid) {
          return {
            success: false,
            response: NextResponse.json({ error: adminResult.error }, { status: 401 }),
          }
        }
      }

      // API key validation
      if (options.requireApiKey) {
        const apiResult = await this.validateApiKey(request)
        if (!apiResult.valid) {
          return {
            success: false,
            response: NextResponse.json({ error: apiResult.error }, { status: 401 }),
          }
        }
      }

      // Webhook signature validation
      if (options.requireSignature) {
        const body = await request.text()
        const secret = process.env.WEBHOOK_SECRET

        if (!secret) {
          return {
            success: false,
            response: NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 }),
          }
        }

        const signatureResult = this.validateWebhookSignature(request, body, secret)
        if (!signatureResult.valid) {
          return {
            success: false,
            response: NextResponse.json({ error: signatureResult.error }, { status: 401 }),
          }
        }
      }

      return { success: true }
    } catch (error) {
      console.error("Authentication middleware error:", error)
      return {
        success: false,
        response: NextResponse.json({ error: "Authentication failed" }, { status: 500 }),
      }
    }
  }
}

// Helper function to create authenticated route handlers
export function withAuth(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: AuthMiddlewareOptions = {},
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await AuthMiddleware.authenticate(request, options)

    if (!authResult.success) {
      return authResult.response!
    }

    // If CORS preflight was handled, return that response
    if (authResult.response) {
      return authResult.response
    }

    // Continue to the actual handler
    return handler(request)
  }
}

// Predefined middleware configurations
export const webhookAuth = (options: Partial<AuthMiddlewareOptions> = {}) =>
  withAuth(async () => NextResponse.next(), {
    requireApiKey: true,
    rateLimit: { windowMs: 60000, maxRequests: 100 }, // 100 requests per minute
    allowedOrigins: ["*"],
    ...options,
  })

export const adminAuth = (options: Partial<AuthMiddlewareOptions> = {}) =>
  withAuth(async () => NextResponse.next(), {
    requireAdminKey: true,
    rateLimit: { windowMs: 60000, maxRequests: 50 }, // 50 requests per minute for admin
    ...options,
  })

export const signatureAuth = (options: Partial<AuthMiddlewareOptions> = {}) =>
  withAuth(async () => NextResponse.next(), {
    requireSignature: true,
    rateLimit: { windowMs: 60000, maxRequests: 200 }, // Higher limit for signed webhooks
    allowedOrigins: ["*"],
    ...options,
  })
