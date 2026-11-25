# Cómo agregar un juego nuevo

1. **Documentar primero.** Copia `docs/juegos/_plantilla.md` a
   `docs/juegos/<slug>.md` y completa reglas, mecánica y alcance del MVP.
2. **Registrar en el catálogo.** Agrega una entrada en `src/games/registry.ts`
   (`slug`, `name`, `tagline`, `description`, `category`, `difficulty`,
   `minutes`, `status`, `preview`). Con eso ya aparece en la home y tiene su ruta
   `/juegos/<slug>`.
3. **Preview de la tarjeta.** Añade el tipo a `GamePreviewKind` y su mini
   ilustración en `src/components/games/game-preview.tsx`.
4. **Implementar el juego** en `src/games/<slug>/` siguiendo la estructura de
   [arquitectura.md](./arquitectura.md#cómo-se-monta-cada-juego) (Palabra sirve de ejemplo).
5. **Conectar** el componente en `src/games/game-components.ts` y cambiar `status` a `"disponible"`.
6. **Actualizar docs:** la tabla de juegos en `docs/README.md` y, si hubo
   decisiones relevantes, `docs/decisiones.md`.
