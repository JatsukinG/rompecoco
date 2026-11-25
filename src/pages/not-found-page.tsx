import { Link, useLocation } from "react-router"

import { Button } from "@/components/ui/button"
import { usePageMeta } from "@/hooks/use-page-meta"

export function NotFoundPage() {
  const { pathname } = useLocation()
  usePageMeta({ title: "Página no encontrada", path: pathname, noindex: true })

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Esta pieza no encaja
      </h1>
      <p className="mt-3 text-muted-foreground">
        La página que buscas no existe o se movió.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  )
}
