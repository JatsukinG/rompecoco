/**
 * Generador de tableros de Hilos.
 *
 * Lee content/hilos.json (tema + palabras) y, para cada tablero:
 *   1. Coloca la "palabra eje" como un camino que une dos lados opuestos.
 *   2. Reparte el resto de palabras como caminos de casillas vecinas
 *      (8 direcciones) hasta cubrir el tablero entero, sin cruces en diagonal.
 *   3. Calcula las "palabras extra" (válidas en el diccionario, de 4+ letras)
 *      que se pueden trazar en el tablero, para el sistema de pistas.
 *
 * Es determinístico: misma entrada → mismo tablero (semilla por id).
 * Salida: src/games/hilos/puzzles.generated.ts
 *
 * Uso: pnpm puzzles:hilos
 */
import { readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)

const ROWS = 8
const COLS = 6
const SIZE = ROWS * COLS
const MIN_WORD = 4
const MAX_EXTRA_WORD = 10
const MAX_ATTEMPTS = 4000
const MAX_STEPS_PER_ATTEMPT = 40_000

/** Misma normalización que src/games/palabra/logic.ts */
function normalizeWord(value) {
  return value
    .normalize("NFC")
    .toLowerCase()
    .replace(/ñ/g, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(//g, "ñ")
}

function hashString(value) {
  let h = 2166136261
  for (const ch of value) h = Math.imul(h ^ ch.codePointAt(0), 16777619)
  return h >>> 0
}

function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(list, random) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const rowOf = (i) => Math.floor(i / COLS)
const colOf = (i) => i % COLS

const NEIGHBORS = Array.from({ length: SIZE }, (_, i) => {
  const result = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue
      const r = rowOf(i) + dr
      const c = colOf(i) + dc
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) result.push(r * COLS + c)
    }
  }
  return result
})

/** Estado de colocación: dueño de cada casilla + aristas usadas (para evitar cruces). */
class Board {
  constructor() {
    this.owner = new Array(SIZE).fill(-1)
    this.edges = new Set()
  }
  edgeKey(a, b) {
    return a < b ? `${a}-${b}` : `${b}-${a}`
  }
  /** ¿La diagonal a→b cruza otra diagonal ya trazada? */
  crosses(a, b) {
    const dr = rowOf(b) - rowOf(a)
    const dc = colOf(b) - colOf(a)
    if (!dr || !dc) return false
    const x = rowOf(a) * COLS + colOf(b)
    const y = rowOf(b) * COLS + colOf(a)
    return this.edges.has(this.edgeKey(x, y))
  }
  place(path, id) {
    path.forEach((cell, i) => {
      this.owner[cell] = id
      if (i > 0) this.edges.add(this.edgeKey(path[i - 1], cell))
    })
  }
}

/** Cada región vacía (conexa en 8 direcciones) debe poder llenarse con palabras restantes. */
function regionsOk(board, lengths) {
  const seen = new Uint8Array(SIZE)
  for (let start = 0; start < SIZE; start++) {
    if (board.owner[start] !== -1 || seen[start]) continue
    let size = 0
    const stack = [start]
    seen[start] = 1
    while (stack.length) {
      const cell = stack.pop()
      size++
      for (const n of NEIGHBORS[cell]) {
        if (board.owner[n] === -1 && !seen[n]) {
          seen[n] = 1
          stack.push(n)
        }
      }
    }
    if (!subsetSum(lengths, size)) return false
  }
  return true
}

function subsetSum(lengths, target) {
  const reachable = new Uint8Array(target + 1)
  reachable[0] = 1
  for (const len of lengths) {
    for (let s = target; s >= len; s--) if (reachable[s - len]) reachable[s] = 1
  }
  return reachable[target] === 1
}

/** Camino aleatorio de `length` casillas que toca dos lados opuestos. */
function spanningPath(board, length, random) {
  const options = []
  if (length >= COLS) options.push("horizontal")
  if (length >= ROWS) options.push("vertical")
  const orientation = options[Math.floor(random() * options.length)]
  const starts =
    orientation === "horizontal"
      ? Array.from({ length: ROWS }, (_, r) => r * COLS)
      : Array.from({ length: COLS }, (_, c) => c)
  const reachesEnd = (cell) =>
    orientation === "horizontal" ? colOf(cell) === COLS - 1 : rowOf(cell) === ROWS - 1
  // Distancia mínima restante hasta el lado opuesto
  const distance = (cell) =>
    orientation === "horizontal" ? COLS - 1 - colOf(cell) : ROWS - 1 - rowOf(cell)

  const start = starts[Math.floor(random() * starts.length)]
  const path = [start]
  const used = new Set(path)

  function walk() {
    const last = path.at(-1)
    if (path.length === length) return reachesEnd(last)
    for (const n of shuffle(NEIGHBORS[last], random)) {
      if (used.has(n) || board.crosses(last, n)) continue
      // No llegar al lado final antes de tiempo, y que siga siendo alcanzable
      if (reachesEnd(n) && path.length + 1 < length) continue
      if (distance(n) > length - path.length - 1) continue
      path.push(n)
      used.add(n)
      board.edges.add(board.edgeKey(last, n))
      if (walk()) return true
      board.edges.delete(board.edgeKey(last, n))
      used.delete(n)
      path.pop()
    }
    return false
  }

  const ok = walk()
  // walk() deja aristas puestas; las limpiamos y place() las volverá a poner
  for (let i = 1; i < path.length; i++) board.edges.delete(board.edgeKey(path[i - 1], path[i]))
  return ok ? path : null
}

function layoutPuzzle(words, random) {
  const board = new Board()
  const eje = words[0]
  const ejePath = spanningPath(board, eje.length, random)
  if (!ejePath) return null
  board.place(ejePath, 0)

  const paths = [ejePath]
  let steps = 0

  const remaining = words.slice(1).map((word, i) => ({ word, id: i + 1 }))
  if (!regionsOk(board, remaining.map((w) => w.word.length))) return null

  function solve(pending) {
    if (!pending.length) return true
    if (++steps > MAX_STEPS_PER_ATTEMPT) return false
    const first = board.owner.indexOf(-1)
    for (const item of shuffle(pending, random)) {
      for (const reversed of random() < 0.5 ? [false, true] : [true, false]) {
        const others = pending.filter((p) => p !== item)
        const path = [first]
        board.owner[first] = item.id

        const extend = () => {
          if (++steps > MAX_STEPS_PER_ATTEMPT) return false
          if (path.length === item.word.length) {
            // Casillas y aristas ya están marcadas durante la extensión
            if (!regionsOk(board, others.map((o) => o.word.length))) return false
            paths[item.id] = reversed ? [...path].reverse() : [...path]
            return solve(others)
          }
          const last = path.at(-1)
          for (const n of shuffle(NEIGHBORS[last], random)) {
            if (board.owner[n] !== -1 || board.crosses(last, n)) continue
            path.push(n)
            board.owner[n] = item.id
            board.edges.add(board.edgeKey(last, n))
            if (extend()) return true
            board.edges.delete(board.edgeKey(last, n))
            board.owner[n] = -1
            path.pop()
          }
          return false
        }

        if (extend()) return true
        board.owner[first] = -1
      }
    }
    return false
  }

  return solve(remaining) ? paths : null
}

function loadDictionary() {
  const words = require("an-array-of-spanish-words")
  const valid = new Set()
  const prefixes = new Set()
  for (const raw of words) {
    const word = normalizeWord(raw)
    if (word.length < MIN_WORD || word.length > MAX_EXTRA_WORD) continue
    if (!/^[a-zñ]+$/.test(word)) continue
    valid.add(word)
    for (let i = 1; i < word.length; i++) prefixes.add(word.slice(0, i))
  }
  return { valid, prefixes }
}

/** Todas las palabras del diccionario que se pueden trazar en el tablero. */
function findTraceableWords(grid, dictionary) {
  const found = new Set()
  const used = new Uint8Array(SIZE)
  const visit = (cell, prefix) => {
    const word = prefix + grid[cell]
    if (!dictionary.prefixes.has(word) && !dictionary.valid.has(word)) return
    if (word.length >= MIN_WORD && dictionary.valid.has(word)) found.add(word)
    if (word.length >= MAX_EXTRA_WORD) return
    used[cell] = 1
    for (const n of NEIGHBORS[cell]) if (!used[n]) visit(n, word)
    used[cell] = 0
  }
  for (let cell = 0; cell < SIZE; cell++) visit(cell, "")
  return found
}

// ── Main ──────────────────────────────────────────────────────────────────
const root = new URL("..", import.meta.url)
const source = JSON.parse(readFileSync(new URL("content/hilos.json", root), "utf8"))
const dictionary = loadDictionary()
const output = []
let failed = false

for (const puzzle of source.puzzles) {
  const display = [puzzle.eje, ...puzzle.words]
  const words = display.map(normalizeWord)
  const total = words.reduce((sum, w) => sum + w.length, 0)

  const problems = []
  if (total !== SIZE) problems.push(`suma ${total} letras (debe ser ${SIZE})`)
  if (words[0].length < COLS) problems.push(`el eje debe tener al menos ${COLS} letras`)
  for (const w of words) if (w.length < MIN_WORD) problems.push(`"${w}" tiene menos de ${MIN_WORD} letras`)
  if (new Set(words).size !== words.length) problems.push("hay palabras repetidas")
  if (problems.length) {
    console.error(`✖ ${puzzle.id}: ${problems.join("; ")}`)
    failed = true
    continue
  }

  const random = mulberry32(hashString(puzzle.id))
  let paths = null
  let attempt = 0
  while (!paths && attempt++ < MAX_ATTEMPTS) paths = layoutPuzzle(words, random)
  if (!paths) {
    console.error(`✖ ${puzzle.id}: no se encontró una distribución (prueba otras palabras)`)
    failed = true
    continue
  }

  const grid = new Array(SIZE)
  paths.forEach((path, i) => path.forEach((cell, j) => (grid[cell] = [...words[i]][j])))

  const themeSet = new Set(words)
  const extraWords = [...findTraceableWords(grid, dictionary)]
    .filter((w) => !themeSet.has(w))
    .sort()

  output.push({
    id: puzzle.id,
    clue: puzzle.clue,
    grid: grid.join(""),
    words: words.map((word, i) => ({
      word,
      display: display[i],
      path: paths[i],
      ...(i === 0 ? { eje: true } : {}),
    })),
    extraWords,
  })
  console.log(
    `✔ ${puzzle.id.padEnd(10)} ${attempt} intento(s), ${extraWords.length} palabras extra`
  )
}

if (failed) process.exit(1)

const file = `// Archivo generado por scripts/generate-hilos-puzzles.mjs a partir de content/hilos.json.
// No editar a mano: edita content/hilos.json y ejecuta \`pnpm puzzles:hilos\`.
import type { HilosPuzzle } from "./types"

export const ROWS = ${ROWS}
export const COLS = ${COLS}

export const PUZZLES: HilosPuzzle[] = ${JSON.stringify(output)}
`
const target = fileURLToPath(new URL("src/games/hilos/puzzles.generated.ts", root))
writeFileSync(target, file)
console.log(`\n${output.length} tableros escritos en ${target}`)
