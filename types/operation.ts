export type OperationStatus = "active" | "planning" | "completed" | "compromised"

export type PriorityLevel = "critical" | "high" | "medium" | "low"

export interface Operation {
  id: string
  name: string
  status: OperationStatus
  priority: PriorityLevel
  location: string
  agents: number
  progress: number
  startDate: string
  estimatedCompletion: string
  description: string
  objectives: string[]
}

export interface OperationFilter {
  searchTerm: string
  status?: OperationStatus | "all"
  priority?: PriorityLevel | "all"
}
