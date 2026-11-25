import { Link } from "react-router"

import { cn } from "@/lib/utils"

/** Wordmark de Rompecoco: dos piezas de rompecabezas + nombre. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Rompecoco, ir al inicio"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span
        aria-hidden
        className="grid size-8 grid-cols-2 gap-0.5 rounded-lg bg-primary p-1.5 transition-transform duration-300 group-hover:rotate-12"
      >
        <span className="rounded-[3px] bg-primary-foreground" />
        <span className="rounded-[3px] bg-primary-foreground/50" />
        <span className="rounded-[3px] bg-primary-foreground/50" />
        <span className="rounded-[3px] bg-primary-foreground" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        rompe<span className="text-primary">coco</span>
      </span>
    </Link>
  )
}
