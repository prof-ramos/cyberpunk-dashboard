import type {
  AgentStatus,
  RiskLevel,
  IntelClassification,
  ThreatLevel,
  IntelStatus,
  OperationStatus,
  PriorityLevel,
  SystemStatus,
  SystemType,
} from "@/types"

// Dictionaries
export const AGENT_STATUS_LABELS: Record<AgentStatus, string> = {
  active: "ATIVO",
  standby: "EM ESPERA",
  training: "TREINAMENTO",
  compromised: "COMPROMETIDO",
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  critical: "CRÍTICO",
  high: "ALTO",
  medium: "MÉDIO",
  low: "BAIXO",
}

export const INTEL_STATUS_LABELS: Record<IntelStatus, string> = {
  verified: "VERIFICADO",
  pending: "PENDENTE",
  active: "ATIVO",
}

export const THREAT_LEVEL_LABELS: Record<ThreatLevel, string> = {
  critical: "CRÍTICO",
  high: "ALTO",
  medium: "MÉDIO",
  low: "BAIXO",
}

export const INTEL_CLASSIFICATION_LABELS: Record<IntelClassification, string> = {
  "top-secret": "ULTRA SECRETO",
  secret: "SECRETO",
  confidential: "CONFIDENCIAL",
  restricted: "RESTRITO",
}

export const OPERATION_STATUS_LABELS: Record<OperationStatus, string> = {
  active: "ATIVO",
  planning: "PLANEJAMENTO",
  completed: "CONCLUÍDO",
  compromised: "COMPROMETIDO",
}

export const PRIORITY_LEVEL_LABELS: Record<PriorityLevel, string> = {
  critical: "CRÍTICO",
  high: "ALTO",
  medium: "MÉDIO",
  low: "BAIXO",
}

export const SYSTEM_STATUS_LABELS: Record<SystemStatus, string> = {
  online: "ONLINE",
  warning: "AVISO",
  maintenance: "MANUTENÇÃO",
  offline: "OFFLINE",
}

export const SYSTEM_TYPE_LABELS: Record<SystemType, string> = {
  "neural-core": "Núcleo Neural",
  database: "Banco de Dados",
  defense: "Firewall / Defesa",
  communications: "Rede / Comunicações",
  quantum: "Processamento Quântico",
  surveillance: "Vigilância & IA",
}

// Styling Badge Helpers
export function getAgentStatusBadgeClass(status: AgentStatus): string {
  switch (status) {
    case "active":
      return "bg-white/20 text-white border-white/30"
    case "standby":
      return "bg-neutral-500/20 text-neutral-300 border-neutral-600"
    case "training":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    case "compromised":
      return "bg-red-500/20 text-red-500 border-red-500/30"
  }
}

export function getAgentStatusDotClass(status: AgentStatus): string {
  switch (status) {
    case "active":
      return "bg-white"
    case "standby":
      return "bg-neutral-500"
    case "training":
      return "bg-orange-500"
    case "compromised":
      return "bg-red-500"
  }
}

export function getRiskBadgeClass(risk: RiskLevel): string {
  switch (risk) {
    case "critical":
      return "bg-red-500/20 text-red-500 border-red-500/30"
    case "high":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    case "medium":
      return "bg-neutral-500/20 text-neutral-300 border-neutral-600"
    case "low":
      return "bg-white/20 text-white border-white/30"
  }
}

export function getThreatBadgeClass(threat: ThreatLevel): string {
  return getRiskBadgeClass(threat)
}

export function getClassificationBadgeClass(classification: IntelClassification): string {
  switch (classification) {
    case "top-secret":
      return "bg-red-500/20 text-red-500 border-red-500/30"
    case "secret":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    case "confidential":
      return "bg-neutral-500/20 text-neutral-300 border-neutral-600"
    case "restricted":
      return "bg-white/20 text-white border-white/30"
  }
}

export function getIntelStatusBadgeClass(status: IntelStatus): string {
  switch (status) {
    case "verified":
      return "bg-white/20 text-white border-white/30"
    case "pending":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    case "active":
      return "bg-white/20 text-white border-white/30"
  }
}

export function getOperationStatusBadgeClass(status: OperationStatus): string {
  switch (status) {
    case "active":
      return "bg-white/20 text-white border-white/30"
    case "planning":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    case "completed":
      return "bg-neutral-500/20 text-neutral-300 border-neutral-600"
    case "compromised":
      return "bg-red-500/20 text-red-500 border-red-500/30"
  }
}

export function getPriorityBadgeClass(priority: PriorityLevel): string {
  return getRiskBadgeClass(priority)
}

export function getSystemStatusBadgeClass(status: SystemStatus): string {
  switch (status) {
    case "online":
      return "bg-white/20 text-white border-white/30"
    case "warning":
      return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    case "maintenance":
      return "bg-neutral-500/20 text-neutral-300 border-neutral-600"
    case "offline":
      return "bg-red-500/20 text-red-500 border-red-500/30"
  }
}

export function getHealthColorClass(health: number): string {
  if (health >= 90) return "text-white"
  if (health >= 70) return "text-orange-500"
  return "text-red-500"
}
