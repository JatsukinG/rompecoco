# Registro de decisiones

Formato breve: fecha, decisión, motivo. La entrada más reciente va arriba.

## 2026-11-25: Hilos (MVP) y backend

- **Sin backend por ahora** (ver [backend.md](./backend.md)): los juegos funcionan 100 % en el cliente; Supabase se suma cuando haga falta (cuentas, rankings, contenido sin redeploy).
- **Tableros generados, no armados a mano:** se escriben tema y palabras en `content/hilos.json` y un script los acomoda. Armar 48 letras sin sobrantes a mano es lento y propenso a errores.
- **Tablero 6×8, mínimo 4 letras, eje de lado a lado**, pistas cada 3 palabras extra.
- **Las palabras del tema solo cuentan por su camino exacto**, para que el tablero tenga una única solución.
- **Sin cruces en diagonal** entre hilos, para que el tablero resuelto se lea claro.
- **Piezas comunes extraídas** (`GameToolbar`, `GameMessage`, `game-stats`, `lib/daily`) al tener dos juegos con el mismo patrón.

## 2026-11-25: Ajustes visuales

- **Paleta más morada** (hue 322 → ~300): la anterior se veía demasiado fucsia.
- **Colores de juego propios: verde, naranja y gris** en lugar de tonos del morado de la marca, porque los tonos de un mismo color eran difíciles de distinguir. Tokens `--game-*`.
- **Tarjetas del listado solo con ilustración y nombre** (2 columnas en móvil, hasta 4 en escritorio) para ver más juegos sin hacer scroll. La descripción, la categoría y la dificultad quedan para la página del juego.

## 2026-11-25: Palabra (MVP)

- **Tildes normalizadas, Ñ como letra propia.** Escribir con tilde en móvil es incómodo; la Ñ sí distingue palabras.
- **Diccionario amplio para intentos** (≈10.800 palabras, generado desde `an-array-of-spanish-words`, MIT) y **lista curada de soluciones** (~550). Que se rechace una palabra real frustra más que aceptar una rara.
- **Dos modos:** diaria (con progreso y estadísticas) y libre (sin guardar).
- **Día según medianoche local**, con reto #1 el 2026-01-01.
- **Sin sonner/toasts globales:** los mensajes del juego son un aviso propio sobre el tablero (sonner pide un proveedor de tema).
- **Vitest** para probar la lógica pura de los juegos.
- Diseño propio (tipografía, formas y animaciones de Rompecoco) dentro de las convenciones de color del género.

## 2026-11-25: Setup inicial

- **Vite + React 19 + TypeScript** como base (SPA, sin SSR: no hace falta para juegos client-side).
- **Tailwind v4** configurado en CSS (`@theme` en `index.css`), sin archivo de config JS.
- **shadcn/ui con Radix** (estilo `radix-nova`) para componentes base accesibles.
- **react-router** para rutas `/` y `/juegos/:slug`.
- **Paleta púrpura/fucsia** (hue ≈ 320) con neutros tintados; tema claro y oscuro (luego ajustada a morado, ver arriba).
- **Catálogo en `src/games/registry.ts`** como única fuente de verdad del listado.
- **Node 24** fijado en `.nvmrc` (Vite 8 y la CLI de shadcn requieren Node 20 o más).
- Los nombres de los juegos son de Rompecoco; las mecánicas se inspiran en géneros
  clásicos (criptogramas, adivinar palabras, sopas de letras temáticas), con contenido y
  diseño propios.
