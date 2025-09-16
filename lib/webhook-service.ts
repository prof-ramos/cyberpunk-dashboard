import { createClient } from "@/lib/supabase/server"
import type { WebhookEvent, IncomingWebhook, WebhookEndpoint } from "./webhook-types"
import crypto from "crypto"

export class WebhookService {
  private supabase

  constructor() {
    this.supabase = null // Will be initialized per request
  }

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  // Store incoming webhook event
  async storeWebhookEvent(webhook: IncomingWebhook, headers?: Record<string, string>): Promise<WebhookEvent> {
    const supabase = await this.getSupabase()

    const { data, error } = await supabase
      .from("webhook_events")
      .insert({
        event_type: webhook.event_type,
        source: webhook.source,
        payload: webhook.data,
        headers: headers || {},
        processed: false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get unprocessed webhook events
  async getUnprocessedEvents(): Promise<WebhookEvent[]> {
    const supabase = await this.getSupabase()

    const { data, error } = await supabase
      .from("webhook_events")
      .select("*")
      .eq("processed", false)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data || []
  }

  // Mark event as processed
  async markEventProcessed(eventId: string, errorMessage?: string): Promise<void> {
    const supabase = await this.getSupabase()

    const { error } = await supabase
      .from("webhook_events")
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        error_message: errorMessage || null,
      })
      .eq("id", eventId)

    if (error) throw error
  }

  // Validate API key
  async validateApiKey(apiKey: string): Promise<boolean> {
    const supabase = await this.getSupabase()
    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex")

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key_hash", keyHash)
      .eq("is_active", true)
      .single()

    if (error || !data) return false

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false
    }

    // Update last used timestamp
    await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", data.id)

    return true
  }

  // Generate new API key
  async generateApiKey(
    name: string,
    permissions: string[] = [],
    expiresAt?: Date,
  ): Promise<{ key: string; id: string }> {
    const supabase = await this.getSupabase()
    const apiKey = crypto.randomBytes(32).toString("hex")
    const keyHash = crypto.createHash("sha256").update(apiKey).digest("hex")

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        key_name: name,
        key_hash: keyHash,
        permissions,
        expires_at: expiresAt?.toISOString() || null,
      })
      .select("id")
      .single()

    if (error) throw error
    return { key: apiKey, id: data.id }
  }

  // Trigger outgoing webhooks
  async triggerWebhooks(eventType: string, payload: any): Promise<void> {
    const supabase = await this.getSupabase()

    const { data: endpoints, error } = await supabase
      .from("webhook_endpoints")
      .select("*")
      .eq("is_active", true)
      .contains("events", [eventType])

    if (error) throw error

    const promises =
      endpoints?.map(async (endpoint: WebhookEndpoint) => {
        try {
          const webhookPayload = {
            event_type: eventType,
            timestamp: new Date().toISOString(),
            data: payload,
          }

          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "User-Agent": "Webhook-Service/1.0",
          }

          // Add signature if secret is provided
          if (endpoint.secret) {
            const signature = crypto
              .createHmac("sha256", endpoint.secret)
              .update(JSON.stringify(webhookPayload))
              .digest("hex")
            headers["X-Webhook-Signature"] = `sha256=${signature}`
          }

          await fetch(endpoint.url, {
            method: "POST",
            headers,
            body: JSON.stringify(webhookPayload),
          })

          // Update last triggered timestamp
          await supabase
            .from("webhook_endpoints")
            .update({ last_triggered_at: new Date().toISOString() })
            .eq("id", endpoint.id)
        } catch (error) {
          console.error(`Failed to trigger webhook ${endpoint.name}:`, error)
        }
      }) || []

    await Promise.allSettled(promises)
  }
}

export const webhookService = new WebhookService()
