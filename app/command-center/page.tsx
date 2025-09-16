"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getStudySessions, getHabits, getMeals, getWorkouts, getTodayString, seedMockData } from "@/lib/storage"
import type { StudySession, Habit, Meal, Workout } from "@/lib/types"
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

export default function OverviewPage() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [workouts, setWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    // Seed mock data if no data exists
    const existingData = getStudySessions()
    if (existingData.length === 0) {
      seedMockData()
    }

    setStudySessions(getStudySessions())
    setHabits(getHabits())
    setMeals(getMeals())
    setWorkouts(getWorkouts())
  }, [])

  const today = getTodayString()

  // Calculate today's metrics
  const todayStudyHours =
    studySessions.filter((s) => s.date === today).reduce((total, s) => total + s.durationMin, 0) / 60

  const todayHabitsCompleted = habits.filter((h) =>
    h.history.some((entry) => entry.date === today && entry.done),
  ).length

  const todayCalories = meals.filter((m) => m.date === today).reduce((total, m) => total + m.totals.kcal, 0)

  const todayWorkout = workouts.find((w) => w.date === today)

  // Calculate weekly progress
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const weeklyStudyData = last7Days.map((date) => ({
    date: new Date(date).toLocaleDateString("pt-BR", { weekday: "short" }),
    hours: studySessions.filter((s) => s.date === date).reduce((total, s) => total + s.durationMin, 0) / 60,
  }))

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
  }))

  const COLORS = ["#f97316", "#ffffff", "#737373", "#404040"]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Summary */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">HOJE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{todayStudyHours.toFixed(1)}h</div>
                <div className="text-xs text-neutral-500">Estudos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">
                  {todayHabitsCompleted}/{habits.length}
                </div>
                <div className="text-xs text-neutral-500">Hábitos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{Math.round(todayCalories)}</div>
                <div className="text-xs text-neutral-500">Calorias</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white font-mono">{todayWorkout ? "✓" : "—"}</div>
                <div className="text-xs text-neutral-500">Treino</div>
              </div>
            </div>

            <div className="space-y-2">
              {habits.slice(0, 4).map((habit) => {
                const todayEntry = habit.history.find((h) => h.date === today)
                const isDone = todayEntry?.done || false
                return (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-2 bg-neutral-800 rounded hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isDone ? "bg-green-500" : "bg-neutral-500"}`}></div>
                      <div>
                        <div className="text-xs text-white">{habit.name}</div>
                        <div className="text-xs text-neutral-500">{isDone ? "Concluído" : "Pendente"}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">ATIVIDADE RECENTE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {studySessions.slice(0, 5).map((session, index) => (
                <div
                  key={index}
                  className="text-xs border-l-2 border-orange-500 pl-3 hover:bg-neutral-800 p-2 rounded transition-colors"
                >
                  <div className="text-neutral-500 font-mono">{new Date(session.date).toLocaleDateString("pt-BR")}</div>
                  <div className="text-white">
                    Estudou <span className="text-orange-500 font-mono">{session.subject}</span> por{" "}
                    <span className="text-white font-mono">{session.durationMin} min</span>
                    <span className="text-neutral-400"> usando {session.method}</span>
                  </div>
                </div>
              ))}

              {workouts.slice(0, 2).map((workout, index) => (
                <div
                  key={`workout-${index}`}
                  className="text-xs border-l-2 border-green-500 pl-3 hover:bg-neutral-800 p-2 rounded transition-colors"
                >
                  <div className="text-neutral-500 font-mono">{new Date(workout.date).toLocaleDateString("pt-BR")}</div>
                  <div className="text-white">
                    Treinou <span className="text-green-500 font-mono">{workout.exercises.length} exercícios</span>
                    <span className="text-neutral-400"> - Volume: {workout.volume}kg</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PROGRESSO SEMANAL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-neutral-400">Meta de Estudos</span>
                  <span className="text-white">{todayStudyHours.toFixed(1)}h / 3h</span>
                </div>
                <Progress value={(todayStudyHours / 3) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-neutral-400">Hábitos Diários</span>
                  <span className="text-white">
                    {todayHabitsCompleted} / {habits.length}
                  </span>
                </div>
                <Progress value={(todayHabitsCompleted / habits.length) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-neutral-400">Meta Calórica</span>
                  <span className="text-white">{Math.round(todayCalories)} / 2000</span>
                </div>
                <Progress value={(todayCalories / 2000) * 100} className="h-2" />
              </div>

              <div className="pt-4 border-t border-neutral-700">
                <div className="text-xs text-neutral-400 mb-2">Streak Atual</div>
                <div className="text-2xl font-bold text-orange-500 font-mono">7 dias</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Hours Chart */}
        <Card className="lg:col-span-8 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              HORAS DE ESTUDO - ÚLTIMOS 7 DIAS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyStudyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="date" stroke="#737373" fontSize={12} fontFamily="monospace" />
                  <YAxis stroke="#737373" fontSize={12} fontFamily="monospace" />
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
        <Card className="lg:col-span-4 bg-neutral-900 border-neutral-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
              DISTRIBUIÇÃO POR MATÉRIA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
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

            <div className="space-y-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-neutral-400">{entry.name}</span>
                  </div>
                  <span className="text-white font-mono">{Math.round(entry.value / 60)}h</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
