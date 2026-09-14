import type React from "react"
import type { Metadata } from "next"
import { Chakra_Petch as ChakraPetch, Geist_Mono as GeistMono } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const chakraPetch = ChakraPetch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
})

const geistMono = GeistMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "AETHELGARD // Terminal Tático & Central de Operações",
  description:
    "Interface de comando e controle tático para monitoramento de rede neural, nós de infraestrutura e ativos de campo.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${chakraPetch.variable} ${geistMono.variable} dark`}>
      <body className="font-mono bg-[#0a0c0e] text-neutral-100 antialiased selection:bg-amber-500/30 selection:text-amber-300">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}

