# 🧠 Mindful Feed

Tu "Instagram del conocimiento" — contenido curado y resumido por IA, sin algoritmos de dopamina.

## Stack

| Capa | Tecnología | Coste |
|------|-----------|-------|
| Frontend | Next.js 14 + Tailwind + Framer Motion | $0 (Vercel free) |
| Base de datos | Supabase (PostgreSQL) | $0 (free tier) |
| Automatización | Python + GitHub Actions | $0 |
| IA | Claude claude-sonnet-4-6 | Solo lo que ya pagas |

---

## Puesta en marcha (30 minutos)

### 1. Supabase — Base de datos

1. Ve a [supabase.com](https://supabase.com) → **New project**
2. **SQL Editor** → pega el contenido de `supabase/schema.sql` → **Run**
3. Guarda: `Project URL` y `anon public key` (Settings → API)

### 2. GitHub Secrets — Automatización

En tu repo: **Settings → Secrets and variables → Actions → New repository secret**

| Nombre | Valor |
|--------|-------|
| `ANTHROPIC_API_KEY` | Tu API key de Anthropic |
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_KEY` | `anon public key` de Supabase |

Luego: **Actions → Fetch & Summarize Feeds → Run workflow** para poblar la DB por primera vez.

### 3. Vercel — Frontend

1. Ve a [vercel.com](https://vercel.com) → **Add New Project** → importa tu repo
2. **Root Directory**: `frontend`
3. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` → tu Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → tu anon key
4. **Deploy** ✓

### 4. iPhone — Instalar como app

Safari → tu URL de Vercel → botón **Compartir** → **Añadir a pantalla de inicio** → app fullscreen instalada.

---

## Estructura del proyecto

```
mindful-feed/
├── backend/
│   ├── feeds.yaml          # Fuentes RSS configurables
│   ├── main.py             # Orquestador principal
│   ├── requirements.txt
│   └── fetcher/
│       ├── rss_reader.py   # Descarga y limpia feeds
│       ├── summarizer.py   # Claude API → resumen + tip
│       └── supabase_client.py
├── frontend/
│   └── src/
│       ├── app/            # Next.js App Router
│       ├── components/     # ArticleCard, FeedStack, CategoryBar
│       └── lib/            # Supabase client
├── supabase/
│   └── schema.sql          # DB schema + RLS + RPCs
└── .github/
    └── workflows/
        └── fetch-feeds.yml # Cron job: 4x día
```

## Gestos (móvil)

| Gesto | Acción |
|-------|--------|
| Swipe ↑ | Siguiente artículo |
| Swipe → | Guardar y siguiente |
| Tap "Leer completo" | Abrir fuente original |
| Tap ♡ | Guardar/quitar guardado |

## Personalizar fuentes RSS

Edita `backend/feeds.yaml` y añade/elimina feeds. El script es idempotente — no duplica artículos.
