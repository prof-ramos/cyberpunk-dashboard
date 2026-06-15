"use client"

import { useState } from "react"
import { ChevronRight, BarChart3, BookOpen, ClipboardList, FileText, Settings, Bell, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import PainelGeral from "./painel-geral/page"
import Materias from "./materias/page"
import Simulados from "./simulados/page"
import Cronograma from "./cronograma/page"
import Desempenho from "./desempenho/page"

export default function StudyDashboard() {
  const [activeSection, setActiveSection] = useState("painel")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navItems = [
    { id: "painel", icon: BarChart3, label: "PAINEL GERAL" },
    { id: "materias", icon: BookOpen, label: "MATÉRIAS" },
    { id: "simulados", icon: ClipboardList, label: "SIMULADOS" },
    { id: "cronograma", icon: FileText, label: "CRONOGRAMA" },
    { id: "desempenho", icon: Settings, label: "DESEMPENHO" },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "painel":
        return <PainelGeral />
      case "materias":
        return <Materias />
      case "simulados":
        return <Simulados />
      case "cronograma":
        return <Cronograma />
      case "desempenho":
        return <Desempenho />
      default:
        return <PainelGeral />
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-orange-500 font-bold text-lg tracking-wider">ESTUDOS</h1>
              <p className="text-neutral-500 text-xs">Concurso 2026</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-orange-500"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-orange-500 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-neutral-800 border border-neutral-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-white">ESTUDANDO</span>
              </div>
              <div className="text-xs text-neutral-500">
                <div>HOJE: 4h32min</div>
                <div>SEMANA: 28h15min</div>
                <div>SEQUÊNCIA: 47 dias</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">
              ESTUDOS / <span className="text-orange-500">{navItems.find(n => n.id === activeSection)?.label || "PAINEL GERAL"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">
              {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).toUpperCase()}
            </div>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
