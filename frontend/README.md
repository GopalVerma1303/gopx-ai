# Gopx AI Frontend

Modern Next.js frontend for the Gopx AI chat application.

## Features

- ⚡ Next.js 14 with App Router
- 🎨 Shadcn UI components
- 🌓 Dark/Light theme toggle
- 🎭 Framer Motion animations
- 📱 Fully responsive
- 💬 Real-time streaming chat
- 📝 Markdown rendering with syntax highlighting

## Getting Started

1. Install dependencies:
```bash
bun install
```

2. Copy environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Run development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
bun run build
bun run start
```

## Project Structure

- `app/` - Next.js app directory (pages, layouts, styles)
- `components/` - React components
  - `chat/` - Chat-related components
  - `layout/` - Layout components
  - `ui/` - Shadcn UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and API client
