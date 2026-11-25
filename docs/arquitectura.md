# Arquitectura

## Stack

| Pieza | Versión / detalle |
| --- | --- |
| Node | 24 (ver `.nvmrc`, usar `nvm use`). Vite 8 y shadcn piden Node 20 o más |
| Gestor de paquetes | **pnpm** |
| Build | Vite 8 + `@vitejs/plugin-react` |
| UI | React 19 + TypeScript |
| Estilos | Tailwind CSS v4 (configurado en CSS, sin `tailwind.config`) vía `@tailwindcss/vite` |
| Componentes | shadcn/ui, estilo `radix-nova`, primitivas de **Radix** (`radix-ui`) |
| Iconos | `lucide-react` |
| Routing | `react-router` v8 (modo data: `createBrowserRouter`) |
| Fuente | Geist Variable (`@fontsource-variable/geist`) |
| Tests | Vitest (`*.test.ts` junto al código) |

## Scripts

```bash
nvm use        # Node 24
pnpm dev       # servidor de desarrollo
pnpm build     # typecheck + build de producción
pnpm lint      # eslint
pnpm test      # tests (vitest)
pnpm words:palabra  # regenera el diccionario de Palabra
pnpm puzzles:hilos  # genera los tableros de Hilos desde content/hilos.json
```

## Estructura de carpetas

```
src/
├── main.tsx                 # Entrada: providers (Tooltip) + RouterProvider
├── router.tsx               # Definición de rutas
├── index.css                # Tailwind + tokens de tema (paleta morada + colores de juego)
├── games/
│   ├── registry.ts          # Catálogo de juegos (fuente de verdad del listado)
│   ├── game-components.ts   # slug → componente jugable (React.lazy)
│   ├── palabra/             # Juego Palabra (ver docs/juegos/palabra.md)
│   └── hilos/               # Juego Hilos (ver docs/juegos/hilos.md)
├── pages/
│   ├── home-page.tsx        # "/" listado de juegos
│   ├── game-page.tsx        # "/juegos/:slug"
│   └── not-found-page.tsx   # 404
├── components/
│   ├── ui/                  # Componentes shadcn (generados por la CLI)
│   ├── layout/              # Header, logo, layout raíz
│   └── games/               # Tarjeta, previews y piezas comunes de los juegos:
│                            #   game-toolbar (modo diaria/libre), game-message, game-stats
├── hooks/                   # Hooks compartidos (p. ej. use-theme)
├── lib/utils.ts             # `cn()` para combinar clases
└── lib/daily.ts             # Día del reto diario (compartido por todos los juegos)

content/                     # Contenido editable de los juegos (p. ej. hilos.json)
scripts/                     # Generadores (diccionario de Palabra, tableros de Hilos)
```

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | `HomePage`: hero + grilla de juegos |
| `/juegos/:slug` | `GamePage`: monta el juego si está en `game-components.ts` y su `status` es `"disponible"`; si no, muestra "próximamente" |
| `*` | `NotFoundPage` |

## Convenciones

- Alias de imports: `@/` apunta a `src/` (configurado en `vite.config.ts` y los `tsconfig`).
- Archivos en `kebab-case.tsx`; componentes en `PascalCase`; exports con nombre (no `default`), salvo el `index.tsx` de cada juego, que usa `default` por `React.lazy`.
- Textos de la UI en **español**.
- Componentes shadcn: **no se editan a mano salvo que sea necesario**. Para
  agregar uno: `pnpm dlx shadcn@latest add <componente>`.
- Colores: usar siempre los tokens semánticos (`bg-primary`, `text-muted-foreground`…),
  nunca colores fijos de Tailwind (`bg-purple-500`). Ver [design-system.md](./design-system.md).
- La lógica de cada juego se mantiene aislada en su propia carpeta
  (`src/games/<slug>/`), separada de la UI, para poder testearla.

## Cómo se monta cada juego

```
src/games/<slug>/
├── index.tsx        # Componente raíz del juego (lo renderiza GamePage)
├── logic.ts         # Reglas puras: estado, validación, victoria (sin React)
├── data.ts          # Contenido (palabras, frases, tableros)
└── components/      # Piezas de UI propias del juego
```

`index.tsx` exporta el juego por `default` y se registra en
`src/games/game-components.ts` con `React.lazy`, así cada juego es su propio
chunk y solo se descarga al abrirlo. Referencias: `src/games/palabra/` y `src/games/hilos/`.

Piezas comunes para todo juego nuevo:

- `GameToolbar`: modo Diaria/Libre, número de reto, ayuda y estadísticas.
- `GameMessage`: aviso flotante sobre el tablero.
- `Stat` y `NextPuzzleCountdown` para los diálogos de estadísticas.
- `getDayNumber()` e `indexForDay()` de `@/lib/daily` para el reto diario (el día 0 es el 2026-01-01).
- Patrón de estado: `use-<juego>.ts` con progreso en `localStorage` (`rompecoco:<juego>`) y lógica pura testeada en `logic.ts`.
