export type AgentStatus = "active" | "standby" | "training" | "compromised"

export type RiskLevel = "critical" | "high" | "medium" | "low"

export interface Agent {
  id: string
  name: string
  status: AgentStatus
  location: string
  lastSeen: string
  missions: number
  risk: RiskLevel
}

export interface AgentFilter {
  searchTerm: string
  status?: AgentStatus | "all"
  risk?: RiskLevel | "all"
}
