/**
 * Utilidades del "reto diario", compartidas por todos los juegos.
 * El día 0 es el 1 de enero de 2026 (fecha local) → reto #1.
 */

const EPOCH = { year: 2026, month: 0, day: 1 }
const DAY_MS = 86_400_000

/** Número de día (local) desde el 1 de enero de 2026. */
export function getDayNumber(date = new Date()): number {
  const today = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const epoch = Date.UTC(EPOCH.year, EPOCH.month, EPOCH.day)
  return Math.floor((today - epoch) / DAY_MS)
}

/** Milisegundos hasta la próxima medianoche local (nuevo reto diario). */
export function msUntilNextDay(date = new Date()): number {
  const next = new Date(date)
  next.setHours(24, 0, 0, 0)
  return next.getTime() - date.getTime()
}

/** Índice determinístico y no negativo dentro de una lista para un día dado. */
export function indexForDay(day: number, length: number): number {
  return ((day % length) + length) % length
}
