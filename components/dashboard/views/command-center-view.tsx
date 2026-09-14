"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { INITIAL_ACTIVITY_LOGS, INITIAL_AGENTS, INITIAL_MISSION_STATS } from "@/data"
import { getAgentStatusDotClass } from "@/lib/status-helpers"

export function CommandCenterView() {
  const topAgents = INITIAL_AGENTS.slice(0, 4)

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Status Overview */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ALOCAÇÃO DE AGENTES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">190</div>
                <div className="text-xs text-neutral-500">Em campo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">990</div>
                <div className="text-xs text-neutral-500">Encoberto</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">290</div>
                <div className="text-xs text-neutral-500">Treinamento</div>
              </div>
            </div>

            <div className="space-y-2">
              {topAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getAgentStatusDotClass(agent.status)}`} />
                    <div>
                      <div className="text-xs text-white font-mono">{agent.id}</div>
                      <div className="text-xs text-neutral-500">{agent.name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">REGISTRO DE ATIVIDADES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {INITIAL_ACTIVITY_LOGS.map((log, index) => (
                <div
                  key={index}
                  className="text-xs border-l-2 border-orange-500 pl-3 hover:bg-neutral-800 p-2 rounded transition-colors"
                >
                  <div className="text-neutral-500 font-mono">{log.time}</div>
                  <div className="text-white">
                    Agente <span className="text-orange-500 font-mono">{log.agent}</span> {log.action}{" "}
                    <span className="text-white font-mono">{log.location}</span>
                    {log.target && (
                      <span>
                        {" "}
                        com o agente <span className="text-orange-500 font-mono">{log.target}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Encrypted Chat Activity */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              ATIVIDADE DE CHAT CRIPTOGRAFADO
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 border-2 border-white rounded-full opacity-60 animate-pulse" />
              <div className="absolute inset-2 border border-white rounded-full opacity-40" />
              <div className="absolute inset-4 border border-white rounded-full opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-white opacity-30" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-full bg-white opacity-30" />
              </div>
            </div>

            <div className="text-xs text-neutral-500 space-y-1 w-full font-mono">
              <div className="flex justify-between">
                <span># 2025-06-17 14:23 UTC</span>
              </div>
              <div className="text-white">{"> [AGT:gh0stfire] ::: INIT >> ^^^ loading secure channel"}</div>
              <div className="text-orange-500">{"> CH#2 | 1231.9082464.500...xR3"}</div>
              <div className="text-white">{"> KEY LOCKED"}</div>
              <div className="text-neutral-400">
                {'> MSG >> "...mission override initiated... awaiting delta node clearance"'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Activity Chart */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              VISÃO GERAL DE ATIVIDADES DE MISSÃO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-neutral-700" />
                ))}
              </div>

              <svg className="absolute inset-0 w-full h-full">
                <polyline
                  points="0,120 50,100 100,110 150,90 200,95 250,85 300,100 350,80"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                />
                <polyline
                  points="0,140 50,135 100,130 150,125 200,130 250,135 300,125 350,120"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              </svg>

              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500 -ml-5 font-mono">
                <span>500</span>
                <span>400</span>
                <span>300</span>
                <span>200</span>
              </div>

              <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-neutral-500 -mb-6 font-mono">
                <span>28 Jan 2025</span>
                <span>28 Fev 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Information */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">INFORMAÇÕES DA MISSÃO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-xs text-white font-medium">Missões bem-sucedidas</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Missão de risco alto</span>
                    <span className="text-white font-bold font-mono">{INITIAL_MISSION_STATS.successful.highRisk}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Missão de risco médio</span>
                    <span className="text-white font-bold font-mono">{INITIAL_MISSION_STATS.successful.mediumRisk}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Missão de risco baixo</span>
                    <span className="text-white font-bold font-mono">{INITIAL_MISSION_STATS.successful.lowRisk}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-xs text-red-500 font-medium">Missões falhas</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Missão de risco alto</span>
                    <span className="text-white font-bold font-mono">{INITIAL_MISSION_STATS.failed.highRisk}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Missão de risco médio</span>
                    <span className="text-white font-bold font-mono">{INITIAL_MISSION_STATS.failed.mediumRisk}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Missão de risco baixo</span>
                    <span className="text-white font-bold font-mono">{INITIAL_MISSION_STATS.failed.lowRisk}</span>
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
