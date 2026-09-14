"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Server,
  Database,
  Shield,
  Wifi,
  HardDrive,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw,
} from "lucide-react"
import { INITIAL_SYSTEMS } from "@/data/systems"
import type { SystemNode, SystemStatus, SystemType } from "@/types/system"
import {
  SYSTEM_STATUS_LABELS,
  SYSTEM_TYPE_LABELS,
  getSystemStatusBadgeClass,
  getHealthColorClass,
} from "@/lib/status-helpers"
import { SystemDetailModal } from "@/components/dashboard/system-detail-modal"

export function SystemsView() {
  const [selectedSystem, setSelectedSystem] = useState<SystemNode | null>(null)

  const getStatusIcon = (status: SystemStatus) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-3.5 h-3.5 text-tactical-emerald" />
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-tactical-amber" />
      case "maintenance":
        return <Settings className="w-3.5 h-3.5 text-neutral-400" />
      case "offline":
        return <AlertTriangle className="w-3.5 h-3.5 text-tactical-crimson" />
    }
  }

  const getSystemIcon = (type: SystemType) => {
    switch (type) {
      case "neural-core":
        return <Server className="w-5 h-5 text-tactical-amber" />
      case "database":
        return <Database className="w-5 h-5 text-tactical-cyan" />
      case "defense":
        return <Shield className="w-5 h-5 text-tactical-emerald" />
      case "communications":
        return <Wifi className="w-5 h-5 text-white" />
      case "quantum":
        return <HardDrive className="w-5 h-5 text-neutral-400" />
      case "surveillance":
        return <Cpu className="w-5 h-5 text-tactical-amber" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-tactical-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-tactical-cyan inline-block rotate-45" />
            <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">
              MONITOR DE INFRAESTRUTURA & NÓS NEURAIS
            </h1>
          </div>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            STATUS DO RACK DISTRIBUÍDO // TELEMETRIA EM TEMPO REAL
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-tactical-amber hover:bg-tactical-amberGlow text-black font-display font-bold text-xs tracking-wider tactical-chamfer-button shadow-[0_0_12px_rgba(255,159,28,0.3)]">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            DIAGNÓSTICO DA MALHA
          </Button>
          <Button
            variant="outline"
            className="border-tactical-border text-neutral-300 hover:bg-tactical-chassisMuted bg-tactical-void text-xs font-mono"
          >
            CONTENÇÃO DE NÓS
          </Button>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">SISTEMAS ONLINE</p>
                <p className="text-2xl font-bold text-tactical-emerald font-mono mt-0.5">24/26</p>
              </div>
              <CheckCircle className="w-6 h-6 text-tactical-emerald" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">AVISOS DE LATÊNCIA</p>
                <p className="text-2xl font-bold text-tactical-amber font-mono mt-0.5">3</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-tactical-amber" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">UPTIME MÉDIO</p>
                <p className="text-2xl font-bold text-tactical-cyan font-mono mt-0.5">99.7%</p>
              </div>
              <Activity className="w-6 h-6 text-tactical-cyan" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">MODO MANUTENÇÃO</p>
                <p className="text-2xl font-bold text-neutral-300 font-mono mt-0.5">1</p>
              </div>
              <Settings className="w-6 h-6 text-neutral-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {INITIAL_SYSTEMS.map((system) => (
          <Card
            key={system.id}
            className="bg-tactical-chassis border-tactical-border hover:border-tactical-amber/60 transition-all duration-200 cursor-pointer tactical-chamfer-corner shadow-md group"
            onClick={() => setSelectedSystem(system)}
          >
            <CardHeader className="pb-3 border-b border-tactical-border/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-tactical-void rounded border border-tactical-border/70 group-hover:border-tactical-amber/50 transition-colors">
                    {getSystemIcon(system.type)}
                  </div>
                  <div>
                    <CardTitle className="text-xs font-display font-bold text-white tracking-wider group-hover:text-tactical-amber transition-colors">
                      {system.name}
                    </CardTitle>
                    <p className="text-[10px] text-neutral-500 font-mono uppercase">
                      {SYSTEM_TYPE_LABELS[system.type]} // {system.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(system.status)}
                  <Badge className={`text-[10px] font-mono uppercase tracking-wider ${getSystemStatusBadgeClass(system.status)}`}>
                    {SYSTEM_STATUS_LABELS[system.status]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">INTEGRIDADE E SAÚDE</span>
                <span className={`font-bold ${getHealthColorClass(system.health)}`}>
                  {system.health}%
                </span>
              </div>
              <Progress value={system.health} className="h-1.5 bg-tactical-void" />

              <div className="grid grid-cols-3 gap-2 text-xs font-mono p-2 bg-tactical-void/80 border border-tactical-border/60 rounded-sm">
                <div>
                  <div className="text-[10px] text-neutral-500">CPU</div>
                  <div className="text-white font-bold">{system.cpu}%</div>
                  <div className="w-full bg-tactical-chassis rounded-full h-1 mt-1">
                    <div
                      className="bg-tactical-amber h-1 rounded-full"
                      style={{ width: `${system.cpu}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">RAM</div>
                  <div className="text-tactical-cyan font-bold">{system.memory}%</div>
                  <div className="w-full bg-tactical-chassis rounded-full h-1 mt-1">
                    <div
                      className="bg-tactical-cyan h-1 rounded-full"
                      style={{ width: `${system.memory}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500">DISCO</div>
                  <div className="text-neutral-300 font-bold">{system.storage}%</div>
                  <div className="w-full bg-tactical-chassis rounded-full h-1 mt-1">
                    <div
                      className="bg-neutral-500 h-1 rounded-full"
                      style={{ width: `${system.storage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-[11px] font-mono text-neutral-400">
                <div className="flex justify-between">
                  <span className="text-neutral-500">UPTIME:</span>
                  <span className="text-neutral-200">{system.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">SETOR / MANUT:</span>
                  <span className="text-tactical-cyan font-medium">{system.lastMaintenance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SystemDetailModal system={selectedSystem} onClose={() => setSelectedSystem(null)} />
    </div>
  )
}
