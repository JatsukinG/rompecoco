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
import { buildShareText } from "@/games/palabra/logic"
import { getEffectiveStreak } from "@/games/palabra/storage"
import type { PalabraController } from "@/games/palabra/use-palabra"
import { cn } from "@/lib/utils"

type StatsDialogProps = Pick<
  PalabraController,
  "round" | "status" | "stats" | "today" | "statsOpen" | "setStatsOpen" | "startMode" | "showMessage"
>

export function StatsDialog({
  round,
  status,
  stats,
  today,
  statsOpen,
  setStatsOpen,
  startMode,
  showMessage,
}: StatsDialogProps) {
  const finished = status !== "playing"
  const isDaily = round.mode === "diaria"
  const winRate = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0
  const maxBar = Math.max(1, ...stats.distribution)
  const winningRow =
    isDaily && status === "won" ? round.guesses.length - 1 : null

  async function share() {
    const text = buildShareText({
      guesses: round.guesses,
      solution: round.solution,
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
            {!finished
              ? "Estadísticas"
              : status === "won"
                ? "¡La encontraste!"
                : "Esta vez no fue"}
          </DialogTitle>
          <DialogDescription>
            {finished ? (
              <>
                La palabra era{" "}
                <strong className="font-semibold tracking-wide text-primary uppercase">
                  {round.display}
                </strong>
                .
              </>
            ) : (
              "Tu historial en el modo diario."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-2">
          <Stat value={stats.played} label="Jugadas" />
          <Stat value={`${winRate}%`} label="Victorias" />
          <Stat value={getEffectiveStreak(stats, today)} label="Racha" />
          <Stat value={stats.maxStreak} label="Mejor racha" />
        </div>
        {!isDaily && (
          <p className="-mt-2 text-xs text-muted-foreground">
            Estas estadísticas son del modo diario; el modo libre no suma.
          </p>
        )}

        <div className="space-y-1.5">
          <p className="text-sm font-medium">Intentos para ganar</p>
          {stats.distribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="w-3 text-muted-foreground tabular-nums">{i + 1}</span>
              <div className="flex-1">
                <div
                  className={cn(
                    "flex h-6 min-w-7 items-center justify-end rounded-md px-2 text-xs font-semibold tabular-nums transition-[width] duration-500",
                    winningRow === i
                      ? "bg-game-hit text-game-hit-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                  style={{ width: `${(count / maxBar) * 100}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>

        {finished && (
          <>
            <Separator />
            <div className="flex items-center gap-3">
              {isDaily ? (
                <div className="flex-1">
                  <NextPuzzleCountdown label="Próxima palabra en" />
                </div>
              ) : (
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => startMode("libre")}
                >
                  <RotateCcwIcon />
                  Otra palabra
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
