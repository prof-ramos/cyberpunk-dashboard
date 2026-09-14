"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, MapPin, Clock, Users, AlertTriangle, CheckCircle, XCircle, PlusCircle, Radio } from "lucide-react"
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
        return <Target className="w-4 h-4 text-tactical-amber" />
      case "planning":
        return <Clock className="w-4 h-4 text-tactical-cyan" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-tactical-emerald" />
      case "compromised":
        return <XCircle className="w-4 h-4 text-tactical-crimson" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-tactical-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-tactical-amber inline-block rotate-45" />
            <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">
              DIRETRIZ DE OPERAÇÕES & MISSÕES TÁTICAS
            </h1>
          </div>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            DESPACHO DE ATIVOS EM CAMPO // PROTOCOLOS DE INTERVENÇÃO
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-tactical-amber hover:bg-tactical-amberGlow text-black font-display font-bold text-xs tracking-wider tactical-chamfer-button shadow-[0_0_12px_rgba(255,159,28,0.3)]">
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            DISPARAR OPERAÇÃO
          </Button>
          <Button
            variant="outline"
            className="border-tactical-border text-neutral-300 hover:bg-tactical-chassisMuted bg-tactical-void text-xs font-mono"
          >
            <Radio className="w-3.5 h-3.5 mr-1.5 text-tactical-cyan" />
            TRANSMISSÃO DE BRIEFING
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">OPERAÇÕES ATIVAS</p>
                <p className="text-2xl font-bold text-tactical-amber font-mono mt-0.5">23</p>
              </div>
              <Target className="w-6 h-6 text-tactical-amber" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">MISSÕES CONCLUÍDAS</p>
                <p className="text-2xl font-bold text-tactical-emerald font-mono mt-0.5">156</p>
              </div>
              <CheckCircle className="w-6 h-6 text-tactical-emerald" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">COMPROMETIDAS</p>
                <p className="text-2xl font-bold text-tactical-crimson font-mono mt-0.5">2</p>
              </div>
              <XCircle className="w-6 h-6 text-tactical-crimson" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">TAXA DE ÊXITO</p>
                <p className="text-2xl font-bold text-tactical-cyan font-mono mt-0.5">94%</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-tactical-cyan" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {INITIAL_OPERATIONS.map((operation) => (
          <Card
            key={operation.id}
            className="bg-tactical-chassis border-tactical-border hover:border-tactical-amber/60 transition-all duration-200 cursor-pointer tactical-chamfer-corner shadow-md group"
            onClick={() => setSelectedOperation(operation)}
          >
            <CardHeader className="pb-3 border-b border-tactical-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xs font-display font-bold text-white tracking-wider group-hover:text-tactical-amber transition-colors">
                    {operation.name}
                  </CardTitle>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">CODE: {operation.id}</p>
                </div>
                <div className="flex items-center gap-2">{getStatusIcon(operation.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-3.5">
              <div className="flex gap-2">
                <Badge className={`text-[10px] font-mono uppercase tracking-wider ${getOperationStatusBadgeClass(operation.status)}`}>
                  {OPERATION_STATUS_LABELS[operation.status]}
                </Badge>
                <Badge className={`text-[10px] font-mono uppercase tracking-wider ${getPriorityBadgeClass(operation.priority)}`}>
                  {PRIORITY_LEVEL_LABELS[operation.priority]}
                </Badge>
              </div>

              <p className="text-xs text-neutral-300 font-sans leading-relaxed">{operation.description}</p>

              <div className="space-y-1.5 text-[11px] font-mono text-neutral-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{operation.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{operation.agents} ativos de campo vinculados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Estimativa: {operation.estimatedCompletion}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-tactical-border/40">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-neutral-500">PROGRESSO OPERACIONAL</span>
                  <span className="text-tactical-amber font-bold">{operation.progress}%</span>
                </div>
                <div className="w-full bg-tactical-void rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-tactical-amber h-full transition-all duration-300"
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
