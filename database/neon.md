# Neon PostgreSQL

Use a connection string do Neon como variavel de ambiente:

```text
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/database?sslmode=require
```

Na Vercel, remova a URL antiga do Railway e cadastre `DATABASE_URL` com o valor do Neon.

O projeto tambem aceita `NEON_DATABASE_URL`, `DATABASE_PUBLIC_URL` ou `POSTGRES_URL`, mas `DATABASE_URL` deve ser o padrao.

Para desenvolvimento local, crie um `.env` na raiz com a mesma variavel.

