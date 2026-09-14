import test from "node:test"
import assert from "node:assert/strict"
import {
  AGENT_STATUS_LABELS,
  RISK_LEVEL_LABELS,
  INTEL_STATUS_LABELS,
  THREAT_LEVEL_LABELS,
  INTEL_CLASSIFICATION_LABELS,
  OPERATION_STATUS_LABELS,
  PRIORITY_LEVEL_LABELS,
  SYSTEM_STATUS_LABELS,
  SYSTEM_TYPE_LABELS,
  getAgentStatusBadgeClass,
  getAgentStatusDotClass,
  getRiskBadgeClass,
  getThreatBadgeClass,
  getClassificationBadgeClass,
  getIntelStatusBadgeClass,
  getOperationStatusBadgeClass,
  getPriorityBadgeClass,
  getSystemStatusBadgeClass,
  getHealthColorClass,
} from "../lib/status-helpers.ts"

test("status-helpers: labels mapeiam todos os valores sem vazios", () => {
  assert.equal(AGENT_STATUS_LABELS.active, "ATIVO")
  assert.equal(AGENT_STATUS_LABELS.standby, "EM ESPERA")
  assert.equal(AGENT_STATUS_LABELS.training, "TREINAMENTO")
  assert.equal(AGENT_STATUS_LABELS.compromised, "COMPROMETIDO")

  assert.equal(RISK_LEVEL_LABELS.critical, "CRÍTICO")
  assert.equal(RISK_LEVEL_LABELS.high, "ALTO")
  assert.equal(RISK_LEVEL_LABELS.medium, "MÉDIO")
  assert.equal(RISK_LEVEL_LABELS.low, "BAIXO")

  assert.equal(INTEL_STATUS_LABELS.verified, "VERIFICADO")
  assert.equal(INTEL_STATUS_LABELS.pending, "PENDENTE")
  assert.equal(INTEL_STATUS_LABELS.active, "ATIVO")

  assert.equal(THREAT_LEVEL_LABELS.critical, "CRÍTICO")
  assert.equal(THREAT_LEVEL_LABELS.high, "ALTO")
  assert.equal(THREAT_LEVEL_LABELS.medium, "MÉDIO")
  assert.equal(THREAT_LEVEL_LABELS.low, "BAIXO")

  assert.equal(INTEL_CLASSIFICATION_LABELS["top-secret"], "ULTRA SECRETO")
  assert.equal(INTEL_CLASSIFICATION_LABELS.secret, "SECRETO")
  assert.equal(INTEL_CLASSIFICATION_LABELS.confidential, "CONFIDENCIAL")
  assert.equal(INTEL_CLASSIFICATION_LABELS.restricted, "RESTRITO")

  assert.equal(OPERATION_STATUS_LABELS.active, "ATIVO")
  assert.equal(OPERATION_STATUS_LABELS.planning, "PLANEJAMENTO")
  assert.equal(OPERATION_STATUS_LABELS.completed, "CONCLUÍDO")
  assert.equal(OPERATION_STATUS_LABELS.compromised, "COMPROMETIDO")

  assert.equal(PRIORITY_LEVEL_LABELS.critical, "CRÍTICO")
  assert.equal(PRIORITY_LEVEL_LABELS.high, "ALTO")

  assert.equal(SYSTEM_STATUS_LABELS.online, "ONLINE")
  assert.equal(SYSTEM_STATUS_LABELS.warning, "AVISO")
  assert.equal(SYSTEM_STATUS_LABELS.maintenance, "MANUTENÇÃO")
  assert.equal(SYSTEM_STATUS_LABELS.offline, "OFFLINE")

  assert.equal(SYSTEM_TYPE_LABELS["neural-core"], "Núcleo Neural")
  assert.equal(SYSTEM_TYPE_LABELS.database, "Banco de Dados")
})

test("status-helpers: classes de badge e dot retornam classes validas", () => {
  assert.match(getAgentStatusBadgeClass("active"), /bg-white\/20/)
  assert.match(getAgentStatusBadgeClass("compromised"), /bg-red-500\/20/)

  assert.equal(getAgentStatusDotClass("active"), "bg-white")
  assert.equal(getAgentStatusDotClass("standby"), "bg-neutral-500")
  assert.equal(getAgentStatusDotClass("training"), "bg-orange-500")
  assert.equal(getAgentStatusDotClass("compromised"), "bg-red-500")

  assert.match(getRiskBadgeClass("critical"), /bg-red-500\/20/)
  assert.match(getThreatBadgeClass("critical"), /bg-red-500\/20/)
  assert.match(getClassificationBadgeClass("top-secret"), /bg-red-500\/20/)
  assert.match(getIntelStatusBadgeClass("verified"), /bg-white\/20/)
  assert.match(getOperationStatusBadgeClass("planning"), /bg-orange-500\/20/)
  assert.match(getPriorityBadgeClass("low"), /bg-white\/20/)
  assert.match(getSystemStatusBadgeClass("warning"), /bg-orange-500\/20/)
})

test("status-helpers: calculo de cor de saude baseado em thresholds", () => {
  assert.equal(getHealthColorClass(100), "text-white")
  assert.equal(getHealthColorClass(90), "text-white")
  assert.equal(getHealthColorClass(89), "text-orange-500")
  assert.equal(getHealthColorClass(70), "text-orange-500")
  assert.equal(getHealthColorClass(69), "text-red-500")
  assert.equal(getHealthColorClass(0), "text-red-500")
})
