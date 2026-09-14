"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronRight,
  BarChart3,
  Users,
  Target,
  FileText,
  Server,
  Bell,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DashboardTab } from "@/types/dashboard"
import { INITIAL_NETWORK_HEALTH } from "@/data/command-center"

interface DashboardShellProps {
  activeTab: DashboardTab
  children: React.ReactNode
}

interface NavItemConfig {
  id: DashboardTab
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: "command-center", href: "/command-center", icon: BarChart3, label: "CENTRAL DE COMANDO" },
  { id: "agent-network", href: "/agent-network", icon: Users, label: "REDE DE AGENTES" },
  { id: "operations", href: "/operations", icon: Target, label: "OPERAÇÕES" },
  { id: "intelligence", href: "/intelligence", icon: FileText, label: "INTELIGÊNCIA" },
  { id: "systems", href: "/systems", icon: Server, label: "SISTEMAS" },
]

export function DashboardShell({ activeTab, children }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) ?? NAV_ITEMS[0]

  return (
    <div className="flex h-screen bg-tactical-void text-neutral-100 antialiased overflow-hidden font-mono selection:bg-tactical-amber/30 selection:text-tactical-amber">
      {/* Sidebar Chassis */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-72"
        } bg-tactical-chassis border-r border-tactical-border transition-all duration-300 fixed md:relative z-50 md:z-auto h-full flex flex-col justify-between`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-tactical-border/60">
            <div className={sidebarCollapsed ? "hidden" : "block"}>
              <Link href="/command-center" className="block hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-tactical-amber rotate-45 animate-pulse" />
                  <h1 className="font-display font-bold text-lg tracking-widest text-tactical-amber">
                    AETHELGARD
                  </h1>
                </div>
                <p className="text-neutral-500 text-[10px] tracking-wider uppercase font-mono pl-4">
                  GRID TÁTICO // OSINT MATRIX
                </p>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-tactical-amber hover:bg-tactical-chassisMuted"
              aria-label={sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-xs tracking-wider ${
                    isActive
                      ? "bg-tactical-amber text-black font-bold font-display shadow-[0_0_14px_rgba(255,159,28,0.35)] tactical-chamfer-button"
                      : "text-neutral-400 hover:text-white hover:bg-tactical-chassisMuted/70"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-black" : "text-neutral-400"}`} />
                  {!sidebarCollapsed && <span className="font-display tracking-widest uppercase">{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* System Health Widget in Sidebar bottom */}
        {!sidebarCollapsed && (
          <div className="p-3.5 m-4 bg-tactical-void/80 border border-tactical-border tactical-chamfer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-tactical-emerald rounded-full animate-ping" />
                <span className="text-[11px] font-display font-semibold tracking-wider text-neutral-200">
                  NÓS OPERACIONAIS
                </span>
              </div>
              <span className="text-[10px] text-tactical-cyan font-mono font-semibold">99.8%</span>
            </div>
            <div className="text-[10px] text-neutral-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500">CANAL:</span>
                <span className="text-neutral-300">{INITIAL_NETWORK_HEALTH.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">UPTIME:</span>
                <span className="text-neutral-300">{INITIAL_NETWORK_HEALTH.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">ATIVOS:</span>
                <span className="text-tactical-amber font-semibold">{INITIAL_NETWORK_HEALTH.activeAgents.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/75 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-tactical-void tactical-grid-bg">
        {/* Top Navigation Bar */}
        <header className="h-14 bg-tactical-chassis/90 backdrop-blur border-b border-tactical-border flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="text-xs text-neutral-500 font-mono tracking-wider flex items-center gap-2">
              <span className="text-tactical-cyan">SEC//SYS</span>
              <span>/</span>
              <span className="font-display font-bold text-tactical-amber tracking-widest">{activeItem.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[11px] text-neutral-400 font-mono hidden sm:flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-tactical-emerald" />
              <span>FREQUÊNCIA: 142.85 MHz</span>
              <span className="text-neutral-600">|</span>
              <span>
                {new Date().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-400 hover:text-tactical-amber hover:bg-tactical-chassisMuted"
              aria-label="Notificações"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.reload()}
              className="h-8 w-8 text-neutral-400 hover:text-tactical-amber hover:bg-tactical-chassisMuted"
              aria-label="Atualizar dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
