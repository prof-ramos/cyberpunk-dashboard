import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono as GeistMono } from "next/font/google"
import "./globals.css"

const geistMono = GeistMono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard de Estudos — Concurso",
  description: "Painel de controle para estudos de concursos públicos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistMono.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
