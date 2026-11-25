import { Outlet } from "react-router"

import { SiteHeader } from "@/components/layout/site-header"

export function RootLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Rompecoco · juegos para ejercitar la mente</p>
          <p>Hecho con calma, para jugar sin prisa.</p>
        </div>
      </footer>
    </div>
  )
}
