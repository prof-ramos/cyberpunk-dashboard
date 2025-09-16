"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, TrendingUp, Target, Flame } from "lucide-react"
import { getHabits, addHabit, toggleHabitForDate, getTodayString } from "@/lib/storage"
import type { Habit } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newHabit, setNewHabit] = useState({
    name: "",
    targetPerDay: "1",
  })

  useEffect(() => {
    setHabits(getHabits())
  }, [])

  const handleAddHabit = () => {
    if (newHabit.name) {
      addHabit({
        name: newHabit.name,
        targetPerDay: Number.parseInt(newHabit.targetPerDay),
        history: [],
      })
      setHabits(getHabits())
      setNewHabit({ name: "", targetPerDay: "1" })
      setIsDialogOpen(false)
    }
  }

  const handleToggleHabit = (habitId: string, date: string) => {
    toggleHabitForDate(habitId, date)
    setHabits(getHabits())
  }

  const today = getTodayString()

  // Calculate streaks and completion rates
  const calculateStreak = (habit: Habit): number => {
    const sortedHistory = habit.history
      .filter((h) => h.done)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (sortedHistory.length === 0) return 0

    let streak = 0
    let currentDate = new Date()

    for (const entry of sortedHistory) {
      const entryDate = new Date(entry.date)
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    return streak
  }

  const calculateCompletionRate = (habit: Habit, days: number): number => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const recentHistory = habit.history.filter((h) => new Date(h.date) >= cutoffDate)
    const completedDays = recentHistory.filter((h) => h.done).length

    return Math.round((completedDays / days) * 100)
  }

  // Calculate overall stats
  const todayCompleted = habits.filter((h) => h.history.some((entry) => entry.date === today && entry.done)).length
  const totalHabits = habits.length
  const averageStreak =
    habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + calculateStreak(h), 0) / habits.length) : 0
  const weeklyCompletionRate =
    habits.length > 0
      ? Math.round(habits.reduce((sum, h) => sum + calculateCompletionRate(h, 7), 0) / habits.length)
      : 0

  // Generate trend data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return date.toISOString().split("T")[0]
  })

  const trendData = last30Days.map((date) => {
    const completedHabits = habits.filter((h) => h.history.some((entry) => entry.date === date && entry.done)).length
    return {
      date: new Date(date).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
      completed: completedHabits,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0,
    }
  })

  // Weekly completion data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const weeklyData = last7Days.map((date) => {
    const dayName = new Date(date).toLocaleDateString("pt-BR", { weekday: "short" })
    const completedHabits = habits.filter((h) => h.history.some((entry) => entry.date === date && entry.done)).length
    return {
      day: dayName,
      completed: completedHabits,
      total: habits.length,
    }
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">HÁBITOS</h1>
          <p className="text-sm text-neutral-400">Acompanhamento e controle de hábitos diários</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Hábito
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-700 text-white">
              <DialogHeader>
                <DialogTitle>Criar Novo Hábito</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Hábito</Label>
                  <Input
                    id="name"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="bg-neutral-800 border-neutral-600"
                    placeholder="Ex: Leitura, Exercício, Meditação"
                  />
                </div>
                <div>
                  <Label htmlFor="target">Meta por Dia</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newHabit.targetPerDay}
                    onChange={(e) => setNewHabit({ ...newHabit, targetPerDay: e.target.value })}
                    className="bg-neutral-800 border-neutral-600"
                    placeholder="1"
                    min="1"
                  />
                </div>
                <Button onClick={handleAddHabit} className="w-full bg-orange-500 hover:bg-orange-600">
                  Criar Hábito
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">HOJE</p>
                <p className="text-2xl font-bold text-white font-mono">
                  {todayCompleted}/{totalHabits}
                </p>
              </div>
              <CheckSquare className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">STREAK MÉDIO</p>
                <p className="text-2xl font-bold text-white font-mono">{averageStreak}</p>
              </div>
              <Flame className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TAXA 7 DIAS</p>
                <p className="text-2xl font-bold text-white font-mono">{weeklyCompletionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 tracking-wider">TOTAL HÁBITOS</p>
                <p className="text-2xl font-bold text-white font-mono">{totalHabits}</p>
              </div>
              <Target className="w-8 h-8 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              TENDÊNCIA - ÚLTIMOS 30 DIAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
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
                    dataKey="percentage"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Completion */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">CONCLUSÃO SEMANAL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="day" stroke="#737373" fontSize={12} />
                  <YAxis stroke="#737373" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#262626",
                      border: "1px solid #404040",
                      borderRadius: "4px",
                      color: "#ffffff",
                    }}
                  />
                  <Bar dataKey="completed" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habits List */}
      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">LISTA DE HÁBITOS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habits.map((habit) => {
              const todayEntry = habit.history.find((h) => h.date === today)
              const isDone = todayEntry?.done || false
              const streak = calculateStreak(habit)
              const completionRate7 = calculateCompletionRate(habit, 7)
              const completionRate30 = calculateCompletionRate(habit, 30)

              return (
                <div
                  key={habit.id}
                  className="border border-neutral-700 rounded p-4 hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleHabit(habit.id, today)}
                        className={`w-8 h-8 p-0 rounded-full border-2 transition-colors ${
                          isDone
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-neutral-500 hover:border-orange-500"
                        }`}
                      >
                        {isDone && <CheckSquare className="w-4 h-4" />}
                      </Button>
                      <div>
                        <h3 className="text-sm font-bold text-white">{habit.name}</h3>
                        <p className="text-xs text-neutral-400">Meta: {habit.targetPerDay}x por dia</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-mono text-white flex items-center gap-1">
                          <Flame className="w-4 h-4 text-red-500" />
                          {streak} dias
                        </div>
                        <div className="text-xs text-neutral-400">Streak atual</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-400">7 dias</span>
                        <span className="text-white">{completionRate7}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate7}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-400">30 dias</span>
                        <span className="text-white">{completionRate30}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionRate30}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <Badge
                        className={isDone ? "bg-green-500/20 text-green-500" : "bg-neutral-500/20 text-neutral-400"}
                      >
                        {isDone ? "CONCLUÍDO" : "PENDENTE"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}

            {habits.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 mb-2">Nenhum hábito cadastrado</p>
                <p className="text-xs text-neutral-500">Clique em "Novo Hábito" para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
