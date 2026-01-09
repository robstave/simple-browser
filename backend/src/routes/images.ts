import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ImageService } from '../services/image-service';
import { getConfig } from '../config';

/**
 * Register image listing routes
 */
export function registerImageRoutes(server: FastifyInstance) {
  const config = getConfig();
  const imageService = new ImageService(config.rootDirectory);

  /**
   * GET /api/images/*
   * List images at the given path
   */
  server.get<{
    Params: { '*': string };
  }>('/api/images/*', async (request: FastifyRequest<{ Params: { '*': string } }>, reply: FastifyReply) => {
    try {
      const requestedPath = request.params['*'] || '';
      
      server.log.info(`Listing images at: ${requestedPath}`);
      
      const images = await imageService.listImages(requestedPath);
      
      return {
        path: requestedPath,
        images,
      };
    } catch (error) {
      if (error instanceof Error) {
        server.log.error({ error: error.message }, 'Error listing images');
        
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
   * GET /api/images (root)
   * List images at root level
   */
  server.get('/api/images', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      server.log.info('Listing root images');
      
      const images = await imageService.listImages('');
      
      return {
        path: '',
        images,
      };
    } catch (error) {
      if (error instanceof Error) {
        server.log.error({ error: error.message }, 'Error listing root images');
      }
      throw error;
    }
  });
}
