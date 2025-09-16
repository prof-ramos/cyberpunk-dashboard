"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, BookOpen, Plus, Clock, Target, TrendingUp } from "lucide-react"
import { getStudySessions, addStudySession, getTodayString } from "@/lib/storage"
import type { StudySession } from "@/lib/types"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function StudiesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSession, setNewSession] = useState({
    subject: "",
    method: "",
    durationMin: "",
    date: getTodayString(),
  })

  useEffect(() => {
    setStudySessions(getStudySessions())
  }, [])

  const handleAddSession = () => {
    if (newSession.subject && newSession.method && newSession.durationMin) {
      addStudySession({
        subject: newSession.subject,
        method: newSession.method,
        durationMin: Number.parseInt(newSession.durationMin),
        date: newSession.date,
      })
      setStudySessions(getStudySessions())
      setNewSession({ subject: "", method: "", durationMin: "", date: getTodayString() })
      setIsDialogOpen(false)
    }
  }

  // Calculate metrics
  const totalHours = studySessions.reduce((total, session) => total + session.durationMin, 0) / 60
  const todayHours =
    studySessions.filter((s) => s.date === getTodayString()).reduce((total, s) => total + s.durationMin, 0) / 60
  const uniqueSubjects = new Set(studySessions.map((s) => s.subject)).size

  // Subject distribution for pie chart
  const subjectDistribution = studySessions.reduce(
    (acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + session.durationMin
      return acc
    },
    {} as Record<string, number>,
  )

  const pieData = Object.entries(subjectDistribution).map(([subject, minutes]) => ({
    name: subject,
    value: minutes,
    hours: Math.round((minutes / 60) * 10) / 10,
  }))

  // Daily study hours for line chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const dailyHours = last7Days.map((date) => ({
    date: new Date(date).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" }),
    hours: studySessions.filter((s) => s.date === date).reduce((total, s) => total + s.durationMin, 0) / 60,
  }))

  // Subject goals (mock data for now)
  const subjectGoals = [
    { subject: "Matemática", current: 12, target: 20, color: "#f97316" },
    { subject: "Física", current: 8, target: 15, color: "#ffffff" },
    { subject: "Química", current: 6, target: 12, color: "#737373" },
    { subject: "Português", current: 4, target: 10, color: "#404040" },
  ]

  const COLORS = ["#f97316", "#ffffff", "#737373", "#404040", "#262626"]

  const filteredSessions = studySessions.filter(
    (session) =>
      session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.method.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">ESTUDOS E ANALYTICS</h1>
          <p className="text-sm text-neutral-400">Registro de sessões e análise de progresso</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nova Sessão
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-700 text-white">
              <DialogHeader>
                <DialogTitle>Registrar Sessão de Estudo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject">Matéria</Label>
                  <Select
                    value={newSession.subject}
                    onValueChange={(value) => setNewSession({ ...newSession, subject: value })}
                  >
                    <SelectTrigger className="bg-neutral-800 border-neutral-600">
                      <SelectValue placeholder="Selecione a matéria" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-600">
                      <SelectItem value="Matemática">Matemática</SelectItem>
                      <SelectItem value="Física">Física</SelectItem>
                      <SelectItem value="Química">Química</SelectItem>
                      <SelectItem value="Português">Português</SelectItem>
                      <SelectItem value="História">História</SelectItem>
                      <SelectItem value="Geografia">Geografia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="method">Técnica de Estudo</Label>
                  <Select
                    value={newSession.method}
                    onValueChange={(value) => setNewSession({ ...newSession, method: value })}
                  >
                    <SelectTrigger className="bg-neutral-800 border-neutral-600">
                      <SelectValue placeholder="Selecione a técnica" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-600">
                      <SelectItem value="Pomodoro">Pomodoro</SelectItem>
                      <SelectItem value="Revisão">Revisão</SelectItem>
                      <SelectItem value="Exercícios">Exercícios</SelectItem>
                      <SelectItem value="Leitura">Leitura</SelectItem>
                      <SelectItem value="Resumos">Resumos</SelectItem>
                      <SelectItem value="Flashcards">Flashcards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSession.durationMin}
                    onChange={(e) => setNewSession({ ...newSession, durationMin: e.target.value })}
                    className="bg-neutral-800 border-neutral-600"
                    placeholder="90"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="bg-neutral-800 border-neutral-600"
                  />
                </div>
                <Button onClick={handleAddSession} className="w-full bg-orange-500 hover:bg-orange-600">
                  Registrar Sessão
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">HORAS HOJE</p>
                <p className="text-2xl font-bold text-white font-mono">{todayHours.toFixed(1)}h</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL HORAS</p>
                <p className="text-2xl font-bold text-white font-mono">{totalHours.toFixed(1)}h</p>
              </div>
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">MATÉRIAS</p>
                <p className="text-2xl font-bold text-white font-mono">{uniqueSubjects}</p>
              </div>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">SESSÕES</p>
                <p className="text-2xl font-bold text-white font-mono">{studySessions.length}</p>
              </div>
              <Target className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Hours Chart */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              HORAS POR DIA - ÚLTIMOS 7 DIAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="date" stroke="#737373" fontSize={12} />
                  <YAxis stroke="#737373" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#262626",
                      border: "1px solid #404040",
                      borderRadius: "4px",
                      color: "#ffffff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              DISTRIBUIÇÃO POR MATÉRIA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#262626",
                      border: "1px solid #404040",
                      borderRadius: "4px",
                      color: "#ffffff",
                    }}
                    formatter={(value: number) => [`${Math.round(value / 60)}h`, "Tempo"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Goals */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">METAS POR DISCIPLINA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectGoals.map((goal) => (
              <div key={goal.subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-300">{goal.subject}</span>
                  <span className="text-white font-mono">
                    {goal.current}h / {goal.target}h
                  </span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: goal.color,
                      width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-neutral-400">
                  {Math.round((goal.current / goal.target) * 100)}% da meta
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Sessions List */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">SESSÕES DE ESTUDO</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="Buscar sessões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="border border-neutral-700 rounded p-4 hover:border-orange-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-orange-500" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{session.subject}</h3>
                      <p className="text-xs text-neutral-400">{session.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-white">{session.durationMin} min</div>
                    <div className="text-xs text-neutral-400">{new Date(session.date).toLocaleDateString("pt-BR")}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
