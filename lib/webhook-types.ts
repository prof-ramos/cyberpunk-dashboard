import { z } from "zod"

// Webhook Event Schema
export const WebhookEventSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
  event_type: z.string().min(1, "Event type is required").max(100, "Event type too long"),
  source: z.string().min(1, "Source is required").max(50, "Source too long"),
  payload: z.record(z.any()).default({}),
  headers: z.record(z.string()).optional().default({}),
  processed: z.boolean().default(false),
  created_at: z.string().datetime("Invalid datetime format"),
  processed_at: z.string().datetime("Invalid datetime format").nullable().default(null),
  error_message: z.string().max(1000, "Error message too long").nullable().default(null),
  retry_count: z.number().int().min(0).max(10).default(0),
})

// API Key Schema
export const ApiKeySchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
  key_name: z.string().min(1, "Key name is required").max(100, "Key name too long"),
  key_hash: z.string().min(64, "Invalid key hash").max(64, "Invalid key hash"),
  permissions: z.array(z.string().max(50)).default([]),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime("Invalid datetime format"),
  last_used_at: z.string().datetime("Invalid datetime format").nullable().default(null),
  expires_at: z.string().datetime("Invalid datetime format").nullable().default(null),
})

// Webhook Endpoint Schema
export const WebhookEndpointSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  url: z.string().url("Invalid URL format").max(500, "URL too long"),
  secret: z
    .string()
    .min(16, "Secret must be at least 16 characters")
    .max(100, "Secret too long")
    .nullable()
    .default(null),
  events: z.array(z.string().max(100)).default([]),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime("Invalid datetime format"),
  last_triggered_at: z.string().datetime("Invalid datetime format").nullable().default(null),
})

// Incoming webhook payload schema
export const IncomingWebhookSchema = z.object({
  event_type: z.string().min(1, "Event type is required").max(100, "Event type too long"),
  source: z.string().min(1, "Source is required").max(50, "Source too long"),
  data: z.record(z.any()).default({}),
  timestamp: z.string().datetime("Invalid timestamp format").optional(),
})

// N8N specific webhook schema
export const N8NWebhookSchema = z.object({
  event: z.string().min(1, "Event is required").max(100, "Event too long"),
  workflow_id: z.string().uuid("Invalid workflow ID format").optional(),
  execution_id: z.string().uuid("Invalid execution ID format").optional(),
  data: z.record(z.any()).default({}),
})

// Push notification schema
export const PushNotificationSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  body: z.string().min(1, "Body is required").max(500, "Body too long"),
  data: z.record(z.any()).optional().default({}),
  target: z.enum(["all", "user", "segment"], {
    errorMap: () => ({ message: "Target must be 'all', 'user', or 'segment'" }),
  }),
  target_id: z.string().max(100, "Target ID too long").optional(),
})

// Enhanced API request/response schemas for better validation
export const ApiKeyCreateRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  permissions: z.array(z.string().max(50)).optional().default([]),
  expires_in_days: z.number().int().min(1).max(365).optional(),
})

export const WebhookEndpointCreateRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  url: z.string().url("Invalid URL format").max(500, "URL too long"),
  secret: z.string().min(16, "Secret must be at least 16 characters").max(100, "Secret too long").optional(),
  events: z.array(z.string().max(100)).optional().default([]),
})

export type WebhookEvent = z.infer<typeof WebhookEventSchema>
export type ApiKey = z.infer<typeof ApiKeySchema>
export type WebhookEndpoint = z.infer<typeof WebhookEndpointSchema>
export type IncomingWebhook = z.infer<typeof IncomingWebhookSchema>
export type N8NWebhook = z.infer<typeof N8NWebhookSchema>
export type PushNotification = z.infer<typeof PushNotificationSchema>
export type ApiKeyCreateRequest = z.infer<typeof ApiKeyCreateRequestSchema>
export type WebhookEndpointCreateRequest = z.infer<typeof WebhookEndpointCreateRequestSchema>
