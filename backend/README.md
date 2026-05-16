# Backend Node da confeitaria

API em Express + Sequelize + Postgres para substituir o backend Spring.

## Rodar localmente

1. Instale as dependencias:

```bash
cd backend
npm install
```

2. Crie o arquivo `.env` baseado em `.env.example`.

3. Suba o Postgres e rode:

```bash
npm run dev
```

Por padrao a API sobe em `http://localhost:8080`.

## Endpoints principais

- `POST /auth/login`
- `POST /auth/change-password`
- `GET /produtos`
- `POST /produtos`
- `PUT /produtos/:id`
- `DELETE /produtos/:id`
- `POST /imagens/upload`
- `GET /pedidos`
- `POST /pedidos`
- `PATCH /pedidos/:id`
- `GET /imagens-home`
- `PUT /imagens-home`
