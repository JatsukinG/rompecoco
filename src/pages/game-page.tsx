import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react"
import { Suspense } from "react"
import { Link, useParams } from "react-router"

import { GamePreview } from "@/components/games/game-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { gameComponents } from "@/games/game-components"
import { getGameBySlug, type Game } from "@/games/registry"
import { usePageMeta } from "@/hooks/use-page-meta"
import { NotFoundPage } from "@/pages/not-found-page"

function BackButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="-ml-2">
      <Link to="/">
        <ArrowLeftIcon />
        Todos los juegos
      </Link>
    </Button>
  )
}

/** Página de un juego: monta su componente o muestra "próximamente". */
export function GamePage() {
  const { slug } = useParams()
  const game = getGameBySlug(slug)
  usePageMeta({
    title: game ? `${game.name}: ${game.tagline.toLowerCase()}` : "Página no encontrada",
    description: game?.description,
    path: `/juegos/${slug}`,
    noindex: !game,
  })

  if (!game) return <NotFoundPage />

  const GameComponent = game.status === "disponible" ? gameComponents[game.slug] : undefined

  if (GameComponent) {
    return (
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-2xl flex-col px-3 pt-3 pb-4 sm:px-6 sm:pt-5">
        <div className="mb-3 flex items-center justify-between">
          <BackButton />
          <h1 className="text-lg font-semibold tracking-tight">{game.name}</h1>
        </div>
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <LoaderCircleIcon className="size-6 animate-spin" aria-label="Cargando" />
            </div>
          }
        >
          <GameComponent />
        </Suspense>
      </div>
    )
  }

  return <ComingSoon game={game} />
}

function ComingSoon({ game }: { game: Game }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <BackButton />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{game.category}</Badge>
        <Badge variant="outline">{game.difficulty}</Badge>
      </div>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        {game.name}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{game.description}</p>

      <div className="mt-10 rounded-2xl border bg-card p-3">
        <GamePreview kind={game.preview} />
        <div className="px-3 pt-6 pb-4 text-center">
          <p className="font-medium">Estamos armando este juego</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Muy pronto vas a poder jugar {game.name} aquí mismo.
          </p>
        </div>
      </div>
    </div>
  )
}
