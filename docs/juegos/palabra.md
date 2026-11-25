# Palabra

- **Slug:** `palabra` → `/juegos/palabra`
- **Categoría:** Palabras
- **Dificultad:** Fácil
- **Duración estimada:** ~4 min
- **Estado:** ✅ Disponible (MVP)

## Idea en una frase

Adivinar una palabra secreta de 5 letras en un máximo de 6 intentos, con
pistas por color tras cada intento.

## Cómo se juega

1. La persona escribe una palabra válida de 5 letras y la envía.
2. Cada letra recibe un estado:
   - **Acierto** (`hit`): letra y posición correctas, en **verde**.
   - **Cerca** (`near`): la letra está, pero en otra posición, en **naranja**.
   - **Fallo** (`miss`): la letra no está, en **gris**.

   Colores en tokens `--game-*` (ver [design-system.md](../design-system.md#estados-de-juego-convención)).
3. El teclado en pantalla muestra el mejor estado conocido de cada letra.

## Reglas (decididas)

| Regla | Decisión |
| --- | --- |
| Largo / intentos | 5 letras, 6 intentos (`WORD_LENGTH`, `MAX_ATTEMPTS` en `logic.ts`) |
| Tildes | No importan: se normaliza todo (á→a, ü→u). La solución se **muestra** con tilde al final |
| Ñ | Es una letra propia (tecla Ñ en el teclado) |
| Letras repetidas | Primero se marcan los aciertos; después cada letra solo es "cerca" tantas veces como aparezca en la solución sin acertar |
| Intentos válidos | Deben estar en el diccionario (≈10.800 palabras, incluye plurales y conjugaciones) |
| Modo difícil | No existe (por ahora) |

## Modos

- **Diaria:** una palabra por día (cambia a la medianoche **local**), igual para todos.
  El reto #1 fue el 1 de enero de 2026. Se guarda el progreso y las estadísticas.
- **Libre:** palabra al azar, partidas ilimitadas. No se guarda ni suma a las estadísticas.

## Contenido

| Archivo | Qué es |
| --- | --- |
| `src/games/palabra/words/solutions.ts` | ~550 posibles soluciones, curadas a mano (comunes, sin plurales, aptas para todo público), con tildes |
| `src/games/palabra/words/valid-words.ts` | **Generado**: intentos aceptados. Fuente: `an-array-of-spanish-words` (MIT). Regenerar con `pnpm words:palabra` |

La palabra diaria sale de barajar `SOLUTIONS` con una semilla fija (mulberry32)
e indexar por número de día.

> ⚠️ Agregar o quitar soluciones **cambia el orden de todos los días futuros**
> (y la palabra de hoy). Si eso molesta en el futuro, congelar el orden en una
> lista explícita por fecha.

Las soluciones están en el bundle del cliente: alguien curioso puede encontrarlas.
Es aceptable para un juego casual sin backend.

## Persistencia (localStorage)

Clave `rompecoco:palabra` (ver `storage.ts`):

```ts
{ version: 1,
  daily: { day, guesses[] } | null,   // progreso del día
  stats: { played, wins, currentStreak, maxStreak,
           distribution[6], lastWonDay, lastCompletedDay },
  seenHelp: boolean }                 // la ayuda se abre sola la primera vez
```

- El resultado se registra **al enviar** el último intento (no al terminar la
  animación), y es idempotente por día (`lastCompletedDay`).
- La racha se muestra como 0 si el último día ganado no es hoy ni ayer.

## UI / interacción

- Teclado físico (letras, Ñ, tildes, Enter, Backspace) y teclado en pantalla (QWERTY español).
- Animaciones (`index.css`): `tile-pop` al escribir, `tile-flip` escalonado al
  revelar (500 ms + 250 ms por ficha), `row-shake` si el intento no es válido,
  `tile-bounce` al ganar. Respetan `prefers-reduced-motion` (`motion-safe:`).
- Mensajes flotantes: "Faltan letras", "No está en la lista", felicitación según intento, solución al perder.
- Diálogos: **Cómo jugar** y **Estadísticas** (distribución, racha, cuenta regresiva y Compartir).
- Compartir copia al portapapeles una cuadrícula sin letras: 🟩 acierto, 🟧 cerca, ⬜ fallo.

## Estructura del código

```
src/games/palabra/
├── index.tsx            # PalabraGame (componente raíz, lazy)
├── use-palabra.ts       # estado, timers de animación, teclado físico, guardado
├── logic.ts             # reglas puras: normalizar, evaluar, día, compartir
├── logic.test.ts        # tests (vitest): pnpm test
├── storage.ts           # localStorage y estadísticas
├── words/               # soluciones y diccionario generado
└── components/          # board, tile, tile-styles, keyboard, help-dialog, stats-dialog
```

## Pendiente / ideas

- [ ] Modo difícil (obligar a usar las pistas reveladas)
- [ ] Modo alto contraste (accesibilidad de colores)
- [ ] Revisar y ampliar la lista de soluciones
- [ ] Cambio automático de día si la pestaña queda abierta pasada la medianoche
