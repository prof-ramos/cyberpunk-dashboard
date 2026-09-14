export type SystemStatus = "online" | "warning" | "maintenance" | "offline"

export type SystemType =
  | "neural-core"
  | "surveillance"
  | "defense"
  | "quantum"
  | "communications"
  | "database"

export interface SystemNode {
  id: string
  name: string
  type: SystemType
  status: SystemStatus
  health: number
  cpu: number
  memory: number
  storage: number
  uptime: string
  location: string
  lastMaintenance: string
}

export interface SystemFilter {
  searchTerm: string
  type?: SystemType | "all"
  status?: SystemStatus | "all"
}
