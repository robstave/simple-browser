import path from 'path';
import fs from 'fs/promises';

/**
 * Path validation utility to prevent directory traversal attacks
 * and ensure all file access is within the configured root directory
 */

/**
 * Validates that a requested path is within the allowed root directory
 * Prevents directory traversal attacks (../, absolute paths, symlinks)
 * 
 * @param rootDir - The absolute path to the root directory (from config)
 * @param requestedPath - The path requested by the client (relative or absolute)
 * @returns The normalized absolute path if valid
 * @throws Error if the path is invalid or outside root directory
 */
export function validatePath(rootDir: string, requestedPath: string): string {
  // Normalize the root directory (resolve to absolute path)
  const normalizedRoot = path.resolve(rootDir);
  
  // If requestedPath is empty or just '/', return root
  if (!requestedPath || requestedPath === '/' || requestedPath === '.') {
    return normalizedRoot;
  }
  
  // Resolve the requested path relative to the root directory
  // This automatically handles '..' and normalizes the path
  const resolvedPath = path.resolve(normalizedRoot, requestedPath);
  
  // Ensure the resolved path is within the root directory
  if (!resolvedPath.startsWith(normalizedRoot + path.sep) && resolvedPath !== normalizedRoot) {
    throw new Error('Invalid path: Directory traversal detected');
  }
  
  return resolvedPath;
}

/**
 * Validates that a path exists and is accessible
 * 
 * @param absolutePath - The absolute path to check
 * @throws Error if the path doesn't exist or isn't accessible
 */
export async function validatePathExists(absolutePath: string): Promise<void> {
  try {
    await fs.access(absolutePath);
  } catch (error) {
    throw new Error(`Path does not exist or is not accessible: ${absolutePath}`);
  }
}

/**
 * Validates that a path is a directory
 * 
 * @param absolutePath - The absolute path to check
 * @returns true if the path is a directory
 * @throws Error if the path is not a directory or doesn't exist
 */
export async function validateIsDirectory(absolutePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(absolutePath);
    if (!stats.isDirectory()) {
      throw new Error('Path is not a directory');
    }
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error('Directory does not exist');
    }
    throw error;
  }
}

/**
 * Validates that a path is a file
 * 
 * @param absolutePath - The absolute path to check
 * @returns true if the path is a file
 * @throws Error if the path is not a file or doesn't exist
 */
export async function validateIsFile(absolutePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(absolutePath);
    if (!stats.isFile()) {
      throw new Error('Path is not a file');
    }
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error('File does not exist');
    }
    throw error;
  }
}

/**
 * Validates that a file has an allowed image extension
 * 
 * @param filePath - The file path to check
 * @param allowedExtensions - Array of allowed extensions (e.g., ['.jpg', '.png'])
 * @returns true if the extension is allowed
 * @throws Error if the extension is not allowed
 */
export function validateImageExtension(filePath: string, allowedExtensions: string[]): boolean {
  const ext = path.extname(filePath).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`File extension ${ext} is not allowed`);
  }
  return true;
}
