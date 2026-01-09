import fs from 'fs/promises';
import path from 'path';
import { DirectoryEntry } from '@simple-browser/shared';
import { validatePath, validateIsDirectory } from '../utils/path-validator';

/**
 * Service for scanning and listing directories
 * Provides read-only access to the filesystem within the configured root
 */

export class DirectoryService {
  constructor(private rootDirectory: string) {}

  /**
   * List directories in a given path
   * Only returns subdirectories, not files
   * 
   * @param requestedPath - Relative path from root
   * @returns Array of DirectoryEntry objects
   */
  async listDirectories(requestedPath: string = ''): Promise<DirectoryEntry[]> {
    // Validate and resolve the path
    const absolutePath = validatePath(this.rootDirectory, requestedPath);
    
    // Ensure it's a directory
    await validateIsDirectory(absolutePath);

    // Read directory contents
    const entries = await fs.readdir(absolutePath, { withFileTypes: true });

    // Filter for directories only and map to DirectoryEntry
    const directories: DirectoryEntry[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Calculate relative path from root
        const entryPath = path.join(requestedPath, entry.name);
        
        directories.push({
          name: entry.name,
          path: entryPath,
          isDirectory: true,
          // children will be loaded lazily
        });
      }
    }

    // Sort alphabetically
    directories.sort((a, b) => a.name.localeCompare(b.name));

    return directories;
  }

  /**
   * Get a single directory entry with its immediate children
   * Used for lazy loading in the tree
   * 
   * @param requestedPath - Relative path from root
   * @returns DirectoryEntry with children populated
   */
  async getDirectoryWithChildren(requestedPath: string = ''): Promise<DirectoryEntry> {
    const absolutePath = validatePath(this.rootDirectory, requestedPath);
    await validateIsDirectory(absolutePath);

    const children = await this.listDirectories(requestedPath);

    return {
      name: path.basename(absolutePath) || 'root',
      path: requestedPath,
      isDirectory: true,
      children,
    };
  }

  /**
   * Check if a directory exists and is accessible
   * 
   * @param requestedPath - Relative path from root
   * @returns true if directory exists
   */
  async directoryExists(requestedPath: string): Promise<boolean> {
    try {
      const absolutePath = validatePath(this.rootDirectory, requestedPath);
      await validateIsDirectory(absolutePath);
      return true;
    } catch {
      return false;
    }
  }
}
