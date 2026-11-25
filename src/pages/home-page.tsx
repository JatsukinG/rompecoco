import { GameCard } from "@/components/games/game-card"
import { games } from "@/games/registry"
import { usePageMeta } from "@/hooks/use-page-meta"

export function HomePage() {
  usePageMeta({
    path: "/",
    description:
      "Juegos de ingenio en español: adivina la palabra del día, une letras en Hilos y más. Partidas cortas, un reto nuevo cada día y gratis.",
  })

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <section className="relative pt-10 pb-8 sm:pt-16 sm:pb-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <p className="mb-3 text-sm font-medium text-primary">
          Juegos de ingenio · {games.length} para empezar
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Juegos para <span className="text-primary">romperte el coco</span>.
        </h1>
        <p className="mt-4 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
          Acertijos, palabras y patrones. Partidas cortas para despejar la mente
          o tomarte el café con un reto.
        </p>
      </section>

      <section aria-labelledby="juegos" className="pb-24">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="juegos" className="text-xl font-semibold tracking-tight">
            Elige un juego
          </h2>
          <span className="text-sm text-muted-foreground">Nuevos juegos pronto</span>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {games.map((game) => (
            <li key={game.slug}>
              <GameCard game={game} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
