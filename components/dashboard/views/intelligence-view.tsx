"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Filter, Globe, Shield, AlertTriangle, PlusCircle } from "lucide-react"
import { INITIAL_INTEL_REPORTS } from "@/data/intelligence"
import type { IntelReport } from "@/types/intelligence"
import {
  INTEL_STATUS_LABELS,
  THREAT_LEVEL_LABELS,
  INTEL_CLASSIFICATION_LABELS,
  getIntelStatusBadgeClass,
  getThreatBadgeClass,
  getClassificationBadgeClass,
} from "@/lib/status-helpers"
import { IntelDetailModal } from "@/components/dashboard/intel-detail-modal"

export function IntelligenceView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReport, setSelectedReport] = useState<IntelReport | null>(null)

  const filteredReports = INITIAL_INTEL_REPORTS.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-tactical-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-tactical-amber inline-block rotate-45" />
            <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">
              ARQUIVO DE INTELIGÊNCIA & INTERCEPÇÃO DE DADOS
            </h1>
          </div>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">
            DOSSIÊS CLANDESTINOS // NÍVEL DE CLASSIFICAÇÃO ULTRA-SECRETO
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-tactical-amber hover:bg-tactical-amberGlow text-black font-display font-bold text-xs tracking-wider tactical-chamfer-button shadow-[0_0_12px_rgba(255,159,28,0.3)]">
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            REGISTRAR INTERCEPÇÃO
          </Button>
          <Button
            variant="outline"
            className="border-tactical-border text-neutral-300 hover:bg-tactical-chassisMuted bg-tactical-void text-xs font-mono"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5 text-tactical-cyan" />
            PARÂMETROS
          </Button>
        </div>
      </div>

      {/* Stats and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2 bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-3.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                placeholder="Filtrar por palavras-chave, ID ou protocolo de interceptação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-tactical-void border-tactical-border text-white placeholder-neutral-500 text-xs font-mono focus:border-tactical-amber"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">TOTAL DE RELATÓRIOS</p>
                <p className="text-xl font-bold text-white font-mono mt-0.5">1.247</p>
              </div>
              <FileText className="w-5 h-5 text-neutral-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">AMEAÇAS CRÍTICAS</p>
                <p className="text-xl font-bold text-tactical-crimson font-mono mt-0.5">12</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-tactical-crimson" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner">
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">FONTES ATIVAS</p>
                <p className="text-xl font-bold text-tactical-cyan font-mono mt-0.5">89</p>
              </div>
              <Globe className="w-5 h-5 text-tactical-cyan" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence Reports */}
      <Card className="bg-tactical-chassis border-tactical-border tactical-chamfer-corner shadow-lg">
        <CardHeader className="pb-3 border-b border-tactical-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-display font-bold text-tactical-amber tracking-widest uppercase">
              DOSSIÊS DE SEGURANÇA E VETORES DE INTERCEPÇÃO ({filteredReports.length})
            </CardTitle>
            <span className="text-[10px] text-neutral-500 font-mono">HASH: SHA256-VALID</span>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="border border-tactical-border bg-tactical-void/60 rounded-sm p-3.5 hover:border-tactical-amber/60 hover:bg-tactical-chassisMuted/50 transition-all duration-150 cursor-pointer group"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-tactical-chassis rounded border border-tactical-border group-hover:border-tactical-amber/50 transition-colors mt-0.5">
                        <FileText className="w-4 h-4 text-tactical-amber" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xs font-display font-bold text-white tracking-wider group-hover:text-tactical-amber transition-colors">
                          {report.title}
                        </h3>
                        <p className="text-[10px] text-neutral-500 font-mono">DOSSIER ID: {report.id}</p>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed ml-9">{report.summary}</p>

                    <div className="flex flex-wrap gap-1.5 ml-9">
                      {report.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-tactical-chassis text-neutral-400 text-[10px] px-2 py-0.5 rounded border border-tactical-border font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge className={`text-[10px] font-mono uppercase tracking-wider ${getClassificationBadgeClass(report.classification)}`}>
                        {INTEL_CLASSIFICATION_LABELS[report.classification]}
                      </Badge>
                      <Badge className={`text-[10px] font-mono uppercase tracking-wider ${getThreatBadgeClass(report.threat)}`}>
                        {THREAT_LEVEL_LABELS[report.threat]}
                      </Badge>
                      <Badge className={`text-[10px] font-mono uppercase tracking-wider ${getIntelStatusBadgeClass(report.status)}`}>
                        {INTEL_STATUS_LABELS[report.status]}
                      </Badge>
                    </div>

                    <div className="text-[10px] text-neutral-500 font-mono space-y-0.5 text-right">
                      <div className="flex items-center gap-1 sm:justify-end">
                        <Globe className="w-3 h-3 text-neutral-600" />
                        <span className="text-neutral-400">{report.location}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:justify-end">
                        <Shield className="w-3 h-3 text-neutral-600" />
                        <span className="text-neutral-400">{report.source}</span>
                      </div>
                      <div className="text-neutral-500">{report.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <IntelDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
    </div>
  )
}
