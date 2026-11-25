# Deploy (GitHub + Vercel)

## Resumen

Es un sitio estático (SPA). `pnpm build` genera `dist/` y Vercel lo sirve.
No hay backend ni variables secretas.

## Primera vez

1. **Subir a GitHub** (desde la raíz del proyecto):
   ```bash
   git remote add origin git@github.com:<usuario>/rompecoco.git
   git push -u origin main
   ```
2. **Importar en Vercel:** vercel.com → *Add New → Project* → elegir el repo.
   Vercel detecta **Vite** solo:
   - Build command: `pnpm build`
   - Output directory: `dist`
   - Install command: `pnpm install`
   - Node: 20.x o más nuevo (`engines` en `package.json`)
3. **Variable de entorno** (opcional): si el dominio final no es
   `https://rompecoco.vercel.app`, define `VITE_SITE_URL` en
   *Settings → Environment Variables* (o cambia `.env`) y vuelve a desplegar.
   Se usa en Open Graph, canonical, `sitemap.xml` y `robots.txt`.

Después, cada `git push` a `main` despliega solo, y cada PR tiene su preview.

## `vercel.json`: ¿por qué hace falta?

La app usa rutas del lado del cliente (`/juegos/palabra`). Si alguien abre esa
URL directo o recarga la página, Vercel busca un archivo `juegos/palabra` que
no existe y devolvería **404**. El *rewrite* manda toda ruta que no sea un
archivo real a `index.html`, y React Router se encarga del resto:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Los archivos reales (`/assets/*.js`, `/og-image.png`, `/robots.txt`…) se sirven
primero, así que no se ven afectados. También se agregó caché larga para
`/assets/*` (los nombres llevan hash, así que es seguro).

## SEO y vista previa al compartir

| Qué | Dónde |
| --- | --- |
| Título, descripción, Open Graph, Twitter Card, theme-color | `index.html` (usa `%VITE_SITE_URL%`) |
| Título/descripción/canonical por ruta | `usePageMeta()` en cada página (`src/hooks/use-page-meta.ts`) |
| Imagen al compartir (1200×630) | `public/og-image.png` |
| Íconos (apple-touch, 192, 512) + manifest | `public/` (generados) |
| `sitemap.xml` y `robots.txt` | generados en el build desde `src/games/registry.ts` (plugin en `vite.config.ts`) |

Para regenerar la imagen OG y los íconos (tras cambiar colores o el logo): `pnpm images`.

> Limitación de una SPA: WhatsApp, Facebook, etc. **no ejecutan JS**, así que
> todas las rutas muestran la vista previa general del sitio. Para tener una
> vista previa distinta por juego haría falta prerender o SSR (pendiente).

## Probar el build localmente

```bash
pnpm build && pnpm preview   # http://localhost:4173
```

## Checklist antes de cada deploy

- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm build`
