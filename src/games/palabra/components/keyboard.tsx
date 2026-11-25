import { CornerDownLeftIcon, DeleteIcon } from "lucide-react"
import type { ReactNode } from "react"

import type { LetterState } from "@/games/palabra/logic"
import { cn } from "@/lib/utils"

import { TILE_STATE_CLASSES } from "./tile-styles"

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
]

interface KeyboardProps {
  keyStates: Record<string, LetterState>
  onLetter: (letter: string) => void
  onEnter: () => void
  onBackspace: () => void
  disabled?: boolean
}

export function Keyboard({
  keyStates,
  onLetter,
  onEnter,
  onBackspace,
  disabled,
}: KeyboardProps) {
  return (
    <div
      aria-label="Teclado"
      className="flex w-full max-w-lg flex-col gap-1.5 select-none"
    >
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            if (key === "enter") {
              return (
                <Key key={key} wide onPress={onEnter} disabled={disabled} label="Enviar intento">
                  <span className="hidden text-xs font-semibold sm:inline">ENVIAR</span>
                  <CornerDownLeftIcon className="size-5 sm:hidden" />
                </Key>
              )
            }
            if (key === "backspace") {
              return (
                <Key key={key} wide onPress={onBackspace} disabled={disabled} label="Borrar letra">
                  <DeleteIcon className="size-5" />
                </Key>
              )
            }
            const state = keyStates[key]
            return (
              <Key
                key={key}
                onPress={() => onLetter(key)}
                disabled={disabled}
                label={key.toUpperCase()}
                className={state ? TILE_STATE_CLASSES[state] : undefined}
              >
                {key}
              </Key>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function Key({
  children,
  onPress,
  label,
  wide,
  disabled,
  className,
}: {
  children: ReactNode
  onPress: () => void
  label: string
  wide?: boolean
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      // Sin foco: así Enter del teclado físico no "pulsa" la última tecla tocada
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onPress}
      className={cn(
        "flex h-14 min-w-0 items-center justify-center rounded-lg border border-transparent bg-secondary text-base font-semibold text-secondary-foreground uppercase transition-[background-color,transform] duration-200 active:scale-95 disabled:opacity-60",
        wide ? "flex-[1.5]" : "flex-1",
        className
      )}
    >
      {children}
    </button>
  )
}
