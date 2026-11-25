# Documentación de Rompecoco

Índice de la documentación del proyecto. Estos documentos existen para dar
contexto (a personas y a asistentes de IA) sin tener que re-explicar el
proyecto en cada sesión. **Mantenlos al día cuando cambie algo importante.**

| Documento | Qué contiene |
| --- | --- |
| [proyecto.md](./proyecto.md) | Visión, público, alcance y principios del producto |
| [arquitectura.md](./arquitectura.md) | Stack, estructura de carpetas, rutas y convenciones de código |
| [design-system.md](./design-system.md) | Paleta, tipografía, componentes shadcn y reglas visuales |
| [agregar-un-juego.md](./agregar-un-juego.md) | Paso a paso para sumar un juego nuevo |
| [juegos/](./juegos/) | Una ficha por juego: reglas, mecánica, estado y decisiones |
| [decisiones.md](./decisiones.md) | Registro de decisiones técnicas y de producto (ADR ligero) |
| [backend.md](./backend.md) | Cuándo y cómo sumar un backend (Supabase) |
| [deploy.md](./deploy.md) | GitHub + Vercel, `vercel.json`, SEO y Open Graph |

## Juegos

| Juego | Ficha | Estado |
| --- | --- | --- |
| Criptico | [juegos/criptico.md](./juegos/criptico.md) | Idea / pendiente |
| Palabra | [juegos/palabra.md](./juegos/palabra.md) | ✅ Disponible (MVP) |
| Hilos | [juegos/hilos.md](./juegos/hilos.md) | ✅ Disponible (MVP, 12 tableros) |

Para un juego nuevo, copia [juegos/_plantilla.md](./juegos/_plantilla.md).
