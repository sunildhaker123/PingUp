import { env } from './env.js';

export const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Normalize the incoming origin (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if origin is in allowed list (also normalize stored URLs)
    const isAllowed = env.clientUrls.some(url => 
      url.replace(/\/$/, '') === normalizedOrigin
    );

    if (isAllowed) {
      callback(null, true);
      return;
    }

    // For debugging - log rejected origins
    console.error(`[CORS] Rejected origin: ${origin}`);
    console.error(`[CORS] Allowed origins: ${env.clientUrls.join(', ')}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
