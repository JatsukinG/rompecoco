import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { LetterState } from "@/games/palabra/logic"

import { Tile } from "./tile"

function Example({
  word,
  index,
  state,
}: {
  word: string
  index: number
  state: LetterState
}) {
  return (
    <div className="grid w-52 grid-cols-5 gap-1">
      {[...word].map((letter, i) => (
        <Tile
          key={i}
          index={i}
          letter={letter}
          state={i === index ? state : undefined}
          className="text-lg"
        />
      ))}
    </div>
  )
}

export function HelpDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Cómo jugar</DialogTitle>
          <DialogDescription>
            Adivina la palabra secreta de 5 letras en 6 intentos.
          </DialogDescription>
        </DialogHeader>

        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Cada intento debe ser una palabra válida en español.</li>
          <li>Las tildes no importan: escribe sin acentos. La Ñ sí cuenta como letra.</li>
          <li>Después de cada intento, las fichas cambian de color.</li>
        </ul>

        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <Example word="juego" index={0} state="hit" />
            <p>
              La <strong>J</strong> está en la palabra y en el lugar correcto.
            </p>
          </div>
          <div className="space-y-2">
            <Example word="nieve" index={1} state="near" />
            <p>
              La <strong>I</strong> está en la palabra, pero en otro lugar.
            </p>
          </div>
          <div className="space-y-2">
            <Example word="tango" index={3} state="miss" />
            <p>
              La <strong>G</strong> no está en la palabra.
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          En modo <strong className="text-foreground">Diaria</strong> hay una
          palabra nueva cada día, igual para todos. En modo{" "}
          <strong className="text-foreground">Libre</strong> puedes jugar
          todas las que quieras.
        </p>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            ¡A jugar!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
