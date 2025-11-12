/* eslint-disable no-underscore-dangle */
import express from 'express';
import rateLimit from 'express-rate-limit';
import compression from 'compression'; // optional gzip/Brotli
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Trust proxies (for Cloud Run)
app.set('trust proxy', 1);

// Compress responses
app.use(compression());

// Rate limiter (your existing config)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Muitas requisições feitas. Tente novamente mais tarde.',
    skip: (req) => req.path !== '/login',
  }),
);

// Serve static assets with carefully controlled caching
app.use(
  express.static(path.join(__dirname, 'dist'), {
    // We will control ALL Cache-Control headers via setHeaders

    setHeaders: (res, filePath) => {
      // 1. For index.html (the app shell)
      if (filePath.endsWith('index.html')) {
        // Tell browser and any CDN/proxies to always revalidate with the origin.
        // max-age=0: don't cache locally without revalidation.
        // must-revalidate: forces revalidation for shared caches (CDNs).
        // public: allows shared caches.
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }

      // 2. For Vite's cache-busted assets (e.g., main.abc1234.js, style.def5678.css)
      // These filenames change with every build, so they can be cached indefinitely.
      else if (
        /\.[a-f0-9]{8,}\.(js|css|png|svg|webp|json|map|gif|jpg|jpeg|ico|ttf|otf|eot|woff|woff2)$/.test(
          filePath,
        )
      ) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year, immutable
      }

      // 3. For other static assets that are NOT cache-busted (e.g., favicon.svg if not hashed)
      // These don't change frequently but aren't strictly immutable.
      else {
        // Cache for a moderate amount of time (e.g., 1 hour, or 1 day if very stable)
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      }
    },
  }),
);

// SPA fallback: only for “clean” URLs (no file extensions)
app.get('/*', (req, res) => {
  if (path.extname(req.path)) {
    // If it's a file extension, assume it's a static file that wasn't found
    // and let it 404 (e.g., if a hashed asset was requested but doesn't exist anymore)
    return res.status(404).end();
  }

  // Serve index.html for all other routes to enable client-side routing
  // Important: apply same cache control headers as above, or ensure this route
  // doesn't override previous headers if middleware adds them.
  // Generally, the express.static above handles /index.html.
  // This route handles fallback for /some-route where express.static couldn't find a direct match.
  // So, ensure index.html served here also gets proper headers (it will if it passes through the middleware above)
  return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000; // Cloud Run prefers PORT from environment
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
