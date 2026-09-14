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
    <div className="flex h-screen bg-black text-white antialiased overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-72"
        } bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full flex flex-col justify-between`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={sidebarCollapsed ? "hidden" : "block"}>
              <Link href="/command-center" className="block hover:opacity-90 transition-opacity">
                <h1 className="text-orange-500 font-bold text-lg tracking-wider">CYBERPUNK</h1>
                <p className="text-neutral-500 text-xs">DASHBOARD</p>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-orange-500 hover:bg-neutral-800"
              aria-label={sidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                    isActive
                      ? "bg-orange-500 text-white font-semibold"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* System Health Widget in Sidebar bottom */}
        {!sidebarCollapsed && (
          <div className="p-4 m-4 bg-neutral-800 border border-neutral-700 rounded">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-white">SISTEMA ONLINE</span>
            </div>
            <div className="text-xs text-neutral-400 space-y-0.5 font-mono">
              <div>REDE: {INITIAL_NETWORK_HEALTH.network}</div>
              <div>UPTIME: {INITIAL_NETWORK_HEALTH.uptime}</div>
              <div>AGENTES: {INITIAL_NETWORK_HEALTH.activeAgents.toLocaleString("pt-BR")}</div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-neutral-800/90 backdrop-blur border-b border-neutral-700 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400 font-mono tracking-wide">
              DASHBOARD / <span className="text-orange-500 font-bold">{activeItem.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-400 font-mono hidden sm:block">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-orange-500 hover:bg-neutral-700/50"
              aria-label="Notificações"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.reload()}
              className="text-neutral-400 hover:text-orange-500 hover:bg-neutral-700/50"
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
