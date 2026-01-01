import Fastify from 'fastify';
import cors from '@fastify/cors';

const PORT = 8765;
const HOST = '0.0.0.0';

const server = Fastify({
  logger: true,
});

// Enable CORS for frontend communication
server.register(cors, {
  origin: [
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://192.168.86.28:5174'
  ],
  credentials: true,
});

// Health check endpoint
server.get('/api/health', async () => {
  return { status: 'ok', message: 'simple-browser backend running' };
});

// Hello world endpoint
server.get('/api/hello', async () => {
  return { message: 'Hello from simple-browser!' };
});

const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`Backend server listening on ${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
