import fs from 'fs/promises';
import path from 'path';
import { ImageFile } from '@simple-browser/shared';
import { validatePath, validateIsDirectory } from '../utils/path-validator';
import { isImageFile } from '../utils/image-filter';

/**
 * Service for listing and accessing image files
 */

export class ImageService {
  constructor(private rootDirectory: string) {}

  /**
   * List all image files in a directory
   * @param requestedPath - Relative path from root
   * @returns Array of ImageFile objects
   */
  async listImages(requestedPath: string = ''): Promise<ImageFile[]> {
    const absolutePath = validatePath(this.rootDirectory, requestedPath);
    await validateIsDirectory(absolutePath);

    const entries = await fs.readdir(absolutePath, { withFileTypes: true });
    const images: ImageFile[] = [];

    for (const entry of entries) {
      if (entry.isFile() && isImageFile(entry.name)) {
        const filePath = path.join(absolutePath, entry.name);
        const stats = await fs.stat(filePath);
        const relativePath = path.join(requestedPath, entry.name);

        images.push({
          name: entry.name,
          path: relativePath,
          size: stats.size,
          extension: path.extname(entry.name).toLowerCase(),
        });
      }
    }

    // Sort by name
    images.sort((a, b) => a.name.localeCompare(b.name));

    return images;
  }

  /**
   * Get the absolute path to an image file
   * @param requestedPath - Relative path to image file
   * @returns Absolute path to the file
   */
  async getImagePath(requestedPath: string): Promise<string> {
    const absolutePath = validatePath(this.rootDirectory, requestedPath);
    
    // Verify it exists and is a file
    const stats = await fs.stat(absolutePath);
    if (!stats.isFile()) {
      throw new Error('Path is not a file');
    }

    // Verify it's an image
    if (!isImageFile(path.basename(absolutePath))) {
      throw new Error('File is not an allowed image type');
    }

    return absolutePath;
  }
}
