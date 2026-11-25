/**
 * Persistencia local de Palabra (localStorage). Solo el modo diario guarda
 * progreso y estadísticas; el modo libre no se guarda.
 */
import { MAX_ATTEMPTS } from "./logic"

const STORAGE_KEY = "rompecoco:palabra"

export interface PalabraStats {
  played: number
  wins: number
  currentStreak: number
  maxStreak: number
  /** distribution[i] = partidas ganadas en i + 1 intentos */
  distribution: number[]
  lastWonDay: number | null
  /** Último día diario terminado (ganado o perdido), para no contarlo dos veces */
  lastCompletedDay: number | null
}

export interface PalabraSave {
  version: 1
  daily: { day: number; guesses: string[] } | null
  stats: PalabraStats
  seenHelp: boolean
}

export function emptyStats(): PalabraStats {
  return {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: Array(MAX_ATTEMPTS).fill(0),
    lastWonDay: null,
    lastCompletedDay: null,
  }
}

function emptySave(): PalabraSave {
  return { version: 1, daily: null, stats: emptyStats(), seenHelp: false }
}

export function loadSave(): PalabraSave {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySave()
    const parsed = JSON.parse(raw) as PalabraSave
    if (parsed.version !== 1) return emptySave()
    return { ...emptySave(), ...parsed, stats: { ...emptyStats(), ...parsed.stats } }
  } catch {
    return emptySave()
  }
}

export function writeSave(save: PalabraSave) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save))
  } catch {
    // Almacenamiento lleno o bloqueado: el juego sigue funcionando sin guardar.
  }
}

/** Registra el final de una partida diaria. Idempotente por día. */
export function recordResult(
  stats: PalabraStats,
  day: number,
  won: boolean,
  attempts: number
): PalabraStats {
  if (stats.lastCompletedDay === day) return stats

  const next: PalabraStats = {
    ...stats,
    distribution: [...stats.distribution],
    played: stats.played + 1,
    lastCompletedDay: day,
  }

  if (won) {
    next.wins += 1
    next.distribution[attempts - 1] += 1
    next.currentStreak =
      stats.lastWonDay === day - 1 ? stats.currentStreak + 1 : 1
    next.maxStreak = Math.max(next.maxStreak, next.currentStreak)
    next.lastWonDay = day
  } else {
    next.currentStreak = 0
  }

  return next
}

/** La racha se rompe si el último día ganado no fue hoy ni ayer. */
export function getEffectiveStreak(stats: PalabraStats, today: number): number {
  if (stats.lastWonDay === null || stats.lastWonDay < today - 1) return 0
  return stats.currentStreak
}
