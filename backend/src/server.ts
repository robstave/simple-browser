import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

/**
 * Create and configure Fastify server
 * Includes CORS, security headers, error handling, and logging
 */
export function createServer(): FastifyInstance {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    },
    // Disable request logging for static assets
    disableRequestLogging: false,
  });

  // Register helmet for security headers
  server.register(helmet, {
    // Customize CSP for development (allows inline scripts for dev tools)
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    // Allow cross-origin for images (needed for serving images)
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });

  // Register CORS plugin
  server.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        cb(null, true);
        return;
      }

      // Allow localhost and common development ports
      const allowedOrigins = [
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];

      // Allow if origin matches or in production allow configured origins
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Global error handler
  server.setErrorHandler((error, request: FastifyRequest, reply: FastifyReply) => {
    // Type guard for Error objects
    const err = error as Error & { statusCode?: number };
    
    server.log.error({
      error: {
        message: err.message,
        stack: err.stack,
      },
      request: {
        method: request.method,
        url: request.url,
      }
    }, 'Request error');

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    // Handle specific error types
    if (err.message.includes('Invalid path') || err.message.includes('Directory traversal')) {
      return reply.status(403).send({
        error: 'Forbidden',
        message: 'Access denied: Invalid path',
      });
    }

    if (err.message.includes('does not exist') || err.message.includes('not accessible')) {
      return reply.status(404).send({
        error: 'Not Found',
        message: 'The requested resource was not found',
      });
    }

    if (err.message.includes('not a directory') || err.message.includes('not a file')) {
      return reply.status(400).send({
        error: 'Bad Request',
        message: 'Invalid resource type',
      });
    }

    // Default error response
    reply.status(err.statusCode || 500).send({
      error: err.name || 'Internal Server Error',
      message: isDevelopment ? err.message : 'An error occurred processing your request',
      ...(isDevelopment && { stack: err.stack }),
    });
  });

  // 404 handler for unknown routes
  server.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.status(404).send({
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
    });
  });

  // Add request logging hook
  server.addHook('onRequest', async (request) => {
    request.log.info({
      method: request.method,
      url: request.url,
    }, 'Incoming request');
  });

  // Add response logging hook
  server.addHook('onResponse', async (request, reply) => {
    request.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
    }, 'Request completed');
  });

  return server;
}
