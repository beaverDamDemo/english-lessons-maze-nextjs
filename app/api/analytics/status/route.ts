import { NextResponse } from 'next/server';
import postgres from 'postgres';
import {
  getAnalyticsBackend,
  getConfiguredTarget,
  getSupabaseAdminConfig,
  getSupabaseHeaders,
  readSupabaseError,
} from '../_lib/backend';

export async function GET() {
  const backend = getAnalyticsBackend();
  const target = getConfiguredTarget();
  const dbUrl = process.env.POSTGRES_URL;
  const dbConfigured = target.configured;

  if (!dbConfigured) {
    return NextResponse.json({
      ok: true,
      dbConfigured: false,
      dbBackend: backend,
      host: target.host,
      database: target.database,
      canConnect: false,
      dbError: 'No analytics backend is configured',
      analyticsTables: [],
    });
  }

  if (backend === 'supabase-rest') {
    const supabase = getSupabaseAdminConfig();

    if (!supabase) {
      return NextResponse.json({
        ok: true,
        dbConfigured: true,
        dbBackend: backend,
        host: target.host,
        database: target.database,
        canConnect: false,
        dbError: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing',
        analyticsTables: [],
      });
    }

    try {
      const headers = getSupabaseHeaders(supabase.serviceRoleKey);
      const [usersResponse, eventsResponse] = await Promise.all([
        fetch(`${supabase.url}/rest/v1/analytics_users?select=anonymous_id&limit=1`, {
          headers,
          cache: 'no-store',
        }),
        fetch(`${supabase.url}/rest/v1/analytics_events?select=id&limit=1`, {
          headers,
          cache: 'no-store',
        }),
      ]);

      if (!usersResponse.ok) {
        throw new Error(await readSupabaseError(usersResponse));
      }

      if (!eventsResponse.ok) {
        throw new Error(await readSupabaseError(eventsResponse));
      }

      return NextResponse.json({
        ok: true,
        dbConfigured: true,
        dbBackend: backend,
        host: target.host,
        database: target.database,
        canConnect: true,
        dbError: null,
        analyticsTables: [
          { table_schema: 'public', table_name: 'analytics_events' },
          { table_schema: 'public', table_name: 'analytics_users' },
        ],
      });
    } catch (error) {
      return NextResponse.json({
        ok: true,
        dbConfigured: true,
        dbBackend: backend,
        host: target.host,
        database: target.database,
        canConnect: false,
        dbError: error instanceof Error ? error.message : 'Unknown Supabase error',
        analyticsTables: [],
      });
    }
  }

  if (!dbUrl) {
    return NextResponse.json({
      ok: true,
      dbConfigured: false,
      dbBackend: backend,
      host: target.host,
      database: target.database,
      canConnect: false,
      dbError: 'POSTGRES_URL is not set',
      analyticsTables: [],
    });
  }

  let sql: ReturnType<typeof postgres> | null = null;

  try {
    sql = postgres(dbUrl, {
      ssl: 'require',
      max: 1,
      prepare: false,
      connect_timeout: 15,
    });

    await sql`SELECT 1`;

    const tables = await sql<
      Array<{ table_schema: string; table_name: string; }>
    >`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('analytics_users', 'analytics_events')
      ORDER BY table_name;
    `;

    return NextResponse.json({
      ok: true,
      dbConfigured: true,
      dbBackend: backend,
      host: target.host,
      database: target.database,
      canConnect: true,
      dbError: null,
      analyticsTables: tables,
    });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      dbConfigured: true,
      dbBackend: backend,
      host: target.host,
      database: target.database,
      canConnect: false,
      dbError: error instanceof Error ? error.message : 'Unknown DB error',
      analyticsTables: [],
    });
  } finally {
    if (sql) {
      await sql.end({ timeout: 2 });
    }
  }
}
