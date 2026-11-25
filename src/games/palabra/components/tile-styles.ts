import type { LetterState } from "@/games/palabra/logic"

/** Colores de cada estado, compartidos por fichas y teclado (ver docs/design-system.md). */
export const TILE_STATE_CLASSES: Record<LetterState, string> = {
  hit: "border-transparent bg-game-hit text-game-hit-foreground",
  near: "border-transparent bg-game-near text-game-near-foreground",
  miss: "border-transparent bg-game-miss text-game-miss-foreground",
}
