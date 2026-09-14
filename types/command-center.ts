export interface ActivityLog {
  id?: string
  time: string
  agent: string
  action: string
  location: string
  target: string | null
}

export interface RiskCategoryStats {
  highRisk: number
  mediumRisk: number
  lowRisk: number
}

export interface MissionStatsSummary {
  successful: RiskCategoryStats
  failed: RiskCategoryStats
}

export interface QuickMetric {
  title: string
  value: string | number
  change: string
  isPositive: boolean
  sparkline?: number[]
}
