# FinTraQ Auth Backend (Node + Express + MongoDB)

Secure JWT-based auth service for FinTraQ.

## Setup

1. Create `.env` from sample:

```powershell
Copy-Item .env.example .env
```

2. Install dependencies:

```powershell
cd "c:\Users\abc\VS Code\FinTraQ\backend-node"
npm install
```

3. Start the server:

```powershell
npm run dev
```

Server will run on `http://localhost:5001`.

## Environment variables
- `PORT`: default `5001`
- `CORS_ORIGIN`: e.g. `http://localhost:3000`
- `MONGO_URI`: Mongo connection string
- `FASTAPI_URL`: URL of existing FastAPI API, default `http://127.0.0.1:8000`
- `ACCESS_TOKEN_SECRET`: long random string
- `ACCESS_TOKEN_TTL`: default `15m`
- `REFRESH_TOKEN_TTL_DAYS`: default `7`

## Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `GET  /api/protected/ping`
- Proxied (protected): `/api/categories`, `/api/transactions`

Refresh tokens are stored as httpOnly cookies with SameSite=Lax and Secure in production. Access tokens expire quickly; refresh tokens are rotated.