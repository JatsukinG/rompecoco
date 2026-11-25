import type { GamePreviewKind } from "@/games/registry"
import { cn } from "@/lib/utils"

/**
 * Mini ilustraciones de cada juego, hechas con HTML/CSS para que hereden el
 * tema (claro/oscuro) sin depender de imágenes.
 */
export function GamePreview({ kind }: { kind: GamePreviewKind }) {
  return (
    <div
      aria-hidden
      className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-accent/60 transition-colors duration-300 group-hover/game:bg-accent"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] bg-size-[14px_14px] opacity-70" />
      {/* Escala según el ancho de la tarjeta (en móvil hay 2 columnas) */}
      <div className="relative scale-[0.62] min-[420px]:scale-75 sm:scale-90 lg:scale-[0.82]">
        <div className="transition-transform duration-300 ease-out group-hover/game:scale-[1.05]">
          {kind === "criptico" && <CripticoPreview />}
          {kind === "palabra" && <PalabraPreview />}
          {kind === "hilos" && <HilosPreview />}
        </div>
      </div>
    </div>
  )
}

const tile =
  "flex items-center justify-center rounded-md font-semibold uppercase tabular-nums"

function CripticoPreview() {
  const cells: { letter?: string; code: number }[] = [
    { letter: "C", code: 7 },
    { code: 19 },
    { letter: "C", code: 7 },
    { letter: "O", code: 3 },
  ]
  return (
    <div className="flex gap-1.5">
      {cells.map((cell, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <span
            className={cn(
              tile,
              "size-10 text-lg",
              cell.letter
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "border-2 border-dashed border-primary/50 text-primary"
            )}
          >
            {cell.letter ?? "?"}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
            {cell.code}
          </span>
        </div>
      ))}
    </div>
  )
}

function PalabraPreview() {
  const rows: { letter: string; state: "hit" | "near" | "miss" }[][] = [
    [
      { letter: "M", state: "miss" },
      { letter: "E", state: "near" },
      { letter: "N", state: "miss" },
      { letter: "T", state: "miss" },
      { letter: "E", state: "hit" },
    ],
    [
      { letter: "J", state: "hit" },
      { letter: "U", state: "hit" },
      { letter: "E", state: "hit" },
      { letter: "G", state: "hit" },
      { letter: "O", state: "hit" },
    ],
  ]
  const states = {
    hit: "bg-game-hit text-game-hit-foreground",
    near: "bg-game-near text-game-near-foreground",
    miss: "bg-game-miss text-game-miss-foreground",
  }
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row, r) => (
        <div key={r} className="flex gap-1.5">
          {row.map((cell, c) => (
            <span key={c} className={cn(tile, "size-9 text-base", states[cell.state])}>
              {cell.letter}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function HilosPreview() {
  const letters = ["H", "I", "R", "A", "S", "L", "O", "N", "E", "D", "S", "T"]
  // Índices (en una grilla de 4 columnas) que forman la palabra "HILOS"
  const path = [0, 1, 5, 6, 10]
  const size = 32
  const gap = 6
  const center = (i: number) => ({
    x: (i % 4) * (size + gap) + size / 2,
    y: Math.floor(i / 4) * (size + gap) + size / 2,
  })
  const points = path.map(center)

  return (
    <div className="relative grid grid-cols-4 gap-1.5">
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={4 * size + 3 * gap}
        height={3 * size + 2 * gap}
      >
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          className="stroke-primary/60"
          strokeWidth={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {letters.map((letter, i) => (
        <span
          key={i}
          className={cn(
            tile,
            "relative size-8 rounded-full text-sm",
            path.includes(i)
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground ring-1 ring-border"
          )}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}
