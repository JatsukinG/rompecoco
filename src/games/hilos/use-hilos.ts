import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { GameMode } from "@/components/games/game-toolbar"
import { getDayNumber } from "@/lib/daily"

import {
  availableHints,
  evaluateSelection,
  getPuzzleForDay,
  getRandomPuzzle,
  nextHintIndex,
  type HilosEvent,
} from "./logic"
import { loadSave, recordCompletion, writeSave, type HilosProgress, type HilosSave } from "./storage"
import type { HilosPuzzle } from "./types"

export type HilosMode = GameMode

const MESSAGE_MS = 1600
const RESULT_DIALOG_DELAY_MS = 1200

interface Round {
  mode: HilosMode
  puzzle: HilosPuzzle
  puzzleNumber?: number
  found: number[]
  extras: string[]
  hintsUsed: number
  hintIndex: number | null
  events: HilosEvent[]
}

function dailyRound(save: HilosSave): Round {
  const day = getDayNumber()
  const puzzle = getPuzzleForDay(day)
  const saved = save.daily
  const progress =
    saved && saved.day === day && saved.puzzleId === puzzle.id ? saved : null
  return {
    mode: "diaria",
    puzzle,
    puzzleNumber: day + 1,
    found: progress?.found ?? [],
    extras: progress?.extras ?? [],
    hintsUsed: progress?.hintsUsed ?? 0,
    hintIndex: progress?.hintIndex ?? null,
    events: progress?.events ?? [],
  }
}

function freeRound(excludeId?: string): Round {
  return {
    mode: "libre",
    puzzle: getRandomPuzzle(excludeId),
    found: [],
    extras: [],
    hintsUsed: 0,
    hintIndex: null,
    events: [],
  }
}

export function useHilos() {
  const [save, setSave] = useState<HilosSave>(loadSave)
  const [round, setRound] = useState<Round>(() => dailyRound(save))
  const [selection, setSelection] = useState<number[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [lastFound, setLastFound] = useState<number | null>(null)
  const [helpOpen, setHelpOpen] = useState(() => !save.seenHelp)
  const [statsOpen, setStatsOpen] = useState(
    () => save.seenHelp && round.found.length === round.puzzle.words.length
  )
  const messageTimer = useRef<number | undefined>(undefined)
  const resultTimer = useRef<number | undefined>(undefined)

  useEffect(() => writeSave(save), [save])
  useEffect(
    () => () => {
      window.clearTimeout(messageTimer.current)
      window.clearTimeout(resultTimer.current)
    },
    []
  )

  const showMessage = useCallback((text: string, ms = MESSAGE_MS) => {
    window.clearTimeout(messageTimer.current)
    setMessage(text)
    messageTimer.current = window.setTimeout(() => setMessage(null), ms)
  }, [])

  const { puzzle } = round
  const completed = round.found.length === puzzle.words.length
  const hintsAvailable = availableHints(round.extras.length, round.hintsUsed)

  /** Casillas que ya pertenecen a una palabra encontrada (no se pueden volver a usar). */
  const lockedCells = useMemo(
    () => new Set(round.found.flatMap((i) => puzzle.words[i].path)),
    [round.found, puzzle]
  )

  /** Aplica cambios a la ronda y, en modo diario, los guarda. */
  const updateRound = useCallback((next: Round) => {
    setRound(next)
    if (next.mode !== "diaria") return
    const day = getDayNumber()
    const progress: HilosProgress = {
      day,
      puzzleId: next.puzzle.id,
      found: next.found,
      extras: next.extras,
      hintsUsed: next.hintsUsed,
      hintIndex: next.hintIndex,
      events: next.events,
    }
    const done = next.found.length === next.puzzle.words.length
    setSave((s) => ({
      ...s,
      daily: progress,
      stats: done ? recordCompletion(s.stats, day, next.hintsUsed) : s.stats,
    }))
  }, [])

  const submit = useCallback(
    (path: number[]) => {
      setSelection([])
      if (completed || path.length === 0) return
      const result = evaluateSelection(puzzle, path, round.found, round.extras)

      switch (result.kind) {
        case "too-short":
          if (path.length > 1) showMessage("Muy corta: mínimo 4 letras")
          return
        case "invalid":
          showMessage("No está en la lista")
          return
        case "already-theme":
        case "already-extra":
          showMessage("Ya la encontraste")
          return
        case "wrong-path":
          showMessage("Va por otro camino")
          return
        case "extra": {
          const extras = [...round.extras, result.word]
          updateRound({ ...round, extras })
          const earned = availableHints(extras.length, round.hintsUsed) > hintsAvailable
          showMessage(earned ? "¡Ganaste una pista!" : "Palabra válida, no es del tema")
          return
        }
        case "theme": {
          const word = puzzle.words[result.index]
          const found = [...round.found, result.index]
          const done = found.length === puzzle.words.length
          updateRound({
            ...round,
            found,
            hintIndex: round.hintIndex === result.index ? null : round.hintIndex,
            events: [...round.events, word.eje ? "eje" : "word"],
          })
          setLastFound(result.index)
          showMessage(
            done ? "¡Tablero completo!" : word.eje ? "¡Palabra eje!" : word.display.toUpperCase()
          )
          if (done) {
            window.clearTimeout(resultTimer.current)
            resultTimer.current = window.setTimeout(() => setStatsOpen(true), RESULT_DIALOG_DELAY_MS)
          }
          return
        }
      }
    },
    [completed, puzzle, round, hintsAvailable, showMessage, updateRound]
  )

  const requestHint = useCallback(() => {
    if (completed || hintsAvailable <= 0 || round.hintIndex !== null) return
    const index = nextHintIndex(puzzle, round.found)
    if (index === null) return
    updateRound({
      ...round,
      hintIndex: index,
      hintsUsed: round.hintsUsed + 1,
      events: [...round.events, "hint"],
    })
  }, [completed, hintsAvailable, puzzle, round, updateRound])

  const startMode = useCallback(
    (mode: HilosMode) => {
      window.clearTimeout(resultTimer.current)
      setSelection([])
      setMessage(null)
      setLastFound(null)
      setStatsOpen(false)
      setRound((r) => (mode === "diaria" ? dailyRound(save) : freeRound(r.puzzle.id)))
    },
    [save]
  )

  const closeHelp = useCallback(() => {
    setHelpOpen(false)
    setSave((s) => (s.seenHelp ? s : { ...s, seenHelp: true }))
  }, [])

  return {
    round,
    puzzle,
    completed,
    selection,
    setSelection,
    lockedCells,
    lastFound,
    message,
    hintsAvailable,
    stats: save.stats,
    today: getDayNumber(),
    helpOpen,
    statsOpen,
    setStatsOpen,
    openHelp: () => setHelpOpen(true),
    closeHelp,
    submit,
    requestHint,
    startMode,
    showMessage,
  }
}

export type HilosController = ReturnType<typeof useHilos>
