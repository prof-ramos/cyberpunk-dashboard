"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreHorizontal, MapPin, Clock } from "lucide-react"
import { INITIAL_AGENTS } from "@/data/agents"
import type { Agent } from "@/types/agent"
import {
  AGENT_STATUS_LABELS,
  RISK_LEVEL_LABELS,
  getAgentStatusDotClass,
  getRiskBadgeClass,
} from "@/lib/status-helpers"
import { AgentDetailModal } from "@/components/dashboard/agent-detail-modal"

export function AgentNetworkView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const filteredAgents = INITIAL_AGENTS.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Buscar agentes por nome, ID ou localização..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500 focus:border-orange-500"
            />
          </div>
          <Button
            variant="outline"
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Novo Agente</Button>
        </div>
      </div>

      {/* Agents Table */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
            REDE DE AGENTES ATIVOS ({filteredAgents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 text-left">
                  <th className="py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">ID</th>
                  <th className="py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">NOME</th>
                  <th className="py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">STATUS</th>
                  <th className="py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">LOCALIZAÇÃO</th>
                  <th className="py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">VISTO POR ÚLTIMO</th>
                  <th className="py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">MISSÕES</th>
                  <th className="py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">RISCO</th>
                  <th className="py-3 px-4 text-xs font-medium text-neutral-400 tracking-wider">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent, index) => (
                  <tr
                    key={agent.id}
                    className={`border-b border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer ${
                      index % 2 === 0 ? "bg-neutral-900" : "bg-neutral-850"
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <td className="py-3 px-4 text-sm text-white font-mono">{agent.id}</td>
                    <td className="py-3 px-4 text-sm text-white">{agent.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getAgentStatusDotClass(agent.status)}`} />
                        <span className="text-xs text-neutral-300 uppercase tracking-wider">
                          {AGENT_STATUS_LABELS[agent.status]}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span className="text-sm text-neutral-300">{agent.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span className="text-sm text-neutral-300 font-mono">{agent.lastSeen}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-white font-mono">{agent.missions}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider border font-medium ${getRiskBadgeClass(agent.risk)}`}>
                        {RISK_LEVEL_LABELS[agent.risk]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  )
}
