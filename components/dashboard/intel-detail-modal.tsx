"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download } from "lucide-react"
import type { IntelReport } from "@/types/intelligence"
import {
  INTEL_STATUS_LABELS,
  THREAT_LEVEL_LABELS,
  INTEL_CLASSIFICATION_LABELS,
  getIntelStatusBadgeClass,
  getThreatBadgeClass,
  getClassificationBadgeClass,
} from "@/lib/status-helpers"

interface IntelDetailModalProps {
  report: IntelReport | null
  onClose: () => void
}

export function IntelDetailModal({ report, onClose }: IntelDetailModalProps) {
  if (!report) return null

  return (
    <div className="fixed inset-0 bg-tactical-void/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <Card className="bg-tactical-chassis border-tactical-border w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl tactical-chamfer-corner">
        <CardHeader className="flex flex-row items-center justify-between border-b border-tactical-border/60 pb-4">
          <div>
            <CardTitle className="text-base font-display font-bold text-tactical-amber tracking-widest uppercase">
              DOSSIÊ // {report.title}
            </CardTitle>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">DOSSIER ID: {report.id}</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-neutral-400 hover:text-tactical-amber hover:bg-tactical-chassisMuted h-8 w-8"
            aria-label="Fechar detalhes do relatório"
          >
            ✕
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">CLASSIFICAÇÃO</h3>
                <div className="flex gap-2">
                  <Badge className={getClassificationBadgeClass(report.classification)}>
                    {INTEL_CLASSIFICATION_LABELS[report.classification]}
                  </Badge>
                  <Badge className={getThreatBadgeClass(report.threat)}>
                    AMEAÇA: {THREAT_LEVEL_LABELS[report.threat]}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">DETALHES DA FONTE</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Tipo de fonte:</span>
                    <span className="text-white font-mono">{report.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Localização:</span>
                    <span className="text-white">{report.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Data:</span>
                    <span className="text-white font-mono">{report.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Status:</span>
                    <Badge className={getIntelStatusBadgeClass(report.status)}>
                      {INTEL_STATUS_LABELS[report.status]}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">TAGS</h3>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag) => (
                    <Badge key={tag} className="bg-neutral-800 text-neutral-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">AVALIAÇÃO DE AMEAÇA</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Nível de ameaça</span>
                    <Badge className={getThreatBadgeClass(report.threat)}>
                      {THREAT_LEVEL_LABELS[report.threat]}
                    </Badge>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        report.threat === "critical"
                          ? "bg-red-500 w-full"
                          : report.threat === "high"
                            ? "bg-orange-500 w-3/4"
                            : report.threat === "medium"
                              ? "bg-neutral-400 w-1/2"
                              : "bg-white w-1/4"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-300 tracking-wider mb-2">RESUMO EXECUTIVO</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">{report.summary}</p>
          </div>

          <div className="flex gap-2 pt-4 border-t border-neutral-800">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Eye className="w-4 h-4 mr-2" />
              Ver relatório completo
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
