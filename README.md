# Avis AI — Multi-Agent AI Platform

![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-22-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Redis](https://img.shields.io/badge/Redis-Session-red)
![LangChain](https://img.shields.io/badge/LangChain-LangGraph-orange)

A multi-agent AI assistant that routes user requests to specialized agents (chat, coding, search, vision, PPT, PDF) through a unified interface.

## Features

- **Multi-Agent Routing** — Intelligent routing to specialized agents
- **Conversation Management** — Persistent chat history
- **Google OAuth** — Firebase-based authentication
- **Artifact System** — Downloadable generated content
- **Session Management** — Redis-based sessions with 7-day TTL

## Tech Stack

**Frontend:** React 19, Vite 6, Tailwind CSS v4, Redux Toolkit, Firebase SDK

**Backend:** Node.js + Express (4 microservices), MongoDB/Mongoose, Redis, LangChain/LangGraph

**AI:** Groq (openai/gpt-oss-120b), Google Gemini 2.5 Flash

## Quick Start

### Prerequisites
- Node.js >= 22.x
- MongoDB (local or Atlas)
- Redis
- Firebase project with Google OAuth
- Groq API key
- Google Generative AI API key

### Installation

```bash
# Install dependencies
cd cortexAI/backend/gateway && npm install
cd ../../frontend && npm install

# Setup Redis
docker run -d -p 6379:6379 redis:alpine
```

### Running the Application

```bash
# Terminal 1: Auth Service
cd cortexAI/backend/services/auth && npm run dev

# Terminal 2: Chat Service
cd cortexAI/backend/services/chat && npm run dev

# Terminal 3: Agent Service
cd cortexAI/backend/services/agent && npm run dev

# Terminal 4: Gateway
cd cortexAI/backend/gateway && npm run dev

# Terminal 5: Frontend
cd cortexAI/frontend && npm run dev
```

Open `http://localhost:5173`

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├── Google OAuth → Firebase
       │
       ├── Chat Messages
       │       │
       │       ▼
       │   ┌────────┐
       │   │ Gateway│ (Port 8000)
       │   └───┬────┘
       │       │
       │   ┌───┴────────┐
       │   │            │
       │   ▼            ▼
       │ ┌──────┐   ┌────────┐
       │ │ Auth │   │ Agent  │
       │ │ 8001 │   │  8003  │
       │ └──────┘   └───┬────┘
       │                │
       │           ┌────┴────┐
       │           │         │
       │           ▼         ▼
       │      ┌───────┐ ┌──────┐
       │      │ Chat  │ │Redis │
       │      │ 8002  │ └──────┘
       │      └───┬───┘
       │          │
       │          ▼
       │      MongoDB
       │
       └──────────────────
```

## Agent Routing

The router classifies prompts and routes to specialized agents:

- **chat** — General conversation, explanations, simple code
- **coding** — Complex code generation, debugging, architecture
- **search** — Current events, latest information
- **vision** — Image generation and analysis
- **ppt** — PowerPoint generation
- **pdf** — PDF analysis

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login with Firebase token |
| GET | /api/me | Get current user |
| POST | /api/chat/create-conversation | Create conversation |
| GET | /api/chat/get-conversations | List conversations |
| POST | /api/agent/chat | Send prompt to agent |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

---

**Built with ❤️ using React, Node.js, LangChain, and MongoDB**