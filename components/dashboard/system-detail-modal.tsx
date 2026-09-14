"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SystemNode } from "@/types/system"
import {
  SYSTEM_STATUS_LABELS,
  SYSTEM_TYPE_LABELS,
  getSystemStatusBadgeClass,
  getHealthColorClass,
} from "@/lib/status-helpers"

interface SystemDetailModalProps {
  system: SystemNode | null
  onClose: () => void
}

export function SystemDetailModal({ system, onClose }: SystemDetailModalProps) {
  if (!system) return null

  return (
    <div className="fixed inset-0 bg-tactical-void/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="bg-tactical-chassis border-tactical-border w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl tactical-chamfer-corner">
        <CardHeader className="flex flex-row items-center justify-between border-b border-tactical-border/60 pb-4">
          <div>
            <CardTitle className="text-base font-display font-bold text-tactical-amber tracking-widest uppercase">
              NÓ DE SISTEMA // {system.name}
            </CardTitle>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              {system.id} • {SYSTEM_TYPE_LABELS[system.type]}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-neutral-400 hover:text-tactical-amber hover:bg-tactical-chassisMuted h-8 w-8"
            aria-label="Fechar detalhes do sistema"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">STATUS DO SISTEMA</h3>
                <div className="flex items-center gap-2">
                  <Badge className={getSystemStatusBadgeClass(system.status)}>
                    {SYSTEM_STATUS_LABELS[system.status]}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">INFORMAÇÕES DO SISTEMA</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Localização:</span>
                    <span className="text-white">{system.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Tempo de atividade:</span>
                    <span className="text-white font-mono">{system.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Última manutenção:</span>
                    <span className="text-white font-mono">{system.lastMaintenance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Índice de saúde:</span>
                    <span className={`font-mono ${getHealthColorClass(system.health)}`}>
                      {system.health}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">USO DE RECURSOS</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-400">Uso de CPU</span>
                      <span className="text-white font-mono">{system.cpu}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${system.cpu}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-400">Uso de memória</span>
                      <span className="text-white font-mono">{system.memory}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${system.memory}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-400">Uso de armazenamento</span>
                      <span className="text-white font-mono">{system.storage}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${system.storage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-800">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Reiniciar sistema</Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
            >
              Ver logs
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
            >
              Agendar manutenção
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
