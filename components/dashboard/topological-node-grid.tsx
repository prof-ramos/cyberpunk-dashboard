"use client"

import { useState } from "react"
import { INITIAL_SYSTEMS } from "@/data/systems"
import type { SystemNode } from "@/types/system"
import { getSystemStatusBadgeClass, getHealthColorClass } from "@/lib/status-helpers"
import { Server, Database, Shield, Wifi, HardDrive, Cpu } from "lucide-react"

export function TopologicalNodeGrid() {
  const [selectedNode, setSelectedNode] = useState<SystemNode>(INITIAL_SYSTEMS[0])

  const getNodeIcon = (type: SystemNode["type"]) => {
    switch (type) {
      case "neural-core":
        return <Server className="w-3.5 h-3.5" />
      case "database":
        return <Database className="w-3.5 h-3.5" />
      case "defense":
        return <Shield className="w-3.5 h-3.5" />
      case "communications":
        return <Wifi className="w-3.5 h-3.5" />
      case "quantum":
        return <HardDrive className="w-3.5 h-3.5" />
      case "surveillance":
        return <Cpu className="w-3.5 h-3.5" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Node Matrix Grid */}
      <div className="relative p-3 bg-tactical-void/90 border border-tactical-border tactical-chamfer">
        {/* Subtle background connection bus line */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-px bg-tactical-border/60 z-0 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-3 gap-2.5">
          {INITIAL_SYSTEMS.slice(0, 6).map((node) => {
            const isSelected = selectedNode.id === node.id
            const isHealthy = node.health >= 90
            const isWarning = node.health < 90 && node.health >= 70

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelectedNode(node)}
                className={`relative p-2.5 text-left transition-all duration-150 rounded-sm border ${
                  isSelected
                    ? "bg-tactical-amber/15 border-tactical-amber text-white shadow-[0_0_12px_rgba(255,159,28,0.25)]"
                    : "bg-tactical-chassis/80 border-tactical-border/80 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={isSelected ? "text-tactical-amber" : "text-neutral-500"}>
                      {getNodeIcon(node.type)}
                    </span>
                    <span className="text-[11px] font-mono font-bold tracking-wider">{node.id}</span>
                  </div>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      node.status === "online"
                        ? "bg-tactical-emerald animate-pulse"
                        : node.status === "warning"
                        ? "bg-tactical-amber"
                        : "bg-tactical-crimson"
                    }`}
                  />
                </div>

                <div className="flex items-baseline justify-between text-[10px] font-mono">
                  <span className="truncate max-w-[65px] text-neutral-500">{node.name.split(" ")[0]}</span>
                  <span
                    className={`font-semibold ${
                      isHealthy
                        ? "text-tactical-cyan"
                        : isWarning
                        ? "text-tactical-amber"
                        : "text-tactical-crimson"
                    }`}
                  >
                    {node.health}%
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Real-time Telemetry Telemetry Deck for Selected Node */}
      <div className="p-3 bg-tactical-chassis/90 border-l-2 border-tactical-amber border-y border-r border-tactical-border text-xs font-mono space-y-2">
        <div className="flex items-center justify-between border-b border-tactical-border/60 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-tactical-amber font-bold font-display tracking-widest uppercase">
              {selectedNode.name}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">[{selectedNode.id}]</span>
          </div>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${getSystemStatusBadgeClass(
              selectedNode.status
            )}`}
          >
            {selectedNode.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-neutral-500">LOCALIZAÇÃO: </span>
            <span className="text-neutral-300 font-medium">{selectedNode.location}</span>
          </div>
          <div>
            <span className="text-neutral-500">MANUTENÇÃO: </span>
            <span className="text-tactical-cyan font-medium">{selectedNode.lastMaintenance}</span>
          </div>
          <div>
            <span className="text-neutral-500">CPU LOAD: </span>
            <span className="text-neutral-200 font-medium">{selectedNode.cpu}%</span>
          </div>
          <div>
            <span className="text-neutral-500">MEMÓRIA: </span>
            <span className="text-neutral-200 font-medium">{selectedNode.memory}%</span>
          </div>
        </div>

        <div className="pt-1 flex justify-between items-center text-[10px] text-neutral-500 border-t border-tactical-border/40">
          <span>LATÊNCIA: 12ms // BUFFER: OK</span>
          <span className="text-tactical-amber">CANAL CRIPTOGRÁFICO ATIVO</span>
        </div>
      </div>
    </div>
  )
}
