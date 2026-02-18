# kai-chat-gateway

Fastify-based model gateway for the website chat drawer.

## Features
- Unified `Gemini` + `Anthropic` chat interface.
- Persona layer (`kai-v1`) with stable prompt contract.
- Streaming endpoint (`/v1/chat/stream`) for frontend typing UX.
- Rate limiting and CORS guardrails.

## Endpoints
- `GET /health`
- `GET /v1/persona/kai`
- `POST /v1/chat`
- `POST /v1/chat/stream`

## Quick Start
```bash
cd services/kai-chat-gateway
npm install
npm run dev
```

## Environment
```bash
PORT=8787
HOST=0.0.0.0
ALLOWED_ORIGINS=https://kateiso.dev,http://localhost:4321
RATE_LIMIT_MAX=20
RATE_LIMIT_WINDOW=10 minutes
ENABLE_PROVIDER_FALLBACK=true

ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...
```

## Frontend Wiring
Set `PUBLIC_CHAT_API_BASE` in the Astro site environment to the gateway base URL.
