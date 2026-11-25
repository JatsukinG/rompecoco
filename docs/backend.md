# Backend: ¿cuándo y cómo?

## Estado actual: sin backend

Todo corre en el navegador:

- El **contenido** (palabras, tableros) está en el código y se publica con cada deploy.
- El **progreso y las estadísticas** se guardan en `localStorage` (por dispositivo).

Esto alcanza para jugar, cuesta $0 y no tiene nada que mantener.

## Cuándo conviene sumar Supabase

| Necesidad | Sin backend | Con Supabase |
| --- | --- | --- |
| Rachas y estadísticas en varios dispositivos | ❌ Cada navegador tiene las suyas | ✅ Cuentas (Supabase Auth) + tabla de progreso |
| Rankings / comparar con amigos | ❌ | ✅ Tabla de resultados + vistas |
| Publicar retos nuevos sin hacer deploy | ❌ | ✅ Tablas de contenido + un panel de edición |
| Ocultar las respuestas | ❌ Están en el bundle | ✅ Validación en el servidor (Edge Functions / RPC) |
| Métricas (qué juegos se juegan, dónde se traban) | Analítica externa | ✅ Eventos propios |

**Recomendación:** sumarlo cuando aparezca la primera de estas necesidades de
forma real (lo más probable: cuentas para no perder la racha o un panel para
cargar contenido). Hoy no hace falta.

## Cómo está preparado el código

- Cada juego obtiene su contenido con una función (`getDailySolution(día)`,
  `getPuzzleForDay(día)`). Pasar a Supabase es cambiar esas funciones por una consulta.
- El guardado pasa por `storage.ts` de cada juego (`loadSave` / `writeSave`);
  se puede sincronizar con una tabla sin tocar la UI.

## Esquema tentativo (cuando llegue el momento)

```sql
-- Contenido diario por juego
create table daily_puzzles (
  game text not null,          -- 'palabra' | 'hilos' | ...
  day  int  not null,          -- getDayNumber()
  data jsonb not null,         -- solución / tablero
  primary key (game, day)
);

-- Resultado de cada persona por día
create table results (
  user_id uuid references auth.users not null,
  game text not null,
  day  int  not null,
  data jsonb not null,         -- intentos, pistas, tiempo...
  completed_at timestamptz default now(),
  primary key (user_id, game, day)
);
-- RLS: cada persona solo lee y escribe sus propias filas.
```

Las claves de Supabase irían en `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
y **nunca** la `service_role` en el cliente.
