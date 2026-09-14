export type IntelClassification = "top-secret" | "secret" | "confidential" | "restricted"

export type ThreatLevel = "critical" | "high" | "medium" | "low"

export type IntelStatus = "verified" | "pending" | "active"

export interface IntelReport {
  id: string
  title: string
  classification: IntelClassification
  source: string
  location: string
  date: string
  status: IntelStatus
  threat: ThreatLevel
  summary: string
  tags: string[]
}

export interface IntelFilter {
  searchTerm: string
  classification?: IntelClassification | "all"
  threat?: ThreatLevel | "all"
  status?: IntelStatus | "all"
}
