# Rompecoco

Sitio web con una colección de juegos de ingenio (criptogramas, juegos de
palabras, lógica). La home lista los juegos y cada uno se juega en `/juegos/:slug`.

**Antes de trabajar, lee `docs/README.md`**: es el índice de toda la
documentación (visión, arquitectura, design system y una ficha por juego).

## Esenciales

- Node 24 (`nvm use`), gestor **pnpm**. Scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`.
- Stack: Vite + React 19 + TS, Tailwind v4, shadcn/ui (radix-nova, Radix), react-router.
- Alias `@/` apunta a `src/`. Catálogo de juegos en `src/games/registry.ts`; componentes jugables en `src/games/game-components.ts`.
- Juegos implementados: **Palabra** (`src/games/palabra/`) y **Hilos** (`src/games/hilos/`, tableros en `content/hilos.json` → `pnpm puzzles:hilos`). Sirven de referencia para los siguientes.
- Sin backend por ahora (ver `docs/backend.md`). Deploy en Vercel desde GitHub (ver `docs/deploy.md`); `vercel.json` hace el rewrite de la SPA.
- SEO: meta base en `index.html` (`%VITE_SITE_URL%`) y `usePageMeta()` por página.
- UI en **español**. Colores: solo tokens semánticos (`bg-primary`…), nunca colores fijos.
- Componentes shadcn: se agregan con `pnpm dlx shadcn@latest add <comp>`.

## Mantener la documentación

Al terminar un cambio relevante, actualiza el doc que corresponda en `docs/`
(ficha del juego, `arquitectura.md`, `decisiones.md`, tabla de estados en `docs/README.md`).
