import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import https from 'https';
import { chatRouter } from './routes/chat.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getAllowedOrigins, normalizeOrigin, isOriginAllowed } from './utils/cors.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ENABLE_KEEP_ALIVE = process.env.ENABLE_KEEP_ALIVE !== 'false'; // Default to true
const KEEP_ALIVE_INTERVAL = parseInt(process.env.KEEP_ALIVE_INTERVAL || '600000', 10); // Default 10 minutes (600000ms)

// Middleware
// CORS configuration
const corsOrigins = getAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin} (normalized: ${normalizeOrigin(origin)})`);
      console.log(`Allowed origins: ${corsOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check (also used for keep-alive on Render free tier)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/chat', chatRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  
  // Start keep-alive self-ping if enabled
  if (ENABLE_KEEP_ALIVE) {
    startKeepAlive();
  }
});

// Keep-alive mechanism to prevent Render free tier spin-down
// Pings /health every 10 minutes (Render spins down after 15 min). On Render you MUST set KEEP_ALIVE_URL to your
// public URL (e.g. https://your-app.onrender.com/health); pinging localhost
// does not count as incoming traffic and will not prevent spin-down.
function startKeepAlive() {
  const keepAliveUrl = process.env.KEEP_ALIVE_URL || `http://localhost:${PORT}/health`;
  const intervalMinutes = KEEP_ALIVE_INTERVAL / 60000;
  
  console.log(`🔄 Keep-alive enabled: pinging ${keepAliveUrl} every ${intervalMinutes} minutes`);
  
  // Initial ping after 30 seconds (to ensure server is ready)
  setTimeout(() => {
    pingSelf(keepAliveUrl);
  }, 30000);
  
  // Then ping every interval
  setInterval(() => {
    pingSelf(keepAliveUrl);
  }, KEEP_ALIVE_INTERVAL);
}

function pingSelf(url) {
  // Determine which protocol to use based on the URL
  const isHttps = url.startsWith('https://');
  const client = isHttps ? https : http;
  
  client.get(url, (res) => {
    const statusCode = res.statusCode;
    if (statusCode === 200) {
      console.log(`✅ Keep-alive ping successful at ${new Date().toISOString()}`);
    } else {
      console.warn(`⚠️  Keep-alive ping returned status ${statusCode}`);
    }
    res.resume(); // Consume response to free up memory
  }).on('error', (err) => {
    // Only log errors if server is likely running (not during startup)
    if (server.listening) {
      console.warn(`⚠️  Keep-alive ping failed: ${err.message}`);
    }
  });
}
