import type { ComponentType } from "react"

export type DashboardTab =
  | "command-center"
  | "agent-network"
  | "operations"
  | "intelligence"
  | "systems"

export interface NavItem {
  id: DashboardTab
  icon: ComponentType<{ className?: string }>
  label: string
}

export interface NetworkHealth {
  status: "online" | "degraded" | "offline"
  network: string
  uptime: string
  activeAgents: number
}
