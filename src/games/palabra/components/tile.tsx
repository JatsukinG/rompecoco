import type { LetterState } from "@/games/palabra/logic"
import { FLIP_STAGGER_MS } from "@/games/palabra/use-palabra"
import { cn } from "@/lib/utils"

import { TILE_STATE_CLASSES } from "./tile-styles"

interface TileProps {
  letter?: string
  state?: LetterState
  /** Posición en la fila (para escalonar animaciones) */
  index: number
  flipping?: boolean
  bouncing?: boolean
  className?: string
}

export function Tile({ letter, state, index, flipping, bouncing, className }: TileProps) {
  const filled = !!letter && !state

  return (
    <div
      data-state={state ?? (filled ? "filled" : "empty")}
      style={
        flipping || bouncing
          ? { animationDelay: `${index * (bouncing ? 100 : FLIP_STAGGER_MS)}ms` }
          : undefined
      }
      className={cn(
        "flex aspect-square w-full items-center justify-center rounded-lg border-2 text-[clamp(1.25rem,6vw,2rem)] leading-none font-bold uppercase select-none",
        state
          ? TILE_STATE_CLASSES[state]
          : filled
            ? "border-foreground/35 bg-card text-foreground motion-safe:animate-tile-pop"
            : "border-border bg-card/50",
        flipping && "motion-safe:animate-tile-flip",
        bouncing && "motion-safe:animate-tile-bounce",
        className
      )}
    >
      {letter}
    </div>
  )
}
