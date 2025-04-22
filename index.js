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

// Serve static assets with strong caching
app.use(
  express.static(path.join(__dirname, 'dist'), {
    // 1 year in ms
    maxAge: '1y',
    immutable: true, // Express >=5.x or use setHeaders for Express 4.x
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        // Always revalidate app shell
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (/\.[a-f0-9]{8,}\.(js|css|png|svg|woff2?)$/.test(filePath)) {
        // Fingerprinted assets: long, immutable cache
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }),
);

// SPA fallback: only for “clean” URLs (no file extensions)
app.get('/*', (req, res) => {
  if (path.extname(req.path)) {
    // Let missing files 404
    return res.status(404).end();
  }

  return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
