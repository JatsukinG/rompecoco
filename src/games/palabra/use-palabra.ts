import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  getDailySolution,
  getDayNumber,
  getKeyStates,
  getRandomSolution,
  getStatus,
  isValidWord,
  MAX_ATTEMPTS,
  normalizeLetter,
  normalizeWord,
  WORD_LENGTH,
} from "./logic"
import { loadSave, recordResult, writeSave, type PalabraSave } from "./storage"

import type { GameMode } from "@/components/games/game-toolbar"

export type PalabraMode = GameMode

/** Duraciones de animación (deben coincidir con las de index.css) */
export const FLIP_MS = 500
export const FLIP_STAGGER_MS = 250
const REVEAL_MS = FLIP_STAGGER_MS * (WORD_LENGTH - 1) + FLIP_MS
const MESSAGE_MS = 1600
const RESULT_DIALOG_DELAY_MS = 1400

const WIN_MESSAGES = [
  "¡Genio!",
  "¡Magnífico!",
  "¡Impresionante!",
  "¡Muy bien!",
  "¡Bien hecho!",
  "¡Por un pelo!",
]

interface Round {
  mode: PalabraMode
  /** Solución tal como se muestra (con tildes) */
  display: string
  /** Solución normalizada */
  solution: string
  guesses: string[]
  /** Número de reto diario (1, 2, 3…) */
  puzzleNumber?: number
}

function dailyRound(save: PalabraSave): Round {
  const day = getDayNumber()
  const display = getDailySolution(day)
  return {
    mode: "diaria",
    display,
    solution: normalizeWord(display),
    guesses: save.daily?.day === day ? save.daily.guesses : [],
    puzzleNumber: day + 1,
  }
}

function freeRound(exclude?: string): Round {
  const display = getRandomSolution(exclude)
  return { mode: "libre", display, solution: normalizeWord(display), guesses: [] }
}

export function usePalabra() {
  const [save, setSave] = useState<PalabraSave>(loadSave)
  const [round, setRound] = useState<Round>(() => dailyRound(save))
  const [current, setCurrent] = useState("")
  const [revealingRow, setRevealingRow] = useState<number | null>(null)
  const [celebrateRow, setCelebrateRow] = useState<number | null>(null)
  const [shake, setShake] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(() => !save.seenHelp)
  const [statsOpen, setStatsOpen] = useState(
    () => !!save.seenHelp && getStatus(round.guesses, round.solution) !== "playing"
  )

  const timers = useRef<number[]>([])
  const messageTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    writeSave(save)
  }, [save])

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(window.clearTimeout)
      window.clearTimeout(messageTimer.current)
    }
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  const showMessage = useCallback((text: string, ms = MESSAGE_MS) => {
    window.clearTimeout(messageTimer.current)
    setMessage(text)
    messageTimer.current = window.setTimeout(() => setMessage(null), ms)
  }, [])

  const status = getStatus(round.guesses, round.solution)
  const isRevealing = revealingRow !== null
  const keyStates = useMemo(
    () =>
      // Mientras se voltea la fila, el teclado aún no muestra sus colores
      getKeyStates(
        isRevealing ? round.guesses.slice(0, -1) : round.guesses,
        round.solution
      ),
    [round.guesses, round.solution, isRevealing]
  )

  const resetTransient = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setCurrent("")
    setRevealingRow(null)
    setCelebrateRow(null)
    setMessage(null)
  }, [])

  const addLetter = useCallback(
    (letter: string) => {
      if (status !== "playing" || isRevealing) return
      setCurrent((value) =>
        value.length < WORD_LENGTH ? value + letter : value
      )
    },
    [status, isRevealing]
  )

  const removeLetter = useCallback(() => {
    if (status !== "playing" || isRevealing) return
    setCurrent((value) => value.slice(0, -1))
  }, [status, isRevealing])

  const submit = useCallback(() => {
    if (status !== "playing" || isRevealing) return

    if (current.length < WORD_LENGTH) {
      setShake((n) => n + 1)
      showMessage("Faltan letras")
      return
    }
    if (!isValidWord(current)) {
      setShake((n) => n + 1)
      showMessage("No está en la lista")
      return
    }

    const guesses = [...round.guesses, current]
    const rowIndex = guesses.length - 1
    const nextStatus = getStatus(guesses, round.solution)

    setRound((r) => ({ ...r, guesses }))
    setCurrent("")
    setRevealingRow(rowIndex)

    // Se guarda en el momento para no perder el intento si se cierra la página
    if (round.mode === "diaria") {
      const day = getDayNumber()
      setSave((s) => ({
        ...s,
        daily: { day, guesses },
        stats:
          nextStatus === "playing"
            ? s.stats
            : recordResult(s.stats, day, nextStatus === "won", guesses.length),
      }))
    }

    later(() => {
      setRevealingRow(null)
      if (nextStatus === "won") {
        setCelebrateRow(rowIndex)
        showMessage(WIN_MESSAGES[rowIndex] ?? WIN_MESSAGES.at(-1)!)
        later(() => setStatsOpen(true), RESULT_DIALOG_DELAY_MS)
      } else if (nextStatus === "lost") {
        showMessage(round.display.toUpperCase(), 3000)
        later(() => setStatsOpen(true), RESULT_DIALOG_DELAY_MS)
      }
    }, REVEAL_MS)
  }, [status, isRevealing, current, round, showMessage, later])

  const startMode = useCallback(
    (mode: PalabraMode) => {
      resetTransient()
      setStatsOpen(false)
      setRound((r) =>
        mode === "diaria" ? dailyRound(save) : freeRound(r.display)
      )
    },
    [resetTransient, save]
  )

  const closeHelp = useCallback(() => {
    setHelpOpen(false)
    setSave((s) => (s.seenHelp ? s : { ...s, seenHelp: true }))
  }, [])

  // Teclado físico (se desactiva con un diálogo abierto)
  const dialogOpen = helpOpen || statsOpen
  useEffect(() => {
    if (dialogOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (event.key === "Enter") {
        event.preventDefault()
        submit()
      } else if (event.key === "Backspace") {
        removeLetter()
      } else {
        const letter = normalizeLetter(event.key)
        if (letter) addLetter(letter)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dialogOpen, submit, removeLetter, addLetter])

  return {
    round,
    current,
    status,
    keyStates,
    revealingRow,
    celebrateRow,
    shake,
    message,
    stats: save.stats,
    today: getDayNumber(),
    maxAttempts: MAX_ATTEMPTS,
    helpOpen,
    statsOpen,
    setStatsOpen,
    openHelp: () => setHelpOpen(true),
    closeHelp,
    addLetter,
    removeLetter,
    submit,
    startMode,
    showMessage,
  }
}

export type PalabraController = ReturnType<typeof usePalabra>
