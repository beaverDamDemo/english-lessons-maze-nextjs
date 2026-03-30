import { NextResponse } from 'next/server';
import postgres from 'postgres';

function parseDbTarget(rawUrl: string | undefined) {
  if (!rawUrl) {
    return { host: null as string | null, database: null as string | null };
  }

  try {
    const parsed = new URL(rawUrl);
    const database = parsed.pathname.replace(/^\//, '') || null;
    return { host: parsed.hostname || null, database };
  } catch {
    return { host: null as string | null, database: null as string | null };
  }
}

export async function GET() {
  const dbUrl = process.env.POSTGRES_URL;
  const dbConfigured = Boolean(dbUrl);
  const { host, database } = parseDbTarget(dbUrl);

  if (!dbConfigured || !dbUrl) {
    return NextResponse.json({
      ok: true,
      dbConfigured: false,
      host,
      database,
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
      host,
      database,
      canConnect: true,
      dbError: null,
      analyticsTables: tables,
    });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      dbConfigured: true,
      host,
      database,
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
