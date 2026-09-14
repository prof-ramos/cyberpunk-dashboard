"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreHorizontal, MapPin, Clock, UserPlus } from "lucide-react"
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
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Localizar ativo por codinome, ID ou setor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-tactical-void border-tactical-border text-white placeholder-neutral-500 focus:border-tactical-amber font-mono text-xs"
            />
          </div>
          <Button
            variant="outline"
            className="border-tactical-border text-neutral-400 hover:bg-tactical-chassisMuted hover:text-white bg-tactical-void text-xs font-mono"
          >
            <Filter className="w-3.5 h-3.5 mr-2 text-tactical-amber" />
            PARÂMETROS
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="bg-tactical-amber hover:bg-tactical-amberGlow text-black font-display font-bold tracking-wider text-xs tactical-chamfer-button shadow-[0_0_12px_rgba(255,159,28,0.3)]">
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            CADASTRAR ATIVO DE CAMPO
          </Button>
        </div>
      </div>

      {/* Agents Table */}
      <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner shadow-lg">
        <CardHeader className="pb-3 border-b border-tactical-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-display font-bold text-tactical-amber tracking-widest uppercase">
              REDE DE ATIVOS DE OPERAÇÃO ({filteredAgents.length})
            </CardTitle>
            <span className="text-[10px] text-neutral-500 font-mono">CANAL SEGURO: OK</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-tactical-border text-[11px] font-display tracking-wider text-neutral-400 uppercase">
                  <th className="py-3 px-4">CODINOME / ID</th>
                  <th className="py-3 px-4">IDENTIDADE</th>
                  <th className="py-3 px-4">ESTADO</th>
                  <th className="py-3 px-4">SETOR</th>
                  <th className="py-3 px-4">ÚLTIMO CHECK-IN</th>
                  <th className="py-3 px-4">MISSÕES</th>
                  <th className="py-3 px-4">ÍNDICE DE RISCO</th>
                  <th className="py-3 px-4 text-right">TELEMETRIA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tactical-border/40 font-mono">
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.id}
                    className="hover:bg-tactical-chassisMuted/60 transition-colors cursor-pointer text-xs"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <td className="py-3 px-4 font-bold text-tactical-amber">{agent.id}</td>
                    <td className="py-3 px-4 font-sans font-medium text-white">{agent.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getAgentStatusDotClass(agent.status)}`} />
                        <span className="text-[11px] text-neutral-300 uppercase tracking-wider">
                          {AGENT_STATUS_LABELS[agent.status]}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span>{agent.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>{agent.lastSeen}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{agent.missions}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border ${getRiskBadgeClass(
                          agent.risk
                        )}`}
                      >
                        {RISK_LEVEL_LABELS[agent.risk]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-neutral-400 hover:text-tactical-amber hover:bg-tactical-void"
                      >
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
