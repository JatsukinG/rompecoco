import { describe, expect, it } from "vitest"

import {
  buildShareText,
  evaluateGuess,
  getDailySolution,
  getDayNumber,
  getKeyStates,
  getStatus,
  isValidWord,
  normalizeLetter,
  normalizeWord,
  WORD_LENGTH,
} from "./logic"
import { SOLUTIONS } from "./words/solutions"

describe("normalizeWord", () => {
  it("quita tildes y diéresis pero conserva la ñ", () => {
    expect(normalizeWord("Árbol")).toBe("arbol")
    expect(normalizeWord("pingüino")).toBe("pinguino")
    expect(normalizeWord("SUEÑO")).toBe("sueño")
    // ñ descompuesta (n + tilde combinante)
    expect(normalizeWord("suen\u0303o")).toBe("sueño")
  })
})

describe("normalizeLetter", () => {
  it("acepta letras, incluida la ñ y vocales con tilde", () => {
    expect(normalizeLetter("A")).toBe("a")
    expect(normalizeLetter("ñ")).toBe("ñ")
    expect(normalizeLetter("é")).toBe("e")
  })
  it("rechaza teclas que no son letras", () => {
    expect(normalizeLetter("Enter")).toBeNull()
    expect(normalizeLetter("1")).toBeNull()
    expect(normalizeLetter(" ")).toBeNull()
  })
})

describe("evaluateGuess", () => {
  it("marca aciertos, cercanas y fallos", () => {
    expect(evaluateGuess("mente", "juego")).toEqual([
      "miss", "near", "miss", "miss", "miss",
    ])
    expect(evaluateGuess("juego", "juego")).toEqual([
      "hit", "hit", "hit", "hit", "hit",
    ])
  })

  it("no marca como cercana una letra repetida de más", () => {
    // "perro" tiene una sola "e"; el segundo intento con dos "e" solo marca una
    expect(evaluateGuess("leche", "perro")).toEqual([
      "miss", "hit", "miss", "miss", "miss",
    ])
    expect(evaluateGuess("eeeee", "perro")).toEqual([
      "miss", "hit", "miss", "miss", "miss",
    ])
  })

  it("prioriza el acierto exacto sobre la cercana", () => {
    // "nubla" tiene una sola "a" (al final): las otras "a" del intento no cuentan
    expect(evaluateGuess("aabaa", "nubla")).toEqual([
      "miss", "miss", "hit", "miss", "hit",
    ])
  })

  it("una letra repetida ya acertada no suma otra cercana", () => {
    // "bolsa" tiene una sola "l" y ya se acertó en la posición 2
    expect(evaluateGuess("ollas", "bolsa")).toEqual([
      "near", "miss", "hit", "near", "near",
    ])
  })
})

describe("getKeyStates", () => {
  it("conserva el mejor estado de cada letra", () => {
    const states = getKeyStates(["mente", "juego"], "juego")
    expect(states.e).toBe("hit")
    expect(states.m).toBe("miss")
    expect(states.j).toBe("hit")
  })
})

describe("getStatus", () => {
  it("detecta victoria, derrota y juego en curso", () => {
    expect(getStatus(["mente", "juego"], "juego")).toBe("won")
    expect(getStatus(["mente"], "juego")).toBe("playing")
    expect(getStatus(Array(6).fill("mente"), "juego")).toBe("lost")
  })
})

describe("diccionario", () => {
  it("todas las soluciones son válidas, de 5 letras y únicas", () => {
    const normalized = SOLUTIONS.map(normalizeWord)
    for (const word of normalized) {
      expect(word).toHaveLength(WORD_LENGTH)
      expect(isValidWord(word)).toBe(true)
    }
    expect(new Set(normalized).size).toBe(normalized.length)
  })

  it("acepta plurales y conjugaciones comunes y rechaza basura", () => {
    expect(isValidWord("gatos")).toBe(true)
    expect(isValidWord("cantó")).toBe(true)
    expect(isValidWord("xxxxx")).toBe(false)
  })
})

describe("reto diario", () => {
  it("el día 0 es el 1 de enero de 2026 (hora local)", () => {
    expect(getDayNumber(new Date(2026, 0, 1, 0, 1))).toBe(0)
    expect(getDayNumber(new Date(2026, 0, 1, 23, 59))).toBe(0)
    expect(getDayNumber(new Date(2026, 0, 2, 0, 0))).toBe(1)
  })

  it("es determinístico y cambia de un día a otro", () => {
    expect(getDailySolution(42)).toBe(getDailySolution(42))
    expect(getDailySolution(42)).not.toBe(getDailySolution(43))
    expect(SOLUTIONS).toContain(getDailySolution(-1))
  })
})

describe("buildShareText", () => {
  it("genera la cuadrícula sin revelar letras", () => {
    const text = buildShareText({
      guesses: ["mente", "juego"],
      solution: "juego",
      puzzleNumber: 7,
    })
    expect(text).toBe("Rompecoco · Palabra #7 2/6\n\n⬜🟧⬜⬜⬜\n🟩🟩🟩🟩🟩")
  })
})
