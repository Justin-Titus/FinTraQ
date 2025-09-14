import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middleware/auth.js';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();

// Security & parsing
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Attach a request ID to every request and log basic info
app.use((req, _res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID();
  // Attach to response for clients too
  _res.setHeader('X-Request-Id', req.id);
  console.log(`[${req.id}] ${req.method} ${req.originalUrl}`);
  next();
});

// CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// Mongo
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fintraq';
mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

// Routes
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);

// Example protected route (can proxy to FastAPI if desired)
app.get('/api/protected/ping', authMiddleware, (req, res) => {
  res.json({ message: 'pong', user: req.user });
});

// Protect and proxy categories/transactions to existing FastAPI
const FASTAPI_TARGET = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';
const TENANT_PREFIX = process.env.TENANT_DB_PREFIX || 'fintraq_';

const proxyOptions = {
  target: FASTAPI_TARGET,
  changeOrigin: true,
  pathRewrite: (path) => path, // keep same path
  onProxyReq: (proxyReq, req) => {
    // When authenticated, add X-Tenant-DB header per user
    if (req.user?.sub) {
      const tenantDb = `${TENANT_PREFIX}${req.user.sub}`;
      proxyReq.setHeader('X-Tenant-DB', tenantDb);
    }
    // Forward request id to FastAPI for tracing
    if (req.id) {
      proxyReq.setHeader('X-Request-Id', req.id);
    }
    // Re-write JSON body if present (express.json() has already parsed it)
    if (
      req.body &&
      typeof req.body === 'object' &&
      (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE')
    ) {
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const bodyData = Buffer.from(JSON.stringify(req.body));
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  },
};

app.use('/api/categories', authMiddleware, createProxyMiddleware(proxyOptions));
app.use('/api/transactions', authMiddleware, createProxyMiddleware(proxyOptions));

const port = parseInt(process.env.PORT || '5001', 10);
app.listen(port, () => console.log(`Auth server listening on :${port}`));
