"use client"

import { useState } from "react"

interface TelemetryPoint {
  time: string
  incursions: number
  throughput: number
  packets: number
}

const TELEMETRY_DATA: TelemetryPoint[] = [
  { time: "00:00", incursions: 120, throughput: 280, packets: 1420 },
  { time: "04:00", incursions: 95, throughput: 190, packets: 980 },
  { time: "08:00", incursions: 210, throughput: 420, packets: 2310 },
  { time: "12:00", incursions: 340, throughput: 510, packets: 3450 },
  { time: "16:00", incursions: 280, throughput: 460, packets: 2900 },
  { time: "20:00", incursions: 390, throughput: 540, packets: 3820 },
  { time: "22:00", incursions: 310, throughput: 430, packets: 3100 },
  { time: "23:59", incursions: 240, throughput: 370, packets: 2600 },
]

export function TacticalTelemetryStream() {
  const [hoveredPoint, setHoveredPoint] = useState<TelemetryPoint | null>(null)

  const maxVal = 600
  const height = 160
  const width = 640

  const getCoordinates = (val: number, index: number) => {
    const x = (index / (TELEMETRY_DATA.length - 1)) * width
    const y = height - (val / maxVal) * height
    return { x, y }
  }

  const incursionPoints = TELEMETRY_DATA.map((p, i) => {
    const { x, y } = getCoordinates(p.incursions, i)
    return `${x},${y}`
  }).join(" ")

  const throughputPoints = TELEMETRY_DATA.map((p, i) => {
    const { x, y } = getCoordinates(p.throughput, i)
    return `${x},${y}`
  }).join(" ")

  const activePoint = hoveredPoint ?? TELEMETRY_DATA[TELEMETRY_DATA.length - 1]

  return (
    <div className="space-y-3">
      {/* Telemetry Stream Header with Live Stats HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono border-b border-tactical-border/60 pb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-tactical-amber inline-block" />
            <span className="text-neutral-400">INCURSÕES EM CAMPO</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-tactical-cyan inline-block" />
            <span className="text-neutral-400">ENLACE CRIPTOGRÁFICO (kpps)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-neutral-500">PICO: <strong className="text-white">540 kpps</strong></span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-500">PACOTES TOTAIS: <strong className="text-tactical-cyan">20.5M</strong></span>
        </div>
      </div>

      {/* SVG Vector Chart Area */}
      <div className="relative p-2 bg-tactical-void/80 border border-tactical-border tactical-chamfer overflow-hidden">
        {/* Fine Technical Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-7 grid-rows-4 pointer-events-none opacity-25">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="border-r border-b border-tactical-border" />
          ))}
        </div>

        <div className="relative h-44 w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Area Fill under Throughput */}
            <polygon
              points={`0,${height} ${throughputPoints} ${width},${height}`}
              fill="rgba(0, 240, 255, 0.07)"
            />

            {/* Throughput Polyline */}
            <polyline
              points={throughputPoints}
              fill="none"
              stroke="#00f0ff"
              strokeWidth="2"
              strokeDasharray="4,4"
            />

            {/* Incursions Polyline */}
            <polyline
              points={incursionPoints}
              fill="none"
              stroke="#ff9f1c"
              strokeWidth="2.5"
            />

            {/* Interactive Data Nodes on Chart */}
            {TELEMETRY_DATA.map((p, i) => {
              const incCoord = getCoordinates(p.incursions, i)
              const tpCoord = getCoordinates(p.throughput, i)
              const isHovered = hoveredPoint?.time === p.time

              return (
                <g key={i}>
                  <circle
                    cx={incCoord.x}
                    cy={incCoord.y}
                    r={isHovered ? "5" : "3"}
                    className="fill-tactical-amber transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(p)}
                  />
                  <circle
                    cx={tpCoord.x}
                    cy={tpCoord.y}
                    r={isHovered ? "4" : "2.5"}
                    className="fill-tactical-cyan transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(p)}
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* X Axis Timestamps */}
        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono pt-2 border-t border-tactical-border/40">
          {TELEMETRY_DATA.map((p) => (
            <span
              key={p.time}
              className={`cursor-pointer transition-colors ${
                activePoint.time === p.time ? "text-tactical-amber font-bold" : "hover:text-neutral-300"
              }`}
              onMouseEnter={() => setHoveredPoint(p)}
            >
              {p.time}
            </span>
          ))}
        </div>
      </div>

      {/* Scrubbed Value Banner */}
      <div className="flex items-center justify-between text-[11px] font-mono px-2 text-neutral-400">
        <div>
          <span>JANELA SELECIONADA: </span>
          <span className="text-white font-semibold">T+{activePoint.time} UTC</span>
        </div>
        <div className="space-x-4">
          <span>
            INCURSÕES: <strong className="text-tactical-amber">{activePoint.incursions}</strong>
          </span>
          <span>
            ENLACE: <strong className="text-tactical-cyan">{activePoint.throughput} kpps</strong>
          </span>
          <span>
            PACOTES: <strong className="text-neutral-200">{activePoint.packets.toLocaleString("pt-BR")}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
