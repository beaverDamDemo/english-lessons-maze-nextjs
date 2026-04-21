# English Lessons Maze - Development Setup

## Database Setup

### Local Development (Docker PostgreSQL)

This project uses Docker Compose to run a local PostgreSQL database for development.

#### Environment Files

- `.env.local` - Contains database connection strings for both local and production
- Local database: `postgres://postgres:password@localhost:5434/english-lessons-local?sslmode=disable`
- Production database: `POSTGRES_URL_PROD` (Aiven cloud database)

#### Available Scripts

**Local Development with Local Database:**

```bash
npm run dev:local
```

This automatically starts the Docker PostgreSQL container and runs the Next.js dev server.

**Local Development with Production Database:**

```bash
npm run dev:prod
```

This runs the Next.js dev server but connects to the production Aiven database.

**Database Management:**

```bash
npm run db:start    # Start PostgreSQL container
npm run db:stop     # Stop PostgreSQL container
npm run db:reset    # Reset database (delete all data)
npm run db:logs     # View database logs
```

#### Manual Database Setup (if needed)

If you prefer to run the database manually:

1. Start PostgreSQL:

```bash
docker compose up -d
```

2. Wait for database to initialize (15-20 seconds)

3. Run the development server:

```bash
npm run dev
```

#### Database Schema

The database schema is automatically created from `db/init/001_schema.sql` when the container starts.

#### Environment Variables

- `POSTGRES_URL` - Local database connection string
- `POSTGRES_URL_PROD` - Production database connection string
- `USE_PROD_DB=true` - Force use of production database (for `dev:prod` script)

## Development Workflow

1. **First time setup:**

   ```bash
   npm run dev:local
   ```

2. **Daily development:**
   - Use `npm run dev:local` for local development
   - Use `npm run dev:prod` when you need to test with production data

3. **Reset database:**
   ```bash
   npm run db:reset
   ```

## Production Deployment

For production deployment, ensure the `POSTGRES_URL_PROD` environment variable is set with your Aiven database credentials.
