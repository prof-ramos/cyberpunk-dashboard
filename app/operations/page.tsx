"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, MapPin, Clock, Users, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { INITIAL_OPERATIONS } from "@/data/operations"
import type { Operation, OperationStatus } from "@/types/operation"
import {
  OPERATION_STATUS_LABELS,
  PRIORITY_LEVEL_LABELS,
  getOperationStatusBadgeClass,
  getPriorityBadgeClass,
} from "@/lib/status-helpers"

export default function OperationsPage() {
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)

  const getStatusIcon = (status: OperationStatus) => {
    switch (status) {
      case "active":
        return <Target className="w-4 h-4 text-white" />
      case "planning":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-white" />
      case "compromised":
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CENTRAL DE OPERAÇÕES</h1>
          <p className="text-sm text-neutral-400">Planejamento e supervisão de execução de missões</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Nova operação</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Briefing da missão</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">OPS ATIVAS</p>
                <p className="text-2xl font-bold text-white font-mono">23</p>
              </div>
              <Target className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">CONCLUÍDAS</p>
                <p className="text-2xl font-bold text-white font-mono">156</p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">COMPROMETIDAS</p>
                <p className="text-2xl font-bold text-red-500 font-mono">2</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TAXA DE SUCESSO</p>
                <p className="text-2xl font-bold text-white font-mono">94%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {INITIAL_OPERATIONS.map((operation) => (
          <Card
            key={operation.id}
            className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedOperation(operation)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white tracking-wider">{operation.name}</CardTitle>
                  <p className="text-xs text-neutral-400 font-mono">{operation.id}</p>
                </div>
                <div className="flex items-center gap-2">{getStatusIcon(operation.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getOperationStatusBadgeClass(operation.status)}>
                  {OPERATION_STATUS_LABELS[operation.status]}
                </Badge>
                <Badge className={getPriorityBadgeClass(operation.priority)}>
                  {PRIORITY_LEVEL_LABELS[operation.priority]}
                </Badge>
              </div>

              <p className="text-sm text-neutral-300">{operation.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <MapPin className="w-3 h-3" />
                  <span>{operation.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Users className="w-3 h-3" />
                  <span>{operation.agents} agentes designados</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span>Conclusão prevista: {operation.estimatedCompletion}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">Progresso</span>
                  <span className="text-white font-mono">{operation.progress}%</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${operation.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Operation Detail Modal */}
      {selectedOperation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedOperation.name}</CardTitle>
                <p className="text-sm text-neutral-400 font-mono">{selectedOperation.id}</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedOperation(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">STATUS DA OPERAÇÃO</h3>
                    <div className="flex gap-2">
                      <Badge className={getOperationStatusBadgeClass(selectedOperation.status)}>
                        {OPERATION_STATUS_LABELS[selectedOperation.status]}
                      </Badge>
                      <Badge className={getPriorityBadgeClass(selectedOperation.priority)}>
                        {PRIORITY_LEVEL_LABELS[selectedOperation.priority]}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DETALHES DA MISSÃO</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Localização:</span>
                        <span className="text-white">{selectedOperation.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Agentes:</span>
                        <span className="text-white font-mono">{selectedOperation.agents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Data de início:</span>
                        <span className="text-white font-mono">{selectedOperation.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Conclusão prevista:</span>
                        <span className="text-white font-mono">{selectedOperation.estimatedCompletion}</span>
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
                        <span className="text-white font-mono">{selectedOperation.progress}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-3">
                        <div
                          className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedOperation.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">OBJETIVOS</h3>
                    <div className="space-y-2">
                      {selectedOperation.objectives.map((objective, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-neutral-300">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DESCRIÇÃO</h3>
                <p className="text-sm text-neutral-300">{selectedOperation.description}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Atualizar status</Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Ver relatórios
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Atribuir agentes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
