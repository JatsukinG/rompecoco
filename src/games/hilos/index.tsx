import { LightbulbIcon, SendHorizontalIcon, XIcon } from "lucide-react"

import { GameMessage } from "@/components/games/game-message"
import { GameToolbar } from "@/components/games/game-toolbar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Board } from "./components/board"
import { HelpDialog } from "./components/help-dialog"
import { StatsDialog } from "./components/stats-dialog"
import { EXTRAS_PER_HINT, wordFromPath } from "./logic"
import { useHilos } from "./use-hilos"

export default function HilosGame() {
  const game = useHilos()
  const { round, puzzle, selection, completed, hintsAvailable } = game
  const total = puzzle.words.length
  const hintProgress = round.extras.length % EXTRAS_PER_HINT
  const hintActive = round.hintIndex !== null
  const current = wordFromPath(puzzle, selection)

  return (
    <div className="flex flex-1 flex-col items-center gap-3">
      <GameToolbar
        mode={round.mode}
        onModeChange={game.startMode}
        puzzleNumber={round.puzzleNumber}
        onHelp={game.openHelp}
        onStats={() => game.setStatsOpen(true)}
      />

      {/* Tema */}
      <div className="w-full max-w-[21rem] rounded-xl bg-accent px-4 py-3 text-center">
        <p className="text-[11px] font-semibold tracking-widest text-accent-foreground/80 uppercase">
          Tema
        </p>
        <p className="text-lg leading-snug font-semibold text-balance">{puzzle.clue}</p>
      </div>

      <div className="flex w-full max-w-[21rem] items-center justify-between text-sm">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{round.found.length}</span> de{" "}
          <span className="tabular-nums">{total}</span> palabras
        </p>
        <p
          aria-live="polite"
          className={cn(
            "h-6 text-base font-bold tracking-[0.2em] uppercase",
            selection.length ? "text-primary" : "text-transparent"
          )}
        >
          {current || "·"}
        </p>
      </div>

      {/* Tablero */}
      <div className="relative flex w-full justify-center">
        <GameMessage message={game.message} />
        <Board
          puzzle={puzzle}
          found={round.found}
          selection={selection}
          lockedCells={game.lockedCells}
          hintIndex={round.hintIndex}
          lastFound={game.lastFound}
          disabled={completed}
          onSelectionChange={game.setSelection}
          onSubmit={game.submit}
        />
      </div>

      {/* Acciones */}
      <div className="flex w-full max-w-[21rem] items-center gap-2">
        <Button
          variant="secondary"
          className="h-10 flex-1"
          onClick={game.requestHint}
          disabled={completed || hintsAvailable <= 0 || hintActive}
          aria-label={`Pista (${hintsAvailable} ${hintsAvailable === 1 ? "disponible" : "disponibles"})`}
        >
          <LightbulbIcon />
          Pista
          {hintsAvailable > 0 ? (
            <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground tabular-nums">
              {hintsAvailable}
            </span>
          ) : (
            <span aria-hidden className="flex gap-0.5">
              {Array.from({ length: EXTRAS_PER_HINT }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-1.5 rounded-full",
                    i < hintProgress ? "bg-primary" : "bg-foreground/20"
                  )}
                />
              ))}
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-10"
          aria-label="Borrar selección"
          disabled={!selection.length}
          onClick={() => game.setSelection([])}
        >
          <XIcon />
        </Button>
        <Button
          className="h-10 flex-1"
          disabled={selection.length < 2}
          onClick={() => game.submit(selection)}
        >
          <SendHorizontalIcon />
          Enviar
        </Button>
      </div>

      {hintActive && !completed && (
        <p className="text-xs text-muted-foreground">
          Las letras marcadas con línea punteada forman una palabra del tema.
        </p>
      )}

      <HelpDialog open={game.helpOpen} onClose={game.closeHelp} />
      <StatsDialog {...game} />
    </div>
  )
}
