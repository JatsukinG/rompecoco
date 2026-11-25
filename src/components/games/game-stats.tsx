import { useEffect, useState } from "react"

import { msUntilNextDay } from "@/lib/daily"

/** Cifra destacada de las estadísticas (jugadas, racha…). */
export function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-1 py-2 text-center">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] leading-tight text-muted-foreground">{label}</p>
    </div>
  )
}

/** Cuenta regresiva hasta el próximo reto diario. */
export function NextPuzzleCountdown({ label = "Próximo reto en" }: { label?: string }) {
  const [ms, setMs] = useState(msUntilNextDay)

  useEffect(() => {
    const id = window.setInterval(() => setMs(msUntilNextDay()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const total = Math.floor(ms / 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    <div className="text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">
        {pad(Math.floor(total / 3600))}:{pad(Math.floor((total % 3600) / 60))}:{pad(total % 60)}
      </p>
    </div>
  )
}
