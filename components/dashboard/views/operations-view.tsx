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
import { OperationDetailModal } from "@/components/dashboard/operation-detail-modal"

export function OperationsView() {
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
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OperationDetailModal operation={selectedOperation} onClose={() => setSelectedOperation(null)} />
    </div>
  )
}
