# Criptico

- **Slug:** `criptico` → `/juegos/criptico`
- **Categoría:** Lógica
- **Dificultad:** Media
- **Duración estimada:** ~8 min
- **Estado:** Idea (las reglas de abajo son una propuesta inicial)

## Idea en una frase

Un criptograma: una frase (refrán, cita o dicho) donde cada letra fue
sustituida por un número, y hay que descubrir qué letra corresponde a cada uno.

## Cómo se juega

1. Se muestra la frase cifrada: cada casilla tiene un número debajo.
2. La persona selecciona una casilla y escribe una letra.
3. Esa letra se coloca en **todas** las casillas con el mismo número.
4. Algunas letras pueden venir reveladas como pista inicial.

## Reglas

- Sustitución uno a uno: un número equivale siempre a la misma letra y dos
  números distintos nunca son la misma letra.
- Espacios y signos de puntuación se muestran tal cual.
- Ñ y letras con tilde: normalizar (á→a) para el cifrado; definir si la Ñ cuenta como letra propia.

## Condición de victoria

La frase queda completa y correcta. Opcional: límite de errores o de pistas.

## Contenido

Lista curada de refranes y frases en español (`src/games/criptico/data.ts`).

## Alcance del MVP

- [ ] Tablero con la frase cifrada y casillas seleccionables
- [ ] Teclado en pantalla y soporte de teclado físico
- [ ] Propagación de la letra a todas las casillas del mismo número
- [ ] Detección de victoria
- [ ] Botón de pista (revelar una letra)

## Preguntas abiertas

- ¿Un reto diario o reto libre?
- ¿Se marcan los errores en el momento o solo al final?
