import { createBrowserRouter } from "react-router"

import { RootLayout } from "@/components/layout/root-layout"
import { GamePage } from "@/pages/game-page"
import { HomePage } from "@/pages/home-page"
import { NotFoundPage } from "@/pages/not-found-page"

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "juegos/:slug", Component: GamePage },
      { path: "*", Component: NotFoundPage },
    ],
  },
])
