import { eventProcessor } from "./event-processor"

export class BackgroundJobRunner {
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  // Start background job processing
  start(intervalMs = 30000): void {
    if (this.isRunning) {
      console.log("Background job runner is already running")
      return
    }

    this.isRunning = true
    console.log(`Starting background job runner with ${intervalMs}ms interval`)

    this.intervalId = setInterval(async () => {
      try {
        await this.processJobs()
      } catch (error) {
        console.error("Background job processing error:", error)
      }
    }, intervalMs)
  }

  // Stop background job processing
  stop(): void {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    console.log("Background job runner stopped")
  }

  // Process pending jobs
  private async processJobs(): Promise<void> {
    console.log("Processing background jobs...")

    try {
      // Process unprocessed webhook events
      const result = await eventProcessor.processUnprocessedEvents()

      if (result.processed > 0 || result.failed > 0) {
        console.log(`Processed ${result.processed} events, ${result.failed} failed`)
      }

      // Clean up old processed events (optional)
      await this.cleanupOldEvents()

      // Process any other background tasks
      await this.processScheduledTasks()
    } catch (error) {
      console.error("Job processing error:", error)
    }
  }

  // Clean up old processed events
  private async cleanupOldEvents(): Promise<void> {
    try {
      const supabase = await require("@/lib/supabase/server").createClient()

      // Delete processed events older than 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      const { error } = await supabase
        .from("webhook_events")
        .delete()
        .eq("processed", true)
        .lt("processed_at", thirtyDaysAgo)

      if (error) {
        console.error("Cleanup error:", error)
      }
    } catch (error) {
      console.error("Event cleanup error:", error)
    }
  }

  // Process scheduled tasks
  private async processScheduledTasks(): Promise<void> {
    // Add any scheduled tasks here
    // Examples: sending digest emails, generating reports, etc.
  }
}

// Export singleton instance
export const backgroundJobRunner = new BackgroundJobRunner()

// Auto-start in production (you might want to control this differently)
if (process.env.NODE_ENV === "production" && process.env.ENABLE_BACKGROUND_JOBS === "true") {
  backgroundJobRunner.start()
}
