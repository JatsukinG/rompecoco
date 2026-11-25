/**
 * Reglas puras de Hilos (sin React). Ver docs/juegos/hilos.md.
 */
import { indexForDay } from "@/lib/daily"

import { COLS, PUZZLES, ROWS } from "./puzzles.generated"
import type { HilosPuzzle } from "./types"

export { COLS, ROWS }

export const MIN_WORD_LENGTH = 4
/** Palabras extra necesarias para ganar una pista */
export const EXTRAS_PER_HINT = 3

export type SelectionResult =
  | { kind: "theme"; index: number }
  | { kind: "already-theme" }
  | { kind: "wrong-path" }
  | { kind: "extra"; word: string }
  | { kind: "already-extra" }
  | { kind: "too-short" }
  | { kind: "invalid" }

export const rowOf = (cell: number) => Math.floor(cell / COLS)
export const colOf = (cell: number) => cell % COLS

export function isAdjacent(a: number, b: number): boolean {
  if (a === b) return false
  return Math.abs(rowOf(a) - rowOf(b)) <= 1 && Math.abs(colOf(a) - colOf(b)) <= 1
}

export function wordFromPath(puzzle: HilosPuzzle, path: number[]): string {
  return path.map((cell) => puzzle.grid[cell]).join("")
}

/**
 * Qué pasa al presionar una casilla, según la selección actual. Se aplica al
 * presionar (no al soltar) para que la letra se marque de inmediato.
 *
 * - Última letra de la selección → al soltar sin arrastrar, se envía.
 * - Letra ya seleccionada → se recorta la selección hasta ella.
 * - Vecina de la última → se agrega.
 * - Cualquier otra → empieza una selección nueva.
 */
export function pressCell(
  selection: number[],
  cell: number
): { path: number[]; submitOnRelease: boolean } {
  const last = selection.at(-1)
  if (last === cell) return { path: selection, submitOnRelease: true }
  const index = selection.indexOf(cell)
  if (index !== -1) return { path: selection.slice(0, index + 1), submitOnRelease: false }
  if (last !== undefined && isAdjacent(last, cell)) {
    return { path: [...selection, cell], submitOnRelease: false }
  }
  return { path: [cell], submitOnRelease: false }
}

function samePath(a: number[], b: number[]) {
  return a.length === b.length && a.every((cell, i) => cell === b[i])
}

/** Evalúa una selección. Una palabra del tema solo cuenta si sigue su camino exacto. */
export function evaluateSelection(
  puzzle: HilosPuzzle,
  path: number[],
  found: number[],
  extras: string[]
): SelectionResult {
  const word = wordFromPath(puzzle, path)
  if (word.length < MIN_WORD_LENGTH) return { kind: "too-short" }

  const index = puzzle.words.findIndex((w) => samePath(w.path, path))
  if (index !== -1) {
    return found.includes(index) ? { kind: "already-theme" } : { kind: "theme", index }
  }
  if (puzzle.words.some((w) => w.word === word)) return { kind: "wrong-path" }
  if (puzzle.extraWords.includes(word)) {
    return extras.includes(word) ? { kind: "already-extra" } : { kind: "extra", word }
  }
  return { kind: "invalid" }
}

export function availableHints(extrasFound: number, hintsUsed: number): number {
  return Math.floor(extrasFound / EXTRAS_PER_HINT) - hintsUsed
}

/** Siguiente palabra a revelar con una pista: primero las del tema, el eje al final. */
export function nextHintIndex(puzzle: HilosPuzzle, found: number[]): number | null {
  const pending = puzzle.words
    .map((w, i) => ({ eje: !!w.eje, i }))
    .filter(({ i }) => !found.includes(i))
  if (!pending.length) return null
  return (pending.find((p) => !p.eje) ?? pending[0]).i
}

export function getPuzzleForDay(day: number): HilosPuzzle {
  return PUZZLES[indexForDay(day, PUZZLES.length)]
}

export function getRandomPuzzle(excludeId?: string): HilosPuzzle {
  const pool = PUZZLES.filter((p) => p.id !== excludeId)
  return pool[Math.floor(Math.random() * pool.length)] ?? PUZZLES[0]
}

export function getPuzzleById(id: string): HilosPuzzle | undefined {
  return PUZZLES.find((p) => p.id === id)
}

export type HilosEvent = "word" | "eje" | "hint"

const SHARE_EMOJI: Record<HilosEvent, string> = {
  word: "🟣",
  eje: "🟠",
  hint: "💡",
}

/** Orden en que se encontraron las palabras y se usaron pistas, sin revelar nada. */
export function buildShareText(options: {
  events: HilosEvent[]
  clue: string
  puzzleNumber?: number
}): string {
  const { events, clue, puzzleNumber } = options
  const title = puzzleNumber
    ? `Rompecoco · Hilos #${puzzleNumber}`
    : "Rompecoco · Hilos (libre)"
  const emojis = events.map((e) => SHARE_EMOJI[e])
  const lines = []
  for (let i = 0; i < emojis.length; i += 4) lines.push(emojis.slice(i, i + 4).join(""))
  return `${title}\n«${clue}»\n${lines.join("\n")}`
}
