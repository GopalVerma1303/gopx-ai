# Deploy Frontend to Vercel

This guide configures the Gopx AI frontend for hosting on Vercel with the backend at **https://gopx-ai-backend.onrender.com**.

## 1. Connect repository

1. Go to [vercel.com](https://vercel.com) and sign in.
2. **Add New** → **Project** and import your `gopx-ai` Git repository.
3. Set **Root Directory** to `frontend` (this repo has frontend in a subfolder).

## 2. Environment variable

In the project **Settings → Environment Variables**, add:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://gopx-ai-backend.onrender.com` |

Apply to **Production**, **Preview**, and **Development** so all deployments use the same backend.

## 3. Deploy

Click **Deploy**. Vercel will:

- Detect Next.js and run `npm run build`
- Expose the app at your project’s URL (e.g. `https://your-project.vercel.app`)

## 4. Backend CORS (required)

Your backend on Render uses `CORS_ORIGIN`. After the frontend is live on Vercel:

1. Open your **Render** dashboard → your backend service → **Environment**.
2. Set **CORS_ORIGIN** to your Vercel URL, e.g.:
   - `https://your-project.vercel.app` (production)
   - Or `https://*.vercel.app` if you want to allow all Vercel preview URLs (less strict).
3. Redeploy the backend so the new env var is applied.

Without this, the browser will block API requests from your Vercel site.

## Summary

- **Root Directory:** `frontend`
- **Env:** `NEXT_PUBLIC_API_URL=https://gopx-ai-backend.onrender.com`
- **Backend:** CORS configured for your Vercel origin(s)
