import { NextResponse } from "next/server"
import { ZodError } from "zod"

export interface ApiError {
  message: string
  code?: string
  details?: any
  statusCode: number
}

export class ApiErrorHandler {
  static handle(error: unknown, context: string, requestId?: string): NextResponse {
    const timestamp = new Date().toISOString()
    const logContext = requestId ? `[${requestId}] ${context}` : context

    console.error(`${logContext}:`, error)

    // Zod validation errors
    if (error instanceof ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      }))

      return NextResponse.json(
        {
          error: "Validation failed",
          details,
          timestamp,
          request_id: requestId,
        },
        { status: 400 },
      )
    }

    // Custom API errors
    if (error instanceof Error && "statusCode" in error) {
      const apiError = error as ApiError
      return NextResponse.json(
        {
          error: apiError.message,
          code: apiError.code,
          details: apiError.details,
          timestamp,
          request_id: requestId,
        },
        { status: apiError.statusCode },
      )
    }

    // Database errors (Supabase)
    if (error && typeof error === "object" && "code" in error) {
      const dbError = error as any

      // Common Supabase error codes
      switch (dbError.code) {
        case "23505": // Unique constraint violation
          return NextResponse.json(
            {
              error: "Resource already exists",
              code: "DUPLICATE_RESOURCE",
              timestamp,
              request_id: requestId,
            },
            { status: 409 },
          )
        case "23503": // Foreign key constraint violation
          return NextResponse.json(
            {
              error: "Referenced resource not found",
              code: "INVALID_REFERENCE",
              timestamp,
              request_id: requestId,
            },
            { status: 400 },
          )
        case "42P01": // Table does not exist
          return NextResponse.json(
            {
              error: "Service temporarily unavailable",
              code: "SERVICE_UNAVAILABLE",
              timestamp,
              request_id: requestId,
            },
            { status: 503 },
          )
      }
    }

    // Generic errors
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        timestamp,
        request_id: requestId,
      },
      { status: 500 },
    )
  }

  static createError(message: string, statusCode: number, code?: string, details?: any): ApiError {
    return {
      message,
      statusCode,
      code,
      details,
    }
  }
}

// Custom error classes
export class ValidationError extends Error implements ApiError {
  statusCode = 400
  code = "VALIDATION_ERROR"
  details?: any

  constructor(message: string, details?: any) {
    super(message)
    this.name = "ValidationError"
    this.details = details
  }
}

export class AuthenticationError extends Error implements ApiError {
  statusCode = 401
  code = "AUTHENTICATION_ERROR"

  constructor(message = "Authentication required") {
    super(message)
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends Error implements ApiError {
  statusCode = 403
  code = "AUTHORIZATION_ERROR"

  constructor(message = "Insufficient permissions") {
    super(message)
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404
  code = "NOT_FOUND"

  constructor(message = "Resource not found") {
    super(message)
    this.name = "NotFoundError"
  }
}

export class RateLimitError extends Error implements ApiError {
  statusCode = 429
  code = "RATE_LIMIT_EXCEEDED"
  details?: { resetTime: number }

  constructor(message = "Rate limit exceeded", resetTime?: number) {
    super(message)
    this.name = "RateLimitError"
    this.details = resetTime ? { resetTime } : undefined
  }
}
