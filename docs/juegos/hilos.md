# Hilos

- **Slug:** `hilos` → `/juegos/hilos`
- **Categoría:** Asociación
- **Dificultad:** Media
- **Duración estimada:** ~6 min
- **Estado:** ✅ Disponible (MVP)

## Idea en una frase

Un tablero de letras donde hay que "tirar del hilo": unir letras vecinas para
formar las palabras de un tema escondido, que juntas llenan el tablero.

## Cómo se juega

1. Se muestra un tablero de **6 columnas × 8 filas** y una **pista del tema**.
2. Se forma una palabra uniendo letras **vecinas** (las 8 direcciones):
   - **Arrastrando** el dedo o el mouse, que es lo principal; se puede retroceder volviendo a la letra anterior.
   - **Tocando** letra por letra y tocando la última otra vez para enviar (o el botón Enviar).
   - La letra se marca **al presionar** (no al soltar), en morado translucido (`bg-primary/30`), con un pequeño "pop".
     La regla de qué hace cada toque es `pressCell()` en `logic.ts`.
3. Si la palabra es del tema **y sigue su camino exacto**, queda fijada en morado
   con su hilo dibujado. Sus letras ya no se pueden reutilizar.
4. La **palabra eje** resume el tema, une dos lados opuestos del tablero y se pinta de naranja.
5. Se gana al encontrar todas las palabras; no sobra ninguna letra.

## Reglas (decididas)

| Regla | Decisión |
| --- | --- |
| Tablero | 6×8 = 48 letras, sin tildes (la palabra se muestra con tilde al encontrarla) |
| Largo mínimo | 4 letras |
| Palabra del tema por otro camino | No cuenta; aviso "Va por otro camino" |
| Palabra al revés | No cuenta (las palabras se leen en su orden) |
| Palabras extra | Válidas en el diccionario y trazables en el tablero; no fijan casillas |
| Pistas | Cada **3 palabras extra** = 1 pista. La pista marca con línea punteada las letras de una palabra del tema (primero las normales, el eje al final). Solo una pista activa a la vez |
| Derrota | No hay; se mide cuántas pistas se usaron |

## Modos

- **Diaria:** un tablero por día (`indexForDay(día, tableros)`), con progreso y estadísticas.
- **Libre:** tablero al azar, sin guardar. Con pocos tableros, el modo libre
  puede adelantar tableros de días futuros.

## Contenido: cómo se crean los tableros

Los tableros **no se arman a mano**:

1. Se escribe el tema en `content/hilos.json`: `id`, `clue` (pista), `eje` y `words`.
   La suma de letras **debe ser 48** (sin contar tildes), el eje debe tener ≥ 6 letras
   y cada palabra ≥ 4.
2. Se ejecuta `pnpm puzzles:hilos`. El generador (`scripts/generate-hilos-puzzles.mjs`):
   - coloca el eje como un camino que une lados opuestos (izquierda-derecha, o arriba-abajo si tiene ≥ 8 letras);
   - reparte el resto con búsqueda con retroceso, de modo que cubran todo el tablero
     **sin cruces en diagonal** entre hilos;
   - calcula las palabras extra trazables (diccionario `an-array-of-spanish-words`, 4–10 letras);
   - es **determinístico** (la semilla sale del `id`): misma entrada → mismo tablero.
3. Sale `src/games/hilos/puzzles.generated.ts` (no editar a mano).
4. `pnpm test` valida cada tablero: cubre todo, caminos vecinos, eje de lado a lado.

> Hoy hay **12 tableros**, así que el diario se repite cada 12 días. Hace falta más contenido.

Las palabras extra salen de un diccionario muy amplio (incluye conjugaciones
raras). Sirve para que casi cualquier palabra real sume, aunque a veces acepta
palabras poco comunes.

## Persistencia (localStorage)

Clave `rompecoco:hilos` (ver `storage.ts`): progreso del día (`found`, `extras`,
`hintsUsed`, `hintIndex`, `events`), estadísticas (`completed`, `perfect`,
rachas) y `seenHelp`.

## Compartir

Orden de los hallazgos, sin revelar palabras, en filas de 4: 🟣 palabra, 🟠 eje, 💡 pista.

## Estructura del código

```
content/hilos.json                   # temas y palabras (lo que se edita)
scripts/generate-hilos-puzzles.mjs   # generador → puzzles.generated.ts
src/games/hilos/
├── index.tsx              # HilosGame (lazy)
├── use-hilos.ts           # estado, selección, pistas, guardado
├── logic.ts               # reglas puras + compartir
├── logic.test.ts          # tests + validación de todos los tableros
├── storage.ts             # localStorage y estadísticas
├── types.ts
├── puzzles.generated.ts   # generado
└── components/            # board (arrastre/toque + hilos SVG), help-dialog, stats-dialog
```

## Pendiente / ideas

- [ ] Más tableros (meta: 60 o más para no repetir en dos meses)
- [ ] Filtrar palabras extra demasiado raras (lista de frecuencia)
- [ ] Animación del hilo al encontrar una palabra
- [ ] Archivo de tableros anteriores
