import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { createServer } from '../src/server';
import * as path from 'path';

describe('Image Endpoints Integration Tests', () => {
  let app: FastifyInstance;
  const testRoot = path.join(__dirname, '../../test-data');

  beforeAll(async () => {
    process.env.ROOT_DIRECTORY = testRoot;
    process.env.PORT = '0'; // Random port
    process.env.HOST = '127.0.0.1';
    app = await createServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/images', () => {
    it('should return images in root directory', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/images',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('path', '');
      expect(data).toHaveProperty('images');
      expect(Array.isArray(data.images)).toBe(true);
    });

    it('should return images in art subdirectory', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/images/art',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('path', 'art');
      expect(data).toHaveProperty('images');
      expect(Array.isArray(data.images)).toBe(true);
      
      // Should have at least 2 images (jpg and png)
      expect(data.images.length).toBeGreaterThanOrEqual(2);
      
      // Check structure of image objects
      data.images.forEach((img: any) => {
        expect(img).toHaveProperty('name');
        expect(img).toHaveProperty('path');
        expect(img).toHaveProperty('size');
        expect(img).toHaveProperty('extension');
        expect(typeof img.name).toBe('string');
        expect(typeof img.path).toBe('string');
        expect(typeof img.size).toBe('number');
        expect(typeof img.extension).toBe('string');
      });
    });

    it('should filter only image files', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/images/art',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      
      // All files should have valid image extensions
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
      data.images.forEach((img: any) => {
        expect(validExtensions).toContain(img.extension.toLowerCase());
      });
      
      // .gitkeep should not be included
      const gitkeepFiles = data.images.filter((img: any) => img.name === '.gitkeep');
      expect(gitkeepFiles.length).toBe(0);
    });

    it('should return empty array for directory with no images', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/images/photos/family',
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.path).toBe('photos/family');
      expect(data.images).toEqual([]);
    });

    it('should return 404 for non-existent directory', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/images/nonexistent',
      });

      expect(response.statusCode).toBe(404);
    });

    it('should reject path traversal attempts', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/images/../etc',
      });

      expect(response.statusCode).toBe(403);
    });

    it('should reject absolute paths', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/images//etc/passwd',
      });

      expect(response.statusCode).toBe(403);
    });
  });
});
