type ParsedTarget = {
  host: string | null;
  database: string | null;
};

export type AnalyticsBackend = 'supabase-rest' | 'postgres';

type SupabaseAdminConfig = {
  url: string;
  serviceRoleKey: string;
};

function parseDbTarget(rawUrl: string | undefined): ParsedTarget {
  if (!rawUrl) {
    return { host: null, database: null };
  }

  try {
    const parsed = new URL(rawUrl);
    const database = parsed.pathname.replace(/^\//, '') || null;
    return { host: parsed.hostname || null, database };
  } catch {
    return { host: null, database: null };
  }
}

export function getPostgresTarget(): ParsedTarget {
  return parseDbTarget(process.env.POSTGRES_URL);
}

export function getSupabaseTarget(): ParsedTarget {
  return parseDbTarget(process.env.SUPABASE_URL);
}

export function getSupabaseAdminConfig(): SupabaseAdminConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ''), serviceRoleKey };
}

export function getAnalyticsBackend(): AnalyticsBackend | null {
  if (getSupabaseAdminConfig()) {
    return 'supabase-rest';
  }

  if (process.env.POSTGRES_URL) {
    return 'postgres';
  }

  return null;
}

export function getConfiguredTarget() {
  const backend = getAnalyticsBackend();

  if (backend === 'supabase-rest') {
    return {
      backend,
      configured: true,
      ...getSupabaseTarget(),
    };
  }

  if (backend === 'postgres') {
    return {
      backend,
      configured: true,
      ...getPostgresTarget(),
    };
  }

  return {
    backend: null,
    configured: false,
    host: null,
    database: null,
  };
}

export async function readSupabaseError(response: Response): Promise<string> {
  const bodyText = await response.text().catch(() => '');

  if (!bodyText) {
    return `${response.status} ${response.statusText}`.trim();
  }

  try {
    const parsed = JSON.parse(bodyText) as {
      message?: string;
      error?: string;
      details?: string;
      hint?: string;
    };

    return (
      parsed.message ??
      parsed.error ??
      parsed.details ??
      parsed.hint ??
      bodyText
    );
  } catch {
    return bodyText;
  }
}

export function getSupabaseHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}