import { HealthCheckResponse } from '@simple-browser/shared';
import { createServer } from './server';
import { registerDirectoryRoutes } from './routes/directories';
import { getConfig } from './config';

// Load and validate configuration
const config = getConfig();

const PORT = config.port;
const HOST = config.host;

const server = createServer();

// Register routes
registerDirectoryRoutes(server);

// Health check endpoint
server.get('/api/health', async (): Promise<HealthCheckResponse> => {
  return { 
    status: 'ok', 
    message: 'simple-browser backend running',
    timestamp: Date.now()
  };
});

const start = async () => {
  try {
    server.log.info(`Root directory: ${config.rootDirectory}`);
    server.log.info(`Allowed image extensions: ${config.allowedImageExtensions.join(', ')}`);
    
    await server.listen({ port: PORT, host: HOST });
    console.log(`Backend server listening on ${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
