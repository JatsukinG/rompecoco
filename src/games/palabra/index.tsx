import { GameMessage } from "@/components/games/game-message"
import { GameToolbar } from "@/components/games/game-toolbar"

import { Board } from "./components/board"
import { HelpDialog } from "./components/help-dialog"
import { Keyboard } from "./components/keyboard"
import { StatsDialog } from "./components/stats-dialog"
import { usePalabra } from "./use-palabra"

export default function PalabraGame() {
  const game = usePalabra()
  const { round, status, message, revealingRow } = game

  return (
    <div className="flex flex-1 flex-col items-center gap-4">
      <GameToolbar
        mode={round.mode}
        onModeChange={game.startMode}
        puzzleNumber={round.puzzleNumber}
        onHelp={game.openHelp}
        onStats={() => game.setStatsOpen(true)}
      />

      {/* Tablero + mensajes */}
      <div className="relative flex w-full flex-1 items-center justify-center py-2">
        <GameMessage message={message} />
        <Board {...game} />
      </div>

      <Keyboard
        keyStates={game.keyStates}
        onLetter={game.addLetter}
        onEnter={game.submit}
        onBackspace={game.removeLetter}
        disabled={status !== "playing" || revealingRow !== null}
      />

      <HelpDialog open={game.helpOpen} onClose={game.closeHelp} />
      <StatsDialog {...game} />
    </div>
  )
}
