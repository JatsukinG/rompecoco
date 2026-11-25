export interface HilosWord {
  /** Palabra normalizada (sin tildes), tal como está en el tablero */
  word: string
  /** Palabra para mostrar (con tildes) */
  display: string
  /** Índices de casillas en orden (fila * COLS + columna) */
  path: number[]
  /** Palabra eje: cruza el tablero de lado a lado y resume el tema */
  eje?: boolean
}

export interface HilosPuzzle {
  id: string
  /** Pista del tema que ve la persona */
  clue: string
  /** Letras del tablero, por filas (ROWS * COLS) */
  grid: string
  /** La primera es siempre la palabra eje */
  words: HilosWord[]
  /** Palabras válidas que se pueden trazar y no son del tema (suman pistas) */
  extraWords: string[]
}
