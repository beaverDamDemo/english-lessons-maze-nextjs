import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';
import postgres from 'postgres';
import {
  getAnalyticsBackend,
  getConfiguredTarget,
  getSupabaseAdminConfig,
  getSupabaseHeaders,
  readSupabaseError,
} from '../_lib/backend';

const ANON_COOKIE_NAME = 'playland_anon_id';

type TrackBody = {
  eventName?: string;
  payload?: Record<string, unknown>;
  path?: string;
  url?: string;
};

let tablesInitialized = false;
type DbClient = ReturnType<typeof postgres>;

const db: DbClient | null = process.env.POSTGRES_URL
  ? postgres(process.env.POSTGRES_URL, {
    ssl: 'require',
    max: 1,
    prepare: false,
    connect_timeout: 15,
  })
  : null;

async function ensureTables(client: DbClient) {
  if (tablesInitialized) return;

  await client`
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
  `;

  await client`
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
  `;

  await client`
    CREATE INDEX IF NOT EXISTS idx_analytics_events_anonymous_id
    ON public.analytics_events (anonymous_id);
  `;

  await client`
    CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
    ON public.analytics_events (created_at DESC);
  `;

  tablesInitialized = true;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as TrackBody;
  const eventName = (body.eventName ?? '').trim();

  if (!eventName) {
    return NextResponse.json(
      { ok: false, error: 'Missing eventName' },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  let anonymousId = cookieStore.get(ANON_COOKIE_NAME)?.value;
  const isNewId = !anonymousId;

  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
  }

  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent') ?? '';
  const country = headerStore.get('x-vercel-ip-country') ?? null;
  const region = headerStore.get('x-vercel-ip-country-region') ?? null;
  const city = headerStore.get('x-vercel-ip-city') ?? null;

  const path = typeof body.path === 'string' ? body.path.slice(0, 300) : null;
  const url = typeof body.url === 'string' ? body.url.slice(0, 500) : null;
  const payload = body.payload ?? {};
  const target = getConfiguredTarget();
  const backend = getAnalyticsBackend();
  const dbConfigured = target.configured;
  let dbWrite = false;
  let dbError: string | null = null;
  let dbErrorCode: string | null = null;

  if (backend === 'supabase-rest') {
    const supabase = getSupabaseAdminConfig();

    if (!supabase) {
      dbError = 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing';
    } else {
      try {
        const headers = getSupabaseHeaders(supabase.serviceRoleKey);

        const userResponse = await fetch(
          `${supabase.url}/rest/v1/analytics_users?on_conflict=anonymous_id`,
          {
            method: 'POST',
            headers: {
              ...headers,
              Prefer: 'resolution=merge-duplicates,return=minimal',
            },
            body: JSON.stringify({
              anonymous_id: anonymousId,
              first_seen_at: new Date().toISOString(),
              last_seen_at: new Date().toISOString(),
              last_path: path,
              user_agent: userAgent,
              country,
              region,
              city,
            }),
          },
        );

        if (!userResponse.ok) {
          throw new Error(await readSupabaseError(userResponse));
        }

        const eventResponse = await fetch(`${supabase.url}/rest/v1/analytics_events`, {
          method: 'POST',
          headers: {
            ...headers,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            anonymous_id: anonymousId,
            event_name: eventName.slice(0, 100),
            path,
            url,
            payload,
            user_agent: userAgent,
            country,
            region,
            city,
          }),
        });

        if (!eventResponse.ok) {
          throw new Error(await readSupabaseError(eventResponse));
        }

        dbWrite = true;
      } catch (error) {
        console.error('Analytics Supabase write failed:', error);
        dbError = error instanceof Error ? error.message : 'Unknown Supabase error';
      }
    }
  } else if (backend === 'postgres' && dbConfigured && db) {
    try {
      await ensureTables(db);

      await db`
        INSERT INTO public.analytics_users (
          anonymous_id,
          first_seen_at,
          last_seen_at,
          last_path,
          user_agent,
          country,
          region,
          city
        )
        VALUES (
          ${anonymousId},
          NOW(),
          NOW(),
          ${path},
          ${userAgent},
          ${country},
          ${region},
          ${city}
        )
        ON CONFLICT (anonymous_id)
        DO UPDATE SET
          last_seen_at = NOW(),
          last_path = EXCLUDED.last_path,
          user_agent = EXCLUDED.user_agent,
          country = EXCLUDED.country,
          region = EXCLUDED.region,
          city = EXCLUDED.city;
      `;

      await db`
        INSERT INTO public.analytics_events (
          anonymous_id,
          event_name,
          path,
          url,
          payload,
          user_agent,
          country,
          region,
          city,
          created_at
        )
        VALUES (
          ${anonymousId},
          ${eventName.slice(0, 100)},
          ${path},
          ${url},
          ${JSON.stringify(payload)},
          ${userAgent},
          ${country},
          ${region},
          ${city},
          NOW()
        );
      `;
      dbWrite = true;
    } catch (error) {
      console.error('Analytics DB write failed:', error);
      dbError = error instanceof Error ? error.message : 'Unknown DB error';
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        typeof (error as { code?: unknown; }).code === 'string'
      ) {
        dbErrorCode = (error as { code: string; }).code;
      }
    }
  } else {
    console.info('Analytics event (no DB configured):', {
      anonymousId,
      eventName,
      path,
      country,
      region,
      city,
    });
  }

  const response = NextResponse.json({
    ok: true,
    anonymousId,
    dbBackend: backend,
    dbConfigured,
    dbHost: target.host,
    dbDatabase: target.database,
    dbWrite,
    dbError,
    dbErrorCode,
  });

  if (isNewId) {
    response.cookies.set(ANON_COOKIE_NAME, anonymousId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365 * 2,
    });
  }

  return response;
}
