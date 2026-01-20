##Connection Pooling (pg.Pool) Instead of opening a new connection for every request, we use a Pool.

Efficiency: It reuses a fixed set of connections, significantly reducing latency and server overhead.

Stability: It prevents the application from overwhelming the PostgreSQL server with too many concurrent requests.

## Security & Environment Variables (.env)

Credential Safety: Sensitive data (DB_PASSWORD, DB_USER) is stored in a .env file, which is ignored by Git (.gitignore). This prevents leaking secrets in version control.

Flexibility: Allows the app to switch between dev, test, and prod databases without changing the actual source code.