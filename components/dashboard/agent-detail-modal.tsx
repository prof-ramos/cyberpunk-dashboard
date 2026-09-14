"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Agent } from "@/types/agent"
import {
  AGENT_STATUS_LABELS,
  RISK_LEVEL_LABELS,
  getAgentStatusDotClass,
  getRiskBadgeClass,
} from "@/lib/status-helpers"

interface AgentDetailModalProps {
  agent: Agent | null
  onClose: () => void
}

export function AgentDetailModal({ agent, onClose }: AgentDetailModalProps) {
  if (!agent) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="bg-neutral-900 border-neutral-700 w-full max-w-2xl shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <CardTitle className="text-lg font-bold text-white tracking-wider">{agent.name}</CardTitle>
            <p className="text-sm text-neutral-400 font-mono">{agent.id}</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-neutral-400 hover:text-white hover:bg-neutral-800"
            aria-label="Fechar detalhes do agente"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-1">STATUS</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getAgentStatusDotClass(agent.status)}`} />
                <span className="text-sm text-white uppercase tracking-wider font-medium">
                  {AGENT_STATUS_LABELS[agent.status]}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-1">LOCALIZAÇÃO</p>
              <p className="text-sm text-white font-medium">{agent.location}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-1">MISSÕES CONCLUÍDAS</p>
              <p className="text-sm text-white font-mono">{agent.missions}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-1">NÍVEL DE RISCO</p>
              <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider border font-medium ${getRiskBadgeClass(agent.risk)}`}>
                {RISK_LEVEL_LABELS[agent.risk]}
              </span>
            </div>
          </div>
          <div className="flex gap-2 pt-4 border-t border-neutral-800">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Atribuir missão</Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
            >
              Ver histórico
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
            >
              Enviar mensagem
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
