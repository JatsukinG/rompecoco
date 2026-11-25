/**
 * Reglas puras de Palabra (sin React). Ver docs/juegos/palabra.md.
 */
import { indexForDay } from "@/lib/daily"

import { SOLUTIONS } from "./words/solutions"
import { VALID_WORDS } from "./words/valid-words"

export const WORD_LENGTH = 5
export const MAX_ATTEMPTS = 6

/** hit = letra y posición correctas · near = está en otra posición · miss = no está */
export type LetterState = "hit" | "near" | "miss"

export type GameStatus = "playing" | "won" | "lost"

export { getDayNumber, msUntilNextDay } from "@/lib/daily"


/**
 * Minúsculas y sin tildes ni diéresis (á→a, ü→u), pero conservando la ñ como
 * letra propia.
 */
export function normalizeWord(value: string): string {
  return value
    .normalize("NFC")
    .toLowerCase()
    .replace(/ñ/g, "\uE000")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\uE000/g, "ñ")
}

/** Normaliza una sola tecla; devuelve null si no es una letra válida. */
export function normalizeLetter(key: string): string | null {
  if ([...key].length !== 1) return null
  const letter = normalizeWord(key)
  return /^[a-zñ]$/.test(letter) ? letter : null
}

const NORMALIZED_SOLUTIONS = SOLUTIONS.map(normalizeWord)

let validSet: Set<string> | null = null

export function isValidWord(word: string): boolean {
  validSet ??= new Set([...VALID_WORDS.split(" "), ...NORMALIZED_SOLUTIONS])
  return validSet.has(normalizeWord(word))
}

/**
 * Evalúa un intento contra la solución (ambos normalizados).
 *
 * Letras repetidas: primero se marcan los aciertos exactos y luego cada letra
 * restante solo puede ser "near" tantas veces como aparezca, sin contar las
 * ya acertadas.
 */
export function evaluateGuess(guess: string, solution: string): LetterState[] {
  const g = [...guess]
  const s = [...solution]
  const result: LetterState[] = g.map(() => "miss")
  const remaining = new Map<string, number>()

  g.forEach((letter, i) => {
    if (letter === s[i]) {
      result[i] = "hit"
    } else {
      remaining.set(s[i], (remaining.get(s[i]) ?? 0) + 1)
    }
  })

  g.forEach((letter, i) => {
    if (result[i] === "hit") return
    const count = remaining.get(letter) ?? 0
    if (count > 0) {
      result[i] = "near"
      remaining.set(letter, count - 1)
    }
  })

  return result
}

const STATE_RANK: Record<LetterState, number> = { miss: 0, near: 1, hit: 2 }

/** Mejor estado conocido de cada letra, para pintar el teclado. */
export function getKeyStates(
  guesses: string[],
  solution: string
): Record<string, LetterState> {
  const states: Record<string, LetterState> = {}
  for (const guess of guesses) {
    const evaluation = evaluateGuess(guess, solution)
    ;[...guess].forEach((letter, i) => {
      const current = states[letter]
      if (!current || STATE_RANK[evaluation[i]] > STATE_RANK[current]) {
        states[letter] = evaluation[i]
      }
    })
  }
  return states
}

export function getStatus(guesses: string[], solution: string): GameStatus {
  if (guesses.at(-1) === solution) return "won"
  if (guesses.length >= MAX_ATTEMPTS) return "lost"
  return "playing"
}

/** PRNG determinístico (mulberry32). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SHUFFLE_SEED = 20260101

let dailyOrder: string[] | null = null

function getDailyOrder(): string[] {
  if (dailyOrder) return dailyOrder
  const random = mulberry32(SHUFFLE_SEED)
  const order = [...SOLUTIONS]
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  dailyOrder = order
  return order
}

/** Solución (con tildes, para mostrar) del día indicado. */
export function getDailySolution(day: number): string {
  const order = getDailyOrder()
  return order[indexForDay(day, order.length)]
}

/** Solución aleatoria para el modo libre, distinta de la indicada. */
export function getRandomSolution(exclude?: string): string {
  let word: string
  do {
    word = SOLUTIONS[Math.floor(Math.random() * SOLUTIONS.length)]
  } while (SOLUTIONS.length > 1 && word === exclude)
  return word
}

const SHARE_EMOJI: Record<LetterState, string> = {
  hit: "🟩",
  near: "🟧",
  miss: "⬜",
}

/** Texto para compartir el resultado sin revelar la palabra. */
export function buildShareText(options: {
  guesses: string[]
  solution: string
  puzzleNumber?: number
}): string {
  const { guesses, solution, puzzleNumber } = options
  const won = getStatus(guesses, solution) === "won"
  const score = won ? guesses.length : "X"
  const title = puzzleNumber
    ? `Rompecoco · Palabra #${puzzleNumber} ${score}/${MAX_ATTEMPTS}`
    : `Rompecoco · Palabra (libre) ${score}/${MAX_ATTEMPTS}`
  const grid = guesses
    .map((guess) =>
      evaluateGuess(guess, solution)
        .map((state) => SHARE_EMOJI[state])
        .join("")
    )
    .join("\n")
  return `${title}\n\n${grid}`
}
