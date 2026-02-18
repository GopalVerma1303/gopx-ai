# Render Deployment Guide

## Changes Made

1. ✅ Updated server to listen on `0.0.0.0` (required for Render)
2. ✅ Created `render.yaml` configuration file

## Deployment Steps on Render

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push
   ```

2. **Connect your repository to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml` and configure the service

3. **Set Environment Variables**
   - In the Render dashboard, go to your service → Environment
   - Add the following environment variables:
     - `GROQ_API_KEY`: Your Groq API key
     - `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.onrender.com` or your custom domain)
     - `PORT`: Will be automatically set by Render (you can leave this)
     - `ENABLE_KEEP_ALIVE`: `true` (enables self-ping to prevent spin-down on free tier)
     - `KEEP_ALIVE_URL`: `https://your-backend-name.onrender.com/health` (your deployed URL)

### Option 2: Manual Setup

1. **Create a new Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure the Service**
   - **Name**: `gopx-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (if deploying from monorepo root)

3. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `GROQ_API_KEY`: Your Groq API key
   - `CORS_ORIGIN`: Your frontend URL
   - `PORT`: Leave empty (Render will set this automatically)
   - `ENABLE_KEEP_ALIVE`: `true` (enables self-ping to prevent spin-down on free tier)
   - `KEEP_ALIVE_URL`: `https://your-backend-name.onrender.com/health` (your deployed URL)

## Important Notes

- **CORS_ORIGIN**: Make sure to set this to your frontend's production URL. If your frontend is also on Render, it will be something like `https://your-frontend-name.onrender.com`
- **Port**: Render automatically assigns a port via the `PORT` environment variable - your code already handles this correctly
- **Health Check**: Your `/health` endpoint will be used by Render for health checks
- **Free Tier**: The `render.yaml` is configured for the free tier. You can upgrade if needed
- **Keep-Alive (Free Tier)**: Render's free tier spins down apps after 15 minutes of inactivity. The built-in keep-alive mechanism automatically pings your server every 10 minutes to prevent spin-down. Make sure to set `KEEP_ALIVE_URL` to your deployed URL (e.g., `https://your-backend-name.onrender.com/health`)

### Alternative: External Keep-Alive Service

Instead of using the built-in self-ping, you can use an external service like [UptimeRobot](https://uptimerobot.com) (free):
1. Sign up for UptimeRobot
2. Add a new monitor
3. Set the URL to `https://your-backend-name.onrender.com/health`
4. Set the monitoring interval to 10 minutes (or 5–14 min; Render spins down after 15)
5. Disable the built-in keep-alive by setting `ENABLE_KEEP_ALIVE=false` in your Render environment variables

## Testing After Deployment

Once deployed, test your backend:
```bash
curl https://your-backend-name.onrender.com/health
```

You should see: `{"status":"ok","timestamp":"..."}`

## Updating Frontend

After deploying the backend, update your frontend's `.env.local` or production environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
```
