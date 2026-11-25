import { ChartNoAxesColumnIcon, CircleHelpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type GameMode = "diaria" | "libre"

const MODES: { value: GameMode; label: string }[] = [
  { value: "diaria", label: "Diaria" },
  { value: "libre", label: "Libre" },
]

interface GameToolbarProps {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  /** Número de reto diario (se muestra como #N) */
  puzzleNumber?: number
  onHelp: () => void
  onStats: () => void
}

/** Barra común de los juegos: modo diaria/libre, número de reto, ayuda y estadísticas. */
export function GameToolbar({ mode, onModeChange, puzzleNumber, onHelp, onStats }: GameToolbarProps) {
  return (
    <div className="flex w-full max-w-lg items-center justify-between gap-2">
      <div role="radiogroup" aria-label="Modo de juego" className="inline-flex rounded-lg bg-muted p-0.5">
        {MODES.map((item) => (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={mode === item.value}
            onClick={() => onModeChange(item.value)}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              mode === item.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground tabular-nums">
        {mode === "diaria" ? `#${puzzleNumber}` : "Práctica"}
      </p>

      <div className="flex gap-1">
        <Button variant="ghost" size="icon" aria-label="Cómo jugar" onClick={onHelp}>
          <CircleHelpIcon />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Estadísticas" onClick={onStats}>
          <ChartNoAxesColumnIcon />
        </Button>
      </div>
    </div>
  )
}
