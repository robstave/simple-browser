import { HealthCheckResponse } from '@simple-browser/shared';
import { createServer } from './server';

const PORT = parseInt(process.env.PORT || '8765', 10);
const HOST = process.env.HOST || '0.0.0.0';

const server = createServer();

// Health check endpoint
server.get('/api/health', async (): Promise<HealthCheckResponse> => {
  return { 
    status: 'ok', 
    message: 'simple-browser backend running',
    timestamp: Date.now()
  };
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
