import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createServer } from '../src/server';
import * as path from 'path';

describe('Image Content Endpoint Integration Tests', () => {
  let app: FastifyInstance;
  const testRoot = path.join(__dirname, '../../test-data');

  beforeAll(async () => {
    process.env.ROOT_DIRECTORY = testRoot;
    process.env.PORT = '0';
    process.env.HOST = '127.0.0.1';
    app = await createServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/image-content', () => {
    it('should stream jpg image with correct content-type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/image-content/art/zQEkDxa3IzKGi5nnoicp.jpg',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('image/jpeg');
      expect(response.rawPayload.length).toBeGreaterThan(0);
    });

    it('should stream png image with correct content-type', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/image-content/art/hairless cat in the sky with diamonds.png',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('image/png');
      expect(response.rawPayload.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent image', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/image-content/art/nonexistent.jpg',
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return 400 for non-image file', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/image-content/README.txt',
      });

      expect(response.statusCode).toBe(400);
      const data = JSON.parse(response.payload);
      expect(data.message).toContain('not an image');
    });

    it('should reject path traversal attempts', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/image-content/../etc/passwd',
      });

      expect(response.statusCode).toBe(403);
    });

    it('should reject absolute paths', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/image-content//etc/passwd',
      });

      expect(response.statusCode).toBe(403);
    });

    it('should handle URL-encoded spaces in filenames', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/image-content/art/hairless%20cat%20in%20the%20sky%20with%20diamonds.png',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toBe('image/png');
    });
  });
});
