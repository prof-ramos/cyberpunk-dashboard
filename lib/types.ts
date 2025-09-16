import { z } from "zod"

// Study Session Schema
export const StudySessionSchema = z.object({
  id: z.string(),
  subject: z.string(),
  method: z.string(),
  durationMin: z.number().positive(),
  date: z.string(), // ISO date string
})

export type StudySession = z.infer<typeof StudySessionSchema>

// Habit Schema
export const HabitHistorySchema = z.object({
  date: z.string(), // ISO date string
  done: z.boolean(),
})

export const HabitSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetPerDay: z.number().positive(),
  history: z.array(HabitHistorySchema),
})

export type Habit = z.infer<typeof HabitSchema>
export type HabitHistory = z.infer<typeof HabitHistorySchema>

// Meal Schema
export const MealItemSchema = z.object({
  name: z.string(),
  kcal: z.number().nonnegative(),
  macros: z.object({
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fat: z.number().nonnegative(),
  }),
})

export const MealSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date string
  items: z.array(MealItemSchema),
  totals: z.object({
    kcal: z.number().nonnegative(),
    protein: z.number().nonnegative(),
    carbs: z.number().nonnegative(),
    fat: z.number().nonnegative(),
  }),
})

export type Meal = z.infer<typeof MealSchema>
export type MealItem = z.infer<typeof MealItemSchema>

// Workout Schema
export const ExerciseSchema = z.object({
  name: z.string(),
  sets: z.number().positive(),
  reps: z.number().positive(),
  weight: z.number().nonnegative(),
})

export const WorkoutSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date string
  exercises: z.array(ExerciseSchema),
  volume: z.number().nonnegative(), // total volume in kg
})

export type Workout = z.infer<typeof WorkoutSchema>
export type Exercise = z.infer<typeof ExerciseSchema>

// App Data Schema
export const AppDataSchema = z.object({
  studySessions: z.array(StudySessionSchema),
  habits: z.array(HabitSchema),
  meals: z.array(MealSchema),
  workouts: z.array(WorkoutSchema),
})

export type AppData = z.infer<typeof AppDataSchema>
