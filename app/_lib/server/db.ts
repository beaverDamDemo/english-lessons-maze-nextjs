import postgres from 'postgres';

declare global {
  var __playlandDb: ReturnType<typeof postgres> | undefined;
}

function createDbClient() {
  const isProdMode = process.env.NODE_ENV === 'production' || process.env.USE_PROD_DB === 'true';
  const url = isProdMode ? process.env.POSTGRES_URL_PROD : process.env.POSTGRES_URL;

  if (!url) {
    throw new Error(`Database URL is not set. ${isProdMode ? 'POSTGRES_URL_PROD' : 'POSTGRES_URL'} is required.`);
  }

  const ssl = url.includes('sslmode=disable') ? false : 'require';

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`Invalid database URL: ${url}`);
  }

  const database = parsedUrl.pathname.replace(/^\//, '');

  return postgres({
    host: parsedUrl.hostname,
    port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 5432,
    database,
    username: parsedUrl.username,
    password: parsedUrl.password,
    ssl,
    prepare: false,
    max: 5,
    connect_timeout: 15,
  });
}

export const db = globalThis.__playlandDb ?? createDbClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__playlandDb = db;
}
