export const ANALYTICS_TABLES = [
  'analytics_events',
  'analytics_users',
] as const;

export const ANALYTICS_TABLE_ROWS = ANALYTICS_TABLES.map((tableName) => ({
  table_schema: 'public',
  table_name: tableName,
}));

export const ANALYTICS_SETUP_SQL = `CREATE TABLE IF NOT EXISTS public.analytics_users (
  anonymous_id TEXT PRIMARY KEY,
  user_id BIGINT REFERENCES public.app_users(id) ON DELETE SET NULL,
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
  user_id BIGINT REFERENCES public.app_users(id) ON DELETE SET NULL,
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

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id
ON public.analytics_events (user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
ON public.analytics_events (created_at DESC);`;

export type SupabaseSchemaStatus = {
  setupRequired: boolean;
  missingTables: string[];
  dbError: string | null;
  rawDbError: string | null;
  canConnect: boolean;
  schemaReady: boolean;
  setupSql: string | null;
};

function extractMissingTables(message: string): string[] {
  const lowerMessage = message.toLowerCase();

  return ANALYTICS_TABLES.filter(
    (tableName) =>
      lowerMessage.includes(`public.${tableName}`) ||
      lowerMessage.includes(`'${tableName}'`) ||
      lowerMessage.includes(`\"${tableName}\"`),
  );
}

export function getSupabaseSchemaStatus(errors: string[]): SupabaseSchemaStatus | null {
  if (!errors.length) {
    return null;
  }

  const combinedMessage = errors.join(' | ');
  const lowerCombinedMessage = combinedMessage.toLowerCase();
  const isMissingTableError =
    lowerCombinedMessage.includes('could not find the table') ||
    lowerCombinedMessage.includes('schema cache');

  if (!isMissingTableError) {
    return null;
  }

  const missingTables = Array.from(
    new Set(errors.flatMap((message) => extractMissingTables(message))),
  );

  return {
    setupRequired: true,
    missingTables: missingTables.length ? missingTables : [...ANALYTICS_TABLES],
    dbError:
      'Supabase is reachable, but the analytics tables are not created yet. Run the setup SQL in the Supabase SQL editor.',
    rawDbError: combinedMessage,
    canConnect: true,
    schemaReady: false,
    setupSql: ANALYTICS_SETUP_SQL,
  };
}