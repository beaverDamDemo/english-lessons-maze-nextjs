import { NextResponse } from 'next/server';
import postgres from 'postgres';
import {
  getAnalyticsBackend,
  getConfiguredTarget,
  getSupabaseAdminConfig,
  getSupabaseHeaders,
  readSupabaseError,
} from '../_lib/backend';
import {
  ANALYTICS_SETUP_SQL,
  ANALYTICS_TABLE_ROWS,
  getSupabaseSchemaStatus,
} from '../_lib/schema';

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
      schemaReady: false,
      setupRequired: false,
      missingTables: [],
      dbError: 'No analytics backend is configured',
      rawDbError: null,
      setupSql: null,
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
        schemaReady: false,
        setupRequired: false,
        missingTables: [],
        dbError: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing',
        rawDbError: null,
        setupSql: null,
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

      const errors: string[] = [];

      if (!usersResponse.ok) {
        errors.push(await readSupabaseError(usersResponse));
      }

      if (!eventsResponse.ok) {
        errors.push(await readSupabaseError(eventsResponse));
      }

      if (errors.length) {
        const schemaStatus = getSupabaseSchemaStatus(errors);

        if (schemaStatus) {
          return NextResponse.json({
            ok: true,
            dbConfigured: true,
            dbBackend: backend,
            host: target.host,
            database: target.database,
            canConnect: schemaStatus.canConnect,
            schemaReady: schemaStatus.schemaReady,
            setupRequired: schemaStatus.setupRequired,
            missingTables: schemaStatus.missingTables,
            dbError: schemaStatus.dbError,
            rawDbError: schemaStatus.rawDbError,
            setupSql: schemaStatus.setupSql,
            analyticsTables: [],
          });
        }

        throw new Error(errors.join(' | '));
      }

      return NextResponse.json({
        ok: true,
        dbConfigured: true,
        dbBackend: backend,
        host: target.host,
        database: target.database,
        canConnect: true,
        schemaReady: true,
        setupRequired: false,
        missingTables: [],
        dbError: null,
        rawDbError: null,
        setupSql: null,
        analyticsTables: ANALYTICS_TABLE_ROWS,
      });
    } catch (error) {
      return NextResponse.json({
        ok: true,
        dbConfigured: true,
        dbBackend: backend,
        host: target.host,
        database: target.database,
        canConnect: false,
        schemaReady: false,
        setupRequired: false,
        missingTables: [],
        dbError: error instanceof Error ? error.message : 'Unknown Supabase error',
        rawDbError: error instanceof Error ? error.message : 'Unknown Supabase error',
        setupSql: null,
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
      schemaReady: false,
      setupRequired: false,
      missingTables: [],
      dbError: 'POSTGRES_URL is not set',
      rawDbError: null,
      setupSql: null,
      analyticsTables: [],
    });
  }

  let sql: ReturnType<typeof postgres> | null = null;

  try {
    const ssl = dbUrl.includes('sslmode=disable') ? false : 'require';
    sql = postgres(dbUrl, {
      ssl,
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
      schemaReady: true,
      setupRequired: false,
      missingTables: ANALYTICS_TABLE_ROWS.length === tables.length ? [] : ANALYTICS_TABLE_ROWS
        .map((table) => table.table_name)
        .filter((tableName) => !tables.some((table) => table.table_name === tableName)),
      dbError: null,
      rawDbError: null,
      setupSql: ANALYTICS_TABLE_ROWS.length === tables.length ? null : ANALYTICS_SETUP_SQL,
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
      schemaReady: false,
      setupRequired: false,
      missingTables: [],
      dbError: error instanceof Error ? error.message : 'Unknown DB error',
      rawDbError: error instanceof Error ? error.message : 'Unknown DB error',
      setupSql: null,
      analyticsTables: [],
    });
  } finally {
    if (sql) {
      await sql.end({ timeout: 2 });
    }
  }
}
