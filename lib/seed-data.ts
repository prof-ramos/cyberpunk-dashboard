import type { AppData } from "./types"
import { saveData, getTodayString } from "./storage"

export function seedMockData(): void {
  const today = getTodayString()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
  const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0]

  const mockData: AppData = {
    studySessions: [
      {
        id: "1",
        subject: "Matemática",
        method: "Pomodoro",
        durationMin: 90,
        date: today,
      },
      {
        id: "2",
        subject: "Física",
        method: "Revisão",
        durationMin: 60,
        date: yesterdayStr,
      },
      {
        id: "3",
        subject: "Química",
        method: "Exercícios",
        durationMin: 120,
        date: twoDaysAgoStr,
      },
    ],
    habits: [
      {
        id: "1",
        name: "Leitura",
        targetPerDay: 1,
        history: [
          { date: today, done: true },
          { date: yesterdayStr, done: true },
          { date: twoDaysAgoStr, done: false },
        ],
      },
      {
        id: "2",
        name: "Exercício",
        targetPerDay: 1,
        history: [
          { date: today, done: false },
          { date: yesterdayStr, done: true },
          { date: twoDaysAgoStr, done: true },
        ],
      },
      {
        id: "3",
        name: "Meditação",
        targetPerDay: 1,
        history: [
          { date: today, done: true },
          { date: yesterdayStr, done: false },
          { date: twoDaysAgoStr, done: true },
        ],
      },
    ],
    meals: [
      {
        id: "1",
        date: today,
        items: [
          {
            name: "Aveia com frutas",
            kcal: 350,
            macros: { protein: 12, carbs: 60, fat: 8 },
          },
          {
            name: "Peito de frango grelhado",
            kcal: 280,
            macros: { protein: 35, carbs: 0, fat: 12 },
          },
        ],
        totals: {
          kcal: 630,
          protein: 47,
          carbs: 60,
          fat: 20,
        },
      },
      {
        id: "2",
        date: yesterdayStr,
        items: [
          {
            name: "Salada com salmão",
            kcal: 420,
            macros: { protein: 28, carbs: 15, fat: 25 },
          },
        ],
        totals: {
          kcal: 420,
          protein: 28,
          carbs: 15,
          fat: 25,
        },
      },
    ],
    workouts: [
      {
        id: "1",
        date: today,
        exercises: [
          { name: "Supino", sets: 3, reps: 10, weight: 80 },
          { name: "Agachamento", sets: 4, reps: 12, weight: 100 },
          { name: "Remada", sets: 3, reps: 8, weight: 70 },
        ],
        volume: 2940, // calculated total volume
      },
      {
        id: "2",
        date: twoDaysAgoStr,
        exercises: [
          { name: "Deadlift", sets: 3, reps: 5, weight: 120 },
          { name: "Pull-ups", sets: 3, reps: 8, weight: 0 },
          { name: "Dips", sets: 3, reps: 12, weight: 0 },
        ],
        volume: 1800,
      },
    ],
  }

  saveData(mockData)
  console.log("Mock data seeded successfully!")
}
