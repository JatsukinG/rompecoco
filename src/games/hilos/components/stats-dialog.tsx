import { RotateCcwIcon, Share2Icon } from "lucide-react"

import { NextPuzzleCountdown, Stat } from "@/components/games/game-stats"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { buildShareText } from "@/games/hilos/logic"
import { getEffectiveStreak } from "@/games/hilos/storage"
import type { HilosController } from "@/games/hilos/use-hilos"

type StatsDialogProps = Pick<
  HilosController,
  "round" | "completed" | "stats" | "today" | "statsOpen" | "setStatsOpen" | "startMode" | "showMessage"
>

export function StatsDialog({
  round,
  completed,
  stats,
  today,
  statsOpen,
  setStatsOpen,
  startMode,
  showMessage,
}: StatsDialogProps) {
  const isDaily = round.mode === "diaria"
  const hints = round.hintsUsed

  async function share() {
    const text = buildShareText({
      events: round.events,
      clue: round.puzzle.clue,
      puzzleNumber: round.puzzleNumber,
    })
    try {
      await navigator.clipboard.writeText(text)
      setStatsOpen(false)
      showMessage("Resultado copiado")
    } catch {
      showMessage("No se pudo copiar")
    }
  }

  return (
    <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {completed ? "¡Tablero completo!" : "Estadísticas"}
          </DialogTitle>
          <DialogDescription>
            {completed
              ? hints === 0
                ? "Sin usar ni una pista. ¡Impecable!"
                : `Lo resolviste usando ${hints} ${hints === 1 ? "pista" : "pistas"}.`
              : "Tu historial en el modo diario."}
          </DialogDescription>
        </DialogHeader>

        {completed && (
          <div className="flex flex-wrap gap-1.5">
            {round.found.map((i) => {
              const word = round.puzzle.words[i]
              return (
                <span
                  key={i}
                  className={
                    word.eje
                      ? "rounded-md bg-game-near px-2 py-0.5 text-xs font-semibold text-game-near-foreground uppercase"
                      : "rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground uppercase"
                  }
                >
                  {word.display}
                </span>
              )
            })}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          <Stat value={stats.completed} label="Completados" />
          <Stat value={stats.perfect} label="Sin pistas" />
          <Stat value={getEffectiveStreak(stats, today)} label="Racha" />
          <Stat value={stats.maxStreak} label="Mejor racha" />
        </div>
        {!isDaily && (
          <p className="-mt-2 text-xs text-muted-foreground">
            Estas estadísticas son del modo diario; el modo libre no suma.
          </p>
        )}

        {completed && (
          <>
            <Separator />
            <div className="flex items-center gap-3">
              {isDaily ? (
                <div className="flex-1">
                  <NextPuzzleCountdown label="Próximo tablero en" />
                </div>
              ) : (
                <Button variant="secondary" className="flex-1" onClick={() => startMode("libre")}>
                  <RotateCcwIcon />
                  Otro tablero
                </Button>
              )}
              <Button className="flex-1" onClick={share}>
                <Share2Icon />
                Compartir
              </Button>
            </div>
            {isDaily && (
              <Button variant="outline" onClick={() => startMode("libre")}>
                Seguir jugando en modo libre
              </Button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
