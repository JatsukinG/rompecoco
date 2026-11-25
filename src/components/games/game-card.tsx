import { ArrowUpRightIcon } from "lucide-react"
import { Link } from "react-router"

import { GamePreview } from "@/components/games/game-preview"
import { Card } from "@/components/ui/card"
import type { Game } from "@/games/registry"

/** Tarjeta compacta del listado: solo ilustración + nombre. */
export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to={`/juegos/${game.slug}`}
      aria-label={game.name}
      className="group/game block rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="gap-2 rounded-2xl p-2 pb-3 transition-all duration-300 group-hover/game:-translate-y-1 group-hover/game:shadow-lg group-hover/game:shadow-primary/10 group-hover/game:ring-primary/30 sm:gap-3 sm:p-3 sm:pb-4">
        <GamePreview kind={game.preview} />
        <div className="flex items-center justify-between gap-2 px-1.5 sm:px-2">
          <h3 className="text-base font-semibold tracking-tight sm:text-lg">
            {game.name}
          </h3>
          <ArrowUpRightIcon className="size-4 text-muted-foreground transition-all duration-300 group-hover/game:translate-x-0.5 group-hover/game:-translate-y-0.5 group-hover/game:text-primary sm:size-5" />
        </div>
      </Card>
    </Link>
  )
}
