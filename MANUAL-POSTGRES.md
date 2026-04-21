# Manual PostgreSQL Database Setup

## Option 1: Using Docker Compose (Recommended)

### Step 1: Check docker-compose.yml

Make sure your `docker-compose.yml` looks like this:

```yaml
services:
  postgres:
    image: 16-alpine3.23
    container_name: english-lessons-maze-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: english_lessons
      POSTGRES_USER: playland
      POSTGRES_PASSWORD: playland
    ports:
      - '5434:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init:/docker-entrypoint-initdb.d

volumes:
  postgres_data:
```

### Step 2: Start the database

```bash
docker compose up -d
```

### Step 3: Wait for initialization

Wait 15-30 seconds for PostgreSQL to initialize.

### Step 4: Verify it's working

```bash
docker exec english-lessons-maze-db psql -U playland -d english_lessons -c "SELECT 'Database ready' as status;"
```

## Option 2: Using Docker Run (Manual)

### Step 1: Pull PostgreSQL image

```bash
docker pull postgres:17-alpine
```

### Step 2: Create and run container

```bash
docker run -d \
  --name english-lessons-maze-db \
  -e POSTGRES_DB=english_lessons \
  -e POSTGRES_USER=playland \
  -e POSTGRES_PASSWORD=playland \
  -p 5434:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -v $(pwd)/db/init:/docker-entrypoint-initdb.d \
  postgres:17-alpine
```

### Step 3: Wait for initialization

Wait 15-30 seconds for PostgreSQL to initialize.

### Step 4: Verify connection

```bash
docker exec english-lessons-maze-db psql -U playland -d english_lessons -c "SELECT 'Database ready' as status;"
```

## Database Connection Details

- **Host**: localhost
- **Port**: 5434
- **Database**: english_lessons
- **User**: playland
- **Password**: playland
- **Connection URL**: `postgres://playland:playland@localhost:5434/english_lessons?sslmode=disable`

## Management Commands

### Start database:

```bash
docker start english-lessons-maze-db
```

### Stop database:

```bash
docker stop english-lessons-maze-db
```

### View logs:

```bash
docker logs english-lessons-maze-db
```

### Remove database (delete all data):

```bash
docker stop english-lessons-maze-db
docker rm english-lessons-maze-db
docker volume rm english-lessons-maze_postgres_data
```

### Connect to database:

```bash
docker exec -it english-lessons-maze-db psql -U playland -d english_lessons
```

## Using the Management Script

If you prefer using the automated script:

```bash
# Start database (downloads if needed)
npm run db:start

# Check status
npm run db:status

# Stop database
npm run db:stop

# Reset database (delete all data)
npm run db:reset

# View logs
npm run db:logs
```

## Troubleshooting

### Port already in use:

If you get "port already in use" error, change the port mapping:

```yaml
ports:
  - '5435:5432' # Use 5435 instead of 5434
```

### Container won't start:

Check logs:

```bash
docker logs english-lessons-maze-db
```

### Connection refused:

Make sure the container is running:

```bash
docker ps | grep english-lessons-maze-db
```

### Database not ready:

Wait longer for initialization or check logs for errors.
