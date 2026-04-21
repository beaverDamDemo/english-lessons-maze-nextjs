This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

This app is ready for a standard Vercel deployment.

### One-time setup

1. Import the repository into Vercel.
2. Framework preset: `Next.js`.
3. Build command: `npm run build`.
4. Output setting: leave blank and let Vercel detect it.
5. Install command: `npm install`.

### Deployments

- Push to the default branch to trigger a new deployment.
- Pull requests can generate preview deployments automatically.

### Local production check

```bash
npm run build
npm run start
```

### Existing Vercel project

Deployment history is available here:
[Vercel Link](https://vercel.com/fjasdojf-2974s-projects/english-lessons-maze-nextjs/deployments)

## Supabase analytics setup

If analytics is configured with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, the app can write to Supabase only after the analytics tables exist. Unlike the direct Postgres path, the Supabase REST path cannot create tables automatically.

Run this once in the Supabase SQL editor for the target project:

```sql
CREATE TABLE IF NOT EXISTS public.analytics_users (
	anonymous_id TEXT PRIMARY KEY,
	first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	last_path TEXT,
	user_agent TEXT,
	country TEXT,
	region TEXT,
	city TEXT
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
	id BIGSERIAL PRIMARY KEY,
	anonymous_id TEXT NOT NULL,
	event_name TEXT NOT NULL,
	path TEXT,
	url TEXT,
	payload JSONB NOT NULL DEFAULT '{}'::jsonb,
	user_agent TEXT,
	country TEXT,
	region TEXT,
	city TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_anonymous_id
ON public.analytics_events (anonymous_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
ON public.analytics_events (created_at DESC);
```

After that, `GET /api/analytics/status` should report `schemaReady: true` and analytics writes should succeed.
