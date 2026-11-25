# Rompecoco

Juegos para romperte el coco: palabras, letras y lógica. Un reto nuevo cada día.

- **Palabra**: adivina la palabra secreta en 6 intentos.
- **Hilos**: une letras vecinas para encontrar las palabras de un tema.

## Desarrollo

```bash
nvm use        # Node 24 (ver .nvmrc)
pnpm install
pnpm dev       # http://localhost:5173
```

| Script | Qué hace |
| --- | --- |
| `pnpm build` | Typecheck + build de producción en `dist/` |
| `pnpm test` | Tests (vitest) |
| `pnpm lint` | ESLint |
| `pnpm puzzles:hilos` | Genera los tableros de Hilos desde `content/hilos.json` |
| `pnpm words:palabra` | Regenera el diccionario de Palabra |
| `pnpm images` | Regenera la imagen para compartir (OG) y los íconos |

Stack: Vite + React 19 + TypeScript, Tailwind CSS v4, shadcn/ui (Radix), React Router.

## Deploy

Vercel, con despliegue automático desde GitHub. Ver [`docs/deploy.md`](./docs/deploy.md).

## Documentación

Todo el contexto del proyecto (visión, arquitectura, design system, una ficha
por juego, decisiones) está en [`docs/`](./docs/README.md).
