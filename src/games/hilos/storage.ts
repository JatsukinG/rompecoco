/**
 * Persistencia local de Hilos (localStorage). Solo el modo diario guarda
 * progreso y estadísticas.
 */
import type { HilosEvent } from "./logic"

const STORAGE_KEY = "rompecoco:hilos"

export interface HilosProgress {
  day: number
  puzzleId: string
  /** Índices de palabras encontradas, en orden */
  found: number[]
  extras: string[]
  hintsUsed: number
  /** Palabra marcada por la pista activa */
  hintIndex: number | null
  events: HilosEvent[]
}

export interface HilosStats {
  /** Retos diarios completados */
  completed: number
  /** Completados sin usar pistas */
  perfect: number
  currentStreak: number
  maxStreak: number
  lastCompletedDay: number | null
}

export interface HilosSave {
  version: 1
  daily: HilosProgress | null
  stats: HilosStats
  seenHelp: boolean
}

export function emptyStats(): HilosStats {
  return { completed: 0, perfect: 0, currentStreak: 0, maxStreak: 0, lastCompletedDay: null }
}

function emptySave(): HilosSave {
  return { version: 1, daily: null, stats: emptyStats(), seenHelp: false }
}

export function loadSave(): HilosSave {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySave()
    const parsed = JSON.parse(raw) as HilosSave
    if (parsed.version !== 1) return emptySave()
    return { ...emptySave(), ...parsed, stats: { ...emptyStats(), ...parsed.stats } }
  } catch {
    return emptySave()
  }
}

export function writeSave(save: HilosSave) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
  } catch {
    // Almacenamiento lleno o bloqueado: se sigue jugando sin guardar.
  }
}

/** Registra un reto diario completado. Idempotente por día. */
export function recordCompletion(stats: HilosStats, day: number, hintsUsed: number): HilosStats {
  if (stats.lastCompletedDay === day) return stats
  const currentStreak = stats.lastCompletedDay === day - 1 ? stats.currentStreak + 1 : 1
  return {
    completed: stats.completed + 1,
    perfect: stats.perfect + (hintsUsed === 0 ? 1 : 0),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    lastCompletedDay: day,
  }
}

export function getEffectiveStreak(stats: HilosStats, today: number): number {
  if (stats.lastCompletedDay === null || stats.lastCompletedDay < today - 1) return 0
  return stats.currentStreak
}
