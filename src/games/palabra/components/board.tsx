import { evaluateGuess, WORD_LENGTH } from "@/games/palabra/logic"
import type { PalabraController } from "@/games/palabra/use-palabra"
import { cn } from "@/lib/utils"

import { Tile } from "./tile"

type BoardProps = Pick<
  PalabraController,
  "round" | "current" | "revealingRow" | "celebrateRow" | "shake" | "maxAttempts"
>

export function Board({
  round,
  current,
  revealingRow,
  celebrateRow,
  shake,
  maxAttempts,
}: BoardProps) {
  const { guesses, solution } = round
  const currentRow = guesses.length

  return (
    <div
      role="grid"
      aria-label="Tablero"
      className="grid w-full max-w-[22rem] gap-1.5 [perspective:800px]"
    >
      {Array.from({ length: maxAttempts }, (_, row) => {
        const guess = guesses[row]
        const evaluation = guess ? evaluateGuess(guess, solution) : null
        const letters = guess ?? (row === currentRow ? current : "")
        const isCurrent = row === currentRow

        return (
          <div
            key={isCurrent ? `current-${shake}` : row}
            role="row"
            aria-label={
              guess
                ? `Intento ${row + 1}: ${guess.toUpperCase()}`
                : `Fila ${row + 1}`
            }
            className={cn(
              "grid grid-cols-5 gap-1.5",
              isCurrent && shake > 0 && "motion-safe:animate-row-shake"
            )}
          >
            {Array.from({ length: WORD_LENGTH }, (_, col) => (
              <Tile
                key={col}
                index={col}
                letter={letters[col]}
                state={evaluation?.[col]}
                flipping={row === revealingRow}
                bouncing={row === celebrateRow}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
