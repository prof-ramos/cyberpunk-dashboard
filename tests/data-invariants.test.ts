import test from "node:test"
import assert from "node:assert/strict"
import { INITIAL_AGENTS } from "../data/agents.ts"
import { INITIAL_INTEL_REPORTS } from "../data/intelligence.ts"
import { INITIAL_OPERATIONS } from "../data/operations.ts"
import { INITIAL_SYSTEMS } from "../data/systems.ts"
import { INITIAL_ACTIVITY_LOGS, INITIAL_MISSION_STATS, INITIAL_NETWORK_HEALTH } from "../data/command-center.ts"

test("data-invariants: agentes devem possuir IDs unicos e campos consistentes", () => {
  assert.ok(INITIAL_AGENTS.length > 0, "Lista de agentes nao pode ser vazia")
  const ids = new Set<string>()

  for (const agent of INITIAL_AGENTS) {
    assert.match(agent.id, /^G-[0-9]{3}[A-Z]$/, `ID invalido para agente: ${agent.id}`)
    assert.ok(!ids.has(agent.id), `ID duplicado de agente: ${agent.id}`)
    ids.add(agent.id)

    assert.ok(agent.name.length > 0, "Nome do agente nao pode ser vazio")
    assert.ok(agent.missions >= 0, "Contagem de missoes deve ser >= 0")
    assert.ok(["active", "standby", "training", "compromised"].includes(agent.status))
    assert.ok(["critical", "high", "medium", "low"].includes(agent.risk))
  }
})

test("data-invariants: relatorios de inteligencia devem possuir IDs unicos e metadados validos", () => {
  assert.ok(INITIAL_INTEL_REPORTS.length > 0)
  const ids = new Set<string>()

  for (const report of INITIAL_INTEL_REPORTS) {
    assert.match(report.id, /^INT-\d{4}-\d{3}$/, `ID invalido para relatorio: ${report.id}`)
    assert.ok(!ids.has(report.id), `ID duplicado: ${report.id}`)
    ids.add(report.id)

    assert.ok(report.title.length > 0)
    assert.ok(report.summary.length > 10)
    assert.ok(report.tags.length > 0)
    assert.ok(["top-secret", "secret", "confidential", "restricted"].includes(report.classification))
    assert.ok(["critical", "high", "medium", "low"].includes(report.threat))
    assert.ok(["verified", "pending", "active"].includes(report.status))
  }
})

test("data-invariants: operacoes devem ter progresso no intervalo [0, 100] e objetivos", () => {
  assert.ok(INITIAL_OPERATIONS.length > 0)
  const ids = new Set<string>()

  for (const op of INITIAL_OPERATIONS) {
    assert.match(op.id, /^OP-[A-Z]+-\d{3}$/, `ID invalido para operacao: ${op.id}`)
    assert.ok(!ids.has(op.id), `ID duplicado: ${op.id}`)
    ids.add(op.id)

    assert.ok(op.progress >= 0 && op.progress <= 100, `Progresso fora de [0,100]: ${op.progress}`)
    assert.ok(op.agents > 0, "Operacao precisa de ao menos 1 agente")
    assert.ok(op.objectives.length > 0, "Operacao precisa de objetivos definidos")
    assert.ok(["active", "planning", "completed", "compromised"].includes(op.status))
    assert.ok(["critical", "high", "medium", "low"].includes(op.priority))
  }
})

test("data-invariants: sistemas devem ter saude e recursos percentuais validos [0, 100]", () => {
  assert.ok(INITIAL_SYSTEMS.length > 0)
  const ids = new Set<string>()

  for (const sys of INITIAL_SYSTEMS) {
    assert.match(sys.id, /^SYS-\d{3}$/, `ID invalido para sistema: ${sys.id}`)
    assert.ok(!ids.has(sys.id), `ID duplicado: ${sys.id}`)
    ids.add(sys.id)

    assert.ok(sys.health >= 0 && sys.health <= 100, `Saude invalida: ${sys.health}`)
    assert.ok(sys.cpu >= 0 && sys.cpu <= 100, `CPU invalido: ${sys.cpu}`)
    assert.ok(sys.memory >= 0 && sys.memory <= 100, `Memoria invalida: ${sys.memory}`)
    assert.ok(sys.storage >= 0 && sys.storage <= 100, `Storage invalido: ${sys.storage}`)
    assert.ok(["online", "warning", "maintenance", "offline"].includes(sys.status))
  }
})

test("data-invariants: estatisticas da central de comando devem ser coerentes", () => {
  assert.ok(INITIAL_ACTIVITY_LOGS.length > 0)
  for (const log of INITIAL_ACTIVITY_LOGS) {
    assert.ok(log.agent.length > 0)
    assert.ok(log.action.length > 0)
    assert.ok(log.location.length > 0)
  }

  assert.ok(INITIAL_MISSION_STATS.successful.lowRisk > 0)
  assert.ok(INITIAL_NETWORK_HEALTH.activeAgents > 0)
  assert.equal(INITIAL_NETWORK_HEALTH.status, "online")
})
