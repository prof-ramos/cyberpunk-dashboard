import { type AppData, AppDataSchema, type StudySession, type Habit, type Meal, type Workout } from "./types"
import { seedMockData } from "./seed-data"

const STORAGE_KEY = "productivity-dashboard-data"

// Default empty data structure
const defaultData: AppData = {
  studySessions: [],
  habits: [],
  meals: [],
  workouts: [],
}

// Get all data from localStorage
export function getData(): AppData {
  if (typeof window === "undefined") return defaultData

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultData

    const parsed = JSON.parse(stored)
    return AppDataSchema.parse(parsed)
  } catch (error) {
    console.error("Error loading data from localStorage:", error)
    return defaultData
  }
}

// Save all data to localStorage
export function saveData(data: AppData): void {
  if (typeof window === "undefined") return

  try {
    const validated = AppDataSchema.parse(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated))
  } catch (error) {
    console.error("Error saving data to localStorage:", error)
  }
}

// Study Sessions
export function getStudySessions(): StudySession[] {
  return getData().studySessions
}

export function addStudySession(session: Omit<StudySession, "id">): void {
  const data = getData()
  const newSession: StudySession = {
    ...session,
    id: crypto.randomUUID(),
  }
  data.studySessions.push(newSession)
  saveData(data)
}

export function updateStudySession(id: string, updates: Partial<StudySession>): void {
  const data = getData()
  const index = data.studySessions.findIndex((s) => s.id === id)
  if (index !== -1) {
    data.studySessions[index] = { ...data.studySessions[index], ...updates }
    saveData(data)
  }
}

export function deleteStudySession(id: string): void {
  const data = getData()
  data.studySessions = data.studySessions.filter((s) => s.id !== id)
  saveData(data)
}

// Habits
export function getHabits(): Habit[] {
  return getData().habits
}

export function addHabit(habit: Omit<Habit, "id">): void {
  const data = getData()
  const newHabit: Habit = {
    ...habit,
    id: crypto.randomUUID(),
  }
  data.habits.push(newHabit)
  saveData(data)
}

export function updateHabit(id: string, updates: Partial<Habit>): void {
  const data = getData()
  const index = data.habits.findIndex((h) => h.id === id)
  if (index !== -1) {
    data.habits[index] = { ...data.habits[index], ...updates }
    saveData(data)
  }
}

export function toggleHabitForDate(habitId: string, date: string): void {
  const data = getData()
  const habit = data.habits.find((h) => h.id === habitId)
  if (!habit) return

  const existingEntry = habit.history.find((h) => h.date === date)
  if (existingEntry) {
    existingEntry.done = !existingEntry.done
  } else {
    habit.history.push({ date, done: true })
  }

  saveData(data)
}

export function deleteHabit(id: string): void {
  const data = getData()
  data.habits = data.habits.filter((h) => h.id !== id)
  saveData(data)
}

// Meals
export function getMeals(): Meal[] {
  return getData().meals
}

export function addMeal(meal: Omit<Meal, "id">): void {
  const data = getData()
  const newMeal: Meal = {
    ...meal,
    id: crypto.randomUUID(),
  }
  data.meals.push(newMeal)
  saveData(data)
}

export function updateMeal(id: string, updates: Partial<Meal>): void {
  const data = getData()
  const index = data.meals.findIndex((m) => m.id === id)
  if (index !== -1) {
    data.meals[index] = { ...data.meals[index], ...updates }
    saveData(data)
  }
}

export function deleteMeal(id: string): void {
  const data = getData()
  data.meals = data.meals.filter((m) => m.id !== id)
  saveData(data)
}

// Workouts
export function getWorkouts(): Workout[] {
  return getData().workouts
}

export function addWorkout(workout: Omit<Workout, "id">): void {
  const data = getData()
  const newWorkout: Workout = {
    ...workout,
    id: crypto.randomUUID(),
  }
  data.workouts.push(newWorkout)
  saveData(data)
}

export function updateWorkout(id: string, updates: Partial<Workout>): void {
  const data = getData()
  const index = data.workouts.findIndex((w) => w.id === id)
  if (index !== -1) {
    data.workouts[index] = { ...data.workouts[index], ...updates }
    saveData(data)
  }
}

export function deleteWorkout(id: string): void {
  const data = getData()
  data.workouts = data.workouts.filter((w) => w.id !== id)
  saveData(data)
}

// Utility functions for calculations
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0]
}

export function getWeekAgoString(): string {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date.toISOString().split("T")[0]
}

export function getMonthAgoString(): string {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return date.toISOString().split("T")[0]
}

export { seedMockData }
