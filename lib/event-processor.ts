import { createClient } from "@/lib/supabase/server"
import type { WebhookEvent } from "./webhook-types"

export interface EventProcessor {
  eventType: string
  process(event: WebhookEvent): Promise<ProcessingResult>
}

export interface ProcessingResult {
  success: boolean
  message?: string
  data?: any
  shouldRetry?: boolean
  retryAfter?: number // seconds
}

export class EventProcessingEngine {
  private processors: Map<string, EventProcessor> = new Map()
  private supabase: any = null

  constructor() {
    this.registerDefaultProcessors()
  }

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  // Register an event processor
  registerProcessor(processor: EventProcessor): void {
    this.processors.set(processor.eventType, processor)
    console.log(`Registered processor for event type: ${processor.eventType}`)
  }

  // Process a single event
  async processEvent(event: WebhookEvent): Promise<ProcessingResult> {
    const processor = this.processors.get(event.event_type)

    if (!processor) {
      // Try wildcard processors
      const wildcardProcessor = this.findWildcardProcessor(event.event_type)
      if (wildcardProcessor) {
        return await wildcardProcessor.process(event)
      }

      return {
        success: false,
        message: `No processor found for event type: ${event.event_type}`,
        shouldRetry: false,
      }
    }

    try {
      const result = await processor.process(event)
      await this.logProcessingResult(event, result)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown processing error"
      const result: ProcessingResult = {
        success: false,
        message: errorMessage,
        shouldRetry: true,
        retryAfter: 60, // Retry after 1 minute
      }
      await this.logProcessingResult(event, result)
      return result
    }
  }

  // Process all unprocessed events
  async processUnprocessedEvents(): Promise<{ processed: number; failed: number; results: any[] }> {
    const supabase = await this.getSupabase()

    const { data: events, error } = await supabase
      .from("webhook_events")
      .select("*")
      .eq("processed", false)
      .order("created_at", { ascending: true })
      .limit(100) // Process in batches

    if (error) {
      throw new Error(`Failed to fetch unprocessed events: ${error.message}`)
    }

    const results = []
    let processed = 0
    let failed = 0

    for (const event of events || []) {
      try {
        const result = await this.processEvent(event)

        if (result.success) {
          await this.markEventProcessed(event.id)
          processed++
        } else {
          if (result.shouldRetry && event.retry_count < 3) {
            await this.scheduleRetry(event, result.retryAfter || 60)
          } else {
            await this.markEventFailed(event.id, result.message || "Processing failed")
            failed++
          }
        }

        results.push({
          event_id: event.id,
          event_type: event.event_type,
          success: result.success,
          message: result.message,
        })
      } catch (error) {
        failed++
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        await this.markEventFailed(event.id, errorMessage)

        results.push({
          event_id: event.id,
          event_type: event.event_type,
          success: false,
          message: errorMessage,
        })
      }
    }

    return { processed, failed, results }
  }

  // Find wildcard processor (e.g., "n8n.*" matches "n8n.workflow_completed")
  private findWildcardProcessor(eventType: string): EventProcessor | null {
    for (const [pattern, processor] of this.processors.entries()) {
      if (pattern.includes("*")) {
        const regex = new RegExp(pattern.replace("*", ".*"))
        if (regex.test(eventType)) {
          return processor
        }
      }
    }
    return null
  }

  // Mark event as processed
  private async markEventProcessed(eventId: string): Promise<void> {
    const supabase = await this.getSupabase()
    await supabase
      .from("webhook_events")
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", eventId)
  }

  // Mark event as failed
  private async markEventFailed(eventId: string, errorMessage: string): Promise<void> {
    const supabase = await this.getSupabase()
    await supabase
      .from("webhook_events")
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        error_message: errorMessage,
      })
      .eq("id", eventId)
  }

  // Schedule event for retry
  private async scheduleRetry(event: WebhookEvent, retryAfter: number): Promise<void> {
    const supabase = await this.getSupabase()
    const retryAt = new Date(Date.now() + retryAfter * 1000)

    await supabase
      .from("webhook_events")
      .update({
        retry_count: (event.retry_count || 0) + 1,
        // You might want to add a retry_at column to your schema
      })
      .eq("id", event.id)
  }

  // Log processing result
  private async logProcessingResult(event: WebhookEvent, result: ProcessingResult): Promise<void> {
    try {
      const supabase = await this.getSupabase()
      await supabase.from("event_processing_logs").insert({
        event_id: event.id,
        event_type: event.event_type,
        success: result.success,
        message: result.message,
        processing_data: result.data,
        processed_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to log processing result:", error)
    }
  }

  // Register default processors
  private registerDefaultProcessors(): void {
    this.registerProcessor(new N8NEventProcessor())
    this.registerProcessor(new PushNotificationProcessor())
    this.registerProcessor(new UserEventProcessor())
    this.registerProcessor(new GenericEventProcessor())
  }
}

// N8N Event Processor
class N8NEventProcessor implements EventProcessor {
  eventType = "n8n.*"

  async process(event: WebhookEvent): Promise<ProcessingResult> {
    console.log(`Processing N8N event: ${event.event_type}`)

    try {
      const { workflow_id, execution_id, ...data } = event.payload

      switch (event.event_type) {
        case "n8n.workflow_started":
          return await this.handleWorkflowStarted(workflow_id, execution_id, data)

        case "n8n.workflow_completed":
          return await this.handleWorkflowCompleted(workflow_id, execution_id, data)

        case "n8n.workflow_failed":
          return await this.handleWorkflowFailed(workflow_id, execution_id, data)

        default:
          return await this.handleGenericN8NEvent(event.event_type, data)
      }
    } catch (error) {
      return {
        success: false,
        message: `N8N processing error: ${error instanceof Error ? error.message : "Unknown error"}`,
        shouldRetry: true,
      }
    }
  }

  private async handleWorkflowStarted(workflowId: string, executionId: string, data: any): Promise<ProcessingResult> {
    // Implement workflow started logic
    console.log(`N8N workflow ${workflowId} started with execution ${executionId}`)

    // Example: Update database, send notifications, etc.
    return {
      success: true,
      message: "Workflow started event processed",
      data: { workflowId, executionId },
    }
  }

  private async handleWorkflowCompleted(workflowId: string, executionId: string, data: any): Promise<ProcessingResult> {
    console.log(`N8N workflow ${workflowId} completed with execution ${executionId}`)

    // Example: Process results, trigger follow-up actions
    return {
      success: true,
      message: "Workflow completed event processed",
      data: { workflowId, executionId, results: data },
    }
  }

  private async handleWorkflowFailed(workflowId: string, executionId: string, data: any): Promise<ProcessingResult> {
    console.log(`N8N workflow ${workflowId} failed with execution ${executionId}`)

    // Example: Log error, send alert, retry logic
    return {
      success: true,
      message: "Workflow failed event processed",
      data: { workflowId, executionId, error: data },
    }
  }

  private async handleGenericN8NEvent(eventType: string, data: any): Promise<ProcessingResult> {
    console.log(`Generic N8N event: ${eventType}`)

    return {
      success: true,
      message: `Generic N8N event ${eventType} processed`,
      data,
    }
  }
}

// Push Notification Processor
class PushNotificationProcessor implements EventProcessor {
  eventType = "push_notification.send"

  async process(event: WebhookEvent): Promise<ProcessingResult> {
    console.log("Processing push notification event")

    try {
      const { title, body, data, target, target_id } = event.payload

      // Here you would integrate with your push notification service
      // Examples: Firebase Cloud Messaging, Apple Push Notification Service, etc.

      const notificationResult = await this.sendPushNotification({
        title,
        body,
        data,
        target,
        target_id,
      })

      return {
        success: true,
        message: "Push notification sent successfully",
        data: notificationResult,
      }
    } catch (error) {
      return {
        success: false,
        message: `Push notification error: ${error instanceof Error ? error.message : "Unknown error"}`,
        shouldRetry: true,
        retryAfter: 30,
      }
    }
  }

  private async sendPushNotification(notification: any): Promise<any> {
    // Mock implementation - replace with actual push service
    console.log("Sending push notification:", notification)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    return {
      notification_id: `notif_${Date.now()}`,
      sent_at: new Date().toISOString(),
      target: notification.target,
    }
  }
}

// User Event Processor
class UserEventProcessor implements EventProcessor {
  eventType = "user.*"

  async process(event: WebhookEvent): Promise<ProcessingResult> {
    console.log(`Processing user event: ${event.event_type}`)

    try {
      switch (event.event_type) {
        case "user.created":
          return await this.handleUserCreated(event.payload)

        case "user.updated":
          return await this.handleUserUpdated(event.payload)

        case "user.deleted":
          return await this.handleUserDeleted(event.payload)

        default:
          return {
            success: true,
            message: `Generic user event ${event.event_type} processed`,
            data: event.payload,
          }
      }
    } catch (error) {
      return {
        success: false,
        message: `User event processing error: ${error instanceof Error ? error.message : "Unknown error"}`,
        shouldRetry: true,
      }
    }
  }

  private async handleUserCreated(data: any): Promise<ProcessingResult> {
    console.log("Handling user created event:", data.user_id)

    // Example: Send welcome email, create user profile, etc.
    return {
      success: true,
      message: "User created event processed",
      data: { user_id: data.user_id },
    }
  }

  private async handleUserUpdated(data: any): Promise<ProcessingResult> {
    console.log("Handling user updated event:", data.user_id)

    // Example: Update caches, sync data, etc.
    return {
      success: true,
      message: "User updated event processed",
      data: { user_id: data.user_id },
    }
  }

  private async handleUserDeleted(data: any): Promise<ProcessingResult> {
    console.log("Handling user deleted event:", data.user_id)

    // Example: Clean up user data, cancel subscriptions, etc.
    return {
      success: true,
      message: "User deleted event processed",
      data: { user_id: data.user_id },
    }
  }
}

// Generic Event Processor (fallback)
class GenericEventProcessor implements EventProcessor {
  eventType = "*"

  async process(event: WebhookEvent): Promise<ProcessingResult> {
    console.log(`Processing generic event: ${event.event_type}`)

    // Basic processing - just log the event
    return {
      success: true,
      message: `Generic event ${event.event_type} processed`,
      data: {
        event_type: event.event_type,
        source: event.source,
        payload_keys: Object.keys(event.payload),
      },
    }
  }
}

// Export singleton instance
export const eventProcessor = new EventProcessingEngine()
