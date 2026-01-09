import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ImageService } from '../services/image-service';
import { getConfig } from '../config';
import fs from 'fs';
import path from 'path';

/**
 * Register image content streaming routes
 */
export function registerImageContentRoutes(server: FastifyInstance) {
  const config = getConfig();
  const imageService = new ImageService(config.rootDirectory);

  /**
   * GET /api/image-content/*
   * Stream an image file
   */
  server.get<{
    Params: { '*': string };
  }>('/api/image-content/*', async (request: FastifyRequest<{ Params: { '*': string } }>, reply: FastifyReply) => {
    try {
      const requestedPath = request.params['*'] || '';
      
      if (!requestedPath) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Image path is required',
        });
      }
      
      server.log.info(`Streaming image: ${requestedPath}`);
      
      const absolutePath = await imageService.getImagePath(requestedPath);
      
      // Get file extension for content-type
      const ext = path.extname(absolutePath).toLowerCase();
      const contentTypeMap: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
      };
      
      const contentType = contentTypeMap[ext] || 'application/octet-stream';
      
      // Stream the file
      const stream = fs.createReadStream(absolutePath);
      
      reply.type(contentType);
      return reply.send(stream);
      
    } catch (error) {
      if (error instanceof Error) {
        server.log.error({ error: error.message }, 'Error streaming image');
        
        if (error.message.includes('Invalid path') || error.message.includes('traversal')) {
          return reply.status(403).send({
            error: 'Forbidden',
            message: 'Access denied',
          });
        }
        
        if (error.message.includes('does not exist') || error.message.includes('not accessible') || error.message.includes('ENOENT')) {
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Image not found',
          });
        }
        
        if (error.message.includes('not a file') || error.message.includes('not an allowed image')) {
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Invalid image file',
          });
        }
      }
      
      throw error;
    }
  });
}
