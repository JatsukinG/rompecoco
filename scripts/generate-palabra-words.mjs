/**
 * Genera la lista de palabras válidas (intentos aceptados) para el juego Palabra.
 *
 * Fuente: paquete `an-array-of-spanish-words` (MIT, ~636k palabras).
 * Salida: src/games/palabra/words/valid-words.ts
 *
 * Uso: pnpm words:palabra
 */
import { createRequire } from "node:module"
import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const words = require("an-array-of-spanish-words")

const WORD_LENGTH = 5

/** Misma normalización que src/games/palabra/logic.ts */
function normalizeWord(value) {
  return value
    .normalize("NFC")
    .toLowerCase()
    .replace(/ñ/g, "\uE000")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\uE000/g, "ñ")
}

const valid = [
  ...new Set(
    words
      .map(normalizeWord)
      .filter((word) => new RegExp(`^[a-zñ]{${WORD_LENGTH}}$`).test(word))
  ),
].sort()

const output = `// Archivo generado por scripts/generate-palabra-words.mjs. No editar a mano.
// Fuente: an-array-of-spanish-words (MIT). ${valid.length} palabras de ${WORD_LENGTH} letras, normalizadas.
export const VALID_WORDS = "${valid.join(" ")}"
`

const target = fileURLToPath(
  new URL("../src/games/palabra/words/valid-words.ts", import.meta.url)
)
writeFileSync(target, output)
console.log(`✔ ${valid.length} palabras escritas en ${target}`)
