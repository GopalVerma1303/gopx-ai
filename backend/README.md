# Gopx AI Backend

Express.js backend API for the Gopx AI chat application, powered by Groq.

## Features

- ⚡ Express.js server
- 🔄 Streaming support (Server-Sent Events)
- 🛡️ Rate limiting
- ✅ Request validation
- 🔌 Groq AI integration

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your Groq API key:
```env
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
CORS_ORIGIN=http://localhost:3000
```

4. Run development server:
```bash
bun run dev
```

5. Server will start on http://localhost:3001

## API Endpoints

### POST `/api/chat/stream`
Stream chat response from Groq.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "model": "llama-3.1-8b-instant"
}
```

**Response:** Server-Sent Events stream

### POST `/api/chat`
Non-streaming chat endpoint.

**Request:** Same as above

**Response:**
```json
{
  "content": "Hello! How can I help you?",
  "model": "llama-3.1-8b-instant",
  "usage": { ... }
}
```

### GET `/health`
Health check endpoint.

## Project Structure

- `src/`
  - `controllers/` - Request handlers
  - `middleware/` - Express middleware
  - `routes/` - API routes
  - `utils/` - Utility functions
  - `index.js` - Server entry point
