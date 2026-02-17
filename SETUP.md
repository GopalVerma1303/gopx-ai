# Quick Setup Guide

Follow these steps to get your Gopx AI chat application up and running.

## Prerequisites

1. **Install Bun** (if not already installed):
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Get a Groq API Key**:
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up or log in
   - Create an API key

## Setup Steps

### 1. Backend Setup

```bash
cd backend
bun install
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```env
GROQ_API_KEY=your_actual_api_key_here
```

### 2. Frontend Setup

```bash
cd ../frontend
bun install
cp .env.example .env.local
```

The `.env.local` file should already have the correct backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running the Application

### Option 1: Run Separately (Recommended for Development)

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

### Option 2: Use a Process Manager

You can use `concurrently` or similar tools to run both:

```bash
# Install concurrently globally
bun add -g concurrently

# Run both (from root directory)
concurrently "cd backend && bun run dev" "cd frontend && bun run dev"
```

## Verify Installation

1. Backend should be running on: http://localhost:3001
   - Test: `curl http://localhost:3001/health`

2. Frontend should be running on: http://localhost:3000
   - Open in browser and start chatting!

## Troubleshooting

### Backend Issues

- **Port already in use**: Change `PORT` in `.env`
- **Groq API errors**: Verify your API key is correct
- **CORS errors**: Check `CORS_ORIGIN` in `.env` matches frontend URL

### Frontend Issues

- **Cannot connect to backend**: Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- **Build errors**: Run `bun install` again
- **Type errors**: Ensure TypeScript is properly installed

## Next Steps

- Customize the theme colors in `frontend/app/globals.css`
- Adjust rate limits in `backend/src/middleware/rateLimiter.js`
- Change the default Groq model in `frontend/lib/api.ts`
