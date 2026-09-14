"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Operation } from "@/types/operation"
import {
  OPERATION_STATUS_LABELS,
  PRIORITY_LEVEL_LABELS,
  getOperationStatusBadgeClass,
  getPriorityBadgeClass,
} from "@/lib/status-helpers"

interface OperationDetailModalProps {
  operation: Operation | null
  onClose: () => void
}

export function OperationDetailModal({ operation, onClose }: OperationDetailModalProps) {
  if (!operation) return null

  return (
    <div className="fixed inset-0 bg-tactical-void/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="bg-tactical-chassis border-tactical-border w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl tactical-chamfer-corner">
        <CardHeader className="flex flex-row items-center justify-between border-b border-tactical-border/60 pb-4">
          <div>
            <CardTitle className="text-base font-display font-bold text-tactical-amber tracking-widest uppercase">
              OPERAÇÃO // {operation.name}
            </CardTitle>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">CODE: {operation.id}</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-neutral-400 hover:text-tactical-amber hover:bg-tactical-chassisMuted h-8 w-8"
            aria-label="Fechar detalhes da operação"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">STATUS DA OPERAÇÃO</h3>
                <div className="flex gap-2">
                  <Badge className={getOperationStatusBadgeClass(operation.status)}>
                    {OPERATION_STATUS_LABELS[operation.status]}
                  </Badge>
                  <Badge className={getPriorityBadgeClass(operation.priority)}>
                    {PRIORITY_LEVEL_LABELS[operation.priority]}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DETALHES DA MISSÃO</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Localização:</span>
                    <span className="text-white">{operation.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Agentes:</span>
                    <span className="text-white font-mono">{operation.agents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Data de início:</span>
                    <span className="text-white font-mono">{operation.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Conclusão prevista:</span>
                    <span className="text-white font-mono">{operation.estimatedCompletion}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">PROGRESSO</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Conclusão</span>
                    <span className="text-white font-mono">{operation.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${operation.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">OBJETIVOS</h3>
                <div className="space-y-2">
                  {operation.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-neutral-300">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DESCRIÇÃO</h3>
            <p className="text-sm text-neutral-300">{operation.description}</p>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-800">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Atualizar status</Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
            >
              Ver relatórios
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
            >
              Atribuir agentes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
