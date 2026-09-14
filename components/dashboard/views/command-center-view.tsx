"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { INITIAL_ACTIVITY_LOGS, INITIAL_AGENTS, INITIAL_MISSION_STATS } from "@/data"
import { getAgentStatusDotClass } from "@/lib/status-helpers"
import { TopologicalNodeGrid } from "@/components/dashboard/topological-node-grid"
import { TacticalTelemetryStream } from "@/components/dashboard/tactical-telemetry-stream"
import { Radio, Activity, ShieldAlert, Cpu } from "lucide-react"

export function CommandCenterView() {
  const topAgents = INITIAL_AGENTS.slice(0, 4)

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner / System Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-tactical-chassis/80 border-l-4 border-tactical-amber border-y border-r border-tactical-border tactical-chamfer">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-tactical-amber/10 text-tactical-amber rounded">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-display font-bold tracking-widest text-white uppercase">
              MATRIZ DE COMANDO // PROTOCOLO DE DEFESA ATIVO
            </div>
            <div className="text-[10px] text-neutral-500 font-mono">
              SESSÃO CRIPTOGRAFADA: ED25519-SHA512 // TERMINAL #09-BRAVO
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">TAXA DE INFILTRAÇÃO:</span>
            <span className="text-tactical-cyan font-bold">98.4%</span>
          </div>
          <div className="hidden sm:block text-neutral-600">|</div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-neutral-500">AMEAÇA AMBIENTAL:</span>
            <span className="text-tactical-amber font-bold">DEFCON-3</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Status Overview */}
        <Card className="lg:col-span-4 bg-tactical-chassis border-tactical-border tactical-chamfer-corner shadow-lg">
          <CardHeader className="pb-3 border-b border-tactical-border/60">
            <CardTitle className="text-xs font-display font-bold text-tactical-amber tracking-widest uppercase flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              ALOCAÇÃO DE FORÇAS EM CAMPO
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-tactical-void/70 border border-tactical-border/70 rounded-sm">
              <div className="text-center">
                <div className="text-xl font-bold text-white font-mono">190</div>
                <div className="text-[10px] text-neutral-500 font-mono uppercase">Em campo</div>
              </div>
              <div className="text-center border-x border-tactical-border/60">
                <div className="text-xl font-bold text-tactical-cyan font-mono">990</div>
                <div className="text-[10px] text-neutral-500 font-mono uppercase">Encoberto</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-neutral-400 font-mono">290</div>
                <div className="text-[10px] text-neutral-500 font-mono uppercase">Treinamento</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] text-neutral-500 font-mono tracking-wider mb-1 uppercase">
                ATIVOS PRIORITÁRIOS
              </div>
              {topAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-2 bg-tactical-void/60 border border-tactical-border/50 hover:border-tactical-amber/50 rounded-sm transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${getAgentStatusDotClass(agent.status)}`} />
                    <div>
                      <div className="text-xs text-white font-mono font-bold">{agent.id}</div>
                      <div className="text-[10px] text-neutral-500">{agent.name}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10px]">
                    <span className="text-neutral-400">{agent.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="lg:col-span-4 bg-tactical-chassis border-tactical-border tactical-chamfer-corner shadow-lg">
          <CardHeader className="pb-3 border-b border-tactical-border/60">
            <CardTitle className="text-xs font-display font-bold text-tactical-amber tracking-widest uppercase flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              FEED DE OPERAÇÕES EM TEMPO REAL
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {INITIAL_ACTIVITY_LOGS.map((log, index) => (
                <div
                  key={index}
                  className="text-xs border-l-2 border-tactical-amber pl-3 bg-tactical-void/40 hover:bg-tactical-chassisMuted p-2 transition-colors rounded-r-sm"
                >
                  <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                    <span>{log.time}</span>
                    <span className="text-tactical-cyan">SEC//LOG</span>
                  </div>
                  <div className="text-neutral-200 mt-0.5 text-[11px] leading-relaxed">
                    Ativo <span className="text-tactical-amber font-mono font-bold">{log.agent}</span> {log.action}{" "}
                    <span className="text-white font-mono font-semibold">{log.location}</span>
                    {log.target && (
                      <span>
                        {" "}com o ativo <span className="text-tactical-amber font-mono font-bold">{log.target}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Signature Element: Topological Node Grid */}
        <Card className="lg:col-span-4 bg-tactical-chassis border-tactical-border tactical-chamfer-corner shadow-lg">
          <CardHeader className="pb-3 border-b border-tactical-border/60">
            <CardTitle className="text-xs font-display font-bold text-tactical-cyan tracking-widest uppercase flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-tactical-cyan" />
              TOPOLOGIA DA MALHA NEURAL
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <TopologicalNodeGrid />
          </CardContent>
        </Card>

        {/* Mission Activity Vector Telemetry Stream */}
        <Card className="lg:col-span-8 bg-tactical-chassis border-tactical-border tactical-chamfer-corner shadow-lg">
          <CardHeader className="pb-3 border-b border-tactical-border/60">
            <CardTitle className="text-xs font-display font-bold text-tactical-amber tracking-widest uppercase">
              VETORES DE DESPACHO E FLUXO TÁTICO (24 HORAS)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <TacticalTelemetryStream />
          </CardContent>
        </Card>

        {/* Mission Information Deck */}
        <Card className="lg:col-span-4 bg-tactical-chassis border-tactical-border tactical-chamfer-corner shadow-lg">
          <CardHeader className="pb-3 border-b border-tactical-border/60">
            <CardTitle className="text-xs font-display font-bold text-tactical-amber tracking-widest uppercase">
              INFORMAÇÕES DE EFICÁCIA OPERACIONAL
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="p-3 bg-tactical-void/80 border border-tactical-border rounded-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-tactical-emerald rounded-full" />
                    <span className="text-xs text-white font-display tracking-wider font-semibold">
                      INCURSÕES CONCLUÍDAS
                    </span>
                  </div>
                  <span className="text-xs text-tactical-emerald font-mono font-bold">
                    {INITIAL_MISSION_STATS.successful.highRisk +
                      INITIAL_MISSION_STATS.successful.mediumRisk +
                      INITIAL_MISSION_STATS.successful.lowRisk}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Risco Alto:</span>
                    <span className="text-white font-bold">{INITIAL_MISSION_STATS.successful.highRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Risco Médio:</span>
                    <span className="text-white font-bold">{INITIAL_MISSION_STATS.successful.mediumRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Risco Baixo:</span>
                    <span className="text-white font-bold">{INITIAL_MISSION_STATS.successful.lowRisk}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-tactical-void/80 border border-tactical-border rounded-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-tactical-crimson rounded-full" />
                    <span className="text-xs text-tactical-crimson font-display tracking-wider font-semibold">
                      ANOMALIAS & RECUOS
                    </span>
                  </div>
                  <span className="text-xs text-tactical-crimson font-mono font-bold">
                    {INITIAL_MISSION_STATS.failed.highRisk +
                      INITIAL_MISSION_STATS.failed.mediumRisk +
                      INITIAL_MISSION_STATS.failed.lowRisk}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Risco Alto:</span>
                    <span className="text-white font-bold">{INITIAL_MISSION_STATS.failed.highRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Risco Médio:</span>
                    <span className="text-white font-bold">{INITIAL_MISSION_STATS.failed.mediumRisk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Risco Baixo:</span>
                    <span className="text-white font-bold">{INITIAL_MISSION_STATS.failed.lowRisk}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
