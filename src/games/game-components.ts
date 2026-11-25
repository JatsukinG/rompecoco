import { lazy, type ComponentType, type LazyExoticComponent } from "react"

/**
 * Componente jugable de cada juego, cargado bajo demanda (code splitting).
 * Si un juego no aparece aquí, GamePage muestra el placeholder "próximamente".
 */
export const gameComponents: Record<
  string,
  LazyExoticComponent<ComponentType> | undefined
> = {
  palabra: lazy(() => import("./palabra")),
  hilos: lazy(() => import("./hilos")),
}
