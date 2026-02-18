/**
 * CORS utility functions
 */

/**
 * Normalize origin by removing trailing slashes
 */
export const normalizeOrigin = (origin) => {
  if (!origin) return '';
  return origin.replace(/\/$/, '');
};

/**
 * Get allowed CORS origins from environment variable
 */
export const getAllowedOrigins = () => {
  return process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];
};

/**
 * Check if an origin is allowed
 */
export const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow requests with no origin
  
  const normalizedOrigin = normalizeOrigin(origin);
  const allowedOrigins = getAllowedOrigins();
  
  return allowedOrigins.some(allowed => normalizeOrigin(allowed) === normalizedOrigin);
};

/**
 * Set CORS headers for a response
 */
export const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  
  if (isOriginAllowed(origin)) {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  }
};
