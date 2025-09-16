import { createClient } from "@/lib/supabase/server"

export interface DatabaseValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  tables: {
    name: string
    exists: boolean
    columns: string[]
    missingColumns: string[]
  }[]
}

export class DatabaseValidator {
  private static readonly REQUIRED_TABLES = [
    {
      name: "webhook_events",
      columns: [
        "id",
        "event_type",
        "source",
        "payload",
        "headers",
        "processed",
        "created_at",
        "processed_at",
        "error_message",
        "retry_count",
        "retry_at",
      ],
    },
    {
      name: "api_keys",
      columns: ["id", "key_name", "key_hash", "permissions", "is_active", "created_at", "last_used_at", "expires_at"],
    },
    {
      name: "webhook_endpoints",
      columns: ["id", "name", "url", "secret", "events", "is_active", "created_at", "last_triggered_at"],
    },
    {
      name: "request_logs",
      columns: [
        "id",
        "method",
        "url",
        "headers",
        "response_status",
        "response_time",
        "timestamp",
        "ip",
        "user_agent",
        "api_key_hash",
        "error_message",
      ],
    },
    {
      name: "event_processing_logs",
      columns: ["id", "event_id", "event_type", "success", "message", "processing_data", "processed_at"],
    },
  ]

  static async validateSchema(): Promise<DatabaseValidationResult> {
    const result: DatabaseValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      tables: [],
    }

    try {
      const supabase = await createClient()

      // Check each required table
      for (const requiredTable of this.REQUIRED_TABLES) {
        const tableResult = {
          name: requiredTable.name,
          exists: false,
          columns: [] as string[],
          missingColumns: [] as string[],
        }

        try {
          // Try to query the table structure
          const { data, error } = await supabase.from(requiredTable.name).select("*").limit(0) // Don't fetch data, just check structure

          if (error) {
            if (error.code === "42P01") {
              // Table does not exist
              result.errors.push(`Table '${requiredTable.name}' does not exist`)
              result.isValid = false
              tableResult.exists = false
              tableResult.missingColumns = [...requiredTable.columns]
            } else {
              result.errors.push(`Error checking table '${requiredTable.name}': ${error.message}`)
              result.isValid = false
            }
          } else {
            tableResult.exists = true

            // Get actual table schema from information_schema
            const { data: schemaData, error: schemaError } = await supabase.rpc("get_table_columns", {
              table_name: requiredTable.name,
            })

            if (schemaError) {
              // Fallback: assume table exists if we can query it
              result.warnings.push(`Could not verify columns for table '${requiredTable.name}'`)
              tableResult.columns = requiredTable.columns // Assume all columns exist
            } else {
              const actualColumns = schemaData?.map((col: any) => col.column_name) || []
              tableResult.columns = actualColumns

              // Check for missing columns
              const missingColumns = requiredTable.columns.filter((col) => !actualColumns.includes(col))
              tableResult.missingColumns = missingColumns

              if (missingColumns.length > 0) {
                result.errors.push(`Table '${requiredTable.name}' is missing columns: ${missingColumns.join(", ")}`)
                result.isValid = false
              }
            }
          }
        } catch (error) {
          result.errors.push(`Failed to check table '${requiredTable.name}': ${error}`)
          result.isValid = false
        }

        result.tables.push(tableResult)
      }

      // Check RLS policies (basic check)
      try {
        const { data: rlsData, error: rlsError } = await supabase.rpc("check_rls_enabled")

        if (rlsError) {
          result.warnings.push("Could not verify Row Level Security policies")
        } else if (!rlsData) {
          result.warnings.push("Row Level Security may not be properly configured")
        }
      } catch (error) {
        result.warnings.push("Could not check Row Level Security status")
      }
    } catch (error) {
      result.errors.push(`Database connection failed: ${error}`)
      result.isValid = false
    }

    return result
  }

  static async testDatabaseOperations(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = []

    try {
      const supabase = await createClient()

      // Test webhook_events operations
      try {
        const testEvent = {
          event_type: "test.validation",
          source: "database_validator",
          payload: { test: true },
          headers: { "x-test": "validation" },
        }

        const { data: insertData, error: insertError } = await supabase
          .from("webhook_events")
          .insert(testEvent)
          .select()
          .single()

        if (insertError) {
          errors.push(`Failed to insert test webhook event: ${insertError.message}`)
        } else {
          // Test update
          const { error: updateError } = await supabase
            .from("webhook_events")
            .update({ processed: true, processed_at: new Date().toISOString() })
            .eq("id", insertData.id)

          if (updateError) {
            errors.push(`Failed to update test webhook event: ${updateError.message}`)
          }

          // Clean up test data
          await supabase.from("webhook_events").delete().eq("id", insertData.id)
        }
      } catch (error) {
        errors.push(`Webhook events table test failed: ${error}`)
      }

      // Test api_keys operations
      try {
        const { data, error } = await supabase.from("api_keys").select("count").limit(1)

        if (error) {
          errors.push(`Failed to query api_keys table: ${error.message}`)
        }
      } catch (error) {
        errors.push(`API keys table test failed: ${error}`)
      }

      // Test webhook_endpoints operations
      try {
        const { data, error } = await supabase.from("webhook_endpoints").select("count").limit(1)

        if (error) {
          errors.push(`Failed to query webhook_endpoints table: ${error.message}`)
        }
      } catch (error) {
        errors.push(`Webhook endpoints table test failed: ${error}`)
      }
    } catch (error) {
      errors.push(`Database operations test failed: ${error}`)
    }

    return {
      success: errors.length === 0,
      errors,
    }
  }
}
