import test from "node:test"
import assert from "node:assert/strict"
import { INITIAL_AGENTS } from "../data/agents.ts"
import { INITIAL_INTEL_REPORTS } from "../data/intelligence.ts"
import { INITIAL_SYSTEMS } from "../data/systems.ts"

test("domain-filtering: busca de agentes por nome, ID ou localidade", () => {
  const searchByName = (query: string) =>
    INITIAL_AGENTS.filter(
      (a) =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.id.toLowerCase().includes(query.toLowerCase()) ||
        a.location.toLowerCase().includes(query.toLowerCase())
    )

  const tokyoAgents = searchByName("tokyo")
  assert.equal(tokyoAgents.length, 1)
  assert.equal(tokyoAgents[0].name, "OBSIDIAN SENTINEL")

  const idSearch = searchByName("G-081Z")
  assert.equal(idSearch.length, 1)
  assert.equal(idSearch[0].status, "compromised")

  const emptyResult = searchByName("Atlantis")
  assert.equal(emptyResult.length, 0)
})

test("domain-filtering: busca de relatorios por tags e termos de busca", () => {
  const searchReports = (query: string) =>
    INITIAL_INTEL_REPORTS.filter(
      (r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.id.toLowerCase().includes(query.toLowerCase()) ||
        r.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    )

  const cyberReports = searchReports("cibernéticos")
  assert.ok(cyberReports.length >= 1)
  assert.equal(cyberReports[0].id, "INT-2025-001")

  const humintReports = INITIAL_INTEL_REPORTS.filter((r) => r.source === "HUMINT")
  assert.equal(humintReports.length, 2)
})

test("domain-filtering: agregacao de status e saude dos sistemas", () => {
  const onlineCount = INITIAL_SYSTEMS.filter((s) => s.status === "online").length
  const warningCount = INITIAL_SYSTEMS.filter((s) => s.status === "warning").length
  const maintenanceCount = INITIAL_SYSTEMS.filter((s) => s.status === "maintenance").length

  assert.ok(onlineCount >= 4)
  assert.equal(warningCount, 1)
  assert.equal(maintenanceCount, 1)

  const avgHealth = INITIAL_SYSTEMS.reduce((sum, s) => sum + s.health, 0) / INITIAL_SYSTEMS.length
  assert.ok(avgHealth > 80, `Media de saude esperada > 80, obtida: ${avgHealth}`)
})
