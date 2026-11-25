# Rompecoco: visión del proyecto

## Qué es

**Rompecoco** es un sitio web con una colección de juegos de ingenio para
entretenerse: rompecabezas, crucigramas, adivinanzas, juegos de palabras y de
lógica. La página principal muestra el listado de juegos; al hacer clic en uno,
la persona entra a jugarlo.

> "Romperse el coco" = pensar mucho, exprimirse la cabeza.

## Para quién

Personas que quieren un reto corto (de 3 a 10 minutos) para despejarse, en el
celular o en la computadora. El público es hispanohablante y toda la interfaz
está en **español**.

## Principios de producto

1. **Partidas cortas.** Cada juego debe poder terminarse en pocos minutos.
2. **Minimalista.** Interfaz limpia, sin ruido, con el foco en el tablero.
3. **Mobile first.** Todo se juega cómodo con el pulgar.
4. **Sin fricción.** No hace falta cuenta para jugar. El progreso local se
   guarda en `localStorage` mientras no haya backend.
5. **Coherencia visual.** Todos los juegos comparten el design system (ver
   [design-system.md](./design-system.md)).

## Alcance actual

- [x] Setup: Vite + React + TypeScript + Tailwind v4 + shadcn/ui (Radix)
- [x] Página principal con el listado de juegos
- [x] Ruta por juego (`/juegos/:slug`) con un placeholder de "próximamente"
- [x] Tema claro/oscuro
- [ ] Implementar Criptico
- [x] Implementar Palabra (diaria + libre, estadísticas, compartir)
- [x] Implementar Hilos (generador de tableros, pistas, diaria + libre)
- [ ] Contenido diario en el resto de juegos (Palabra ya lo tiene)
- [ ] Estadísticas locales en el resto de juegos (Palabra ya las tiene)

## Ideas futuras (sin compromiso)

- Más juegos: sudoku, sopa de letras, adivinanzas, crucigrama mini, nonogramas.
- Compartir resultados (estilo cuadrícula de emojis).
- Backend para el contenido diario y los rankings.
