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
} from "lucide-react"
import { INITIAL_SYSTEMS } from "@/data/systems"
import type { SystemNode, SystemStatus, SystemType } from "@/types/system"
import {
  SYSTEM_STATUS_LABELS,
  SYSTEM_TYPE_LABELS,
  getSystemStatusBadgeClass,
  getHealthColorClass,
} from "@/lib/status-helpers"

export default function SystemsPage() {
  const [selectedSystem, setSelectedSystem] = useState<SystemNode | null>(null)

  const getStatusIcon = (status: SystemStatus) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-white" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "maintenance":
        return <Settings className="w-4 h-4 text-neutral-400" />
      case "offline":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const getSystemIcon = (type: SystemType) => {
    switch (type) {
      case "neural-core":
        return <Server className="w-6 h-6 text-orange-500" />
      case "database":
        return <Database className="w-6 h-6 text-white" />
      case "defense":
        return <Shield className="w-6 h-6 text-white" />
      case "communications":
        return <Wifi className="w-6 h-6 text-white" />
      case "quantum":
        return <HardDrive className="w-6 h-6 text-neutral-400" />
      case "surveillance":
        return <Cpu className="w-6 h-6 text-white" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">MONITOR DE SISTEMAS</h1>
          <p className="text-sm text-neutral-400">Monitoramento de saúde e desempenho da infraestrutura</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Verificar sistemas</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Modo de manutenção</Button>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">SISTEMAS ONLINE</p>
                <p className="text-2xl font-bold text-white font-mono">24/26</p>
              </div>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">AVISOS</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">UPTIME MÉDIO</p>
                <p className="text-2xl font-bold text-white font-mono">99.7%</p>
              </div>
              <Activity className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">MANUTENÇÃO</p>
                <p className="text-2xl font-bold text-neutral-300 font-mono">1</p>
              </div>
              <Settings className="w-8 h-8 text-neutral-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {INITIAL_SYSTEMS.map((system) => (
          <Card
            key={system.id}
            className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedSystem(system)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getSystemIcon(system.type)}
                  <div>
                    <CardTitle className="text-sm font-bold text-white tracking-wider">{system.name}</CardTitle>
                    <p className="text-xs text-neutral-400">{SYSTEM_TYPE_LABELS[system.type]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(system.status)}
                  <Badge className={getSystemStatusBadgeClass(system.status)}>
                    {SYSTEM_STATUS_LABELS[system.status]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">SAÚDE DO SISTEMA</span>
                <span className={`text-sm font-bold font-mono ${getHealthColorClass(system.health)}`}>
                  {system.health}%
                </span>
              </div>
              <Progress value={system.health} className="h-2" />

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="text-neutral-400 mb-1">CPU</div>
                  <div className="text-white font-mono">{system.cpu}%</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${system.cpu}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400 mb-1">MEMORY</div>
                  <div className="text-white font-mono">{system.memory}%</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${system.memory}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-neutral-400 mb-1">STORAGE</div>
                  <div className="text-white font-mono">{system.storage}%</div>
                  <div className="w-full bg-neutral-800 rounded-full h-1 mt-1">
                    <div
                      className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${system.storage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Tempo de atividade:</span>
                  <span className="text-white font-mono">{system.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Localização:</span>
                  <span className="text-white">{system.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Detail Modal */}
      {selectedSystem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                {getSystemIcon(selectedSystem.type)}
                <div>
                  <CardTitle className="text-xl font-bold text-white tracking-wider">{selectedSystem.name}</CardTitle>
                  <p className="text-sm text-neutral-400">
                    {selectedSystem.id} • {SYSTEM_TYPE_LABELS[selectedSystem.type]}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedSystem(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">STATUS DO SISTEMA</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedSystem.status)}
                      <Badge className={getSystemStatusBadgeClass(selectedSystem.status)}>
                        {SYSTEM_STATUS_LABELS[selectedSystem.status]}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">INFORMAÇÕES DO SISTEMA</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Localização:</span>
                        <span className="text-white">{selectedSystem.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Tempo de atividade:</span>
                        <span className="text-white font-mono">{selectedSystem.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Última manutenção:</span>
                        <span className="text-white font-mono">{selectedSystem.lastMaintenance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Índice de saúde:</span>
                        <span className={`font-mono ${getHealthColorClass(selectedSystem.health)}`}>
                          {selectedSystem.health}%
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
                          <span className="text-white font-mono">{selectedSystem.cpu}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedSystem.cpu}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-400">Uso de memória</span>
                          <span className="text-white font-mono">{selectedSystem.memory}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedSystem.memory}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-neutral-400">Uso de armazenamento</span>
                          <span className="text-white font-mono">{selectedSystem.storage}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedSystem.storage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-700">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Reiniciar sistema</Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Ver logs
                </Button>
                <Button
                  variant="outline"
                  className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                >
                  Agendar manutenção
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
