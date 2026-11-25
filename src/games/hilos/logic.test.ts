import { describe, expect, it } from "vitest"

import {
  availableHints,
  buildShareText,
  COLS,
  colOf,
  evaluateSelection,
  getPuzzleForDay,
  isAdjacent,
  nextHintIndex,
  pressCell,
  rowOf,
  ROWS,
  wordFromPath,
} from "./logic"
import { PUZZLES } from "./puzzles.generated"

describe("tableros generados", () => {
  it.each(PUZZLES.map((p) => [p.id, p] as const))("%s es válido", (_, puzzle) => {
    expect(puzzle.grid).toHaveLength(ROWS * COLS)

    // Las palabras cubren todas las casillas exactamente una vez
    const cells = puzzle.words.flatMap((w) => w.path).sort((a, b) => a - b)
    expect(cells).toEqual(Array.from({ length: ROWS * COLS }, (_, i) => i))

    for (const w of puzzle.words) {
      expect(wordFromPath(puzzle, w.path)).toBe(w.word)
      w.path.slice(1).forEach((cell, i) => expect(isAdjacent(w.path[i], cell)).toBe(true))
    }

    // El eje es la primera palabra y une dos lados opuestos
    const eje = puzzle.words[0]
    expect(eje.eje).toBe(true)
    const cols = eje.path.map(colOf)
    const rows = eje.path.map(rowOf)
    const horizontal = cols.includes(0) && cols.includes(COLS - 1)
    const vertical = rows.includes(0) && rows.includes(ROWS - 1)
    expect(horizontal || vertical).toBe(true)

    // Las palabras extra no incluyen las del tema
    const theme = new Set(puzzle.words.map((w) => w.word))
    expect(puzzle.extraWords.some((w) => theme.has(w))).toBe(false)
  })
})

describe("isAdjacent", () => {
  it("acepta las 8 direcciones y rechaza saltos o bordes", () => {
    expect(isAdjacent(0, 1)).toBe(true)
    expect(isAdjacent(0, COLS)).toBe(true)
    expect(isAdjacent(0, COLS + 1)).toBe(true)
    expect(isAdjacent(0, 2)).toBe(false)
    expect(isAdjacent(0, 0)).toBe(false)
    // final de una fila y comienzo de la siguiente no son vecinos
    expect(isAdjacent(COLS - 1, COLS)).toBe(false)
  })
})

describe("pressCell", () => {
  it("marca la primera letra apenas se presiona", () => {
    expect(pressCell([], 7)).toEqual({ path: [7], submitOnRelease: false })
  })
  it("agrega una vecina de la última letra", () => {
    expect(pressCell([0, 1], 2)).toEqual({ path: [0, 1, 2], submitOnRelease: false })
  })
  it("recorta al volver a una letra ya elegida", () => {
    expect(pressCell([0, 1, 2], 1)).toEqual({ path: [0, 1], submitOnRelease: false })
  })
  it("tocar la última letra otra vez envía al soltar", () => {
    expect(pressCell([0, 1], 1)).toEqual({ path: [0, 1], submitOnRelease: true })
  })
  it("una letra lejana empieza una selección nueva", () => {
    expect(pressCell([0, 1], 20)).toEqual({ path: [20], submitOnRelease: false })
  })
})

describe("evaluateSelection", () => {
  const puzzle = PUZZLES[0]
  const theme = puzzle.words[1]

  it("reconoce una palabra del tema por su camino exacto", () => {
    expect(evaluateSelection(puzzle, theme.path, [], [])).toEqual({ kind: "theme", index: 1 })
    expect(evaluateSelection(puzzle, theme.path, [1], [])).toEqual({ kind: "already-theme" })
  })

  it("rechaza selecciones cortas", () => {
    expect(evaluateSelection(puzzle, theme.path.slice(0, 3), [], [])).toEqual({ kind: "too-short" })
  })

  it("el camino al revés no cuenta como palabra del tema", () => {
    const result = evaluateSelection(puzzle, [...theme.path].reverse(), [], [])
    expect(result.kind).not.toBe("theme")
  })
})

describe("pistas", () => {
  it("se gana una pista cada 3 palabras extra", () => {
    expect(availableHints(2, 0)).toBe(0)
    expect(availableHints(3, 0)).toBe(1)
    expect(availableHints(7, 1)).toBe(1)
  })

  it("revela primero palabras del tema y el eje al final", () => {
    const puzzle = PUZZLES[0]
    const allButEje = puzzle.words.map((_, i) => i).filter((i) => i !== 0)
    expect(nextHintIndex(puzzle, [])).not.toBe(0)
    expect(nextHintIndex(puzzle, allButEje)).toBe(0)
    expect(nextHintIndex(puzzle, [0, ...allButEje])).toBeNull()
  })
})

describe("reto diario", () => {
  it("es determinístico y recorre la lista", () => {
    expect(getPuzzleForDay(5).id).toBe(getPuzzleForDay(5).id)
    expect(getPuzzleForDay(0).id).toBe(PUZZLES[0].id)
    expect(getPuzzleForDay(PUZZLES.length).id).toBe(PUZZLES[0].id)
  })
})

describe("buildShareText", () => {
  it("muestra el orden de hallazgos en filas de 4", () => {
    expect(
      buildShareText({
        events: ["word", "hint", "word", "eje", "word"],
        clue: "Tema",
        puzzleNumber: 3,
      })
    ).toBe("Rompecoco · Hilos #3\n«Tema»\n🟣💡🟣🟠\n🟣")
  })
})
