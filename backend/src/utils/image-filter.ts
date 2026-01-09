import path from 'path';
import { getConfig } from '../config';

/**
 * Utility for filtering and validating image files
 */

/**
 * Check if a file has an allowed image extension
 * @param filename - The filename to check
 * @returns true if the file is an allowed image type
 */
export function isImageFile(filename: string): boolean {
  const config = getConfig();
  const ext = path.extname(filename).toLowerCase();
  return config.allowedImageExtensions.includes(ext);
}

/**
 * Get the list of allowed image extensions
 * @returns Array of allowed extensions (e.g., ['.jpg', '.png'])
 */
export function getAllowedExtensions(): string[] {
  const config = getConfig();
  return config.allowedImageExtensions;
}

/**
 * Filter a list of filenames to only include images
 * @param filenames - Array of filenames to filter
 * @returns Array of filenames that are images
 */
export function filterImageFiles(filenames: string[]): string[] {
  return filenames.filter(isImageFile);
}
