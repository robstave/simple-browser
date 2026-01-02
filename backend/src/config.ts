import path from 'path';
import fs from 'fs';

/**
 * Application configuration loaded from environment variables
 * Validates required settings on startup
 */

export interface Config {
  /** Root directory to serve files from (absolute path) */
  rootDirectory: string;
  /** Server port */
  port: number;
  /** Server host */
  host: string;
  /** Node environment */
  nodeEnv: string;
  /** Log level for pino */
  logLevel: string;
  /** Allowed image file extensions */
  allowedImageExtensions: string[];
}

/**
 * Load and validate configuration from environment variables
 * @throws Error if required configuration is missing or invalid
 */
export function loadConfig(): Config {
  // Get ROOT_DIRECTORY from environment (required)
  const rootDirectory = process.env.ROOT_DIRECTORY || process.env.ROOT_DIR;
  
  if (!rootDirectory) {
    throw new Error(
      'ROOT_DIRECTORY environment variable is required. ' +
      'Please set it to the absolute path of the directory to serve.'
    );
  }

  // Resolve to absolute path
  const absoluteRootDir = path.resolve(rootDirectory);

  // Validate that the directory exists and is accessible
  try {
    const stats = fs.statSync(absoluteRootDir);
    if (!stats.isDirectory()) {
      throw new Error(`ROOT_DIRECTORY is not a directory: ${absoluteRootDir}`);
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`ROOT_DIRECTORY does not exist: ${absoluteRootDir}`);
    }
    throw new Error(`Cannot access ROOT_DIRECTORY: ${absoluteRootDir} - ${error}`);
  }

  // Parse port with validation
  const port = parseInt(process.env.PORT || '8765', 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}. Must be between 1 and 65535.`);
  }

  // Get host (default to 0.0.0.0 for container networking)
  const host = process.env.HOST || '0.0.0.0';

  // Node environment
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Log level
  const logLevel = process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug');

  // Allowed image extensions (configurable via env, with sensible defaults)
  const allowedImageExtensions = process.env.ALLOWED_IMAGE_EXTENSIONS
    ? process.env.ALLOWED_IMAGE_EXTENSIONS.split(',').map(ext => ext.trim().toLowerCase())
    : ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

  return {
    rootDirectory: absoluteRootDir,
    port,
    host,
    nodeEnv,
    logLevel,
    allowedImageExtensions,
  };
}

/**
 * Global config instance
 * Initialized once on application startup
 */
let config: Config | null = null;

/**
 * Get the application configuration
 * Loads config on first call and caches it
 */
export function getConfig(): Config {
  if (!config) {
    config = loadConfig();
  }
  return config;
}

/**
 * Reset config (mainly for testing)
 */
export function resetConfig(): void {
  config = null;
}
