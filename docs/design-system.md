# Design system

Estilo: **moderno y minimalista**, con mucho espacio en blanco, bordes suaves y
un solo color de marca: **morado** (antes tiraba a fucsia; se ajustó a un morado más puro).

## Paleta

Los tokens viven en `src/index.css` (`:root` para claro y `.dark` para oscuro), en
OKLCH. El tono de marca es **hue ≈ 298–300**.

| Token | Claro | Oscuro | Uso |
| --- | --- | --- | --- |
| `--primary` | `oklch(0.52 0.22 298)` | `oklch(0.7 0.18 300)` | Marca, CTAs, enlaces |
| `--accent` | `oklch(0.95 0.035 300)` | `oklch(0.28 0.06 298)` | Fondos suaves (previews, hover) |
| `--secondary` | `oklch(0.96 0.02 300)` | `oklch(0.26 0.04 295)` | Badges, botones secundarios, teclas |
| `--background` | casi blanco tintado | púrpura muy oscuro | Fondo de página |
| `--muted-foreground` | gris violáceo | gris violáceo claro | Texto secundario |

Los neutros también llevan un leve tinte púrpura (croma bajo) para que todo
se sienta de la misma familia.

**Regla:** usar las clases semánticas (`bg-primary`, `text-accent-foreground`,
`ring-border`…) y opacidades (`bg-primary/25`) en lugar de colores de la paleta
de Tailwind. Así el tema claro/oscuro funciona solo.

## Estados de juego (convención)

Para acierto/cerca/fallo **no se usa el morado de la marca**: tonos de un mismo
color se confundían. Se usan tokens propios (`--game-*` en `index.css`, con
versión clara y oscura), expuestos como clases de Tailwind:

| Estado | Color | Clases |
| --- | --- | --- |
| Acierto / correcto | Verde | `bg-game-hit text-game-hit-foreground` |
| Cerca / posición equivocada | Naranja ámbar | `bg-game-near text-game-near-foreground` |
| Fallo / no está | Gris | `bg-game-miss text-game-miss-foreground` |
| Pendiente / vacío | — | `border-2 border-dashed border-primary/50` |

Verde y naranja también difieren en **luminosidad**, no solo en tono, lo que
ayuda a quien no distingue bien los colores. Pendiente: un modo de alto contraste.

## Animaciones

Definidas en `src/index.css` (`@theme`): `animate-tile-pop`, `animate-tile-flip`,
`animate-tile-bounce`, `animate-row-shake`. Usarlas siempre con `motion-safe:`
para respetar `prefers-reduced-motion`.

## Tipografía

- Fuente: **Geist Variable** (sans).
- Títulos: `font-semibold tracking-tight`, con `text-balance`.
- Texto secundario: `text-muted-foreground`.

## Forma y movimiento

- Radio base `--radius: 0.75rem`; las tarjetas usan `rounded-2xl`.
- Hover de tarjetas: subir 4px (`-translate-y-1`) más una sombra suave tintada de primario.
- Transiciones de `300ms`, sin animaciones llamativas.
- Foco visible siempre: `focus-visible:ring-3 ring-ring/50`.

## Componentes shadcn instalados

`button`, `card`, `badge`, `separator`, `tooltip`, `dialog` (estilo `radix-nova`, base Radix).
El botón "Cerrar" del diálogo se tradujo al español a mano.

Para agregar más: `pnpm dlx shadcn@latest add dialog sonner ...`

## Tema claro / oscuro

- Hook `useTheme()` (`src/hooks/use-theme.ts`): alterna la clase `.dark` en `<html>`
  y lo guarda en `localStorage` (`rompecoco-theme`).
- Un script inline en `index.html` aplica el tema antes de pintar para evitar parpadeo.
