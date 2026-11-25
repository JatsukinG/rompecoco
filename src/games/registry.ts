/**
 * Catálogo central de juegos de Rompecoco.
 *
 * Para agregar un juego nuevo: añade una entrada aquí y crea su doc en
 * `docs/juegos/<slug>.md` (ver `docs/agregar-un-juego.md`).
 */

export type GameStatus = "disponible" | "pronto"

export type GameCategory = "Palabras" | "Lógica" | "Asociación"

export type GameDifficulty = "Fácil" | "Media" | "Difícil"

export type GamePreviewKind = "criptico" | "palabra" | "hilos"

export interface Game {
  /** Identificador usado en la URL: /juegos/:slug */
  slug: string
  name: string
  /** Frase corta para la tarjeta del listado */
  tagline: string
  description: string
  category: GameCategory
  difficulty: GameDifficulty
  /** Duración aproximada de una partida, en minutos */
  minutes: number
  status: GameStatus
  preview: GamePreviewKind
}

export const games: Game[] = [
  {
    slug: "criptico",
    name: "Criptico",
    tagline: "Descifra la frase oculta",
    description:
      "Cada letra de una frase fue reemplazada por otra. Encuentra el patrón y revela el mensaje.",
    category: "Lógica",
    difficulty: "Media",
    minutes: 8,
    status: "pronto",
    preview: "criptico",
  },
  {
    slug: "palabra",
    name: "Palabra",
    tagline: "Adivina la palabra del día",
    description:
      "Tienes seis intentos para dar con la palabra secreta. Cada intento te da pistas por color.",
    category: "Palabras",
    difficulty: "Fácil",
    minutes: 4,
    status: "disponible",
    preview: "palabra",
  },
  {
    slug: "hilos",
    name: "Hilos",
    tagline: "Tira del hilo y conecta",
    description:
      "Une letras vecinas en el tablero para formar palabras que comparten un tema escondido.",
    category: "Asociación",
    difficulty: "Media",
    minutes: 6,
    status: "disponible",
    preview: "hilos",
  },
]

export function getGameBySlug(slug: string | undefined): Game | undefined {
  return games.find((game) => game.slug === slug)
}
