import { useRef, type PointerEvent } from "react"

import { COLS, colOf, isAdjacent, pressCell, ROWS, rowOf } from "@/games/hilos/logic"
import type { HilosPuzzle } from "@/games/hilos/types"
import { cn } from "@/lib/utils"

interface BoardProps {
  puzzle: HilosPuzzle
  found: number[]
  selection: number[]
  lockedCells: Set<number>
  hintIndex: number | null
  lastFound: number | null
  disabled?: boolean
  onSelectionChange: (path: number[]) => void
  onSubmit: (path: number[]) => void
}

/** Radio de la zona "activa" de cada casilla al arrastrar (facilita las diagonales). */
const DRAG_HIT_RADIUS = 0.4

const point = (cell: number) => `${colOf(cell) + 0.5},${rowOf(cell) + 0.5}`

export function Board({
  puzzle,
  found,
  selection,
  lockedCells,
  hintIndex,
  lastFound,
  disabled,
  onSelectionChange,
  onSubmit,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ path: number[]; moved: boolean; submitOnRelease: boolean } | null>(null)

  const ownerOf = new Map<number, number>()
  found.forEach((i) => puzzle.words[i].path.forEach((cell) => ownerOf.set(cell, i)))
  const hinted = new Set(hintIndex !== null ? puzzle.words[hintIndex].path : [])
  const selected = new Set(selection)

  function cellAt(event: PointerEvent, strict: boolean): number | null {
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) return null
    const x = ((event.clientX - rect.left) / rect.width) * COLS
    const y = ((event.clientY - rect.top) / rect.height) * ROWS
    const col = Math.floor(x)
    const row = Math.floor(y)
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null
    if (strict && Math.hypot(x - col - 0.5, y - row - 0.5) > DRAG_HIT_RADIUS) return null
    return row * COLS + col
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return
    const cell = cellAt(event, false)
    if (cell === null || lockedCells.has(cell)) return
    try {
      // Seguir recibiendo eventos aunque el dedo salga del tablero
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Algunos eventos sintéticos no tienen un puntero activo; se ignora.
    }
    // La letra se marca apenas se presiona (no hay que esperar a la segunda)
    const { path, submitOnRelease } = pressCell(selection, cell)
    drag.current = { path: [...path], moved: false, submitOnRelease }
    onSelectionChange(path)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current
    if (!current) return
    const cell = cellAt(event, true)
    if (cell === null) return

    const path = current.path
    const last = path.at(-1)!
    if (cell === last) return
    if (cell === path.at(-2)) {
      path.pop() // retroceder
    } else if (!path.includes(cell) && !lockedCells.has(cell) && isAdjacent(last, cell)) {
      path.push(cell)
    } else {
      return
    }
    current.moved = true
    onSelectionChange([...path])
  }

  function handlePointerUp() {
    const current = drag.current
    drag.current = null
    if (!current) return
    // Arrastre → se envía al soltar. Toque → solo si se tocó la última letra otra vez.
    if (current.moved || current.submitOnRelease) onSubmit(current.path)
  }

  function handlePointerCancel() {
    drag.current = null
    onSelectionChange([])
  }

  return (
    <div
      ref={boardRef}
      role="grid"
      aria-label="Tablero de letras"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className="relative grid w-full max-w-[21rem] touch-none select-none"
      style={{
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        aspectRatio: `${COLS} / ${ROWS}`,
      }}
    >
      {/* Hilos: líneas entre las letras de cada palabra */}
      <svg
        aria-hidden
        viewBox={`0 0 ${COLS} ${ROWS}`}
        className="pointer-events-none absolute inset-0 size-full"
      >
        {found.map((i) => {
          const word = puzzle.words[i]
          return (
            <polyline
              key={i}
              points={word.path.map(point).join(" ")}
              fill="none"
              strokeWidth={0.26}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={word.eje ? "stroke-game-near/70" : "stroke-primary/45"}
            />
          )
        })}
        {selection.length > 1 && (
          <polyline
            points={selection.map(point).join(" ")}
            fill="none"
            strokeWidth={0.22}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-primary/40"
          />
        )}
      </svg>

      {[...puzzle.grid].map((letter, cell) => {
        const owner = ownerOf.get(cell)
        const isEje = owner !== undefined && puzzle.words[owner].eje
        const order = owner !== undefined ? puzzle.words[owner].path.indexOf(cell) : 0
        return (
          <div key={cell} role="gridcell" className="relative flex items-center justify-center p-[9%]">
            <span
              style={owner === lastFound ? { animationDelay: `${order * 50}ms` } : undefined}
              className={cn(
                "flex aspect-square w-full items-center justify-center rounded-full text-[clamp(1rem,5vw,1.35rem)] leading-none font-semibold uppercase transition-colors duration-200",
                owner !== undefined
                  ? isEje
                    ? "bg-game-near text-game-near-foreground"
                    : "bg-primary text-primary-foreground"
                  : selected.has(cell)
                    ? "bg-primary/30 text-foreground ring-2 ring-primary/70 motion-safe:animate-tile-pop"
                    : "text-foreground",
                owner !== undefined && owner === lastFound && "motion-safe:animate-tile-pop",
                hinted.has(cell) && owner === undefined && "outline-2 outline-offset-1 outline-primary outline-dashed"
              )}
            >
              {letter}
            </span>
          </div>
        )
      })}
    </div>
  )
}
