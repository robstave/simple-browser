/**
 * Typed API client for communicating with the backend
 * Provides type-safe fetch wrappers and error handling
 */

import type { DirectoryEntry, ImageFile } from '@simple-browser/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8765';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  response?: unknown;

  constructor(
    message: string,
    statusCode: number,
    response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchJson<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Parse JSON response
    const data = await response.json();

    // Check if response was successful
    if (!response.ok) {
      throw new ApiError(
        data.message || data.error || 'API request failed',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or parsing error
    if (error instanceof Error) {
      throw new ApiError(
        `Network error: ${error.message}`,
        0,
        error
      );
    }

    throw new ApiError('Unknown error occurred', 0);
  }
}

/**
 * Fetch image as a blob URL
 */
async function fetchImage(endpoint: string): Promise<string> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError(
        'Failed to fetch image',
        response.status
      );
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(
        `Network error: ${error.message}`,
        0,
        error
      );
    }

    throw new ApiError('Unknown error occurred', 0);
  }
}

/**
 * API client methods
 */
export const api = {
  /**
   * Health check endpoint
   */
  health: async () => {
    return fetchJson<{ status: string; message: string; timestamp: number }>(
      '/api/health'
    );
  },

  /**
   * Get directory listing
   * @param path - Directory path (relative to root)
   */
  getDirectories: async (path: string = '') => {
    const encodedPath = encodeURIComponent(path);
    const endpoint = path ? `/api/directories/${encodedPath}` : '/api/directories';
    return fetchJson<{ path: string; directories: DirectoryEntry[] }>(endpoint);
  },

  /**
   * Get images in a directory
   * @param path - Directory path (relative to root)
   */
  getImages: async (path: string = '') => {
    const encodedPath = encodeURIComponent(path);
    const endpoint = path ? `/api/images/${encodedPath}` : '/api/images';
    return fetchJson<{ path: string; images: ImageFile[] }>(endpoint);
  },

  /**
   * Get image content as blob URL
   * @param path - Image file path (relative to root)
   */
  getImageContent: async (path: string) => {
    const encodedPath = encodeURIComponent(path);
    return fetchImage(`/api/image-content/${encodedPath}`);
  },
};

/**
 * Export API base URL for reference
 */
export { API_BASE_URL };
