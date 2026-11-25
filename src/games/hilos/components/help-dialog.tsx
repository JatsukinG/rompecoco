import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EXTRAS_PER_HINT, MIN_WORD_LENGTH } from "@/games/hilos/logic"

export function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Cómo jugar</DialogTitle>
          <DialogDescription>
            Encuentra todas las palabras escondidas que comparten el tema del día.
          </DialogDescription>
        </DialogHeader>

        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Tira del hilo:</strong> arrastra el dedo por letras
            vecinas (también en diagonal) para formar una palabra. También puedes tocar las letras
            una por una y tocar la última otra vez para enviar.
          </li>
          <li>
            Las palabras del tema se pintan de{" "}
            <span className="rounded bg-primary px-1 font-semibold text-primary-foreground">morado</span>
            . Juntas llenan el tablero entero: no sobra ninguna letra.
          </li>
          <li>
            La <strong className="text-foreground">palabra eje</strong> resume el tema, cruza el
            tablero de un lado a otro y se pinta de{" "}
            <span className="rounded bg-game-near px-1 font-semibold text-game-near-foreground">naranja</span>.
          </li>
          <li>
            ¿Atascado? Cada {EXTRAS_PER_HINT} palabras válidas que <em>no</em> sean del tema (de{" "}
            {MIN_WORD_LENGTH} letras o más) te dan una <strong className="text-foreground">pista</strong>,
            que marca las letras de una palabra del tema.
          </li>
          <li>Las tildes no se muestran en el tablero.</li>
        </ul>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            ¡A jugar!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
