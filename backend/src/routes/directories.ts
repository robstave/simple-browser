import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DirectoryService } from '../services/directory-service';
import { getConfig } from '../config';

/**
 * Register directory-related routes
 */
export function registerDirectoryRoutes(server: FastifyInstance) {
  const config = getConfig();
  const directoryService = new DirectoryService(config.rootDirectory);

  /**
   * GET /api/directories/*
   * List subdirectories at the given path
   */
  server.get<{
    Params: { '*': string };
  }>('/api/directories/*', async (request: FastifyRequest<{ Params: { '*': string } }>, reply: FastifyReply) => {
    try {
      const requestedPath = request.params['*'] || '';
      
      server.log.info(`Listing directories at: ${requestedPath}`);
      
      const directories = await directoryService.listDirectories(requestedPath);
      
      return {
        path: requestedPath,
        directories,
      };
    } catch (error) {
      if (error instanceof Error) {
        server.log.error({ error: error.message }, 'Error listing directories');
        
        if (error.message.includes('Invalid path') || error.message.includes('traversal')) {
          return reply.status(403).send({
            error: 'Forbidden',
            message: 'Access denied',
          });
        }
        
        if (error.message.includes('does not exist') || error.message.includes('not accessible')) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Directory not found',
          });
        }
        
        if (error.message.includes('not a directory')) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Path is not a directory',
          });
        }
      }
      
      throw error;
    }
  });

  /**
   * GET /api/directories (root)
   * List directories at root level
   */
  server.get('/api/directories', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      server.log.info('Listing root directories');
      
      const directories = await directoryService.listDirectories('');
      
      return {
        path: '',
        directories,
      };
    } catch (error) {
      if (error instanceof Error) {
        server.log.error({ error: error.message }, 'Error listing root directories');
      }
      throw error;
    }
  });
}
