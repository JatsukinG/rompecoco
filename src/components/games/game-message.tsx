/** Aviso flotante sobre el tablero ("No está en la lista", "¡Genial!"…). */
export function GameMessage({ message }: { message: string | null }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2"
    >
      {message && (
        <p className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold whitespace-nowrap text-background shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
          {message}
        </p>
      )}
    </div>
  )
}
