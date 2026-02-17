# Gopx AI - Modern AI Chat Application

A lightweight, modern AI chat application similar to ChatGPT/Claude, built with Next.js, Express, and Groq.

## Features

### Frontend
- ✨ **Modern UI** - Clean, professional interface with Shadcn UI components
- 🎨 **Theme Toggle** - Dark/Light mode support with smooth transitions
- 🎭 **Micro Animations** - Framer Motion animations for enhanced UX
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 💬 **Real-time Streaming** - Stream AI responses for better user experience
- 📝 **Markdown Support** - Rich markdown rendering with syntax highlighting
- 🎯 **Optimized** - Lightweight and performant

### Backend
- ⚡ **Fast API** - Express.js with optimized routes
- 🔄 **Streaming Support** - Server-Sent Events for real-time responses
- 🛡️ **Rate Limiting** - Protect API from abuse
- ✅ **Error Handling** - Comprehensive error handling and validation
- 🔌 **Groq Integration** - Powered by Groq's fast AI models

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Shadcn UI** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **React Markdown** - Markdown rendering
- **Next Themes** - Theme management

### Backend
- **Express.js** - Web framework
- **Groq SDK** - AI engine
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting middleware

## Prerequisites

- **Bun** - Package manager (install from [bun.sh](https://bun.sh))
- **Node.js** - Runtime (v18 or higher)
- **Groq API Key** - Get one from [console.groq.com](https://console.groq.com)

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd gopx-ai
```

### 2. Backend Setup

```bash
cd backend
bun install
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```env
PORT=3001
GROQ_API_KEY=your_groq_api_key_here
CORS_ORIGIN=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
bun install
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
bun run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
bun run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Production Mode

**Backend:**
```bash
cd backend
bun run start
```

**Frontend:**
```bash
cd frontend
bun run build
bun run start
```

## Project Structure

```
gopx-ai/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── chatController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   └── validateRequest.js
│   │   ├── routes/
│   │   │   └── chat.js
│   │   ├── utils/
│   │   │   └── errors.js
│   │   └── index.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── chat/
│   │   │   ├── chat-interface.tsx
│   │   │   ├── chat-input.tsx
│   │   │   ├── markdown-renderer.tsx
│   │   │   └── message-bubble.tsx
│   │   ├── layout/
│   │   │   └── header.tsx
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   └── theme-provider.tsx
│   ├── hooks/
│   │   └── use-toast.ts
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── package.json
│   └── README.md
└── README.md
```

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
Non-streaming chat endpoint (fallback).

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

## Environment Variables

### Backend
- `PORT` - Server port (default: 3001)
- `GROQ_API_KEY` - Your Groq API key (required)
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:3001)

## Best Practices Implemented

- ✅ **Type Safety** - TypeScript for frontend
- ✅ **Error Handling** - Comprehensive error handling
- ✅ **Rate Limiting** - API protection
- ✅ **Input Validation** - Request validation middleware
- ✅ **Streaming** - Efficient real-time responses
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Accessibility** - ARIA labels and keyboard navigation
- ✅ **Performance** - Optimized rendering and API calls
- ✅ **Code Organization** - Clean architecture and separation of concerns

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
